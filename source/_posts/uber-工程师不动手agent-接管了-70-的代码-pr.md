---
title: "Uber 工程师不动手，Agent 接管了 70% 的代码 PR"
date: "2026-08-31 05:00:01"
updated: "2026-08-31 05:15:26"
permalink: "posts/2026/08/31/uber-工程师不动手agent-接管了-70-的代码-pr/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/31/uber-工程师不动手agent-接管了-70-的代码-pr/"
article_id: "b2436259-b2a2-40db-907e-7c693a1f8650"
description: "Uber 内部工程博客披露，其 AI 软件工厂已让超过 70% 的 Pull Request 与 Agent 有关联，日执行量突破 3 万次，请求量增长 9.4 倍，但相关 AI 成本几乎持平。工程师不再逐条接受建议，而是把任务委托给 Agent，从「人写代码 AI 改」转向「Agent 写、人审核」。这一转变并非来自自上而下的强制推广，而是工程师私下试用后的自发扩散。"
cover: "/var/lib/aimagician/artifacts/covers/b2436259-b2a2-40db-907e-7c693a1f8650/d80dee3e-5c43-4341-8f66-6d8350ba0546/cover.png"
imgTop: false
---

你每天花多少时间 Review PR？Uber 工程师的回答是：越来越少——因为他们已经不再亲手写那 70% 的代码。

这段对话最早出现在 Uber 工程博客关于 AI Software Factory 的披露里。2026 年 8 月，Uber 发布了内部数据：超过 70% 的 Pull Request 与本地或云端 Agent 有关联，工程师自建了 3,600 多个 Agent Skill，每天执行超过 3 万次，请求量同比增长 9.4 倍，而 AI 账单几乎没有增长。



![程序员 reaction：柯南00022 你说我在听](https://iili.io/CgJVgwu.png)
> 被 Agent 安排了



## 一、70% 这个数字，到底是啥意思

### 从「协助」到「委托」：Uber 代码流水线上的 Agent 角色变化

要理解这 70% 意味着什么，需要先搞清楚 Uber 工程师工作流的底层变化。

在 2025 年初之前，Uber 工程师使用 AI 编程工具的模式主要是「Copilot 模式」：在 IDE 里写代码，AI 提供补全或建议，工程师逐条判断是否采纳。这个阶段的 AI 是一个「高配版的代码联想」，本质还是人在驱动，AI 在跟随。

到了 2026 年，Uber 内部出现了一个显著的拐点。根据 ShiftMag 的报道，约 84% 的 AI 使用者已经进入「Agent 模式」——不再是逐条接受建议，而是把完整任务委托给 Agent。工程师的日常工作从「写代码 + 用 AI 辅助」变成了「给 Agent 下达任务 + 审核产出」。

这种转变的背后是一套称为 MCP（Model Context Protocol）网关的基础设施。Uber 在内部构建了一个中心化的代理层，连接 Agent 与源码仓库、文档系统、Jira、Slack 等内部工具。工程师不再需要手动去各个系统之间切换、复制粘贴上下文，而是通过自然语言指令让 Agent 自主完成一系列操作。



![Uber Agent 工作流演进](https://iili.io/CyeoYCl.png)
> Uber Agent 工作流演进



根据 Forbes 2026 年 5 月的报道，Uber 在 2025 年 12 月 rollout Claude Code 后，采用率从 2 月的 32% 迅速攀升到 3 月的 84%。不到三个月，工程师群体的行为模式发生了根本性迁移。

IQ Source 在分析这份数据时指出，这种 adoption 并非来自 CTO 的强制推广或培训课程，而是工程师私下试用后自发扩散的结果。「工程师悄悄实验、觉得好用就融入日常流程，没人问他们要不要做，也没人问他们做了没有。」

这正是 shadow AI 的典型特征。十年前的 shadow IT 装的是 Dropbox，今天的 shadow AI 装的是 Agent。治理永远滞后于实践，区别只在于速度。

### 70% PR 归属 ≠ 70% 代码由 Agent 独立完成

另一个容易被误解的地方是「70%」的定义。

Uber 工程博客的原话是：「more than 70% of pull requests are attributed to local or cloud agents」。关键词是「attributed to」——这个 PR 的生成过程里有 Agent 参与，而不是「70% 的代码完全由 Agent 独立编写、无需人类干预」。

实际上，Uber 明确区分了两类 Agent 工作模式：

**Managed Agent（托管模式）**：工程师给出明确指令，Agent 生成代码或 PR，工程师进行 review 后提交。这是目前绝大多数工程师的使用方式。

**Autonomous Agent（自主模式）**：Agent 在一定边界内自主执行，不需要人工介入每一个步骤。Uber 内部数据显示，约 11% 的线上后端更新是由无人类介入的 Agent 完成的。



![Agent 工程门禁状态](https://iili.io/CgrlL22.png)
> Agent 工程门禁状态



Uber 工程师 Uday Kiran Medisetty 在博客中进一步拆解了成本结构：AI 费用按用户、session、turn、request、token 分层计费。请求量增长 9.4 倍但账单几乎持平，这说明 Agent 的执行效率在提升，或者是模型调用策略发生了优化——例如更少的 turn 完成同样的任务，或者更多请求走的是本地小模型而非云端大模型。



![程序员 reaction：Mewriting](https://iili.io/Cyenthx.png)
> 程序员的真实日常



这种「高频率、低单价」的成本结构，是 Agentic 编程区别于早期 Copilot 模式的关键经济指标。早期 AI 编程的成本模型是「按 suggestion 计费」，每次补全都产生 token 消耗；而 Agent 模式是「按任务计费」，一次任务可能包含多次 API 调用，但总成本被任务的完成质量所约束。

本质上，Uber 的 70% 不是一个「AI 写代码比例」的指标，而是一个「AI 参与程度」的指标。它回答的问题是：「这个 PR 的诞生过程中，有没有 Agent 的影子？」而不是「这个 PR 里有多少代码是 AI 写的、多少是工程师写的」。

这也解释了为什么同样的 70%，在不同团队的感知里差异巨大。有人觉得 Agent 几乎替代了自己的编码工作，有人觉得 Agent 只是帮自己节省了查文档和写 boilerplate 的时间。两者都是对的，只是使用的 Agent 深度不同。

## 二、零增长账单背后：成本效率为什么能跑出来



![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> Agent 运行时过载，但账单没跟着炸



70% 的 PR 与 Agent 关联，日执行量超过 3 万次，请求量增长 9.4 倍——这些数字单独看都足以让 CFO 皱眉。但 Uber 工程博客披露的核心事实是：相关 AI 成本几乎持平。

这不是魔法，而是一套精心设计的成本分摊与路由机制。

### 本地 Agent 与云端 Agent 的分层策略

Uber 的做法是将 Agent 按任务复杂度与数据敏感性分层：本地 Agent 处理熟悉度高的重复性任务（如代码补全、单元测试生成、PR 描述草稿），云端 Agent 则承担需要上下文聚合或跨服务调用的复杂任务（如跨模块依赖分析、架构变更影响评估）。

这种分层并非凭空而来。本地 Agent 通常基于参数规模较小的模型运行在工程师工作站或容器环境中，推理延迟低且不调用外部 API，成本结构接近固定开支。云端 Agent 则按需调用更大参数规模的模型，但通过结构化提示词与缓存机制将重复请求降至最低。



![Uber Agent 分层路由架构](https://iili.io/CyeoN6B.png)
> Uber Agent 分层路由架构



任务路由的核心判定点在于「是否需要访问内部系统状态」。本地 Agent 不触碰代码库权限，云端 Agent 通过 MCP Gateway 访问受控的内部接口。这一边界划分直接决定了成本曲线的形态。

### 结构化 Prompt、MCP Tool 与 Shell 执行的协作机制

请求量暴涨但单次成本不放大，另一个关键是执行链路的结构化设计。

Uber 工程团队在 2026 年 8 月的博客中披露了他们的 MCP Tool 执行架构。Agent 并不直接调用原始模型 API，而是通过一个中央代理层连接内部系统——源码库、文档库、Jira、Slack。这个 MCP Gateway 承担了三个职责：授权校验、日志记录与遥测数据采集。



![MCP Tool 执行协作机制](https://iili.io/CyeoD9n.png)
> MCP Tool 执行协作机制



更具体地说，Agent 在执行 Shell 命令时并非无约束运行。Uber 采用的是白名单策略：仅在预定义的命令集合内允许 Agent 自主执行，超出范围的命令会触发人工确认或降级为只读操作。

结构化 Prompt 的设计同样关键。每个 Agent Skill（Uber 内部将 Agent 可复用的功能模块称为 Skill）都配有明确的输入输出 Schema，模型被要求在固定格式下返回结果，而非自由发挥。这种约束降低了因输出格式不一致导致的重试成本。

### 请求量涨 9.4 倍，单次成本为何没有同步放大

9.4 倍的请求增长与近乎零增长的账单之间，存在几个结构性因素。

第一个因素是本地与云端的流量分配比例。根据 Uber 工程团队披露的数据，约 84% 的 AI 用户使用的是 Agent 风格的工作流，但其中大量基础操作由本地模型完成，仅复杂任务才上云端。这意味着请求量的增长大部分发生在零边际成本或低边际成本的本地层。

第二个因素是缓存复用。对于相似的代码模式或重复的任务类型，结构化 Prompt 配合缓存机制避免了重复推理。一个典型的例子是 PR 描述生成——同一模块、同一类型变更的 PR，其描述模板可以高度复用，模型只需做少量调整而非从头生成。

第三个因素是模型选择的动态调度。Uber 并非将所有请求都路由到最贵的模型。简单任务使用低成本模型，复杂任务才调用高性能模型。这种动态调度在请求量激增时发挥了显著的杠杆作用。



![成本效率的三重杠杆](https://iili.io/Cyex2FS.png)
> 成本效率的三重杠杆



这些机制叠加的结果是：Uber 用一套可控的基础设施，将 Agent 的规模化从成本负担转化为可预测的固定开支。对于工程师而言，这意味着 AI 辅助编程的边际成本正在趋近于零，但前提是团队愿意投入前期架构设计。

[[reaction=code-review-pain|caption=Reviewer 看到 Agent 生成的 PR 时的复杂表情]]

当然，这种效率并非没有代价。本地与云端的边界划分需要持续的运维投入，结构化 Prompt 的设计需要工程团队的专业知识，MCP Gateway 的授权校验机制本身也可能成为新的瓶颈。但这些是可衡量的工程问题，而非不可控的成本黑洞。

下一个问题是：当 Agent 开始自主执行代码变更时，谁来为错误兜底？

## 三、影子 Adopt：工程师为什么会「偷偷」用起来

### 没有 CTO 指令，没有培训课，Agent 是怎么渗透进去的

根据 Uber 2026 年 8 月工程博客披露的数据，超过 3,600 名工程师自建了 Agent 技能，这些技能横跨开发生命周期的各个环节，但没有一条来自 CTO 办公室的强制推广令。Simon Ejsing 在团队分享中提到，最初的 adoption 曲线不是来自培训课或制度驱动，而是「工程师私下试用后自行 fold 进日常 workflow」。这种扩散模式与十年前影子 IT 时期团队悄悄安装 Dropbox、Slack 的轨迹几乎一致。区别仅在于速度：当年一个工具从试用到普及需要数月，今天 Claude Code 从内部测试到 84% 工程师使用不到三个月。



![程序员 reaction：Optimization](https://iili.io/CIsFLHG.png)
> 被安排了，但没人告诉我



Uber 内部的 MCP Gateway 是这次渗透的关键基础设施。它作为中央代理，连接 Agent 与源码、文档、Jira、Slack 等内部系统，同时统一处理授权、日志和遥测。这意味着工程师不需要为每个工具单独配置 credentials，也不需要绕过安全扫描——基础设施已经把治理层做在前面了。从实际效果看，这种设计既满足了工程师对自主性的需求，也给了平台团队可控性，两者之间的张力被 MCP 层缓冲掉了。

### 从 Copilot 式建议到自主执行：工程师工作模式的微妙转变

工作模式的转变不是线性的，而是存在一个清晰的跃迁点：当工程师从「等 AI 给建议」变成「让 AI 自己跑完整个任务」。Uber 内部数据显示，84% 的 AI 用户已经处于 agent-style 工作流中。这意味着他们不再逐条审查 Copilot 给出的补全建议，而是把一个完整任务（比如「修复这个 bug」「写一个单元测试」「重构这个模块」）丢给 Agent，然后等它产出结果。



![工程师与 AI 协作模式迁移](https://iili.io/CyexzPV.png)
> 工程师与 AI 协作模式迁移


这个转变的价值不在于省了多少行代码的 typing 时间，而在于释放了工程师的认知带宽。当 Agent 承担了重复性的 scaffolding 工作，工程师可以把注意力集中在架构决策、边界条件和业务逻辑上。一位与 Uber 合作过的平台工程师在 LinkedIn 分享中提到，自己从最初「想亲自学明白」的抵触，转变为「让 Agent 先干，我再验证」的模式，效率提升明显。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 大佬点头



但这并非没有代价。自主执行的 Agent 会犯错，而且错误往往比人工写的代码更难追溯。Uber 内部统计显示，约 11% 的线上后端更新由 Agent 以 zero-human-authoring 模式直接部署——这个数字在早期可能引发过争议，但平台侧的回滚能力和灰度策略已经足以支撑这种节奏。

### 风险与可见性：影子 AI 和十年前影子 IT 的相似之处

影子 IT 的核心矛盾是：工具带来了效率，但组织失去了可见性。Shadow IT 的典型特征是缺乏治理标准、没有统一的安全审计、数据流向不可追踪。Uber 当前面临的正是同样的结构性张力——只是载体从 Dropbox 换成了 Agent。

\[\

![程序员 reaction：IWROTEACOUPLEYEARSAGO](https://iili.io/CuzYJLv.png)
> 代码评审的痛苦转移了\

\]

Uber 的做法是在基础设施层提前嵌入治理，而非依赖事后的 policy enforcement。MCP Gateway 不仅做认证和日志，还负责 telemetry 采集，这让平台团队能看到 Agent 调用了哪些内部 API、访问了哪些服务、输出了什么数据。但这种治理仍然滞后于实践：工程师先尝试、先集成、先跑通，平台团队再跟进监控和审计。这正是 shadow AI 的本质特征——治理永远追着 adoption 跑，而不是反过来。

一个值得注意的边界条件是：这种模式适用于高度结构化的代码生成和 PR 辅助场景，但不适用于涉及敏感数据或核心业务逻辑的决策场景。Agent 可以帮你写一个通用的 CRUD 接口，但不应该让它决定如何设计用户数据的加密策略。Uber 内部对 11% zero-human-authoring 部署率的控制，正是通过门禁机制实现的——高风险变更仍然需要人工签批。



![程序员 reaction：柯南00089 找到你了](https://iili.io/CCZubTX.png)
> 真相锁定：治理滞后是常态，关键是建可观测性



这种影子 Adopt 现象的深层启示是：工程师对工具的信任，往往建立在自己亲身的实验反馈之上，而非制度的强制灌输。当一个工具真正解决了日常痛点——比如减少 Review PR 的时间、自动化重复的 scaffolding 工作——它自然会渗透进 workflow。问题是，当渗透速度超过治理速度时，组织如何确保可控性？Uber 的答案是先建基础设施的可观测层，再逐步收敛 policy，而不是反过来等 policy 完善后再开放工具。这个取舍对大多数团队有参考价值。



![程序员 reaction：THEODDSOFGENERATING](https://iili.io/CC5AJZN.png)
> Agent 跑起来了



## 四、你可以复制什么，不能复制什么

### Uber 的 3600 个 Agent Skill 是怎么建出来的

Uber 工程博客披露了一个关键数字：3600+ 员工自建 Agent Skill。这不是平台团队统一开发的工具集，而是工程师自己在日常工作中沉淀下来的可复用模块。

Skill 的本质是什么？是一段结构化的 Prompt 模板，加上对内部工具链的标准化调用接口。一个典型的 Skill 会包含输入契约（需要什么参数）、执行步骤（怎么调 MCP Tool、怎么执行 Shell）、输出格式（结构化 JSON Schema）以及错误回退逻辑。

这种建设模式的核心优势在于分布式迭代。平台团队不需要预知所有需求，工程师在自己的工作流里遇到问题，直接封装成 Skill 共享到内部仓库。类似 GitHub 上的开源项目，只是内网版本。3600 这个数字意味着平均每 10 名工程师贡献了 1 个 Skill，渗透率并不低。



![程序员反应图：不要重构去复制](https://iili.io/CuzarVj.png)
> Reviewer 终于能准点下班了



### PR Review Agent 的技术骨架

以 PR Review 场景为例，Uber 的实现路径是：GitHub Actions 触发 → 提取 PR diff → 调用 MCP Gateway 访问内部文档与代码库 → 构造结构化 Prompt 发送给 OpenAI 或 Anthropic → 模型返回带文件路径和行号引用的 review 意见 → GitHub Actions 将结果 comment 到 PR。

关键设计点有三个：

第一，结构化输出。Prompt 明确要求模型按照 JSON Schema 返回结果，包含 severity（error/warning/suggestion）、file_path、line_number、message 四个字段。这避免了自由文本难以程序化解析的问题，也让 Review 意见可以直接被后续流程消费。

第二，MCP Gateway 作为统一出口。所有 Agent 调用内部系统（源码、文档、Jira、Slack）的请求都经过同一网关，网关负责鉴权、日志记录和遥测数据收集。这意味着即使 Agent 行为分散在不同工程师手中，审计能力仍然集中。

第三，人机协作边界清晰。Agent 负责产出初版 Review，人类 Reviewer 负责最终决策。Uber 博客明确指出「managed agents work with human reviews and escalations」，即受控 Agent 必须配合人工审核和升级机制。

``mermaid


![PR Review Agent 技术流程](https://iili.io/CyexVSt.png)
> PR Review Agent 技术流程



### 适用边界：什么团队适合，什么团队应该慎重

这条路线的核心前提是你已经有成体系的内部工具链和编码规范。MCP Gateway 的价值在于把分散的内部接口标准化，如果你的团队连 API 文档都没有，Agent 也无从调用。

具体来说，以下条件决定了能否复现 Uber 的效果：

**适合的条件**：团队规模在 50 人以上，已有稳定的 CI/CD 流水线，代码库使用统一的框架和语言，内部有可检索的知识系统（Wiki、文档库或内部搜索引擎）。这些条件保证了 Agent 调用工具时的输入质量。

**需要慎重的条件**：初创团队、工具链碎片化、代码规范尚未固化、或者团队处于快速转型期（技术栈频繁切换）。在这些场景下，Agent 可能把混乱的流程自动化得更加高效，问题反而被放大。

另一个常被忽略的边界是法律和行业合规。Uber 的 Agent 调用的是内部系统，不涉及外部数据泄露风险。但如果你在医疗、金融等受监管行业，Agent 生成的代码如果包含合规字段遗漏，后果可能比人工 Review 疏漏更严重。这种情况下，Agent 的定位应该是辅助而非接管。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 技术债终于有人还了



从经验看，最稳妥的切入点是选择一个高频、低风险、规则明确的场景先做 PoC。比如自动生成单元测试、检查代码规范违例、或者辅助编写 changelog。这些场景的输出容易验证，失败成本低。等团队建立了信任，再逐步扩展到核心业务逻辑的自动生成。

真正的转变不是工具替换，而是工作重心的迁移。工程师从「写代码」变成了「定义问题、审查输出、处理异常」。这个转型需要时间，也需要组织层面的配套调整，比如 Reviewer 的考核指标从「写了多少代码」转向「审核了多少 PR、发现了多少 Agent 遗漏的问题」。

## 参考文献
[1] Uber's AI Software Factory: 70% of Pull Requests, 3,600 Agent Skills, Flat Spend | CellCog. https://cellcog.ai/blog/uber-software-factory
[2] Uber: 70% of Code Is AI. Your Team Hasn't Changed - IQ Source. https://www.iqsource.ai/en/blog/uber-ai-code-agent-orchestration
[3] I’m a Senior Google AI PM. These 7 AI Agents Run My Life!. https://www.youtube.com/watch?v=eCbwnwzJ8E8
[4] How to Set Up AI Code Review in Your CI/CD Pipeline. https://www.augmentcode.com/guides/ai-code-review-ci-cd-pipeline
[5] Build Your AI-Powered PR Review Agent with GitHub Actions: A Step-by-Step Guide (2025 Edition), LogicSpark Technology. https://logicspark.io/build-your-ai-powered-pr-review-agent-with-github-actions-a-step-by-step-guide-2025-edition
[6] Uber's Agentic Software Adoption Surges with 1800 Weekly Code Changes | Praveen Neppalli Naga posted on the topic | LinkedIn. https://www.linkedin.com/posts/pneppalli_agentic-software-engineering-adoption-is-activity-7439402236541157376-6PwV
[7] AI Agents for PR Review: Worth the Cost? | Kyle Brill posted on the topic | LinkedIn. https://www.linkedin.com/posts/kylejbrill_does-roi-exist-for-ai-agents-reviewing-prs-activity-7377367624885784577-xCDN
[8] Building a PR Review Agent. https://karlstoney.com/building-a-pr-review-agent
