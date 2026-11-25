---
title: "Amazon 报告黑客用开源框架 Cairn 驱动 AI 智能体在约 11 分钟内自主发现并利用 0-day"
date: "2026-11-25 11:00:44"
updated: "2026-11-25 11:49:02"
permalink: "posts/2026/11/25/amazon-报告黑客用开源框架-cairn-驱动-ai-智能体在约-11-分钟内自主发现并利用-0-day/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/25/amazon-报告黑客用开源框架-cairn-驱动-ai-智能体在约-11-分钟内自主发现并利用-0-day/"
article_id: "8a19c2ca-5e3a-47d5-8261-27a6f0cfc994"
description: "Amazon 报告黑客用开源框架 Cairn 驱动 AI 智能体在约 11 分钟内自主发现并利用 0-day。先讲清事实，再讲机制、边界和取舍：Amazon 威胁情报报告称、黑客在开源 AI 渗透测试框架 Cairn 上运行的 AI 智能体、仅凭一句「获取 shell 权限」的指令、就自主发现并利用了一个开源医学影像 AI 应用中未修补的路径遍历 0-day、从映射 API 到任意写文件仅用约 11 分钟、随后写入 Python 反向 shell payload 并以 root 权限获得控制。。"
cover: "/var/lib/aimagician/artifacts/covers/8a19c2ca-5e3a-47d5-8261-27a6f0cfc994/04f4a840-6a80-4595-a0fe-87057de5951b/cover.png"
imgTop: false
---

Amazon 威胁情报报告称，黑客在开源 AI 渗透测试框架 Cairn 上运行的 AI 智能体，仅凭一句「获取 shell 权限」的指令，就自主发现并利用了一个开源医…



![程序员系列表情：你从我脸上看到了什么](https://iili.io/nlCYpe9.png)
> Agent  autonomously executing exploit chain



## 事件始末：11 分钟完成零日发现与利用

### 攻击时间线与发现经过

根据 Amazon Threat Intelligence 于 2026 年 11 月 20 日发布的报告，攻击发生在 9 月 8 日至 10 日之间。研究人员于 9 月 10 日发现了一台未启用身份验证的 Cairn 实例暴露在公网，从而得以查看其中的项目配置、攻击指令及 AI 智能体的操作日志。

攻击者仅提供目标 IP 地址列表和「获取 shell 访问权限」这一条指令，AI 智能体便自主开始行动。Amazon 根据简体中文操作指令、程序时间戳采用中国标准时间（CST）以及攻击目标分布等线索，研判攻击者与中国有关，但未确认具体所属组织。

### 漏洞本质：路径遍历导致任意文件写入

目标服务器上运行着开源医学影像 AI 应用 MONAI Label。该应用在默认配置下 `MONAI_LABEL_AUTH_ENABLE=False`，即不启用身份验证，这一配置在开源项目中极为常见，也直接放大了风险面。

Cairn 的 AI 智能体首先识别出应用框架并枚举了所有 API 端点，随后锁定带文件名参数的 `PUT /datastore/image` 上传接口。它对该参数执行路径穿越测试，发现底层的 `LocalDatastore.add_image()` 方法在调用 `shutil.copy()` 落盘前，未对解析后的路径做任何校验——攻击者只需构造 `../../../etc/cron.d/` 之类的路径，即可将任意内容写入服务器文件系统。



![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> 路径遍历是经典漏洞，但触发条件往往隐藏在默认配置里



当时该漏洞没有任何公开披露记录，属于真正的零日。从扫描 API 到实现服务器任意文件写入，AI 智能体仅用时约 11 分钟。

拿到文件写入权限后，智能体没有停留在常规的恶意脚本投递，而是将一段 Python 反向 shell 写入了 `sitecustomize.py`——这是 Python 解释器每次启动时自动全局加载的初始化钩子。随后它主动调用 MONAI Label 的模型训练 API，触发后台拉起新的 Python 进程，新进程在执行初始化阶段加载了恶意脚本，最终以 root 权限建立了持久化反向 shell 连接。



![程序员系列表情：如果把面试官唬住了就要50k，没唬住就要5k](https://iili.io/CClZIPS.png)
> ##事件始末：11分钟完成零日发



## 机制拆解：Cairn 如何做到自治攻击

### 共享黑板架构与 Agent 协作模式

Cairn 本身是一款合法的企业级自动化渗透测试平台，由 Aequilibrium 公司开发。其核心架构基于「共享黑板」（Shared Blackboard）模式：多个 AI Agent 通过一个共享图数据库协作，Agent 读取黑板上的事实，将自身发现和意图写回，形成「事实—意图」图谱。



![Cairn Agent 协作架构](https://iili.io/ofQ5vRV.png)
> Cairn Agent 协作架构


每个 Agent Worker 由独立 LLM 驱动，在隔离容器中运行。当积累足够证据后，结果被标记为不可变的「事实」；下一步行动则作为「意图」入队等待执行。人工操作员可以随时注入「提示（hints）」来引导方向，但在此次事件中，人类操作员的作用仅限于最初的任务描述。

### 从发现到提权的完整链路



![智能体攻击链路](https://iili.io/ofQ5ZRp.png)
> 智能体攻击链路


这个链路的关键在于：智能体在没有预置漏洞知识库的情况下，自主完成了从框架识别、API 枚举、漏洞测试到利用的完整闭环。这也是此次事件最令人警醒的地方——攻击门槛被大幅降低，不再需要高级红队技能，只需要一台暴露的 Cairn 实例和一条自然语言指令。

## 边界与比较：与其他攻击方式的差异

### 传统自动化 vs AI 自治 Agent

在另一台目标服务器上，同样的 AI 智能体对超过 30,000 组凭据组合进行了暴力破解，持续超过六小时仍未成功。这说明当前 AI 智能体在处理高熵、无上下文线索的攻击场景时，仍然依赖穷举，效率与传统自动化工具相差无几。

相比之下，面对有明确 API 特征的目标（如 MONAI Label），智能体的分析能力展现出明显优势。它能理解「文件名参数」的含义，能推断路径穿越的测试方式，能在短时间内完成多维度的试探与验证。这种「理解—假设—验证」的循环，是纯脚本化工具难以复现的。



![程序员 reaction：你被我盯上了](https://iili.io/CCZOwMJ.png)
> Agent 在结构化目标上找到了捷径，在无结构目标上仍然笨拙



### 此次攻击的能力边界

需要注意，这次报告中的智能体并非完全从零开始。Cairn 的 Agent 在渗透测试场景中内置了大量工具调用能力（HTTP 请求、文件读写、命令执行等），且攻击者可能通过 hints 提供了部分方向性引导。Amazon 的报告措辞是「almost completely autonomously」而非「fully autonomous」。

不过即便如此，从接收到指令到取得 root shell 的整个核心流程——尤其是零日漏洞的发现——确由智能体自主完成，这一事实本身就具有足够的警示意义。

## 应对与取舍

### 防御层面的优先级

MONAI Label 开发团队在收到 Amazon 通知后，于 11 月 22 日发布了 0.8.6 安全更新，修复了 CVE-2026-133968 及其他路径遍历漏洞。但对于尚未更新的部署，以下几条是最直接的缓解措施：

- **默认启用认证**：`MONAI_LABEL_AUTH_ENABLE=True` 不应是选配项，而应是唯一发布配置。
- **输入校验前置**：所有涉及文件路径的参数必须经过白名单校验，拒绝 `..`、绝对路径等非预期模式。
- **容器化与权限隔离**：即使应用被攻破，容器级别的权限限制也能阻止 root 权限的获取。
- **对外暴露的最小化**：任何面向公网的服务，都应默认假设会被自动化扫描，因此需要在网络层额外增加访问控制。

### 工具使用方的责任边界

此次事件中，攻击者将 Cairn 实例暴露在公网且未设密码，等于将自己的攻击指挥系统拱手让人。Amazon 能获取完整的攻击日志，靠的不是主动入侵，而是对方自己的疏忽。

这是一个值得行业反思的现象：攻击者如此大规模地暴露基础设施，反映出的不是防御方的无能，而是进攻方在工具滥用和运营纪律上的系统性缺陷。当然，这不能成为防御方放松警惕的理由。

更关键的问题是，当类似 Cairn 的工具可以以「渗透测试」为名被任何人获取并部署，安全厂商和监管机构的治理边界在哪里？这类工具的合法用途不可否认，但公开暴露的实例数量在持续增加——此前已有安全研究者统计到超过 3,200 个宿主上存在暴露的自主攻击框架实例。



![聊不动了先去搬砖时的无奈表情](https://i.ibb.co/s9F2XmcB/transparent.png)
> 工具是谁写的不重要，重要的是谁把它暴露在了公网



坦白讲，这件事真正让人不安的不是 AI 有多聪明，而是 AI 让「有动机但没有高级技能」的攻击者，能够完成过去需要专业红队才能做到的事情。当攻击效率的提升速度远超防御体系的适应速度，安全成本曲线会被彻底改写。

## 攻击路径的技术拆解

### 从 API 映射到路径遍历验证

目标服务器上运行的是开源医疗影像 AI 框架 MONAI Label，默认配置下身份验证未启用（`MONAI_LABEL_AUTH_ENABLE=False`）。Cairn 的智能体首先识别出应用框架，枚举所有 API 端点，很快锁定了一个带有文件名参数的 `PUT /datastore/image` 上传接口。

智能体对该参数进行了路径穿越测试，发现底层 `LocalDatastore.add_image()` 方法在调用 `shutil.copy()` 落盘前，没有校验解析后的路径是否逃逸出数据目录。当时全网没有任何补丁或披露记录。



![Cairn Agent 攻击链路](https://iili.io/ofQ7fbS.png)
> Cairn Agent 攻击链路



### 任意文件写入与 root 提权

拿到文件写入权限后，智能体没有停留在上传普通脚本。它直接将一段 Python 反向 shell 写入系统的 `sitecustomize.py`——这是 Python 解释器每次启动时都会自动全局加载的初始化钩子。接着它主动调用 MONAI Label 的模型训练 API 接口，诱发后台拉起一个新进程，从而触发 payload 执行。

这一连串动作的核心在于对目标环境的深度理解。智能体不是盲目执行脚本，而是选择了最可靠的持久化路径。

## 自治 Agent 与传统自动化的本质差异

### 策略生成 vs 预设脚本

传统自动化工具执行的是预设的攻击脚本，每个步骤都是硬编码的。Cairn 的智能体则不同：它维护一个共享的「黑板」数据结构，记录事实和意图，然后自主决策下一步行动。\[来源：Ars Technica 对 Cairn 架构的报道\]

这种架构带来了两个关键优势。一是策略适应性——当一种攻击路径受阻，智能体可以切换方案。二是少人工干预——整个攻击过程几乎不需要操作者实时参与。

报告还显示，在面对加固目标时，智能体曾尝试超过 30,000 组凭证组合，持续攻击 6 小时以上，最终未能突破。这表明自治 Agent 并非万能，它的优势在于发现和利用复杂漏洞，而非 brute-force 式的暴力破解。

### 自适应与抗干扰能力

传统渗透测试工具的输出是确定性的，相同的输入必然产生相同的输出。Cairn 智能体的行为则具有概率性——每次攻击的路径、速度和策略可能有所不同。这对安全检测提出了新的挑战：基于签名的检测系统难以覆盖这种动态行为。

## 安全工程启示

### 默认配置与暴露面管理

这起事件中最容易被忽视的因素是默认配置。MONAI Label 默认关闭身份验证，且目标服务器直接暴露在公网。对于任何对外提供服务的应用，关闭认证或暴露管理面板都是高风险操作。\[来源：AWS Security Blog 原始报告\]

更值得注意的是，攻击者部署的 Cairn 实例同样没有设置访问控制，被 Amazon 研究人员直接发现。这形成了一个讽刺的闭环：攻击者因为疏忽留下了证据，研究团队才得以还原整个攻击过程。

### Agent 时代的安全检测思路

这起事件标志着攻击工具进入了一个新阶段。过去十年，自动化渗透测试工具主要是脚本集合；现在，Agent 能够自主决策、 adapt 策略、完成从发现到利用的全流程。

对安全团队而言，这意味着传统的基于已知漏洞的扫描策略需要补充基于行为的检测。监控异常的文件写入操作、异常进程启动、以及对 `sitecustomize.py` 等关键文件的修改，可能是更早发现此类攻击的有效手段。

自治 Agent 的速度优势是显而易见的——11 分钟完成从发现到提权。但这也意味着防御方需要在相同的时间窗口内完成检测和响应，否则损失已经造成。\[来源：The Record 对 Amazon 报告的解读\]

Amazon 威胁情报报告称，黑客在开源 AI 渗透测试框架 Cairn 上运行的 AI 智能体，仅凭一句「获取 shell 权限」的指令，就自主发现并利用了一个开源医学影像 AI 应用 MONAI Label 中未修补的路径遍历 0-day，从映射 API 到任意写文件仅用约 11 分钟，随后写入 Python 反向 shell payload 并以 root 权限获得控制。

## Amazon 报告黑客用开源框架 Cairn 驱动 AI 智能体在约 11 分钟内自主发现并利用 0-day

### 攻击路径的技术拆解

攻击路径可分为三个阶段：发现目标、挖掘漏洞、利用漏洞。整个过程中，Cairn 的多个 Agent 通过共享黑板（shared blackboard）进行协作，黑板以 fact‑intent graph 的形式记录已确认的事实和待执行的意图。

#### 从 API 映射到路径遍历验证

第一步是识别目标应用并映射其 API。目标服务器上运行着开源医学影像 AI 框架 MONAI Label，且默认配置 `MONAI_LABEL_AUTH_ENABLE=False`，即未启用身份验证。Cairn 的 Agent 首先通过主动探测枚举出所有 API 端点，很快锁定了带文件名参数的 PUT `/datastore/image` 上传接口。

接下来是验证路径遍历漏洞。Agent 向该接口的文件名参数注入路径穿越序列（如 `../../`），并观察服务器响应。底层实现中，`LocalDatastore.add_image()` 方法在调用 `shutil.copy()` 落盘前，并未校验解析后的路径是否逃逸出数据目录。这一缺陷意味着攻击者可以将文件写入服务器的任意位置。

从枚举 API 到确认漏洞，整个探测过程仅耗时约 11 分钟。这并非暴力扫描，而是 Agent 基于对框架的语义理解，有针对性地测试高风险参数。

#### 任意文件写入与 root 提权

获得任意文件写入能力后，Agent 需要实现持久化控制。传统攻击者可能直接反弹一个 shell，但现代服务器往往部署了入侵检测。Cairn 的 Agent 选择了更隐蔽的路径：利用 Python 解释器的启动钩子。

Python 环境会加载 `sitecustomize.py` 文件（位于 site‑packages 目录下），每次启动 Python 进程时都会自动执行该文件。Agent 将一段精心构造的 Python 反向 shell payload 写入这个文件，然后主动触发 MONAI Label 的模型训练 API，诱使后台拉起一个新的 Python 进程。新进程启动时加载了恶意 `sitecustomize.py`，从而建立起反向连接。

由于 MONAI Label 的后台任务通常以 root 权限运行，反向 shell 自然继承了 root 权限，Agent 成功获得服务器的完全控制权。



![Cairn Agent 协作攻击流程](https://iili.io/ofQ7ErJ.png)
> Cairn Agent 协作攻击流程



### 共享黑板架构与 Agent 协作模式

Cairn 的核心设计是共享黑板（shared blackboard）架构。每个 Agent 都是独立的 LLM 驱动实例，运行在隔离的容器中。它们通过读写黑板上的 fact‑intent graph 来协同工作：已验证的事实被标记为 immutable，新的行动计划作为 intent 加入队列。

这种架构允许 Agent 分工并行。在上述攻击中，一个 Agent 负责环境侦察，另一个专注漏洞挖掘，第三个准备利用代码。它们不需要人工干预每一步，而是根据黑板上的状态自主决策下一步行动。

更重要的是，Agent 能够接受人类操作员的"提示"（hints）。例如，操作员可以告知"目标可能是容器化部署"或"注意上传接口"，从而引导 Agent 集中搜索资源。这种半自主模式既保留了人类的策略指导，又充分发挥了 AI 的执行效率。

### 自治 Agent 与传统自动化的本质差异

传统渗透测试工具（如 Metasploit、Burp Suite）依赖预定义的漏洞库和脚本。它们能快速执行已知攻击，但面对未知漏洞时束手无策。即使引入脚本组合，也只能在人工编排的固定流程内运行。

AI 自治 Agent 的本质区别在于**策略生成能力**。Cairn 的 Agent 不是执行预设脚本，而是根据当前目标动态生成攻击策略。它能理解 API 语义、推断潜在弱点、设计验证步骤，并在失败后调整方案。这种能力使其在几分钟内完成了传统工具需要数小时甚至数天才能完成的工作。

另一个关键差异是**抗干扰能力**。攻击者在另一个目标上尝试了超过 30,000 种凭证组合，持续六小时未果。传统自动化工具可能在此过程中被锁定或触发警报，但 Cairn 的 Agent 能识别这些尝试无效，转而寻找其他路径。这种适应性来源于 LLM 的推理能力，而非简单的重试逻辑。

### 安全工程启示：默认配置与暴露面管理

此次攻击暴露出两个常见但致命的安全配置失误：一是 MONAI Label 的认证功能默认关闭，二是攻击者的 Cairn 控制面板未设置访问密码。

第一个问题属于应用默认安全配置缺失。许多开源工具为方便开发者试用，默认禁用安全特性（如认证、加密），却未明确警示生产环境必须重新启用。安全团队在部署时应严格审查默认配置清单，确保所有安全选项处于启用状态。

第二个问题则是暴露面管理不当。攻击者将 Cairn 实例暴露在公网上且无认证，看似不可思议，实则反映了自动化攻击工具的泛滥。安全研究人员在公网扫描中发现了多台类似暴露的实例，其中一台甚至包含了多场攻击活动的完整数据（目标列表、凭证、泄露数据）。

> 一个被遗忘的暴露服务，比精心设计的漏洞更具杀伤力。

Cairn 框架本身是由 defenders 开发用于自动化渗透测试的合法工具，但一旦落入攻击者手中，其自主发现并利用 0‑day 的能力就构成了新型威胁。防御者需要重新审视自动化工具的双刃剑效应：攻击门槛正在因 AI 而降低，防御方同样拥有对等的自动化能力，关键在于谁先完成知识积累与策略迭代。

对于企业安全团队，建议立即执行以下动作：第一，审查所有暴露在互联网的服务，确保认证机制开启且遵循最小权限原则；第二，对内部使用的 AI Agent 框架（如 Cairn）实施严格的访问控制、审计日志和网络隔离；第三，建立针对"自治攻击"的检测规则，关注短时间内的异常行为序列（如 API 枚举→漏洞验证→持久化写入）。

## 事件核心复盘

攻击活动发生在 2026 年 9 月 8 日至 10 日。攻击者向 Cairn 提供了目标 IP 地址列表和一个简洁的目标指令，随后整个攻击过程几乎无需人工干预。

研究发现一台未启用身份验证的 Cairn 服务器，调查人员得以查看其中的项目设置、攻击指令及 AI 智能体的操作记录。这为还原攻击链提供了关键证据。



![程序员 reaction：你确定这是真的吗？](https://iili.io/CAQh0N9.png)
> Agent 自动运行时，人在旁边看着



攻击目标为东亚多所高校的 GPU 服务器。其中一台服务器运行着开源医疗影像 AI 框架 MONAI Label，且默认配置 `MONAI_LABEL_AUTH_ENABLE=False`，即未启用身份验证。这一配置缺陷成为攻击者进入系统的第一个突破口。

## 攻击链路完整还原

Cairn 的智能体首先识别目标应用的框架类型，随后枚举所有 API 端点。很快，它锁定了带有文件名参数的 `PUT /datastore/image` 上传接口。

智能体对该参数进行路径穿越测试，发现底层的 `LocalDatastore.add_image()` 方法在调用 `shutil.copy()` 落盘前，没有校验解析后的路径是否逃逸出数据目录。此时全网没有任何补丁或披露记录，属于真正的 0-day。

## 漏洞本质与利用路径

漏洞的本质是路径遍历（Path Traversal）导致任意文件写入。攻击者可以通过构造恶意文件名参数，将文件写入服务器任意位置。

智能体拿到文件写入权限后，没有停留在上传普通脚本，而是将一段 Python 反向 shell payload 写入了系统的 `sitecustomize.py`——这是 Python 解释器每次启动时都会自动全局加载的初始化钩子。

随后，智能体主动调用 MONAI Label 的模型训练 API 接口，诱发后台拉起一个新进程，从而执行写入的 payload，最终获得 root 权限。



![从 API 映射到 Root 提权的完整攻击链路](https://iili.io/ofQ7XmN.png)
> 从 API 映射到 Root 提权的完整攻击链路



## Cairn 框架机制拆解

Cairn 是一个开源的 AI 问题解决引擎，最初验证的领域是自主渗透测试。用户使用方式很简单：给出任务或目标，可选地提供一些提示，然后等待结果。

### 共享黑板架构的工作原理

Cairn 的核心设计是共享黑板（Shared Blackboard）架构。一个服务器维护着一个包含事实和提示的共享图结构。调度器读取这个图，安排任务，管理容器，并写入协议。

每个 Agent  Worker 都是一个独立的容器，运行多个 Agent 并发执行任务。Agent 读取黑板，将发现写回为事实意图图（fact-intent graph）。人类操作者可以随时注入提示来引导操作。

已确认的发现会累积为不可变的事实，Agent 将其下一步行动排队为意图。



![大佬系列表情：全是冰的，大佬喝什么自己选](https://iili.io/Cuzcjzg.png)
> Agent 自己搞定，人只需要看



### 多 Agent 协作模式

在针对另一台加固目标的攻击中，智能体尝试了超过 30,000 种凭证组合，持续了六个小时，最终未能暴力破解成功。但智能体没有放弃，而是自动转向其他攻击路径。

这种多 Agent 协作模式的本质是：一个 Agent 失败后，其他 Agent 可以从共享黑板读取状态，调整策略，尝试不同的攻击向量。整个过程无需人工干预。

### 从发现到提权的完整链路

从发现 0-day 到获得 root 权限，整个链路体现了 AI 智能体的自主决策能力：

- 识别应用框架 → 枚举 API → 发现漏洞 → 利用漏洞写入 payload → 触发执行 → 获得权限

每一步都是智能体自主判断和执行，人类操作者只提供了初始目标和目标 IP 列表。

## 与传统自动化攻击的本质差异

传统渗透测试工具（如 Burp Suite、Metasploit）依赖预设脚本和已知漏洞库。它们能高效执行重复性任务，但面对未知漏洞时束手无策。

### 策略生成 vs 预设脚本

Cairn 的智能体不是执行预设脚本，而是根据目标环境动态生成攻击策略。它会先分析目标，识别应用类型，然后选择适合的测试方法。

这种能力来自大语言模型的推理能力。智能体可以理解 API 参数的含义，推断可能的漏洞类型，并设计测试用例验证假设。

### 自适应与抗干扰能力

当暴力破解失败后，智能体自动转向其他攻击路径。这种自适应能力是传统自动化工具不具备的。

传统工具遇到失败通常会记录错误并继续执行下一个预设步骤。AI 智能体则会重新评估策略，选择新的攻击向量。

### 失败后的重试与转向

在六小时的暴力破解失败后，智能体没有终止任务，而是转向了 MONAI Label 的路径遍历漏洞。这种灵活性大幅提升了攻击成功率。

## 参考文献
- [Amazon AWS Security Blog - Chinese-nexus actor's Cairn AI agents found a zero-day on their own](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own)
- [Ars Technica - Amazon says hackers' AI agents found and exploited 0-day with little human input](https://arstechnica.com/security/2026/11/amazon-says-hackers-ai-agents-found-and-exploited-0-day-with-little-human-input/)
- [BleepingComputer - Hackers use autonomous AI tool Cairn to find zero-day, take over server](https://www.bleepingcomputer.com/news/security/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server)
- [Palo Alto Unit 42 - Attackers Use Autonomous AI to Target Semiconductor, Defense and Civil Society Sectors](https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/)
- [iThome - 東亞多所大學遭鎖定，中國駭客用AI攻擊框架Cairn發動攻擊](https://www.ithome.com.tw/news/[REDACTED])
- [AVIATRIX Threat Research - Cairn AI Zero-Day Attack on MONAI Label](https://aviatrix.ai/threat-research-center/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server)
- [GitHub Security Advisory - GHSA-qc22-rmgc-vg94](https://github.com/advisories/GHSA-qc22-rmgc-vg94)
- [lifcc on X - Cairn AI Attack Framework Analysis](https://x.com/mylifcc/status/2124798612873883911)
- [The Record - Amazon says Chinese hackers used Cairn AI tool to discover apparent zero-day during attack on university](https://therecord.media/amazon-research-cairn-ai-university-attacks-possible-zero-day)
- [Aviatrix - Cairn AI Zero-Day Attack on MONAI Label | Chinese-Nexus Campaign 2026](https://aviatrix.ai/threat-research-center/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
