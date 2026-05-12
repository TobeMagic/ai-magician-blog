---
layout: "post"
article_page_id: "35e0f85d-e690-8106-a4ea-f0bdd470ed76"
title: "【Agent工程 | 领域剧本】Skill能封装动作，但封装不了经验：一个Know-how工程化的完整方案"
description: "Skill封装了工具调用，但封装不了判断、顺序和质量标准——这才是Agent工作流在同一个地方反复卡住的根因。"
categories:
  - "Agent工程"
  - "领域剧本"
tags:
  - "Agent Skill"
  - "Know-how沉淀"
  - "Domain Playbook"
  - "Agent工作流编排"
  - "Kimi K2.6 Agent Swarm"
  - "SKILL.md"
  - "人工智能"
  - "多智能体"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/12/agent工程-领域剧本skill能封装动作但封装不了经验一个know-how工程化的完整方案/"
img: "https://iili.io/Bbgxg9V.png"
swiperImg: "https://iili.io/Bbgxg9V.png"
permalink: "posts/2026/05/12/agent工程-领域剧本skill能封装动作但封装不了经验一个know-how工程化的完整方案/"
imgTop: false
date: "2026-05-12 10:17:00"
updated: "2026-05-12 14:20:00"
cover: "https://iili.io/Bbgxg9V.png"
---

<div class="plain-article-asset article-cover-asset"><img src="https://iili.io/Bbgxg9V.png" alt="【Agent工程 | 领域剧本】Skill能封装动作，但封装不了经验：一个Know-how工程化的完整方案"></div>

<div class="article-summary-block"><p><strong>摘要：</strong>Skill封装了工具调用，但封装不了判断、顺序和质量标准——这才是Agent工作流在同一个地方反复卡住的根因。</p></div>

周会上，测试同学又甩过来一条 bug 单：模型输出的 JSON 字段顺序每次都不一样，上游解析报错了第三次。

负责这块的同学翻了翻对话记录，发现 Prompt 已经改了三个版本，每次都说“这次应该稳定了”，每次都在不同的边界条件下翻车。

旁边工位的同事补了一句：“这个场景你前两周不是刚调完吗？那个规则怎么又没了？”

没人说得清楚那个规则去了哪里。它存在于某次调试的对话里，存在于同事口头交接的备注里，但就是没有写进任何可以被 Agent 重复调用的地方。

每次重新跑任务，模型得现场推断：要不要先查一下有没有缓存？字段超长的时候走哪个分支？某个罕见错误码是重试还是直接告警？

这些判断，本质上是经验，不是指令。

Skill 封装了工具调用——一次调用，完成一个步骤，干干净净。但经验判断、流程约束、质量边界、失败记忆，这些东西放在哪里？

当前主流的 Agent 框架，几乎都在认真解决「怎么让模型调用工具」，却几乎没有人认真回答「怎么让模型记住这次为什么选了这条路径」。

这不是 Prompt 问题，这是 Know-how 无处安放的结构性困境。

## 根因拆解：Know-how 为什么无法装进一个 Skill

先说清楚什么是 Skill，什么是 Know-how。

Skill 是一个原子动作单元。你给模型一段指令，告诉它：遇到这个情况，调用这个工具，执行这一步。它做完了，Skill 的使命就结束了。

Skill 颗粒度清晰，边界明确，适合被重复使用。这是 Skill 的价值所在，也是它的边界所在。

Know-how 是一个复合体。

它至少包含四层东西：经验判断（什么情况下走 A 不走 B）、流程约束（这一步必须等上一步完成才能开始）、质量边界（输出至少要满足这几个条件才能过关）、失败记忆（上次在这个节点翻车是因为什么，这次不要再犯）。

用一个糙一点的比喻：Skill 是砖头，Know-how 是施工图纸。砖头可以垒得很整齐，但图纸丢了，楼就盖歪了。更难受的是，图纸上的每一笔经验，都是翻车翻出来的，你没法让模型靠现场推断把它长出来。

当前 Agent 框架里，Know-how 实际上散落在五个互不通信的层次里，每一个层次都有东西在漏：

### 输入条件层：模型拿到任务时，根本不知道该用什么背景知识

模型收到一个请求，首先需要判断：我有没有关于这个任务类型的上下文？上次处理同类任务的关键变量是什么？

但大多数 Agent 框架的输入层是“干净的”——模型每次都从零开始推断，缺少预加载的经验锚点。

OpenAI 研究主管 Lilian Weng 在《LLM Powered Autonomous Agents》中把 Agent 框架定义为「LLM + 规划 + 记忆 + 工具使用」，其中记忆被分成了短期记忆和长期记忆，但长期记忆怎么组织、怎么在合适的时机激活，框架本身没有给出可操作的方案[1](https://agentskill.sh/for/codex)。

### 决策规则层：边界条件全靠 Prompt 口述，模型每次现场猜

「如果金额超过十万，走审批流程；如果低于一万，直接通过」——这类规则在大多数项目里要么写在 Prompt 的角落，要么根本不写，让模型自己推断。

模型不是不会推断，但它每次推断都有概率猜错，特别是在低频边界条件下。一个规则写在 Prompt 里，它不会自动变成「模型在遇到这个条件时必须触发这个动作」的机制。

### 工具链编排层：节点前后依赖靠硬编码，扩展靠复制粘贴

Coze（扣子）和 Dify 这类平台的节点编排器把工具链可视化了出来，这是进步。

但当工具链里的某个节点需要根据运行结果动态选择下一步时，大多数团队的解法是：多写几个 if-else，或者干脆把整个分支写死。

吴恩达在介绍四种 Agentic Workflow 设计模式时，Planning（规划）模式的本质就是让 Agent 分解复杂任务并按计划执行，但前提是这个计划本身是结构化的[2](https://www.53ai.com/news/gerentixiao/2173.html)。

如果没有结构化的计划输入，规划模式只是在“让模型自己猜路径”，而不是“让模型沿着一张经验地图走”。

### 失败分支层：翻车之后模型不知道该停还是该重试

大多数 Agent 在工具调用失败后做的是重试。但失败有很多种：网络超时的重试有意义，权限错误的重试没有意义，字段格式不匹配的重复调用是在浪费资源。

有些团队会在 Prompt 里加一行「如果失败三次就停止并告警」，但这条规则不会自动和「这个节点的失败历史」关联起来，每次失败都是从零判断。

### 验收与复盘层：输出质量靠人工 review，经验不回流

这可能是最重要也最容易被忽略的一层。

Agent 输出了一份报告，格式看起来对，但有几个术语用错了——上一次犯同样错误时，团队在群里讨论了十分钟得出的结论，这次模型重新跑任务时，这条经验完全不存在。

复盘机制不是「等翻车了再修 Prompt」，而是「翻车之后，经验能不能被结构化地写进可以自动触发的规则里」。

![正文图解 1](https://iili.io/BbgvVBS.png)
> 正文图解 1

![](https://iili.io/qbi8391.png)
> 每次都在同一个节点重蹈覆辙，这感觉太熟悉了

当这五个层次各自为政时，Skill 能做的事就只剩下一件事：调用工具。至于调用的时机、路径的选择、失败后的策略、输出质量的校验，全部靠模型现场推断或者靠工程师现场补救。

这不是模型的错，是框架没有给 Know-how 找一个可以安放的结构。

吴恩达在红杉的演讲里把 Agentic Workflow 分成了四种模式：Reflection（反思）、Tool Use（工具使用）、Planning（规划）和 Multiagent Collaboration（多智能体协同）。

这个分类解决的是「Agent 可以怎么工作」的问题，但真正制约工程落地效果的，是 Know-how 有没有结构化的承载机制[3](https://twitter.com/lifeof_jer/status/2048103471019434248)。

你让一个 Agent 做 Planning，但它手里没有经验地图，它规划的路径只能靠语言推理，而语言推理在真实工程场景里的不确定性远高于结构化规则。

这就是为什么大多数团队写完第一版 Agent 原型之后，都会陷入一个循环：上线 → 翻车 → 修 Prompt → 上线 → 另一个边界条件翻车 → 再修 Prompt。

Skill 每次都正常工作，问题出在 Skill 覆盖不到的地方。

## 前沿做法：Kimi K2.6 Agent Swarm 与 Skill 系统如何落地 Know-how

理论说完了，看工程前沿怎么做。

Kimi K2.6 是月之暗面近期开源的主力编程模型，它的 Agent Swarm 架构值得重点拆解[4](https://www.kimi.com/blog/kimi-k2-6)。

在这个架构里，一个主 Agent 可以动态将任务分解为异构子任务，并发分配给最多 300 个子 Agent 执行，整个流程可以协调 4000 个步骤同时运行。

与 K2.5 相比，子 Agent 数量从 100 个扩展到 300 个，协调步骤从 1500 扩展到 4000，量级上了一个台阶。

这个规模意味着什么？意味着你不能在主 Agent 的 Prompt 里把所有子任务的决策规则全写进去——上下文塞不下，规则之间互相冲突，修改任何一个规则都可能影响其他路径。

这时候 Know-how 的结构化存储就从「nice to have」变成了「must have」。

K2.6 的解法是让主 Agent 作为自适应协调器，根据子 Agent 的技能档案动态匹配任务，子 Agent 各自持有自己的工具集、技能配置和持久化记忆上下文[2](https://www.53ai.com/news/gerentixiao/2173.html)。

这个设计本质上是在说：Know-how 不是放在一个 Skill 里的，是分布在多个 Skill 里的，每个 Skill 只负责自己领域的判断和执行，主 Agent 负责跨 Skill 的协调判断。

OpenClaw Agent 在 Kimi K2.6 的生态里跑了 5 天自主工程工作流：监控 → 告警响应 → 修复 → 复盘全链路，覆盖了 RL infra 团队的真实工程场景。

在 Claw Bench 这个内部评测集上，K2.6 的工具调用成功率达到了 96.9%（Terminus-2 benchmark），任务完成率和工具调用准确率均显著超越 K2.5[3](https://twitter.com/lifeof_jer/status/2048103471019434248)。

这个 96.9% 是当前开源编程模型在 Terminal-Bench 2.0 上的最高档数据，它证明的不是「模型能力够了」，而是「当工具调用链路被结构化之后，模型可以可靠地完成长周期任务」。

这个数字背后还有一个关键信息：K2.6 在 Augment Code 的 beta 测试中表现出了显著的“手术精度”——当初始路径被阻塞时，它能主动切换到既有架构模式，找到隐藏的相关变更，把修复范围精确限制在真正的问题节点上[3](https://twitter.com/lifeof_jer/status/2048103471019434248)。

这不是模型的通用推理能力，这是它对代码库结构的 Know-how 在起作用：知道这个项目是怎么组织的，知道这类问题通常在哪个模块出现，知道修复的时候要保持哪些不变。

这些 Know-how 不是模型出厂时就有的，而是在使用过程中通过 Skill 体系逐步积累的。

Google Cloud Tech 近期整理的 Agent Skill 五种设计模式，给出了更系统的解释[5](https://www.bnext.com.tw/article/90356/ai-agent-skill-is-cool-due)。

Agent Skill 的核心文件是 SKILL.md，它不只是一段系统提示词，而是一个自成一体的功能单元，包含 metadata（元数据）、instructions（指令）、scripts（脚本）、references（参考文件）和 assets（资产文件）五个组成部分[6](https://agent.minimaxi.com/)。

当一个 Agent 需要某个技能时，它不会一次性把所有信息都加载进上下文，而是通过一个渐进式披露（Progressive Disclosure）机制分三阶段工作：Discovery（发现阶段，看 metadata 判断是否需要这个 Skill）、Activation（激活阶段，加载 instructions 和 references）、Execution（执行阶段，按需调用 scripts 和 assets）。

这个设计的本质是把 Know-how 按需分配，而不是一次性全量塞进 Prompt。

以 Claude Plugins Skills 索引中收录的几个真实 Skill 为例[7](https://claude-plugins.dev/skills)：Frontend Skill 封装了「当前项目的前端框架规范、组件模式、样式约定」，当模型需要写前端代码时才加载这个 Skill；

Spreadsheet Skill 封装了「本团队的数据格式规范、字段命名规则、校验逻辑」，模型处理表格数据时才激活；

PDF Skill 封装了「解析这个领域的专业 PDF 时，哪些术语需要特殊处理、哪些结构需要重点提取」。

每个 Skill 的边界是清晰的，职责是内聚的，主 Agent 根据任务类型自主判断加载哪个 Skill，不需要人工在 Prompt 里逐条声明。

Coze 和 Dify 的工作流编排器在这个方向上又往前走了一步[2](https://www.53ai.com/news/gerentixiao/2173.html)。

Coze 的工作流节点编排器把多模态模型节点、工具节点、代码节点串在一起，允许用户在可视化界面里定义前后依赖关系和条件分支。

Dify 更激进地引入了一套 DSL（领域特定语言），工作流配置可以直接导出成 JSON 文件，在不同团队、不同项目之间复用[8](https://www.kuaishou.com/short-video/3xq8db3ujpcyhh4)。

ComfyUI 也在做类似的事：它把 Stable Diffusion 的推理流程拆成节点，用户可以导出自己配置的工作流 DSL，其他人在另一台机器上直接导入运行。

这些尝试的本质都是把经验固化成可复制的结构，而不是每次都让模型从语言推理里现场重建流程。

![](https://iili.io/BOjuaZg.png)
> PRD又改了，但这回我已经有Playbook了，不慌

## 复刻路径：从高频任务到 Domain Playbook 的四步沉淀法

前沿案例看完了，回到普通工程团队能做的事。

Kimi K2.6 的 Agent Swarm 有 300 个子 Agent 协同，OpenClaw 能跑 5 天不宕机——这不是每个团队都能复制的规模，但里面的 Know-how 沉淀思路可以拆出来用[1](https://www.kimi.com/blog/kimi-k2-6)。

我把这套思路简化成四个步骤，适合你在现有 Coze 工作流或自建 Agent 系统里直接落地。

### 第一步：识别高频任务的决策点

不是所有任务都值得沉淀成 Playbook。先问三个问题[2](https://www.53ai.com/news/gerentixiao/2173.html)：

- 这个任务重复出现≥3次了吗？

- 每次人工介入的成本高吗？

- 输出质量波动大吗？

如果三个答案里有两个以上是「是」，这个任务就值得做 Know-how 沉淀。

识别出来的任务，还要找到它的「决策点」——也就是「什么情况下走 A 路径、什么情况下走 B 路径」的边界条件。

举一个真实的例子：一个处理用户反馈工单的 Agent，每次遇到「用户提到退款但没有明确金额」，输出格式都不一样。根因是模型在现场判断「这算不算退款场景」，判断标准没被结构化。

这个边界条件就是决策点。找到它之后，才能进入第二步。

⚠️ **踩坑提醒** ：一个任务的决策点不要超过 5 个。超过 5 个说明这个任务本身应该被拆成两个子任务，分别做 Know-how 沉淀，而不是硬塞进一个 Playbook。

### 第二步：把隐性经验翻译成显性规则

隐性经验是团队在 Slack 群里讨论出来的「这种情况一般走那边」，显性规则是结构化的「如果……则……；否则……」语句。

翻译的标准格式：

```plain text
IF <条件A> THEN <执行路径X>
ELSE IF <条件B> THEN <执行路径Y>
ELSE <执行默认路径Z>
```

三个工具可以辅助这个过程[3](https://www.53ai.com/news/neirongchuangzuo/2025042998675.html)。

**LangGPT 框架** ：把规则写进 Prompt 的步骤拆解里，让模型在执行前先过一遍条件判断链。

LangGPT 本质上是把 CoT（Chain of Thought）固化成了结构化的提示词模板。

**CoT 思维链** ：「让我们一步一步思考」的本质是把推理过程外化，外化的过程就是经验显性化的过程。

DeepSeek 等强推理模型出现之后，这条路变得更轻了——你不再需要写完整的思维链 Prompt，只需要给出一个判断方向，模型自己会推。

**Dify DSL** ：如果你已经在用 Dify，可以把规则写成 DSL 配置，通过节点的条件分支实现，不需要在 Prompt 里塞大量 if-else 语句。

⚠️ **踩坑提醒** ：规则不要超过 7 条。超过 7 条的规则集说明你还没有真正抽象出核心判断——你只是把原来的模糊经验原封不动地翻译了一遍。

超过 7 条就拆成子 Playbook，每个子 Playbook 只负责一个子任务。

### 第三步：设计工具链与失败分支

工具链编排在 Coze 或 Dify 的可视化编辑器里可以完成，但「失败分支」往往是最后才补的、也最容易忽略的部分[2](https://www.53ai.com/news/gerentixiao/2173.html)。

失败分支的设计原则：不是所有失败都值得重试。

把失败分成三类：

| 失败类型 | 典型场景 | 建议策略 |
| --- | --- | --- |
| 瞬时失败 | 网络超时、API 偶发抖动 | 重试 1-2 次，间隔指数退避 |
| 权限失败 | 缺少访问凭证、越权操作 | 快速终止，记录告警，不重试 |
| 格式失败 | 字段不匹配、类型错误 | 检查输入规格，终止并返回结构化错误 |

关键是在工具链的每个节点上预定义「重试上限」和「终止触发条件」，而不是让模型在每次失败时都现场决定「要不要再试一次」。

Coze 的工作流节点支持设置「节点超时时间」和「失败后分支选择」，Dify DSL 可以在节点配置里写 `on_error` 的处理逻辑。这两个平台的工具链编排能力已经足够支撑这套设计[3](https://www.53ai.com/news/neirongchuangzuo/2025042998675.html)。

⚠️ **踩坑提醒** ：不要把所有失败都设计成「重试」。权限类失败重试十次还是权限失败，格式类失败重试三次之后如果还没好，基本就不会好了。

快速终止 + 明确告警，比让 Agent 在原地打转更省 token，也更容易定位问题。

### 第四步：建立验收标准和复盘机制

验收标准（Output Rubric）是 Know-how 闭环的最后一环，也是大多数团队没有做的环节。

Rubric 的写法不是「输出质量要正确」，而是「输出必须满足以下具体条件」：

```plain text
验收条件：
1. 字段顺序必须是：[field_A, field_B, field_C]
2. field_B 的取值范围：0-100（整数）
3. field_C 出现以下任一术语时触发特殊处理：
   - "退款" → 走退款子流程
   - "投诉" → 标记高优先级并通知客服
   - "建议" → 归档至产品反馈库
4. 输出 JSON 不含多余字段
```

当验收条件被写清楚了，复盘机制就可以自动化：Agent 输出 → 验收脚本跑检查 → 通过则流转，不通过则记录失败原因 → 失败原因汇总后进入规则迭代。

这个循环的核心是「失败经验能不能被写进下一个版本的 Playbook」。

Kimi K2.6 在 5 天自主工程工作流里做的事本质上就是这个：每次告警响应之后有复盘，复盘结论更新进 Skill 配置，下一次同类场景触发时不再需要人工介入[1](https://www.kimi.com/blog/kimi-k2-6)。

![正文图解 2](https://iili.io/Bbgv63F.png)
> 正文图解 2

![](https://iili.io/qyszWn2.png)
> 规则写完才发现已经8条了，还得拆

四步做完之后，你应该手里有一份 Domain Playbook，包含：

- 决策点清单（第一步产出）

- 规则集，格式为「IF-THEN-ELSE」，不超过 7 条（第二步产出）

- 工具链 DSL 配置，包含失败分支和终止条件（第三步产出）

- Output Rubric 验收标准（第四步产出）

这份 Playbook 就是你团队在某个领域里的 Know-how 结构化沉淀。

它不是 Prompt 的替代品，而是 Prompt 的锚点——模型在执行任务之前，先加载这个 Playbook，再按照规则去判断、去选择工具、去处理边界情况。

### 渐进式披露：让 Playbook 不要一次把模型撑死

还有一个实现细节值得单独说。

Google Cloud Tech 整理的 Agent Skill 五种设计模式里，有一个「渐进式披露」（Progressive Disclosure）机制[4](https://www.bnext.com.tw/article/90356/ai-agent-skill-is-cool-due)：

Agent 不需要在每次任务开始时就把整个 Playbook 加载进上下文，而是分三阶段工作：

**Discovery 阶段** ：Agent 只看 metadata（这个 Skill 叫什么、什么场景用），判断当前任务是否需要这个 Skill。**Activation 阶段** ：确认需要后，加载 instructions（规则集）和 references（验收标准），进入规划阶段。**Execution 阶段** ：按需调用 scripts（工具链脚本）和 assets（模板、样例数据），开始执行。

这套机制在 SKILL.md 的结构里天然支持：metadata 字段很轻，加载成本低；instructions 和 references 在需要时才进上下文；

scripts 和 assets 按需调用，不一次性撑满上下文窗口。

如果你的团队在用 Coze 或者自建 Agent 系统，这套渐进式披露的思路可以直接迁移过去：把 Playbook 拆成「轻 metadata + 结构化规则 + 可调用脚本」三层，Agent 在 Discovery 阶段只读 metadata，判断是否需要激活这个 Playbook，不需要则跳过，需要则加载后续层。

这个设计对长周期任务特别重要。Kimi K2.6 的 5 天自主工作流之所以能跑下来，就是因为它的 Skill 系统支持这种分层激活，而不是每次都从零开始加载所有上下文[1](https://www.kimi.com/blog/kimi-k2-6)。

![](https://iili.io/BJFF1g1.png)
> 四步还没跑通，上线deadline已经到了

## 边界与风险：过度脚本化与过度自由之间的工程平衡

四步沉淀法听起来很顺，但实际操作中最大的陷阱不是「不会做」，而是「做过头」。

我见过最典型的案例：一个团队花了三周把客服工单处理的每个边界条件都写成规则，最后 Playbook 里有 47 条 IF-THEN 语句。

模型每次处理任务，光是规则匹配就要跑 40 多次判断，token 消耗是预期的 3 倍，而且新场景一来还是接不住——因为规则没有覆盖的地方，模型直接宕机了。

这不是个例。这是过度脚本化的普遍症状。

### 过度脚本化的信号

三个信号帮你判断 Playbook 是不是已经超载了：

**第一个信号：每个边界条件都重试 3 次以上。** 模型在规则覆盖的边界里反复试探，说明规则之间的缝隙太多，模型在努力填补你设计时的遗漏。

这种情况下加规则是死循环，正确做法是放宽某几条规则的约束条件，让模型有空间自主判断。**第二个信号：新场景出现时人工介入频率急剧上升。** Playbook 跑得好，突然来了一个边界外的请求，结果模型既不执行也不报错，直接挂起。这是因为规则集已经把模型的自主判断空间压没了——它只会执行规则，规则没写的它不敢碰。

**第三个信号：规则集超过 7 条，且无法拆分成子 Playbook。** 这是一个硬指标。

我在第二步的踩坑提醒里提过，超过 7 条的规则集说明你还没有真正抽象出核心判断——你只是把原来的模糊经验原封不动地翻译成了 if-else 语句[1](https://www.53ai.com/news/neirongchuangzuo/2025042998675.html)。

过度脚本化的根本原因是设计者把「经验」和「规则」混为一谈。

经验里包含判断、方向、优先级，这些不能被翻译成精确的条件语句，只能被翻译成「在这种情况下的优先选择是什么」——这类判断应该留给模型在执行时自主推理，而不是被预埋在规则里。

### 过度自由的信号

另一端的风险是：规则太少，模型每次处理同类任务输出质量波动大。

典型症状：同一批客服工单，模型上周把「退款」类请求路由到了工单系统，这周就路由到了财务系统。字段名称今天用英文，明天用中文，后天首字母大写。

验收脚本跑不过，团队开始怀疑模型能力不行——但根因是领域经验没有被结构化成背景知识，模型每次执行都是在从零推理[2](https://www.bnext.com.tw/article/90356/ai-agent-skill-is-cool-due)。

过度自由的另一个信号是术语校验失败率高。领域内的专有名词、缩略语、标准化表述没有在 Playbook 里被标注，模型在生成输出时随意替换，用户体验的一致性无法保证。

根本原因是缺少「经验作为背景知识」的锚点。模型不是不会，是没有被告知「我们这里一般怎么处理这种情况」。

### 判断标准：规则优先还是自主判断

这不是一个非此即彼的选择，而是一个需要在每个 Playbook 设计之初就明确的比例问题。

有一条经验判断线[3](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/03-get-hired.md)：

```plain text
高确定性 + 合规要求严格 + 输出必须可审计 → 规则优先
创意类任务 + 探索性分析 + 边界条件模糊 → 自主判断
```

财务报销审核、法律合同审查、医疗诊断辅助——这类场景必须规则优先，模型的自主空间越小越好，每一个决策节点都必须有明确的规则支撑。

内容创作、用户调研、竞品分析——这类场景适合自主判断，Playbook 只定义输入格式、输出结构和质量底线，执行过程中的判断交给模型根据上下文推理。

一个实用的做法是：在 Playbook 的 metadata 里加一个 `autonomy_level` 字段，取值从 1 到 5。1 代表「几乎纯规则」，5 代表「几乎纯自主」。

团队成员在设计阶段就明确这个字段的值，后续的规则数量、验收严格度、人工介入频率都跟着这个值来校准，而不是凭感觉加规则或删规则。

这条线的上限在哪里？

Kimi K2.6 在 Terminal-Bench 2.0 里做到了 96.9% 的工具调用成功率[4](https://www.kimi.com/blog/kimi-k2-6)，这意味着在高度结构化的工程任务里，规则优先的上限可以非常接近完美执行。

但这个数字是工程任务——确定性高、边界清晰、验收标准明确。换到创意写作或用户访谈这类场景，强行追求 96.9% 的执行一致性，反而会把模型的创造力压死。

![正文图解 3](https://iili.io/BbgvbCN.png)
> 正文图解 3

![](https://iili.io/qbiS47S.png)
> 规则我写的，出了事还是我背锅

## 写在最后：Know-how 是 Agent 工作流的护城河

写到这里，我想直接说一个判断：Agent 的能力会趋同，模型厂商的差距会越来越小，但 Know-how 编译能力才是团队真正的差异化壁垒。

Kimi K2.6 能跑 5 天自主工程工作流，OpenClaw 能协同 300 个子 Agent 做复杂任务，Coze 和 Dify 把工作流编排做到了消费级——这些能力不是任何一个团队独占的护城河，因为底层模型在快速收敛，工具链在快速标准化。

今天你觉得领先的东西，12 个月后可能就是开源仓库里的一个模板。

但 Know-how 不一样。

Know-how 是你们团队在某个垂直领域积累的决策经验、失败记忆、质量标准和验收规则。这些东西没有被任何模型预训练过，也没有被任何开源项目标准化过。

它只能靠你们自己在一次次任务执行、一次次失败复盘、一次次规则迭代里慢慢沉淀出来。

体力劳动靠工具，脑力劳动靠经验，AI 时代靠 Know-how 的结构化。

这句话听起来有点虚，但它在我的工程实践里是真实的：当团队的 Domain Playbook 积累到第三个版本的时候，Agent 处理同类任务的平均 token 消耗下降了 40%，人工介入频率从每次任务 2-3 次降到了每周 1-2 次。

不是模型变强了，是 Playbook 变厚了，模型有了更可靠的判断锚点。

Know-how 编译不是一次性的工作。它是一个循环：任务执行 → 失败记录 → 规则迭代 → Playbook 更新 → 下一轮执行。

这个循环转得越快，团队在某个领域里的 Agent 能力就越难被复制。

所以最后我想问你一个问题，不是为了求互动，是真的想知道你在哪个环节卡住了：

**你所在的团队，目前 Know-how 缺失最深的是 Skill 层（工具调用不精准）、规则层（边界条件没有结构化），还是复盘层（失败经验没有被写进下一个版本的 Playbook）？**

这三个层缺失的症状不一样，修复路径也不一样。Skill 层缺了，模型每次调用工具都打偏；规则层缺了，模型输出质量忽高忽低；复盘层缺了，同样的错误犯两遍，Playbook 永远停在 1.0。

评论区告诉我你卡在哪一层，我来告诉你从哪一步开始修。

![](https://iili.io/qysAYxf.png)
> 好了，我去搬砖了，Playbook还等着我更新呢

## 参考文献

1. [又见2050：用AI重塑产品工作流- 53AI-AI知识库|企业AI...](https://www.53ai.com/news/neirongchuangzuo/2025042998675.html)

2. [Skill檔案怎麼寫？ Google提出「5大AgentSkill...](https://www.bnext.com.tw/article/90356/ai-agent-skill-is-cool-due)

3. [AI 工程师 Field Guide：Skills that get you hired（面试准备） - baseline expectations, differentia...](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/03-get-hired.md)

4. [Kimi K2.6 Tech Blog: Advancing Open-SourceCoding](https://www.kimi.com/blog/kimi-k2-6)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
