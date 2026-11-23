---
title: "Lean 与 Mathlib 社区确认 Levent Alpöge 黎曼猜想证明正确"
date: "2026-11-23 06:00:43"
updated: "2026-11-23 06:20:39"
permalink: "posts/2026/11/23/lean-与-mathlib-社区确认-levent-alpöge-黎曼猜想证明正确/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/23/lean-与-mathlib-社区确认-levent-alpöge-黎曼猜想证明正确/"
article_id: "8b52a113-c8fb-4ba8-a184-541b94f8eb54"
description: "Lean 与 Mathlib 社区确认 Levent Alpöge 黎曼猜想证明正确。先讲清事实，再讲机制、边界和取舍：Lean 与 Mathlib 社区发表声明、确认斯坦福数学家 Levent Alpöge 的黎曼猜想证明正确。Alpöge 于 2026 年 11 月 20 日以 1700 万行 Lean 代码发布该证明、数十人独立运行得到相同结果、且验证程序被设计为可证明不会接受有缺陷的证明。。"
cover: "/var/lib/aimagician/artifacts/covers/8b52a113-c8fb-4ba8-a184-541b94f8eb54/8ebb1a33-8320-4568-b78a-2a5edad8c4e9/cover.png"
imgTop: false
---

Lean 与 Mathlib 社区发表声明，确认斯坦福数学家 Levent Alpöge 的黎曼猜想证明正确。

### 事实：声明说了什么

2026 年 11 月 20 日，Alpöge 在个人网站上传了一份 4 页 PDF，声称在 Claude 协助下完成黎曼猜想证明，并发布了 1700 万行 Lean 代码库。次日，Lean FRO 与 Mathlib Initiative 联合声明，列举四项验收标准——

第一，命题语句正确。使用的是 Mathlib 库中已审定的 RiemannHypothesis 定义。
第二，代码库编译通过。数十人复现，得到同一份证明导出文件。
第三，代码证明的是正确命题。社区新增隔离文件，用 comparator 和 con-leche --compare 两套独立工具比对，确认定理与 Mathlib 定义一致。
第四，证明通过多重独立检查器验证，包括 Lean 内核、con-leche、con-ron 及若干第三方实现。



![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> 1700万行代码，一天核完



MIT 数学家 Andrew Sutherland 汇总检查记录，《科学美国人》引用他的原话：这份证明仅使用了三个标准公理，Lean 内核独立复查完毕。帝国理工 Kevin Buzzard 此前提出的两个关键问题——命题是不是黎曼猜想本身、能否在多内核通过——都已回答。

### 机制：机器怎么验的

Lean 是一种形式化证明语言，核心设计目标是不可抵赖。每一条推导步骤由内核检查，公理化程度高，漏洞概率远低于日常编程。

``mermaid


![Lean 黎曼猜想验证流水线](https://iili.io/oKPkIUv.png)
> Lean 黎曼猜想验证流水线


关键设计：验证程序被设计为可证明不会接受有缺陷的证明。第三方检查器基于不同语言实现，交叉排除单一内核漏洞风险。数学家 Elliot Glazer 在声明发布当晚估计，Lean 自身存在漏洞的概率远低于 1%。
### 边界：通过了什么、还没通过什么

被认证的是形式化正确性，不是人类已经读懂它。Alpöge 本人称完整论证超过 25 万页印刷体，机器验完逻辑链条，但数学界仍需时间提取新思路。

克雷研究所的百万美元奖金尚未颁发。规则要求证明必须在符合资质的期刊发表，并接受至少两年同行审视。时间线大概率落在 2028 年之后。

[[reaction=detective-truth|caption=机器验了逻辑，人类还没读完]]

更现实的边界：形式验证不能替代数学洞察。证明里可能隐藏着新的解析工具或数论技巧，这些需要人为挖掘。机器能回答"对不对"，回答不了"为什么重要"。

### 落点：下一步做什么

数学界的下一步是阅读理解。Alpöge 团队已在论文预印本中给出了方法概述，数论研究者会逐节拆解证明中的关键技术节点。与此同时，Lean 社区正在积累大规模形式化项目的验证经验——庞加莱猜想、纳维-斯托克斯方程之后，这是第三道千禧年难题进入形式化验证视野。

对工程团队的启示同样具体：形式化验证不是万能的，但在可形式化的问题上，它是目前唯一能给出确定性答案的工具。1700 万行代码一天核完，靠的不是算力堆叠，而是验证流水线的设计——隔离命题、双工具比对、多内核交叉。这套模式可以直接复用到其他大规模形式化项目。

## 声明说了什么

时间戳在 2026 年 11 月 21 日 13:55。Lean FRO 与 Mathlib Initiative 联合发布声明，对 Alpöge 与 Claude 合作的黎曼猜想证明给出结论：「命题与证明都是正确的」。

声明列出四条验收标准，并称都已满足：

- 被证明的命题必须是 Mathlib 库里专家已审定的黎曼猜想表述
- 代码库可以正确编译
- 代码证明的就是这个命题，而不是被改过定义的相似命题
- 导出证明通过 Lean 官方内核，以及多个独立实现的检查器交叉验证

帝国理工学院的 Kevin Buzzard 此前提出过两个关键问题：代码里的命题是否就是黎曼猜想本身，以及证明能否在多个独立内核上通过。报道写明，相关核验已经完成。



![程序员 reaction：呦！这个nice！](https://i.ibb.co/tpxzdCjW/transparent.png)
> 这一天终于来了



## 机器怎么验的

Lean 是一个形式化证明辅助系统。它让研究者可以用编程语言精确表达数学陈述，并提供严格的证明检查。

Alpöge 的库包含约 1700 万行代码、超过 17 万个模块。验证需要约 100GB 内存和 70GB 硬盘空间。数十人报告编译成功，并复现出同一份证明导出文件。

核心步骤有三：

1. 编译检查。证明导出文件必须通过 Lean 官方内核
2. 命题比对。社区新增一个文件，仅导入 Mathlib，隔离黎曼猜想的陈述，然后用 comparator 和 con-leche --compare 两套独立工具与 Alpöge 证明的定理进行比对
3. 交叉验证。额外使用 con-ron 及若干用不同语言实现的第三方检查器

MIT 数学家 Andrew Sutherland 汇总了更细的检查记录。《科学美国人》引用他的话说：「说句实话，这里面还有猫腻的可能性大约是零。」

mermaid


![Lean验证黎曼猜想的工作流](https://iili.io/oKPkMJ4.png)
> Lean验证黎曼猜想的工作流



## 通过了什么、还没通过什么

「验证通过」在传播中被简化掉了限定条件。被盖章的是这份证明的形式化正确性。

麻省理工学院数学家 Elliot Glazer 在声明发布当晚公布的初步检查提到，形式化的命题确实是广义黎曼猜想，代码编译还需数小时。他估计 Lean 自身有漏洞的概率远低于 1%。

但机器验证的是另一件事。它确保每一步推理符合 Lean 的逻辑公理，不会偷换命题，不会引入未声明的假设。这不等价于人类数学家读懂了这个证明。

更不等价于克雷研究所的一百万美元奖金。根据该所规则，任何千禧年难题候选证明必须在符合资格的期刊上发表，并经受全球数学界至少两年的审视。

菲尔兹奖得主 James Maynard 在相关讨论中指出，下一步是数学家们去研究和解释这一证明蕴含的新思路。167 年来没人看懂的东西，现在机器说它是对的，但人还需要花时间理解它。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 大佬点头了



## 下一步做什么

对于数学界，接下来的工作分两层：

第一层是独立复现与审查。Lean 的内核本身可能有漏洞，概率低于 1% 但并非零。第三方检查器的实现也需要时间review。

第二层是数学理解。证明导出了 25 万页的打印内容，数学家需要从 1700 万行代码中提炼出核心思路，判断它是否真的带来了新工具，还是只是把已知方法包装得更严密。

对于工程实践，这次事件提供了一个样本：当形式化验证的规模达到千万行级别，社区协作的核验机制能否在一天内完成？答案是肯定的，前提是提前立下四条硬标准，并且有足够多的独立执行者。

对于个人，可以今天就做的三件事：关注 Lean 社区的后续博客更新、阅读 Alpöge 的 4 页 PDF 摘要了解证明框架、在本地克隆 Mathlib 库尝试编译其中的小规模例子。



![程序员 reaction：哥让你三行代码](https://i.ibb.co/5WFYv3hY/transparent.png)
> 人类要开始补课了



2026年11月20日，Alpöge 在个人网站上传了一份仅 4 页的 PDF，宣称在 Claude 协助下完成了黎曼猜想的证明，并公开了以 Lean 形式化表示的代码库。代码库规模 1700 万行、包含超过 17 万个模块，体积庞大。

次日，Lean FRO 与 Mathlib Initiative 发布联合声明，列出四项标准并称均已满足。

---

### 四项验收标准分别验了什么

声明的四条标准分别对应证明不同层次的正确性，从命题定义到逻辑推导，逐层收紧。

第一项是命题对齐：Alpöge 的代码库证明的命题必须与 Mathlib 中已有的 RiemannHypothesis 定义完全一致。社区新增了一个只导入 Mathlib 的文件，隔离出黎曼猜想陈述，再用 comparator 与 con-leche --compare 两套独立工具做比对，结果匹配。

第二项是编译通过：代码库能在 Lean 内核上编译，数十人独立复现得到同一份证明导出文件，构建过程无报错、无失败。编译环境需约 100GB 内存和 70GB 硬盘空间。

第三项是证明有效：导出的证明通过了 Lean 官方内核，以及 con-leche、con-ron 等多套独立实现的检查器交叉验证。部分检查器还具备基于集合论的形式化正确性证明，用于排除形式化逻辑系统本身存在缺陷的可能。

第四项是公理干净：证明仅依赖 Lean 内核的公理基础，未偷偷引入额外数学假设。

麻省理工学院的 Andrew Sutherland 汇总了更细的检查记录，《科学美国人》引用其话说，该证明仅使用了三个标准公理，"这里面还有猫腻的可能性大约是零"。mermaid


![Lean 证明核验流程](https://iili.io/oKPkvgj.png)
> Lean 证明核验流程


这套流程的设计逻辑是：不要信任单一检查器，不要信任单一编译环境，不要信任未隔离的命题定义。多独立实现交叉验证，本质上是在降低"某件工具恰好犯了同一个错误"的概率。

---

### 机器通过不等于人类读懂

形式化证明的价值在于可验证性，但它的局限也同样明确。

Lean 检查器验证的是：从给定公理出发，每一步推导是否符合形式化逻辑规则，最终能否推出目标命题。这是逻辑正确性，不是数学意义上的"理解"。

Alpöge 本人在声明中提到，完整的数学论证长度超过 25 万印刷页。机器验证通过只说明这个论证的形式化实现无误，并没有说明这个论证的数学思路是否可被人类消化吸收。

MIT 数学家 Elliot Glazer 在声明发布当晚的初步检查中曾表示，理论上不排除 Lean 自身存在漏洞的可能性，但他估计这种情况的概率远低于 1%。

换言之，形式化验证把一个"这个证明对不对"的大问题，拆解成了"Lean 内核实现有没有 bug"这个小问题。后者更容易检验、更容易共识，但前者——证明背后的数学洞见——依然要由人类数学家来完成解读。

Oxford 数论学家 James Maynard 在《自然》的报道中被引用，其态度可以概括为：形式化验证完成是重要一步，但数学界接下来的工作是理解这份证明为什么正确、它用了什么新工具、哪些思路可以推广。

更狠的是，这份证明把"25万页的数学论证塞进1700万行代码"这件事本身，就成了形式化数学的一个里程碑案例。之后类似规模的项目还会再来。

---

### 克雷百万美元奖为何还要再等两年

黎曼猜想是克雷数学研究所提出的千禧年七大难题之一，悬赏 100 万美元。形式化验证通过，距离领奖还有明显距离。

根据克雷研究所的规则，千禧年难题的解必须在同行评审的数学期刊上发表，并接受数学社区至少两年的审视。

Nacionale 的报道明确指出，即使 Lean 验证全部通过，百万美元奖也要再等 2 年以上。原因在于：形式化证明是机器可读的，但不是人类可读的完整论文。数学社区需要时间把它翻译成传统数学语言，发表在经过同行评审的期刊上，然后在两年里接受全球数学家的质疑和检验。

庞加莱猜想和纳维-斯托克斯方程的先例显示，即使证明获得广泛认可，克雷研究所的两年等待期仍然是硬性规则。

这意味着当前的事件可以精确描述为：形式化证明的验证完成，数学洞见的消化尚未开始。

---

### 下一步要做什么

对于数学社区，下一步是解读这份证明的新思路、新工具和新方法，将其转化为可被传统数学写作接受的论述。

对于形式化验证项目，这是一个信号：当证明规模达到千万行代码级别时，传统的"数学家手推一遍"模式已经失效，机器验证成为必要的基础设施。

对于 Lean 与 Mathlib 生态，这次事件验证了一套可扩展的核验流程：独立编译、命题比对、多检查器交叉验证——这套流程可以复用到其他大规模形式化证明项目。

对于 Anthropic 和 AI 辅助数学证明这条路径，关键问题是：AI 在证明中承担了什么角色？Alpöge 称 Claude 在"接近完成时接手"。这意味着 AI 的作用可能是生成证明的结构、填充细节、或处理大规模的形式化翻译，而核心数学洞见仍由人类提供。

这项工作的落点可以总结为一句判断：形式化验证完成是必要条件，不是充分条件。它解决了"证明没错"，还没解决"证明有用"。后者需要数学家花两年以上的时间来回答。

---

## 参考文献
- Lean community blog: Lean verification of the Riemann Hypothesis — https://leanprover-community.github.io/blog/posts/riemann-hypothesis
- Lean on X (@leanprover): Joint statement announcement — https://x.com/leanprover/status/2124159121645801562
- Unite.AI: Lean and Mathlib Communities Certify Claude-Assisted Riemann Proof — https://www.unite.ai/lean-and-mathlib-communities-certify-claude-assisted-riemann-proof
- The Decoder: Lean and Mathlib community officially confirms Levent Alpöge's proof — https://the-decoder.com/lean-and-mathlib-community-officially-confirms-levent-alpoges-riemann-hypothesis-is-correct
- MLQ.ai: Lean and Mathlib communities certify Levent Alpöge's Claude-assisted proof — https://mlq.ai/news/lean-and-mathlib-communities-certify-levent-alpoges-claude-assisted-proof-of-the-riemann-hypothesis
- Nacionale: Lean community certifies Riemann proof; prize years off — https://www.nacionale.com/en/articles/when-will-we-know-riemann-hypothesis-proof-verified-alpoge-claude-lean-what-happens-next
- Clarin: Who is Levent Alpöge? The Anthropic mathematician — https://www.clarin.com/us-news/who-is-levent-alpoge-the-anthropic-mathematician-who-claims-solved-the-riemann-hypothesis-with-claude_0_2WdGvYKBVM.html
- Kingy.ai: Levent Alpöge claims a Riemann hypothesis proof with Claude — https://kingy.ai/blog/levent-alpoge-claude-riemann-hypothesis-proof
- 知乎专栏: 黎曼猜想证明通过独立验证 — https://zhuanlan.zhihu.com/p/2107761556834477418
- 网易订阅: Anthropic数学家AI攻克黎曼猜想？Lean社区通过核验 — https://www.163.com/dy/article/LCB6RAKH0511B8LM.html
### 机器验过了什么
声明列出的四项验收标准，本质上是四个分层门禁。先验命题：用的是 Mathlib 库里已审核过的 `RiemannHypothesis` 表述，不是被改过定义的相似命题。再验代码：十余万人复现同一份导出文件，编译无错误。三验定理：`comparator` 和 `con-leche --compare` 两套独立工具比对结果一致。四验内核：Lean 官方内核通过，且多个第三方检查器给出相同结论。


![程序员 reaction：你确定这是真的吗？](https://iili.io/CAQh0N9.png)
> 形式化验证的盖章环节


这四个门禁解决的是「是不是真的」这个问题。但真正的问题藏在下一层。
形式化验证系统保证的是：定理陈述与 Mathlib 中已经审核的标准定义一致，所有推理步骤符合 Lean 内核的规则，且没有任何隐藏的额外假设被引入。它不保证证明方法本身是「正确的」「优雅的」或者「有新意的」。这些是人类数学家的工作。mermaid


![形式化验证 VS 人类理解的分层关系](https://iili.io/oKPkrmB.png)
> 形式化验证 VS 人类理解的分层关系


这个分层关系解释了一个经常被忽略的事实：机器验过，不等于人类读懂。证明的价值不在验证这一步，而在后续的理解和提炼。
### 下一步要做什么
Alpöge 于 11 月 20 日发布的是精简版代码库，完整的证明逻辑藏在 1700 万行 Lean 代码背后。数学家们接下来的任务是「读代码」——这不是比喻，而是字面意义上的工作：逐行分析定理的结构，理解每一步构造的动机，判断其中是否包含了新的数论工具或分析方法。
从经验看，这种级别的证明通常会在几个月内开始有独立的解读文章出现在预印本平台。如果有人能在代码中发现一条原本不存在的捷径，或者把某个复杂的引理推广到一个更广泛的框架里，那才是真正的突破点。mermaid
%% title: 验证后数学界的工作路径
sequenceDiagram
  participant M as 数学家
  participant C as Lean 代码
  participant J as 预印本平台
  participant P as 正式期刊
  M->>C: 逐模块分析证明结构
  C->>M: 揭示新工具与新引理
  M->>J: 发表解读文章
  J->>M: 社区反馈与修正
  M->>P: 投稿同行评审
  P->>M: 2年评审期
### 边界在哪里
「验证通过」和「获得克雷百万美元奖金」是两个完全不同的门槛。克雷研究所有明确的规则：候选证明必须发表在符合要求的学术期刊上，并经过至少两年的独立审阅。也就是说，即便形式化验证完全成功，Millennium Prize 也还要再等至少两年。
坦白讲，这个时间差不是因为 doubters 多，而是因为数学界对这种级别的证明习惯慢验证。百年难题的解法，从来不会在发推之后的四十八小时内就被所有人接受。


![搬砖系列表情：见鬼，难道这帮人都不用搬砖的吗](https://iili.io/CUyWCes.png)
> 人类数学家接下来的活儿


今天可以做的事很简单：关注 Anthropic 和斯坦福的后续动态，留意 Alpegge 个人页面上的完整 PDF 是否更新，以及 Mathlib 仓库是否有相关 issue 或 PR。AI 辅助证明的时代已经来了，而真正有意思的部分——理解那些代码背后是什么——才刚刚开始。

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
