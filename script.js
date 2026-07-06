const data = window.PORTFOLIO_DATA;
const app = document.querySelector("#app");

const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const escapeAttribute = escapeHTML;
const languageStorageKey = "portfolioLanguage";

function currentLanguage() {
  try {
    return window.localStorage?.getItem(languageStorageKey) === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

function setStoredLanguage(language) {
  try {
    window.localStorage?.setItem(languageStorageKey, language);
  } catch {
    // Ignore storage failures; the current render still switches language.
  }
}

function zhData() {
  return data.translations?.zh || {};
}

function isChinese() {
  return currentLanguage() === "zh";
}

function siteName() {
  return isChinese() ? zhData().name || data.name : data.name;
}

function applyLanguageDocumentState() {
  const language = currentLanguage();
  if (document.documentElement) {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.classList?.toggle("lang-zh", language === "zh");
  }
}

function navText(key) {
  return isChinese() ? zhData().nav?.[key] || key : {
    projects: "Projects",
    blog: "Blog",
    about: "About",
    contact: "Contact"
  }[key];
}

function viewText(key) {
  return isChinese() ? zhData().views?.[key] || key : {
    gallery: "Gallery",
    index: "Index",
    back: "< Back"
  }[key];
}

function projectText(project, key) {
  if (!isChinese()) return project[key];
  return zhData().projects?.[project.slug]?.[key] || project[key];
}

function localizedProjectCaption(project, index) {
  if (!isChinese()) return project.captions?.[index];
  return zhData().projects?.[project.slug]?.captions?.[index] || project.captions?.[index];
}

function localizedPost(post, key) {
  if (!isChinese()) return post[key];
  return zhData().blog?.posts?.[blogPostSlug(post)]?.[key] || post[key];
}

function localizedPostContent(post) {
  if (!isChinese()) return post.content || [];
  return zhData().blog?.posts?.[blogPostSlug(post)]?.content || post.content || [];
}

function setPageTitle(section = "") {
  document.title = section ? `${siteName()} ｜ ${section}` : siteName();
}

const placeholderStyle = (index) => {
  const palettes = [
    ["#f8f6f2", "#cdc4b5", "#fcfcfb"],
    ["#fbfaf8", "#d7d0c6", "#f1eee8"],
    ["#f4f4f1", "#cfd5d1", "#fbfbfa"],
    ["#ffffff", "#dfd9ce", "#c9c1b5"],
    ["#f7f7f6", "#d8d3ca", "#ffffff"]
  ];
  const colors = palettes[index % palettes.length];
  return `linear-gradient(150deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
};

const imageMarkup = (src, alt, index, className = "image-placeholder") => {
  const safeAlt = escapeAttribute(alt);
  if (src) {
    return `<img src="${escapeAttribute(src)}" alt="${safeAlt}">`;
  }
  return `<div class="${className}" style="background:${placeholderStyle(index)}" role="img" aria-label="${safeAlt} placeholder"></div>`;
};

const header = (active) => `
  <header class="site-header">
    <a class="site-name" href="#home">${escapeHTML(siteName())}</a>
    <div class="site-actions">
      <nav class="site-nav" aria-label="Primary">
        <a class="${active === "projects" ? "active" : ""}" href="#home">${escapeHTML(navText("projects"))}</a>
        <a class="${active === "blog" ? "active" : ""}" href="#blog">${escapeHTML(navText("blog"))}</a>
        <a class="${active === "about" ? "active" : ""}" href="#about">${escapeHTML(navText("about"))}</a>
        <a class="${active === "contact" ? "active" : ""}" href="#contact">${escapeHTML(navText("contact"))}</a>
      </nav>
      <button class="language-toggle" type="button" data-language-toggle>${isChinese() ? "EN" : "中文"}</button>
    </div>
  </header>
`;

function setPreview(project, index) {
  const preview = document.querySelector(".preview-panel");
  if (!preview) return;
  preview.className = `preview-panel preview-${project.slug}`;
  preview.innerHTML = `
    <div class="preview-image">
      ${imageMarkup(project.coverImage, projectText(project, "title"), index)}
    </div>
  `;
  preview.classList.add("is-visible");
}

function clearPreview() {
  const preview = document.querySelector(".preview-panel");
  if (!preview) return;
  preview.classList.remove("is-visible");
}

function renderHome() {
  setPageTitle();
  app.innerHTML = `
    ${header("projects")}
    <section class="home-layout" aria-label="${escapeAttribute(navText("projects"))}">
      <div class="project-list">
        ${data.projects.map((project, index) => `
          <a class="project-link" href="#project/${escapeAttribute(project.slug)}" data-project-index="${index}">
            ${escapeHTML(projectText(project, "title"))}
          </a>
        `).join("")}
      </div>
      <aside class="preview-panel" aria-hidden="true"></aside>
    </section>
  `;

  document.querySelectorAll(".project-link").forEach((link) => {
    const index = Number(link.dataset.projectIndex);
    const project = data.projects[index];
    link.addEventListener("mouseenter", () => setPreview(project, index));
    link.addEventListener("focus", () => setPreview(project, index));
    link.addEventListener("mouseleave", clearPreview);
    link.addEventListener("blur", clearPreview);
  });
}

function projectViewFromHash(hash) {
  return hash.includes("?view=index") ? "index" : "gallery";
}

function projectImageFromHash(hash) {
  const match = hash.match(/[?&]image=(\d+)/);
  return match ? Number(match[1]) : null;
}

function projectSlugFromHash(hash) {
  return hash.replace("#project/", "").split("?")[0];
}

function blogSlugFromHash(hash) {
  return hash.replace("#blog/", "").split("?")[0];
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function blogPostSlug(post) {
  return post.slug || slugify(post.title);
}

function projectViewLink(project, view, imageNumber = null) {
  const params = [];
  if (view === "index") params.push("view=index");
  if (view === "gallery" && imageNumber) params.push(`view=gallery&image=${imageNumber}`);
  const suffix = params.length ? `?${params.join("&")}` : "";
  return `#project/${escapeAttribute(project.slug)}${suffix}`;
}

function projectViewSwitch(project, activeView) {
  return `
    <div class="project-view-switch" aria-label="Project view">
      <a class="${activeView === "gallery" ? "active" : ""}" href="${projectViewLink(project, "gallery")}">${escapeHTML(viewText("gallery"))}</a>
      <span>/</span>
      <a class="${activeView === "index" ? "active" : ""}" href="${projectViewLink(project, "index")}">${escapeHTML(viewText("index"))}</a>
    </div>
  `;
}

function clampImageIndex(project, imageNumber) {
  const imageCount = project.images.length;
  if (!imageCount) return 0;
  const requested = Number.isInteger(imageNumber) ? imageNumber - 1 : 0;
  return Math.min(Math.max(requested, 0), imageCount - 1);
}

function projectImageCaption(project, imageNumber) {
  const activeIndex = clampImageIndex(project, imageNumber);
  return localizedProjectCaption(project, activeIndex) || {
    title: `Image ${activeIndex + 1}`,
    description: projectText(project, "description")
  };
}

function renderProjectGallery(project, imageNumber = null) {
  const activeIndex = clampImageIndex(project, imageNumber);
  const imageCount = project.images.length;
  const previousImage = activeIndex === 0 ? imageCount : activeIndex;
  const nextImage = activeIndex === imageCount - 1 ? 1 : activeIndex + 2;
  const src = project.images[activeIndex] || "";

  return `
    <div class="project-gallery-single">
      <figure id="image-${activeIndex + 1}" class="project-image-stage">
        ${imageMarkup(src, `${projectText(project, "title")} image ${activeIndex + 1}`, activeIndex)}
      </figure>
      <a class="gallery-hit-area previous" href="${projectViewLink(project, "gallery", previousImage)}" aria-label="Previous image"></a>
      <a class="gallery-hit-area next" href="${projectViewLink(project, "gallery", nextImage)}" aria-label="Next image"></a>
    </div>
  `;
}

function applyProjectImageOrientation() {
  document.querySelectorAll(".project-image-stage img").forEach((img) => {
    const setOrientation = () => {
      const stage = img.closest(".project-image-stage");
      if (!stage || !img.naturalWidth || !img.naturalHeight) return;
      const isLandscape = img.naturalWidth >= img.naturalHeight;
      stage.classList.toggle("landscape", isLandscape);
      stage.classList.toggle("portrait", !isLandscape);
    };

    img.addEventListener("load", setOrientation, { once: true });
    if (img.decode) img.decode().then(setOrientation).catch(() => {});
    const schedule = window.requestAnimationFrame || ((callback) => callback());
    schedule(setOrientation);
  });
}

function renderProjectIndex(project) {
  return `
    <div class="project-index-grid">
      ${project.images.map((src, index) => `
        <a class="index-item" href="${projectViewLink(project, "gallery", index + 1)}">
          ${imageMarkup(src, `${projectText(project, "title")} image ${index + 1}`, index, "index-placeholder")}
        </a>
      `).join("")}
    </div>
  `;
}

function enableIndexZoom() {
  document.querySelectorAll(".index-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      item.classList.add("is-zooming");
      window.setTimeout(() => {
        window.location.hash = item.getAttribute("href");
      }, 220);
    });
  });
}

function enableGalleryZoomOut(project) {
  const page = document.querySelector(".project-page");
  const stage = document.querySelector(".project-image-stage");
  if (!page || !stage) return;

  page.addEventListener("click", (event) => {
    const blockedTarget = event.target.closest("a, .project-info, .project-image-stage, .project-gallery-single");
    if (blockedTarget) return;
    stage.classList.add("is-zooming-out");
    window.setTimeout(() => {
      window.location.hash = projectViewLink(project, "index");
    }, 220);
  });
}

function renderProject(slug, view = "gallery", imageNumber = null) {
  const project = data.projects.find((item) => item.slug === slug) || data.projects[0];
  const caption = view === "gallery" ? projectImageCaption(project, imageNumber) : null;
  setPageTitle(projectText(project, "title"));
  app.innerHTML = `
    <article class="project-page photo-book-page ${view === "gallery" ? "gallery-view" : "index-view"}">
      <a class="project-back" href="#home">${escapeHTML(viewText("back"))}</a>
      <div class="project-info">
        ${view === "index" ? `<h1>${escapeHTML(projectText(project, "title"))}</h1>` : ""}
        ${caption ? `
          <div class="project-image-title">${escapeHTML(caption.title)}</div>
          <div class="project-image-description">${escapeHTML(caption.description)}</div>
        ` : `<div class="project-description">${escapeHTML(projectText(project, "description"))}</div>`}
        ${projectViewSwitch(project, view)}
      </div>
      ${view === "index" ? renderProjectIndex(project) : renderProjectGallery(project, imageNumber)}
    </article>
  `;
  applyProjectImageOrientation();
  if (view === "index") enableIndexZoom();
  if (view === "gallery") enableGalleryZoomOut(project);
}

function renderAbout() {
  const aboutTitle = isChinese() ? zhData().about?.title || "关于" : "Film Photographer";
  const aboutBio = isChinese() ? zhData().about?.bio || data.bio : data.bio;
  setPageTitle(navText("about"));
  app.innerHTML = `
    ${header("about")}
    <section class="text-page about-page">
      <div class="about-avatar">
        ${imageMarkup(data.avatarImage, `${data.name} portrait`, 0, "avatar-placeholder")}
      </div>
      <div>
        <h1>${escapeHTML(aboutTitle)}</h1>
        <div class="text-copy">
          ${aboutBio.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderBlog() {
  setPageTitle(navText("blog"));
  app.innerHTML = `
    ${header("blog")}
    <section class="text-page blog-page">
      <div class="blog-list">
        ${data.blog.map((post) => `
          <article class="blog-item">
            <div class="blog-date">${escapeHTML(localizedPost(post, "date"))}</div>
            <h1><a href="#blog/${escapeAttribute(blogPostSlug(post))}">${escapeHTML(localizedPost(post, "title"))}</a></h1>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderBlogPost(slug) {
  const post = data.blog.find((item) => blogPostSlug(item) === slug) || data.blog[0];
  setPageTitle(localizedPost(post, "title"));
  app.innerHTML = `
    ${header("blog")}
    <article class="text-page blog-post-page">
      <a class="text-label" href="#blog">${escapeHTML(`${viewText("back").replace("返回", navText("blog")).replace("Back", navText("blog"))}`)}</a>
      <div class="blog-post">
        <div class="blog-date">${escapeHTML(localizedPost(post, "date"))}</div>
        <h1>${escapeHTML(localizedPost(post, "title"))}</h1>
        <p class="blog-summary">${escapeHTML(localizedPost(post, "summary"))}</p>
        <div class="blog-content">
          ${localizedPostContent(post).map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        </div>
      </div>
    </article>
  `;
}

const contactIcons = {
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h4v10H5zM7 5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM11 9h4v1.5c.6-1 1.7-1.7 3-1.7 2.2 0 3.5 1.5 3.5 4.3V19h-4v-5.3c0-1.1-.4-1.7-1.2-1.7-.8 0-1.3.6-1.3 1.7V19h-4z"/></svg>'
};

function contactIcon(type) {
  return `<span class="contact-icon">${contactIcons[type] || contactIcons.email}</span>`;
}

function contactLink(link) {
  if (!link.url || link.url === "#") {
    return `<span class="contact-row contact-placeholder">${contactIcon(link.type)}<span>${escapeHTML(link.label)}</span></span>`;
  }
  return `<a class="contact-row" href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">${contactIcon(link.type)}<span>${escapeHTML(link.label)}</span></a>`;
}

function renderContact() {
  const contactTitle = isChinese() ? zhData().contact?.title || "链接" : "Links";
  setPageTitle(navText("contact"));
  app.innerHTML = `
    ${header("contact")}
    <section class="text-page">
      <div></div>
      <h1>${escapeHTML(contactTitle)}</h1>
      <div class="contact-list">
        <a class="contact-row" href="mailto:${escapeAttribute(data.contact.email)}">${contactIcon("email")}<span>${escapeHTML(data.contact.email)}</span></a>
        ${data.contact.links.map(contactLink).join("")}
      </div>
    </section>
`;
}

function bindLanguageToggle() {
  const toggle = document.querySelector("[data-language-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    setStoredLanguage(isChinese() ? "en" : "zh");
    route();
  });
}

function route() {
  applyLanguageDocumentState();
  const hash = window.location.hash || "#home";
  if (hash.startsWith("#project/")) {
    renderProject(projectSlugFromHash(hash), projectViewFromHash(hash), projectImageFromHash(hash));
  } else if (hash === "#about") {
    renderAbout();
  } else if (hash.startsWith("#blog/")) {
    renderBlogPost(blogSlugFromHash(hash));
  } else if (hash === "#blog") {
    renderBlog();
  } else if (hash === "#contact") {
    renderContact();
  } else {
    renderHome();
  }
  bindLanguageToggle();
}

window.addEventListener("hashchange", route);
route();
