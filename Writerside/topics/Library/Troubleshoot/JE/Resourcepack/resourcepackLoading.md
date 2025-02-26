# 资源包加载问题

<primary-label ref="manual"/>

<secondary-label ref="wip"/>
<secondary-label ref="je"/>
<secondary-label ref="resource"/>

## 高清资源包读取失败

使用贴图覆盖率和分辨率较高的资源包时，在资源包界面选取并读条之后，资源包被自动卸载（在高版本中还会在右上角提示 `资源包加载失败` ）。  
此时日志输出：
```log
Caused by: gel: Unable to fit: <纹理路径> - size: <纹理分辨率>, atlas: 16384x16384, atlasMax: 16384x16384 - Maybe try a lower resolution resourcepack?
	at gek.c(Stitcher.java:67) ~[gek.class:?]
	at gei.a(SpriteLoader.java:138) ~[gei.class:?]
	at gei.lambda$loadAndStitch$8(SpriteLoader.java:223) ~[gei.class:?]
	at java.util.concurrent.CompletableFuture$UniApply.tryFire(CompletableFuture.java:646) ~[?:?]
	... 8 more
```

这是由于纹理拼贴之后的纹理集大小超过了显卡的限制。尤其是 AMD，它的最大纹理集大小是 **16k**，而英伟达自帕斯卡架构开始是 **32k**。

- 如果你没有其他显卡，请选择低分辨率版本，或换用其他资源包。
