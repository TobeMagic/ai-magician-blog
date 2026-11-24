---
title: "Anthropic 发布 Claude Ship：PR 审查、修复与批准交给 Claude"
date: "2026-11-24 05:04:06"
updated: "2026-11-24 05:25:53"
permalink: "posts/2026/11/24/anthropic-发布-claude-shippr-审查修复与批准交给-claude/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/24/anthropic-发布-claude-shippr-审查修复与批准交给-claude/"
article_id: "99f941c2-d545-49e1-b74b-06347516ccf8"
description: "Anthropic Claude Code 团队发布 Claude Ship（beta）：一条 /ship 命令让 Claude 接手 PR 的审查、修复与批准。PR Steward 自动处理 CI 失败与审查意见，Claude Approvals 按团队策略的风险分级决定几人批准。内部实践：90%+ 的 PR 在三轮审查-修复内收敛，大型 PR 84% 被标记、误报率 <1%。Team/Enterprise 订阅可用，企业可领 $10,000+ credits。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/41ba34a7-d1bd-4098-a1fa-76056b714d9f.png"
imgTop: false
---

PR 的审查队列，现在由 Claude 接管，从审查到批准一步完成。

## 第一幕：PR 的瓶颈从写代码转移到等审查

Claude Code 团队的代码大部分由 Claude 自己写，这没问题。问题出在 PR 之后的环节——审查、修复、批准，这些仍然是人的工作。

几天前，Anthropic 发布了 Claude Ship（beta），试图把这个瓶颈一次性打通。一条 `/ship` 命令，Claude 会推送变更、打开 PR、审查改动本身，然后处理反馈和失败的检查，直到 PR 达到可合并状态。真正的关键不是单次审查，而是整个循环被自动化接管。

Claude Ship 由三部分构成：Code Review 已稳定可用，PR Steward 和 Claude Approvals 目前处于 beta。前者负责自动处理 CI 失败和审查意见，后者根据团队配置的风险分级，决定一个 PR 需要几个人批准才能合入主干。



![程序员系列表情：你别急，等我剪完这个头发再修Bug](https://iili.io/CumEMP9.png)
> PR 不再卡在人工审批队列



## 第二幕：三层审查的自动与人工边界

审查一个问题，可以拆成三层。最底层是代码风格和整洁度；中间一层是假设方向正确，代码写得对不对、安不安全；最上层是这个功能该不该做、方向对不对。

Claude Ship 的审查智能体，擅长中间那层。它会发现 bug、指出安全隐患、标注需要补充测试的场景，但不会越界拦下你明确要做的事。这是刻意的设计——防止有人借自动化之名往代码库里塞恶意改动，仍然要靠团队自己把关。

安全审查被赋予阻断权限。只要 Bug 审查或安全审查里存在未关闭的意见，PR 就无法合并。新提交修复对应问题后，审查项会自动解除。团队可以用开源的安全审查 GitHub Action 或 `/security-review` 命令搭建同样的机制。

``mermaid


![Claude Ship 工作流](https://iili.io/ofIHuoP.png)
> Claude Ship 工作流



## 第三幕：内部数据与可复制的评测集

Anthropic 内部已经用这套机制跑了一段时间。他们的数据：90% 以上的 PR 在三轮审查-修复内收敛。大型 PR（变更超过 1,000 行）中，84% 会被标记问题，平均每个 PR 发现 7.5 个问题，误报率低于 1%。

这些数字来自他们自己的代码库，直接套用到其他项目时需要保持谨慎。但有一个可复制的思路：先用事故记录建一套评测集。

大多数公司都有事故追踪系统，Claude 可以从里面提取被认定引发事故的 PR 编号，整理成结构化格式，几天就能完成。之后可以拿它比较不同审查产品的效果，也可以用来调审查规则。有了自己的评测数据，才敢放心地撤掉人工检查——凭感觉选工具，翻车概率更高。



![程序员 reaction：你被我盯上了](https://iili.io/CCZOwMJ.png)
> 90%+ 的 PR 三轮内收敛



## 第四幕：普通团队的落地路径与代价

Claude Ship 对 Team 和 Enterprise 订阅开放，企业用户可以申请 $10,000 以上的 credits。每条 PR 的审查成本大约在 15 到 25 美元之间，取决于变更的大小和复杂程度。

高吞吐量团队面临的选择很现实：如果每月处理几百个 PR，这笔费用会迅速累积。但反过来看，如果人工审查是瓶颈，释放出来的时间可能更值钱。

落地路径可以分三步：先在非关键分支试点，用事故历史验证误报率是否可接受；再逐步扩大到所有 PR；最后考虑是否撤掉部分人工审查环节——这一步需要足够的评测数据支撑，不要提前做。

在 CI 延迟长、审查队列堆积的团队里，Claude Ship 能显著缩短 cycle time。在变更频率低、团队成员彼此熟悉的小团队里，投入产出比需要重新评估。



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> PR 不再卡在人工审批队列



Claude Ship 把审查循环从人手上移到了机器上，但最上层的方向判断、安全红线和最终合并决策，仍然需要人。工具解决的是效率，不是责任。

Claude Ship 不是一个工具，而是一条流水线。Anthropic 把 PR 的生命周期拆成三个组件，每个组件解决一个具体的等待痛点。

## 第二幕：Claude Ship 的三个部件

### Code Review：多 Agent 并行审查 + 验证投票降误报

代码审查部分最早落地，也是唯一已脱离 beta 的部分。它的工作方式是派遣多个专业化 Agent 同时扫描 diff，各自负责不同维度的问题——安全漏洞、逻辑缺陷、风格不一致——然后把结果汇总到一个聚合器。聚合器会做交叉验证，同一问题被多个 Agent 独立发现才会进入最终列表，这是降低误报的核心机制。

Anthropic 的内部数据给出两组数字：大型 PR（变更超过 1,000 行）有 84% 会被标记出至少一个问题，平均每个大型 PR 发现 7.5 个问题；误报率控制在 1% 以下，也就是开发者标记为「不正确」的比例不到 1%[8]。

这组数据里有个值得注意的细节：审查发现的问题里，真正会导致 PR 被阻断的是 Bug 和安全类问题，风格类（nits）和预先存在的问题（pre-existing）是标记但不阻断，开发者可以选是否处理。这种分级让审查不会变成另一种阻塞。

### PR Steward：自动盯 PR，处理 CI 失败与审查意见

审查发现问题之后，修复也要自动化。PR Steward 的设计动机很直接：修复如果还要等人醒着、有空，提速就无从谈起[3]。

它的做法是把 Claude Code 会话上传到云端，让工具获得完整上下文后自行处理 CI 失败和审查评论。流程是：PR 推送后触发审查→审查意见落到 PR 上→Steward 定时巡检→识别待处理意见→调用 Claude 修复→重新跑检查→循环直到无新意见或达到轮次上限。

Anthropic 内部的实践是，工程师写完 PR 后去开会或下班，第二天早上打开 PR，审查意见已经处理过一轮，CI 状态已经是绿色。不是所有问题都被修复，但该修的已经修完，剩下的留给人工判断。

### Claude Approvals：按风险分级决定 0/1/2+ 人批准

审批环节是 Claude Ship 最靠近团队治理的部分。Approvals 不是简单的「AI 代替人点头」，而是根据预设的风险策略决定需要几人批准、哪些人必须参与。

低风险的变更——比如修复一个有明显单测覆盖的 bug——可能 0 人人工批准，CI 通过且审查无阻断项即可合并。中等风险需要 1 人。高风险或涉及核心路径的变更需要 2 人或更多，且审批人必须是团队里被授权的人。

这个机制的关键在于策略可配置。团队可以按文件路径、变更类型、作者资历、时间窗口等不同维度设定规则。Anthropic 自己的做法是把安全审查设为强制阻断项：只要 Bug 审查或安全审查中存在未关闭的意见，PR 就绝对无法合并[4]。

## 二、Claude Ship 的三个部件

## 三、Anthropic 内部的六层防线

## 四、团队怎么用起来

## 参考文献",
  "body_markdown": "

Anthropic Claude Code 团队在 2026 年 11 月 23 日发布 Claude Ship beta，一条 /ship 命令让开发者把 PR 的审查、修复与批准全流程交给 Claude。这不是一个单点工具，而是一套流水线：Code Review 负责找问题，PR Steward 负责盯 CI 和处理审查意见，Claude Approvals 负责按风险分级决定谁来批准。



![程序员 reaction：挺秃然的](https://iili.io/CIsFXP1.png)
> PR 终于不用等人醒着才看



Code Review 部分已在 2026 年 3 月上线研究预览，采用多 Agent 并行审查架构。每个 PR 打开时，Claude 会派遣多个专业 Agent 同时扫描变更，再由聚合器交叉验证并排序发现。Anthropic 内部数据显示，84% 的大型 PR（超过 1,000 行）会被标记问题，误报率控制在 1% 以下，工程师认同率接近 100%。

更关键的是修复闭环。PR Steward 会在 CI 失败或收到审查意见时自动处理，不是等人工醒来看，而是让写 PR 的 Claude 会话定时去 GitHub 查反馈。内部有人用 Claude Tag，有人自己写了「盯 PR」技能——理由是修复如果还要等人有空，提速就无从谈起。



![Claude Ship 流水线架构](https://iili.io/ofIHYla.png)
> Claude Ship 流水线架构




![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 大佬点头通过


审查要回答的问题分为三层。最底层是代码风格和整洁程度，中间层是假设方向正确，它写得对不对、安不安全，最上层是这个功能该不该做。自动审查擅长中间层，最上层留给人工。Anthropic 刻意不让审查智能体管得太宽，不会因为它觉得不妥就拦住明确要做的事。防止恶意改动仍要靠团队自己的权限控制。
六层防线的逻辑来自瑞士奶酪模型——每层都有漏洞，叠加之后才能拦住大多数问题。Anthropic 内部的六层包括：Lint 规范、类型检查、全平台测试套件、构建编译、安全审查、人工 Approvals。任何一层有未关闭的意见，PR 就无法合并。回滚红线是硬约束：新提交如果修复了对应问题，审查项自动解除；如果引入了新问题，立即阻断。PR 模板还明确要求阐述变更如何测试以及如何回滚，Claude 可以代填，但提出变更的人必须对其真实性负责。
数据对比很直观。引入自动化审查之前，16% 的 PR 会收到实质性审查意见，之后提升到 54%。大型 PR 平均发现 7.5 个问题。90% 以上的 PR 在三轮审查-修复内收敛。更狠的是，Claude 自己写的代码，Claude 来审——递归自改进的闭环，比请同事 Review 还快。

普通团队怎么落地？Anthropic 的工程师 Clark Lunt 建议先用自家事故记录建评测集。大多数公司有事故追踪系统，让 Claude 从里面提取被认定引发事故的 PR 编号，按格式整理，几天就能完成。然后用这个评测集比较不同审查产品，调教审查规则。自己有底气了，再慢慢撤掉人工检查。
Claude Ship 对 Team 和 Enterprise 订阅用户可用。企业用户可以通过 Anthropic 申请 $10,000+ credits 来试用。Code Review 按 PR 计费，每个 PR 15-25 美元，视大小与复杂度而定。高吞吐量团队需要算一笔账：人工 Review 的时间成本 versus Claude 的调用成本。
核心判断很简单：在 PR 量大、人工审查成为瓶颈的团队，Claude Ship 能显著缩短 cycle time；在变更频率低、人工 Review 压力不大的场景，投入产出比未必划算。评测集是自证可靠的关键——没有它，撤人工就是赌博。

## 参考文献
- Introducing Claude Ship | Claude by Anthropic: https://claude.com/ja/resources/articles/introducing-claude-ship
- Claude Code 团队是如何进行代码审查的: https://zhuanlan.zhihu.com/p/2094744073735352876
- Solving Code Review at Anthropic: https://claude.dev/blog/solving-code-review-at-anthropic/
- When AI Builds Itself (Recursive Self-Improvement): https://www.anthropic.com/institute/recursive-self-improvement
- Claude Code Review 定价与技术细节: https://www.bighatgroup.com/zh-tw/blog/claude-code-review-anthropic-multi-agent-github-pr-analysis
{
  "title": "Anthropic 发布 Claude Ship：PR 审查、修复与批准交给 Claude",
  "summary": "Anthropic Claude Code 团队发布 Claude Ship beta，一条 /ship 命令让 PR 的审查、修复与批准全流程自动化。Code Review 多 Agent 并行降误报，PR Steward 自动盯 CI 和处理审查意见，Claude Approvals 按风险分级决定几人批准。内部数据：16%→54% 实质审查意见，90%+ PR 三轮收敛，大型 PR 84% 被标记、误报率 <1%。Team/Enterprise 可用，企业可领 $10,000+ credits，建议先用事故记录建评测集再撤人工。",
  "opening_hook": "几天前，Anthropic Claude Code 团队发布 Claude Ship beta，一条 /ship 命令让 PR 的审查、修复与批准全流程自动化。",
  "outline_markdown": "## 一、PR 的瓶颈从写代码转移到等审查

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
