/**
 * 不蒜子（busuanzi）阅读量适配器 · 本地缓存加速版
 *
 * 通过 vite alias 替换 `@vuepress/plugin-comment/pageview` 模块，
 * 使 theme-hope 原生的 PageViewInfo 组件（页面信息区的 👁 访问量）
 * 用不蒜子免费统计服务填充，无需部署后端。
 *
 * 适配器契约（与官方 Waline/Artalk pageview 模块一致）：
 *   export const isSupported: boolean
 *   export const usePageview: () => (options: { selector?: string }) => void
 *
 * 不蒜子数据接口（busuanzi.ibruce.info/busuanzi）高峰期经常长时间挂起，
 * 导致阅读量几十秒不显示。本版本三层防护：
 *   1. localStorage 缓存：同路径再次访问先秒显上次数值，后台静默刷新
 *   2. 超时兜底：新页面 6 秒仍无数据则显示「－」，不再悬挂省略号
 *   3. 防重复触发：同一路径 2 秒内不重复注入统计脚本
 *
 * SPA 路由切换后，通过带随机参数重新挂载脚本触发不蒜子
 * 按新 URL 重新拉取并填充计数。
 */

export const isSupported = true;

const BSZ_SRC =
  "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
const CACHE_KEY = "bsz-pageview-cache-v1";
const GIVE_UP_MS = 6000;
const RETRIGGER_MS = 2000;

const cacheStore = (() => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
})();

function saveCache(pathname, value) {
  try {
    cacheStore[pathname] = { v: value, t: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheStore));
  } catch {
    /* 隐私模式等场景下 localStorage 不可用，静默降级 */
  }
}

function readCache(pathname) {
  const hit = cacheStore[pathname];
  return hit && typeof hit.v === "number" ? hit : null;
}

let lastTrigger = { path: "", at: 0 };

function triggerBusuanzi() {
  const now = Date.now();
  const pathname = location.pathname;
  if (lastTrigger.path === pathname && now - lastTrigger.at < RETRIGGER_MS) {
    return;
  }
  lastTrigger = { path: pathname, at: now };

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

  const pathname = location.pathname;
  const cached = readCache(pathname);

  elements.forEach((el) => {
    let span = el.querySelector("span[id^='busuanzi_value']");
    if (!span) {
      span = document.createElement("span");
      span.id = "busuanzi_value_page_pv";
      el.textContent = "";
      el.appendChild(span);
    }

    // 有缓存先秒显上次数值（后台仍会刷新为最新），无缓存占位省略号
    span.textContent = cached ? String(cached.v) : "...";

    // 不蒜子回填后写回缓存，供下次秒显
    if (!span.dataset.cacheHooked) {
      span.dataset.cacheHooked = "1";
      const observer = new MutationObserver(() => {
        const text = span.textContent.trim();
        const num = Number(text.replace(/,/g, ""));
        if (text && text !== "..." && text !== "－" && Number.isFinite(num)) {
          saveCache(location.pathname, num);
        }
      });
      observer.observe(span, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    // 超时兜底：一直拿不到数据就不再挂着省略号
    clearTimeout(span._giveUpTimer);
    span._giveUpTimer = setTimeout(() => {
      if (span.textContent === "...") span.textContent = "－";
    }, GIVE_UP_MS);
  });

  triggerBusuanzi();
};
