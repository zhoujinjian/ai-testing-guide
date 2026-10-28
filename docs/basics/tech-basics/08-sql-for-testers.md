---
title: 08 测试必备 SQL：查询与多表关联
description: 只讲测试用得上的那部分：SELECT 加 WHERE 圈数据、JOIN 两表查脏数据、UPDATE 改测试状态，全部围绕订单表加用户表的真实例子，先查后改绝不裸奔。
---

# 08｜测试必备 SQL：查询与多表关联

> 核心要点：测试用 SQL 就三板斧——**SELECT 查数据落库对不对、JOIN 两三张表查脏数据、UPDATE 改测试数据的状态**。核心纪律一条：**UPDATE 之前必须先 SELECT 确认范围**，并且只在测试库动手。

## 打个比方

数据库是一个**大仓库**，几百万件货堆在货架上，SQL 是你递给仓管员的**提货单指令**——按什么条件找（WHERE）、按什么顺序摆（ORDER BY）、先看几件（LIMIT）、要不要把两张货架的货对着看（JOIN）。

页面查询像"在门店柜台看商品"：只能看到系统**愿意给你看**的展示。SQL 是"拿着工牌进仓库自己点货"：库存真实是多少、那笔订单到底什么状态、有没有账对不上的脏货，**绕过所有展示层直接看底账**。测试验证"返回说成功、落库到底有没有"，靠的就是进仓盘点这一手。页面是门店橱窗，数据库才是后仓账本——两处对不上时，永远以账本为准。

## 展开讲讲

### 先认识两张表（全文的例子都在它们身上）

用户表 `user`：`id`、`username`、`status`（1 正常 / 0 禁用）。订单表 `orders`：`id`、`order_no`、`user_id`（下单人，对着 user.id）、`amount`、`status`（0 待支付 / 1 已支付 / 2 已发货 / 3 已取消）、`create_time`。

### 第一板斧：SELECT——圈出你要的数据

```sql
-- 查用户 test001 最近 10 笔订单，新在前
SELECT order_no, amount, status, create_time
FROM orders
WHERE user_id = 10086
ORDER BY create_time DESC
LIMIT 10;
```

四个子句各司其职：**WHERE 圈范围**（别一次捞出全表）、**ORDER BY 定顺序**、**LIMIT 控制数量**、SELECT 只取要看的列。再配几个测试高频的条件写法：

```sql
-- 金额在 100~500 之间、状态非已取消的订单
SELECT order_no, amount FROM orders
WHERE amount BETWEEN 100 AND 500 AND status != 3;

-- 统计：test001 一共下了多少单、总金额多少
SELECT COUNT(*) AS 订单数, SUM(amount) AS 总金额
FROM orders WHERE user_id = 10086;
```

`COUNT` 和 `SUM` 是对账利器——页面显示"共 37 单"，SQL 一数是 39，两单哪去了？这就是 bug 线索。数不一致时先别急着提单，排查三个常见原因：**筛选条件不同**（页面默认只查最近三个月）、**统计口径不同**（含不含已取消订单）、**缓存没刷新**。三样都排除了还差着数，才是实打实的 bug。

### 第二板斧：JOIN——两表对账查脏数据

单表看局部，**脏数据要靠两表对着查**。"订单里的 user_id 必须真实存在"，这类关联规则是脏数据高发区：

```sql
-- 脏数据检查：有没有订单挂在了不存在的用户上（孤儿订单）
SELECT o.order_no, o.user_id
FROM orders o
LEFT JOIN user u ON o.user_id = u.id
WHERE u.id IS NULL;
```

为什么用 LEFT JOIN：它**保左表全量**，右表配不上的填 NULL——专捞"对不上账"的行。INNER JOIN 则相反，只留两边都配得上的：

| 关键字 | 留下哪些行 | 测试用途 |
| --- | --- | --- |
| INNER JOIN | 两表都匹配的 | 查"正常关联"的数据主体 |
| LEFT JOIN | 左表全保留 | **查脏数据**：右表缺失的现形为 NULL |

再来一个正向对账：查"禁用用户有没有已支付订单"（业务上可能违规）：

```sql
SELECT u.username, o.order_no, o.amount
FROM user u
INNER JOIN orders o ON o.user_id = u.id
WHERE u.status = 0 AND o.status = 1;
```

left join 和 inner join 的区别是面试经典，怎么答成体系见面试题库第 13 题。

### 再补两招：模糊查与分组统计

```sql
-- 只记得单号前几位，用 LIKE 模糊查（% 匹配任意长度的任意字符）
SELECT order_no, amount FROM orders
WHERE order_no LIKE 'TD202610%';

-- 每种状态各有多少单：一眼看出数据分布对不对
SELECT status, COUNT(*) AS cnt
FROM orders
WHERE user_id = 10086
GROUP BY status;
```

`LIKE` 对付"记不全的单号"，`GROUP BY` 对付"状态分布"——页面写着"待支付 3 单、已支付 5 单"，一条 GROUP BY 就能把账对上。

### 第三板斧：UPDATE——改测试数据，但绝不裸奔

造一个"待支付"订单来测支付流程，把已有测试单的状态改回去即可：

```sql
-- 第一步：先查，确认只命中你自己的那一条
SELECT id, order_no, status FROM orders
WHERE order_no = 'TD20261027001' AND user_id = 10086;

-- 第二步：确认范围无误，再改
UPDATE orders SET status = 0
WHERE order_no = 'TD20261027001' AND user_id = 10086;
```

**安全铁律**：UPDATE 必须带 WHERE，且条件精确到主键或业务单号；**先跑同条件的 SELECT 看影响行数**，再执行 UPDATE。裸 UPDATE（不带 WHERE）会把整张表刷成一个值——测试库也够你吃一壶的。改完还有最后半步：**用同条件的 SELECT 复核一遍**改没改对、有没有多改。改数类的事故十有八九出在"以为改了"和"不小心改多了"这两处，多花五秒复核，省掉的是回滚的半小时。

## 举个例子

测"取消订单"功能：页面点取消，提示"取消成功"。光看页面不够，进仓盘点三步：

1. 页面操作前先记下订单号 TD20261027001，SQL 查一次：`status = 1 已支付`，`amount = 299.00`
2. 页面点"取消订单"，提示成功
3. 再查同一条：`status = 3 已取消`，`create_time` 未变，同单再下一笔金额对得上——**落库确认，测试通过**

第二轮回测时发现页面提示成功、数据库里 `status` 还是 1——**返回与落库不一致**，这正是接口测试光看返回会漏掉的 bug，只有 SQL 能抓到。顺手的加餐：`SELECT COUNT(*) FROM orders WHERE status = 3 AND user_id = 10086` 数一数历史取消单，对一下页面"已取消列表"的数量是否一致。

## 新手常见误区

| 误区 | 实际情况 |
| --- | --- |
| 不敢碰 SQL，全靠开发帮查 | 三板斧一两天能会，自己查免去排队等开发，排查速度翻倍 |
| UPDATE 不带 WHERE 或不看影响行数 | 一条裸 UPDATE 刷全表，测试库也要写事故报告的 |
| 在生产库执行写操作 | 测试只对测试库动手；查生产库也要先问权限、避开高峰 |
| SELECT 老 `SELECT *` 捞全表 | 全表几百万行又慢又刷屏，WHERE 圈范围 + LIMIT 兜底是礼貌 |
| 以为 LEFT JOIN / INNER JOIN 随便用 | 用 INNER JOIN 查脏数据永远查不到——配不上的行早被它丢了 |
| 只信页面显示 | 页面可能有缓存和拼接逻辑，数据库才是最终事实 |

## 上手建议

1. **找开发要测试库只读账号**：今天就要，Navicat 或 DBeaver 连上，先只练 SELECT
2. **每提一个数据类 bug 前先查一次库**：把 SQL 结果贴进 bug 单，开发再也不回"我这边没问题"
3. **把三条常用 SQL 存成个人小抄**：按单号查订单、按用户查订单列表、孤儿数据检查，随用随贴
4. **UPDATE 练习固定流程**：同条件 SELECT → 看影响行数 → 再 UPDATE，一个月内不许跳步
5. ** JOIN 从两张表开始**：先把 LEFT JOIN 查脏数据那一条背熟用熟，多表关联自然就懂了

## 相关阅读

- 面试题：[left join 和 inner join 的区别](../../interview/testing-essentials/13-sql-join-basics.md)
- 本系列：[测试必备 Linux：查日志三件套](./09-linux-logs.md)、[测试数据怎么造：造数思路与工具](./12-testdata-strategy.md)、[接口测试是什么：零基础版](./05-api-testing-intro.md)
- 路线配套：[第 4 章工程基础](../../roadmap/04-engineering-basics.md)

[返回八股文首页](../README.md)
