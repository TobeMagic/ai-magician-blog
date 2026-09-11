---
title: "Lambert 算了一笔账：CUDA 绑定开源生态，每年值 100 亿美元"
date: "2026-09-11 01:00:02"
updated: "2026-09-11 01:09:09"
permalink: "posts/2026/09/11/lambert-算了一笔账cuda-绑定开源生态每年值-100-亿美元/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/11/lambert-算了一笔账cuda-绑定开源生态每年值-100-亿美元/"
article_id: "45425c49-1a12-4ec6-8856-b1af4576de54"
description: "Nvidia 以 129 亿美元收购 HuggingFace，在许多人看来这是一笔高价。但研究者 Nathan Lambert 认为，这笔交易恰恰是最划算的一笔——HuggingFace 的核心价值不在于模型或数据，而在于它对开源 AI 社区讨论方向的影响力。Lambert 估算，这种软实力每年值约 100 亿美元，而这对 Nvidia 来说，比自训练前沿开源模型更便宜。"
cover: "/var/lib/aimagician/artifacts/covers/45425c49-1a12-4ec6-8856-b1af4576de54/623dd33d-3563-4007-8559-13934ed38dce/cover.png"
imgTop: false
---

129 亿美元买下 HuggingFace，Nvidia 买的不只是一个模型库。Nathan Lambert 看完这笔交易后说了一句耐人寻味的话：「这其实是 Nvidia 能做的最便宜的收购之一。」

![程序员 reaction：柯南00089 找到你了](https://iili.io/CCZubTX.png)
> 这笔账，Lambert 算得清楚



The Information 最先报道了这笔交易，随后 Nvidia 官方确认：129 亿美元（约 130 亿），收购这家总部位于巴黎的开源 AI 平台。Jensen Huang 在 X 上发帖称，开源模型能增强安全性和创新扩散，而 Nvidia 将成为 HuggingFace 最大的开源模型和数据贡献者。

![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 官方表态很克制



表面上看，129 亿美元不便宜——Motley Fool 指出，这笔交易的价格约为 HuggingFace 年化收入的 86 倍。但如果把 HuggingFace 当作一个「平台公司」来估值，这个数字确实偏离常识。真正的问题在于：Nvidia 买的到底是什么。

## Nvidia 为何瞄准 HuggingFace

答案藏在 Nvidia 近年的一条战略主线里。

过去十年，Nvidia 的护城河是 CUDA——一套将 GPU 硬件与开发者工作流绑定的软件体系。模型在 CUDA 上训练，推理库优先适配 CUDA，框架文档大量依赖 CUDA 示例。开发者习惯了这个生态，迁移成本很高。[[reaction=backend-system-design|caption=CUDA 不只是工具，是基础设施]]

但 CUDA 的绑定有一个盲区：它只覆盖了「用什么硬件跑模型」这一层。模型从哪来、谁在推荐、社区以什么范式组织项目——这些入口不在 Nvidia 手里。

HuggingFace 恰好填补了这个空白。它是开源模型事实上的分发中枢，是 Transformer 库的维护者，是社区讨论方向的放大器。控制这里，意味着对模型叙事拥有话语权。

``mermaid


![CUDA 生态增强回路](https://iili.io/nKi9ED7.png)
> CUDA 生态增强回路


这条增强回路一旦建立，Nvidia 就从「卖铲子的人」变成了「定义矿脉走向的人」。[[reaction=dalao-carry|caption=从硬件商到规则制定者]]

## Lambert 的核心判断：软实力每年值约 100 亿美元

Nathan Lambert 是 Interconnects AI 的研究者，曾在 Latent Space 等节目中讨论 RLHF 和 LLM 评估。他对这笔交易的评论核心只有一个词：steal。

他在 X 上的原话是：「HuggingFace 的核心能力，是以相对有限的资源，影响 AI 讨论方向和演进路径的能力。对 Nvidia 这样的体量和资本来说，这种能力每年的价值至少是 100 亿美元。而 129 亿是一次性买断，换来的是可持续的年度收益。」[[reaction=money-red-envelope|caption=129 亿买不断每年 100 亿的现金流]]

这个估算是定性的，不是精确的财务模型。但逻辑链条是清晰的：HuggingFace 的影响力不是来自训练了多少模型，而是来自它决定了哪些模型被关注、哪些评测标准被采纳、哪些工程实践成为默认选项。这些选择反过来塑造了 CUDA 生态的默认配置。

更重要的是，相比自训练前沿开源模型，收购 HuggingFace 的成本要低得多。训练一个顶级开源模型需要数千张 H100 和数百万美元；而收购一个已经拥有生态的平台的成本，反而更接近「租金」而非「购置」。[[reaction=overtime-bricks|caption=自己建 vs 直接买，算法工程师都懂]]

当影响力可以被定价，129 亿美元可能只是一笔「年租金」——每年换来约 100 亿美元等效价值的生态引导力。[[reaction=bricks-signoff|caption=这笔账不算难算]]

这笔交易的信息来源是 The Information，随后在多家媒体得到确认。交易的数字是 129 亿美元，收购标的是 HuggingFace，一家拥有数百万 AI 开发者的开源模型与工具平台。2025 年底 HuggingFace 曾拒绝 5 亿美元的投资，理由是不想头上有能影响决策的大股东。一年后，同样的公司接受了约 130 亿美元的全面收购，决策权的代价变了。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 这笔账值得算一算



## Nvidia 的 129 亿美元收购：是贵还是值？

### 交易背景：Nvidia 为何瞄准 HuggingFace

HuggingFace 在 2025 年推出了 Transformers v5 库，同时继续运营着全球最大的开源模型仓库之一。截至交易公布时，Nvidia 已经是 HuggingFace 上最大的开源模型和数据贡献方。Jensen Huang 在 X 上发帖称，「开放模型强化安全性、加速创新扩散，并enable主权」。

但真正驱动这笔交易的，不是模型仓库本身。Nvidia 过去靠 CUDA 生态占据算力入口的主导地位，现在要把开源分发入口也抓在手里。模型在变便宜、变同质化，但模型与用户之间的管道——分发、路由、托管、社区——反而成为稀缺资源。中间层正在成为新的战场。

BBC 在报道中引用了一位社区开发者的担忧：「谁曾以为 HuggingFace 可能是逃离 Civitai 审查的安全港湾，现在可能要面对一个陌生的现实了。」这种担忧指向一个核心问题——当 HuggingFace 从独立第三方变成 Nvidia 子公司，它的中立性还能维持多久？



![群里聊得热闹但自己得继续搬砖时的表情](https://iili.io/Cuzcmk7.png)
> 先看看账是怎么算的



### Lambert 的核心判断：软实力每年值约 100 亿美元

Nathan Lambert 的判断建立在一个更基础的观察上：HuggingFace 的真正能力，是用相对有限的资源影响 AI 讨论的方向。

他在 2025 年 9 月发布的 X 帖文中写道：「HuggingFace 的核心能力在于理解如何影响 AI 的讨论和方向，相对于他们的资源而言，这是极其高效的。」他进一步估算，对 Nvidia 这样体量庞大的公司来说，这种影响力每年值约 100 亿美元，而 129 亿美元的收购价，换取的是每年都能持续获得这份影响力的能力。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 每年 100 亿的软实力，129 亿买一次到位



这笔账的逻辑是这样的：Nvidia 如果选择不收购，而是自训练前沿开源模型，成本并不低。Lambert 在 2025 年 6 月撰写的分析中指出，训练顶级开源模型的成本正在快速攀升，而 OpenAI 和 Anthropic 等闭源厂商在真实世界鲁棒性上仍然保持领先。在这种情况下，收购一个已经拥有社区信任、分发渠道和影响力杠杆的平台，比从零构建要划算得多。

更重要的是，这种影响力不是静态的。HuggingFace 上的每一个热门模型、每一次社区讨论的焦点转移，都在潜移默化地塑造开发者对「什么是好模型」「用什么架构更高效」的认知。Nvidia 收购的不是一个数据库，而是一个持续产生软实力的机器。

### CUDA 与开源生态的绑定逻辑

CUDA 对 Nvidia 的价值，不在于它是一个编程接口，而在于它构建了一个正反馈循环：越多的开发者使用 CUDA，就越多的人为 CUDA 开发工具；工具的丰富又吸引更多开发者，循环不断自我强化。

HuggingFace 是这个循环中的关键一环。它把模型分发、代码复用、社区协作压缩到了一个平台内，大幅降低了开发者尝试新模型的成本。当一个新的 Transformer 架构在 HuggingFace 上发布，配套的 CUDA 优化代码往往同步出现，模型才能发挥真正的性能。反过来，Nvidia 在 HuggingFace 上的高贡献量，也让 CUDA 的兼容性成了默认选项，而不是某个需要额外努力的配置项。

``mermaid


![CUDA 与开源生态的正反馈循环](https://iili.io/nKi9Dxt.png)
> CUDA 与开源生态的正反馈循环


这个循环的脆弱性在于信任。当 HuggingFace 还是一家独立公司时，它的社区信任来自其中立性；它不会因为某个模型跑在 Nvidia GPU 上更快就优先推广它，也不会因为某个闭源模型的基准测试更好就改变社区的讨论基调。一旦它被 Nvidia 收购，这种信任就会被重新评估。


![程序员 reaction：柯南00118 不是吧](https://iili.io/CAlY1oP.png)
> 信任是最难定价的资产



### 这笔收购的边界：什么条件下会翻车

这笔交易有一个明确的边界条件：如果 Nvidia 在收购后过度干预 HuggingFace 的内容策略，或明显偏向自家硬件，社区信任会迅速瓦解。

Lambert 在 LinkedIn 上明确提到这一点：「挑战在于 Nvidia 需要保持 HuggingFace 作为开放平台的中立性。如果社区认为 HF 变成了 Nvidia 的营销渠道，这份软实力的价值就会大幅缩水。」软实力的本质是不可强迫的——你无法通过命令让开发者真心认同某个方向，只能让社区自己得出那个结论。

另一个边界条件是反垄断审查。据公开信息，这笔交易需要通过全球主要司法辖区的反垄断审查，预计 2027 年上半年完成。一旦审查失败，Nvidia 将损失巨额的整合成本和时间窗口。

还有一个更微妙的边界：中国市场的反应。HuggingFace 是国内大模型团队发布和下载开源模型的主要平台，一旦被 Nvidia 控股，国内团队在合规和政策层面的不确定性会显著上升。这直接影响 Nvidia 在中国市场的开放策略。



![大佬系列表情：给大佬洗脚](https://iili.io/CLX05Ob.png)
> 软实力的天花板是信任，地板也是信任



The Information 早在 2026 年 8 月 26 日就披露了这笔交易的初步协议 [6]，而 Nvidia 官方博客随后给出了正式声明 [12]。外界的第一反应通常是「贵」。Motley Fool 在 2026 年 9 月 6 日的测算显示，这笔交易对应约 86 倍的年化收入 [7]；而 Interconnects AI 在 Substack 上的追踪笔记也记录了市场对估值的震荡反应 [10]。如果只看资产负债表，这确实像一笔溢价收购。但 Lambert 的视角完全不同。他在 2025 年 9 月 X 平台上曾明确提出「Nvidia should acquire huggingface as a cheap way to build deeper integrations between CUDA and the open-source ecosystem」[18]；而在 2026 年初的「OOO 回来后补发」推文中，他进一步把这笔账算到了软实力层面 [17][19]。

## 参考文献
[6] Reuters. "Nvidia agrees to buy Hugging Face for $12.9 billion, The Information reports." Aug 26, 2026. https://lufkindailynews.com/news_reuters/business/nvidia-agrees-to-buy-hugging-face-for-12-9-billion-the-information-reports/article_befd777c-9a61-5feb-8723-289b1e68c1f5.html
[12] NVIDIA Blog. "NVIDIA to Acquire Hugging Face." https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face
[13] 网易订阅. "英伟达 129 亿美元收购 Hugging Face：开源 AI 核心枢纽或易主." https://www.163.com/dy/article/L5DPSRB50556OXHR.html
[14] Yahoo Finance. "Nvidia confirms $13 billion acquisition of open-weight AI platform Hugging Face." https://finance.yahoo.com/markets/article/nvidia-confirms-13-billion-acquisition-of-open-weight-ai-platform-hugging-face-141058641.html
[17] Nathan Lambert. LinkedIn post. "I never got to comment on Nvidia-HF..." Sep 2025. https://www.linkedin.com/posts/natolambert_i-never-got-to-comment-on-nvidia-hf-because-activity-7503511074294415360-DnUr
[18] Nathan Lambert. X (Twitter) post. "Nvidia should acquire huggingface as a cheap way..." Sep 2025. https://x.com/natolambert/status/1973394309840826732
[19] Nathan Lambert. Substack. "Make money doing the work you believe in." Oct 2025. https://substack.com/@natolambert/note/c-333350263
[5] NVIDIA Research. "NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf." 2026. https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf
[7] Motley Fool. "History Says What Nvidia's Last Big Acquisition Became." Sep 6, 2026. https://www.fool.com/investing/2026/09/06/history-says-what-nvidia-s-last-big-acquisition-became-hugging-face-will-cost-nearly-twice-as-much/
