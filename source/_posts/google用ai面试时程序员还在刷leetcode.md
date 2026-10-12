---
title: "Google用AI面试时，程序员还在刷LeetCode？"
date: "2026-10-12 10:00:01"
updated: "2026-10-12 10:09:22"
permalink: "posts/2026/10/12/google用ai面试时程序员还在刷leetcode/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/12/google用ai面试时程序员还在刷leetcode/"
article_id: "9bada58c-1492-4e88-931f-7678df3cbc57"
description: "Google今年5月试点用Code Comprehension轮次替代传统编码面试，允许候选人在CoderPad中调用Gemini AI。与此同时，Databricks工程师Yuchen Jin公开质疑LeetCode模式：当3B参数模型都能秒杀算法题时，企业还在考察记忆力的做法正在被淘汰。"
cover: "/var/lib/aimagician/artifacts/covers/9bada58c-1492-4e88-931f-7678df3cbc57/1267b5f2-8822-497a-baf8-f631df69070b/cover.png"
imgTop: false
---

2026年5月，一位候选人走进Google面试室，接到的是60分钟多文件代码阅读任务——旁边坐着能随时调用Gemini的AI助手。

## 一、一道让LeetCode信徒沉默的面试题

### Google新面试长什么样：读代码、找Bug、调AI

Google 2026年5月启动试点，用 Code Comprehension 轮次替换传统编码面试环节，面向 L3 和 L4 软件工程师岗位，覆盖部分美国团队。

面试形式是60分钟，候选人在 CoderPad 里拿到一个不熟悉的多文件代码仓库，语言可能是 C++、Java 或 Go。题目不给算法提示，不要求手写二叉树反转，而是要求完成三件事：找到代码里的 bug，提出改进方案，和设计面试官讨论架构取舍。

允许调用 Gemini。这意味着候选人可以问 AI「这个函数为什么抛出这个异常」「这段代码的性能瓶颈可能在哪里」，而不是被要求凭记忆写出最优解。



![程序员系列表情：你别急，等我剪完这个头发再修Bug](https://iili.io/CumEMP9.png)
> Agent 运行时过载



Google 的逻辑很直接：真实工程场景里，开发人员大部分时间在理解别人的代码，而不是从零发明算法。面试应该反映这个现实。

Databricks 工程师 Yuchen Jin 在 X 平台公开质疑 LeetCode 模式。他的核心论点很简单：LeetCode 主要考察记忆力，而 AI 时代，即使是 3B 参数的小模型也能比人类更快解完这些题。企业继续用这种模式筛选人，是在考察已无价值的技能。

更狠的是，他引用了 Google 自己拒绝 Homebrew 作者 Max Howell 的例子：「你们 90% 的工程师都在用我写的软件，但你不会反转二叉树，所以滚蛋。」

这句话讽刺意味拉满。AI 面试不是噱头，是行业对算法题面试失效的承认。

### 候选人实测：60分钟对抗万字多文件仓库

有候选人分享了体验。多文件仓库规模约一万行，涉及配置、工具函数、业务逻辑多个模块。任务不是写新代码，而是读懂、定位问题、提出改进。

时间压力很大。60分钟内要完成代码阅读、问题定位、方案设计、与面试官讨论。Gemini 能帮忙解释代码，但候选人的核心能力体现在：能否快速建立代码地图、能否判断优先级、能否清晰表达问题。

一位候选人描述：「以前刷 LeetCode，目标是写出最优解。现在要读懂别人的烂代码，找出问题，并用 AI 辅助验证猜想。」

这本质上是工程能力的重构。不是会不会写代码，而是会不会看代码、会不会问问题、会不会用工具。



![Code Comprehension 面试流程](https://iili.io/nVNLVhN.png)
> Code Comprehension 面试流程


这种变化背后是 AI 改变了编程的工作方式。当 AI 能帮你写代码、查文档、解释逻辑，面试考察的重点自然从「能不能写」转向「能不能判断」。

## 二、Yuchen Jin为什么炮轰LeetCode

### AI时代，背诵算法模式已成原罪

Yuchen Jin在X平台上发过一条被转发了不少的内容：「AI会在编程领域率先被攻克，因为代码输出可以被单元测试验证——但对的地方，不一定是好的地方。」

这句话里有两层意思。第一层说的是事实判断：编程是唯一一个产出物可以被机器自动验证的领域。写出来的代码跑不跑通，一跑就知道。第二层说的是价值判断：能写出「对」的代码是一回事，能写出「好」的代码是另一回事。后者需要的不是算法记忆，而是对现有代码的理解能力。



![程序员 reaction：看来有必要去你家拍一集了](https://iili.io/CAlSlbp.png)
> 背诵算法模式还能走多远



LeetCode刷题的本质是模式匹配。二叉树遍历、滑动窗口、动态规划——每个题型都有固定套路。过去这套筛选机制至少保证了候选人的基础算法能力，但在AI已经能秒解这些题目的时代，考察点必须重新校准。

### Databricks工程师的3B模型测试实验

Yuchen Jin的实际测试提供了一个量化的参照点。他让一个只有3B参数的开源模型去刷LeetCode典型题目，结果显示模型在很多中等难度的算法题上表现稳定。这意味着，一个普通工程师在面试中引以为傲的「我一周刷了50道LeetCode」，在AI面前已经不具备区分度。

更重要的是，Jin在另一条推文中提到了一个经典的案例：Google曾拒绝Homebrew创始人Max Howell的工程师申请，理由是「你不能在白板上手写二叉树反转」。这条推文后来被大量引用，因为它揭示了一个荒谬的事实——一个创造了被90%工程师使用的工具的开发者，会因为一个基础算法题而被淘汰。

当3B模型能在你刷力扣前解完题，面试官考察的只能是你能不能看懂别人写的屎山。这不是夸张，而是Google新面试轮次的设计逻辑。

## 三、Google的Code Comprehension到底在考什么

### 从「写出答案」到「读懂代码」

Google在2026年5月试点的Code Comprehension轮次，考察的是候选人在多文件代码仓库中的理解能力。候选人在CoderPad中面对的是一个不熟悉的代码库，任务是找出bug、提出改进建议、讨论设计决策——并且可以使用Gemini AI作为辅助。



![程序员 reaction：写代码没见这么积极](https://iili.io/CumwFkX.png)
> 代码阅读比写代码更考验耐心



这种设计的核心转变在于评估重心的迁移。传统编码面试问的是「能不能写出正确的算法」，Code Comprehension问的是「能不能理解一段已经存在的代码」。后者更接近日常工作的真实状态。工程师入职后面对的从来不是一个空白的文件，而是一个需要阅读、理解和改进的既有系统。

Databricks内部的技术面试也在向类似方向演进。根据公开的招聘反馈，越来越多的团队开始在面试中加入代码阅读和缺陷定位环节，以替代纯算法题。这不是Google独有趋势，而是整个行业在AI能力提升背景下的被动调整。

### 多文件仓库里的真实战场

Code Comprehension的难度不在单个函数，而在跨文件的依赖关系。候选人需要理解模块之间的调用链、数据流向、异常处理逻辑。这才是真实工程中工程师每天花费的时间——阅读代码、理解上下文、判断修改的影响面。

Jin在LinkedIn上讨论这段观点时，有另一个关键补充：「AI能写的代码是结构良好的代码，但现实中的代码库是由无数人接力维护的产物。」这意味着，未来的面试不再考察你「能写出什么」，而是考察你「能理解什么」。



![程序员 reaction：暗中观察](https://iili.io/CCZOWwF.png)
> 读懂代码是工程师的核心能力



这一转变对候选人的直接影响是准备方式的改变。背诵算法模板的价值在下降，阅读开源项目、参与代码评审、理解大型代码库的能力价值在上升。这也是为什么一些正在准备新面试模式的团队开始强调「代码品味」而非「解题速度」。

## 四、面试题变了，准备方式也得变

### LeetCode还有价值吗

说LeetCode没有价值是错的。它在考察基础算法思维和边界条件处理能力上仍然有效。问题在于：当AI已经能完成这些任务时，面试官考察的重点必须转移。

更准确地说，LeetCode的价值在于训练思维严谨性，但面试的核心应该是评估工程判断力。这两者不冲突，只是权重不同。对于初级工程师，算法基础仍值得关注；对于需要独立负责的岗位，代码理解能力更重要。

### 新面试模式下的可执行建议

面对Code Comprehension这类新面试形式，候选人可以尝试以下准备方向：

- 找一个中等规模的开源项目，通读其核心模块的代码结构。
- 练习在代码中找到潜在bug和边界case。
- 尝试用自然语言描述一段代码的设计意图和数据流向。
- 理解常见的设计模式在实际代码库中的体现方式。



![搬砖系列表情：见鬼，难道这帮人都不用搬砖的吗](https://iili.io/CUyWCes.png)
> 刷题不如读代码



更重要的是，候选人需要重新定义「准备好了」的标准。不再是「刷了多少道题」，而是「能否在陌生代码库中快速定位关键逻辑」。这是工程师日常工作的真实状态，也是新面试模式想要筛选的能力。

## 五、这场变革的边界在哪里

### 算法题不会一夜消失

Code Comprehension是趋势，但不是唯一标准。很多团队仍在混合使用算法题和代码阅读题，原因包括：算法题便于规模化筛选、代码阅读题评分主观性更高、不同岗位对能力的侧重点不同。

Jin的批评针对的是「只用算法题筛选工程师」这一极端做法。行业不会完全取消算法面试，但权重正在重新分配。那些坚持只用LeetCode作为唯一筛选标准的公司，可能会在未来面临人才流失——不是因为公司不够好，而是因为人才流向更贴近真实工作的评估方式。

### 面试官和候选人的共同选择

这场变革的最终受益者是那些真正热爱工程的人。算法记忆只是入门门槛，代码理解和工程判断才是长期的竞争力。当面试不再考察背诵能力，而是考察理解能力，候选人的准备方向自然会跟着调整。

坦白讲，如果还在每天花8小时刷LeetCode而不读任何开源项目，你的准备策略已经跑偏了。算法题可以作为思维训练，但不应该成为面试准备的唯一重心。真正的区别是：算法题是封闭问题，有标准答案；代码理解是开放问题，考察的是判断力和工程品味。

这不是终点，而是工程师职业能力的重新定义——从「写出正确答案」到「理解复杂系统」。

对于候选人来说，下一步很具体：找一个代码质量较好的开源项目，花一周时间通读核心模块，尝试写出它的架构说明文档。这比再做十道LeetCode Hard更接近真实工作的能力要求。

## 参考文献
1. Google's New Code Comprehension Interview Round: https://www.finalroundai.com/blog/google-code-comprehension-interview
2. Yuchen Jin on X: https://x.com/Yuchenj_UW/status/2074543329665233236
3. Yuchen Jin on LeetCode and AI: https://x.com/Yuchenj_UW/status/1895167922819211563
4. Google-Style Code Comprehension Interviews: https://medium.com/@weissmann.tobi/google-style-code-comprehension-interviews-why-leetcode-alone-may-not-be-enough-in-2026-3d7d8b04255e
5. Yuchen Jin on LinkedIn: https://www.linkedin.com/posts/itamarf_yuchen-jin-said-something-this-week-that-activity-7463207312132861952-mCPn
3. Google-Style Code Comprehension Interviews: https://medium.com/@weissmann.tobi/google-style-code-comprehension-interviews-why-leetcode-alone-may-not-be-enough-in-2026-3d7d8b04255e
4. Yuchen Jin on LeetCode and AI: https://x.com/Yuchenj_UW/status/1895167922819211563
5. Yuchen Jin on Claude Code Computer Use: https://x.com/Yuchenj_UW/status/2038671697923223999

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
