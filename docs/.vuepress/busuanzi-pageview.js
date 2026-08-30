/**
 * 不蒜子（busuanzi）阅读量适配器
 *
 * 通过 vite alias 替换 `@vuepress/plugin-comment/pageview` 模块，
 * 使 theme-hope 原生的 PageViewInfo 组件（页面信息区的 👁 访问量）
 * 用不蒜子免费统计服务填充，无需部署后端。
 *
 * 适配器契约（与官方 Waline/Artalk pageview 模块一致）：
 *   export const isSupported: boolean
 *   export const usePageview: () => (options: { selector?: string }) => void
 *
 * SPA 路由切换后，通过带随机参数重新挂载脚本触发不蒜子
 * 按新 URL 重新拉取并填充计数。
 */

export const isSupported = true;

const BSZ_SRC =
  "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";

function triggerBusuanzi() {
  const old = document.querySelector("script[data-bsz]");
  if (old) old.remove();

  const script = document.createElement("script");
  script.async = true;
  script.dataset.bsz = "1";
  script.src = `${BSZ_SRC}?v=${Math.random().toString(36).slice(2, 8)}`;
  document.head.appendChild(script);
}

export const usePageview = () => (options) => {
  const selector = options?.selector || ".vp-pageview";
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  elements.forEach((el) => {
    let span = el.querySelector("span[id^='busuanzi_value']");
    if (!span) {
      span = document.createElement("span");
      span.id = "busuanzi_value_page_pv";
      el.textContent = "";
      el.appendChild(span);
    }
    span.textContent = "...";
  });

  triggerBusuanzi();
};
