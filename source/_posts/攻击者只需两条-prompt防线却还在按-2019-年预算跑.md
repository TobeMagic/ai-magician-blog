---
title: "攻击者只需两条 prompt，防线却还在按 2019 年预算跑"
date: "2026-11-08 05:09:34"
updated: "2026-11-08 06:51:11"
permalink: "posts/2026/11/08/攻击者只需两条-prompt防线却还在按-2019-年预算跑/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/08/攻击者只需两条-prompt防线却还在按-2019-年预算跑/"
article_id: "bad908d8-6afe-499d-92cf-a5db0551c246"
description: "开放权重模型把整条攻击链的边际成本压到接近零，而防御侧仍依赖过去二十年攒下的几千亿美元基础设施。Cognition 安全负责人、前 Meta CISO Alex Stamos 在 The Verge Decoder 节目中判断：网络安全行业正进入一段「黑暗时代」。不是 AI 不够强，而是攻防的经济结构被彻底写反了。他给出的药方很具体：企业 90 天内完成 AI 红队演练，像重写 Rust 版 Linux 内核那样重做内存安全，Tier 1 SOC 自动化是昨天该做的事。"
cover: "/var/lib/aimagician/artifacts/covers/bad908d8-6afe-499d-92cf-a5db0551c246/c34f7d9d-51fc-4126-9f32-cfb7d8cb6c79/cover.png"
imgTop: false
---

他原话是：你不需要 AI 去黑那些没打补丁的系统，默认密码的 VNC 十几年前就能进去。但 AI 来了之后，一整代业余选手只需要两条 prompt 就能上手拆墙。防线还在修，拆墙的人已经不需要学历了。

说这话的是 Alex Stamos，Cognition 首席安全官，前 Meta CISO，斯坦福 CS 系讲师。2026 年 11 月 The Verge Decoder 节目里，他给当下网络安全下了个定调，四个字：黑暗时代。

## 攻防经济学翻盘：谁在付钱，谁在收钱

### 两千亿美元防线的边际成本优势是怎么丢的

过去二十年，网络安全是典型卖方市场。企业花数百亿美元养 SOC 排班、买 SIEM、修补丁周期，攻击者却受限于人才和工具成本。一次定向攻击要数月侦察、定制 exploit、独立基础设施。防御有规模经济，攻击没有，这条不对称撑起了整条产业链的定价逻辑。

Stamos 的判断是这条线已经断了。开放权重模型把攻击链边际成本压到接近零：一块消费级 GPU 加一条 system prompt，就能跑完从资产发现到凭据窃取的全路径。防御侧还在按 2019 年的预算表招 Tier 2 分析师。



![程序员 reaction：柯南00074 可恶](https://iili.io/CtOOXNj.png)
> 两千亿护城河，一夜变成别人家的高速公路



### 开放权重模型 + 自动化攻击链：攻击者的新武器库

Stamos 点名了一条具体链路。被盗 neocloud 密钥流入 IDE 插件供应链，再被自动化批量灌入目标环境。攻击者不必理解底层协议，模型替他把侦察、漏洞匹配、payload 组装、横向移动串成流水线。Hugging Face 级别的开源生态，攻击面天然比闭源大，2024 年的供应链事件已经验证过这一点。



![攻防边际成本结构（2019 vs 2026）](https://iili.io/nDwPMc7.png)
> 攻防边际成本结构（2019 vs 2026）



「Expect breach is easy to say and very hard to do. Tier 1 SOC needed to be automated yesterday. Tier 2 today.」这是 Stamos 原话。第一层告警过滤 2025 年就该全自动化，第二层分诊到现在还没追上。攻击侧已把九成重复劳动交给模型，防御侧还在用手数告警。

更关键的是，这条经济曲线没有对称反弹的空间。开放权重模型一年发几十个版本，攻击工具跟着模型迭代；防御基础设施采购周期 18 到 36 个月，预算写的是 2019 年的 ROI 模型。时间差只会越拉越大。

## 「黑暗时代」到底黑暗在哪

Stamos 说的「黑暗」不是 AI 不够强，是经济结构被写反了。防御侧靠过去二十年攒下的几千亿美元基础设施运转；攻击侧现在一台消费级 GPU 加两条 prompt 就能跑完整条 cyber kill chain。一边是年度预算锁死的军备，一边是按周迭代的武器。

### 十月那波入侵潮：一次提前上演的预演

十月份那波入侵，Stamos 没有当异常事件处理，而是定义为「一次提前上演的预演」。核心向量不是 0-day，是存量技术债撞上自动化层：被盗的 neocloud API key 流进 IDE 插件，开放权重模型批量生成社工邮件和凭据爆破脚本。一家中型 SaaS 从首条告警到数据外泄 72 小时，攻击流水线全程无人工介入环节。Hugging Face 上任何注册用户都能复现这条链。

### CISO 的困境：预算审批周期 vs 指数级威胁增长

时间轴对不上。安全预算走财年审批，CFO 签字、采购落地、部署培训，最短周期六个月；威胁侧模型每两三个月迭代一轮，攻击链自动化程度随之跳级。Stamos 在 Decoder 节目里的原话是「Tier 1 SOC needed to be automated yesterday. Tier 2 today.」他拿自己的职位开了个玩笑（大意是 CISO 更像是个背锅缩写），然后认真说：董事会只在数据泄露之后才愿意把安全预算摆上桌。更狠的是，等下一轮预算批下来，威胁曲线又走了一格。



![预算周期与威胁增长的时间错位](https://iili.io/nDwiKf2.png)
> 预算周期与威胁增长的时间错位





![搬砖系列表情：真羡慕你们不用上班](https://iili.io/C1zRo8v.png)
> 预算还没批下来，攻击脚本已经跑了三个版本



## 九十天 AI 红队演练：Stamos 开出的药方

Stamos 在 The Verge Decoder 访谈里给出的不是五年路线图，也不是「建立 AI 治理框架」这种可以写进年报的话。他给的是一个九十天的动手周期，而且动手的主体是企业自己的安全团队，不是外包。具体动作拆解下来很直接。第一周，搭一条隔离网络，把生产环境的日志接口、API 端点、内部文档库镜像进去。第二周到第四周，接上 Llama 3 或 Mistral 这类开放权重模型，不给它任何预设知识，只看它能在多长时间内从外网摸到内网、从内网拿到管理员凭证。第五周到第八周，把跑出来的攻击路径逐条复现到生产影子环境，量出真实暴露面。第九周出报告，第十周开始修。他原话的判断是「expect breach is easy to say, very hard to do」。说一句话谁都说得出口，跑完这九十天才知道「易」和「难」之间隔着多少个工程师的加班。



![程序员 reaction：柯南00022 你说我在听](https://iili.io/CgJVgwu.png)
> 九十天倒计时，安全团队又被安排了一次



### 从「重写 Rust 版 Linux 内核」到 Tier 1 SOC 自动化的优先级

他把防御侧重建比作 Rust 重写 Linux 内核。这不是一个修辞，是一个工程量参照。Linux 核心大约三百万行 C 代码，Rust 重写意味着每一层内存安全假设都要重新证明。指针、所有权、生命周期，全部换一套规则再编译一遍。网络安全基础设施的结构性和这个类似。过去二十年攒下的几千亿美元防线，底层逻辑是「人盯人」。SOC 分析师盯着 SIEM 屏幕上的告警流，一天处理几百到几千条，靠经验判断哪条值得升级、哪条可以归档。漏掉的那条，就是 2016 年那个该关没关的 VNC 端口，只是换了个壳又回来。

优先级排序他写得没有缓冲词。Tier 1 SOC 自动化，昨天就该做完了。Tier 2，今天。Tier 3 以后再说。没有「建议」「可以考虑」「视资源情况」这些留给 PPT 的弹性空间。Tier 1 做的事很窄。把告警分类、自动取证、初步响应这三步从人工手里接过来，让一个模型加一套规则引擎在三十秒内完成。人只做 Tier 2 以上的事。确认、升级、对外沟通。



![九十天 AI 红队演练与 SOC 自动化优先级](https://iili.io/nDwsjCx.png)
> 九十天 AI 红队演练与 SOC 自动化优先级



### 哪些企业能先熬过这段，哪些会卡在预算审批上

能先熬过去的，是那些把 2026 年 10 月那波入侵潮当真事而不是当演习的团队。Cognition 本身是 AI 编码公司，安全团队和研发团队在同一个 Slack 频道里，改一条策略的周期以小时计，不用走季度评审。Stamos 在 Semafor 那期 Future Proof 节目里补了一句很冷的话。「These things are not conscious, they do not have souls.」AI 不是意识体，没有灵魂，它就是一个概率分布在做文本续写。这句话的功能不是安慰，是把讨论从「我们应该害怕什么」拉回「我们该在哪里设边界」。你不用跟它讲道德，你只需要把它挡在你认为不该过的那道墙外面。

卡在预算审批上的，是另一类，而且是数量上的多数。年预算周期锁死在 Q4 审批，采购流程要过合规、法务、CFO 签字，最快也要两个季度。威胁曲线是指数级的，预算曲线是线性的。更扎手的是具体场景。CISO 提了一个五百万美元的 Tier 1 自动化项目，财务第一轮问「去年同类项目 ROI 是多少」。去年那个项目根本不存在，因为去年还没有开放权重模型能自动跑完一整条 cyber kill chain。拿一个不存在的先例去论证一个紧迫需求，审批表填到第三页就卡在合规那里。合规说「没有先例无法评估风险」，CISO 说「没有先例本身就是风险」，两个部门对着同一张表格各写各的判断，Q4 就这样过去了。

Stamos 没有给大企业留台阶。黑暗时代的含义是过渡期会很长，长得足以让一批公司被拖垮之后才以更低的价格被收购。活下来的标准不是预算最大，是决策链最短。你如果今天还在那张审批表上，那这张表的签发日期可能已经来不及了。

## 边界与追问：AI 风险里哪些是真的，哪些是「准宗教」

### 「这些东西没有意识，没有灵魂」：把想象风险从议程上砍掉

Stamos 在 Semafor 的 Future Proof 节目里把这条线画死了。AGI 觉醒、紧急暂停那套叙事，他一句判了死刑。原话是「These things are not conscious, they do not have souls.」真正的风险不在意识层。攻击边际成本归零，防御预算还停在 2019 年，议程应该拉回「这条代码能不能被利用」，而不是「机器有没有灵魂」。

### 政府监管（模型召回）是解药还是新摩擦

他同场说得更直白。禁止开放权重模型，不是减少攻击者，是在国内造一批海盗。大企业合规，业余选手不在乎，防御成本反升。模型召回是政治表演多于技术解法。真正缺监管的是数据链路，stolen neocloud keys 流入 IDE 插件那条链，目前没有框架管得住。

## 落点：下一轮预算周期，安全团队怎么跟 CFO 讲清这笔账

CFO 不为「黑暗时代」签字，只为可审计的数字。下一轮预算周期，安全团队要做的只有一件事：拿过去 90 天 Tier 1 告警链的实际漏报数据，算出自动化后省掉的分析师人月，写成一页纸递过去。不是概念性 AI 红队支出，是「这条链 72 小时漏了 14 个事件，月省 3 人力」。

那句该贴在 SOC 看板上的话，Tier 1 自动化是昨天该做的事。不是 Q3 复盘再说，是现在。

## 参考文献
[1] The Verge Decoder — Alex Stamos on AI's coming cybersecurity dark age. https://www.theverge.com/podcast/1029038/ai-cybersecurity-hackers-data-breach-dark-age-alex-stamos
[2] Semafor Future Proof — Alex Stamos on Silicon Valley's nihilism. https://www.semafor.com/article/10/07/2026/alex-stamos-future-proof
[3] Alex Stamos — Moving Forward from Hot Fable Summer. https://alexstamos.com/p/moving-forward-from-hot-fable-summer
[4] Big Technology Podcast — AI's True Cyber Risk with Alex Stamos. https://www.youtube.com/watch?v=rJ6YdXhvGpY

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
