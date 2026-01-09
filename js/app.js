(() => {
  const downloadData = [
    {
      title_en: "Flag of Iran (official) SVG",
      title_fa: "پرچم ایران (رسمی) SVG",
      desc_en: "Vector, best for scaling",
      desc_fa: "وکتور، مناسب بزرگ و کوچک شدن",
      format: "svg",
      href: "/assets/flags/iran/Flag_of_Iran.svg"
    },
    {
      title_en: "Flag of Iran (official) JPG RGB",
      title_fa: "پرچم ایران (رسمی) JPG RGB",
      desc_en: "Digital usage",
      desc_fa: "مناسب استفاده دیجیتال",
      format: "jpg",
      href: "/assets/flags/iran/Flag_of_Iran_RGB.jpg"
    },
    {
      title_en: "Flag of Iran (official) JPG CMYK",
      title_fa: "پرچم ایران (رسمی) JPG CMYK",
      desc_en: "Print workflows",
      desc_fa: "مناسب گردش کار چاپ",
      format: "jpg",
      href: "/assets/flags/iran/Flag_of_Iran_CMYK.jpg"
    },
    {
      title_en: "Flag of Iran (simplified) SVG",
      title_fa: "پرچم ایران (ساده شده) SVG",
      desc_en: "Better for small sizes",
      desc_fa: "مناسب اندازه های کوچک",
      format: "svg",
      href: "/assets/flags/iran/Flag_of_Iran_simplified.svg"
    }
  ];

  const listEl = document.querySelector("[data-download-list]");
  const searchEl = document.querySelector("[data-search]");
  const filterEl = document.querySelector("[data-filter]");
  const themeBtn = document.querySelector("[data-theme-toggle]");

  const isFa = document.documentElement.lang === "fa";

  function render(items){
    if (!listEl) return;
    if (!items.length){
      listEl.innerHTML = `<p class="muted">${isFa ? "موردی پیدا نشد." : "No items found."}</p>`;
      return;
    }

    listEl.innerHTML = items.map(item => {
      const title = isFa ? item.title_fa : item.title_en;
      const desc = isFa ? item.desc_fa : item.desc_en;
      const labelDownload = isFa ? "دانلود" : "Download";
      const labelCopy = isFa ? "کپی لینک" : "Copy link";

      return `
        <div class="item">
          <div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(desc)} · ${item.format.toUpperCase()}</p>
          </div>
          <div class="actions">
            <a class="btn" href="${item.href}" download>${labelDownload}</a>
            <button class="btn" type="button" data-copy="${item.href}">${labelCopy}</button>
          </div>
        </div>
      `;
    }).join("");

    listEl.querySelectorAll("[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const path = btn.getAttribute("data-copy");
        const url = new URL(path, window.location.origin).toString();
        try{
          await navigator.clipboard.writeText(url);
          btn.textContent = isFa ? "کپی شد" : "Copied";
          setTimeout(() => { btn.textContent = isFa ? "کپی لینک" : "Copy link"; }, 1200);
        }catch{
          window.prompt(isFa ? "لینک را کپی کنید:" : "Copy the link:", url);
        }
      });
    });
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function applyFilters(){
    const q = (searchEl?.value || "").trim().toLowerCase();
    const f = filterEl?.value || "all";

    const items = downloadData.filter(item => {
      const hay = (item.title_en + " " + item.title_fa + " " + item.desc_en + " " + item.desc_fa).toLowerCase();
      const matchQ = !q || hay.includes(q);
      const matchF = f === "all" || item.format === f;
      return matchQ && matchF;
    });

    render(items);
  }

  function initTheme(){
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark"){
      document.documentElement.dataset.theme = saved;
    }
    if (document.documentElement.dataset.theme){
      document.documentElement.style.colorScheme = document.documentElement.dataset.theme;
    }
  }

  function toggleTheme(){
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("theme", next);
  }

  function themeCssOverride(){
    const style = document.createElement("style");
    style.textContent = `
      html[data-theme="light"]{
        --bg: #f6f7fb;
        --card: rgba(10,14,22,0.04);
        --card-strong: rgba(10,14,22,0.08);
        --text: rgba(10,14,22,0.92);
        --muted: rgba(10,14,22,0.64);
        --border: rgba(10,14,22,0.12);
        --shadow: 0 18px 60px rgba(10,14,22,0.10);
      }
      html[data-theme="dark"]{
        --bg: #0b0f17;
        --card: rgba(255,255,255,0.06);
        --card-strong: rgba(255,255,255,0.10);
        --text: rgba(255,255,255,0.92);
        --muted: rgba(255,255,255,0.68);
        --border: rgba(255,255,255,0.12);
        --shadow: 0 18px 60px rgba(0,0,0,0.45);
      }
    `;
    document.head.appendChild(style);
  }

  themeCssOverride();
  initTheme();
  render(downloadData);

  searchEl?.addEventListener("input", applyFilters);
  filterEl?.addEventListener("change", applyFilters);
  themeBtn?.addEventListener("click", toggleTheme);
})();
