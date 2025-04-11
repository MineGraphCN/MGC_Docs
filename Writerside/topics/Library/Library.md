# 知识库

<tldr>

> 注解，引用和小贴士

> 提示
> 
{style="note"}

> 警告
>
{style="warning"}

在新建标签页打开：<shortcut>鼠标中键</shortcut>

[//]: # (高级搜索：<shortcut>Ctrl</shortcut><shortcut>K</shortcut>)
搜索功能暂不可用

深色模式：右上角 ![切换深色模式按钮](https://resources.jetbrains.com/help/img/writerside/systemTheme_dark.svg){style="inline"} （需要横屏）

选择文档：左侧栏
</tldr>

这里对社区内常见的图形学知识进行了总结，如果对图形学概念不了解或模糊，欢迎查阅。

善用目录来检索你所想要了解的知识，**知识库仅供科普，不作深度教学**。  
如需学习可前往我们正在编写的新板块 [](shaderTutorial.md){summary=""} 和 [](resourceTutorial.md){summary=""} 。

## 操作

- 点击跳转链接时，默认在当前标签页内跳转。使用 <shortcut>鼠标中键</shortcut> 来新建标签页访问；

[//]: # (- 使用 <shortcut>Ctrl</shortcut><shortcut>K</shortcut> 进行高级搜索；)
- 搜索功能的服务配置有些问题，暂不可用；
- 点击右上角 <img src="https://resources.jetbrains.com/help/img/writerside/systemTheme_dark.svg" alt="切换深色模式按钮"/> 可以将文档切换为深色模式，大多数图片也是以深色模式为主；
  - 我们对部分文档图片进行了优化，使其可以同时适配深色和浅色模式；
  > 在竖屏中可能不显示该按钮。
  >
  {style="note"}
- 在**左侧栏**中选择你想阅读的文档；
- 点击代码块右上角按钮可以拷贝代码。

## 约定 {id="约定"}

站上的文本有各种各样的特殊格式，我们对它们表达的含义做出了一些约定。

**粗体**
: 表示**强调**或**关键词**。

*斜体*
: 表示 *引用* 或 *人／团队名* 或 **_加粗时二次强调_**。

[跳转](#约定){summary="跳转链接描述"}
: 跳转到站内其他位置，或当链接后跟有 ↗ 时，表示跳转站外链接。将鼠标悬停在其上有时会有和缩写一样的提示。

^角标^
: 表示这只在对应环境中有效。

<tooltip term="缩写">缩写</tooltip>
: 鼠标悬停或点击 <sup>触屏设备</sup> 可以查看缩写全称。

`代码`
: 表示这是程序运行时显示/日志/代码内容，或计算机行为。  
`代码块内容` 的约定：
- `<尖括号>` ：由尖括号括起来的内容表示在这个区域内应该填写的内容。例：`<文件名>.jpg` ，其中 `<文件名>` 部分可以使用任意**符合尖括号内定义**的内容替换，例：`图片1.jpg` 。
  - 在替换时应当将尖括号**一同替换**。
- `[方括号]` ：分为参数和数组两种情况。
  - 表示函数中内容可选填入，例：`smooth([id], val, [fadeInTime, [fadeOutTime]])`。
  - 在数组中，方括号不需要被一同替换，此时，例：`float[a][b]` 可以替换为 `float[1][3]` 。
- `函数()` ：函数分为原型和调用两种情况。
  - 当函数和参数含有 [变量类型](terms.md#变量类型和修饰符){summary=""} 时，表示这是函数的**原型**。例：`float floor(float num)` 。
    - 有些函数有多个可以传入的变量类型，此时会在变量类型处使用 `<尖括号>` 。例如 `min(<int|float> numA, <int|float> numB)` 。
  - 当函数内参数仅有变量类型时，表示我们**调用函数**时会在这个函数内填何种参数。例：`max(float, float)` 。

<shortcut>按键</shortcut>
: 表示这是键盘或者鼠标的按键
- <shortcut>A</shortcut><shortcut>B</shortcut> 表示同时按下 A 和 B
- <shortcut>A</shortcut>, <shortcut>B</shortcut> 表示按下 A 并松开后再按下 B
- <shortcut>^A</shortcut> 表示按住 A

公式
: 形如 $y = ax^2 + bx + c$ 的非衬线西文内容。

### 内容块

<tldr>

**省流块**

省流块永远在章节顶部，总结本章节的一些内容。
</tldr>

你可能会在一些文档开头或中间看见各种颜色的提示块：

> - 表示引用。
> - 表示注解和小贴士。
>
{title="灰色提示块"}

> 表示提示。
>
{style="note" title="绿色提示块"}

> 表示注意。
>
{style="warning" title="红色提示块"}

## 基本术语

我们将所有的术语按类型划分，整理在 [](terms.md) 中，这些名词和概念贯穿全文，了解它们可以帮助你更流畅地阅读。

我们主要解释术语的含义，不涉及过多的原理和实现。

我们会逐渐在文档中部署相应的跳转链接，帮助你快速访问。

## 计算机图形学？

中国科学技术大学图形与几何计算实验室给予了比较明确的定义和解释：[《什么是计算机图形学》](http://staff.ustc.edu.cn/~lgliu/Resources/CG/What_is_CG.htm)

## 入门 Windows……？

推荐阅读[《你缺失的那门计算机课》](https://www.criwits.top/missing/)，快速上手电脑的教程。
