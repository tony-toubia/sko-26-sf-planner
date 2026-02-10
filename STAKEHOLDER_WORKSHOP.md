# M&P Maturity Navigator — Stakeholder Alignment Workshop

## Workshop Overview

**Duration:** 60–75 minutes
**Format:** Guided walkthrough + structured discussion + prioritization exercise
**Goal:** Align stakeholders and SMEs on the primary jobs-to-be-done for this tool so that the next iteration drives measurable value for customers and internal users.

**Attendees (suggested):**
- M&P Practice Leads / Delivery Leads
- Salesforce Solution Architects
- Data & Identity SMEs (Merkury/Data Cloud)
- Commercial / Pricing Stakeholders
- Client-Facing Strategists / Account Leads
- Content & Creative Operations Leads

---

## Pre-Read (distribute 2–3 days before)

Send a short brief (not this full doc) covering:

1. **What the tool does today** — A 2-minute Loom or 3-slide summary: "Consultant enters client info and industry, assesses 14 M&P capabilities across a maturity curve, answers contextual questions, and generates an AI-powered phased implementation roadmap with commercial recommendations."
2. **Where to try it** — Link to the deployed app so people can click through at their own pace.
3. **One question to come prepared with:** *"What is the single biggest gap between what this tool produces and what you need in order to use it with a real client?"*

---

## Agenda

### 1. Orient: What the Tool Does and How It Works (10 min)

**Facilitator-led live walkthrough. No slides — use the app.**

Walk through a realistic scenario end-to-end:

| Step | What to show | Why it matters |
|------|-------------|----------------|
| Landing & client setup | Industry selection, discipline picker | Sets the context that shapes everything downstream |
| Maturity matrix | 14 capabilities across 4 phases, above/below-the-line framing | This IS the mental model — make sure everyone groks it |
| Assessment flow | Quick status pass → deep-dive questions for a couple of capabilities | Show how questions adapt by industry |
| Global inputs | Commercial preferences, strategic context, resource level | These feed directly into the AI-generated plan |
| Plan generation | Show a pre-generated plan output | The "so what" — what the client or consultant actually gets |

**Key points to land:**
- The maturity curve (0–5) and four implementation phases are the backbone.
- "Above the waterline" = customer-facing activations; "below" = data & platform foundation.
- Assessment answers + industry context + reference data → AI generates a phased roadmap with commercial sizing.

### 2. Under the Hood: Reference Sources That Power the Tool (15 min)

**Purpose:** Most stakeholders don't know what's baked in. This is the "deeper dive" that reveals what's actually driving recommendations and where the gaps/inaccuracies may be.

Walk through the six reference domains. For each, show 1–2 concrete examples on screen and ask the room: *"Does this feel right? What's missing?"*

#### a. Capability Definitions (14 M&P capabilities)
- Each has: business value, ROI benchmarks, key features, prerequisites, Merkle offerings, assessment questions
- **Example to show:** "Build Baseline Subscriber Journeys" — its 5 journey types, the ROI claims (+320% welcome series transaction rate), the Merkle offerings
- **Probe:** Are these the right 14? Is anything missing (e.g., should "Consent & Preference Management" be explicit)? Are the descriptions how we'd actually talk to a client?

#### b. Industry Frameworks (7 industries)
- Each has: typical priorities, common challenges, regulatory considerations, capability emphasis (high/med/low), industry-specific question variants
- **Example to show:** Retail/CPG/QSR priorities vs. Financial Services — the tool tailors recommendations differently
- **Probe:** Are these priority rankings accurate? Are we missing industries that matter for near-term pipeline?

#### c. Services & Pricing Reference (Master Services Set)
- 5 service categories: Implementation, Retainer, Staff Aug, Advisory, Managed Services
- Sizing tiers (S/M/L/Enterprise) with hour ranges and cost ranges
- 6 complexity modifiers (e.g., "Migration Required" = 1.6x effort)
- **Example to show:** MC Advanced Migration sizing — Small ($80K–$120K, 8–10 weeks) vs. Large ($320K–$480K, 18–24 weeks), plus FinServ 1.3x multiplier
- **Probe:** Are these ranges current? Do the modifiers reflect real scoping factors? Is there a services catalog or rate card this should align to?

#### d. ROI Benchmarks (19 data points across 4 phases)
- Phase 2: +35% email-attributed revenue, +320% welcome series transaction rate
- Phase 3: 3X ROAS, 5–15% cart abandonment recovery
- Phase 4: +16% existing customer sales lift
- **Probe:** Can we stand behind these numbers? Are they sourced? Would a client or Salesforce AE push back? Do we need citation rigor?

#### e. Journey Prioritization Matrix (19 journey types)
- Each journey: lifecycle stage, effort/impact rating, data requirements, trigger type, applicable channels
- **Example to show:** Cart Abandonment (high effort, high impact, requires purchase data) vs. Birthday (low effort, high impact, subscriber data only)
- **Probe:** Is the effort/impact calibration accurate? Missing journey types?

#### f. Cross-Discipline Adjacencies (M&P ↔ Loyalty)
- 13 defined adjacency relationships
- Loyalty capabilities fully defined (29 capabilities) but not yet active in the tool
- **Probe:** Is Loyalty the right next discipline? Should Commerce or Data Cloud be prioritized instead?

### 3. Jobs-to-Be-Done: Who Uses This and For What? (15 min)

**Shift from "what does the tool contain" to "what do people need it to do."**

Facilitator frames 4 candidate jobs-to-be-done on a whiteboard/Miro board. Ask the room to pressure-test, merge, or add.

#### Candidate JTBD

| # | Job | Primary User | When | Current Gap |
|---|-----|-------------|------|-------------|
| **J1** | **Qualify & scope a new M&P engagement** — Quickly assess a prospect's current state and generate a credible phased roadmap with ballpark sizing to support a proposal or SOW | Strategist / Account Lead | Pre-sale, discovery | Plan output may not be "proposal-ready"; pricing ranges may not match current rate cards; no PDF/deck export |
| **J2** | **Run a structured client discovery workshop** — Use the assessment as a facilitation framework to walk a client through their maturity, surface gaps, and build shared understanding | Consultant / Solution Architect | Client workshop, early engagement | The UX is consultant-facing today — can a consultant actually share-screen this with a client? Is the language client-appropriate? |
| **J3** | **Generate a defensible implementation roadmap** — Produce a phased plan that a delivery team can actually use to estimate, staff, and execute against | Delivery Lead / Practice Lead | Post-sale, project initiation | AI-generated plans may lack specificity; service sizing may not reflect real delivery experience; no integration with delivery tooling |
| **J4** | **Maintain a living maturity benchmark for the practice** — Keep the reference data, ROI benchmarks, industry frameworks, and pricing current so the tool stays credible over time | Practice Lead / SME Owners | Quarterly maintenance | No governance model; no clear owners for each data domain; reference data is hardcoded in TypeScript files |

**Discussion prompts:**
- Which of these jobs matters most to your role?
- Are there jobs we're missing entirely? (e.g., Salesforce AE co-selling, client self-service assessment, QBR value tracking)
- For each job, what's the minimum bar of quality before you'd actually use this tool instead of building a deck manually?

### 4. Prioritization: What Gets Us to "Actually Usable" (15 min)

**Exercise: Dot-vote or forced-rank the following improvement areas.**

Give each person 5 votes (dots) to distribute across these areas. They can stack votes.

| Area | Description | Impacts Jobs |
|------|-------------|-------------|
| **A. Reference Data Accuracy** | Audit and correct all pricing, ROI benchmarks, capability descriptions, and industry frameworks against current Merkle standards | J1, J2, J3, J4 |
| **B. Plan Output Quality** | Improve AI-generated plans to be proposal-ready — better structure, more specific recommendations, defensible sizing, exportable format | J1, J3 |
| **C. Assessment Question Refinement** | Ensure questions surface the right signals to generate accurate recommendations — remove noise, add missing probes | J1, J2, J3 |
| **D. Client-Facing UX** | Make the tool suitable for share-screen or direct client use — language, visual polish, guided experience | J2 |
| **E. Services Catalog Alignment** | Align service offerings, sizing, and pricing with the actual Merkle services catalog and rate cards | J1, J3 |
| **F. Governance & Maintenance Model** | Define who owns each data domain, how updates get made, and what the quarterly review cadence looks like | J4 |
| **G. Export & Integration** | PDF export, PowerPoint deck generation, CRM integration, delivery tool handoff | J1, J3 |
| **H. Loyalty / Next Discipline Expansion** | Activate Loyalty capabilities (already built) or prioritize a different discipline | J1, J2 |

**After voting, discuss:**
- What's the top 3? Can we sequence them?
- Are there quick wins (< 1 sprint) vs. deeper investments?
- Who owns each area going forward?

### 5. Next Steps & Ownership (5 min)

**Close with concrete commitments:**

| Decision | Output |
|----------|--------|
| **Priority areas** (top 3 from vote) | Write them down, these become the next sprint's focus |
| **Data domain owners** | Assign 1 person per reference domain (capabilities, industries, services, ROI, journeys) to audit and maintain |
| **Quarterly review cadence** | Agree on a recurring checkpoint (suggest quarterly, 30 min) to review data freshness and tool utility |
| **Next working session** | Schedule a follow-up within 2 weeks for the #1 priority area — likely a smaller group of SMEs doing a hands-on audit |

---

## Facilitator Notes

### Room Setup
- Screen-share the live app throughout — this is not a slide deck meeting
- Have a Miro/FigJam board or physical whiteboard for the JTBD and voting exercises
- Assign a notetaker who isn't the facilitator

### Common Pitfalls to Avoid
- **Don't let it become a feature request session.** The JTBD framing keeps the conversation anchored in "what problem are we solving" not "can we add a button for X."
- **Don't try to solve reference data accuracy in the room.** The goal is to identify which domains need an audit, not to do the audit live. That's a follow-up working session.
- **Don't skip the "under the hood" section.** People who haven't seen the reference data will default to surface-level feedback about the UI. The data is where the value lives or doesn't.

### Timing Flex
- If the group is energized by Section 3 (JTBD), let it run long and compress Section 4 to a simple "top 3" verbal poll
- If the group gets stuck debating reference data accuracy in Section 2, timebox it: "We're noting this as an audit item — let's move on"

---

## Appendix: Reference Data Inventory for Audit

This table summarizes every embedded data domain, its size, and suggested audit owner. Use this to assign ownership in Section 5.

| Domain | Source File | Scale | Key Question for Audit |
|--------|-----------|-------|----------------------|
| M&P Capabilities | `app/src/data/capabilities.ts` (1,940 lines) | 14 capabilities, each with 3–6 questions, ROI claims, Merkle offerings | Are descriptions, questions, and offerings current? |
| Loyalty Capabilities | `app/src/data/loyaltyCapabilities.ts` (2,194 lines) | 29 capabilities (not yet active) | Is Loyalty the right next discipline to activate? |
| Industry Frameworks | `app/src/data/industries.ts` + `industryReference.ts` (2,389 lines) | 7 industries with priorities, challenges, capability emphasis | Are priority rankings and challenges accurate? Missing industries? |
| Services & Pricing | `app/src/data/services.ts` (932 lines) | 5 categories, 3 size tiers, 6 complexity modifiers | Do ranges match current rate cards and delivery reality? |
| ROI Benchmarks | `app/src/data/reference.ts` (741 lines) | 19 benchmarks across 4 phases | Can we source and defend every number? |
| Journey Types | `app/src/data/reference.ts` | 19 journey types with effort/impact ratings | Is the prioritization matrix calibrated correctly? |
| Maturity Tracks | `app/src/data/tracks.ts` (1,045 lines) | 4 tracks × 3 levels with questions | Are track-based assessments needed alongside capability-based? |
| Adjacencies | `app/src/data/adjacencies.ts` (451 lines) | 13 M&P ↔ Loyalty relationships | Are these the right cross-discipline connections? |
| NBC V2 Reference PDFs | Root directory (12 PDF parts, ~18 MB) | Strategic frameworks for RAG grounding | Are these still current? Do they need refreshing? |
| MCP Knowledge Server | `mcp-knowledge-server/src/index.ts` | 6 RAG tools (capability guidance, channel recs, ROI benchmarks, etc.) | Is the knowledge server content aligned with the TypeScript data? |

---

## Appendix: Parking Lot Topics

These are topics that may come up but should be deferred to dedicated sessions:

- **AI prompt engineering** — How to improve Claude plan generation quality (technical session with engineering)
- **Supabase / persistence architecture** — Assessment storage, multi-user access, versioning (technical)
- **Salesforce AE co-selling motion** — How Salesforce reps could use or reference the tool (go-to-market session)
- **Client self-service** — Whether clients should access the tool directly vs. always consultant-mediated (product strategy)
- **Competitive positioning** — How this compares to Salesforce's own assessment tools or other SI offerings (strategy)
