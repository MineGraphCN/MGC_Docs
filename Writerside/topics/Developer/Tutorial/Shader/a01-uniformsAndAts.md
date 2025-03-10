# OptiFine 提供的数据

<secondary-label ref="port"/>

<show-structure depth="3"/>

<tldr>

本附录列出了所有 OptiFine 提供的统一变量和顶点属性，你可以直接复制并保存至一个文件以便今后直接 `#include` 。

此外，我们还列出了所有标准宏，它们在链接文件时自动包含在程序中，你可以直接在着色器中随意取用这些宏。

</tldr>

> 资料来源 [GitHub - OptiFineDoc "shaders.txt"](https://github.com/sp614x/optifine/blob/master/OptiFineDoc/doc/shaders.txt)

## 统一变量 {id="uniforms"}

```glsl
uniform int heldItemId;                   //手持物品ID (主手)，只用于在 item.properties 中有定义的方块
uniform int heldBlockLightValue;          //手持物品光照值 (主手)
uniform int heldItemId2;                  //手持物品ID (副手)，只用于在 item.properties 中有定义的方块
uniform int heldBlockLightValue2;         //手持物品光照值 (副手)
uniform int fogMode;                      //GL_LINEAR，GL_EXP 或 GL_EXP2
uniform float fogStart;                   //雾气渐入开始距离 (米)
uniform float fogEnd;                     //雾气渐入结束距离 (米)
uniform int fogShape;                     //0 = 球体, 1 = 圆柱体
uniform float fogDensity;                 //0.0-1.0
uniform vec3 fogColor;                    //r, g, b
uniform vec3 skyColor;                    //r, g, b
uniform int worldTime;                    //<ticks> = worldTicks % 24000
uniform int worldDay;                     //<days> = worldTicks / 24000
uniform int moonPhase;                    //0-7
uniform int frameCounter;                 //帧索引 (0 到 720719, 然后重置为 0)
uniform float frameTime;                  //上一帧用时，秒
uniform float frameTimeCounter;           //运行时间，秒 (3600 秒后重置为 0)
uniform float sunAngle;                   //0.0-1.0 ~ 0-23214 12785日-12786月 = .5
uniform float shadowAngle;                //0.0-1.0 ~ 同步 sunAngle 的前半周期
uniform float rainStrength;               //0.0-1.0
uniform float aspectRatio;                //viewWidth / viewHeight
uniform float viewWidth;                  //窗口宽
uniform float viewHeight;                 //窗口高
uniform float near;                       //近平面距离
uniform float far;                        //远平面距离
uniform vec3 sunPosition;                 //视口空间的太阳位置
uniform vec3 moonPosition;                //视口空间的月亮位置
uniform vec3 shadowLightPosition;         //视口空间的投影光源 (日或月) 位置
uniform vec3 upPosition;                  //天顶方向
uniform vec3 cameraPosition;              //世界空间的摄像机位置
uniform vec3 previousCameraPosition;      //上一帧的摄像机位置
uniform mat4 gbufferModelView;            //设置了摄像机变换的模型视口矩阵
uniform mat4 gbufferModelViewInverse;     //gbufferModelView 的逆
uniform mat4 gbufferPreviousModelView;    //上一帧的 gbufferModelView
uniform mat4 gbufferProjection;           //生成几何缓冲时的投影矩阵
uniform mat4 gbufferProjectionInverse;    //gbufferProjection 的逆
uniform mat4 gbufferPreviousProjection;   //上一帧的 gbufferProjection
uniform mat4 shadowProjection;            //生成阴影贴图时的投影矩阵
uniform mat4 shadowProjectionInverse;     //shadowProjection 的逆
uniform mat4 shadowModelView;             //生成阴影贴图时的模型视口矩阵
uniform mat4 shadowModelViewInverse;      //shadowModelView 的逆
uniform float wetness;                    //由 wetnessHalfLife 或 drynessHalfLife 平滑的 rainStrength
uniform float eyeAltitude;                //观察实体的 Y 坐标
uniform ivec2 eyeBrightness;              //x = 方块亮度，y = 天空亮度，强度 0-15 = 亮度 0-240
uniform ivec2 eyeBrightnessSmooth;        //由 eyeBrightnessHalflife 平滑的 eyeBrightness
uniform int isEyeInWater;                 //1 = 摄像机在水中, 2 = 摄像机在熔岩中, 3 = 摄像机在细雪中
uniform float nightVision;                //夜视 (0.0-1.0)
uniform float blindness;                  //失明 (0.0-1.0)
uniform float screenBrightness;           //原版亮度 (0.0-1.0)
uniform int hideGUI;                      //已隐藏GUI
uniform float centerDepthSmooth;          //由 centerDepthSmoothHalflife 平滑的 centerDepth
uniform ivec2 atlasSize;                  //纹理拼贴尺寸 (只在拼贴纹理装在时设置)
uniform vec4 spriteBounds;                //纹理拼贴上的精灵图边界 (u0, v0, u1, v1)，当 MC_ANISOTROPIC_FILTERING 启用时设置
uniform vec4 entityColor;                 //实体颜色乘数 (实体受击、苦力怕爆炸时的闪烁)
uniform int entityId;                     //实体 ID
uniform int blockEntityId;                //方块实体 ID (用于瓦片实体的方块 ID，只用于在 block.properties 中有定义的方块)
uniform ivec4 blendFunc;                  //混合函数 (源RGB, 目标RGB, 源Alpha, 目标Alpha)
uniform int instanceId;                   //启用实例渲染时的实例 ID (countInstances > 1), 0 = 源，1-N = 拷贝
uniform float playerMood;                 //玩家氛围 (0.0-1.0)，当玩家长时间处于地下时增长
uniform int renderStage;                  //渲染阶段, 见标准宏和渲染阶段
uniform int bossBattle;                   //1 = 自定义, 2 = 末影龙, 3 = 凋灵, 4 = 劫掠
// 1.17+
uniform mat4 modelViewMatrix;             //模型视口矩阵，替换 gl_ModelViewMatrix，下同
uniform mat4 modelViewMatrixInverse;      //模型视口矩阵的逆
uniform mat4 projectionMatrix;            //投影矩阵
uniform mat4 projectionMatrixInverse;     //投影矩阵的逆
uniform mat4 textureMatrix;               //纹理矩阵，默认是单位矩阵
uniform mat3 normalMatrix;                //法线矩阵
uniform vec3 chunkOffset;                 //地形区块起始位置，和属性 vaPosition 一起使用
uniform float alphaTestRef;               //alpha测试参考值, 使用 "if (color.a < alphaTestRef) discard;" 进行检查
// 1.19+
uniform float darknessFactor;             //黑暗效果强度 (0.0-1.0)
uniform float darknessLightFactor;
```

### 纹理

#### 通用

```glsl
uniform sampler2D shadowtex0;
uniform sampler2D shadowtex1;

uniform sampler2D depthtex0;
uniform sampler2D depthtex1;
uniform sampler2D depthtex2;

uniform sampler2D colortex4;
uniform sampler2D colortex5;
uniform sampler2D colortex6;
uniform sampler2D colortex7;
uniform sampler2D colortex8;
uniform sampler2D colortex9;
uniform sampler2D colortex10;
uniform sampler2D colortex11;
uniform sampler2D colortex12;
uniform sampler2D colortex13;
uniform sampler2D colortex14;
uniform sampler2D colortex15;

uniform sampler2D shadowcolor0;
uniform sampler2D shadowcolor1;

uniform sampler2D noisetex;
```

#### 几何缓冲专用

```glsl
uniform sampler2D gtexture;
uniform sampler2D lightmap;
uniform sampler2D normals;
uniform sampler2D specular;
```

#### 延迟处理专用

```glsl
uniform sampler2D colortex0;
uniform sampler2D colortex1;
uniform sampler2D colortex2;
uniform sampler2D colortex3;
```

> 你可以利用 `#define` 来判断当前着色器程序，然后根据程序声明专用纹理。

## 顶点属性 {id="attributes"}

```glsl
in vec3 vaPosition;       //position (x, y, z)          1.17+，对于地形（terrain）来说是区块起始位置，需要配合 chunkOffset 使用
in vec4 vaColor;          //color (r, g, b, a)          1.17+
in vec2 vaUV0;            //texture (u, v)              1.17+
// in ivec2 vaUV1;        //overlay (u, v)              1.17+，在原版中的作用被 entityColor 替代，若在 Iris 中声明此属性可能导致报错
in ivec2 vaUV2;           //lightmap (u, v)             1.17+
in vec3 vaNormal;         //normal (x, y, z)            1.17+
in vec3 mc_Entity;        //xy = 方块ID, 渲染器类型       方块 ID 只用于在 block.properties 中有定义的方块
in vec2 mc_midTexCoord;   //st = midTexU, midTexV       精灵图的纹理中央UV
in vec4 at_tangent;       //xyz = 切向量, w = 手系
in vec3 at_velocity;      //上一帧的顶点偏移量             视口坐标，仅实体和方块实体
in vec3 at_midBlock;      //像方块中心偏移1/64m           仅方块
```

## 标准宏

标准宏会在每个着色器文件的 `#version` 行后自动包含

Minecraft 版本
:
```glsl
#define MC_VERSION <value>
```
值为 122 格式（主 1, 次 2, 发布 2）
例如：**JE 1.9.4** -> `10904`、**JE 1.11.2** -> `11102` 等。

最高支持的 GL 版本
:
```glsl
#define MC_GL_VERSION <value>
```
整形值，例如：210、320、450

最高支持的 GLSL 版本
:
```glsl
#define MC_GLSL_VERSION <value>
```
整形值，例如：120、150、450

操作系统
:
下列之一：
```glsl
#define MC_OS_WINDOWS
#define MC_OS_MAC
#define MC_OS_LINUX
#define MC_OS_OTHER
```

驱动程序
:
下列之一：
```glsl
#define MC_GL_VENDOR_AMD
#define MC_GL_VENDOR_ATI
#define MC_GL_VENDOR_INTEL
#define MC_GL_VENDOR_MESA
#define MC_GL_VENDOR_NVIDIA
#define MC_GL_VENDOR_XORG
#define MC_GL_VENDOR_OTHER
```

GPU
:
下列之一：
```glsl
#define MC_GL_RENDERER_RADEON 
#define MC_GL_RENDERER_GEFORCE
#define MC_GL_RENDERER_QUADRO
#define MC_GL_RENDERER_INTEL
#define MC_GL_RENDERER_GALLIUM
#define MC_GL_RENDERER_MESA
#define MC_GL_RENDERER_OTHER
```

OpenGL 扩展
: 受支持的 OpenGL 扩展与前缀为 `MC_` 的宏同名。
例如，当支持扩展 `GL_ARB_shader_texture_lod` 时，会定义宏 `MC_GL_ARB_shader_text_lod` 。
只有引用了且支持的宏才会被添加到着色器中。

设置
:
```glsl
#define MC_FXAA_LEVEL <value>             // 当 FXAA 启用时，值：2、4
#define MC_NORMAL_MAP                     // 当法线贴图启用时
#define MC_SPECULAR_MAP                   // 当高光贴图启用时
#define MC_RENDER_QUALITY <value>         // 值：0.5、0.70710677、1.0、1.4142135、2.0
#define MC_SHADOW_QUALITY <value>         // 值：0.5、0.70710677、1.0、1.4142135、2.0
#define MC_HAND_DEPTH <value>             // 值：0.0625、0.125、0.25
#define MC_OLD_HAND_LIGHT                 // 当经典手持光源启用时
#define MC_OLD_LIGHTING                   // 当经典光照启用时
#define MC_ANISOTROPIC_FILTERING <value>  // 当各向异性过滤启用时
```

纹理
: 见 [OptiFineDoc "texture.properties"](https://github.com/sp614x/optifine/blob/master/OptiFineDoc/doc/texture.properties)
```glsl
 #define MC_TEXTURE_FORMAT_LAB_PBR       // LabPBR 纹理格式 ([[[Wiki|https://wiki.shaderlabs.org/wiki/LabPBR_Material_Standard]]])
 #define MC_TEXTURE_FORMAT_LAB_PBR_1_3   // 版本 1.3
```
你也可以在站内找到 [LabPBR 格式的翻译版本](labpbrMaterialStandard.md){summary=""}

渲染阶段
: `const` 用于统一变量 `renderStage` ，按照执行顺序给出
```glsl
#define MC_RENDER_STAGE_NONE <const>                    // 未定义
#define MC_RENDER_STAGE_SKY <const>                     // 天空
#define MC_RENDER_STAGE_SUNSET <const>                  // 日出和日落的天空覆盖
#define MC_RENDER_STAGE_CUSTOM_SKY <const>              // 自定义天空
#define MC_RENDER_STAGE_SUN <const>                     // 太阳
#define MC_RENDER_STAGE_MOON <const>                    // 月亮
#define MC_RENDER_STAGE_STARS <const>                   // 星星
#define MC_RENDER_STAGE_VOID <const>                    // 虚空
#define MC_RENDER_STAGE_TERRAIN_SOLID <const>           // 固体地形
#define MC_RENDER_STAGE_TERRAIN_CUTOUT_MIPPED <const>   // 多级渐进纹理裁切固体地形
#define MC_RENDER_STAGE_TERRAIN_CUTOUT <const>          // 裁切固体地形
#define MC_RENDER_STAGE_ENTITIES <const>                // 实体
#define MC_RENDER_STAGE_BLOCK_ENTITIES <const>          // 方块实体
#define MC_RENDER_STAGE_DESTROY <const>                 // 挖掘覆盖
#define MC_RENDER_STAGE_OUTLINE <const>                 // 方块选择框
#define MC_RENDER_STAGE_DEBUG <const>                   // 调试渲染
#define MC_RENDER_STAGE_HAND_SOLID <const>              // 固体手持物品
#define MC_RENDER_STAGE_TERRAIN_TRANSLUCENT <const>     // 半透明地形
#define MC_RENDER_STAGE_TRIPWIRE <const>                // 绊线
#define MC_RENDER_STAGE_PARTICLES <const>               // 粒子
#define MC_RENDER_STAGE_CLOUDS <const>                  // 云
#define MC_RENDER_STAGE_RAIN_SNOW <const>               // 雨雪
#define MC_RENDER_STAGE_WORLD_BORDER <const>            // 世界边界
#define MC_RENDER_STAGE_HAND_TRANSLUCENT <const>        // 半透明手持物品
```
