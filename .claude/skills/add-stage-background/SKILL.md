---
name: add-stage-background
description: Recipe for adding or replacing a stage's themed background in the PANG game (Canvas 2D world-tour scenery). Use this instead of re-deriving the pattern from scratch each time.
---

# Adding a new stage background

Follow this checklist when adding or replacing a stage's landmark theme
(the current 5 are Mt. Fuji, Guilin, a Bangkok temple, Angkor Wat, and
Uluru/Ayers Rock).

1. **Research first (optional but recommended).** If the landmark isn't
   already well understood, use the `culture-historian` subagent to get
   an accurate silhouette/color/detail summary before drawing anything —
   it's a research-only agent and won't touch files.
2. **Design.** Update `docs/design/phase3_3.md` with the stage's position
   in the roster and a one-line description of its visual identity.
3. **Draw function.** In `src/GamePlay.tsx`, add a `drawXBackground(ctx)`
   function following the existing pattern:
   - `drawSky(ctx, topColor, bottomColor)` for the sky gradient.
   - Landmark silhouette drawn with `ctx.beginPath()`/`fill()` shapes
     (bezier curves for organic shapes like mountains, straight lines for
     architecture). Keep it as flat silhouettes/simple shading, not
     photorealistic — consistent with the other stages.
   - `drawGround(ctx, topColor, bottomColor)` for the foreground strip.
4. **Register it.** Add the function to the `BACKGROUNDS` array (order
   matters — it's indexed by stage number) and add the stage's display
   name to `STAGE_NAMES` at the same index.
5. **Verify.** `npx tsc --noEmit -p tsconfig.app.json`, `npm run build`,
   `npm run lint` must all pass. Visually check the stage in the dev
   server if possible.
6. **Commit.** Docs commit first, then a `feat:` or `style:` commit, per
   `CLAUDE.md`'s commit convention.
