---
layout: "post"
article_page_id: "34b0f85d-e690-8185-b40b-de397632c772"
title: "【AI面试八股文 Vol.1.1 | 专题8：Streaming 模式】Streaming模式：astream / astream_events token级流式输出"
description: "这篇文章系统拆解 LangGraph Streaming 模式的核心 API——astream 与 astream_events 的语义差异、使用场景与选型边界。"
categories:
  - "AI面试八股文 Vol.1.1"
  - "专题8：Streaming 模式"
tags:
  - "LangGraph Streaming"
  - "astream vs astream_events"
  - "Token级流式输出"
  - "LLM TTFT优化"
  - "AI Agent面试八股文"
  - "Vol.1.1"
  - "Streaming"
  - "Astream"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/23/ai面试八股文-vol11-专题8streaming-模式streaming模式astream-astream_events-token级流式输出/"
img: "https://i.ibb.co/gbZ4SSfH/cover.png"
swiperImg: "https://i.ibb.co/gbZ4SSfH/cover.png"
permalink: "posts/2026/04/23/ai面试八股文-vol11-专题8streaming-模式streaming模式astream-astream_events-token级流式输出/"
date: "2026-04-23 01:21:00"
updated: "2026-04-23 01:23:00"
cover: "https://i.ibb.co/gbZ4SSfH/cover.png"
---

你写了一个看起来完全正确的 Agent。Prompt 调了三版，工具注册没问题，RAG 链路也通了，测试输入怼进去，模型开始吐字——然后用户在等。等了多久？

不知道。只知道第一个 token 出来之前，整个系统像是卡死了。

这不是你的 Agent 逻辑有问题。这是 LLM 本身的问题：TTFT（Time To First Token，首 token 延迟）在大模型推理里是个躲不过的坎。

7B 模型还好，一旦切到 70B，TTFT 动辄两三秒。用户看到白屏，不知道你在干什么，直接关掉。

Streaming 就是来解决这个问题的。它不是让模型跑更快，而是让用户在等待的时候能看到东西——哪怕只是一堆跳动的光标，哪怕是一行行正在生成的文字。

感知延迟降低了，实际等待时间没变，但体验天差地别。

![](https://iili.io/BgOnsMN.png)
> LLM 的锅，凭什么要我前端工程师来擦

在字节、腾讯、阿里今年的 Agent 开发岗位面试里，「如何实时输出思考过程」已经是高频追问。

它不是考你知不知道 Streaming 这个词，而是考你能不能说清楚 astream 和 astream_events 的本质区别，能不能在真实项目里做出对的选型。

这篇把这两个 API 掰开了讲，连带生产落地的坑一起填上。

---

## 一、Streaming 解决的是什么：先说清楚工程问题

LLM 生成内容是个逐 token 吐出的过程。在模型跑完整个推理之前，第一个 token 根本出不来。这个间隔，TTFT，在大模型场景下是几秒级别的。

对用户来说，这几秒像几年。对产品来说，这几秒足够让人关掉页面。

Streaming 的核心思路不是让 LLM 跑更快，而是把 token 生成的过程「管道化」——模型每生成一个 token，就往前端发一个。

用户看到的是一行行跳出来的文字，而不是一个光标转圈。实际等待时间没变，但感知等待时间大幅压缩。

LangGraph 官方把这一点说得很直接：「Bridge user expectations and agent capabilities」[1](https://magicliang.github.io/2026/04/14/Anthropic-Managed-Agents深度研究/)。Streaming 就是这座桥。

你可能见过一些粗糙的实现：模型生成完毕后一次性返回完整文本，前端再慢慢打字出来。

这种「伪流式」在短回答场景下还能凑合，但在长回答、复杂 Agent 场景下，TTFT 问题根本没有解决，只是把等待时间平移到了渲染阶段。

真正的 Streaming 必须从模型推理层就开始。你看到的 token，是模型真正生成的那个 token，不是一个假的打字动画。

---

## 二、astream：面向用户的 token 级流式 API

### 2.1 API 签名与返回值结构

astream 是 LangGraph 面向用户的流式输出入口。它的签名大概长这样：

```python
async def astream(
    input: dict,
    config: RunnableConfig,
    *,
    stream_mode: StreamMode = "values"
) -> AsyncIterator[StreamEvent]
```

核心参数是两个：input 是输入状态，config 包含 run_id、tags 这类运行时配置。stream_mode 控制输出格式，这是面试里最容易挖坑的地方。

### 2.2 stream_mode='values' vs stream_mode='updates' 的核心差异

这是 astream 最常被追问的细节。两种模式输出语义完全不同：

**stream_mode='values'**：每次迭代输出完整的当前状态快照。你拿到的每个事件都包含完整的 state dict，可以看到整个图在当前时刻的所有变量。

这意味着你可以用最新状态渲染 UI，但每次事件的数据量较大。

**stream_mode='updates'**：每次迭代只输出自上次以来的变化部分。拿到的每个事件只包含被修改的节点及其新值，不包含完整状态。

这意味着数据量小，适合做增量渲染，但需要你在前端自己维护状态。

在实际项目里，如果你的 UI 需要展示完整的对话上下文，用 values；如果你只需要渲染最新输出，用 updates 可以省不少带宽。

### 2.3 基础代码示例

一个典型的 astream 调用大概长这样：

```python
async for event in agent.astream(
    {"messages": [HumanMessage(content=user_input)]},
    config={"recursion_limit": 50},
    stream_mode="values"
):
    # event 是当前完整状态快照
    last_message = event["messages"][-1]
    print(last_message.content, end="", flush=True)
```

注意 flush=True——这是让 Python 实时打印的关键。没有 flush=True，你还是会看到批量输出而不是逐 token 效果。

![](https://iili.io/BHP4xzN.png)
> flush=True 这个参数卡了我三小时

### 2.4 面试追问：astream vs LCEL stream

这里有个容易踩的坑：LangChain 的 LCEL（LangChain Expression Language）也有自己的 stream 方法，但它是同步的，用的是 `stream()` 而不是 `astream()`。

LCEL 的 stream 是给简单链式调用的，线性流程用这个没问题。

但 LangGraph 的 astream 是异步的，专门为有状态循环图设计——它需要处理多轮推理、工具调用、中断恢复这些复杂场景。

面试时如果被问到「你用过哪些流式方案」，正确答案是：「LCEL 的 stream 用于简单链式场景，LangGraph 的 astream 用于复杂 Agent 编排场景。

」这个区分本身就是工程判断力的体现。

---

## 三、astream_events：面向开发者的全链路事件流

### 3.1 事件类型全景图

如果说 astream 是给用户看的「产品界面」，astream_events 就是给工程师看的「调试面板」。它输出的不是 token，而是整个 Agent 执行链路上的结构化事件。

LangGraph 的 astream_events 会触发以下几类核心事件：

| 事件类型 | 触发时机 | 主要字段 |
|---------|---------|---------|
| on_chain_start | 图节点开始执行 | name, run_id, input |
| on_chain_stream | 节点运行时持续输出 | run_id, data |
| on_chain_end | 节点执行完成 | run_id, output, metadata |
| on_tool_start | 工具开始调用 | name, tool_input |
| on_tool_end | 工具调用完成 | tool_output, error |
| on_text_delta | token 生成 | text_chunk |
| on_chat_model_stream | 模型 token 输出 | chunk, meta |

这个事件体系覆盖了 LLM 调用、工具执行、输出解析全链路。你拿到的是一个完整的执行轨迹，每个环节的时间戳、输入输出都能看到。

### 3.2 run_id 与 parent_run_id 的链路追踪

多节点 Agent 里，一个 run 往往会触发子 run。比如主图调用了一个子 Agent，子 Agent 又调了一个工具。

这时候父 run 和子 run 通过 parent_run_id 串联起来。

astream_events 输出的每个事件都带着 run_id 字段。

你可以顺着 parent_run_id 把完整的调用链还原出来——哪个节点先跑、哪个工具后调、哪里耗时最长、哪里出错了，一目了然。

### 3.3 与 LangSmith 的联动

LangGraph 官方文档明确把 astream_events 和 LangSmith 绑定在一起：「LangSmith, our agent engineering platform, helps developers debug every agent decision, eval changes, and deploy in one click」[2](https://www.langchain.com/)。

LangSmith 是 Anthropic/LangChain 官方出的可观测性平台。

你可以把自己写的 event handler 把 astream_events 的事件转发到 LangSmith，在平台上看到完整的调用链路火焰图。

面试时如果提到这个，面试官会知道你不仅会用 API，还理解背后的工程生态。

### 3.4 生产调试：用 astream_events 定位工具调用错误

真实的研报生成 Agent 场景里，工具调用失败是家常便饭。

比如你定义了一个「搜索数据库」的工具，参数是 SQL 查询字符串。如果用户输入包含特殊字符，SQL 解析可能报错。

如果你在 astream_events 里监听 on_tool_end 事件，你可以在工具返回错误时立即捕获：

```python
async for event in agent.astream_events(
    input_state,
    config={"tags": ["production-agent"]},
    version="v1"
):
    if event["event"] == "on_tool_end":
        if event.get("error"):
            # 立即触发告警或降级逻辑
            await notify_slack(f"Tool {event['name']} failed: {event['error']}")
            # 决定是重试还是跳过
            await execute_fallback()
```

你不需要等到整个 Agent 执行完毕才知道哪里出了问题。实时事件流让你可以在错误发生的第一时间做出响应。

![](https://iili.io/BgOnGae.png)
> 线上报错了，AST 都跑完了才告诉我有个 tool 调用失败

### 3.5 面试追问：怎么把原始事件组装成可读状态

这是面试官会追问的进阶问题：astream_events 输出的是扁平事件流，但你最终要给用户展示的是「当前 Agent 思考到哪里了」。这两个东西之间的翻译怎么做？

标准答案是：维护一个状态机。你在 event handler 里累积事件，根据事件类型更新内部状态。

比如 on_chain_start 加一个节点，on_chain_end 标记完成，on_text_delta 追加到当前节点的输出内容里。

前端拿到的是你维护的状态机，而不是原始事件列表。

---

## 四、Streaming 模式下的状态管理与 checkpoint

### 4.1 Checkpoint 与 stream_mode 的共存关系

LangGraph 的 checkpoint 机制是它的核心优势之一：可以把图状态持久化到 SQLite、PostgreSQL 或 Redis，Agent 可以在任意节点中断并恢复。

一个常见的误解是：streaming 和 checkpoint 是互斥的——流式输出的时候状态在不断变化，怎么 checkpoint？

实际上，checkpoint 和 stream_mode 完全兼容。checkpoint 记录的是图的完整状态快照，包括当前节点的输入输出、中间变量、执行位置。

streaming 只是在这个快照的基础上，把变化实时推送给你。

两者协同工作的典型场景是：Agent 在执行一个长任务（比如生成一篇万字研报），用户突然点击「暂停」检查中间结果。

这时候 checkpoint 保存当前进度，streaming 停止推送，用户可以审查、修改、甚至重新注入上下文，然后 Agent 继续执行。

### 4.2 Human-in-the-loop：流式过程中的人工审查与中断

Human-in-the-loop（人机协同）是 LangGraph 的核心设计目标之一。

官方文档说：「Prevent agents from veering off course with easy-to-add moderation and quality controls. Add human-in-the-loop checks to steer and approve agent actions」[3](https://blog.gopenai.com/adding-a-human-in-the-loop-confirmation-in-agentic-llms-with-langgraph-5e6e5c11c16b)。

在 streaming 场景下，这意味着用户可以在 Agent 执行过程中介入。比如：

```python
# 定义一个需要人工确认的节点
def human_review_node(state):
    return state

# 在图中插入条件分支
graph.add_node("human_review", human_review_node)
graph.add_conditional_edges(
    "llm_node",
    lambda state: "human_review" if state.get("needs_review") else "output",
    {"human_review": "human_review", "output": "END"}
)
```

当 Agent 执行到这个节点时，streaming 会暂停，等待人类输入。用户确认后，Agent 继续执行。

### 4.3 中断恢复后 streaming 是否重放已生成内容

这是面试里问得不多，但实际开发时很容易踩坑的问题：Agent 中断后恢复，streaming 会从头重放所有已生成的内容吗？

答案是：**不会**。

LangGraph 的 checkpoint 包含完整的执行状态，包括「执行到第几步」。恢复时，Agent 直接从断点继续，不会在流式输出里重复已生成的内容。

用户看到的是从断点开始的新的 token 流，而不是一遍又一遍的重放。

---

## 五、partial message 与 UI 渲染：生产落地的最后一公里

### 5.1 partial message 概念与增量渲染

流式输出的前端渲染不是简单的「收到什么就显示什么」。

LLM 生成的内容是一个 partial message——它还在进行中，内容可能变化。如果前端直接显示每个 chunk，会出现文字抖动、内容回退等问题。

正确的做法是维护一个前端状态机：

1. 收到 on_text_delta，把 chunk 追加到当前内容

2. 显示时用稳定的 ID 标记每个 token，允许后验修改

3. 收到 on_chain_end，标记当前消息为「已完成」，不再接受后验修改

### 5.2 SSE / WebSocket 对接 LangGraph streaming

LangGraph 的 astream 输出的是异步迭代器，你需要把它桥接到前端能消费的协议。主流方案有两个：

**SSE（Server-Sent Events）**：轻量、单向，前端只接收不发送。适合 Chat 场景，你的用户发送消息后等着收流式响应。实现简单，但不支持双向通信。

**WebSocket**：双向通信，可以支持更复杂的交互（比如用户在 Agent 执行过程中实时注入指令）。实现复杂度高，但能力更强。

对于大部分 Chat Agent 场景，SSE 足够。如果你做的是类似 Copilot 的实时协作场景，需要用户在 Agent 执行过程中实时反馈，WebSocket 更合适。

### 5.3 错误处理：tool 超时后已流出部分如何处理

这是一个真实的生产问题：tool 调用超时，但前面已经有部分输出流到用户了，这时候怎么处理？

标准方案是三层兜底：

1. **前端截断**：检测到 tool_error 事件后，停止追加新内容，显示「生成中断」提示

2. **状态回滚**：通过 checkpoint 恢复到一个一致的 state（不包含错误 tool 的输出）

3. **重试或降级**：根据错误类型决定是重试 tool 还是走降级路径（跳过这个 tool，用已有 context 继续生成）

![](https://iili.io/BU8Gxqb.png)
> tool 超时了，但用户已经看到一半了，这时候该怎么说

### 5.4 背压问题：on_text_delta 事件过密的批量打包方案

在高吞吐场景下，LLM 每秒可能吐出几十个 token，每个 token 都会触发一个 on_text_delta 事件。

如果前端处理不过来，会出现背压——事件在 channel 里堆积，甚至丢消息。

解决方案是批量打包：在 event handler 里收集一定数量的 delta（比如 10 个），或者等待一定时间窗口（比如 50ms），然后一次性推送给前端。

```python
class BatchHandler:
    def __init__(self, batch_size=10, batch_timeout=0.05):
        self.buffer = []
        self.batch_size = batch_size
        self.batch_timeout = batch_timeout

async def handle(self, event):
        if event["event"] == "on_text_delta":
            self.buffer.append(event["data"])
            if len(self.buffer) >= self.batch_size:
                await self.flush()

async def flush(self):
        # 一次性发送，减少网络往返
        await ws.send(json.dumps({"chunks": self.buffer}))
        self.buffer = []
```

50ms 的批量窗口意味着你的最大延迟是 50ms，但吞吐量可以提升数倍。这是一个典型的延迟换吞吐的工程取舍。

---

## 六、面试高频追问：astream vs astream_events 选型决策

### 6.1 核心区分：面向用户内容流 vs 面向开发者事件流

面试时被问「astream 和 astream_events 有什么区别」，最简洁的回答是：

**astream**：给用户看的。输出 token 级内容流，用来渲染 Chat 界面。

**astream_events**：给工程师看的。输出全链路结构化事件，用来做调试、可观测性、链路追踪。

这个区分本身就是一个设计决策：谁需要这个数据？数据用来干什么？

### 6.2 选型原则

不是什么场景都要用 astream_events。它的开销比 astream 大——事件类型多、字段多、需要额外的事件处理逻辑。

在低并发场景下可能不明显，但在高并发场景下，每个 run 都要生成完整事件流，开销是实打实的。

**选 astream 的场景**：

- End-user Chat 界面

- 简单客服 Agent

- 对延迟敏感的消费级应用

**选 astream_events 的场景**：

- 生产调试

- 可观测性集成（LangSmith）

- 链路追踪与性能分析

- 需要对工具调用做实时监控的场景

![正文图解 1](https://i.ibb.co/R47NDqbN/diagram-01.png)
> 正文图解 1

### 6.3 生产共存：两者同时开启的架构设计

在真实生产环境里，你可能需要同时开启两个 API。End-user 需要 astream 渲染界面，运维团队需要 astream_events 做监控告警。

但同时开启要注意事件处理的异步性——不要让 astream_events 的处理影响 astream 的输出延迟。建议把事件处理拆成两个独立通道：

```python
async def main():
    # 主通道：给用户看的流
    user_stream = agent.astream(user_input)

# 旁路：给监控用的事件流
    event_stream = agent.astream_events(user_input, version="v1")

# 两条通道独立跑，不互相阻塞
    await asyncio.gather(
        stream_to_sse(user_stream),
        stream_to_langsmith(event_stream)
    )
```

---

## 七、易错点与高风险误答清单

### 误答 1：astream_events 就是日志库

这是最常见的误解。astream_events 不是日志库，不是你拿来存日志的，它是结构化事件流。

它的每个事件都有明确语义（on_chain_start、on_tool_end），而不是「ERROR: something failed」这种字符串。

你可以用它做日志，但它的价值远不止日志——你可以在事件流里实时响应、动态修改执行路径、甚至注入人工决策。

如果面试官追问「你们怎么用 astream_events 做可观测性」，正确答案是：event handler 解析事件类型，把关键事件（tool_error、slow_node）转发到 LangSmith 或自己的 APM 平台，同时在内存里维护执行状态机用于前端渲染。

### 误答 2：streaming 和 checkpoint 互斥

前面已经说过了，这是个误解。两者完全兼容，checkpoint 记录状态快照，streaming 实时推送变化。

如果面试官追问「你们怎么做断点续传」，正确答案是：checkpoint 保存完整状态包括执行位置，恢复时从断点继续，不会重放已流出的内容。

### 误答 3：stream_mode 混用导致 UI 抖动

如果你在前端用 values 模式渲染完整状态，但更新频率又很高（比如每秒更新 20 次），前端会出现明显的抖动——每次状态更新都重新渲染整个界面，而不是增量更新。

解决方案：用 updates 模式做增量渲染，或者在 values 模式下做 diff，只更新变化的 DOM 节点。

### 面试官继续追问的口子

「如果用户在 Agent 执行过程中动态修改 system prompt，怎么处理？」

这是一个边缘场景，但不是没人问。动态修改 system prompt 意味着当前 run 的上下文变了，但已经流出的内容不能回退。正确答案是：

1. 先让当前 run 继续执行完（避免中断导致状态不一致）

2. 新 run 使用新的 system prompt

3. 如果必须中断，使用 checkpoint 回滚到一致状态，然后重新注入新 prompt

---

## 八、项目落地：我在真实 Agent 项目里是怎么用 Streaming 的

### 8.1 案例：研报生成 Agent（LangGraph 多节点图）

研报生成是 LangGraph 的典型场景。一个完整的研报需要多个步骤：信息采集 → 数据分析 → 观点生成 → 格式排版 → 审核发布。每个步骤都可能调用工具、出错、需要人工确认。

我们用 astream_events 监听整个链路，把每个节点的状态实时推到前端：

```python
class ReportAgentMonitor:
    def __init__(self):
        self.status = "idle"
        self.current_node = None
        self.progress = 0.0

async def handle(self, event):
        if event["event"] == "on_chain_start":
            self.current_node = event["name"]
            self.status = "running"
            await self.notify_ui()

elif event["event"] == "on_chain_end":
            self.progress += 0.25  # 假设有4个主要节点
            self.status = "complete" if self.progress >= 1.0 else "running"
            await self.notify_ui()

elif event["event"] == "on_tool_error":
            self.status = "error"
            await self.notify_slack(f"Tool {self.current_node} failed")
            await self.execute_fallback()

# SSE 桥接
async def stream_to_sse(monitor, user_ws):
    async for event in agent.astream_events(initial_input, version="v1"):
        await monitor.handle(event)
        # 把状态机变更推给前端
        await user_ws.send(json.dumps(monitor.get_state()))
```

前端拿到的是我们维护的状态机（当前节点、进度、错误状态），而不是原始事件流。

用户看到的是「正在分析数据... 75%」这样的进度条，而不是一堆 on_chain_start、on_chain_end 事件。

![](https://iili.io/B9f4ACB.png)
> 第一次用 astream_events 时，我直接把原始事件推给前端，前端同事差点打我

### 8.2 踩坑 1：tool_call JSON blob 太大导致卡顿

研报 Agent 里的一个工具是「查询数据库」——它要返回一个很大的 JSON，里面可能包含几千行数据。

一开始我们直接用 astream_events 的 on_tool_end 事件把整个 JSON 推出去。结果：JSON 太大，序列化耗时，stream 出现明显卡顿。

用户看到的是「查询完成」后光标停了好几秒才开始下一段输出。

解决方案：把 tool 返回分成两个通道。一个轻量通道只返回「执行成功」+「结果 ID」，前端显示查询完成；另一个重通道通过单独的 API 获取结果。

```python
# 轻量通道：快速响应
async def lightweight_tool_response(tool_name, result_id):
    return {
        "tool": tool_name,
        "status": "success",
        "result_id": result_id,  # 前端用这个 ID 单独拉结果
        "preview": "查询完成，共 3247 条记录"
    }

# 重通道：完整结果（不通过 streaming）
async def get_full_result(result_id):
    # 通过普通 HTTP API 获取，不走事件流
    return await db.fetch(result_id)
```

### 8.3 踩坑 2：on_text_delta 过密导致背压

研报生成时，LLM 每秒可能吐出 20-30 个 token，每个 token 都触发一个 on_text_delta 事件。

前端 websocket 处理不过来，出现背压——事件在 channel 里堆积，用户看到的是输出越来越慢。

解决方案是批量打包，50ms 的窗口合并 10 个 delta 一起发。

效果：实际延迟增加 50ms，但吞吐量从每秒 20 条消息降到每秒 2 条消息（20 条 delta 合并成 1 条），前端压力大幅降低。用户体验几乎不受影响，但系统稳定性好了很多。

![](https://iili.io/qyszWn2.png)
> 50ms 批量窗口这个参数调了我一下午

---

## 九、参考文献与来源

[4](https://www.langchain.com/langgraph): LangGraph 官方文档 - Streaming 模式：https://www.langchain.com/langgraph

[5](https://juejin.cn/post/7625210636653969418): LangChain + LangGraph Agent 完全指南：流式传输、结构化输出、提示词缓存：https://juejin.cn/post/7625210636653969418

[6](https://cloud.tencent.com/developer/article/2650620): Agent 构建必选框架——LangGraph工程落地手册：https://cloud.tencent.com/developer/article/2650620

[7](https://www.digitalapplied.com/blog/openai-agents-sdk-vs-langgraph-vs-crewai-matrix-2026): OpenAI Agents SDK vs LangGraph vs CrewAI: 2026 Matrix：https://www.digitalapplied.com/blog/openai-agents-sdk-vs-langgraph-vs-crewai-matrix-2026

[1](https://magicliang.github.io/2026/04/14/Anthropic-Managed-Agents深度研究/): Anthropic ManagedAgents 深度研究：解耦大脑与双手的架构哲学：https://magicliang.github.io/2026/04/14/Anthropic-Managed-Agents深度研究/

[8](https://github.com/didilili/ai-agents-from-zero): GitHub - didilili/ai-agents-from-zero: 2026 最系统的 AI Agent 速成指南：https://github.com/didilili/ai-agents-from-zero

## 参考文献

1. [Anthropic ManagedAgents深度研究：解耦大脑与双手的架构哲学](https://magicliang.github.io/2026/04/14/Anthropic-Managed-Agents深度研究/)

2. [LangChain: Observe, Evaluate, and Deploy Reliable AIAgents](https://www.langchain.com/)

3. [Adding a Human-in-the-Loop Confirmation in Agentic LLMs... | GoPenAI](https://blog.gopenai.com/adding-a-human-in-the-loop-confirmation-in-agentic-llms-with-langgraph-5e6e5c11c16b)

4. [LangGraph:AgentOrchestration Framework for Reliable AIAgents](https://www.langchain.com/langgraph)

5. [LangChain + LangGraph Agent 完全指南：流式传输、结构化输出、提示词缓存](https://juejin.cn/post/7625210636653969418)

6. [Agent 构建必选框架——LangGraph工程落地手册 - 腾讯云](https://cloud.tencent.com/developer/article/2650620)

7. [OpenAI Agents SDK vs LangGraph vs CrewAI: 2026 Matrix](https://www.digitalapplied.com/blog/openai-agents-sdk-vs-langgraph-vs-crewai-matrix-2026)

8. [GitHub - didilili/ai-agents-from-zero: 🚀 2026 最系统的 AI Agent 速成指南｜智能体实战教程 · 完整学习路径 + 实战项...](https://github.com/didilili/ai-agents-from-zero)
