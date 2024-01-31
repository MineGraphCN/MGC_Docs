# 通用问题

::: warning 施工中
这篇文档正在编写中，可能会出现内容较少、不全和缺漏。
:::

这个板块记录了一些与游戏相关或会产生影响的常见问题。

## 我想知道电脑的配置

对于 Minecraft 来说，性能需求的下限和上限可谓大相径庭，下到树莓派流畅运行，上到专业游戏主机也会吃力。  
大多数玩家处于中间的区段，而由于或是使用家庭电脑，或是在外借用电脑，希望对配置能有一个快速的查询。

这里我们列出在**不安装额外软件**的情况下，Windows 上快速查询电脑配置的办法。

### 查询电脑 CPU 和内存容量

右击 `此电脑` 或 `计算机` ，点击 `属性` 即可查看 CPU 和内存。

![在计算机属性中查询配置](/images/library/troubleshoot/check_set.png)

在 Windows 10 / 11 中，还可以按 `Ctrl` + `Shift` + `Esc` 打开任务管理器，在*性能*选项卡中查看 *CPU*、*内存*、*硬盘*、*网络*和*显卡*信息。

![在任务管理器中查询配置](/images/library/troubleshoot/tskmgr_check_set.png)

### 查询电脑显卡

为了确定是否安装显卡，我们可以在 `设备管理器` 中查询电脑已识别的显卡列表。

方法1：右击 `开始菜单` 或 按下 `Windows` + `X` ，选择 `设备管理器` 。

![打开设备管理器的方法1](/images/library/troubleshoot/dvc_mgr_1.png)

方法2：打开 `开始菜单` ，搜索 *设备管理器* 或 *device manager* 或 *device mgr* 。

![打开设备管理器的方法2](/images/library/troubleshoot/dvc_mgr_2.png)

进入设备管理器，向下找到 `显示适配器` ，展开即为已识别的显卡。

![在设备管理器中查看显卡](/images/library/troubleshoot/dvc_mgr_check_gpu.png)

设备管理器中显示的显卡代表其**已安装**驱动程序，如果你不确定你的电脑所使用的显卡，你可以在 [下面](#安装显卡驱动) 提供的制造商官网中使用他们的工具进行检查。

## 独立显卡没有正确启用

有时候已知电脑有不错的独立显卡，但是游戏帧率还是过低，这种时候可以考虑是否安装*显卡驱动*。  
有些电脑含有*集成显卡*或 *CPU 核心显卡*，这种情况下需要在 *GPU 驱动程序* 中选择运行程序所使用的 GPU。

### 安装显卡驱动

根据已知的显卡型号和系统前往官网下载并安装即可。

- [Nvidia](https://www.nvidia.cn/Download/index.aspx?lang=cn)
- [AMD](https://www.amd.com/zh-hans/support)
- [Intel](https://www.intel.cn/content/www/cn/zh/search.html#sort=relevancy&f:@tabfilter=[Downloads]&f:@stm_10385_zh=[%E6%98%BE%E5%8D%A1])

安装完毕之后，你应该可以在*设备管理器*中看到对应的显卡。

### 选择运行 GPU

在 Windows 11 下，你可以直接在 `设置` > `系统` > `屏幕` > `相关设置 - 显示卡` 中调整 GPU。  
- 对于 *Minecraft JE* 来说，选择 `应用的自定义选项 - 添加应用 <桌面应用> - 浏览` ，找到你的 ***Java* 安装路径**，添加 `/bin/java.exe` 和 `/bin/javaw.exe` ，然后在下面的列表中，将它们调整为 `高性能` 并 `保存` 即可。

![在 Windows 11 设置中更改 JE GPU](/images/library/troubleshoot/change_gpu_in_win11_je.png)

- 对于 *Minecraft BE* 来说，你通常可以在下方菜单栏中直接找到，并且它的默认模式是 `让 Windows 决定(高性能)` 。如果软件不存在，你可以在 `应用的自定义选项 - 添加应用 <Microsoft Store 应用> - 浏览` 弹出的列表中寻找并添加。你也可以将其设定为 `高性能` 来强制使用独立显卡运行，避免出现问题。

![更改为添加 Microsoft Store 应用](/images/library/troubleshoot/change_store_apps.png)

在 Windows 10 以及更老的版本中，你需要打开 `驱动程序控制面板` ，并寻找类似 `程序设置` 的选项卡。

- Nvidia：
![在 Nvidia 控制面板中更改 GPU](/images/library/troubleshoot/change_gpu_in_nvidia.png)
- AMD：  
*由于编者中没有对应的 GPU ，此条目图片我们暂时无法提供，请根据 Nvidia 控制面板截图所示，在 AMD 控制面板中寻找对应选项。*
- Intel 独立显卡 *Intel Arc 系列* 极其罕见，大多数时候都是核心显卡，因此不需要设置就可以直接使用。
