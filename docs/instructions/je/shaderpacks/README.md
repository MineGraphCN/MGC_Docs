# 光影包通用教程（新手必看）

::: warning 过时的文档
这篇文档的内容在内容上部分过时。
:::

## 新手指导

### 入门必看

[#光影基础概念](#光影基础概念)

[#关于 OptiFine / Iris 如何搭配 Forge / Fabric](#关于-optifine-iris-如何搭配-forge-fabric)

在了解以上两栏内容后，再根据自己的情况选择下方对应的安装指南。

### 安装前的准备

鉴于 PCL2 其优秀的界面设计与逻辑，我们建议新手入门使用该启动器。以下是该启动器的两个版本：

[PCL2免费正式版](https://afdian.net/p/0164034c016c11ebafcb52540025c377)

[PCL2付费快照版](https://afdian.net/a/LTCat)

## 光影包前置知识

光影的专业名称为着色器。它基于MC提供的接口修改了许多MC的光照效果。这些接口由一些渲染模组控制，关于着色器的渲染模组介绍如下：

>### 主要渲染模组
>
>- **`OptiFine` 是 Minecraft Java 版的一个 Mod** ，作者为 sp614x 。该模组属于独立开发者的闭源项目。其主要功能是加载光影包、性能优化与一些渲染改进功能，为玩家获得更好的视觉体验。其前身为 ShaderMod，目前 OptiFine 已将它集成进代码，并接管了它的后续更新工作。因此不建议玩家再去使用老旧的 ShaderMod。
>   - [相关链接 - OptiFine](https://www.optifine.net/home)
>- **`Iris` 是 OptiFine 的衍生物**，属于多人开发的开源项目。与 Sodium（钠）模组共同开启时可以获得更好的游玩体验，同时为了 **Fabric** 模组加载器社区的模组兼容性而生（ **Forge** 中也有移植版，名为 `Oculus` ，由于社区的一些特性，不推荐使用）。但其开发方向与 OptiFine 相反（适配现有的光影），而光影的开发是与 Optfine 或 Canvas 同向的。而且 Iris 到目前为止对开发者并不友好。但随着 Iris 慢慢增加新的光影接口，它的新光影功能已经逐渐追上并赶超 OptiFine 。或许在未来的某个时候，我们可以看到 Iris 取代 OptiFine 的一天。
>   - [相关链接 - Iris](https://irisshaders.net/)
>
>......
>
>### 辅助渲染模组
>
>- `AdvancedShader` 是一个 **OptiFine** 的辅助模组，仅在 `1.12.2` 可用。它能够允许用户使用**仅在更高版本中可用**的着色器（如 iterationT 3.0.0 ）。
>
>   - [相关链接 - AdvancedShader](https://www.curseforge.com/minecraft/mc-mods/advancedshader)

—— 引用自 [MGC 大众科普](../../../library/shaders.md)

---

## 关于 OptiFine / Iris 如何搭配 Forge / Fabric

很多人不清楚如何搭配 ，因此我们在这里简单叙述如何选择：

- OptiFine 的优点在于 **一个模组解决所有功能** ，方便新手入门。该模组适合在两种情况下使用：
  - 低版本 MC （1.7.10 - 1.16.5）；
  - 玩法 **以原版为主体** 的高版本 MC （1.17 - 最新版）。

- Iris 的功能单一，需要搭配很多模组才能复现前者的大部分功能。适合 *愿意花时间* 的新手在遇到以下需求时使用：
  - 游戏里添加有 **声明不支持 OptiFine** 或 **明显运行有冲突** 的模组；
  - 需要加载 **Iris独占光影（如 Shrimple ）** ；
  - 在最新的 **MC快照版** ，OptiFine 尚未推出对应版本时（但也无法通过启动器直接下载。此类玩家需前往 Iris 的 Discord 服务器自行下载快照版对应的文件）

---

## OptiFine 安装与光影加载

::: tip
以下步骤分 `自动安装` 与 `手动安装` 两种形式，两种方法都只适用于 **在原版 MC 添加 OptiFine** 。如果你需要搭配 Forge / Fabric 使用，请继续往下阅读。
:::

### 自动安装 OptiFine

![安装optifine-1.png](/images/instructions/安装optifine-1.png)
![安装optifine-2.png](/images/instructions/安装optifine-2.png)

安装步骤：

- 打开 `PCL2` ；
- 点击 `下载` -> `自动安装`，选择自己需要的游戏版本后，在 OptiFine 安装栏中点击选择最新版本（一般在最顶部）。

### 手动安装 OptiFine

安装步骤：

- 点击进入 [OptiFine 官网](https://www.optifine.net/home)；
- 点击上面的 `Download` ；
- 下载对应版本的 **最新** OptiFine（如果广告无法跳过，点击旁边的 `Mirror` ）；
- 在启动器中 **预先安装并启动一次** 原版游戏；
- 双击打开下载到的文件，选择想要安装的客户端根目录，点击 `Install` 即可完成安装。

![安装optifine-3.png](/images/instructions/安装optifine-3.png)

### 加载光影

启动安装后的游戏版本。点击 `选项` -> `视频设置` -> `光影` 即可选择加载 shaderpacks 文件夹内的任意光影包。

以下是 OptiFine 自带的两个光影选项说明：

- `（内置）`： OptiFine 自带的一套基于原版的渲染系统，相较于原版会有较大的 FPS 提升。注意，有时候与一些模组（如交错次元）同时加载时会出现 BUG ，一般在第一次加载时模组也会警告，此时需要将加载选项改为 **关闭** 或 **禁用 OptiFine**。
- `（关闭）`：约等于没有安装 OptiFine ，适用于模组不兼容（内置）渲染系统时。

## OptiFine 搭配 Forge

- 在较低版本中（如 `1.12.2` ），从官网下载的 `OptiFine JAR` 文件可以作为 `Mod` 使用 （即可以用 Forge 直接加载）；
- 由于 **Forge 更新速度快于 OptiFine**，部分新版本的最新 Forge 可能会与 OptiFine 不兼容。此时需要前往 OptiFine 官网的 `更新日志`，**检查支持的 Forge 版本并回退。**

![image.png](/images/instructions/forge.png)

### 自动安装 Forge

- 在 **自动安装** 界面直接选择上图中版本的 Forge 与 OptiFine 即可解决该问题。

### 手动安装 Forge

![extract.png](/images/instructions/extract.png)

- 双击 OptiFine 官网的 Jar 文件打开安装器，将目录引导至你的游戏根目录下。在预先装好原版游戏后，点击 `Extract` ，会自动生成一个`模组版 OptiFine` 。

![mods.png](/images/instructions/mods.png)

- 将 **模组版 OptiFine** 放到 `mods` 文件夹，即可正常加载 OptiFine 。

## OptiFine 搭配 Fabric

- **添加 `OptiFabric` 模组。** Fabric 与 OptiFine 的兼容由 `OptiFabric` 模组负责，绕过该模组直接添加或尝试用 Forge 的安装方式安装皆不可行。唯一的解决方案是将 OptiFine 与 OptiFabric **一起放入** `mods` 文件夹，再由 Fabric 加载。
- 如果添加了 OptiFabric ，但 **仍然无法启动游戏或游戏未读取高清修复** ，一般是因为 OptiFabric 更新较慢的缘故。此时需要等待作者发布更新或换为 `更旧版本` 的 OptiFine 。
- 如果游戏正常进入，但 **主界面的中文变成了方块字** ，请尝试以下两种操作：
  - 移除游戏根目录下的 `.optifine` 文件夹；
  - 更换 Fabric API 不同的版本。

## OptiFine 如何搭配 Sodium / Iris 等模组

功能冲突，无法搭配，只能够选择前者或后者。

## OptiFine 无法与其他模组兼容

- 国外光影社区 ShaderLABS 整理了一份`不兼容的模组名单`，并逐一写明了如何使它们与 OptiFine 光影兼容。我们将这些内容汉化并搬运到了 **MGC 答疑手册 - Java版着色器(Shader)**，并额外添加了一些后续发现的模组。内容如下：

- [MGC 答疑手册 - Java版着色器(Shader)](../../../library/troubleshoot/je/mods_compatibility.md)

- 此外，该文档还记录了许多 OptiFine 设置上的问题与解决方法。如果你的 OptiFine 光影表现不正常，请一定要认真看完上述文档。

---

## Iris 安装与光影的加载

- 在 PCL2 的 `下载` -> `自动安装` 中下载 **只有 Fabric** 的版本；

- 在 PCL2 的 `下载` -> `Mod` 中，按照以下列表（由 Sundial 开发群的 `橙汁爷爷` 提供），搜索并下载所有模组（如只是开光影不接触材质包，可只下载 Sodium 与 Iris 两个模组）；

- 安装光影的过程与上方 [加载光影](#加载光影) 的步骤大同小异，只是界面上不同。

![Iris安装列表](/images/instructions/Iris安装列表.jpg)

---

## 使用问题

### 光影包基础问答

记录如 `光影包推荐`、`光影包占用`、`游戏优化` 等基础问题的答案。

- [MGC 光影包基础问答](../../../library/qas/je_shaders.md)

### 光影包进阶问答

记录如 `光影包安装错误`、`视频设置错误`、`模组兼容冲突` 等进阶问题的解决办法。

- [MGC 光影包进阶问答](../../../library/troubleshoot/je/shaders.md)

---

## 知识科普

### 光影包基础概念

介绍了 `主要渲染模组引擎`、`基岩版的渲染引擎` 。

- [MGC 大众科普 - 着色器基础概念](../../../library/shaders.md)

### 光影包进阶概念

介绍了 `光线追踪在 MC 中的应用`、`全局光照简介` 。

- [MGC 大众科普 - 着色器技术科普](../../../library/shaders-advanced.md)

### 光线追踪误区纠正

记录如 `伪光追`、`贴图光追` 等错误概念。

- [MGC 歧义观点 - 光线追踪](../../../library/correction/rt_misunderstanding.md)
