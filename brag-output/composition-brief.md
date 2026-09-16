# Hyperframes Composition Brief: Sentra

## Objective
Create a short launch-style brag video for Sentra, a cross-border trade platform for African traders and customs officers.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 19 seconds

## Source Material
- Project root: `C:\Users\USER\Downloads\Martin\sentra\afritrade-xchange`
- Primary files read: `index.html`, `src/Components/Landing/LandingPage.tsx`, `src/Components/Dashboard.tsx`, `src/Components/Dashboard/ConsignmentCreationModal.tsx`, `src/Components/UploadModal.tsx`, `src/Components/CustomsDashboard/ConsignmentCard.tsx`, `src/Components/CustomsDashboard/StatusDropdown.tsx`, `src/Components/ui/Card.tsx`, `tailwind.config.js`, `package.json`
- Product name: Sentra
- Tagline / strongest claim: "Clear customs 40% faster. and keep your business moving."
- Key UI or visual moment to recreate: the Upload Documents flow ending in a QR code reveal; the customs status pill flipping Pending → Approved; the trader dashboard's Approval Rate stat and green-accented Risk Assessment card updating live
- Copy that must appear verbatim:
  - "Clear customs 40% faster."
  - "and keep your business moving."
  - "CROSS-BORDER TRADE PLATFORM" (eyebrow pill)
  - "Sentra" (wordmark)

## Creative Direction
- Tone preset: polished
- Creative direction: confident fintech-style product film — real UI, real motion, no jokes, no filler
- Interpretation: fewer, longer-held scenes; deliberate, fast motion without clutter; restraint reads as competence for a customs/logistics product
- Angle: Don't sell the idea — show the handoff. A trader creates a consignment, uploads documents, and gets a QR code. A customs officer reviews and approves it. The trader's dashboard updates live. That loop closing in front of the viewer is the whole pitch.
- Hook: Hard cut into the dark hero background with "Clear customs 40% faster." already mid-motion, slamming in bold and white, center-frame.
- Outro / punchline: "and keep your business moving." in italic serif under the Sentra wordmark, no CTA button needed.
- Avoid:
  - Generic SaaS language ("streamline your workflow," etc.)
  - Abstract filler visuals (particles, waveform bars, stock motion graphics)
  - Unrelated visual redesign — reuse the app's real teal/dark-teal palette and existing card/pill styles, don't invent a new look

## Visual Identity
- Background: `#07211d` (dark hero) / `#f5f5f4`-range stone-100 (light dashboard chrome)
- Text: white on dark hero panels; gray-900 on light dashboard panels
- Accent: teal-300 (`#5eead4`) for glows and hero highlights; teal-600 (`#0d9488`) for buttons and active states; amber for "Pending," green for "Approved"
- Display font: Manrope (semibold/bold for headings and UI labels)
- Accent font: Instrument Serif, italic — used only for the hero's second line and the outro line, exactly as the real site does
- Visual references from the project: the hero's radial teal glow treatment; the pill-shaped status badges (amber/green); the icon-badge stat cards; the green left-border Risk Assessment card

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. The claim — 3s — "Clear customs 40% faster." slams in over the dark hero glow, eyebrow pill above it
2. Create & upload — 6s — consignment form fields fill in, document cards arrive one by one, progress bar sweeps, QR code reveals
3. Approved — 5s — customs status pill flips amber "Pending" → green "Approved" via the dropdown
4. Closed loop + outro — 5s — trader's Approval Rate ticks to 100%, Risk Assessment card slides in, crossfade to Sentra wordmark + "and keep your business moving."

## Audio
- Audio role: warm, upbeat business-bed with tasteful UI accents
- Audio arc: steady moderate-volume bed from 0s, light motion-matched SFX through the middle scenes, gentle fade under the final wordmark hold
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (120 BPM, bundled preset available)
- Music treatment: start at 0s at moderate volume, hold steady through scenes 2-3, fade over roughly the last 1.5s under the outro
- Music cue guidance: bundled preset cues available at `assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json` / `.md`. Strong cues near 16-18s and 20-23s exist in the preset's own timeline; since this edit's scene 3→4 handoff (approval → dashboard update) lands earlier (~14s), re-check the preset's beat grid against this composition's actual timeline and lock the approval-chime/status-flip and the final wordmark crossfade to the nearest strong cues rather than the raw timestamps above. Use natural timing if no nearby cue serves the moment.
- Audio-reactive treatment: none — restraint fits the polished tone
- Audio-coupled moments:
  - Scene 2, form fields filling in — soft key-tick per field
  - Scene 2, document cards arriving — light card-drop tick per card
  - Scene 2, QR code reveal — short positive "ding" (the scene's payoff)
  - Scene 3, status dropdown → Approved — click on selection, subtle positive chime as the pill turns green
  - Scene 4, stat counting up — soft tick sound
  - Scene 4, final wordmark — music fade, let any final SFX ring briefly over the fade
- SFX selection guidance: sparse and motion-matched; every sound should correspond to something the viewer sees happen, never decorative
- SFX analysis guidance: use `skills/brag/assets/sfx/sfx-analysis.md` if present; prefer lower high-frequency-risk sounds since several moments (key ticks, card drops) repeat within the same scene
- Exact SFX choice: Hyperframes chooses exact filenames, timestamps, density, and volume based on the implemented animation
- Audio files: copy `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` into `brag-output/composition/assets/music/`; Hyperframes copies any chosen SFX into the same assets tree

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract + `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes` (seek-safe keyframes), and `hyperframes-cli` (lint/check/render). `/brag` is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project (the storyboard requires several).
- Keep all text readable in the final render.
- Keep the video within 15-25 seconds.
- Include the planned music/SFX layer.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Ignore cues that hurt readability, scene pacing, or the product story.
- Major reveals may move toward nearby strong cues within about 0.15s. Smaller entrances may align to nearby beat points within about 0.10s. Use only 1-3 strong cue locks in this 19s video.
- Use SFX to support motion and interaction: card sounds for card-like reveals, a short announcement cue for the QR reveal, key/click sounds for form and dropdown interaction, restraint elsewhere.
- Honor the planned fade-out under the final wordmark.
- Use local assets for audio and any required runtime/media dependencies when possible.
- Run `hyperframes check` before render — it is brag's single gate.
