# 着色器 基本概念和轶事

> 这篇文档正在添加新内容，可能无法流畅阅读。
>
{style="warning" title="施工中"}

## 何谓着色器？ {id="here_sAnSimpleQuestion_whatIsShader"}

对于一个完整的现代图形应用程序（基于如 OpenGL、Vulkan、DirectX 等图形库）来说，着色器是它渲染场景的手段。  
我们知道图形应用程序的目的是读取模型文件或硬编码几何体，并在屏幕上绘制。着色器就描述了我们传入的几何体在屏幕上的**何种位置**以**何种方式**绘制。

> 光影是着色器的集合。

## 渲染模组／引擎如何帮助光影和游戏交流

渲染模组／引擎（下简称渲染模组）充当了游戏和光影的桥梁。由于原版所提供的信息极其有限（许多效果必须的变量没有直接提供），如果想仅利用原版资源包的着色器来编写光影，无异于自讨苦吃。  
渲染模组利用模组加载器提供的 [接口](terms.md#应用程序接口 "应用程序接口提供特定的方法，让第三方代码通过它们修改程序。") 或直接对 Minecraft 源代码进行逆向工程并注入，接管了 Minecraft 的原版渲染管线，并提供了大量信息和更多 [缓冲区](terms.md#缓冲区 "存储图像的区域。") ，为光影开发提供便利。

> 一些渲染模组还修改了原本所使用的图形库，将 OpenGL 替换为了 Vulkan，如 **Vulkanite**。

## 场景在着色器中发生了什么？ {id="whatWasYourMissionInShader"}

### 着色器类型

光影通常以多个着色器组成，着色器接收渲染模组提供的各种变量，以及先前乃至上一帧计算好的存入缓冲区的信息，按照程序进行计算后输出到指定的缓冲区。  
不同渲染模组的工作原理不尽相同，所对应的光影包规格也有所区别。

一个着色器中又可以细分为多个阶段，也就是我们常说的顶点着色器、像素着色器等，这里按照通常管线的顺序，简单列举一下每种着色器计算的对象：

<deflist>

<def title="顶点着色器" id="vs">

**Vertex Shader**，它的主要职责是变换坐标，包括顶点坐标、纹理坐标等，也可以处理顶点的颜色，计算对象为每个顶点（逐顶点操作）。
</def>
<def title="几何着色器" id="gs">

**Geometry Shader**，这个阶段是**可选的**，它的主要职责是生成新的顶点，计算对象是每个图元，可以通过特定的索引值确定需要处理的顶点。
> 图元通常为点（一个顶点）、线条（两个顶点）或三角形（三个顶点）
</def>
<def title="片段着色器" id="fs">

**Fragment Shader**，它的主要职责是处理像素的颜色，也是大多数效果程序所处的位置，计算对象是每个像素。
> 根据它所计算的对象，我们也将其称为**像素着色器**（Pixel Shader）。
</def>
<def title="计算着色器" id="cs">

**Compute Shader**，这个阶段是**可选的**，它负责进行抽象计算。可以任意存取 [缓冲区](terms.md#缓冲区 "存储图像的区域") ，但是不能传入自定义变量，也没有默认输出。
> 计算着色器使 GPU 可以像 CPU 一样做通用计算的工作。计算着色器使开发者可以更随性地写东西，例如基于计算着色器的光线追踪程序。
</def>
</deflist>

当仅考虑顶点着色器和像素着色器时，在 [上文](#here_sAnSimpleQuestion_whatIsShader "何谓着色器") 中我们所提到的所谓“*何种位置*”大多数时候就在顶点着色器中进行处理，而以“*何种方式*”则是顶点着色器和像素着色器的共同作用。

> 2018 年英伟达提出了 [网格着色器（Mesh shader）](https://developer.nvidia.com/zh-cn/blog/introduction-turing-mesh-shaders/)，这让几何处理管线不再拘泥于传统的顶点着色器，拥有更强的可编程性和性能，这使得所有几何处理工作均可在 GPU 端完成，无需和 CPU 进行高延迟通信。它的本质是计算着色器。

### 渲染方法的发展 {id="renderingMethod"}

在计算机最早起步的阶段，还没有各种图形库和接口供开发者使用，那时候通常是通过准备特殊的图块字符映射表，然后将场景通过各种特殊的字符打印在屏幕上。

> 如果你曾经玩过任天堂 Famicom 游戏机，并且尝试过在游戏途中热拔出卡带，那么你一定见过这种场景：
> 
> ![热插拔游戏卡带](famicom_glitch.png "热插拔游戏卡带"){border-effect="rounded"}
> 
> 这种情况就是数据出错导致的图块映射错误。

随着计算机和 GPU 发展，各种图形库开始发展起来，OpenGL 就是其中之一。最早的图形库使用**固定渲染管线**（例如顶点光照、阴影等），开发者只可以配置渲染参数，没法精细控制每个几何体的效果，也没法自定义如何处理每个像素。

由于固定管线只能提供固定的效果，希望能更自由地开发的呼声越来越高，**可编程管线**应运而生。

> 如果将固定管线比作客观题（选择、填空），那么可编程管线就是主观题（简答、作文）。

<p id="向前渲染法">在可编程管线刚刚发展起来的早期图形程序中，渲染思想是将一类几何体全部准备好并传入特定着色器，然后立即在传入的几何体上计算诸如阴影和反射等效果，再输出到屏幕上。这就是我们现在所说的<b>向前渲染法</b>。</p>

这在早期是没什么问题的，那时候 3D 程序处于早期阶段。然而随着场景几何体增多、几何体之间相对于视角的遮挡越来越频繁，这种做法开始产生越来越多不必要的开销。因为每个着色器都会将所有传入的几何体计算一遍，即使在之前或之后的着色器中这个几何体会被更靠前的几何体遮挡。

> 在现代 GPU 中，有一种名为**提前深度测试**（Early Depth Testing）的功能，可以在 GPU 上预先判断场景的几何遮挡情况，在着色器开始处理之前先丢弃将会或已经被遮挡的像素。

<p id="延迟渲染法">出于上述原因，<b>延迟渲染法</b>应运而生，它的思想是不再在传入几何体的阶段立即计算大多数效果，而是分为两个阶段：</p>

1. [几何缓冲阶段](terms.md#几何缓冲 "着色器传入的顶点数据是场景中实际的几何体，接受所有原始纹理的传入，并将其映射到几何体上。") ：通过着色器将纯色场景和诸如法线贴图和反射贴图等**全部作为纹理**映射到几何体上，再分别写入多个缓冲区，并通过 [颜色附件](terms.md#颜色附件 "负责着色器间传递数据的对象") 在着色器之间进行传递，这就是所谓的；
2. [延迟处理阶段](terms.md#延迟处理 "着色器从缓冲区中读取信息，并将计算结果绘制到铺屏四边形上。") ：之后的着色器读取对应缓冲区的这些信息，在**铺屏四边形**上统一计算光照、反射等其他效果。

## OptiFine 的发家史

_TODO_

## 渲染龙和它光影朋友们的爱恨纠葛

最早的基岩版光影基于 OpenGL ES 的 GLSL 或 DirectX 的 HLSL <sup>Windows／XBox</sup> 。由于接口限制，基岩版光影可以实现的效果非常少（甚至比 **JE 1.16** 之后的原版资源包着色器还少），并且为 [向前渲染管线](terms.md#向前渲染法 "在每个着色器中，立即在传入的几何体上计算诸如阴影和反射等效果。") ，但仍可以通过一系列奇技淫巧实现基于物理的渲染。

然而在渲染龙实装后很长一段时间里，光影作者们都面临着各种问题：

- 渲染龙已覆盖到了各种 PC、移动设备及主机的基岩版上，替代了原本的渲染方案，而基于原始方案的第三方着色器也受到了牵连，直接导致了第三方光影集体灭绝。
    - **理想情况下**，Windows 版本能够通过其调用 **RTX 2000** <sup>Nvidia</sup> ／ **RX 6000** <sup>AMD</sup>　／ **Arc** <sup>Intel</sup> 系列及以上显卡的光线追踪加速单元以提升光线追踪的效率，而其他平台上其则能够起到优化作用。
    > 意外的是，渲染龙一开始是给 Java 版设计的，而目前只在基岩版中起到了负优化作用。XBox 版本在渲染龙推出之初就已经有带有光线追踪的预览版，而在这之后也被移除了。
- 渲染龙的算法加密破坏了很多东西，除了光影还有例如区块显示、红石能量显示、亮度显示、夜视、透视、小地图这些原本都能由第三方光影实现的功能。而它们的消失给一些玩家带来了不少困扰。
- 官方光追虽然在准确性上力压 Java 版一头，但其主要得益于 **DirectX RayTracing**，在代码质量和细节调校上做的并不尽如人意，也对主打写实风格的地图与纹理创作者造成了很大困扰。

> 官方光追很大一部分是[实习生面向论坛编程的产物，其代码质量极其低下](https://b23.tv/BV1614y1b7cp?t=706.6 "Bilibili《渲染龙被破解了，于是我们深挖了它的前世今生……》11:47")。  
> 五星社区创作家*茶匙*对此评价到：英伟达这样写着色器代码，怕是脸都不要了。

这些也是渲染龙在开发者群体内风评不佳的原因。

在此之后，渲染龙虽被成功破解，但由于破解团队收到微软的 DMCA 致函，以及新的光影编写方法过于麻烦，基岩版光影仍然沉寂。

- 当时编写光影需反编译游戏后进行编辑，再将特定文件回编译并放到固定文件夹替换相关文件，然后重启游戏。
> DMCA 致函是一种版权警告，当时团队将代码上传到了 Github，被致函删库。

不过事情在 2023 年迎来了转机。基岩版在这年 7 月发布了 [延迟渲染](terms.md#延迟渲染法 "将场景的各种信息存储起来，再在之后的着色器中统一计算。") 更新，提供了各种接口和信息。久旱逢甘霖，基岩版光影自此开始进入了新的时代。

> 网易的延迟处理接口来得要比渲染龙更早，自由度也相对当时的渲染龙更高，在很长一段时间里，网易版的光影繁荣程度一度超过了国际版。

## 附录：光影加载器圣经

关于光影加载器我有四不用。
- 第一，不用 Oculus，因为它善。别人都是要么给模组开发者史吃，要么给光影材质开发者史吃，它干脆大发慈悲让所有人都雨露均沾。
- 第二，不用 Iris，因为它孝。从三年前号称接管 OptiFine 所有光影，到现在这嫌代码侵权那嫌光影太旧，推出自己的独占接口吸引 OptiFine 的开发者过来，最后发现吖到了一大口史。
- 第三，不用 Canvas，因为它贞。Canvas 的初心是给模组提供渲染 API，在上面开发光影 = NTR，要被浸猪笼后烧死。
- 第四，不用 OptiFine，因为它忠。一直以来，高清修复对内都为光影材质提供了一个稳定的开发环境，对外从来不在乎模组兼容性，对自己人不可谓不忠诚。

<seealso>
  <category ref="related">
    <a href="terms.md#渲染模组和引擎" summary="总结了大多常用的渲染模组和引擎">术语表 - 渲染模组和引擎</a>
  </category>
  <category ref="advance">
    <a href="shaderTech.md" summary="对着色器的具体技术的科普">着色器 技术科普</a>
  </category>
</seealso>