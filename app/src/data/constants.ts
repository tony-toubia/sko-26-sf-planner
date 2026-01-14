import type {
  MaturityStage,
  Discipline,
  PhaseInfo,
  JourneyCategory,
  MaturityLevel,
} from '../types';

export const MATURITY_STAGES: MaturityStage[] = [
  {
    level: 0,
    name: 'Lagging',
    shortName: 'Lagging',
    description:
      'Companies ignore the imperative to evolve along with their consumers.',
    color: '#E63946',
  },
  {
    level: 1,
    name: 'Siloed',
    shortName: 'Siloed',
    description:
      'Companies try isolated programs in a single channel to evaluate what works and what doesn\'t.',
    color: '#F77F00',
  },
  {
    level: 2,
    name: 'Adopting',
    shortName: 'Adopting',
    description:
      'Companies take early successes and begin to adopt new capabilities and apply those across marketing and communications.',
    color: '#FCBF49',
  },
  {
    level: 3,
    name: 'Scaling',
    shortName: 'Scaling',
    description:
      'Companies are focused on optimizing systems and applying those across all business units and corporate functions – removing friction in the process.',
    color: '#90BE6D',
  },
  {
    level: 4,
    name: 'Strategic',
    shortName: 'Strategic',
    description:
      'Companies leverage their advanced digital capabilities into a competitive advantage in the marketplace.',
    color: '#43AA8B',
  },
  {
    level: 5,
    name: 'Transformed',
    shortName: 'Transformed',
    description:
      'Companies have achieved full digital transformation with data-driven, AI-powered customer experiences.',
    color: '#4361EE',
  },
];

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
    name: 'Loyalty',
    shortName: 'Loyalty',
    description:
      'Customer loyalty programs, rewards, tier management, and retention strategies.',
    icon: 'Award',
    salesforceCloud: 'Loyalty Management',
  },
  {
    id: 'b2b',
    name: 'B2B Marketing',
    shortName: 'B2B',
    description:
      'Account-based marketing, lead scoring, partner management, and B2B customer journeys.',
    icon: 'Building',
    salesforceCloud: 'Marketing Cloud Account Engagement',
  },
  {
    id: 'commerce',
    name: 'Commerce',
    shortName: 'Commerce',
    description:
      'E-commerce, order management, fulfillment, and unified commerce experiences.',
    icon: 'ShoppingCart',
    salesforceCloud: 'Commerce Cloud',
  },
  {
    id: 'service',
    name: 'Service',
    shortName: 'Service',
    description:
      'Customer service, case management, knowledge base, and service automation.',
    icon: 'Headphones',
    salesforceCloud: 'Service Cloud',
  },
  {
    id: 'data-cloud',
    name: 'Data Cloud',
    shortName: 'Data',
    description:
      'Customer data platform, identity resolution, segmentation, and data activation.',
    icon: 'Database',
    salesforceCloud: 'Data Cloud',
  },
];

export const PHASES: PhaseInfo[] = [
  {
    phase: 1,
    name: 'Phase 1: Unlock New Capabilities',
    description:
      'Migrating to new platforms and setting up foundational integrations to unlock advanced capabilities.',
    color: '#0077C8',
  },
  {
    phase: 2,
    name: 'Phase 2: Activate New Capabilities',
    description:
      'Applying new capabilities across subscriber lifecycle journeys and campaigns with purchase data integration.',
    color: '#F77F00',
  },
  {
    phase: 3,
    name: 'Phase 3: Meeting Today\'s Consumer Expectations',
    description:
      'Activating rich consumer-level purchase and loyalty data to affect segmentation, journeys, and detailed performance analysis.',
    color: '#43AA8B',
  },
  {
    phase: 4,
    name: 'Phase 4: Future Proofing',
    description:
      'Moving from touchpoints to moments, informed by rich customer behavior in the form of experience-led journeys backed by data & insights.',
    color: '#7C3AED',
  },
];

export const JOURNEY_CATEGORIES: JourneyCategory[] = [
  {
    type: 'above-the-line',
    name: 'Above the Line',
    description:
      'Visible customer data activation tactics that drive acquisition, retention, and sustained customer engagement. These are the obvious, expected journeys.',
    examples: [
      'Welcome/Onboarding',
      'Birthday',
      'Re-Engagement',
      'Newsletter',
      'Promotional Campaigns',
    ],
  },
  {
    type: 'transactional',
    name: 'Transactional',
    description:
      'Journeys triggered by transactional data that may require deeper data integration but follow standard patterns.',
    examples: [
      'Cart Abandon',
      'Browse Abandon',
      'Purchase Confirmation',
      'Shipment Tracking',
      'Post-Purchase Review',
    ],
  },
  {
    type: 'below-the-line',
    name: 'Below the Line',
    description:
      'Sophisticated value creation through deeper customer relationships using 1st, 2nd, and 3rd party data enrichment. Brand-unique experiences that require custom insights or modeling.',
    examples: [
      'Churn Prediction Intervention',
      'Next Best Action',
      'Custom Propensity Journeys',
      'Lifetime Value Optimization',
      'Insight-Driven Experiences',
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
