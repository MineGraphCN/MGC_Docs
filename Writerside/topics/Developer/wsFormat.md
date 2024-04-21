# Writerside 写作格式参考

> 更多语法请查阅 [官方文档](https://www.jetbrains.com/help/writerside/markup-reference.html) 。
> 
{style="note"}

<!--Writerside adds this topic when you create a new documentation project.
You can use it as a sandbox to play with Writerside features, and remove it from the TOC when you don't need it anymore.-->

## 常用格式速查

> 快捷键以 [JetBrains Writerside IDE](https://www.jetbrains.com/zh-cn/writerside/download/#section=windows) 为准。

### 标题
```markdown
# 文档标题
## 二级标题
...
##### 五级标题
```

索引深度
```xml
<show-structure depth="正整数"/>
```
> 这条代码决定了文档索引（竖屏左侧顶部，横屏右侧）显示的最大标题级别。

环绕插入 `<xml>代码</xml>` <shortcut>框选内容</shortcut>, <shortcut>Ctrl</shortcut><shortcut>Alt</shortcut><shortcut>T</shortcut>, <shortcut>T</shortcut>

> 如果是设置类代码，可以使用 `<代码/>` 立即直接终止。

_斜体_ <shortcut>Ctrl</shortcut><shortcut>I</shortcut>
```markdown
<*文字* | _文字_>
```

**粗体** <shortcut>Ctrl</shortcut><shortcut>B</shortcut>
```markdown
<**文字** | __文字__>
```

***粗斜体***
```markdown
<**_文字_** | ***文字*** | __*文字*__>
```
> Writerside IDE 从内向外，先检测斜体，如果使用类似 `_**文字**_` 格式，无法使用快捷键取消斜体。

~~删除线~~ <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>S</shortcut>
```markdown
~~文字~~
```

`行内代码块` <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>C</shortcut>
```markdown
`文字`
```

[链接](https://b23.tv/BV1GJ411x7h7)
```markdown
[文字](<站内文档.md#章节 | 外部链接>)
<外部链接>  <- 使用尖括号括起来即可
```

<sup>角标</sup>

```xml
<sup>文字</sup>
```

<shortcut>按键</shortcut>

```xml
<shortcut>文字</shortcut>
```

术语
:
    ```markdown
    标题
    : 内容
    ```

```markdown
    代码块
    ```编程语言
    内容
    ```
```

> 注释／提示／警告
> ```markdown
> > 内容
> >             <- 留白一行
> {style="<tip(默认，不需要留白和此属性框) | note | warning>"}
> ```

- 无序步骤
```markdown
- 步骤1
- 步骤2
    - 子步骤1
- 步骤3
```
> 可以使用 `+` `-` `*` 。

1. 有序步骤
```markdown
1. 步骤1
2. 步骤2
```
> 可以和无序步骤混用

<procedure>
<title>步骤块</title>

```xml
<procedure type="<steps(有序，默认) | choices(无序)>">
    <title>标题（可选）</title>
    <step>步骤1</step>
    <step>步骤2</step>
</procedure>
```
</procedure>

新起

段落
```markdown
段落1

段落2
```

不新起段落  
换行
```markdown
行1  <-两个空格
行2
```
{show-white-spaces="true"}

| 表 |
|---|
| 格 |
```markdown
| 表头1 | 表头2 | ... |
|:----|:----:|-----:|   <- 对齐行
| 内容1 | 内容2 | ... |
| 内容3 | 内容4 | ... |
```
> |:-| 表示左对齐，|:-:| 表示居中对齐，|-:| 表示右对齐，|-| 表示默认对齐。

<tooltip term="缩写">缩写</tooltip>

```xml
<tooltip term="缩写">文本</tooltip>
```
> 你可以在 `Writerside/cfg/glossary.xml` 中查询和添加。

## Add new topics
You can create empty topics, or choose a template for different types of content that contains some boilerplate structure to help you get started:

![Create new topic options](new_topic_options.png){ width=290 }{border-effect=line}

## Write content
%product% supports two types of markup: Markdown and XML.
When you create a new help article, you can choose between two topic types, but this doesn't mean you have to stick to a single format.
You can author content in Markdown and extend it with semantic attributes or inject entire XML elements.

## Inject XML
For example, this is how you inject a procedure:

<procedure title="Inject a procedure" id="inject-a-procedure">
    <step>
        <p>Start typing and select a procedure type from the completion suggestions:</p>
        <img src="completion_procedure.png" alt="completion suggestions for procedure" border-effect="line"/>
    </step>
    <step>
        <p>Press <shortcut>Tab</shortcut> or <shortcut>Enter</shortcut> to insert the markup.</p>
    </step>
</procedure>

## Add interactive elements

### Tabs
To add switchable content, you can make use of tabs (inject them by starting to type `tab` on a new line):

<tabs>
    <tab title="Markdown">
        <code-block lang="plain text">![Alt Text](new_topic_options.png){ width=450 }</code-block>
    </tab>
    <tab title="Semantic markup">
        <code-block lang="xml">
            <![CDATA[<img src="new_topic_options.png" alt="Alt text" width="450px"/>]]></code-block>
    </tab>
</tabs>

### Collapsible blocks
Apart from injecting entire XML elements, you can use attributes to configure the behavior of certain elements.
For example, you can collapse a chapter that contains non-essential information:

#### Supplementary info {collapsible="true"}
Content under a collapsible header will be collapsed by default,
but you can modify the behavior by adding the following attribute:
`default-state="expanded"`

### Convert selection to XML
If you need to extend an element with more functions, you can convert selected content from Markdown to semantic markup.
For example, if you want to merge cells in a table, it's much easier to convert it to XML than do this in Markdown.
Position the caret anywhere in the table and press <shortcut>Alt+Enter</shortcut>:

<img src="convert_table_to_xml.png" alt="Convert table to XML" width="706" border-effect="line"/>

## Feedback and support
Please report any issues, usability improvements, or feature requests to our
<a href="https://youtrack.jetbrains.com/newIssue?project=WRS">YouTrack project</a>
(you will need to register).

You are welcome to join our
<a href="https://jb.gg/WRS_Slack">public Slack workspace</a>.
Before you do, please read our [Code of conduct](https://plugins.jetbrains.com/plugin/20158-writerside/docs/writerside-code-of-conduct.html).
We assume that you’ve read and acknowledged it before joining.

You can also always email us at [writerside@jetbrains.com](mailto:writerside@jetbrains.com).
