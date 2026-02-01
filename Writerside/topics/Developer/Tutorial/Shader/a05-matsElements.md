# 矩阵元素

## 模型视口矩阵
<tldr>

$$
M_\text{ModelView} =
\begin{bmatrix}
S_x \cdot R_{x_\text{L}\to x_\text{V}} & S_y \cdot R_{y_\text{L}\to x_\text{V}} & S_z \cdot R_{z_\text{L}\to x_\text{V}} & T_x \\
S_x \cdot R_{x_\text{L}\to y_\text{V}} & S_y \cdot R_{y_\text{L}\to y_\text{V}} & S_z \cdot R_{z_\text{L}\to y_\text{V}} & T_y \\
S_x \cdot R_{x_\text{L}\to z_\text{V}} & S_y \cdot R_{y_\text{L}\to z_\text{V}} & S_z \cdot R_{z_\text{L}\to z_\text{V}} & T_z \\
0&0&0&1
\end{bmatrix}
$$
```glsl
M[0]     M[1]     M[2]     M[3]
S_x*R_xx S_y*R_yx S_z*R_zx T_x M[].x
S_x*R_xy S_y*R_yy S_z*R_zy T_y M[].y
S_x*R_xy S_y*R_yz S_z*R_zz T_z M[].z
0        0        0        1   M[].w
```
</tldr>

左上角 $3\times3$ 块的每一列的 $S$ 表示模型的各轴尺寸倍率，与之对应的矩阵记为**缩放矩阵**
$$
M_S =
\begin{bmatrix}
S_x&0&0&0\\
0&S_y&0&0\\
0&0&S_z&0\\
0&0&0&1
\end{bmatrix}
$$

左上角 $3\times3$ 块的每一列的 $R$ 表示模型空间的各轴（$x_\text{L}$、$y_\text{L}$、$y_\text{L}$）在视口空间的朝向（$x_\text{V}$、$y_\text{V}$、$y_\text{V}$），对应的矩阵记为**旋转矩阵**
$$
M_R =
\begin{bmatrix}
\begin{bmatrix}
R_{x_\text{V}} \\
R_{y_\text{V}} \\
R_{z_\text{V}} \\
\end{bmatrix}_{x_\text{L}}
&
\begin{bmatrix}
R_{x_\text{V}} \\
R_{y_\text{V}} \\
R_{z_\text{V}} \\
\end{bmatrix}_{y_\text{L}}
&
\begin{bmatrix}
R_{x_\text{V}} \\
R_{y_\text{V}} \\
R_{z_\text{V}} \\
\end{bmatrix}_{z_\text{L}}
&
\matrix{
0\\0\\0
}
\\
0&0&0&1
\end{bmatrix}
$$

右上角 $1\times3$ 块的 $T$ 表示模型在视口中的位置，记为**位移矩阵**
$$
M_T =
\begin{bmatrix}
1&0&0&T_x\\
0&1&0&T_y\\
0&0&1&T_z\\
0&0&0&1
\end{bmatrix}
$$
仅当四维向量的 $w$ 分量不为 0 时才会应用位移：
$$
M_{T} \cdot (x,y,z,1)^T =
\begin{bmatrix}
\begin{bmatrix}x \\ y \\ z\end{bmatrix} +
\begin{bmatrix}T_x \\ T_y \\ T_z\end{bmatrix} \\
1
\end{bmatrix}
$$
$$
M_{T} \cdot (x,y,z,0)^T =
\begin{bmatrix}
\begin{bmatrix}x \\ y \\ z\end{bmatrix} \\
0
\end{bmatrix}
$$

$M_\text{ModelView}$ 由三个分矩阵组合而成：$M_\text{ModelView} = M_T\cdot M_R\cdot M_S$

## 投影矩阵

### 正交投影矩阵
<tldr>

$$
\begin{aligned}
M_\text{Projection-ortho} &=
\begin{bmatrix}
\frac{2}{r-l} &0&0&\frac{l+r}{l-r} \\
0&\frac{2}{t-b} &0&\frac{t+b}{t-b} \\
0&0&\frac{2}{n-f} &\frac{f+n}{f-n} \\
0&0&0&1
\end{bmatrix}\\ &=
\begin{bmatrix}
\frac{\cot\frac{\text{FOV}}{2}}{n\cdot R_\text{asp}} & 0 & 0 & 0 \\
0 & \frac{\cot\frac{\text{FOV}}{2}}{n} & 0 & 0 \\
0 & 0 & \frac{2}{n-f} & \frac{f+n}{f-n} \\
0 & 0 & 0 & 1
\end{bmatrix}
\end{aligned}
$$
</tldr>

其中：$l,r,t,b,n,f$ 分别为空间的左右、上下、近远平面；  
$R_\text{asp}$ 为窗口高宽比 `aspectRatio`，$\text{FOV}$ 为视场角对应的弧度值。

阴影空间使用正交投影矩阵，每个方向上视距为 `shadowDistance`，即阴影空间投影矩阵
$$
M_{S\text{Projection}} =
\begin{bmatrix}
\frac{1}{d} &0&0&0 \\
0&\frac{1}{d} &0&0 \\
0&0&-\frac{1}{d} &0 \\
0&0&0&1
\end{bmatrix}
$$$$
d: \text{shadowDistance}
$$
### 透视投影矩阵
<tldr>

$$
M_\text{Projection-persp} =
\begin{bmatrix}
\frac{F}{R_\text{asp}} &0 &0 &0 \\
0 &F &0 &0 \\
0 &0 &\frac{n+f}{d} &\frac{2nf}{d} \\
0 &0 &-1 &0
\end{bmatrix}
$$$$
F=\cot{\frac{\mathrm{FOV}}{2}}
$$$$
d=n-f
$$
```glsl
M[0]          M[1] M[2]    M[3]
F/aspectRatio 0    0       0       M[].x
0             F    0       0       M[].y
0             0    (n+f)/d 2*n*f/d M[].z
0             0    -1      0       M[].w
```
</tldr>

- Minecraft 使用反转深度投影矩阵来平衡远处的深度精度。
- 透视投影矩阵的本质可以看作一个正交投影矩阵与一个基于 Z 值进行缩放的中间矩阵相乘所得的矩阵。
- 可以使用 `2.0 * atan(1.0 / gbufferProjection[1].y)` 求到视场角。
