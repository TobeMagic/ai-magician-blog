---
title: "潜伏14年的PHP致命洞，AI跑两天就交卷了"
date: "2026-10-24 10:00:01"
updated: "2026-10-24 10:33:13"
permalink: "posts/2026/10/24/潜伏14年的php致命洞ai跑两天就交卷了/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/10/24/潜伏14年的php致命洞ai跑两天就交卷了/"
article_id: "1dc62e81-cd2c-41e6-b4cc-495fb2266d59"
description: "PHP核心里埋了14年的内存竞态洞，Calif和Wiz各用AI几天独立挖穿。CVSS 9.2，未认证RCE加被动凭证窃取，WordPress、Drupal、MediaWiki全中招。NSA原话：修不了就先下线。真正值得看的不是洞本身，是AI比攻击者先到的那个窗口，到底能撑多久。"
cover: "/var/lib/aimagician/artifacts/covers/1dc62e81-cd2c-41e6-b4cc-495fb2266d59/9b0cbf51-63cd-44f9-8a6e-d2b5bb03156b/cover.png"
imgTop: false
---

8月11日，Calif把一份能跑通的攻击演示甩给PHP安全团队，同一天OpenAI内部也独立报上了同一个洞。

## 14年没人修好的洞，AI两天交了PoC

### 完整时间线：从2024年放弃到2026年8月的两条独立路径

漏洞根子在 PHP 5.4（2012 年发布）的内存管理代码里。处理 multipart 文件上传时，若请求因内存耗尽（OOM）或致命错误中断，PHP 未完整清理内部状态，残留指针指向已释放内存。典型 use-after-free，触发需要精准竞态窗口，常规 fuzzing 扫不出来。这段代码默认开启、深埋底层，被当成基础设施再没人审。

2024 年，一名 PHP 核心开发者在安全审计中看见了 OOM 路径上的异常，但无法构造可复现的利用链，修复搁置。维基百科条目把这步记为「开发团队未能就修复方式达成共识」。

2026 年 6 月，OpenAI 启动 Patch the Planet 计划，资助独立安全研究者用 AI 智能体审计关键开源项目。7 月 30 日，Calif 的 Ryan Austin 领到 PHP 审计任务。8 月 1 日，开审第二天，他找到了第一个可触发的内存耗尽入口。



![程序员 reaction：柯南00027 可疑哦](https://iili.io/CCZvaGs.png)
> 第二天就摸到OOM那根线



8 月 11 日 Calif 向 PHP 安全团队提交 CVE-2026-109618 的 PoC；同一天 OpenAI 内部团队独立报上同一根因。8 月 15 日 PHP 确认 PoC 可跑通。8 月 21 日 Calif 补报第二个漏洞 CVE-2026-109619。

Wiz 的路径晚了八天。8 月 19 日 Wiz 研究团队发现同类缺陷，随后在 Drupal 和 WordPress 测试环境中实现未认证 RCE，8 月 24 日报给 PHP。Wiz 把多条利用路径整合为名为 PHP2Shell 的攻击链，在 WordPress、Drupal、Joomla 上完成验证。10 月 20 日 Hacker News 出现匿名泄露帖，PHP 官方把补丁从原定的周四提前到 21 日 14:00 UTC 紧急发布。



![PHP2Shell 两条独立发现路径](https://iili.io/neZDMNI.png)
> PHP2Shell 两条独立发现路径



### Calif与Wiz各用了什么工具，叙事分歧在哪

工具栈不同，叙事也不同。Calif 全程只用 GPT-5.6 Sol 一个模型，在 Patch the Planet 框架内完成审计。Wiz 用了三件套：自研 Wiz Atlas（自主漏洞研究智能体）、Google DeepMind 的 Gemini 4 Argon、OpenAI 的 GPT-5.6 Sol。Wiz 技术报告里强调，组合不同模型视角让他们在版本适配上比单一模型快得多，PHP 5.4 到 8.5 的行为差异，人类研究员在实验室做这一步通常要数周。

叙事分歧更关键。OpenAI 博客把这件事定义为「Defender's Window」：前沿 AI 比攻击者先到，维护者还有时间修。Wiz 的措辞是「vulnerability exploitation race」，AI 把发现和利用的门槛同时拉低，攻击者端同样受益。watchTowr 在实验室复现后给了 CVSS 4.0 满分 10.0，比 PHP 官方的 9.2 高出一截，分歧核心在于是否把「被动凭证窃取」计入评分，即无需调用 session_start() 即可读取同进程内其他会话令牌、API 密钥、TLS 私钥。

两边说的都对，但紧迫程度完全不同。OpenAI 的框架给维护者喘息空间，Wiz 的框架逼运维团队今天动手。NSA 发布紧急建议时选的是后者的逻辑：修不了就先下线。

## 漏洞机制：OOM竞态为什么正常fuzz扫不到

### PHP 5.4的multipart与session.upload_progress底层代码到底做了什么

洞藏在PHP处理multipart文件上传时的一段内部状态管理里。PHP 5.4起，session.upload_progress默认开启，文件上传请求进来时，引擎在共享内存块中写入一个进度追踪结构。问题出在OOM路径。当堆分配失败（比如恶意构造的超大文件头），请求被强制中止，但进度结构没有被完整回收，指针悬空。下一个请求的GC时序恰好碰到这块残留内存时，触发use-after-free。

正常fuzz器扫不到它，原因有三。触发条件是「大文件上传撞上一瞬间的内存紧张」，不是单一输入能稳定复现的；这段代码位于引擎最底层，fuzz语料通常走不到那个分支；PHP 5.4以来改动极小，安全审计工具把它归为「基础设施」，优先级排得最低。Wiz Atlas、GPT-5.6 Sol和Gemini 4 Argon三个模型交叉审计时，是AI把「这段代码14年没人动过，但OOM清理逻辑不完整」这条线串起来的。



![OOM竞态触发use-after-free](https://iili.io/neZDvHl.png)
> OOM竞态触发use-after-free



### 未认证RCE叠加被动凭证窃取：Sansec指出的第二条攻击面



![程序员反应图：是不是出bug了](https://iili.io/CuzcPXs.png)
> 内存没清干净，隔壁会话的密钥直接漏出来了



Sansec 10月21日的分析指出，CVE-2026-109618的破坏面不止RCE。残留指针指向进程级共享堆，攻击者无需调用session_start()就能读到同进程内其他会话的令牌、API密钥乃至TLS私钥。攻击路径从「打穿一个站点」变成「打穿一个站点，顺手把隔壁用户的凭证也拿走」。W3Techs数据显示约75%可识别语言的网站运行在PHP上。全球约60%的对外PHP服务器版本过旧、已停止支持，补丁根本装不上。

## 被撕开的两个月保密期

### 匿名帖把两周压缩成两天

8月11日到10月21日，这两个月是协调期。PHP维护团队主导修复，Calif、Wiz、OpenAI和Cloudflare在保密状态下提供研究支持、测试环境与防御策略。OpenAI把这段窗口称为「Defender's Window」：前沿AI比攻击者先找到漏洞，维护者有足够时间修好、部署防护、通知下游CMS厂商联动更新。

原计划10月23日周四发布安全更新。

10月20日，一则匿名帖子出现在网络上，内容很直白，两项严重PHP漏洞即将公布。帖子几小时内被删除，截图已在社交媒体传开。PHP安全团队当天发布预告，确认漏洞存在，把补丁时间从周四提前到10月21日格林尼治时间14时。

两周变两天。协调期里准备好的防御措施、WordPress和Drupal的联动更新脚本、Cloudflare的WAF规则推送，原本还有缓冲空间，泄漏后全部被压缩到48小时内。



![PHP2Shell 保密期与泄漏时间线](https://iili.io/neZDiKb.png)
> PHP2Shell 保密期与泄漏时间线



### Cloudflare日志里的抢先攻击流量

补丁公开前，Cloudflare在自身边缘日志中检测到了针对未修补PHP服务器的利用流量。时间窗口极短，从帖子截图扩散到可执行exploit被自动化扫描器拾取，中间只隔数小时。Wiz在公开报告中直接引用了这组数据，并指出一个让防守方不舒服的事实：AI工具可以在补丁diff公布后极短时间内逆向出利用逻辑，攻击侧的响应速度不再受限于能不能手写exploit。

NSA当天发布紧急建议，要求无法立即打补丁的系统暂时下线。这不是修辞，是针对无法在数小时内完成滚动的政府机构和大型企业场景。PHP基金会同日发布了四个版本线的修复包，8.2.35、8.3.36、8.4.27、8.5.12，运营者按自身分支选对应版本即可，无须一律升到8.5。

从结果看，Defender's Window确实存在，AI比人类攻击者先到。但窗口宽度取决于保密能不能守住。一次截图泄漏把十周压缩成两天，而两天对全球约70%使用PHP的对外服务器来说，根本不够完成一次完整的滚动更新。W3Techs的数据显示能识别语言特征的网站中约75%跑着PHP，泄漏后的裸露面是数量级的。

Wiz把这件事说得很直白：「在AI出现之前，这类工作很难大规模开展。AI消除了这个门槛。」门槛消了，攻防两侧都快了，但防守侧多了一件AI帮不上的事，协调几百个CMS发行版和几万家运维团队在同一个窗口内同步升级。这件事慢的不是代码，是人。

## 「防御者窗口」：AI先到的那段时间值多少

### OpenAI、Wiz、PHP基金会三方各自讲了什么、没讲什么

OpenAI把这件事命名为「Defender's Window」。前沿 AI 比攻击者先发现漏洞，给维护者争取了修复和部署的时间。Wiz 侧重技术面，强调 AI 模型把过去需要数月人工调参才能触及的竞态条件压缩成了几天的自动审计。PHP 基金会的口径最保守，只说「8月11日起修复成为最高优先级」，没有主动认领任何叙事框架。

三方都没讲清楚一件事：这个窗口对下一个漏洞还成不成立。

### NSA「修不了就先下线」背后的真实约束

NSA 的建议不绕弯子。打不了补丁就下线，等风险缓解再上线。分量在于，全球约 60% 的对外 PHP 服务器跑的是已终止支持的老版本，升级路径本身就是个工程问题。NSA 没说「我们帮你升」，只说了「你不升就别跑了」。对政府内网和军工系统，下线意味着业务中断，这个成本谁来扛，文件里没写。

### 窗口假设的边界：下一个PHP核心漏洞会不会来得更快

AI比攻击者先到，这件事本身不稀奇；稀奇的是它到得够早，维护者还有时间修。窗口能撑多长，现在没人说得清。

这次 PHP2Shell 的保密期是两个月。但 Wiz 自己说了句关键的话，补丁一旦公开，AI 工具可以轻易逆向出漏洞逻辑。防守方的窗口等于「发现到公开」这段距离，不是「公开到修复完成」的距离。十年没人再审的代码不是「稳定」，是「没人看着」。AI把「没人看着」换成了「机器盯着」，代价是这些盲点会加速暴露。防守侧 AI 的扫描频率一旦和攻击侧持平，窗口压缩到接近零。



![防御者窗口时序](https://iili.io/neZbqbI.png)
> 防御者窗口时序



可执行的判断，落到你手上就三步。查你的 PHP 版本是否低于 8.2.35，低于就打补丁。打不了就按 NSA 说的断网。别赌攻击者的 AI 还没扫到你那台机器上。

## 参考文献
- [小白跃升坊：PHP2Shell 完整时间线与工具清单](https://www.cnblogs.com/xiaobaiysf/p/23397061)
- [iThome：Wiz Research 披露发现过程](https://www.ithome.com.tw/news/164219)
- [新浪：OpenAI「Defender's Window」概念](https://k.sina.com.cn/article_5952915720_162d24908067051f72.html)
- [搜狐：NSA 紧急建议与 PHP 基金会补丁公告](https://m.sohu.com/a/1091009629_104421)
- [新浪财经：Cloudflare 抢先攻击流量日志](https://finance.sina.com.cn/stock/t/2026-10-22/doc-inivzivz5376526.shtml)
- [The Next Web：三方叙事分歧](https://thenextweb.com/news/php2shell-php-rce-ai-openai-wiz)
- [DEV Community：AI Found the PHP Zero-Day First](https://dev.to/max_quimby/ai-found-the-php-zero-day-first-now-what-46np)

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
