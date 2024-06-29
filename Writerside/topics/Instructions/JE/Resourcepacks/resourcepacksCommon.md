# 资源包安装通用教程

<tldr>

将资源包放入 `resourcepacks` 文件夹。
</tldr>

> 这篇文档在最近进行过订正，可以放心阅读。
>
{style="note" title="已订正的文档"}

## 准备工作

使用资源包之前你需要先进行以下准备

- 如果你所使用的资源包支持 OptiFine 特性，那么你需要确保你已经 [正确安装 OptiFine](shaderpacksCommon.md){summary=""} 。  
  - 如果你使用 Iris 进行游玩，你可以查看 [这篇文档](irisAsOf.md "Iris 等效 OptiFine 功能的模组") 来安装支持对应特性的模组。
- 如果你所使用的资源包支持 [法线纹理](resourcepackBasic.md#法线纹理){summary=""} 和 [反射纹理](resourcepackBasic.md#反射纹理){summary=""} ，那么你需要使用一个支持法线和 [PBR](terms.md#pbr){summary=""} 着色的光影。
- 如果你所使用的资源包有模组扩展，你需要正确安装 Forge 或 Fabric 。

> 如果你不知道如何安装游戏，请前往 [光影包安装通用教程](shaderpacksCommon.md){summary=""} 。

## 检查资源包 {id="check"}

检查你的资源包是否符合下列要求：
- 打开压缩包或文件夹后应该**至少有名为 `assets` 的文件夹和 `pack.mcmeta` 的文件**，同时大多数资源包还有 `pack.png` 的封面。
  <include from="contentsLibrary.md" element-id="resourcepack_structure_simple"/>
  <include from="contentsLibrary.md" element-id="recommend_unzipApp"/>
- 确保不是 Canvas 光影包，否则你应当安装 Canvas。

## 安装资源包

<include from="contentsLibrary.md" element-id="install_RP"/>

## 使用时的注意事项

- 确保你知晓 [所用资源包所对应的游戏版本](resourcepackBasic.md#versionComp){summary=""} ，即使游戏提示 `适用于<新 | 旧>版本的Minecraft` 也可以忽略。
- 确保你正确安装了有多个分包的资源包，资源包自上而下加载，你应该将附属包置于基础包上部。
  ![资源包排序](pack_order.png "资源包排序"){width="500"}
- 一些资源包可能不支持从压缩包状态加载，你需要解压缩它们，同时也要注意 [先前提到的问题](#check "检查资源包") 。

<seealso>
    <category ref="related">
        <a href="shaderpacksCommon.md" summary="光影包安装教程，其中包含了 OptiFine、Iris、Forge 和 Fabric 的安装教程。"/>
    </category>
    <category ref="advance">
        <a href="resourcepackBasic.md" summary="资源包中你需要知道的一些基本知识。"/>
    </category>
</seealso>
