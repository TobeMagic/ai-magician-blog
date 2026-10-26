---
title: "一个六字母码，AI 就把网页赛车搞成了多人竞速"
date: "2026-10-26 06:00:01"
updated: "2026-10-26 06:16:01"
permalink: "posts/2026/10/26/一个六字母码ai-就把网页赛车搞成了多人竞速/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/26/一个六字母码ai-就把网页赛车搞成了多人竞速/"
article_id: "048477d6-6142-4584-bfe8-f2fa0af25c84"
description: "Perplexity Computer 给自研网页赛车 SF 2049 加了基于 Cloudflare Durable Objects 的多人竞速房间：生成六位字母码、服务端计时过圈、空房自动销毁。一个六字母码把 AI 生成的游戏从「单人演示」推进到「可联机对战」，同时暴露出 AI 做游戏原型与正式上线之间那道工程鸿沟——加载体验、设备适配、帧率稳定性，原型阶段都不算数。"
cover: "/var/lib/aimagician/artifacts/covers/048477d6-6142-4584-bfe8-f2fa0af25c84/bb69b419-f5ee-4044-8934-0f3c1352b4f4/cover.png"
imgTop: false
---

Perplexity CEO Aravind Srinivas 展示由 Perplexity Computer 构建的赛博朋克风浏览器游戏 SF 2049（htt…

## 六位字母码背后的架构选择：为什么是 Durable Objects 而不是 WebSocket

### 现象：一个浏览器赛车要「多人」，到底卡在哪一步

单人开一辆赛博朋克跑车在旧金山湾区 Embarcadero 沿岸飞驰，渲染和物理引擎都没问题。第二个人进来之后，卡住的是权威时序。客户端各自报「我过了第三个门环」，两边时间戳一错就乱了排名。网页环境没有一个天然地方放那个说了算的节点，房间状态、过圈判定、淘汰排序都得有人接管。

### 传统路径：自建游戏服务器、第三方联机服务的成本与周期

业内常见两条路。第一条，自建 WebSocket 网关加状态同步层，最小配置包含长连接服务、房间管理器、排行榜持久化三件，三人团队起步周期两周，光联调网络分片就够喝一壶。第二条，接 Photon 或 PlayFab Multiplayer 这类第三方联机服务，免运维但帧同步粒度受制于供应商，且按并发连接计费。演示阶段还没拉来几个人，账单先跑起来了。



![程序员系列表情：你从我脸上看到了什么](https://iili.io/nlCYpe9.png)
> 房间管理器、长连接网关、排行榜，三件套缺一个就翻车



### AI 方案路径：Perplexity Computer 怎么把联机塞进一个网页游戏

Perplexity Computer 跳过了自建那一层，把房间逻辑直接写进 Cloudflare Durable Objects。每个房间是一个 Durable Object 实例，创建时分配六位字母码，玩家带码加入，服务端负责过圈计时与排序，最后一个玩家离开后房间自动销毁。Aravind Srinivas 在 X 上原话是「Rooms close themselves when empty」。这句话轻描淡写，但划清了 AI 做游戏原型的边界。它替你管了房间生命周期，关了之后数据存哪、跨会话存档怎么接，没人管。

六位字母码是故意做的低门槛入口，也是故意不做的规模化入口。拉三个朋友周末跑一圈没问题，想当正式上线产品就得换架构。



![SF 2049 多人房间生命周期](https://iili.io/nkUJ1OQ.png)
> SF 2049 多人房间生命周期



### 选型对照：Durable Objects、WebSocket、WebRTC 各自的适用边界

三种技术方案对应三种不同的问题形状，选错一个就返工一轮。

Cloudflare Durable Objects 的模型是「每个房间一个有状态单写对象」。房间有人就活着，没人就销毁，不占资源。Srinivas 原话「Rooms close themselves when empty」不是功能亮点，是整个运维模型的描述。对 SF 2049 这种「四到八个人、跑十分钟、散场」的场景，映射直接：不用预置服务器，不用写连接池，不用关心实例回收。代价是单房间并发上限低，不适合「同一赛道同时挂两千人」的对战大厅。

WebSocket 是持久双向连接，技术上完全能做房间制竞速。但「做得到」和「该不该做」是两回事。你得自己管心跳、断线重连、背压、粘包、有状态路由。几个朋友分享一个六位码的时候，这套基建是多余的；当同局人数过百、需要 interest management 裁剪广播范围时，裸 WebSocket 撑不住，得上 Colyseus、Photon Engine 这类专门框架。

WebRTC 走 P2P 或 SFU 拓扑，延迟最低。问题在信任模型：赛车计时需要「谁先过线」的裁定权，而 SF 2049 的更新说明里明确写了 server-side lap timing。WebRTC 没有天然的服务端权威层，硬要加就得再套一层仲裁服务，绕了一圈回到 Durable Objects 干的活。NAT 穿透在家庭宽带和移动网络下成功率也不是百分之百，一个玩家连不上就是整局废掉。



![多人联网三种方案适用边界](https://iili.io/nkUJsdG.png)
> 多人联网三种方案适用边界



选型判断落在一个条件上：你的房间生命周期多短、单房并发多少、是否需要服务端裁定。SF 2049 三个条件全部指向 Durable Objects，Perplexity Computer 生成代码时选了这条路。换成「百人同屏」或「全球排位赛」，结论立刻翻转。

### 落地清单：从「AI 出原型」到「能上线的多人游戏」还差什么

原型验证的是玩法回路。上线是另一门手艺，差的东西可以列成一张表。

**加载与设备适配。** 网页赛车加载时间直接决定留存，玩家不知道还要等多久就会关页面。SF 2049 当前有加载进度条与操作提示，但素材量随场景复杂度增长后，移动端 4G 下的首帧时间需要实测。不同 GPU 能力（WebGL 1 与 2、iOS 上的 Metal）决定画质档位策略，原型阶段通常跳过，上线前必须补。

**帧率与场景复杂度。** 起始画面流畅不代表密集路段也流畅。切换视角、进入高多边形区域后的帧率衰减只有持续游玩才能暴露。测试应覆盖至少三条不同密度路线，而不是一段起始录像。

**错误降级。** 浏览器不支持某项图形特性时，页面应当告知用户缺什么、下一步怎么做，而不是卡在加载画面。这是「能跑」到「不尴尬」的分界线。

**数据持久化。** 「Rooms close themselves when empty」定义了房间生命周期，但关了之后圈速记录、玩家成就存哪？Durable Objects 自带持久化存储（SQLite on DO 或 R2），AI 生成的原型默认不会设计存档 schema。

**重连与鉴权。** 六字母码降低进入门槛，但没有身份校验。任何拿到码的人都能进房间。要加排位或积分，匿名房间的公平假设就不成立。服务端计时是第一步，第二步是校验客户端上报位置与速度是否物理合理。

**规模化入口。** 六位字母码是故意做的低摩擦入口，也是故意不做的规模化入口。上线至少需要一个房间列表或公开邀请链接，让不知道别人码的人也能找到局。

以上六项，原型阶段可以全跳。要上线，一项不能少。AI 出代码的速度优势在原型阶段最大，到了上线阶段，工程纪律的权重会超过生成速度。

### 原型到上线，差的不只是代码

SF 2049 的加载页有进度条和操作提示，但进度条解决的是「等多久」的认知问题，不解决「iPhone 上能不能跑 60fps」的物理问题。移动端跑 Three.js 渲染的城景和桌面 GPU 加速是两个世界。原型阶段你只看 PC Chrome，上线后第一波差评一定来自移动浏览器。

Durable Objects 走 Cloudflare RPC 通道而非裸 WebSocket。10 人房间、20Hz 状态同步够用。RPC 延迟业内常见 30–80ms，对休闲竞速完全可接受，且省掉自建 WebSocket 网关的运维成本。但 50 人以上自由竞速或 60Hz tick rate，RPC 开销会咬人，该切独立 WebSocket 或 WebRTC 数据通道，Durable Objects 退回只管房间生命周期。10 人以内不需要排位赛和回放，Durable Objects 够用；加赛季、跨房排行就跳一个量级，该评估独立游戏服务器了。



![多人竞速协议分层与切换边界](https://iili.io/nkUdnB1.png)
> 多人竞速协议分层与切换边界



「Rooms close themselves when empty」定义了边界：它管了房间生命周期，但关了之后数据存哪没人管。AI 给你生成了赛车，没给你生车库。过圈记录、赛季积分要额外接 D1 或 R2 做持久化，这是原型里默认不会出现的那层。

26⁶ 约 3 亿组合，百万级并发下撞码不低，公开搜索得换带校验位的编码。对 Perplexity 这个产品定位来说，10 人房间是产品决策而非技术限制。

### 边界与下一步

Durable Objects 解决的是「房间活着的时候谁来管」，没解决「房间关掉之后数据存哪」。SF 2049 的过圈计时、排名、玩家昵称，在房间销毁的瞬间就没了。对原型验证够用，对「我要回来看自己上周跑了几圈」不够用。

六位字母码是故意做的低门槛入口：不需要账号、不需要搜索，发个码就能跑。但这也是故意不做的规模化入口。没有持久化身份，就没有跨会话匹配，没有赛季，没有段位。

判断条件很清楚：验证玩法、做视觉提案、给投资人或课程学生看一个「能联机的小车」，Perplexity Computer 加 Durable Objects 这条路径成本最低，今天就能出活。一旦需要玩家留存、持久化存档、千人以上并发，把匹配层抽成独立服务（Node.js 加 Redis，或 Elixir 加 Phoenix Channels），游戏逻辑层保留 Durable Objects 做单房计时，才是该做的事。你省下的那台游戏服务器，变成了匹配层一张 Redis 实例的账单。更狠的是，原型阶段省下来的两周工期，到了生产阶段会以运维成本翻倍的形式还回来。

可以今天就做的三件事：打开 http://2049.pplx.app 跑一轮，记录加载时间和切视角后的帧率；把过圈数据在控制台里截一份 JSON，作为后续持久化设计的字段参考；如果团队接下来要做正式版本，把「房间关闭后的数据去向」写进架构文档第一行，别等事故复盘时再补。



![原型到生产的匹配层拆分决策](https://iili.io/nkUdukv.png)
> 原型到生产的匹配层拆分决策



## 参考文献
1. Aravind Srinivas on X: "SF 2049 is bigger now, and it's multiplayer. Computer added: Race rooms on Cloudflare Durable Objects." https://x.com/AravSrinivas/status/2114372064866169210
2. Introducing Perplexity Computer https://www.perplexity.ai/zh/hub/blog/introducing-perplexity-computer
3. SF 2049 游戏页面 http://2049.pplx.app

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
