# 固体几何缓冲

<secondary-label ref="wip"/>

<show-structure depth="2"/>

<tldr>

在上一章中，我们完成了一个几何缓冲并在延迟处理中渲染了动态阴影。但是上一章的内容还不足以构成一个哪怕可用的光影。从本章开始，我们将会从固体几何开始，逐步构建一个完整可用的光影。

本节我们将会逐个还原第一轮几何缓冲（即固体几何缓冲）中的内容。

</tldr>

## 程序分类

在 OptiFine 中，整个场景被拆分到了将近 20 个几何缓冲，要为它们逐一编写处理程序会给今后的修改带来很多不必要的麻烦。

大多数几何的处理方法应该是相似的，因此我们可以将它们分门别类，然后为每一类几何缓冲编写一个统一的程序。在之前，我们浅用了 `#include` 命令进行函数包含。这里我们将更进一步，使其包含整个着色器程序：
```glsl
#ifdef VERTEX_STAGE
[... 顶点着色器程序 ...]
#endif
#ifdef FRAGMENT_STAGE
[... 片段着色器程序 ...]
#endif
```
将其放入一个新的文件夹 `shaders\programs\` ，这里的内容都是可以直接使用的着色器程序。最后在各几何缓冲的顶点和片段阶段调用对应的内容：
```glsl
#version 330 core
#define GBUFFER_SHADER
#define VERTEX_STAGE
#include "/programs/<程序>"
```
有一些内容大致相同，但是存在细微差异的着色器程序，我们可以使用 `#ifdef` 进行判定。

在上一章中，我们已经处理完成了地形（`terrain`），在几何缓冲中基本上就只有它会绘制环境光遮蔽，因此我们可以将其设置为单独的一类。为了便于今后的维护，即使只有一个几何缓冲使用的着色器我们也将会把主要的程序代码存入 `programs\` 下，对于 `terrain` 来说，我们直接使用同名文件 `gbuffers_terrain.glsl` 即可。

> 如果两个着色器程序之间有相同 `#include` 文件，则可以将它们提到顶部：
> ```glsl
> #include "/libs/Uniforms.glsl"
> 
> #ifdef VERTEX_STAGE
> [... 顶点着色器程序 ...]
> #endif
> #ifdef FRAGMENT_STAGE
> [... 片段着色器程序 ...]
> #endif
> ```

在本章中，我们的其他几何缓冲程序都将以 `terrain` 程序为蓝本编写。如果你忘记了我们之前的着色器，或者没有完成上一章提取原版光照强度的习题（不做作业可不行哦），这里有一份参考蓝本：

```glsl
#include "/libs/Uniforms.glsl"

#ifdef VERTEX_STAGE
#include "/libs/Attributes.glsl"

out VS_OUT {
    vec4 color;
    vec2 uv;
    vec3 normal;
    vec2 vanillaLightStrength;
} vs_out;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vaPosition + chunkOffset, 1.0);
    vs_out.color = vaColor;
    vs_out.normal = normalMatrix * vaNormal;
    vs_out.uv = vec2(textureMatrix * vec4(vaUV0, vec2(1.0)));
    vs_out.vanillaLightStrength = vec2(vaUV2 / 16) / textureSize(lightmap, 0);
}
#endif

#ifdef FRAGMENT_STAGE

in VS_OUT {
    vec4 color;
    vec2 uv;
    vec3 normal;
    vec2 vanillaLightStrength;
} fs_in;

/* DRAWBUFFERS:012 */
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec3 normals;
layout(location = 2) out vec2 light;

void main() {
    fragColor = texture(gtexture, fs_in.uv);
    if(fragColor.a <= alphaTestRef) discard;
    fragColor.rgb *= fs_in.color.rgb;
    fragColor.a = fs_in.color.a;
    normals = fs_in.normal *.5+.5;
    light = fs_in.vanillaLightStrength;
}
#endif
```
{collapsible="true" default-state="collapsed" collapsed-title="gbuffers_terrain.glsl"}

## 纹理格式

回顾一下之前的教程，当我们向缓冲区写入内容之后，无论这个值多大，最终都会归一化到 $[0,1]$，因此我们甚至在保存法线时都将它们重新映射到了 $[0,1]$ 。这是因为用于输出的缓冲区默认格式是 `RGBA8`，即每个像素四个通道，每个通道存储 8 位的归一化浮点。

在本教程中，我们会使用一个专门的缓冲区来输出每类几何独有的整型 ID，因此我们不希望缓冲区进行归一化，也不需要浮点类型。

OptiFine 允许我们使用常量表达式设置每个缓冲区的格式：
```glsl
const int colortex0Format = RGBA16F;
```
`RGBA` 指定了缓冲区的通道数量，`16` 指定了每个通道的位数，`F` 则代表每个通道按不进行归一化的浮点数进行存储。

这是类似于 `DRAWBUFFERS` 的交由 OptiFine 进行处理的 GL 上下文设置，在 GLSL 中没有实际意义，并且 `RGBA16F` 之类用于赋值的“变量”也未定义，因此 OptiFine 也接受注释之后的内容。我们可以这样设置纹理缓冲区：
```glsl
/*
const int colortex0Format = RGBA16F;      // 不进行归一化的 16 位四通道浮点数，对我们之后要进行的 HDR 渲染很重要。
const int colortex1Format = RGB16_SNORM;  // 带符号归一化的 16 位三通道浮点数，用于保存法线。
const int colortex2Format = RG16;         // 归一化的 16 位浮点数，用于原版光照强度。
const int colortex3Format = R8UI;         // 8 位无符号整数，用于存储几何类型 ID，仅红色通道。
*/
```
我们将之前的法线缓冲区设置为了 `RGB16_SNORM` ，`_SNORM` 后缀表示保存的内容会保留符号进行归一化，因此在几何缓冲中我们不必将法线映射到 $[0,1]$ 然后在延迟处理时将其又映射回 $[-1,1]$ 了，并且我们使用了 16 位的数据存储，因此还能提高不少数据精度。

我们还将之后会用来存储几何 ID 的 3 号缓冲区设置为了几乎最小的单通道八位无符号整型，可以为我们提供 $2^8=256$ 个 ID。

> 深度缓冲区的格式强制为 `R32F` ，以保证存储的深度数据为最大精度。

除此之外，如果我们要传入自定义纹理，也可以在光影配置文件中进行格式设置，不过那些都是后话了。

> 你可以在 [附录 4](a04-textureAndPx.md#texFormat "纹理格式") 查阅 OptiFine 支持的纹理格式。
>
> 在我们的教程中不会刻意节省缓冲区通道，但是你可以通过习题 1 初步尝试将法线数据和光照数据保存在一起。
>
{style="note"}

当我们将纹理单元设置为整型数据保存时，可以在声明对应纹理时使用 `isampler2D` 来让 `texture()` 函数返回整型值：
```glsl
uniform isampler2D colortex3;
[... main ...]
int geoID = texture(colortex3, uv).r;
```

> 除了 <code><i>i</i>sampler</code>，GLSL 还支持用 <code><i>u</i>sampler</code> 声明无符号整数纹理采样器。在 GL 文档中，这种可选前缀的纹理类型被统一冠以 _`g`_ 前缀。

我们可以在任意一个着色器中设置纹理格式，但是最好还是保存在一个统一的地方，比如 `Settings.glsl` 的末尾。

我们要在每个程序中对 `colortex3` 输出几何 ID，并且不必再压缩法线数据，于是我们就要更改作为蓝本的 `terrain.glsl` 了：

```glsl
[...]
/* DRAWBUFFERS:0123 */
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec3 normals;
layout(location = 2) out vec2 light;
layout(location = 3) out int geometryID;
[... main ...]
normals = fs_in.normal;
geometryID = 1;
[...]
normals = fs_in.normal; // 可以正确保存 [-1,1] 区间上的内容，不再需要手动处理了
```

除了前三个缓冲区，其他缓冲区默认的清空均为 `vec4(0.0)` ，由于天空是一个半圆形穹顶，而且覆盖范围大、靠近背景（“天空”和“背景”是两个概念！每一帧清空为了特定颜色之后的区域即为“背景”。），它最好不要写入 ID 以免不必要的麻烦。因此我们可以将除了天空之外的区域都设置为大于 0 的值，之后每次修改蓝本我们都应该更改对应的 `geometryID`。

## 混合 {id="blend"}

由于几何缓冲程序向缓冲区输出内容之后不会翻转缓冲区，OptiFine 中的一些几何缓冲默认启用了**混合**（Blending）。GL 可以通过**混合方程**（Blend Equation）让一些内容在输出时与缓冲区上已有内容进行色彩混合。
$$
C_{\text{结果}} = C_{\text{源}} \times F_{\text{源}} + C_{\text{目标}} \times F_{\text{目标}}
$$
其中  
$C_{\text{结果}}$ 表示混合结果；  
$C_{\text{源}}$ 表示源（从程序输出）颜色；  
$F_{\text{源}}$ 表示源因子，决定源颜色的乘数；  
$C_{\text{目标}}$ 表示目标（缓冲区中）颜色；  
$F_{\text{目标}}$ 表示目标因子，决定目标颜色的乘数。

例如，当我们将 $F_{\text{源}}$ 设置为源的 Alpha 通道 $A_{\text{源}}$，然后将 $F_{\text{目标}}$ 设置为 $1 - A_{\text{源}}$，则最终的颜色为
$$
C_{\text{结果}} = C_{\text{源}} \times A_{\text{源}} + C_{\text{目标}} \times (1-A_{\text{源}})
$$
即将源颜色根据其不透明度与缓冲区的颜色进行混合，效果与 `mix(SRC_COLOR, DST_COLOR, SRC_ALPHA)` 相同。

此外，OptiFine 允许我们单独对 Alpha 通道设置混合方式：
$$
A_{\text{结果}} = A_{\text{源}} \times F_{\text{源 Alpha}} + A_{\text{目标}} \times F_{\text{目标 Alpha}}
$$

### 设置混合

我们可以在 `shaders.properties` 中使用 `blend.<程序>` 按
$$
F_{\text{源}} \quad F_{\text{目标}} \quad F_{\text{源 Alpha}} \quad F_{\text{目标 Alpha}}
$$
的顺序设置混合因子 $F$ ：
```properties
blend.<程序>=<off|src dst srcA dstA>
```
可以设置为 `off` 禁用混合，或者为每个因子设置下列参数：

| 参数                    | 值                                       | 备注       |
|-----------------------|-----------------------------------------|----------|
| `ZERO`                | $0$                                     |          |
| `ONE`                 | $1$                                     |          |
| `SRC_COLOR`           | $C_{\text{源}}$                          | 各通道独立相乘  |
| `ONE_MINUS_SRC_COLOR` | $1 - C_{\text{源}}$                      | 各通道独立相乘  |
| `DST_COLOR`           | $C_{\text{目标}}$                         | 各通道独立相乘  |
| `ONE_MINUS_DST_COLOR` | $1 - C_{\text{目标}}$                     | 各通道独立相乘  |
| `SRC_ALPHA`           | $A_{\text{源}}$                          |          |
| `ONE_MINUS_SRC_ALPHA` | $1 - A_{\text{源}}$                      |          |
| `DST_ALPHA`           | $A_{\text{目标}}$                         |          |
| `ONE_MINUS_DST_ALPHA` | $1 - A_{\text{目标}}$                     |          |
| `SRC_ALPHA_SATURATE`  | $\min(A_{\text{源}}, 1 - A_{\text{目标}})$ |          |

{width=700}

也可以逐个缓冲区设置混合模式：
```properties
blend.<程序>.<纹理ID>=<off|src dst srcA dstA>
```

> `off` 的效果与 `ONE ZERO ONE ZERO` 相同，它们都是将源数据完全覆盖目标数据。

- 实体（`entities`）、发光实体（`entities_glowing`）、第一人称手部（`hand`）和有厚度线框（`line`）默认启用了前文中“与 `mix()` 相似”的混合方法（`SRC_ALPHA ONE_MINUS_SRC_ALPHA SRC_ALPHA ONE_MINUS_SRC_ALPHA`）；
- 挖掘裂纹（`damagedblock`）而使用了相互相乘再相加的混合方法，并保留了挖掘裂纹 Alpha 值（`DST_COLOR SRC_COLOR ONE ZERO` ^**1**^ ）；
- 第一轮的其他几何缓冲默认禁用混合；
- 你可以在 [](a04-textureAndPx.md#texID){summary=""} 查询纹理 ID。

**[1]** 即 $C_{\text{结果}} = C_{\text{源}} C_{\text{目标}} + C_{\text{目标}} C_{\text{源}} = 2 \times C_{\text{源}} C_{\text{目标}}$，最终表现为当裂纹纹理颜色值小于 0.5 时变暗，大于 0.5 时变亮。

## 渲染阶段

渲染阶段（Render Stage）是 OptiFine 提供的众多标准宏之一。由于部分几何缓冲中包含了不止一种几何 ^**1**^，OptiFine 允许我们使用这种宏和提供的统一变量 `renderStage` 进行阶段判定，比如在 `skybasic` 中只保留天空中的星星：
```glsl
[...]
uniform int renderStage;
[... main ...]
if(renderStage != MC_RENDER_STAGE_STARS) discard;
```
其中，`MC_RENDER_STAGE_STARS` 由 OptiFine 在编译时自动在程序顶部定义，我们无需手动声明。

**[1]** 比如 `skybasic` 中不仅负责渲染天空，还负责渲染星星；`basic` 中不仅有调试线框，还有拴绳。

> 你可以在 [附录 1](a01-uniformsAndAts.md#renderStage "OptiFine 提供的数据 - 标准宏 - 渲染阶段") 查询所有可用的渲染阶段宏。
> 
{style="note"}

## 无遮蔽类

所谓的无遮蔽类基本上就是除了固体和裁切地形之外，照常接受光照的内容。由于不需要遮蔽和半透明处理，我们可以像没有 AO 数据那样进行 Alpha 测试，并在这之后将输出颜色的 Alpha 设置为 `1.0`。

它们和地形的在延迟处理中的渲染方法没有什么本质区别，而且我们已经手动将环境光遮蔽禁用了，因此也不需要更改几何 ID。

```glsl
[... main ...]
fragColor = texture(gtexture, fs_in.uv) * fs_in.color;
if(fragColor.a <= alphaTestRef) discard;
fragColor.a = 1.0;
```

属于无遮蔽类的程序包括 `hand` 和 `block`，考虑到一些模组可能会优化方块实体的渲染，为其添加 AO，你也可以将它像地形那样渲染。

无遮蔽类的专用几何缓冲程序我们保存在 `gbuffers_aoLess.glsl` 中。

### 实体

虽然 `entities` 本来也应该算在其中，但是当我们进入旁观模式之后，我们旁观者本身和隐身的玩家会变为**半透明渲染**。这也是实体默认启用混合的原因之一。

但是游戏并不会将我们视为半透明几何，不仅会将我们写入 0 号深度缓冲区，而且如果这类实体遮挡在半透明几何上，背后的水体会直接不渲染 ^**1**^，因为水体的深度大于了当前深度，GL 认为水体被遮挡。同时，GL 也不会执行半透明排序 ^**2**^ ，因此当半透明实体在屏幕上相互重叠时也会造成随机的遮挡。~~沟槽的 `entities`。~~

**[1]** 因为水体在第二轮几何缓冲才渲染，迟于实体；地形之类早于实体渲染的几何体就不会被遮挡。  
**[2]** 这是一种确保半透明由远向近渲染的功能，这样当近处的半透明几何渲染之后就不会遮挡远处的几何了。

如果你不希望实体进入阴影贴图，可以使用
```properties
shadowEntities = false
```
来禁用阴影缓冲中渲染实体几何。

这里我们提供两种解决方案，第一种是在光影配置中禁用混合：
```properties
blend.gbuffers_entities=off
```
然后为这类实体设置一个独立的几何 ID，以便在延迟处理中为它们编写其他效果（当然半透明就无法实现了）：
```glsl
[... main ...]
if(fs_in.color.a < 0.9) {
    geometryID = 2;
} else {
    geometryID = 1;
}
```

> 由于顶点数据在传输时会进行插值，所以不要使用严格的 `fs_in.color.a < 1.0` 进行判定
> 
{style="note"}

另一种是不处理半透明实体的光照，在光影配置中仅开启颜色缓冲区的混合，然后完全保留实体的不透明度：
```properties
blend.gbuffers_entities=off
blend.gbuffers_entities.colortex0=SRC_ALPHA ONE_MINUS_SRC_ALPHA ONE ZERO
```
然后在片段着色器中**不要将 `fragColor.a` 覆写为 `fs_in.color.a`**：
```glsl
[... main ...]
fragColor = texture(gtexture, fs_in.uv) * fs_in.color;
if(fragColor.a <= alphaTestRef) discard;
[...]
if(fs_in.color.a < 0.9) {
    geometryID = 2;
} else {
    geometryID = 1;
}
```
最后，在延迟处理中处理光照时，检查几何 ID，如果是半透明实体则按比例处理光照但不处理 AO，将我们之前所写的延迟渲染改写为：
```glsl
int geoID = texture(colortex3, uv).r;
[...]
if(geoID == 2) {
    lit = mix(lit * shadowMultiplier * 0.6 + 0.4, 1.0, albedo.a);
}
else {
    lit = lit * shadowMultiplier * 0.6 + 0.4 * albedo.a;
}
fragColor = albedo * lit;
```

当然，这两种方法都有着一定程度上的妥协，你也可以自行思考一些方法。在下一节中，我们会介绍以图像（Image）格式加载缓冲区的方法，这样我们就能在几何缓冲中访问 0~3 号缓冲区，并提出一种比较取巧的将隐身实体作为无光照类的解决方法。

实体的专用几何缓冲程序我们保存在 `gbuffers_entities.glsl` 中。

### 发光实体

`entities_glowing` 的处理比较麻烦，因为它们需要始终在屏幕上，最简单的办法就是手动将它们的深度设置为 `0.0`
```glsl
gl_FragDepth = 0.0;
geometryID = 3;
```
这样就一定在最靠近屏幕的地方渲染，但是三角形的排序不同。当然，你也可以不将它们的深度提到最前，只更改几何 ID，但是这样就无法透过墙壁看到实体。

我们这里会仅将几何 ID 设置为 4，在之后的程序中它会表示不处理光照的类型。

当然，发光实体同时也可以是隐身实体，如果你想的话，也可以像发光实体那样为它做特殊处理，但是我们这里就将其视为完全不透明实体了：
```properties
blend.gbuffers_entities_glowing=off
```

如果想实现类似原版那种描边效果，我们同样需要等到下一节才能处理 ^**1**^。在这里，我们临时将几何 ID 设置为一个不同于实体的值备用。

**[1]** 原版使用了专用的轮廓帧缓冲进行处理，可以不进行深度比较，但是我们没有办法这样做。并且还使用了两个 Pass 进行延迟处理，我们也会在下一节认识。

发光实体的专用几何缓冲程序我们保存在 `gbuffers_entities_glowing.glsl` 中。

## 调试线框和拴绳

调试线框（区块边界框）和拴绳都在 `basic` 中处理，不需要在片段着色器中进行纹理采样，因此我们的顶点着色器不必传出纹理坐标。

```glsl
[... 顶点着色器 ...]
out VS_OUT {
    vec4 color;
    vec3 normal;
    vec2 vanillaLightStrength;
} vs_out;
[... 片段着色器 ...]
in VS_OUT {
    vec4 color;
    vec3 normal;
    vec2 vanillaLightStrength;
} fs_in;
[... main ...]
fragColor = fs_in.color;
if(fragColor.a <= alphaTestRef) discard;
fragColor.a = 1.0;
```

由于区块边界框不需要接受光照，而拴绳可以按照无遮蔽类处理，我们可以利用渲染阶段进行判定：
```glsl
if(renderStage != MC_RENDER_STAGE_DEBUG) geometryID = 1;
else geometryID = 4;
```

线框的专用几何缓冲程序我们保存在 `gbuffers_basic.glsl` 中。

## 信标光柱

信标光柱不需要处理光照，因此只需要将光柱简单地写入颜色缓冲，然后将几何 ID 设置为和 `basic` 中一样不需要处理光照的 `4`，如果你之后还想处理其他效果，也可以将其设置为一个唯一值。

值得注意的是，信标光柱外围有一圈半透明的**负几何**，类似新版红石火把的外围方块，它们只渲染背面。你可以像实体那样直接忽略透明度或设置为不处理 AO，在这里我们也暂时按照前者处理。
```glsl
[... 片段着色器 ...]
/* DRAWBUFFERS:03 */
layout(location = 0) out vec4 fragColor;
layout(location = 1) out int geometryID;
[... main ...]
geometryID = 4;
```

信标光柱的专用着色器我们保存在 `gbuffers_beaconbeam.glsl` 中。

## 仅颜色类

所谓的仅颜色类就是只输出到颜色缓冲区，不需要写入其他信息的类。

### 天空

天空包括 `skybasic` 和 `skytextured` ，唯一的区别是前者没有纹理，因此我们可以将它们整合进同一个程序中，然后通过宏来判断需不需要纹理：
```glsl
[... 顶点着色器 ...]
out VS_OUT {
    vec4 color;
    #ifdef TEXTURED_SHADER
    vec2 uv;
    #endif
} vs_out;
[... main ...]
#ifdef TEXTURED_SHADER
vs_out.uv = vaUV0;
#endif
[... 片段着色器 ...]
in VS_OUT {
    vec4 color;
    #ifdef TEXTURED_SHADER
    vec2 uv;
    #endif
} fs_in;
[... main ...]
#ifdef TEXTURED_SHADER
fragColor = texture(gtexture, fs_in.uv) * fs_in.color;
#else
fragColor = fs_in.color;
#endif
```

最后在 `skytextured` 中包含文件之前声明 `TEXTURED_SHADER` 即可：
```glsl
#define TEXTURED_SHADER
```

### 自发光类

自发光类直接将它们的内容根据不透明度与背景本身相加即可（我们之前不归一化的 0 号缓冲区已经起了一些作用了），不必写入几何 ID 和其他信息。

自发光类包括 `spidereyes` 和 `armor_glint`，我们可以共用天空所使用的程序，但是记得添加宏定义和更改混合方式：
```glsl
#define TEXTURED_SHADER
```
```properties
blend.gbuffers_spidereyes=SRC_ALPHA ONE ZERO ONE
blend.gbuffers_armor_glint=SRC_ALPHA ONE ZERO ONE
```
### 挖掘裂纹

`damagedblock` 实际上是覆盖在正在挖掘的表面上稍大的一个几何体，我们通常只对其进行颜色混合，并忽略其他内容。

挖掘裂纹的默认混合模式比较特殊，是将裂痕的颜色与之前的几何缓冲颜色相乘再相加（`DST_COLOR SRC_COLOR`），只不过裂纹区域的默认混合方式是仅保留裂纹的 Alpha 值（`ONE ZERO`）。

我们不需要裂纹的 Alpha，也不需要它覆写几何 ID，更不需要覆写法线等信息，它们通常很贴合方块表面，因此可以让它照常写入深度。因此我们也可以像自发光类那样定义 `TEXTURED_SHADER` 并调用同样的程序，只是要记得把混合模式改为
```properties
blend.gbuffers_damagedblock=DST_COLOR SRC_COLOR ZERO ONE
```

仅颜色类专用的几何缓冲程序我们保存在 `gbuffers_color_only.glsl` 中。

## 线框

`line` 中像方块选择框这种顶点本身的厚度其实只有 1 像素，因此原版的顶点着色器对它们进行了特殊处理，我们将会参考原版着色器来编写。

片段着色器比较麻烦，因为线框实际上是半透明的，在这里先提供多种方法处理它们：
- 作为世界中的几何体绘制
  - 禁用混合，直接忽略不透明度，将它作为无遮蔽类那样处理。副作用是会参与到后处理中其他效果，视你的喜好而定。
  - 禁用混合，将内容连带不透明度写入单独的缓冲区，在之后的延迟渲染中单独处理它们，并按需进行混合，这样就可以保留半透明效果。
- 作为 HUD 绘制
  - 禁用混合，忽略不透明度，仅写入颜色缓冲区（0 号缓冲区），然后在后期所有效果都忽略这片区域，副作用是模糊和扭曲类的效果可能会采样到这片区域，需要手动判断。
  - 和实体的第二种方案类似，启用混合，只保留线框的 Alpha 通道，副作用是线框覆盖范围背后的 AO 无法渲染。
  - 禁用混合，将内容连带不透明度写入单独的缓冲区，然后在着色器的最末端将它们混合到输出内容中。

在这里，我们直接将线框视为世界中的几何体，忽略光照并禁用混合，因此顶点着色器中的输出也就只有颜色了：
```glsl
out VS_OUT {
    vec4 color;
} vs_out;
```
此外，我们还需要定义一个线条宽度 `LineWidth` 和线条偏移量 `VIEW_SHRINK` ，后者会用来向摄像机偏移一小段距离，以免某些夹缝中的边框被遮挡：
```glsl
const float LineWidth = 2.5;
const float VIEW_SHRINK = 255.0 / 256.0;
const vec4 VIEW_SCALE = vec4(vec3(VIEW_SHRINK), 1.0);
```
在原版中，Mojang 将 `VIEW_SHRINK` 设置为 `1.0 - (1.0 / 256.0)` 并将 `VIEW_SCALE` 组成了一个 `mat4(VIEW_SHRINK, VIEW_SHRINK, VIEW_SHRINK, 1.0)` 的对角方阵，但是在这里我们将其改写为一个等效的向量以减少一些计算量。

在顶点着色器中，我们需要先手动进行透视除法将顶点转换到 NDC，以便进行后续处理：
```glsl
vec4 linePosStart = projectionMatrix * (modelViewMatrix * vec4(vaPosition, 1.0) * VIEW_SCALE);
vec4 linePosEnd = projectionMatrix * (modelViewMatrix * vec4(vaPosition + vaNormal, 1.0) * VIEW_SCALE);

vec3 ndc1 = linePosStart.xyz / linePosStart.w;
vec3 ndc2 = linePosEnd.xyz / linePosEnd.w;
```
`linePosStart` 很好理解，就是线框顶点的位置。`linePosEnd` 主要是为了转换到 `ndc2` 并与 `ndc1` 做差以间接求得线条在屏幕上的朝向 ^**1**^：
```glsl
vec2 lineScreenDirection = normalize(ndc2.xy - ndc1.xy);
```
最后翻转顶点坐标就能求得其在二维平面上的垂直方向，即在屏幕上间接“加粗”线框需要偏移的方向：
```glsl
vec2 lineOffset = vec2(-lineScreenDirection.y, lineScreenDirection.x) * LineWidth / screenSize;
```
这里我们对其中一个坐标取反，以便得到三维空间中正确的偏移方向 ^**2**^，然后乘以相对屏幕尺寸的线条宽度，即获得了顶点需要横向偏移的距离。

> 在原版中，处理好了偏移量之后还设置了一个取反轴如果小于 0 则取反偏移量的操作：
> ```glsl
> if (lineOffset.x < 0.0) {
>     lineOffset *= -1.0;
> }
> ```
> 但是其没有使用背面剔除，所以不需要这个判定。

最后，判定顶点的 ID，如果是偶数则取反偏移量以便朝另一边扩展 ^**3**^。具体操作为对顶点 ID 取 2 的模，如果是偶数则值为 0，即需要反转偏移方向，否则为 1。则我们可以将其减 0.5 然后使用 `sign()` 函数取其正负号，就获得了乘数 -1 或 1。最后将偏移量加到顶点 NDC 坐标上，再逆转透视除法 ^**4**^，就得到了最终的线框。
```glsl
lineOffset *= sign(float(gl_VertexID % 2) - 0.5);
gl_Position = vec4((ndc1 + vec3(lineOffset, 0.0)) * linePosStart.w, linePosStart.w);
```

**[1]** 顶点着色器无法访问其他顶点，因此线框的法线方向指向它边框的朝向，以便获取朝向。**因此我们也无法将它们的法线信息用于处理光照**！  
**[2]** 如果不取反其中一个轴，最终的朝向与我们的视野无法对齐，会导致奇怪的观感：
![翻转偏移坐标](soildGbuffer_negativeOffset.webp){style="block" width="700"}

**[3]** 可以这样做的理由是，线框的每组偶数顶点与奇数顶点都在同一个位置，始末两端都有两个顶点，因此每个线框上有两个朝向相反的三角形 ^**5**^ 。ID 为偶数的顶点反向偏移，这样横向偏移方向相同的顶点奇偶性也相同，最终就能拼凑出一个平面。也因此只需要一个法线朝向（而不是两个三角形因为 ID 奇偶性不同而需要两个相反的法线数据）即可正确偏移。在下面这张图里，我们将顶点颜色按其在内部三角形上的排列顺序设置为了 RGB，可以很明显看出第二个顶点都处在对应三角形的反方向，而整个平面由两个三角面组成：
![三角形内部顶点序号](soildGbuffer_triangleForming.webp){style="block" width="700"}

**[4]** 顶点着色器结束之后会自动进行透视除法，因此一定要记得逆转提前手动进行的透视除法，并正确设置 $w$ 分量！  
**[5]** 虽然条带只有 4 个顶点，但是每相邻产生的三个顶点都会自动拼合一个三角形，这里使用了**几何着色器**来给每个拼合出来的三角形的内部顶点 ^**6**^ 染色。你可以自行尝试将线框宽度拉大，然后观察将顶点颜色更改为 `vec3(gl_VertexID % 4)` 和 `vec3(gl_VertexID % 2)` 时变为黑色的顶点。  
**[6]** 拼接之后的三角形传入几何着色器时会自动生成独立的顶点，并在内部生成独立索引，因此顶点着色器传出的变量在几何着色器要求被声明为数组类型，以便访问。

> 由于顶点只会在屏幕朝向的垂直方向上扩展，其边缘并不能完美拼合，再加上渲染线框时没有进行半透明排序，因此当线框宽度过大时视觉瑕疵会陡增。

如果你想在片段着色器中禁用深度写入，可以使用：
```glsl
float depth = texelFetch(depthtex0, ivec2(gl_FragCoord.xy), 0).r;
gl_FragDepth = max(depth, gl_FragCoord.z);
```
即当线框相比之前几何缓冲写入片段的更靠近摄像机时，我们将当前的深度设置为之前几何缓冲的深度（相当于不覆写深度信息），否则照常写入当前片段的 $z$ 坐标（照常进行深度测试，因为被遮挡，线框片段会被丢弃）。

线框的专用几何缓冲程序我们保存在 `gbuffers_line.glsl` 中。

## 习题

1. 将法线通道和光照强度存入同一个缓冲区，法线的第三分量可以使用 `sqrt(1.0 - dot(normal.xy, normal.xy))` 进行重建，设置纹理格式时应该以值域范围大的内容为准。
2. 消化消化线框几何的相关内容，你也可以尝试自己修改 `VIEW_SHRINK` 和 `LineWidth` 值，以及尝试更改线框颜色。
3. 如果你仔细的话，可能会发现第二轮几何缓冲的雨雪和破坏粒子以及手持的半透明方块以一种非常鬼畜的形态回来了，一下雨就伸手不见五指。这是因为第二轮几何缓冲的大多数程序都会回退到 `textured` 上，而它本身又会回退到 `basic`，因此记得像我们之前那样新建一个 `gbuffers_textured.fsh` 然后丢弃所有片段！
   - 此外，`water` 会回退到 `terrain` 上，但是我们之前已经丢弃过了，而 `hand_water` 则会回退到 `hand` 上，因此也需要额外丢弃。
4. 将每个 ID 所代表的内容设置为一个常量，保存在 `Settings.glsl` 中，也相当于一个助记，比如：
    ```glsl
    [... Settings.glsl ...]
    const struct GID {
        int background;
        int commons;
        int invisible_entities;
        int glowing_entities;
        int noLighting;
    } geoID_enum = GID(0,1,2,3,4); // GLSL 的快速初始化
    [... gbuffers_aoLess.glsl ...]
    geometryID = geoID_enum.commons;
    [... gbuffers_line.glsl ...]
    geometryID = geoID_enum.noLighting;
    ```

---

希望你还没有被这么多几何缓冲搞晕。至此，我们第一轮的几何缓冲程序就全部编写完毕了。在下一节中，我们将会认识直接写入缓冲区的图像类型和多延迟处理程序绘制。

![欢迎回来，固体几何！](soildGbuffer_finish.webp){width="700" style="block"}
别忘记欣赏欣赏我们处理完毕的场景！
