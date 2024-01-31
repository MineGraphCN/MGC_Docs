# 开发相关资料整理

::: warning 未经优化的文档
这篇文档的格式较为不规范，目前正在订正中。
:::

## 开发之前的基础概念

在编写着色器之前，我们需要了解最基础的概念。经过多个着色器作者的筛选，我们推荐观看以下视频：

- [GAMES101-现代计算机图形学入门-闫令琪](https://www.bilibili.com/video/BV1X7411F744)

不要求必须看懂所有内容，但至少需要理解前半部分所提到的概念，初步了解各种技术的原理，这样在后续才能借助代码工具实现想要的效果。

## 着色器开发背景知识

着色器开发一般有 3 套背景知识：**线性代数、 GLSL 和 OptiFine 的渲染管线**

线性代数对着色器开发很有用，因为矢量和矩阵操作在着色器（以及一般的三维图形）中非常常见。

3blue1brown 在这里有一个不错的系列介绍：

- [【官方双语/合集】线性代数的本质 - 系列合集](https://www.bilibili.com/video/BV1ys411472E)

**GLSL 是 OpenGL 的着色器语言。** 互联网上有不少这方面的教程，但 《Minecraft》 特别使用了一个旧的 OpenGL 版本，所以试着找到一个同样旧的 GLSL 教程可能是有用的。任何写着 #version 120 的东西都是没问题的。 Minecraft 1.17 将使用 #version 150 ，但你并不局限于这些特定的 #version 。你可以使用你的 GPU / 驱动支持的任何版本

OptiFine 的渲染管线在 doc 文件夹里有一些文档：

- [https://github.com/sp614x/optifine/tree/master/OptiFineDoc/doc](https://github.com/sp614x/optifine/tree/master/OptiFineDoc/doc)

尤其是要看 `shaders.txt` 和 `shaders.properties` 。这些文档也可以在你下载的 `OptiFine.jar` 文件中找到。

## 着色器开发

一旦你掌握了以上的所有内容，就可以开始将你的技能付诸实践，有两种常见的方法：

1. 魔改别人的着色器包；
2. 从头开始制作自己的着色器包。

你将从这两种做法中学到不同的技能，所以建议至少尝试这两种做法，但从你更喜欢的那一种开始。**注意：魔改着色器包前需要了解相关版权问题，至少应该知道作者是否允许别人魔改后发布他的着色器。**

第三方教程和对着色器开发的有用资源：

- [https://optifine.readthedocs.io/index.html](https://optifine.readthedocs.io/index.html)

  - OptiFine 的 doc 文件夹的替代版本，比 Github 上的版本更直观。

- [https://pastebin.com/aB5MJ7aN](https://pastebin.com/aB5MJ7aN)

  - OptiFine 的流水线、可用的程序和阶段、变化和缓冲区的概述。

- [https://github.com/Shadax-stack/MinecraftShaderProgramming/tree/master](https://github.com/Shadax-stack/MinecraftShaderProgramming/tree/master)

  - Minecraft 渲染方式、缓冲区和一些示例效果的概述（含代码、图片和解释）。

- [https://cdn.discordapp.com/attachments/237199950235041794/825483993951633438/base.zip](https://cdn.discordapp.com/attachments/237199950235041794/825483993951633438/base.zip)

  - 模板包包括大部分的基本文件，但没有一个文件真正做什么。这使得它非常容易编辑。

- [https://cdn.discordapp.com/attachments/960320448594329630/960695935837548695/base150.zip](https://cdn.discordapp.com/attachments/960320448594329630/960695935837548695/base150.zip)

  - 同样的模板包，但使用 #版本150 。用于 MC 1.17 以上版本（但不是必须的）。

- [https://cdn.discordapp.com/attachments/736928196162879510/856960040468873246/Shadow_tutorial.zip](https://cdn.discordapp.com/attachments/736928196162879510/856960040468873246/Shadow_tutorial.zip)

  - 阴影的解释和示例代码。

- [https://docs.google.com/document/d/15TOAOVLgSNEoHGzpNlkez5cryH3hFF3awXL5Py81EMk/edit#](https://docs.google.com/document/d/15TOAOVLgSNEoHGzpNlkez5cryH3hFF3awXL5Py81EMk/edit#)\
[https://docs.google.com/document/d/18AhcnAI55liax72yh70njUomIzezOKshCurfdZPTKwM/edit#](https://docs.google.com/document/d/18AhcnAI55liax72yh70njUomIzezOKshCurfdZPTKwM/edit#)\
[https://github.com/bradleyq/mc_vanilla_shaders/tree/dev/resourcepack/assets/minecraft/shaders/program](https://github.com/bradleyq/mc_vanilla_shaders/tree/dev/resourcepack/assets/minecraft/shaders/program)\
[https://github.com/McTsts/Minecraft-Shaders-Wiki](https://github.com/McTsts/Minecraft-Shaders-Wiki)

  - 有关 vanilla 着色器（非 OptiFine ）的信息。

- [https://wiki.shaderlabs.org/wiki/Shader_tricks](https://wiki.shaderlabs.org/wiki/Shader_tricks)

  - 可用于 Minecraft 着色器的通用技巧和有用的知识。

- [https://learnopengl.com/Getting-started/Shaders](https://learnopengl.com/Getting-started/Shaders)\
[https://www.lighthouse3d.com/tutorials/glsl-12-tutorial](https://www.lighthouse3d.com/tutorials/glsl-12-tutorial)

  - OpenGL 和着色器的介绍性教程，不过你可以跳过 OpenGL 部分。

- [https://hughsk.io/fragment-foundry/chapters/01-hello-world.html](https://hughsk.io/fragment-foundry/chapters/01-hello-world.html)

  - GLSL 的交互式浏览器内教程，在阅读过程中测试你的技能。

- [https://thebookofshaders.com/](https://thebookofshaders.com/)

  - 高级着色器的技巧。网站允许在浏览器中编辑示例代码以实时查看其效果。

- [https://www.shadertoy.com/](https://www.shadertoy.com/)

  - 在浏览器中工作的 GLSL 沙盒。有点类似于合成通道。包含了很多人的示例代码。

## 资源包开发

- 对于想制作资源包，但不知道如何开始的人，请看下方文档：
  - [https://minecraft.fandom.com/wiki/Tutorials/Creating_a_resource_pack](https://minecraft.fandom.com/wiki/Tutorials/Creating_a_resource_pack)

- [http://sqwatermark.com/resguide/](http://sqwatermark.com/resguide/)

  - MCBBS 纹理版版主整理的资源包制作指南。

- lab-pbr-docs
[https://wiki.shaderlabs.org/wiki/LabPBR_Material_Standard](https://wiki.shaderlabs.org/wiki/LabPBR_Material_Standard)

  - 关于使用资源包提供的 PBR 数据的信息。对于资源包开发者来说，这个链接对于将 PBR 数据添加到你的资源包中供着色器使用也很有用。

## 开发技巧和窍门

- 快速重载：
  - 在 `Iris` 上，你可以按 `R` 来重新加载当前的着色器包。事实上，这是一个**可配置**的绑定键。
  - 在 `OptiFine` 上，该键位是 `F3+R` ，而且是**不可配置**的。不需要进入着色器选择菜单来重新加载着色器。

- 文件夹：
  - 文件夹可以作为着色器包加载，**就像 zip 文件一样**。
  - 目录结构是 `.minecraft/shaderpacks/<着色器名称>/shaders/<着色器代码>` 。
  - 不需要每次想改变什么的时候都解压和重新压缩你的着色器包。

- 语法错误调试：
  - 在 `OptiFine` 上，如果你的着色器包有语法错误，你会在聊天菜单中看到 **无效的程序(invalid programs)** 提示；
  - 在写这篇文章的时候， `Iris` 没有这个错误信息。相反，如果你有任何无效的程序，`Iris` 将**完全禁用着色器**。
  - 无论如何，如果这两种情况发生在你身上，你可以在你的 `日志文件` 中找到更多关于导致程序错误的信息。
  - 日志可以在 `.minecraft/logs/latest.log` 找到。
    - 如果你使用 `Forge` ，那么日志文件将被 `.minecraft/logs/fml-client-latest.log` 代替。
  - 如果你不知道在你的日志文件中寻找什么，请在频道的 [求助问答平台](https://pd.qq.com/s/1dvabyzrt) 处寻求帮助，并确保在那里上传你的日志文件。
