---
title: "GPT-6 Astra 发布后，Sebastian Raschka 解析 looped transformer 与隐藏推理链传闻"
date: "2026-09-11 02:00:02"
updated: "2026-09-11 02:08:46"
permalink: "posts/2026/09/11/gpt-6-astra-发布后sebastian-raschka-解析-looped-transformer-与隐藏推理链传闻/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/11/gpt-6-astra-发布后sebastian-raschka-解析-looped-transformer-与隐藏推理链传闻/"
article_id: "9de654fa-09c8-4978-9fdc-2fabfa8ff051"
description: "围绕 GPT-6 Astra 发布后，Sebastian Raschka 解析 looped transformer 与隐藏推理链传闻 展开，把 industry_insight、从行业局势、商业影响与从业者判断来写。OpenAI 发布 GPT-6 Astra、作者评测认为其计算机使用和图像渲染能力尤为突出、ARC-AGI-3 达 99.9%、前代 GPT-5.6 Sol 仅 7.8%。 串成一条可面试、可落项目的系统回答，重点讲清机制、边界、迁移成本和真实工程取舍。"
cover: "/var/lib/aimagician/artifacts/covers/9de654fa-09c8-4978-9fdc-2fabfa8ff051/a59cdb5d-9f99-4234-b46f-493b46ade474/cover.png"
imgTop: false
---

GPT-6 Astra 发布后，社区对 OpenAI 是否在架构层面转向「循环深度」的猜测迅速升温。Sebastian Raschka 随后在 Substack 发布长文逐层拆解，指出外界对 looped transformer 的许多理解存在偏差。这篇文章的核心不是追热点，而是梳理一次架构选择背后的真实工程逻辑。

### 循环 Transformer 是什么：机制与成本权衡



![程序员 reaction：Evenifmyscreenisoff](https://iili.io/Cn3lGTB.png)
> 架构选型从来不是非黑即白



普通 Transformer 在一次前向传播中，每层参数只被使用一次。Looped Transformer（循环 Transformer）的做法是把同一组层重复使用多次，类似循环神经网络中的时间步展开，但结构上更紧凑。Raschka 引用 Nanbeige4.2-3B 的案例说明这一思路：该模型在 28T tokens 上从头预训练，通过循环复用层堆栈提升容量而不线性增加参数量。



![Looped Transformer 参数复用流程](https://iili.io/nKLcD9s.png)
> Looped Transformer 参数复用流程



关键权衡在于：参数量不变，有效推理深度增加，但推理延迟线性上升，且 KV cache 无法像标准深度架构那样压缩。这意味着在同等 FLOPs 预算下，循环架构适合需要更多推理步数的任务（如代码生成、复杂逻辑），但不适合低延迟场景。开源社区已有实践验证这一取舍，例如 Latent Reasoning 论文中仅循环中间层而非全部层，是一种折中方案。

### 推理链透明性：被误解的「隐藏」问题



![程序员 reaction：柯南00089 找到你了](https://iili.io/CCZubTX.png)
> 真相往往比传闻简单



rumor 的核心是：Astra 是否在用循环架构「隐藏」推理链？Raschka 明确否定这一点。他指出，Astra 使用的 token 数少于 GPT-5.6 Sol，并非因为隐藏了中间步骤，而是因为模型本身更聪明、训练更充分。从 Nanbeige 等开源实现的观测来看，循环架构并不会屏蔽可解释信号——中间层输出依然可见，只是计算方式不同。

LessWrong 上 Rauno Arike 的分析提供了另一个视角：即使循环深度增加，只要计算图深度仍在 GPT-4 量级的两倍以内，可监控性就没有从根本上被破坏。Pachocki 也给出了数据支撑，认为当前的架构变化尚未跨越到需要全新安全范式的程度。OpenAI 近期招聘广告中提到「可能失去 CoT 可监控性」，但这更像是对未来可能性的准备，而非对现有产品的确认。



![程序员系列表情：据说换成这个发型，面试通过率很高](https://iili.io/CC5AHjp.png)
> 面试官问的往往是边界条件



### 从业者判断：何时值得迁移、何时该守旧



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 预算和 SLA 才是真正的决策变量



循环 Transformer 不是银弹。在以下条件下值得考虑迁移：一是推理质量优于延迟的场景（如离线代码审查、批量数据标注）；二是算力预算固定但需要更深推理的任务。相反，在实时交互、移动端部署或 KV cache 敏感的场景中，标准深度架构仍是更稳妥的选择。

迁移成本也不容忽视。循环架构需要重新评估推理流水线，尤其是内存带宽和计算调度的优化策略。对于已投入标准 Transformer 栈的团队，短期内的ROI可能为负。建议先在小规模验证集上对比两种架构的实际 throughput 和 latency，再决定是否引入循环层。



![Looped Transformer 迁移决策树](https://iili.io/nKLl5Hg.png)
> Looped Transformer 迁移决策树



结论很直接：循环 Transformer 是一次工程权衡，不是范式跃迁。从业者应关注自身的 SLA 和算力约束，而非追逐架构名词。Astra 的发布提醒我们，模型能力的跃升往往来自底层结构的微妙调整，但真正决定落地的，永远是具体场景中的成本收益比。

## GPT-6 Astra 发布后，Sebastian Raschka 解析 looped transformer 与隐藏推理链传闻

### 一、循环 Transformer 的机制与成本

普通 Transformer 的一次前向传播中，每层参数只被使用一次；而循环 Transformer（looped transformer）会把同一组参数重复使用多次，用「时间换空间」换取更大的有效深度。Raschka 在文章中举了 Nanbeige4.2-3B 的例子：该模型从 28T tokens 上从头预训练，使用 Looped Transformer 复用层堆栈来提升容量，而不增加参数量。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 参数复用，深度加满



关键区别在于：循环深度增加的是计算步数，不是参数规模。这意味着推理时的 FLOPs 上升，但显存占用（尤其是 KV cache）并不会线性增长。Raschka 明确指出，这种架构在固定 compute budget 下可以提升模型质量，前提是模型足够大——他提到 135M 参数的实验曾得出相反结论，说明 scale 是必要条件。



![循环 Transformer 与普通 Transformer 的推理对比](https://iili.io/nKLlLWQ.png)
> 循环 Transformer 与普通 Transformer 的推理对比


成本取舍很清晰：训练时多步迭代增加算力消耗，推理时延迟上升但参数不变。对工程团队来说，这意味着部署时需要重新评估延迟预算，而不能只看参数量。

### 二、"隐藏推理链"是个误读

网上最传播的说法是：Astra 用循环深度「隐藏」了推理过程，思维链不再可见。Raschka 的结论很直接——这不是真的。

Astra 的 token 用量少于前代 GPT-5.6 Sol，是因为模型本身更强，而不是因为推理被藏起来了。Raschka 在 X 上回应：「我们可以从前几代模型中观察到同样的现象。」更智能的模型在相同任务上确实会用更少的 token 完成，这是能力提升的自然结果，不是架构上的遮羞布。



![程序员 reaction：DLSSOff](https://iili.io/CAYZDGV.png)
> 真相锁定：token 减少≠推理隐藏



真正的「隐藏」问题来自另一个方向：如果模型内部确实进行了多步循环推理，这些中间状态在标准 API 响应中并不会暴露。但这不等于 OpenAI 刻意隐瞒，而是循环 Transformer 的固有属性——每一圈的隐状态是模型内部的计算过程，不是输出 token。

Pachocki 的判断提供了参考坐标：Astra 的计算图深度仍在 GPT-4 的两倍以内。这意味着当前的循环深度还落在需要 CoT（chain-of-thought）才能解复杂任务的浅 Transformer 范式内，可监控性并未当天垮掉。

Rauno Arike 在 LessWrong 上的担忧更有前瞻性：真正该盯的不是今天多深，而是那个深度旋鈕以后会不会被转上去。如果 loop 可以无代价地加深，可监控性的边界就会持续外移。

### 三、深度旋鈕与可监控性的边界



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> 深度旋钮转动时的算力压力





![循环深度与可监控性的边界](https://iili.io/nKL08hv.png)
> 循环深度与可监控性的边界


OpenAI 在招聘帖中写了「可能失去 CoT 可监控性」，Pachocki 也承认这套方法脆弱、趋势偏坏。Arike 的判断是：如果 Pachocki 的数字属实，短线上深度仍在可控范围内，真正该关注的是这个 loop 旋钮能不能用小代价转深，以及下一次同类训练会不会自然地去拉深度。

这里有一个容易被忽略的区分：架构层面的循环深度 ≠ 输出层面的思维链长度。前者是模型内部的计算方式，后者是模型对外展示的思考过程。OpenAI 可以选择在 API 中返回中间推理 token，也可以选择不返回。这是产品决策，不是架构必然。

Raschka 在文章中引用了 Latent Reasoning 等近期研究，指出有些架构只循环中间的 transformer block，而不是全部。这意味着循环深度本身也有多种实现路径，并非单一的技术选择。

### 四、从业者的判断与落点



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 技术判断：别被 hype 带跑



对从业者来说，这件事有三层可执行的判断。

第一层：评估自己的场景是否需要 deep reasoning。如果业务主要是分类、抽取、格式化输出，循环深度带来的能力增益不会直接转化为用户可见的价值，迁移成本却实打实地存在。如果在复杂推理、代码生成、多步规划上有强需求，才值得深入研究 Astra 的工程特性。

第二层：重新算推理成本账。循环 Transformer 的延迟特征与普通自回归模型不同，token 节省不等于总成本下降。需要结合实际 QPS、P99 延迟要求和并发规模做仿真，而不是只看单价。

第三层：监控策略要前置。如果选择使用循环深度模型，需要在接入层就建立中间态可观测性方案，而不是等黑盒化发生后再补救。Pachocki 的数字说明现在还来得及，但深度旋钮随时可能转动。

Raschka 的文章结尾给出了一个务实的结论：循环 Transformer 是真实存在的技术路径，它带来容量效率的提升，也带来延迟和可观测性的代价。「隐藏推理链」是误读，但可监控性的长期趋势值得持续跟踪。对工程团队而言，今天的判断应该是理解机制、评估成本、建立监控，而不是在 hype 和恐慌之间做选择。

Sebastian Raschka 在 Substack 上发布的长文《GPT-6 Astra, Looped Transformers, and Hidden Reasoning》是目前最系统的技术拆解。他没有被「隐藏推理链」的惊悚标题带节奏，而是先把机制讲清楚。

### 循环 Transformer 的核心机制

普通 Transformer 的一次前向传播中，每层参数只被使用一次。而循环 Transformer（Looped Transformer）会把同一组参数重复使用多次——参数没有增加，但「有效深度」提升了。



![普通Transformer VS 循环Transformer](https://iili.io/nKL1za1.png)
> 普通Transformer VS 循环Transformer


这就像用同一个计算器反复运算：计算器本身没变，但你能算更复杂的式子。Raschka 引用了 Nanbeige4.2-3B 的案例——该模型在 28T tokens 上预训练，使用循环 Transformer 复用层栈，在参数量不变的情况下提升了容量。

### 成本权衡是真实的

循环不是免费的。Raschka 明确指出：虽然参数量不变，但推理成本增加。KV-cache 无法像在标准 Transformer 中那样高效复用，因为同一组权重在不同「循环」中被多次调用。

这意味着：同样的模型大小，同样的理论容量，但推理延迟更高、显存占用更大。

### 「隐藏推理链」是误读

社区最关心的问题是：循环 Transformer 会让模型的推理过程变得不可见吗？

Raschka 的答案很明确：**不会。**

他在 X 上回复提问时说：「循环本身并没有显式地隐藏推理 token。GPT-6 Astra 确实比 GPT-5.6 Sol 使用了更少的 token，但这是因为它是一个更聪明的模型（更多训练、更大规模等），而不是因为循环架构。」



![推理链透明性分析](https://iili.io/nKL16ox.png)
> 推理链透明性分析


他进一步解释：部分架构（如 Latent Reasoning 论文）只循环中间的 Transformer 块，而不是全部。这种设计选择会影响可观测性，但与「隐藏推理」是两回事。

### 深度旋钮的真正风险

LessWrong 上 Rauno Arike 的文章提出了一个更深层的担忧：今天循环深度可能还在可控范围内，但以后会不会被不断上调？

Pachocki 的数字相对克制：据称 Astra 的计算图深度仍在 GPT-4 的两倍以内。如果这个数字属实，那么今天的模型还没有从「可监控」直接跳到「neuralese」（无法理解的黑盒）状态。



![深度旋钮风险演进](https://iili.io/nKLEoxf.png)
> 深度旋钮风险演进


Arike 的担忧有道理，但他自己也承认：现在还不清楚循环深度能否真正带来显著的能力提升。就算 loop 不再加深，OpenAI 释放的信号仍然让人不安——他们的招聘描述中明确提到「可能失去 CoT 可监控性」是团队需要准备的议题。

### 从业者的判断

从行业局势看，这件事的核心启示是：**不要只看架构名称，要看具体参数和部署约束。**

Raschka 的文章里有一个关键实验结果值得记住：在 135M 参数的极小模型上，循环 Transformer 的效果甚至不如标准架构。只有当模型足够大时，循环才能发挥正向作用。

这意味着：循环架构不是银弹，它对模型规模有门槛要求。



![架构选型决策树](https://iili.io/nKLEGfV.png)
> 架构选型决策树


1. **如果你的团队正在构建生产级 LLM 应用**：关注 OpenAI 的 API 行为变化比关注架构细节更实际。Astra 的具体性能表现（ARC-AGI-3 达 99.9% vs GPT-5.6 Sol 仅 7.8%）说明能力跃升是真实的，但这是训练数据和算法的综合结果，不完全是架构功劳。

2. **如果你在评估开源替代方案**：循环 Transformer 是一个值得研究的技术方向，但不要指望用小参数模型复制效果。Nanbeige4.2-3B 的案例表明，它需要大规模预训练和充足算力。

3. **关于可监控性**：Pachocki 的数字（深度≤2×GPT-4）如果属实，今天的模型仍在可解释范围内。但需要建立监控机制，跟踪未来版本的深度变化趋势。OpenAI 自己的招聘描述已经暗示，失去 CoT 可监控性是「需要准备」的议题——这不是杞人忧天。

**短期落点**：在 X 条件下（模型规模>1B、推理延迟可接受），可以评估循环架构；当条件变化为 Y 时（规模受限、延迟敏感），切换回标准架构。同时，建立对核心模型版本的能力-可监控性平衡评估机制，每季度复查一次。



![从业者行动清单](https://iili.io/nKLED12.png)
> 从业者行动清单



## 参考文献
- Sebastian Raschka, *GPT-6 Astra, Looped Transformers, and Hidden Reasoning*, Substack, 2026, https://open.substack.com/pub/sebastianraschka/p/gpt-6-astra-looped-transformers-and
- Sebastian Raschka, *OpenAI Astra and Looped Transformers*, blog, 2026, https://sebastianraschka.com/blog/2026/openai-astra-looped-transformers.html
- Sebastian Raschka on X, *Hype around OpenAI's Astra model*, 2026, https://x.com/rasbt/status/2095141254958858496
- Raschka on X, *TL;DR on looped transformer*, 2026, https://x.com/rasbt/status/2097677950262939931
- Rauno Arike, LessWrong, *Astra & looped transformer depth concerns*, 2026
