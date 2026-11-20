# Ravi Goud — Full Stack & AI Portfolio

A React 19 + Vite portfolio built around a real, procedural React Three Fiber developer workspace. GSAP ScrollTrigger carries the scene through a layered processor, an orbiting technology universe, and a floating communication object. Tailwind CSS and a custom charcoal/mint design system support the responsive interface.

The header includes a keyboard-accessible Sun/Moon toggle and a Hire Me link to Contact. Both the interface and studio lighting support charcoal/mint and off-white/emerald palettes. The system preference applies on first visit; explicit choices persist in `localStorage` and sync across tabs. A small pre-paint script avoids a flash of the wrong theme. Storage restrictions do not disable the toggle.

## Run locally

Use Node.js 22.12+ (Node 24 was used for verification).

```bash
npm ci
npm run dev
```

```bash
npm test
npm run test:browser
npm run build
npm run preview
```

Production output is `dist/`. No API keys are required. GSAP, ScrollTrigger, SplitText, and Tailwind’s Vite integration are installed and locked. The browser suite uses a separate headless instance of the installed Google Chrome; it does not reuse your personal browser profile.

## The 3D story

- **Home:** a modeled desk, monitor, instanced keyboard keys, side displays, and illuminated hardware. Cursor movement changes the workspace rotation; native scrolling changes the camera and scene. Ravi’s name enters letter by letter and the role types through relevant specialties.
- **About:** desktop scrolling pins the story briefly around a modeled processor with orbiting connections. Responsive SplitText lines reveal from blur to clarity. Pinning is disabled on smaller screens and under reduced motion.
- **Skills:** a section-contained renderer keeps the scene aligned beside the text on desktop and below it on mobile. Real textured 3D technology objects orbit in space. Pointer hover enlarges an object and reveals its label; clicking selects its category. Native category buttons provide the same content for keyboard and touch users. Learning technologies are explicitly separated.
- **Projects:** each current resume project has its own WebGL illustration: prescription/medicine, database/query layers, or renewable-energy equipment. Cards respond to pointer tilt and scroll depth. Existing detailed case studies and local examples remain available.
- **Contact:** a modeled envelope accompanies word-by-word headline reveals. Only Email, GitHub, LinkedIn, and Download Resume remain, as requested.

The footer has no motion controls. System reduced-motion preferences remain supported: text remains readable, pinning and typing stop, the WebGL renderer runs on demand, and scrolling still selects the appropriate static scene.

Rendering uses local studio reflections, a shared theme-aware light rig, and a capped pixel budget with automatic quality reduction. Project platforms receive shadows from a small shadow map. Skills have permanently readable labels projected from the actual meshes; their native category controls remain accessible without WebGL. All scenes stop rendering when offscreen or when the document is hidden.

## Content and verified assets

- Edit identity, availability, social links, skill groups, and projects in `src/data/portfolio.js`.
- The resume is `public/resume/Ravi-Goud.pdf`, copied without changes from the locally available `Downloads/Greenko Resume.pdf`. Its content matches the three projects, 8.20 GPA, training, and education in the supplied brief. The specifically named `Greenko Resume(2).pdf` was not present. Replace the public PDF if a newer revision is intended.
- Intermediate: Narayana Junior College, Hyderabad, 2020–2022, 91.2%. SSC: Sri Vignana Vardhani High School, Hyderabad, 2019–2020, GPA 10/10. Both came from the inspected PDF.
- MediGuide and AI-SQL-Assistant GitHub URLs match local Git remotes. Their README files and relevant backend code were checked. Remote reachability and deployed application behavior have not been confirmed.
- The energy agent uses the supplied brief/resume; its repository has not been located. Its repository link remains `null`, so no broken button appears. The resume describes **six** bundled retrieval examples.
- No six reference screenshots were available. Project visuals are purpose-built workflow illustrations, clearly identified in case studies. They are not presented as application screenshots.
- All project `demo` values remain `null` until live URLs are verified. The MediGuide README mentions a deployment, but that alone does not establish current functionality.
- The dedicated MediGuide prescription workspace is a placeholder in the inspected source; extraction exists in medicine lookup. The case study makes this distinction.

## Project navigation and demonstrations

Case studies use bookmarkable hash destinations: `/#project/mediguide`, `/#project/text-to-sql`, and `/#project/energy-agent`. They open native modal dialogs, support Escape, and restore focus on close. Hash routing requires no server rewrite and survives refresh on static hosting.

The Text-to-SQL demo accepts three fixed example questions from `src/data/demos.js`. It shows SELECT statements and results from local synthetic assets, schema inspection, errors, loading feedback, and session history. It does not contact Gemini or execute SQL. The energy preview illustrates three fixed ticket-routing outcomes; it does not run the Python application.

## Contact behavior

Every email action opens Gmail Compose in a new tab with the existing recipient prefilled; project discussions also prefill the subject. Gmail may request sign-in. No message is sent automatically. GitHub and LinkedIn open the supplied profiles with secure external-link attributes. Download Resume serves the actual local PDF from Contact; it has been removed from Home. The previous contact form and copy-email control have been removed in accordance with the revised brief. No email delivery service or credentials are needed.

## Deploy to Vercel

This project is prepared for Vercel; no deployment was performed.

1. Push this directory to your Git repository and import it in Vercel.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`. The root is the portfolio directory.
3. Use Node 24 or another supported Node version compatible with Vite.
4. Once the real production origin is known, set `VITE_SITE_URL` to its HTTPS origin and redeploy. This adds the canonical URL, absolute Open Graph/Twitter image URLs, `og:url`, sitemap, and the sitemap declaration in robots.txt. Without it the build intentionally omits a fabricated canonical and sitemap.
5. For a custom domain, add it under Vercel Project Settings → Domains and follow Vercel’s displayed DNS records. Update `VITE_SITE_URL` to the preferred origin and redirect aliases through Vercel.
6. Open production, verify `/resume/Ravi-Goud.pdf` downloads, refresh each hash case study, test both social profiles and the email handoff, and check the browser console.

`vercel.json` sets the build/output configuration, immutable hashed-asset caching, and basic response headers. Because routes are hashes, SPA fallback rewrites are unnecessary.

Optional CLI workflow, after installing/signing into the official Vercel CLI:

```bash
vercel
vercel --prod
```

The social preview is a tracked 1200×630 PNG. `scripts/social-image.mjs` can regenerate it if the optional `@napi-rs/canvas` package is installed. That package is not required for the website build.

## Architecture and performance

```text
src/components/          shared links, boundaries, icons, workflow visuals
src/components/3d/       shared WebGL world and project models
src/data/                identity, project content, scroll mapping, local examples
src/hooks/               GSAP story lifecycle, preferences, scroll position
src/pages/               lazy-loaded project dialog and demos
src/sections/            about, skills, projects, journey, contact
src/styles/              retained case-study and demonstration styles
tests/                   Node tests, render checks, isolated Playwright suite
public/                  actual resume, favicon, social image, robots
```

The shared 3D module is lazy loaded. One persistent renderer anchors Home, About, and Contact objects to their actual section layout. The Skills renderer and project renderers load near the viewport and stop rendering when offscreen. Hidden-document rendering stops. The world starts at DPR 1.35 on desktop and 1 on mobile, with adaptive reduction; project DPR is capped at 1.25. Keyboard keys use instancing. Textures are drawn locally and disposed when released. GSAP contexts, media queries, font splits, observers, frame loops, and event listeners have explicit cleanup.

Unsupported WebGL, data saving, very low memory, or context loss provide a static workspace illustration and flat project visuals. These are capability fallbacks; supported devices render actual Three.js geometry. Reduced-motion devices retain the static WebGL scene and update it only as needed. No 3D model or environment-map downloads, postprocessing passes, or private API keys are used. Small studio reflection maps are generated locally once per renderer and disposed on unmount.

Vite reports a large optional Three/R3F chunk (approximately 945 kB minified, 252 kB gzip). It is dynamically imported. No Lighthouse score is claimed. DM Sans and Space Grotesk are bundled as local Latin WOFF2 variable fonts; there are no runtime Google Fonts requests. Font license notices are in `public/licenses/`.

## Verification

See [VERIFICATION.md](VERIFICATION.md) for executed checks and remaining production checks. The isolated Playwright suite verifies real browser rendering, scrolling, pinning, scene selection, navigation, modal interactions, sample workflows, resume download, reduced motion, responsive overflow, and unavailable-WebGL fallback. Screenshots are saved to `tmp/qa/` and failure traces to `tmp/playwright-results/`.
