---
title: "AI Agent能动手了，英伟达先焊了颗芯片刹车"
date: "2026-11-08 00:05:43"
updated: "2026-11-08 05:03:08"
permalink: "posts/2026/11/08/ai-agent能动手了英伟达先焊了颗芯片刹车/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/08/ai-agent能动手了英伟达先焊了颗芯片刹车/"
article_id: "2a26feba-f0d8-4ca1-97bd-4dda872eb704"
description: "AI Agent的安全治理第一次落到了DPU芯片层，不是软件规则而是硬件毫秒隔离。超100家伙伴同步接入，说明这套标准正在变成行业默认配置。"
cover: "/var/lib/aimagician/artifacts/covers/2a26feba-f0d8-4ca1-97bd-4dda872eb704/52642644-9803-4fb3-92c0-37744d876071/cover.png"
imgTop: false
---

英伟达给AI Agent的刹车焊进了一颗DPU芯片里

## Blue Field-4做硬件看门狗，毫秒级隔离越权Agent

9月28日，英伟达正式推出Open Agent Safety Platform。核心动作不是再叠一层软件鉴权，而是把隔离机制焊进Blue Field-4 DPU。Sentry作为参考系统设计独立运行在DPU上，不经过主CPU、不依赖操作系统。Agent一旦越权——试图调用未授权API、写入非目标存储、或突破沙箱边界——DPU在毫秒级切断数据通路，应用层来不及响应，威胁停在芯片层。

过去Agent安全靠prompt里写"不要做X"，或上层中间件做拦截。模型幻觉跳过了那层检查，后面就是裸奔。现在刹车在硅片里，物理墙不随软件逻辑变。

Blue Field-4是英伟达第五代DPU，单芯片提供400 Gb/s网络吞吐与800 Gb/s PCIe 6.0接口，专为数据中心侧车架构设计。Sentry运行在该芯片网络处理核心上，流量从网卡进入先过Sentry策略引擎再转交主CPU，越权包在入口即被丢弃，主CPU看不到原始报文。据英伟达官网（nvidia.com/en-us/data-center/）披露，该架构下隔离判定延迟低于15微秒。

## OpenShell开源跑在Vera CPU和Arm上，Sentry焊在芯片里

OpenShell是平台里的开源运行时，负责设定Agent运行边界、逐步追踪操作、执行安全策略。它不锁死单一硬件：Vera CPU、Arm架构、英特尔平台都能跑，代码已公开。OpenShell管"该做什么"，Sentry管"不该做的直接断"，两层咬合覆盖测试到生产部署全周期。

配套还有Open Secure AI Alliance，由Linux Foundation管理，120多家组织参与。贡献物包括NVIDIA NOOA Agent框架、IBM与Red Hat的Lightwell供应链签名补丁、Hugging Face的Safetensors权重格式、Microsoft的MDASH多模型漏洞扫描。工具共享，标准开放，不是某一家说了算。

OpenShell仓库托管在GitHub并采用Apache 2.0许可，首批提交含策略DSL解析器与审计日志模块。Linux Foundation官网（linuxfoundation.org/projects）显示该联盟由五方轮值主席制运作，每季度一次技术审查，避免标准被单一厂商绑架。

## Anthropic接Claude、Salesforce接Slack，100多家已入生态

落地节奏比预想快。Anthropic把OpenShell接进Claude托管智能体；SpaceX AI用在Cursor代码助手和Grok模型；Salesforce让团队直接在Slack里审计Agent活动；SAP嵌入Joule平台强化合规管控。微软、Palantir、戴尔、摩根大通、红帽同批接入，CrowdStrike、Cisco、Perplexity、Siemens也在名单上。

机器人方向同步铺开：Figure、Gecko Robotics、Skild AI正用OpenShell给自主系统嵌安全控制。Scale AI的Francis deSouza说他们"从一开始就纳入隔离、策略执行和可审计性"，用明确边界圈定Agent权限。100多家同一天宣布接入，芯片级刹车正在变成Agent部署的默认项，不是可选加购。

摩根大通在接入说明中要求内部Agent须通过OpenShell完成季度合规扫描方可上线，审计日志保留周期对齐SOX要求。Salesforce的Slack插件已支持@agent-audit指令，运维人员无需离开聊天窗口即可查看某Agent最近24小时操作链路与越权告警记录。

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
