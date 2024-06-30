# Writerside 写作参考

<show-structure depth="3"/>

> 更多语法和功能请查阅 [官方文档](https://www.jetbrains.com/help/writerside/markup-reference.html) 。
> 
> 快捷键以 [JetBrains Writerside IDE](https://www.jetbrains.com/zh-cn/writerside/download/#section=windows) 为准。
> 
> 请在 Writerside IDE 中查看渲染结果。
>
{style="note"}

## IDE 快捷键

<p>
文件内定位章节 <shortcut>Ctrl</shortcut><shortcut>F12</shortcut><br/>
重命名文件 <shortcut>Shift</shortcut><shortcut>F6</shortcut><br/>
文件内搜索 <shortcut>Ctrl</shortcut><shortcut>F</shortcut><br/>
全局搜索 <shortcut>Shift</shortcut>, <shortcut>Shift</shortcut>
</p>

## 常用格式速查

### 标题 {id="title"}

```markdown
# 文档标题
## 二级标题
...
##### 五级标题
```

### 索引深度

```xml
<show-structure depth="正整数"/>
```

> 这是一条设置符，决定了文档索引（竖屏左侧顶部，横屏右侧）显示的最大标题级别。

### xml / html 代码

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

### 字形 {id="format"}

<procedure>

_斜体_ <shortcut>Ctrl</shortcut><shortcut>I</shortcut>
```markdown
*文字*
```
或
```markdown
_文字_
```
或
```xml
<i>文字</i>
```
</procedure>

<procedure>

**粗体** <shortcut>Ctrl</shortcut><shortcut>B</shortcut>
```markdown
**文字**
```
或
```markdown
__文字__
```
或
```xml
<b>文字</b>
```
</procedure>
<procedure>

***粗斜体*** <shortcut>Ctrl</shortcut><shortcut>I</shortcut>, <shortcut>Ctrl</shortcut><shortcut>B</shortcut>
```markdown
**_文字_**
```
或
```markdown
***文字***
```
或
```markdown
__*文字*__
```
或
```xml
<b><i>文字</i></b>
```
或
```xml
<i><b>文字</b></i>
```
...等

> Writerside IDE 快捷键从内向外检测，如果使用类似 `_**文字**_` 格式，无法使用快捷键优先取消斜体，反之无法优先取消粗体。
</procedure>
<procedure>

~~删除线~~ <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>S</shortcut>
```markdown
~~文字~~
```
或
```xml
<s>文字</s>
```
</procedure>
<procedure>

`行内代码块` <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>C</shortcut>
```markdown
`文字`
```
或
```xml
<code>文字</code>
```
</procedure>
<procedure>

[链接](https://b23.tv/BV1GJ411x7h7) <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>U</shortcut>

```markdown
[文字](<站内文档文件名#章节 | 外部链接>)
```
或
```markdown
<外部链接>  <- 使用尖括号括起来即可
```
或
```xml
<a href="<站内文档文件名#章节 | 外部链接>">文字</a>
```

鼠标悬停在站内文档链接上时默认弹出跳转处的标题栏下第一段文字作为概述，如果想自定义内容，可以使用
```markdown
[文字](<站内文档文件名#章节 | 外部链接> "描述")
```
或
```markdown
[文字](<站内文档文件名#章节 | 外部链接>){summary="描述"}
```
或
```xml
<a href="<站内文档文件名#章节 | 外部链接>" summary="描述">文字</a>
```
想要禁用总结，请直接在 `[]()` 后加 `{summary=""}`
```markdown
[文字](<站内文档文件名#章节>){summary=""}
```
或
```xml
<a href="<站内文档文件名#章节>" summary="">文字</a>
```
当 `[]` 内没有内容时，默认使用章节标题（站内）或完整链接（站外）作为文本。

</procedure>

<procedure>
<sup>角标</sup>

```xml
<sup>文字</sup>
```
</procedure>
<procedure>

<shortcut>按键</shortcut>

```xml
<shortcut>文字</shortcut>
```

<p>
编写规范：<br/>
同时按下的按键 <shortcut>按键A</shortcut><shortcut>按键B</shortcut><shortcut>按键C</shortcut><br/>
分步骤按下的按键 <shortcut>按键A</shortcut>, <shortcut>按键B</shortcut>, <shortcut>按键C</shortcut><br/>
按住的按键 <shortcut>^按键</shortcut><br/>
例： <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>Esc</shortcut>, <shortcut>^↓</shortcut>, <shortcut>Alt</shortcut><shortcut>E</shortcut>
</p>
</procedure>

### 高级文本块

这些文本块请结合源文件和预览页面进行阅读

这些块大多数可以嵌套或通过 <shortcut>Tab</shortcut> 缩进进行悬挂，如果遇到问题请使用 xml 语法。

#### 省流块
<tldr>

省流块永远紧跟最近的标题。
</tldr>

#### 术语

标题 1
: 内容 1

标题 2
: 内容 2

或

<deflist>

<def title="标题 1">
内容 1
</def>

<def>
<title><i>标题 2</i></title>
内容 2
</def>

</deflist>

#### 代码块

```markdown
    内容
```
或

<code-block lang="xml">
内容
</code-block>

> - ` ``` ` 后紧跟编程语言
> - markdown 格式虽然在 IDE 补全范围内，但是编译器却无法识别此语言。
>   ```
>   CDE016: Unknown language is specified for a code block
>     · "markdown": ...
>   ```
>   Writerside，很神奇吧。

#### 注释／提示／警告

> 内容

> 内容
>
{style="note"}

> 内容
>
{title="标题"}

<warning title="标题">
内容
</warning>

> - `style` 可用字段：`tip` (默认), `note` , `warning`；当使用 xml 块时，直接使用 `<tip/>` `<note/>` `<warning/>` 。
> - 当使用 markdown 格式时，应当多空出一行。

#### 缩写

<tooltip term="缩写">文本</tooltip>

> 可以在 `Writerside/cfg/glossary.xml` 中查询和添加。

#### 步骤

##### 无序步骤

- 步骤 1
- 步骤 2
    - 子步骤 1
- 步骤 3

> - 可以使用 `+` `-` `*` 。
> - 紧跟步骤添加
>   ```markdown
>   -
>   {type="none"}
>   ```
>   可以隐藏点号。
> - `type` 可用字段：`bullet` (默认) 点号，`decimal` 同有序步骤，`alpha-lower` 使用小写字母的有序步骤，`none` 没有前缀。
>   - 不推荐使用除 `none` 以外的字段，否则可能导致渲染额外的一个步骤，如果你想要小写字母或者其他变量，请使用 xml 的 `<list/>` 代码。
> - 使用 <shortcut>Tab</shortcut> 缩进可以将其他内容悬挂到当前步骤下。

##### 有序步骤

1. 步骤 1
2. 步骤 2
    1. 子步骤 1
3. 步骤 3

> - 可以和无序步骤混用。
> - `type` 字段同无序步骤。
> - 当序号混乱时可以在序号上右键 > 显示上下文操作 (<shortcut>Alt</shortcut><shortcut>Enter</shortcut>) > 修复列表项编号

##### `<list/>` 块

<list type="alpha-lower">
<li>
步骤 1
</li>
<li>
步骤 2
</li>
<li>
步骤 3
</li>
<li>
步骤 4
</li>
</list>

> `columns` ：决定列表分几列渲染，多列渲染时强制无前缀。
>
> `start` ：决定开始的序号。
>
{title="部分可用变量"}

#### 步骤块

<procedure title="有序步骤">
    <step>步骤1</step>
    <step>步骤2</step>
</procedure>

<procedure type="choices">
    <title>无序步骤</title>
    <step>步骤1</step>
    <step>步骤2</step>
</procedure>

> - `type` 变量的 `steps` 表示有序步骤(默认)，`choices` 表示无序步骤
> - 当 `title` 作为 `<title/>` 块时可以使用 xml 代码为其添加 [文字格式](#format){summary=""}
> - 步骤块会作为当前标题的下一级内容

#### 新起段落

段落 1

段落 2

##### `<p/>` 块

<p>段落 1</p>
<p>段落 2</p>

#### 仅换行

行 1  
行 2

> 行末添加两个空格即可。

##### `<br/>` 符

行 1<br/>
行 2

#### 表格

| 表头1 | 表头2 | ... |
|-----|-----|-----|
| 内容1 | 内容2 | ... |
| 内容3 | 内容4 | ... |

> - 第二行为对齐行／表头分隔行
>   - `|:-|` 表示左对齐，`|:-:|` 表示居中对齐，`|-:|` 表示右对齐，`|-|` 表示默认对齐，`-` 数量不限。
>   - Writerside 暂时不支持对齐，你可以使用这些对齐定义作保留。
> - 如果你想使用单元格合并等复杂功能，请使用 xml 的 `<table/>` 块。
 
##### `<table/>` 块

<table style="both">
<tr><td>双表头</td><td width="100">列表头1</td><td>列表头2</td><td>列表头3</td></tr>
<tr><td>行表头1</td><td >内容1</td><td rowspan="2">内容3</td></tr>
<tr><td>行表头2</td><td>内容2</td></tr>
<tr><td>行表头3</td><td colspan="2">内容4</td></tr>
<tr><td>行表头4</td></tr>
</table>

> - `<table/>` 代码变量
>   - `style` ：指定表头样式，`both` 表示既有行表头也有列表头，`header-column` / `header-row` 表示仅列／行表头，`none` 表示没有表头。
> - `<td/>` 代码变量
>   - `width` 指定列宽度，以当前列第一个定义为准。
>   - `rowspan` 向下扩展的行数
>   - `colspan` 向右扩展的行数
> - 所有未定义的表格单元默认合并

#### 选项卡

<tabs>
    <tab title="选项卡1标题">
        内容A
    </tab>
    <tab title="选项卡2标题">
        内容B
    </tab>
</tabs>

使用 `group` 和 `group-key` 同步切换标签页，当 `group` 和 `group-key` 值相同时，选项卡将会同步切换：

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

#### 复用块

插入复用块

```xml
<include from="源文件" element-id="复用块ID"/>
```

> 目前我们的复用块全部保存于 `topics/contentsLibrary.md` ，如果你需要调用复用块，请访问该文件。

添加新的复用块

```xml
<snippet id="复用块ID">
    
    复用块内容
    
</snippet>
```

> 如果要在多个文档中使用，请添加到 [](contentsLibrary.md){summary=""} 以便管理。

> 若 `<snippet/>` 的上一行是 markdown 行，则应当多加一行空格，复用块里的内容也应当在开头和末尾加空行！
> 
{style="warning"}

#### 变量

变量主要用于使用复用块时更改块内的内容。

1. 在调用变量名之前使用
    ```xml
    <var name="变量名" value="不包含任何xml/md格式的文本"/>
    ```
   ，或将全局变量保存至 `v.list`
2. 在任意位置使用 `%变量名%`

变量名中不可包含任何 markdown 语法或 xml 语法。

<procedure>

<snippet id="t">

试图在%fVar%使用%lang%语法。

</snippet>

<var name="fVar" value="<b>这里</b>"/>
<var name="lang" value="xml"/>
<include from="wsFormat.md" element-id="t"/>
<var name="fVar" value="**这里**"/>
<var name="lang" value="md"/>
<include from="wsFormat.md" element-id="t"/>
</procedure>

变量名可以和复用块一起使用，使用方法同上例。

> Markdown 链接要将其拆分为三个变量
> ```markdown
> [%文本%](%链接%){summary="%停留时的描述%"}
> ```
>
{style="note"}

#### 可折叠块

<chapter title="章节" collapsible="true" default-state="expanded">

内容

> 此处为了方便使用 xml 的章节块，你也可以正常使用 [markdown 标题代码](#title){summary=""}。

</chapter>

```
代码块
内容
```
{collapsible="true" default-state="collapsed"}

> 可以使用 `collapsed-title` 指定折叠后的标题，或者使用 `collapsed-title-line-number` 指定折叠后作为标题的行数。
> 
> `collapsed-title` 优先。

<procedure collapsible="true" default-state="expanded">
<title>步骤块</title>
<p>内容</p>
</procedure>

> `collapsible` 指定是否可折叠
> 
> `default-state` 指定默认状态，`collapsed` (默认) 表示默认折叠，`expanded` 表示默认展开。

## 添加新文件

> 文件名应当使用**驼峰命名法**。
>
{style="note"}

1. 在 `Writerside` 侧栏的正确目录下创建 Topic

   ![create_topic_on_correct_directory](create_topic_on_correct_directory.png)

2. 在 `项目` 侧栏将你的文档文件移入对应的文件夹

   ![move_file_to_correct_folder](move_file_to_correct_folder.png)

## 编写时的注意事项

- 如果使用了 xml 代码，你需要空一行才能继续 markdown 格式。
   <procedure>
   <step>
   这段话**不能**正常使用 `markdown 格式` 。
   </step>
   </procedure>
   
   <procedure>
   <step>
   
   这段话**可以**正常使用 `markdown 格式` 。
   </step>
   </procedure>
- 在西文和中文之间应添加空格。
- 不要滥用**特***殊*~~字~~`形`。
- 涉及文件路径的格式应当统一（至少在单个文档内统一）。例如 `F:/Codes/hw.cpp` `C:\Windows\`
- 涉及点击次序（多级菜单）的，顺序中间使用 `>` 或 `→` ，**不要使用 `->`！** 同时也应当注意同文档内统一。

## 注释和待办事项（TODO）

新起一行并使用
```
[//]: # (注释内容)
```
进行注释，或直接按下 <shortcut>Ctrl</shortcut><shortcut>/</shortcut> 注释当前行

**一个板块应当在完成之后再取消注释**

在注释内容中写入 `TODO` 字段自动标记为待办事项，没有大小写限制，`TODO` 后需要接空格或者符号才能继续写注释  
例：
```
[//]: # (TODO)
[//]: # (toDO: 描述)
[//]: # (TOdO-描述)
```
你可以在 IDE 的左侧栏下方第二个按钮查看整个文档中的待办事项。
