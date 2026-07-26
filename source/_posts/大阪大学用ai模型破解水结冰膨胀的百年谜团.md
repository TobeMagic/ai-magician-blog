---
title: "大阪大学用AI模型破解水结冰膨胀的百年谜团"
date: "2026-07-26 20:15:16"
updated: "2026-07-26 20:50:30"
permalink: "posts/2026/07/26/大阪大学用ai模型破解水结冰膨胀的百年谜团/"
canonical_url: "https://tobemagic.github.io/ai-magician-blog/posts/2026/07/26/大阪大学用ai模型破解水结冰膨胀的百年谜团/"
article_id: "05ac51d0-cbfe-4127-9c3c-c1189d3b8582"
description: "日本大阪大学团队利用AI模型系统性评估16种分子结构描述方法，找到了精准捕捉水分子在不同温度、压力下微观变化的透视镜。该研究为理解水结冰膨胀及过冷水异常行为提供了统一科学框架，揭示了过冷水中高密度液态(HDL)与低密度液态(LDL)结构竞争是导致水反常物理特性的底层机制。"
cover: "placeholder_cover.png"
imgTop: false
---



![程序员 reaction：MicrosoftSQLServer,MongoDB](https://iili.io/CCG5adx.png)
> 当算力遇到物理极限，AI成了最好的显微镜



## 一、引言：水结冰膨胀的百年谜题

### 1.1 冰浮于水的悖论

水，作为生命之源，其物理特性在自然界中显得格格不入。绝大多数物质遵循“热胀冷缩”的规律，即固态密度大于液态，因此固体通常会沉入液体之中。然而，水却是一个彻头彻尾的叛逆者。当水温降至0摄氏度以下结冰时，其体积反而膨胀约9%，导致冰的密度低于液态水，从而能够漂浮在水面上。

这一看似简单的物理现象，背后隐藏着复杂的分子动力学机制。在过去的一个多世纪里，尽管科学家已经确认了冰晶体结构中氢键形成的四面体网络是造成体积膨胀的主要原因，但对于水在液态下、特别是过冷水状态下的微观结构演变，始终缺乏一个统一且精确的描述框架。为什么水在4摄氏度时密度最大？为什么过冷水在极低温下会表现出剧烈的性质波动？这些问题的答案，一直隐藏在微观结构的迷雾之中。

### 1.2 传统计算力学的瓶颈

要解开这个谜题，计算化学和分子动力学模拟是不可或缺的工具。传统的做法依赖于构建势能面（Potential Energy Surface, PES），通过求解薛定谔方程或经验力场来模拟水分子的运动轨迹。

然而，这种方法面临着巨大的挑战。首先，水的氢键网络具有高度的动态性和方向性，任何微小的势能面偏差都会在宏观上被放大。其次，为了获得高精度的结果，通常需要结合密度泛函理论（DFT）等高成本计算，这使得模拟时间尺度难以突破纳秒级，无法覆盖相变过程中的长程关联效应。更关键的是，现有的描述符（Descriptors）往往过于简化，无法同时捕捉水分子在局部四面体结构与长程无序结构之间的微妙平衡。



![程序员 reaction：hands-onsynergyandestablish](https://iili.io/CCZAFvS.png)
> 传统模拟就像用低分辨率相机拍微距，细节全糊了



### 1.3 AI介入：从黑盒到白盒

随着人工智能技术的发展，特别是机器学习势函数（Machine Learning Potentials, MLPs）的兴起，为这一领域带来了转机。AI模型能够以接近量子力学的精度，提供经典力学的计算效率，从而允许我们在更大的时空尺度上模拟水分子的复杂行为。

大阪大学的研究团队敏锐地抓住了这一契机。他们并没有盲目地训练一个通用的AI模型，而是采取了一种更为严谨的“逆向工程”思路：系统地评估16种不同的分子结构描述方法。这些描述方法包括原子环境描述符、对称函数、图神经网络嵌入等，每一种方法都试图从不同的数学维度去刻画水分子的局部几何特征。

通过构建一个包含不同温度、压力条件下的庞大数据集，团队利用AI模型对这些描述符进行了严格的性能测试。他们的目标非常明确：寻找一种能够最精准地反映水分子在不同相态下微观变化的“透视镜”。这种透视镜不仅要能准确预测能量和力的数值，更要能从数学结构上解释物理现象的本质。

这一研究的初步成果令人振奋。AI模型不仅成功复现了冰的晶体结构，更在模拟过冷水（Supercooled Water）时展现出了惊人的洞察力。过冷水是指温度低于0摄氏度但仍保持液态的水，它是连接液态水和冰晶体的关键过渡态，也是理解水反常性质的核心区域。通过AI模型的透视，研究人员发现，过冷水的微观结构并非均一，而是存在着两种截然不同的局部构型：高密度液态（HDL）和低密度液态（LDL）。

长期以来，水的反常特性一直是凝聚态物理和化学领域的“圣杯”级难题。水在4°C时密度最大，结冰时体积反而膨胀约9%，这使得冰能浮在水面上，从而保护了水下生物的生存。然而，传统的分子动力学模拟和量子化学计算在处理这种复杂的氢键网络动态变化时，往往面临计算量爆炸或精度不足的瓶颈。大阪大学的研究团队并没有试图直接暴力求解薛定谔方程，而是另辟蹊径，将目光投向了人工智能在结构表征上的潜力。



![程序员 reaction："THATF*CKJUSTBRAKECHECKED](https://iili.io/Cx2qspa.png)
> 传统算力硬刚物理规律，AI用特征工程降维打击



### 2.1 从黑盒预测到白盒解析

这项研究的核心突破在于，它不仅仅是一个预测模型，更是一个解释性框架。团队构建了一个基于机器学习的势能面模型，该模型能够以接近第一性原理计算的精度，模拟包含数千个水分子的宏观体系。关键在于，他们引入了一套精心设计的“结构描述符”（Structural Descriptors），这些描述符能够将水分子周围复杂的局部环境转化为AI可理解的数学向量。

传统的分子模拟往往依赖于经验力场，这些力场在特定条件下（如高温高压）容易失效。而大阪大学的AI模型通过深度学习，自动提取了水分子间相互作用的非线性特征。这意味着，当温度降低或压力改变时，AI不仅能预测水分子的位置，还能揭示出导致这些位置变化的潜在能量景观变化。这种从“黑盒”预测向“白盒”解析的转变，使得科学家能够直观地看到水分子在相变过程中的微观行为。

### 2.2 16种描述符的极限测试

为了找到最精准的“透视镜”，团队对16种不同的分子结构描述方法进行了系统性的评估和对比。这些描述符涵盖了从简单的原子距离统计到复杂的拓扑网络特征。实验结果表明，某些描述符在捕捉水分子的四面体氢键结构方面表现优异，而在描述液态水的无序结构时则显得力不从心。

最终，团队发现结合了几种关键描述符的混合模型效果最佳。这个模型能够敏锐地捕捉到水分子在过冷状态下，从无序液态向有序冰晶结构转变的临界点。通过这种高精度的结构表征，研究人员得以在原子尺度上重现水结冰的过程，并量化了不同结构模式对整体体积变化的贡献。



![AI模型结构描述符评估流程](https://iili.io/CkK04pa.png)
> AI模型结构描述符评估流程



### 3.1 过冷水中的微观博弈

在深入理解了AI模型的解析能力后，研究团队将焦点转向了过冷水（Supercooled Water）这一神秘状态。过冷水是指温度低于0°C但仍保持液态的水。在这个区间内，水分子面临着两种截然不同的结构倾向：一种是较为紧密排列的高密度液态（HDL），另一种是类似冰的开放四面体结构的低密度液态（LDL）。

AI模型的介入让这场微观层面的“博弈”变得清晰可见。研究发现，随着温度的降低，水分子中LDL结构的比例逐渐增加。当温度降至某个临界点（约-45°C）时，LDL结构开始占据主导地位。这种结构上的转变并非平滑过渡，而是一种剧烈的相变前兆。正是这种从HDL向LDL的结构重组，导致了水分子间氢键网络的重新排列，进而引发了宏观上的体积膨胀。



![程序员 reaction：andtheruntimeofyourcode](https://iili.io/CnYM3YP.png)
> 微观结构的此消彼长，决定了宏观物理性质的突变



### 3.2 结构转变与体积膨胀

传统理论认为，水结冰时的体积膨胀是由于冰晶形成了规则的六方晶系结构，分子间空隙变大。大阪大学的AI研究进一步证实了这一观点，并揭示了其在液态阶段的预演。在过冷状态下，水分子已经开始局部形成类似冰的四面体结构，但这些结构是不稳定且动态变化的。

当温度继续下降，这些局部的四面体结构开始协同增长，形成更大的LDL区域。由于LDL结构的密度远低于HDL，这种结构的扩张直接导致了整体密度的下降和体积的膨胀。AI模型成功地将这一过程量化，证明了水的反常膨胀并非偶然，而是其微观结构在低温下追求更低能量状态的必然结果。这一发现不仅解开了百年的谜题，也为开发新型抗冻材料、优化冷冻保存技术以及理解地球深层海洋的物理性质提供了坚实的理论基础。

通过这种“AI+物理”的新范式，大阪大学团队展示了解决复杂科学问题的新路径：不再单纯依赖算力的堆砌，而是通过智能的特征工程和可解释的模型架构，打开微观世界的大门。



![程序员 reaction：FRONT-END](https://iili.io/CnZ0O5N.png)
> 终于找到了能同时兼容HDL和LDL的“万能描述符”，这才是真正的特征工程天花板



在传统的物理化学认知中，水的反常膨胀一直被视为一个未解之谜，尤其是在过冷区域（Supercooled Water）。当水温降至冰点以下但仍保持液态时，其密度不再随温度降低而单调增加，反而出现异常波动。这一现象长期以来困扰着科学家们，因为现有的经典分子动力学模拟难以准确捕捉这种微观结构的剧烈变化。

大阪大学的研究团队通过引入先进的机器学习算法，成功构建了一个能够同时描述高密度液态（High-Density Liquid, HDL）和低密度液态（Low-Density Liquid, LDL）的通用框架。研究表明，过冷水并非处于单一均匀状态，而是存在两种截然不同的局部结构：一种是分子排列紧密、类似普通液体的HDL结构；另一种是分子间形成四面体氢键网络、结构较为疏松的LDL结构。这两种结构在过冷过程中相互竞争、动态转换，正是这种微观层面的“博弈”导致了宏观上密度的异常变化。



![过冷水微观结构竞争机制](https://iili.io/CkK0t4I.png)
> 过冷水微观结构竞争机制



### 4.1 双态理论的微观证据

研究团队发现，当温度进一步降低至约228K（-45°C）附近时，LDL结构的比例开始显著上升。这种结构的变化并非渐进式，而是呈现出一种临界性的突变特征。通过AI模型对16种不同描述符的测试，科学家确认了只有那些能够同时捕捉氢键取向和局部密度的描述符，才能准确预测这一相变过程。

这一发现为“液-液相变假说”（Liquid-Liquid Phase Transition, LLPT）提供了强有力的计算证据。传统观点认为水在过冷时会直接发生玻璃化转变或迅速结冰，但大阪大学的模型显示，在极低温下，水可能先经历一个从HDL主导到LDL主导的二级相变过程。在这个过程中，水分子的排列方式发生了根本性改变，导致局部体积膨胀。这种微观结构的重组，正是水结冰前密度反常增加的直接原因。

### 4.2 结构转变与体积膨胀的关联

更为关键的是，该研究揭示了结构转变与宏观体积膨胀之间的定量关系。当LDL结构在过冷水中占据主导地位时，由于四面体氢键网络的开放性，分子间的平均距离增大，从而导致整体密度下降。AI模型的预测结果与实验观测到的密度曲线高度吻合，证明了这种微观机制的正确性。

此外，研究还指出，压力的变化会显著影响HDL和LDL的平衡。高压倾向于促进HDL结构，从而抑制体积膨胀；而低压则有利于LDL结构的形成，加剧膨胀效应。这一发现不仅解释了水结冰膨胀的百年谜题，也为理解其他具有类似反常性质的液体（如硅、二氧化硅等）提供了新的视角。通过AI赋能，科学家们终于揭开了水分子在极端条件下微观演化的神秘面纱，为材料科学和地球物理学等领域带来了深远的影响。



![程序员 reaction：WHATIFTHEREWERENODISK?](https://iili.io/CCZ4u9f.png)
> 压力调控HDL/LDL平衡，这简直是流体力学的控制论教科书案例



这一突破不仅解开了困扰科学界百年的“水结冰膨胀”谜题，更将复杂的水分子动力学转化为可解释的物理图像



![程序员 reaction：status 418  status 418 5knj](https://iili.io/CCG58Xt.png)
> 终于把黑盒变成了白盒，这才是AI该有的样子



### 五、研究意义与应用前景

这项研究的深远影响远超出了基础物理学的范畴。长期以来，水作为一种极其特殊的物质，其反常性质一直是材料科学和化学工程中的难题。通过引入AI驱动的结构描述符，大阪大学团队构建了一个能够精确量化水分子局部结构的数学框架。这种框架的建立，意味着我们不再仅仅依赖经验公式来推测水的行为，而是能够从原子层面“看见”并预测其在极端条件下的相变过程。

在工业应用领域，这一发现具有极高的转化价值。首先，在冷冻保存技术方面，目前的细胞和组织冷冻往往面临冰晶刺破细胞膜的风险。通过理解水分子在过冷状态下如何形成高密度或低密度结构，科学家可以设计更高效的冷冻保护剂，抑制有害冰晶的生长，从而提高生物样本的存活率。其次，在能源存储领域，燃料电池中的质子传导机制与水分子的氢键网络密切相关。精准的微观结构描述有助于优化电极材料的设计，提升能量转换效率。此外，对于气候模型而言，大气中云滴的形成和降水过程都涉及水的相变。改进对水分子微观行为的理解，有望提高全球气候模拟的精度，特别是在极地冰盖融化和海洋环流模型的参数化设置上。



![16种结构描述符](https://iili.io/CkK1Ba9.png)
> 16种结构描述符



### 六、结语

水结冰时体积膨胀约9%，这一看似简单的物理现象背后，隐藏着复杂的分子间相互作用和量子效应。大阪大学的这项研究，通过AI技术将原本混沌无序的水分子运动梳理成清晰的逻辑链条，证明了人工智能不仅是处理数据的工具，更是探索自然规律的新透镜。从黑盒预测走向白盒解析，这不仅是对水科学的贡献，更是计算科学与物理学深度融合的典范。未来，随着更多类似AI模型的应用，人类有望揭开更多自然界中“反常”现象的神秘面纱，推动材料、能源和生命科学进入一个全新的认知时代。



![程序员 reaction：Evenifmyscreenisoff](https://iili.io/Cn3lGTB.png)
> 这一段聊一、引言：水结冰膨胀的百年谜题，面试官开始看你工程感了



## 参考文献
[1] Start the PATROL SNMP subagent automatically - BMC .... https://docs.bmc.com/xwiki/bin/view/IT-Operations-Management/Operations-Management/BMC-PATROL-Agent-for-BMC-Helix-Operations-Management/PABHOM261/Using/SNMP-configuration-and-implementation-using-PEM/Configuring-the-SNMP-subagent-and-the-PATROL-Agent/Start-the-PATROL-SNMP-subagent-automatically
[2] Start the PATROL SNMP subagent automatically. https://docs.bmc.com/xwiki/bin/view/IT-Operations-Management/Operations-Management/BMC-PATROL-Agent/PA221/Using/SNMP-configuration-and-implementation-using-PEM/Configuring-the-SNMP-subagent-and-the-PATROL-Agent/Start-the-PATROL-SNMP-subagent-automatically
[3] Application Developer's Guide. https://cdck-file-uploads-us1.s3.dualstack.us-west-2.amazonaws.com/flex025/uploads/sierrawireless/original/2X/6/647cebe8e243478410a33f4781360360fc8e88f8.pdf
[4] Start the Agent. https://techdocs.broadcom.com/us/en/ca-enterprise-software/intelligent-automation/workload-automation-system-agent/12-1/configuring/control-the-agent/start-the-agent.html
[5] Variables for configuring the PATROL Agent - BMC Helix Documentation. https://docs.helixops.ai/bin/IT-Operations-Management/Operations-Management/BMC-PATROL-Agent/pia9500/Integrating/BMC-PATROL-Agent-and-SNMP-concepts/SNMP-roles-available-to-the-PATROL-Agent/Variables-for-configuring-the-PATROL-Agent
[6] Audit Vault Agent Auto Start Configuration. https://docs.oracle.com/en/database/oracle/audit-vault-database-firewall/20/sigad/audit-vault-agent-auto-start-configuration.html
[7] PATROL Agent | Monitors and Metrics. https://itmonitoring.wordpress.com/category/patrol-agent
[8] SNMP variables - BMC Helix Documentation. https://docs.helixops.ai/bin/IT-Operations-Management/Operations-Management/BMC-PATROL-Agent/pia100/Key-concepts/Configuration-variables/SNMP-variables
