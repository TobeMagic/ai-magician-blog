---
title: "AI公司把「灾难性风险」写进招股书？Anthropic这5处反常"
date: "2026-10-27 01:00:02"
updated: "2026-10-27 01:11:43"
permalink: "posts/2026/10/27/ai公司把灾难性风险写进招股书anthropic这5处反常/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/27/ai公司把灾难性风险写进招股书anthropic这5处反常/"
article_id: "2f8d2f07-a71a-481f-9f92-bd549a48c69a"
description: "Anthropic以Delaware受益公司（PBC）结构提交S-1，上半年营收163亿美元、亏损超30亿，拟以ANT代码上市，目标节点在感恩节前一周。但值得逐页看的不是财报：S-1把「意识AI」和「灾难性风险」写进风险因素，每轮Claude模型参与训练下一代，80%收入来自最近六个月的模型版本，算力端锁定了AWS Trainium、Google TPU和GPU共5180亿美元多年承诺，高管福利里甚至出现学生贷款代还。这五处写法跟传统科技公司招股书完全不同，也给华尔街出了道没做过的新题。"
cover: "/var/lib/aimagician/artifacts/covers/2f8d2f07-a71a-481f-9f92-bd549a48c69a/ed2cb8b4-847c-4d42-935f-84a0924ce794/cover.png"
imgTop: false
---

周一早上翻Anthropic的S-1，前二十页还是常规营收和烧钱，翻到风险因素那节突然冒出「catastrophic risk」四个字。

## 前二十页是财报，后三百八十页才是重点

### 营收163亿、亏损超30亿：基本盘不算新鲜

上半年的数字摆出来，营收163亿美元，净亏损超过30亿美元。2025全年营收46亿，净亏损约42亿。五月估值9650亿美元，拟以ANT代码在纳斯达克挂牌，目标节点卡在感恩节前一周。这些量级在跟踪AI融资轮的圈子里不算新鲜，CoreWeave、OpenAI前几轮的估值锚已经把这些数字消化过了。

真正需要留意的是法人结构。Anthropic在Delaware注册为Public Benefit Corporation，章程里写明董事必须平衡股东经济利益、利益相关者利益和「AI安全与责任」这一公共目标。PBC的董事有法定义务在决策时考虑非经济利益，等于把安全团队的否决权写进了公司治理层，而不是停在内部流程文件里。（来源：SEC EDGAR，Anthropic PBC S-1原文）

### 五个反常细节，从风险因素那一节开始



![程序员 reaction：你被我盯上了](https://iili.io/CCZOwMJ.png)



翻过前二十页的营收表，后面三百多页里藏着五处跟传统科技公司S-1完全不同的写法。

第一，风险因素里出现「catastrophic risk」和「conscious AI」。不是「模型可能产生幻觉」那种常规免责，而是直接写：我们的系统可能表现出类似意识的行为，且存在导致灾难性后果的风险。一家卖API的公司把这句话写进招股书，这不是修辞，是定价。它告诉华尔街，未来某个季度的earnings call上，「你们怎么评估AI对齐失败的概率」是一个合法问题。（来源：S-1 Risk Factors章节）

第二，「closing the loop」。S-1业务描述段落里有一句：每一代Claude模型参与训练下一代。用工程语言说，这是自举循环在迭代，模型既是产品也是下一轮的标注器。



![Claude模型自举循环](https://iili.io/nvqLG3B.png)
> Claude模型自举循环



管理层把这件事写进业务描述而非技术附录，信号很明确：他们把这视为核心商业引擎，不是工程细节。2026年前九个月公司推出了250个新模型版本、平台功能和应用，每位工程师日均贡献代码量随模型版本上升，招股书把这个数字当作效率指标而非研发指标来呈现。（来源：Kepler S-1解读，引用S-1第47页）

第三，收入结构。80%的收入来自最近六个月发布的模型版本。上一代模型发布半年后，商业上已经在归零。大多数客户每次发新版就迁移到最新模型，旧版本的API调用量断崖式下跌。对做DCF的分析师来说，你的收入基数每半年重置一次，折现率怎么设、永续增长率怎么取，标准假设全部失效。

第四，算力承诺。AWS Trainium、Google TPU、NVIDIA和AMD GPU，加起来5180亿美元的多年期合约。这不是「租了更多卡」，是锁定未来三到五年的产能。CoreWeave那份S-1里1300亿美元remaining performance obligations，相当一部分是喂给Anthropic的。算力端一锁，转换成本就极高，但反过来说，如果模型路线在锁定期内被竞争者追上，这些合约就成了纯沉没成本。（来源：S-1 Commitments章节；Converge Digest基础设施解读）

第五，高管福利里出现了学生贷款代还。一家9650亿估值的AI公司，在招股书员工福利章节写「我们帮员工偿还学生贷款」。放在硅谷不算什么，但放进IPO披露文件里，它暗示公司需要留住博士阶段的研究员，而且留人成本已经高到要写进给股东的风险披露。

五件事叠在一起，结论只有一个：传统S-1的估值框架假设产品有稳定生命周期、收入可预测、风险可量化。Anthropic这版文件在三个假设上同时打了问号，华尔街得先回答「用什么模型给一个每半年自我重置的产品定价」，才能谈开票价。



![程序员系列表情：你别急，等我剪完这个头发再修Bug](https://iili.io/CumEMP9.png)
> ##前二十页是财报，后三百八十页



## PBC结构：受益公司写进章程，跟纳斯达克规则103正面撞上

### Delaware PBC到底承诺了什么

Anthropic在Delaware注册为Public Benefit Corporation而非C-Corp。这不是行政偏好。S-1原文写得很直白：董事会做任何决策时，必须同时平衡三件事，即股东经济利益、受重大影响方的利益、以及章程点名的「特定公共利益目标」（对Anthropic就是AI安全与责任）。

传统C-Corp董事的fiduciary duty只指向股东。PBC多出一条法律路径：当AI安全目标跟短期利润冲突时，董事可以合法选择牺牲股价。这不是道德呼吁，是Delaware General Corporation Law §361写死的决策权重。

### 平衡股东利益与AI安全目标，法律上怎么落

问题在于Nasdaq Listing Rule 103要求上市董事会以股东最佳利益行事。PBC跟这条规则正面碰撞。实操上意味着三层约束：董事会在安全与商业化之间做取舍时，记录必须体现「平衡」过程，不能只写「我们认为对股东好」；股东诉讼时，原告可以主张董事违反了PBC义务中任何一条；反过来，公司若过度追求安全目标而压股东回报，股东同样可以起诉。



![PBC决策框架与纳斯达克规则的碰撞](https://iili.io/nvqLOCv.png)
> PBC决策框架与纳斯达克规则的碰撞



这条结构让AI安全投入从「品牌叙事」变成「fiduciary obligation」。省不下来。

## 「灾难性风险」和「意识AI」进了风险因素章节

### 写conscious AI进S-1是什么法律含义

S-1风险因素里出现了「catastrophic risk」和「conscious AI」两个短语。写进注册文件不等于承认会发生，但等于在SEC管辖下承担了一条持续披露义务：如果后续公司行为跟当初披露的风险缓解措施矛盾，那就不是「风险没兑现」，而是「你说了会做，没做」。Conscious AI这条尤其重。它意味着公司自己也没法排除模型在某一代出现类意识状态的可能性。在证券法语境下，这是向投资者公开承认一个不可量化的残余风险。

### 华尔街怎么给一个可能毁灭人类的标签定价

DCF模型里塞不进「人类灭绝概率」。评级机构没有先例可循。实话说，当前卖方对ANT的估值框架大概率会绕开这一项，把它归入「尾部风险，不做概率加权」。

但从交易结构看，PBC写法给了机构投资者一个锚：如果未来某代模型的安全评估出现争议，Anthropic的董事会在法律上有义务把安全结论放在利润前面。这条义务是买不进来的，只有PBC结构能锁死。一家卖API的公司把「灾难性风险」写进招股书，这不是修辞，是定价。

## 模型自举循环：每个Claude造下一个，80%收入靠最近半年

### 前九个月250个新版本、功能和应用上线的节奏

S-1原文用了「closing the loop」：每个Claude版本参与训练下一代。Kepler把这句话接上了工程数据，工程师人均日代码贡献量随迭代持续攀升。前九个月上线250个模型版本、平台功能和面向应用的模块，平均不到一天一个。模型产品从「半年一大版」变成了滚动流水线，你上周调的Opus 4.5接口，背后可能已经被中间轮次迭代过三回。

### 客户迁移速度：上一代模型发布半年后商业上已在归零

S-1财务附注里一个数字：截至2026年9月30日的最近六个月发布的模型版本，贡献了当季营收的80%以上。80%的收入来自最近六个月的模型版本，上一代发布半年后商业上已经在归零。客户只跟最新版，收入曲线是锯齿不是平滑S型。定价权不在Anthropic手里，在它自己的发版日历上。

## 5180亿算力承诺：Trainium、TPU、GPU三年锁死

### 专用AI数据中心与通用云的区别

Converge Digest拆了S-1基础设施章节：算力采购走三条线，AWS Trainium做专用推理，Google TPU跑训练集群，NVIDIA和AMD GPU补通用加速。三家供应商、三种架构，全部是多年锁定的专属容量。这不是开一台EC2按需付费的通用云用法，是圈一块地、接一根光纤、锁一个交付周期的资产模式。



![Anthropic算力三线结构](https://iili.io/nvqL4un.png)
> Anthropic算力三线结构



### 这笔承诺占营收的倍数，跟OpenAI、微软谁更激进

5180亿对上半年163亿营收，约等于32倍年化收入。微软对OpenAI的累计投入公开口径在1300亿美元量级，OpenAI自身与Microsoft、Oracle的算力合约也远超百亿美元。Anthropic一家把三年锁死金额拉到5180亿，在前沿实验室里算最激进的。

风险落在节奏匹配上：模型迭代若慢于芯片交付周期，多出来的算力就是贬值资产。S-1没披露芯片闲置折旧条款，审计时大概率会被追问。一家卖API的公司把重资产承诺写进招股书，华尔街买的不再是「增长故事」，是一堆还没通电的机房。

## 高管那一页：学生贷款代还、复杂lock-up

### 为什么S-1会写这种福利

The Verge 把学生贷款代还列为五个反常细节之一，排在「意识AI」和「灾难性风险」之后。S-1 高管薪酬与福利章节明确列出 student loan assistance 作为正式福利项，跟期权、利润分成并列。传统科技公司招股书里这一项极少单独成行，通常藏在「employee benefits」一行字里带过。Anthropic 把它拎出来，信号很清楚：它在跟 OpenAI、DeepMind、Meta 的研究员抢人，而这群人共同特征之一是读博时欠了一屁股学贷。5180 亿算力承诺需要足够的工程师去调优部署，留人靠的不只是 equity。更狠的是，一笔 $50k 的贷款代还占 senior researcher total comp 可能不到 3%，但心理锚点完全不同——「公司帮你把债还了」比「多给你 1000 股 RSU」在决策权重上高出一个档位。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 5180亿算力背后，先帮你把学贷清了



从经验看，这条福利出现在 S-1 而非内部 offer letter 里，说明它已是全员制度，不是个别 case。

### 锁定期结构对二级市场的实际约束

The Information 标题用了「Complex Lock-Ups」。S-1 披露的 lock-up 不是单一 180 天一刀切，而是按股东类型分层：早期 VC、员工期权池、战略投资者各自适用不同释放节奏，具体比例和节点写在注册声明附表里。

这层复杂度对二级市场的实际影响是：上市初期可流通盘被压缩，供需比不均衡。结合前文提到的 80% 收入依赖最近六个月模型版本，每次大版本发布前后都是股价敏感窗口。如果 lock-up 集中到期恰逢上一代模型商业归零，抛压和估值锚同时下移，波动会被放大。



![ANT lock-up 分层释放与模型周期叠加](https://iili.io/nvqLLG4.png)
> ANT lock-up 分层释放与模型周期叠加



## 感恩节前的ANT：如果真是史上最大IPO

WSJ 的措辞是「as soon as the week before Thanksgiving」。Anthropic 拟以 ANT 代码在纳斯达克上市，五月末轮估值 $965 billion。对照沙特 Aramco 2019 年 $29.4B 的融资额——至今仍是纪录保持者——ANT 哪怕按七折发行，体量也完全不在一个量级。

但「最大」这里需要加限定。PBC 章程写死的 AI 安全目标意味着董事会在追求股东利益时，法律上必须同时权衡「材料受影响者」和「特定公共利益目的」。这不是 ESG 标签，是 Delaware 公司法 122 条的硬约束。华尔街给一家把「可能毁灭人类」写进风险因子的公司定价时，基准模型里根本没有这个变量。

感恩节前的时间窗更多是合规节奏：SEC 审查周期加路演排期，十一月假期会拖慢定价谈判。真正决定发行量的不是日历，是 5180 亿算力承诺里有多少能在十二个月内转成 recurring revenue。

给关注 ANT 的读者三个可执行的观察点。第一，lock-up 分批释放的具体 schedule，算出未来十二个月每月新增可流通盘；第二，下季度 10-Q 里「最近六个月模型版本收入占比」是否仍维持 80% 以上；第三，PBC 章程中 public benefit purpose 的修订门槛——简单多数还是双重多数。前两个决定股价波动区间，第三个决定你持有的股权到底在保护什么。

## 参考文献
- The Verge: [Five weird details from Anthropic's IPO filing](https://www.theverge.com/ai-artificial-intelligence/1018738/anthropic-ipo-s1-filing-weird-details)
- WSJ: [Anthropic's IPO Filing: Four New Details We Learned From the S-1](https://www.wsj.com/tech/ai/anthropic-ipo-s1-report-takeaways-6eebd721)
- The Information: [Anthropic's S-1 Takeaways: From Giant Compute Commitments to Complex Lock-Ups](https://www.theinformation.com/articles/anthropics-s-1-takeaways-giant-compute-commitments-complex-lock-ups)
- SEC: [Anthropic PBC S-1 (Q2)](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm)
- Business Insider: [Anthropic's Public S-1 Sets Stage for Massive IPO Debut](https://www.businessinsider.com/anthropic-s-1-filing-public-finances-compute-deals-2026-10)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
