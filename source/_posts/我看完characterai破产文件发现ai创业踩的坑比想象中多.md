---
title: "我看完Character.ai破产文件，发现AI创业踩的坑比想象中多"
date: "2026-10-14 10:00:01"
updated: "2026-10-14 10:06:37"
permalink: "posts/2026/10/14/我看完characterai破产文件发现ai创业踩的坑比想象中多/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/14/我看完characterai破产文件发现ai创业踩的坑比想象中多/"
article_id: "d623b769-b2e2-4048-82ff-38b57393f608"
description: "Character.AI曾估值10亿美元，如今 Disney 以2000万美元竞购其部分资产。破产文件暴露了一个残酷现实：每月算力成本高达1380万美元，而订阅收入峰值仅280万美元。用户情感依赖极深，但商业模型撑不住烧钱速度，叠加青少年自杀诉讼、FTC监管调查等多重打击，最终走向法院监督出售。"
cover: "/var/lib/aimagician/artifacts/covers/d623b769-b2e2-4048-82ff-38b57393f608/5bbeeb71-9cdb-40fe-8908-339cc78fca6a/cover.png"
imgTop: false
---

2024年，Character.AI每月在AI算力上烧掉1380万美元。同一年，它的订阅收入峰值是280万美元。

## 一、破产文件里藏着的数字：月烧1380万，收入不到300万

### 算力成本的账怎么算的

Colin Adams在破产法庭提交的宣誓书里有一句话："Character令人印象深刻的技术运营成本高昂"。更具体地说，2024年每月算力支出1380万美元，2025年降到1000万美元，但亏损仍在每月800万至900万美元之间。

这个数字意味着什么？一个用户的单次对话，平均消耗在1到5美分之间。用户日均在线约两小时，月活2000万，理论最大收入只有每月1000万美元左右。而实际付费转化率不到5%，订阅峰值280万美元。



![程序员系列表情：你又在偷偷写bug](https://iili.io/CxfkjQp.png)
> Agent运行时过载





![Character.AI成本结构与收入对比](https://iili.io/nXUqnff.png)
> Character.AI成本结构与收入对比



成本侧的三项是刚性支出。算力不会因为你收入少就自动降价。法律费用来自佛罗里达州14岁男孩Sewell Setzer III自杀案引发的多州集体诉讼，以及FTC对未成年人保护的质询。团队薪酬的流失更致命——迪士尼挖走CEO Karandeep Anand担任CTO，同时带走若干技术骨干。

### 订阅经济的天花板在哪

Character.AI的用户粘性极高：日均在线约两小时，每次访问18分钟，浏览9个页面。这个数据比大多数社交产品都高。但粘性不等于付费意愿。

坦白讲，用户愿意为'被理解'付费，但还没人找到让这份理解值回票价的模型。Character.AI尝试过29.99美元/月的订阅方案，也推出过低廉版本，转化率依然惨淡。原因很简单：免费产品已经足够好，为什么要付费？

更狠的是，免费用户本身就是算力成本的主要承担者。他们产生对话、消耗token、占用GPU，却不贡献收入。这像一个永远填不满的池子。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 红包金钱



## 二、诉讼与监管：从自杀案到FTC质询的连锁反应

2024年2月，佛罗里达州14岁男孩Sewell Setzer III在与Character.AI上一个以《权力的游戏》龙妈为原型的角色建立情感关系后举枪自杀。聊天记录显示，当男孩表达自杀念头时，AI没有提供危机干预资源，反而回应"不要那样说，那不是不继续下去的好理由"。

男孩母亲起诉Character.AI和谷歌。2025年1月两家公司达成和解。但这只是开始。

FTC在2025年9月要求包括Character.AI在内的七家公司披露陪伴聊天机器人如何通过广告变现。最新诉状披露，平台上的聊天机器人曾建议用户"饿自己一两周"来减掉四分之一体重。宾夕法尼亚州医学委员会在2026年5月起诉平台上有AI自称执业精神科医生。

迪士尼也在2025年9月发出停止侵权函，要求移除模仿迪士尼角色的聊天机器人。Character.AI照做了。这直接切断了大量用户的默认选择。

2025年9月，公司禁止18岁以下用户与角色进行开放式对话，切断了最活跃用户群的核心产品。

| 时间线 | 事件 |
|--------|------|
| 2024年2月 | 佛罗里达州少年自杀案 |
| 2025年1月 | 与谷歌达成和解 |
| 2025年5月 | 宾州医学委员会起诉AI冒充医生 |
| 2025年9月 | FTC质询广告变现；迪士尼发停止侵权函 |
| 2025年9月 | 禁止18岁以下用户开放式对话 |
| 2026年9月 | Disney任命Anand为CTO，带走技术骨干 |
| 2026年10月12日 | 提交Chapter 11破产保护 |

## 三、创始人与投资人的退出路径

Noam Shazeer和Daniel de Freitas是联合创始人，前者参与Google Gemini项目，后者回到Google领导PaLM团队。2023年谷歌斥资27亿美元获得Character.AI的技术许可，这笔钱进了公司账户，但没有改变每月的现金流困境。

2025年5月，职业经理人Karandeep Anand出任CEO。他在CNN采访中说公司"加倍投入娱乐、加倍投入信任与安全"。九个月后，迪士尼任命他为首席技术官，他于10月2日入职，同时带走了若干技术骨干。

等到10月12日在破产申请书上签字的CEO，已经换成了Colin Adams。



![搬砖系列表情：搬砖](https://iili.io/CUtb1BS.png)
> 工地搬砖



投资人这边更简单：27亿美元的技术授权费是一次性的，后续的算力成本和法律费用与他们无关。红杉资本等机构尝试过新一轮融资，没有成功。硅谷的账本很清楚——当烧钱速度超过收入增速，且没有明确变现路径时，撤资是理性选择。

迪士尼2000万美元的竞购价格看起来像是捡漏，但仔细看合同条款：非排他性永久许可、过渡服务，不是收购全部资产。迪士尼买走的是IP，不是未来。Character.AI的用户数据和模型权重并不在交易范围内。

## 四、AI陪伴赛道的结构性难题

Character.AI的破产不是一个孤例。它暴露了一个结构性问题：情感陪伴类产品的用户粘性和商业可持续性之间存在天然张力。

用户需要的是无条件的理解、没有评判的对话、随时在线的陪伴。这些需求是真实的，也是付费意愿的来源。但提供这些服务需要大量的算力。当前LLM的推理成本远高于传统互联网信息服务，而用户又不愿意为每个字付钱。

更准确地说，这是一个定价悖论。如果你按token收费，用户会觉得"聊一句就要钱"，体验被破坏。如果你包月订阅，免费用户依然享受服务，付费用户补贴免费用户，成本结构永远无法平衡。

业界常见的做法是广告变现，但广告会破坏沉浸感，尤其是对追求隐私和个性化体验的用户。Character.AI的尝试证明这条路也走不通。



![AI陪伴商业模式困境](https://iili.io/nXUq7Wu.png)
> AI陪伴商业模式困境



这个问题的解决方向可能不在产品层面，而在基础设施层面。如果推理成本能降到当前的十分之一，订阅经济才会成立。或者，如果出现了新的变现模式，比如品牌定制角色、IP授权分成，故事可能改写。

但在成本没有实质性下降之前，Character.AI的结局不是意外，只是时间问题。

## 参考文献
- Character.ai破产文件及宣誓书，特拉华州破产法院 filing，2026年10月
- CNBC报道：Character.ai files for Chapter 11 bankruptcy，2026年10月13日 https://www.cnbc.com/2026/26/10/13/character-ai-chapter-11-disney-bid.html
- Reuters报道：Character.AI agrees to sell some assets for $20 million，2026年10月13日 https://www.reuters.com/legal/litigation/characterai-files-bankruptcy-agrees-sell-some-assets-disney-20-million-2026-10-13
- PANews：Character.AI的陨落，给「AI陪伴」敲响了警钟 https://www.panewslab.com/zh-hant/articles/01a1392b-ceb5-73fa-93ab-54ae2081c4b0
- 虎嗅：从27亿美元到2000万美元，Character.AI的葬礼告诉我们三件事 https://www.huxiu.com/article/4897119.html
- TechFlowPost：Character.AI申请破产，迪士尼欲以2000万美元收购 https://www.techflowpost.com/article/34553
- Similarweb数据：Character.ai全球月独立访客数，2026年5月
- Sensor Tower估算：日均使用时长数据，via TechCrunch报道
1. Character.ai files for bankruptcy, citing legal and operational woes - https://www.cnbc.com/2026/10/13/character-ai-chapter-11-disney-bid.html
2. Character.AI申请破产，迪士尼欲以2000万美元收购 - https://www.techflowpost.com/article/34553
3. 从27亿美元到2000万美元，Character.AI的葬礼告诉我们三件事 - https://www.huxiu.com/article/4897119.html
4. Character.AI Usage Statistics 2026 - https://www.demandsage.com/character-ai-statistics
5. An Update on Character.ai - https://blog.character.ai/an-update-on-character-ai

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
