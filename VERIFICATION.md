# Verification — 20 November 2026

## Current refinement

- Added the accessible Sun/Moon theme toggle with system preference, persistent explicit choice, cross-tab synchronization, and a pre-paint initializer. Tested normal and blocked localStorage. Theme changes update the interface, dialogs, renderer exposure, materials, and studio lights.
- Added the responsive glass header, refined RG logo, and Hire Me link to Contact. Both Hire Me and the theme toggle remain available on small screens.
- Improved reflective lighting, rendering resolution within a 3.8-million-pixel viewport budget, project-platform shadows, and scroll-driven camera/object movement. Skill names are readable without hovering. The processor and envelope geometry were refined.
- Centered case-study dialogs and improved sample-button styling in both themes. No dependencies, project links, personal details, resume bytes, or achievements were added or changed.

- Home no longer includes Download Resume. Contact retains the real PDF download.
- Every email action opens Gmail Compose with Ravi's existing address; project discussions include a subject. No message is sent automatically.
- The fixed motion control is removed. System reduced-motion preferences still disable pinning, typing, and continuous animation.
- Home, About, and Contact WebGL objects follow their actual section layout. Skills has its own responsive renderer beside the copy on desktop and below it on mobile.
- About has a modeled processor and a shorter story. Project cards retain their existing details and routes, with pointer tilt, reflective materials, and scroll depth.
- Studio reflections are generated locally once per renderer. No dependencies or remote assets were added. Offscreen scenes and hidden-document rendering stop.

## Executed checks

- `npm run build`: passed. Vite reports a size advisory for the lazy Three/R3F module: approximately 939 kB minified / 250 kB gzip.
- `npm test`: **10 passed**. Section/navigation rendering, all case studies, project URLs, PDF integrity, local SQL examples and unsupported-input rejection, known/learning skills, social-image dimensions, metadata, and reversible scroll interpolation. The obsolete viewport-scene-weight test was removed with that implementation.
- `npm run test:browser`: **7 passed**, using isolated headless Google Chrome with no uncaught page errors. Desktop and mobile scenarios also assert no console errors. The final run completed normally in 1.9 minutes.
- **12 production URLs returned HTTP 200**, including HTML, the theme initializer, every JS/CSS/font bundle, resume, favicon, social preview, and robots.txt. Downloaded PDF bytes match the public source file.
- `npm run lint`: completed with warnings, including imperative Three.js state mutations flagged by React rules and existing render/effect advisories; it reported no errors.

### Browser coverage

1. Desktop WebGL rendering; pinned About and text reveals; Skills column alignment and selection; project tilt and reset; all case-study dialogs; focus, Escape, architecture selection, SQL and maintenance examples; four contact actions; PDF download; return to Home; absence of Home resume and motion controls.
2. Mobile navigation; reduced motion without pinning; no horizontal overflow across all sections at 320, 390, 768, and 1024 px; direct case-study URLs and refresh; Contact scene positioning.
3. Simulated unavailable WebGL; fallback visuals, navigation, and case-study opening/closing.
4. Direct `#skills` loading; hovering the actual Java mesh reveals its label; clicking selects Languages & tools; accessible category state matches; mobile resizing places the scene below the copy without overflow.
5. First-visit system preference; live system changes; Space-key theme activation; saved choice survives reload and overrides later system changes; canvas theme updates under reduced motion; Hire Me reaches Contact.
6. Both palettes across all six sections and the SQL case study. No horizontal overflow at 320, 390, 768, 844, 1024, 1920, and 3840 px, including landscape. Header controls remain separated and visible. Mobile Hire Me closes the navigation menu.
7. Blocked localStorage: first-visit system theme and manual toggle remain functional.

The Gmail check intercepts the external handoff, opens a new tab, and verifies the Google origin, compose mode, and recipient. It does not sign into Gmail or send a message. Case-study subject parameters are also checked.

Screenshots in `tmp/qa/` were inspected for desktop Home, About, Skills, Projects, Contact, and mobile Skills. Visual review caught and corrected gradient-text clipping. Browser checks found and corrected initial fragment navigation occurring before React mounted its sections. Artifacts are ignored by Git and the Vite watcher.

Current theme screenshots are in `tmp/qa/themes/`. Visual inspection covered dark/light Home, About, Skills, Projects, Contact, the case-study dialog, and mobile scenes. Verification caught a React unmount warning from nested skill-label roots; projected DOM labels replaced those roots, and the full browser suite then passed.

## Preserved sources

The resume remains byte-identical to the inspected local `Greenko Resume.pdf`: SHA-256 `6bcdac1640cece4492af0aee6802f3b656b953a0591881e68bb41bf8d5f8ee49`. The specifically named `Greenko Resume(2).pdf` and original reference screenshots were unavailable during the original audit.

MediGuide and Text-to-SQL URLs match inspected local Git remotes. Energy-agent content remains based on the brief and resume, with its six-example dataset limitation preserved. Unverified repository and live-demo links remain hidden. Project descriptions, case-study details, and demonstrations were retained.

## Limits

- No deployment was performed. Production-domain metadata requires `VITE_SITE_URL`.
- External GitHub/LinkedIn reachability and authenticated Gmail rendering were not tested; destination values and handoffs were checked locally.
- Physical mobile hardware, real GPU context loss, and low-memory/save-data devices were not tested. Reduced motion and unavailable WebGL were simulated.
- Browser automation used installed Google Chrome; Safari, Firefox, and physical iOS/Android devices were not available for verification.
- No Lighthouse or frame-rate claims are made. The rendering stack emits a nonblocking Three.js Clock deprecation warning.
