# 复用元素库
{is-library=true}

<snippet id="shaderpack_structure_dev">

```Shell
└─ shaderpacks
   └─ <光影名称 | 光影名称.zip>
      └─ shaders
         ├─ lang
         │  └─ <语言文件>
         ├─ world-1
         │  └─ <下界着色器程序>
         ├─ world0
         │  └─ <主世界着色器程序>
         ├─ world1
         │  └─ <末地着色器程序>
         ├─ world<ID>
         │  └─ <其他世界着色器程序>
         ├─ <通用着色器程序>
         ├─ block.properties
         ├─ entities.properties
         ├─ item.properties
         └─ shaders.properties
```

</snippet>


<snippet id="shaderpack_structure_simple">

```Shell
└─ shaderpacks
   └─ <光影名称 | 光影名称.zip> # 仅支持未加密的 .zip 压缩包
      └─ shaders # 重要！
         └─ <着色器程序相关文件和文件夹>
```

</snippet>


<snippet id="shaderpack_options">

```Shell
└─ shaderpacks
   ├─ aWOWshaderA            # 文件夹光影
   ├─ aWOWshaderA.txt        # 光影对应的配置文件
   ├─ aFancyshaderB.zip      # 压缩包光影
   └─ aFancyshaderB.zip.txt  # 保留 .zip 后缀的 .txt 文本文件
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
      │  │  │  │  └─ <方块纹理文件>
      │  │  │  ├─ item
      │  │  │  │  └─ <物品纹理文件>
      │  │  │  ├─ models
      │  │  │  │  └─ <盔甲纹理文件>
      │  │  │  └─ ...
      │  │  │     └─ <其他纹理文件>
      │  │  └─ <其他自定义资源>
      │  └─ <其他模组对应的文件夹>
      ├─ pack.mcmeta
      └─ pack.png
```

</snippet>


<snippet id="resourcepack_structure_simple">

```Shell
└─ resourcepacks
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
<tr><td>17</td><td>1.20.2 23w32a</td><td>1.20.2-pre1</td></tr>
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
<tr><td>34</td><td>1.21 24w21a</td><td>1.21.1</td></tr>
<tr><td>35</td><td colspan="2">1.21.2 24w33a</td></tr>
<tr><td>36</td><td>1.21.2 24w34a</td><td>1.21.2 24w35a</td></tr>
<tr><td>37</td><td colspan="2">1.21.2 24w36a</td></tr>
<tr><td>38</td><td colspan="2">1.21.2 24w37a</td></tr>
<tr><td>39</td><td>1.21.2 24w38a</td><td>1.21.2 24w39a</td></tr>
<tr><td>40</td><td colspan="2">1.21.2 24w40a</td></tr>
<tr><td>41</td><td>1.21.2-pre1</td><td>1.21.2-pre2</td></tr>
<tr><td>42</td><td>1.21.2-pre3</td><td>1.21.3</td></tr>
<tr><td>43</td><td colspan="2">1.21.4 24w44a</td></tr>
<tr><td>44</td><td colspan="2">1.21.4 24w45a</td></tr>
<tr><td>45</td><td colspan="2">1.21.4 24w46a</td></tr>
<tr><td>46</td><td>1.21.4-pre1</td><td>1.21.4</td></tr>
<tr><td>47</td><td colspan="2">1.21.5 25w02a</td></tr>
<tr><td>48</td><td colspan="2">1.21.5 25w03a</td></tr>
<tr><td>49</td><td colspan="2">1.21.5 25w04a</td></tr>
<tr><td>50</td><td colspan="2">1.21.5 25w05a</td></tr>
<tr><td>51</td><td colspan="2">1.21.5 25w06a</td></tr>
<tr><td>52</td><td colspan="2">1.21.5 25w07a</td></tr>
<tr><td>53</td><td>1.21.5 25w08a</td><td>1.21.5 25w09b</td></tr>
<tr><td>%latest_pack_format%</td><td>1.21.5 25w10a</td><td><i>最新</i></td></tr>
</table>

_23 和 27 不存在。_  
_截止 2025 年 3 月 10 日，数据来源于 [Minecraft Wiki](https://zh.minecraft.wiki/w/资源包#资源包格式版本) 。_

</procedure>

</snippet>

<snippet id="pack.format">

```JSON
{
    "pack": {
        "pack_format": %latest_pack_format%,
        "description": "包的描述",
        "supported_formats": {  // 可选字段，需要 23w32a 及以上
            "min_inclusive": 17,
            "max_inclusive": %latest_pack_format%
        }
    }
}
```

</snippet>



<snippet id="h_note_translated">

> 这篇文档翻译自 [%src_name%](%src_link%) ，请以原文为准！
>
{style="note"}

</snippet>


<snippet id="h_note_readingTips">

> 这是%topic%，如果%goal%，可以阅读 [%target_name%](%target_topic%){summary="%target_description%"} 。
>
{style="note" title="阅读建议"}

[//]: # (%target_name% 和 %target_description% 可以留白，但是一定要有！)

</snippet>


<snippet id="install_RP">

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

</snippet>
