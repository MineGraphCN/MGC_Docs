# 延迟处理光照

<secondary-label ref="wip"/>

<show-structure depth="2"/>

## 空间坐标

在本篇的第一章中，我们初步体验了延迟渲染，并且留下了很多疑问：神秘的非线性深度图、`gl_FragCoord`、以及空间变换。

从这一章开始，我们就要进入几何缓冲程序了，随着对几何缓冲的深入，上面的问题都将得到解答。

[//]: # (TODO: 添加图片)

### 局部坐标

GL 传入的顶点总是从局部坐标（Local Coordinate）开始。它代表了每批几何在以其自身为原点（具体原点取决于建模和生成时）的空间中所处的位置，这个空间称为**局部空间**（Local Space）。

> 需要注意的一点时，所谓的“几何”实际上是它们的顶点拼凑出来的图形，因此这里的坐标严格意义上是每个顶点的坐标。
> 
{style="note"}

### 世界坐标

将每一批几何都放置在特定的位置，从而让几何与几何之间、几何与场景之间形成相对关系，这就形成了世界坐标（World Coordinate）。它代表了每个几何相对所有几何构成的空间中所处的位置，称为**世界空间**（World Space）。它可以通过局部坐标左乘**模型矩阵**（Model Matrix）得到。

### 视口坐标（眼坐标）

以我们观察的视角为原点，将所有几何按照特定角度位移和旋转，从而将场景移动到我们的眼前，这就形成了视口坐标（View Coordinate），也被称为眼坐标（Eye Coordinate）。它代表了每个几何相对观察点所处的位置，以观察点建系，这个空间称为**视口空间**（View Space）。它可以由世界坐标左乘**视口矩阵**（View Matrix）得到。

### 投影坐标

在计算机中，若想将三维空间场景映射到二维的显示屏上，我们需要进行**投影**（Projecting），即将三维场景按照特定的方向投射到屏幕上，其称为**投影坐标**（Projection Coordinate）。投影坐标定义了我们场景的可视范围，包含在边界之内的场景最终都将显示在我们的屏幕上（尽管它们之间可能互相遮挡）。当投影完成后，所有处于边界之外的几何都将被裁切，因此这个空间被称为**裁切空间**（Clip Space）。它可以由视口坐标左乘**投影矩阵**（Projection Matrix）得到。

> 事实上投影坐标除了最近和最远边界外还包含了其他四个方向的边界（上下边界、左右边界）。在 GL 上下文中，值应该被设置为 `(0, viewWidth, 0, viewHeight, near, far)` ，这些边界构成了一个立方体。
> 
> GL 在定义裁切空间时也同时定义了渲染的分辨率，因此若它们与窗口未对齐，则会导致像素输出出现问题；若值的起止位置进行了翻转，则最终呈现的像也会被翻转。

### 设备标准坐标

回想一下现实生活中，透过一个固定的画框（就像窗口或者门之类的）向外看，你会发现什么？画框里侧越远（越深），能看到的景物也就越多，也即近大远小。这是因为我们是从一个点（眼睛）观察场景，而不是一个平面。这种现象被称为**场景透视**，以这种方式进行的投影被称为**透视投影**，形成的像被称为**透视视图**。与之相对的，严格按照坐标测绘，不产生近大远小的投影方式被称为**正射投影**，形成的像被称为**等轴视图**。

我们之前所说的投影坐标都基于正射投影，如果我们想要绘制透视场景，相较于一个立方体，我们需要一个**平截头体**作为边界。其推导在数学上比较复杂，在此不做讨论，你只需要记住最后至关重要的一步：**透视除法**。

在第一章中你可能会好奇，我们明明是在一个三维空间中计算场景，为什么 `gl_Position` 却是一个四维向量。实际上，它的 $w$ 分量就是所谓“透视除法”的关键：在计算场景结束之后，将所有坐标分量都除以**第四分量**，这一步由 GL 自动执行。经由**透视投影矩阵**处理的 $w$ 分量会随几何到视平面的距离增加而增加，当其他坐标除以它时，远处坐标就会向视野中心“聚拢”，最终投影的像也就会产生偏移，形成现实生活中的透视感。

> $w$ 分量的默认值是 $1$ ，因此当我们使用 OptiFine 提供的 `vec3 vaPosition` 时我们应该将其转换为 `vec4(vaPosition, 1.0)`。
> 
{style="note"}

事实上，透视除法还有另一个作用。还记得 GL 对标准坐标的执念吗？它希望场景中的所有的坐标最后都落在 $[-1,1]$ 的区间上，这个坐标被称为**设备标准坐标**（Normalized Device Coordinate, NDC），$w$ 分量在透视除法时也充当了这一角色。

### 空间变换

要想在坐标之间进行变换，我们要用到**矩阵乘法**。我们的坐标总是从局部空间开始，直到投影空间结束，
$$
P_\text{Clip} \leftarrow M_\text{Projection} P_\text{View} \leftarrow M_\text{View} P_\text{World} \leftarrow M_\text{Model} P_\text{Local}
$$
然后交由 GL 自行完成透视除法，
$$
P_\text{NDC} =
\begin{pmatrix}
x / w \\
y / w \\
z / w
\end{pmatrix}_\text{Clip}
$$

在 Minecraft 中，我们不使用单独的模型矩阵 $M_\text{Model}$ 或视口矩阵 $M_\text{View}$ ，而是使用混合矩阵 $M_\text{ModelView}$ 。
$$
P_\text{Clip} \leftarrow M_\text{Projection} M_\text{ModelView} P_\text{Local}
$$
OpenGL 为我们提供了在上述几个空间中转换坐标的各种矩阵：
```glsl
uniform mat4 gbufferModelView;            //设置了摄像机变换的模型视口矩阵
uniform mat4 gbufferModelViewInverse;     //gbufferModelView 的逆
uniform mat4 gbufferPreviousModelView;    //上一帧的 gbufferModelView
uniform mat4 gbufferProjection;           //生成几何缓冲时的投影矩阵
uniform mat4 gbufferProjectionInverse;    //gbufferProjection 的逆
uniform mat4 gbufferPreviousProjection;   //上一帧的 gbufferProjection
```

除了这些固定阶段使用矩阵外，**JE 1.17+** 的核心配置中，OptiFine 还为我们提供了像内建矩阵那样根据每个程序动态生成的矩阵：
```glsl
uniform mat4 modelViewMatrix;             //模型视口矩阵，替换 gl_ModelViewMatrix，下同
uniform mat4 modelViewMatrixInverse;      //模型视口矩阵的逆
uniform mat4 projectionMatrix;            //投影矩阵
uniform mat4 projectionMatrixInverse;     //投影矩阵的逆
```

这张图整理出了各种空间之间的相互变换方法：

<resource src="./space_conversion_bg.png">

![space_conversion.png](space_conversion.png)

</resource>

翻译自 [shaderLABS Wiki](https://shaderlabs.org/wiki/Coordinate_Spaces) ，你可以单击图片查看和保存附带深色背景的大图。该页面还提供了一个实时交互工具用于在每个空间中进行直观的变换。

## 几何缓冲

### 程序处理对象

还记得 [](0-2-filePipeline.md) 中的几何缓冲管线吗？它们各自掌管着一方水土，同时还要照顾自己那些经常摸鱼的下属管辖的几何。

`gbuffers_basic`
: 负责部分线框的渲染，包括拴绳和区块边界，这个阶段没有纹理，只有顶点颜色。当该程序不存在时其所属几何交由内置管线处理。

`gbuffers_line`
: 负责 `basic` 中没有包含的线框，包括方块选择框、碰撞箱、结构方块边框和渔线，这个阶段也没有纹理，只有顶点颜色。当该程序不存在时其所属几何交由 `basic` 处理。

`gbuffers_skybasic`
: 负责天空中的无纹理内容，包括天空、地平线、星星和虚空，其中星星也由程序生成，无需采样纹理。当该程序不存在时其所属几何交由 `basic` 处理。

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

### 第一次几何缓冲程序

我们的第一个几何缓冲将会围绕游戏中最为主要的世界地形展开，因为其特征更接近普遍几何（有顶点颜色、有实心和镂空纹理、有光照）。为了更集中精力地处理它，我们可以先将其他几何剔除掉。

回看上一节的内容，我们需要的几何大致都在 `terrain` 和 `block` 中，当几何缓冲着色器不存在时将会调用它们的父级着色器，于是我们只需要设法把 `basic` 程序设置为不输出内容，那么它下属的所有内容都会被清除。额外的，我们还需要单独将 `water` 和 `clouds` 清除，前者归属了 `terrain` ，而后者会在不存在时调用内置管线。

要想剔除一个着色器的片段内容很简单，只需要 `discard` 关键字即可，于是我们的 `gbuffers_basic.fsh` 和 `gbuffers_water.fsh` 就可以临时写成
```glsl
#version 330 core

void main() {
    discard;
}
```
就可以剔除其他几何了。现在让我们从 `gbuffers_terrain.vsh` 开始吧。

任何 GLSL 程序的第一步都一样：声明版本。接着，`gl_Position` 要求我们最终的坐标落在裁切空间中，然后交由 GL 进行透视除法，根据这条线索我们来实际上手试验一番。
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

![gbuffers_whatAMess.png](gbuffers_whatAMess.png)

怎么回事呢？这是因为地形是逐区块绘制的，因此我们还需要知道区块相对位置，同样的，OptiFine 也为我们提供了，我们只需要进行些许修改即可：
```glsl
[...]
uniform vec3 chunkOffset;
[...]
gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition + chunkOffset, 1.0);
```
现在再次重载，你应该已经能从一团黑中看出一些轮廓了：

![gbuffers_silhouetteOfTerrain.png](gbuffers_silhouetteOfTerrain.png)

> 在兼容配置下，区块的偏移和 $w$ 分量已经被设置好了，因此你只需要使用 `gl_Vertex` 乘以对应 uniform 矩阵的内建矩阵就好。

> 你可能注意到了，我们明明没有绘制天空，场景却有地平线的颜色，这是因为 0 号缓冲区的默认清空规则为覆写成雾色。

现在我们来编写片段着色器，让几何的颜色展现出来。OptiFine 为我们提供了顶点的颜色属性 `vaColor` ，我们可以直接将它传出
```glsl
[...]
in vec4 vaColor;
out vec4 vColor;
[...]
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
我们就能看见初具人形的场景了：

![gbuffers_vaColor.png](gbuffers_vaColor.png)

接下来，让我们为场景添加纹理。希望你还记得，首先我们需要在顶点着色器中获取顶点的纹理坐标。和延迟处理不同，几何缓冲的顶点纹理并不和屏幕坐标完全对齐，因此我们不能使用屏幕坐标来进行采样，只能使用 OptiFine 提供的 `vaUV0` 。

此外，我们还需要一个纹理矩阵用于映射运动纹理（注意不是动画纹理，附魔光效就是运动的），尽管它在大部分着色器中都是一个单位矩阵，但是养成良好的初始化习惯极为重要。OptiFine 为我们提供的矩阵名为 `textureMatrix` 。
```glsl
[...]
uniform mat4 textureMatrix;
in vec2 vaUV0;
out vec2 uv;
[...]
uv = vec2(textureMatrix * vec4(vaUV0, vec2(1.0)));
```
> 虽然纹理矩阵的后两个分量没有用处，但是需要设置为 $1$ 来保证矩阵乘法正确，然后可以安全地丢弃 $zw$ 分量。
> 
{style="note"}

几何缓冲中的颜色纹理名叫 `gtexture`，在 `terrain` 中，它由所有方块贴图拼贴而成。我们只需要在片段着色器中声明它，然后像延迟处理那样采样即可：
```glsl
[...]
uniform sampler2D gtexture;
in vec2 uv;
[...]
fragColor = texture(gtexture, uv);
```
然后你就会得到这样一个有些奇怪的场景，并且你会发现树叶的颜色不见了：

![gbuffers_texture.png](gbuffers_texture.png)

但是不要着急，还记得我们刚才传过来的 `vColor` 吗？它实际上是一个**颜色乘数**，我们只需要将它与纹理颜色相乘，魔法便出现了：
```glsl
fragColor = texture(gtexture, uv) * vColor;
```

![gbuffers_coloredTexture.png](gbuffers_coloredTexture.png)

看起来有点内味了！除了一点……我们的藤蔓怎么是不透明的呢？！这是因为固体地形默认不会进行色彩混合（我们将在之后认识它），也不会根据不透明度进行处理。还记得 [](0-2-filePipeline.md) （没错，又是这一章，基础很重要！）的约定吗？我们所在的 `terrain` 传入的均为**固体几何**，没有渲染半透明的必要。再结合之前我们提到的可以用 `discard` 丢弃片段，你应该已经有思路了：
```glsl
if(fragColor.a == 0.0) discard;
```

![gbuffers_alphatest.png](gbuffers_alphatest.png)

完美！上面这种通过不透明度丢弃片段的操作也就是所谓的 **Alpha 测试**（Alpha Test，你可能偶尔会在各种地方看到这个名词）。

> 为了避免精度和前期绘制问题导致某些像素呈现极低的不透明度而不被丢弃，我们通常不会将测试值严格设置为 $0$ ，而是使用 $0.1$ 之类的值。
> 
> 如果你不确定要使用多大的值，也可以直接使用 OptiFine 提供的统一变量 `alphaTestRef`：
> ```glsl
> [...]
> uniform float alphaTestRef;
> [...]
> if(fragColor.a <= alphaTestRef) discard;
> ```

## 还原原版光照

### 原版实现

### 几何法线

### 多缓冲区输出
