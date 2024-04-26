# 光影包安装通用教程

<show-structure depth="2"/>

<tldr>

安装 OptiFine 或 Iris，将光影放入 `shaderpacks` 文件夹。
</tldr>

> 这篇文档在最近进行过订正，可以放心阅读。
>
{style="note" title="已订正的文档"}

这篇文档帮助新人从安装游戏开始，直到最终成功运行光影为止。

## 准备工作

### 启动器

这篇文档主要使用 **HMCL** 和 **PCL 2** 两款国产启动器进行教学，你可以在下面获取这些启动器：

- [HMCL](https://hmcl.huangyuhui.net/download/)
- [PCL2 免费正式版](https://afdian.net/a/LTCat?tab=feed)
    - [付费快照版](https://afdian.net/a/LTCat)

我们只着重于较为流行的 OptiFine 和 Iris。

### 检查驱动程序

参考 [这篇文档](troubleshootCommon.md#查询电脑显卡 "通用问题 - 查询电脑显卡") 检查显卡以及是否安装和正确设置显卡驱动程序。

### 安装 Java {id="installJava"}

1. 推荐安装 [最新版 OpenJDK](https://openjdk.org/) ，点击页面中的 `Windows are available at <最新版 OpenJDK 下载链接>` ，并选择写有 `Windows/x64` 一行的 `zip` 。
2. 下载之后，解压到任意位置，并在 Windows 开始菜单中搜索 `path` ，打开 `编辑系统环境变量` 
3. 选择 `高级` > `环境变量…` > `系统变量` ，找到变量名为 `Path` 的变量
4. 选择 `编辑` > `新建` ，然后键入 `<你的解压路径>\bin` 。 
5. 保存后，重启电脑即可。

> 如果你需要游玩 **JE 1.8** 及以前的版本，可以安装 [Java 8（Windows 64位 脱机安装包）](https://javadl.oracle.com/webapps/download/AutoDL?BundleId=249553_4d245f941845490c91360409ecffb3b4) 。
>
{style="note"}

## 安装游戏和光影模组

<tabs group="A">
    <tab title="OptiFine" group-key="of">
        <tabs group="B">
            <tab title="纯净版" group-key="pure">
            <format color="GreenYellow" style="bold">推荐。</format>性能最好，没有加载器干扰，没有模组，不会出现兼容性问题。
                <tabs>
                    <tab title="嵌入式安装">
                        嵌入式安装需要启动器的支持。
                    <tabs group="launcher">
                        <tab title="HMCL" group-key="hmcl">
                            <procedure>
                                <step>

进入 `版本列表`
![版本列表](of_pure_builtin_hmcl_1.png "版本列表")
</step>
                                <step>

- 如果你想直接使用启动器所在目录，选择 `当前目录`
- 如果你已有游戏目录，点击 `添加游戏目录` 并将路径引导到 `<你的游戏文件夹>\.minecraft\` 。
</step>
<step>

点击 `安装新游戏版本`
![安装新游戏版本](of_pure_builtin_hmcl_2.png "安装新游戏版本")
</step>
<step>

选择你需要的游戏版本。为了确保 OptiFine 特性完全，我们推荐游戏和 OptiFine 均为**最新正式版**。
</step>
<step>

在安装新游戏版本界面，选择 OptiFine 版本，并点击 `安装` 。
![选择 OptiFine 版本](of_pure_builtin_hmcl_3.png "选择 OptiFine 版本")

> 你也可以像 `手动安装` 一样从官网下载安装包，并将其拖入已经安装好的游戏版本的 `自动安装` 页面来执行嵌入式安装（特别是当镜像源没有即时更新时）。
> ![将安装包拖入版本](of_pure_builtin_hmcl_4.png "将安装包拖入版本")
> {style="note"}
</step>
                            </procedure>
                        </tab>
                        <tab title="PCL 2" group-key="pcl">
                            <procedure>
                                <step>

- 如果你想直接使用启动器所在目录，直接选择 `下载游戏` 。
![下载或选择位置](of_pure_builtin_pcl2_1.png "下载或选择位置")
    > 有一个例外是，如果你以前使用过 PCL 2 启动器，那么可能存在其他目录，如果此时你想在启动器所在目录安装游戏，那么你可以点击 `版本选择` > `新建 .minecraft 文件夹` 。
- 如果你已有游戏目录，点击 `版本选择` > `添加已有文件夹` 并将路径引导到 `<你的游戏文件夹>\.minecraft\` 。
![新建或添加现有](of_pure_builtin_pcl2_2.png "新建或添加现有")
</step>
                                <step>

在 `自动安装` 选项卡下，选择你需要的游戏版本。为了确保 OptiFine 特性完全，我们推荐游戏和 OptiFine 均为**最新正式版**。
</step>
<step>

在安装新游戏版本界面，展开 `OptiFine` 并选择版本，并点击 `开始安装` 。
![选择 OptiFine 版本](of_pure_builtin_pcl2_3.png "选择 OptiFine 版本")
> PCL 2 不允许玩家安装游戏之后更换嵌入式安装的 OptiFine 和模组加载器，所以你需要确保你安装了正确的版本。
>
> - 如果你需要更新 OptiFine，那么需要重新下载该版本。
> - 如果你开启了版本隔离，记得迁移 `<你的目录>\.minecraft\versions\<原本的游戏版本文件夹>\` 下的资源文件！
>
{style="note"}
</step>
                            </procedure>
                        </tab>
                    </tabs>

> 如果你发现游戏最新正式版没有 OptiFine 的正式版 ~~（有时 OptiFine 会难产）~~，可以向前寻找，直到找到有正式版 OptiFine 的版本。
>
{style="note"}
</tab>
                    <tab title="手动安装">

手动安装仅推荐在你使用 `嵌入式安装` 出现问题时使用。
<procedure>
                            <step>

访问 [OptiFine 官网 - Downloads](https://optifine.net/downloads) 或者 [OptiFine 中文网 - 下载](https://optifine.cn/downloads) 。
> 中文网为镜像站，可能相较官网有些延后，仅当你无法访问官网时才使用。
> 
{style="note"}
</step>
                            <step>

寻找**最新正式版**的 OptiFine，点击 `Download` 并等待下载页面弹出，然后再次点击 `Download` <sup>官网</sup> 或 点击 `下载` 直接获取文件 <sup>中文站</sup> 。
![OptiFine 官网下载页面](of_pure_manual_1.png "OptiFine 官网下载页面")
> 如果你在官网点击 `Download` 之后卡住了，可能是你的网络不好，无法访问 OptiFine 设置的广告跳转链接，此时你可以点击 `(Mirror)` 直接转到下载页面。
> 
> > 仅当你多次下载或无法访问 `Download` 所指向的页面才这样做！广告跳转链接是作者维持模组更新的收入来源。
> >
> {style="warning"}
> 
{style="note"}
</step>
                            <step>

像 `嵌入式安装` 一样，**仅安装**最新 OptiFine 对应版本的**游戏本体**。
> 如果你发现 OptiFine 的最新正式版不对应游戏最新的正式版，那么你需要下载 OptiFine 要求的游戏版本。~~（有时 OptiFine 会难产）~~
>
{style="note"}
</step>
                            <step>

运行下载好的文件，点击 `...` 将路径定位到 `<你的游戏目录>\.minecraft\` ，然后点击 `Install` 。
![OptiFine 安装页面](of_pure_manual_2.png "OptiFine 安装页面")
> - 如果你的文件图标不是 Java 或者 JDK，你需要右键选择 `打开方式` 。
> - 如果你在你的打开方式中找不到 Java 或者 JDK，你需要通过 `选择其他应用` > `在电脑上选择应用` ，并将路径定位到 `<你的 Java 路径>\bin\javaw.exe`。
> 
{style="note" title="你需要使用 Java 运行此文件。"}
</step>
                            <step>

安装成功后，OptiFine 会弹出提示：
  ```text
  OptiFine is successfully installed.
  ```
  然后关闭安装程序。

> 如果安装失败，请检查第三步和第四步你的游戏本体和 OptiFine 路径是否正确。
> 
{style="note"}
</step>
                            <step>

当你安装成功之后，你的启动器版本列表里应该会新增一个 `<原始游戏版本>-<已安装的 OptiFine>` 的游戏，这是安装了 OptiFine 的版本。
> 原本的游戏版本依然会被保留，当你启动它时，它就像原版一样运行（它本身就是原版）。
</step>
                        </procedure>
                    </tab>
                </tabs>
            </tab>
        <tab title="和 Forge 一同安装" group-key="forge">

仅当你需要运行**与 OptiFine 兼容**的 Forge 模组时才这样做。

<tabs>
                <tab title="两者都嵌入式安装">

嵌入式安装需要启动器的支持。
> **JE 1.20.4** 以上只能将 OptiFine 以模组形式从 Forge 加载，不可以使用启动器一起嵌入式安装。
> 
> 如果你试图在上述版本中安装 OptiFine，请切换至 `将 OptiFine 作为模组安装` 或 `手动安装` 。
>
{style="warning"}

<procedure>

像 `纯净版` > `嵌入式安装` 一样，在安装页面额外选择 Forge 版本即可。
> 注意 OptiFine 更新日志中所能兼容的 Forge 版本，你可以在 `纯净版` > `手动安装` 提到的下载列表检查。
> ![检查 OptiFine 兼容的 Forge 版本](of_forge_check_ver.png "检查 OptiFine 兼容的 Forge 版本")
>
{style="note"}
</procedure>
</tab>
                <tab title="嵌入式安装 Forge，将 OptiFine 作为模组加载" id="ofAsMOD">
                    嵌入式安装需要启动器的支持。
                    <procedure>
                        <step>

像 `纯净版` > `手动安装` 1 ~ 3 步一样，下载 OptiFine。
> 注意 OptiFine 更新日志中所能兼容的 Forge 版本，你可以在下载列表检查。
> ![检查 OptiFine 兼容的 Forge 版本](of_forge_check_ver.png "检查 OptiFine 兼容的 Forge 版本")
>
{style="note"}
</step>
                        <step>

像 `纯净版` > `嵌入式安装` 一样，但是**仅安装 Forge**。
</step>
                        <step>

运行第一步下载好的文件，点击 `Extract` 将路径定位到 `<你的游戏目录>\.minecraft\mods\` <sup>未启用版本隔离</sup> 或 `<你的游戏目录>\.minecraft\versions\<对应游戏版本文件夹>\mods\` <sup>启用版本隔离</sup>。
![作为模组提取 OptiFine](of_forge_ofasmod.png "作为模组提取 OptiFine")

安装成功后，OptiFine 会弹出提示：
```text
OptiFine is successfully extracted.
```
> 如果你没有启动过游戏，OptiFine 可能会提示：
> ```text
> Cannot find Minecraft <OptiFine 要求的游戏版本>.
> You must download and start Minecraft <OptiFine 要求的游戏版本> once in the official launcher.
> ```
> 你需要先启动一次游戏。
> 
> 或者，你也可以直接将安装包拖入上述 `Extract 目录` 来跳过安装程序。
> 
{style="note"}
</step>
                    </procedure>

</tab>
                <tab title="手动安装">

手动安装仅推荐在你使用 `嵌入式安装` 出现问题时使用。
<procedure>
                        <step>

像 `纯净版` > `手动安装` 1 ~ 3 步一样，下载 OptiFine。
</step>
                        <step>

访问 [Forge 官网](https://files.minecraftforge.net/net/minecraftforge/forge/) ，寻找**对应 OptiFine** 和游戏兼容版本的 Forge。
> 注意 OptiFine 更新日志中所能兼容的 Forge 版本，你可以在下载列表检查。
> ![检查 OptiFine 兼容的 Forge 版本](of_forge_check_ver.png "检查 OptiFine 兼容的 Forge 版本")
>
{style="note"}
</step>
                        <step>

选择 `Download Latest` 块下方的 `Installer` 。
> 如果你在官网点击 `Installer` 之后卡住了，可能是你的网络不好，无法访问 Forge 设置的广告跳转链接，此时你可以
> 1. 点击 `Show all Versions` 展开版本列表。
> 2. 找到上述 `Download Latest` 下面一行文字对应的版本。
> ![Forge 版本号](of_forge_manual_2.png "Forge 版本号")
> 3. 点击 `Downloads` 列的 `Installer` 后面的 `i` 或展开的气泡框中的 `(Direct Download)` 。
> ![直接下载](of_forge_manual_3.png "直接下载")
>
> > 仅当你多次下载或无法访问 `Installer` 所指向的页面才这样做！广告跳转链接是作者维持模组加载器更新的收入来源。
> >
> {style="warning"}
>
{style="note"}
</step>
                        <step>

像 `纯净版` > `嵌入式安装` 一样，但是**仅安装**对应版本的**游戏本体**。
> 如果你发现 OptiFine 的最新正式版不对应游戏最新的正式版，那么你需要下载 OptiFine 要求的游戏版本。~~（有时 OptiFine 会难产）~~
>
{style="note"}
</step>
                        <step>

运行下载好的文件，选择 `Install client` ，然后点击 `...` 将路径定位到 `<你的游戏目录>\.minecraft\` ，然后点击 `确定` 。
![安装 Forge](of_forge_manual_1.png "安装 Forge")
</step>
                        <step>

安装成功后，Forge 会弹出提示：
```
Successfully installed client profile forge for version <游戏版本>-forge-<Forge 版本> into launcher, and downloaded [N] libraries
```
> 如果安装失败，请检查第五步你的游戏本体和 Forge 路径是否正确。
>
{style="note"}
</step>
                        <step>

像 `嵌入式安装 Forge，将 OptiFine 作为模组加载` 第三步一样，安装OptiFine。
</step>
                        <step>

当你安装成功之后，你的启动器版本列表里应该会新增一个 `<原始游戏版本>-<已安装的 Forge>` 的游戏，这是安装了 Forge 的版本。
> 原本的游戏版本依然会被保留，当你启动它时，它就像原版一样运行（它本身就是原版）。
</step>
                    </procedure>
                </tab>
            </tabs>
        </tab>
        <tab title="和 Fabric 一同安装" group-key="ofAsFabricMOD">
            <format color="Red">不推荐！</format>仅当你需要运行<b>与 OptiFabric 兼容</b>的 Fabric 模组时才这样做。
                <procedure>

> 如果你使用 PCL 2 进行嵌入式安装，你可以直接像 `纯净版` > `嵌入式安装` 一样，在下载页面将需要的附加项全部选择即可。
> ![从 PCL 2 安装带有 OptiFine 的 Fabric](of_fabric_pcl2.png "从 PCL 2 安装带有 OptiFine 的 Fabric")
> 
{style="note"}
<step>

访问 [OptiFabric 的 CurseForge 页面](https://www.curseforge.com/minecraft/mc-mods/optifabric/files/all?page=1&pageSize=20) 确认并下载 OptiFabric 兼容的最新版本 OptiFine。
![OptiFabric 的 CurseForge 页面](of_fabric_builtin_1.png "OptiFabric 的 CurseForge 页面")
</step>
                    <step>

像 `纯净版` > `手动安装` 1 ~ 2 步一样，但是要下载**最新 OptiFabric 兼容**的 OptiFine。
</step>
                    <step>
                        安装 Fabric
                        <tabs>
                            <tab title="嵌入式安装 Fabric">
                                嵌入式安装需要启动器的支持。
                                <procedure>

像 `纯净版` > `嵌入式安装` 一样，但是**仅安装 Fabric 和 Fabric API**。
</procedure>
                            </tab>
                            <tab title="手动安装">

手动安装仅推荐在你使用 `嵌入式安装` 出现问题时使用。
<procedure>
                                    <step>

像 `纯净版` > `嵌入式安装` 一样，**仅安装**最新 OptiFabric 对应版本的**游戏本体**。
</step>
                                    <step>

访问 [Fabric 官网](https://fabricmc.net/) ，点击 `Download` > `Download for Windows` 下载 Fabric 安装器。
</step>
                                    <step>

运行下载好的文件，选择 `客户端` ，将路径定位到 `<你的游戏目录>\.minecraft\` ，然后点击安装。
![安装 Fabric](of_fabric_manual_1.png "安装 Fabric")

安装成功后，Fabric 会弹出提示：
```text
<Minecraft 版本>的Fabric加载器<Fabric 版本>已成功安装。
许多MOD还要求您将Fabric API放入mods文件夹。
```
</step>
                                    <step>

直接点击弹出窗口的 [Fabric API](https://www.curseforge.com/minecraft/mc-mods/fabric-api) 然后点击 `Files` ，或者返回 [第一步的页面](https://fabricmc.net/) ，点击 `Download Fabric API` ，然后在 CurseForge 页面像**上层第一步**一样下载对应版本 Fabric API。
> 如果你没有启动过游戏，`mods` 文件夹可能不存在，你可以在对应位置新建一个文件夹并重命名。
> 
{style="note"}
</step>
                                    <step>

将下载的 Fabric API 拖入 `<你的游戏目录>\.minecraft\mods\` <sup>未启用版本隔离</sup> 或 `<你的游戏目录>\.minecraft\versions\<对应游戏版本文件夹>\mods\` <sup>启用版本隔离</sup> 。
</step>
                                    <step>

当你安装成功之后，你的启动器版本列表里应该会新增一个 `<原始游戏版本>-<已安装的 Fabric>` 的游戏，这是安装了 Fabric 的版本。
> 原本的游戏版本依然会被保留，当你启动它时，它就像原版一样运行（它本身就是原版）。
</step>
                                </procedure>
                            </tab>
                        </tabs>
                    </step>
                    <step>

将下载的 OptiFabric 拖入 `<你的游戏目录>\.minecraft\mods\` <sup>未启用版本隔离</sup> 或 `<你的游戏目录>\.minecraft\versions\<对应游戏版本文件夹>\mods\` <sup>启用版本隔离</sup> 。 
</step>
                    <step>

像 `和 Forge 一同安装` > `嵌入式安装 Forge，将 OptiFine 作为模组加载` 第三步一样，安装 OptiFine。
</step>
                </procedure>            
            </tab>
        </tabs>
    </tab>
    <tab title="Iris" group-key="iris">
        <format color="Red">不推荐！</format>仅当你确定你所使用的<b>光影与 Iris 兼容</b>且<b>需要 Iris 独占特性</b>，或需要运行<b>与 Sodium 兼容</b>（通常还需要额外安装 Indium <a href="https://modrinth.com/mod/indium/versions">(Modrinth)</a> <a href="https://www.curseforge.com/minecraft/mc-mods/indium/files/all?page=1&pageSize=20">(CurseForge)</a> 来保证兼容性）的 Fabric 模组时才这样做。
        <procedure>
            <step>

像 `OptiFine` > `和 Fabric 一同安装` 第三步一样，安装 Fabric。
</step>
            <step>

访问 [Iris 的 Modrinth 页面](https://modrinth.com/mod/iris/versions) ，选择对应游戏版本的 Iris，点击 `Download` 。
![Iris 的 Modrinth 页面](iris_1.png "Iris 的 Modrinth 页面")
</step>
            <step>

将下载的 Iris 拖入 `<你的游戏目录>\.minecraft\mods\` <sup>未启用版本隔离</sup> 或 `<你的游戏目录>\.minecraft\versions\<对应游戏版本文件夹>\mods\` <sup>启用版本隔离</sup> 。
</step>
            <step>

访问 [Sodium 的 Modrinth 页面](https://modrinth.com/mod/sodium/versions) ，重复 2 ~ 3 步，安装 Sodium。
</step>
        </procedure>
    </tab>
</tabs>

## 配置游戏

在启动游戏之前，检查你的启动器设置：

<tabs group="launcher">
    <tab title="HMCL" group-key="hmcl">
        <procedure>

![游戏设置](check_hmcl_1.png "游戏设置")
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
:
- `默认` 模式将游戏的各种资源文件（光影、资源包、存档）放在 `<你的目录>\.minecraft\` 下，并且和其他未开启版本隔离的游戏共享。
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
: <format color="Red" style="bold">不要动。</format>

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
    - 随机：随机从 [默认皮肤和模型](https://zh.minecraft.wiki/w/%E7%9A%AE%E8%82%A4#%E9%BB%98%E8%AE%A4%E7%9A%AE%E8%82%A4) 中抽取。
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
: <format color="Red" style="bold">不要动。</format>

![设置界面](check_pcl2_2.png "设置界面")
</step>
        </procedure>
</tab>
</tabs>

启动游戏后，配置视频设置，参见 [视频设置和相关显示问题](videoSettings.md "这篇文档列出了整个视频设置选项卡中容易出现问题的设置以及修改建议。") 。

## 检查并安装光影

检查你的光影是否符合下列要求：
- 打开压缩包或文件夹后应**有名为 `shaders` 的文件夹。**
    ```Shell
    └─ <光影名称 | 光影名称.zip> # 仅支持未加密的 .zip 压缩包
      └─ shaders # 重要！
        └─ <着色器程序相关文件和文件夹>
    ```
  > 如果你没有解压缩软件，我们推荐 [7-zip](https://sparanoid.com/lab/7z/) 。
- 确保不是原版光影或 Canvas 光影，否则你应当直接像 [安装资源包](resourcepacksCommon.md "资源包安装通用教程") 那样安装。

检查完成之后，将光影放入光影包文件夹并选中即可。
<note>
你可以从
<tabs group="A">
<tab title="OptiFine" group-key="of">

`视频设置` > `光影` > `光影包文件夹`
</tab>
<tab title="Iris" group-key="iris">

`视频设置` > `光影包` > `打开光影包文件夹`
</tab>
</tabs>
打开光影包文件夹。
</note>

<seealso>
    <category ref="related">
        <a href="troubleshootCommon.md" summary="这篇文档记录了一些与游戏相关或会产生影响的常见问题。">疑难解答 - 通用问题</a>
        <a href="videoSettings.md" summary="这篇文档列出了整个视频设置选项卡中容易出现问题的设置以及修改建议。">疑难解答 - 视频设置和相关显示问题</a>
        <a href="shaderpackLoading.md" summary="这篇文档列出了光影加载后可能出现的问题以及解决办法。">疑难解答 - 光影加载问题</a>
    </category>
    <category ref="advance">
        <a href="irisAsOf.md">Iris 下等效 OptiFine 功能的模组</a>
        <a href="shaderBasic.md" summary="着色器的基本概念和它们与 MC 的历史">着色器 基本概念和轶事</a>
    </category>
</seealso>
