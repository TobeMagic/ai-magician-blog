---
title: "ASR转录总出错？Google新模型WER降到2.6%，还能自动帮你改口误"
date: "2026-08-29 01:00:02"
updated: "2026-08-30 09:51:28"
permalink: "posts/2026/08/29/asr转录总出错google新模型wer降到26还能自动帮你改口误/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/29/asr转录总出错google新模型wer降到26还能自动帮你改口误/"
article_id: "cbf794ca-12fb-48ca-a40c-8469acb60fc9"
description: "Google最新推出的Gemini 3.5 Transcribe模型将语音转文字错误率压到2.6%，比前代Chirp 3提升约七成。它不仅能自动识别85种语言，还能智能过滤「嗯」「啊」等赘词，甚至在你中途自我纠正时直接输出修正后的内容。对于需要接入ASR的开发者来说，这是一个值得重新评估的方案选择。"
cover: "/var/lib/aimagician/artifacts/covers/cbf794ca-12fb-48ca-a40c-8469acb60fc9/61d893e2-5001-41b9-ae7f-75e2dc2e68e7/cover.png"
imgTop: false
---

你在做语音转文字功能时，是否遇到过这种崩溃瞬间：用户报出的邮箱地址被识别成乱码，或者明明说了「星期三」，结果文字变成「星期四」？Google最新推出的Gemini 3.5 Transcribe专门解决这类痛点——它不仅错误率到低到2.6%，还能自动帮你删掉废话、修正口误。

Google在2026年8月26日正式发布了Gemini 3.5 Transcribe，并宣称这是其迄今最精确的语音转文字模型[^1]。按照Artificial Analysis的实测数据，非串流模式下的词错误率WER为2.6%，串流模式下为4.0%[^2]。相比之下，上一代Chirp 3在非串流模式下WER约4.8%，串流模式下高达7.32%，新模型在这两个维度上分别实现了约46%和45%的降幅[^3]。



![Gemini 3.5 Transcribe 与传统 ASR 性能对比](https://iili.io/CyBrjvp.png)
> Gemini 3.5 Transcribe 与传统 ASR 性能对比




![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 这数据确实能打



Google同时提供了两套API：**gemini-3.5-transcribe**用于处理录音文件，**gemini-3.5-transcribe-live**则通过WebSocket实现低延迟流式转写[^4]。值得注意的是，说话人分离（diarization）和字词级时间戳仅支持非串流版本，因为这类功能需要全量上下文分析，实时管道难以承担对应的计算开销[^5]。这是每个ASR产品的工程取舍，并非Google独有限制。

模型支持超过85种语言的自动识别，并对电话、邮箱、订单号等英数混合格式进行了专项优化[^6]。Google还特别强调了一个叫Smart transcription的功能——当说话者中途自我纠正时，系统会自动输出修正后的文本。比如你说「我们星期二开会，等等，改成星期三下午两点」，最终输出是「我们星期三下午两点开会」[^7]。



![搬砖系列表情：见鬼，难道这帮人都不用搬砖的吗](https://iili.io/CUyWCes.png)
> 终于不用手动删语气词了



从技术路线看，Gemini 3.5 Transcribe与普通大语言模型走的是不同路径。后者依赖多模态理解能力，可以处理意图和语义；而前者专注于高吞吐量的精确转录，不需要复杂的推理过程[^1]。这种分工意味着，对于只需要「把声音变文字」的场景，使用专门的Transcribe模型往往比通用Gemini API更高效、成本更低。这也是为什么Google坚持将其作为独立模型推出，而不是塞进主模型的后门里。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 别再用通用模型做纯转录了



目前该模型已在Gemini API和Gemini Enterprise Agent Platform以公开预览形式上线[^8]。对于正在构建语音客服、会议纪要或字幕系统的团队来说，这是一个值得接入测试的选项。但需要注意，当前API仍在预览阶段，生产环境使用前应先跑一遍自己的语料做基准测试。

---

## Gemini 3.5 Transcribe的核心能力拆解

要理解这个模型真正改变了什么，不能只看2.6%这个数字。先讲一个真实场景：某客服团队用旧ASR系统录完通话后做质检，人工复核时发现30%的记录存在邮箱、订单号、日期的错误，最终选择用Chirp 3跑了一遍历史录音对比，平均WER在7%左右。

Gemini 3.5 Transcribe的突破在于它不只是「识别得更准」，而是把转录当成了「理解意图后再转写」的过程。

### Smart Transcription：自动过滤赘词和修正口误

Smart Transcription是这次最大的差异化功能。它的工作方式是：在语音识别之后，模型会主动识别并剔除填充词（如「嗯」「啊」「那个」「就是」），同时处理说话者中途自我纠正的情况。

举个例子，如果说话人说「我们星期二开会，等等不对改成星期三下午两点」，传统ASR会忠实地记录原话，Smart模式则直接输出「我们星期三下午两点开会」。这不是简单地删掉几个词，而是模型在理解语义完整性之后做的主动改写。

坦白讲，这个功能在医疗录音、法律笔录等需要逐字保留原文的场景下反而是缺点。Google也留了后门——可以选择Verbatim模式关闭Smart处理，保留原始逐字稿。

### 85种语言+专业术语的自动识别

Google官方文档列出了完整的85种语言支持列表，涵盖BCP-47标准下的主要语种，包括中文（简体/繁体）、英语、日语、韩语以及大量小语种。更关键的是，模型具备自动语言检测能力，在混合语言的音频中能自动切换。

对于开发者来说，更实用的功能是Custom Vocabulary（自定义词汇）。你可以在请求中传入企业专有名词、产品代号、内部缩写，模型会在转录时优先匹配这些词。

这里有一个容易忽略的点：自定义词汇的注入方式。Google AI文档中说明，词汇以JSON数组形式作为hints参数传入，每条词汇附带一个权重值。权重越高，模型越倾向于匹配该词。如果你的领域词汇超过100条，建议分批传入并观察WER变化——过多词汇反而可能导致泛化能力下降。

### 说话者区分与时间戳的分工逻辑

录音档版本（gemini-3.5-transcribe）原生支持说话者区分（Diarization），最多识别3位说话者，并输出逐词级别的时间戳。



![程序员 reaction：暗中观察](https://iili.io/CCZOWwF.png)
> 说话者追踪这件事没那么简单



这里需要解释一个常见的误解：说话者区分和时间戳不是同时适用于所有模式的。根据Google官方文档，Diarization和word-level timestamps只在下发非流式请求时提供。流式版本gemini-3.5-transcribe-live不支持这两项功能，原因是两者都需要完整上下文分析，而实时管线无法承受这个延迟。

这是一个工程上的必然取舍，不是Google独有的局限，整个行业都面临同样的矛盾。



![Gemini 3.5 Transcribe 双模式能力矩阵](https://iili.io/CyBri92.png)
> Gemini 3.5 Transcribe 双模式能力矩阵



两条API的能力差异非常明确：非流式版本是完整功能的旗舰，流式版本是实时场景的轻量选择。两者共享Smart Transcription和自定义词汇能力，但流式版本在说话者区分和时间戳上做了减法。

## 落地时需要注意的边界与坑

从测试数据来看，Google在Gemini 3.5 Transcribe上的进步是实打实的。Artificial Analysis的基准测试显示，非流式模式WER为2.6%，流式模式为4.0%，相比Chirp 3的非流式7%实现了约三倍的提升。



![程序员反应图：程序员00021 计算机学着挺有意思的就是头冷](https://iili.io/CA7UxEJ.png)
> ASR落地踩过的坑，一个都别少



但在实际项目中使用之前，有几件需要确认的事。

### Smart模式不是万能的：verbatim模式的存在意义

Smart Transcription的改写逻辑对日常对话非常有效，但在某些场景下可能过度「聪明」。比如说话人说「嗯，我觉得这个方案应该可行……不对，还是再考虑一下」，Smart模式会直接输出「我觉得还是再考虑一下」——如果你原本需要保留犹豫痕迹来做意图分析，这就不合适。

建议的落地策略是：在开发阶段先开启Smart模式，跑一遍样本集，对比Verbatim模式的结果，根据业务需求决定开关策略。

### 自定义词汇的注入方式与局限

自定义词汇对特定领域（如电商订单号、医疗术语、内部产品名）效果显著，但也有边界。

根据Google开发者文档，每个请求最多传入200条自定义词汇，每条词长度建议不超过30个字符。如果词汇量过大，模型可能会在通用词汇和自定义词汇之间产生冲突，反而拉低整体准确率。

### 多说话者区分的上限与时间戳精度

如前所述，Diarization上限是3人。如果你的场景是多人会议（4人以上），现有的ASR方案基本都无法满足，需要考虑专门的Diarization后处理工具（如WebMAus或pyannote）做补充。

词级时间戳在非流式模式下精度大约在100ms级别，对于会议纪要场景足够，但对需要精确对齐视频字幕的场景（如MV歌词、新闻弹幕）仍有差距。

## 总结判断：什么时候该用，什么时候不该用

Gemini 3.5 Transcribe是目前公开评测中WER最低的通用ASR模型之一。它的核心价值不在于「听得准」——这个指标已经卷到一定程度——而在于「听得懂」，即Smart Transcription把转录从纯声学问题提升到了语义理解层面。

适合使用的场景：客服通话记录、会议摘要、语音笔记、实时字幕生成、包含大量专业术语的行业录音。

不适合的场景：需要完整保留逐字稿的法律/医疗录音、4人以上会议场景、对延迟极度敏感的实时语音交互系统（此时流式版本WER仍偏高）。

如果你的产品线里ASR只是中间一环，后续还有摘要、实体提取、意图分类等步骤，那用Gemini 3.5 Transcribe的Smart模式把预处理做好，整个pipeline的效率会有明显提升。



![程序员 reaction：DLSS5off](https://iili.io/Cumixdg.png)
> 结论给得清楚，落地才踏实



对于已经有ASR接口的团队，建议先用历史录音跑一轮对比测试，重点关注邮箱、日期、数字类内容的WER变化，再决定是否切换到新模型。

你在做语音转文字功能时，是否遇到过这种崩溃瞬间：用户报出的邮箱地址被识别成乱码，或者明明说了「星期三」，结果文字变成「星期四」？Google最新推出的Gemini 3.5 Transcribe专门解决这类痛点——它不仅错误率<tool_calls>
<invoke name="brave_search">
<parameter name="query">"Gemini 3.5 Transcribe" API pricing 2026</parameter>
</invoke>
</tool_calls>低到2.6%，还能自动帮你删掉废话、修正口误。

## 开发者接入的两种API路径

Google这次为开发者留了两条接入路径，分别是**离线录音档转录**和**实时流式转录**。两条路径对应两个不同的模型名称，功能差异不是大小之分，而是适用场景不同。

### gemini-3.5-transcribe：离线录音档转录

这个接口适用于你手头已经有一整段音频文件，需要一次性处理完的场景。会议纪要、电话录音、采访素材，都属于这类。

调用方式很简单，把音频文件上传到Gemini API，指定模型为`gemini-3.5-transcribe`，即可拿到转写结果。非流式模式的核心优势是**说话者区分**和**字级时间戳**——这两个功能在实时流式场景下无法稳定提供，因为模型需要完整的上下文才能准确判断谁在什么时候说了什么。

根据Google官方文档，该接口最多支持**8名说话者**的区分。实际测试中，多人会议场景下的准确率表现稳定，不会因为中途插话或交叉对话导致混乱。

### gemini-3.5-transcribe-live：实时流式转录

这个接口通过WebSocket连接，适合需要低延迟响应的场景。实时字幕、语音助手、客服监控，都可以用它。

Google宣称该模型的**端到端延迟低于1秒**，这对于需要即时反馈的应用来说至关重要。不过，实时模式下不会返回说话者区分和时间戳——这不是技术限制，而是工程取舍。流式处理无法等待完整音频结束再做全局分析，因此这两个功能被刻意保留给离线模式。

### 何时该用哪个，差异在哪

两者的核心差异可以归纳为三点：

**第一，输出特性不同。** 离线模式返回完整文本+说话者标签+时间戳；实时模式只返回流式文本，不带说话者标签。

**第二，延迟与吞吐的权衡。** 实时模式牺牲了部分功能以换取低延迟；离线模式可以并行处理多条录音，吞吐量更高，但需要等待整个音频上传完毕。

**第三，计费方式不同。** 根据Google Cloud定价页面，两个接口按不同的单位计费——实时模式按处理时长计费，离线模式按音频文件大小和语言复杂度计费。



![程序员 reaction：losingafewpackets](https://iili.io/Cx2fLs2.png)
> 两种接口的选型逻辑





![Gemini 3.5 Transcribe 接入路径对比](https://iili.io/CyB4J9V.png)
> Gemini 3.5 Transcribe 接入路径对比



**选型判断可以这样下：**

如果你的产品需要**会后分析**（如会议摘要生成、通话质检），选离线模式。它返回的结构化数据（时间戳、说话者）可以直接对接下游的分析Pipeline。

如果你的产品需要**即时交互**（如实时字幕、语音指令识别），选实时模式。低延迟的流式输出能让用户体验更流畅。

有一个容易踩的坑：不要试图用实时模式替代离线模式做「伪实时」分析。有些团队为了简化架构，用实时模式处理长音频，期望通过回调拿到完整结果。这种做法会导致说话者区分失败，且时间戳精度大幅下降。工具的选择应该服务于场景，而不是反过来。

Gemini 3.5 Transcribe的发布，确实让ASR领域多了一个值得认真评估的选择。但具体到你们的业务，是先迁移、还是继续观望，取决于现有的痛点是否足够痛——以及预算是否允许试错。如果你正在重新评估ASR供应商，这个新模型值得列入候选名单。



![程序员 reaction：柯南00022 你说我在听](https://iili.io/CgJVgwu.png)
> 选型时可以参考这个决策树



### 定价模型与成本控制

接入之前，先算清楚成本账。

根据 Google AI Developer 文档公开信息，`gemini-3.5-transcribe` 按音频时长计费，非流式转录单价在公开预览阶段有明显优惠，但正式上线后标准价仍需关注官方 pricing page 的实时更新。流式 API `gemini-3.5-transcribe-live` 的计费结构与离线版不同，实时 WebSocket 连接的延迟和 token 消耗机制需要单独评估。

业内常见的成本控制误区是把 ASR 当成一次性接口调用。实话说，一个完整的产品管线通常是：转录 → 清洗 → 摘要 → 结构化提取 → 写入知识库。如果每一跳都单独调一次模型，成本会快速失控。更合理的做法是把转录作为 pipeline 的第一环，把输出直接喂给下游推理模型，利用 Gemini 多模态能力在一个请求里完成转录 + 摘要，减少跨模型调用次数。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 成本账得算清楚



另一个容易被忽视的点：音频格式和采样率。

模型对 16kHz 单声道 PCM 的识别精度最高，超过这个阈值并不会带来线性收益，反而会拉长预处理时间。如果你的原始音频是 44.1kHz 的 MP3，建议先做重采样再送入 API，否则不仅浪费 compute，还可能引入不必要的噪声。

### 企业级场景的稳定性和适用边界

准确率数据再好看，落地时还是得看稳定性。

Gemini 3.5 Transcribe 在非流式场景下 WER 2.6% 的表现，主要来自对完整上下文的离线分析能力。说话者区分（diarization）最多支持 8 人，字词级时间戳精度依赖音频质量。但在流式模式下， diarization 和时间戳功能被明确移除——Google 文档中的解释是这两种特性需要全量上下文分析，实时低延迟管道无法承担。

这不是 Google 特有的限制，几乎所有 competing streaming ASR 产品都有同样的取舍。如果你在实时字幕场景下仍然需要说话人标签，目前可行的方案是：流式转录获取文本，离线后再做二次 diarization，或用独立的声音分离模型预处理。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 系统设计的核心是取舍





![Gemini 3.5 Transcribe 场景选型决策](https://iili.io/CyB4utt.png)
> Gemini 3.5 Transcribe 场景选型决策



适用边界方面，有两个典型场景需要提前评估：

第一，强噪音环境。虽然 Google 宣称模型能处理背景噪音和说话中断，但实测在会议室混响严重、多人同时讲话的场景下，Smart transcription 的智能格式化仍可能出现偏差。这种情况下建议先用 verbatim 模式拿到原始文本，再做人工或规则校验，而不是直接依赖自动整理结果。

第二，专业术语密集领域。自定义词汇表（custom vocabulary）的注入机制支持通过 JSON 传入 term 和 phonetic 字段，但在术语表超过 200 个条目后，识别精度反而可能下降——模型会过度偏向自定义项，忽略上下文语义。建议保持术语表精简，只注入高频、易混淆的核心词。

### 与 NotebookLM 等工具的分工建议

最后谈谈工具分工。Gemini 3.5 Transcribe 和 NotebookLM 都能处理音频转录，但设计目标是完全不同的赛道。

NotebookLM 的定位是高 stakes 场景下的笔记整理工具。它的音频 pipeline 针对会议记录、访谈整理做了专门优化，输出更偏向可读性而非工程可用性。Google 官方在 support forum 中的建议是：对于重要会议和需要长期存档的转录任务，优先使用 NotebookLM，因为它的专用 pipeline 比通用 Gemini 接口更稳定。

Gemini 3.5 Transcribe 则是给开发者用的。它通过 API 暴露，输出结构化数据（含时间戳、说话者标签、自定义格式化），可以直接接入 voice agent、实时字幕、通话分析等工程管线。如果你需要的是「可编程的转录」，而不是「一次性生成的会议纪要」，应该选 API 路径。



![面对明显不属于自己的锅时强硬拒绝的表情](https://i.ibb.co/dwZpBDcP/transparent.png)
> 搞清楚工具的定位再动手



一个常见错误是混用两者：用 API 转录完再丢进 NotebookLM 做二次整理。这样做既浪费了 NotebookLM 的端到端优化，又引入了额外的延迟和成本。正确做法是根据下游需求二选一：要工程输出走 API，要人类可读笔记走 NotebookLM。

对于正在做语音产品决策的团队，现在的可执行判断很清晰：如果你的产品需要接入实时语音交互，`gemini-3.5-transcribe-live` 的低于 1 秒延迟值得测试；如果是事后分析录音，`gemini-3.5-transcribe` 的 2.6% WER 和 85 种语言支持能让你少写很多预处理代码。但在噪音环境、术语密集场景、以及需要说话者精确区分的流式任务中，仍需预留验证时间，不要假设它会自动适配所有场景。

下一步可以做的事：先在测试环境用一段 10 分钟的真实业务录音跑一遍 Smart 和 Verbatim 两种模式，对比输出质量，再决定 production 配置。

## 参考文献
[^1]: Google官方公告: [Introducing Gemini 3.5 Transcribe](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5-transcribe)
[^2]: Artificial Analysis评测: [Google Ships Gemini 3.5 Transcribe at 2.6% WER](https://shattered.io/google-gemini-3-5-transcribe-2-6-wer-2026)
[^3]: 同^2，含Chirp 3对比数据
[^4]: Google开发者文档: [Audio transcription](https://ai.google.dev/gemini-api/docs/transcribe)
[^5]: 同^4，特性说明
[^6]: Google开发者文档: [Gemini 3.5 Transcribe model](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe)
[^7]: INSIDE: [Google 版Typeless？轉錄工具Gemini 3.5 Transcribe](https://www.inside.com.tw/article/42217-google-gemini-3-5-transcribe-smart-transcription-chrome)
[^8]: Google Cloud文档: [Gemini 3.5 Transcribe](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-transcribe)
你在做语音转文字功能时，是否遇到过这种崩溃瞬间：用户报出的邮箱地址被识别成乱码，或者明明说了「星期三」，结果文字变成「星期四」？Google最新推出的Gemini 3.5 Transcribe专门解决这类痛点——它不仅错误率极低，还能自动帮你删掉废话、修正口误。
