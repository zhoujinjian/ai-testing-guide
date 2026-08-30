import type { NavbarOptions } from "vuepress-theme-hope";

export const navbar: NavbarOptions = [
  { text: "学习路线", link: "/roadmap/", activeMatch: "^/roadmap/" },
  { text: "面试题库", link: "/interview/", activeMatch: "^/interview/" },
  { text: "实战教程", link: "/knowledge/", activeMatch: "^/knowledge/" },
  { text: "资源导航", link: "/resources/", activeMatch: "^/resources/" },
  { text: "AI 测开导航", link: "https://www.testfather.cn/" },
  { text: "工具导航", link: "https://www.kjdaohang.com/" },
  {
    text: "关于",
    children: [
      { text: "关于本路线", link: "/about/" },
      { text: "参与共建", link: "/about/contributing.html" },
      { text: "更新日志", link: "/about/changelog.html" },
    ],
  },
];
