# 初识 GLSL

<show-structure depth="2"/>

<tldr>

本节介绍 GLSL 的基础语法和版本配置。

</tldr>

## 从一个程序开始

在进入正式的创作之前，我们先来简单了解一下 GLSL 的相关语法。

GLSL 使用类似 C 的语法，但是它也包含了一些其他特性。现在，让我们从一个包含了顶点和片段部分的简单着色器开始来认识一下它们。

先从顶点部分开始：

```GLSL
#version 330 core

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 vaPosition;
in vec3 vaColor;

out vec3 vColor;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition, 1.0);
    vColor = vaColor;
}
```

文件开头一行的
```glsl
#version 330 core
```
指定了着色器所使用的 GLSL 版本和配置。`#version` 就是所谓的**宏命令**，我们将在之后的章节具体介绍。其中 `330` 表示使用 3.30 的 GLSL，对应 OpenGL 3.3.0；而 `core` 则表示我们使用核心配置。在本教程中，若无必要，我们都将使用这个版本，它包含大多数现代特性，不会过于老旧，还能在一些有点年头的设备上运行。

> 当没有声明版本时，一些平台会指定以硬件最高 GL 版本运行，而另一些则会以最低版本，这本质上是一个未定义行为，不要这样做。
>
{style="note"}

接着的两行以 `uniform` 开头的语句
```glsl
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
```
声明了从 OpenGL 上下文传入 GLSL 着色器的统一变量，**不可以在着色器内被修改**。在这里，它们传入的变量类型是 `mat4` ，表示这是一个 $4\times4$ 的矩阵 ^**[1](#note1-1 "有关这些矩阵和坐标的相关内容，我们将在几何缓冲章节详细介绍。")**^ 。

> OpenGL 上下文（Context）即 OpenGL 程序，我们编写的“着色器”是其运行时所调用的用以指导绘制场景的程序，在 OptiFine 管线中我们无法访问。

> `uniform` 不可以使用逗号进行连续声明，这可能导致变量不进行初始化！
> ```glsl
> uniform mat4 modelViewMatrix, projectionMatrix; // 不要这样做！
> ```
{style="warning" title="注意"}

紧跟着的 `in` 和 `out` 开头的语句
```glsl
in vec3 vaPosition;
in vec3 vaColor;

out vec3 vColor;
```
定义了传入变量和传出变量。对于顶点着色器来说，`in` 类型的变量是**顶点属性**，`out` 的变量可以被几何着色器或片段着色器接受。`in` 的变量不可更改，在传出时对应的变量会在每个顶点之间进行插值使其平滑过渡。其中，`vaPosition` 是顶点的**局部坐标** ^**[1](#note1-1 "有关这些矩阵和坐标的相关内容，我们将在几何缓冲章节详细介绍。")**^ ，`vaColor` 是顶点的**颜色**。

> 若想禁用插值，我们只需要在 `in` 和 `out` 前加上 `flat` ：
> ```glsl
> flat out float ID;
> ```

> 有关统一变量和顶点属性的区别：统一变量在当前着色器中不会随着顶点和像素的位置不同而变化，而顶点属性则是每个顶点特有的信息。

和 C 一样，GLSL 执行时从 `main` 函数开始，但是它必须是 `void` 类型，也不接受任何输入。

<p id="why_1.0"/>

代码中以 `gl_` 开头的变量都是 GLSL 的**内建变量**，`gl_Position` 表示顶点的最终位置。主函数的第一行
```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition, 1.0);
```
将传入的 `vaPosition` 转换为四维向量，并将多出来的第四分量赋上 `1.0` （你会在第二章了解到为什么需要这样做），然后和传入的两个矩阵相乘，并赋值给了 `gl_Position` ，OpenGL 期望这个值落在坐标区间为 $[-1,1]$ 的投影空间 ^**[1](#note1-1 "有关这些矩阵和坐标的相关内容，我们将在几何缓冲章节详细介绍。")**^ 里，以便进行裁切。

GLSL 要求在顶点着色器中必须对 `gl_Position` 进行赋值。

最后，我们将顶点传入的颜色属性 `vaColor` 赋值给传出变量 `vColor` ：
```glsl
vColor = vaColor;
```
以将其传出到之后的程序中，因为 `in` 的变量无法同时设置为 `out`。

<p id="note1-1"/>

**[1]** 有关这些矩阵和坐标的相关内容，我们将在几何缓冲章节详细介绍。

> 顶点着色器程序会在每个顶点上都运行一次。
> 
{style="note"}

接着是片段着色器：

```GLSL
#version 330 core

in vec3 vColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}
```

和顶点着色器一样，片段着色器也需要声明 GLSL 版本。然后我们将顶点着色器传出的变量 `vColor` 传入，注意保证类型和变量名的一致，如果顶点着色器中对应的传出变量是不插值的 `flat out`，则片段着色器中应该使用 `flat in`。

接着我们定义了一个 `out` ，在片段着色器中，`out` 的变量直接输出当前像素的颜色到缓冲区上。

> 如果你想在 `compatibility` 配置下直接输出，可以使用 `gl_FragColor` 或者 `gl_FragData[]`（多个缓冲区）。

最后，在主函数中，我们给输出变量赋上了顶点颜色。GL 默认会期望我们输出的颜色值在 $[0,1]$ 上（不考虑 HDR）并约束最大值，最后在输出到屏幕上时自动将其转换为 8 位的像素颜色（$[0,255]$）

片段着色器会在每个图元覆盖的每个像素上都执行一次。

这样，整个着色器流程就大致结束了。

## GLSL 和 OpenGL 的版本对应关系

GLSL 版本与 OpenGL 密切相关，如果平台支持的 OpenGL 版本过低，则无法使用高版本的 GLSL 和它们的新特性。

<table width="700">
<tr><td>GLSL</td><td>GL</td><td>变动</td></tr>
<tr><td>110</td><td>2.0</td><td>基本功能，支持顶点和片段着色器。</td></tr>
<tr><td>120</td><td>2.1</td><td>引入 <code>gl_FragColor</code> 和 <code>gl_FragData[]</code> 。</td></tr>
<tr><td>130</td><td>3.0</td><td>移除 <code>attribute</code> 和 <code>varying</code>，引入 <code>in</code> 和 <code>out</code> 。</td></tr>
<tr><td>140</td><td>3.1</td><td>支持整数和位运算。</td></tr>
<tr><td>150</td><td>3.2</td><td>引入几何着色器（Geometry Shader）。</td></tr>
<tr><td>330</td><td>3.3</td><td>引入核心模式，移除固定功能管线。</td></tr>
<tr><td>400</td><td>4.0</td><td>引入细分着色器（Tessellation Shader）。</td></tr>
<tr><td>410</td><td>4.1</td><td>支持显式顶点属性位置（<code>layout(location = ...)</code>）。</td></tr>
<tr><td>420</td><td>4.2</td><td>支持图像加载/存储（Image Load/Store），可以对标量进行 Swizzle 操作。</td></tr>
<tr><td>430</td><td>4.3</td><td>引入计算着色器（Compute Shader）。</td></tr>
<tr><td>440</td><td>4.4</td><td>支持显式绑定点（Explicit Binding Points）。</td></tr>
<tr><td>450</td><td>4.5</td><td>支持直接状态访问（Direct State Access）。</td></tr>
</table>

## `core` 还是 `compatibility` ？

在定义 `#version` 时，我们可以在版本号后选择 `core` 和 `compatibility` 。

使用 `core` 会完全禁用固定管线，同时大多数变量都需要用户在 OpenGL 上下文中显式提供，像我们之前的顶点着色器程序中的
```glsl
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
```
就在干这个事情。同时，大多数 `gl_` 开头的内建变量都将被禁用，因为它们都来自固定管线。有关内建变量，参阅 [](a02-coreBuiltinVars.md)

若你选择了 `compatibility` 配置，可以直接使用 `gl_ModelViewMatrix` 和 `gl_ProjectionMartix` ，甚至 `vec4(vaPosition, 1.0)` 也可以直接用 `gl_Vertex` 代替：
```glsl
gl_Position = gl_ProjectionMartix * gl_ModelViewMatrix * gl_Vertex;
```

你甚至直接使用 `ftransform()` 函数直接替换这一串乘法。

但是由于这些内容都在固定管线中进行，我们对其的掌控能力较弱，而且启用固定管线也会造成一些不必要的开销。OptiFine 给我们提供了完整的数据内容，所以我们尽量使用 `core` 配置，不过部分对应变量需要 **JE 1.17** 及之后的 OptiFine 版本才能提供。

除了上述两个配置以外，我们还可以选择 `es` ，这是嵌入式和移动平台的 OpenGL ES 兼容配置，它精简了大量特性以换取高能效，但是对桌面平台用处不大，在此我们不做讨论。

## 语法糖

GLSL 支持一些 C 中不可用的便利语法，可以帮助我们更快捷地编程。

### 简化构造向量和矩阵

GLSL 允许在构造向量和矩阵时使用标量直接构造，或者在构造时混合使用标量、矢量和矩阵。

<compare first-title="构造向量" second-title="等效向量">

```glsl
vec3(1.0);
vec4(vec3(0.5), 1.0);
```
```glsl
vec3(1.0, 1.0, 1.0);
vec4(0.5, 0.5, 0.5, 1.0);
```

</compare>

<compare first-title="构造矩阵" second-title="等效矩阵">

```glsl
mat3(1.0);


mat2(vec2(1.0), vec2(2.0));
```
```glsl
mat3(1.0, 1.0, 1.0
     1.0, 1.0, 1.0
     1.0, 1.0, 1.0);
mat2(1.0, 1.0,
     2.0, 2.0);
```

</compare>

同时，GLSL 还允许简化构造对角矩阵。

<compare first-title="构造矩阵" second-title="等效矩阵">

```glsl
mat3(1.2, 0.6, 0.3);
```
```glsl
mat3(1.2, 0.0, 0.0,
     0.0, 0.6, 0.0, 
     0.0, 0.0, 0.3);
```

</compare>

以及将高维向量的额外维度丢弃并转化为低维向量。

<compare first-title="构造向量" second-title="等效向量">

```glsl
vec2(vec3(1.0, 2.0, 3.0));
```
```glsl
vec2(1.0, 2.0);
```

</compare>

### 操作分量

GLSL 允许 Swizzle 式和数组式提取分量。

<compare first-title="变量" second-title="取值">

```glsl
vec3 V = vec4(1.0, 2.0, 3.0);

mat3 M = mat3(1.0, 2.0, 3.0);


float N = 2.5;
```
```glsl
V.x  -> 1.0
V.bgb -> vec3(3.0, 2.0, 3.0)
M[0] -> vec3(1.0, 0.0, 0.0)
M[1].y -> 2.0
M[2][2] -> 3.0
N.sss -> vec3(2.5) == vec3(N) // 需要 #version 420 及以上
```

</compare>

可以使用 `xyzw`、`rgba` 和 `stpq` 中的任意一组进行 Swizzle 操作，但是不能在同一个操作中混用。它们的语义通常分别表示**空间坐标**、**颜色**和**纹理坐标**，正确地选择后缀组可以降低代码的阅读和维护门槛。

此外，GL 允许在构造向量时混用 Swizzle 和其他方法
```glsl
vec2 a = vec2(1.0, 2.0);
vec4 b = vec4(a.y, vec2(0.0), a.x);
```

> Swizzle 原意鸡尾酒~~谁家狂乱鸡尾酒~~，在这里意为重新排列（就像调酒那样），因此 _Swizzle 操作_ 也可称为 _重排操作_ 。

### 向量和矩阵乘法

向量与矩阵、矩阵与矩阵之间的乘法可以直接使用 `*` 进行运算，但是向量与向量、向量与标量之间使用 `*` 时默认进行四则运算。

```glsl
vec4 <- mat4 * vec4
mat4 <- mat4 * mat4
vec4 <- vec4 * float == float * vec4
vec4 <- vec4 * vec4
```

若想进行向量间的点乘或叉乘，可以使用 `dot()` 和 `cross()`

```glsl
float <- dot(vec4, vec4)
vec4  <- cross(vec4, vec4)
```

### 类型转换函数

GLSL **不支持** C 式类型转换，转而使用类型函数进行转换。

<compare first-title="GLSL" second-title="C">

```glsl
int a = 0;
float b = float(a);
```
```c
int a = 0;
float b = (float)a;
```
</compare>

也可以将标量直接转换到向量：

```glsl
float f = 1.0;
vec4 v = vec4(f);
```

### 数组和结构体初始化函数

GLSL 支持直接使用结构体名和数组类型函数进行初始化。

```glsl
float arr[3] = float[3](1.0, 2.0, 3.0);

struct Light {
    vec3 position;
    vec3 color;
};
Light light = Light(vec3(0.0), vec3(1.0));
```

### 编译时计算常量

GLSL 支持在编译时计算常量表达式和函数以节省运行时性能。

<compare first-title="运行时计算" second-title="编译时计算">

```glsl
const float f(float x);

float Pi = 3.14159265;
float HalfPi = Pi * 0.5;
float t = f(HalfPi);
```
```glsl
const float f(float x);

const float Pi = 3.14159265;
const float HalfPi = Pi * 0.5;
const float t = f(HalfPi);
```

</compare>

若向常量函数传入变量，该函数会自动降级为运行时计算；若函数的参数显式声明了常量，传入变量将会报错。

将下列函数和变量两两组合时：
```glsl
const float f(float x);
float g(const float x);
const float h(const float x);

const float c;
float v;
```
对应函数调用的返回结果为：
<compare first-title="调用" second-title="函数返回类型">

```glsl
f(c)
f(v)
g(c)
g(v)
h(c)
h(v)
```
```text
常量
变量
变量
<编译错误>
常量
<编译错误>
```

</compare>

### 内建函数

除了上述特性，GLSL 还内置了许多方便的函数，你可以在 [这里](https://registry.khronos.org/OpenGL-Refpages/gl4/index.php) 查阅。

其中也包含了大多数在 C 中属于 math 库的函数。

### 函数重载

GLSL 支持函数重载，即定义多个同名但不同参的函数，在调用时将会根据传参类型选择对应函数。
```glsl
float f(float x, int y);
float f(int x, int y);
float f(int x, float y);
```

### 类型

GLSL 内置了布尔类型（ `bool` ），同时支持整型向量和布尔向量（ `ivec` 、`bvec` ）。

GLSL 不支持 `static` 关键字和 `char` 类型。

GLSL 中没有无符号修饰符 `unsigned` ，取而代之的无符号整数类型是 `uint` 。

---

至此，有关 GLSL 的入门知识就差不多介绍完毕了。同时这也是本章的末尾，你应该已经对 OptiFine 和 GLSL 有一个大致的了解了。从下一章开始，我们将进入工作区并开始我们的光影创作之旅。
