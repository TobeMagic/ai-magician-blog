---
title: "用AI拒批老人看病？美国这个试点项目的激励机制出了大问题"
date: "2026-09-26 11:00:02"
updated: "2026-09-26 11:12:09"
permalink: "posts/2026/09/26/用ai拒批老人看病美国这个试点项目的激励机制出了大问题/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/26/用ai拒批老人看病美国这个试点项目的激励机制出了大问题/"
article_id: "9cead86c-d1d2-459f-9a3e-aed69313fbc4"
description: "特朗普政府于2026年1月启动WISeR试点，允许AI对Medicare传统保险的部分门诊手术进行预授权审批，覆盖6个州。问题核心在于激励结构：第三方供应商按拒批金额的比例获得报酬，从机制上制造了「少花钱就是好服务」的悖论。早期数据已显示不当拒批和患者延误，医保权利中心等组织呼吁立即终止该项目。"
cover: "/var/lib/aimagician/artifacts/covers/9cead86c-d1d2-459f-9a3e-aed69313fbc4/c551e2b3-2aa5-490b-8421-daca21a369db/cover.png"
imgTop: false
---

Trump 政府 1 月起在六个州试点 WISeR 项目，用 AI 对部分 Medicare 服务的预授权进行审批或拒批。

## WISeR项目是什么：Medicare首次引入AI预授权的背景与机制

### 业务目标：减少Medicare欺诈、浪费和滥用

Medicare作为美国联邦医疗保险计划，覆盖65岁以上老人及特定残障人士，每年支出超过8000亿美元。在这笔巨额资金中，CMS（Centers for Medicare & Medicaid Services）长期面临欺诈、浪费和滥用的压力。WISeR的全称是 Wasteful and Inappropriate Service Reduction——名字本身就暴露了它的设计意图：通过技术手段减少所谓"浪费性"支出。

CMS Innovation Center认为，某些门诊服务（如神经刺激器植入、硬膜外类固醇注射、膝关节镜手术等）存在较高的欺诈风险，传统的按服务付费模式缺乏有效的前置审核机制。引入AI驱动的前置授权，被视为一种新的治理工具。

问题在于，这个判断隐含了一个未经充分验证的假设：AI能够在保证患者安全的前提下，准确区分"必要"与"不必要"的医疗服务。早期证据正对这个假设提出挑战。

### WISeR项目的核心设计：AI审批+供应商按拒批比例计费

WISeR的基本流程是：医生为患者申请某项门诊手术的预授权→AI系统根据病历记录和临床指南进行评估→AI生成审批或拒批建议→由"合格的人类临床医生"复核拒批决定→最终决定传达给医疗机构。

表面看，有人类复核这道关卡，似乎足够谨慎。但设计的关键漏洞在于报酬机制：第三方供应商从"被拒批节省下来的医保支出"中提取一定比例作为佣金。你买的旗舰款，瞬间变成平替套餐。这意味着，拒批越多、金额越大，供应商赚得越多。更狠的是，这套机制与Medicare传统保险六十年来的沉默选择形成了鲜明对比。

Medicare传统保险六十年来没有大规模引入预授权，不是忘了这项工具，而是知道它的代价。历史经验告诉我们，预授权带来的行政摩擦成本往往超过它能省下的钱，而且它对患者体验的负面影响是被反复验证过的——近70%的美国人认为预授权是获取医疗的负担。商业保险公司如UnitedHealthcare最近已经在缩减预授权的使用范围。而WISeR，恰恰是在Medicare传统保险从未使用这项工具的领域，强行引入了一个激励机制与患者利益直接冲突的版本。

``mermaid


![WISeR项目激励结构](https://iili.io/nRsHVf4.png)
> WISeR项目激励结构



### 6个试点州的落地情况与时间线

WISeR于2026年1月正式在六个州启动试点：华盛顿、俄亥俄、新泽西、俄克拉荷马、德克萨斯和亚利桑那。项目计划运行至2031年底，为期六年。覆盖的医疗服务大约十几个，主要集中在影像引导介入、植入设备和某些骨科手术。

从政策节奏看，这是一个典型的"先试点再推广"路径。但如果试点本身的基础激励机制存在结构性缺陷，提前终止比延期运行更合理——这也是医保权利中心（Medicare Rights Center）等组织呼吁立即终止的核心论据：不是要关闭试点，而是试点正在伤害已经处于脆弱状态的老年患者群体。



![程序员 reaction：BloatedUl,forcedlogin](https://iili.io/CC5upyv.png)
> ##WISeR项目是什么：Med



## 三种审批架构的设计对比

### 方案 A：传统人工审批——Medicare 历史做法

传统 Medicare 的核心逻辑是「医生决定，Medicare 买单」。预授权在过去六十年里，基本只出现在高度特化的场景：高值植入物、放射治疗、部分住院服务。这些场景之所以被单独拎出来做人工审核，是因为单笔金额大、滥用风险高、且审核人力成本可控。

人工审核的标准流程是：医生提交申请，保险公司或第三方机构派一名具备同等资质的临床医生对照临床指南逐条核对。通过的概率在正常临床指征下通常超过 90%。不通过的理由会被明确列示，医生可以补充材料后二次申请。

这套机制的代价是明显的。KFF 2025 年的调研显示，平均每次预授权申请的处理时间在 3 到 7 个工作日之间，对于择期手术而言，这个等待期可能直接转化为病情进展的风险。近 70% 的美国人对预授权制度本身表达不满，商业保险公司如 UnitedHealthcare 近年已经在收缩预授权的使用范围。Medicare 传统保险部分没有大规模引入，不是不知道这套工具，而是知道引入之后行政成本会吃掉那部分省下来的钱。

### 方案 B：纯 AI 自动审批——WISeR 当前模式

WISeR 的设计试图把这个流程全自动化。第三方供应商负责部署 AI 系统，处理来自医生的预授权请求。系统会根据训练数据中的临床指南、历史索赔模式和费用分布，在几分钟内给出「批准」或「建议拒批」的判断。

关键点在于报酬结构。根据 CMS 公布的合同框架，供应商的报酬按「避免支出的百分比」计算。也就是说，供应商拿走的费用与它成功拒批的金额挂钩。这笔账算得很直白：拒批一个 5 万美元的神经刺激器植入，供应商能拿到数万美金的分成；批准一个本该做的膝关节镜手术，供应商一分钱也拿不到。



![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 当算法的 KPI 是拒批，模型就会拼命拒批



这不是对 AI 准确性的信任问题，而是激励结构的根本错配。即使 AI 的判断在统计意义上与人类专家一致，系统也会天然倾向于多做拒批、少做批准。因为每一次拒批都在增加供应商的财务报表，每一次批准都在减少供应商的收入。

### 方案 C：人机混合审批——CMS 声称的「合规防线」

CMS 在公开文档中反复强调一条防线：所有 AI 建议的拒批都必须经过一名「合格临床医生」的独立复核。这条设计在纸面上看起来很完整。

但问题在于，复核医生是否真的独立。

EFF 2026 年 9 月的调研引用了多份内部文件，显示 AI 生成的拒批建议在实际操作中影响人类决策的概率极高。原因在于信息不对称：AI 系统会在几秒钟内给出一个看起来权威的结构化判断，附带引用条款和案例编号；而人类复核医生平均只有几十秒的时间做审查。在这种情况下，「独立复核」很容易退化为形式上的签字。

更复杂的现实是：部分供应商的合同里也包含了按通过率的隐性考核指标。如果复核医生频繁推翻 AI 的判断，供应商可能会以「系统误报率过高」为由要求合同重新评估。这使得「独立」在实践中变成一个相对概念。

### 技术选型决策表：效率 vs 准确性 vs 激励兼容性



![审批架构选型](https://iili.io/nRsHg0Q.png)
> 审批架构选型



决策表的核心结论是：方案 A 的确定性最高，方案 B 的效率最高但激励最差，方案 C 试图取两者之长却产生了复合的激励冲突。在 Medicare 预授权这个场景里，激励兼容性是比准确性更优先的约束条件。因为一个激励错配的精确系统，比一个慢但激励正确的系统危害更大。

Medicare 传统保险六十年没有大规模预授权，不是忘了这项工具，而是知道它的代价。当算法的报酬取决于它拒绝了多少次批准，问题就不只是算法准不准，而是系统设计本身出了什么问题。

## 激励结构为何是致命缺陷

### 拒批即收入：供应商的财务动机与患者利益的根本冲突

WISeR 项目最核心的问题不是技术能力，而是激励机制本身。根据 NEA 公开的信函和 CMS 的合同条款，第三方供应商的报酬基于「避免的支出」比例计算——也就是说，供应商拒批的金额越高，获得的收入越多。

这种设计创造了一个直接的利益冲突。供应商的经济激励是「少批准」而非「准确判断」。当一个系统的报酬取决于它拒绝了多少次批准，问题就不只是算法准不准，而是系统设计本身出了什么问题。

mermaid


![WISeR 激励链条](https://iili.io/nRsHm1R.png)
> WISeR 激励链条


### AI黑箱与人类审查的形式化

EFF 和 Medicare Rights Center 获取的内部文件揭示了一个更深层的问题。虽然 CMS 声称所有 AI 拒批都会经过合格临床医生的复核，但实际运作中，人类审查往往只是对算法结论的形式化确认。

Medicare Rights Center 在 2026 年 9 月的声明中明确指出：「依赖未经充分验证的 AI 技术、扰乱受益人知情决策、并为拒批医疗服务创造结构性财务激励的系统，不应被信任于人们的健康与福祉。」

这种「算法建议+人工背书」的模式在实践中形成了责任模糊地带。医生可以声称自己只是遵循了算法的专业判断，而算法本身又缺乏可解释性和可审计性。

### 不当拒批的早期数据

项目运行仅数月，医疗提供者已开始报告不当拒批和行政摩擦。Ars Technica 引用的早期数据显示，部分服务类型的拒批率异常偏高，等待时间显著延长。

更具体的预警指标包括：

- 神经刺激器等植入设备的拒批率远超历史基准
- 硬膜外注射等门诊手术的审批延迟导致患者疼痛加剧
- 小诊所和低收入资源机构面临额外的行政负担

这些信号与商业保险领域观察到的模式一致。国会研究服务处 2025 年的报告指出，UnitedHealthcare、CVS 和 Humana 在增加 AI 使用后，Medicare Advantage 计划的拒批率显著上升。

mermaid


![早期预警指标](https://iili.io/nRsJqBf.png)
> 早期预警指标


这些早期数据足以构成终止项目的理由。一个试点项目在设计阶段就存在激励错位，在运行初期就出现系统性偏差，继续推进的成本将远超过任何可能的效率收益。

---

> 来源：NEA 公开信函（source 3）、EFF 深度报道（source 6）、Medicare Rights Center 声明（source 2）、Ars Technica 报道（source 5）



![程序员 reaction：Canyoubeautifymyexed](https://iili.io/Cgk7AjS.png)
> 系统设计不能只看技术能不能跑



## 工程边界：AI预授权系统的适用条件与失效场景

### 适用边界分析：什么类型决策适合AI辅助

AI 在医疗决策中的适用边界，取决于两个维度：决策的可结构化程度，和错误成本的可接受性。

可结构化程度高，意味着输入特征明确、输出规则可枚举。例如某些影像筛查——CT 肺结节识别、糖尿病视网膜病变初筛——这类任务有清晰的标签定义，且历史数据充足，模型可以在特定边界内达到甚至超过人类水平。错误成本也相对可控：假阳性导致复查，假阴性在严格风控下可以被人工复核拦截。

但 WISeR 涉及的预授权决策，是两个维度都踩雷的类型。输入端，医疗必要性判断依赖非结构化临床文档——病程记录、检验趋势、主治医师备注，这些文本的语义上下文比结构化字段更难捕捉。输出端，错误成本不可接受：一次不当拒批可能延误手术窗口，造成不可逆的健康损害。

业内常见的做法是将 AI 定位为辅助工具，而非决策主体。模型输出建议，人类做最终判断；或者模型只处理结构化程度高的子任务，如编码匹配、病历完整性校验。

把 AI 放在审批链条的决策节点上，而不是支持节点上，是一个架构选择，不是技术必然。

### WISeR越界的环节：激励错配与技术不确定性叠加

WISeR 的设计问题，不在技术层面，而在激励层面。

供应商按拒批金额的比例获得报酬。更准确地说，是按「避免的支出」（averted expenditures）收费——拒批一笔 5000 美元的手术，供应商从节省的这笔钱里分一杯羹。这个激励结构创造了一个清晰的 perverse incentive：少花钱就是好服务，拒批越多业绩越好。



![程序员反应图：我可能是个假程序员](https://iili.io/CgOpTut.png)
> 按拒批金额拿提成，激励机制本身就在鼓励拒绝



CMS 的回应是，所有 AI 拒批都经过人类医生复核。这听起来像一道安全门，但机制设计上存在一个关键漏洞：AI 给出的拒批建议，会显著影响人类审查者的判断。行为经济学里的「锚定效应」在这里发挥作用——当人类医生面对一个由算法生成的、带有量化理由的拒批建议时，推翻它的心理成本远高于顺从。

EFF 的分析指出，WISeR 供应商使用的 AI 系统细节几乎不透明，外界无从评估其训练数据的代表性和决策逻辑的可解释性。

技术不确定性加上激励错配，构成了一个双重重灾区：算法可能在错误地拒绝，而系统的设计又在鼓励这种错误。

### 从WISeR学到的架构教训：系统设计不能只考虑技术可行性

``mermaid


![WISeR架构的风险放大链路](https://iili.io/nRsJeYN.png)
> WISeR架构的风险放大链路


WISeR 暴露了一个在技术项目中常见、但在公共政策中代价更高的错误：把技术问题当作工程问题来解，忽略了激励结构对系统行为的决定性影响。

Medicare 传统保险六十年没有大规模预授权，不是忘了这项工具，而是知道它的代价。预授权在商业保险中已有广泛应用， denial rates 在 UnitedHealthcare、CVS、Humana 等 MA 计划中因 AI 使用而显著上升。传统 Medicare 对这项工具的谨慎态度，是对历史经验的吸收。

把 AI 引入预授权，技术上可行。把按拒批计费的激励机制嵌入其中，是另一个维度的设计选择。前者可以被验证和优化，后者直接扭曲了系统的目标函数。



![程序员 reaction：status 418  status 418 5knj](https://iili.io/CCG58Xt.png)
> 激励结构错了，技术越先进离目标越远



## 落点：当算法的报酬取决于它拒绝了多少次批准

问题不只是算法准不准，而是系统设计本身出了什么问题。

Medicare Rights Center 在 2026 年 9 月的公开声明中明确表示：「依赖未经充分验证的 AI 技术、干扰受益人知情决策、并为拒批医疗服务创造结构性财务激励的系统，不应被信任去掌控人们的健康。」

这是一个工程判断，不是政治立场。系统的激励结构决定了行为方向，当算法的报酬取决于它拒绝了多少次批准，这个设计本身就是不可接受的。

解决方案不需要等待技术成熟。如果预授权确实有必要，采用固定费用而非按拒批计费的模式，可以消除激励错配。如果目标是减少浪费，应该从源头设计——比如改进临床指南的清晰度、加强医师教育，而不是通过经济激励制造系统性拒批。

技术可以辅助决策，但不应该被设计成以拒绝为目标的系统。前者是工具，后者是陷阱。

## 开篇：当算法的目标函数和病人利益反向

WISeR 的全称是 Wasteful and Inappropriate Service Reduction，目标是减少 Medicare 欺诈、浪费和滥用。听起来合理。问题出在执行方式。

CMS 将 WISeR 外包给第三方供应商，供应商按拒批金额的比例获得报酬。这意味着算法的激励函数是「拒批越多，收入越高」。这不是算法偏差问题，这是系统设计问题。

更准确地说，这是一个典型的 principal-agent problem——Medicare 作为委托人想要控制成本的同时保证医疗质量，但代理人（供应商）的收入结构只与前者挂钩。利益不一致时，理性代理人会选择最大化自己收入的方向。

Medicare 传统保险六十年没有大规模预授权，不是忘了这项工具，而是知道它的代价。商业保险机构如 UnitedHealthcare 近年也在缩减预授权使用——近 70% 的美国人将其视为就医负担。

## 结语：当算法成为成本控制的工具，谁在为此买单

WISeR 项目的核心教训是：当算法的报酬取决于它拒绝了多少次批准，问题就不只是算法准不准，而是系统设计本身出了什么问题。

Medicare 传统保险六十年没有大规模预授权，不是忘了这项工具，而是知道它的代价。六十年后，同样的代价被重新包装成「技术创新」，但激励结构和十年前没有本质区别。

从工程角度看，这个项目的架构有三个致命缺陷：

第一，激励与目标背反。供应商按拒批金额分成，这是制度化的利益冲突。

第二，复核机制被俘获。人类临床医生理论上可以推翻 AI 决策，但在时间压力和信息不对称下，他们往往会跟随算法建议。

第三，技术不确定性被低估。AI 模型在训练数据分布外的决策质量未知，而医疗决策不允许这种不确定性。


![WISeR 架构缺陷图谱](https://iili.io/nRsdH6x.png)
> WISeR 架构缺陷图谱


医保权利中心呼吁立即终止 WISeR，理由是「依赖未经充分验证的 AI 技术、破坏受益人知情决策、制造结构性拒保激励的系统，不应被信任掌握人们的健康」。NEA 也发文要求终止该项目。

**取舍结论**：在激励结构与患者利益对齐、模型可解释且可审计、人类复核真正独立这三个条件满足之前，不应将 AI 预授权扩展到传统 Medicare 的核心服务。超出这个范围，任何效率提升的账面数字都以患者风险和系统信任为代价。

**下一步**：国会正在推进立法终止 WISeR（Murray-Wyden-Gillibrand 提案），目前参议院共和党阻挠。关注立法进展，同时监督 CMS 的透明度义务——模型名称、训练数据、准确率指标应当公开。

---

## 参考文献
- [New Records Show Medicare WISeR AI Prior Authorization Model Causing Inappropriate Denials of Care - Medicare Rights Center](https://www.medicarerights.org/medicare-watch/2026/09/24/new-records-show-medicare-wiser-ai-prior-authorization-model-causing-inappropriate-denials-of-care)
- [AI Will Soon Have a Say in Approving or Denying Medicare Treatments - KFF Health News](https://kffhealthnews.org/aging/ai-medicare-prior-authorization-trump-pilot-program-wiser)
- [New Records Reveal Problems with Medicare's AI Prior Authorization Experiment - EFF](https://www.eff.org/deeplinks/2026/09/new-records-reveal-problems-medicares-ai-prior-authorization-experiment)
- [AI-Driven Pilot Program Delays Access to Care for Americans - Think Global Health](https://www.thinkglobalhealth.org/article/ai-driven-pilot-program-delays-access-to-care-for-americans)
- [Medicare advantage becoming a disadvantage with use of artificial intelligence in prior authorization review - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12979811)
1. [New Records Show Medicare WISeR AI Prior Authorization Model Causing Inappropriate Denials of Care](https://www.medicarerights.org/medicare-watch/2026/09/24/new-records-show-medicare-wiser-ai-prior-authorization-model-causing-inappropriate-denials-of-care) - Medicare Rights Center, 2026-09-24
2. [End the Disastrous WISeR Program](https://www.nea.org/advocating-for-change/action-center/letters-testimony/end-disastrous-wiser-program) - NEA, 2026
3. [Trump admin using AI to deny medical care for seniors in disastrous experiment](https://arstechnica.com/health/2026/09/trump-admin-using-ai-to-deney-medical-care-for-seniors-in-disastrous-experiment) - Ars Technica, 2026-09
4. [New Records Reveal Problems with Medicare's AI Prior ...](https://www.eff.org/deeplinks/2026/09/new-records-reveal-problems-medicares-ai-prior-authorization-experiment) - EFF, 2026-09
5. [Murray, Wyden, Gillibrand Lead Democrats in New Bill to Halt Trump Administration's Looming Medicare AI Prior Authorization Takeover](https://www.murray.senate.gov/murray-wyden-gillibrand-lead-democrats-in-new-bill-to-halt-trump-administrations-looming-medicare-ai-prior-authorization-takeover) - Senator Patty Murray, 2026
6. [AI Will Soon Have a Say in Approving or Denying Medicare Treatments](https://kffhealthnews.org/aging/ai-medicare-prior-authorization-trump-pilot-program-wiser) - KFF Health News, 2026
7. [Medicare advantage becoming a disadvantage with use of artificial intelligence in prior authorization review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12979811/) - PMC, 2025
8. [Early Reports on WISeR Model Are Troubling](https://medicareadvocacy.org/early-reports-on-wiser-model-are-troubling) - Medicare Advocacy, 2026
9. [AI-Driven Pilot Program Delays Access to Care for Americans](https://www.thinkglobalhealth.org/article/ai-driven-pilot-program-delays-access-to-care-for-americans) - Think Global Health, 2026

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
