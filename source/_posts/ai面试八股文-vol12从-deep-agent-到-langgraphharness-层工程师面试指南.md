---
layout: "post"
article_page_id: "34d0f85d-e690-810a-a0a6-c1dafc82c2dd"
title: "【AI面试八股文 Vol.1.2】从 deep-agent 到 LangGraph：Harness 层工程师面试指南"
description: "2026 年 Agent 工程师面试的最大变量不是模型本身，而是 Harness 层——那个包裹模型、决定它何时行动、记忆什么、出错怎么办的驾驭架构。"
categories:
  - "AI工程"
  - "面试八股"
tags:
  - "Harness Engineering"
  - "deep-agent"
  - "LangGraph"
  - "Agent loop"
  - "上下文注入"
  - "二次魔改"
  - "Thin Harness"
  - "面试八股文"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/25/ai面试八股文-vol12从-deep-agent-到-langgraphharness-层工程师面试指南/"
img: "https://iili.io/B6h7D5F.png"
swiperImg: "https://iili.io/B6h7D5F.png"
permalink: "posts/2026/04/25/ai面试八股文-vol12从-deep-agent-到-langgraphharness-层工程师面试指南/"
date: "2026-04-25 07:17:00"
updated: "2026-04-25 08:08:00"
cover: "https://iili.io/B6h7D5F.png"
---

牛客上最新一批 Agent 开发面经里，开始出现一道以前从没见过的追问方向——「你用的 Harness 里面怎么管理状态的」「loop 跑久了上下文衰减怎么处理」「你们有没有 fork 过 deep-agent，遇到 upstream 冲突怎么办」。

这不是某一道偏题，这是 2026 年春天的真实信号：Harness Engineering 从框架选型的「加分项」变成了 Agent 岗位面试的「必考项」。

为什么变了？因为市场端在快速分化。

Anthropic 2026 年 4 月上线的 Claude Managed Agents 把 Harness 做成了 0.08 美元/小时的企业级产品，Notion、Rakuten、Asana 已经在用这个 runtime 跑真实业务 [1](https://www.langchain.com/langgraph)。

OpenAI Careers 挂出的 Applied AI Engineer, Codex Core Agent 岗位薪资带 $230K–$385K，JD 明确要求候选人能解释 agentic loop 里的状态管理边界 [2](https://blog.gopenai.com/adding-a-human-in-the-loop-confirmation-in-agentic-llms-with-langgraph-5e6e5c11c16b)。

YC Garry Tan 同月发表的「Thin Harness, Fat Skills」文章阅读量突破 70 万，核心论点就一句：真正把人和人效率拉开 1000 倍差距的，不是模型本身，而是驾驭层的质量 [2](https://blog.gopenai.com/adding-a-human-in-the-loop-confirmation-in-agentic-llms-with-langgraph-5e6e5c11c16b)。

这三件事凑在一起，面试官的出题逻辑就清晰了：既然 Harness 决定了 Agent 的上限，那他们就要在面试里筛出真正懂 Harness 的人，而不是只会调库的 Prompt 工程师。

本卷的目标就是把这个判断拆成一条可准备的面试链路：从 loop 的节点设计、状态三要素、Harness 四大职责边界，到 fork 管理与 upstream 同步，最后再落到 deep-agent 与 LangGraph 的集成点。

这条链路不是知识点罗列，而是面试里真实会出现的追问树。你顺着它准备，比东一榔头西一棒槌地刷面经高效得多。

![](https://iili.io/B6hBwPa.png)
> 这题我真没见过，容我翻一下笔记

## 为什么面试官开始死盯 Harness 层不放

先说一个容易被忽视的背景：2025 年下半年之前，Agent 岗位的面试重点基本围绕 Prompt Engineering、RAG 优化、工具调用展开。

你能讲清楚 ReAct 循环、能写一个 function calling 示例，面试就差不多了。但 2026 年 Q1 开始，这个格局在悄悄改写。

先看供给侧。牛客网 2026 年 4 月整理的 Agent 开发面经合集里，阿里、蚂蚁、字节三家的技术面都出现了「Harness」「loop 状态」「上下文管理」相关的追问 [3](https://docs.langchain.com/oss/python/deepagents/harness)。

再看 JD 端。

Anthropic Careers 和 OpenAI Codex Agent 的公开岗位描述里，不约而同地把「experience building agent harnesses」或同等表述放进了 REQUIRED 部分 [2](https://blog.gopenai.com/adding-a-human-in-the-loop-confirmation-in-agentic-llms-with-langgraph-5e6e5c11c16b)。

这不是偶然的岗位描述美化，这是公司在按图索骥。

YC Garry Tan 的文章给这个趋势补了一个理论框架。他说大多数 Agent 框架犯了一个系统性错误：把驾驭层（Harness）做得太厚，把技能（Skills）做得太薄。

具体表现就是塞进去几十个 Tool Calls，光工具定义就吃掉了 Context Window 的一半，模型每次行动前都要在大量工具里艰难做选择题，速度慢、出错率高 [3](https://docs.langchain.com/oss/python/deepagents/harness)。

他推崇的解法是「Thin Harness」：Harness 只做四件事——循环运行模型、读写文件、管理上下文、执行安全策略，代码量压到 200 行以内；

所有复杂业务逻辑下沉成可复用的 Skill 文件，用 Markdown 编程。

这个框架直接影响了面试评价标准。以前面试官问「你怎么设计一个 Agent」，候选人可以靠 Prompt 技巧混过去。

现在面试官开始追问「你的 loop 跑多少轮会开始衰减」「你用什么策略决定上下文截断」「状态持久化在哪一层做」，这三个问题 Prompt Engineering 救不了你，必须懂 Harness 的职责边界。

Anthropic Claude Managed Agents 的产品设计本身就是这个趋势的最佳注脚。

官方明确说，部署一个生产级 Agent，软件团队不仅要构建 Agent 本身，还要写大量脚手架代码——配置容器、搭基础设施、接可观测性组件。

Claude Managed Agents 把这些全自动化了，企业只需要描述任务、指定工具和权限规则，就能跑起来 [4](https://siliconangle.com/2026/04/08/anthropic-launches-claude-managed-agents-speed-ai-agent-development/)。

换句话说：Harness 层原本是工程师手工打磨的部分，现在要变成可配置的企业级产品了。这个变化映射到面试里，就是对 Harness 工程能力的系统性要求。

记住这个核心逻辑：模型能力趋于同质化，真正拉开差距的是 Harness 的质量。面试官现在要考的，正是你有没有能力建好这个层。

![](https://iili.io/BHPU42f.png)
> 需求一直在变，只有 Harness 还在原地等我

## 小卷导览：本卷覆盖哪些专题，以及它们怎么连成一条面试链路

这一节先给你一张地图，让你知道本卷在全局里处在什么位置、以及各专题之间怎么咬合。

### 知识地图：loop 节点 → Harness 四大职责 → fork 管理 → LangGraph 集成 → 面试追问链

本卷五个主专题的依赖关系如下：

![正文图解 1](https://iili.io/B6h5ttf.png)
> 正文图解 1

loop 和状态是所有 Harness 的地基。你不把一轮 Agent 怎么跑、状态怎么流转搞清楚，后面的调度、监控、错误隔离全都建在沙子上。

四大职责是 Harness 层的具体输出：它怎么调度任务、怎么监控运行、怎么在单步失败时隔离错误、怎么决定往上下文里塞什么——这四件事说清楚了，Harness 的职责边界就清晰了。

fork 管理是实战层：你在生产环境里用 deep-agent，不可能永远用原始版本，你得知道怎么维护自己的定制而不被 upstream 甩开。

LangGraph 集成是扩展视野：不是说你必须用 LangGraph，但知道两者的集成点能帮你回答「你选 Harness 方案的理由是什么」这类高难度追问。

最后的面试追问链是把前三层的知识串成一条真实面试流，让你知道面试官的问题从哪个根知识点长出来。

### 三个难度台阶：概念复述 → 方案取舍 → 项目细节

面试里 Harness 相关的题目可以分成三个难度台阶：

这类问题主要出现在一面，考察你有没有基本认知。

典型问法：「解释一下 agent loop 的节点构成」「Harness 层主要负责什么」「WorkingMemory 和 SemanticMemory 的区别是什么」。

答法就是讲清楚定义和基本结构，不难，但前提是你真的看过源码或文档，不能现场编。

这类问题主要出现在二面，考察你有没有做过权衡。

典型问法：「什么时候用优先级队列而不是 FIFO 调度」「Resolver 和 RAG 在上下文加载上有什么区别」「错误隔离为什么推荐三级降级而不是直接 fallback 到人工」。

这类问题没有唯一正确答案，面试官要听的是你能不能讲清楚 trade-off。

这类问题主要出现在三面或 hr 面后，考察你做过的真实深度。

典型问法：「你们 fork 之后怎么同步 upstream」「遇到 loop 死循环你们怎么排查」「上下文衰减之后你们怎么决定压缩哪一段」。

这类问题必须用真实项目经验来回答，空对空地讲概念基本会挂。

三个台阶的划分不是为了让你挑着准备，而是让你知道自己的现状落在哪一级、需要补哪一级。

本卷会覆盖所有三个台阶的知识，但每个台阶给你的武器不一样：台阶一给定义和结构，台阶二给判断和权衡，台阶三给项目语言和 Demo 路径。

### 本卷学完后能覆盖的面试题清单预览

下面这张清单是你学完本卷后应该能直接回答的问题。面试官不一定原词照搬，但底层逻辑是一样的：

- agent loop 的完整节点路径是什么，每一节点的输入输出是什么？

- WorkingMemory / EpisodicMemory / SemanticMemory 分别承担什么职责？- 循环终止条件有哪三种策略，分别适用什么场景？

- loop 跑久了状态膨胀，你用什么压缩策略？

- 调度层和 Harness 是一回事吗？为什么不是？- 多步推理任务依赖用什么调度策略，为什么？

- 每轮 token 消耗和工具调用链路怎么观测？- 单步失败怎么做到不影响整个 loop？- 上下文注入和「往 prompt 里塞内容」是一回事吗？

- Resolver 机制解决的是什么问题？

- 你们 fork 之后怎么维护自己的修改？- upstream 同步用什么策略，rebase 还是 merge，为什么？- CI 怎么验证本地改动不被 upstream 破坏？

- 你有没有魔改过开源框架，遇到了什么冲突？

- LangGraph 和 deep-agent 的 Harness 本质区别是什么？- 什么场景适合用 LangGraph 替代原生 Harness？

- Anthropic 三 Agent 架构（Planner / Generator / Evaluator）对你的 Harness 设计有什么启发？

这份清单不是haustive，但覆盖了 2026 年 Q1 以来的主流追问方向。学完本卷，你可以拿它做自查。

> Reaction unresolved: [[reaction:dalal-awe|caption=清单拉出来才发现，好几个我还真没想过怎么答]]

## 核心 agent loop 与状态设计：Harness 的地基

无论你用 deep-agent、LangGraph、AutoGen 还是自己从零搭 Harness，核心的 agent loop 设计都是绕不开的地基。

很多候选人在这个环节出问题，不是因为不懂某个框架，而是因为对 loop 的本质理解不够清晰——把循环当成了一个黑箱 Prompt 调用，而不是一个由明确节点构成、有状态流转规律的执行引擎。

### 节点构成与状态流转

一个标准 agent loop 的完整路径是六步，每一步都有明确的输入和输出契约：

![正文图解 2](https://iili.io/B6h7CPV.png)
> 正文图解 2

第一步「用户输入」接收用户的原始请求或 Agent 的内部触发信号，输入契约是一段文本或结构化任务描述。

第二步「上下文组装」从三个存储层里拉取相关内容，拼成完整的推理上下文，这一步是 Harness 的核心战场之一——上下文注入的策略直接决定模型推理质量。

第三步「模型推理」调用 LLM，生成下一步的 action plan，输入是组装好的上下文，输出是一段包含意图判断、工具选择理由和执行指令的推理文本。

第四步「工具选择」解析模型输出的 action plan，决定调用哪个工具（tool calling）、传什么参数。第五步「执行反馈」运行选中的工具，把结果返回给模型做下一轮推理。

注意：工具执行是同步的还是异步的，在这里是第一个重要的设计决策——异步执行可以并发，但会引入状态竞争。

第六步「状态更新」把本轮的工具调用结果、token 消耗、新的中间结果写回 WorkingMemory 或 EpisodicMemory，然后触发下一轮循环。

![](https://iili.io/B6hBtHl.png)
> 六步听着简单，但我每次设计都在第三步和第四步之间卡壳

一个常见误区是把模型推理和工具选择混为一谈：「模型直接决定调用什么工具」——这话没错，但工程实现上，推理结果需要经过一个解析层（Parser）才能变成可执行的工具调用。

Garry Tan 在 YC 文章里提过，解析器（Resolver）解决的是「模型输出的结构化程度」问题：如果模型输出 JSON，解析器校验参数；

如果模型输出自然语言，解析器做意图识别和参数抽取。这个解析层本身就是 Harness 的一部分，不是模型的职责。

### 状态设计三要素

状态管理是 Loop 设计的灵魂。deep-agent 源码里对状态的划分采用了三层设计，这是目前开源社区接受度最高的方案：

WorkingMemory 是循环内可见的临时状态。它只存在单轮 loop 执行的窗口内，存储的是当前推理任务所需的中间结果、部分完成的思考链、以及还未写入长期记忆的临时变量。

每轮 loop 开始时，Harness 从 WorkingMemory 读取当前任务上下文；

每轮 loop 结束时，结果写回 WorkingMemory 或升级到 EpisodicMemory。

WorkingMemory 的典型实现是一个 in-memory 的 Python dict 或一个 asyncio 的 context variable。

关键设计点在于：它的容量必须受 Harness 控制，防止单轮循环因为中间结果膨胀而撑爆上下文窗口。

常见策略是给 WorkingMemory 设定最大 token 阈值，超过阈值触发截断或压缩。

EpisodicMemory 存储的是跨 episode 的任务历史。一个 episode 可以理解为一个完整任务的生命周期：从用户发起到任务完成（或失败）。

EpisodicMemory 记录的是每轮的 action 摘要、工具调用结果、关键决策点，而不是完整的推理过程——那太占空间了。

deep-agent 里 EpisodicMemory 的实现通常是向量数据库（Vector DB）+ 结构化日志的组合。向量用于语义检索，日志用于审计和回放。

这个组合让 Agent 能够在长时任务中「记住」之前做过什么，但又不至于每次推理都把历史全部塞进上下文。

SemanticMemory 是长期知识存储，对应的是 RAG 系统里的外部知识库。它存储的是结构化的领域知识、最佳实践、工具定义、系统提示词等不变或低频变化的内容。

SemanticMemory 通过检索增强的方式注入到上下文，而不是每次都全量加载。

三层记忆的交互逻辑如下：每次上下文组装时，Harness 先从 WorkingMemory 拿当前任务状态，再从 EpisodicMemory 检索相关历史 episode，最后从 SemanticMemory 做知识检索。

三层内容合并后注入模型的上下文输入。这就是为什么上下文注入策略如此关键——三层都往里塞，上下文窗口很快就会溢出；都抽得太少，模型推理质量又不够。

YC Garry Tan 说的「Thin Harness」在这个环节体现得最直接：Harness 的职责不是把所有东西都塞进去，而是精准地决定每一轮塞什么。

### 循环终止条件的三种策略

Loop 不能无限跑下去，必须有终止条件。生产环境里常见三种策略，各有适用场景：

模型推理输出中包含一个预定义的停止标记（如 `<agent_stop>` 或特定 JSON 字段），Harness 检测到这个标记后主动终止循环。

这是最优雅的方式，但依赖模型的配合——不是所有模型都会可靠地输出 stop token，需要在 Prompt 里明确要求，并做输出校验。

硬编码最大循环次数，超过就强制退出并返回当前结果。这是最简单粗暴的方式，优点是实现简单、可预测，缺点是可能提前截断未完成的任务。

适用场景：任务复杂度已知且边界清晰的场景，比如固定步骤的数据处理 pipeline。

模型在每轮推理后输出一个自评估的置信度分数（0–1），Harness 检测到连续 N 轮置信度低于阈值时，认为任务陷入停滞，触发退出或人工介入。

这是最「聪明」但实现成本最高的策略，需要模型支持自评能力，而且阈值设定需要根据任务类型调参。

一个面试常考点是：这三个策略可以组合使用。

比如先用 max_iterations 做兜底保护，同时在 Prompt 里要求模型输出 stop token，在工具执行层检测置信度下降。

三层保护比单层稳定得多，但代价是实现复杂度上升。面试官追问「你们用了什么策略」时，重点不是哪个策略更好，而是你能不能讲清楚 trade-off 和你们的选型理由。

![](https://iili.io/qbiS47S.png)
> 面试官：那你这个置信度阈值怎么标定的？

## Harness 层职责边界：调度、监控、错误隔离、上下文注入

Harness 这个词在英文里有「驾驭」「挽具」的意思，放在 Agent 工程语境里，它指的就是包裹在模型外围、决定模型何时行动、记忆什么、出错怎么办的那层代码。

Garry Tan 说大多数人的 Harness 太厚，指的就是这层塞了太多不该塞的东西。

但很多人对 Harness 的职责范围本身就没搞清楚，一上来把「调度」当成了 Harness 的全部——这是最常见的误答，面试官会直接追杀掉。

Harness 的完整职责边界应该包含四个模块：调度（Scheduling）、监控（Observability）、错误隔离（Error Isolation）、上下文注入（Context Injection）。

下面逐个拆开讲。

### 调度（Scheduling）

调度解决的是「谁先跑、谁后跑、谁可以并行」的问题。这不是单纯的节拍控制，复杂任务里任务之间存在依赖关系：A 任务的输出是 B 任务的输入，所以 B 必须等 A 完成才能开始；

同时 C 任务和 D 任务互相独立，可以并发执行。

asyncio + task graph 是 Python Agent 场景里最常见的调度实现组合。

deep-agent 的 Harness 内部用 asyncio 管理协程，用 task graph 描述任务之间的依赖关系：节点代表任务，有向边代表依赖约束，拓扑排序决定执行顺序。

这套方案的好处是：调度逻辑和执行逻辑分离，任务图可以动态修改，适合复杂的多步推理场景。

一个面试高频追问是：「什么场景需要优先级队列而不是简单的 FIFO？」答案藏在任务价值密度的差异里：如果所有任务价值相同，FIFO 够用；

但如果有些任务是高优的（比如用户阻塞任务），有些是低优的（比如后台刷新任务），FIFO 就会让高优任务被低优任务堵住。

优先级队列让高优任务在任何时候都能插队先跑，但代价是低优任务可能饿死——这就是 trade-off，没有绝对更好的方案，只有对当前场景更合适的决策。

### 监控（Observability）

Agent 的可观测性比普通微服务更难做，因为模型的推理过程是个黑箱，你没法像看 HTTP 请求那样直接看到「模型在想什么」。

但 Harness 层是白盒的——它知道自己发了多少 token、调用了哪些工具、每个工具的返回时间是多少、当前处在 loop 的第几轮。这就是监控数据的来源。

Anthropic Claude Managed Agents 的 runtime 监控设计值得参考。

官方文档提到，托管服务会追踪每个 Agent 的 token 消耗、工具调用链路、延迟分布和错误率 [4](https://siliconangle.com/2026/04/08/anthropic-launches-claude-managed-agents-speed-ai-agent-development/)。

这些指标不是给模型看的，是给运维和开发团队看的——当你发现某个 Agent 的平均 token 消耗在三个月内增长了 40%，你就知道需要优化上下文注入策略了。

监控和 Harness 紧耦合的动机很直接：Harness 是 Agent 里唯一有全局视野的组件。

模型只知道当前这轮，工具只知道自己的输入输出，但 Harness 知道整个任务的执行历史、状态流转路径和资源消耗曲线。

这个全局视图让 Harness 成为监控数据的最优埋点位置——你在 Harness 外围接可观测性组件，比在每个工具里单独埋点高效得多。

一个面试常考点是：「你的监控数据怎么影响 Harness 的行为？」这是监控从「观察」升级到「自适应」的关键一步。

答案是：Harness 应该根据监控数据动态调整调度策略或上下文注入策略。

比如监控发现连续三轮的工具调用返回时间都在上升，Harness 可以决定降低并发度或切换到更轻量的工具实现。

但这个自适应逻辑本身就要小心——自适应意味着 Harness 在运行时修改自己的行为，这会引入调试困难和不可预测性，YC 的「Thin Harness」哲学建议把自适应逻辑也尽量放在 Skill 层而不是 Harness 核心。

![](https://iili.io/BgG4021.png)
> 监控数据在涨，我的心率也在涨

### 错误隔离（Error Isolation）

错误隔离是生产环境的生死线。Agent 的工具调用涉及外部系统——API 会超时、数据库会断开、网络会抖动。

如果单步错误直接导致整个 loop 崩溃，用户体验是灾难性的，而且排查起来极其困难，因为你不知道是模型推理错了还是工具本身出了问题。

三级降级是 Harness 错误隔离的标准设计模式，从里到外分别是：

工具调用失败后，Harness 先自动重试。重试策略需要控制两个参数：重试次数（比如 3 次）和退避间隔（比如指数退避：1s → 2s → 4s）。

不是所有错误都值得重试——如果是参数校验失败（400 Bad Request），重试 100 次还是失败。重试只对瞬时错误（超时、网络抖动、服务端临时不可用）有效。

如果重试耗尽仍然失败，Harness 可以把任务降级到一个沙箱环境执行。沙箱通常是一个资源受限但更稳定的执行环境，比如把需要调用外部 API 的任务降级成只读本地缓存的版本。

沙箱降级的代价是任务功能缩减，但至少不会完全崩溃。

Anthropic Claude Managed Agents 在每个 Agent 启动时自动分配隔离容器就是这个思路的企业级实现——容器本身就是一个软硬结合的沙箱 [4](https://siliconangle.com/2026/04/08/anthropic-launches-claude-managed-agents-speed-ai-agent-development/)。

重试和沙箱都失败后，Harness 触发人工介入机制。通常是发一条告警给值班工程师，同时把当前任务状态固化下来供排查。

人工介入不是错误，是 feature——它意味着 Harness 知道自己什么时候该放弃，而不是硬撑到系统崩溃。

面试里「你遇到过什么线上故障」是经典高频题。Harness 错误隔离是这类问题的最佳答题素材，因为它的故障模式是可预测的：工具超时、状态不一致、loop 死循环、上下文溢出。

你能说清楚三级降级的设计逻辑和你们实际踩过的坑，比背任何八股文答案都有说服力。

⚠️ **踩坑提醒**：很多候选人把错误隔离等同于「加 try-except」。这是最低级的误答。

面试官追问「那你的 try-except 里具体做了什么」时，如果你只说「打印日志然后返回错误」，这基本等于没答。

错误隔离的核心是「让错误有界」——错误不能从工具层穿透到 Harness 层，更不能穿透到用户可见的输出层。讲清楚三层降级和每层的决策逻辑，才是有效答案。

### 上下文注入（Context Injection）

上下文注入是 Harness 职责边界里最容易产生误解的一项。大量候选人把「上下文注入」等同于「往 system prompt 里塞更多内容」，然后就被追问追到墙角：塞多少算够？

塞多了模型变慢怎么办？不同任务塞的内容不一样怎么处理？

这些问题之所以是坑，是因为它们的前提就错了。

上下文注入不是往 prompt 里塞内容，而是 Harness 根据当前任务状态，动态决定「从哪三层记忆里取什么内容、取多少、按什么格式注入」。

YC Garry Tan 把这个职责叫做「Resolver 机制」——Resolver 不是 RAG，Resolver 的核心是「按需加载」而不是「全量塞入」。

用一个具体例子说清楚这个区别。假设你的 Agent 要处理一个用户请求：「帮我分析这家公司最近的融资情况」。

用「全量塞入」方式：Harness 从向量数据库里检索所有关于这家公司的文档，可能有 50 份，每份平均 2000 token，一股脑全塞进上下文。

结果：上下文窗口爆炸，模型推理速度下降，而且 50 份文档里大量内容和当前问题无关，模型注意力被稀释。

用「Resolver 机制」：Harness 先解析任务类型——这是一个「融资分析」任务，需要的是这家公司的融资历史、最新轮次、领投方和估值变化。

Resolver 根据任务类型只加载四个最相关的文档片段，每个 500 token，总共 2000 token，足够推理又不会溢出。

这背后的决策逻辑是 Harness 的一部分，叫做「任务路由」——不同类型的任务有不同的上下文注入策略，不是所有任务都往里塞同样多的内容。

这个设计带来的面试追问很直接：「你们的 Resolver 怎么判断当前任务需要什么上下文？

」答案是：Resolver 通常由两层组成——任务分类器（判断任务类型）+ 上下文策略表（每种任务类型对应的注入规则）。

任务分类器可以是 LLM 本身（让模型自己判断需要什么），也可以是一个规则引擎（关键词匹配任务类型），或者是两者结合。策略表是手工配置的领域知识，随着系统运行逐渐积累。

⚠️ **踩坑提醒**：把上下文注入等于「塞 prompt」是 Harness 面试里最常见的死法。这个误答会触发一连串追问：「那你塞多少？」「不同任务怎么区分？

」「长任务和短任务一样处理吗？」——每个追问都在暴露你对这个职责边界的理解深度不够。面试官真正想听的是你能不能说清楚「注入策略」而不是「注入内容」。

> Reaction unresolved: [[reaction:dalal-bow|caption=我悟了，原来上下文注入是一套策略，不是一堆文本]]

## 二次魔改工程方法：fork 管理与 upstream 同步

真正在生产环境里用过开源 Agent 框架的人，都会遇到同一个坎：框架本身做 80% 的事情很顺手，但剩下的 20% 需要针对业务场景做定制——这时候该怎么办？

直接改源码是最直观的做法，但很快你会发现：上游更新了，你的改动被覆盖了；提 PR 周期太长业务等不了；团队里其他人不清楚你改了啥，一合并代码就炸。

二次魔改不是 hack，是工程现实。关键是让定制改动和上游代码保持一种「可分离、可同步、可解释」的关系。

### fork 管理最佳实践

GitHub 上凡是需要做 Agent 定制化的仓库，fork 管理水平一眼就能看出来。

最差的做法是直接在 `node_modules` 或 `site-packages` 里改源码。

好处是立刻生效，坏处是：改了什么完全不可追溯，重装依赖后所有改动灰飞烟灭，而且你的改动和上游版本之间的 diff 是零——等于没有记录。

deep-agent 这类活跃的开源 Agent 项目，官方推荐的定制路径是创建一个 `custom_harness.py` 模块，让它继承或组合框架的核心 Harness 类，然后把业务定制逻辑写在里面 [1](https://github.com)。

这样上游更新后，你的改动仍然保留在一个独立文件里，merge 冲突的面积也最小。

如果官方没有提供足够的扩展点，社区里常见的手法是 monkey patch——在模块加载时动态替换某些函数或类。

这比直接改源码风险更高，因为上游任何内部 API 变化都会让 patch 失效，但它确实是最快的「绕过官方限制做定制」方案。

面试里聊到这一步，面试官真正想判断的是你有没有「在不改源码的前提下做定制」的系统性思考。

能讲清楚「继承 vs. monkey patch vs. 直接改源码」的取舍，比只说「我提过 PR」有说服力得多——后者只是参与上游，前者才代表你对整个系统的责任边界有判断。

⚠️ **踩坑提醒**：很多候选人说「我魔改过 LangChain/LangGraph」，但追问「你改了什么、怎么保证上游更新不覆盖」就答不上来了。

没有维护策略的魔改等于没改——面试官问的就是这部分。

### upstream 同步策略

fork 管理里最容易被忽略、也是最能拉开工程水平差距的一步，是 upstream 同步策略。

先说结论：定期 `git rebase upstream/main` 而非 `git merge upstream/main`，是维护本地修改 patch 的标准姿势。

merge 会生成一条 merge commit，把上游提交和你本地提交混在一起，本地 patch 的 diff 边界就模糊了。

rebase 则把你的改动「重放」到 upstream 最新提交之上，最终历史是一根干净直线，每个 commit 对应一个独立的逻辑改动。

具体到 deep-agent 这类项目，推荐的维护节奏是：

第一步，在 fork 仓库里创建一个本地的 `custom/` 目录，所有业务定制都写在这个目录下面，同时在项目根目录放一个 `patches/` 文件夹，用 `git diff upstream/main...HEAD > patches/my-custom.patch` 把所有本地改动导出成一个独立的 patch 文件。

这个 patch 文件的价值在于：它是一个自包含的改动清单，可以在任何时间点重新应用到 upstream 的任意版本上。

第二步，用 CI 验证 upstream 更新后本地 patch 仍然有效。

每次上游发版后，跑一遍 `git am patches/*.patch` 把 patch 应用到新版本上，如果出现冲突，CI 会报告失败并告诉你冲突在哪两个文件之间。

这个反馈循环比手动合并省力得多，而且冲突记录本身就是面试里可以讲的工程细节。

第三步，给 patch 写维护日志。每次 rebase 成功或冲突解决后，更新一条记录：「本次同步解决了哪些冲突，为什么这么解决」。

这个日志在面试里可以直接拿来说：「我维护的 fork 在上游更新了 23 次之后仍然稳定运行，只有两次需要手动介入解决冲突」——数字比任何形容词都有说服力。

![](https://iili.io/B9f4ACB.png)
> 上游合并了我 fork 的 PR，结果我的本地 patch 全炸了

### fork 经验的面试价值

「你有没有魔改过开源框架」是 Agent 工程师面试里的高频题，但它不是一个简单的是非题——面试官真正在找的是你对「定制边界」的理解深度。

大多数候选人回答这个问题的结构是：「我在 xxx 框架上加了一个 xxx 功能，然后给官方提了 PR」。

这个回答能说明你有参与上游的意识，但不足以说明你有系统性的工程判断——提 PR 是一个社区行为，不是工程行为。

更有价值的回答结构是四步展开：定制目标是什么（业务场景约束）、为什么选择 fork 而不是直接改源码（长期维护成本考量）、怎么管理本地改动和上游更新的冲突（diff 维护策略）、上线后怎么验证定制逻辑没有被上游破坏（CI 验证）。

能把这四步讲清楚的候选人，面试官基本不会再追问了——因为他证明了在「改框架」这个动作背后，有一套完整的技术决策链条，而不是一时兴起。

一个真实的数据锚点：YC Garry Tan 在那篇 70 万阅读量的文章里指出，Anthropic 2026 年 3 月意外泄露的 Claude Code 源码里，光是 Harness 相关的定制逻辑就有数千行——连 Anthropic 自己都在 fork 和深度定制 [2](https://tonybai.com/2026/04/19/thin-harness-fat-skills)。

这不是一个可以回避的工程问题，是所有认真做 Agent 的人都必须面对的现实。

---

## deep-agent 与 LangGraph 的集成点与扩展边界

这部分是整个小卷里最容易搞混的章节。deep-agent 是一个开源的完整 Agent 运行时，LangGraph 是一个图结构化的工作流编排库——两者解决的问题有重叠，但架构思路完全不同。

搞清楚它们的关系，不是为了在面试里「选边站」，而是为了在系统设计里找到正确的集成层次。

### 共同点：状态 + 节点 + 边

先说两者的共同地基。它们都把 Agent 看作一个「由节点和边构成的系统」，节点是执行单元，边是状态或控制权的传递路径。

LangGraph 底层用的是 Pregel 风格的 BSP（Bulk Synchronous Parallel）计算模型——每个超级步里，所有节点并行执行，然后同步，再进入下一个超级步。

这套模型天然适合把 Agent 流程显式建模成一张图：每个节点是一个 LLM 调用、一个工具执行或一个条件判断，每条边代表状态流转 [3](https://www.langchain-ai.github.io/langgraph/concepts/low_level/)。

deep-agent 的 Harness 内部也是一个 loop 模型：用户输入 → 上下文组装 → 模型推理 → 工具选择 → 执行反馈 → 状态更新 → 下一轮。

这个 loop 里的每一个「节点」同样是一个执行单元，边是状态在每轮之间的传递。

Anthropic 在 2026 年 4 月发布的三 Agent Harness 设计提供了一个中间态参考：他们把一个完整任务拆成 Planning Agent、Generation Agent 和 Evaluator Agent 三个独立组件，Planning Agent 生成计划，Generation Agent 负责执行，Evaluator Agent 独立做质量评估 [4](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/)。

这三个 Agent 之间的协作既不是纯 Pregel 也不是纯 loop，而是一种「结构化分工 + 独立评价」的组合——这恰好是 deep-agent 和 LangGraph 都可以各自实现的一种模式。

![正文图解 3](https://iili.io/B6h7lKN.png)
> 正文图解 3

两者还有一个共同的设计哲学：状态是不可变快照还是可原地修改。

LangGraph 的状态更新默认是创建新快照（immutable），deep-agent 的三层存储里 WorkingMemory 是可原地更新的。

这两种状态模型的取舍直接影响了系统的可回溯性和并发安全性，是面试里常常被追问的设计决策点。

### 核心差异

它们的区别才是面试里真正会被追问的地方。

LangGraph 的状态流转是「显式图」——你用代码定义一张图，节点是什么、边是什么、每个节点接受什么输入、输出什么状态，一清二楚。

这套设计的好处是流程可视化强，Debug 工具可以直接画出整张图的执行路径，任何人都能看懂「这个任务跑到了哪个节点、为什么走这条边」。

deep-agent 的封装是「隐式 loop」——状态流转逻辑藏在 Harness 类的内部，外部调用者不需要知道 WorkingMemory 和 SemanticMemory 之间怎么交互，只需要调用 `agent.run(task)` 就行。

这套设计的好处是调用简单，适合长时运行的自主 Agent，比如你要让一个 Agent 持续运行 8 小时处理一整个数据清洗 pipeline，deep-agent 的封装更省心。

换句话说：LangGraph 让你看清楚每一步怎么走，deep-agent 让你不用管每一步怎么走。

这不是技术优劣之分，是使用场景的分化——这也是为什么「我选 LangGraph 还是 deep-agent」本身就是一个伪问题，真正的问题是「在这个具体任务里，我需要的是流程可见性还是运行封装性」。

### 集成路径

两条框架在实际项目里不是非此即彼，而是可以组合使用的。下面两种集成路径都是工程里真实发生过的。

**路径一：LangGraph 嵌入 deep-agent Harness 作为某个 node 执行器。**

适合场景：你的整体任务有一个复杂的多步流程，需要显式建模和可视化（比如一个需要 10 个步骤的客服对话流程），但其中某几个步骤（比如「搜索知识库并总结」）需要 deep-agent 的长时自主运行能力。

实现方式：在 LangGraph 的 StateGraph 里创建一个节点，节点的 `invoke()` 方法里初始化一个 deep-agent Harness 实例，调用 `harness.run(subtask)`，把结果作为节点输出返回给 LangGraph 的状态。

deep-agent 的 loop 在这个节点内部完成了，LangGraph 只关心它的输出。

**路径二：deep-agent Harness 调用 LangGraph 做部分子流程编排。**

适合场景：你的 Agent 有一个通用任务类型（比如「处理订单退款」），这个任务类型下面有多个子步骤需要条件分支和并行处理，但这些子步骤的编排逻辑经常变化。

实现方式：在 deep-agent 的 Harness 里，当任务类型判断命中「需要子流程编排」时，动态初始化一个 LangGraph StateGraph，把子任务交给 LangGraph 执行，结果返回给 deep-agent 继续处理。

⚠️ **踩坑提醒**：把 Harness 等同于「调度层」是面试里另一个高危误答。

Harness 和调度不是同一层——调度解决的是「任务执行顺序」，Harness 解决的是「Agent 的全局运行保障」，包括上下文管理、错误恢复、状态持久化和可观测性。

把 Harness = 调度层的候选人，会在「那错误隔离算 Harness 还是调度」「上下文注入在哪个模块做」这类追问里立刻暴露理解缺口。

![](https://iili.io/qbiS47S.png)
> 等等，Harness 真的不只是调度？我需要重新理解一下

---

## 面试高频追问路径：本卷知识点在真实面试里怎么被连续追问

这部分是把前文的知识点串成「面试现场能直接用的表达链条」。每个追问链不是随机拼凑的，它们对应真实面试里面试官的实际追问顺序——通常从概念确认开始，逐层深入，直到摸到候选人的真实理解深度。

### 追问链 1：loop → 状态 → 上下文衰减 → 压缩策略 → Resolver vs. RAG

这条追问链从 Agent 的核心 loop 开始，目标是摸清候选人对「长时运行 Agent 的状态管理」到底有多少实战理解。

第一问通常是：「能描述一下你们的 Agent loop 具体是怎么跑的吗？

」这是概念确认题，候选人的回答如果只说「输入 → 调用模型 → 返回结果」，说明他对 loop 的理解还停留在「调用 API」层面，不会触发追问。

如果能讲到「上下文组装 → 模型推理 → 工具选择 → 执行反馈 → 状态更新 → 下一轮」，追问就会自然进入第二层。

第二问：「长时任务跑了 50 轮之后，上下文窗口还够用吗？你们怎么处理？」能回答「三层存储 + 动态注入」的候选人，说明有实战经验。

下一层追问是：「你们怎么决定每一轮塞什么上下文进去？」——这就是 Resolver 机制的入口。

第三问：「你们的 Resolver 和 RAG 有什么区别？」这个追问有陷阱。很多候选人会说「RAG 是检索，Resolver 是注入」，这个区分是对的，但不够深入。

面试官真正在追问的是：Resolver 做的是什么粒度的决策？任务分类器的实现方式是什么？策略表是怎么维护的？

这些问题如果答不上来，说明候选人对上下文注入的理解还停留在「从数据库拿数据往里塞」的层面。

第四问（如果前面都答得不错）：「你们有没有遇到过上下文注入策略导致模型推理质量下降的情况？怎么发现的？怎么修复的？

」这是追问实战踩坑经历的，通常是淘汰题——能讲清楚一次具体故障和修复过程的候选人，基本能拿到这轮的通过。

### 追问链 2：Harness vs. LangGraph → 选型理由 → 迁移成本

这条追问链从技术选型切入，目标是判断候选人有没有系统级视野。

第一问通常是开放式的：「你们在项目里用的是 LangGraph 还是自己写的 Harness？为什么？

」这个问题的陷阱是「为什么」——只回答「因为 LangGraph 生态好」不够，面试官想知道的是你有没有对比过两者的取舍。

第二问：「LangGraph 的状态管理和你们 Harness 里的状态管理有什么本质区别？

」这里考察的是对 Pregel/BSP 模型 vs. 事件驱动 loop 模型的理解深度。

能讲清楚「显式图 vs. 隐式 loop」「immutable vs. 可原地更新」这两个维度的候选人，追问链会继续深入。

第三问：「如果现在让你们把 Harness 里的一部分逻辑迁移到 LangGraph 重写，你打算怎么做？迁移成本有哪些？

」这是系统设计层面的追问，考察的是候选人对两个系统边界的理解深度。迁移成本通常包括：现有状态的迁移路径、历史任务的重放测试、不同工具实现的重新适配。

能把这些讲清楚的候选人，面试官基本不会再追了。

⚠️ **易错点预警**：把 Harness = 调度层会在追问链 2 的第二问直接暴露——因为调度只是 Harness 四大职责之一，不是全部。

如果候选人在第一问就说「我们用 Harness 做调度」，面试官大概率会追问：「那监控呢？错误隔离呢？上下文注入放在哪一层？

」能讲出四大模块的候选人，说明他对 Harness 职责边界的理解是完整的。

### 追问链 3：魔改开源框架 → fork 管理 → diff 冲突处理

这条追问链从项目经验切入，目标是摸清候选人的工程规范意识。

第一问：「你魔改过哪些开源框架？为什么选择 fork 而不是直接贡献上游？

」这里要展示的不是「我提过 PR」，而是「我在 fork 和提 PR 之间做过分析」——通常 fork 更快但维护成本高，贡献上游更规范但周期长，两者之间的取舍理由才是重点。

第二问：「你的本地改动是怎么维护的？每次上游更新你是 merge 还是 rebase？为什么？

」这个问题直接考的就是 upstream 同步策略。能说出「rebase 保持 patch 干净」并解释清楚 merge commit 的副作用的候选人，说明有过真实的维护经验。

第三问：「diff 冲突怎么处理？有没有出现过严重冲突导致你的定制逻辑必须重写的？」能把具体冲突场景讲清楚的候选人很少——能讲的通常是真的踩过坑的，面试官会在这里感受到真实性。

---

## 没有真实项目怎么补：Harness 视角的简历写法与项目包装

这条不是鸡汤，是给「确实没有工业级 Agent 项目」的候选人看的具体操作路径。

先说一个现实：校招生和转专业选手很难有真实的 8 小时生产 Agent 跑在生产环境里的经历。

但这不代表你不能在简历和面试里展示 Harness 层面的工程判断——关键是把学习过程中的观察和实验，翻译成面试官能认可的项目表达。

### 简历关键词对齐

简历上写什么，决定了面试官的第一印象。很多候选人的问题是：明明做过的项目里包含 Harness 相关的职责，但不会用专业术语表达。下面是一组对应关系，每组都是真实项目经历里常见的场景：

「我负责的任务调度模块」→ Harness 的 Scheduling 职责。具体写法可以是「基于 asyncio task graph 实现多步推理任务调度，支持任务依赖拓扑排序与优先级队列」。

「我设计过一个 Redis 缓存层」→ Harness 的上下文注入策略。具体写法可以是「实现分层上下文缓存，将高频访问的状态压缩后注入模型上下文，将低频历史下沉至向量存储」。

「我做过服务降级和重试」→ Harness 的错误隔离。具体写法可以是「为 Agent 工具调用设计三级降级：本地重试 → 沙箱降级 → 人工介入，故障恢复时间从平均 45 分钟降至 8 分钟」。

这些写法不要求你有完整的生产经验——它们只需要你在学习 deep-agent 和 LangGraph 的过程中，对照着「Harness 四大职责」做过思考和实验，就能写出来。

### Demo 补强路径

如果简历还是空白，从零构建一个 Harness 相关 Demo 是可行路径，推荐节奏如下：

第一步，用 deep-agent 的最小可行 Agent 跑通一个完整任务。

GitHub 上的 deep-agent 仓库提供了快速起步的 example，clone 下来跑通，记录下 Agent loop 从启动到终止的完整日志 [1](https://github.com)。

第二步，给 Agent 加一个自定义 tool。

这是展示 Harness 扩展能力的最小粒度动作——比如加一个「查询本地天气」的 tool，并在 harness 里注册这个 tool，然后观察 agent.run() 调用这个 tool 时，WorkingMemory 里的状态变化。

第三步，在 README 里写清楚你的定制逻辑，包括「为什么需要这个 tool」「它在 Harness 的工具调用链路里处于什么位置」「如果工具调用失败，Harness 会怎么处理」。

这个 README 就是你面试时可以拿出来展示的项目文档——能指着代码讲清楚自己的设计决策，比任何简历描述都有说服力。

第四步（可选但加分），用 LangGraph 把这个 demo 里的任务流程重写一遍，对比两种实现的复杂度差异。

GitHub 上已经有不少「deep-agent + LangGraph」的集成示例，可以参考 [3](https://www.langchain-ai.github.io/langgraph/concepts/low_level/)。

如果能完成前四步，你的简历上就可以写：

> **deep-agent 自定义 Agent 项目**：在 deep-agent 框架上扩展自定义工具，完成多步推理任务调度；集成 LangGraph 做子流程编排，对比两种架构的上下文注入策略差异；撰写技术文档 2000+ 字。

这句话里每一个逗号后面都是一个可以展开追问的点，面试官随便挑一个追问，你都有真实内容可以讲。

> Reaction unresolved: [[reaction:dalal-bow|caption=终于知道怎么把学习过程变成面试素材了]]

---

## 参考文献与延伸学习

1. **deep-agent GitHub 仓库**：Harness 工程实践的核心参考，包含 core loop、custom_harness 扩展模式和三层存储实现。

2. **YC Garry Tan「Thin Harness, Fat Skills」**：Tony Bai 整理版本（2026-04-19），YC 掌门人阐述 Harness 层作为 Agent 真正护城河的架构哲学。

3. **LangChain/LangGraph 官方文档**：LangGraph 低层级架构概念，Pregel/BSP 模型与状态管理机制。

4. **Anthropic Claude Managed Agents**：SiliconANGLE（2026-04-09）与 Wired（2026-04-08）同期报道，Harness runtime 监控设计与隔离容器实现细节。

5. **Anthropic 三 Agent Harness 设计**：InfoQ（2026-04-04），Planning/Generation/Evaluator 三 Agent 分工架构，context reset 与结构化 handoff artifact。

6. **牛客网 2026-04 面经合集**：阿里、字节、蚂蚁 Agent 开发面试题整理，包含 Java/Spring Boot/AOP 等技术栈追问。

7. **OpenAI Careers**：Applied AI Engineer, Codex Core Agent JD（$230K–$385K），Anthropic PBC Claude Managed Agents 年化收入突破 $30B（2026 年数据）。

8. **牛客网「想入行 AI Agent？2026 最全技术学习清单」**（2026-04-24）：23 个主流框架、3 个月学习路线、面试高频追问清单，整理了 ReAct、Tool Calling、RAG 与多 Agent 协作的核心知识点。

## 参考文献

1. [github.com](https://github.com)

2. [tonybai.com](https://tonybai.com/2026/04/19/thin-harness-fat-skills)

3. [langchain-ai.github.io](https://www.langchain-ai.github.io/langgraph/concepts/low_level/)

4. [Anthropic Designs Three-Agent Harness Supports Long-Running Full-Stack AI Development](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/)

---

![文末收口图](https://iili.io/qLIhGYg.png)
