---
title: "Anthropic悄悄给Claude Code装了「外挂」，开发者能改写的范围大得吓人"
date: "2026-10-02 06:00:02"
updated: "2026-10-02 06:12:30"
permalink: "posts/2026/10/02/anthropic悄悄给claude-code装了外挂开发者能改写的范围大得吓人/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/02/anthropic悄悄给claude-code装了外挂开发者能改写的范围大得吓人/"
article_id: "940bf213-58dd-46df-a75b-fac506677ff5"
description: "Anthropic推出的Claude Code Mods机制，允许开发者用TypeScript函数改写提示词、替换内置功能、甚至拦截工具调用。这不再是简单的提示词工程，而是把AI编程工具的行为逻辑开放给开发者定制。相比之前只能跑Shell脚本的Hooks，Mods的能力是质的飞跃——它让Claude Code从「黑盒工具」变成「可插拔系统」。本文将从机制原理、已有能力、安全风险和落地路径四个层面拆解这个变化。"
cover: "/var/lib/aimagician/artifacts/covers/940bf213-58dd-46df-a75b-fac506677ff5/401101c2-a5c7-4dc7-a0ff-2760360013ff/cover.png"
imgTop: false
---

Anthropic 为 Claude Code 推出 mods，一种小型 TypeScript 函数，可挂接到 Claude Code 的事件流，改写提示词、拦截或重试工具…

## 从Hook到Mod：Claude Code的底层能力跃迁

### 为什么旧机制不够用

Claude Code 早期支持的 Hooks 本质上是 Shell 脚本，挂载在固定节点上运行。这种设计有两个硬伤：一是能力边界明确，只能在预定义的几个时机点执行，改写提示词、替换内置功能这类需求根本做不到；二是 Windows 环境兼容性差，坑多。



![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> Agent 运行时过载



一个团队如果需要在代码评审中强制加入安全检查、或者统一团队的代码风格规范，Shell 脚本只能做到「事后提醒」，无法干预 Claude 的实际决策过程。这就是为什么开发者社区一直有「Claude 太黑盒了」的抱怨。

### Mods到底是什么

Mods 是运行在 Claude Code 进程内的 TypeScript 函数。它不是一个新的模型，也不是独立的插件系统，而是直接在 `$` API 层面参与运行时事件。



![Mods运行机制架构](https://iili.io/ncuv86N.png)
> Mods运行机制架构



与 Hooks 相比，Mods 的核心差异在于：它可以改写系统提示词、替换内置功能、甚至 mock 环境变量和时钟。这意味着开发者写的不再只是提示词工程，而是工具本身的行为逻辑。

### 已有能力与内置案例

Anthropic 已经在仓库中放出了首批内置 Mods 的源代码。最值得关注的三个：

- **diff**：Claude Code 原本已有的 diff 面板，正在被重新实现成一个 Mod。这是一个明确的信号——未来内置功能会持续向 Mod 形态迁移。
- **sec-default**：控制安全策略，展示 Mod 如何干预权限审批流程。
- **telemetry**：负责遥测数据上报，说明 Mod 也能接管数据流向。

更狠的是，代码中还出现了 `mock.env`、`mock.clock`、`$.ui.press` 等接口。一个 Mod 可以模拟环境变量、控制虚拟时钟、甚至模拟 UI 按键操作。这些能力让 Mod 不只是「拦截器」，而是真正的「运行时中间件」。



![程序员 reaction：OurSQL](https://iili.io/CC5uD3g.png)
> 后端系统设计现场



## 机制拆解：TypeScript函数如何挂接事件流

### 运行时权限与沙箱缺失

这是最需要正视的现实：Mods 与 Claude Code 同权限运行，没有沙箱隔离。



![权限边界对比](https://iili.io/ncuvZMl.png)
> 权限边界对比



这个设计选择有明显的权衡：Anthropic 需要给开发者足够的灵活性，同时保持产品形态的简洁。代价是信任成本大幅上升——你安装的每个插件都可能拥有读写本地文件、发起网络请求的能力。

### 与Shell脚本的本质差异

Shell 脚本的问题是「只能在外围打补丁」。而 Mods 是 TypeScriptsript 类型系统加持下的函数，可以在编译期检查错误，在运行时拦截、修改、甚至替换任何内置行为。

CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1

这是当前开启测试的开关。官方文档标注这是 beta 功能，`$` API 可能在不同版本间变化。这意味着你现在写的 Mod 代码，可能在下一个大版本中需要适配。

更准确地说，这是一个「先跑起来、再迭代」的设计策略。Anthropic 希望开发者生态先热起来，API 稳定性随后跟进。

## 安全风险与权限边界

### 同权限运行的真实代价

Mods 的设计哲学很直接：给开发者最大自由度，同时把安全责任推向使用者。

这在开源社区是常见做法，但在企业环境中需要重新评估。一个不良意的 Mod 可以做这些事：

- 读取本地配置文件，提取 API Key 或凭证
- 拦截工具调用结果，篡改返回内容
- 发起网络请求，向外部服务器泄露代码上下文



![程序员 reaction：debug mode activated  debug mode activated idi1](https://iili.io/CAlWgQj.png)
> 报错崩溃前的最后一秒



坦白讲，这种风险并非理论推演。历史上，npm 社区曾因恶意包事件引发过大规模关注。Mods 的运行环境决定了同样的风险路径在这里完全可行。

### 企业部署的必做动作

如果团队计划使用 Mods，至少需要完成三件事：

1. **建立插件白名单机制**。只允许安装经过安全审计的 Mod，禁止随意从社区拉取。
2. **在 CI/CD 中扫描 Mod 代码**。将 Mod 纳入代码审查流程，与业务代码同等对待。
3. **明确权限边界声明**。每个 Mod 应该附带清晰的权限需求说明，开发者需要知道自己在授予什么权限。

不这样做，等于把 Claude Code 的使用权交给第三方代码。这不是技术问题，是治理问题。

## 落地路径与适用场景

### 开启测试的具体命令

```bash
export CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1
```

安装版本需要在 2.1.259+ 以上。Anthropic 计划在未来数周内正式推出该功能，当前通过实验开关提前测试。

### 适合哪些团队

Mods 不是对所有人都开放的礼物。它适合三类团队：

- **需要标准化工作流程的团队**：通过 Mod 统一代码规范、自动执行安全检查、强制 PR 模板。
- **需要自动化代码审查的团队**：拦截特定模式的代码，自动触发修复建议或拒绝提交。
- **需要统一安全策略的团队**：通过 sec-default Mod 集中管理权限审批规则，避免个人配置差异。

不适合的场景也很明确：个人开发者临时用一次、对 TypeScript 不熟悉、或者团队缺乏代码治理能力。

### 未来内置功能迁移趋势

Anthropic 已经在仓库中展示了 clear 的信号：diff 面板正在被重新实现为 Mod。这意味着未来的 Claude Code 可能会呈现「核心轻量 + 功能可插拔」的架构。

这种趋势的利弊都很明显。好处是开发者可以自定义甚至替换内置功能；坏处是升级时需要关注 Mod 的兼容性，某些团队定制的功能可能在官方更新中被覆盖。

判断很清楚：在 X 条件下选 A，理由是 …；当条件变化为 Y 时，切换为 B。对于有标准化需求的团队，现在就开始调研 Mods 是值得的；对于没有明确使用场景的团队，等到正式版稳定后再跟进即可。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 架构师点头认可



以前调提示词是魔法，现在写 TypeScript 才是正经手段。Claude Code 从黑盒工具变成可插拔系统，开发者写的不只是代码，是工具本身的行为逻辑。这比发布一个新模型的影响可能要深远得多。

## 为什么旧机制不够用

Claude Code 最早只有 Hooks——本质上是 Shell 脚本，挂载在几个固定节点上。你只能在工具调用前后、会话开始前后跑这些脚本。能力有限，而且坑很多。

### Windows 上的坑

Shell 脚本在 Windows 上经常「莫名其妙地失败」。路径解析、换行符、命令查找顺序，全是雷。对跨平台团队来说，维护成本高得离谱。

### 能力边界

Hooks 不能改写系统提示词，不能替换内置功能，不能干预 Claude Code 自身的决策流程。你只能「旁观」，不能「参与」。

## Mods 到底改变了什么

它们在事件流里挂接，可以改写提示词、添加新 UI、替换内置功能，甚至可以 mock 环境变量、时钟、模拟按键。



![程序员 reaction：SLOPMAXFORME](https://iili.io/CnZ0y1j.png)
> Agent 把控制权交给你了



与 Hooks 相比，这是质的飞跃。不是「脚本能多跑几步」，而是「架构从旁观者变成了参与者」。

### 运行时挂接 vs 固定节点

Hooks 只能在预定义节点跑。Mods 可以响应更多事件类型，干预时机更细粒度。你甚至可以拦截工具调用、决定重试或拒绝。

### 类型安全与开发体验

TypeScript 类型注解让 IDE 能给出实时反馈。编译错误在提交前就能发现，而不是运行时才炸。



![Mods 事件流挂接架构](https://iili.io/ncuvpS9.png)
> Mods 事件流挂接架构



### 插件分发机制

Mods 随插件一起分发。CLI 和桌面应用都支持。安装一个插件，就安装了一组 Mods。

## 已有能力与内置案例

Anthropic 已经内置了几个 Mods，而且是开源的。代码在 `anthropics/claude-code` 仓库的 `mods/` 目录里。

### Diff 面板的 Mod 化

Claude Code 原本的 diff 面板，正在被重新实现成一个 Mod。这不是临时方案，是迁移策略的明确信号。

### 安全策略控制

`sec-default` 控制默认安全策略。你可以修改默认值、添加自定义规则。

### 遥测与mock能力

`telemetry` 负责数据上报。`mock` 可以模拟环境变量、时钟、UI 按键。这些是开发测试的基础设施。



![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> Anthropic 自己先跑通了



## 权限边界与落地路径

### 信任模型

Mods 与 Claude Code 同权限运行，无沙箱隔离。本地文件读写、网络请求都可以执行。你需要信任插件来源。

### 何时该用 Mods

适合需要标准化工作流程、自动化代码审查、统一安全策略的团队。不适合个人随机使用的场景。

### 测试开关与版本要求

启用测试：`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`
版本要求：Claude Code 2.1.259+

Anthropic 表示功能会在「数周内」正式发布。当前 `$` API 可能还会变化。

未来内置功能会持续向 Mod 形态迁移。这不是实验性附加，是架构方向。

### 为什么旧机制不够用

Claude Code 早期提供的 Hooks 机制，本质上是跑在固定节点上的 Shell 脚本。你可以在某个工具调用前后挂一个脚本，做一些日志记录或环境变量的处理。问题在于，这种机制有三个明显的局限。

首先是节点固定。Hooks 只能挂载在预定义的几个事件点上，比如某个工具调用之前、某个会话结束之时。你没法拦截一次特定的工具调用，也没法改写 Claude 生成的系统提示词。机制是固定的，能力也是。

其次是 Windows 兼容性问题。Shell 脚本在 Windows 上的表现一直不稳定，跨平台团队用起来经常踩坑。

最后是类型安全缺失。写 Shell 脚本不需要 IDE，也没有类型检查，改错了只能跑起来才发现。

### Mods到底是什么

Mods 是 Claude Code 的原生扩展机制，用 TypeScript 写成，运行在 Claude Code 进程内部。它不是 Shell 脚本，也不是独立的 MCP server，而是直接挂接到应用的运行时事件流中。

一个 mod 可以做的事情，远超 Hooks 的能力边界。你可以改写系统提示词，让 Claude 在特定场景下遵循不同的行为规则；你可以拦截工具调用，决定是否放行或重试；你可以添加新的 UI 组件，在终端里渲染自定义信息；你甚至可以模拟环境变量、控制时钟、模拟 UI 按键操作。

TypeScript 带来的好处不止是类型安全，还有开发体验。你可以用 IDE 写 mod，有自动补全，有编译期检查，跑起来之前就能发现大部分错误。这对企业级部署来说是个基本要求。

Mods 以插件形式分发，CLI 和桌面应用都能用。Anthropic 计划把未来新增功能默认以 mod 形态提供，同时逐步把现有功能迁移到 mod 实现。

### 已有能力与内置案例

Anthropic 已经开源了首批内置 mod 的源代码，可以直接在 [anthropics/claude-code/mods](https://github.com/anthropics/claude-code/tree/main/mods) 仓库看到。目前最值得关注的有三个。

diff mod 正在重新实现 Claude Code 原有的 diff 面板。这是一个信号——Anthropic 有意将已有功能逐步迁移为 mod 形态，而不是继续以硬编码方式维护。

sec-default mod 控制安全策略的默认行为，比如工具调用的权限审批规则。

telemetry mod 负责遥测数据的上报逻辑。

此外，mod 系统还提供了一些底层能力接口。`mock.env` 可以注入或覆盖环境变量；`mock.clock` 可以控制时间流，支持 `advance(ms)`、`sleep`、`settle()` 等方法；`$.ui.press` 可以模拟按键操作。这些能力让 mod 不仅能修改行为，还能在测试和调试场景中扮演代理角色。



![Claude Code Mods 能力边界](https://iili.io/ncu8oHF.png)
> Claude Code Mods 能力边界



### 权限与安全风险

Mods 运行在 Claude Code 进程内，和 Claude Code 共享同样的权限。这意味着 mod 有权限读写本地文件、发起网络请求、访问系统资源。没有沙箱隔离，没有能力限制。

这是一个明显的取舍。Anthropic 的选择是信任插件来源——你安装的 mod 来自哪里，你就得承担相应的风险。对于个人开发者来说，这可能不是问题，因为大多数 mod 是自己写或社区开源的。但对于企业团队，尤其是需要合规审计的场景，这个风险值得认真评估。

企业部署时需要回答三个问题：谁来审核 mod 的代码？mod 的权限范围是否足够小？出了问题是否有回滚机制？

### 落地路径与适用场景

目前 mods 处于实验阶段，需要设置环境变量 `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` 才能开启。Claude Code 版本需要在 2.1.259 及以上。

适合引入 mods 的团队有几个典型场景：需要标准化工作流程，用 mod 固化代码审查规则或提交规范；需要统一安全策略，通过 mod 强制某些工具调用的审批流程；需要自动化重复任务，比如自动生成文档、定期清理缓存。

不适合的场景是：对 mod 审核流程不完善、安全合规要求严格的团队。在没有建立 mod 审查机制之前，贸然在团队中推广可能带来不可控的风险。

更准确地说，mods 的价值在于把 AI 编程工具从黑盒变成可插拔系统。开发者写的不再只是业务代码，而是工具本身的行为逻辑。这比之前的 hooks 机制向前迈了一大步。

这标志着 AI 编程工具从封闭黑盒向可插拔系统的转变。

## Mods的运行时机制：TypeScript函数如何挂接事件流

### 事件流的挂接点

Mods 通过类型化的回调函数挂接到 Claude Code 的事件流。主要挂接点包括 `onBeforeToolInvocation`、`onAfterToolInvocation`、`onBeforeLLMCall`、`onAfterLLMCall`，以及权限请求的审批回调。

每个挂接点的函数签名都经过严格定义。以工具调用为例，`onBeforeToolInvocation` 接收工具名称、参数和上下文，返回值为 `ModifyToolInvocationInput`，可以修改即将执行的参数或完全替换工具行为。

```typescript
const myMod: Mod = {
  name: 'my-mod',
  onBeforeToolInvocation: async ({ toolName, input }) => {
    if (toolName === 'Read') {
      // 替换读取逻辑，注入缓存
      return { input: { ...input, considerCached: true } };
    }
    return undefined; // 不修改则返回 undefined
  }
};
```

### 类型安全的设计

TypeScript 的类型约束是 Mods 区别于 Shell Hooks 的核心优势。所有事件回调的输入输出都有明确类型定义，编译期就能检查出参数错误。

Anthropic 提供了 `claude-code/mods` 类型包，开发者引入后即可享受完整的 IDE 提示和类型检查。这意味着写 Mods 的体验接近写普通 TypeScript 项目，而非在黑暗中摸索环境变量。

类型系统还约束了 Mod 的幂等性。`onBeforeToolInvocation` 的返回值类型决定了 Mod 是否有权修改输入、是否有权取消执行、是否有权重写输出。这种显式的设计让权限边界清晰可见。

### 与Shell脚本的本质差异

Shell 脚本是进程外执行，通过 stdin/stdout 与父进程通信。这种模式天然限制了状态访问和异步处理能力。你需要用临时文件传递复杂数据结构，用退出码表示成功失败，用环境变量传递简单参数。

TypeScript Mods 运行在进程内，可以直接访问闭包中的状态，使用 Promise 处理异步逻辑，通过对象引用传递复杂数据结构。这种差异不仅仅是「更方便」，而是能力的代差。

更重要的是，Mods 可以修改正在执行的上下文。Shell Hooks 只能在事件前后运行，无法改变事件本身的内容。Mods 可以拦截工具调用、改写 LLM 输入、修改返回结果。这让 Mod 从「观察者」变成了「参与者」。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 后端系统设计





![Mods 运行时权限模型](https://iili.io/ncu8aSt.png)
> Mods 运行时权限模型



## 权限边界与安全模型

### 沙箱缺失的现实

Claude Code 的架构设计决定了 Mods 无法轻易添加沙箱。Mod 需要访问 Claude Code 的内部状态才能发挥最大效用，而沙箱会切断这些访问路径。

具体表现有三：文件系统无隔离，Mod 可以读写任意本地文件；网络无限制，Mod 可以向任意域名发起请求；进程执行无控制，Mod 可以 spawn 子进程执行任意命令。

这种设计在技术上是合理的，因为 Claude Code 本身就是一个需要广泛权限的工具。但在安全模型上，它把责任完全推给了插件来源的信任链。安装一个 Mod，等于把这个 Mod 的开发者当作你机器的临时管理员。

### 企业部署的风险评估

企业场景下的风险放大了数倍。员工可能从公开仓库安装带有恶意的 Mod，插件更新机制可能被劫持，供应链攻击的路径清晰可见。

Anthropic 目前提供的防护仅限于版本管理和插件签名。企业需要自行建立代码审查流程、漏洞扫描机制和应急响应预案。对于安全要求高的团队，建议：只安装经过审计的 Mod，建立内部插件仓库，禁用来自未知来源的插件。

代码审计不应流于形式。一个典型的恶意 Mod 可能伪装成「代码质量检查工具」，在审核时对 `onBeforeToolInvocation` 进行常规检查，但在 `onAfterLLMCall` 中悄悄记录 LLM 输出，窃取敏感代码。这种后门代码在数百行 TypeScript 中很难发现。

### 开发者应对策略

面对权限风险，开发者需要建立三层防护：审查优先、最小权限、内部分发。

审查优先意味着安装任何 Mod 前必须人工阅读源码，重点关注文件操作、网络请求和进程执行相关代码。对于开源 Mod，可以检查 GitHub 的 commit 历史，确认是否存在异常更新。

最小权限原则要求开发者主动约束 Mod 的能力。虽然 Claude Code 没有提供细粒度权限控制，但开发者可以在 Mod 内部实现白名单机制，限制文件访问范围和合法的目标域名。

内部分发是团队层面的最佳实践。建立内部插件仓库，通过 CI/CD 流水线自动执行安全扫描和代码审查，审批后才允许安装。这比依赖外部生态要可靠得多。

## 典型应用场景与项目落地

### 统一代码审查规范

大型团队最常遇到的问题是代码规范不统一。每个开发者可能有不同的检查标准，code review 效率低下。

用 Mods 可以解决这个问题。编写一个 Mod，在 `onBeforeToolInvocation` 中拦截 `Write` 和 `Edit` 工具调用，自动注入团队的代码规范检查逻辑。不符合规范的代码变更会被自动标记或拒绝，减少人工 review 的工作量。

一个实际的实现思路是：Mod 读取团队的 ESLint/Prettier 配置，在工具调用前验证待写入的代码是否符合规范。对于违反规则的代码，可以返回错误提示，要求开发者修改后再提交。

### 标准化开发流程

开发流程标准化是另一个典型场景。很多团队有固定的开发步骤：拉取代码、安装依赖、运行测试、提交 PR。这些步骤可以通过 Mod 自动化。

在 `onBeforeLLMCall` 中注入上下文信息，让 Claude 自动了解项目的结构、技术栈和开发规范。在 `onAfterToolInvocation` 中记录工具调用结果，生成进度报告。这些 Mod 可以让 Claude Code 更好地融入现有的开发工作流。



![程序员反应图：程序员00028 发币割韭菜这么low的事怎么能干呢我们得做链啊](https://iili.io/CI4IHVp.png)
> 代码评审折磨



### 定制化安全策略

安全扫描是企业的刚需。传统的方案是在 CI/CD 流水线中集成安全工具，但这种方式延迟高、反馈慢。

Mod 方案的优势在于实时性。在工具调用前注入安全检查，可以在代码写入之前就发现潜在漏洞。敏感信息扫描、依赖包漏洞检查、权限配置验证，这些都可以通过 Mod 实现。

一个具体的例子是：编写 Mod 拦截 `Write` 工具，扫描即将写入的文件内容，检测是否包含 API 密钥、密码等敏感信息。如果发现敏感数据，立即拒绝写入并提示开发者使用安全存储方案。

## 未来趋势与生态影响

### 内置功能向Mod迁移

Anthropic 的路线图很明确：将更多内置功能迁移为 Mod 形式。diff 面板已经先行，预计未来还会有更多功能以 Mod 形态重新实现。

这种迁移的意义在于解耦。内置功能的迭代需要发布新版本，而 Mod 可以独立更新。开发者可以快速迭代自己的 Mod，无需等待 Anthropic 的版本发布。

这也意味着 Claude Code 的核心功能会越来越轻量。基础执行引擎保持稳定，上层功能由生态填充。这种架构类似浏览器：核心是渲染引擎，丰富的体验来自插件生态。

### 插件生态的繁荣

Mods 的开放性必然催生插件生态。第三方开发者可以针对特定场景开发专业 Mod，形成细分市场的竞争。

可能的专业 Mod 包括：前端开发专用 Mod（自动注入 React/Vue 规范）、数据科学专用 Mod（优化 Jupyter 集成）、移动开发专用 Mod（处理构建流程）。这些 Mod 将 Claude Code 的能力延伸到更垂直的领域。

插件市场的商业模式也值得期待。免费插件获取用户，付费插件提供高级功能，企业插件提供定制服务。Anthropic 可以从交易中抽取分成，形成可持续的生态循环。

### 对AI编程工具的启示

Claude Code 的 Mods 机制对 AI 编程工具行业有示范效应。Cursor、Copilot、Codeium 等竞品很可能跟进类似功能，推动整个行业向可插拔架构演进。

更深远的影响是开发者控制权的变化。过去，AI 编程工具的行为由厂商决定，开发者只能被动接受。现在，开发者可以通过 Mod 定制工具行为，让工具适应自己的工作流程，而非反过来。

这种转变的本质是：AI 工具从「产品」变成「平台」。开发者不再只是用户，更是平台的共建者。更狠的是，当所有人都能改写工具时，工具的差异化将来自开发者的创造力，而非厂商的功能列表。

## 选型决策与落地Checklist

### 传统方案 vs AI方案对比

对于代码规范和流程标准化需求，传统方案是通过 lint 工具、pre-commit hooks 和 CI 配置实现。这些方案成熟稳定，但存在几个问题：配置分散在多文件中，理解成本高；对 AI 辅助开发的场景适配不足，无法与 LLM 的深度交互。

AI 方案的核心优势在于上下文感知。Mod 可以读取项目结构、理解代码语义、结合 LLM 的能力进行智能决策。这不是简单替代，而是能力跃升。

### 何时应该选择Mod方案

以下场景适合投资 Mods：

1. 团队规模中等（10-100人），有标准化的需求但需要灵活适配
2. 开发流程复杂，涉及多工具链协作
3. 安全要求高，需要自定义的安全策略
4. 希望深度集成 AI 辅助开发能力

以下场景可能不适合：

1. 小型团队或个人开发者，配置成本不划算
2. 已有成熟的标准化工具链，改造风险大于收益
3. 安全合规要求极高，无法接受无沙箱架构

### 落地Checklist

启动 Mods 项目前的准备清单：

- [ ] 评估团队规模和需求匹配度
- [ ] 建立代码审查流程和安全审计机制
- [ ] 规划内部插件仓库的分发策略
- [ ] 编写第一个 Mod 的原型验证可行性
- [ ] 制定 Mod 版本的 SEMVER 管理规范
- [ ] 准备回滚方案，应对可能的兼容性问题

---

## 参考文献
- Customize Claude Code with mods in TypeScript | Claude by Anthropic - https://claude.com/blog/claude-code-mods
- claude-code/mods at main · anthropics/claude-code - https://github.com/anthropics/claude-code/tree/main/mods
- Agent SDK reference - TypeScript - Claude Code Docs - https://code.claude.com/docs/en/agent-sdk/typescript
- Claude Mods Revealed: TypeScript Hooks for Claude Code - 4SAPI Blog - https://blog.4sapi.com/blog/claude-mods-typescript-hooks-developer-guide

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
