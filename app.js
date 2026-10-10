const root = document.documentElement;
const body = document.body;

// 本站仅提供中文内容，不读取旧语言偏好。
root.lang = "zh-CN";

const menuButton = document.querySelector("[data-menu]");
const mainNav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const open = body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(open));
});
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-tab-group]").forEach((group) => {
  const buttons = group.querySelectorAll("[data-tab]");
  const panels = group.querySelectorAll("[data-panel]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab));
    });
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll(".flow-track").forEach((track) => {
  track.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      track.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
});

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.dialog)?.showModal());
});
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const lightbox = document.querySelector("#lightbox");
document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox) return;
    const image = lightbox.querySelector("img");
    image.src = button.dataset.lightbox;
    image.alt = button.dataset.alt || "Project detail";
    lightbox.showModal();
  });
});

document.querySelectorAll("[data-backend-carousel] [data-backend-slide] img")[0]?.setAttribute("src", "./assets/backend-home/report-management.png");

document.querySelectorAll("[data-backend-home]").forEach((carousel) => {
  const track = carousel.querySelector("[data-backend-home-track]");
  const slides = [...carousel.querySelectorAll(".backend-home-slide")];
  const status = carousel.querySelector("[data-backend-home-status]");
  const prev = carousel.querySelector("[data-backend-home-prev]");
  const next = carousel.querySelector("[data-backend-home-next]");
  if (!track || slides.length < 2) return;
  let index = 0;
  let timer;
  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    if (status) status.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };
  const move = (step) => { index = (index + step + slides.length) % slides.length; render(); };
  const start = () => { window.clearInterval(timer); timer = window.setInterval(() => move(1), 5200); };
  prev?.addEventListener("click", () => { move(-1); start(); });
  next?.addEventListener("click", () => { move(1); start(); });
  render();
  start();
});

document.querySelectorAll("[data-backend-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll("[data-backend-slide]")];
  const status = carousel.querySelector("[data-backend-status]");
  const prev = carousel.querySelector("[data-backend-prev]");
  const next = carousel.querySelector("[data-backend-next]");
  if (slides.length !== 4) return;
  let index = 0;
  let timer;
  let touchStartX = 0;
  slides.forEach((slide) => {
    const image = slide.querySelector("img");
    if (image) { image.loading = "eager"; image.decoding = "async"; if (image.src) { const preload = new Image(); preload.src = image.src; } }
  });
  const render = (direction = 1, instant = false) => {
    carousel.dataset.direction = direction > 0 ? "next" : "prev";
    carousel.classList.toggle("is-instant", instant);
    slides.forEach((slide, i) => {
      const offset = (i - index + slides.length) % slides.length;
      slide.classList.toggle("is-active", offset === 0);
      slide.classList.toggle("is-next", offset === 1);
      slide.classList.toggle("is-prev", offset === slides.length - 1);
    });
    slides.forEach((slide) => { slide.style.top = "0px"; });
    const firstImage = slides[0]?.querySelector("img");
    if (firstImage) {
      const firstSource = new URL("./assets/backend-home/report-management.png", document.baseURI).href;
      if (firstImage.src !== firstSource) firstImage.src = firstSource;
      firstImage.addEventListener("error", () => {
        firstImage.src = `${firstSource}?retry=${Date.now()}`;
      }, { once: true });
    }
    if (status) status.textContent = `${String(index + 1).padStart(2, "0")} / 04`;
    if (instant) requestAnimationFrame(() => carousel.classList.remove("is-instant"));
  };
  const move = (step) => {
    index = (index + step + slides.length) % slides.length;
    render(step);
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => move(1), 5200); };
  prev?.addEventListener("click", () => { move(-1); start(); });
  next?.addEventListener("click", () => { move(1); start(); });
  carousel.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return;
    move(delta < 0 ? 1 : -1); start();
  }, { passive: true });
  render(1, true);
  start();
});

const pageWallImages = [
  ["首页设计.png", "首页设计"], ["搭子.png", "搭子"], ["瞬间.png", "瞬间"], ["聊天.png", "聊天"],
  ["自己看主页.png", "个人主页"], ["个人资料——普通用户.png", "个人资料"], ["发布合并 .png", "发布"],
  ["福利中心.png", "福利中心"], ["服务详情页面.png", "服务详情"], ["服务详情页操作板块.png", "服务详情操作"],
  ["选择服务弹窗.jpg", "选择服务"], ["特色体验认证.png", "特色体验认证"], ["特色活动详情.png", "特色活动详情"],
  ["特色活动申请.png", "特色活动申请"], ["特色活动下单.png", "特色活动下单"], ["我买到的.png", "我买到的"],
  ["我买到的-待支付订单详情页.png", "待支付订单"], ["订单页购买保险.png", "订单保险"], ["订单取消争议.jpg", "订单取消争议"],
  ["游客打分.png", "游客打分"], ["只有订单余额提现.png", "余额提现"]
];
const pageWall = document.querySelector(".page-wall-grid");
if (pageWall) {
  const cards = [...pageWall.querySelectorAll("[data-wall-card]")];
  pageWallImages.forEach(([file, label], index) => {
    let card = cards[index];
    if (!card) {
      card = document.createElement("figure");
      card.className = "page-wall-card";
      card.dataset.wallCard = "";
      card.tabIndex = 0;
      card.innerHTML = '<div class="page-wall-block"></div><figcaption><strong></strong><span>页面预览</span></figcaption>';
      pageWall.appendChild(card);
    }
    const block = card.querySelector(".page-wall-block");
    const image = document.createElement("img");
    image.src = `./assets/page-wall/${file}`;
    image.alt = `游鸭手机端页面：${label}`;
    block.replaceChildren(image);
    card.querySelector("figcaption strong").textContent = label;
  });

  const balancePageWall = () => {
    const cards = [...pageWall.querySelectorAll(":scope > .page-wall-card, :scope > .page-wall-column > .page-wall-card")];
    const columnCount = window.innerWidth <= 760 ? 3 : 5;
    const columns = Array.from({ length: columnCount }, () => {
      const column = document.createElement("div");
      column.className = "page-wall-column";
      return column;
    });
    const heights = columns.map(() => 0);
    pageWall.replaceChildren(...columns);
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const ratio = image?.naturalWidth && image?.naturalHeight ? image.naturalHeight / image.naturalWidth : 2.2;
      const columnIndex = heights.indexOf(Math.min(...heights));
      columns[columnIndex].appendChild(card);
      heights[columnIndex] += ratio;
    });
  };
  pageWall.querySelectorAll("img").forEach((image) => image.addEventListener("load", balancePageWall, { once: true }));
  balancePageWall();
  let balanceTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(balanceTimer);
    balanceTimer = window.setTimeout(balancePageWall, 120);
  });
}

const levelSlider = document.querySelector("#levelSlider");
function updateLevelDemo() {
  if (!levelSlider) return;
  const value = Number(levelSlider.value);
  const output = document.querySelector("#levelOutput");
  const labels = root.lang === "en"
    ? ["Observation", "Verified", "Active", "Trusted", "Priority"]
    : ["观察期", "已认证", "活跃服务者", "可信服务者", "优先服务者"];
  output.textContent = labels[value - 1];
  document.querySelector(".level-meter")?.style.setProperty("--level", `${value * 20}%`);
}
levelSlider?.addEventListener("input", updateLevelDemo);

// 部分内嵌预览环境没有原生 IntersectionObserver；没有兼容兜底时，
// 首个观察器初始化会中断整份脚本，导致后续板块永远停留在隐藏状态。
const IntersectionObserver = window.IntersectionObserver || class {
  constructor(callback) {
    this.callback = callback;
    this.nodes = new Set();
    this.refresh = this.refresh.bind(this);
    window.addEventListener("scroll", this.refresh, { passive: true });
    window.addEventListener("resize", this.refresh);
  }
  observe(node) {
    this.nodes.add(node);
    this.refresh();
  }
  unobserve(node) {
    this.nodes.delete(node);
  }
  disconnect() {
    this.nodes.clear();
    window.removeEventListener("scroll", this.refresh);
    window.removeEventListener("resize", this.refresh);
  }
  refresh() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rootMargin = 0;
    this.callback([...this.nodes].map((target) => {
      const rect = target.getBoundingClientRect();
      return { target, isIntersecting: rect.bottom >= viewportHeight * 0.14 && rect.top <= viewportHeight * 0.86 };
    }), this);
  }
};
const revealSelector = "[data-reveal], [data-service-reveal]";
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.14 });
document.querySelectorAll(revealSelector).forEach((node) => observer.observe(node));
document.querySelectorAll("[data-wall-card]").forEach((node) => observer.observe(node));
document.querySelectorAll(".work-preview-card").forEach((node) => observer.observe(node));

// 游鸭顶部目录：返回按钮在目录轨道之外；中间项居中，首尾项按边界吸附。
function initYouyaCaseNavigation() {
  const viewport = document.querySelector("[data-youya-nav-viewport]");
  const nav = viewport?.querySelector("[data-youya-case-directory]");
  const links = nav ? [...nav.querySelectorAll("a[href^='#']")] : [];
  if (!viewport || !nav || !links.length) return;
  const sync = (activeLink = links.find((link) => link.getAttribute("aria-current") === "location") || links[0]) => {
    links.forEach((link) => {
      link.style.removeProperty("--nav-space-left");
      link.style.removeProperty("--nav-space-right");
    });
    const scaledLinks = links.filter((link) => link === activeLink || link.matches(":hover, :focus-visible"));
    scaledLinks.forEach((link) => {
      const scale = link === activeLink ? 1.28 : 1.05;
      const expansion = Math.max(0, link.offsetWidth * (scale - 1));
      link.style.setProperty("--nav-space-left", "0px");
      link.style.setProperty("--nav-space-right", `${expansion}px`);
    });
    const maxShift = Math.max(0, nav.scrollWidth - viewport.clientWidth);
    const activeCenter = activeLink.offsetLeft + activeLink.offsetWidth / 2;
    const desired = viewport.clientWidth / 2 - activeCenter;
    let shift = Math.max(-maxShift, Math.min(0, desired));
    if (document.body.classList.contains("theme-zaowuyun")) {
      // Keep the rail still when it fits; on narrow screens move only far enough
      // to reveal the selected item, rather than centering every selection.
      const previous = parseFloat(nav.style.getPropertyValue("--nav-shift")) || 0;
      const left = activeLink.offsetLeft;
      const right = left + activeLink.offsetWidth * 1.28;
      shift = maxShift <= 1 ? 0 : Math.max(-maxShift, Math.min(0, previous));
      if (maxShift > 1) {
        if (left + shift < 12) shift = 12 - left;
        else if (right + shift > viewport.clientWidth - 12) shift = viewport.clientWidth - 12 - right;
        shift = Math.max(-maxShift, Math.min(0, shift));
      }
      const leftFade = shift < -1;
      const rightFade = shift > -maxShift + 1;
      const start = leftFade ? "transparent 0%, rgba(0,0,0,.5) 3%, #000 10%" : "#000 0%";
      const end = rightFade ? "#000 90%, rgba(0,0,0,.5) 97%, transparent 100%" : "#000 100%";
      viewport.style.setProperty("--case-nav-mask", maxShift <= 1 ? "none" : `linear-gradient(90deg, ${start}, ${end})`);
    }
    nav.style.setProperty("--nav-shift", `${shift}px`);
    const activeIndex = links.indexOf(activeLink);
    viewport.classList.toggle("is-first-active", activeIndex === 0);
    viewport.classList.toggle("is-last-active", activeIndex === links.length - 1);
    viewport.classList.toggle("has-left-overflow", shift < -1);
    viewport.classList.toggle("has-right-overflow", shift > -maxShift + 1);
  };
  const setActive = (link) => {
    links.forEach((item) => item.setAttribute("aria-current", item === link ? "location" : "false"));
    sync(link);
  };
  setActive(links.find((link) => link.hash === window.location.hash) || links[0]);
  links.forEach((link) => link.addEventListener("click", () => setActive(link)));
  window.addEventListener("hashchange", () => {
    const match = links.find((link) => link.hash === window.location.hash);
    if (match) setActive(match);
  });
  const targets = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  if (document.body.classList.contains("theme-zaowuyun")) {
    let anchorUntil = 0;
    let frame = 0;
    const alignAnchor = () => {
      const link = links.find((item) => item.hash === window.location.hash);
      const target = link && document.querySelector(link.hash);
      if (!target) return;
      anchorUntil = performance.now() + 500;
      target.scrollIntoView({ behavior: "instant", block: "start" });
      setActive(link);
    };
    links.forEach((link) => link.addEventListener("click", () => {
      anchorUntil = performance.now() + 1000;
    }));
    const syncSection = () => {
      frame = 0;
      if (performance.now() < anchorUntil) return;
      const readingLine = Math.max(90, window.innerHeight * .25);
      const current = targets.filter((target) => target.getBoundingClientRect().top <= readingLine).at(-1) || targets[0];
      const link = links.find((item) => item.hash === `#${current.id}`);
      if (link) setActive(link);
    };
    window.addEventListener("scroll", () => {
      if (!frame) frame = requestAnimationFrame(syncSection);
    }, { passive: true });
    window.addEventListener("load", alignAnchor, { once: true });
    window.addEventListener("hashchange", alignAnchor);
  } else if (targets.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) { const link = links.find((item) => item.hash === `#${visible.target.id}`); if (link) setActive(link); }
    }, { rootMargin: "-20% 0px -62% 0px", threshold: [0, .25, .6] });
    targets.forEach((target) => sectionObserver.observe(target));
  }
  window.addEventListener("resize", () => sync(), { passive:true });
  window.addEventListener("pointermove", () => sync(), { passive:true });
}
initYouyaCaseNavigation();

// AI 详情页：左右补色只在前景素材实际缩小、无法填满画布时显示；底部纯色跟随素材真实底边。
function syncAiDetailComposition() {
  document.querySelectorAll(".case-ai-detail-canvas").forEach((canvas) => {
    const supporting = canvas.querySelector(".case-ai-supporting");
    const boundary = canvas.querySelector(".case-ai-supporting");
    const solid = canvas.querySelector(".case-ai-bottom-solid");
    if (!supporting || !solid) return;
    const canvasRect = canvas.getBoundingClientRect();
    const supportingRect = supporting.getBoundingClientRect();
    const needsSideFill = supportingRect.width < canvasRect.width - 1;
    canvas.classList.toggle("needs-side-fill", needsSideFill);
    if (canvasRect.height > 0) {
      const anchor = boundary?.getBoundingClientRect();
      const anchorBottom = anchor?.bottom ?? supportingRect.bottom;
      const topPercent = Math.max(0, Math.min(100, ((anchorBottom - canvasRect.top) / canvasRect.height) * 100));
      canvas.style.setProperty("--ai-solid-top", `${topPercent}%`);
      if (anchor) {
        canvas.style.setProperty("--ai-solid-left", `${((anchor.left - canvasRect.left) / canvasRect.width) * 100}%`);
        canvas.style.setProperty("--ai-solid-width", `${(anchor.width / canvasRect.width) * 100}%`);
      }
    }
  });
}
syncAiDetailComposition();
window.addEventListener("resize", syncAiDetailComposition, { passive: true });
window.addEventListener("load", syncAiDetailComposition, { once: true });
window.setTimeout(syncAiDetailComposition, 100);
window.setTimeout(syncAiDetailComposition, 800);
if ("ResizeObserver" in window) {
  const aiCompositionObserver = new ResizeObserver(syncAiDetailComposition);
  document.querySelectorAll(".case-ai-detail-canvas, .case-ai-supporting").forEach((node) => aiCompositionObserver.observe(node));
}

// IP 资产区是长内容画布，不能依赖通用 reveal 的 14% 阈值；每个分组进入视口即触发。
const ipRevealNodes = [...document.querySelectorAll("#ip-promo [data-reveal]")];
if (ipRevealNodes.length) {
  ipRevealNodes.forEach((node) => {
    node.querySelectorAll("img").forEach((image, index) => image.style.setProperty("--ip-index", String(index + 1)));
  });
  const revealIPNodes = () => {
    const viewportHeight = window.innerHeight || root.clientHeight;
    ipRevealNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.bottom >= viewportHeight * 0.14 && rect.top <= viewportHeight * 0.86 && rect.height > 0) {
        node.classList.add("visible");
      }
    });
  };
  const ipObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0, rootMargin: "12% 0px 12% 0px" });
  ipRevealNodes.forEach((node) => ipObserver.observe(node));
  // 不在整个 IP 区进入视口时一次性显示全部分组；每个分组按全站 reveal 规则逐个进入。
  revealIPNodes();
  window.addEventListener("scroll", revealIPNodes, { passive: true });
  window.addEventListener("load", revealIPNodes, { once: true });
}

// 首屏兜底：页面切换、滚动位置恢复或图片布局延迟时，IntersectionObserver 可能错过首屏节点。
function revealNodesInViewport() {
  const viewportHeight = window.innerHeight || root.clientHeight;
  document.querySelectorAll(revealSelector).forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.bottom >= viewportHeight * 0.14 && rect.top <= viewportHeight * 0.86 && rect.height > 0) node.classList.add("visible");
  });
}
revealNodesInViewport();
window.addEventListener("load", revealNodesInViewport, { once: true });
window.addEventListener("pageshow", revealNodesInViewport);
window.addEventListener("scroll", revealNodesInViewport, { passive: true });
window.setTimeout(revealNodesInViewport, 500);

function revealContentBeforeHashTarget() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  const allReveal = [...document.querySelectorAll(revealSelector)];
  const targetIndex = allReveal.findIndex((node) => node === target || node.contains(target));
  if (targetIndex < 0) return;
  allReveal.slice(0, targetIndex + 1).forEach((node) => node.classList.add("visible"));
}
revealContentBeforeHashTarget();
window.addEventListener("hashchange", revealContentBeforeHashTarget);

// AI 视觉板块：必须等用户真实滚动到板块后，才开始错峰入场。
const aiVisualSections = [...document.querySelectorAll("#ai-visual-exploration .ai-archive-hero, #ai-visual-exploration .ai-archive-scenes, #ai-visual-exploration .ai-archive-app, #ai-visual-exploration .ai-archive-icons, #ai-visual-exploration .ai-archive-boundary")];
if (aiVisualSections.length && "IntersectionObserver" in window) {
  const aiVisualObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("ai-in-view");
    aiVisualObserver.unobserve(entry.target);
  }, { threshold: 0.01, rootMargin: "0px 0px -8% 0px" });
  aiVisualSections.forEach((section) => aiVisualObserver.observe(section));
}

// 订单系统复用全站 reveal observer；不再设置独立 rootMargin 或提前触发的滚动兜底。
document.documentElement.classList.add("service-motion-ready");
document.documentElement.classList.remove("service-order-preflight");

const designAnalysis = document.querySelector("[data-design-analysis]");
if (designAnalysis && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const analysisItems = [...designAnalysis.querySelectorAll(".design-analysis-item")];
  const revealedAnalysisItems = new Set();
  let analysisStarted = false;

  const revealAnalysisItem = (selector) => {
    const node = designAnalysis.querySelector(selector);
    if (!node || revealedAnalysisItems.has(node)) return;
    revealedAnalysisItems.add(node);
    node.dataset.analysisProgress = "1.000";
    node.style.setProperty("--analysis-opacity", "1");
    const completionDelay = node.matches("[data-analysis-goal]") ? 2600 : 820;
    window.setTimeout(() => node.classList.add("analysis-complete"), completionDelay);
  };

  const revealGoalSlice = (index) => {
    const slice = designAnalysis.querySelector(`.design-goal-slice-${index}`);
    if (!slice || slice.dataset.analysisRevealed) return;
    slice.dataset.analysisRevealed = "true";
    slice.style.setProperty("--goal-slice-opacity", "1");
    if (index === 3) {
      window.setTimeout(() => designAnalysis.querySelector("[data-analysis-goal]")?.classList.add("analysis-complete"), 1120);
    }
  };

  const playDesignAnalysisSequence = () => {
    const timeline = [
      [0, "[data-analysis-input=\"1\"]"],
      [1000, "[data-analysis-branch=\"1\"]"],
      [1100, "[data-analysis-input=\"2\"]"],
      [2100, "[data-analysis-branch=\"2\"]"],
      [3200, "[data-analysis-input=\"3\"]"],
      [4200, "[data-analysis-branch=\"3\"]"],
      [6900, "[data-analysis-transition]"],
      [8200, "[data-analysis-strategy]"],
    ];
    timeline.forEach(([delay, selector]) => window.setTimeout(() => revealAnalysisItem(selector), delay));
    [[2200, 1], [4300, 2], [5300, 3]].forEach(([delay, index]) => {
      window.setTimeout(() => revealGoalSlice(index), delay);
    });
  };

  const analysisRoot = document.documentElement;
  analysisRoot.classList.add("design-analysis-initializing");
  analysisItems.forEach((node) => node.style.setProperty("--analysis-opacity", "0"));
  designAnalysis.querySelectorAll(".design-goal-slice").forEach((node) => node.style.setProperty("--goal-slice-opacity", "0"));
  analysisRoot.classList.add("design-analysis-motion");
  analysisRoot.classList.remove("design-analysis-preflight");
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    analysisRoot.classList.remove("design-analysis-initializing");
  }));
  const analysisProximityObserver = new IntersectionObserver((entries) => {
    if (analysisStarted || !entries.some((entry) => entry.isIntersecting)) return;
    analysisStarted = true;
    playDesignAnalysisSequence();
    analysisProximityObserver.disconnect();
  }, { threshold: 0.02, rootMargin: "0px 0px -12% 0px" });
  analysisProximityObserver.observe(designAnalysis);
}

const designStyle = document.querySelector("[data-design-style]");
if (designStyle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const styleRoot = document.documentElement;
  const styleContents = [...designStyle.querySelectorAll(".design-style-content")];
  styleRoot.classList.add("design-style-initializing");
  styleContents.forEach((node) => node.style.setProperty("--style-opacity", "0"));
  styleRoot.classList.add("design-style-motion");
  styleRoot.classList.remove("design-style-preflight");
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    styleRoot.classList.remove("design-style-initializing");
  }));

  const styleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const content = entry.target.querySelector(".design-style-content");
      if (!content || content.dataset.styleRevealed) return;
      content.dataset.styleRevealed = "true";
      content.style.setProperty("--style-opacity", "1");
      window.setTimeout(() => content.classList.add("style-complete"), 980);
      styleObserver.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -18% 0px" });

  designStyle.querySelectorAll("[data-design-style-stage]").forEach((stage) => styleObserver.observe(stage));
}
document.querySelectorAll(".work-preview-track").forEach((previewTrack) => {
  if (!previewTrack.dataset.cloned) {
    previewTrack.innerHTML += previewTrack.innerHTML;
    previewTrack.dataset.cloned = "true";
  }
});

document.querySelectorAll(".popup-carousel-track").forEach((track) => {
  if (track.dataset.cloned) return;
  track.innerHTML += track.innerHTML;
  track.dataset.cloned = "true";
});

const popupFrameSequences = {
  left: ["left-1", "left-2", "left-3", "left-4"],
  right: ["right-5", "right-6", "right-7", "right-8"]
};
document.querySelectorAll(".popup-stage-sequence[data-popup-sequence]").forEach((image) => {
  const folders = popupFrameSequences[image.dataset.popupSequence] || [];
  let frames = [];
  let frameIndex = 0;
  let timer = null;
  const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  const loadFrames = async () => {
    const lists = await Promise.all(folders.map(async (folder) => {
      const countMap = { "left-1":192,"left-2":192,"left-3":144,"left-4":71,"right-5":30,"right-6":64,"right-7":24,"right-8":232 };
      return Array.from({length: countMap[folder] || 0}, (_, i) => `./assets/popup-design/frames/${folder}/${String(i + 1).padStart(4, "0")}.webp`);
    }));
    frames = lists.flat();
    image.closest(".popup-stage")?.classList.add("has-sequence");
    frames.slice(0, 8).forEach((src) => { const preload = new Image(); preload.src = src; });
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = null; frameIndex = 0; if (frames[0]) image.src = frames[0]; };
  const start = () => { stop(); if (!frames.length) return; timer = window.setInterval(() => { image.src = frames[frameIndex++ % frames.length]; const next = new Image(); next.src = frames[(frameIndex + 8) % frames.length]; }, 1000 / 24); };
  image._popupPlay = start;
  image._popupStop = stop;
  loadFrames();
});
const popupDesign = document.querySelector("#popup-design");
if (popupDesign && "IntersectionObserver" in window) {
  const popupObserver = new IntersectionObserver(([entry]) => {
    popupDesign.querySelectorAll(".popup-stage-sequence").forEach((image) => {
      if (entry.isIntersecting) image._popupPlay?.();
      else image._popupStop?.();
    });
  }, { threshold: 0.2 });
  popupObserver.observe(popupDesign);
}

const scrollStories = document.querySelectorAll("[data-scroll-story]");
function clampProgress(value) {
  return Math.min(1, Math.max(0, value));
}

function applyStepProgress(node, progress) {
  node.style.setProperty("--step-opacity", progress.toFixed(3));
  node.style.setProperty("--step-y", `${((1 - progress) * 70).toFixed(1)}px`);
  node.style.setProperty("--step-rotate", `${(-10 + progress * 10).toFixed(2)}deg`);
  node.style.setProperty("--step-scale", (0.82 + progress * 0.18).toFixed(3));
  node.style.setProperty("--step-bright", (0.68 + progress * 0.32).toFixed(3));
}

function applyPopProgress(node, progress) {
  const base = node.classList.contains("pop-1") || node.classList.contains("pop-4") || node.classList.contains("pop-5") ? -72 : 72;
  node.style.setProperty("--pop-opacity", progress.toFixed(3));
  node.style.setProperty("--pop-shift", `${(base * (1 - progress)).toFixed(1)}px`);
  node.style.setProperty("--pop-scale", (0.92 + progress * 0.08).toFixed(3));
}

function updateScrollStories() {
  const viewport = window.innerHeight || root.clientHeight;
  scrollStories.forEach((story) => {
    const rect = story.getBoundingClientRect();
    const travel = Math.max(1, rect.height - viewport * 0.72);
    const progress = Math.min(1, Math.max(0, (viewport * 0.72 - rect.top) / travel));
    story.style.setProperty("--story-progress", progress.toFixed(3));
    story.querySelectorAll(".flow-phone").forEach((node, index) => {
      const thresholds = [0, 0.18, 0.38, 0.58];
      applyStepProgress(node, clampProgress((progress - thresholds[index]) * 4));
    });
    story.querySelectorAll(".notice-pop").forEach((node, index) => {
      const thresholds = [0, 0.12, 0.26, 0.4, 0.54, 0.68];
      applyPopProgress(node, clampProgress((progress - thresholds[index]) * 5));
    });
  });
}

const canUsePointerMotion = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fogHost = document.querySelector("#cover-fog");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let fogEffect = null;

function initWeightedWords() {
  document.querySelectorAll(".about-word").forEach((word) => {
    word.tabIndex = 0;
    word.setAttribute("aria-label", `${word.getAttribute("aria-label") || word.textContent.trim()}，聚焦后可用左右方向键查看逐字效果`);
    const letters = [...word.querySelectorAll(":scope > span")];
    letters.forEach((letter) => {
      if (letter.querySelector(":scope > .weighted-glyph")) return;
      const glyph = document.createElement("span");
      glyph.className = "weighted-glyph";
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = letter.textContent;
      letter.replaceChildren(glyph);
    });
    const interactiveLetters = letters.filter((letter) => letter.textContent.trim());
    let keyboardIndex = Math.floor((interactiveLetters.length - 1) / 2);
    let updateFrame = 0;

    const setWeights = (centerX) => {
      const centers = interactiveLetters.map((letter) => {
        const rect = letter.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
      const step = centers.length > 1
        ? centers.slice(1).reduce((sum, value, index) => sum + value - centers[index], 0) / (centers.length - 1)
        : 1;
      interactiveLetters.forEach((letter, index) => {
        const distance = Math.abs(centers[index] - centerX) / Math.max(1, step);
        const weight = 0.08 + 0.92 * Math.exp(-0.68 * distance * distance);
        letter.style.setProperty("--letter-weight", weight.toFixed(3));
      });
    };

    const resetWeights = () => letters.forEach((letter) => letter.style.setProperty("--letter-weight", "0"));
    const lockWidths = () => {
      word.classList.add("is-measuring");
      resetWeights();
      word.style.setProperty("--word-fit-scale", "1");
      word.style.setProperty("--letter-gap", "0px");
      letters.forEach((letter) => letter.style.removeProperty("--letter-slot"));
      const wordStyle = getComputedStyle(word);
      const fontSize = Number.parseFloat(wordStyle.fontSize);
      const isAboutWord = word.classList.contains("about-word");
      const maxScaleX = isAboutWord ? 1.32 : 1.16;
      const clearGap = Math.min(isAboutWord ? 9 : 8, Math.max(4, fontSize * (isAboutWord ? 0.045 : 0.035)));
      const intrinsicWidths = letters.map((letter) => letter.textContent.trim()
        ? letter.querySelector(".weighted-glyph").getBoundingClientRect().width
        : fontSize * 0.28);
      const desiredSlots = intrinsicWidths.map((width) => width * maxScaleX);
      const availableWidth = isAboutWord
        ? Math.min(word.parentElement.clientWidth, window.innerWidth - 28)
        : word.clientWidth;
      const desiredTotal = desiredSlots.reduce((sum, width) => sum + width, 0) + clearGap * (letters.length - 1);
      const fitScale = Math.min(1, availableWidth / desiredTotal);
      word.style.setProperty("--word-fit-scale", fitScale.toFixed(4));
      word.style.setProperty("--letter-gap", `${(clearGap * fitScale).toFixed(2)}px`);
      letters.forEach((letter, index) => {
        letter.style.setProperty("--letter-slot", `${(desiredSlots[index] * fitScale).toFixed(2)}px`);
      });
      requestAnimationFrame(() => word.classList.remove("is-measuring"));
    };

    lockWidths();
    word.addEventListener("pointermove", (event) => {
      if (reducedMotionQuery.matches) return;
      cancelAnimationFrame(updateFrame);
      updateFrame = requestAnimationFrame(() => setWeights(event.clientX));
    });
    word.addEventListener("pointerleave", () => {
      if (!word.matches(":focus-visible")) resetWeights();
    });
    word.addEventListener("focus", () => {
      const rect = interactiveLetters[keyboardIndex]?.getBoundingClientRect();
      if (rect && !reducedMotionQuery.matches) setWeights(rect.left + rect.width / 2);
    });
    word.addEventListener("blur", resetWeights);
    word.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || reducedMotionQuery.matches) return;
      event.preventDefault();
      if (event.key === 'Home') keyboardIndex = 0;
      else if (event.key === 'End') keyboardIndex = interactiveLetters.length - 1;
      else keyboardIndex = Math.min(interactiveLetters.length - 1, Math.max(0, keyboardIndex + (event.key === 'ArrowRight' ? 1 : -1)));
      const rect = interactiveLetters[keyboardIndex].getBoundingClientRect();
      setWeights(rect.left + rect.width / 2);
    });
    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(lockWidths, 120);
    });
  });
}

initWeightedWords();

const aiMatchFeature = document.querySelector("[data-ai-match-feature]");
const aiMatchToggle = aiMatchFeature?.querySelector(".ai-match-toggle");
const aiMatchDetails = aiMatchFeature?.querySelector(".ai-match-details");
if (aiMatchToggle && aiMatchDetails) {
  aiMatchToggle.addEventListener("click", () => {
    const open = aiMatchToggle.getAttribute("aria-expanded") === "true";
    aiMatchToggle.setAttribute("aria-expanded", String(!open));
    aiMatchDetails.hidden = open;
    aiMatchFeature.classList.toggle("is-open", !open);
    aiMatchToggle.querySelector("span").textContent = open ? "↗" : "↙";
    aiMatchToggle.firstChild.textContent = open ? "查看案例 " : "收起案例 ";
    if (!open) window.requestAnimationFrame(() => aiMatchDetails.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" }));
  });
}

function destroyFog() {
  if (fogEffect) {
    fogEffect.destroy();
    fogEffect = null;
  }
  fogHost?.closest(".portfolio-cover")?.classList.remove("vanta-ready");
}

function initFog() {
  if (!fogHost || fogEffect) return;
  if (reducedMotionQuery.matches) {
    fogHost.dataset.fogStatus = "reduced-motion";
    return;
  }
  if (!window.THREE || !window.VANTA?.FOG) {
    fogHost.dataset.fogStatus = "runtime-unavailable";
    return;
  }
  try {
    fogEffect = window.VANTA.FOG({
      el: fogHost,
      THREE: window.THREE,
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      highlightColor: 0xcfff00,
      midtoneColor: 0xff478f,
      lowlightColor: 0x5637d8,
      baseColor: 0x020305,
      blurFactor: 0.64,
      speed: 0.42,
      zoom: 1.16,
      scale: 2,
      scaleMobile: 4
    });
    fogHost.dataset.fogStatus = "active";
    fogHost.closest(".portfolio-cover")?.classList.add("vanta-ready");
  } catch (error) {
    fogHost.dataset.fogStatus = "fallback";
    console.warn("Vanta Fog 初始化失败，已使用静态背景。", error);
    destroyFog();
  }
}

initFog();
if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", () => {
    if (reducedMotionQuery.matches) destroyFog();
    else initFog();
  });
}
window.addEventListener("pagehide", destroyFog, { once: true });

if (canUsePointerMotion) {
  document.querySelectorAll(".hero, .directory-stage").forEach((area) => {
    area.addEventListener("pointermove", (event) => {
      const rect = area.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      area.classList.add("motion-active");
      area.style.setProperty("--mx", `${(x * 26).toFixed(2)}px`);
      area.style.setProperty("--my", `${(y * 22).toFixed(2)}px`);
      area.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      area.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
    });
    area.addEventListener("pointerleave", () => {
      area.classList.remove("motion-active");
      area.style.setProperty("--mx", "0px");
      area.style.setProperty("--my", "0px");
      area.style.setProperty("--rx", "0deg");
      area.style.setProperty("--ry", "0deg");
    });
  });
}

function updateProgress() {
  const max = root.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  document.querySelector(".reading-progress")?.style.setProperty("--progress", `${value}%`);
}

const aboutDirectoryScene = document.querySelector("[data-about-directory-scene]");
const caseIndex = document.querySelector("#case-index");
let aboutDirectoryFrame = 0;

function updateAboutDirectoryScene() {
  aboutDirectoryFrame = 0;
  if (!aboutDirectoryScene || !caseIndex || reducedMotionQuery.matches) {
    aboutDirectoryScene?.style.setProperty("--directory-cover-progress", "0");
    return;
  }
  const viewport = window.innerHeight || root.clientHeight;
  const stickyTop = 72;
  const rect = caseIndex.getBoundingClientRect();
  const travel = Math.max(1, viewport - stickyTop);
  const progress = clampProgress((viewport * 0.62 - rect.top) / travel);
  aboutDirectoryScene.style.setProperty("--directory-cover-progress", progress.toFixed(3));
}

function requestAboutDirectoryUpdate() {
  if (aboutDirectoryFrame) return;
  aboutDirectoryFrame = requestAnimationFrame(updateAboutDirectoryScene);
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("scroll", updateScrollStories, { passive: true });
window.addEventListener("scroll", requestAboutDirectoryUpdate, { passive: true });
window.addEventListener("resize", updateScrollStories);
window.addEventListener("resize", requestAboutDirectoryUpdate);

updateLevelDemo();
updateProgress();
updateScrollStories();
updateAboutDirectoryScene();

function initYouyaMascot() {
  const mascot = document.querySelector("[data-youya-mascot]");
  const trigger = mascot?.querySelector("[data-mascot-trigger]");
  const bubble = mascot?.querySelector("[data-mascot-bubble]");
  if (!mascot || !trigger || !bubble) return;

  const phrases = ["嗨，欢迎查看我的项目！", "一起看看游鸭的设计吧！", "你发现了游鸭彩蛋！"];
  let frame = 0;
  let leaveTimer = 0;
  let celebrateTimer = 0;
  let phraseIndex = 0;

  const setNear = (near) => {
    mascot.classList.toggle("is-near", near);
    trigger.setAttribute("aria-expanded", String(near));
  };

  const resetGaze = () => {
    mascot.style.setProperty("--gaze-x", "0px");
    mascot.style.setProperty("--gaze-y", "0px");
    mascot.style.setProperty("--tilt-x", "0deg");
    mascot.style.setProperty("--tilt-y", "0deg");
  };

  const handlePointer = (event) => {
    if (event.pointerType === "touch" || reducedMotionQuery.matches) return;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = mascot.getBoundingClientRect();
      const cx = rect.left + rect.width * .58;
      const cy = rect.top + rect.height * .42;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx,dy);
      const near = distance < 210;
      if (near) {
        clearTimeout(leaveTimer);
        setNear(true);
      } else if (!mascot.classList.contains("is-celebrating")) {
        clearTimeout(leaveTimer);
        leaveTimer = window.setTimeout(() => { setNear(false); resetGaze(); },1800);
      }
      mascot.style.setProperty("--tilt-x", `${Math.max(-3,Math.min(3,-dy / 85)).toFixed(2)}deg`);
      mascot.style.setProperty("--tilt-y", `${Math.max(-5,Math.min(5,dx / 65)).toFixed(2)}deg`);
    });
  };

  trigger.addEventListener("click", () => {
    clearTimeout(celebrateTimer);
    setNear(true);
    phraseIndex = (phraseIndex + 1) % phrases.length;
    bubble.textContent = phrases[phraseIndex];
    mascot.classList.remove("is-celebrating");
    void mascot.offsetWidth;
    mascot.classList.add("is-celebrating");
    celebrateTimer = window.setTimeout(() => mascot.classList.remove("is-celebrating"),2600);
  });

  document.addEventListener("pointermove",handlePointer,{ passive:true });
  window.addEventListener("pagehide",() => {
    document.removeEventListener("pointermove",handlePointer);
    clearTimeout(leaveTimer);
    clearTimeout(celebrateTimer);
    if (frame) cancelAnimationFrame(frame);
  },{ once:true });
}

initYouyaMascot();

function initPosterPromoRails() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".poster-promo-rail").forEach((rail) => {
    if (rail.dataset.posterRailReady) return;
    rail.dataset.posterRailReady = "true";
    const track = document.createElement("div");
    track.className = "poster-promo-track";
    track.innerHTML = rail.innerHTML;
    const isLongPoster = rail.closest(".poster-promo-long");
    if (!isLongPoster) {
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = "true";
    }
    rail.replaceChildren(track);
    const pause = () => { track.classList.add("is-paused"); rail.dataset.posterRailAuto = "paused"; };
    const resume = () => { track.classList.remove("is-paused"); rail.dataset.posterRailAuto = "running"; };
    rail.addEventListener("pointerenter", pause);
    rail.addEventListener("pointerleave", resume);
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", resume);
    rail.addEventListener("touchstart", pause, { passive:true });
    rail.addEventListener("wheel", pause, { passive:true });
    resume();
  });
}

initPosterPromoRails();
window.setTimeout(initPosterPromoRails, 500);
