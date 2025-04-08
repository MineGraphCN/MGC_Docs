# 纹理和像素格式

<tldr>

纹理格式主要搭配 [](a03-shaderProp.md#customTex){summary=""} 使用，也可用于自定义缓冲区格式。

像素类型和格式用于组织二进制转储文件中的数据格式和类型，正确解析数据并转换到对应纹理格式中。
</tldr>

## 纹理格式 {id="texFormat"}

### 8 位

| 归一化   | 带符号的归一化     | 整数     | 无符号整数  |
|-------|-------------|--------|--------|
| R8    | R8_SNORM    | R8I    | R8I    |
| RG8   | RG8_SNORM   | RG8I   | RG8I   |
| RGB8  | RGB8_SNORM  | RGB8I  | RGB8I  |
| RGBA8 | RGBA8_SNORM | RGBA8I | RGBA8I |

### 16 位

| 归一化    | 带符号的归一化      | 浮点      | 整数      | 无符号整数    |
|--------|--------------|---------|---------|----------|
| R16    | R16_SNORM    | R16F    | R16I    | R16UI    |
| RG16   | RG16_SNORM   | RG16F   | RG16I   | RG16UI   |
| RGB16  | RGB16_SNORM  | RGB16F  | RGB16I  | RGB16UI  |
| RGBA16 | RGBA16_SNORM | RGBA16F | RGBA16I | RGBA16UI |

### 32 位

| 浮点      | 整数      | 无符号整数    |
|---------|---------|----------|
| R32F    | R32I    | R32UI    |
| RG32F   | RG32I   | RG32UI   |
| RGB32F  | RGB32I  | RGB32UI  |
| RGBA32F | RGBA32I | RGBA32UI |

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
