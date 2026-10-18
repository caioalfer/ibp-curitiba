---
version: 1
slug: "src-app-site-page-tsx"
primary_target: "src/app/(site)/page.tsx"
related_targets: ["src/app/(site)/layout.tsx","src/components"]
---

Scope: whole public site (home, horários, avisos, notícias, artigos, sobre), led by the home. Mode: Operate (find the next Mass/confession in seconds), with Read on articles.
Audience/job: faithful of the IBP Curitiba, mostly on phones, all ages; newcomers to the Traditional Mass. Action: see the next Mass and the week; secondary: WhatsApp contact (confissão / direção espiritual).
Constraints: user-pinned visual reference "Sequel" (pure black canvas, lamp cream #f5f5f0 as the only accent, #202020 cards, #333 hairlines, light sans at 300 + italic serif payoff word, uppercase tracked labels, pill buttons, glass badges, 10px card radius, photographic hero with bottom scrim). No chromatic colour anywhere. Photos and logo pending from client: reserve slots, do not invent imagery.
Build path: code-led (no image generation in this harness).

## Direction contract

THESIS: The sanctuary lamp. In the dark hero, the next Mass is the one lit thing; on the white page below, it is the one thing marked in ink. Refuses the category default of a parish template (hero carousel + coloured cards + a static timetable table).

OWN-WORLD (revised 2026-10-17: two themes, automatic by system preference with a header selector): light = white page, near-black ink, #f4f3ef plates, #e2e1dc hairlines, "now" (next Mass band, Hoje pill, primary pill, lamp rule) in black; dark = black page, white ink, #202020 plates, #333 hairlines, "now" in lamp cream #f5f5f0. The home hero is the Mass photo under veils in the page colour, ink text on top. IBP seal in header and footer. Geist 300 headlines, one Instrument Serif italic payoff word per page, uppercase tracked labels, pills, 10px plates.

STORY: The visitor sees, in one glance, when and where the next Mass is; scrolls the week as a column of lights; reads notices; learns who the IBP is.

FIRST VIEWPORT: Full-height black hero. Top bar: wordmark left, links, cream pill "Falar com o padre" right. Bottom-left at display scale: "Próxima Missa" label, then the day/time as a lit cream headline ("Hoje, 19h") with type and place below. Upper area: "Instituto Bom Pastor · Curitiba" with "Missa *Tradicional*" headline. Photo slot behind with bottom scrim once photos arrive.

FORM: Sanctuary lamp, candidate 4 of the grounded list (missal rubric, ordo calendar, church-door tabula, sanctuary lamp, holy card, stained glass, rosary). Seed key 1ce9c353.
Raises: from emission-line rail: state is carried by line form, never hue (lit solid = next, full = upcoming, dimmed half = past, struck = cancelled). From timetable slide rack: the schedule sets every row at one size; rank by weight, case and light only. From centre-rail reference setting: articles hold a strict reading measure with date/author/theme hung in a margin column.
Signature interaction: the lamp. The next Mass row carries a cream light line that the client clock moves as hours pass; past rows dim; it re-lights on the next.
Motion: 0.2-0.3s cubic-bezier(0.625,0.05,0,1) fades/slides; no bounce; reduced motion respected.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
