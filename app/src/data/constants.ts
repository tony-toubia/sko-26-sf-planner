import type {
  MaturityStage,
  Discipline,
  PhaseInfo,
  JourneyCategory,
  MaturityLevel,
  MarketingFoundation,
} from '../types';

export const MATURITY_STAGES: MaturityStage[] = [
  {
    level: 0,
    name: 'Lagging',
    shortName: 'Lagging',
    description:
      'Companies ignore the imperative to evolve along with their consumers.',
    color: '#DC2626',
  },
  {
    level: 1,
    name: 'Siloed',
    shortName: 'Siloed',
    description:
      'Companies try isolated programs in a single channel to evaluate what works and what doesn\'t.',
    color: '#EA580C',
  },
  {
    level: 2,
    name: 'Adopting',
    shortName: 'Adopting',
    description:
      'Companies take early successes and begin to adopt new capabilities and apply those across marketing and communications.',
    color: '#D97706',
  },
  {
    level: 3,
    name: 'Scaling',
    shortName: 'Scaling',
    description:
      'Companies are focused on optimizing systems and applying those across all business units and corporate functions – removing friction in the process.',
    color: '#65A30D',
  },
  {
    level: 4,
    name: 'Strategic',
    shortName: 'Strategic',
    description:
      'Companies leverage their advanced digital capabilities into a competitive advantage in the marketplace.',
    color: '#0D9488',
  },
  {
    level: 5,
    name: 'Transformed',
    shortName: 'Transformed',
    description:
      'Companies have achieved full digital transformation with data-driven, AI-powered customer experiences.',
    color: '#4F46E5',
  },
];

// Currently focused on M&P and Loyalty - other disciplines coming soon
export const DISCIPLINES: Discipline[] = [
  {
    id: 'messaging-personalization',
    name: 'Messaging & Personalization',
    shortName: 'M&P',
    description:
      'Email, SMS, push notifications, and personalized content delivery across channels.',
    icon: 'Mail',
    salesforceCloud: 'Marketing Cloud',
  },
  {
    id: 'loyalty',
    name: 'Loyalty Management',
    shortName: 'Loyalty',
    description: 'Customer loyalty programs, rewards, tier management, and retention strategies.',
    icon: 'Award',
    salesforceCloud: 'Loyalty Management',
  },
];

// Marketing Foundation Options - the key decision point
export const MARKETING_FOUNDATIONS: MarketingFoundation[] = [
  {
    id: 'mc-engagement',
    name: 'MC Engagement (Legacy)',
    shortName: 'MC Engagement',
    description:
      'Continue with existing Marketing Cloud Engagement investment. Journey Builder-based workflows with traditional data extensions.',
    features: [
      'Journey Builder automation',
      'Email Studio & Content Builder',
      'Basic Einstein features',
      'Traditional data extensions',
      'Existing integrations preserved',
    ],
    limitations: [
      'No Agentforce capabilities',
      'Limited real-time data access',
      'Manual segment management',
      'Some Phase 3-4 capabilities unavailable',
    ],
    recommended: false,
  },
  {
    id: 'mc-advanced',
    name: 'MC Advanced & Data 360',
    shortName: 'MC Advanced',
    description:
      'Full Marketing Cloud Next feature set with Data Cloud foundation. Agentforce-ready infrastructure with zero-copy data federation.',
    features: [
      'Flow for Marketing (visual journey automation)',
      'Data Cloud unified profiles',
      'Agentforce Campaign Agent',
      'Einstein Engagement Scoring & Frequency',
      'Zero-Copy Data Federation (Snowflake, BigQuery, Redshift)',
      'Calculated Insights (CLV, propensity scores)',
      'Real-time segmentation',
      'Identity Resolution & Consent Management',
    ],
    recommended: true,
  },
];

// Future disciplines - not yet implemented but defined for adjacency hints
export const FUTURE_DISCIPLINES = [
  {
    id: 'commerce',
    name: 'Commerce',
    shortName: 'Commerce',
    description: 'E-commerce, order management, fulfillment, and unified commerce experiences.',
    icon: 'ShoppingCart',
    salesforceCloud: 'Commerce Cloud',
    comingSoon: true,
  },
  {
    id: 'service',
    name: 'Service',
    shortName: 'Service',
    description: 'Customer service, case management, knowledge base, and service automation.',
    icon: 'Headphones',
    salesforceCloud: 'Service Cloud',
    comingSoon: true,
  },
];

export const PHASES: PhaseInfo[] = [
  {
    phase: 1,
    name: 'Phase 1: Foundation',
    description:
      'Establish the marketing platform foundation, migrate to modern stack, and set up initial data integrations.',
    color: '#0057A3',
  },
  {
    phase: 2,
    name: 'Phase 2: Activation',
    description:
      'Activate subscriber and customer journeys, build campaign frameworks, and implement cross-channel coordination.',
    color: '#EA580C',
  },
  {
    phase: 3,
    name: 'Phase 3: Optimization',
    description:
      'Optimize with advanced data integrations, lifecycle journeys, dynamic content, and analytics to meet consumer expectations.',
    color: '#059669',
  },
  {
    phase: 4,
    name: 'Phase 4: Transformation',
    description:
      'Transform with insight-driven experiences, identity resolution, and brand-unique capabilities that differentiate.',
    color: '#7C3AED',
  },
];

export const JOURNEY_CATEGORIES: JourneyCategory[] = [
  {
    type: 'above-the-line',
    name: 'Customer Data ACTIVATION',
    description:
      'Visible marketing tactics that drive acquisition, retention, and sustained customer engagement. These are the customer-facing activations that people can see and interact with.',
    examples: [
      'Welcome/Onboarding Journeys',
      'Promotional Campaigns',
      'Re-Engagement Programs',
      'Cart/Browse Abandonment',
      'Cross-Channel Campaigns',
    ],
  },
  {
    type: 'below-the-line',
    name: 'Customer Data MANAGEMENT',
    description:
      'Sophisticated data management that enables deeper customer understanding through 1st, 2nd, and 3rd party data enrichment. The foundational data layer that powers above-the-line activations.',
    examples: [
      'Identity Resolution',
      'Data Integration & ETL',
      'Customer Segmentation',
      'CLV Modeling',
      'Einstein Scoring',
    ],
  },
];

export const LIFECYCLE_STAGES = [
  { id: 'awareness', name: 'Awareness', icon: 'Eye' },
  { id: 'consideration', name: 'Consideration', icon: 'Search' },
  { id: 'purchase', name: 'Purchase', icon: 'CreditCard' },
  { id: 'post-purchase', name: 'Post-Purchase', icon: 'Package' },
  { id: 'retention', name: 'Retention', icon: 'RefreshCw' },
  { id: 'loyalty', name: 'Loyalty', icon: 'Heart' },
] as const;

export const CAPABILITY_PILLARS = [
  {
    id: 'know',
    name: 'KNOW',
    subtitle: 'Manage Customers as an Asset',
    description: 'A well-balanced and appropriately leveraged first-party data asset',
    color: '#0077C8',
  },
  {
    id: 'personalize',
    name: 'PERSONALIZE',
    subtitle: 'Moment Orientation',
    description:
      'Lifecycle journeys and targeted push campaigns that meet consumers in their moment',
    color: '#00A5B5',
  },
  {
    id: 'engage',
    name: 'ENGAGE',
    subtitle: '1-1 Everywhere',
    description:
      'Beyond email – to SMS, addressable media, push, direct mail and more',
    color: '#43AA8B',
  },
  {
    id: 'utilize',
    name: 'UTILIZE',
    subtitle: 'Return on Tech Investment',
    description:
      'A focus on adoption and application of key licensed capabilities and features',
    color: '#7C3AED',
  },
] as const;

// Salesforce Value Proposition - General value that applies across all capabilities
export const SALESFORCE_VALUE_PROPOSITION = {
  overview: 'Each capability in the maturity matrix drives value for Salesforce across three dimensions: consumption, stickiness, and expansion opportunities.',
  dimensions: [
    {
      id: 'consumption',
      name: 'Platform Consumption',
      description: 'Drives increased platform usage through more campaigns, journeys, Einstein processing, and data operations.',
      examples: [
        'More journey entries = more message sends',
        'Einstein features consume super messages',
        'Data integrations drive processing volume',
        'Cross-channel activation multiplies sends per journey',
      ],
    },
    {
      id: 'stickiness',
      name: 'Platform Stickiness',
      description: 'Makes the platform harder to leave by embedding it deeply into critical business processes and decision-making.',
      examples: [
        'Automated journeys become business-critical infrastructure',
        'Einstein models integral to marketing decisions',
        'Data integrations create deep dependencies',
        'Analytics become embedded in workflow',
      ],
    },
    {
      id: 'expansion',
      name: 'Expansion Opportunities',
      description: 'Creates opportunities for cross-sell (additional clouds/products) and up-sell (higher tiers, more contacts, premium features).',
      examples: [
        'Email success drives SMS/Push adoption',
        'Journey Builder success leads to Ad Studio',
        'Data needs drive Data Cloud adoption',
        'Einstein usage leads to higher tier upgrades',
      ],
    },
  ],
  keyMetrics: [
    { metric: '+35%', label: 'Email Revenue', description: 'Average lift from enhanced journeys' },
    { metric: '+40%', label: 'Open Rate', description: 'vs. industry average' },
    { metric: '3X', label: 'ROAS', description: 'Return on ad spend with cross-channel' },
    { metric: '+100%', label: 'Campaign Efficiency', description: 'Through orchestration' },
    { metric: '3X', label: 'Operational Efficiency', description: 'Post-migration' },
    { metric: '+111%', label: 'Digital Penetration', description: 'Channel adoption growth' },
  ],
};

// Legacy template for backwards compatibility
export const SALESFORCE_VALUE_TEMPLATE = {
  consumption:
    'Drives increased platform usage through more campaigns, journeys, and data processing.',
  stickiness:
    'Makes the platform harder to leave by embedding it deeply into business processes.',
  expansion:
    'Creates opportunities for cross-sell (additional clouds) and up-sell (higher tiers, more contacts).',
};

export function getMaturityStage(level: MaturityLevel): MaturityStage {
  return MATURITY_STAGES[level];
}

export function getPhaseInfo(phase: number): PhaseInfo | undefined {
  return PHASES.find((p) => p.phase === phase);
}

export function getDiscipline(id: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.id === id);
}
