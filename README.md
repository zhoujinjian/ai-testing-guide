# ai-testing-guide（AI 测试开发学习路线大全）

> AI 时代测试开发学习路线大全 —— 从功能测试到质量工程的完整成长地图，涵盖 AI 辅助测试、自动化测试、Agent 测试开发等，持续更新 🚀。

[![License: CC BY-NC-SA 4.0](<https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg>)](./LICENSE)

软件测试正在被 AI 重塑：用例可以让 AI 出初稿，脚本可以让 AI 帮忙写，但「判断测得够不够、质量有没有滑坡、问题出在哪一层」仍然需要人。这个仓库整理了一条从零基础到测试开发工程师（SDET）的完整学习路线，覆盖传统测试开发核心能力，也覆盖 AI 时代的新命题：AI 辅助测试与大模型应用评测。

## 这份路线适合谁

- **在校学生 / 应届毕业生**：计算机相关专业或零基础转行，准备走测试开发、自动化测试、质量工程方向，需要一条从零到能求职的完整路径
- **功能 / 业务测试工程师**：正在做手工或功能测试，业务熟悉但编程薄弱，想补齐编程、自动化和工程化能力，转型测试开发
- **程序员 / 后端开发**：有 Java、Python 或后端开发基础，看好质量工程方向的机会，想把求职面扩展到测开
- **在职测试工程师（社招进阶）**：已经会一些自动化，遇到能力瓶颈，想突破性能测试、质量平台、精准测试等进阶能力，冲击更高岗位和薪资
- **想学 AI 测试的工程师**：无论测试还是开发背景，想把 AI 真正用进测试工作，或切入 AI 应用评测（RAG / Agent / 大模型）这个新方向

不同背景不必从头读到尾：[路线总览](./docs/roadmap/README.md) 为「功能测试转测开」「后端转测开」「校招零基础」三条路径做了定制裁剪，社招进阶可按目标岗位选学第 8-11 章。

## 路线全景

```
计算机基础 -> 编程语言 -> 数据库/Linux/Git/Docker -> 测试理论
-> 接口自动化 -> UI/App 自动化 -> 性能测试 -> CI/CD 与质量工程
-> AI 辅助测试 -> AI 应用测试 -> 项目和面试表达
```

| 阶段   | 章节                                                           | 一句话说明                          |
| ------ | -------------------------------------------------------------- | ----------------------------------- |
| 认知   | [01 认识测试开发](./docs/roadmap/01-what-is-sdet.md)            | 测开到底在做什么，AI 时代多学了什么 |
| 阶段一 | [02 计算机基础](./docs/roadmap/02-cs-fundamentals.md)           | 网络、操作系统、数据结构与算法      |
| 阶段二 | [03 编程语言](./docs/roadmap/03-programming.md)                 | 选一门主语言，再补一门辅助语言      |
| 阶段三 | [04 工程基础](./docs/roadmap/04-engineering-basics.md)          | MySQL、Linux、Git、Docker 与 CI     |
| 阶段四 | [05 测试理论与用例设计](./docs/roadmap/05-testing-theory.md)    | 面对功能，怎么判断测得够不够        |
| 阶段五 | [06 接口测试与接口自动化](./docs/roadmap/06-api-automation.md)  | 测开最应该优先拿下的一块            |
| 阶段六 | [07 UI 与 App 自动化](./docs/roadmap/07-ui-app-automation.md)   | Playwright、Selenium、Appium        |
| 阶段七 | [08 性能与稳定性测试](./docs/roadmap/08-performance-testing.md) | 从压测目标到瓶颈定位                |
| 阶段八 | [09 CI/CD 与质量平台](./docs/roadmap/09-quality-engineering.md) | 把质量能力沉淀进团队流程            |
| 阶段九 | [10 AI 辅助测试](./docs/roadmap/10-ai-assisted-testing.md)      | 用 AI 提效，但不交出判断权          |
| 阶段十 | [11 AI 应用测试与评测](./docs/roadmap/11-llm-evaluation.md)     | 评估不确定系统的质量                |
| 实战   | [12 项目实战指南](./docs/roadmap/12-project-practice.md)        | 4 个能写进简历的递进项目            |
| 面试   | [13 面试准备](./docs/roadmap/13-interview-guide.md)             | 分类题库与表达框架                  |

先看 [路线总览](./docs/roadmap/README.md)：里面有不同背景的定制路线、3-6 个月学习节奏和优先级建议。

## 内容规划

| 目录                                        | 状态     | 说明                                               |
| ------------------------------------------- | -------- | -------------------------------------------------- |
| [docs/roadmap](./docs/roadmap/README.md)     | 持续更新 | 学习路线主线，按阶段成章                           |
| [docs/knowledge](./docs/knowledge/README.md) | 规划中   | 知识点单篇深入：Playwright 实战、JMeter 报告解读等 |
| [docs/interview](./docs/interview/README.md) | 规划中   | 分类面试题库与参考回答                             |
| [docs/resources](./docs/resources/README.md) | 规划中   | 工具清单、书籍与课程汇总                           |

## 如何使用这份路线

1. 别一上来就收藏一堆工具教程。工具上手很快，拉开差距的是测试代码质量、工程化接入和问题定位能力。
2. 每章末尾有「自查清单」，能独立回答里面的所有问题，这一章才算过关。
3. 学完前五个阶段就动手做项目，边做边补，不要等「全部学完」再开始。
4. AI 相关的两章（10、11）建议尽早读，哪怕还做不了 AI 应用评测，也应该先建立判断力。

## 配套资源（AI 测试开发导航）

本仓库与 [AI 测试开发导航](https://www.testfather.cn/) 配套建设，以下在线资源与路线同步更新：

| 资源                                                       | 说明                             |
| ---------------------------------------------------------- | -------------------------------- |
| [学习路线](https://www.testfather.cn/learning-paths)        | 在线版学习路线，支持进度跟踪     |
| [教程专栏](https://www.testfather.cn/tutorials)             | 分阶段实战教程，与本仓库章节配套 |
| [面试刷题](https://www.testfather.cn/interviews)            | 测开高频面试题在线练习           |
| [面试测评](https://www.testfather.cn/interviews/assessment) | 能力自测，定位薄弱环节           |
| [简历模板](https://www.testfather.cn/resume-templates)      | 测试开发求职简历模板             |
| [Skill 技能商店](https://www.testfather.cn/skills)          | AI 测试提效技能与提示词工具      |
| [精品课程](https://www.testfather.cn/courses)               | 体系化测试开发课程               |

## 贡献

欢迎通过 Issue 和 PR 参与共建：纠错、补充资源、分享学习经验都可以。参见[贡献指南](./CONTRIBUTING.md)。

## 📌 版权与转载声明

- 本仓库文档内容采用 [CC BY-NC-SA 4.0](./LICENSE) 协议发布：
  - ✅ 个人学习、博客署名转载自由（请注明出处并保留链接）
  - ❌ 未经授权，禁止用于商业用途、付费专栏、培训课程
  - 🔄 基于本文档的二次创作需沿用相同协议
- 仓库中的示例代码采用 MIT 协议，可自由使用
- 转载请在文首注明：作者 **狂师** · 出处 https://github.com/zhoujinjian/ai-testing-guide
- 如发现恶意抄袭/搬运（包括公众号、CSDN 付费专栏），将依法维权

## 更新日志

- 2026-08：v1 首发，完整 10 阶段学习路线 + 4 个实战项目 + 面试指南。
