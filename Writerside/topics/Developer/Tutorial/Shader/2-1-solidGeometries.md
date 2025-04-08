# 固体几何缓冲

<secondary-label ref="wip"/>

<tldr>

在上一章中，我们完成了一个几何缓冲并在延迟处理中渲染了动态阴影。但是上一章的内容还不足以构成一个哪怕可用的光影。从本章开始，我们将会从固体几何开始，逐步构建一个完整可用的光影。

本节我们将会逐个还原第一轮几何缓冲（即固体几何缓冲）中的内容。

</tldr>

> 本节内容是为了附录 3 的 [](a03-shaderProp.md#blend) 小节而临时开放，因此内容没有完全编写完毕。
>
{style="warning"}

## 几何分类

在 OptiFine 中，整个场景被拆分到了将近 20 个几何缓冲，要为它们逐一编写处理程序会在今后的修改带来很多不必要的麻烦。

大多数几何的处理方法应该是相似的，因此我们可以将它们分门别类，然后为每一类几何缓冲编写一个统一的程序。在之前，我们浅用了 `#include` 命令进行函数包含。这里我们将更进一步，使其包含整个着色器程序：
```glsl
#ifdef VERTEX_STAGE
[... 顶点着色器程序 ...]
#endif
#ifdef FRAGMENT_STAGE
[... 片段着色器程序 ...]
#endif
```
将其放入一个新的文件夹 `shaders\programs\` ，这里的内容都是直接使用的着色器程序。最后在各几何缓冲的顶点和片段阶段调用对应的内容：
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
    fragColor = texture(gtexture, fs_in.uv) * fs_in.color;
    if(fragColor.a <= alphaTestRef) discard;
    fragColor.a = fs_in.color.a;
    normals = fs_in.normal *.5+.5;
    light = fs_in.vanillaLightStrength;
}
#endif
```
{collapsible="true" default-state="collapsed" collapsed-title="gbuffers_terrain.glsl"}

## 纹理格式

## 混合方程 {id="blend"}

OptiFine 中的一些几何缓冲默认启用了**混合**（Blending），它可以让一些内容在输出时与缓冲区上已有内容进行色彩混合。为了保证

混合方程（Blend Equation）可以让 GL 根据输出的内容和缓冲区本来的内容进行混合处理。
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
的顺序设置混合因子 $F$，如：
```properties
blend.gbuffers_terrain = <off|src dst srcA dstA>
```
每个因子可以使用下列参数：

| 参数                    | 值                                       | 备注       |
|-----------------------|-----------------------------------------|----------|
| `off`                 | 禁用混合                                    | 只需设置一个因子 |
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

也可以逐个缓冲区设置混合模式，如：
```properties
blend.gbuffers_entities.colortex0 = <off|src dst srcA dstA>
```

> `off` 的效果与 `ONE ZERO ONE ZERO` 相同，它们都是将源数据完全覆盖目标数据。

- 实体（`entities`）和挖掘裂纹（`damaged_block`）默认启用了前文中“与 `mix()` 相似”的混合方法（即 `SRC_ALPHA ONE_MINUS_SRC_ALPHA`），除了 Alpha 通道，实体保留了源 Alpha，而挖掘裂纹保留了目标 Alpha。
- 其他几何缓冲默认禁用混合。

[//]: # (## 无遮蔽类)

[//]: # ()
[//]: # (由于不需要遮蔽，我们可以在 alpha test 之后立即丢弃 alpha 内容。)

[//]: # ()
[//]: # (考虑到一些模组可能会优化方块实体的渲染，为其添加 AO，你也可以将它视为常规类，像地形那样渲染。)

[//]: # ()
[//]: # (## 无纹理类)

[//]: # ()
[//]: # (## 天空类)

[//]: # ()
[//]: # (## 无光照类)

[//]: # ()
[//]: # (### 自发光类)

[//]: # ()
[//]: # (## 挖掘裂纹)

[//]: # ()
[//]: # (## 实体)

[//]: # ()
[//]: # (沟槽的entities)

[//]: # ()
[//]: # (> 在 terrain 之后运行，所以它的半透明不会将地形盖掉)

[//]: # (> 在 translucent 之前运行，已经写入了 depth，所以会把半透明盖掉)

[//]: # (> 自身由于几何排序原因有些内容会把另一些盖掉，有些不会（半透明进行了排序，但是它被当成固体处理所以没有排序）)

[//]: # ()
[//]: # (> `entities` 同时接管了实体阴影（原版实体脚下的圆形纹理），但是当我们在阴影贴图中启用实体（默认）时，实体阴影会被自动禁用。)

[//]: # ()
[//]: # (如果你不希望实体进入阴影贴图，可以使用)

[//]: # ()
[//]: # (```properties)

[//]: # (shadowEntities = false)

[//]: # (```)

[//]: # (来禁用)

[//]: # ()
[//]: # (### 发光实体)

[//]: # ()
[//]: # (## 混合函数)
