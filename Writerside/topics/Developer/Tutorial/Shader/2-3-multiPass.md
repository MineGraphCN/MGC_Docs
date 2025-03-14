# 多着色器处理

## 着色器性能

## 应用

如果你还记得我们之前的模糊效果，你现在也可以将它封装成一个函数然后搬过来并设置一个开关
```glsl
vec3 doBlur(sampler2D src, vec2 uv) {
    vec3 result;
    int count = 0;
    for(int i = -2; i <= 2; ++i) {
        for(int j = -2; j <= 2; ++j) {
            vec2 uv_displaced = uv + vec2(i, j) * pixelSize;
            if(uv_OutBound(uv_displaced)) { continue; }
            result += texture(colortex0, uv_displaced).rgb;
            ++count;
        }
    }
    return result / float(count);
}
```
{collapsible="true" collapsed-title="Utilities.glsl" default-state="expanded"}

```glsl
#define AVG_BLUR
```
{collapsible="true" collapsed-title="Settings.glsl" default-state="expanded"}

```glsl
[...]
#ifdef AVG_BLUR
fragColor.rgb = vec4(doBlur(colortex0, uv), 1.0);
#else
fragColor = texture(colortex0, uv);
#endif
```
{collapsible="true" collapsed-title="final.fsh" default-state="expanded"}
