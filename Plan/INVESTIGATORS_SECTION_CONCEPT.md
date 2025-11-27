# Investigators Section Design Concept

## Strategic Rationale

This section targets **stakeholders, funders, and collaborators** who need to quickly assess team credibility. Research shows that grant reviewers evaluate whether investigators have "complementary expertise appropriate for the project" ([NIH Guidelines](https://grants.nih.gov/grants-process/write-application/advice-on-application-sections)).

### Key Design Principles
- **Scannable**: Stakeholders spend <10 seconds per card
- **Credibility-first**: Institutional affiliations visible immediately
- **Complementary expertise**: Visual hierarchy shows how skills interlock
- **Consistent**: Matches existing GeneFoundry design system

---

## Section Layout

### Placement
Between **ImpactGrid** and **FooterSection** — after demonstrating value, introduce the team.

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                       "Meet the Team"                            │
│     Supported by leading experts in AI, genomics & medicine     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    ┌──────────────────────────────────────────────────────┐     │
│    │                                                       │     │
│    │                  ★ LEAD APPLICANT                    │     │
│    │                    Dr. Nina Rank                      │     │
│    │             Digital Clinician Scientist              │     │
│    │                                                       │     │
│    └──────────────────────────────────────────────────────┘     │
│                                                                  │
│                    MENTORS & COLLABORATORS                       │
│    ┌────────────────┐ ┌────────────────┐ ┌────────────────┐     │
│    │  Bernt Popp    │ │ Sören Lukassen │ │ Jan Halbritter │     │
│    │   [Mentor]     │ │    [Mentor]    │ │    [Mentor]    │     │
│    └────────────────┘ └────────────────┘ └────────────────┘     │
│                                                                  │
│    ┌──────────────────────────────────────────────────────┐     │
│    │        Charité — Universitätsmedizin Berlin          │     │
│    │        Berlin Institute of Health (BIH)              │     │
│    └──────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Investigator Cards

### Lead Applicant (Featured)

| Field | Content |
|-------|---------|
| **Image** | `src/assets/team/1.webp` (imported) |
| **Name** | Dr. med. Nina Rank |
| **Title** | MD/PhD, Digital Clinician Scientist |
| **Role Badge** | "Lead Applicant" (primary color pill) |
| **Tagline** | Driving GeneFoundry from concept to clinical practice |
| **Expertise Tags** | `Rare Diseases` `Clinical Genomics` `Translational Medicine` |
| **Affiliation** | Charité — Digital Junior Clinician Scientist Program |

**Visual Treatment:**
- Full-width card on mobile, centered wider card on desktop
- Subtle primary color (#BE3E82) gradient border or glow
- Larger photo (120px circle → 160px)
- "★ Lead Applicant" label above name

---

### Mentors & Collaborators (Grid of 3)

#### Card 1: Dr. med. Bernt Popp
| Field | Content |
|-------|---------|
| **Image** | `src/assets/team/2.webp` (imported) |
| **Name** | Dr. med. Bernt Popp |
| **Title** | MD, Board-Certified Geneticist |
| **Expertise Tags** | `Human Genetics` `Bioinformatics` `NGS Analysis` |
| **One-liner** | Rare disease diagnostics & sequencing pipelines |
| **Affiliation** | BIH Center for Digital Health & Labor Berlin |

#### Card 2: Dr. rer. nat. Sören Lukassen
| Field | Content |
|-------|---------|
| **Image** | `src/assets/team/3.webp` (imported) |
| **Name** | Dr. rer. nat. Sören Lukassen |
| **Title** | PhD, Group Leader |
| **Expertise Tags** | `Medical AI` `Omics Integration` `Decision Support` |
| **One-liner** | AI-driven analysis of biomedical datasets |
| **Affiliation** | BIH Center for Digital Health |

#### Card 3: Prof. Dr. med. Jan Halbritter
| Field | Content |
|-------|---------|
| **Image** | `src/assets/team/4.webp` (imported) |
| **Name** | Prof. Dr. med. Jan Halbritter |
| **Title** | MD, Heisenberg Professor |
| **Expertise Tags** | `Nephrology` `Rare Kidney Disease` `CeRKiD` |
| **One-liner** | Scientific Lead, Center for Rare Kidney Diseases |
| **Affiliation** | Charité — Universitätsmedizin Berlin |

---

## Visual Design Specifications

### Card Component

```
┌─────────────────────────────────┐
│         ┌─────────┐             │
│         │  PHOTO  │             │  ← 96px circle, object-cover
│         │  (96px) │             │     grayscale → color on hover
│         └─────────┘             │
│                                 │
│      Dr. Nina Rank              │  ← font-bold text-secondary
│      MD/PhD, Principal Inv.     │  ← text-sm text-slate-500
│                                 │
│  ┌────────┐ ┌────────┐          │  ← expertise pills
│  │ Tag 1  │ │ Tag 2  │          │     bg-primary/10 text-primary
│  └────────┘ └────────┘          │     text-xs rounded-full px-2
│                                 │
│  "One-liner description..."     │  ← text-slate-600 text-sm
│                                 │
└─────────────────────────────────┘
```

### Hover Effects
- Card: `hover:shadow-lg hover:border-primary/20 transition-all`
- Photo: `grayscale hover:grayscale-0 transition-all duration-300`
- Subtle scale: `group-hover:scale-105` on image

### Color Palette (existing design system)
- Primary: `#BE3E82` (magenta)
- Secondary: `#334155` (slate-700)
- Background: `bg-slate-50` (section) / `bg-white` (cards)
- Expertise pills: `bg-primary/10 text-primary`

### Typography
- Section heading: `text-3xl font-bold text-secondary`
- Card name: `text-lg font-bold text-secondary`
- Card title: `text-sm text-slate-500`
- One-liner: `text-sm text-slate-600`
- Expertise tags: `text-xs font-medium`

---

## Responsive Behavior

### Desktop (lg+)
- PI card: centered, max-w-2xl
- Co-I cards: 3-column grid

### Tablet (md)
- PI card: full width
- Co-I cards: 3-column grid (smaller cards)

### Mobile (sm)
- PI card: full width, stacked layout
- Co-I cards: single column, horizontal card layout

---

## Institutional Footer Strip

A subtle strip below the cards reinforcing credibility:

```html
<div class="mt-8 flex justify-center gap-8 opacity-60">
  <span>Charité — Universitätsmedizin Berlin</span>
  <span>•</span>
  <span>Berlin Institute of Health (BIH)</span>
</div>
```

---

## Accessibility Considerations

- All images have descriptive `alt` text
- Grayscale filter respects `prefers-reduced-motion`
- Focus states visible on all interactive elements
- Color contrast meets WCAG AA for all text

---

## Implementation Notes

### File: `src/components/TeamSection.vue`

```typescript
// Import team images directly for proper Vite asset handling
// Using WebP format for optimal compression (70% smaller than JPG)
import ninaRankImg from '../assets/team/1.webp'
import berntPoppImg from '../assets/team/2.webp'
import soerenLukassenImg from '../assets/team/3.webp'
import janHalbritterImg from '../assets/team/4.webp'

// Data structure for team members
interface TeamMember {
  id: string
  name: string
  title: string
  image: string
  role: 'lead' | 'mentor'
  expertise: string[]
  tagline: string
  affiliation?: string
}

const team: TeamMember[] = [
  {
    id: 'nina-rank',
    name: 'Dr. med. Nina Rank',
    title: 'MD/PhD, Digital Clinician Scientist',
    image: ninaRankImg,
    role: 'lead',
    expertise: ['Rare Diseases', 'Clinical Genomics', 'Translational Medicine'],
    tagline: 'Driving GeneFoundry from concept to clinical practice',
    affiliation: 'Charité — Digital Junior Clinician Scientist Program'
  },
  {
    id: 'bernt-popp',
    name: 'Dr. med. Bernt Popp',
    title: 'MD, Board-Certified Geneticist',
    image: berntPoppImg,
    role: 'mentor',
    expertise: ['Human Genetics', 'Bioinformatics', 'NGS Analysis'],
    tagline: 'Rare disease diagnostics & sequencing pipelines',
    affiliation: 'BIH Center for Digital Health & Labor Berlin'
  },
  {
    id: 'soeren-lukassen',
    name: 'Dr. rer. nat. Sören Lukassen',
    title: 'PhD, Group Leader',
    image: soerenLukassenImg,
    role: 'mentor',
    expertise: ['Medical AI', 'Omics Integration', 'Decision Support'],
    tagline: 'AI-driven analysis of biomedical datasets',
    affiliation: 'BIH Center for Digital Health'
  },
  {
    id: 'jan-halbritter',
    name: 'Prof. Dr. med. Jan Halbritter',
    title: 'MD, Heisenberg Professor',
    image: janHalbritterImg,
    role: 'mentor',
    expertise: ['Nephrology', 'Rare Kidney Disease', 'CeRKiD'],
    tagline: 'Scientific Lead, Center for Rare Kidney Diseases',
    affiliation: 'Charité — Universitätsmedizin Berlin'
  }
]
```

### Integration in App.vue

```vue
<template>
  <main>
    <HeroSection />
    <MethodologyFlow />
    <RoleSwitcher />
    <ImpactGrid />
    <TeamSection />  <!-- NEW -->
  </main>
  <FooterSection />
</template>
```

### Nav Update
Add "Team" link to NavBar pointing to `#team`

---

## Alternative Designs Considered

### Option A: Horizontal Timeline
Shows career progression — rejected as too complex for quick scanning.

### Option B: Org Chart Style
Shows reporting structure — rejected as overly corporate for academic context.

### Option C: Card Grid (Selected)
Clean, scannable, matches existing design. PI featured prominently.

---

## Success Metrics

- Stakeholders can identify PI within 2 seconds
- Complementary expertise is visually obvious
- Mobile experience maintains hierarchy
- Section loads without layout shift (CLS = 0)

---

## Sources & Inspiration

- [Superside - Landing Page Design Examples](https://www.superside.com/blog/landing-page-design-examples)
- [Landingi - 25 Landing Page Best Practices](https://landingi.com/landing-page/41-best-practices/)
- [NIH - Advice on Application Sections](https://grants.nih.gov/grants-process/write-application/advice-on-application-sections)
- [Eleken - Card UI Design Examples](https://www.eleken.co/blog-posts/card-ui-examples-and-best-practices-for-product-owners)
- [FreeFrontend - CSS Card Hover Effects](https://freefrontend.com/css-card-hover-effects/)
