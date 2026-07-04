const data = window.PORTFOLIO_DATA;
const app = document.querySelector("#app");

const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const escapeAttribute = escapeHTML;

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
    <a class="site-name" href="#home">${escapeHTML(data.name)}</a>
    <nav class="site-nav" aria-label="Primary">
      <a class="${active === "projects" ? "active" : ""}" href="#home">Projects</a>
      <a class="${active === "blog" ? "active" : ""}" href="#blog">Blog</a>
      <a class="${active === "about" ? "active" : ""}" href="#about">About</a>
      <a class="${active === "contact" ? "active" : ""}" href="#contact">Contact</a>
    </nav>
  </header>
`;

function setPreview(project, index) {
  const preview = document.querySelector(".preview-panel");
  if (!preview) return;
  preview.innerHTML = `
    <div class="preview-image">
      ${imageMarkup(project.coverImage, project.title, index)}
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
  app.innerHTML = `
    ${header("projects")}
    <section class="home-layout" aria-label="Projects">
      <div class="project-list">
        ${data.projects.map((project, index) => `
          <a class="project-link" href="#project/${escapeAttribute(project.slug)}" data-project-index="${index}">
            ${escapeHTML(project.title)}
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
      <a class="${activeView === "gallery" ? "active" : ""}" href="${projectViewLink(project, "gallery")}">Gallery</a>
      <span>/</span>
      <a class="${activeView === "index" ? "active" : ""}" href="${projectViewLink(project, "index")}">Index</a>
    </div>
  `;
}

function clampImageIndex(project, imageNumber) {
  const imageCount = project.images.length;
  if (!imageCount) return 0;
  const requested = Number.isInteger(imageNumber) ? imageNumber - 1 : 0;
  return Math.min(Math.max(requested, 0), imageCount - 1);
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
        ${imageMarkup(src, `${project.title} image ${activeIndex + 1}`, activeIndex)}
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
          ${imageMarkup(src, `${project.title} image ${index + 1}`, index, "index-placeholder")}
        </a>
      `).join("")}
    </div>
  `;
}

function renderProject(slug, view = "gallery", imageNumber = null) {
  const project = data.projects.find((item) => item.slug === slug) || data.projects[0];
  app.innerHTML = `
    <article class="project-page photo-book-page">
      <a class="project-back" href="#home">&lt; Back</a>
      <div class="project-info">
        <h1>${escapeHTML(project.title)}</h1>
        <div class="project-year">${escapeHTML(project.year)}</div>
        <div class="project-description">${escapeHTML(project.description)}</div>
        ${projectViewSwitch(project, view)}
      </div>
      ${view === "index" ? renderProjectIndex(project) : renderProjectGallery(project, imageNumber)}
    </article>
  `;
  applyProjectImageOrientation();
}

function renderAbout() {
  app.innerHTML = `
    ${header("about")}
    <section class="text-page about-page">
      <div class="about-avatar">
        ${imageMarkup(data.avatarImage, `${data.name} portrait`, 0, "avatar-placeholder")}
      </div>
      <div>
        <div class="text-label">About</div>
        <h1>Photographer / film creator / image maker</h1>
        <div class="text-copy">
          ${data.bio.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderBlog() {
  app.innerHTML = `
    ${header("blog")}
    <section class="text-page blog-page">
      <div class="text-label">Blog</div>
      <div class="blog-list">
        ${data.blog.map((post) => `
          <article class="blog-item">
            <div class="blog-date">${escapeHTML(post.date)}</div>
            <h1><a href="#blog/${escapeAttribute(blogPostSlug(post))}">${escapeHTML(post.title)}</a></h1>
            <p>${escapeHTML(post.summary)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderBlogPost(slug) {
  const post = data.blog.find((item) => blogPostSlug(item) === slug) || data.blog[0];
  app.innerHTML = `
    ${header("blog")}
    <article class="text-page blog-post-page">
      <a class="text-label" href="#blog">&lt; Blog</a>
      <div class="blog-post">
        <div class="blog-date">${escapeHTML(post.date)}</div>
        <h1>${escapeHTML(post.title)}</h1>
        <p class="blog-summary">${escapeHTML(post.summary)}</p>
        <div class="blog-content">
          ${(post.content || []).map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function contactLink(link) {
  if (!link.url || link.url === "#") {
    return `<span class="contact-placeholder">${escapeHTML(link.label)}</span>`;
  }
  return `<a href="${escapeAttribute(link.url)}">${escapeHTML(link.label)}</a>`;
}

function renderContact() {
  app.innerHTML = `
    ${header("contact")}
    <section class="text-page">
      <div class="text-label">Contact</div>
      <h1>Selected inquiries and collaborations</h1>
      <div class="contact-list">
        <a href="mailto:${escapeAttribute(data.contact.email)}">${escapeHTML(data.contact.email)}</a>
        ${data.contact.links.map(contactLink).join("")}
      </div>
    </section>
  `;
}

function route() {
  const hash = window.location.hash || "#home";
  if (hash.startsWith("#project/")) return renderProject(projectSlugFromHash(hash), projectViewFromHash(hash), projectImageFromHash(hash));
  if (hash === "#about") return renderAbout();
  if (hash.startsWith("#blog/")) return renderBlogPost(blogSlugFromHash(hash));
  if (hash === "#blog") return renderBlog();
  if (hash === "#contact") return renderContact();
  return renderHome();
}

window.addEventListener("hashchange", route);
route();
