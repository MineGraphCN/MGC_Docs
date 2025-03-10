# 光影 技术科普

<primary-label ref="adv"/>

<secondary-label ref="latest"/>
<secondary-label ref="shader"/>
<secondary-label ref="rt"/>

<show-structure depth="3" for="chapter,def"/>

<tldr>

这里罗列了在着色器中使用的各种技术的原理。

> 本文不涉及算法层面的解释。
> 
{style="note"}
</tldr>

<var name="topic" value="着色器应用技术的解释"/>
<var name="goal" value="不了解其基本概念"/>
<var name="target_name" value=""/>
<var name="target_topic" value="shaderBasic.md"/>
<var name="target_description" value=""/>
<include from="uniforms.md" element-id="h_note_readingTips"/>

[//]: # (TODO)

[//]: # (## 纹理映射（贴图）)

[//]: # (### 纹理过滤)

[//]: # (## 基本光照)

[//]: # (### 顶点光照)

[//]: # (### 像素光照)

[//]: # (## 阴影)

[//]: # (### 软阴影)

[//]: # (## 反射)

[//]: # (### 高光纹理)

[//]: # (## 高级光照)

[//]: # (### 法线纹理)

[//]: # (### PBR)

[//]: # (## 视差)

[//]: # (## HDR)

[//]: # (## SSBO <iris>)

## 全局光照 {id="gi"}

**<tooltip term="GI">GI</tooltip>**，表现了直接光照和间接光照的综合效果，但在渲染中，全局光照通常仅包括间接光照。它有多种实现方法，例如辐照度、光线追踪、光子贴图、光照探针等。

当光从光源被发射出来后，碰到障碍物就反射和折射，经过无数次的反射和折射，物体表面和角落都会有光感，就产生真实的光照效果。

全局光照的开销通常很大。渲染带有光线追踪全局光照效果的图片，耗时会较长（取决于场景复杂度）。渲染静态图片可以接受这较长的耗时，但渲染视频或者应用到游戏时，要求的渲染时间就要严格很多，于是便有了各种光栅拟合算法。

<deflist>
<def title="反射阴影贴图" id="rsm">

**<tooltip term="RSM">RSM</tooltip>**，原理为根据 [着色点](terms.md#着色目标){summary=""} 的表面法线在**颜色阴影纹理**（从光源视角记录的带表面颜色的纹理）上反弹 [采样点](terms.md#采样目标){summary=""} ，并将采样到的位置视为一个光源并照亮着色点。

RSM 的缺陷也很明显，它不会考虑遮挡，一旦它在阴影纹理上找到了对应的“光源”，那么该位置就会被照亮，即使它在狭小的空间中，因此 RSM 通常会配合 [](#AO){summary=""} 使用。
</def>
</deflist>

<tabs>
<tab title="无">

![无 GI](GI_NONE.png "无GI")
</tab>
<tab title="RSM">

![RSM](GI_RSM.png "RSM")
</tab>
<tab title="条文对比">

- 无全局光照，没有被阳光照射的地方漆黑一片。

  ![无 GI](GI_NONE.png "无GI"){thumbnail="true"}

- RSM 全局光照，矿洞被打在墙壁上的光线照亮了。

  ![RSM](GI_RSM.png "RSM"){thumbnail="true"}

</tab>
</tabs>

<tip>

自 iterationT 0.16.1（2.0.0 之后不久的开发版）开始，它的 RSM 算法一直都有问题 <sup><b>1</b></sup> ，直到 iterationT Beta 3.1.07 才修复。

**[1]** 在错误的 [空间](terms.md#坐标系 "在着色器中基于不同坐标系即称为不同空间，通过矩阵可以在不同坐标系之间转换。") 中计算，而其算法基于 Continuum，这也意味着 Continuum 的 RSM 全局光照在那时也有问题，如今也已修复。

<tabs group="rsmfix">
<tab title="修复前" group-key="before">

![修复前的 RSM 在仅 GI 光照下的样子](itt_RSM_before.png "修复前的RSM在仅GI光照下的样子"){thumbnail="true"}

![修复前的 RSM 在实际游戏中的样子](itt_RSM_before_2.png "修复前的RSM在实际游戏中的样子"){thumbnail="true"}

</tab>
<tab title="修复后" group-key="after">

![修复后的 RSM 在仅 GI 光照下的样子](itt_RSM_after.png "修复后的RSM在仅GI光照下的样子"){thumbnail="true"}

![修复后的 RSM 在实际游戏中的样子](itt_RSM_after_2.png "修复后的RSM在实际游戏中的样子"){thumbnail="true"}

</tab>
</tabs>
<tabs group="rsmfix">
<tab title="修复前" group-key="before">
</tab>
<tab title="修复后" group-key="after">
</tab>
</tabs>
</tip>

> 参考资料：[【论文复现】Reflective Shadow Maps](https://zhuanlan.zhihu.com/p/357259069)

<deflist>
<def title="辐照传播体积" id="lpv">

**<tooltip term="LPV">LPV</tooltip>**，是 CryEngine 3 提出的一种实时的、无需任何预计算的全局光照技术，其创造性地提出了使用体素来存储、传播间接光照的方法。

LPV 首先将整个场景划分为体素，将整个场景离散开来（对 Minecraft 来说可以说是天然优势），每一个格子的光照就是其他格子光照乘以贡献的总和，最终形成一个庞大的**多项式**。  
直接求解每个格子内的光照是不现实的，解决方法是让光照像墨滴一样在这些格子中弥散、传播，从而在时域上求解间接光照。

你可以将它视为一种**以体素为精度的光线追踪**。

</def>
</deflist>

> _Cody Darr_ 曾经发布过一个 SEUS 的测试版 [SEUS LPVGI](https://www.patreon.com/posts/seus-lpvgi-e1-20122720 "Patreon，可能需要代理") ，但是我们发现如今这个光影已经无法在新驱动上运行；  
> 在 _GeForceLegend_ 检查代码之后，发现其中使用了很多的 `mod(float, int)` ，这在自帕斯卡架构开始的显卡上会出现异常。
> 
> 要想修复这个问题，我们只需要在传入 `mod()` 时将其第二个参数 `B` 显式转换为 `float` 类型即可：
> <br/><br/>
> <compare>
> 
> ```glsl
> float A;
> int B;
> [...];
> mod(A, B);
> ```
> ```glsl
> float A;
> int B;
> [...];
> mod(A, float(B));
>        ^^^^^^ ^
> ```
> </compare>

<tabs>
<tab title="无">

![无 GI](GI_NONE_2.png "无GI")
</tab>
<tab title="RSM + SSAO">

![RSM](GI_RSM_2.png "RSM")
</tab>
<tab title="LPV">

![LPV](GI_LPV.png "LPV")
</tab>
<tab title="条文对比">

- 无全局光照，周围的环境只有天空颜色。

  ![无 GI](GI_NONE_2.png "无GI"){thumbnail="true"}

- RSM 全局光照 + SSAO，环境染上了品红色混凝土的颜色，但右侧近处的石头上有明显的伪影，左侧靠得更近的石头颜色反而不明显。

  ![RSM](GI_RSM_2.png "RSM"){thumbnail="true"}

- LPV 全局光照，环境更加准确地染上了颜色。

  ![LPV](GI_LPV.png "LPV"){thumbnail="true"}

</tab>
</tabs>


> 参考资料：[Light Propagation Volumes](https://zhuanlan.zhihu.com/p/412287249)

<deflist>
<def title="路径（光线）追踪全局光照" id="pt">

**<tooltip term="PT">PT</tooltip>GI**，使用路径追踪算法进行光照计算，在 Minecraft（包括基岩版光线追踪）中，常辅以 LPV。相比单独的 LPV 拥有更好的效果。
</def>
</deflist>

> 室内场景为了突出场景暗部，已进行了加强曝光处理。
> 
{style="note"}

<tabs group="VX">
<tab title="RSM + SSAO" group-key="RSM">

![RSM](GI_RSM_4.png "RSM")

![RSM](GI_RSM_3.png "RSM")

</tab>
<tab title="LPV" group-key="LPV">

![LPV](GI_LPV_2.png "LPV")

> 由于 LPVGI 在高版本无法正常运行，这里只列出一张图片。
>
{style="note"}

</tab>
<tab title="体素光追" group-key="VX">

![体素光追](GI_VXGI_2.png "体素光追")

![体素光追](GI_VXGI.png "体素光追")

</tab>
<tab title="条文对比" group-key="Compare">

- RSM 全局光照 + <tooltip term="SSAO">SSAO</tooltip>：
  - 受原版光照和伪影影响，这个场景显得非常脏。
  
    ![RSM](GI_RSM_4.png "RSM"){thumbnail="true"}

  - 被遮挡的场景也一股脑全亮了。

    ![RSM 全局光照](GI_RSM_3.png "RSM全局光照"){thumbnail="true"}

- LPV 全局光照，受辐照体积限制，顶部露天区域的两侧看起来像是漏光了。

  ![LPV](GI_LPV_2.png "LPV"){thumbnail="true"}
  > 这张图片中没有使用任何 <tooltip term="AO">AO</tooltip>，墙角产生的阴影全都来源于 LPV 的特性。
  > 
  {style="note"} 

- 基于体素的光线追踪全局光照：
  - 产生了更加干净准确的照明。

    ![体素光追](GI_VXGI_2.png "体素光追"){thumbnail="true"}

  - 可以注意到地毯和楼梯在床上投下了相对窗户这个间接光源位置的准确阴影。

    ![体素光追全局光照](GI_VXGI.png "体素光追全局光照"){thumbnail="true"}

</tab>
</tabs>

<tabs group="VX">
<tab title="RSM + SSAO" group-key="RSM">
</tab>
<tab title="体素光追" group-key="VX">
</tab>
<tab title="条文对比" group-key="Compare">
</tab>
</tabs>

> - 受限于 OptiFine 架构，如今的 Java 版光线追踪光影均需要手动存储场景信息，并混合使用 LPV 和 PT。
> - 使用体素不代表我们只能按方块追踪所有物体，我们可以定义每个体素的形状，从而产生符合形状的阴影。

> 参考资料：[Voxel Global Illumination 体素全局光照（一）](https://zhuanlan.zhihu.com/p/414691569)

## 环境光遮蔽 {id="AO"}

**<tooltip term="AO">AO</tooltip>**，是一种广泛用于现代游戏渲染的图形技术，其算力消耗相对较少的同时能带来非常大的画面观感改进，其模拟了现实世界中光线在物体的凹角和接缝中产生阴影的现象。

在现实中，当光线到达物体的凹角和接缝时，由于空间被物体阻挡，光线无法充分照射到一些区域，导致这些区域相对较暗，形成阴影。

在没有环境光遮蔽的情况下，画面看起来像是被均匀的强光照亮，没有阴影和深度。详情可以参考在 Minecraft 中关闭 `平滑光照` 效果后的一些表现，很多手游也缺失此效果，导致画面显得非常扁平。

目前在 Java 版的光影中主要使用 SSAO，也是游戏界使用最多的环境光遮蔽技术。

<deflist>
<def title="屏幕空间环境光遮蔽" id="ssao">

**<tooltip term="SSAO">SSAO</tooltip>**，是目前业界内应用最广泛的环境光遮蔽技术。SSAO 通过分析场景中各个像素点周围的几何信息来计算该像素点处的遮蔽程度。其计算效率最高，但相对不够精确。

目前常用的除了 SSAO，还有 <tooltip term="HBAO">HBAO（或 HBAO+）</tooltip>（水平基准环境光遮蔽）和 <tooltip term="GTAO">GTAO</tooltip>（基准真值环境光遮蔽）。SSAO、HBAO、GTAO 逐级基于前者改进，能产生更加准确的遮蔽阴影。
</def>
</deflist>

图片来自 _Tahnass_ 。
<tabs>
<tab title="无">

![无 AO](AO_NONE.png "无AO")

</tab>
<tab title="SSAO">

![SSAO](AO_SSAO.png "SSAO")

</tab>
<tab title="GTAO">

![GTAO](AO_GTAO.png "GTAO")

</tab>
<tab title="条文对比">


- **没有 AO**，场景的纵深感弱，近处栅栏看起来像悬空的。图中的明暗关系由原版天空光照和全局光照共同产生。

  ![无 AO](AO_NONE.png "无AO"){thumbnail="true"}

- **SSAO**，注意房屋窗户的栅栏和村民周围，室内的光线更加昏暗，近处的栅栏也产生了阴影，产生了纵深感。

  ![SSAO](AO_SSAO.png "SSAO"){thumbnail="true"}

- **GTAO**，注意村民周围阴影与 SSAO 的区别，暗角的过渡更加均匀，近处的栅栏产生的阴影不再紧贴着横杆，其他狭缝中的阴影也更加浓厚。

  ![GTAO](AO_GTAO.png "GTAO"){thumbnail="true"}

</tab>
</tabs>

路径（光线）追踪环境光遮蔽 {id="rtao"}
: **<tooltip term="RTAO">RTAO</tooltip>**，通过光线追踪仅计算 AO，效果最好的同时性能消耗要比光线追踪全局光照低（但在 AO 中开销仍是最高）。

> 在光线追踪间接光照效果相对完整的一些光影或游戏中，其通常不会单独列出，而是作为流程中的一种自然产物。

## 抗锯齿／升采样 {id="AA"}

### 走样现象

**Aliasing**，是由于渲染过程中**采样不足**而引起的，也被称为**走样**。在游戏渲染中，主要会遇到两种类型的走样，分别是几何走样和着色走样。

- 几何走样（Geometric Aliasing）是由于光栅化过程中对**几何图形边缘**的采样不足而导致的，也就是我们通常所说的**锯齿**。现代屏幕由像素组成，像素的本质是一个个离散的小方格，因此当尝试表示连续的斜线或曲线时，就会出现锯齿状的走样，使得图形边缘看起来不平滑。
- 着色走样（Shading Aliasing）是由于渲染过程中的**采样数不足**而引起的。例如在体积渲染中，如果采样数较低，就会导致体积雾和体积云等效果出现**闪烁和噪点**，一些光线追踪光影也会在处理光照时出现这些现象。

由于抗锯齿技术在现代也身负减少着色走样的使命，相较于“抗锯齿”，Anti-Aliasing 更准确的翻译应该叫 *抗走样* 或 _反走样_ 。

### 空间抗锯齿

空间抗锯齿技术是针对几何走样问题的传统解决方案。由于其实现方式，通常会造成不可忽视的性能损耗，同时**对于着色走样问题几乎无效**，因此在目前的游戏中，单独的空间抗锯齿技术已不多见。

比较主流的空间抗锯齿技术有 FXAA、MSAA、SMAA 等，在 Java 版中，OptiFine 内置实现了兼容光影的 FXAA 和不兼容光影的 MSAA。

> 以下效果评判仅针对几何走样问题。
> 
{style="note"}

<deflist>
<def title="快速近似抗锯齿" id="fxaa">

**<tooltip term="FXAA">FXAA</tooltip>**，通过简单的卷积混合颜色来减少锯齿。

其优势在于性能消耗极低，效果在大多数时候都可以接受，但其建立在对画面所有图形边缘进行无差别柔化处理的基础上，导致观感模糊。

FXAA 是一种后处理抗锯齿。
</def>
<def title="多重采样抗锯齿" id="msaa">

**<tooltip term="MSAA">MSAA</tooltip>**，属于 **<tooltip term="SSAA">SSAA</tooltip>**（超级采样抗锯齿）的性能改进版。SSAA 直接将整个画面以更高分辨率渲染再降采样到画面，而 MSAA 则仅对图形边缘进行处理。

MSAA 由硬件执行，性能消耗最高（取决于采样倍率），效果也最好（非常鲁莽的实现，仅针对几何走样）。

其最大的问题是，原生的 MSAA [与延迟渲染不兼容](shaderBasic.md#延迟渲染法){summary=""}，因此很多游戏无法使用。

> 在《未转变者》的老版本中，MSAA 可以在画面设置为向前渲染时启用；  
> 在《反恐精英2》中，由于后处理管线没有使用几何信息，因此也可以启用 MSAA。

MSAA 是一种 [](shaderBasic.md#向前渲染法){summary=""} 抗锯齿。
</def>
<def title="子像素增强抗锯齿" id="smaa">

**<tooltip term="SMAA">SMAA</tooltip>**，是 **<tooltip term="MLAA">MLAA</tooltip>**（形态学抗锯齿）的改进版。MLAA 通过分析图形边缘然后进行平滑处理，SMAA 则在此之上进一步发展，使得图像更清晰。

其性能消耗比 MSAA 低得多，接近 FXAA 的水平，而效果却比 FXAA 更好。

由于其算法特性，当物体移动时可能会产生闪烁。

SMAA 是一种后处理抗锯齿。

> 类似 MLAA 的算法还有 <tooltip term="CMAA">CMAA</tooltip>（保守形态抗锯齿），其第二代版本（CMAA2）在《反恐精英2》中发光发热。
</def>
</deflist>

### 时域抗锯齿 {id="taa"}

时域抗锯齿通常指 **<tooltip term="TAA">TAA</tooltip>**。其原理是在时间上分散采样点，然后将当前帧的渲染结果与前一帧进行比较，以确定物体的运动和变化，之后进行混合以平滑图像并减少锯齿。

不同于空间抗锯齿的边缘检测处理，时域抗锯齿使用在多个帧之间进行信息累积和混合的方案。是现代游戏中运用最多的抗锯齿技术类型。

其性能要比 MSAA 好得多，而且能**在一定程度上解决着色走样**。但是由于其时间性，不可避免地会在运动场景中产生拖影和模糊，如果抗锯齿参数不够优秀，还会造成明显的抖动感。

TAA 是一种在向前渲染进行抖动，并在后处理进行平滑的抗锯齿。

> - 在 Java 版中，几乎所有现代光影都使用 TAA 或混合使用 TAA 和 FXAA。
> - 时域抗锯齿通常也会混合空间算法，将抗锯齿的上升到时空域，比如 **Filmic SMAA T2X**，它不仅拥有 SMAA 的优秀性能，还解决了 SMAA 的闪烁问题。

<tabs>
<tab title="无">

![无抗锯齿](AA_NONE.png "无抗锯齿")

</tab>
<tab title="FXAA">

![FXAA](AA_FXAA.png "FXAA")

</tab>
<tab title="SSAA">

![SSAA](AA_SSAA.png "SSAA")

</tab>
<tab title="TAA">

![TAA](AA_TAA.png "TAA")

</tab>
<tab title="TAA + FXAA">

![TAA + FXAA](AA_TAA_FXAA.png "TAA+FXAA")

</tab>
<tab title="条文对比">

- 无抗锯齿，几何走样和着色走样都很明显。

  ![无抗锯齿](AA_NONE.png "无抗锯齿"){thumbnail="true"}

- 光影内置的 FXAA，解决了部分几何走样的锯齿，几乎不损耗性能。

  ![FXAA](AA_FXAA.png "FXAA"){thumbnail="true"}

- 利用 OptiFine 提供的渲染精细度实现的 SSAA 2X，效果极佳，但是性能损耗极大。

  ![SSAA](AA_SSAA.png "SSAA"){thumbnail="true"}

- 光影内置的 TAA，效果和 SSAA 相当，但是几乎不损耗性能，且消除了着色走样。注意：它没有对实体进行抗锯齿（此光影防止拖影刻意为之，其他光影不一定）。

  ![TAA](AA_TAA.png "TAA"){thumbnail="true"}

- 将光影的 TAA 和 FXAA 全部启用，实体的几何走样和着色走样都消除了，且性能几乎不损耗。

  ![TAA + FXAA](AA_TAA_FXAA.png "TAA+FXAA"){thumbnail="true"}

</tab>
</tabs>

### 升采样

**Up-sampling**，是一种增加图像分辨率的技术，也分为空间升采样和时域升采样。现代的升采样技术一般用于先降低渲染分辨率，将效果处理完毕后再提升到原始分辨率，来提升性能。

<deflist>
<def title="DLSS" id="dlss">

**<tooltip term="DLSS">深度学习超级采样</tooltip>**，由 *英伟达* 开发的一种升采样技术。通过降低分辨率并调用显卡 <sup>NVIDIA</sup> 的<tooltip term="TCore">**张量核心**</tooltip>来猜测原始分辨率下该处像素的内容。
- 在 2.0 以前，DLSS 主要是靠已有画面内容来“猜”剩下的场景应该是何样。
- 自 2.0 开始，DLSS 主要是根据场景运动信息和历史帧来判断剩下的场景是何样，其计算方法从单一的空间域上升到了**时空域**，不再依赖于针对单个游戏的训练，效果也比 1.0 好得多。
<deflist>
<def title="DLAA" id="dlaa">

**<tooltip term="DLAA">深度学习抗锯齿</tooltip>**，在**原始分辨率**下进行 DLSS 来平滑边缘的抗锯齿方法。
</def>
</deflist>
</def>

<def title="FSR" id="fsr">

**<tooltip term="FSR">FidelityFX 超级分辨率</tooltip>**，由 *AMD* 开发的一种升采样技术。相比较 DLSS 来说更为常规，但效果要比其他传统升采样方法好。
</def>

<def title="XeSS" id="xess">

**<tooltip term="XeSS">Xe 超级采样</tooltip>**，由 *英特尔* 开发的一种升采样技术。在其他平台上和其本家含有特定核心的平台上所使用的算法有所区别，因而在其本家平台上能够获得更好的效果。
</def>
</deflist>

- 单独的空间升采样如今已经几乎不使用了，曾经的 FSR 1.0 和 DLSS 1.0 都是空间升采样。
  - FSR 1.0 只是通过缩放、插值和锐化来试图还原，造成较为强烈的涂抹感；
  - DLSS 1.0 虽然利用了 AI，但其需要针对每个游戏进行训练，泛用性差，且质量较低。
    - 除了 DLSS，英伟达还有一个类似 FSR 的通用算法 <tooltip term="NIS">NIS</tooltip>，其也是一种自适应锐化和空间升采样技术。
- 时域升采样一般伴随着抗锯齿进行，如 TAAU、DLSS 2.0 和 FSR 2.0 等。在 Java 版的一些光影中实现了 TAAU。
- TAAU 基于 TAA 而实现，多帧信息不仅用于抗锯齿，还用于提高图像分辨率。SEUS PTGI 所用的 <tooltip term="HRR">HRR</tooltip>（半分辨率渲染）也是类似原理。

<tabs>
<tab title="原生分辨率">

![原生画面](TAAU_OFF_100P.png "原生画面")

</tab>
<tab title="50% 渲染分辨率">

![50% 分辨率画面](TAAU_OFF_50P.png "50%分辨率画面")

</tab>
<tab title="50% TAAU">

![50% 分辨率 + TAAU](TAAU_ON_50P.png "50%分辨率+TAAU")

</tab>
<tab title="条文对比">

- 原生分辨率图像，画面清晰，但性能较差。

  ![原生画面](TAAU_OFF_100P.png "原生画面"){thumbnail="true"}

- 50% 渲染分辨率，禁用 TAAU，性能最好，但画面模糊。

  ![50% 分辨率画面](TAAU_OFF_50P.png "50%分辨率画面"){thumbnail="true"}

- 50% 渲染分辨率，使用 TAAU 重建到原生分辨率，性能和画质平衡。

  ![50% 分辨率 + TAAU](TAAU_ON_50P.png "50%分辨率+TAAU"){thumbnail="true"}

</tab>
</tabs>

这是 SEUS PTGI HRR 2.1 GFME 降噪和升采样（TAAU + FXAA）前后的差异，由于其是点对点地降采样，因此 TAAU 处理效果更为明显：

![升采样差异](AA_differ.png "升采样前后差异"){thumbnail="true"}

[//]: # (## 体素化和距离场)

## 光线追踪在渲染技术中的应用

> 我们在此讨论的是相对狭义的光线追踪技术应用，即大众所认知的 [世界空间光线追踪](rayTracing.md#fullRT){summary=""} 。如果严格按照光线追踪渲染流程来评判，那么类似于屏幕空间反射等技术也属于光线追踪（ [](rayTracing.md#sst) ）范畴。
>
{style="warning"}

在 Java 版中，我们主要使用 [路径追踪](terms.md#路径追踪 "使用蒙特卡洛随机采样并模拟光子多次反弹，经由漫反射、镜面反射、折射等直到达到退出条件所最终产生的光照。") 。在此之前的光影，考虑到 Minecraft 游戏过程的动态性和一些算法限制，没办法像其他游戏一样使用预烘焙等类似技术来改善光栅化渲染。例如光源仅能按照原版的发光机制来单色发光；反射面完全无法反射屏幕外的物体（天空除外，它们通常由光影进行处理）等。  
因此，在 Java 版的传统光栅光影中，效果相比其他光栅化游戏显得较为逊色，而光线追踪的实现为 Java 版带来了光影效果的重大革新。

SEUS 光影作者 _Cody Darr_ 在 2018 年 2 月发布了最早的 Java 版体素化实时光线追踪实现，这甚至**早于 RTX 显卡的发布**。  
其原理是将原本用于存储阴影的 `shadowcolor<0/1>` 缓冲区通过几何着色器来记录场景体素，不过这也导致了体素记录距离与阴影分辨率直接挂钩（每个像素记录一个方块信息）。

由于体素化信息不方便存储实体，自 **PTGI E3** 开始，其将部分分辨率用于了传统光栅阴影映射，这极大限制了光线追踪的最大距离。使用 `16384` 这样的极限阴影分辨率，才能支持相对远距离的光线追踪，而这几乎必然会导致性能和显存两开花，如今仍有很多光影在尝试突破这些难关。

> 在原始版本上，PTGI 的体素分布并不能兼容除 `4096` 外的分辨率，修改阴影分辨率将导致体素信息出错。
> 
> GFME 修改了其算法，让其可以随阴影分辨率动态地分布体素，从而在扩展阴影贴图之后可以获得更大的追踪范围。
> 
> 在 _Cody Darr_ [最近（存疑）的日志](https://www.patreon.com/posts/creative-and-84935136 "Patreon，可能需要代理")中提到，PTGI 的下一个版本将改为使用稀疏数据结构存储场景信息，这样不仅能突破体素距离限制，同时还存储实体信息。但是这篇文章距今已过去一年，而 PTGI 的下一个版本仍是遥遥无期。
> 
> Rethinking Voxels 使用了相对高精度的距离场而不是体素，虽然不能获取实体的纹理信息，但是可以将场景中的几何信息悉数保存，配合上 Iris 的独占特性光源信息，可以兼容（几何上的）几乎任何模组。

由于使用的是 OpenGL，Java 版光线追踪**无法调用光线追踪加速硬件**。光影作者们的应对方法是使用**辐照度缓存**来优化计算量，同时采用 **<tooltip term="SVGF">SVGF</tooltip>** 进行降噪处理。
- 辐照度（在此类场景中也可称为**照度**，即光学单位 $\text{lux}$；在渲染方程的能量传输语境中，辐照度的单位是 $\text{W}/\text{m}^2$）缓存通过时域求解多项式缓存场景的粗略照明信息。在渲染时对这些数据进行插值，与光线追踪结果相互影响，避免对大量光子进行多次反弹求交。
- SVGF 的作用是结合时间和空间上的信息对画面进行降噪。利用过去几帧的深度、颜色、法线信息，并加入计算权重，以此估计当前像素区域样本分布的方差，据此进行空间过滤，最终达到降噪目的。
- 不过上述过程会导致暗光下发生闪烁、拖影和纹理细节损失等问题，这也是目前必须妥协的问题。

此外，有时我们还能在一些光影中见到 [](rayTracing.md#sst) ，当它们与体素光追混合使用时，可以缓解一些非完整方块的体素形态问题（例如半砖在体素中的形态是完整方块或者直接被忽略时）。

截止到目前，**Vulkanite** 为光影引入了 **Vulkan**，解决了诸多技术问题，并支持调用**光线追踪加速单元（RT Core）**来提升性能。但**该模组本身的完成度仍是个问题，因此目前难以依赖**。  
**Focal** 也完成了 Fabric 和 Forge 版的统一，提高模组兼容性并开始专注于 **Focal _<tooltip term="VK">VK</tooltip>_** 的开发。

在上文中，我们已经展示了光线追踪如何影响全局光照，这里我们再给出一些光线追踪的优势示例。
- 反射视野外的物体
  <tabs group="ss_rt">
  <tab title="屏幕空间反射" group-key="ss">
  
  ![屏幕空间反射](Ref_SS.png "屏幕空间反射")
  
  </tab>
  <tab title="光线追踪反射" group-key="rt">
  
  ![光线追踪反射](Ref_PT.png "光线追踪反射")
  > 在这张图中，你可以发现铁块近处的地面比旁边更亮，这就是由于铁块表面光滑，反射太阳光形成了 [焦散](terms.md#焦散){summary=""} 。

  </tab>
  </tabs>

- 精确方块光源
  <tabs group="ss_rt">
  <tab title="原版方块光源" group-key="ss">
  
  ![原版光源特性](BL_Vanilla.png "原版光源")
  
  </tab>
  <tab title="光线追踪方块光源" group-key="rt">
    
  ![光线追踪光源特性](BL_PT.png "光线追踪光源")
    
  </tab>
  </tabs>

除此之外，光线追踪还有折射、焦散、阴影和更好的 PBR 特性支持等功能，不过对画面的贡献相对更小，或者是很少有在 Java 版实现，因此不做另外展示。

## 技术发展与理解误区

随着硬件的不断发展，现代游戏的模型面数与日俱增，同时纹理质量也在持续提升。在这种情况下，空间抗锯齿技术想要解决由于多边形边缘增多而带来的更多画面锯齿问题，需要消耗的性能将会成倍提升（现代硬件甚至仍无法完全驾驭当年一些游戏的 MSAA 8X）。  
另外，随着实时渲染技术的发展，逐渐出现了着色走样的问题，而**空间抗锯齿技术专注于处理图形边缘锯齿**，对于着色走样带来的闪烁和噪点问题几乎无能为力。因此，**时域抗锯齿技术在现代游戏中几乎是不可或缺的**。

然而，总有人因为时域抗锯齿带来的拖影与模糊问题，而认为这是游戏厂商懈怠优化所带来的，他们忽视了技术和硬件提升所带来的全新挑战。**时域抗锯齿技术的应用是现代实时渲染技术发展的必然趋势，我们不能只仰慕以前游戏画面那种清晰锐利的风格，而忽视了当时渲染技术的落后性**。  
还有人认为着色走样也是如此，然而**着色走样**问题实际上是现代实时渲染流程中所**无法完全避免**的：
- 为了一些效果的物理准确性，一些涉及**积分**的算法从**离线渲染的影视领域**逐渐过渡到**实时渲染的游戏领域**。
- 一些积分是**没有解析解**的，这意味着只能使用**蒙特卡洛积分法**进行计算。
  > 所谓蒙特卡洛积分法可以简单地理解为在积分区域内随机采样然后相加。
- 如果将采样集中到**单帧**上，那么实时渲染要求的**帧率几乎不可能达标**，于是只能退而求其次，将采样分布到时域上，每次在积分区域内选取随机的采样点。
- 最终将每次采样的贡献进行**求和**，就可以*近似求解积分*结果，因此现代着色方法常有噪点，特别是涉及到**粗糙度**和**光源体积**时。

当然也存在一些取巧的解决办法：例如预烘焙方案，在制作团队的电脑上离线烘焙好场景中的一切信息，用空间换时间。但现代游戏大量的动态场景已经导致其不再广泛适用；或者就是直接放弃新技术，不过有人真的希望在现代游戏中看到一些古早妥协的产物吗？

<seealso>
  <category ref="related">
    <a href="shaderBasic.md" summary="着色器的基本概念和它们与 Minecraft 的历史">着色器 基本概念和轶事</a>
    <a href="terms.md" anchor="渲染技术相关" summary="总结了一些常用渲染技术大方向的术语">术语表 - 渲染技术相关</a>
  </category>
</seealso>
