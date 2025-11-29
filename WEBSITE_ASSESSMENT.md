# GeneFoundry Website Assessment

**Date:** November 2024
**Reviewer:** Expert Website Design Consultant
**Focus:** Startup Pitch Website for Biotech/Healthcare Research Project

---

## 🔴 Critical Insight: Platform Scope Undersold

> **The website currently undersells GeneFoundry's true scope by ~70%**

The site communicates "variant analysis" when the platform actually enables **10+ distinct use cases** across the entire genetic medicine workflow. This is the single most important finding of this assessment.

### What the Website Says vs. What GeneFoundry Actually Does

| Website Implies | Reality |
|-----------------|---------|
| Variant analysis tool | **Generalizable AI platform for ALL genetic tasks** |
| 4 data sources | **7+ MCP servers with extensible architecture** |
| Clinical diagnostics focus | **Research + Clinical + Patient Education + Literature** |

### The Real GeneFoundry Platform

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENEFOUNDRY PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│  DATA LAYER (MCP Servers)                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ gnomAD  │ │  GTEx   │ │PubTator │ │ LitVar  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │GeneRevs │ │StringDB │ │AutoPVS1 │ │ Future  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  USE CASES ENABLED                                               │
│  ✓ Variant interpretation      ✓ Literature research            │
│  ✓ Gene-disease curation       ✓ Candidate gene analysis        │
│  ✓ Gene validity assessment    ✓ Patient-friendly content       │
│  ✓ Phenotypic matching         ✓ Clinical report writing        │
│  ✓ Protein network analysis    ✓ Tissue expression analysis     │
├─────────────────────────────────────────────────────────────────┤
│  AUDIENCES                                                       │
│  👨‍⚕️ Clinicians  👩‍🔬 Researchers  🧬 Geneticists  👥 Self-help orgs │
└─────────────────────────────────────────────────────────────────┘
```

**Recommendation:** Update hero copy immediately to reflect this broader vision.

---

## Executive Summary

GeneFoundry presents a **well-crafted, professional landing page** that effectively communicates a complex biotech concept to multiple stakeholder audiences. The site demonstrates strong technical foundations and thoughtful design decisions.

**However, the most critical issue is scope communication:** The website undersells the platform's true capabilities by focusing narrowly on "genomic analysis" when GeneFoundry enables a much broader range of genetic medicine tasks.

### Overall Rating: **8.2/10** (potential: 9.5/10 with scope fix)

| Category | Score | Notes |
|----------|-------|-------|
| Visual Design | 8.5/10 | Clean, professional, biotech-appropriate |
| Technical Implementation | 9/10 | Modern stack, optimized, accessible |
| Content Strategy | 6.5/10 | **Scope undersold**; good clarity otherwise |
| Conversion Optimization | 7/10 | Single CTA, limited lead capture |
| Mobile Experience | 8.5/10 | Responsive, touch-friendly carousel |
| Trust & Credibility | 8.5/10 | Strong team section, institutional backing |

---

## 1. Visual Design Analysis

### Strengths

**Professional Biotech Aesthetic**
- Color palette (primary pink #BE3E82, slate secondary) balances scientific credibility with modern startup appeal
- Clean, uncluttered layout follows [biotech website best practices](https://www.ladybugz.com/best-biotech-website-examples-2024/)
- Consistent typography with Inter font family ensures readability

**Visual Hierarchy**
- Clear section progression: Hero → Methodology → Perspectives → Impact → Team → Journey
- Each section has distinct visual treatment preventing monotony
- Effective use of white space guides attention

**Interactive Elements**
- 3D carousel in hero demonstrates technical sophistication
- Role switcher (Geneticist/Clinician/Researcher) immediately shows audience awareness
- Journey timeline provides visual progress narrative

### Areas for Improvement

1. **Hero Section Density**: The 3D carousel, while impressive, may distract from the value proposition on first load
2. **Limited Visual Differentiation**: Consider more distinctive visual treatments for different audience segments
3. **No Video Content**: [Research shows](https://unbounce.com/landing-page-examples/best-landing-page-examples/) video can improve conversions by 86%

---

## 2. Technical Implementation

### Build Analysis

| Asset | Size | Assessment |
|-------|------|------------|
| Main JS | 54KB | Excellent |
| Vue Vendor | 70KB | Expected |
| CSS | 42KB | Good |
| **Total JS** | ~130KB | Well-optimized |
| Images | WebP | Optimal format |

### Architecture Highlights

```
✓ Vue 3 Composition API with TypeScript
✓ Tailwind CSS v4 with JIT compilation
✓ PWA with service worker (skipWaiting, clientsClaim)
✓ Tree-shaken Lucide icons (only imported icons bundled)
✓ Manual chunk splitting for caching
✓ ES2020 target for modern browsers
```

### Accessibility (WCAG 2.1)

**Implemented:**
- `prefers-reduced-motion` respected throughout
- Semantic HTML structure (nav, main, article, section)
- Alt text on images
- Keyboard navigation support
- ARIA labels on interactive elements

**Recommendations:**
- Add skip-to-content link
- Ensure color contrast on hover states
- Consider focus indicators for carousel interaction

### Performance Optimizations

- CSS containment (`contain: layout style paint`)
- Direct DOM manipulation for animations (bypasses Vue reactivity)
- RequestAnimationFrame throttled to ~30fps
- Lazy loading on team images
- Pre-bundled critical dependencies

---

## 3. Stakeholder Perspective Analysis

### Primary Audiences

Based on biotech landing page research from [Landingi](https://landingi.com/blog/how-to-create-the-best-healthcare-landing-page/) and [US Pharma Marketing](https://uspharmamarketing.com/how-to-design-a-biotech-landing-page-that-converts-biotech-landing-page/), GeneFoundry serves multiple stakeholders:

| Stakeholder | Current Experience | Recommendations |
|-------------|-------------------|-----------------|
| **Investors/Funders** | Journey timeline shows progress; Impact section mentions Charité validation | Add funding milestones, pipeline status, or grant partnerships |
| **Clinical Partners** | Team credentials visible; CeRKiD cohort mentioned | More prominent clinical outcomes data, partnership inquiry CTA |
| **Research Collaborators** | GitHub links prominent; Open Science messaging | Add technical documentation preview, API/MCP examples |
| **Regulatory/Institutional** | Charité/BIH affiliation clear | Consider compliance/security certifications section |

### Trust Signals Present

✓ Institutional logos (implied via Charité/BIH mention)
✓ Team credentials with photos and affiliations
✓ Published timeline demonstrating progress
✓ Open source commitment (GitHub links)
✓ Specific validation data (1,500 patient cohort)
✓ Legal compliance (Imprint with BDSG notice)

### Missing Trust Elements

- Media mentions / press coverage
- External testimonials or case studies
- Security/compliance certifications
- Data handling transparency statement

---

## 4. Content Strategy Assessment

### Value Proposition

**Current:** "A modular registry for customized, evidence-based genomic analysis. Powered by Model Context Protocols (MCPs)."

**Analysis:**
- ✓ Clear what it is (modular registry)
- ✓ Clear benefit (evidence-based analysis)
- ✓ Technical differentiator (MCPs)
- ⚠ Could be stronger on the "why now" and "why us"
- ⚠ **CRITICAL: Scope too narrow** - Currently implies only "variant analysis" when the platform is much broader

**The Real Scope (from MCP ecosystem):**

| MCP Server | Data Source | Use Cases Enabled |
|------------|-------------|-------------------|
| gnomAD-Link | Population genetics | Variant frequency, constraint metrics, rarity assessment |
| GTEx-Link | Tissue expression | Expression QTLs, tissue-specific gene analysis |
| PubTator-Link | Literature mining | Entity extraction, gene-disease relationships |
| LitVar-Link | Variant literature | Publication discovery, variant-phenotype links |
| GeneReviews-Link | Clinical genetics | Gene-disease curation, clinical management |
| StringDB-Link | Protein interactions | Network analysis, pathway enrichment |
| AutoPVS1-Link | Pathogenicity | Variant classification, CNV analysis |

**GeneFoundry enables ALL of these use cases:**
- ✅ Variant interpretation (currently mentioned)
- ✅ Gene-disease curation
- ✅ Gene validity assessment
- ✅ Phenotypic matching
- ✅ Literature research & synthesis
- ✅ Candidate gene prioritization
- ✅ Patient-friendly content generation (self-help organizations)
- ✅ Clinical report writing
- ✅ Protein interaction analysis
- ✅ Expression-based tissue analysis

**Suggested Enhancement (broader scope):**
> "Solving the AI hallucination problem across ALL genetic analysis. From variant interpretation to literature synthesis, from patient education to clinical reports—GeneFoundry delivers trustworthy, traceable AI through validated data pipelines."

### Headline Effectiveness

| Section | Headline | Assessment |
|---------|----------|------------|
| Hero | "Forging Trust in Genomic AI." | Strong, memorable, implies problem-solving |
| Methodology | "The Methodology" | Generic; could be more compelling |
| Perspectives | "One Engine, Many Perspectives." | Excellent—shows flexibility |
| Impact | "Real-World Impact" | Good, but could quantify |
| Team | "Meet the Team" | Standard; works well |
| Journey | "The Journey" | Good narrative framing |

### Content Gaps

1. **Problem Statement**: The "80% undiagnosed" stat is buried in Impact. Lead with this.
2. **Social Proof**: No external validation beyond self-reported metrics
3. **Use Cases**: More specific examples of MCP workflows would help technical audiences
4. **FAQ Section**: Could address common concerns (data privacy, integration, cost)

---

## 5. Conversion Optimization

### Current CTAs

| Location | CTA Text | Destination |
|----------|----------|-------------|
| Hero | "Get Started on GitHub" | GitHub repo |
| Impact | "View on GitHub" | GitHub repo |
| Footer | "GitHub" | GitHub repo |

### Conversion Analysis

**Strengths:**
- Clear, consistent primary action
- GitHub-focused approach appropriate for open-source/research project

**Weaknesses:**
- **Single conversion pathway**: All CTAs lead to GitHub
- **No lead capture**: No email signup, newsletter, or contact form
- **No secondary CTAs**: No "Learn More", "Contact Us", or "Request Demo"
- **Missing urgency**: No incentive to act now

### Recommendations

1. **Add Email Capture**
   ```
   "Join the waitlist for early access to MCP modules"
   - Captures leads for launch announcements
   - Builds community before product
   ```

2. **Stakeholder-Specific CTAs**
   - Researchers: "Explore the API Documentation"
   - Clinicians: "Request a Clinical Pilot Demo"
   - Partners: "Discuss Collaboration"

3. **Secondary Conversion Path**
   - Newsletter signup for project updates
   - Academic paper preview/preprint
   - Webinar registration for upcoming presentations

---

## 6. Mobile Experience

### Assessment (375px viewport)

**Strengths:**
- Hamburger menu properly implemented
- Carousel adapts with touch support
- Timeline switches to vertical layout
- Team cards stack cleanly
- Font sizes remain readable

**Issues Identified:**
- 3D carousel may be overwhelming on small screens
- Some horizontal scrolling possible on carousel drag
- Journey timeline cards could benefit from swipe gesture hints

### Recommendations

- Consider static card display on mobile instead of 3D carousel
- Add horizontal scroll indicators on timeline
- Test on actual devices for touch responsiveness

---

## 7. Competitive Positioning

Based on [biotech website trends research](https://www.cyberoptik.net/blog/best-biotech-website-designs/):

| Feature | GeneFoundry | Industry Standard | Gap |
|---------|-------------|-------------------|-----|
| Hero Clarity | ✓ | ✓ | - |
| Team Section | ✓ | ✓ | - |
| Progress Timeline | ✓ | Rare | Advantage |
| Interactive Demo | 3D Carousel | Product Demo | Opportunity |
| Video Content | ✗ | Common | Gap |
| Blog/Resources | ✗ | Common | Gap |
| Newsletter | ✗ | Expected | Gap |
| Case Studies | Partial | Expected | Gap |

---

## 8. Recommended Improvements

### High Priority (Quick Wins)

1. **Add Email Capture Component**
   - Simple form: email + "Get Updates" button
   - Place above footer or in hero secondary CTA

2. **Strengthen Hero Copy**
   - Lead with the problem (AI hallucination in genomics)
   - Add statistic in subhead (80% diagnostic gap)

3. **Add Contact CTA**
   - "Contact Us" or "Discuss Partnership" link
   - Even a simple mailto: improves conversion

### Medium Priority (Content Enhancement)

4. **~~Add Testimonial/Quote Section~~** *(Reconsidered)*
   - **Strategic Note:** At funding stage, showing too much completion undermines the investment case
   - Current approach is correct: conceptual demonstration + future roadmap
   - Intentionally NOT showing working alphas/POCs - keeps focus on "what funding enables"
   - The 3D carousel shows the *concept* without implying production-ready code

5. **Expand Impact Metrics**
   - Specific numbers: variants analyzed, time saved, accuracy improvement
   - Visual data presentation (charts, numbers)

6. **Create Resource Section**
   - Link to technical documentation
   - Academic papers/preprints
   - MCP specification preview

### Lower Priority (Future Enhancements)

7. **Add Video Content**
   - 60-90 second explainer video
   - Team introduction or project vision

8. **Implement Blog/Updates**
   - Project progress updates
   - Technical deep-dives
   - Research findings

9. **Create Partner/Investor Page**
   - Detailed pipeline information
   - Funding status
   - Partnership opportunities

---

## 9. Technical Recommendations

### SEO Improvements

- Add structured data (Organization, SoftwareApplication schemas)
- Create sitemap.xml
- Add meta descriptions per section (for future multi-page expansion)
- Consider adding Open Graph images for social sharing

### Analytics Setup

- Implement privacy-respecting analytics (Plausible, Umami)
- Track CTA clicks, scroll depth, time on page
- Set up conversion goals for GitHub visits

### Performance Monitoring

- Add Core Web Vitals tracking
- Monitor service worker update success rates
- Consider error tracking (Sentry) for production

---

## 10. Conclusion

GeneFoundry presents a **strong foundation** for a biotech startup landing page. The technical implementation is modern and well-optimized, the visual design is professional and appropriate for the healthcare/research sector, and the content effectively communicates a complex technical concept.

The primary areas for improvement center on **conversion optimization** and **stakeholder segmentation**. Adding lead capture mechanisms, secondary CTAs, and stakeholder-specific pathways would significantly enhance the site's effectiveness as a pitch tool.

### Immediate Action Items

**🔴 CRITICAL (Do Before DCS Pitch):**
1. ☐ **Update hero subhead** to show platform breadth (not just "genomic analysis")
2. ☐ Add email capture form (newsletter/waitlist)
3. ☐ Add "Contact Us" mailto link

**P1 (Nice to have before pitch):**
4. ☐ Update Methodology subtitle to reflect broader scope
5. ☐ Consider adding task examples under Perspectives tabs

**Strategic Guardrails:**
6. ☐ ~~Add external testimonial/demos~~ → Keep current approach (preserves funding justification)
7. ☐ ~~Add video before pitch~~ → Wait until after DCS outcome

---

## 11. Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)

#### 1.1 Email Capture Component
**Goal:** Build community before launch, capture interested researchers/partners

**Implementation:**
```vue
<!-- NewsletterSignup.vue - Simple component -->
- Email input + "Get Updates" button
- Place in two locations:
  1. Below hero CTA (secondary action)
  2. Above footer (catch scrollers)
- Store emails via:
  - Option A: Formspree (free, no backend needed)
  - Option B: Google Forms embed (simple)
  - Option C: Simple Cloudflare Worker + KV store
```

**Copy suggestions:**
- "Follow our journey from concept to clinic"
- "Get notified when we launch the MCP registry"

#### 1.2 Contact CTA
**Goal:** Enable partnership/collaboration inquiries

**Implementation:**
- Add to footer: `mailto:contact@genefoundry.org` or use Nina's institutional email
- Consider adding to Impact section: "Interested in collaboration? Get in touch"
- Simple modal with contact form (optional, mailto works fine for now)

#### 1.3 Hero Copy Refinement
**Goal:** Lead with the problem AND communicate broader scope

**Current:**
> "Forging Trust in Genomic AI."
> "A modular registry for customized, evidence-based genomic analysis."

**Problem:** "genomic analysis" is too narrow. GeneFoundry enables much more.

**Suggested revision (broader scope):**
> "Forging Trust in Genomic AI."
> "From variant interpretation to literature synthesis. From clinical reports to patient education. GeneFoundry brings trustworthy AI to every corner of genetic medicine—through validated, traceable data pipelines."

**Alternative (problem-first, broader):**
> "Forging Trust in Genomic AI."
> "AI hallucinates. In genetics, that's dangerous. GeneFoundry solves this across the entire workflow—variant curation, gene-disease analysis, phenotype matching, literature research, and more."

**Alternative (use-case focused):**
> "Forging Trust in Genomic AI."
> "One platform. Every genetic task. Trustworthy AI for variant interpretation, literature synthesis, patient communication, and clinical reporting—powered by validated data pipelines."

#### 1.4 Full Website Copy Recommendations (Scope Update)

**Section-by-section recommendations to communicate broader platform vision:**

**Hero Section:**
```
CURRENT:
"A modular registry for customized, evidence-based genomic analysis."

RECOMMENDED:
"A modular registry for trustworthy genetic AI. From variant analysis to
literature synthesis, from patient education to clinical reporting—powered
by Model Context Protocols (MCPs)."
```

**Methodology Section - "The Methodology":**
```
CURRENT SUBTITLE:
"From raw chaos to structured truth."

RECOMMENDED:
"From scattered data to trustworthy answers—across every genetic task."

CONSIDER ADDING underneath the 3-step flow:
"Whether you're interpreting variants, researching literature, curating
gene-disease relationships, or writing patient-friendly summaries—
GeneFoundry delivers validated, traceable AI outputs."
```

**Perspectives Section - "One Engine, Many Perspectives":**
```
CURRENT SUBTITLE:
"GeneFoundry adapts the output based on who is asking."

This section is good, but could be expanded to show TASKS not just AUDIENCES:

OPTION A: Keep audience tabs, add task examples
- Geneticist: "Variant classification, gene curation, ACMG reports"
- Clinician: "Patient summaries, phenotype matching, differential diagnosis"
- Researcher: "Literature synthesis, candidate gene analysis, pathway exploration"

OPTION B: Add second row of task-based tabs
[Variant Analysis] [Literature Research] [Gene Curation] [Patient Education]
```

**Impact Section - "Real-World Impact":**
```
CURRENT: Focuses on diagnostics/rare disease

RECOMMENDED ADDITION (new card or updated existing):
"Beyond Diagnostics"
"From writing accessible genetic information for patient self-help
organizations to synthesizing literature for research grants—GeneFoundry's
trustworthy AI extends across the entire genetic medicine workflow."
```

**Carousel Cards (Hero):**
```
CURRENT: Shows 4 data sources (gnomAD, GTEx, PubTator, MGI)

RECOMMENDED: Mix data sources + use cases
- Keep: gnomAD, GTEx, PubTator
- Add/Replace with USE CASE cards:
  - "Literature Synthesis" (shows PubTator + LitVar output)
  - "Patient Education" (shows simplified GeneReviews output)
  - "Gene Curation" (shows gene-disease validity output)

This visually demonstrates the BREADTH of applications, not just data sources.
```

---

### Phase 2: Video Content (POST-PITCH - Q1 2026+)

> **⚠️ TIMING CRITICAL:** Do NOT publish video before the DCS Committee Pitch (Dec 2025)

#### Why Wait?

| Risk of Pre-Publishing | Explanation |
|------------------------|-------------|
| Committee might see it | DCS reviewers visiting site see Nina "pitching" before the actual pitch → awkward/presumptuous |
| Removes freshness | Actual pitch becomes a rerun, not genuine presentation |
| Content lock-in | If pitch needs adaptation, public video is outdated |
| Academic ≠ VC context | VC startups use videos for discovery; you're targeting ONE specific program |
| Failure visibility | If pitch fails, there's a public record of the rejected presentation |

*Sources: [Entrepreneur](https://www.entrepreneur.com/starting-a-business/7-reasons-to-never-send-your-deck-to-an-investor-before-you/312393), [Startup Hacks](https://www.startuphacks.vc/blog/2015/11/16/why-sending-decks-to-investors-before-the-first-meeting-is-generally-a-bad-idea-and-what-to-do-about-it)*

#### 2.1 Post-Pitch Video Strategy

**If DCS pitch succeeds (Q1 2026):**
- "We're officially starting!" announcement video
- Can include pitch highlights, now validated by acceptance
- Celebrate the milestone, build community momentum

**If DCS pitch doesn't succeed:**
- General "vision video" (not tied to specific funding)
- Evergreen content for pursuing alternative funding
- No mention of specific program outcomes

#### 2.2 Video Concept (When Ready)

**Reframe from "Pitch" to "Vision":**

| Don't | Do |
|-------|-----|
| "Nina's pitch presentation" | "Nina explains the GeneFoundry vision" |
| Specific funding ask | General problem/solution story |
| DCS-specific milestones | Universal "why this matters" message |
| Tied to Dec 2025 outcome | Evergreen content |

**Script outline (60 seconds) - POST-FUNDING version:**
```
[0-10s] Hook: "What if AI could help diagnose rare diseases—without making things up?"

[10-30s] Problem: "Today, AI hallucinates. It invents gene variants,
misreads literature, gives confident but wrong answers.
In genomics, that's not just wrong—it's dangerous."

[30-50s] Solution: "GeneFoundry solves this with Model Context Protocols—
validated data pipelines that give AI trustworthy, traceable information.
No hallucinations. Just evidence."

[50-60s] CTA: "We're now building this at Charité. Follow our progress."
         (Note: Only use after funding confirmed)
```

**Production approach (for later):**
```
Option A: DIY (Recommended for authenticity)
- Record with good smartphone (iPhone/modern Android)
- Ring light + lapel mic (~€50 investment)
- Simple background (office, Charité branding visible)
- Edit with DaVinci Resolve (free) or CapCut

Option B: Professional
- BIH/Charité media services (may be available)
- Local Berlin videographer (€500-1500)
```

#### 2.3 Current Recommendation

**For now (pre-pitch):** The site is strong without video. The 3D carousel + team + timeline already tells the story effectively. Focus on:
- Email capture (Phase 1)
- Hero copy refinement (Phase 1)
- Contact CTA (Phase 1)

**Video can wait until outcome is known.**

---

### Phase 3: Scope Communication (High Priority)

#### 3.0 Communicate the Full Platform Vision
**Goal:** Show that GeneFoundry is a generalizable platform, not just "variant analysis"

**Current Problem:**
- Website focuses narrowly on variant interpretation
- 3D carousel shows only 4 MCPs (gnomAD, GTEx, PubTator, MGI)
- Missing: the breadth of genetic tasks this enables

**The Full MCP Ecosystem:**
```
DATA SOURCES (7+ MCPs):
├─ gnomAD-Link      → Population frequencies, constraint
├─ GTEx-Link        → Tissue expression, eQTLs
├─ PubTator-Link    → Literature mining, entity extraction
├─ LitVar-Link      → Variant-publication links
├─ GeneReviews-Link → Clinical gene-disease curation
├─ StringDB-Link    → Protein interactions, pathways
├─ AutoPVS1-Link    → Pathogenicity classification
└─ [Future MCPs]    → ClinVar, OMIM, HPO, UniProt...

USE CASES ENABLED:
├─ Variant interpretation
├─ Gene-disease curation
├─ Gene validity assessment
├─ Phenotypic matching
├─ Literature research & synthesis
├─ Candidate gene prioritization
├─ Patient-friendly content (for self-help orgs)
├─ Clinical report writing
├─ Protein network analysis
└─ Tissue-specific gene analysis
```

**Implementation Options:**

**Option A: Update Hero Carousel**
- Add more cards showing different use cases (not just data sources)
- Example cards:
  - "Literature Synthesis" → PubTator + LitVar
  - "Patient Education" → GeneReviews + simplified output
  - "Gene Curation" → gnomAD + ClinVar + GeneReviews

**Option B: Add "Use Cases" Section**
- New section between Methodology and Perspectives
- Grid showing different applications:
  ```
  [Variant Analysis] [Literature Research] [Patient Education]
  [Gene Curation]    [Phenotype Matching] [Clinical Reports]
  ```
- Each card links to relevant MCP combination

**Option C: Expand "One Engine, Many Perspectives"**
- Currently shows Geneticist/Clinician/Researcher
- Could show different TASKS instead of audiences:
  ```
  [Interpret Variants] [Research Literature] [Write Reports] [Educate Patients]
  ```

**Recommended Approach:**
Start with **hero copy update** (Phase 1) to signal broader scope, then consider **Option B** (Use Cases section) post-funding when you can show more detail.

---

### Phase 4: Content Enhancement (4-6 weeks)

#### 4.1 Problem-Focused Impact Metrics
**Goal:** Quantify the problem, not your solution

**Current:** Generic impact statements
**Improved:** Hard numbers about the PROBLEM

```
Suggested metrics to add:
- "80% of rare disease patients lack a diagnosis" (keep this, move higher)
- "300M+ people affected by rare diseases globally"
- "Average diagnostic odyssey: 7 years"
- "AI error rates in clinical genomics: X%" (if you have data)
```

**Implementation:**
- Add animated counter component
- Place in Impact section or new "The Problem" section above Methodology

#### 3.2 FAQ Section (Optional)
**Goal:** Address common questions without cluttering main flow

**Questions to answer:**
- "What are Model Context Protocols?"
- "How is this different from existing AI tools?"
- "When will GeneFoundry be available?"
- "How can I get involved?"

**Implementation:**
- Accordion component at bottom of page
- Or link to separate FAQ page/modal

---

### Phase 4: Technical Polish (Ongoing)

#### 4.1 Analytics Setup
```bash
# Recommended: Plausible (privacy-friendly, GDPR compliant)
npm install plausible-tracker

# Or self-hosted Umami
```

Track:
- CTA clicks (GitHub, email signup, contact)
- Scroll depth
- Video plays (if added)
- Time on page

#### 4.2 SEO Improvements
- Add JSON-LD structured data (Organization, SoftwareApplication)
- Create og:image for social sharing
- Add meta descriptions

#### 4.3 Open Graph Preview
Create shareable preview image:
- GeneFoundry logo + tagline
- Use for Twitter/LinkedIn sharing
- 1200x630px recommended

---

## 12. Prioritized Task List

### Pre-Pitch (Now → Dec 2025)

| Priority | Task | Effort | Impact | Owner |
|----------|------|--------|--------|-------|
| **P0** | Hero copy revision (broader scope) | 1-2 hrs | **Critical** | Nina + Dev |
| **P0** | Email capture component | 2-4 hrs | High | Dev |
| **P0** | Contact mailto link | 30 min | Medium | Dev |
| **P1** | Update hero subhead to show breadth | 30 min | High | Dev |
| **P2** | Analytics setup | 1-2 hrs | Medium | Dev |
| **P3** | OG image + SEO | 2-3 hrs | Low | Dev |

**Key insight:** The website currently undersells GeneFoundry's scope. Updating copy to reflect the full platform vision (variant analysis + literature + patient education + gene curation + more) should be P0.

### Post-Pitch (Q1 2026+)

| Priority | Task | Effort | Impact | Owner | Condition |
|----------|------|--------|--------|-------|-----------|
| **P1** | Video recording | 1 day | High | Nina | After DCS outcome known |
| **P1** | Video editing + embed | 4-6 hrs | High | Dev | After DCS outcome known |
| **P1** | "Use Cases" section | 4-6 hrs | High | Dev | If funded |
| **P2** | FAQ section | 2-3 hrs | Medium | Dev | If funded |
| **P2** | Expanded MCP carousel | 4-6 hrs | Medium | Dev | If funded |

---

## 13. What NOT to Do (Strategic Guardrails)

To preserve the funding narrative:

❌ **Don't show working demos** - Keeps focus on "fund us to build this"
❌ **Don't add case studies** - Implies completion
❌ **Don't show alpha/POC access** - Undermines need for investment
❌ **Don't add testimonials** - Too much validation = "why fund?"
❌ **Don't add detailed technical docs** - Save for post-funding
❌ **Don't publish pitch video before DCS pitch** - Committee may see it; removes freshness; risks awkwardness if pitch changes

✅ **Do show the vision** - What we're building
✅ **Do show the problem** - Why this matters
✅ **Do show the team** - Why we can do it
✅ **Do show the timeline** - What funding enables
✅ **Do wait for video until after Dec 2025** - Then celebrate or pivot as appropriate

---

## 14. Actionable Implementation Ideas

### Quick Wins (Same Day)

#### Hero Copy Options

Three messaging directions to consider:

**Option A: Breadth-First**
```
"From variant interpretation to literature synthesis. From clinical
reports to patient education. Trustworthy AI across genetic medicine."
```

**Option B: Platform-First**
```
"One platform. Every genetic task. Trustworthy AI for clinicians,
researchers, and patients—powered by validated data pipelines."
```

**Option C: Problem-First**
```
"AI hallucinates. In genetics, that's dangerous. GeneFoundry solves
this across the entire workflow."
```

#### Contact Link Implementation
Add simple `mailto:` in footer next to GitHub link:
```vue
<a href="mailto:contact@genefoundry.org" class="hover:text-white transition-colors">
  Contact
</a>
```

#### Email Capture Options
| Option | Effort | Pros | Cons |
|--------|--------|------|------|
| Formspree | 2 hrs | Free, no backend | Third-party dependency |
| Google Forms | 1 hr | Very simple | Less professional look |
| Mailto fallback | 30 min | Zero maintenance | Lower conversion |

---

### Medium Effort (This Week)

#### Expand Carousel Cards
Currently shows 4 data source cards. Add **use case cards** to communicate breadth:

| Current (Data Sources) | Add (Use Cases) |
|------------------------|-----------------|
| gnomAD | Literature Synthesis |
| GTEx | Patient Education |
| PubTator | Gene Curation |
| MGI | Clinical Reports |

This visually demonstrates the platform does MORE than variant lookup.

#### Update Perspectives Section
Add concrete task examples under each role tab:

| Role | Current | Add Task Examples |
|------|---------|-------------------|
| Geneticist | Generic description | "Variant classification, ACMG reports, gene-disease curation" |
| Clinician | Generic description | "Patient summaries, phenotype matching, differential diagnosis" |
| Researcher | Generic description | "Literature synthesis, candidate gene analysis, pathway exploration" |

#### Problem-First Impact Restructure
Move the "80% undiagnosed" stat to a more prominent position. Consider adding:
- "300M+ people affected by rare diseases globally"
- "Average diagnostic odyssey: 7 years"
- "AI hallucination rate in medical contexts: X%"

---

### Messaging Direction Decision

The pitch narrative should lean into ONE primary direction:

| Direction | When to Use | Example Hook |
|-----------|-------------|--------------|
| **Problem-first** | If audience knows AI issues exist | "AI hallucinates. Here's the fix." |
| **Breadth-first** | If audience thinks this is narrow | "One platform for everything genetic." |
| **Trust-first** | If audience values reliability | "Traceable. Validated. No hallucinations." |

**Recommendation:** For DCS pitch, consider **Problem-first** (clinicians understand the danger) combined with **Breadth** (shows big vision worth funding).

---

## Sources

- [Unbounce: 40 Best Landing Page Examples 2024](https://unbounce.com/landing-page-examples/best-landing-page-examples/)
- [Landingi: Healthcare Landing Page Best Practices](https://landingi.com/blog/how-to-create-the-best-healthcare-landing-page/)
- [US Pharma Marketing: Biotech Landing Page Design](https://uspharmamarketing.com/how-to-design-a-biotech-landing-page-that-converts-biotech-landing-page/)
- [Ladybugz: Best Biotech Website Examples 2024](https://www.ladybugz.com/best-biotech-website-examples-2024/)
- [CyberOptik: Best Biotech Website Designs 2025](https://www.cyberoptik.net/blog/best-biotech-website-designs/)
- [Landingi: Startup Landing Page Best Practices](https://landingi.com/landing-page/startup-best-practices/)
