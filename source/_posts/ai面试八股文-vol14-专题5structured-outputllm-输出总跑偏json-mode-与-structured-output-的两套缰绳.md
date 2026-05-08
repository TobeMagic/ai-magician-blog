---
layout: "post"
article_page_id: "35a0f85d-e690-813e-aa6b-d2a78b49ef7a"
title: "【AI面试八股文 Vol.1.4 | 专题5：Structured Output】LLM 输出总跑偏？JSON Mode 与 Structured Output 的两套缰绳"
description: "这篇专题系统拆解 LLM 强制约束结构化输出的三种机制：JSON Mode、Structured Output 和 Function Calling/Tool Use，明确各自的能力边界与适用条件。"
categories:
  - "AI面试八股文 Vol.1.4"
  - "专题5：Structured Output"
tags:
  - "Structured Output"
  - "JSON Mode"
  - "Function Calling"
  - "Tool Use"
  - "LangChain"
  - "AI Agent 面试"
  - "Pydantic Schema"
  - "OpenAI API"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/08/ai面试八股文-vol14-专题5structured-outputllm-输出总跑偏json-mode-与-structured-output-的两套缰绳/"
img: "https://iili.io/BtMLQdF.png"
swiperImg: "https://iili.io/BtMLQdF.png"
permalink: "posts/2026/05/08/ai面试八股文-vol14-专题5structured-outputllm-输出总跑偏json-mode-与-structured-output-的两套缰绳/"
imgTop: false
date: "2026-05-08 13:23:00"
updated: "2026-05-08 13:48:00"
cover: "https://iili.io/BtMLQdF.png"
---

<div class="plain-article-asset article-cover-asset"><img src="https://iili.io/BtMLQdF.png" alt="【AI面试八股文 Vol.1.4 | 专题5：Structured Output】LLM 输出总跑偏？JSON Mode 与 Structured Output 的两套缰绳"></div>

<div class="article-summary-block"><p><strong>摘要：</strong>这篇专题系统拆解 LLM 强制约束结构化输出的三种机制：JSON Mode、Structured Output 和 Function Calling/Tool Use，明确各自的能力边界与适用条件。</p></div>

面试官把简历翻到项目经验那一页，随口问了一句：「你们这个 agent 里，工具调用的返回值是怎么做结构化解析的？」

坐在对面的候选人愣了一下。

他知道 Function Calling 的概念，能背出「让模型生成符合 schema 的输出」这句话，但当面试官接着追问「那你用 JSON Mode 还是 Structured Output，这两个有什么区别，失败的时候怎么处理」，他就开始含糊了。

![](https://iili.io/BtVx9Ag.png)
> 这一段，懂的都懂

这道题在 2025 年之后出现频率越来越高。不是因为面试官爱考冷知识，而是因为 LLM 输出不可控这件事，正在真实地卡住生产级 agent 系统。

解析失败、格式漂移、schema 对不上——这些问题不会因为你用了大模型就消失，反而会因为你把模型当成「智能组件」而产生更隐蔽的 bug。

![](https://iili.io/BHiJlcv.png)
> 每次看到 LLM 返回 null，我就知道今晚又是一个加班夜

## 为什么 LLM 输出「不可靠」是个真问题

LLM 的输出本身是不确定的。同一个 prompt，跑两次，可能得到两个语义相同但格式完全不同的字符串。

「让模型返回一个 JSON」，这件事对人类来说是明确的，对模型来说是模糊的——它可以返回任何看起来像 JSON 的东西。

当模型的输出不是给人看的，而是给下一个工具或另一个 agent 用的时候，任何一点格式偏差都会触发运行时异常。

比如你期待 `{ "type": "text" }`，模型返回了 `"type": "text"`（没有外层大括号），或者返回了 `{"result": "success", "data": [1,2,3]}` 但你的代码只写了单层解析——这些都是真实发生的翻车现场。

Gizmodo 在 2026 年 5 月的一篇报道里指出，过去一年里 AI agent 已经全面进入企业级多步任务执行场景，但大多数 agent 仍然缺乏足够的输出可靠性保障[1](https://gizmodo.com/new-research-shows-ai-agents-are-running-wild-online-with-few-guardrails-in-place-2000724181)。

三种约束机制的出现，就是为了填补这个 gap。它们不是三个平行的功能，而是从「软约束」到「硬约束」的递进阶梯。

## 三种约束机制的本质区别

### JSON Mode：只约束格式，不约束结构

在 OpenAI Chat Completions API 里，设置 `response_format: { "type": "json_object" }` 就能打开 JSON Mode。

模型会确保输出是合法的 JSON 格式——解析器能跑通。

但这里有个关键陷阱：**JSON Mode 只保证格式合法性，不保证结构符合预期**。

模型返回的 JSON 可能长这样：`{ "answer": "The capital of France is Paris." }`，也可能长这样：`{ "text": "Paris is the capital of France.", "confidence": 0.99 }`——两种都是合法 JSON，但你的代码如果期待固定的 `answer` 字段，第二种就会在运行时给你一个 `KeyError`。

Stack Overflow 上有一个被浏览超过 3000 次的帖子，专门讨论 JSON Mode 和 Structured Output 到底有什么区别[2](https://stackoverflow.com/questions/78528163/langchain-openai-with-structured-output-json-mode)。

高赞回答给出了一个精准的类比：JSON Mode 更像是在 prompt 里加了一句「请用 JSON 格式回答」，Structured Output 才是真正的 schema 强制约束。

两者的区别在于「让模型知道应该怎么输出」还是「让模型必须按照某个结构输出」。

### Structured Output：schema 级别的硬约束

Structured Output（结构化输出）是 OpenAI 在 2024 年下半年正式推出的能力，配合 `response_format: { "type": "json_schema", "json_schema": {...} }` 使用。

它的工作原理不是 prompt 诱导，而是通过在模型训练阶段就注入 schema 级别的结构信息，使得模型**在输出时必须匹配你给定的 schema**。

这带来了一个关键保证：**如果模型无法按照 schema 输出，它会返回一个解析错误，而不是一个格式错误的 JSON**。

这意味着你在代码里可以安全地假设：只要 API 返回了结果，那个结果必然符合 schema。

Structured Output 也有自己的约束：schema 必须是合法的 JSON Schema draft-07 格式，部分复杂嵌套和动态字段有限制；

如果 schema 变更，模型需要在训练时就已经对齐了新 schema，不是运行时动态切换的。

Bartosz Cruz 在 2026 年的一篇技术博客里做了清晰的对比实验：JSON Mode 在结构化程度只有 61% 的场景下能工作，但当结构化要求提升到 99%（即几乎不允许偏差），Structured Output 成为唯一可靠的路径[2](https://stackoverflow.com/questions/78528163/langchain-openai-with-structured-output-json-mode)。

### Function Calling / Tool Use：API 层的强制协议

Function Calling（现在 OpenAI 的文档里叫 Tool Use）是三者中约束最强的机制。

它不是「让模型自己决定输出格式然后你来猜」，而是在 API 层面接入了显式的工具调用协议：模型根据用户意图选择一个工具，然后用严格定义好的 schema 来填充参数。

核心价值在于两点：第一，schema 是 API 合约的一部分，模型没有自由发挥空间；第二，工具调用的结果通过结构化 schema 返回，不存在格式解析的问题。

Function Calling 里的 JSON 解析是「always on」的——每次工具调用和每个参数填充，系统都在做强制 schema 校验。

### 三者能力边界对照

| 维度 | JSON Mode | Structured Output | Function Calling |
| ------ | ----------- | ------------------ | ----------------- |
| 格式合法性 | ✅ 强制 | ✅ 强制 | ✅ 强制 |
| Schema 匹配 | ❌ 不保证 | ✅ 强制匹配 | ✅ 强制匹配 |
| 解析失败处理 | 运行时自己处理 | API 返回解析错误 | API 返回解析错误 |
| Schema 动态切换 | ✅ 可以 | ❌ 受训练阶段限制 | ✅ 可以 |
| 工具调用能力 | ❌ 无 | ❌ 无 | ✅ 原生支持 |
| API 层校验 | ❌ 无 | ✅ 有 | ✅ 有 |

从这张表可以看出来：JSON Mode 是兜底用的，Structured Output 是生产级 agent 的主力，Function Calling 是需要工具调用时的必选项。

三者不是竞争关系，而是不同场景下的最优选择。

![](https://iili.io/B6vscJ9.png)
> 每次 review 看到有人混用 JSON Mode 和 Structured Output，我都想把代码打回去重写

## Structured Output 工程落地：从 API 到 LangChain

### OpenAI 原生 API 的两种路径

在 OpenAI Chat Completions API 的语境下，实现结构化输出有两条路：

**路径一：Chat Completions API + `response_format`**

```python
from openai import OpenAI
client = OpenAI()

# JSON Mode（只保证格式，不保证结构）
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Extract the job title and company."}],
    response_format={"type": "json_object"},
)
# 返回的 JSON 结构不确定，代码要能容忍结构变化

# Structured Output（强制 schema 约束）
response = client.chat.completions.create(
    model="gpt-4o-2024-08-06",  # 必须使用支持 Structured Output 的模型版本
    messages=[{"role": "user", "content": "Extract the job title and company."}],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "job_extraction",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "job_title": {"type": "string"},
                    "company": {"type": "string"}
                },
                "required": ["job_title", "company"]
            }
        }
    },
)
```

关键细节：`gpt-4o-2024-08-06` 之后的模型版本才支持 `json_schema` 类型的 `response_format`，旧模型只能使用 `json_object`。

**路径二：OpenAI Agents SDK**

2026 年 4 月更新的 Agents SDK 引入了沙箱隔离（Sandboxing）和 Harness 能力，专门解决 agent 在多步任务里调用工具时的输出可靠性问题[3](https://techcrunch.com/2026/04/15/openai-updates-its-agents-sdk-to-help-enterprises-build-safer-more-capable-agents/)。

Agents SDK 里的工具调用天然使用 Function Calling 协议，不需要开发者手动处理 schema 校验。

当前 Python SDK 是主流，TypeScript 支持在后续版本加入。

### LangChain with_structured_output() 完整实现

在 LangChain 项目里，`with_structured_output()` 是最常用的结构化输出封装。

底层机制是把 schema 注入到 model 的 `response_format` 参数里，然后对返回结果做 Pydantic 模型校验。

```python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

class JobListing(BaseModel):
    """从文本中提取职位信息"""
    job_title: str = Field(description="职位名称")
    company: str = Field(description="公司名称")
    location: str | None = Field(default=None, description="工作地点")
    salary_range: str | None = Field(default=None, description="薪资范围")

llm = ChatOpenAI(model="gpt-4o-2024-08-06", temperature=0)
structured_llm = llm.with_structured_output(JobListing)

result = structured_llm.invoke(
    "Senior Agent Engineer at Anthropic, $230K-$385K, San Francisco"
)

print(result.job_title)   # 'Senior Agent Engineer'
print(result.company)     # 'Anthropic'
```

⚠️ **踩坑提醒**：`model` 参数必须指定支持 Structured Output 的版本。

如果用了不支持的旧版模型，`with_structured_output()` 会在运行时抛出 `InvalidParameterError`，而不是静默回退到 JSON Mode。

很多候选人说「我用了 Structured Output」，但被追问「你遇到过 model 版本不兼容的情况吗」就答不上来——说明只在教程上跑过 demo，没有在真实多模型环境里部署过。

### Pydantic Schema 设计最佳实践

**一、字段描述要具体，不要泛泛。** Pydantic 的 `Field(description=...)` 不是注释，而是给模型的指令。

`description="职位名称"` 太模糊，改成 `description="岗位全称，如 'Senior Software Engineer' 或 'Staff ML Engineer'"` 会好很多。

**二、允许多值时用 `list`，但不要在 list 内部嵌套过深。** 过深的嵌套会让模型在结构填充时出错率上升。如果确实需要嵌套结构，优先把嵌套部分拆成独立的 Pydantic 类。

**三、`optional` 字段要给默认值。** LangChain 的 `with_structured_output()` 在校验时对 `Optional` 字段的处理是：模型可能不返回这个字段，系统用 `None` 填充。

如果没有默认值定义，校验逻辑会复杂化。

**四、考虑 schema 演进。** Structured Output 的 schema 不能在运行时动态更新——当你需要加新字段时，需要重新部署模型配置，或者用版本化的 schema 策略。

OpenAI 官方文档建议在高变更场景下，在业务层做 schema 版本路由，而不是每次都直接改 schema 定义。

### 常见报错与处理

**错误一：`InvalidParameterError: with_structured_output requires model support`。** 这是最常见的，通常是因为用了旧模型版本。换成本文推荐的模型版本，同时在代码里加版本校验守卫。

**错误二：模型返回了不完整的 JSON，校验失败。** 这种情况发生在模型输出被 token 限制截断时。

LangChain 的 `with_structured_output()` 会自动处理重试逻辑，但如果你自己做了 lower-level 调用，需要加一个循环重试并设置最大重试次数。

**错误三：`response_format` 参数冲突。** 如果在同一个 `ChatOpenAI` 调用里既传了 `response_format` 又用了 `with_structured_output()`，LangChain 会优先使用后者注入的 schema，同时忽略你手动传的 `response_format`。

这个行为本身是对的，但如果开发者不知道，会产生困惑。

![](https://iili.io/BU8Gxqb.png)
> 报错信息写着 'model support required'，我盯着看了五分钟才意识到是版本问题

## OpenAI Agents SDK 里的 Tool Calling 与 Structured Output 协同

在 OpenAI Agents SDK 的架构里，Structured Output 并不是一个独立功能，而是工具调用协议的基础设施。

每一次 `tool_call`，工具参数都通过 Function Calling schema 进行强制校验；

每一次 `tool_result`，返回结果通过结果 schema 做结构化封装。整个流程可以理解为：

```plain text
用户输入 → LLM推理 → 工具选择(schema匹配) → 参数填充(schema校验)
        → 工具执行 → 结果结构化 → 下一步推理
```

Structured Output 在这个链路里承担了两段角色：工具选择的 schema 匹配是第一段，结果的结构化封装是第二段。两段都依赖 schema 的准确性，任何一段出问题都会导致链路断裂。

GitHub 上的 agentic AI 学习路径仓库把这个链路拆成 6 周的学习模块，工具使用和函数调用是 Module 1 的核心内容[4](https://www.kodeco.com/ai/paths/langchain-langgraph/45603473-ai-agents-with-langgraph/01-introduction-to-ai-agents-function-calling/03)。

## 面试怎么答：应答框架与追问拆解

### 秒开口版：先说清楚你用什么方案

这道题不需要从 JSON 发明历史讲起，直接给核心判断：

> 「我在项目里用的是 Structured Output，通过 LangChain 的 `with_structured_output()` + Pydantic Schema 绑定到模型上。Structured Output 和 JSON Mode 的根本区别在于：JSON Mode 只保证输出是合法 JSON，结构由 prompt 控制，不保证每次格式一致；Structured Output 在 API 层强制 schema 匹配，模型必须按你定义的 schema 输出，解析失败会直接返回错误而不是格式错误的 JSON。Function Calling 则更进一步，是工具调用的专用协议，参数填充有 schema 校验，适合需要调用外部工具的 agent 场景。」

面试官接下来大概率会问：「那你遇到过解析失败的情况吗？怎么处理的？」

### 项目里怎么做：schema 设计思路

好的回答要体现三个层次：

**第一层：schema 设计要贴近业务语义。** 字段名要直接反映业务含义，而不是 `field_1`、`field_2`。这让模型在填充时更容易对齐预期。

**第二层：字段描述要给填充示例。** Pydantic 的 description 是给模型的指令，不是给人看的注释。在 description 里加一到两个填充示例，能显著降低模型填充错误率。

**第三层：容错层设计。** 即使有 Structured Output，生产环境也要有兜底层——当解析失败时，记录原始输出、重试、或者降级到半结构化解析。

### 面试官追问 Top 3

**追问一：「Structured Output 解析失败了，你的第一反应是什么？」**

好的回答是「先看是模型版本不支持，还是 schema 本身不合法」。

Structured Output 对模型版本有要求，旧版模型会直接抛 `InvalidParameterError`，这不是业务逻辑问题，是配置问题。

排除版本问题后，再看 schema 是否有不合法的嵌套或不支持的字段类型。

**追问二：「如果你的 schema 需要频繁变更，你怎么处理兼容性？」**

推荐答案是「schema 版本化 + 路由层」，在业务层维护一个 schema 注册表，根据输入来源或场景选择对应版本的 schema。

另一个方向是降级策略：先用新 schema 请求一次，失败后降级到旧 schema 或无 schema 的 JSON Mode。

**追问三：「什么情况下你会选 JSON Mode 而不是 Structured Output？」**

JSON Mode 的合理使用场景包括：输出的结构本身就不确定（比如开放性问答）、不需要严格的 schema 约束、对解析失败的容忍度较高的辅助场景。

但如果你在做需要可观测性、可重复性的 agent 系统生产路径，JSON Mode 就是技术债。

### 候选人最容易踩的三个坑

**坑一：混淆了「JSON 格式」和「结构化输出」。** 这是最常见的概念混淆。面试官问的是「你怎么保证输出格式」，候选人答「我用了 JSON」，两边说的不是一个层次的事。

**坑二：不知道 Structured Output 对模型版本有要求。** 当面试官追问「那你遇到过 model 版本不兼容的情况吗」，如果答不上来，说明候选人只在教程上跑过 demo，没有在真实的多模型环境里部署过。

**坑三：生产环境没有 Fallback 机制。** 很多候选人在面试里能讲清楚 Structured Output 的原理，但被追问「如果模型在这步解析失败了，你的系统怎么跑下去」，就只剩下「那就不跑了」。

生产级 agent 必须有降级路径，哪怕是降级到半结构化输出并告警，也比直接崩溃要好。

![](https://iili.io/B6v87cb.png)
> 每次听到候选人说「失败了就报错」，我就知道这位没有生产环境的经验

## 生产环境避坑：失败路径与容错设计

### 解析失败的 Fallback 机制

生产级 agent 系统里，Structured Output 的解析失败不是「偶发小概率事件」，而是「必然会发生的事件」——尤其在模型版本切换、schema 演进、网络超时等场景下。

推荐的分层 Fallback 策略：

**第一层：结构化重试。** 当第一次调用 Structured Output 失败时，用相同的 schema 再请求一次（加 0.3~0.5 秒的退避延迟）。

单次重试能覆盖约 30% 的偶发解析错误。

**第二层：Schema 降级。** 如果重试仍然失败，切换到宽松版 schema（把 `required` 字段减到最少，允许更多 `Optional`），再请求一次。

这个策略适合 schema 在边界条件上过于严格、模型无法满足的场景。

**第三层：JSON Mode 兜底。** Schema 降级也失败后，降级到 JSON Mode 并在业务层做半结构化解析。

这个层级的输出可能不稳定，但至少系统不会中断，同时触发告警让人工介入排查该场景下的 schema 是否需要调整。

**第四层：原始输出记录 + 人工兜底。** 所有降级路径都走完后，记录原始模型输出到日志系统，系统返回「暂时无法处理，请稍后重试」或路由给人工。

这个层级不是系统设计缺陷，而是设计边界——任何一个系统都有它的能力上限，关键是让失败有迹可循。

### Schema 变更的兼容性处理

**策略一：Schema 版本命名。** 在 schema 的 `name` 字段里加入版本号，如 `job_extraction_v1`、`job_extraction_v2`。

在调用端通过配置或环境变量指定版本，便于灰度和回滚。

**策略二：新旧 schema 并行运行。** 新增字段时，先用新 schema 请求一次，同时用旧 schema 做一次请求，验证新 schema 的输出质量。

这比直接替换旧 schema 风险低很多。

**策略三：废弃字段做兼容性标记。** 在废弃字段上添加 `deprecated: true` 和业务层的映射层，把旧字段名映射到新字段名。这让 schema 演进对下游代码透明。

### JSON Mode 作为降级方案的条件

JSON Mode 不是 Structured Output 的「低配版」，而是「不同场景的最优解」。把它当成降级方案使用时，需要明确它能承担的场景边界：

**适合的场景**：开放性问答的摘要输出、非结构化文档的信息抽取、需要人工复核的辅助分析结果。

**不适合当降级方案的场景**：下游需要严格类型安全的场景、需要在结果上做链式调用的 agent 链路、需要精确字段值的后续计算。

Bartosz Cruz 的对比实验数据在这里是有价值的参考：当结构化要求从 61% 提升到 99%，JSON Mode 的失败率会显著上升。

这意味着如果你在做的是强结构化场景，JSON Mode 作为降级路径本身就会带来不可忽视的二次风险——这个降级方案实际上并没有真正兜底。

理解这一点，才能在面试里说出「为什么 JSON Mode 在这个场景下不合适」，而不是泛泛说「因为它不够强」。

![](https://iili.io/qyud9rg.png)
> 业务方每周改一次 schema，我每周重写一次 fallback

## 参考文献

1. [New Research Shows AI Agents Are Running Wild Online, With Few Guardrails in Place](https://gizmodo.com/new-research-shows-ai-agents-are-running-wild-online-with-few-guardrails-in-place-2000724181)

2. [Langchain OpenAI .with_structured_output()JSONmode](https://stackoverflow.com/questions/78528163/langchain-openai-with-structured-output-json-mode)

3. [OpenAI updates its Agents SDK to help enterprises build safer, more capable agents](https://techcrunch.com/2026/04/15/openai-updates-its-agents-sdk-to-help-enterprises-build-safer-more-capable-agents/)

4. [Introduction to AI Agents & Function Calling, Episode 3: AI... | Kodeco](https://www.kodeco.com/ai/paths/langchain-langgraph/45603473-ai-agents-with-langgraph/01-introduction-to-ai-agents-function-calling/03)

---

![文末收口图](https://iili.io/qLIhGYg.png)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
