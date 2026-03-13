import Anthropic from '@anthropic-ai/sdk';
import { fetchFormattedReferenceData } from './lib/referenceData.js';
import { getChatKnowledge } from './lib/knowledgeQuery.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  industry?: string;
  marketingFoundation?: string;
  currentMaturityLevel?: number;
}

// Industry type mapping from UI names to internal IDs
const INDUSTRY_TYPE_MAP: Record<string, string> = {
  'Retail & CPG': 'retail-cpg-qsr',
  'Retail, CPG & QSR': 'retail-cpg-qsr',
  'Financial Services': 'financial-services',
  'Healthcare & Life Sciences': 'healthcare-life-sciences',
  'Healthcare': 'healthcare-life-sciences',
  'Manufacturing': 'manufacturing',
  'Travel & Hospitality': 'travel-hospitality',
  'Media & Entertainment': 'media-entertainment',
  'Technology': 'technology',
};

// Industry-specific KPIs with benchmarks
const INDUSTRY_KPIS: Record<string, Array<{ metric: string; benchmark: string; levers: string[] }>> = {
  'retail-cpg-qsr': [
    { metric: 'Email Open Rate', benchmark: '15-25% (retail), 20-30% (QSR)', levers: ['Subject line optimization', 'Send time optimization', 'Segmentation'] },
    { metric: 'Email Click-to-Open Rate', benchmark: '10-15%', levers: ['Content relevance', 'CTA optimization', 'Dynamic content'] },
    { metric: 'Cart Abandonment Rate', benchmark: '65-75% (opportunity to recover 5-15%)', levers: ['Abandon cart journeys', 'Retargeting', 'Incentive testing'] },
    { metric: 'Email-Attributed Revenue', benchmark: '15-30% of e-commerce revenue', levers: ['Journey expansion', 'Personalization', 'Cross-sell/upsell'] },
    { metric: 'Customer Lifetime Value', benchmark: '3-5x AOV', levers: ['Retention programs', 'CLV-based segmentation', 'High-value customer treatment'] },
    { metric: 'Repeat Purchase Rate', benchmark: '25-40%', levers: ['Post-purchase journeys', 'Second purchase incentives', 'Product education'] },
    { metric: 'Loyalty Member Engagement', benchmark: '40-60%', levers: ['Tier progression journeys', 'Points reminders', 'Member-exclusive offers'] },
  ],
  'financial-services': [
    { metric: 'Email Open Rate', benchmark: '20-30%', levers: ['Subject line optimization', 'Sender name testing', 'Personalization'] },
    { metric: 'Digital Engagement Rate', benchmark: '50-70% for active customers', levers: ['App push notifications', 'Feature education', 'Personalized dashboards'] },
    { metric: 'Account Activation Rate', benchmark: '60-80%', levers: ['Onboarding journeys', 'Activation incentives', 'Milestone tracking'] },
    { metric: 'Products Per Customer', benchmark: '2.5-4.0', levers: ['Cross-sell journeys', 'Life event targeting', 'Need-based recommendations'] },
    { metric: 'Customer Retention Rate', benchmark: '85-95%', levers: ['At-risk detection', 'Proactive outreach', 'Value reinforcement'] },
  ],
  'healthcare-life-sciences': [
    { metric: 'Patient Portal Adoption', benchmark: '40-60%', levers: ['Activation journeys', 'Feature education', 'Convenience messaging'] },
    { metric: 'Medication Adherence Rate', benchmark: '50-70% (varies by condition)', levers: ['Refill reminders', 'Education content', 'Support program enrollment'] },
    { metric: 'Appointment Show Rate', benchmark: '85-95%', levers: ['Multi-channel reminders', 'Prep communications', 'Rescheduling ease'] },
    { metric: 'Program Enrollment Rate', benchmark: '15-30%', levers: ['Enrollment journeys', 'Value communication', 'Simplified enrollment'] },
  ],
  'manufacturing': [
    { metric: 'Lead-to-Opportunity Conversion', benchmark: '10-20%', levers: ['Lead scoring', 'Nurture journeys', 'Sales alignment'] },
    { metric: 'Account Engagement Score', benchmark: 'Varies by program', levers: ['Multi-touch ABM', 'Stakeholder mapping', 'Content personalization'] },
    { metric: 'Dealer Portal Engagement', benchmark: '40-60%', levers: ['Enablement content', 'Training programs', 'Incentive communications'] },
    { metric: 'Service Contract Renewal', benchmark: '70-85%', levers: ['Renewal journeys', 'Value documentation', 'Proactive outreach'] },
  ],
  'travel-hospitality': [
    { metric: 'Booking Abandonment Recovery', benchmark: '5-15%', levers: ['Multi-touch recovery', 'Urgency messaging', 'Price alerts'] },
    { metric: 'Direct Booking Rate', benchmark: '30-50%', levers: ['Loyalty incentives', 'Price parity messaging', 'Member benefits'] },
    { metric: 'Ancillary Revenue per Guest', benchmark: 'Varies by segment', levers: ['Pre-arrival upsell', 'On-property offers', 'Personalized recommendations'] },
    { metric: 'Loyalty Program Active Rate', benchmark: '40-60%', levers: ['Tier progression', 'Points expiration', 'Member-only offers'] },
  ],
  'media-entertainment': [
    { metric: 'Trial-to-Paid Conversion', benchmark: '30-50%', levers: ['Onboarding journeys', 'Value demonstration', 'Timely conversion offers'] },
    { metric: 'Monthly Active Users', benchmark: '60-80% of subscribers', levers: ['Content personalization', 'Engagement triggers', 'New content alerts'] },
    { metric: 'Churn Rate', benchmark: '3-7% monthly', levers: ['At-risk identification', 'Win-back journeys', 'Value reinforcement'] },
  ],
  'technology': [
    { metric: 'Trial-to-Paid Conversion', benchmark: '15-30%', levers: ['Onboarding optimization', 'Time-to-value acceleration', 'Conversion journeys'] },
    { metric: 'Product Activation Rate', benchmark: '40-70%', levers: ['Activation milestones', 'Feature education', 'Use case guidance'] },
    { metric: 'Feature Adoption Rate', benchmark: '20-50% per feature', levers: ['In-app messaging', 'Feature announcements', 'Use case content'] },
    { metric: 'Net Revenue Retention', benchmark: '100-130%', levers: ['Expansion triggers', 'Usage-based upsell', 'Customer success programs'] },
  ],
};

// Industry-specific critical journeys
const INDUSTRY_JOURNEYS: Record<string, Array<{ name: string; relevance: string; benchmark?: string; notes: string }>> = {
  'retail-cpg-qsr': [
    { name: 'Welcome Series', relevance: 'Critical', benchmark: '+320% transaction rate vs. promo', notes: 'Focus on second purchase incentive.' },
    { name: 'Cart Abandonment', relevance: 'Critical', benchmark: '5-15% recovery rate', notes: 'Multi-touch series with escalating incentives.' },
    { name: 'Birthday Celebration', relevance: 'Critical', benchmark: '+481% transaction rate vs. promo', notes: 'High-performing journey.' },
    { name: 'Lapsed Customer Win-Back', relevance: 'Critical', benchmark: '5-15% win-back rate', notes: 'Define lapsed based on typical purchase frequency.' },
    { name: 'Browse Abandonment', relevance: 'High', benchmark: '1-3% conversion rate', notes: 'Target product viewers who didn\'t add to cart.' },
    { name: 'Post-Purchase Review', relevance: 'High', notes: 'Time based on product type.' },
    { name: 'Loyalty Tier Progression', relevance: 'High', notes: 'Drive members toward next tier.' },
  ],
  'financial-services': [
    { name: 'Account Onboarding', relevance: 'Critical', benchmark: '60-80% activation rate', notes: 'Focus on activation milestones.' },
    { name: 'Application Abandonment', relevance: 'Critical', benchmark: '10-25% recovery rate', notes: 'Recovery for abandoned product applications.' },
    { name: 'Cross-Sell Recommendations', relevance: 'High', benchmark: '+15-25% conversion', notes: 'Based on life stage and product holdings.' },
    { name: 'Dormant Account Reactivation', relevance: 'High', notes: 'Re-engage inactive accounts.' },
    { name: 'Birthday / Milestone Recognition', relevance: 'Medium', notes: 'Relationship building.' },
  ],
  'healthcare-life-sciences': [
    { name: 'New Patient Onboarding', relevance: 'Critical', benchmark: '40-60% portal adoption', notes: 'Focus on portal activation and care team introduction.' },
    { name: 'Appointment Reminders', relevance: 'Critical', benchmark: '85-95% show rate', notes: 'Multi-channel reminders with prep instructions.' },
    { name: 'Medication Adherence', relevance: 'Critical', benchmark: '10-20% improvement', notes: 'Refill reminders and education content.' },
    { name: 'Patient Program Enrollment', relevance: 'High', benchmark: '15-30% enrollment increase', notes: 'Condition-specific programs.' },
    { name: 'Post-Visit Follow-Up', relevance: 'High', notes: 'Care instructions and satisfaction survey.' },
  ],
  'manufacturing': [
    { name: 'Lead Nurture', relevance: 'Critical', benchmark: '+20-40% conversion', notes: 'Long-cycle nurture with educational content.' },
    { name: 'Account-Based Marketing', relevance: 'Critical', benchmark: '+30-50% engagement', notes: 'Multi-stakeholder, coordinated touchpoints.' },
    { name: 'Product Registration', relevance: 'High', benchmark: '+25-40% registration', notes: 'Post-purchase journey driving registration.' },
    { name: 'Service Reminders', relevance: 'High', benchmark: '+20-30% service attach', notes: 'Maintenance schedules and service contract renewals.' },
    { name: 'Dealer Enablement', relevance: 'High', benchmark: '+30-50% portal engagement', notes: 'Training and incentive programs.' },
  ],
  'travel-hospitality': [
    { name: 'Booking Abandonment', relevance: 'Critical', benchmark: '5-15% recovery', notes: 'Multi-touch recovery with urgency.' },
    { name: 'Pre-Arrival Journey', relevance: 'Critical', benchmark: '+15-25% ancillary revenue', notes: 'Build anticipation, offer upgrades.' },
    { name: 'Loyalty Enrollment & Progression', relevance: 'Critical', benchmark: '+20-35% enrollment', notes: 'Drive enrollment and tier progression.' },
    { name: 'Post-Stay Engagement', relevance: 'High', benchmark: '+15-25% repeat booking', notes: 'Feedback and loyalty cultivation.' },
    { name: 'On-Property Engagement', relevance: 'High', notes: 'Real-time offers and service communications.' },
  ],
  'media-entertainment': [
    { name: 'Trial Onboarding', relevance: 'Critical', benchmark: '+30-50% conversion', notes: 'Drive activation and value demonstration.' },
    { name: 'Content Recommendations', relevance: 'Critical', benchmark: '+20-40% engagement', notes: 'Personalized based on viewing history.' },
    { name: 'Churn Prevention', relevance: 'Critical', benchmark: '5-15% save rate', notes: 'At-risk identification and intervention.' },
    { name: 'New Content Alerts', relevance: 'High', notes: 'Personalized to preferences.' },
    { name: 'Re-engagement', relevance: 'High', benchmark: '10-20% reactivation', notes: 'For inactive subscribers.' },
  ],
  'technology': [
    { name: 'Trial Onboarding', relevance: 'Critical', benchmark: '+25-40% conversion', notes: 'Focus on time-to-value.' },
    { name: 'Product Adoption', relevance: 'Critical', benchmark: '+30-50% feature adoption', notes: 'Feature education and activation.' },
    { name: 'At-Risk Customer Intervention', relevance: 'Critical', benchmark: '20-35% save rate', notes: 'Health score-triggered outreach.' },
    { name: 'Renewal Journey', relevance: 'High', benchmark: '80-95% renewal rate', notes: 'Multi-touch renewal journey.' },
    { name: 'Expansion Triggers', relevance: 'High', benchmark: '+15-25% expansion', notes: 'Usage-based upsell opportunities.' },
  ],
};

// ROI benchmarks
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

// Build industry-specific context
function buildIndustryContext(industryName: string | undefined): string {
  if (!industryName) return '';

  const industryId = INDUSTRY_TYPE_MAP[industryName];
  if (!industryId) return '';

  const kpis = INDUSTRY_KPIS[industryId] || [];
  const journeys = INDUSTRY_JOURNEYS[industryId] || [];

  let context = `\n### ${industryName} - Reference Data\n\n`;

  // KPIs section
  context += `#### Key Performance Indicators (KPIs)\n`;
  kpis.forEach(kpi => {
    context += `- **${kpi.metric}**: ${kpi.benchmark}\n`;
    if (kpi.levers.length > 0) {
      context += `  - Improvement levers: ${kpi.levers.join(', ')}\n`;
    }
  });
  context += '\n';

  // Critical journeys section
  context += `#### Priority Journeys\n`;
  journeys.forEach(journey => {
    const benchmark = journey.benchmark ? ` (${journey.benchmark})` : '';
    context += `- **${journey.name}** [${journey.relevance}]${benchmark}\n`;
    context += `  - ${journey.notes}\n`;
  });

  return context;
}

// Build the system prompt — tries DB-backed reference data first, falls back to hardcoded
async function buildSystemPrompt(request: ChatRequest): Promise<string> {
  const industryId = request.industry ? (INDUSTRY_TYPE_MAP[request.industry] || request.industry) : undefined;

  // Try DB-backed reference data
  let dbRefData: Awaited<ReturnType<typeof fetchFormattedReferenceData>> = null;
  try {
    dbRefData = await fetchFormattedReferenceData({
      industry: industryId,
      maturityLevel: request.currentMaturityLevel,
    });
  } catch { /* fall back to hardcoded */ }

  const industryContext = dbRefData
    ? [dbRefData.kpis, dbRefData.journeys, dbRefData.roiBenchmarks, dbRefData.channelPriorities, dbRefData.tactics, dbRefData.offerings].filter(Boolean).join('\n\n')
    : buildIndustryContext(request.industry);

  const foundationNote = request.marketingFoundation
    ? `\n\nThe client is considering ${request.marketingFoundation === 'mc-advanced'
        ? 'MC Advanced with Data Cloud (Agentforce-ready)'
        : 'MC Engagement (standard)'} as their marketing foundation.`
    : '';

  const maturityNote = request.currentMaturityLevel
    ? `\n\nThe client's current overall maturity level is approximately ${request.currentMaturityLevel} out of 5.`
    : '';

  // Get PDF-sourced knowledge relevant to the latest user message
  const latestUserMessage = request.messages?.filter(m => m.role === 'user').pop()?.content || '';
  const pdfKnowledge = latestUserMessage
    ? getChatKnowledge(latestUserMessage, industryId ? [industryId] : undefined)
    : '';

  return `You are a Maturity Assessment Assistant for Salesforce Marketing Cloud implementations. You help Merkle consultants assess client maturity and plan capability roadmaps.

Your expertise includes:
- Salesforce Marketing Cloud (MC Engagement and MC Advanced with Data Cloud)
- Marketing automation maturity models
- Journey orchestration best practices
- Data integration and identity resolution
- Einstein AI features for marketing
- Cross-channel marketing orchestration

## Reference Knowledge

${TRACK_DESCRIPTIONS}

${dbRefData ? '' : ROI_BENCHMARKS}

${industryContext}${foundationNote}${maturityNote}

${pdfKnowledge}

## Response Guidelines

1. Be specific and actionable in your recommendations
2. Reference relevant benchmarks and KPIs when discussing performance
3. Tailor advice to the industry context when provided
4. Explain the "why" behind recommendations, not just the "what"
5. When discussing journeys, mention expected outcomes and prerequisites
6. Keep responses concise but comprehensive
7. Use bullet points and formatting for clarity
8. If asked about capabilities, explain what they enable and when to implement them

Remember: You're helping consultants have better client conversations. Provide the kind of insights that demonstrate expertise and build client confidence.`;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as ChatRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new Anthropic({ apiKey });
    const systemPrompt = await buildSystemPrompt(body);

    // Convert messages to Anthropic format
    const anthropicMessages = body.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return new Response(JSON.stringify({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to generate response'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
