# 资源包 基本概念

<primary-label ref="basic"/>

<secondary-label ref="resourceDoc"/>

<show-structure depth="2"/>

## 称谓 {id="whyrp"}

<primary-label ref="important"/>

贴图、纹理和材质：

<deflist>
<def title="纹理" id="纹理">

**Texture**，一张 [位图](terms.md#位图){summary=""} 就是一张纹理。
</def>
<def title="贴图" id="贴图">

**Map**，当一张纹理通过纹理坐标映射到模型上之后，它就变成了贴图。
</def>
<def title="材质" id="材质">

**Material**，在图形学中这用于描述物体的属性，如金属性、光滑度、自发光强度等。

</def>
</deflist>

资源包、纹理包和材质包：

<deflist>
<def title="纹理包" id="纹理包">

**Texture Pack**，是 **JE 1.6.1** 以前所使用的用于自定义游戏**纹理**的文件包的**正确译名**。
</def>
<def title="材质包" id="材质包">

Texture Pack 的**错误译名**。

在英文语境中，**材质**所对应的英文单词为 *Material*。**纹理**所对应的英文单词 *Texture* 才是用于描述物体表面颜色的单词。

截至 **JE 1.6** 纹理包被资源包所替代时，这个译名在游戏内仍旧没有修改，于是此翻译便流传了下来，并**逐渐波及相关领域**，现在 [Minecraft 中文 Wiki](https://zh.minecraft.wiki/w/%E7%BA%B9%E7%90%86%E5%8C%85) 已经将此翻译纠正，希望大家以后尽量**使用正确的译名**。
</def>
<def title="资源包" id="资源包">

**Resource Pack**，是 **JE 1.6.1** 及以后使用的用于自定义游戏的**纹理**、**声音**、**模型**，乃至**渲染**的文件包。

</def>
</deflist>

> 在本文中，我们将会全程使用**资源包**。
> 
{style="note"}

## 何谓资源包？ {id="what_sResourcepack"}

纹理包出现于 **JE _Alpha_ v1.2.2** ，其目的很简单，让玩家能更方便地自定义纹理，而不再需要手动去替换游戏打包内置的文件。

自 **JE 1.6.1** 起，资源包接替了纹理包的工作。资源包顾名思义，包含了游戏中所调用的几乎全部资源，包括**纹理**、**音频**、**部分原版着色器**和**模型**以及**方块状态与模型的关系**，**模型如何调用纹理**等。

因此，光影可以视为一种特化的资源包。

## 资源包分辨率 {id="资源包分辨率"}

参阅：[术语表 - 分辨率](terms.md#分辨率 "分辨率是表征位图大小的参数。")

很多资源包名中会附带有一个标注，通常是类似 *32x*、*256x*、*2k* 这样的数字+字母格式。
这是资源包纹理的**分辨率**，这里对资源包中的分辨率稍作解释：

资源包中的纹理通常为**正方形**，在**动态纹理纹理**中，纵向分辨率是横向分辨率的**整数倍**。这使得纹理的分辨率标注相比较通常意义上有一些区别

- *32x*、*64x*、*128x*... *Nx*：表示该资源包的基本纹理尺寸均为 $ N \times N $；
    - 在动态纹理中，纵向分辨率还需要乘以动态纹理的帧数 $F$ ，于是最终我们的纹理分辨率为 $N \times N \times F$。
- *1k*、*2k*、*4k*... *Nk*：表示所有纹理均为 $ N\text{k} \times N\text{k} $ 像素的尺寸，其中 $1\text{k} = 1024$ ；
- 在 Java 版中， $ N = 2^x $，其中$x$为自然数。

## 资源包的版本兼容性 {id="versionComp"}

<primary-label ref="je"/>

### 粗略区间 {id="roughComp"}

在 **JE 1.13** 时，Mojang 进行了一轮游戏代码重写，这轮重写包含了一次对方块 ID 和命名方法的统一修改，称为**扁平化**，这也导致了自 **JE 1.13** 开始，资源包的兼容性出现了**断层**

<include from="uniforms.md" element-id="resourcepack_versions_simple"/>

对于**大部分**的资源包，只需要选择在区间内的正确版本，即可正常加载。

有一些例外情况是，Mojang 在某些版本中**更改了方块的代码名**，比如`草`（`grass`）在 **JE 1.20.3** 中被改为了`矮草丛`（`short_grass`），这时候就会导致新旧资源包和版本间的不兼容。

### 准确区间

虽然在粗略兼容区间内，但有时候资源包列表仍然会标红且提示 `适用于<新 | 旧>版本的Minecraft` ，这是因为实际上资源包的区间分为更复杂的许多段，避免上述例外情况的发生。

#### pack.mcmeta

版本区间由资源包内名为 `pack.mcmeta` 的文件

<include from="uniforms.md" element-id="pack.format"/>

中 `pack_format` 的值定义，`descripton` 则是该资源包的**描述**。  
此外，自 **JE 1.20.2 23w31a** 开始，其加入了 `supported_formats` 字段，可以指定兼容版本的上下限。
- `min_inclusive` 指定版本下限，`max_inclusive` 指定版本上限。
- 也可简写为 `"supported_formats": [17, %latest_pack_format%]` 。

以下是资源包版本号对应游戏版本的表格：

<include from="uniforms.md" element-id="resourcepack_versions"/>

从 **JE 1.15** 开始，版本之间只要存在资源更新，资源包版本号就会随之更新。

- 例如 **JE 1.15** 与 **JE 1.16** 之间更新了墙类方块的方块状态，即便有些资源包并未涉及此内容，只要 `pack.mcmeta` 内的版本号不同，游戏内依然会显示不兼容。

因此资源包的兼容性在绝大多数下应以**作者本人的解释为标准**，而不是游戏内是否显示不兼容。

## 资源包加载顺序

资源包加载顺序为**由低到高**，即：

- 放置在**顶部**的资源包在加载时会覆盖下方资源包中重名的文件。
- 顶部资源包缺失的纹理，将由下方资源包补齐。

因此一些 `基础包` + `附加包` 组合形式的资源包，应把基础包置于**底部**。

![资源包排序](pack_order.png "资源包排序"){width="500"}

## 纹理类型

### 原版纹理

原版纹理名称一般为 `<name>.png` 。

原版纹理由 Minecraft 原生提供支持。许多老牌资源包如**舒服细致**（Soartex）、**五边形**（BDCraft）等即为只提供原版纹理的资源包。

### 着色纹理 {id="着色纹理"}

<primary-label ref="je"/>

<secondary-label ref="of"/>
<secondary-label ref="iris"/>

**读取这些纹理需要模组支持，具体作用需要光影支持。**

着色纹理有**反射纹理**（Specular texture）和**法线纹理**（Normal texture）两种。

- 法线纹理的命名方法为 `<name>_n.png` 。
- 反射纹理的命名方法为 `<name>_s.png` 。

OptiFine 同时支持一些其它的特殊纹理，如 CTM、CIT、CEM 等，见 [](#特殊纹理){summary=""} 。

#### 法线纹理 {id="法线纹理"}

参阅：[术语表 - 法线贴图](terms.md#法线贴图 "偏移物体表面的朝向，这样就可以影响每个纹理像素的光照强度，从而产生额外的表面细节。")

这里列出了每个通道的作用：

- `R` ：表面在 X 轴上的倾斜量，高于 127 表示沿表面向右。
- `G` ：表面在 Y 轴上的倾斜量，高于 127 表示沿表面向下。
- `B` ：表面在 Z 轴上的倾斜量。它的值可以由 `R` 和 `G` 计算得到，因此在 Java 版现行 PBR 标准中，该通道可以独立出来做特殊用途，详见 [#PBR 标准](#pbr标准 "PBR 工作流和格式") 。
- `A` ：通常用于**视差**。

`R` `G` 分量的作用由 **OpenGL 特性**决定，如果要改为其他读取方式，需要做一些转换。

#### 反射纹理 {id="反射纹理"}

用于告诉着色器物体的性质，每个颜色通道在不同的标准中有着不同的定义，详见 [](#pbr标准){summary=""} 。

### 特殊纹理／模型 {id="特殊纹理"}

<primary-label ref="je"/>

<secondary-label ref="of"/>
<secondary-label ref="mod"/>

| 名称                              | 简写  | 用途       |
|---------------------------------|:---:|----------|
| Connected Textures              | CTM | 方块间的纹理衔接 |
| Custom Item Textures            | CIT | 自定义物品纹理  |
| Custom Entity Models            | CEM | 自定义实体模型  |
| Custom Graphical User Interface | GUI | 自定义游戏界面  |
| Animated Textures               |  -  | 自定义动态纹理  |
| Emissive Textures               |  -  | 自发光纹理    |
| Random Entities                 |  -  | 随机实体纹理   |
| Natural Textures                |  -  | 自然纹理     |
| Custom Sky                      |  -  | 自定义天空    |

这些纹理可以在 OptiFine 中使用，也可以由其他模组实现。  
详细介绍可参考 MCBBS 纹理版版主 *SQwatermark* 翻译的 [OptiFine官方文档](http://sqwatermark.com/resguide/optifinedoc/) 。

[//]: # (TODO: 资源包技术科普完成后迁移至其中)

## PBR 标准 {id="pbr标准"}

参阅：[术语表 - PBR](terms.md#pbr "一种着色和渲染的方法，更准确地表现光线如何与材料性质相互作用。")

PBR 有两种工作流，一种是**金属／粗糙度**，另一种是**镜面反射／光泽度**。  
对于 PBR 纹理上的通道的定义，在 MC 中有着不同的标准，例如 **OldPBR** <sup>JE</sup> 、**LabPBR** <sup>JE</sup> 、**四合一PBR** <sup>BE</sup>等。

- **OldPBR** 是过时的 PBR 标准，在此不做讨论。
- [LabPBR 1.3](labpbrMaterialStandard.md "LabPBR 材质标准（译）") 是 Java 版的约定现行标准，工作流为**金属／粗糙度**。其 *材质属性* 由 `_n` 和 `_s` 纹理**共同定义**。
    - `_n` 纹理：
        - `R` `G` `A`：与 [前文](#法线纹理 "法线纹理") 一致。
        - `B` ：[纹理环境光遮蔽](terms.md#ao "间接光照在场景间经过各种反射之后逐渐被场景所吸收和遮挡的效果。")（Texture AO）强度。
    - `_s` 纹理：
        - `R` ：**感知平滑度**。
        - `G` ：**金属性**，230 及以上的数值代表**特定金属**，**详见下方链接**。
        - `B` ：[0, 64] 表示**孔隙度**， [65, 255] 表示**次表面散射强度**。
        - `A` ：**自发光**，[1, 254] 范围内数值越大发光越强，当值为255（即完全不透明）时不发光。
    - 关于 LabPBR 的更多详细介绍，可参考 [站内翻译文档](labpbrMaterialStandard.md "LabPBR 材质标准") 。
- **四合一PBR**是目前基岩版的约定现行标准。
    - 主要为将 `颜色纹理` 、`法线纹理` 、`PBR 纹理` 和附加的 `检测纹理` 拼合到 [一张图](terms.md#缓冲区 "缓冲区") 内，得以实现光影读取。
    - **四合一标准详见基岩版光影 *YSS* 压缩包内的开发文档。**
