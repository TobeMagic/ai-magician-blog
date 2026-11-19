---
title: "Nvidia 临时 CEO 称 Huang 离职后开源 AI 战略与 Hugging Face 收购不变"
date: "2026-11-18 11:00:44"
updated: "2026-11-19 01:26:22"
permalink: "posts/2026/11/18/nvidia-临时-ceo-称-huang-离职后开源-ai-战略与-hugging-face-收购不变/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/18/nvidia-临时-ceo-称-huang-离职后开源-ai-战略与-hugging-face-收购不变/"
article_id: "5f6cc602-33da-4c7c-a317-764cd97caaf8"
description: "Nvidia 临时 CEO Collette Kress 在 Huang 辞职后的首次财报电话会上重申公司开源 AI 战略不变，表示将打造开放模型生态，并推进 9 月达成的 129 亿美元收购 Hugging Face 交易。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/51ea1e58-2e5a-4fd4-b728-d203d22cdf8b.png"
imgTop: false
---

# Nvidia 临时 CEO 称 Huang 离职后开源 AI 战略与 Hugging Face 收购不变

## 一、发生了什么：一次财报电话会，两个承诺

11 月 12 日，Huang 卸任 Nvidia 总裁、首席执行官与董事，即刻生效；首席财务官 Collette Kress 出任临时 CEO，公司同时启动新任 CEO 的遴选程序。11 月 17 日，Kress 主持了 Huang 卸任后首次财报电话会，并在开场白里做了两个直接表态：Nvidia 将致力于「打造充满活力的开放模型生态，让每个国家、企业与行业都能建立自己的智能」；9 月敲定的 129 亿美元收购 Hugging Face 交易继续按原计划推进，预计 2027 年上半年完成交割。

同一次电话会给出了几组硬数据：OpenRouter 的每周 Token 用量同比增长 35 倍，过去三个月增长 3.5 倍；Nemotron 已成为「OpenRouter 上使用最广泛的美国开放模型」，被 Kress 称为「开发者开始构建自身智能的起点」。问答环节里，分析师没有直接问到收购案，Kress 主动补了一句：「我们将携手扩大这个平台的规模，让智能更加开放、功能更强大、也更容易取得。」

开源社区的第一反应更早一天。11 月 12 日，Hugging Face 首席执行官 Clément Delangue 在 X 上写道：「这一切糟透了，我真希望这一切都没有发生。这真是悲伤的一天！但有一件事我想说清楚：我们会继续为开源 AI 而战，而且会比以往更加努力。现在放慢脚步，代价太大。让我们行动起来！」

同期还有一条平行线：据《华尔街日报》报道，美国证券交易委员会正在调查 Nvidia 是否曾透过不实或具误导性的信息披露误导投资人，Huang 本人预计将在感恩节前往国会作证。这些背景说明一件事：这次电话会被放在一个远高于例行业绩沟通的放大镜下。

## 二、市场为什么紧张：承诺的「承接人」问题

焦虑的核心不是收购案本身，而是承诺的归属结构。Huang 对开源的支持不是单点表态，而是一组分布在不同层面的动作：7 月，他在 X 上发布 AI 政策公开信，Microsoft、Meta、Hugging Face、IBM、Palantir 等 25 家公司联署，呼吁政府不要对开放权重模型施加过度限制；8 月，Nvidia 与编程初创公司 Poolside 达成 60 亿美元合作，在美国建设开放 AI 生态；10 月，Nemotron 家族新增 1200 亿参数企业级 Agent 模型与两款可在 PC 上运行的轻量 Bolt 模型；今年 1 月的 CES 主题演讲上，他说过开源模型「真正革新了人工智能」。

这些承诺分散在三个层面：政策联署、并购合作、模型发布。当主要负责人离开时，交易对手必须重新判断：哪些承诺跟随公司合同，哪些依赖个人品牌，哪些依赖工程组织。这个问题在任何平台型公司的交接里都会出现，而 Nvidia 的版本多了两个放大器。第一个放大器是监管：美国司法部 10 月起就收购案对 AI 市场竞争的影响展开问询，Nvidia 在训练芯片市场占有主导地位，再取得模型分发渠道后，「开放生态能否在收购后维持」正是监管关注点。第二个放大器是既成事实：Hugging Face 服务着 1.18 亿开发者与 20 万企业，是开发者下载、分享与测试模型的第一站，素有「AI 界 GitHub」之称；谁控制这个分发层，谁就握着开源生态的管道。

## 三、三种实现路径：封闭、开放与混合

从系统架构角度看，「一家算力公司如何构建模型生态」至少有三条路径，工程边界各不相同。

方案 A：全封闭内建。模型、工具、分发全部自持，类似传统闭源软件路线。优势是版本与商业化完全可控，外部生态不构成约束；代价是开发者关系被切断。对 Nvidia 这类公司，GPU 购买决策大量由开发者与研究团队推动，封闭模型层等于把最活跃的用户群排除在飞轮之外。OpenRouter 每周 Token 三个月增长 3.5 倍这条曲线，主体正是开放模型。

方案 B：全开放权重。所有模型开放权重，以 Hugging Face 为中央分发枢纽，生态靠社区信任增长。增长数据是真实的：Hugging Face 平台汇聚超过 300 万个模型、100 万 AI 应用，月活跃开发者超过 1800 万，数据集逾 50 万笔。但开放权重的成本同样真实：商业化溢价要让渡一部分，安全与供应链边界要持续投入——开放模型是「易复制、难防御」的资产，防御只能靠生态密度而非专利。

方案 C：混合——Nvidia 的实际选择。开放模型层（Nemotron 开放权重加 Hugging Face 分发），封闭算力层（CUDA、供应链、数据中心）。这是一条显式的分层：什么开放、什么封闭，边界写在收购协议里。Huang 在联合声明中强调，收购后 Hugging Face 将「无论选择哪家云端或哪种芯片，都会继续服务」；平台中立性与开源承诺是谈判的核心条件，双方已在协议中明文保障。交易对价也按工程方式拆分：129 亿美元中约 119 亿支付股东，另拨约 10 亿作为员工留任奖金，锁定核心团队在过渡期的连续性。批评者的「管道控制」忧虑——平台是否会隐性优先自家 GPU 与 CUDA 工具——正是这条混合路径的信誉风险点，也是司法部问询的技术内核。

交易的定价史本身就是一条工程时间线：2023 年 Hugging Face C 轮 2.35 亿美元、估值 45 亿美元，Nvidia 与 Google、Amazon、IBM 一同入股；2025 年底 Nvidia 提出 5 亿美元投资、对应估值约 70 亿美元，被对方以「不希望单一大股东主导决策」回绝；最终 2026 年 9 月 3 日以 129.3 亿美元完成收购协议，溢价较前次估值高出 85% 以上。18 个月、三轮报价，从投资到收购，路径的每一步都在回答同一个问题：开放的分发层要不要被算力层持有。

把并购序列放在一起看，节奏更清晰：2025 年 12 月，Nvidia 以 200 亿美元收购推理芯片公司 Groq 的资产，是公司史上最大的一笔并购；2026 年 9 月的 Hugging Face 交易以 129.3 亿美元成为史上第二大。先锁定推理芯片的架构选项，再锁定模型分发平台——算力层与生态层各补一块，混合架构的分层在资产负债表上完成了闭合。



![混合路径的分层架构：开放模型层与封闭算力层的工程边界](https://iili.io/o3D1UzJ.png)
> 混合路径的分层架构：开放模型层与封闭算力层的工程边界



## 四、选型决策表：什么决定了选择

| 决策维度 | 方案 A 封闭 | 方案 B 开放 | 方案 C 混合（Nvidia） |
|---|---|---|---|
| 主要客户 | 求开箱即用的企业 | 开发者与研究机构 | 两者 |
| 模型层 | 封闭 | 开放权重 | 开放权重（Nemotron） |
| 分发层 | 自建 | 社区平台 | Hugging Face（2027 上半年交割） |
| 算力层 | 封闭 | 部分开放 | 封闭（CUDA） |
| 主要风险 | 开发者流失 | 商业化与安全 | 管道控制、反垄断审查 |
| 连续性机制 | 合同 | 社区共识 | 协议条款加留任奖金加中立性承诺 |

混合路径的关键不在「开放哪一层」，而在「把边界写进合同」。Hugging Face 收购协议中的平台中立条款、10 亿美元留任奖金、「无论哪种芯片都继续服务」的公开承诺，做的都是同一件事：把开源承诺从个人背书迁移到组织契约。Kress 在电话会上的重申也是同样的动作——信任锚点从「Huang 本人」切换到「公司合同与工程组织」。对监管而言，这套合同化机制就是回应司法部问询的答辩材料：开放生态不是靠新 CEO 的善意维持，而是靠协议条款维持。

## 五、工程取舍的三条可复用判断

对做平台交接与开源策略的工程师，这个案例给出三条可以搬走的判断。

1. 把承诺拆成三层：合同层、组织层、个人层。创始人离开后，只有前两层存活。Hugging Face 案里，中立性条款、留任奖金、公开服务承诺都已完成合同化，这是交接期保活生态的最低成本做法。可以落地的检查项：把平台对外的全部关键承诺列成清单，标注每条的载体（合同条款、组织流程、个人信用），目标是在关键人离开之前，把个人信用承载的比例压到两成以下。

2. 把「接缝」当作一等工程对象。混合架构里，分发层与算力层的接缝是信誉的制造地，也是信誉的消耗地。接缝要设定显式规则：平台可以做什么推荐、哪些工具享有优先展示、冲突利益如何披露。规则公开，才接得住「管道控制」的质疑。

3. 用外部数据监测开源策略的健康度，而不是情绪指标。OpenRouter 每周 Token 年增 35 倍、三个月增 3.5 倍，是开放生态的两个先行指标；Hugging Face 月活 1800 万开发者与 300 万模型的数量变化是第二组。增长曲线拐头，比任何公开声明都早暴露承诺的衰减。落地方式：把 Token 增速、月活开发者、模型数量三个数写进季度复盘，连续两个季度走平即触发策略复审。

未来六个月有三个可跟踪节点：司法部与 FTC 的反垄断审查结论是否先于 2027 年上半年交割；Nemotron 家族在 Kress 治下是否保持 10 月那样的发布节奏（1200 亿参数 Agent 模型加两款 PC 端 Bolt 模型）；以及新任 CEO 的遴选结果——它最终决定混合路径是公司选择还是过渡状态。

## 参考文献
1. Nvidia 官方表态：黄仁勋离职后开源 AI 策略维持不变。https://news.cnyes.com/news/id/6665686
2. TechCrunch：Nvidia says its open-source AI strategy remains intact after Jensen Huang's exit（2026-11-17）。https://techcrunch.com/2026-11-17/nvidia-says-its-open-source-ai-strategy-remains-intact-after-jensen-huangs-exit
3. TechCrunch：Hugging Face CEO vows to keep fighting for open-source AI after Jensen Huang's exit（2026-11-12）。https://techcrunch.com/2026-11-12/hugging-face-ceo-vows-to-keep-fighting-for-open-source-ai-after-jensen-huangs-exit
4. Mezha：Hugging Face 首席执行官称，Huang 离职后，公司将继续为开源 AI 而战。https://mezha.net/ch/news/mezha-cf8aede2b245e7bec292d7ba_hugging-face-ceo-says-company-will
5. The RaviT Show：Hugging Face CEO Pledges to Champion Open Source AI After Jensen Huang Departure。https://www.theravitshow.com/blogs/hugging-face-ceo-pledges-to-champion-open-source-ai-after-jensen-huang-departure
6. Android Headlines：Hugging Face CEO Doubles Down on Open-Source AI。https://www.androidheadlines.com/2026/11/hugging-face-ceo-doubles-down-open-source-ai-jensen-huang.html
7. IT之家（搜狐转载）：Hugging Face CEO哀叹黄仁勋从英伟达离职：承诺继续力挺开源AI。https://m.sohu.com/a/1100876545_114760
8. Yahoo 财经（港）：黄仁勋离职后英伟达：开源 AI 策略维持不变。https://hk.finance.yahoo.com/news/%E9%BB%83%E4%BB%81%E5%8B%B3%E9%9B%A2%E8%81%B7%E5%BE%8C-%E8%BC%9D%E9%81%94-%E9%96%8B%E6%BA%90ai%E7%AD%96%E7%95%A5%E7%B6%AD%E6%8C%81%E4%B8%8D%E8%AE%8A-033007542.html
9. INSIDE：NVIDIA 129 亿美元确认收购 Hugging Face，黄仁勋：开源路线不受影响。https://www.inside.com.tw/article/42292-nvidia-acquires-hugging-face

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
