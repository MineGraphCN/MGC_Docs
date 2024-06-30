# Ultimate Immersion

<tldr>

如何正确使用 Ultimate immersion？如何解决使用过程出现的问题？
</tldr>

<include from="contentsLibrary.md" element-id="h_note_newT"/>

## 准备工作 {id="prepare"}

使用资源包之前你需要先进行以下准备

- 安装 1.20.1 Forge 47.2.0 + OptiFine 最新版客户端；
- 满足不同纹理分辨率对应的最低物理内存；
- 在启动器上分配你的总内存的 60% ~ 80%；
- 准备好 SEUS PTGI 光影（可访问 [Sonic Ether 的 Patreon 页面](https://www.patreon.com/sonicether/posts "可能需要代理") 获取）；
- 在光影设置中，将纹理包分辨率事先调整为你打算启用的资源包对应分辨率（若光影设置中显示为自适应分辨率，则无需调整）；
- 启用你的虚拟内存，设置为自动（系统默认开启。如果你没有自行关闭该设置，则无需理会）。

<table style="both">
<tr><td>纹理分辨率</td><td>物理内存</td><td>建议分配的内存</td><td>显存</td></tr>
<tr><td>256x</td><td>16 GiB</td><td>8 GiB ~ 10 GiB</td><td>6 GiB</td></tr>
<tr><td>512x</td><td>32 GiB</td><td>24 GiB ~ 26 GiB</td><td>8 GiB</td></tr>
<tr><td>1024x</td><td>48 GiB</td><td>36 GiB ~ 40 GiB</td><td>12 GiB</td></tr>
<tr><td>2048x</td><td>&gt; 64 GiB</td><td>&gt; 60 GiB</td><td>&gt; 16 GiB</td></tr>
</table>

> 如果你不知道如何安装光影，请前往 [光影包安装通用教程](shaderpacksCommon.md "这篇文档帮助新人从安装游戏开始，直到最终成功运行光影为止。") 。

## 安装资源包

<include from="contentsLibrary.md" element-id="install_RP"/>

## 安装模组

<tabs>
<tab title="直接安装">
<procedure>

将配套模组移至 `<你的游戏目录>\.minecraft\mods\` 下。
</procedure>
</tab>
<tab title="开启版本隔离">
<procedure>

将配套模组移至 `<你的游戏目录>\.minecraft\versions\<带有Forge的1.20.1游戏版本>\mods\` 下。
</procedure>
</tab>
</tabs>

> 你可以在 [这篇文章](shaderpacksCommon.md "光影包通用安装教程") 中了解如何安装 OptiFine 和 Forge。

## 使用 SEUS PTGI GFME 时需要调整的光影设置 {id="gfme"}

**关闭**
- 光线追踪 > 模组方块支持
- 纹理 > PBR纹理 > 自发光纹理
- 
{type="none"}

**启用**
- 纹理 > PBR纹理 > 完整反射
-
{type="none"}

> 如果你不知道如何使用 GFME，请前往 [GFME 使用手册](gfme.md){summary=""} 了解其使用方法。

## 一些问答

必须使用 SEUS PTGI 吗？
: 你可以使用任何你喜欢的着色器，或者如果你是 Mac 用户或者拥有图形不支持或性能较低的设备，你也可以选择不使用着色器。你仍然可以在任何光照环境中享受使用我的模组进行建造，但会牺牲一些视觉效果。目前 SEUS PTGI 看起来效果最好，而我的纹理最初就是在 PTGI 环境中设计的。

为什么会看到紫黑色方块？
: 可能有几个原因导致你看到它们：
1. 你可能忘记加载 Ultimate Immersion 的资源包，而只添加了模组。
2. 你可能同时加载了模组和资源包，但是你使用的是旧版本的资源包。这意味着新的模型和纹理无法加载，因为它们并不存在于你使用的资源包版本中。

为什么游戏会崩溃？
: 可能有很多原因导致你的游戏崩溃。以下是其中一些可能的原因：
1. 最广泛的原因是内存不足。请按照 [前文](#prepare "准备工作") 所述表格选择资源包分辨率，分配合适的内存。关闭虚拟内存也会导致内存不足！
2. 在加载包含 Ultimate Immersion Modern Archviz 模组方块的世界之前，你忘记了加载资源包。
3. 你正在使用较新的模组版本与旧版本的资源包。
4. 你正在使用盗版资源包。
5. 你正在使用不受支持的 Forge 版本。通常最新版本并不是最好的，可能仍然存在错误，因此建议选择一个稳定的 Forge 版本。

为什么使用2048x时崩溃了？
: 目前 2048x 已经超过了 OptiFine 可以加载的限制，但这仅仅是因为 OptiFine 存在的一个 bug，Ultimate Immersion 已经提交并正在等待解决。当你尝试使用 <shortcut>F3</shortcut><shortcut>T</shortcut> 重新加载 CTM 纹理，比如道路沥青时，这对引擎的压力太大了。由于 Minecraft 和 OptiFine 引擎在纹理加载方面非常有限，它们很快就会填满你分配的运行内存，更重要的是你的显存，这主要是导致崩溃的原因。基本上，当使用 <shortcut>F3</shortcut><shortcut>T</shortcut> 重新加载包时，它会再次加载整个包，并且会将你的内存和显存的使用量翻倍，而不会清除旧数据。这最终会导致资源限制并崩溃。
<p>因此，在 OptiFine 解决加载 bug 之前，2048x 将需要保持分割，并且一次只能使用一个。然而，512x 和 1024x 没有这样的问题。</p>

为什么需要使用 <shortcut>F3</shortcut><shortcut>T</shortcut> 重载世界？
: <shortcut>F3</shortcut><shortcut>T</shortcut> 在进入游戏世界时重新加载是必要的，因为 OptiFine CTM 加载的 bug，Ultimate Immersion 已经提交并等待解决。OptiFine 应该在第一次加载时与 Forge 一起加载所有内容，但 CTM 纹理无法成功加载。相反，它们可以通过强制使用 <shortcut>F3</shortcut><shortcut>T</shortcut> 来重新加载。
<p>当这个 bug 被修复时，Ultimate Immersion 现代建筑模组将会解决许多问题。</p>

为什么安装上所有包后仍然有原版的贴图？
: Ultimate Immersion Modern Archviz 模组并非用于生存。它仅用于创意现代建筑可视化，出于性能考虑，建议在一个平坦的世界中运行它。
<p>那么为什么 Ultimate Immersion 不对每个方块进行纹理处理呢？因为任何 PC 都无法在如此高分辨率以及与着色器结合的情况下加载和运行它。</p>

为什么有一些玻璃会被渲染成水面？
: 这只是一个关于自定义半透明方块 ID 的着色器加载错误。要解决这个问题，你只需要进入视频设置 > 光影，将着色器关闭再重新打开即可。当然，按照 [前文教程](#gfme){summary=""} 使用 SEUS PTGI GFME 也可以一劳永逸。

为什么树叶看起来很奇怪？
: 因为你需要将树叶设置从 `流畅` 改为 `高品质`。前往视频设置 > 细节可调整。
