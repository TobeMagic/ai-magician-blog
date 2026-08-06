---
title: "Anthropic 与成立仅数月的云初创公司 Volta 签署 100 亿美元算力协议"
date: "2026-08-06 09:00:02"
updated: "2026-08-06 09:34:56"
permalink: "posts/2026/08/06/anthropic-与成立仅数月的云初创公司-volta-签署-100-亿美元算力协议/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/08/06/anthropic-与成立仅数月的云初创公司-volta-签署-100-亿美元算力协议/"
article_id: "0c50b897-6e58-4d0c-9d25-00023a1838e3"
description: "Anthropic 与成立仅数月的云初创公司 Volta 签署 100 亿美元算力协议，约合每年 17 亿美元。Volta 估值 24 亿美元，硬件几乎全为租用：算力来自比特币矿商 Bitdeer 挪威 121MW 站点，芯片由 Nvidia 供应、Dell 组装。Anthropic 买的是交付速度，代价是承担超大规模云厂商合同从未有过的交易对手风险。"
cover: "/var/lib/aimagician/artifacts/covers/0c50b897-6e58-4d0c-9d25-00023a1838e3/8fab6bf1-4679-4f41-bf8d-f82ef83b3464/cover.png"
imgTop: false
---

## Volta 的商业模式：租用而非自建

Volta 成立于 2026 年 1 月，由 Brookfield Asset Management 前高管创立。公司估值 24 亿美元，完成 3 亿美元种子轮和 A 轮融资，投资方包括 Andreessen Horowitz、Altimeter、Nvidia 以及 Michael Dell 家族办公室。这笔融资规模对于一家成立数月的公司而言并不小，但与其 100 亿美元的合同相比，资本实力明显不对等。



![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> 被安排了



Volta 的核心策略是轻资产运营。挪威 Tydal 数据中心由比特币矿商 Bitdeer Technologies 运营，采用水力发电，规划装机功率 133MW。芯片由 Nvidia 供应最新的 Vera Rubin AI 处理器，服务器由 Dell 组装。Volta 本身不拥有硬件，也不运营数据中心，而是作为中间层连接算力供应方与需求方。

交付分两个阶段完成，预计最迟于 2027 年 3 月全部交付。Volta 同时宣布已锁定总计 1GW 的数据中心电力资源，计划在德州和怀俄明州建设额外站点，目标到 2030 年部署多吉瓦级容量。

## 为什么 Anthropic 选择初创公司

Anthropic 近几个月一直在积极储备算力。除 Volta 外，公司已与 SpaceX、AMD、Akamai 签署算力协议，并洽谈租用 Meta 数据中心。这种多线布局反映出一个事实：传统云厂商的交付周期无法满足 Claude 产品需求的增长速度。

AWS、Azure、Google Cloud 的超大规模算力合同通常需要 18 至 24 个月交付。Volta 的挪威项目预计 2027 年 3 月交付，时间窗口明显更短。对 Anthropic 而言，六年的 100 亿美元承诺换取的是确定性的交付节奏，而非硬件所有权。



![搬砖系列表情：见鬼，难道这帮人都不用搬砖的吗](https://iili.io/CUyWCes.png)
> 工地搬砖



算力竞赛的本质是时间竞争。模型迭代周期缩短，推理需求指数增长，等待传统云厂商的排期意味着市场份额的流失。Anthropic 的选择反映了一个行业趋势：头部 AI 公司正在绕过传统 IaaS 层，直接与算力供应方建立点对点关系。

## 交易对手风险的具体形态

这笔交易的风险结构与传统云合同截然不同。AWS 或 Azure 的 100 亿美元合同背后是数百亿美元的年收入和成熟的履约能力。Volta 的年收入尚未公开，估值 24 亿美元，3 亿美元融资，却要交付 100 亿美元的算力服务。

交付违约的可能性来自多个层面。硬件层面，Nvidia Vera Rubin 芯片的供应能力尚未验证，Dell 的组装产能是否存在瓶颈未知。运营层面，Bitdeer 作为比特币矿商转型数据中心运营，其 AI 算力运维经验有限。资金层面，Volta 需要持续融资来支撑硬件采购和运营支出，若融资环境恶化，项目可能中断。



![程序员 reaction：哈！我咋不懂](https://iili.io/CAYtnat.png)
> 反问质疑



资金链断裂的传导路径更为直接。Volta 向 Anthropic 承诺算力交付，需要向 Bitdeer 支付数据中心费用，向 Nvidia 和 Dell 采购硬件。任何一环的资金缺口都会传导至交付能力。Anthropic 作为买方，缺乏对 Volta 财务状况的透明度，也无法像传统云合同那样通过服务等级协议（SLA）获得充分补偿。

与 AWS、Azure 的合同相比，Volta 协议的交易对手风险显著更高。传统云厂商的违约成本是声誉损失和巨额赔偿，而 Volta 的违约成本可能是公司清算。Anthropic 承担的是超大规模云厂商合同从未有过的风险敞口。

## 对行业的启示

算力采购存在两种路径。第一种是传统模式：与 AWS、Azure、Google Cloud 签署长期合同，交付周期长但风险低。第二种是新兴模式：与初创公司或算力聚合商合作，交付速度快但风险高。



![程序员 reaction：definitelyaren'tamatch](https://iili.io/CClZ3Ft.png)
> 后端系统设计





![算力采购路径对比](https://iili.io/CrHYeyP.png)
> 算力采购路径对比



Anthropic 的选择反映了 AI 行业的一个结构性矛盾：模型迭代速度远超基础设施交付能力。当传统路径无法满足时间要求时，公司只能承担更高风险换取更快的交付。

这种模式能否持续取决于两个条件。一是 Nvidia 等芯片供应商能否扩大产能，缓解硬件瓶颈。二是初创公司能否在交付过程中维持资金链稳定，避免项目中断。若任一条件不满足，100 亿美元协议的履约质量将直接影响 Anthropic 的产品节奏。



![程序员反应图：吃我一招](https://iili.io/Cuz7V5X.png)
> 打工现场



对 Anthropic 而言，下一步的关键是监控 Volta 的交付进度和融资状况。若项目出现延迟或资金缺口，公司需要启动备选方案，可能是转向其他算力供应商，或调整 Claude 的产品发布计划。这笔交易的最终结果，将成为 AI 行业算力采购模式的一个标志性案例。

Anthropic 与成立仅数月的云初创公司 Volta 签署 100 亿美元算力协议，约合每年 17 亿美元。Volta 估值 24 亿美元，硬件几乎全为租用：算力来自比特币矿商 Bitdeer 挪威 133MW 站点，芯片由 Nvidia 供应、Dell 组装。Anthropic 买的是交付速度，代价是承担超大规模云厂商合同从未有过的交易对手风险。

## 对算力供应链的启示

这笔交易揭示了算力供应链的一个新趋势：AI 公司正在绕过传统云厂商，直接与芯片供应商、数据中心运营商、电力资源方建立联系。Volta 扮演的是整合者角色，把分散的资源打包成可交付的算力产品。

### 传统云厂商的护城河在变窄

过去，云厂商的护城河在于规模效应和全球布局。现在，芯片供应成为瓶颈，谁掌握芯片和电力，谁就有议价权。Nvidia 和 Dell 参与 Volta 投资，说明芯片厂商也在寻找新的交付渠道。

Anthropic 同时与 SpaceX、AMD、Akamai、Meta 签署协议，说明头部 AI 公司不再依赖单一供应商。这种多供应链策略降低了风险，但也增加了协调成本。

### 这种模式的适用边界

Volta 模式适合算力需求紧迫、资金充裕、能够承担交易对手风险的 AI 公司。对于中小公司，传统云厂商仍是更稳妥的选择，因为它们的合同条款更成熟，索赔机制更完善。



![程序员 reaction：beingable](https://iili.io/CrH7amF.png)
> 供应链选择的现实



当芯片供应缓解、云厂商产能释放后，这种初创整合模式的空间会收窄。但在 2027 年之前，算力短缺仍将持续，Volta 类公司仍有存在价值。

Anthropic 的选择不是最优解，而是在约束条件下的次优解。速度优先，风险后置。这种取舍在算力竞争窗口期内是理性的，但需要配套的合同条款和风险管理措施来对冲潜在损失。

## 谁在为风险定价

Volta 的投资者名单揭示了这笔交易的风险定价逻辑。3 亿美元融资由 Andreessen Horowitz、Altimeter、Azora 领投，Nvidia 和 Dell 家族办公室参与。这些投资者不是在做财务投资，而是在做战略押注。

Nvidia 的参与尤为关键。Vera Rubin 芯片是 Nvidia 2026 年发布的新一代 AI GPU，专为大规模训练设计。通过投资 Volta，Nvidia 不仅锁定了芯片的出货渠道，还建立了一个绕过传统云厂商的直销路径。Dell 的参与则确保了硬件组装和交付能力。

这种投资者结构意味着风险被分散到了产业链上游。Anthropic 承担的是 Volta 作为交易对手的风险，而 Volta 的投资者承担的是 Anthropic 作为客户的风险。如果 Anthropic 的 Claude 产品需求不及预期，Volta 的算力资产可能面临闲置；如果 Volta 的交付出现问题，Anthropic 需要寻找替代方案。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 算力供应链的重构





![算力供应链风险分散结构](https://iili.io/CrHaKN9.png)
> 算力供应链风险分散结构



## 为什么是 Volta

Anthropic 选择 Volta 而不是 AWS 或 Azure，核心原因是交付速度。传统云厂商的算力交付周期通常需要 18-24 个月，从选址、建设到部署芯片，流程冗长。Volta 的模式是租用现有数据中心，快速部署芯片，交付周期压缩到 6-12 个月。

这对 Anthropic 至关重要。Claude 的产品需求增长迅速，等待 18 个月意味着错过市场窗口。Volta 的挪威数据中心由比特币矿商 Bitdeer 运营，已有电力和冷却基础设施，Anthropic 只需要部署芯片即可开始训练。

投资者的参与进一步降低了风险。Nvidia 和 Dell 作为战略投资者，不仅提供了资金，还确保了芯片供应和硬件组装能力。如果 Volta 的交付出现问题，Nvidia 和 Dell 有动力介入协调。



![程序员系列表情：如果把面试官唬住了就要50k，没唬住就要5k](https://iili.io/CClZIPS.png)
> 交付速度的优先级





![传统云厂商 VS Volta 交付周期对比](https://iili.io/CrHaXDX.png)
> 传统云厂商 VS Volta 交付周期对比



但这笔交易的风险结构仍然不对称。Anthropic 承担了 Volta 作为交易对手的主要风险，而投资者的风险相对有限。如果 Volta 失败，Anthropic 需要重新寻找算力供应商，而投资者最多损失 3 亿美元投资。

传统云厂商的护城河正在变窄。AWS、Azure、GCP 的优势在于规模效应和全球基础设施，但这也意味着交付周期长、定制化能力弱。Volta 的模式是"轻资产 + 快交付"，通过租用现有数据中心、快速部署芯片，在 6-12 个月内完成交付。这对急需算力的 AI 公司更具吸引力。



![程序员 reaction：AGIisrightaround](https://iili.io/CrH7wmX.png)
> 被安排了



## 交易结构：谁在为风险定价

这笔交易的核心不是算力本身，而是风险分配。Volta 成立仅数月，融资 3 亿美元，估值 24 亿美元。投资者包括 Andreessen Horowitz、Altimeter、Nvidia，以及 Michael Dell 家族办公室。Nvidia 和 Dell 的参与不是偶然——它们需要验证 Vera Rubin 芯片在大规模部署中的表现，Anthropic 则是它们的战略客户。

Volta 的商业模式是典型的轻资产：不拥有数据中心，不持有芯片，只负责整合与交付。算力来自 Bitdeer 在挪威 Tydal 的站点，该站点原为比特币矿场，采用水力发电。Bitdeer 股价在消息公布后上涨 14%，说明市场认可矿商转型的叙事。

``mermaid
%% title: Volta 轻资产算力供应链
flowchart LR
  subgraph 资产层
    A[Bitdeer 挪威数据中心 133MW]
    B[Nvidia Vera Rubin 芯片]
    C[Dell 服务器组装]
  end
  subgraph 整合层
    D[Volta Infra Holdings]
  end
  subgraph 需求层
    E[Anthropic Claude 模型]
  end
  A --> D
  B --> C --> D
  D --> E
  style D fill:#f9f,stroke:#333



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 后端系统设计



### 为什么 Anthropic 选择初创公司

Anthropic 并非没有备选。它已与 SpaceX、AMD、Akamai 签署算力协议，并洽谈租用 Meta 数据中心。选择 Volta 的原因很实际：传统云厂商的交付周期太长。

AWS、Azure、GCP 的超大规模数据中心建设需要 2-3 年，而 Anthropic 的算力需求是即时的。Volta 承诺在 2027 年 3 月前完成交付，分两个阶段。这个时间窗口对 Anthropic 来说比交易对手风险更重要。

从经验看，AI 公司的算力焦虑已经超过了风险厌恶。当需求曲线陡峭时，企业会接受更高的不确定性。这不是 Anthropic 第一次这么做——它此前也选择过非传统供应商。

### 交付速度的优先级

Volta 已锁定 1GW 数据中心电力资源，挪威站点只是第一步。CEO 里卡德·博阿达向 Bloomberg 透露，公司还在德克萨斯州和怀俄明州建设站点，目标是 2030 年前部署多吉瓦容量。



![面对明显不属于自己的锅时强硬拒绝的表情](https://i.ibb.co/dwZpBDcP/transparent.png)
> 程序员现场



这种扩张速度依赖融资。Volta 同时宣布与 Azora 达成 50 亿美元 AI 基础设施计划。Azora 是资产管理公司，擅长为长期资产提供融资。这种「融资-建设-交付」的循环是 Volta 模式的核心。

但交付承诺能否兑现，取决于三个变量：芯片供应、电力许可、建设进度。Nvidia Vera Rubin 芯片的产能分配是最大不确定因素。Anthropic 能拿到多少，Volta 能拿到多少，都是未知数。

### 交易对手风险的具体形态

与传统云厂商合同相比，Volta 的交易对手风险有三个维度：

第一，财务风险。Volta 估值 24 亿美元，融资 3 亿美元。如果交付延迟或失败，Anthropic 的 100 亿美元承诺可能无法完全兑现。传统云厂商有资产负债表支撑，初创公司没有。

第二，运营风险。Volta 不拥有资产，只负责整合。如果 Bitdeer 的电力合同出现问题，或 Nvidia 的芯片供应被优先分配给其他客户，Volta 没有足够的缓冲。

第三，战略风险。Volta 的投资者包括 Nvidia 和 Dell。如果它们的战略优先级变化，Volta 的供应链可能受到影响。Anthropic 在承担一个多方博弈中的中间层风险。



![背锅系列表情：这口锅我背了](https://i.ibb.co/tTZxpZF0/transparent.png)
> 工地搬砖



## 算力供应链的结构性变化

### 传统云厂商的护城河在变窄

这笔交易释放了一个信号：超大规模 AI 公司正在绕过传统云厂商，直接与基础设施层建立关系。这不是 Anthropic 第一次这么做，也不会是最后一次。

传统云厂商的护城河在于规模、稳定性和全球覆盖。但对于 AI 公司来说，这些优势正在被交付速度抵消。当需求是「现在就要」时，规模优势变成负担。

``mermaid
%% title: 传统云厂商 VS 轻资产初创的权衡
flowchart LR
  subgraph 传统云厂商
    A[大规模数据中心]
    B[全球覆盖]
    C[长期合同]
    D[交付周期 2-3 年]
  end
  subgraph 轻资产初创
    E[整合现有资产]
    F[快速交付]
    G[灵活定价]
    H[交易对手风险]
  end
  A --> D
  E --> F
  style H fill:#f96,stroke:#333

### 矿商转型的算力套利

Bitdeer 的参与值得注意。比特币挖矿在 2024-2025 年经历了一轮产能出清，许多矿场面临电力合同到期和硬件折旧的压力。转型 AI 算力是一个合理的退出路径。

挪威的水力发电提供了稳定的低成本电力，这对 AI 训练至关重要。Bitdeer 拥有站点和电力，Volta 拥有客户和融资能力，双方各取所需。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 红包金钱



这种「矿商+初创+AI公司」的三角结构可能会成为算力供应链的新模式。矿商提供现成资产，初创公司提供整合能力，AI 公司提供需求。三方分担风险，也分享收益。

### 芯片供应的瓶颈与分配

Nvidia Vera Rubin 是这笔交易的另一个关键变量。Vera Rubin 是 Nvidia 2026 年发布的新一代 AI 芯片，性能优于 H100，但产能有限。

Anthropic、Google、Meta、Microsoft 都在争夺同样的芯片供应。Volta 能拿到多少，取决于 Nvidia 的分配策略。Nvidia 的投资者身份让这个问题更复杂——它既是供应商，也是 Volta 的股东。



![程序员 reaction：我叫江户川柯南是一名侦探](https://iili.io/CCZxIov.png)
> 真相锁定



## 对行业的启示与边界

### 为什么是 Volta

Anthropic 选择 Volta，不是因为它是最优选择，而是因为它是最快选择。在算力需求曲线陡峭时，速度优先于稳定性。这是 AI 行业的常态，不是例外。

Volta 的轻资产模式也有其合理性。它不需要承担数据中心建设的资本支出，只需要承担整合风险。对于投资者来说，这种模式的回报周期更短，风险更可控。

### 风险定价的可持续性

这笔交易的风险定价是否合理，取决于 Anthropic 对 Claude 需求的判断。如果需求持续增长，100 亿美元的承诺是合理的。如果需求放缓，Anthropic 可能面临违约风险。



![程序员 reaction：有种放学别跑](https://iili.io/CrHYovI.png)
> 反问质疑



从经验看，AI 公司的需求预测往往过于乐观。但 Anthropic 的保守文化让它比同行更谨慎。它的 Economic Index 报告显示，Claude 的使用呈现明显的日常节律，而非爆发式增长。

### 下一步行动建议

对于关注算力供应链的企业，有三个可执行的判断：

第一，评估交易对手风险。与初创公司签署长期合同时，要求分期交付和违约条款。不要接受「全部预付」模式。

第二，多元化供应链。不要依赖单一供应商，即使是传统云厂商。Anthropic 同时与 SpaceX、AMD、Akamai 合作，这是正确的做法。

第三，关注芯片供应。Vera Rubin 等新一代芯片的产能分配将决定未来两年的算力格局。提前与供应商建立关系，比临时谈判更有效。



![大佬系列表情：或许这就是大佬吧](https://iili.io/CUtbQCN.png)
> 大佬点头



这笔交易的意义不在于 Anthropic 和 Volta 本身，而在于它揭示了 AI 基础设施市场的一个结构性变化：当需求超过供给时，企业会接受更高的风险。传统云厂商的护城河正在被交付速度侵蚀，轻资产初创公司正在填补这个空白。这个趋势不会停止，只会加速。

## 参考文献
- Bloomberg 报道：Anthropic signs $10B computing deal with Nvidia-backed Volta Infra - https://finance.yahoo.com/technology/ai/articles/anthropic-inks-10b-computing-deal-155800765.html
- Silicon Republic：AI cloud start-up Volta valued at $2.4bn, inks $10bn deal - https://www.siliconrepublic.com/start-ups/ai-cloud-start-up-volta-valued-at-2.4bn-inks-10bn-anthropic-deal
- TechNews 科技新報：Anthropic 砸 100 億美元，找雲端新創 Volta 擴充運算資源 - https://technews.tw/2026/08/05/anthropic-strikes-10-billion-compute-partnership-with-cloud-startup
- IT之家：Anthropic与初创公司Volta签订100亿美元算力采购协议 - https://m.sohu.com/a/1058881403_114760
