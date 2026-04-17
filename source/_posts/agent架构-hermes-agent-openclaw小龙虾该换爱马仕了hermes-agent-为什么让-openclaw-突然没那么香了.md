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
img: ""
swiperImg: ""
permalink: "posts/2026/04/17/agent架构-hermes-agent-openclaw小龙虾该换爱马仕了hermes-agent-为什么让-openclaw-突然没那么香了/"
date: "2026-04-17 04:09:00"
updated: "2026-04-17 04:10:00"
---

2026 年 4 月 11 日凌晨，OpenClaw 创始人 Peter Steinberger 在 X 上发了一条带图的推文，配文是：「看来以后越来越难保证 OpenClaw 继续兼容 Anthropic 模型了。

」

图里是一封来自 Anthropic 的账号暂停通知，理由是「可疑活动」。几小时后，账号解封，Steinberger 补了一句：「一个欢迎我入职，一个发来法律威胁。」

这里的「一个」指的是 OpenAI——他最近刚从 OpenAI 拿到 offer。

![](https://iili.io/BHiCEHg.png)
> Anthropic：这可疑活动指的是……用竞品的 API 测试？

这不是一个孤立的账号问题。就在一周前，Anthropic 宣布 Claude 订阅不再覆盖「第三方 harness」，包括 OpenClaw，用户必须走 API 按量付费。

社区管这叫「claw tax」。

Steinberger 的回应是：「先把自己 closed harness 里的热门功能抄了，再把开源的锁了。

」矛头指向 Claude Code 刚上线的 Dispatch 功能——允许远程控制和任务委派——时间线上早于这次定价政策调整[1](https://techcrunch.com/2026/04/10/anthropic-temporarily-banned-openclaws-creator-from-accessing-claude/)。

一位 Anthropic 工程师在评论区现身，说 Anthropic 从未因为 OpenClaw 封过任何人，愿意提供帮助。

最终账号解封，但整个沟通过程本身就是答案——当你的框架严重依赖某一个模型提供商的时候，定价权不在你手里。

## 一、两个框架的根本分野：连接一切 vs 自主进化

封号门炸出的是两条完全不同的 Agent 路线。

OpenClaw 最早是 2025 年 11 月的一个叫 Clawdbot 的副项目，定位始终是「全平台执行网关」——连接一切工具、高效执行、跨平台无缝衔接。

你装了它，可以在 Telegram、Discord、Slack 上跟它聊天，可以让浏览器自动帮你操作网页，可以接管本地 GUI 软件，连 API 都没有的老系统都能摸进去。

GitHub Stars 突破 30 万，月活用户约 200 万，这个数字在开源 Agent 圈里已经是现象级的[2](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)。

Hermes Agent 则是另一套逻辑。

它是 Nous Research（就是那个做过 Hermes 大模型系列的开源实验室）在 2026 年 2 月推出的，MIT 协议，完全开源，核心定位是「与你共同成长的持久化个人 AI 助手」。

这句话听起来像营销，但它真正想解决的是一个真实痛点：**大多数 AI 工具是「金鱼」，每次对话都从零开始，没有积累，没有成长。**

Hermes 想做的是「会记事的搭档」——任务做完，它会复盘，提取可复用步骤，固化成 Skill，下次遇到同类任务直接调用，不用你再教一遍。GitHub Stars 在两个月内冲到 4 万+[3](https://www.cndba.cn/dave/article/131875)。

![SVGDIAGRAM::正文图解 1](https://iili.io/BU56myx.png)
> 正文图解 1

两条路线的核心差异可以一句话说清：**Hermes Agent 做的是「让一个 Agent 越来越懂你」，OpenClaw 做的是「让一堆工具被你一个 Agent 调用」。**

这不是谁取代谁的问题，是两个完全不同的抽象层级和价值主张。

## 二、记忆机制：谁在真正「记住」，谁只是「会话复读」

### 2.1 Hermes Agent 的四层记忆架构

如果你用过 ChatGPT 最痛苦的体验是什么，大概是：你花了半小时跟它对齐背景、上下文、项目情况，关掉对话再开一个新的，它什么都不记得。

Claude 和 GPT 的上下文窗口是有限的，再长的上下文也有衰减。Hermes Agent 想解决这个「金鱼记忆」问题，方案是分层持久化。

第一层叫**提示记忆**（Prompt Memory），这是最薄的一层，会话内的即时上下文，窗口关闭就消失。

第二层叫**会话检索记忆**（Session Retrieval Memory），用 SQLite 存储可搜索的历史会话，你在任何时间点问「上次我让你帮我写的那段正则表达式是什么」，它能捞出来。

第三层是核心，叫**程序性技能记忆**（Procedural Skill Memory），它存储的不是「你告诉过我什么」，而是「你让我做什么事、我怎么做的、步骤是什么」，固化下来的不是信息，是流程——下次同类任务来了，它不需要重新规划，直接调最优步骤执行。

第四层叫**用户画像记忆**（User Profile Memory），由 LLM 做总结建模，记录你的偏好、决策风格、常用技术栈、项目背景。

四层叠加的效果是：Hermes 不是每次从零开始，而是从「上一次停下来的地方」继续。

![](https://iili.io/qysAwWx.png)
> 好家伙，这不就是……AI 版的刻意练习？

### 2.2 闭环学习：让 Agent 从经验中「长出」技能

光有记忆不够，关键是这套记忆怎么变成「能力」。Hermes 的答案是**闭环学习循环**（Closed Learning Loop）。

流程是：接收任务 → 规划执行步骤 → 执行任务并记录全流程 → 任务完成后自动复盘 → 提取关键步骤 → 固化为可复用 Skill → 下次同类任务直接调用并持续优化。

整个循环不需要你介入，它自己跑。

官方给的数据是：同一类任务执行 5 次以上，系统会自动建议保存为 Skill，之后每次调用都会自动用最优路径[3](https://www.cndba.cn/dave/article/131875)。

Skills 可以导出、分享、迭代，v0.8.0 版本（2026 年 4 月 8 日周更）已经有 40+ 内置工具，覆盖网页搜索、浏览器控制、视觉识别、文件操作、终端命令、定时任务、图像生成、TTS 语音合成。

关键在于：这些 Skill 不是一次性产物，是从真实任务里长出来的，是真正被验证过的流程，不是工程师预设好塞进去的模板。

对比之下，OpenClaw 的记忆系统是三层的：对话历史、会话上下文、用户事实。

没有程序性技能记忆，没有过程记录——你每次让它做同一个任务，它会重新规划，不记得上次是怎么成功的，也不记得上次踩过什么坑。

OpenClaw 的「成长」靠的是 ClawHub——社区贡献的 Skills 库，目前有 4.4 万+技能，需要你手动发现、安装、维护。

**Hermes 是从经验里自己长出能力，OpenClaw 是靠别人贡献能力包。这是本质区别，不是功能差距。**

### 2.3 为什么 OpenClaw 越用越「陌生」

这不是批评，是架构约束。OpenClaw 设计之初就没打算做持久记忆，它的核心价值是连接和执行——你让它操作浏览器、发送邮件、管理日历，它做完就完了，下次再做是全新的上下文。

对于高频、短平快的任务，这没问题。

但对于需要跨会话积累的场景——比如一个持续三个月的项目研究、一次需要跨版本维护的技术栈调研——OpenClaw 的「失忆」就会变成痛点：你每次重新对齐背景的时间，可能比真正干活的时间还长。

这里有一个边界条件需要说清：**记忆和连接不是互斥的**。OpenClaw 也可以通过外部工具接入记忆服务，Hermes 也可以通过工具调用连接外部平台。架构差异不等于能力上限。

但默认配置的差距是真实存在的——你买一辆车，默认有没有导航、默认有没有倒车影像，这影响的是你第一天用它的体验，而不是这辆车理论上能跑多快。

## 三、安全账：CertiK 的警报与 OpenClaw 的「安全债」

### 3.1 CertiK 报告：280+ 安全公告、约 100 个 CVE

2026 年 4 月 4 日，区块链安全公司 CertiK 发布了一份关于 OpenClaw 的全面安全分析报告[2](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)。

报告的核心结论是：OpenClaw 的快速普及已经超过了它的安全措施的成熟速度，平台积累了可观的「安全债」。

具体数字是这样的：GitHub 安全公告（GHSA）超过 280 条，CVE（通用漏洞披露）约 100 个，自上线以来发生了多起生态级安全事件。

![](https://iili.io/qbiS47S.png)
> CertiK：这份安全债，谁来买单？

最紧迫的威胁来自供应链层面。

CertiK 发现的假冒安装包和恶意技能在 ClawHub 及其他来源流传，这些组件绕过了传统杀毒工具的检测——因为它们的行为是自然语言指令驱动的，不是传统的恶意二进制文件。

一旦安装成功，这些组件会悄悄提取敏感信息，包括密码和加密货币钱包凭证。

攻击者专门盯上了高价值加密工具：MetaMask、Phantom、Trust Wallet、Coinbase Wallet、OKX Wallet 都出现在了攻击 payload 的目标列表里。

另一个风险来自部署配置。

安全扫描在 OpenClaw 早期发现了约 3 万个暴露在互联网上的实例，后续评估识别出 13.5 万次安装，覆盖 82 个国家，其中约 1.52 万存在远程代码执行（RCE）漏洞[2](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)。

本地网关劫持、提示注入攻击、身份绕过、凭证泄露——这些不是理论威胁，是已经在外网大规模存在的实际问题。

OpenClaw 的创始人 Peter Steinberger（已加入 OpenAI）在报告发布后承认平台正在加强安全防护，并指出团队在最近两个月做了针对性改进。

但 CertiK 明确建议三类用户——非技术背景的普通用户、安全专业人员、以及有经验的企业开发者——在更稳健的加固版本发布之前，**不要从非官方来源安装 OpenClaw**。

### 3.2 Hermes Agent 的沙盒设计：默认严格

Hermes Agent 的安全策略与 OpenClaw 形成了鲜明对比。

它默认启用严格沙盒：只读根文件系统、权限降级、Linux 能力（capabilities）丢弃、命名空间隔离。内置 Prompt 注入扫描、凭证过滤、敏感数据上下文检测。

如果 OpenClaw 是「功能优先、安全补防」，Hermes Agent 更像是「安全底线默认立好、功能在边界内扩展」。

这个差异在部署上体现得很明显：OpenClaw 早期权限策略相对宽松，生态快速扩张后逐步加固；Hermes Agent 则从一开始就用了更保守的默认配置，攻击面更小。

**不是 Hermes 更安全（两者都开源，都依赖上游模型），而是 Hermes 把安全约束放在了更容易默认达成的位置。** 对于非安全背景的开发者，这意味着更低的配置门槛。

### 3.3 企业选型的安全底线

这里需要说一个残酷的现实：快速迭代的开源项目，安全债是常态，不是例外。

OpenClaw 11 个月拿下 30 万 Stars，这个速度在开源史上也是极罕见的——超越了很多成熟项目 5 年甚至 10 年的积累。

但高速增长意味着代码审查、安全审计、依赖更新的节奏可能跟不上功能发布的压力。

CertiK 的报告不是给 OpenClaw「判死刑」，而是给它标了一个需要认真对待的工程优先级。

对于企业选型者，安全账怎么算？**第一**，评估你的使用场景是否涉及高敏感数据（密码、私钥、企业内部系统）；**第二**，检查部署模式——本地部署比托管模式更可控；

**第三**，建立工具权限最小化原则，不管选哪个框架，「不给 Agent 超权限」是基本功；**第四**，持续关注官方安全公告，不要把「开源」当成「无责任」。

![](https://iili.io/qyoGipR.png)
> 开源不等于无责任，Stars 高不等于安全审计到位

## 四、部署经济学：$5 打工人 vs 企业级网关

### 4.1 Hermes Agent：$5/月 VPS，极低部署门槛

Hermes Agent 的安装体验用一个字总结：快。

一行命令完成安装，官方文档说「10 分钟上手」，最低部署要求是 5 美元/月的 VPS，支持本地、Docker、SSH、Serverless（Modal/Daytona）多种模式。

Serverless 方案在实例空闲时几乎零成本——你不需要一直开着机器，按调用计费。

技术栈方面，Hermes Agent 93.6% 的代码是 Python，对熟悉 Python 生态的工程师来说，定制和扩展的门槛很低。

MIT 协议意味着完全免费、可商用、无授权费——你只需要付服务器和模型调用的费用[3](https://www.cndba.cn/dave/article/131875)。

### 4.2 OpenClaw：npm 五分钟上线，生态成熟

OpenClaw 的安装体验同样简洁：npm 一键安装，GetClaw 提供托管服务，号称「5 分钟上线」。

但 OpenClaw 的价值主张不只是「装得快」，而是「连得多」——目前支持 20+ 平台接入，包括 Telegram、Discord、Slack 这些国际主流应用，**也包括微信、飞书、QQ 等国内平台**，这一点 Hermes Agent 官方版本暂不支持。

对于需要在国内社交生态里做自动化的团队，这是不可忽视的差异。

企业级功能是 OpenClaw 的另一个强项。它内置审计日志、审批流程、多租户隔离、细粒度权限控制，这些是企业选型的硬需求。

ClawHub 已有 4.4 万+技能，生态成熟度远高于 Hermes Agent 的早期社区。

这不是 Hermes 做得差，而是两者发展阶段不同——Hermes Agent 才 2 个月，OpenClaw 已经跑了快 5 个月。

### 4.3 Agent 经济的宏观数据

选型不能只看框架本身，还要看 Agent 经济的市场背景。

根据 CoinDesk 报道，Solana 网络已处理超过 1500 万笔链上 Agent 交易[4](https://www.coindesk.com/business/2026/04/02/ant-group-s-blockchain-arm-unveils-platform-for-ai-agents-to-transact-on-crypto-rails)，Coinbase CEO Brian Armstrong 预计 Agent 的交易量会超过人类。

McKinsey 预测，到 2030 年 AI Agent 可能会经手 3 万亿至 5 万亿美元的全球消费商业规模。

传统支付巨头都在布局：Visa 推出了 Trusted Agent Protocol，Mastercard 以 18 亿美元收购稳定币基础设施公司 BVNK（史上最大稳定币基础设施收购案），Coinbase 在推 x402 协议（与 Cloudflare 联合开发，支持稳定币微支付）。

蚂蚁集团的区块链部门 Ant Digital Technologies 近期发布的 Anvita 平台值得关注——它是专门为 AI Agent 设计链上交易和支付结算的基础设施，支持 OpenClaw 和 Claude Code 等主流框架接入[4](https://www.coindesk.com/business/2026/04/02/ant-group-s-blockchain-arm-unveils-platform-for-ai-agents-to-transact-on-crypto-rails)。

**这些信号说明一件事：Agent 经济的基础设施军备竞赛已经开始了，框架选型不只是「哪个更好用」，也是「哪个会活得更久」。**

![](https://iili.io/BHiCZJe.png)
> 1500万笔链上 Agent 交易……我连自己上个月的账单都没算清

## 五、选型决策树：什么时候选谁，边界在哪里

### 5.1 按场景划分

这里直接给结论，但结论背后有逻辑。

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

第三个是**需要快速落地现成技能的企业场景**。ClawHub 4.4 万+技能意味着你大概率能找到现成的方案，不用从零开发。

OpenClaw 的 GetClaw 托管服务也降低了运维门槛，适合不想自己管基础设施的团队。

### 5.2 混合路径的可能性

两条路线不是互斥的。一个实用的组合是：**用 Hermes Agent 做核心任务规划和长期记忆管理，用 OpenClaw 补执行层和平台接入能力。**

Hermes 的 CLI 接口可以调用外部工具，OpenClaw 的网关也可以接入记忆服务——在架构层面，两个框架的边界是可以打通的。

但这个组合有代价：运维复杂度翻倍，两套系统的对齐需要额外的工程投入。如果你只有一个人，或者团队规模小于 3 人，**不要追求「全都要」**——先选一个，用熟了再考虑扩展。

```yaml
type: decision_tree
layout: horizontal
diagram_goal: 帮助读者在 3 个关键决策节点快速判断该选 Hermes Agent 还是 OpenClaw
visual_ingredients:
  - 第一个分支点：任务周期（短期单次 vs 长期持续）
  - 第二个分支点：平台需求（是否包含微信/飞书/GUI 无 API 操作）
  - 第三个分支点：隐私与安全敏感度（高隐私需求 vs 高效率需求）
  - 每个叶子节点：框架名称 + 一句话选型理由
  - 额外分支：两条路都适用的「混合路径」作为兜底建议
relationship_policy: 单向树形，从上到下推进，每个分支用简短条件句标注判断依据，不画环形
must_emphasize:
  - 每个叶子节点的可执行建议
  - 混合路径是最后兜底，不是默认最优
avoid:
  - 把两个框架标注为「好/坏」
  - 把混合路径放在决策树主干上
```

## 六、Anthropic 与 OpenAI 的「代理人战争」

封号门撕开的不只是两个框架的技术差异，还有一层地缘政治的意味。

Steinberger 是 OpenClaw 的创始人，但他本人已经在 OpenAI 入职——Anthropic 封的是 OpenAI 员工的账号。

这个动作在任何语境下都可以解读为「商业竞争」，无论 Anthropic 的技术解释多合理[1](https://techcrunch.com/2026/04/10/anthropic-temporarily-banned-openclaws-creator-from-accessing-claude/)。

更值得关注的是「claw tax」背后的逻辑。

Anthropic 的订阅制原本是按「人/月」收费，OpenClaw 这类 harness 把一个订阅账号变成了可以多并发、长周期、自动化调用的工具，流量模型完全变了——Anthropic 的原话是「订阅没有为 claw 的使用模式建立」。

Cowork（Anthropic 自家 Agent）的 Dispatch 功能刚上线两周，OpenClaw 的定价就被调整了，这个时间线 Steinberger 的「先抄功能，再锁开源」指控不是空穴来风。

**但也要说一句公道话**：Anthropic 的技术解释在逻辑上是成立的——Agent 的计算消耗模式与普通对话有本质区别，订阅制不覆盖高强度 Agent 使用有其商业合理性。

把这解读成「纯粹的商业打压」和「纯粹的技术决策」都是简化版本，真相可能是两者都有。

这件事给整个开源 Agent 生态的启示是：**当你的框架严重依赖某一个模型提供商的时候，定价权不在你手里。**

Hermes Agent 的设计哲学里有一个隐含的优势——它的核心价值是记忆和学习，不是模型调用效率，理论上可以接入任何模型 provider，不被单家绑定。

这个「不绑定」是战略护城河，不是技术细节。

## 七、写在最后：开源 Agent 的「战争」才刚开始

两条路线会长期共存，不是一个框架通吃。OpenClaw 解决了「连接」这个基础设施问题，Hermes Agent 解决了「成长」这个智能化问题——这两个需求在真实世界里都大量存在。

CertiK 的安全报告给 OpenClaw 提了一个醒：高速增长期的安全债如果不及时清理，会从「可以忍受的代价」变成「限制规模的硬墙」。

OpenClaw 11 个月 30 万 Stars 的背后，是 280+ GHSA 和约 100 个 CVE[2](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)——这不是技术失败，是成长代价，但代价要有人买单。

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

1. [Anthropic temporarily banned OpenClaw’s creator from accessing Claude](https://techcrunch.com/2026/04/10/anthropic-temporarily-banned-openclaws-creator-from-accessing-claude/)

2. [CertiK Warns of Critical Security Vulnerabilities in AI Agent OpenClaw](https://www.crowdfundinsider.com/2026/04/270927-certik-warns-of-critical-security-vulnerabilities-in-ai-agent-openclaw/)

3. [HermesAgent说明](https://www.cndba.cn/dave/article/131875)

4. [Ant Group’s blockchain arm unveils platform for AI agents to transact on crypto rails](https://www.coindesk.com/business/2026/04/02/ant-group-s-blockchain-arm-unveils-platform-for-ai-agents-to-transact-on-crypto-rails)
