# 资源包安装通用教程

<tldr>

**省流**

将资源包放入 `resourcepacks` 文件夹。
</tldr>

> 这篇文档在最近进行过订正，可以放心阅读。
>
{style="note" title="已订正的文档"}

## 准备工作

使用资源包之前你需要先进行以下准备

- 如果你所使用的资源包支持 OptiFine 特性，那么你需要确保你已经 [正确安装 OptiFine](shaderpacksCommon.md "光影包安装通用教程 - 安装光影模组") 。  
  - 如果你使用 Iris 进行游玩，你可以查看 [这篇文档](irisAsOf.md "Iris 等效 OptiFine 功能的模组") 来安装支持对应特性的模组。
- 如果你所使用的资源包支持 [法线纹理](resourcepackBasic.md#法线纹理  "资源包 基本概念 - 法线纹理") 和 [反射纹理](resourcepackBasic.md#反射纹理 "资源包 基本概念 - 反射纹理") ，那么你需要使用一个支持法线和 [PBR](terms.md#pbr "术语表 - PBR") 着色的光影。
- 如果你所使用的资源包有模组扩展，你需要正确安装 Forge 或 Fabric 。

> 如果你不知道如何安装游戏，请前往 [光影包安装通用教程](shaderpacksCommon.md "这篇文档帮助新人从安装游戏开始，直到最终成功运行光影为止。") 。

## 检查资源包 {id="check"}

检查你的资源包是否符合下列要求：
- 打开压缩包或文件夹后应该**至少有名为 `assets` 的文件夹和 `pack.mcmeta` 的文件**，同时大多数资源包还有 `pack.png` 的封面。
  ```Shell
  └─ <资源包名称 | 资源包名称.zip> # 仅支持未加密的 .zip 压缩包
    ├─ assets # 重要！
    │ └─ <资源包相关文件和文件夹>
    ├─ pack.mcmeta # 重要！资源包版本号和描述
    └─ pack.png # 资源包封面
  ```
  > 如果你没有解压缩软件，我们推荐 [7-zip](https://sparanoid.com/lab/7z/) 。
- 确保不是 Canvas 光影包，否则你应当安装 Canvas。

## 安装资源包

<tabs>
<tab title="拖拽安装">

> 适用于 **JE 1.16+**
> 
{style="note"}

<procedure>
<step>

点击 `选项` > `资源包`
</step>
<step>

将包直接拖入该页面。
</step>
<step>

将 `可用` 资源包置于 `已选` 。
</step>
<step>

**点击完成**，在老版本中使用 <shortcut>Esc</shortcut> 返回上一页可能导致直接取消资源包更改。
</step>

![拖拽安装](install_by_drag.gif "拖拽安装")
</procedure>
</tab>
<tab title="导入文件夹">
<procedure>
<step>

点击 `选项` > `资源包` > `打开包文件夹`
</step>
<step>

将包拖入该文件夹。
> 在老版本中，拖入文件夹之后可能需要重新进入资源包页面才会显示。
> 
{style="note"}
> 你可以通过按住 <shortcut>Ctrl</shortcut> 拖拽来复制文件，而不是移动文件。
</step>
<step>

将 `可用` 资源包置于 `已选` 。
</step>
<step>

**点击完成**，在老版本中使用 <shortcut>Esc</shortcut> 返回上一页可能导致直接取消资源包更改。
</step>

![导入文件夹](install_by_folder.gif "导入文件夹")
</procedure>
</tab>
</tabs>

## 使用时的注意事项

- 确保你知晓 [所用资源包所对应的游戏版本](resourcepackBasic.md#versionComp "资源包 基本概念 - 资源包的版本兼容性") ，即使游戏提示 `适用于<新 | 旧>版本的Minecraft` 也可以忽略。
- 确保你正确安装了有多个分包的资源包，资源包自上而下加载，你应该将附属包置于基础包上部。
  ![资源包排序](pack_order.png "资源包排序")
- 一些资源包可能不支持从压缩包状态加载，你需要解压缩它们，同时也要注意 [先前提到的问题](#check "检查资源包") 。

<seealso>
    <category ref="related">
        <a href="shaderpacksCommon.md" summary="光影包安装教程，其中包含了 OptiFine、Iris、Forge 和 Fabric 的安装教程。"/>
    </category>
    <category ref="advance">
        <a href="resourcepackBasic.md" summary="资源包中你需要知道的一些基本知识。"/>
    </category>
</seealso>
