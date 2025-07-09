# 光影开发教程

<primary-label ref="dev"/>

<secondary-label ref="je"/>
<secondary-label ref="of"/>
<secondary-label ref="shader"/>

<show-structure depth="0"/>

<var name="topic" value="着色器编写的实际教程"/>
<var name="goal" value="仅想了解着色器的基本理论"/>
<var name="target_name" value=""/>
<var name="target_topic" value="shaderBasic.md"/>
<var name="target_description" value=""/>
<include from="uniforms.md" element-id="h_note_readingTips"/>

时至今日，国内仍没有系统性和标准化的 OptiFine 光影教程，而现存教程除了特化严重（魔改现有光影、目的性较强）还存在诸多不良编程习惯，不符合现代 OptiFine GLSL 规范，让开发光影有门难入。

出于上述原因，我们决定推出这个教程系列，旨在让零光影开发基础玩家也可以从头构建自己的光影。在编写过程中也受到了诸多光影开发大佬的批评指正，我们对此表示由衷的感谢。

本教程目前已经完成了两个入门章节，并将在不久之后开始更新第三章。

## 我能学到什么？

- OptiFine 光影的管线细节
- 从头开始搭建属于自己的光影
- 光影开发的小技巧
- 各种效果的细致原理和实现
- 良好的编程和代码管理习惯，把光影放在语法要求更严格的 Iris 上加载也不在话下

此外，我们还搬运了许多 OptiFine 的开发文档作为附录以便大家查阅。

## 在开始之前…

要想流畅地阅读整个教程，需要注意以下几点：

- 了解基本的 **C 语法**，熟悉在 GLSL 中可能会用到的线性代数知识（主要是矩阵乘法和变换）。如果你在寻求一个了解更加底层的 OpenGL 框架，或者快速入门矩阵相关知识的教程，我们推荐 [LearnOpenGL](https://learnopengl-cn.github.io/01%20Getting%20started/07%20Transformations/) ；
- 我们约定了一些 [术语](terms.md){summary=""} ，在教程中可能会用到，当它们首次出现时，我们会将其与对应术语链接；
- 如果你对着色器的概念比较陌生，可以阅读站上的理论入门介绍文档 [](shaderBasic.md){summary=""} 和 [](shaderTech.md){summary=""} ；
- 我们的教学主要集中在开发环境成熟稳定的 **OptiFine GLSL** 上：
  - 开发平台为 PC，并且不推荐使用移动平台（特别是手机）进行开发；
  - 会使用 OptiFine 提供的语法和统一变量，因此教学内容会与通用 GLSL 有所差异，不完全适用于 Canvas 和原版着色器；
  - 不推荐使用较为激进的 Iris 或 Oculus 作为开发平台（特别是新手），因此除了相关专题，它们的独占特性我们不会提及；
- 我们的目标是希望大家能理解 OptiFine GLSL 原理，而不仅仅是功利性地做出千篇一律的光影。教程聚焦基础原理，致力于让大家知其然且知其所以然，但也会辅以基本的代码实现。随着教程的编写，我们后期也会推出一些针对某些效果的专题；
- 不同于应用程序的重逻辑编程，着色器编程基本上就是 _计算，爽！_ ，是在**尽可能少地使用逻辑判断**的情况下，利用各种数学公式和一堆数据手搓各种颜色的过程。因此编程中我们经常会为了挤出那点性能而利用各种奇技淫巧实现一些理论上需要逻辑判断才能实现的效果；
- 如果你对教程中的内容有疑问，欢迎前往频道和关联群向我们提出；如果发现教程中的内容有疏漏或错误，也欢迎前往 GitHub 为我们提出 Issue。
