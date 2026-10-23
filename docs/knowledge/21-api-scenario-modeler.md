---
title: 21 业务场景·场景建模：api-scenario-modeler
description: AI 测试实战系列第 21 篇。业务场景接口串联开篇：把自然语言描述的业务场景翻译成 scenario_<场景名>.yaml 场景编排文件 + modeling_notes.md 建模说明——8 步建模工作流、R1~R7 核心推导规则、变量闭环与接口真实性双重质量红线，拿不准的列存疑点清单让人确认，绝不虚构接口。
---

# AI 测试实战系列 21｜业务场景·场景建模：api-scenario-modeler

> AI 测试实战系列（共 22 篇）｜ 01 用例设计（接口/UI 通用） · 接口自动化 02-10 · UI 自动化 11-20 · 业务场景 21-22 ｜ 本文第 21 篇

---

> **导读**：前面 20 篇，接口测试和 UI 测试两条 AI 流水线都已跑通，但一直留着一个缺口：**登录、加购、下单各自都测得很好，拼到一起却不一定通——单接口全绿，业务照样可能卡死。**
>
> 从本篇开始的「业务场景」篇（21-22）就是补这块的：把「注册→登录→搜索→加购→下单→支付→查单」这样一条完整业务链路，当成一个测试对象来搞。两件新 Skill 一个管「测什么」，一个管「怎么跑」——本篇先拆「测什么」的翻译官 **api-scenario-modeler**，下一篇拆「怎么跑」的执行机器 api-scenario-runner。

## 一、单接口全绿，业务为什么还是可能卡死？

先看一个所有做接口自动化的团队都熟悉的场景：

- 注册接口，单测通过 ✅
- 登录接口，单测通过 ✅
- 加购接口，单测通过 ✅
- 下单接口，单测通过 ✅

单接口用例**全绿**，可真跑一遍「新用户注册 → 登录 → 搜索 → 加购 → 下单 → 支付」的完整业务，照样可能在某一步卡死：token 没接上、商品 ID 传错、库存扣减对不上、订单状态没流转……

问题出在哪？**单接口测试验证的是「零件没问题」，业务链路验证的是「机器能转」**。零件各自合格，装配起来照样可能转不动。而传统做法里，这条链路要么靠人工点出来，要么由老师傅把链路知识写进脚本——知识在人脑子里，人走了链路就断了。

业务场景篇的两件 Skill 就是为补这个缺口而生：

| Skill | 定位 | 能干嘛 |
| --- | --- | --- |
| **api-scenario-modeler**（本篇） | 翻译官 | 把你说的人话翻译成机器可执行的测试编排，产出 `scenario_xxx.yaml` 场景编排文件——选哪些接口、什么顺序、变量怎么传、断言怎么配，全设计好 |
| **api-scenario-runner**（下一篇） | 执行机器 | 把编排文件真实跑起来：run 模式直接执行整条链路，compile 模式一键编译成 pytest 脚本，并入前面篇章建立的执行调度、失败诊断、报告生成体系 |

两件 Skill 和前面篇章的执行、诊断、清理、报告技能无缝衔接——**单接口和业务场景两条线，从此在同一个体系里跑**。

## 二、它是什么？

**api-scenario-modeler 是业务场景接口测试的建模专家**，核心定位是"场景执行链路的翻译环节"，只做一件事：**把业务场景翻译成编排文件**。

产出双文件：

- `scenario_<场景名>.yaml`——场景编排文件：选哪些接口、什么顺序、变量怎么传、断言怎么配，全设计好
- `modeling_notes.md`——建模说明：每个步骤对应的选择接口，以及选择理由

这两份文件就是下游执行引擎 api-scenario-runner 的直接输入。

丢给它一段业务场景描述（比如「新用户注册登录后买台华为手机，支付后查订单状态和库存扣减对不对」），它就把整条链路的编排设计出来。

**擅长**：

- 多接口业务链路建模
- 跨接口数据依赖梳理
- 断言分级设计

**亮点**：链路知识从老师傅脑子里解放成看得懂、能评审、能进 git 的资产；拿不准的地方它列**存疑点清单**让你确认，**绝不瞎编接口**。

## 三、适用场景

- 把业务流程翻译成接口用例（注册→登录→搜索→加购→下单→支付类端到端链路）
- 生成场景 yaml、做场景建模、编排一条接口链路
- 提供了业务场景描述 + `api_definitions.json`，需要产出可执行的编排文件

**使用方式**：在 Claude Code 中提供业务场景描述与 `api_definitions.json`，或输入：

```
/api-scenario-modeler
```

## 四、建模工作流：8 步

```
场景识别 → 接口匹配 → 顺序与依赖推导 → 变量设计 → 断言设计 → 幂等与回收设计 → 变量闭环自检（脚本机械校验） → 输出双文件
```

8 步里最能体现"工程感"的是最后两步：

- **变量闭环自检**：不是靠 AI 自觉，而是脚本机械校验——每个 `${}` 引用的变量必有来源，无孤儿变量
- **输出双文件**：编排文件给机器消费，建模说明给人评审

前面的识别、匹配、推导、设计每一步怎么做，全部固化成了下面这套推导规则。

## 五、核心推导规则（R1~R7）

| 规则 | 说明 |
| --- | --- |
| R1 鉴权前置 | 登录类步骤在前，token 由登录响应提取，后续步骤由 runner 统一注入 |
| R2 数据依赖定向 | 参数依赖谁产出，就排在谁后面（排序唯一依据） |
| R3 禁止硬编码动态值 | ID/token/单号一律 extract 注入，不写死 |
| R4 幂等策略 | 唯一性字段（用户名/手机号/邮箱）用 timestamp/uuid 动态生成 |
| R5 断言分级 | 每步状态码+业务码；关键业务步骤追加字段断言；禁断动态字段全等 |
| R6 终态校验 | 数据变更链路必须设计 db_asserts 终态一致性断言 |
| R7 失败策略 | happy path 用 abort，异常分支验证用 continue 并断言错误码 |

这 7 条规则解决的都是链路测试最容易翻车的点：token 谁注入、步骤谁先谁后、动态值谁传递、跑第二遍会不会撞唯一性冲突、断言到什么深度算够、失败了一步后面还跑不跑。

## 六、质量红线：脚本硬校验 + 人工复核

建模质量靠两道关：

**第一道，脚本硬校验**：

- **接口真实性**：编排中每个 api 均存在于 `api_definitions.json`，**绝不虚构接口**，缺失环节标记"接口缺失"
- **变量闭环**：每个 `${}` 引用的变量必有来源，无孤儿变量
- 顺序合法、断言覆盖、幂等保障、无动态字段全等断言

**第二道，人工复核**——AI 自查再严，也替代不了人查（方法见下文评审清单）。

## 七、实操：把一段人话变成一份编排文件

### 1、输入

输入一段自然语言场景描述 + 接口定义文件：

```bash
请调用 api-scenario-modeler 技能，基于接口定义文件 /Users/xxx/output/api_definitions.json，
为下述业务场景生成串联编排文件：

新用户注册并登录后，搜索一件商品，查看商品详情，加入购物车，创建订单并完成支付，
最后确认订单状态已流转、库存扣减数量正确。业务规则：已支付订单不可取消。

建模完成后，同时输出 modeling_notes.md。
```

![](https://image.kjdaohang.com/img/20261022173426599.png)

![](https://image.kjdaohang.com/img/20261022173915046.png)

![](https://image.kjdaohang.com/img/20261022174052966.png)

### 2、人工评审清单

拿到编排文件和建模说明后，逐项过这张**人工评审清单**（modeler 的自检清单是 AI 自查，这一步是人查，两道关都要过）：

| 评审项 | 检查方法 | 合格标准 |
| --- | --- | --- |
| 接口真实性 | 对照 api_definitions.json 逐个核对 api 字段 | 零虚构 |
| 步骤顺序 | 重点看注册→登录、加购→下单、下单→支付的先后 | 数据依赖全部先产出后使用 |
| 变量闭环 | 对照变量流转图，逐个 ${var} 找来源 | 无孤儿变量、无硬编码动态值 |
| 断言分级 | 看下单、支付步骤是否有业务字段断言（订单状态流转） | 关键步骤三级断言齐全 |
| 幂等设计 | 看 username 是否用了 timestamp 策略 | 唯一性字段全部动态化 |
| 存疑点 | 看 modeling_notes.md 是否标记了 addressId 这类前置数据 | 存疑点如实暴露，而非沉默假设 |

![](https://image.kjdaohang.com/img/20261022174903454.png)

### 3、编排文件长什么样

`scenario_shopping_flow.yaml` 业务场景编排文件详细示例（也称之为业务场景测试建模文件）：

```yaml
scenario:
  id: SC-order-001
  name: 新用户购物主链路（下单支付与库存终态校验）
  description: 新用户注册登录后搜索商品、查看详情、加购、下单并支付，校验订单状态流转为已支付、库存扣减恰好等于下单数量，且已支付订单不可取消
  priority: P0
  tags: [smoke, module:order, scene:business-flow]

variables:
  - { name: username, strategy: timestamp, prefix: shop_ }
  - { name: phone, strategy: random, prefix: "138" }
  - { name: password, value: Test@123456 }

steps:
  - step: 1
    name: 注册新用户
    api: POST /api/auth/register
    auth: false
    request:
      body:
        username: ${username}
        password: ${password}
        email: ${username}@qq.com
        phone: ${phone}
    extract: []
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
    on_failure: abort

  - step: 2
    name: 用户登录获取令牌
    api: POST /api/auth/login
    auth: false
    request:
      body:
        username: ${username}
        password: ${password}
    extract:
      - { var: token, from: $.data.token }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.token, op: not_null }
    on_failure: abort

  - step: 3
    name: 搜索目标商品
    api: GET /api/search
    auth: false
    request:
      query:
        keyword: 手机
        page: 1
        size: 10
    extract:
      - { var: productId, from: "$.data.records[0].id" }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.records, op: not_empty }
    on_failure: abort

  - step: 4
    name: 查看商品详情获取库存基线
    api: GET /api/product/detail/{id}
    auth: false
    request:
      path: { id: "${productId}" }
    extract:
      - { var: stockBefore, from: $.data.stock }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.stock, op: not_null }
    on_failure: abort

  - step: 5
    name: 新增收货地址
    api: POST /api/address
    auth: true
    request:
      body:
        name: 自动化测试收件人
        phone: ${phone}
        province: 上海市
        city: 上海市
        district: 浦东新区
        detailAddress: 张江高科纳贤路800号
    extract:
      - { var: addressId, from: $.data.id }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.id, op: not_null }
    on_failure: abort

  - step: 6
    name: 加入购物车
    api: POST /api/cart
    auth: true
    request:
      body:
        productId: ${productId}
        quantity: 1
    extract:
      - { var: cartItemId, from: $.data.id }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.id, op: not_null }
    on_failure: abort

  - step: 7
    name: 创建订单
    api: POST /api/order
    auth: true
    request:
      body:
        addressId: ${addressId}
        paymentType: 1
        cartIds: ["${cartItemId}"]
    extract:
      - { var: orderId, from: $.data.id }
      - { var: orderNo, from: $.data.orderNo }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.orderNo, op: not_null }
      - { type: jsonpath, path: $.data.status, op: equals, value: 10 }
    on_failure: abort

  - step: 8
    name: 支付订单
    api: POST /api/order/no/{orderNo}/pay
    auth: true
    request:
      path: { orderNo: "${orderNo}" }
      body:
        payMethod: 1
    extract: []
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
    on_failure: abort

  - step: 9
    name: 查询订单确认状态已流转
    api: GET /api/order/{id}
    auth: true
    request:
      path: { id: "${orderId}" }
    extract:
      - { var: orderStatus, from: $.data.status }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.status, op: equals, value: 20 }
      - { type: jsonpath, path: $.data.orderNo, op: equals, value: "${orderNo}" }
    on_failure: abort

  - step: 10
    name: 取消已支付订单（预期被拒绝）
    api: POST /api/order/{id}/cancel
    auth: true
    request:
      path: { id: "${orderId}" }
    extract: []
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: not_equals, value: 0 }
    on_failure: continue

  - step: 11
    name: 复查订单状态未被取消影响
    api: GET /api/order/{id}
    auth: true
    request:
      path: { id: "${orderId}" }
    extract: []
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.status, op: equals, value: 20 }
    on_failure: abort

  - step: 12
    name: 复查商品详情获取库存终态
    api: GET /api/product/detail/{id}
    auth: false
    request:
      path: { id: "${productId}" }
    extract:
      - { var: stockAfter, from: $.data.stock }
    assert:
      - { type: status_code, value: 200 }
      - { type: jsonpath, path: $.code, op: equals, value: 0 }
      - { type: jsonpath, path: $.data.stock, op: not_null }
    on_failure: abort

postconditions:
  db_asserts:
    - { name: 订单终态为已支付, sql: "SELECT status FROM t_order WHERE order_no = '${orderNo}'", expect_value: 20 }
    - { name: 库存扣减与下单数量一致, sql: "SELECT stock FROM t_product WHERE id = ${productId}", expect_expr: "${stockBefore} - 1" }
    - { name: API库存与DB库存一致, sql: "SELECT stock FROM t_product WHERE id = ${productId}", expect_expr: "${stockAfter}" }
    - { name: API订单状态与DB一致, sql: "SELECT status FROM t_order WHERE order_no = '${orderNo}'", expect_expr: "${orderStatus}" }
  cleanup:
    - { name: 回收测试用户与订单数据, via: api-testdata-cleaner, scope: ["user:${username}", "order:${orderNo}"] }
```

这份文件值得注意的几个设计（对照 R1~R7 看）：

- **step 2 登录提取 token**，后续 `auth: true` 的步骤由 runner 统一注入——R1
- **productId / addressId / cartItemId / orderId / orderNo 全部 extract 注入**，零硬编码——R2、R3
- **username 用 timestamp 策略动态生成**，第二遍执行注册的是新用户——R4
- **step 7 创建订单断言到 `status=10`（待支付）、step 9 断言流转为 `status=20`（已支付）**——R5
- **postconditions.db_asserts 查库校验订单终态与库存扣减**，不只看接口返回——R6
- **step 10 取消已支付订单是异常分支**，`on_failure: continue` 且断言业务码非 0——R7
- **cleanup 联动 api-testdata-cleaner（第 08 篇）回收测试数据**

### 4、建模说明与变量流转图

同时生成的 `modeling_notes.md`，记录每个步骤对应的选择接口，以及选择理由。

![](https://image.kjdaohang.com/img/20261022175341302.png)

各接口之间变量流转图（从变量名 → 来源定义 → 注入点）：

![](https://image.kjdaohang.com/img/20261022175709784.png)

### 5、存疑点清单：AI 没把握的地方，人重点确认

还会基于业务场景自动生成一份**存疑点清单**。这里的存疑点，意味着 AI 不太明确或者没有把握的地方，**这个部分人工需要重点确认**。

![](https://image.kjdaohang.com/img/20261022180206559.png)

### 6、自检结果

![](https://image.kjdaohang.com/img/20261022180402538.png)

## 八、如何获取和安装？

api-scenario-modeler 已经开源，Skill 商店地址 https://www.testfather.cn/skills，GitHub 仓库如下，

```bash
git clone https://github.com/zhoujinjian/skills.git
```

**安装到 WorkBuddy**：

```bash
cp -r skills/api-scenario-modeler ~/.workbuddy/skills/
```

**安装到 Claude Code**：

```bash
cp -r skills/api-scenario-modeler ~/.claude/skills/
```

> **小贴士**：api-scenario-modeler 只管「测什么」——编排文件要真实跑起来，还需装好下游的 api-scenario-runner（第 22 篇）。

## 写在最后

链路测试最贵的从来不是执行，而是**链路知识**——选哪些接口、什么顺序、变量怎么传、断言配到什么深度，这些知识原来长在老师傅脑子里，老师傅一请假，链路一挂没人敢动。

api-scenario-modeler 做的事，就是把这些知识**翻译**成 `scenario_xxx.yaml` 一份看得懂、能评审、能进 git 的资产：

- 一段人话进，一份编排文件 + 一份建模说明出
- 推导规则 R1~R7 固化，不靠 AI 即兴发挥
- 接口真实性、变量闭环脚本硬校验，绝不虚构接口
- 拿不准的列存疑点清单，让人拍板，不沉默假设

编排文件就绪，接下来就是把它真实跑起来——下一篇 **api-scenario-runner**，链路执行引擎。

---

**配套资源**

- Skill 工具包下载，https://www.testfather.cn/skills（星球成员已含网站会员，登录直接领）
- 完整开发设计教程与项目源码（含 30+ AI 测试全场景 Agent Skill），见「狂师 . AI 进化社」

**系列导航**（AI 测试实战系列，共 22 篇）

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
- [19 脚本生成流水线串联](./19-ui-script-pipeline.md)，4+1 Skill 实战

UI 自动化 · 执行运营

- [15 智能执行调度](./15-ui-test-executor.md)，ui-test-executor
- [16 失败自动诊断修复](./16-ui-failure-diagnoser.md)，ui-failure-diagnoser
- [17 测试报告生成](./17-ui-report-generator.md)，ui-report-generator
- [18 全链路流水线编排](./18-ui-pipeline-scheduler.md)，ui-pipeline-scheduler
- [20 执行到报告全流程串联](./20-ui-full-flow-integration.md)，4+1 Skill 架构收官

业务场景 · 接口串联

- [21 业务场景建模](./21-api-scenario-modeler.md)，api-scenario-modeler
- [22 业务场景链路执行](./22-api-scenario-runner.md)，api-scenario-runner（业务场景线完结）
