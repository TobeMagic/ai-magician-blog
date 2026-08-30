---
title: "我把这套 Notebook 跑通后，终于搞懂了 RAG 到底在做什么"
date: "2026-08-29 10:44:50"
updated: "2026-08-30 09:35:21"
permalink: "posts/2026/08/29/我把这套-notebook-跑通后终于搞懂了-rag-到底在做什么/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/29/我把这套-notebook-跑通后终于搞懂了-rag-到底在做什么/"
article_id: "7ec86a52-47eb-4eee-9cf4-a7f0ac5492be"
description: "一个 GitHub 项目把整套 AI 工程能力打包成了可在 Google Colab 直接运行的笔记本，完全不用 LangChain 之类的框架，直接用原始 API 手撸提示词工程、RAG 检索增强、智能体循环设计和评估体系，且全部跑在 Groq 免费 API 上，连信用卡都不需要。对于想真正理解底层原理而非只会调包的 AI 工程师和 FDE 来说，这是一条从原型到生产部署的速成路径。"
cover: "/var/lib/aimagician/artifacts/covers/7ec86a52-47eb-4eee-9cf4-a7f0ac5492be/70b4caf0-bb2e-48e7-9d38-59a22515c1fd/cover.png"
imgTop: false
---

你花了两周搭了一套 RAG 系统，上线后回答质量不稳定，却说不清楚是检索的问题还是生成的问题——因为你从第一天就用 LangChain 封装好了，从未见过它底层是怎么调用 API 的。

几天前，GitHub 上一个叫 calmrocks/ai-engineer-notebooks 的项目引起了不小关注。这套笔记本把所有 AI 工程的核心能力——提示词工程、RAG 检索增强生成、Agent 循环设计、Evals 评估体系——全部用原始 API 手撸，零框架依赖，且在 Google Colab 上直接可运行，跑在 Groq 免费 API 上，连信用卡都不需要。我用一下午把 RAG 那一章完整跑通，发现以前对 RAG 的理解确实只停留在「调个库就能用」的层面。

会用框架的人是工程师，懂底层原理的人是 AI 工程师。如果你从未亲手用原始 API 写过一段 RAG，你对它的理解永远停留在调用层面。

## 为什么零框架比包装库更能让你站稳脚跟

### 框架遮住了底层机制，你只会调包不会修包

LangChain、LlamaIndex 这类框架的便利程度无可否认，但它们的抽象本质上是一个黑盒。当你调用 `vectorstore.similarity_search()` 时，你并不知道 embeddings 是如何被计算、向量数据库的索引结构是什么、相似度阈值如何影响召回率。当你使用 `create_retrieval_chain()` 时，你并不清楚检索到的 chunk 是如何被塞进 prompt 的、上下文长度溢出时框架做了什么、生成的 answer 中哪些部分来自模型知识、哪些来自检索结果。

这个问题在生产环境中会被放大。某团队在 2026 年的一次内部复盘里提到，他们的 RAG 系统上线后在特定领域出现大量幻觉，排查两周后发现根本原因是：LangChain 默认的文本分割策略把技术文档的公式章节拆散了，导致检索时上下文丢失，模型只能靠训练数据里的碎片信息填充答案。如果开发者亲手写过分割逻辑，这个问题会在第一次调试时就暴露。

这套笔记本的价值就在这里：它不告诉你「调这个参数就行」，而是让你看到每一个环节的真实形态。



![程序员 reaction：Evenifmyscreenisoff](https://iili.io/Cn3lGTB.png)
> 看清底层之后再看框架



以 RAG 为例，笔记本来回演示了三个关键步骤的原始实现：首先是文档加载和分块（chunking），你直接处理 `langchain_text_splitters` 的逻辑本质，明白为什么 chunk size 和 overlap 会影响检索精度；其次是 embedding 生成和向量存储，你亲手调用 OpenAI 或本地 embedding 模型，把向量写进 Chroma 或 FAISS，而不是调用一个封装好的 `add_documents()`；最后是检索和生成阶段，你看到 query 如何被转化为向量、如何进行余弦相似度排序、返回的 top-k 个 chunk 如何被拼入 prompt 模板，以及最终 LLM 如何在此基础上生成回答。

这个过程里你会遇到几个真实的坑。比如，Groq 的免费 API 对并发有限制，批量生成 embedding 时如果不做适当限速会触发 429 错误；再比如，直接在 notebook 里拼接 prompt 字符串时，一个换行符的位置不对就可能让 LLM 误解指令结构。这些问题在框架封装下往往被默默吞掉，而不会报错，直到线上出现问题。

### 面试官和实际生产环境要的不是调参工

技术面试里问 RAG 的场景题，高频问题是「如何处理检索结果不相关的 case」。用框架的人通常会回答「换更好的 embedding 模型」「调整 top-k」「加 re-ranker」。这些答案没错，但缺少深度。真正有经验的候选人会追溯到更底层：chunk 策略是否合理，文档预处理是否干净，query 改写是否必要，以及检索和生成这两个阶段的误差如何隔离。

生产环境里的 RAG 问题更是如此。一个来自业内常见做法的经验是：RAG 系统的失败很少是单一环节造成的，通常是检索召回率不足和生成阶段幻觉叠加的结果。你需要能独立评估每个模块——用精确率和召回率衡量检索，用 faithfulness 和 answer_relevance 指标衡量生成——而不是笼统地说「系统效果不好」。

这套笔记本的评估章节正好覆盖了这一点。它演示了如何用原始 API 构建一个简单的 eval harness：构造一组标准问答对，分别用原始 LLM 和 RAG 系统回答，然后用另一个 LLM 作为 judge 来评估答案的事实一致性。整个过程没有现成的评估框架帮你代劳，你需要自己设计 prompt、解析输出、统计指标。这正是生产环境中搭建评估体系的实际样子。

从经验看，能完整跑通这套笔记本的人，在面对真实项目中的 RAG 问题时会有两个明显优势：一是对各个环节的失败模式有直觉，二是能在不依赖特定框架的情况下快速验证假设。

这正是 calmrocks/ai-engineer-notebooks 这个项目想解决的问题。它是一个面向 AI 工程师和 Forward Deployed Engineer 的实战笔记集合，全部在 Google Colab 上可运行，完全基于原始 API，涵盖提示词工程、RAG 链路、智能体循环和评估体系四个核心模块。

### 提示词工程与结构化输出

提示词工程不是写几段文案那么简单。这个项目从最基础的 prompt construction 开始，逐步引入结构化输出——强制模型按照指定 schema 返回 JSON。

关键机制在于：大多数生产场景需要的不是自然语言回复，而是可解析的结构化数据。使用 Pydantic 模型定义 schema，再配合 Groq 等模型的 function calling 能力，可以稳定拿到符合预期格式的响应。



![结构化输出工作流](https://iili.io/CyBAftf.png)
> 结构化输出工作流



这里有一个常被忽略的细节：schema 设计得越严格，模型幻觉导致的解析失败率越低。但过度严格的约束会拖慢推理速度。取舍点在于业务容错率和延迟要求。

### RAG 检索增强生成的完整链路

RAG 的本质是把外部知识注入到 LLM 的推理过程中。很多人以为 RAG 就是「检索 + 生成」两件事，但真正跑起来才发现中间藏着十几个需要决策的环节。

这个 Notebook 把链路拆成了四个阶段：文档加载与切片、嵌入生成与向量存储、查询改写与检索、上下文组装与生成。



![RAG 完整链路](https://iili.io/CyBAvSt.png)
> RAG 完整链路



分段策略是第一个坑。 naive chunking 按固定长度切分会打断语义边界，更好的做法是结合句子边界和主题边界进行自适应分段。嵌入模型的选择同样关键：text-embedding-3-small 在语义检索任务上表现稳定，且成本远低于大尺寸模型。

查询改写常被低估。用户原始问题往往过于简略，比如「那个功能怎么配」。通过一个 LLM 调用将其扩展为完整的查询语义，可以显著提升检索召回率。

### 智能体循环设计与工具调用

智能体（Agent）的核心是循环：感知环境、做出决策、执行动作、观察结果。这个项目用一个 while 循环模拟了这个过程，配合 Groq 的 function calling 能力实现工具调用。



![Agent 循环状态机](https://iili.io/CyBADJ9.png)
> Agent 循环状态机



工具调用的关键在设计 tool schema。每个工具需要明确的输入描述和输出格式，这样模型才能正确选择工具和参数。实践中常见的问题是 tool description 写得过于模糊，导致模型选错工具或传参错误。

另一个易错边界：循环深度。不设上限的 agent 循环可能导致 token 消耗失控。实际项目中通常需要设置最大迭代次数作为安全阀。

### 评估体系（Evals）与对抗测试

评估是 RAG 系统上线前最容易被跳过的环节。这个项目展示了两种评估思路：基于规则的结构化验证和基于模型的语义评估。

结构化验证检查输出是否符合 schema，能发现明显的格式错误。语义评估则用一个 LLM 作为 judge，判断答案是否准确回答了问题。后者更接近真实场景，但引入了 judge 模型的偏差。

对抗测试关注的是系统的脆弱点。通过构造边界用例——比如模糊查询、多意图问题、事实矛盾的材料——可以发现检索链路中的盲点。



![评估体系分层](https://iili.io/CyBR2fV.png)
> 评估体系分层



评估的结果应该驱动迭代，而不是仅仅作为一个报告。每次改动链路后重新跑评估，对比指标变化，才能建立对系统的实际信心。

坦白讲，这套 Notebook 的价值不在于代码本身——网上开源实现很多。它的价值在于把每个环节为什么这样做、取舍在哪里、踩过的坑是什么，都摊开来讲。会用框架的人是工程师，懂底层原理的人是 AI 工程师。如果你从未亲手用原始 API 写过一段 RAG，你对它的理解永远停留在调用层面。



![程序员 reaction：Content-Length:50](https://iili.io/CClZaNj.png)
> 第一次看到真实请求链路时的震撼



前几天在 GitHub 上看到一个有意思的项目：calmrocks/ai-engineer-notebooks。这个项目把一套完整的 AI 工程技能栈打包成了可在 Google Colab 直接运行的笔记本，核心卖点是「零框架」——不依赖 LangChain、不依赖 LlamaIndex，所有逻辑都用原始 API 调用实现。

为什么「零框架」值得重视？

因为当你用 LangChain 搭 RAG 的时候，检索逻辑、分块策略、向量存储、重排序，全都被封装在黑盒里。出了问题你只会改参数，不会改机制。面试官问「你的 RAG 系统召回率只有 40%，你怎么排查？」——如果你从未亲手写过检索代码，回答只能停在表层。



![程序员 reaction：C2277626EE-8E+](https://iili.io/CxqoAqg.png)
> 黑盒工具出问题时的无力感



项目的执行环境设计也有讲究。它选的是 Groq 的免费 API，不需要绑信用卡，不需要 Cloudflare Turnstile 验证，直接在 Colab 里填一个 API key 就能跑。Groq 的优势是推理速度极快（Llama 3 70B 在 Groq 上延迟可以压到 200ms 以内），对学习场景来说，快意味着你能在同一个笔记本里多跑几轮对比实验，而不是等模型响应等到睡着。

### 第一个 notebook：从调用 API 开始

项目的第一篇笔记从最基础的「给模型发请求」开始。没有 langchain.llm，没有 base_model，就是纯粹的 HTTP POST——把 messages 数组拼好，塞进请求体，解析返回的 JSON。



![RAG 端到端流程](https://iili.io/CyBRzsR.png)
> RAG 端到端流程


这一步看起来很幼稚，但正是这种「幼稚」让你看清了 RAG 的本质：它不是什么魔法，就是把检索到的文档片段作为上下文拼进 prompt，让模型基于这些片段生成回答。理解了这一点，后续所有优化——查询改写、重排序、上下文压缩——都有了明确的出发点。

### 完整的 Agent Pipeline：不止是 RAG

项目的进阶笔记覆盖了更完整的工作流。从 RAG 到 Agent 循环，核心变化是模型不再一次性输出答案，而是根据中间状态决定是否继续调用工具。



![程序员系列表情：这个问题输入rm-rf可以解决](https://iili.io/CyBTrdX.png)
> 当模型第一次自主调用工具时的感觉



一个典型的 Agent 循环包含几个关键状态：Planning（规划下一步动作）、Executing（执行工具调用）、Reviewing（评估产出结果）、Repairing（未通过则修复重试）。这四个状态构成了一个闭环，而判断何时退出循环、何时触发 Retry 的阈值，往往是实际项目中最容易被忽视的工程细节。

项目中的 Agent 示例用的是工具调用格式（function calling），而非 ReAct 的文本格式。区别在于：function calling 让模型显式输出结构化参数，由代码层决定工具的执行顺序和参数校验；ReAct 让模型在文本中「思考」要不要调用工具，解析稳定性差一些，但可控性也更强。两种方案各有取舍，项目中都给了可直接运行的版本。

### 评估体系：没有评估就没有改进

项目的最后一个核心模块是 Evals——评估体系。这部分的设计思路值得参考：它没有依赖 Ragas 或 DeepEval 这类重型框架，而是用简单的评分逻辑实现了三个维度的评估：相关性（回答是否切题）、事实性（回答是否与检索到的文档一致）、完整性（回答是否覆盖了问题的关键要素）。



![程序员反应图：程序员00026 我想做NLP找个好人家](https://iili.io/CumR2Ev.png)
> 评估指标设计时的反复推敲



评估的难点不在于写代码，而在于定义「什么是好答案」。项目给出的做法是：先用规则匹配做粗筛，再用轻量模型做细判，最后人工抽检校准。这种分层策略在生产环境中也很常见——全量人工评估成本太高，全量模型评估又可能引入评估者偏差。

### 从零到生产：这条路径的实际价值

这套笔记本的真正价值不在「跑通」本身，而在「跑通之后你知道了什么」。当你在 Colab 里亲手写出向量检索的代码，你会明白为什么分块大小会影响召回率；当你亲手拼过 context window，你会理解为什么长文档需要摘要压缩；当你亲手写过评估脚本，你会知道指标数字背后的代价是什么。

这对应着一句话：会用框架的人是工程师，懂底层原理的人是 AI 工程师。框架帮你快速交付，但也会让你在最需要理解机制的时候失去这种能力。零框架笔记本不是要否定框架的价值，而是提供了一条「先拆后装」的学习路径——拆开看，再装回去，这时候你用的才是真正理解后的框架，而非依赖式的黑盒。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 当你第一次独立排查出 RAG 问题时的状态



项目地址在 GitHub 上可以直接访问，所有 notebook 都支持一键在 Colab 中打开。如果你在搭建 RAG 系统时遇到过「不知道为什么出错」的困惑，或者在面试中被追问底层机制时答不上来，这套笔记本是一个值得投入几小时的起点。

上周有同事在代码评审时被追问了一个问题：你的 RAG 系统里，query rewriting 的 prompt 长什么样？embedding 模型返回的向量维度是多少？rerank 的阈值怎么定的？他答不上来。不是因为他的能力不行，而是因为这些问题被框架包装在了一个不可见的黑盒里。这个案例很有代表性，值得展开讲讲。



![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> ##为什么零框架比包装库更能让你



## 提示词工程与结构化输出

### 用原始 API 手写 prompt 的质感

调用 OpenAI 或 Groq 的 API 时，你发送的是一个 JSON 请求，包含 messages 数组、model、temperature 等字段。response 是一个 JSON 对象，包含 choices 数组。这就是全部。

没有链，没有路由，没有隐式状态管理。这种「裸感」会让你对系统的边界有更清晰的认知。当你亲手构建提示词时，你会注意到 temperature 对输出多样性的影响，会理解 max_tokens 的实际意义，会意识到 system prompt 和 user prompt 的角色差异。

### 结构化的力量不只是 JSON Schema

现代 LLM API 支持 structured output，允许你用 JSON Schema 约束模型输出。这个能力的价值不在于让输出更「规整」，而在于让下游处理变得可预测。当你不用框架时，你需要自己处理解析错误、处理边界情况、处理模型偶尔的任性。



![搬砖系列表情：真羡慕你们不用上班](https://iili.io/C1zRo8v.png)
> 和 API 搏斗的日常



## RAG 检索增强生成的完整链路

### 从 query rewriting 到 chunking 到 rerank

RAG 的标准链路是：query rewriting → embedding → retrieval → reranking → context assembly → generation。每一步都有多个选项，每种选择都会影响最终效果。



![RAG 完整链路流程图](https://iili.io/CyBRwmu.png)
> RAG 完整链路流程图



Query rewriting 的目的是将原始问题转化为更适合检索的形式。chunking 决定了知识的颗粒度。rerank 则是在初步检索结果上做精细化排序。这些环节在框架中通常被包装成几个函数调用，但在零框架实现中，你需要亲手处理每一步的细节。

### 每个环节的故障模式

检索失败的原因很多：embedding 模型与文档内容不匹配、chunk size 设置不当、相似度阈值过高或过低、rerank 模型训练数据分布与业务场景不一致。理解这些故障模式的前提是你能看到每一环节的输出，而不是只看到最终答案。

## 智能体循环设计与工具调用

### Tool calling 的本质是函数签名

Tool calling（函数调用）是 LLM 能力的一次重要跃迁。模型不再只是生成文本，而是可以调用外部工具、获取结果、再根据结果继续推理。这个能力的本质是将 LLM 与函数式编程范式结合。

当你使用原始 API 时，tool calling 的逻辑非常直观：你在请求中提供 tools 数组，每个 tool 包含 name、description 和 parameters 的 JSON Schema。模型的响应中会出现 tool_calls 字段，包含要调用的函数名和参数。你需要自己执行这些函数，然后把结果放回对话中继续推理。

### Agent loop 的最小可行形态



![Agent 循环状态机](https://iili.io/CyB5C2S.png)
> Agent 循环状态机



这个循环看起来简单，但包含了 agent 系统的核心：感知、思考、行动、反馈。框架帮你隐藏了这个循环的复杂性，但也让你失去了对它进行细粒度控制的能力。

## 评估体系（Evals）与对抗测试

### 为什么 ragas 不是答案

Ragas 是专门针对 RAG 系统设计的评估框架，它提供了 faithfulness、answer_relevance、context_precision 等指标。但它本质上又是一个需要安装、配置、调用的外部依赖。

真正的评估能力来自于对评估目标的清晰定义。你需要问自己的问题是：我的系统要在什么场景下工作？什么是好的回答？什么是坏的回答？这些问题没有标准答案，需要结合具体业务来定义。

### 构建你的第一个评估 harness

从零开始构建评估体系的过程，会让你理解评估的本质。你需要准备测试数据集，定义评估指标，编写评估脚本，分析评估结果。这个过程耗时，但回报率极高。你会发现，当你亲手写了一个评估脚本后，你对系统的理解深度是完全不同的。



![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> 测试与实现的日常博弈



## 从原型到部署的边界在哪

### 什么时候该用框架，什么时候必须手撸

这个问题的答案取决于你的目标。如果你只是在内部做一个 demo，或者快速验证一个想法，框架是更好的选择。它的抽象层减少了重复劳动，让你专注于业务逻辑。

但如果你要构建一个需要长期维护的生产系统，或者需要深度定制某些环节，手撸原始 API 会让你有更可控的系统。更重要的是，这种控制力来自于对底层机制的理解，而不是对框架配置的熟悉。



![框架与手撸的选择边界](https://iili.io/CyB5SZG.png)
> 框架与手撸的选择边界



### 这套方法的适用场景与局限

calmrocks 的 notebook 项目的核心价值在于教育意义。它展示了 AI 工程的完整栈，让学习者能够在没有框架掩护的情况下理解每个组件的真实形态。这种理解在面对实际问题时是无可替代的。

但这条路也有局限。从零开始构建 everything 的效率很低，在实际生产环境中，合理的做法是选择性使用框架，同时保留对关键路径的原始实现能力。框架是工具，不是信仰。

### 下一步：微调与红队测试的进阶路径

当你对原始 API 的使用足够熟练后，自然会在两个方向上深入：微调（fine-tuning）和红队测试（red-teaming）。

微调的本质是适应。当通用模型无法满足特定领域的要求时，你可以通过微调让模型更好地适配你的场景。这个过程同样可以通过原始 API 来完成，理解了训练的每个环节后，你会对微调的结果有更好的预期。

红队测试则是从对抗的角度检验系统的安全性。它会暴露出你在正常流程中看不到的问题：prompt injection、越狱攻击、信息泄露。这些问题的解决不能依赖框架，而需要你对系统的每个输入输出点都有清晰认知。



![程序员 reaction：Literallyeveryone](https://iili.io/CgBbNov.png)
> 从调包到懂行的跨越



用原始 API 跑通一套完整的 AI 系统，不意味着你要永远拒绝框架。它意味着你有选择的能力：知道什么时候框架是合适的工具，什么时候它是障碍。这种判断力，才是 AI 工程师的核心竞争力。

如果你从未亲手用原始 API 写过一段 RAG，你对它的理解永远停留在调用层面。框架很好，但不要让它成为你理解系统的天花板。

## 参考文献
[1] AI 工程师笔记本. https://www.aiwhitepage.cc
[2] 在Colab 上免费、无需框架即可使用RAG/智能体/评估工具. https://www.me.news/news/[REDACTED]
[3] 开源生态 最新动态与精选 · AIHOT. https://aihot.virxact.com/topics/open-source
[4] 零框架 AI 实战：Colab 免费跑通 RAG 与 Agents — AI Engineer Notebooks – free, framework-free RAG/agents/evals on Colab | Zeli. https://zeli.app/zh/story/49471714
[5] AI Engineer Notebooks – free, framework-free RAG/agents/evals on Colab | Hacker News. https://news.ycombinator.com/item?id=49471714
[6] calmrocks/ai-engineer-notebooks: Hands-on .... https://github.com/calmrocks/ai-engineer-notebooks
[7] Google Colab. https://colab.research.google.com/github/huggingface/cookbook/blob/main/notebooks/en/rag_evaluation.ipynb
[8] 写给AI实践者的实验环境指南：Google Colab+Cloudriser. https://zhuanlan.zhihu.com/p/57759598
