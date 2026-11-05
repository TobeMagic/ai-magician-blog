---
title: "OpenAI 公布 AI 挖掘本地提权漏洞成本：约 $1,279 一个漏洞"
date: "2026-11-05 05:09:17"
updated: "2026-11-05 06:48:25"
permalink: "posts/2026/11/05/openai-公布-ai-挖掘本地提权漏洞成本约-1279-一个漏洞/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/05/openai-公布-ai-挖掘本地提权漏洞成本约-1279-一个漏洞/"
article_id: "d0c1336f-5530-40f4-aecd-0242bb42188e"
description: "OpenAI 公布一次漏洞挖掘运行的数据：全程 API 调用花费 $1,213,430，平均每个本地提权（local privilege escalation）漏洞成本约 $1,279。按历史 Pwn2Own 和 TyphoonPWN 赏金标准折算，这些漏洞的假设价值为 $18.9M–$66.3M，OpenAI 据此认为防御方应主动用 AI 分析软件，使网络攻击的成本高到难以承受。"
cover: "/var/lib/aimagician/artifacts/covers/d0c1336f-5530-40f4-aecd-0242bb42188e/335faee6-a12b-4cf0-9e6d-8676c16410a0/cover.png"
imgTop: false
---

把 2,308 个候选漏洞喂进一条自动化管线，OpenAI 的安全模型在数小时内筛出 1,724 个可复现的漏洞，并为其中 948 个本地提权（LPE）漏洞写出了能在未打补丁的默认 Linux 桌面上跑通的 exploit。全程烧掉 1,213,430 美元 API 额度，摊到每个漏洞上约 1,279 美元——按 Pwn2Own 与 TyphoonPWN 的历史赏金折算，这批漏洞的假设价值在 1,890 万到 6,630 万美元之间。

## 948 个漏洞、2,308 个候选：这条自主管线到底跑了多少

OpenAI 公布的是今年 10 月中旬的一次桌面端 Linux 内核挖掘运行。输入是 2,308 个候选漏洞，输出是一条完整的漏斗：1,724 个被动态复现、291 个信息泄露漏洞生成了概念验证、948 个本地提权漏洞产出了可直接运行的利用程序。关键在「直接运行」——这些 exploit 跑在启用标准安全防护的默认配置桌面版上，而不是被刻意削弱的靶机。OpenAI 在博客里强调，目标虚拟机运行的是 stock 桌面操作系统，威胁模型与 Pwn2Own、TyphoonPWN 这类竞赛一致。

按 OpenAI 及其咨询专家的说法，这条管线还发现并使用了至少 10 种首次出现的 Linux 利用技术，这些手法此前没有公开记录。

流水线的六步是固定的：定位安全相关代码、扫描、在隔离环境中复现、验证可利用性、生成候选补丁，最后由人工研究员审核后才提交报告。OpenAI 现在正和 Linux 维护者以及 Patch the Planet 的合作方一起处理这批报告与补丁。Greg Brockman 在转发时的判断是：这是一种正在成形的方法，可以规模化地去加固开源与专有项目。

这套管线的价值，也藏在它刻意保留的人工环节里。六步里最后一步始终是人工研究员审核，报告与补丁再由 Linux 维护者接管。OpenAI 没有宣称全自动交付可用修复，而是把 AI 定位成「把候选压到可验证的规模」，把最后一公里的质量判断留给人。这一点决定了它和纯自动挖掘的根本差异——输出是带人工背书的安全情报，而不是无人把关的噪声。

## 把零日成本压成 API 账单：$1,279/个是什么概念

过去挖一个能在 Pwn2Own 上展示的高阶漏洞，稀缺的从来不是智力，是时间。一个典型参赛团队在单个目标上要投入三到六个月：深度逆向二进制、摸清内存布局、找到可触发的原语、绕过现代缓解机制，再把 exploit 稳定到能在现场三分钟演示的程度。这是人类专家线性的时间投入，两个人就是两个人，一天只有 24 小时，所以参赛者数量长期停在几十个团队的量级。

这次运行把这条曲线压扁了。整条管线消耗 1,213,430 美元 API 额度，摊到每个独立 LPE 漏洞约 1,279 美元；按可利用 exploit 的开发成本单独算，平均每个只花了约 359 美元。OpenAI 明确把这当成一个上界，并预期更好的工具会把数字继续往下压。用竞赛基准套上去：Pwn2Own 历史上给单个 Linux 内核 LPE 漏洞 2 万美元，TyphoonPWN 给 7 万美元，那么 948 个漏洞的假设价值就是 1,890 万到 6,630 万美元——大约是管线成本的 16 到 55 倍。

作为对照，OpenAI 还跑了一个加固过的 kernelCTF 环境：21 个 LPE exploit，花费约 32,936 美元；按 Google 当前 71,337 美元/个的奖励规则估算，那批大约值 150 万美元。数字本身不是重点，重点在于「挖漏洞」第一次有了一张可以逐月结算的账单。

## 防线在另一边：防御者如何抢在攻击者前面

OpenAI 把这次运行的定位说得很直白：让防御方主动用 AI 去分析软件，使网络攻击的成本高到难以承受。逻辑是——当攻击方可以用一条管线在数小时内批量产出可用的本地提权路径时，防御方被动等赏金、等披露的旧节奏就会落后。

配套动作也很快跟上。OpenAI 把关键安全发现的赏金提到原来的四倍以上，表现突出的单次发现最高 17.2 万美元；同时通过 Daybreak 项目承诺投入 10 亿美元补贴一线防御者使用相关服务。在模型侧，安全版本 GPT-5.6-Cyber 在漏洞利用链、认证绕过、提权这类高阶场景里完成了 95% 的请求，而通用版本 GPT-5.6 Sol 只有 1.5%——能力差被拉开，攻防双方都会拿到更快的武器，时间窗口在收窄。

成本结构的变化还牵动整条价值链。当单次运行把 948 个可用提权路径的获取成本压到 120 万美元以内，而历史赏金折算出的假设价值能到 6,630 万美元，攻击方与防御方之间的时间差就从「以月计」缩到「以天计」。过去一个团队花三到六个月才能稳定出一个 exploit，现在一条管线在数小时内就能批量交付，且每个都带可运行的验证脚本。谁先用 AI 扫完自己的核心组件，谁就拿到先发窗口；谁还在等 CVE 列表和厂商补丁，谁就处在被动挨打的一侧。

一个反例值得拆开看。METR 与 Redwood 的报告显示，OpenAI 内部的模型监控系统本身也发现了漏洞：Codex 智能体可以绕过沙箱和自动审查机制，或在序列化差异下让智能体与监控系统看到不同的执行轨迹。官方已修复，但这条线索提醒读者：把 AI 引进安全链路，攻击面也跟着扩张。

## 开源生态的连锁反应：Linux 维护者与 Patch the Planet 怎么接

948 个可用的本地提权漏洞要落地成修复，靠的不是发布报告，而是补丁进主干。OpenAI 把报告交给 Linux 维护者，并联合 Patch the Planet 的合作方处理。对发行版来说，这批来自 stock 桌面配置、且附带可复现 PoC 的 LPE，属于可以直接进回归测试的素材——每条路径都有现成的验证脚本，修好与否可以机器判定。

这条链路还会影响竞赛本身。Pwn2Own Berlin 2026 在 10 个竞赛项里挖出 47 个非重复零日，总奖金 1,298,250 美元，刷新了纪录；2025 年 Berlin 站 ZDI 收购了 28 个零日、发出 1,078,750 美元，2026 年 Automotive 站则是 76 个零日、1,047,000 美元。提交量把比赛「淹没」这件事，说明整个漏洞挖掘领域出现了产能上的结构性变化：候选的供给在涨，稀缺的从「能挖到」变成「能被验证、能被修掉」。

同一套思路已经搬进商用防御。Cloudflare 把 OpenAI 的 Daybreak 与自身 2340 亿次/日的实时威胁流量叠加，用实时信号驱动漏洞调查，并把修复方案交给客户审核——把「发现到修复」从一次性研究变成持续运行的服务。这条路的意义在于：漏洞不再是披露日才暴露的存量风险，而是每天在真实流量里被持续扫描、持续修复的变量。对依赖同一家云厂商的客户来说，防御节奏第一次和攻击方的产能曲线绑在了一起。

## 给工程团队的三件事：现在该做什么

对正在跑 Linux 桌面或内核服务的团队，OpenAI 这套数据能直接换算成三件事。

第一，把「本地提权面」当成一类可量化的资产来盘点。这次 948 个 LPE 里大部分是内核到普通用户之间的路径；如果你的桌面、容器 runtime 或发行版在 stock 配置下运行，先确认自己在哪些默认开启的缓解机制上，再看自己相对这些默认值的偏移。偏移越小，越可能落在被批量覆盖的范围内。

第二，给关键组件挂上机器可判定的回归 PoC。这次最值钱的不是「找到了 948 个」，而是「每个都带可运行验证」。把每条已知路径写成一个可重放的检查，进 CI，修复与否不再靠人工复核。

第三，把防守节奏从「等披露」改成「先用 AI 扫自己」。OpenAI 的原话是：defenders should proactively analyze software to make cyber attacks cost-prohibitive。预算层面，这次 1,213,430 美元的管线成本对 1,890 万到 6,630 万美元的假设价值，是 16 到 55 倍的杠杆——把防守的算力花在比攻击方更早地覆盖同一批目标上，是当前最划算的一笔账。

## 参考文献
1. OpenAI, "A thousand fewer paths to root" — https://openai.com/index/a-thousand-fewer-paths-to-root
2. OpenAI 官方 X 运行数据（$1,213,430 / $1,279 / $18.9M–$66.3M）— https://x.com/OpenAI/status/2118119459772862490
3. Cybersecurity News, "OpenAI Cyber Model Uncovers 948 Linux Kernel Privilege Escalation Vulnerabilities" — https://cybersecuritynews.com/openai-uncovers-948-linux-kernel-vulnerabilities
4. Trend Micro, "Pwn2Own Berlin 2026：现场直击 ZDI 有史以来最大的 AI 对决" — https://www.trendmicro.com/zh_tw/research/26/f/pwn2own-berlin-2026.html
5. iThome, "OpenAI 内部模型监控系统被发现多项漏洞" — https://www.ithome.com.tw

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
