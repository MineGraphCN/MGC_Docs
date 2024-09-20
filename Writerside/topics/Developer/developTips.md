# 作品开发相关资料

<primary-label ref="manual"/>

<secondary-label ref="corrected"/>

<secondary-label ref="jedoc"/>

<show-structure depth="0"/>

<tabs>
  <tab title="着色器开发">

<chapter title="背景知识">
<p>

着色器开发至少需要三套背景知识：**线性代数**、**GLSL** 和 **OptiFine 渲染管线**

线性代数对着色器开发很有用，因为矢量和矩阵操作在着色器（以及一般的三维图形）中非常常见。  
3blue1brown 在这里有一个不错的系列介绍：  
[Bilibili - 【官方双语/合集】线性代数的本质 - 系列合集](https://www.bilibili.com/video/BV1ys411472E)

**GLSL 是 OpenGL 的着色器语言**。互联网上有不少这方面的教程，但 Minecraft 使用了一个旧的 OpenGL 版本，所以如果找到一个同样旧的 GLSL 教程可能是有用的。任何写着 `#version 120` 的东西都是没问题的。  
原版自 **JE 1.17** 开始强制使用 OpenGL 3.2，同时 GLSL 版本最低提高到了 `#version 150` ，但你并不需要局限于这些特定的 `#version` （OptiFine 也干了），你可以使用你的 GPU 驱动支持的任何版本。

[OptiFine 开发文档](https://github.com/sp614x/optifine/tree/master/OptiFineDoc/doc) 中也给出了不少开发细节，尤其是 `shaders.txt` 和 `shaders.properties` 。这些文档也可以在你下载的 OptiFine `.jar` 文件中找到。

</p>
</chapter>
<chapter title="基本概念">
<p>

在编写着色器之前，我们需要了解最基础的概念。经过多个着色器作者的筛选，我们推荐观看以下视频：

- [GAMES101-现代计算机图形学入门-闫令琪](https://www.bilibili.com/video/BV1X7411F744)

不要求必须看懂所有内容，但至少需要理解前半部分所提到的概念，初步了解各种技术的原理，这样在后续才能借助代码工具实现想要的效果。

一旦你掌握了以上的所有内容，就可以开始将你的技能付诸实践，有两种常见的方法：

1. 魔改别人的光影；
2. 从头开始制作自己的光影。

你将从这两种做法中学到不同的技能，所以建议至少尝试这两种做法，但从你更喜欢的那一种开始。**注意：魔改光影前需要了解相关版权问题，至少应该知道作者是否允许别人魔改后发布他的着色器。**

</p>
</chapter>
<chapter title="相关资料">
<p>

[OptiFine 开发文档 / 着色器](https://github.com/sp614x/optifine/blob/master/OptiFineDoc/doc/shaders.txt)
: OptiFine 开发文档的着色器部分。

  [OptiDocs](https://optifine.readthedocs.io/shaders_dev.html)
  : OptiFine 开发文档的格式化编译版本，比 GitHub 上的版本更直观。

[Iris 开发文档 / Iris 特性](https://github.com/IrisShaders/ShaderDoc/blob/master/iris-features.md)
: Iris 提供的额外功能

[Minecraft Shader Tutorials](https://saada2006.github.io/minecraft-shader-tutorials/)
: 介绍 Minecraft 渲染方式、缓冲区和一些示例效果的概述（含代码、图片和解释）。

shaderLABS 提供的相关资料
:
- [OpenGL 1.2 模板](https://github.com/shaderLABS/Base-120)
- [OpenGL 1.5 模板](https://github.com/shaderLABS/Base-150)
- [OpenGL 3.3 模板](https://github.com/shaderLABS/Base-330)
- [阴影示例](https://github.com/shaderLABS/Shadow-Tutorial)
- [光影编写技巧](https://wiki.shaderlabs.org/wiki/Shader_tricks)

原版着色器相关的信息
:
- [谷歌文档 - Minecraft Vanilla Shaders Guide](https://docs.google.com/document/d/15TOAOVLgSNEoHGzpNlkez5cryH3hFF3awXL5Py81EMk/edit#)
- [GitHub - Better Environment](https://github.com/bradleyq/mc_vanilla_shaders/tree/dev/resourcepack-shaders)
    - 这是一个开源的原版光影。
- [GitHub - Minecraft Shaders Wiki](https://github.com/McTsts/Minecraft-Shaders-Wiki)

[Learn OpenGL CN](https://learnopengl-cn.github.io/)
: OpenGL 和 GLSL 的介绍性教程，你可以从着色器部分开始。
- [英文原版](https://learnopengl.com/)

[hughsk.io - Fragment Foundry](https://hughsk.io/fragment-foundry/chapters/01-hello-world.html)
: GLSL 的交互式教程，在测试中提升你的着色器编写技能。

[The Book of Shaders](https://thebookofshaders.com/?lan=ch)
: [片段着色器](shaderBasic.md#fs){summary=""} 入门，网站允许在浏览器中编辑示例代码以实时查看其效果。

[Shadertoy](https://www.shadertoy.com/)
: GLSL 沙盒，包含了很多人的示例代码。

</p>
</chapter>
<chapter title="开发技巧">
<deflist>

<def title="快速重载">

- 在 Iris 上，你可以按 <shortcut>R</shortcut> 来重新加载当前的光影。这是一个**可配置**的绑定键。
- 在 OptiFine 上，该键位是 <shortcut>F3</shortcut><shortcut>R</shortcut> ，而且是**不可配置**的。不需要进入着色器选择菜单来重新加载着色器。
</def>
<def title="使用文件夹">

- 文件夹可以作为光影加载，**就像 `.zip` 文件一样**。
- 目录结构是 `shaderpacks/<着色器名称>/shaders/<着色器代码>` 。
- 不需要每次想改变什么的时候都解压和重新压缩你的光影。
</def>
<def title="语法错误调试">
<tabs>
<tab title="OptiFine">

- 在 OptiFine 上，如果你的光影有语法错误，你会在聊天菜单中看到**无效的程序（invalid programs）** 提示，并跳过编译该着色器；
    - 在写这篇文档的时候，Iris 还没有这个错误信息。相反，如果你有任何无效的程序，Iris 将**完全禁用光影**。
- 无论如何，如果这两种情况发生在你身上，你可以在你的**日志文件**中找到更多关于导致程序错误的信息。
- 日志可以在 `.minecraft/logs/latest.log` 找到。
    - 如果你使用 Forge，那么日志文件将被 `.minecraft/logs/fml-client-latest.log` 代替。
- 如果你不知道在你的日志文件中寻找什么，请在频道的 [求助问答平台](https://pd.qq.com/s/1dvabyzrt) 处寻求帮助，并确保在那里上传你的日志文件。
</tab>
<tab title="Iris">

- 在着色器选择菜单中按下 <shortcut>CTRL</shortcut><shortcut>D</shortcut> 可以启用 `调试模式` 。
- 在调试模式下，如果您的光影中存在语法错误，Iris 会在每次加载光影时在游戏中显示错误信息。
    - 请注意，当前版本的Iris可能会显示错误的文件名和行号，降低了其实用性。
- 调试模式还会将修补后的光影输出到 `.minecraft/patched_shaders/` ，给出的行号将与修补后的光影相匹配。
- 修补后的光影通常类似于原始光影，这可以作为另一种跟踪语法错误的方法。
</tab>
</tabs>
</def>

<def title="快速查看日志文件">

- 如果您使用官方启动器，您可以启用 `设置` > `启动 Minecraft: Java Edition 时打开输出日志` ，以在游戏运行时显示日志文件。
    - 这样做可以更快地访问日志文件，尤其是当您没有一个与当前打开文件同步的文本编辑器时。
- MultiMC、 Prism Launcher、HMCL、PCL 2 都有类似的选项，其他启动器可能不支持此功能。

</def>
</deflist>
</chapter>
</tab>
<tab title="资源包开发">
<chapter title="相关资料">
<p>

[Minecraft 中文 Wiki - 教程:制作资源包](https://zh.minecraft.wiki/w/Tutorial:%E5%88%B6%E4%BD%9C%E8%B5%84%E6%BA%90%E5%8C%85)
: Minecraft Wiki 编写的资源包教程。

[森罗万象](http://sqwatermark.com/resguide/)
: MCBBS 纹理版版主整理的资源包制作指南。

</p>
</chapter>
<chapter title="开发技巧">

快速重载
: 使用 <shortcut>F3</shortcut><shortcut>T</shortcut> 来快速重载资源包。

善用 `blockstates`
: 将方块的旧版本 ID 重定向到新版本 ID 对应的模型，一套纹理模型即可兼容不同版本。  
例：
```JSON
{
    "variants": {
        "": {
            "model": "minecraft:block/short_grass"
        }
    }
}
```
{collapsible="true" collapsed-title=".\assets\minecraft\blockstates\grass.json"}
> 一些在旧版本和新版本指向不同方块的 ID 不要这样做！如：**JE 1.13** 时，`grass` 所指对象由 `草方块` 变为了 `草丛（现矮草丛）` 。
> 
{style="warning"}

</chapter>
</tab>
</tabs>
