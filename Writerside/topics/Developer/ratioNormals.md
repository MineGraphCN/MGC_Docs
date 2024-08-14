# 比率法线及其转换

<primary-label ref="dev"/>

<secondary-label ref="new"/>

<secondary-label ref="resourcedoc"/>

<tldr>这是一种手绘法线的方法及将其转化为标准法线的算法</tldr>

## 问题

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

## 解决方案

我们拟采用一种新格式，在前期绘制时将 `r` `g` 分量视为在对应的 $x$ 、 $y$ 轴向 $z$ 轴倾斜的**比率**，若法半球在 $[-1, 1]$ 内，则 $x,y = \pm \frac{2}{3}$ 时可以获得完美的 $45\degree$ 斜角。

当绘制完成之后，我们使用算法将其转换为标准法线（Standard Normals，或 Std Normals）。

根据其按比率控制单个分量倾斜角度的特性，我们将其命名为**比率法线**（Ratio Normals）。

## 推导

我们期望法线都在半径为 $1$ 的法半球上，而比率法线的则在边长为 $2$ 的正方形上，那么就需要将 $(x, y)_{RatioNormals}$ 映射到 $(x, y, z)_{StdNormals}$。

虽然将二维映射到三维看起来有点不自量力，不过和 LabPBR 一样，我们使用 $ \sqrt{ 1 - (x^2 + y^2) } $ 重建 $z$ 分量，因此我们主要的任务是将$(x, y)_{RatioNormals}$ 映射到 $(x, y)_{StdNormals}$，看起来就简单多了。

我们将 $(x, y)_{RatioNormals}$ 记为 $(r, g)$，并将范围限制在第一象限（使用 $2x - 1$ 即可扩展到四象限），作从原点到 $(r, g)$ 的线段并延长，与矩形边界的交点为 $(R, G)$ 我们就获得了下面这张图：

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

可以知道
$$ \begin{equation}
S_z^2 + z^2 = 1
\end{equation} $$
求得
$$ \begin{equation}
z = \sqrt{1 - S_z^2}
\end{equation} $$
由法线模长为 $1$ 可知
$$ \begin{equation}
x^2 + y^2 + z^2 = 1
\end{equation} $$
于是
$$ \begin{equation}
S_z = \sqrt{x^2 + y^2}
\end{equation} $$
根据相似三角形有
$$ \begin{equation}
\frac{r}{x} = \frac{g}{y} = \frac{d}{\sqrt{x^2+y^2}} = \frac{d}{S_z} = \frac{d}{\frac{d}{D}} = D
\end{equation} $$
$$ \begin{equation}
x = \frac{r}{D}, y = \frac{g}{D}
\end{equation} $$

我们可以将转化公式写为
$$ \begin{equation}
RtS(x,y) = S_{xy} \times (x,y)_{RatioNormals} = (x,y)_{StdNormals}
\end{equation} $$
$$ \begin{equation}
S_{xy} = \frac{1}{D}
\end{equation} $$

## 优化

我们从图 1 不难看出，$R$、$G$ 中必定有一个值或两个值等于 $1$ ，同时也隐含了等于 $1$ 的边 $(R|G)$ 对应的相似边 $(r|g)$ **大于或等于**另一边 $(G|R)$ 的相似边 $(g|r)$，例如当 $R = 1$ 时，$r \geqslant g$。

当 $R = 1$ 时
$$
\frac{R}{r}= \frac{G}{g} \Rightarrow \frac{1}{r}= \frac{G}{g} \Rightarrow G = \frac{g}{r}
$$
$$
D = \sqrt{R^2+G^2} = \sqrt{1+\frac{g^2}{r^2}} = \sqrt{\frac{r^2+g^2}{r^2}}
$$
$$
S_{xy} = \frac{r \geqslant g}{\sqrt{r^2+g^2}}
$$

同理，当 $G = 1$ 时
$$
\frac{R}{r}= \frac{G}{g} \Rightarrow \frac{R}{r}= \frac{1}{g} \Rightarrow R = \frac{r}{g}
$$
$$
D = \sqrt{R^2+G^2} = \sqrt{1+\frac{r^2}{g^2}} = \sqrt{\frac{r^2+g^2}{g^2}}
$$
$$
S_{xy} = \frac{g \geqslant r}{\sqrt{r^2+g^2}}
$$

于是我们可以将 $S_{xy}$ 化简为
$$ \begin{equation}
S_{xy} = \frac{\max(r,g)}{\sqrt{r^2+g^2}}
\end{equation} $$

由于 $S_{xy}$ 的变化不是线性的，同时为了让其适配实际在 $[-1, 1]$ 区间上的法线，我们需要对函数进行处理，于是最终的函数为
$$ \begin{equation}
RtS(x,y) = \sqrt{\frac{max(|x|, |y|)}{x^2+y^2}} \times (x,y)_{RatioNormals} = (x,y)_{StdNormals}
\end{equation} $$

> 当心除零错误，记得在 $x^2 + y^2 = 0$ 时进行处理，因为此时分母也为 $0$，最简单的办法就是将 $S_{xy}$ 直接赋值为 $1$。
> 
{style="note"}

## 算法

### C++

```C++
float pow2(float x) { return x * x; }

void ratioNormal(float *img) {
    img[0] = img[0] * 2.0 - 1.0;
    img[1] = img[1] * 2.0 - 1.0;
    float addpow = pow2(img[0]) + pow2(img[1]);
    float Sxy = sqrt((max(abs(img[0]), abs(img[1]))) / addpow);
    if(!addpow) { Sxy = 1.0; }
    img[0] = img[0] * Sxy * 0.5 + 0.5;
    img[1] = img[1] * Sxy * 0.5 + 0.5;
}
```

### GLSL

> 这个解决方案并未被广泛采用过，因此我们不推荐将此算法内置于光影中，而是作为离线转换器，在前期创作时使用。
>
{style="warning" title="注意"}
```C
float pow2(float x) { return x * x; }

vec2 ratioNormal(vec2 color) {
    color = color * 2.0 - 1.0;
    float addpow = pow2(color.x) + pow2(color.y);
    float Sxy = sqrt((max(abs(color.x), abs(color.y))) / addpow);
    if(!addpow) { Sxy = 1.0; }
    color = color * Sxy * 0.5 + 0.5;
    return color;
}
```
