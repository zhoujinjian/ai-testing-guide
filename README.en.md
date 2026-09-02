<h1 align="center">🔥 AI Test Development Learning Roadmap</h1>

<p align="center">
  <a href="./README.md">简体中文</a> · <a href="./README.en.md">English</a>
</p>

<p align="center">
  <b>A complete growth map from functional testing to quality engineering: master the fundamentals first, then multiply your efficiency with AI — free, open source, continuously updated 🚀</b>
</p>

<p align="center">
  <a href="https://ai.testfather.cn/" target="_blank" rel="noopener"><img src="https://img.shields.io/badge/Read_Online-ai.testfather.cn-blue?style=for-the-badge" alt="Read Online"/></a>
  <a href="https://github.com/zhoujinjian/ai-testing-guide"><img src="https://img.shields.io/github/stars/zhoujinjian/ai-testing-guide?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey?style=for-the-badge" alt="License: CC BY-NC-SA 4.0"/></a>
</p>

<p align="center">
  <img src="./assets/images/roadmap-banner.jpg" alt="AI Test Development Learning Roadmap" width="800"/>
</p>

> 🌏 **Note:** The chapter content is currently written in Simplified Chinese. English translations are planned — contributions are welcome!

Software test development is being reshaped by AI: AI can draft test cases and write test scripts, but judging *whether the testing is thorough enough, whether quality has regressed, and which layer a problem lives in* still takes a human. This repository organizes a complete learning path from zero to Software Development Engineer in Test (SDET): it builds a solid foundation in traditional test development **and** covers the two new disciplines of the AI era — using AI to boost your testing, and evaluating AI applications themselves.

## Who This Roadmap Is For

- **Students / fresh graduates**: CS majors or career switchers starting from scratch, preparing for test development, test automation, or quality engineering roles and needing a complete path from zero to job-ready
- **Functional / manual QA engineers**: doing mostly manual or functional testing, strong on business knowledge but weak on programming, wanting to level up programming, automation, and engineering skills to transition into test development
- **Programmers / backend developers**: with Java, Python, or backend experience, optimistic about quality engineering opportunities and looking to widen their job search to SDET roles
- **Experienced QA engineers**: already doing some automation but hitting a ceiling, wanting to break into performance testing, quality platforms, precision testing, and other advanced skills for better positions and pay
- **Engineers who want to learn AI testing**: from either QA or dev backgrounds, wanting to genuinely apply AI in testing work, or to enter the new field of AI application evaluation (RAG / Agent / LLMs)

You don't need to read it cover to cover: the [Roadmap Overview](./docs/roadmap/README.md) tailors three paths for "functional QA → SDET", "backend dev → SDET", and "campus hire from zero"; experienced engineers can pick chapters 8–11 based on target roles.

## Roadmap at a Glance

| Stage | Chapter | Cultivation Stage | Core Skills |
| --- | --- | --- | --- |
| **🧭 Awareness · Understanding the Role** | | | |
| Starting Point | [01 Understanding Test Development](./docs/roadmap/01-what-is-sdet.md) | 💨 Qi Refining | The SDET landscape · what SDETs actually do · what's new in the AI era |
| **🧱 Foundation · Programming & Engineering** | | | |
| Stage 1 | [02 CS Fundamentals](./docs/roadmap/02-cs-fundamentals.md) | 🧱 Foundation (Early) | Networking · operating systems · data structures & algorithms |
| Stage 2 | [03 Programming Languages](./docs/roadmap/03-programming.md) | 🏗️ Foundation (Middle) | Python / Java as primary language + unit test frameworks |
| Stage 3 | [04 Engineering Basics](./docs/roadmap/04-engineering-basics.md) | 🏯 Foundation (Complete) | MySQL · Redis caching · message queues & Nginx middleware · Linux · Git · Docker · K8s · CI/CD |
| **🧪 Testing Core · From Case Design to Quality Engineering** | | | |
| Stage 4 | [05 Testing Theory & Case Design](./docs/roadmap/05-testing-theory.md) | ⚗️ Core Formation | Six-dimension case framework · boundary & exception thinking |
| Stage 5 | [06 API Testing & Automation](./docs/roadmap/06-api-automation.md) | 👶 Nascent Soul (Early) | Layered frameworks · assertion systems · mocking & test data |
| Stage 6 | [07 UI & App Automation](./docs/roadmap/07-ui-app-automation.md) | 🧒 Nascent Soul (Middle) | Playwright · Selenium / Appium · POM |
| Stage 7 | [08 Performance & Stability Testing](./docs/roadmap/08-performance-testing.md) | 🧑 Nascent Soul (Late) | Load testing methodology · monitoring pipelines · bottleneck localization |
| Stage 8 | [09 CI/CD, Quality Platforms & Precision Testing](./docs/roadmap/09-quality-engineering.md) | 👁️ Spirit Transformation | CI/CD pipeline integration · test platforms · precision testing |
| **🤖 AI Era · Productivity & New Frontiers** | | | |
| Stage 9 | [10 AI-Assisted Testing](./docs/roadmap/10-ai-assisted-testing.md) | 🦋 Infant Transformation (Early) | AI coding productivity · prompt engineering · AI-generated cases & scripts · AI code review & failure triage · MCP / Skills |
| Stage 10 | [11 AI Application Testing & LLM Evaluation](./docs/roadmap/11-llm-evaluation.md) | ✨ Infant Transformation (Complete) | Dify knowledge base / workflow setup · evaluation set building · RAG / Agent / safety evaluation · LLM-as-a-Judge · release gates & bad-case feedback loops |
| **🚀 Practice & Job Hunting · Turning Skills into Offers** | | | |
| Practice | [12 Project Practice Guide](./docs/roadmap/12-project-practice.md) | ⚔️ Peak (Early) | 4 progressive projects: API framework → UI/App → performance debugging → AI evaluation platform |
| Interview | [13 Interview Preparation](./docs/roadmap/13-interview-guide.md) | 🏆 Peak · Ascension | Question bank by category · project storytelling frameworks |

> Chapters 6 and 7 can be learned in parallel; you can start using AI to boost your work from Stage 5 (API automation) onward — no need to finish all traditional skills first.
>
> 🎮 About the "cultivation stages": they're a playful nod to Chinese cultivation (xianxia) novels. You level up not by meditating, but by clearing the "self-check list" at the end of each chapter. Skipping levels leads to inner demons; bookmarking without studying destroys your dao foundation 😄

Start with the [Roadmap Overview](./docs/roadmap/README.md): it has tailored paths for different backgrounds, a 3–6 month study pace, and prioritization advice.

## Repository Layout

| Directory | Status | Description |
| --- | --- | --- |
| [docs/roadmap](./docs/roadmap/README.md) | Actively updated | The main learning path, one chapter per stage |
| [docs/knowledge](./docs/knowledge/README.md) | Planned | Deep dives on single topics: Playwright in action, reading JMeter reports, etc. |
| [docs/interview](./docs/interview/README.md) | Planned | Categorized interview questions with reference answers |
| [docs/resources](./docs/resources/README.md) | Planned | Tool lists, books, and course roundups |

## How to Use This Roadmap

1. Don't start by hoarding tool tutorials. Tools are quick to pick up; what sets people apart is test code quality, engineering integration, and problem localization.
2. Every chapter ends with a "self-check list". You've only mastered a chapter when you can answer all of its questions independently.
3. Start building projects after the first five stages — learn and build at the same time, don't wait until "everything is finished".
4. Read the two AI chapters (10, 11) early. Even if you can't do AI application evaluation yet, build the judgment first.

## Companion Resources (AI Test Development Hub)

This repository is built alongside the [AI Test Development Hub](https://www.testfather.cn/) (Chinese). The following online resources are updated in sync with the roadmap:

| Resource | Description |
| --- | --- |
| [Learning Paths](https://www.testfather.cn/learning-paths) | Online version of the roadmap with progress tracking |
| [Tutorials](https://www.testfather.cn/tutorials) | Stage-by-stage hands-on tutorials matching the chapters |
| [Interview Questions](https://www.testfather.cn/interviews) | High-frequency SDET interview questions online |
| [Skill Assessment](https://www.testfather.cn/interviews/assessment) | Self-assessment to locate your weak spots |
| [Resume Templates](https://www.testfather.cn/resume-templates) | Resume templates for test development jobs |
| [Skill Store](https://www.testfather.cn/skills) | AI testing productivity skills and prompt tools |
| [Courses](https://www.testfather.cn/courses) | Systematic test development courses |

## Community

The cultivation journey goes further with fellow travelers. Connect with me via:

| Author's WeChat (remark: 测开学习) | Official WeChat Account 「测试开发技术」 | Knowledge Planet (scan to join, Chinese) |
| --- | --- | --- |
| <img src="./assets/images/wechat-author.png" width="258" alt="Author's WeChat"/> | <img src="./assets/images/wechat-mp-qrcode.png" width="258" alt="Official Account"/> | <img src="./assets/images/zsxq.png" width="258" alt="Knowledge Planet"/> |

- **Author's WeChat**: add me with the remark "测开学习" (SDET learning) to join the test development group and keep pace with fellow learners
- **Official WeChat Account 「测试开发技术」**: AI productivity tips, SDET technical deep dives, and industry updates, pushed as soon as they're published
- **Knowledge Planet**: scan the QR code to join the community for in-depth exchanges with fellow SDETs

## Contributing

If you're a test development practitioner, an AI explorer, and willing to share your hands-on experience and lessons learned, join us in polishing this growth roadmap for every SDET in the AI era!

🎉 **What you'll gain:**

| Gain | Description |
| --- | --- |
| 🌟 Visibility | Showcase professional judgment in an active community and build your personal brand |
| 📚 Deep learning | Expose yourself to diverse perspectives and sharpen your skills with peers |
| 🏆 Recognition | Your contributions will be clearly credited and respected by the community |
| 🤝 Networking | Connect with like-minded partners in a vibrant test development ecosystem |

**How to participate:**

- Fix errors, add resources, share learning experience: feel free to open [Issues](https://github.com/zhoujinjian/ai-testing-guide/issues) and [PRs](https://github.com/zhoujinjian/ai-testing-guide/pulls); see the [contributing guide](./CONTRIBUTING.md) (Chinese)
- Want to co-build content in depth: add the author on WeChat (see [Community](#community) above) with the remark "共建" (co-build)

## Thanks for the Star

If this roadmap helps you, please give it a **Star** ⭐️ — your recognition keeps it updated!

<a href="https://www.star-history.com/?repos=zhoujinjian%2Fai-testing-guide&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=zhoujinjian/ai-testing-guide&type=date&theme=dark&legend=top-left&sealed_token=VQIV7YFzTs3ohT_vi9tJqJs5Mhjs_0sdRsX86ekXWxg1M49yuM9XOv-F13yZHrgOP-DxyElx8fMez9pVPhc111JaL8JI4J3UwRuDEDu5-WuCZTx4MVekxA" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=zhoujinjian/ai-testing-guide&type=date&legend=top-left&sealed_token=VQIV7YFzTs3ohT_vi9tJqJs5Mhjs_0sdRsX86ekXWxg1M49yuM9XOv-F13yZHrgOP-DxyElx8fMez9pVPhc111JaL8JI4J3UwRuDEDu5-WuCZTx4MVekxA" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=zhoujinjian/ai-testing-guide&type=date&legend=top-left&sealed_token=VQIV7YFzTs3ohT_vi9tJqJs5Mhjs_0sdRsX86ekXWxg1M49yuM9XOv-F13yZHrgOP-DxyElx8fMez9pVPhc111JaL8JI4J3UwRuDEDu5-WuCZTx4MVekxA" />
 </picture>
</a>

## 📌 Copyright & Reprint Notice

- The documentation in this repository is licensed under [CC BY-NC-SA 4.0](./LICENSE):
  - ✅ Free for personal learning and attributed blog reposting (cite the source and keep the link)
  - ❌ Unauthorized commercial use, paid columns, or training courses are prohibited
  - 🔄 Derivative works must use the same license
- Sample code in this repository is under the MIT license and free to use
- When reposting, credit at the top: Author **狂师 (KuangShi)** · Source https://github.com/zhoujinjian/ai-testing-guide
- Malicious copying/reposting (including paid WeChat/CSDN columns) will be pursued legally

## Changelog

- 2026-08: v1 initial release — complete 10-stage learning roadmap + 4 hands-on projects + interview guide.
