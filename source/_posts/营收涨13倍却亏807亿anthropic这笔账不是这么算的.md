---
title: "营收涨13倍，却亏807亿？Anthropic这笔账不是这么算的"
date: "2026-10-27 05:00:01"
updated: "2026-10-27 05:13:40"
permalink: "posts/2026/10/27/营收涨13倍却亏807亿anthropic这笔账不是这么算的/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/27/营收涨13倍却亏807亿anthropic这笔账不是这么算的/"
article_id: "24c0ff15-b94c-465a-b534-48be63e8cf40"
description: "Anthropic 2026年S-1招股书：上半年营收162.86亿美元，同比增约1300%；净亏损807.48亿美元，其中约724亿是可转换票据与SAFE公允价值变动的非现金费用，并非实际烧钱。真正压顶的是算力——上半年基础设施支出近90亿，未来承诺超6000亿，两个大客户贡献约20%营收。S-1把定价、股数和募资额全部留白。"
cover: "/var/lib/aimagician/artifacts/covers/24c0ff15-b94c-465a-b534-48be63e8cf40/1503b5da-4901-43b1-a571-260e8bf11f7f/cover.png"
imgTop: false
---

你看到807亿净亏损，第一反应大概是这公司要完。

## 807亿拆开来：724亿是「估值税」，不是现金流

### 可转换票据与SAFE的公允价值机制

Anthropic 早期多轮融资大量使用可转换票据和 SAFE，这类工具内嵌转股权。US GAAP 要求每个报告期对嵌入衍生工具按公允价值重新计量。估值从 2024 年的数十亿美元跳到 Series H 的 9650 亿美元 post-money，早期那张低价转股权骤升，会计上直接记进利润表，科目叫「可转换票据、衍生负债及 SAFE 的公允价值变动」。钱没动，数字动了。



![公允价值变动如何变成账面亏损](https://iili.io/nvxPEOP.png)
> 公允价值变动如何变成账面亏损



### 估值越高、账面亏损越大

807.48 亿里 723.88 亿是这笔公允价值变动，占 89.6%。剩下约 84 亿才是经营层面的真实缺口。公司越成功、估值越高，这张报表上的「亏损」越大。反直觉，但逻辑自洽：你在为别人手里的期权付账面价格。



![程序员 reaction：柯南00089 找到你了](https://iili.io/CCZubTX.png)
> 九成是估值涨出来的，不是烧出来的



## 163亿营收的真实增速：从4100万到13倍

### 2023→2026四年跳跃的时间线

S-1里有一条干净的营收阶梯。2023年Claude商业化元年，全年4100万美元；2024年3.86亿；2025年45.85亿；2026年上半年162.86亿，去年同期只有11.63亿，同比增长约1300%。



![被追着问 BUG 修完了吗时的程序员表情](https://iili.io/noCi27n.png)
> 四个数字摆出来，曲线形状不用画



更刺眼的是单季拆分。2026年Q2营收115.6亿美元，一个季度超过2024年全年近30倍。S-1把这个数字单独列出来，等于告诉投资者：增长不是匀速爬坡，是指数型加速。

从4100万到163亿，大约两年半。放在任何行业里，这个斜率都找不到几个对标案例。

### NRR约900%：老客户越买越多，人均营收超660万美元

营收增速本身不稀奇，稀奇的是NRR（净收入留存率）约900%。这个指标衡量的是同一批客户今年比去年多部署了多少。900%意味着老客户平均把Claude的调用量扩到九倍，增长不是靠拉新撑的。

人均营收超过660万美元。按S-1披露的员工规模反推，每个工程师、产品经理、销售创造的收入远超传统软件公司。

但结构上有两个卡点。第一，两家客户贡献了约20%的总营收，集中度不算低。第二，2025年47%的营收（约21.6亿美元）走的是Amazon和Google的云计算市场渠道，Claude在相当大的比例上是借别人的云卖的。



![Anthropic营收结构与渠道依赖](https://iili.io/nvxPw0v.png)
> Anthropic营收结构与渠道依赖



这两个结构问题不致命，但它们决定了Anthropic在算力谈判桌上的议价空间。当近一半收入经由Google（同时拥有TPU和自研Gemini模型）的云平台进来，定价权就不是完全握在自己手里的。

## 算力才是真账单：90亿已花，6000亿在路上

### 上半年基础设施支出近90亿 vs 去年全年73亿

S-1里有一组数字比账面亏损更值得盯。2026年上半年，Anthropic在算力与基础设施上的实际支出约89.5亿美元；2025年全年为73亿；2025年上半年仅23.3亿。今年六个月花掉的钱，已经超出去年一整年，同比增速接近四倍。

斜率在2025年下半年开始陡峭化，2026年上半年直接跳了一个档位。这不是线性外推能解释的节奏。

### 与Google的111亿合作及4500亿云承诺的期限结构

真正压顶的是还没落地的部分。S-1披露，未来七至十年，基础设施支出承诺超过4500亿美元。其中与Google的协议约111亿为已签约确定性支出；若计入正在洽谈的额外算力协议，总盘子可能推至7500亿。

这些承诺有一个结构性特征。云租约是take-or-pay，到期前必须按期付租金，跟营收是否继续13倍增长无关。花90亿买算力的人，不会因为某季度现金流紧张就退租。而收入端，两个大客户合计贡献约20%营收，2025年有47%的收入经Amazon与Google云市场结算。算力成本是固定的、多年的、不可逆的；收入端尚未锁到同等年限的契约。

截至2026年6月底，Anthropic账上现金及短期投资合计约1317亿美元（1124亿现金加193亿短期投资）。这笔钱覆盖未来两三年算力支出没有压力，但撑不到4500亿承诺全部履约的那一天。IPO募资的核心用途，很大程度上就是填这个期限缺口。



![算力承诺期限与现金流错配](https://iili.io/nvxP8bt.png)
> 算力承诺期限与现金流错配



没花出去一分钱。

## 807亿拆开来：七成是「估值税」

### 可转换票据与SAFE的公允价值机制

S-1的亏损结构写得很直白。807.48亿净亏损里，723.88亿（约89.6%）对应一项会计科目：「可转换票据、衍生负债及SAFEs的公允价值变动」。这笔钱的产生逻辑是，Anthropic在2024至2025年间以固定价格发行了可转换债券和SAFE（简单股权融资票据），当时约定持有人可以按某个固定价格转股。后来公司估值从几百亿拉到$965B post-money，那些固定价格的转股权公允价值暴涨，会计准则要求每个季度把差额记入损益表。公司没掏出一个新美元，账面亏损却跟着估值一起膨胀。

### 估值越高、账面亏损越大

这个机制有个反直觉的推论：公司越值钱，报表越难看。$965B的Series H估值意味着早期SAFE持有人的行权价与公司当前公允价值之间的gap被拉到最大。只要公司继续融资或二级市场估值上行，这笔非现金亏损就会继续滚雪球。它不影响现金流，不影响运维，但会在S-1的损益表上持续制造视觉冲击。

## S-1留白的那些格子

### 22家银行承销团为何不亮价

Goldman Sachs和Morgan Stanley领衔的22家承销团已在S-1上签字，但定价区间、发行股数、募资额、Run-Rate Revenue（第195页）全部空白。这不是疏漏，是IPO标准流程。定价要等路演结束、机构认购簿关闭后才落锤。路演前亮价等于把议价空间交给市场，一旦认购需求不及预期，承销商只能被动降价。22家银行的规模本身也暗示发行体量不小，留给各机构分配份额的协调成本更高，定价窗口自然往后推。



![S-1留白与定价时序](https://iili.io/nvxPQ72.png)
> S-1留白与定价时序



### 留白对估值叙事和发行节奏的影响

留白造成的直接效果是，当下所有「Anthropic值多少钱」的数字都锚在$965B post-money（Series H）和媒体转述上，而非S-1本身。公司6月底$131.7B的现金短投总和，意味着它没有2021年那批烧钱SaaS的逼宫式募资压力，可以把路演节奏拉到11月甚至12月。但如果AI板块在路演窗口内整体回调，超额的认购溢价会收窄，发行价可能贴着$965B甚至以下成交。承销团留白，本质上是把定价风险从「锁死」变成「浮动」，给自己留了调价空间。

## 两个客户占20%营收：集中度藏在哪

### 大客户依赖对续费和砍预算的敏感性

S-1风险因子栏写明，两家客户合计贡献约20%的半年营收，折算大约$3.2B。再看2025年全年，Amazon和Google的云市场渠道带来了47%的收入（$2.16B）。两组数字叠加，头部客户+云渠道对总营收的影响面超过六成。NRR 900%的逻辑链建立在老客户持续扩量上，但如果其中任一家在2027财年预算周期里削减Claude API调用配额，或者把workload迁向自研模型，NRR会率先失速。一个$3.2B量级的客户砍20%预算，对公司全年营收增速的拖累是双位数百分点级别的。

### 上市前披露这一项的信号意义

把「两家客户占20%」写进S-1风险因子，是证券法对重大客户的强制披露义务。但选择以「两家」而非「五家」为粒度披露，配合900% NRR和13倍增速一起呈现，传递的信号是：集中度确实高，但增长斜率足以在短期内把占比稀释下去。真正需要盯的验证节点是上市后首份10-Q。如果这两家客户的ARPU增速跑输公司整体NRR，集中度就从风险因子变成定价折价，承销团的发行价浮动区间也会下修。

## 参考文献
- Anthropic S-1 Filing (EDGAR, 2026-10-26): https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=ANT&type=S-1
- NDTV Profit, "Anthropic S-1 IPO Filing": https://www.ndtvprofit.com/markets/anthropic-s-1-ipo-filing-80-7b-net-loss-masked-by-paper-charges-as-revenue-hits-16-3b-12239090
- DataStudios, "Anthropic files S-1 for Nasdaq IPO": https://www.datastudios.org/post/anthropic-files-s-1-ipo-nasdaq-ticker-ant
- HackerNoon, "Anthropic's S-1 Shows $16.3B in Half-Year Revenue": https://hackernoon.com/anthropics-s-1-shows-$163b-in-half-year-revenue-a-900percent-nrr-and-an-$807b-loss-that-mostly-isnt
- Yahoo Finance, "Anthropic IPO live updates": https://finance.yahoo.com/technology/live/anthropic-ipo-live-updates-frontier-ai-lab-discloses-revenue-and-risks-in-highly-anticipated-s-1-filing-141702607.html
- Fortune, "Anthropic's IPO prospectus": https://fortune.com/2026/10/26/anthropics-s-1
- CryptoBriefing, "Anthropic set to publish its S-1": https://cryptobriefing.com/anthropic-s1-filing-ipo-release

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
