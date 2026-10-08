---
title: AI 编程工具
description: AI 编程工具清单：33 个主流工具一次看懂，海外大厂、创业公司、国产军团、开源新势力四组，每个工具独立一页（介绍/官网/开源地址/配图）。
---

# AI 编程工具（已收录 33 个）

![33 个 AI 编程工具](../../../assets/images/tools/ai-coding-tools-cover.png)

> 工具整理自「测试开发技术」公众号文章《2026 年 AI 编程工具大全，33 个主流工具一次看懂》。两年前这份清单撑死 5 个，现在 33 个——33 个里国产占了 10 个，两年前这个数字是零，这本身就是最大的信号。按出身分四组：**海外大厂 → 创业公司 → 国产军团 → 开源新势力**。

**用法建议**：别被 33 个吓到，其实就三类——编辑器、终端、云端，而且功能在飞速趋同（计划模式、子代理、MCP、skills 几乎人手一套）。真正拉开差距的从来不是壳，是**模型和上下文管理**——选工具之前，先选模型。建议主用一个、副用一个，主用那个往深了用，把 skills 和规则文件慢慢养起来，你的配置本身会变成资产。

## 一、海外大厂系

| 序号 | 工具 | 出品方 | 一句话点评 |
| --- | --- | --- | --- |
| 01 | [Claude Code](./01-claude-code.md) | Anthropic | 终端编程 agent 开创者，生态最全，被对标最多 |
| 02 | [Codex](./02-codex.md) | OpenAI | 云端任务派出去自己跑，改完提 PR 等你验收 |
| 03 | [Gemini CLI](./03-gemini-cli.md) | Google | 开源、免费额度大方，多模态是独门优势 |
| 04 | [GitHub Copilot](./04-github-copilot.md) | 微软 | 资格最老渗透率最高，企业采购默认选项 |
| 05 | [Antigravity](./05-antigravity.md) | Google | manager agent 编排多 agent 并行干活 |
| 06 | [Grok Build](./06-grok-build.md) | xAI | Rust 写的 80 万行终端 agent，开源 9 天 2 万 star |

## 二、创业公司的当家花旦

| 序号 | 工具 | 出品方 | 一句话点评 |
| --- | --- | --- | --- |
| 07 | [Cursor](./07-cursor.md) | Anysphere | AI 原生 IDE 招牌，把 AI 写代码做成行业标杆 |
| 08 | [Amp](./08-amp.md) | Sourcegraph | 代码搜索出身天生懂大库，按任务量收费不锁座位 |
| 09 | [Droid](./09-droid.md) | Factory | 企业级工程化代表，exec 模式在 CI 里稳定跑 |
| 10 | [Kiro](./10-kiro.md) | AWS | spec 驱动 IDE，先写规格 agent 照着干 |
| 11 | [Zed](./11-zed.md) | Zed Industries | Rust 编辑器把快做成信仰，秒级打开大项目 |
| 12 | [Warp](./12-warp.md) | Warp.dev | 把 shell 整个 agent 化的 AI 终端 |

## 三、国产军团

| 序号 | 工具 | 出品方 | 一句话点评 |
| --- | --- | --- | --- |
| 13 | [Qoder](./13-qoder.md) | 阿里 | Quest 模式先问清意图再动手，免费额度慷慨 |
| 14 | [Qwen Code](./14-qwen-code.md) | 阿里通义 | 模型工具双开源，白嫖党入门第一站 |
| 15 | [CodeBuddy](./15-codebuddy.md) | 腾讯 | 混元打底，写小程序对接腾讯云顺手 |
| 16 | [WorkBuddy](./16-workbuddy.md) | 腾讯 | CodeBuddy 的办公分身，CodeBuddy 管开发它管办公 |
| 17 | [Kimi For Coding](./17-kimi-for-coding.md) | 月之暗面 | 兼容 Claude Code 生态，迁移成本几乎为零 |
| 18 | [ZCode](./18-zcode.md) | 智谱 | GLM 官方 harness，往复杂任务自主交付走 |
| 19 | [DeepSeek Harness](./19-deepseek-harness.md) | 深度求索 | 一切皆插件，88 页论文证明插件装卸安全 |
| 20 | [Mimo](./20-mimo.md) | 小米 | 基于OpenCode 构建，主打长程任务扛大活 |
| 21 | [TraeWork](./21-traework.md) | 字节跳动 | Work/Code/Design 三模式，个人用户破 600 万 |
| 22 | [豆包工作](./22-doubao-work.md) | 字节跳动 | 主打操作电脑，国产 computer use 走得最靠前 |

## 四、开源新势力

全是开源项目：代码公开、可自部署、模型随便配，不绑订阅不锁平台，预算有限的个人开发者重点看。这拨大半沾亲带故——Cline 的后代、pi 的分支、OpenCode 的 fork，顺着 fork 关系捋就是一部 AI 编程工具演化史。

| 序号 | 工具 | 一句话点评 |
| --- | --- | --- |
| 23 | [Cline](./23-cline.md) | VS Code 开源 agent 插件祖师爷，后面一串工具都是它后代 |
| 24 | [Roo Code](./24-roo-code.md) | Cline 社区 fork，自定义 modes 玩出花 |
| 25 | [Kilo Code](./25-kilo-code.md) | Cline 加 Roo 超集，500 多模型零加价，被 Anaconda 收购 |
| 26 | [Kilo CLI](./26-kilo-cli.md) | Kilo 家族终端形态，OpenCode 的 fork |
| 27 | [OpenCode](./27-opencode.md) | 开源终端 agent 底座级项目，被 fork 就是认证 |
| 28 | [pi](./28-pi.md) | 极简 harness，system prompt 才几千 token |
| 29 | [OMP（Oh My Pi）](./29-omp.md) | pi 的社区 fork，把 CLI 和 IDE 焊在一起 |
| 30 | [Every Code](./30-every-code.md) | Codex CLI 社区 fork，diff 分析解释得明明白白 |
| 31 | [Goose](./31-goose.md) | Block 开源捐基金会，扩展机制设计好 |
| 32 | [OpenClaw](./32-openclaw.md) | 24 小时挂服务器替你干活，出圈也最有争议 |
| 33 | [Hermes](./33-hermes.md) | 持久记忆自己攒技能，越用越懂你 |

## 数据核验说明

- GitHub 仓库地址、star 数、开源协议经 GitHub API 实时核验，核验时间 **2026-10**；star 数随时间变化，以仓库页面为准。
- Kilo Code 与 Kilo CLI 共用同一仓库（被 Anaconda 收购后 IDE 和 CLI 合并，仓库为 `kilo-org/kilocode`，原文旧地址 `Kilo-Org/kilo` 已不是主仓库）。
- 商业产品（Copilot、Cursor、Kiro 等）标注闭源；Claude Code 的 Agent 代码在 `anthropics/claude-code` 开源（原文未标注，收录时核验补充）。

欢迎推荐遗漏的工具，参见[贡献指南](/about/contributing.html)。
