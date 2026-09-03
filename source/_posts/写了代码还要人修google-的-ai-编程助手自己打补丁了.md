---
title: "写了代码还要人修？Google 的 AI 编程助手自己打补丁了"
date: "2026-09-03 05:00:01"
updated: "2026-09-03 05:15:15"
permalink: "posts/2026/09/03/写了代码还要人修google-的-ai-编程助手自己打补丁了/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/03/写了代码还要人修google-的-ai-编程助手自己打补丁了/"
article_id: "c369545d-b6b0-4152-877d-b52caf7ed2b6"
description: "AI 写代码总是留一堆尾巴——测试没过、结构跑偏、上下文溢出——过去靠 prompt 反复调优，如今谷歌推出 ADK 2.0 与 Antigravity SDK，把 agent 的行为边界、状态管理和验证闭环封装成一套可复用的「笼」。这篇文章拆解 harness 工程到底是什么，为什么它比 prompt engineering 更进一步，以及这套框架如何在实际编码场景中实现自动修复循环。"
cover: "/var/lib/aimagician/artifacts/covers/c369545d-b6b0-4152-877d-b52caf7ed2b6/46a4a8a8-2c71-466e-b452-84465a7f045e/cover.png"
imgTop: false
---

你让 AI 写了一段代码，跑起来发现测试挂了，手动改完又引入新问题。如果它自己能检测到失败、分析原因、重写代码并重跑测试呢？这不是科幻，谷歌最近用 ADK 2.0 演示的就是这套闭环——agent 不再只是「写」，而是能「修」和「验证」自己的输出。

## 一、AI 写代码，为什么总漏最后一步

### 1.1 从 prompt 到 harness 的范式转移

AI 编程助手最让人头疼的问题，从来不是「写不出来」，而是「写得不完整」。

Claude Code、Cursor 这些工具，在面对明确需求时往往能给出看起来合理的代码。问题出在后续——单元测试没跑、边界情况没覆盖、上下文溢出后行为漂移。开发者只能手动介入，补测试、修逻辑、再验证，来回折腾好几轮。

prompt engineering 的思路是再调一下提示词，让它「考虑得更周全」。但这种方式有上限，因为大模型的输出本质上是概率性的，单次 prompt 无法同时约束代码正确性、测试覆盖率、错误处理能力这三个维度的表现。

harness engineering 换了个问题定义方式：不要期望模型一次输出完美代码，而是给模型套上一层「笼子」——明确定义它的运行环境、记忆空间、验证流程，让它在笼子内通过多轮循环逼近正确结果。

### 1.2 一个真实场景：agent 写完代码但不跑测试

一个典型的日常流程是：开发者给 AI 发一个功能需求，AI 生成代码；开发者运行测试，部分用例失败；开发者手动修改代码，可能引入新的回归问题；再次运行测试，如此循环。

在这个过程中，AI 的角色是「一次性代码生成器」，每一次失败都需要人工介入判断原因、定位问题、执行修复。人类承担了闭环中最重要的反馈环节。

谷歌的演示展示了另一种路径：agent 写完代码后，自动触发测试执行；测试失败时，agent 读取失败日志、分析根因、重写代码、再次触发测试，直到通过为止。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> 每次改完又出新问题，懂的都懂



## 二、Harness 工程是什么：把 agent 关进笼子里

### 2.1 笼子的三个构件：约束、状态、验证

harness 工程的核心可以拆成三个层次。

第一层是环境约束。agent 不能随意读写系统文件、不能访问未授权的网络资源、不能在沙箱外执行命令。Antigravity SDK 通过 `workspaces` 参数限制 agent 的工作目录，通过 `save_dir` 参数管理它的记忆存储位置。

第二层是状态记忆。多轮迭代中，agent 需要知道之前做了什么、为什么失败、哪些假设已经验证过。Antigravity 通过 trajectories 目录保存 agent 的行为轨迹，让后续轮次可以回溯前序决策。

第三层是验证闭环。每次 agent 修改代码后，必须经过预设的验证流程（单元测试、安全扫描、类型检查）才能进入下一轮。验证不通过时，agent 收到的是结构化的失败信息，而不是模糊的「代码有问题」。



![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> 系统设计的取舍





![工作空间隔离](https://iili.io/nHeLLcQ.png)
> 工作空间隔离



### 2.2 为什么比 prompt engineering 更进一步

prompt engineering 的本质是优化单次输出的质量，依赖模型的内在能力边界。harness engineering 的本质是优化多轮交互的过程控制，把不可控的输出变成可控的工作流。

两者的关系不是替代，而是分层。prompt 仍然决定 agent 每轮「做什么」、怎么做推理；harness 决定 agent 「在哪做」、做到什么程度算完成、失败后怎么继续。

以自动修复循环为例。纯 prompt 方案需要在提示词里描述「如果测试失败，请分析原因并修复」——但这取决于模型的推理能力和上下文窗口。harness 方案则是：测试失败 → 捕获 stderr → 读取失败堆栈 → 注入到下一轮 prompt → 重新执行。每一步都是确定的，不是依赖模型的「尽量理解」。



![程序员 reaction：SPECIALPROMOTION!](https://i.ibb.co/QjXh5KxS/transparent.png)
> 程序员的标准操作



这种确定性带来一个直接收益：可观测性。当 agent 的行为出错时，你能追踪到是哪一层的问题——是约束不够严格、是状态丢失、还是验证逻辑有缺陷。而在纯 prompt 方案里，错误往往是黑箱的。

### 2.3 谷歌的官方定义与社区实践

谷歌在 Antigravity SDK 文档中的官方定义是：「A governed extensibility layer that lets you customize your agent with Python callables, bind outputs to typed schemas, and control tool invocation." 核心关键词是 governed（治理）——不是完全控制，而是在可控的前提下扩展。

社区实践方面，daily.dev 上有专门的 Harness Engineering 课程，覆盖环境设计、状态管理、验证和控制系统的完整路径。OpenAI 也在内部用这套范式让 Codex 写完了自己的 CI/CD 配置和测试套件。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 技术选型的确认信号



## 三、ADK 2.0 与 Antigravity SDK 是什么关系

### 3.1 同一套核心，两个面向

Google I/O 2026 之后，Antigravity 生态出现了多个入口，容易让人困惑：IDE 插件、CLI 工具、Python SDK、云端托管 API——它们是什么关系？

实际答案是：同一套 harness 核心，三种不同的使用界面。

IDE 视角（Antigravity IDE）：开发者在编辑器内与 agent 交互，适合日常编码场景。agent 的代码修改、测试执行、文件读写都在 IDE 框架内完成。

CLI 视角（Antigravity CLI / agy）：无头自动化场景，适合 CI/CD 流水线、定时任务、批量处理。定义好的 harness 配置可以直接通过命令行驱动 agent 执行。

SDK 视角（Antigravity SDK）：嵌入自有应用，适合平台工程师构建内部工具链。通过 Python 代码直接调用 harness 能力，自定义工具集、验证逻辑和安全策略。



![程序员 reaction：we'rechangingthe](https://iili.io/CCG5GX1.png)
> 一套核心，三种接入方式





![Harness Core](https://iili.io/nHeQuUl.png)
> Harness Core



### 3.2 Antigravity SDK 的工作机制解析

一个典型的 harness 配置如下：

```python
from google.antigravity import Agent

agent = Agent(
    model="gemini-3.7-flash",
    workspaces=["./sandbox"],       # 约束 agent 只能访问这个目录
    save_dir="./trajectories",      # 状态记忆持久化路径
    verification="pytest"           # 验证工具链
)

result = agent.run("实现一个排序函数并保证测试通过")
```

关键在三个参数：

**`workspaces`** 限制了 agent 的文件系统权限。agent 不能在任意路径写文件，也不能读取工作区之外的数据。这解决了之前 LLM agent 随意读写敏感文件的经典问题。
**`save_dir`** 负责状态记忆。agent 在之前的会话中做了什么、通过了哪些测试、遇到了哪些错误，都会被序列化保存。下一轮运行时，agent 会先读这些轨迹，而不是从零开始猜测上下文。

**`verification`** 则指定了验证工具。这里用的是 `pytest`，但也可以换成其他测试框架。每次 agent 产出代码后，系统会自动运行对应测试；如果未通过，agent 会收到失败信息并尝试修复。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 当 agent 进入无限试错循环时



不过这个循环需要门控。没有门控的 agent 可能陷入死循环——每次都在修改同一行代码却从不收敛。因此，ADK 2.0 引入了 max_retries 和 timeout 机制，并在每次重试时记录 trajectory 供人工审查。

### 3.3 企业平台 vs 本地开发的边界在哪

这里有一个实际的选择问题：应该用本地的 Antigravity SDK，还是直接上企业级的 Gemini Enterprise Agent Platform？

取决于三个维度：

**第一，安全性要求。** 如果代码涉及敏感数据、内部 API 密钥或受管控的下游服务，企业平台提供了基于 IAM 的细粒度权限控制。本地 SDK 虽然也能配置 workspace 约束，但无法阻止 agent 在执行过程中通过子进程调用外部网络请求。

**第二，协作需求。** 企业平台支持多 agent 共享 skill registry、统一身份认证和跨团队的 pipeline 管理。如果团队有多人共用同一套 agent 配置，并且需要在代码评审中追溯 agent 的行为轨迹，托管平台更合适。

**第三，迭代速度。** 本地 SDK 允许快速原型验证，改动代码即可生效。企业平台每次部署需要走审批流程，更适合稳定运行的生产级 agent。



![面对明显不属于自己的锅时强硬拒绝的表情](https://i.ibb.co/dwZpBDcP/transparent.png)
> 选择工具时的现实考量



一个折中方案是：用 Antigravity SDK 在本地开发调试，确认逻辑稳定后再迁移到企业平台。两者共用同一套 harness 定义，迁移成本主要在配置文件而非核心逻辑。

## 四、实际落地：自动修复编码循环长什么样

### 4.1 workspace 隔离与 trajectory 记忆

过去 ai 写代码最大的隐患是「不知道自己在哪」。每次 session 都是白纸，agent 改了文件、跑了测试、删了临时产物，但没人记住这些变化。

ADK 2.0 用两个机制解决这个问题。

第一是 workspace 隔离。通过 `workspaces=["./sandbox"]` 把 agent 的活动范围限制在指定目录，这个目录外的文件不可读写，依赖环境也在此范围内声明。代码改错了，不会污染项目其他模块。

第二是 trajectory 记忆。通过 `save_dir="./trajectories"` 保存 agent 的每一次工具调用、文件读写、命令执行记录。下次启动时，agent 能读取历史轨迹，知道自己上一轮做了什么、为什么那样做，而不是从零开始。



![明知不合理但还是把锅背上的表情](https://iili.io/CuzaQHP.png)
> 这就是真正的 AI 氛围编程，不是只写代码



这种设计的意义在于：agent 不再是无状态的函数，而是一个有记忆的连续进程。它会在多次尝试后积累经验——比如「上次我用正则解析那个 YAML 失败了，这次换成 parser」。

### 4.2 单元测试驱动的闭环修复流程

光有记忆还不够，关键是让 agent 知道什么算「正确」。

Antigravity SDK 的做法是把 pytest 作为验证原语。具体流程如下：



![程序员 reaction：Whenyoucreatea](https://iili.io/CxfkfI4.png)
> 测试挂了，自己修还是自己背

mermaidmermaid
stateDiagram-v2
    [*] --> Planning
    Planning --> Executing: 生成初始代码
    Executing --> Testing: 代码完成
    Testing --> Done: 测试全部通过
    Testing --> Repairing: 测试失败
    Repairing --> Analyzing: 读取失败日志
    Analyzing --> Planning: 确定修复方案
    Planning --> Executing: 重写代码
    Executing --> Testing

这个过程看起来简单，但实际实现中需要处理几个边界情况：修复循环的最大轮次限制、无限循环的兜底策略、agent 自我修正时保持原意图不偏移。

首先是失败信息的解析。pytest 的输出包含文件路径、行号、异常类型、断言差异，agent 需要准确提取这些信息才能定位问题。Antigravity 对此做了结构化解析，而不是让 agent 自己读懂原始输出。
```

其次是重试的上限控制。不设置上限会导致 agent 在同一个错误上无限循环。实践中一般设置 3 到 5 次重试，超出后交给人类介入。



![程序员 reaction：柯南00070 出现了](https://iili.io/CCZAMap.png)
> 每次修复都在锁定问题的真相



最后是回归保护。每次修复后，不仅要重新运行失败的测试，还要跑全量测试，防止修复引入了新的破坏。

### 4.3 与 spec-kit 结合的版本化工作流

spec-kit 是 GitHub 推出的规格驱动开发框架，核心思路是把每个开发产物都变成 git 里可追踪的文档。

ADK 2.0 与 spec-kit 结合后，自动修复循环不再是一个黑盒。每一步都有明确的输入输出：spec 定义「要做什么」，design 定义「怎么做」，implementation 是 agent 产出的代码，test 是验证标准。



![程序员 reaction：特朗普00017 你等着我这就去发推特](https://iili.io/CgBtVqB.png)
> 系统化思考才是工程师的日常



这四层之间通过 git 提交记录串联，agent 的每次修改都可以回溯到对应的 spec 条目。出了问题，可以从 implementation 一路追溯到 spec，判断是哪一层出了问题。

这种做法的价值在于「可审计」。不是「agent 瞎改了一通」，而是「agent 按照 spec-3 的要求，在 design-3.2 的指导下，修改了 X 文件，测试结果符合 spec-3 的预期」。

## 五、Harness 工程的适用边界与局限

### 5.1 适合哪些场景，不适合哪些

harness 工程不是银弹。它的适用范围有明确的边界。

适合的场景：单元测试覆盖良好的项目；边界清晰的任务；反复出现的模式。

不适合的场景：探索性开发——当需求本身还在变化，agent 的闭环会变成「反复修复一个不断移动的目标」，效率反而更低；缺乏测试的遗留系统——没有测试意味着没有验证原语，agent 只能「猜」自己做得对不对；跨团队协调任务——需要多人沟通、权衡取舍的决策，不适合交给封闭的 agent 循环。



![搬砖系列表情：搬砖](https://iili.io/CUtb1BS.png)
> 需求一变再变的时候，再强的 agent 也无能为力



### 5.2 当前方案的成熟度判断

截至 2026 年中，这套方案的成熟度可以概括为「局部可用，全局待观察」。

从技术层面看，ADK 2.0 + Antigravity SDK 的组合在单一 workspace 内的修复循环已经能稳定运行，公开 codelab 中的 demo 显示 agent 可以在 3 到 5 次迭代内修复简单的测试失败。

从工程层面看，几个关键问题还没有答案：多 workspace 如何协调？当前方案围绕单目录设计，多模块项目的跨模块依赖修复仍然困难。测试质量如何保证？agent 生成的测试可能不够全面，遗漏的边缘 case 会让修复循环产生虚假的「通过」信号。人与 agent 的分工在哪里？现有方案倾向于让 agent 处理「明确指令内的修复」，但现实中很多问题需要先澄清意图，这一步目前仍依赖人类。



![群里聊得热闹但自己得继续搬砖时的表情](https://iili.io/Cuzcmk7.png)
> 工具再好，最后还得人来拍板



## 收尾判断

harness 工程的核心贡献不是让 agent「更聪明」，而是让 agent 的行为「更可验证、可约束、可迭代」。

在实际项目中，建议从以下三步入手：第一，选定一个测试覆盖良好、边界清晰的小模块作为试点，搭建 workspace 隔离的修复循环。第二，设置合理的重试上限和人工介入阈值，避免 agent 陷入无效循环。第三，在 spec-kit 框架下记录每次修复的 spec-implementation 映射，形成可审计的知识积累。

当这三个步骤跑通之后，再考虑扩展到更大的模块或更复杂的项目结构。

## 参考文献
- Google Codelabs, Spec-Driven ADK Agent Development with Antigravity and Spec-kit, https://codelabs.developers.google.com/sdd-adk-antigravity
- Google Codelabs, 使用 Antigravity 和 TDD 保护 AI 智能体生命周期, https://codelabs.developers.google.com/secure-agentic-coding?hl=zh-cn
- Medium, What is Harness Engineering and Why Should I Care, https://medium.com/google-cloud/what-is-harness-engineering-and-why-should-i-care-43f6a0367772
- Medium, The AI-Native Developer Experience, Part 2: Harness Engineering with Google Antigravity, https://medium.com/google-cloud/the-ai-native-developer-experience-part-2-harness-engineering-with-google-antigravity-7fb72dab243f
- GitHub Issue, Overlap between Google ADK and google-antigravity/antigravity-sdk-python & Future Roadmap, https://github.com/google/adk-python/issues/5781
