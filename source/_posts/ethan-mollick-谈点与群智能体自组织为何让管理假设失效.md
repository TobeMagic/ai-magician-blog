---
title: "Ethan Mollick 谈点与群：智能体自组织为何让管理假设失效"
date: "2026-10-02 05:00:01"
updated: "2026-10-02 05:11:53"
permalink: "posts/2026/10/02/ethan-mollick-谈点与群智能体自组织为何让管理假设失效/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/02/ethan-mollick-谈点与群智能体自组织为何让管理假设失效/"
article_id: "f667de62-bd58-43fe-a222-4d7b5066080c"
description: "Ethan Mollick 承认自己此前认为人类需像经理一样精心设计智能体组织的判断错了，Bitter Lesson 同样适用于组织管理。"
cover: "/var/lib/aimagician/artifacts/covers/f667de62-bd58-43fe-a222-4d7b5066080c/6d0c1f6a-e902-4102-8c89-0f2f65b6ab23/cover.png"
imgTop: false
---

这位沃顿商学院副教授在多篇公开论述中反复修正自己的判断。他在 X 平台上的原话直接切中要害：「AI  adoption 的真正问题在于，组织是围绕角色内人类生产力的窄范围预期设计的。产出太少是问题，但产出太多同样糟糕，因为审批流程、 staffing models 和协调系统无法吸收它。」



![程序员 reaction：柯南00118 不是吧](https://iili.io/CAlY1oP.png)
> 管理理论的边界正在被改写



这句话背后是一个更深刻的认知转变。Mollick 早年倾向于认为，需要像传统管理一样为智能体组织设计精细的结构和流程。现实给出的答案是，这种设计思维本身就是瓶颈。

## 一个被颠覆的判断

### 发生了什么

Mollick 的立场转变不是一时冲动，而是基于对多起案例的观察。他在 Forbes 上披露了智能体蜂群协作 Hugging Face 的事件，展示了 AI 智能体在没有人类中央调度下的自发协调能力。



![程序员反应图：程序员00026 我想做NLP找个好人家](https://iili.io/CumR2Ev.png)
> 审批流程追不上 AI 的提交速率



事件的关键细节在于，这些智能体的协作不是通过预设的组织架构完成的，而是通过提示工程引导的自组织行为。每个智能体根据上下文做出本地决策，整体涌现出协作能力。

### Bitter Lesson 照进组织

"Bitter Lesson" 这个概念来自 Rich Sutton 的经典论述，核心观点是：在人工智能发展中，依赖通用方法而非人工设计特例，最终总是胜过后者。Mollick 将这一逻辑移植到组织管理领域。

他的判断是：组织设计中，依赖人类经理精心设计协调机制的路径，正在被「让智能体在足够好的框架下自组织」的路径超越。这不是说管理无用，而是说管理的方式需要根本性调整。

## 组织是为「窄范围」人类设计的

### 产出过量的系统困境

这是 Mollick 最锋利的观察之一。传统组织的运转节奏是为人类生产力设计的。一个经理可以同时有效管理 5–8 个人，一个代码审查者一天能处理数十个 PR，一个团队的日产出有明确的上限预期。



![程序员 reaction："Justpatchitinproduction](https://iili.io/CC55m8u.png)
> 组织架构的物理约束正在消失



当 AI 进入这个系统后，单人产出的分布发生了剧烈变化。有的员工借助 AI 工具，产出达到过去的十倍甚至百倍。审批系统开始堵塞， staffing model 的计算假设完全失效，信息流的承载能力触及天花板。

这不是简单的「效率提升」故事。这是一个系统适配性问题，系统的瓶颈从生产力端转移到了协调端。

### 秘密 cyborgs 现象

Mollick 用了一个生动的术语来描述这一现象：secret cyborgs。员工在使用 AI 工具大幅提升产出后，由于担心被裁员或被认定「不该拿这么多工资」，选择不公开这一事实。



![程序员 reaction：我叫江户川柯南是一名侦探](https://iili.io/CCZxIov.png)
> 真相藏在每个人的工作流里



这对管理层的信号干扰极大。表面上看，团队产出没有显著变化；实际上，每个人的真实生产力已经在重塑。当管理层试图根据旧数据做出 staffing 决策时，他们面对的是一个与现实严重脱节的观测系统。

## 智能体蜂群的失效模式

### 脑裂设计与规划冲突

智能体蜂群的自组织能力令人印象深刻，但也带来了独特的失效模式。在一套峰值达到每秒 1,000 次提交的系统中，两类典型故障尤为突出。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 智能体协作的崩溃点



``mermaid


![智能体蜂群的失效模式](https://iili.io/ncTRtvs.png)
> 智能体蜂群的失效模式


第一类故障是「脑裂设计」。两个彼此不知情的规划器，在代码库不同区域以不同方式实现了同一个概念。这在人类工程中也会发生，但在智能体蜂群的提交速率下，问题规模和暴露速度完全不在一个量级。

第二类故障是规划器之间的显式冲突。双方都知道对方的存在，并在同一批文件上反复博弈。核心难点在于，双方对现实的认知框架存在两套独立的设定，合并工具本身无法仲裁这类语义冲突。

### 新的版本控制需求

应对这些失效模式，需要从根本上重新思考版本控制系统的定位。吞吐量只是表层需求。



![程序员 reaction：Mydownload](https://iili.io/CAP0Z0u.png)
> 每秒千次提交的挑战



每一处修改都经过版本控制系统，冲突也最先在这里暴露。这意味着协调机制的设计深度嵌入到了版本控制的实现中。Cursor 团队从零构建的新 VCS 就是一个例子，其核心创新不在于吞吐量，而在于如何在系统内部实现协调策略。

## 管理的重新定位

### 学徒制断裂的补救

Mollick 还指出了一个更隐蔽的问题：AI 正在瓦解隐性的学徒制管道。传统的人才培养依赖于低阶员工通过执行基础任务来学习技能，再由高阶员工进行指导。当 AI 自动化了这些基础任务，学习管道就从根部断裂。

这一问题的解决需要 CHRO 层面的主动介入，重新设计技能学习的路径。这不是技术问题，而是组织设计问题。

### 可执行的判断

对管理者的建议可以归纳为三个方向。

第一，停止用旧 staffing model 估算 AI 时代的产出能力。每个人的生产力分布已经发生了不可逆的偏移，基于历史数据的编制预算正在失效。

第二，建立「秘密 cyborgs」的披露激励机制。如果员工知道公开 AI 使用不会触发裁员，他们会更早地分享最佳实践，整体组织的 AI 采纳速度会显著提升。

第三，把管理重心从「协调人的工作」转移到「设计自组织的框架」。Bitter Lesson 的启示在这里成立：与其设计复杂的协调机制，不如设计足够好的初始条件和反馈回路，让协作自涌现。

组织管理没有银弹。但 Mollick 的判断提供了一个清晰的取舍框架：在 AI 深度嵌入工作流的阶段，管理的价值不再在于设计精细的协调结构，而在于设计能够承载高变异产出的弹性系统。

## 产出过量与系统过载

组织原本建立在「人效曲线窄」的假设上：一个岗位一年产出波动通常不超过某个倍数。AI 打破了这条曲线。有人开始一个人跑出一个小团队的输出，批准流、 staffing model、协作机制瞬间过载。这不是个别现象，而是结构性压力。

问题在于，组织并不是为「高变量、高吞吐」设计的。它依赖人肉协调：审批、会议、轮班、交接文档。当单个 agent 或 cyborg 员工产出远超常规范围时，这些协调设施根本没有扩容通道。结果不是效率更高，而是整个系统陷入停滞。

更狠的是，这种停滞往往是隐形的——表面上大家都在忙，实际上决策堆积、责任稀释、无人真正负责。你买的旗舰款管理工具，瞬间变成平替套餐。

## 秘密 cyborgs 与组织黑箱

Mollick 在访谈中多次提到一个现象：组织内部正在涌现「秘密 cyborgs」。这些员工用 AI 大幅提升个人产出，但出于对考核、裁员或角色重构的恐惧，并不公开披露。他们不申报、不分享、不进入管理层视野。

这造成两个后果：

其一，组织误判整体产能。管理者看到的报表依然是传统人力模型，实际工作流早已被 AI 增强过的人与机混合体重写。其二，这些个体创新被锁在孤岛，无法沉淀为团队能力，也无法反向训练管理流程。

企业若只把 AI 当作风险（数据泄露、合规问题），而看不到其生产力溢出，就会在暗中失去竞争力。竞争对手的组织可能已经悄悄完成了从「人管人」到「人管 agent」的迁移。

## 从管理假设到工程协议

智能体自组织之所以让传统管理失效，是因为后者依赖「人」作为基本单元的可预测性：人的速度、注意力、协作习惯都有上限与规律。agent 的行为则完全不同——它们可以并行、可以复用、可以瞬间扩缩，但也更容易陷入重复循环、语义分歧与资源竞争。

因此，管理智能体的核心不再是「指挥人」，而是「设计协议」：明确每个 agent 的输入输出边界、冲突解决机制、状态同步频率，以及失败时的回滚路径。这些协议往往需要写入代码仓库的 schema 或 workflow 文件中，而不是靠口头规范。

一个可执行的判断是：如果你的组织还没有建立 agent 协作的显式协议层，那么现在应该优先搭建 VCS 约束、规划器仲裁、上下文隔离这三块基础设施。否则，智能体规模越大，系统越容易陷入无声崩溃。

来源：
- Ethan Mollick on X: "A real issue with AI adoption is that organizations are built around a narrow expected range of human productivity in a role." (https://x.com/emollick/status/2082935598768091518)
- Ethan Mollick, "Management as AI superpower", One Useful Thing (https://www.oneusefulthing.org/p/management-as-ai-superpower)
- Ethan Mollick, LinkedIn post on applying organizational theory to agentic AI (https://www.linkedin.com/posts/emollick_i-think-agentic-ai-would-work-much-better-activity-7426069089074290688-PG6i)
- Cursor blog, "智能体蜂群与新的模型经济学" (https://cursor.com/cn/blog/agent-swarm-model-economics)

## 产出过量，系统跟不上

当 AI 让单个人能产出过去十个人的内容量时，组织的协调系统就暴露出了设计缺陷。审批流程是按人类工作节奏建立的， staffing model 是按人类产能预估的，而 AI 让这一切全部打乱。

更麻烦的不是产出太少，而是产出太多导致系统过载。当每个员工都用 AI 放大产出时，汇总、审核、整合这些环节就成了瓶颈。



![产出过量导致系统过载](https://iili.io/ncT53F9.png)
> 产出过量导致系统过载



这种过载不是技术故障，而是组织设计的结构性缺陷——它从未考虑过输出密度突然增加的情况。

## 可执行判断：下一步做什么

组织需要从「管理假设」转向「工程协议」。

**第一，重新定义绩效**。不再奖励「可见的努力」，而是评估实际产出价值和判断质量。AI 让产出变得廉价，价值判断变得昂贵。

**第二，识别并激励 secret cyborgs**。找到那些已经在用 AI 提升效率的人，让他们参与设计新的协作协议，而不是让他们继续隐藏。

**第三，为智能体蜂群设计协调机制**。明确边界：哪些决策由人类做，哪些由智能体自主，哪些需要审批。用工程协议替代管理权威。

Bitter Lesson 的核心判断是：针对具体问题的精巧设计，最终都会被通用方法取代。组织管理也是如此——试图用旧的管理假设来控制 AI 时代的生产力，最终会被证明是低效的。能存活下来的组织，会是那些把协作当作工程问题来设计、而非当作管理问题来解决的组织。

可执行的第一步：找出你们组织里最大的协调瓶颈，然后问——如果这个瓶颈由 AI 来处理，需要什么样的协议，而不是什么样的人。

## 参考文献
- Ethan Mollick on X: "A real issue with AI adoption is that organizations are built around a narrow expected range of human productivity in a role." https://x.com/emollick/status/2082935598768091518
- Ethan Mollick, Forbes: "Mollick Writes About Agent Swarms And Hugging Face Debacle" https://www.forbes.com/sites/johnwerner/2026/09/12/mollick-writes-about-agent-swarms-and-hugging-face-debacle
- Ethan Mollick, One Useful Thing: "Management as AI superpower" https://www.oneusefulthing.org/p/management-as-ai-superpower
- Cursor Blog: "智能体蜂群与新的模型经济学" https://cursor.com/cn/blog/agent-swarm-model-economics
- Ethan Mollick - Management as AI superpower. https://www.oneusefulthing.org/p/management-as-ai-superpower
- Ethan Mollick on the five rules of great AI leadership | Insight Partners. https://www.insightpartners.com/ideas/ethan-mollick-on-ai
- Change Agents with Ethan Mollick: How AI agents will reinvent productivity. https://www.youtube.com/watch?v=VCA7wdZBuUE
- Mollick Writes About Agent Swarms And Hugging Face ... | Forbes. https://www.forbes.com/sites/johnwerner/2026/09/12/mollick-writes-about-agent-swarms-and-hugging-face-debacle
- 智能体蜂群与新的模型经济学 · Cursor. https://cursor.com/cn/blog/agent-swarm-model-economics
- 生产环境 AI 故障响应：当你的智能体在凌晨 3 点出错时. https://tianpan.co/zh/blog/2026/04/10/production-ai-incident-response-runbook

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
