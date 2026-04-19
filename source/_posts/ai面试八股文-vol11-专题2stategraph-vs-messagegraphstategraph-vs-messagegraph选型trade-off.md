---
layout: "post"
article_page_id: "3470f85d-e690-81fe-9d04-c32713b3e473"
title: "【AI面试八股文 Vol.1.1 | 专题2：StateGraph vs MessageGraph】StateGraph vs MessageGraph选型trade-off"
description: "本专题深入拆解 LangGraph 中 StateGraph 与 MessageGraph 的选型 trade-off：先给出 30 秒开口版模板答案，再展开两类图状态机的核心差异（状态schema vs 消息历史）、并发安全边界、Chec"
categories:
  - "AI面试八股文 Vol.1.1"
  - "专题2：StateGraph vs MessageGraph"
tags:
  - "LangGraph"
  - "StateGraph"
  - "MessageGraph"
  - "状态机"
  - "Agent 框架"
  - "AI 面试八股文"
  - "多 Agent 协作"
  - "Vol.1.1"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/19/ai面试八股文-vol11-专题2stategraph-vs-messagegraphstategraph-vs-messagegraph选型trade-off/"
img: "https://iili.io/BgGOXLX.jpg"
swiperImg: "https://iili.io/BgGOXLX.jpg"
permalink: "posts/2026/04/19/ai面试八股文-vol11-专题2stategraph-vs-messagegraphstategraph-vs-messagegraph选型trade-off/"
date: "2026-04-19 00:33:00"
updated: "2026-04-19 01:04:00"
cover: "https://iili.io/BgGOXLX.jpg"
---

翻了一圈面经，发现 StateGraph 和 MessageGraph 这道题出现的频率高得离谱。

很多候选人知道这两个名字，但被追问「它们的状态存储方式有什么本质区别」「在多 Agent 协作场景下选哪个更合适」或者「Checkpoint 机制在两者里是怎么工作的」时，往往答不上来。

要么把两者混为一谈，要么只背了个概念就上场，结果在二面、三面被追问细节时当场卡壳。

这篇文章就是要把这两个选型彻底拆清楚：先给模板答案让你能立刻开口，再讲清楚背后的判断逻辑，最后补上面试官真正想追问的几个方向，以及项目里该怎么把这两个概念落到工程语境里。

![](https://iili.io/BHPgY4s.png)
> 这道题几乎是 AI Agent 面的标配了

## 问题：面试里到底怎么问 StateGraph 和 MessageGraph

### 标准问法

面试中这道题最常见的问法是：

> 「LangGraph 里 StateGraph 和 MessageGraph 有什么区别？分别在什么场景下用？」

这是一个典型的「概念辨析 + 工程判断」题。面试官不是在考你背定义，而是在看你有没有真正理解两种状态机在工程上的取舍。

还有一种更深入的变体：

> 「如果让你设计一个多 Agent 协作的工作流，你怎么决定用 StateGraph 还是 MessageGraph？」

这类题直接把候选人放到架构决策者的位置，考察的是综合判断能力，不只是知识点记忆。

### 常见变体

在实际面试中，这道题的变体很多，但核心都绕不开以下三个维度：

**变体一：原理层面**

> 「StateGraph 的状态管理和 MessageGraph 的消息历史，在底层是怎么实现的？有什么区别？」

这类追问是在确认候选人是否真正理解 LangGraph 的状态传递机制，而不是只会调用 API。

**变体二：并发与安全层面**

> 「在多个节点同时读写状态时，StateGraph 和 MessageGraph 各自有什么并发安全风险？」

这是考察候选人对生产环境中状态竞争问题的理解，属于二面甚至三面级别的高频追问。

**变体三：持久化层面**

> 「LangGraph 的 Checkpoint 机制在这两种图里分别是怎么工作的？断点恢复有什么区别？」

这类问题直接指向生产级部署的关键能力，是面试官判断「你到底有没有在真实项目里用过」的核心切入口。

![](https://iili.io/BgGw3Yl.png)
> 变体三这道追问挂掉的人最多

## 模板答案：30 秒开口版 + 展开版

### 30 秒开口版

如果你只能给面试官一段话，记住这个结构：先说本质区别，再说选型原则，最后给一个具体场景判断。

> 「StateGraph 和 MessageGraph 本质上都是 LangGraph 的图状态机实现，核心区别在于**状态的组织方式**：StateGraph 用一个共享的 TypedDict（或 Pydantic）schema 作为统一状态槽，每个节点读和写的是同一个状态对象；MessageGraph 则把状态完全建模为消息历史列表，每个节点操作的是一条条消息，而不是共享的键值状态。选型上，如果你的工作流需要多个节点频繁读写相同的结构化字段（比如订单状态、用户画像、审批结果），优先用 StateGraph；如果你的场景是**对话式 Agent**、需要完整保留消息链做 RAG 或者多轮推理，就用 MessageGraph。」

这段话在 30 秒内覆盖了：本质区别（状态组织方式）、选型原则（结构化字段 vs 消息历史）、具体场景判断（多 Agent 协作 vs 对话式），已经足够过第一关。

### 展开版

在面试官表示「展开说说」或者「你刚提到了结构化字段，具体怎么理解」之后，你需要把两个核心差异讲得更透。

**差异一：状态 schema 的本质不同**

StateGraph 使用一个显式定义的 State 对象。

这个 State 可以是 TypedDict，也可以是 Pydantic BaseModel，里面包含你想在工作流中流转的每一个字段。比如一个订单审批工作流：

```python
from typing import TypedDict

class OrderState(TypedDict):
    order_id: str
    amount: float
    status: str
    approval_result: str
    retry_count: int
```

每个节点函数的签名接收 `state: OrderState`，返回 `{**state, "status": "approved"}` 这样的增量更新。

整个工作流中，所有节点看到的是同一份状态对象，字段的读写是直接的。

MessageGraph 则完全不同。它没有显式的 State schema，LangGraph 默认使用 `MessagesState`，把状态建模为一个 `messages` 列表。

每个节点的输入输出都是消息：

```python
from langgraph.graph import MessagesState

# MessageGraph 默认状态只有 messages 字段
class AgentState(MessagesState):
    pass
```

节点通过 `HumanMessage`、`AIMessage`、`ToolMessage` 这些消息类型来传递信息，整个状态就是一条时间线。

**差异二：并发安全的边界不同**

这是面试里被追问最多的地方。StateGraph 的共享状态在单线程执行时是安全的，因为 LangGraph 的执行引擎保证了节点串行执行。

但一旦你引入了**条件边（conditional edges）**或者**循环节点**，多个节点可能在同一次状态快照上操作——这时如果两个节点同时修改同一个字段，就存在竞争风险。

MessageGraph 的消息列表天然是追加写的（append-only），每个节点只往消息列表里 `append`，不会修改历史消息。

因此在消息追加这个维度上，并发风险比 StateGraph 的原地写更可控。

但 MessageGraph 也面临问题：如果某个节点需要修改历史消息中的某个字段（比如纠正 LLM 的错误输出），就必须走全量覆写路径，而不是增量更新。

**差异三：Checkpoint 和断点恢复的能力差异**

LangGraph 的 Checkpoint 机制允许工作流在任意节点暂停并恢复。StateGraph 的 Checkpoint 存储的是完整的状态快照，包括所有字段的当前值。

恢复时，LangGraph 把整个状态对象重新注入到工作流中，从断点继续执行。

MessageGraph 的 Checkpoint 存储的则是消息列表的完整历史。由于消息是追加型的，Checkpoint 的体积会随对话轮次线性增长。

在长对话场景下，一个 MessageGraph 的 Checkpoint 可能比同等复杂度的 StateGraph 大几个数量级。

恢复时，LangGraph 重建整个消息链，再注入到下一个节点的上下文中。

这个差异在面试里会变成一个非常实际的问题：**你的工作流是短流程还是长流程？

** 如果是「调研→撰写→校对」这种固定 3-5 步的流程，MessageGraph 的 Checkpoint 体积问题几乎可以忽略；

但如果是「多 Agent 持续运行 24 小时、每天处理上千条消息」的生产级 Agent，Checkpoint 体积会直接影响存储成本和恢复速度。

### 面试里怎么压缩回答

如果面试官在追问中打断了你，说「直接说结论」，你需要能在 1-2 句话内给出最核心的判断：

> 「需要结构化共享状态——用 StateGraph；需要完整消息历史做 RAG 或者对话——用 MessageGraph。」

这一句话已经能覆盖 80% 的面试场景。

![](https://iili.io/BHPU42f.png)
> 面试官打断的时候，最怕的就是那句「你再想想」

## 为什么问这个：面试官到底在筛什么

### 面试官到底在筛什么

这道题表面上是考概念辨析，实际上面试官在筛三层东西：

**第一层：知识点是否扎实**

StateGraph 和 MessageGraph 不是两个孤立的 API 调用，它们背后是 LangGraph 状态机的核心设计哲学。

如果你只能说出「StateGraph 用状态，MessageGraph 用消息」，说明你用过但没有理解架构。

面试官真正想确认的是：你知道 **LangGraph 的状态是mutable 还是 immutable 的**，你知道 **节点返回的是增量更新而不是全量替换**，你知道 **两种图在 Checkpoint 持久化上的实现差异**。

**第二层：工程判断能力**

「选型」这两个字本身就是工程判断题。面试官不是在等你背答案，而是在看你拿到一个具体场景时，能不能做出合理的权衡。

比如：当候选人说「对话场景用 MessageGraph」之后，面试官可能会追问「如果对话 Agent 还需要维护一个用户画像对象，你怎么处理？

」这个问题没有标准答案，考的是你能不能意识到两个范式的混用场景，以及如何在 LangGraph 里实现「MessageGraph + 结构化状态」的混合方案。

**第三层：生产落地意识**

Checkpointer、断点恢复、并发安全、Checkpoint 体积——这些问题都是生产级部署才会真正遇到的。

如果候选人对这些维度毫无概念，说明他只在 Demo 级别用过 LangGraph，还没有接触过真实的企业场景。面试官用这类追问来区分「会用框架」和「能驾驭框架」。

### 为什么这题会出现在这一轮

这道题在一面、二面出现的频率不同，背后有不同的筛选意图：

**出现在一面**：通常是在评估候选人对 LangGraph 生态的熟悉程度。一面的面试官希望你至少能区分两种图的 API 用法，给出一个基本正确的选型建议。

如果一面就能答好这道题，说明你做过实战练习，不是纯粹的理论派。

**出现在二面**：二面会更深入，通常在「你刚才提到了状态管理」之后紧接着追问 Checkpoint 机制或者并发安全。

二面的面试官在评估你能不能在生产环境里稳定运行基于 LangGraph 的 Agent 系统。

**出现在三面或 HR 面**：这个阶段出现的频率较低，但一旦出现，通常是以「架构决策」的形式：「你们公司在选型时，会怎么决定用 StateGraph 还是 MessageGraph？

」这时候考的不只是技术判断，还有你在团队决策中的参与经验和全局视角。

## 常见追问：至少 3 个真实追问 + 对应答法

### 追问一：多节点同时读写状态的并发问题

**面试官的真实意图**：

这个问题是在测试你对 LangGraph 执行模型的真实理解。很多人以为「LangGraph 的节点是串行执行的，所以不存在并发问题」，但这个理解只对了一半。

在引入了 conditional edges 和循环之后，同一个状态对象可能被多个节点在同一个执行批次内访问。

如果两个节点都在写同一个字段（比如同时把 `approval_result` 字段覆盖成不同值），执行顺序会决定最终结果，而这个顺序是由图的拓扑决定的，不一定是你预期的那个顺序。

**标准答法**：

> 「LangGraph 的执行引擎在单图实例内是单线程的，所以严格来说不存在操作系统层面的并发竞争。但从业务逻辑层面看，conditional edges 引入的分支会导致多个节点可能以非预期的顺序访问同一个状态字段。StateGraph 的共享状态在这个场景下，如果两个节点都写同一个字段，后写入的会覆盖先写入的，这是个潜在的逻辑 bug，不是一个技术 bug。解决方案是：在节点设计时尽量让每个节点负责更新自己专属的字段，而不是多个节点去修改同一个共享键。如果必须共享写，可以用乐观锁或者版本号机制来检测冲突。MessageGraph 的 append-only 消息模型在这个维度上天然更安全，因为每个节点只往消息列表追加，不修改历史。」

这个回答展示了三个层次：理解执行模型（单线程但有逻辑竞争）、识别问题本质（字段覆盖而非并发竞争）、给出工程解法（字段隔离或版本号机制）。

![](https://iili.io/BAc7waR.png)
> 多节点写同一个字段这个问题，在评审里经常被漏掉

### 追问二：Checkpoint 和断点恢复能力对比

**面试官的真实意图**：

Checkpointer 是 LangGraph 生产部署的关键能力。面试官追问这个，说明他在评估你能不能把 Agent 工作流做到「可中断、可恢复、可持续运行」。

这不是一个概念题，而是一个工程能力题。

**标准答法**：

> 「StateGraph 的 Checkpoint 存储的是整个状态对象的序列化快照，字段粒度可以精确控制。比如用 `MemorySaver()` 时，每个 Checkpoint 就是一个完整的 `OrderState` dict，恢复时直接注入到工作流任意节点继续执行。MessageGraph 的 Checkpoint 存的是消息历史列表，结构不同——由于消息是追加型的，Checkpoint 里实际上包含了从工作流启动到当前时刻的**完整消息链**，这对对话式 Agent 是正确的行为，但对长对话场景意味着 Checkpoint 体积会持续膨胀。实际工程里，MessageGraph 场景可以定期对消息历史做摘要（Summarizer），把多轮对话压缩成一条摘要消息，从而控制 Checkpoint 的体积，而不是无限追加。」

这里有一个关键的工程细节需要点出来：**MessageGraph 的消息追加不等于消息无限累积**。

LangGraph 提供了 `messages_to_dict` 和 `InMemorySaver` 的组合，可以对消息历史做分层管理。

知道这个的候选人和不知道的候选人，在面试里差距非常明显。

### 追问三：从 StateGraph 迁移到 MessageGraph 怎么操作

**面试官的真实意图**：

这个追问不是在考你「会不会用另一个 API」，而是在测试你对「渐进式重构」和「架构迁移」的理解。面试官想知道的是：如果你在项目里选错了图类型，重构成本有多高？

**标准答法**：

> 「迁移的核心是把状态 schema 转化为消息历史。步骤大概是：第一步，把 StateGraph 的每个字段想成一条消息——`state['amount']` 变成一条 `AIMessage`，`state['approval_result']` 变成另一条 `ToolMessage`；第二步，把每个节点的输入输出从 `state['field'] = value` 改为 `AIMessage(content=...)` 和 `HumanMessage(content=...)` 的追加；第三步，更新图的 schema 从 `TypedDict` 改为继承 `MessagesState`；第四步，更新 condition 函数的判断逻辑，因为现在你是在消息列表上做条件判断，而不是在状态字段上。」

> 「实际操作中，最麻烦的是第三步——因为 StateGraph 的节点函数签名全是 `state: OrderState`，迁移到 MessageGraph 之后签名变成 `state: MessagesState`，所有节点函数都要重写。如果项目规模不大，可以考虑直接新建一个 MessageGraph 的图，原有 StateGraph 保留做灰度对照，而不是在原图上做 in-place 迁移。」

这个回答展示了对迁移成本的真实评估，而不是「很简单，把 schema 改一下就行」这种轻飘飘的判断。

![](https://iili.io/BgGwKpS.png)
> 迁移时最怕的就是节点函数签名全改，然后发现类型检查一片红

## 易错点：至少 3 个高频误答方式

### 易错点一：把 MessageGraph 当成「没有状态」的图

这是最常见的误解。

很多候选人觉得「MessageGraph 就是处理消息的，不处理状态」，然后在答案里说「需要状态管理的时候用 StateGraph，需要消息处理的时候用 MessageGraph」——这个说法把两者完全对立了。

**为什么危险**：MessageGraph 继承自 `MessagesState`，它本身就是一种 State，只是把状态建模成了消息历史。

如果你在面试中说「MessageGraph 没有状态」，面试官会立刻追问「那 `messages` 字段是从哪里来的？」你就会陷入逻辑陷阱。

**正确理解**：两者都有状态，区别是**状态的组织形式**。

StateGraph 用结构化字段（key-value），MessageGraph 用消息历史列表（append-only timeline）。

### 易错点二：认为 StateGraph 的 Checkpoint 比 MessageGraph 更省空间

这个误判来自一个直觉假设：「结构化字典肯定比消息列表小」。但这个假设在真实场景里不一定成立。

**为什么危险**：如果 StateGraph 的状态对象包含大量中间计算结果（比如一个 `analysis_report: str` 字段存了一篇 5000 字的分析报告），而 MessageGraph 里每条消息只有几十到几百 token，那么 StateGraph 的单次 Checkpoint 反而可能比 MessageGraph 大得多。

**正确理解**：Checkpoint 体积取决于**状态内容的实际大小**，而不是状态的组织形式。

在做生产级容量规划时，必须实际测量两种方案在真实数据下的 Checkpoint 大小，而不是凭直觉判断。

### 易错点三：把 conditional edges 的判断条件写错位置

在 StateGraph 里，很多候选人在节点函数里直接写 `state['next'] = "node_b"` 来控制流向，以为「给状态设一个字段就能改变图的执行路径」。

**为什么危险**：LangGraph 的 conditional edges 不是靠状态字段来驱动流向的，而是靠**边的 condition 函数本身**。

你在状态里设 `state['next'] = "node_b"` 不会让图跳到 node_b——除非你同时在 `add_conditional_edges` 里注册了这个字段作为判断依据。

**正确理解**：conditional edges 的判断逻辑必须显式注册在 `add_conditional_edges` 的 condition 参数里。

状态字段可以辅助判断（比如 `state["is_approved"]`），但驱动流向的是 condition 函数的返回值，不是状态赋值。

![](https://iili.io/BaoyFSa.png)
> 这个坑在项目里通常在上线前才发现，面试里问到才发现就晚了

## 其他注意事项：回答顺序、术语边界与面试节奏

### 回答顺序：哪个概念先说

在回答「StateGraph vs MessageGraph 的区别」时，建议**先说 StateGraph，再说 MessageGraph**，原因是：

1. StateGraph 是更基础、更通用的范式，先讲它能帮面试官建立一个基准线；

2. MessageGraph 可以被描述为「一种特殊化的 StateGraph」，在 StateGraph 讲完之后再说 MessageGraph 是它的变体，逻辑线更顺；

3. 大部分面试官mental model里对「消息流」更熟悉，如果你先说 MessageGraph，可能会让面试官陷入「这个消息系统怎么设计的」思维岔路，而不是聚焦在「两种状态建模方式的取舍」这个核心问题上。

### 术语边界：这些词不能混用

面试里最容易翻车的术语混用问题：

**不要混用「状态」和「消息」**：StateGraph 的「状态」是结构化字段，MessageGraph 的「状态」是消息历史。两者虽然都叫「状态」，但语义完全不同。

在同一个答案里如果混用了这两个概念，面试官会立刻感觉你概念不清。

**不要把「MessageGraph」和「MessageState」混为一谈**：`MessagesState` 是一个 Python class，继承自 `MessagesState` 的图就是 MessageGraph。

但 `MessagesState` 本身是一个预定义的状态 schema，不是图类型。

准确的说法是「我定义了一个继承自 `MessagesState` 的图，这就是 MessageGraph 的用法」。

**不要把「conditional edges」和「普通 edges」的概念混进选型讨论**：conditional edges 是两种图都支持的特性，不是 StateGraph 或 MessageGraph 的专属能力。

在讨论选型时把 conditional edges 带进来会转移焦点。

### 被打断时的压缩说法

面试中被面试官打断是常态，尤其是这道题如果答得比较长，面试官可能会说「我大概明白了，换一个角度问你」——这时候你需要能在几秒钟内切换到新问题，但前一个问题的核心结论要还在脑子里。

被打断时的最优压缩句：

> 「StateGraph 管结构化字段，MessageGraph 管消息历史——前者适合多 Agent 共享状态，后者适合对话链和 RAG。」

这一句话够短，面试官能立刻判断你到底有没有理解本质，而不是在背书。

![](https://iili.io/BgGwBj9.png)
> 面试官说「我大概明白了」的时候，往往是在憋大招追问

## 项目里怎么说：可复述的话术 + 没有完整项目时怎么补

### 可直接复述的项目说法

如果你真的在项目里用过 LangGraph，选 StateGraph 还是 MessageGraph 应该有明确的使用背景。把这个背景说出来，比背任何模板答案都有说服力。

**场景一：用 StateGraph 做多 Agent 协作审批流**

> 「我在项目里用 StateGraph 实现了一个多级审批流，有三个节点：数据采集节点、分析节点和审批节点。每个节点共享一个 `ApprovalState`，包含 `request_id`、`data`、`analysis_report` 和 `decision` 字段。选择 StateGraph 的原因是我们需要**精确控制每个节点的写权限**——分析节点只写 `analysis_report`，审批节点只写 `decision`，不会有节点去覆盖另一个节点的字段。这样用 StateGraph 的 schema 做字段隔离，逻辑非常清晰。如果是 MessageGraph，我们反而不好精确控制字段归属，因为所有输出都会变成追加的消息。」

**场景二：用 MessageGraph 做对话式 RAG Agent**

> 「另一个场景是做了一个对话式检索 Agent，底层用 MessageGraph，每次用户提问会生成一个 `HumanMessage`，LLM 的回答生成一个 `AIMessage`，中间的工具调用结果是 `ToolMessage`。整个状态就是消息历史，我们直接拿消息列表去做 RAG 检索——把最近 10 条消息拼成 context丢给检索模型。这个场景用 MessageGraph 是最自然的，因为消息历史本身就是 RAG 最需要的 context。如果用 StateGraph，我们反而要额外维护一个 `message_history` 字段，在节点里手动 append，绕了一圈。」

这两个说法都有明确的项目背景、选型理由和「为什么不用另一个」的对比判断，比「我用过」三个字有力得多。

### 如果没做过完整项目怎么补

如果你没有完整的企业级 LangGraph 项目，也不要编造。以下是几种真实可操作的补法：

**补法一：做 Demo 级项目并讲清楚局限**

用一个周末时间跑通 LangGraph 官方文档里的「研究 → 写作 → 校对」示例，选择其中一个场景（比如说「写作 → 校对」），把 StateGraph 的 schema 和节点逻辑改掉，尝试换成 MessageGraph，对比两者的代码量差异。

然后在面试里诚实说：「我在本地跑过对比实验，发现 StateGraph 的结构化 schema 在多节点协作时字段管理更清晰，但 MessageGraph 在只需要追加消息的场景下代码更简洁。

」这种「做过对比实验」的诚实比「做过完整项目」更有价值。

**补法二：用课程项目或毕设场景套用**

如果你有数据库课程设计、机器学习实验项目或者本科毕设，把其中某个需要「步骤流转」或者「多轮交互」的环节抽象成 LangGraph 工作流。

比如一个「数据清洗 → 特征工程 → 模型训练 → 结果评估」的机器学习 pipeline，完全可以映射成 StateGraph 的四个节点，在面试里把它当成一个 AI Agent 项目来讲。

**补法三：深度阅读源码并在面试里展示判断**

如果你真的没有项目经验，另一个策略是展示你对源码的阅读深度。

LangGraph 的 StateGraph 和 MessageGraph 在 `langgraph/graph/state.py` 里的实现差异是可以直接阅读的。

读过源码的候选人在回答 Checkpoint 机制和状态更新逻辑时，往往比只看过 API 文档的候选人深刻得多。

![](https://iili.io/BHPgY4s.png)
> 没项目的话，源码阅读深度真的能救命

## 附录：选型决策树与对比速查表

下面这张图把整个选型逻辑整理成了一张决策树，面试现场如果被问到「那你说说怎么选」，可以直接按这个路径走：

![正文图解 1](https://iili.io/BgGO17R.png)
> 正文图解 1

配合下面的速查对比表使用：

| 维度 | StateGraph | MessageGraph | |------|-----------|-------------| | 状态组织 | 结构化字段（TypedDict / Pydantic） | 消息历史列表（append-only） | | 适用场景 | 多节点共享结构化状态、精确写权限控制 | 对话式 Agent、RAG context、多轮推理 | | Checkpoint 存储 | 完整状态快照，字段粒度可控 | 消息链历史，体积随轮次增长 | | 并发安全风险 | 同一字段被多节点写覆盖 | 追加写安全，但历史消息修改成本高 | | 代码复杂度 | 需要显式定义 schema | schema 隐式（继承 MessagesState） | | 迁移难度 | 改 MessageGraph 需要重写节点签名 | 迁移到 StateGraph 同样需要重写 | | 消息摘要支持 | 需要自行实现 | 可结合 Summarizer 做定期压缩 | | LangGraph 版本要求 | v0.1+ 全面支持 | v0.2+ 全面支持 |

**一张图总结**（直接可以在面试里口述）：

> 「如果你的工作流里，每个节点都在往同一个状态对象里写不同的字段——用 StateGraph。如果你的工作流里，每个节点的输出都应该被后续节点当成历史来参考——用 MessageGraph。如果两者都要，那就混用：MessageGraph 作为外层管理对话链，内层某个节点维护一个 StateGraph 处理结构化状态。」

这个「混用」的回答是加分项，说明你对 LangGraph 的架构弹性有超出常规候选人的理解。

![](https://iili.io/B9HlDhu.png)
> 能说出「混用」这两个字的候选人，面试官通常会多问几个 follow-up

## 参考文献
<div class="academic-reference-list">
<p class="reference-item">[1] 原始资料[EB/OL]. https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/04-ai-system-design.md. (2026-04-19).</p>
</div>
