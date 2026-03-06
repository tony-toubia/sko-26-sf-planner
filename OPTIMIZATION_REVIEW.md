# SKO-26 SF Planner: Strategic Optimization Review

> **Perspective:** Product Owner, Cross-Functional Architect, Strategic Agency Consultant
> **Date:** March 2026
> **Scope:** Technology performance + capability optimization

---

## Executive Assessment

This tool — a Salesforce Marketing & Personalization Maturity Navigator — is a **high-value strategic asset** for Merkle's consultative selling motion. It encodes deep domain expertise (maturity frameworks, ROI benchmarks, industry playbooks) into a guided assessment that generates AI-powered implementation roadmaps. That said, the current implementation has significant opportunities for optimization across both technology performance and strategic capability.

**Current State Summary:**
- ~40K lines of code across 50+ components and data files
- React 19 + Vite + Tailwind frontend, Vercel Edge Functions backend
- Claude API integration for plan generation and chat
- Supabase for persistence
- Zero test coverage
- No code splitting, no routing library, no caching strategy
- Monolithic state management through a single React Context
- 8,900+ lines of static reference data shipped to every client

---

## Part 1: Technology Performance Optimizations

### 1.1 Bundle Size — Critical

**Problem:** All reference data (~8,900 lines across 7 data files) is statically imported and shipped in the main bundle. `capabilities.ts` alone is 1,939 lines of structured data. Every user downloads the full industry reference data, all track definitions, all service catalogs, and all ROI benchmarks on first load — even if they only assess one industry.

**Recommendations:**
- **Lazy-load data modules** per industry/track using dynamic `import()`. A Retail assessment shouldn't download Healthcare or Financial Services data.
- **Move reference data to Supabase** (you already have the admin UI for it). Fetch on demand via API, cache client-side with `stale-while-revalidate`.
- **Tree-shake the data layer** — split `capabilities.ts` into per-phase or per-track modules so Vite can eliminate unused code paths.
- **Estimated impact:** 40-60% reduction in initial JS payload.

### 1.2 No Code Splitting or Client-Side Routing

**Problem:** `App.tsx` uses `window.location.pathname` for routing (lines 17-18) and renders all views eagerly. There is no `React.lazy()`, no `Suspense`, no proper router. The Admin panel, Pipeline view, AI Assistant, and Value slides are all bundled into the main chunk.

**Recommendations:**
- **Add React Router** (or TanStack Router) for proper client-side routing with code-split entry points.
- **Lazy-load secondary views:** Admin, Pipeline, AI Assistant, and ValueRealizationSlides should be `React.lazy()` imports — they're rarely accessed in the same session as the assessment flow.
- **Route-based prefetching:** Preload the next likely view (e.g., once assessment starts, prefetch PlanOutput).
- **Estimated impact:** 30-50% faster initial paint for the primary assessment flow.

### 1.3 Monolithic State Context — Re-render Risk

**Problem:** `AssessmentContext.tsx` (1,353 lines) is a single React Context managing *everything*: assessment state, persistence, AI plan generation, user email, track assessments, UI modals, and Supabase operations. Any state change triggers a re-render of every consuming component.

**Recommendations:**
- **Split into domain-specific contexts:** `AssessmentStateContext`, `PersistenceContext`, `PlanGenerationContext`, `UIContext`.
- **Use `useMemo` and `useCallback`** on context values (some callbacks are already wrapped, but the context value object itself is recreated each render).
- **Consider Zustand or Jotai** for granular state subscriptions — components only re-render when the specific slice they consume changes.
- **Extract persistence logic** into a custom hook or service layer, not inside the context provider.

### 1.4 API Plan Generation Endpoint — Bloated

**Problem:** `generate-plan.ts` is 797 lines, embedding ROI benchmarks, journey guidance, and prompt templates as inline string literals within the edge function. This means:
- Every cold start parses ~800 lines of code including large template strings.
- Prompt engineering is mixed with API logic — changes to one risk breaking the other.
- No streaming — users wait for the full Claude response before seeing anything.

**Recommendations:**
- **Separate prompts into versioned templates** stored externally (Supabase, S3, or a dedicated prompts file). This also enables A/B testing different prompts.
- **Stream the Claude response** using Anthropic's streaming API — show the plan building in real-time instead of a loading spinner for 30-60 seconds.
- **Implement response caching** — the same assessment inputs should return a cached plan within a TTL (you have `getCachedPlan`/`cachePlan` imports but unclear if fully utilized).
- **Add structured error handling** with retry logic and fallback to the local `planGenerator.ts`.

### 1.5 No Vite Build Optimization

**Problem:** `vite.config.ts` is 3 lines — zero optimization configuration.

**Recommendations:**
```typescript
// Suggested vite.config.ts enhancements
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-radix': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'data-reference': ['./src/data/capabilities', './src/data/reference', './src/data/industryReference'],
        }
      }
    },
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
  }
}
```

### 1.6 Zero Test Coverage

**Problem:** There are no test files anywhere in the project. No unit tests, no integration tests, no E2E tests. The `package.json` has no test runner dependency (no Vitest, Jest, Playwright, or Cypress).

**Recommendations:**
- **Add Vitest** (natural fit with Vite) for unit and component tests.
- **Priority test targets:**
  1. `planGenerator.ts` — the local plan generation logic
  2. `AssessmentContext.tsx` — state transitions and persistence logic
  3. `assessmentService.ts` — Supabase CRUD operations
  4. Data validation — ensure capabilities have valid IDs, required fields, no orphaned dependencies
- **Add Playwright** for E2E testing of the assessment flow.
- **This is a risk:** With 40K+ lines and zero tests, any refactoring is a dice roll.

### 1.7 No Authentication or Authorization

**Problem:** The admin panel uses a simple password gate (`PasswordGate.tsx`). Supabase anon keys are used without RLS policies being clearly enforced. Anyone with the URL can access the pipeline and potentially other users' assessments.

**Recommendations:**
- **Implement Supabase Auth** with email/magic link for consultants.
- **Add Row Level Security** (RLS) policies so consultants only see their own assessments.
- **Replace the password gate** with proper role-based access (admin vs. consultant).
- **Protect the API endpoints** — currently `generate-plan.ts` and `chat.ts` appear to accept unauthenticated requests.

---

## Part 2: Capability & Product Optimizations

### 2.1 Multi-Tenant Pipeline — The Biggest Product Gap

**As a Product Owner:** The pipeline view (`OpportunityPipeline.tsx`) is the feature with the highest growth leverage, but it's currently a simple visualization. It should become the **consultants' home base**.

**Recommendations:**
- **Dashboard-first experience:** Consultants should log in and see their active engagements, not the landing page.
- **Assessment lifecycle management:** Draft → In Progress → Review → Delivered → Won/Lost.
- **Collaborative assessments:** Allow multiple consultants to work on the same assessment (real-time collaboration via Supabase Realtime).
- **Assessment templates:** Save and reuse assessment patterns by industry (e.g., "Retail Quick Assessment," "Enterprise Full Discovery").
- **Export pipeline to Salesforce CRM** — close the loop between this tool and Merkle's own sales process.

### 2.2 Plan Generation — From Good to Differentiated

**As a Strategic Consultant:** The AI-generated plan is the money shot of this tool. It should be dramatically more sophisticated.

**Recommendations:**
- **Competitive benchmarking:** "Companies at your maturity level in [industry] typically see [X] results by implementing [Y]." Pull from anonymized aggregated data across past assessments.
- **Phased investment modeling:** Show a cost curve — "Phase 1: $X, Phase 2: $Y" with ROI payback timeline visualization. Currently the commercial summary exists in the plan schema but isn't prominently surfaced.
- **Interactive plan refinement:** Let the consultant adjust priorities, swap phases, or remove capabilities in the generated plan and have the AI re-optimize. Currently it's generate-once.
- **Exportable deliverables:** Generate a branded PDF/PowerPoint deck directly from the plan. The `ValueRealizationSlides` component exists but isn't integrated with the AI plan.
- **Plan comparison:** Allow generating multiple plan variants (aggressive, conservative, phased) and compare side-by-side.

### 2.3 Assessment Intelligence — Learn from Every Assessment

**As a Cross-Functional Architect:** The tool currently treats each assessment as isolated. The aggregate data across all assessments is extremely valuable.

**Recommendations:**
- **Industry benchmarking engine:** "72% of Retail clients at your maturity level prioritize lifecycle journeys before dynamic content." Aggregate anonymized assessment data.
- **Recommendation confidence scores:** Based on how many similar clients followed a similar path and their outcomes.
- **Assessment analytics dashboard:** Which capabilities are most commonly assessed? Where do consultants spend the most time? What's the average assessment completion rate?
- **Trend detection:** Are more clients choosing MC Advanced vs. MC Engagement over time? Which industries are growing fastest?

### 2.4 MCP Knowledge Server — Underutilized Asset

**Problem:** The `mcp-knowledge-server/` exists (712 lines) but appears disconnected from the main application flow. It's designed for AI agent use but not integrated into the consultant experience.

**Recommendations:**
- **Power the AI Assistant** with the MCP server as a retrieval layer — give the chat bot structured access to all Merkle methodology, not just what's in the prompt.
- **Use it as RAG backend** for plan generation — retrieve relevant case studies, benchmarks, and methodology based on the specific assessment context.
- **Expose it as an API** for other Merkle tools and workflows.

### 2.5 Offline / Low-Connectivity Support

**As a Strategic Consultant:** Consultants often run assessments during in-person client meetings — hotel conference rooms, client offices with guest WiFi restrictions, airports.

**Recommendations:**
- **PWA with service worker** — cache the assessment UI and data for offline use.
- **Local-first architecture:** Run the assessment locally, sync to Supabase when connected. The local `planGenerator.ts` already exists as a fallback.
- **Queue AI plan generation** when offline, execute when connectivity returns.

### 2.6 Multi-Cloud Expansion Strategy

**Problem:** The OVERHAUL_PLAN.md mentions future expansion to Loyalty, Commerce, Service, and B2B clouds, but the architecture doesn't cleanly support it.

**Recommendations:**
- **Plugin architecture:** Each cloud should be a self-contained module with its own capabilities, tracks, and assessment questions. The core assessment engine should be cloud-agnostic.
- **Shared type system:** The existing types in `types/index.ts` already include `DisciplineType` — formalize this as the extension point.
- **Cross-cloud dependency graph:** When a client's M&P assessment reveals commerce data gaps, the tool should suggest the Commerce cloud assessment as a natural next step.
- **Unified plan generation:** A single plan that spans multiple clouds, showing dependencies and synergies.

---

## Part 3: Strategic Agency Recommendations

### 3.1 Productize This Tool

This isn't just an internal tool — it's a **productizable IP asset**.

- **Client-facing version:** A lightweight self-assessment that clients can run independently, with results feeding into the consultant's pipeline. This generates warm leads with pre-qualified maturity data.
- **Partner channel:** License the assessment framework to Salesforce SIs who lack this depth of M&P methodology.
- **Salesforce AppExchange listing:** Position Merkle's maturity framework as a Salesforce-native assessment tool.

### 3.2 Data Moat Strategy

Every assessment run through this tool generates structured data about market maturity distribution. Over time, this becomes a competitive moat.

- **Maturity Index Report:** Annual publication — "The State of Salesforce Marketing Cloud Maturity" by industry. Thought leadership that drives inbound.
- **Anonymized benchmarking:** "You're in the top 30% of Financial Services companies for lifecycle journey maturity." This is extremely compelling in sales conversations.
- **Predictive deal scoring:** Based on assessment patterns, predict which opportunities are most likely to close and at what deal size.

### 3.3 Integration with Merkle's Delivery Ecosystem

- **Connect to resource planning:** When a plan is generated, automatically estimate staffing needs and check availability against Merkle's resource management system.
- **SOW generation:** Auto-generate a Statement of Work skeleton from the plan's phases, timelines, and service recommendations.
- **Connect to Merkle's delivery playbooks:** Link each capability recommendation to internal implementation accelerators, templates, and reference architectures.

---

## Prioritized Roadmap

### Immediate (1-2 Sprints) — Performance & Foundation
| # | Item | Impact | Effort |
|---|------|--------|--------|
| 1 | Add Vitest + critical path tests | Risk reduction | Medium |
| 2 | Implement code splitting + React Router | Performance | Medium |
| 3 | Vite build optimization (manual chunks) | Performance | Low |
| 4 | Stream AI plan generation responses | UX | Medium |
| 5 | Split AssessmentContext into domain contexts | Maintainability | Medium |

### Short-Term (1-2 Months) — Capability Enhancement
| # | Item | Impact | Effort |
|---|------|--------|--------|
| 6 | Supabase Auth + RLS for multi-tenant security | Security | Medium |
| 7 | Move reference data to Supabase (dynamic loading) | Performance | Medium |
| 8 | Interactive plan refinement (drag/reorder/regenerate) | Differentiation | High |
| 9 | Branded PDF/PPT export from generated plans | Revenue enablement | High |
| 10 | Assessment templates by industry | Efficiency | Medium |

### Medium-Term (Quarter) — Strategic Capabilities
| # | Item | Impact | Effort |
|---|------|--------|--------|
| 11 | Assessment analytics + industry benchmarking engine | Data moat | High |
| 12 | MCP-powered RAG for plan generation | Quality | High |
| 13 | Client-facing self-assessment (lead gen) | Growth | High |
| 14 | Plugin architecture for multi-cloud expansion | Scale | Very High |
| 15 | PWA + offline support | Field usability | Medium |

---

## Summary

The SF Planner is a **strategically sound tool** with deep domain expertise encoded into its assessment framework. The biggest risks are:

1. **Technical debt** — zero tests, monolithic state, no code splitting — will slow every future feature.
2. **Isolated assessments** — the lack of aggregate intelligence across assessments means the tool doesn't get smarter over time.
3. **One-shot plans** — generating a plan should be the start of an interactive refinement, not the end.

The biggest opportunities are:

1. **Data moat** — aggregate assessment data becomes a proprietary benchmarking asset.
2. **Productization** — a client-facing self-assessment creates a lead gen flywheel.
3. **Streaming AI** — showing the plan build in real-time transforms a 30-second wait into an engaging experience.
4. **Multi-cloud expansion** — the plugin architecture positions this as Merkle's unified Salesforce advisory platform.

The tool has strong bones. The recommendations above focus on hardening the foundation while unlocking capabilities that transform it from an internal assessment tool into a strategic platform.
