# 高级大气

## 物理天空

### Prepare 阶段

### 大气散射

### 环境光照

#### 散射查找表

## 雾气与光照

Forward:
$$
\Sigma F = \sum_{i=1}^{n-1}{[(1-V_i)F_{i-1}+V_iF_i]}
$$$$
C =
\begin{dcases}
V_nC_0+(1-V_n)\Sigma F &,\ V_n > 0 \\
(1-V_n)\Sigma F &,\ \underline{V_n = 0}
\end{dcases}
$$
Needed: `for()` can be `break` .

Backward:
$$
C_1 = V_1 C_0 + (1-V_1)F_1 \Longrightarrow
C = C_n = V_{n} \underline{C_{n-1}} + (1-V_{n})F_{n}
$$
Needed: `for()` can**not** be `break` .

See:
$$
C_0 = \text{Soild Color}, F = D_t\cdot E(p,f,\rho)
$$$$
V_1 = e^{-\beta L_1},
V_2 = e^{-\beta (L_1+L_2)} = V_1e^{-\beta L_2}
\Longrightarrow V_n = V_{n-1}e^{-\beta L_n} = \prod_{i=1}^n{e^{-\beta L_i}} = \underline{e^{-\beta \sum_1^n L}}
$$

### 外太空
