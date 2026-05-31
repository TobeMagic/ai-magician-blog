---
layout: "post"
article_page_id: "3710f85d-e690-81b7-9d84-e1c22d240a9f"
title: "【个人成长 | AI时代】别让 vibe-coding 变成新的信息流上瘾：越会用 AI，越要保住深度思考"
description: "这篇是 AI 时代的个人成长反思：vibe-coding 很容易把人带进短反馈、频繁切换和 token 消耗的循环。真正的分水岭不是谁点得更快，而是谁能在写 prompt 前先想清楚目标、边界和 plan，并把每次和 AI 的讨论沉淀成自己的判断力。"
categories:
  - "个人成长"
  - "AI时代"
tags:
  - "个人成长，AI时代；第一人称深度反思；克制但有情绪；不鸡汤、不营销；围绕 vib"
  - "Vibe-coding"
  - "AI"
  - "Token"
  - "Prompt"
  - "Plan"
  - "人工智能"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/31/个人成长-ai时代别让-vibe-coding-变成新的信息流上瘾越会用-ai越要保住深度思考/"
img: ""
swiperImg: ""
permalink: "posts/2026/05/31/个人成长-ai时代别让-vibe-coding-变成新的信息流上瘾越会用-ai越要保住深度思考/"
date: "2026-05-31 09:09:00"
updated: "2026-05-31 09:09:00"
---

最近我有一个很强烈的感觉：vibe-coding 有时候不像在写代码，反而像在刷短视频。刚看到一点结果，马上想点下一次；刚改完一个页面，又忍不住切到另一个问题。

## 一、我为什么觉得 vibe-coding 有点像新的信息流

### 1.1 它给反馈太快，快到人很容易上瘾

vibe-coding 的核心机制是自然语言驱动生成，你描述一个功能，AI 几秒内给你一个可运行的实现。这种即时反馈满足了我们对"掌控感"的渴望，却也在悄悄重塑我们的注意力模式。

想想刷抖音为什么会停不下来？算法在每 15-30 秒给一次新鲜内容，让大脑持续处于期待状态。vibe-coding 的节奏几乎一样：提交一个 prompt，30 秒后拿到代码，测试一下，又切到下一个需求。这种循环的快感是真实的，但代价是——我们越来越难安静坐下来想清楚一个问题的本质。

我观察到一个现象：很多人在 vibe-coding 时，打开 Cursor 或 Windsurf 的第一件事不是想"我要解决什么问题"，而是直接开始敲 prompt。prompt 的质量取决于思考的深度，而深度思考需要时间。给反馈的时间越短，人越倾向于跳过思考，直接进入"打字-看结果-再打字"的循环。

> 信息流 vs vibe-coding 的注意力循环对比

### 1.2 频繁切上下文，会让人误以为自己很高效

vibe-coding 的第二个陷阱是上下文切换的幻觉。当你一天和 AI 交互了 50 次，每次都在不同的功能点之间跳跃，表面上看产出很多，实际上你的深度思考能力正在被消耗。

认知科学里有个概念叫"切换成本"（switching cost）：每次切换任务，你需要花费额外的心智资源重建上下文。而 vibe-coding 的工作流天然鼓励这种高频切换——反正 AI 接得住，你不需要完整理解一个模块的逻辑，丢给 AI 就行。

问题在于，这种"高效"是假象。你确实快速完成了多个功能，但你对系统整体的理解是碎片化的。当你需要 debug、需要优化性能、需要向别人解释这段代码的意图，你会发现自己在每个节点上都没有足够的掌控力。真正的效率不是做了多少事，而是对所做的事有多少把握。

![高频上下文切换 vs 深度聚焦的认知成本差异](https://iili.io/C3GXxNn.png)
> 高频上下文切换 vs 深度聚焦的认知成本差异

name: context-switch-cost

![正文图解 2](https://iili.io/C3GXNHP.png)
> 正文图解 2

![正文图解 3](https://iili.io/C3GXbsf.png)
> 正文图解 3

layout:
  direction: LR
  spacing: 2
```

真正的分水岭不是谁点得快，而是谁能在这个快节奏里守住自己的思考节奏。

但更隐蔽的问题发生在更深层——prompt 质量正在系统性下滑。

当反馈循环变快，人的本能反应是缩短每次思考的时间。写 prompt 不再是「我要解决什么问题、约束条件是什么、希望 AI 以什么角色思考」，而是变成了「给我一个登录页面，快」。这种浅层 prompt 的代价不是立刻显现的——AI 仍然会输出代码，你仍然会觉得在推进。但几轮之后你会发现：代码越来越难调，AI 的建议越来越偏离你的意图，而你自己也不知道为什么会这样。

核心机制是这样的：每一次低质量 prompt 都在消耗你「定义清晰目标」的能力。这个能力像肌肉一样，不用则退化。

![](https://iili.io/B2xuxFj.png)
> prompt 质量与深度思考能力的正相关循环






edges:
  - from: shallow_prompt
    to: low_quality_output
    label: 缺少边界定义
  - from: low_quality_output
    to: more_tuning
    label: 需要反复修正
  - from: more_tuning
    to: token_overhead
    label: 迭代成本累积
  - from: token_overhead
    to: thinking_degeneration
    label: 失去前置思考习惯
  - from: thinking_degeneration
    to: shallow_prompt
    label: 无法提出高质量需求
```

而这个循环的反面——深度 prompt 的复利效应——同样成立。当你花时间在写 prompt 前想清楚「我要做什么、为什么这么做、约束条件是什么」时，AI 的输出会更精准，你需要的调优轮次会更少，你学到的模式会沉淀成自己的判断力。

这里有一个关键洞察：高频使用 AI 的人，和真正从 AI 学习的人，正在快速分化。前者的 prompt 越来越短、越来越即兴；后者的 prompt 越来越结构化、越来越有明确的学习目标。几个月后，两类人的 AI 使用效率和代码质量会拉开巨大差距。

这不是「要不要用 AI」的问题，而是「怎么用才能让自己的深度思考能力保持增长」的问题。

## 二、真正消耗人的不是 token，而是没有想清楚就开始

### 2.1 低质量 prompt 会制造更多返工

我观察到一个很反直觉的现象：很多人在 vibe-coding 场景下花了大量时间「调优」，但仔细看他们的调优记录，大部分都在修补同一个问题——最开始那个 prompt 太模糊了。

比如有人说「帮我写个登录页面」，AI 生成一个基础版本；然后他说「加上验证码」，AI 加上了；他又说「验证码要支持国际号码」，AI 又改了一轮；然后他发现验证码服务商不支持某些地区，又得改架构……四轮下来，这个人花了 20 分钟，看起来在高效迭代，实际上只是在为一个本该在第一轮就定义清楚的需求反复擦屁股。

![](https://iili.io/BgV3nQR.png)
> 低质量 prompt 的返工陷阱

这种返工的本质不是迭代，是消耗。因为每次返工都在占用你的注意力带宽，让你更难集中精力去思考真正重要的东西——业务逻辑、数据流向、边界情况。

### 2.2 多次调优不一定是迭代，也可能只是迷路

我曾经有一段时间陷入一种很奇怪的状态：每天都在和 AI 对话，每天都在产出代码，但每周回顾的时候却发现进度几乎为零。那些代码还在，但那周定的目标没实现。

后来我复盘了一下，发现问题出在「方向确认」环节。我每次写 prompt 都是临时起意，「这个功能好像缺点什么」「那个页面需要改个颜色」，然后让 AI 帮我生成。AI 确实生成了，但我自己都没想清楚这个改动要解决什么问题、验收标准是什么。结果改完第一轮，觉得不对；改完第二轮，觉得方向有问题；改完第三轮，发现回到第一轮最接近正确答案。

这就是「迷路」——不是走得慢，是不知道终点在哪。

### 2.3 一次高质量 prompt，后面才会形成复利

我后来强迫自己养成一个习惯：每次让 AI 写代码之前，先花 5 分钟把「我要解决什么问题、约束条件是什么、希望 AI 以什么角色思考」写清楚。听起来很费时间，但实际上这 5 分钟帮我省下了后面可能浪费的 30 分钟调优时间。

高质量 prompt 有一个隐藏属性：它会倒逼你思考。你写「给我一个登录页面，快」的时候，你不需要想任何东西；但你写「这个登录页面需要支持企业 SSO，兼容 IE11，用户输入错误时不要暴露具体错误原因」的时候，你被迫去想业务场景、技术约束、安全边界。这些思考沉淀在你脑子里，下一次遇到类似场景时你会有判断力，而不是只会说「给我一个登录页面，快」。

这个判断力，才是真正的复利。

![正文图解 6](https://iili.io/C3GXy0l.png)
> 正文图解 6

### 3.2 问清楚为什么这么做，而不是只看它做了什么

大多数人在 vibe-coding 的时候，只关心「这段代码能不能跑」。但如果你只停留在这个层次，你其实错过了 AI 最有价值的部分——它知道的技术路径可能比你知道的多得多。

我现在的习惯是，每次 AI 给出方案，我会追问一句：「为什么你选择这种方式？有没有其他方案？为什么那个方案没有入选？」

这三个追问，逼着 AI 展开它的判断逻辑。而这个判断逻辑，恰恰是你最需要内化的东西。

比如 AI 推荐用 Redis 做缓存，而不是数据库直接查询。如果你只复制代码，这个知识点就流失了。但如果你追问「为什么是 Redis 而不是内存缓存」，你就会理解 Redis 的持久化优势、分布式场景下的共享能力、以及什么规模才值得引入这个复杂度。这个知识点会变成你的判断框架的一部分，下次遇到类似场景，你自己就能做决策。

![](https://iili.io/C9b9rF4.png)
> 追问为什么：把 AI 的判断逻辑转化为自己的判断框架

### 3.3 把更好的方案记下来，训练自己的判断力

AI 输出的是代码，但真正有价值的是它背后的判断框架。每次遇到「这个方案比我原来想的更好」的时刻，你应该停下来把这个「更好」记录下来。

不是记代码。是记判断逻辑。

比如：原来我觉得分层越细越好，现在 AI 告诉我三层架构在当前规模是过度设计，两层就够维护了。这个认知更新——「架构复杂度要与业务规模匹配」——才是真正值得沉淀的东西。

这个习惯坚持一段时间，你会发现自己的 prompt 质量在提升。不是因为你学会了更多 prompt 技巧，而是因为你在 AI 的反馈中积累了越来越多的判断维度：什么情况下用 Redis、什么情况下用消息队列、什么情况下要先做原型验证……这些判断力会形成你自己的 mental model，下次写 prompt 之前，你的脑子里已经有一个预判了。

这个预判，是深度思考给你的复利。

所以回到开头那个问题：为什么用 AI 的时候，更要先自己思考？

因为 AI 再强，它也不知道你要解决什么问题最优先、你的团队能维护多复杂的系统、你的产品现在最需要的是速度还是扩展性。这些判断，只能来自你对业务、对自己、对目标的深度理解。

AI 是放大镜，不是眼睛。你自己得先看清楚方向，AI 才能帮你走得更远。

## 四、Plan Mode 不是减速，而是防止注意力失控

很多人把 Plan Mode 理解成「让 AI 先想清楚再动手」。但这个定义漏掉了最关键的一层：它真正在做的事情，是强制你在行动之前，停下来确认——你要去的方向是不是对的。

### 4.1 先确认方向，再进入执行

Plan Mode 的本质是一个「方向校验层」。当你把一个模糊的想法丢给 AI，让它直接生成代码，中间的偏差可能在第三轮、第四轮才会显现。那个时候你已经走了很多弯路，改起来比从零开始还费劲。

而 Plan Mode 要求你在动手前，先用一到两句话描述：「我要解决什么问题？约束条件是什么？预期结果是什么？」这不是减速，这是避免走到错误方向之后再折返。

![](https://iili.io/C9DOmoG.png)
> Plan Mode 注意力锚点机制

![正文图解 8](https://iili.io/C3Ghd57.png)
> 正文图解 8

comment: |
  Plan Mode 在想法与执行之间建立校验层，
  避免模糊目标导致后期大幅返工。
```

### 4.2 即便是 vibe，也要保留深度思考模式

我见过一种很危险的思路：「既然是 vibe-coding，就不需要 plan，直接说想要什么就好。」这种思路把 vibe 当成借口，放弃了深度参与。vibe 应该是「我用自然语言驱动 AI，但我的思考依然在线」——而不是「我不想思考，让 AI 替我想」。

判断一个人是不是真的在做 vibe-coding，不是看他用词随意不随意，而是看他问的「为什么」多不多。一个深度参与 vibe 的人，会在 AI 给出方案后追问：「这个方案在什么规模下会失效？有没有更简单的实现路径？」这些问题不需要技术门槛，需要的是思考意愿。

### 4.3 好的 AI 工作流应该让人更清醒，而不是更焦虑

最后说一个判断标准：你的 AI 工作流，是在让你更清醒，还是在制造新的焦虑？

更清醒的工作流有这几个特征：你在写 prompt 之前知道自己要什么；你拿到 AI 的输出后能快速判断它有没有偏离你的意图；你每次调优都有一个明确的目标，而不是「试试这个参数看看效果」。

更焦虑的工作流则相反：你总是觉得差一点就能跑通，但每次改完又出新的问题；你不知道当前的方案在什么场景下会崩；你花了很多时间调参，但调完之后又忘了为什么要调。



![](https://iili.io/BJFIK3x.png)
> 注意力锚点 vs 注意力漂移



## 五、结尾：AI 时代真正稀缺的，是能持续思考的人

写了这么多，我越来越相信一件事：AI 会放大你的思维方式，而不是改善它。

如果你习惯了浅层 prompt，AI 会让这种浅层变得更快、更大规模，最终你的判断力会系统性退化。如果你习惯于拿到代码就执行，AI 会让这种执行变得更顺滑，但你对代码的理解会越来越浅。最终，你不是在和 AI 协作，而是在被 AI 推着走。

真正能区分人的，不是用了多先进的 AI 工具，而是你愿不愿意在每次动手之前，先停下来想一想：这个目标到底是什么？边界在哪里？有没有更好的路径？

这种思考本身不花时间，但它会决定你接下来所有的效率。AI 时代真正稀缺的，从来不是会用 AI 的人，而是能持续保持深度思考的人。

保持这种思考，别让它退化。

## 参考文献
1. Vibe Coding Prompt Engineering: The Ultimate Guide (2026) - https://vibecoding.app/blog/vibe-coding-prompt-engineering
2. Agentic AI Prompting: Best Practices for Smarter Vibe Coding - https://ranthebuilder.medium.com/agentic-ai-prompting-best-practices-for-smarter-vibe-coding-a73ac2b290b5
3. Vibe Coding: The Theory and Practice of High-Fidelity AI Prompt Engineering - https://languageandthought.com/2026/03/04/vibe-coding-the-theory-and-practice-of-high-fidelity-ai-prompt-engineering/
4. Vibe Coding Explained: Platforms, Prompts & Best Practices - https://www.clarifai.com/blog/vibe-coding-explained
5. Forbes: Vibe Coding Gains Traction Via Users Writing Prompts That Spur AI To Automatically Generate Usable Software Code - https://www.forbes.com/sites/lanceeliot/2025/09/18/vibe-coding-gains-traction-via-users-writing-prompts-that-spur-ai-to-automatically-generate-usable-software-code/

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
