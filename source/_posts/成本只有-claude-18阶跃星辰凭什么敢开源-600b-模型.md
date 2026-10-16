---
title: "成本只有 Claude 1/8，阶跃星辰凭什么敢开源 600B 模型"
date: "2026-10-16 10:38:08"
updated: "2026-10-16 10:46:28"
permalink: "posts/2026/10/16/成本只有-claude-18阶跃星辰凭什么敢开源-600b-模型/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/16/成本只有-claude-18阶跃星辰凭什么敢开源-600b-模型/"
article_id: "79a4b068-1913-402c-be0d-46034822d207"
description: "阶跃星辰 10 月 15 日开源 Step 5 Preview，600B 总参数、27B 激活、100 万 token 上下文，AA 榜单排开源前三，单任务成本仅 Claude Opus 5 的 1/8。这轮竞争已从参数规模转向实际交付效率，稀疏 MoE 架构和长程 Agent 训练策略成为关键分水岭。"
cover: "/var/lib/aimagician/artifacts/covers/79a4b068-1913-402c-be0d-46034822d207/d9041aa7-7f3f-4aba-8db0-5aef2e15ee6d/cover.png"
imgTop: false
---

一个开发者在调试长程 Agent 时，历史上下文压缩到一半，任务直接崩掉。阶跃星辰这次拿出 100 万 token 窗口，就是要把这个痛点钉死。



![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> Agent 历史上下文被压缩到失真，任务链断裂



## 一、为什么 10 月 15 日这个时间点值得注意

阶跃星辰在 9 月 20 日发布 Step 5 Preview，宣布单任务成本仅为 Claude Opus 5 的 1/8。一个半月后，10 月 15 日正式开源 BF16 与 FP8 两种权重量化版本，配套技术博客、部署指南上线 Hugging Face 和 ModelScope。



![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> 闭源模型开始面临开源模型的参数压力



### 闭源模型的性能天花板在哪

Claude Opus 5、GPT-6 Astra 等闭源旗舰，在 DeepSWE v1.1 基准上跑出 74 分左右的分数。Step 5 Preview 拿到 67.7 分，差距不到 7 个百分点，但成本差了 8 倍。

这不是参数差距的问题。Step 5 Preview 是 600B 总参数，Claude Opus 5 的参数规模未知，但业界普遍认为其激活参数量也远高于一般 Dense 模型。真正拉开差距的是：闭源模型的价格策略建立在算力垄断上，开源权重一旦放出，这套逻辑就被动摇了。

### 开源权重释放意味着什么

权重开源不等于模型变免费。它意味着开发者可以本地部署、按需调整、避免 API 调用频率和费用上限的掣肘。对需要长期运行 Agent、频繁调用模型的团队来说，这是一个成本可控的选项。

## 二、Step 5 Preview 到底是什么

Step 5 Preview 是阶跃星辰新一代旗舰基座模型，定位为面向真实任务的 AI 编程与专业知识工作基模。



![程序员反应图：程序员00033 摘要模型数据评估](https://iili.io/CA7VfP1.png)
> 长程 Agent 的上下文管理成本正在重塑定价逻辑



### 600B / 27B 的账怎么算

总参数量 600B，每 token 激活 27B，稀疏度约 4.5%。这意味着模型存储需要约 1.2 TB（BF16 精度），但每次推理只需计算 27B 参数的前向传播。

这就是成本差异的来源。闭源旗舰模型通常是 Dense 或高比例激活架构，每次推理调用全部或大部分参数；Step 5 Preview 的稀疏 MoE 设计让单位 token 的计算成本大幅下降。

| 项目 | Step 5 Preview | Claude Opus 5 |
|------|---------------|---------------|
| 总参数 | 600B | 未知 |
| 激活参数/token | 27B | 未知 |
| 上下文窗口 | 1M tokens | 约 200K tokens |
| AA 指数 | 44（开源前三） | 约 50+ |
| 单任务成本 | 1x | 8x |

数据来源：Artificial Analysis Intelligence Index，阶跃星辰官方公布价格

### 100 万 token 不是数字游戏

100 万 token 的上下文窗口，解决的是 Agent 半途中断的问题。一个典型的软件工程项目，代码、日志、配置文件、文档加起来轻松超过 50 万 token。如果模型只能承载 20 万 token，中间就必须做上下文压缩，压缩过程会丢失信息，信息丢失会导致 Agent 在执行过程中迷失方向。

Step 5 Preview 将上下文压缩纳入端到端策略训练，Agent 可以在长程任务中自行整理状态并继续执行，而不是依赖外部 truncation 工具。

## 三、稀疏 MoE 和长程 Agent 训练

### 92 层窄深架构做了什么取舍

技术博客披露了 92 层窄深架构的设计思路。传统大模型倾向于宽浅结构，步数多但每步计算简单；窄深结构则减少层数、增加每层宽度，在相同推理步数下获得更高的单次计算密度。

这种设计对 MoE 模型尤其重要：每一层需要路由到不同的专家网络，层数越少，路由决策的延迟越低，整体推理效率越高。

同时采用 Sparse GQA（分组查询注意力），减少 KV Cache 的内存占用，这对 100 万 token 上下文来说是必要条件——否则显存根本装不下。

### 长程任务强化学习是关键变量



![程序员系列表情：你从我脸上看到了什么](https://iili.io/nlCYpe9.png)
> Agent 长程执行的优化路径不止是参数规模



Step 5 Preview 的训练引入了百万级可验证环境和长程任务强化学习。这意味着模型不是在静态数据集上预训练一次完成，而是在实际任务执行中获得反馈，逐步优化长程决策能力。

这才是区分"能写代码"和"能在 100 万 token 上下文中持续执行并完成多步任务"的分水岭。前者靠参数规模，后者靠训练策略。





## 四、成本与定位的现实判断

### 1/8 成本的来源是稀疏激活

成本差异本质上是稀疏激活带来的推理效率提升，叠加开源权重带来的部署灵活性。FP8 量化版本进一步压缩了存储和计算需求，适合对成本敏感的场景。

### 什么时候该用它，什么时候不该

Step 5 Preview 在软件工程、专业知识工作和金融场景表现突出，AA 指数 44 分居开源前三。如果你的任务涉及长程 Agent 执行、多轮代码调试、或者需要大上下文理解，它是个值得考虑的选择。

但在以下情况需要重新评估：
- 需要极致响应速度的实时交互场景，稀疏 MoE 的路由开销可能不如轻量 Dense 模型
- 任务对准确性要求极高且预算充足，闭源旗舰的分数仍有约 7 分优势
- 需要私有化部署且基础设施有限，600B 权重对显存和推理集群的要求不低

大模型竞争已从拼参数规模，转向拼单次任务的实际交付能力。Step 5 Preview 的出现，让这条赛道又清晰了一分。

## 五、成本曲线背后的工程账

公开定价显示，Step 5 Preview 的输入价格为 $1/M tokens，输出价格为 $2.70/M tokens。相比之下，Claude Opus 5 的定价高出数倍。

成本优势来自三方面：一是稀疏 MoE 降低了推理时的有效计算量；二是 100 万 token 上下文减少了应用层的上下文重写和分段调用次数；三是开源权重让部署方可以选择自建推理服务，规避 API 溢价。

但成本计算不能只看 token 单价。如果一个 Agent 任务需要 50 万 token 输入、20 万 token 输出，Step 5 Preview 单次调用成本约 $350，Claude Opus 5 同期调用成本可能超过 $2000。这里还没算自建推理的 GPU 集群运维成本。





## 六、给开发者的可执行判断

Step 5 Preview 的开源策略释放了一个信号：大模型竞争正在从参数规模转向单次任务的实际交付能力。

对于开发者，以下三点值得纳入决策参考：

第一，如果你的业务以长程 Agent 任务为主，且对成本敏感，Step 5 Preview 是一个值得试跑的选项。100 万 token 上下文能显著减少应用层的上下文管理复杂度。

第二，部署前必须评估自己的推理基础设施。600B 模型即使只激活 27B，BF16 权重仍需约 1.2TB 显存。多卡部署、量化方案（FP8 版本已提供）、推理框架选型都需要提前规划。

第三，不要只看 AA 榜单排名。榜单反映的是静态评测能力，真实 Agent 任务的稳定性取决于训练数据和强化学习信号。建议先用小规模任务验证上下文管理和工具调用链路，再逐步放大。

坦白讲，开源 600B 模型不是终点，而是入场券。真正的考验在于：你的 Agent 能在 100 万 token 的历史中保持多少步的一致执行，以及这个能力能否在真实业务场景中稳定复现。

## 参考文献
[1] 阶跃星辰开放Step 5 Preview权重_搜狐网. https://m.sohu.com/a/1088127449_120988576?scm=10001.325_13-325_13.0.0-0-0-0-0.5_1334
[2] 阶跃星辰Step 5 Preview正式开源模型权重 面向AI编程_腾讯新闻. https://news.qq.com/rain/a/20261015A02TKV00
[3] 阶跃发布新一代旗舰基座模型Step 5 Preview 跻身AA榜单全球开源前三_智能_Scaling_成本. https://www.sohu.com/a/1078505240_120988576
[4] Step 5 Preview: Advancing the Pareto Frontier. https://www.stepfun.com/step-5-preview
[5] Step 5 Preview: StepFun's 600B leak, scored and priced. https://www.orcarouter.ai/blog/step-5-preview-leak
[6] StepFun on X: "Introducing Step 5 Preview: Advancing the Pareto Frontier. Step 5 Preview is our new flagship model for agentic work, delivering frontier-level performance across software engineering and professional knowledge work, with particular strength in finance. - 600B total / 27B active Mo… / X. https://x.com/StepFun_ai/status/2101510462685003786
[7] Step 5 Preview Tested: Stepfun's MoE Model Scores 83.75% on Kingbench | MindStudio. https://www.mindstudio.ai/blog/step-5-preview-stepfun-coding-test
[8] 免费token鸡蛋来了!阶跃星辰Step-5-preview限时免费一个月领取教程 - 代码简单说 - 博客园. https://www.cnblogs.com/wlor/articles/23051630

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
