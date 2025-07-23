# 核心配置中可用的内建变量

<tldr>

在 `core` 配置中，大多数以 `gl_` 为前缀的内置变量（如 `gl_ModelViewMatrix`、`gl_Vertex` 等）已被移除，因为它们与固定功能管线紧密相关。

然而，仍有一些用于输入／输出和特殊功能的变量可用，这里列出了它们的用途。需要注意的是，OptiFine 不一定支持这些变量所对应的特性。
</tldr>

## 顶点着色器

### 输出变量

`gl_Position`
:
  - 类型：`vec4`
  - 用途：定义顶点的裁剪空间位置。**必须**由顶点着色器写入。

`gl_PointSize`
:
  - 类型：`float`
  - 用途：定义点精灵（Point Sprite）的大小。可选写入。

`gl_ClipDistance[]`
:
  - 类型：`float[]`
  - 用途：定义用户自定义的裁剪距离，用于裁剪平面（Clip Plane）。可选写入。

### 输入变量

`gl_VertexID`
:
  - 类型：`int`
  - 用途：当前顶点的索引（从 0 开始）。

`gl_InstanceID`
:
  - 类型：`int`
  - 用途：当前实例的索引（用于实例化渲染）。

`gl_DrawID`
: 要求 OpenGL 4.6+
  - 类型：`int`
  - 用途：当前绘制调用的索引（用于多绘制间接命令）。

`gl_BaseVertex`
: 要求 OpenGL 4.6+
  - 类型：`int`
  - 用途：当前绘制调用的基顶点索引（用于索引绘制）。

`gl_BaseInstance`
: 要求 OpenGL 4.6+
  - 类型：`int`
  - 用途：当前绘制调用的基实例索引（用于实例化渲染）。

## 片元着色器

### 输入变量

`gl_FragCoord`
:
  - 类型：`vec4`
  - 用途：当前片元在窗口空间中的坐标（`(x, y, z, 1/w)`）。

`gl_FrontFacing`
:
  - 类型：`bool`
  - 用途：指示当前片元是否属于正面图元。

`gl_PointCoord`
:
  - 类型：`vec2`
  - 用途：当前片元在点精灵中的纹理坐标（范围为 $[0, 1]$）。

`gl_ClipDistance[]`
:
  - 类型：`float[]`
  - 用途：从顶点着色器传递的裁剪距离。

`gl_PrimitiveID`
:
  - 类型：`int`
  - 用途：当前图元的索引（用于几何着色器或细分着色器）。

`gl_Layer`
: 要求 OpenGL 4.1+
  - 类型：`int`
  - 用途：当前片元所属的图层（用于分层渲染）。

`gl_ViewportIndex`
: 要求 OpenGL 4.1+
  - 类型：`int`
  - 用途：当前片元所属的视口索引（用于多视口渲染）。

### 输出变量

`gl_FragDepth`
:
  - 类型：`float`
  - 用途：自定义片元的深度值。可选写入，默认值为 `gl_FragCoord.z`。

## 几何着色器

`gl_PrimitiveIDIn`
:
  - 类型：`int`
  - 用途：输入图元的索引。

`gl_Layer`
:
  - 类型：`int`
  - 用途：输出图元所属的图层（用于分层渲染）。

`gl_ViewportIndex`
:
  - 类型：`int`
  - 用途：输出图元所属的视口索引（用于多视口渲染）。

## 计算着色器

`gl_GlobalInvocationID`
:
  - 类型：`uvec3`
  - 用途：当前工作项的全局调用 ID。

`gl_LocalInvocationID`
:
  - 类型：`uvec3`
  - 用途：当前工作项在本地工作组内的 ID。

`gl_WorkGroupID`
:
  - 类型：`uvec3`
  - 用途：当前工作组的 ID。

`gl_NumWorkGroups`
:
  - 类型：`uvec3`
  - 用途：全局工作组的总数。
