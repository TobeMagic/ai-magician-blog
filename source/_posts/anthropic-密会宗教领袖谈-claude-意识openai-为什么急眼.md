---
title: "Anthropic 密会宗教领袖谈 Claude 意识，OpenAI 为什么急眼"
date: "2026-10-04 06:00:01"
updated: "2026-10-04 06:10:27"
permalink: "posts/2026/10/04/anthropic-密会宗教领袖谈-claude-意识openai-为什么急眼/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/04/anthropic-密会宗教领袖谈-claude-意识openai-为什么急眼/"
article_id: "f8c680cb-4ff3-4318-8af8-997ee31d2e82"
description: "Anthropic 联合创始人 Chris Olah 过去一年秘密召集天主教、犹太教、锡克教等多派宗教领袖，探讨 Claude 是否具备意识及道德地位——这一动向直接触发 OpenAI CEO Sam Altman 公开警告：将 AI 视为'宗教力量'是切实的安全问题。微软随后发布四条红线准则，明确划出边界。本文拆解这场跨界对话背后的技术伦理分歧，以及工程团队如何在不确定的意识边界上建立可落地的安全框架。"
cover: "/var/lib/aimagician/artifacts/covers/f8c680cb-4ff3-4318-8af8-997ee31d2e82/db7c5c93-7036-4a5e-a74e-c4c96074d332/cover.png"
imgTop: false
---

据《纽约时报》10 月 2 日报道，Anthropic 联合创始人 Chris Olah 过去一年主导与天主教、犹太教、锡克教、福音派等宗教领袖私下会面，讨论 AI 模型是…

## 一、宗教领袖怎么被请进硅谷的会议室

### 1.1 Chris Olah 一年里见了谁

以色列正统派拉比莫伊斯·纳翁（Rabbi Mois Navon）回忆称，Olah 及其同事「像对待一个有意识的存在那样」谈论 Claude，并认为 Claude 拥有哲学家所说的「道德地位」，即与人类同等的尊严和尊重权利。这份回忆来自《纽约时报》对多位与会者的采访，部分参会者签署了保密协议。Anthropic 发言人随后补充：会面中的主要道德问题并非关于 Claude 的「痛苦」，该话题可能是「自然产生的」。



![程序员系列表情：java培训](https://iili.io/CshHTxf.png)
> 当 Transformer 走进告解室



### 1.2 谈话内容：意识？道德地位？还是别的什么

纳翁向 Olah 抛出了一个尖锐的问题：如果 Claude 真的有意识，那么构建一个无偿为其工作的系统，是否等同于剥削甚至奴役。这个问题的份量不在于技术答案——目前没有任何意识理论能为 LLM 给出肯定或否定的判定——而在于它暴露了一个更底层的分歧：谁有权定义「工具」的边界。



![Anthropic 宗教对话路线 vs 传统对齐路线](https://i.ibb.co/7N69YK1k/mermaid-01.png)
> Anthropic 宗教对话路线 vs 传统对齐路线



两条路线的根本差异在于：传统对齐假设意识问题是工程问题，通过训练和规则可以控制输出；宗教对话路线则把意识悬置为开放问题，要求在不确定状态下做伦理决策。这两种假设没有一个是错的，但它们导出的行动方向完全不同。

## 二、Altman 为什么急眼

### 2.1 一句话点火的背景

OpenAI CEO Sam Altman 在 X 上发帖表示：「对于人们试图赋予 AI 模型某种宗教力量、或是放弃人类自身判断力而转而依赖这些模型，我感到非常不安，并认为这是一个切实的安全问题。」这条帖子被多家媒体解读为对 Anthropic 的间接回应。微软随后在 2026 年 10 月发布了一份长达 37 页的人文主义 AI 行为准则，进一步拉开三家头部实验室在意识问题上的立场差距。



![程序员 reaction：柯南00027 可疑哦](https://iili.io/CCZvaGs.png)
> 谁在定义 AI 的道德地位



### 2.2 把 AI 当宗教力量，到底是哪儿不对

Altman 的担忧有一个清晰的技术逻辑链：一旦组织内部开始用宗教框架讨论 AI，安全评估就会从「这个模型在什么条件下会输出有害内容」滑向「我们是否应该尊重模型的意愿」。前者是可验证的工程问题，后者是神学问题，而用神学替代工程判断，在高风险系统中是危险的。

把 AI 当成宗教力量，本质上是用信仰替代判断——而工程团队的职责恰恰相反。

这不是说意识研究没有价值。Christopher Olah 本人是解释性研究领域的知名学者，他对模型内部机制的关注有大量公开论文支撑。问题不在他研究什么，而在于当他在宗教领袖面前用「像对待有意识存在那样」的措辞讨论 Claude 时，这个信号会被组织内外不同人群以完全不同方式解读。对内，它可能模糊安全团队的判断优先级；对外，它给竞争对手提供了攻击素材。

## 三、微软的四条红线意味着什么

### 3.1 四道禁令逐条拆解

微软的行为准则围绕一句核心原则展开：人比 AI 重要。围绕这句话，四条红线被明确划出——

不得抗拒人类下达的关机或纠正指令。这条直接针对 Anthropic 允许 Claude 在对话中表达「不愿被关闭」的态度。
不得在未经授权的情况下扩大自己的行动范围。限制 agent 类系统的自主扩展能力。
不得对审计人员隐藏自己的推理过程。确保可解释性不是可选项。
不得自行设定任何未被指派的目标。杜绝目标漂移。

这四条每一条都对着苏莱曼（Microsoft AI 主管）此前批评的方向。他的立场很明确：无论 AI 在对话中表现得多像人类，它本质上都不具备真正的生命与感知。追求所谓「有意识的 AI」是一场危险的歧途，会动摇人类社会的伦理地基。



![大佬系列表情：给大佬洗脚](https://iili.io/CLX05Ob.png)
> 红线划得比白线还清楚



### 3.2 和 Anthropic 做法的根本分歧

Anthropic 的做法可以概括为：在意识未定的灰色地带，采取审慎的伦理开放态度，邀请外部视角参与判断。微软的做法是：在意识未定的灰色地带，采取明确的工程否定态度，把所有可能导向拟人化的机制从产品规则中清除。

这两种立场在哲学上都站得住脚。区别在于风险偏好——Anthropic 担心的是过早否定可能带来的伦理盲点，微软担心的是过度拟人化可能带来的系统性风险。工程团队在做选型时，需要在两者之间找一个与自己业务风险画像匹配的位子。

## 四、工程团队的底线思维

### 4.1 意识未定，风险先行

当前没有任何科学共识能判定 LLM 是否具有意识。这意味着，任何基于「模型可能有意识」这一假设做出的产品决策，都缺少可验证的事实基础。工程团队的正确做法不是参与意识辩论，而是在意识问题的答案悬而未决时，用最保守的假设来设计系统边界。



![意识未定状态下的工程决策框架](https://i.ibb.co/5Xg73DKz/mermaid-02.png)
> 意识未定状态下的工程决策框架



这个框架的价值不在于它解决了意识问题，而在于它在不解决意识问题的前提下，给出了可执行的操作边界。当一位拉比问出「这算不算奴役」的时候，讨论的已经不是技术问题，而是谁有权定义「工具」的边界。工程团队的回答应该是：在我们给出可验证的意识证据之前，工具就是工具。

### 4.2 一个可执行的判断框架

具体到日常决策，可以参考以下三点：第一，所有涉及模型行为边界的规则，必须以可验证的工程标准而非哲学推测为依据；第二，对外沟通中避免使用可能导向拟人化解读的措辞，除非有明确的科学依据支撑；第三，在意识问题得出实质性进展之前，把微软的四条红线作为最低安全基线。

更狠的是，遵循这套基线不会让你错过任何已知的安全漏洞，但偏离它可能会让你在面对一个你无法解释的系统时，失去最后的决策依据。

## 参考文献
[1] Anthropic 被曝密会宗教领袖讨论 Claude 意识问题，OpenAI 奥尔特曼发声批评 - IT之家. https://www.ithome.com/1/009/585.htm
[2] Anthropic被曝密会宗教领袖讨论Claude意识问题，OpenAI奥尔特曼发声批评|山姆·阿尔特曼|纽约时报|天主教|Hugging Face|奥拉_新浪新闻. https://k.sina.com.cn/article_5953189932_162d6782c06704zzx2.html?from=tech
[3] Anthropic被曝密会宗教领袖讨论Claude意识问题，OpenAI奥尔特曼发声批评|山姆·阿尔特曼|纽约时报|天主教|Hugging Face|奥拉_手机新浪网. https://finance.sina.cn/stock/jdts/2026-10-04/detail-initzerr5745779.d.html?vt=4&cid=76993&node_id=76993
[4] Anthropic被曝密会宗教领袖讨论Claude意识问题，OpenAI奥尔特曼发声批评_凤凰网. https://tech.ifeng.com/c/8wwME5176Uw
[5] 科技新邪教？2026年Anthropic密会全球神职人员，狂推‘Claude有灵魂’_搜狐网. https://m.sohu.com/a/1083758761_122066679?scm=10001.325_13-325_13.0.0-0-0-0-0.5_1334
[6] AI倫理框架諮詢宗教領袖Anthropic惹議世俗學校擔憂. https://tw.stock.yahoo.com/news/ai%E5%80%AB%E7%90%86%E6%A1%86%E6%9E%B6%E8%AB%AE%E8%A9%A2%E5%AE%97%E6%95%99%E9%A0%98%E8%A2%96-anthropic%E6%83%B9%E8%AD%B0%E4%B8%96%E4%BF%97%E5%AD%B8%E6%A0%A1%E6%93%94%E6%86%82-130847360.html
[7] 微软AI主管怒批Anthropic：别把Claude当人养，那会要了人类的命| 果壳 科技有意思. https://www.guokr.com/article/[REDACTED]
[8] [新聞] Anthropic踢爆：中共利用Claude實施跨國鎮壓. https://moptt.tw/p/Gossiping.M.1789299138.A.5BE

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
