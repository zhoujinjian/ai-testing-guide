---
title: 13 UI 自动化·脚本健壮性增强：ui-testscript-enhancer
description: AI 测试实战系列第 13 篇。为已生成脚本补健壮性：智能等待替代硬编码 sleep、验证码与意外弹窗处理、iframe 与 Shadow DOM 穿透、失败证据自动保全，治好「本地能跑、上 CI 就挂」。
---

# AI 测试实战系列 13｜UI 自动化·脚本健壮性增强：ui-testscript-enhancer

> AI 测试实战系列（共 19 篇）｜ 01 用例设计（接口/UI 通用） · 接口自动化 02-10 · UI 自动化 11-19 ｜ 本文第 13 篇

---

![](https://image.kjdaohang.com/img/20260804075405565.png)

上一篇我们用 `ui-testscript-generator` 解决了「脚本批量生成」的问题，几分钟就拿到了完整的 UI 自动化工程。

但如果你真的拿这些脚本去跑一遍，大概率会遇到这样的情况：

**本地跑得好好的，一上 CI 就挂。昨天还能过，今天突然挂。环境没变，但偶尔就挂。**

这不是你的脚本逻辑写错了，是脚本不够「健壮」。

![](https://image.kjdaohang.com/img/20260804074809803.png)

写过 UI 自动化的同学，下面的场景应该都很熟悉：

- **硬编码 sleep，时灵时不灵。** 等 3 秒可能够了，也可能不够，网络慢一点就超时。更坑的是，等多久全靠拍脑袋，换台机器就不一样。
- **验证码拦路，自动化直接卡死。** 登录页一个图形验证码，就能让整个测试流程断掉。手动输入？CI 环境谁帮你输？
- **意外弹窗突然蹦出来。** 广告弹窗、权限申请、系统通知、Cookie 提示......脚本没有处理逻辑，直接报错中断。
- **iframe 和 Shadow DOM 穿不进去。** 页面里嵌了一层 iframe，或者用了 Shadow DOM 封装组件，定位策略在主文档里找不到元素，脚本报 NoSuchElementException。
- **失败了不知道为什么。** 脚本挂了，终端只有一行 `AssertionError`，没有截图，没有录屏，没有网络日志，你完全不知道挂的那一刻页面长什么样。
- **偶发失败，重跑又过了。** 网络波动、动画未完成、元素延迟加载，这些偶发问题导致脚本不稳定，大家开始习惯性地「重跑一下试试」，测试结果可信度越来越低。

**能跑的脚本和跑得稳的脚本，中间隔着一整层工程化逻辑。** 这层逻辑，就是「健壮性」。

> 那能不能用 Agent Skill 把这层健壮性逻辑自动补全？

答案当然是可以。

核心思路是，**AI 负责扫描和增强，人负责确认和微调。**

这篇文章就带你完整拆解这个过程。

## 一、ui-testscript-enhancer 在整条链路中的位置

先看一下这个 Skill 在完整链路里的位置：

```bash
页面 URL / DOM 结构 / 用例描述
  │
  ▼
ui-page-parser ──→ 标准化页面定义 (pages.yaml)
  │
  ▼
ui-testscript-generator ──→ POM + 测试脚本 + 测试数据
  │
  ▼
ui-testscript-enhancer ──→ 健壮性增强（等待+异常+弹窗+验证码+截图）  ← 这一篇
  │
  ├──→ ui-visual-assert ──→ 视觉断言 + 多浏览器适配
  │         │
  │         ▼
  │   ui-auto-maintainer ──→ 页面变更检测 + 定位自愈
  │
  └──→ 增强后的脚本可直接接入 CI/CD 执行
```

上一步 `ui-testscript-generator` 输出的是「能跑」的基础脚本。`ui-testscript-enhancer` 做的事情，就是把这些基础脚本升级成「跑得稳」的生产级脚本。

**它解决的核心问题是，区分「demo 级脚本」和「生产级脚本」的那道分水岭。**

| 脚本类型 | 特征 | 问题 |
| :--- | :--- | :--- |
| **demo 级脚本** | 逻辑正确，本地能跑 | 上 CI 就挂、偶发失败、失败无法追溯 |
| **生产级脚本** | 智能等待、异常容错、失败追溯、验证码处理 | 稳定可靠、可维护、可诊断 |

从 demo 级到生产级，中间需要补的东西，就是这个 Skill 的工作量。

## 二、ui-testscript-enhancer skill 技能介绍

### 为什么这一步绕不过去？

很多人觉得，脚本生成完了不就可以跑了吗，为什么还需要单独一步「增强」？

因为 UI 自动化的运行环境太复杂了。

**网络时序不确定。** 页面加载、Ajax 请求、动画过渡，这些都是异步的。你用 `sleep(3)` 等待，可能 90% 的时候够了，但剩下 10% 的时候网络一慢就超时了。CI 环境的资源通常比本地差，超时概率更高。

**页面干扰因素太多。** 弹窗、Toast、广告浮层、Cookie 授权条......这些在手动测试时随手关掉就行，但在自动化脚本里，一个未处理的 `dialog` 事件就能让整个用例挂掉。

**验证码是硬门槛。** 登录页的验证码不解决，后续所有需要登录态的测试都跑不了。这在实际项目中是最常见的「卡脖子」场景。

**失败场景缺乏诊断信息。** 脚本挂了之后，如果只有一行错误日志，你根本不知道当时页面是什么状态。是元素没加载出来？还是页面跳转了？还是弹窗挡住了？没有截图和录屏，排查全靠猜。

**这些问题不会在开发阶段全部暴露，但一旦上 CI、跑回归、跑定时任务，就会集中爆发。** 所以健壮性增强这一步，不是锦上添花，是生产级 UI 自动化的必经之路。

### 我的方案

**ui-testscript-enhancer** 是专门用于对已生成的基础 UI 测试脚本进行自动化增强的 Skill。

它接收基础脚本及页面交互规则，逐文件扫描分析，自动补全智能等待、弹窗处理、iframe 切换、异常重试、失败截图与录屏、验证码识别等能力，完成脚本加固，提升运行稳定性。

**核心能力（六大增强维度）：**

**1. 智能等待补全**

| 等待场景 | 传统做法 | 增强后 |
| :--- | :--- | :--- |
| 页面初始加载 | `sleep(3)` 硬编码 | `page.goto(url, wait_until="networkidle")` |
| 元素可见性 | 轮询 `isDisplayed()` | `expect(locator).toBeVisible()` |
| Ajax 异步请求 | 固定等待 + 重试 | `page.waitForResponse()` |
| 动画过渡效果 | 盲目等待 | 检测 CSS transition，等待动画完成 |
| 元素状态变更 | 频繁轮询 | `expect(locator).toBeEnabled()` |
| 弹窗/Toast 出现 | 固定等待后查找 | `page.waitForSelector()` 或事件监听 |

**2. 弹窗与干扰处理**

自动检测意外弹窗（广告、权限申请、Cookie 提示），尝试关闭并继续执行。Toast 消息自动捕获与断言。

**3. iframe / Shadow DOM 处理**

自动识别 iframe 嵌套，切换上下文，定位内部元素。Shadow DOM 穿透定位，不再卡在「找不到元素」。

**4. 异常重试与容错**

| 异常场景 | 增强逻辑 |
| :--- | :--- |
| 元素未找到 | 自动重试 3 次 → 截图存档 → 记录日志 → 标记失败 |
| 页面崩溃/无响应 | 自动刷新页面 → 恢复执行上下文 → 或标记失败并录屏 |
| 网络断开/超时 | 自动重试请求 → 检查网络状态 → 超时后优雅失败 |
| 浏览器兼容性差异 | 自动检测浏览器类型 → 适配特定行为 |

**5. 失败追溯增强**

自动截图（失败时全页截图）、自动录屏（Trace 文件）、自动记录网络请求日志。**脚本挂了之后，你能看到挂的那一刻页面到底长什么样。**

**6. 登录验证码识别**

| 验证码类型 | 识别方案 | 说明 |
| :--- | :--- | :--- |
| 图形验证码 | OCR（ddddocr） | 开源 OCR，离线识别，轻量高效 |
| 滑动验证码 | 视觉分析 + 模拟拖拽 | 计算滑块偏移量 |
| 文字点选验证码 | OCR + 坐标匹配 | 识别文字位置 |
| 计算题验证码 | 表达式解析 | 提取并计算 |
| 短信验证码 | API/数据库查询 | 从后端获取 |
| 第三方验证码 | 打码平台 API | 2Captcha / 超级鹰等 |

**输入：**

1. `ui-testscript-generator` 输出的基础 UI 测试脚本
2. 页面交互规则和特殊处理（验证码机制、异步加载模式、弹窗触发条件）

### 实操演示

将技能安装好，在技能列表中，选择 `ui-testscript-enhancer` 技能。

![img](https://image.kjdaohang.com/img/20260529155139747.png)

**输入项目脚本路径和增强需求：**

```bash
/ui-testscript-enhancer
请对 /ui-test-automation 项目中的基础脚本进行增强，
登录页有图形验证码，请自动识别处理。
```

![img](https://image.kjdaohang.com/img/20260529155545345.png)

**接下来，Skill 会自动完成四步增强：**

**第一步，逐文件扫描，分析需要增强的场景。**

Skill 会读取所有基础测试脚本，对每个 `_page.py` 文件和 `test_*.py` 文件进行逐项检查：

| 检查项 | 增强动作 |
| :--- | :--- |
| `navigate()` 使用 `page.goto(url)` | 替换为 `page.goto(url, wait_until="networkidle")` |
| 直接 `.click()` 无等待 | 替换为 `safe_click()`（先等待可见再点击） |
| 直接 `.fill()` 无等待 | 替换为 `safe_fill()`（先等待可编辑再填写） |
| 无异常捕获的操作方法 | 添加重试装饰器 |
| 页面跳转方法无等待目标页 | 添加 `expect(page).to_have_url()` 等待 |
| 含 iframe/Shadow DOM 的页面 | 生成 iframe 切换方法 |
| 登录页含验证码逻辑 | 接入验证码识别方案 |

对测试文件也会逐项检查：

| 检查项 | 增强动作 |
| :--- | :--- |
| 无失败截图机制 | 注入 pytest hook 自动截图 |
| 无 Trace 录制配置 | 添加 playwright 配置 |
| 弹窗未处理 | 添加 `page.on("dialog")` 监听 |
| 无网络请求监控 | 添加 `page.on("response")` 日志 |
| 无全局异常处理 | 添加 `pytest_exception_interact` hook |

**第二步，替换基类，升级为增强版。**

将原有的 `base_page.py` 替换为增强版 `enhanced_base_page.py`，所有页面类自动继承增强后的公共方法（safe_click、safe_fill、safe_navigate 等）。

**第三步，添加重试和容错机制。**

为 POM 方法添加 `@retry_on_failure` 装饰器，元素未找到时自动重试 3 次，而不是直接报错。

**第四步，接入验证码识别。**

根据用户提供的验证码类型，选择对应的识别策略。比如图形验证码，会接入 `ddddocr` 库实现自动识别。

![img](https://image.kjdaohang.com/img/20260529155734193.png)

> **关于 ddddocr**
>
> `ddddocr`（俗称「带带弟弟」）是一款轻量级、离线、高准确率的开源验证码识别 OCR 库，专为自动化测试、爬虫与逆向场景设计。使用前需要安装：`pip install ddddocr`。不依赖 AI 视觉大模型，纯本地运行，落地成本极低。

增强完成后，建议人工打开测试脚本检查一下逻辑：

![img](https://image.kjdaohang.com/img/20260529160813106.png)

### 验证码专项测试

如果你想单独验证验证码识别功能是否可用，不需要跑完整测试流程。可以优化 Skill，增加专项检测功能：

```bash
/ui-testscript-enhancer
请对 http://localhost:3000/login 进行验证码识别专项测试，跑 3 轮
```

![img](https://image.kjdaohang.com/img/20260529164718908.png)

Skill 会自动加载页面、定位验证码区域、完成识别后打印输出识别结果，同时截取验证码图片供人工对比。

![img](https://image.kjdaohang.com/img/20260529165412506.png)

三轮测试结果：

- 第一轮识别结果，**cpew**
- 第二轮识别结果，**zkr7**
- 第三轮实际是 **s4ab**，识别出来 **s+ab**，有轻微偏差

![img](https://image.kjdaohang.com/img/20260529165807520.png)

**整体来看，验证码识别的准确率还是不错的。** 而且这个能力并非依托 AI 视觉大模型实现，而是基于开源免费的 `ddddocr` 库，轻量高效，落地成本极低。

### 最终输出什么？

增强完成后的脚本，相比基础脚本，新增了以下能力：

| 增强维度 | 具体产出 |
| :--- | :--- |
| **智能等待** | 6 种场景的等待策略，替代所有硬编码 sleep |
| **安全操作** | `safe_click`、`safe_fill`、`safe_navigate` 等封装方法 |
| **异常容错** | `@retry_on_failure` 装饰器，自动重试 3 次 |
| **弹窗处理** | `page.on("dialog")` 全局监听，自动关闭意外弹窗 |
| **iframe 切换** | 自动识别嵌套 iframe，生成上下文切换方法 |
| **失败追溯** | 失败时自动截图、录屏（Trace）、记录网络日志 |
| **验证码识别** | 根据类型自动接入对应识别方案 |

**核心价值**：解决 AI 生成脚本的「脆弱」问题，让脚本从「能跑」进化为「跑得稳」，真正具备上 CI、跑回归、进流水线的生产级能力。

## 三、全流程串联回顾

把上面整个过程用命令行风格串起来：

```bash
# 1. 准备输入（上一步 ui-testscript-generator 的产出）
ui-test-automation/        ← 基础 UI 测试脚本工程
├── pages/                 ← POM 页面对象类
├── tests/                 ← 测试用例脚本
├── data/                  ← 测试数据
└── ...

# 2. 一句指令启动增强
/ui-testscript-enhancer 请对项目脚本进行增强，登录页有图形验证码

# 3. AI 自动完成四步增强（逐文件扫描 → 替换基类 → 添加容错 → 接入验证码）
   ├─ Step 1: 逐文件扫描 → 生成增强清单
   │   ├─ _page.py: sleep替换、safe_click注入、retry装饰器、iframe处理
   │   └─ test_*.py: 失败截图、Trace录制、弹窗监听、网络日志、全局异常
   ├─ Step 2: base_page.py → enhanced_base_page.py（升级基类）
   ├─ Step 3: @retry_on_failure 装饰器（自动重试 3 次）
   └─ Step 4: 验证码识别策略接入（ddddocr / 滑动 / 点选 / 计算 / 短信 / 打码）

# 4. 最终产出
   ui-test-automation/（增强后）
   ├── pages/enhanced_base_page.py    ← 增强版基类
   ├── pages/*/xxx_page.py            ← 增强后的 POM（safe_click/safe_fill）
   ├── tests/test_*.py                ← 增强后的用例（截图/录屏/弹窗/异常）
   ├── config/playwright.config.py    ← Trace 录制 + 多浏览器配置
   ├── utils/retry_decorator.py       ← 重试装饰器
   └── utils/captcha_solver.py        ← 验证码识别模块

# 5. 下游直接消费（下一篇内容）
   增强脚本 → ui-visual-assert → 视觉断言 + 多浏览器适配
   增强脚本 → 直接接入 CI/CD 流水线执行
```

## 四、AI 负责增强，人负责确认

这里同样需要说清楚人机边界。**AI 自动补全的健壮性逻辑，并不是直接就完美可用，需要人工确认和微调。**

`ui-testscript-enhancer` 能帮你完成的是「扫描 + 补全」这个动作，把数天的手工加固工作压缩到几分钟。但以下这些事情，仍然需要人来把关：

| AI 负责的事 | 人负责的事 |
| :--- | :--- |
| 逐文件扫描，识别需要增强的场景 | 确认增强项是否遗漏（有没有特殊的交互场景） |
| 替换硬编码 sleep 为智能等待 | 调试等待策略是否符合真实页面加载行为 |
| 注入弹窗监听和异常处理 | 确认弹窗处理逻辑是否会影响正常业务流程 |
| 添加重试装饰器 | 校验重试次数和超时阈值是否合理 |
| 接入验证码识别方案 | 验证码识别准确率是否满足业务要求 |
| 生成失败截图和录屏配置 | 确认截图路径、Trace 存储是否符合 CI 规范 |

**特别提醒几点：**

**第一，验证码识别准确率不是 100%。** 上面的实测中，三轮识别有一轮出现了轻微偏差（`s4ab` 识别成 `s+ab`）。对于登录场景，建议结合重试机制使用，或者考虑短信验证码 / 后端 Token 注入等更稳定的方案。

**第二，增强后的脚本建议在本地先跑一轮。** 确认所有增强逻辑（safe_click、弹窗监听、重试机制）不会影响正常的测试流程，再推到 CI 环境。

**第三，弹窗监听要确认范围。** `page.on("dialog")` 会拦截所有 dialog 事件，如果你的业务流程中某些弹窗是需要断言的（比如确认删除弹窗），需要把监听逻辑和断言逻辑区分开，避免误关。

**AI 负责把健壮性逻辑从 0 补到 80，人负责确认和微调到 100。** 这样既大幅提升了效率，又不会失去对质量的控制。

## 写在最后

回顾一下整个流程：

**痛点：** 硬编码 sleep 时灵时不灵、验证码拦路、弹窗干扰、iframe 穿不进去、失败后无法追溯、偶发失败没人敢信。

**方案：** 用 `ui-testscript-enhancer` Skill，对基础脚本进行六大维度增强：智能等待补全、弹窗与干扰处理、iframe/Shadow DOM 处理、异常重试与容错、失败追溯增强、验证码识别。

**效果：** 传统模式下，人工逐个文件加固健壮性逻辑，一个 20 页面的项目至少需要 3-5 天。而 `ui-testscript-enhancer` 只需要几分钟，就能完成全量扫描和增强，让脚本从「能跑」进化为「跑得稳」。

**边界：** AI 负责扫描和补全，人负责确认和微调。验证码识别准确率需要实测验证，增强后的脚本建议先本地跑一轮再上 CI。

这里再聊一个设计上的考量。为什么把「健壮性增强」单独拆成一个 Skill，而不是直接在 `ui-testscript-generator` 里就把这些逻辑加上？

因为**关注点不同**。`ui-testscript-generator` 的核心职责是「生成」，解决的是从 0 到 1 的问题；`ui-testscript-enhancer` 的核心职责是「增强」，解决的是从 1 到 100 的问题。拆开之后，每个 Skill 逻辑更聚焦，也更灵活。比如你有一批存量脚本（不是 AI 生成的），只想做健壮性增强，直接调 `ui-testscript-enhancer` 就行，不需要重新走一遍生成流程。

**单一职责，闭环衔接。** 这是整套 Skill 设计的核心原则。

**下一篇，我们聚焦 `ui-visual-assert`，聊聊如何为 UI 脚本补充视觉断言能力，实现跨浏览器、跨分辨率的界面兼容性校验，让脚本不仅「跑得稳」，还能「看得准」。**

---

**配套资源**

- Skill 工具包下载，https://www.testfather.cn/skills（星球成员已含网站会员，登录直接领）
- 完整开发设计教程与项目源码（含 30+ AI 测试全场景 Agent Skill），见「狂师 . AI 进化社」

**系列导航**（AI 测试实战系列，共 19 篇）

测前设计（接口 / UI 通用）

- [01 用例设计四件套](./01-testcase-design-toolkit.md)，generator-testcase-xmind / excel · safe-testcase · review-testcase

接口自动化 · 脚本开发

- [02 文档智能解析](./02-api-schema-parser.md)，api-schema-parser
- [03 测试数据构造](./03-api-testdata-generator.md)，api-testdata-generator
- [04 脚本批量生成](./04-api-testscript-generator.md)，api-testscript-generator
- [05 脚本质量优化](./05-api-test-optimizer.md)，api-test-optimizer

接口自动化 · 执行运营

- [06 智能执行调度](./06-api-test-executor.md)，api-test-executor
- [07 失败自动诊断修复](./07-api-failure-diagnoser.md)，api-failure-diagnoser
- [08 测试数据清理](./08-api-testdata-cleaner.md)，api-testdata-cleaner
- [09 测试报告生成](./09-api-report-generator.md)，api-report-generator
- [10 全链路流水线编排](./10-api-pipeline-scheduler.md)，api-pipeline-scheduler

UI 自动化 · 脚本开发

- [11 页面解析](./11-ui-page-parser.md)，ui-page-parser
- [12 脚本批量生成](./12-ui-testscript-generator.md)，ui-testscript-generator
- [13 脚本健壮性增强](./13-ui-testscript-enhancer.md)，ui-testscript-enhancer
- [14 视觉断言与多浏览器适配](./14-ui-visual-assert.md)，ui-visual-assert

UI 自动化 · 执行运营

- [15 智能执行调度](./15-ui-test-executor.md)，ui-test-executor
- [16 失败自动诊断修复](./16-ui-failure-diagnoser.md)，ui-failure-diagnoser
- [17 测试报告生成](./17-ui-report-generator.md)，ui-report-generator
- [18 全链路流水线编排](./18-ui-pipeline-scheduler.md)，ui-pipeline-scheduler
- [19 全流程串联实战](./19-ui-full-flow-integration.md)，4+1 Skill 架构收官
