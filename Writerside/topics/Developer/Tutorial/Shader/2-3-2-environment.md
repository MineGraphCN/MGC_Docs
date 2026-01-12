# 进阶延迟处理：环境

<secondary-label ref="wip"/>

<show-structure depth="3"/>

<tldr>

经过上一节的艰难跋涉，我们终于到达了光照的彼端（一部分彼端），但是还不是放松的时候，现在我们面前还有另一座大山：环境。

相较于光照的逻辑性，环境会更加注重于创造性（也就是所谓的 *俺寻思* ）。本节我们将为场景添加增加氛围和纵深感的环境雾，并进一步处理天空，来让它们随时间和地点变化，最后进入亮度范围更加广阔的世界。
</tldr>

## 雾

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
float depth_normalized = depth_linear / far;
```

这一次，我们依旧用 `mix()` 函数来进行处理，只不过我们这一次要混合的不再是饱和度，而是雾色。和天空颜色一样，OptiFine 也为我们提供了当前群系的雾色 `fogColor`：
```glsl
uniform vec3 fogColor;
[... main ...]
vec3 fogColorG = vpow(fogColorG, GAMMA); // 记得转到线性空间！
fragColor.rgb = mix(fragColor, fogColorG, pow(depth_normalized, 2));
```

你应该已经注意到了，我们使用线性深度的平方，这样可以让雾气在近处衰减得更快，以免让整个场景都雾蒙蒙的。现在我们已经可以看出很明显的场景纵深了：

![深度雾](environment_plainFog.webp){width="700"}

当然，你也能明显看出，这种雾气受镜头朝向影响，雾气边缘看起来就像是一个随着镜头运动的平面，Minecraft 早期的流畅迷雾就是如此处理的。一个更好的衰减方案，是使用场景相去视角的水平距离，而不是单纯的 Z 轴：
```glsl
float fogDensity = pow(min(length(worldPos.xz), 1.0), 2);
fragColor.rgb = mix(fragColor, fogColorG, fogDensity);
```

一定要记得钳制距离的最大值，因为归一化坐标围成的形状是矩形，对边距离最大可能会达到 $\sqrt{2}$，导致混合出错。

![水平雾](environment_ezFog.webp){width="700"}

> 如果想要方形雾气遮罩来匹配 Minecraft 的区块形状，你大可以使用 `max(worldPos.x, worldPos.z)` 来作为衰减系数，但 **JE 1.18 21w37a** 已经将区块加载范围从矩形改为了圆形。

虽然我们的场景已经初具纵深，但你很快就会发现天空也因为其处于最大深度而一并被雾气遮蔽，虽然我们可以直接使用天空判定来禁用雾气，但这会导致很难看的断层，就像原版那样。

![边界附近的物体与天空有明显断层](environment_ezFog_discardSky.webp){width="700"}

我们希望找到一种可以同时遮蔽环境和天空，还不会断层的雾气，这就是我们的下一步计划。

### 衰减

在现实中，受重力的影响，散射粒子不会在大气中均匀分布，倾向于散射环境光的大质量粒子总体分布在比较低的海拔上，而倾向于散射日光形成蓝色天空的细小分子则分布得更广。最终地平线附近被雾气遮蔽，而天空却依然清晰可见。

因此，除了水平上的衰减外，我们的雾气也还应该在竖直方向上进行衰减。之前的雾气我们都在视口空间完成，这和雾气越远越浓天然契合，然而在竖直方向上，固定海拔的雾气基本浓度不会随着视角变动而改变，因此我们需要使用**绝对世界空间**的 $y$ 轴坐标。

Minecraft 的普通世界海拔默认为 63，因此我们可以将海平面的雾气浓度设置为 1，往下不再增加，往上逐渐衰减，直到世界的建筑高度 320 层衰减至 0。当然，这些衰减方式也全凭你自己的喜好。

```glsl
float altitude = worldPos.y + cameraPosition.y;
fogDensity *= pow(remapSaturate(320.0, 63.0, altitude), 2);
```

这样，我们就完成了基本的高度雾：

![高度雾](environment_ezHeightFog.webp){width="700"}

当然，目前的雾气缺陷仍然很明显，如果我们抬头观察同一竖直线上的表面，由于高空中竖直方向上雾气浓度已趋于 0，简单地将高度雾浓度与水平雾浓度相乘会导致远处的物体变得更加清晰，而近处的物体反而被笼罩在雾中。直觉上来说，高处的物体应该消隐得更慢，但不可能比同一条线上其他近处的物体更加清晰。

![简单高度雾浓度变化](environment_ezHeightFogFalloff.webp){width="200"}

出现的问题也很正常，因为我们在水平方向上通过 _俺寻思_ 考虑到了雾气随距离远去的**累积效应**，但在竖直方向上却直接取用了片元处的雾气浓度乘数，换句话说，**没有完全考虑从视口到片元的视线上累积的雾气**。当我们斜向上看向远处时，片元的距离与雾气累积浓度的关系看起来就像这样：

![简单高度雾的距离-浓度曲线](environment_ezHeightFogProblem.svg){width="500"}

另一个问题是，简单的幂和线性衰减过于生硬。描述大气衰减的压高公式指出，地球的大气是随海拔上升呈指数衰减的，而可见性与雾气浓度也不是简单的线性关系。因此，我们需要一个能更完美地描述雾气浓度的公式。

#### 指数衰减积分雾

如果我们视同一海拔上的大气浓度为均匀，那么雾气浓度就可以改写为：

$$
D(y) = \rho e^{-fy}, \quad \int{D(y)}\mathrm{d}y = -\frac{\rho}{fe^{fy}}
$$
其中 $y$ 表示高度，$\rho$ 表示雾气基础密度，$f$ 表示随高度的衰减速率。

在视线方向上的雾气总浓度为：
$$
\begin{aligned}
D_t = \int_\limits{C}{D(y)} \mathrm{d}s &= \frac{L}{|\Delta y|} \cdot \int_{y_1}^{y_2}{D(y)}\mathrm{d}y \\
&= \underbrace{\sqrt{{(\Delta x)}^2+{(\Delta y)}^2}}_L \cdot \frac{\left|\frac{\rho}{f{e}^{f y_2}} - \frac{\rho}{f{e}^{fy_1}}\right|}{|\Delta y|} \\
&= \frac{\rho L}{f\Delta y}\left|e^{-fy_2}-e^{-fy_1}\right|
\end{aligned}
$$
其中积分区域 $C$ 为摄像机与目标点的连线，$L$ 表示线上的距离，$\Delta x$ 和 $\Delta y$ 分别是两点的相对坐标差值，$y_1$ 和 $y_2$ 表示摄像机与目标点的世界空间高度，$y_1 + \Delta y = y_2$。该式也可以扩展到三维空间中，只需要将 $L$ 项更改为 $\sqrt{{(\Delta x)}^2+{(\Delta y)}^2+{(\Delta z)}^2}$。这个公式是方向无关的，因此积分式和坐标差还要取绝对值。

> 如果你不明白为什么线积分的系数可以写成 $L / \Delta y$，不妨这样思考：
>
> 当我们的视线朝向 $y-$ 轴时，假设观察到处于 $y_0$ 的平面一点 A，那么点 A 视觉雾气的浓度即 $\int_{y_1}^{y_2}{D(y)}\mathrm{d}y$。此时头抬起 60°，视线观察到同水平面的另一点 B，那么观察点与点 B 的距离就是观察点到点 A 的两倍，此时两次观察的始末高度相同，因此在 $y$ 轴上走过的浓度变化曲线累积值相等，相当于只是走过的路径被拉伸到了两倍，因此点 B 的雾气浓度应当是点 A 的两倍。
>
> 因此，我们可以使用视线长度 $L$ 与在 $y$ 轴上的投影长度 $|\Delta y|$ 的比值 $L/|\Delta y|$ 来放缩积分。

实际应用时，这个算式可能会在视线水平时出现除 0 错误，尽管我们可以用瞪眼法看出 $\lim\limits_{\Delta y \to 0}\frac{\int D(y)\mathrm{d}y}{\Delta y} = D(y)$，但 GPU 不会自主处理这种极限情况。因此我们可以手动判定，在极限情况下替换为原函数：
$$
D_t =
\begin{dcases}
L \cdot D(y) &,\ \mathrm{如果} \lim\limits_{\Delta y \to 0} \\
\int\limits_{C}{D(y)}\mathrm{d}s &,\ \mathrm{其他}
\end{dcases}
$$
当然，考虑到浮点和除法精度，$\Delta y$ 不能严格等于 0，可以取 $10^{-12}$ 作为极限逼近。

最后的最后，求场景的可见性 $V$ 就比较简单了，它与雾气浓度相关的函数可以写成 $V = e^{-\beta L}$，其中 $\beta L$ 是与雾气和距离的相关系数，也就是我们之前求到的 $D_t$。

好了，烦人的原理部分到此为止，我们来开始翻译 GLSL 吧。为了便于随时确认，我们将公式誊写下来：
$$
V = e^{-D_t} =
\begin{dcases}
e^{-\rho Le^{-fy_2}} &,\ \mathrm{如果} \ \Delta y < 10^{-12} \\
e^{-\frac{\rho L}{f|\Delta y|}\left|e^{-fy_2}-e^{-fy_1}\right|} &,\ \mathrm{其他}
\end{dcases}
$$
这里我们取极限逼近函数使用了片元的高度 $y_2$ 而不是视口高度 $y_1$，理论上来说，这两个高差其实无所谓，只是在极端情况下 $y_2$ 能随片元的细微高差而变化。

我们先来处理公式中的那些常量和可调宏，包括自然常数 $e$、基础浓度 $\rho$ 和衰减速率 $f$。基础浓度和衰减速率我们将来都会加入设置中，因此我们用宏定义它们：
```glsl
#define FOG_BASE_DENSITY 0.1
#define FOG_HEIGHT_FALLOFF 0.02
#define FOG_START_HEIGHT -120
```
我们会在线路上进行积分，每个微元的浓度就不必太高了，衰减系数在双重指数（$e^{e^x}$）上，我们应当在千分位上微调。此外，我们还添加了一个 `FOG_START_HEIGHT` 用于偏移函数零点，它会被加到 $y_1$ 和 $y_2$ 上，在这个高度以下的海拔浓度倍率会超过 1 并指数增长。

由于自然常数 $e$ 全部都用于指数函数，GLSL 为我们提供了内建的 `exp(float x)` 来计算 $e^x$，所以我们不需要再单独声明它。

接着再来看里面的变量，说来也不多，只有片元距离 $L$、高差 $\Delta y$ 和视口与片元的海拔 $y_1, y_2$。

高差和片元距离都是相对数据，因此我们可以直接在相对世界空间求解它们。$|\Delta y|$ 非常简单，就是片元坐标的 $y$ 分量取绝对值，距离则是片元的模长。注意到距离 $L$ 总是和浓度 $\rho$ 一起出现，我们可以提前将它们合并。
```glsl
float rhoL = length(pos) * FOG_BASE_DENSITY;
float deltaY = abs(pos.y);
```
摄像机和片元的海拔可以像简单高度雾那样直接 `cameraPosition.y` 来求得，只需要再减去我们之前用来偏移浓度曲线的 `FOG_BASE_DENSITY` 就好：
```glsl
float camAltitude = cameraPosition.y - FOG_START_HEIGHT;
float height = pos.y + camAltitude;
```
最后，取上我们的极限，如果在小于极限值则使用原函数：
```glsl
bool limited = deltaY < 1e-12;
```

准备工作全部完成，可以来求 $D_t$ 了。先看原函数 $\rho Le^{-fy_2}$，拆成线性写法就是
$$\rho Le\textasciicircum(-fy_2) = \rho L\exp(-fy_2)$$
翻译成 GLSL 之后就成了
```glsl
const float f = FOG_BASE_DENSITY;
fogDensity = rhoL * exp(-f * altitude);
```
积分式 $\frac{\rho L}{f|\Delta y|}\left|e^{-fy_2}-e^{-fy_1}\right|$ 也类似，线性写法是 $$\rho L / (f|\Delta y|)\times|\exp(-fy_2)-\exp(-fy_1)|$$
翻译成 GLSL 就是
```glsl
fogDensity = rhoL / (f * deltaY) 
           * abs(exp(-f * altitude) - exp(-f * camAltitude));
```
最后，我们使用雾气的负指数作为可见性 $V=e^{-D_t}=\exp(-D_t)$
```glsl
float visibility = exp(-fogDensity);
```

需要注意，我们现在混合的是**场景可见性**而不是雾气浓度，因此要记得交换 `fogColorG` 和 `fragColor`！
```glsl
fragColor.rgb = mix(fogColorG, fragColor.rgb, visibility);
```

最终，我们完成了这个（或许）艰巨的任务，让空间蒙上了一层神秘的面纱。

![指数高度积分雾](environment_expHeightIntFog.webp){width="700"}

> 在进入下一章的体积光之前，一个让雾气看起来更鲜艳有层次的小技巧是根据光源方向权重来叠加使用天空颜色和雾色，比如
> ```glsl
> float factor = max(dot(lightDir, -viewportDir), 0.0);
> vec3 fog = skyColorG + fogColorG * pow(factor, 4);
> ```
> 
> ![染色雾气](environment_fogColor.webp){width="700"}

这些雾气性能逐级降低，因此你也可以视情况保留其他种类的雾气。

## 大气

<secondary-label ref="wip"/>

地球上有一层厚厚的大气保护着脆弱的生物圈，它不仅会散射强烈的宇宙射线，同时还会因为各种理化因素产生许多奇妙的效果。

我们之前已经完成了来自外太空的光照和贴近地表的雾气，然而目前它们仍然只是很机械地为地表提供恒定的光照和遮蔽。在这一小节中，我们会着手处理大气对它们的影响，并让纯色的天空更富活力。

### 日光、月光与环境

在第一章中，我们已经将场景的直接光照来源设置为了当前在场景中投影的太阳或月亮，然而，目前的光照颜色和亮度并不会随时间变化。在现实中，太阳光会被大气散射，从而在清晨和傍晚变得昏黄，而月光则是月亮反射来自太阳的光线，在晴朗的月圆午夜为地表提供微弱照明。

要想模拟大气光照就逃不开由瑞利散射（Rayleigh Scattering）和米氏散射（Mie Scattering）为基底构建的物理天空体系，但是就目前来说还是太过于复杂。在进入物理渲染之前，我们不妨先尝试一些 _俺寻思_ 之力来手动控制日光和月光的亮度与颜色。

正午日光色温约为 5000K (255, 231, 204)，在傍晚时则更接近 2000K (255, 141, 11)。虽然月光在现实世界中是暖色，但在艺术化作品中我们更倾向将它设置为 8000K(227, 233, 255) 的冷色。此外，不同时间段的光照亮度也会不断变化，因此我们还需要更多有关世界时间的变量。

还记得我们在第一章的某个小知识中介绍的有关时间的统一变量吗？
```glsl
uniform int worldTime;
uniform float sunAngle;
uniform float shadowAngle;
```
在游戏规则 `doDaylightCycle`^**1.21.11 25w43a** 及以前^ 或 `advance_time`^**1.21.11 25w44a** 及以后^ 为 `true` 的世界中，时间刻 `worldTime` 会在每游戏刻中增加 1，每个游戏日共 24000 时间刻，即现实世界 20 分钟。

表达太阳和投影源在天空中 _真·百分度_（1.0 = 360°）的 `sunAngle`（$\angle_\text{Sun}$） 和 `shadowAngle`（$\angle_\text{Shadow}$） 就基于世界时间，`sunAngle` 指示了太阳的位置，而 `shadowAngle` 则指示了目前投影源的位置。

- 从上个游戏日的第 23215 刻到第二个游戏日的 12785 刻，阴影空间原点在太阳位置，此时 $\angle_\text{Shadow} = \angle_\text{Sun} ∈ [0,0.5)$；
- 在 12786 刻时，太阳刚刚落到地平线以下，阴影空间原点切换到月亮位置，此时 $\angle_\text{Sun} = 0.5$、$\angle_\text{Shadow} = 0$；
- 12786 ~ 23214 刻，阴影空间原点处于月亮位置，此时 $\angle_\text{Shadow} = (\angle_\text{Sun} - 0.5) ∈ [0,0.5)$；
- 同样，在第 23215 刻时，阴影空间原点切换到太阳位置，此时 $\angle_\text{Shadow} = \angle_\text{Sun} = 0$。

OptiFine 没有直接提供月光的角度，我们可以直接使用 `moonAngle = fract(sunAngle + 0.5)` 来求得，`fract(x)` 函数的内部实现为 `x - floor(x)`，对于正数，它可以返回小数部分。

> `fract(x)` 本质上就是 `mod(x, 1.0)`，但是 `mod()` 函数更加昂贵，因此取小数部分更倾向于使用 `fract()`。

{title="小知识"}

除了时间之外，Minecraft 还存在 [月相](https://zh.minecraft.wiki/w/月亮#月相) ，当太阳被地球阻挡而无法照亮月球时，月球产生的漫反射理应减少，来自月亮的“直接”光照就会减弱。月相与世界日挂钩，从第一天的满月开始到第八天的盈凸月为一个周期。Optifine 为我们提供了月相变量：
```glsl
uniform int moonPhase;
```
它的值域为 $[0,7]$ ，在第五天月相为新月时，`moonPhase == 4`，其余时间月相的对应光照亮度以新月为中心对称，我们可以据此计算得到月相的亮度级别 `abs(moonPhase - 4)`。

当场景为满月时，$\text{亮度级别} = |\text{月相} - 4| = |0 - 4| = 4$，如果将满月时的光照系数视为 1，则可根据亮度级别求得光照系数：
```properties
uniform.float.moonLuminance = float(abs(moonPhase - 4)) / 4.0
```

> 一种更好亮度曲线是取椭圆的 $x^2+(4y)^2=4^2$ 的 $y-$ 象限弧 $y=1-\sqrt{1-\frac{\left(x-4\right)^{2}}{16}}$：
> ```properties
> uniform.float.moonLuminance = 1-sqrt(1-pow(float(moonPhase)-4.0, 2.0) / 16.0)
> ```
> 这样可以将不同月相的亮度变化规律考虑在内，曲线在满月时亮度会产生尖峰，产生冲日效应，而新月附近的亮度则衰减得更加缓慢。
> 
> 你甚至可以使用自定义的 `mod(float(worldTime - 18000) / 24000.0, 8.0)` 而不是 `moonPhase` 来让月相亮度在一天之内也不断变化。

![不同月相带来的场景亮度变化]()

### 天气

## 星空

### 群系氛围

## 高动态范围

### 色彩映射

## 习题

1. 将简单高度雾的竖直方向改写为线性衰减的积分形式。我们需要进行分段积分：
   - 如果片元和摄像机均位于 $[63,320]$，直接使用 `remap(320.0, 63.0, altitude)` 的积分式 $\int_{p_\text{cam}}^{p_\text{frag}} H_{[63,320]}=|p_\text{cam}^2-p_\text{frag}^2-640p_\text{cam}+640p_\text{frag}|$；
   - 如果片元和摄像机均位于 $[-\infty,63]$，则使用 $\int_{p_\text{cam}}^{p_\text{frag}} H_{[\infty,63]}=|p_\text{cam}-p_\text{frag}|$；
   - 如果片元和摄像机有一个位于 $[-\infty,63]$：
     - 若另一个位于 $[63,320]$，则使用 $\int_{p_\text{Low}}^{63} H_{[\infty,63]}+\int_{63}^{p_\text{High}} H_{[63,320]}$，$p_\text{Low}$ 和 $p_\text{High}$ 在两个坐标之间选择；
     - 若另一个位于 $[320, +\infty]$，则使用 $\int_{p_\text{Low}}^{63} H_{[\infty,63]}+\int_{63}^{320} H_{[63,320]}$；
   - 若片元和摄像机均位于 $[320, +\infty]$ 则没有雾气。

   最后，将它们乘入片元距离，再像简单水平雾那样进行幂次处理即可。