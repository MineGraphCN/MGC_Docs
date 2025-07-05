# 延迟渲染初体验

<show-structure depth="2"/>

<tldr>

在上一章中，我们已经对 OptiFine 光影和编程语言 GLSL 有了一个大致的了解，并且还配置好了工作环境。

从本章开始，我们就正式进入光影的编写了。我们将会从延迟处理开始，了解理论机制、认识几何缓冲，并最终实现一些简单的效果。

在 [](0-2-filePipeline.md) 中我们有提到过，延迟处理在每一轮几何缓冲之后运行。当光影中着色器文件不存在时，OptiFine 会将它们回退到内置实现，这也给了我们从延迟处理开始理由——我们可以专注于了解着色器的工作原理，而不必先去思考复杂的算法部分。

</tldr>

## 第一个着色器

还记得 OptiFine 管线输出的最末端是哪个程序吗？没错就是延迟处理程序 `final` 。它在管线的最末端，并且只有一个输出，从这里开始了解延迟处理阶段再合适不过了。那么现在让我们在工作区先新建 `final.vsh` 和 `final.fsh` 来上手试试吧。

### 铺好画布

还记得我们在 [](shaderBasic.md#延迟渲染法) 提到的概念（如果你没看过最好去瞅两眼）吗？延迟处理传入的几何是一个**铺屏四边形**，在 OptiFine 中它覆盖二维平面 $(0,0)$ 到 $(1,1)$ 的矩形区域，而窗口的坐标范围是 $[-1,1]$ ^**1**^，那么我们的顶点着色器就很简单了：

```glsl
#version 330 core

in vec3 vaPosition;

void main() {
    gl_Position = vec4(vaPosition.xy * 2.0 - 1.0, 0.0, 1.0);
}
```
{collapsed-title="final.vsh" collapsible="true" default-state="expanded"}

看起来很多，实际上真正重要的内容只有 `vaPosition.xy * 2.0 - 1.0` ，它将顶点从 $[0,1]$ 变换到了 $[-1,1]$ 。

**[1]** 在几何缓冲章节我们将详细介绍，在这里你只需要知道 OpenGL 期望所有的顶点坐标都落在 $[-1,1]$ 区间内就行了。

现在，我们就可以在这张空白画布上大展拳脚了。

### 泼上一些颜色

来到我们的片段着色器，把输出变量随意设置一个颜色看看效果：

```glsl
#version 330 core

out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0); // 画一些红色
}
```
{collapsed-title="final.fsh" collapsible="true" default-state="expanded"}

并按下 <shortcut>F3</shortcut><shortcut>R</shortcut> 重载光影。然后，你就已经可以在游戏窗口中看到光影的效果了：

![画一些红色](deferred_drawRed.webp){width="700"}

哇哦！真的是好……呃，纯正的红啊！当然，只靠这种固定纯色是没法画出场景的，我们需要更多数据。具体点说，会基于像素坐标变化的数据……比如，图像。

## 采样纹理

在 GLSL 中，我们通过**采样**（Sampling）来获取图像颜色数据，每次采样可以获取图像对应坐标上的颜色，或者说至多四个通道（RGBA）的数据。

> 我们使用得更多的叫法是**纹理**（Texture）而不是**图像**（Image），后者在 GLSL 中实际上是另一种读写更为自由类型，我们将在之后的章节中认识它。

### 缓冲区

几何缓冲输出了内容的缓冲区就充当了我们采样要用的纹理，即缓冲区是几何缓冲向延迟处理传递信息的媒介：

$$
几何缓冲 \xrightarrow{原始数据} 缓冲区 \xrightarrow{缓存数据} 延迟处理
$$

每个缓冲区的默认尺寸都和屏幕分辨率相当，OptiFine 提供了至多 16 个（通常我们只用一半）二维缓冲区供我们使用。由于我们没有自己编写几何缓冲，内置管线默认使用向前渲染法将所有场景输出到了 **0 号缓冲区** `colortex0` 。

现在，我们需要从这个缓冲区中将绘制的场景取出来，即每个像素都需要采样自己坐标对应的缓冲区坐标上的颜色值，然后输出就好。

著名哲学家 *维吉尔* 曾经说过：“_If you want it, then you'll have to take it._”，如果我们需要采样它，那我们就得先声明它。在 GLSL 中，我们使用**采样器**（sampler）类型来声明缓冲区：
```glsl
uniform sampler2D colortex0;
```
这行代码声明了从 GL 上下文传入的采样器类型统一变量 `colortex0` ，对应 0 号缓冲区，有了它，我们就能进行接下来的工作了。

### 纹理坐标

还记得片段着色器是如何执行的吗？它在每个图元覆盖的每个像素上运行一次，然后将处理结果写入指定缓冲区或屏幕的对应坐标。那么，我们要怎样才能知道当前像素的坐标以采样正确的位置呢？

幸运的是，我们有办法，而且还不止一种。第一种办法，我们直接利用 OptiFine 提供的顶点属性 `vaUV0` ^**1**^，它提供了当前顶点对应的纹理坐标。我们只需要在顶点着色器中传入这个变量，然后赋给传出到片段着色器的变量即可：
```glsl
[...]
in vec2 vaUV0;
out vec2 uv;

void main() {
    [...]
    uv = vaUV0;
}
```
**[1]** UV 是纹理坐标的俗称。

顶点数据默认会在输出到片段着色器时进行插值，纹理坐标自然就平滑了。接着，我们在片段着色器中传入同名变量：
```glsl
in vec2 uv;
```
这样，我们就获取到了采样纹理所需要的**归一化坐标**（也可称为相对坐标）。

> 在延迟渲染中，OptiFine 传入的顶点坐标实际上和纹理坐标是对齐的，因此在之前的顶点着色器中，`vaPosition.xy` 也可以直接使用 `vaUV0` 代替。

现在来回想一下，铺屏四边形完全覆盖了屏幕，也就意味着它的纹理坐标和屏幕坐标是一一对应的，因此这也引出了另一种办法，而且可以直接在片段着色器中完成。

首先我们需要 GLSL 的另一个内建变量 `gl_FragCoord` ，它指定了当前像素在窗口内的空间坐标。由于我们只关注像素在屏幕上的二维位置，因此我们只关心它的 $xy$ 分量。`gl_FragCoord.xy` 的单位尺度为像素，每个像素的中央都落在其索引坐标 ^**1**^ 加 0.5 上，因此它会随着分辨率的变化而变化。

那么我们应该如何求得其归一化坐标呢？这里我们需要 OptiFine 提供的两个统一变量：`viewWidth` 和 `viewHeight` ，它们以像素为单位表示了窗口的宽度和高度。

于是我们的归一化纹理坐标 `uv` 就可以求得了：
```glsl
uniform float viewWidth;
uniform float viewHeight;
vec2 uv = gl_FragCoord.xy / vec2(viewWidth, viewHeight);
```

**[1]** 像素从左下角开始的横纵方向上的序号（即从 $(0,0)$ 开始的索引）组成的坐标。

### 把它们画出来

有了采样器和采样坐标，我们就可以很方便地在 GLSL 中采样纹理了，隆重介绍我们的劳模函数：<code>texture(<i>g</i>sampler<sup><b>1</b></sup> tex, <i>g</i>vec coord)</code> 。`texture()` 接受两个参数：采样器和与采样器同维的归一化坐标，它会返回纹理对应坐标上的颜色值。

> 你可能会有点晕，我们不是 _采样_ 一张 _纹理_ 吗，怎么到最后变成了 _纹理_（名作动？）一个 _采样器_ 了？
>
> `texture()` 的意义是“告诉采样器（`sampler2D colortex0`），我们需要对应纹理单元 ID 的缓冲区（`colortex0` → 0 号缓冲区）上特定位置（`uv`）的纹理像素”这样的一个行为，目的是**获取纹理像素**。
>
> ~~你硬要钻牛角尖那也没办法，GLSL 就是这么神奇（~~

**[1]** 在 OpenGL 中，带有 _`g`_ 前缀的类型表示有多种可选子类型，通常包括整型前缀 `i`，无符号前缀 `u` 和布尔前缀 `b`，默认无前缀的则通常是浮点类型。此外，这里还省略了类型的后缀，部分类型有多种后缀，通常是表示维度，比如采样器的 `2D`、`3D`、`Cube` 等和向量类型的 `2`、`3`、`4`。

现在，让我们修改片段着色器，试着向屏幕上输出场景：
```glsl
#version 330 core

uniform sampler2D colortex0;
uniform float viewWidth;
uniform float viewHeight;

out vec4 fragColor;

vec2 uv = gl_FragCoord.xy / vec2(viewWidth, viewHeight);

void main() {
    fragColor = texture(colortex0, uv); // 采样纹理
}
```
{collapsible="true" collapsed-title="final.fsh" default-state="expanded"}

![第一次采样纹理](deferred_firstSampling.webp){width="700"}

What Amazing！我们成功向屏幕输出了 0 号缓冲区的内容！

> 事实上默认输出到屏幕上的就是 0 号缓冲区，只不过我们在之前的 `final.fsh` 中把内容覆写成了纯色。

然而，我们其实不止有一种采样函数。如果你在之前我们用索引坐标求归一化坐标时也想过：有没有更简单的办法，直接用索引坐标进行采样呢？

那么这里就将向你介绍另一个采样函数：`texelFetch()` 。`texelFetch()` 和 `texture()` 很相似（更准确地说是和它的兄弟 `textureLod()` 相似），前者接受三个参数：采样器、同维采样**索引坐标**，以及一项额外的 Mipmap 等级。

第三个参数我们在这里不过多展开，你只需要知道它接受一个 `int` 值用于指定纹理细节等级，从级别 0 开始，每高一级纹理的精度就会减半。

值得注意的是，`texelFetch()` 的第二个参数要求传入**整数向量**类型（ `ivec` ），而 `gl_FragCoord` 实际上是**浮点向量**类型（坐标是连续的），因此在使用时我们需要进行转换：
```glsl
fragColor = texelFetch(colortex0, ivec2(gl_FragCoord.xy), 0);
```

和 `texture()` 不同的是，使用 `texture()` 进行采样时，由于其使用浮点坐标，如果它的采样坐标在纹理的像素之间就会自动进行插值；而 `texelFetch()` 由于使用了整型坐标，它的采样点不会产生偏移，也就不会自动插值了。你可以将它们的坐标参数同时除以一个数（相当于放大纹理）来验证具体区别：

`texture()`
:
```glsl
fragColor = texture(colortex0, uv / 8.0);
```
![插值采样](deferred_texture8x.webp){width="700"}

`texelFetch()`
:
```glsl
fragColor = texelFetch(colortex0, ivec2(gl_FragCoord.xy) / 8, 0);
```
![临近采样](deferred_texelFetch8x.webp){width="700"}

可以很明显地看到，`texture()` 采样出来的画面比较模糊，而 `texelFetch()` 则棱角分明 ~~，像素颗颗饱满~~ 。大多数时候，我们还是期望采样纹理时进行自动插值的，因此在本教程中，如无必要，我们都将使用 `texture()` 。

> 如果你想要使用索引坐标和 `texture()` 函数，可以使用 `sampler2DRect` 类型。

### 处理颜色

现在我们已经将颜色从纹理上采样了出来，可是这和原版的画面没什么区别，于是你自然而然就会想：何不可以对颜色做一些处理，比如……转换为灰度？要想将画面转化为灰度，我们需要考虑像素的每个色彩分量，并按一定比例将它们混合起来。亮度的权重公式为
$$
29.9 \% R + 58.7 \% G + 11.4 \% B
$$
我们可以将权重和颜色向量**点乘**：
$$
(R,G,B) \cdot (0.299,0.587,0.114)
$$
如果你不记得（或者没学过）向量点乘公式的话，它是这样的：
$$
\text{dot}(\vec{A}, \vec{B}) = \vec{A} \cdot \vec{B} = x_A x_B + y_A y_B + z_A z_B + ...
$$
于是我们的代码就出来了：
```glsl
const vec3 brightnessWeight = vec3(0.299, 0.587, 0.114);
vec4 color = texture(colortex0, uv);
float brightness = dot(color.rgb, brightnessWeight);
fragColor = vec4(vec3(brightness), color.a);
```
然后回到我们的游戏重载一次：

![灰度画面](deferred_gray.webp){width="700"}

画面就已经成功变成灰色了！

> 在着色器中 Alpha 通道的作用需要自行处理或者作为混合函数（我们将在之后的章节认识）的参数，而且延迟处理阶段不会进行混合，我们目前也暂时还没用到 Alpha 通道，因此它的数据我们暂时随意处置。

### 场景深度

单纯的灰色似乎有些单调，我们还有没有其他信息可以用，让这个世界变得更有层次呢？幸运的是，在没接触几何缓冲之前，我们还有一个数据可以使用：**场景深度**。如果你仔细阅读了前文可能会想：难道是 `gl_FragCoord.z` ？

实则不然。还记得吗，`gl_FragCoord` 表示的是**当前**场景的坐标，但我们现在只不过在一个铺屏四边形上采样罢了。要想获得深度，我们需要**深度图**。

OptiFine 为我们提供了多达 3 张的屏幕深度，以 `depthtex` 前缀表示。它们依次表示完整深度、不包含半透明几何的深度和不包含半透明几何与手的深度。

> 由于深度值是越远越大，你可以认为深度纹理的总值从小到大为 `depthtex0` < `depthtex1` < `depthtex2` 。

当下这个情况，我们用 `depthtex0` 就能很好地应付了。要记住，深度图只有一个通道，所以在采样时候应该只采样红色通道：
```glsl
float depth = texture(depthtex0, uv).r;
```
如果你将它输出到屏幕上，看起来会是这样：
```glsl
fragColor = vec4(depth);
```

![深度图](deferred_depthtex.webp){width="700"}

看起来白茫茫的一片，五米之外人畜不分对吧？这是因为由于进行了**透视除法**的场景深度是**非线性**的，我们会在几何缓冲章节详细介绍。现在让我们使用一个 _神奇_ 的函数，先把场景转换到**线性深度**：

```glsl
uniform float near;
uniform float far;

float LinearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0;
    return (2.0 * far * near) / (far + near - z * (far - near));
}
```
把它写成数学公式形式就是：
$$
z_{\text{Linear}} = \frac{2fn}{f+n-z_{\text{NDC}}(f-n)}, z_{\text{NDC}} = 2d-1
$$
你只需要先记住它就行了。

两个统一变量 `near` 和 `far` 分别指定了场景的近裁切平面和远裁切平面，函数会把场景深度从非线性转换为方块对齐的线性深度。然后，我们将线性深度映射到 $[0,1]$ 区间上：
```glsl
depth = LinearizeDepth(depth);
depth /= far - near;
```

这样，我们就获得了场景的归一化线性深度了：

![线性深度图](deferred_linearDepth.webp){width="700"}

在这里，我们需要用到另一个 GLSL 内建函数：`mix()` 。它用法为 `mix(值1, 值2, 混合比例)` 。其内部实现为 $\text{Mix}(a,b,x)=a\times(1-x)+b\times x$ ，因此混合比例需要约束在 $[0,1]$ 之间。

我们试着将反转的深度用作 `Mix()` 函数的混合比例，将灰度和原始颜色混合起来：
```glsl
vec3 mixedColor = mix(color.rgb, vec3(brightness), 1.0-depth);
fragColor = vec4(mixedColor, color.a);
```

回到游戏看看效果

![深度混合颜色](deferred_mixGray.webp){width="700"}

看起来就像世界中的色彩随着距离增加而逐渐出现了一样！

通过深度图，我们还能干很多事情。然而这一小节也为我们留下了许多谜团：深度图为什么是非线性的？透视除法到底干了什么？`near` 和 `far` 又是什么？

它们将在之后我们进入几何缓冲时得到解答。

## 纹理边界

既然我们能采样纹理，你们会肯定很好奇：要是采样坐标不在像素所在位置会怎么样呢？

其实很好想象，因为所有像素的偏移坐标都一样，整个画面都会往一个方向移动……等会？那本来就在纹理边缘的像素呢？

`texture()` 期望接受归一化的纹理坐标，因为纹理的尺寸是已知的，总是可以用 $[0,1]$ 表示每个像素的坐标。然而如果坐标超出了这个范围，情况会变得不可知。为了防止越界，OpenGL 为纹理提供了多种边界的处理方式：

`GL_Repeat`（GL 默认行为）
: 重复纹理内容

`GL_MIRRORED_REPEAT`
: 重复纹理内容，但是每次都会在对应轴上镜像

`GL_CLAMP_TO_EDGE`
: 纹理坐标被约束在 $[0,1]$ 之间，超出范围的坐标会重复边缘像素

`GL_CLAMP_TO_BORDER`
: 纹理坐标被约束在 $[0,1]$ 之间，超出范围的坐标会设置为用户指定的颜色

缓冲区的默认行为是 `GL_CLAMP_TO_EDGE` 。然而，在 OptiFine 管线中，我们无法控制每个纹理的边缘行为，因此约束坐标就显得很重要了。我们可以手动实现上述的四种边缘行为，同时附上将画面缩小到纵横各 1/4 后（即**提前**将 `uv` 扩大 4 倍，用于演示大于 `1.0` 的坐标处置方式）的处理结果：

`GL_Repeat`
: 将纹理坐标约束在 $[0,1]$ 上重复即可：
```glsl
uv = mod(uv, 1.0);
```
`mod()` 函数用于取第一个参数除以第二个参数的余数，相比 `%` ，它支持取浮点余数。
![重复](deferred_repeat.webp){style="block"}

`GL_MIRRORED_REPEAT`
: 根据重复次数翻转坐标：
```glsl
ivec2 times = ivec2(abs(floor(uv))); // 取得对应坐标上的循环次数
ivec2 isFlip = times % 2; // 当重复次数为奇数 = 1，偶数 = 0
ivec2 flipMul = 1 - 2 * isFlip; // 用来避免使用 if 的奇怪乘数，isFlip = 1 时翻转 uv 值
uv = vec2(isFlip) + mod(uv, 1.0) * vec2(flipMul);
```
`abs()` 函数用于取绝对值，`floor()` 用于取整数部分。
![镜像重复](deferred_repeatMirror.webp){style="block"}

`GL_CLAMP_TO_EDGE`（OptiFine 缓冲区默认行为）
: 将坐标直接约束在 $[0,1]$ ：
```glsl
uv = clamp(uv, 0.0, 1.0);
```
`clamp()` 的用法为 `clamp(变量, 下限, 上限)` 。
![裁切到边缘](deferred_clampToEdge.webp){style="block"}

`GL_CLAMP_TO_BORDER`
: 将大于 1 的坐标替换为常量颜色
```glsl
const vec4 bgColor = vec4(0.5, 0.5, 0.8, 1.0);
float isOutBound = min(abs(floor(max(uv.s, uv.t))), 1.0); // 取坐标中的大值作为混合比例，在纹理范围内取得的整数部分永远是 0，其他的取到后约束最大值到 1。
fragColor = texture(colortex0, uv);
fragColor = mix(fragColor, bgColor, isOutBound);
```
![裁切到颜色](deferred_clampToColor.webp){style="block"}

最后，我们可以将它们封装成函数，以供我们随时调用。

```glsl
vec2 uv_repeat(vec2 uv) {
    return mod(uv, 1.0);
}

vec2 uv_mirroredRepeat(vec2 uv) {
    ivec2 isFlip = ivec2(abs(floor(uv))) % 2;
    ivec2 flipMul = 1 - 2 * isFlip;
    return vec2(isFlip) + mod(uv, 1.0) * vec2(flipMul);
}

vec2 uv_clampToEdge(vec2 uv) {
    return clamp(uv, 0.0, 1.0);
}

vec2 uv_clampToColor(vec2 uv, out float isOutBound) {
    isOutBound = min(abs(floor(max(uv.s, uv.t))), 1.0);
    return clamp(uv, 0.0, 1.0);
}
```

你可能注意到了，在 `uv_clampToColor()` 中我们在声明函数参数时使用了 `out` 关键字，GLSL 允许我们这样做。当函参声明 `out` 时，表示函数中更改的值会原路返还给用作这个参数的变量，并且这个参数在函数内赋值前无法参与计算，即**只写参数**。我们可以利用这个特性来进行多个值的初始化：
```glsl
void MultiInit(out float a, out float b, float c, out float x) {
    x = a;        // 不会返回，a 未在函数中被赋值
    a = 1.0;      // 正常返回
    b = a + 1.0;  // 正常返回，a 已经被赋值
    c = 3.0;      // 不会返回
}
void main() {
    float a = 0.5;
    float b, c, x;
    MultiInit(a, b, c, x);
}
```
结果为：
```text
x 未初始化
a = 1.0
b = a + 1.0 = 2.0
c 未初始化
```

同样的，我们还可以使用 `in out` 或者 `inout` 来指定**可读可写**的参数，而单独的 `in` 就和默认行为一样，可以在函数内被更改，但不会写入传参，即**只读参数**。
```glsl
void MultiInit(inout float a, out float b, in float c, out float x) {
    x = a;        // 正常返回，a 可读可写
    a = 1.0;      // 正常返回
    b = a + 1.0;  // 正常返回
    c = 3.0;      // 不会返回，"in float c" = "float c"
}
void main() {
    float a = 0.5;
    float b, c, x;
    MultiInit(a, b, c, x);
}
```
结果为：
```text
x = a = 0.5
a = 1.0
b = a + 1.0 = 2.0
c 未初始化
```

<table width="700">
<tr><td>修饰符</td><td>读写性</td></tr>
<tr><td><code>in</code></td><td>只读，即使函数内为其赋值也不会传出（默认行为）</td></tr>
<tr><td><code>out</code></td><td>只写，即使传参带有值也不可读，除非在函数中为其赋值</td></tr>
<tr><td><code>inout</code> 或 <code>in out</code></td><td>既可以读取传参值，也可以向传参赋值</td></tr>
</table>

## 多次采样

另一个你可能会思考的问题是，我们能否采样同一个纹理多次，每次偏移一小段距离，从而绘制出更多效果？

如果你这样想了，那么恭喜你，你已经悟出了着色器中非常重要，也是很多现代特效极其依赖的采样手法：多次采样。一提到它，我们最容易想到的就是**模糊**，因为它的核心思想就是将像素的颜色**扩散**到周围，而在片段着色器中，我们可以逆向操作，将周围的像素扩散过来。

> 如果你在思考我们同时向一个缓冲区的像素进行读取和写入会不会造成冲突，GL 当然考虑到了这一点。
> 
> 每个缓冲区都依靠对应的**颜色附件**（Color Attachments）进行传递，每个缓冲区都在颜色附件中都有两份，以 `Main` 和 `Alt` 标记。每次我们读取的像素都来自 `Main` ，然后将处理结果写入 `Alt` ，并在着色器结束之后按需进行翻转。

要想进行模糊，我们最先要做的就是获取周围像素的信息。回想一下坐标，我们不能通过简单的加减整数来获取临近像素的归一化坐标，那么我们要怎样精确地取到它们呢？

答案就藏在之前的统一变量中：我们知道屏幕的尺寸！于是我们变相知道了要步进一个像素，需要在归一化坐标上移动的距离：屏幕尺寸的倒数，即是像素尺寸。
```glsl
vec2 screenSize = vec2(viewWidth, viewHeight);
vec2 pixelSize = 1.0 / screenSize;
```

接下来就很简单了，GLSL 支持 `for` 循环，我们只需要设定最大偏移量就可以采样到周围的信息：
```glsl
vec4 result;
for(int i = -2; i <= 2; ++i) {
    for(int j = -2; j <= 2; ++j) {
        vec2 uv_displaced = uv + vec2(i, j) * pixelSize;
        result = texture(colortex0, uv_displaced);
    }
}
```

但是值得注意的是，我们这里每次循环采样都把结果给替换了，这样我们永远只能获取到最后一次采样的值，显然违背了初衷。

一个简单的方法是把所有的值累加起来，然后在循环外除以循环次数，这样就求到了平均颜色：
```glsl
vec4 result;
for(int i = -2; i <= 2; ++i) {
    for(int j = -2; j <= 2; ++j) {
        vec2 uv_displaced = uv + vec2(i, j) * pixelSize;
        result += texture(colortex0, uv_displaced);
    }
}
result /= 25.0; // 5*5 次采样
```

现在让把这个值赋给我们的颜色试试：

![模糊处理](deferred_blur.webp){width="700"}

和预期一样，画面被轻微模糊了！

> 在编写循环时一定要注意不能写成死循环，否则会导致游戏崩溃！
> 
{style="warning" title="注意"}

还有一个值得注意的点是，边缘的像素偏移采样时由于超出了纹理边界，我们更期望它直接终止循环而不是继续采样。因此我们可以进行一些优化，当纹理坐标在范围外时直接跳过当前循环：

```glsl
if(max(uv_displaced.s, uv_displaced.t) > 1.0 || min(uv_displaced.s, uv_displaced.t) < 0.0) { continue; }
```

这种边界检测我们会经常使用，因此我们也可以将它封装成函数：

```glsl
bool uv_OutBound(vec2 uv) {
    return (max(uv.s, uv.t) > 1.0 || min(uv.s, uv.t) < 0.0);
}
bool uv_OutBound(vec3 uv) {
    return (max(uv.s, max(uv.t, uv.p)) > 1.0 || min(uv.s, min(uv.t, uv.p)) < 0.0);
}
```

你可能注意到我们这里重载了一个同名函数，这是因为 GL 支持三维纹理。由于 OptiFine 默认没有一维纹理，我们这里就不额外重载了（当然，你可以手动导入一维纹理，不过这离我们还太远）。

由于采样数量不一，我们得动态地求平均值，因此还需要增加一个用于计数的变量，于是采样循环就变成了：
```glsl
vec4 result;
int count = 0;
for(int i = -2; i <= 2; ++i) {
    for(int j = -2; j <= 2; ++j) {
        vec2 uv_displaced = uv + vec2(i, j) * pixelSize;
        if(uv_OutBound(uv_displaced)) { continue; }
        result += texture(colortex0, uv_displaced);
        ++count;
    }
}
result /= float(count);
```

最终效果应该是没什么差异的，但是节约了很多无效采样。

> 我们在这里使用的是矩形采样并平均求值，当半径扩大之后效果会很难看（你会在下一小节看到），更常见的做法是使用一个在采样时就保证最终的总权重和为 1 的权重函数，例如高斯（正态）分布函数。这种情况下由于权重固定，我们就应当将边界视为 `GL_CLAMP_TO_EDGE` 并进行界外采样，不可提前退出。

## 宏命令

不知道你有没有发现一个很烦人的事。假如由于模糊效果太轻微，我们现在试图扩大采样数，需要怎么做？

比如把每个方向从 5 次采样改成 7 次，我们需要把这两行改！四！次！

<compare first-title="5 次采样" second-title="7 次采样">

```glsl
for(int i = -2; i <= 2; ++i) {
for(int j = -2; j <= 2; ++j) {
```
```glsl
for(int i = -3; i <= 3; ++i) {
for(int j = -3; j <= 3; ++j) {
```

</compare>

万一一不留神改漏一个，效果出现差错，这种合法的编程疏忽可没有编译器给报错。但你应该已经注意到了，这几个值其实是相同的，那么我们有没有什么办法把它们一起修改呢？

答案就是**宏命令**。和 C 一样，GLSL 也支持很多宏命令，其中用得最多、和 OptiFine 设置页面密切相关的就是 `#define` 。我们只需要在文件开头的版本宏下再添加一行：
```glsl
#define BLUR_SAMPLES 2
```
然后将采样循环中的相关量全部替换：
```glsl
for(int i = -BLUR_SAMPLES; i <= BLUR_SAMPLES; ++i) {
for(int j = -BLUR_SAMPLES; j <= BLUR_SAMPLES; ++j) {
```
就可以轻松更改采样数了。现在让我们取每个方向 11 次模糊的较极端的值试试：
```glsl
#define BLUR_SAMPLES 5
```

![大半径模糊处理](deferred_blur_large.webp){width="700"}

和预期一样，模糊的半径更大了！

除了 `#define` 和之前介绍过的 `#version` 外，GLSL 还支持下列 C 中的常见宏
```glsl
#undef <macro>          // 取消某个宏
#ifdef <macro>          // 如果定义了某个宏
#ifndef <macro>         // 如果没有定义某个宏
#if <int>               // 可以使用整型值（布尔值本质也是整型）进行判定是否包含直到 #else 类或 #endif 的内容
#if defined <macro>     // 如果定义了某个宏，当整个程序都使用 #if defined 而不使用 #ifdef 判定某个宏时，这个宏不会写入光影设置
#if !defined <macro>    // 如果没有定义某个宏
#elif <int>             // 同条件判定 else if
#elif defined <macro>
#elif !defined <macro>
#else
#endif                  // #if 语句的结尾
#include <path>         // OptiFine 提供，原生 GLSL 不支持
```
除此之外，我们还有用来声明扩展的 `#extension <ext> : <behavior>`。宏定义可以进行嵌套，可以在 `#if` 中使用逻辑运算符，`#define` 可以不进行赋值。

## 习题

1. 尝试调整场景模糊的采样步进，让每次采样跨过多个像素。
2. 尝试利用深度信息，随着深度变化动态地增大模糊半径。记得固定采样次数（固定采样、动态步进）或钳制最大采样次数（固定步进、动态采样）！
