---
title: Espresso
description: Google 官方的 Android UI 测试框架——跑在 App 进程内，快而稳，Android 原生工程的白盒级 UI 测试。
---

# Espresso

> Google 官方，Android UI 测试的正统答案。

## 工具简介

Espresso 是 Google 官方的 Android UI 测试框架，androidx.test 的组成部分——**跑在 App 进程内**，与 UI 线程同步，不需要跨进程通信，快而稳。

onView().perform().check() 的链式 API 简洁直接，配套 IdlingResource 处理异步等待。Android 原生工程（尤其开发自测阶段）的 UI 测试默认用它；跨进程或跨 App 的场景再考虑 UiAutomator。作为官方框架，它没有独立仓库，随 androidx.test 发布。

## 基本信息

| 项目 | 信息 |
| --- | --- |
| 适用端 | APP（Android 官方） |
| 出品方 | Google |
| 工具形态 | Android UI 测试框架（Kotlin/Java） |
| 官网 | <https://developer.android.com/training/testing/espresso> |
| 项目地址 | 无独立仓库（androidx.test 组成部分，随 AndroidX 发布） |
| 收费模式 | 免费开源（Apache-2.0，随 AndroidX） |

## 收录信息

- 检索补充收录（2026-10）
- [返回 UI 自动化工具清单](./README.md)
