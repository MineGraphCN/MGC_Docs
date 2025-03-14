# 视频设置和相关显示问题

<primary-label ref="manual"/>

<secondary-label ref="wip"/>

<secondary-label ref="je"/>
<secondary-label ref="of"/>
<secondary-label ref="shader"/>
<secondary-label ref="resource"/>

<show-structure for="chapter,tab"/>

[//]: # (TODO: 列出每个设置的具体画面变化)

<tldr>

这篇文档列出了整个视频设置选项卡中容易出现问题的设置以及修改建议。

选项卡结构以 OptiFine 为准。
</tldr>

图像品质
: 这个选项是统一设置，它影响 [`细节`](#detail){summary=""} 选项卡中所有设置为 `默认` 的图形品质，但当它们更改时，会覆盖掉此选项。
> 确保此选项为 `高品质` 。
> 
{style="note"}

    > *`极佳！`* 与 OptiFine 光影不兼容。
    >
    {style="warning"}

亮度
: 控制原版光照的亮度。
> 设置为一个正常的值，不要用模组或手动编辑 `options.txt` 将其设置为一个极端的值。
> 
{style="note"}
> 大多数光影并不受这个值的影响，但是可能破坏某些光影的相关效果和功能。

最大帧率
: 大多数现代光影都使用了时间性效果，如 TAA。帧率锁在过低的值上可能导致拖影。
> 设置为 `无限制` 以保证最佳质量。
> 
{style="note"}

    > 如果你的帧率接近显示器刷新率，并且出现了**明显的撕裂**，那么可以尝试调整为 `垂直同步` （将滑块拉至最左侧）。
    > - 未启用垂直同步：
    > ```plantuml
    > @startuml
    > analog "显示纵场" as Mo
    > concise "GPU（每帧）" as GPU
    > scale 1000 as 100 pixels
    > 
    > @Mo
    > 999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +1000 is 0
    > Mo@1000 <-> @2000 : 显示提交的上一帧
    > 
    > @GPU
    > 0 is A
    > +1000 is B
    > +1000 is C
    > +600 is D
    > +1400 is E
    > +1500 is 终止
    > GPU@2000 <-> @2600 : 过早完成绘制
    > GPU@4000 <-> @5500 : 过晚完成绘制
    > 
    > @1000
    > GPU -> Mo : 向显示器提交 A 帧
    > 
    > @2600
    > GPU -> Mo : 向显示器提前提交 C 帧\n覆盖了正在显示的 B 帧下半屏
    > 
    > @5000
    > GPU -> Mo : E 帧此时还未绘制完成\n显示器将重复显示 D 帧
    >
    > @5500
    > GPU -> Mo : 向显示器提交 E 帧\n覆盖了重复显示的 D 帧下半屏
    > 
    > @enduml
    > ```
    > - 启用垂直同步：
    > ```plantuml
    > @startuml
    > analog "显示纵场" as Mo
    > concise "GPU（每帧）" as GPU
    > scale 1000 as 100 pixels
    > 
    > @Mo
    > 999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +999 is 0
    > +1 is 1080
    > +1000 is 0
    > Mo@1000 <-> @2000 : 显示提交的上一帧
    > 
    > @GPU
    > 0 is A
    > +1000 is B
    > +1000 is C
    > +600 is 等待
    > +400 is D
    > +1000 is E
    > +1500 is 等待
    > +500 is 终止
    > GPU@2600 <-> @3000 : 停止绘制，等待显示器垂直同步信号
    > GPU@5500 <-> @6000 : 等待下一个垂直同步信号，导致了 1 帧的滞后
    > 
    > @1000
    > GPU -> Mo : 向显示器提交 A 帧
    > 
    > @2600
    > GPU -> Mo : C 帧绘制完成后等待提交\n直到 C 帧提交之后才会开始绘制 D 帧
    > 
    > @5000
    > GPU -> Mo : E 帧此时还未绘制完成\n显示器将会重复显示 D 帧
    >
    > @enduml
    > ```
    > > 这可能导致画面显示滞后，当帧率持续低于显示器刷新率时，会导致帧率被锁在刷新率的 1/2 甚至 1/4 上。
    > >
    > {style="note"}
    >
    {style="tip"}

## 子选项卡 {id="子选项卡"}

<tabs group="videoSettings">
<tab title="品质" id="quality" group-key="quality">

Mipmap 级别
: 决定远处纹理的过滤分级数量，有时会在 **JE 1.19** 以上的 OptiFine 中破坏光影包。
- 比如所有方块的面都被从对角线切割成了两个三角形，并且有一半的三角形被对角线的平行线填充，或者方块边缘出现细线。  
- MipMap 还会破坏一些光影的自发光渲染。一旦光影支持自发光，视差所有凹下去的地方边缘都会异常发光。
> 推荐仅在光影要求（比如 Complementary 打开光影内置各向异性过滤时）开启或使用高清纹理且光影没有 [TAA](shaderTech.md#taa){summary=""} 时才设置为 `开` 。如果你遇到了这些问题，请把它拉至 `关` 。
>
{style="note"}

    ![贴图显示错误](mipmap.png "问题截图1 - 贴图显示错误")
    ![方块边缘的横线](line.png "问题截图2 - 方块边缘的横线")

Mipmap 类型
: 决定远处纹理的过滤方法，越高的值在各级过渡之间越平滑。只在 Mipmap 级别不为 `关` 的时候有效。
> 如果需要使用 Mipmap 则设置为 `三线性` 。

各向异性过滤
: 有时会破坏着色器的纹理采样（特别是体素和 3D 噪声）。
> 如果你看见天空有奇怪的线条或撕裂，请把其设置为 `关` 。
>
{style="note"}

    ![云层被撕裂](cloud.png "云层被撕裂")
    > 同时注意将显卡驱动控制面板的该选项设置为 `应用程序控制的` 。  
    > ![在 NVIDIA 控制面板中切换各向异性过滤设置](nvidia_af_by_programs.png "在 Nvidia 控制面板中切换各向异性过滤设置")  
    > 或者直接将全局设置改为 `由 3D 应用程序决定` 。  
    > ![在 NVIDIA 控制面板中更改图像设置](nvidia_all_by_programs.png "在 NVIDIA 控制面板中更改图像设置")
    > 
    {style="note"}

连接纹理
: 当资源包兼容时会让相邻方块产生相互关联的纹理，可能会破坏视差。
> 一些资源包要求启用该选项（如 Patrix）。
> 
{style="note"}

自然纹理
: 它会随机旋转某些方块的表面纹理，可能会破坏一些老光影上的视差。
> 如果你有这方面的问题，请将其 `关` 。
> 
{style="note"}

自定义天空
: 使用 OptiFine 自定义天空的资源包与大多数修改了天空的光影不兼容。
> 在使用光影时，请将其设置为 `关` 。
> 
{style="note"}

</tab>
<tab title="细节" id="detail" group-key="detail">

云
: 原版云总是不能与光影包兼容，特别是在旧版本中。
> 如果你看到疑似原版云在天空表现违和，请将其设置为 `关` 。
>
{style="note"}

    ![原版云在光影中被不正确地渲染](cloud-vanilla.png "原版云在光影中被不正确地渲染")

    > 你也可以在你所使用光影的 `shaders.properties` 中加入
    > ```Ini
    > clouds = off
    > ```
    > 来强制禁用特定光影的原版云

树
: `流畅` **会导致树叶的透明度被禁用，从而无法正常裁切**。这对使用自定义模型的资源包影响尤为严重。
> 确保其为 `高品质` 。
> 
{style="note"}

    ![树叶的裁切被禁用](leaves.png "树叶的裁切被禁用")
    > `智能` 模式只显示最外面一层的树叶（就像玻璃一样），这会在有些时候导致树非常难看。

天空
: 控制是否启用原版资源包天空贴图。
> 推荐为 `开` 。
> 
{style="note"}

    > 有修改了天空效果的光影通常不受该选项的影响。

替选方块
: 使用资源包中定义的随机纹理进行替换来减少重复感。这有时会破坏视差，使贴图产生**拉伸的奇怪效果**，同时聊天栏报告代码 `1281` 的 OpenGL 渲染错误。
> 如果你有这方面的问题，请将其设置为 `关` 。
>
{style="note"}

    ![方块表面纹理在经过视差之后被拉伸](draw.png "方块表面纹理在经过视差之后被拉伸")  

    > 在一些带有 CTM 贴图（连接纹理贴图）的资源包中，此选项**必须打开**以获得最佳效果。
    >
    {style="note"}

</tab>
<tab title="性能" id="performance" group-key="performance">

区域渲染
: 这个选项长期未维护，可能在长渲染距离下降低性能。
> 推荐为 `关` 。
> 
{style="note"}

平滑 FPS
: 这个选项通过降低帧率来提升 FPS 稳定性。
> 若游戏出现顿卡，可以尝试将此选项设置为 `开` 。
> 
> 若希望游戏以最大帧率运行，则设置为 `关` 。
> 
{style="note"}

快速渲染
: 这有时会以不可预知的方式破坏光影包。
> 如果你有这方面的问题，请将其设置为 `关` 。
> 
{style="note"}

</tab>
<tab title="光影" id="shader" group-key="shader">

抗锯齿
: 会在光影渲染结束后额外添加一层抗锯齿效果来平滑画面。
> 如果光影提供了抗锯齿效果，或者观感上方块边缘已经没有锯齿，则将其设置为 `关` 。
> 
{style="note"}
> 内置抗锯齿使用的是 FXAA，其效果非常有限，而且可能导致实体名称等对象出现渲染问题。

法线贴图／高光贴图
: 禁用它们可能会让光影产生未知错误。
> 确保其设置为 `开` 。
> 
{style="note"}

渲染精细度
: 控制游戏的内部渲染分辨率，与 GUI、窗口大小和屏幕分辨率大小独立。
- 高于 1x 的设置会放大内部分辨率并进行超级采样，这可以用作 SSAA 抗锯齿。但是可能造成性能问题。
- 低于 1x 的设置会导致画面模糊，但是可以提升性能。
> 这可能会破坏使用自定义缓冲区大小的光影，如果你不确定，最好将其设置为 `1x`。
> 
{style="note"}

阴影精细度
: 控制阴影贴图的分辨率。
> 这可能会破坏在阴影纹理上进行几何处理的光影，特别是各种光线追踪光影。最好将其设置为 `1x`。
> 
{style="note"}
> 大多数现代光影在其光影设置中内置了阴影分辨率选项，所以除非万不得已，不要更改此选项。

经典光效
: 经典光效会强制在各种表面上应用原版光照和环境光遮蔽。大多数光影通常会提供更好的光照效果，通常也会在配置中禁用该选项。  
> - 如果设置为 `默认` ，在切换各种光影时可能会由于不同光影对该选项的设置不同导致**资源包被不断重载**。
> - 如果你不使用 `（内置）` 光影进行游玩（便于使用高渲染精细度和内置 FXAA 抗锯齿），可以直接将其设置为 `关` 。
>   - 如果此时你需要使用原版光影，可以直接将光影切换至 `关闭` ，并将 `图像品质` 切换为 *`极佳！`* 。

</tab>
<tab title="Quick Info" id="quick_info" group-key="quick_info">

</tab>
</tabs>

<tabs group="videoSettings">
<tab title="品质" group-key="quality"/>
<tab title="细节" group-key="detail"/>
<tab title="性能" group-key="performance"/>
<tab title="光影" group-key="shader"/>
<tab title="Quick Info" group-key="quick_info"/>
</tabs>
