---
layout: "post"
article_page_id: "35f0f85d-e690-8100-bfe1-c6bbb83e2095"
title: "【AI工作流 | ACP & Hermes Agent】IDE终于能和Agent好好说话了：Hermes Agent ACP Server如何把编辑器和Agent Runtime接成执行闭环"
description: "本文拆解Hermes Agent v0.13引入的ACP Server能力：它通过stdio JSON-RPC把编辑器（VS Code/Zed/JetBrains）直接接入Agent runtime，让代码上下文、cwd绑定和凭证管理在编辑"
categories:
  - "AI工作流"
  - "ACP & Hermes Agent"
tags:
  - "ACP"
  - "Hermes Agent"
  - "Agent Client Protocol"
  - "IDE agent"
  - "JSON-RPC"
  - "编辑器集成"
  - "Hermes"
  - "Agent"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/05/13/ai工作流-acp-hermes-agentide终于能和agent好好说话了hermes-agent-acp-server如何把编辑器和agent-runtime接成执行闭环/"
img: "https://iili.io/BbbhYeS.png"
swiperImg: "https://iili.io/BbbhYeS.png"
permalink: "posts/2026/05/13/ai工作流-acp-hermes-agentide终于能和agent好好说话了hermes-agent-acp-server如何把编辑器和agent-runtime接成执行闭环/"
imgTop: false
date: "2026-05-13 03:08:00"
updated: "2026-05-13 03:20:00"
cover: "https://iili.io/BbbhYeS.png"
---

<div class="plain-article-asset article-cover-asset"><img src="https://iili.io/BbbhYeS.png" alt="【AI工作流 | ACP &amp; Hermes Agent】IDE终于能和Agent好好说话了：Hermes Agent ACP Server如何把编辑器和Agent Runtime接成执行闭环"></div>

<div class="article-summary-block"><p><strong>摘要：</strong>本文拆解Hermes Agent v0.13引入的ACP Server能力：它通过stdio JSON-RPC把编辑器（VS Code/Zed/JetBrains）直接接入Agent runtime，让代码上下文、cwd绑定和凭证管理在编辑</p></div>

凌晨两点，你在VS Code里问Copilot为什么这个Prometheus指标突然抖了一下，它说「我看看」然后给你科普了三分钟时间序列基础知识。

切到Terminal，Claude CLI已经重新理解了上下文，你重新贴了告警日志，它说「你这个查询语法有个常见坑」。

再切到Telegram Bot，那个上下文已经彻底丢了，你得从头解释你在干什么。

三个AI，三套记忆，三个互不相通的工具调用边界。这就是今天大多数工程师和「AI助手」相处的方式——不是用一个Agent，而是同时伺候三个Agent，而且它们互相不知道对方在干什么。

这是ACP（Agent Client Protocol）要解决的真实问题。

不是再造一个聊天入口，而是重新设计编辑器和Agent runtime之间的集成协议栈，让上下文、凭证和工作目录绑定在同一个进程边界内流动，而不是在三个互相隔离的聊天窗口里打转。

![](https://iili.io/BAfTmRs.png)
> Copilot懂我当前文件，Claude懂我Terminal上下文，Telegram Bot懂我什么时候摸鱼——但它们互相不懂

## 割裂的Agent体验：一个工程师每天重复三次的噩梦

这个场景之所以让人崩溃，不只是「切换窗口」这么简单。真正的问题出在三个技术维度的割裂上。

**工具调用边界不统一** 。

Copilot的工具集是VS Code插件生态，Claude CLI的工具集是Shell和文件系统操作，Telegram Bot的工具集是消息发送和媒体处理。

这三个工具集各自独立，一个Agent学会的能力没法迁移到另一个Agent上。你在Terminal里跑通的`kubectl`调试流程，在VS Code里得重新配一遍；

在Copilot里写的测试用例，Telegram Bot完全感知不到。

**Session状态不互通** 。每个平台维护自己的对话历史和上下文窗口。

VS Code里Copilot知道你在调试哪个微服务，Terminal里的Claude CLI知道你在哪个K8s集群里操作，Telegram Bot则对这一切一无所知。

这意味着你每换一个入口，就得重新建立上下文——不是「换个地方聊天」，而是「重新训练一个Agent理解你的项目」。

**凭证管理重复且不共享** 。OpenAI API Key在VS Code里配一套，在Claude CLI里配一套，在Telegram Bot里又得配一套。

凭证过期了三个地方都要单独更新，而且每个平台对凭证的存储和安全策略都不一样。**cwd绑定错位** 。这是最隐蔽也最烦人的问题。

Claude CLI默认的工作目录是Terminal的当前目录，Copilot默认的工作目录是VS Code打开的文件夹，Telegram Bot的工作目录通常是配置时写死的某个固定路径。

当你同时处理多个项目时，这种cwd不一致会导致Agent操作错误的文件，或者找不到你刚改过的配置。

![](https://iili.io/BBAM9jt.png)
> 工具在CLI，配方在Messaging，上下文在虚无——三重割裂才是真正的工程税

这三个问题不是「体验不好」的小麻烦，而是实实在在的工程债务：同样的上下文要重复建立、同样的凭证要重复维护、同样的工具能力要重复开发。

本质上，每个平台都在重新发明轮子，而不是复用同一个Agent runtime的能力。

这就是ACP被设计出来的背景。它不解决「如何让更多人用上AI助手」这个产品问题，它解决的是「如何让同一个Agent runtime在多个编辑器入口上保持上下文、凭证和工作目录的一致性」这个工程问题。

## ACP是什么：重新理解「编辑器- Agent」集成协议栈

ACP的全称是Agent Client Protocol，中文可以叫「Agent客户端协议」。

但这个名字本身容易引起误解——它不是又一个聊天协议，不是Telegram Bot或Discord Bot那种消息网关的替代品。

**ACP的核心设计目标是把编辑器变成Agent的「第一公民」** [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

换句话说，它要解决的是：当你在VS Code里写代码时，这个编辑器能不能直接接入一个完整的Agent runtime，让代码文件、Terminal环境和Agent的上下文感知在同一个进程边界内流动？

这听起来有点像MCP（Model Context Protocol），但两者解决的是完全不同层次的问题。

MCP解决的是「Agent如何发现和调用外部工具」的问题——你在一个Agent里怎么让这个Agent去调用GitHub API、Slack或者数据库？

MCP本质上是工具发现协议，描述的是单个Agent和外部工具之间的关系 [2](https://github.com/NousResearch/hermes-agent/releases)。

ACP解决的则是「编辑器如何作为客户端接入一个运行中的Agent runtime」的问题。

编辑器不是工具，它是Agent的「壳」——用户通过编辑器的UI和Agent交互，但Agent本身跑在一个独立进程里，编辑器只是一个交互入口。

ACP规定了编辑器（客户端）和Agent runtime（服务端）之间的通信格式和会话管理规则。

**ACP的通信模型是stdio JSON-RPC** [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

这意味着Editor进程和Agent进程之间通过标准输入输出传递JSON格式的RPC调用，而不是通过HTTP WebSocket之类的网络协议。为什么用stdio？

因为stdio天然适配本地进程间通信，不需要处理网络延迟、防火墙、端口暴露这些问题，而且stdout可以被操作系统完全保留给数据传输，stderr专门用来打印日志——这种分离设计让调试信息和通信数据互不干扰。

![正文图解 1](https://iili.io/BbbOq4s.png)
> 正文图解 1

这张图展示了三个入口（CLI、Gateway、ACP）如何共享同一个Hermes runtime。

ACP不是再造一个Agent，它是给已有的Hermes runtime新增了一个编辑器友好的接入方式。

**ACP不是工具协议，是会话集成协议** [3](https://insights.firstaimovers.com/mcp-vs-a2a-vs-anp-vs-acp-choosing-the-right-ai-agent-protocol-70da0b6e10a0)。这是理解ACP最关键的一句话。

MCP描述的是「Agent能调用哪些工具、怎么调用」，ACP描述的是「编辑器怎么把用户的操作翻译成Agent能理解的消息、怎么接收Agent的响应、怎么管理会话状态」。

两者不在同一个抽象层次，也不互相替代。一个Agent可以同时通过MCP连接外部工具、通过ACP连接编辑器、通过A2A连接其他Agent——这三者是互补的，不是竞争关系 [3](https://insights.firstaimovers.com/mcp-vs-a2a-vs-anp-vs-acp-choosing-the-right-ai-agent-protocol-70da0b6e10a0)。

Hermes Agent在v0.13里正式支持了ACP Server模式，通过`hermes acp`命令启动一个stdio Server，让VS Code、Zed、JetBrains等编辑器直接接入同一个Agent runtime。

这个runtime和CLI、Messaging Gateway共享相同的配置、凭证、Session管理和工具集——不再有割裂 [4](https://docs.openclaw.ai/tools/acp-agents)。

![](https://i.ibb.co/FqkDhsCT/transparent.png)
> MCP连工具，ACP连编辑器，A2A连Agent——三个协议在不同的抽象层次上各司其职

## 架构拆解：ACP Server如何把编辑器变成Agent的「第一公民」

理解了ACP的定位，接下来要看它是怎么做到的。

ACP Server在Hermes Agent里不是一个新增的Agent，而是一个已有的Agent runtime的新入口——它复用CLI和Messaging Gateway的所有底层能力，只换了一种通信方式 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

### stdio通信：为什么JSON-RPC over stdio是最干净的本地方案

ACP的核心通信模型是stdio JSON-RPC。Editor进程和Agent进程之间通过标准输入输出传递JSON格式的远程过程调用，而不是HTTP、WebSocket或任何需要网络监听的协议。

这个设计选择背后有明确的工程理由：

**日志走stderr，stdout保留给JSON-RPC** [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。Hermes ACP Server的所有日志输出到标准错误流，标准输出流完全留给JSON-RPC响应。

这意味着任何能读写stdin/stdout的进程都可以充当ACP客户端，不需要解析日志、不需要配置日志级别、不需要过滤混杂在同一个流里的混合输出。

对于调试来说，这意味着你可以直接`hermes acp 2>&1 | jq .`把JSON-RPC流量抽出来看，而不用翻Hermes的日志文件。

**天然进程隔离，不需要处理网络边界问题** 。如果ACP走HTTP，编辑器得处理端口冲突、防火墙放行、localhost端口占用这些工程噪声。

stdio通信天然由操作系统管理进程生命周期，不存在端口竞争，也不会在你的机器上留下一个需要手动清理的长期监听进程。**stdio让编辑器集成变成零配置** 。

只要编辑器能启动一个子进程并与之通信，就能接入ACP。

这使得VS Code、Zed、JetBrains这些完全不同的编辑器生态只需要各自实现stdin/stdout读写，就能共享同一个Agent runtime——不需要每个编辑器都维护一套独立的Agent实例 [2](https://github.com/NousResearch/hermes-agent/issues/569)。

![](https://iili.io/BgVFVPp.png)
> 日志走stderr，stdout归JSON-RPC——这才是stdio设计该有的洁癖

### Tool Set边界：ACP不包含什么，比包含什么更重要

Hermes ACP Server附带的是一个经过刻意裁剪的工具集，叫`hermes-acp toolset` [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

这个工具集包含：**文件操作** （read_file、write_file、patch、search_files）、**终端工具** （terminal、process）、**Web和浏览器工具** 、**记忆和会话搜索** 、**Skills系统** 、**execute_code和delegate_task** 、以及**视觉理解** 。

刻意排除的是：**消息发送** （messaging delivery）和**定时任务管理** （cronjob management）。

这个边界不是技术限制，而是设计决策。

消息发送和定时任务属于Gateway场景，不属于编辑器内嵌场景——你在VS Code里写代码时，不会期望Agent顺手帮你发一条Telegram消息；

你在编辑器里调试一个任务时，也不应该让Agent在后台偷偷发cronjob。

**工具集边界本质上是对编辑器集成语境的语义约束** 。把不属于编辑器工作流的工具排除在外，不仅降低了噪声，更重要的是防止了权限误用——一个编辑器内的Agent不应该有能力直接操作你的消息通道 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

![](https://iili.io/qyoGipR.png)
> 编辑器里突然冒出一条Telegram消息？工具集边界就是来防止这种事的

### Session管理：in-memory store与ACP server进程同寿

ACP的Session Manager是一个进程内（in-process）的Session存储，当ACP Server进程退出时，Session状态随之消失 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

这个设计是ACP和CLI/Gateway之间最显著的行为差异之一。

CLI和Gateway的Session写入Hermes的SQLite数据库（SessionDB），可以跨进程持久化，可以`/resume`加载，可以从Web Dashboard浏览。

但ACP的Session只在当前ACP Server进程内存里，你断开重连之后，之前的对话历史不会自动恢复。

每个ACP Session追踪以下状态：Session ID、工作目录（cwd）、当前选中的模型、当前对话历史，以及一个取消事件（cancel event）用于中断正在进行的Agent运行 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

为什么不用SessionDB？

因为ACP的Session生命周期天然和编辑器会话绑定——你打开VS Code、连接ACP、用完关掉编辑器，这个Session本质上就是一个编辑器内的临时工作上下文，没有跨会话复用的需求。

强行塞进SessionDB反而增加了不必要的复杂性。

但这里有一个实际的工程影响：如果你的工作流程需要跨编辑器重启保持上下文，ACP Session不提供这个能力。

你需要依赖Hermes的记忆系统（Memory Provider）来跨Session保留项目知识，而不是依赖Session历史。

### cwd绑定：Editor的workspace就是Agent的cwd

ACP最实用的设计之一是**工作目录绑定** 。编辑器的工作目录（cwd）被绑定到Hermes的任务ID（task_id），而不是绑定到ACP Server进程的启动目录 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

这句话听起来有点绕，但实际效果很清楚：当你从VS Code的某个项目文件夹打开一个ACP会话，`file tools`的操作基准路径就是这个项目文件夹，而不是你启动`hermes acp`命令时所在的目录。

你在Zed里打开另一个项目文件夹，Agent的文件操作基准路径会切换到那个文件夹，而不是沿用上一个项目的上下文。

**cwd绑定解决了前面提到的「三个Agent三个cwd」问题** 。有了ACP，工具操作、文件搜索和终端命令都基于编辑器当前的工作空间，而不是一个全局固定路径。

这意味着你可以在同一个ACP Server进程里处理多个项目，而不用担心Agent操作到错误的文件。

这个能力是通过在每个ACP Session创建时，把编辑器的cwd注入到Agent的任务上下文里实现的。Editor不只是一个交互终端，它的工作空间状态直接影响Agent的感知范围 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

### Approval Bridge：危险命令的三选一

ACP的Approval Bridge处理的是「编辑器内的Agent要执行危险操作怎么办」这个问题。

相比CLI的交互式确认，ACP的Approval UX更简洁：三个选项——**Allow once** （单次允许）、**Allow always** （永久允许）、**Deny** （拒绝）[1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

编辑器直接把Approval按钮渲染在IDE内，而不是弹出一个独立的终端确认窗口。这对那些习惯在编辑器内完成所有操作的工程师来说是更自然的交互路径。

超时或错误时，Approval Bridge默认拒绝请求。这是一个安全默认值：宁可让Agent停在「等待确认」状态，也不让它在用户没来得及反应时直接执行了一个`rm -rf`命令。

### Provider Resolver：ACP复用CLI的配置体系

ACP Server不维护自己的Provider配置。

ACP启动时，Provider resolver直接继承Hermes的标准配置路径：`~/.hermes/.env`（API密钥）、`~/.hermes/config.yaml`（Provider和模型配置）、`~/.hermes/skills/`（Skills目录）[1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

这意味着你在CLI里配置好的OpenAI API Key、OpenRouter模型选择、Nous Portal凭证，在ACP里直接生效，不需要重新配置。

**凭证和管理是统一的，只有一个真相来源** 。

这也是ACP和「编辑器插件生态」的根本区别——大多数编辑器插件在编辑器内部维护一套独立的配置和凭证存储，导致配置重复和安全策略不统一。

ACP选择让Editor退到「客户端」位置，Agent runtime维护配置真值，这才是消除重复配置的根本解法 [3](https://www.jetbrains.com/help/ai-assistant/acp.html)。

---

## 实操配置：从零搭建VS Code / Zed / JetBrains的ACP连接

架构说清楚了，现在进入生产路径。这部分给的是可以直接复制的配置步骤，按编辑器分开，核心原则统一——先装`hermes acp`，再配编辑器客户端。

### 安装：pip install -e '.[acp]'

ACP支持通过pip的extras安装，命令是一条：

```bash
pip install -e '.[acp]'
```

这条命令做了两件事：安装`agent-client-protocol`这个Python依赖包，同时启用`hermes acp`子命令。

安装完成后，`hermes acp`、`hermes-acp`和`python -m acp_adapter`三条命令等效——你可以任选一条启动ACP Server [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

### VS Code：ACP Client扩展

VS Code侧的配置分两步。

**第一步：安装ACP Client扩展** 。在VS Code扩展市场搜索「ACP Client」，安装由Hermes官方提供的扩展。

这个扩展会在Activity Bar（左侧图标栏）添加一个ACP面板，你可以在里面选择已连接的Agent并开始对话 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

**第二步：配置hermes路径** （可选）。如果扩展没有自动找到`hermes`命令，你可以在VS Code设置里手动指定：

```json
{
  "acp.agents": {
    "Hermes Agent": {
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

设置里的`acp.agents`是一个字典，键是显示名称，值是启动命令和参数。`args`里传`["acp"]`表示启动时自动进入ACP Server模式 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

ACP Client扩展内置了对Hermes Agent的识别，所以从扩展面板的Agent列表里选「Hermes Agent」通常就能直接连上，不需要手动配置manifest路径。

### Zed：agent_servers配置

Zed的配置在编辑器的`settings.json`里，用Zed原生的`agent_servers`字段：

```json
{
  "agent_servers": {
    "hermes-agent": {
      "type": "custom",
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

结构几乎和VS Code一致——都是声明一个named agent server，指定启动命令和参数 [2](https://github.com/NousResearch/hermes-agent/issues/569)。

Zed的ACP集成目前通过issue #569跟踪社区进展，相比VS Code扩展，Zed的方案更偏向配置文件驱动，没有图形化的Agent选择面板，但配置本身足够简洁。

对于已经习惯通过`settings.json`管理编辑器的工程师来说，这个路径很自然。

![](https://iili.io/B9fUaYG.png)
> Zed配置项比VS Code少三行——这大概是Zed用户唯一羡慕VS Code的地方了

### JetBrains：ACP-compatible插件

JetBrains侧需要一个支持ACP协议的AI Assistant插件。

JetBrains AI Assistant（从2024版开始集成在IDE中）原生支持ACP接入，配置时指向`acp_registry/agent.json`这个manifest文件路径：

```plain text
/path/to/hermes-agent/acp_registry
```

Registry manifest描述了Agent的启动命令。

Hermes的`acp_registry/agent.json`文件声明的启动命令就是`hermes acp`——这个文件是ACP Server的元数据端点，JetBrains AI Assistant通过读取它来发现Agent的能力和启动方式 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/) [3](https://www.jetbrains.com/help/ai-assistant/acp.html)。

JetBrains的配置和VS Code/Zed的思路一致：编辑器是客户端，Agent runtime是服务端，配置文件只描述启动方式和路径，不包含凭证或Provider配置。

### Registry manifest：ACP的发现机制

ACP Registry manifest是Editor发现Agent的机制。Hermes官方的manifest文件位于仓库根目录的`acp_registry/agent.json`，它的内容大致是：

```json
{
  "name": "Hermes Agent",
  "command": "hermes",
  "args": ["acp"],
  "description": "Hermes Agent ACP server for IDE integration"
}
```

Editor的ACP Client扩展读取这个manifest，找到Agent的启动命令，然后启动进程、建立stdio连接、开始JSON-RPC通信。

这是一个标准的「声明式发现」流程：Editor不需要硬编码Agent路径，只需要指向manifest所在目录，剩下的由ACP协议规定 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

### 故障排除三板斧：doctor / status / acp

配置过程中遇到问题，排查路径是固定的：

```bash
hermes doctor
```

`hermes doctor`检查环境配置、依赖安装、API凭证有效性——最常见的「ACP启动失败」原因是没有正确安装`agent-client-protocol`依赖，或者Provider凭证配置有问题 [1](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

```bash
hermes status
```

`hermes status`查看当前gateway和CLI的运行状态。

如果gateway已经在跑一个Agent实例，`hermes acp`会启动另一个独立进程——ACP Server和Gateway是隔离的，不共享同一个Agent实例。

```bash
hermes acp
```

直接运行`hermes acp`而不带任何编辑器连接，可以在命令行里手动测试stdio通信。

如果JSON-RPC流量正常打印出来（而不是报启动错误），说明ACP Server本身没问题，问题出在编辑器侧的连接配置上。

### 浏览器后端：CDP连接的特殊注意事项

如果你的工作流涉及`browser`工具（Hermes的自动化浏览器能力），需要在`config.yaml`里配置CDP（Chrome DevTools Protocol）端点：

```yaml
browser:
  cdp_url: "http://localhost:9222"
```

CDP URL是嵌套在`browser`配置块下的，不是顶层配置项。这是一个容易踩坑的地方——写错层级会静默失败，浏览器工具看起来正常但实际走的是fallback而非真实CDP。

另外，如果你在用`browser_cdp`工具（原始DevTools协议直通），Chrome必须监听在`localhost/loopback`地址上。

Cloud browser providers（比如Browserbase或Remote Browser API）不支持CDP协议直连，这类场景下浏览器工具会降级处理 [4](https://www.capsolver.com/blog/ai/hermes-agent-capsolver)。

一个常见的陷阱是Google Chrome 137+版本移除了`--load-extension`的部分行为。

如果你的工作流依赖CapSolver等浏览器扩展进行验证码处理，需要改用**Chrome for Testing** （Chrome for Testing是一个保留扩展API的Chrome变种，专门用于自动化场景），而不是升级到最新版Chrome [4](https://www.capsolver.com/blog/ai/hermes-agent-capsolver)。

## 边界与风险：ACP不是什么，以及什么时候不该用它

说完配置方法，得把丑话说在前面。ACP不是万能协议，它的边界是清晰的，用错地方不仅没有收益，还会制造额外的集成复杂度。

### ACP不是MCP：两个协议根本不在同一层

这是最常见的误用起点。

MCP（Model Context Protocol）是**通用工具发现协议** ，解决的是「单个AI Agent如何连接外部工具和数据源」的问题——你可以把MCP理解为AI世界的USB-C接口，它让任何MCP-compatible Agent能插进任何MCP工具服务器，搜索文件、查数据库、调API，都在一个标准化框架里完成 [1](https://lushbinary.com/blog/hermes-agent-mcp-integration-complete-guide/)。

ACP（Agent Client Protocol）是**编辑器- Agent会话集成协议** ，解决的是「编辑器作为客户端如何与Agent runtime共享上下文和会话状态」的问题——它的设计目标从第一天就是editor-native coding agent，是让Agent真正在编辑器的workspace里工作，而不是在另一个窗口里自言自语 [2](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)。

这两个协议解决的问题集几乎不重叠。MCP让你把更多工具插进Agent，ACP让你把Agent更深地嵌进编辑器。它们可以共存，但不能用ACP替代MCP，也不应该把MCP当成ACP的替代品。

如果你的需求是「给Claude Desktop连上一堆内部工具」，你用的是MCP。

如果你的需求是「在VS Code里让Agent直接读懂我当前项目的cwd、session历史和工具集」，你用的是ACP。

![](https://iili.io/qyoGipR.png)
> ACP不是MCP——这句话值得在开工前让所有人对齐一遍

### Cloud Browser Providers与CDP直连不兼容

browser工具是Hermes的一个强能力，但它的CDP（Chrome DevTools Protocol）模式有明确的部署限制。

CDP协议要求Chrome实例在本地运行，并通过loopback地址（localhost/127.0.0.1）暴露DevTools端口。

这意味着基于云的Browser Provider——Browserbase、Remote Browser API、Browserless等——都不支持CDP直连协议。

这些服务提供的是各自的API，与Chrome DevTools Protocol不兼容 [3](https://www.capsolver.com/blog/ai/hermes-agent-capsolver)。

在本地开发场景这不是问题。

但如果你的工作流需要远程浏览器自动化（比如需要IP代理或特定地理位置的浏览器指纹），ACP场景下的browser工具会降级到非CDP模式，验证码处理、复杂表单自动化等依赖真实浏览器扩展的能力就会受限。

### Google Chrome 137+与--load-extension陷阱

这是一个目前正在发生的兼容性断裂。

Google Chrome从137版本开始对`--load-extension`命令行参数做了限制——部分扩展加载行为被移到了后台页机制里，不再支持通过启动参数直接注入。

这意味着依赖浏览器扩展的自动化工作流（比如CapSolver验证码处理）会静默失效，扩展看起来装了，但实际不生效 [3](https://www.capsolver.com/blog/ai/hermes-agent-capsolver)。

在ACP场景下，如果你的工作流涉及浏览器自动化和验证码处理，**不要升级到最新版Chrome** 。

改用Chrome for Testing——这是一个Google维护的Chrome变种，专门保留了对自动化场景的扩展API支持，解决了版本更新的兼容性问题。

这个坑目前没有优雅的自动化检测手段，主要靠人工注意版本号和实际功能验证。

### Session作用域受限于ACP Server进程

ACP的Session Manager是in-memory的，session生命周期绑定在ACP Server进程上 [4](https://github.com/NousResearch/hermes-agent/blob/main/acp_adapter/server.py)。

这意味着：ACP Server进程重启后，之前的session状态不会自动恢复。

Gateway和CLI的session持久化用的是SessionDB（SQLite），但ACP的session存储是独立隔离的。

对于大多数单次编码任务这不是问题——你开编辑器、问Agent、得到答案、关编辑器，session本来就不需要跨进程持久化。

但如果你的工作流涉及「跨天继续上一次对话」，ACP session的进程绑定会让你失望。

这不是bug，是设计选择。ACP选择了轻量和进程隔离，代价是跨进程session连续性。

![](https://iili.io/BAxfjl1.png)
> Session不跨进程——这个问题在review代码的时候往往比CDP更让人崩溃

---

## 工程判断：你的团队什么时候该考虑ACP集成

把架构、配置和边界都说清楚之后，最后一件事：给一个可执行的决策框架。

### 收益评估矩阵

不是所有团队都需要ACP集成。收益分布不均匀：

**高收益场景** ：多编辑器用户（同时用VS Code写代码、用Zed做review、用JetBrains跑调试）、需要在多个项目间保持一致的Agent行为、团队内部工具集配置需要统一管控。

这三个场景有一个共同点：配置和上下文的重复成本大于ACP集成成本。**中收益场景** ：单编辑器重度用户、团队内部只有一个主要开发环境。

这类用户能从cwd绑定和编辑器内Approval体验里获得明显收益，但迁移成本几乎为零——装一个`pip install -e '.[acp]'`而已。

**低收益场景** ：临时使用、验证性项目、或者Agent使用频次极低。对于这些场景，单独开一个Terminal跑CLI已经足够，ACP带来的增量价值不够显著。

### Provider统一性是最被低估的收益

大多数团队在评估ACP时关注的是「编辑器里能不能直接用Agent」，但低估了「配置只写一次」这件事的长期价值。

在一个没有ACP的多编辑器环境里，每个编辑器插件各自维护API密钥、模型选择、工具配置——至少三个配置源，同一个团队里不同人的配置还可能不一致。

当API Key需要轮换时，要更新三个地方；当模型策略改变时，要说服三个人改配置。

ACP把配置收敛到一个真相来源：`~/.hermes/config.yaml`。编辑器只是客户端，它们不问配置，只问Agent——而Agent自己去查配置 [2](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/) [5](https://www.jetbrains.com/help/ai-assistant/acp.html)。

对于2人以上的工程团队，这个收益是持续累积的，不是一次性的。

### 迁移成本：单行配置，回滚成本极低

ACP集成的技术成本是最低的那一档。

如果编辑器原生支持ACP（比如VS Code ACP Client扩展），配置是一条JSON加一个`pip install`；

如果编辑器需要配置文件驱动（Zed、JetBrains），配置量在5行以内；

无论哪种情况，ACP Server和Gateway是独立进程，ACP出问题不影响CLI和Gateway的正常运行。

回滚只需要两步：卸载编辑器侧配置，重启编辑器。Agent runtime侧不需要任何变更。

这意味着ACP是一个**低风险实验** ——你可以在一个编辑器上试水，体验好了再扩展到其他编辑器，不满意了完整撤回几乎没有代价。

### 一个判断题

如果你的团队满足以下任意两个条件，ACP值得一试：

1. 团队内有3个以上的工程师使用不同的编辑器

2. Agent已经成为日常编码流的固定环节

3. 有过「同一个问题在不同编辑器里得到不同答案」的经历

如果一个都不满足，先跑通CLI再考虑集成的事。

---

Hermes Agent的ACP集成，本质上是在回答一个问题：编辑器里的AI和终端里的AI，能不能共享同一个上下文、同一套工具、同一份记忆？

答案是：能。但你需要知道自己在用什么协议、边界在哪里，以及什么时候该停手。

ACP不是MCP的替代品，不是Gateway的替代品，也不是「在编辑器里装个AI插件」这个简单需求的正确答案——它是针对特定场景的精确解：当编辑器本身成为工作现场时，Agent应该以第一公民的身份进入这个现场，而不是在旁边开一个独立的窗口假装参与。

这个设计选择值得认真对待。

---

## 参考文献

1. [lushbinary.com](https://lushbinary.com/blog/hermes-agent-mcp-integration-complete-guide/)

2. [ACP Editor Integration | Hermes Agent](https://hermes-agent.nousresearch.com/docs/user-guide/features/acp/)

3. [capsolver.com](https://www.capsolver.com/blog/ai/hermes-agent-capsolver)

4. [GitHub · NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent/blob/main/acp_adapter/server.py)

5. [Agent Client Protocol (ACP) | AI Assistant Documentation](https://www.jetbrains.com/help/ai-assistant/acp.html)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
