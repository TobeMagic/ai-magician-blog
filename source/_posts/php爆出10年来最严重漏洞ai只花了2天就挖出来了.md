---
title: "PHP爆出10年来最严重漏洞，AI只花了2天就挖出来了"
date: "2026-10-22 11:00:02"
updated: "2026-10-22 11:09:54"
permalink: "posts/2026/10/22/php爆出10年来最严重漏洞ai只花了2天就挖出来了/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/22/php爆出10年来最严重漏洞ai只花了2天就挖出来了/"
article_id: "4b44ad0e-71f4-47a9-b916-68b04a70dbad"
description: "Wiz Research用Gemini 4 Argon和GPT-5.6 Sol辅助，两天挖出PHP核心层两个CVSS 9.2的RCE漏洞（CVE-2026-109618、CVE-2026-109619），影响全球约70%网站。漏洞信息提前泄露迫使PHP官方将补丁发布时间提前，多国政府网站预防性下线。传统人工审计周期以月计，AI辅助下压缩至两天，安全研究范式正在发生结构性迁移。"
cover: "/var/lib/aimagician/artifacts/covers/4b44ad0e-71f4-47a9-b916-68b04a70dbad/fe36d133-9642-47fa-b892-750004b5f950/cover.png"
imgTop: false
---

Wiz Research 披露 PHP 核心中的多个内存安全漏洞（CVE-2026-109618/CVE-2026-109619，CVSS 最高 9.2），实现…



![被追着问 BUG 修完了吗时的程序员表情](https://iili.io/noCi27n.png)
> 当所有依赖这条供应链的服务都在告警



## 业务目标：PHP核心层的RCE防护

### PHP在全球网站基础设施中的位置与风险敞口

PHP 支撑着约 70% 的活跃网站——这个数字在过去十年中几乎没有变化。WordPress、Drupal、Joomla、Magento 以及众多政府和企业内部系统都构建在 PHP 之上。更关键的是，PHP 还大量运行在高并发的电商、金融和政务场景中。

PHP 核心层的安全缺陷不是「某个应用的 bug」，而是整个基础设施的信任根出了问题。Volker Dusch，PHP Foundation 的安全工程师，向《华尔街日报》明确表示：「这是 PHP 十多年来最严重的问题。」

### 本次漏洞的影响范围与严重性评估

CVE-2026-109618 和 CVE-2026-109619 均被评定为 CVSS v4.0 9.2 分（Critical）。两者的共同点是：无需认证、可远程触发、能实现任意代码执行。

CVE-2026-109618 在内存耗尽（OOM）中断场景下产生——当 PHP 处理大文件上传时，堆内存分配失败会导致请求内部数据结构处于未初始化状态。CVE-2026-109619 则在致命错误路径下利用全局状态的残留，使攻击者能够劫持执行流。

更严重的是内存泄露问题。Sansec 的分析指出，即使应用程序从未调用 `session_start()`，恶意请求也能读取同一进程内的其他会话令牌、API 密钥甚至 TLS 私钥。这使攻击路径从单纯的 RCE 扩展为「RCE + 被动凭证窃取」的双重威胁。

Wiz Research 展示的 PoC 工具 PHP2Shell 声称兼容 PHP 5.4.0 及以上所有版本。全球约 60% 的对外 PHP 服务器因版本过旧已终止支持。



![程序员系列表情：异常分析](https://iili.io/nOLjR94.png)
> 当所有PHP站的运维都在同一时刻收到警报





![正文图解 1](https://iili.io/nOLwYdJ.png)
> 正文图解 1


Magento / 政府网站 / 企业内部系统]
    Core[PHP 核心层
memory handling 缺陷]
    Attack1[攻击向量 1
OOM 中断 + UAF]
    Attack2[攻击向量 2
致命错误路径 + 状态残留]
    Impact[影响结果
RCE + 内存泄露
无需认证的远程执行]
    Sub --> Core
    Core --> Attack1
    Core --> Attack2
    Attack1 --> Impact
    Attack2 --> Impact
    Impact --> Compromise[服务器完全接管
敏感数据外泄]
漏洞之所以能够在核心层潜伏多年，根本原因在于 PHP 的内存管理模型。PHP 使用自定义的堆分配器 zalloc，在请求生命周期内复用内存块。当 OOM 导致内存块提前释放但引用未清零时，后续请求会读到上一请求的残留数据——这是一种典型的 Use-After-Free 类问题，但在 PHP 的 SAPI 层中被 FPM 并发模型放大，传统静态分析工具难以追踪。


![程序员 reaction：柯南00068 哼](https://iili.io/nOeBaDX.png)
> ##业务目标：PHP核心层的RCE





![群里聊得热闹但自己得继续搬砖时的表情](https://iili.io/Cuzcmk7.png)
> ##业务目标：PHP核心层的RC



## 方案A：传统人工审计路径

### 历史PHP重大漏洞的发现周期与人力投入

PHP 历史上严重漏洞的发现，通常依赖安全研究员的长期跟踪或厂商内部的代码审查。以 CVE-2018-12889 为例，该漏洞在 PHP 7.x 分支中存在多年，最终由外部研究者通过系统性代码审计发现，整个过程耗时数月。

传统的安全审计工作流包括三个阶段：源码浏览、手动路径追踪、PoC 编写验证。以 PHP 引擎的 Zval 内存管理模块为例，研究员需要理解其引用计数机制、复制语义以及复合类型的处理逻辑，才能定位到潜在的错误路径。

PHP 7.4 版本的漏洞修复记录显示，单个严重漏洞的平均修复周期为 3–6 周。据 PHP 官方安全日志统计，2015–2020 年间披露的 47 个关键漏洞中，有 40% 的发现时间超过一年。

### 传统 fuzzing 与代码审计的瓶颈

传统 fuzzing 的核心假设是：输入空间的随机采样能够覆盖到边界条件的异常路径。对于 PHP 这种具有动态类型系统的语言，这个假设面临两个结构性障碍。

其一，PHP 的内部请求生命周期涉及多阶段的状态机转换。session.upload_progress、GC 清理、内存重分配等操作的执行顺序依赖运行时上下文，单纯基于 HTTP 输入的模糊测试难以触达深层的内部状态组合。

其二，内存安全漏洞的触发通常需要特定的执行路径组合。CVE-2026-109618 的核心机制是在 OOM 中断后，请求内部数据结构仅部分初始化。当 cleanup 例程读取未初始化的堆内存时，会基于垃圾数据做出错误的分支判断。这种「条件叠加」型漏洞，传统的单点 fuzzing 几乎不可能覆盖。

> 坦白讲，用随机输入去撞 PHP 内存管理的边界，命中率比中彩票高不了多少。

fuzzing 框架如 AFL++、libFuzzer 在 C/C++ 项目上积累了大量成功案例，但在 PHP 这种解释型语言的应用层效果有限。PHP 引擎本身的模糊测试覆盖率长期停留在 60% 左右。

### 为什么这次漏洞在传统流程下可能被延迟发现

CVE-2026-109618 和 CVE-2026-109619 的共同特征，使得它们在传统审计流程下容易被忽略。

首先，两个漏洞的触发条件都依赖于「异常路径 + 未初始化内存」的组合。只有 OOM 中断、致命错误等异常分支下，才会暴露出对未初始化字段的读取行为。

其次，漏洞的利用需要构造特定的请求上下文。攻击者需要通过 session.upload_progress 模块触发内存重分配，同时精确控制请求的执行时序。

最后，PHP 5.4+ 的向后兼容性设计留下了历史包袱。早期版本的 session 处理逻辑在后续迭代中被不断重构，但部分边界行为被保留，这些「活化石」代码很少成为安全审查的焦点。



![源码浏览](https://iili.io/nOLwOml.png)
> 源码浏览




![程序员 reaction：我招谁惹谁了](https://iili.io/nOezFu2.png)
> ##方案A：传统人工审计路径##





![程序员 reaction：给个眼神自己体会](https://iili.io/CmcnXON.png)
> ##方案A：传统人工审计路径##



## 方案B：AI辅助安全研究路径

### Wiz Research如何使用Gemini 4 Argon和GPT-5.6 Sol定位漏洞

Wiz Research 的研究者 sagitz 在 X 上留下的记录是一句话：「研究始于一个针对 PHP 函数安全缺陷的提示词。」

具体路径是从 popular codebase 的可访问函数出发，让模型列出可能被外部数据触发的内部处理链。Gemini 4 Argon 负责源码级分析——追踪参数如何从 zval 结构流入内存分配逻辑；GPT-5.6 Sol 负责行为推断——判断某个代码路径在何种输入条件下会触发异常状态转换。

两者是串行接力：Gemini 4 Argon 产出的可疑调用栈经过 Sol 的行为建模后，研究者再用 Sol 生成验证用的 PoC 代码。三次迭代后，两个独立漏洞各自有了可复现的攻击链。

> 「As expected in 2026, AI did most of the work here.」——sagitz, Wiz Research

### AI在源码分析、行为推断与PoC生成中的角色分工

传统审计的三个关键环节——代码扫描、逻辑推理、漏洞验证——这次被切割成三个不同层次的任务。

源码扫描是体力活。PHP 核心的 C 代码跨越数十年累积，函数调用链错综复杂。Gemini 4 Argon 的任务是把「某个函数是否被公开接口调用」这个问题从数天压缩到数小时。

行为推断是判断力活。发现可疑代码路径后，需要判断：这个条件分支在正常请求下能否到达？这部分 GPT-5.6 Sol 发挥了更明显的优势——它能把离散的代码片段组合成完整的攻击场景描述。

PoC 生成是工程活。Sol 在这个环节的作用类似一个「能写出正确 C 语法的实习生」——它不会发明不存在的机制，但能把已知的内存操作组合成可执行的请求体。



![「从热门代码库入口追踪PHP函数调用链」](https://iili.io/nOLwsmQ.png)
> 「从热门代码库入口追踪PHP函数调用链」


### 发现周期从数月压缩至两天的机制解析

传统漏洞研究的瓶颈不在算力，而在信息检索成本。PHP 核心代码超过百万行，手动建立调用图需要大量时间沉淀。

AI 模型的介入改变的是第一阶段的搜索效率。给定「session.upload_progress」这个模块名，Gemini 4 Argon 可以在数小时内定位到所有可能触发的代码分支。人类研究者原本需要一周完成的信息收集，现在集中在几个小时的对话窗口里。

第二阶段是假设验证。传统流程需要研究者手工构造测试用例、运行 debug 版本。AI 辅助下，研究者可以直接让模型根据可疑路径生成测试脚本。两天时间足够完成三轮迭代：定位→验证→修正。

更关键的变化发生在协作层面。OpenAI、Calif、Quarkslab 在补丁验证阶段形成了分布式验证网络。补丁提交后，多个团队并行测试不同输入条件，发现边缘 case 的时间从数天缩短到数小时。



![程序员 reaction：柯南00028 我醉了](https://iili.io/CtTaOe2.png)
> ##方案B：AI辅助安全研究路径





![程序员 reaction：你确定这是真的吗？](https://iili.io/CAQh0N9.png)
> ##方案B：AI辅助安全研究路径



## 方案C：混合防线与防御实践

### 补丁生效前的临时防护策略

Cloudflare CTO Dane Knecht 在漏洞外泄后迅速部署了 WAF 规则，并明确标注这是「临时应急措施」。这句话的含义是：规则覆盖已知攻击向量，但不等于修复漏洞本身。

对于运行 WordPress、Drupal、Joomla 或 Magento 的站点，防护优先级是：确认 PHP 版本是否在被支持范围内、检查是否启用了 session.upload_progress 功能、在补丁可用前禁用文件上传进度报告或限制上传接口。

mod_php 配置的风险最高。Apache 通过 mod_php 执行 PHP 时，所有请求都经过同一进程。相比之下，PHP-FPM 通过 FastCGI 协议隔离，每个请求由独立 worker 处理，缓解效果更明显。

检测规则方面，Elastic 和 Corelight 都在补丁发布前提前输出了 Suricata 和 Zeek 规则。这类规则的覆盖窗口通常很短——一旦攻击者调整 payload 结构，规则就会失效。

### 检测规则与补丁协同机制

补丁发布当天，全球自动化扫描开始执行。Sansec 估算「补丁上线后 15 分钟内会出现大规模攻击」。

防御体系的关键不在于检测到攻击本身，而在于区分「正常流量」与「利用尝试」。正确的检测策略应该从「这个请求是否合法」转向「这个请求是否携带了不应该出现在 session 处理路径上的数据结构」。

WAF 规则可以拦截已知的特征模式，但面对未知变体无能为力。这也是为什么多方验证补丁有效性是必要的。



![正文图解 4](https://iili.io/nOLNJkv.png)
> 正文图解 4


### 长期治理：谁来为PHP核心层埋单

PHP 由 PHP Foundation 这个非营利组织维护，核心开发团队规模有限。这次事件中，从研究者发现漏洞到补丁发布，官方用了约两个月时间。

更大的问题是：谁该为 PHP 核心层的持续安全投资负责？全球约 70% 的网站运行在 PHP 之上，但 WordPress、Drupal、Magento 等生态与 PHP Foundation 之间的资金流动并不透明。

sagitz 的总结「AI did most of the work here」背后，是一个更值得追问的问题：如果 AI 能在两天内完成传统审计需要数月的工作，那么传统审计模式的经济价值在哪里？答案不在速度本身，而在知识积累。传统研究者花数月建立的代码库理解、历史漏洞模式、边界 case 清单，是 AI 无法自动继承的隐性知识。



![搬砖系列表情：今天工地好热，砖头烫手](https://iili.io/CUblf72.png)
> ##方案C：混合防线与防御实践#





![程序员 reaction：特朗普00019 哇哦](https://iili.io/CrquKla.png)
> ##方案C：混合防线与防御实践#



## 选型决策与执行建议

### 决策矩阵：传统审计、AI辅助、混合防御如何组合

三种路径不是互斥的，而是适用于不同阶段。

在漏洞发现阶段，AI 辅助的成本远低于传统审计。给定明确的切入点，模型可以在数小时内完成人工数周的信息收集。但模型的输出需要人类验证——幻觉和误报率依然存在。

在漏洞验证阶段，传统人工审计仍有不可替代的价值。AI 生成的 PoC 可能覆盖主路径，但边缘 case、并发条件需要人类研究者结合代码上下文做出判断。

在防御部署阶段，混合策略最为稳健。WAF 规则提供即时缓解，补丁验证确保修复有效，持续监控捕获异常行为。

### 可落地的三步行动清单

今天可以做的事：

1. 检查所有生产环境的 PHP 版本。登录服务器执行 `php -v`，记录版本号和编译选项。未受支持版本应立即制定升级计划。

2. 确认 session.upload_progress 配置。在 php.ini 中搜索 `session.upload_progress.enabled`，如需临时缓解可将此值设为 Off，但这会影响正常的上传进度显示功能。

3. 部署基于特征的临时检测规则。参考 Elastic 和 Corelight 发布的 Suricata/Zeek 规则，在流量层增加监控覆盖。

下周可以做的事：评估第三方安全产品是否已集成针对 CVE-2026-109618 和 CVE-2026-109619 的检测能力、联系托管服务商确认底层 PHP 版本的更新计划。

### 边界：AI挖洞不是银弹

需要明确 AI 辅助安全研究的局限：

第一，AI 的发现能力依赖提示词质量。给错了起点，模型可能花同样时间找到无关问题。

第二，AI 无法替代对代码历史演变的理解。PHP 核心中存在一些看似不合理但历史遗留的设计决策。

第三，AI 生成的 PoC 不一定覆盖所有触发条件。模型倾向于生成最直接的攻击路径。

> 你买的旗舰款，瞬间变成平替套餐。

当 AI 能完成传统审计 80% 的工作时，剩下的 20% 才是真正需要人类智慧的地方。



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> ##选型决策与执行建议###决策



## 选型决策：AI辅助安全研究的适用边界

AI 在这类漏洞发现中的价值，取决于一个具体的工程条件：攻击链的复杂度是否超过了单一工程师在合理时间内的推演上限。

PHP2Shell 的两个漏洞属于同一类问题：内存管理错误导致的 use-after-free。但证明它们可以被利用，需要构造精确的请求序列，让 OOM 中断在正确的时机发生。这个链条在实际引擎中验证，需要遍历 PHP 内核的多个子系统。

### 何时适合引入AI辅助：复杂度与攻击面的阈值

适合引入 AI 的场景有三个信号。

第一，攻击面覆盖广。PHP2Shell 影响了至少从 5.4 开始的每一个版本，涉及多套 SAPI 和数十个扩展。AI 可以通过并行分析和模式匹配快速收敛。

第二，验证路径长。从发现漏洞到构造稳定 PoC，传统可能需要两周以上的反复调试。AI 可以在几轮对话内生成多个候选 PoC。

第三，知识跨度大。PHP 内核本身已经够复杂，再加上 Zend Engine、libxml、openssl、curl 等多个扩展的交互，单一研究员的知识盲区会显著增加漏报概率。

### 何时仍需人工主导：误报过滤与深层逻辑判断

AI 的局限性同样明确。第一个问题是误报。模型可以生成十个看起来可行的 PoC，其中可能只有两个真正能在目标版本上复现。

第二个问题是漏洞的本体判断。AI 能告诉你某个代码路径「看起来危险」，但不能替代安全工程师判断「这个危险是否构成实际威胁」。

第三个问题是修复方案的合理性。补丁不仅要解决漏洞，还要保证向后兼容。

### 选型决策表：传统 vs AI vs 混合路径的适用场景对照



![人工源码审计](https://iili.io/nOLNDu4.png)
> 人工源码审计


| 已知漏洞类型的深度挖掘 | 传统 + AI 辅助 | 人类经验主导，AI 提速 |
| 大规模代码库的模式扫描 | AI 辅助 + 人工验证 | 覆盖广度优先，精度靠人 |
| 新攻击面的探索性研究 | 混合路径 | 不确定性强，需要快速试错 |
| 漏洞修复方案的合理性评估 | 传统路径为主 | 需要工程经验和架构理解 |

## 架构全景：从漏洞发现到补丁部署的完整链路

PHP2Shell 事件的价值，不只在于发现了两个漏洞。更值得观察的是整个响应链条的压缩效率。



![正文图解 6](https://iili.io/nOLOOVS.png)
> 正文图解 6


PHP Foundation 的反应是「把补丁时间提前」。这不是最优选择，但是现实选择：信息已经泄露，等待只会让攻击者有更充分的时间准备。

Cloudflare 的 CTO Dane Knecht 在补丁发布前就部署了 WAF 规则。他的原话是：「WAF 规则仅是临时应急措施，敦促管理员尽快应用官方补丁。」

## 收尾判断：AI不是替代，是放大器

PHP2Shell 事件给出的判断是明确的：AI 没有替代安全研究员，但它把「有人知道、有人不知道」的差距压缩到了两天。

传统路径下的漏洞发现，往往依赖个别研究员的专注投入和对特定代码库的深度理解。这种模式产出的是高质量结论，但速度和覆盖范围受限于人力。

AI 辅助的路径把「发现」的成本降到了新的量级。Gemini 4 Argon 和 GPT-5.6 Sol 完成了源码分析、行为推断、PoC 生成的工作。但漏洞的验证、补丁的合理性评估、检测规则的制定，仍然需要人类的判断。

sagitz 说「AI did most of the work here」，意思是「AI 承担了研究过程中最耗时、最繁琐的部分」。这不是替代论，这是分工论。

对于企业安全团队而言，这个事件的直接行动建议有三条：第一，立即检查 PHP 版本，所有 PHP 5.4 及以上版本均需升级到最新安全版本。第二，在补丁生效前，使用 Cloudflare、Elastic、Palo Alto 等厂商发布的临时检测规则，重点关注 session.upload_progress 模块的异常请求。第三，重新评估内部安全研究的投入策略。

最终，PHP2Shell 的意义不在两个 CVE，而在它揭示了一个趋势：AI 正在成为安全研究的基础设施。它不替代研究员的判断，但它在研究员做判断之前，已经把「可能性」的范围收窄到了可操作的边界。

## 参考文献
1. Wiz Blog - PHP2Shell: AI uncovers critical RCE vulnerabilities affecting 70% of the Internet. https://www.wiz.io/blog/php2shell-php-rce
2. sagitz on X - PHP2Shell research notes. https://x.com/sagitz_/status/2112901387122332066
3. Elastic Security Labs - php2shell: Assessing detection coverage. https://www.elastic.co/security-labs/threat-command/php2shell-php-rce-detection
4. Corelight - PHP2Shell Zeek and Suricata Detections. https://corelight.com/blog/php2shell-detection-before-disclosure
5. Sansec - Critical PHP RCE: CVE-2026-109618 and CVE-2026-109619. https://sansec.io/research/php2shell
6. PHP Foundation - Emergency security advisory. https://www.php.net/security/

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
