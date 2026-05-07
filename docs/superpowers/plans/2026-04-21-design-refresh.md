# Design Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `web/` from a single 2231-line `styles.css` to a token-driven Sass module tree, apply the visual language from `new-design.html` (colors, typography, spacing, sizes), add a 2-column tool rail and a 32px options bar, and do it without changing any app behavior.

**Architecture:** Sass partials under `web/styles/`, compiled to `web/styles.css`. A hybrid token layer in `_tokens.scss` defines each token as both a Sass variable proxy (`$accent: var(--accent)`) and a CSS custom property (`:root { --accent: #3b82c4 }`). Components only touch `$foo`. The existing stylesheet is moved verbatim into `_legacy.scss`, then migrated out component-by-component — each migration is one atomic commit containing SCSS + HTML rename + Lucide icon stub swap + any `app.js` selector updates. Class naming moves from BEM-style `block__element--modifier` to flat kebab-case with `.is-*` state classes.

**Tech Stack:** Sass (dart-sass), Bun, Lucide icons (self-hosted UMD), Montserrat (self-hosted via @fontsource), concurrently. No runtime JS changes beyond a new `icons.js` helper and a handful of `renderIcons()` calls after DOM mutations.

**Reference:**
- Design spec: `docs/superpowers/specs/2026-04-21-design-refresh-design.md`
- Visual reference: `new-design.html` (project root) — its `<style>` block is the authoritative source for pixel values, colors, and layout dimensions. All hex values have already been extracted into tokens; all pixel values into layout-size tokens.

---

## Phase 1 — Foundation

### Task 1: Install dependencies via Bun

**Files:**
- Modify: `package.json` (dependencies added by Bun)

- [ ] **Step 1: Install dev-only build tooling**

Run:
```bash
bun add -d sass concurrently @fontsource/montserrat
```

Expected: `package.json` gains `devDependencies` entries for all three; `bun.lockb` is created.

- [ ] **Step 2: Install runtime-shipped icon library**

Run:
```bash
bun add lucide
```

Expected: `package.json` gains a `dependencies` entry `"lucide": "..."`.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lockb
git commit -m "chore: add sass, concurrently, @fontsource/montserrat, lucide"
```

---

### Task 2: Add package.json scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the Sass build/watch scripts and wrap `dev`**

Replace the existing `"scripts"` block with:

```json
"scripts": {
  "styles:build": "sass web/styles/index.scss web/styles.css --style=expanded --source-map --load-path=node_modules",
  "styles:watch": "sass --watch web/styles/index.scss:web/styles.css --source-map --load-path=node_modules",
  "dev": "concurrently -n server,styles -c green,cyan \"node scripts/tauri-dev-server.mjs\" \"bun run styles:watch\"",
  "start": "node scripts/tauri-dev-server.mjs",
  "doctor": "node scripts/doctor.mjs",
  "desktop:dev": "bun run styles:build && tauri dev --config src-tauri/tauri.conf.json",
  "desktop:build": "bun run styles:build && tauri build --config src-tauri/tauri.conf.json",
  "tauri:dev": "bun run desktop:dev",
  "tauri:build": "bun run desktop:build",
  "postinstall": "bun run styles:build"
}
```

Notes:
- `--load-path=node_modules` lets Sass resolve `@use` paths like `@fontsource/montserrat/...`.
- `desktop:dev`/`desktop:build` now run a one-shot style build first so Tauri always packages a current `styles.css`.
- `postinstall` builds on fresh clones (covers the gitignored-compiled-output case).

- [ ] **Step 2: Verify the scripts exist**

Run: `cat package.json | grep -E '"(styles:build|styles:watch|postinstall)"'`
Expected: three matching lines.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add sass scripts and wrap dev with concurrently"
```

---

### Task 3: Place Montserrat fonts

**Files:**
- Create: `web/fonts/Montserrat-Medium.woff2`
- Create: `web/fonts/Montserrat-SemiBold.woff2`

- [ ] **Step 1: Create the fonts directory**

Run: `mkdir -p web/fonts`

- [ ] **Step 2: Copy the two weights from @fontsource**

Run:
```bash
cp node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff2 web/fonts/Montserrat-Medium.woff2
cp node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2 web/fonts/Montserrat-SemiBold.woff2
```

- [ ] **Step 3: Verify**

Run: `ls -la web/fonts/`
Expected: two `.woff2` files, each > 10KB.

- [ ] **Step 4: Commit**

```bash
git add web/fonts/
git commit -m "feat: self-host Montserrat 500/600 woff2 under web/fonts/"
```

---

### Task 4: Vendor Lucide's UMD bundle

**Files:**
- Create: `web/vendor/lucide.min.js`

- [ ] **Step 1: Create vendor directory and copy the bundle**

Run:
```bash
mkdir -p web/vendor
cp node_modules/lucide/dist/umd/lucide.min.js web/vendor/lucide.min.js
```

- [ ] **Step 2: Verify**

Run: `ls -la web/vendor/lucide.min.js`
Expected: file exists, ~80–120KB.

- [ ] **Step 3: Commit**

```bash
git add web/vendor/
git commit -m "feat: vendor lucide UMD bundle under web/vendor/"
```

---

### Task 5: Create `web/icons.js`

**Files:**
- Create: `web/icons.js`

- [ ] **Step 1: Write the helper**

Create `web/icons.js` with exactly this content:

```js
(function () {
  function renderIcons(root) {
    if (!window.lucide || typeof window.lucide.createIcons !== "function") return;
    var opts = { nameAttr: "data-lucide" };
    if (root && root !== document) opts.root = root;
    window.lucide.createIcons(opts);
  }

  window.renderIcons = renderIcons;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { renderIcons(); });
  } else {
    renderIcons();
  }
})();
```

Why: exposes `window.renderIcons(rootNode)` so `app.js` can call it after injecting markup that contains `<i data-lucide="…">` stubs. Runs once on initial DOM to upgrade static stubs.

- [ ] **Step 2: Commit**

```bash
git add web/icons.js
git commit -m "feat: add icons.js helper that runs lucide.createIcons on demand"
```

---

### Task 6: Wire Lucide into `web/index.html`

**Files:**
- Modify: `web/index.html` (the `<head>` block, currently ending at line 8)

- [ ] **Step 1: Add the two script tags**

Find the `<title>` + `<link>` block in `<head>`:

```html
<title>Photoshop MVP</title>
<link rel="stylesheet" href="./styles.css">
```

Append immediately after `<link>` (still inside `<head>`):

```html
<script src="./vendor/lucide.min.js" defer></script>
<script src="./icons.js" defer></script>
```

Notes:
- `defer` preserves the order (`lucide.min.js` → `icons.js`) and fires after parsing, before `DOMContentLoaded`.
- `app.js` is not loaded from `<head>` in this project; it's loaded at the bottom of `<body>`. If the bottom-of-body load is via `<script type="module">`, `defer` on head scripts still runs before it — order stays correct.

- [ ] **Step 2: Verify both scripts are present**

Run: `grep -nE '(lucide\.min\.js|icons\.js)' web/index.html`
Expected: two matching lines.

- [ ] **Step 3: Open the app and confirm nothing breaks**

Run: `bun run start` in one terminal, open `http://127.0.0.1:4173` in a browser.
Expected: app loads. Open DevTools console — `window.lucide` and `window.renderIcons` both exist. No 404s in the Network tab.

- [ ] **Step 4: Commit**

```bash
git add web/index.html
git commit -m "feat: load lucide UMD and icons.js helper in index.html"
```

---

### Task 7: Scaffold `web/styles/` tree with empty partials

**Files:**
- Create: the entire `web/styles/` directory with 15 empty partials.

- [ ] **Step 1: Create the directory tree**

Run:
```bash
mkdir -p web/styles/components
touch web/styles/_tokens.scss
touch web/styles/_fonts.scss
touch web/styles/_mixins.scss
touch web/styles/_reset.scss
touch web/styles/_layout.scss
touch web/styles/_utilities.scss
touch web/styles/_legacy.scss
touch web/styles/index.scss
for f in menubar tabbar options-bar tool-rail canvas contextual-bar inspector sections layers status-bar home-screen dialogs context-menu forms; do
  touch "web/styles/components/_${f}.scss"
done
```

- [ ] **Step 2: Verify**

Run: `find web/styles -name '*.scss' | sort`
Expected: 22 files total (`index.scss` + 7 top-level partials + 14 component partials).

- [ ] **Step 3: Commit (empty scaffold)**

```bash
git add web/styles
git commit -m "chore: scaffold web/styles/ sass module tree"
```

---

### Task 8: Write `_tokens.scss`

**Files:**
- Modify: `web/styles/_tokens.scss`

- [ ] **Step 1: Write the full token set**

Replace the file's contents with:

```scss
// Design tokens — single source of truth for colors, typography, spacing, sizes.
//
// Pattern: each token has three lines:
//   1. Private Sass var `$_foo` holds the raw value (used only in this file).
//   2. A `:root` rule emits `--foo: #{$_foo};` so the value is a CSS custom property
//      at runtime.
//   3. A public Sass var `$foo: var(--foo)` is what every component imports and uses.
//
// Components never reference hex values, `$_foo`, or `var(--foo)` directly — only `$foo`.
// Sass-time math uses `$_foo`. Runtime math uses `calc($foo * 2)` which compiles to
// `calc(var(--foo) * 2)`.

// ──────────────────────────────────────────────────────────────────────────
// Raw values
// ──────────────────────────────────────────────────────────────────────────

// Surface colors
$_bg-app:       #2b2b2b;
$_bg-chrome:    #393939;
$_bg-panel:     #323232;
$_bg-panel-2:   #3c3c3c;
$_bg-input:     #262626;
$_bg-hover:     #4a4a4a;
$_bg-active:    #505050;
$_bg-selected:  #3b82c4;

// Foreground
$_fg:           #dcdcdc;
$_fg-2:         #a0a0a0;
$_fg-3:         #777777;

// Borders
$_border:       #1e1e1e;
$_border-2:     #4a4a4a;

// Semantic
$_accent:       #3b82c4;
$_accent-hover: #5397d5;
$_success:      #64b17c;
$_warning:      #eb7e3f;
$_danger:       #e83e36;

// Typography
$_font-family:  'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
$_fw-normal:    500;
$_fw-bold:      600;
$_fs-xs:        10px;
$_fs-sm:        11px;
$_fs-base:      12px;
$_fs-lg:        14px;

// Spacing scale
$_space-1:  2px;
$_space-2:  4px;
$_space-3:  6px;
$_space-4:  8px;
$_space-5:  10px;
$_space-6:  12px;
$_space-7:  16px;
$_space-8:  24px;

// Radii
$_radius-sm:  2px;
$_radius-md:  3px;
$_radius-lg:  6px;

// Layout sizes
$_h-menubar:      24px;
$_h-tabbar:       28px;
$_h-optionsbar:   32px;
$_h-statusbar:    22px;
$_w-tool-rail:    66px;
$_w-inspector:    268px;
$_h-control-sm:   20px;
$_h-control-md:   22px;

// Shadows
$_shadow-float:  0 8px 16px rgba(0, 0, 0, 0.4);
$_shadow-menu:   0 10px 28px rgba(0, 0, 0, 0.45);

// ──────────────────────────────────────────────────────────────────────────
// CSS custom property emission
// ──────────────────────────────────────────────────────────────────────────

:root {
  --bg-app:       #{$_bg-app};
  --bg-chrome:    #{$_bg-chrome};
  --bg-panel:     #{$_bg-panel};
  --bg-panel-2:   #{$_bg-panel-2};
  --bg-input:     #{$_bg-input};
  --bg-hover:     #{$_bg-hover};
  --bg-active:    #{$_bg-active};
  --bg-selected:  #{$_bg-selected};

  --fg:    #{$_fg};
  --fg-2:  #{$_fg-2};
  --fg-3:  #{$_fg-3};

  --border:    #{$_border};
  --border-2:  #{$_border-2};

  --accent:        #{$_accent};
  --accent-hover:  #{$_accent-hover};
  --success:       #{$_success};
  --warning:       #{$_warning};
  --danger:        #{$_danger};

  --font-family: #{$_font-family};
  --fw-normal:   #{$_fw-normal};
  --fw-bold:     #{$_fw-bold};
  --fs-xs:       #{$_fs-xs};
  --fs-sm:       #{$_fs-sm};
  --fs-base:     #{$_fs-base};
  --fs-lg:       #{$_fs-lg};

  --space-1:  #{$_space-1};
  --space-2:  #{$_space-2};
  --space-3:  #{$_space-3};
  --space-4:  #{$_space-4};
  --space-5:  #{$_space-5};
  --space-6:  #{$_space-6};
  --space-7:  #{$_space-7};
  --space-8:  #{$_space-8};

  --radius-sm:  #{$_radius-sm};
  --radius-md:  #{$_radius-md};
  --radius-lg:  #{$_radius-lg};

  --h-menubar:     #{$_h-menubar};
  --h-tabbar:      #{$_h-tabbar};
  --h-optionsbar:  #{$_h-optionsbar};
  --h-statusbar:   #{$_h-statusbar};
  --w-tool-rail:   #{$_w-tool-rail};
  --w-inspector:   #{$_w-inspector};
  --h-control-sm:  #{$_h-control-sm};
  --h-control-md:  #{$_h-control-md};

  --shadow-float:  #{$_shadow-float};
  --shadow-menu:   #{$_shadow-menu};
}

// ──────────────────────────────────────────────────────────────────────────
// Public Sass variables (what components use)
// ──────────────────────────────────────────────────────────────────────────

$bg-app:       var(--bg-app);
$bg-chrome:    var(--bg-chrome);
$bg-panel:     var(--bg-panel);
$bg-panel-2:   var(--bg-panel-2);
$bg-input:     var(--bg-input);
$bg-hover:     var(--bg-hover);
$bg-active:    var(--bg-active);
$bg-selected:  var(--bg-selected);

$fg:    var(--fg);
$fg-2:  var(--fg-2);
$fg-3:  var(--fg-3);

$border:    var(--border);
$border-2:  var(--border-2);

$accent:        var(--accent);
$accent-hover:  var(--accent-hover);
$success:       var(--success);
$warning:       var(--warning);
$danger:        var(--danger);

$font-family: var(--font-family);
$fw-normal:   var(--fw-normal);
$fw-bold:     var(--fw-bold);
$fs-xs:       var(--fs-xs);
$fs-sm:       var(--fs-sm);
$fs-base:     var(--fs-base);
$fs-lg:       var(--fs-lg);

$space-1:  var(--space-1);
$space-2:  var(--space-2);
$space-3:  var(--space-3);
$space-4:  var(--space-4);
$space-5:  var(--space-5);
$space-6:  var(--space-6);
$space-7:  var(--space-7);
$space-8:  var(--space-8);

$radius-sm:  var(--radius-sm);
$radius-md:  var(--radius-md);
$radius-lg:  var(--radius-lg);

$h-menubar:     var(--h-menubar);
$h-tabbar:      var(--h-tabbar);
$h-optionsbar:  var(--h-optionsbar);
$h-statusbar:   var(--h-statusbar);
$w-tool-rail:   var(--w-tool-rail);
$w-inspector:   var(--w-inspector);
$h-control-sm:  var(--h-control-sm);
$h-control-md:  var(--h-control-md);

$shadow-float:  var(--shadow-float);
$shadow-menu:   var(--shadow-menu);
```

- [ ] **Step 2: Commit**

```bash
git add web/styles/_tokens.scss
git commit -m "feat(styles): add design tokens (raw, :root emission, public sass vars)"
```

---

### Task 9: Write `_fonts.scss`

**Files:**
- Modify: `web/styles/_fonts.scss`

- [ ] **Step 1: Write the @font-face rules**

Replace with:

```scss
@font-face {
  font-family: 'Montserrat';
  src: url('../fonts/Montserrat-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Montserrat';
  src: url('../fonts/Montserrat-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

Note: the `url()` paths are relative to the compiled `web/styles.css` (one level up from the source `web/styles/` dir, so `../fonts/` resolves to `web/fonts/`).

- [ ] **Step 2: Commit**

```bash
git add web/styles/_fonts.scss
git commit -m "feat(styles): declare @font-face for Montserrat 500/600"
```

---

### Task 10: Write `_mixins.scss`

**Files:**
- Modify: `web/styles/_mixins.scss`

- [ ] **Step 1: Write an initial mixin set**

Replace with:

```scss
@use 'tokens' as *;

// Reset the UA appearance on a button and give it a flat, chromeless baseline.
// Components can then layer on padding, colors, and radius.
@mixin button-reset {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 0;
  &:focus { outline: none; }
  &:focus-visible { outline: 1px solid $accent; outline-offset: 1px; }
}

// A standard 28x26 icon-only button (tool rail cells, layer-footer icons, etc).
@mixin icon-button($size: 22px) {
  @include button-reset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width:  $size;
  height: $size;
  border-radius: $radius-sm;
  color: $fg;
  &:hover { background: $bg-hover; }
}

// Panel surface (inspector sections, menubar, toolbar chrome).
@mixin panel-surface {
  background: $bg-chrome;
  color: $fg;
  border-bottom: 1px solid $border;
}

// Visually-hidden without breaking layout flow for screen readers.
@mixin visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0);
  white-space: nowrap; border: 0;
}

// Marching-ants animation for selections (used by marquee + contextual outlines).
@keyframes marching-ants {
  to { background-position: 12px 0; }
}
```

- [ ] **Step 2: Commit**

```bash
git add web/styles/_mixins.scss
git commit -m "feat(styles): add button-reset, icon-button, panel-surface, visually-hidden mixins"
```

---

### Task 11: Write `_reset.scss`

**Files:**
- Modify: `web/styles/_reset.scss`

- [ ] **Step 1: Write a minimal reset**

Replace with:

```scss
@use 'tokens' as *;

*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  height: 100%;
  background: $bg-app;
  color: $fg;
  font-family: $font-family;
  font-size: $fs-base;
  font-weight: $fw-normal;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

button {
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
  color: inherit;
}

::selection {
  background: $bg-selected;
  color: #fff;
}
```

- [ ] **Step 2: Commit**

```bash
git add web/styles/_reset.scss
git commit -m "feat(styles): add minimal reset with token-driven base typography"
```

---

### Task 12: Write `_utilities.scss`

**Files:**
- Modify: `web/styles/_utilities.scss`

- [ ] **Step 1: Write icon + visibility utilities**

Replace with:

```scss
@use 'tokens' as *;
@use 'mixins' as *;

.visually-hidden { @include visually-hidden; }

.icon {
  width:  $fs-lg;      // 14px at base
  height: $fs-lg;
  stroke-width: 1.75;
  flex-shrink: 0;
}
.icon-sm { width: $fs-sm;  height: $fs-sm; }   // 11px
.icon-md { width: 15px;    height: 15px; }
.icon-lg { width: 18px;    height: 18px; }
```

- [ ] **Step 2: Commit**

```bash
git add web/styles/_utilities.scss
git commit -m "feat(styles): add .icon sizing + .visually-hidden utilities"
```

---

### Task 13: Seed `_legacy.scss` with current styles.css verbatim

**Files:**
- Modify: `web/styles/_legacy.scss`
- Reference: `web/styles.css` (current hand-authored CSS)

- [ ] **Step 1: Copy current styles.css contents into the legacy partial**

Run:
```bash
cp web/styles.css web/styles/_legacy.scss
```

- [ ] **Step 2: Add a top-of-file banner**

Open `web/styles/_legacy.scss` and prepend:

```scss
// Transitional legacy stylesheet.
//
// Contains the original styles.css verbatim at migration start. As each
// component is moved into its own partial under components/, its rules
// are DELETED from this file. The file should be empty and `@use`-d from
// index.scss by the end of the migration; at that point delete this file
// and remove its @use line.
//
// Do not add new rules here. Edits are strictly deletions.
```

Note: Sass tolerates plain CSS verbatim. Any `&`-less rules, nested `@media`, vendor prefixes, etc. from `styles.css` compile cleanly inside an `@use`-d partial.

- [ ] **Step 3: Verify the copy**

Run: `wc -l web/styles.css web/styles/_legacy.scss`
Expected: legacy has 2231 lines + a few banner lines.

- [ ] **Step 4: Commit**

```bash
git add web/styles/_legacy.scss
git commit -m "chore(styles): seed _legacy.scss with current styles.css for migration"
```

---

### Task 14: Wire up `index.scss`

**Files:**
- Modify: `web/styles/index.scss`

- [ ] **Step 1: Import every partial in cascade order**

Replace with:

```scss
// Entry point — compiled to web/styles.css by `bun run styles:build`.
//
// Order matters for the cascade. _legacy is first so new component partials
// cascade-win on overlap during migration. Tokens/fonts/mixins are @use-only
// (they don't emit rules) and therefore order-insensitive among themselves.

// Token layer and helpers — these emit :root rules + @font-face at load time,
// but must be @use-d by downstream partials to expose $vars.
@use 'tokens';
@use 'fonts';
@use 'mixins';

// Legacy bucket (will shrink to zero as components migrate out, then be deleted).
@use 'legacy';

// Foundation layers.
@use 'reset';
@use 'layout';
@use 'utilities';

// Components.
@use 'components/menubar';
@use 'components/tabbar';
@use 'components/options-bar';
@use 'components/tool-rail';
@use 'components/canvas';
@use 'components/contextual-bar';
@use 'components/inspector';
@use 'components/sections';
@use 'components/layers';
@use 'components/status-bar';
@use 'components/home-screen';
@use 'components/dialogs';
@use 'components/context-menu';
@use 'components/forms';
```

Note: Sass's `@use` requires that `_tokens.scss`, `_fonts.scss`, `_mixins.scss` be `@use`-d first at the top of files that reference them — which we've already done in `_reset.scss`, `_mixins.scss`, and `_utilities.scss`. Every component partial will start with `@use '../tokens' as *;` etc.

- [ ] **Step 2: Commit**

```bash
git add web/styles/index.scss
git commit -m "feat(styles): wire up index.scss with full @use order"
```

---

### Task 15: Gitignore the compiled CSS and remove the committed copy

**Files:**
- Modify: `.gitignore`
- Delete (from git tracking only): `web/styles.css`

- [ ] **Step 1: Add compiled output + sourcemap to .gitignore**

Open `.gitignore` and append:

```
# Compiled Sass output — generated by `bun run styles:build`.
web/styles.css
web/styles.css.map
```

- [ ] **Step 2: Untrack the existing compiled file (keep the file on disk for now)**

Run:
```bash
git rm --cached web/styles.css
```

Expected: output `rm 'web/styles.css'`. The file remains on disk — we still need it visible until the first Sass build in Task 16 overwrites it.

- [ ] **Step 3: Verify ignore rule works**

Run: `git status web/styles.css`
Expected: empty (ignored).

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore compiled web/styles.css and its source map"
```

---

### Task 16: First compile + verify app unchanged

**Files:**
- Generated: `web/styles.css`, `web/styles.css.map` (both gitignored)

- [ ] **Step 1: Run the Sass build**

Run: `bun run styles:build`
Expected: command succeeds, `web/styles.css` and `web/styles.css.map` are (re-)written. No warnings except possibly about deprecated CSS features in the legacy content (acceptable).

- [ ] **Step 2: Verify output size**

Run: `wc -l web/styles.css`
Expected: larger than the original 2231 (legacy + tokens `:root` block + @font-face + reset + utilities).

- [ ] **Step 3: Start the dev server and open the app**

Run (in a separate terminal): `bun run start`
Open `http://127.0.0.1:4173` in a browser.

- [ ] **Step 4: Smoke-check that nothing visually regressed**

Expected:
- App renders the home screen exactly as before (same layout, same colors, same typography — Montserrat is declared in `_fonts.scss` but nothing references it yet; body still uses Inter via `_legacy.scss`'s rules).
- Opening an image, drawing a stroke, adding a layer, undo/redo all still work.
- Check DevTools console: no new errors. `window.renderIcons` is defined. No 404s for `lucide.min.js` or the woff2 files (the woff2 files won't be requested until something uses Montserrat, which is fine).

- [ ] **Step 5: Commit (no tracked changes expected, but verify)**

Run: `git status`
Expected: clean working tree. If `web/styles.css` shows as modified, step 1 of Task 15 is wrong — re-verify the gitignore line.

---

### Task 17: Icon audit

**Files:**
- Create: `docs/superpowers/plans/2026-04-21-icon-audit.md`

- [ ] **Step 1: Scan every inline `<svg>` in `web/index.html` and map it to a Lucide icon name**

Open `web/index.html`. For each `<svg class="tool-button__icon">` and every other inline `<svg>`, identify the icon's intent from surrounding context (title, aria-label, `data-tool`) and pick the matching Lucide icon name from https://lucide.dev.

Create `docs/superpowers/plans/2026-04-21-icon-audit.md` with a table:

```markdown
# Icon audit — Photoshop → Lucide

| Context (HTML) | Current SVG intent | Lucide name | Notes |
|---|---|---|---|
| `.tool-button[data-tool="move"]` | pan arrows | `move` | direct match |
| `.tool-button[data-tool="transform"]` | frame + handles | `square-dashed-mouse-pointer` | closest available |
| `.tool-button[data-tool="direct"]` | cursor with node | `mouse-pointer-2` | |
| `.tool-button[data-tool="crop"]` | crop corners | `crop` | |
| `.tool-button[data-tool="text"]` | T glyph | `type` | |
| `.tool-button[data-tool="pen"]` | bezier + anchors | `pen-tool` | |
| `.tool-button[data-tool="shape"]` | rectangle + dots | `shapes` | or `square` |
| `.tool-button[data-tool="eyedropper"]` | pipette | `pipette` | |
| `.tool-button[data-tool="bucket"]` | paint bucket | `paint-bucket` | |
| `.tool-button[data-tool="gradient"]` | gradient ramp | `blend` | or `contrast` |
| `.tool-button[data-tool="color-range"]` | color sample | `palette` | |
| `.tool-button[data-tool="magic-wand"]` | wand + sparkles | `wand-sparkles` | |
| `.tool-button[data-tool="brush"]` | brush | `brush` | |
| `.tool-button[data-tool="eraser"]` | eraser | `eraser` | |
| `.tool-button[data-tool="magic-eraser"]` | eraser + sparkle | `eraser` + separate sparkle? | keep inline SVG if no clean match |
| `.tool-button[data-tool="select"]` | dashed rect | `square-dashed` | |
| `.tool-button[data-tool="select-ellipse"]` | dashed ellipse | `circle-dashed` | |
| `.tool-button[data-tool="artboard"]` | frame-in-frame | `frame` | |
| `.tool-button[data-tool="ruler"]` | ruler | `ruler` | |
| `.tool-button--help` | question mark circle | `circle-help` | |
| panel-section toggle chevron | chevron-down | `chevron-down` | |
| contextual-bar drag grip (`::`) | grip vertical | `grip-vertical` | |
| layer eye on/off | eye / eye-off | `eye` / `eye-off` | |
| layer lock indicator | padlock | `lock` | |
| layers footer new | plus | `plus` | |
| layers footer delete | trash | `trash-2` | |
| layers footer group | folder | `folder` | |
| status-bar saved dot | filled circle | inline SVG (no good Lucide equivalent) | keep small inline SVG |
```

Any icon without a clean Lucide match is left as the existing inline SVG in the markup (we do not force-fit icons we don't like).

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/2026-04-21-icon-audit.md
git commit -m "docs: audit inline SVGs in index.html and map to Lucide names"
```

---

## Phase 2 — Foundation migration (layout)

### Task 18: Write `_layout.scss`

**Files:**
- Modify: `web/styles/_layout.scss`
- Modify: `web/styles/_legacy.scss` (delete rules being replaced)
- Reference: `new-design.html` `<style>` block's `.app { grid-template-rows: 24px 28px 32px 1fr 22px; }` and `.main { grid-template-columns: 66px 1fr 268px; }` blocks.

- [ ] **Step 1: Identify app-shell rules in `_legacy.scss`**

Run: `grep -nE '(app-shell|app-main|\.workspace\b|\.inspector\b|\.tools\b)' web/styles/_legacy.scss`
Note the line ranges that define the outer layout grid. Open those ranges in a viewer — they're what we're replacing.

- [ ] **Step 2: Write the new layout rules**

Replace `web/styles/_layout.scss` with:

```scss
@use 'tokens' as *;

// The app shell is a 5-row grid: menubar / tabbar / options-bar / main / status.
// When the home screen is active, #app-main is hidden and #home-screen occupies
// rows 2–5. When the editor is active, #home-screen is hidden and #app-main
// occupies rows 2–5.
.app-shell {
  display: grid;
  grid-template-rows: $h-menubar $h-tabbar $h-optionsbar 1fr $h-statusbar;
  height: 100vh;
  min-height: 0;
  overflow: hidden;
}

// Main editor region (tool rail | canvas workspace | inspector).
.app-main {
  display: grid;
  grid-template-columns: $w-tool-rail 1fr $w-inspector;
  min-height: 0;
  overflow: hidden;
  &[hidden] { display: none; }
}

// Home screen occupies the same post-menubar rows when it's the active view.
.home-screen {
  min-height: 0;
  overflow: auto;
  &[hidden] { display: none; }
}
```

- [ ] **Step 3: Delete the corresponding rules from `_legacy.scss`**

Open `web/styles/_legacy.scss`. Find and delete:
- The `.app-shell { … }` rule.
- The `.app-main { … }` rule (and its `hidden` handling).
- The outer-most `.home-screen { display: grid; … }` rule **that defines the top-level layout only** — its inner rules (hero, sidebar, nav) stay in `_legacy.scss` until Task 30 (`_home-screen.scss`).

Leave rules for inner elements (`.tools`, `.workspace`, `.inspector` internals, `.home-screen__sidebar`, `.home-screen__content`, etc.) alone — they're migrated in later component tasks.

- [ ] **Step 4: Compile and verify**

Run: `bun run styles:build`
Expected: succeeds.

Open the app in a browser. Reload.
Expected: home screen still visible and functional. Layout rows may shift slightly (24/28/32 vs whatever was there before), but nothing collapses or overlaps. Open an image to switch to the editor view — the 3-column editor layout displays with tool rail (66px), canvas, inspector (268px).

- [ ] **Step 5: Commit**

```bash
git add web/styles/_layout.scss web/styles/_legacy.scss
git commit -m "feat(styles): move app-shell grid into _layout.scss using tokens"
```

---

## Phase 3 — Component migration

Each component migration follows the same pattern:

1. **Grep legacy** to find the rules owning this component.
2. **Grep `app.js`** for any class selectors tied to those rules (most of app.js uses IDs/data-attrs, but verify).
3. **Write the new partial** using tokens (reference the spec's token table and the matching CSS block in `new-design.html`).
4. **Rename classes in `web/index.html`** for this component's markup: remove `__`/`--` in favor of flat kebab + `.is-*` state. Swap inline `<svg>` blocks for `<i data-lucide="…" class="icon">` stubs per the audit in Task 17. Keep all IDs and `data-*` attributes unchanged.
5. **Update `app.js`** for any selector that referenced a renamed class.
6. **Insert `renderIcons(container)` calls** in `app.js` at any site that injects this component's markup after page load.
7. **Delete the migrated rules from `_legacy.scss`.**
8. **Compile + smoke test + commit.**

The component order (risk-descending) is: menubar, tabbar, options-bar, status-bar, tool-rail, canvas, contextual-bar, inspector, sections, layers, forms, home-screen, dialogs, context-menu.

---

### Task 19: Migrate `menubar`

**Files:**
- Modify: `web/styles/components/_menubar.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (the `<header class="topbar">` block, approx lines 11–169)
- Possibly: `web/app.js`

Current class tree (from `web/index.html`):
- `.topbar`, `.topbar__menu`
- `.menu-links`, `.menu` (block wrapping each root menu), `.menu-link`, `.menu-link--root`
- `.menu__panel`, `.menu__panel--dropdown`, `.menu__divider`, `.menu-toggle-item`, `.menu-toggle-item__mode`

New class tree (flat kebab, `.is-*` for state):
- `.topbar`, `.topbar-menus`
- `.menu`, `.menu-link`, `.menu-link.is-root`, `.menu-link.is-open`
- `.menu-panel`, `.menu-panel.is-dropdown`, `.menu-divider`, `.menu-toggle`, `.menu-toggle-mode`

- [ ] **Step 1: Find owning legacy rules**

Run: `grep -nE '(\.topbar|\.menu-link|\.menu__|\.menu-toggle)' web/styles/_legacy.scss`
Note the line ranges.

- [ ] **Step 2: Check app.js for class selectors**

Run: `grep -nE "(menu__panel|menu-link--root|menu-toggle-item__|topbar__)" web/app.js`
For each match, plan the rename. Most menu logic in `app.js` uses `data-menu-button`, `data-menu-panel`, `data-menu-root`, `data-menu-panel-item` and IDs (`#file-menu`), not these classes — so hits are typically few.

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_menubar.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.topbar {
  @include panel-surface;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 $space-2;
  font-size: $fs-base;
  height: $h-menubar;
}

.topbar-menus {
  display: flex;
  align-items: center;
}

// A "menu" wraps each root menu button + its dropdown panel.
.menu {
  position: relative;
  display: inline-block;
}

.menu-link {
  @include button-reset;
  padding: $space-1 $space-3;
  color: $fg;
  border-radius: $radius-sm;
  cursor: default;
  line-height: calc($h-menubar - 2 * $space-1);
  &:hover { background: $bg-hover; }

  &.is-root { /* currently no extra styling; hook for future */ }
  &.is-open { background: $bg-hover; }
}

.menu-panel {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  min-width: 220px;
  background: $bg-chrome;
  border: 1px solid $border;
  box-shadow: $shadow-menu;
  padding: $space-1 0;
  z-index: 20;

  &[hidden] { display: none; }

  button {
    @include button-reset;
    display: block;
    width: 100%;
    text-align: left;
    padding: $space-2 $space-5;
    color: $fg;
    font-size: $fs-sm;
    &:hover { background: $bg-hover; }
  }
}

.menu-divider {
  height: 1px;
  background: $border;
  margin: $space-1 0;
}

.menu-toggle {
  @include button-reset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: $space-2 $space-5;
  color: $fg;
  font-size: $fs-sm;
  &:hover { background: $bg-hover; }
}

.menu-toggle-mode {
  color: $fg-3;
  font-size: $fs-xs;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

- [ ] **Step 4: Rename classes in `web/index.html`**

In the `<header class="topbar">` block (lines ~11–169), apply these substitutions exactly:

| Old | New |
|---|---|
| `class="topbar__menu"` | `class="topbar-menus"` |
| `class="menu-link menu-link--root"` | `class="menu-link is-root"` |
| `class="menu__panel menu__panel--dropdown"` | `class="menu-panel is-dropdown"` |
| `class="menu__divider"` | `class="menu-divider"` |
| `class="menu-toggle-item"` | `class="menu-toggle"` |
| `class="menu-toggle-item__mode"` | `class="menu-toggle-mode"` |

Wrap the menu list in a `<nav class="topbar-menus">…</nav>` pattern if not already. Do not add an app badge in the menu bar.

- [ ] **Step 5: Update `app.js` for any selector renames**

From Step 2's grep, update each hit in `web/app.js` to use the new class name. Typical changes:
- `.menu__panel` → `.menu-panel`
- `.menu-link--root` → `.menu-link.is-root`
- `.menu-toggle-item__mode` → `.menu-toggle-mode`

If a listener currently toggles `menu-open` or similar on `.menu`, switch it to toggle `is-open` on `.menu-link` per the new convention.

- [ ] **Step 6: Delete the migrated rules from `_legacy.scss`**

Using Step 1's line ranges, delete from `web/styles/_legacy.scss`:
- `.topbar`, `.topbar__menu`
- `.menu`, `.menu-link`, `.menu-link--root`
- `.menu__panel`, `.menu__panel--dropdown`, `.menu__divider`
- `.menu-toggle-item`, `.menu-toggle-item__mode`

- [ ] **Step 7: Compile and verify**

Run: `bun run styles:build`
Expected: succeeds.

Reload the app in the browser.
Expected:
- Menubar is 24px tall, sits flush against the top, chrome color is `#393939`.
- Menu items have correct hover states.
- Clicking "File" opens its dropdown at the expected position with correct size.
- All menu actions (New, Open, Save, etc.) still trigger their handlers.
- Typography is Montserrat (if a woff2 isn't requested yet, inspect `.topbar` in DevTools → should show `font-family: Montserrat, …`).

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_menubar.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate menubar to component partial + flat kebab naming"
```

---

### Task 20: Migrate `tabbar` (project-tabs)

**Files:**
- Modify: `web/styles/components/_tabbar.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (`<div id="project-tabs" class="project-tabs">`)
- Modify: `web/app.js` (the tab-render code, which injects tab DOM)

Current classes: `.project-tabs`, `.project-tab`, `.project-tab--active`, `.project-tab__title`, `.project-tab__close`, `.project-tab__dot`.

New classes: `.project-tabs`, `.project-tab`, `.project-tab.is-active`, `.project-tab-title`, `.project-tab-close`, `.project-tab-dot`.

- [ ] **Step 1: Find owning legacy rules**

Run: `grep -nE '\.project-tab' web/styles/_legacy.scss`
Note ranges.

- [ ] **Step 2: Find app.js tab render code**

Run: `grep -nE 'project-tab' web/app.js`
Locate the function that creates tab elements (likely via `innerHTML` or `createElement`). Note the line range.

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_tabbar.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.project-tabs {
  background: $bg-chrome;
  display: flex;
  align-items: stretch;
  padding: 0;
  border-bottom: 1px solid $border;
  height: $h-tabbar;
  overflow-x: auto;

  &[hidden] { display: none; }
}

.project-tab {
  display: inline-flex;
  align-items: center;
  gap: $space-4;
  padding: 0 $space-5 + $space-1;   // 13px
  background: $bg-panel;
  border-right: 1px solid $border;
  color: $fg-2;
  cursor: pointer;
  font-size: $fs-sm;
  user-select: none;

  &:hover { color: $fg; }
  &.is-active { background: $bg-app; color: $fg; }
}

.project-tab-dot {
  width: 5px;
  height: 5px;
  border-radius: 99px;
  background: $accent;
  display: inline-block;
}

.project-tab-title {
  white-space: nowrap;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-tab-close {
  @include icon-button(16px);
  width: 10px;
  height: 10px;
  opacity: 0.5;
  color: inherit;
  &:hover { opacity: 1; background: transparent; }
}

.project-tab-new {
  color: $fg-3;
  padding: 0 $space-4;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  background: $bg-panel;
  border-right: 1px solid $border;
  &:hover { color: $fg; }
}
```

- [ ] **Step 4: Rename classes in HTML + JS**

`web/index.html`: the `<div id="project-tabs" class="project-tabs">` element stays as-is (no `__`/`--` to rewrite in the template itself).

`web/app.js`: in the tab-render function from Step 2, change:
- `project-tab--active` → `project-tab is-active` (two classes)
- `project-tab__title` → `project-tab-title`
- `project-tab__close` → `project-tab-close`
- `project-tab__dot` → `project-tab-dot`

If the render uses `<svg>` for the close button, replace with `<i data-lucide="x" class="icon icon-sm"></i>`. If it uses text/glyphs, leave as-is.

After rendering any tab, call `window.renderIcons(containerEl)` where `containerEl` is the tab row (if Lucide stubs were introduced in the render).

- [ ] **Step 5: Delete legacy rules**

Delete the `.project-tab*` rules identified in Step 1 from `_legacy.scss`.

- [ ] **Step 6: Compile + verify**

Run: `bun run styles:build`.
In the browser, open two documents. Expected:
- Tab bar is 28px tall, chrome background.
- Active tab has app-bg color.
- Close button (X) works.
- Clicking tabs switches documents.

- [ ] **Step 7: Commit**

```bash
git add web/styles/components/_tabbar.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate project tabs to component partial"
```

---

### Task 21: Migrate `options-bar` (workspace__toolbar)

**Files:**
- Modify: `web/styles/components/_options-bar.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (`<div class="workspace__toolbar">` block, approx lines 394–561)

Current classes: `.workspace__toolbar`, `.toolbar-group`, `.toolbar-group--options`, `.toolbar-group--status`, `.toolbar-options`, `.toolbar-options__label`, `.tool-options`, `.tool-options--hint`, `.toolbar-field`, `.toolbar-field--mini`, `.toolbar-field--range`, `.toolbar-field--checkbox`.

New classes: `.options-bar`, `.options-bar-group`, `.options-bar-group.is-options`, `.options-bar-group.is-status`, `.options-bar-options`, `.options-bar-options-label`, `.tool-options`, `.tool-options.is-hint`, `.toolbar-field`, `.toolbar-field.is-mini`, `.toolbar-field.is-range`, `.toolbar-field.is-checkbox`.

Note: we rename the OUTER wrapper (`workspace__toolbar` → `options-bar`) to match the spec's vocabulary, but keep the inner `.toolbar-field` name (it's used in multiple places and the word "toolbar" still describes it).

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE '(workspace__toolbar|toolbar-group|toolbar-options|toolbar-field|tool-options)' web/styles/_legacy.scss`

- [ ] **Step 2: Check app.js**

Run: `grep -nE '(workspace__toolbar|toolbar-group|tool-options|toolbar-field|toolbar-options__label)' web/app.js`
Note renames to apply.

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_options-bar.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.options-bar {
  background: $bg-chrome;
  display: flex;
  align-items: center;
  padding: 0 $space-3 + $space-1;   // 7px
  gap: $space-3 - $space-1;         // 5px
  border-bottom: 1px solid $border;
  font-size: $fs-sm;
  height: $h-optionsbar;
}

.options-bar-group {
  display: flex;
  align-items: center;
  gap: $space-2 - 1px;              // 3px

  &.is-options { flex: 1; min-width: 0; }
  &.is-status {
    margin-left: auto;
    gap: $space-6;
    color: $fg-2;
    strong, b { color: $fg; font-weight: $fw-bold; }
  }

  // Vertical separators between groups
  + .options-bar-group { border-left: 1px solid $border; padding-left: $space-3; }
}

.options-bar-options {
  display: flex;
  align-items: center;
  gap: $space-3;
  min-width: 0;
  overflow: hidden;
}

.options-bar-options-label {
  color: $fg-3;
  font-weight: $fw-bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: $fs-xs;
}

.tool-options {
  display: flex;
  align-items: center;
  gap: $space-3;

  &[hidden] { display: none; }
  &.is-hint { color: $fg-2; font-style: italic; }
}

// Field label + input pair, used inside options bar + contextual bar.
.toolbar-field {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  color: $fg-2;
  font-size: $fs-sm;

  input[type="number"], input[type="text"], select {
    height: $h-control-sm;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    padding: 0 $space-3;
    font: inherit;
    font-variant-numeric: tabular-nums;
    outline: 0;
    &:focus { border-color: $accent; }
  }

  &.is-mini input { width: 48px; }
  &.is-range {
    gap: $space-3;
    strong { color: $fg; font-variant-numeric: tabular-nums; font-weight: $fw-bold; }
  }
  &.is-checkbox { gap: $space-2; color: $fg; }
}
```

- [ ] **Step 4: Rename HTML classes**

In `web/index.html`'s `<div class="workspace__toolbar">` block:

| Old | New |
|---|---|
| `class="workspace__toolbar"` | `class="options-bar"` |
| `class="toolbar-group"` | `class="options-bar-group"` |
| `class="toolbar-group toolbar-group--options"` | `class="options-bar-group is-options"` |
| `class="toolbar-group toolbar-group--status"` | `class="options-bar-group is-status"` |
| `class="toolbar-options"` | `class="options-bar-options"` |
| `class="toolbar-options__label"` | `class="options-bar-options-label"` |
| `class="tool-options tool-options--hint"` | `class="tool-options is-hint"` |
| `class="toolbar-field toolbar-field--mini"` | `class="toolbar-field is-mini"` |
| `class="toolbar-field toolbar-field--range"` | `class="toolbar-field is-range"` |
| `class="toolbar-field toolbar-field--checkbox"` | `class="toolbar-field is-checkbox"` |

Zoom +/- button icons (lines ~551–554): the `-` and `+` text buttons become:
- `<button id="zoom-out" type="button"><i data-lucide="minus" class="icon"></i></button>`
- `<button id="zoom-in"  type="button"><i data-lucide="plus"  class="icon"></i></button>`
- `<button id="fit-view" type="button">Fit</button>` (keep text)

- [ ] **Step 5: Update `app.js`**

Apply renames from Step 2's grep results. If the code has a function like `showToolOptions(name)` that toggles the `hidden` attribute on `.tool-options[data-tool-options~="…"]`, no change is needed (attribute selectors unchanged). If it toggles `tool-options--hint` class, update to `is-hint`.

- [ ] **Step 6: Delete legacy rules**

Delete the rules identified in Step 1 from `_legacy.scss`.

- [ ] **Step 7: Compile + verify**

Run: `bun run styles:build`.
In the browser, open an image. Expected:
- Options bar is 32px tall.
- Undo/Redo at left, Transform label + X/Y/W/H/Rot inputs in middle, zoom group + status at right.
- Selecting the Brush tool swaps to brush Size + Opacity controls.
- All input changes still affect the tool (verify transform X moves a layer).

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_options-bar.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate workspace toolbar to options-bar partial (32px)"
```

---

### Task 22: Migrate `status-bar`

**Files:**
- Modify: `web/styles/components/_status-bar.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` — the status region is currently a `toolbar-group--status` inside the options bar. We need to **extract** it into its own bottom strip.

**Structural change note:** currently the status info (`status-file`, `status-tool`, `status-zoom`, `status-pointer`) lives inside the top options bar (see HTML line ~555). The reference design moves status to a dedicated bottom strip. Per the spec's "no structural change", we **keep** the IDs and their contents, but move the status span group to a new `<footer class="status-bar">` right after `<div id="app-main">` closes. The existing `<span id="status-*">` elements move unchanged.

- [ ] **Step 1: Move the status markup**

Find in `web/index.html`:

```html
<div class="toolbar-group toolbar-group--status">
  <span id="status-file">Demo Scene</span>
  <span id="status-tool">Move</span>
  <span id="status-zoom">100%</span>
  <span id="status-pointer">x -, y -</span>
</div>
```

Delete that block from its current location (inside `workspace__toolbar`).

Add this block **immediately after the closing `</div>` of `#app-main`** (so it's the last child of `.app-shell` — see `_layout.scss`'s grid row 5):

```html
<footer class="status-bar" aria-label="Status">
  <span class="status-bar-item">
    <span class="status-bar-dot status-bar-dot-ok" aria-hidden="true"></span>
    <span id="status-file">Demo Scene</span>
  </span>
  <span class="status-bar-sep" aria-hidden="true"></span>
  <span class="status-bar-item"><span id="status-tool">Move</span></span>
  <span class="status-bar-sep" aria-hidden="true"></span>
  <span class="status-bar-right">
    <span class="status-bar-item"><b>sRGB</b> · 8-bit</span>
    <span class="status-bar-sep" aria-hidden="true"></span>
    <span class="status-bar-item"><b id="status-zoom">100%</b></span>
    <span class="status-bar-sep" aria-hidden="true"></span>
    <span class="status-bar-item" id="status-pointer">x -, y -</span>
  </span>
</footer>
```

All four IDs (`status-file`, `status-tool`, `status-zoom`, `status-pointer`) are preserved, so `app.js` needs no changes.

- [ ] **Step 2: Write the partial**

Replace `web/styles/components/_status-bar.scss` with:

```scss
@use '../tokens' as *;

.status-bar {
  background: $bg-chrome;
  border-top: 1px solid $border;
  display: flex;
  align-items: center;
  padding: 0 $space-5;
  gap: $space-7 - $space-1;         // 14px
  font-size: $fs-xs;
  color: $fg-2;
  font-variant-numeric: tabular-nums;
  height: $h-statusbar;
}

.status-bar-item {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  b, strong { color: $fg; font-weight: $fw-bold; }
}

.status-bar-sep {
  width: 1px;
  height: 10px;
  background: $border-2;
}

.status-bar-right {
  margin-left: auto;
  display: flex;
  gap: $space-6;
  align-items: center;
}

.status-bar-dot {
  width: 5px; height: 5px;
  border-radius: 99px;
  background: currentColor;
}
.status-bar-dot-ok { background: $success; }
```

- [ ] **Step 3: Delete legacy `toolbar-group--status` rules**

In `_legacy.scss`, delete the specific rules that targeted `.toolbar-group--status`. Leave `.toolbar-group` itself — it was already migrated in Task 21.

- [ ] **Step 4: Compile + verify**

Run: `bun run styles:build`. Reload app. Expected:
- 22px bottom strip with saved-dot, tool, coordinates, zoom.
- `status-tool` still updates on tool change (verify by switching tools).
- `status-pointer` still tracks mouse coordinates.

- [ ] **Step 5: Commit**

```bash
git add web/styles/components/_status-bar.scss web/styles/_legacy.scss web/index.html
git commit -m "refactor(ui): extract status bar to bottom strip with its own partial"
```

---

### Task 23: Migrate `tool-rail` (apply 2-column layout)

**Files:**
- Modify: `web/styles/components/_tool-rail.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` — the `<aside class="tools">` block (approx lines 217–391). Rename classes; replace every `<svg class="tool-button__icon">…</svg>` with `<i data-lucide="…" class="icon icon-md">` per Task 17's audit.

Current classes: `.tools`, `.tools__rail`, `.tools__palette`, `.tools__palette-label`, `.tools__footer`, `.tools__help`, `.tools__help-popover`, `.tools__help-title`, `.tools__help-note`, `.tools__help-shortcuts`, `.tool-button`, `.tool-button__icon`, `.tool-button--help`, `.tool-button.is-active`, `.tool-color`, `.tool-color--front`, `.tool-color--back`, `.tool-color-stack`.

New classes: `.tool-rail`, `.tool-rail-grid`, `.tool-palette`, `.tool-palette-label`, `.tool-rail-footer`, `.tool-rail-help`, `.tool-rail-help-popover`, `.tool-rail-help-title`, `.tool-rail-help-note`, `.tool-rail-help-shortcuts`, `.tool`, `.tool.is-active`, `.tool.is-help`, `.tool-color`, `.tool-color.is-front`, `.tool-color.is-back`, `.tool-color-stack`.

The outer `<aside class="tools">` wrapper is renamed to `<aside class="tool-rail">` to match spec vocabulary. The inner `<div class="tools__rail">` flattens to `<div class="tool-rail-grid">`.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE '(\.tools|\.tool-button|\.tool-color)' web/styles/_legacy.scss`

- [ ] **Step 2: Check app.js**

Run: `grep -nE '(tool-button|tools__|\.tools\b|tool-color--)' web/app.js`
Plan renames, especially `.tool-button` → `.tool` and `tool-button--help` → `tool is-help`.

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_tool-rail.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.tool-rail {
  background: $bg-chrome;
  border-right: 1px solid $border;
  padding: $space-2 $space-2;
  width: $w-tool-rail;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

// 2-column grid of tool cells (the "toolbar going to two columns" change).
.tool-rail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-1;
  align-content: start;
}

.tool {
  @include icon-button;
  width: 28px;
  height: 26px;
  color: $fg;
  position: relative;

  &.is-active {
    background: $accent;
    color: #fff;

    &::after {
      content: '';
      position: absolute;
      right: 1px;
      bottom: 1px;
      width: 0; height: 0;
      border-left: 3px solid transparent;
      border-top: 3px solid rgba(255, 255, 255, 0.8);
    }
  }
}

.tool-rail-sep {
  grid-column: 1 / -1;
  height: 1px;
  background: $border;
  margin: $space-2 $space-2 - 1px;
}

// Foreground/background color swatches — span both columns, center.
.tool-palette {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-2 0;
}

.tool-palette-label { @include visually-hidden; }

.tool-color-stack {
  position: relative;
  width: 26px;
  height: 26px;
}

.tool-color {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1px solid $fg-3;
  cursor: pointer;
  input[type="color"] { @include visually-hidden; }

  &.is-front { top: 0;   left: 0;   background: var(--fg-swatch, #fff); }
  &.is-back  { bottom: 0; right: 0; background: var(--bg-swatch, #222); }
}

.tool-rail-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-top: $space-3;
}

.tool-rail-help { position: relative; }

.tool-rail-help-popover {
  position: absolute;
  left: calc(100% + #{$space-3});
  bottom: 0;
  min-width: 240px;
  background: $bg-chrome;
  border: 1px solid $border;
  border-radius: $radius-md;
  box-shadow: $shadow-menu;
  padding: $space-4;
  color: $fg;
  font-size: $fs-xs;
  z-index: 30;
  &[hidden], &:not([data-open]) { display: none; }
}

.tool-rail-help-title { font-weight: $fw-bold; display: block; margin-bottom: $space-2; }
.tool-rail-help-note { color: $fg-2; margin-bottom: $space-3; }
.tool-rail-help-shortcuts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-1 $space-3;
  strong { color: $fg; font-weight: $fw-bold; }
}
```

- [ ] **Step 4: Rename HTML classes**

Apply across the `<aside class="tools">` block:

| Old | New |
|---|---|
| `class="tools"` | `class="tool-rail"` |
| `class="tools__rail"` | `class="tool-rail-grid"` |
| `class="tools__palette"` | `class="tool-palette"` |
| `class="tools__palette-label"` | `class="tool-palette-label"` |
| `class="tools__footer"` | `class="tool-rail-footer"` |
| `class="tools__help"` | `class="tool-rail-help"` |
| `class="tools__help-popover"` | `class="tool-rail-help-popover"` |
| `class="tools__help-title"` | `class="tool-rail-help-title"` |
| `class="tools__help-note"` | `class="tool-rail-help-note"` |
| `class="tools__help-shortcuts"` | `class="tool-rail-help-shortcuts"` |
| `class="tool-button"` | `class="tool"` |
| `class="tool-button is-active"` | `class="tool is-active"` |
| `class="tool-button tool-button--help"` | `class="tool is-help"` |
| `class="tool-color tool-color--back"` | `class="tool-color is-back"` |
| `class="tool-color tool-color--front"` | `class="tool-color is-front"` |

For each `<svg class="tool-button__icon">…</svg>` block, replace with `<i data-lucide="NAME" class="icon icon-md"></i>` using the Lucide names from the Task 17 audit. Example:

```html
<!-- before -->
<button class="tool-button" data-tool="brush" type="button" title="Brush (B)" aria-label="Brush (B)">
  <svg class="tool-button__icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>
</button>

<!-- after -->
<button class="tool" data-tool="brush" type="button" title="Brush (B)" aria-label="Brush (B)">
  <i data-lucide="brush" class="icon icon-md"></i>
</button>
```

Keep all `data-tool`, `title`, and `aria-label` attributes verbatim.

Also add tool-group separators (`.tool-rail-sep`) between logical groups to match the reference (pointer/selection tools, vector tools, brush/fill tools, color, navigation). Place a `<div class="tool-rail-sep" aria-hidden="true"></div>` inside `.tool-rail-grid` where the reference shows `rail-sep`.

- [ ] **Step 5: Update `app.js`**

Key renames:
- `.tool-button` → `.tool` (the active-tool toggle and click handlers)
- `.tool-button.is-active` selector stays functionally equivalent as `.tool.is-active`
- Any popover show/hide logic using class `tools__help-popover` etc. updates to new names.

Run: `grep -n "tool-button" web/app.js` after edits. Expected: zero matches.

- [ ] **Step 6: Delete legacy rules**

Delete `.tools*`, `.tool-button*`, `.tool-color*` rules from `_legacy.scss`.

- [ ] **Step 7: Compile + verify**

Run: `bun run styles:build`. Reload app (open an image to enter the editor). Expected:
- Tool rail is 66px wide with a 2-column grid.
- All tool buttons render Lucide icons.
- Clicking a tool activates it (blue background), tool-option bar updates.
- Help button opens its popover.
- Foreground/background color swatches still open native color pickers on click.

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_tool-rail.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(ui): migrate tool rail to 2-column grid with lucide icons"
```

---

### Task 24: Migrate `canvas`

**Files:**
- Modify: `web/styles/components/_canvas.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (`<section class="workspace"> <div id="stage" class="workspace__stage">` region)

Current classes: `.workspace`, `.workspace__stage`, `.workspace__toolbar` (migrated in Task 21), `canvas#viewport`, `.text-editor`.

New classes: `.workspace`, `.workspace-stage`, `canvas#viewport` (id unchanged), `.text-editor`.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE '(\.workspace\b|\.workspace__stage|#viewport|\.text-editor\b)' web/styles/_legacy.scss`

- [ ] **Step 2: Check app.js**

Run: `grep -nE '(workspace__|\.workspace-stage|\.workspace\b)' web/app.js`

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_canvas.scss` with:

```scss
@use '../tokens' as *;

.workspace {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: $bg-app;
  position: relative;
}

.workspace-stage {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-app;

  &:focus { outline: none; }
}

#viewport {
  display: block;
  max-width: 100%;
  max-height: 100%;
  background: #000;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  image-rendering: pixelated;
}

.text-editor {
  position: absolute;
  background: transparent;
  border: 1px dashed $accent;
  color: $fg;
  padding: $space-2;
  resize: none;
  &[hidden] { display: none; }
}
```

- [ ] **Step 4: Rename HTML**

In `web/index.html`, change `class="workspace__stage"` → `class="workspace-stage"` on the `<div id="stage">` element.

- [ ] **Step 5: Update app.js**

Apply rename `workspace__stage` → `workspace-stage` wherever it appears.

- [ ] **Step 6: Delete legacy rules**

Delete the rules identified in Step 1 from `_legacy.scss`.

- [ ] **Step 7: Compile + verify**

Run: `bun run styles:build`. Reload. Expected:
- Canvas area fills the middle column between tool rail and inspector.
- Image opens, pans (H), zooms (+/-), text tool's editor appears on click.

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_canvas.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate canvas/workspace styles to component partial"
```

---

### Task 25: Migrate `contextual-bar`

**Files:**
- Modify: `web/styles/components/_contextual-bar.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (`<div id="contextual-bar" class="contextual-bar">` block, approx lines 566–652)
- Possibly: `web/app.js`

Current classes: `.contextual-bar`, `.contextual-bar__header`, `.contextual-bar__handle`, `.contextual-bar__header-copy`, `.contextual-bar__header-actions`, `.contextual-bar__header-button`, `.contextual-bar__section`, `.contextual-bar__field`, `.contextual-bar__field--mini`, `.contextual-bar__field--range`, `.contextual-bar__field--wide`, `.contextual-bar__field--swatch`, `.contextual-bar__chip`.

New classes: `.contextual-bar`, `.contextual-bar-header`, `.contextual-bar-handle`, `.contextual-bar-header-copy`, `.contextual-bar-header-actions`, `.contextual-bar-header-button`, `.contextual-bar-section`, `.contextual-bar-field`, `.contextual-bar-field.is-mini`, `.contextual-bar-field.is-range`, `.contextual-bar-field.is-wide`, `.contextual-bar-field.is-swatch`, `.contextual-bar-chip`.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE 'contextual-bar' web/styles/_legacy.scss`

- [ ] **Step 2: Check app.js**

Run: `grep -nE 'contextual-bar__' web/app.js`

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_contextual-bar.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.contextual-bar {
  position: absolute;
  bottom: $space-7;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  background: $bg-chrome;
  border: 1px solid $border;
  border-radius: $radius-md;
  box-shadow: $shadow-float;
  padding: $space-2 $space-3;
  max-width: calc(100% - #{$space-8});

  &[hidden] { display: none; }
}

.contextual-bar-header {
  display: flex;
  align-items: center;
  gap: $space-3;
  min-height: 22px;
}

.contextual-bar-handle {
  @include button-reset;
  color: $fg-3;
  cursor: grab;
  display: flex;
  &:active { cursor: grabbing; }
}

.contextual-bar-header-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  strong { color: $fg; font-weight: $fw-bold; font-size: $fs-sm; }
  span { color: $fg-2; font-size: $fs-xs; }
}

.contextual-bar-header-actions {
  margin-left: auto;
  display: flex;
  gap: $space-1;
}

.contextual-bar-header-button {
  @include button-reset;
  padding: $space-1 $space-3;
  color: $fg-2;
  border-radius: $radius-sm;
  font-size: $fs-xs;
  &:hover { color: $fg; background: $bg-hover; }
}

.contextual-bar-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-3;
  padding-top: $space-2;

  &[hidden] { display: none; }

  button {
    @include button-reset;
    padding: 0 $space-4;
    height: $h-control-md;
    background: $bg-panel-2;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    font-size: $fs-sm;
    &:hover { background: $bg-hover; }
  }
}

.contextual-bar-field {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  color: $fg-2;
  font-size: $fs-xs;

  input[type="number"], input[type="text"], select {
    height: $h-control-sm;
    width: 60px;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    padding: 0 $space-3;
    font: inherit;
    outline: 0;
    &:focus { border-color: $accent; }
  }
  input[type="range"] { width: 90px; accent-color: $accent; }
  input[type="color"] { width: 24px; height: $h-control-sm; padding: 0; border: 1px solid $border; background: transparent; }

  &.is-mini input { width: 50px; }
  &.is-wide select { width: 120px; }
  &.is-range { gap: $space-2; }
  &.is-swatch { gap: $space-2; }
}

.contextual-bar-chip {
  display: inline-flex;
  align-items: center;
  padding: 0 $space-3;
  height: $h-control-sm;
  background: $bg-input;
  border: 1px solid $border;
  border-radius: $radius-sm;
  color: $fg;
  font-size: $fs-xs;
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 4: Rename HTML**

Apply `__` → `-` and `--modifier` → `is-modifier` throughout the block. The drag handle's inner text `::` becomes an icon stub:

```html
<button id="contextual-bar-handle" class="contextual-bar-handle" type="button" aria-label="Drag contextual task bar" title="Drag to pin this bar">
  <i data-lucide="grip-vertical" class="icon icon-sm"></i>
</button>
```

- [ ] **Step 5: Update app.js**

Apply the class renames from Step 2.

When any `data-contextual-section` panel toggles visible, call `window.renderIcons(contextualBarEl)` to render any icon stubs that were in `[hidden]` subtrees (Lucide only processes visible `<i>` elements? It processes all, but calling renderIcons after visibility change is cheap insurance.).

- [ ] **Step 6: Delete legacy rules**

Delete the contextual-bar rules from `_legacy.scss`.

- [ ] **Step 7: Compile + verify**

Run: `bun run styles:build`. Reload. Open an image, add a layer, select it. Expected:
- Floating bar appears above the canvas, centered, with shadow.
- Drag handle icon renders.
- Pin/Hide buttons work.
- Section switches correctly when selecting different layer types (raster vs text vs vector).

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_contextual-bar.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate contextual-bar to component partial"
```

---

### Task 26: Migrate `inspector` shell

**Files:**
- Modify: `web/styles/components/_inspector.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (`<aside class="inspector">` block, approx lines 656–)

Scope: the outer inspector container, its tab-row (if present) or panel header, and the dock-panel chrome. Inner collapsible sections are Task 27.

Current classes: `.inspector`, `.inspector__panels`, `.dock-panel`, `.dock-panel__header`, `.dock-panel__title`, `.dock-panel__meta`.

New classes: `.inspector`, `.inspector-panels`, `.dock-panel`, `.dock-panel-header`, `.dock-panel-title`, `.dock-panel-meta`.

Plus: introduce an `.inspector-tabs` row at the top of `.inspector` to show "Properties" / "Adjustments" as tabs (per the reference design). Two tabs map to the two existing `.dock-panel` elements (`data-inspector-panel="properties"` and `data-inspector-panel="contextual"`). The tab-click behavior is new in `app.js` — show/hide panels based on selected tab.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE '(\.inspector|dock-panel)' web/styles/_legacy.scss`

- [ ] **Step 2: Write the partial**

Replace `web/styles/components/_inspector.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.inspector {
  background: $bg-chrome;
  border-left: 1px solid $border;
  display: flex;
  flex-direction: column;
  width: $w-inspector;
  min-height: 0;
  overflow: hidden;
}

.inspector-tabs {
  display: flex;
  gap: 0;
  background: $bg-app;
  border-bottom: 1px solid $border;
  padding: 0;
}

.inspector-tab {
  @include button-reset;
  padding: $space-3 + $space-1 $space-6;   // 7px 12px
  font-weight: $fw-normal;
  font-size: $fs-sm;
  color: $fg-2;
  border-right: 1px solid $border;
  background: $bg-app;
  line-height: 1;

  &.is-active {
    color: $fg;
    background: $bg-chrome;
    border-bottom: 1px solid $bg-chrome;
    margin-bottom: -1px;
  }
  &:hover:not(.is-active) { color: $fg; }
}

.inspector-tabs-spacer {
  flex: 1;
  border-bottom: 1px solid $border;
  background: $bg-app;
}

.inspector-tabs-more {
  padding: $space-2 $space-4;
  color: $fg-2;
  background: $bg-app;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover { color: $fg; }
}

.inspector-panels {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.dock-panel {
  display: flex;
  flex-direction: column;

  &[hidden] { display: none; }
}

.dock-panel-header {
  display: flex;
  align-items: center;
  padding: $space-2 $space-5 $space-2 $space-4;
  border-bottom: 1px solid $border;
  background: $bg-chrome;
  font-size: $fs-sm;
}

.dock-panel-title {
  font-weight: $fw-bold;
  color: $fg;
}

.dock-panel-meta {
  margin-left: auto;
  color: $fg-2;
  font-size: $fs-xs;
}
```

- [ ] **Step 3: Rename HTML + insert tabs**

In `<aside class="inspector">`, insert an `.inspector-tabs` row as the first child:

```html
<aside class="inspector">
  <div class="inspector-tabs" role="tablist">
    <button class="inspector-tab is-active" type="button" data-inspector-tab="properties" role="tab" aria-selected="true">Properties</button>
    <button class="inspector-tab" type="button" data-inspector-tab="contextual" role="tab" aria-selected="false">Adjustments</button>
    <div class="inspector-tabs-spacer" aria-hidden="true"></div>
    <button class="inspector-tabs-more" type="button" aria-label="More">
      <i data-lucide="chevron-down" class="icon icon-sm"></i>
    </button>
  </div>
  <div class="inspector-panels">
    <!-- existing two .dock-panel elements here -->
  </div>
</aside>
```

Wrap the existing two `<div class="dock-panel" data-inspector-panel="…">` elements in the `.inspector-panels` container (if not already).

Apply class renames:
| Old | New |
|---|---|
| `class="inspector__panels"` | `class="inspector-panels"` |
| `class="dock-panel__header"` | `class="dock-panel-header"` |
| `class="dock-panel__title"` | `class="dock-panel-title"` |
| `class="dock-panel__meta"` | `class="dock-panel-meta"` |

- [ ] **Step 4: Update app.js for tab behavior**

Add at the top of whichever section of `app.js` sets up UI event bindings (look for `DOMContentLoaded` or the init function). Add this inspector-tab behavior:

```js
// Inspector tabs — show/hide dock panels based on selected tab.
document.querySelectorAll('.inspector-tab').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    const target = tabBtn.dataset.inspectorTab;
    document.querySelectorAll('.inspector-tab').forEach((b) => {
      const on = b === tabBtn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.dock-panel').forEach((p) => {
      p.hidden = p.dataset.inspectorPanel !== target;
    });
  });
});
// Initialize: show the "properties" panel, hide the others.
document.querySelectorAll('.dock-panel').forEach((p) => {
  p.hidden = p.dataset.inspectorPanel !== 'properties';
});
```

If a similar tab mechanism already exists in `app.js` (unlikely given the Window menu's panel-pinning model), extend rather than duplicate.

- [ ] **Step 5: Delete legacy rules**

Delete `.inspector`, `.inspector__panels`, `.dock-panel*` from `_legacy.scss`.

- [ ] **Step 6: Compile + verify**

Run: `bun run styles:build`. Reload. Expected:
- Inspector is 268px wide on the right.
- "Properties" and "Adjustments" tabs at top. Clicking toggles which panel is visible.
- Panel chrome renders correctly.

- [ ] **Step 7: Commit**

```bash
git add web/styles/components/_inspector.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(ui): migrate inspector shell + add Properties/Adjustments tabs"
```

---

### Task 27: Migrate `sections` (collapsible inspector sections)

**Files:**
- Modify: `web/styles/components/_sections.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (all `<section class="panel-section">` elements inside the inspector)

Current classes: `.panel-section`, `.panel-section__toggle`, `.panel-section__toggle-title`, `.panel-section__toggle-copy`, `.panel-section__toggle-meta`, `.panel-section__toggle-icon`.

New classes: `.panel-section`, `.panel-section-toggle`, `.panel-section-toggle-title`, `.panel-section-toggle-copy`, `.panel-section-toggle-meta`, `.panel-section-toggle-icon`.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE 'panel-section' web/styles/_legacy.scss`

- [ ] **Step 2: Write the partial**

Replace `web/styles/components/_sections.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.panel-section {
  border-bottom: 1px solid $border;
  display: flex;
  flex-direction: column;
}

.panel-section-toggle {
  @include button-reset;
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-5;
  background: $bg-chrome;
  cursor: pointer;
  text-align: left;
  &:hover { background: $bg-panel-2; }
}

.panel-section-toggle-title {
  font-weight: $fw-bold;
  font-size: $fs-sm;
  color: $fg;
}

.panel-section-toggle-copy {
  display: inline-flex;
  flex-direction: column;
  gap: $space-1;
}

.panel-section-toggle-meta {
  color: $fg-2;
  font-size: $fs-xs;
  font-weight: $fw-normal;
}

.panel-section-toggle-icon {
  margin-left: auto;
  display: inline-flex;
  width: $fs-sm;
  height: $fs-sm;
  color: $fg-2;
  transition: transform 100ms ease;

  // When the section is collapsed, the icon rotates -90deg (chevron points right).
  .panel-section[aria-collapsed="true"] & { transform: rotate(-90deg); }
}

// Section body — generic container under the toggle.
.panel-section > .stats-grid,
.panel-section > .panel-actions,
.panel-section > .transform-grid,
.panel-section > .field,
.panel-section > .mini-field,
.panel-section-body {
  padding: $space-3 $space-5;
  background: $bg-chrome;

  .panel-section[aria-collapsed="true"] & { display: none; }
}
```

Inject a `<i data-lucide="chevron-down" class="icon icon-sm">` inside every `.panel-section-toggle-icon` span that is currently empty. Example:

```html
<button class="panel-section-toggle" type="button" data-inspector-toggle="transform" aria-expanded="true">
  <span class="panel-section-toggle-title">Transform</span>
  <span class="panel-section-toggle-icon" aria-hidden="true"><i data-lucide="chevron-down" class="icon icon-sm"></i></span>
</button>
```

- [ ] **Step 3: Rename HTML**

Apply `__` → `-` across every `<section class="panel-section">` in the inspector block.

- [ ] **Step 4: Check app.js**

Run: `grep -nE 'panel-section__' web/app.js`.
Apply any renames found.

- [ ] **Step 5: Delete legacy rules**

Delete `.panel-section*` from `_legacy.scss`.

- [ ] **Step 6: Compile + verify**

Run: `bun run styles:build`. Reload. Expected:
- Document, Transform, Brush, Adjustment section headers all render with a chevron icon.
- Clicking the header collapses/expands the body (the existing `aria-expanded` + `aria-collapsed` logic in `app.js` should still toggle).

- [ ] **Step 7: Commit**

```bash
git add web/styles/components/_sections.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate collapsible inspector sections to partial"
```

---

### Task 28: Migrate `layers`

**Files:**
- Modify: `web/styles/components/_layers.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` — find the layers panel markup (likely `<div class="layers">` or similar)
- Modify: `web/app.js` — the layer-render code injects new layer rows on every layer change; add `renderIcons()` call after render

- [ ] **Step 1: Locate layers markup**

Run: `grep -nE '\.layers|layer-row|layers-head|layers-foot' web/index.html web/app.js`
Identify:
- The static layers panel container in `index.html` (heading, search, opacity/lock bars, empty list container, footer with +/trash icons).
- The `renderLayers()` (or equivalent) function in `app.js`.

- [ ] **Step 2: Find legacy rules**

Run: `grep -nE '\.layers' web/styles/_legacy.scss`

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_layers.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.layers-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-3 $space-5;
  border-bottom: 1px solid $border;
  background: $bg-chrome;

  .layers-head-title { font-weight: $fw-bold; font-size: $fs-sm; color: $fg; }
  .layers-head-more { color: $fg-2; cursor: pointer; display: flex;
    &:hover { color: $fg; } }
}

.layers-tools {
  display: flex;
  gap: $space-3;
  padding: $space-2 + 1px $space-5;
  border-bottom: 1px solid $border;
  background: $bg-chrome;
  align-items: center;

  .layers-search {
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    padding: $space-1 $space-3;
    color: $fg-2;
    font-size: $fs-xs;
    flex: 1;
    height: $h-control-sm;
    display: flex;
    align-items: center;
    gap: $space-2;
    input {
      background: transparent;
      border: 0;
      color: $fg;
      font: inherit;
      flex: 1;
      outline: 0;
      &::placeholder { color: $fg-3; }
    }
  }

  .layers-tools-button {
    @include icon-button(20px);
    color: $fg-2;
    &:hover { color: $fg; }
  }
}

.layers-opacity-bar,
.layers-lock-bar {
  display: flex;
  align-items: center;
  padding: $space-2 $space-5;
  gap: $space-3;
  background: $bg-chrome;
  border-bottom: 1px solid $border;
  font-size: $fs-sm;
  color: $fg-2;

  select, input[type="range"] {
    height: $h-control-sm;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    padding: 0 $space-3;
    font: inherit;
    outline: 0;
  }

  .layers-lock-button {
    @include icon-button(18px);
    color: $fg-2;
    &.is-on { background: $bg-active; color: $fg; }
  }

  .layers-value { color: $fg; font-weight: $fw-bold; font-variant-numeric: tabular-nums; }
  .layers-lock-spacer { flex: 1; }
}

.layers {
  flex: 1;
  overflow-y: auto;
  background: $bg-panel;
  min-height: 0;
}

.layer {
  display: grid;
  grid-template-columns: 20px 30px 1fr 16px;
  gap: $space-3 + 1px;
  padding: $space-2 $space-5;
  border-bottom: 1px solid $border;
  cursor: pointer;
  align-items: center;
  font-size: $fs-sm;

  &:hover { background: $bg-hover; }
  &.is-active { background: $bg-active; .layer-name { color: #fff; } }

  .layer-eye {
    color: $fg;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &.is-off { color: $fg-3; }
  }
  .layer-thumb {
    width: 28px;
    height: 22px;
    background-size: cover;
    background-position: center;
    border: 1px solid $border;
    background-color: $bg-panel-2;
  }
  .layer-name {
    color: $fg;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: $fw-normal;
  }
  .layer-lock {
    color: $fg-3;
    display: flex;
    justify-content: center;
  }
}

.layers-foot {
  border-top: 1px solid $border;
  background: $bg-chrome;
  padding: $space-1 + 1px $space-2 + 1px;
  display: flex;
  justify-content: flex-end;
  gap: 0;

  .layers-foot-button {
    @include icon-button(24px);
    height: 22px;
    color: $fg;
  }
}
```

- [ ] **Step 4: Rewrite static HTML for layers panel**

Based on what's in the current `index.html`, the layers panel likely lives at the bottom of `<aside class="inspector">` or as a separate panel. Keep its position in the DOM and IDs unchanged. Rename classes per the convention:

| Old | New |
|---|---|
| `layers__head` / `layers-head__…` | `layers-head`, `layers-head-title`, `layers-head-more` |
| `layers__tools` | `layers-tools` |
| `layers__opacity` | `layers-opacity-bar` |
| `layers__lock` | `layers-lock-bar` |
| `layer__eye` | `layer-eye` |
| `layer__thumb` | `layer-thumb` |
| `layer__name` | `layer-name` |
| `layer__lock` | `layer-lock` |
| `layer--active` / `layer.is-active` stays `.layer.is-active` | |
| `layers__foot` | `layers-foot` |

Replace each `<svg>` icon used in the head/tools/lock bars/foot with `<i data-lucide="…" class="icon icon-sm">` per Task 17.

- [ ] **Step 5: Update `app.js`**

In `renderLayers()` (or equivalent):
- Update class names to the new convention.
- Replace any `<svg>` inline renders with `<i data-lucide="…">` stubs.
- After setting `container.innerHTML = …`, call `window.renderIcons(container)`.

- [ ] **Step 6: Delete legacy rules**

Delete `.layers*` from `_legacy.scss`.

- [ ] **Step 7: Compile + verify**

Run: `bun run styles:build`. Reload app. Expected:
- Layers panel renders with head, search, opacity/lock bars, list, footer.
- Adding a layer appends a row with eye + thumb + name + lock icons rendered.
- Toggling visibility, locking, reordering still works.
- Clicking a layer activates it (bg-active).

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_layers.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(ui): migrate layers panel to component partial with lucide icons"
```

---

### Task 29: Migrate `forms` (generic form controls)

**Files:**
- Modify: `web/styles/components/_forms.scss`
- Modify: `web/styles/_legacy.scss`
- Possibly: `web/index.html` + `web/app.js` if any renamed classes

Scope: generic button, input, select, checkbox styles that show up across the app — `.field`, `.mini-field`, `.stats-grid`, `.panel-actions`, `.panel-actions--triple`, plain `<button>`s inside panels, etc.

Current classes: `.field`, `.mini-field`, `.stats-grid`, `.panel-actions`, `.panel-actions--triple`.

New classes: `.field`, `.mini-field` (kept flat; no `__`), `.stats-grid`, `.panel-actions`, `.panel-actions.is-triple`.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE '(\.field\b|\.mini-field|\.stats-grid|\.panel-actions)' web/styles/_legacy.scss`

- [ ] **Step 2: Write the partial**

Replace `web/styles/components/_forms.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

// ── Base button (inspector actions, dialogs) ────────────────────────────────
.panel-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-2;
  padding: $space-3 $space-5;

  &.is-triple { grid-template-columns: repeat(3, 1fr); }

  button {
    @include button-reset;
    padding: 0 $space-4;
    height: $h-control-md;
    background: $bg-panel-2;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    font-size: $fs-sm;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    &:hover { background: $bg-hover; }
    &[disabled] { opacity: 0.4; cursor: not-allowed; }
  }
}

// ── Form fields (labeled inputs in the inspector) ──────────────────────────
.field {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: $space-3;
  row-gap: $space-1;
  padding: $space-3 $space-5;
  font-size: $fs-sm;

  > span:first-child {
    color: $fg-2;
    grid-column: 1 / -1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: $fs-xs;
    font-weight: $fw-bold;
  }

  input, select {
    width: 100%;
    height: $h-control-sm;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    padding: 0 $space-3;
    font: inherit;
    outline: 0;
    &:focus { border-color: $accent; }
  }
  input[type="range"] {
    width: 100%;
    height: $h-control-sm;
    accent-color: $accent;
    background: transparent;
    padding: 0;
  }
  input[type="color"] {
    width: $h-control-md;
    height: $h-control-md;
    padding: 0;
  }
  strong {
    color: $fg;
    font-weight: $fw-bold;
    font-variant-numeric: tabular-nums;
    grid-column: 2 / 3;
    font-size: $fs-xs;
  }
}

// ── Mini fields (small X/Y/W/H style inputs in inspector Transform section) ──
.mini-field {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $fs-sm;
  color: $fg-2;

  input {
    height: $h-control-sm;
    width: 52px;
    background: $bg-input;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    padding: 0 $space-3;
    font: inherit;
    font-variant-numeric: tabular-nums;
    outline: 0;
    &:focus { border-color: $accent; }
  }
}

// Stats grid (e.g., inspector Document section with Width/Height/Zoom/Selection).
.stats-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: $space-4;
  row-gap: $space-2;
  padding: $space-3 $space-5;
  font-size: $fs-xs;
  color: $fg-2;
  strong {
    color: $fg;
    font-weight: $fw-bold;
    font-variant-numeric: tabular-nums;
    justify-self: end;
  }
}

// Transform grid (5 inputs in a row with labels).
.transform-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $space-2;
  padding: $space-3 $space-5;
}
```

- [ ] **Step 3: Rename HTML**

| Old | New |
|---|---|
| `class="panel-actions panel-actions--triple"` | `class="panel-actions is-triple"` |

All other classes (`.field`, `.mini-field`, `.stats-grid`, `.transform-grid`, `.panel-actions`) stay the same — they have no `__` or `--`.

- [ ] **Step 4: Check app.js**

Run: `grep -nE 'panel-actions--triple' web/app.js`
Apply any renames found.

- [ ] **Step 5: Delete legacy rules**

Delete the matched rules from `_legacy.scss`.

- [ ] **Step 6: Compile + verify**

Run: `bun run styles:build`. Reload. Expected:
- Inspector fields render with correct spacing, typography, token colors.
- All buttons inside inspector panels look consistent.
- Input focus shows accent-colored border.
- Range sliders use accent color.

- [ ] **Step 7: Commit**

```bash
git add web/styles/components/_forms.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate generic form controls to forms partial"
```

---

### Task 30: Migrate `home-screen`

**Files:**
- Modify: `web/styles/components/_home-screen.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (`<section id="home-screen" class="home-screen">` block)

Current classes: `.home-screen`, `.home-screen__sidebar`, `.home-screen__primary`, `.home-screen__link`, `.home-screen__nav`, `.home-screen__label`, `.home-screen__nav-item`, `.home-screen__hint`, `.home-screen__content`, `.home-hero`, `.home-hero__eyebrow`, `.home-hero__title`, `.home-hero__text`, `.home-hero__actions`, `.home-panel`, `.home-panel__header`, `.home-panel__eyebrow`, `.home-panel__title`, `.home-panel__status`, `.preset-grid`.

New classes: all `__` → `-`, and `--state` → `.is-state`. Example: `home-screen-sidebar`, `home-screen-primary`, `home-screen-nav-item.is-active`, `home-hero-eyebrow`, `home-panel-header`, etc.

- [ ] **Step 1: Find legacy rules**

Run: `grep -nE '(home-screen|home-hero|home-panel|preset-grid)' web/styles/_legacy.scss`

- [ ] **Step 2: Write the partial**

Replace `web/styles/components/_home-screen.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.home-screen {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: $space-8;
  padding: $space-8;
  background: $bg-app;

  &[hidden] { display: none; }
}

.home-screen-sidebar {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-6;
  background: $bg-chrome;
  border: 1px solid $border;
  border-radius: $radius-lg;
}

.home-screen-primary {
  @include button-reset;
  padding: $space-4 $space-6;
  background: $accent;
  color: #fff;
  border-radius: $radius-sm;
  font-size: $fs-base;
  font-weight: $fw-bold;
  &:hover { background: $accent-hover; }
}

.home-screen-link {
  @include button-reset;
  padding: $space-3 $space-4;
  background: $bg-panel-2;
  color: $fg;
  border: 1px solid $border;
  border-radius: $radius-sm;
  font-size: $fs-sm;
  text-align: left;
  &:hover { background: $bg-hover; }
}

.home-screen-nav {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  margin-top: $space-5;
}

.home-screen-label {
  color: $fg-3;
  font-size: $fs-xs;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: $fw-bold;
  margin: 0 0 $space-2;
}

.home-screen-nav-item {
  @include button-reset;
  text-align: left;
  padding: $space-2 $space-3;
  border-radius: $radius-sm;
  color: $fg-2;
  font-size: $fs-sm;

  &:hover:not([disabled]) { background: $bg-hover; color: $fg; }
  &.is-active { background: $bg-active; color: $fg; }
  &[disabled] { opacity: 0.4; cursor: not-allowed; }
}

.home-screen-hint {
  margin-top: auto;
  padding: $space-4;
  background: $bg-panel;
  border-radius: $radius-sm;
  color: $fg-2;
  font-size: $fs-xs;
  line-height: 1.5;
  p { margin: 0; }
}

.home-screen-content {
  display: flex;
  flex-direction: column;
  gap: $space-8;
  min-width: 0;
}

.home-hero {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}
.home-hero-eyebrow {
  color: $accent;
  font-weight: $fw-bold;
  font-size: $fs-xs;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
}
.home-hero-title {
  color: $fg;
  font-size: 22px;
  font-weight: $fw-bold;
  margin: 0;
  line-height: 1.2;
}
.home-hero-text {
  color: $fg-2;
  font-size: $fs-base;
  margin: 0;
  max-width: 56ch;
}
.home-hero-actions {
  display: flex;
  gap: $space-3;
  margin-top: $space-3;

  button {
    @include button-reset;
    padding: $space-3 $space-5;
    border-radius: $radius-sm;
    font-size: $fs-sm;
    background: $bg-panel-2;
    color: $fg;
    border: 1px solid $border;
    &:hover { background: $bg-hover; }

    &:first-child {
      background: $accent;
      color: #fff;
      border-color: $accent;
      &:hover { background: $accent-hover; border-color: $accent-hover; }
    }
  }
}

.home-panel {
  background: $bg-chrome;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-4;
}
.home-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $space-4;
}
.home-panel-eyebrow {
  color: $accent;
  font-weight: $fw-bold;
  font-size: $fs-xs;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 $space-1;
}
.home-panel-title {
  color: $fg;
  font-size: $fs-lg;
  font-weight: $fw-bold;
  margin: 0;
}
.home-panel-status {
  color: $fg-2;
  font-size: $fs-xs;
  margin: 0;
  max-width: 30ch;
  text-align: right;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: $space-3;

  button, .preset-card {
    @include button-reset;
    padding: $space-4;
    background: $bg-panel-2;
    border: 1px solid $border;
    border-radius: $radius-md;
    color: $fg;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: $space-1;
    font-size: $fs-sm;
    &:hover { background: $bg-hover; }
    strong { font-weight: $fw-bold; }
    span { color: $fg-2; font-size: $fs-xs; }
  }
}
```

- [ ] **Step 3: Rename HTML**

In the entire `<section id="home-screen">` block, replace every `home-screen__X` → `home-screen-X`, every `home-hero__X` → `home-hero-X`, every `home-panel__X` → `home-panel-X`, and `home-screen__nav-item is-active` → `home-screen-nav-item is-active`.

- [ ] **Step 4: Check app.js**

Run: `grep -nE 'home-screen__|home-hero__|home-panel__' web/app.js`
Apply renames.

- [ ] **Step 5: Delete legacy rules**

Delete the matched rules from `_legacy.scss`.

- [ ] **Step 6: Compile + verify**

Run: `bun run styles:build`. Reload app (home screen shows on first load). Expected:
- Home screen has new colors and typography.
- Sidebar on left with primary + secondary actions, nav list.
- Hero and presets panel on right.
- Clicking "New file" opens the new-document dialog (unchanged behavior).

- [ ] **Step 7: Commit**

```bash
git add web/styles/components/_home-screen.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate home screen to component partial"
```

---

### Task 31: Migrate `dialogs`

**Files:**
- Modify: `web/styles/components/_dialogs.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/index.html` (dialog elements — likely a `<dialog>` or `.modal` container)
- Modify: `web/app.js` if any selectors renamed

- [ ] **Step 1: Find dialog markup**

Run: `grep -nE '(dialog|modal|canvas-size|new-doc-dialog|export-dialog)' web/index.html`
Identify each modal's outer container and inner structure.

- [ ] **Step 2: Find legacy rules**

Run: `grep -nE '(\.modal|\.dialog|dialog-)' web/styles/_legacy.scss`

- [ ] **Step 3: Write the partial**

Replace `web/styles/components/_dialogs.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

// Native <dialog> element styling (if the app uses <dialog>).
dialog {
  background: $bg-chrome;
  color: $fg;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 0;
  box-shadow: $shadow-menu;
  min-width: 360px;
  max-width: 560px;

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
}

// Generic modal container (if the app uses div-based modals).
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  &[hidden] { display: none; }
}

.modal {
  background: $bg-chrome;
  color: $fg;
  border: 1px solid $border;
  border-radius: $radius-lg;
  box-shadow: $shadow-menu;
  min-width: 360px;
  max-width: 560px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-5 $space-6;
  border-bottom: 1px solid $border;
  h2, .modal-title { margin: 0; font-size: $fs-lg; font-weight: $fw-bold; color: $fg; }
}

.modal-close {
  @include icon-button(24px);
  color: $fg-2;
  &:hover { color: $fg; }
}

.modal-body {
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  font-size: $fs-sm;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $space-3;
  padding: $space-5 $space-6;
  border-top: 1px solid $border;

  button {
    @include button-reset;
    padding: 0 $space-5;
    height: $h-control-md + 4px;    // 26px — a touch taller for dialog primary
    background: $bg-panel-2;
    border: 1px solid $border;
    border-radius: $radius-sm;
    color: $fg;
    font-size: $fs-sm;
    &:hover { background: $bg-hover; }

    &.is-primary {
      background: $accent;
      color: #fff;
      border-color: $accent;
      &:hover { background: $accent-hover; border-color: $accent-hover; }
    }
  }
}
```

- [ ] **Step 4: Rename HTML**

For each dialog, rename `__` → `-` and `--modifier` → `.is-modifier` within the dialog's markup. Typical renames:

| Old | New |
|---|---|
| `class="modal__header"` | `class="modal-header"` |
| `class="modal__body"` | `class="modal-body"` |
| `class="modal__footer"` | `class="modal-footer"` |
| `class="modal__close"` | `class="modal-close"` |
| `button--primary` | `is-primary` |

If close buttons use inline `<svg>` "x", swap for `<i data-lucide="x" class="icon">`.

- [ ] **Step 5: Update app.js**

Apply renames; if any dialog content is injected dynamically (e.g., preset list), add `renderIcons(dialogEl)` after insertion.

- [ ] **Step 6: Delete legacy rules**

Delete matched rules from `_legacy.scss`.

- [ ] **Step 7: Compile + verify**

Run: `bun run styles:build`. Reload app. Click "New file" (home screen) — new-document dialog opens. Click "Image → Canvas Size" (menu) — canvas size dialog opens. Expected: both render with new chrome, typography, and spacing; primary action button is accent-blue.

- [ ] **Step 8: Commit**

```bash
git add web/styles/components/_dialogs.scss web/styles/_legacy.scss web/index.html web/app.js
git commit -m "refactor(styles): migrate modal dialogs to component partial"
```

---

### Task 32: Migrate `context-menu`

**Files:**
- Modify: `web/styles/components/_context-menu.scss`
- Modify: `web/styles/_legacy.scss`
- Modify: `web/app.js` (the context-menu render code — which injects the menu DOM on right-click)

- [ ] **Step 1: Locate the context menu**

Run: `grep -nE 'context-menu' web/styles/_legacy.scss web/app.js web/index.html`
Identify the render function and classname conventions.

- [ ] **Step 2: Write the partial**

Replace `web/styles/components/_context-menu.scss` with:

```scss
@use '../tokens' as *;
@use '../mixins' as *;

.context-menu {
  position: fixed;
  min-width: 200px;
  background: $bg-chrome;
  border: 1px solid $border;
  border-radius: $radius-md;
  box-shadow: $shadow-menu;
  padding: $space-1 0;
  color: $fg;
  font-size: $fs-sm;
  z-index: 200;

  &[hidden] { display: none; }
}

.context-menu-item {
  @include button-reset;
  display: flex;
  align-items: center;
  gap: $space-3;
  width: 100%;
  text-align: left;
  padding: $space-2 $space-5;
  color: $fg;
  &:hover:not([disabled]) { background: $bg-hover; }
  &[disabled] { opacity: 0.4; cursor: not-allowed; }

  .context-menu-shortcut {
    margin-left: auto;
    color: $fg-3;
    font-size: $fs-xs;
    font-variant-numeric: tabular-nums;
  }
}

.context-menu-divider {
  height: 1px;
  background: $border;
  margin: $space-1 0;
}
```

- [ ] **Step 3: Rename classes in app.js**

In the context-menu render code:
- `context-menu__item` → `context-menu-item`
- `context-menu__shortcut` → `context-menu-shortcut`
- `context-menu__divider` → `context-menu-divider`
- If icons are injected, use `<i data-lucide="…" class="icon icon-sm">` and call `renderIcons(menuEl)` after insert.

- [ ] **Step 4: Delete legacy rules**

Delete context-menu rules from `_legacy.scss`.

- [ ] **Step 5: Compile + verify**

Run: `bun run styles:build`. Reload, right-click on a layer or on the canvas. Expected: context menu renders with new chrome + shadow, items are hoverable, shortcuts right-aligned and muted.

- [ ] **Step 6: Commit**

```bash
git add web/styles/components/_context-menu.scss web/styles/_legacy.scss web/app.js
git commit -m "refactor(styles): migrate context menu to component partial"
```

---

## Phase 4 — Final sweep

### Task 33: Delete `_legacy.scss`

- [ ] **Step 1: Confirm `_legacy.scss` is empty (aside from banner)**

Run: `grep -vE '^\s*//|^\s*$' web/styles/_legacy.scss | wc -l`
Expected: `0`.

If non-zero, inspect the remaining rules. Either they belong to an already-migrated component (move them into the appropriate partial, delete from legacy, re-compile, re-verify, commit separately) or they're genuine leftovers worth preserving elsewhere.

- [ ] **Step 2: Remove the partial and its `@use` import**

Run:
```bash
rm web/styles/_legacy.scss
```

Edit `web/styles/index.scss` and delete the line `@use 'legacy';`.

- [ ] **Step 3: Compile + verify**

Run: `bun run styles:build`
Expected: succeeds.

Reload the app. Expected: every view (home screen, editor, dialogs, context menu) renders identically to the pre-deletion state.

- [ ] **Step 4: Commit**

```bash
git add web/styles/_legacy.scss web/styles/index.scss
git commit -m "chore(styles): delete transitional _legacy.scss; migration complete"
```

---

### Task 34: Invariant checks

- [ ] **Step 1: No hex values outside `_tokens.scss`**

Run:
```bash
grep -nE '#[0-9A-Fa-f]{3,8}\b' web/styles/**/*.scss 2>/dev/null | grep -v '_tokens.scss'
```
Expected: empty output (other than possibly `rgba(...)` calls with decimal alpha — those are allowed).

If hits exist, replace each with a token. Add a token if one is genuinely missing from the scale.

- [ ] **Step 2: No underscores in class names**

Run:
```bash
grep -nE 'class="[^"]*__[^"]*"' web/index.html
grep -nE '\.[a-zA-Z][a-zA-Z0-9-]*__[a-zA-Z]' web/styles/**/*.scss 2>/dev/null
```
Expected: both empty.

If hits, rename per the flat-kebab convention and commit.

- [ ] **Step 3: No stale references in app.js**

Run:
```bash
grep -nE 'class(List)?\.[a-z]+\(["'"'"'][a-z-]*__' web/app.js
```
Expected: empty.

- [ ] **Step 4: Visual diff pass**

Open `new-design.html` and the running app side-by-side. Walk through:
- Menubar: 24px, correct colors, menu hover states.
- Tabbar: 28px, active tab.
- Options bar: 32px, controls 20–22px tall.
- Tool rail: 66px wide, 2 columns, active-tool blue with corner tab.
- Canvas area: chrome-free, centered.
- Contextual bar: floating, shadowed, icons rendered.
- Inspector: tabs at top, collapsible sections, form controls.
- Layers: head + search + opacity/lock/list + footer, all icons Lucide.
- Status bar: 22px, saved dot + items + right-aligned info.

For any mismatch, fix via token tweak (preferred) or rule adjustment in the owning partial. Commit fixes one at a time.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore(styles): address invariant-sweep findings"
```

---

### Task 35: Smoke test — browser + Tauri

- [ ] **Step 1: Browser mode**

Run:
```bash
bun run dev
```
Open `http://127.0.0.1:4173`.

Walk the golden-path scenarios:
1. Home screen → New file dialog → create 1920×1080 document → editor view appears.
2. Drop an image on the canvas → becomes a new layer.
3. Tool rail: select Brush → draw on canvas.
4. Inspector: change layer opacity via slider → opacity updates.
5. Layers: add new layer, reorder, group, toggle visibility, lock.
6. Edit menu: undo/redo a few times.
7. File menu: Save Project → downloads `.raster`. Open Project → re-opens.
8. Export → PNG download.
9. Right-click a layer → context menu.
10. Switch to second document via tabbar.
11. Close tab.

Every scenario must work without regressions.

- [ ] **Step 2: Tauri mode**

Run:
```bash
bun run tauri:dev
```

Repeat the top 4 scenarios. Verify:
- Native save/open dialogs still fire.
- No 404s or console errors.
- Montserrat fonts load from the packaged resources.

- [ ] **Step 3: Update README**

Open `README.md`. After the "Run the frontend" section, add:

```markdown
## Styles

CSS is compiled from Sass partials under `web/styles/` to `web/styles.css`.

- `bun run styles:build` — one-shot compile (runs on `postinstall` automatically).
- `bun run styles:watch` — watch mode.
- `bun run dev` — server + styles watcher in one command.

Design tokens live in `web/styles/_tokens.scss`. All colors, spacing, type sizes, and layout dimensions are tokenized. Component files are under `web/styles/components/` — one file per UI region.
```

- [ ] **Step 4: Commit README update**

```bash
git add README.md
git commit -m "docs: document sass build in README"
```

- [ ] **Step 5: Final tag (optional)**

```bash
git log --oneline | head -40
```

Inspect the migration commit chain. Optionally tag the completion:

```bash
git tag design-refresh-complete
```

Design refresh is complete.

---

## Self-review findings

**Spec coverage check:**
- Modular Sass tree under `web/styles/` with all 14 component partials → covered by Tasks 7, 19–32.
- Hybrid Sass var + CSS custom property tokens → Task 8.
- Montserrat self-hosted → Tasks 1, 3, 9.
- Lucide self-hosted + `renderIcons()` helper → Tasks 1, 4, 5, 6.
- Flat kebab class convention with `.is-*` states → enforced in every component migration task.
- Tool rail 2-column layout → Task 23.
- Options bar 32px → Task 21.
- Status bar extracted to bottom row → Task 22.
- `_legacy.scss` transitional bucket → Tasks 13, 33.
- `.gitignore` + `postinstall` build hook → Tasks 2, 15.
- Tauri compatibility (fonts + icons offline, compile before packaging) → Tasks 2, 35.
- README updated → Task 35.
- No functional changes to `app.js` beyond icon `renderIcons()` calls and a new inspector-tab handler → confirmed across all migration tasks.

No gaps.

**Type/naming consistency:**
- `window.renderIcons` signature is stable: `renderIcons(root?)`. Defined in Task 5; called throughout.
- Public Sass token names (`$bg-chrome`, `$accent`, `$h-optionsbar`, etc.) are defined once in Task 8 and used verbatim in Tasks 9–32.
- `.is-active` / `.is-open` / `.is-primary` / `.is-root` / `.is-mini` / `.is-range` / `.is-triple` / `.is-on` / `.is-off` / `.is-hint` / `.is-help` / `.is-front` / `.is-back` / `.is-dropdown` / `.is-options` / `.is-status` — consistent state-class vocabulary.
- Every component partial starts with `@use '../tokens' as *;` and optionally `@use '../mixins' as *;`.

**No placeholders:** confirmed — every step has runnable commands or complete code blocks.
