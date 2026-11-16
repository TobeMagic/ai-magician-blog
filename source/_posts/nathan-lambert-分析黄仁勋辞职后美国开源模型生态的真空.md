---
title: "Nathan Lambert 分析黄仁勋辞职后美国开源模型生态的真空"
date: "2026-11-15 10:06:13"
updated: "2026-11-16 05:10:42"
permalink: "posts/2026/11/15/nathan-lambert-分析黄仁勋辞职后美国开源模型生态的真空/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/15/nathan-lambert-分析黄仁勋辞职后美国开源模型生态的真空/"
article_id: "a58d1728-73b7-4459-9aac-2b26ab32e26c"
description: "英伟达CEO黄仁勋辞职后，美国开源AI模型生态面临前所未有的真空。Interconnects创始人Nathan Lambert指出，开源模型永远追不上闭源前沿系统，但这恰恰不是问题所在——英伟达支持开源的真正动机是防止大客户自研芯片，而非理想主义。随着鹰派政策上台，中美开源合作断裂，美国本土开源生态的根基正在松动。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/8f706850-eb30-4c78-85e5-09c69951fac0.png"
imgTop: false
---

黄仁勋辞职第三天，Nathan Lambert在Interconnects写了一篇文章，标题就叫《没有黄仁勋的开源AI》。他不是悲观，而是说了一件事：英伟达从来不是因为热爱开源才支持开源的。

## 黄仁勋走了，第一件事是什么都没变

### 英伟达支持开源的真实动机：不是理想，是生意

Lambert的判断很直接。英伟达投资开源生态是一笔预防性支出：如果Meta、Google、Amazon这些大客户有足够的利润空间自己造芯片，英伟达的GPU业务就会萎缩。支持开源模型，让这些公司把预算花在买卡上而不是建厂上，是一笔划算的账。

黄仁勋过去几年对开源的注资节奏，Lambert用「flood the zone」来形容：到处撒钱，把开源阵营的旗子都插上。他预计这笔资金会很快收紧。对英伟达来说，黄仁勋离场后的第一要务是「稳住船」：未来24个月向客户交付，防止内部崩塌。开源从一个创始人式的豪赌，降格为第一刀可以被砍的选项。

### 防止客户自研芯片，才是开源生态存在的理由

开源在这里扮演的是「吸金海绵」的角色。大模型训练是个烧钱机器，开源社区把注意力、论文、checkpoint都放在上面，客户就没闲钱去搞自研架构。英伟达的逻辑不是「开源让AI更民主」，而是「开源让英伟达继续垄断」。权重越开放，推理侧对算力的依赖越深，客户的自研动机被越往后推。

## 开源模型永远追不上闭源，这正常吗

### Nathan Lambert的判断：差距不会消失，也不该消失

Lambert反复强调一个反直觉的结论：开源模型不可能在所有能力上追上闭源前沿——这是结构性的事实。闭源公司有更大的算力池、更封闭的高质量数据、更密集的工程师投入，还有产品上线后的用户反馈闭环。开源团队在这些维度上天然吃亏。

他的预测更具体：最强的开源模型会持续落在前沿闭源系统后面几个月，差距集中在可靠性、编码智能体和通用助手能力上。但「追不上」不等于「没用」，开源的价值从来不在benchmark榜首上。

### 「追不上」不等于「没用」

Lambert在Turing Post的访谈里把开源的战场拆成三块：科学实验（研究者拿得到完整权重和方法）、透明AI研究（决策过程可审计）、主权AI（企业和政府不想把核心数据交给闭源API）。开源模型在可重复的企业级工作负载上竞争力正在变强，而中国开放权重模型在编码和智能体任务上已经是可信的替代选项，美国机构正在承受重建一个有竞争力开源生态的压力。

把这个价值循环画出来：



!["大客户自研芯片风险"](https://iili.io/oJzFNBS.png)
> "大客户自研芯片风险"



黄仁勋在的时候，这条链路的燃料是他个人的判断力和钱包。他走了，每个环节都要重新找燃料。

## 中美开源合作的隐秘纽带正在断裂

### 中国实验室用Blackwell GPU训练开源模型，英伟达知情但不阻拦

这件事在业内几乎是公开的秘密。中国头部AI实验室——DeepSeek、Moonshot、Qwen背后的团队——都在用英伟达最新的Blackwell架构训练开源模型。英伟达清楚这些卡的流向，但在黄仁勋时代选择不追查。原因是复杂的：中国市场贡献了真实收入，而开源权重回流美国又间接丰富了本土生态的训练数据。SemiAnalysis在研报《Nvidia and the World Without Jensen》里写得更直白：美国开源生态和许多初创公司依赖中国AI模型，黄仁勋一走、鹰派占上风，这个生态会受到严重损害。

### 这是公开的秘密，也是黄仁勋时代的平衡术

SemiAnalysis给出的更深层解释是：黄仁勋辞职的时间点，与大规模逃避海关监管的GPU运输直接相关。该机构的加速器追踪模型显示，超过1.5GW受管制的英伟达芯片最终仍流入了中国，这个数字还不包括英伟达为规避美国规定专门设计的芯片。美国情报界被认为是推动黄仁勋离场的重要力量，而Remote Access Security Act（RASA）或类似立法大概率继续推进，RASA已经在众议院获得通过。

### 鹰派上台后，MATCH Act式限制将取代灰色地带

SemiAnalysis的立场很清晰：支持对华限制，但设计应更接近MATCH Act，而不是RASA。现行「中国实验室远程使用GPU」的制度有一张明确的好处清单：利润流向美国公司；美国能实时看到中国实验室在做什么；美国若愿意，可以用政治或强制手段几乎立刻切断GPU使用权；英伟达、AMD、博通、谷歌、亚马逊、微软、Meta、超微电脑和戴尔都在供应链上与中国企业互相依赖。这张清单一旦因为鹰派立法被拆除，开源模型的中外协作链条就会断裂，灰色地带被硬性替代。

## 没有黄仁勋的英伟达，还是英伟达吗

### SemiAnalysis的判断：这家公司是以他本人为中心构建的

SemiAnalysis的评估没有委婉空间：英伟达从来就不是为了在没有黄仁勋的情况下运作而设计的。研报的原话是：没有马斯克，SpaceX和特斯拉无法运作；没有黄仁勋，英伟达也无法运作。

### 33年掌舵，60名直属下属，独特的组织形态

按黄仁勋的公开说法，他大约有60名直接下属。对一家规模如此庞大的公司，这个结构极其罕见，通常意味着高度集中的决策权和个人影响力。英伟达内部被称为「世界上规模最小的大公司」：市值巨大，员工只有约4.2万人。组织像一个只有一位国王的王国——黄仁勋说过，谁向谁汇报并不重要，头衔与工作的实际重要性无关。

### 董事会可以迫使他离开，但改变不了公司的基因

董事会的调查和辞职已经发生，留下来的是一个失去核心运营者的公司。Lambert在Interconnects里写：英伟达的业务运营以众所周知的方式极度依赖黄仁勋本人，行业共识是挑战还在后头——更多的高调离职、芯片走私调查、被挖角的核心人才。未来24个月，「稳住船、向客户交付、防止内部崩塌」是这家公司的第一目标。没有黄仁勋，这些目标的完成概率都要重新算。

## 开源AI的下一步：ATOM Project能撑多久

### Lambert发起的ATOM Project主张全面开放

Lambert在2025年8月发起ATOM Project，主张为美国研究和产业建设完全开放的模型：训练数据、中间checkpoint、代码、宽松许可全部公开。他离开Ai2之后，担任Trillium Labs的创始人与董事，并通过Interconnects继续做开源模型和政策研究。Interconnects目前有超过8万订阅者，这是当前开源生态里少数有分量的独立声音。

### 资金链会在比所有人想的更早断裂

Lambert把后黄仁勋时代的开源挑战拆成两条：第一是政治敞口，开源模型在华盛顿的盟友正在撤退，鹰派立法随时可能把远程使用GPU的灰色地带拆掉；第二是投资，没有了英伟达的兜底，开源模型开发者需要比预期更早找到盈利产品，而前沿模型越来越贵，支持开源的资金结构会随之瓦解。两条线互相挤压，资金链的断裂会来得比大多数人预期的更早。

对读者的可执行判断：如果你的产品构建在开源模型上，别拿benchmark榜单评估风险，盯住两个指标：RASA及配套立法落地节奏，以及ATOM Project能否在英伟达之外找到第二笔机构资金。前者决定灰区还剩多久，后者决定开源生态的下一根燃料棒从哪来。

## 参考文献
- Interconnects: Open-source AI without Jensen (Nathan Lambert). https://www.interconnects.ai/p/open-source-ai-without-jensen
- BlockBeats: SemiAnalysis研报《英伟达的后黄仁勋时代》（Nvidia and the World Without Jensen）. https://www.theblockbeats.info/news/64137
- Turing Post: Will Open Models Catch Up? Nathan Lambert on Open vs Closed AI Models. https://www.turingpost.com/p/nathanlambert
- Nathan Lambert on X. https://x.com/natolambert
- Latent Space: The ATOM Project profile. https://latent.space/wiki/nathan-lambert

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
