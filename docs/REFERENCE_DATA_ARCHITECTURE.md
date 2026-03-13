# Reference Data Architecture & RAG System

This document explains how reference data flows through the SF Planner system, from the Admin UI to AI-generated plans.

---

## System Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Admin Panel   │────▶│    Supabase     │────▶│  API Endpoints  │
│   (/admin)      │     │   (PostgreSQL)  │     │  generate-plan  │
│                 │     │                 │     │  chat           │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │  Claude Sonnet  │
                                               │  (AI Generation)│
                                               └─────────────────┘
```

**Key Design Principle**: DB-first with hardcoded fallback. If Supabase is unavailable, the system falls back to inline TypeScript constants so it never breaks.

---

## The Six Reference Data Types

### 1. KPIs (Industry Performance Benchmarks)
**Table**: `ref_kpis`
**Admin**: KPIManager
**Purpose**: Industry-specific metrics that tell clients "what good looks like"

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Metric name | "Email Open Rate" |
| `industry` | Which industry | "retail-cpg-qsr" |
| `category` | Type of metric | engagement, conversion, retention, revenue |
| `benchmark` | Target range | "15-25% (retail), 20-30% (QSR)" |
| `howToMeasure` | Measurement guidance | "Unique opens / Delivered emails" |
| `improvementLevers` | Actionable tactics | ["Subject line optimization", "Send time optimization"] |

**In AI Prompt**: Formatted as markdown list showing benchmarks and improvement levers per industry.

---

### 2. ROI Benchmarks (Expected Improvement Metrics)
**Table**: `ref_roi_benchmarks`
**Admin**: BenchmarkManager
**Purpose**: Merkle/Salesforce-validated improvement numbers to set expectations

| Field | Description | Example |
|-------|-------------|---------|
| `metric` | What improves | "Email-Attributed Revenue" |
| `value` | Improvement amount | "+35%" |
| `context` | How achieved | "Through journey optimization and personalization" |
| `phase` | Implementation phase (1-4) | 2 (Activation) |
| `source` | Data source | "merkle-benchmark", "salesforce-benchmark", "industry-average" |
| `industry` | Industry (nullable = general) | null (applies to all) |

**In AI Prompt**: Grouped by phase, showing what improvements to expect at each stage.

---

### 3. Tactics (Strategic Plays)
**Table**: `tactics`
**Admin**: TacticsManager
**Purpose**: Cross-discipline campaign strategies with expected outcomes

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Tactic name | "Cross-Channel Welcome & Enrollment" |
| `description` | What it does | "Orchestrate multi-touchpoint welcome experience..." |
| `disciplines[]` | Which clouds | ["messaging-personalization", "loyalty"] |
| `industries[]` | Applicable industries | ["retail-cpg-qsr", "travel-hospitality"] |
| `phases[]` | When to implement | [2] (Phase 2: Activation) |
| `maturityLevelMin/Max` | Maturity range (1-3) | 1 to 2 |
| `channelMix[]` | Channels used | ["email", "sms", "push"] |
| `expectedROI` | Outcome data | { metric: "Welcome Transaction Rate", value: "+320%", context: "vs promotional" } |
| `implementationEffort` | Complexity | "medium" |

**In AI Prompt**: Formatted as detailed tactical recommendations with channels, effort, and expected ROI.

---

### 4. Journey Templates (Industry-Specific Journeys)
**Table**: `ref_journey_templates`
**Admin**: JourneyManager
**Purpose**: Recommended automated journeys by industry with benchmarks

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Journey name | "Cart Abandonment" |
| `industry` | Which industry | "retail-cpg-qsr" |
| `relevance` | Priority level | "critical", "high", "medium", "low" |
| `benchmark` | Expected outcome | "5-15% recovery rate" |
| `notes` | Implementation guidance | "Multi-touch series with escalating incentives" |
| `channels[]` | Channels used | ["email", "sms"] |

**In AI Prompt**: Listed by relevance with benchmarks and implementation notes.

---

### 5. Channel Priorities (Industry Channel Strategy)
**Table**: `ref_channel_priorities`
**Admin**: ChannelPriorityManager
**Purpose**: Which channels matter most per industry

| Field | Description | Example |
|-------|-------------|---------|
| `industry` | Which industry | "retail-cpg-qsr" |
| `channel` | Channel type | "sms" |
| `priority` | Importance | "critical" |
| `notes` | Context | "98% open rate, time-sensitive offers, incremental reach" |

**In AI Prompt**: Formatted as prioritized channel list with rationale.

---

### 6. Offerings (Merkle Service Catalog)
**Table**: `ref_offerings`
**Admin**: OfferingManager
**Purpose**: Available services for plan recommendations

| Field | Description | Example |
|-------|-------------|---------|
| `type` | Service category | "implementation", "staff-aug", "retainer", "advisory" |
| `name` | Service name | "Customer Journey Implementation" |
| `sizing` | T-shirt size | "S", "M", "L" |
| `description` | What's included | "Starter journey pack: 1-3 journeys, 4-6 weeks, ~150-250 hrs" |
| `disciplines[]` | Which clouds | ["messaging-personalization"] |

**In AI Prompt**: Grouped by type, showing available services Claude can recommend.

---

## Understanding KPIs vs ROI Benchmarks vs Tactic ROI

This is a common point of confusion. Here's how they differ:

### KPIs: "What should we measure?"
- **Purpose**: Define the metrics a client should track
- **Time frame**: Ongoing measurement
- **Example**: "Email Open Rate should be 15-25%"
- **Use case**: Helps client understand current state vs industry standard
- **NOT projections** — these are reference benchmarks

### ROI Benchmarks: "What improvement can we expect?"
- **Purpose**: Set expectations for improvement from Merkle/Salesforce initiatives
- **Time frame**: Phase-based (tied to implementation roadmap)
- **Example**: "Phase 2: Email-Attributed Revenue improves +35%"
- **Use case**: Justify investment, show expected value by phase
- **Directional** — based on Merkle/Salesforce case studies, not client-specific

### Tactic-Level ROI: "What does this specific play achieve?"
- **Purpose**: Show the expected outcome of implementing a specific tactic
- **Time frame**: During/after tactic deployment
- **Example**: "Welcome Series tactic: +320% transaction rate vs promotional"
- **Use case**: Justify recommending a specific tactic over another
- **Directional** — benchmark from successful implementations

### Key Insight: No Client Input = No Real Projections

Currently, we don't collect client baseline KPIs (e.g., "your current open rate is 12%"). This means:

- We CAN'T say: "Your open rate will improve from 12% to 18%" (6 point lift)
- We CAN say: "Industry benchmark is 15-25%, and clients typically see +40% improvement"

**Future Enhancement**: Add a "Current State" input section where clients provide their actual KPIs. Then we could calculate projected business value:
```
Current email-attributed revenue: $5M
Expected improvement: +35%
Projected new revenue: $6.75M (+$1.75M)
```

For now, all metrics are **directional benchmarks**, not client-specific projections.

---

## How Data Flows to AI

### 1. Data Entry (Admin Panel)
Admin users at `/admin` manage all six data types through CRUD interfaces.

### 2. Storage (Supabase)
Data is stored in PostgreSQL tables with:
- Industry filtering (most tables)
- Discipline filtering (tactics, offerings)
- Maturity level filtering (tactics)
- Active/inactive status for soft deletes

### 3. Retrieval (API Layer)
When generating a plan or chat response:

```typescript
// api/lib/referenceData.ts
const refData = await fetchFormattedReferenceData({
  industry: "retail-cpg-qsr",      // Filter by client's industry
  disciplines: ["messaging-personalization"],
  maturityLevel: 2,                // Filter tactics by maturity
});
```

This returns **filtered, formatted markdown** for each data type.

### 4. Prompt Injection
The formatted markdown is injected into Claude's system prompt:

```
You are a senior Salesforce Marketing Cloud consultant...

## Industry KPIs
- **Email Open Rate** (engagement): 15-25% | Levers: Subject line, Send time

## ROI Benchmarks
- **Welcome Transaction Rate**: +320% vs promotional (Phase 2)

## Recommended Strategic Plays
### Cross-Channel Welcome
- Disciplines: messaging-personalization, loyalty
- Channels: email, sms, push
- Expected ROI: Welcome Transaction Rate +320%

## Available Service Offerings
### Implementation / Fixed-Bid
- **Customer Journey Implementation** (M): 5-10 journeys, 8-12 weeks

[Client assessment data follows...]
```

### 5. Plan Generation
Claude uses the reference data to:
1. Recommend appropriate tactics for the client's maturity and industry
2. Cite relevant ROI benchmarks to justify recommendations
3. Suggest specific service offerings
4. Reference industry KPIs as success metrics

---

## Caching & Performance

### Plan Cache
- **Table**: `plan_cache`
- **Key**: SHA-256 hash of normalized request (client + industry + assessments + quality)
- **TTL**: 7 days
- **Purpose**: Avoid re-generating identical plans

### Clear Cache
The Admin panel has a "Clear Plan Cache" button that wipes all cached plans. Use this after updating reference data to ensure new plans use fresh data.

### Reference Data Filtering
Data is filtered **before** prompt injection to minimize tokens:
- KPIs/Journeys/Channels: Filtered by industry
- Tactics: Filtered by industry, discipline, AND maturity level
- Offerings: Filtered by discipline

This "chunking" ensures Claude only sees relevant context, not the entire database.

---

## File Locations

| Component | Location |
|-----------|----------|
| Admin UI | `app/src/components/admin/` |
| Client-side data service | `app/src/lib/referenceDataService.ts` |
| Server-side data fetcher | `app/api/lib/referenceData.ts` |
| Plan generation API | `app/api/generate-plan.ts` |
| Chat API | `app/api/chat.ts` |
| Type definitions | `app/src/types/index.ts` |
| Database migrations | `app/supabase/migrations/` |
| Hardcoded fallbacks | `app/src/data/industryReference.ts` |

---

## Summary

| Data Type | Answers | Filtered By |
|-----------|---------|-------------|
| KPIs | "What metrics should we track?" | Industry |
| ROI Benchmarks | "What improvement can we expect by phase?" | Industry, Phase |
| Tactics | "What strategic plays should we run?" | Industry, Discipline, Maturity |
| Journey Templates | "What automations should we build?" | Industry |
| Channel Priorities | "Which channels matter most?" | Industry |
| Offerings | "What services can Merkle provide?" | Discipline |

All data is:
1. Managed via Admin UI
2. Stored in Supabase
3. Fetched and filtered at generation time
4. Formatted as markdown
5. Injected into Claude's system prompt
6. Used by Claude to generate contextual, data-driven plans
