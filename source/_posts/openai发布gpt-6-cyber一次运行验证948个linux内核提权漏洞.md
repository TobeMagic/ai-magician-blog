---
title: "OpenAI发布GPT-6 Cyber：一次运行验证948个Linux内核提权漏洞"
date: "2026-11-24 01:03:31"
updated: "2026-11-24 01:35:22"
permalink: "posts/2026/11/24/openai发布gpt-6-cyber一次运行验证948个linux内核提权漏洞/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/24/openai发布gpt-6-cyber一次运行验证948个linux内核提权漏洞/"
article_id: "6e2c4df9-c5e3-4553-87af-7605d6fe8d04"
description: "11月5日 OpenAI 发布安全模型 GPT-6 Cyber：10月中旬一次运行中，自主流水线复现 1,724 个 Linux 内核漏洞，为 948 个本地提权漏洞生成可用 exploit，API 成本约 121 万美元；304 项关键发现已连同候选补丁交给维护者。Firefox 另挖出 81 个未知高危漏洞，Brotli 关键 RCE 亦被验证。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/ad7ea505-6daf-489f-9ece-e50bb5d2e419.png"
imgTop: false
---

10月中旬，一次运行，948个Linux内核提权漏洞全部复现，各配补丁。

OpenAI 11月5日发布 GPT-6 Cyber。它由 GPT-6 Astra 经强化学习特化而来，网络安全风险评级被标为 Critical，初期只对 Daybreak Red 获批客户开放，接入方式包括 API 和 Codex。

公开论文题为《A thousand fewer paths to root》。团队在受控研究环境中，让这套流水线对 Linux 内核主分支扫了一遍。2308 个候选发现经过分析，动态复现了 1724 项已知漏洞，最终产出 948 个可运行的本地提权利用。相比之下，同 harness 下 GPT-5.6 Sol 只生成了 166 个利用，差距超过五倍。

OpenAI 称流水线还识别出至少 10 种此前未知的新利用技术。技术细节被刻意保留，未对外公开。

## 一、GPT-6 Cyber 发布：首轮战果

### 成本与收益的现实换算

成本构成里，单次扫描约 121 万美元，分摊到每个成功利用漏洞平均约 1279 美元。这个数字放在业界背景里看并不算离谱。TyphoonPWN 开出的最高奖金是 7 万美元，Pwn2Own 的 Linux 内核提权单项奖金是 2 万美元。如果把 948 个漏洞交给人类研究员逐个攻破，以现有市场奖励单价计算，总成本会高出几个数量级。

这些漏洞目前还没有进入公开利用渠道，补丁正在推进。

Firefox 那边也刷出了 81 个此前未知的高危漏洞。一个被反复审计过的浏览器，依然能找出这么多问题。Mozilla 团队已在确认这批发现，Brotli 库也存在 CVSS 9.2 的关键远程代码执行漏洞（CVE-2026-111497）。

### 模型能力的横向坐标

模型在 ExploitGym 基准上拿到 48.5%，比 GPT-5.6 Cyber 的 32.1% 提升显著。在真实渗透测试里，它在 GitLab、PostgreSQL、Jenkins 等已知缺陷场景下完成了 95% 的任务，而同期 Astra 模型面对同类任务直接拒绝执行。Web 渗透测试场景中，它能识别 40.3% 的漏洞，同期 Astra 为 32%。

风险评级从 High 调至 Critical 的判断依据是：模型能在未授权条件下生成可执行利用代码，且完成度远高于基座模型。

### 自治流水线的运行逻辑



![流水线跑出948个提权](https://iili.io/ofC12af.png)
> 流水线跑出948个提权



这组流程的核心是迭代而非单次推理。先让模型读取源码、理解调用链，再假设攻击路径、生成 PoC、在容器里执行、收集结果，最后根据反馈调整下一次尝试。948 这个数字统计的是可用 exploit 数量，不是新发现漏洞的全集，代表的是独立攻击向量的数量。单次扫描的 API 成本约 121 万美元，运行 30 小时。

OpenAI 向 Linux 维护者披露了 304 项关键发现并附上候选补丁，这部分漏洞确实此前未被发现或未被记录。其余未披露的漏洞可能属于已知问题的不同利用路径，或处于进一步验证阶段。

### 人机协作的责任边界



![304项补丁进修复周期](https://iili.io/ofC1x6u.png)
> 304项补丁进修复周期



真正的瓶颈不在模型端，而在维护者的时间预算。304 份候选补丁对应 304 次代码审查、测试和合并决策。开源社区的维护人力是有限的，AI 可以快速找到问题，但最终是否接受补丁、如何排序修复优先级，仍然取决于人。

OpenAI 的限制措施也很明确：只有 Daybreak Red 获批客户才能访问，初期不向公众开放。所以这类工具暂时不会扩散到黑产渠道，前提是公司能维持住访问控制。

### 初步判断

漏洞挖掘的成本曲线正在发生结构性变化。过去需要数月人力投入的完整攻击链，现在可以在单日内完成复现和验证。这对防御方意味着两件事：威胁面在扩大，但修补窗口也在缩短。

OpenAI 的做法是把验证和补丁生成纳入同一套流水线，这在逻辑上是自洽的。找到漏洞后立刻给出候选修复方案，而不是让维护者在海量报告中自己筛选。

**取舍结论**：在需要快速验证已知缺陷场景时，GPT-6 Cyber 这类安全特化模型的价值已经被数据证实。适用前提是你能接受 API 成本和数据敏感性限制。当你需要的是大规模未知漏洞挖掘，或者对模型输出有严格的合规要求时，保留人工审核环节仍然是必要的。

## 二、流水线如何跑出 948 个提权漏洞

### 从 2,308 个候选到 948 个可用 exploit

OpenAI 的研究流水线是一个闭环系统。模型先扫描 Linux 内核代码库，产出 2,308 个候选发现。接着动态复现，确认 1,724 个漏洞真实存在。最后针对本地提权场景，生成 948 个可用的 exploit 以及 291 个信息泄露 PoC。



![漏洞发现→利用→补丁流水线](https://iili.io/ofC1u8x.png)
> 漏洞发现→利用→补丁流水线



关键不在于数量本身，而在于「可用」。948 个 exploit 是可以让未授权本地用户获取 root 权限的。这不是理论分析，是实际可运行的代码。OpenAI 确认智能体还使用了至少 10 种此前未知的 Linux 利用技术，技术细节未公开。

### 成本与效率的换算

121 万美元分摊到 948 个 exploit，每个约 1,279 美元。对比 GPT-5.6 Sol 的 3,095 美元/个，成本下降 58%。这是一个有意义的趋势信号。

在真实安全团队里，人工审查一个内核漏洞的平均成本通常以天计。如果自动化工具能以一千美元量级完成复现加利用生成，这个经济账就值得算。OpenAI 同时提醒：948 统计的是 exploit 数量，不是新漏洞数量，数字不能直接折算成「新 948 个漏洞」。

但这不是免费午餐。成本来自大量 API 调用和计算资源，且当前访问权限仅限获批安全团队。普通开发者接触不到这个工具，也不应该轻易接触到。

### 超越前代五倍的能力跃迁

同一套研究 harness，GPT-5.6 Sol 产出 166 个 exploit，GPT-6 Cyber 产出 948 个。五倍差距不是线性积累，是能力跃迁。

ExploitGym 基准测试上，GPT-6 Cyber 得分 48.5%，GPT-5.6 Cyber 得分 32.1%。在 GitLab、PostgreSQL、Jenkins 已知漏洞任务上完成 95%，而 Astra 拒绝所有任务。这说明 Cyber 版本在安全研究场景下确实经过了针对性优化，而不是通用模型偶尔发挥。

## 三、下游影响：304 项披露、Firefox 81 个、Brotli RCE

### Linux 维护者的收件箱

OpenAI 没有把结果扔进虚空。按照 Linux 社区指南，304 项关键发现连同候选补丁已披露给维护者。扫描结束时，61 项已上游合入，43 项在 staging 补丁中，299 项处于公开讨论阶段。

这个跟进节奏说明两点：一是模型生成的 exploit 和补丁质量足够高，可以被维护者直接参考；二是 OpenAI 选择了负责任披露路径，而非抢先公开。

| 状态 | 数量 |
|------|------|
| 已合入上游 | 61 |
| staging 补丁 | 43 |
| 公开讨论中 | 299 |
| 合计关键披露 | 304 |

### Firefox 的「已知战场」再失守

Firefox 是被反复安全审计的浏览器。即便如此，GPT-6 Cyber 仍从中挖出 81 个此前未知的高危漏洞。Mozilla 已修复其中多数。

这说明什么？即使是最成熟的开源项目，自动化扫描仍然能发现盲点。不是维护者不够努力，是代码规模和维护速度之间的差距在扩大。

### Brotli 关键 RCE 与 CVSS 9.2

另一个关键发现是 Brotli 压缩库的远程代码执行漏洞，编号 CVE-2026-111497，CVSS 评分 9.2。这个分数对应「高严重性」——攻击者可以在未经认证的情况下远程执行代码。

Brotli 是广泛使用的压缩算法，嵌入在 Web 服务器、CDN、浏览器等多个环节。一个 RCE 漏洞的影响面不是单点，而是整个链路。这也是为什么 OpenAI 将其列为关键发现优先披露。

## 四、数字背后的机制取舍

### 为什么能挖这么多

核心原因有两个。一是模型能力。GPT-6 Cyber 经过安全微调，对内核代码的理解深度和利用逻辑的推理能力显著提升。二是自动化流水线。从代码扫描到 exploit 生成再到补丁建议，全流程无需人工干预。

但这里有一个取舍。模型生成的 exploit 虽然可用，但不代表每个都能被实际攻击者利用。Linux 内核有 KASLR、SMAP、KPTI 等防护机制，exploit 稳定性取决于目标系统的配置。OpenAI 在报告中明确区分了「可复现」和「可靠利用」——前者是研究阶段目标，后者才是实战标准。

### 安全边界在哪里

OpenAI 将 Cyber 的访问权限限制在获批安全团队范围内，理由是「这类能力不应该被滥用」。这个判断有道理，但也引出新问题。

当自动化工具能以百万美元成本生成近千个内核 exploit 时，真正的风险不在工具本身，而在门槛。如果黑市上有愿意支付这笔成本的攻击者，948 个 exploit 就是 948 条潜在攻击路径。OpenAI 的克制在于选择披露而非公开，但这个选择能否持续，取决于后续模型能力的演进速度。



![程序员 reaction：柯南00027 可疑哦](https://iili.io/CCZvaGs.png)
> 复现率约75%



另一个边界是误报和漏报。2,308 个候选中只有 1,724 个被复现，复现率约 75%。剩余 25% 的去向不明——可能是误报，也可能是流水线未能覆盖的复杂场景。也就是说 948 个 exploit 不是内核漏洞的全集，只是已被验证的部分。

## 五、可执行的判断

### 短期：补丁跟进节奏

948 个漏洞中，304 个已披露，61 个已合入。按当前进度，剩余漏洞的补丁跟进可能需要数月甚至更长时间。建议运维人员关注自身使用的内核版本，优先打补丁的关键漏洞列表。

### 中期：安全研究范式转移

自动化工具辅助漏洞发现已成现实。对于有资源的安全团队，引入类似流水线是合理选择。对于普通用户，依赖厂商补丁节奏即可。不需要亲自复现 948 个漏洞，只需要知道哪些影响自己。

### 长期：谁在用，怎么用

GPT-6 Cyber 目前仅对获批团队开放。短期不会普惠。但能力扩散是趋势，不是假设。当类似工具的成本下降到十万美元量级时，使用门槛会显著降低。现在的关注重点是建立规范，而不是恐慌。

一个模型能在一次运行中验证近千个内核提权漏洞，这在两年前还不可想象。技术进步的速度往往超出预期，关键是跟上节奏，而不是假装没发生。

## 参考文献
[1] OpenAI's GPT-6 Cyber Uncovers 948 Linux Kernel Vulnerabilities. https://x.com/i/trending/2118124843438948485?lang=en
[2] OpenAI's GPT-6 Cyber Uncovers 948 Linux Kernel Vulnerabilities / X. https://x.com/i/trending/2118124843438948485
[3] OpenAI Releases GPT-6 Cyber After Model Finds 948 Linux Kernel Exploits | MLQ.ai. https://mlq.ai/news/openai-releases-gpt-6-cyber-after-model-finds-948-linux-kernel-exploits
[4] GPT-6 Cyber: AI Finds 948 Linux Exploits & 81 Firefox Flaws | Aviatrix Threat Research. https://aviatrix.ai/threat-research-center/openai-gpt-6-cyber-ai-augmented-vulnerability-research-948-linux-exploits-81-firefox-flaws-2026
[5] 刚刚，OpenAI 发布 GPT-6 Cyber！一轮挖出 948 个漏洞，GPT-6.2 也快了 - 知乎. https://zhuanlan.zhihu.com/p/2101929446475355025
[6] OpenAI GPT-6 Cyber Finds 948 Linux Kernel Vulnerabilities.... https://www.youtube.com/watch?v=rRzyyZ20eyM
[7] OpenAI's Security-Tuned Version of GPT-6 Astra Closed Root-Level Linux Holes for $1,280 Each. https://www.deeplearning.ai/the-batch/gpt-6-cyber-patches-more-security-flaws-for-less-cost
[8] OpenAI introduces GPT-6 Cyber to find security vulnerabilities · GPTunneL. https://www.gptunnel.ru/en/blog/gpt-6-cyber

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
