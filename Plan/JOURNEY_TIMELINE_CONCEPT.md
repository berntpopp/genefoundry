# GeneFoundry Journey Timeline — Design Concept

## Strategic Rationale

### Why This Matters

A journey timeline serves **three critical stakeholder functions**:

1. **Credibility Signal** — Shows funders/reviewers that the project has momentum and a clear path forward ([Research Development & Grant Writing News](https://www.maxwell.syr.edu/uploadedFiles/Deckard%20Oct%202015%20-%20Timelines%20and%20Milestones%20in%20Proposals.pdf))

2. **Progress Transparency** — Demonstrates what has been accomplished, building trust with collaborators and the scientific community

3. **Vision Communication** — Paints a compelling picture of where the project is headed, crucial for ongoing funding and partnerships

### Target Audiences

| Audience | What They Care About |
|----------|---------------------|
| **Grant Reviewers** | Feasibility, realistic timelines, clear milestones |
| **Collaborators** | Current status, when they can engage |
| **Patients/Public** | When will this help them? Progress visibility |
| **Scientific Community** | Validation status, publication timeline |

> "A well-placed diagram will get reviewers to stop and take notice. Those visual breaks can make your proposal a lot more memorable." — [UC Davis Proposal Development](https://proposaldev.ucdavis.edu/news/grant-writing-tip-how-and-why-use-visuals-your-grant-proposal)

---

## Design Philosophy

### The "Forging" Metaphor Extended

The GeneFoundry brand uses forge/foundry imagery. The timeline extends this metaphor:

- **Past milestones** = "Raw materials gathered" (foundations laid)
- **Current phase** = "In the forge" (active development, glowing/animated)
- **Future milestones** = "The blueprint" (clear vision, lighter/outlined)

### Visual Language (Matching Existing Design System)

```
Colors:
├── Primary: #BE3E82 (magenta) — current milestone highlight
├── Secondary: #334155 (slate-700) — completed milestones
├── Slate-300: #cbd5e1 — future milestones (outlined)
├── Success: #22c55e (green-500) — completion checkmarks
└── Background: bg-slate-50 (section) / bg-white (cards)

Typography:
├── Section heading: text-3xl font-bold text-secondary
├── Milestone title: text-lg font-bold
├── Date: text-sm font-medium text-primary
└── Description: text-sm text-slate-600
```

---

## Section Layout

### Placement
Between **TeamSection** and **FooterSection** — after introducing the team, show their journey.

### Desktop View (lg+)
Horizontal timeline with milestone nodes connected by a progress line.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        "The Journey"                                         │
│         From concept to clinical impact — follow our progress.              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ●━━━━━━━●━━━━━━━●━━━━━━━◉━━━━━━━○━━━━━━━○━━━━━━━○                         │
│   │       │       │       │       │       │       │                         │
│  2024    2024    2024    NOW     2025    2025    2026                       │
│  Q1      Q2      Q3             Q1      Q3                                  │
│                                                                              │
│  Idea  Proposal  Selected  DCS   Program  POC   Clinical                    │
│        Written            Pitch  Start         Validation                   │
│                                                                              │
│        [Hover reveals detailed card with description]                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Legend:
● = Completed (solid, checkmark)
◉ = Current (pulsing, primary color)
○ = Upcoming (outlined, dashed connection)
```

### Mobile View (sm)
Vertical timeline with alternating left/right cards.

```
┌─────────────────────────────┐
│      "The Journey"          │
│   Follow our progress.      │
├─────────────────────────────┤
│                             │
│    ┌─────────────┐          │
│    │ Q1 2024     │          │
│    │ Idea        │ ●        │
│    │ Conceived   │ │        │
│    └─────────────┘ │        │
│                    │        │
│          ┌─────────┴──┐     │
│          │ Q2 2024    │     │
│        ● │ Proposal   │     │
│        │ │ Submitted  │     │
│        │ └────────────┘     │
│        │                    │
│    ┌───┴───────────┐        │
│    │ NOW           │        │
│    │ DCS Pitch     │ ◉      │
│    │ [pulsing]     │        │
│    └───────────────┘        │
│                             │
└─────────────────────────────┘
```

---

## Milestone Structure

### Data Model

```typescript
interface Milestone {
  id: string
  title: string
  shortTitle: string        // For mobile/compact view
  date: string              // "Q1 2024" or "Dec 2024"
  description: string       // 1-2 sentences
  status: 'completed' | 'current' | 'upcoming'
  icon: string              // Lucide icon name
  details?: string[]        // Optional bullet points for expansion
}
```

### Suggested Milestone Sequence

| # | Phase | Icon | Status Type | Description |
|---|-------|------|-------------|-------------|
| 1 | **Concept & Vision** | `Lightbulb` | completed | Initial idea development, problem identification |
| 2 | **Proposal Writing** | `FileEdit` | completed | DCS application preparation, methodology design |
| 3 | **Submission** | `Send` | completed | Proposal submitted to BIH DCS program |
| 4 | **Selection** | `Award` | completed | Proposal selected for committee presentation |
| 5 | **DCS Pitch** | `Presentation` | current | Presentation to Digital Clinician Scientist committee |
| 6 | **Program Start** | `Rocket` | upcoming | Official program kickoff, team assembly |
| 7 | **Core Development** | `Code` | upcoming | MCP development, integration, testing |
| 8 | **Proof of Concept** | `FlaskConical` | upcoming | Initial validation in controlled environment |
| 9 | **Clinical Pilot** | `Stethoscope` | upcoming | Testing with CeRKiD cohort |
| 10 | **Publication** | `BookOpen` | upcoming | Results publication, community release |

---

## Interactive Behaviors

### Desktop Interactions

1. **Hover on milestone node**
   - Node scales up slightly (`scale-110`)
   - Card appears below with full details
   - Connection line highlights to that point

2. **Current milestone**
   - Pulsing animation (gentle glow)
   - Always shows card (not hidden)
   - "You are here" indicator

3. **Completed milestones**
   - Checkmark overlay on icon
   - Solid connection line
   - Hover reveals achievement details

4. **Upcoming milestones**
   - Outlined/dashed style
   - Dashed connection line
   - Hover shows projected timeline

### Mobile Interactions

- Tap to expand milestone card
- Scroll-triggered animations (fade in as visible)
- Current milestone auto-expanded

### Accessibility

- Full keyboard navigation (arrow keys move between milestones)
- Screen reader announces: "Milestone 3 of 10: Selection, completed, Q3 2024"
- Respects `prefers-reduced-motion` (disables pulse animation)
- Focus indicators visible on all interactive elements

---

## Visual Design Specifications

### Milestone Node Styles

```css
/* Completed */
.milestone-completed {
  @apply bg-slate-700 text-white border-2 border-slate-700;
  /* Checkmark overlay */
}

/* Current */
.milestone-current {
  @apply bg-primary text-white border-2 border-primary;
  animation: pulse 2s ease-in-out infinite;
}

/* Upcoming */
.milestone-upcoming {
  @apply bg-white text-slate-400 border-2 border-dashed border-slate-300;
}
```

### Connection Line

```css
/* Completed section */
.connection-completed {
  @apply bg-slate-700 h-1;
}

/* Current section */
.connection-current {
  @apply bg-gradient-to-r from-slate-700 to-primary h-1;
}

/* Upcoming section */
.connection-upcoming {
  @apply border-t-2 border-dashed border-slate-300;
}
```

### Milestone Card

```
┌─────────────────────────────────────┐
│  🏆  SELECTION                      │  ← Icon + Title
│  ───────────────────────────────    │
│  Q3 2024                            │  ← Date (primary color)
│                                     │
│  Proposal selected for committee    │  ← Description
│  presentation from competitive      │
│  applicant pool.                    │
│                                     │
│  ✓ Passed scientific review         │  ← Optional details
│  ✓ Budget approved                  │
│  ✓ Mentors confirmed               │
└─────────────────────────────────────┘
```

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Layout | Behavior |
|------------|--------|----------|
| `lg+` (1024px+) | Horizontal | Full timeline, hover cards |
| `md` (768px) | Horizontal compact | Smaller nodes, click to expand |
| `sm` (< 768px) | Vertical | Stacked cards, alternating sides |

### Mobile-First Implementation

```vue
<template>
  <!-- Mobile: Vertical -->
  <div class="md:hidden">
    <VerticalTimeline :milestones="milestones" />
  </div>

  <!-- Desktop: Horizontal -->
  <div class="hidden md:block">
    <HorizontalTimeline :milestones="milestones" />
  </div>
</template>
```

---

## Animation Specifications

### Current Milestone Pulse

```css
@keyframes milestone-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(190, 62, 130, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(190, 62, 130, 0);
  }
}
```

### Scroll-Triggered Fade In

```css
.milestone-enter {
  opacity: 0;
  transform: translateY(20px);
}

.milestone-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s ease-out;
}
```

### Progress Line Animation

On page load, the progress line "draws" from left to right up to the current milestone.

```css
@keyframes draw-progress {
  from { width: 0; }
  to { width: var(--progress-width); }
}
```

---

## Stakeholder-Specific Messaging

### For Grant Reviewers

> "Clear milestones demonstrate project feasibility and thoughtful planning."

Include in tooltip/card:
- Specific deliverables per phase
- Risk mitigation strategies
- Dependencies clearly marked

### For Collaborators

> "See where we are and when you can contribute."

Highlight:
- "Join us" call-to-action at appropriate milestones
- Contact information for collaboration inquiries

### For Patients/Public

> "Follow our progress toward better diagnostics."

Emphasize:
- Patient impact at each milestone
- Plain language descriptions
- "What this means for you" framing

---

## Implementation Notes

### File Structure

```
src/components/
├── JourneyTimeline.vue        # Main component
├── timeline/
│   ├── HorizontalTimeline.vue # Desktop layout
│   ├── VerticalTimeline.vue   # Mobile layout
│   ├── MilestoneNode.vue      # Individual milestone
│   └── MilestoneCard.vue      # Detail card
```

### Integration in App.vue

```vue
<template>
  <main>
    <HeroSection />
    <MethodologyFlow />
    <RoleSwitcher />
    <ImpactGrid />
    <TeamSection />
    <JourneyTimeline />  <!-- NEW -->
  </main>
  <FooterSection />
</template>
```

### Nav Update

Add "Journey" link to NavBar pointing to `#journey`

---

## Success Metrics

- Users can identify current project status within 3 seconds
- Timeline communicates both credibility (past) and vision (future)
- Mobile experience maintains clarity and engagement
- Section loads without layout shift (CLS = 0)
- Accessible to screen readers and keyboard users

---

## Alternative Designs Considered

### Option A: Gantt Chart Style
Shows task durations — rejected as too complex for landing page context.

### Option B: Vertical-Only Timeline
Simpler implementation — rejected as less engaging on desktop.

### Option C: Interactive Roadmap Slider
Carousel-style navigation — rejected as potentially confusing for linear narrative.

### Option D: Horizontal + Vertical Hybrid (Selected)
Best of both worlds: engaging desktop experience, clear mobile layout.

---

## Sources & Inspiration

- [FreeFrontend - 90 CSS Timelines](https://freefrontend.com/css-timelines/)
- [CodyHouse - Horizontal Timeline](https://codyhouse.co/gem/horizontal-timeline/)
- [uiCookies - 30 Best Horizontal Timeline Examples](https://uicookies.com/horizontal-timeline/)
- [UC Davis - Using Visuals in Grant Proposals](https://proposaldev.ucdavis.edu/news/grant-writing-tip-how-and-why-use-visuals-your-grant-proposal)
- [University Affairs - Timelines for Grant Applications](https://universityaffairs.ca/career-advice/quick-yet-polished-timelines-for-grant-applications/)
- [V-Bio - Biotech Startup Lifecycle](https://www.v-bio.ventures/from-lab-to-market-the-life-cycle-of-a-biotech-startup/)
- [Ladybugz - Top Biotech Web Design Examples](https://www.ladybugz.com/best-biotech-website-examples-2024/)
- [JanBask - 10 Best Practices for Startup Landing Pages](https://www.janbaskdigitaldesign.com/blogs/design-landing-page-for-startup-business/)

---

## Next Steps

1. **User provides dates** for each milestone
2. Finalize milestone descriptions and details
3. Implement component with animations
4. Test across devices and screen readers
5. Integrate into main layout

---

## Final Milestones (With Dates)

```typescript
const milestones: Milestone[] = [
  // === PRE-PROGRAM PHASE (2025) ===
  {
    id: 'concept',
    title: 'Concept & Vision',
    shortTitle: 'Concept',
    date: 'May 2025',
    description: 'Initial idea development: solving AI hallucinations in genomic analysis through MCPs.',
    status: 'completed',
    icon: 'Lightbulb'
  },
  {
    id: 'proposal',
    title: 'Proposal Writing',
    shortTitle: 'Proposal',
    date: 'Jul 2025',
    description: 'DCS application preparation with methodology design and mentor alignment.',
    status: 'completed',
    icon: 'FileEdit'
  },
  {
    id: 'submission',
    title: 'Submission',
    shortTitle: 'Submit',
    date: 'Sep 2025',
    description: 'Proposal submitted to BIH Digital Clinician Scientist program.',
    status: 'completed',
    icon: 'Send'
  },
  {
    id: 'selection',
    title: 'Selection',
    shortTitle: 'Selected',
    date: 'Nov 2025',
    description: 'Proposal selected for committee presentation from competitive applicant pool.',
    status: 'current',
    icon: 'Award'
  },
  {
    id: 'pitch',
    title: 'DCS Committee Pitch',
    shortTitle: 'Pitch',
    date: 'Dec 2025',
    description: 'Presentation to Digital Clinician Scientist committee at BIH.',
    status: 'upcoming',
    icon: 'Presentation'
  },

  // === PROGRAM PHASE (2026-2029) ===
  {
    id: 'program-start',
    title: 'Program Kickoff',
    shortTitle: 'Kickoff',
    date: 'Q1 2026',
    description: 'Official DCS program start. Begin MCP core architecture design.',
    status: 'upcoming',
    icon: 'Rocket'
  },
  {
    id: 'mcp-development',
    title: 'MCP Registry Development',
    shortTitle: 'MCPs',
    date: 'Q2-Q4 2026',
    description: 'Develop MCP prototype and series of genomic data MCPs (gnomAD, ClinVar, etc.).',
    status: 'upcoming',
    icon: 'Code'
  },
  {
    id: 'benchmarking',
    title: 'Benchmarking & Evaluation',
    shortTitle: 'Benchmark',
    date: '2027',
    description: 'Benchmark LLMs, evaluate ACMG reports, genotype-phenotype correlation analysis.',
    status: 'upcoming',
    icon: 'FlaskConical'
  },
  {
    id: 'clinical-pilot',
    title: 'Clinical Application',
    shortTitle: 'Clinical',
    date: '2027-2028',
    description: 'Real-world application with CeRKiD cohort. In-depth analysis of unsolved cases.',
    status: 'upcoming',
    icon: 'Stethoscope'
  },
  {
    id: 'publication',
    title: 'Publication & Release',
    shortTitle: 'Publish',
    date: 'Q4 2028',
    description: 'Results publication, technical documentation, and open-source community release.',
    status: 'upcoming',
    icon: 'BookOpen'
  }
]
```

---

## Detailed Work Package Timeline (from DCS Proposal)

Based on the official project Gantt chart:

### MCP Registry (Primary deliverable)
| Task | Timeline |
|------|----------|
| Design MCP core architecture | Q1-Q2 2026 |
| Develop MCP prototype | Q3 2026 |
| Develop series of MCPs | Q4 2026 - Q1 2027 |

### Benchmark Data Set & Evaluation
| Task | Timeline |
|------|----------|
| Create variant set for benchmarking | Q2-Q3 2026 |
| Assemble genetic reports from Labor Berlin | Q3-Q4 2026 |
| Benchmark different LLMs (local, external) | Q2-Q3 2027 |
| Evaluate LLM-generated ACMG reports | Q3 2027 - Q1 2028 |

### Prompt Registry
| Task | Timeline |
|------|----------|
| Create & test role-specific prompt templates | Q4 2027 - Q2 2028 |

### Real-world Application
| Task | Timeline |
|------|----------|
| Identify unsolved cases in CeRKiD cohort | Q4 2026 - Q2 2027 |
| Pre-screening with N-CS | Q2-Q3 2027 |
| In-depth analysis with GeneFoundry | Q1-Q3 2028 |
| Final review with geneticist | Q3-Q4 2028 |

### Publication
| Task | Timeline |
|------|----------|
| User manual & technical documentation | Q2-Q3 2028 |
| Publication | Q4 2028 - Q1 2029 |

### Clinical Training (Parallel track)
- 50% Specialization in Internal Medicine and Nephrology
- Specialist exam: ~Q4 2027
