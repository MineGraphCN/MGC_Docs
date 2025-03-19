# 动态光照与阴影

<show-structure depth="2"/>

<tldr>

在上一节中，我们初步认识了几何缓冲的相关知识，在延迟渲染中实现了场景光照。本章我们将会更进一步，将光照方向变更为实时计算，并让场景投下阴影。

</tldr>

## 动态光照

回顾一下上一节的内容，我们成功在延迟处理实现了基本的光照，但是光照方向是固定的，而且如果你尝试过将时间切换至夜晚或者放置几个光源方块就会发现，场景并不会随着光照的变化而变化。

### 基本光照

在原版中，我们的天空光照除了在日出和日落时会进行视觉变化，光照的方向实际上是固定的，也就是说明暗关系始终不变。光是还原原版渲染肯定不能满足我们，因此我们将利用 OptiFine 提供的其他数据来编写一个随光源位置而动态响应的光照。

你应该知道，Minecraft 的太阳和月亮实际上不会随着日落和日出而被替换，而是始终存在于世界中，只不过白天时月亮位于地平线以下，夜晚则反之。OptiFine 提供了它们的位置，并且为了和它的阴影（下一节我们就将实现它）联动，还给出了目前用于投影的光源位置：
```glsl
uniform vec3 sunPosition;         // 视口空间的太阳位置
uniform vec3 moonPosition;        // 视口空间的月亮位置
uniform vec3 shadowLightPosition; // 视口空间的投影光源 (日或月) 位置，需要启用阴影，否则固定为太阳
```
由于下一小节我们将会绘制阴影，因此我们直接使用 `shadowLightPosition` 了，在没有实现阴影之前，夜晚的场景可能会显得有些奇怪，看起来像光源来自地底。

上一节我们使用了原版的光照函数，它接受两个光照方向、法线和反照率，并返回运算之后的场景颜色。现在忘了它吧，我们将自己手动一步步实现光照函数，并进行手动混合。

光照的核心是**点乘**，它们可以描述两个向量的同向程度，希望你还记得，我们只要将向量转化到单位向量，就能将其结果限制在 $[-1,1]$ 。

所谓的光照方向就是指向光源位置的单位向量，我们使用 `normalize()` 函数就可以将向量转换为单位向量。于是我们只需要将表面法线与光照方向做点乘，就能求到光照强度了。但是当法线与光照的夹角大于 $90\degree$ 时，就会产生负值，而背光面本身就不会被照亮，因此我们还需要钳制一下最小值：
```glsl
vec3 lightDir = normalize(shadowLightPosition);
float lit = max(dot(lightDir, normal), 0.0);
```

这样，我们就拿到了场景的光照数据了，我们将它和反照率（所谓反射光的概“_率_”或者占比）相乘，就能得到应用了光照之后的场景颜色了：
```glsl
fragColor = albedo * lit;
```

![](shadows_realtimeLighting.webp){width="700"}

不过你会看到，场景没有被光照射到的区域一片纯黑，这可不是我们所希望的。为此，我们可以添加一个**环境光**亮度，基本上就是手动给计算好的光照加一个小值：
```glsl
fragColor = albedo * (lit + 0.3);
```

然后，你就能看到随着光源角度变化的场景光照了：

![](shadows_differentTime.webp){width="700"}

如果你还没忘记怪可怜的原版 AO，可以将它乘入环境光照明，让它发挥本来的作用：模拟环境光的遮挡。

```glsl
fragColor = albedo * (lit + 0.3 * albedo.a);
```

如果你觉得背光面太暗了，或者想要随时调节环境光照，也可以将它们写入光影设置。

> Photoshop 中的“正片叠底”模式的英文名称就是 Multiply，即相乘。由于普通图像的分量最大值只能是 `1.0` ，因此将图层混合模式选为正片叠底之后实际上是将它和下一图层混合变暗。
> 
> 所谓的“正片”实际上就是老式胶片相机还没洗出来的“底片”的对应。
> 
{title="小知识"}

### 光照贴图

当你进入矿洞之类本应遮挡阳光的地方你就会发现场景分外的亮，这是因为光照强度只与光照的方向相关。

在原版中，场景随着时间和位置改变天空光照亮度（或者说阳光/月光亮度）的行为和光源方块的照明行为均由光照贴图（Light Map）完成，它们表征了方块受到的光照强度，由游戏自动生成。OptiFine 为我们提供了相关数据：
```glsl
uniform sampler2D lightmap; // 统一变量，在几何缓冲可用的光照贴图
in ivec2 vaUV2; // 顶点属性，光照纹理坐标
```
> 你可能会好奇 `vaUV1` 去哪了，这个纹理坐标在原版用于 `overlay` ，一张上红下白的纹理，用于 TNT 和苦力怕的爆炸闪烁以及实体受伤变红的效果。
>
> 在 OptiFine 中，这个职责被统一变量 `uniform vec4 entityColor` 替代，也就是说 `vaUV1` 基本上已经弃用了，如果你尝试在 Iris 的新版本中运行声明了 `vaUV1` 的光影可能会报错。

值得注意的是，`lightmap` 提供了混合天空光照和方块光照后的**光照颜色**，当 $Y$ 轴不变时，$X$ 轴上的颜色变化代表了在这一天空光照等级下随方块光照变化而变化的颜色。这种穷举所有情况的纹理我们也称为**查找表**（Lookup table, LUT）。因此 `vaUV2` 实际上就是以 `s` 分量表示方块光照、 `t` 分量表示天空光照。

> 基于这个特性，你可以让方块光照颜色随着天空光照等级的变化而变化，反之亦然。

这个坐标实际上由原版提供，但是它的处理方式却有些奇怪。如果你在本章第一节跟着我们查看了原版着色器就会发现，原版着色器处理光照贴图的方法是直接在顶点着色器中使用 `texelFetch(Sampler2, UV2 / 16, 0)` 采样光照贴图，原版中的 `Sampler2` 即 OptiFine 的 `lightmap` ，而 `UV2` 则对应 `vaUV2` 。

> 如果你看过 `light.glsl` ，可能会发现一个 `minecraft_sample_lightmap()` 函数，这个函数只在 `terrain.vsh` 中使用，实际效果和上面的 `texelFetch()` 相同。

将 `UV2` 除以 16 再进行采样我们勉强可以用光照强度等级在游戏中有 $[0,15]$ 共 16 个等级这个理由，虽然我们不知道 Mojang 为什么不传入一个直接可用的坐标。还有一个问题是：在顶点着色器中采样纹理会发生什么？

信息传入到片段着色器时会进行**插值**，除非你在传出着色器（顶点着色器或者几何着色器，取决于你有没有使用几何着色器）和片段着色器都声明了这个变量以 `flat` 形式传入。而在顶点着色器上进行纹理采样，基本上就只是利用顶点的原始纹理坐标进行了采样，因为这时候还没开始数据插值。

因此，Mojang 的思路是只在每个顶点做一次光照颜色采样，然后把剩下的活都交给顶点插值完成，只需要在每个顶点上而不是每个片段执行一次采样，而且可以保证一个方块上的光照过渡均匀，在我们没什么理由不仿效。

于是我们的顶点着色器就是：
```glsl
[...]
in ivec2 vaUV2;
out vec4 lightmapColor;
[... main ...]
lightmapColor = texelFetch(lightmap, vaUV2 / 16, 0);
```
然后我们在片段着色器传入光照贴图颜色，并将它们传出到额外的缓冲区备用：
```glsl
[...]
in vec4 lightmapColor;
[...]
/* DRAWBUFFERS:012 */
[... 其他输出 ...]
layout(location = 2) out vec4 light;
[... main ...]
light = lightmapColor;
```
最后在 `final.fsh` 中，我们声明并采样这张纹理，然后将光照颜色乘到之前的光照强度上：
```glsl
[...]
uniform sampler2D colortex2;
[... main ...]
vec4 lightmap = texture(colortex2, uv);
[...]
fragColor = albedo * (lit * lightmap + 0.3 * albedo.a);
```

然后你就能在矿洞中看出场景变化了：

![shadows_lm.webp](shadows_lm.webp){width="700"}

如果将我们之前的 `lightDir` 赋值内容替换为 `normalize(moonPosition)` 然后把时间切换到晚上，你就会发现场景正确地变暗了。

现在还剩下一个 _小_ 问题：我们采样的光照颜色是天空和方块光照的叠加，而我们之前写的光照强度会根据太阳的方向变化：我们没有理由让方块光照强度也随着光照角度的变化而变化！

其中一个解决办法是在几何缓冲中处理一次表面光照，然后根据光照的方向动态地变化我们在光照贴图上的采样纵坐标。这种方法限制较多，没有多少光影使用，我们通常只保存纹理坐标作为光照强度，然后自行处理光照色彩。

虽然在下一小节中绘制实时阴影之后，我们不必再依赖光照贴图遮挡阳光或月光，但是天空光照强度数据仍可用于环境光或另作他用。我们会将输出光照强度留作习题。

> 如果成功直接输出了光照强度你就会发现，游戏中天空光照随时间变化的时候光照贴图的纹理坐标其实并没有变化。
> 
> 这是因为 `lightmap` 的内容是随着时间动态变化的，天空光照有一个随着遮挡变化的固有强度和一个世界时间系数，刷怪判定就由它们共同完成。这个系数也会改变不同时间段光照贴图的颜色，从而营造出光照随时间的变化。
>
> 因此，如果你想要脱离光照贴图，则需要自己定义根据时间段变化的光照强度和颜色。OptiFine 也为我们提供了游戏内时间的相关数据：
> ```glsl
> uniform int worldTime;  // <ticks> = worldTicks % 24000
> uniform int worldDay;   // <days> = worldTicks / 24000
> ```
> 
{title="小知识"}

## 块输出

随着顶点着色器的输出变量变多，我们的声明区域不堪重负，变量也变得越来越多，因此我们将进行第二次瘦身。不过不用担心，这一次的瘦身还没达到单开一节的程度。

GLSL 支持块传入和传出（注意不是结构体），我们将几何缓冲的顶点着色器中所有需要传出的变量打包：
```glsl
out VS_OUT {
    vec4 color;
    vec2 uv;
    vec3 normal;
    vec2 vanillaLightStrength;
} vs_out;
```
然后在片段着色器中传入：
```glsl
in VS_OUT {
    vec4 color;
    vec2 uv;
    vec3 normal;
    vec2 vanillaLightStrength;
} fs_in;
```
然后就可以像 C 那样调用结构体变量了：
```glsl
fragColor = texture(gtexture, fs_in.uv) * fs_in.color;
```
和结构体不同，块输出和输入允许我们使用任意变量名，只要块类型对应即可。比如在顶点着色器使用 `vs_out` 然后在片段着色器使用 `fs_in` ，这样也可以避免误导。

由于 GL 不支持在片段着色器中定义输出块，因此还是保持原样。

## 实时阴影

终于来到了我们的重头戏了。光影之所以如此受欢迎，实时阴影绝对是头号功臣。原版游戏没有为我们提供任何能用以绘制阴影的常规手段，这也是我们会使用 OptiFine 的重要原因。

要想进行投影，本质上就是靠近光源的物体将光源遮挡，从而在远离光源的物体上投下了阴影。说到远近关系，我们第一个想到的就是深度图！我们只需要设法从光源方向观察场景，就能获取到场景和光源的距离关系了。

### 阴影几何缓冲

OptiFine 为我们提供了额外的阴影几何缓冲程序用于处理阴影数据，名为 `shadow`，在屏幕几何缓冲之前运行。它的顶点变换结束之后实际上就是从光源所在视角望向玩家所在方块的等轴场景，这个场景下的顶点坐标称为**阴影坐标**（Shadow Coordinate），对应的空间称为**阴影空间**（Shadow Space）。

和我们常规视角的几何缓冲类似，在 `shadow.vsh` 中我们也需要进行顶点变换：
```glsl
#version 330 core

#define SHADOW_SHADER
#define VERTEX_STAGE

#include "/libs/Uniforms.glsl"
#include "/libs/Attributes.glsl"

out vec2 uv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition + chunkOffset, 1.0);
    uv = vaUV0;
}
```
{collapsible="true" collapsed-title="shadow.vsh" default-state="expanded"}

在片段着色器中，我们也可以向两张阴影专用缓冲区 `shadowcolor0` 和 `shadowcolor1` 输出数据，它们只能也是仅有的在阴影相关的程序中可以写入的缓冲区，`DRAWBUFFERS` 索引分别是 `0` 和 `1` 。
```glsl
/* DRAWBUFFERS:01 */
layout(location = 0) out vec4 col0; // 绘制到 shadowcolor0
layout(location = 1) out vec4 col1; // 绘制到 shadowcolor1
```
不过我们目前不需要向它们输出内容，因为我们也有专用的深度缓冲区 `shadowtex0` 和 `shadowtex1` 。和 `depthtex` 类似，`0` 中包含了半透明几何的深度。我们只需要在片段着色器中将深度数据（希望你还记得是 `gl_FragCoord.z`）写入 `gl_FragDepth` 就行了，就像 GL 默认的那样。但是还有一件事：记得做 Alpha 测试，不然场景中本应透明的植被等区域也会被覆盖！这也是我们的顶点着色器程序传出了 `uv` 的原因。
```glsl
#version 330 core

#define SHADOW_SHADER
#define FRAGMENT_STAGE

#include "/libs/Uniforms.glsl"

in vec2 uv;

void main() {
    float alpha = texture(gtexture, uv).a;
    if(alpha <= 0.1) discard;
    gl_FragDepth = gl_FragCoord.z;
}
```

如果你在 `final.fsh` 中直接声明 `shadowtex0` 然后输出它，看起来会像是这样：

![shadows_shadowmap.webp](shadows_shadowmap.webp){width="700"}

如果你遇到大面积没有场景信息的情况，可以尝试打开 F3 调试界面看着屏幕中间的参考坐标系来回转头加载场景，在某些版本的 OptiFine 上你可能会遇到深度数据随着转头被裁切的情况，可以在配置文件（`shaders.properties`，希望你还记得）中添加
```properties
shadow.culling = false
```
强制禁用阴影空间的摄像机视锥体裁切。

> 一旦你启用了阴影，`shadowLightPosition` 就会同步到当前的投影源而不是使用太阳位置，因此在夜晚也可以产生正确的方向光照。

### 绘制阴影

现在我们有场景和光源之间的位置关系了，继续思考，深度图实际上是表示了当前位置上距离观察点最近的深度，现在我们相当于有了两个视角的深度信息……因此我们只需要设法将阴影深度**映射**到场景中，作为场景对应位置与光源连线上距离光源最近的深度 `closestDepth`，然后将视口深度也转化到阴影空间作为对应位置在阴影空间下的实际深度 `currentDepth` ，最后将这两个深度做比较，就能知道是否可以投影了！

#### 重建坐标系

回到 `final` ，现在有屏幕的归一化坐标 `uv` 和场景的非线性深度 `depth` ，这些坐标实际上都是 NDC 坐标简单的线性归一化得到的，称为**屏幕空间**（Screen Space），在上一节中我们又知道了局部空间变换到 NDC 的方法，于是我们就可以利用 OptiFine 提供的逆矩阵（上一节有提到）进行**逆变换**：
$$
P_\text{World} \leftarrow M_{G\text{ModelView}}^{-1} \cdot P_\text{View} \xleftarrow{透视除法} P_\text{Clip} \leftarrow M_{G\text{Projection}}^{-1} \cdot P_\text{NDC} \leftarrow P_\text{Screen} \times 2 - 1
$$

> 和顶点着色器不同，这里我们只是将像素的坐标**信息**进行了变换，而顶点着色器则是将顶点的**实际位置**进行了变换。
>
{style="note"}

其中 NDC 变换到裁切空间之后才进行透视除法，与正变换略有差别。变换完成之后，OptiFine 还为我们提供了阴影空间的相关矩阵，于是我们就可以直接进行阴影变换：
$$
P_{S\text{Screen}} \leftarrow \frac{P_{S\text{Clip}} + 1}{2} \xleftarrow{透视除法} P_{S\text{Clip}} \leftarrow M_{S\text{Projection}} \cdot P_{S\text{View}} \leftarrow M_{S\text{ModelView}} \cdot P_\text{World}
$$
虽然阴影空间是等轴的，但是我们还是需要进行“透视”除法来归一化。

> 你可能会思考为什么最后变换到的是世界空间而不是局部空间，因为局部空间的信息实际上没有包含在 $M_{G\text{ModelView}}^{-1}$ 中，它只包含视角晃动的位移信息。

就像刚才说的那样重建 NDC 就很简单：
```glsl
vec4 NdcPos = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
```
我们这里将第四分量设置为了 `1.0` ，也和第三节的理由一致。接着将它转化到裁切空间：
```glsl
vec4 ClipPos = gbufferProjectionInverse * NdcPos;
```
这一步使用逆矩阵与坐标相乘，同时也更改了 $w$ 分量。然后进行透视除法转换到视口空间：
```glsl
vec4 ViewPos = ClipPos / ClipPos.w;
```
在这一步我们直接将它的 $w$ 分量也除以了自身，还原到点默认的 `1.0`。最后再转化到世界空间，我们的逆变换就结束了：
```glsl
vec4 WorldPos = gbufferModelViewInverse * ViewPos;
```
然后，我们利用阴影空间的相关矩阵，将世界坐标变换到阴影空间坐标：
```glsl
uniform mat4 shadowModelView;
uniform mat4 shadowProjection;
[... main ...]
vec4 shadowClipPos = shadowProjection * shadowModelView * WorldPos;
```
别忘记进行透视除法：
```glsl
shadowClipPos /= shadowClipPos.w;
```
最后将它转换到阴影屏幕空间坐标，这样我们就在屏幕空间中和阴影屏幕空间的坐标对齐了：
```glsl
vec3 shadowScreenPos = shadowClipPos.xyz * 0.5 + 0.5;
```
这就我们所需要的对应屏幕空间位置的阴影贴图纹理坐标了，而它的第三分量则是屏幕空间中的像素在阴影空间下的深度，即
```glsl
vec2 uv_shadowMap = shadowScreenPos.xy;
float currentDepth = shadowScreenPos.z;
```
我们之前需要的 `closestDepth` 就可以通过 `uv_shadowMap` 采样 `shadowtex0` 得到：
```glsl
float closestDepth = texture(shadowtex0, uv_shadowMap).r;
```

#### 绘制与优化

最后，我们将 `closestDepth` 和 `currentDepth` 做比较，如果后者大于前者（即当前深度不是在光源连线上的最近深度），则处于阴影中。
```glsl
float shadowMultiplier = 1.0; // 阴影乘数，0.0 表示在阴影中。
if(currentDepth > closestDepth) shadowMultiplier = 0.0;
```
> 如果你图省事，也可以使用 `step(e, x)` 函数，它接受两个参数，当 `x` 小于 `e` 时返回 `0.0` ，否则返回 `1.0`，即：
> ```glsl
> float shadowMultiplier = step(currentDepth, closestDepth);
> ```

最后，我们将这个阴影系数乘到我们之前的光照强度上，就可以产生阴影了：
```glsl
fragColor = albedo * (lit * shadowMultiplier + 0.3 * albedo.a);
```

![shadows_dirtyShadow.webp](shadows_dirtyShadow.webp){width="700"}

虽然看起来确实不怎么美观……这是因为默认的阴影贴图覆盖范围高达 $20 \times 20$ 个区块，而贴图分辨率只有可怜的 $1024 \times 1024$，你基本上可以理解为，每个方块在阴影贴图上只有 3 个像素的信息。

要想解决很简单，OptiFine 允许我们定义特定名称和类型的常量来设置这些内容，由于阴影贴图永远是正方形且像素量必定是整数，所以尺寸只需要一个整型值，让我们先尝试将它扩大一倍：
```glsl
const int shadowMapResolution = 2048;
```
阴影渲染距离也类似，它规定了阴影的渲染半径，以方块计，我们可以暂时设置成一个小的值，比如 2 个区块：
```glsl
const float shadowDistance = 32;
```

> 你也可以像宏那样在定义后加注释来添加可以在光影设置中调整的值
> ```glsl
> const int shadowMapResolution = 2048; // [1024 2048 3072 4096]
> const float shadowDistance = 32; // [32 48 64 80 96 112 128]
> ```

回到游戏重载一下光影试试：

![shadows_dirtyShadowHR.webp](shadows_dirtyShadowHR.webp){width="700"}

看起来要好些了，但是如果凑近观察会发现有很多莫名的锯齿阴影。这是因为阴影贴图的分辨率是有限的，每个阴影贴图覆盖的像素对应的其实是屏幕上的一小块区域，而不是精确的一个点，因此当覆盖区域中央的最近深度小于了四周的实际深度时就会产生**自阴影**。

要想解决这个问题，最简单的方法就是手动将场景的实际坐标向光源方向“推”一个小值（也可以将最近深度往远处推一个小值）：
```glsl
const float bias = 0.0001;
float shadowMultiplier = step(currentDepth - bias, closestDepth);
```

![shadows_optimizedShadow1.webp](shadows_optimizedShadow1.webp){width="700"}

现在好多了，但是你会发现几何接缝出现了一些漏光导致视觉悬空，这是不可避免的。在极端情况下这个偏移值可能过小，你当然可以直接调大它，但是一个更明智的方法是根据表面的法线动态地调整偏移量。

可以思考一下，当场景表面的法线与光源越垂直，一个阴影像素覆盖的区域的深度差就会越大，因此偏移量就要越大！

![shadows_selfShadow.png](shadows_selfShadow.png){width="700"}

> 我们所说的“偏移”都是在光照方向上进行，相比让小物体无法投影而看起来轻微悬空，我们更不能接受一个平面全都是阴影。
> 
{style="note"}

因此，我们还是请出之前已经点乘好的值 `lit` ，当光照与法线方向夹角越小，我们的偏移量应该越小，因此要将其取反。我们不关心背光面，它们本来就全是阴影。同时我们应该保证一个最小的偏移量来确保某些极端角度不会产生自阴影：
```glsl
float shadowMultiplier = step(currentDepth - max(bias * (1.0-lit), bias * 0.1), closestDepth);
```

![shadows_optimizedShadow2.webp](shadows_optimizedShadow2.webp){width="700"}

这是在 1024x 阴影分辨率下渲染半径 16 区块接近正午的阴影效果，可以看到自阴影的现象几乎看不见了。

> 由于 `texture()` 的插值特性，大多数近处的深度错误已经在插值时被抵消了，因此我们的偏移量可以很小。
> 
> 如果使用 `texelFetch()` 或者场景坐标较远（非线性的深度图决定了转换后远处的线性深度精度会更差）可能会产生更多自阴影。

此外，我们还可以控制阴影在南北方向上的倾斜，让阴影边缘不再一直和南北的表面对齐，从而让光照更有层次：
```glsl
const float sunPathRotation = -20.0;
```

![shadows_sunRotate.webp](shadows_sunRotate.webp){width="700"}

其中负值代表太阳向南偏移，正值代表向北偏移。

如果你望向远处，可能会发现场景被错误遮蔽了，这是因为阴影采样坐标超出了场景坐标。还记得缓冲区的边缘行为吗？超出缓冲区范围的场景相当于一直拿缓冲区边缘的深度信息和实际深度做对比，因此始终被判断为阴影。

![shadows_wrongArea.webp](shadows_wrongArea.webp){width="700"}

图中泛红的区域即阴影空间坐标不属于 $[0,1]$ 的区域，在这些地方采样的阴影深度信息没有任何意义

要想解决这个问题很简单，我们只要不比较阴影纹理坐标不属于 $[0,1]$ 区域的场景就行了：
```glsl
[...]
float minComponent(vec2 v) {
    return min(v.x, v.y);
}
float maxComponent(vec2 v) {
    return max(v.x, v.y);
}
[... main ...]
if(minComponent(uv_shadowMap) < 0.0 || maxComponent(uv_shadowMap) > 1.0) { shadowMultiplier = 1.0; }
```
当然，我们可以用之前封装的函数 `uv_OutBound()` 来替换它们，如果你还记得的话：

<compare>

```glsl
bool uv_OutBound(vec2 uv) {
    return (max(v.x, v.y) > 1.0 || min(v.x, v.y) < 0.0);
}
```
```glsl
bool uv_OutBound(vec2 uv) {
    return (maxComponent(uv) > 1.0 || minComponent(uv) < 0.0);
}
```

</compare>

```glsl
if(uv_OutBound(uv_shadowMap)) shadowMultiplier = 1.0;
```

而如果你飞向高空，你会发现大块的阴影又回来了（真难杀啊），这是因为在阴影几何缓冲中场景超出了裁切远平面，最近的阴影空间深度始终被视为了 `1.0` ，而场景的实际阴影空间深度已经超过了 `1.0` 。因此我们还需要裁切掉大于 `1.0` 深度的坐标：
```glsl
if(uv_OutBound(uv_shadowMap) || currentDepth >= 1.0) { shadowMultiplier = 1.0; }
```

![shadows_wrong.webp](shadows_wrong.webp){width="700"}

> 我们判定的核心思想就是剔除掉阴影深度图中无效的部分，因此你也可以判定 `closestDepth == 1.0` ，这样物体就可以在实际深度超出 `1.0` 的远景中投影了，这在光源角度较大的日落和日出时非常有用。
> 
{style="note"}

> 阴影缓冲在固体几何缓冲之前独立运行，因此场景中其他几何也会被写入其中。你会发现一些坑洞全被阴影包围，这是因为它们被水体表面遮挡，如果你不想要半透明几何影响投影，可以使用 `shadowtex1` 。
>
{style="note"}


> 事实上我们编写的阴影几何缓冲基本上就是 OptiFine 的内置实现，如果你不编写阴影几何缓冲而直接调用 `shadowtex` ，也是可以绘制阴影的。
> 
> 不过有一点不同的是，内置实现向 `shadowcolor0` 写入了场景，将它像阴影深度那样映射到场景中看起来就像这样：
> ```glsl
> fragColor = texture(shadowcolor0, uv_shadowMap);
> ```
> ![shadows_shadowcolor0.webp](shadows_shadowcolor0.webp)

## 习题

1. 整理你的 `final.fsh` ，将重建阴影坐标系的一大坨内容封装成函数，剔除不必要的变量。
2. 重载 `minComponent()` 和 `maxComponent()` 函数，让它们可以返回 `vec3` 和 `vec4` 类型的最大分量。

   重载完成后，你会发现我们之前重载的三维 UV 边界判定函数也可以写成：
   ```glsl
   bool uv_OutBound(vec3 uv) {
       return (maxComponent(uv) > 1.0 || minComponent(uv) < 0.0);
   }
   ```
   于是我们可以直接用 `#define` 定义：
   ```glsl
   #define uv_OutBound(uv) (maxComponent(uv) > 1.0 || minComponent(uv) < 0.0)
   ```
   这样变量 `uv` 的类型就被 `maxComponent()` 和 `minComponent()` 限定，而 `uv_OutBound()` 则不必重载了。
3. 将 `vaUV2` 处理之后传入像素着色器，将光照强度独立拆分到两个通道中输出，不要使用 `lightmap` ，然后在 `final.fsh` 中仅将天空光照强度乘以环境光强度，并在最终光照强度上独立叠加方块光照强度。注意：
   - OptiFine 要求整型类变量必须以 `flat` 形式传出，不能进行插值，因此你可能需要将其转化到 `vec2` 以确保进行了正确插值。
   - 你需要根据光照贴图的尺寸将整型坐标转化到归一化坐标来确保不会过曝，你可以使用 `textureSize(sampler, lod)` 来获取纹理尺寸，第一个变量传入要查询尺寸的采样器，第二个变量 `lod` 则是 MipMap 等级，在这里只需要设置为 `0` 。它会返回每一个维度上的纹理尺寸，因此你将它与整型坐标相除就可以获取归一化坐标。
4. 复习第二章的内容。

---

至此，你已经了解了阴影渲染的大概，我们的第二章也就接近尾声了。相信现在的你已经对光影细节有了一些概念，那么在下一章我们将会更进一步，深入光影配置、认识半透明几何、重建场景数据。

_To Be Continued._
