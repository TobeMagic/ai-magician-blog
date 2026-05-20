---
layout: "post"
article_page_id: "3660f85d-e690-816f-a6b6-f7db93becb78"
title: "【AI面试八股文 Vol.3.2：LLM 工作流程】从 BPE 到自回归生成：Token、采样、KV Cache 如何决定成本与效果"
description: "LLM 推理不是把文本扔进去等结果出来就结束了。从输入文本到 token 输出，中间经历了 BPE 分词、embedding 投影、多层 Transformer 前向传播、logits 采样和 KV Cache 缓存这几个关键阶段。"
categories:
  - "AI工程"
  - "面试八股"
tags:
  - "BPE 分词"
  - "LLM 推理链路"
  - "KV Cache"
  - "Token 采样"
  - "Embedding"
  - "Temperature"
  - "Vol.3.2"
  - "LLM"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/20/ai面试八股文-vol32llm-工作流程从-bpe-到自回归生成token采样kv-cache-如何决定成本与效果/"
img: "https://iili.io/C9CUKhv.png"
swiperImg: "https://iili.io/C9CUKhv.png"
permalink: "posts/2026/05/20/ai面试八股文-vol32llm-工作流程从-bpe-到自回归生成token采样kv-cache-如何决定成本与效果/"
imgTop: false
date: "2026-05-20 09:34:00"
updated: "2026-05-20 09:46:00"
cover: "https://iili.io/C9CUKhv.png"
---

<div class="plain-article-asset article-cover-asset"><img src="https://iili.io/C9CUKhv.png" alt="【AI面试八股文 Vol.3.2：LLM 工作流程】从 BPE 到自回归生成：Token、采样、KV Cache 如何决定成本与效果"></div>

<div class="article-summary-block"><p><strong>摘要：</strong>LLM 推理不是把文本扔进去等结果出来就结束了。从输入文本到 token 输出，中间经历了 BPE 分词、embedding 投影、多层 Transformer 前向传播、logits 采样和 KV Cache 缓存这几个关键阶段。</p></div>

面试官把简历往桌上一放，翻到项目经历那页，指着其中一行问：「你这个 Agent 里调 LLM 的那块，具体是怎么跑的？」

你张嘴想说「调用 OpenAI API」，话到嘴边又觉得不对——面试官显然不是在问怎么 import openai。

TA 真正想知道的是：你知不知道一次生成请求从输入文本到 token 输出，中间经历了哪些阶段，每个阶段有什么可调的参数，以及为什么有些请求快有些请求贵。

这篇文章就把这条链路拆开讲透。不只讲「是什么」，更讲「为什么这么设计」和「面试的时候怎么把这件事说清楚」。

## 这道题到底在考什么：一次生成请求的完整生命周期

面试官问 LLM 工作流程，本质上是在测你对系统边界的理解。

能把这件事讲清楚的人，通常也意味着TA能判断哪些问题该在 Prompt 层解决、哪些该在模型层解决、哪些该在工程层解决——这是 AI 工程师和 AI 用户之间的本质区别。

让我们先把一次完整生成请求的生命周期画出来。

![正文图解 1](https://iili.io/C9Ct51s.png)
> 正文图解 1

从这张图可以看到，LLM 推理并不是「输入→输出」的单次操作，而是**自回归循环** ：每生成一个 token，都要重新经过 Transformer Block 的前向传播，只不过可以利用 KV Cache 避免对已计算的上下文 token 重复做注意力计算。

这个循环直到模型输出终止符（通常叫 `eos_token`）或者达到预设的最大 token 数才停止。所以你调用 API 时看到「生成了 500 tokens」，背后意味着 500 次这样的循环。

![](https://iili.io/B9f4tZQ.png)
> 500 次循环，换我早宕机了

### 为什么面试官要问这条链路

如果你只会在应用层调 API，这个问题的答案可以很短：「把文本发过去，模型返回结果」。但面试官想知道的是你能不能做系统级判断——比如：

**Prompt 越长，推理越慢，不只是因为网络传输。** 当你发送一个 2000 token 的 Prompt，模型需要对所有 2000 个 token 做完整的前向传播才能预测下一个 token。

每次生成新 token 时，Transformer 的自注意力机制都需要attend到所有历史 token。

如果开启了 KV Cache，这个注意力计算会被优化，但显存占用会随上下文长度线性增长。

这就是为什么 GPT-4 128K 上下文的定价和 4K 上下文完全不同：长上下文不只占用更多带宽，还消耗更多显存来做大规模注意力矩阵运算。

根据 OpenAI 官方定价页面，GPT-4o 的输入 token 费用随上下文规模阶梯计费，上下文越长，单位 token 成本越高。

反过来，如果你不理解这个链路，你可能会以为「把 Prompt 写长一点」是免费的。结果就是每个月看到账单开始怀疑人生。

### 链路拆解的三个层次

在面试里把这件事讲清楚，可以按三个层次来组织回答：

**第一层：数据流** ——文本怎么变成 token，token 怎么变成向量，向量怎么在 Transformer 里流动，最终怎么变成下一个 token 的概率分布。**第二层：可调参数** ——词表大小影响分词粒度，embedding 维度影响模型容量，温度参数影响采样多样性，KV Cache 策略影响显存占用和推理延迟。**第三层：工程权衡** ——这些参数和设计选择之间的相互制约：温度高了输出随机但不稳定，温度低了输出保守但重复；KV Cache 省了计算时间但吃了显存；

大词表分词更细但 embedding 矩阵更大。

能走到第三层的人，面试官通常会高看一眼。因为这说明你不只在背概念，还理解系统的约束在哪里。

## 分词与 embedding：BPE 为什么直接影响上下文和计费

现在进入第一个技术细节：BPE 分词，以及它和 embedding 的关系。

### 什么是 BPE：把文本切成模型能吃的最小单元

BPE（Byte Pair Encoding）是一种基于统计的子词分词算法，核心思想是**从字符级别开始，迭代合并最高频的 token 对** ，最终形成一个固定词表。

以英文为例，原始文本 "tokenization" 可能会被切成 `["token", "ization"]` 或 `["token", "i", "z", "ation"]`，取决于词表中有没有这些子词。

这个过程对中文也一样，只不过中文的「字符」是汉字本身，BPE 在汉字级别上做合并。

Python 里可以用 `tiktoken` 或 `transformers` 的 `AutoTokenizer` 直接体验这个过程：

```python
# 用 GPT-2 的 BPE 分词器演示分词过程
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("gpt2")

text = "LLM推理链路从BPE分词开始"
tokens = tokenizer.encode(text, return_tensors="pt")

print(f"原文：{text}")
print(f"Token数量：{tokens.shape[1](https://openai.com/api/pricing/)}")
print(f"Token IDs：{tokens.tolist()}")
# 可以看到中文字符被切成了 subword 单元，数量通常多于字符数

# 对比：相同语义内容的英文
text_en = "The LLM inference chain starts with BPE tokenization"
tokens_en = tokenizer.encode(text_en, return_tensors="pt")
print(f"\n英文Token数量：{tokens_en.shape[1](https://openai.com/api/pricing/)}")
```

运行后会看到：同样语义的一句话，中文的 token 数往往比英文多一到两倍。这是因为 GPT 系列模型的 BPE 词表主要基于英文语料构建，中文字符被切成了更多子词单元。

### 为什么 BPE 直接影响你的 API 账单

这是中文工程师必须理解的一个现实问题。OpenAI、Anthropic 等主流 API 都是按 token 计费的，输入和输出 token 分别计费。

一个粗略的感知是：**1 个中文汉字 ≈ 1.5 到 2.5 个 token** ，而英文单词通常 1 到 2 个 token。实际比例取决于具体模型的分词器实现。

以 GPT-4o mini 为例，官方定价为每百万输入 token 0.15 美元，每百万输出 token 0.6 美元。

如果你发送一段 1000 字的纯中文 Prompt，大约对应 1500–2500 个 token，成本约 0.[REDACTED]–0.[REDACTED] 美元。

听起来不多，但如果是高频调用的生产系统，这个差异会被放大到几百上千倍。

![](https://iili.io/B9fewPa.png)
> 写中文 Prompt 的时候没想到这是双倍计费吧

反过来，如果你做的是英文为主的产品，在中文分词效率上花的精力可以少很多。这就是为什么很多出海 AI 应用优先做英文场景——不只是市场问题，也是成本问题。

### 词表大小与 embedding 矩阵的关系

BPE 词表的大小直接决定了 embedding 层的参数量。

以 GPT-2 为例，它的词表大小是 50257，embedding 维度是 768，那么 embedding 矩阵的形状就是 `50257 × 768`，总共约 3800 万个参数。

这个数字看起来不算大，但乘以 Transformer 的层数（全套 GPT-2 有 12 层），以及前向和反向传播的次数，embedding 层在整个模型里的显存占用就变得可观了。

更关键的是，这个矩阵在推理时必须完整加载到显存里——你没办法把它分片存储。

更大的词表（比如中文模型的 5 万到 10 万规模）意味着更细的分词粒度，理论上模型能表达更丰富的语义；但同时 embedding 参数更多，显存占用更大，分词速度也更慢。

这就是一个典型的工程取舍：**词表大小是离线设计决策，不是在推理时可以随便改的参数。** 中文模型（如 ChatGLM、Qwen）通常会专门扩充中文字符和词组的词表配额，来提升中文分词效率。

### Embedding：从 token 到向量的语义空间映射

分词之后，每个 token ID 会被映射为一个 embedding 向量。这个过程在数学上就是一个查表操作：

$$\mathbf{h}_i = \mathbf{E}_{token_i}$$

其中 $\mathbf{E}$ 是 embedding 矩阵，形状为 `[vocab\_size, d\_model]`。

但这只是第一层。

在 Transformer 里，token embedding 还要加上位置编码（positional encoding），让模型知道每个 token 在序列中的位置。

原始 Transformer 使用的是绝对位置编码（正弦/余弦函数），后续模型逐步演进出 RoPE（Rotary Position Embedding，旋转位置编码）和 ALiBi（Attention with Linear Biases）等更高效的形式[2](https://arxiv.org/abs/2104.09864)。

RoPE 的核心思想是把位置信息注入 Q 和 K 的旋转矩阵，使得 Attention 的结果天然包含相对位置关系，而不需要在每层都加位置偏置。

这个设计在很多长上下文模型（Longformer、ChatGLM、Qwen）里被广泛采用，原因之一是它对长序列的外推能力更强。

也就是说：**你用的模型能不能处理很长的上下文，很大程度上取决于它的位置编码方案** 。这也是面试里经常被追问的一个点。

### 实战中的 Embedding 优化方向

如果你在 Agent 项目里做 embedding 层优化，通常有两条路：

**一是知识蒸馏压缩。** 把大模型的 embedding 知识迁移到小模型或量化版本，在损失可接受的条件下减少显存占用。**二是分词器定制。** 针对你的垂直领域数据（比如医疗、法律、金融中文本），训练一个专属 BPE 分词器，让专业术语被切分成更少的 token，减少上下文压力和推理成本。

后者在 RAG（Retrieval-Augmented Generation）场景里特别有价值：如果检索回来的上下文本身就是 token 密集的，加上 Prompt 模板之后很容易逼近上下文上限。

一个领域定制分词器可以显著降低这个压力。

![](https://iili.io/qbiS47S.png)
> 所以 Prompt 超上限不是 Prompt 的问题，是分词的问题？

到这里，第一和第二章节的核心内容已经展开。接下来两段将覆盖 Transformer 前向推理、采样策略、KV Cache 工程优化，以及如何在面试和项目里把这些知识落地。

## 前向推理链路：多层 Transformer 如何产生 logits

### Embedding 层：把 token ID 变成语义向量

分词完成后，每个 token ID 会被送入 embedding 层，查表得到一个 d_model 维的向量。这个过程在数学上就是一个查表操作：

![](https://iili.io/qysAvUP.png)
> 先不聊了，我去搬砖

$$\mathbf{h}_i = \mathbf{E}_{token_i}$$

其中 $\mathbf{E}$ 是形状为 `[vocab_size, d_model]` 的 embedding 矩阵。但这只是第一步。

在标准的 Transformer 架构里，token embedding 还要叠加位置编码（Positional Encoding），让模型知道每个 token 在序列中的相对位置。

原始 Transformer 使用的是正弦/余弦绝对位置编码[1](https://arxiv.org/abs/1706.03762)，后续模型逐步演进出 RoPE（Rotary Position Embedding，旋转位置编码）和 ALiBi 等更高效的形式[2](https://arxiv.org/abs/2104.09864)。

RoPE 的核心思想是把位置信息注入 Q 和 K 的旋转矩阵，使得 Attention 的结果天然包含相对位置关系，而不需要在每层都额外加位置偏置。

这也是为什么现在大多数长上下文模型（Longformer、ChatGLM、Qwen）都在用 RoPE——它对长序列的外推能力更强，面试时容易被追问。

Embedding 加上位置编码之后，向量就变成了一个「既知道语义、又知道位置」的表示，准备进入 Transformer Block。

### Transformer Block：自注意力 + 前馈网络的循环叠加

这是 LLM 推理里计算最密集的部分。一个 Transformer Block 主要包含两个子层：

**第一个子层：Multi-Head Self-Attention（多头自注意力）。** 对于输入序列中的每个 token，模型会生成三个向量——Query（Q）、Key（K）和 Value（V）。

这三个向量都是由输入 embedding 通过三个独立的线性变换得到的：

```python
Q = x @ W_q
K = x @ W_k
V = x @ W_v
```

然后计算 Q 和 K 的点积，再除以 $\sqrt{d_k}$ 进行缩放（这是为了防止点积值过大导致 softmax 梯度消失），最后用 softmax 得到注意力权重，再乘以 V 得到输出：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V$$

这里 $d_k$ 是每个 head 的维度。如果模型有 n_heads 个头，每个头的维度是 $d_k = d_{model} / n_{heads}$。

所以 Multi-Head Attention 实际上是并行做了 n_heads 次 Attention，然后把结果拼接起来再做一个线性变换。

**第二个子层：前馈网络（Feed-Forward Network，FFN）。** 这是一个两层全连接网络，中间通常用 GELU 或 ReLU 激活函数：

```python
ffn_output = GELU(x @ W_1) @ W_2
```

FFN 占了 Transformer 参数的约 2/3，是推理时的显存大户。

每次前向传播，每个 Transformer 层都要把完整激活值保存在显存里——这直接决定了你能跑多大的 batch size。

每个子层外面还包裹着残差连接（Residual Connection）和 Layer Normalization[3](https://arxiv.org/abs/1607.06450)。

残差连接让梯度能直接传到底层，LayerNorm 则负责稳定训练和推理时的数值分布。没有这两者，深层 Transformer 几乎无法稳定训练。

LLM 通常有几十层 Transformer Block（比如 LLaMA 2 7B 有 32 层，70B 有 80 层），每一层都在重复上述操作。这就是为什么大模型推理需要大量显存和算力。

![](https://iili.io/BiNupZF.png)
> 32 层，每层都要算注意力，再强的显卡也得喘口气

### Logits：从隐藏状态到词表概率分布

经过 N 层 Transformer Block 的处理后，我们得到最后一个 Block 的隐藏状态 $\mathbf{h}_{last}$。

这个向量还需要经过一个线性变换才能变成词表大小的 logits：

$$\mathbf{logits} = \mathbf{h}_{last} \cdot \mathbf{W}_u$$

其中 $\mathbf{W}_u$ 是形状为 `[d_model, vocab_size]` 的 unembedding 矩阵（有时也叫 LM Head）。

这个矩阵通常和 embedding 矩阵 $\mathbf{E}$ 绑定制共享参数，可以节省约一半的参数量。

得到的 logits 是一个长度为 vocab_size 的向量，每个维度代表下一个 token 取对应词表 index 的「原始得分」。这个得分还没有归一化成概率，需要经过 softmax：

$$\mathbf{p} = \text{softmax}(\mathbf{logits})$$

现在 $\mathbf{p}$ 变成了一个归一化的概率分布，每个维度的值都在 0 到 1 之间，且和为 1。下一步就是从这个概率分布里采样出最终的 token。

### 采样过程的本质：概率到决定的转换

这里有一个面试常考的认知陷阱。很多人会以为「模型选择了概率最大的那个 token」，但实际上采样是一个随机过程——模型从概率分布中按概率抽取，而不是直接取 argmax。

所以即使 temperature 相同，每次运行都可能得到不同的输出。这解释了为什么同一个 prompt 两次调用 API 可能返回不同的结果——这不是 bug，是采样机制本身的特性。

![Agent 工作流主链路](https://iili.io/C9CtEIS.png)
> Agent 工作流主链路

> 这张图把抽象工作流压成一条可复盘的链路，方便读者定位风险点。

## 采样与生成：Temperature、Top-k、Top-p 和重复惩罚

### Temperature：控制概率分布的「平滑度」

Temperature（温度）是最直观的采样参数，它通过在 softmax 前除以一个温度系数来调节分布的形状：

$$\mathbf{p}_T = \text{softmax}\left(\frac{\mathbf{logits}}{T}\right)$$

当 $T = 1$ 时，分布保持原样。当 $T > 1$ 时，概率分布会被「拉平」，高概率 token 的优势减弱，低概率 token 的机会增加，输出变得更随机、更有创造性。

当 $T < 1$ 时，分布被「尖锐化」，高概率 token 的优势被放大，输出变得更确定、更保守。

用一个生活化的比喻：想象你在点外卖，$T = 1$ 是按店铺评分真实下单；$T$ 很高相当于把排行榜搅乱，评分差不多的店随机选，更可能点到平时不会尝试的新店；

$T$ 很低则相当于只点评分第一的店，别的店基本没机会。

```python
# Temperature 对分布的影响示意
import torch
import torch.nn.functional as F

logits = torch.tensor([2.0, 1.0, 0.5, 0.1, 0.05])

for T in [0.1, 0.7, 1.0, 1.5]:
    probs = F.softmax(logits / T, dim=0)
    print(f"T={T}: {probs.tolist()}")
    # T=0.1: [0.97, 0.03, 0.00, 0.00, 0.00] → 几乎只选第一个
    # T=1.0: [0.55, 0.23, 0.13, 0.05, 0.03] → 原始分布
    # T=1.5: [0.35, 0.26, 0.18, 0.11, 0.09] → 更均匀，更多探索
```

在 Agent 开发场景里，temperature 的选择是一个工程决策，不是玄学。

如果你做的是代码生成、数学推理这类需要确定性的任务，通常用 $T \approx 0.1$ 到 $0.3$；

如果你做的是创意写作、头脑风暴，可以用 $T \approx 0.7$ 到 $1.0$。

![](https://iili.io/Bfd2Yn1.png)
> 产品说既要创意又要准确，那 T 设多少？

### Top-k 采样：截断分布的简单粗暴策略

Top-k 采样在 softmax 之后，直接把概率最低的 k 个 token 过滤掉，把剩余概率重新归一化：

```python
def top_k_sampling(probs, k):
    top_k_indices = torch.topk(probs, k).indices
    filtered_probs = torch.zeros_like(probs)
    filtered_probs[top_k_indices] = probs[top_k_indices]
    return filtered_probs / filtered_probs.sum()
```

这个策略的好处是简单可控：你永远知道最多有 k 个 token 候选，不会出现分布过于平坦的问题。

但它的缺点也很明显：k 是固定值，如果真实分布高度集中在 1 个 token 上，强行保留 k 个反而会增加随机性。

比如在确定性很强的任务里，概率分布可能是 `[0.95, 0.03, 0.01, 0.005, ...]`。

如果设 k=50，模型会从 50 个 token 里采样——这反而增加了选到低概率 token 的风险。

### Top-p（核采样）：动态阈值比固定截断更合理

Top-p 采样（也叫 Nucleus Sampling）换了一个思路：不是固定候选数量，而是固定累积概率阈值。

模型从概率最高的 token 开始累加，累加到超过阈值 p 就停止，剩下的 token 直接丢弃：

```python
def top_p_sampling(probs, p=0.9):
    sorted_probs, indices = torch.sort(probs, descending=True)
    cumsum = torch.cumsum(sorted_probs, dim=0)

# 找到累积概率超过 p 的位置
    cutoff_idx = (cumsum > p).nonzero(as_tuple=True)

# 截断并归一化
    filtered_probs = torch.zeros_like(probs)
    keep_indices = indices[:cutoff_idx + 1]
    filtered_probs[keep_indices] = sorted_probs[:cutoff_idx + 1]
    return filtered_probs / filtered_probs.sum()
```

当 $p = 0.9$ 时，模型会动态选择能覆盖 90% 概率质量的最小 token 集合。如果分布很尖锐，可能只保留 1-2 个 token；如果分布很平坦，可能会保留几十个 token。

Top-p 比 Top-k 更灵活，这也是为什么现在大多数 API 和开源推理框架默认推荐 Top-p 而不是 Top-k。

但 Top-p 有自己的坑：如果 $p$ 设得太低（比如 0.5），候选集可能太小导致重复；如果 $p$ 设得太高（比如 0.99），基本等于没截断。

### Repetition Penalty：对已出现 token 的「惩罚」

自回归生成有一个常见问题：模型容易陷入重复循环，比如「the the the the」或者「好的好的好的好的」。这在低 temperature 或高概率分布下尤为明显。

Repetition Penalty（重复惩罚）是一个简单但有效的解法：对于已经出现在生成历史里的 token，在 logits 上减去一个惩罚值，降低它们被再次选中的概率：

```python
def apply_repetition_penalty(logits, generated_ids, penalty=1.1):
    for token_id in set(generated_ids.tolist()):
        logits[token_id] /= penalty  # 或 logits[token_id] -= penalty
    return logits
```

这个操作的直觉是：如果一个 token 已经被生成过了，再生成一次应该更难。惩罚值通常在 1.0 到 1.5 之间——太小没效果，太大可能导致模型刻意回避常用词，反而破坏输出质量。

### Agent 场景的采样策略：为什么低温策略更受青睐

在 AI Agent 场景里，采样策略的选择直接影响系统的可靠性和可预测性。

大多数生产级 Agent 系统默认使用低温策略（temperature ≈ 0 到 0.3），原因很直接：**Agent 需要稳定的工具调用和结构化输出** 。

如果 temperature 太高，模型可能选择错误的工具、漏掉关键参数或者输出格式不稳定，这会导致函数调用失败或解析错误。

配合低温策略，很多 Agent 框架还会禁用采样，直接用 argmax（贪婪选择）或者把 temperature 设为 0。

OpenAI 的 Function Calling 文档就建议使用低温设置来保证调用稳定性[4](https://platform.openai.com/docs/guides/function-calling)。

但这不意味着温度必须一直是零。在需要创意发散的多步推理或者对话场景里，适当调高温度可以增加输出的多样性。

关键是**在系统设计的不同阶段使用不同的 temperature 策略** ，而不是全程一套参数。

一个常见的做法是：规划阶段用较高温度生成多种方案，验证和执行阶段用低温或零温度保证准确性。这本身就是 Agent 系统设计的工程判断。

## KV Cache 与上下文：延迟、显存和并发的工程账

上一段讲到，模型在拿到完整的上下文 token 序列后，会经过多层 Transformer Block 的前向计算，最终输出一个 logits 向量，再经过采样得到下一个 token。

这个过程发生在每一次生成调用里——但它描述的其实是「Prefill 阶段」的计算模式。

在真实的自回归生成过程中，同一个上下文会被反复用于计算，每生成一个新 token，模型都要「再看一眼」之前所有的 token。

这就是 KV Cache 登场的原因，也是面试里最容易挖出工程深水区的地方。

### 自回归生成的计算代价：为什么「每生成一个 token 都要重新算一遍」

在没有 KV Cache 的情况下，生成第 N 个 token 时，模型需要对包含前 N-1 个 token 的完整序列做完整的前向计算。

假设上下文长度为 L，要生成 G 个 token，总计算量大约与 L + (L+1) + (L+2) + ... + (L+G-1) 成正比——也就是 O(L·G + G²/2)。

当 L 很大（长上下文场景）而 G 相对较小时，这个成本主要由 L 决定；但当 L 已经很大（比如 128K token），而你还要生成几千个 token 时，O(G²) 那部分就会变得不可忽视。

问题的核心在于：**Attention 机制的计算量与序列长度的平方成正比** 。

每一层、每一个注意力头，都要在当前 token 的 Query 与所有历史 token 的 Key 之间做点积。

没有缓存机制，意味着每次生成新 token 时，模型都在重复计算历史 token 的 Key 和 Value——这些值在给定上下文不变的情况下，其实是恒定的。

![](https://iili.io/BiNA3aR.png)
> 128K 上下文乘以 O(n²)，显存直接起飞

### KV Cache 的原理：把「不变的中间结果」存下来

KV Cache 的本质是一个缓存策略：对于每一个 Transformer 层、每一个注意力头，把已经计算过的 Key 和 Value 向量缓存起来。

新 token 生成时，只需要计算它自己的 Query，以及它与所有历史 Key/Value 的 attention 分数，而不需要重新跑完整的矩阵乘法去生成历史 token 的 K 和 V。

更具体地说，假设我们有 L 个注意力头，模型维度是 d_model，每个头的维度是 d_head = d_model / L。对于第 l 层的第 h 个头：

- 输入是第 l 层在第 N-1 个位置的隐藏状态 h_l[N-1]

- 通过 W_K 和 W_V 投影得到 K_l[h, N-1] 和 V_l[h, N-1]

- 这个向量被追加到该层的 K 缓存和 V 缓存里：K_cache[l][h] 和 V_cache[l][h]

- 第 N 个 token 的 Query Q_l[h, N] 与整个 K_cache[l][h] 做 attention

用一个更直观的方式理解：想象你在做数学题，每一步都要翻参考书。没有缓存，相当于每次做题都要把参考书从头到尾重新抄一遍；

有 KV Cache，相当于把已经抄过的重要内容做成笔记，后续只需在笔记上追加新内容。

```python
# KV Cache 的增量计算逻辑（概念级）
class TransformerLayerWithKVCache:
    def __init__(self):
        self.k_cache = {}  # layer_idx -> tensor [batch, heads, seq_len, head_dim]
        self.v_cache = {}

def forward(self, x, layer_idx):
        # x: 当前 token 的隐藏状态，shape [batch, seq_len, d_model]
        q = self.W_q(x)  # [batch, seq_len, d_model]
        k = self.W_k(x)
        v = self.W_v(x)

# 增量追加到缓存
        self.k_cache[layer_idx] = torch.cat([self.k_cache[layer_idx], k], dim=2)
        self.v_cache[layer_idx] = torch.cat([self.v_cache[layer_idx], v], dim=2)

# 用缓存的 K/V 做 attention：这里 O(seq_len²) 变成了只和缓存长度相关
        attn_output = self.multihead_attention(
            q, self.k_cache[layer_idx], self.v_cache[layer_idx]
        )
        return self.feed_forward(attn_output)
```

注意最后一行注释里的变化：引入了 KV Cache 之后，attention 的计算量从与「完整序列长度」相关变成了与「缓存长度」相关——但 attention 本身的二次复杂度并没有消失，只是被平摊了。

### 显存占用：KV Cache 的硬成本

KV Cache 最大的工程问题不是计算量，而是显存。每一个 token 的 Key 和 Value 向量都要存储下来，供后续所有生成步骤使用。

以 LLaMA 2 7B 为例：

- d_model = 4096，L = 32 层，n_heads = 32，d_head = 128

- 每个 token 的 K 向量大小：2（K 和 V）× 32 × 128 × 4 bytes（FP32）≈ 32 KB

- 1000 个 token 的 KV Cache 大小：32 KB × 1000 = 32 MB

- 128K token 上下文：32 KB × [REDACTED] ≈ 4 GB（仅 KV Cache，FP32）

这还只是一个 7B 模型。对于 70B 模型，如果用 FP16 存储，128K 上下文的 KV Cache 可以轻松超过 100 GB——这已经超出了单卡 A100（80 GB）的显存上限。

这直接催生了几个工程方向：**Multi-Query Attention（MQA）** 和 **Grouped-Query Attention（GQA）** 。

### 从 MHA 到 MQA / GQA：注意力头的工程取舍

标准的多头注意力（MHA）里，每个注意力头有独立的 Q、K、V 投影矩阵。对于一个 32 层的 7B 模型，这意味着有 32 × 32 = 1024 个 K 头和 1024 个 V 头需要缓存。

Multi-Query Attention（MQA）提出一个关键洞察：**在增量解码场景下，所有 step 共享同一个 K 和 V 头** ，而 Q 头保持多头结构。

这大幅减少了需要缓存的 K/V 数量，从 O(n_heads × n_layers) 降到了 O(n_heads)。

Grouped-Query Attention（GQA）在 MHA 和 MQA 之间取了折中：把注意力头分成 G 个组，同组内共享 K/V 头，但保留多个 Q 头。

这样既保留了多头注意力的表达能力，又接近 MQA 的缓存效率。

LLaMA 2 就采用了 GQA：7B 模型用 1 个 KV 头（相当于激进 MQA），70B 模型用 8 个 KV 头（GQA 中间档）。

这也是为什么 LLaMA 2 70B 可以在单卡 80 GB 显存上跑 4K 上下文，而同等参数量的 dense 模型跑不动的原因之一。

![](https://iili.io/qbiS47S.png)
> 显存不够，所以 KV 头得合并——代价是 attention 表达能力

### 上下文越长越贵：线性增长还是二次增长？

很多候选人会在面试里说「上下文越长，KV Cache 越大，成本越高」。这没有错，但面试官往往会追问：具体是线性增长还是二次增长？

这里有一个常考的区分：

- **KV Cache 的显存占用** ：与上下文长度 L 线性相关。每个 token 占用固定的缓存空间，L 个 token 就是 L 倍。

- **Attention 的计算量** ：与序列长度的平方成正比。对于一个 L 长的序列，每一层做一次 O(L²) 的 attention。

Prefill 阶段（处理整个输入上下文）需要做完整的 O(L²) attention 计算，这部分成本随 L 快速增长。

但 KV Cache 把增量生成阶段（Decode）从 O(L²) 降到了 O(1) per token——每生成一个新 token，只需要计算它自己的 Q 和当前缓存 K/V 的点积，不需重新跑完整 attention。

这就是为什么长上下文模型的成本结构是非对称的：**输入 token 的计费往往比输出 token 更贵** ，因为输入要付出一整个 Prefill 的 O(L²) 代价。

主流 API 的计费策略（输入 token 和输出 token 价格不同）本质上是对这种非对称性的定价还原。

### Streaming、Batching 与并发：服务端优化的三条路

在生产环境里，KV Cache 还涉及一个核心问题：如何高效处理大量并发请求？

**Static KV Cache（静态批处理）** ：为每个请求预先生成并缓存完整上下文的 KV Cache，后续生成只需做 Decode。

适合长上下文、固定 prompt 的场景，比如 RAG 系统里的文档编码。缺点是预填充本身就要付出 O(L²) 的计算成本，且缓存占用时间长。

**Dynamic Batching（动态批处理）** ：将多个长度相近的请求打包成一个批次处理，提高 GPU 利用率。

挑战在于不同请求的生成长度不可预测，短请求结束后需要「unpad」释放资源，否则会阻塞长请求。

vLLM 的 PagedAttention 通过分页管理 KV Cache 物理块，显著提高了 batching 效率[1](https://arxiv.org/abs/2309.06180)。

**Streaming（流式输出）** ：每次只生成并发送一个或少数几个 token，降低首 token 延迟（Time to First Token, TTFT）。

这对交互式体验至关重要。

但 streaming 模式下 KV Cache 仍然需要被累积，不能中途丢弃——除非模型支持完全的 incremental decoding 不需要缓存历史 K/V（这对架构有特殊要求）。

> 这张图展示了 Prefill 和 Decode 在计算模式上的本质差异，以及服务端并发优化的三条主流路径。理解这张图，能回答「上下文长度怎么影响延迟」这类面试题。

### KV Cache 与 Agent 输出稳定性的关系

回到 Vol.3 系列的核心主题：如何在 Agent 工程里用好 LLM 生成？KV Cache 对 Agent 系统的影响主要体现在两个方面。

**第一，是 token 预算控制** 。Agent 系统的多轮对话里，历史消息会作为上下文持续累积。

如果不做截断策略，上下文会无限增长，每次生成都要付出一整个 Prefill 的 O(L²) 成本，而且 KV Cache 显存也会持续膨胀。

很多 Agent 框架会维护一个「上下文窗口管理」策略：保留最近 N 轮对话，或用摘要模型压缩历史。

**第二，是函数调用的一致性** 。在 Function Calling 场景里，Agent 需要稳定地输出结构化的 tool 调用请求。

低温采样策略保证了 logits 分布的稳定性，但如果底层 KV Cache 管理出现混乱（常见于并发 Batching 时的缓存竞争），可能导致相同 prompt 在不同请求间出现输出不一致——这是生产级 Agent 系统需要重点排查的工程问题。

![](https://iili.io/B6vsO5F.png)
> 并发时 KV Cache 打架，相同的 prompt 跑出不同的工具调用

KV Cache 是 LLM 推理优化里最核心的工程权衡之一。它把一个本来随序列长度平方增长的计算问题，转化成了一个线性增长的存储问题——显存换计算。

但这条 trade-off 线上还有很多坑：显存带宽上限、KV 头数量选择、上下文长度与 batch size 的联合约束，以及生产环境里的缓存竞争与生命周期管理。

面试里能把这些讲清的候选人，往往已经在实际项目里踩过显存不够的坑，而不是只在论文里读过 KV Cache 这个名字。

## 项目里怎么说：把生成链路落到 Agent 输出稳定性

这一节的任务是把前五个章节串联成一套可以在面试里直接开口讲的项目叙事。

### 结构化输出与低温策略的配合

当你在项目里实现过 RAG + Agent pipeline，应该怎么把 LLM 生成链路讲出工程价值？

一个典型的讲法是这样的：

> 项目里对工具调用的稳定性要求很高，不能今天返回 `{"tool": "query_db", "args": {...}}` 明天返回 `{"action": "search", "params": {...}}`。为此我们把采样温度固定在 0.0~0.1 之间，并在 prompt 里显式约定 JSON Schema，保证 Agent 的函数调用在语法和语义两层都是稳定的。

这段话之所以能过面试，关键在于它同时展示了三个能力：知道温度对分布的影响（技术理解），知道结构化输出的实现路径（工程经验），知道「一致性」是 Agent 系统的核心评价指标（系统思维）。

如果候选人只会背「温度越高越随机」，讲不出自己在项目里怎么选值、为什么这么选，面试官会直接判断这个人没有亲手调过参数。

### Token 预算控制：上下文截断与摘要压缩

多轮对话 Agent 里，上下文会随对话轮数线性增长。每次生成请求带着完整历史去 Prefill，成本随历史长度平方增长——这是很多候选人没有算过的一笔账。

项目里常见的做法有两类：

**固定窗口截断** ：保留最近 N 轮对话或最近 M 个 token，超出部分直接丢弃。实现成本低，但会丢失早期关键信息。**摘要压缩** ：用一个小型蒸馏模型（或同一模型在摘要模式）对历史做压缩，把长对话压缩成短摘要再送进 prompt。

OpenAI 在 GPT-4o 里提到的上下文窗口管理策略就属于这类思路的工程落地。

如果你在项目里做过这个，面试里可以这样量化：

> 上线后发现多轮对话到第 15 轮以后，API 延迟从 800ms 涨到 3 秒以上。加了固定窗口截断（保留最近 8 轮）后，平均延迟稳定在 1.2 秒，API 调用成本下降约 35%。

有数字、有因果、有行动，这段项目复盘的质量就能甩开大多数泛泛而谈的候选人。

### 重试机制与幂等设计：面对偶发异常的工程兜底

即使采样参数选得再好，LLM API 在生产环境里仍然可能出现偶发异常：超时、格式错误、模型返回空响应。这类问题在 Agent 系统里直接影响下游工具调用，不能靠「调温度」解决。

一个完整的兜底策略通常包括：

- **语法校验层** ：用 JSON Schema 或 Pydantic model 做结构校验，格式不对的响应直接触发重试。

- **指数退避重试** ：对 API 超时做 3 次指数退避，每次间隔 2^n 秒，避免瞬时压力压垮模型端。

- **降级策略** ：连续重试失败后，fallback 到规则引擎或返回用户友好提示，而不是让整个 pipeline 卡死。

面试里讲重试机制，重点不在「我加了 try-catch」，而在「我设计了一套面向 Agent 系统 SLA 的容错方案」。

![](https://iili.io/B2xXp3l.png)
> 模型吐回了空 JSON，重试次数已经拉满了

### 端到端 latency 拆解：你怎么把 2 秒延迟讲出价值

很多候选人在项目里用过 LLM API，但没有人拆过端到端的延迟构成。

如果你能把 Latency = TTFT + TPUT + Network 的拆解说出来，面试官立刻知道你真正在生产环境里优化过[1](https://arxiv.org/abs/2104.09864)。

具体可以这样讲：

> 上线后用 LangSmith 跑了 200 条真实对话日志，发现平均延迟 1.8 秒，其中 Prefill 占了 65%（1.17 秒），Decode 占了 25%（0.45 秒），网络开销 10%（0.18 秒）。对 Prefill 做了 prompt 压缩（去掉冗余模板），Prefill 时间降到 0.7 秒，端到端延迟优化到 1.1 秒。

这里展示的核心能力是**可观测性** ：你知道怎么定位瓶颈，而不是只会说「优化了一下」。

> 这张图帮助读者把 RAG 从一次检索理解成可评估的闭环系统。

## 典型追问与易错边界

这一节整理面试里最容易出现的追问方向，以及候选人最容易踩进去的坑。

### 追问一：自回归的本质——「下一步」到底预测了什么

几乎每个面试官都会追问：「你说模型预测下一个 token，这个『下一个 token』是怎么选出来的？」

标准答案应该包含三层：

1. **分布预测层** ：模型在每个位置输出一个 logits 向量，其维度等于词表大小 V，表示「词表中每个词作为下一个 token 的条件概率」。

2. **归一化层** ：logits 经过 Softmax 变成概率分布 P(word|context)。

3. **采样层** ：从分布 P 中采样得到实际 token——这一步才是「选择」发生的地方，而这正是 Temperature、Top-k、Top-p 这些参数的控制对象。

很多候选人卡在第一层：把「预测下一个 token」理解成「模型从词表里选了一个词」，而不理解_logits → softmax → 采样_这条链的物理意义。

### 追问二：Temperature 为零时，模型还「随机」吗

这是高频踩坑题。

当 Temperature → 0，Softmax 的分母里 exp(logits/T) 中的 T 趋近于 0，导致除最大的 logit 外的所有 exp 输出趋近于 0，概率分布趋向于 one-hot：只有最大 logit 对应位置的 softmax 值接近 1。

此时采样实际上变成了**贪婪选择（greedy）** ：每次都选概率最高的 token，输出是确定性的。

但这里有一个细节陷阱：Top-p 或 Top-k 在 Temperature = 0 时仍然会被执行。

如果候选人说「Temperature=0 就完全确定」，面试官可能会追问「那如果我同时设了 Top-p=0.9 呢」——答案是 Top-p 仍然会作用，采样集合被限制在累积概率最高的词汇上，模型行为与纯贪婪并不完全等价。

### 追问三：中文 token 成本为什么更高

这道题有两层回答维度。

第一层是技术层：BPE 在中文语料上的 token 效率天然低于英文。

英文单词「economics」可能被切成「eco」，「nom」，「ics」三个子词，而中文每个汉字通常至少映射到一个独立 token，一个专业术语可能需要四到五个 token 才能完整表示。

第二层是工程层：主流 API 定价以 token 为单位，中文输入 token 数量约为中文字符数的 1.5~2 倍（视具体分词器和词表而定）。

这意味着同样长度的内容，中文的 API 调用成本会比英文高出近一倍。

面试里能把这个「双重成本」讲出来的候选人，说明他不仅理解 BPE 的原理，还理解为什么这个原理会影响真实的系统预算。

### 追问四：上下文越长，KV Cache 的显存线性增长还是二次增长

这道题在第五章已经展开过，但面试官有时会换一个角度追问：「既然 KV Cache 把计算变成了线性，那为什么上下文不能无限长？」

答案是：计算成本可以平摊，但**显存上限不会变** 。

即使每生成一个 token 的新增计算量是 O(1)，显存里要存的 KV Cache 总量仍然是 O(L)。

而 L 的上限由模型支持的上下文窗口和显存容量共同决定——LLaMA 2 7B 支持 4K 上下文，70B 支持 8K（FP16 下 KV Cache 显存已经逼近单卡上限），而 GPT-4 Turbo 的 128K 上下文需要专门的推理优化才能跑得动。

所以准确的回答是：**新增 token 的计算量线性，新增 token 的 KV Cache 存储量线性，但总缓存量与上下文长度线性相关，而总注意力计算量仍然是序列长度的二次函数（Prefill 阶段）** 。

能把这个非对称结构讲出来的候选人，对 KV Cache 的理解已经超出了「缓存加速」这个表层描述。

### 追问五：为什么 Agent 场景偏好低温策略

这个问题实际上在问的是**你对采样参数与任务类型的匹配理解** 。

Function Calling、代码生成、结构化 JSON 输出——这些任务都有一个共同特征：输出空间有强约束，错误格式直接导致下游崩溃。

低温（Temperature → 0）让分布趋向确定性，减少格式飘移的概率。

但这里有一个边界条件要清楚：**低温不等于零错误率** 。

即使在 Temperature = 0 下，模型仍可能输出不符合 JSON Schema 的内容——这是模型本身对约束遵循能力的局限，不是采样参数能解决的问题。

所以项目里真正有效的策略是**低温 + 结构化约束双保险** ：Temperature 降低分布随机性，JSON Schema 约束语法合法性，两层一起把错误率压下去。

![](https://iili.io/qbi8SHP.png)
> 低温还是跑偏，Schema 校验层加上去才发现问题

### 易错边界总结

整理这一章的核心易错点：

**BPE 不是按空格分词** ：中文按字符级别处理，英文按子词而非整词处理，BPE 的切分由语料频率驱动，不是语言学规则。**Temperature 控制的是分布形状，不是「随机程度」** ：Temperature 改变 Softmax 的 sharpness，趋近 0 时趋向 greedy，但不等于完全固定（Top-p 在低温下仍会作用）。**KV Cache 节省的是计算，不是显存** ：Decode 阶段的 O(1) per token 是计算量意义上的，但显存里存的 KV Cache 总量仍然随上下文线性增长。**Prefill 阶段的成本被低估** ：大多数候选人只关注输出 token 的生成速度，但输入端的 Prefill 承担了完整的 O(L²) attention 计算，成本往往高于 Decode 阶段。**自回归生成不是「选词表里最大的」** ：完整路径是 logits → Softmax → 采样，三层缺一不可，采样才是引入随机性的环节。

能把这些边界条件讲清楚、还能用项目数据或代码片段佐证的候选人，在面试官眼里的定位已经从「背过概念」跃升到了「真正用过、改过、调过」——这个差距，才是面试分数质的分水岭。

---

LLM 推理工作流是一条从文本到 token、从 token 到分布、从分布到采样的完整链路。

每一个环节都有清晰的工程 trade-off：BPE 决定计费效率，Embedding 决定语义表示质量，Transformer 前向决定 logits 精度，采样参数决定输出分布形状，KV Cache 决定延迟与显存的取舍。

面试里能把这套链路串起来、还能说出每个环节背后的「为什么」的候选人，说明他理解的是 LLM 作为工程系统的本质，而不是一个黑盒 API 调用器。

这不是一道靠背答案能过的题，但它是一道真正动手做过项目、调过参数、算过账的工程师，能讲得出彩的题。

![](https://iili.io/B9HlDhu.png)
> 能讲出这层的候选人，面试官已经开始记名字了

## 参考文献

1. [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
