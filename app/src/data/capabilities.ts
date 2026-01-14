import type { Capability } from '../types';

export const MESSAGING_PERSONALIZATION_CAPABILITIES: Capability[] = [
  // Phase 1: Unlock New Capabilities
  {
    id: 'migrate-sfmc',
    name: 'Migrate to SFMC 2.0',
    shortName: 'Platform Migration',
    description:
      'Avoid incurring further technical debt: migrate just the necessary assets and data, providing partners with new API endpoints and creating a scalable data foundation.',
    discipline: 'messaging-personalization',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'above-the-line',
    lifecycleStages: ['awareness', 'consideration', 'purchase', 'post-purchase', 'retention', 'loyalty'],
    clientValue: {
      why: 'Unlocks access to new capabilities like Journey Builder, Einstein AI, Ad Studio, and SMS that are critical for modern CRM programs.',
      howItAdvancesMaturity: 'Moves from Siloed (1) to Adopting (2) by providing the foundational platform capabilities needed for cross-channel orchestration.',
      businessOutcomes: [
        '+111% digital channel penetration',
        '3X operational efficiency',
        'Access to Einstein AI capabilities',
        'Multi-channel journey orchestration',
      ],
      kpis: [
        'Time to migration completion',
        'Data integrity score post-migration',
        'Capability utilization rate',
        'Platform adoption metrics',
      ],
    },
    salesforceValue: {
      consumption: 'Drives adoption of Journey Builder, Einstein features, and additional studios.',
      stickiness: 'Creates deep integration with data sources and partner systems.',
      expansion: 'Opens opportunities for Ad Studio, SMS, and Einstein add-ons.',
    },
    prerequisites: ['SFMC license', 'Data audit completed'],
    dependencies: [],
    merkleServices: [
      'Platform Migration Services',
      'Data Architecture Consulting',
      'Integration Development',
    ],
    references: [
      {
        title: 'SFMC Migration Playbook',
        type: 'playbook',
        description: 'Step-by-step guide for Marketing Cloud migrations',
        source: 'merkle-modern-crm',
      },
    ],
    salesforceProducts: ['Marketing Cloud', 'Journey Builder', 'Einstein'],
    tags: ['migration', 'foundation', 'platform', 'phase-1'],
    icon: 'Cloud',
  },
  {
    id: 'extend-data-integrations',
    name: 'Extend Data Integrations',
    shortName: 'Data Integration',
    description:
      'Integrate user-level online and offline purchase + loyalty data to power key segmentation, dynamic content, detailed reporting automations, and journeys.',
    discipline: 'messaging-personalization',
    maturityLevel: 2,
    phase: 1,
    journeyType: 'below-the-line',
    lifecycleStages: ['purchase', 'post-purchase', 'retention', 'loyalty'],
    clientValue: {
      why: 'Purchase data is the foundation for meaningful CRM personalization - without it, you cannot segment by value, predict churn, or personalize based on actual behavior.',
      howItAdvancesMaturity: 'Enables the transition from subscriber-only journeys to purchase-driven customer journeys, advancing from Adopting (2) to Scaling (3).',
      businessOutcomes: [
        'RFM segmentation capability',
        'Purchase-based personalization',
        'Customer lifetime value tracking',
        'Same-store-sales attribution',
      ],
      kpis: [
        '% of customers with purchase data',
        'Data latency (time to availability)',
        'Match rate between systems',
        'Segment addressability',
      ],
    },
    salesforceValue: {
      consumption: 'More data = more processing, more segments, more journeys.',
      stickiness: 'Deep data integration makes the platform central to customer intelligence.',
      expansion: 'Drives need for Data Cloud, additional contacts, and super messages.',
    },
    prerequisites: ['migrate-sfmc', 'POS/eCommerce system access'],
    dependencies: ['migrate-sfmc'],
    merkleServices: [
      'Data Integration Services',
      'ETL Development',
      'Data Architecture',
    ],
    references: [
      {
        title: 'Customer Data Integration Guide',
        type: 'document',
        description: 'Best practices for integrating purchase and loyalty data',
        source: 'merkle-b2b',
      },
    ],
    salesforceProducts: ['Marketing Cloud', 'Data Extensions', 'APIs'],
    tags: ['data', 'integration', 'purchase', 'loyalty', 'phase-1'],
    icon: 'Database',
  },

  // Phase 2: Activate New Capabilities
  {
    id: 'enhance-planned-campaigns',
    name: 'Enhance Planned Campaigns',
    shortName: 'Campaign Enhancement',
    description:
      'Move from a batch campaign-led approach to multi-touch, cross-channel journeys with out-of-the-box capabilities and a scalable campaign planning framework.',
    discipline: 'messaging-personalization',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'above-the-line',
    lifecycleStages: ['awareness', 'consideration'],
    clientValue: {
      why: 'Consumers expect to be engaged on their terms. Batch and blast campaigns underperform multi-touch, cross-channel journeys.',
      howItAdvancesMaturity: 'Transforms from single-channel batch sends to orchestrated multi-touch journeys.',
      businessOutcomes: [
        '+35% email revenue',
        '+40% open rate vs industry average',
        'Improved customer experience',
        'More efficient campaign operations',
      ],
      kpis: [
        'Journey completion rate',
        'Cross-channel engagement',
        'Campaign velocity',
        'Revenue per journey',
      ],
    },
    salesforceValue: {
      consumption: 'More journeys = more message sends and Einstein processing.',
      stickiness: 'Journey Builder becomes central to marketing operations.',
      expansion: 'Drives need for additional channels (SMS, Push, Ads).',
    },
    prerequisites: ['migrate-sfmc'],
    dependencies: ['migrate-sfmc'],
    merkleServices: [
      'Campaign Strategy',
      'Journey Design',
      'Creative Services',
    ],
    references: [],
    salesforceProducts: ['Journey Builder', 'Einstein STO', 'Email Studio'],
    tags: ['campaigns', 'journeys', 'email', 'phase-2'],
    icon: 'Send',
  },
  {
    id: 'baseline-subscriber-journeys',
    name: 'Build Baseline Subscriber Journeys',
    shortName: 'Subscriber Journeys',
    description:
      'From welcome and onboarding to unengaged, automate the cross-channel journey triggers that any QSR and retailer must anticipate.',
    discipline: 'messaging-personalization',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'above-the-line',
    lifecycleStages: ['awareness', 'consideration', 'retention'],
    clientValue: {
      why: 'Lifecycle journeys are table-stakes - consumers expect welcome emails, birthday messages, and re-engagement outreach. Missing these creates a gap in customer experience.',
      howItAdvancesMaturity: 'Establishes the foundational automated journeys that form the backbone of any CRM program.',
      businessOutcomes: [
        'Improved new subscriber conversion',
        'Higher engagement rates',
        'Reduced subscriber churn',
        'Brand consistency across lifecycle',
      ],
      kpis: [
        'Welcome journey completion rate',
        'Time to first purchase (new subscribers)',
        'Birthday redemption rate',
        'Re-engagement recovery rate',
      ],
    },
    salesforceValue: {
      consumption: 'Always-on journeys drive consistent message volume.',
      stickiness: 'Automated journeys become business-critical infrastructure.',
      expansion: 'Foundation for more sophisticated journey layers.',
    },
    prerequisites: ['migrate-sfmc', 'enhance-planned-campaigns'],
    dependencies: ['migrate-sfmc'],
    merkleServices: [
      'Journey Strategy',
      'Journey Build Services',
      'Creative Production',
    ],
    references: [],
    salesforceProducts: ['Journey Builder', 'Email Studio', 'Automation Studio'],
    tags: ['journeys', 'welcome', 'birthday', 're-engagement', 'phase-2'],
    icon: 'UserPlus',
  },
  {
    id: 'scale-dynamic-content',
    name: 'Scale Dynamic Content',
    shortName: 'Dynamic Content',
    description:
      'Activate dynamic content planning framework and Einstein Content Selection + scripting capabilities in SFMC to scale dynamic experiences and track content-level analytics.',
    discipline: 'messaging-personalization',
    maturityLevel: 3,
    phase: 2,
    journeyType: 'above-the-line',
    lifecycleStages: ['consideration', 'purchase', 'retention'],
    clientValue: {
      why: 'Dynamic content delivers personalization at scale - showing each customer relevant products, offers, and messages without creating thousands of email variants.',
      howItAdvancesMaturity: 'Moves from static, one-size-fits-all content to AI-powered personalization.',
      businessOutcomes: [
        'Higher click-through rates',
        'Improved conversion',
        'Reduced creative production costs',
        'Content-level performance insights',
      ],
      kpis: [
        'Content variant performance',
        'Einstein Content Selection lift',
        'Creative production efficiency',
        'Content-level CTR/conversion',
      ],
    },
    salesforceValue: {
      consumption: 'Einstein Content Selection uses super messages.',
      stickiness: 'Content analytics create optimization dependency.',
      expansion: 'Drives demand for higher Einstein tiers.',
    },
    prerequisites: ['migrate-sfmc', 'extend-data-integrations'],
    dependencies: ['migrate-sfmc'],
    merkleServices: [
      'Content Strategy',
      'Dynamic Content Development',
      'Einstein Configuration',
    ],
    references: [],
    salesforceProducts: ['Einstein Content Selection', 'Content Builder', 'AMPscript'],
    tags: ['content', 'personalization', 'einstein', 'dynamic', 'phase-2'],
    icon: 'Layers',
  },
  {
    id: 'einstein-engagement-scoring',
    name: 'Einstein Engagement Scoring',
    shortName: 'Engagement Scoring',
    description:
      'Leverage split activities in journeys that divide customers based on likelihood to open, click, unsubscribe, or convert, or based on their engagement persona.',
    discipline: 'messaging-personalization',
    maturityLevel: 3,
    phase: 2,
    journeyType: 'above-the-line',
    lifecycleStages: ['consideration', 'retention'],
    clientValue: {
      why: 'Not all subscribers are created equal - engagement scoring lets you optimize channel mix and message frequency based on predicted behavior.',
      howItAdvancesMaturity: 'Moves from treating all subscribers the same to individualized engagement strategies.',
      businessOutcomes: [
        'Reduced unsubscribe rates',
        'Higher overall engagement',
        'More efficient message spend',
        'Better sender reputation',
      ],
      kpis: [
        'Persona distribution',
        'Engagement score accuracy',
        'Journey path optimization',
        'Channel ROI by persona',
      ],
    },
    salesforceValue: {
      consumption: 'Einstein scoring processing for all contacts.',
      stickiness: 'AI-driven decisions become integral to marketing.',
      expansion: 'Gateway to advanced Einstein capabilities.',
    },
    prerequisites: ['migrate-sfmc', 'baseline-subscriber-journeys'],
    dependencies: ['migrate-sfmc'],
    merkleServices: [
      'Einstein Configuration',
      'Journey Optimization',
      'Analytics & Insights',
    ],
    references: [],
    salesforceProducts: ['Einstein Engagement Scoring', 'Journey Builder'],
    tags: ['einstein', 'scoring', 'engagement', 'ai', 'phase-2'],
    icon: 'BarChart',
  },
  {
    id: 'einstein-send-time-optimization',
    name: 'Einstein Send Time Optimization',
    shortName: 'Send Time Optimization',
    description:
      'Add the Einstein Send Time Optimization (STO) activity before email activities in a journey. STO assigns the best hour to send based on individualized analysis.',
    discipline: 'messaging-personalization',
    maturityLevel: 3,
    phase: 2,
    journeyType: 'above-the-line',
    lifecycleStages: ['awareness', 'consideration', 'retention'],
    clientValue: {
      why: 'The right message at the wrong time is the wrong message. STO ensures each contact receives emails when they\'re most likely to engage.',
      howItAdvancesMaturity: 'Moves from batch sending at arbitrary times to individualized send timing.',
      businessOutcomes: [
        'Increased open rates',
        'Higher engagement',
        'Improved conversion',
        'Better inbox placement',
      ],
      kpis: [
        'Open rate lift vs. control',
        'Click rate lift',
        'Optimal send time coverage',
        'Journey velocity',
      ],
    },
    salesforceValue: {
      consumption: 'STO processing for each journey message.',
      stickiness: 'Optimization becomes expected standard.',
      expansion: 'Drives Einstein adoption across features.',
    },
    prerequisites: ['migrate-sfmc'],
    dependencies: ['migrate-sfmc'],
    merkleServices: [
      'Einstein Configuration',
      'Testing & Optimization',
    ],
    references: [],
    salesforceProducts: ['Einstein STO', 'Journey Builder'],
    tags: ['einstein', 'optimization', 'send-time', 'ai', 'phase-2'],
    icon: 'Clock',
  },

  // Phase 3: Meeting Today's Consumer Expectations
  {
    id: 'customer-lifecycle-journeys',
    name: 'Build Customer Lifecycle Journeys',
    shortName: 'Customer Journeys',
    description:
      'With online and offline integrated consumer-level purchase/loyalty data – build abandoned cart, order-confirmation, post-purchase, win-back and more purchaser lifecycle journeys.',
    discipline: 'messaging-personalization',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'transactional',
    lifecycleStages: ['purchase', 'post-purchase', 'retention', 'loyalty'],
    clientValue: {
      why: 'Purchase-driven journeys have the highest ROI in CRM - cart abandon alone can recover 7% of abandoned revenue.',
      howItAdvancesMaturity: 'Moves from subscriber-only journeys to purchase-behavior-driven engagement.',
      businessOutcomes: [
        'Cart abandonment recovery revenue',
        'Increased repeat purchase rate',
        'Higher customer lifetime value',
        'Improved post-purchase satisfaction',
      ],
      kpis: [
        'Cart recovery rate',
        'Post-purchase NPS',
        'Repeat purchase rate',
        'Win-back conversion',
      ],
    },
    salesforceValue: {
      consumption: 'Behavioral triggers drive high message volume.',
      stickiness: 'Revenue-attributed journeys become untouchable.',
      expansion: 'Drives demand for transactional sending capacity.',
    },
    prerequisites: ['extend-data-integrations', 'baseline-subscriber-journeys'],
    dependencies: ['extend-data-integrations'],
    merkleServices: [
      'Journey Strategy',
      'Purchase Journey Development',
      'Analytics & Attribution',
    ],
    references: [],
    salesforceProducts: ['Journey Builder', 'Behavioral Triggers', 'Automation Studio'],
    tags: ['journeys', 'cart-abandon', 'post-purchase', 'transactional', 'phase-3'],
    icon: 'ShoppingCart',
  },
  {
    id: 'cross-channel-activation',
    name: 'Cross-Channel Journey Activation',
    shortName: 'Cross-Channel',
    description:
      'Activate cross-channel journey features including SMS, Ad Studio retargeting, and small batch direct mail. Configure coordinated suppression, message sequencing, and retargeting.',
    discipline: 'messaging-personalization',
    maturityLevel: 4,
    phase: 3,
    journeyType: 'above-the-line',
    lifecycleStages: ['awareness', 'consideration', 'retention'],
    clientValue: {
      why: 'Consumers don\'t live in a single channel - coordinated cross-channel journeys drive 3X return on ad spend and +100% campaign efficiency.',
      howItAdvancesMaturity: 'Moves from single-channel to true omnichannel orchestration.',
      businessOutcomes: [
        '3X return on ad spend',
        '+100% campaign efficiency',
        'Higher message recall',
        'Improved acquisition efficiency',
      ],
      kpis: [
        'Cross-channel attribution',
        'Message sequence completion',
        'Channel mix optimization',
        'Suppression effectiveness',
      ],
    },
    salesforceValue: {
      consumption: 'Multiple channel sends per journey entry.',
      stickiness: 'Orchestration layer becomes irreplaceable.',
      expansion: 'Drives SMS, Ad Studio, and Mobile Push adoption.',
    },
    prerequisites: ['baseline-subscriber-journeys', 'customer-lifecycle-journeys'],
    dependencies: ['baseline-subscriber-journeys'],
    merkleServices: [
      'Cross-Channel Strategy',
      'Media Integration',
      'Channel Orchestration',
    ],
    references: [],
    salesforceProducts: ['Journey Builder', 'Ad Studio', 'Mobile Studio', 'SMS'],
    tags: ['cross-channel', 'sms', 'advertising', 'orchestration', 'phase-3'],
    icon: 'Share2',
  },
  {
    id: 'data-exploration',
    name: 'Data Exploration & Visualization',
    shortName: 'Data Exploration',
    description:
      'Gain an understanding of data available by inspection or query, or integrate data with visualization tools such as Tableau or internal system for actionable insights.',
    discipline: 'messaging-personalization',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'below-the-line',
    lifecycleStages: ['awareness', 'purchase', 'retention', 'loyalty'],
    clientValue: {
      why: 'Dashboards are not analysis. True data exploration drives actionable insights that have demonstrable, tangible impact on the bottom line.',
      howItAdvancesMaturity: 'Moves from reporting to insight-driven decision making.',
      businessOutcomes: [
        'Faster insight generation',
        'Data-driven campaign optimization',
        'Same-store-sales pacing visibility',
        'Customer behavior understanding',
      ],
      kpis: [
        'Insight to action time',
        'Report utilization',
        'Decision confidence',
        'Optimization frequency',
      ],
    },
    salesforceValue: {
      consumption: 'Data Cloud queries and processing.',
      stickiness: 'Analytics become embedded in workflow.',
      expansion: 'Drives Tableau CRM / Data Cloud adoption.',
    },
    prerequisites: ['extend-data-integrations'],
    dependencies: ['extend-data-integrations'],
    merkleServices: [
      'Analytics & Insights',
      'Dashboard Development',
      'Data Visualization',
    ],
    references: [],
    salesforceProducts: ['Marketing Cloud Intelligence', 'Tableau', 'Data Cloud'],
    tags: ['analytics', 'visualization', 'insights', 'reporting', 'phase-3'],
    icon: 'PieChart',
  },

  // Phase 4: Future Proofing
  {
    id: 'insight-driven-experiences',
    name: 'Insight Driven Experiences',
    shortName: 'Insight-Driven',
    description:
      'Move beyond the obvious subscriber and customer lifecycle journeys to unlock custom, cross-channel, brand-unique experiences orchestrated across any addressable channel or medium.',
    discipline: 'messaging-personalization',
    maturityLevel: 4,
    phase: 4,
    journeyType: 'below-the-line',
    lifecycleStages: ['consideration', 'purchase', 'retention', 'loyalty'],
    clientValue: {
      why: 'The biggest opportunities for differentiation are in brand-unique experiences that competitors cannot easily replicate - powered by proprietary insights and custom modeling.',
      howItAdvancesMaturity: 'Represents the pinnacle of CRM maturity - experiences that are uniquely ownable by the brand.',
      businessOutcomes: [
        '+16% existing customer sales lift',
        '+5% lapsed customer sales lift',
        'Competitive differentiation',
        'Higher customer lifetime value',
      ],
      kpis: [
        'Model accuracy',
        'Intervention success rate',
        'Incremental revenue',
        'Customer experience scores',
      ],
    },
    salesforceValue: {
      consumption: 'Heavy Einstein and Data Cloud usage.',
      stickiness: 'Custom models tied to platform capabilities.',
      expansion: 'Advanced Einstein, Data Cloud, and consulting.',
    },
    prerequisites: ['customer-lifecycle-journeys', 'data-exploration'],
    dependencies: ['customer-lifecycle-journeys', 'data-exploration'],
    merkleServices: [
      'Advanced Analytics',
      'Predictive Modeling',
      'Custom Experience Design',
    ],
    references: [],
    salesforceProducts: ['Einstein', 'Data Cloud', 'Journey Builder'],
    tags: ['advanced', 'insights', 'modeling', 'custom', 'phase-4'],
    icon: 'Sparkles',
  },
  {
    id: 'identity-resolution',
    name: 'Identity Resolution & Consent',
    shortName: 'Identity & Consent',
    description:
      'Resolve identity and reconcile data into a unified profile across sales, service, marketing, and commerce to create a golden record and manage consent.',
    discipline: 'messaging-personalization',
    maturityLevel: 5,
    phase: 4,
    journeyType: 'below-the-line',
    lifecycleStages: ['awareness', 'consideration', 'purchase', 'post-purchase', 'retention', 'loyalty'],
    clientValue: {
      why: 'A unified customer identity is the foundation for true 1:1 personalization - without it, customers receive fragmented, inconsistent experiences.',
      howItAdvancesMaturity: 'Enables transformation to a truly customer-centric organization with unified data.',
      businessOutcomes: [
        'Single customer view',
        'Consistent cross-channel experience',
        'Privacy compliance',
        'Reduced data redundancy',
      ],
      kpis: [
        'Identity match rate',
        'Profile completeness',
        'Consent coverage',
        'Data quality score',
      ],
    },
    salesforceValue: {
      consumption: 'Data Cloud identity resolution processing.',
      stickiness: 'Identity layer becomes foundational infrastructure.',
      expansion: 'Drives Data Cloud and Customer 360 adoption.',
    },
    prerequisites: ['extend-data-integrations', 'data-exploration'],
    dependencies: ['extend-data-integrations'],
    merkleServices: [
      'Identity Strategy',
      'Data Cloud Implementation',
      'Consent Management',
    ],
    references: [],
    salesforceProducts: ['Data Cloud', 'Customer 360', 'Consent Management'],
    tags: ['identity', 'consent', 'data-cloud', 'gdpr', 'phase-4'],
    icon: 'Fingerprint',
  },
  {
    id: 'clv-modeling',
    name: 'Customer Lifetime Value Modeling',
    shortName: 'CLV Modeling',
    description:
      'Implement CLV models that allow proactive engagement at critical moments - limiting churn and yielding massive growth in customer-asset value through individual-level predictions.',
    discipline: 'messaging-personalization',
    maturityLevel: 5,
    phase: 4,
    journeyType: 'below-the-line',
    lifecycleStages: ['retention', 'loyalty'],
    clientValue: {
      why: 'CLV is the leading customer-centric metric. Successful brands use individualized predictions of customer value derived from historical purchase data to optimize experiences.',
      howItAdvancesMaturity: 'Represents full transformation - managing customers as assets with predictive optimization.',
      businessOutcomes: [
        'Proactive churn prevention',
        'Optimized customer investment',
        'Predicted lifetime value growth',
        'Customer asset value management',
      ],
      kpis: [
        'CLV prediction accuracy',
        'Churn prediction rate',
        'Customer asset value growth',
        'Intervention ROI',
      ],
    },
    salesforceValue: {
      consumption: 'Advanced Einstein modeling and scoring.',
      stickiness: 'Predictive models deeply integrated.',
      expansion: 'Advanced analytics and Data Cloud.',
    },
    prerequisites: ['extend-data-integrations', 'insight-driven-experiences'],
    dependencies: ['extend-data-integrations', 'insight-driven-experiences'],
    merkleServices: [
      'Predictive Analytics',
      'CLV Modeling',
      'Data Science Services',
    ],
    references: [],
    salesforceProducts: ['Einstein', 'Data Cloud', 'Tableau'],
    tags: ['clv', 'predictive', 'modeling', 'advanced-analytics', 'phase-4'],
    icon: 'TrendingUp',
  },
];

// Export all capabilities
export const ALL_CAPABILITIES: Capability[] = [
  ...MESSAGING_PERSONALIZATION_CAPABILITIES,
];

// Helper function to get capabilities by discipline
export function getCapabilitiesByDiscipline(disciplineId: string): Capability[] {
  return ALL_CAPABILITIES.filter((c) => c.discipline === disciplineId);
}

// Helper function to get capabilities by phase
export function getCapabilitiesByPhase(phase: number): Capability[] {
  return ALL_CAPABILITIES.filter((c) => c.phase === phase);
}

// Helper function to get capability by ID
export function getCapabilityById(id: string): Capability | undefined {
  return ALL_CAPABILITIES.find((c) => c.id === id);
}
