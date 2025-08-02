# 准备工作

<show-structure depth="2"/>

<tldr>

在进入正式的编程和学习之前，我们将用三节的时间了解我们会用到的编辑器，OptiFine 的管线，以及 GLSL 的基础。

本节将介绍我们编写光影会使用的编辑器和游戏环境。

</tldr>

## 安装编辑器和插件

要想进行光影编程，一个好的代码编辑器必不可少。虽然你也可以当记事本战神，但是需要记住：战神一时爽，调试火葬场。

在本教程中，我们使用 VS Code（Visual Studio Code）进行编程，它是由微软出品的轻量化代码编辑器，在所有桌面平台上均有发行，有许多便利插件，我们编写光影所需要的也包含其中。

### VS Code

前往 [VS Code 官网](https://code.visualstudio.com/) ，点击 `Download for Windows` ，等待安装包下载完毕运行即可。

在选择附加任务时，最好全选（默认）`其他` 类别中的选项以便于以后编辑文件和文件夹。

运行 VS Code，如果你需要中文界面，请安装简体中文扩展：
1. 在软件内按下 <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>X</shortcut> 打开插件商店
2. 在搜索栏搜索
    ```
    Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code
    ```
3. 找到正确的语言，点击 `Install`
4. 根据插件介绍页面操作即可

### 代码高亮

代码高亮会将代码字体进行染色和更改格式，用于提高代码可读性。

VS Code 默认不支持 GLSL 代码高亮，需要使用第三方插件，你可以在插件商店中搜索
```text
GLSL Syntax for VS Code
```
插件并安装来获取 GLSL 代码高亮功能。

或者访问该插件的 [插件商店页面](https://marketplace.visualstudio.com/items?itemName=GeForceLegend.vscode-glsl) 并单击 `Install` 来呼出 VS Code 以安装。

该插件会自动关联 `.vsh`、`.glsl`、`.geom`、`.frag` 等着色器文件常用后缀。

### 代码补全和调试

GLSL Syntax for VS Code 仅支持 GLSL 语法高亮，要想在工作区应用针对 OptiFine 光影的代码补全和查错等高级语法功能，我们还需要另一个 <tooltip term="LSP">LSP</tooltip> 插件。

在插件商店中搜索
```text
Language Server for Minecraft Shaderpacks
```
插件并安装即可。

或者访问该插件的 [插件商店页面](https://marketplace.visualstudio.com/items?itemName=GeForceLegend.vscode-mcshader) 并单击 `Install` 来呼出 VS Code 以安装。

只要工作区正确，该插件就会实时编译光影并提供驱动级查错。

## 配置游戏环境

我们将使用截止教程编写时的最新正式版本（**JE 1.21.4**, OptiFine J3）作为测试环境。

如果你还不会安装游戏，参阅 [](jeInstallGame.md) 。

安装完成后，你需要在 `shaderpacks` 文件夹下新建一个文件夹，然后在该文件夹内再新建一个 `shaders` 文件夹，这就是一个光影包。你也可以建立多个光影包来分别测试不同内容。

右键 `shaders` ，然后点击 `通过 Code 打开`（在 Windows 11 中你需要点击 `显示更多选项` 或者按住 <shortcut>Shift</shortcut> 点右键才能找到），这就是我们的工作区了，你可以在左侧栏的 `资源管理器` 页查看工作区内的文件和文件夹，如果你找不到这个选项卡，可以按 <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>E</shortcut> 呼出。

在游戏中，为了防止原版暗角干扰最终效果，你可以把 `视频设置` > `细节` > `晕影` 设置为 `流畅` 。

## 了解你的编辑器

在侧栏文件夹内空白区域双击可以新建文件，在主窗口空白区域双击可以新建未命名临时文件。

除了关联后缀外，文件的高亮状态默认是 `纯文本` 模式，你可以点击右下角的 `纯文本` 来切换语言模式。

你可以在编辑过程中随时按下 <shortcut>Ctrl</shortcut><shortcut>Space</shortcut> 呼出代码补全功能（不能使用中文输入法）。

你可以按下 <shortcut>Ctrl</shortcut><shortcut>K</shortcut>, <shortcut>S</shortcut> 来保存所有文件。

使用 <shortcut>Ctrl</shortcut><shortcut>/</shortcut> 或 <shortcut>Alt</shortcut><shortcut>Shift</shortcut><shortcut>A</shortcut> 可以快捷成行注释或成块注释。

当你保持工作区打开并关闭 VS Code 窗口时，它会缓存工作区布局和未保存的文件，当你下次运行 VS Code 时会默认继承进度。

如果你安装了前文的 LSP 插件，当你修改文件名称时，所有的包含宏都会自动修改。

将窗口标签或文件拽入已经打开的其他文件编辑界面的某一侧，可以拆分工作区。

## 查看日志

OptiFine 会将光影报错内容输出到游戏的日志，你可以在 `\logs\latest.log` 中找到它，在启动器中勾选 `查看日志` 或者将这个文件拖入 VS Code 就可以查看。

VS Code 默认支持 Log 格式的日志，但是你还应该在右下角选择 `GB 2313` 编码，这样才能正确显示日志中的中文。
