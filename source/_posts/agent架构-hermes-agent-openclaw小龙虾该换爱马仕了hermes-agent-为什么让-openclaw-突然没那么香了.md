---
layout: "post"
article_page_id: "3450f85d-e690-818d-a4dd-fb881141a76f"
title: "【Agent架构 | Hermes Agent & OpenClaw】“小龙虾”该换“爱马仕”了？Hermes Agent 为什么让 OpenClaw 突然没那么香了"
description: "OpenClaw 创始人 Peter Steinberger 被 Anthropic 短暂封号一事，将开源 Agent 框架的商业矛盾推向台前。"
categories:
  - "Agent架构"
  - "Hermes Agent & OpenClaw"
tags:
  - "Hermes Agent"
  - "OpenClaw"
  - "AI Agent框架"
  - "开源Agent"
  - "Agent记忆系统"
  - "自进化AI"
  - "CertiK安全报告"
  - "Anthropic封号"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/17/agent架构-hermes-agent-openclaw小龙虾该换爱马仕了hermes-agent-为什么让-openclaw-突然没那么香了/"
img: "https://iili.io/BU8pWSn.png"
swiperImg: "https://iili.io/BU8pWSn.png"
permalink: "posts/2026/04/17/agent架构-hermes-agent-openclaw小龙虾该换爱马仕了hermes-agent-为什么让-openclaw-突然没那么香了/"
date: "2026-04-17 04:09:00"
updated: "2026-04-17 04:10:00"
cover: "https://iili.io/BU8pWSn.png"
---

## 一、两个框架的根本分野：连接一切 vs 自主进化

封号门炸出的是两条完全不同的 Agent 路线。

OpenClaw 最早是 2025 年 11 月的一个叫 Clawdbot 的副项目，定位始终是「全平台执行网关」——连接一切工具、高效执行、跨平台无缝衔接。

你装了它，可以在 Telegram、Discord、Slack 上跟它聊天，可以让浏览器自动帮你操作网页，可以接管本地 GUI 软件，连 API 都没有的老系统都能摸进去。

它的核心架构是一个中央 Gateway，所有外部工具、平台、Agent 都挂在上面，路由和执行由这个中枢统一调度。

这套架构的优势是扩展性强——新接一个平台只需要写一个适配器，不影响其他组件。但它的代价是：OpenClaw 本身不「记忆」任何东西，状态由调用方负责，维护在外部。

Hermes Agent 则是另一套逻辑。

它是 Nous Research（就是那个做过 Hermes 大模型系列的开源实验室）在 2026 年 2 月推出的，MIT 协议，完全开源，核心定位是「与你共同成长的持久化个人 AI 助手」。

这句话听起来像营销，但它真正想解决的是一个真实痛点：**大多数 AI 工具是「金鱼」，每次对话都从零开始，没有积累，没有成长。**

Hermes 想做的是「会记事的搭档」——任务做完，它会复盘，提取可复用步骤，固化成 Skill，下次遇到同类任务直接调用，不用你再教一遍。

GitHub Stars 在两个月内冲到 4 万+ [2](https://www.cndba.cn/dave/article/131875)。

两条路线的核心差异可以一句话说清：**Hermes Agent 做的是「让一个 Agent 越来越懂你」，OpenClaw 做的是「让一堆工具被你一个 Agent 调用」。**

这不是谁取代谁的问题，是两个完全不同的抽象层级和价值主张。

![正文图解 1](https://iili.io/BUUBJBn.png)
> 正文图解 1

![来源：youtube.com](https://i.ytimg.com/vi/x3IG3elJvZk/maxresdefault.jpg)
> 来源：youtube.com

## 二、记忆机制：谁在真正「记住」，谁只是「会话复读」

### 2.1 Hermes Agent 的四层记忆架构

如果你用过 ChatGPT，最痛苦的体验是什么？大概是这样：你花了半小时跟它对齐背景、上下文、项目情况，关掉对话再开一个新的，它什么都不记得。

Claude 和 GPT 的上下文窗口是有限的，再长的上下文也有衰减。Hermes Agent 想解决这个「金鱼记忆」问题，方案是分层持久化。

第一层叫**提示记忆**（Prompt Memory），会话内的即时上下文，窗口关闭就消失。

第二层叫**会话检索记忆**（Session Retrieval Memory），用 SQLite 存储可搜索的历史会话，你在任何时间点问「上次我让你帮我写的那段正则表达式是什么」，它能捞出来。

第三层是核心，叫**程序性技能记忆**（Procedural Skill Memory）。

它存储的不是「你告诉过我什么」，而是「你让我做什么事、我怎么做的、步骤是什么」——固化下来的不是信息，是流程。下次同类任务来了，它不需要重新规划，直接调最优步骤执行。

第四层叫**用户画像记忆**（User Profile Memory），由 LLM 做总结建模，记录你的偏好、决策风格、常用技术栈、项目背景。

四层叠加的效果是：Hermes 不是每次从零开始，而是从「上一次停下来的地方」继续。

![](https://iili.io/qysAwWx.png)
> 好家伙，这不就是……AI 版的刻意练习？

### 2.2 闭环学习：让 Agent 从经验中「长出」技能

光有记忆不够，关键是这套记忆怎么变成「能力」。Hermes 的答案是**闭环学习循环**（Closed Learning Loop）。

流程是：接收任务 → 规划执行步骤 → 执行任务并记录全流程 → 任务完成后自动复盘 → 提取关键步骤 → 固化为可复用 Skill → 下次同类任务直接调用并持续优化。

整个循环不需要你介入，它自己跑。

官方给的数据是：同一类任务执行 5 次以上，系统会自动建议保存为 Skill，之后每次调用都会自动用最优路径 [2](https://www.cndba.cn/dave/article/131875)。

Skills 可以导出、分享、迭代，v0.8.0 版本（2026 年 4 月 8 日周更）已经有 40+ 内置工具，覆盖网页搜索、浏览器控制、视觉识别、文件操作、终端命令、定时任务、图像生成、TTS 语音合成。

关键在于：这些 Skill 不是一次性产物，是从真实任务里长出来的，是真正被验证过的流程，不是工程师预设好塞进去的模板。

⚠️ **踩坑提醒**：Hermes Agent 的 Skill 机制依赖 LLM 自动总结，这意味着总结质量高度依赖底层模型能力。

如果你在用本地开源模型（Ollama）而非云端 API，Skill 的提取精度可能明显下降。

建议在 Ollama 场景下至少使用 70B 参数以上的模型，或者对自动生成的 Skill 做人工 review 再投入生产。

对比之下，OpenClaw 的记忆系统是三层的：对话历史、会话上下文、用户事实。

没有程序性技能记忆，没有过程记录——你每次让它做同一个任务，它会重新规划，不记得上次是怎么成功的，也不记得上次踩过什么坑。

OpenClaw 的「成长」靠的是 ClawHub——社区贡献的 Skills 库，目前有 4.4 万+ 技能，需要你手动发现、安装、维护。

**Hermes 是从经验里自己长出能力，OpenClaw 是靠别人贡献能力包。这是本质区别，不是功能差距。**

### 2.3 为什么 OpenClaw 越用越「陌生」

这不是批评，是架构约束。OpenClaw 设计之初就没打算做持久记忆，它的核心价值是连接和执行——你让它操作浏览器、发送邮件、管理日历，它做完就完了，下次再做是全新的上下文。

对于高频、短平快的任务，这没问题。

但对于需要跨会话积累的场景——比如一个持续三个月的项目研究、一次需要跨版本维护的技术栈调研——OpenClaw 的「失忆」就会变成痛点：你每次重新对齐背景的时间，可能比真正干活的时间还长。

这里有一个边界条件需要说清：**记忆和连接不是互斥的**。OpenClaw 也可以通过外部工具接入记忆服务，Hermes 也可以通过工具调用连接外部平台。架构差异不等于能力上限。

但默认配置的差距是真实存在的——你买一辆车，默认有没有导航、默认有没有倒车影像，这影响的是你第一天用它的体验，而不是这辆车理论上能跑多快。

![来源：techcrunch.com](https://techcrunch.com/wp-content/uploads/2026/04/ChatGPT-OpenClaw-Claude.jpg?resize=1200,800)
> 来源：techcrunch.com

## 三、安全账：CertiK 的警报与 OpenClaw 的「安全债」

### 3.1 CertiK 报告：280+ 安全公告、约 100 个 CVE

2026 年 4 月 4 日，CertiK 发布了一份关于 OpenClaw 的全面安全分析报告 [3](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)。

报告的核心结论是：OpenClaw 的快速普及已经超过了它的安全措施的成熟速度，平台积累了可观的「安全债」。

具体数字是这样的：GitHub 安全公告（GHSA）超过 280 条，CVE（通用漏洞披露）约 100 个，自上线以来发生了多起生态级安全事件。

![](https://iili.io/qbiS47S.png)
> CertiK：这份安全债，谁来买单？

最紧迫的威胁来自供应链层面。

CertiK 发现的假冒安装包和恶意技能在 ClawHub 及其他来源流传，这些组件绕过了传统杀毒工具的检测——因为它们的行为是自然语言指令驱动的，不是传统的恶意二进制文件。

一旦安装成功，这些组件会悄悄提取敏感信息，包括密码和加密货币钱包凭证。

攻击者专门盯上了高价值加密工具：MetaMask、Phantom、Trust Wallet、Coinbase Wallet、OKX Wallet 都出现在了攻击 payload 的目标列表里 [3](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)。

另一个风险来自部署配置。

安全扫描在 OpenClaw 早期发现了约 3 万个暴露在互联网上的实例，后续评估识别出 13.5 万次安装，覆盖 82 个国家，其中约 1.52 万存在远程代码执行（RCE）漏洞。

本地网关劫持、提示注入攻击、身份绕过、凭证泄露——这些不是理论威胁，是已经在外网大规模存在的实际问题。

OpenClaw 创始人 Steinberger 在报告发布后承认平台正在加强安全防护，并指出团队在最近两个月做了针对性改进。

但 CertiK 明确建议三类用户——非技术背景的普通用户、安全专业人员、以及有经验的企业开发者——在更稳健的加固版本发布之前，**不要从非官方来源安装 OpenClaw**。

### 3.2 Hermes Agent 的沙盒设计：默认严格

Hermes Agent 的安全策略与 OpenClaw 形成了鲜明对比。

它默认启用严格沙盒：只读根文件系统、权限降级、Linux 能力（capabilities）丢弃、命名空间隔离。内置 Prompt 注入扫描、凭证过滤、敏感数据上下文检测。

Hermes Agent v0.5.0 专项安全强化，合并了 200 余个安全补丁，至今保持零 CVE 记录 [4](https://hermesagentai.cn/)。

这个数字是重要的对比锚点——不是 Hermes 完全没有安全问题，而是它的安全约束放在了更容易默认达成的位置。

如果 OpenClaw 是「功能优先、安全补防」，Hermes Agent 更像是「安全底线默认立好、功能在边界内扩展」。

这个差异在部署上体现得很明显：OpenClaw 早期权限策略相对宽松，生态快速扩张后逐步加固；Hermes Agent 则从一开始就用了更保守的默认配置，攻击面更小。

⚠️ **踩坑提醒**：Hermes Agent 的严格沙盒意味着某些需要高权限的操作——比如接管 GUI 应用、写系统级文件、执行 sudo 命令——默认是被阻止的。

如果你需要这些能力，需要显式配置更宽松的权限策略，这一步往往被新手忽略，导致「装好了跑不起来」的困惑。

阅读官方安全文档中关于 capability allowlist 的说明，是绕开这个坑的最快路径。

### 3.3 企业选型的安全底线

这里需要说一个残酷的现实：快速迭代的开源项目，安全债是常态，不是例外。OpenClaw 的高速增长意味着代码审查、安全审计、依赖更新的节奏可能跟不上功能发布的压力。

CertiK 的报告不是给 OpenClaw「判死刑」，而是给它标了一个需要认真对待的工程优先级。

对于企业选型者，安全账怎么算？

**第一**，评估你的使用场景是否涉及高敏感数据（密码、私钥、企业内部系统）。涉及私钥操作的 DeFi 交易机器人场景和内部文档助手场景，安全要求完全不同。

**第二**，检查部署模式——本地部署比托管模式更可控，但运维成本更高。

**第三**，建立工具权限最小化原则，不管选哪个框架，「不给 Agent 超权限」是基本功。

**第四**，持续关注官方安全公告，不要把「开源」当成「无责任」。

![](https://iili.io/qyoGipR.png)
> 开源不等于无责任，Stars 高不等于安全审计到位

## 四、部署经济学：$5 打工人 vs 企业级网关

### 4.1 Hermes Agent：$5/月 VPS，极低部署门槛

Hermes Agent 的安装体验用一个字总结：快。

一行命令完成安装，官方文档说「10 分钟上手」，最低部署要求是 5 美元/月的 VPS，支持本地、Docker、SSH、Serverless（Modal/Daytona）多种模式。

Serverless 方案在实例空闲时几乎零成本——你不需要一直开着机器，按调用计费。

技术栈方面，Hermes Agent 93.6% 的代码是 Python，对熟悉 Python 生态的工程师来说，定制和扩展的门槛很低。

MIT 协议意味着完全免费、可商用、无授权费——你只需要付服务器和模型调用的费用 [2](https://www.cndba.cn/dave/article/131875)。

### 4.2 OpenClaw：npm 五分钟上线，生态成熟

OpenClaw 的安装体验同样简洁：npm 一键安装，GetClaw 提供托管服务，号称「5 分钟上线」。

但 OpenClaw 的价值主张不只是「装得快」，而是「连得多」——目前支持 20+ 平台接入，包括 Telegram、Discord、Slack 这些国际主流应用，**也包括微信、飞书、QQ 等国内平台**，这一点 Hermes Agent 官方版本暂不支持。

对于需要在国内社交生态里做自动化的团队，这是不可忽视的差异。

企业级功能是 OpenClaw 的另一个强项。它内置审计日志、审批流程、多租户隔离、细粒度权限控制，这些是企业选型的硬需求。

ClawHub 已有 4.4 万+ 技能，生态成熟度远高于 Hermes Agent 的早期社区。

这不是 Hermes 做得差，而是两者发展阶段不同——Hermes Agent 才 2 个月，OpenClaw 已经跑了快 5 个月。

### 4.3 Agent 经济的宏观数据

选型不能只看框架本身，还要看 Agent 经济的市场背景。

根据 CoinDesk 报道，Solana 网络已处理超过 1500 万笔链上 Agent 交易 [5](https://www.coindesk.com/business/2026/04/02/ant-group-s-blockchain-arm-unveils-platform-for-ai-agents-to-transact-on-crypto-rails)，Coinbase CEO Brian Armstrong 预计 Agent 的交易量会超过人类。

McKinsey 预测，到 2030 年 AI Agent 可能会经手 3 万亿至 5 万亿美元的全球消费商业规模。

传统支付巨头都在布局：Visa 推出了 Trusted Agent Protocol，Mastercard 以 18 亿美元收购稳定币基础设施公司 BVNK（史上最大稳定币基础设施收购案），Coinbase 在推 x402 协议（与 Cloudflare 联合开发，支持稳定币微支付）。

蚂蚁集团的区块链部门 Ant Digital Technologies 近期发布的 Anvita 平台值得关注——它是专门为 AI Agent 设计链上交易和支付结算的基础设施，支持 OpenClaw 和 Claude Code 等主流框架接入 [5](https://www.coindesk.com/business/2026/04/02/ant-group-s-blockchain-arm-unveils-platform-for-ai-agents-to-transact-on-crypto-rails)。

**这些信号说明一件事：Agent 经济的基础设施军备竞赛已经开始了，框架选型不只是「哪个更好用」，也是「哪个会活得更久」。**

![](https://iili.io/BHiCZJe.png)
> 1500万笔链上 Agent 交易……我连自己上个月的账单都没算清

## 五、Anthropic 与 OpenAI 的「代理人战争」

封号门撕开的不只是两个框架的技术差异，还有一层地缘政治的意味。

Steinberger 是 OpenClaw 的创始人，但他本人已经在 OpenAI 入职——Anthropic 封的是 OpenAI 员工的账号。

这个动作在任何语境下都可以解读为「商业竞争」，无论 Anthropic 的技术解释多合理 [1](https://techcrunch.com/2026/04/10/anthropic-temporarily-banned-openclaws-creator-from-accessing-claude/)。

更值得关注的是「claw tax」背后的逻辑。

Anthropic 的订阅制原本是按「人/月」收费，OpenClaw 这类 harness 把一个订阅账号变成了可以多并发、长周期、自动化调用的工具，流量模型完全变了——Anthropic 的原话是「订阅没有为 claw 的使用模式建立」。

Cowork（Anthropic 自家 Agent）的 Dispatch 功能刚上线两周，OpenClaw 的定价就被调整了，这个时间线 Steinberger 的「先抄功能，再锁开源」指控不是空穴来风。

**但也要说一句公道话**：Anthropic 的技术解释在逻辑上是成立的——Agent 的计算消耗模式与普通对话有本质区别，订阅制不覆盖高强度 Agent 使用有其商业合理性。

把这解读成「纯粹的商业打压」和「纯粹的技术决策」都是简化版本，真相可能是两者都有。

这件事给整个开源 Agent 生态的启示是：**当你的框架严重依赖某一个模型提供商的时候，定价权不在你手里。**

Hermes Agent 的设计哲学里有一个隐含的优势——它的核心价值是记忆和学习，不是模型调用效率，理论上可以接入任何模型 provider，不被单家绑定。

这个「不绑定」是战略护城河，不是技术细节。

## 六、选型决策树：什么时候选谁，边界在哪里

### 6.1 按场景划分

**选 Hermes Agent 的场景：**

第一个是**长期项目研究**。你在做一个跨三个月的技术调研，需要持续积累上下文，每次重新对齐背景的成本很高。

Hermes 的程序性技能记忆会自动记录你的研究路径，下次继续时直接接上——你不是在重做，是在续做。

第二个是**追求技能复利的个人开发者**。你想让 AI 学会你做事的方式，而不是每次都要手把手教。

Hermes 的闭环学习会自动把重复任务固化成 Skill，相当于你在培养一个「越来越懂你工作流」的搭档。

第三个是**注重数据隐私的个人用户**。Hermes 支持完全本地部署，数据不经过第三方服务器。严格沙盒设计意味着即使你跑的是开源模型，意外泄漏的风险也更低。

**选 OpenClaw 的场景：**

第一个是**多团队多渠道运营**。

你需要同时管理 Telegram、Discord、Slack、WhatsApp，还要接微信和飞书——这种跨平台统一管控是 OpenClaw 的主场，Hermes 官方版暂不支持国内社交平台。

第二个是**需要操作 GUI 软件且无 API 可用的场景**。

OpenClaw 的视觉 GUI 控制能力是它最具差异化的特性：即使目标软件没有开放 API，只要你能用眼睛看到它的界面，OpenClaw 就能操作它。

这是目前 Hermes Agent 无法替代的能力。

第三个是**需要快速落地现成技能的企业场景**。ClawHub 4.4 万+ 技能意味着你大概率能找到现成的方案，不用从零开发。

OpenClaw 的 GetClaw 托管服务也降低了运维门槛，适合不想自己管基础设施的团队。

### 6.2 混合路径的可能性

两条路线不是互斥的。一个实用的组合是：**用 Hermes Agent 做核心任务规划和长期记忆管理，用 OpenClaw 补执行层和平台接入能力。**

Hermes 的 CLI 接口可以调用外部工具，OpenClaw 的网关也可以接入记忆服务——在架构层面，两个框架的边界是可以打通的。

但这个组合有代价：运维复杂度翻倍，两套系统的对齐需要额外的工程投入。如果你只有一个人，或者团队规模小于 3 人，**不要追求「全都要」**——先选一个，用熟了再考虑扩展。

![正文图解 2](https://iili.io/BUUBoQ9.png)
> 正文图解 2

## 七、写在最后：开源 Agent 的「战争」才刚开始

两条路线会长期共存，不是一个框架通吃。OpenClaw 解决了「连接」这个基础设施问题，Hermes Agent 解决了「成长」这个智能化问题——这两个需求在真实世界里都大量存在。

CertiK 的安全报告给 OpenClaw 提了一个醒：高速增长期的安全债如果不及时清理，会从「可以忍受的代价」变成「限制规模的硬墙」。

OpenClaw 的背后，是 280+ GHSA 和约 100 个 CVE——这不是技术失败，是成长代价，但代价要有人买单 [3](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)。

Hermes Agent 也面临自己的挑战：2 个月的时间窗口让它的生态成熟度远落后于 OpenClaw，Skills 社区还在建设，周更节奏意味着 API 稳定性有风险。

它的严格沙盒和本地部署优先是安全加分项，但也意味着上手配置比 OpenClaw 更重。

蚂蚁的 Anvita、Mastercard 的收购、Visa 的协议——这些大厂动作说明 Agent 经济的基础设施正在快速成熟。

当 Agent 开始真正经手交易和资产时，安全和信任不再是「加分项」，而是「入场券」。两条路线最终都要面对同一个问题：**你的 Agent 能不能被人信任地托付重要的事？**

最后留一个问题给你：

你现在用的 Agent 工具，是更需要它「记住你的习惯」，还是更需要它「连接更多的工具」？

这个答案没有标准，但它会决定你下一个框架选什么。

![](https://iili.io/qysAvUP.png)
> 先去把我的 VPS 跑起来了，回头来汇报

## 参考文献

1. [techcrunch.com](https://techcrunch.com/2026/04/10/anthropic-temporarily-banned-openclaws-creator-from-accessing-claude/)

2. [cndba.cn](https://www.cndba.cn/dave/article/131875)

3. [crowdfundinsider.com](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)

4. [Hermes Agent — 自我进化的开源AI智能体框架 | 官方中文站](https://hermesagentai.cn/)

5. [coindesk.com](https://www.coindesk.com/business/2026/04/02/ant-group-s-blockchain-arm-unveils-platform-for-ai-agents-to-transact-on-crypto-rails)
