---
title: "Anthropic 发布 Claude Ship：PR 审查、修复与批准交给 Claude"
date: "2026-11-24 05:04:06"
updated: "2026-11-24 05:38:07"
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

代码写完之后，等待审查的时间往往长于写代码本身。工程师在审查意见回来之前，很难把下一个功能做完整；审查、修复、再审查的往返，把发布周期拉得越来越长。Claude Ship 把这段往返整个接走：审查自动发生，修复自动尝试，批准按策略自动放行，人只在关键点介入。

几天前，Anthropic 发布了 Claude Ship（beta），试图把这个瓶颈一次性打通。一条 `/ship` 命令，Claude 会推送变更、打开 PR、审查改动本身，然后处理反馈和失败的检查，直到 PR 达到可合并状态。真正的关键不是单次审查，而是整个循环被自动化接管。

Claude Ship 由三部分构成：Code Review 已稳定可用，PR Steward 和 Claude Approvals 目前处于 beta。前者负责自动处理 CI 失败和审查意见，后者根据团队配置的风险分级，决定一个 PR 需要几个人批准才能合入主干。



![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> PR 不再卡在人工审批队列



## 第二幕：三层审查的自动与人工边界

审查一个问题，可以拆成三层。最底层是代码风格和整洁度；中间一层是假设方向正确，代码写得对不对、安不安全；最上层是这个功能该不该做、方向对不对。

Claude Ship 的审查智能体擅长中间那层。它的做法是派遣多个专业化 Agent 同时扫描同一个 diff，各自负责不同维度——安全漏洞、逻辑缺陷、风格不一致——结果汇总到一个聚合器。聚合器做交叉验证，同一个问题被多个 Agent 独立发现才会进入最终列表，这是压低误报率的核心机制。

它不会越界拦下你明确要做的事。这是刻意的设计：防止有人借自动化之名往代码库里塞恶意改动，仍然要靠团队自己的权限控制把关。

安全审查被赋予阻断权限。只要 Bug 审查或安全审查里存在未关闭的意见，PR 就无法合并。新提交修复对应问题后，审查项会自动解除。团队可以用开源的安全审查 GitHub Action 或 `/security-review` 命令搭建同样的机制。

修复环节同样自动化。PR Steward 把写 PR 的 Claude Code 会话上传到云端，获得完整上下文后自行处理 CI 失败和审查评论：推送触发审查，意见落到 PR 上，Steward 定时巡检，识别待处理项，调用 Claude 修复，重新跑检查，循环直到没有新意见或达到轮次上限。工程师写完 PR 去开会或下班，第二天早上打开 PR，意见已经处理过一轮，CI 也变绿了，剩下的留给人工判断。Steward 的巡检就是整条流水线的节拍：意见多时快速修复、重跑检查；意见清零后停止调用，轮次上限兜底，防止个别问题在自动循环里打转。

批准策略按风险分级，且可配置。团队可以按文件路径、变更类型、作者资历、时间窗口设定规则：有明显单测覆盖的 bug 修复，CI 通过且无阻断项即可 0 人批准；中等风险需要 1 人；高风险或涉及核心路径的变更需要 2 人以上，且审批人必须是被授权的成员。策略配在仓库上，由管理员逐个仓库开启，开发者不需要手动调用 `/ship`。



![程序员 reaction：暗中观察](https://iili.io/CCZOWwF.png)
> 90%+ 的 PR 三轮内收敛





![Claude Ship 工作流](https://iili.io/ofIHuoP.png)
> Claude Ship 工作流



## 第三幕：内部数据与可复制的评测集

Anthropic 内部已经用这套机制跑了一段时间，数据可以直接对照。90% 以上的 PR 在三轮审查-修复内收敛；大型 PR（变更超过 1,000 行）中，84% 会被标记问题，平均每个 PR 发现 7.5 个问题，误报率低于 1%。还有一组对比：引入自动化审查之前，16% 的 PR 会收到实质性审查意见，之后提升到 54%。

这些数字来自他们自己的代码库，套用到其他项目时要保持谨慎。防线的逻辑来自瑞士奶酪模型：每层都有漏洞，叠加之后才能拦住大多数问题。Anthropic 内部的六层包括 Lint 规范、类型检查、全平台测试套件、构建编译、安全审查、人工 Approvals，任何一层有未关闭的意见，PR 就无法合并。回滚是硬约束：PR 模板要求阐述变更如何测试、如何回滚，提出变更的人对其真实性负责。

还有一个容易被忽略的循环：Claude 写的代码由 Claude 审查，审查出的问题再由 Claude 修复。Anthropic 把这称作递归自改进——机器读机器的代码，反馈周期比同事 Review 短得多，代码库越大，这个循环的价值越明显。

可复制的思路是先建一套评测集。大多数公司都有事故追踪系统，让 Claude 从中提取被认定引发事故的 PR 编号，整理成结构化格式，几天就能完成。之后拿它比较不同审查产品的效果，调教审查规则；每个新工具、每条新规则上线前，都用同一套数据回归一遍，误报率有没有变好，数据直接给答案。有了自己的评测数据，才敢放心地撤掉人工检查。



![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> PR 不再卡在人工审批队列



## 第四幕：普通团队的落地路径与代价

Claude Ship 对 Team 和 Enterprise 订阅开放，企业用户可以申请 $10,000 以上的 credits。Code Review 按 PR 计费，每条 15 到 25 美元，取决于变更的大小和复杂程度。

高吞吐量团队面临的选择很现实：如果每月处理几百个 PR，这笔费用会迅速累积。但反过来看，如果人工审查是瓶颈，释放出来的时间可能更值钱。落地可以分三步：先在非关键分支试点，用事故历史验证误报率是否可接受；再逐步扩大到所有 PR；最后才考虑撤掉部分人工审查环节，这一步需要足够的评测数据支撑，不要提前做。

适合的场景其实很具体：CI 跑一轮要几十分钟、审查队列常年堆积、新人和核心成员都要过同一张表的团队。这类团队把最贵的等待时间交给了机器，人只处理机器标记出来、且自己愿意负责的部分。对已经在用 Claude Code 写代码的团队，接入成本最低：开发者在自己的 PR 上跑 /ship 就能体验完整流程；管理员则按仓库逐个开启，把审批策略配好再逐步放量。

需要盯住的边界有两条。一是权限：/ship 最终能合并什么，取决于开发者自己的权限和仓库的分支规则，工具不会替人越权。二是回滚：自动修复不是免检的，每个变更都要答得上来如何测试、如何回滚，答不上来的部分留在人工环节。

在 CI 延迟长、审查队列堆积的团队里，Claude Ship 能显著缩短 cycle time；在变更频率低、团队成员彼此熟悉的小团队里，投入产出比需要重新算账。

Claude Ship 把审查循环从人手上移到了机器上，但最上层的方向判断、安全红线和最终合并决策，仍然需要人。工具解决的是效率，不是责任。

## 参考文献
- Introducing Claude Ship | Claude by Anthropic: https://claude.com/ja/resources/articles/introducing-claude-ship
- Claude Code 团队是如何进行代码审查的: https://zhuanlan.zhihu.com/p/2094744073735352876
- Solving Code Review at Anthropic: https://claude.dev/blog/solving-code-review-at-anthropic/
- When AI Builds Itself (Recursive Self-Improvement): https://www.anthropic.com/institute/recursive-self-improvement
- Claude Code Review 定价与技术细节: https://www.bighatgroup.com/zh-tw/blog/claude-code-review-anthropic-multi-agent-github-pr-analysis

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
