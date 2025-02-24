# Java 版游戏和加载器安装指南

<primary-label ref="manual"/>

<secondary-label ref="new"/>
<secondary-label ref="jeDoc"/>

<var name="topic">帮助新手从零开始安装 Java、游戏和加载器的文档</var>
<var name="goal">你在寻找安装光影的教程</var>
<var name="target_name"/>
<var name="target_topic">jeInstallShaders.md</var>
<var name="target_description"/>

<include from="uniforms.md" element-id="h_note_readingTips"/>

## 安装 Java {id="installJava"}

<tldr>

_Java_ 版，顾名思义，要想运行游戏，Java 环境是不可或缺的。

</tldr>

1. 推荐安装 [GraalVM JDK](https://www.graalvm.org/downloads/#) 。
   - 在页面上展开第一项 Java 版本，对于 **1.18** 及以前的版本，选择 `Java 21`，否则选择 `Java 23`。
   - 展开第二项，根据你的系统选择版本，如果你不确定且不是苹果用户，选择 `Windows x64`，然后点击 `Download`。
2. 下载之后，解压到任意位置（推荐解压到 `C:\Program Files\Java\` 方便管理），并在开始菜单中搜索 `path` ，打开 `编辑系统环境变量`。
   - 对于其他系统用户，请自行搜索如何修改。
3. 选择 `高级` > `环境变量…` > `系统变量` ，找到变量名为 `Path` 的变量。
4. 选择 `编辑` > `新建` ，然后键入 `<你的解压路径>\bin` 并保存。

> 如果你需要游玩 **JE 1.8** 及以前的版本，可以安装 Java 8。  
> [Windows x64 安装包](https://sdlc-esd.oracle.com/ESD6/JSCDL/jdk/8u441-b07/7ed26d28139143f38c58992680c214a5/jre-8u441-windows-x64.exe?GroupName=JSC&FilePath=/ESD6/JSCDL/jdk/8u441-b07/7ed26d28139143f38c58992680c214a5/jre-8u441-windows-x64.exe&BHost=javadl.sun.com&File=jre-8u441-windows-x64.exe&AuthParam=1740322242_943056824fede371e16276ded28e3643&ext=.exe)
>
{style="note"}

## 获取启动器

<tldr>

Java 版拥有众多的第三方启动器，一个顺手的启动器可以省下不少功夫。

在此我们推荐几款较为常用的启动器。

</tldr>

官方启动器
: [从官网获取](https://www.minecraft.net/zh-hans/download) [从微软商店获取](https://apps.microsoft.com/detail/9PJ8266BHFWN?hl=neutral&gl=HK&ocid=pdpshare)
- 没有特色就是最大的特色。~~你猜为什么这么多第三方启动器？~~
- 不支持离线模式，不支持嵌入式安装。
- 未购买前只能游玩试玩模式
- 官方洁癖专用启动器

HMCL 启动器
: [从官网获取](https://hmcl.huangyuhui.net/download)
- 支持在启动器内下载 CurseForge 和 Modrinth 上的模组
- 支持嵌入式安装加载器，且可随意更换
- 支持离线模式和第三方验证服务器
- 支持导入整合包
- 镜像源加速下载
- 国产启动器

PCL 2 启动器
: [从爱发电获取免费版](https://afdian.com/p/0164034c016c11ebafcb52540025c377)
- 在启动器内下载 CurseForge 和 Modrinth 上的模组
- 支持嵌入式安装加载器（不可更换）
- 支持离线模式和第三方验证服务器
- 支持导入整合包
- 镜像源加速下载
- 国产启动器
- ~~也许无聊的时候可以玩玩启动器？~~

Multi MC 启动器
: [从官网获取](https://multimc.org/#Download)
- 支持在启动器内安装加载器
- 支持导入整合包
- 便捷的版本管理

### 什么是离线模式？

离线模式下无法访问开启了正版验证的服务器和领域服，无法接入聊天审查，无法设置自定义皮肤（除非使用第三方验证服务器或更改资源包），本质上就是盗版模式。

### 什么是嵌入式安装？

嵌入式安装需要启动器支持。可以将安装了加载器的版本和原版合并为同一个版本。

## 安装游戏 {id="installGame"}

<tldr>

安装教程以 HMCL 的嵌入式安装（最简单）为例。

</tldr>

> 将你的第三方启动器放入一个文件夹，它们支持添加已有路径，今后的游戏都可以从这里管理和运行。

要安装哪一个光影加载器？
<tabs group="loader">
<tab title="OptiFine">
<var name="loader">OptiFine</var>
<var name="site">OptiFine 官网</var>
<var name="link">https://optifine.net/downloads</var>

如果你是新手，可以先尝试安装最简单的仅安装 OptiFine。

需要安装其他模组吗？
<tabs group="otherMods">
<tab title="不需要（纯净安装）">
<procedure type="steps">
<include from="jeInstallGameContents.md" element-id="startLoader"/>
<br/>
<include from="jeInstallGameContents.md" element-id="tip_of_checkVersion"/>
<var name="img">installOF.png</var>
<include from="jeInstallGameContents.md" element-id="installLoader"/>
<var name="img">selectOF.png</var>
<var name="ver">最新版</var>
<include from="jeInstallGameContents.md" element-id="selectLoader"/>
<br/>
<note>若没有任何版本，请尝试勾选 <code>快照</code> ，若仍然没有，请按照第二步提示操作。</note>
<include from="jeInstallGameContents.md" element-id="finish"/>
</procedure>
</tab>
<tab title="Forge 模组">

部分 Forge 模组可能和 OptiFine 存在未知冲突。  
如果你的游戏无法启动，请尝试删除其他模组或卸载 Forge 改用纯净安装。
<procedure type="steps">
<var name="img">getOF.png</var>
<var name="mod">OptiFine</var>
<var name="attention">其所支持的最新游戏版本</var>
<include from="jeInstallGameContents.md" element-id="getMod"/>
<br/>
<include from="jeInstallGameContents.md" element-id="useMirror"/>
<br/>
<include from="jeInstallGameContents.md" element-id="tip_of_checkVersion"/>
<br/>
<include from="jeInstallGameContents.md" element-id="historyVersion"/>
<include from="jeInstallGameContents.md" element-id="startMod"/>
<var name="loader">Forge</var>
<var name="img">installForge.png</var>
<include from="jeInstallGameContents.md" element-id="installLoader"/>
<var name="img">selectForge.png</var>
<var name="ver" value=" OptiFine 对应版本"/>
<include from="jeInstallGameContents.md" element-id="selectLoader"/>
<include from="jeInstallGameContents.md" element-id="wait"/>
<var name="img">mainPageForge.png</var>
<var name="img2">modPageForge.png</var>
<include from="jeInstallGameContents.md" element-id="mainPage"/>
<include from="jeInstallGameContents.md" element-id="finish"/>
</procedure>
</tab>
<tab title="Fabric 模组">

要想在 Fabric 上运行 OptiFine 需要 OptiFabric 作为桥梁。兼容性较差，与多数模组存在冲突。  
如果你的游戏无法启动，请尝试删除其他模组或卸载 Fabric 改用纯净安装。
<procedure type="steps">
<var name="site">OptiFabric 的 CurseForge 页面</var>
<var name="link">https://www.curseforge.com/minecraft/mc-mods/optifabric/files</var>
<var name="img">getOFa.png</var>
<var name="mod">OptiFabric</var>
<var name="attention">其所支持的最新游戏版本（你也可以在启动器中直接下载）</var>
<include from="jeInstallGameContents.md" element-id="getMod"/>
<br/>

> 这里我们假设对应游戏版本是 **JE 1.21.4**
<var name="img">getOF.png</var>
<var name="mod">OptiFine</var>
<var name="attention">下载对应 OptiFabirc 所支持的最新游戏版本</var>
<include from="jeInstallGameContents.md" element-id="getMod"/>
<br/>
<include from="jeInstallGameContents.md" element-id="useMirror"/>
<br/>
<include from="jeInstallGameContents.md" element-id="tip_of_checkVersion"/>
<br/>
<include from="jeInstallGameContents.md" element-id="historyVersion"/>
<var name="loader">OptiFabric 和 OptiFine</var>
<include from="jeInstallGameContents.md" element-id="startMod"/>
<var name="loader">Fabric</var>
<var name="img">installFabric.png</var>
<include from="jeInstallGameContents.md" element-id="installLoader"/>
<var name="img">selectFabric.png</var>
<var name="ver">最新版</var>
<include from="jeInstallGameContents.md" element-id="selectLoader"/>
<var name="loader">Fabric API</var>
<var name="img">installFabricAPI.png</var>
<include from="jeInstallGameContents.md" element-id="installLoader"/>
<var name="img">selectFabricAPI.png</var>
<var name="ver">最新版</var>
<include from="jeInstallGameContents.md" element-id="selectLoader"/>
<include from="jeInstallGameContents.md" element-id="wait"/>
<var name="img">mainPageFabric.png</var>
<var name="img2">modPageFabric.png</var>
<var name="mod">OptiFabric 和 OptiFine</var>
<include from="jeInstallGameContents.md" element-id="mainPage"/>
<include from="jeInstallGameContents.md" element-id="finish"/>
</procedure>
</tab>
</tabs>

</tab>
<tab title="Iris">
<var name="loader">Iris</var>
<var name="site">Iris 的 Modrinth 页面</var>
<var name="link">https://modrinth.com/mod/iris/versions</var>

Iris 能在非 Forge 的加载器环境下运行，且与模组的兼容性较好，这里以 Fabric 作为演示。  
Iris 对一些光影存在兼容性问题，若你想用的光影没有声明需要 Iris 独占特性，我们建议你安装 OptiFine。  
若你想要在 Forge 下运行光影且其他模组与 OptiFine 存在冲突，可以尝试 Oculus。
<procedure type="steps">
<include from="jeInstallGameContents.md" element-id="startLoader"/>
<br/>
<include from="jeInstallGameContents.md" element-id="tip_iris_checkVersion"/>
<var name="loader">Fabric</var>
<var name="img">installFabric.png</var>
<include from="jeInstallGameContents.md" element-id="installLoader"/>
<var name="img">selectFabric.png</var>
<var name="ver">最新版</var>
<include from="jeInstallGameContents.md" element-id="selectLoader"/>
<var name="loader">Fabric API</var>
<var name="img">installFabricAPI.png</var>
<include from="jeInstallGameContents.md" element-id="installLoader"/>
<var name="img">selectFabricAPI.png</var>
<var name="ver">最新版</var>
<include from="jeInstallGameContents.md" element-id="selectLoader"/>
<include from="jeInstallGameContents.md" element-id="wait"/>
<step>

回到主菜单，再次点击 `下载` 。
</step>
<step>

选择 `模组` ，确保 `游戏` 是刚才下载的版本，将 `下载源` 切换到 `Modrinth` ，在 `名称` 处键入 `Iris` 进行搜索，然后选择搜索结果的 `Iris Shaders` 。

![installIris.png](installIris.png)
</step>

<step>

点击 `推荐版本` ，然后安装必须的前置模组，最后点击 `安装到当前版本` 。

![installSodium.png](installSodium.png)
</step>
<include from="jeInstallGameContents.md" element-id="finish"/>
</procedure>
</tab>
<tab title="仅游戏">

不是哥们？这可跑不了绝大部分光影哦，你自己想清楚。
<procedure type="steps">
<include from="jeInstallGameContents.md" element-id="start"/>
<include from="jeInstallGameContents.md" element-id="wait"/>
<include from="jeInstallGameContents.md" element-id="finish"/>
</procedure>
</tab>
<tab title="其他">

包括 Canvas、Vulkanite、Oculus 等加载器均可参考 Iris 的安装方案，只需要在最后下载对应模组即可。
</tab>
</tabs>

若你需要手动下载加载器，这里给出了各加载器的官方网站：

- [Forge](https://files.minecraftforge.net/net/minecraftforge/forge/)
- [Fabric](https://fabricmc.net/)
- 
- [NeoForge](https://neoforged.net/)
- [Quilt](https://quiltmc.org/en/)

{columns=3}

## 配置游戏

<tldr>

在启动游戏之前，你应该检查你的启动器设置，以确保能流畅地体验游戏。

</tldr>
<tabs group="launcher">
    <tab title="HMCL" group-key="hmcl">
        <procedure>
<step>

点击版本进入游戏管理。

![游戏设置](check_hmcl_1.png "游戏设置")
</step>
<step>

- 如果你的游戏目录有其他游戏版本，并且你希望单独对这个版本进行设置，勾选 `启用游戏特定设置` 。
- 否则，点击 `编辑全局版本设置` 。

![选择设置方式](check_hmcl_2.png "选择设置方式")
</step>
            <step>

这里简单列举一下这个页面各个选项的作用

Java 路径
: 决定你的游戏所用的 Java，确保你按照 [前文](#installJava "安装 Java") 所述，配置好了 Java，然后选择 `自动选择合适的 Java` 。

版本隔离
: 决定你的游戏文件存取位置，更改此选项之后需要手动将资源文件（光影、资源包、模组、存档）移至更改后的位置。
- `默认` 模式将游戏的各种资源文件放在 `<你的目录>\.minecraft\` 下，并且和其他未开启版本隔离的游戏共享。
- `各版本独立` 模式将游戏的资源文件放在 `<你的目录>\.minecraft\versions\<对应游戏版本文件夹>\` 下，并且不与其他任何版本共享。
- `自定义` 模式由你自己决定游戏资源文件的存放位置，并且与其他同位置的的版本共享。

游戏内存
: 决定游戏分配的内存，最好小于等于 `设备总内存` 的一半，且不大于 16 GB。

    自动分配内存
    : 勾选后 `游戏内存` 选项变为 `最低内存分配` ，根据当前系统是否空闲和版本预估内存要求动态分配内存，但是不超过 `最低内存分配` 。

启动器可见性
: 决定游戏启动后启动器的行为，保留启动器可能在后台占用资源，但是如果游戏崩溃了，启动器可以输出崩溃日志。

游戏窗口分辨率
: 决定你游戏窗口的默认大小，如果你不确定，保持其为原样。

查看日志
: 开启后会额外启动一个游戏日志窗口，如果不进行调试，不需要开启。

进程优先级
: 游戏在 Windows 线程上的优先级，优先级越高，游戏越会被 CPU 优先处理，在一定程度上可以缓解 CPU 瓶颈，但是并不能提高太多性能，还可能导致游戏崩溃。

服务器地址
: 如果填写，在启动游戏后会尝试自动加入服务器。

高级设置
: <format color="Red" style="bold">不要动这里的选项。</format>

![设置界面](check_hmcl_3.png "设置界面")
</step>
        </procedure>
    </tab>
    <tab title="PCL 2" group-key="pcl">
        <procedure>
            <step>

- 如果你的游戏目录有其他游戏版本，并且你希望单独对这个版本进行设置，点击 `版本设置` 。
- 否则，点击顶栏的 `设置` 。

![选择设置方式](check_pcl2_1.png "选择设置方式")
</step>
            <step>

这里简单列举一下这个页面各个选项的作用

离线皮肤
: 离线模式下玩家所使用的皮肤
- 随机：随机从 [默认皮肤和模型](https://zh.minecraft.wiki/w/皮肤#默认皮肤) 中抽取。
- Steve / Alex：固定史蒂夫或艾利克斯皮肤。
- 正版皮肤：使用下方 `正版玩家名` 所填玩家的皮肤。
- 自定义：从电脑上选择其他皮肤。

游戏窗口标题
: Windows 窗口上的标题，将鼠标停留在输入框上可以查看格式化代码。

自定义信息
: 在游戏中左下角和 <shortcut>F3</shortcut> 调试界面左上角的信息。

版本隔离
:
- `关闭` 模式将游戏的各种资源文件（光影、资源包、存档）放在 `<你的目录>\.minecraft\` 下，并且和其他未开启版本隔离的游戏共享。
- `隔离<版本>` 模式将符合要求版本的资源文件放在 `<你的目录>\.minecraft\versions\<对应游戏版本文件夹>\` 下，并且不与其他任何版本共享。

启动器可见性
: 决定游戏启动后启动器的行为，保留启动器可能在后台占用资源，但是如果游戏崩溃了，启动器可以输出崩溃日志。

进程优先级
: 游戏在 Windows 线程上的优先级，优先级越高，游戏越会被 CPU 优先处理，在一定程度上可以缓解 CPU 瓶颈，但是并不能提高太多性能，还可能导致游戏崩溃。

游戏窗口
: 决定你游戏窗口的默认大小，如果你不确定，设置为 `默认大小` 。

游戏 Java
: 决定你的游戏所用的 Java，确保你按照 [前文](#installJava "安装 Java") 所述，配置好了 Java，然后选择 `自动选择合适的 Java` 。

游戏内存
: 决定游戏分配的内存，最好小于等于 `设备总内存` 的一半，且不大于 16 GB，如果你不确定，将其设置为 `自动配置` 。

高级启动选项
: <format color="Red" style="bold">不要动这里的选项。</format>

![设置界面](check_pcl2_2.png "设置界面")
</step>
        </procedure>
</tab>
</tabs>

启动游戏后，你可能需要配置视频设置，参阅 [](videoSettings.md){summary=""} 。

参阅 [](jeInstallShaders.md){summary=""} 和 [](jeInstallRP.md){summary=""} 以安装光影和资源包。
