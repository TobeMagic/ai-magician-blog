---
layout: "post"
article_page_id: "3460f85d-e690-8124-ad43-f40612e91fb1"
title: "【AI安全 | 系统安全】皇帝没穿衣服，护城河也是：小模型踹开了 AI 安全的皇帝新衣"
description: "Anthropic发布Mythos时宣称其漏洞发现能力独一无二，但开源社区一周内就用7B模型复现了93.9%的同批漏洞。"
categories:
  - "AI安全"
  - "系统安全"
tags:
  - "Jagged Frontier"
  - "Anthropic Mythos"
  - "开源安全"
  - "AI护城河"
  - "Project Glasswing"
  - "漏洞发现"
  - "AI"
  - "人工智能"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/04/18/ai安全-系统安全皇帝没穿衣服护城河也是小模型踹开了-ai-安全的皇帝新衣/"
img: "https://iili.io/BgzGL21.png"
swiperImg: "https://iili.io/BgzGL21.png"
permalink: "posts/2026/04/18/ai安全-系统安全皇帝没穿衣服护城河也是小模型踹开了-ai-安全的皇帝新衣/"
date: "2026-04-18 12:16:00"
updated: "2026-04-18 12:26:00"
cover: "https://iili.io/BgzGL21.png"
---

2026年4月11日，Hacker News热榜第一的位置被一篇研究笔记短暂占据：有人把Anthropic官方展示的Mythos漏洞代码单独拎出来，放进一个几十美元就能跑的小模型里，结果这个7B参数的开源模型找出了93.9%的同批漏洞。

这不是小道消息，是可以复现的公开数据。而这个数字背后，藏着一个正在被整个行业悄悄接受的真相：AI安全的护城河，从来就不在模型里。

## Mythos来了：一次真实的震撼，但护城河有多深

2026年4月7日，Anthropic发布Claude Mythos Preview，官方说法是「能发现数万个未知零日漏洞」的AI模型。

它找到了OpenBSD藏了27年的bug、FFmpeg 16年未修复的漏洞，第一次让AI独立完成一整套32步企业网络攻击模拟[1](https://www.forbes.com/sites/ronschmelzer/2026/04/09/anthropics-claude-mythos-preview-aims-to-find-dangerous-software-bugs/)。

Anthropic选择了克制：Mythos不公开发布，而是通过Project Glasswing——一个封闭的受控访问项目——只给大约40家经过审查的机构使用，包括Amazon Web Services、Apple、Google、Microsoft、Nvidia、Cisco、CrowdStrike、JPMorgan Chase和Palo Alto Networks[2](https://aitoolly.com/ai-news/article/2026-04-12-ai-cybersecurity-after-mythos-small-open-weights-models-match-performance-of-large-scale-systems)。

Anthropic承诺了$100M的漏洞修复预算，$4M捐给开源安全组织，目标是「在对手发现这些漏洞之前，先帮关键软件供应商修复它们」。

这是一个听起来无懈可击的防御叙事：最危险的能力，先交到最应该拥有它的人手里。

但一周之后，这个叙事出现了一个裂缝。

![正文图解 1](https://iili.io/BgzeCZX.png)
> 正文图解 1

## 护城河被实测：小型开源模型捡起了Mythos的漏洞

### 一周内的独立验证

在Mythos发布后不到48小时，英国政府旗下的AI Security Institute（AISI）发布了独立的公开技术评估[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)。

他们在「The Last Ones」测试场景中运行了Mythos Preview——这个测试模拟一个需要串联32个步骤才能完成的完整企业数据提取攻击。

AISI的结论是：在单步网络安全任务上，Mythos与GPT-5.4、Opus 4.6、Codex 5.3等竞品的差距只有5到10个百分点，谈不上代际碾压[4](https://www.wired.com/story/in-the-wake-of-anthropics-mythos-openai-has-a-new-cybersecurity-model-and-strategy/)。

这已经让「Mythos = 绝对优势」的叙事打了折扣。而真正的重击来自开源社区。

### Jagged Frontier实测数据

研究者Stanislav Fort做了最直接的事情：把Anthropic官方展示的漏洞代码单独提取出来，测试了多款小型开源模型[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)。结果如下：

- **Llama-3.1-8B**：恢复93.9%的漏洞分析

- **Qwen2.5-7B**：在部分测试中达到97.6%

- **但在exploit生成任务上**：小型模型骤降至42.3%

这三个数字构成了一张完整的能力画像：

![正文图解 2](https://iili.io/BgzeA8l.png)
> 正文图解 2

「理解漏洞」和「分析漏洞影响」这两件事，小模型够用。「构造可用exploit」，小模型明显不足。

这意味着什么？Mythos官方宣传的核心卖点是「发现漏洞」，但开源复现数据显示小模型在漏洞发现上的差距很小——真正区分能力的环节是「利用漏洞」，而不是「找到漏洞」。[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)

![](https://iili.io/BgzwRyP.png)
> 所以我们平时修的漏洞，到底有多少是被小模型先找到的？

⚠️ **踩坑提醒**：如果安全评估只看「漏洞发现率」一个指标，会系统性低估小模型的实际威胁——但同时，如果只看「能不能构造exploit」又会高估小模型的进攻能力。

Jagged Frontier的精确含义是：不同任务落在能力曲线的不同区间，不能用单一指标评估。

## 什么是Jagged Frontier：能力不是一条平滑曲线

### 概念定义

「Jagged Frontier」是形容AI能力发展路径的一个形象比喻。

传统叙事里，AI能力随模型规模增长是一条平滑上升曲线——参数越多，能力越强，越到前沿护城河越深。

但Jagged Frontier说的是：在某些特定任务上，小模型和大模型之间的差距非常小（曲线几乎是平的）；而在另一些任务上，差距突然拉大（曲线出现锯齿）。

漏洞发现正好落在「曲线平坦」的那个区间。[1](https://www.forbes.com/sites/ronschmelzer/2026/04/09/anthropics-claude-mythos-preview-aims-to-find-dangerous-software-bugs/)

这意味着：对于防御方而言，「AI漏洞发现」这件事本身已经没有技术壁垒了。真正需要前沿推理能力的环节——构造一个能在目标系统上成功运行的多步骤攻击链——才是大模型的相对优势所在。

但这个优势，在开源社区的快速跟进和Agent框架的成熟下，正在以超出预期的速度被侵蚀。

### 为什么漏洞发现先被摊平

安全研究社区经过几十年积累了大量漏洞模式、代码签名库、静态分析工具和模糊测试框架。这些知识大量以公开论文、开源代码和CVE数据库的形式存在。

小模型在训练时接触了这些知识，在推理时能调用这些模式——这就是为什么一个7B模型能发现OpenBSD里27年前引入的bug：不是因为它比人类更聪明，而是因为那个bug的特征已经被社区记录过了。

[1](https://www.forbes.com/sites/ronschmelzer/2026/04/09/anthropics-claude-mythos-preview-aims-to-find-dangerous-software-bugs/)

真正需要「前沿推理能力」的环节——构造一个完整攻击链——才是大模型的相对优势所在。

![](https://iili.io/BHPgyMX.png)
> 原来我们以为的「天才」，只是因为读的书够多

## 为什么真正的护城河是系统，而不是模型

### Project Glasswing的真正价值

Anthropic宣布Glasswing时，叙事重点是「我们有Mythos，所以我们来保护世界」。但仔细看这套机制，它的护城河不在Mythos这个模型，而在Glasswing这套系统：[2](https://aitoolly.com/ai-news/article/2026-04-12-ai-cybersecurity-after-mythos-small-open-weights-models-match-performance-of-large-scale-systems)

1. **封闭访问控制**：40家机构经过审查才能接入，不是随便一个研究员都能跑

2. **漏洞信息隔离**：发现的漏洞在封闭圈内优先修复，不对外公开细节

3. **修复闭环承诺**：$100M预算直接用于支付开源安全组织的修复工作

4. **时间窗口管理**：给关键软件供应商留出修复窗口，再对外发布补丁

这是一个「发现 → 修复 → 披露」的工业流程，而不是一个「超级AI模型」的技术神话。模型是这个系统的输入，但不是系统的全部价值。

### OpenAI的反面教材

有趣的是，OpenAI在Mythos发布后一周推出了GPT-5.4-Cyber，官方博客的论调是「我们相信现有的安全护栏已经足够支撑广泛部署」[4](https://www.wired.com/story/in-the-wake-of-anthropics-mythos-openai-has-a-new-cybersecurity-model-and-strategy/)。

两种策略的根本分歧在于：**限制模型访问** vs **相信护栏足够**。

但两者都面对同一个事实：Jagged Frontier意味着小模型正在缩小与前沿模型的差距，「模型本身」作为护城河的可靠性正在下降。

OpenAI和Anthropic的策略之争，本质上是在争谁的系统工程能力更强，而不是谁的模型更大。

### 护城河重构的三层含义

对行业观察者来说，Mythos事件揭示了一个更深层的护城河重构：

- **第一层（模型）：** 已经不够深，小模型能追上

- **第二层（系统）：** Glasswing式的封闭生态、工程流程和合作伙伴网络，这是当前真正的壁垒

- **第三层（数据飞轮）：** 谁能用真实漏洞数据持续训练，谁就能在exploit生成等硬核任务上保持领先——这部分OpenAI可能有优势，因为它的安全研究用户更多[5](https://www.forbes.com/sites/ronschmelzer/2026/04/16/openais-new-gpt-54-cyber-raises-the-stakes-for-ai-and-security/)

CSA在2026年4月15日发布的报告里给出了明确的时间线判断：到2026年年底，Mythos级别的漏洞发现能力会落入几乎所有攻击者手中。[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)这个时间线比大多数人的直觉更短。

![](https://iili.io/Bgzw16v.png)
> 也就是说，我们现在修的漏洞，可能攻击者下个月就能自己挖出来了

⚠️ **踩坑提醒**：CISO不应该被「我们有最强模型」这个叙事带偏。真正的投资方向应该是：如何把AI漏洞发现能力整合进自己的安全运营流程，而不是赌在单一供应商的模型护城河上。

Glasswing模式值得学习的是「闭环」思维，不是「封闭」技术。

## 对安全团队的直接影响：Jagged Frontier时代的应对框架

### 基础安全实践的新优先级

CSA在2026年4月15日发布的《Building a 'Mythos-Ready' Security Program》里给出了一句话总结：「没有什么是新的，但很多公司做得不够好。」[4](https://www.wired.com/story/in-the-wake-of-anthropics-mythos-openai-has-a-new-cybersecurity-model-and-strategy/)

具体来说：

- **网络分段（Segmentation）：** 攻击链再长，也要从一台机器跳到另一台。好的分段能让单一漏洞利用无法横向扩展

- **出口过滤（Egress Filtering）：** 攻击者最需要的不是进入，是数据外传。控制出口流量比控制入口更重要

- **多因素认证（MFA）：** 特别是抗钓鱼的硬件密钥或FIDO2，这是防御AI辅助凭证攻击的基础

- **纵深防御：** 不是一道高墙，而是多层防线——CSA的原话是「increase difficulty for attackers」，不是「prevent attackers」[6](https://en.cryptonomist.ch/2026/04/15/ai-cybersecurity-claude-mythos-gpt-5-4-cyber/)

### 补丁管理需要重新校准

传统安全运营的默认假设是：从补丁发布到全面部署，企业有几周到一个月的窗口期。

Mythos时代，这个假设不再成立。CSA建议安全团队重新评估对业务停机时间的风险容忍度——如果补丁窗口被压缩到几天甚至几小时，变更管理流程撑得住吗？[7](https://www.securityweek.com/mythos-ready-security-csa-urges-cisos-to-prepare-for-accelerated-ai-threats/)

具体操作层面：建立「高危漏洞优先通道」机制，不是所有补丁平等排队；假设你的环境中已经有未修复的漏洞——这是现实，不是恐慌——因此要把精力放在「限制漏洞被利用后的影响范围」而不是「阻止所有入侵」。

⚠️ **踩坑提醒**：很多企业的补丁管理流程是月度节奏，遇到紧急漏洞才临时加急。

Mythos时代建议提前建立「72小时高危补丁强制上线」的SLA，否则补丁窗口被攻击者压缩到几天时，你的修复流程会成为最短的那块木板。

### AI对AI：防守方也必须武装起来

CSA报告的核心建议之一是「用AI对抗AI」：[7](https://www.securityweek.com/mythos-ready-security-csa-urges-cisos-to-prepare-for-accelerated-ai-threats/)

- 在CI/CD流程里引入LLM-powered agent，在代码提交阶段自动扫描漏洞

- 扩大AI在安全运营中心的应用范围，让自动化工具处理大量低危告警，把人类专家释放出来应对真正的紧急事件

- 但要清醒：AI工具也会产生新漏洞——CSA明确承认这个悖论[7](https://www.securityweek.com/mythos-ready-security-csa-urges-cisos-to-prepare-for-accelerated-ai-threats/)

这形成了一个加速循环：AI发现漏洞 → AI修复漏洞 → AI产生新漏洞 → AI再去发现……安全团队的职责不是跑赢AI，而是跑赢另一个安全团队里的AI。

![](https://iili.io/qysRTqQ.png)
> 所以安全工程师的KPI应该是：我的AI比攻击者的AI早到一步

### 桌面推演：不是「会不会发生」，而是「同时来几个」

CSA报告给出了一个具体的推演场景设计建议：模拟同一周内同时遭遇三次高危漏洞利用、一次勒索软件和一次内部数据泄露，而不是模拟一次APT攻击。[4](https://www.wired.com/story/in-the-wake-of-anthropics-mythos-openai-has-a-new-cybersecurity-model-and-strategy/)

这是Mythos时代的新威胁模型：攻击者的成本在下降，攻击密度在上升，企业安全团队要准备好应对的不是「一次危机」，而是「并发危机」。

## Anthropic与五角大楼的博弈：护城河叙事遭遇政策现实

### 技术能力与制度管控的碰撞

Anthropic的处境用一个词形容是「左右为难」。

2026年2月，国防部长Pete Hegseth要求Anthropic对五角大楼开放模型的无限制访问权限，涵盖「合法用途」——包括自主武器系统和国内监控。

Anthropic CEO Dario Amodei拒绝了。[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)

Hegseth将Anthropic列入「供应链风险」名单，这个标签此前只给与外国对手有关联的公司。

Anthropic在3月提起两项联邦诉讼，联邦法官初步叫停该决定，但上诉法院在4月8日推翻裁决，Anthropic被正式排除在国防部合同之外。[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)

讽刺的是：同一个月，财政部长Scott Bessent和美联储主席Jerome Powell召集了主要银行CEO的紧急会议，议题正是Mythos带来的网络安全风险。

美国证券业协会（ASA）在4月17日致信财政部长，明确警告Mythos可能带来的「系统性金融市场动荡」风险——攻击者可能利用Mythos的能力渗透SEC的Consolidated Audit Trail数据库，一次性暴露数百万投资者的个人信息。

[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)情报界、CISA、英国金融监管机构都在排队申请Mythos访问权限。[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)

一个被国防部封禁的公司，掌握着财政和情报系统最想要的安全工具。

### Anthropic的谈判筹码

Anthropic之所以敢跟五角大楼硬刚，不只是因为安全立场，而是因为它不需要五角大楼活着。年化收入$30B，估值$800B，正在筹备IPO——它有足够的商业底气维持自己的安全护栏立场。[3](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)

4月18日的白宫会议，正是它试图把这个底气转化为政策妥协的尝试。

### 政策空窗里的真实问题

无论Amodei和Wiles的会议结果如何，有一个结构性矛盾已经浮出水面：

- 监管机构要求访问最强漏洞挖掘工具（因为他们知道漏洞真的存在）

- 但给监管机构开放模型访问，本身就可能成为情报泄露和武器化的风险点

- 同时，开源社区正在用小模型复现这些能力——封闭政策正在失效

这个三角困局没有Easy Answer，但它正在重塑AI安全的整个治理框架。

![](https://iili.io/BOjuaZg.png)
> 监管机构要你开放，但开放本身就是风险，不开放又被骂

## 写在最后：护城河的真正含义

Mythos事件给整个行业留下了一个需要被重写的认知：

**模型不是护城河，系统才是。**

一个7B的开源模型能发现93.9%的Mythos漏洞，这个数字本身不是新闻——它只是把行业里早就存在的隐忧说出来了：AI安全能力的护城河不在模型参数里，在工程闭环里，在响应速度里，在组织能力里。[1](https://www.forbes.com/sites/ronschmelzer/2026/04/09/anthropics-claude-mythos-preview-aims-to-find-dangerous-software-bugs/)

Glasswing的真正贡献不是Mythos这个模型，而是它展示了一种「先修后公开」的防御工业化路径。这种路径可以被大公司做，也可以被开源社区学。

真正的悬念是：**当Mythos级别的漏洞发现能力成为攻击者的标配时，防御方的组织学习和系统建设能不能跟上？**

Mike Johnson（Rivian CISO）的预言是「窗口期年底关闭」[7](https://www.securityweek.com/mythos-ready-security-csa-urges-cisos-to-prepare-for-accelerated-ai-threats/)。4月18日的白宫会议正在进行——这个窗口到底还有多大，也许比Mythos本身更值得关心。

---

## 参考文献

1. [Anthropic's New Powerful Mythos Model Has Cybersecurity ... - Forbes](https://www.forbes.com/sites/ronschmelzer/2026/04/09/anthropics-claude-mythos-preview-aims-to-find-dangerous-software-bugs/)

2. [AI Cybersecurity: Small Models Match Anthropic Mythos](https://aitoolly.com/ai-news/article/2026-04-12-ai-cybersecurity-after-mythos-small-open-weights-models-match-performance-of-large-scale-systems)

3. [Anthropic's Amodei heads to the White House as Washington fights over Mythos access](https://thenextweb.com/news/anthropic-amodei-wiles-mythos-white-house-pentagon-cybersecurity)

4. [In the Wake of Anthropic’s Mythos, OpenAI Has a New Cybersecurity Model—and Strategy](https://www.wired.com/story/in-the-wake-of-anthropics-mythos-openai-has-a-new-cybersecurity-model-and-strategy/)

5. [OpenAI's New GPT-5.4-Cyber Raises The Stakes For AI And Security](https://www.forbes.com/sites/ronschmelzer/2026/04/16/openais-new-gpt-54-cyber-raises-the-stakes-for-ai-and-security/)

6. [Can controlledaicybersecuritymodels prevent exploitsafterMythos...](https://en.cryptonomist.ch/2026/04/15/ai-cybersecurity-claude-mythos-gpt-5-4-cyber/)

7. [‘Mythos-Ready’ Security: CSA Urges CISOs to Prepare for Accelerated AI Threats](https://www.securityweek.com/mythos-ready-security-csa-urges-cisos-to-prepare-for-accelerated-ai-threats/)
