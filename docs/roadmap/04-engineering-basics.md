# 04 工程基础：MySQL、Linux、Git、Docker 与 CI

> 测开的工作不只发生在浏览器页面上。很多问题最后都要落到数据、环境、日志和发布流程上。

## 为什么重要

一个接口测试失败，原因可能在测试数据、环境配置、数据库状态、日志报错或发布版本上。这一章的工具就是你排查这些问题的眼睛和手。同时，Docker 和 CI 是后续接口自动化项目（[第 12 章](./12-project-practice.md)项目一）的基础设施，没有它们，「接入流水线」就无从谈起。

## 知识清单

### MySQL【必须掌握】

- 常见 SQL：查询、过滤、排序、分页、聚合（GROUP BY / HAVING）、关联查询（JOIN）。
- 表结构：主键、唯一索引、普通索引、外键的作用和影响。
- 事务：ACID、隔离级别、脏读、不可重复读、幻读。
- 测试场景应用：
  - 用 SQL 构造测试数据，验证接口返回和数据库状态是否一致。
  - 写数据校验断言：创建订单后查订单表、扣库存后查库存表。

### MySQL【了解即可】

- 能解释慢 SQL、索引失效、连接数耗尽这类常见问题。
- EXPLAIN 执行计划的基本看法（和[第 08 章](./08-performance-testing.md)性能章衔接）。
- Redis 基本数据结构和缓存常见问题（穿透、击穿、雪崩的名字和场景）。

### Linux【必须掌握】

常用命令要熟，重点是「查日志」和「看状态」两件事：

- 文件与目录：`cd` `ls` `cat` `tail -f` `grep` `find`
- 文本处理三剑客基础：`awk` `sed`（能按列取数、做替换即可）
- 进程与资源：`ps` `top` `df` `du` `free`
- 网络排查：`curl` `netstat` / `ss` `ping`
- 权限：`chmod` `chown`，知道 rwx 对应什么

### Git【必须掌握】

- 分支、提交、合并、解决冲突、回滚（reset / revert 的区别）。
- 查看历史：log、diff、blame（定位「这行代码什么时候改的」）。
- 团队协作流程：feature 分支 → PR / MR → review → 合并。
- `.gitignore`：哪些文件不该进仓库（密码、日志、node_modules）。

### Docker【必须掌握】

- 镜像与容器的关系，拉镜像、启停容器、查看日志（`docker logs`）。
- 端口映射、挂载目录、环境变量注入。
- 写简单 Dockerfile 把自己的小服务打成镜像。

### Docker【了解即可】

- docker-compose 一键起「MySQL + 后端服务」组合环境。
- 常见测试用途：用一次性容器造干净数据库（测完即销毁，数据不污染）。

### CI/CD【必须掌握（概念 + 一次实操）】

- 流水线的基本结构：触发（push / 定时 / 手动）→ 阶段（构建、测试、报告）→ 通知。
- 至少用一个：GitHub Actions 或 Jenkins，跑通一次「提交代码自动执行测试」。
- 会看流水线日志，失败时能定位到具体步骤和原因。

## 学习建议与常见误区

- **这一阶段的练习可以很具体**：自己写一个小服务（或用开源 demo），用 Docker 启动 MySQL 和后端服务，再用 GitHub Actions 或 Jenkins 跑一组接口自动化测试。哪怕功能很小，只要链路完整，就比只学工具强很多。这条链路就是项目一的雏形。
- **MySQL 用「验证思维」学**：不要按 DBA 目录学。每学一个语法就问自己「这条 SQL 能帮我验证什么测试场景」。比如 JOIN 的测试场景：验证订单接口返回的用户昵称和用户表是否一致。
- **Linux 命令在真实排障里记**，不要背命令表。给自己造问题：把服务日志里所有 ERROR 行找出来、统计各接口 500 的次数、找到磁盘占满的目录。
- **误区一：MySQL 只练 SELECT 不练 UPDATE / INSERT。** 测试数据准备和清理离不开写操作，很多同学第一次在测试环境写 SQL 手都在抖，就是因为只练过查。
- **误区二：Git 只会 add / commit / push。** 一遇到冲突就找同事救火。回滚和冲突解决建议在自己仓库里故意制造练习。
- **误区三：Docker 只停留在敲别人的命令。** 至少完整写一次 Dockerfile，理解「镜像 = 快照、容器 = 运行实例」。

## 自查清单

1. 写 SQL：查出最近 7 天创建、状态为「待支付」的订单，按创建时间倒序，含用户昵称（两张表 JOIN）。
2. 事务隔离级别有哪几种？接口测试里「重复提交」用例和数据库的什么机制有关？
3. 接口创建了订单但查询接口查不到，你的排查步骤是什么？（至少说出：先查库确认数据是否落库，再查缓存，再看两个服务的数据源是否一致）
4. `tail -f`、`grep -C 5`、`ps aux | grep xxx` 分别在什么排障场景用？
5. `git reset` 和 `git revert` 的区别？误提交了含密码的代码怎么办？
6. 用 docker 起一个 MySQL，挂载配置目录，容器内建库建表，从宿主机连上它。
7. 描述一条 GitHub Actions 流水线：什么时候触发、跑什么、产物在哪、失败了怎么通知。

## 推荐资源

- [SQLZoo](https://sqlzoo.net/) / [牛客 SQL 题库](https://www.nowcoder.com/)：交互式练 SQL。
- 《MySQL 必知必会》：轻薄易读的 SQL 入门书。
- [Linux 命令大全（linux-command）](https://github.com/jaywcjlove/linux-command)：开源命令速查。
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)：Git 权威免费书，读前 3 章即可。
- [Docker 从入门到实践](https://github.com/yeasy/docker_practice)：开源中文 Docker 教材。
- [GitHub Actions 官方文档](https://docs.github.com/zh/actions)：照着 Quickstart 跑通第一条流水线。
- [AI 测试开发导航 · 教程专栏](https://www.testfather.cn/tutorials)：MySQL、Linux、Docker 工程基础实操教程。
