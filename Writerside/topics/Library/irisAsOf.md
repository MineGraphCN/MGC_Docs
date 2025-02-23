# Iris 等效 OptiFine 功能的模组

<primary-label ref="manual"/>

<secondary-label ref="port"/>

<secondary-label ref="jeDoc"/>
<secondary-label ref="irisDoc"/>

<show-structure depth="2"/>

> 资料来源：[Fabric Wiki - OptiFine alternatives](https://fabricmc.net/wiki/community:optifine_alternatives#performance)

## 性能／兼容性

Sodium [(Modrinth)](https://modrinth.com/mod/sodium)
: Iris 运行的必需品。

Indium [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/indium) [(Modrinth)](https://modrinth.com/mod/indium)
: 确保 Sodium 和某些模组兼容性的必需品。

## 缩放

Zoomify [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/zoomify) [(Modrinth)](https://modrinth.com/mod/zoomify)
: 有大量可自定义选项的缩放模组。

Logical Zoom [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/logical-zoom) [(Modrinth)](https://modrinth.com/mod/logical-zoom)
: 简单的缩放功能模组。

WI Zoom [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/wi-zoom)
: 来自 Wurst 端的缩放模组。

Fabricated Zoomer [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/fabricated-zoomer)
: OK Zoomer 的 Fabric 移植版。

## 资源包

### 自定义实体模型（CEM）

Entity Model Features [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/entity-model-features) [(Modrinth)](https://modrinth.com/mod/entity-model-features)
: 在 Forge 和 Fabric 上用以替代 OptiFine 的 CEM 模组。

Custom Entity Models [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/custom-entity-models-cem) [(Modrinth)](https://modrinth.com/mod/cem)
: 基于 OptiFine 格式的 CEM，旨在实现与 OptiFine 对等的 CEM 等功能。

### 发光／自定义／随机实体纹理

Entity Texture Features [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/entity-texture-features-fabric) [(Modrinth)](https://modrinth.com/mod/entitytexturefeatures)
: 添加了许多实体纹理特性，包括实体和玩家皮肤特性。

### 自定义物品纹理（CIT）

CIT Resewn [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/cit-resewn) [(Modrinth)](https://modrinth.com/mod/cit-resewn)
: MCPatcher CIT 脱离 OptiFine 在 Fabric 上的独立模组。

Chime [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/chime-fabric) [(Modrinth)](https://modrinth.com/mod/chime)
: 和 MCPatcher / OptiFine **不兼容**的 CIT 系统。

### 连接纹理（CTM）／自发光纹理

Continuity [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/continuity) [(Modrinth)](https://modrinth.com/mod/continuity)
: 为所有 OptiFine 格式的资源包提供 CTM 支持，同时还支持 OptiFine 原版自发光纹理。内置了一套连接纹理和一套玻璃剔除修复纹理。

### 动态纹理

MoreMcmeta [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/moremcmeta-fabric) [(Modrinth)](https://modrinth.com/mod/moremcmeta)
: 支持使用 `json` 和 OptiFine 文件给几乎所有纹理添加动画。提供纹理配置 API，并可以通过添加 [附属模组](https://www.curseforge.com/minecraft/mc-mods/moremcmeta-emissive-fabric) 获得自发光纹理支持。

Animatica [(CurseForge)](https://curseforge.com/minecraft/mc-mods/animatica) [(Modrinth)](https://modrinth.com/mod/animatica)
: 支持 OptiFine / MCPatcher 格式动态纹理的模组。

### 自定义颜色

Polytone [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/polytone) [(Modrinth)](https://modrinth.com/mod/polytone)
: 自定义地图颜色、方块颜色、颜色映射图、群系颜色、染料颜色和方块音效。支持 OptiFine 格式。

Vanadium [(Modrinth)](https://modrinth.com/mod/vanadium)
: 一个简单的实现资源包缓存和混合自定义颜色的模组。支持 OptiFine 格式。

Colormatic [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/colormatic) [(Modrinth)](https://modrinth.com/mod/colormatic)
: 和 Fabric 原本的自定义颜色模块兼容的独立实现模组。与 OptiFine 格式完全兼容，并添加了额外功能。

### 自定义天空

FabricSkyboxes [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/fabricskyboxes) [(Modrinth)](https://modrinth.com/mod/fabricskyboxes)
: 使用**模组自定义的格式**实现像 OptiFine 自定义天空一样的功能。

    FabricSkyboxes Interop [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/fabricskyboxes-interop) [(Modrinth)](https://modrinth.com/mod/fabricskyboxes-interop)
    : 支持 MCPatcher / OptiFine 格式的自定义天空，会自动将 OptiFine 自定义天空格式转换到 FabricSkyboxes 格式。两个模组搭配使用获得最好的效果。

### 动态光源

LambDynamicLights [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/lambdynamiclights) [(Modrinth)](https://modrinth.com/mod/lambdynamiclights)
: 让实体持有的光源和发光的实体本身产生光照。可能存在性能问题。

Mini Dynamic Lights [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/mini-dynamic-lights) [(Modrinth)](https://modrinth.com/mod/mdl)
: 通过几乎最少的计算量实现快速动态光源的模组。

### 更好的草地

Fast Better Grass (资源包) [(CurseForge)](https://www.curseforge.com/minecraft/texture-packs/fast-better-grass) [(Modrinth)](https://modrinth.com/resourcepack/fast-better-grass)
: 让草方块和相关的纹理侧面使用顶面纹理，可以与其他纹理包一起工作。**不像 OptiFine 的高品质模式那样工作（没有动态侧面纹理）**。

### 迷雾调整

Sodium Extra [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/sodium-extra) [(Modrinth)](https://modrinth.com/mod/sodium-extra)
: Sodium 中没有的额外功能。

### 自定义启动屏幕

Puzzle [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/puzzle) [(Modrinth)](https://modrinth.com/mod/puzzle)
: 将上面的部分模组设置整合到一个屏幕里，并添加了资源包功能。

### 自定义 GUI

OptiGUI [(CurseForge)](https://www.curseforge.com/minecraft/mc-mods/optigui) [(Modrinth)](https://modrinth.com/mod/optigui)
: 自定义物品栏 GUI 和其他更多特性。
