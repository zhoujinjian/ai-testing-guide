import type { SidebarOptions } from "vuepress-theme-hope";

export const sidebar: SidebarOptions = {
  "/roadmap/": [
    { text: "路线总览", link: "/roadmap/" },
    {
      text: "🧭 认知",
      collapsible: false,
      children: [{ text: "01 认识测试开发", link: "/roadmap/01-what-is-sdet.html" }],
    },
    {
      text: "🧱 筑基",
      collapsible: false,
      children: [
        { text: "02 计算机基础", link: "/roadmap/02-cs-fundamentals.html" },
        { text: "03 编程语言", link: "/roadmap/03-programming.html" },
        { text: "04 工程基础", link: "/roadmap/04-engineering-basics.html" },
      ],
    },
    {
      text: "🧪 测试核心",
      collapsible: false,
      children: [
        { text: "05 测试理论与用例设计", link: "/roadmap/05-testing-theory.html" },
        { text: "06 接口测试与接口自动化", link: "/roadmap/06-api-automation.html" },
        { text: "07 UI 与 App 自动化", link: "/roadmap/07-ui-app-automation.html" },
        { text: "08 性能与稳定性测试", link: "/roadmap/08-performance-testing.html" },
        { text: "09 CI/CD、质量平台与精准测试", link: "/roadmap/09-quality-engineering.html" },
      ],
    },
    {
      text: "🤖 AI 时代",
      collapsible: false,
      children: [
        { text: "10 AI 辅助测试", link: "/roadmap/10-ai-assisted-testing.html" },
        { text: "11 AI 应用测试与大模型评测", link: "/roadmap/11-llm-evaluation.html" },
      ],
    },
    {
      text: "🚀 实战与求职",
      collapsible: false,
      children: [
        { text: "12 项目实战指南", link: "/roadmap/12-project-practice.html" },
        { text: "13 面试准备", link: "/roadmap/13-interview-guide.html" },
      ],
    },
  ],

  // 以下板块内容上线后在此扩展目录结构
  "/knowledge/": [
    { text: "实战教程", link: "/knowledge/" },
    {
      text: "AI 测试实战系列",
      collapsible: false,
      children: [
        { text: "01 用例设计四件套", link: "/knowledge/01-testcase-design-toolkit.html" },
        { text: "02 接口文档智能解析", link: "/knowledge/02-api-schema-parser.html" },
        { text: "03 测试数据构造", link: "/knowledge/03-api-testdata-generator.html" },
        { text: "04 脚本批量生成", link: "/knowledge/04-api-testscript-generator.html" },
        { text: "05 脚本质量优化", link: "/knowledge/05-api-test-optimizer.html" },
        { text: "06 智能执行调度", link: "/knowledge/06-api-test-executor.html" },
        { text: "07 失败自动诊断修复", link: "/knowledge/07-api-failure-diagnoser.html" },
        { text: "08 测试数据清理", link: "/knowledge/08-api-testdata-cleaner.html" },
        { text: "09 测试报告生成", link: "/knowledge/09-api-report-generator.html" },
        { text: "10 全链路流水线编排", link: "/knowledge/10-api-pipeline-scheduler.html" },
      ],
    },
  ],
  "/interview/": [
    { text: "题库首页", link: "/interview/" },
    {
      text: "🤖 大模型测试",
      collapsible: false,
      children: [
        { text: "01 大模型测试与传统测试的本质区别", link: "/interview/llm-testing/01-llm-vs-traditional-testing.html" },
        { text: "02 LLM 知识库问答测试方案设计", link: "/interview/llm-testing/02-llm-kb-qa-test-plan.html" },
        { text: "03 大模型评测维度划分", link: "/interview/llm-testing/03-evaluation-dimensions.html" },
        { text: "04 测模型与测应用的边界", link: "/interview/llm-testing/04-model-vs-application-testing.html" },
        { text: "05 上线门禁怎么定", link: "/interview/llm-testing/05-release-gate.html" },
        { text: "06 评测集怎么建", link: "/interview/llm-testing/06-evalset-construction.html" },
        { text: "07 评测集怎么维护", link: "/interview/llm-testing/07-evalset-maintenance.html" },
        { text: "08 评测数据污染怎么防", link: "/interview/llm-testing/08-data-contamination.html" },
      ],
    },
  ],
  "/resources/": [{ text: "资源导航", link: "/resources/" }],
  "/about/": [
    { text: "关于本路线", link: "/about/" },
    { text: "参与共建", link: "/about/contributing.html" },
    { text: "更新日志", link: "/about/changelog.html" },
  ],
};
