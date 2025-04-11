# 纹理和像素

<show-structure depth="2"/>

<tldr>

纹理单元 ID 和纹理格式主要在 [](a03-shaderProp.md#customTex){summary=""} 中使用，也可用于设置缓冲区格式和混合方式。

像素类型和格式用于组织二进制转储文件中的数据格式和类型，以便正确解析数据并转换到对应纹理格式中。
</tldr>

## 纹理单元 ID {id="texID"}

### 几何缓冲

| ID   | 名称           | 旧名称                       |
|------|--------------|---------------------------|
| `0`  | gtexture     | texture                   |
| `1`  | lightmap     |                           |
| `2`  | normals      |                           |
| `3`  | specular     |                           |
| `4`  | shadowtex0   | shadow, watershadow       |
| `5`  | shadowtex1   | shadow（如果使用了 watershadow） |
| `6`  | depthtex0    |                           |
| `7`  | gaux1        | colortex4 <自定义纹理或从延迟处理输出> |
| `8`  | gaux2        | colortex5 <自定义纹理或从延迟处理输出> |
| `9`  | gaux3        | colortex6 <自定义纹理或从延迟处理输出> |
| `10` | gaux4        | colortex7 <自定义纹理或从延迟处理输出> |
| `12` | depthtex1    |                           |
| `13` | shadowcolor0 | shadowcolor               |
| `14` | shadowcolor1 |                           |
| `15` | noisetex     |                           |
| `16` | colortex8    | <自定义纹理或从延迟处理输出>           |
| `17` | colortex9    | <自定义纹理或从延迟处理输出>           |
| `18` | colortex10   | <自定义纹理或从延迟处理输出>           |
| `19` | colortex11   | <自定义纹理或从延迟处理输出>           |
| `20` | colortex12   | <自定义纹理或从延迟处理输出>           |
| `21` | colortex13   | <自定义纹理或从延迟处理输出>           |
| `22` | colortex14   | <自定义纹理或从延迟处理输出>           |
| `23` | colortex15   | <自定义纹理或从延迟处理输出>           |

{width="700"}

### 阴影几何缓冲

| ID   | Name         | Legacy name               |
|------|--------------|---------------------------|
| `0`  | gtexture     | texture                   |
| `1`  | lightmap     |                           |
| `2`  | normals      |                           |
| `3`  | specular     |                           |
| `4`  | shadowtex0   | shadow, watershadow       |
| `5`  | shadowtex1   | shadow（如果使用了 watershadow） |
| `7`  | gaux1        | colortex4 <自定义纹理>         |
| `8`  | gaux2        | colortex5 <自定义纹理>         |
| `9`  | gaux3        | colortex6 <自定义纹理>         |
| `10` | gaux4        | colortex7 <自定义纹理>         |
| `13` | shadowcolor0 | shadowcolor               |
| `14` | shadowcolor1 |                           |
| `15` | noisetex     |                           |
| `16` | colortex8    | <自定义纹理>                   |
| `17` | colortex9    | <自定义纹理>                   |
| `18` | colortex10   | <自定义纹理>                   |
| `19` | colortex11   | <自定义纹理>                   |
| `20` | colortex12   | <自定义纹理>                   |
| `21` | colortex13   | <自定义纹理>                   |
| `22` | colortex14   | <自定义纹理>                   |
| `23` | colortex15   | <自定义纹理>                   |

{width="700"}

### 延迟处理

| ID   | Name         | Legacy name               |
|------|--------------|---------------------------|
| `0`  | colortex0    | gcolor                    |
| `1`  | colortex1    | gdepth                    |
| `2`  | colortex2    | gnormal                   |
| `3`  | colortex3    | composite                 |
| `4`  | shadowtex0   | shadow, watershadow       |
| `5`  | shadowtex1   | shadow（如果使用了 watershadow） |
| `6`  | depthtex0    | gdepthtex                 |
| `7`  | colortex4    | gaux1                     |
| `8`  | colortex5    | gaux2                     |
| `9`  | colortex6    | gaux3                     |
| `10` | colortex7    | gaux4                     |
| `11` | depthtex1    |                           |
| `12` | depthtex2    |                           |
| `13` | shadowcolor0 | shadowcolor               |
| `14` | shadowcolor1 |                           |
| `15` | noisetex     |                           |
| `16` | colortex8    |                           |
| `17` | colortex9    |                           |
| `18` | colortex10   |                           |
| `19` | colortex11   |                           |
| `20` | colortex12   |                           |
| `21` | colortex13   |                           |
| `22` | colortex14   |                           |
| `23` | colortex15   |                           |

{width="700"}

### 映像读写

所有程序都可以用 `colorimg<0-5>` 和 `shadowcolorimg<0-1>` 来访问 `colortex<0-5>` 和 `shadowcolor<0-1>`。

比如：
```glsl
layout(rgba8) uniform image2D colorimg0;
```

读写 `image` 格式需要 `ARB_shader_image_load_store` 扩展或 GLSL 4.20 以上。

## 纹理格式 {id="texFormat"}

### 8 位

| 归一化   | 带符号的归一化     | 整数     | 无符号整数 * |
|-------|-------------|--------|---------|
| R8    | R8_SNORM    | R8I    | R8I     |
| RG8   | RG8_SNORM   | RG8I   | RG8I    |
| RGB8  | RGB8_SNORM  | RGB8I  | RGB8I   |
| RGBA8 | RGBA8_SNORM | RGBA8I | RGBA8I  |

{width="700"}

\* 原文如此，实际测试后应该以 `UI` 结尾，向这种类型写入负值时会溢出到最大值。

> 8 位通道不支持非归一化浮点类型。

### 16 位

| 归一化    | 带符号的归一化      | 浮点      | 整数      | 无符号整数    |
|--------|--------------|---------|---------|----------|
| R16    | R16_SNORM    | R16F    | R16I    | R16UI    |
| RG16   | RG16_SNORM   | RG16F   | RG16I   | RG16UI   |
| RGB16  | RGB16_SNORM  | RGB16F  | RGB16I  | RGB16UI  |
| RGBA16 | RGBA16_SNORM | RGBA16F | RGBA16I | RGBA16UI |

{width="700"}

### 32 位

| 浮点      | 整数      | 无符号整数    |
|---------|---------|----------|
| R32F    | R32I    | R32UI    |
| RG32F   | RG32I   | RG32UI   |
| RGB32F  | RGB32I  | RGB32UI  |
| RGBA32F | RGBA32I | RGBA32UI |

{width="700"}

> 32 位通道不支持归一化浮点类型。

### 混合

除了上述逐通道 8/16/32 位的纹理格式，还支持下列混合之后共用位数的格式：

- R3_G3_B2（共 8 位）
- RGB5_A1（共 16 位）
- RGB9_E5（共 32 位）
- R11F_G11F_B10F（共 32 位）
- RGB10_A2（共 32 位）

{columns="3"}

## 像素格式 {id="pxFormat"}

### 归一化

- RED
- RGB
- BGR
- RG
- RGBA
- BGRA

{columns="3"}

### 整数

- RED_INTEGER
- RGB_INTEGER
- BGR_INTEGER
- RG_INTEGER
- RGBA_INTEGER
- BGRA_INTEGER

{columns="3"}

## 像素类型 {id="pxType"}

- BYTE
- UNSIGNED_INT
- SHORT
- UNSIGNED_INT_8_8_8_8
- INT
- UNSIGNED_INT_8_8_8_8_REV
- HALF_FLOAT
- UNSIGNED_INT_10_10_10_2
- FLOAT
- UNSIGNED_INT_2_10_10_10_REV
- UNSIGNED_SHORT
- UNSIGNED_SHORT_5_6_5
- UNSIGNED_SHORT_5_6_5_REV
- UNSIGNED_SHORT_4_4_4_4
- UNSIGNED_SHORT_4_4_4_4_REV
- UNSIGNED_BYTE
- UNSIGNED_SHORT_5_5_5_1
- UNSIGNED_BYTE_3_3_2
- UNSIGNED_SHORT_1_5_5_5_REV
- UNSIGNED_BYTE_2_3_3_REV

{columns="2"}
