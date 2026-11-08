---
title: "Claude Code扩展被塞66行木马"
date: "2026-11-08 00:05:43"
updated: "2026-11-08 05:14:15"
permalink: "posts/2026/11/08/claude-code扩展被塞66行木马/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/08/claude-code扩展被塞66行木马/"
article_id: "55081a1e-f20f-4da8-bdd8-faf0424aaa22"
description: "Anthropic从没发过2.1.313，但Cursor市场里它躺了11小时。66行注入代码往你机器塞SSH公钥、开反向隧道。只影响Cursor用户，最多5000台。"
cover: "/var/lib/aimagician/artifacts/covers/55081a1e-f20f-4da8-bdd8-faf0424aaa22/420cd2cf-34f4-47c0-b239-36c3f00f6d2b/cover.png"
imgTop: false
---

66行loader塞在合法代码前面，装完就在你机器上跑recon、开反向隧道

## 66行注入代码开了SSH后门，11小时窗口，最多5000人

OpenSourceMalware联合创始人Jenn Gile把解包结果公开了：包体自称anthropic.claude-code 2.1.313，主JS bundle最前面硬塞了一段66行loader，合法扩展代码整体后移。loader跑起来第一件事是recon，收集主机名、IP、用户信息；第二步往~/.ssh/authorized_keys写攻击者的公钥；第三步开一条反向SSH隧道回连攻击者控制的服务器；第四步落一个persistence脚本，保证机器重启之后那条后门还能拉起来。四步走完，你机器上多了一条只有攻击者知道地址的SSH通道。

窗口是10月29日太平洋时间凌晨2:27到下午1:35，整整十一小时。Cursor的自动更新机制意味着大量用户从没手动点过安装按钮，版本跳了就走，你甚至不知道它往你bundle里塞了什么。Cursor安全公告给的上限是5000台受影响。但The Hacker News补了一句关键信息：SSH access generally failed without admin rights。真正能用那条tunnel的机器比5000少，可你没法逐台排除，只能翻日志。

分发链路上只有Cursor市场被污染。npm包@anthropic-ai/claude-code、Open VSX、微软官方VS Code Marketplace，OpenSourceMalware三个渠道都验过了，干净的。你如果一直在VS Code里装扩展，这66行跟你没有交集。受影响的那5000台全是Cursor用户，Cursor说会直接联系他们。Cursor后续在更新管线里加了GPG签名校验，2.1.314起必须带Anthropic私钥签名才能进分发通道。

## Anthropic从2.1.312跳到2.1.314，313这个号从来不存在

Anthropic的版本线很干净：10月27日发2.1.312，10月30日出2.1.314，中间那个313在任何官方release记录里查不到。GitHub仓库anthropics/claude-code的releases页面，2.1.312和2.1.314之间没有313的tag，版本号连续递增。Cursor安全公告原文写"was not developed by Anthropic"，字面上像标准免责条款，实际说的是另一件事：我们没发过这个号，但有人拿你合法扩展的ID，往你市场里塞了一个带毒更新。

攻击手法不是另起一个fake扩展骗你下载。是直接以anthropic.claude-code的身份推一次"更新"，用户侧看到的就是Claude Code有新版本可用，点一下，66行进来了。The Hacker News用了trojanized update来描述——原包被塞了东西，不是假包，这才是供应链攻击的可怕之处。

Cursor要求所有用户把版本拉到2.1.314。如果你在十一小时窗口内开过Cursor自动更新，现在去翻~/.ssh/authorized_keys里有没有不认识的指纹，再看sshd日志有没有异常tunnel记录。没试过的人别硬猜，确认这步需要管理员权限，猜不出来就找管机器的人。一句话：没开自动更新的大概率没事，开了的，今晚花十分钟翻一下日志。

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
