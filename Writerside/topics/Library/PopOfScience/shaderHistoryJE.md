# Java 版光影 发展和轶事

<primary-label ref="basic"/>

<secondary-label ref="wip"/>
<secondary-label ref="je"/>
<secondary-label ref="shader"/>

<show-structure depth="2"/>

## 开端之前

### 修补这个世界

在古早的 Minecraft 中（**JE _Alpha_ v1.2.2** 以前），替换纹理是一件很困难的事。那时候还没有游戏内资源包甚至纹理包的支持，如果玩家想要替换纹理，只能手动替换游戏的 `.jar` 文件中的资源。

然而当时的游戏只支持由基础分辨率为 16x 的单个方块拼接而成，总大小为 256x 的纹理集。如果强行将其替换为更高清的纹理集就会出现错误乃至直接崩溃。

![截止纹理包出现前最后一个版本（a1.2.1_01）的 `terrain.png`](a1.2.1_01_terrain.png "截止纹理包出现前最后一个版本（a1.2.1_01）的terrain.png")

出于人们~~在互联网早年间特有的浪漫主义而产生的~~对高清纹理的追求 ~~（其实不能加载高清纹理是个漏洞）~~，_xau_ 于 2010 年 10 月 1 日发布了 MCPatcher，它的主要目的就是修补对高清纹理的兼容性，后来还逐渐扩展了连接纹理等其他特性，直到 **JE 1.8.8** 停更前由 _Kahr_ 进行维护。

> 高清纹理导致的问题直到 **JE _Beta_ 1.8** 才被修复。

### 快一点，再快一点

早期虽然游戏的内容较少，但硬件性能也普遍较弱。_出于人们对性能亘古不变的追求_，2011 年 1 月 11 日，_Scaevolus_ 的 FPS Boost 模组横空出世，它还有一个现如今我们看起来既熟悉又陌生名字：Opti**m**ine。

就像它的名字一样，Optimine 的主要目标就是 _**Opti**mise_ (优化) _**Mine**craft_ ，提供了很多针对渲染管线的优化。

Optimine 发布后不久，它被 _sp614x_ 接手，开始着手添加更多优化功能并吸收 MCPatcher 的功能来获取更好的兼容性和性能，同时它的名字也变成了我们所熟知的 Opti**F**ine。

随着 OptiFine 的更新，自 **JE 1.8** 起，它已经包含了 MCPatcher 的几乎所有功能，也标志着 MCPatcher 正式退出历史的舞台。

如今 OptiFine 的文件通常是 `<preview_>OptiFine_<Minecraft版本>_HD_U_<OptiFine版本>.jar` ，事实上在 OptiFine 刚刚发布时，除了 文件名中 `U` 所代表的 **Ultra** 以外，还有更多其他的版本。这是 [OptiFine 的 MinecraftForum 发布页](https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/1272953-optifine-hd-fps-boost-dynamic-lights-shaders-and) 上对以前存在的各个 OptiFine 版本所提供功能的列表：

<table>
<tr><td width="120">功能＼版本</td><td width="50">轻量 (Light)</td><td width="50">标准 (Standard)</td><td width="50">平滑 (Smooth)</td><td width="50">多核 (Multi-Core)</td><td width="50">抗锯齿 (<tooltip term="AA">AA</tooltip>)</td><td width="50">极致 (Ultra)</td></tr>
<tr><td>性能优化</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>高清纹理</td><td rowspan="9"/><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>高清字体</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>更好的草地和雪地</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>连接纹理</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>随机实体</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>扩展选项</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>消除顿卡</td><td rowspan="3"/><td>✓</td><td>✓</td><td rowspan="2"/><td>✓</td></tr>
<tr><td>多核 CPU 支持</td><td rowspan="2"/><td>✓</td><td>✓</td></tr>
<tr><td><tooltip term="AA">AA</tooltip> 和 <tooltip term="AF">AF</tooltip></td><td> </td><td>✓</td><td>✓</td></tr>
</table>

## 第一缕光

现代的原版 Minecraft 由于缺少光照层次，画面多少显得有些单调，而在早年间这种情况则更甚。由于那时游戏内容较少、场景单一、纹理和光照粗糙（平滑光照直到 2011 年 2 月 22 日的 **JE _Beta_ 1.3** 才加入），早期的 Minecraft 呈现出来一种很标准的梦核质感（甚至可以说在一定程度上催生了 Herobrine 的都市传说），玩家们也迫切地想要改变这一点。

终于，在 2011 年 1 月 7 日，_daxnitro_ 发布了 <tooltip term="glslShaderCore">GLSL 光影核心</tooltip>模组，它重新编写了一套可自定义管线，并定义了沿用至今的由资源包提供的法线和高光纹理。

> 有些玩家可能会好奇，为什么这些模组都在 2011 年初扎堆出现。这是因为那时候 Minecraft 刚刚结束 Alpha 进入 Beta 阶段，正在经历第一个上升期，并在 2013 年中附近达到顶峰。

自 **JE 1.8** 起，OptiFine 合并了光影核心的功能并继续开发，也首次推出了光影设置功能。由于其本身对原版进行了深度魔改，因而能提供很多相关变量，OptiFine 光影也由此开始快速发展。而光影核心则仍由 *karyonix* 针对基于其编写的老旧光影进行兼容性维护 <sup><b>1</b></sup> ，直到 **JE 1.12** 正式停更。
- **[1]** 事实上几乎所有光影都能无缝转换到 OptiFine 运行，但是基于 OptiFine 编写的光影则可能无法在光影核心上正常运行，兼容性维护只是让玩家和整合包作者在遇到 OptiFine 冲突时可以将光影核心作为备选方案。
-
{type="none"}

> 在这期间，OptiFine 还顺便合并了动态光源的功能，并将其与光影进行了兼容。

## 鱼和熊掌

由于 OptiFine 对原版游戏程序的深度魔改和逆向工程，一定程度上导致了 OptiFine 无法开源，也就间接导致了其在 Forge 上就常和许多模组冲突。除了那些因为程序冲突而直接崩溃的，更多的模组是由于自身管线并不规范，导致 OptiFine 光影无法兼容（特别是又正好赶上 **JE 1.6** 附近的第一次模组大爆发，OptiFine 和光影作者几乎不可能主动做逆向兼容）。

**JE 1.13** 扁平化之后，由于 OptiFine 与原版游戏的深度绑定，间接导致了其需要跟进重构，促使了在正式版发布后 OptiFine 前所未有的长达三个月的空窗期（从 **JE 1.13** 开发版算起正好一年）。而 Forge 由于其屎山代码过于复杂，更是直接跳过了 **JE 1.13** 和 **1.13.1**，直到 **JE 1.13.2** 发布后四个月的 2019 年 2 月才姗姗来迟。

忍受不了 Forge 这个屎山，_FabricMC_ 团队于 **JE 1.14** 推出了与其团队同名的模组加载器 **Fabric**。其将 API 和加载器独立，并且只提供最为基础的功能来达到快速更新和高性能的目的。而 OptiFine 从未主动兼容过 Fabric，玩家只能通过第三方模组 OptiFabric 作为桥梁将 OptiFine 在 Fabric 环境下加载，然而作为桥梁的 OptiFabric 兼容性更加灾难，导致 OptiFine 几乎和大半 Fabric 模组不兼容。

## 漫漫征程

在 **JE 1.16** 发布后不久，_出于人们对性能亘古不变的追求_，*CaffeineMC* 团队开发的 Fabric 独占的优化模组 Sodium 横空出世。由于 **JE 1.16** 发布的下界更新过于庞大，导致自 **JE 1.13** 以来的性能债开始变得越来越不可忽视。Sodium 的目的很简单，那就是爆改原版渲染来提升性能，也由于其暴力的优化方式，通常需要安装 Indium 来保证兼容性（特别是修改了管线和添加了渲染特性的模组）。而迫切地想要在 Fabric 上提供模组兼容性良好、原生的光影支持，由 _coderbot_ 发起，*IMS* 维护至今的 Iris 也几乎同时诞生。

由于 OptiFine 闭源，Iris 决定通过兼容特定光影来进而逐步还原 OptiFine 的光影功能，最早一批兼容的光影几乎都集中在 <tooltip term="SVS">SVS</tooltip> 和 BSL 及其魔改光影。早期的 Iris 在其内部捆绑特定版本的 Sodium 来保证性能。Iris 1.1.2 及之后的版本正式兼容并不再内置 Sodium，但是仍然需要后者才能运行。

如今，Iris 已经将重心放在了开发独占特性上，但是其对 OptiFine 光影功能的还原并不尽如人意，当修改 Iris 代码使其独立运行时，它的性能表现也难以言喻。Iris 兼容性优先的策略也让其和 OptiFine 对待管线冲突的方法不尽相同，然而过于激进的兼容策略反而产生了某些渲染缺陷，比如植物魔法的魔力池中魔力的着色器会被直接跳过，导致无法正确渲染。更有一些长期占据 Issue 的问题也没能得到及时解决（几何缓冲混合方式下溢到延迟处理，以及最近才被解决的 `block.properties` 中的宏直接被删除而不是解析并替换）。

2022 年 7 月，Iris 的 Forge 非官方移植版 Oculus 在 Modrinth 上架，其目的与 Iris 一致，为 Forge 模组提供更好的光影兼容性。

[//]: # (TODO: Yet_another_chapter01：国内光影的发展史与 SEUS 的魔改史)

[//]: # (TODO: Yet_another_chapter02：MC 和 Vulkan 的恩爱情仇 | NovaRender、Focal、Vulkanite、VulkanMod)

[//]: # (TODO: Yet_another_chapter03：Canvas 的故事)

## 附录：光影加载器圣经

关于光影加载器我有四不用。

第一，不用 Oculus，因为它*善*。别人都是要么给模组开发者史吃，要么给光影纹理开发者史吃，它干脆大发慈悲让所有人都雨露均沾。

第二，不用 Iris，因为它*孝*。从三年前号称作为 OptiFine 的高兼容性替代品在 Fabric 上接管所有光影，到现在这嫌代码侵权那嫌光影太旧，一边只管兼容模组不修 BUG，一边推出自己的独占接口吸引 OptiFine 光影的开发者过来，最后发现吔到了一大口史。

第三，不用 Canvas，因为它*贞*。Canvas 的初心是给模组提供渲染 API，在上面开发光影 = NTR，要被浸猪笼后烧死。

第四，不用 OptiFine，因为它*忠*。一直以来，高清修复对内都为光影纹理提供了一个稳定的开发环境，对外从来不在乎模组兼容性，对自己人不可谓不忠诚。

<seealso>
  <category ref="related">
    <a href="shaderBasic.md" summary=""/>
  </category>
  <category ref="advance">
    <a href="shaderHistoryBE.md" summary=""/>
  </category>
</seealso>
