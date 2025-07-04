# 进阶延迟处理：环境

## 大气

## 环境雾

### 水平雾

### 高度衰减

### 更物理的衰减

我们假设在水平方向上的雾气分布均匀，竖直方向上随高度变化，则雾气密度变化函数及其积分为：
$$
D(y) = de^{-fy},\quad\int{D(y)}\mathrm{d}y = \frac{d}{fe^{fy}}
$$
其中 $y$ 表示高度，$d$ 表示雾气基础密度，$f$ 表示随高度的衰减速率。

则在视线方向上的雾气总浓度为：
$$
\begin{aligned}
\int_\limits{C}{D(y)} \mathrm{d}s &= L \cdot \int_0^1{D(y_1+t \cdot \Delta y)}\mathrm{d}t \\
&= \underbrace{\sqrt{{(\Delta x)}^2+{(\Delta y)}^2}}_L \cdot \bigg|\frac{\dfrac{d}{f{e}^{f y_2}} - \dfrac{d}{f{e}^{fy_1}}}{\Delta y}\bigg|
\end{aligned}
$$
其中积分区域 $C$ 为摄像机与目标点的连线，$L$ 表示线上的距离，$\Delta x$ 和 $\Delta y$ 分别是两点的坐标差值，该式也可以扩展到三维空间中，只需要将 $L$ 项更改为 $\sqrt{{(\Delta x)}^2+{(\Delta y)}^2+{(\Delta z)}^2}$。

在实际编程中，式中的积分项可能会出现除 0 错误，因为 GPU 不会自主处理这种极限情况，尽管我们一眼就能看出这是 $D(x,y)$ 的积分式再求导，也就是它本身。因此我们可以在编程时为其进行判定，手动在极限情况下替换函数
$$
\begin{cases}
\begin{aligned}
&D(x,y) &&,\ \mathrm{if} \lim\limits_{\Delta y \to 0} \\
&\bigg|\frac{\dfrac{d}{f{e}^{f y_2}} - \dfrac{d}{f{e}^{fy_1}}}{\Delta y}\bigg| &&,\ \text{else}
\end{aligned}
\end{cases}
$$

当然，$\Delta y$ 不必严格等于 0，考虑到半浮点精度，可以取 $10^{-6}$ 作为极限逼近。

## 高动态范围

#### 色彩空间

### 色彩映射
