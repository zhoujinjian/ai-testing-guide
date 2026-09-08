---
title: 14 pytest 的 fixture、conftest、参数化怎么用？
description: 硬技术题。fixture 有名、可依赖、可定作用域（yield 分隔前后置），conftest 自动生效，parametrize 数据驱动——fixture 依赖链组装复杂前置是超越 setup 的根本。
---

# 14｜pytest 的 fixture、conftest、参数化怎么用？

> 开场从 fixture 的本质讲起——它是测开面试的事实标准栈，会就是会，不会就是不会。

## 回答思路

### 第一步：fixture 先讲本质

它是比 setup/teardown 更灵活的前后置机制：**有名字、可依赖、可控制作用域**（function、class、module、session）。用 **yield 分隔前置和后置**，清理动作写在 yield 后面——讲清 yield 这个细节是熟练的标志。

### 第二步：讲 fixture 的组合能力

fixture 可以依赖另一个 fixture——driver fixture 之上再叠登录 fixture，层层组装出「已登录的浏览器」这种复杂前置。**这是它超越 setup 的根本原因**。

### 第三步：conftest 讲机制

放在目录下的特殊文件，**不需要 import 自动生效**，同目录及子目录的用例共享里面的 fixture——是做全局 driver、全局配置的标准位置。讲「不用 import 自动发现」这个机制，说明真用过。

### 第四步：参数化给两层用法

- 基础：`parametrize` 装饰器——一组数据跑出多条用例，用例名带参数 ID 便于定位失败数据
- 进阶：用 fixture 加 params 实现数据驱动的动态 fixture，或从 yaml、excel 外部文件读参数——用例和数据完全分离

### 收尾：带一个组合实战

mark 打标签分组执行、xfail 标记已知缺陷、fail-fast 和重跑插件（**pytest-rerunfailures、pytest-xdist**）——这些和 fixture 组合起来就是一套生产可用的执行体系，报得出插件名说明真在 CI 里跑过。

## 考察重点

| 维度 | 说明 |
| --- | --- |
| 企业动机 | pytest 是测开面试的事实标准栈。这题是硬技术题，企业用它快速分层候选人 |
| 过线标准 | fixture 作用域和 yield、conftest 自动生效、parametrize 三点讲清 |
| 区分度 | 讲 fixture 依赖链、外部数据驱动、插件生态的是生产环境重度用户；只讲 setup 类比的是刚入门 |
| 加分项 | xdist 并行和用例间数据隔离的配合意识 |
| 减分项 | 把 fixture 讲成 setup 的改名，概念错误直接露底 |

## 来源

整理自知识星球帖《面试情报 03｜自动化测试 20 题》，[返回题库](./README.md)。
