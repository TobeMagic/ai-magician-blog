---
layout: "post"
title: "博客变赌场？一次运营商 HTTP 劫持的排查与绝地反击"
description: "博客突然跳转到非法网站，排查发现是运营商 HTTP 劫持。本文记录了从发现异常、锁定根因到通过强制 HTTPS、HSTS、CSP 等手段彻底修复的全过程，并总结了静态博客的安全加固最佳实践。"
tags:
  - "HTTP劫持"
  - "HTTPS"
  - "网络安全"
  - "Cloudflare"
  - "GitHub Pages"
  - "HSTS"
  - "HTTP"
  - "CSP"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/03/27/博客变赌场一次运营商-http-劫持的排查与绝地反击/"
permalink: "posts/2026/03/27/博客变赌场一次运营商-http-劫持的排查与绝地反击/"
date: "2026-03-27 13:19:00"
updated: "2026-03-27 13:40:00"
cover: "https://iili.io/qtPxSb1.png"
---

## 为什么现在值得写

某天下午，正在工位上摸鱼划水，后台突然弹出一一条读者私信：“博主，你的博客是不是被黑了？怎么一点进去就跳到那种不可描述的网站？”

第一反应是不信。我的博客托管在 GitHub Pages，套了 Cloudflare 的 CDN，DNS 解析也锁得死死的，怎么可能会被挂马？

紧接着第二反应是慌。赶紧掏出手机，断开 WiFi 用 4G 流量刷了一下，正常；连上公司 WiFi 刷一下，也正常；

回家打开宽带一试——好家伙，那个熟悉的极简风博客瞬间变成了花花绿绿的博彩页面，弹窗乱飞，简直像是在我脸上扇了一巴掌。

那一刻我才意识到，所谓的“大厂托管 + 静态页面”，在运营商的 HTTP 劫持面前，不过是一张没穿铠甲的白纸。

这次排查和修复的过程，像极了一场没有硝烟的攻防战，值得每一个还在用 HTTP 的站长警惕。

## 案发现场：如何确认是 HTTP 劫持

### 排查第一步：排除 DNS 劫持

既然网站被跳转了，第一怀疑对象自然是 DNS。如果域名被解析到了黑客的服务器，那跳转就是顺理成章的事。

我立刻打开终端，熟练地敲下 `ping` 和 `nslookup`。结果显示，域名解析出的 IP 地址完全正确，清一色指向 GitHub Pages 的服务器段。

DNS 没问题，那问题就出在数据传输的路上。

### 排查第二步：锁定 HTTP 响应注入

既然 IP 对得上，那就看看 HTTP 响应头。在终端输入 `curl -I` 检查响应头，屏幕上跳出的结果让我心里一沉：返回了一个诡异的 301 重定向，目标正是那个非法网站。

紧接着打开浏览器开发者工具，切到 Network 面板，刷新页面。

在第一个文档请求里，我看到了真相：HTTP 响应体里被硬生生塞进了一段恶意的 JS 脚本，正是这段代码把我的博客“踢”到了那个非法站点。

![系统当面抛出一个异常时的无语表情](https://iili.io/qZLtS8F.png)
> 这行注入代码比我正文还显眼

### 结论：这是一次典型的 HTTP 劫持

证据链闭环了：DNS 解析正常，说明域名没被盗；但 HTTP 响应被篡改，说明有人在数据传输的必经之路上动了手脚。

结合“家里宽带跳转、手机 4G 正常”的现象，嫌疑人直接锁定——运营商。因为 HTTP 协议是明文传输，运营商的网关设备完全有能力在响应包里“夹带私货”，插个广告算轻的，直接劫持跳转才是真的黑。

## 根因拆解：为什么运营商能劫持你的博客

### HTTP 明文传输的致命弱点

HTTP 就像在明信片上写情书，经手的每一个邮递员都能偷看内容，甚至拿起笔涂改两句。

对于运营商来说，HTTP 流量就是一块肥肉。他们可以在你的网页里注入广告脚本赚取外快，甚至把你的流量“卖”给第三方。

虽然国家一直在打击，但在某些地区、某些小运营商的网络环境下，这种“中间人攻击”依然屡禁不止。

### 为什么 HTTPS 是解药

HTTPS 则是把明信片装进了上了锁的保险箱。只有持有钥匙的服务器和浏览器才能打开。

即便运营商截获了数据包，看到的也只是一堆乱码，根本无法注入代码。这就是为什么全站 HTTPS 是现代网站的标配——不是为了显得高级，而是为了不被“中间商”赚差价。

## 手术方案：从强制 HTTPS 到 HSTS 的完整配置

既然病根在 HTTP，那治疗方案就很明确：强制全站 HTTPS，不给 HTTP 任何露脸的机会。

### 方案一：GitHub Pages 强制 HTTPS

登录 GitHub 仓库的 Settings，找到 Pages 选项卡。如果你的域名 DNS 解析正常，这里通常可以直接勾选 `Enforce HTTPS`。

但这里有个坑：如果你的域名刚解析过去，GitHub 的证书还没签发下来，这个选项可能是灰色的。别急，等个半小时再刷新，Let's Encrypt 的自动签发很快。

### 方案二：Cloudflare 加密模式选择

这一步最关键，也是最容易踩坑的地方。

在 Cloudflare 的 `SSL/TLS` 设置里，加密模式一定要选 `Full (strict)`。

⚠️ **踩坑提醒**：千万别选 `Flexible`。

这个模式下，用户到 Cloudflare 是加密的，但 Cloudflare 到你的源站（GitHub Pages）是 HTTP 的。这不仅没解决根本问题，还可能在源站环节被劫持。

只有 `Full (strict)` 才能保证全链路加密，并且验证源站证书，彻底堵死中间人下手的缝隙。

### 方案三：HSTS 防止降级攻击

光有 HTTPS 还不够，如果有人故意把你重定向到 HTTP 链接怎么办？这时候就需要 HSTS（HTTP Strict Transport Security）。

在 Cloudflare 的 `SSL/TLS` -> `Edge Certificates` 里开启 HSTS。这相当于告诉浏览器：“以后只许用 HTTPS 连我，任何 HTTP 链接直接拒绝。”

建议刚开始把 `max-age` 设置短一点（比如 6 个月），测试没问题再加长到 1 年甚至更久。

### 方案四：Cloudflare Page Rules 强制跳转

为了保险起见，我还配置了一条 Page Rules：如果 URL 匹配 `http://*`，则转发到 `https://`，使用 301 永久重定向。

这相当于在门口派了个保安，凡是想走 HTTP 进来的，一律踹到 HTTPS 那边去。

## 进阶加固：CSP、DNSSEC 与 SRI 构建纵深防御

解决了眼前的劫持，还得防着未来的变种。安全这事儿，永远没有“做完”的一天。

### 配置 Content-Security-Policy (CSP)

CSP 响应头可以限制浏览器只加载你信任的资源，防止被注入恶意脚本。

在 Cloudflare 的 `Rules` -> `Transform Rules` 中添加响应头：

```plain text
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

这段配置的意思是：默认只加载同源资源，脚本和样式允许从指定的 CDN 加载。根据你自己的博客实际引用情况调整域名白名单。

### 启用 DNSSEC 防止 DNS 篡改

虽然这次是 HTTP 劫持，但 DNS 劫持也是常见手段。在域名注册商后台开启 DNSSEC，相当于给 DNS 解析过程加了一把数字签名锁，防止解析结果被伪造。

### 使用 SRI 保护外部资源

如果你引用了第三方 CDN 的 JS 或 CSS，一旦那个 CDN 被黑，你的网站也会跟着遭殃。

SRI（Subresource Integrity）可以解决这个问题。在引用标签里加上 `integrity` 属性，浏览器会校验文件的哈希值：

```html
<script src="https://cdn.jsdelivr.net/npm/example@1.0.0/dist/main.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxc"
        crossorigin="anonymous"></script>
```

如果文件被篡改，哈希值对不上，浏览器就会拒绝加载。

## 写在最后

折腾了一晚上，终于把博客从“赌场”变回了技术净土。用 SSL Labs 测了一下，拿到了 A+ 评级，看着那个绿色的评分，心里总算踏实了。

这次事故给我上了一课：在网络安全领域，任何侥幸心理都是给黑客留后门。HTTP 看着省事，其实是在裸奔；HTTPS 配着麻烦，却是现代互联网的底线。

你的博客现在用的是 HTTP 还是 HTTPS？有没有遇到过类似的运营商劫持？欢迎在评论区聊聊你的排查经历。

## 参考文献

1. **MDN Web Docs - HTTP Strict Transport Security**

- 来源：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security

- 用途：解释 HSTS 的工作原理和配置参数

1. **Cloudflare Docs - SSL encryption modes**

- 来源：https://developers.cloudflare.com/ssl/encryption-modes/

- 用途：说明 Full (strict) 模式与其他模式的区别

1. **GitHub Docs - Securing your GitHub Pages site with HTTPS**

- 来源：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/securing-your-custom-domain-with-https

- 用途：GitHub Pages HTTPS 强制开启的官方指南

1. **MDN Web Docs - Content-Security-Policy**

- 来源：https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

- 用途：CSP 头的配置语法和作用

1. **Qualys SSL Labs - SSL Server Test**

- 来源：https://www.ssllabs.com/ssltest/

- 用途：作为验证 HTTPS 配置正确性的在线工具推荐

---
> 如果你想继续追更，欢迎在公众号 **计算机魔术师** 找到我。后续的新稿、精选合集和阶段性复盘，会优先在那里做串联。
