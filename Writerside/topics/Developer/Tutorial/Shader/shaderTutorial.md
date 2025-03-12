# 光影开发教程

<primary-label ref="dev"/>

<secondary-label ref="wip"/>

<secondary-label ref="je"/>
<secondary-label ref="of"/>
<secondary-label ref="shader"/>

<show-structure depth="0"/>

<var name="topic" value="着色器编写的实际教程"/>
<var name="goal" value="仅想对着色器有大致的了解"/>
<var name="target_name" value=""/>
<var name="target_topic" value="shaderBasic.md"/>
<var name="target_description" value=""/>
<include from="uniforms.md" element-id="h_note_readingTips"/>

苦于国内没有系统性和标准化的光影教程，仅存的教程除了特化严重（魔改和目标性实现）还存在诸多不良编程习惯（使用老旧的 OpenGL 内置函数和变量、声明不规范），而且不符合现代 OptiFine GLSL 规范，让开发光影有门难入。

为了解决这些问题，破除门槛，我们决定推出这个教程系列，旨在让零光影开发基础玩家也可以从头构建自己的光影。在编写过程中也受到了诸多光影开发大佬的批评指正，我们对此表示由衷的感谢。

## 我能学到什么？

- OptiFine 光影的管线细节
- 从头开始搭建属于自己的光影
- 光影开发的小技巧
- 各种效果的原理和实现
- 规范的编程习惯，在语法要求更严格的 Iris 上加载也不在话下

此外，我们还搬运了许多 OptiFine 的开发文档作为附录以便大家查阅。

## 在开始之前…

要想流畅地阅读整个教程，需要注意以下几点：

- 了解基本的 C 语法，熟悉在 GLSL 中可能会用到的**线性代数**知识（主要是矩阵）。如果你在寻求一个了解更加底层的 OpenGL 框架，或者快速入门矩阵相关知识的教程，我们推荐 [LearnOpenGL](https://learnopengl-cn.github.io/01%20Getting%20started/07%20Transformations/) ；
- 我们约定了一些 [术语](terms.md){summary=""} ，在教程中可能会用到，当它们首次出现时，我们会将其与对应术语链接；
- 与着色器有关的入门介绍请阅读 [](shaderBasic.md){summary=""} 和 [](shaderTech.md){summary=""} ；
- 我们的教学主要集中在开发环境成熟稳定的 **OptiFine GLSL** 上（如使用 OptiFine 提供的语法和统一变量），并且不推荐使用较为激进的 Iris 或 Oculus 作为开发平台，因此它们的独占特性我们不会提及，并且内容会与通用 GLSL 有所差异；
- 我们的目标是希望大家能理解 OptiFine GLSL 原理，而不仅仅是功利性地做出千篇一律的光影。教程主要集中在基础原理和公式上，但是也会给出基本的代码实现。随着教程的编写，我们后期也会推出一些针对某些效果的专题。
