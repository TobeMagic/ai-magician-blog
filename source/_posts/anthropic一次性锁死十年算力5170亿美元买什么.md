---
title: "Anthropic一次性锁死十年算力，5170亿美元买什么"
date: "2026-09-08 01:00:02"
updated: "2026-09-08 01:07:23"
permalink: "posts/2026/09/08/anthropic一次性锁死十年算力5170亿美元买什么/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/08/anthropic一次性锁死十年算力5170亿美元买什么/"
article_id: "d5647963-758d-4331-a028-94a411f11fe3"
description: "Anthropic在11个月内签下至少14.8 GW算力协议，潜在总支出高达5170亿美元，绝大部分支出横跨未来十年。这一举动看似激进，实则源于Claude Code和Cowork需求爆发带来的真实压力。文章拆解其算力合作版图背后的商业逻辑、硬件选型策略，以及这场巨额投入对AI行业竞争格局意味着什么。"
cover: "/var/lib/aimagician/artifacts/covers/d5647963-758d-4331-a028-94a411f11fe3/d727a317-b3a0-4433-96ba-f7f9d62d17cf/cover.png"
imgTop: false
---

去年这个时候，Anthropic的算力承诺还只有1-2 GW。11个月后，这个数字变成了14.8 GW。不是买断，是签下未来十年的长期租赁协议。

## Claude的算力饥渴从哪里来

### Claude Code与Cowork的增长曲线超出预期

问题的起点不是算力协议本身，而是协议背后的产品需求。2025年上半年，Anthropic的内部数据开始显示两个产品在超出预期的速度增长。

Claude Code是一个编程助手工具，直接嵌入开发者的工作流。Cowork则是面向团队的协同AI平台。两者的共同特征是：每次请求的token消耗远高于传统对话场景，且用户粘性极强——一旦开发者习惯了Claude Code补全代码的速度，切换成本很高。

根据Anthropic官方发布的2026年6月《Economic Index》报告，Claude的日活跃请求数在2025年下半年出现了明显的阶梯式跃升，与Claude Code的发布节点高度吻合。报告未披露具体数字，但指出「编码类请求的增长斜率显著高于其他场景」。

这意味着什么？一个典型的编码会话可能包含数十次API调用：解读需求、生成代码、审查修改、解释原理。如果一万个开发者每天使用Claude Code，实际消耗的算力可能是传统对话场景的十倍甚至更多。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> Claude Code 的高频调用让后端吃不消



更关键的是，这些用户并非边际贡献者。编码用户的月付费意愿和续费率，明显高于偶尔提问的用户群体。收入增长和算力需求形成正向循环——赚得越多，需要训练的模型越大，需要的算力越多。

### 从谨慎到激进：Anthropic策略转变的时间点

Anthropic历史上以谨慎著称。2023年之前，公司长期保持「够用就好」的基础设施哲学，认为算力投资应该紧跟产品节奏，而非超前囤积。

转折点出现在2025年10月。这之后，Anthropic密集签下了与Amazon、Google、Microsoft等多家云厂商的算力协议。

策略转变的原因很直接：竞争窗口在收窄。OpenAI在2025年加速了数据中心建设，并持续加大基础设施投入。如果Anthropic按原有节奏逐步扩展，将面临严重的算力瓶颈——模型训练排队、推理延迟上升、用户等待时间变长。这些都会直接伤害产品体验。

坦白讲，14.8 GW不是一个随意拍脑袋的数字。它对应的是一个具体的计算需求模型：在给定Claude 3.7和后续版本的性能目标下，要支撑编码场景的指数级增长，同时保持推理延迟在可接受范围内，这是必要的容量规模。

但14.8 GW只是签约规模，实际分阶段部署，大部分在2027至2030年间陆续上线。 Anthropic并没有一次性建好所有数据中心，而是通过多轮协议锁定优先级。

这14.8 GW的合同按支出结构大致分为三块：云算力租赁约2800亿美元，芯片采购约1300亿美元，数据中心及相关基础设施约1070亿美元。云算力是最大头，原因在于GPU和TPU的使用周期通常需要5-10年才能摊销，短期买断不划算。

从云厂商的份额来看，Amazon和Google占了大头。AWS的协议覆盖约5 GW，对应1000亿美元以上的10年期承诺；Google Cloud加Broadcom的TPU组合提供3.5 GW，其中3.5 GW部分预计2027年起陆续上线，成本约210亿美元。Microsoft与NVIDIA合作的1 GW协议规模较小，更多是补充性配置。

SpaceX的角色比较特殊。它并非直接提供算力，而是通过Colossus数据中心为Anthropic提供物理空间和电力接入。据公开信息，Anthropic租下了SpaceX Colossus 1的全部容量，包含超过22万张NVIDIA GPU（含H100、H200、GB200），这部分以基础设施租赁形式计入总账。

更值得关注的是「已签约」和「实际使用」之间的差距。14.8 GW是合同上限，不代表每年都用满。Anthropic目前年化收入约650亿美元，按行业惯例，算力支出与收入的比例通常在2:1到3:1之间。这意味着即使全部14.8 GW投入使用，也需要数年时间逐步释放负载。部分协议期限延续到2030年以后，说明Anthropic在押注更长期的增长曲线。



![程序员 reaction：hands-onsynergyandestablish](https://iili.io/CCZAFvS.png)
> 算力版图正在形成





![Anthropic算力协议结构图](https://iili.io/n3nDdc7.png)
> Anthropic算力协议结构图



这种多层叠加的策略，本质是在产能紧张的环境下抢时间窗口。2026-2027年是下一代芯片密集交付期，谁能提前锁定产能，谁就能在训练成本上形成结构性优势。Anthropic的选择是用长期合同对冲短期风险，代价是未来十年的现金流压力。



![程序员 reaction：PEOPLETHEWRONGINFORMATION](https://iili.io/CAYaRjt.png)
> ##Claude的算力饥渴从哪里



## 这不是冲动消费，是算过的账

### Anthropic年化收入超300亿美元，支撑力在哪

5170亿美元的潜在支出，看起来像是一个初创公司开出的空头支票。但把时间轴拉长到十年，再结合收入增速看，这个数字的逻辑就清晰了。

根据公开报道，Anthropic在2026年8月的年化收入已达到300亿美元，超过OpenAI同期的250亿美元，成为全球营收最高的基础模型公司。这一数字主要来自Claude API调用、Claude Code订阅和企业级合同。按该增速，五年后的年化收入有望达到500亿至600亿美元区间。

这里的关键不是「现在能不能付得起」，而是「未来现金流能否覆盖当前承诺」。14.8 GW的10年期协议，年均支出约517亿美元，而当前年化收入300亿、五年后预估500亿+，边界处于可控范围。前提是需求曲线不出现断崖式下跌。

从另一个角度看，这5170亿不是已经花出去的钱。大部分支出是未来十年内按需支付的运营费用（OpEx），而非一次性资本支出（CapEx）。Anthropic可以根据实际负载情况灵活调整利用率，未使用的容量不会自动产生成本。这种「锁定容量、按需计费」的模式，本质上是把算力当作一种长期期货来管理。



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> 收入增速决定支出上限



### 为什么选择长期租赁而非一次性购买

这里有一个常见的误解：买设备比租设备便宜。这个结论在短周期内成立，但在AI算力这个特定场景里，长期租赁往往更划算。

原因在于GPU的生命周期和贬值速度。以NVIDIA H100为例，其典型服役周期为3到5年，之后性能会被新一代产品拉开差距。如果2024年买入H100集群，到2029年这批芯片的实际利用率会大幅下滑，届时要么升级替换，要么承担高昂的沉没成本。而租约模式把设备迭代风险转嫁给了云厂商——AWS、Google Cloud承担硬件折旧，Anthropic只需要为实际使用的算力付费。

另一个因素是资金效率。5170亿美元如果以CapEx形式一次性投入，意味着公司资产负债表上会出现巨额的固定资产，这会显著影响现金流和融资能力。相比之下，OpEx模式的支出可以随收入增长而线性扩张，财务结构更轻盈。这也是为什么Anthropic的选择是租而不是买。



![程序员 reaction：react/angutaoType](https://iili.io/CAY3X0G.png)
> 硬件选型的背锅现场



### TPU、Trainium、GPU多供应商策略的底层逻辑

Anthropic的算力版图覆盖了四个硬件平台：NVIDIA GPU、AWS Trainium、Google TPU、AMD GPU。这不是资源分散，而是一种刻意设计的风险对冲策略。

单一供应商依赖的风险显而易见：议价能力弱、供应中断时没有替代方案、技术路线被绑定。Anthropic的做法是把训练和推理负载分散到不同架构上——Claude已在超过100万枚Trainium2芯片上运行（AWS Rainier集群），同时通过Google-Broadcom合作获得下一代TPU产能，并通过AMD协议获取2 GW的新型芯片容量。NVIDIA GPU则继续承担部分推理和高密度训练任务。

这种多供应商策略的核心逻辑是竞争驱动的议价权。每个云厂商都知道Anthropic有备选方案，这在合同谈判中是实打实的筹码。同时，不同芯片架构在成本和能效上各有优势：Trainium在性价比上有竞争力，TPU在大规模分布式训练上效率突出，NVIDIA GPU在软件生态和兼容性上仍然是首选。Anthropic根据任务特征选择合适的硬件组合，而不是把所有鸡蛋放在一个篮子里。



![Anthropic算力采购的多维决策矩阵](https://iili.io/n3nDcVR.png)
> Anthropic算力采购的多维决策矩阵



从工程角度看，多供应商也意味着更高的运维复杂度——不同硬件需要不同的优化工具链、监控体系和故障排查流程。Anthropic选择承担这个复杂度，换来的是长期供应链的安全和成本弹性。这是典型的「用工程换战略」的取舍。

## 这场算力军备赛的下一步

### Anthropic的16 GW vs OpenAI的规划差距在哪

把 Anthropic 和 OpenAI 放在一起比，首先要明确一个事实：两家的起点不同。OpenAI 从 GPT-3 时代起就在持续积累算力合同，基础设施规模有复利效应；Anthropic 是去年下半年才开始加速签约，属于追赶型扩张。

已签约总规模方面，Anthropic 目前锁定约 16 GW（含此前已有的 1–2 GW），其中 Amazon AWS 贡献 5 GW，Google Cloud 新增 5 GW，Google + Broadcom TPU 组合贡献 3.5 GW，Microsoft + NVIDIA 合计约 1 GW，SpaceX Colossus 提供超过 22 万张 GPU 的物理空间，AMD 协议约 2 GW，其余分散在 Fluidstack、Nscale、Lambda 等二级供应商。这个规模在 2025 年中期之前几乎不可想象。

OpenAI 这边的数据来自投资者文件。公开信息指向其目标算力规划在 2026–2027 年间达到约 30 GW 以上，且合作方阵容以 Microsoft Azure 为主，辅以部分自建数据中心的扩展计划。双方差距大约在 10–15 GW 的区间。

这个差距意味着什么？

训练端差距不大。当前最强模型的训练算力需求集中在 10–20 EWFLOP 量级，16 GW 与 30 GW 在训练容量上都能覆盖，区别在于冗余度和未来扩容弹性。推理端差距会更明显。Claude Code 和 Cowork 的用户量增长曲线超出预期，推理流量呈指数级膨胀，算力合同的边际成本（每新增一 GW 带来的成本下降）才是真正拉开差距的地方。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> 算力合同签一年少一年



### 如果算力成为护城河，模型能力还能否拉开差距

这个问题需要先定义「护城河」。如果护城河指的是「你能训练出别人无法复制的模型」，那么算力本身不够，算法创新、数据质量和训练效率同样重要。但如果护城河指的是「你能以更低单位成本服务更多用户」，那么算力合约就是硬实力。

Claude Code 的用户付费率数据来自 Anthropic 自身披露：年化收入超过 300 亿美元，部分报道提到已逼近 650 亿美元。这个数字支撑了 5170 亿美元的潜在支出承诺。换算下来，算力支出约占年化收入的 8 倍——跨度是十年，每年摊销约 517 亿美元，在收入持续增长的前提下是可控的。

关键在于：当算力合约成为竞争要素，模型能力还能否独立拉开差距？

短期内可以。SFT 数据的质量、RLHF 的反馈质量、推理时的工具调用能力和错误容忍度，这些维度都不完全取决于 GPU 数量。OpenAI 在 GPT-4 到 GPT-4o 的迭代中，推理效率的提升幅度远超算力增长幅度，说明算法优化仍有显著空间。

但中长期看，算力合约的规模效应会限制追赶者的选择。当 Anthropic 和 OpenAI 都锁定了十 GW 级别的产能，后续新进入者或小型团队将面临两个现实问题：一是买不到同等的算力合约，二是即使买到，单位成本也会更高。这会形成一种结构性壁垒。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 算力即基建，基建即壁垒





![算力护城河与模型能力关系](https://iili.io/n3nbCen.png)
> 算力护城河与模型能力关系



这里有一个需要注意的边界：算力合约的锁定期越长，风险也越大。如果模型训练范式发生突变，现有 GPU 架构可能不再是性价比最优解。这也是 Anthropic 选择多供应商（NVIDIA、AMD、Google TPU、AWS Trainium）而不是全部押注单一厂商的原因。

### 行业可能出现的三种响应路径

**路径一：追赶型签约潮。** 其他头部实验室在接下来 90 天内公布同等规模的算力合约。如果 Anthropic 的模式被验证为可行（收入能覆盖支出），竞争者会跟进锁定自己的产能。这是最直接的响应。

**路径二：生态锁定型竞争。** 不再单纯比拼 GPU 数量，而是通过独家合作、定制芯片、联合研发等方式加深与云厂商绑定。Anthropic 与 Broadcom 的 Ironwood TPU 方案、与 AWS 的 Trainium 深度合作，都是这条路的前兆。未来可能有更多定制化硬件合作出现。

**路径三：效率优先型路线。** 承认无法在合约规模上竞争，转而投资模型压缩、推理蒸馏、稀疏架构等技术，用更少的算力完成同等任务。这条路适合资源有限但技术能力强的团队。

三种路径没有绝对优劣，取决于各自的技术积累和资金状况。但对行业而言，最大的变化是：算力合约已经从运营成本变成战略资产，签合同的时机比签价格更重要。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 十年算力的账单要分期付



从经验看，这场军备赛的最终落点不在于谁签的 GW 数最大，而在于谁能把合约里的算力转化为可感知的产品优势。Claude Code 的活跃用户数和 Cowork 的订阅转化率，才是 Anthropic 这次豪赌的真正验收标准。

判断很简单：如果 Claude 的付费用户在 2027 年中突破 5000 万，这次合约就是教科书级的战略预判。如果用户增长停滞，5170 亿美元就是行业历史上最昂贵的试错成本。

## 参考文献
- The Information, 2025年9月6日报道，Anthropic 算力协议规模
- Sina Finance, 2026年9月7日，5170亿美元、Claude锁定14.8GW算力
- TamilTech, 2026年，Anthropic + Google + Broadcom 3.5 GW TPU协议详解
- Converge Digest, 2026年，Amazon-Anthropic 5GW AWS Trainium协议
- Analytics Insight, 2026年，Anthropic secured 3.5GW AI Compute Deal
- Core Y Trinetti LinkedIn分析, Anthropic's US compute footprint and capacity pipeline
[1] 5170 亿美元、Claude 锁定14.8 GW 算力. https://finance.sina.com.cn/roll/2026-09-07/doc-iniqzhfq9598584.shtml
[2] 5170 亿美元、Claude 锁定14.8 GW 算力 - 网易. https://www.163.com/dy/article/L68QNBV20511D6RL.html
[3] sleepy.md on X: "Anthropic 开始把未来十年的算力提前锁死了。 The .... https://x.com/sleepy0x13/status/2096832574702354572
[4] Anthropic 过去11 个月新签下至少14.8GW 算力，未来几 .... https://x.com/divid_lu49394/status/2097071229899612311
[5] Google Bets $40 Billion on Anthropic as AI Compute Race E.... https://opentools.ai/news/google-bets-40-billion-on-anthropic-as-ai-compute-race-escalates
[6] Anthropic + Google + Broadcom: 3.5 GW Compute, $21B TPU... - Tamiltech. https://tamiltech.in/article/anthropic-google-broadcom-partnership-35-gigawatts-tpu-ironwood-21-billion-2026
[7] Anthropic Reportedly Hits $30B ARR and Signs 3.5 GW Compute Deal With Google and Broadcom - Tech Jacks Solutions. https://techjacksolutions.com/ai-brief/anthropic-reportedly-hits-30b-arr-and-signs-35-gw-compute-de
[8] Amazon-Anthropic $100B Deal: 5GW of AWS Trainium Compute | Nerd Level Tech. https://nerdleveltech.com/amazon-anthropic-100-billion-aws-trainium-5gw-deal
