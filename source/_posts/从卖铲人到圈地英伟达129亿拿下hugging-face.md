---
title: "从卖铲人到圈地：英伟达129亿拿下Hugging Face"
date: "2026-09-03 01:00:01"
updated: "2026-09-03 01:06:10"
permalink: "posts/2026/09/03/从卖铲人到圈地英伟达129亿拿下hugging-face/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/03/从卖铲人到圈地英伟达129亿拿下hugging-face/"
article_id: "3208004b-eaf3-4c1a-b487-fc0e3c6abcc0"
description: "英伟达拟以129亿美元收购开源模型平台Hugging Face，估值达年营收80倍。这笔交易标志着芯片巨头从硬件供应商向AI生态控制者的战略跃迁，也折射出开源社区在资本重组中的关键位置。"
cover: "/var/lib/aimagician/artifacts/covers/3208004b-eaf3-4c1a-b487-fc0e3c6abcc0/e5eeeacc-d285-48d3-a573-936ac236b54e/cover.png"
imgTop: false
---

两天前还在「探索出售」，转眼就签了129亿美元协议——开源AI界的GitHub就这样被芯片之王收入囊中。

## 129亿美元的重量

### 交易细节与估值逻辑

据The Information 8月26日报道，英伟达已同意以129亿美元收购Hugging Face，Reuters随后确认了这一数字。这不是普通的并购案，数字本身就在诉说野心。

Hugging Face当前年化收入约1.5亿美元，这意味着129亿美元的收购价对应86倍年营收。对比2023年8月D轮融资时45亿美元的估值，这一数字涨了将近三倍。当时Salesforce领投2.35亿美元，Google、Amazon参投。英伟达也是那轮投资人之一。

有意思的是时间线。去年Hugging Face拒绝了英伟达5亿美元的投资报价，理由是「不希望单一大投资者影响公司决策」。半年后，129亿美元砸过来，全盘出售。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 这账算明白了



### 为何是Hugging Face

Hugging Face被称为AI界的GitHub，托管超过300万个模型仓库，服务1300万开发者。Meta的Llama、阿里的Qwen、Mistral的开源模型，都住在这个平台上。它是整个开源AI生态事实上的默认分发层。

英伟达已经垄断了训练和推理的GPU硬件。现在它还想拥有模型流通的那条路。

Hugging Face与英伟达早已有技术合作。DGX Cloud已整合至Hugging Face平台，开发者可直接在上面调用英伟达的算力资源。Optimum-NVIDIA库让开发者只需改一行代码就能解锁GPU加速推理。这些合作铺垫了收购的逻辑连续性。

更深层的动机在于防守。随着OpenAI、Anthropic等前沿模型公司纷纷投入自研芯片，英伟达面临的最大威胁并非AMD，而是客户流失到自有硬件。控制Hugging Face，就等于在开发者心智中埋下一颗锚——他们在开源平台上发现的每一个模型，天然优先适配英伟达的GPU。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 129亿，芯片巨头的圈地钞



## 从卖铲人到圈地

### 英伟达的战略跃迁

黄仁勋过去十年的叙事一直很清晰：AI时代，我们卖铲子。

这个比喻的精妙之处在于它把自己定位为基础设施供应商，而非矿产拥有者。铲子不挑矿主，谁挖矿都给货，赚的是确定性高的硬件利润。

但两年前，这个故事开始有裂痕。

OpenAI在训练GPT-4时大量使用英伟达A100，训练完成后转头就开始研发自己的ASIC芯片；Anthropic同样在测试自研推理芯片；Google的TPU从内部使用走向外部云服务。这些曾经最忠实的铲子用户，开始自己打铁。



![程序员 reaction：你被我盯上了](https://iili.io/CCZOwMJ.png)
> 当买铲子的人自己建了铁匠铺...





![英伟达护城河的结构变化](https://iili.io/nHVsA5x.png)
> 英伟达护城河的结构变化



英伟达的真正恐惧不在于对手做出更好的GPU——那是技术问题，烧钱能解决。真正的威胁是开发者生态的迁移。如果下一代的AI开发者从一开始就绑定在某家自研芯片路线上，英伟达的「铲子生意」就会失去需求侧根基。

收购Hugging Face，本质上是把「卖铲子」升级为「圈地收租」。

### 开源生态的控制权争夺

Hugging Face不是一个普通的开源项目。它现在是AI领域的事实标准分发层。

数据显示，Hugging Face托管超过300万个模型仓库，月活跃开发者约1300万。Meta的Llama系列、阿里的Qwen、Mistral的开源模型，全都默认选择在这里首发。这是一个连接模型研发者和应用开发者的关键节点。

控制了这个节点，就等于控制了开发者接触新模型的第一触点。这不是「影响力」，而是「分发权」。



![程序员 reaction：还不滚去学习](https://iili.io/CUykzfj.png)
> 分发权 = 新的过路费征收点



黄仁勋在GTC 2024上曾明确说过：「英伟达不只是芯片公司，我们是软件平台公司。」这句话当时的语境是CUDA生态，但收购Hugging Face之后，软件平台的定义被彻底拓宽了。

更值得玩味的是时间线。2025年初，英伟达提出5亿美元投资Hugging Face，被拒绝。当时Hugging Face估值70亿美元，拒绝理由是「不希望单一大投资者影响公司决策」。五个月后，英伟达提出129亿美元全额收购，Hugging Face接受了。

这中间发生了什么？业内普遍的判断是：现金流压力。Hugging Face 2023年D轮融资时估值45亿美元，年化收入约1.5亿美元，80倍估值意味着它需要持续证明自己具备指数级增长能力。而开源模型平台的变现路径，至今没有清晰的商业模式验证。

```\mermaid
%% title: Hugging Face估值跃迁路径
stateDiagram-v2
  [*] --> 种子轮
  种子轮 --> D轮_2023
  D轮_2023 --> 拒绝5亿投资
  拒绝5亿投资 --> 探索出售
  探索出售 --> 129亿收购
  
  D轮_2023 : 估值45亿
  拒绝5亿投资 : 估值70亿
  129亿收购 : 估值约129亿
```

英伟达的逻辑是：与其让Hugging Face独立探索变现路径，不如直接买下来，把分发权并入自己的AI软件栈。这意味着未来开发者在Hugging Face上下载的每一个模型，都可以被引导至NVIDIA GPU优化版本——或者更直接地，引导至NVIDIA的推理服务。



![搬砖系列表情：搬砖](https://iili.io/CUtb1BS.png)
> 代码搬砖，也要建在别人的地里



这不是英伟达第一次展示这种「生态收编」能力。2022年收购Run:ai，2023年投资并深度整合Hugging Face的推理框架optimum-nvidia，2026年直接买下平台本身——每一步都在把开源生态的关键节点变成自家产业链的一环。

## 80倍市盈率的争议

### 财务视角的质疑

从纯粹财务指标来看，129亿美元买一个年营收约1.5亿美元的公司，估值接近80倍PE。这个数字在任何传统行业都会让CFO当场摇头。

Hugging Face上一轮D轮融资在2023年8月，Salesforce领投2.35亿美元，当时公司估值45亿美元。到2026年8月这笔交易中，估值跳升至约129亿美元，不到三年翻了接近三倍。与此同时，其年化收入从2023年的数千万级别增长至约1.5亿美元，增速确实不慢，但距离支撑80倍PE所需的盈利预期仍有相当距离。



![程序员系列表情：这个需求做不了](https://iili.io/CxfkHrX.png)
> 估值数字还在往上涨



财务上最直接的质疑有几个层面。

第一是现金流压力。据多家媒体援引知情人士的消息，这笔交易将以现金加股票形式完成，对英伟达而言并非毫无负担。英伟达2026年第二季度营收约96亿美元，净利润规模可观，但一次性投入129亿美元收购一个尚未盈利的平台公司，董事会层面需要明确的战略对冲逻辑，否则很难解释为何不把这笔钱用于回购或研发投入。

第二是协同效应能否兑现。Hugging Face的收入结构主要来自推理服务（Inference API）、企业级托管和认证考试，这些业务在英伟达的现有体系里并没有直接对应物。收购之后，如何实现真正的技术整合而不是简单的品牌叠加，是一个悬而未决的问题。

第三是开源社区的反弹风险。Hugging Face的护城河从来不是代码本身，而是300万个模型仓库、1300万开发者以及Meta、阿里、Mistral等头部模型厂商的事实选择。一旦社区认为平台被单一商业实体控制，迁移成本虽然不低，但并非不可承受。Anthropic的Refugee Project已经在提醒这一点。

但财务视角的质疑有一个隐含前提：把Hugging Face当作一家普通SaaS公司来估值。这个前提本身值得怀疑。

### 战略定价的合理性

战略定价和财务定价的逻辑完全不同。英伟达愿意支付的溢价，核心来自三个层面的计算。

第一个层面是防御。AMD已经在MI300系列上持续迭代，OpenAI、Anthropic等头部模型公司纷纷布局自研芯片，英伟达的GPU垄断地位并非不可动摇。如果开源AI生态的分发层落到第三方手中——无论是Anthropic主导、还是某个新兴平台崛起——英伟达将失去对开发者技术选型路径的引导能力。129亿美元买一个入场券，代价远高于维护现有优势的营销支出。

第二个层面是生态闭环。英伟达已经有CUDA、DGX Cloud、Triton Inference Server这套硬软件栈，Hugging Face补上了最后一块拼图：模型发现与社区分发。开发者在HF上上传模型、选择推理框架、调优参数，这些行为天然指向NVIDIA GPU的优化路径。两者合并之后，英伟达不再只是卖芯片，而是控制了从模型训练到模型分发的全链路入口。mermaidmermaidmermaid
%% title: 英伟达AI生态控制链
flowchart LR
  subgraph 基础设施层
    A[GPU芯片]
    B[CUDA / cuDNN]
  end
  subgraph 平台层
    C[Triton Inference]
    D[DGX Cloud]
    E[Hugging Face Hub]
  end
  subgraph 应用层
    F[模型开发者]
    G[企业用户]
  end
  A --> C
  A --> E
  B --> D
  D --> E
  E --> F
  F --> G
  G -.反馈选型.-> A
上图中实线代表当前已落地的整合路径，虚线代表预期的生态反馈闭环。Hugging Face在这个链条中的位置，决定了它的战略价值远超其财务报表上的数字。

第三个层面是时机。OpenRouter被Stripe以超80亿美元收购，这是模型路由层的产权界定；英伟达收购Hugging Face，是模型分发层的产权界定。AI生态的关键节点正在被逐一定下，晚一步就意味着失去对某个层级的控制权。对于已经占据硬件主导地位的英伟达而言，这不是可选的扩张，而是必须在窗口期内完成的防守动作。

```


![程序员 reaction：ClaudeCode](https://iili.io/CgKutyJ.png)
> 数字大，但位置更关键



从经验看，这类收购的真正考验往往不在交割前，而在交割后18到24个月。社区信任的流失、平台治理的失衡、技术路线的内部冲突——每一个都可能让129亿美元的价值大打折扣。但站在交易落定的这一刻，英伟达的出价逻辑是自洽的：贵，是因为位置稀缺。

这笔交易的震撼程度，不在于数字本身，而在于它暴露了一个正在发生的结构性变化：英伟达不再满足于只做卖铲子的人。当硬件毛利率开始承压、当AMD和自研芯片都在逼近，把Hugging Face纳入版图，意味着英伟达正式进军AI生态的「分发层」。

更准确地说，这是从算力基建到模型入口的全面占领。过去两年，英伟达的投资轨迹已经从单纯采购GPU，延伸到CUDA生态、DGX Cloud、Nemo云端训练平台。Hugging Face的加入，补齐了最后一环：模型的分发、社区、以及开发者的注意力。



![程序员 reaction：losingafewpackets](https://iili.io/Cx2fLs2.png)
> 搬砖也要搬出护城河



对于开发者而言，这次收购的影响是具体的，也是复杂的。开源社区的「变」体现在生态控制权的转移，「不变」则体现在模型获取的基本路径不会一夜改变。

## 对开发者的冲击

### 开源社区的变与不变

Hugging Face目前托管超过300万个模型仓库，服务1300万开发者。Meta的Llama、阿里的Qwen、Mistral的开源模型，全都默认托管在这个平台上。它是整个开源AI生态事实上的「默认分发层」。

英伟达入主后，短期内不太可能直接关闭这个平台或转向闭源。理由很简单：Hugging Face的核心价值恰恰在于它的社区属性和中立地位。一旦变成纯英伟达工具链的附庸，开发者会迅速流失到替代方案。

但「中立」并不意味着「无代价」。

首先是信任成本上升。Hugging Face过去能在开源社区建立权威性，部分原因在于它是一个相对独立的实体。现在背后站着全球最大芯片公司，开发者在使用HF模型时，难免多一层顾虑：这些模型是否会优先适配英伟达架构？社区贡献是否会被选择性扶持？

其次是生态对齐的压力。英伟达在收购Hugging Face之前，就已经通过投资和数据合作与HF建立了紧密关系。2023年英伟达参与了HF的D轮融资，同年双方宣布将DGX Cloud整合到Hugging Face平台。这意味着收购并非从零开始，而是既有关系的制度化升级。



![程序员反应图：000000024](https://iili.io/CumEojp.png)
> 评审人追问：你用的是哪家的推理栈



更值得关注的变局，是HF平台上的模型分发规则。业内常见的做法是，平台方会通过推荐算法、模型卡片标准、甚至API接口优化来引导开发者的技术选型。当平台背后是芯片巨头，这种引导会更倾向于自家硬件优化路径。

比如Optimum-NVIDIA这个项目，已经让Hugging Face的Pipeline在英伟达GPU上获得加速。未来类似的合作会越来越多，这不是威胁，而是现实。开源不等于免费适配所有硬件，平台方的技术倾向性会潜移默化地影响开发者的决策。

### 未来使用模式的调整空间

开发者不必恐慌，但需要调整预期。

核心判断是：Hugging Face仍然会是一个可用的模型分发平台，但它不会回到过去那种「纯粹中立」的状态。更准确地说，英伟达收购HF之后，HF的定位会逐步向「英伟达生态的首选开源入口」收敛。

这意味着什么？

第一，模型下载和部署的基本路径不会变。开发者仍然可以在HF上找到Llama、Qwen、Mistral等主流开源模型，仍然可以使用Transformers库进行推理。

第二，但优化路径会变。英伟达会推动更多模型针对自家硬件进行预优化，比如更快的推理实现、更低的显存占用、更强的多卡扩展支持。对于使用NVIDIA GPU的团队来说，这些优化是有价值的；对于使用其他硬件的团队，可能需要承担更多的适配成本。

第三，HF的商业模式会被重新定义。收购前HF年营收约1.5亿美元，主要来自Spaces托管、Inference API和企业级工具。英伟达入主后，HF可能会成为英伟达向开发者收费的通道，比如将HF Enterprise打包进DGX Cloud订阅，或者推出更多面向生产环境的付费服务。



![程序员 reaction：Anybodywantto](https://iili.io/Cbk5U0J.png)
> 终端里跑着不同厂商的推理栈



从技术选型角度看，开发者需要做两件事。

一是保持多源依赖。不要把所有模型托管和部署工具都押注在HF一个平台上。Hugging Face Hub之外，ModelScope（阿里）、CivitAI（图像模型社区）、以及各大模型厂商自建的模型仓库，都应该保持关注和使用。

二是评估硬件适配成本。如果团队的主要GPU来自英伟达，那么深度使用HF + Optimum-NVIDIA的组合是合理的。如果团队有AMD或其他硬件的部署需求，需要提前了解HF模型在目标硬件上的支持情况，避免后期适配成本失控。

这笔收购的最终影响，可能需要一两年来观察。但可以确定的是，AI产业正在进入重工业化阶段。英伟达129亿美元买的不只是一个平台，而是开源模型生态的「分发权」。当分发权成为新护城河，模型背后的算力、资本、社区入口，都在被重新定价。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 开发者：收到任务，开始评估适配成本



对于开发者群体来说，最务实的建议是：继续使用你熟悉的工具和模型，但要把HF从一个「默认选项」变成「选项之一」。生态的集中度越来越高，多元化的技术路线不是口号，而是对冲风险的必要动作。

## 参考文献
[1] 129 亿美元，英伟达拿下 Hugging Face. https://m.techflowpost.com/article/33604
[2] Nvidia 傳豪擲 129 億美金收購 Hugging Face！年營收得 1.5 億點解願畀 80 倍天價？！揭秘黃仁勳防守佈局：由賣鏟人變淘金地主！. https://m.youtube.com/shorts/KXaeVWBy03Q
[3] 英伟达已同意以129亿美元收购开源模型平台Hugging Face - BlockBeats. https://m.theblockbeats.info/flash/[REDACTED]
[4] Nvidia reportedly acquiring Hugging Face for $12.9 billion - Yahoo Finance. https://finance.yahoo.com/technology/ai/articles/nvidia-reportedly-acquiring-hugging-face-111038884.html
[5] Nvidia wants to buy Hugging Face in $13 billion blockbuster AI deal. https://finance.yahoo.com/technology/ai/articles/nvidia-wants-buy-hugging-face-091220972.html
[6] Nvidia agrees to buy Hugging Face for $12.9 billion, report says. https://www.reddit.com/r/wallstreetbets/comments/1vzvy3p/nvidia_agrees_to_buy_hugging_face_for_129_billion
[7] Nvidia reportedly agrees $12.9bn deal to acquire Hugging .... https://www.thedailystar.net/news/technology/news/nvidia-reportedly-agrees-129bn-deal-acquire-hugging-face-4258151
[8] Nvidia Reportedly Buys Hugging Face for $12.9B | AIFOD. https://af.net/realtime/nvidia-reportedly-buys-hugging-face-for-12-9b
