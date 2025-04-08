# 光影配置文件

<secondary-label ref="wip"/>

<tldr>

本文列举了 `shaders.properties` 中的所有可配置内容。

对应的视频设置选项具有更高优先级，除非是 `默认`。
</tldr>

<var name="src_name">GitHub OptiFineDoc/shaders.properties</var>
<var name="src_link">https://github.com/sp614x/optifine/blob/master/OptiFineDoc/doc/shaders.properties</var>

<include from="uniforms.md" element-id="h_note_translated"/>

## 环境设置

```properties
clouds=fast|fancy|off
```
流畅、高品质或禁用原版云。`细节` > `云` 具有更高的优先级。

```properties
oldHandLight=true|false
```
启用或禁用经典手持光源，可以让只辨别主手光源的光影在副手持光源时也能正常工作。默认为 `true`，`光影` > `经典手持光源` 具有更高的优先级。

```properties
dynamicHandLight=true|false
```
启用或禁用动态光源。默认为 `true`，`动态光源` 具有更高的优先级。

```properties
oldLighting=true|false
```
启用或禁用经典光效。默认为 `true`，`光影` > `经典光效` 具有更高的优先级。变更该设置会导致资源包重载。

```properties
shadowTerrain=true|false
shadowTranslucent=true|false
shadowEntities=true|false
shadowBlockEntities=true|false
```
启用或禁用阴影几何缓冲中的地形、半透明、实体、方块实体渲染。默认为 `true`。

```properties
underwaterOverlay=true|false
```
启用或禁用处于水下时屏幕上的水纹理覆层。默认为 `true`。

```properties
sun=true|false
moon=true|false
```
启用或禁用太阳、月亮。`细节` > `日月` 具有更高的优先级。

```properties
vignette=true|false
```
启用或禁用屏幕边缘暗角。`细节` > `晕影` 具有更高的优先级。

```properties
backFace.solid=true|false
backFace.cutout=true|false
backFace.cutoutMipped=true|false
backFace.translucent=true|false
```
启用或禁用固体、裁切、带 MipMap 的裁切、半透明几何的背面渲染，启用后朝向背离屏幕的表面也会被渲染。默认为 `false`。

```properties
rain.depth=true|false
```
启用或禁用雨雪粒子写入深度。默认为 `true`。

```properties
beacon.beam.depth=true|false
```
启用或禁用信标光柱写入深度。默认为 `true`。

```properties
separateAo=true|false
```
启用或禁用分离原版环境光遮蔽，启用后将顶点环境光遮蔽写入顶点颜色的 Alpha 通道，只对固体地形生效。默认为 `false`。

```properties
frustum.culling=true|false
```
启用或禁用视锥裁切，启用后不可见的几何体将被丢弃，用以提高性能。默认为 `true`。

```properties
shadow.culling=true|false
```
启用或禁用阴影视锥裁切，启用后部分 OptiFine 版本裁切由玩家视锥体控制，会导致问题。默认为 `true`。

```properties
particles.before.deferred=true|false
```
启用或禁用粒子提前渲染，启用后粒子将会在 deferred 程序之前（第一轮几何缓冲）处理。默认为 `false`。

```properties
version.<mc_ver>=<of_edition>
```
光影最低要求的 OptiFine 版本。例如：
```properties
version.1.12.2=D1
version.1.10.2=F1
version.1.8=J1
```

## 自定义纹理 {id="customTex"}

```properties
texture.<stage>.<name>=<path>
```

将自定义纹理绑定到可用着色器的对应纹理单元。

- `stage`：
  - `gbuffers`：几何缓冲和阴影几何缓冲程序
  - `deferred`：第一轮几何缓冲后的延迟处理（Deferred）
  - `composite`：第二轮几何缓冲后的延迟处理程序（Composite 和 Final）
- `Name`：纹理单元名称，可用名称请参考 [Textures - OptiDocs](https://optifine.readthedocs.io/shaders_dev/textures.html#gbuffers-textures) [^**1**^](#foot_1){id="foot_1a" summary="不久之后我们会将这些内容搬运到本站上。"}

### 纹理来源

光影
:
相对 `shaders` 内的路径，例如：
```properties
texture.composite.colortex1=textures/noise.png
```

资源包
:
以 `minecraft:` 开头的路径，例如：
```properties
texture.composite.colortex2=minecraft:textures/font/ascii.png
```

变化纹理（光照贴图和纹理集）
:
```properties
texture.composite.colortex3=minecraft:dynamic/lightmap_1
texture.composite.colortex4=minecraft:textures/atlas/blocks.png
```

### 特殊后缀

使用 `_n` 和 `_s` 后缀可以加载法线/高光纹理：`minecraft:textures/atlas/blocks_n.png`

### 原始纹理（二进制数据转储）

```properties
texture.<stage>.<name>=<path> <type> <internalFormat> <dimensions> <pixelFormat> <pixelType>
```

- `<type>`：纹理类型，下列之一：
  - `TEXTURE_1D`
  - `TEXTURE_3D`
  - 
  - `TEXTURE_2D`
  - `TEXTURE_RECTANGLE`
  - 

  {columns="3"}
- `<internalFormat>`：纹理格式，参考 [](a04-formats.md#texFormat){summary=""}
- `<dimensions>`：每个维度的尺寸，设置数量取决于纹理类型
- `<pixelFormat>`：像素格式，参考 [](a04-formats.md#pxFormat){summary=""}
- `<pixelType>`：像素类型，参考 [](a04-formats.md#pxType){summary=""}

```properties
texture.composite.gaux1=textures/lut_1d.dat TEXTURE_1D RGBA32F 256 RGBA FLOAT
texture.composite.gaux1.2=textures/lut_3d.dat TEXTURE_3D RGBA32F 64 64 64 RGBA FLOAT
```

- 可以将多个纹理绑定到同一个纹理单元，然后在着色器中使用 `sampler1d`、`sampler2d`、`sampler3d` 等不同的采样器格式进行区分。每个程序只能使用每个纹理单元的其中一种采样器类型。
- 可以在 `<name>` 后添加后缀 `.0`~`.9` 来避免重复定义的属性键。

可以通过同名的 `.mcmeta` 文件设置边缘环绕行为和过滤方式。

### 噪声纹理

```properties
texture.noise=<path>
```

专用于保存噪声的纹理单元（当然你硬要用其他的纹理也没法拦着你）。

## 光影设置

见 [Options screen - OptiDocs](https://optifine.readthedocs.io/shaders_dev/options.html?h=shader+option#options-screen) [^**1**^](#foot_1){id="foot_1b" summary="不久之后我们会将这些内容搬运到本站上。"} 。

```properties
sliders=<list of options>
profile.NAME=<list of options>
screen.columns=2
screen.NAME.columns=2
```

## 自定义统一变量

[//]: # (TODO)

## Alpha 测试

```properties
alphaTest.<program>=<off|func ref>
```

> 虽然文档中写明可以指定每个程序的 Alpha 测试函数和参考值，但是实际上这行配置并没有作用。

## 混合 {id="blend"}

见 [](2-1-solidGeometries.md#blend) 。

```properties
blend.<program>=<off|src dst srcA dstA>
blend.<program>.<buffer>=<off|src dst srcA dstA>
```

## 延迟处理渲染缩放

```properties
scale.<program>=<scale|scale offsetX offsetY>
```

自定义延迟处理程序中铺屏四边形的视口尺寸。要求所有值都在 $[0,1]$ 区间内。

## 翻转缓冲区

```properties
flip.<program>.<buffer>=<true|false>
```

启用或禁用指定延迟处理程序的指定颜色附件的缓冲区翻转功能，即“乒乓缓冲区”（Ping-pong buffer）。禁用翻转后，下一个延迟处理程序将会共享输入和输出。最后一个完成写入的程序应当启用缓冲区翻转，以便之后的程序正确读取写入后的内容。

这个功能可以用于多个程序读取和写入同一个缓冲区不同区域的内容。强制翻转缓冲区可以用于读取一个颜色附件的两个缓冲区上的不同内容（即使在程序中没有向缓冲区写入内容也强制翻转，以便在下一个程序中读取颜色附件上另一个缓冲区的内容）。

当程序向缓冲区写入内容后，默认会翻转缓冲区，如果没有写入内容，则不会翻转缓冲区。

## 缓冲区尺寸

```properties
size.buffer.<buffer>=width height
```

指定固定尺寸的缓冲区。只有 `prepare`、`deferred` 和 `composite` 程序可以向固定尺寸缓冲区写入。

不可以同时向多个不同尺寸的缓冲区中写入，即一个程序中只能向同尺寸的多个缓冲区输出。

当高宽尺寸为浮点值时，会作为相对窗口渲染的尺寸。如
```properties
size.buffer.colortex2=0.5 0.5
```
会创建一个高宽均为渲染分辨率一半的缓冲区。渲染分辨率由 `光影` > `渲染精细度` 和游戏窗口分辨率共同控制。

## 开关特定的程序

```properties
program.<program>.enabled=<expression>
```

和光影设置联动，用以当关闭一些效果时禁用处理它们的程序或启用相关后备程序。程序名称可以包含维度，如：
```properties
program.world-1/composite2.enabled=BLOOM
```

表达式可以是多个定义组成的布尔运算，如：
```properties
program.composite.enabled=(BLOOM || SSAO) && !GODRAYS
```

---

<p id="foot_1">

**[1]** [↑](#foot_1a){summary="自定义纹理"} [↑](#foot_1b){summary="光影设置"} 不久之后我们会将这些内容搬运到本站上。
</p>
