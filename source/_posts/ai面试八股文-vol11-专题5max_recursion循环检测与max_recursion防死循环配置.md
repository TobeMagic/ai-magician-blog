---
layout: "post"
article_page_id: "3470f85d-e690-8158-90e8-c9a4b055aad8"
title: "【AI面试八股文 Vol.1.1 | 专题5：max_recursion】循环检测与max_recursion防死循环配置"
description: "LangGraph 的循环检测依赖状态哈希而非调用栈深度，这导致 max_steps 和 max_recursion 实际上是两套独立的防护机制。"
categories:
  - "AI面试八股文 Vol.1.1"
  - "专题5：max_recursion"
tags:
  - "LangGraph 循环检测"
  - "max_recursion"
  - "状态哈希"
  - "Agent 防死循环"
  - "LangGraph 面试八股文"
  - "Vol.1.1"
  - "LangGraph"
  - "人工智能"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/19/ai面试八股文-vol11-专题5max_recursion循环检测与max_recursion防死循环配置/"
img: "https://iili.io/Bgbq4Mx.png"
swiperImg: "https://iili.io/Bgbq4Mx.png"
permalink: "posts/2026/04/19/ai面试八股文-vol11-专题5max_recursion循环检测与max_recursion防死循环配置/"
date: "2026-04-19 15:16:00"
updated: "2026-04-19 15:18:00"
cover: "https://iili.io/Bgbq4Mx.png"
---

## 导语：从一个真实的死循环翻车现场说起

你给 Agent 配了 `max_steps=10`，自信满满地提交了代码——结果线上跑起来，Agent 在同一个节点卡了整整三分钟才被强制终止。

不是步数没生效，而是 LangGraph 压根没把它当成「循环」。这个盲区，恰好是 LangGraph 相关岗位面试里出现频率最高的追问点之一。

这件事说起来其实不复杂：LangGraph 的循环检测依赖状态哈希，而不是调用栈深度。这两件事看起来差不多，实际上决定了你在生产环境里配的防护到底有没有用。

本专题从源码逻辑出发，把循环检测的三层机制讲透，再给你一套可以直接写进项目的三层防护方案，最后拆解面试现场怎么把这件事讲出工程深度。

---

## 1. 循环检测的底层逻辑：LangGraph 为什么不依赖调用栈

### 1.1 状态哈希：LangGraph 的循环判断基准

LangGraph 判断是否进入循环，核心依据是「当前状态是否曾经出现过」，而不是「当前调用栈有多深」。

具体逻辑是这样的：每次节点执行完毕后，LangGraph 会对整个 `State` 对象做一次哈希，生成一个唯一标识。

如果这个标识在本次图执行过程中已经出现过——也就是说，状态收敛到了某个历史版本——那么就认为检测到了循环，执行 `max_iterations` 策略 [1](https://m.jiaoben.net/wz/364613.html)。

这个设计背后有一个很清晰的工程判断：对于 Agent 场景，「状态」才是真正有意义的循环判断基准。

一个 Agent 在同一个「写作」节点跑了三遍，如果它的 draft 内容每次都在变化，LangGraph 会认为这是三次不同的状态——哪怕节点名相同。

这在业务上也是对的：draft 从空白到初稿到修改稿，虽然节点没变，但内容在收敛，逻辑上并不是死循环。

反过来说，如果一个 Agent 在同一个节点跑了三遍，且状态完全一致，那才是真正需要干预的循环。

这个机制的实现细节在 `langgraph/graph/state.py` 的 `reduce` 函数里：它在做的是把 State 对象序列化后做哈希比对。

你可以理解为每一次节点执行都在往一张「状态护照」上盖章，如果新盖的章和之前某张完全一样——护照编号都撞了——系统就知道「来过了，这里没有新东西」。

### 1.2 `seen_nodes` 集合与节点访问记录

除了状态哈希，LangGraph 还维护了一个 `seen_nodes` 集合，记录本次图执行过程中每个节点的访问历史。

这个集合是状态哈希机制的一个补充：它能告诉你「某个节点被执行了多少次」，但本身不直接触发循环异常。

`seen_nodes` 的真正价值在于可观测性。你可以在 `interrupt` 回调里打印这个集合，从而判断 Agent 当前在图里的游走路径是不是你预期的——这是调试复杂分支图的一个利器 [1](https://m.jiaoben.net/wz/364613.html)。

```python
# 从 interrupt 回调里读取节点访问历史
def debug_interrupt(state):
    # state 里内置了 node_ids 字段，记录本次执行的节点序列
    print(f"Visited nodes: {state.get('node_ids', [])}")
    # 结合状态快照，判断是否需要人工介入
    return state

graph.add_node("debug_check", debug_interrupt)
```

注意 `seen_nodes` 记录的是节点 ID，不是状态哈希。节点 ID 是字符串，状态哈希是经过 `reduce` 计算的数值签名。

这两个东西服务于不同目的：节点 ID 用来画轨迹图，状态哈希用来判断循环。

### 1.3 为什么这套设计比调用栈更适用于 Agent 场景

传统编程语言的循环检测依赖调用栈深度——你递归太深，栈就溢出了。这套机制在确定性的函数调用场景下是准确的：每次调用同一个函数，栈就深一层。

但 Agent 不一样。Agent 的「递归」不是函数调用，而是图节点上的状态变迁。

同样是「写作节点」，draft 内容从版本 A 变到版本 B 再变到版本 C，这是三次状态变迁，本质上是一次收敛过程，而不是三次独立的函数调用。

用调用栈深度来判断这件事，会导致大量正常的 Agent 迭代被误判为死循环 [1](https://m.jiaoben.net/wz/364613.html)。

LangGraph 的选择是把判断权交给「状态内容」，而不是「调用路径」。

这是一个设计哲学上的取舍：它假设 Agent 的每一次执行都应该产生新状态，如果没有产生新状态——状态哈希撞了——那才是真正的问题。

这个假设在大多数 Agent 场景下是成立的。

写稿 Agent 会不断修改草稿，检索 Agent 会不断补充上下文，审批 Agent 的审批意见会逐条积累——这些都是状态在收敛的表现。

但对于那些真正写崩了的 Agent——比如 LLM 每次都生成完全相同的回复——状态哈希会迅速撞上，循环检测就会触发。

---

## 2. max_steps 与 max_recursion：两套机制的实际边界

### 2.1 `max_steps`：图执行层总步数限制

`max_steps`（在新版 LangGraph 中对应 `max_iterations`，功能一致）是图执行引擎层面的总步数上限。每当一个节点执行完毕，无论状态是否收敛，计数器就加一。

当计数器达到 `max_steps` 时，图的执行会被强制中断 [1](https://m.jiaoben.net/wz/364613.html)。

这个参数的本质是一个「硬性兜底」：无论循环检测有没有正确工作，`max_steps` 保证了任何图执行都不会无限跑下去。它不关心状态是否收敛，只关心「走了多少步」。

配置方式很直接：

```python
# 在编译图时传入 max_iterations 参数
app = graph.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["human_review"],  # 人工审核节点前的拦截
    max_iterations=20  # 图执行总步数上限
)
```

注意 `max_iterations` 是在 `compile()` 时传入的，不是在 `invoke()` 时。这说明它是一个图级别的配置，而不是调用级别的配置——同一张图被多次执行时，步数限制是共享的。

### 2.2 `max_recursion`：Python 解释器栈深度的真实作用

`max_recursion` 是 Python 解释器层面的递归深度限制。

这个参数的作用范围比 `max_steps` 更底层：它防止的是 Python 函数调用栈本身的溢出，而不是 LangGraph 图执行的逻辑循环。

在 LangGraph 的源码里，`max_recursion` 实际上控制的是 `MaxConcurrency` 相关的调度逻辑，以及 `asyncio` 协程的栈深度。

它在大多数标准使用场景下不会触发，因为 LangGraph 的节点执行大多数是同步的，不涉及深层递归 [1](https://m.jiaoben.net/wz/364613.html)。

真正需要配置 `max_recursion` 的场景是：你在节点里做了嵌套的 LLM 调用，或者在 `RunnableLambda` 里写了递归逻辑。

换句话说，`max_recursion` 防的不是 LangGraph 的死循环，而是你自己代码里的 Python 栈溢出。

```python
# 如果你在节点里写了递归逻辑，才需要调这个参数
def recursive_node(state: WritingState) -> WritingState:
    # 假设这里有一个递归调用
    if some_condition(state):
        return recursive_node(refined_state)  # 递归在这里才生效
    return state

# max_recursion 限制的是这个递归调用的深度
app = graph.compile(
    max_iterations=20,
    recursion_limit=1000  # Python 解释器栈深限制
)
```

### 2.3 两者的触发顺序与交互关系

当一个 LangGraph 图在执行过程中同时触及两个限制时，优先级顺序是：

1. **状态哈希循环检测**（最先）：如果状态哈希撞上了历史记录，LangGraph 会立即抛出 `GraphRecursionError`，即使此时 `max_steps` 还没用完。这是最快的失败路径。

2. **max_steps（max_iterations）**：当步数达到上限时，执行强制中断，返回当前的 `State` 快照。这是一种优雅的降级，不是异常。

3. **Python max_recursion**：只有在前两层都没有捕获到问题时，才会触发 Python 栈溢出。这基本上意味着你的节点代码本身有 bug [2](https://docs.langchain.com/oss/python/langgraph/workflows-agents)。

这个优先级顺序是理解「为什么配了 max_steps 还是卡死」的关键：你的状态哈希循环检测可能没有正确触发——比如你用的是自定义 `StateReducer`，状态比对逻辑写错了——导致系统一直认为「状态在变化」，没有走第一条路径，而 `max_steps` 设置得又太大，执行了 20 步甚至更多才被中断。

![](https://iili.io/BjP3L9j.png)
> 等等，状态Reducer写错了？那三行代码我写了两个小时……

---

## 3. 循环边的配置方式与触发路径

### 3.1 `add_edge` 回指节点：最基础的循环构造

LangGraph 里构造循环最简单的方式是用 `add_edge` 让一个节点指向自身。这会创建一个显式的回指边，LangGraph 在编译时会识别这个模式并注册循环检测逻辑 [1](https://m.jiaoben.net/wz/364613.html)。

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class LoopState(TypedDict):
    count: int
    message: str

graph = StateGraph(LoopState)

def increment(state: LoopState) -> LoopState:
    return {"count": state["count"] + 1, "message": f"Step {state['count'] + 1}"}

def check_condition(state: LoopState) -> bool:
    return state["count"] < 5  # 条件为真时继续循环

graph.add_node("process", increment)
graph.add_edge("process", "process")  # 回指自身，构建循环

app = graph.compile()
```

这个例子里的 `add_edge("process", "process")` 告诉 LangGraph：「process 节点执行完后，再回到 process 节点」。

LangGraph 在编译时检测到这个自指，会自动在图的执行层面插入循环检测点。

### 3.2 `add_conditional_edges` 返回自身：带条件判断的循环

更常见的业务场景是「满足某个条件时才循环，不满足就退出」。这需要用 `add_conditional_edges`，通过条件函数决定下一个节点是谁 [5](https://klab.tw/2026/04/from-prompt-to-harness-engineering/)。

```python
def routing_condition(state: WritingState) -> str:
    """校对节点的分支路由：根据 is_approved 决定下一步"""
    if state.get("is_approved"):
        return END  # 通过审核，结束
    elif state.get("revision_count", 0) >= 3:
        return "escalate"  # 修改次数超限，转人工
    else:
        return "write"  # 需要继续修改，返回写作节点

# 从 review 节点出发，根据条件路由
graph.add_conditional_edges(
    "review",
    routing_condition,
    {
        END: END,
        "escalate": "human_review",
        "write": "write"
    }
)
```

这段代码里有一个关键的循环路径：`"write"` 作为条件边的返回值，指向了 `write` 节点本身。

而 `write` 节点的输出又会流回 `review` 节点——这形成了一个 `write → review → (条件) → write` 的循环。

LangGraph 在编译时会识别这个跨节点的循环路径，并注册循环检测 [1](https://m.jiaoben.net/wz/364613.html)。

### 3.3 循环检测在条件边路径上的特殊行为

条件边上的循环检测有一个容易被忽略的细节：**状态哈希的比对是在节点执行完毕之后进行的，而不是在条件函数里**。

这意味着如果你的条件函数写成了一个无限循环——比如 `while True: pass`——循环检测完全不会介入，因为条件函数本身不是 LangGraph 的节点执行流程的一部分 [1](https://m.jiaoben.net/wz/364613.html)。

另外，当一个循环路径上存在 `interrupt` 节点时，LangGraph 会在每次到达 `interrupt` 时保存状态快照。

这实际上给循环检测提供了一个额外的「锚点」：如果 Agent 在两个 `interrupt` 之间陷入循环，系统至少有两次机会比对状态哈希。

这个特性是设计「人工介入 + 自动恢复」工作流的关键。你可以在一个高频循环的路径上插入 `interrupt` 节点，让系统在每次经过时暂停，等待人工确认是否继续 [3](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)。

![正文图解 1](https://iili.io/BgbqNF2.png)
> 正文图解 1

---

## 4. 面试高频追问：为什么 max_steps 配置了，Agent 还是可能死循环

### 4.1 场景 A：状态未收敛导致 LangGraph 认为是「不同步」

最常见的情况：你的 Agent 在同一个节点上跑了 10 步，每一步都「不重复」——比如 draft 内容每次都在变，只是变得越来越长、越来越乱。

LangGraph 的状态哈希检测到的是 10 个不同的状态，不会触发循环异常。

你的 `max_steps=10` 在第 10 步结束，但没有解决根本问题：Agent 其实已经在同一个节点上鬼打墙了，只是它每次生成的文字略有不同 [1](https://m.jiaoben.net/wz/364613.html)。

这种场景的本质是：**状态哈希只能检测「完全相同」的状态，不能检测「语义上在原地踏步」的状态**。

一个 draft 从「方案A不好」变成「方案A不好，考虑方案B」再变成「方案B也有问题，考虑方案C」——三次状态都不同，但 Agent 其实在一个错误的分支上越走越深。

面试时如果被问到这个问题，一个有深度的回答会区分「结构层面的循环」和「语义层面的发散」，然后提出「需要引入额外的收敛判断，比如检查某个关键字段的变化率，或者设置人工审核点」 [4](https://juejin.cn/post/7628123736236179490)。

### 4.2 场景 B：`max_steps` 触发时已消耗大量 Token

第二个常见坑：`max_steps` 是在节点执行完毕后计数的。

也就是说，**每一次节点执行中的 LLM 调用、API 请求、Token 消耗都发生在 max_steps 计数的窗口期内**。

如果你的节点里有复杂的 `ReAct` 循环或者多次工具调用，单步的 Token 消耗可能已经让你的线上账单爆炸了 [4](https://juejin.cn/post/7628123736236179490)。

举一个具体数字：一轮完整的「思考-工具调用-观察」大约消耗 2000 到 5000 个 Token（取决于 prompt 长度和上下文）。

如果你把 `max_steps` 设成 20，实际上已经允许 Agent 消耗 4 万到 10 万个 Token 才中断。这对于生产环境的预算控制来说是一个真实的财务风险。

更好的做法是在节点内部设置每步的 Token 预算和超时限制，而不是完全依赖图执行层的 `max_steps`。

![](https://iili.io/B8CX5yG.png)
> 线上跑了一晚上，账单出来整个人都傻了……

### 4.3 场景 C：长程依赖路径上的隐性循环

第三种情况比较隐蔽：当你的图里有多个节点形成了一条长依赖链，而循环发生在链的中间节点时，状态哈希的检测逻辑可能会被绕过。

比如：`planner → researcher → synthesizer → evaluator → (条件) → synthesizer` 这条路径。

`synthesizer` 的输出每次都不同（因为 `researcher` 每次给的素材有差异），状态哈希不会重复。

但 `evaluator` 一直在判断「结果是否足够好」，而这个判断本身可能因为 prompt 的微小变化产生不一致的结论——导致循环在逻辑上形成了，但实际上状态哈希检测不到 [5](https://klab.tw/2026/04/from-prompt-to-harness-engineering/)。

这种场景的面试价值在于：它考察候选人对「LangGraph 循环检测的语义边界」的理解——系统能检测「状态相同」，但无法检测「逻辑在原地打转」。

你要主动提到这一点，说明你理解的是机制原理，而不是只会背参数名。

---

## 5. 生产级防护方案：三层防御体系的配置实践

### 5.1 第一层：状态比较层——自定义 `StateReducer` 强制收敛

状态哈希检测的局限在于它只能比对「完整状态」。在实际生产中，你更关心的是「某个关键字段是否收敛」，而不是「整个 State 是否完全相同」。

自定义 `StateReducer` 可以让你精确控制「什么算作相同状态」。

比如，对于一个写作 Agent，你可能只关心 `draft` 字段的内容是否稳定，而不关心 `revision_count` 每次都在递增 [1](https://m.jiaoben.net/wz/364613.html)。

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class ControlledState(TypedDict):
    draft: str
    revision_count: int
    is_approved: bool
    # 用于循环检测的关键字段白名单

def selective_state_reducer(state: ControlledState, messages: list) -> ControlledState:
    """自定义状态归约：只对 draft 字段做哈希比对"""
    return {
        "draft": state["draft"],
        "revision_count": state.get("revision_count", 0),
        "is_approved": state.get("is_approved", False),
        # 忽略 metadata 类的字段，只保留业务核心
    }

# 在图中注册自定义 StateReducer
graph = StateGraph(
    state_schema=ControlledState,
    state_schema_reducer=selective_state_reducer  # 关键：控制哈希比对范围
)
```

这个自定义 Reducer 的效果是：即使 `revision_count` 在每次执行中递增（从 1 变到 2 变到 3），哈希比对也只关心 `draft` 字段的内容。

一旦 draft 内容连续两次相同，状态哈希就会撞上，循环检测立即触发。

### 5.2 第二层：图执行层——`max_steps` + `interrupt` 人工审核点

在图执行层，`max_iterations` 提供硬性兜底，`interrupt` 提供人工介入通道。两者配合使用，才能在「自动防死循环」和「保留人工干预权」之间找到平衡 [3](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)。

```python
# 第二层防御：图执行层的双保险
app = graph.compile(
    checkpointer=MemorySaver(),  # 支持断点续传
    interrupt_before=["final_review", "escalate"],  # 高风险节点前强制暂停
    max_iterations=15,  # 硬性步数上限
)

# 执行入口
initial_state = {"topic": "技术方案评估", "draft": "", "revision_count": 0, "is_approved": False}

# 在循环的高风险节点序列上分批执行
for _ in range(15):
    snapshot = app.invoke(None, stream_mode="values")  # 支持流式监控

# 检查是否到达 interrupt 点
    if snapshot.next:
        # 此时图停在 interrupt_before 指定的节点前
        user_decision = input("Agent 请求人工确认，是否继续？(y/n): ")
        if user_decision.lower() != "y":
            print("人工终止，当前状态快照已保存")
            break
        # 确认后继续执行
        app.invoke("y")
```

这段代码的核心逻辑是：**不在单次 `invoke` 里跑完整张图，而是用循环分批次执行，每次检查 interrupt 状态**。

这是生产级 Agent 工作流的标准做法——尤其是在客服、审批、内容生成这类需要质量把关的场景 [1](https://m.jiaoben.net/wz/364613.html)。

### 5.3 第三层：系统层——超时控制与熔断机制

第三层防御在系统层面：不管 LangGraph 的循环检测有没有正常工作，系统本身要有熔断兜底 [3](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)。

```python
import signal
import functools

class ExecutionTimeout(Exception):
    pass

def timeout_handler(signum, frame):
    raise ExecutionTimeout("Agent 执行超时，已被熔断")

# 注册 5 分钟超时
signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(300)  # 300 秒 = 5 分钟

try:
    result = app.invoke(initial_state)
    signal.alarm(0)  # 执行正常完成，取消 alarm
    print(f"最终结果: {result}")
except ExecutionTimeout as e:
    print(f"熔断触发: {e}")
    # 执行降级逻辑：保存状态快照，发送告警
```

三分钟也好五分钟也好，这个超时值需要结合你的 Agent 单步平均耗时来估算。

给一个参考锚点：如果你的节点平均执行时间（包括 LLM 调用）是 5 到 10 秒，`max_iterations=15` 最坏情况是 150 秒——那你把系统超时设在 180 秒左右，留一个合理的 buffer。

### 5.4 完整代码示例

把三层防御串起来，形成一个可以直接复制到项目里的模板：

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Literal
import signal

# ====== 第一层：状态定义 + 自定义 Reducer ======
class AgentState(TypedDict):
    task: str
    result: str
    iteration: int
    confidence: float

def controlled_reducer(state: AgentState, batch: list) -> AgentState:
    """强制收敛：只比较 result 和 confidence"""
    latest = batch[-1] if batch else state
    return {
        "task": latest["task"],
        "result": latest["result"],
        "iteration": latest.get("iteration", 0),
        "confidence": latest.get("confidence", 0.0),
    }

# ====== 第二层：节点定义 ======
def execute_node(state: AgentState) -> AgentState:
    # 模拟 Agent 执行逻辑
    new_confidence = min(1.0, state.get("confidence", 0.0) + 0.15)
    return {
        "iteration": state.get("iteration", 0) + 1,
        "confidence": new_confidence,
        "result": f"Iteration {state.get('iteration', 0) + 1} result",
    }

def check_quality(state: AgentState) -> Literal["execute", END]:
    if state.get("confidence", 0) >= 0.85:
        return END
    elif state.get("iteration", 0) >= 5:
        return END  # 迭代超限，强制退出
    return "execute"

# ====== 第三层：超时熔断 ======
def run_with_timeout(app, initial_state, timeout_seconds=120):
    class TimeoutException(Exception):
        pass

def timeout_handler(signum, frame):
        raise TimeoutException()

signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout_seconds)

try:
        result = app.invoke(initial_state)
        signal.alarm(0)
        return result
    except TimeoutException:
        return {"error": "timeout", "state": initial_state}

# ====== 组装 ======
graph = StateGraph(AgentState, state_schema_reducer=controlled_reducer)
graph.add_node("execute", execute_node)
graph.add_conditional_edges("execute", check_quality, {"execute": "execute", END: END})
graph.set_entry_point("execute")

app = graph.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["check_quality"],  # 质量检查前人工确认
    max_iterations=10,
)

initial_state = {"task": "analyze", "result": "", "iteration": 0, "confidence": 0.1}
result = run_with_timeout(app, initial_state, timeout_seconds=60)
```

三层防御配合 `checkpointer=MemorySaver()` 的断点续传能力，即使进程被熔断重启，也能从上次中断的状态继续执行，而不需要从头开始——这对长时运行的 Agent 工作流是生产级必备 [1](https://m.jiaoben.net/wz/364613.html)。

![](https://iili.io/BTfkLJa.png)
> 写完了。三层防御，现在去 review……

---

## 6. 面试现场：如何把这个话题讲出工程深度

### 6.1 第一轮追问：如何判断 Agent 已经进入死循环

大多数候选人会在这一步翻车——他们会回答「看 max_steps 有没有触发」。

这是一个正确答案，但深度不够。更完整的回答应该分成两层：

**表面信号**：图执行时间异常长（超过预期单步耗时的 N 倍），或者 `max_iterations` 达到上限，或者 `GraphRecursionError` 被抛出 [6](https://juejin.cn/post/7623748440833507338)。

**深层判断**：检查 `seen_nodes` 集合里某个节点的出现频率，或者在 `interrupt` 回调里比对相邻两次 State 的关键字段变化率。

如果一个节点的输出字段在连续两次执行中变化幅度小于阈值（比如 5%），即使状态哈希没有撞上，也说明 Agent 进入了「语义上的发散」——这是更隐蔽的死循环形态。

面试官真正想听的，不是「max_steps 触发」，而是「你知道状态哈希的语义边界在哪里，知道它检测不了什么」。

### 6.2 第二轮追问：如何在不中断 Agent 的前提下让人工介入

这道题考察的是你对 `interrupt` 机制的理解深度 [3](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)。

标准答案是「在图里加 `interrupt_before` 节点」。但如果面试官继续追问，你还需要知道：

**`interrupt` 的本质是什么**：它不是让图停下来等用户输入——它是把状态快照保存到 `checkpointer` 里，然后让 `invoke` 返回一个「未完成的快照」。

你需要在下次 `invoke` 时显式传入 `"y"` 或者其他决策信号，才能让图继续执行。

**多轮人工介入怎么做**：在一个循环里设置多个 `interrupt` 点，每次到达时保存上下文，决策者看到当前状态后给出指令，下一次 `invoke` 携带这个指令继续。

关键是要设计好「决策」这个节点的数据结构——通常是一个 `{decision: str, reasoning: str}

## 参考文献

1. [第14章 高级Agent：LangGraph与状态机-脚本在线](https://m.jiaoben.net/wz/364613.html)

2. [Workflows and agents - Docs by LangChain](https://docs.langchain.com/oss/python/langgraph/workflows-agents)

3. [GRAPH_RECURSION_LIMIT -Docsby LangChain](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)

4. [当前端开始做Agent后，我才知道LangGraph...](https://juejin.cn/post/7628123736236179490)

5. [HarnessEngineering｜AIAgent... | Kyle's Code Blog - KodeLAB](https://klab.tw/2026/04/from-prompt-to-harness-engineering/)

6. [LangGraph 源码拆解：它凭什么比 LangChain 更适合 Agent 编排？](https://juejin.cn/post/7623748440833507338)
