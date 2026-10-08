---
title: 性能测试工具
description: 性能测试工具清单：18 款主流压测工具——老牌双雄、开发者新势力、轻量命令行、平台与云四组，每个工具独立一页（介绍/官网/开源地址/配图）。
---

# 性能测试工具（已收录 18 个）

![性能测试工具](../../../assets/images/tools/perf-cover.png)

> 工具整理自「测试开发技术」公众号文章《2026 性能测试工具大盘点：13 款主流压测工具，测试工程师必备！》（01-13，序号有调整），并按检索补充了 5 款常用工具（autocannon、oha、ab、Siege、Tsung）。先说一个做过压测的人多半踩过的坑：**压测压到一半，被测系统还活着，压测机先扛不住了**——报告上的数字测的不是系统上限，是工具自己的上限。所以工具的资源占用和并发能力，直接决定压测结论可不可信。按工具形态分四组：**老牌双雄 → 开发者新势力 → 轻量命令行 → 平台与云**。

**用法建议**：先看你会不会写代码。会写的直接上 k6 或 Locust——脚本进 Git、场景可评审、结果可复现，这是性能测试工程化的正路；不会写的 JMeter 依然是最稳的起点，别硬着头皮上代码系工具。轻量 CLI 是宝藏：wrk 和 Vegeta 五分钟就能给服务摸个底，真正的大规模压测再上平台。**「从哪发压」这件事**——机房内自压永远打不出真实公网流量形态，大促级别的验证，云 PTS 或者 BlazeMeter 的钱不能省。性能测试的核心从来不是跑分，是搞清楚你的系统在水漫上来的时候，先从哪里漏。

## 一、老牌双雄

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 01 | [Apache JMeter](./01-jmeter.md) | 协议支持最全，图形界面拼场景，企业保有量第一 |
| 02 | [LoadRunner](./02-loadrunner.md) | 企业级老钱，协议录制能力至今无人能敌，贵 |

## 二、开发者新势力

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 03 | [k6](./03-k6.md) | Grafana 出品，JS 脚本单机开销低，开发者侧口碑第一 |
| 04 | [Locust](./04-locust.md) | Python 生态代表，代码定义用户行为，分布式开箱即用 |
| 05 | [Gatling](./05-gatling.md) | Scala 高性能，报告是所有工具里最好看的一档 |
| 06 | [Artillery](./06-artillery.md) | Node.js，YAML 写场景，代码系里门槛最低 |

## 三、轻量命令行

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 07 | [Vegeta](./07-vegeta.md) | Go CLI，恒定速率压测，测限流熔断阈值 |
| 08 | [wrk](./08-wrk.md) | C 写的基准神器，单机打出恐怖并发（wrk2 并入介绍） |
| 09 | [hey](./09-hey.md) | Go 写的 ab 替代品，一条命令看 QPS 和延迟分位 |
| 10 | [autocannon](./10-autocannon.md) | Node.js 最快的 HTTP 基准工具 |
| 11 | [oha](./11-oha.md) | Rust 版 hey，带 TUI 实时曲线 |
| 12 | [ab](./12-ab.md) | ApacheBench，最经典装机自带的快测工具 |
| 13 | [Siege](./13-siege.md) | 老牌 HTTP 压测，模拟多用户并发 siege |
| 14 | [Tsung](./14-tsung.md) | Erlang 多协议压测，XMPP/MQTT/WebSocket 都能压 |

## 四、平台与云

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 15 | [nGrinder](./15-ngrinder.md) | Naver 开源压测平台，JMeter 内核加管控台 |
| 16 | [RunnerGo](./16-runnergo.md) | 国产开源全栈测试平台，六种压测模式 |
| 17 | [阿里云 PTS](./17-aliyun-pts.md) | 云上全链路压测，双十一级别大促演练拿它跑 |
| 18 | [BlazeMeter](./18-blazemeter.md) | Perforce SaaS，JMeter 脚本直接上云弹性扩并发 |

## 数据核验说明

- GitHub 仓库地址、star 数、开源协议经 gh CLI 实时核验，核验时间 **2026-10**；star 数随时间变化，以仓库页面为准。
- JMeter 在[接口测试工具分类](../api-testing-tools/11-jmeter.md)另有收录（接口视角），本页侧重压测视角；RunnerGo 仓库为 `Runner-Go-Team/RunnerGo`（原文小写拼写会重定向到同一仓库）。
- k6 为 AGPL-3.0 协议（商用集成需评估）；wrk、Tsung、Siege 为 GPL 系或自定义开源协议，页内均已标注。
- 无配图说明：LoadRunner、BlazeMeter 官网为 JS 渲染，wrk、hey、Siege、Tsung 的图片服务受限，暂缺配图。

欢迎推荐遗漏的工具，参见[贡献指南](/about/contributing.html)。
