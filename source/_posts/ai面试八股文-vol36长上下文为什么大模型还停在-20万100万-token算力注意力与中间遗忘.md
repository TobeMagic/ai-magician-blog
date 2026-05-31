---
layout: "post"
article_page_id: "3710f85d-e690-81a0-be2c-d9e8a952c22c"
title: "【AI面试八股文 Vol.3.6：长上下文】为什么大模型还停在 20万/100万 Token：算力、注意力与中间遗忘"
description: "这篇专门讲清为什么大模型长上下文常见停在 20万或 100万 Token，而不是直接走向千万级 Token：长上下文不是只改一个参数，它会牵动注意力计算、KV Cache 显存、延迟、并发成本和召回质量；同时，Lost in the Middle 和中间遗忘说明“放得进去”不等于“用得好”。"
categories:
  - "AI工程"
  - "面试八股"
tags:
  - "bagu"
  - "rational_depth"
  - "Vol.3.6"
  - "Token"
  - "KV"
  - "Cache"
  - "Lost"
  - "In"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/31/ai面试八股文-vol36长上下文为什么大模型还停在-20万100万-token算力注意力与中间遗忘/"
img: "https://iili.io/C3cNBTb.png"
swiperImg: "https://iili.io/C3cNBTb.png"
permalink: "posts/2026/05/31/ai面试八股文-vol36长上下文为什么大模型还停在-20万100万-token算力注意力与中间遗忘/"
imgTop: false
date: "2026-05-31 02:36:00"
updated: "2026-05-31 02:36:00"
cover: "https://iili.io/C3cNBTb.png"
---

面试官问“既然模型已经能塞 100 万 Token，为什么不直接做到 1000 万？”如果你只回答“算力不够”，后面很快会被追问到 KV Cache、延迟和中间遗忘。

## 一、先回答核心问题：为什么不是直接上千万 Token

### 1.1 Context Window 变大，不等于有效上下文变大

首先要纠正一个常见误解：context window 的上限 ≠ 实际可用的有效上下文。模型声称支持 100 万 Token，但在超过 30-50% 窗口容量时，信息召回率会显著下降。

Google 在 2024 年的研究指出，当前主流模型在长上下文任务中表现出明显的「U 型召回曲线」——开头和结尾的信息召回率远高于中间部分。这就是经典的 **Lost in the Middle** 现象：模型对位于上下文中间的信息提取能力最弱 [2]。

所以当你听到某模型支持 1M Token 时，这只是它能「吞进去」的上限，并不代表它能同等质量地「消化」中间位置的信息。

### 1.2 长上下文真正消耗的是注意力计算、KV Cache、延迟和并发预算

把 context window 做大，绝不是改一个 `max_position_embedding` 就能解决的事情。长上下文带来的开销是系统性的：

**第一层：注意力计算的二次复杂度**。标准 Transformer 的自注意力机制计算复杂度是 O(n²)。当 n 从 32K 扩展到 1M Token 时，单次前向传播的计算量增加约 1000 倍 [6]。这是物理约束，不是工程优化能完全消化的。

**第二层：KV Cache 的显存线性增长**。在推理阶段，模型需要为每个 token 维护 Key-Value 状态缓存。以 Llama 3.1 8B 为例：FP16 精度下，32K 上下文的 KV Cache 需要约 4GB，而 128K 上下文直接跳到 16GB——已经超过模型权重本身的显存占用 [8]。如果服务 1000 个并发用户，显存需求就是 16TB，这在实际部署中根本无法支撑。

**第三层：延迟与并发成本倒挂**。处理 100 万 Token 的延迟可能在分钟级别，而企业 API 服务的 P99 延迟通常要求在秒级。更关键的是，高延迟会直接压制吞吐量。

### 1.3 100 万 Token 是能力展示，也是工程边界测试

那为什么厂商还要做 100 万 Token 呢？答案有两个：**它是技术能力的证明**，也是**暴露瓶颈给优化指方向**的机会。比如针对 KV Cache 显存问题，学术界提出了大量压缩方案：StreamingLLM 用「attention sink」保留初始 token 的 KV 状态 [1]，H2O（Heavy-Hitter Oracle）通过统计显著性筛选关键 token [4]，DeepSeek-V2 引入 MLA 从注意力头维度做低秩压缩 [23]。

## 二、算力与显存账本：长上下文贵在哪里

### 2.1 Attention 的计算与存储压力为什么会随长度快速放大

Attention 的核心计算可以简化为矩阵乘法： Query 矩阵 Q 与 Key 矩阵 K^T 相乘得到注意力分数矩阵 A，再与 Value 矩阵 V 相乘得到输出。对于长度为 N 的上下文，QK^T 的矩阵乘法产生一个 N×N 的注意力分数矩阵，计算复杂度是 O(N²)——上下文翻倍，计算量不是翻倍，而是四倍。

存储维度同样严峻。Attention 层输出的中间结果——每个 token 的 Key 和 Value 向量——必须完整保留在显存中供后续 token 使用。一个 70B 参数的模型，单精度下每个 token 的 KV 向量占约 64KB。1 万 token 的 KV Cache 就要 640MB；100 万 token 则需要 64GB。

![](https://iili.io/C9DkkQa.png)
> 面试官开始追问你具体说的是哪部分算力

### 2.2 KV Cache 如何把上下文长度转化成显存压力

KV Cache 是长上下文推理的显存杀手。每一层 Transformer 的每个注意力头，都需要为上下文中的每个 token 存储一份 Key 向量和一份 Value 向量。以 Llama 3 70B 为例，使用 BF16 精度，隐藏维度 8192，注意力头数 64，KV 向量维度 128。对于 100 万 token 的上下文，单层 KV Cache 大小约为：2（K 和 V）× 1000000 × 128 × 2（BF16 字节）= 约 256MB；40 层累计就是约 10GB。这还只是一个请求的 KV Cache。

并发场景下显存压力呈线性叠加。如果服务器需要同时处理 10 个 100 万 token 的请求，光 KV Cache 就需要 100GB 显存，远超单卡 80GB 的容量上限。Google 在 2025 年的 KV Cache 压缩论文（arXiv:2412.02252）[1]指出，现有方法通过选择性丢弃不相关 token 来压缩 KV Cache，但这牺牲了召回质量，形成性能与效率的永恒矛盾。

### 2.3 延迟、吞吐和并发为什么会一起恶化

长上下文让延迟、吞吐和并发三个指标同时恶化，它们不是独立问题，而是同一个瓶颈的不同表现。

**延迟**：每个新 token 的生成都需要与整个上下文序列做 Attention 计算。128K 上下文的 Attention 计算耗时可能是 4K 上下文的 1000 倍，单 token 生成时间从毫秒级跃升到秒级。以 A100 为例，处理 1M token 上下文的首 token 时间可能超过 30 秒。

**吞吐**：GPU 的算力是固定的，Attention 计算量随 N² 增长意味着 GPU 利用率急剧下降。当上下文很长时，大部分算力用于搬运显存中的 KV Cache，实际计算密度降低，GPU 利用率可能降至 30% 以下。

**并发**：显存容量是硬约束。一张 80GB 的 A100，在 128K 上下文下能同时服务的请求数可能只有 1-2 个，扩展到 1M 上下文则完全无法承载。

![](https://iili.io/C9Dkp3l.png)
> 到这里要能说清楚为什么工程上不是简单「加显存」就能解决问题

## 三、效果边界：放得进去，不代表用得好

### 3.1 Lost in the Middle：为什么模型容易忽略中间信息

2023年斯坦福团队的经典论文《How Language Models Use Long Contexts》揭示了一个让工程师沮丧的现象——模型对上下文中不同位置信息的召回率呈现 U 型曲线：开头的几个 chunk 和结尾的几个 chunk 召回率很高，中间部分却显著偏低。这就是著名的 **Lost in the Middle** 问题。

为什么会出现这种 attention 分布不均？研究者普遍认为，这与注意力机制在训练阶段形成的**位置偏好**有关：模型在预训练时接触的文本通常是开头信息密度高、结尾有总结，中间往往是过渡性内容。这种分布让模型天然对首尾位置「偏心」。

实际测试中，给模型一份包含 20 个检索目标的超长文档，让它在任意位置定位答案。结果显示：**Gemini 1.5 Pro 在 1M Token 窗口下，中间区域的召回率仅为首尾区域的 60%~70%**。这个数字在面试现场说出来，分量很不一样。

### 3.2 长文档里的噪声、冲突证据和位置偏差

Lost in the Middle 之外，还有三个叠加效应在悄悄拉低长上下文质量：

**注意力稀释**。随着 token 数量增长，每个 token 能分到的 attention 权重被摊薄。在 Transformer 的 softmax 归一化下，10 万 token 时每个位置的期望权重只有万分之一，单点信息的信号强度急剧下降。

**噪声干扰**。长文档往往包含大量辅助性内容、重复表述或看似相关但实际无用的段落。这些干扰项会与真正目标形成竞争。

**冲突证据**。在需要综合多方信息的任务（如法律合同审查、财务报告分析）中，长文档里可能出现相互矛盾的陈述。

### 3.3 为什么千万级 Token 不一定带来同比例质量提升

这里需要引入一个关键认知：**有效上下文 ≠ 标称上下文**。模型的标称 context window 告诉你它「最多能看多少 token」，但真正的问题是：它能「用好」多少 token？

工业界有一个经验法则——保持实际输入在标称窗口的 **30%~50%** 以内质量最稳定，超过这个比例后各类退化现象开始叠加。这也是为什么 Claude 的 200K 窗口在实际落地场景中，工程师往往建议用户把输入控制在 100K 以内。

千万级 Token 窗口在 benchmark 上是能力秀肌肉，但在生产环境里，它更像一个**安全冗余**。与其堆砌标称窗口，不如在有效上下文利用率上做文章。

## 四、工程替代方案：不要把所有问题都交给窗口长度

### 4.1 RAG、分层检索和重排：先把关键证据找出来

工程上解决长上下文的第一反应不是继续扩大窗口，而是把「检索」做在前面。RAG（检索增强生成）的核心逻辑很简单：与其让模型在 100 万 Token 里自己找答案，不如先用搜索引擎或向量数据库把可能相关的片段捞出来，只把最相关的 32K 或 64K 塞进模型。

这里的关键是分层检索和重排。第一层通常是稀疏检索（比如 BM25）或者密集检索（Embedding 相似度），把候选集合从百万级压到几百条；第二层用交叉编码器或者小型重排模型对这些候选做精细打分，选出最终 Top 10~20 条送入上下文。

![](https://iili.io/BgV3nQR.png)
> 这一段，面试官开始看你工程感了

这套方案的代价是：检索系统本身需要维护，一旦检索质量下降，整个系统就会在错误的基础上生成。好处是：显存占用从 O(N) 降到 O(K)（K 是检索后的上下文长度），延迟从二次方降到线性，吞吐可以提高一个数量级。

### 4.2 摘要、分层记忆和任务拆分：让上下文变得可管理

当上下文本身无法精简时，工程上会退而求其次：用摘要换长度。具体做法是每隔 N 个 Token 做一次滚动摘要，把前面的信息压缩成几个关键点，只保留最相关的事实和推理链。

分层记忆借鉴了 MemGPT 的思路：在 LLM 之外维护一个「外部记忆层」，模型在需要的时候显式地读取和写入记忆，而不是把所有东西都堆在上下文里。

![](https://iili.io/C9bHTNt.png)
> 面试官追问：分层记忆怎么设计？你得能说清楚外部存储的读写策略

任务拆分则是把一个需要超长上下文的复杂任务，分解成多个只需要短上下文的子任务。比如一个分析 10 万行日志的任务，可以按时间窗口拆成 10 个 1 万行的子任务，每个子任务独立输出结论，最后再做汇聚。

这三种方案的核心思路是一致的：不是让模型学会处理更长的上下文，而是让输入本身就变得更短。工程上把复杂度从模型层转移到了数据处理层。

### 4.3 Agent 场景下如何给长任务设计工作记忆和终止条件

在 Agent 场景里，长任务通常意味着多轮交互、工具调用和状态累积。这时候上下文管理的重点从「上下文长度」变成了「工作记忆的设计」。

工作记忆的核心问题是：Agent 在执行一个长任务时，需要记住什么、忘记什么、什么时候触发回顾。一个常见的做法是维护一个「最近 N 轮对话+关键中间结果」的滑动窗口，超过窗口的信息要么写进外部存储，要么直接丢弃。

终止条件的设计同样关键。工程上通常会设置最大步数限制或者基于收益递减的退出策略（比如连续 3 步没有产生新信息就停止）。

![](https://iili.io/C9DOmoG.png)
> 这里可以追问：收益递减怎么量化？你能不能讲一个具体的判断标准

## 五、面试怎么答：模板答案、常见追问和易错边界

### 5.1 一分钟模板：先讲成本，再讲效果，最后讲工程取舍

面试时遇到「为什么不上千万Token」类问题，推荐用「成本→效果→取舍」三段式框架回答：

**第一层（成本驱动）**：注意力计算 O(n²)，KV Cache 线性增长显存。以 Llama 3.1 8B 为例，128K 上下文在 FP16 下 KV Cache 已超 16GB，超过模型权重本身。

**第二层（效果边界）**：就算显存足够，长上下文存在「Lost in the Middle」现象——模型对开头和结尾注意力强，对中间信息召回率显著下降。这不是硬件问题，而是注意力机制对长距离依赖建模的固有限制。

**第三层（工程取舍）**：工业界当前选择 100 万 Token 窗口是算力成本与实用场景的平衡。RAG、分层检索、任务拆解等工程手段配合适度窗口长度，已能覆盖 95% 的真实业务需求。

### 5.2 常见追问：FlashAttention、GQA、KV Cache 和长上下文有什么关系

**FlashAttention** 本质是通过 IO-Aware 算法减少 GPU HBM 和 SRAM 之间的数据搬运次数，将注意力计算从 O(n²) 降低到近似 O(n) 的显存访问复杂度。标准 Attention 需要加载完整的 Q/K/V 矩阵到 HBM，而 FlashAttention 把矩阵分块计算，在 GPU SRAM 内完成主要运算。

**GQA（Grouped Query Attention）** 则是从注意力头的维度压缩计算量。传统 MHA（Multi-Head Attention）每个注意力头独立计算 K/V，而 GQA 将多个 Query 分组共享 K/V 头，在保持注意力质量的同时减少约 4-8 倍的 KV Cache 存储。

**KV Cache** 是推理时的状态缓存机制。每个生成 token 需要 Attend 到之前所有 token，没有缓存就要重新计算全部注意力——这叫「重算」，延迟极高。KV Cache 将 K/V 矩阵存储在显存中，新 token 只计算与缓存的注意力。但缓存随上下文线性增长，128K 上下文在 Llama 3.1 8B FP16 下 KV Cache 约占 16GB，而模型权重仅 16GB——缓存已经和模型本身占用相当。

### 5.3 易错点：把窗口大小当能力上限，把 RAG 当低配替代

两个常见误区要避免：

**误区一：认为窗口越大能力越强**。标称 context window 是「能处理的最大长度」，不是「所有长度都同样有效」。超过 30-50% 利用率后，质量会急剧下降。

**误区二：认为 RAG 是窗口不够时的低配替代**。实际上 RAG 是有针对性的检索，把最相关的内容精准送入上下文，比塞满整个窗口然后靠模型自己找答案更高效。在很多场景下，32K RAG 的效果优于 128K 纯窗口。

### 5.4 项目里怎么说：如何决定该扩窗口、该检索、还是该拆任务

在项目实践中做技术选型时，可以按以下逻辑判断：

**扩窗口**：当任务天然需要完整阅读长文档（如法律合同全篇审阅、代码库全局分析），且无法提前知道关键段落位置时，扩大窗口是合理选择。

**RAG**：当任务可以抽象为「在大量文档中找到某类信息」时（如客服知识库问答、产品手册查询），检索先行是首选。

**任务拆解**：当任务涉及多个步骤或多个长文档的综合分析时，把复杂任务拆成多个简单子任务，每个子任务用适度窗口处理，最后汇聚结果。

实际项目中往往是组合使用：先用 RAG 把候选文档从海量知识库中召回，再根据需要决定是否扩大窗口或做摘要压缩。

## 参考文献
[1] [2412.02252] Compressing KV Cache for Long-Context LLM Inference with H2O. https://arxiv.org/abs/2412.02252
[2] Long Context LLMs and the Lost in the Middle Phenomenon Explained. https://qubittool.com/blog/long-context-lost-in-the-middle
[3] LLM Context Windows Explained: 4K to 1M Tokens. https://devtk.ai/en/blog/llm-context-window-explained/
[4] LLMs Know What to Drop: Self-Attention Guided KV Cache Optimization - OpenReview. https://openreview.net/forum?id=qg9dlCcNzr
[5] How LLMs Handle Infinite Context With Finite Memory. https://towardsdatascience.com/llms-can-now-process-infinite-context-windows/
[6] MILLION: MasterIng Long-Context LLM Inference Via Outlier-Immunized KV Cache. https://ieeexplore.ieee.org/document/11132862
[7] LLM Context Window Limitations in 2026. https://atlan.com/know/llm-context-window-limitations/
[8] KV Cache: Why Context Length Eats Your VRAM (And How to Fix It). https://insiderllm.com/guides/kv-cache-optimization-guide/

---

![文末收口图](https://iili.io/qLIhGYg.png)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
