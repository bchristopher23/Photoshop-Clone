# Photoshop MVP

Minimal Photoshop-style editor scaffolded for a `Tauri + Rust + HTML/CSS/JS` stack.

## What is here

- Static frontend in [`web/`](./web) with:
  - image import
  - project open/save
  - multi-layer raster editing
  - brush and eraser
  - marquee selection
  - crop to selection
  - grayscale and invert filters
  - zoom, pan, fit, undo, redo
  - PNG export
- Local dev server in [`server.mjs`](./server.mjs)
- Tauri shell scaffold in [`src-tauri/`](./src-tauri)

## Run the frontend

```bash
bun run dev
```

Open `http://127.0.0.1:4173`.

## Styles

CSS is compiled from Sass partials under `web/styles/` to `web/styles.css`.

- `bun run styles:build` — one-shot compile (runs on `postinstall` automatically).
- `bun run styles:watch` — watch mode.
- `bun run dev` — server + styles watcher in one command.

Design tokens live in `web/styles/_tokens.scss`. All colors, spacing, type sizes, and layout dimensions are tokenized. Component files are under `web/styles/components/` — one file per UI region.

## Run inside Tauri

This repo uses the bun-managed Tauri CLI.

Install dependencies first:

```bash
bun install
```

Then check the local desktop prerequisites:

```bash
bun run doctor
```

Then start Tauri:

```bash
bun run tauri:dev
```

On Debian or Ubuntu, if `bun run doctor` reports missing desktop libraries, install the Tauri prerequisites:

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

## Notes

- The frontend is intentionally dependency-light so the editor logic stays portable.
- Browser mode saves projects by download and opens them with a file picker.
- Tauri mode enables `withGlobalTauri`, initializes `tauri-plugin-dialog`, and grants `dialog:default`, so project open/save and error dialogs can use native system dialogs.
- Tauri mode still saves `.raster` projects and exports `.png` files through Rust commands after the user selects a path in the native dialog.
- Packaging is disabled in the default Tauri config until app icons and installer metadata are added.
- PSD, AI, and RAW import are intentionally out of scope for now. The current document model does not yet preserve enough Photoshop- and Illustrator-style structure to import those formats reliably without dropping important behavior.
