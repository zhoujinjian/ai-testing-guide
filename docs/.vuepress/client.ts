import { onMounted, watch } from "vue";
import { defineClientConfig, useRoute } from "vuepress/client";

// 经 config.ts 中的 vite alias，此模块指向 ./busuanzi-pageview.js
import { usePageview } from "@vuepress/plugin-comment/pageview";

/* ---------------- 阅读量（不蒜子） ---------------- */

const updateBusuanzi = usePageview();

const refreshPageview = (): void => {
  setTimeout(() => updateBusuanzi({ selector: ".vp-pageview" }), 400);
};

/* ---------------- 沉浸式阅读 ---------------- */

const IMMERSIVE_KEY = "immersive-reading";
const IMMERSIVE_CLASS = "layout-hidden";

const ICON_ENTER =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
const ICON_EXIT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';

function createImmersiveButton(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = "immersive-toggle-btn";
  btn.title = "沉浸式阅读";
  btn.addEventListener("click", () => {
    const active = document.documentElement.classList.toggle(IMMERSIVE_CLASS);
    window.localStorage.setItem(IMMERSIVE_KEY, active ? "1" : "0");
    syncButtonState();
  });
  document.body.appendChild(btn);
  return btn;
}

function syncButtonState(): void {
  const btn = document.querySelector<HTMLButtonElement>(".immersive-toggle-btn");
  if (!btn) return;
  const active = document.documentElement.classList.contains(IMMERSIVE_CLASS);
  btn.classList.toggle("active", active);
  btn.innerHTML = `${active ? ICON_EXIT : ICON_ENTER}<span>${active ? "退出阅读" : "沉浸阅读"}</span>`;
}

function initImmersive(): void {
  // 恢复上次的模式选择
  if (window.localStorage.getItem(IMMERSIVE_KEY) === "1") {
    document.documentElement.classList.add(IMMERSIVE_CLASS);
  }
  if (!document.querySelector(".immersive-toggle-btn")) createImmersiveButton();
  syncButtonState();
}

/* ---------------- 客户端配置 ---------------- */

export default defineClientConfig({
  setup() {
    const route = useRoute();

    onMounted(() => {
      refreshPageview();
      initImmersive();
    });

    watch(() => route.path, () => {
      refreshPageview();
    });
  },
});
