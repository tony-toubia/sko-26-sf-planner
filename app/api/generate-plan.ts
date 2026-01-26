import Anthropic from '@anthropic-ai/sdk';

// Types matching the app's data structures
interface TrackLevelAssessment {
  trackId: string;
  level: number;
  status: 'not-started' | 'in-progress' | 'complete';
  notes?: string;
  answers?: { questionId: string; value: string | string[] | number }[];
}

interface GlobalAssessmentInputs {
  clientContext: {
    industry?: string;
    industrySegment?: string;
    companySize?: string;
    currentMarketingMaturity?: number;
    existingTechStack?: string;
    teamSize?: string;
    annualMarketingBudget?: string;
  };
  commercialPreferences: {
    preferredEngagementModel?: string[];
    budgetRange?: string;
    budgetFlexibility?: string;
    decisionTimeline?: string;
    internalResources?: string;
    preferCapexOrOpex?: string;
  };
  strategicContext: {
    keyBusinessDrivers?: string[];
    successMetrics?: string[];
    knownConstraints?: string;
    competitivePressures?: string;
    executiveSponsor?: string;
    additionalContext?: string;
  };
}

interface PlanGenerationRequest {
  clientName: string;
  industry?: string;
  marketingFoundation?: string;
  trackAssessments: TrackLevelAssessment[];
  globalInputs: GlobalAssessmentInputs;
}

// Grounding data - ROI benchmarks
const ROI_BENCHMARKS = `
## Merkle-Validated ROI Benchmarks

### Phase 1: Foundation
- Operational Efficiency: 3X improvement from platform migration
- Digital Channel Penetration: +111% increase in reach

### Phase 2: Activation
- Email-Attributed Revenue: +35% increase through journey optimization
- Open Rate vs Industry: +40% improvement
- Welcome Series Transaction Rate: +320% vs promotional emails
- Birthday Email Transaction Rate: +481% vs promotional emails

### Phase 3: Optimization
- Return on Ad Spend (ROAS): 3X through cross-channel suppression
- Campaign Efficiency: +100% with cross-channel journeys
- Multi-Channel Purchase Rate: +287% vs single-channel
- Cart Abandonment Recovery: 5-15% of abandoned revenue
- Repeat Purchase Rate: +25% from post-purchase journeys

### Phase 4: Transformation
- Existing Customer Sales Lift: +16% per campaign with predictive models
- Lapsed Customer Sales Lift: +5% with predictive win-back
`;

// Journey prioritization guidance
const JOURNEY_GUIDANCE = `
## Journey Prioritization Matrix

### High Impact, Low Effort (Quick Wins)
- Welcome/Onboarding: Multi-touch series, +320% transaction rate
- Birthday: Celebration with offers, +481% transaction rate
- Re-Engagement: Declining engagement recovery

### High Impact, High Effort (Strategic Investments)
- Cart Abandonment: 5-15% revenue recovery, requires purchase data
- Browse Abandonment: Behavior-triggered re-engagement
- Purchase Win-Back: Lapsed customer reactivation

### Journey Phases
- Phase 2 Journeys (subscriber-event triggered): Welcome, New Arrivals, Best Sellers, Back in Stock, Affinity, Birthday, Re-Engagement
- Phase 3 Journeys (purchase-event triggered): Cart/Browse Abandon, Purchase Confirmation, Post-Purchase Review, Win-Back, Purchase Anniversary

### Channel Strategy
- Email: Rich content, cost-efficient, included in licensing
- SMS: 98% open rate, urgency/time-sensitive, incremental cost
- Push: App users, real-time, location-based, included
- Ads: Extended reach, retargeting, suppression, incremental cost
- Direct Mail: High-value customers, premium moments, third-party cost
`;

// Track descriptions
const TRACK_DESCRIPTIONS = `
## Maturity Tracks

### Data & Identity Track
- Level 1 (Platform Foundation): Migrate to Data Cloud & MC Advanced
- Level 2 (Extended Integration): Connect POS, loyalty, e-commerce data
- Level 3 (Identity & Enrichment): Cross-device/channel identity resolution

### Customer Journeys Track
- Level 1 (Subscriber Journeys): Welcome, birthday, re-engagement
- Level 2 (Customer Lifecycle): Post-purchase, loyalty, win-back
- Level 3 (Insight-Driven): Predictive triggers, next-best-action

### Content & Channels Track
- Level 1 (Campaign Optimization): Batch-to-journey transformation
- Level 2 (Dynamic Content): Einstein Content Selection, personalization at scale
- Level 3 (Cross-Channel): SMS, ads, push, direct mail orchestration

### Intelligence Track
- Level 1 (Reporting Foundation): Dashboards, segment performance
- Level 2 (Advanced Analytics): Attribution, path analysis
- Level 3 (Predictive): CLV modeling, churn prediction, propensity scores
`;

// Industry-specific context
const INDUSTRY_CONTEXT: Record<string, string> = {
  'Retail & CPG': `
### Retail & CPG Priorities
- Omnichannel experience consistency
- Loyalty program optimization
- Personalization at scale
- Seasonal campaign agility
- Cart abandonment recovery (5-15% revenue opportunity)
- In-store to digital connection

### Key Journeys for Retail
- Welcome series with category preferences
- Cart/browse abandonment with inventory awareness
- Back in stock notifications
- Purchase anniversary and replenishment reminders
- VIP/loyalty tier progression communications
`,
  'Financial Services': `
### Financial Services Priorities
- Customer onboarding and activation
- Cross-sell/up-sell optimization
- Regulatory compliance (TCPA, GDPR, CCPA)
- Secure data handling
- Life event targeting

### Key Journeys for Financial Services
- Account activation and early engagement
- Product adoption sequences
- Renewal and retention journeys
- Life milestone targeting (home purchase, retirement)
- Regulatory communication management
`,
  'Healthcare & Life Sciences': `
### Healthcare Priorities
- Patient engagement and adherence
- HCP relationship management
- HIPAA compliance requirements
- Appointment and medication reminders
- Wellness program participation

### Key Considerations
- Protected health information (PHI) handling
- Consent management for marketing
- Provider preference tracking
- Multi-stakeholder journeys (patient, caregiver, provider)
`,
  'Travel & Hospitality': `
### Travel & Hospitality Priorities
- Loyalty program engagement
- Booking abandonment recovery
- Pre/post-trip personalization
- Real-time service communications
- Seasonal demand management

### Key Journeys
- Booking abandonment (high-value recovery)
- Pre-trip anticipation building
- On-property engagement
- Post-trip loyalty cultivation
- Anniversary and milestone rewards
`,
  'Media & Entertainment': `
### Media & Entertainment Priorities
- Subscriber retention and churn prevention
- Content personalization
- Viewing/listening behavior activation
- Cross-platform engagement
- Event and release marketing

### Key Journeys
- Onboarding and content discovery
- Viewing drop-off re-engagement
- New release personalization
- Subscription renewal sequences
- Win-back for churned subscribers
`,
};

// Build the system prompt
function buildSystemPrompt(request: PlanGenerationRequest): string {
  const industryContext = request.industry
    ? INDUSTRY_CONTEXT[request.industry] || ''
    : '';

  return `You are a senior Salesforce Marketing Cloud consultant at Merkle, creating a strategic implementation plan for ${request.clientName}.

Your role is to create a compelling, narrative-driven recommendation plan that:
1. Flows naturally as a strategic document, not a template
2. References specific benchmarks and outcomes from Merkle's methodology
3. Adapts completely to the client's assessed maturity and priorities
4. Skips empty phases - if they've completed Phase 1 work, start the plan at Phase 2
5. Provides specific, actionable recommendations grounded in data

IMPORTANT - Assumptions to AVOID:
- Do NOT assume the client has already implemented any platform. The "Marketing Foundation" field indicates their TARGET platform choice, not what they currently have.
- Only reference "current state" or "already implemented" if the maturity assessment explicitly shows completed capabilities.
- The assessment tracks show what level they are WORKING TOWARD, not what they have completed (unless status is "complete").
- When a track shows "not-started", assume they have no capabilities in that area yet.

## Reference Data

${ROI_BENCHMARKS}

${JOURNEY_GUIDANCE}

${TRACK_DESCRIPTIONS}

${industryContext}

## Writing Guidelines

1. **Be Specific**: Reference actual benchmarks ("+35% email revenue", "3X ROAS") not vague promises
2. **Flow Naturally**: Write as a cohesive narrative, not disconnected sections
3. **Skip What's Done**: If they've completed capabilities, acknowledge and build from there
4. **Contextualize for Industry**: Use industry-specific examples and priorities
5. **Be Practical**: Include concrete next steps and decision points
6. **Address Resources**: Factor their team size, budget, and timeline into recommendations
7. **Create Urgency Without Pressure**: Show opportunity cost of inaction with data

## Output Format

Generate a Markdown document with these sections (adapt as needed based on their situation):

1. **Executive Summary** - 2-3 paragraphs capturing the opportunity, not a template
2. **Current State Assessment** - What they've completed, what's in progress, what's next
3. **Strategic Recommendation** - The "why" behind the plan, connected to their business drivers
4. **Implementation Roadmap** - Phased approach WITH ONLY PHASES THAT HAVE WORK (skip empty phases!)
   - For each phase: Objectives, key capabilities, expected outcomes with benchmarks, duration
5. **Journey Prioritization** - Which journeys to implement and why, with expected ROI
6. **Investment Framework** - Based on their stated budget/preferences, not arbitrary numbers
7. **Risk Considerations** - Specific to their situation
8. **Success Metrics** - Tied to their stated success criteria
9. **Recommended Next Steps** - Concrete actions with owners

IMPORTANT:
- If Phase 1 foundation is complete, START THE ROADMAP AT PHASE 2
- Never show empty phases - renumber if needed so Phase 1 is always the first phase with work
- Investment estimates should align with their stated budget range and preferences
- Reference their specific track assessments and answers in your recommendations`;
}

// Build the user prompt with assessment data
function buildUserPrompt(request: PlanGenerationRequest): string {
  // Summarize track assessments
  const trackSummary = request.trackAssessments.map(ta => {
    const statusEmoji = ta.status === 'complete' ? '✓' : ta.status === 'in-progress' ? '◐' : '○';
    const notes = ta.notes ? ` - "${ta.notes}"` : '';
    return `  ${statusEmoji} ${ta.trackId} Level ${ta.level}: ${ta.status}${notes}`;
  }).join('\n');

  // Build context from global inputs
  const ctx = request.globalInputs.clientContext;
  const comm = request.globalInputs.commercialPreferences;
  const strat = request.globalInputs.strategicContext;

  let contextSummary = '';
  if (ctx.industry) contextSummary += `Industry: ${ctx.industry}`;
  if (ctx.industrySegment) contextSummary += ` (${ctx.industrySegment})`;
  if (ctx.companySize) contextSummary += `\nCompany Size: ${ctx.companySize}`;
  if (ctx.currentMarketingMaturity) contextSummary += `\nCurrent Maturity: Level ${ctx.currentMarketingMaturity}/5`;
  if (ctx.teamSize) contextSummary += `\nMarketing Team Size: ${ctx.teamSize}`;
  if (ctx.existingTechStack) contextSummary += `\nExisting Tech: ${ctx.existingTechStack}`;

  let commercialSummary = '';
  if (comm.budgetRange) commercialSummary += `Budget Range: ${comm.budgetRange}`;
  if (comm.preferredEngagementModel?.length) {
    commercialSummary += `\nPreferred Model: ${comm.preferredEngagementModel.join(', ')}`;
  }
  if (comm.internalResources) commercialSummary += `\nInternal Resources: ${comm.internalResources}`;
  if (comm.preferCapexOrOpex) commercialSummary += `\nPreference: ${comm.preferCapexOrOpex.toUpperCase()}`;
  if (comm.decisionTimeline) commercialSummary += `\nDecision Timeline: ${comm.decisionTimeline}`;

  let strategicSummary = '';
  if (strat.keyBusinessDrivers?.length) {
    strategicSummary += `Key Drivers:\n${strat.keyBusinessDrivers.map(d => `  - ${d}`).join('\n')}`;
  }
  if (strat.successMetrics?.length) {
    strategicSummary += `\n\nSuccess Metrics:\n${strat.successMetrics.map(m => `  - ${m}`).join('\n')}`;
  }
  if (strat.knownConstraints) strategicSummary += `\n\nKnown Constraints: ${strat.knownConstraints}`;
  if (strat.competitivePressures) strategicSummary += `\nCompetitive Pressures: ${strat.competitivePressures}`;
  if (strat.executiveSponsor) strategicSummary += `\nExecutive Sponsor: ${strat.executiveSponsor}`;
  if (strat.additionalContext) strategicSummary += `\nAdditional Context: ${strat.additionalContext}`;

  // Determine marketing foundation
  const foundationNote = request.marketingFoundation
    ? `Marketing Foundation: ${request.marketingFoundation === 'mc-advanced'
        ? 'MC Advanced with Data Cloud (Agentforce-ready) - This is the TARGET platform, not currently implemented'
        : 'MC Engagement (standard) - This is the TARGET platform, not currently implemented'}`
    : 'Marketing Foundation: Not specified';

  return `Generate a strategic implementation plan for ${request.clientName}.

## Client Context
${contextSummary || 'No additional context provided'}
${foundationNote}

## Commercial Preferences
${commercialSummary || 'No commercial preferences specified'}

## Strategic Context
${strategicSummary || 'No strategic context provided'}

## Maturity Assessment Results
${trackSummary || 'No track assessments completed'}

Please generate a comprehensive, narrative-driven implementation plan that:
1. Acknowledges their current state and builds from it
2. Only includes phases with actual work to be done
3. References specific benchmarks and expected outcomes
4. Aligns investment recommendations with their stated budget
5. Provides industry-specific guidance where applicable
6. Creates a compelling case for action with data-backed urgency`;
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: PlanGenerationRequest = req.body;

    // Validate required fields
    if (!request.clientName) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = buildSystemPrompt(request);
    const userPrompt = buildUserPrompt(request);

    // Generate the plan using Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    // Extract the text content
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return res.status(200).json({
      plan: textContent.text,
      usage: message.usage,
    });

  } catch (error) {
    console.error('Plan generation error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate plan'
    });
  }
}
