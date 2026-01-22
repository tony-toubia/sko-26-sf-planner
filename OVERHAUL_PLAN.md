# Salesforce M&P Maturity Matrix Tool - Overhaul Plan

## Executive Summary

This document outlines the comprehensive plan to transform the Salesforce Maturity Matrix Tool into a focused, Merkle-branded Messaging & Personalization (M&P) assessment and planning tool. The overhaul addresses UX flow issues, content depth, and strategic positioning while establishing a foundation for future expansion to other Salesforce clouds.

---

## 1. Scope Refinement: M&P Focus Only

### Current State
- 6 Salesforce disciplines defined (M&P, Loyalty, B2B, Commerce, Service, Data Cloud)
- Only M&P has fully populated capabilities
- DisciplineSelector creates confusion by showing unavailable options

### Target State
- **Remove all non-M&P disciplines** from the UI completely
- Keep data structures extensible for future disciplines
- Rename tool positioning: "Merkle M&P Maturity Navigator"

### Files to Modify
- `constants.ts` - Remove/hide other disciplines
- `DisciplineSelector.tsx` - Remove or repurpose
- `MaturityMatrix.tsx` - Simplify to single-discipline view
- `Header.tsx` - Update navigation

---

## 2. User Flow Redesign: Assessment-First Experience

### Current Problems
1. Users can browse cards without entering assessment mode
2. Two different experiences (browse vs assess) create confusion
3. Assessment mode is an afterthought, not the primary journey

### New Flow Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                          LANDING STATE                               │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │     "Start Your M&P Maturity Assessment"                    │   │
│  │                                                              │   │
│  │     [Client Name Input]                                      │   │
│  │     [Industry Selection - Retail/CPG/QSR focus]             │   │
│  │                                                              │   │
│  │     [BEGIN ASSESSMENT] (Primary CTA)                         │   │
│  │                                                              │   │
│  │     or                                                       │   │
│  │     [Explore Capabilities →] (Secondary link)               │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Value Proposition / Iceberg Preview                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MARKETING FOUNDATION DECISION                      │
│                                                                      │
│  "Choose Your Marketing Foundation"                                  │
│                                                                      │
│  ┌──────────────────────┐      ┌──────────────────────┐            │
│  │                      │      │                      │            │
│  │   MC ENGAGEMENT      │  OR  │   MC ADVANCED &      │            │
│  │   (Legacy)           │      │   DATA 360           │            │
│  │                      │      │                      │            │
│  │   - Existing SFMC    │      │   - Full MC Next     │            │
│  │   - Journey Builder  │      │   - Data Cloud       │            │
│  │   - Limited Einstein │      │   - Agentforce-ready │            │
│  │                      │      │   - Zero-copy data   │            │
│  │                      │      │                      │            │
│  │   [Select]           │      │   [Select]           │            │
│  │                      │      │   (Recommended)      │            │
│  └──────────────────────┘      └──────────────────────┘            │
│                                                                      │
│  Note: This choice affects available capabilities in subsequent phases│
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GUIDED MATURITY JOURNEY                           │
│                                                                      │
│  Visual progression through phases with capability cards             │
│  Always in "assessment context"                                      │
│  Click to assess each capability                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Changes
1. **Landing page** prompts assessment entry immediately
2. **Foundation decision** is the first assessment step
3. **Capability browsing** always happens within assessment context
4. **No separate "explore" mode** - everything is assessment-ready

---

## 3. Marketing Foundation Decision: The Path Split

### Concept
The first key decision determines the entire downstream capability path:

#### Option A: MC Engagement (Legacy)
- For clients with existing SFMC investment
- Journey Builder-based workflows
- Limited Einstein capabilities
- Traditional data extensions
- May not unlock all advanced capabilities

#### Option B: MC Advanced & Data 360 (Recommended)
- Full Marketing Cloud Next feature set
- Data Cloud foundation
- Agentforce-ready infrastructure
- Zero-copy data federation
- Unlocks all advanced capabilities

### Implementation
- Store choice in assessment state
- Filter/disable capabilities based on foundation choice
- Show alternative path recommendations
- Allow path switching with impact preview

---

## 4. Reimagined Maturity Matrix Visualization

### Current Problems
- 3x3 grid doesn't convey progression or dependencies well
- Phase colors exist but aren't leveraged for journey visualization
- Prerequisites/unlocks only visible on hover
- No sense of "journey" through maturity

### New Visualization: Journey Flow

```
                               PHASE 1                    PHASE 2                    PHASE 3                    PHASE 4
                          ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
                          │   FOUNDATION    │       │   ACTIVATION    │       │  OPTIMIZATION   │       │ TRANSFORMATION  │
                          └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
                                 │                         │                         │                         │
    ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                   ABOVE THE WATERLINE                                                  │
    │                                               (Customer-Facing Activations)                                           │
    │                                                                                                                        │
    │   ┌────────────────┐    ────────────►   ┌────────────────┐    ────────────►   ┌────────────────┐    ────────────►   │
    │   │  Baseline      │                    │  Enhanced      │                    │  Customer      │       INSIGHT     │
    │   │  Subscriber    │                    │  Planned       │                    │  Lifecycle     │       DRIVEN      │
    │   │  Journeys      │                    │  Campaigns     │                    │  Journeys      │     EXPERIENCES   │
    │   └────────────────┘                    └────────────────┘                    └────────────────┘                    │
    │          │                                      │                                     │                              │
    │          │                                      ▼                                     │                              │
    │          │                              ┌────────────────┐                           │                              │
    │          │                              │  Scale Dynamic │                           │                              │
    │          │                              │  Content       │                           │                              │
    │          │                              └────────────────┘                           │                              │
    │          │                                      │                                     │                              │
    │          │                              ┌────────────────┐               ┌────────────────┐                         │
    │          │                              │  Einstein      │               │  Cross-Channel │                         │
    │          │                              │  STO + Scoring │               │  Activation    │                         │
    │          │                              └────────────────┘               └────────────────┘                         │
    │                                                                                                                        │
    ├──────────────────────────────────────────────── WATERLINE ─────────────────────────────────────────────────────────────┤
    │                                                                                                                        │
    │                                                BELOW THE WATERLINE                                                     │
    │                                            (Data Management Foundation)                                               │
    │                                                                                                                        │
    │   ┌────────────────┐    ────────────►   ┌────────────────┐    ────────────►   ┌────────────────┐    ────────────►   │
    │   │  Marketing     │                    │  Extend Data   │                    │  Data          │     IDENTITY      │
    │   │  Foundation    │                    │  Integrations  │                    │  Exploration   │     RESOLUTION    │
    │   │  (Decision)    │                    │                │                    │                │     + MERKURY     │
    │   └────────────────┘                    └────────────────┘                    └────────────────┘                    │
    │                                                                                                                        │
    │                                         ┌────────────────┐                    ┌────────────────┐                      │
    │                                         │  Agentic       │                    │  CLV           │                      │
    │                                         │  Campaign      │                    │  Modeling      │                      │
    │                                         │  Production    │                    │                │                      │
    │                                         └────────────────┘                    └────────────────┘                      │
    │                                                                                                                        │
    └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    ◄─────────── Table Stakes (Consumer Expectations) ───────────►   ◄─────────── Differentiators (Brand-Unique) ───────────►
```

### Key Features
1. **Horizontal flow** shows clear progression through phases
2. **Waterline divider** separates activation (visible) from data (foundation)
3. **Dependency arrows** always visible between connected capabilities
4. **Phase groupings** make it clear what to tackle together
5. **Progress indicators** show assessment status on each card
6. **Adjacency callouts** hint at cross-matrix connections (e.g., "Loyalty →")

---

## 5. Merkle Branding Overhaul

### Current State
- Uses `#0077C8` (Merkle Blue) and `#00A5B5` (Merkle Teal)
- Generic Inter font
- Minimal brand presence

### Target Branding

#### Color Palette (from merkle.com)
```css
/* Primary */
--merkle-blue: #0057A3;      /* Deep blue - primary brand */
--merkle-cyan: #00B5E2;      /* Bright cyan - accent */

/* Secondary */
--merkle-dark: #1A1A1A;      /* Near-black text */
--merkle-gray: #6B7280;      /* Body text */
--merkle-light: #F5F7FA;     /* Background */

/* Accent for M&P */
--mp-purple: #7C3AED;        /* Personalization/AI accent */
--mp-emerald: #10B981;       /* Success/activation */

/* Status colors remain similar but refined */
```

#### Typography
```css
/* Headings */
font-family: 'Söhne', 'Inter', -apple-system, sans-serif;
font-weight: 600;

/* Body */
font-family: 'Inter', -apple-system, sans-serif;
font-weight: 400;
```

#### Visual Elements
- Add geometric shape accents (lotus, chrys patterns from Merkle brand)
- Use gradients sparingly for CTAs
- Card-based UI with subtle shadows
- Clean, professional aesthetic

#### Header Redesign
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [Merkle Logo]   M&P Maturity Navigator                                        │
│                                                                 [Pitch Deck]   │
│                                                                 [Help]         │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Enhanced Capability Content

### Common Enhancements for All Cards
1. **Products & Features Used** - SF product callouts (SF Personalization, Data Cloud, etc.)
2. **Merkle Differentiators** - Why Merkle specifically
3. **Industry Relevance** - Tailored to Retail/CPG/QSR
4. **Assessment Impact** - What this enables/unlocks

### Card-by-Card Content Updates

#### 6.1 Marketing Foundation (Decision Card)

**Current:** "Activate Data Cloud & MC Advanced"

**Updated:** "Choose Your Marketing Foundation"

This becomes a **decision point**, not just a capability:

```
Option A: MC Engagement (Legacy Path)
├── What it is: Existing SFMC with Journey Builder
├── When to choose: Already invested in SFMC, limited budget for migration
├── Limitations: No Agentforce, limited Einstein, data silos
├── Merkle support: Migration planning, optimization of existing
└── Downstream impact: Some Phase 3-4 capabilities unavailable

Option B: MC Advanced & Data 360 (Recommended Path)
├── What it is: Full Marketing Cloud Next + Data Cloud
├── When to choose: Ready for modern marketing stack, AI-native
├── Unlocks: Agentforce, zero-copy data, calculated insights
├── Merkle support: Full implementation, consumption management
└── Downstream impact: All capabilities available
```

**Merkle Value-Add:**
- Consumption management and cost optimization
- Strategic guidance on data integrations (Data 360 vs external systems like Snowflake)
- Commercial model selection (fixed-bid, retainer, managed services)
- Phased implementation roadmaps

**Products/Features:**
- Data Cloud
- Marketing Cloud Advanced
- Zero-Copy Federation (Snowflake, BigQuery, Redshift)
- Flow for Marketing
- Identity Resolution
- Calculated Insights

---

#### 6.2 Extend Data Integrations

**Enhanced Content:**

**What it is:**
Integrate user-level online and offline purchase + loyalty data to power segmentation, dynamic content, automations, and lifecycle journeys. This is multi-phase work that unlocks progressively sophisticated use cases.

**Merkle Differentiators:**
- **Cost Optimization:** Help articulate what data should be integrated from which source systems to optimize Data Cloud consumption
- **IT Partnership:** Work directly with IT on integration protocols and data architecture
- **Direct Integration Management:** Merkle can directly manage integrations as a service
- **Business Value Articulation:** Put concrete business value behind specific data integrations
- **Capability Unlocking:** Show exactly which capabilities each integration unlocks

**Integration Priority Framework:**
```
Phase 1: CRM/Subscriber Data (Email, preferences, consent)
         └── Unlocks: Subscriber journeys, basic personalization

Phase 2: Commerce Data (Transactions, cart events, browse behavior)
         └── Unlocks: Cart abandon, post-purchase, RFM segments

Phase 3: Loyalty Data (Points, tiers, redemptions)
         └── Unlocks: Loyalty journeys, tier-based experiences

Phase 4: Service Data (Cases, interactions, satisfaction)
         └── Unlocks: Service follow-ups, unified experiences

Phase 5: Enrichment Data (Merkury, third-party append)
         └── Unlocks: Identity resolution, enhanced profiles
```

**Data Unification Strategy:**
- Merkle as leaders in data and identity
- Consultation on unified customer profiles
- Append and enrich customer records directly in Data 360
- Support marketing segmentation, activation, personalization, analytics

**Products/Features:**
- Data Cloud Data Streams
- Zero-Copy Partners (Snowflake, BigQuery, Redshift)
- Data Cloud Connectors
- Identity Resolution
- Calculated Insights

---

#### 6.3 Build Baseline Subscriber Journeys

**Enhanced Content:**

**Positioning:** This is **ABOVE THE WATERLINE** - visible, expected consumer experiences

**What it is:**
Automate the fundamental cross-channel journey triggers that don't require extensive data integration but can be delivered based on subscriber signals. Faster time to market, critical for consumer expectations, often drives initial purchase.

**Key Journeys (Table Stakes):**
1. **Welcome/Onboarding Series** - First impression, brand introduction, preference capture
2. **Birthday/Anniversary** - Personal recognition, offer delivery
3. **Re-engagement/Win-back** - Lapsed subscriber recovery
4. **Preference Center** - Self-service profile management
5. **Unsubscribe Mitigation** - Last-chance retention

**Why These First:**
- Require only subscriber data (already available)
- Consumer expectation - they expect these
- Quick time to value - weeks not months
- Foundation for more advanced journeys
- Build operational muscle and templates

**Business Impact:**
- Welcome series: 3-5X higher engagement than promotional
- Birthday: 50%+ open rates, high conversion
- Re-engagement: Recover 5-10% of lapsed subscribers

**Products/Features:**
- Marketing Cloud Flow
- Journey Builder
- Einstein Engagement Scoring (optional)
- Mobile Push
- Email Studio
- Content Builder

---

#### 6.4 Enhanced Planned Campaigns

**Enhanced Content:**

**Positioning:** Moving from batch campaigns to coordinated journey-based experiences

**What it is:**
Transform batch-and-blast campaigns into orchestrated, multi-touch Flow-based journeys. This is about building the **operational rigor, strategy, frameworks, templates, and content engine** to support journey-based campaign execution.

**The Shift:**
```
FROM: Single batch campaigns
      ├── Calendar-driven sends
      ├── One message, one touch
      ├── Limited personalization
      └── Isolated channel execution

TO:   Journey-based campaigns
      ├── Behavior-informed timing
      ├── Multi-touch orchestration
      ├── Decision splits & branching
      ├── Predictive path optimization
      ├── Multi-channel coordination
      └── Agentforce acceleration
```

**Key Components:**
1. **Decision Splits** - Branch journeys based on behavior/attributes
2. **Predictive Journey Paths** - Einstein-powered path selection
3. **Send Time Optimization** - Individual optimal timing
4. **Multi-Channel Coordination** - Email + SMS + Push + Ads
5. **Campaign Frameworks** - Repeatable templates by campaign type
6. **Content Templates** - Modular, reusable content blocks
7. **Operational Rigor** - Approval workflows, QA processes

**Merkle Approach:**
- Campaign strategy and planning workshops
- Journey design and build services
- Creative production (email, landing pages)
- Agentforce setup with guardrails
- Human-in-the-loop workflows

**Products/Features:**
- Flow for Marketing
- Journey Builder
- Einstein STO
- Einstein Engagement Scoring
- Agentforce Campaign Agent
- Content Builder
- AMPscript

---

#### 6.5 Customer Lifecycle Journeys

**Enhanced Content:**

**Positioning:** Still **ABOVE THE WATERLINE** but require data integration - the obvious, known experiences

**What it is:**
If baseline subscriber journeys require no additional data beyond subscriber data, then customer lifecycle journeys **directly depend on integrated data signals** - commerce data, service data, etc. These are signals that trigger post-purchase, win-back, service follow-up, loyalty reminders, etc.

**Dependency:** Requires completion of `Extend Data Integrations`

**Key Journey Types:**
1. **Post-Purchase**
   - Order confirmation
   - Shipping updates
   - Delivery confirmation
   - Review request
   - Cross-sell/upsell

2. **Abandoned Cart/Browse**
   - Cart abandon (email + SMS + ads)
   - Browse abandon
   - Price drop alerts
   - Back in stock

3. **Win-back (Lapsed Purchase)**
   - Purchase recency triggers
   - Category replenishment
   - Competitive prevention
   - "We miss you" series

4. **Service Integration**
   - Service case follow-up
   - NPS/CSAT surveys
   - Resolution confirmation
   - Proactive service alerts

5. **Loyalty Integration**
   - Points balance reminders
   - Tier upgrade celebration
   - Points expiration alerts
   - Exclusive member offers

**Industry Context (Retail/CPG/QSR):**
These are **table stakes** - consumers expect these experiences across all retail industries. They take more data integration but are foundational consumer expectations.

**Products/Features:**
- Marketing Cloud Flow
- Data Cloud (purchase events, service data)
- Journey Builder
- Mobile Push
- Commerce Cloud Connector
- Service Cloud Connector

---

#### 6.6 Insight-Driven Experiences

**Enhanced Content:**

**Positioning:** **BELOW THE WATERLINE** - the brand-unique, differentiating experiences

**What it is:**
Move beyond the obvious subscriber and customer lifecycle journeys to unlock **custom, cross-channel, brand-unique experiences** that are ownable and differentiated. These are experiences that competitors cannot easily replicate.

**Characteristics:**
- Powered by **quantitative or qualitative data signals** unique to the brand
- Likely still journeys, cross-channel, with decision splits
- Leverage Einstein capabilities
- Not just messaging - includes on-site personalization, ads, etc.
- May rely on **Calculated Insights** from Data 360 that blend multiple data sources
- May use **Bring Your Own Model** data or externally modeled data

**Example Use Cases:**

*Retail:*
- Predicted next purchase category based on browse + purchase patterns
- Churn intervention before customer shows obvious lapse signals
- Personalized product discovery journeys based on style preferences

*QSR:*
- Daypart preference modeling (breakfast person vs. dinner person)
- Weather-triggered menu recommendations
- Event-based promotions (game day, local events)

*CPG:*
- Household replenishment prediction
- New product introduction based on brand affinity
- Cross-brand household optimization

**Merkle Differentiators:**
- Custom predictive model development
- Calculated Insights configuration
- BYOM integration support
- Experience design workshops
- Cross-channel orchestration strategy

**Products/Features:**
- Data Cloud Calculated Insights
- Einstein Recommendations
- Salesforce Personalization (for web/app)
- Advertising Studio
- BYOM (Bring Your Own Model)
- Data Actions

---

#### 6.7 Scale Dynamic Content

**Enhanced Content:**

**Positioning:** The Content Supply Chain operating system

**What it is:**
Build the operating system for 1:1 personalization at scale. Everyone wants personalization but gets crushed under creative production pressure - the variations become overwhelming.

**The Problem:**
```
100 segments × 5 product categories × 3 channels × 2 languages = 3,000 variants
```

**The Solution: Content Supply Chain**
```
Dynamic Framework
├── Modular content blocks (not full emails)
├── Data-driven content selection
├── AI-powered variant generation
├── Brand-governed guardrails
└── Integrated asset management
```

**Merkle Content Supply Chain:**
- Framework methodology
- Direct integration with partner suite (Adobe)
- Creative automation workflows
- Dynamic content architecture
- Einstein Content Selection configuration

**Key Capabilities:**
1. **Dynamic Content Blocks** - Reusable, data-driven components
2. **Einstein Content Selection** - AI picks best content variant
3. **AMPscript Personalization** - Advanced scripting for edge cases
4. **Product Recommendations** - Catalog-driven suggestions
5. **Content Analytics** - Performance at the content level

**Products/Features:**
- Einstein Content Selection
- Content Builder
- AMPscript / GTL
- Product Recommendations
- Adobe Experience Manager (integration)
- Asset Management

---

#### 6.8 Data Exploration and Visualization

**Enhanced Content:**

**What it is:**
Use analytics and visualization tools to visualize and report on the experiences being delivered. Make smarter decisions, report up to leadership, prove ROI.

**Merkle Approach:**
- Not just dashboards - actionable insights
- Connect marketing engagement to business outcomes
- Self-service reporting for marketing teams
- Executive-ready presentations

**Key Capabilities:**
1. **Marketing Cloud Intelligence** - Cross-channel marketing analytics
2. **Data Cloud Analytics** - Customer-level insights
3. **Tableau Integration** - Enterprise visualization
4. **Custom Dashboards** - Role-based views

**Insight Types:**
- Campaign performance (engagement, conversion, revenue)
- Journey analytics (path analysis, drop-off, completion)
- Customer insights (segments, CLV, propensity)
- Attribution (multi-touch, channel contribution)

**Products/Features:**
- Marketing Cloud Intelligence (Datorama)
- Tableau CRM
- Data Cloud Reports
- CRM Analytics

---

#### 6.9 Identity Resolution

**Enhanced Content:**

**Positioning:** The Merkle/Merkury Secret Sauce

**What it is:**
Extend identifiable experiences, enrich consumer records, and create unified customer profiles across all touchpoints and systems. This is where Merkle's data heritage and Merkury capabilities create unmatched competitive advantage.

**Merkle Differentiators:**
- **Merkury** - Merkle's proprietary identity solution
- Decades of data and identity expertise
- Onboarding/offboarding management
- Privacy-compliant enrichment
- Cross-device/cross-channel identity graph

**Capabilities:**
1. **Identity Resolution Rules** - Match and merge customer records
2. **Profile Unification** - Create golden customer record
3. **Consent Management** - Privacy-compliant data handling
4. **Data Enrichment** - Append demographic, behavioral, intent signals
5. **Cross-Cloud Golden Record** - Unified view across Sales, Service, Marketing, Commerce

**Products/Features:**
- Data Cloud Identity Resolution
- Merkury (Merkle)
- Consent Management
- Profile Unification
- Data Enrichment Services

---

#### 6.10 NEW: Agentic Campaign Production

**New Capability Card:**

**What it is:**
Establish the workflow, governance, and approval processes for agentic (AI-powered) campaign production. Critical for scaling AI-assisted marketing while maintaining brand safety and compliance - especially important in regulated industries.

**Why Important:**
- Agentforce can create campaigns autonomously
- Without guardrails, brand risk increases
- Regulated industries require audit trails
- Human-in-the-loop needs clear definition

**Key Components:**
1. **Governance Framework** - Who approves what, when
2. **Brand Guardrails** - Tone, voice, prohibited content
3. **Approval Workflows** - Human checkpoints
4. **Compliance Rules** - Industry-specific requirements
5. **Audit Trails** - Full history of AI decisions
6. **Quality Assurance** - Testing and review processes

**Industry Considerations:**
- **Financial Services** - Disclosure requirements, fair lending
- **Healthcare** - MLR approval, HIPAA compliance
- **Retail/CPG/QSR** - Brand consistency, legal claims

**Products/Features:**
- Agentforce for Marketing
- Marketing Cloud Flow
- Approval Workflows
- Content Governance
- Audit Logging

---

## 7. Products & Features Indicators

Each capability card should display which Salesforce products and features are used:

### Display Format
```
┌────────────────────────────────────────────────────────┐
│  [Capability Name]                                     │
│                                                        │
│  Description text...                                   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Products & Features                             │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │ │
│  │  │Data     │ │Flow for │ │Einstein │           │ │
│  │  │Cloud    │ │Marketing│ │STO      │           │ │
│  │  └─────────┘ └─────────┘ └─────────┘           │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Product Categories
1. **Platform** - Data Cloud, Marketing Cloud, Commerce Cloud, Service Cloud
2. **Features** - Flow, Journey Builder, Einstein features, Agentforce
3. **Integrations** - Connectors, zero-copy partners
4. **Merkle** - Merkury, Content Supply Chain

---

## 8. Cross-Matrix Adjacencies

### Concept
At certain points in the M&P journey, there are natural connection points to other Salesforce maturity matrices (future development).

### Implementation

**Visual Indicator:**
```
┌────────────────────────────────────────────────────────┐
│  [Customer Lifecycle Journeys]                          │
│                                                        │
│  ...capability content...                              │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🔗 Adjacencies                                   │ │
│  │                                                   │ │
│  │  → Loyalty: Integrate loyalty promotions & rewards│ │
│  │  → Commerce: Connected shopping experiences       │ │
│  │                                                   │ │
│  │  (Coming soon)                                    │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Adjacency Mapping

| M&P Capability | Adjacent Matrix | Connection Point |
|----------------|-----------------|------------------|
| Customer Lifecycle Journeys | Loyalty | Integrate loyalty promotions, referrals |
| Customer Lifecycle Journeys | Commerce | Post-purchase, abandoned cart |
| Scale Dynamic Content | Commerce | Product recommendations |
| Insight-Driven Experiences | Loyalty | Tier optimization, rewards |
| Identity Resolution | All | Golden customer record |
| Cross-Channel Activation | Commerce | Unified shopping experience |

---

## 9. Industry Consolidation: Retail/CPG/QSR

### Current State
- Retail & CPG separate from QSR
- Similar priorities but different naming

### Target State
Combine into single industry: **"Retail, CPG & QSR"**

### Merged Priority Profile
```
typicalPriorities: [
  'Omnichannel customer experience',
  'Loyalty & rewards optimization',
  'Personalization at scale',
  'Cart/browse abandonment recovery',
  'Customer lifetime value growth',
  'Location-based marketing (QSR)',
  'Order frequency optimization (QSR)',
],
commonChallenges: [
  'Unifying online/offline/app customer data',
  'Identifying customers across channels',
  'Rising customer acquisition costs',
  'Inventory-aware personalization',
  'Delivery platform intermediation (QSR)',
  'Franchisee data fragmentation (QSR)',
],
```

### Capability Emphasis (Combined)
```
highPriority: [
  'marketing-foundation',  // Decision point
  'customer-lifecycle-journeys',
  'baseline-subscriber-journeys',
  'scale-dynamic-content',
  'cross-channel-activation',
],
mediumPriority: [
  'extend-data-integrations',
  'enhance-planned-campaigns',
  'einstein-engagement-scoring',
],
lowPriority: [
  'identity-resolution',  // Still important but later
  'clv-modeling',
  'insight-driven-experiences',
],
```

---

## 10. Implementation Phases

### Phase 1: Core Restructure (Foundation)
1. Remove non-M&P disciplines
2. Implement assessment-first flow
3. Add marketing foundation decision point
4. Update capabilities content
5. Consolidate Retail/CPG/QSR

### Phase 2: Visualization Overhaul
1. Implement new journey flow visualization
2. Add waterline separator (above/below)
3. Show dependencies as arrows
4. Add progress indicators
5. Implement phase groupings

### Phase 3: Branding & Polish
1. Apply Merkle brand colors
2. Update typography
3. Add geometric accent elements
4. Redesign header
5. Update all icons

### Phase 4: Enhancement & Expansion
1. Add products/features indicators
2. Implement adjacency system
3. Add new Agentic Campaign Production capability
4. Enhance assessment questions
5. Improve plan generation

---

## 11. Technical Implementation Notes

### State Management Updates
- Add `foundationChoice: 'mc-engagement' | 'mc-advanced'` to assessment state
- Filter available capabilities based on foundation choice
- Store adjacency hints for future expansion

### New Components Needed
- `LandingPage.tsx` - Assessment entry point
- `FoundationDecision.tsx` - Path split UI
- `JourneyFlowVisualization.tsx` - New matrix view
- `ProductFeatureBadges.tsx` - Product indicators
- `AdjacencyHints.tsx` - Cross-matrix links

### Data Model Updates
```typescript
// Add to Capability type
interface Capability {
  // ...existing fields
  productsFeatures: ProductFeature[];
  adjacencies?: Adjacency[];
  availableFor: ('mc-engagement' | 'mc-advanced')[];
  iceberg: 'above' | 'below';
}

interface ProductFeature {
  name: string;
  category: 'platform' | 'feature' | 'integration' | 'merkle';
  icon?: string;
}

interface Adjacency {
  matrix: 'loyalty' | 'commerce' | 'service' | 'b2b';
  connectionPoint: string;
  description: string;
}
```

---

## 12. Success Metrics

### User Experience
- Time to start assessment: < 30 seconds
- Assessment completion rate: > 70%
- Plan generation rate: > 50% of assessments

### Business Value
- Clear differentiation of Merkle capabilities
- Obvious path to engagement
- Commercial model clarity

### Technical Quality
- Clean, maintainable code
- Extensible for future matrices
- Mobile-responsive design

---

## Appendix: Capability ID Reference

| Current ID | New ID (if changed) | Name |
|------------|---------------------|------|
| migrate-sfmc | marketing-foundation | Marketing Foundation (Decision) |
| extend-data-integrations | (unchanged) | Extend Data Integrations |
| baseline-subscriber-journeys | (unchanged) | Build Baseline Subscriber Journeys |
| enhance-planned-campaigns | (unchanged) | Enhanced Planned Campaigns |
| customer-lifecycle-journeys | (unchanged) | Customer Lifecycle Journeys |
| insight-driven-experiences | (unchanged) | Insight-Driven Experiences |
| scale-dynamic-content | (unchanged) | Scale Dynamic Content |
| data-exploration | (unchanged) | Data Exploration & Visualization |
| identity-resolution | (unchanged) | Identity Resolution (+ Merkury) |
| einstein-engagement-scoring | (unchanged) | Einstein Engagement Scoring |
| einstein-send-time-optimization | (unchanged) | Einstein STO |
| cross-channel-activation | (unchanged) | Cross-Channel Activation |
| clv-modeling | (unchanged) | CLV Modeling |
| NEW | agentic-campaign-production | Agentic Campaign Production |

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Author: Merkle Engineering*
