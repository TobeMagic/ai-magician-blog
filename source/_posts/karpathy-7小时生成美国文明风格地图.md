---
title: "Karpathy 7小时生成美国文明风格地图"
date: "2026-11-27 10:20:57"
updated: "2026-11-27 14:47:35"
permalink: "posts/2026/11/27/karpathy-7小时生成美国文明风格地图/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/27/karpathy-7小时生成美国文明风格地图/"
article_id: "7e36890e-fc5d-492d-bcbe-afed0e625fb2"
description: "前OpenAI创始成员Karpathy用Claude构建了一张可玩的美国《文明》风格地图：7小时、4.5万行代码。Census、BLS等31个真实数据源统一到25 km六边形网格，GDP映射为金产量，城市区域按真实产业分化。含19个视图、524个都市City View、3100+县Explorer，已部署在karpathy.ai/usaciv。Karpathy原话：很好玩。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/eacd76c3-3ce6-4d4e-9f63-e64c89d9138f.png"
imgTop: false
---

Claude 跑完七个小时，4.5万行代码落地，美国装进了一张《文明》地图。

读完整篇文章，你可以判断三件事：这次实验里真正难的部分在哪里，31 个官方数据源是怎么被压进一张 25 km 六边形网格的，以及「agent 式多小时数据工程」值不值得写进你团队的路线图。

Karpathy 在 X 上的原帖只有一句话：让 Claude 用美国的真实数据，填满一张《文明》风格的游戏地图。Opus 5.5 自己去找、下载、解析数据，七个小时、4.5 万行代码之后，原帖原话是「它跑起来了 :)」。项目部署在 karpathy.ai/usaciv，页面上的「?」挂着源码链接，Claude 还顺手生成了一条 trailer。

工具链非常朴素：Claude Code 桌面端，Opus 5.5 调到中档，打开 ultracode 模式。没有需求文档，没有人工接管。Karpathy 在帖子里交代了成本：他一周的 Claude 配额用掉了一半，剩下的一半「得让别人接手」。他自己的评价也克制：不确定最初想做什么，但浏览和把玩它真的很有意思，说不定还能扩展成一个真正的游戏。

## 一、七小时一张地图：边界在哪里

### 人物与动机

Karpathy 是前 OpenAI 创始成员，也是「氛围编程」（vibe coding）这个词的提出者。更早他在 Tesla 负责 Autopilot 视觉，带团队做数据标注、训练与部署，目标是可扩展的完全自动驾驶。他早先还做过同方向的工具：US Job Market Visualizer，用 BLS 的职业手册数据画了一张 342 个职业的 treemap，覆盖 1.43 亿个美国岗位，色块面积代表就业人数，颜色可以切换为 AI 暴露度、中位工资或增长预期。从 Tesla 的数据管线到 Claude 的多源对齐，他的实验始终围绕同一件事：让模型自己把脏数据变成能用的资产。

### 起点与终点

起点是一句话指令，终点是一个可玩网站：19 个视图、524 个都市的城市视角、3100+ 县的 Explorer，全部挂在同一张 25 km 六边形网格上。中间的过程——找数据、清洗、对齐、写前端——都由模型自己完成，人工没有介入任何一步。

### 地图的边界

模型主动跳过了少数州和领地，原帖里是一句「sry」。被跳过的区域让地图边界并不等于国境线，这是这套系统当前的数据覆盖缺口，也是后续迭代要补的第一块。

## 二、31 个官方数据源如何变成一张地图

### 数据源清单

31 个公开统计源，每个都对应一类现实：Census 提供人口与住房，BEA 提供地区经济核算，BLS 提供就业与工资，EIA 提供电力与电厂，NOAA 提供气候与灾害，USGS 提供地形与地质，DoD 提供军事基地，NPS 提供国家公园，FAA 提供机场，FEMA 提供灾害响应记录，CDC 提供健康数据。模型自主完成下载、解析与对齐，把真实地形、土地覆盖、GDP、就业、发电厂、矿山、港口、机场、军事基地、公园、大学、货运流、灾害记录，全部压进一张 25 km 六边形网格。货运流、矿山、港口、电厂这些基础设施层同样进网格，城市之间的物流关系第一次在一张图上可视化。



![31个数据源汇入一张网格](https://iili.io/oqirMiv.png)
> 31个数据源汇入一张网格



### 游戏语言的翻译规则

映射规则是这套系统最好看的部分。GDP 变成金产量；城市的区域是它真实的产业分化——圣何塞拿到 Campus，底特律是 Motor city；居民构成是真实就业结构：圣何塞每 4 个就业者里有 1 个是工程师、码农或科学家，全国均值是 14 个里 1 个。Wonder 的评选有公开规则：国家公园按游客量排序，大学按 R&D 支出排序。规则可查、可复现，不是模型自由发挥。



![GDP变成金产量](https://iili.io/oqirOOX.png)
> GDP变成金产量



### 9 个 advisors 加 1 个 Explorer

除了 19 个 lenses，系统还配了 9 个 advisors 和 1 个 Explorer。Explorer 把 3100+ 个县的任意一列数据展开成表格和散点图，并与地图联动：看到的每一个色块，都能下钻到县一级的证据，再跳回它在全国的位置。

## 三、19 个视图和 524 个城市视角

### 切换视图就是切换问题

19 个 lenses 覆盖收入、学历、信仰、灾害等维度。其中收入、学历、信仰、灾害是四个示例维度：收入看人均产出，学历看学位密度，信仰看教会登记，灾害看历史灾害暴露。同一张网格、不同着色，回答的是不同问题，色块随维度切换重算。看地图的人不需要懂 GIS，只需要选一个 lens。



![19个视图任意切换](https://iili.io/oqirPJS.png)
> 19个视图任意切换



### 城市视角下钻到产业

City View 覆盖 524 个都市圈。点开一座城市，看到的是它的真实产业分化和就业结构，而不是一个均质色块：圣何塞是科技园区，底特律是汽车之城，这些标签背后是对应的就业统计，不是人工编辑的文案。



![524个城市视角](https://iili.io/oqirDsj.png)
> 524个城市视角



### 一条浏览动线

打开 karpathy.ai/usaciv 之后，动线是三步：先选一个 lens 决定问题，再点一座城市进入 City View 看产业与就业，最后进 Explorer 把感兴趣的县一列数据展开成表格加散点图。三步之间地图与图表互相联动，不需要离开页面。

## 四、这次实验真正说明了什么

### 瓶颈不在写代码

4.5 万行代码不是难点。难点是发现、清洗、关联 31 个官方统计数据集，再把它们对齐到同一张网格上——这条多小时级的数据工程链路，agent 端到端跑完了，中间没有人工接管。英文报道的概括一针见血：难的部分从来不是地图本身，而是把 31 个官方数据集找齐、洗干净、接在一起。



![4.5万行代码落地](https://iili.io/oqi4KXa.png)
> 4.5万行代码落地



### 同方向的能力信号

这不是孤例。Karpathy 自己的 US Job Market Visualizer 用 BLS 职业手册做了 342 个职业的 treemap，覆盖 1.43 亿个岗位；社区里也有人用 Opus 5.5 做 one-shot 网页游戏：一句话提示词、单会话生成、零人工改动、直接部署上线，过程包括无头浏览器自测和派子代理做代码审查。这些样本指向同一个方向：agent 的代码能力已经不是瓶颈，多源数据发现与对齐才是新的工程问题。

### 成本与配额

一次七小时的长任务，吃掉约一半的周配额。这个数字对做成本核算的团队有直接参考价值：agent 式长任务的定价单位不再是「每轮对话」，而是「每段多小时级任务」。先算清配额消耗，再谈任务时长，是这类项目排期时容易漏掉的一步。

### 它离一个游戏还差什么

Karpathy 原帖说，项目「可能能扩展或做成一个游戏」。目前差的是游戏机制：资源调配、城市升级、事件系统都还没有，数据层是完整的，玩法层是空白的。对游戏团队来说，这等于一张已经做完数据联动的《文明》地图资产，剩下的只是规则和数值。

### 可复制清单

- 数据源：Census、BEA、BLS、EIA、NOAA、USGS、DoD、NPS、FAA、FEMA、CDC 等 31 个
- 统一坐标系：一张 25 km 六边形网格，承载地形、经济、基础设施
- 映射规则：GDP 到金产量，产业到城市区域，就业到居民结构
- 视图层：19 个 lenses、9 个 advisors、Explorer（3100+ 县）

### 团队行动建议

把「agent 式多小时数据工程」拆成三个可评估的动作：第一，盘点自己手里的官方数据源，列一张 10 到 30 项的清单；第二，选一个统一网格或统一键，做一次跨源对齐试点，把「发现、清洗、对齐」作为验收标准而不是代码行数；第三，给试点设成本上限，参照本次约一半周配额做一次预算，先小规模跑通再谈规模化。

## 参考文献
- Karpathy on X（原帖）: https://x.com/karpathy/status/2125779541952246039
- Ado 转发（完整 bullet 列表）: https://x.com/adocomplete/status/2125994186252161315
- 新智元报道: https://m.sohu.com/a/1106783618_473283
- CellCog 项目拆解: https://cellcog.ai/blog/karpathy-claude-civilization-map
- Digg 聚合页: https://digg.com/ai/7at6677g
- US Job Market Visualizer: https://karpathy.ai/jobs

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
