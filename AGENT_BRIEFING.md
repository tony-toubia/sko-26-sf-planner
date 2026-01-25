# Marketing & Personalization Maturity Assessment - Agent Briefing

> This document provides essential context for AI agents working on this codebase. It summarizes the strategic framework, mental models, and key concepts needed to understand and extend the application.

## Purpose

This application helps Merkle consultants assess a client's Salesforce Marketing Cloud maturity and generate implementation recommendations. It guides clients from basic email marketing to sophisticated, AI-powered personalization.

## Core Mental Model

### The Maturity Curve (0-5)

```
5 - Transformed   : Custom predictive models, brand-unique experiences
4 - Strategic     : Cross-channel orchestration, competitive advantage
3 - Scaling       : Optimized systems, removing friction across functions
2 - Adopting      : Early successes, applying new capabilities
1 - Siloed        : Isolated single-channel programs
0 - Lagging       : Ignoring the imperative to evolve
```

### Four Implementation Phases

| Phase | Name | Focus | Key Outcome |
|-------|------|-------|-------------|
| 1 | Unlock Capabilities | Platform foundation | Data Cloud + MC Advanced ready |
| 2 | Activate Capabilities | Campaign & journey basics | Lifecycle journeys live |
| 3 | Consumer Expectations | Purchase-driven journeys | Behavioral triggers active |
| 4 | Future Proofing | Predictive & AI-native | CLV models, Agentforce |

### Above vs. Below the Line

```
ABOVE THE LINE (Visible to customers)
├── PERSONALIZE: Lifecycle journeys meeting customers in their moment
└── ENGAGE: Cross-channel 1:1 everywhere (SMS, ads, push, direct mail)

BELOW THE LINE (Infrastructure)
├── KNOW: Managing customers as a data asset
└── UTILIZE: Platform adoption and capability utilization
```

## Key Strategic Pillars

### KNOW - Manage Customers as Asset
- RFM segmentation (Recency, Frequency, Monetary)
- Engagement scoring and personas
- First-party data enhancement

### PERSONALIZE - Moment Orientation
- Welcome, birthday, re-engagement journeys
- Einstein Content Selection
- Purchase-triggered journeys

### ENGAGE - 1:1 Everywhere
- SMS for urgency (98% open rate)
- Ads for reach and retargeting
- Direct mail for high-value moments

### UTILIZE - Tech ROI
- Platform migration to unlock features
- Data integrations to power segmentation

## Channel Strategy Quick Reference

| Channel | Use When | Cost |
|---------|----------|------|
| Email | Rich content, cost efficiency, education | Included |
| SMS | Urgency, 98% visibility, time-sensitive | Incremental |
| Ads | Reach, retargeting, email-unengaged | Incremental |
| Push | App users, real-time, location-based | Included |
| Direct Mail | High-value, premium, complete win-back | Third-party |

## Expected ROI Benchmarks

### Phase 2 (Activate)
- +35% email-attributed revenue
- +40% open rate vs. industry
- +320% transaction rate from welcome series
- +481% transaction rate from birthday emails

### Phase 3 (Consumer Expectations)
- 3X return on ad spend
- +100% campaign efficiency (cross-channel)
- 5-15% cart abandonment recovery
- +25% repeat purchase rate

### Phase 4 (Future Proofing)
- +16% existing customer sales lift
- +5% lapsed customer sales lift

## Marketing Foundation Decision Point

The first capability assessed is the platform foundation:

| Option | Best For | Unlocks |
|--------|----------|---------|
| MC Engagement | Smaller orgs, budget-conscious | Journey Builder, Einstein basics |
| MC Advanced + Data Cloud | Enterprise, Agentforce-ready | Full Einstein suite, Agentforce, zero-copy |

## Data Sources

All structured reference data lives in `/app/src/data/`:

- `capabilities.ts` - All capabilities with questions, products, offerings
- `industries.ts` - Industry-specific priorities and use cases
- `constants.ts` - Maturity stages, phase definitions
- `reference.ts` - ROI benchmarks, journey types, channel strategies, key decisions

## Key Types

```typescript
// Core capability structure
interface Capability {
  id: string;
  name: string;
  phase: 1 | 2 | 3 | 4;
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  journeyType: 'above-the-line' | 'below-the-line';
  assessmentQuestions: AssessmentQuestion[];
  productsFeatures: ProductFeature[];
  merkleOfferings: MerkleOffering[];
}

// Assessment status options
type CapabilityRelevance =
  | 'immediately-relevant'  // Immediate priority
  | 'near-future'           // 6-12 month horizon
  | 'not-relevant'          // Not a fit currently
  | 'already-implemented'   // Already have this
  | 'not-assessed';         // Not yet evaluated
```

## Two-Phase Assessment UX

1. **Quick Status Pass**: User marks each capability's relevance status
2. **Deep Dive Questions**: Consolidated questionnaire for immediate/near-future capabilities

## Agent Guidelines

When working on this codebase:

1. **Respect the phase model** - Capabilities have dependencies; Phase 1 must come before Phase 2
2. **Use existing data structures** - Add to `capabilities.ts` or `reference.ts` rather than creating new files
3. **Maintain Merkle branding** - Use the established color scheme and terminology
4. **Keep UX focused on consultants** - The tool is for Merkle consultants assessing clients
5. **ROI claims must be sourced** - Reference benchmarks should come from `reference.ts`

## Common Extension Points

- Adding new capabilities: Extend `MESSAGING_PERSONALIZATION_CAPABILITIES` in `capabilities.ts`
- Adding industries: Extend `INDUSTRIES` in `industries.ts`
- Adding benchmarks: Extend `ROI_BENCHMARKS` in `reference.ts`
- New journey types: Extend `JOURNEY_TYPES` in `reference.ts`
