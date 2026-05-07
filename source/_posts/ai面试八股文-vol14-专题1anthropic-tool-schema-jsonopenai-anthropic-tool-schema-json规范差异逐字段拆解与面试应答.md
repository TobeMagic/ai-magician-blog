---
layout: "post"
article_page_id: "3590f85d-e690-8115-aa75-f28fb350f214"
title: "【AI面试八股文 Vol.1.4 | 专题1：Anthropic Tool Schema JSON】OpenAI / Anthropic Tool Schema JSON规范差异：逐字段拆解与面试应答"
description: "Anthropic 的 Tool Schema 并不是 OpenAI Function Calling 的「另一个实现」——两者在顶层结构、required 默认处理、enum 校验逻辑、description 约束权重和流式响应格式等六处"
categories:
  - "AI面试八股文 Vol.1.4"
  - "专题1：Anthropic Tool Schema JSON"
tags:
  - "OpenAI Function Calling"
  - "Anthropic Tool Use"
  - "Tool Schema差异"
  - "AI工程师面试"
  - "LangGraph Tool定义"
  - "Vol.1.4"
  - "Anthropic"
  - "Tool"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/07/ai面试八股文-vol14-专题1anthropic-tool-schema-jsonopenai-anthropic-tool-schema-json规范差异逐字段拆解与面试应答/"
img: "https://iili.io/BZtMTHF.png"
swiperImg: "https://iili.io/BZtMTHF.png"
permalink: "posts/2026/05/07/ai面试八股文-vol14-专题1anthropic-tool-schema-jsonopenai-anthropic-tool-schema-json规范差异逐字段拆解与面试应答/"
imgTop: false
date: "2026-05-07 09:32:00"
updated: "2026-05-07 09:53:00"
cover: "https://iili.io/BZtMTHF.png"
---

<div class="plain-article-asset article-cover-asset"><img src="https://iili.io/BZtMTHF.png" alt="【AI面试八股文 Vol.1.4 | 专题1：Anthropic Tool Schema JSON】OpenAI / Anthropic Tool Schema JSON规范差异：逐字段拆解与面试应答"></div>

<div class="article-summary-block"><p><strong>摘要：</strong>Anthropic 的 Tool Schema 并不是 OpenAI Function Calling 的「另一个实现」——两者在顶层结构、required 默认处理、enum 校验逻辑、description 约束权重和流式响应格式等六处</p></div>

牛客上最近的面经开始出现一道让不少候选人当场卡壳的追问：「你调 OpenAI 的 function_call 和调 Anthropic 的 tool_use，Schema 结构一样吗？」

这个问题不只考会不会调 API，而是考你有没有真正在生产环境里同时用过两家的 Tool 调用机制，有没有意识到两份规范并不是「同一个 JSON 换个字段名」这么简单。

## 背景：为什么这道题开始高频

2026 年上半年，Anthropic 的 Claude Code 已被不少企业内部团队定为首选 AI Coding 工具，OpenAI 在 4 月密集更新了 Codex，宣布支持后台多 Agent 并行运行["TechCrunch: OpenAI takes aim at Anthropic with beefed-up Codex"](https://techcrunch.com/2026/04/16/openai-takes-aim-at-anthropic-with-beefed-up-codex-that-gives-it-more-power-over-your-desktop/)。

整个 Agent 开发赛道呈现「三足鼎立 + 快速迭代」的格局。

这种格局直接反映在岗位 JD 上。

OpenAI 放出的 Applied AI Engineer (Codex Core Agent) 岗位，薪资范围在 $230K–$385K，核心要求之一就是「能设计可组合的 Tool Schema，支持多 Agent 工作流」["OpenAI Jobs: Applied AI Engineer, Codex Core Agent"](https://jobs.ashbyhq.com/OpenAI/577e6673-0a4a-491b-9a0d-facbdd3bdf3c)。

Anthropic 的 Fellows Program 在 AI Safety 和 AI Security 两个方向上，也都把「理解工具调用机制」列为加分项["Anthropic Jobs: Fellows Program"](https://job-boards.greenhouse.io/anthropic/jobs/5183044008)。

大厂开始问这个问题的底层逻辑很简单：Agent 能不能稳定跑起来，不取决于 Prompt 写得有多漂亮，而取决于 Tool Schema 定义得够不够精确。

当面试官问「Schema 能不能直接跨平台迁移」，他想知道的其实是你有没有踩过「在 OpenAI 跑得通、在 Anthropic 报 400 错误」的坑。

动手之前先把官方文档锚定清楚——面试时说到「根据官方文档」能直接报链接，这是面试筹码：

- OpenAI Function Calling：https://platform.openai.com/docs/guides/function-calling

- Anthropic Tool Use：https://docs.anthropic.com/en/docs/build-with-claude/tool-use

![](https://iili.io/B6vsO5F.png)
> Schema 报 400 的时候没人告诉我是这个原因

## 根因差异：从设计哲学说起

把两份规范放在一起看，最先感受到的不是技术细节，而是设计哲学的根本分歧。

OpenAI 的 Function Calling 从一开始就走「开发者友好」路线：Schema 本质上是给 GPT 一个函数签名，让它理解「我应该调用哪个函数、传什么参数」。

因此 OpenAI 的规范天然更接近 OpenAPI 规范，字段命名、层级结构和 REST API 世界的主流约定保持一致。

Anthropic 的 Tool Use 是从「模型推理」角度出发的：Schema 是一段给 Claude 的指令描述，它不强制用标准 API 风格，而是允许用更接近自然语言的方式描述工具能力。

换句话说：**OpenAI 的 Tool 是「API 函数声明」，Anthropic 的 Tool 是「工具能力描述」**。这个根因差异决定了后面几乎所有结构细节的不同。

两种设计哲学直接导致选型分歧：用 OpenAI 的团队从「API 设计」往下推导 Tool 定义，用 Anthropic 的团队从「任务目标」往上描述工具能力。

在 LangGraph 里同时调用两家模型时，Schema 不兼容问题就成了必须手动对齐的工程债务。

![](https://iili.io/BfdHgwP.png)
> 原来两家的出发点根本不在一个维度

## 六处结构差异逐帧对照

### 差异一：顶层字段命名与结构体系

OpenAI 的 Tool 定义用 `functions` 数组（v1.0 之后迁移到统一的 `tools` 数组），结构是：

```json
{
  "name": "get_weather",
  "description": "获取指定城市的天气",
  "parameters": {
    "type": "object",
    "properties": { ... },
    "required": ["city"]
  }
}
```

Anthropic 的 Tool 定义用 `tools` 数组，结构是：

```json
{
  "name": "get_weather",
  "description": "获取指定城市的天气信息",
  "input_schema": {
    "type": "object",
    "properties": { ... }
  }
}
```

最直接的差异：**OpenAI 用 `parameters`，Anthropic 用 `input_schema`**。

这不只是字段名不同——`parameters` 默认继承 JSON Schema 的全部约束，而 `input_schema` 是 Anthropic 自定义的 schema 容器，在某些边界行为上与标准 JSON Schema 并不完全一致。

![正文图解 1](https://iili.io/BZtGwa1.png)
> 正文图解 1

### 差异二：required 约束的默认值处理

OpenAI 的 `required` 字段是显式的、强制执行的——如果模型没有传必填参数，API 会返回参数校验错误。

Anthropic 在 `input_schema` 层面**没有**一个统一的 `required` 字段声明机制。

官方文档推荐的方式是把「必填」信息写在 `description` 里，让 Claude 自己判断是否需要这个字段。

这意味着：

- **OpenAI 的必填约束是「硬约束」**，由 API 层面校验兜底

- **Anthropic 的必填约束是「软约束」**，由模型的推理能力兜底

生产环境里，这个差异会导致：当 Claude 选择不传某个字段时，你不会收到 400 错误，但你的工具会因为缺少关键参数在执行层失败——这个失败是在工具执行层发生的，不是在 Schema 校验层发生的。

### 差异三：enum 类型的校验行为

这是最容易踩坑的一处。

在 OpenAI 的 Function Calling 里，`enum` 字段的行为和 JSON Schema 一致：模型生成的参数值如果在 enum 列表之外，API 会返回校验错误。

在 Anthropic 的 Tool Use 里，`enum` 的约束力更弱。Claude 有可能因为 description 里的上下文信息，生成一个不在 enum 列表中但语义相近的值。

这背后的逻辑是：OpenAI 把 enum 当「类型边界」，Anthropic 把 enum 当「参考建议」。

如果你在生产系统里写了严格的 enum 校验逻辑，然后迁移到 Anthropic 的 Tool 调用路径上，你会发现自己加的那些校验条件突然变得多余——因为 Claude 在更早的推理层就已经「替你处理」了 enum 约束。

![](https://iili.io/B9HlrBf.png)
> enum 不匹配？Claude 早就给你修好了，开心吧

### 差异四：嵌套对象与 additionalProperties

OpenAI 的 `parameters` 继承完整的 JSON Schema 语义，可以用 `additionalProperties: false` 明确禁止未定义字段。

Anthropic 的 `input_schema` 对 `additionalProperties` 的支持有限。

在实际测试中，当嵌套对象包含 `additionalProperties: false` 时，Anthropic 有时会静默丢弃那些「未在 schema 中声明但确实传进来了」的字段，而不是像 OpenAI 那样抛出校验错误。

这个差异在复杂嵌套对象的应用里会变成隐性 bug：前端表单收集了完整数据，传给 Agent，Agent 转发给工具，工具执行后发现某些字段神秘失踪——因为中间的 Schema 层静默丢弃了它们。

### 差异五：description 字段的约束权重

在 OpenAI 的规范里，`description` 是「元信息」，作用是帮助模型理解工具用途，但不影响参数校验。

在 Anthropic 的规范里，`description` 是 Schema 的「一等公民」。

官方文档明确指出，Claude 对工具的选择和参数的理解高度依赖 description 的措辞["Anthropic Tool Use Documentation"](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)。

description 会直接影响：

- 模型是否选择调用这个工具

- 模型如何填充嵌套参数的默认值

- 模型在 enum 冲突时选择哪个值

一个实操经验：如果你的工具在 Anthropic 这边经常出现「选错工具」或「参数填错」的情况，与其加更多的类型约束，不如先检查 description 写得够不够精确、够不够具体。

### 差异六：流式响应中 Schema 的传递格式

在流式响应中，OpenAI 在 `stream` 模式下会分块返回 `function_call` 的片段（chunk），最终由调用方拼接成完整的 call 对象；

Anthropic 的 Tool 调用返回格式是 `content_block` 类型的 `tool_use`，结构与 OpenAI 的 `function_call` 流式格式完全不同["Anthropic Tool Use Documentation"](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)。

如果你在写一个同时支持流式和非流式调用的 Agent 框架，这个差异意味着两者的 Schema 解析路径必须独立维护，不能简单复用非流式响应的解析逻辑。

## 面试标准回答模板

面试被问到「OpenAI 和 Anthropic 的 Tool Schema 有什么不同」，最怕的不是答不全，而是答成流水账。推荐一个 30 秒开口版：

> **「核心差异在设计哲学：OpenAI 的 Tool Schema 是 API 风格的强类型约束，`required` 是硬校验，`enum` 超出范围会直接报 400；Anthropic 的 Tool Schema 更偏向自然语言描述，`description` 的权重很高，模型在推理层会主动消化那些在 OpenAI 那边会被校验拦截的冲突。最典型的差异是 `parameters` vs `input_schema` 这个顶层字段，以及 required 约束有没有显式声明——Anthropic 没有 `required` 字段，推荐把必填信息写在 description 里让模型自己判断。」**

这个版本踩中了三个关键点：设计哲学的根因差异、表层结构差异（parameters/input_schema）、生产影响（required 的软硬之分）。

**展开路径 A（从 SDK 调用流程讲）**：OpenAI 的 `tools` 参数接收的是一个 functions 数组，结构跟 OpenAPI/Swagger 的接口定义高度一致，可以在 Postman 定义完接口直接导出成 Tool Schema；

但 Anthropic 的 `tools` 数组里每个 tool 底下是 `input_schema`，它在边界行为上跟标准 JSON Schema 有偏差——比如 `additionalProperties: false` 在 OpenAI 那边会严格执行校验，在 Anthropic 那边有时候会静默丢弃未声明字段。

流式响应里，两边的 Schema 传递格式完全不同，OpenAI 是 `function_call` chunk，Anthropic 是 `content_block` 里的 `tool_use`，统一封装层里这块的解析逻辑不能共用。

**展开路径 B（从 Schema 可维护性讲）**：OpenAI 的 Tool Schema 是给工程师的类型安全感，可以用 JSON Schema 的全套工具做校验、版本管理和文档生成，Schema 本身就是代码的一部分；

Anthropic 的 Tool Schema 更像是给模型的指令文档，description 的措辞直接决定工具选择准确率和参数填充质量。

这两种设计取向在维护层面很不一样：OpenAI 侧的问题通常在 CI 校验阶段就能发现（Schema 写错了 pipeline 就挂了），Anthropic 侧的问题往往要到运行时才暴露——模型没有选错工具但参数填得不对，或者 description 措辞模糊导致在不同输入场景下行为不一致。

![](https://iili.io/B6Pc29I.png)
> Schema 问题在 CI 就挂了，倒也是一种幸福

**追问补位——当面试官问「你们为什么选这家」**：不要上来就说「Anthropic 更强」或「OpenAI 更好」。

比较稳妥的思路是讲清楚在 Schema 层做过的评估：「我们当时评估了两边的 Tool 调用能力，核心看三点：Tool Schema 和现有 API 接口的兼容程度、enum 校验在生产环境的精确度需求、以及流式响应的实时性要求。

最后选了 OpenAI 做主要调用路径，因为我们的工具层强依赖类型校验，必须在 API 入口就把 Schema 校验走掉；

但也在部分场景里保留了 Anthropic 的 Tool Use，当工具参数结构比较复杂、description 需要灵活引导模型推断的时候，Anthropic 的软约束模型更合适。

」

## 生产级追问：Schema 设计不匹配导致的线上事故

### enum 校验行为不一致的典型踩坑

某团队的 Agent 系统在接入 Claude 时遇到了「工具返回了非法 enum 值」的奇怪问题。

追查后发现，Claude 在 description 的引导下，把一个模糊的用户输入映射到了一个不在 enum 列表里但语义完全正确的值。

问题根源在于：团队在 Anthropic 的 Tool 层之上还套了一层统一的 API 网关，这层网关用的是 OpenAPI 规范风格的 enum 严格校验逻辑，两边的校验假设从一开始就不兼容。

解决方案是把 API 网关的 enum 校验降级为警告，而不是拦截，同时在 Tool Schema 的 description 里明确枚举所有合法值，消除模型的「推断空间」。

### 嵌套对象字段被静默丢弃的边界 case

在 OpenAI 侧定义了一个 Tool，嵌套对象里用了 `additionalProperties: false` 防止前端传错字段。

迁移到 Anthropic 侧后，Claude 确实遵守了 Schema 约束，没有生成额外字段——但 Anthropic 的 Tool 执行层有时候会把「前端实际传进来、但 Schema 里没声明」的字段静默丢弃，而不是校验失败。

同一个请求在 OpenAI 路径上会收到明确的校验错误（你知道前端出 bug 了），在 Anthropic 路径上悄无声息地执行成功了（但数据不完整）。这种「静默成功」比「显式失败」难定位得多。

### description 措辞对工具选择准确率的隐性影响

Anthropic 官方文档用大量篇幅讲 description 的写法，因为它的影响力是真的大["Anthropic Tool Use Documentation"](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)。

一个常见错误是 description 写得太泛，导致模型在多个相似工具之间选错。

比如你有两个工具：`cancel_order` 和 `query_order_status`，description 都写了「处理订单相关操作」。

Claude 在面对「帮我看看这个订单」这样的用户输入时，很可能会选 `cancel_order` 而不是 `query_order_status`。

改善方法是把 description 写得更有方向性：不是「这个工具是干什么的」，而是「在什么场景下应该选这个工具而不是另一个」。

## 如果你在项目里用过 LangChain / LangGraph：怎么把 Tool 定义经验说成加分项

### LangChain 的 Tool 双格式兼容机制

LangChain 在 Tool 定义层做了一层抽象，允许你在同一个 Tool 对象里同时声明 `OpenAITool` 格式和 `AnthropicTool` 格式。

`StructuredTool` 基类会根据你传入的 runtime 把 Schema 编译成对应的格式["LangChain Tool Documentation"](https://python.langchain.com/docs/concepts/tool_usage/)。

在项目里可以这样表达：「我们用 StructuredTool 的双格式兼容机制——同一个 Tool 对象底下声明了 OpenAI 的 parameters 结构和 Anthropic 的 input_schema 结构，runtime 根据模型类型自动编译成对应格式。

工具逻辑只有一份，但两边的 Schema 约束可以独立维护。」

### LangGraph State 中 Tool Schema 与节点状态流转的关系

在 LangGraph 里，Tool Schema 嵌入在 Graph 的 State 流转里。

每个节点接收当前 State，决策是否调用 Tool，Tool 的执行结果再写回 State。这个循环里 Schema 的一致性维护是个工程问题。

一个典型的坑是：你在 Graph 入口用 OpenAI 的 Tool Schema 定义了严格校验，但某个中间节点引入了 Anthropic 模型的推理结果，这个结果因为 Anthropic 的软约束特性，可能包含 Schema 校验层没有预见的字段格式。

当把这个结果传给下一个 OpenAI Tool 节点时，Schema 不兼容的问题就会在这个节点边界上爆发。

LangGraph 的推荐做法是：在 State 层面做 Schema 归一化，所有模型返回的参数在进入 Tool 调用前先过一次 validation layer——必须是 agnostic 的，不偏向 OpenAI 的严格校验，也不偏向 Anthropic 的宽松接受，而是根据当前调用路径的需求做动态调整。

![](https://iili.io/B6PaJIe.png)
> Graph 里每个节点都在等 State，这一步卡住整条链路都停了

**面试追问：「你们在 LangGraph 里怎么统一 Tool 定义」**：可以这样回答——「我们抽象了一个 ToolRegistry，所有 Tool 定义在注册时必须提供 OpenAI Schema 和 Anthropic Schema 两份描述，Schema 之间的语义一致性由一个 validator 脚本做 CI 检查——主要是检查两边对 required 字段的描述是否对齐、enum 值列表是否完全一致。

Graph 节点在初始化时从 Registry 拉取对应 runtime 的 Schema，注入到模型调用参数里。

新增工具时只需要维护一份 Schema 定义，CI 会强制检查两边的一致性，不会出现『这边校验通过、那边模型推断跑偏』的情况。」

## 参考文献与延伸阅读

- Anthropic Tool Use Documentation — https://docs.anthropic.com/en/docs/build-with-claude/tool-use

- OpenAI Function Calling Guide — https://platform.openai.com/docs/guides/function-calling

- LangChain StructuredTool & Multi-Model Tool Support — https://python.langchain.com/docs/concepts/tool_usage/

- TechCrunch: OpenAI Codex 2026 Update — https://techcrunch.com/2026/04/16/openai-takes-aim-at-anthropic-with-beefed-up-codex-that-gives-it-more-power-over-your-desktop/

- Los Angeles Times: Google AI Coding Race — https://www.latimes.com/business/story/2026-04-22/googles-internal-struggle-is-handing-ai-coding-race-to-anthropic-openai

---

*数据来源：公开社区、公司页面、公开案例或公开分享汇总整理；涉及个人经历的内容已做脱敏处理，仅供参考。*

## 参考文献

1. ["TechCrunch: OpenAI takes aim at Anthropic with beefed-up Codex"](https://techcrunch.com/2026/04/16/openai-takes-aim-at-anthropic-with-beefed-up-codex-that-gives-it-more-power-over-your-desktop/)

2. ["OpenAI Jobs: Applied AI Engineer, Codex Core Agent"](https://jobs.ashbyhq.com/OpenAI/577e6673-0a4a-491b-9a0d-facbdd3bdf3c)

3. ["Anthropic Jobs: Fellows Program"](https://job-boards.greenhouse.io/anthropic/jobs/5183044008)

4. ["Anthropic Tool Use Documentation"](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)

5. ["LangChain Tool Documentation"](https://python.langchain.com/docs/concepts/tool_usage/)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
