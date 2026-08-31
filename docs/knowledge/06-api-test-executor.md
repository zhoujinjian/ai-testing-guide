---
title: 06 接口自动化·智能执行调度：api-test-executor
description: AI 测试实战系列第 06 篇。说人话就能跑测试：自然语言触发 pytest、标签/模块/优先级多维筛选、结构化结果收集，与上下游 Skill 天然衔接的智能执行调度引擎。
---

# AI 测试实战系列 06｜接口自动化·智能执行调度：api-test-executor

> AI 测试实战系列（共 19 篇）｜ 01 用例设计（接口/UI 通用） · 接口自动化 02-10 · UI 自动化 11-19 ｜ 本文第 06 篇

---

![](https://image.kjdaohang.com/img/20260709190321984.png)

> **导读**：前面我们已经分享过了，如何用 AI + Agent Skill 把接口测试脚本自动"造"了出来。但脚本生成只是起点——真正让接口自动化测试产生价值的，是让脚本**跑起来**。
>
> 今天就给大家推荐一款让能接口测试"听话地跑起来"的 Agent Skill：**api-test-executor**

## 写在开头

先问大家一个问题：**你平时是怎么跑接口自动化测试的？**

大概率是这样的——

1. 打开终端，cd 到项目目录；
2. 想跑某个模块的测试，但记不住 pytest 的 `-k` 参数怎么写；
3. 翻一遍代码，找到对应的测试文件名；
4. 拼好命令，执行；
5. 跑完发现环境配置没切对，重来；
6. 想只跑 P0 用例，发现脚本没有标签体系，只能按文件名筛选；
7. 跑完之后，结果散落在终端里，整理成报告要花半天；
8. 想让开发同事一起看，发现没有可分享的报告链接……

如果以上场景你中了三条以上，那么今天这款 skill，你一定要了解——**api-test-executor**，一款专为接口自动化测试执行设计的 Agent Skill。

## 一、它是什么？

**api-test-executor 是接口自动化测试的智能执行调度引擎**，你可以把它理解成测试执行闭环的"发动机"。

它的核心定位非常克制——**只做三件事**：

1. **触发执行**：一键触发 pytest，自动加载环境配置、测试数据；
2. **范围筛选**：支持标签索引 + 自然语言双模式，让用户"说人话"就能圈定执行范围；
3. **结果收集**：结构化采集每条用例的状态、耗时、错误信息、请求/响应快照，输出标准化 JSON 和 Markdown 摘要。

听起来很简单？但简单背后，是反复打磨过的设计。

## 二、5 大核心

### ① 自然语言调用：说人话就能跑

这是它最打动人的一点。

**传统方式**，跑一组测试你得这么写：

```bash
pytest testcases/ -k "smoke and auth" -n 4 --reruns 2 --timeout=30 \
  --alluredir=./allure-results --html=./report.html -v
```

**用 api-test-executor**，你只需要说一句：

```
在 test 环境跑一下登录模块的冒烟测试
```

它会自动解析为：
- 环境：test
- 范围：冒烟测试（smoke）
- 模块：登录（auth）
- 并发：4 线程
- 失败重试：2 次

解析完还会主动向你确认："我将执行：test 环境，冒烟测试，登录模块，4 线程，确认吗？"——**确认后才真正执行，避免误操作**。

支持的语义包括但不限于：

| 你说的话 | 自动解析结果 |
| --- | --- |
| "跑一下冒烟测试" | `--scope smoke` |
| "执行所有用例" | `--scope full` |
| "只跑登录相关的" | `--module auth` |
| "跑一下订单和支付" | `--module order,payment` |
| "只跑 P0 用例" | `--priority P0` |
| "排除不稳定的用例" | `--exclude-tag flaky` |
| "8 个线程跑" | `--parallel 8` |
| "失败重试 3 次" | `--retry 3` |
| "模拟执行看看" | `--dry-run` |

甚至支持组合语义：

> "在 test 环境跑一下冒烟测试，只跑登录和订单模块的 P0 用例，排除 flaky 的"

也能精准解析为：

`--env test --scope smoke --module auth,order --priority P0 --exclude-tag flaky`

**这意味着：测试人员不用再记复杂的命令参数，也不用频繁翻文档**。说人话，就能跑测试。

### ② 多维筛选：想跑什么就跑什么

传统测试执行最常见的尴尬——**想跑一部分用例，但筛选不出来**。

api-test-executor 支持三种筛选模式：

**模式 A：标签索引模式（推荐）**
配合 `api-test-tagger` 打好的标签，按维度筛选：
- 按模块：`--module auth,order`
- 按优先级：`--priority P0,P1`
- 按场景：`--tag scene:positive`
- 按策略：`--scope smoke`

**模式 B：文件路径回退模式**
没有标签？也能用。按文件名匹配模块，按方法名关键字推断场景。

**模式 C：自然语言解析模式**
最直观，说话即可。

**好处是**：执行范围不再写死，可以按业务需要灵活组合。今天跑冒烟、明天跑回归、后天只跑支付模块——一条指令搞定。

### ③ 结构化输出：结果不再散落

执行完了，结果怎么收集？这是很多团队的痛点。

api-test-executor 会同时输出三种结果：

**1. `execution_results.json`（给下游消费）**

结构化的执行结果，包含每条用例的状态、耗时、错误信息、请求/响应快照。这是后续诊断、报告生成、数据归档的基础数据。

**2. `execution_summary.md`（给人看）**

人能直接读的执行摘要，包含执行概览和失败用例列表。

**3. pytest 原生报告（兼容生态）**

- `allure-results/`：Allure 原始数据
- `html-report/report.html`：HTML 测试报告
- `junit.xml`：JUnit XML 格式

**也就是说，它既能让下游 Skill 接管（结构化 JSON），又能兼容你已有的报告工具链（Allure/HTML/JUnit）**。这一点对老项目迁移特别友好。

### ④ 能力边界：只做该做的事

这点其实是它最被低估的优势。

**明确不做的事**：
- 不做复杂的环境健康自检（仅做基础服务连通性检查）
- 不做分布式并发调度（仅支持本地 pytest-xdist 并发）
- 不做实时监控告警
- 不做失败根因分析（交给下游 api-failure-diagnoser）

为什么不做？

因为**一个试图包揽所有的 Skill，最终什么都会做不好**。环境巡检、分布式调度、根因分析——每一项都是独立的复杂领域，强行塞进执行 Skill 里，只会让它臃肿、脆弱、难维护。

api-test-executor 把"触发 + 筛选 + 收集"这三件事做到极致，把更重的能力留给底层平台或独立的 Skill——**这种克制反而让它更稳定、更专注、更好用**。

### ⑤ 生态衔接：可独立、可编排

api-test-executor 不是孤岛，它是一整套 Skill 体系的核心节点：

- **上游**：`api-test-tagger` 给脚本打标签，让它能精准筛选
- **下游**：`api-failure-diagnoser` 接收执行结果，自动诊断失败、修复脚本
- **下游**：`api-testdata-cleaner` 在执行后清理测试数据
- **下游**：`api-report-generator` 基于执行结果生成可视化报告
- **编排**：`api-pipeline-scheduler` 把这些 Skill 串成流水线，一键跑通全流程

也就是说，**它既能独立使用，又能作为整条流水线的核心节点**——这就是它作为"发动机"的真正价值。

## 三、几个典型使用场景

**场景一：日常冒烟测试**

每天早上来公司，想快速验证服务是否正常：

```
在 test 环境跑一下冒烟测试
```

几分钟出结果，喝杯咖啡的功夫就知道今天服务是不是健康的。

**场景二：版本前的 P0 回归**

发版前，要跑一遍所有核心用例：

```
在 test 环境跑一下 shop-lab-api-test 项目 P0 级测试用例
```

它会自动扫描出 87 条 P0 用例，覆盖 49 个文件，按 4 线程并发执行，失败重试 2 次，全程无需人工配置。

**场景三：调试单个模块**

开发刚改了订单接口，想快速验证：

```
在 test 环境跑一下订单模块的所有用例
```

不用翻代码找文件名，不用拼 `-k` 表达式，一句话搞定。

**场景四：模拟执行（dry-run）**

想看看某类用例有多少条、覆盖了哪些文件，又不想真跑：

```
模拟执行一下，看看支付模块有哪些正向场景用例
```

它会列出用例清单，但不真正执行——**这个功能在评估测试覆盖范围时特别有用**。

**场景五：接入 CI/CD 流水线**

通过 Claude CLI 的非交互模式，可以无缝接入 Jenkins：

```bash
claude -p "调用 api-test-executor 技能，参数: project_path=${PROJECT_PATH}, env=test, scope=p0" \
  --permission-mode bypassPermissions \
  --output-format json \
  --max-turns 30
```

让接口测试真正成为流水线的一环。

## 五、适合谁用？

**强烈推荐**：

- **接口自动化测试工程师**：日常跑用例、做回归、出报告
- **测试开发工程师**：搭建团队测试基础设施、接入 CI/CD
- **全栈测试工程师**：希望降低自动化使用门槛
- **测试团队负责人**：希望提升团队测试执行效率

**特别适合**：

- 已有 pytest 测试脚本的团队（迁移成本低）
- 希望用 AI 但不知道从哪里下手的团队（这是最好的切入点）
- 测试用例数量多、模块复杂的团队（标签筛选价值最大）

## 六、如何获取和安装？

在 Skill 商店下载获取 api-test-executor 技能包，地址 https://www.testfather.cn/skills。

**安装到 WorkBuddy**：

```bash
cp -r skills/api-test-executor ~/.workbuddy/skills/
```

**安装到 Claude Code**：

```bash
cp -r skills/api-test-executor ~/.claude/skills/
```

安装完成后，在你的 AI 工具里直接说：

> "在 test 环境跑一下 xxx 项目的冒烟测试"

就可以开始用了。

> **小贴士**：建议先配合 `api-test-tagger` 给脚本打上标准化标签，这样筛选效果最佳。

## 七、实战演示

1、首先，利用`api-testscript-generator` 技能 为被测项目`shop-lab`一键生成好测试脚本，比如生成好的项目脚本目录为：`shop-lab-api-test` （之前有文章分享过，此处不再重复）

2、将测试脚本项目下的`config`配置目录中`test.yaml`配置文件更换成被测项目真实地址，如下图，按需修改：

![](https://image.kjdaohang.com/img/20260610121255783.png)

3、打开任意Agent，比如WorkBuddy，在技能列表中，选择 `api-test-executor` 技能，传入测试脚本项目目录和环境配置：

```
在 test 环境跑一下shop-lab-api-test 项目登录模块的冒烟测试
```

![](https://image.kjdaohang.com/img/20260610121244944.png)

4、收到上述执行提示词后，技能会进行自动解析成测试框架能理解的执行意图，最终**将执行翻译为：test 环境，冒烟测试，登录模块（auth），4 线程并发，失败重试 2 次**，并询问用户是否确认。

![](https://image.kjdaohang.com/img/20260610121723974.png)

这里可能有人会问，老师："在上面的执行意图中，我们并没有明确要求配置4个线程并发，失败重试2次的要求啊"，那为什么在意图解析时，会出现这种执行要求呢？

这是因为`api-test-executor`技能中CLI命令行参数内置了默认值，如下图所示：

![](https://image.kjdaohang.com/img/20260610122248155.png)

选择确认执行。

![](https://image.kjdaohang.com/img/20260610122608858.png)

WorkBuddy 会加载 `api-test-executor` 技能，自动完成以下流程：

1）、**环境自检**：检查 localhost:8080 服务是否可用、数据库连接是否正常；

![](https://image.kjdaohang.com/img/20260610122932196.png)

2）、**执行范围解析**：扫描 testcases/ 目录，识别对应要求待执行的测试用例集；

3）、**解发pytest执行：** 运行脚本组装并执行 pytest 命令。

4）、**结果收集**：生成 `execution_summary.md` 执行结果汇总文件。

> 如果需要在Claude Code中调用`api-test-executor`，可以直接下载该技能源码或在线安装，也可以选择将workbuddy中对应的技能迁移到claude code目录下。

![](https://image.kjdaohang.com/img/20260610144642891.png)

进入到Claude Code中，输入`/api-test-executor`

![](https://image.kjdaohang.com/img/20260610144757236.png)

```
/api-test-executor 在 test 环境跑一下shop-lab-api-test 项目登录模块的冒烟测试
shop-lab-api-test路径为：xxx
```

![](https://image.kjdaohang.com/img/20260610145010410.png)

执行结果：

![](https://image.kjdaohang.com/img/20260610154255893.png)

从上述执行结果可以看到，本次用例执行有成功也有失败，这才符合接口测试执行的常规表现。

我们重点来看这条失败用例`test_register_success`，这是一个非常典型的数据污染问题。

脚本里把用户名`newuser_001`写死在了代码中，上一轮运行时这个账号就已经完成注册，再次执行脚本，接口检测到账号重复，直接返回异常，造成用例运行失败。

![](https://image.kjdaohang.com/img/20260610160044184.png)

针对这类脚本数据污染的问题，不要慌，我们可以调用失败用例智能诊断技能：`api-failure-diagnoser`来自动修复一下，当然这个技能，篇符关系，我们就留在下一篇再讲吧。

## 写在最后

测试行业有句老话：**"自动化测试的难点不在写脚本，而在跑脚本、看结果、修失败。"**

api-test-executor 解决的就是这三个难点中最关键的一环——**让脚本能"听话地跑起来"**。

它不会替代你的测试策略思考，不会替代你的业务理解，更不会替代你对质量的整体把控。它只是把你从**机械的执行调度、繁琐的命令参数、散落的结果文件**中解放出来，让你把精力聚焦在更有价值的事情上——**测试策略优化、风险深度挖掘、质量趋势分析**。

**而这，正是 AI 赋能测试的真正意义**——不是替代人，而是解放人。

如果你也厌倦了每次跑测试都要折腾半天，强烈推荐试试这款 skill。

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
- 09 测试报告生成，api-report-generator
- 10 全链路流水线编排，api-pipeline-scheduler

UI 自动化 · 脚本开发

- 11 页面解析，ui-page-parser
- 12 脚本批量生成，ui-testscript-generator
- 13 脚本健壮性增强，ui-testscript-enhancer
- 14 视觉断言与多浏览器适配，ui-visual-assert

UI 自动化 · 执行运营

- 15 智能执行调度，ui-test-executor
- 16 失败自动诊断修复，ui-failure-diagnoser
- 17 测试报告生成，ui-report-generator
- 18 全链路流水线编排，ui-pipeline-scheduler
- 19 全流程串联实战，4+1 Skill 架构收官
