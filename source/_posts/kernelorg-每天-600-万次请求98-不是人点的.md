---
title: "kernel.org 每天 600 万次请求，98% 不是人点的"
date: "2026-09-08 10:00:01"
updated: "2026-09-08 10:08:25"
permalink: "posts/2026/09/08/kernelorg-每天-600-万次请求98-不是人点的/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/08/kernelorg-每天-600-万次请求98-不是人点的/"
article_id: "51c594de-0d63-4de0-91ee-d05492fe7036"
description: "Linux 内核代码托管站点 git.kernel.org 每天承受约 600 万次访问请求，其中 98% 来自自动化爬虫。90 个 CPU 核心中有 14 到 16 个始终满负荷运转，专门把 Git 提交转换成 HTML 供爬虫抓取——而这些数据本可以通过 git clone 在本地处理。这不只是带宽问题，更是开源基础设施在 AI 时代面临的隐性成本危机。"
cover: "/var/lib/aimagician/artifacts/covers/51c594de-0d63-4de0-91ee-d05492fe7036/48487c54-bd67-4a9f-95f2-c4582421bf15/cover.png"
imgTop: false
---

一个运行了三十年的开源项目服务器，最近被 AI 爬虫薅走了近五分之四的算力。维护者说，90 个 CPU 核心里，有 14 到 16 个专门用来给机器人渲染网页，剩下的 70 多个才真正服务人类开发者。

前几天，科技媒体 Linuxiac 发布了一篇博文，指出 Linux 内核项目的代码托管站点 git.kernel.org 正承受大规模自动化抓取压力。站点每天约收到 600 万次随机提交页面访问请求，其中约 98% 来自爬虫。

![程序员 reaction：MeusingAlagentstocodewith](https://iili.io/CCZAA8B.png)
> 这服务器快扛不住了



### 600 万次请求背后的真相

Kernel.org 在全球分布 5 个分布式节点，配置 90 个 CPU 核心。Linux 主仓库 linux.git 目前约有 148 万次提交，git.kernel.org 还托管约 922 个分叉仓库。尽管后端大量复用相同 Git 对象，但网页端仍可生成大量可访问链接。

除提交页面外，站点还提供补丁、纯文本版本及任意提交之间的差异对比。单个分叉仓库即可衍生海量 URL，多个分叉叠加后形成数十亿级别的潜在抓取地址。



![git.kernel.org 请求构成分析](https://iili.io/n3w6Fse.png)
> git.kernel.org 请求构成分析



### 14 个 CPU 核心在忙什么

维护者估算，爬虫相关渲染约占总计算能力 20%。这 14 到 16 个 CPU 核心始终忙于将 Git 提交转换为 HTML，为爬虫提供可抓取的页面。

![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> 这锅运维背了



更准确地说，服务器在处理每一个爬虫请求时，都需要实时解析 Git 对象、渲染代码高亮、生成文件列表。这一系列操作对 CPU 和内存的消耗，远比直接提供原始 Git 数据高出几个数量级。

维护方指出，这些数据本可通过 Git 直接克隆并在本地处理。部分爬虫却按提交逐页请求并解析 HTML，显著增加服务器的实时渲染负担。

### 为什么爬虫不直接用 git clone

git clone 一行命令能解决的事，爬虫非要逐页渲染成 HTML，这不是技术进步，是资源错配。

AI 训练数据的抓取通常采用两种方式：一是直接拉取整个仓库的 Git 对象，二是逐页爬取渲染后的网页内容。后者看似“友好”，实则是最大的资源浪费。

对于 Git 仓库而言，代码和提交记录本来就是结构化的二进制数据。使用 `git clone` 或 `git fetch` 可以直接获取完整的版本历史，无需依赖任何网页渲染逻辑。

![程序员 reaction：status 418  status 418 5knj](https://iili.io/CCG58Xt.png)
> 搬砖也有技术含量



问题在于，许多爬虫框架默认按照网页爬取的思路设计：解析 DOM、提取文本、跟随链接。这种思路在面对 Git 仓库时显得尤为笨拙。

### 开源基础设施的隐性成本

开源项目的维护者用算力在养爬虫，而爬虫反过来又在消耗这些算力。

这不只是带宽问题，更是开源基础设施在 AI 时代面临的隐性成本危机。Kernel.org 的运维团队本身并不富裕，90 个 CPU 核心的配置已经算是精心维护的结果。当近五分之一的算力被爬虫占用时，真正需要资源的开发者反而可能面临性能下降。



![爬虫与开源基础设施的零和关系](https://iili.io/n3w6h1s.png)
> 爬虫与开源基础设施的零和关系



开源世界的逻辑原本是：共享代码、降低门槛、协同进步。但当爬虫把整个 Git 仓库的数据逐页抓取一遍时，这种共享就变成了单向索取。

![程序员系列表情：我还能写代码](https://iili.io/CAlYkxI.png)
> 代码是 shared，算力是 yours



### 这个问题无解吗

目前，Kernel.org 采用 Anubis 挑战机制拦截部分爬虫。约 66% 的恶意请求被直接挡在门外，但仍有约 33% 的爬虫通过数学题验证进入站点。

维护者希望爬虫能“smarten up”，改用更合理的方式获取数据。但从现状看，大多数 AI 公司并没有主动调整抓取策略的动力。

开源基础设施的守护者，终究还是在用有限的资源，对抗无休止的自动化流量。这或许是一个需要行业共识才能解决的问题，而不是单靠一个项目就能承受的。

### 600 万次请求背后的真相

科技媒体 Linuxiac 在 2026 年 8 月 31 日披露的数据很直观：git.kernel.org 每天收到约 600 万次对随机提交页面的访问请求。维护方、Linux Foundation 的 IT 基础设施安全总监 Konstantin 估算，其中约 98% 来自自动化爬虫，合法的人类开发者请求只占 2% 左右。



![程序员 reaction：yourhelpgettingus](https://iili.io/CAlS9b2.png)
> AI 爬取量远超人类访问



600 万次是什么概念。普通开源项目每天几百次访问就算不错了，这是三个数量级的差距。更关键的是，这些请求不是浏览热门发布页，而是随机抓取任意 commit 的详情页——目的很明确，就是批量收割代码数据喂给模型训练。

### 14 个 CPU 核心在忙什么

kernel.org 在全球分布 5 个节点，共 90 个 CPU 核心。其中 14 到 16 个核心始终处于满负荷状态，唯一任务是把 Git 提交历史转换成 HTML 页面。Konstantin 的原话是：「我们渲染提交记录给爬虫用的 CPU 周期，比所有其他合法访问——包括 git clone——加起来还多。」



![程序员反应图：感谢你这一年废寝忘食的加班](https://i.ibb.co/LDmfRK5T/transparent.png)
> CPU 在替爬虫加班



这个渲染过程不便宜。每个 commit 页面需要查询数据库、组装差异对比、渲染补丁格式、生成纯文本版本，还要处理分叉仓库的海量 URL。Linux 主仓库 linux.git 已有约 148 万次提交，加上 922 个分叉仓库，潜在可抓取的页面数量达到数十亿级别。单点请求看起来消耗不大，但 600 万次叠加起来，就是持续的高负载。



![kernel.org 流量结构对比](https://iili.io/n3wPTv4.png)
> kernel.org 流量结构对比



### 为什么爬虫不直接用 git clone

这才是问题的核心。kernel.org 维护者反复强调一点：这些数据本来就是开源的，任何人均可通过 `git clone` 直接获取完整仓库。不需要逐页请求 HTML，不需要服务器实时渲染，不需要消耗任何 CPU 周期做额外转换。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> 爬虫非要把简单问题复杂化



部分 AI 爬虫仍然选择逐条请求提交页面并解析 HTML，原因大致有三。第一，早期数据采集阶段，爬虫工程师可能没有深入理解 Git 协议，直接套用传统网页抓取套路。第二，HTML 页面结构更规整，正则表达式就能提取代码片段；而 Git 对象需要客户端工具解析。第三，也是最重要的一点，批量 HTML 请求能触发服务器日志，给运维人员制造心理压力，间接推动对方升级基础设施——虽然这种策略在开源社区通常适得其反。

Git 本身的设计就是为去中心化协作服务的，强制爬虫走 HTTP 渲染路径，等于把高效协议降级成低效的网页浏览。这不是技术进步，是资源错配。

### 开源基础设施的隐性成本

kernel.org 不是一个商业公司运营的云服务。它的资金来自捐赠，算力来自志愿维护者投入的时间，服务器成本由 Linux Foundation 承担。当 20% 的 CPU 能力被爬虫无偿占用时，实际是在让开源社区为 AI 训练付费。



![还没解释就先被安排转身背锅时的表情](https://i.ibb.co/5w7fnXQ/transparent.png)
> 社区在替 AI 公司买单



这种隐性成本在 AI 时代越来越突出。大模型训练需要海量代码数据，GitHub 等商业平台开始对 API 调用收费，一些团队转而寻找免费替代源。kernel.org 因其开放性和权威性，成了目标之一。但免费不等于无代价——维护者被迫用有限资源服务非目标用户，合法开发者的体验可能受影响，项目长期可持续性受到挑战。

更深层的问题是角色错位。kernel.org 的使命是托管 Linux 内核代码、服务内核开发者。当服务器主要负载来自为 AI 模型提供训练数据，而非服务真实开发者时，基础设施的原始目的已经被稀释。这不是指责 AI 研究本身有问题，而是指出当前的数据获取方式存在结构性低效。

### 这个问题无解吗

目前可行的应对手段集中在两个层面。技术层，kernel.org 已部署 Anubis 挑战机制，约 66% 的自动化请求被直接拦截，剩余 33% 需要完成数学计算才能进入主站。这套机制增加了爬虫成本，但也误伤了部分合法自动化工具。管理层面，维护者呼吁爬虫方改用 Git 协议直接访问，或在 robots.txt 中声明合规策略，但执行依赖于对方自愿配合。



![程序员 reaction：柯南00027 可疑哦](https://iili.io/CCZvaGs.png)
> 真相是协议选择问题



从经验看，单纯技术封堵效果有限。爬虫有替代源，封堵 kernel.org 只会迫使他们转向其他镜像站。真正可持续的方案是建立协议规范——明确要求数据采集走 Git 而非 HTTP，降低服务器实时渲染负担。这需要在社区层面形成共识，而非依赖单个项目的单方面努力。

开源基础设施的维护者用算力在养爬虫，而爬虫反过来又在消耗这些算力。这是一个需要重新校准的平衡。

## kernel.org 被爬虫薅走的算力

### 600 万次请求背后的真相

2026 年 8 月 31 日，科技媒体 Linuxiac 发布博文，披露了 git.kernel.org 的运维数据：站点每天约收到 600 万次随机提交页面访问请求。其中约 98% 来自自动化爬虫，真正的人类开发者访问量仅占 2% 左右。



![程序员 reaction：definitelyaren'tamatch](https://iili.io/CClZ3Ft.png)
> 算力被薅走的现场



Kernel.org 在全球分布 5 个分布式节点，配置 90 个 CPU 核心。Linux 基金会 IT 基础设施安全总监 Konstantin 表示，14 到 16 个核心始终忙于将 Git 提交转换为 HTML 页面，这部分渲染开销占总计算能力的 20%。这个数字还不包括爬虫爬取前后产生的网络传输、磁盘 I/O 和存储开销。

Linux 主仓库 linux.git 目前有约 148 万次提交，git.kernel.org 还托管约 922 个分叉仓库。尽管后端大量复用相同的 Git 对象，但网页端可以生成海量可访问链接。单个分叉仓库即可衍生出数十亿级别的潜在抓取地址，叠加之后形成巨大的请求压力。

### 14 个 CPU 核心在忙什么

这些 CPU 核心并非在执行复杂的算法或处理加密计算，而是在做一件简单却重复的事情：把 Git 提交记录渲染成 HTML 页面。

当爬虫访问某个提交页面时，服务器需要读取 Git 对象的元数据、计算文件差异、生成补丁视图，最后包装成完整的 HTML 文档返回给请求方。这个过程对于单次请求来说计算量不大，但面对每天数百万次的并发请求，累积效应就相当可观。



![程序员 reaction：Me:Boyohboy,i'mthinkingabout](https://iili.io/CC572nV.png)

 日请求 600 万次，Kernel.org 维护者称约 98% 流量来自爬虫_腾讯新闻. https://view.inews.qq.com/a/20260901A055AA00
[2] The kernel.org hack | Scali's OpenBlog™. https://scalibq.wordpress.com/2011/09/02/the-kernel-org-hack
[3] 日请求600万次，Kernel.org维护者称约98%流量来自爬虫_搜狐网. https://m.sohu.com/a/1070370098_114760?scm=10001.325_13-325_13.0.0-0-0-0-0.5_1334
[4] AI Crawlers Now Cost More CPU Than All Your Real Traffic Combined | Pinggy Blog. https://pinggy.io/blog/ai_crawlers_cost_more_cpu_than_real_traffic
[5] Kernel.org git repositories. https://web.archive.org/web/20250929100341/https://git.kernel.org
[6] Index of /pub/Linux/kernel.org/software/scm/git. http://ftp.nara.wide.ad.jp/pub/kernel.org/software/scm/git
[7] Kernel.org git repositories. https://web.archive.org/web/20260215092519/https://git.kernel.org/pub/scm/docs/man-pages
[8] homebrew - alternative source for installing git. brew install git; kernel.org Down for maintenance - Stack Overflow. https://stackoverflow.com/questions/7360214/alternative-source-for-installing-git-brew-install-git-kernel-org-down-for-mai
