# 发光实体再处理

<show-structure depth="2"/>

<secondary-label ref="wip"/>

<tldr>

在上一节中，我们将第一轮中所有的几何缓冲程序都进行了初步处理，它们现在都会在场景中正确绘制，除了几个来捣乱的半透明程序。

这一节我们将会进一步处理发光实体的专用着色器，让它在屏幕上绘制出正确的轮廓，并且不会被遮挡。

本节的内容较少但很重要，因此也请认真阅读。

</tldr>

## 直接写入任何数据

在之前的片段着色器中，我们一直使用片段着色器常规的输出方式，在全局空间声明 `out` 变量，然后绘制到每个像素。不幸的是，在 OptiFine 的设置中，这些片段着色器都会主动进行深度测试，而且无法取消，为此我们只能寻求变通。幸运的是，GL 还有一种写入缓冲区的方案，而这个方案最初由英伟达作为扩展添加，并在 GLSL 4.20 转正为内置特性。

### 声明扩展

由于我们所声明的 GLSL 版本较低，因此需要使用 `#extension` 指令来调用扩展：

```glsl
#extension GL_ARB_shader_image_load_store : enable
```

宏命令 `#extension` 我们都知道了，它紧接的内容是扩展的名称，并辅以各种前缀：

- 现代规范要求扩展以 `GL` 前缀开头；
- `ARB` 表示获得了 OpenGL ARB 协会批准的正式扩展，类似的还有 `EXT` 表示泛用的扩展，但是可能部分硬件厂商未予以实现；

如果名称使用 `all` ，则会启用所有支持的扩展。

指定了宏之后，我们还需要指定扩展的行为，在扩展名称后接 `:` 即可进行定义。扩展的行为可以为 `require`、`enable`、`warn` 和 `disable`，它们的具体行为由下表决定：

| 行为        | 直接使用该扩展时 | 被其他扩展调用时 | 硬件不支持时 |
|-----------|----------|----------|--------|
| `require` | 可行       | 可行       | 报错并中止  |
| `enable`  | 可行       | 可行       | 警告并继续  |
| `warn`    | 警告并继续    | 可行       | 警告并继续  |
| `disable` | 报错并中止    | 报错并中止    | -      |

### 使用图像类型

和纹理类似，在着色器程序的全局空间使用 `uniform` 关键字即可声明图像类型 <code><i>g</i>image</code>，我们可以在任何着色器中访问 0 ~ 5 号颜色缓冲区和两个阴影颜色缓冲区，只需要把它们的后缀从 `tex` 改为 `img`。有一点不同的是，我们需要在之前使用 `layout()` 指定图像的格式。

上一节，我们将几何 ID 保存在了单通道8位无符号整数的 3 号缓冲区中，并且已经为发光实体保存了独特的 ID，但是这个 ID 实际只能用于为显露的发光实体处理额外特效。由于发光实体的描边特效仅描边外轮廓，而几何 ID 则覆盖了几何的内部，当发光实体被其他几何遮挡而强行写入时，延迟处理中的几何 ID 就会产生误判。

因此，我们将会启用 4 号缓冲区，用以保存发光实体需要绘制的轮廓依据，这种依据在原版中只有 `1`（发光区域） 和 `0`（非发光区域），因此我们依然将它设置为最小的单通道 8 位无符号整数，并依照上文的方法调用：

```glsl
[... Settings ...]
/*
const int colortex4Format = R8UI;
*/
[... gbuffers_entities_glowing ...]
layout(r8ui) uniform uimage2D colorimg4;
```

当然，你也可以将 3 号缓冲区的格式改为双通道，并将发光数据存入其中（习题 1）。

> 由于只能将 0 ~ 5 号缓冲区以图像格式读取，而几何缓冲又无法按常规方法读取 0 ~ 3 号缓冲区，可以在任何阶段以任何方式读写的颜色缓冲区实际上只有 4 号和 5 号，计算着色器还会更加放大这个问题。
> 
> 因此在几何缓冲阶段，如果只是要使用之前的屏幕缓冲区数据，则推荐把这些数据存入 5 号之后的缓冲区；而延迟处理阶段中，也最好将 4、5 号缓冲区特意留出。

我们可以使用函数 `imageLoad(gimage image, ivec coord)` 来读取图像区域内任意坐标的内容，和 `texelFetch()` 类似，它使用整数坐标，唯一的区别是图像不可以指定细节等级，此外，也可以使用 `imageSize()` 函数来取到图像的尺寸，它直接返回整型值。

同样的，使用 `imageStore(gimage image, ivec coord, gvec4 data)` 来写入任意位置。无论几通道，第三项 `data` 均为四维向量，由 GLSL 自动裁切。

在实际写入之前，还需要注意的是，它不会进行任何深度测试和 Alpha 测试，所以如果你想要描边完美贴合实体，应当在 Alpha 测试的 `discard` 之后才调用写入函数。

`discard` 指令在图像写入与片段着色器的普通输出之间有些许差别。如果触发了 `discard` 指令，像素着色器的普通输出会停止并丢弃当前像素的任何东西；而图像写入则只会在当前位置停下，而不影响先前写入的内容。

<compare first-title="图像写入" second-title="普通输出">

```glsl
vec4 color = vec4(1.0);
bool cond = doSth();

imageStore(colorimg0, ivec2(gl_FragCoord.xy), color); // 正常写入
if(cond) discard;
color = vec4(0.0);
imageStore(colorimg0, ivec2(gl_FragCoord.xy), color); // if()为假，写入；if()为真，无效
```
```glsl
vec4 color = vec4(1.0);
bool cond = doSth();

fragColor = color; // if()为假，写入；if()为真，无效
if(cond) discard;
color = vec4(0.0);
fragColor = color; // if()为假，写入；if()为真，无效
```

</compare>

要想用普通输出达到图像写入的功能，可以使用反转条件：

```glsl
fragColor = color; // 正常写入
if(!cond) {
    color = vec4(0.0);
    fragColor = color; // if()为真，写入；if()为假，无效
}
```

要想用图像写入达到普通输出功能，可以延后图像写入（虽然在我们这个例子中看起来有点神经……）：

```glsl
if(cond) discard;
imageStore(colorimg0, ivec2(gl_FragCoord.xy), color); // if()为假，写入；if()为真，无效
color = vec4(0.0);
imageStore(colorimg0, ivec2(gl_FragCoord.xy), color); // if()为假，写入；if()为真，无效
```

最后，我们的 `gbuffers_entities_glowing.glsl` 就长这样了：

```glsl
[... 片段着色器部分 ...]
#extension GL_ARB_shader_image_load_store : enable
[...]
layout(r8ui) uniform uimage2D colorimg4;
[... main ...]
[...]
if(fragColor.a <= alphaTestRef) discard; // 先进行 Alpha 测试！
imageStore(colorimg4, ivec2(gl_FragCoord.xy), uvec4(1));
[...]
```

如果直接读取发光实体缓冲，看起来就像这样：

![发光实体缓冲区](glowingEntities_glowingBuffer.webp)

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
> 资料来源：[Image Load Store - OpenGL Wiki](https://www.khronos.org/opengl/wiki/Image_Load_Store)，此处仅作扩展阅读，留有读者自行研究。

## 描边与原版实现

现在我们已经获得了发光实体的遮罩数据，如果单纯地想给覆盖区域外围加上一圈描边，我们只需要在延迟处理中简单地检查当前像素是否为非发光区域，然后搜索邻近的四个（或加上对角线共八个）像素即可。当搜索到任何一个邻近像素是发光区域时，就给当前像素上色，类似这样：

```glsl
[... Uniforms.glsl ...]
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

![发光实体描边](glowingEntities_glowingEdge.webp)

当然，这个发光描边效果仍然很粗糙，只有 1 像素，分辨率高一些观感就会变得很差，所以让我们继续拆解原版的发光描边着色器。

原版的描边使用了两个后处理 Pass 进行处理，第一个 Pass `entity_outline_box_blur` 使用方框模糊处理了发光区域的数据并让 Alpha 值在模糊边缘断层，从而形成区域过渡：

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

第二个 Pass `entity_outline` ^**1**^ 则用于再次混合周围的颜色并比较周围 Alpha 的总差异来确认颜色和混合比例：

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
    fragColor = center;
}
```
{collapsible="true" collapsed-title="entity_sobel.fsh" default-state="collapsed"}

**[1]** 原版允许使用 JSON 文件自定义使用的顶点着色器和片段着色器，因此会出现 Pass 名称和着色器名称对不上的情况。

## 多程序处理

之前的编程中，我们的延迟处理程序都集中在管线的最末端，即 `final` 中。

## 习题

1. 将 4 号缓冲区的内容合并入 3 号缓冲区中。之后，你可以先使用 `imageLoad(colorimg3, COORD).r` 取出已经写入的几何 ID，然后手动进行深度测试来决定保留几何 ID 的源内容还是覆写新内容（当前片段深度小于深度图上已有的深度时，说明发光实体本身也在前景，因此要覆写几何 ID），最后使用 `imageStore(colorimg3, COORD, uvec4(geometryID, 1, uvec2(0)))` 覆写图像内容并确保 G 通道为 1 即可。
