#!/usr/bin/env node
/**
 * MCP Knowledge Server for M&P Maturity Assessment
 *
 * Provides tools for AI agents to query marketing personalization knowledge
 * from extracted PDF reference materials and hardcoded domain knowledge.
 *
 * Tools:
 * - search_knowledge: Semantic search across all PDF-sourced knowledge
 * - get_offering_knowledge: Get offering details, pricing, engagement definitions
 * - get_sales_intelligence: Get case studies, market data, sales narratives
 * - get_methodology: Get frameworks, methodologies, strategic guidance
 * - get_phase_overview: Get implementation phase details
 * - get_channel_recommendation: Get channel strategy recommendations
 * - get_journey_guidance: Get journey implementation guidance
 * - get_sources: List all available knowledge sources
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  loadKnowledgeBase,
  queryKnowledge,
  getOfferingKnowledge,
  getSalesIntelligence,
  getMethodologyKnowledge,
  getSourcesSummary,
  getAvailableDisciplines,
  getAvailableTopics,
} from './knowledge-query.js';

// Load knowledge base at startup
try {
  loadKnowledgeBase();
  console.error('Knowledge base loaded successfully');
} catch (err) {
  console.error('Warning: Could not load knowledge base:', err);
}

// Hardcoded phase/channel/journey data (kept for structured lookups)
const PHASES = {
  1: {
    name: 'Unlock New Capabilities',
    description: 'Foundation phase focused on platform migration and data integration',
    focus: 'Data Cloud + MC Advanced (or MC Engagement) activation',
    keyOutcomes: [
      'Data Cloud or MC Engagement configured',
      'Purchase/loyalty data integrated',
      'Identity resolution established',
      'Zero-copy integrations active',
    ],
    expectedROI: { operationalEfficiency: '3X', digitalChannelPenetration: '+111%' },
    keyDecisions: ['MC Engagement vs MC Advanced choice', 'Data sources to integrate', 'Migration scope and timeline'],
    prerequisites: ['Salesforce licensing in place', 'Data source inventory'],
  },
  2: {
    name: 'Activate New Capabilities',
    description: 'Campaign enhancement and subscriber journey deployment phase',
    focus: 'Journey Builder activation, Einstein features, dynamic content',
    keyOutcomes: [
      'Planned campaigns converted to journeys',
      'Welcome, birthday, re-engagement journeys live',
      'Einstein engagement scoring active',
      'Dynamic content framework established',
    ],
    expectedROI: { emailRevenue: '+35%', openRateImprovement: '+40% vs industry', welcomeSeriesTransactionRate: '+320%', birthdayTransactionRate: '+481%' },
    keyDecisions: ['Priority subscriber journeys', 'Channels to activate (SMS, Push, Ads)', 'Creative production approach', 'Agentforce readiness'],
    prerequisites: ['Phase 1 complete', 'Creative resources identified'],
  },
  3: {
    name: 'Meeting Consumer Expectations',
    description: 'Purchase-driven journeys and cross-channel activation',
    focus: 'Cart abandonment, post-purchase, cross-channel orchestration, analytics',
    keyOutcomes: [
      'Cart/browse abandonment journeys',
      'Post-purchase and win-back journeys',
      'Cross-channel coordination',
      'SSS reporting and analytics',
    ],
    expectedROI: { crossChannelROAS: '3X', campaignEfficiency: '+100%', cartRecovery: '5-15%', repeatPurchaseRate: '+25%', multiChannelPurchaseRate: '+287%' },
    keyDecisions: ['Priority customer lifecycle journeys', 'Same-store-sales measurement approach', 'Analytics/BI tool selection'],
    prerequisites: ['Purchase data integrated', 'Phase 2 journeys optimized'],
  },
  4: {
    name: 'Future Proofing',
    description: 'Predictive capabilities and brand-unique experiences',
    focus: 'CLV modeling, churn prediction, Agentforce, insight-driven experiences',
    keyOutcomes: [
      'CLV models operational',
      'Churn prediction active',
      'Next-best-action decisioning',
      'Brand-unique experiences live',
    ],
    expectedROI: { existingCustomerSalesLift: '+16% per campaign', lapsedCustomerSalesLift: '+5% per campaign' },
    keyDecisions: ['Priority predictive use cases', 'Build vs. partner for models', 'Agentforce governance framework'],
    prerequisites: ['Rich behavioral data', 'Analytics foundation', 'Phase 3 complete'],
  },
};

const CHANNELS: Record<string, any> = {
  email: {
    name: 'Email',
    useWhen: ['Rich content delivery needed', 'Longer-form messaging appropriate', 'Cost efficiency is priority', 'Detailed tracking required'],
    avoid: ['Time-critical alerts', 'High-value urgent moments'],
    costImplication: 'Included in license',
    typicalOpenRate: '15-25%',
    bestPractices: ['Use Einstein Send Time Optimization', 'Implement engagement scoring splits', 'Dynamic content for personalization', 'A/B test subject lines and content'],
  },
  sms: {
    name: 'SMS/MMS',
    useWhen: ['Message visibility is critical (98% open rate)', 'Timely/urgent notifications', 'Service case notifications', 'Time-sensitive offers'],
    avoid: ['Long-form content', 'Frequent promotional sends', 'Complex messaging'],
    costImplication: 'Incremental per-message cost',
    typicalOpenRate: '98%',
    bestPractices: ['Keep messages under 160 characters', 'Include clear opt-out instructions', 'Use for high-value moments only', 'Coordinate with email to avoid fatigue'],
  },
  ads: {
    name: 'Advertising Studio',
    useWhen: ['Extending reach beyond owned channels', 'Retargeting site visitors', 'Email-unengaged audience', 'Lookalike acquisition', 'Suppressing converters from ad spend'],
    avoid: ['Primary communication channel', 'Service notifications'],
    costImplication: 'Incremental ad spend',
    bestPractices: ['Real-time suppression of converters', 'Coordinate with email journeys', 'Use for high-value audiences', 'Frequency cap to avoid fatigue'],
  },
  push: {
    name: 'Mobile Push',
    useWhen: ['Customer has brand mobile app', 'SMS alternative for non-opted-in', 'Real-time engagement needed', 'Location-based relevance'],
    avoid: ['Users without app', 'Long-form content'],
    costImplication: 'Included (requires app SDK)',
    bestPractices: ['Rich push with images when possible', 'Deep link to app content', 'Use location triggers sparingly', 'Respect notification preferences'],
  },
  directMail: {
    name: 'Direct Mail',
    useWhen: ['Consumer is high value', 'Digital channels saturated', 'Physical copy important', 'Win-back completely disengaged', 'Premium loyalty communications'],
    avoid: ['Low-value customers', 'Time-sensitive offers', 'High-frequency use'],
    costImplication: 'Third-party fulfillment cost',
    bestPractices: ['Reserve for high-ROI moments', 'Personalize with data', 'Track with unique codes/URLs', 'Small batch via AppExchange partners'],
  },
};

const JOURNEYS: Record<string, any> = {
  welcome: {
    name: 'Welcome / Onboarding', stage: 'awareness', phase: 2, impact: 'HIGH', effort: 'LOW',
    description: 'Multi-touch series introducing brand to new subscribers',
    typicalCadence: '3-5 messages over 2-4 weeks',
    keyMetrics: ['Subscriber to purchaser conversion', 'Time to first purchase', 'Journey completion rate'],
    bestPractices: ['Send first email immediately on signup', 'Progress from brand intro to product highlight to offer', 'Include preference center link', 'Split by engagement for follow-ups'],
    benchmarks: { transactionRateLift: '+320% vs promotional' },
  },
  birthday: {
    name: 'Birthday', stage: 'loyalty', phase: 2, impact: 'HIGH', effort: 'LOW',
    description: 'Celebrate customer birthdays with special offers',
    typicalCadence: '1-3 messages around birthday',
    keyMetrics: ['Redemption rate', 'Revenue per recipient'],
    bestPractices: ['Send 7 days before, day of, or extended window', 'Include meaningful offer', 'Personalize with name and preferences', 'Track redemption with unique codes'],
    benchmarks: { transactionRateLift: '+481% vs promotional' },
  },
  cartAbandonment: {
    name: 'Cart Abandonment', stage: 'consideration', phase: 3, impact: 'HIGH', effort: 'HIGH',
    description: 'Recover abandoned carts with timely reminders',
    typicalCadence: '2-3 messages over 24-72 hours',
    keyMetrics: ['Recovery rate', 'Recovered revenue', 'Time to recovery'],
    bestPractices: ['First reminder within 1-2 hours', 'Include cart contents dynamically', 'Escalate incentive if needed', 'Coordinate with browse abandon'],
    benchmarks: { recoveryRate: '5-15%' },
    requiresData: ['Cart events', 'Product catalog', 'User identity'],
  },
  winback: {
    name: 'Purchase Win-Back', stage: 'retention', phase: 3, impact: 'HIGH', effort: 'HIGH',
    description: "Re-engage lapsed customers who haven't purchased",
    typicalCadence: 'Triggered at 30/60/90 day lapse milestones',
    keyMetrics: ['Win-back rate', 'Revenue per reactivation', 'Channel efficiency'],
    bestPractices: ['Define lapse threshold based on purchase cycle', 'Escalate channel intensity (email > SMS > ads > direct mail)', 'Personalize with past purchases', 'Test incentive levels'],
    requiresData: ['Purchase history', 'Last purchase date'],
  },
  reEngagement: {
    name: 'Re-Engagement', stage: 'retention', phase: 2, impact: 'MEDIUM', effort: 'LOW',
    description: 'Re-engage subscribers with declining email engagement',
    typicalCadence: '2-3 messages, then suppress if no response',
    keyMetrics: ['Reactivation rate', 'List hygiene impact'],
    bestPractices: ['Trigger at engagement decline (no opens 30-60 days)', 'Compelling subject line ("We miss you")', 'Include preference update option', 'Suppress non-responders to protect deliverability'],
  },
};

// Server implementation
const server = new Server(
  { name: 'mp-maturity-knowledge', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_knowledge',
      description: 'Search across all PDF-sourced knowledge (offerings, case studies, methodologies, market data) by keywords, discipline, and content type',
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Search query (e.g., "loyalty program assessment", "CRM migration pricing")' },
          disciplines: {
            type: 'array', items: { type: 'string' },
            description: 'Filter by discipline: messaging-personalization, loyalty, data-identity',
          },
          chunkTypes: {
            type: 'array', items: { type: 'string', enum: ['offering-summary', 'pricing', 'sales-narrative', 'methodology', 'case-study', 'market-data', 'strategic-framework', 'engagement-definition', 'capability', 'general'] },
            description: 'Filter by content type',
          },
          limit: { type: 'number', description: 'Max results (default 10)', minimum: 1, maximum: 50 },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_offering_knowledge',
      description: 'Get offering summaries, pricing, and engagement definitions for a discipline',
      inputSchema: {
        type: 'object' as const,
        properties: {
          discipline: { type: 'string', description: 'Discipline: messaging-personalization, loyalty, or data-identity' },
          limit: { type: 'number', description: 'Max results (default 20)' },
        },
      },
    },
    {
      name: 'get_sales_intelligence',
      description: 'Get case studies, market data, and sales narratives for building compelling recommendations',
      inputSchema: {
        type: 'object' as const,
        properties: {
          discipline: { type: 'string', description: 'Filter by discipline' },
          query: { type: 'string', description: 'Optional keyword filter' },
          limit: { type: 'number', description: 'Max results (default 15)' },
        },
      },
    },
    {
      name: 'get_methodology',
      description: 'Get methodology, framework, and strategic guidance knowledge',
      inputSchema: {
        type: 'object' as const,
        properties: {
          discipline: { type: 'string', description: 'Filter by discipline' },
          query: { type: 'string', description: 'Optional keyword filter' },
          limit: { type: 'number', description: 'Max results (default 15)' },
        },
      },
    },
    {
      name: 'get_phase_overview',
      description: 'Get comprehensive overview of an implementation phase (1-4)',
      inputSchema: {
        type: 'object' as const,
        properties: {
          phase: { type: 'number', description: 'Phase number (1-4)', minimum: 1, maximum: 4 },
        },
        required: ['phase'],
      },
    },
    {
      name: 'get_channel_recommendation',
      description: 'Get channel strategy recommendations',
      inputSchema: {
        type: 'object' as const,
        properties: {
          channel: { type: 'string', description: 'Channel: email, sms, ads, push, or directMail', enum: ['email', 'sms', 'ads', 'push', 'directMail'] },
        },
        required: ['channel'],
      },
    },
    {
      name: 'get_journey_guidance',
      description: 'Get implementation guidance for a journey type',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journey: { type: 'string', description: 'Journey: welcome, birthday, cartAbandonment, winback, or reEngagement', enum: ['welcome', 'birthday', 'cartAbandonment', 'winback', 'reEngagement'] },
        },
        required: ['journey'],
      },
    },
    {
      name: 'get_sources',
      description: 'List all available knowledge sources with chunk counts and word counts',
      inputSchema: { type: 'object' as const, properties: {} },
    },
  ],
}));

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'search_knowledge': {
      const results = queryKnowledge({
        query: args?.query as string,
        disciplines: args?.disciplines as string[] | undefined,
        chunkTypes: args?.chunkTypes as any[] | undefined,
        limit: (args?.limit as number) || 10,
      });

      if (results.length === 0) {
        return { content: [{ type: 'text', text: 'No results found. Try broader search terms or different filters.' }] };
      }

      const formatted = results.map(r => ({
        source: r.chunk.sourceShortName,
        section: r.chunk.section,
        type: r.chunk.chunkType,
        score: Math.round(r.score * 100) / 100,
        content: r.chunk.content.slice(0, 800),
        offerings: r.chunk.offerings,
        pricePoints: r.chunk.pricePoints,
        matchReasons: r.matchReasons,
      }));

      return { content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }] };
    }

    case 'get_offering_knowledge': {
      const result = getOfferingKnowledge(
        args?.discipline as string | undefined,
        { limit: (args?.limit as number) || 20 }
      );
      return { content: [{ type: 'text', text: result || 'No offering knowledge found for this discipline.' }] };
    }

    case 'get_sales_intelligence': {
      const result = getSalesIntelligence(
        args?.discipline as string | undefined,
        args?.query as string | undefined,
        { limit: (args?.limit as number) || 15 }
      );
      return { content: [{ type: 'text', text: result || 'No sales intelligence found.' }] };
    }

    case 'get_methodology': {
      const result = getMethodologyKnowledge(
        args?.discipline as string | undefined,
        args?.query as string | undefined,
        { limit: (args?.limit as number) || 15 }
      );
      return { content: [{ type: 'text', text: result || 'No methodology knowledge found.' }] };
    }

    case 'get_phase_overview': {
      const phase = args?.phase as number;
      const phaseData = PHASES[phase as keyof typeof PHASES];
      if (!phaseData) return { content: [{ type: 'text', text: `Phase ${phase} not found` }] };
      return { content: [{ type: 'text', text: JSON.stringify(phaseData, null, 2) }] };
    }

    case 'get_channel_recommendation': {
      const channel = args?.channel as string;
      const channelData = CHANNELS[channel];
      if (!channelData) return { content: [{ type: 'text', text: `Channel ${channel} not found` }] };
      return { content: [{ type: 'text', text: JSON.stringify(channelData, null, 2) }] };
    }

    case 'get_journey_guidance': {
      const journey = args?.journey as string;
      const journeyData = JOURNEYS[journey];
      if (!journeyData) return { content: [{ type: 'text', text: `Journey ${journey} not found` }] };
      return { content: [{ type: 'text', text: JSON.stringify(journeyData, null, 2) }] };
    }

    case 'get_sources': {
      const summary = getSourcesSummary();
      const disciplines = getAvailableDisciplines();
      const topics = getAvailableTopics();
      return {
        content: [{
          type: 'text',
          text: `${summary}\n\n**Disciplines**: ${disciplines.join(', ')}\n**Topics**: ${topics.join(', ')}`,
        }],
      };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('M&P Knowledge MCP Server v2.0 running on stdio');
}

main().catch(console.error);
