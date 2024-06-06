# 复用元素库

<show-structure depth="0"/>

<snippet id="shaderpack_structure_dev">

```Shell
└─ shaderpacks
  └─ <光影名称 | 光影名称.zip>
    └─ shaders
      ├─ lang
      │   └─ <语言文件>
      ├─ world-1
      │   └─ <下界着色器程序>
      ├─ world0
      │   └─ <主世界着色器程序>
      ├─ world1
      │   └─ <末地着色器程序>
      ├─ world<ID>
      │   └─ <其他模组世界着色器程序>
      ├─ <通用着色器程序>
      ├─ block.properties
      ├─ entities.properties
      ├─ item.properties
      └─ shaders.properties
```

</snippet>


<snippet id="shaderpack_structure_simple">

```Shell
└─ <光影名称 | 光影名称.zip> # 仅支持未加密的 .zip 压缩包
  └─ shaders # 重要！
    └─ <着色器程序相关文件和文件夹>
```

</snippet>



<snippet id="resourcepack_structure_dev">

```Shell
└─ resourcepacks
  └─ <资源包名称 | 资源包名称.zip>
    ├─ assets
    │ ├─ minecraft
    │ │ ├─ textures
    │ │ │ ├─ block
    │ │ │ │   └─ <方块纹理文件>
    │ │ │ ├─ item
    │ │ │ │   └─ <物品纹理文件>
    │ │ │ ├─ models
    │ │ │ │   └─ <盔甲纹理文件>
    │ │ │ └─ ...
    │ │ │     └─ <其他纹理文件>
    │ │ └─ <其他自定义资源>
    │ └─ <其他模组对应的文件夹>
    ├─ pack.mcmeta
    └─ pack.png
```

</snippet>


<snippet id="resourcepack_structure_simple">

```Shell
└─ <资源包名称 | 资源包名称.zip> # 仅支持未加密的 .zip 压缩包
  ├─ assets # 重要！
  │ └─ <资源包相关文件和文件夹>
  ├─ pack.mcmeta # 重要！资源包版本号和描述
  └─ pack.png # 资源包封面
```

</snippet>



<snippet id="recommend_unzipApp">

> 如果你没有解压缩软件，我们推荐 [7-zip](https://sparanoid.com/lab/7z/) 。

</snippet>



<snippet id="resourcepack_versions">

| `pack_format` 值 |     起始版本      |     终止版本      |
|:---------------:|:-------------:|:-------------:|
|        1        | 1.6.1 13w24a  |     1.8.9     |
|        2        |  1.9 15w31a   |    1.10.2     |
|        3        |  1.11 16w32a  |  1.13 17w47b  |
|        4        |  1.13 17w48a  |  1.15 19w46b  |
|        5        |   1.15-pre1   |  1.16.2-pre3  |
|        6        |  1.16.2-rc1   |    1.16.5     |
|        7        |  1.17 20w45a  | 1.17.1 21w38a |
|        8        |  1.18 21w39a  |    1.18.2     |
|        9        |  1.19 22w11a  |    1.19.2     |
|       11        | 1.19.3 22w42a | 1.19.3 22w44a |
|       12        | 1.19.3 22w45a | 1.19.4 23w07a |
|       13        |  1.19.4-pre1  |  1.20 23w13a  |
|       14        |  1.20 23w14a  |  1.20 23w16a  |
|       15        |  1.20 23w17a  |    1.20.1     |
|       16        |    1.20.2     | 1.20.2 23w31a |
|       17        | 1.20.2 23w31a |  1.20.2-pre1  |
|       18        |  1.20.2-pre2  | 1.20.3 23w41a |
|       19        | 1.20.3 23w42a |   *仅存在一个版本*   |
|       20        | 1.20.3 23w43a | 1.20.3 23w44a |
|       21        | 1.20.3 23w45a | 1.20.3 23w46a |
|       22        |  1.20.3-pre1  | 1.20.5 23w51b |
|       24        | 1.20.5 24w03a | 1.20.5 24w04a |
|       25        | 1.20.5 24w05a |   *仅存在一个版本*   |
|       26        | 1.20.5 24w06a | 1.20.5 24w08a |
|       28        | 1.20.5 24w09a | 1.20.5 24w10a |
|       29        | 1.20.5 24w11a |   *仅存在一个版本*   |
|       30        | 1.20.5 24w12a |   *仅存在一个版本*   |
|       31        | 1.20.5 24w13a |  1.20.5-pre3  |
|       32        |  1.20.5-pre4  |    1.20.6     |
|       33        |  1.21 24w18a  |  1.21 24w20a  |
|       34        |  1.21 24w21a  |     _最新_      |

_截止 2024 年 6 月 6 日，数据来源于 [Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%95%99%E7%A8%8B/%E5%88%B6%E4%BD%9C%E8%B5%84%E6%BA%90%E5%8C%85#pack_format) 。_

</snippet>



<snippet id="h_note_corrected">

> 这篇文档在最近进行过订正，可以放心阅读。
>
{style="note" title="已订正"}

</snippet>


<snippet id="h_note_rewrote">

> 这篇文档在最近进行过重写。
>
{style="note" title="已重写"}

</snippet>


<snippet id="h_note_new">

> 这篇文档在最近新增过内容。
>
{style="note" title="新内容"}

</snippet>


<snippet id="h_note_newT">

> 这是最近添加的新文档。
>
{style="note" title="新文档"}

</snippet>


<snippet id="h_warning_uncorrected">

> 这篇文档迁移后未进行过订正。
>
{style="warning" title="未订正"}

</snippet>


<snippet id="h_warning_writing">

> 这篇文档正在编写队列中，可能无法流畅地阅读。
>
{style="warning" title="施工中"}

</snippet>


<snippet id="h_warning_zero">

> _常回家看看~_
>
{style="warning" title="施工中"}

</snippet>


<snippet id="h_note_translated">

> 这篇文档翻译自 [%src_name%](%src_link%) ，请以原文为准！
>
{style="note" title="译文"}

</snippet>


<snippet id="h_note_readingTips">

> 这是%topic%，如果%goal%，可以阅读 [%target_name%](%target_topic%){summary="%target_description%"} 。
>
{style="note" title="阅读建议"}

[//]: # (%target_name% 和 %target_description% 可以留白，但是一定要有！)

</snippet>

