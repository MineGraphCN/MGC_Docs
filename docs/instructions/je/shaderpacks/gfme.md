# SEUS PTGI GFME

全称：Sonic Ether's Unbelievable Shader Path Tracing Global Illumination GeForceLegend's Modified Edition，SEUS PTGI 深度魔改版本

## 安装

### 由于 PTGI 的最终用户许可协议（EULA）的限制，直接分发 PTGI 的代码是非法的，因此您需要按照以下步骤提取 SEUS PTGI GFME：

1. 从发布页面下载 jar 文件，并从[ Cody 的 Patreon 页面](https://www.patreon.com/sonicether/posts) 下载一个未经编辑的基于 GFME 的 PTGI 版本（目前为 HRR 2.1），如果您没有的话。
2. 将 jar 文件和 PTGI HRR 2.1 文件放在同一路径下，然后双击 jar 文件。如果一切正常，将会生成一个新的文件夹（旧版本的 GFME）或一个 zip 文件（更新的 GFME 版本），可以通过将此文件或文件夹移动到 .minecraft/shaderpacks 目录中直接使用作为着色器包。

如果双击 jar 文件后没有任何反应，您可以在 CMD 或 Powershell 中通过 `java -jar "<您的 GFME jar 路径>"` 运行此 jar 文件以获取更多信息。

![gfme-1.png](/images/instructions/gfme-1.png)

![gfme-2.png](/images/instructions/gfme-2.png)

## 特性

### 逐像素渲染在光线追踪中，包括剪影、透明度甚至 PBR 支持

![Per_pixel_rendering.png](/images/instructions/gfme_Per_pixel_rendering.png)

### 更多色彩的原版光源和方块形状

![More_vanilla_support.png](/images/instructions/gfme_More_vanilla_support.png)

### 自动检测纹理分辨率，支持不完整的纹理包

![Auto_resolution.png](/images/instructions/gfme_Auto_resolution.png)

### 金属阳光焦散

![Metal_caustics.png](/images/instructions/gfme_Metal_caustics.png)

### 许多针对原版 PTGI 的小修复和改进...

## 兼容最新的 [Iris 测试版](https://github.com/IrisShaders/Iris)