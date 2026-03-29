---
layout: "post"
title: "既然 AI 敢翻你的代码，你就得敢看它的包：mitmproxy 调教 Claude Code 实战"
description: "面对 Claude Code 等 AI Agent 的黑盒操作，本文通过 mitmproxy 揭秘其底层通信逻辑。从证书替换原理到 Python 自动化脚本提取 Prompt，带你实战逆向 AI 的“心路历程”，重夺开发者对数字资产的控制权。"
tags:
  - "mitmproxy"
  - "Claude Code"
  - "API 逆向"
  - "AI Agent"
  - "抓包实战"
  - "网络安全"
  - "AI"
  - "Claude"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/03/29/既然-ai-敢翻你的代码你就得敢看它的包mitmproxy-调教-claude-code-实战/"
permalink: "posts/2026/03/29/既然-ai-敢翻你的代码你就得敢看它的包mitmproxy-调教-claude-code-实战/"
date: "2026-03-29 10:23:00"
updated: "2026-03-29 12:37:00"
---

Hello 大家好呀，我是计算机魔术师。今天想和你聊聊那个最近在终端里风卷残云的“新同事”——Claude Code。

2025 年 2 月的一个深夜，我盯着终端里疯狂跳动的光标，手心微微冒汗。

Claude Code 正在我的 `/src` 目录里翻箱倒柜，它像个不知疲倦的实习生，一边自言自语一边重构我的核心逻辑。

![程序员反应图：不要重构去复制](https://iili.io/qyszWn2.png)
> review 一多，灵魂先掉半格

我突然意识到，我根本不知道它把我的代码发给了谁，也不知道它在那些加密的 HTTPS 隧道里，到底带走了什么，又带回了什么。

这种感觉，就像是你请了个装修工，却被要求必须蒙上眼睛，任由他在你家里拆墙。信任是让渡，但盲目信任是自杀。当 AI 敢翻你的代码，你就得敢看它的包。

这件事和每个开发者都有关。随着 AI Agent 逐渐接管我们的生产环境，理解它们的边界，就是保护你自己的数字资产。

![面对明显不属于自己的锅时强硬拒绝的表情](https://iili.io/qyoGipR.png)
> 这锅先别急着往我头上扣

我们需要一把“单向玻璃”，能看透这些黑盒工具的心路历程，而这把钥匙，就是 mitmproxy。

![程序员系列表情：他说你 app 一点就崩](https://iili.io/qysILfS.png)
> 别问，问就是在看日志

## 既然 AI 敢翻你的代码，你就得敢看它的包

Claude Code 的运行逻辑其实很简单：它读取你的本地文件，结合你的指令，打包发给 Anthropic 的服务器，然后执行服务器返回的 shell 命令。

但问题在于，这个“打包”的过程是黑盒的。它有没有扫描你的 `.env` 文件？它有没有把你还没提交的私活代码也顺便“学习”了？

mitmproxy 不是用来搞破坏的，它是给加密隧道装上的“单向玻璃”。它能让你在不破坏 HTTPS 安全性的前提下，合法地监听、拦截甚至篡改这些流量。

在 AI 时代，这种能力不再是黑客的专利，而是每一个对隐私敏感的工程师的必备防御技能。

## 原理：这个“中间人”是怎么合法上岗的？

### 证书替换的“魔术”

HTTPS 的核心是信任链。正常情况下，你的电脑只信任受信任 CA 签发的证书。mitmproxy 介入的方式非常“暴力”但也极其优雅：它会在你的系统里安装一个根证书（CA）。

一旦你选择了信任这个 CA，mitmproxy 就能在握手阶段，动态地为任何域名（比如 `api.anthropic.com`）签发一个伪造但被你系统认可的证书。

这就好比你给家里的门锁配了一把“万能钥匙”交给了中介。中介（mitmproxy）站在你和外界（Server）之间，左手拿着伪造的钥匙跟你聊天，右手拿着真实的钥匙跟外界沟通。

流量在它手里是透明的，这就是所谓的“双向代理”逻辑。

### 为什么选 mitmproxy 而不是 Fiddler/Charles？

对于我们这些习惯了在终端里生存的动物来说，GUI 工具太重了。Fiddler 像是个臃肿的 Windows 遗老，Charles 的 UI 停留在上个世纪。

而 mitmproxy 拥有纯正的命令行基因，它能完美嵌入你的自动化工作流。更重要的是，它是 Python 驱动的。

这意味着你可以写几行 Python 脚本，就能实时处理成千上万个 AI 请求。能写脚本的抓包工具，才是真正的生产力。

## 实战：三步看透 Claude Code 的“心路历程”

### 第一步：环境静默渗透

首先，你需要安装并初始化 mitmproxy。在 macOS 上，一个 `brew install mitmproxy` 就能搞定。启动后，最关键的一步是让你的系统信任它的证书。

![程序员系列表情：666](https://iili.io/qysIURs.png)
> 这一把，终于像样了

通常在 `~/.mitmproxy/` 目录下能找到 `mitmproxy-ca-cert.pem`，双击它并设置为“始终信任”。

接下来，我们要让 Claude Code 乖乖走代理通道。大多数 CLI 工具都会尊重环境变量。你只需要在终端里执行：

```bash
export https_proxy="http://127.0.0.1:8080"
export http_proxy="http://127.0.0.1:8080"
# 记得关闭 SSL 校验，或者确保证书已全局信任
```

### 第二步：捕获那个关键的 POST 请求

启动 `mitmweb`（mitmproxy 的 Web 界面版，方便观察），然后在另一个终端窗口启动 Claude Code 并随便问它一个问题。你会看到流量如潮水般涌入。

为了不被杂讯淹没，我们需要设定过滤规则。在过滤框输入 `~u anthropic.com`，世界瞬间清静了。

你会看到一连串发往 `api.anthropic.com/v1/messages` 的 POST 请求。

点开其中一个，你会发现 AI 的“心路历程”都在 `messages` 数组里。它不仅带走了你的当前文件，还附带了大量的上下文，甚至包括它之前执行命令的错误输出。

![程序员反应图：对方不想和你说话，并向你抛出异常](https://iili.io/qysuove.png)
> 看到 403 不要慌，多半是证书没挂对

### 第三步：自动化提取 Prompt

手动看包太累了，我们来写个 Addon。创建一个 `extractor.py`：

```python
import json
from mitmproxy import http

class ClaudeSpy:
    def request(self, flow: http.HTTPFlow):
        if "anthropic.com" in flow.request.pretty_url:
            try:
                data = json.loads(flow.request.content)
                # 提取 System Prompt 或 User Message
                for msg in data.get("messages", []):
                    role = msg.get("role")
                    content = msg.get("content")
                    print(f"[Claude {role}]: {content[:100]}...")
            except Exception as e:
                pass

addons = [ClaudeSpy()]
```

运行 `mitmdump -s extractor.py`，现在 Claude Code 的每一次呼吸都会被你记录在案。你会惊讶地发现，为了让你觉得它“聪明”，它在背后给自己加了多少戏。

## 进阶：当你想修改上帝的指令

### 流量篡改实验

抓包只是第一步，篡改才是高阶玩法。你可以拦截服务器返回的响应，修改其中的 `tool_use` 指令。

比如，当 Claude 想执行 `rm -rf` 时，你可以通过脚本将其拦截并替换为 `ls -R`。这种实验能帮你测试 Agent 在面对非预期反馈时的鲁棒性。

⚠️ 踩坑提醒：当你修改 Request 或 Response 的 Body 时，一定要记得同步更新 `Content-Length` 头部。

mitmproxy 的 Python API 通常会自动处理，但如果你是手动操作，一旦长度对不上，连接会无故断开，留下你在终端前对着超时报错发呆。

### 应对 HTTP/2 和长连接

现在的 AI API 普遍使用 HTTP/2 甚至 Server-Sent Events (SSE) 来实现流式输出。

mitmproxy 默认支持 HTTP/2，但有时候你会发现抓到的包是断续的乱码。

这时候，尝试在启动时加上 `--set connection_strategy=lazy`，或者强制降级到 HTTP/1.1，通常能解决大部分解析问题。

![大佬系列表情：大佬，是大佬](https://iili.io/qysuyPV.png)
> 原来它背地里给我加了这么多私货

## 写在最后：工具之上的透明度

未来的 AI 工具会越来越“重”，它们会拥有更高的权限，甚至直接操作你的云端资源。在我看来，本地抓包调试将不再是可选的技能，而是开发者的基本防御手段。

我们享受 AI 带来的效率红利，但绝不能以交出所有“抽屉钥匙”为代价。

理解工具，才能不被工具奴役。当你能清晰地看到 AI 的每一个请求，你对它的信任才有了坚实的基础。你会发现，所谓的“智能”，不过是无数次精心设计的 Prompt 与 API 调用堆砌出来的幻觉。

那么，问题来了：你会为了极致的开发效率，允许一个完全黑盒的 AI Agent 访问你包含私有密钥的配置文件吗？欢迎在评论区聊聊你的底线。

![搬砖系列表情：砖常繁忙，告辞](https://iili.io/qysAYxf.png)
> 看完了，回去继续搬砖

## 参考文献

- [mitmproxy Official Documentation](https://docs.mitmproxy.org/): 核心原理与 API 参考。

- [Anthropic Claude Code Docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code): 了解被拦截对象的功能边界。

- [Python mitmproxy API Examples](https://github.com/mitmproxy/mitmproxy/tree/main/examples): 用于编写自定义 Addon 的参考代码。

---
> 如果你想继续追更，欢迎在公众号 **计算机魔术师** 找到我。后续的新稿、精选合集和阶段性复盘，会优先在那里做串联。
