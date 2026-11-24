---
title: "Lean 与 Mathlib 社区确认 Levent Alpöge 黎曼猜想证明正确"
date: "2026-11-23 06:00:43"
updated: "2026-11-24 12:38:50"
permalink: "posts/2026/11/23/lean-与-mathlib-社区确认-levent-alpöge-黎曼猜想证明正确/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/23/lean-与-mathlib-社区确认-levent-alpöge-黎曼猜想证明正确/"
article_id: "8b52a113-c8fb-4ba8-a184-541b94f8eb54"
description: "Lean 与 Mathlib 社区确认 Levent Alpöge 黎曼猜想证明正确。先讲清事实，再讲机制、边界和取舍：Lean 与 Mathlib 社区发表声明、确认斯坦福数学家 Levent Alpöge 的黎曼猜想证明正确。Alpöge 于 2026 年 11 月 20 日以 1700 万行 Lean 代码发布该证明、数十人独立运行得到相同结果、且验证程序被设计为可证明不会接受有缺陷的证明。。"
cover: "/var/lib/aimagician/artifacts/covers/8b52a113-c8fb-4ba8-a184-541b94f8eb54/8ebb1a33-8320-4568-b78a-2a5edad8c4e9/cover.png"
imgTop: false
---

Lean 与 Mathlib 社区发表声明，确认斯坦福数学家 Levent Alpöge 的黎曼猜想证明正确。

## 一、声明说了什么

11 月 21 日 13:55，经 Lean FRO 与 Mathlib Initiative 背书的联合声明公布：2026 年 11 月 20 日，Anthropic 数学家 Levent Alpöge 发布了一份以约 1700 万行 Lean 代码库形式存在的黎曼猜想证明，社区一天内完成核验，宣布「命题与证明都是正确的」。

声明列出四项验收标准，并称全部满足：

- 命题正确：使用的是 Mathlib 库中已由 Lean 与数论专家审定的 RiemannHypothesis 定义。
- 代码可编译：数十人独立复现，得到同一份原始证明导出文件。
- 证明对应正确命题：社区新增一个只导入 Mathlib 的隔离文件，用 comparator 与 con-leche --compare 两套独立工具比对，确认定理与 Mathlib 陈述一致。
- 证明有效：导出文件通过 Lean 官方内核、con-leche、con-ron 及若干不同语言实现的第三方检查器。



![被追着问 BUG 修完了吗时的程序员表情](https://iili.io/noCi27n.png)
> 1700万行代码，一天核完



## 二、机制：机器怎么验的

Lean 是交互式定理证明器，内核逐行机械核验每一步推导，设计目标是不接受有缺陷的证明。这次验证的关键设计有三点：

1. 命题与证明分离。Lean 内核只查推理过程，不查题面；若题面被写错，代码照样能编译。社区因此另写隔离文件，用两套独立工具确认「证的就是那道题」。
2. 惰性导出。全部检查运行在导出的原始证明文件上，接触不到源码中假设存在的恶意代码。
3. 多内核交叉。Rust 实现的 nanoda 内核 27 分 42 秒接受整份证明，con-leche 3 分 15 秒审完 146.8 万条声明，lean4lean 逐个检查 175,187 个模块；con-leche 与 con-ron 还附带相对集合论的形式化证明，保证检查器自身不可能接受错误证明。



![黎曼证明验证流水线](https://iili.io/oflHLrv.png)
> 黎曼证明验证流水线



数学家 Elliot Glazer 在声明发布当晚给出初步估计：Lean 自身存在漏洞并被利用的概率远低于 1%。MIT 的 Andrew Sutherland 汇总检查记录，《科学美国人》转述他的原话：证明只用了三个标准公理，「说句实话，这里面还有猫腻的可能性大约是零」。帝国理工 Kevin Buzzard 此前提出的两个关键问题——命题是不是黎曼猜想本身、证明能否在多内核通过——均已得到回答。

## 三、边界：通过了什么、还没通过什么

- 被认证的是形式化正确性，不是人类已经读懂它。Alpöge 自述完整论证展开超过 25 万页，他本人也承认尚未完全掌握论证周围的数学，需要继续理解、简化并写成可供人阅读的文本。
- 验证范围：黎曼 ζ 函数与 Dirichlet L 函数的广义黎曼猜想；Dedekind ζ 函数、Hecke L 函数与一般自守 L 函数不在其中。
- 竞争者：AI 证明发布几小时后，斯坦福学者 Alessandro Masullo 的 940 页纯人工手稿被贴出；审阅专家康拉德认为其仍需重大修订，且没有获得同级别的独立形式化验证，两者不能等量齐观。
- 奖金未发：克雷研究所规则要求正式发表之后经受至少两年审视并获全球数学界普遍接受，时间线大概率落在 2028 年之后。

## 四、落点：下一步做什么

1. 人类可读的精简版。Alpöge 计划把论证简化成能讲解的文本；陶哲轩的初步分析指向朗兰兹纲领与算术几何领域的现代成果，数学界梳理核心思路仍需时间。
2. 验证流水线可复用。隔离命题、双工具比对、多内核交叉这套模式，可以直接套到其他大规模形式化项目——在庞加莱猜想、纳维-斯托克斯方程之后，这是第三个进入形式化验证视野的千禧年难题。
3. 工程启示。形式化验证在可形式化的问题上，是目前唯一能给出确定性答案的工具；1700 万行代码一天核完，靠的是验证流水线的设计而非算力堆叠。

## 参考文献
1. Lean community blog: Lean verification of the Riemann Hypothesis（Lean FRO 与 Mathlib Initiative 联合声明）— https://leanprover-community.github.io/blog/posts/riemann-hypothesis
2. 网易·IT之家: Anthropic 数学家 AI 攻克黎曼猜想？Lean 社区通过核验 — https://www.163.com/dy/article/LCB6RAKH0511B8LM.html
3. 什么值得买: Lean 社区确认黎曼猜想验证通过 — https://post.smzdm.com/p/a4q4kkek
4. 知乎: 黎曼猜想证明通过独立验证 — https://zhuanlan.zhihu.com/p/2107761556834477418
5. Unite.AI: Lean and Mathlib Communities Certify Claude-Assisted Riemann Proof — https://www.unite.ai/lean-and-mathlib-communities-certify-claude-assisted-riemann-proof

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
