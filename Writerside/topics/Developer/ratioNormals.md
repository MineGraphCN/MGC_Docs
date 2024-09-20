# 比率法线及其转换

<primary-label ref="dev"/>

<secondary-label ref="new"/>

<secondary-label ref="resourcedoc"/>

<tldr>这是一种手绘法线的方法及将其转化为标准法线的算法</tldr>

## 背景

1. 法线贴图通常由软件根据纹理自动生成。然而对于低分辨率纹理，软件生成并不理想，且我们期望能精确地调控；
2. 我们很难将手绘法线的三分量控制在理想范围内，但在某一分量上增减会导致另一分量变动，不同分量上的倾斜角度也不够直观；
3. 尽管 LabPBR 将 $z$ 分量所在的 `b` 通道 [另作他用](labpbrMaterialStandard.md#textureAO){summary=""} 在一定程度上缓解了模长小于 $1$ 的问题，但是当 $x^2 + y^2 > 1$ 时，用于重建 $z$ 分量的算法 $ \sqrt{ 1 - (x^2 + y^2) } $ 将产生非实根，从而导致 <tooltip term="NaN">`NaN`</tooltip> 错误。

## 古人的智慧

[SPBR](https://modrinth.com/resourcepack/spbr) 的开发者 _Shulker_ 最初使用**手算法线表**（一张向四周发散的法线图），在其上进行取色并绘制法线。

这样虽然可以避免法线不按预期工作，但是其仍存在以下弊端：
- 依赖数据表，不好预期倾斜角度，难以保证变化曲线（特别是除中心点四方向外的法线）；
- 角度受限（取决于数据表的分辨率）；
- 由于 `b` `a` 通道另作他用，在更改法线时只能使用下列两种方法：
  1. 在 `r` `g` 通道同一位置分别使用同一数据绘制；
  2. 将 `b` `a` 通道独立，然后覆盖绘制图片，最后再将 `b` `a` 通道回覆盖。
- ~~吸色太烦人了。~~

## 解决方案 {id="sln"}

我们拟采用一种新格式，设法在前期绘制时将 `r` `g` 分量较长的分量视为 $x$ 、 $y$ 轴向 $z$ 轴倾斜的**比率**，两个分量的比值作为倾角，由此，若法半球在 $[-1, 1]$ 内，则 $x,y = \pm 0.5$ 时可以获得完美的 $45\degree$ 斜角。

当绘制完成之后，我们使用算法将其转换为标准法线（Standard Normals，简称 SN，角标使用 $(x, y)_S$ ）。

根据其按比率控制倾角的特性，我们将其命名为**比率法线**（Ratio Normals，简称 RN，角标使用 $(x, y)_R$ ）。

## 推导

我们期望法线都在半径为 $1$ 的法半球上，而比率法线的则在边长为 $2$ 的正方形上，那么就需要将 $(x, y)_{R}$ 映射到 $(x, y, z)_{S}$。

虽然将二维映射到三维看起来有点不自量力，不过和 LabPBR 一样，我们使用 $ \sqrt{ 1 - (x^2 + y^2) } $ 重建 $z$ 分量，因此我们主要的任务是将$(x, y)_{R}$ 映射到 $(x, y)_{S}$，看起来就简单多了。

我们将 $(x, y)_{R}$ 记为 $(r, g)$，并将范围限制在第一象限（使用 $2x - 1$ 即可扩展到四象限），作从原点到 $(r, g)$ 的线段并延长，与矩形边界的交点为 $(R, G)$ 我们就获得了下面这张图：

![图1](ratioNormals_1.png)

我们从图上可以知道， $(r, g)$ 与 $(R, G)$ 的关系式为
$$ \begin{equation}
\frac{R}{r}= \frac{G}{g}
\end{equation} $$
然后，我们记对角线
$$ \begin{equation}
d=\sqrt{r^2+g^2}, D = \sqrt{R^2+G^2}
\end{equation} $$
其比值为
$$ \begin{equation}
S_z = \frac{d}{D}
\end{equation} $$

则以对角线为轴（记为 $d$ 轴），与 $z$ 轴成平面，并在 $S_z$ 处作平行于 $z$ 轴交于标准圆的直线。如下图：

![图2](ratioNormals_2.png)

由于我们只能自由地控制 $r$ 和 $g$ 的值，于是期望在这个平面上的表达不要过于复杂

> 想象一下如果直接用 $S_z$ 的值来求得 $z$ 值，当我们想要获得完美的 $45\degree$ 角时，我们需要 $S_z = \sqrt{2}$ ，那么就需要 $d=\sqrt{2}D$，再反算到 $r$ 和 $g$ 上，简直头都大了。

于是我们在该平面上使用**反三角函数**来求得其**角度的比率**。

$$ \begin{equation}
\frac{S_z}{1} = \cos\theta
\end{equation} $$
于是
$$ \begin{equation}
\theta = \arccos{S_z}
\end{equation} $$
将其从 $[0, \pi]$ 映射到 $[0, 1]$ 并作为 $x$ $y$ 的放缩参数，记为 $S_{xy}$
$$ \begin{equation}
S_{xy} = \frac{\arccos{S_z}}{\pi}
\end{equation} $$

## 化简

我们从图 1 不难看出，$R$、$G$ 中必定有一个值或两个值等于 $1$ ，同时也隐含了等于 $1$ 的边 $(R|G)$ 对应的相似边 $(r|g)$ **大于或等于**另一边 $(G|R)$ 的相似边 $(g|r)$，例如当 $R = 1$ 时，$r \geqslant g$。

当 $R = 1$ 时
$$
\frac{R}{r}= \frac{G}{g} \Rightarrow \frac{1}{r}= \frac{G}{g} \Rightarrow G = \frac{g}{r}
$$
$$
D = \sqrt{R^2+G^2} = \sqrt{1+\frac{g^2}{r^2}} = \sqrt{\frac{r^2+g^2}{r^2}}
$$
$$
S_z = \frac{\sqrt{r^2+g^2}}{\sqrt{\frac{r^2+g^2}{r^2}}} = r \geqslant g
$$

同理，当 $G = 1$ 时
$$
\frac{R}{r}= \frac{G}{g} \Rightarrow \frac{R}{r}= \frac{1}{g} \Rightarrow R = \frac{r}{g}
$$
$$
D = \sqrt{R^2+G^2} = \sqrt{1+\frac{r^2}{g^2}} = \sqrt{\frac{r^2+g^2}{g^2}}
$$
$$
S_z = \frac{\sqrt{r^2+g^2}}{\sqrt{\frac{r^2+g^2}{g^2}}} = g \geqslant r
$$

于是我们可以将 $S_{xy}$ 化简为
$$ \begin{equation}
S_{xy} = \frac{\arccos{\max(r, g)}}{\pi}
\end{equation} $$

为了让其适配实际在 $[-1, 1]$ 区间上的法线，我们需要对函数进行处理，于是最终的公式就变成了
$$ \begin{equation}
RtS(x,y) = \frac{\arccos{\max(|x|, |y|)}}{\pi} \times (x,y)_{R} = (x,y)_{S}
\end{equation} $$
这样一个简洁优雅的算法。

> 当然如果想用 $\arcsin{z}$ 也可以，但是需要 $z = \sqrt{1 - S_z}$ 作为中间变量，徒增麻烦。

## 绘制比率法线

现在绘制就变得非常简单了，如 [](#sln){summary=""} 所说， `r` `g` 通道较大的一个值现在会作为法线 $z$ 分量与 $xy$ 平面的夹角比率，而 `r` `g` 通道值之间的比值则会作为在 $xy$ 平面上的倾角，由于后期需要重建，与几何表面垂直的比率法线应当是 `r = 0.5, g = 0.5` ，就和普通法线一样。

比如当 `r = 0.25, g = 0.6` 时 $z$ 分量与 $xy$ 平面的夹角就为 $ 90 \degree \times (1 - |2r - 1|) = 45 \degree $，$xy$ 平面上的角度则可以使用基本三角函数直接计算。


## 算法

### C++

```C++
#include <math.h>
const float I_Pi = 0.3183098861838; // Pi 的倒数

void ratioNormal(float *img) {
    img[0] = img[0] * 2.0 - 1.0;
    img[1] = img[1] * 2.0 - 1.0;
    float Sxy = acos((max(abs(img[0]), abs(img[1]))) * I_Pi);
    img[0] = img[0] * Sxy * 0.5 + 0.5;
    img[1] = img[1] * Sxy * 0.5 + 0.5;
}
```

### GLSL

> 这个解决方案并未被广泛采用过，并且使用了**开销极大的反三角函数**，因此我们不推荐将此算法内置于光影中，而是作为离线转换器，在前期创作时使用。
>
{style="warning" title="仅作示例"}
```C
const float I_Pi = 0.3183098861838; // Pi 的倒数

vec2 ratioNormal(vec2 color) {
    color = color * 2.0 - 1.0;
    float Sxy = acos((max(abs(color.x), abs(color.y))) * I_Pi);
    color = color * Sxy * 0.5 + 0.5;
    return color;
}
```
