---
title: "Pydantic AI 创始人 Samuel Colvin：图库是个错误，代码本身就是图"
date: "2026-10-14 05:09:05"
updated: "2026-10-14 05:15:03"
permalink: "posts/2026/10/14/pydantic-ai-创始人-samuel-colvin图库是个错误代码本身就是图/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/14/pydantic-ai-创始人-samuel-colvin图库是个错误代码本身就是图/"
article_id: "5e86b5c3-2cd6-4a9d-8ef3-9884fc9f6b2f"
description: "Pydantic AI 创始人 Samuel Colvin 发文认为图库是个错误，代码本身就是图，通过类型提示获得类型安全、通过 async 获得并行执行。他提出图 API 存在类似 CAP 定理的取舍，类型安全、并行与快照三者不可兼得，并以此解释为何在 pydantic-graph V2 移除持久化、将持久执行交给 Temporal。"
cover: "/var/lib/aimagician/artifacts/covers/5e86b5c3-2cd6-4a9d-8ef3-9884fc9f6b2f/3201d199-94dc-4a22-a72d-a029ae223835/cover.png"
imgTop: false
---

这种判断来自 Pydantic 团队在构建 AI agent 框架时的实际踩坑。早期的版本曾试图用显式的图节点和边来描述 agent 的工作流，但最终发现这套抽象不仅增加了维护成本，还会在某些关键场景下破坏类型系统的保证。

## 一个反直觉的出发点

大多数现代 agent 框架都采用「图」作为核心抽象。用户定义节点、连接边、指定流转逻辑，框架负责执行和状态管理。这种设计在概念上很清晰，但在工程实现上引入了大量的复杂度。

Colvin 的观点很直接：Python 函数调用本身就是有向图。async def 定义的异步函数、类型注解提供的结构约束、yield 或 await 带来的控制流转移，这些语言原语已经构成了完整的图执行模型。框架要做的只是不干扰它们，而不是再套一层抽象。

这个判断背后的代价权衡是真实的。显式图 API 的优势在于可视化调试和动态调度，但代价是类型信息在编译期无法完全核验——图的结构通常通过字符串标识符或运行时反射来定义，静态分析工具很难跟上。

## 图 API 的 CAP 困境

Colvin 将问题类比为分布式系统中的 CAP 定理。图 API 有三个关键属性：类型安全、并行执行、执行快照。他给出的结论是三者不可兼得。

保持类型安全需要编译器在编译期验证所有节点和边的类型，这要求图的结构是静态确定的。一旦引入动态调度（根据 LLM 的返回结果决定下一步走哪个节点），类型系统就不得不妥协。

支持并行执行需要在图层面追踪每个节点的依赖关系，这会导致图数据结构的内存开销随并发规模线性增长。而执行快照（用于断点续跑或故障恢复）又要求图的状态可以被序列化并在任意时刻恢复——这在动态图结构下几乎无法做到类型安全。

三选二的取舍在实际工程中体现得很具体。

| 选择 | 牺牲 |
|------|------|
| 类型安全 + 并行 | 没有快照，无法断点续跑 |
| 类型安全 + 快照 | 串行执行，失去并发优势 |
| 并行 + 快照 | 类型检查退化为运行时校验 |

这个矩阵不是理论推演，而是 pydantic-graph V1 在实际使用中碰到的真实问题。当团队试图同时支持这三个特性时，代码库的复杂度呈指数级增长，最终不得不做出取舍。



![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> Agent 运行时过载时的真实状态



## 代码作为图的三种能力

去掉图抽象层之后，剩下的 Python 代码需要具备三种能力，才能承担原本由图 API 负责的职责。

**类型安全**通过 Pydantic 的数据模型实现。每个 agent 的输入、输出、工具调用参数都用 Pydantic Model 定义，编译期或运行时都能得到强类型保证。LLM 返回的工具调用结果会被自动验证和结构化，而不是作为一个裸 JSON 到处传递。

**并行执行**通过 Python 原生 async 机制实现。asyncio.gather 可以同时发起多个独立的 I/O 操作，类型系统能够追踪每个协程的返回值类型。这比在框架层实现自定义并发原语更可靠，也更符合 Python 开发者的预期。

**状态追踪**通过 Logfire 这类可观测性工具实现。Pydantic 团队同时维护 Logfire，其设计理念是让每个函数调用、每次 await 都自动产生可追踪的日志和指标，而不是让框架手动记录状态转换。这种方式下，状态的序列化与反序列化由基础设施层处理，业务代码不需要关心。

这三者合在一起，构成了一种「隐式图」的执行模型——图的结构存在于代码的控制流中，而不是存在于某个运行时数据结构里。



![隐式图 vs 显式图执行模型对比](https://iili.io/nXRTKan.png)
> 隐式图 vs 显式图执行模型对比



## 持久化不是库该管的事

pydantic-graph V2 移除持久化能力是这个设计路线的自然延伸。持久化——即在执行中途保存状态、之后从断点恢复——是一个独立且复杂的系统工程问题。

它需要解决序列化格式的选择、时钟同步、并发写入冲突、部分写入的原子性保证等一系列底层问题。这些问题与技术栈无关，不管你的 agent 是用 Python、Go 还是 Rust 写的，都需要同样的基础设施支撑。

尝试在一个通用 agent 框架内内置持久化能力，结果往往是两头不讨好：通用性不够导致适用场景有限，而复杂度又挤占了框架在其他方面的投入。

Colvin 的方案是将持久化委托给专门的基础设施平台。Temporal 是目前被推荐的选项之一——它是一个专门解决分布式任务持久化和编排的平台，提供 exactly-once 语义、工作流快照和跨机器迁移能力。这些能力如果要在 agent 框架内自行实现，工程量会非常可观。

这种分工的思路在软件工程中并不罕见。Unix 哲学强调「做一件事并做好」，持久化就是那个应该由专门工具来做的事情。

| 能力 | 处理方式 |
|------|----------|
| 类型安全 | Pydantic 模型 + 类型注解 |
| 并行执行 | asyncio + 原生 async/await |
| 状态追踪 | Logfire 可观测性 |
| 持久化 | Temporal 等基础设施 |

## 什么情况下仍然需要显式图

这个观点并非意味着所有场景都应该放弃显式图抽象。在某些特定情况下，显式图仍然是更合适的选择。

当工作流需要动态生成时——例如根据 LLM 的实时判断构建新的执行路径——代码层面的静态图无法表达这种不确定性。此时显式图 API 可以提供必要的灵活性。

当团队需要非开发人员参与工作流设计时——例如产品或运营人员通过可视化界面配置 agent 行为——显式图配合可视化工具是更实用的方案。

当执行路径需要在多个环境之间迁移时——例如开发环境到生产环境的图结构需要版本化管理和回滚——显式图配合版本控制系统更便于管理。

但这三个场景的共同点是：它们都需要显式图提供的灵活性和可观测性，而不是框架本身缺少这些能力。问题的关键不在于「要不要图」，而在于「图应该由谁负责」。显式图的职责应该是描述和可视化，而不是承担类型安全、并发调度和持久化的基础工程问题。

Colvin 的判断给出了一条清晰的分界线：如果框架在用图抽象做语言已经能做得更好的事情，那就是过度设计。代码本身就是图，这个论断的核心不是否定图的价值，而是主张把图的职责归还给它最适合承载的地方。

在 Python 生态中，这意味着选择 Pydantic AI 这类框架时，优先信任语言原语和成熟的基础设施，而不是在框架层面重复发明轮子。这个判断适用的边界是：当你的工作流以代码形式表达足够清晰，且依赖成熟的基础设施平台时。一旦工作流的高度动态性超过代码表达能力，或者基础设施的引入成本过高，重新引入显式图抽象就是一个合理的工程权衡。

### 参考文献

- Samuel Colvin, Agent Engineering with Pydantic + Graphs, Agent Hour #2, 2024
- Samuel Colvin, From Stateless Nightmares to Durable Agents, PyAI Conference 2026
- Pydantic AI v1 文档, pydantic.dev/articles/pydantic-ai-v1
- Temporal.io 官方文档, temporal.io/docs
- Pydantic Logfire 可观测性平台, pydantic.dev/logfire

Pydantic AI 创始人 Samuel Colvin 发文认为图库是个错误，代码本身就是图。通过类型提示获得类型安全，通过 async 获得并行执行。

## 代码本身就是图

大多数 Agent 框架把「图」当作一等公民：节点是工具调用，边是依赖关系，运行时负责调度执行顺序。Colvin 的反直觉判断是，这层抽象没必要存在。

Python 代码本身就是一个有向无环图。函数调用构成节点，参数传递构成边，async/await 提供并发调度。你不需要额外声明「这个工具依赖那个工具」，类型签名已经把依赖关系说清楚了。

### 类型安全来自提示

Pydantic 的核心哲学是把类型提示变成运行时校验。Colvin 把这个思路推得更远：当函数签名已经描述清楚输入输出，再画一张图来描述同样的依赖，本质是重复劳动。

代码里的类型提示是静态可验证的。图的 schema 是动态构造的，编译期拿不到约束。前者让你写错时立刻报错，后者让你写错时运行到那条边才暴露。

### 并行执行来自 async

异步编程让并发调用变得自然。两个独立工具调用写成两个 await，运行时自动调度。如果非要画一张图，再用某个调度器来解释「这两条边可以并行执行」，等于用两层语言描述同一件事。

更准确地说，代码里的并发是声明式的，图的并发是命令式的。前者读起来像意图，后者读起来像实现细节。

## 持久化的正确归属

Colvin 把 durable execution 的职责划给了 Temporal。

Temporal 的设计哲学是：执行状态由调度器管理，业务代码只描述逻辑。你写 Python 函数，Temporal 负责序列化、调度、重试、恢复。类型提示仍然有效，因为函数签名是静态的；并发由调度器处理，不需要你在代码里显式声明；状态由 Temporal 管理，不污染业务逻辑。

这和 pydantic-graph 的思路一致：让每种工具只做一件事。图描述依赖关系，类型系统提供安全保证，Temporal 负责持久化。



![分层架构分工](https://iili.io/nXRTcwx.png)
> 分层架构分工



这种分层的代价是引入了外部依赖。但对比内嵌持久化带来的复杂度——序列化格式、版本兼容、恢复语义——这个代价是可接受的。

## 什么时候仍然需要显式图

Colvin 不是完全否定图的价值。在以下场景中，显式图仍然是合理的选择：

第一，非 Python 场景。当你需要跨语言共享执行计划，或者用 JSON/YAML 描述工作流时，显式图是唯一选择。

第二，动态构建。Agent 的执行路径在运行时决定，依赖关系无法在编译期确定，这时图结构比代码更灵活。

第三，可视化调试。当工作流复杂到需要工程师直观理解执行拓扑时，渲染成图比读代码更高效。

但在这三种情况之外，把图当作一等公民往往是在为不存在的场景造轮子。代码已经表达了一切，再加一层图只是增加认知负担。

这个问题的边界很清晰：如果你的执行计划在编译期就已经确定，类型提示足够描述依赖，async 足够表达并发，那么显式图库就是多余的抽象层。

## 类型安全来自提示

Python 的类型提示从 3.5 引入，到 3.10 的 `match` 语句和 3.12 的模式匹配，类型系统一直在演进。Pydantic 的价值在于它在运行时把这些提示变成了可执行的验证。

当 agent 调用工具时，Pydantic AI 会在两个层面做验证。第一层是调用前的参数校验，确保传给工具的参数符合类型签名。第二层是返回后的结果校验，确保 LLM 生成的参数能被正确解析。这两层校验都依赖于类型提示，而不是图的拓扑声明。

这种设计有一个隐含的前提：图的结构足够简单，或者足够稳定。如果你的流程需要动态分支、条件跳转或循环，类型提示只能描述单个节点的输入输出，无法描述整体结构。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 类型系统够用



这也是为什么 Colvin 承认某些场景下显式图仍然有必要。比如多步骤工作流、需要可视化的流水线、或者需要外部工具编排的场景。在这些场景里，图的结构本身成了代码的一部分，需要被显式描述。

## 并行执行来自 async

Python 的 `async` / `await` 语法从 3.5 开始引入，到 3.11 的 `asyncio.TaskGroup`，异步编程一直在向更安全的方向演进。Colvin 的观点是，并行执行本来就是 async 的职责，不需要图库来额外封装。



![Agent 执行流程](https://iili.io/nXRT8PI.png)
> Agent 执行流程



这个流程图展示了一个典型的 agent 循环：LLM 决定下一步行动，如果需要调用工具，就并行执行，然后聚合结果回到 LLM。整个过程可以用 async 函数自然表达，不需要引入额外的图抽象。

`async def run_agent(prompt: str) -> Result:` 这个函数签名本身就说明了输入和输出类型。如果中间需要并行调用多个工具，可以用 `asyncio.gather` 或 `TaskGroup` 来表达，类型检查器可以验证每个工具的输入输出是否匹配。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> 并行不复杂



这种设计的优势在于「渐进式复杂度」。简单的 agent 只需要一个 async 函数，复杂的 agent 可以逐步增加并发控制和错误处理。而一旦用了图库，复杂度在开始时就全部暴露出来了。

## 可执行的判断

如果你正在构建一个 Python 项目，选择是否使用图库时可以先问自己三个问题。

第一，流程的结构是静态的还是动态的？如果每一步都在代码中明确定义，直接用 async 函数。如果下一步由运行时数据决定，考虑显式图。

第二，类型安全有多重要？如果需要严格的输入输出验证，Python 的类型系统已经够用。如果还需要跨语言的验证，或者需要外部工具理解你的流程，显式图可能更有价值。

第三，持久化是内置需求还是外部需求？如果需要在进程崩溃后恢复状态，直接用 Temporal 或类似平台。不要把持久化塞进图库，你会两头都得不到好结果。



![被追着问 BUG 修完了吗时的程序员表情](https://iili.io/noCi27n.png)
> 选择你的方案



Colvin 的论点不是要消灭图，而是要重新定位图。代码已经是图了，你不需要额外的抽象层。只有当图的语义本身成为关注的核心时，才需要显式的图定义。在此之前，先用好 Python 的类型系统和异步原语。

这个建议的实际价值在于降低启动成本。很多团队在选择框架时，花费了大量时间配置图的结构，而不是实现业务逻辑。如果把图交给代码，类型系统来验证，起步会快得多。

## 参考文献
- Samuel Colvin 关于 pydantic-graph 与 durable execution 的技术讨论，见 [Pydantic AI 官方文档](https://pydantic.dev)
- Temporal durable execution 设计理念，见 [Temporal 官方文档](https://temporal.io)
- Pydantic AI 的类型安全 Agent 设计，见 [Pydantic AI v1 发布文章](https://pydantic.dev/articles/pydantic-ai-v1)


![程序员系列表情：你从我脸上看到了什么](https://iili.io/nlCYpe9.png)
> 代码即图


- Samuel Colvin, *Why we built PydanticAI*, Agent Hour #2, 2024: https://home.mlops.community/public/videos/why-we-built-pydanticai-and-why-you-might-care-samuel-colvin-agent-hour-2-2024-12-19
- Samuel Colvin, *Pydantic AI with Samuel Colvin*, Software Engineering Daily: https://softwareengineeringdaily.com/podcasts/pydantic-ai-with-samuel-colvin
- Samuel Colvin, *From Stateless Nightmares to Durable Agents*, PyCon, 2026: https://www.youtube.com/watch?v=flf_IKnFYnE

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
