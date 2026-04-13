---
layout: post
title: AI 面试八股文 Vol.2：AI System Design 为什么总在一面被问到？
description: 这篇 Vol.2 不再空谈框架，而是把 AI System Design 面试里最常见的 Runtime、Tool Calling、状态管理和失败路径拆开讲透。
tags:
- AI System Design
- Agent Runtime
- Tool Calling
- 状态管理
- 后端 AI 面试
- AI
- Vol.2
- System
canonical_url: https://tobemagic.github.io/ai-magician-blog/posts/2026/03/28/ai-面试八股文-vol2ai-system-design-为什么总在一面被问到/
permalink: posts/2026/03/28/ai-面试八股文-vol2ai-system-design-为什么总在一面被问到/
date: '2026-03-28 03:55:00'
updated: '2026-03-31 01:20:00'
cover: https://iili.io/B2xjpm7.png
categories:
- AI工程
- 面试八股
---

周三下午四点，群里突然有人贴了一张面经截图。我顺手翻了最近 7 份公开面经，发现 AI Agent 岗位的一面问法不一样，但最后几乎都会绕回系统设计：`请你设计一个支持多工具调用、能容错、还能把长任务反馈给前端的 Agent Runtime。` 题目不长，但下面那句补刀很致命: 前端网关超时 30 秒，模型还会偶尔吐错 JSON，怎么保证系统不把用户直接晾在那儿？

![正文配图3](https://iili.io/B2xNilf.jpg)

> 图解用途：用单一主体和动作关系表达异步任务反馈与状态更新。

很多人第一反应还是去背框架名词，什么 LangChain、什么 RAG、什么 Workflow。但这类题真正想看的是另一件事：你到底把 Agent 当成一个会调用大模型的玩具，还是把它当成一套需要上线、需要兜底、需要扛流量的后端系统。

如果你准备的是后端 AI Agent 实习岗，这道题越来越像一面里的分水岭。因为它天然把 Prompt 能力、接口工程、状态管理、异步架构、可观测性和数据隔离全部揉到了一起。答得好，面试官会觉得你是真的做过；答得虚，基本三轮追问就露底。 ![程序员系列表情：据说换成这个发型，面试通过率很高](https://iili.io/qyHHWKv.png)
> 题目刚念完，后背已经先绷紧了

![正文配图2](https://iili.io/B2xN2jt.jpg)

> 图解用途：用简单情境图承接状态分层和 Memory，不画复杂架构图。

## 这道题到底在筛什么

AI System Design 不是让你现场画一张特别漂亮的架构图，而是看你有没有把“不确定的模型”塞进“确定的工程系统”里。

传统后端题，更多是在问你服务怎么拆、库表怎么建、缓存怎么放。到了 Agent 这里，题目多出来一个新变量：模型输出本身不稳定。它可能答非所问，可能参数漏字段，也可能把一个本该 2 秒结束的工具链路拖成 40 秒。

所以面试官想看的，通常是三件事：第一，你能不能把状态拆清楚；第二，你能不能把长任务从主请求里剥出去；第三，你能不能把“模型犯错”设计成系统可恢复，而不是线上事故。 ![程序员 reaction：MicrosoftSQLServer,MongoDB](https://iili.io/B2xuxFj.png)
> 会调模型不难，难的是把系统兜住

## 先把主链路说清楚

最稳的答法，不是先讲模型，而是先讲请求生命周期。

用户请求进来以后，入口层先做鉴权、限流和请求落盘，然后把会话上下文和任务状态写到 Runtime Store。模型层只负责两件事：理解当前目标，产出结构化的下一步动作。真正耗时的工具执行，应该被投递到异步执行层，而不是塞在同步请求里硬等。

如果把这条主链路用一句话讲清楚，其实就是：`用户请求先经过 API Gateway，状态先落到 Session State；编排层负责让 LLM 产出下一步动作；动作先过 Schema Validator，再进入 Task Queue；真正的工具执行交给 Worker，结果回写 Result Store，最后再通过 SSE 或 WebSocket 把进度推回前端。`

这里最关键的不是 LLM 本身，而是 4 个基础组件：`Session State`、`Schema Validator`、`Task Queue` 和 `Result Store`。你只要把这四个点讲明白，系统设计的骨架基本就出来了。

### 1. Session State 不是把 messages 整包丢进 Redis

很多人一聊 Memory，就下意识说“把聊天记录存 Redis”。这句话不能说错，但在面试里只说到这里，基本等于没说。

真正要回答的是：哪些状态要强一致，哪些状态只要最终一致，哪些状态应该短存，哪些状态应该转成长记忆。比如当前工具执行状态、当前任务阶段、重试次数、人工接管标记，这些都更像运行时状态；而用户偏好、长期上下文、历史结论，则更像长期记忆。

如果你把所有 messages 原封不动堆进去，问题会很快出现：上下文窗口膨胀、TTFT 变慢、Token 成本失控，而且越聊越乱。更合理的做法是把会话状态拆成三层：短期窗口、结构化任务状态、可检索长期记忆。 ![程序员 reaction：onlygodcantellhowitworks](https://iili.io/B2xXCmX.png)
> messages 一路堆下去，review 时最先心梗的是自己

### 2. Tool Calling 一定要有确定性校验层

Agent 最危险的地方，不是它不会调工具，而是它“差一点就调对了”。比如 JSON 少一个字段、枚举值拼错、参数类型不对、调用顺序反了，这些都不是模型完全坏掉，但足够让你的线上链路出问题。

所以 LLM 和真实工具之间，必须隔一层确定性校验。最常见的做法就是 Schema Validator。模型给出的 tool call 先过 schema，失败了就地回喂错误，让它自修；如果连续 3 次 repair 还不行，就别再让它继续撞墙，直接进入兜底或人工接管。

这一层如果讲清楚，面试官一般会继续问：那为什么还要消息队列？答案很简单，因为很多工具天生就是慢的。查报表、跑检索、聚合多源数据、调用外部 Agent，都不适合同步阻塞住主请求。 ![程序员 reaction：testcoverage](https://iili.io/B2xXp3l.png)
> 主线程里硬等外部工具，系统基本已经开始冒烟了

```python
def execute_tool_call(tool_call, max_retries=3):
    for attempt in range(max_retries):
        try:
            args = validate_schema(tool_call["arguments"])
            return run_tool(tool_call["name"], args)
        except ValidationError as exc:
            tool_call = ask_llm_to_repair(tool_call, str(exc))
        except TransientError:
            backoff_seconds = 2 ** attempt
            sleep(backoff_seconds)
    return {"status": "fallback", "message": "tool temporarily unavailable"}
```

这里不用把代码讲得多花，重点是让对方听出来：你知道“LLM 自修 + 重试 + 兜底”是三层，而不是一层。

### 3. 长任务反馈别再只会“前端转圈”

AI System Design 题里很容易被追问的一点是：如果任务要跑两分钟，用户界面怎么办？

这时候最稳的回答通常不是先喊 WebSocket，而是先回到状态机。后端应该先生成任务 id，把任务异步化，让 Worker 去跑；前端通过 SSE 或轮询拿进度，必要时再用 WebSocket 承载双向事件。也就是说，通信协议只是表面，底层真正的核心还是任务状态表和事件驱动更新。

如果你只说“我会用 WebSocket”，面试官大概率会继续追着问：断线重连怎么办？消息幂等怎么办？前端刷新以后怎么恢复任务态？这时候如果你能接一句“状态永远落在服务端，连接只是视图层”，基本就会显得非常稳。 ![程序员系列表情：谁TM改了我代码](https://iili.io/B2xhTwF.png)
> 协议只是表面，状态机才是底盘

## 真正常见的追问，其实就这几类

### 模型输出错 JSON 怎么办

别把这个问题答成“我让 Prompt 更严格一点”。Prompt 当然有用，但生产系统不能把正确率押在提示词上。

更像工程回答的说法是：先约束输出协议，再做 schema 校验，再准备 repair path，最后再定义 fail-safe。也就是“先拦，再修，再退”。

### 多租户数据怎么隔离

这是很多同学最容易答轻的一点。向量检索、长期记忆、工具执行结果缓存，只要有一个 namespace 没隔好，就会出现 A 用户命中 B 用户数据的问题。

这类问题一旦放到真实业务里，不是体验 bug，而是安全事故。所以回答时一定要把 tenant id、project id、conversation id 这些隔离维度说出来，别只说“我会加鉴权”。

### 限流到底按什么维度做

很多后端同学会本能地说按 QPS 限流，但 LLM 场景里经常不够。真正容易把系统打崩的，往往是 TPM、并发 worker 数、外部工具额度，甚至是单租户长任务占满执行池。

所以这里最好说成分层限流：入口做用户级频控，模型层做 token 预算，执行层做 worker 并发和队列长度保护。这样回答，面试官会觉得你知道瓶颈不只在 API 层。 ![大佬系列表情：或许这就是大佬吧](https://iili.io/B9HlDhu.png)
> 能把限流说到分层，基本就不像背答案了

## 一道题里最容易暴露的易错点

第一个易错点，是把 Agent Runtime 说成“一个大函数”。真正可上线的 Runtime，一定更像显式状态机，而不是把 plan、tool、memory、retry 全揉在一个黑盒里。

第二个易错点，是只讲 happy path。面试官一般不怕你不知道最优答案，他更怕你完全没想过失败路径。JSON 失败、工具超时、队列积压、索引延迟、SSE 断连、缓存脏读，这些只要你能主动举出两三个，整个人的可信度都会高很多。

第三个易错点，是只会背框架。LangGraph、LangChain、AutoGen 都能提，但千万别把框架名当答案本身。好的回答应该是“我为什么需要一个显式 orchestration layer”，而不是“我会某个框架，所以这题我会”。 ![程序员系列表情：据说换成这个发型，面试通过率很高](https://iili.io/qyHHWKv.png)
> 框架能背，原理得自己扛得住追问

## 最后一句更实在的判断

如果你面的是后端 AI Agent 实习岗，AI System Design 这道题大概率不会消失，只会越来越早出现。因为公司现在缺的不是“能把 demo 跑起来的人”，而是“知道 demo 为什么一上线就会炸的人”。

Vol.1 讲 LLM，核心是你理不理解模型；到了 Vol.2，面试官开始看你能不能把模型放进系统里；再往后到 Vol.3 的 Tool Calling，本质上就是继续追问：这个系统出了错，你到底准备怎么收拾。

所以这题最值得准备的，不是画一张特别大的图，而是练出一种习惯：先划状态边界，再划失败路径，最后再讲框架和实现。只要顺序对了，整道题的气质就会完全不一样。 ![群里聊得热闹但自己得继续搬砖时的表情](https://iili.io/qysAvUP.png)
> 先把 runtime 兜住，再谈优雅

## 参考文献

[1] OpenAI. Building agents[EB/OL]. Available: OpenAI developer documentation. [2] LangChain / LangGraph. Memory and state management docs[EB/OL]. [3] OpenTelemetry. GenAI semantic conventions[EB/OL]. [4] Martin Fowler. Event-driven architecture patterns[EB/OL].

## 图解补充

![正文配图1](https://iili.io/B2xwV4f.jpg)

> 图解用途：用一张真实感较强的工程/面试现场图，先把读者带进 AI System Design 的语境。

---
> 如果你想继续追更，欢迎在公众号 **计算机魔术师** 找到我。后续的新稿、精选合集和阶段性复盘，会优先在那里做串联。
