---
title: "TPU推理性价比翻50%，NVIDIA的护城河要见底了？"
date: "2026-09-08 11:00:01"
updated: "2026-09-08 11:08:59"
permalink: "posts/2026/09/08/tpu推理性价比翻50nvidia的护城河要见底了/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/08/tpu推理性价比翻50nvidia的护城河要见底了/"
article_id: "1b7a7e74-cada-4ea8-bd1b-85876ab02fca"
description: "SemiAnalysis推出InferenceX基准测试框架，用真实推理负载撕开了GPU峰值算力的宣传泡沫。数据显示，TPU在外化后经Anthropic等客户深度定制，实际模型FLOP利用率可超越Blackwell，推理性价比最高提升50%。AgentX v3进一步将agentic工作负载纳入北极星指标，证明CUDA护城河并非不可突破。这不是参数对决，而是工程效率的重新定价。"
cover: "/var/lib/aimagician/artifacts/covers/1b7a7e74-cada-4ea8-bd1b-85876ab02fca/b4d526ab-1933-4818-9408-ad301d751877/cover.png"
imgTop: false
---

从机制、系统架构与工程边界来写。

InferenceX最近一次数据更新里，出现了两组看似矛盾的数字。NVIDIA Blackwell的峰值算力仍然是行业天花板，但Anthropic运行Claude时，TPU上的模型FLOP利用率反而更高。差距来自哪里，得先看这两张图。



![程序员 reaction：WHATIFTHEREWERENODISK?](https://iili.io/CCZ4u9f.png)
> 数据揭示的真相





![GPU峰值算力 vs 实际推理效率](https://iili.io/n3vYbs9.png)
> GPU峰值算力 vs 实际推理效率



TPU推理外化，指的是Google将其自研的张量处理单元（TPU）通过云端向外部客户开放推理能力。过去TPU只在Google内部使用，服务于搜索、广告和Gemini等项目。从2024年开始，Google逐步将TPU stack对外开放，包括TPUv4、TPUv5p，以及正在部署的Ironwood（TPUv6）和TPUv8i。这个转变的核心驱动力，是Google希望通过外部客户的规模化使用，摊薄TPU的研发和运营成本。

为什么现在成为可能？三个因素同时成熟。第一，Google内部已经验证了TPU在大规模训练和推理中的可靠性；第二，JAX生态的完善降低了外部客户的学习成本；第三，Anthropic、X等客户证明了深度定制内核可以压榨出远超GPU峰值的效率。

Anthropic的工程逻辑值得拆解。他们拥有前Google编译器专家，团队既熟悉TPU的编译链路，也深入理解Claude的架构特点。他们的做法不是简单地「把模型搬上TPU」，而是针对Transformer的注意力机制、KV cache管理、序列并行等细节编写定制内核。结果是在相同模型规模下，TPU的MFU（Model FLOPs Utilization）可以超过Blackwell的80%以上。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 定制内核带来的效率跃迁





![TPU vs GPU 工程路径对比](https://iili.io/n3vaphN.png)
> TPU vs GPU 工程路径对比



从更宏观的视角看，GPU厂商卖的峰值FLOPs是一辆F1赛车的极速，而你真正需要的是公交车上50个人的通勤效率。Blackwell的峰值算力确实惊人，但在真实推理负载下，受限于内存带宽、功耗墙、软件栈开销，实际能跑出的有效FLOPs往往只有峰值的70%左右。相比之下，TPU虽然峰值较低，但通过定制化优化，其MFU可以更接近理论上限。

AgentX v3的推出进一步改变了评估框架。它不再只看单次请求的延迟或峰值吞吐量，而是将「交互性」和「TTFT惩罚」纳入北极星指标。这意味着长期运行的Agent工作负载、多轮对话、工具调用等复杂场景，都能在统一的指标下被评估。这种评估方式的转变，让TPU的长尾优化能力有了展示空间。



![程序员反应图：程序员00007 MyCodeCodeOnStackOverFlow](https://i.ibb.co/677YW6mL/transparent.png)
> 工程实现的真实复杂度



三种架构路径的选择，本质上是对「谁来做优化」的分工选择。方案A是传统NVIDIA路径，客户购买GPU实例，使用vLLM、TGI等成熟框架，适合快速上线但优化空间有限。方案B是TPU定制路径，客户投入工程资源编写定制内核，适合高负载、长期运行的核心业务。方案C是混合架构，将预填充和解码分离，不同阶段使用不同硬件，适合流量波动大的场景。

| 维度 | GPU方案 | TPU方案 | 混合方案 |
|------|---------|---------|----------|
| 初始成本 | 中等 | 较高 | 高 |
| 优化空间 | 有限 | 大 | 中等 |
| 工程投入 | 低 | 高 | 中等 |
| 长期性价比 | 中 | 高 | 中高 |
| 适用场景 | 快速验证 | 大规模生产 | 复杂负载 |



![程序员 reaction：ExplainingVirtualMachines](https://iili.io/CCGc5ZB.png)
> 架构选型的现实考量





![推理架构选型决策流程](https://iili.io/n3vloAv.png)
> 推理架构选型决策流程



CUDA的护城河不是被技术击穿的，是被工程团队的耐心一点点填平的。TPU外化的意义不在于单点性能超越GPU，而在于它提供了一个替代路径：将优化重心从硬件参数竞争转向软件工程竞争。对于拥有编译器专家和模型架构知识的团队来说，这条路正在打开。

## 峰值FLOPs的泡沫：GPU营销数字背后的真相

营销叙事里的GPU性能，建立在一条未经检验的假设上：峰值FLOPs等于实际吞吐量。这条假设在GEMM基准测试里勉强成立，一旦进入真实推理场景，误差会被急剧放大。



![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> 数据揭示的真相





![GPU峰值算力 vs 实际推理效率](https://iili.io/n3vYbs9.png)
> GPU峰值算力 vs 实际推理效率



### Blackwell、Hopper、MI300的实际MFU差距有多离谱

SemiAnalysis的数据给出了一个清晰的谱系。Hopper架构在专门设计的GEMM测试里，能摸到峰值算力的80%左右。Blackwell落在70%上下。AMD的MI300系列更惨，50%到60%区间是常态。

这不是测试方法的问题，是物理约束决定的上限。峰值FLOPs是在理想矩阵形状、最优内存布局、无外部通信的理想条件下算出来的。真实推理负载的矩阵形状、精度要求、通信模式，几乎找不到任何一个能同时满足这些条件的工作负载。

Anthropic的工程团队对此有切身体会。他们拥有前谷歌编译器专家，熟悉TPU堆栈，也了解自家模型的架构特点。结果是可以定制的，内核可以针对特定模型做优化，MFU可以推到比Blackwell更高的水平。这说明一个事实：硬件峰值只是起点，工程团队的投入才是决定性变量。

### 动态调频与电力传输限制如何吃掉峰值算力

芯片手册上的峰值频率，对应的是实验室里的最大功耗预算。数据中心机柜的电力传输能力，通常无法支撑整柜芯片同时跑满峰值。NVIDIA和AMD都在使用动态调频技术，在温度、功耗、电压三重约束下实时调整时钟速度。

这意味着什么。实际运行中，芯片大部分时间处于降频状态。峰值FLOPs乘以动态系数，才是可期待的实际上限。这个系数在推理场景里尤其不稳定，因为请求的批次大小、序列长度、注意力模式都在变，调频频率也跟着波动。

TPU外化的意义在于，Google用内部工程经验为外部客户做了大量预设优化。Anthropic不需要从零开始调优内存布局、通信模式、并行策略。Ironwood TPUv8i的架构已经针对Claude的工作负载做过适配，MFU的自然基线就比Blackwell高出不少。

### SemiAnalysis InferenceX框架如何测量真实性能

InferenceX的核心思路是反向校准。不测峰值，测每美元能换回多少token。这个指标把硬件价格、电力成本、软件栈效率全部压缩到一个数字里，逼着厂商不能再靠峰值FLOPs讲故事。

AgentX v3把agentic工作负载也纳入考量。交互性、TTFT、KV cache命中率、请求调度开销，这些传统基准忽略的变量，现在都有独立的权重。一个模型在预填充阶段跑得再快，如果decode阶段因为内存带宽不足导致吞吐崩塌，整体评分依然会很低。

这种测量方式直接动摇了CUDA护城河的叙事基础。护城河的价值，取决于客户是否愿意为生态锁定支付溢价。当TPU的外化方案能提供更高的性价比，当Anthropic这样的客户用实际数据证明MFU可以超越Blackwell，生态锁定的说服力就在下降。

CUDA的护城河不是被技术击穿的，是被工程团队的耐心一点点填平的。Google用了十几年在内部验证TPU堆栈，现在才刚刚开始对外释放这个积累。



![程序员 reaction：Optimization](https://iili.io/CIsFLHG.png)
> 数据揭示的真相





![AgentX v3 北极星指标构成](https://iili.io/n3vlUiP.png)
> AgentX v3 北极星指标构成



AgentX v3 的核心变化在于它不再只看 TTFT 或单次延迟，而是把交互性纳入北极星指标。公式本质上是 1/TPOT 与 TTFT 惩罚项的组合。TTFT 越高，惩罚越重。这直接反映了 agent 场景下「多轮对话」的真实代价。

单纯看 prefill 阶段的峰值吞吐没有意义。真正的瓶颈在 decode 阶段的交互节奏。用户等待时间叠加 agent 内部多次工具调用，TTFT 的复利效应会指数级放大延迟。



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> 端到端链路考验





![Agentic推理全链路检查点](https://iili.io/n3v0v7s.png)
> Agentic推理全链路检查点



AgentX 暴露出的问题远不止 kernel 优化。KV cache 生命周期管理、混合注意力缓存正确性、CPU offload 时机、传输进度、路由亲和性、增量分词、请求序列化、调度器记账——这些环节对每一个生产部署都致命。

某团队在 DeepSeek R1 上实测发现，B300 相比 B200 的 50% HBM 增量换来的是 91% 的 HBM cache hit rate。多出的显存不是冗余，是吞吐量的杠杆。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 生态的沉默转向



AgentX 开源不到半年，已有 50+ 上游 PR 提交到主流推理框架。这些 PR 不是理论验证，而是直接在生产流量里压出来的改动。nvFP4 精度支持、Wide Expert Parallelism、Disaggregated Prefill 优化——每一条都在回应 AgentX 暴露的真实痛点。

TPU 外化的另一面是客户定制能力。Anthropic 拥有前谷歌编译器专家，愿意投入时间写定制内核。结果是 Ironwood TPU 的已实现 MFU 超过 Blackwell。NVIDIA 营销的峰值 FLOPs 被动态调频和电力限制吃掉约 30%，而 TPU 的能效比在真实负载下更接近标称值。

CUDA 护城河没有被一次基准测试击穿。它被 50 多个上游 PR、被 Anthropic 的工程投入、被 InferenceX 持续更新的每周快照一点点填平。GPU 厂商卖的峰值 FLOPs 是一辆 F1 赛车的极速，而你真正需要的是公交车上 50 个人的通勤效率。

选型决策表：在固定交互性 50 tok/sec/user 的条件下，B200 vLLM 与 B300 vLLM 聚合性能接近，差异来自 HBM 容量；当工作集超过 HBM 时，B300 多出的 50% 显存直接转化为吞吐量。TPU 路径要求团队具备编译器定制能力，否则开箱即用性能弱于预期。



![面对明显不属于自己的锅时强硬拒绝的表情](https://i.ibb.co/dwZpBDcP/transparent.png)
> 数据揭示的真相





![InferenceX v2 横向对比：TPU vs GPU 实际MFU差距](https://iili.io/n3v11GS.png)
> InferenceX v2 横向对比：TPU vs GPU 实际MFU差距



InferenceX v2 给出的横向对比结论并不温和。Blackwell B200 的峰值算力标注为行业天花板，但实际推理工作负载中，TPUv8i（Ironwood）的模型FLOP利用率（MFU）反而更高。这不是精度之争，而是工程团队在深度定制内核后拿出的结果。Anthropic 拥有前 Google 编译器专家，他们对 TPU 软件栈的投资是真实的。B200 在 GEMM 最大化测试中仅能达到峰值约 70%，Hopper 在 80% 左右，而 AMD MI300 系列仅有 50%-60%。TPU 的外化并不是简单地把芯片卖出去，而是把内部工具链和定制能力逐步开放给外部客户。这个渐进过程意味着 TPU 的 MFU 正在追上甚至超过同代的 GPU 外放版本。



![程序员 reaction：柯南00070 出现了](https://iili.io/CCZAMap.png)
> 数据不会说谎





![B300 50% HBM 在 Agentic 负载下的转化路径](https://iili.io/n3vExNj.png)
> B300 50% HBM 在 Agentic 负载下的转化路径



B300 相比 B200 多出的 50% HBM 容量，在 agentic 工作负载下确实能挤出额外吞吐量。InferenceX 数据显示，在 384 并发 agent 追踪场景下，B300 配合 vLLM 的简单 DRAM offload 策略，可以实现 91% 的 HBM 缓存命中率。这 91% 的命中率不是来自什么黑科技，而是容量本身带来的红利。相比之下，B200 在相同负载下命中率明显更低。问题在于，B300 和 B200 的 TCO normalized 性能相当，B300 多出的吞吐量完全来自 HBM 容量而非架构升级。这意味着英伟达在 agentic 推理这条赛道上，继续卖容量而不是卖架构创新。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 市场用脚投票



英伟达的官方回应很短。他们在 Facebook 和开发者博客上引用 InferenceX 数据，强调 GB300 NVL72 是"最佳性能驱动最低推理成本"的平台。这个表述有意避开了 MFU 的直接对比，转而强调总吞吐量。市场在 48 小时内的反应更有趣：英伟达单日蒸发 5930 亿美元后次日反弹 8.9%。机构投资者没有恐慌，散户在卖出。工业界的承诺也没有动摇——雪佛龙和 GE Vernova 在 DeepSeek 事件之后宣布为数据中心建造专用发电厂。这些公司的决策周期以年为单位，他们不会因为一篇分析报告就改变数十亿美元的基础设施投入。

CUDA 的护城河正在变窄，但不是被某张图表击穿的。是 Anthropic 这样的客户愿意投入工程资源定制 TPU 内核，是 InferenceX 框架让 MFU 成为可公开核验的指标，是 B300 靠堆 HBM 容量而不是架构升级来获得 agentic 负载下的边际优势。这三个信号叠加，构成了护城河变窄的完整证据链。客户开始用每美元实际 token 吞吐量来衡量硬件价值，而不是被峰值 FLOPs 吸引。这个转变对英伟达来说是渐进的，对英伟达以外的玩家来说是机会窗口。

InferenceX v2的数据给选型问题提供了一个可量化的锚点。Blackwell B200的峰值算力标注为行业天花板，但Anthropic在TPUv8i上的实际MFU更高。这不是精度之争，而是工程团队在深度定制内核后拿出的结果。Anthropic拥有强大的工程资源和前谷歌编译器专家，他们投入了大量人力去理解TPU栈并定制算子。结果是可以达到大幅更高的MFU和更好的每PFLOP性能价格比。



![明知不合理但还是把锅背上的表情](https://iili.io/CuzaQHP.png)
> 数据揭示的真相





![TPU与GPU选型边界决策](https://iili.io/n3vG5X4.png)
> TPU与GPU选型边界决策



选择TPU的前提不是预算，而是能力。TPU栈并不那么容易使用。在谷歌内部，TPU受益于优秀的内部工具，这些工具不对外部客户开放，这使得开箱即用的性能较弱。这只适用于小型和/或懒惰的用户。Anthropic两者都不是。他们了解TPU堆栈，也深入了解自己的模型架构，可以投资定制内核以推动高效率。对于没有这种工程储备的团队，TPU的「性价比」只是纸面数字。

限制峰值FLOPs宣称的因素不只是设计，还有电力传输。芯片无法维持峰值数学运算中使用的时钟速度。NVIDIA和AMD实施动态调频，在实际推理负载中很少能跑到标称峰值。SemiAnalysis的测量方法显示，Hopper仅达到峰值约80%，Blackwell落在70%左右，AMD MI300系列在50%-60%之间。这意味着GPU厂商卖的峰值FLOPs是一辆F1赛车的极速，而你真正需要的是公交车上50个人的通勤效率。TPU的优势在于它的架构从一开始就围绕推理场景设计，动态功耗管理的空间更大。

AgentX v3的指标体系进一步改变了比较的维度。它不再只看TTFT或单次延迟，而是把交互性纳入北极星指标。公式本质上是1/TPOT与TTFT惩罚项的组合。TTFT越高，惩罚越重。这直接反映了agentic场景下多轮对话的真实代价。单纯看prefill阶段的峰值吞吐没有意义。真正的瓶颈在decode阶段的交互节奏。用户等待时间叠加agent内部调用，会让GPU和TPU的实际表现差距比基准测试显示的更复杂。



![程序员 reaction：特朗普00018 完美](https://iili.io/CrB9MrX.png)
> 真相在交付成本里





![Agent场景下的真实成本构成](https://iili.io/n3vMJG2.png)
> Agent场景下的真实成本构成



选型决策的核心是TCO，不是单卡价格。TCO包含显性成本和隐性成本。显性成本包括硬件采购、电力消耗和运维人力。隐性成本更难量化但往往决定盈亏：调优周期长短、生态迁移难度、性能不确定性带来的风险评估成本。当客户深度定制TPU内核后，Anthropic达到了大幅更高的MFU。但这种成果需要3到6个月的工程投入。对于推理负载稳定的团队，这个投入值得。对于需要快速迭代模型架构的团队，GPU的开发效率优势会抵消算力差距。

选型决策可以收敛到三条清晰路径。第一条是深度定制路径，适合有编译器专家、推理负载稳定的大型团队。TPU在这里能提供最高性价比，实测MFU优势可达50%。第二条是快速部署路径，适合中小团队或模型迭代频繁的实验室。GPU生态成熟，工具链完善，开发效率优先于理论峰值。第三条是混合路径，对。这条路径正在成为主流。推理层跑在TPU上获得成本优势，训练和实验跑在GPU上保留灵活性。InferenceX的数据支持这种组合策略：不同阶段用不同硬件，整体TCO最优。



![程序员系列表情：不要跟我说什么原理，拿起键盘就是干](https://iili.io/CAYt19e.png)
> 工程团队的耐心是最被低估的能力





![CUDA护城河的三层结构](https://iili.io/n3vMDKB.png)
> CUDA护城河的三层结构



CUDA的护城河不是被技术击穿的，是被工程团队的耐心一点点填平的。这种耐心体现在两个维度。一是对硬件栈的深度理解能力，Anthropic的前谷歌编译器专家懂得如何榨干TPU的每一分性能。二是对长期ROI的耐心，愿意用3到6个月的调优周期换取后续数年的成本优势。这两点都不是短期采购决策能覆盖的。它们需要工程文化、技术储备和组织耐心的共同支撑。

从行业趋势看，Google的TPU外化正在加速。InferenceX观察到TPU堆栈的快速外化、客户群的增长，以及Ironwood等新一代芯片的推进。这不是Google单方面的努力，而是市场对性价比的重新定价。当Anthropic、OpenAI等头部玩家都在寻找多样化供应链时，单一厂商的定价权会自然削弱。CUDA的优势不会消失，但它会从「唯一选择」变成「可选之一」。这对整个行业是健康信号。

对于正在做选型决策的团队，下一步可以立即执行的有三件事。第一，用InferenceX的公开基准测试复现你的工作负载，不要只看厂商宣传册上的峰值数字。第二，评估团队是否具备编译器级定制能力，如果没有，TPU的3到6个月学习曲线会吃掉性价比优势。第三，计算TCO而不是单卡价格，把调优周期、迁移成本、运维复杂度都纳入模型。数据会给你答案。

## 参考文献
[1] TPU Inference Externalization Full Steam Ahead - InferenceX. https://newsletter.semianalysis.com/p/tpu-inferencex-full-steam
[2] SemiAnalysis深度解读TPU--谷歌冲击“英伟达帝国” - 华尔街见闻. https://wallstreetcn.com/articles/3760377
[3] AgentX - InferenceXv3：CUDA 护城河在 agentic 推理中还站得住吗？ | InferenceX. https://inferencex.semianalysis.com/zh/blog/agentx-inferencexv3-does-cuda-moat
[4] 文章 | InferenceX by SemiAnalysis. https://inferencex.semianalysis.com/zh/blog
[5] InferenceX v2: NVIDIA Blackwell Vs AMD vs Hopper - Formerly InferenceMAX. https://newsletter.semianalysis.com/p/inferencex-v2-nvidia-blackwell-vs
[6] AgentX - InferenceXv3: Does CUDA Moat Hold up in Agentic Inferencing?. https://newsletter.semianalysis.com/p/agentx-inferencexv3-does-cuda-moat
[7] NVIDIA Blackwell Leads on SemiAnalysis InferenceMAX v1 Benchmarks | NVIDIA Technical Blog. https://developer.nvidia.cn/blog/nvidia-blackwell-leads-on-new-semianalysis-inferencemax-benchmarks
[8] InferenceX: Continuous OSS Inference Benchmarking. https://www.youtube.com/watch?v=P0l7CHl5HfA
