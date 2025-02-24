# 光影和模组兼容性

<primary-label ref="manual"/>

<secondary-label ref="jeDoc"/>
<secondary-label ref="ofDoc"/>
<secondary-label ref="shaderDoc"/>

这篇文档列出了我们所知的模组和光影间兼容性冲突的解决办法。

- 以下问题需要在 `.minecraft/config` 中寻找模组对应的配置文件，使用文本编辑器进行修改。
- 也可在游戏内 `模组设置` 中找到各个模组的配置项。但可能缺少必要的注释说明，默认不建议。

高级火箭 Advanced Rocketry
: 将 `overworldSkyOverride` 设置为 `false`。

星辉魔法 Astral Sorcery
: 
  1.12.2及更早版本
  : 
  - 删除 `S:skySupportedDimensions <0>` 中的 `0` ；
  - 在 `S:weakSkyRenders` 中添加 `0` 。它们应该看起来像这样：
  ```
  S:skySupportedDimensions <>
  S:weakSkyRenders <0>
  ```
  > 在 **iterationT 3.1** 中或许会导致白屏现象，但在高版本星辉中测试正常。我们猜测问题出在 1.12.2 的星辉本身。
  > 
  {style="note"}

  1.15.x
  :
  - 删除 `skySupportedDimensions = [0]` 中的 `0` ；
  - 在 `weakSkyRenders` 中添加 `0` 。它应该看起来像这样：
  ```yaml
  skySupportedDimensions = []
  weakSkyRenders = [0]
  ```

  1.16.x
  :
  - 删除 `skyRenderingEnabled = ["minecraft: overworld"]` 中的 `minecraft: overworld` ；
  - 在 `skyRenderingConstellations` 中添加 `"minecraft:overworld"` 。它应该看起来像这样：
  ```yaml
  skyRenderingEnabled = []
  skyRenderingConstellations = ["minecraft:overworld"]
  ```

更好的末地 Better End
: 如果它导致你使用的光影包出现问题，请在 `config/betterend/client.json` 中把 `customSky [default:true]`设置为 `false` 。

更好的树叶 Better Foliage <sup>1.12</sup>
: 不一定会崩溃，但在某些光影包中会导致树叶断裂。
要解决这个问题，你需要去确定主界面的 `Mods` > `Better Foliage` > `Shader Configuration` 是否与你的光影包的 `block.properties` 文件中的指定值相匹配。
> `block.properties` 可以包含多个游戏版本的 ID 映射，所以一定要确定你使用了正确版本的 ID。如果你不确定要使用什么 ID，请询问光影作者。
> 
{style="note"}

交错次元／黑暗沼泽 Betweenlands
: 将 `use_shader` 设置为 `false` 。
> 这将解决一些渲染问题，但光影可能不会在模组的维度工作。
> 
{style="note"}

植物魔法 Botania
: 将 `fancySkybox.enable` 和 `shaders.enabled` 设置为 `false` 。

COFH Core <sup>1.15+</sup>
: 将 `Render Area Effect Block Breaking` 设置为 `false`。

电脑 Computer Craft Tweaked
: 将 `monitor_renderer` 设置为 `gui.computercraft:config.peripheral.monitor_renderer.vbo`。

Extended Days
: 将 `Override Sky Rendering` 设置为 `false`。

HBM的核科技重制版 Hbm's Nuclear Tech Mod Reloaded
: 在 `config/hbm/hbm.cfg` 中将 `B:1.29_enableShaders2` 改为 `false`。

投影 Litematica
: 将 `Visuals` > `enableRendering` 设置为 `false` 。

Psi
:
  1.12
  : 将 `B: "Use Shaders"` 设置为 `false`。

  1.15+
  : 将 `useShaders` 设置为 `false`。

老鼠 Rats
: 在 `视频设置` > `性能` 中关闭 `快速渲染` 。

雪！真实的魔法！ Snow! Real Magic!
: 在 `视频设置` > `光影` 中打开 `经典光效`。

神秘时代 Thaumcraft
: 将 `图形设置` > `disableShaders` 设置为 `true`。

神秘进阶 Thaumic Augmentation
: 将 `图形设置` > `disableShaders` 设置为 `true` 并**重启游戏**。

午夜 The Midnight Mod
: 将 `rift_shaders` 设置为 `false` 。
> 这将解决一些渲染问题，但光影可能不会在模组的维度工作。
> 
{style="note"}

热动力学 Thermal Dynamics
: 在你的游戏中添加 [Unifine](https://www.curseforge.com/minecraft/mc-mods/unifine)

## 最后

如果你已经排除了上述所有的模组，那么找出问题模组的下一步就是进行**二分法搜索**。

1. 将你的模组分成 2 组
2. 测试这两组，**保留仍有问题的那一组**
3. **重复**，直到只剩下一个模组（和它的前置模组）
4. **反馈给管理组**，以便于我们将它添加进这里
