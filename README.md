# ericpuigmarti.com

Personal portfolio site for Eric Puigmarti — Product Design Leader.

Live at [ericpuigmarti.com](https://www.ericpuigmarti.com), hosted on GitHub Pages (deployed automatically from `master`, custom domain via `CNAME`).

## Stack

Static HTML/CSS/JS — no build step, no framework. Built on a customized Bootstrap 3 theme, with jQuery for interactions (portfolio filtering, carousels, smooth scroll).

- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) for body copy, [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for headings — loaded together via a single Google Fonts link in each page's `<head>`.
- **Accent color:** neutral near-black (`#171717`), used for headings, links, `.highlight` labels, and the footer background.
- **Styles:** `css/style.css` (the main theme file) + `css/bootstrap.css`.
- **Scripts:** `js/main.js`, `js/plugins.js`, `js/bootstrap.js`.

## Structure

- `index.html` — homepage: hero, selected work grid, about/bio, skills, "From the Blog" (curated Substack picks), publications, contact.
- Case study pages (one per project): `maple.html`, `freshbooks.html`, `freshbooks-mileage-tracking.html`, `telus.html`, `inflow.html`, `league.html`, `shifthub.html`, `venio.html`.
- `images/` — project screenshots and grid thumbnails (`images/grid-projects/`) and case-study assets (`images/projects/`).
- `_archive/` — retired/unused page variants from earlier theme iterations, kept for reference only (not linked from the live site).

## Adding a new case study

1. Copy an existing case study page (e.g. `maple.html`) as a starting point.
2. Add a thumbnail to `images/grid-projects/` and wire it into the work grid in `index.html`.
3. Add the new page to the nav dropdown in `index.html` (and optionally other case study pages).

## Local preview

No build tooling required — open any `.html` file directly in a browser, or serve the folder with any static file server (e.g. `python3 -m http.server`).
