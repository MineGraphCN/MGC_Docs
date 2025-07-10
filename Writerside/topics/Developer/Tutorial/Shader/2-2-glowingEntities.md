# 发光实体再处理

<show-structure depth="2"/>

<tldr>

在上一节中，我们将第一轮中所有的几何缓冲程序都进行了初步处理，它们现在都会在场景中正确绘制，除了来捣乱的隐身实体和这一节我们将会处理的发光实体。

这一节我们将会进一步处理发光实体的专用着色器，让它在屏幕上绘制出正确的轮廓，并且不会被遮挡。

</tldr>

## 图像读写

还记得原版的发光实体吗？在生存模式中，当实体被光灵箭命中就会附加上发光效果。此时在其他玩家眼中，只要实体在渲染距离之内，**无论是否被其他物体遮挡**，它们都会有一层厚厚的描边。

![原版发光实体](glowingEntities_vanilla.webp){width="700"}

在之前的片段着色器中，我们一直使用片段着色器常规的输出方式，在全局空间声明 `out` 变量，然后绘制到每个像素。不幸的是，在 OptiFine 的设置中，这些片段着色器都会主动进行深度测试，一旦被其他物体遮挡，几何体就不会被绘制，而且这个功能无法取消。幸运的是，GL 还有一种读写方案，而这个方案最初由英伟达作为扩展添加，并在 GLSL 4.20 转正为内置特性。

### 声明扩展

由于我们所声明的 GLSL 版本较低，因此需要使用 `#extension` 指令来调用扩展：

```glsl
#extension GL_ARB_shader_image_load_store : enable
```

宏命令 `#extension` 我们都知道了，它紧接是扩展名。扩展名的命名规律为：

1. 以现代规范要求的 `GL` 前缀开头；
2. 扩展的 [类型](https://www.khronos.org/opengl/wiki/OpenGL_Extension#Extension_Types) ，`ARB` 表示获得了 OpenGL ARB 协会批准的正式扩展，类似的还有 `EXT` 表示泛用的扩展，但是可能部分硬件厂商未予以实现；
3. 扩展的具体名称。

如果扩展名使用 `all` ，则会启用所有支持的扩展。

声明了扩展之后，我们还需要指定扩展的行为，在扩展名称后接 `:` 即可进行定义。扩展的行为可以为 `require`、`enable`、`warn` 和 `disable`，它们的具体行为由下表决定：

<table width="700">
<tr><td>行为</td><td>声明扩展</td><td>硬件不支持且使用扩展语法时</td></tr>
<tr><td><code>require</code></td><td colspan="2">强制启用，不支持即报错</td></tr>
<tr><td><code>enable</code></td><td>通过编译</td><td>报错并中止（失败）</td></tr>
<tr><td><code>warn</code></td><td>通过编译</td><td>警告并继续（通过 <sup><b>1</b></sup> ）</td></tr>
<tr><td><code>disable</code></td><td colspan="2">强制禁用，使用即报错</td></tr>
</table>

除了 `require`，如果着色器的实际代码中没有使用任何扩展的内容或语法，则不会报错。

**[1]** 如果在不支持的硬件上使用了 `warn` 行为的扩展，就算通过了编译，最后的程序也会出现未定义行为。由于我们有插件进行报错，这个行为基本不会用到。

### 使用图像类型

和纹理类似，在着色器程序的全局空间使用 `uniform` 关键字即可声明图像类型 <code><i>g</i>image</code>，我们可以在任何着色器中访问 0 ~ 5 号颜色缓冲区和两个阴影颜色缓冲区，只需要把它们的后缀从 `tex` 改为 `img`（`shadowcolor` 同样加上 `img` 后缀）。有一点不同的是，我们需要使用 `layout()` 指定图像的格式。

上一节，我们将几何 ID 保存在了单通道8位无符号整数的 3 号缓冲区中，并且已经为发光实体保存了独特的 ID，但是这个 ID 实际只能用于为显露的发光实体处理额外特效。由于发光实体的描边特效仅描边外轮廓，而几何 ID 则覆盖了几何的内部，当发光实体被其他几何遮挡而强行写入时，延迟处理中的几何 ID 就会产生误判。

因此，我们将会启用 4 号缓冲区，用以保存发光实体需要绘制的轮廓依据。在原版中虽然在写入原始数据时只有 `1`（发光区域） 和 `0`（非发光区域），但是后续进行模糊扩散要求插值过渡，还要独立处理描边的不透明度，不过实际上也只需要一个数据。为此，我们将 4 号缓冲区设置为单通道 16 位浮点 ^**1**^ 来避免过渡断层，并依照上文的方法调用：

```glsl
[... Settings ...]
/*
const int colortex4Format = R16F;
*/
[... gbuffers_entities_glowing ...]
layout(r16f) uniform image2D colorimg4;
```

当然，你也可以将 3 号缓冲区的格式改为双通道，并将发光数据存入其中，但同时也需要处理先前的整型几何 ID，将它们转换为浮点值（习题 1）。

> 由于只能将 0 ~ 5 号缓冲区以图像格式读取，而几何缓冲又无法按常规方法读取 0 ~ 3 号缓冲区，可以在任何阶段以任何方式读写的颜色缓冲区实际上只有 4 号和 5 号，计算着色器还会更加放大这个问题。
> 
> 因此在几何缓冲阶段，如果只是要使用之前的屏幕缓冲区数据，则推荐把这些数据存入 5 号之后的缓冲区；而延迟处理阶段中，也最好将 4、5 号缓冲区特意留出。
> 
> 而在 Iris 中，我们可以自定义至多 16 个额外的图像，不仅可以自定义其尺寸，还能在任何程序中访问。

我们可以使用函数 `imageLoad(gimage image, ivec coord)` 来读取图像区域内任意坐标的内容，和 `texelFetch()` 类似，它使用索引坐标，唯一的区别是图像不可以指定细节等级，此外，也可以使用 `imageSize()` 函数来取到图像的尺寸，它直接返回整型值。

同样的，使用 `imageStore(gimage image, ivec coord, gvec4 data)` 来写入任意位置。无论几通道，第三项 `data` 均为四元数，由 GLSL 自动裁切。

在实际写入之前，还需要注意的是，它不会进行任何深度测试和 Alpha 测试（或者说自动深度测试已经是程序结束之后了），所以如果你想要描边完美贴合实体，应当在 Alpha 测试的 `discard` 之后才调用写入函数。由于没有上下文级别的深度测试，在同一个着色器中对多个重叠三角的同二维位置片段写入会导致写入竞争，从而产生块状闪烁，但是我们这里写入的都是与位置无关的常量，因此就无所谓了。

`discard` 指令在图像写入与片段着色器的普通输出之间有些许差别。如果触发了 `discard` 指令，像素着色器的普通输出会停止并丢弃当前像素的任何东西；而图像写入则只会在当前位置停下，而不影响先前写入的内容。

<compare first-title="向图像写入" second-title="像素着色器输出">

```glsl
vec4 color = vec4(1.0);
bool cond = doSth();

imageStore(colorimg0, ivec2(gl_FragCoord.xy), color); // 正常写入
if(cond) discard;
color = vec4(0.0);
imageStore(colorimg1, ivec2(gl_FragCoord.xy), color); // if()为假，写入；if()为真，无效
```
```glsl
vec4 color = vec4(1.0);
bool cond = doSth();

fragColor0 = color; // if()为假，写入；if()为真，无效
if(cond) discard;
color = vec4(0.0);
fragColor1 = color; // if()为假，写入；if()为真，无效
```

</compare>

要想用普通输出达到图像写入的功能，可以使用反转条件：

```glsl
fragColor0 = color; // 正常写入
if(!cond) {
    color = vec4(0.0);
    fragColor1 = color; // if()为真，写入；if()为假，无效
}
```

要想用图像写入达到普通输出功能，可以延后图像写入到条件判定之后：

```glsl
if(cond) discard;
imageStore(colorimg0, ivec2(gl_FragCoord.xy), color); // if()为假，写入；if()为真，无效
color = vec4(0.0);
imageStore(colorimg1, ivec2(gl_FragCoord.xy), color); // if()为假，写入；if()为真，无效
```

最后，我们的 `gbuffers_entities_glowing.glsl` 就长这样了：

```glsl
[... 片段着色器部分 ...]
#extension GL_ARB_shader_image_load_store : enable
[...]
layout(r16f) uniform image2D colorimg4;
[... main ...]
[...]
if(fragColor.a <= alphaTestRef) discard; // 先进行 Alpha 测试！
imageStore(colorimg4, ivec2(gl_FragCoord.xy), vec4(1.0));
[...]
```

如果直接读取发光实体缓冲，看起来就像这样：

![发光实体缓冲区](glowingEntities_glowingBuffer.webp){width="700"}

> 除此之外，图像类型还可以进行原子操作，即当不同着色器程序向同一张图像的同一个位置写入相同数据时，会严格按照程序的执行顺序进行处理，不会出现次序问题。
>
> 可以用于原子操作的图像格式有严格的限制，只可以是 `R32I/r32i` 或 `R32UI/r32ui` ，但是通过格式转换是可以在其他格式上使用的，例如将一个 `RGBA8I`（4x8=32位）声明为 `R32I`（1x32=32位），不过这就需要手动进行移位来处理具体内容了。
>
> 所有原子操作返回的值都是图像位置上的原始值，下列的 <code><i>g</i>int</code> 中的 _`g`_ 指的是 `int` 或 `uint`。`IMAGE_COORDS` 表示正在处理的图像的像素坐标。
>
> - 原子赋值，由于它们会返回原值，所以也可用作交换：  
> `gint imageAtomicExchange(gimage image, IMAGE_COORDS, gint data)`
> - 原子条件赋值，仅当图像目标值等于条件值时赋值：  
> `gint imageAtomicCompSwap(gimage image, IMAGE_COORDS, gint compare, gint data)`
> - 原子算术，GLSL 仅提供加法，但是你可以在**有符号整数运算**中为 `data` 添加负号来进行减法运算：  
> `gint imageAtomicAdd(gimage image, IMAGE_COORDS, gint data)`  
> 自 GLSL 4.30 起，你也可以在无符号整数中进行这种计算，只需要写作 `imageAtomicAdd(..., uint(-data))` 。当然，你得保证最终的值不会为负而溢出。
> - 原子位运算，可以进行与、或和异或运算：  
> `gint imageAtomicAnd(gimage image, IMAGE_COORDS, gint data)`  
> `gint imageAtomicOr(gimage image, IMAGE_COORDS, gint data)`  
> `gint imageAtomicXor(gimage image, IMAGE_COORDS, gint data)`
> - 原子大小值，可以取最大值和最小值：  
> `gint imageAtomicMin(gimage image, IMAGE_COORDS, gint data)`  
> `gint imageAtomicMax(gimage image, IMAGE_COORDS, gint data)`
>
> 你也可以使用 `memoryBarrier()` 来手动设置内存屏障。
> 
> 资料来源：[Image Load Store - OpenGL Wiki](https://www.khronos.org/opengl/wiki/Image_Load_Store)，此处仅作扩展阅读，留由读者自行研究。

## 描边与原版实现

现在我们已经获得了发光实体的遮罩数据，如果单纯地想给覆盖区域外围加上一圈描边，我们只需要在延迟处理中简单地检查非发光像素邻近的四个（或加上对角线共八个）像素即可是否与之状态有别即可。当搜索到任何一个邻近像素是发光区域时，就给当前像素上色，类似这样：

```glsl
[... Uniforms ...]
uniform isampler2D colortex4;
[... final - main ...]
bool isGlowing = bool(texture(colortex4, uv).r);
bool isGlowingEdge = false;
if(!isGlowing) {
    for(int i = -1; i < 2; i+=2) {
        ivec2 sCoord = ivec2(gl_FragCoord.xy) + ivec2(i,0);
        isGlowingEdge = bool(texelFetch(colortex4, sCoord, 0).r);
        if(isGlowingEdge) break;
    }
    for(int i = -1; i < 2 && !isGlowingEdge; i+=2) {
        ivec2 sCoord = ivec2(gl_FragCoord.xy) + ivec2(0,i);
        isGlowingEdge = bool(texelFetch(colortex4, sCoord, 0).r);
        if(isGlowingEdge) break;
    }
}
if(isGlowingEdge) fragColor = vec4(1.0);
```

至此，我们就已经初步成功给发光实体描上边了，值得注意的是，上一章中，我们将发光实体暂时设定为了无光照类：

![发光实体描边](glowingEntities_glowingEdge.webp){width="700"}

当然，这个发光描边效果仍然很粗糙，只有 1 像素，分辨率高一些就会变得极不明显，所以让我们来拆解原版的发光描边着色器。

原版的描边使用了两个延迟处理 Pass，第一个 Pass `entity_outline_box_blur` 使用方框模糊处理了发光区域的数据，并保留累积的 Alpha 值（不取采样均值）以在模糊边缘形成断层，从而形成渐变过渡，并间接确定了描边宽度：

```glsl
#version 150

uniform sampler2D InSampler;

in vec2 texCoord;
in vec2 sampleStep;

out vec4 fragColor;

void main() {
    vec4 blurred = vec4(0.0);
    float radius = 2.0;
    for (float a = -radius + 0.5; a <= radius; a += 2.0) {
        blurred += texture(InSampler, texCoord + sampleStep * a);
    }
    blurred += texture(InSampler, texCoord + sampleStep * radius) / 2.0;
    fragColor = vec4((blurred / (radius + 0.5)).rgb, blurred.a);
}
```
{collapsible="true" collapsed-title="entity_outline_box_blur.fsh" default-state="collapsed"}

这个着色器利用 `texture()` 的插值性在纹理的四个像素交界处进行两次采样，然后再单独在采样方向上的最外侧进行一次采样，从而快速获得半径内的平均色，最后再除以采样半径 ^**1**^ 。由于原版的发光效果是纯白色，RGB 通道和 Alpha 通道的数据只有是否除以半径的区别。

第二个 Pass `entity_outline` ^**2**^ 则用于再次混合邻近的四个像素并比较 Alpha 的总差异来确认颜色和混合比例：

```glsl
#version 150

uniform sampler2D InSampler;

in vec2 texCoord;
in vec2 oneTexel;

out vec4 fragColor;

void main(){
    vec4 center = texture(InSampler, texCoord);
    vec4 left = texture(InSampler, texCoord - vec2(oneTexel.x, 0.0));
    vec4 right = texture(InSampler, texCoord + vec2(oneTexel.x, 0.0));
    vec4 up = texture(InSampler, texCoord - vec2(0.0, oneTexel.y));
    vec4 down = texture(InSampler, texCoord + vec2(0.0, oneTexel.y));
    float leftDiff  = abs(center.a - left.a);
    float rightDiff = abs(center.a - right.a);
    float upDiff    = abs(center.a - up.a);
    float downDiff  = abs(center.a - down.a);
    float total = clamp(leftDiff + rightDiff + upDiff + downDiff, 0.0, 1.0);
    vec3 outColor = center.rgb * center.a + left.rgb * left.a + right.rgb * right.a + up.rgb * up.a + down.rgb * down.a;
    fragColor = vec4(outColor * 0.2, total);
}
```
{collapsible="true" collapsed-title="entity_sobel.fsh" default-state="collapsed"}

事实上，这个着色器中只有作为 Alpha 的 `total` 会起作用，`outColor` 虽然进行了写入，却并没有影响和修改最终的颜色。由于第一个 Pass 进行了数据模糊，所以发光和非发光相接的区域就会产生 Alpha 值过渡。当我们使用与邻近像素的 Alpha 差值和作为绘制依据时，远离交界区域的 Alpha 值始终为 0 或均匀累积值（数值上与模糊半径相等），Alpha 差值也就为 0，而交界区域与附近的 Alpha 值一直在变化，自然就会产生 Alpha 差值条带。

**[1]** 因为之前的采样都是两两像素的平均色，最后一次采样又手动减半，因此采样出来的颜色总和实际上只有一半，所以最后除数就不必为像素数量总和了。  
**[2]** 原版允许使用 JSON 文件自定义使用的顶点着色器和片段着色器，因此会出现 Pass 名称和着色器名称对不上的情况。比如描边模糊 Pass 的顶点着色器 `blur.vsh` 也被用于了打开菜单后的背景模糊。

## 多程序处理

之前的编程中，我们的延迟处理程序都集中在管线的最末端，即 `final` 中。而描边着色器要求将场景完全模糊之后再来检查，也就是说，如果我们想在同一个着色器中完成这些事情，需要将四周邻近的像素都进行模糊处理然后再来比较。然而普通的片段着色器中，这些数据是无法共享的，也就是说周围的像素在它们各自的片段着色器中也会这样干，最终就会造成四倍的模糊开销，这是极其不划算的。自然而然的，我们就会做出像原版那样的事情：先在一个 Pass 中进行图像模糊，再在下一个 Pass 中处理描边。

OptiFine 为我们提供了高度可自定义的延迟处理程序数量。回顾一下，我们可以用的延迟处理主要集中在两个阶段：固体几何缓冲之后的 Deferred 和余下几何缓冲之后的 Composite 。由于模糊着色器只处理发光遮罩缓冲区，因此程序的选择没什么所谓，这里我们就选择更靠近 Final 的 Composite 了。

原版的模糊着色器看起来会很奇怪，它似乎只在某个方向（`sampleStep`）上处理了模糊，当然，实际上是它在不同方向上运行了两次。为了平衡性能和质量，我们也会效仿原版，将模糊也分为两个 Pass，先将其进行水平模糊，再进行垂直模糊。最终，我们的模糊就在 `composite` 和 `composite1` 中进行，而描边则接在 `final` 中场景绘制完毕之后。

没有特别的要求的话，所有延迟处理的顶点着色器都一样，因此你可以直接复制 `final.vsh` 并更名。

参考原版着色器，它使用了方框模糊（Box Blur）将周围的数据进行平均，我们也将仿照它的方法和技巧，进行 5x5 的模糊处理，并将半径设计为可调整。

其他的常规声明与 Final 一样，在这个着色器中，我们只需要向发光数据中写入内容，因此渲染目标只有 4 号缓冲区：

```glsl
/* DRAWBUFFERS:4 */
layout(location = 0) out float blurredGlowingBuffer;
```

`main` 函数的内容和原版着色器很相似，只不过我们可以把模糊半径塞入 `Settings.glsl` 中，以便间接控制发光描边宽度。水平模糊的着色器看起来就像这样：

```glsl
blurredGlowingBuffer = 0.0;
vec2 sampleDir = vec2(pixelSize.x, 0.0);
for(float i = -GLOWING_BLUR_RADIUS + .5; i <= GLOWING_BLUR_RADIUS; i += 2.0) {
    blurredGlowingBuffer += texture(colortex4, uv + sampleDir * i).r;
}
blurredGlowingBuffer += texture(colortex4, uv + sampleDir * GLOWING_BLUR_RADIUS).r * .5;
```
竖直方向的模糊只需要将 `sampleDir` 的 `vec2(pixelSize.x, 0.0)` 替换为 `vec2(0.0, pixelSize.y)` 即可。

你可能注意到了，我们这里没有除以模糊半径，因为原版描边着色器中 Alpha 通道用得比较多。如果我们提早进行了除法，那么在描边着色器中需要使用 `min(c * (GLOWING_BLUR_RADIUS + 0.5), 1.0)` 来进行手动复原和截断。由于涉及到原版 Alpha 通道的部分都会包含不可应用分配律的 `min()` 函数，因此会有很多次 `min(a * x,b)`，那我们何不延后原版 RGB 通道的除法变成 `min(x,b)` 减少乘法次数呢？

> 这种描边本质上是轮廓两侧扩散，因为模糊时没有进行判定。如果你想要外侧描边，可以在模糊时仅模糊没有发光区域的部分。同样的，如果你想要内侧描边，可以仅模糊发光的区域。
> 
{style="note"}

回到 Final 中，将原版的方法封装成函数原样搬入，只是不再关心 RGB 的值，然后将其他统一变量对齐即可：
```glsl
float getGlowingEdge() {
    float center = texture(colortex4, uv).r;
    float left = texture(colortex4, uv - vec2(pixelSize.x, 0.0)).r;
    float right = texture(colortex4, uv + vec2(pixelSize.x, 0.0)).r;
    float up = texture(colortex4, uv - vec2(0.0, pixelSize.y)).r;
    float down = texture(colortex4, uv + vec2(0.0, pixelSize.y)).r;
    float leftDiff  = abs(center - left);
    float rightDiff = abs(center - right);
    float upDiff    = abs(center - up);
    float downDiff  = abs(center - down);
    float total = clamp(leftDiff + rightDiff + upDiff + downDiff, 0.0, 1.0);
    return total;
}
```

就像之前我们说的那样，原版的描边着色器仅用来判定描边边界，因此我们略去了所有与 RGB 相关的计算。最后，将 Final 中之前的颜色与之相混合，就可以绘制出发光描边了：

```glsl
const float div = (GLOWING_BLUR_RADIUS+.5)*(GLOWING_BLUR_RADIUS+.5);
float glowingEdge = getGlowingEdge();
float glowingColor = texture(colortex4, uv).r / div;
fragColor.rgb = mix(fragColor.rgb, vec3(glowingColor), glowingEdge);
```

当然，你也可以自定义发光描边的颜色。最后来看看大模糊半径下，将混合颜色使用三角函数和 [`frameTimeCounter`](a01-uniformsAndAts.md#uniforms){summary=""} 处理以呈现的动态彩虹发光描边！

![彩虹描边](glowingEntities_RAINBOW.gif){width="700"}

## 习题

1. （与习题 2 二选一）将 4 号缓冲区的内容合并入 3 号缓冲区中。之后，你可以先使用 `imageLoad(colorimg3, COORD).r` 取出已经写入的几何 ID，然后手动进行深度测试来决定保留几何 ID 的源内容还是覆写新内容（当前片段深度小于深度图上已有的深度时，说明发光实体本身也在前景，因此要覆写几何 ID），最后使用 `imageStore(colorimg3, COORD, vec4(geometryID, 1.0, vec2(0.0)))` 覆写图像内容并确保 G 通道为 1.0 即可。随后的模糊 Pass 只需要将 Red 通道中的内容原样输出即可。
2. （与习题 1 二选一）将 4 号缓冲区改为四通道，并在几何缓冲存入数据时写入纹理颜色，这在一定程度上可以根据实体的纹理颜色产生描边颜色。虽然会因为写入竞争而产生块状闪烁，但是描边区域是基本上稳定的。你可以将写入的 Alpha 值固定为 1 来消除内部的闪烁。
3. 尝试编写一个本节末尾处的彩虹描边效果。可以直接定义一个三维向量，每个通道都利用三角函数将 `glowingColor` 加上 `frameTimeCounter` 作为参数来周期性地改变颜色；然后配置文件中按统一变量的方法定义常量 $\pi$，将其添加入 `Uniforms.glsl` ，加入三角函数中用以给每个颜色分量不同的相位偏移（$\frac{\pi}{3}$、$\frac{2\pi}{3}$）。为了防止颜色溢出到负值，你可以将结果进行平方；如果你想要更加平缓的边缘，可以给颜色额外乘上 `glowingColor` 或将其乘入混合参考。  
4. 如果你同时完成了习题 2 和 3，可以把宏开关合并成 `#define GLOWING_EFFECT 0 // [0 1 2]`，每个数字代表一个描边上色模式。
5. 在混合比例中乘入 `float(geoID != geoID_enum.glowing_entities)` 可以避免发光实体本身被描边遮挡，将其设置为宏开关是个不错的选择。
   - 如果你觉得描边变得太淡，那是因为模糊总是从边框开始双向延伸，因此最终向外蔓延的值总是小于 0.5，因此你可以将描边颜色乘 2。
6. 利用自定义统一变量，将 [摄像机参数](a03-shaderProp.md#cam_bool) `is_glowing` 传入
   ```properties
   uniform.bool.cam_isGlowing = is_glowing
   ```
   然后在 `gbuffers_hand.glsl` 中使用 `if(cam_isGlowing)` 来向发光缓冲区进行图像写入，这样就可以在玩家发光时让手部和持有物也发光了。
