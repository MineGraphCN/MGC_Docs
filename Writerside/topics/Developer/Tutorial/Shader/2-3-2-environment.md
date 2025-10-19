# 进阶延迟处理：环境

<tldr>

经过上一节的艰难跋涉，我们终于让画面的光照看起来不那么刺眼了。但是还不是放松的时候，现在我们面前还有另一座大山：环境处理。

相较于光照的逻辑性，环境会更加注重于创造性（也就是所谓的 *俺寻思* ）。本节我们将为场景添加增加氛围和纵深感的环境雾并进一步处理光照，来让它们随时间和地点变化，最后将场景切入高动态范围。
</tldr>

## 环境雾

在上一节的工作中，我们成功为场景添加了还算能看的光照，但仍有一个不可忽视的问题：场景没有纵深感。在现实生活中，由于大气的存在，从远处物体进入我们眼中的光线会被空气中的小分子散射，最终看起来就像消隐进天空了一样，这些散射粒子就是所谓的雾气。雾气浓度与场景纵深挂钩，还可以在一定程度上用来遮瑕，并且单纯地绘制雾气的成本相对较低。

### 简单水平雾

雾气有很多处理方法，让我们从最简单的深度雾开始。和之前一样，说到位置信息，我们就离不开深度图。还记得我们第一章第一节中第一次体验延迟处理效果时吗？当时我们构建了一个获取线性深度图的函数 `float LinearizeDepth(float depth)` 用来处理那个奇怪的饱和度淡入特效，~~原来你一直与我同在~~。它可以返回场景的视口空间 Z 值：

```glsl
uniform float near;
uniform float far;

float LinearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0;
    return (2.0 * far * near) / (far + near - z * (far - near));
}
```

和之前的思路一样，我们需要将线性深度除以 `far` 来获取归一化线性深度：
```glsl
float depth_linear = LinearizeDepth(depth);
float depth_normalize = depth_linear / far;
```

这一次，我们依旧用 `mix()` 函数来进行处理，只不过我们这一次要混合的不再是饱和度，而是雾色。和天空颜色一样，OptiFine 也为我们提供了当前群系的雾色 `fogColor`：
```glsl
uniform vec3 fogColor;
[... main ...]
vec3 fogColorG = vpow(fogColorG, GAMMA); // 记得转到线性空间！
fragColor.rgb = mix(fragColor, fogColorG, pow(depth_normalize, 4));
```

你应该已经注意到了，我们使用线性深度的四次方，这样可以让雾气在近处衰减得更快，以免让整个场景都雾蒙蒙的。现在我们已经可以看出很明显的场景纵深了：

当然，你也能明显看出，这种雾气对镜头朝向的依赖性较高，看起来就像是一个平面，Minecraft 早期的流畅迷雾就是如此处理的。一个更好的衰减方案，是使用场景相去视角的水平距离，而不是单纯的 Z 轴：
```glsl
float fogDensity = pow(max(length(viewPos.xz), 1.0), 4);
fragColor.rgb = mix(fragColor, fogColorG, fogDensity);
```

一定要记得钳制距离的最大值，因为归一化坐标围成的形状是矩形，对边距离最大可能会达到 $\sqrt{2}$。

> 如果想要方形雾气遮罩来匹配 Minecraft 的区块形状，你大可以使用 `max(worldPos.x, worldPos.z)` 来作为衰减系数，但 **JE 1.18 21w37a** 已经将区块加载范围从矩形改为了圆形。

### 衰减

在现实中，受重力的影响，散射粒子不会在大气中均匀分布，而是更接近地表。

### 更物理的衰减

我们假设在水平方向上的雾气分布均匀，竖直方向上随高度呈指数变化，则雾气密度变化函数及其积分可以在二维平面上表示为：
$$
D(y) = de^{-fy},\quad\int{D(y)}\mathrm{d}y = -\frac{d}{fe^{fy}}
$$
其中 $y$ 表示高度，$d$ 表示雾气基础密度，$f$ 表示随高度的衰减速率。

则在视线方向上的雾气总浓度为：
$$
\begin{aligned}
\int_\limits{C}{D(y)} \mathrm{d}s &= \frac{L}{\Delta y} \cdot \int_{y_1}^{y_2}{D(y)}\mathrm{d}y \\
&= \underbrace{\sqrt{{(\Delta x)}^2+{(\Delta y)}^2}}_L \cdot \frac{\left|\frac{d}{f{e}^{f y_2}} - \frac{d}{f{e}^{fy_1}}\right|}{\Delta y}
\end{aligned}
$$
其中积分区域 $C$ 为摄像机与目标点的连线，$L$ 表示线上的距离，$\Delta x$ 和 $\Delta y$ 分别是两点的坐标差值，$y_1$ 和 $y_2$ 表示摄像机与目标点的高度，$y_1 + \Delta y = y_2$。该式也可以扩展到三维空间中，只需要将 $L$ 项更改为 $\sqrt{{(\Delta x)}^2+{(\Delta y)}^2+{(\Delta z)}^2}$。

> 如果你不明白为什么线积分的系数可以改写为 $L / \Delta y$，不妨这样思考：
> 
> 当我们的视线与 $y$ 轴平行时，假设观察到处于 $y_0$ 的平面一点 A，那么点 A 视觉雾气的浓度即 $\int_{y_1}^{y_2}{D(y)}\mathrm{d}y$。当观察点不变，视线倾斜（假设与 $y$ 轴呈 60° 夹角）时，此时如果视线观察到同平面的另一点 B，那么观察点与点 B 的距离就是观察点到点 A 的两倍，在浓度变化规律相同的情况下，点 B 的雾气浓度应当是点 A 的两倍。
> 
> 因此，我们可以使用视线在 $y$ 轴上的投影长度与其本身的倍率 $L / \Delta y$ 来放缩积分。

在实际计算中，式中的积分项可能会在视线水平时出现除 0 错误，因为 GPU 不会自主处理这种极限情况，尽管我们一眼就能看出 $\frac{\int D(y)\mathrm{d}y}{\mathrm{d}y} = D(y)$。因此我们可以在编程时为其进行判定，手动在极限情况下替换为原函数：
$$
\begin{cases}
\begin{aligned}
&L \cdot D(y) &&,\ \mathrm{if} \ \lim\limits_{\Delta y \to 0} \\
&\int{D(y)}\mathrm{d}s &&,\ \mathrm{else}
\end{aligned}
\end{cases}
$$

当然，$\Delta y$ 不能严格等于 0，考虑到浮点精度情况，可以取 $10^{-12}$ 作为极限逼近。

## 大气

[//]: # (天气、日出日落、星空等)

### 动态天气

#### 日月光照

### 外太空

### 群系氛围

## 高动态范围

#### 色彩空间

### 色彩映射
