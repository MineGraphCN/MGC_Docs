# 结构和管线

<tldr>

本节将会为你介绍 OptiFine 的光影加载方法和处理管线，是创作光影必须的前置知识。

</tldr>

## OptiFine 加载光影的方法

OptiFine 会遍历 `shaderpacks` 下的文件夹和 `.zip` 压缩包，将所有包含 `shaders` 文件夹的内容都视为光影外壳（ `shaders` 也是这一层级下唯一的寻找目标，其中包含了所有着色器和配置文件），我们将它们称为**外壳文件夹**。除了读取外壳文件夹，OptiFine 还会读取 `.txt` 文件，如果这个文件的名字与外壳文件夹相同（如果是压缩包，则包含 `.zip` 后缀名），则会视为**光影设置文件**。
 
<include from="uniforms.md" element-id="shaderpack_options"/>

- 需要注意的是，OptiFine 会先寻找外壳文件夹，然后在外壳内寻找 `shaders` 文件夹，因此，如果将一个包含着色器文件的 `shaders` 文件夹直接放在 `shaderpacks` 下，或者外壳内还嵌套了一个文件夹（常见于压缩包，一些压缩软件会在打包时自动新建一层文件夹），则在新版本的 OptiFine 下不会读取。
    ```shell
    └─ shaderpacks
       ├─ shaderNameA
       │  └─ shaders # 正常读取
       │     └─ <着色器程序>
       ├─ shaders # 缺少外壳，无法读取
       │   └─ <着色器程序>
       └─ shaderNameB
          └─ folderB
             └─ shaders # 多重嵌套，无法读取
                └─ <着色器程序>
    ```

    > 老版本的 OptiFine 会认为前者的名字就叫 *shaders*，并把它视为外壳文件夹，然后试图寻找这个外壳文件夹中的 `shaders` 文件夹；如果是后者的情况，OptiFine 只会试图在第一层外壳下寻找 `shaders` 文件夹。因此这两种情况都会导致光影虽然显示在列表中，却无法正确加载。
    
我们将 `shaders` 文件夹称为**主文件夹**。

在 `shaders` 下， OptiFine 首先会寻找配置文件
- `shaders.properties` ，当前光影的内部配置文件，我们称为**光影配置**。
- `entities.properties` 、`item.properties` 和 `block.properties`，实体、物品和方块类型在当前光影中的映射 ID，我们称为**实体／物品／方块 ID 配置**。
> 此处的配置文件并非前文所述的光影*设置*文件，前者主要用于配置着色器的状态和提前处理部分数据，而后者是用于调整光影的宏定义和常量从而影响着色器效果。

获取到配置文件之后，OptiFine 会继续寻找 `lang` 和 `world<ID>` 文件夹。
- `lang` 文件夹下包含对可调宏定义和 `const` 修饰符变量的翻译文件，或者说**语言文件**，它做的实际上是将 _宏定义_ 、 _常量_ 和 _选项卡_ 重映射为对应字符串以用于光影设置页面。
    - 语言文件的命名规则是 `<语言>_<地区>.lang` ，如 `zh_cn.lang` 。其中地区可以大写，但在某些 OptiFine 版本下，可能会导致包括中文在内的一些语言无法读取，因此，我们建议都使用小写。
    - 光影设置会尝试读取对应当前游戏设置的语言文件，如果语言文件不存在，则先尝试读取英语语言文件（`en_us.lang`），如果英语语言文件也不存在，则直接显示定义名。
- `world<ID>` 文件夹下是对应维度的着色器，`world0` 表示主世界，`world-1` 表示下界，`world1` 表示末地，其他模组额外生成的世界通常也会有一个序号，如暮色森林是 `world7`。OptiFine 会优先使用这里的着色器渲染对应的世界，当文件夹不存在时，会使用主文件夹下的着色器。
    - 我们将 `world<ID>` 称为**维度文件夹**，对应的着色器称为**维度着色器**。

回到 `shaders` 文件夹下，OptiFine 在检查了所有默认读取的文件和文件夹之后，开始编译光影。它会将主文件夹和每个维度文件夹下着色器文件的代码编译为程序。根据管线顺序，OptiFine 会主动读取并编译 `.vsh` 、`.gsh` 、`.fsh` 和 `.csh` 文件，分别对应 *顶点着色器* 、 *几何着色器* 、 *片段着色器* 和 *计算着色器* 。
> 着色器类型简介见 [着色器 基本概念](shaderBasic.md#whatWasYourMissionInShader) 。

OptiFine 允许我们使用类似 C / C++ 的 `#include` 宏来调用其不会主动读取的文件，路径的根目录为主文件夹（ `shaders` ）：

例如使用
```glsl
#include "/lib/shadow.glsl"
```
来调用位于
```Shell
└─ shaders
   └─ lib
```
下的文件 `shadow.glsl`

> 这样做的好处是，当我们想对某些相同的程序或函数进行修改时，只需修改一次，减少出错。在我们的教程中，自定义文件的扩展名统一为 `.glsl` ，我们的插件会自动识别 `.glsl` 后缀，省去了自己设置的麻烦。当然，你也可以按照着色器的类型将其后缀设置为 `.vertex` 、`.fragment` 、`.geometry` 、`.compute` 以及其他自定义后缀。

这里总结了 OptiFine 默认读取的光影文件。

<include from="uniforms.md" element-id="shaderpack_structure_dev"/>

## 管线 {id="pipeline"}

现代常用的渲染方法包括 [向前渲染法](shaderBasic.md#向前渲染法){summary=""} 和 [延迟渲染法](shaderBasic.md#延迟渲染法){summary=""} 。

OptiFine 使用的是延迟渲染法：
1. 在几何缓冲阶段将所有几何体按类型分批传入不同的着色器，并将计算结果写入缓冲区。
2. 在延迟处理阶段，计算颜色并输出结果。

不过你也可以忽略延迟渲染阶段，直接在几何缓冲阶段进行渲染。

> 我们约定将**没有半透明**效果或**仅有完全镂空纹理**（如树叶和普通玻璃）的几何体称为**固体几何**；  
> **有半透明**效果（如染色玻璃和水）的称为**半透明几何**；  
> **其他粒子**则称为**粒子几何**。
>
{style="note"}

OptiFine 接管了从 GUI 开始直到场景输出的全部管线，下图列出了整个画面输出流程：

<resource src="./ofpp_simple_bg.png">

![OptiFine 管线](ofpp_simple.png "OptiFine 管线")

</resource>

你可以单击图片查看和保存附带深色背景的大图。我们将在下一章了解每个程序的处理对象。

---

现在，你已经全面了解了 OptiFine 的光影包结构。在下一节中，我们将学习 GLSL 的语法并了解它的特性。
