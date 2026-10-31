---
title: "Anthropic官方插件被「寄生」，背后是同一类攻击又来了"
date: "2026-10-31 05:00:02"
updated: "2026-10-31 05:06:39"
permalink: "posts/2026/10/31/anthropic官方插件被寄生背后是同一类攻击又来了/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/31/anthropic官方插件被寄生背后是同一类攻击又来了/"
article_id: "8500d7d6-83ab-42be-8288-b1f350290d00"
description: "2026年10月29日，Cursor市场出现被篡改的Claude Code扩展（版本2.1.313），在约11小时内影响最多5000名用户。恶意代码会在扩展初始化阶段自动执行，收集主机信息并向~/.ssh/authorized_keys注入标记为\"svc-telemetry\"的攻击者公钥，尝试建立持久化SSH反向隧道。Cursor随后下架该版本并发布2.1.314修复，Anthropic否认自身系统被入侵，称攻击者是利用了Cursor市场的发布权限。"
cover: "/var/lib/aimagician/artifacts/covers/8500d7d6-83ab-42be-8288-b1f350290d00/afb1288b-c82d-4982-9d08-3573d30736ff/cover.png"
imgTop: false
---

你打开VS Code或Cursor，等加载完插件，背后可能已经有人拿着你的SSH key在监听你了。

## 一、事件经过：一个扩展背后的11小时

### Claude Code扩展版本2.1.313在Cursor市场被发现被篡改

2026年10月29日，Cursor市场出现了一个被恶意篡改的Claude Code扩展。版本号为2.1.313，比官方正常的2.1.314早一天上线，存在时间约11小时。安全团队StepSecurity和OpenSourceMalware先后发布报告，指出该包被注入了约66行恶意JavaScript代码。

Cursor的安全公告确认，这一恶意版本「并非由Anthropic开发」。但问题在于，它出现在Cursor自己的VS Code扩展市场，用的是Anthropic的公司名称和官方扩展标识。

### 恶意代码触发机制：无需开发者主动对话即可执行

恶意代码的执行时机是扩展初始化阶段。这意味着开发者不需要启动任何AI对话、不需要点击任何按钮、不需要输入任何命令——只要VS Code或Cursor启动并加载了该扩展，脚本就会自动运行。



![程序员反应图：一名路过的小码农](https://iili.io/CZ6TOoQ.png)
> 终端里默默跑了一段你不知道的脚本



脚本收集的信息包括：主机名、用户名、环境变量、Git邮箱配置和公网IP。随后向`~/.ssh/authorized_keys`追加一个未授权公钥，标签刻意写成「svc-telemetry」，试图伪装成合法的服务遥测密钥。

### Cursor下架并建议升级至2.1.314

发现异常后，Cursor立即下架了2.1.313版本，并发布2.1.314作为修复版本。公司通过X平台发帖，说明事件影响上限为5000名用户，并计划直接联系受影响者。Anthropic同步澄清：其自身系统未被入侵，攻击者利用的是Cursor市场的发布权限。

## 二、攻击路径：为什么官方名义的插件也会被寄生

### Cursor市场发布权限 vs Anthropic自身系统

这一事件的本质不是「Anthropic的系统被攻破」，而是「Cursor市场的发布渠道被劫持」。扩展市场通常允许第三方提交包，通过审核流程后上架。攻击者很可能获取了某个具备发布权限的账户——可能是通过凭证泄露、社会工程或内部人员失误。



![程序员 reaction：柯南00070 出现了](https://iili.io/CCZAMap.png)
> 权限边界之外的信任盲区



Cursor市场与Open VSX两个注册表同时出现该恶意包，说明攻击者利用了跨平台的分发漏洞。Open VSX作为VS Code生态的开放注册表，审核机制相对宽松，更容易成为恶意包的跳板。

### Nx Console同类事件：供应链连环暴露

同一天，Nx开发团队也发布安全公告，证实Nx Console的VS Code延伸套件被植入恶意代码。这起事故的根因是某位开发者遭遇TanStack供应链攻击，GitHub凭证外流，攻击者得以冒充其身份触发构建流程，将恶意代码推送至GitHub存储库并自动发布。

两起事件相隔不足48小时，暴露出同一个结构性问题：当扩展依赖的供应链任一环节失守，下游分发渠道就会成为传导节点。

## 三、技术细节：恶意代码做了什么

### SSH后门持久化机制

恶意代码的核心目标是持久化访问。具体步骤如下：

扩展初始化 → 收集主机信息 → 追加SSH公钥到authorized_keys → 尝试启动本地SSH守护进程 → 发起反向隧道连接

公钥被标记为「svc-telemetry」是为了降低用户的警惕性——如果有人在代码审查中发现这个密钥，可能会误以为是合法的遥测服务所添加。



![被追着问 BUG 修完了吗时的程序员表情](https://iili.io/noCi27n.png)
> 一次初始化，三条通道同时生效



攻击者不满足于一次性窃取数据。反向隧道的设计意味着：即使开发者删除了公钥、卸载了扩展，只要主机未被重建，攻击者仍可能通过残留的SSH配置或内存中的进程维持访问能力。

### 攻击者的目标：反向隧道而非一次性窃取

典型的供应链窃密攻击往往以一次性数据外泄为目标——拿就走人。但这次攻击的目标是建立「持久化隧道」。

持久化隧道的价值在于：它把单次入侵转化为持续监听能力。攻击者可以长期回收新产生的SSH密钥、环境变量中的API Token、以及后续代码写入的敏感内容。

CellCog在安全报告中给出的判断非常直接：「重建主机比假设清除残留文件更可靠。」这不是建议，而是基于SSH后门技术特性的判断——一旦authorized_keys被写入且SSH守护进程被触发，本地清理很难保证没有残留入口。

## 四、取舍与判断：开发者现在该怎么做

### 清理 vs 重建主机的边界

对于普通个人开发者，如果仅安装了2.1.313版本且在11小时窗口期内未进行任何敏感操作，可以采取以下清理步骤：

1. 检查`~/.ssh/authorized_keys`，移除所有标记为「svc-telemetry」的公钥
2. 检查SSH配置文件`~/.ssh/config`，移除异常的Host条目
3. 重启SSH守护进程，验证无异常监听端口
4. 更换受影响主机上的所有SSH密钥

但如果该主机用于企业环境、持有生产凭证、或曾被用于访问核心仓库，「重建主机」是唯一可信的选项。原因很简单：攻击者可能在初始化脚本执行期间已将内存中的凭证转储到外部，本地清理无法验证是否已发生。



![程序员系列表情：你别急，等我剪完这个头发再修Bug](https://iili.io/CumEMP9.png)
> 重装系统是最后一道防线



### 插件生态信任模型的根本问题

这起事件暴露了AI编程工具生态的一个根本矛盾：用户信任的是Anthropic的品牌，但实际安装的是经过Cursor市场审核的包。品牌方与分发渠道的信任边界并不重合。

在X平台上，用户@indie_alx追问了一个关键问题：「一个被修改的构建版本，究竟是如何以官方Anthropic名义发布的？」这个问题至今没有完整答案。可能的路径包括：发布权限的账户凭证泄露、市场审核流程的绕过、或第三方开发者账户被劫持。

对团队而言，今天可以做的三件事：

1. 立即检查团队中所有使用Cursor或VS Code + Claude Code扩展的主机，确认版本号是否为2.1.313或更低
2. 对涉及生产环境的主机执行重建，而非仅清理SSH配置
3. 审查团队GitHub凭证的分发权限，排查是否存在类似TanStack攻击的供应链传播路径

当AI编程助手变成了攻击入口，我们信任的不是代码质量，而是分发渠道本身。而分发渠道的信任链，恰好是这次事件中最脆弱的一环。

## 五、信任的重建：当AI编程助手变成了攻击入口

这次事件的核心问题不是技术漏洞，而是信任结构的错位。开发者信任Anthropic的品牌，信任Cursor市场的审核机制，信任「官方插件」这个标签。攻击者利用的正是这种信任链。



![程序员 reaction：为仕么是我](https://iili.io/CA7Vbxp.png)
> 真相锁定：发布权限 vs 官方系统



Cursor市场有自己的发布权限体系，与Anthropic的官方发布系统是分离的。攻击者没有入侵Anthropic的内部系统，而是获得了Cursor市场的发布权限。这两个系统的边界，就是这次攻击的入口。

Nx Console和ETHcode的遭遇说明了同一件事：供应链攻击的路径正在被批量复制。攻击者不再需要直接入侵官方系统，只需要找到一个信任度足够高的分发渠道，就能触达大量用户。

### 分发渠道信任 vs 代码质量信任

传统软件工程中，开发者信任代码质量本身——通过代码审查、测试覆盖、签名验证来建立信任。AI编程助手的场景改变了这个结构：用户安装扩展时，信任的是分发渠道，而不是对代码本身的验证。

这种信任结构有一个明确的代价：一旦分发渠道被渗透，信任链条会整体断裂。开发者需要意识到这一点，并建立自己的验证机制。

### 每个项目该做的两件事

第一，建立扩展安装的审计清单。记录每个扩展的来源、版本、安装时间，定期对照官方渠道进行校验。这不是为了增加工作量，而是为了在事件发生时能快速定位影响范围。

第二，对SSH密钥等敏感资产设置独立的管理流程。不要把开发环境的认证凭据与日常开发工具放在同一个信任域内。攻击者通过扩展拿到SSH密钥，下一步可能是横向移动到生产服务器。把这个边界切断，能显著降低单次漏洞的影响面。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> 每一次扩展更新，都是一次信任投票



更狠的是，这种信任结构的重建成本，远高于一次简单的扩展更新。开发者需要在便利和安全之间做出取舍，而这个取舍的标准，正在被一系列类似事件重新定义。

这次事件的落点很明确：在扩展生态高度集中的平台，用户的安全边界取决于平台的治理水平，而不是自己对代码的理解。

今天的动作很简单：检查版本、检查SSH、检查进程。如果发现异常，不要试图清理，重建主机是最干净的选择。后续我会持续关注Anthropic和Cursor在这件事上的技术复盘，以及扩展市场的治理机制是否会有实质性调整。

## 参考文献
- Cursor官方安全公告: https://x.com/cursor_ai/status/2116074289053175808
- Reuters报道: https://www.reuters.com/business/media-telecom/cursor-says-up-to-5000-users-affected-by-tampered-claude-code-extension-2026-10-30
- StepSecurity技术分析: https://www.helpnetsecurity.com/2026/10/30/claude-code-extension-ssh-backdoor
- OpenSourceMalware报告: https://starmap.dbappsecurity.com.cn/info/16820
- CellCog安全建议: https://cellcog.ai/blog/claude-code-extension-backdoor
- Nx Console供应链攻击公告(CVE-2026-48027): https://www.ithome.com.tw/news/[REDACTED]
你打开Cursor，等加载完插件，背后可能已经有人拿着你的SSH key在监听你了。
版本2.1.313的Claude Code扩展，在被安装后的首次初始化阶段，就触发了那66行JavaScript代码。不需要开发者打开对话窗口，不需要确认权限，扩展一加载完，脚本就开始跑。


![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> 真相锁定


### 信息收集阶段
第一步是悄悄爬取你的主机指纹。脚本读取host name、当前用户名、环境变量、Git配置里的邮箱地址，再加上一次主动请求拿公网IP——这五样信息足够攻击者定位你是谁、你在哪个网络、以及你能否被反向连接。整个过程没有弹窗，没有日志提示，IDE的状态栏也不会多一行警告。
### SSH后门植入
第二步更直接。脚本在你电脑上的~/.ssh/authorized_keys文件末尾追加一行公钥，标签是"svc-telemetry"。这个词看起来像某个合规的服务账号标识，目的是让这行注入在人工审计时被忽略。攻击者的公钥一旦进入授权列表，就具备了免密登录你机器的能力。


![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> 终端命令流


### 持久化尝试
有了公钥还不够。脚本接下来尝试在本机启动SSH守护进程，并建立一条反向隧道，目标是把内网机器暴露到攻击者的远程控制节点上。这意味着即使用户卸载了这个恶意扩展，残留的authorized_keys条目仍然有效——更狠的是，这比重新安装一个干净版扩展更难发现。
> "重建主机比假设清除残留文件更可靠"——安全星图平台在事件报告中的原话，也是对所有"我卸载了就安全了"的开发者最直接的提醒。
### 分发路径：为何官方名义也会被寄生
问题不在Anthropic的系统，而在Cursor市场的发布权限。攻击者不需要入侵Anthropic的代码仓库，也不需要伪造签名——他们只需要混进Cursor Marketplace的审核流程，把一个名字看起来官方、版本号紧跟着真实发布的包提交上去。2.1.313这个版本号，刻意贴近官方2.1.312，让许多依赖自动更新的开发者根本不会察觉差异。
这才是这次事件真正的机制层面教训：当AI编程助手变成了攻击入口，我们信任的不是代码质量，而是分发渠道本身。
- 安全星图平台：恶意Claude Code扩展在Cursor市场植入SSH后门 - https://starmap.dbappsecurity.com.cn/info/16820
- Reuters：Cursor says up to 5,000 users affected by tampered Claude Code extension - https://www.reuters.com/business/media-telecom/cursor-says-up-to-5000-users-affected-by-tampered-claude-code-extension-2026-10-30
- Help Net Security：Claude Code extension poisoned with persistent SSH backdoor - https://www.helpnetsecurity.com/2026/10/30/claude-code-extension-ssh-backdoor
- The Hacker News：Official Claude Code VS Code Extension Compromised to Install Persistent SSH Backdoor - https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html
- DEV Community：A Trojanized Claude Code Extension Hit Up to 5,000 Cursor Users - https://dev.to/lycore/a-trojanized-claude-code-extension-hit-up-to-5000-cursor-users-what-happened-and-a-15-minute-236e
- iThome：Nx Console的VS Code延伸套件被植入窃资软件 - https://www.ithome.com.tw/news/[REDACTED]
- CellCog：Claude Code Extension Backdoored on Open VSX - https://cellcog.ai/blog/claude-code-extension-backdoor

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
