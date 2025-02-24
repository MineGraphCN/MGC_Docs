# Java 版光影安装指南

<primary-label ref="manual"/>

<secondary-label ref="latest"/>

<secondary-label ref="jeDoc"/>
<secondary-label ref="shaderDoc"/>

<show-structure depth="2"/>

<tldr>

安装 OptiFine 或 Iris，将光影放入 `shaderpacks` 文件夹。

</tldr>

[//]: # (帮助玩家安装光影，默认已经安装了游戏和加载器)

## 检查光影

检查你的光影是否符合下列要求：
- 打开压缩包或文件夹后应**有名为 `shaders` 的文件夹。**
  <include from="uniforms.md" element-id="shaderpack_structure_simple"/>
  <include from="uniforms.md" element-id="recommend_unzipApp"/>
- 确保不是原版光影或 Canvas 光影，否则你应当直接像 [安装资源包](jeInstallRP.md){summary=""} 那样安装光影。

> 如果你不知道如何安装游戏和加载器，请前往 [](jeInstallGame.md){summary=""} 。

## 安装光影

检查完成之后，将**含有 `shaders` 的文件夹或压缩包**放入 `shaderpacks` 文件夹并选中即可。
<note>
你可以从
<tabs group="loader">
<tab title="OptiFine" group-key="of">

`视频设置` > `光影` > `光影包文件夹`
</tab>
<tab title="Iris" group-key="iris">

`视频设置` > `光影包` > `打开光影包文件夹`
</tab>
</tabs>

打开 `shaderpacks` 文件夹。
</note>

## 导入配置文件

将配置文件重命名为与光影相同的名字，注意压缩包要保留 `.zip` 后缀。

例如：

- 光影包是名为 `aWOWshaderA` 的文件夹，那么光影配置文件就应该是名为 `aWOWshaderA`、后缀为 `.txt` 的文件；
- 光影包是名为 `aFancyshaderB` 的压缩包，那么光影配置文件就应该是名为 `aFancyshaderB.zip`、后缀为 `.txt` 的文件：

```Shell
└─ shaderpacks
    ├─ aWOWshaderA
    ├─ aWOWshaderA.txt
    ├─ aFancyshaderB.zip      # 压缩包文件
    └─ aFancyshaderB.zip.txt  # 保留 .zip 后缀的 .txt 文本文件
```

> 你可以在资源管理器中点击 `查看` > `显示` > `文件扩展名` 来检查后缀
> 
{style="note"}

> 在 Iris 中，你可以直接在 `光影包设置` 页面的右上角点击 `从文件导入设置` ，无需自己重命名。
> 
> ![irisImport.png](irisImport.png)

<seealso>
    <category ref="related">
        <a href="troubleshootCommon.md" summary="这篇文档记录了一些与游戏相关或会产生影响的常见问题。">疑难解答 - 通用问题</a>
        <a href="videoSettings.md" summary="这篇文档列出了整个视频设置选项卡中容易出现问题的设置以及修改建议。">疑难解答 - 视频设置和相关显示问题</a>
        <a href="shaderpackLoading.md" summary="这篇文档列出了光影加载后可能出现的问题以及解决办法。">疑难解答 - 光影加载问题</a>
    </category>
    <category ref="advance">
        <a href="irisAsOf.md">Iris 下等效 OptiFine 功能的模组</a>
        <a href="shaderBasic.md" summary="着色器的基本概念和它们与 Minecraft 的历史">着色器 基本概念和轶事</a>
    </category>
</seealso>
