# QIU YIRONG Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable static GitHub Pages portfolio for QIU YIRONG with a minimal homepage, hover-only large image preview, and simple project/About/Contact views.

**Architecture:** Use a static site with `index.html`, `styles.css`, `data.js`, and `script.js`. `data.js` owns editable portfolio content; `script.js` renders views and handles navigation/hover behavior; CSS owns the gallery-like visual system. Tests use Node's built-in `node:test` plus filesystem assertions so the project has no package install step.

**Tech Stack:** Plain HTML, CSS, JavaScript, Node built-in test runner, Python `http.server` for local preview.

---

## File Structure

- Create `index.html`: root GitHub Pages entrypoint and static DOM shell.
- Create `styles.css`: Helvetica-first white layout, responsive behavior, deep-red accent, hover preview styling.
- Create `data.js`: editable project data and profile/contact content.
- Create `script.js`: browser rendering, hash routing, project hover/focus preview handling.
- Create `tests/site.test.mjs`: static behavior and content contract tests.
- Create `assets/images/.gitkeep`: image folder placeholder so future project images have a clear location.

## Task 1: Content Data And HTML Shell

**Files:**
- Create: `index.html`
- Create: `data.js`
- Create: `tests/site.test.mjs`
- Create: `assets/images/.gitkeep`

- [ ] **Step 1: Write the failing tests**

Create `tests/site.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("index.html provides the static app shell", async () => {
  const html = await read("index.html");

  assert.match(html, /<title>QIU YIRONG<\/title>/);
  assert.match(html, /<link rel="stylesheet" href="styles.css">/);
  assert.match(html, /<body>/);
  assert.match(html, /<main id="app"/);
  assert.match(html, /<script src="data.js"><\/script>/);
  assert.match(html, /<script src="script.js"><\/script>/);
});

test("data.js exposes editable portfolio content", async () => {
  const data = await read("data.js");

  assert.match(data, /window\.PORTFOLIO_DATA =/);
  assert.match(data, /name: "QIU YIRONG"/);
  assert.match(data, /accent: "#B3261E"/);
  assert.match(data, /title: "Between Light"/);
  assert.match(data, /title: "South Notes"/);
  assert.match(data, /coverImage:/);
  assert.match(data, /images:/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

Expected: FAIL because `index.html` and `data.js` do not exist yet.

- [ ] **Step 3: Create minimal implementation**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="QIU YIRONG portfolio">
    <title>QIU YIRONG</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main id="app" aria-live="polite"></main>
    <script src="data.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

Create `data.js`:

```js
window.PORTFOLIO_DATA = {
  name: "QIU YIRONG",
  accent: "#B3261E",
  bio: [
    "Qiu Yirong is a photographer, film creator, and image maker.",
    "Her work is grounded in quiet observation, human presence, and ordinary light."
  ],
  contact: {
    email: "email@example.com",
    links: [
      { label: "Instagram", url: "#" },
      { label: "Vimeo / YouTube", url: "#" }
    ]
  },
  projects: [
    {
      title: "Between Light",
      slug: "between-light",
      year: "2026",
      medium: "Film photographs",
      description: "Quiet observations of light, distance, and everyday gestures.",
      coverImage: "",
      images: ["", ""]
    },
    {
      title: "Ordinary Days",
      slug: "ordinary-days",
      year: "2025",
      medium: "Still image series",
      description: "Domestic scenes and small intervals of attention.",
      coverImage: "",
      images: ["", ""]
    },
    {
      title: "River, Window",
      slug: "river-window",
      year: "2024",
      medium: "Photography",
      description: "Light, distance, and the edge of interior space.",
      coverImage: "",
      images: ["", ""]
    },
    {
      title: "Quiet Room",
      slug: "quiet-room",
      year: "2023",
      medium: "Film stills",
      description: "Interior observation and suspended time.",
      coverImage: "",
      images: ["", ""]
    },
    {
      title: "South Notes",
      slug: "south-notes",
      year: "2023",
      medium: "Photography",
      description: "Notes from travel, weather, and passing rooms.",
      coverImage: "",
      images: ["", ""]
    }
  ]
};
```

Create empty placeholder file `assets/images/.gitkeep`.

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

Expected: PASS for both tests.

- [ ] **Step 5: Commit**

```bash
git add index.html data.js tests/site.test.mjs assets/images/.gitkeep
git commit -m "Add portfolio site shell and data"
```

## Task 2: Homepage Rendering And Hover Preview

**Files:**
- Modify: `tests/site.test.mjs`
- Create: `script.js`
- Create: `styles.css`

- [ ] **Step 1: Add failing tests**

Append these tests to `tests/site.test.mjs`:

```js
test("script.js renders homepage project names and hover preview hooks", async () => {
  const script = await read("script.js");

  assert.match(script, /function renderHome/);
  assert.match(script, /project-list/);
  assert.match(script, /project-link/);
  assert.match(script, /preview-panel/);
  assert.match(script, /data-project-index/);
  assert.match(script, /mouseenter/);
  assert.match(script, /mouseleave/);
  assert.doesNotMatch(script, /year\\}/);
  assert.doesNotMatch(script, /medium\\}/);
});

test("styles.css keeps homepage minimal with hover-only preview", async () => {
  const css = await read("styles.css");

  assert.match(css, /font-family: Helvetica, Arial, sans-serif/);
  assert.match(css, /--accent: #B3261E/);
  assert.match(css, /\\.preview-panel/);
  assert.match(css, /opacity: 0/);
  assert.match(css, /\\.preview-panel\\.is-visible/);
  assert.match(css, /@media \\(max-width: 760px\\)/);
  assert.doesNotMatch(css, /text-decoration: underline/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

Expected: FAIL because `script.js` and `styles.css` do not exist yet.

- [ ] **Step 3: Implement homepage rendering and styles**

Create `script.js`:

```js
const data = window.PORTFOLIO_DATA;
const app = document.querySelector("#app");

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
  if (src) {
    return `<img src="${src}" alt="${alt}">`;
  }
  return `<div class="${className}" style="background:${placeholderStyle(index)}" role="img" aria-label="${alt} placeholder"></div>`;
};

const header = (active) => `
  <header class="site-header">
    <a class="site-name" href="#home">${data.name}</a>
    <nav class="site-nav" aria-label="Primary">
      <a class="${active === "projects" ? "active" : ""}" href="#home">Projects</a>
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
    <div class="preview-caption">
      <span>${project.title}</span>
      <span>hover preview</span>
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
          <a class="project-link" href="#project/${project.slug}" data-project-index="${index}">
            ${project.title}
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

function renderProject(slug) {
  const project = data.projects.find((item) => item.slug === slug) || data.projects[0];
  app.innerHTML = `${header("projects")}<section class="project-page"><h1>${project.title}</h1></section>`;
}

function renderAbout() {
  app.innerHTML = `${header("about")}<section class="text-page"><h1>About</h1></section>`;
}

function renderContact() {
  app.innerHTML = `${header("contact")}<section class="text-page"><h1>Contact</h1></section>`;
}

function route() {
  const hash = window.location.hash || "#home";
  if (hash.startsWith("#project/")) return renderProject(hash.replace("#project/", ""));
  if (hash === "#about") return renderAbout();
  if (hash === "#contact") return renderContact();
  return renderHome();
}

window.addEventListener("hashchange", route);
route();
```

Create `styles.css`:

```css
:root {
  --accent: #B3261E;
  --text: #111;
  --muted: #777;
  --line: #ececec;
  --page-padding-x: clamp(22px, 4vw, 52px);
  --page-padding-y: clamp(24px, 4vw, 42px);
}

* {
  box-sizing: border-box;
}

html {
  background: #fff;
  color: var(--text);
  font-family: Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #fff;
  color: var(--text);
  font-family: Helvetica, Arial, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 34px;
  padding: var(--page-padding-y) var(--page-padding-x) 0;
  font-size: 14px;
  line-height: 1.35;
}

.site-name {
  color: var(--accent);
  font-weight: 700;
}

.site-nav {
  display: flex;
  gap: 22px;
  font-size: 14px;
  line-height: 1.35;
}

.site-nav a {
  font-size: inherit;
  font-weight: 400;
}

.site-nav a.active {
  color: var(--accent);
}

.home-layout {
  display: grid;
  grid-template-columns: minmax(230px, 360px) 1fr;
  gap: clamp(70px, 10vw, 150px);
  align-items: start;
  padding: 128px var(--page-padding-x) 80px;
}

.project-list {
  display: grid;
  gap: 18px;
  font-size: 15px;
  line-height: 1.25;
}

.project-link {
  width: fit-content;
  color: #222;
  font-weight: 400;
  transition: color .22s ease, font-weight .22s ease, transform .22s ease;
}

.project-link:hover,
.project-link:focus-visible {
  color: var(--accent);
  font-weight: 700;
  transform: translateX(3px);
  outline: none;
}

.preview-panel {
  width: min(620px, 48vw);
  justify-self: end;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity .34s ease, transform .34s ease;
}

.preview-panel.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.preview-image img,
.image-placeholder {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.preview-caption {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 9px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.35;
}

@media (max-width: 760px) {
  .site-header {
    gap: 16px;
    font-size: 13px;
  }

  .site-nav {
    gap: 16px;
    font-size: 13px;
  }

  .home-layout {
    grid-template-columns: 1fr;
    padding-top: 88px;
  }

  .preview-panel {
    display: none;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add script.js styles.css tests/site.test.mjs
git commit -m "Add minimal hover homepage"
```

## Task 3: Project, About, Contact Views And Verification

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `script.js`
- Modify: `styles.css`
- Create: `README.md`

- [ ] **Step 1: Add failing tests**

Append these tests to `tests/site.test.mjs`:

```js
test("script.js renders project, about, and contact views", async () => {
  const script = await read("script.js");

  assert.match(script, /function renderProject/);
  assert.match(script, /project-page/);
  assert.match(script, /project-meta/);
  assert.match(script, /project-image-stack/);
  assert.match(script, /function renderAbout/);
  assert.match(script, /data\.bio/);
  assert.match(script, /function renderContact/);
  assert.match(script, /data\.contact\.email/);
});

test("README documents local preview and image maintenance", async () => {
  const readme = await read("README.md");

  assert.match(readme, /QIU YIRONG Portfolio/);
  assert.match(readme, /python3 -m http\.server 4173/);
  assert.match(readme, /assets\/images/);
  assert.match(readme, /data\.js/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

Expected: FAIL because detailed project/About/Contact rendering and `README.md` do not exist yet.

- [ ] **Step 3: Implement remaining views**

Replace the stub `renderProject`, `renderAbout`, and `renderContact` functions in `script.js` with:

```js
function renderProject(slug) {
  const project = data.projects.find((item) => item.slug === slug) || data.projects[0];
  app.innerHTML = `
    ${header("projects")}
    <article class="project-page">
      <a class="back-link" href="#home">Projects</a>
      <h1>${project.title}</h1>
      <div class="project-meta">
        <div>
          <span>${project.year}</span>
          <span>${project.medium}</span>
        </div>
        <p>${project.description}</p>
      </div>
      <div class="project-image-stack">
        ${project.images.map((src, index) => `
          <figure class="project-figure ${index % 2 === 0 ? "portrait" : "landscape"}">
            ${imageMarkup(src, `${project.title} image ${index + 1}`, index)}
          </figure>
        `).join("")}
      </div>
    </article>
  `;
}

function renderAbout() {
  app.innerHTML = `
    ${header("about")}
    <section class="text-page">
      <div class="text-label">About</div>
      <h1>Photographer / film creator / image maker</h1>
      <div class="text-copy">
        ${data.bio.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>
    </section>
  `;
}

function renderContact() {
  app.innerHTML = `
    ${header("contact")}
    <section class="text-page">
      <div class="text-label">Contact</div>
      <h1>Selected inquiries and collaborations</h1>
      <div class="contact-list">
        <a href="mailto:${data.contact.email}">${data.contact.email}</a>
        ${data.contact.links.map((link) => `<a href="${link.url}">${link.label}</a>`).join("")}
      </div>
    </section>
  `;
}
```

Append these styles to `styles.css`:

```css
.project-page,
.text-page {
  padding: 92px var(--page-padding-x) 100px;
}

.back-link {
  color: var(--muted);
  font-size: 12px;
}

.project-page h1,
.text-page h1 {
  max-width: 760px;
  margin: 34px 0 0;
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 400;
  line-height: 1.05;
}

.project-meta {
  display: grid;
  grid-template-columns: minmax(170px, 260px) minmax(300px, 620px);
  gap: 54px;
  margin-top: 42px;
  font-size: 14px;
  line-height: 1.65;
}

.project-meta div {
  display: grid;
  gap: 4px;
  color: var(--muted);
}

.project-meta p {
  margin: 0;
}

.project-image-stack {
  display: grid;
  gap: 48px;
  width: min(780px, 76vw);
  margin-top: 64px;
}

.project-figure {
  margin: 0;
}

.project-figure.portrait {
  width: min(620px, 100%);
}

.project-figure.landscape {
  width: min(760px, 100%);
  justify-self: end;
}

.project-figure.portrait .image-placeholder,
.project-figure.portrait img {
  aspect-ratio: 4 / 5;
}

.project-figure.landscape .image-placeholder,
.project-figure.landscape img {
  aspect-ratio: 3 / 2;
}

.text-page {
  display: grid;
  grid-template-columns: minmax(180px, 280px) minmax(300px, 620px);
  gap: 64px;
  align-items: start;
}

.text-label {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.4;
}

.text-page h1 {
  margin-top: 0;
  font-size: clamp(24px, 3vw, 34px);
}

.text-copy {
  grid-column: 2;
  max-width: 620px;
  font-size: 15px;
  line-height: 1.7;
}

.text-copy p {
  margin: 0 0 18px;
}

.contact-list {
  grid-column: 2;
  display: grid;
  gap: 10px;
  margin-top: 28px;
  font-size: 15px;
}

.contact-list a {
  width: fit-content;
}

@media (max-width: 760px) {
  .project-page,
  .text-page {
    padding-top: 72px;
  }

  .project-meta,
  .text-page {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .project-image-stack {
    width: 100%;
    gap: 30px;
  }

  .text-copy,
  .contact-list {
    grid-column: 1;
  }
}
```

Create `README.md`:

```markdown
# QIU YIRONG Portfolio

Static personal portfolio for GitHub Pages.

## Local Preview

Run from the project root:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Updating Content

Edit project titles, descriptions, and image paths in `data.js`.

Put future image files in `assets/images/`, then reference them from `coverImage` and `images`.

Example image path:

```js
coverImage: "assets/images/between-light-cover.jpg"
```

The homepage intentionally shows only project names. Years, mediums, and descriptions appear on project pages only.
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run local preview verification**

Run:

```bash
python3 -m http.server 4173
```

Expected: local server starts at `http://localhost:4173`.

Open with the in-app browser and verify:

- Homepage right side is blank before hover.
- Hovering a project shows a large right-side preview.
- Project titles are the only homepage list content.
- Header navigation has uniform size and no underlines.
- About and Contact render.
- Mobile viewport hides hover preview.

- [ ] **Step 6: Commit**

```bash
git add script.js styles.css tests/site.test.mjs README.md
git commit -m "Add portfolio pages and docs"
```

## Final Verification

- [ ] Run all tests:

```bash
/Users/qiuyirong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site.test.mjs
```

- [ ] Run local server:

```bash
python3 -m http.server 4173
```

- [ ] Verify desktop and mobile visual behavior in browser.

- [ ] Request code review before claiming completion.
