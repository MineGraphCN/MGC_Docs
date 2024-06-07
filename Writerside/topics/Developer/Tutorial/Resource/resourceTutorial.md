# 资源包开发教程

<var name="topic" value="资源包编写的实际教程"/>
<var name="goal" value="仅想对资源包有大致的了解"/>
<var name="target_name" value=""/>
<var name="target_topic" value="resourcepackBasic.md"/>
<var name="target_description" value=""/>
<include from="contentsLibrary.md" element-id="h_note_readingTips"/>

> 本教程由 [FishBai](https://github.com/yubaibaifish) 独立编写，MGC 提供支持。
> 
> 是 **JAVA 版教程**
> 
{style="note"}

资源包，也就是玩家口中的材质包。不过为什么正确的名称叫做资源包呢？

大家都知道，资源包可以实现许多功能，最基础的是修改原版贴图，添加高光和法线贴图。但资源包还可以修改原版模型等更多效果，就像是一个资源库一样等待游戏调用，所以我们称之为资源包。

> 材质包是错误译名！此处仅作通俗！

_那么资源包应该如何制作呢？_

## 框架搭建

在资源包的世界中，所谓的“框架搭建”不过是创建文件夹，以便让你的资源被游戏正确识别。

首先我们需要新建一个空文件夹，然后在文件夹内准备一些东西：

`pack.png`
: 这一张图片是你的资源包显示的“名片”。
![图片](1-1.jpg)
*由本文作者创作的 VOXT PBR 纹理包*<br/>
显示在最左边的就是 `pack.png` 图片，这一张图片通常为 64x，128x，256x 等。

`pack.mcmeta`
: 该文件本质上是一个 json 文件，可以直接使用记事本、VSCode 等软件编辑。

    他的内容一般是：
    
    <include from="contentsLibrary.md" element-id="pack.format"/>
    <br/>

    其中 `pack_format` 所对应的是所支持的版本。
    
    <include from="contentsLibrary.md" element-id="resourcepack_versions"/>
    <br/>

    我们一般使用的是 15，该数据并不会影响资源包的加载。

`assets` 文件夹
: 这是用于储存资源包内容的文件夹，你的所有文件几乎都在这里面。

    `minecraft` 文件夹
    : 该文件夹位于 `.minecraft/assets` 内，其名字实际上是命名空间 ID，原版的命名空间就叫 `minecraft:` ，后面会讲到该层的其他用法。

### 纹理

在 `.minecraft/assets/minecraft` 文件夹内就会储存纹理文件，存于该部分的文件可以在原版包内找到相同路径，解压后放进该文件夹即可。

至此，你拥有了一个完整的资源包文件，不过你并没有对他进行任何改动，所以你看到的都是原版的样子。

你的文件夹内结构，应该是这个样子：

<include from="contentsLibrary.md" element-id="resourcepack_structure_dev"/>

在下一章中，我们将会形象化你的创作思路，并且使用工具来制作你的第一张纹理贴图。
