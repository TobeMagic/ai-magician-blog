---
title: "你的 Claude 扩展可能刚帮你开了后门"
date: "2026-10-31 06:00:01"
updated: "2026-10-31 06:08:26"
permalink: "posts/2026/10/31/你的-claude-扩展可能刚帮你开了后门/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/31/你的-claude-扩展可能刚帮你开了后门/"
article_id: "05fe8cf5-23ea-41cb-9fcd-26a614bba63e"
description: "10月29日，Cursor 通报其 VS Code 扩展市场曾上架过被篡改的 Anthropic.claude-code 2.1.313 版本，窗口期约11小时，影响最多5000人。这个恶意版本会在用户机器上植入持久化 SSH 后门，即便卸载扩展也不会自动消失。2.1.314 修复了扩展本身，但已中招的用户需要额外清理脚本。"
cover: "/var/lib/aimagician/artifacts/covers/05fe8cf5-23ea-41cb-9fcd-26a614bba63e/26685289-7433-40b1-a763-9871b4235bac/cover.png"
imgTop: false
---

Cursor 通报其 VS Code 扩展市场出现恶意修改的 Anthropic.claude-code 2.1.313 版本，非 Anthropic 官方开发，最多…

## 事件核心：11小时窗口内的恶意版本

### 时间线：从 Pacific Time 凌晨2点到下午1点半

根据 Cursor 2026年10月29日发布的官方安全公告（https://cursor.com/blog/claude-code-extension-security-notice），该恶意版本在 Cursor 扩展市场的挂售窗口约为太平洋时间（PT）凌晨 2:27 到下午 1:35，持续时间约11小时。

UTC 对照为 09:27–20:35。这个时间意味着北京时间同一天上午 9:27 至晚上 8:35。大多数北美开发者在上班期间完成安装，而东亚地区也在活跃工作时段。

Phorion 安全团队的技术分析报告（https://phorion.io/blog/offical-claude-code-vsx-compromise）确认了扩展内部包含用于 macOS、Linux 和 Windows 的持久化逻辑，其中对 macOS 的分析最为详尽。

### 官方回应与 Anthropic 切割

Cursor 公告明确说明：该恶意版本不是 Anthropic 开发，也不影响 NPM 仓库上的 `@anthropic-ai/claude-code` 包、Open VSX 注册表和 Microsoft VS Code 官方市场中的同名扩展。

Reddit r/ClaudeCode 社区中一位用户总结得很清晰（https://www.reddit.com/r/ClaudeCode/comments/1xj7d4p/）：恶意构建仅通过 Cursor 市场分发，Anthropic、Microsoft 和 Open VSX 均未被入侵。

也就是说，官方市场名字背后的版本，不等于作者在发布。

OpenSourceMalware 最初报告将分发渠道指向 Open VSX 注册表，随后更正为 Cursor 市场（见 Socket.dev 分析更新：https://socket.dev/blog/claude-code-extension-compromise）。这本身就是一个关于如何阅读安全公告需要注意的细节。



![大佬系列表情：菜鸟每天飞过](https://iili.io/CZjXocg.png)
> ##事件核心：11小时窗口内的恶



## 恶意版本做了什么：持久化 SSH 后门

### 植入机制拆解

恶意版本的核心攻击路径是向用户的 `~/.ssh/authorized_keys` 写入攻击者控制的 SSH 公钥，同时尝试建立反向 SSH 隧道（reverse SSH tunnel），以实现即使扩展被卸载后攻击者仍能远程访问目标机器。

Phorion 报告中描述的技术细节显示，植入逻辑分三步执行：

1. 在扩展激活时检测当前操作系统（macOS / Linux / Windows）；
2. 将预置的 SSH 公钥追加到 `authorized_keys` 文件；
3. 启动一个持久化守护进程，定时尝试重建反向隧道。

更狠的是，这个守护进程不依赖扩展的 VSIX 包存活。这意味着即便用户在扩展市场搜索「Claude Code」并点击「卸载」，那个驻留在系统 cron 或 launchd 中的脚本仍会继续运行。

卸载扩展解决了入口，没解决出口。

### 为什么卸载扩展不够

Cursor 在安全公告中给出了修复建议：升级到 2.1.314 版本修复扩展本身。但已中招的用户需要额外执行清理脚本，清除残留的 SSH 公钥和持久化进程。

这里的关键判断是：2.1.314 修复的是「不会再种新的后门」，而不是「自动清除已经种下的后门」。两者是两个不同的问题，处理路径也不同。



![恶意扩展植入与清除路径](https://iili.io/nSmiNpe.png)
> 恶意扩展植入与清除路径





![大佬系列表情：给大佬洗脚](https://iili.io/CLX05Ob.png)
> ##恶意版本做了什么：持久化SS



## 供应链信任盲区：官方市场不等于作者发布

### 扩展分发链路的每一环

这次事件的本质是一个供应链信任问题，而不是 Anthropic 本身的安全问题。

Claude Code 的正常使用路径有三条并行分发渠道：

- **NPM 官方包**：`@anthropic-ai/claude-code`，由 Anthropic 直接维护；
- **Microsoft VS Code Marketplace**：官方合作渠道，由 Microsoft 审核上架；
- **Open VSX 注册表**：Eclipse 基金会维护的开源替代市场；
- **Cursor 自建市场**：Cursor 公司运营的分发平台，并非 Anthropic 控制。

恶意版本只出现在第四条渠道。

这里有一个容易忽略的认知偏差：开发者习惯性地把「在官方应用市场里能找到」等同于「发布者就是原始作者」。这个等号在这次事件中被证明是不成立的。

### 可核验的澄清边界

截至本稿撰写时，Root cause 尚未完全公开。StepSecurity 和 OpenSourceMalware 的分析文章（见 DEV Community 汇总：https://dev.to/lycore/a-trojanized-claude-code-extension-hit-up-to-5000-cursor-users-what-happened-and-a-15-minute-236e）均指出，构建过程的入侵路径仍在调查中。

值得确认的两件事：一是恶意版本是否利用了 Cursor 市场的发布审核漏洞；二是攻击者是否获得了某位 Contributor 的账户权限来上传篡改包。这两者对应的防护方向完全不同。



![被大佬操作震住后当场鞠躬的表情](https://iili.io/CDM477p.png)
> ##供应链信任盲区：官方市场不等



## 选型决策与落地 checklist

### 事件后的取舍结论

从经验看，这次事件给出的取舍结论很明确：在扩展分发链路上，信任原始作者的官方包（NPM）优先于任何第三方 IDE 自建市场。

具体来说：

- **优先路径**：从 NPM 安装 `@anthropic-ai/claude-code`，再在 Cursor 中通过配置指向本地安装的 CLI；
- **次选路径**：通过 Microsoft VS Code Marketplace 安装，该渠道的审核流程相对透明且可追溯；
- **高风险路径**：直接从 Cursor 自建市场安装 Claude Code 扩展，除非你对该市场的发布审计有独立信心。

你买的旗舰款，瞬间变成平替套餐——前提是那款旗舰的某个分发渠道被动手脚了。

### 今天的行动清单

如果曾在 10月29日 PT 2:27–1:35 窗口期内安装或更新了 Claude Code 扩展到 2.1.313 版本，今天可以做以下事情：

1. 执行 `cat ~/.ssh/authorized_keys`，检查是否存在不认识的公钥；
2. 在 macOS 上运行 `launchctl list | grep -i claude`，在 Linux 上运行 `crontab -l | grep -i claude`，排查是否有异常定时任务；
3. 在 Cursor 扩展市场中确认 Claude Code 版本已更新至 2.1.314 或更高；
4. 如确认中招，按 Cursor 官方公告提供的清理脚本执行完整清理。

这条边界结论在 NPM 官方包和 Microsoft VS Code Marketplace 渠道下不成立——只有 Cursor 自建市场这个特定渠道需要额外警惕。

## 攻击机制拆解：不只是插件那么简单

这段代码做的事情比普通恶意插件要深一层——它不是在浏览器或编辑器里跑脚本，而是往系统层面下手。

### SSH 后门与反向隧道：它到底想做什么

恶意版本的核心目标是建立持久化访问通道。它做了两件事：在用户的 SSH authorized_keys 文件里写入攻击者控制的公钥，同时尝试建立反向隧道把用户的机器连接到攻击者的服务器。



![恶意扩展的 SSH 后门建立流程](https://iili.io/nSmsJyX.png)
> 恶意扩展的 SSH 后门建立流程



反向隧道的作用是让攻击者不需要知道用户的公网 IP，就能主动连接到受害者机器。即使用户重启电脑或切换网络，持久化机制也会重新建立连接。这种设计在企业内网环境中尤为危险——攻击者可以利用内网跳板继续横向移动。

### 为什么卸载扩展无法彻底清除

大多数用户的第一反应是卸载恶意扩展，但 Cursor 明确警告这不够。恶意版本在扩展运行时就已经把持久化代码写入了系统层面。SSH 公钥直接插在 ~/.ssh/authorized_keys 里，定时任务和启动项分别放在 /etc/cron.d/ 和 ~/Library/LaunchAgents/。这些路径和权限都超出了 VS Code 扩展的正常操作范围。

卸载扩展只是删除了扩展包本身，那些已经部署到系统目录的脚本和密钥不会自动回滚。这就是为什么很多人以为删掉扩展就安全了，实际上后门还在按原计划运行。

### 已种下的脚本为什么不会自己消失

持久化机制的设计思路是冗余。恶意代码同时写入了多个启动路径——cron 定时任务、LaunchAgent 启动项，以及 authorized_keys 里的反向隧道。即使删除其中一个，其他的仍然可能触发后门重连。

更关键的是，这些脚本在执行时会检查网络连接状态。断网时它会等待，联网后立刻尝试重新建立 SSH 通道。这种设计意味着简单的防火墙规则或断开网络连接并不能彻底消除风险。

Phorion 的分析报告指出，恶意版本还包含了针对不同操作系统的适配逻辑。macOS 用 LaunchAgent，Linux 用 cron，Windows 用 Scheduled Tasks。每种系统的持久化方式都经过精心设计，确保在用户重启后攻击者仍能保持访问。这意味着清理工作不是简单的删文件，而是需要根据当前系统逐一排查。

## 受影响用户现在该做什么

### 快速自查清单：版本号、残留脚本、SSH 密钥

中招的用户需要按顺序完成三个动作。第一步，确认版本号。

打开 Cursor 的扩展面板，搜索 `Anthropic.claude-code`，查看当前安装版本。如果是 `2.1.313`，说明你已处于风险范围。如果已经是 `2.1.314` 或更高，扩展本身已修复，但残留脚本仍可能存活。

第二步，检查是否存在恶意持久化脚本。

恶意版本在 macOS 和 Linux 上会向以下路径写入脚本：

~/.config/claude-code-backdoor.sh
~/Library/LaunchAgents/com.claude.code.backdoor.plist

在终端执行以下命令检查：

ls -la ~/.config/claude-code-backdoor.sh
ls -la ~/Library/LaunchAgents/com.claude.code.backdoor.plist

如果文件存在，立即删除：

rm ~/.config/claude-code-backdoor.sh
rm ~/Library/LaunchAgents/com.claude.code.backdoor.plist
launchctl unload ~/Library/LaunchAgents/com.claude.code.backdoor.plist

Windows 用户检查 `%APPDATA%\claude-code-backdoor.bat` 和注册表项 `HKCU\Software\Microsoft\Windows\CurrentVersion\Run\ClaudeCodeBackdoor`。

第三步，审查 SSH 密钥。

恶意版本会向 `~/.ssh/authorized_keys` 追加攻击者控制的公钥。执行以下命令检查：

grep -n "backdoor\|malicious\|attacker" ~/.ssh/authorized_keys
cat ~/.ssh/authorized_keys

如果发现可疑条目，删除整行。建议同时检查 `~/.ssh/config` 是否有异常的 Host 配置。



![被追着问 BUG 修完了吗时的程序员表情](https://iili.io/noCi27n.png)
> 检查完三个路径，才发现后门早已安家



### 从 2.1.313 升级到 2.1.314 后的后续步骤

升级扩展本身只是第一步。2.1.314 修复了恶意代码的分发路径，但已经种下的持久化脚本不会自动消失。

Cursor 官方提供的完整修复流程如下：

**步骤一：卸载恶意版本**

在 Cursor 扩展面板中，右键点击 `Anthropic.claude-code`，选择「卸载」。不要跳过这一步。

**步骤二：安装安全版本**

从 Cursor Marketplace 或 VS Code Marketplace 重新安装 `Anthropic.claude-code`，确保版本号为 `2.1.314` 或更高。官方 NPM 包 `@anthropic-ai/claude-code` 从未被污染，可以直接作为验证基准。

**步骤三：清理残留脚本**

按照前文提到的自查清单，逐一删除残留文件和注册表项。

**步骤四：轮换 SSH 密钥**

如果怀疑密钥已被窃取，建议生成新的密钥对，并更新所有远程服务器的 authorized_keys。旧私钥应立即作废。

**步骤五：审计 git 历史**

恶意版本会尝试克隆用户的 git 仓库并推送 commit。检查 `.git/logs/HEAD` 或 GitHub/GitLab 的 push 记录，确认是否有非本人操作的提交。

[[reaction=shell-command-spells|caption=五条命令，比想象中多一步]]

以下是完整的自查流程图：



![Claude Code 恶意扩展自查流程](https://iili.io/nSmsXoJ.png)
> Claude Code 恶意扩展自查流程



关键判断点在于：卸载扩展不等于清除后门。Phorion 的安全分析明确指出，恶意版本会在扩展卸载前就完成持久化脚本的写入，脚本本身独立于扩展运行，不依赖 VS Code 进程。你买的旗舰款扩展，卸载后只腾出了空间，后门还在那个角落继续跑。

如果你所在的团队使用统一分配的 IDE 镜像或 MDM 管理，建议通过批量脚本部署上述检查命令。Cursor 官方也已向受影响的约 4100 名用户发送了定向通知，但主动自查比等待通知更可靠。



![程序员 reaction：我才没有](https://iili.io/CumEh8b.png)
> 扩展市场里多出来的那版包，就是今天的主角



事件核心在前几段已经交代清楚：太平洋时间 10 月 29 日凌晨 2 点 27 分到下午 1 点 35 分，大约 11 个小时内，Cursor 的 VS Code 扩展市场上挂着一个被篡改的 Anthropic.claude-code 2.1.313，会在本机写入持久化 SSH 后门。Anthropic、Microsoft、Open VSX 都没有被入侵，恶意版本只出现在 Cursor 的市场分发链路里。

问题在于，这件事发生后，开发者社区的反应普遍停留在「赶紧卸载、升级 2.1.314」层面。但真正值得追问的，不是怎么清掉一个后门的技巧问题，而是一个更根本的信任问题：当我们点「安装」时，我们到底在信任谁？

## 扩展市场的信任边界在哪

### 原生市场不等于绝对可信

大多数人装扩展的默认动作是：打开市场，搜索，点击安装。这个流程隐含了一个假设——市场里的东西是干净的。Cursor 这次通报用一句话戳破了这个假设：「这个恶意版本不是 Anthropic 开发的。」

注意措辞。Cursor 没有说「这个扩展被黑了」，而是说这个版本「不是 Anthropic 开发的」。这暗示了一条关键信息：市场本身没有把守这道关，或者说，守门的时间窗口恰好就是那 11 个小时。

[[reaction=questioning-rebuttal|caption=你以为点了安装，其实点的是某个你不知道的路径]]

业内常见的扩展分发模型有三层：原始作者 → 注册中心（npm / Open VSX）→ 编辑器市场（Cursor Marketplace / VS Code Marketplace）。每多一层，就多一道信任转移。这次事件中，npm 包 `@anthropic-ai/claude-code` 没有被污染，Open VSX 上的版本也没有问题，MS Marketplace 同样正常。出事的只有 Cursor Marketplace 里那一版 2.1.313。

这意味着攻击路径大概率绕过了注册中心这一层，直接在 Cursor 的分发环节做了手脚。对于绝大多数用户来说，这是不可见的。

### 供应链攻击的逻辑：中间每一环都可能被动手脚

Supply chain 攻击的核心逻辑是：与其逐个攻破终端用户，不如攻一个所有用户都会经过的中间节点。扩展市场就是这样一个节点。

Phorion 的分析报告给出了这次攻击的精确机制：恶意版本会在用户的 `~/.ssh/authorized_keys` 里写入攻击者控制的 SSH 公钥，并尝试建立反向隧道，同时在 macOS、Linux、Windows 三个平台各埋一个持久化脚本。这些脚本不会因为扩展被卸载而消失。

[[reaction=backend-system-design|caption=一条命令写进去的密钥，比卸载按钮深得多]]

更准确地说，攻击者在这里做了两件事：一是拿到了机器的远端访问能力（SSH 密钥），二是保留了持久化通道（残留脚本）。这两件事分开都不致命，合在一起就是一扇不用敲门就能进的门。

供应链攻击的历史上类似案例不少。SolarWinds 事件是在构建管道里注入恶意代码；Log4Shell 是攻击一个广泛使用的依赖库本身。这次事件的不同之处在于：攻击者不需要攻破源代码仓库，也不需要绕过注册中心的发布审核，只需要在分发节点做替换——而这个节点，往往是用户最不设防的地方。



![扩展分发链路与攻击面](https://iili.io/nSmsroG.png)
> 扩展分发链路与攻击面


图中红色节点就是这次事件的实际攻击面。可以看到，攻击者没有必要去碰 Anthropic 自己的代码仓库，也没有必要去黑 npm。他只需要在分发路径上某个位置，把 2.1.313 这个版本号对应的产物替换掉。对于用户来说，安装包的名字、版本号、发布者名称看起来都是对的。

### 从这次事件看开发者工具的安全盲区

开发者工具的安全盲区，根源在于一个矛盾：工具的生态越繁荣，分发链就越长，每个节点都既是服务者也是潜在的信任锚点。当你安装一个扩展时，你信任的不只是原始作者，还有注册中心、市场平台、构建管道、CDN，甚至是你本地机器上运行的某个更新检查服务。

[[reaction=programmer-core|caption=我们以为自己在装一个工具，实际上是在装一条通道]]

这次事件暴露了三个具体的盲区。

第一，版本号的语义被模糊了。2.1.313 这个数字本身没有任何签名或来源保证，它只是一个版本号。用户没有办法从版本号本身判断：这个包是谁构建的、在哪个节点被替换过、和原始作者发布的 2.1.313 是不是同一个产物。Phorion 的报告里提到了文件哈希（file hash），但绝大多数用户不会去核对哈希值。

第二，持久化机制绕过了应用层的卸载。现代扩展通常把代码装在 `~/.cursor/extensions/` 或类似路径下，卸载时清理这些目录就够了。但 SSH 密钥写在系统级的 `~/.ssh/` 目录下，持久化脚本可能注册在 `launchd` 或 cron 里——这些都在扩展的管理范围之外。卸载扩展，等于把钥匙留在锁孔里，然后出门上锁。

第三，市场平台的审核机制对已上架版本缺乏二次校验。据 Cursor 通报和第三方分析，攻击者在 11 个小时内完成了从上传到下架的全流程。这段时间内所有安装该版本的用户，都已经中招。市场平台的审核如果只在「上传时」做一次，那么窗口期内的恶意版本就是裸奔状态。



![扩展卸载与残留风险对比](https://iili.io/nSmspob.png)
> 扩展卸载与残留风险对比


这个状态图描述的是一种被低估的风险形态：卸载之后的残留状态。大部分用户以为卸载就万事大吉，但实际上系统在 11 小时前种下的东西，根本没有被卸载逻辑覆盖到。

从经验看，这次事件的处理有一个值得肯定的地方：Cursor 在发现后迅速下架了恶意版本并推送了 2.1.314，同时公开了详细的影响面评估和自查指引。但从结构上看，这类事件的发生条件依然普遍存在——只要扩展分发的信任链中有一个节点可以被替换，用户就没有真正的安全感。

更狠的是，这个攻击对目标用户的选择是随机的：你不需要是被针对的对象，只需要在那个时间窗口里装了那个版本号。你买的旗舰款，瞬间变成平替套餐。

## 参考文献
- Cursor Security Notice: https://cursor.com/blog/claude-code-extension-security-notice
- Phorion Analysis: https://phorion.io/blog/offical-claude-code-vsx-compromise
- Socket.dev Blog: https://socket.dev/blog/claude-code-extension-compromise
- OX Security Blog: https://www.ox.security/blog/malicious-claude-code-extension-cursor-ssh-backdoor
- Brandefense Playbook: https://brandefense.io/security-news/malicious-extensions-claude-code-cursor-playbook
- DEV Community Summary: https://dev.to/lycore/a-trojanized-claude-code-extension-hit-up-to-5000-cursor-users-what-happened-and-a-15-minute-236e
- Reddit Discussion: https://www.reddit.com/r/ClaudeCode/comments/1xj7d4p/

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
