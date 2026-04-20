# RealReady screenshots

Drop **mobile portrait** PNGs into this folder using the exact filenames below.
Capture from a physical device or a simulator at roughly iPhone 15 width
(390px × 844px). The CSS phone frame will crop the very top edge, so a
status-bar artifact is fine.

| Filename | What it should show | Where it appears |
|---|---|---|
| `hero-home.png` | Main app home / dashboard screen with the overall progress ring, category cards below. Ideally includes a greeting like "Continue Studying — TX Real Estate". | Hero, right side |
| `step-state.png` | State picker screen (onboarding or settings → "Choose your state"). | "How it works" step 1 |
| `step-practice.png` | A Quick 10 or category question mid-session — a readable question with its answer choices. | "How it works" step 2 |
| `step-progress.png` | A progress view — category detail with accuracy %, or the main dashboard showing filled-in rings. | "How it works" step 3 |

Save all four as PNG. Don't worry about exact dimensions — the CSS scales them
to fit. Until they're added, the phone frames render a CSS placeholder so the
page still looks intentional.

When you drop the files in, tell Claude and the CSS will be wired up to use
them (a one-line change per image, pointing
`.rr-phone__screen--hero` / `--step-state` / `--step-practice` / `--step-progress`
at the right `url()`).
