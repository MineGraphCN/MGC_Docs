# 光影包安装通用教程

> 这篇文档正在重写中，可能无法流畅地阅读。
>
{style="warning" title="正在重写的文档"}

这篇文档帮助新人从安装游戏所需的模组开始，直到最终成功运行光影为止。  
阅读 [这篇文章](shaderBasic.md) 可以带你快速了解光影相关的基本概念。

## 准备工作

### 启动器

这篇文章主要使用 **HMCL** 和 **PCL 2** 两款国产启动器进行教学，你可以在下面获取这些启动器：

- [PCL2 免费正式版](https://afdian.net/a/LTCat?tab=feed)
  - [付费快照版](https://afdian.net/a/LTCat)
- [HMCL](https://hmcl.huangyuhui.net/download/)

我们只着重于较为流行的 OptiFine 和 Iris。

### 检查驱动程序

参考 [这篇文章](troubleshootCommon.md#查询电脑显卡 "通用问题 - 查询电脑显卡") 检查显卡以及是否安装显卡驱动程序。

## 安装游戏

## 安装光影模组

<tabs group="A">
    <tab title="OptiFine" group-key="of">
        <tabs group="B">
            <tab title="纯净版" group-key="pure">
            推荐。性能最好，没有加载器干扰，不会出现模组兼容性问题。
                <tabs>
                    <tab title="嵌入式安装">
                         <tabs group="launcher">
                            <tab title="HMCL" group-key="hmcl"></tab>
                            <tab title="PCL 2" group-key="pcl"></tab>
                         </tabs>

> 你也可以像手动安装一样，将从官网下载的安装包拖入启动器来执行嵌入式安装。
>
{style="note"}

</tab>
                            <tab title="手动安装"></tab>
                </tabs>
            </tab>
        <tab title="和 Forge 一同安装" group-key="forge">

仅当你需要运行**与 OptiFine 兼容**的 Forge 模组时才这样做。

<tabs>
                <tab title="两者都嵌入式安装">

> JE 1.20.4 以上只能将 OptiFine 以模组形式从 Forge 加载，不可以使用启动器一起嵌入式安装。
> 
> 如果你试图在上述版本中安装 OptiFine，请切换至 [将 OptiFine 作为模组安装](#ofAsMOD "跳转链接有时候不能切换选项卡，需要你手动点击。") 或手动安装。
>
{style="warning"}

<tabs group="launcher">
                        <tab title="HMCL" group-key="hmcl"></tab>
                        <tab title="PCL 2" group-key="pcl"></tab>
                    </tabs>
                </tab>
                <tab title="嵌入式安装 Forge，将 OptiFine 作为模组加载" id="ofAsMOD">
                    <tabs group="launcher">
                        <tab title="HMCL" group-key="hmcl"></tab>
                        <tab title="PCL 2" group-key="pcl"></tab>
                    </tabs>

> 注意 OptiFine 更新日志中所能兼容的 Forge 版本。
> 
{style="note"}

</tab>
                <tab title="手动安装">

> 注意 OptiFine 更新日志中所能兼容的 Forge 版本。
>
{style="note"}

</tab>
            </tabs>
        </tab>
        <tab title="和 Fabric 一同安装" group-key="ofAsFabricMOD">
            <format color="Red">不推荐！</format>仅当你需要运行<b>与 OptiFabric 兼容</b>的 Fabric 模组时才这样做。
            <tabs>
                <tab title="嵌入式安装 Fabric">
                    <tabs group="launcher">
                        <tab title="HMCL" group-key="hmcl"></tab>
                        <tab title="PCL 2" group-key="pcl"></tab>
                    </tabs>
                </tab>
                <tab title="手动安装"></tab>
            </tabs>
        </tab>
        </tabs>
    </tab>
    <tab title="Iris" group-key="iris">
        <format color="Red">不推荐！</format>仅当你需要 <b>Iris 独占特性</b>时使用。
    </tab>
</tabs>

## 配置游戏

<tabs group="A">
  <tab title="OptiFine" group-key="of">
    <tabs group="B">
      <tab title="纯净版" group-key="pure" id="pure"></tab>
      <tab title="Forge 版" group-key="forge"></tab>
      <tab title="Fabric 版" group-key="ofAsFabricMOD">

同 [纯净版](#pure)

</tab>
    </tabs>
  </tab>
  <tab title="Iris" group-key="iris"></tab>
</tabs>

> 以下是旧文档
> 
{style="warning"}

## 关于 OptiFine / Iris 如何搭配 Forge / Fabric

很多人不清楚如何搭配 ，因此我们在这里简单叙述如何选择：

- OptiFine 的优点在于 **一个模组解决所有功能** ，方便新手入门。该模组适合在两种情况下使用：
  - 低版本 MC （1.7.10 - 1.16.5）；
  - 玩法 **以原版为主体** 的高版本 MC （1.17 - 最新版）。

- Iris 的功能单一，需要搭配很多模组才能复现前者的大部分功能。适合 *愿意花时间* 的新手在遇到以下需求时使用：
  - 游戏里添加有 **声明不支持 OptiFine** 或 **明显运行有冲突** 的模组；
  - 需要加载 **Iris独占光影（如 Shrimple ）** ；
  - 在最新的 **MC快照版** ，OptiFine 尚未推出对应版本时（但也无法通过启动器直接下载。此类玩家需前往 Iris 的 Discord 服务器自行下载快照版对应的文件）

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

- **添加 *OptiFabric* 模组。** *Fabric* 与 *OptiFine* 的兼容由 *OptiFabric* 模组负责，绕过该模组直接添加或尝试用 Forge 的安装方式安装皆不可行。唯一的解决方案是将 *OptiFine* 与 *OptiFabric* **一起放入** `mods` 文件夹，再由 Fabric 加载。
- 如果添加了 *OptiFabric* ，但 **仍然无法启动游戏或游戏未读取高清修复** ，一般是因为 *OptiFabric* 更新较慢的缘故。此时需要等待作者发布更新或换为 `更旧版本` 的 *OptiFine* 。
- 如果游戏正常进入，但 **主界面的中文变成了方块** ，请尝试以下两种操作：
  - 移除游戏根目录下的 `.optifine` 文件夹；
  - 更换 *Fabric API* 不同的版本。

## OptiFine 如何搭配 Sodium / Iris 等模组

功能冲突，无法搭配，只能够选择前者或后者。

## OptiFine 无法与其他模组兼容

- 国外光影社区 shaderLABS 整理了一份`不兼容的模组名单`，并逐一写明了如何使它们与 OptiFine 光影兼容。我们将这些内容汉化并搬运到了 **MGC 答疑手册 - Java版着色器(Shader)**，并额外添加了一些后续发现的模组。内容如下：

- [MGC 答疑手册 - Java版着色器(Shader)](../../../../Writerside/topics/Library/TroubleShoot/JE/Mods-Compatibility)

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

- [MGC 光影包基础问答](../../../Library/QAs/je-shaderpack)

### 光影包进阶问答

记录如 `光影包安装错误`、`视频设置错误`、`模组兼容冲突` 等进阶问题的解决办法。

- [MGC 光影包进阶问答](../../../library/troubleshoot/je/shaders.md)

---

## 知识科普

### 光影包基础概念

介绍了 `主要渲染模组引擎`、`基岩版的渲染引擎` 。

- [MGC 大众科普 - 着色器基础概念](../../../../Writerside/topics/Library/shaderBasic)

### 光影包进阶概念

介绍了 `光线追踪在 MC 中的应用`、`全局光照简介` 。

- [MGC 大众科普 - 着色器技术科普](../../../../Writerside/topics/Library/shaderTech)

### 光线追踪误区纠正

记录如 `伪光追`、`贴图光追` 等错误概念。

- [MGC 歧义观点 - 光线追踪](../../../../Writerside/topics/Library/Correction/raytracingCorrection)
