---
layout: "post"
article_page_id: "3510f85d-e690-8132-993a-f96c45bf0366"
title: "【AI面试八股文 Vol.1.2 | 专题5】不是代码写错，是Harness漏了：GCP部署Agent loop必问的12个工程节点"
description: "这轮面试里agent framework八股文正在从「会背概念」进化到「能讲清楚工程细节」——GCP上跑一个agent loop，本地跑通和生产能跑之间隔着一整层 harness engineering。"
categories:
  - "AI面试八股文 Vol.1.2"
  - "专题5"
tags:
  - "Harness Engineering"
  - "agent loop生命周期"
  - "LangGraph StateGraph"
  - "GCP Cloud Run"
  - "quota guard"
  - "human-in-the-loop"
  - "Vol.1.2"
  - "Loop"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/29/ai面试八股文-vol12-专题5不是代码写错是harness漏了gcp部署agent-loop必问的12个工程节点/"
img: "https://iili.io/BiLPxmg.png"
swiperImg: "https://iili.io/BiLPxmg.png"
permalink: "posts/2026/04/29/ai面试八股文-vol12-专题5不是代码写错是harness漏了gcp部署agent-loop必问的12个工程节点/"
date: "2026-04-29 12:54:00"
updated: "2026-04-29 13:06:00"
cover: "https://iili.io/BiLPxmg.png"
---

你在本地用Claude Code写了一个完整的agent loop，跑了三遍demo全过。提交PR那天，reviewer问了一句：「线上Cold Start超过5秒怎么兜？

quota超了loop没停怎么办？GKE重启后状态恢复路径是什么？」三连问下去，你发现本地那个跑通的版本，只是一张草稿——离工程交付还差一套harness。

这不是你一个人的卡点。

2025年底开始，AI面试里关于agent framework的问题正在从「你知道哪些框架」升级到「你能讲清楚 harness engineering的工程细节」——Harness Engineering这个词最早由Martin Fowler在2025年Q3那篇关于AI agents的博文里系统提出来，核心论点只有一个：Agent = Model + Harness，而Harness才是工程复杂度的真正所在 [Martin Fowler - Harness Engineering for AI Agents](https://martinfowler.com/articles/harness-engineering-ai-agents.html)。

OpenAI、Anthropic、Google都在内部大规模落地这套框架，Cursor 3的agent-first产品界面、Claude Code的harness架构、Claude Managed Agents的企业级部署，都在做同一件事：把「把模型包进一套执行治理系统」这件事工程化。

这篇专题要解决的，就是这道正在被高频追问的工程题：GCP上跑一个agent loop，从状态机建模到生命周期管理，到底有哪些关键节点，面试时怎么把工程决策讲清楚。

## 一、为什么 GCP 上 agent loop 是个工程问题

### 1.1 本地跑通 ≠ 生产环境能跑

本地开发agent loop，开发者面对的是一个可控的、状态全在内存里的单机环境：模型响应时间稳定、工具调用无网络开销、状态变更即时生效、loop退出条件清晰。

这种环境天然适合快速迭代——你写一段推理逻辑，调一下prompt参数，跑个端到端demo，30分钟能过三轮。

但GCP生产环境完全不是这回事。

第一个变量是冷启动延迟。Cloud Run在请求稀疏时会销毁容器实例，下次触发时需要重新拉取镜像、加载模型、初始化状态。

根据2026年4月的Cloud Run官方文档，冷启动时间在无容器优化的情况下可达数百毫秒到数秒级别 [Cloud Run Cold Starts - Google Cloud Documentation](https://cloud.google.com/run/docs/startコンテナ)。

对agent loop来说，这意味着每次「重启」都要重新走一遍初始化阶段，如果checkpoint恢复路径没有搭好，用户会感知到一个状态丢失的空白窗口。

第二个变量是网络往返。工具调用不再是无开销的本地函数调用，而是通过HTTP/gRPC访问外部API，RTT（Round-Trip Time）从本地毫秒级跳到公网几十毫秒甚至更高。

这直接影响了loop的整体响应时间和token消耗预估——本地估算一次完整loop消耗500 tokens，生产环境可能因为重试和等待变成1200 tokens。

第三个变量是状态持久化边界。

本地内存的状态在进程重启后全部丢失，GCP上如果Pod被调度迁移或者Cloud Run实例被缩容，你需要主动设计checkpoint机制才能保证状态不丢。

这不是可选的「锦上添花」，而是生产级agent系统的基本要求。

![](https://iili.io/B40Fohv.png)
> 本地跑通了，线上凉了——这个坑有多少人踩过

### 1.2 Agent = Model + Harness：这个公式在 GCP 语境下的含义

Martin Fowler在2025年那篇博文里给Harness Engineering下了一个简洁的定义：Harness是包裹在模型外面的执行与治理系统，它决定了agent如何感知、如何决策、如何行动、如何在失控时退出 [Martin Fowler - Harness Engineering for AI Agents](https://martinfowler.com/articles/harness-engineering-ai-agents.html)。

公式很简单：Agent = Model + Harness，但GCP语境下，这个「+」号两边的工程量完全不对等。

Model这一侧在GCP上有成熟方案：Vertex AI提供了Claude API的官方接入（通过Anthropic与Google的合作伙伴关系），模型推理本身托管在Google的基础设施上，开发者不需要自己维护模型服务。

但Harness这一侧，是Google没有帮你做的那部分：状态管理、工具编排、错误重试、quota控制、human-in-the-loop、checkpoint持久化、可观测性集成。

把这些拼在一起，才是GCP上能跑的生产级agent loop。换句话说，如果你只会调用API和写prompt，你在本地能跑一个「玩具agent」；

只有把harness的每一层都设计清楚，你才有一个GCP上能交付的「工程agent」。

### 1.3 面试官真正在问的是什么：harness engineering 的工程复杂度

回到面试场景。面试官出一道「描述你实现过的agent loop」，候选人通常会这样回答：「我用一个while循环让agent不断调用工具，直到任务完成。

」这个答案能过初筛，但接下来的追问会让它原形毕露：「loop的退出条件怎么判断？如果模型在推理阶段超时，状态有没有保存？quota超了你怎么处理？

GCP上Cold Start期间loop停了谁来管？」

这些追问不是刁难，它们指向的是同一个核心问题：这个候选人对agent loop的工程复杂度有没有认知。说得更直白一点，面试官在筛的是：你是在「用框架搭demo」，还是在「设计生产系统」。

Harness Engineering的本质是系统架构能力：状态机的设计边界在哪里、容错策略的分类与优先级怎么定、可观测性怎么埋点、部署模型的选型依据是什么。

这四个维度，在GCP上各自有不同的实现路径——这就是接下来几节要展开的内容。

## 二、LangGraph StateGraph：loop 的状态机结构

### 2.1 StateGraph 如何建模 agent loop

LangGraph是LangChain团队推出的low-level agent orchestration框架，核心抽象是「用状态机建模agent的推理与行动过程」 [LangGraph - Agent Orchestration Framework for Reliable AI Agents](https://www.langchain.com/langgraph)。

这句话听起来很学术，但它的实际含义非常具体：你不是在写一个「循环调用模型的函数」，你是在定义一个状态图，其中每个节点代表一个agent会进入的状态，每条边代表状态之间的合法转换。

在LangGraph里，一个典型的agent loop用StateGraph建模后，结构大概长这样：

![正文图解 1](https://iili.io/BiLyozB.png)
> 正文图解 1

这个图的含义是：agent从Start进入Initialize阶段（加载GCP资源、恢复checkpoint），然后进入Reason阶段（调用模型推理），推理结果决定是否进入Act阶段（执行工具调用）还是直接终止。

如果进入Act阶段，结果会通过Observe阶段更新到状态里，然后系统判断是否满足退出条件：满足则到End，不满足则回到Reason继续loop。

Human-in-the-Loop是一个特殊的拦截节点，可以在任意关键决策点暂停，把控制权交回给人类。

这就是LangGraph StateGraph的核心逻辑：loop不是「for i in range(n)」，而是由状态转换规则驱动的条件回环。

你可以精确控制哪些转换是合法的、在哪个节点允许human介入、退出条件如何判定。

![](https://iili.io/BreqZR2.png)
> 状态机不会跑丢，for循环真的会

### 2.2 State、Reducer、Transition：三个核心概念的关系

StateGraph有三个核心概念，理解它们之间的关系是讲清楚agent loop工作原理的前提。

**State**是贯穿整个loop的共享数据结构。

你可以把它理解成一个贯穿整个agent运行生命周期的「黑板」——每经过一个节点，State会被更新一次，新值覆盖旧值，或者按你定义的规则合并。

State的定义通常是一个Pydantic模型，包含所有你在loop过程中需要追踪的字段。

**Reducer**定义的是State的更新规则。这是LangGraph里最容易被候选人忽略、但面试官最爱追问的概念。默认情况下，State的更新是覆盖式的——新值直接替换旧值。

但你可以通过自定义reducer让State的更新变成追加式的（比如messages字段，新消息不是覆盖旧消息，而是append到列表里）。

如果你没有搞清楚reducer的行为，面试官问「为什么你的messages字段在loop过程中丢了一半的历史记录」，你就会卡住。

**Transition**是状态节点之间的转换规则。在LangGraph里，节点之间的转换有两种模式：

第一种是**正常转换**（Normal Edges），从节点A执行完毕后自动进入节点B，没有任何条件判断。

第二种是**条件转换**（Conditional Edges），从节点A出来后需要根据当前State的内容决定下一步走向哪里。

条件转换是实现loop退出逻辑的关键：你可以在Condition函数里写「如果iterations >= max_iterations，返回End节点」，这样loop在达到最大迭代次数后自然退出。

三个概念串起来的故事是这样的：State是数据，Reducer是写入规则，Transition是导航规则。

数据在节点之间流转，每个节点修改State（受Reducer控制），导航规则根据State的内容决定下一步去哪里——这就是一个完整的状态机。

### 2.3 Checkpoint 机制：状态持久化的实现路径

Checkpoint是LangGraph解决「状态跨进程持久化」问题的机制。

它的核心思想是：在每个状态转换的边界点，把当前State序列化后存到一个持久化存储里（Cloud Storage、Firestore、PostgreSQL都可以）。

如果进程重启，系统可以从最近的checkpoint恢复，而不是从零开始。

这个机制在GCP上格外重要。Cloud Run的容器实例可能在请求间隔被缩容销毁，GKE的Pod可能因为资源调度发生迁移。

在这些场景下，没有checkpoint的agent loop会表现为「任务被重置」，用户体验是灾难性的：你让agent帮你写一段代码，它跑了三步之后实例被缩容，状态全丢了，用户需要重新描述任务。

checkpoint的持久化路径在GCP上有两种主流选择：

**Cloud Storage + 自定义序列化**：在每次状态转换后把State dump成JSON，写入GCS bucket。

恢复时从GCS读取最新checkpoint文件，反序列化后灌回StateGraph。这种方案实现简单，成本低，适合对恢复延迟要求不高的场景。

缺点是每次写入都有GCS API的延迟开销（通常在几十毫秒量级），对延迟敏感的loop需要注意这个overhead。

**Firestore + LangGraph内置checkpoint**：LangGraph的persistence层支持Firestore作为checkpoint存储。

相比GCS方案，Firestore的优势是支持实时读取和增量更新，恢复延迟更低（毫秒级），适合需要快速故障恢复的场景。

代价是Firestore的读写成本比GCS高，需要评估checkpoint频率和存储量之间的成本模型。

面试时如果被问到checkpoint的实现细节，核心要讲清楚两件事：保存频率（每个状态转换后保存，还是只在关键节点保存）和恢复策略（冷启动时从checkpoint恢复，还是接受从零开始）。

这两个决策直接影响系统的可靠性与成本。

![](https://iili.io/qyuHPNp.png)
> 没写checkpoint的PR，reviewer看到就想打回

### 2.4 为什么说 agent loop 不是 for 循环，而是一个状态机

这是本专题最值得单独强调的一个认知翻转。很多候选人写agent loop的方式是：

```python
for i in range(max_iterations):
    response = model.invoke(prompt)
    if is_task_complete(response):
        break
    tool_result = call_tool(response)
    prompt += tool_result
```

这段代码逻辑上能跑，但它有一个根本性问题：**它把loop的「导航逻辑」混进了「业务逻辑」里**。

退出条件、超时处理、human-in-the-loop这些横切关注点全塞进了一个for循环，当loop的行为需要调整时（比如加一个条件分支、在某个节点插入人工审批），你只能修改for循环的主体，代码会迅速腐化。

状态机的视角完全不同：导航逻辑和业务逻辑是分离的。

State定义数据模型，Reducer定义写入规则，Transition定义导航规则，节点函数只负责「当前状态 + 输入 → 输出」的局部计算。

你可以把StateGraph看成一个「可视化的工作流引擎」，它的每个节点都可以独立开发、独立测试、独立替换。

对于面试来说，这个认知差距的意义在于：当你能够从状态机的角度描述agent loop，面试官会认为你理解的是「系统设计层面的东西」，而不是「调API写循环」。

这两个层次在Senior/Staff级面试里的评分差异，可能是hire还是strong hire的区别。

## 三、agent loop 生命周期六阶段拆解

### 3.1 阶段一：初始化——GCP 资源预热与状态加载

初始化阶段是整个agent loop里最容易被低估的阶段。本地开发时，初始化就是import几个包、new一个client对象，几乎不花时间。

但在GCP上，初始化阶段要处理三件生产级的事情：GCP资源准备、checkpoint恢复（如果有）和harness组件的组装。

**GCP资源准备**指的是Secret Manager读取API密钥、确认Cloud Storage bucket路径、验证IAM权限、初始化Vertex AI或Claude API客户端。

每个操作的RTT都在几十到几百毫秒，如果串行执行，初始化阶段可能占用数百毫秒到数秒——这直接加到了用户感知的响应时间里。

对于需要快速冷启动的agent系统，初始化阶段的优化是值得做的：可以把GCP资源的初始化结果缓存住（比如在Cloud Run的实例生命周期内复用同一个API client），减少每次请求的初始化开销。

**checkpoint恢复**在前文已经讨论过。初始化阶段需要判断是否从checkpoint恢复：如果有可用的checkpoint，从存储里加载状态；

如果没有（首次运行或者checkpoint已过期），从空的State开始。

判断逻辑通常落在「checkpoint是否存在且未过期」这个条件上——这里要注意checkpoint的有效期设计，既不能太短（频繁重新初始化），也不能太长（占用过多存储且恢复状态可能过时）。

**harness组件组装**指的是把prompt模板、工具定义、retry策略、quota guard这些配置加载进来，组装成一个完整的StateGraph。

这些配置在本地开发时通常是硬编码在代码里的，但生产环境推荐从Cloud Storage或者Secret Manager动态加载，支持不重新部署就能调整prompt或工具列表——这在A/B测试和热更新场景下非常重要。

面试时描述初始化阶段，重点要讲清楚的是：你有没有意识到这个阶段有性能问题，你做了什么优化，以及checkpoint恢复的判断逻辑是什么。

### 3.2 阶段二：推理——Vertex AI / Claude API 调用与 token 预算

推理阶段是agent loop的计算核心，调用大模型生成下一步的指令或回答。

在GCP上有两条主要路径：通过Vertex AI调用Gemini系列模型，或者通过Anthropic官方API（绕道或者通过Google的集成方案）调用Claude。

无论哪条路径，这个阶段有三个工程关注点：延迟、token消耗和可观测性。

**延迟**方面，模型推理是整个loop里耗时最长的环节。一次Claude 3.5 Sonnet的推理（带完整思考过程）在正常网络条件下，端到端延迟通常在1-5秒量级。

这个延迟直接决定了用户体验——如果你的agent loop需要跑20次推理才能完成任务，用户等待时间就是20-100秒，这在很多场景下是不可接受的。

面试时可以聊的优化方向包括：streaming响应（让用户看到推理进度）、模型降级策略（简单任务用小模型）、推理缓存（相同prompt避免重复调用）。

**Token消耗**是GCP上最需要主动管理的资源。

每个模型的context window有限（Claude 3.5 Sonnet是200K tokens，Gemini 1.5 Pro最高支持2M tokens），但更关键的约束是成本。

2026年Claude API的定价大约是输入$3/MTokens、输出$15/MTokens（具体价格以官方文档为准）。

对于一个可能跑几十、上百次推理的agent loop，如果不做任何控制，token消耗可以在几分钟内爆炸式增长。

这就是为什么quota guard必须作为一个独立模块在推理阶段前面挡着——它检查当前消耗是否超过预算，超过则拒绝本次推理并触发相应策略（降级、降频或者终止loop）。

**可观测性**方面，推理阶段的埋点需要记录每次API调用的：模型名称、输入token数、输出token数、推理延迟、错误类型。

这些数据是后续优化模型选择和prompt设计的依据，也是排查「为什么loop跑着跑着变慢了」的核心证据。

LangSmith是LangChain官方提供的可观测性平台，可以直接集成到推理阶段，提供trace、eval和debug的统一视图。

![](https://iili.io/qysTGB2.png)
> Token预算：面试时说不清楚的数字，上线后就是账单

### 3.3 阶段三：行动——工具调用与外部 API 交互

推理阶段的输出是模型生成的一个「指令」，这个指令需要通过工具调用来执行。工具调用是agent loop里「对外交互」的部分，涉及到网络I/O、错误处理和安全边界。

**工具调用的结构**在LangGraph里通常通过ToolNode来实现。每个工具定义为一个函数，接受参数，执行逻辑，返回结果。

工具可以是任何东西：调用Google Calendar API创建一个会议、查询BigQuery获取数据、调用外部天气API获取实时天气、把结果写进Google Sheets。

工具的数量和复杂度直接决定了agent能完成任务的边界——这也是为什么面试官会问「你用过哪些工具定义方式」和「工具超时怎么处理」这类问题。

**网络I/O的错误处理**是行动阶段最容易翻车的地方。本地开发时，工具调用通常是测试桩（mock），永远成功。

但生产环境里，外部API可能返回502（上游服务挂了）、429（rate limit）、timeout（网络抖动）或者403（权限过期）。

每一种错误都需要对应的处理策略：retry with exponential backoff是最基础的，但retry的次数、间隔和上限需要结合业务场景来定——无限retry会把你的服务拖死，retry次数太少又会误杀本可以成功的请求。

**安全边界**是工具调用里最需要认真设计的部分。

Agent调用的外部API通常需要credentials（API key、OAuth token），这些credentials绝对不能硬编码在代码里或者明文传递。

在GCP上，标准做法是：通过Secret Manager存储credentials，通过Workload Identity给Cloud Run/GKE Pod绑定最小权限的服务账号，工具执行时从Secret Manager拉取credentials注入到环境变量里。

面试时能讲清楚这套安全路径，说明你对GCP安全模型的理解不只是「有IAM」这么简单。

### 3.4 阶段四：观察——结果解析与状态更新

工具调用完成后，agent需要把执行结果解析出来，更新到State里，再决定下一步怎么走。

这个「观察 → 解析 → 更新State」的过程是agent loop里的信息传递环节，也是最容易出现类型错误和数据丢失的地方。

**结果解析**的核心挑战是把工具返回的原始数据（通常是JSON或者字符串）转换成模型能理解的格式。

LangGraph里的工具返回通常是Structured Message格式，模型可以从中提取「下一步要做什么」的判断。

但如果工具返回的数据结构不标准（比如有些字段是null、有些是嵌套的字典），解析逻辑需要足够健壮，否则模型会在「读取工具结果」这一步拿到空值或者错误格式，导致后续推理跑偏。

**State更新**由Reducer控制，这里需要再次强调Reducer的重要性。

一个常见的错误是：候选人在推理阶段让模型返回了一步的结果，然后在工具调用阶段也更新了State，但两次更新的字段是同一个——比如「messages」字段，推理阶段append了一条assistant消息，工具调用阶段又append了一条tool消息，但因为Reducer没有正确配置，messages列表的顺序可能错乱或者重复。

面试时能讲清楚「Reducer怎么配的、为什么这么配」，说明你踩过这个坑并且有系统的解决方案。

**观察阶段的质量控制**是一个面试加分项。

这个阶段可以加一个「结果验证层」：工具返回后，先验证结果是否合理（比如返回的数据类型是否匹配预期、是否为空、是否包含明显的错误标记），如果验证不通过，可以选择重试、降低结果等级或者触发human-in-the-loop。

这套逻辑不是必须在框架层实现，但它是区分「能用」和「好用」的关键细节。

![](https://iili.io/qbiS47S.png)
> 结果解析挂了，整个loop跑偏，锅算谁的

### 3.5 阶段五：Human-in-the-Loop 拦截点——何时暂停、谁来决策

Human-in-the-Loop（HitL）是agent loop里唯一一个「把控制权交给人」的阶段，也是近年来面试高频出现的新话题。

它的核心动机是：agent的推理能力和工具权限在不断提升，但模型仍然会在某些边界情况下做出不安全的决策，需要人类在关键节点把关。

**HitL的典型拦截场景**包括：agent准备执行一个有副作用的操作（比如删除数据、发送邮件、支付转账）、agent的置信度低于某个阈值、agent的推理结果与用户原始意图出现显著偏差。

这些场景的共同点是：模型的单边决策风险超过了可接受的范围，需要人工介入。

**实现方式**在LangGraph里通常有两种路径。

第一种是把HitL做成了一个特殊的State节点：agent到达这个节点时，State的更新暂停，loop悬停，等人类在外部系统里确认或修改，外部系统的响应通过API callback或者webhook写回StateGraph，loop继续执行。

第二种是通过interrupt机制：agent在特定节点触发一个中断，状态保存到checkpoint，控制权通过邮件/通知/内部审批系统转给人，审批完成后通过LangGraph的resume API恢复执行。

**面试时HitL的应答关键**是能讲清楚「什么情况下需要HitL」和「如何设计拦截点」。

第一个问题没有标准答案，但有判断框架：风险越高、操作越不可逆、模型置信度越低的场景，越需要HitL。

第二个问题要落到工程实现：你选哪种拦截方式、用户体验怎么设计（是同步阻塞还是异步通知）、审批结果怎么写回loop。这些细节说明你不是在背概念，而是真的实现过。

### 3.6 阶段六：终止与重试——loop 退出条件与错误分类

终止与重试是agent loop生命周期的最后一关，设计得好不好直接决定了系统的稳定性和资源浪费程度。

**Loop退出条件**通常有四类：

第一类是**任务完成**，agent输出了用户期望的结果（通过一个is_task_complete函数判断，通常基于规则或模型自评）。

这是最理想的退出路径，正常情况下在第一个满足条件的状态就退出，不需要跑到max_iterations。

第二类是**最大迭代次数耗尽**，防止agent在没有进展的情况下无限跑下去。这个阈值需要结合业务场景调——太大浪费资源，太小可能错过正确答案。

通常的做法是设置一个保守的初始值（比如max_iterations=20），然后根据实际运行数据调整。

第三类是**资源耗尽**，包括quota超限（token消耗、API调用次数、费用上限）和时间超限（单次请求timeout或者总运行时间timeout）。

这类退出条件的意义是保护系统不被异常行为拖垮。

第四类是**Human中断**，用户在任意阶段主动终止loop。

用户体验上需要一个清晰的stop按钮或者cancel API，同时需要保证当前状态被正确保存到checkpoint，方便下次恢复而不是从头开始。

**错误分类与重试策略**是终止阶段最体现工程判断力的部分。Agent loop的错误可以分为三类：

模型侧失败（Model Failure）指的是模型API返回error、超时或者返回了无效响应。

处理策略通常是retry with backoff，retry次数建议设3-5次，次序间隔从1秒指数增长到32秒。

如果超过retry上限仍失败，需要判断是否降级（比如切到更小的模型或者返回友好错误提示）。

工具侧失败（Tool Failure）指的是外部API返回4xx/5xx错误。

Retry策略与模型侧类似，但需要注意：某些错误（如401 Unauthorized）retry是没有意义的，需要立即触发credentials刷新或者直接fail。

另一个常见问题是幂等性——不是所有工具调用都是可重试的（比如发送邮件重试会发两封），这种情况需要在重试前检查工具的幂等性属性。

资源侧失败（Resource Failure）指的是GCP层面的问题，比如Cloud Run实例被缩容、Pod OOM、Kubernetes节点重启。

这类失败的特征是不可预测且状态可能丢失，处理策略的核心是checkpoint恢复：每次状态转换后必须保存checkpoint，失败后从最近的checkpoint恢复。

如果checkpoint机制本身失效，那这个错误就是最严重的一类——需要报警并人工介入，而不是让系统盲目重试。

![](https://iili.io/B9f4ACB.png)
> 无限循环：面试时说不清退出条件，上线后就是生产事故

## 四、GCP 部署场景：Cloud Run 与 GKE 的关键差异

Cloud Run 和 GKE 是 GCP 上最常被拿来跑 agent loop 的两个计算平台，但在实际工程选型里，它们的设计哲学完全不同——选错了不是「能用」，是「能用多久」的问题。

### 4.1 Cloud Run 部署：冷启动延迟、按需扩缩容、loop 响应时间的影响

Cloud Run 是 Knative 原生的 Serverless 容器平台，核心卖点是「你只管写代码，基础设施完全托管，零运维」。对于 agent loop 来说，这个模型的优缺点都非常明显。

**冷启动延迟**是 Cloud Run 上跑 agent loop 最大的工程陷阱。

Agent loop 是一个有状态的循环执行体，第一轮推理往往需要预热：大模型 SDK 加载、credentials 初始化、LangGraph StateGraph 编译、checkpoint 恢复。

这些操作在本地或常驻实例上是毫秒级的初始化开销，但在 Cloud Run 的冷启动场景里，可能叠加出 5-15 秒的等待时间。

更麻烦的是：agent loop 的执行时间本身就不可预测。一个简单查询可能 2 秒跑完，一个复杂多步任务可能跑 30 分钟。

Cloud Run 的 timeout 上限是 3600 秒（1小时），听起来够用，但如果你把 loop 的 timeout 设得太长，实例不会被释放，Cloud Run 的计费就会从「按调用」变成「按实例运行时间」——这个坑在面试和实际项目里都有人踩过。

**按需扩缩容**在纸面上是优势：流量来了自动扩，流量走了自动缩。但 agent loop 的扩缩容有一个根本矛盾：loop 在执行过程中是有状态的，不能随意中断。

如果 Cloud Run 在 agent 跑第 15 步推理的时候触发缩容，你的 loop 实例被 kill 了，状态就丢了。

解决方案通常有两个：把 `min-instances` 设为 1 保持一个常驻实例（放弃 Serverless 的成本优势），或者依赖 checkpoint 机制在实例被 kill 后从最近状态恢复。

前者增加成本，后者增加复杂度——这就是为什么面试官会在你提到「Cloud Run 部署」时追问「你怎么处理冷启动和状态丢失」的根因。

**适合场景**：低流量、请求驱动、loop 执行时间短（<5分钟）、可以接受冷启动延迟的轻量级 agent 任务，比如客服机器人、单次查询型 agent、事件驱动的自动化脚本。

![](https://iili.io/B6vtqLG.png)
> 冷启动 10 秒，用户以为页面卡死了，PM 来问开发怎么优化

### 4.2 GKE 部署：Pod 生命周期管理、状态持久化与 pod restart 的博弈

GKE（Google Kubernetes Engine）给你完整的 Kubernetes 控制权，包括 Pod 调度、持久化存储、水平扩缩容策略和节点池管理。

代价是你需要自己管 Kubernetes 的运维复杂度。

**Pod 生命周期管理**是 GKE 上 agent loop 的核心议题。

一个 LangGraph agent loop 跑在 GKE 上，本质上是一个长期运行的 Pod（或者 Deployment 下的一个 Pod）。这个 Pod 面临的典型风险包括：

节点资源压力导致 Pod 被驱逐（Eviction）、节点池自动升级导致节点重建、集群缩容把有负载的 Pod 调度到资源不足的节点。

这些 Kubernetes 原生行为对有状态的 agent loop 来说都是「灾难」——每一次 Pod restart，如果没有 checkpoint 机制，loop 就得从第一步重新开始。

GKE 的应对方案是使用 **StatefulSet** 而非 Deployment。

StatefulSet 给每个 Pod 分配稳定的网络标识（DNS 名称）和持久存储卷（PersistentVolumeClaim），保证了 Pod 重启后能挂载到同一个存储卷、从同一个 checkpoint 文件恢复。

这比 Cloud Run 的 checkpoint 恢复更可控，但代价是 StatefulSet 的扩缩容比 Deployment 复杂得多，不能随意 `kubectl scale`——你需要考虑状态分片、数据一致性这些问题。

**Horizontal Pod Autoscaler（HPA）** 在 GKE 上跑 agent loop 有一个特殊的坑：HPA 基于 CPU/内存使用率扩缩容，但 agent loop 的计算负载高度不均匀——可能 90% 的时间在等 API 响应（CPU 空闲），然后突然来一轮密集的推理（CPU 飙升）。

用标准的 HPA 指标容易导致扩缩容震荡。通常的做法是自定义 Metrics Adapter，结合 agent loop 内部的队列长度或者活跃推理数来做扩缩容决策。

**适合场景**：高流量、长时间运行（>30 分钟）、需要水平扩缩容、有状态 checkpoint 管理、团队有 Kubernetes 运维能力的生产 agent 系统。

### 4.3 Secret Manager：agent credentials 的安全存储与轮转

无论你选 Cloud Run 还是 GKE，agent 调用外部工具时都需要 credentials。

这些 credentials 不能写在代码里，不能放在环境变量文件里，更不能放在 GitHub 仓库里——这是 GCP 安全模型的基础要求。

**Secret Manager 的核心价值**是提供一个中心化的 credentials 存储，并且支持版本管理（每轮轮转生成新版本）、IAM 访问控制（只授权给需要的服务账号）和审计日志（谁在什么时候读取了哪个 secret）。

Agent loop 里使用 Secret Manager 的典型流程是：在初始化阶段，通过 GCP 的客户端库（`google-cloud-secretmanager`）从 Secret Manager 拉取 credentials，写入 Pod/容器的内存中（不是磁盘），然后在工具调用时注入到请求头或者认证上下文里。

```python
from google.cloud import secretmanager

def get_secret(secret_id: str, version: str = "latest") -> str:
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{PROJECT_ID}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("utf-8")
```

Credentials 轮转（rotation）是 Secret Manager 真正体现价值的地方。

当你的外部 API key 需要定期更新（比如 90 天过期），Secret Manager 可以通过 Pub/Sub 触发器自动推送新版本到使用方，agent loop 无需重新部署——只要每次调用前检查一次版本号，发现过期就重新拉取即可。

面试时能讲清楚 credentials 的生命周期管理：创建 → 注入 → 使用 → 轮转 → 过期处理，说明你不是在云控制台里点了几下按钮，而是真正理解了零信任安全模型在 agent 场景下的落地方式。

### 4.4 Cloud Logging + Cloud Monitoring：agent loop 可观测性集成方案

可观测性（Observability）是 GCP 上生产 agent 系统里最容易被学生党和初级工程师忽略的维度——但面试官一问「你怎么知道 agent 跑得好不好」就知道你踩没踩过坑。

GCP 的可观测性套件主要包括三个组件：**Cloud Logging**（结构化日志）、**Cloud Monitoring**（指标和告警）和 **Cloud Trace**（分布式追踪）。

对于 agent loop，理想的集成方案是把三者串起来：

**Cloud Logging** 需要结构化输出。

Agent loop 里的每次推理、每次工具调用、每次状态转换都应该生成一条结构化日志，包含：trace_id（关联一次完整的 loop 执行）、step_number（当前第几步）、action_type（推理/工具调用/状态更新）、token消耗（如果是在推理步骤）、耗时（毫秒）。

这些日志不是给你调试用的，是给生产排障用的——当凌晨三点告警响了，你需要靠这些日志在 5 分钟内定位「loop 卡在哪一步」。

**Cloud Monitoring** 需要自定义指标。最核心的两个指标是：

- `agent_loop_iterations`：每次 loop 执行的迭代次数，监控是否有异常的高迭代（可能是无限循环前兆）

- `agent_loop_duration_seconds`：单次完整 loop 的执行时间，监控延迟退化趋势

```python
from google.cloud import monitoring_v3

def emit_loop_metric(metric_type: str, value: float, labels: dict):
    client = monitoring_v3.MetricServiceClient()
    series = monitoring_v3.TimeSeries()
    series.metric.type = f"custom.googleapis.com/agent/{metric_type}"
    series.metric.labels.update(labels)
    series.resource.type = "global"
    series.points = [monitoring_v3.Point({
        "interval": monitoring_v3.TimeInterval({
            "end_time": {"seconds": int(time.time())}
        }),
        "value": {"int64_value": int(value)}
    })]
    client.create_time_series(name=client.project_path(PROJECT_ID), time_series=[series])
```

**LangSmith** 是 LangChain 官方提供的可观测性平台，和 GCP 的这套原生方案是互补关系：LangSmith 更侧重 trace 可视化和 prompt 调优，GCP Monitoring 更侧重生产告警和 SLO 定义。

生产系统里两者通常同时启用，LangSmith 给开发阶段 Debug 用，GCP Monitoring 给生产环境保驾护航。

![](https://iili.io/B6v4Xyb.png)
> 日志没埋好，生产出问题只能靠猜，review 时被追问到冒汗

## 五、生产级细节：quota guard、checkpoint 持久化、容错设计

这三个细节——quota guard、checkpoint 持久化、容错设计——是 GCP 上 agent loop 从「能跑」到「能上线」的三道护城墙。

它们各自独立，但组合在一起才能构成一个真正生产可用的系统。

### 5.1 Quota Guard：防止 token 消耗爆炸的策略设计

Token 消耗爆炸是 agent loop 生产事故里最常见、也最容易被低估的一类。

问题不在于模型贵，而在于 agent loop 的迭代次数不可控——一个设计不良的 loop 可能在用户一个无意的模糊请求下跑出 50 次推理，每次 50K tokens，几分钟内烧掉几百美元。

**Quota Guard 的设计原则**是在推理调用前加一层主动检查，而不是事后报警。它的检查逻辑通常包含三个维度：

第一个维度是**单次 budget**：检查当前这轮推理预计消耗的 tokens 是否超过单次最大阈值（比如 10K tokens），超过则拒绝并触发降级。

第二个维度是**累计 budget**：检查本次 loop 累计消耗的 tokens 是否超过总预算（比如 500K tokens），超过则拒绝并触发终止或降频。

第三个维度是**时间窗口 budget**：检查最近 N 分钟内的 token 消耗速率是否异常（比如 5 分钟内消耗超过 100K tokens），超过则触发限流。

```python
class QuotaGuard:
    def __init__(self, single_limit: int, total_limit: int, window_minutes: int):
        self.single_limit = single_limit
        self.total_limit = total_limit
        self.window_minutes = window_minutes
        self.total_consumed = 0
        self.window_history: deque[tuple[float, int]] = deque()  # (timestamp, tokens)

    def check(self, estimated_tokens: int) -> tuple[bool, str]:
        now = time.time()
        # 清理过期窗口数据
        cutoff = now - self.window_minutes * 60
        while self.window_history and self.window_history < cutoff:
            self.window_history.popleft()

        window_consumed = sum(tokens for _, tokens in self.window_history)

        if self.total_consumed + estimated_tokens > self.total_limit:
            return False, f"total_budget_exceeded: {self.total_consumed}/{self.total_limit}"
        if estimated_tokens > self.single_limit:
            return False, f"single_request_exceeded: {estimated_tokens}/{self.single_limit}"
        if window_consumed + estimated_tokens > self.total_limit * 0.5:
            return False, f"window_rate_limit: {window_consumed}/{self.total_limit * 0.5}"

        return True, "approved"

    def record(self, tokens: int):
        self.total_consumed += tokens
        self.window_history.append((time.time(), tokens))
```

面试时描述 quota guard 的价值，重点要讲清楚「为什么它必须是一个独立模块，而不是写在推理函数里」。

原因是：模块独立意味着可以单独测试、单独配置、单独告警——你可以在不修改 agent 逻辑的情况下调整 quota 阈值，而生产环境的阈值调整通常需要运营团队在不停服的情况下完成。

### 5.2 Checkpoint 持久化：Cloud Storage / Firestore 与状态恢复路径

Checkpoint 是 agent loop 的「存档点」——每次状态转换后，把 StateGraph 的当前状态序列化成文件，存到持久化存储里，失败后从最近一个存档恢复。

**存储介质的选择**在 GCP 上通常有两个选项：Cloud Storage（GCS）和 Firestore。

GCS 适合大规模、低频读写的场景。

每个 checkpoint 是一个对象文件（通常 JSON 格式），通过 GCS 的版本控制（Object Versioning）可以保留历史版本，回滚时有多个选择。

缺点是 GCS 的读写延迟在 50-200ms 量级，对高频 checkpoint（每次状态转换都存）会有性能影响。

Firestore 适合低延迟、高频读写的场景。

Firestore 是 GCP 的 NoSQL 文档数据库，单次读写延迟在 10-50ms 量级，可以支持更细粒度的 checkpoint 存储（比如把 State 的不同字段分文档存储）。

缺点是 Firestore 有写入频率限制（每个文档每秒最多 1 次写入），如果 loop 状态转换极快（比如 <100ms），可能触发限制。

```python
from google.cloud import storage, firestore
import json

class CheckpointManager:
    def __init__(self, storage_type: str = "gcs", bucket_name: str = None, collection: str = None):
        self.storage_type = storage_type
        if storage_type == "gcs":
            self.client = storage.Client()
            self.bucket = self.client.bucket(bucket_name)
        elif storage_type == "firestore":
            self.client = firestore.Client()
            self.collection = self.collection = self.client.collection(collection)

    def save(self, thread_id: str, state: dict):
        serialized = json.dumps(state, default=str)
        if self.storage_type == "gcs":
            blob = self.bucket.blob(f"checkpoints/{thread_id}.json")
            blob.upload_from_string(serialized)
        elif self.storage_type == "firestore":
            self.collection.document(thread_id).set({
                "state": serialized,
                "updated_at": firestore.SERVER_TIMESTAMP
            })

    def load(self, thread_id: str) -> dict | None:
        try:
            if self.storage_type == "gcs":
                blob = self.bucket.blob(f"checkpoints/{thread_id}.json")
                return json.loads(blob.download_as_text())
            elif self.storage_type == "firestore":
                doc = self.collection.document(thread_id).get()
                if doc.exists:
                    return json.loads(doc.to_dict()["state"])
        except Exception:
            return None
        return None
```

**恢复路径设计**是 checkpoint 机制真正体现价值的地方。

一次完整的恢复流程是：检测到 Pod/实例 failure → 从存储里拉取最新 checkpoint → 反序列化 State → 重新初始化 StateGraph → 从 checkpoint 记录的下一步节点继续执行。

这个流程在理想情况下用户无感知，但需要处理边界情况：checkpoint 本身损坏（JSON 解析失败）、checkpoint 版本与当前 StateGraph 代码不兼容（字段结构变了）、checkpoint 存储服务本身不可用。

面试时能描述清楚这些边界处理，说明你不仅实现了 checkpoint，还思考了「万一 checkpoint 本身出问题怎么办」的韧性设计。

### 5.3 容错设计：模型侧失败、工具侧失败、资源侧失败的分类处理

容错不是「加了 try-except」，而是根据错误类型设计有针对性的恢复策略。上半部分讲了退出条件和错误分类，这一节重点讲工程实现层面的分类处理。

**模型侧失败（Model Failure）**的典型场景是模型 API 返回 500 错误、429 Rate Limit 或者网络超时。

对于 500 类错误，retry 是合理的选择，但 retry 次数需要有限制，避免在模型服务本身有问题时（全体 500）把请求全堆在重试队列里导致更严重的排队。

对于 429 Rate Limit，正确的处理不是 retry——是等待后重试。

Retry with backoff 在 429 场景下会加剧 rate limit 冲突，正确的做法是检测到 429 后，根据 `Retry-After` header 等待指定时间，再重新请求。

如果 `Retry-After` header 不存在，可以用指数退避（从 5 秒开始，最大等待 60 秒）来估算。

**工具侧失败（Tool Failure）**比模型侧更复杂，因为工具的语义各异。

Retry 策略需要结合工具的幂等性来判断：GET 类查询（查天气、查数据库）是天然幂等的，可以安全重试；

POST 类操作（发送邮件、转账、创建资源）不是幂等的，重试前必须检查是否已经执行过。

LangGraph 里的工具定义可以带上 `rerunnable` 标记，帮助框架判断是否可以在 failure 后重新执行该工具。

面试时能讲清楚「幂等性在 agent loop 里怎么控制」，说明你对工具调用语义的理解不只是「定义一个函数」这么简单。

**资源侧失败（Resource Failure）**在 GCP 上最典型的表现是 Cloud Run 实例被 kill、Pod OOM、节点重启。

这类错误的特征是不可预测且状态可能丢失，应对的唯一可靠手段就是 checkpoint——每次状态转换后必须保存 checkpoint，而且 checkpoint 保存必须先于任何可能导致失败的外部调用（也就是「先存档，再冒险」原则）。

如果 checkpoint 机制失效或者损坏，系统应该主动报警并进入人工介入流程，而不是让 loop 盲目重试。

盲目重试在资源侧失败的场景里可能形成「重试 → 失败 → 重试」的死亡螺旋，迅速耗尽 quota。

### 5.4 多 agent 协作场景下的 loop 管理（可选展开）

多 agent 场景是 agent loop 的进阶形态——不是一条 loop 跑到底，而是多个 agent loop 并行或串行协作，共同完成一个复杂任务。

多 agent 协作的典型模式有两种：**并行分解**（把一个大任务拆成 N 个子任务，N 个 agent 同时执行，最后汇总结果）和**串行编排**（agent A 完成第一步，输出作为 agent B 的输入，链式执行）。

在 GCP 上，多 agent 协作的核心工程挑战是**状态隔离**：每个 agent loop 维护自己的 State，不同 agent 之间需要通过消息队列（Pub/Sub）或者共享存储（Firestore）来传递中间结果，而不是直接共享 State 对象。

多 agent 场景的另一个工程问题是**循环依赖**：agent A 的输出是 agent B 的输入，agent B 的输出又是 agent A 的输入，如果不加控制可能形成无限循环。

解决方案是在 Orchestrator 层设置「最大协作轮次」，超过轮次后强制进入汇总降级流程（返回部分结果，而不是无限等待）。

多 agent 不是面试必考内容，但如果候选人能主动提到这个维度，说明他对 agent loop 的理解已经从「单 loop 执行」升级到了「多 agent 协作系统」的层面——这个认知升级在高级工程师和 Staff Engineer 级别的面试里是加分项。

![](https://iili.io/BJFF1g1.png)
> 多 agent 协作跑起来，PM 问哪个 agent 挂了算谁的

## 六、面试映射：从模板答案到项目展开路径

这一章把前五章的工程内容翻译成面试应答。先给出每道题的标准回答框架，再说明面试官的真实筛选意图和项目展开路径。

### 6.1 高频面试题一：描述一个你实现过的 agent loop

**模板答案（30秒开口版）**：

「我实现过一个客服 agent，部署在 GCP Cloud Run 上，基于 LangGraph 的 StateGraph 构建。

Loop 的六个阶段分别是：初始化时从 Secret Manager 加载 credentials，从 GCS 读取 prompt 模板；

推理阶段调用 Claude 3.5 Sonnet，每次调用前过 Quota Guard；

工具调用阶段访问 BigQuery 查用户订单和 Google Calendar 查预约可用性；结果解析后更新 State，进入下一步或终止。

单次 loop 平均跑 3-5 步，checkpoint 存 GCS，失败后从最近存档恢复。」

**项目展开路径**（追问方向）：

面试官追问「为什么选 Cloud Run 而不是 GKE」，你要能说清楚：流量规模（估算 QPS）、执行时长分布（90th percentile 多少分钟）、团队运维能力边界。

追问「checkpoint 怎么存的」，要能画出存储路径、说明恢复时序。追问「quota guard 怎么配的」，要能给出具体阈值数字和调整依据。

这些问题没有唯一正确答案，但你的答案必须是一个经过工程权衡的判断，而不是「我随便设了个数」。

### 6.2 高频面试题二：如何处理 agent 的无限循环问题

**模板答案（30秒开口版）**：

「无限循环有两个防线。第一道是 max_iterations，硬上限，超过就终止。

第二道是状态收敛检测：每次推理后计算当前 State 和上一步 State 的语义相似度（可以用 embedding cosine similarity），如果连续 N 步相似度都超过阈值（比如 0.95），说明 agent 在原地打转，主动终止。

这两个防线配合起来，既防止了资源耗尽，又避免了在语义上已经有进展但表面指标（迭代次数）还没触线时被误杀。」

**工程细节补充**：

收敛检测的实现需要在 State 里额外维护一个 `history_embeddings` 字段，每次推理后计算当前 `messages` 的 embedding 和上一步的 cosine similarity。

如果 `similarity > 0.95` 连续出现 2-3 次，就判定为收敛。这个机制在面试时可以主动补充，说明你对「状态收敛」这个概念的理解不是只背了名字，而是实现了度量。

**易错点**：只回答 max_iterations 而不讲语义层面的收敛检测，说明你只守住了硬防线，没有理解「循环」在 agent 场景下的语义本质。

### 6.3 高频面试题三：GCP 生产环境的 agent 监控怎么做

**模板答案（30秒开口版）**：

「我用了 GCP 原生可观测性套件三层叠加：Cloud Logging 接收结构化日志，每步推理、每次工具调用、每次状态转换都有 trace_id 关联；

Cloud Monitoring 配置了三个自定义指标——loop_iterations（迭代次数）、loop_duration_seconds（总执行时长）和 token_consumed（token 消耗速率），超过阈值触发 PagerDuty 告警；

LangSmith 用于开发调试阶段的 trace 可视化。生产告警用 GCP，原型验证用 LangSmith。」

**追问方向**：

面试官常追问「SLO 怎么定」。Agent loop 的 SLO 通常不是「99.9% 可用」这种经典定义，因为 loop 本身可能主动终止（用户取消、超时），所以更实用的 SLO 维度是：

- `loop_completion_rate`：发起请求的 loop 里，有多少比例正常完成（达到 is_task_complete 或 max_iterations）

- `loop_avg_duration`：正常完成 loop 的平均执行时长

- `loop_error_rate`：因 Model Failure / Tool Failure / Resource Failure 异常终止的比例

这三个指标组合才能反映 agent 系统的真实健康度，不是单靠 uptime 指标能覆盖的。

### 6.4 高频面试题四：Human-in-the-Loop 在你的项目里怎么实现

**模板答案（30秒开口版）**：

「HitL 的拦截点我设计了两个维度。

第一是风险等级拦截：agent 调用高风险工具（发送邮件、删除数据、执行支付）时自动暂停，状态写入 Firestore，通知通过内部审批系统推送给人，人审批后通过 resume API 恢复。

第二是置信度拦截：模型推理后，如果自评置信度低于阈值（比如 <0.7），暂停等待用户确认意图。

这两个拦截点通过 LangGraph 的 interrupt 机制实现，状态保存在 checkpoint 里，审批完成后从断点恢复。」

**追问方向**：

「如果用户不审批，超时了怎么办？」——超时后需要降级处理：要么返回用户「您的请求等待时间过长，已自动取消」，要么降级到简单路径（跳过高风险操作，只执行低风险查询）。

面试时能讲清楚超时降级策略，说明你对 HitL 的设计不是「加个暂停等审批」这么简单，而是有完整的用户体验和系统韧性设计。

### 6.5 项目展开路径：如何在面试中讲清楚 GCP 部署的工程决策

面试官真正想听的不是「我用了 GCP」，而是「我为什么这么用」。GCP 部署的工程决策通常有以下几个维度，每个维度都可以成为追问入口：

**选 Cloud Run 还是 GKE**：不是选「更先进的」，是选「更合适的」。讲清楚你的流量特征、执行时长、团队规模，再从这个基础出发推导选型。

**为什么 Quota Guard 是独立模块**：能讲清楚模块化设计的好处——独立配置、独立测试、独立告警、独立调整阈值——说明你有工程系统观，不是功能堆砌。

**Checkpoint 存 GCS 还是 Firestore**：选 GCS 的人通常看中版本控制和成本，选 Firestore 的人通常看中读写延迟。讲清楚你选的依据，而不是「顺手选了」。

**监控怎么分层**：三层（Logging / Monitoring / LangSmith）的设计逻辑是什么，为什么不用一个工具覆盖所有——因为 LangSmith 的 trace 可视化对开发阶段友好，但不适合做生产 SLA 监控，两个工具有不同的设计目标。

![](https://iili.io/B9HlDhu.png)
> 能把选型依据讲清楚，面试官已经开始记笔记了

### 6.6 常见追问与易错点

**追问一：「checkpoint 丢了怎么办？」**

这是一个高压力追问，考察的是你对系统韧性的理解。标准应答：「checkpoint 丢失分两种情况。

第一是存储服务不可用（GCS 503 / Firestore 限流），此时切换到备选存储路径，同时触发 PagerDuty 告警。

第二是 checkpoint 本身损坏（JSON 解析失败），此时尝试读取上一个版本（GCS Object Versioning 支持），如果所有版本都损坏，记录异常、终止 loop 并告警人工介入。

」——这里的关键是「分层降级」和「主动告警」，不是「try-except 吞掉」。

**追问二：「quota guard 的阈值怎么定的？」**

最容易答错的方向是「我查了文档根据模型定价算出来的」。

正确思路是：阈值应该基于**历史数据回测**——取最近 30 天的 token 消耗分布，75th percentile 作为 warning 阈值，95th percentile 作为 hard limit。

这样阈值是数据驱动的，而不是拍脑袋的。

**追问三：「HitL 怎么避免用户烦到不想批？」**

这是一个产品体验层面的追问，但考察的是你的系统设计思维。标准回答：「拦截点的数量要控制，太多拦截会让用户失去耐心。

解决方案是动态阈值：风险操作频率高的用户，拦截阈值逐步放宽（基于信任度模型）；新用户或低频操作用户，拦截更严格。

同时提供 batch approval 功能，管理员可以预先审批一批同类型操作，减少个人审批负担。」

**易错点一：把 agent loop 等同于 for 循环**

这是最常见的概念错误。Agent loop 是状态机，状态转换是条件驱动的——下一步是什么，由 State 和 Transition 函数共同决定，不是简单的「执行 N 次」。

面试时能画出 StateGraph 的结构图，说明你理解这个本质区别。

**易错点二：只讲功能，不讲权衡**

「我用了 checkpoint」和「我用了 checkpoint 存 GCS，延迟 100ms 但成本低，考虑到 loop 每步执行平均 3 秒，这个延迟占比 <3%，可以接受」——两者的工程含量完全不同。

面试官筛的是后者。

**易错点三：把 LangChain 和 LangGraph 混为一谈**

LangChain 是高层抽象（LCEL、Chain），LangGraph 是低层编排框架（StateGraph、checkpoint）。

在 GCP 部署场景下，LangGraph 的低层控制力是必需的——如果你只说「用了 LangChain」，面试官会认为你没有接触过真正的 agent 编排层细节。

![](https://iili.io/qbi8SHP.png)
> 行吧，checkpoint 这个坑我先扛着，回头和面试官说是 feature

## 参考文献
<div class="academic-reference-list">
<p class="reference-item">[1] 原始资料[EB/OL]. https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/04-ai-system-design.md. (2026-04-29).</p>
</div>
