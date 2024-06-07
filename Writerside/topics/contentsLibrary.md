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
      │  ├─ minecraft
      │  │  ├─ textures
      │  │  │  ├─ block
      │  │  │  │   └─ <方块纹理文件>
      │  │  │  ├─ item
      │  │  │  │   └─ <物品纹理文件>
      │  │  │  ├─ models
      │  │  │  │   └─ <盔甲纹理文件>
      │  │  │  └─ ...
      │  │  │      └─ <其他纹理文件>
      │  │  └─ <其他自定义资源>
      │  └─ <其他模组对应的文件夹>
      ├─ pack.mcmeta
      └─ pack.png
```

</snippet>


<snippet id="resourcepack_structure_simple">

```Shell
└─ <资源包名称 | 资源包名称.zip> # 仅支持未加密的 .zip 压缩包
    ├─ assets # 重要！
    │   └─ <资源包相关文件和文件夹>
    ├─ pack.mcmeta # 重要！资源包版本号和描述
    └─ pack.png # 资源包封面
```

</snippet>



<snippet id="recommend_unzipApp">

> 如果你没有解压缩软件，我们推荐 [7-Zip](https://sparanoid.com/lab/7z/) ，  
> 以及它的现代化分支版本 NanaZip ([微软商店](https://www.microsoft.com/store/apps/9N8G7TSCL18R)) ([GitHub](https://github.com/M2Team/NanaZip/releases/latest)) 。

</snippet>



<snippet id="resourcepack_versions_simple">

|                兼容范围                 | 备注       |
|:-----------------------------------:|----------|
| **Alpha v1.2.2** ~ **1.6.1 13w23a** | 纹理包      |
|    **1.6.1 13w24a** ~ **1.6.4**     | 资源包（单选）  |
| **1.7.2 13w36a** ~ **1.13 17w46a**  | 资源包      |
|         **1.13 17w47a** 至今          | 扁平化后的资源包 |

</snippet>

<snippet id="resourcepack_versions">

<procedure collapsible="true" title="兼容性表格">

<table>
<tr><td><code>pack_format</code> 值</td><td>起始版本</td><td>终止版本</td></tr>
<tr><td>1</td><td>1.6.1 13w24a</td><td>1.8.9</td></tr>
<tr><td>2</td><td>1.9 15w31a</td><td>1.10.2</td></tr>
<tr><td>3</td><td>1.11 16w32a</td><td>1.13 17w47b</td></tr>
<tr><td>4</td><td>1.13 17w48a</td><td>1.15 19w46b</td></tr>
<tr><td>5</td><td>1.15-pre1</td><td>1.16.2-pre3</td></tr>
<tr><td>6</td><td>1.16.2-rc1</td><td>1.16.5</td></tr>
<tr><td>7</td><td>1.17 20w45a</td><td>1.17.1 21w38a</td></tr>
<tr><td>8</td><td>1.18 21w39a</td><td>1.18.2</td></tr>
<tr><td>9</td><td>1.19 22w11a</td><td>1.19.2</td></tr>
<tr><td>11</td><td>1.19.3 22w42a</td><td>1.19.3 22w44a</td></tr>
<tr><td>12</td><td>1.19.3 22w45a</td><td>1.19.4 23w07a</td></tr>
<tr><td>13</td><td>1.19.4-pre1</td><td>1.20 23w13a</td></tr>
<tr><td>14</td><td>1.20 23w14a</td><td>1.20 23w16a</td></tr>
<tr><td>15</td><td>1.20 23w17a</td><td>1.20.1</td></tr>
<tr><td>16</td><td>1.20.2</td><td>1.20.2 23w31a</td></tr>
<tr><td>17</td><td>1.20.2 23w31a</td><td>1.20.2-pre1</td></tr>
<tr><td>18</td><td>1.20.2-pre2</td><td>1.20.3 23w41a</td></tr>
<tr><td>19</td><td colspan="2">1.20.3 23w42a</td></tr>
<tr><td>20</td><td>1.20.3 23w43a</td><td>1.20.3 23w44a</td></tr>
<tr><td>21</td><td>1.20.3 23w45a</td><td>1.20.3 23w46a</td></tr>
<tr><td>22</td><td>1.20.3-pre1</td><td>1.20.5 23w51b</td></tr>
<tr><td>24</td><td>1.20.5 24w03a</td><td>1.20.5 24w04a</td></tr>
<tr><td>25</td><td colspan="2">1.20.5 24w05a</td></tr>
<tr><td>26</td><td>1.20.5 24w06a</td><td>1.20.5 24w08a</td></tr>
<tr><td>28</td><td>1.20.5 24w09a</td><td>1.20.5 24w10a</td></tr>
<tr><td>29</td><td colspan="2">1.20.5 24w11a</td></tr>
<tr><td>30</td><td colspan="2">1.20.5 24w12a</td></tr>
<tr><td>31</td><td>1.20.5 24w13a</td><td>1.20.5-pre3</td></tr>
<tr><td>32</td><td>1.20.5-pre4</td><td>1.20.6</td></tr>
<tr><td>33</td><td>1.21 24w18a</td><td>1.21 24w20a</td></tr>
<tr><td>34</td><td>1.21 24w21a</td><td><emphasis>最新</emphasis></td></tr>
</table>

_截止 2024 年 6 月 6 日，数据来源于 [Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%95%99%E7%A8%8B/%E5%88%B6%E4%BD%9C%E8%B5%84%E6%BA%90%E5%8C%85#pack_format) 。_

</procedure>

</snippet>



<snippet id="pack.format">

```JSON
{
    "pack": {
        "pack_format": 34,
        "description": "<Your description>",
        "supported_formats": {  // 可选字段，需要 23w31a+
            "min_inclusive": 17,
            "max_inclusive": 34
        }
    }
}
```

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

