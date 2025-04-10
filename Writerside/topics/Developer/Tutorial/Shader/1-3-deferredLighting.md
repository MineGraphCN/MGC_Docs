# 延迟光照

<show-structure depth="2"/>

<tldr>

在本章的第一节中，我们初步体验了延迟渲染，并且留下了很多疑问：奇怪非线性深度图、神秘的线性映射函数、`gl_FragCoord` 的来由等等。

要想处理光照，我们还需要更多数据，因此我们需要手动编写几何缓冲来输出它们。

从这一节开始，我们就将正式进入几何缓冲程序。随着对几何缓冲的深入，你就能知道，上面这些问题都和空间变换密切相关。
</tldr>

## 空间与坐标系

在几何缓冲中，我们会将传入几何的顶点按照一定的方法进行坐标变换，这也是顶点着色器的核心部分。本节的内容较为复杂，但是要想编写好的着色器程序，理解空间变换的几何意义至关重要，因此请认真阅读。

[//]: # (TODO: 添加图片)

### 局部坐标

GL 传入的顶点总是从局部坐标（Local Coordinate）开始。它代表了每批几何在以其自身为原点（具体原点取决于建模和生成时）的空间中所处的位置，这个空间称为**局部空间**（Local Space）。

> 需要注意的一点时，所谓的“几何”实际上是它们的顶点拼凑出来的图形，因此这里的坐标是指每个顶点的坐标。
> 
{style="note"}

### 世界坐标

将每一批几何都放置在特定的位置，从而让几何与几何之间、几何与场景之间形成相对关系，这就形成了世界坐标（World Coordinate）。它代表了每个几何相对所有几何构成的空间中所处的位置，称为**世界空间**（World Space）。它可以通过局部坐标左乘**模型矩阵**（Model Matrix）得到。

### 视口坐标（眼坐标）

以我们观察的视角为原点，将所有几何按照特定角度位移和旋转，从而将场景移动到我们的眼前，这就形成了视口坐标（Viewport Coordinate），也被称为眼坐标（Eye Coordinate）。它代表了每个几何相对观察点所处的位置，以观察点建系，这个空间称为**观察空间**（View Space）。它可以由世界坐标左乘**观察矩阵**（View Matrix）得到。

### 投影坐标

在计算机中，若想将三维场景映射到二维的显示屏上，我们需要进行**投影**（Projecting），即将三维场景的特定区域按照特定方向投射到屏幕上，其称为**投影坐标**（Projection Coordinate）。投影坐标定义了我们场景的可视范围，包含在边界之内的场景最终都将显示在我们的屏幕上 ^**1**^ ，尽管它们之间可能互相遮挡。当投影完成后，所有处于边界之外的几何都将被裁切，因此这个空间被称为**裁切空间**（Clip Space）。它可以由视口坐标左乘**投影矩阵**（Projection Matrix）得到。

**[1]** 著名律师 _成步堂_ 曾经说过：“_要将思维逆转过来！_”。不是“边界限制了我们能看见的场景”，而是“在投影区域内就算不进行裁切我们也根本看不见边界之外的场景”。

> 投影坐标除了最近和最远边界外还包含了其他四个方向的边界（上下边界、左右边界）。在 GL 上下文中，值应该被设置为 `(0, viewWidth, 0, viewHeight, near, far)` ，这些边界构成了一个立方体。
> 
> GL 在定义裁切空间时也同时定义了渲染的分辨率，因此若它们与窗口未对齐，则会导致像素输出出现问题；若值的起止位置进行了翻转，则最终呈现的像也会被翻转。

回想一下现实生活中，透过一个固定的画框（就像窗口或者门之类的）向外看，你会发现什么？画框里侧越远（越深），能看到的景物也就越多，也即近大远小。这是因为我们是从一个点（眼睛）观察场景，同样大小的物体所占的角度会随着远离观察点而减小。

![视点透视](gbuffers_viewpoint.webp){width="700"}

这种现象被称为**场景透视**，以这种方式进行的投影被称为**透视投影**，形成的像被称为**透视视图**。与之相对的，严格按照坐标测绘，不产生近大远小的投影方式被称为**正射投影**，形成的像被称为**等轴视图**。

我们之前所说的投影坐标都基于正射投影，如果我们想要绘制透视场景，相较于一个立方体，我们需要一个**平截头体**作为边界。其推导在数学上比较复杂，在此不做讨论，你只需要记住最后至关重要的一步：**透视除法**。

在第一节中你可能会好奇，我们明明是在一个三维空间中计算场景，为什么 `gl_Position` 却是一个四维向量。实际上，它的 $w$ 分量就是所谓“透视除法”的关键：在计算场景结束之后，将其他分量都与之相除，这一步由 GL 自动执行。经由**透视投影矩阵**处理的 $w$ 分量会随几何到视平面的距离增加而增加，当其他坐标除以它时，远处坐标就会向视野中心“聚拢”，最终投影的像也就会产生偏移，形成现实生活中的透视感。

由于 GL 使用的**右手坐标系** ^**1**^，视口空间的 $z$ 值实际上都是负数，即摄像机始终面朝 $z-$ 方向，距离视平面越远 $z$ 值越小。由于深度需要随距离增加而增大，因此场景的 $z$ 值需要被翻转 ^**2**^ ，GL 在投影矩阵中执行这一步。

**[1]** 举起你的右手张开，让手掌面向自己，你的大拇指指向的右方是 $x+$ ，其他手指指向的上方是 $y+$ ，你的手掌所面朝的方向（你自己）就是 $z+$ 。  
**[2]** $z_{\text{Clip}} = -\frac{f+n}{f-n} \cdot z_{\text{View}} - \frac{2fn}{f-n}$ ，其中 $n$ 和 $f$ 分别表示近裁切平面和远裁切平面，这会造成一些场景深度的线性压缩。

> 点的局部坐标 $w$ 分量应该被设置为 $1$ ，因此当我们使用 OptiFine 提供的 `vec3 vaPosition` 时我们应该将其转换为 `vec4(vaPosition, 1.0)`。
> 
{style="note"}

### 标准化（归一化）设备坐标

事实上，透视除法还有另一个作用。还记得 GL 对标准坐标的执念吗？它希望场景中的所有的坐标最后都落在 $[-1,1]$ 的区间上，这个坐标被称为**标准化设备坐标**（Normalized Device Coordinate, NDC）。

在投影变换之后 $w_{\text{Clip}}$ 分量被设置为了 $-z_{\text{View}}$ ，于是执行透视除法变换为 $z_{\text{NDC}}$ 时的公式则是
$$
z_{\text{NDC}} = \frac{z_{\text{Clip}}}{w_{\text{Clip}}} = \frac{-\frac{f+n}{f-n} \cdot z_{\text{View}} - \frac{2fn}{f-n}}{-z_{\text{View}}} = \frac{f+n}{f-n} + \frac{2fn}{(f-n) \cdot z_{\text{View}}}
$$
觉没觉得有些熟悉？还没想起来？如果我们将它改写成 $z_{\text{NDC}}$ 关于 $z_{\text{View}}$ 的函数呢：
$$
z_{\text{View}} = \frac{2fn}{f+n-z_{\text{NDC}}(f-n)}
$$
熟悉了吧？这正是第一节中我们将深度图深度转化到线性深度的公式！如果你不明白如何取到的反函数，可以使用 [反函数计算器](https://zh.numberempire.com/inversefunctioncalculator.php) 自行尝试：
```
y=(f+n)/(f-n)+2*f*n/((f-n)*x)
```
于是场景就从 $z_{\text{View}}$ 的 $[-f,-n]$ 压缩到了 $z_{\text{NDC}}$ 的 $[-1,1]$ 。而其他两个分量的边界范围与 $|z_{\text{View}}|$ 成正比：
$$
x_{\text{Boundary}} \propto |z_{\text{View}}| , y_{\text{Boundary}} \propto |z_{\text{View}}|
$$
进行投影变换和透视除法之后，它们最终会回到 $[-1,1]$ 上，因此分量的坐标值也会在转换到 NDC 上时随着 $w_{\text{Clip}}$ 的增大而压缩。

> 你可以在 [这个演示](https://www.geogebra.org/calculator/pa7jejre) 中尝试拖动 $n$ 和 $f$ 的值来观察函数 ${z_{\text{NDC}}}(x)$ 在 $n \leq x \leq f$ 上的变化。其中 $X$ 轴表示 $w_{\text{Clip}}$ ，$Y$ 轴表示映射后的 $z_{\text{NDC}}$ 。

当转换到标准化设备坐标之后，GL 会执行**栅格化**，丢弃一切边界之外不可见的内容，然后将 `gl_FragCoord` 进行如下设置：
- $xy$ 分量设置为以窗口左下角为原点的像素位置；
- $z$ 分量设置为线性映射 ^**1**^ 到 $[0,1]$ 上（为了方便使用）的几何 $z_{\text{NDC}}$ 值；
- $w$ 分量设置为裁切空间的 $w$ 分量的倒数 ^**2**^ 。

**[1]** 使用 $z = \frac{z_{\text{NDC}}+1}{2}$ 进行映射，实际的深度仍然由于透视除法而呈非线性变化。  
**[2]** $w_{\text{Clip}}$ 没有在透视除法中与自身相除，因为最终会变成常数 $1$ 而让这个分量没有意义。因此将其设置为其倒数 $w = \frac{1}{w_{\text{Clip}}}$ ，并由 GL 进行顶点间属性的非线性插值或在片段着色器中逆执行透视除法。

### 空间变换

要想在坐标之间进行变换，我们要用到**矩阵乘法**。我们的坐标总是从局部空间开始，直到投影空间结束
$$
P_\text{Clip} \leftarrow M_\text{Projection} \cdot P_\text{View} \leftarrow M_\text{View} \cdot P_\text{World} \leftarrow M_\text{Model} \cdot P_\text{Local}
$$
然后交由 GL 自行完成透视除法
$$
P_\text{NDC} =
\begin{pmatrix}
x_\text{Clip} / w_\text{Clip} \\
y_\text{Clip} / w_\text{Clip} \\
z_\text{Clip} / w_\text{Clip}
\end{pmatrix}
$$

在 Minecraft 中，我们不使用单独的模型矩阵 $M_\text{Model}$ 或视口矩阵 $M_\text{View}$ ，而是使用混合矩阵 $M_\text{ModelView}$ 。
$$
P_\text{Clip} \leftarrow M_\text{Projection} \cdot M_\text{ModelView} \cdot P_\text{Local}
$$

> $M_\text{Model}$ 是一个位移矩阵（负责移动几何模型的位置），而 $M_\text{View}$ 是一个位移旋转矩阵（负责将场景移动到视角处并旋转到对应位置），混合矩阵将它们一步到位。

OpenGL 为我们提供了在上述几个空间中转换坐标的各种矩阵：
```glsl
uniform mat4 gbufferModelView;            //设置了摄像机变换的模型视口矩阵
uniform mat4 gbufferModelViewInverse;     //gbufferModelView 的逆
uniform mat4 gbufferPreviousModelView;    //上一帧的 gbufferModelView
uniform mat4 gbufferProjection;           //生成几何缓冲时的投影矩阵
uniform mat4 gbufferProjectionInverse;    //gbufferProjection 的逆
uniform mat4 gbufferPreviousProjection;   //上一帧的 gbufferProjection
```

除了这些固定阶段使用矩阵外，**JE 1.17+** 的核心配置中，OptiFine 还为我们提供了像内建矩阵那样根据每个程序动态设置的矩阵：
```glsl
uniform mat4 modelViewMatrix;             //模型视口矩阵，替换 gl_ModelViewMatrix，下同
uniform mat4 modelViewMatrixInverse;      //模型视口矩阵的逆
uniform mat4 projectionMatrix;            //投影矩阵
uniform mat4 projectionMatrixInverse;     //投影矩阵的逆
```

> 我们将会使用下标前缀来表示特定阶段所使用到的矩阵，$_G$ 表示几何缓冲矩阵，例如 $M_{G\text{ModelView}}$ 表示 `gbufferModelView` ；而当前着色器自动设置的着色器则没有前缀，例如 $M_{\text{ModelView}}$ 表示 `modelViewMatrix` ，就像统一变量的格式那样。
> 
> 上一帧的矩阵会以 $_P$ 前缀表示，例如 $M_{GP\text{ModelView}}$ 表示 `gbufferPreviousModelView` ；而逆矩阵则以 $^{-1}$ 上标表示，例如 $M^{-1}_{G\text{ModelView}}$ 表示 `gbufferModelViewInverse` 。
> 
> 之后我们还会使用到的阴影矩阵，会以下标前缀 $_S$ 表示，例如用 $M_{S\text{ModelView}}$ 表示 `shadowModelView` 。
> 
{style="note"}

这张图整理出了各种空间之间的相互变换方法：

<resource src="./space_conversion_bg.png">

![空间变换图](space_conversion.webp){width="700"}

</resource>

翻译自 [shaderLABS Wiki](https://shaderlabs.org/wiki/Coordinate_Spaces) ，你可以单击图片查看和保存附带深色背景的大图。该页面还提供了一个实时交互工具用于在每个空间中进行直观的变换。

## 几何缓冲

### 程序处理对象 {id="bufferTargets"}

还记得 [](0-2-filePipeline.md) 中的几何缓冲管线吗？它们各自掌管着一方水土，同时还要照顾自己那些经常摸鱼的下属管辖的几何。

`gbuffers_basic`
: 负责无厚度线框和拴绳，无厚度线框包括调试区块边界，这个阶段没有纹理，只有顶点颜色。当该程序不存在时其所属几何交由内置管线处理。

`gbuffers_line`
: 有厚度线框，包括方块选择框、碰撞箱、结构方块边框和渔线，这个阶段也没有纹理，只有顶点颜色。当该程序不存在时其所属几何交由 `basic` 处理。

`gbuffers_skybasic`
: 负责天空中的无纹理内容，包括天空、地平线、星星和虚空，其中星星也由程序生成（实际上是一个个由两个小三角形拼成的方块），无需采样纹理。当该程序不存在时其所属几何交由 `basic` 处理。

`gbuffers_textured`
: 负责大多数粒子。当该程序不存在时其所属几何交由 `basic` 处理。

`gbuffers_skytextured`
: 负责太阳和月亮。当该程序不存在时其所属几何交由 `textured` 处理。

`gbuffers_spidereyes`
: 负责原版实体发光，包括蜘蛛、幻翼、末影人和末影龙的眼睛。当该程序不存在时其所属几何交由 `textured` 处理。

`gbuffers_beaconbeam`
: 负责信标光柱。当该程序不存在时其所属几何交由 `textured` 处理。

`gbuffers_armor_glint`
: 负责盔甲附魔光效。当该程序不存在时其所属几何交由 `textured` 处理。

`gbuffers_clouds`
: 负责原版云。当该程序不存在时其所属几何交由内置管线处理。

`gbuffers_textured_lit`
: 负责发光粒子和世界边界。当该程序不存在时其所属几何交由 `textured` 处理。

`gbuffers_entities`
: 负责大多数实体。当该程序不存在时其所属几何交由 `textured_lit` 处理。

`gbuffers_entities_glowing`
: 负责发光实体的轮廓。当该程序不存在时其所属几何交由 `entities` 处理。

`gbuffers_hand`
: 负责固体几何手持方块。当该程序不存在时其所属几何交由 `textured_lit` 处理。

`gbuffers_hand_water`
: 负责半透明几何手持方块，如染色玻璃等。当该程序不存在时其所属几何交由 `hand` 处理。

`gbuffers_weather`
: 负责雨雪粒子。当该程序不存在时其所属几何交由 `textured_lit` 处理。

`gbuffers_terrain`
: 负责固体几何地形，世界中的绝大多数地形都由它接管。当该程序不存在时其所属几何交由 `textured_lit` 处理。

`gbuffers_block`
: 负责方块实体，如箱子、告示牌和物品展示框等。当该程序不存在时其所属几何交由 `terrain` 处理。

`gbuffers_damagedblock`
: 负责挖掘破坏效果。当该程序不存在时其所属几何交由 `terrain` 处理。

`gbuffers_water`
: 负责半透明几何，如水和染色玻璃等。当该程序不存在时其所属几何交由 `terrain` 处理。

### 第一个几何缓冲程序

我们的第一个几何缓冲将会围绕游戏中最为主要的世界地形（Terrain）展开，因为其特征更接近普遍几何（有顶点颜色、有实心和镂空纹理、有光照）。为了更集中精力地处理它，我们可以先将其他几何剔除掉。

回看上一节的内容，我们需要的几何大致都在 `terrain` 和 `block` 中，当几何缓冲着色器不存在时将会调用它们的父级着色器，于是我们只需要设法把 `basic` 程序设置为不输出内容，那么它下属的所有内容都会被清除。额外的，我们还需要单独将 `water` 和 `clouds` 清除，前者归属了 `terrain` ，而后者会在不存在时调用内置管线。

要想剔除一个着色器的片段内容很简单，只需要 `discard` 关键字即可，于是我们的 `gbuffers_basic.fsh`、`gbuffers_water.fsh` 和 `gbuffers_clouds.fsh` 就可以临时写成
```glsl
#version 330 core

void main() {
    discard;
}
```
就可以剔除其他几何了。

现在让我们从 `gbuffers_terrain.vsh` 开始吧。任何 GLSL 程序的第一步都一样：声明版本。接着，`gl_Position` 要求我们最终的坐标落在裁切空间中，然后交由 GL 进行透视除法，根据这条线索我们来实际上手试验一番。
```glsl
#version 330 core

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 vaPosition;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition, 1.0);
}
```
如果你跟着这样做了并且重载了一番光影，你大概会得到这样一坨随着视角变化不断闪烁的东西：

![乱七八糟的一坨黑](gbuffers_whatAMess.webp){width="700"}

怎么回事呢？这是因为地形是逐区块绘制的，因此我们还需要知道区块相对位置，同样的，OptiFine 也为我们提供了，我们只需要进行些许修改即可：
```glsl
[...]
uniform vec3 chunkOffset;
[... main ...]
gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition + chunkOffset, 1.0);
```
现在再次重载，你应该已经能从一团黑中看出一些轮廓了：

![场景剪影](gbuffers_silhouetteOfTerrain.webp){width="700"}

> 在 `compatibility` 配置下，区块的偏移和 $w$ 分量已经被设置好了，因此你只需要使用 `gl_Vertex` 乘以对应 uniform 矩阵的内建矩阵就好。

> 你可能注意到了，我们明明没有绘制天空，场景却有地平线的颜色，这是因为 0 号缓冲区的默认清空规则为覆写成雾色。

现在我们来编写片段着色器，让几何的颜色显示出来。OptiFine 为我们提供了顶点的颜色属性 `vaColor` ，我们可以直接将它传出
```glsl
[...]
in vec4 vaColor;
out vec4 vColor;
[... main ...]
vColor = vaColor;
```
然后在片段着色器传入并输出
```glsl
#version 330 core

in vec4 vColor;
out vec4 fragColor;
void main() {
    fragColor = vColor;
}
```
场景就初具雏形了：

![顶点颜色](gbuffers_vaColor.webp){width="700"}

接下来，让我们为场景添加纹理。希望你还记得，首先我们需要在顶点着色器中获取顶点的纹理坐标。和延迟处理不同，几何缓冲的顶点纹理并不和屏幕坐标完全对齐，因此我们不能使用屏幕坐标来进行采样，只能使用 OptiFine 提供的 `vaUV0` 。

此外，我们还需要一个纹理矩阵用于映射运动纹理（注意不是“动画”纹理，类似附魔光效这种平滑移动的就是运动纹理），尽管它在大部分着色器中都是一个单位矩阵，但是养成良好的初始化习惯极为重要。OptiFine 为我们提供的矩阵名为 `textureMatrix` ：
```glsl
[...]
uniform mat4 textureMatrix;
in vec2 vaUV0;
out vec2 uv;
[... main ...]
uv = vec2(textureMatrix * vec4(vaUV0, vec2(1.0)));
```
> 虽然纹理坐标的后两个分量没有用处，但是需要设置为 `1.0` 来保证矩阵乘法正确，乘法完成之后可以安全地丢弃 $zw$ 分量。
> 
{style="note"}

几何缓冲中的颜色纹理名叫 `gtexture`，在 `terrain` 中，它由所有方块贴图拼贴而成。我们只需要在片段着色器中声明它，然后像延迟处理那样采样即可：
```glsl
[...]
uniform sampler2D gtexture;
in vec2 uv;
[... main ...]
fragColor = texture(gtexture, uv);
```
然后你就会得到这样一个有些奇怪的场景，并且你会发现树叶的颜色不见了：

![纹理颜色](gbuffers_texture.webp){width="700"}

但是不要着急，还记得我们刚才传过来的 `vColor` 吗？它实际上是一个**颜色乘数**，我们只需要将它与纹理颜色相乘，魔法便出现了：
```glsl
fragColor = texture(gtexture, uv) * vColor;
```

![染色纹理](gbuffers_coloredTexture.webp){width="700"}

> 你可能会注意到丛林树叶的纹理上除了灰度还有些橙色的果子一样的带颜色的纹理。Mojang 显然忘记了把顶点颜色给乘进去会让果子也被意外染色，导致几乎无法在通常游戏中发现这个细节……而且你丛林树叶不本来就不会掉果子吗？堪称迷惑行为……

看起来有点内味了！除了一点……我们的藤蔓怎么是不透明的呢？！这是因为固体地形默认不会进行色彩混合（我们将在之后认识它），也不会根据不透明度进行任何处理。还记得 [](0-2-filePipeline.md) （没错，又是这一节，基础很重要！）的约定吗？我们所在的 `terrain` 传入的均为**固体几何**，没有渲染半透明的必要。再结合之前我们提到的可以用 `discard` 丢弃片段，你应该已经有思路了：
```glsl
if(fragColor.a == 0.0) discard;
```

![Alpha测试](gbuffers_alphatest.webp){width="700"}

完美！上面这种通过不透明度丢弃片段的操作也就是所谓的 **Alpha 测试**（Alpha Test，你可能偶尔会在各种地方看到这个名词）。你会注意到水体完全透明了，这就是将其他几何完全丢弃的效果。

> 为了避免精度问题和前期绘制疏忽导致某些像素呈现极低的不透明度而不被丢弃，我们通常不会将测试值严格设置为 `0` ，而是使用 `0.1` 之类的值。
> 
> 如果你不确定要使用多大的值，也可以直接使用 OptiFine 提供的统一变量 `alphaTestRef`：
> ```glsl
> [...]
> uniform float alphaTestRef;
> [... main ...]
> if(fragColor.a <= alphaTestRef) discard;
> ```
> 原版着色器就将大多数值设置为了 `0.1` ，有些甚至高达了 `0.5` 。因此当你试图在固体几何上绘制半透明纹理时，几何体也只会按完全透明与否显示。
>
> 此外，当片段执行 `discard` 之后，任何其他的处理都将会停止，因为片段已经不可见了。你也可以在程序的不同位置多次判定是否执行丢弃。
> 
{style="note"}

> 和顶点着色器结束自动执行透视除法类似，当我们向任意缓冲区写入场景时，片段的深度也会自动写入：
> ```glsl
> gl_FragDepth = gl_FragCoord.z; // 自动执行
> ```
> 当然，你也可以手动处理深度。

最后，不要忘记把这一节新增加的统一变量和顶点属性放入我们之前的文件夹中！

### 再探光影配置

如果你仔细看过画面的输出效果，可能会疑惑：看起来场景中已经有光照层次了啊？

这是因为原版默认会将固定管线光照（仅根据表面朝向变化的光照，不包括光照贴图）烘焙到顶点颜色上（你可以在上一节仅输出顶点颜色的场景中看出来），OptiFine 为我们提供了关闭选项，在其设置中被称为 `经典光效` 。虽然我们可以直接在光影界面将经典光效改为 `关` ，但是我们不能保证其他人也会知道需要这样做。要想强制使用不含光照的顶点色彩，仅输出场景颜色，也就是所谓的**反照率**（Albedo），我们需要回到 `shaders.properties` 再进行一些调整。

在光影配置中，我们除了可以像上一节那样自定义统一变量、调整设置屏幕外，还可以进行很多设置。要想禁用经典光效，我们只需要添加：
```properties
oldLighting = false
```
回到游戏重载光影，你就可以发现方块侧面的明暗变化已经消失了。

![关闭经典光照](gbuffers_oldLighting.webp){width="700"}

> 你可能会发现重载光影时弹出了资源包的读盘覆盖，这是因为切换经典光效需要从资源包更改顶点颜色行为。
> 
> 在经典光效行为不同的光影之间切换时会导致重载资源包，如果你在使用高内存占用的资源包则可能导致内存溢出而游戏崩溃。一个避免的办法是如果你不需要使用内置光影，就将经典光效一直设置为 `关` 。

但是你同时也会注意到，方块接触处的阴影仍然存在，这是因为平滑光照会在接触区域添加 [](shaderTech.md#vertex_ao){summary=""}（Vertex AO）。但如果只是调整 `平滑光照级别` 也会面临和经典光效一样的问题。幸运的是，OptiFine 还为我们提供了分离它们的选项：
```properties
separateAo = true
```
这个设置会将平滑光照所产生的顶点环境光遮蔽写入 Alpha 通道，这正是我们所需要的。

> 环境光遮蔽的强度不高，因此不会因为写入了 AO 而导致 Alpha 测试不通过而意外丢弃片段。
> 
> 原版 AO 只在固体几何上启用（甚至不包括实体方块），因此也不用担心影响到半透明几何和粒子几何的渲染（你可以理解为半透明渲染和顶点 AO 是二选一的）。

现在，我们就获得了场景的反照率了：

![反照率场景](gbuffers_albedo.webp){width="700"}

如果你好奇 AO 还能不能被正常渲染，可以在之前的 `final.fsh` 中尝试
```glsl
fragColor = texture(colortex0, uv);
fragColor.rgb *= fragColor.a;
```
然后你就会发现，AO 回来了，它们被妥善保存在 Alpha 通道中。但是如果你望向远处，会发现场景莫名变暗了：

![错误的AO](gbuffers_wrongAO.webp){width="700"}

这是因为 OptiFine 默认开启了多级渐近纹理（MipMap），远处纹理的颜色，包括 Alpha 通道都由于降采样而将不透明（Alpha = 255）和完全透明（Alpha = 0）的像素混合成了半透明像素。

你当然可以直接把 MipMap 调成 `关`，但是还是那个问题：你没法控制其他玩家的行为。这个问题也很好解决，由于我们不需要半透明数据，因此可以在采样纹理之后立即进行 Alpha 测试，然后将最终数据的 Alpha 通道直接更改为 AO 数据：
```glsl
fragColor = texture(gtexture, uv);
if(fragColor.a <= alphaTestRef) discard;
fragColor.rgb *= vColor.rgb;
fragColor.a = vColor.a;
```

![正确的AO](deferred_rightAO.webp){width="700"}

这样就正确了。

## 还原经典光照

希望你还没被上面的一大坨几何变换搞晕，因为接下来，我们就要进入重头戏了。要想还原经典光照，我们首先需要知道原版的光照方向和处理方法。

### 原版实现 {collapsible="true" default-state="collapsed"}

<tldr>

这一小节是可选阅读的，如果你不想看惊世智慧，只需要知道我们的原版着色器所使用的两个光照方向是 $z\pm$ 方向仰头 $45\degree$ ，用自定义统一变量写出来就是
```properties
uniform.vec3.Light0_Direction = vec3(0.0, sin(torad(45)), -sin(torad(45)))
uniform.vec3.Light1_Direction = vec3(0.0, sin(torad(45)),  sin(torad(45)))
```

同时光照强度相关的宏为：
```glsl
#define LIGHT_POWER   0.6
#define AMBIENT_LIGHT 0.4
```

其使用的函数是：
```glsl
vec4 vanillaMixLight(vec3 lightDir0, vec3 lightDir1, vec3 normal, vec4 color) {
    float light0 = max(0.0, dot(lightDir0, normal));
    float light1 = max(0.0, dot(lightDir1, normal));
    float lightAccum = min(1.0, (light0 + light1) * LIGHT_POWER + AMBIENT_LIGHT);
    return vec4(color.rgb * lightAccum, color.a);
}
```

如果你对我们的惊世智慧感兴趣，可以点击小节标题展开阅读。

</tldr>

由于原版地形直接将固定管线的光照烘焙进了顶点颜色（间接导致 OptiFine 的经典光效），而且无法直接找到光照方向的有关数据，要想完美实现原版光照，我们需要动用一些 _俺寻思之力_ 。

> 其实你也可以使用一些调试工具比如 Nsight 或者 RenderDoc 直接抓帧找到值，不过对于我们这个级别的需求来说有点大动干戈了。~~主要是还得写 Nsight 和 RenderDoc 的教程，我自己都不怎么会用（~~

访问我们的 `versions` 文件夹，将游戏的 `.jar` 本体使用压缩软件打开

![打开Jar文件](gbuffers_openJar.webp){width="700"}

然后找到压缩包内的 `\assets\minecraft\shaders\` 文件夹

![资源包着色器文件夹](gbuffers_shaderFolder.webp){width="700"}

将它们提取到 `\resourcepacks\<测试包名称>\assets\minecraft\` 。记得在 `\resourcepacks\<你的包名称>\` 下新建一个 `pack.mcmeta` 文件，然后在里面写上包数据以便游戏读取

![建立pack.mcmeta](gbuffers_packmcmeta.webp){width="700"}

```json
{
    "pack": {
        "pack_format": %latest_pack_format%,
        "description": "A common shader testing pack",
        "supported_formats": [17, %latest_pack_format%]
    }
}
```
然后在资源包中将其装载。

接着，我们使用 VS Code 将这个文件夹作为工作区打开，你可以在 `\include\light.glsl` 中找到 Mojang 用来处理光照的函数：
```glsl
#define MINECRAFT_LIGHT_POWER   (0.6)
#define MINECRAFT_AMBIENT_LIGHT (0.4)

vec4 minecraft_mix_light(vec3 lightDir0, vec3 lightDir1, vec3 normal, vec4 color) {
    float light0 = max(0.0, dot(lightDir0, normal));
    float light1 = max(0.0, dot(lightDir1, normal));
    float lightAccum = min(1.0, (light0 + light1) * MINECRAFT_LIGHT_POWER + MINECRAFT_AMBIENT_LIGHT);
    return vec4(color.rgb * lightAccum, color.a);
}
```

按下 <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>F</shortcut> 呼出工作区搜索这个函数，发现它主要在实体渲染中使用。我们可以点开渲染大多数实体的 `entity.vsh` ，可以看到向函数中传入的 `lightDir0` 和 `lightDir1` 是统一变量 `Light0_Direction` 和 `Light1_Direction` 。

如果你直接去搜索这两个统一变量，会发现所有声明它们的 `.json` 文件都将其设置为了
```json
{
  "uniforms": [
    { "name": "Light0_Direction", "type": "float", "count": 3, "values": [0.0, 0.0, 0.0] },
    { "name": "Light1_Direction", "type": "float", "count": 3, "values": [0.0, 0.0, 0.0] }
  ]
}
```
即三个标量浮点组合，也就是 `vec3(0.0)` ，但是光照方向应该是模长为 1 的向量。这是因为它们实际上并没有被设置值，只是进行了默认初始化，在着色器使用它们之前会由游戏程序为其赋值。

> 我必须得吐槽一下 Mojang 居然还在用顶点光照……不过对于四四方方的 Minecraft 原版来说似乎也确实足够了

这下麻烦大了，我们可不想大动干戈地去反编译游戏。但是别忘了：我们还可以修改着色器啊！接下来就来见识我们的惊世智慧吧。

回到我们的 `entity.vsh` ，思考一下，我们只需要找到它们的朝向就好，于是就又轮到我们的**点乘**函数 `dot()` 出场了。你可能还记得，它接受两个同维向量，并输出这两个向量的点乘值，但其实它还可以改写成 $\vec{A} \cdot \vec{B} = |\vec{A}| |\vec{B}| \cos{\theta}$ 。

这里的 $\theta$ 是向量 $\vec{A}$ 和 $\vec{B}$ 的夹角，它们的夹角越小，$\cos{\theta}$ 的值也就越接近于 $1$ 。自然而然地我们就能想到：只要能通过平面朝向和光照方向进行点乘，然后找到值为 $1$ 的方向就好！看看 Mojang 传入的顶点数据，我们一眼就能相中 `Normal` ，它是几何的法向量，也称法线，即与几何表面垂直向外的单位向量（如果你真的不知道法向量是什么的话……）。这正是我们所需要的！

现在我们就需要委屈一下我们的顶点颜色了，在程序的末端我们将其覆写为点乘数据：
```glsl
vertexColor = vec4(vec3(dot(Light0_Direction, Normal)), 1.0);
```
然后来到它的同名片段着色器文件 `entity.fsh` ，可以看到它的输出变量是
```glsl
out vec4 fragColor;
```
那么我们也可以在程序末端直接覆写：
```glsl
fragColor = vertexColor;
```
最后回到游戏，关闭 OptiFine 光影，按下 <shortcut>F3</shortcut><shortcut>T</shortcut> **重载资源包**

![固定管线光照方向](gbuffers_vanillaLightDir.webp){width="700"}

你就已经可以用自己的后脑勺（或者用第三人称正面模式，这样你就可以直接知道朝向）来找最亮的方向了。同理，`Light1_Direction` 也能这样找到。

最终你会发现，`Light0_Direction` 的方向是 $z-$ 方向抬头 $45\degree$ ，而 `Light1_Direction` 则是 $z+$ 方向。真的是毫不意外哈……

现在，让我们卸载掉测试资源包，回到我们的 OptiFine 光影，在 `shaders.properties` 中定义它们：
```properties
uniform.vec3.Light0_Direction = vec3(0.0, sin(torad(45)), -sin(torad(45)))
uniform.vec3.Light1_Direction = vec3(0.0, sin(torad(45)),  sin(torad(45)))
```

> `sin()` 函数使用弧度制。在配置文件中，角度可以使用 `torad()` 函数进行转换，它接受角度，并将它们转换为弧度。另外，你也可以使用 `todeg()` 将弧度转换为角度。
> 
> 在 GLSL 中，你可以使用 `radians()` 和 `degrees()` 函数来转换它们。
> 
{style="note"}

然后记得在 `Uniforms.glsl` 中声明它们
```glsl
uniform vec3 Light0_Direction;
uniform vec3 Light1_Direction;
```

最后，把原版着色器定义的光照强度和光照函数也拷贝到 `Settings.glsl` 和 `Utilities.glsl`
```glsl
#define LIGHT_POWER   0.6
#define AMBIENT_LIGHT 0.4
```
```glsl
vec4 vanillaMixLight(vec3 lightDir0, vec3 lightDir1, vec3 normal, vec4 color) {
    float light0 = max(0.0, dot(lightDir0, normal));
    float light1 = max(0.0, dot(lightDir1, normal));
    float lightAccum = min(1.0, (light0 + light1) * LIGHT_POWER + AMBIENT_LIGHT);
    return vec4(color.rgb * lightAccum, color.a);
}
```
> 编者习惯性移除前缀和将函数使用驼峰命名，你也可以根据自己的习惯定义它们。

### 多缓冲区输出

如果你阅读了上一小节就会知道，要想在场景中实现光照，我们还需要**几何体表面的朝向**，即**法向量**或**法线**。它是垂直于几何表面指向外侧的 [](terms.md#单位向量){summary=""} 。OptiFine 当然为我们提供了它，我们直接声明对应的顶点属性即可：
```glsl
in vec3 vaNormal;
```

和坐标一样，法线数据也需要经过空间变换。不同的是，变换法线数据时只需要改变它们的朝向，而且它们不应该受到透视投影的影响（还记得吗，透视投影在数学上是通过扭曲顶点位置实现的，因此也同时扭曲了表面朝向）。因此我们需要用到法线变换专用的**法线矩阵**（Normal Matrix）。在 OptiFine 中只需要声明：
```glsl
uniform mat3 normalMatrix;
```
最后在 `gbuffers_terrain.vsh` 中输出变换后的值：
```glsl
[...]
out vec3 vNormal;
[... main ...]
vNormal = normalMatrix * vaNormal;
```
有些未闭合的单面片（比如鲑鱼的尾巴）可能会出现顶点法线方向反向的问题 ^**1**^ ，因此我们需要将它们翻转回来。场景中的法线应该都是朝向视点所在的半球内的，另一半球朝向的几何都会被它的其他面遮挡，即法线与观察方向的夹角不会小于 $90\degree$ 。

因此我们只需要将它们和视点到片段的连线做点乘，如果你没看过上一节的话，它的几何意义是两个向量的模长与夹角余弦值的积 $|\vec{A}| |\vec{B}| \cos{\theta}$ 。因此当两个向量方向越接近，它们夹角就越小 ^**2**^，$\cos{\theta}$ 越接近 $1$ ，点积结果就越大。我们期望法向量始终在指向视点的半球内，因此如果我们发现了任何点积大于 $0$ 的结果，则说明它的法线方向反了。

**[1]** 因为只有一层顶点，法线数据只能有一个朝向，大多数面片模型比如矮草丛之类的模型 Mojang 还是考虑到了的。  
**[2]** 计算向量的夹角的时候应该将向量尾尾相连。

![翻转法线](gbuffers_normalFlip.webp){width="700"}

我们可以将视口坐标独立出来用于检查，然后再进行投影变换：
```glsl
vec4 viewPos = modelViewMatrix * vec4(vaPosition + chunkOffset, 1.0);
vNormal = normalMatrix * vaNormal;
if(dot(vNormal, viewPos.xyz) > 0.0) { vNormal = -vNormal; }
gl_Position = projectionMatrix * viewPos;
```

现在你可能会陷入一些疑惑：就算我们把它传入了片段着色器，我们能传出的也只有 `fragColor` 啊？法线数据怎么办呢？

这里就需要我们进行**多缓冲区输出**了。要想进行多缓冲区输出，最直接的办法是定义多个 `out` 值：
```glsl
out vec4 fragColor;
out vec3 normals;
```
默认情况下 OptiFine 会根据声明顺序将它们放入对应缓冲区，但是**不推荐这样做**，因为当输出缓冲区变多之后如果意外更改了声明顺序，或者想跳过缓冲区输出（比如只输出到 1 号和 3 号缓冲区），会导致很多不必要的麻烦。

一个更好的办法是使用 `layout` 关键字自己指定要输出的缓冲区。我们可以使用 `layout(location = X)` 来指定输出目标：
```glsl
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec3 normals;
```
这样我们就指定了 `fragColor` 输出到 0 号缓冲区，而 `normals` 会输出到 1 号缓冲区。

更进一步，我们可以使用 `/* DRAWBUFFERS:ABC */` 和 `/* RENDERTARGETS: A,B,C */` 来定义 `location` 的索引顺序：
```glsl
/* DRAWBUFFERS:0427 */
layout(location = 0) out vec4 output0; // 输出到 0 号缓冲区
layout(location = 1) out vec4 output1; // 输出到 4 号缓冲区
layout(location = 2) out vec4 output2; // 输出到 2 号缓冲区
layout(location = 3) out vec4 output3; // 输出到 7 号缓冲区
```
> 如果指定了缓冲区顺序，则不要让 `location` 越界，这是未定义行为。
> ```glsl
> /* DRAWBUFFERS:01 */
> layout(location = 2) out vec4 output0; // location = 2 未指定！
> ```
> 
{style="warning" title="注意"}

这两个指令的效果相同，但是前者缓冲区之间没有分隔符，因此只能指定 0 ~ 9 号缓冲区，而后者使用逗号作为分隔，可以指定所有缓冲区。
```glsl
/* DRAWBUFFERS:01 */
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec3 normals;
```
或
```glsl
/* RENDERTARGETS: 0,1 */
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec3 normals;
```
> 这两个指令依赖于 OptiFine 读取字符，因此要保证格式完全正确！
> - `/* DRAWBUFFERS:0123 */` 注释符号前后必须要有一个空格，冒号之后不能有空格，数字之间不能有空格。
> - `/* RENDERTARGETS: 0,1,2,3 */` 注释符号前后也必须要有一个空格，冒号和数字串之间要有空格，逗号和数字之间不能有空格。
> 
> 此外，当我们使用多个程序输出到不同的缓冲区时，如果不使用 `DRAWBUFFERS` 或 `RENDERTARGETS` 显式指定将要写入的缓冲区，会导致其它缓冲区内容被清除，因此你应该养成在程序输出之前显式声明的习惯！
>
{style="warning" title="注意"}

最后，我们在 `gbuffers_terrain.fsh` 中将它们输出到各自的缓冲区。需要注意的是，法线的分量范围是 $[-1,1]$ ，而缓冲区的默认格式是归一化的无符号值，在我们接触缓冲区格式之前，可以先将其转换到 $[0,1]$ 上进行存储。
```glsl
[...]
in vec3 vNormal;
[...]
/* DRAWBUFFERS:01 */
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec3 normals;
[... main ...]
fragColor = texture(gtexture, uv) * vColor;
normals = vNormal * 0.5 + 0.5;
```

回到 `final.fsh` ，如果你的操作正确，那么采样 `colortex1` 并直接输出的场景应该是这样：
```glsl
[...]
uniform sampler2D colortex1;
[... main ...]
fragColor = texture(colortex1, uv);
```

![法线场景](gbuffers_normals.webp){width="700"}

并且法线的颜色会随着视角的转动而变化。

> 由于 `colortex1` 在最早的 GLSL 光影核心模组中被期望用于输出自己缓存的深度（它以前的名字叫 `gdepth` ），所以整个缓冲区默认会清除为白色（意为最远）。

现在，我们已经在延迟渲染中拿到了所需要的全部数据，接下来就可以在延迟渲染中处理场景光照了。

### 延迟渲染处理

现在，我们就可以利用之前获得的函数和统一变量来处理光照了。由于我们的法线是视口空间，因此你需要将光照方向也变换到视口空间：
```glsl
vec3 lightDir0 = normalize(vec3(gbufferModelView * vec4(Light0_Direction, 0.0)));
vec3 lightDir1 = normalize(vec3(gbufferModelView * vec4(Light1_Direction, 0.0)));
```
所谓的光照方向就是指向光源位置的单位向量，我们使用 `normalize()` 函数就可以将向量转换为单位向量（其实我们在设置的时候就已经是单位向量了）。你会注意到我们将光照向量的第四分量设置为了 `0.0` 而不是 `1.0` ，这是因为 `gbufferModelView` 中包含了视角摇晃的位移数据
$$
M_{G\text{ModelView}} =
\begin{bmatrix}
\begin{bmatrix}
\cdots&\cdots&\cdots \\
\cdots&M_R&\cdots \\
\cdots&\cdots&\cdots
\end{bmatrix}
&
\begin{bmatrix}
\cdots \\
M_T \\
\cdots
\end{bmatrix}
\\
\matrix {0 & 0 & 0} & 1
\end{bmatrix}
$$
其中 $M_R$ 子矩阵表示旋转数据，$M_T$ 子矩阵表示位移数据。想象一下，当一个世界空间的点转换到到视口空间，我们应该同时应用摄像机的位移，让点的位置随着摄像机的移动而变化；而当一个世界空间的固定方向变换到视口空间时，由于它只是一个固有的相对方向信息，就算我们的摄像机移动，它的朝向也不会因此改变。

<table width="700">
<tr><td>数据类型</td><td><math>w</math> 分量</td><td>变换目的</td></tr>
<tr><td>位置（点）</td><td>1.0</td><td>需要随相机位移和旋转才能获得正确的相对位置</td></tr>
<tr><td>方向</td><td>0.0</td><td>只需要将其随摄像机旋转，其本身就代表了相对方向</td></tr>
</table>

当我们将向量乘入矩阵时，如果 $w$ 分量为 $1$，则最终场景将会应用位移数据
$$
\vec{P}_{\text{Point}} = M_{G\text{ModelView}} \cdot \vec{P} =
\begin{bmatrix}
M_R \cdot \begin{bmatrix}x \\ y \\ z\end{bmatrix} + M_T \\
1
\end{bmatrix}
$$
而如果 $w$ 分量为 $0$，则场景最终不会应用位移数据
$$
\vec{P}_{\text{Direction}} = M_{G\text{ModelView}} \cdot \vec{P} =
\begin{bmatrix}
M_R \cdot \begin{bmatrix}x \\ y \\ z\end{bmatrix} \\
0
\end{bmatrix}
$$
有关矩阵乘法的细节这里不再过多展开，同时也感谢 _Tahnass_ 对这一小节矩阵相关原理的解释！

> $M_{G\text{ModelView}}$ 的 _Model_ 部分实际上只包含了视角摇晃的位移数据，而不像 $M_{\text{ModelView}}$ 那样还涵盖世界坐标的位移数据。

然后将它们传入之前的函数中，就能看到，场景光照回来了！
```glsl
vec4 albedo = texture(colortex0, uv);
vec3 normal = texture(colortex1, uv).rgb * 2.0 - 1.0; // 记得把法线转换回 [-1,1] 上！
fragColor = vanillaMixLight(lightDir0, lightDir1, normal, albedo);
```

![方向光照场景](gbuffers_deferredLighting.webp){width="700"}

如果你还没忘记之前我们拆分进 Alpha 通道的 AO，记得把它也乘回来：
```glsl
fragColor *= albedo.a;
```

至此，我们在延迟渲染中还原的原版光照就完成了！

![最终光照场景](gbuffers_final.webp){width="700"}

如果你抬头看天，会发现天空莫名变黑了，这是因为天空并没有写入法线数据，默认清除的白色与光照方向的点乘出现了问题。因此我们还要再次使用之前的 `depthtex0` 进行判定，当判定到天空（即深度为最大值的 1.0）时使用原始颜色：
```glsl
float depth = texture(depthtex0, uv).r;
[...]
if(depth == 1.0) fragColor = albedo;
```

如果你将光影和原版对比，你会发现场景的明暗变化明显更强烈，这是因为我们使用的函数实际上用于实体光照，如果你想削弱明暗差距，可以调整之前拷过来的宏的值，把它们塞进设置屏幕也是一个不错的选择。
```glsl
#define LIGHT_POWER     0.6 // [0.4 0.5 0.6 0.7 0.8]
#define AMBIENT_LIGHT   0.4 // [0.3 0.4 0.5]
```
{collapsible="true" collapsed-title="Settings.glsl" default-state="expanded"}
```properties
screen = LIGHT_POWER AMBIENT_LIGHT
sliders = LIGHT_POWER AMBIENT_LIGHT
```
{collapsible="true" collapsed-title="shaders.properties" default-state="expanded"}

## 习题

1. 尝试将法线信息转换到世界空间，记住我们在存储它们时的映射方式，以及区分法线到底是点还是方向。
2. 尝试调整光照的分量从而改变方向，如果你不确定是否为单位向量，可以使用 `normalize()` 函数归一化，但是要注意不要使用四维向量或者保持第四分量为 `0.0` 。

---

现在你已经初步掌握了如何编写几何缓冲程序，同时也了解了多缓冲区处理的方法，同时利用这些知识处理了场景的基本光照。在下一节中，我们将会利用 OptiFine 为我们提供的更多数据，着手编写实时动态光照和阴影。
