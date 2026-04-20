# RealReady screenshots

These four mobile portrait PNGs are live on the site:

| Filename | Shown in |
|---|---|
| `hero-home.png` | Hero section (right side on desktop, stacked below on mobile) |
| `step-state.png` | "How it works" — step 1 (Pick your state) |
| `step-practice.png` | "How it works" — step 2 (Practice, daily) |
| `step-article.png` | "How it works" — step 3 (Learn the concepts) |

To replace one, overwrite the PNG at the same filename and push. The CSS wires each image to its phone frame by class, so no HTML/CSS changes are needed as long as the filenames stay the same.

Images render inside a CSS-rendered phone frame. If any file 404s, the frame still renders a minimal navy top band as a fallback so the page doesn't look broken.
