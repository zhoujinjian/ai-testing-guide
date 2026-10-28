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

/* ---------------- 侧边栏二维码引流 ---------------- */

const QR_ICON_MP =
  '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="9.4" cy="9.6" rx="6.6" ry="5.9" fill="#07C160"/><path d="M7.6 14.6 5.9 18.3a.45.45 0 0 0 .6.57l3.66-1.77z" fill="#07C160"/><circle cx="7" cy="9.1" r="1.15" fill="#fff"/><circle cx="11.8" cy="9.1" r="1.15" fill="#fff"/><ellipse cx="16.2" cy="16" rx="5.4" ry="4.8" fill="#07C160"/><path d="m17.6 20.3 1.5 2.4a.4.4 0 0 1-.5.58l-2.7-1.6z" fill="#07C160"/><circle cx="14.4" cy="15.6" r="1" fill="#fff"/><circle cx="18" cy="15.6" r="1" fill="#fff"/></svg>';
const QR_ICON_WECHAT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>';
const QR_ICON_ZSXQ =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>';

// 图片取自首页「加入交流」板块同款二维码，复制存于 public/images 下保证固定 URL
const QR_ITEMS = [
  {
    icon: QR_ICON_MP,
    title: "公众号「测试开发技术」",
    desc: "AI 提效技巧与测开干货",
    img: "/images/wechat-mp-qrcode.png",
  },
  {
    icon: QR_ICON_WECHAT,
    title: "作者微信",
    desc: "备注「测开学习」进交流群",
    img: "/images/wechat-author.png",
  },
  {
    icon: QR_ICON_ZSXQ,
    title: "AI 测开进化圈",
    desc: "微信扫码加入星球",
    img: "/images/zsxq.png",
  },
];

function createSideQRBar(): void {
  const bar = document.createElement("div");
  bar.className = "side-qr-bar";
  bar.innerHTML = QR_ITEMS.map(
    (item) => `
      <div class="qr-item">
        <button type="button" class="qr-btn" aria-label="${item.title}二维码">${item.icon}</button>
        <div class="qr-pop" role="tooltip">
          <img src="${item.img}" alt="${item.title}二维码"/>
          <div class="qr-pop-title">${item.title}</div>
          <div class="qr-pop-desc">${item.desc}</div>
        </div>
      </div>`,
  ).join("");

  // 触屏无 hover：点击展开、再点或点空白处收起，同时只展开一个
  bar.querySelectorAll<HTMLElement>(".qr-item").forEach((item) => {
    item.querySelector(".qr-btn")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const wasOpen = item.classList.contains("open");
      bar
        .querySelectorAll(".qr-item.open")
        .forEach((open) => open.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });
  document.addEventListener("click", () => {
    bar
      .querySelectorAll(".qr-item.open")
      .forEach((open) => open.classList.remove("open"));
  });

  document.body.appendChild(bar);
}

function initSideQR(): void {
  if (!document.querySelector(".side-qr-bar")) createSideQRBar();
}

/* ---------------- 客户端配置 ---------------- */

export default defineClientConfig({
  setup() {
    const route = useRoute();

    onMounted(() => {
      refreshPageview();
      initImmersive();
      initSideQR();
    });

    watch(() => route.path, () => {
      refreshPageview();
    });
  },
});
