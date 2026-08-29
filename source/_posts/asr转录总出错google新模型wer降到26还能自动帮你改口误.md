---
title: "ASR转录总出错？Google新模型WER降到2.6%，还能自动帮你改口误"
date: "2026-08-29 01:00:02"
updated: "2026-08-29 01:06:38"
permalink: "posts/2026/08/29/asr转录总出错google新模型wer降到26还能自动帮你改口误/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/29/asr转录总出错google新模型wer降到26还能自动帮你改口误/"
article_id: "cbf794ca-12fb-48ca-a40c-8469acb60fc9"
description: "Google最新推出的Gemini 3.5 Transcribe模型将语音转文字错误率压到2.6%，比前代Chirp 3提升约七成。它不仅能自动识别85种语言，还能智能过滤「嗯」「啊」等赘词，甚至在你中途自我纠正时直接输出修正后的内容。对于需要接入ASR的开发者来说，这是一个值得重新评估的方案选择。"
cover: "/var/lib/aimagician/artifacts/covers/cbf794ca-12fb-48ca-a40c-8469acb60fc9/61d893e2-5001-41b9-ae7f-75e2dc2e68e7/cover.png"
imgTop: false
---

你在做语音转文字功能时，是否遇到过这种崩溃瞬间：用户报出的邮箱地址被识别成乱码，或者明明说了「星期三」，结果文字变成「星期四」？Google最新推出的Gemini 3.5 Transcribe专门解决这类痛点——它不仅错误率低到2.6%，还能自动帮你删掉废话、修正口误。

## 为什么ASR的错误率还能再降？

### Google这次交出了什么成绩

根据 Artificial Analysis 的测试数据，Gemini 3.5 Transcribe 非流式模式词错误率（WER）仅2.6%，流式模式4.0%。前代 Chirp 3 流式WER约7.32%，新模型精度提升约七成，处理速度也提升约70%。

### 2.6% WER是怎么做到的

核心机制是 **Smart Transcription**（智慧转写）。传统ASR逐词识别，遇到口吃照单全收；而 Gemini 3.5 Transcribe 基于上下文整句理解，自动过滤填充词，甚至在你自我纠正时直接输出修正内容。比如「我们星期二开会……不对，改成星期三下午两点」，系统直接输出「我们星期三下午两点开会」。

它还强化了英数混合数据识别——电话、邮箱、订单编号等场景都能正确格式化。



![程序员 reaction：Manager,I'vebeenwaitingfor](https://iili.io/Cx2BFjf.png)
> ##为什么ASR的错误率还能再降



## Gemini 3.5 Transcribe的核心能力拆解

### 85种语言+专业术语的自动识别

模型原生支持85种语言自动检测，并允许注入自定义词汇表。医疗、法律、金融等专业场景可预注册术语，减少歧义。

### 说话者区分与时间戳的分工逻辑

重要取舍：**说话者区分（diarization）和字级时间戳仅存在于非流式 API**，流式版本不包含这两项。Google 解释称，这两项需完整音频上下文分析，实时流式无法承受该开销——这也是所有竞争方案的共性选择。



![程序员系列表情：据说换成这个发型，面试通过率很高](https://iili.io/CC5AHjp.png)
> ##Gemini3.5Trans



## 开发者接入的两种API路径

Google 提供两条路径：

- **`gemini-3.5-transcribe`**：处理预录制完整音频文件，适合会议录音、播客后期分析。
- **`gemini-3.5-transcribe-live`**：通过 WebSocket 实时流式转录，延迟低于1秒，适合语音助手、实时字幕。

选择逻辑清晰：需说话者标记和时间戳选非流式；需毫秒级响应选流式。两者不可兼得。

## 集成过程中的常见坑

### 定价模型与成本控制

Gemini 3.5 Transcribe 按 token 计费，长音频成本不低。若工作流仅是「转录 + 摘要」，考虑交给 NotebookLM——它对音频源有专门管道，稳定性更强，适合高价值记录场景。

### 企业级适用边界

嘈杂环境（多人同时说话、强背景噪音）下，建议先用小规模样本做基准测试。模型虽强，但并非万能。

### 一句话判断

构建语音输入产品时，Gemini 3.5 Transcribe 是目前最值得接入的 ASR 方案之一；但选对 API 路径、控制试错成本，比盲目追求精度更重要。



![程序员系列表情：咱喝杯Java冷静下](https://iili.io/CuzaGNn.png)
> ##集成过程中的常见坑###定价



## 参考文献
[1] Stop Wrestling with ASR: The Complete Guide to Gemini .... https://dev.to/googleai/stop-wrestling-with-asr-the-complete-guide-to-gemini-35-transcribe-1m6i
[2] How to build with Gemini 3.5 Transcribe | daily.dev. https://daily.dev/posts/how-to-build-with-gemini-3-5-transcribe-q6cozyqbn
[3] Google Ships Gemini 3.5 Transcribe at 2.6% WER [2026]. https://shattered.io/google-gemini-3-5-transcribe-2-6-wer-2026
[4] Repeated failures with Transcription or reading of audio files. https://support.google.com/gemini/thread/416158931/repeated-failures-with-transcription-or-reading-of-audio-files?hl=en
[5] Google 版Typeless？轉錄工具Gemini 3.5 Transcribe：逐字稿 .... https://www.inside.com.tw/article/42217-google-gemini-3-5-transcribe-smart-transcription-chrome
[6] Google 發佈Gemini 3.5 Transcribe 支援85 種語言並自動移 .... https://hk.news.yahoo.com/google-%E7%99%BC%E4%BD%88-gemini-3-5-185916954.html
[7] Audio transcription - Interactions API - Google AI for Developers. https://ai.google.dev/gemini-api/docs/transcribe
[8] Introducing Gemini 3.5 Transcribe - The Keyword. https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5-transcribe
