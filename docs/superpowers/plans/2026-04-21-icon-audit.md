# Icon audit — Photoshop → Lucide

This table enumerates every inline `<svg>` in `web/index.html` (27 total as of
2026-04-21) and proposes a Lucide icon replacement. During component migration,
each inline `<svg>` is swapped for `<i data-lucide="…" class="icon"></i>` and
upgraded at runtime via `window.renderIcons()` (see `web/icons.js`).

Icons with no clean Lucide match are flagged in the Notes column — those stay
inline. We don't force-fit icons we don't like.

## Tool rail (`web/index.html` lines 221–337, 359)

| Context (HTML) | Current SVG intent | Lucide name | Notes |
|---|---|---|---|
| `.tool-button[data-tool="move"]` (L221) | 4-direction pan arrows | `move` | direct match |
| `.tool-button[data-tool="transform"]` (L226) | frame + corner handles | `square-dashed-mouse-pointer` | closest available |
| `.tool-button[data-tool="direct"]` (L232) | cursor with anchor node | `mouse-pointer-2` | |
| `.tool-button[data-tool="crop"]` (L238) | crop corners | `crop` | direct match |
| `.tool-button[data-tool="text"]` (L243) | T glyph | `type` | direct match |
| `.tool-button[data-tool="pen"]` (L248) | bezier line + 3 anchors | `pen-tool` | direct match |
| `.tool-button[data-tool="shape"]` (L256) | rectangle + handle dots | `shapes` | alt: `square` |
| `.tool-button[data-tool="eyedropper"]` (L263) | pipette | `pipette` | direct match |
| `.tool-button[data-tool="bucket"]` (L268) | paint bucket with drip | `paint-bucket` | direct match |
| `.tool-button[data-tool="gradient"]` (L275) | diagonal line, dot, arrow | `blend` | alt: `contrast` |
| `.tool-button[data-tool="color-range"]` (L282) | multi-color sample circles | `palette` | closest available |
| `.tool-button[data-tool="magic-wand"]` (L290) | wand with sparkles | `wand-sparkles` | direct match |
| `.tool-button[data-tool="brush"]` (L297) | paintbrush | `brush` | direct match |
| `.tool-button[data-tool="eraser"]` (L303) | eraser | `eraser` | direct match |
| `.tool-button[data-tool="magic-eraser"]` (L309) | eraser + sparkle | `eraser` | no Lucide equivalent for "magic eraser"; use `eraser` and rely on the tooltip for disambiguation, or keep inline SVG if visual distinction is critical |
| `.tool-button[data-tool="select"]` (L316) | dashed rectangle | `square-dashed` | direct match |
| `.tool-button[data-tool="select-ellipse"]` (L321) | dashed ellipse | `circle-dashed` | shape is a circle not an ellipse, but close enough |
| `.tool-button[data-tool="artboard"]` (L326) | frame-in-frame | `frame` | |
| `.tool-button[data-tool="ruler"]` (L332) | diagonal ruler with tick marks | `ruler` | direct match |
| `.tool-button.tool-button--help` (L359) | question mark in circle | `circle-help` | direct match |

## Layer toolbar (`web/index.html` lines 936–975)

These live in the `.layer-toolbar` under the Layers dock panel. Each button has
a single inline `<svg viewBox="0 0 24 24">`.

| Context (HTML) | Current SVG intent | Lucide name | Notes |
|---|---|---|---|
| `#add-layer` (L938) | plus in circle | `plus` | direct match; the current svg is a bare `+`, but `plus` is the idiomatic Lucide |
| `#group-layer` (L943) | folder with top tab | `folder-plus` | alt: `folder` (current drawing is a folder with a separator line) |
| `#ungroup-layer` (L949) | folder with bottom divider | `folder-minus` | alt: `folder-open` |
| `#duplicate-layer` (L955) | two overlapping rectangles | `copy` | direct match |
| `#move-layer-up` (L960) | up arrow | `arrow-up` | alt: `chevron-up` if minimalist |
| `#move-layer-down` (L965) | down arrow | `arrow-down` | alt: `chevron-down` |
| `#delete-layer` (L970) | trash can | `trash-2` | direct match |

## Additional Lucide replacements for markup that will be added during migration

Not every icon that ships in Phase 2+ lives in `index.html` today — the migration
plan (Tasks 18–60+) adds markup for panel-section toggles, a status-bar saved-state
dot, and the per-layer eye/lock icons that are currently rendered by `app.js` via
inline SVG string concatenation. Those get mapped here for reference:

| Context (future markup) | Intent | Lucide name | Notes |
|---|---|---|---|
| `.panel-section` toggle chevron | collapse indicator | `chevron-down` | rotate 180deg when collapsed |
| `.contextual-bar` drag grip (`::` handle) | vertical grip | `grip-vertical` | direct match |
| per-layer visibility toggle | eye / eye-off | `eye` / `eye-off` | toggle based on state |
| per-layer lock indicator | padlock | `lock` | alt: `lock-open` for unlocked |
| status-bar saved-state dot | filled circle, solid color | inline SVG | no good Lucide equivalent for a 6px filled dot; keep inline |

## Summary

- 27 inline `<svg>` tags enumerated in `web/index.html` as of 2026-04-21
- 25 have a direct or close Lucide match
- 1 flagged as potentially keeping inline (`magic-eraser` — no unique Lucide)
- 1 is a status indicator dot that stays inline (future markup, not yet present)
- Each Phase 3 component migration task replaces the inline SVGs in its
  component's markup with `<i data-lucide="…" class="icon"></i>` and calls
  `window.renderIcons()` after any dynamic DOM injection.
