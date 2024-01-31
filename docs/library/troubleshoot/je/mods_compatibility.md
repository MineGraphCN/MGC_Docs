# 模组兼容性

::: warning 未经优化的文档
这篇文档的格式较为不规范，目前正在订正中。
:::

- 以下问题需要在 `.minecraft/config` 中寻找模组对应的配置文件，使用文本编辑器进行修改。
- 也可在游戏内 `模组设置` 中找到各个模组的配置项。但可能缺少必要的注释说明，默认不建议。

## Advanced Rocketry（高级火箭）

将 _**overworldSkyOverride**_ 设置为 **false**。

## Astral Sorcery（星辉魔法）

1.12.2及更早版本
- 删除 `S:skySupportedDimensions <0>` 中的 `0` ；
- 在 `S:weakSkyRenders` 中添加 `0` 。它们应该看起来像这样：

```txt
S:skySupportedDimensions < >
S:weakSkyRenders <0>
```

注意：在 **iterationT 3.1** 中或许会导致 `白屏` 现象，但在高版本星辉中测试正常。我们猜测问题出在 1.12.2 的星辉本身。

1.15.x
- 删除 `skySupportedDimensions = [0]` 中的 `0` ；
- 在 `weakSkyRenders` 中添加 `0` 。它应该看起来像这样：

```txt
skySupportedDimensions = [ ]
weakSkyRenders = [0]
```

1.16.x

- 删除 `skyRenderingEnabled = ["minecraft: overworld"]` 中的 `minecraft: overworld` ；
- 在 `skyRenderingConstellations` 中添加 `"minecraft:overworld"` 。它应该看起来像这样：

```txt
skyRenderingEnabled = [ ]
skyRenderingConstellations = ["minecraft:overworld"]
```

## Better End（更好的末地）

如果它导致你使用的光影包出现问题，请在 `config/betterend/client.json` 中把 `customSky [default:true]`设置为 `false` 。

## Better Foliage（更好的树叶）<sup>1.12</sup>

不一定会崩溃，但在某些光影包中会导致树叶断裂。

要解决这个问题，你需要去确定主界面的 _Mods -> Better Foliage -> Shader Configuration_ 是否与你的光影包的 _**block.properties**_ 文件中的指定值相匹配。

注意：_**block.properties**_ 可以包含多个MC版本的ID，所以一定要为你的MC版本使用正确的ID。如果你不确定要使用什么ID，请询问光影包的创作者。

## Betweenlands（交错次元 / 黑暗沼泽）

将 **use_shader** 设置为 **false**。注意：这将解决一些渲染问题，但光影可能不会在模组的维度工作。

## Botania（植物魔法）

将 _**fancySkybox.enable**_ 和 _**shaders.enabled**_ 设置为 **false**。

## COFH Core <sup>1.15+</sup>

   将 _**Render Area Effect Block Breaking**_ 设置为 **false**。

## Computer Craft Tweaked（电脑）

将 **_monitor_renderer_** 设置为 "gui.computercraft:config.peripheral.monitor_renderer.vbo"。

## Extended Days

将 **_Override Sky Rendering_** 设置为 **false**。

## Hbm's Nuclear Tech Mod Reloaded（HBM的核科技重制版）

在 `config/hbm/hbm.cfg` 中将 _**B:1.29_enableShaders2**_ 改为 **false**。

## Litematica（投影）

将 _**Visuals -> enableRendering**_ 设置为 **false**。

## Psi

- 1.12

   将 **_B: "Use Shaders "_** 设置为 **false**。
- 1.15+

   将 **_useShaders_** 设置为 **false**。

## Rats（老鼠）

在 _**视频设置 -> 性能**_ 中关闭 _**快速渲染**_。

## Snow! Real Magic!（雪！真实的魔法！）

在 _**视频设置 -> 光影**_ 中打开 _**传统照明**_。

## Thaumcraft（神秘时代）

将 _**图形设置 -> disableShaders**_ 设置为 **true**。

## Thaumic Augmentation（神秘进阶）

 将 _**图形设置 -> disableShaders**_ 设置为 **true** 并**重启游戏**。

## The Midnight Mod（午夜）

将 **_rift_shaders_** 设置为 **false**。注意：这将解决一些渲染问题，但光影可能不会在模组的维度工作。

## Thermal Dynamics（热动力学）

在你的游戏中添加 Unifine：[https://www.curseforge.com/minecraft/mc-mods/unifine](https://www.curseforge.com/minecraft/mc-mods/unifine)

## 最后

如果你已经排除了上述所有的 Mod，那么找出问题 Mod 的下一步就是进行**二分法搜索**。

- 将你的 _Mods_ 分成 _**2**_ 组
- 测试这两组，并**保留仍有问题的那一组**
- **重复**，直到只剩下一个 Mod（和它的前置 Mod ）
- **反馈给管理组**，以便于我们将它添加进这里
