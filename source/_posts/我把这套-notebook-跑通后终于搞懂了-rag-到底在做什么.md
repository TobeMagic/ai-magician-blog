---
title: "我把这套 Notebook 跑通后，终于搞懂了 RAG 到底在做什么"
date: "2026-08-29 10:44:50"
updated: "2026-08-29 10:55:05"
permalink: "posts/2026/08/29/我把这套-notebook-跑通后终于搞懂了-rag-到底在做什么/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/29/我把这套-notebook-跑通后终于搞懂了-rag-到底在做什么/"
article_id: "7ec86a52-47eb-4eee-9cf4-a7f0ac5492be"
description: "一个 GitHub 项目把整套 AI 工程能力打包成了可在 Google Colab 直接运行的笔记本，完全不用 LangChain 之类的框架，直接用原始 API 手撸提示词工程、RAG 检索增强、智能体循环设计和评估体系，且全部跑在 Groq 免费 API 上，连信用卡都不需要。对于想真正理解底层原理而非只会调包的 AI 工程师和 FDE 来说，这是一条从原型到生产部署的速成路径。"
cover: "/var/lib/aimagician/artifacts/covers/7ec86a52-47eb-4eee-9cf4-a7f0ac5492be/70b4caf0-bb2e-48e7-9d38-59a22515c1fd/cover.png"
imgTop: false
---

你花了两周搭了一套 RAG 系统，上线后回答质量不稳定，却说不清楚是检索的问题还是生成的问题——因为你从第一天就用 LangChain 封装好了，从未见过它底层是怎么调用 API 的。

## 为什么零框架比包装库更能让你站稳脚跟

### 框架遮住了底层机制，你只会调包不会修包

当你能看到每一次 API 请求的 payload、每一个 token 的计数、每一层响应处理的细节时，你才会真正理解 RAG 的链路在哪里断裂、在哪里低效。框架不是不能帮你搭系统，但它会把关键决策点藏进黑盒——比如 chunk 策略、检索重排序、提示词拼接——让你变成只会调参的人，而不是会诊断问题的工程师。

### 面试官和实际生产环境要的不是调参工

GitHub 上的 calmrocks/ai-engineer-notebooks 项目直接面向这个痛点。它是一套专为 AI 工程师和 Forward Deployed Engineer 打造的 Colab 实战笔记本，完全摒弃 LangChain 等框架，用原始 API 构建系统，覆盖从 Prompt 工程、RAG、Agent 到 Evals 的全栈技能 [1][2]。



![程序员 reaction：relationship](https://iili.io/CpN4kfS.png)
> ##为什么零框架比包装库更能让你



## 这套 Notebook 覆盖了哪些硬核技能

### 提示词工程与结构化输出

手写提示词，理解 how the model actually parses instructions, how to enforce JSON output, and when to use few-shot versus zero-shot.

### RAG 检索增强生成的完整链路

从文档切分、Embedding 生成、向量存储到检索召回，每一步都在裸 API 上实现，让你看清楚数据流和延迟瓶颈在哪。

### 智能体循环设计与工具调用

理解 ReAct、Function Calling 的本质——它们不是魔法，只是一套循环控制和工具注册机制。手撸一遍后，你再看框架的 Agent 设计就会觉得透明。

### 评估体系与对抗测试

Evals 是生产部署的命门。这套 Notebook 教你从零构建评估 harness，包括对抗性提示测试，理解当 harness 和模型推理本身就是产品的一部分时，构建测试系统本身就是一门手艺 [4]。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> ##这套Notebook覆盖了哪



## 如何直接在 Colab 上手跑通

### Groq 免费 API 申请与配置步骤

Groq 提供免费的 API key，无需信用卡，注册后即可在 Colab 环境变量中配置使用，直接调用 Llama、Mistral 等主流模型。

### 从第一个 notebook 到完整的 agent pipeline

项目提供的笔记本从最简单的 prompt 调用开始，逐步叠加检索、工具调用、多步推理，最终形成可运行的 agent pipeline。整个过程不需要任何第三方框架依赖。

## 从原型到部署的边界在哪

### 什么时候该用框架，什么时候必须手撸

原型阶段，框架能帮你快速验证想法；但当你要调试性能瓶颈、定制复杂工作流、或应对生产环境的极端 case 时，手撸 API 的经验能让你快速定位问题。这套 Notebook 的价值不在于让你永远不用框架，而在于让你知道框架在做什么、为什么这么做。

会用框架的人是工程师，懂底层原理的人是 AI 工程师。如果你从未亲手用原始 API 写过一段 RAG，你对它的理解永远停留在调用层面。

**判断：如果你的目标是成为能独立诊断和交付生产级 AI 系统的工程师，花一个周末在 Colab 上把这套 Notebook 跑通，比看十篇框架教程更有价值。**

## 参考文献
[1] calmrocks/ai-engineer-notebooks: Hands-on Colab notebooks for AI Engineers. https://github.com/calmrocks/ai-engineer-notebooks
[2] 零框架 AI 实战：Colab 免费跑通 RAG 与 Agents. https://zeli.app/zh/story/49471714
[3] AI Engineer Notebooks – free, framework-free RAG/agents/evals on Colab | Hacker News. https://news.ycombinator.com/item?id=49471714
