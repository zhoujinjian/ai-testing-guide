import { fileURLToPath } from "node:url";

import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";

import { navbar } from "./navbar";
import { sidebar } from "./sidebar";

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          // 将主题 PageViewInfo 依赖的 pageview 模块替换为不蒜子适配器（阅读量显示）
          "@vuepress/plugin-comment/pageview": fileURLToPath(
            new URL("./busuanzi-pageview.js", import.meta.url),
          ),
        },
      },
    },
  }),

  lang: "zh-CN",
  title: "2026年最新AI 测试开发学习路线",
  description:
    "从功能测试到质量工程的完整成长地图：传统测开功底 + AI 时代新赛道，免费开源持续更新",
  base: "/",

  head: [
    // 百度搜索资源平台站点验证
    ["meta", { name: "baidu-site-verification", content: "codeva-zUJJgNqjW2" }],
    // Google Search Console 站点验证
    ["meta", { name: "google-site-verification", content: "OCAP1Z7KuYZc6ExHaGOfoFNBZwPP1tl3beG1S_kgSj8" }],
    // Bing 站长工具站点验证
    ["meta", { name: "msvalidate.01", content: "F9A37D74992EBD7E53CD6FAAED083E9B" }],
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    ["link", { rel: "icon", href: "/favicon-32.png", sizes: "32x32" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "测试开发,SDET,学习路线,AI 测试,自动化测试,接口测试,性能测试,大模型评测,测试工程师",
      },
    ],
  ],

  theme: hopeTheme({
    hostname: "https://ai.testfather.cn",
    logo: "/logo.svg",
    author: "狂师",
    authorInfo: true,

    repo: "zhoujinjian/ai-testing-guide",
    docsDir: "docs",
    docsBranch: "main",
    repoDisplay: true,

    editLink: true,
    lastUpdated: true,
    contributors: true,
    darkMode: true,

    navbar,
    sidebar,

    footer:
      '内容遵循 CC BY-NC-SA 4.0 协议 · 作者 狂师 · 与 <a href="https://www.testfather.cn/" target="_blank" rel="noopener">AI 测试开发导航</a> 配套建设<br/><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">鄂ICP备2025148041号-1</a>',
    displayFooter: true,

    plugins: {
      // 图标使用本地内嵌 SVG（/icons/*.svg，绝对路径由 VPIcon 渲染为 img）
      // assets 置空：不注入 iconify/jsDelivr 等任何外部 CDN 脚本，国内访问零依赖
      icon: { assets: [] },

      // 中文全文搜索（含正文索引），快捷键 Ctrl/⌘+K
      // 注意：rc.107 起 searchPro 已废弃，官方推荐 @vuepress/plugin-slimsearch
      slimsearch: {
        indexContent: true,
      },
    },
  }),
});
