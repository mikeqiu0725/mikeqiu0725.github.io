# QIU YIRONG Portfolio

Static personal portfolio for GitHub Pages.

## Local Preview

Run from the project root:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Updating Content

Edit project titles, descriptions, image paths, avatar, and blog posts in `data.js`.

Put future image files in `assets/images/`, then reference them from `coverImage` and `images`.

Example image path:

```js
coverImage: "assets/images/between-light-cover.jpg"
```

Example avatar path:

```js
avatarImage: "assets/images/qiu-yirong-portrait.jpg"
```

To add a blog post, copy one object in the `blog` array:

```js
{
  title: "Studio Note",
  slug: "studio-note",
  date: "2026",
  summary: "One short line for the Blog page.",
  content: [
    "First paragraph.",
    "Second paragraph."
  ]
}
```

The homepage intentionally shows only project names. Years, mediums, and descriptions appear on project pages only.
