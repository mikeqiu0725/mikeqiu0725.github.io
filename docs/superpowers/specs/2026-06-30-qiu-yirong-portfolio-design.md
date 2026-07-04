# QIU YIRONG Portfolio Design

Date: 2026-06-30

## Goal

Build a first runnable version of a personal portfolio website for Qiu Yirong, a photographer, film creator, and image maker. The site should feel white, restrained, gallery-like, human, and minimal. It should not feel like a template website.

The site will be deployed on GitHub Pages and should stay easy to maintain when new images are added later.

## Visual Direction

- Use a white background and Helvetica-first typography.
- Keep the interface quiet and minimal, with no decorative gradients, cards, or oversized marketing sections.
- Use `QIU YIRONG` as the highlighted name.
- Use deep red `#B3261E` as the only accent color for the name and hover states.
- Remove underlines from the header and navigation.
- Keep `Projects`, `About`, and `Contact` the same size and weight.
- Prioritize the feeling of a gallery or museum presentation: small, precise text contrasted with large photographic images.

## Homepage

The homepage opens cleanly:

- Header left: `QIU YIRONG` in deep red.
- Header right: `Projects`, `About`, `Contact` in matching Helvetica size.
- Main content: a simple list of project names only.
- No year, category, medium, or project description on the homepage.
- Right side starts as pure white empty space.
- On desktop hover over a project:
  - The project name turns deep red and becomes bold.
  - The project name may shift very slightly to indicate focus.
  - A large representative image appears on the right with a soft fade-in.
- On mobile, where hover is not available, project names open project pages directly.

## Project Pages

Each project page should stay quiet and image-led:

- Same header as homepage.
- Project title and minimal metadata near the top.
- A short project statement can be included, but text should stay secondary to images.
- Images appear in a spacious vertical sequence with generous white space.
- Image layout should support mixed orientations.

## About

The About page should be restrained and text-focused:

- Header stays consistent.
- Small heading or label.
- Short bio describing Qiu Yirong as a photographer, film creator, and image maker.
- Copy is temporary in the first version and should be easy to edit later.

## Contact

The Contact section/page should be minimal:

- Email placeholder for now.
- Optional social/video links can be edited later.
- No contact form in the first version.

## Architecture

Use a static site suitable for GitHub Pages.

Preferred first version:

- Plain `index.html`, `styles.css`, and `script.js`.
- `assets/images/` for project images.
- A small JavaScript data structure for project names, slugs, years, descriptions, and image paths.
- Static project pages can be generated later if the project grows; the first version can use separate simple HTML pages or a lightweight hash/query route.

The implementation should avoid a heavy framework unless later requirements need one.

## Content Model

Each project should have:

- `title`
- `slug`
- `coverImage`
- `images`
- optional `year`
- optional `medium`
- optional `description`

The homepage only renders `title` and uses `coverImage` for hover preview.

## Initial Placeholder Content

Use placeholder project titles until final works are provided:

- Between Light
- Ordinary Days
- River, Window
- Quiet Room
- South Notes

Use neutral local placeholder image blocks or simple placeholder assets in the first version. The file structure must make it clear where real images should be placed later.

## Responsive Behavior

- Desktop: two-column composition with project list on the left and hover preview on the right.
- Mobile: single-column project list; no hover preview.
- Header remains simple and readable on small screens.
- Text must not overlap or wrap awkwardly.

## Testing And Verification

Verify:

- The site loads locally.
- Homepage starts with no visible right-side image before hover.
- Hovering each desktop project changes text color and shows the matching image.
- Navigation links work.
- Project pages or project views render image-led layouts.
- Mobile layout removes hover dependency and remains readable.
- No console errors.

## Out Of Scope For First Version

- CMS integration.
- Contact form.
- Animation-heavy transitions.
- Online image upload UI.
- Complex filtering or project categories.
- Custom domain setup.
