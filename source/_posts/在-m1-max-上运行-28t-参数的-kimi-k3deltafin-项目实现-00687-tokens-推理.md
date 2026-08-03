---
title: "在 M1 Max 上运行 2.8T 参数的 Kimi K3：Deltafin 项目实现 0.0687 token/s 推理"
date: "2026-08-03 08:07:14"
updated: "2026-08-03 09:04:55"
permalink: "posts/2026/08/03/在-m1-max-上运行-28t-参数的-kimi-k3deltafin-项目实现-00687-tokens-推理/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/03/在-m1-max-上运行-28t-参数的-kimi-k3deltafin-项目实现-00687-tokens-推理/"
article_id: "26c4217c-6756-4fbe-8534-f0bec3227087"
description: "Deltafin 项目成功在 64 GB M1 Max 上运行了 2.8T 参数的 MoE 模型 Kimi K3，当前中位推理速度为 0.0687 token/s（14.6 秒/token）。完整安装需约 1.7 TB 本地磁盘，流式模式仅需 215 GB 但推理速度降至 3 分钟以上/token。项目提供 OpenAI 兼容 API 服务器，支持聊天和代码补全，但建议客户端超时设为小时级别。"
cover: "/var/lib/aimagician/artifacts/covers/26c4217c-6756-4fbe-8534-f0bec3227087/26535471-f187-4f66-9cec-2e95ce8819ec/cover.png"
imgTop: false
---



![程序员 reaction：andtheruntimeofyourcode](https://iili.io/CnYM3YP.png)
> 当数据中心还在抢 GPU 的时候，有人在 MacBook 上跑通了 2.8T 模型



## 一个让数据中心都脸红的实验

事情是这样的。Moonshot 发布了 Kimi K3，2.8 万亿参数，100 万 token 上下文，性能直接拉满。然后大家开始抢 GPU，数据中心忙得不可开交。就在这时候，有人用一台 64 GB 的 M1 Max MacBook，把整个模型跑起来了。

不是量化到不能用的那种。是完整运行，输出结果可验证，和云端推理一致。

坦率的讲，我第一次看到这个消息的时候，愣了一下。然后去翻了翻论文，又去看了 Deltafin 的代码。这玩意确实有点东西。

### 0.0687 token/s 是什么概念

14.6 秒出一个 token。写一段 100 字的回复，得等将近 25 分钟。这速度，放在任何实际应用场景里，都是不可用的。

但问题不在于快不快。问题在于，它证明了 2.8T 参数的模型，不必困在数据中心。

我有时候觉得，AI 圈有个很有意思的现象。大家总以为本地 AI 的未来一定是更强的卡、更大的显存、更贵的服务器。但 Deltafin 这个项目，用一种很骚的方式告诉你，架构设计可能比硬件堆料更重要。

### MoE 架构：为什么 2.8T 能跑在 64G 上

Kimi K3 用的是 MoE 架构，Mixture of Experts。这个架构的核心思想是，每个 token 只需要激活一小部分专家，而不是所有参数都参与计算。

具体来说，Kimi K3 有 896 个专家，但每个层每个 token 只激活 16 个。这意味着 98.2% 的参数在每一步推理中都是闲置的。

Deltafin 的巧妙之处就在于此。它不是一次性把所有参数加载到内存，而是按需流式加载。把模型分成两部分，一部分常驻内存，大约 114 GB，包含非专家权重。另一部分通过 HTTP range requests 从 Hugging Face 按需拉取，只加载当前 token 需要的专家权重。

```
%% title: Deltafin 推理流程
flowchart TD
    A[输入 token] --> B[激活路由选择专家]
    B --> C{专家权重在缓存?}
    C -->|是| D[直接加载]
    C -->|否| E[HTTP range request 拉取]
    E --> F[写入本地缓存]
    F --> D
    D --> G[MXFP4 反量化 + GEMV]
    G --> H[输出结果]
```

### 流式加载的巧妙设计

这个设计有几个关键点。首先是 MXFP4 量化。Kimi K3 的专家权重用 MXFP4 格式存储，比传统 INT8 更紧凑，同时保持了较好的精度。

其次是双缓冲层加载。Deltafin 在加载当前层的同时，预加载下一层的数据，减少等待时间。

还有并行专家读取。利用 Apple Silicon 的 NEON 指令集， fused dequant+GEMV kernels 把反量化和矩阵乘法合并成一步，减少内存带宽压力。

说实话，这些优化听起来都很技术，但核心思路其实很简单，就是别让内存带宽成为瓶颈。64 GB 的内存，要装 2.8T 参数的模型，唯一的办法就是让数据流动起来，而不是全部堆在内存里。



![程序员 reaction：ExplainingVirtualMachines](https://iili.io/CCGc5ZB.png)
> 当架构设计足够聪明，硬件限制就变成了设计约束





![程序员 reaction：OurSQL](https://iili.io/CC5uD3g.png)
> 这速度，喝杯咖啡回来，模型还没生成完第一个词



说实话，我第一次看到这个数据的时候，愣是盯着屏幕看了好几秒。0.0687 token/s，换算一下就是 14.6 秒一个 token。你想想看，正常聊天机器人每秒能吐七八个 token，这玩意倒好，14 秒才憋出一个字。但问题是，它真的跑起来了。在 64 GB 内存的 MacBook 上，跑 2.8 万亿参数的模型。

这数字听着离谱对吧。Kimi K3 的完整权重在 4-bit 量化后大约 1.4 TB。你的 MacBook 就算把硬盘塞满，也装不下。那 Deltafin 是怎么做到的？

关键在于 MoE 架构。Kimi K3 是一个 Mixture-of-Experts 模型，总共有 896 个专家，但每个 token 只需要激活 16 个。这意味着什么？意味着你不需要把所有参数都加载到内存里。你只需要加载当前需要的专家权重。

Deltafin 的做法很巧妙。它把模型分成了两部分：一部分是常驻的 spine，大约 114 GB，包含非专家权重，常驻在 NVMe 上。另一部分是专家权重，通过 HTTP range requests 按需流式加载。每次推理时，只加载当前层需要的 16 个专家权重，用完就扔。



![程序员 reaction：we'rechangingthe](https://iili.io/CCG5GX1.png)
> 这架构设计，面试官开始看你工程感了





![Deltafin 流式推理架构](https://iili.io/CU7LOKB.png)
> Deltafin 流式推理架构



这个设计最骚的地方在于，它把存储带宽当成了新的计算资源。M1 Max 的内存带宽是 400 GB/s，而 NVMe 的读取速度也能到 3-4 GB/s。虽然慢，但够用。而且 Deltafin 还做了双层缓冲，一边加载下一层的专家权重，一边计算当前层，把 I/O 延迟藏在了计算下面。

说真的，这个思路让我想起了 P2P 下载。你不是要下载整个文件吗？我分块下载，边下边用。Deltafin 就是 AI 模型的 P2P 下载。



![程序员 reaction：THEODDSOFGENERATING](https://iili.io/CC5AJZN.png)
> 从 P2P 到 AI 推理，技术总是在轮回





![完整安装 VS 流式模式对比](https://iili.io/CU7Q2lS.png)
> 完整安装 VS 流式模式对比



项目作者 gavamedia 在 Reddit 上更新过进度。最早版本大概 1 token 每分钟，后来优化到 4 token 每分钟，再到现在的 0.0687 token/s。虽然还是慢，但每一步都在进步。HN 上有人吐槽说 0.01 token/s 完全不可用，但也有人回怼：能在笔记本上跑 2.8T 模型，这本身就是个存在证明。



![程序员 reaction："Justpatchitinproduction](https://iili.io/CC55m8u.png)
> 存在证明，有时候比实用更重要



从技术角度看，Deltafin 的价值不在于它有多快，而在于它证明了一件事：大模型不一定要困在数据中心。MoE 架构的稀疏性，加上流式加载，让本地推理成为可能。虽然现在的速度还远不够用，但这条路是对的。

Moonshot 自己在数据中心抢 GPU 都抢不过来，结果有人用一台 MacBook 就跑通了。这画面，想想就觉得有点黑色幽默。数据中心里成千上万的 H100 在嘶吼，MacBook 在角落里默默吐着 token，每秒不到一个。但它在吐。真的在吐。

## Research & Source Notes

这个项目的核心实现来自 GitHub 仓库 gavamedia/deltafin，作者通过 YouTube 频道 Data Science in a pocket 做了详细讲解。视频里展示了完整的安装流程和性能数据，是目前最直观的技术参考。

Daily.dev 的技术摘要文章提供了更结构化的架构分析，特别强调了 MoE 稀疏性的利用方式：每层只激活 16/896 个专家，通过 HTTP range requests 按需加载 MXFP4 量化的专家权重。这篇文章还提到了 fused NEON kernels 和 double-buffered layer loading 这两个关键优化点。

Xela 的个人博客记录了在 M1 Max 上的实测体验，16 秒/token 的数据和官方数据吻合。作者特别提到这是 exact、reproducible 的，意味着不是近似推理，而是真正的完整模型。

Reddit 的更新帖展示了项目的迭代过程。从最初的 1 token/min 到后来的 4 token/min，再到现在的 0.0687 token/s，每一步优化都记录在案。这些更新帖是了解项目进展的最及时来源。

Hacker News 的讨论线程提供了社区视角。有人质疑 0.01 token/s 完全不可用，但也有人指出这证明了一个重要事实：本地 AI 可能是比太空数据中心更现实的未来。这个讨论很有价值，因为它触及了本地 AI 的核心争议：速度 vs 可及性。

Morph 的 Kimi K3 技术文档提供了模型架构的官方说明。2.8T 参数、1M token 上下文、Kimi Delta Attention 架构，这些都是理解 Deltafin 为什么能工作的前提。

Simon Willison 的博客从更宏观的角度分析了 Kimi K3 的发布意义。Moonshot 在发布后暂停了新订阅，因为 GPU 供不应求。这个细节很有讽刺意味：模型太强大，连自己都服务不过来。而 Deltafin 用一台 MacBook 就跑通了，虽然慢，但证明了另一种可能性。

Together AI 的开发者指南提供了 Kimi K3 的完整 API 使用方式。虽然 Deltafin 提供的是本地推理，但兼容 OpenAI API 意味着现有的工具链可以直接使用。这对开发者来说是个好消息。

Raschka 的架构笔记深入分析了 Kimi K3 的技术细节，包括 Stable LatentMoE、Quantile Balancing、Per-Head Muon 等创新点。这些架构设计是 Deltafin 能够利用 MoE 稀疏性的基础。

kingy.ai 的新闻报道对比了完整安装和流式模式的性能差异。完整安装可以达到 0.266 token/s，比流式模式快近 4 倍。但 1.7 TB 的磁盘需求也让很多用户望而却步。

explainx.ai 的两篇文章分别从不同角度分析了 Deltafin。一篇聚焦于技术实现，另一篇则讨论了项目的意义。这两篇文章都提到了 HN 上的讨论，说明这个项目在社区里引起了不小的反响。

Facebook 上的分享帖展示了项目的社交媒体影响力。虽然速度很慢，但能在 MacBook 上跑 2.8T 模型这件事本身就很吸引人。这种传播效应也是项目价值的一部分。

Instagram 和 YouTube 上的视频内容提供了更直观的展示。视频里可以看到 M1 Max 的实际运行状态，包括内存使用、磁盘 I/O 和推理速度。这些视觉证据比文字更有说服力。

最后，NVIDIA 开发者论坛上的讨论提供了对比视角。有人尝试在 2x8xB200 节点上运行 Kimi K3，达到了 378 token/s 的吞吐量。这和 Deltafin 的 0.0687 token/s 形成了鲜明对比。但 Deltafin 的优势在于，它不需要 16 张 B200，只需要一台 MacBook。

这些来源共同构成了 Deltafin 项目的技术图景。从架构设计到性能优化，从社区讨论到实际应用，每个环节都有值得研究的地方。虽然项目还在早期阶段，但它已经证明了一件事：大模型的本地推理不是梦，只是还需要时间。



![程序员 reaction：BloatedUl,forcedlogin](https://iili.io/CC5upyv.png)
> 这速度，面试官开始看你工程感了



## 这速度能干嘛

坦率的讲，14.6 秒出一个 token，你基本告别了实时对话。打个比方，你问它一个问题，它开始思考，你喝完一杯咖啡，它吐出一个词。再喝完一杯，又一个词。

但这不重要。重要的是它**能跑**。

Moonshot 自己的数据中心都在抢 GPU，结果有人用一台 64 GB 内存的 MacBook 把 2.8 万亿参数的模型跑起来了。这不是性能优化，这是架构层面的降维打击。

## 架构层面的骚操作

Kimi K3 用的是 MoE 架构，全称 Mixture of Experts。简单说就是 896 个专家，每个 token 只激活 16 个。Deltafin  exploit 的就是这个稀疏性。



![程序员 reaction："THATF*CKJUSTBRAKECHECKED](https://iili.io/Cx2qspa.png)
> MoE 的稀疏性被榨干了



```
%% title: Deltafin 流式加载架构
flowchart TD
    A[用户请求] --> B[路由到对应专家]
    B --> C{专家权重在本地?}
    C -->|是| D[直接计算]
    C -->|否| E[HTTP Range Request]
    E --> F[从 HuggingFace 拉取]
    F --> G[写入本地缓存]
    G --> D
    D --> H[输出 token]
    H --> I{下一个 token}
    I --> B
```

它把大约 114 GB 的非专家权重常驻 NVMe，然后按需流式加载专家权重。MXFP4 量化把精度压到 4 位， fused NEON 内核同时做反量化和矩阵向量乘法，双缓冲让加载和计算重叠。

说真的，这玩意让我想起以前 P2P 下载——边下边播。只不过这次播的是 2.8T 参数的模型。

## 为什么这件事重要

我一直觉得，本地 AI 的未来不一定是更强的卡，而是更聪明的架构。Deltafin 证明了这一点。

数据中心抢 GPU 抢得头破血流，有人在 MacBook 上跑通了。这不是性能竞赛，这是存在证明。它告诉你，2.8T 参数的模型不必困在数据中心。



![程序员 reaction：MicrosoftSQLServer,MongoDB](https://iili.io/CCG5adx.png)
> 大时代啊，朋友们



当然，0.0687 token/s 确实慢到几乎不可用。HN 上有人吐槽说这是完全不可用，成本效益为零。但换个角度想，你花 1.7 TB 磁盘空间，换来一个能在本地跑的 2.8T 参数模型，这交易值不值？

## 踩坑与边界

磁盘 IO 是真正的瓶颈。流式模式下，每次专家权重都要从网络拉取，3 分钟一个 token 不是开玩笑的。完整安装虽然快一些，但 1.7 TB 的磁盘空间不是谁都有。

超时设置也很讲究。建议客户端超时设为小时级别，不然请求还没回来就被砍了。

我自己还没试过完整安装，但想想就觉得兴奋。这尼玛就是开源社区的力量，一个人，一台 Mac，把 Moonshot 数据中心都整不会了。

## 0.0687 token/s 是什么概念

坦率的讲，这个速度确实慢到几乎不可用。14.6 秒一个 token，写一段 500 token 的代码，得等将近 12 分钟。你发一条消息出去，喝杯咖啡回来，模型才吐出第一个词。

但等等。让我先别急着下结论。

0.0687 token/s 这个数字背后，藏着一个更有趣的问题：它证明了一件事——2.8T 参数的模型不必困在数据中心。这不是性能优化文章，这是一个存在性证明。就像你第一次看到有人用算盘解微积分，你不可能用算盘去考试，但你不能否认那个解是对的。

说实话我还记得第一次看到 HN 上那条评论的时候，给我一下子整不会了。有人说「0.01 token/s on an M1 Max is not nearly, this is completely unusable」。对，完全不可用。但作者还是把这件事做出来了，而且还在持续优化。后来的更新已经跑到了 4 tokens/min，也就是大约 15 秒一个 token，跟最初比其实没太大进步，但方向是对的。

## MoE 架构：为什么 2.8T 能跑在 64G 上

说真的，如果你不了解 MoE，这里需要简单科普一下，但我不打算用教科书的方式讲。

想象一下，一个公司有 896 个专家，每个专家只负责自己那一亩三分地。你扔一个问题进来，路由器决定哪 16 个专家来处理。这 16 个专家各司其职，把结果拼起来，就是你的输出。剩下的 880 个专家？他们根本不知道发生了什么。

Kimi K3 用的就是 Stable LatentMoE 架构。896 个专家，每次激活 16 个。路由策略是 Quantile Balancing——直接从 router-score 的分位数推导专家分配，不需要那些花里胡哨的启发式更新，也没有敏感的训练超参数。Per-Head Muon 则让每个注意力头独立优化，适应不同任务。

这就解释了为什么 2.8T 的参数可以跑在 64GB 上。常驻内存的只有那些非专家权重，大约 114GB 的 int8 量化版本。专家权重？按需加载。

```
%% title: Kimi K3 MoE 推理流程
flowchart TD
    A[输入 token] --> B[Router 路由]
    B --> C{选择 16/896 专家}
    C --> D[HTTP Range Request 拉取专家权重]
    D --> E[MXFP4 量化专家权重]
    E --> F[NEON 融合反量化 + GEMV]
    F --> G[双缓冲层加载]
    G --> H[输出 token]
    H --> I{更多 token?}
    I -->|是| A
    I -->|否| J[完成]
    subgraph 本地缓存
    K[~114GB 常驻 spine]
    L[专家权重磁盘缓存]
    end
    D -.HTTP range request.-> L
    L -.缓存命中.-> D
```

## 流式加载的巧妙设计

这块需要注意一下。Deltafin 的核心创新不是模型本身，而是它加载模型的方式。

它用 HTTP range requests 从 Hugging Face 拉取专家权重，边下边跑。不是先下载完再跑，是边跑边下。这玩意让我想起 2000 年代早期的 P2P 客户端，BitTorrent 就是这种思路——你不需要等整个文件下完，边下边播，边下边用。

完整安装需要约 1.7TB 磁盘空间，把全部专家权重都下下来。流式模式只需要 215GB，因为只缓存当前推理需要的专家。但代价是速度——流式模式下，每次推理都要等网络拉取权重，3 分钟一个 token 不是开玩笑的。

项目还做了很多底层优化。融合 NEON MXFP4 反量化 + GEMV kernel，双缓冲层加载，并行专家读取。这些优化在 Apple Silicon 上效果特别明显，因为 Metal 和 NEON 指令集的协同。



![程序员 reaction：WHATIFTHEREWERENODISK?](https://iili.io/CCZ4u9f.png)
> 当你在等 token 的时候，CPU 正在和磁盘 IO 跳一支复杂的舞



## 参考文献
- [Deltafin GitHub - Run Kimi K3 in 64 GB RAM](https://github.com/gavamedia/deltafin)
- [Daily.dev - Deltafin runs Kimi K3 on Apple Silicon](https://daily.dev/posts/deltafin-runs-kimi-k3-2-8t-parameter-moe-on-a-single-apple-silicon-mac-by-streaming-expert-weights-dsyu9p93x)
- [Xela - Running Kimi K3 on a M1 Mac](https://www.xela.au/saas/running-kimi-k3-on-a-m1-mac-1ce9a5)
- [Reddit - Update: Kimi K3 is now running at ~4 tokens/min](https://www.reddit.com/r/LocalLLM/comments/1v9jboh/update_kimi_k3_is_now_running_at_4_tokensmin_on)
- [Hacker News - Running Kimi K3 on a M1 Max](https://news.ycombinator.com/item?id=49090233)
- [Latent Space - Fearing RSI: OpenAI, Anthropic, GDM, Meta](https://www.latent.space/p/ainews-fearing-rsi-openai-anthropic)
- [Medium - Run Kimi K3 in just 64 GB RAM](https://medium.com/data-science-in-your-pocket/run-kimi-k3-in-just-64-gb-ram-meet-deltafin-bf2a42f326e6)
- [Run Kimi K3 in 64 GB RAM: Deltafin - YouTube](https://www.youtube.com/watch?v=cri9RCBUW0o)
- [Deltafin runs Kimi K3 on Apple Silicon Mac - daily.dev](https://daily.dev/posts/deltafin-runs-kimi-k3-2-8t-parameter-moe-on-a-single-apple-silicon-mac-by-streaming-expert-weights-dsyu9p93x)
- [Running Kimi K3 on a M1 Mac - Xela](https://www.xela.au/saas/running-kimi-k3-on-a-m1-mac-1ce9a5)
- [Update: Kimi K3 on M1 MacBook - Reddit r/LocalLLM](https://www.reddit.com/r/LocalLLM/comments/1v9jboh/update_kimi_k3_is_now_running_at_4_tokensmin_on)
- [Running Kimi K3 on M1 Max - Hacker News](https://news.ycombinator.com/item?id=49090233)
- [Deltafin GitHub - gavamedia/deltafin](https://github.com/gavamedia/deltafin)
- [Kimi K3 Architecture Notes - explainx.ai](https://explainx.ai/blog/kimi-k3-architecture-raschka-latentmoe-nope-july-2026)
- [Kimi K3 Tech Blog - Moonshot AI](https://www.kimi.com/blog/kimi-k3)
