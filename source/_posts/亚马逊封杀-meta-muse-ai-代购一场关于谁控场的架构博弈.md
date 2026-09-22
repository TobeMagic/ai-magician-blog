---
title: "亚马逊封杀 Meta Muse AI 代购，一场关于「谁控场」的架构博弈"
date: "2026-09-22 11:00:02"
updated: "2026-09-22 11:08:44"
permalink: "posts/2026/09/22/亚马逊封杀-meta-muse-ai-代购一场关于谁控场的架构博弈/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/09/22/亚马逊封杀-meta-muse-ai-代购一场关于谁控场的架构博弈/"
article_id: "91fd7959-4db4-4f63-bee0-ebf0d1a76ceb"
description: "亚马逊阻断 Meta Muse 智能体访问其购物网站，理由是未经授权的 AI 代理冒充用户身份操作账户。这不仅是两家巨头的口水战，更暴露了 AI Agent 架构与传统电商平台访问控制体系的根本冲突：当智能体取代人类点击时，平台如何验证访问者身份？Shopify 选择开放 API，亚马逊选择封禁，两条路径背后是两种完全不同的架构哲学。"
cover: "/var/lib/aimagician/artifacts/covers/91fd7959-4db4-4f63-bee0-ebf0d1a76ceb/a5bd5487-364c-4e55-9628-5d028eca92aa/cover.png"
imgTop: false
---

亚马逊阻断了 Meta 个人 AI 智能体 Muse 代用户在其网站购物的访问权限，称从未许可该访问，并指 Muse 不表明身份、会采集保存用户账号凭证，带来隐私和安全隐患。Meta 则回应称 Muse 无法读取用户密码或支付信息，凭证存入安全存储区，且敏感操作前会再次征得用户同意。



![程序员 reaction：Frontend](https://iili.io/CLXGI0N.png)
> 这次扯皮，后端架构说了算



## 业务目标：让 AI 替用户完成电商购物

过去三个月，Perplexity 推出 Comet 浏览器、OpenAI 开发购物智能体、Google 也在布局 Agent Shopping。技术趋势很明确：AI 正从「搜索辅助」走向「直接下单」。对 Meta 而言，Muse 要成为个人助理的核心场景，必然包含代用户购物。

但这里出现了一个关键的架构分歧：智能体如何与电商平台交互？

这个问题背后是三个相互独立的路径。

### 方案 A：直接爬取模式（Meta Muse 的做法）

Muse 的产品设计逻辑是「像用户一样操作浏览器」。对于没有公开 API 的服务，Agent 通过模拟用户登录、浏览、加购、提交订单来完成交易流程。

这种方案的工程代价最低——不需要与每个电商平台谈合作、对接接口，只需一个通用的浏览器自动化工具链。Meta 的 Muse Secure VM 架构也确实做了凭证隔离：用户输入的密码不会以明文形式出现在 Agent 执行层。

问题在于权限边界。亚马逊发言人 Lara Hendrickson 的声明说得很清楚：「第三方应用代表客户向其他企业提供购买服务，就应该以公开透明的方式运营，并尊重服务提供商是否愿意参与其中的决定。」

更直接地说，平台不担心 AI 帮用户比价，担心的是 AI 绕过平台、替用户做决定。

### 方案 B：API 授权模式（Shopify 的路径）

Shopify 的选择正好相反。首席执行官 Tobias Lütke 宣布与 Muse 合作，开放代理结账功能。

这不是简单的「开放态度好」，而是一个经过权衡的基础设施决策。Shopify 的平台定位就是为商家提供标准化接入能力，API 优先是其架构基因。当 Agent 通过授权 API 访问时，订单来源可追溯、交易链路可审计、用户数据边界可控制。

相比之下，亚马逊的广告营收超过 680 亿美元/年，广告业务高度依赖用户主动浏览网页、查看赞助商品。Agent 直接下单意味着绕过广告展示环节，这是商业模式层面的冲突，不只是技术问题。

### 方案 C：身份披露 + 显式同意（争议中的第三条路）

业界已经出现了尝试标准化这一流程的方案。AgentPass 项目提出六件套机制：AgentID 生成、商户白名单识别、凭证上链存证、用户授权收据、行为反滥用检测、申诉工具包。

这套方案的核心理念是「身份透明」——Agent 在发起请求时必须携带可验证的身份标识，商户可以选择是否接受。用户侧则需要显式确认每次授权。

这听起来理想，但落地成本不低。需要 Agent 平台、商户系统、支付渠道三方协同建立标准，目前还处于早期探索阶段。

### 选型决策：平台该开放还是封闭？

三条路径背后是三种不同的商业哲学。

直接爬取模式本质上是「技术自由主义」——只要能力够，就能接入任何服务。它的优点是快速迭代、生态覆盖广；缺点是法律风险高、商户关系紧张。

API 授权模式是「许可经济」——接入需要先获得平台同意。优点是关系稳定、数据可控；缺点是开放速度慢、生态碎片化。

身份披露方案试图在两者之间找平衡，但前提是建立信任基础设施。当智能体不再透明，每一次自动化点击都像是一次未登记的入侵。



![程序员 reaction：柯南00048 就这么定了](https://iili.io/CUyctup.png)
> 选择困难症被治好了，因为没得选



```\mermaid
%% title: 三种访问模式的系统交互
flowchart LR
  subgraph AgentLayer[Agent 层]
    Muse[Muse Agent]
    Comet[Comet Browser]
  end

subgraph AccessMode[访问模式]
    A[爬取模式]
    B[API 授权]
    C[身份披露]
  end

subgraph PlatformLayer[平台层]
    Amazon[亚马逊 拒绝]
    Shopify[Shopify 开放]
    TBD[待建立标准]
  end

subgraph UserLayer[用户层]
    Auth[凭证授权]
    Consent[显式确认]
    SecureVM[Muse Secure VM]
  end

Muse -->|直接操作浏览器| A --> Amazon
  Muse -->|OAuth/API 调用| B --> Shopify
  Muse -->|AgentID + 凭证上链| C --> TBD

Auth -.-> SecureVM
  Consent -.-> SecureVM
```

亚马逊去年就起诉了 Perplexity，理由是其 Comet 浏览器试图隐藏购物 Agent 的身份。这次封禁 Muse 是同一套逻辑的延续。平台在守住一条线：你想用我的基础设施赚钱，得按我的规则来。

对 Agent 开发者而言，这是一个明确的信号——当产品从工具属性转向交易属性时，身份、权限和凭证会立刻变成硬门槛。这不是用户体验问题，是商业模式问题。平台不会因为你技术更强就放弃对用户关系的控制权。
对架构师来说，选择哪条路径取决于你的平台定位。开放 API 适合 SaaS 型平台，封闭生态适合零售型平台，第三条路还在等标准落地。



![程序员 reaction：BUTTHATWILLCREATE](https://iili.io/CAQOubS.png)
> ##业务目标：让AI替用户完成电



## 方案 A：直接爬取模式（Meta Muse 的做法）

Meta 的 Muse 采用的是无头浏览器路径。当用户授权 Muse 访问外部服务后，智能体会模拟人类操作——打开网页、填写表单、点击按钮。对于没有公开 API 的服务，这是唯一能打通多步骤任务的路径。用户提交的账号凭证会进入独立的 Secure VM 存储区，Muse 本身无法读取明文，但仍可通过凭证完成认证后的操作序列。

这种模式的工程优势很明显：不需要任何商户配合，只要目标网站有前端界面，Agent 就能跑起来。这也是 OpenAI 的Sora、Google 的 Gemini Action 都在探索的方向。但它的致命缺陷在于身份黑盒——当智能体以浏览器会话的形式出现时，服务端无法区分它是人类用户在操作还是 Agent 在自动化执行。

更狠的是，每次自动化点击都不留下可审计的痕迹。当智能体不再透明，每一次操作都像是一次未登记的入侵。



![程序员反应图：真正的程序员](https://iili.io/CUyhliQ.png)
> ##方案A：直接爬取模式（Met



## 方案 B：API 授权模式（Shopify 的路径）

Shopify 选择了另一条路。Tobias Lütke 在 Muse 发布后迅速宣布双方合作，允许 Muse 通过 Shopify 的公开 API 完成代理结账。这条路径的核心机制是 OAuth 授权加 API 网关：商户在后台配置 Agent 访问权限，用户通过标准授权流程授予 Muse 操作账户的 token，所有请求经过网关验证后转发到业务系统。

这种方案的工程收益是审计完整、权限可控。平台可以记录每次 Agent 操作的来源、范围和结果；可以针对 Agent 设置独立的速率限制和风控策略；可以在发生纠纷时追溯操作责任主体。Visa 和 Mastercard 也在推动类似的基础设施标准化，试图为 Agent-to-Agent 支付建立通用协议。

但它的代价是 adoption friction。每家商户都需要单独配置 API 接入，对于中小卖家来说，这几乎是不可承受的工程成本。结果是：能用 API 模式的服务是少数，绝大多数长尾站点依然被排除在外。



![程序员反应图：嗨嗨，醒醒，敲代码了](https://iili.io/nuO4x5P.png)
> ##方案B：API授权模式（Sh



## 方案 C：身份披露 + 显式同意（争议中的第三条路）

亚马逊在声明中提出了一条看起来折中的路径：第三方智能体应当以公开透明的方式运营，并尊重服务提供商是否愿意参与的决定。这意味着 Agent 需要在每次访问时声明自己的身份，并获得平台的显式许可。

从工程角度看，这需要建立一套 AgentID 体系。Agent 在发起请求时携带数字身份标识，服务端验证标识后决定是否放行。用户授权则需要显式确认，类似于 OAuth 2.0 的 consent flow，但要增加「商户同意」这一层。AgentPass 方案提出过六件套的设计思路：AgentID 生成、MerchantWhitelist、凭证上链、用户授权收据、反滥用检测和申诉工具包——虽然该方案尚未成为行业标准，但它指出了正确的技术方向。

这条路的难点不在技术，在于利益分配。谁来制定身份协议？谁来承担验证成本？商户有没有动力配合？目前没有任何一个权威机构拥有这种协调权。



![程序员 reaction：没这种可能吧](https://iili.io/CumfHL7.png)
> ##方案C：身份披露+显式同意（



## 选型决策：平台该开放还是封闭？

三种方案没有绝对优劣，只有适用条件的差异。

如果平台拥有足够的议价能力、能够要求合作方进行 API 接入改造，API 授权模式是最干净的选择。Shopify 走这条路，是因为它控制着商户生态的配置权。如果平台处于防御姿态、担心流量被绕开、核心收入来自广告和站内转化，封禁直接爬取是理性选择。亚马逊走这条路，是因为它的广告营收超过 680 亿美元，每一笔被绕过的浏览都是直接损失。

对于绝大多数中小平台，第三条路是唯一现实的路径：不拒绝 Agent，但要求身份披露和显式授权。这需要平台投入工程资源建设 Agent 识别和授权基础设施，但长期来看是最可持续的模式。

问题在于，现在还没有人愿意先投入这笔成本。每个平台都在等别人先行，然后观察效果再决定是否跟进。这种观望状态对消费者体验的伤害最大——同样的需求，在有的平台能成交，在有的平台会撞墙。

## Mermaid 架构图：三种访问模式的系统交互mermaidmermaidmermaid
%% title: 三种 Agent 访问模式的系统交互对比
flowchart LR
    subgraph A[方案 A：直接爬取]
        direction TB
        UA1[用户指令] --> M1[Muse Agent]
        M1 -->|模拟浏览器会话| AW1[目标网站]
        AW1 -->|无身份校验| AW2[完成操作]
        M1 -->|凭证存入 Secure VM|
    end

subgraph B[方案 B：API 授权]
        direction TB
        UA2[用户指令] --> M2[Muse Agent]
        M2 -->|OAuth Token 请求| AG[API Gateway]
        AG -->|验证权限| MW[商户系统]
        MW -->|白名单通过| M2 -->|返回结果|
    end

subgraph C[方案 C：身份披露+授权]
        direction TB
        UA3[用户指令] --> M3[Muse Agent]
        M3 -->|AgentID + 授权请求| AG2[身份网关]
        AG2 -->|验证+商户确认| MW2[商户系统]
        MW2 -->|显式同意| M3 -->|完成操作|
    end

A -. 零配置 但有黑盒风险 .-> 平台端
    B -. 高集成成本 但审计完整 .-> 平台端
    C -. 需新基建 但兼顾开放可控 .-> 平台端


![程序员 reaction：SalesforceCEosaysengineers](https://iili.io/CCZxcRn.png)
> 三种模式并行运行，平台端压力拉满



架构选择最终取决于平台对自己护城河的判断。Shopify 认为商户关系是护城河，所以开放 API；亚马逊认为流量和广告是护城河，所以封锁非授权访问。两者都在合理逻辑内做出了最保护自己的决策。

对工程团队而言，短期内最重要的是建立 Agent 识别能力——不管最终选哪条路，你都需要知道访客是人类还是智能体。没有这个基础，任何授权机制都无法落地。这是接下来 12 个月内值得优先投入的方向。



![程序员 reaction：we'rechangingthe](https://iili.io/CCG5GX1.png)
> Agent 运行时过载



这不是两家巨头的口水战，而是暴露了一个真实的架构冲突：当智能体取代人类点击时，平台如何验证访问者身份？Shopify 选择开放 API，亚马逊选择封禁，两条路径背后是两种完全不同的架构哲学。

## 亚马逊的封禁逻辑

### 问题不在技术，在授权

亚马逊发言人的声明里提到一个关键句式："第三方应用代表客户向其他企业提供购买服务，就应该以公开透明的方式运营。"

这句话的本质是说：Muse 的问题不是技术上的，是授权链上的缺失。

Amazon 认为，代用户下单的第三方服务需要取得商户同意。外卖平台对接餐馆、在线旅游机构代用户预订机票，都是这类例子。Muse 没有走这条路线，它直接从用户侧获取凭证，然后在浏览器里模拟用户操作。亚马逊称这是"未经授权的访问"。

更狠的是，去年亚马逊就起诉了 Perplexity，理由相似：Comet 浏览器被指控隐瞒购物智能体身份，在亚马逊 asked 移除后仍继续运行。

### 广告收入的隐性护城河

这件事对亚马逊的商业影响不小。去年广告营收超过 680 亿美元，广告业务高度依赖用户主动浏览网页、查看平台内赞助商品。

当 AI 智能体代替用户浏览时，平台内的 sponsored products、推荐算法、用户行为数据闭环都被绕过了。用户可能问 Muse "帮我买一双跑鞋"，然后 Muse 跨平台比价后直接下单——亚马逊的品牌曝光、推荐逻辑、用户粘性全部归零。

平台不担心 AI 帮用户比价，担心的是 AI 绕过平台、替用户做决定。

## 三条路径的架构对比

### 方案 A：直接爬取模式

这是 Muse 默认的行为模式。对于没有公开 API 的服务，智能体通过用户凭证以浏览器方式登录，模拟用户操作完成购物流程。

优点：无需平台授权，灵活性强，覆盖范围广。一个 Agent 可以跨多个平台工作，不需要每个平台单独对接。

缺点：违反大多数平台的使用条款，法律风险高，且凭证安全问题始终存在——即便 Meta 声称凭证存储在安全 VM 中、Agent 无法读取明文，第三方审计难度也大。

### 方案 B：API 授权模式

Shopify 选择了这条路线。CEO Tobias Lütke 宣布与 Muse 合作，允许其在平台商店内实现代理结账功能。

优点：平台可控，权限边界清晰，用户授权有据可查，数据流向透明。API 模式下平台可以记录 Agent 行为、设置 rate limit、追踪账单归属。

缺点：每个平台都需要单独对接，覆盖范围受限。平台没有动力开放，除非像 Shopify 一样把 Agent 接入当作生态卖点。

### 方案 C：身份披露 + 显式同意

这是争议中的第三条路。Agent 在访问任何平台前必须声明身份，用户必须在知情前提下明确授权，平台可以选择接受或拒绝。

理论上这个模式最平衡，但落地有几个难点：一是身份标准的统一，不同平台用不同格式声明 Agent 身份；二是用户习惯的养成，普通人未必愿意每次购物前填一份授权表单；三是执行成本，小规模平台的接入成本可能高于收益。mermaidmermaid
%% title: 三种访问模式的系统交互
flowchart LR
  subgraph User[用户层]
    U[用户发出购物指令]
  end

subgraph Agent[Agent 层]
    M[Muse / Agent]
  end

subgraph PlatformA[平台 A: 亚马逊模式]
    A1[爬取入口]
    A2[凭证存储区]
    A3[访问被阻断]
  end

subgraph PlatformB[平台 B: Shopify 模式]
    B1[API Gateway]
    B2[Token 鉴权]
    B3[允许访问]
  end

subgraph PlatformC[平台 C: AgentPass 模式]
    C1[AgentID 生成]
    C2[白名单校验]
    C3[用户显式授权]
  end

U --> M
  M --> A1
  M --> B1
  M --> C1

A1 --> A2
  A2 --> A3
  B1 --> B2
  B2 --> B3
  C1 --> C2
  C2 --> C3
  C3 --> U

```

## 结语

这场争端没有赢家，但暴露了一个必须解决的技术问题：Agent 时代的访问控制体系还没有成熟。

对平台而言，短期选择封禁或开放是商业决策；长期来看，谁能率先建立 Agent 身份的通用标准，谁就能定义下一代电商的基础设施。

对用户而言，Muse 被封禁只是开始。接下来 OpenAI 的 Agent、Google 的 Agent、Perplexity 的 Agent 还会继续尝试进入各个平台。规则还没定，博弈才刚开始。

## 参考文献
- Amazon blocks Meta's Muse AI agent from shopping on its site, GeekWire, Sep 20, 2026: https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping
- Amazon Blocks Meta's Muse AI Agent From Shopping on Its Site, Business Insider, Sep 2026: https://www.businessinsider.com/amazon-blocks-meta-muse-ai-agent-shopping-site-2026-9
- Amazon blocks Meta's Muse AI assistant, citing security and privacy concerns, TechCrunch, Sep 21, 2026: https://techcrunch.com/2026/09/21/metas-ai-agent-has-been-blocked-from-using-amazon-com/
- AI代理正在改写电商的「谁控场」规则，IT之家, 2026-09-21: https://www.ithome.com/1/005/418.htm

<div class="hexo-wechat-follow-card" style="margin:28px 0 0;padding:16px 18px;border:1px solid #dbe7f3;border-radius:14px;background:#f8fbff;"><a href="weixin://profile/gh_1ab72c968bef" style="font-weight:700;color:#0f5b9f;text-decoration:none;">点这里一键关注『计算机魔术师』</a><p style="margin:8px 0 0;font-size:13px;color:#6f8299;line-height:1.7;">如果浏览器无法直接唤起微信，可在微信内打开公众号主页：<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzkwNjQyOTUwOA==#wechat_redirect" style="color:#0f5b9f;text-decoration:none;">计算机魔术师</a></p></div>
