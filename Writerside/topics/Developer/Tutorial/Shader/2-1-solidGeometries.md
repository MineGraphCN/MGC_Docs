# 固体几何缓冲

<tldr>

在上一章中，我们完成了一个几何缓冲并在延迟处理中渲染了动态阴影。但是上一章的内容还不足以构成一个哪怕可用的光影。从本章开始，我们将会从固体几何开始，逐步构建一个完整可用的光影。

本节我们将会逐个还原第一轮几何缓冲（即固体几何缓冲）中的内容。

</tldr>

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
将其放入一个新的文件夹 `\shaders\programs\` ，这里的内容都是直接使用的着色器程序。最后在各几何缓冲的顶点和片段阶段调用对应的内容：
```glsl
#version ...
#define GBUFFER_SHADER
#define VERTEX_STAGE
#include "/programs/..."
```
这样也能更加易于维护。

本节我们处理的所有内容都是固体几何缓冲，它们既不需要像半透明几何那样处理混合，也不需要像粒子几何那样处理法线。

## 逐类处理

### 普通固体类

我们这里所谓的“普通”，是指像 `terrain` 那样，（目前）只需要处理光照，而且在场景中占比较大的几何。

回顾一下 [](1-3-deferredLighting.md#bufferTargets){summary=""} 中的内容，除了 `terrian` 所指的地形外，实体 `entities` 和 `block` 也应该包含其中，除了它们之外，我们手持固体方块时调用的 `hand` 也不例外。

和之前一样，在 `shaders` 下新建对应程序的 `gbuffers_XXX.vsh` 和 `gbuffers_XXX.fsh` 。虽然为了省事我们可以直接让不存在的程序继承父级，但是显式声明总归是更好的。因此归属 `terrain` 的 `block` 也不例外。

```
gbuffers_block.vsh
gbuffers_block.fsh
gbuffers_entities.vsh
gbuffers_entities.fsh
gbuffers_hand.vsh
gbuffers_hand.fsh
```

我们的“普通”固体通用的着色器程序都将包含在 `gbuffers_common.glsl` 中，并以我们之前所写的 `terrain` 的内容为蓝本：

```glsl
#ifdef VERTEX_STAGE
[... 顶点着色器程序 ...]
#endif
#ifdef FRAGMENT_STAGE
[... 片段着色器程序 ...]
#endif
```

### 无纹理类

### 天空类

### 无光照类

#### 自发光类

### 挖掘裂痕

### 发光实体
