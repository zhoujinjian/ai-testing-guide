---
title: 12 UI 自动化·脚本批量生成：ui-testscript-generator
description: AI 测试实战系列第 12 篇。基于标准化 pages.yaml 批量生成 POM 分层脚本工程，页面类、测试用例、测试数据一次到位，终结手写 POM 手抽筋与团队风格混乱。
---

# AI 测试实战系列 12｜UI 自动化·脚本批量生成：ui-testscript-generator

> AI 测试实战系列（共 19 篇）｜ 01 用例设计（接口/UI 通用） · 接口自动化 02-10 · UI 自动化 11-19 ｜ 本文第 12 篇

---

![](https://image.kjdaohang.com/img/20260730152444842.png)

上一篇我们聊了 `ui-page-parser`，解决了 UI 自动化「抓元素」的痛点，拿到了一份标准化的 `pages.yaml`。

但拿到页面元素定义只是第一步。接下来的事情，可能比抓元素更折磨人。

写过 UI 自动化脚本的同学，看看这些场景熟不熟悉：

- **POM 类写到手抽筋。** 每个页面要封装一个 Page Object 类，元素定位、操作方法、等待条件，全靠人工逐行敲。20 个页面就是 20 个类，重复且枯燥。
- **测试数据构造费时费力。** 正向数据、边界值、非法格式、SQL 注入、空值......每个表单字段都要造一堆测试数据，还得跟脚本绑定，工作量巨大。
- **定位策略全凭个人习惯。** 张三用 XPath，李四用 CSS Selector，王五用 `getByText`，同一个项目的脚本风格千奇百怪，后人接手想骂人。
- **编码效率低得让人怀疑人生。** 一个完整的登录流程脚本（含 POM + 用例 + 数据），手写至少半天。20 个页面的电商系统，光脚本编写就要一两周。
- **用例与页面定义脱节。** 手写脚本时，很容易遗漏 `pages.yaml` 里已解析好的元素，或者写的定位跟标准化定义不一致，导致脚本质量参差不齐。
- **新人上手门槛高。** POM 模式、数据驱动、框架规范......新人想写一个合格的 UI 测试脚本，没个一周培训根本下不来。

**脚本编写，是 UI 自动化落地过程中最耗人力的环节，没有之一。**

> 那既然已经有了标准化的 `pages.yaml`，能不能用 Agent Skill 把脚本生成这一步也自动化？

答案还是那句话，可以，而且效果比你想象的更好。

核心思路依然是，**AI 负责批量生成，人负责校验和调试。**

这篇文章就带你完整拆解这个过程。

## 一、ui-testscript-generator 在整条链路中的位置

先回顾一下 UI 自动化的完整 Skill 链路：

```bash
页面 URL / DOM 结构 / 用例描述
  │
  ▼
ui-page-parser ──→ 标准化页面定义 (pages.yaml)
  │
  ▼
ui-testscript-generator ──→ POM + 测试脚本 + 测试数据  ← 这一篇
  │
  ├──→ ui-testscript-enhancer ──→ 健壮性增强（等待+异常+截图）
  │         │
  │         ▼
  │   ui-visual-assert ──→ 视觉断言 + 多浏览器适配
  │         │
  │         ▼
  │   ui-auto-maintainer ──→ 页面变更检测 + 定位自愈
  │
  └──→ pages.yaml 也可直接用于前端组件文档生成、无障碍审计
```

上一步 `ui-page-parser` 输出的 `pages.yaml`，就是 `ui-testscript-generator` 的核心输入。

**这个 Skill 做的事情，就是把一份结构化的页面定义 + 一份业务测试用例，一次性转换成完整可运行的 UI 自动化测试工程。**

具体来说，它一次性批量产出三层代码：

| 产出层 | 内容 | 替代了什么人工劳动 |
| :--- | :--- | :--- |
| **pages/ 层** | 页面对象类（POM） | 逐页手写元素定位和操作方法 |
| **testcases/ 层** | 测试用例脚本 | 逐条手写测试流程、断言逻辑 |
| **data/ 层** | 测试数据文件 | 逐个字段手造正向/边界/异常数据 |

![](https://image.kjdaohang.com/img/20260730152156116.png)

**一步生成，直接可用。** 这不是 demo 级的代码片段拼接，而是符合团队框架规范、可直接导入 IDE 运行的完整工程结构。

## 二、ui-testscript-generator skill 技能介绍

### 为什么这一步最耗人力？

传统 UI 脚本开发，拿到页面元素信息之后，测试工程师需要做三件事：

**第一，手写 POM 类。** 每个页面对应一个类，封装元素定位和操作方法。定位策略要按规范选最优的（`data-testid` > 语义化 > CSS > XPath），操作方法要区分原子操作（fill、click）和组合操作（登录流程、下单流程）。一个 20 个页面的系统，光 POM 类就要写一周。

**第二，手写测试用例脚本。** 基于业务测试用例，组装完整的操作链路、断言逻辑、异常分支。还要处理数据驱动（YAML/JSON 参数化）、前置条件（登录态预设）、后置清理（数据回滚）。

**第三，手造测试数据。** 每个表单字段都要造正向数据、边界值、非法格式、空值、SQL 注入......一个登录表单 3 个字段，至少 15 组测试数据，全靠人工想。

这三件事加起来，**是整个 UI 自动化流程中工作量最大的环节。** 传统模式下，一个 20 个页面的系统，从 POM 到用例到数据，至少需要 2-3 周。

### 我的方案

**ui-testscript-generator** 是专门用于基于结构化页面定义，**一次性批量生成页面对象模型（POM）、测试用例脚本、定位策略、测试数据**的 Skill。

将数据生成与脚本生成合并为一个综合 Skill，简化调用流程，提升上手效率。

**核心能力：**

- **测试数据智能构造**：基于表单字段定义，自动构造正向数据、边界值、非法格式、空值、SQL 注入/XSS、超长数据、业务规则冲突数据，覆盖全场景
- **POM 页面对象生成**：每个页面对应一个 POM 类，智能推导定位策略，封装原子操作（fill、click、select）和组合操作（登录流程、下单流程）
- **测试用例脚本生成**：按场景分类生成测试用例（Normal/Exception/Boundary/Security），自动绑定测试数据，自动生成多维度断言
- **按需生成约束**：以业务测试用例为唯一输入源，`pages.yaml` 仅作为元素定位的查询数据库，测试用例涉及哪些页面，就只生成哪些代码，杜绝冗余
- **框架规范固化**：团队 UI 自动化框架规范（框架选型、目录结构、定位策略优先级、等待机制、断言策略）作为 Skill 的基础能力，保证生成脚本的规范性
- **工程化项目结构**：自动生成完整的项目目录结构（config、pages、tests、data、utils、fixtures、reports），符合 POM 分层设计

**输入：**

1. `ui-page-parser` 输出的 `pages.yaml`（标准化页面对象定义）
2. 业务测试用例文件（Excel 版详细测试用例，或自然语言描述）
3. 测试数据规则（可选，用于自定义数据构造规则）

### 实操演示

将技能安装好，在技能列表中，选择 `ui-testscript-generator` 技能。

![img](https://image.kjdaohang.com/img/20260529134346782.png)

**输入两份文件：**

```bash
/ui-testscript-generator
请基于以下文件生成 UI 自动化测试脚本：
1. pages.yaml（ui-page-parser 输出的页面对象定义）
2. 测试用例文件（Excel 版业务测试用例）
```

![img](https://image.kjdaohang.com/img/20260529134820098.png)

为了方便调试，测试用例文件建议先精简，先只保留少数核心业务用例：

![img](https://image.kjdaohang.com/img/20260529140352728.png)

**接下来，Skill 会自动完成六个步骤：**

**第一步，解析输入，建立生成范围。**

Skill 读取测试用例文件，提取涉及的页面名称（如登录页、注册页），然后从 `pages.yaml` 中筛选对应页面的元素定义。**只生成测试用例涉及到的页面代码，无关页面一律不生成。**

![img](https://image.kjdaohang.com/img/20260529135431005.png)

**第二步，初始化项目结构，生成 POM 页面对象。**

根据团队框架规范，自动创建标准化的项目目录结构，然后为每个页面生成对应的 POM 类，封装元素定位和业务操作方法。

![img](https://image.kjdaohang.com/img/20260529135628802.png)

**第三步，生成测试用例脚本。**

基于业务测试用例的交互链路，自动组装完整的测试流程，添加多维度断言（元素可见性、文本内容、URL 跳转），按场景分类（正向流程、异常分支、边界值、安全测试）。

![img](https://image.kjdaohang.com/img/20260529135806870.png)

**第四步，生成测试数据、fixtures 和 DataFactory。**

基于表单字段定义，自动构造覆盖全场景的测试数据（正向、边界、非法、空值、注入），生成数据工厂和 fixtures，实现脚本与数据解耦。

![img](https://image.kjdaohang.com/img/20260529135858361.png)

**第五步，生成配置文件。**

自动生成 Playwright 配置、环境配置、pytest.ini 等工程化配置文件。

**第六步，检查验证，生成交付清单。**

检查生成后的代码完整性，输出最终的项目结构和文件清单。

![img](https://image.kjdaohang.com/img/20260529140037808.png)

### 最终输出什么？

打开自动生成的 `ui-test-automation` 项目目录，用 VSCode 检查一下：

![img](https://image.kjdaohang.com/img/20260529141338447.png)

![img](https://image.kjdaohang.com/img/20260529140730613.png)

![img](https://image.kjdaohang.com/img/20260529141736448.png)

![img](https://image.kjdaohang.com/img/20260529141113955.png)

最终产出的完整工程结构如下：

```bash
ui-test-automation/
├── config/                     # 配置管理
│   ├── settings.py             # 全局配置（环境、超时、浏览器）
│   └── environments/           # 环境隔离配置
│       ├── dev.yaml
│       ├── staging.yaml
│       └── prod.yaml
├── pages/                      # 页面对象层（POM）
│   ├── base_page.py            # 所有 Page 的基类
│   ├── components/             # 可复用 UI 组件
│   └── [module]/               # 按业务模块划分
│       ├── login_page.py       # 登录页 POM
│       └── register_page.py    # 注册页 POM
├── tests/                      # 测试用例层
│   ├── conftest.py             # Pytest 全局 fixture
│   └── [module]/
│       ├── test_login.py       # 登录测试用例
│       └── test_register.py    # 注册测试用例
├── data/                       # 测试数据层
│   └── [module]/
│       ├── login_positive.yaml    # 正向数据
│       ├── login_negative.yaml    # 异常数据
│       └── login_boundary.yaml    # 边界值数据
├── utils/                      # 工具层
│   ├── data_loader.py          # 数据加载
│   ├── retry_decorator.py      # 重试装饰器
│   └── screenshot_helper.py    # 截图辅助
├── fixtures/                   # 测试夹具
│   └── auth_fixture.py         # 登录态预设
├── reports/                    # 报告输出
│   ├── screenshots/            # 失败截图
│   └── traces/                 # Playwright Trace
├── pytest.ini                  # Pytest 配置
└── requirements.txt            # 依赖管理
```

**核心价值**：替代人工从零编写 POM 和用例，一步完成「数据 + 页面 + 用例」的全量产出，保证脚本的规范性和可维护性。合并数据生成与脚本生成，**上手更快、操作更简单、一步生成即用**，特别适合快速落地、小型项目、新手入门。

## 三、全流程串联回顾

把上面整个过程用命令行风格串起来，就是这样的：

```bash
# 1. 准备输入（上一步 ui-page-parser 的产出 + 业务测试用例）
pages.yaml          ← 标准化页面对象定义（21 个页面）
testcases.xlsx      ← 业务测试用例（精简版，2-3 条核心用例）

# 2. 一句指令启动生成
/ui-testscript-generator 请基于 pages.yaml 和测试用例文件生成脚本

# 3. AI 自动完成六步（无需人工干预）
   ├─ Step 1: 解析输入 → 建立生成范围（只涉及登录、注册页）
   ├─ Step 2: 初始化项目结构 → 生成 POM 页面对象类
   ├─ Step 3: 生成测试用例脚本 → 正向/异常/边界/安全分类
   ├─ Step 4: 生成测试数据 → 数据工厂 + fixtures
   ├─ Step 5: 生成配置文件 → Playwright + pytest + 环境隔离
   └─ Step 6: 检查验证 → 输出交付清单

# 4. 最终产出
   ui-test-automation/
   ├── pages/        ← POM 页面对象类
   ├── tests/        ← 测试用例脚本
   ├── data/         ← 测试数据文件（YAML）
   ├── utils/        ← 工具函数
   ├── fixtures/     ← 测试夹具
   ├── config/       ← 环境配置
   └── reports/      ← 报告输出目录

# 5. 下游直接消费（下一篇内容）
   基础脚本 → ui-testscript-enhancer → 健壮性增强（等待+异常+截图+验证码）
```

## 四、AI 负责生成，人负责调试

这里有一个关键认知需要说清楚，**AI 生成的脚本，不一定能立刻跑通，需要人工调试。**

`ui-testscript-generator` 能帮你完成的是「从 0 到 80」的编码工作，把数天甚至数周的手写代码压缩到几分钟。但以下这些事情，AI 做不了，仍然需要人来把关：

| AI 负责的事 | 人负责的事 |
| :--- | :--- |
| POM 类结构生成 | 检查元素定位是否跟真实页面一致 |
| 测试数据批量构造 | 校验数据是否符合业务规则 |
| 测试用例脚本组装 | 调试断言逻辑是否合理 |
| 项目工程结构搭建 | 补充特殊业务逻辑（如验证码处理） |
| 定位策略优先级推导 | 确认定位策略在真实环境中的稳定性 |
| 数据驱动适配 | 调试环境依赖（数据库、Mock 服务） |

虽然自动生成好的脚本不一定能立马直接执行（脚本执行和调试会在后续内容讲解），但所有基础编码、页面封装、脚本结构、框架搭建等前置工作均已完成。

**这些工作同样能极大减少人工重复编码的工作量，让我们可以把精力集中在脚本调试、业务逻辑适配等核心工作上。**

> **特别提醒：** 在调试期间，建议先把测试用例精简到10 条左右的核心流程上，验证 Skill 的生成质量和定位策略准确性后，再逐步扩大用例范围。

还有一个重要的设计原则值得提一下。在这个 Skill 的设计中，**脚本生成以业务测试用例文件为唯一输入源**，`pages.yaml` 仅作为元素定位的查询数据库。

什么意思呢？即使你的 `pages.yaml` 包含了全站 100 多个页面的元素定义，但测试用例只涉及「登录」和「注册」，那最终就只生成这两个页面的 POM 类和测试脚本，其余页面一律不生成。

**按需生成，杜绝冗余。** 这个约束看似简单，但在实际项目中能帮你省掉大量无效代码和维护成本。

## 写在最后

回顾一下整个流程：

**痛点：** POM 类写到手抽筋、测试数据造到头秃、定位策略全凭个人习惯、新人上手门槛高。

**方案：** 用 `ui-testscript-generator` Skill，输入 `pages.yaml` + 业务测试用例，一次性批量生成 POM 类、测试脚本、测试数据、配置文件，输出完整的工程化项目结构。

**效果：** 传统模式下，人工编写 20 个页面的 POM + 用例 + 数据，至少需要 2-3 周。而 `ui-testscript-generator` 只需要几分钟，就能完成全量代码产出，且符合团队框架规范。

**边界：** AI 负责批量生成，人负责校验和调试。AI 把「从 0 到 80」的编码工作干完，人聚焦在「从 80 到 100」的调试和业务适配。

这里再说一个设计上的考量。为什么把数据生成和脚本生成合并到一个 Skill 里？

因为在 UI 测试中，**数据构造与脚本编写高度耦合**。同一表单字段的测试数据直接驱动对应的页面操作步骤，数据变化直接影响脚本执行路径。拆开反而增加了调用复杂度，合并后一步拿到完整可运行的项目，上手更快。

这套 Skill 组合已经在多个实际项目里落地验证，UI 自动化落地效率明显提升，不再被元素定位和脚本维护折磨。

**下一篇，我们聚焦 `ui-testscript-enhancer`，聊聊如何对基础脚本进行健壮性增强，自动补全智能等待、异常处理、弹窗拦截、验证码识别、失败截图等能力，让脚本从「能跑」进化为「跑得稳」。**

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
