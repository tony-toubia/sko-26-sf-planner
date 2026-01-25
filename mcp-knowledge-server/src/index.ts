#!/usr/bin/env node
/**
 * MCP Knowledge Server for M&P Maturity Assessment
 *
 * Provides tools for AI agents to query marketing personalization knowledge
 * without consuming the full context of PDF reference materials.
 *
 * Tools:
 * - get_capability_guidance: Get detailed guidance for a specific capability
 * - get_channel_recommendation: Get channel strategy recommendations
 * - get_journey_guidance: Get journey implementation guidance
 * - get_phase_overview: Get overview of an implementation phase
 * - get_roi_benchmarks: Get expected ROI benchmarks
 * - search_knowledge: Search across all knowledge areas
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Knowledge base - embedded for fast retrieval
const KNOWLEDGE_BASE = {
  phases: {
    1: {
      name: 'Unlock New Capabilities',
      description:
        'Foundation phase focused on platform migration and data integration',
      focus: 'Data Cloud + MC Advanced (or MC Engagement) activation',
      keyOutcomes: [
        'Data Cloud or MC Engagement configured',
        'Purchase/loyalty data integrated',
        'Identity resolution established',
        'Zero-copy integrations active',
      ],
      expectedROI: {
        operationalEfficiency: '3X',
        digitalChannelPenetration: '+111%',
      },
      keyDecisions: [
        'MC Engagement vs MC Advanced choice',
        'Data sources to integrate',
        'Migration scope and timeline',
      ],
      prerequisites: ['Salesforce licensing in place', 'Data source inventory'],
    },
    2: {
      name: 'Activate New Capabilities',
      description:
        'Campaign enhancement and subscriber journey deployment phase',
      focus: 'Journey Builder activation, Einstein features, dynamic content',
      keyOutcomes: [
        'Planned campaigns converted to journeys',
        'Welcome, birthday, re-engagement journeys live',
        'Einstein engagement scoring active',
        'Dynamic content framework established',
      ],
      expectedROI: {
        emailRevenue: '+35%',
        openRateImprovement: '+40% vs industry',
        welcomeSeriesTransactionRate: '+320%',
        birthdayTransactionRate: '+481%',
      },
      keyDecisions: [
        'Priority subscriber journeys',
        'Channels to activate (SMS, Push, Ads)',
        'Creative production approach',
        'Agentforce readiness',
      ],
      prerequisites: ['Phase 1 complete', 'Creative resources identified'],
    },
    3: {
      name: 'Meeting Consumer Expectations',
      description: 'Purchase-driven journeys and cross-channel activation',
      focus:
        'Cart abandonment, post-purchase, cross-channel orchestration, analytics',
      keyOutcomes: [
        'Cart/browse abandonment journeys',
        'Post-purchase and win-back journeys',
        'Cross-channel coordination',
        'SSS reporting and analytics',
      ],
      expectedROI: {
        crossChannelROAS: '3X',
        campaignEfficiency: '+100%',
        cartRecovery: '5-15%',
        repeatPurchaseRate: '+25%',
        multiChannelPurchaseRate: '+287%',
      },
      keyDecisions: [
        'Priority customer lifecycle journeys',
        'Same-store-sales measurement approach',
        'Analytics/BI tool selection',
      ],
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
      expectedROI: {
        existingCustomerSalesLift: '+16% per campaign',
        lapsedCustomerSalesLift: '+5% per campaign',
      },
      keyDecisions: [
        'Priority predictive use cases',
        'Build vs. partner for models',
        'Agentforce governance framework',
      ],
      prerequisites: ['Rich behavioral data', 'Analytics foundation', 'Phase 3 complete'],
    },
  },

  channels: {
    email: {
      name: 'Email',
      useWhen: [
        'Rich content delivery needed',
        'Longer-form messaging appropriate',
        'Cost efficiency is priority',
        'Detailed tracking required',
      ],
      avoid: ['Time-critical alerts', 'High-value urgent moments'],
      costImplication: 'Included in license',
      typicalOpenRate: '15-25%',
      bestPractices: [
        'Use Einstein Send Time Optimization',
        'Implement engagement scoring splits',
        'Dynamic content for personalization',
        'A/B test subject lines and content',
      ],
    },
    sms: {
      name: 'SMS/MMS',
      useWhen: [
        'Message visibility is critical (98% open rate)',
        'Timely/urgent notifications',
        'Service case notifications',
        'Time-sensitive offers',
      ],
      avoid: ['Long-form content', 'Frequent promotional sends', 'Complex messaging'],
      costImplication: 'Incremental per-message cost',
      typicalOpenRate: '98%',
      bestPractices: [
        'Keep messages under 160 characters',
        'Include clear opt-out instructions',
        'Use for high-value moments only',
        'Coordinate with email to avoid fatigue',
      ],
      complianceNotes: [
        'TCPA compliance required',
        'Explicit consent needed',
        'Quiet hours (typically 8am-9pm)',
        'Short code registration required',
      ],
    },
    ads: {
      name: 'Advertising Studio',
      useWhen: [
        'Extending reach beyond owned channels',
        'Retargeting site visitors',
        'Email-unengaged audience',
        'Lookalike acquisition',
        'Suppressing converters from ad spend',
      ],
      avoid: ['Primary communication channel', 'Service notifications'],
      costImplication: 'Incremental ad spend',
      bestPractices: [
        'Real-time suppression of converters',
        'Coordinate with email journeys',
        'Use for high-value audiences',
        'Frequency cap to avoid fatigue',
      ],
    },
    push: {
      name: 'Mobile Push',
      useWhen: [
        'Customer has brand mobile app',
        'SMS alternative for non-opted-in',
        'Real-time engagement needed',
        'Location-based relevance',
      ],
      avoid: ['Users without app', 'Long-form content'],
      costImplication: 'Included (requires app SDK)',
      bestPractices: [
        'Rich push with images when possible',
        'Deep link to app content',
        'Use location triggers sparingly',
        'Respect notification preferences',
      ],
    },
    directMail: {
      name: 'Direct Mail',
      useWhen: [
        'Consumer is high value',
        'Digital channels saturated',
        'Physical copy important',
        'Win-back completely disengaged',
        'Premium loyalty communications',
      ],
      avoid: ['Low-value customers', 'Time-sensitive offers', 'High-frequency use'],
      costImplication: 'Third-party fulfillment cost',
      bestPractices: [
        'Reserve for high-ROI moments',
        'Personalize with data',
        'Track with unique codes/URLs',
        'Small batch via AppExchange partners',
      ],
    },
  },

  journeys: {
    welcome: {
      name: 'Welcome / Onboarding',
      stage: 'awareness',
      phase: 2,
      impact: 'HIGH',
      effort: 'LOW',
      description: 'Multi-touch series introducing brand to new subscribers',
      typicalCadence: '3-5 messages over 2-4 weeks',
      keyMetrics: [
        'Subscriber to purchaser conversion',
        'Time to first purchase',
        'Journey completion rate',
      ],
      bestPractices: [
        'Send first email immediately on signup',
        'Progress from brand intro to product highlight to offer',
        'Include preference center link',
        'Split by engagement for follow-ups',
      ],
      benchmarks: {
        transactionRateLift: '+320% vs promotional',
      },
    },
    birthday: {
      name: 'Birthday',
      stage: 'loyalty',
      phase: 2,
      impact: 'HIGH',
      effort: 'LOW',
      description: 'Celebrate customer birthdays with special offers',
      typicalCadence: '1-3 messages around birthday',
      keyMetrics: ['Redemption rate', 'Revenue per recipient'],
      bestPractices: [
        'Send 7 days before, day of, or extended window',
        'Include meaningful offer',
        'Personalize with name and preferences',
        'Track redemption with unique codes',
      ],
      benchmarks: {
        transactionRateLift: '+481% vs promotional',
      },
    },
    cartAbandonment: {
      name: 'Cart Abandonment',
      stage: 'consideration',
      phase: 3,
      impact: 'HIGH',
      effort: 'HIGH',
      description: 'Recover abandoned carts with timely reminders',
      typicalCadence: '2-3 messages over 24-72 hours',
      keyMetrics: ['Recovery rate', 'Recovered revenue', 'Time to recovery'],
      bestPractices: [
        'First reminder within 1-2 hours',
        'Include cart contents dynamically',
        'Escalate incentive if needed',
        'Coordinate with browse abandon',
      ],
      benchmarks: {
        recoveryRate: '5-15%',
      },
      requiresData: ['Cart events', 'Product catalog', 'User identity'],
    },
    winback: {
      name: 'Purchase Win-Back',
      stage: 'retention',
      phase: 3,
      impact: 'HIGH',
      effort: 'HIGH',
      description: 'Re-engage lapsed customers who haven\'t purchased',
      typicalCadence: 'Triggered at 30/60/90 day lapse milestones',
      keyMetrics: ['Win-back rate', 'Revenue per reactivation', 'Channel efficiency'],
      bestPractices: [
        'Define lapse threshold based on purchase cycle',
        'Escalate channel intensity (email → SMS → ads → direct mail)',
        'Personalize with past purchases',
        'Test incentive levels',
      ],
      requiresData: ['Purchase history', 'Last purchase date'],
    },
    reEngagement: {
      name: 'Re-Engagement',
      stage: 'retention',
      phase: 2,
      impact: 'MEDIUM',
      effort: 'LOW',
      description: 'Re-engage subscribers with declining email engagement',
      typicalCadence: '2-3 messages, then suppress if no response',
      keyMetrics: ['Reactivation rate', 'List hygiene impact'],
      bestPractices: [
        'Trigger at engagement decline (no opens 30-60 days)',
        'Compelling subject line ("We miss you")',
        'Include preference update option',
        'Suppress non-responders to protect deliverability',
      ],
    },
  },

  capabilities: {
    dataCloud: {
      name: 'Data Cloud + MC Advanced',
      phase: 1,
      description: 'Foundational data layer for modern Salesforce marketing',
      unlocks: [
        'Flow for Marketing',
        'Einstein Engagement Scoring',
        'Zero-Copy Federation',
        'Identity Resolution',
        'Agentforce Campaign Creation',
        'Calculated Insights',
      ],
      whenToRecommend: [
        'Client needs Agentforce readiness',
        'Multiple data sources to unify',
        'Cross-cloud use cases (Sales + Service + Marketing)',
        'Real-time segmentation requirements',
        'Enterprise-scale personalization',
      ],
      alternatives: 'MC Engagement for simpler needs, budget constraints',
    },
    einsteinEngagementScoring: {
      name: 'Einstein Engagement Scoring',
      phase: 2,
      description: 'Predict individual likelihood to open, click, unsubscribe, convert',
      benefits: [
        'Optimize journey paths by predicted behavior',
        'Reduce unsubscribes through fatigue management',
        'Improve deliverability with smart suppression',
        'Personalize send frequency by individual',
      ],
      implementation: [
        'Activate in Einstein settings',
        'Allow 2-4 weeks for model training',
        'Use Einstein splits in Journey Builder',
        'Create personas (Loyalists, Window Shoppers, etc.)',
      ],
    },
    einsteinSTO: {
      name: 'Einstein Send Time Optimization',
      phase: 2,
      description: 'AI-optimized individual send times for maximum engagement',
      benefits: [
        'Increase open rates with personalized timing',
        'Better inbox placement',
        'Improved journey velocity',
      ],
      implementation: [
        'Add STO activity before email in journey',
        'Select optimization window (24h, 48h, 7d)',
        'Works best with time-flexible journeys',
      ],
      limitations: [
        'Not ideal for time-sensitive campaigns',
        'Requires journey flexibility',
        'Promotional deadlines may conflict',
      ],
    },
    dynamicContent: {
      name: 'Dynamic Content / Einstein Content Selection',
      phase: 2,
      description: 'AI-powered content personalization at scale',
      benefits: [
        '25-40% higher click-through rates',
        '60-80% reduction in creative variants',
        'Content-level performance insights',
        'Real-time personalization at open',
      ],
      implementation: [
        'Configure Einstein Content Selection',
        'Set up content asset classes',
        'Sync customer profile data',
        'Use AMPscript for dynamic blocks',
      ],
      note: 'Uses super messages - check SFMC contract',
    },
  },
};

// Server implementation
const server = new Server(
  {
    name: 'mp-maturity-knowledge',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_phase_overview',
      description:
        'Get comprehensive overview of an implementation phase (1-4) including focus areas, outcomes, ROI expectations, and key decisions',
      inputSchema: {
        type: 'object' as const,
        properties: {
          phase: {
            type: 'number',
            description: 'Phase number (1-4)',
            minimum: 1,
            maximum: 4,
          },
        },
        required: ['phase'],
      },
    },
    {
      name: 'get_channel_recommendation',
      description:
        'Get channel strategy recommendations for a specific use case or context',
      inputSchema: {
        type: 'object' as const,
        properties: {
          channel: {
            type: 'string',
            description: 'Channel name: email, sms, ads, push, or directMail',
            enum: ['email', 'sms', 'ads', 'push', 'directMail'],
          },
        },
        required: ['channel'],
      },
    },
    {
      name: 'get_journey_guidance',
      description:
        'Get implementation guidance for a specific journey type',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journey: {
            type: 'string',
            description:
              'Journey type: welcome, birthday, cartAbandonment, winback, or reEngagement',
            enum: ['welcome', 'birthday', 'cartAbandonment', 'winback', 'reEngagement'],
          },
        },
        required: ['journey'],
      },
    },
    {
      name: 'get_capability_guidance',
      description: 'Get detailed guidance for a specific capability',
      inputSchema: {
        type: 'object' as const,
        properties: {
          capability: {
            type: 'string',
            description:
              'Capability: dataCloud, einsteinEngagementScoring, einsteinSTO, or dynamicContent',
            enum: [
              'dataCloud',
              'einsteinEngagementScoring',
              'einsteinSTO',
              'dynamicContent',
            ],
          },
        },
        required: ['capability'],
      },
    },
    {
      name: 'get_roi_benchmarks',
      description: 'Get expected ROI benchmarks for a phase or capability',
      inputSchema: {
        type: 'object' as const,
        properties: {
          phase: {
            type: 'number',
            description: 'Phase number (1-4) to get benchmarks for',
            minimum: 1,
            maximum: 4,
          },
        },
        required: ['phase'],
      },
    },
    {
      name: 'search_knowledge',
      description:
        'Search across all knowledge areas for a topic or keyword',
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: {
            type: 'string',
            description: 'Search query (e.g., "cart abandonment", "SMS compliance", "Einstein")',
          },
        },
        required: ['query'],
      },
    },
  ],
}));

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_phase_overview': {
      const phase = args?.phase as number;
      const phaseData = KNOWLEDGE_BASE.phases[phase as keyof typeof KNOWLEDGE_BASE.phases];
      if (!phaseData) {
        return { content: [{ type: 'text', text: `Phase ${phase} not found` }] };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(phaseData, null, 2),
          },
        ],
      };
    }

    case 'get_channel_recommendation': {
      const channel = args?.channel as string;
      const channelData = KNOWLEDGE_BASE.channels[channel as keyof typeof KNOWLEDGE_BASE.channels];
      if (!channelData) {
        return {
          content: [{ type: 'text', text: `Channel ${channel} not found` }],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(channelData, null, 2),
          },
        ],
      };
    }

    case 'get_journey_guidance': {
      const journey = args?.journey as string;
      const journeyData = KNOWLEDGE_BASE.journeys[journey as keyof typeof KNOWLEDGE_BASE.journeys];
      if (!journeyData) {
        return {
          content: [{ type: 'text', text: `Journey ${journey} not found` }],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(journeyData, null, 2),
          },
        ],
      };
    }

    case 'get_capability_guidance': {
      const capability = args?.capability as string;
      const capabilityData =
        KNOWLEDGE_BASE.capabilities[capability as keyof typeof KNOWLEDGE_BASE.capabilities];
      if (!capabilityData) {
        return {
          content: [{ type: 'text', text: `Capability ${capability} not found` }],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(capabilityData, null, 2),
          },
        ],
      };
    }

    case 'get_roi_benchmarks': {
      const phase = args?.phase as number;
      const phaseData = KNOWLEDGE_BASE.phases[phase as keyof typeof KNOWLEDGE_BASE.phases];
      if (!phaseData) {
        return { content: [{ type: 'text', text: `Phase ${phase} not found` }] };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                phase,
                phaseName: phaseData.name,
                expectedROI: phaseData.expectedROI,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'search_knowledge': {
      const query = (args?.query as string).toLowerCase();
      const results: { area: string; key: string; relevance: string }[] = [];

      // Search phases
      for (const [key, phase] of Object.entries(KNOWLEDGE_BASE.phases)) {
        if (
          phase.name.toLowerCase().includes(query) ||
          phase.description.toLowerCase().includes(query) ||
          phase.focus.toLowerCase().includes(query)
        ) {
          results.push({
            area: 'phases',
            key,
            relevance: phase.name,
          });
        }
      }

      // Search channels
      for (const [key, channel] of Object.entries(KNOWLEDGE_BASE.channels)) {
        if (
          channel.name.toLowerCase().includes(query) ||
          channel.useWhen.some((u) => u.toLowerCase().includes(query))
        ) {
          results.push({
            area: 'channels',
            key,
            relevance: channel.name,
          });
        }
      }

      // Search journeys
      for (const [key, journey] of Object.entries(KNOWLEDGE_BASE.journeys)) {
        if (
          journey.name.toLowerCase().includes(query) ||
          journey.description.toLowerCase().includes(query)
        ) {
          results.push({
            area: 'journeys',
            key,
            relevance: journey.name,
          });
        }
      }

      // Search capabilities
      for (const [key, capability] of Object.entries(KNOWLEDGE_BASE.capabilities)) {
        if (
          capability.name.toLowerCase().includes(query) ||
          capability.description.toLowerCase().includes(query)
        ) {
          results.push({
            area: 'capabilities',
            key,
            relevance: capability.name,
          });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                results,
                hint: 'Use get_[area]_* tools to retrieve full details',
              },
              null,
              2
            ),
          },
        ],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('M&P Knowledge MCP Server running on stdio');
}

main().catch(console.error);
