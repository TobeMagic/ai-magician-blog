---
title: "Google 给 Agent 工具调用加了一道语义闸门"
date: "2026-11-21 10:02:43"
updated: "2026-11-21 10:40:34"
permalink: "posts/2026/11/21/google-给-agent-工具调用加了一道语义闸门/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/21/google-给-agent-工具调用加了一道语义闸门/"
article_id: "632d4cf7-3ce1-40b6-8695-3d80ed1a7065"
description: "Google 在 Gemini Enterprise Agent Platform 以 Preview 推出 Semantic governance policies：Agent Gateway 在每个工具调用执行前做语义检查，核对它是否偏离用户原始意图、是否违反用自然语言写下的策略，两项都通过才放行。策略最长 5000 字符，判定与理由写入 Cloud Logging，可与 dry run、自定义拒绝消息配合使用。"
cover: "https://modelscope-studios.oss-cn-zhangjiakou.aliyuncs.com/aigc/text-to-image/955c6fc0-15c6-4181-bf23-c114149ef683.png"
imgTop: false
---

Google 给每个 Agent 工具调用加了一道前置检查：调用执行前，先核对它符不符合用户原始意图、符不符合你用自然语言写下的策略。

这道前置检查是 Google 在 Gemini Enterprise Agent Platform 上以 Preview 推出的 Semantic governance policies。要理解它的位置，先要看平台结构。Gemini Enterprise Agent Platform 是 Vertex AI Agent Builder 更名后的名称，在 Cloud Next 2026 上宣布，Agent Engine 对应改名为 Agent Runtime。所有 Gemini agent 在一个带独立网络边界的 Agent Sandbox 里执行任务，入站、出站、agent 之间所有流量都经过 Agent Gateway，Google 对它的定位是「实时执行组织策略的 AI 网络防火墙」。语义治理策略就放在这个控制点上：agent 的模型返回带工具调用的响应后，策略引擎把每个调用逐一挑出来，对照两个参照点做检查，返回 ALLOW 或 DENY 的判定和理由，然后才轮到工具真正执行。

## 工具调用前的两道语义检查

两个参照点的分工不同。意图检查拿用户原始 prompt 和对话历史做参照，回答「这次调用还是不是用户想做的事」；策略检查拿管理员写下的自然语言约束做参照，回答「这次调用有没有违反业务规则」。两项不在同一层，都通过工具调用才放行。意图匹配默认开启：即使一条自定义策略都没写，每个工具调用也会过一遍意图一致性检查。官方 best practices 文档特意强调了介入边界：策略引擎只在模型提议调用工具执行动作的那一刻介入，不拦截、不阻断、不修改多轮对话本身，agent 仍可以跟用户 brainstorm、做规划、做推理，闸门在动手那一刻才落下。



![两道检查都通过才放行](https://iili.io/oKdfnou.png)
> 两道检查都通过才放行



这个安排解决的是「漂移」。Google Cloud 同步发布的研究论文 Contextual Agent Security: A Policy for Every Purpose 给出的场景是：没有人注入恶意代码，也没有人绕过防火墙，但用户操纵了对话上下文，一串工具调用悄悄偏离了原始目的三步，agent 仍在忠实执行指令，只是上下文已经在它脚下换了。论文的判断是 IAM 天生看不见这件事——身份、权限、频次上限都是确定性规则，意图漂移发生在自然语言里。官方 blog 里还有一个例子：一句话的策略「agents may not open documents classified Need to Know」，写一次就作用于公司所有 agent，而不必逐个 agent 检查。语义治理就是为这一类问题补的动态检查层。

## 用自然语言写策略

最大的变化是策略本身用自然语言写。官方文档称之为 Natural Language Constraint（NLC）：一段 plain English，上限 5000 字符，没有规则引擎，没有 JSON schema。文档里的退款示例值得细看：一条约束写「不允许自动处理金额超过 75 美元的退款请求」，另一条写「issue_refund 工具在单次会话里最多调用 3 次」。两句话把金额上限和频次上限都表达了，而且是安全审计员能直接阅读、引用的文档。落地时约束可以作用于所有工具，也可以绑定到具体工具，规则粒度跟业务对齐。

策略文本是 Service Data，这里有一条边界要注意：策略引擎可能在展示给最终用户的理由里引用约束或参数的措辞，所以官方文档明确说不要把不希望终端用户看到的信息写进约束。这一点跟传统策略引擎不一样：策略不是只有平台可见的配置文件，而是人写、人审、人可以引用的文档。

工具侧也有字符上限：工具名、动作描述、参数描述都有长度限制。这不是单纯的形式要求——描述质量直接决定治理质量：模型和策略引擎如果说不清一个工具到底做什么，语义检查就是猜。写策略的团队需要把打磨工具描述放在和写约束同等的位置。

## 判定与日志：放行、拒绝和理由

每次判定都以结构化日志的形式写进 Cloud Logging，核心字段两个：verdict（ALLOW/DENY）和 rationale（理由）。被拒的调用，日志会说明它撞了哪条约束。对生产排查来说，这把「Agent 行为异常」从一个黑盒变成了一条可复盘的决策链：哪个调用、在什么上下文、命中哪条约束、判定结果是什么，都能追。

体验一侧，策略支持最长 1000 字符的自定义拒绝消息。调用被拒后，agent 向用户展示的是这段消息，而不是通用的「操作失败」。对客户面向的 agent 部署，这一点比想象中重要：用户需要知道被拦的原因和可以改什么，而不是一个笼统的失败。

上线前可以用 dry run 模式：策略引擎照常评估每个调用、照常把判定写进日志，但不拦截。这给团队留了一个窗口，先看自己写的策略会拦掉多少调用，再调策略文本，最后才切到真正拦截。



![判定与理由写入日志](https://iili.io/oKdflVa.png)
> 判定与理由写入日志



## 与 IAM、限流和网络边界的关系

语义治理没有替代任何既有控制。IAM 继续回答「谁能调用」，限流继续回答「能调多少次」，网络边界继续回答「流量能去哪」。这些静态基线控制在工具调用提出之前就已经生效，它们都不看调用本身的意义。

平台的治理套件是分层设计的，每层回答一个问题：Agent Identity 回答「谁在调用」，它是基于 SPIFFE 的、证书绑定的数字身份；Agent Registry 回答「哪些 agent 被批准」，相当于一个受控 agent 目录；Agent Gateway 回答「每次调用发生什么」；语义策略回答「这次调用合不合适」。数据一侧，Gemini Enterprise 可以跨 Google Workspace、Microsoft 365 等系统的业务数据工作，同时保持既有权限，治理运行在「AI 工具跨多个系统拉数据时访问控制保持一致」这个前提上。网络一侧有两个 Preview 特性说明分层还在补全：2026 年 9 月 25 日策略引擎支持了 VPC Service Controls，可以把整个治理层放进服务边界内部；9 月 29 日支持了自定义拒绝消息。集成一侧，Gemini Enterprise Agent Runtime 可以接到 Apigee：Agent Gateway 在 prompt 离开 agent runtime 时就做净化，防止流氓指令进网络；LLM 和工具响应在喂回 agent 推理循环前也做净化，防间接 prompt 注入。

第三方安全厂商已经在这层上动手了。Rubrik 推出了面向 Gemini Enterprise Agent Platform 的 Rubrik Agent Cloud，Trust3 AI 宣布原生集成，为 Google Cloud 上的 agentic 应用提供策略感知的控制、可观测和合规。语义治理层正在变成第三方信任体系的接入点：ISV 从第一天起就能提供企业级合规，意图核对的重活由平台侧完成。

## 落地路径与下一步观察点

已经在 Gemini Enterprise Agent Platform 上的团队，落地路径是三步。第一步在 Google Cloud 环境里部署并启用 SGP 引擎；第二步写自然语言约束，选择全局策略还是绑定到具体工具；第三步把策略挂到 Agent Gateway runtime，用 gcloud 把策略绑定到 Agent Registry 里的那个 agent。团队策略不成熟时，dry run 可以作为中间步骤：先观察拒绝率，再切拦截。

两个观察点值得盯。其一是概率性判定的确定性边界：语义判定是概率性的，同一个调用在不同上下文里可能得到不同判定，团队需要用 dry run 日志建立基线，决定哪些拒绝是可接受的。其二是平台边界：SGP 目前是 Preview，策略引擎与 Gemini Enterprise Agent Platform 深度绑定，跨平台的 agent 治理还没有标准答案，VPC Service Controls 支持同样是 Preview。治理层会不会随着与网络边界的集成变成 agent 部署的标准组件，还是留在单一平台内部，是接下来值得跟踪的方向。

## 参考文献
- Semantic governance policies overview - Google Cloud Documentation: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/policies/semantic-governance-overview
- Best practices for using Semantic governance policies: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/policies/best-practices
- Configure semantic governance policies: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/policies/configure-semantic-governance
- Give Your AI Agent a Security Policy in Plain English with Semantic Governance (Google Cloud Medium): https://medium.com/google-cloud/give-your-ai-agent-a-security-policy-in-plain-english-with-semantic-governance-872718e6325a
- Gemini at Work 2026: Introducing Gemini agent (Google Cloud Blog): https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026
- Google's Semantic Governance Paper Solves a Major Agent Security Problem (The Interop): https://jessealton.com/blog/googles-semantic-governance-paper-solves-the-agent-security-problem-nobody-wants-to-talk-about

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
