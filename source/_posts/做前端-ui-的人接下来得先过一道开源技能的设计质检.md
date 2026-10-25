---
title: "做前端 UI 的人，接下来得先过一道开源技能的\"设计质检\""
date: "2026-10-25 11:00:02"
updated: "2026-10-25 11:15:26"
permalink: "posts/2026/10/25/做前端-ui-的人接下来得先过一道开源技能的设计质检/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/25/做前端-ui-的人接下来得先过一道开源技能的设计质检/"
article_id: "30473246-3591-453e-9931-2ff03798f148"
description: "Perplexity 上线了开源技能 /impeccable，把设计走查拆成布局、字体、对比度、无障碍四项自动检查，每用户 5000 credits 免费额度（10月31日前）。真正值得看的不是免费额度本身，而是设计审查这件事从人工串行流程变成了 Agent 可并行的架构选择，三条路径的分界点在哪。"
cover: "/var/lib/aimagician/artifacts/covers/30473246-3591-453e-9931-2ff03798f148/ffc1a24d-8dee-456a-be9f-9af35ee257b8/cover.png"
imgTop: false
---

## 业务目标：让 AI 生成的界面不"一眼假"

Perplexity CEO Aravind Srinivas 宣布 @pbakaus 开发的开源技能 /impeccable 现已进入 Computer 的技能市…

### 当前卡点：生成快、验收慢，走查成了人工串行瓶颈

生成端已经卷到按秒计了。Cursor、v0、Bolt 能在十秒内吐出一套带布局、配色、间距的 React 组件。卡住交付的地方在验收环节。设计走查在传统流程里是纯串行的：一位设计师逐屏对照设计规范，检查布局对齐、字体层级、对比度是否满足 WCAG 2.1 的 AA 阈值、aria 属性有没有漏。一个中型页面，人工走查通常 1.5 到 3 小时，结果还取决于走查人当天的状态。十分钟的产出，两小时的排班。



![传统设计走查的串行瓶颈](https://iili.io/nkAKiX4.png)
> 传统设计走查的串行瓶颈



Perplexity 对 /impeccable 的官方描述是「reviews an interface and fixes what a designer would flag. It checks layout, type, contrast and accessibility」。10 月 31 日前每用户 5000 credits 免费额度，数字本身不构成新闻。Perplexity Computer 的技能市场此前已挂着 40 多个内置技能，社区又合并出 12 个覆盖财务、法务、产品等垂类的开源技能包。真正值得拆的是架构判断：当走查从串行人工流程变成 Agent 可并行的子任务，分界点落在哪。

## 方案 A：设计师人工走查（传统路径）

### 流程：截图 → 逐像素检查 → 标注 → 修改 → 再截图

传统路径里，一个前端组件从生成到交付，要过的手是固定的。开发者完成页面后，设计师截一张图，对着 Figma 设计稿逐区域比对：间距是否 8px 倍数、字号阶是否对齐 typographic scale、对比度有没有过 WCAG AA 的 4.5:1、焦点态和读屏顺序对不对。每发现一处偏差，标注在 Figma 评论区或 Slack 线程里，开发者改完再截一张，循环到「没有再挑了」。

一轮走查的时间取决于页面复杂度。一个中等复杂度的表单页，从截图到修完通常 2 到 3 轮，每轮间隔取决于开发者和设计师的排期。业内常见做法是把走查排进 sprint 最后一两天，它天然落在迭代尾部，赶不上就顺延。



![程序员反应图：不要重构去复制](https://iili.io/CuzarVj.png)
> 走查永远排在 sprint 尾巴



### 瓶颈：串行、依赖人、标准不统一、不可并行

问题不在「有人走查」这件事本身，而在它的结构。

整条链路是串行的。截图、看、标注、改、再截图，每一步依赖上一步的产出。设计师不在工位，链路就停。两个设计师各自看同一个页面，对「间距该 12 还是 16」的判断可能不同，因为设计系统文档写的是 12，但实际项目里为了适配某个组件库改成了 16，文档没跟上。

更关键的是不可并行。你不能把「检查所有间距」拆给三个人同时做，因为间距判断需要上下文：这个 margin 相对于哪个父容器、这个 padding 是否被全局 design token 覆盖。上下文必须装在一个人脑子里，走查天然是单线程的。



![传统设计走查串行链路](https://iili.io/nkAKm7e.png)
> 传统设计走查串行链路



当生成侧把「做一个页面」压到几十秒，验收侧仍按小时计，瓶颈就从生产转移到了检验。/impeccable 把布局、字体、对比度、无障碍拆成可并行的子任务，改的是这条链路的拓扑结构，不是多了一个免费额度。

## 方案 B：/impeccable 技能（纯 Agent 路径）

### 机制：4 个检查维度拆为并行子任务，Computer 自动调度

/impeccable 把一次设计走查拆成四个并行子任务，分别是布局（间距、栅格对齐）、字体（字重、层级、行高）、对比度（WCAG AA/AAA 阈值校验）、无障碍（ARIA 标签、焦点顺序）。Computer 收到界面代码或截图后，将四项分发为子 Agent 同时执行，汇总后输出一份带修复建议的报告。开发者不需要排队等设计师看完截图再标注，四项检查在同一轮 compute 里跑完。

设计走查从串行的人工流程变成并行的 Agent 子任务，这才是架构层面的变化，不是多了一个免费额度。



![/impeccable 并行检查调度](https://iili.io/nkAfCkg.png)
> /impeccable 并行检查调度



### 边界：检查的是「设计师会 flag 的问题」，不做创意判断

它不生成界面，它告诉你你的界面哪里像 AI 垃圾。但「像 AI 垃圾」被收窄到可量化区间，对比度低于 4.5:1、字号层级缺失、缺少 aria-label。它不会告诉你「这个首页的情感基调不对」或「信息架构让用户三秒内迷路」。它是 linter，不是 critic。

在需要判断视觉节奏、品牌一致性或叙事逻辑的场景，设计师仍是终审环节。/impeccable 覆盖的是「能不能上线」的最低线，不覆盖「该不该这样设计」的判断线。

### 5000 credits 额度的技术含义与时间窗口

Perplexity Max 订阅每月约含 10 000 credits，Pro 约含 4 000。5 000 的量级接近 Pro 一个月的 Computer 用量，足以跑十到二十次完整的 /impeccable 走查。10 月 31 日截止后，该技能回归正常 credit 计费。这是一个测试窗口，趁免费期把 /impeccable 接进 CI 流程，验证误报率和团队能接受的修复成本，再决定 11 月起是否纳入常规预算。

## 方案 C：人机混合（AI 初筛 + 人工终审）

/impeccable 检查的是「设计师会 flag 的问题」，layout、type、contrast、accessibility 四项并行跑完即出报告。四项全绿不碰人工队列；任何一项不过，结构化报告（维度、元素、具体违规点）推入人工 triage。人的工作从逐像素过全部页面，收缩为只看被 flag 的异常项。

### 分界点：/impeccable 过不了才进人工队列

路由规则是硬的：四门全过即 auto-approve，没有灰度地带。5000 credits 在 10 月 31 日前意味着每个 PR 都能跑一次全量检查；过了这个窗口，Max 订阅每月 4000 bonus credits 的池子决定了你不可能对每次 commit 都跑。经济学一变，「每次提交都跑」退化为「release candidate 才跑」，混合架构的分界线也跟着后移。

### 适用场景：品牌一致性、创意方向仍需人拍板

它检查的是已知模式违规，不是「这个新 dashboard 该用 8px 还是 16px 间距」。品牌调性、信息架构取舍、创意方向不在四项维度里，仍是设计 lead 的拍板权。/impeccable 把 80% 的机械劳动并行化，剩下 20% 的审美判断还挂在人身上。

## 选型决策表：三条路径的适用边界

### 审查频次 × 团队规模 × 验收标准是否可量化

| 维度 | 方案 A 人工走查 | 方案 B /impeccable | 方案 C 混合 |
|------|----------------|--------------------|------------|
| 触发频次 | 里程碑 / 季度 | 每个 PR、每次生成后 | CI 管线触发 |
| 团队配置 | ≥2 名专职设计师 | 0 设计师，≥1 前端 | 1 设计师 + N 前端 |
| 验收标准 | 主观判断 + 品牌调性 | 可量化（对比度 ≥ 4.5:1、间距网格、WCAG 2.1） | 量化项走 Agent，主观项走人工 |
| 并行度 | 串行，依赖单点 | 4 维度并行子任务 | 人工队列只接未过项 |
| 单轮耗时 | 2–4 小时 | < 30 秒 | 人工环节压到 30 分钟以内 |

一句话判断：验收标准可量化、团队无专职设计师、审查频次高于每周两次，默认走 B。一旦涉及品牌色彩体系或创意方向拍板，切 C，分界条件沿前文所述：Agent 未标红的页不进队列，标红的才推给设计师。

## 系统架构对比（Mermaid 图）

### 三条路径的数据流与调度差异



![三条设计走查路径的数据流与调度差异](https://iili.io/nkAf43P.png)
> 三条设计走查路径的数据流与调度差异



从调度视角看，A 的关键约束是 Fix 回环——改完必须重新截图再走一遍，串行深度随问题数线性增长。B 把回环拆成四个独立子任务，彼此无依赖，调度器一次分发、汇总收口。C 在 B 的基础上多了一条人工支路，但这条支路的输入被 Agent 预过滤过，设计师看到的只是标红页，不是全量截图。

可今天就做的两件事：一，在仓库 CI 里加一条 /impeccable 触发规则，MR 含 UI 变更时自动跑四项检查，把 5000 credits 的窗口期吃满；二，建一个「未通过项」Figma 看板，只放 Agent 标红的页面给设计师，把串行那段从流程里拿掉，省出来的时间去做 Agent 做不了的创意判断。

## 参考文献
- [Aravind Srinivas on X：/impeccable 上线公告](https://x.com/AravSrinivas/status/2114021917586014449)
- [Perplexity Computer 技能使用指南（Academy）](https://www.perplexity.ai/zh-TW/hub/academy/how-to-use-computer-skills)
- [How to use Computer Skills（Help Center）](https://www.perplexity.ai/help-center/en/articles/13914413-how-to-use-computer-skills)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
