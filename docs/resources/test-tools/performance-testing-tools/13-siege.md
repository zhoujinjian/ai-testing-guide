---
title: Siege
description: 老牌 HTTP 压测工具——模拟多用户并发围攻，支持 basic 认证和 cookie，存量脚本和老旧环境里仍常见。
---

# Siege

> 老牌围攻工具，多用户并发模拟。

## 工具简介

Siege 是老牌 HTTP 压测工具——按「多用户并发围攻」的模型设计，支持 basic 认证、cookie 保持、URL 列表轮询，`siege -c 100 -t 1M` 的经典用法在存量脚本和老运维手册里仍常见。

功能和输出都比新一代 CLI（hey、oha）粗糙，但轻量、稳定、几乎零依赖，老旧环境和回归历史脚本时还会碰到它。

## 基本信息

| 项目 | 信息 |
| --- | --- |
| 出品方 | JoeDog（社区） |
| 工具形态 | CLI 压测工具（C） |
| 官网 | <https://github.com/JoeDog/siege>（仓库即入口） |
| 项目地址 | <https://github.com/JoeDog/siege>（6.2k+ star） |
| 开源协议 | GPL-3.0 |
| 收费模式 | 开源免费 |

## 收录信息

- 检索补充收录（2026-10），GitHub 数据核验于 2026-10
- [返回性能测试工具清单](./README.md)
