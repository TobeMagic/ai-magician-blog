---
title: "Meta 因广泛反对暂停将网站内容用于 AI 训练的新商业条款"
date: "2026-11-06 10:14:26"
updated: "2026-11-06 11:34:06"
permalink: "posts/2026/11/06/meta-因广泛反对暂停将网站内容用于-ai-训练的新商业条款/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/11/06/meta-因广泛反对暂停将网站内容用于-ai-训练的新商业条款/"
article_id: "ff2b7787-8b52-45fb-8c9b-095fc59b6dc4"
description: "Meta新版商业条款暗含一项自动授权：凡持有Facebook或Instagram企业账号的网站，其内容可被爬虫抓取并用于广告及AI产品开发，且无法单独退出。出版商、News/Media Alliance、两党议员轮番施压后，Meta紧急删除“训练”一词并将生效日两度推迟。但法律专家指出，修订版“维护平台完整性”的模糊措辞仍未堵住AI用途口子——数据定价权的博弈远未结束。"
cover: "/var/lib/aimagician/artifacts/covers/ff2b7787-8b52-45fb-8c9b-095fc59b6dc4/267edf0f-6fcd-4610-bd33-57d9b1911864/cover.png"
imgTop: false
---

一家新闻社的编辑打开Meta新商业条款，在第四页密密麻麻的授权段落里扫到"train"这个动词，截了图发到行业群。

## 一个藏在第四页的动词，怎么让两党议员同时发声明

### 时间线复盘：从10月16日删词到生效日两度推迟

Meta于10月中旬发布新版商业服务条款，原定10月30日生效。条款授权Meta用爬虫抓取企业账户关联域名的全部内容，用于「提供、开发、改进、研究和维护」其产品。10月16日前后，「训练」一词被删除，发言人Andy Stone向Nieman Lab确认这只是整合既有广告条款，爬取范围未扩大。但News/Media Alliance在10月20日至22日连续施压后，Meta于10月23日宣布生效日推迟至11月20日，此后条款执行又被无限期搁置。

### Blackburn说"剥削"，Schiff说"撤回"：跨党派罕见共识怎么形成的

田纳西共和党参议员Marsha Blackburn公开称这条更新表明Meta「企图剥削美国的创作者和企业」。加州民主党参议员Adam Schiff直接敦促Meta「撤回这一改变」。背后原因不复杂，几乎所有美国新闻机构都至少持有一个Meta商业账户，拒绝条款等于放弃Facebook和Instagram的运营工具，接受条款则等于免费交出网站内容。Santa Clara大学法学者Eric Goldman补了一刀，修订版中「维护平台完整性」的模糊措辞仍未堵住AI用途的口子，法律灰色地带没有被填平。

## 条款原文拆解：从"训练"到"维护完整性"的措辞游戏

10月16日删掉"训练"后，Meta将用途描述收敛为「提供、开发、改善、研究和维护广告及商业产品，以及维护Meta旗下公司产品的完整性和安全性」。问题在于，「维护平台完整性」没有可操作的定义边界。Santa Clara大学法学者Eric Goldman在Nieman Lab采访中指出，这段模糊措辞留下法律灰色地带，爬虫以安全检查名义抓取内容后能否直接导入模型管线，修订条款未给出契约性保证。

### 七个动词的覆盖半径



![程序员 reaction：喂喂真的假的啊](https://iili.io/CumNIoJ.png)
> 七个动词排完，没有一个是可选的



访问、索引、缓存、分析、收集、检索、抓取，这组动词覆盖数据从首次触达到最终处置的完整生命周期。即便去掉「训练」，「分析」与「收集」仍为将抓取数据导入模型管线保留了解读空间。Meta发言人Andy Stone在Ars Technica报道中称，此为「整合既有广告条款」，内容所有者仍可用robots.txt表达偏好。但条款授权客体写的是「您域名、网页或网址相关的任何内容」，外延已跳出Meta自有平台边界。



![条款授权链路与灰色地带](https://iili.io/ntuJ5rb.png)
> 条款授权链路与灰色地带



### 适用对象：Threads和WhatsApp频道也在射程里

条款不区分「广告主」与「非广告主」。管理Facebook粉丝页、Instagram账号、Threads账号、WhatsApp商业频道或使用Meta Business Suite的主体，均在授权范围内。出版业几乎无法豁免，因为导流路径高度依赖这些入口。News/Media Alliance代表在公开声明中用了「exploitative」一词，指向的不是单一条款本身，而是这条授权把内容生产者和分发平台之间的议价关系彻底倒置了。

### 无法退出机制

没有单项退订选项。不接受完整授权，只能停止使用Meta全部商业服务。对一家靠Facebook和Instagram导流的媒体来说，拒绝这条条款等于关掉自己的收银台。

## 出版商为什么炸了：一条绕过版权诉讼的「保险条款」

出版商与OpenAI的版权诉讼打到第三个年头，争议核心始终是同一句话：未授权抓取新闻内容训练AI，到底算不算合理使用。Meta的条款没有等法院给答案，而是直接从合同端锁死授权。这是一份对冲，输赢两边都有退路。



![Meta条款的对冲逻辑](https://iili.io/ntuJUCX.png)
> Meta条款的对冲逻辑



### 数百万美元授权费 vs 条款里的零成本抓取

Nieman Lab算过这笔账：按行业惯例，向AI公司授权一年新闻内容，费用在数百万美元量级。条款生效后，这笔钱归零，而且没有单独退出按钮。你投广告、开Threads频道、管WhatsApp频道，就默认签了。更狠的是，Meta发言人Andy Stone在回应里反复强调「这只是整合既有广告条款」，言下之意：你本来就该给我用。

### News/Media Alliance的联合声明与监管介入呼声



![程序员 reaction：柯南00027 可疑哦](https://iili.io/CCZvaGs.png)
> 合同写死，零成本



News/Media Alliance代表确认删除「训练」是正确方向，但修订版仍保留广泛爬取许可且无合同保证。Santa Clara大学法学者Eric Goldman的判断更具体：「维护平台完整性」这五个字足够宽，AI训练完全可以被包装成安全维护，而法律上至今没有判例能一刀切地否定这种归类。两党议员的公开施压把这件事从行业纠纷拉到了国会层面，监管介入的窗口已经打开。下一步盯的不是Meta会不会再改措辞，而是FTC或各州总检察长是否会发函要求出示合同样本。

## 删词≠免责：法律灰色地带还剩多少

### 「维护平台完整性」八个字的解释权归谁

Santa Clara 大学法学者 Eric Goldman 在 Nieman Lab 采访里把问题收得很紧：修订版把「训练」删了，但保留了「维护 Meta 旗下公司产品的完整性和安全性」。这八个字没有定义边界。它既可以是反垃圾信息机制，也可以是反竞品数据壁垒。谁来裁定「维护完整性」是否涵盖用竞品内容喂模型？Goldman 的原话大意是，条款里这段模糊文字留下了相当的法律灰色地带，目前没有任何司法解释或判例能把它锁死。

### robots.txt 与条款授权的优先级冲突

Meta 发言人 Andy Stone 在声明里强调「内容所有者一如既往可以用 robots.txt 表达偏好」。问题出在层级。robots.txt 是 HTTP 协议层的建议，商业服务条款是合同义务。企业注册 Meta Business Suite 即签署了包含爬虫授权的服务协议。合同在法律效力上压过技术层建议——你在 robots.txt 里写 Disallow /all，只要条款没保留「尊重 robots.txt」的明文承诺，Meta 仍可主张合同授权优先。



![robots.txt 与商业条款的优先级冲突](https://iili.io/ntudlFs.png)
> robots.txt 与商业条款的优先级冲突



### 11 月 20 日后不执行，条款是否自动失效

The Verge 报道的「无限期推迟」让条款处于悬置态：已修订、未生效。法律上，未生效条款不产生约束力。真正的风险在时间差——Meta 可以在未来某时点单方面宣布「现已生效」，届时所有持有商业账号的用户视为默认同意。出版商法务团队现在盯的就是这个窗口。

## 下一步：数据定价权往哪走

### AI 野心没停，只是换了入口

删掉「训练」两个字不等于不需要训练数据。同期 Meta 推出 Muse 独立 AI 应用（Llama 4 驱动），与 CNN、Fox News、Le Monde 签署实时新闻内容合作；Reflection AI 与 Nebius 达成 10 亿美元算力合作引入 Nvidia 最新芯片。策略很清晰：合同通道走免费抓取，合作通道走付费授权，两条腿同时跑。你买的旗舰款，瞬间变成平替套餐——只不过这里是「免费条款」和「付费合作」互为平替。

### 出版商手里的三张牌

[[questioning-rebuttal|caption=三条路都能走，关键看谁先坐不住]]

第一，监管游说。Blackburn 和 Schiff 的跨党派声明是罕见杠杆，News/Media Alliance 代表 500 余家媒体机构集体发声，比单家新闻社喊话重得多。第二，集体诉讼。OpenAI 版权诉讼尚未终审，Meta 条款试图在判决落地前锁定抓取权限，出版商可以主张合同不能预先放弃未来可能确立的版权。第三，集体谈判。联盟的议价筹码是「不给授权费就别谈合作」，把 Meta 从合同通道逼回付费通道。

### 持有 Meta 商业账号的企业，现在该做三件事

一，检查 robots.txt 是否覆盖 /api/、/wp-json/、/sitemap.xml 等高价值路径，确认技术层偏好没有留死角。二，调出 Business Suite 注册日期与签署的条款版本，比对 2026 年 10 月修订前后的差异，确认自己是否落在新条款射程内。三，若网站内容对 AI 训练有商业价值，在条款最终生效前发函书面保留异议。沉默不等于同意，但主动异议在法律上更有分量，这也是目前唯一能在合同层留下白纸黑字的动作。

## 参考文献
- Nieman Lab / Meta 商业条款原文及时间线：https://www.bnext.com.tw/article/92714/meta-commercial-terms-web-scraping
- The Verge（转 Межа）/ Meta 推迟生效日：https://mezha.net/ch/news/mezha-08ca675127ed7685211813cd_meta-may-delay-its-new-business
- 搜狐·欧盟委员会 / 新条款引发出版业反对：https://www.sohu.com/a/1093493814_161795
- 凤凰科技 / Meta 删除「训练」表述：https://feng.ifeng.com/c/8xLWS4LMCrP
- 搜狐·至顶头条 / Meta 规避 AI 授权费分析：https://m.sohu.com/a/1090749091_114765
- 科技新报 / 删除条款文字及 Eric Goldman 观点：https://today.line.me/tw/v3/article/kEpPY1Z
- CNBC / Meta AI 独立应用：https://www.cnbc.com/2025-02-27/meta-plans-to-release-a-standalone-meta-ai-app.html
- The Decoder / Meta AI 接入实时新闻源：https://the-decoder.com/meta-ai-turns-into-a-real-time-news-hub-with-cnn-fox-news-and-more

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
