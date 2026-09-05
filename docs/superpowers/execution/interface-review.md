# Interface lane review — 2026-09-05

Implemented in isolated website-modernization worktree. Scope: warm-light shared tokens, Archivo/Inter typography, native responsive navigation, footer, homepage composition, source records, complete directory filtering, source detail template, font assets and scoped tests. Removed unused TrustBar, FeatureGrid, CtaSection, HowItWorks, ConsoleDemo and SectionLabel components.

## Evidence

- `npm test -- tests/unit/catalog.test.ts`: 3 passed. Covers token intersection, category intersection, stable reset, aliases, literal special characters and bounded hostile input. Initial baseline attempt preceded coordinator harness installation and failed because the `test` script was absent; do not represent that attempt as a failing behavioral assertion.
- Scoped ESLint on A components/pages/filter and tests passed.
- `npm run test:e2e -- tests/e2e/discovery.spec.ts tests/e2e/visual.spec.ts`: final 10 passed in 8.1 seconds. Covers every source detail destination, URL/reload/back restoration, filtering/empty state/recovery, keyboard focus after clearing, mobile menu Escape focus return, primary action within the 390×844 viewport, and 320/390/768/1440 reflow on five representative routes.
- First browser pass: 9 passed, 1 failed on 200% root-font stress. Measured cause was the connection component's mobile grid minimum width of 535px; B corrected its tracks to minmax(0,1fr) and children to min-width:0. Final pass verifies the correction.
- Additional measured 200% root-font stress at 390×844: homepage, source index, gnomAD, connection index and imprint each had document scrollWidth 390px.
- Archivo WOFF2 inspected with fontTools: weight 600, width class 5, 12,584 bytes. Browser computed H1 family Archivo. See font-provenance.md.

## Rendered review

One initial batched review and one correction/confirmation batch. Captures in `screenshots/`: home, sources and gnomAD at 320/390/768/1440; homepage viewport crops at those widths; full homepage with 200% text at390. Actual desktop and mobile viewport captures were visually inspected. The coordinator independently inspected the desktop composition.

Corrections: connection heading aligned with its content columns; decorative evidence index removed; evidence metadata made at least14px; source disclosure gained listed tool and integration repository; connection enlargement overflow repaired. Final look has the approved warm canvas, magenta action, source-record rules, prominent Archivo proposition and honest white evidence record. Dark panels remain confined to code. Desktop's next source heading remains visible by900px; mobile primary action is visible before the evidence figure. The captured evidence record was about535px high. B subsequently moved the compact figure’s standalone tool row into its native disclosure, producing the frozen three-stage summary at approximately480px without squeezing type; coordinator final integrated screenshots supersede these captures for that final change.

No new raster art was used. Screenshot PNGs are local build-review evidence. Source-specific content and client truth are B-owned; static delivery, no-JavaScript coverage, broad axe and production artifact checks are covered by the coordinator/C integration evidence. This review does not claim clinical validation or six tested clients.

## User-directed simplification and usage revision

Later in the same session the user superseded the earlier homepage scope and font choice. The homepage now ends after connection guidance: removed the repeated maintenance block and eight-question FAQ, retaining their substantive destinations via About/Limitations/footer. Existing #features anchors now target the footer Scope and limitations link. Two worked-example promotions present actual HNF1B and renal-cysts/diabetes prompts directly from Workflow.prompt, without repeating summary text or example-status eyebrow labels.

Body typography now uses official self-hosted Source Sans 3 variable400–600; Archivo remains the heading face. Removed all obsolete Inter/Instrument Serif files after reference checks. Source Sans3 is20,004bytes; combined with Archivo the font payload is32,588bytes. Browser confirms Source Sans3 loaded as computed body font.

Targeted post-revision verification: `PW_RUN_ID=a npm run test:e2e -- tests/e2e/visual.spec.ts` passed7/7 in5.1seconds, including new usable-prompt→worked-example navigation, mobile fold, Escape/focus recovery, 200% home text stress and320/390/768/1440 reflow. Scoped lint passed on the changed homepage/footer/test. Final B detailed call content and compact hero revision are integrated/captured by the coordinator after this scoped lane check; the earlier screenshots document the superseded design state and are not final publication evidence.
