# Writerside 写作参考

> 更多语法和功能请查阅 [官方文档](https://www.jetbrains.com/help/writerside/markup-reference.html) 。
> 
{style="note"}

## 常用格式速查

> 快捷键以 [JetBrains Writerside IDE](https://www.jetbrains.com/zh-cn/writerside/download/#section=windows) 为准。

<tldr>
<p><b>省流块</b></p>
<p>省流块永远在章节顶部。</p>

```xml
<tldr>
内容
</tldr>
```
</tldr>

========================

### 标题
```markdown
# 文档标题
## 二级标题
...
##### 五级标题
```

========================

索引深度
```xml
<show-structure depth="正整数"/>
```
> 这是一条设置代码，决定了文档索引（竖屏左侧顶部，横屏右侧）显示的最大标题级别。

========================

环绕插入行内代码 <shortcut>框选内容</shortcut>, <shortcut>Ctrl</shortcut><shortcut>Alt</shortcut><shortcut>T</shortcut>, <shortcut>T</shortcut>

```xml
<代码>内容</代码>
```

环绕插入代码块 <shortcut>框选内容</shortcut>, <shortcut>Ctrl</shortcut><shortcut>Alt</shortcut><shortcut>T</shortcut>, <shortcut>B</shortcut>

```xml
<代码>
内容块
</代码>
```

> 如果不包含具体内容，可以使用 `<代码/>` 。
> 快捷键仅 xml 格式行有效，无法在 markdown 行中使用。

========================

_斜体_ <shortcut>Ctrl</shortcut><shortcut>I</shortcut>
```markdown
< *文字* | _文字_ >
```

========================

**粗体** <shortcut>Ctrl</shortcut><shortcut>B</shortcut>
```markdown
< **文字** | __文字__ >
```

========================

***粗斜体***
```markdown
< **_文字_** | ***文字*** | __*文字*__ | ... >
```
> Writerside IDE 快捷键从内向外检测，如果使用类似 `_**文字**_` 格式，无法使用快捷键优先取消斜体，反之无法优先取消粗体。

========================

~~删除线~~ <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>S</shortcut>
```markdown
~~文字~~
```

========================

`行内代码块` <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>C</shortcut>
```markdown
`文字`
```

========================

[链接](https://b23.tv/BV1GJ411x7h7) <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>U</shortcut>
```markdown
[文字](< 站内文档.md#章节 | 外部链接 >)
<外部链接>  <- 使用尖括号括起来即可
```

========================

<sup>角标</sup>

```xml
<sup>文字</sup>
```

========================

<shortcut>按键</shortcut>

```xml
<shortcut>文字</shortcut>
```

========================

术语
:
    ```markdown
    标题
    : 内容
    ```

========================

```markdown
    代码块
    ```编程语言
    内容
    ```
```

========================

> 注释／提示／警告
> ```markdown
> > 内容
> >             <- 留白一行
> {style="< tip(默认，不需要留白和此属性框) | note | warning >"}
> ```

========================

<tooltip term="缩写">缩写</tooltip>

```xml
<tooltip term="缩写">文本</tooltip>
```
> 你可以在 `Writerside/cfg/glossary.xml` 中查询和添加。

========================

- 无序步骤
```markdown
- 步骤1
- 步骤2
    - 子步骤1
- 步骤3
```
> 可以使用 `+` `-` `*` 。

========================

1. 有序步骤
```markdown
1. 步骤1
2. 步骤2
    1. 子步骤1
3. 步骤3
```
> 可以和无序步骤混用

========================

<procedure>
<title>步骤块</title>

```xml
<procedure type="< steps(有序，默认) | choices(无序) >">
    <title>标题（可选）</title>
    <step>步骤1</step>
    <step>步骤2</step>
</procedure>
```
</procedure>

========================

新起

段落
```markdown
段落1

段落2
```

========================

不新起段落  
仅换行
```markdown
行1  <-两个空格
行2
```

========================

| 表 |
|---|
| 格 |
```markdown
| 表头1 | 表头2 | ... |
|:----|:----:|-----:|   <- 对齐行
| 内容1 | 内容2 | ... |
| 内容3 | 内容4 | ... |
```
> `|:-|` 表示左对齐，`|:-:|` 表示居中对齐，`|-:|` 表示右对齐，`|-|` 表示默认对齐。
> 
> Writerside 的对齐模式暂时有问题。

=======

<tabs>
<tab title="并排选项卡">

```xml
<tabs>
    <tab title="选项卡1标题">
        内容
    </tab>
    <tab title="选项卡2标题">
        内容
    </tab>
</tabs>
```

使用 `group` 和 `group-key` 同步切换标签页，当 `group` 和 `group-key` 值相同时，选项卡将会同步切换：

```xml
    <tabs group="A">
        <tab title="选项卡1标题" group-key="a">
            内容A
        </tab>
        <tab title="选项卡2标题" group-key="b">
            内容B
        </tab>
    </tabs>
    
    <tabs group="A">
        <tab title="选项卡1标题A" group-key="a">
            内容C
        </tab>
        <tab title="选项卡2标题B" group-key="b">
            内容D
        </tab>
    </tabs>
```

渲染结果：

<tabs group="A">
    <tab title="选项卡1标题" group-key="a">
        内容A
    </tab>
    <tab title="选项卡2标题" group-key="b">
        内容B
    </tab>
</tabs>

<tabs group="A">
    <tab title="选项卡1标题A" group-key="a">
        内容C
    </tab>
    <tab title="选项卡2标题B" group-key="b">
        内容D
    </tab>
</tabs>

</tab>
</tabs>

### 可折叠块 {collapsible="true" default-state="expanded"}

```markdown
    ## 章节 {collapsible="true" default-state="< collapsed(默认) | expanded >"}

    =======

    ```
    代码块
    ```
    {collapsible="true" default-state="< collapsed(默认) | expanded >"}

    =======

    <procedure collapsible="true" default-state="< collapsed(默认) | expanded >">
    步骤块
    </procedure>
```

## xml 代码注意事项

如果你使用了 xml 代码，你需要空一行才能继续 markdown 格式。
```markdown
<procedure>
<p>这段话**不能**正常使用 `markdown 格式` 。</p>
</procedure>

<procedure>

这段话**可以**正常使用 `markdown 格式` 。
</procedure>
```

渲染结果：
<procedure>
<p>这段话**不能**正常使用 `markdown 格式` 。</p>
</procedure>

<procedure>

这段话**可以**正常使用 `markdown 格式` 。
</procedure>

## 快捷键

文件内定位章节 <shortcut>Ctrl</shortcut><shortcut>F12</shortcut>  
重命名文件 <shortcut>Shift</shortcut><shortcut>F6</shortcut>  
文件内搜索 <shortcut>Ctrl</shortcut><shortcut>F</shortcut>  
全局搜索 <shortcut>Shift</shortcut>, <shortcut>Shift</shortcut>

## 添加新文件

1. 在 `Writerside` 侧栏的正确目录下创建 Topic

    ![create_topic_on_correct_directory](create_topic_on_correct_directory.png)

2. 在 `项目` 侧栏将你的文档文件移入对应的文件夹

    ![move_file_to_correct_folder](move_file_to_correct_folder.png)

> 文件名应当使用**驼峰命名法**。
