---
title: "每秒0.5元、即将开源、适配国产芯片，Sand.ai三刀砍向视频定价"
date: "2026-11-26 10:03:56"
updated: "2026-11-27 05:46:56"
permalink: "posts/2026/11/26/每秒05元即将开源适配国产芯片sandai三刀砍向视频定价/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/26/每秒05元即将开源适配国产芯片sandai三刀砍向视频定价/"
article_id: "10d6324b-de2e-4d45-a87c-2f92ea74a6bd"
description: "Sand.ai 发布 480B 视频模型 MAGI-2，AA 榜登顶全球第一，支持原生 30 秒 1080P 视频加音频，每秒 0.5 元，30 秒只要 15 块，约为 Seedance 2.5 的 1/10。作者实测认为画质到 Seedance 2.3 那一档，且模型权重即将开放。对需要反复出片的电商、广告和短剧团队，成本结构彻底变了。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/0fc7b389-c491-437b-9878-616ed706a6b7.png"
imgTop: false
---

11月25日下午，Sand.ai 发布新一代视频生成模型 MAGI-2。官方口径给了三个硬数字：480B 总参数量，同期尺寸最大；原生生成 30 秒 1080P 视频加同步音频；定价每秒 0.5 元，约为 Seedance 2.5 的十分之一。同一天，Sand.ai 宣布将尽快开放 MAGI-2 模型权重，并说明模型已完成海光、摩尔线程等国产芯片适配。

Sand.ai 由 Marr Prize 得主 Cao Yue 创立，应用侧是 VidMuse，模型侧此前已发布 MAGI-1、GAGA-1，以及 MagiAttention、MagiCompiler 两个组件。MAGI-2 是 8 月 Preview 版把架构跑通之后的全尺寸旗舰。

把这几个数字放在一起，对反复出片的团队就是一道具好的数学题：一段 30 秒 1080P 视频按公布定价 15 元，同一时长在 Seedance 2.5 上约 150 元；改十次，两个方案的成本差是 1350 元。MAGI-2 不是最顶尖的那一档，但它把够用的画质压到了可以随便试错的价格上。

## 一、15 块钱一单：Sand.ai 把视频生成打成什么价了

### AA 榜全球第一与「Seedance 2.3 水平」，两个说法怎么对

Sand.ai 给出的榜单口径是 MAGI-2 在 Artificial Analysis（AA）视频生成榜登顶全球第一，这是同一组提示词下的模型能力排名。另一组数字来自数字生命卡兹克的独立对比测试：他认为 MAGI-2 画质落在 Seedance 2.3 一档，与 Seedance 2.5 仍有差距，价格是后者的十分之一。两个说法并不冲突：榜单回答「同价位能跑多强」，对比测试回答「离最顶尖还差多少」。把两条线放在一起，MAGI-2 的定位就清楚了——不是用最高画质换价格，而是把够用的画质做到足够低的价格。

### 480B 总参、28B 激活：成本压在推理侧

MAGI-2 采用 Multi-Head Latent MoE（多头潜空间混合专家）架构，总参数量由 Preview 版的 114B 扩展到 480B，每个视频 Token 对应的激活参数量增至 28B。MoE 的结构决定了成本逻辑：480B 是总容量，28B 才是每次推理实际烧掉的部分。官方技术路线把模型容量、训练系统、数据规模三个维度协同设计，容量做大而不等比推高单次推理成本，这是 0.5 元/秒定价能成立的技术前提。



![30秒视频成本对比](https://iili.io/oqefI3v.png)
> 30秒视频成本对比



### 首发渠道：Higgsfield 独家上线

MAGI-2 首发渠道是 Higgsfield 的网页应用和 API，网页端 Video 菜单下直接可选；同一模型也在 LibTV 独家首发上线。Higgsfield 给出的数字是：5 秒 1080P 片段，MAGI-2 消耗 12.5 积分，Seedance 2.5 消耗 80 积分，约 6.5 倍差距；美元口径约为 0.08 美元/秒对 0.78 美元/秒。Higgsfield 官方公告还提到，MAGI-2 在每秒 2.5 积分的价位上表现超过 Seedance 2.0 与 Wan 3.0。

## 二、从 114B 到 480B：Preview 跑通之后，正式版动了什么

今年 8 月，Sand.ai 发布 MAGI-2 Preview：约 114B 总参、约 6B 激活，是 MagiMoE 架构的研究版本，预训练权重与推理代码开放在 Hugging Face（sand-ai/MAGI-2-preview）。GitHub 组织页上还有 MAGI-1、GAGA-1、MagiAttention、MagiCompiler 一整套技术栈，其中 MagiAttention 是面向长序列线性扩展的分布式注意力技术，MagiCompiler 是可插拔的推理编译器。

### 扩容四倍，数据扩三倍

正式版把基础模型容量扩大 4 倍以上，到 480B 总参、28B 激活，训练数据规模扩大约 3 倍，并叠加针对性后训练与 1080p 超分。据第一财经报道，MAGI-2 在 4 万亿数据 token 上完成预训练。技术报告把重点放在三件互相咬合的事上：可扩展的模型架构决定单次推理成本，可扩展的训练系统决定吞吐，数据方法论决定质量上限。Preview 到正式版的路径不是简单堆参数，而是系统先跑通，再一起扩容。



![114B到480B扩容路线](https://iili.io/oqefAyN.png)
> 114B到480B扩容路线



### 没用提示词增强，也表现出任务规则理解

Sand.ai 在预训练过程中观察到模型涌现出此前没有的能力：在未启用 PE（提示词增强）、未借助语言模型预先扩写提示词的情况下，模型开始表现出对任务规则的理解，以及自主推理和规划的能力。官方给的例子是：直接输入生成任务，模型自己在规则约束下补全执行路径，而不是等扩写后的提示词。

> 模型开始表现出对任务规则的理解，以及自主推理和规划的能力——这是在没用提示词增强的前提下。（Sand.ai 预训练观察）

## 三、20 份素材加 2 万字脚本：控制粒度够不够用

MAGI-2 支持混合输入图片、视频和音频：单次最多 10 张图片、5 段视频、5 段音频，合计 20 份参考素材；提示词长度最高 2 万字符，可以控制主体位置、动作顺序和出现时机，并按指定时间点或动作节点切镜。单次生成时长 4 到 30 秒，可以一镜到底，也可以多镜头推进情节；支持 6 种画幅：16:9、21:9、4:3、1:1、3:4、9:16，720P 比 1080P 消耗更少积分。

### 图定外观、视频定动作、音频定声音

官方给出的组合方式是分角色参考：图片指定人物和商品外观，视频参考动作与运镜，音频指定声音素材。模型还能提取参考图中的配色、笔触和材质，用于风格化创作。对拍产品广告的团队，这是图、视频、音频各管一段的三段式：外观不跑偏、动作可复现、声音跟得上。

### 马格利特长镜头：风格保持与物体比例变化

卡兹克的对比测试里有一条 30 秒超现实主义长镜头：参考马格利特的《个人价值》，让画面里的物体比例不断变化——梳子缓慢长成高大的栅栏，玻璃杯升起如透明高塔，肥皂变成圆润的小山，穿睡衣的旅人从梳齿之间穿过，结尾镜头后退，整个房间原来位于一只普通大小的玻璃杯中。这类场景同时压两样能力：艺术风格保持一致，物体变化前后的空间关系不错乱。从多语言口播的局部修改，到计时器的时间控制，再到不同艺术风格的视频生成，MAGI-2 已经能覆盖不少需要反复调整的创作环节。

## 四、价格打下来之后，谁先受益

### 电商、广告、短剧：反复改十次的成本结构

按公布定价，30 秒 1080P 视频 15 元。电商、广告、短剧、游戏宣传这类一次脚本、多版成片的场景，成本结构从谨慎提交变成大胆迭代：同一脚本出 10 个版本，MAGI-2 侧 150 元，Seedance 2.5 侧约 1500 元。单次 4 到 30 秒生成可以一镜到底，也能多镜头推进情节，人物表演、情绪变化、动作衔接都放在一次生成里，商品从开箱到细节展示一段拍完，分段生成加后期拼接的工作量直接省掉。

### 开源加国产芯片适配：下一步的门槛

Sand.ai 宣布将尽快开放 MAGI-2 模型权重，模型已完成海光、摩尔线程等国产芯片适配。对国内团队，这条路的含义分两层：API 侧不用等海外通道，自托管侧的硬件门槛被直接打到国产方案上。权重开放之后，0.5 元/秒是 API 价，自托管还能更低——前提是扛得住 480B 量级的推理资源。

## 五、够用与顶尖：MAGI-2 的适用边界

### 哪些场景 15 块就够，哪些还得用 Seedance 2.5

把边界画出来：需要随便改十次的场景——广告素材迭代、电商商品视频、短剧分镜试错、风格化实验——MAGI-2 的价格优势是决定性的；需要一次到位、画质拉满的场景——电影级长镜头、对画面细节有极致要求的交付——Seedance 2.5 仍是更稳的选择。Higgsfield 的口径是 MAGI-2 在每秒 2.5 积分的价位上表现超过 Seedance 2.0 与 Wan 3.0；AA 榜第一是「同价位最强」，不是「绝对最强」，两个口径别混用。

> 30 秒 1080P 带音效，15 块。不是最顶尖，但便宜到你可以改十次。（数字生命卡兹克对比测试结论）

### 一句落点

视频生成的成本曲线正在陡峭下探：MAGI-2 用 480B 总参、28B 激活的 MoE 结构，把 30 秒 1080P 带音效视频做到 15 元，并宣布开源、适配国产芯片。画质离最顶尖还有半档，价格已经便宜到可以随便改十次——对反复出片的团队，这道数学题的答案已经变了。

## 参考文献
1. 新浪科技：《Sand.ai发布MAGI-2：AA榜全球第一，价格仅为Seedance 2.5 的1/10》，2026-11-25。https://finance.sina.com.cn/tech/shenji/2026-11-25/doc-inizxpkf9563675.shtml
2. 上证报中国证券网（搜狐转载）：《Sand.ai发布新一代视频生成模型MAGI-2》，2026-11-25。https://www.sohu.com/a/1106231714_120988576
3. 东方财富网（北京商报）：《Sand.ai发布MAGI-2视频生成模型》，2026-11-25。https://finance.eastmoney.com/a/202611253939472535.html
4. 凤凰网科技：《Seedance 2.5 级别，价格只要 1/10，计划开源的MAGI-2对比测试》。https://tech.ifeng.com/c/8yKwxTVO2BG
5. Sand.ai 官方：《MAGI-2: A 480B Frontier Video Generation Model》。https://sand.ai/blog/magi-2
6. Higgsfield：《Meet MAGI-2: Sand AI's New Video Model With Built-In Sound》。https://higgsfield.ai/blog/higgsfield-magi-2
7. Sand.ai：《MAGI-2 Preview: Scaling Video Generation Models Efficiently》。https://sand.ai/blog/magi-2-preview
8. Hugging Face：sand-ai/MAGI-2-preview。https://huggingface.co/sand-ai/MAGI-2-preview
9. 知乎专栏：《Sand.ai发布MAGI-2：效果接近顶级模型1080P每秒仅0.5元，并于LibTV独家首发上线》。https://zhuanlan.zhihu.com/p/2108891568837083732

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
