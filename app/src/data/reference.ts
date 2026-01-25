/**
 * Reference Data - Extracted from strategic frameworks and industry benchmarks
 * This structured data enables agents and the app to access key guidance without parsing PDFs
 */

// ============================================================================
// ROI BENCHMARKS & EXPECTED OUTCOMES
// ============================================================================

export interface ROIBenchmark {
  id: string;
  metric: string;
  value: string;
  description: string;
  applicablePhases: number[];
  applicableCapabilities?: string[];
  source: 'industry-average' | 'merkle-benchmark' | 'salesforce-benchmark';
}

export const ROI_BENCHMARKS: ROIBenchmark[] = [
  // Phase 1: Unlock New Capabilities
  {
    id: 'operational-efficiency',
    metric: 'Operational Efficiency',
    value: '3X',
    description: 'Efficiency gains from platform migration and unified data foundation',
    applicablePhases: [1],
    applicableCapabilities: ['migrate-sfmc'],
    source: 'merkle-benchmark',
  },
  {
    id: 'digital-channel-penetration',
    metric: 'Digital Channel Penetration',
    value: '+111%',
    description: 'Increase in digital channel reach through new platform capabilities',
    applicablePhases: [1],
    applicableCapabilities: ['migrate-sfmc'],
    source: 'merkle-benchmark',
  },

  // Phase 2: Activate New Capabilities
  {
    id: 'email-revenue',
    metric: 'Email-Attributed Revenue',
    value: '+35%',
    description: 'Increase in revenue attributed to email through journey optimization',
    applicablePhases: [2],
    applicableCapabilities: ['enhance-planned-campaigns', 'baseline-subscriber-journeys'],
    source: 'merkle-benchmark',
  },
  {
    id: 'open-rate-improvement',
    metric: 'Open Rate vs Industry Average',
    value: '+40%',
    description: 'Open rate improvement compared to industry benchmarks',
    applicablePhases: [2],
    applicableCapabilities: ['enhance-planned-campaigns', 'einstein-engagement-scoring'],
    source: 'merkle-benchmark',
  },
  {
    id: 'welcome-transaction-rate',
    metric: 'Welcome Series Transaction Rate',
    value: '+320%',
    description: 'Higher transaction rate from welcome series vs. promotional emails',
    applicablePhases: [2],
    applicableCapabilities: ['baseline-subscriber-journeys'],
    source: 'industry-average',
  },
  {
    id: 'birthday-transaction-rate',
    metric: 'Birthday Email Transaction Rate',
    value: '+481%',
    description: 'Higher transaction rate from birthday emails vs. promotional',
    applicablePhases: [2],
    applicableCapabilities: ['baseline-subscriber-journeys'],
    source: 'industry-average',
  },

  // Phase 3: Meeting Consumer Expectations
  {
    id: 'cross-channel-roas',
    metric: 'Return on Ad Spend',
    value: '3X',
    description: 'ROAS improvement through coordinated cross-channel suppression',
    applicablePhases: [3],
    applicableCapabilities: ['cross-channel-activation'],
    source: 'merkle-benchmark',
  },
  {
    id: 'cross-channel-efficiency',
    metric: 'Campaign Efficiency (Cross-Channel)',
    value: '+100%',
    description: 'Campaign efficiency improvement when activating cross-channel journeys',
    applicablePhases: [3],
    applicableCapabilities: ['cross-channel-activation'],
    source: 'merkle-benchmark',
  },
  {
    id: 'multi-channel-purchase-rate',
    metric: 'Purchase Rate (Multi-Channel)',
    value: '+287%',
    description: 'Higher purchase rates with multi-channel journeys vs. single-channel',
    applicablePhases: [3],
    applicableCapabilities: ['cross-channel-activation'],
    source: 'industry-average',
  },
  {
    id: 'cart-recovery-rate',
    metric: 'Cart Abandonment Recovery',
    value: '5-15%',
    description: 'Percentage of abandoned cart revenue recovered through journey automation',
    applicablePhases: [3],
    applicableCapabilities: ['customer-lifecycle-journeys'],
    source: 'industry-average',
  },
  {
    id: 'repeat-purchase-increase',
    metric: 'Repeat Purchase Rate Increase',
    value: '+25%',
    description: 'Increase in repeat purchase rate from post-purchase journeys',
    applicablePhases: [3],
    applicableCapabilities: ['customer-lifecycle-journeys'],
    source: 'merkle-benchmark',
  },

  // Phase 4: Future Proofing
  {
    id: 'existing-customer-lift',
    metric: 'Existing Customer Sales Lift',
    value: '+16%',
    description: 'Per-campaign sales lift for existing customers using predictive models',
    applicablePhases: [4],
    applicableCapabilities: ['insight-driven-experiences', 'clv-modeling'],
    source: 'merkle-benchmark',
  },
  {
    id: 'lapsed-customer-lift',
    metric: 'Lapsed Customer Sales Lift',
    value: '+5%',
    description: 'Per-campaign sales lift for lapsed customers using predictive win-back',
    applicablePhases: [4],
    applicableCapabilities: ['insight-driven-experiences', 'clv-modeling'],
    source: 'merkle-benchmark',
  },
];

// ============================================================================
// JOURNEY PRIORITIZATION MATRIX
// ============================================================================

export type JourneyStatus = 'exists-no-changes' | 'exists-optimization' | 'experience-gap' | 'unique-opportunity' | 'not-applicable';
export type LifecycleStage = 'awareness' | 'consideration' | 'purchase' | 'post-purchase' | 'retention' | 'loyalty';
export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface JourneyType {
  id: string;
  name: string;
  stage: LifecycleStage;
  description: string;
  effort: EffortLevel;
  impact: ImpactLevel;
  phase: 2 | 3; // Which implementation phase this journey belongs to
  requiresPurchaseData: boolean;
  typicalStatus: JourneyStatus;
  triggerType: 'subscriber-event' | 'purchase-event' | 'behavior-event' | 'calendar-event';
  channels: ('email' | 'sms' | 'push' | 'ads' | 'direct-mail')[];
}

export const JOURNEY_TYPES: JourneyType[] = [
  // Awareness Stage
  {
    id: 'welcome-onboarding',
    name: 'Welcome / Onboarding',
    stage: 'awareness',
    description: 'Multi-touch series introducing brand, products, and value proposition to new subscribers',
    effort: 'low',
    impact: 'high',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'exists-optimization',
    triggerType: 'subscriber-event',
    channels: ['email', 'sms'],
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    stage: 'awareness',
    description: 'Notify subscribers of new products, flavors, or seasonal offerings',
    effort: 'medium',
    impact: 'medium',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'experience-gap',
    triggerType: 'calendar-event',
    channels: ['email'],
  },
  {
    id: 'best-sellers',
    name: 'Best Sellers',
    stage: 'awareness',
    description: 'Highlight top-performing products to drive discovery',
    effort: 'medium',
    impact: 'medium',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'experience-gap',
    triggerType: 'calendar-event',
    channels: ['email'],
  },

  // Consideration Stage
  {
    id: 'cart-abandon',
    name: 'Cart Abandonment',
    stage: 'consideration',
    description: 'Recover abandoned carts with timely reminders and incentives',
    effort: 'high',
    impact: 'high',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'behavior-event',
    channels: ['email', 'sms', 'ads'],
  },
  {
    id: 'browse-abandon',
    name: 'Browse Abandonment',
    stage: 'consideration',
    description: 'Re-engage visitors who browsed but did not add to cart',
    effort: 'high',
    impact: 'high',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'behavior-event',
    channels: ['email', 'ads'],
  },
  {
    id: 'category-abandon',
    name: 'Category Abandonment',
    stage: 'consideration',
    description: 'Target visitors who viewed category pages without progressing',
    effort: 'medium',
    impact: 'medium',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'behavior-event',
    channels: ['email', 'ads'],
  },
  {
    id: 'back-in-stock',
    name: 'Back in Stock / Seasonal',
    stage: 'consideration',
    description: 'Alert interested customers when items return or seasonal products launch',
    effort: 'medium',
    impact: 'medium',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'experience-gap',
    triggerType: 'calendar-event',
    channels: ['email', 'sms'],
  },
  {
    id: 'affinity',
    name: 'Affinity / Recommendations',
    stage: 'consideration',
    description: 'Personalized product recommendations based on preferences and behavior',
    effort: 'medium',
    impact: 'medium',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'experience-gap',
    triggerType: 'behavior-event',
    channels: ['email'],
  },

  // Purchase Stage
  {
    id: 'purchase-confirmation',
    name: 'Purchase Confirmation',
    stage: 'purchase',
    description: 'Order confirmation with receipt, next steps, and cross-sell opportunities',
    effort: 'medium',
    impact: 'medium',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'purchase-event',
    channels: ['email', 'sms'],
  },
  {
    id: 'curbside-pickup',
    name: 'Curbside Pickup',
    stage: 'purchase',
    description: 'Instructions and status updates for curbside pickup orders',
    effort: 'medium',
    impact: 'medium',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'unique-opportunity',
    triggerType: 'purchase-event',
    channels: ['email', 'sms'],
  },

  // Post-Purchase Stage
  {
    id: 'post-purchase-review',
    name: 'Post-Purchase Review',
    stage: 'post-purchase',
    description: 'Request feedback and reviews after purchase experience',
    effort: 'medium',
    impact: 'medium',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'purchase-event',
    channels: ['email'],
  },
  {
    id: 'shipment-tracking',
    name: 'Shipment Tracking',
    stage: 'post-purchase',
    description: 'Delivery status updates for shipped orders',
    effort: 'low',
    impact: 'low',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'exists-no-changes',
    triggerType: 'purchase-event',
    channels: ['email', 'sms'],
  },

  // Retention Stage
  {
    id: 'purchase-winback',
    name: 'Purchase Win-Back',
    stage: 'retention',
    description: 'Re-engage lapsed customers who haven\'t purchased in defined period',
    effort: 'high',
    impact: 'high',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'behavior-event',
    channels: ['email', 'sms', 'ads', 'direct-mail'],
  },
  {
    id: 're-engagement',
    name: 'Re-Engagement',
    stage: 'retention',
    description: 'Re-engage subscribers with declining email engagement',
    effort: 'low',
    impact: 'medium',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'exists-optimization',
    triggerType: 'behavior-event',
    channels: ['email'],
  },

  // Loyalty Stage
  {
    id: 'birthday',
    name: 'Birthday',
    stage: 'loyalty',
    description: 'Celebrate customer birthdays with special offers',
    effort: 'low',
    impact: 'high',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'exists-optimization',
    triggerType: 'calendar-event',
    channels: ['email', 'sms'],
  },
  {
    id: 'purchase-anniversary',
    name: 'Purchase Anniversary',
    stage: 'loyalty',
    description: 'Celebrate first purchase anniversary or milestone purchases',
    effort: 'medium',
    impact: 'medium',
    phase: 3,
    requiresPurchaseData: true,
    typicalStatus: 'experience-gap',
    triggerType: 'calendar-event',
    channels: ['email'],
  },
  {
    id: 'celebration-event-tracker',
    name: 'Celebration / Event Tracker',
    stage: 'loyalty',
    description: 'Track and remind about upcoming celebrations and events',
    effort: 'medium',
    impact: 'medium',
    phase: 2,
    requiresPurchaseData: false,
    typicalStatus: 'unique-opportunity',
    triggerType: 'calendar-event',
    channels: ['email', 'sms'],
  },
];

// ============================================================================
// CHANNEL STRATEGY FRAMEWORK
// ============================================================================

export interface ChannelStrategy {
  channel: string;
  journeyBuilderEnabled: boolean;
  useWhen: string[];
  examples: string[];
  costImplication: 'included' | 'incremental-cost' | 'third-party';
  consentRequired: boolean;
  bestFor: string[];
}

export const CHANNEL_STRATEGIES: ChannelStrategy[] = [
  {
    channel: 'Email',
    journeyBuilderEnabled: true,
    useWhen: [
      'Rich content delivery is needed',
      'Longer-form messaging is appropriate',
      'Cost efficiency is a priority',
      'Detailed tracking and analytics are required',
    ],
    examples: [
      'Welcome series',
      'Product announcements',
      'Educational content',
      'Order confirmations',
    ],
    costImplication: 'included',
    consentRequired: true,
    bestFor: ['nurture', 'education', 'transactional', 'promotional'],
  },
  {
    channel: 'SMS/MMS',
    journeyBuilderEnabled: true,
    useWhen: [
      'Message visibility is critical (98% open rate)',
      'Timely/urgent notifications needed',
      '"Open" is more important than click',
      'Service case notifications (curbside pickup)',
      'Acquisition is important',
    ],
    examples: [
      'Service case notifications',
      'Sneak peak sales',
      'Flash sales / limited time offers',
      'Appointment reminders',
    ],
    costImplication: 'incremental-cost',
    consentRequired: true,
    bestFor: ['urgency', 'time-sensitive', 'service', 'acquisition'],
  },
  {
    channel: 'Advertising Studio',
    journeyBuilderEnabled: true,
    useWhen: [
      'Message reach is key (extend beyond owned channels)',
      'Supporting alternate channel message recall',
      'Consumer is predicted high value',
      'Subscriber is email under-engaged',
      'Lookalike acquisition is important',
    ],
    examples: [
      'Cross/up-sell journeys',
      'High propensity to purchase audience',
      'Re-engagement/retention journeys',
      'Lookalike acquisition campaigns',
    ],
    costImplication: 'incremental-cost',
    consentRequired: false,
    bestFor: ['reach', 'retargeting', 'acquisition', 'suppression'],
  },
  {
    channel: 'Mobile Push',
    journeyBuilderEnabled: true,
    useWhen: [
      'Customer is a user of a brand mobile app',
      'As an SMS alternative for non-opted-in app users',
      'Real-time engagement is needed',
      'Location-based messaging is relevant',
    ],
    examples: [
      'Sneak peak sales',
      'Product notifications',
      'Order status updates',
      'Geofenced offers',
    ],
    costImplication: 'included',
    consentRequired: true,
    bestFor: ['app-users', 'real-time', 'location-based'],
  },
  {
    channel: 'Direct Mail',
    journeyBuilderEnabled: true,
    useWhen: [
      'Consumer is especially high value',
      'Sale is especially high ROI',
      'Physical copy of key info is important',
      'Digital channels are saturated',
      'Win-back for completely disengaged contacts',
    ],
    examples: [
      'Predicted high value customer/journey',
      'Focused on new product/service launch',
      'New store opening or event in area',
      'Premium loyalty member communications',
    ],
    costImplication: 'third-party',
    consentRequired: false,
    bestFor: ['high-value', 'premium', 'win-back', 'local-events'],
  },
];

// ============================================================================
// STRATEGIC FRAMEWORK: ABOVE/BELOW THE LINE
// ============================================================================

export interface StrategicPillar {
  id: string;
  name: string;
  type: 'above-the-line' | 'below-the-line';
  tagline: string;
  description: string;
  keyActivities: string[];
  capabilities: string[]; // IDs of related capabilities
}

export const STRATEGIC_PILLARS: StrategicPillar[] = [
  {
    id: 'know',
    name: 'KNOW',
    type: 'below-the-line',
    tagline: 'Manage Customers as an Asset',
    description: 'A well-balanced and appropriately leveraged first-party data asset',
    keyActivities: [
      'Configure key purchaser segments',
      'Configure key engagement segments',
      'Test & learn via path optimizer in journey campaigns',
      'Explore data and automate key performance reporting (SSS pacing)',
      'Analyze Einstein Message, Copy, Content, Send-Time, Engagement, and Frequency Insights',
      'Enhance 1P data collection',
    ],
    capabilities: ['extend-data-integrations', 'data-exploration', 'identity-resolution'],
  },
  {
    id: 'personalize',
    name: 'PERSONALIZE',
    type: 'above-the-line',
    tagline: 'Moment Orientation',
    description: 'Lifecycle journeys and targeted push campaigns that meet consumers in their moment',
    keyActivities: [
      'Enhance planned campaigns by moving from "batch and blast" to journeys',
      'Launch baseline subscriber journeys – from welcome to re-engagement',
      'Scale dynamic content using Einstein Content Selection',
      'Launch customer lifecycle journeys – post-purchase, loyalty, win-back',
      'Develop advanced insight-driven experiences to intervene at key moments',
    ],
    capabilities: [
      'enhance-planned-campaigns',
      'baseline-subscriber-journeys',
      'scale-dynamic-content',
      'customer-lifecycle-journeys',
      'insight-driven-experiences',
    ],
  },
  {
    id: 'engage',
    name: 'ENGAGE',
    type: 'above-the-line',
    tagline: '1:1 Everywhere',
    description: 'Beyond email – to SMS, addressable media, push, direct mail and more',
    keyActivities: [
      'Activate cross-channel journey features including SMS, Ad Studio, direct mail',
      'Configure coordinated suppression, message sequencing, and retargeting',
    ],
    capabilities: ['cross-channel-activation'],
  },
  {
    id: 'utilize',
    name: 'UTILIZE',
    type: 'below-the-line',
    tagline: 'Return on Tech Investment',
    description: 'A focus on adoption and application of key licensed capabilities and features',
    keyActivities: [
      'Migrate to modern platform to unlock advanced capabilities',
      'Extend data integrations to unlock RFM segmentation, behavioral triggers, purchase journeys',
    ],
    capabilities: ['migrate-sfmc', 'extend-data-integrations'],
  },
];

// ============================================================================
// KEY DECISION QUESTIONS
// ============================================================================

export interface KeyDecision {
  phase: number;
  category: 'investment' | 'strategic' | 'operational';
  question: string;
  implications: string;
  dependsOn?: string[]; // capability IDs this decision relates to
}

export const KEY_DECISIONS: KeyDecision[] = [
  // Phase 1 Decisions
  {
    phase: 1,
    category: 'investment',
    question: 'What is the target marketing foundation (MC Engagement vs. MC Advanced/Data Cloud)?',
    implications: 'Determines available capabilities, Agentforce readiness, and investment level',
    dependsOn: ['migrate-sfmc'],
  },
  {
    phase: 1,
    category: 'strategic',
    question: 'Which data sources need to be integrated (POS, loyalty, e-commerce, CRM)?',
    implications: 'Impacts segmentation, personalization, and journey capabilities',
    dependsOn: ['extend-data-integrations'],
  },
  {
    phase: 1,
    category: 'operational',
    question: 'What assets and data need to be migrated from existing systems?',
    implications: 'Affects migration timeline and effort',
    dependsOn: ['migrate-sfmc'],
  },

  // Phase 2 Decisions
  {
    phase: 2,
    category: 'strategic',
    question: 'Which subscriber journeys should be prioritized first?',
    implications: 'Determines initial ROI and sets precedent for journey approach',
    dependsOn: ['baseline-subscriber-journeys', 'enhance-planned-campaigns'],
  },
  {
    phase: 2,
    category: 'strategic',
    question: 'Which channels beyond email should be activated (SMS, Push, Ads)?',
    implications: 'Affects licensing costs, compliance requirements, and journey complexity',
    dependsOn: ['cross-channel-activation'],
  },
  {
    phase: 2,
    category: 'operational',
    question: 'What is the creative production approach for dynamic content?',
    implications: 'Impacts content velocity, brand consistency, and resource needs',
    dependsOn: ['scale-dynamic-content'],
  },
  {
    phase: 2,
    category: 'investment',
    question: 'Is Agentforce-assisted campaign production a priority?',
    implications: 'Requires MC Advanced, governance framework, and change management',
    dependsOn: ['agentic-campaign-production'],
  },

  // Phase 3 Decisions
  {
    phase: 3,
    category: 'strategic',
    question: 'Which customer lifecycle journeys are highest priority?',
    implications: 'Depends on purchase data availability and business model',
    dependsOn: ['customer-lifecycle-journeys'],
  },
  {
    phase: 3,
    category: 'operational',
    question: 'How will same-store-sales be measured at a person level?',
    implications: 'Requires identity resolution and analytics infrastructure',
    dependsOn: ['data-exploration', 'identity-resolution'],
  },
  {
    phase: 3,
    category: 'strategic',
    question: 'What technology will be used to visualize performance reporting?',
    implications: 'Tableau, Marketing Cloud Intelligence, or native reports',
    dependsOn: ['data-exploration'],
  },

  // Phase 4 Decisions
  {
    phase: 4,
    category: 'strategic',
    question: 'What predictive use cases should be developed first?',
    implications: 'CLV, churn prediction, propensity scoring, next-best-action',
    dependsOn: ['insight-driven-experiences', 'clv-modeling'],
  },
  {
    phase: 4,
    category: 'investment',
    question: 'Will predictive models be built in-house or with partner support?',
    implications: 'Affects resource allocation and time to value',
    dependsOn: ['clv-modeling'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getBenchmarksForPhase(phase: number): ROIBenchmark[] {
  return ROI_BENCHMARKS.filter((b) => b.applicablePhases.includes(phase));
}

export function getBenchmarksForCapability(capabilityId: string): ROIBenchmark[] {
  return ROI_BENCHMARKS.filter((b) => b.applicableCapabilities?.includes(capabilityId));
}

export function getJourneysByStage(stage: LifecycleStage): JourneyType[] {
  return JOURNEY_TYPES.filter((j) => j.stage === stage);
}

export function getJourneysByPhase(phase: 2 | 3): JourneyType[] {
  return JOURNEY_TYPES.filter((j) => j.phase === phase);
}

export function getPriorityJourneys(): JourneyType[] {
  return JOURNEY_TYPES.filter((j) => j.impact === 'high' && j.effort !== 'high');
}

export function getChannelForUseCase(useCase: string): ChannelStrategy | undefined {
  return CHANNEL_STRATEGIES.find((c) =>
    c.bestFor.some((b) => useCase.toLowerCase().includes(b))
  );
}

export function getDecisionsForPhase(phase: number): KeyDecision[] {
  return KEY_DECISIONS.filter((d) => d.phase === phase);
}

export function getPillarByCapability(capabilityId: string): StrategicPillar | undefined {
  return STRATEGIC_PILLARS.find((p) => p.capabilities.includes(capabilityId));
}
