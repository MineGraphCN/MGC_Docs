# 术语表

这篇文档列出了整个图书馆中可能会出现的术语，这些术语或常见或罕见，我们会尽可能多地收录。在遇到不能理解的术语时，可以到此文档中进行查阅。

如果你有更多想要提供的术语，或者发现了术语中的疏漏，可以在 [GitHub](https://github.com/MineGraphCN/MGC_Docs/issues) 上为我们提交 Issue 和 Pull Request。

<show-structure depth="3"/>

## 约定 {id="约定"}

**粗体**
: 表示**强调**或**关键词**。

*斜体*
: 表示*引用*或*人／团队名*。

[跳转](#约定){summary=""}
: 作为 [跳转链接](#约定 "跳转链接描述") ，跳转到文档内其他位置，当链接后跟有 <a href="https://b23.tv/BV1GJ411x7h7">[</a>] 时，表示跳转站外链接。将鼠标停留在其上方会有和缩写一样的提示。偶尔会替代掉**粗体**。

<sup>角标</sup>
: 表示这只在对应环境中有效。

<tooltip term="缩写">缩写</tooltip>
: 将鼠标停留在其上或点击 <sup>触屏设备</sup> 可以查看术语的全称。

`代码`
: 表示这是程序运行时显示/日志/代码内容，或计算机行为。  
`代码块内容` 的约定：
    - `<尖括号>` ：由尖括号括起来的内容表示在这个区域内应该填写的内容。例：`<文件名>.jpg` ，其中 `<文件名>` 部分可以使用任意**符合尖括号内定义**的内容替换，例：`图片.jpg` 。
        - 在替换时应当将尖括号**一同替换**。
    - `[方括号]` ：由方括号括起来的内容是一个可填的数字，例：`vec[N]` 可以替换为 `vec3` 。
        - 在数组中，方括号不需要被一同替换，此时，例：`float[a][b]` 可以替换为 `float[1][3]` 。
        - 我们约定**替换**方括号的字母使用**大写**，**不替换**方括号的字母使用**小写**。
    - `函数()` ：函数分为原型和调用两种情况。
        - 当函数和参数含有 [变量类型](#变量类型和修饰符) 时，表示这是函数的**原型**。例：`float floor(float num)` 。
        - 当函数内参数不含*变量类型*且含有 `<尖括号>` 时，表示我们**调用函数**时会在这个函数内填何种参数。例：`max(<numA>, <numB>)` 。
            - 有些函数有多个可以传入的变量类型，此时会在变量类型处使用 `<尖括号>` ，这种情况下仍然表示为函数的原型。例： `min(<int | float> numA, <int | float> numB)` 。

<shortcut>按键</shortcut>
: 表示这是键盘或者鼠标的按键
- <shortcut>A</shortcut><shortcut>B</shortcut> 表示同时按下 A 和 B
- <shortcut>A</shortcut>, <shortcut>B</shortcut> 表示按下 A 并松开后再按下 B
- <shortcut>^A</shortcut> 表示按住 A

## 游戏相关 {id="游戏相关"}

<deflist>
<def id="je">
<title><tooltip term="JE">JE</tooltip></title>
Java 版游戏，在本文档中，也可以表示只能在 Java 版渲染模组下有效。
<tip><b>原主机版</b>使用 C++ 编写，但却基于 JE，也称之为 <b><tooltip term="CE">CE</tooltip></b>。</tip>
</def>

<def id="be">
<title><tooltip term="BE">BE</tooltip></title>
基岩版游戏，这其中也包含了<b>原 <tooltip term="PE">PE</tooltip></b>。
<tip>现在的主机版也属于 BE。</tip>
</def>

<def id="ne">
<title><tooltip term="NE">NE</tooltip></title>
由<b>网易代理</b>的中国版游戏，也称<b>网易版</b>，表示为网易版独占，例：防沉迷 <sup>NE</sup>，延迟着色 API <sup>BE(NE)</sup>。
</def>
</deflist>

> 这些版本主要用作角标，**自此开始无特殊说明的名词均以 Java 版为准。**
> 
{style="note"}

### 模组和文件包体 {id="模组和文件包体"}

<deflist>

<def title="模组／模组加载器" id="模组">
    <b>MOD</b> / <b>MOD Loader</b>，由<b>第三方</b>提供的接口在原版游戏基础上运行由<b>社区玩家编写</b>的扩展内容，目前主流的加载器有 <b>Forge</b> 和 <b>Fabric</b> ，此外还有 Fabric 的分支版本 <b>Quilt</b> 以及自 <b>JE 1.12.2</b> 停止更新的 <b>LiteLoader</b> ，现在还有从 Forge 独立出来的 <b>NeoForge</b> ，它的目标是做一个可以通用的加载器。
    <list>
        <li>Fabric 的接口（API）和加载器本身是独立的，而其他加载器均内置了接口。</li>
    </list>
    <tip>早期的模组由于没有加载器，需要将文件全部覆盖入游戏源文件，因此如果出现两个模组同时需要覆盖同一文件时，这两个模组的兼容性就崩塌了。加载器和接口的出现缓解了这一问题。</tip>
    <tip>关于更通用的接口定义，见 <a anchor="应用程序接口" summary="应用程序接口提供特定的方法，让第三方代码通过它们修改程序。">应用程序接口</a> 。</tip>
</def>
<def title="资源包" id="资源包">

<b>Resource Pack</b>，即通俗所说的材质包，详见 [资源包 基本概念](resourcepackBasic.md#资源包 "JE 1.6.1 及以后使用的用于自定义游戏的纹理、声音、模型，乃至渲染的文件包。") 。

</def>
<def title="光影包" id="光影包">

<b>Shader Pack</b>，由一个或数个 [着色器](#着色器 "着色器定义了如何处理传入的三角形，以及向何处输出何种信息。") 组成的一套流水线工程，用以渲染画面。

</def>
<def title="整合包" id="整合包">
<b>Mod Pack</b>，由多个模组整合而成的文件包。
<list>
    <li>国内以前的整合包通常是<b>懒人包</b>，即：将<b>游戏本体</b>、<b>启动器</b>、<b>模组</b>以及其他<b>配置和资源文件</b>打包，玩家解压之后即可启动游玩。</li>
    <li>
        国外标准的整合包是 <b>CurseForge 格式</b>，这种整合包只包含了需要的模组和配置信息，需要在启动器上<b>在线安装</b>好后才能游玩，这通常<b>需要正版账户</b>。顾名思义，其由 <b>CurseForge</b> 发起建立，是如今很多启动器都支持的格式。由启动器在下载安装模组接口、模组和其他外围资源时同时下载游戏本体和资源库。
        <list>
            <li>国内的启动器如 <b>HMCL</b>、<b>PCL 2</b>、<b>BakaXL</b> 等启动器也均跟进支持了此格式。</li>
        </list>
        <tip>曾经还流行过 <b>MultiMC 格式</b>，由 MultiMC 启动器发起建立。但现在 MultiMC 不再兼容 CurseForge 格式。</tip>
    </li>
</list>
</def>
<def title="数据包" id="数据包">

<b>Data Pack</b>，<b>JE 1.13</b> 加入的<b>由官方支持</b>的可以<b>修改世界内数据</b>的文件包，自 <b>JE 1.16-pre1</b> 起可以在<b>创建世界之前</b>加载数据包。

</def>
</deflist>

### 渲染模组和引擎 {id="渲染模组和引擎"}

<deflist>
<def id="blaze3d">
    <title>Blaze3D <sup>JE</sup></title>
    Java 版现用的渲染引擎。
</def>

<def id="renderDragon">
    <title>Render Dragon <sup>BE</sup></title>
    <b>渲染龙</b>，基岩版现用的渲染引擎。
    <tip>它的名字来源于<i>末影龙</i>（Ender Dragon）和<i>渲染</i>（Render）。</tip>
</def>

<def id="glslShaderCore">
<title><tooltip term="GLSL">GLSL</tooltip> Shader Core</title>
    <b>光影核心</b>模组，<b>最早</b>的 Java 版光影模组。
    <list>
    <li>
        在 OptiFine 集成后其更新频率明显下降，不再提供新功能支持。
    </li>
    <li>
        作为一个用于运行老旧光影的备选项，光影核心已于 <b>JE 1.12.2</b> 停止更新。
    </li>
    </list>
</def>

<def title="OptiFine" id="optifine">
    <b>高清修复</b>，简称 <b>OF</b>，老牌 Java 版优化模组。作者为 <i>sp614x</i>。
    <list>
        <li>最早是提供优化并合并了 MCPatcher 的更大纹理分辨率支持的模组，这也是中文名被翻译为高清修复的原因。</li>
        <li>在 <b>JE 1.8</b> 之后集成了 GLSL Shader Core 的功能，开始提供光影支持。</li>
        <li>在某一版本中整合了<b>动态光源</b>模组，让世界中的实体光源可用于照明。</li>
    </list>
</def>

<def id="sodium">
    <title>Sodium <sup>Fabric</sup></title>
    意为<b>钠</b>，伴随 Fabric 出现的新兴优化模组，旨在优化 <b>JE 1.14</b> 后的游戏性能。
    <tip>伴随钠而出现的许多优化模组开始仿效其使用化学元素来命名，被玩家们称为元素周期表／元素全家桶。</tip>
</def>

<def id="iris">
<title>Iris <sup>Fabric</sup></title>
    伴随 Fabric 出现的新兴光影模组。由于 OptiFine 闭源导致<b>很多模组无法兼容</b>，而很多玩家想要在整合包中运行光影，Iris 由此而生。
    <list>
        <li>
            如今 Iris 已经在着手支持独占功能，并且与 Sodium 深度绑定。
            <tip>然而 Sodium 本身的兼容性并不好，通常需要依靠额外的模组如 <b>Indium</b>（铟）来确保其兼容性。</tip>
        </li>
    </list>
</def>

<def id="oculus">
    <title>Oculus <sup>Forge</sup></title>
    Iris 的 Forge 分支，旨在提供与 Iris 一样优秀的模组兼容性。

> 然而事实上…
</def>

<def id="canvas">
    <title>Canvas <sup>Fabric</sup></title>
    另一新兴渲染模组，完全独立于 OptiFine 之外，通过资源包进行加载。具有极强的兼容性和很多独有特性。
</def>

<def id="blaze4d">
    <title>Blaze4D <sup>Fabric</sup></title>
    使用 Vulkan 的实验性渲染引擎。
    <list>
        <li>
            与 OptiFine 或 Sodium 不同，它的目的不是优化，但是也包含了一定的性能改进。
            <list>
                <li>
                其唯一真正制作的优化工作是 <code>baked-entity-models</code>（烘焙实体模型），并将其提交给了 Sodium 以供所有人使用。</li>
            </list>
        </li>
        <li>未来将允许开发者将 <a anchor="dlss" summary="由英伟达开发的一种升采样技术。通过降低分辨率并调用显卡的张量核心来猜测原始分辨率下该处像素的内容。">DLSS</a> 或 <a anchor="fsr" summary="由 AMD 开发的一种升采样技术。相比较 DLSS 来说更为常规，但效果要比其他传统升采样方法好。">FSR</a> 乃至<b>硬件加速光线追踪</b>引入到光影开发中，但是目前来说仍旧遥遥无期。</li>
    </list>
    <tip>它的名字来源于目前 Java 版所使用的渲染引擎 <i>Blaze3D</i>。</tip>
</def>

<def id="focal">
    <title>Focal Engine <sup>Forge / Fabric</sup></title>
    由 <i>Continuum</i> 研发的渲染模组。
    <list>
        <li>目前是 OptiFine 的增强模组，主要用于他们自己的光影包 <b>Continuum 2.1 | RT</b> 的代码支持、加密和联网验证，同时支持 <b>Stratum</b> 的安装。</li>
        <li>更长远的目标是独立于 OptiFine 在 Vulkan 上实现光影渲染，给其他作者提供加密和联网验证及其他支持，并引入<b>硬件加速光线追踪</b>。</li>
    </list>
    <tip>它有一个前身名为 <b>Nova Render</b>。由于核心开发人员的离开，这个模组独立了出来，但是很快没了下文。</tip>
</def>

<def id="advancedShader">
<title>Advanced Shader <sup>Forge</sup></title>
    是一个 OptiFine 辅助模组，旨在让 <b>JE 1.12.2</b> 兼容更高版本的光影。
</def>
</deflist>

## 计算机相关 {id="计算机相关"}
### 数学基础 {id="数学基础"}

<deflist>
<def title="标量" id="标量">
    也称数量，一个数字就是一个标量。
</def>

<def title="区间" id="区间">
    即取值范围
    <list>
        <li>x∈[a, b] 表示 a ≤ x ≤ b；</li>
        <li>x∈(a, b) 表示 a &lt; x &lt; b；</li>
        <li>x∈[a, b) 表示 a ≤ x &lt; b。</li>
    </list>
</def>

<def title="向量" id="向量">
    也称矢量，多个标量构成的<b>有向</b>的量。
    <tip>在 <a anchor="glsl" summary="OpenGL 的着色器所使用的语言，语法类似 C。">GLSL</a> 中，我们使用形如 <code>vec3(1.0, 0.2, 3.5)</code> 的方式来表示向量。</tip>
</def>

<def title="模长" id="模长">
    向量的长度。
</def>

<def title="单位向量" id="单位向量">
    模长为 1 的向量。
</def>

<def title="归一化" id="归一化">
    <list>
        <li>对于标量：将特定范围内的数据映射到 [0, 1] 的过程。</li>
        <li>对于向量：将一个<b>非零</b>向量转换为单位向量的过程。</li>
    </list>
</def>

<def title="点乘" id="点乘">
    两个向量运算为一个标量，得到的值称为内积。
    <code-block lang="tex">
        \vec{\mathbf{a}} \cdot \vec{\mathbf{b}} = n
    </code-block>
    <tip>算法详见 <a anchor="矩阵乘法">矩阵乘法</a> 。</tip>
</def>

<def title="叉乘" id="叉乘">
    向量之间的<b>有序</b>乘法，得到的向量称为外积。
    <code-block lang="tex">
        \vec{\mathbf{a}} \times \vec{\mathbf{b}} = \vec{\mathbf{c}} ,
        |\vec{\mathbf{c}}| = |\vec{\mathbf{a}}| |\vec{\mathbf{b}}| \sin(\theta) ,
        \vec{\mathbf{c}} \bot \vec{\mathbf{a}} , \vec{\mathbf{c}} \bot \vec{\mathbf{b}}
    </code-block>
    其中 <i>θ</i> 为向量 <b><i>a</i></b>、<b><i>b</i></b> 的夹角，方向遵循<b>右手螺旋定则</b>。
</def>

<def title="向量的普通四则运算" id="向量的普通四则运算">
将两个<b>同维</b>向量的对应分量或一个向量的所有分量与一个标量进行四则运算。
<code-block lang="tex">
    (a, b, c)
    \begin{bmatrix}
    + \\
    - \\
    \times \\
    \div
    \end{bmatrix}
    \left[ \begin{array}{c|c}
    (x, y, z) & p
    \end{array} \right]
    = \left[ \begin{array}{c | c}
    (a + x, b + y, c + z) & (a + p, b + p, c + p) \\
    (a - x, b - y, c - z) & (a - p, b - p, c - p) \\
    (a \times x, b \times y, c \times z) & (a \times p, b \times p, c \times p) \\
    (a \div x, b \div y, c \div z) & (a \div p, b \div p, c \div p)
    \end{array} \right]
</code-block>
</def>

<def title="矩阵乘法" id="矩阵乘法">
    <p>矩阵乘法是矩阵间的<b>有序</b>乘法。</p>
    矩阵乘法中<b>左侧</b>矩阵的<b>列</b>必须等于<b>右侧</b>矩阵的<b>行</b>，做积所得矩阵为<b>右侧</b>矩阵的<b>列</b>和<b>左侧</b>矩阵的<b>行</b>，即：一个 A 行 C 列的矩阵与一个 C 行 B 列矩阵相乘，所得矩阵为 A 行 B 列。  
    当向量与矩阵做积时，应该将向量视作一个 1 列的矩阵：
    <code-block lang="tex">
    \begin{bmatrix}
    a & b & c \\
    d & e & f
    \end{bmatrix}
    (x, y, z)^T
    = \begin{bmatrix}
    a & b & c \\
    d & e & f
    \end{bmatrix}
    \begin{pmatrix}
    x \\
    y \\
    z
    \end{pmatrix}
    = \begin{pmatrix}
    ax + by + cz = u \\
    dx + ey + fz = v
    \end{pmatrix}
    = (u, v)^T
    </code-block>
    当向量与向量进行点乘时，实际上就是进行了矩阵乘法：
    <code-block lang="tex">
    (a, b, c) \cdot (x, y, z)^T =
    \begin{pmatrix}
    a & b & c
    \end{pmatrix}
    \begin{pmatrix}
    x \\ y \\ z
    \end{pmatrix}
    = ax+by+cz
    </code-block>
</def>
</deflist>

### 计算机基础 {id="计算机基础"}

<deflist>

<def title="像素" id="像素">

**Pixel**，简称 **Px**，二维位图的最小显示单位。
<tip>在实际渲染或计算中，有<b><tooltip term="subpx">子像素</tooltip></b>的概念，因此像素仅为位图的最小显示单位。</tip>
</def>

<def title="体素" id="体素">

**Voxel**，简称 **Vx**，对应像素的定义，作为一种三维图形的表示方法，在此类空间中定义的三维图形，体素是最小坐标单位。
</def>

<def title="位图" id="位图">
    也称<b>标量图</b>，最小单位为像素的图像。
    <tip>计算机中存储的图片大多是位图，如 <code>.jpg</code> 、 <code>.png</code> 、 <code>.bmp</code> 等。</tip>
</def>

<def title="矢量图" id="矢量图">
    由顶点位置和连接顶点的线段信息所组成的图像。<code>.svg</code> 就是其中一种矢量图格式。
</def>

<def title="分辨率" id="分辨率">
    <p>分辨率是表征位图大小的参数。</p>
    视频文件和显示器中常用的分辨率 <b>1080p</b> 意为<b>纵向 1080 <tooltip term="px">px</tooltip></b>、<b>逐行扫描</b>。
    <list>
        <li><b>p</b> 意为<b>逐行扫描</b>，而 <b>i</b> 则为<b>隔行扫描</b>。
            <list>
                <li>扫描：即从上至下显示画面的过程，这个名词沿用自 <tooltip term="CRT">CRT</tooltip> 显示器时代的画面显示方式。从左至右一排像素为一条扫描线。
                    <list>
                        <li>逐行扫描为从上至下依次显示每排像素，也是现代显示器和视频文件大多数情况下的显示方式。</li>
                        <li>
                            隔行扫描以两条扫描线为一组，上面一条称<b>上场</b> ，下面一条称<b>下场</b> 。上场和下场依次更新，每一轮画面显示只会更新一个场。
                            <tip>这种方法可以减轻 GPU 压力，同时提高画面流畅度，然而其所带来的伪影也较为严重。</tip>
                        </li>
                    </list>
                </li>
            </list>
        </li>
        <li>伴随此种简写的分辨率出现的还常有<b>画面比例</b>（画幅）。
            <list>
                <li>
                    你可以使用这个公式来计算<b>横向分辨率</b>：
                    <code-block lang="tex"> 纵向分辨率 \times 画面比例 = 横向分辨率 </code-block>
                </li>
            </list>
        </li>
        <li>
            <i>2k</i>、<i>4k</i> 等的定义：
            <list>
                <li>
                    由标准情况下的横向分辨率决定，k 的换算公式为：
                    <code-block lang="tex"> 1\text{k} = 1024</code-block>
                </li>
                <li>
                    标准的 4k 分辨率为 4096 * 2160 ，在 16:9 下为 3840 * 2160 ，由此我们可以知道
                    <code-block lang="tex"> N\text{k} = \frac{横向分辨率\text{(16:9)}}{960} = \frac{纵向分辨率}{540} </code-block>
                </li>
                <li>
                    从这个公式还可以知道，所谓 2k 指的实际上是 2048 * 1080，而 2560 * 1440 是 2.67k 。
                    <note>这在大多数时候是适用的，然而对于超宽屏和方形屏，我们通常直接将其横向分辨率视为 Nk。</note>
                </li>
            </list>
        </li>
    </list>
    <tip>关于资源包分辨率，参阅：<a href="resourcepackBasic.md#资源包分辨率">资源包 基本概念 - 资源包分辨率</a> 。</tip>
</def>

<def title="离散和连续" id="离散和连续">
    <p>像素和体素都是一种离散的记录方式，它们依照特定的分辨率进行记录。通常使用整数值来表示像素和体素坐标。</p>  
    与之对应的，矢量图是一种以浮点精度为最大精度记录信息的方式。通常使用浮点值来表示顶点坐标。
</def>

<def title="颜色通道" id="颜色通道">
    颜色通道的数量表示色彩类型的数量，显示器的颜色通道为 RGB，也就是光学三原色<b>红绿蓝</b>。在此基础上再加上 A 通道，也就是<b>不透明度</b>，就构成了我们常用的 <code>RGBA格式</code> 。在没有特殊说明的情况下，我们都以 <code>RGBA格式</code> 为准。
</def>

<def id="应用程序接口">
<title><tooltip term="API">API</tooltip></title>

**应用程序接口**，其提供特定的方法，让第三方代码通过它们修改程序。
<tip>具象化来说，这就好比给手机（游戏本体）扩展存储（想要达到的光影效果），需要 SD 卡（第三方代码），并且手机需要有 SD 卡槽（接口）才能插入。</tip>
</def>
</deflist>

#### 编程类 {id="编程类"}

<deflist>

<def title="作用域" id="作用域">

表示程序和变量可以被调用的范围，在下面这段代码中

```C
    [...];
    int a = 0;
    
    float function() {
      int b = 0;
      a = 1; // 可行
      [...];
    }
    
    void main() {
      a = 2; // 可行
      b = 1; // 不可行
      [...];
    }
```
{collapsible="true" collapsed-title="查看代码"}

`a` 可以被 `function()` 和 `main()` 调用，而 `b` 只能在 `function()` 内被调用。

当作用域在最外层（位置形如 `a` ）时，我们称其为**全局变量**；与之相对的（位置形如 `b` ），我们称其为**局部变量**。
</def>

<def title="变量类型和修饰符" id="变量类型和修饰符">

在许多语言中，我们都需要在定义一个变量的时候同时定义它的类型。如 `int a` 前面的 `int` 就是变量 `a` 的变量类型，这决定了计算机如何处理它们。
- 这里列出了一些 **C** 中常见的变量类型（不包含扩展）：
    - `int` ：整数。
        - `long`：长整数，长度是 `int` 的两倍。
            - `long` 和 `long int` 表示一个长整型，`long long` 和 `long long int` 表示一个超长整型。
        - `short`：短整数，长度是 `int` 的一半。
    - `float` ：浮点数，计算机中可以表示小数的类型。
        - `double` ：双精度浮点，长度是 `float` 的两倍。
        - `half` ：半精度浮点，长度是 `float` 的一半。
    - `char` ：单个字符。

除了数据类型以外，我们还可能会用到一些修饰符，它们可以用来对控制变量类型或改变变量的行为，例如 `const int b;`。

- 这里列出了一些 **C** 中常见的修饰符：
    - `auto` ：默认的变量修饰符，不指定存放位置，不指定生命周期。**通常省略**。
    - `static`
        - 修饰函数时：表示该函数只能在此文件内被调用。
        - 修饰 [全局变量](#作用域 "变量可以在整个程序的任意位置被调用") 时：表示该变量只在此文件内有效。
        - 修饰 [局部变量](#作用域 "变量只能在代码块内被调用") 时：表示退出作用域之后变量不会被销毁，重新进入作用域时变量也不会被初始化（除非在声明时进行了赋值）。
    - `register` ：表示尝试把该变量放入 CPU 寄存器而不是内存中，以获得更快的访问速度，特别是那些经常会访问的变量。
    - `const` ：表示该变量值不能被修改，此时我们可以把其视为**恒量**。

</def>

<def title="指针" id="指针">

在变量类型后紧跟 `*` 表示声明一个指针类型的变量，它的值是对应变量类型的**内存地址**。
- 要对它进行进行赋值，我们需要使用**取地址符** `&` 紧跟一个对应类型的变量。
- 要想调用它所指向的值，我们要在调用此变量时在前面加上**取值符** `*` 。

</def>

<def title="数组" id="数组">

许多同类型数据的集合。通常在数据类型后加 `[a]` 来定义。`[]`的数量代表了数组的**维度**。
- 我们使用形如 `int a[][][]...[]` 来声明一个数组变量，使用 `int[][][]...[]` 来直接表示数组类型。
- 声明出来的数组变量本身是一个**指针**，我们可以使用形如 `a[0]` 来访问数组 `a[]` 中第一维上的第一个元素。

</def>
</deflist>

<procedure title="代码示例" collapsible="true" default-state="collapsed">

在这个示例中，我们使用 **C** 对前面的说明进行了实践，  
为了降低阅读门槛，我们省略了除变量相关外的具体代码，并以 `[...]` 表示：

```c
[...];
float glva = 0; // 声明一个全局的浮点型变量

float func1(float para) { // 声明函数，需要传入一个浮点型参数
  static float stva = 1.414; // 声明一个不会被销毁的变量，它只会初始化一次
  stva += para + glva; // 全局变量可以随时使用
  return stva; // 返回计算后的值
}

void main() {
    float pi = 3.14; // 声明一个浮点型变量
    float* f_ptr = &pi; // 声明一个浮点指针，指向pi
    const float e = 2.7182818; // 声明一个数据不可更改的恒量
    long int g[2][3][3]; // 声明一个长整型数组

    [输出两次 func1(e) 的值];
    [输出数组 g 的值];
    [输出指针 f_ptr 的值，输出指针（取值）*f_ptr 的值];
    [输出全局变量（取地址）&glva 的值];

    [...];
}
```

它的输出结果是：

```text
第一次调用函数的值为：4.13228
第二次调用函数的值为：6.85056
数组变量的地址为：0000008a3d6ff650
指针所指的变量的地址为：0000008a3d6ff6a8，值为：3.14
在主函数中调用了全局变量，它的地址为：00007ff7cf687098
```

- 我们可以注意到两次调用函数返回的值不一致，但是我们没有对全局变量 `glva` 做任何赋值操作，传入的变量 `e` 是一个恒量，所以只能是没有被销毁的 `stva` 变化了。
- 直接输出 `g` 的值，注意到它输出的是一个十六进制的地址。
- 直接输出 `f_ptr` 的值，发现它也是一个地址，我们对其取值 `*f_ptr` 并输出，最终成功得到了 `pi` 的值。
- 我们还成功在主函数中输出了全局变量的地址 `&glva` 。

</procedure>

### 图形学（3D） {id="图形学"}
#### 图形基础 {id="图形基础"}

参阅：[着色器 基本概念和轶事](shaderBasic.md){summary=""}

<deflist>
<def title="着色器" id="着色器">

**Shader**，光影中包含一个或数个着色器。着色器定义了如何处理传入的三角形，以及向何处输出何种信息。

- 常见的着色器类型见：[](shaderBasic.md#whatWasYourMissionInShader){summary=""} 。
- 我们约定，**着色器**指**单个**着色器文件，而**光影**指着色器、配置文件等打包而成的 [](#光影包){summary=""} 。

</def>
<def title="渲染管线" id="渲染管线">

**Rendering Pipeline**，规定了着色器处理画面的顺序。

</def>
<def title="三角形和法线" id="三角形和法线">

不同于前文所述的 [体素](#体素 "作为一种三维图形的表示方法，在此类空间中定义的三维图形，体素是最小坐标单位。") ，3D图形更常用的是类似 [矢量图](#矢量图 "由顶点位置和连接顶点的线段信息所组成的图像。") 的渲染方法。
- 计算机图形学约定，三角形的三个顶点以**逆时针**顺序所形成的平面就是这个形状的**正面**。
    - 垂直于这个面朝外的方向就是这个三角形的**面法线**（Surface Normal）。

</def>
<def title="着色（目标）点" id="着色目标">

**Shading Point**，指当前着色器正在处理的像素点。

</def>
<def title="采样（目标）点" id="采样目标">

**Sampling Point**，指当前着色器正在 [](#缓冲区){summary=""} 上采样的像素点。

</def>
<def title="视平面" id="视平面">

在场景中所有能看到的内容可以构成一个**平截头体**，或者说**视锥体**。最近能看见的位置所成的平面称为**近平面**，同理最远可见的位置所成的平面称为**远平面**。为了保证近处不被意外遮挡或剔除，通常会将近平面设置为一个小值，沿摄像机朝向在Z轴上小于这个位置的几何体都会被剔除。而归一化就是在基于摄像机的坐标系下，将近平面到远平面的坐标映射到 [0, 1] 上。
> 远平面在 Java 版中被设置为了最大方块渲染距离，即区块渲染距离的一半。

</def>
<def title="平行光源" id="平行光源">

也称**无限光**，距离玩家**无穷远**处的光源。
> 太阳和月亮的光照在渲染中通常看作平行光。

</def>
<def title="点光源" id="点光源">

从自身向所有方向发射光照的光源。

> 在 Minecraft 中不存在严格意义上的点光源，但 OptiFine 提供的**动态光源**和一些光影提供的**手持光源**（实际上是摄像机光源）可以被认为是点光源。Iris 还提供了一个独占特性，让手持光源可以进行投影。

</def>

<def title="渲染方法" id="渲染方法">

现代常用的渲染方法有两种，**向前渲染法**和**延迟渲染法**。
<deflist>
<def title="向前渲染法" id="向前渲染法">

将一类几何体全部传入对应的单个着色器，处理完毕后，将颜色直接输出在屏幕上。

其因所有效果的处理都随管线向前推进而得名。

</def>
<def title="延迟渲染法" id="延迟渲染法">

将画面处理分为**两趟**：
<deflist>
<def title="几何缓冲（阶段）" id="几何缓冲">

**Geometry Buffer (Stage)**，这种阶段的着色器因传入的顶点数据是场景中实际的几何体而得名，它还接受所有原始纹理（包括法线、高光等）的传入，并将其映射到几何体上。

</def>
<def title="延迟处理（阶段）" id="延迟处理">

**Deferred / Composite (Stage)**，这种阶段的着色器所使用的信息都是**之前的几何缓冲**和**上一个延迟处理着色器**绘制到缓冲区的画面。在这个阶段，着色器从缓冲区中读取信息，并将计算结果绘制到*铺屏四边形*上。
- 此阶段无法引入原本场景中额外的几何和颜色信息，不能改变原本的纹理映射坐标。
- 在这个阶段可以通过各种*深度图*和*逆矩阵*来**重建**各种坐标。

</def>
</deflist>

其因延后了大部分性能开销较大的效果到独立阶段而得名。

</def>
</deflist>
</def>

<def title="缓冲区" id="缓冲区">

**Frame Buffer**，是存储图像的区域（对象）。可以理解为一张图片，在延迟渲染法中，先在几何缓冲阶段将原始信息写入缓冲区，再在延迟处理阶段调用信息进行运算。

<deflist>
<def title="深度缓冲区" id="深度缓冲区">

**Depth Buffer**，也叫深度图，是一种特殊的缓冲区，它只有一个通常是 32 位的 R 通道。它所包含的信息是相对垂直于摄像机朝向的平面的归一化距离，越远的地方值越趋于 `1.0` ，反之越趋于 `0.0` 。
> 高度图也可以被视作一种反转的深度图（越高的地方越亮）。

</def>
</deflist>
</def>
<def title="颜色附件" id="颜色附件">

**Color Attachments**，是负责**着色器间传递数据**的对象，每个颜色附件包含**两个**缓冲区，以逻辑名称 `main`（ `主` ）和 `alt`（ `副` ）标记，在不同系统和 GPU 上，颜色附件的数量可能有所差异。得益于双缓冲区颜色附件，着色器可以读取 `主` 缓冲区中的信息进行计算，最后再输出回同附件的 `副` 缓冲区。在 *OptiFine* 中，*阴影颜色附件*有 2 个，而*屏幕颜色附件*至多有 16 个。*几何缓冲阶段**不会翻转缓冲区**，*延迟处理阶段*则在**每个**着色器结束后**都会翻转**。

</def>
<def title="坐标系" id="坐标系">

**Coordinate System**，通常以 **XYZW** 为坐标。在着色器中基于不同坐标系即称为不同**空间**，通过矩阵可以在不同坐标系之间转换。
<deflist>
<def title="局部空间" id="局部空间">

**Local Space**，这个空间以单个物体为基准，通常以画面中心为原点，描述每个物体的每个顶点的相对位置。
</def>
<def title="世界空间" id="世界空间">

**World Space**，这个空间以整个场景为基准，描述每个顶点的绝对位置。
</def>
<def title="观察空间" id="观察空间">

**View Space**，这个空间以摄像机为基准，以摄像机为原点，描述每个顶点相对摄像机的位置。
</def>
<def title="裁切空间" id="裁切空间">

**View Space**，这个空间以摄像机为基准，以画面中心为原点，坐标取值范围为 [-1, 1]，描述每个顶点经过透视映射（投影）后相对画布的位置。
</def>
<def title="屏幕空间" id="屏幕空间">

**Screen Space**，这个空间以窗口为基准，以画面左下角为原点，坐标取值范围为 [0, 1]，描述每个顶点在屏幕上的位置。

> 在 [延迟渲染阶段](#延迟处理 "着色器从缓冲区中读取信息，并将计算结果绘制到铺屏四边形上。") ，我们只能获取屏幕空间内的像素信息（没有几何信息）。
</def>
<def title="纹理坐标" id="纹理坐标">

**Texture Coordinate**，通常以 **UV** 为坐标。以二维纹理为例，对于三维空间中任意三角形的表面上的任意点，都有一个在二维纹理上对应的坐标，这个坐标就是这个三角形此处的纹理坐标。纹理坐标可以在着色器中进行各种变换。
- 将二维纹理坐标上的颜色映射到三维空间中三角形上的过程，就是纹理映射，而三角形获取纹理上的颜色，就称为纹理采样。
> 二维纹理坐标所处的空间也被称为 **ST 空间** 。

</def>
</deflist>
</def>
</deflist>

#### OpenGL 相关 {id="opengl-相关"}

<deflist>
<def id="opengl">
<title><tooltip term="OpenGL">OpenGL</tooltip></title>

**开源图形库**，Java 版所使用的图形函数库。

</def>
<def title="GLSL" id="glsl">
<title><tooltip term="GLSL">GLSL</tooltip></title>

**(Open)GL 着色语言**，顾名思义，它是 OpenGL 的着色器所使用的语言，语法类似 C。
- 其它的图形库还有如 Vulkan，它的着色器语言也是 GLSL；DirectX，它的着色器语言是 **<tooltip term="HLSL">HLSL</term>**（高级着色语言）。

<deflist>
<def title="GLSL 类型" id="glsl类型">

除了 [前文](#变量类型和修饰符 "变量类型和修饰符") 所提到的类型外，GLSL 还有新增了一些数据类型：
- `bool` ：布尔值，可以是 `true` (`1`) 或 `false` (`0`)。
    - C 可以使用 `stdbool.h` 引入这个类型。
- `vec[N]` ：浮点向量，`N` 是属于区间 [2, 4] 的整数，表示该向量的维度。
    - `ivec[N]` 为整数向量，`bvec[N]` 为布尔值向量。
    - 例：`vec3` `ivec4`。
    - 在 OpenGL 和 GLSL 中，一个 `vec4` 类型可以被看做一个 `float[4]` 类型，但是需要注意：我们声明 `float[]` 类型的变量时，本质上是声明了一个指针，所以我们不能像 `vec[N]` 一样直接进行 [向量四则运算](#向量的普通四则运算 "将两个同维向量的对应分量或一个向量的所有分量与一个标量进行四则运算。") 。
    - 我们可以使用 `xyzw` / `rgba` / `stpq` 来访问向量中特定的分量。
- `mat[N]` `mat[N]x[M]` ：浮点矩阵，`N` 、`M` 可以为 [2, 4] 的整数，表示该矩阵的大小。
    - `mat[N]` 表示 `N * N` 大小的矩阵，`mat[N]x[M]` 表示 `N * M` 大小的矩阵。
    - 例：`mat3` ，`mat2x4` 。
    - 假设我们现在有一个矩阵 `mat3 M` 我们可以使用 `M[1][2]` 来访问对应位置上的量。
- `sampler[N]D` ：样本，可以通过纹理采样函数来获取样本的信息，`N` 可以为 [1, 3] 的整数，表示该样本的维度。
    - `samplerCube` ：六面包围盒式的样本。
    - 例：`sampler2D` 。
- 此外，除了 `auto`（默认）和 `const` ，GLSL 无法使用其他修饰符。

</def>
<def title="GLSL 函数" id="glsl函数">

这里列出了一些常用的 GLSL 函数：
- `texture(sampler[N]D texture, vec[N] texcoord)` ：纹理采样函数
    1. `sampler[N]D texture` ：与函数维度相等的样本，通常是 `纹理` 。
    2. `vec[N] texcoord` ：与函数维度相等的向量，通常是 `纹理坐标` 。
        - `N` 应该一致。
        - 旧的 GLSL 还有一个 `texture[N]D()` 的函数，在新版本中已弃用。
- `dot(vec[N] a, vec[N] b)` ：[点乘](#点乘 "两个向量运算为一个标量，得到的值称为内积。") 。
- `cross(vec[N] a, vec[N] b)` ：[叉乘](#叉乘 "向量之间的有序乘法，得到的向量称为外积。") 。
- `normalize(vec[N] a)` ：[归一化](#归一化 "将一个非零向量转换为单位向量的过程。")。
- `smoothstep(float a, float b, float x)`，将 `x` 从 [`a`, `b`] 平滑地映射到 [`0`, `1`]。

</def>
</deflist>
</def>
</deflist>

#### 纹理／贴图相关

<deflist>

<def title="灰度图" id="灰度图">

仅有一个 [颜色通道](#颜色通道 "颜色通道的数量表示色彩类型的数量") 的图片。
> [深度图](#深度缓冲区 "一种特殊的缓冲区，它只有一个通常是 32 位的 R 通道。")、**高度图**都是灰度图的一种

</def>
<def title="阴影贴图" id="阴影贴图">

**Shadow Map**，是深度图的一种，其运作原理大致如下：
1. 从**光源视角**绘制深度图并从其方向上**投射到玩家视角**作为距光源的**最近距离**；
    - 这里所说的最近距离是指从光源出发，沿**该点与光源连线**上最近可以遇到的物体。
2. 将其与玩家视角里每个像素**实际到光源的距离**做比较；
3. 如果实际距离比最近距离更大，就是阴影。
    - 由于其算法特性，**阴影精度**与阴影贴图**分辨率**直接挂钩，同时会**大幅影响性能**。

</def>
<def title="法线贴图" id="法线贴图">

**Normal Map**，偏移物体表面的朝向，这样就可以影响每个纹理像素的光照强度，从而产生额外的表面细节。
- 在计算机渲染中，我们通常使用法线信息与光源方向做 [点乘](#点乘 "两个向量运算为一个标量，得到的值称为内积。") `dot(lightDir, Normal)` 来获得该像素被光源照亮的程度，法线贴图在此时的作用就是偏移了 `Normal` 这个量。所以实际上法线**并没有真正偏移表面**，而只是让该纹理像素的信息被改写。

</def>
</deflist>

#### 渲染技术相关 {id="渲染技术相关"}

参阅 [着色器 技术科普](shaderTech.md "这篇文档列出了常见的着色器技术，作为术语简短介绍的补充")

<deflist>
<def id="pom">
<title><tooltip term="POM">POM</tooltip></title>

**视差遮蔽映射**，简称**视差**。
- 和法线相似，视差贴图通过**偏移表面的采样坐标**，让玩家从不同角度感觉到表面上某些纹理被其他纹理遮挡，从而创造凹凸的观感，这也是其名字中**映射**的含义。

</def>
<def title="PBR" id="pbr">
<title><tooltip term="PBR">PBR</tooltip></title>

**基于物理的渲染**。
- 它是一种着色的方法，更准确地表现光线如何与材料性质相互作用。
- 它有一些传统着色中没有考虑到的部分，如**能量守恒**、**光电效应**等。
> 传统着色是基于物理的方法的超级近似。例如理想漫反射分布模型 **Lambert BRDF** 就是对渲染方程在表面理想光滑时的近似。

</def>
<def id="gi">
<title><tooltip term="GI">GI</tooltip></title>

**全局光照**。是直接光照和间接光照的集合。

<deflist>
<def title="直接光照" id="直接光照">

**Direct Lighting**，直接来自光源的光照。
- 在 Minecraft 中，通常只有太阳和月亮能提供直接光照，方块光照均是通过**光照贴图**实现的。
  - 在 [体素化](#体素 "作为一种三维图形的表示方法，在此类空间中定义的三维图形，体素是最小坐标单位。") 光影（通常伴生光线追踪）中，将光源方块编码进体素之后，也可以作为光源投射直接光照。
- 在计算机图形学中，我们把可以**投射阴影贴图**的光源称为**直接投影光源**，OptiFine 光影直接支持的直接投影光源**有且仅有**太阳或（取决于时间）月亮。
> Iris 提供了一个独占特性，可以将世界中每个光源的位置信息体素化并存储，此时方块光源也可以算作直接光源。

</def>
<def title="间接光照" id="间接光照">

**Indirect Lighting**，直接光照经过物体表面反射或内部散射最终离开物体，并打在周围其他**表面**上形成的**照明**效果。

<deflist>
<def title="散射" id="散射">

**Scattering**，是电子吸收光线（电磁波）能量，再向周围发射电磁波的物理现象。
> - 漫反射、镜面反射本质上也是散射。空气中的杂质也会散射光线，也就形成了**体积光**。
> - **折射**是散射的一个*特解*（表面光滑，介质透明的散射）。

</def>
<def title="焦散" id="焦散">

经由**光滑表面**散射产生方向性较强的光线，打到表面上而成的局部光照更亮的现象。
- 可以理解为表面光滑度参与影响光线路径之后所形成的间接光照。
- 直接光照受其影响更大。
> 经过一次或数次散射后，经由漫反射表面反射最终到达观察者视角的光线，可以称之为焦散。  
> —— *Tahnass*

</def>
</deflist>
</def>
</deflist>
</def>
<def title="SSS" id="sss">

此简写包含以下两种概念
<deflist>
<def id="次表面散射">
<title><tooltip term="SSS">次表面散射</tooltip></title>

模拟光线进入物体后在其内部经过多次散射后射出**照亮物体内部**的效果，允许某些材质（如纸、树叶、皮肤）的物体透过光线，从而产生更加通透真实的质感。

</def>
<def title="屏幕空间阴影" id="屏幕空间阴影">
<title><tooltip term="SSSh">屏幕空间阴影</tooltip></title>

由于阴影贴图的精度不足，容易在物体与表面接触的边缘产生锯齿和偏移。屏幕空间阴影就是用于这些地方来补足阴影的效果，因此也称为**接触阴影**（Contact Shadow）。

</def>
</deflist>
</def>
<def id="ssr">
<title><tooltip term="SSR">SSR</tooltip></title>

**屏幕空间反射**。采样屏幕上的内容来绘制反射场景，其受限于 [屏幕空间](#屏幕空间) 。
</def>
<def id="ao">
<title><tooltip term="AO">AO</tooltip></title>

**环境光遮蔽**。间接光照在场景间经过各种反射之后逐渐被场景所吸收和遮挡的效果。
- 由于性能问题，很多游戏中通常使用了各种欺诈和近似来模拟间接光照，AO 就是为了让本应或者*似乎*应该为暗处的地方暗下去（通常是凹处和夹缝）而产生的技术。
    - 在光线追踪工作流中，环境光遮蔽伴随着全局光照自然产生，这种时候不会特别区分。
- 绘制在 [着色贴图](resourcepackBasic.md#着色贴图 "由模组、资源包和着色器共同支持，用以存储表面材质的贴图") 上的 AO 被称为**纹理环境光遮蔽**（Texture AO）或**材质环境光遮蔽**（Material AO）。

</def>
<def title="光线追踪" id="光线追踪">
<title><tooltip term="RT">RT</tooltip></title>

**光线追踪**，模拟光子从光源到达表面的过程。

<deflist>
<def title="逆向光线追踪" id="逆向光线追踪">

从摄像机发射每个“光子”，根据**光路可逆原理**，逆向寻找光源。
> 逆向光线追踪可以避免投射很多无用的光子，是目前主流的光线追踪算法。

</def>
<def id="路径追踪">
<title><tooltip term="PT">PT</tooltip></title>

**路径追踪**，使用蒙特卡洛随机采样并模拟光子多次反弹，经由漫反射、镜面反射、折射等直到达到退出条件所最终产生的光照。

</def>
</deflist>
</def>
</deflist>

#### 抗锯齿／升采样技术相关

<deflist>
<def id="dlss">
<title><tooltip term="DLSS">DLSS</tooltip></title>

**深度学习超级采样**，由*英伟达*开发的一种升采样技术。通过降低分辨率并调用显卡 <sup>Nvidia</sup> 的<tooltip term="TCore">**张量核心**</tooltip>来猜测原始分辨率下该处像素的内容。
- 在 2.0 以前，DLSS 主要是靠已有画面内容来“猜”剩下的场景应该是何样。
- 自 2.0 开始，DLSS 主要是根据场景运动信息和历史帧来判断剩下的场景是何样，其计算方法从单一的空间域上升到了**时空域**，不再依赖于针对单个游戏的训练，效果也比 1.0 好得多。

<deflist>
<def id="dlaa">
<title><tooltip term="DLAA">DLAA</tooltip></title>

**深度学习抗锯齿**，在**原始分辨率**下进行 DLSS 来平滑边缘的抗锯齿方法。

</def>
</deflist>
</def>

<def id="fsr">
<title><tooltip term="FSR">FSR</tooltip></title>

**FidelityFX 超级分辨率**，由 *AMD* 开发的一种升采样技术。相比较 DLSS 来说更为常规，但效果要比其他传统升采样方法好。

</def>

<def id="xess">
<title><tooltip term="XeSS">XeSS</tooltip></title>

**Xe 超级采样**，由*英特尔*开发的一种升采样技术。在其他平台上和其本家含有特定核心的平台上所使用的算法有所区别，因而在其本家平台上能够获得更好的效果。

</def>
</deflist>
