# 着色器内配置的命令

<secondary-label ref="port"/>

<show-structure depth="3"/>

> 资料来源：[GitHub - OptiFineDoc "shaders.txt"](https://github.com/sp614x/optifine/blob/master/OptiFineDoc/doc/shaders.txt)

## 顶点着色器设置

`in vec3 mc_Entity;`
: 使用实体 ID 属性。

`in vec2 mc_midTexCoord;`
: 使用精灵纹理坐标中点属性。

`in vec4 at_tangent`
: 使用切线属性。

`const int countInstances = 1`
: 实例渲染，当 `countInstances > 1` 时，几何会多次渲染，见 [统一变量 - `instanceId`](a01-uniformsAndAts.md#uniforms){summary=""} 。

## 几何着色器设置

`extension GL_ARB_geometry_shader4 : enable`
: 启用 `GL_ARB_geometry_shader4`（几何着色器功能）。

`const int maxVerticesOut = 3;`
: 为几何着色器设置 `GEOMETRY_VERTICES_OUT_ARB`（几何着色器输出顶点数）。

## 片元着色器设置

### 纹理

`uniform <type> shadow;` 或 `uniform <type> shadowtex0;`
: 使用单阴影深度纹理。

`uniform <type> watershadow;` 或 `uniform <type> shadowtex1;`
: 使用双阴影深度纹理，覆盖上一项的设置。

#### 新帧清除

#### 多级渐进纹理

#### 纹理格式

### 输出

### 其他参数
