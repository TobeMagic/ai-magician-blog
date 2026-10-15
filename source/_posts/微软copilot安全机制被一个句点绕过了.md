---
title: "微软Copilot安全机制被一个「句点」绕过了"
date: "2026-10-15 05:16:21"
updated: "2026-10-15 05:23:56"
permalink: "posts/2026/10/15/微软copilot安全机制被一个句点绕过了/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/15/微软copilot安全机制被一个句点绕过了/"
article_id: "e1ee400c-c991-44aa-9f31-82a88c485b39"
description: "CVE-2026-103572是一个CVSS评分8.8的远程代码执行漏洞，影响Visual Studio Copilot和SSMS。微软研究员Johann Rehberger发现，Windows会自动截断文件名末尾的点号——这一系统特性本用于兼容旧版短文件名，却被Copilot的安全检查逻辑忽略。攻击者通过精心构造的prompt injection，可以让Copilot将恶意配置写入受保护的settings.json，实现远程代码执行。微软已于2026年10月Patch Tuesday发布修复，但整个攻击链揭示了一个更深层的问题：AI辅助工具的安全边界正在被重新定义。"
cover: "/var/lib/aimagician/artifacts/covers/e1ee400c-c991-44aa-9f31-82a88c485b39/124fb7f6-ecba-41ea-afbf-9ff4d2f1a4e3/cover.png"
imgTop: false
---

## 一个句点引发的远程代码执行

微软安全研究员Johann Rehberger在X上发了一条配图的推文——代码看起来没问题，他问「这有什么毛病？

CVE-2026-103572的严重程度标注为「严重」，影响的是微软Visual Studio Copilot和SQL Server Management Studio（SSMS）。表面上看，是一个安全功能被绕过。深挖之后发现，问题的根源不在AI，而在Windows本身。

### Windows路径解析的古老陷阱



![程序员 reaction：柯南00032 ooo无语](https://iili.io/nhIlehN.png)
> 这个坑埋了几十年



Windows在解析路径时会静默截断文件名末尾的点号。这是一个遗留自DOS时代的兼容性特性——旧版短文件名规范不允许以点号结尾，所以Windows内核层一直在做这件事，不需要应用层感知。

问题在于，系统文件层在写入文件时做了截断，而应用层在检查路径时没有做同样的处理。两层行为不一致，给了漏洞可乘之机。

具体来说，当Copilot尝试往`C:\Users\xxx\.vscode\settings.json.`写入配置时，安全检查会认为目标路径带有点号后缀，不是合法的配置文件路径，从而放行。但Windows真正执行写入时，点号被截断，最终落盘的路径就是`settings.json`——一个被严格保护的配置文件。

![被要求再改一次这个 bug 时死守阵地的表情](https://iili.io/C1zuZrJ.png)
> 安全检查以为在写A，实际写的是B



更准确地说，这是CWE-94的一个经典变体：代码生成控制不当。只不过这里「生成代码」的媒介不是传统意义上的脚本，而是Copilot生成的settings.json内容，最终通过VSCode配置执行体系落地。

### Copilot安全检查为何被绕过



![程序员 reaction：柯南00089 找到你了](https://iili.io/CCZubTX.png)
> 两个系统的理解不一致



Copilot的安全机制对settings.json这类敏感文件有一个拦截规则：当Copilot检测到目标文件路径属于受保护配置时，会阻止写入操作。但这条规则的实现，依赖的是Copilot自身对路径字符串的判断，而不是调取Windows文件系统API做一次真实解析。

这意味着：安全检查看到的是`settings.json.`，认为它不在白名单内，于是放行。真正的写入操作由Windows完成，路径被截断后变成`settings.json`，落盘成功。

最危险的漏洞往往不是代码写错了，而是两个系统对同一件事的理解不一样。这里两个系统是：Copilot的安全检查层，和Windows的路径解析层。它们各自都「正确」，但它们对「同一个文件路径」的判断结果不同。

![程序员系列表情：你从我脸上看到了什么](https://iili.io/nlCYpe9.png)
> 系统集成中最难的一类bug



这个问题本质上是一个跨层边界的一致性问题。安全检查层假设路径字符串等于文件系统实际操作的目标路径，但Windows内核层面的静默截断打破了这个假设。

### 从prompt injection到命令执行的完整链路

攻击链条并不复杂。攻击者通过一个精心构造的prompt，诱导Copilot在生成项目配置时，将恶意的settings.json内容写入一条看似无害的路径。

更准确地说，攻击者需要两步。第一步是利用LLM的输出内容，让Copilot生成一段包含特定路径的JSON配置，其中目标文件路径包含末尾点号。第二步是利用Windows的静默截断行为，让这个路径在实际写入时避开安全检查，直接覆盖`settings.json`。

一旦settings.json被修改，攻击者可以注入自定义的task定义或代码执行指令。在Visual Studio和SSMS中，settings.json被某些插件和执行框架读取，因此恶意配置会随后续操作被加载执行，实现远程代码执行。

``mermaid


![CVE-2026-103572攻击链路](https://iili.io/nhIlLj2.png)
> CVE-2026-103572攻击链路



这段链路里没有复杂的exploit技巧，没有内存破坏，也没有零日漏洞。它的核心就是：Windows的行为一致性，被Copilot的假设打破。

### 影响范围与修复现状

受影响的版本包括Visual Studio 2022及SSMS的相关版本，具体以微软2026年10月Patch Tuesday发布的更新为准。微软将此事评级为「重要」（Important），但CVSS评分为8.8，说明其实际危害程度已经接近高危。

根据Rehberger在X上的披露时间线，他在2026年8月4日向微软报告了路径绕过问题，8月30日跟进确认，微软于9月16日正式确认漏洞存在，最终在10月13日的Patch Tuesday中发布修复补丁。微软给出了$0的赏金——这一点Rehberger自己在文章中也没有隐瞒。

漏洞的修复方向是将安全检查层的路径标准化逻辑与Windows内核层保持一致。具体实现是：安全检查在判断路径是否在受保护列表中之前，先调用与操作系统相同的规范化函数，确保路径字符串与实际文件路径一致后再做匹配。

Windows用了几十年的兼容性特性，反而成了AI工具安全检查的盲区。这个教训比修复本身更值得记录。

问题出在一个句点上。

## Windows路径解析的古老陷阱

Windows的尾部点号截断不是新特性，而是从DOS时代延续下来的兼容性包袱。在早期文件系统中，文件名不能以点号结尾——这会导致与短文件名表示产生歧义。因此Windows内核在打开或创建文件时，会静默去掉末尾的所有点号。这一行为对所有应用程序透明，意味着无论你是用CreateFile、_wfopen还是.NET的File.Open，结果都一样。

但Copilot的安全检查发生在更高层——它在调用文件系统API之前，先对用户请求的路径做了一次白名单校验。检查逻辑只看到了"settings.json."，而这个路径不在被允许写入的配置文件中。于是检查通过，调用落地，Windows自动截断了点号，最终写入的是受保护的"settings.json"。

安全检查站在用户请求的层面，文件系统站在内核层面，中间缺少了一次「实际写入路径还原」的环节。



![Copilot安全检查路径 vs 文件系统实际路径](https://iili.io/nhI0dTQ.png)
> Copilot安全检查路径 vs 文件系统实际路径



## Copilot安全检查为何被绕过

从 CWE 分类来看，CVE-2026-103572属于 CWE-94（代码注入），但更准确地说，这是一个路径规范化缺失导致的安全特性绕过。Copilot 的内置安全检查有一个白名单机制——它允许写入用户项目目录下的配置文件，但明确禁止写入受保护的 settings.json 等系统级配置文件。

这个白名单的逻辑是：检查用户请求的目标路径字符串是否匹配白名单条目。问题在于，检查时用的字符串是用户请求的原始字符串，而文件系统实际写入的路径是经过 Windows 处理后得到的结果。两者之间存在一个"语义鸿沟"——Copilot 认为自己在阻止用户写入受保护路径，但 Windows 帮用户改写了路径，让检查失效。

微软研究员 Johann Rehberger 在发现这个问题后，通过精心构造的 prompt injection 完成了整个攻击链：诱导 Copilot 认为写入操作是安全的，触发路径截断，最终实现任意配置写入。

## 从 prompt injection 到命令执行的完整链路

攻击链的每一步都不复杂，组合起来却致命：

第一步，攻击者在用户可见的上下文（如 PR 描述、issue 评论、或嵌入的代码注释）中植入恶意 prompt。这一步不需要任何特殊权限，只要用户查看被污染的内容即可触发。

第二步，Copilot 读取上下文后，根据用户的编码意图生成写入配置的 suggestion。由于 prompt injection 的设计，Copilot 会认为这是一个合法的操作请求。此时安全检查看到的路径是带有尾部点号的版本，白名单校验通过。

第三步，Copilot 调用文件系统 API 写入文件。Windows 截断点号后，实际写入的是受保护路径。恶意配置内容被持久化到 settings.json。

第四步，后续 Copilot 或相关工具读取这个被篡改的配置，触发命令执行。具体执行什么命令取决于攻击者写入的内容——可以是 MCP server 指向恶意端点，可以是 extension 配置指向恶意插件，也可以是任何被 Copilot 读取并执行的配置项。



![完整攻击链](https://iili.io/nhI076X.png)
> 完整攻击链



## 影响范围与修复现状

该漏洞影响 Visual Studio Copilot 和 SQL Server Management Studio（SSMS）。微软将其严重性定为 Important（而非 Critical），CVSS 评分 8.8。这个定级可能反映了微软认为需要用户交互这一限制条件，但从攻击链来看，一旦 prompt injection 成功，用户只需正常使用工具就会触发。

微软已在 2026 年 10 月的 Patch Tuesday 更新中发布修复。Johann Rehberger 于 2026 年 8 月向微软报告，10 月 11 日获得 $0 漏洞赏金，10 月 13 日公开了技术细节和 PoC。

## AI辅助工具的安全边界问题

CVE-2026-103572 揭示的问题不局限于 Copilot 这一个产品。它的本质是：当一个 agent 获得了文件写入权限，安全检查应该覆盖 agent 的实际行为结果，而不仅仅是它的输入意图。

更广泛地说，AI 辅助工具的安全边界正在被重新定义。传统的软件安全模型假设攻击者需要主动利用漏洞——输入恶意 payload、触发特定的代码路径。但 agent 化工具引入了一个新的攻击面：攻击者不需要直接触发漏洞，只需要在 agent 可见的上下文中埋入一条看似无害的指令，让 agent 自己"理解"并"执行"恶意操作。

这意味着安全边界从"输入验证"扩展到了"上下文信任"。你的 PR 描述、issue 评论、甚至是代码注释中的文本，都可能成为攻击向量——只要 agent 能看到它并据此采取行动。

从防御角度看，开发者需要在三个层面加固：第一，安全检查应通过实际文件系统 API 查询最终路径，而非仅验证用户请求的字符串；第二，AI agent 工具应沙箱隔离，限制其对生产环境配置文件的访问；第三，对 agent 的写入行为建立审计日志，发现异常即阻断。

微软将 Copilot 的安全定级为 Important 而非 Critical，这个判断值得推敲。CVSS 8.8 的分值说明影响确实严重，但 Important 可能暗示微软认为需要特定条件才能利用。实话说，当一个"需要用户交互"的漏洞可以通过污染 GitHub PR 描述来远程触发时，这个定级是否保守了？

目前可执行的动作是：立即升级受影响的 Visual Studio 和 SSMS 版本；审查项目中是否有 AI agent 工具对配置文件的写入行为，评估是否存在类似的路径截断绕过风险；建立 agent 工具的写入审计机制，记录每次写入的实际目标路径而非请求路径。

## 参考文献
- [Visual Studio Copilot and SSMS Remote Code Execution (CVE-2026-103572) · Embrace The Red](https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution)
- [CVE-2026-103572: Visual Studio Copilot RCE Disclosed](https://securityonline.info/cve-2026-103572-visual-studio-copilot-rce-disclosed)
- [Johann Rehberger on X: "What's wrong with this code in Visual Studio Copilot?"](https://x.com/wunderwuzzi23/status/2110152409523851650)
- [Visual Studio 2022 version 17.14 Release Notes | Microsoft Learn](https://learn.microsoft.com/en-us/visualstudio/releases/2022/release-notes)
- [CVE-2026-103572 · Windows Forum](https://windowsforum.com/news/cve-2026-103572-visual-studio-tools-for-applications-and-sql-server-management-studio-remote-code-execution-vulnerability.[REDACTED])

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
