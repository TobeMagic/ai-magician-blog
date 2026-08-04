---
title: "Qwen3.8-Max 发布：开源最强编码与协作模型，2.4T 参数"
date: "2026-08-04 10:00:01"
updated: "2026-08-04 10:27:21"
permalink: "posts/2026/08/04/qwen38-max-发布开源最强编码与协作模型24t-参数/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/04/qwen38-max-发布开源最强编码与协作模型24t-参数/"
article_id: "791d928c-089b-4f42-aa2b-a80170e23efa"
description: "Qwen 正式发布 Qwen3.8-Max，这是 Qwen 家族迄今最强的模型，拥有 2.4T 参数（95B 激活），并首次开源 Qwen-Max 级权重，开放权重将于下周发布。"
cover: "/var/lib/aimagician/artifacts/covers/791d928c-089b-4f42-aa2b-a80170e23efa/b5020e84-3966-45ee-ba57-7c69a10f7111/cover.png"
imgTop: false
---

## 核心规格与架构

### MoE 设计与激活效率

Qwen3.8-Max 采用混合专家（MoE）架构，总参数 2.4 万亿，但单次推理仅激活约 95B 参数。激活率约 4%，这一比例与 Qwen3 早期版本的 235B 激活模型相比，单位计算效率显著提升。阿里在官方博客中指出，这种设计允许模型在保持大规模知识容量的同时，控制推理延迟。



![程序员 reaction：OurSQL](https://iili.io/CC5uD3g.png)
> 参数规模与激活效率的权衡





![Qwen3.8-Max MoE 架构参数流](https://iili.io/CUyw9aI.png)
> Qwen3.8-Max MoE 架构参数流



### 训练与推理优化

阿里为 Qwen3.8-Max-Thinking 采用了一种经验累积式、多轮迭代的测试时扩展策略。与简单增加并行推理路径不同，该策略限制了路径数量，并将节省的计算资源用于由「经验提取」机制引导的迭代式自我反思。这一机制从过去的推理轮次中提炼关键信息，避免重复推导已知结论，聚焦于未解决的不确定性。

## 编程与协作能力

### 长周期任务实测

官方测试中，Qwen3.8-Max 在 SWE-bench Pro 基准上获得 67.7 分，超过 GPT-5.6 Sol，仅略低于 Opus 4.8，进入第一梯队中上游。更硬核的 FrontierSWE 基准达到 73.5 分。

一个更具说明性的案例是「自进化智能体 Harness」任务。模型从零开始，仅依靠文字指令，在空白工程环境下独立完成约 16 天体量的代码编写工作，产出可直接运行的自进化智能体框架 oh-my-cli，代码量约 7600 行，执行超过 1100 次操作，完成 33 轮 GPU 训练。整个过程无需人工介入调试。



![程序员反应图：程序员00025 未能找到你的女朋友](https://i.ibb.co/MxDKVmHN/transparent.png)
> 长周期编程任务的真实压力



### 多模态 Agent 表现

Qwen3.8-Max 支持文本、图像、视频输入，上下文窗口达 100 万 token。在办公场景测试中，模型可在 1 小时内从数百份文档中找出 1284 项相关条款，也能依据图纸创建 30 层办公大楼的抗震结构模型。在多模态 Agent 任务中，模型可处理超过 200 页的财报、百小时影片，并在操作过程中持续观察成果，发现接口错位或对象方向错误后自行修正。

## 开源策略的转变

### 闭源溢价的消解

过去两年，阿里在开源策略上一直克制。Qwen2.5-Max、Qwen3-Max（2025 年 9 月版本）均为闭源，开源天花板长期停留在 Qwen3-235B 量级。业内共识是：Max 系列是阿里云百炼的现金奶牛，靠 API 卖钱，开源会冲击商业利益。

这次 3.8 版本开源 Max 级权重，标志战略转向。DeepSeek V3.2 及后续开源模型已将「闭源溢价」的窗户纸戳破。当开源模型能力达到闭源顶级模型七八成时，继续闭源只会把客户推向竞争对手。阿里选择将开源社区标准提升至 2.4T 参数量级，用生态锁定上下游。



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> 开源决策背后的商业计算



### 生态锁定的逻辑

开源 2.4T 参数模型，意味着企业级 Agent 部署将拥有更多高性能、可自持的模型选择。对于依赖阿里云基础设施的客户，Qwen3.8-Max 的开源权重可降低迁移成本，同时增强对百炼平台的黏性。这是一种典型的「开源引流、闭源变现」策略，只是这次开源的门槛更高。

## 适用边界与建议

### 何时选择 Qwen3.8-Max

在以下条件下，Qwen3.8-Max 是合适选择：需要长周期编程任务自动化、多模态 Agent 工作流、或对成本敏感且具备自建推理基础设施的能力。若任务对延迟敏感、或算力资源有限，可考虑 Qwen3.8-27B 等较小版本，或继续使用闭源 API 服务。



![程序员 reaction：SendaCVInterview](https://iili.io/CUy0LIp.png)
> 模型选型需要匹配实际约束



### 部署与调用的注意事项

权重开放后，部署成本需单独核算。2.4T 参数模型在 FP8 精度下约需 1.2TB 显存，全精度部署需要多卡集群。阿里同时推出了 Token Plan 订阅模式，以 Lite/Standard/Pro 分级替代按 token 计量，夜间调用有折扣。对于短期实验，预览版已上线千问 AI 平台和 Qoder IDE，可直接体验。

第三方评测显示，Qwen3.8-Max 在 Arena 榜单中仅次于 Claude 系列，整体性能进入全球第一梯队。但性能接近的模型不止一家，Kimi K3、GPT-5.6 Sol、Grok 4.5 均处于同一量级。实际选型时，价格、速度、可用性、以及团队熟悉度，往往比基准分数更具决定性。

## 编程能力实测

SWE-bench Pro 基准测试中，Qwen3.8-Max 拿到 67.7 分，超过 GPT-5.6 Sol，仅略低于 Opus 4.8，挤进第一梯队中上游。更硬核的 FrontierSWE 也拿了 73.5 分。这两个数字的意义在于：2.4T 参数的旗舰模型，开源后性能依然能打。



![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> 代码评审现场



官方给出的长周期任务案例是「自进化智能体 Harness」。模型从零开始，仅凭文字指令，在空白工程环境下独立完成约 16 天体量的代码编写，产出可直接运行的自进化智能体框架 oh-my-cli。过程中模型自主完成约 7600 行代码、1100 多次操作、33 轮 GPU 训练。这不是玩具项目，而是达到 Hermes Agent 同级水准的完整框架。



![长周期编程任务执行流程](https://iili.io/CUywLSS.png)
> 长周期编程任务执行流程



### SWE-bench Pro 与 FrontierSWE 成绩

编程能力的评估不能只看单一基准。SWE-bench Pro 侧重真实 GitHub issue 的修复能力，FrontierSWE 则更强调复杂工程场景。Qwen3.8-Max 在两个榜单上的表现说明，模型不仅会写代码，还能理解代码库的整体结构并做出合理修改。

### 长周期任务：自进化智能体 Harness

16 天、7600 行代码、33 轮训练，这个数字组合背后是模型在长周期任务中的稳定性。传统做法需要人类工程师分阶段介入调试，而 Qwen3.8-Max 能够自主完成从规划到验证的完整闭环。这对企业级 Agent 部署是一个重要信号。

### 多模态 Agent：财报、影片与接口操作

多模态能力是 Qwen3.8-Max 的另一条主线。官方测试显示，模型可以处理超过 200 页的财报、百小时影片、图片、文档及接口操作，并运行影片剪辑、3D 建模、网页还原和应用开发等任务。关键机制在于模型可以在操作过程中持续观察成果，发现接口错位或对象方向错误后自行修正。



![程序员 reaction：No,itsthegamerswho](https://iili.io/CUyG6Yu.png)
> Agent 运行时过载



## 开源策略转变

过去两年，阿里在开源与闭源之间的策略一直很克制。Qwen2.5-Max、Qwen3-Max 都是闭源的，开源的天花板长期停留在 Qwen3-235B 这个量级。业内心照不宣：Max 系列是阿里云百炼的现金奶牛，靠 API 卖钱，开源出去会砸了自己的饭碗。

这次 3.8 版本开源，意味着阿里在闭源变现和开源生态影响力之间，算下来觉得后者更划算。

DeepSeek V3.2 和后来一票开源模型把「闭源溢价」这层窗户纸戳穿了。当开源模型的能力已经能够摸到闭源顶级模型七八成的时候，Max 级模型继续闭源，只能给友商送客户没有别的意义。倒不如自己下场，把开源社区的标准提到 2.4T 参数这个量级，用生态锁住上下游。



![开源与闭源策略权衡](https://iili.io/CUyNqDg.png)
> 开源与闭源策略权衡



### 闭源溢价的消解

闭源溢价的本质是信息不对称。当开源模型性能接近闭源时，溢价空间被压缩。Qwen3.8-Max 的开源不是技术让步，而是商业策略的重新计算。2.4T 参数的开源权重，意味着企业可以自建推理服务，降低对云厂商 API 的依赖。

### 生态锁定的逻辑

开源权重不等于放弃商业。阿里云同步推出的 Token Plan、Qoder 和 QoderWork 等产品，构成了新的变现路径。预览版已在千问 AI 平台上线，并接入同日推出的智能体产品「千问办公」。开源是入口，生态是护城河。

## 行业影响与竞争格局

在 3 日公布的第三方模型评测榜单 Arena 中，阿里 Qwen 模型仅次于 Anthropic 旗下 Claude 系列，整体性能被指位居全球大模型第一梯队。这个定位与 Kimi K3（2.8T）、GPT-5.6 Sol 形成直接竞争。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 大佬点头认可



第三方评测显示，Qwen3.8-Max 与同级别模型的差距已经很小。真正的差异化因素转向价格、速度、可用性和使用体验。对于企业用户而言，开源权重的可自持性是一个重要加分项。

### 与 Kimi K3、GPT-5.6 Sol 的对比

Kimi K3 参数规模 2.8T，GPT-5.6 Sol 是闭源旗舰。Qwen3.8-Max 在性能上接近两者，但开源策略提供了不同的部署路径。企业可以根据自身需求选择 API 调用或自建推理服务。

### 企业级部署的选择

开源权重的开放，意味着企业可以在私有环境中部署 Qwen3.8-Max。对于数据敏感的行业，这是一个实质性变化。当然，2.4T 参数的推理成本不低，需要评估硬件投入与 API 调用的综合成本。



![程序员反应图：吃我一招](https://iili.io/Cuz7V5X.png)
> 打工人的选择



## 关键规格与架构

Qwen3.8-Max 采用 MoE 架构，总参数 2.4T，激活参数 95B，激活率约 4%。这一设计在保持高吞吐的同时控制了推理成本。模型原生支持文本、图像、视频输入，上下文窗口达 100 万 token。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 参数规模与激活效率的权衡





![Qwen3.8-Max MoE 架构示意](https://iili.io/CUyNVJS.png)
> Qwen3.8-Max MoE 架构示意



## 关键要点

- 2.4T 总参数、95B 激活，MoE 架构控制推理成本
- SWE-bench Pro 67.7、FrontierSWE 73.5，编程能力跻身第一梯队
- 首次开源 Max 级权重，标志阿里从闭源变现转向生态锁定
- 对标 Kimi K3、GPT-5.6 Sol，国内开源模型天花板再次上移
- 企业部署可考虑自托管，但需评估 95B 激活参数的硬件门槛



![面对明显不属于自己的锅时强硬拒绝的表情](https://i.ibb.co/dwZpBDcP/transparent.png)
> 被安排了



## Key Points

- 2.4T 总参数、95B 激活，激活率约 4%，MoE 架构
- SWE-bench Pro 67.7 分、FrontierSWE 73.5 分，挤进第一梯队中上游
- 长周期任务实测：约 16 天、125 小时、7600 行代码、1100+ 动作、33 轮 GPU 训练
- E-Commerce Bench 仿真 365 天电商经营，最终持有约 41.6 万元，比 GLM 5.2 高 38%
- 首次开源 Max 级权重，闭源溢价逻辑被击穿
- Arena 榜单仅次于 Claude 系列

## Intro

过去两年，阿里在开源与闭源之间的策略一直很克制。Qwen2.5-Max、Qwen3-Max 都是闭源的，开源天花板长期停留在 Qwen3-235B 这个量级。业内心照不宣：Max 系列是阿里云百炼的现金奶牛，靠 API 卖钱，开源出去会砸饭碗。

这次 3.8 版本开源了。下周 Qwen3.8-Max 和 Qwen3.8-27B 一起放出来，意味着阿里在闭源变现和开源生态影响力之间，算下来觉得后者更划算。



![搬砖系列表情：见鬼，难道这帮人都不用搬砖的吗](https://iili.io/CUyWCes.png)
> 算账算到头秃



## Analysis

### 规格与激活效率

Qwen3.8-Max 总参数 2.4T，激活参数 95B，激活率约 4%。相比 Qwen3 早期版本超过 1T 总参、激活比例更高的设计，这次 MoE 架构的稀疏化程度明显加深。



![Qwen3.8-Max MoE 架构参数分布](https://iili.io/CUyNm7I.png)
> Qwen3.8-Max MoE 架构参数分布



激活率降低意味着推理时显存占用和计算量相对可控，但训练时仍需访问全部参数。这是 MoE 模型的典型权衡：训练成本高，推理效率相对友好。

### 编程与长周期任务

官方披露的长周期任务实测数据值得细看。让 Qwen3.8-Max 从零搭建一个自进化智能体 Harness，模型从空白工程环境出发，独立完成约 16 天体量的开发工作。

具体数字：约 7600 行代码、1100+ 动作、33 轮 GPU 训练。前 37 小时主要用于数据处理和训练脚本编写，之后进入迭代优化阶段。



![背锅系列表情：这口锅我背了](https://i.ibb.co/tTZxpZF0/transparent.png)
> Agent 自己跑自己





![自进化智能体 Harness 开发流程](https://iili.io/CUyOILb.png)
> 自进化智能体 Harness 开发流程



E-Commerce Bench 的仿真结果同样具体：10 万元启动资金，365 天经营，最终持有约 41.6 万元，比排名第 2 的 GLM 5.2 高出 38%。这个差距在单一指标上不算颠覆性，但结合编程基准来看，说明模型在长周期、多步骤、需自我修正的任务上确实有提升。

### 多模态 Agent

Qwen3.8-Max 支持文本、图像、视频输入，上下文长度 100 万 token。官方案例包括处理超过 200 页的财报、百小时影片、图片、文档及接口操作，并能在操作过程中持续观察成果、发现接口错位或对象方向错误后自行修正。



![程序员 reaction：特朗普00001 赢了怪我喽川普川建国](https://iili.io/CUyXFZx.png)
> 接口错位自己修



多模态 Agent 的核心难点不在于单模态理解，而在于跨模态的连贯操作和错误自修正。Qwen3.8-Max 在这个方向上的表现，更多体现在官方披露的测试用例上，第三方独立验证数据仍有限。

### 开源策略转变

DeepSeek V3.2 和后来一票开源模型把「闭源溢价」这层窗户纸戳穿了。当开源模型的能力已经能够摸到闭源顶级模型七八成的时候，Max 级模型继续闭源，只能给友商送客户。

倒不如自己下场，把开源社区的标准提到 2.4T 参数这个量级，用生态锁住上下游。这是阿里从「卖 API」到「建标准」的策略切换。



![群里聊得热闹但自己得继续搬砖时的表情](https://iili.io/Cuzcmk7.png)
> 大佬点头



### 闭源溢价的消解

Arena 榜单显示 Qwen 模型仅次于 Claude 系列，整体性能位居全球第一梯队。但榜单只是相对排名，真正影响企业选型的是价格、速度、可用性和生态兼容性。

Thomas Wiegold 的实测评价是：「Qwen3.8-Max 很好，也很慢。如果速度不重要，它属于当前第一梯队，与 Fable 5、ChatGPT 5.6 Sol、Grok 4.5、Kimi K3 并列。」



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> 第一梯队很拥挤



## Impact

在 X 条件下推荐方案 A，因为 …；当条件变化为 Y 时，切换为 B。

对开发者的建议：

1. 下周权重开放后，可在本地或自建集群部署 95B 激活版本，适合对数据隐私有要求的企业场景
2. 预览版已上线 Token Plan、Qoder、QoderWork，可先通过 API 验证实际工作流适配度
3. 长周期任务实测数据来自官方，第三方独立复现前保持适度乐观

本结论在编程、多模态 Agent、长周期任务三个维度成立，超出该范围需要重新评估。

## Research/source notes

### Research Query
daily pipeline - Qwen3.8-Max 发布：开源最强编码与协作模型，2.4T 参数

### 来源

1. 阿里最强AI模型Qwen3.8-Max亮相2.4兆参数、下周开源 - https://www.worldjournal.com/wj/story/[REDACTED]/9667601
2. 如何评价8月3日上线的阿里Qwen 3.8 Max正式版？ - https://www.zhihu.com/question/2067550234776020574
3. 阿里千问发布全新旗舰大模型Qwen3.8-Max - https://m.sohu.com/a/1058127943_223764
4. AI Daily 2026-07-19 - https://yeekal.com/daily/2026-07-19
5. 【AI日报】阿里发布 Qwen3.8-Max - https://www.youtube.com/watch?v=1ov1u0N1vrE
6. AI Tech Daily - 2026-07-20 - https://www.recsys-frontier.com/en/article/ai-daily-en-2026-07-20
7. 憋了4个月，阿里最大最强模型正式版发布 - https://m.36kr.com/p/3657074925609352
8. 阿里巴巴 Qwen 又把 AI Coding 往前推了一步 - https://www.threads.com/@aiposthub/video/Dbj-GEVEYm-
9. 千问大模型 - 阿里云 - https://www.aliyun.com/product/tongyi
10. Qwen3.8-Max: A New Bar for Coding and Cowork - https://qwen.ai/blog?id=qwen3.8
11. Qwen3.8 MAX Preview Is HERE - https://www.youtube.com/watch?v=Wlh1na7rB4o
12. Qwen 3.8 Max Review - https://thomas-wiegold.com/blog/qwen-3-8-max-review
13. What Is Qwen3.8-Max? - https://kie.ai/blog/what-is-qwen-3-8-max
14. Qwen 3.8 Max Benchmark - https://trilogyai.substack.com/p/qwen-38-max-benchmark-how-it-compares
15. My thoughts on Qwen 3.8 Max Preview - https://www.reddit.com/r/Qwen_AI/comments/1v6bnu9/
