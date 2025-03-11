# Iris vs. OptiFine

<primary-label ref="hidden"/>

[//]: # (TODO)

## Iris 性能真的比 OF 好吗

## Iris 和 OptiFine 的兼容策略 {id="irisComp"}

原版着色器：不存在时使用原版，这样也就能渲染发光状态描边等原版效果。

模组着色器：管线冲突时直接屏蔽，否则将其按照类型一股脑倒入。

OptiFine：强制转换为其管线。

### 兼容性

## Iris 的底层漏洞 {id="irisIssues"}

缓冲区泄露，修不了，根本修不了


## Sodium 的底层漏洞 {id="sodiumIssues"}

![843595c23a9043a05b3fb9155e2cd5fe.jpg](sodiumBUG_01.jpg)
