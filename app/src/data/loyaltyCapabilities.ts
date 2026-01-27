/**
 * Loyalty Management Capabilities
 *
 * Full capability definitions for Salesforce Loyalty Management assessment.
 * Mirrors the structure of Messaging & Personalization capabilities for
 * consistent cross-discipline assessments and planning.
 */

import type { MerkleOffering, ReferenceMaterial, ProductFeature } from '../types';

// ============================================================================
// LOYALTY MATURITY LEVELS
// ============================================================================

export type LoyaltyMaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const LOYALTY_MATURITY_STAGES = [
  {
    level: 0 as LoyaltyMaturityLevel,
    name: 'No Program',
    shortName: 'None',
    description: 'No formal loyalty program exists',
    color: '#DC2626', // red
  },
  {
    level: 1 as LoyaltyMaturityLevel,
    name: 'Basic Program',
    shortName: 'Basic',
    description: 'Simple points or punch-card style loyalty with limited integration',
    color: '#EA580C', // orange
  },
  {
    level: 2 as LoyaltyMaturityLevel,
    name: 'Structured Program',
    shortName: 'Structured',
    description: 'Defined tiers and currencies with core earn/burn mechanics',
    color: '#D97706', // amber
  },
  {
    level: 3 as LoyaltyMaturityLevel,
    name: 'Engaged Program',
    shortName: 'Engaged',
    description: 'Gamification, targeted offers, and multi-channel engagement',
    color: '#65A30D', // lime
  },
  {
    level: 4 as LoyaltyMaturityLevel,
    name: 'Personalized Program',
    shortName: 'Personalized',
    description: 'Data-driven personalization, partner ecosystem, predictive insights',
    color: '#0D9488', // teal
  },
  {
    level: 5 as LoyaltyMaturityLevel,
    name: 'Transformed Program',
    shortName: 'Transformed',
    description: 'AI-powered loyalty with real-time personalization and ecosystem leadership',
    color: '#4F46E5', // indigo
  },
];

// ============================================================================
// LOYALTY CAPABILITY INTERFACE
// ============================================================================

export interface LoyaltyCapability {
  id: string;
  name: string;
  shortName: string;
  description: string;

  // Positioning
  discipline: 'loyalty';
  maturityLevel: LoyaltyMaturityLevel;
  phase: 1 | 2 | 3 | 4;
  journeyType: 'above-the-line' | 'below-the-line';

  // Business value
  clientValue: {
    why: string;
    howItAdvancesMaturity: string;
    businessOutcomes: string[];
    kpis: string[];
  };

  // What this capability unlocks
  keyCapabilities: string[];

  // Implementation details
  prerequisites: string[];
  dependencies: string[];

  // Merkle services for delivery
  merkleServices: string[];
  merkleOfferings: MerkleOffering[];

  // Reference materials
  references: ReferenceMaterial[];

  // Tags for search/filter
  tags: string[];

  // Icon for display
  icon?: string;

  // Products and features used
  productsFeatures?: ProductFeature[];

  // Adjacencies to other disciplines
  adjacencies?: {
    discipline: string;
    connectionPoint: string;
    description: string;
  }[];
}

// ============================================================================
// LOYALTY CAPABILITIES
// ============================================================================

export const LOYALTY_CAPABILITIES: LoyaltyCapability[] = [
  // =========================================================================
  // PROGRAM FOUNDATION CAPABILITIES
  // =========================================================================
  {
    id: 'loyalty-program-setup',
    name: 'Loyalty Program Setup & Configuration',
    shortName: 'Program Setup',
    description: 'Implement Salesforce Loyalty Management with core program configuration, member data model, and basic enrollment workflows',
    discipline: 'loyalty',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'A well-architected loyalty platform is the foundation for all member experiences and program economics',
      howItAdvancesMaturity: 'Moves from ad-hoc or no loyalty program to a structured, scalable platform that enables future growth',
      businessOutcomes: [
        'Unified member data and profile management',
        'Scalable platform for program growth',
        'Foundation for cross-channel loyalty experiences',
        'Reduced operational complexity',
      ],
      kpis: [
        'Member enrollment rate',
        'Data quality score',
        'System uptime / reliability',
        'Time to enroll new member',
      ],
    },
    keyCapabilities: [
      'Loyalty Management core platform',
      'Member data model configuration',
      'Enrollment workflows',
      'Basic program rules',
      'Integration APIs',
    ],
    prerequisites: [
      'Salesforce Loyalty Management license',
      'Core Salesforce org setup',
      'Member data migration plan',
    ],
    dependencies: [],
    merkleServices: [
      'Loyalty platform implementation',
      'Data model design',
      'Integration architecture',
      'Member data migration',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Loyalty QuickStart',
        description: 'Accelerated Loyalty Management implementation with core configuration',
        sizing: 'M',
      },
      {
        type: 'retainer',
        name: 'Loyalty Platform Services',
        description: 'Ongoing platform support and optimization',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['foundation', 'platform', 'implementation', 'data-model'],
    icon: 'Building2',
    productsFeatures: [
      { name: 'Salesforce Loyalty Management', category: 'platform' },
      { name: 'Member Data Model', category: 'feature' },
      { name: 'Enrollment Workflows', category: 'feature' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Data Cloud integration',
        description: 'Member data flows to Data Cloud for unified customer profiles and marketing activation',
      },
    ],
  },

  {
    id: 'member-data-model',
    name: 'Member Data Model & Integration',
    shortName: 'Member Data',
    description: 'Design and implement the member data model with integrations to CRM, commerce, and other systems of record',
    discipline: 'loyalty',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Complete member data enables personalized experiences and accurate program economics',
      howItAdvancesMaturity: 'Creates a single source of truth for member information across all touchpoints',
      businessOutcomes: [
        'Complete member profiles',
        'Real-time data synchronization',
        'Accurate transaction attribution',
        'Foundation for personalization',
      ],
      kpis: [
        'Profile completeness rate',
        'Data sync latency',
        'Transaction match rate',
        'Integration uptime',
      ],
    },
    keyCapabilities: [
      'Member profile schema',
      'Transaction data integration',
      'Preference management',
      'Household/account linking',
      'Data quality rules',
    ],
    prerequisites: ['loyalty-program-setup'],
    dependencies: ['loyalty-program-setup'],
    merkleServices: [
      'Data model design',
      'Integration development',
      'Data quality implementation',
      'Migration services',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Member Data Foundation',
        description: 'Member data model design and core integrations',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['data', 'integration', 'member', 'profiles'],
    icon: 'Database',
    productsFeatures: [
      { name: 'Member Profiles', category: 'feature' },
      { name: 'MuleSoft Integration', category: 'integration' },
      { name: 'Data Cloud', category: 'platform' },
    ],
  },

  {
    id: 'tier-management',
    name: 'Tier Structure & Benefits Management',
    shortName: 'Tier Management',
    description: 'Implement tier structures with qualification rules, benefits management, and tier progression workflows',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Tiers create aspirational goals that drive incremental engagement and spend',
      howItAdvancesMaturity: 'Moves from flat program to structured progression that rewards best members and motivates advancement',
      businessOutcomes: [
        'Increased member engagement through tier goals',
        'Higher retention of top-tier members',
        'Differentiated value proposition by tier',
        'Reduced program costs through benefit targeting',
      ],
      kpis: [
        'Tier advancement rate',
        'Tier retention rate',
        'Spend lift by tier',
        'Tier-specific NPS',
      ],
    },
    keyCapabilities: [
      'Tier definition and configuration',
      'Qualification rules engine',
      'Benefit assignment and management',
      'Tier progression workflows',
      'Status matching capabilities',
    ],
    prerequisites: ['loyalty-program-setup', 'member-data-model'],
    dependencies: ['loyalty-program-setup'],
    merkleServices: [
      'Tier strategy design',
      'Benefits architecture',
      'Rules configuration',
      'Tier communications',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Tier Program Implementation',
        description: 'Full tier structure implementation with benefits management',
        sizing: 'M',
      },
      {
        type: 'strategic-advisory',
        name: 'Tier Strategy Workshop',
        description: 'Strategic tier design and benefits optimization',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['tiers', 'benefits', 'qualification', 'status'],
    icon: 'Trophy',
    productsFeatures: [
      { name: 'Tier Management', category: 'feature' },
      { name: 'Benefits Engine', category: 'feature' },
      { name: 'Flow for Loyalty', category: 'feature' },
    ],
  },

  {
    id: 'currency-management',
    name: 'Loyalty Currency & Points Architecture',
    shortName: 'Currency Management',
    description: 'Implement multi-currency support with points types, earning rates, expiration rules, and liability management',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Flexible currency architecture enables diverse earning opportunities and redemption options',
      howItAdvancesMaturity: 'Evolves from simple points to sophisticated multi-currency model that supports varied member value propositions',
      businessOutcomes: [
        'Flexible program economics',
        'Support for promotional currencies',
        'Partner currency integration',
        'Accurate liability management',
      ],
      kpis: [
        'Points issuance accuracy',
        'Currency conversion rates',
        'Points liability balance',
        'Breakage rate',
      ],
    },
    keyCapabilities: [
      'Multi-currency support',
      'Earning rate configuration',
      'Expiration and forfeiture rules',
      'Currency conversion',
      'Liability tracking and forecasting',
    ],
    prerequisites: ['loyalty-program-setup'],
    dependencies: ['loyalty-program-setup'],
    merkleServices: [
      'Currency architecture design',
      'Earning rules configuration',
      'Liability modeling',
      'Financial integration',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Currency Architecture',
        description: 'Multi-currency design and implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['currency', 'points', 'earning', 'liability'],
    icon: 'Coins',
    productsFeatures: [
      { name: 'Loyalty Currency', category: 'feature' },
      { name: 'Points Ledger', category: 'feature' },
      { name: 'Expiration Engine', category: 'feature' },
    ],
  },

  {
    id: 'earning-rules',
    name: 'Earning Rules Engine',
    shortName: 'Earning Rules',
    description: 'Configure sophisticated earning rules including category bonuses, promotional multipliers, and behavior-based earning',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Flexible earning rules enable targeted incentives that drive desired member behaviors',
      howItAdvancesMaturity: 'Evolves from flat earning to strategic earning that influences behavior and optimizes program economics',
      businessOutcomes: [
        'Targeted behavior incentives',
        'Category/product promotion support',
        'Partner earning capabilities',
        'Optimized acquisition costs',
      ],
      kpis: [
        'Earning rule utilization',
        'Promotional lift',
        'Cost per point issued',
        'Behavior change metrics',
      ],
    },
    keyCapabilities: [
      'Category-based earning rules',
      'Tier multipliers',
      'Promotional bonuses',
      'Non-purchase earning',
      'Partner earning integration',
    ],
    prerequisites: ['currency-management'],
    dependencies: ['currency-management'],
    merkleServices: [
      'Earning strategy design',
      'Rules engine configuration',
      'Promotion integration',
      'Partner earning setup',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Earning Rules Implementation',
        description: 'Comprehensive earning rules configuration',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['earning', 'rules', 'promotions', 'bonuses'],
    icon: 'Calculator',
    productsFeatures: [
      { name: 'Rules Engine', category: 'feature' },
      { name: 'Promotion Management', category: 'feature' },
    ],
  },

  {
    id: 'multi-brand-loyalty',
    name: 'Multi-Brand Loyalty Architecture',
    shortName: 'Multi-Brand',
    description: 'Implement loyalty programs spanning multiple brands with shared currencies, cross-brand benefits, or federated programs',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Multi-brand programs create ecosystem value and increase member engagement across portfolio',
      howItAdvancesMaturity: 'Transforms single-brand loyalty into portfolio-wide value proposition with network effects',
      businessOutcomes: [
        'Cross-brand engagement and revenue',
        'Portfolio-wide member retention',
        'Economies of scale in program operations',
        'Enhanced member value proposition',
      ],
      kpis: [
        'Cross-brand purchase rate',
        'Portfolio engagement score',
        'Brand-to-brand transfer rate',
        'Multi-brand member value',
      ],
    },
    keyCapabilities: [
      'Multi-brand program configuration',
      'Shared vs. separate currency options',
      'Cross-brand benefit management',
      'Brand-specific rules and tiers',
      'Consolidated member view',
    ],
    prerequisites: ['tier-management', 'currency-management'],
    dependencies: ['tier-management', 'currency-management'],
    merkleServices: [
      'Multi-brand strategy',
      'Architecture design',
      'Brand integration',
      'Governance framework',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Multi-Brand Strategy',
        description: 'Multi-brand loyalty strategy and architecture design',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Multi-Brand Implementation',
        description: 'Multi-brand program configuration and integration',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['multi-brand', 'portfolio', 'ecosystem', 'federation'],
    icon: 'Building',
    productsFeatures: [
      { name: 'Multi-Brand Support', category: 'feature' },
      { name: 'Brand Configuration', category: 'feature' },
    ],
  },

  {
    id: 'coalition-programs',
    name: 'Coalition & Partner Program Architecture',
    shortName: 'Coalition',
    description: 'Design and implement coalition programs with external partner earning, redemption, and settlement',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 3,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Coalition programs extend value proposition and create network effects through partner ecosystem',
      howItAdvancesMaturity: 'Elevates program from single-entity to ecosystem play with compounding member value',
      businessOutcomes: [
        'Extended value through partners',
        'New acquisition channels',
        'Shared program economics',
        'Ecosystem competitive advantage',
      ],
      kpis: [
        'Partner transaction volume',
        'Partner-sourced enrollments',
        'Coalition program margin',
        'Member engagement with partners',
      ],
    },
    keyCapabilities: [
      'Partner integration framework',
      'Multi-party settlement',
      'Coalition governance tools',
      'Partner performance management',
      'Cross-partner member experience',
    ],
    prerequisites: ['multi-brand-loyalty'],
    dependencies: ['multi-brand-loyalty'],
    merkleServices: [
      'Coalition strategy',
      'Partner integration',
      'Settlement architecture',
      'Partner onboarding',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Coalition Strategy',
        description: 'Coalition program design and partner strategy',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Coalition Platform',
        description: 'Coalition architecture and partner integrations',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['coalition', 'partners', 'ecosystem', 'settlement'],
    icon: 'Network',
    productsFeatures: [
      { name: 'Partner Management', category: 'feature' },
      { name: 'Settlement Engine', category: 'feature' },
      { name: 'MuleSoft APIs', category: 'integration' },
    ],
  },

  {
    id: 'advanced-rules-engine',
    name: 'Advanced Rules & Decision Engine',
    shortName: 'Advanced Rules',
    description: 'Implement sophisticated rules engine with real-time decisioning, A/B testing, and machine learning optimization',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 4,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Advanced rules enable real-time, personalized program experiences at scale',
      howItAdvancesMaturity: 'Transforms static rules to dynamic, intelligent decisioning that optimizes outcomes',
      businessOutcomes: [
        'Real-time personalized experiences',
        'Optimized program economics',
        'Continuous improvement through testing',
        'Reduced manual rule management',
      ],
      kpis: [
        'Decision latency',
        'A/B test lift',
        'Rule optimization rate',
        'Personalization coverage',
      ],
    },
    keyCapabilities: [
      'Real-time decision engine',
      'A/B testing framework',
      'ML-optimized rules',
      'Complex event processing',
      'Rule versioning and governance',
    ],
    prerequisites: ['earning-rules', 'loyalty-clv'],
    dependencies: ['earning-rules'],
    merkleServices: [
      'Decision engine design',
      'ML model development',
      'Testing framework',
      'Optimization services',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Decision Engine',
        description: 'Advanced rules and decision engine implementation',
        sizing: 'L',
      },
      {
        type: 'managed-services',
        name: 'Rules Optimization',
        description: 'Ongoing rules optimization and testing services',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['rules', 'decisioning', 'AI', 'optimization'],
    icon: 'Cpu',
    productsFeatures: [
      { name: 'Einstein Decisioning', category: 'feature' },
      { name: 'Flow Orchestration', category: 'feature' },
    ],
  },

  // =========================================================================
  // MEMBER ENGAGEMENT CAPABILITIES
  // =========================================================================
  {
    id: 'member-administration',
    name: 'Member Administration & Profiles',
    shortName: 'Member Admin',
    description: 'Implement comprehensive member profile management, preference handling, and account administration',
    discipline: 'loyalty',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Complete member profiles enable personalized experiences and operational efficiency',
      howItAdvancesMaturity: 'Creates foundation for member-centric experiences across all touchpoints',
      businessOutcomes: [
        'Complete member visibility',
        'Efficient service resolution',
        'Preference-driven experiences',
        'Reduced member friction',
      ],
      kpis: [
        'Profile completeness',
        'Preference capture rate',
        'Service resolution time',
        'Member satisfaction',
      ],
    },
    keyCapabilities: [
      'Member profile management',
      'Preference center',
      'Account linking (household)',
      'Service case integration',
      'Member merge/de-dupe',
    ],
    prerequisites: ['loyalty-program-setup'],
    dependencies: ['loyalty-program-setup'],
    merkleServices: [
      'Member experience design',
      'Profile configuration',
      'Service integration',
      'Preference center build',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Member Administration',
        description: 'Member profile and administration implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['member', 'profiles', 'preferences', 'administration'],
    icon: 'UserCog',
    productsFeatures: [
      { name: 'Member Profiles', category: 'feature' },
      { name: 'Service Cloud Integration', category: 'integration' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Preference center',
        description: 'Member preferences sync to Marketing Cloud for communication personalization',
      },
    ],
  },

  {
    id: 'member-portal',
    name: 'Member Portal & Self-Service',
    shortName: 'Member Portal',
    description: 'Build digital member portal with self-service capabilities for account management, rewards, and engagement',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Self-service empowers members and reduces operational costs while improving satisfaction',
      howItAdvancesMaturity: 'Enables 24/7 member engagement and reduces dependency on assisted service',
      businessOutcomes: [
        'Reduced service costs',
        'Increased member engagement',
        'Improved satisfaction scores',
        'Real-time member visibility',
      ],
      kpis: [
        'Portal adoption rate',
        'Self-service completion rate',
        'Portal engagement frequency',
        'Call deflection rate',
      ],
    },
    keyCapabilities: [
      'Points balance and history',
      'Tier status and progress',
      'Reward browsing and redemption',
      'Profile management',
      'Activity history',
    ],
    prerequisites: ['member-administration'],
    dependencies: ['member-administration'],
    merkleServices: [
      'Portal UX design',
      'Experience Cloud implementation',
      'Mobile app integration',
      'Self-service optimization',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Member Portal',
        description: 'Member portal design and implementation',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Mobile Loyalty App',
        description: 'Native mobile loyalty app development',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['portal', 'self-service', 'digital', 'mobile'],
    icon: 'Smartphone',
    productsFeatures: [
      { name: 'Experience Cloud', category: 'platform' },
      { name: 'Mobile SDK', category: 'feature' },
    ],
  },

  {
    id: 'gamification',
    name: 'Gamification & Engagement Mechanics',
    shortName: 'Gamification',
    description: 'Implement gamification elements including challenges, badges, progress tracking, and engagement rewards',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Gamification creates emotional engagement that drives participation beyond transactional rewards',
      howItAdvancesMaturity: 'Evolves program from transactional to emotional, creating habit-forming engagement',
      businessOutcomes: [
        'Increased engagement frequency',
        'Higher program participation',
        'Behavior change beyond purchases',
        'Stronger emotional connection',
      ],
      kpis: [
        'Challenge completion rate',
        'Badge achievement rate',
        'Engagement frequency lift',
        'Non-purchase engagement rate',
      ],
    },
    keyCapabilities: [
      'Challenge/mission framework',
      'Badge/achievement system',
      'Progress tracking',
      'Streak mechanics',
      'Leaderboards (optional)',
    ],
    prerequisites: ['member-portal'],
    dependencies: ['member-portal'],
    merkleServices: [
      'Gamification strategy',
      'Game mechanics design',
      'Implementation and testing',
      'Optimization services',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Gamification Strategy',
        description: 'Gamification strategy and mechanics design',
        sizing: 'S',
      },
      {
        type: 'fixed-bid',
        name: 'Gamification Implementation',
        description: 'Gamification features implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['gamification', 'challenges', 'badges', 'engagement'],
    icon: 'Gamepad2',
    productsFeatures: [
      { name: 'Loyalty Promotions', category: 'feature' },
      { name: 'Flow for Loyalty', category: 'feature' },
    ],
  },

  {
    id: 'challenges-missions',
    name: 'Challenges & Missions Engine',
    shortName: 'Challenges',
    description: 'Build sophisticated challenge engine with personalized missions, time-based promotions, and achievement tracking',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Personalized challenges drive specific behaviors while creating fun, goal-oriented experiences',
      howItAdvancesMaturity: 'Enables targeted behavior change through personalized, achievable goals',
      businessOutcomes: [
        'Targeted behavior change',
        'Increased purchase frequency',
        'New category/product trial',
        'Seasonal engagement peaks',
      ],
      kpis: [
        'Challenge opt-in rate',
        'Challenge completion rate',
        'Behavior lift during challenges',
        'Post-challenge retention',
      ],
    },
    keyCapabilities: [
      'Challenge configuration',
      'Personalized challenge assignment',
      'Progress tracking and notifications',
      'Reward integration',
      'Challenge analytics',
    ],
    prerequisites: ['gamification'],
    dependencies: ['gamification'],
    merkleServices: [
      'Challenge strategy',
      'Engine configuration',
      'Personalization rules',
      'Performance optimization',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Challenge Engine',
        description: 'Challenge engine implementation and configuration',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['challenges', 'missions', 'goals', 'achievements'],
    icon: 'Target',
    productsFeatures: [
      { name: 'Loyalty Promotions', category: 'feature' },
      { name: 'Einstein Engagement', category: 'feature' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Journey triggers',
        description: 'Challenge events trigger Marketing Cloud journeys for engagement communications',
      },
    ],
  },

  {
    id: 'badges-achievements',
    name: 'Badges & Achievement System',
    shortName: 'Badges',
    description: 'Implement badge and achievement system with collections, display options, and social sharing',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Badges create collectible value and social proof that drives continued engagement',
      howItAdvancesMaturity: 'Adds emotional and social dimension to program that extends beyond points value',
      businessOutcomes: [
        'Increased program stickiness',
        'Social sharing and advocacy',
        'Collection motivation',
        'Status signaling',
      ],
      kpis: [
        'Badge collection rate',
        'Social share rate',
        'Badge-driven engagement',
        'Collection completion rate',
      ],
    },
    keyCapabilities: [
      'Badge definition and design',
      'Achievement rules',
      'Collection display',
      'Social sharing integration',
      'Rarity and exclusivity tiers',
    ],
    prerequisites: ['gamification'],
    dependencies: ['gamification'],
    merkleServices: [
      'Badge strategy and design',
      'Achievement configuration',
      'Social integration',
      'Creative services',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Badge System',
        description: 'Badge and achievement system implementation',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['badges', 'achievements', 'collections', 'social'],
    icon: 'Award',
    productsFeatures: [
      { name: 'Custom Objects', category: 'feature' },
      { name: 'Experience Cloud', category: 'platform' },
    ],
  },

  {
    id: 'personalized-loyalty',
    name: 'Personalized Loyalty Experiences',
    shortName: 'Personalization',
    description: 'Deliver personalized loyalty experiences using behavioral data, preferences, and predictive models',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 3,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Personalization makes every member feel valued with relevant, timely experiences',
      howItAdvancesMaturity: 'Transforms one-size-fits-all program to individualized experiences at scale',
      businessOutcomes: [
        'Higher engagement rates',
        'Increased redemption rates',
        'Improved member satisfaction',
        'Better program ROI',
      ],
      kpis: [
        'Personalization coverage',
        'Personalized offer response rate',
        'Recommendation accuracy',
        'Member satisfaction lift',
      ],
    },
    keyCapabilities: [
      'Behavioral personalization',
      'Preference-based experiences',
      'Predictive recommendations',
      'Dynamic content',
      'Real-time personalization',
    ],
    prerequisites: ['challenges-missions', 'member-analytics'],
    dependencies: ['challenges-missions'],
    merkleServices: [
      'Personalization strategy',
      'Model development',
      'Experience design',
      'Testing and optimization',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Personalization Strategy',
        description: 'Loyalty personalization strategy and roadmap',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Personalization Implementation',
        description: 'Personalization engine implementation',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['personalization', 'behavioral', 'predictive', 'experience'],
    icon: 'Sparkles',
    productsFeatures: [
      { name: 'Einstein Personalization', category: 'feature' },
      { name: 'Data Cloud', category: 'platform' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Einstein Content Selection',
        description: 'Loyalty personalization data enriches Marketing Cloud content personalization',
      },
    ],
  },

  {
    id: 'contextual-engagement',
    name: 'Contextual & Real-Time Engagement',
    shortName: 'Contextual',
    description: 'Implement location-aware, time-sensitive, and context-driven loyalty engagement',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 3,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Contextual engagement delivers the right message at the right moment for maximum impact',
      howItAdvancesMaturity: 'Enables proactive, in-the-moment engagement that captures intent and opportunity',
      businessOutcomes: [
        'Higher conversion rates',
        'Increased in-store engagement',
        'Timely offer delivery',
        'Reduced missed opportunities',
      ],
      kpis: [
        'Contextual offer response rate',
        'Location-triggered engagement',
        'Real-time conversion rate',
        'Moment capture rate',
      ],
    },
    keyCapabilities: [
      'Location-based triggers',
      'Time-sensitive offers',
      'Behavioral event triggers',
      'Real-time push/notification',
      'In-store engagement',
    ],
    prerequisites: ['personalized-loyalty'],
    dependencies: ['personalized-loyalty'],
    merkleServices: [
      'Contextual strategy',
      'Trigger design',
      'Real-time implementation',
      'Mobile integration',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Contextual Engagement',
        description: 'Real-time contextual engagement implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['contextual', 'real-time', 'location', 'triggers'],
    icon: 'MapPin',
    productsFeatures: [
      { name: 'Marketing Cloud Mobile', category: 'platform' },
      { name: 'Location Services', category: 'feature' },
    ],
  },

  {
    id: 'loyalty-journeys',
    name: 'Loyalty Member Journeys',
    shortName: 'Journeys',
    description: 'Build automated loyalty journeys for onboarding, engagement, tier progression, and win-back',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 3,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Automated journeys ensure consistent, timely member engagement at scale',
      howItAdvancesMaturity: 'Transforms reactive communications to proactive, journey-driven engagement',
      businessOutcomes: [
        'Improved onboarding completion',
        'Higher tier progression rates',
        'Reduced member churn',
        'Consistent member experience',
      ],
      kpis: [
        'Journey completion rate',
        'Onboarding activation rate',
        'Win-back conversion rate',
        'Journey engagement rate',
      ],
    },
    keyCapabilities: [
      'Welcome/onboarding journeys',
      'Tier progression journeys',
      'Engagement/reactivation journeys',
      'Win-back journeys',
      'Milestone celebration journeys',
    ],
    prerequisites: ['personalized-loyalty'],
    dependencies: ['personalized-loyalty'],
    merkleServices: [
      'Journey strategy',
      'Journey design and build',
      'Integration with Loyalty',
      'Optimization services',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Loyalty Journeys',
        description: 'Core loyalty journey implementation',
        sizing: 'M',
      },
      {
        type: 'retainer',
        name: 'Journey Optimization',
        description: 'Ongoing journey optimization and expansion',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['journeys', 'automation', 'lifecycle', 'engagement'],
    icon: 'Route',
    productsFeatures: [
      { name: 'Marketing Cloud Journey Builder', category: 'platform' },
      { name: 'Flow for Marketing', category: 'feature' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Journey Builder',
        description: 'Loyalty events and data power Marketing Cloud journeys',
      },
    ],
  },

  // =========================================================================
  // REWARDS & OFFERS CAPABILITIES
  // =========================================================================
  {
    id: 'accruals-management',
    name: 'Accruals & Points Earning',
    shortName: 'Accruals',
    description: 'Implement core points accrual workflows for transactions, promotions, and partner earning',
    discipline: 'loyalty',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Accurate, timely accruals build member trust and drive program participation',
      howItAdvancesMaturity: 'Establishes reliable value exchange that is the foundation of loyalty',
      businessOutcomes: [
        'Member trust through accuracy',
        'Real-time earning visibility',
        'Reduced disputes and adjustments',
        'Foundation for earning promotions',
      ],
      kpis: [
        'Accrual accuracy rate',
        'Time to post points',
        'Dispute rate',
        'Member satisfaction with earning',
      ],
    },
    keyCapabilities: [
      'Transaction-based accruals',
      'Promotional accruals',
      'Manual adjustments',
      'Accrual notifications',
      'Earning history',
    ],
    prerequisites: ['loyalty-program-setup'],
    dependencies: ['loyalty-program-setup'],
    merkleServices: [
      'Accrual workflow design',
      'Integration development',
      'Rules configuration',
      'Testing and validation',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Accruals Implementation',
        description: 'Core accruals workflow implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['accruals', 'earning', 'points', 'transactions'],
    icon: 'Plus',
    productsFeatures: [
      { name: 'Transaction Journals', category: 'feature' },
      { name: 'Accrual Rules', category: 'feature' },
    ],
  },

  {
    id: 'redemptions-management',
    name: 'Redemptions & Rewards Fulfillment',
    shortName: 'Redemptions',
    description: 'Implement redemption workflows including reward selection, fulfillment, and member notification',
    discipline: 'loyalty',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Seamless redemption is where members realize value and emotional connection with program',
      howItAdvancesMaturity: 'Delivers on the value promise that drives member loyalty',
      businessOutcomes: [
        'Higher redemption rates',
        'Improved member satisfaction',
        'Reduced redemption friction',
        'Better program economics',
      ],
      kpis: [
        'Redemption rate',
        'Redemption completion rate',
        'Time to fulfill',
        'Redemption satisfaction',
      ],
    },
    keyCapabilities: [
      'Reward redemption workflows',
      'Multiple redemption channels',
      'Fulfillment integration',
      'Redemption notifications',
      'Redemption history',
    ],
    prerequisites: ['accruals-management'],
    dependencies: ['accruals-management'],
    merkleServices: [
      'Redemption UX design',
      'Workflow implementation',
      'Fulfillment integration',
      'Channel integration',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Redemptions Implementation',
        description: 'Core redemptions workflow implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['redemptions', 'rewards', 'fulfillment', 'burn'],
    icon: 'Gift',
    productsFeatures: [
      { name: 'Redemption Engine', category: 'feature' },
      { name: 'Voucher Management', category: 'feature' },
    ],
  },

  {
    id: 'rewards-catalog',
    name: 'Rewards Catalog Management',
    shortName: 'Catalog',
    description: 'Build and manage rewards catalog with diverse reward types, inventory, and pricing',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Compelling rewards catalog drives redemption and demonstrates program value',
      howItAdvancesMaturity: 'Expands redemption options to appeal to diverse member preferences',
      businessOutcomes: [
        'Higher redemption rates',
        'Broader member appeal',
        'Optimized reward costs',
        'Partner monetization',
      ],
      kpis: [
        'Catalog utilization',
        'Reward category performance',
        'Average redemption value',
        'Inventory turnover',
      ],
    },
    keyCapabilities: [
      'Reward catalog management',
      'Dynamic pricing',
      'Inventory management',
      'Reward categorization',
      'Featured/personalized rewards',
    ],
    prerequisites: ['redemptions-management'],
    dependencies: ['redemptions-management'],
    merkleServices: [
      'Catalog strategy',
      'Catalog implementation',
      'Partner integration',
      'Optimization services',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Rewards Catalog',
        description: 'Rewards catalog implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['catalog', 'rewards', 'inventory', 'merchandise'],
    icon: 'ShoppingBag',
    productsFeatures: [
      { name: 'Reward Catalog', category: 'feature' },
      { name: 'Commerce Integration', category: 'integration' },
    ],
  },

  {
    id: 'offer-management',
    name: 'Offer Management & Distribution',
    shortName: 'Offers',
    description: 'Implement offer creation, targeting, distribution, and tracking across channels',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Targeted offers drive incremental behavior while optimizing program economics',
      howItAdvancesMaturity: 'Evolves from mass promotions to targeted, measurable offers',
      businessOutcomes: [
        'Incremental revenue from offers',
        'Targeted behavior change',
        'Measurable offer ROI',
        'Reduced blanket discounting',
      ],
      kpis: [
        'Offer response rate',
        'Offer conversion rate',
        'Incremental lift',
        'Offer ROI',
      ],
    },
    keyCapabilities: [
      'Offer creation and configuration',
      'Targeting rules',
      'Multi-channel distribution',
      'Offer tracking and attribution',
      'A/B testing',
    ],
    prerequisites: ['accruals-management'],
    dependencies: ['accruals-management'],
    merkleServices: [
      'Offer strategy',
      'Offer engine configuration',
      'Channel integration',
      'Measurement framework',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Offer Management',
        description: 'Offer management implementation',
        sizing: 'M',
      },
      {
        type: 'retainer',
        name: 'Offer Operations',
        description: 'Ongoing offer creation and optimization',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['offers', 'promotions', 'targeting', 'distribution'],
    icon: 'Tag',
    productsFeatures: [
      { name: 'Loyalty Promotions', category: 'feature' },
      { name: 'Marketing Cloud Connect', category: 'integration' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Offer delivery',
        description: 'Loyalty offers delivered through Marketing Cloud channels',
      },
    ],
  },

  {
    id: 'promotion-management',
    name: 'Promotion Management & Campaigns',
    shortName: 'Promotions',
    description: 'Build promotion management capabilities for bonus points, multipliers, and campaign-based offers',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Promotions create excitement and drive incremental engagement during key periods',
      howItAdvancesMaturity: 'Enables strategic use of promotional mechanics to drive business objectives',
      businessOutcomes: [
        'Incremental engagement during promotions',
        'Seasonal traffic driving',
        'New member acquisition',
        'Category/product promotion',
      ],
      kpis: [
        'Promotion participation rate',
        'Promotional lift',
        'Cost per incremental action',
        'Promotion ROI',
      ],
    },
    keyCapabilities: [
      'Promotion creation and scheduling',
      'Bonus point promotions',
      'Multiplier promotions',
      'Partner-funded promotions',
      'Promotion analytics',
    ],
    prerequisites: ['offer-management'],
    dependencies: ['offer-management'],
    merkleServices: [
      'Promotion strategy',
      'Campaign planning',
      'Promotion configuration',
      'Performance analysis',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Promotion Engine',
        description: 'Promotion management implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['promotions', 'campaigns', 'bonuses', 'multipliers'],
    icon: 'Megaphone',
    productsFeatures: [
      { name: 'Loyalty Promotions', category: 'feature' },
      { name: 'Campaign Management', category: 'feature' },
    ],
  },

  {
    id: 'targeted-offers',
    name: 'Targeted & Personalized Offers',
    shortName: 'Targeted Offers',
    description: 'Implement advanced offer targeting using segments, behavior, and predictive models',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Personalized offers maximize response while minimizing unnecessary discounting',
      howItAdvancesMaturity: 'Transforms mass offers to individualized value propositions',
      businessOutcomes: [
        'Higher offer response rates',
        'Reduced margin erosion',
        'Better member experience',
        'Optimized program costs',
      ],
      kpis: [
        'Personalized offer response rate',
        'Offer relevance score',
        'Cost efficiency vs. mass offers',
        'Incremental revenue per offer',
      ],
    },
    keyCapabilities: [
      'Behavioral targeting',
      'Predictive offer selection',
      'Dynamic offer personalization',
      'Propensity-based targeting',
      'Offer optimization engine',
    ],
    prerequisites: ['promotion-management', 'member-analytics'],
    dependencies: ['promotion-management'],
    merkleServices: [
      'Targeting strategy',
      'Model development',
      'Personalization implementation',
      'Optimization services',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Targeted Offers',
        description: 'Targeted offer implementation',
        sizing: 'M',
      },
      {
        type: 'managed-services',
        name: 'Offer Optimization',
        description: 'Ongoing offer personalization and optimization',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['targeting', 'personalization', 'offers', 'optimization'],
    icon: 'Target',
    productsFeatures: [
      { name: 'Einstein Offers', category: 'feature' },
      { name: 'Data Cloud Segments', category: 'feature' },
    ],
  },

  {
    id: 'partner-management',
    name: 'Partner Network & Management',
    shortName: 'Partners',
    description: 'Build partner network with earning, redemption, and settlement capabilities',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Partner network extends value proposition and creates differentiated ecosystem',
      howItAdvancesMaturity: 'Transforms single-entity program to ecosystem with network effects',
      businessOutcomes: [
        'Extended value through partners',
        'New acquisition channels',
        'Revenue from partners',
        'Differentiated program',
      ],
      kpis: [
        'Partner transaction volume',
        'Partner-driven enrollment',
        'Partner satisfaction',
        'Partner revenue',
      ],
    },
    keyCapabilities: [
      'Partner onboarding',
      'Partner earning integration',
      'Partner redemption integration',
      'Settlement and reconciliation',
      'Partner portal',
    ],
    prerequisites: ['offer-management'],
    dependencies: ['offer-management'],
    merkleServices: [
      'Partner strategy',
      'Partner integration',
      'Settlement design',
      'Partner operations',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Partner Strategy',
        description: 'Partner network strategy and design',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Partner Integration',
        description: 'Partner integration implementation',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['partners', 'network', 'earning', 'redemption'],
    icon: 'Handshake',
    productsFeatures: [
      { name: 'Partner Management', category: 'feature' },
      { name: 'MuleSoft APIs', category: 'integration' },
    ],
  },

  {
    id: 'experiential-rewards',
    name: 'Experiential & Premium Rewards',
    shortName: 'Experiences',
    description: 'Implement experiential rewards including exclusive access, events, and premium experiences',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 3,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Experiential rewards create memorable moments and emotional connection beyond transactional value',
      howItAdvancesMaturity: 'Elevates program from transactional rewards to lifestyle and emotional value',
      businessOutcomes: [
        'Stronger emotional connection',
        'Higher perceived value',
        'Premium member satisfaction',
        'Brand differentiation',
      ],
      kpis: [
        'Experience redemption rate',
        'Experience satisfaction',
        'Social sharing of experiences',
        'Premium member NPS',
      ],
    },
    keyCapabilities: [
      'Experience catalog',
      'Exclusive access management',
      'Event ticketing integration',
      'Premium concierge',
      'Experience personalization',
    ],
    prerequisites: ['rewards-catalog', 'partner-management'],
    dependencies: ['rewards-catalog'],
    merkleServices: [
      'Experience strategy',
      'Partner curation',
      'Experience delivery',
      'Concierge services',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Experience Strategy',
        description: 'Experiential rewards strategy',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Experience Platform',
        description: 'Experiential rewards implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['experiences', 'premium', 'exclusive', 'events'],
    icon: 'Star',
    productsFeatures: [
      { name: 'Experience Catalog', category: 'feature' },
      { name: 'Event Management', category: 'feature' },
    ],
  },

  {
    id: 'coalition-rewards',
    name: 'Coalition & Transfer Partners',
    shortName: 'Coalition',
    description: 'Enable points transfer, coalition earning/redemption, and multi-program interoperability',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 4,
    journeyType: 'above-the-line',
    clientValue: {
      why: 'Coalition capabilities maximize points value and create competitive ecosystem advantage',
      howItAdvancesMaturity: 'Positions program as ecosystem hub with maximum member flexibility',
      businessOutcomes: [
        'Increased points liquidity',
        'Competitive advantage',
        'Partner revenue opportunities',
        'Reduced breakage',
      ],
      kpis: [
        'Transfer volume',
        'Coalition partner count',
        'Transfer partner satisfaction',
        'Ecosystem revenue',
      ],
    },
    keyCapabilities: [
      'Points transfer APIs',
      'Transfer partner integration',
      'Real-time transfer processing',
      'Transfer rate management',
      'Coalition governance',
    ],
    prerequisites: ['partner-management', 'coalition-programs'],
    dependencies: ['partner-management'],
    merkleServices: [
      'Coalition strategy',
      'Transfer partner integration',
      'API development',
      'Coalition operations',
    ],
    merkleOfferings: [
      {
        type: 'strategic-advisory',
        name: 'Coalition Strategy',
        description: 'Coalition and transfer partner strategy',
        sizing: 'M',
      },
      {
        type: 'fixed-bid',
        name: 'Coalition Implementation',
        description: 'Coalition capabilities implementation',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['coalition', 'transfers', 'partners', 'interoperability'],
    icon: 'ArrowLeftRight',
    productsFeatures: [
      { name: 'Partner APIs', category: 'integration' },
      { name: 'Settlement Engine', category: 'feature' },
    ],
  },

  // =========================================================================
  // LOYALTY INTELLIGENCE CAPABILITIES
  // =========================================================================
  {
    id: 'loyalty-reporting',
    name: 'Loyalty Program Reporting',
    shortName: 'Reporting',
    description: 'Implement core loyalty dashboards and reports for program performance visibility',
    discipline: 'loyalty',
    maturityLevel: 1,
    phase: 1,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Program visibility enables informed decisions and demonstrates value to stakeholders',
      howItAdvancesMaturity: 'Establishes measurement foundation for data-driven program management',
      businessOutcomes: [
        'Program performance visibility',
        'Stakeholder confidence',
        'Issue identification',
        'Informed decision making',
      ],
      kpis: [
        'Report usage',
        'Decision cycle time',
        'Stakeholder satisfaction',
        'Data accuracy',
      ],
    },
    keyCapabilities: [
      'Standard loyalty reports',
      'KPI dashboards',
      'Trend analysis',
      'Export capabilities',
      'Scheduled reporting',
    ],
    prerequisites: ['loyalty-program-setup'],
    dependencies: ['loyalty-program-setup'],
    merkleServices: [
      'Reporting requirements',
      'Dashboard design',
      'Report development',
      'Training',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Loyalty Reporting',
        description: 'Core loyalty reporting implementation',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['reporting', 'dashboards', 'analytics', 'visibility'],
    icon: 'BarChart',
    productsFeatures: [
      { name: 'Salesforce Reports', category: 'feature' },
      { name: 'CRM Analytics', category: 'platform' },
    ],
  },

  {
    id: 'program-dashboards',
    name: 'Executive Program Dashboards',
    shortName: 'Dashboards',
    description: 'Build executive dashboards for program health, financial metrics, and strategic KPIs',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Executive dashboards drive accountability and strategic program investment',
      howItAdvancesMaturity: 'Elevates loyalty from tactical to strategic with C-suite visibility',
      businessOutcomes: [
        'Executive engagement',
        'Strategic alignment',
        'Investment justification',
        'Cross-functional visibility',
      ],
      kpis: [
        'Executive dashboard usage',
        'Investment decisions influenced',
        'Strategic metric achievement',
        'Cross-functional alignment',
      ],
    },
    keyCapabilities: [
      'Executive KPI dashboard',
      'Financial metrics',
      'Program health scorecard',
      'Competitive benchmarking',
      'Trend visualization',
    ],
    prerequisites: ['loyalty-reporting'],
    dependencies: ['loyalty-reporting'],
    merkleServices: [
      'Executive requirements',
      'Dashboard design',
      'Visualization development',
      'Benchmark integration',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Executive Dashboards',
        description: 'Executive dashboard implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['executive', 'dashboards', 'KPIs', 'strategic'],
    icon: 'LayoutDashboard',
    productsFeatures: [
      { name: 'CRM Analytics', category: 'platform' },
      { name: 'Tableau', category: 'platform' },
    ],
  },

  {
    id: 'member-analytics',
    name: 'Member Analytics & Segmentation',
    shortName: 'Member Analytics',
    description: 'Implement member-level analytics including value scoring, segmentation, and behavior analysis',
    discipline: 'loyalty',
    maturityLevel: 2,
    phase: 2,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Member insights enable targeted strategies and personalized experiences',
      howItAdvancesMaturity: 'Transforms aggregate reporting to actionable member-level insights',
      businessOutcomes: [
        'Targeted member strategies',
        'Improved personalization',
        'Better resource allocation',
        'Actionable segments',
      ],
      kpis: [
        'Segment performance differential',
        'Targeting accuracy',
        'Insight utilization',
        'Strategy effectiveness',
      ],
    },
    keyCapabilities: [
      'Member value scoring',
      'Behavioral segmentation',
      'RFM analysis',
      'Cohort analysis',
      'Member-level reporting',
    ],
    prerequisites: ['loyalty-reporting'],
    dependencies: ['loyalty-reporting'],
    merkleServices: [
      'Analytics strategy',
      'Segmentation design',
      'Model development',
      'Activation support',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Member Analytics',
        description: 'Member analytics implementation',
        sizing: 'M',
      },
      {
        type: 'strategic-advisory',
        name: 'Segmentation Strategy',
        description: 'Member segmentation strategy and design',
        sizing: 'S',
      },
    ],
    references: [],
    tags: ['analytics', 'segmentation', 'member', 'insights'],
    icon: 'PieChart',
    productsFeatures: [
      { name: 'Data Cloud Segments', category: 'feature' },
      { name: 'CRM Analytics', category: 'platform' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Segment sharing',
        description: 'Loyalty segments activate in Marketing Cloud for targeted campaigns',
      },
    ],
  },

  {
    id: 'cohort-analysis',
    name: 'Cohort & Lifecycle Analysis',
    shortName: 'Cohort Analysis',
    description: 'Implement cohort-based analytics to understand member lifecycle patterns and program effectiveness',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Cohort analysis reveals true program impact and identifies improvement opportunities',
      howItAdvancesMaturity: 'Enables sophisticated program optimization based on lifecycle understanding',
      businessOutcomes: [
        'True program impact measurement',
        'Lifecycle optimization',
        'Acquisition quality insights',
        'Program evolution guidance',
      ],
      kpis: [
        'Cohort retention curves',
        'Lifecycle value by cohort',
        'Promotion effectiveness by cohort',
        'Acquisition quality metrics',
      ],
    },
    keyCapabilities: [
      'Cohort definition and tracking',
      'Retention analysis',
      'Lifecycle progression',
      'Promotion impact by cohort',
      'Acquisition source analysis',
    ],
    prerequisites: ['member-analytics'],
    dependencies: ['member-analytics'],
    merkleServices: [
      'Cohort strategy',
      'Analytics development',
      'Insight generation',
      'Optimization recommendations',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Cohort Analytics',
        description: 'Cohort analysis implementation',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['cohort', 'lifecycle', 'retention', 'analysis'],
    icon: 'TrendingUp',
    productsFeatures: [
      { name: 'CRM Analytics', category: 'platform' },
      { name: 'Data Cloud', category: 'platform' },
    ],
  },

  {
    id: 'financial-analytics',
    name: 'Program Financial Analytics',
    shortName: 'Financial Analytics',
    description: 'Implement financial analytics including liability tracking, breakage, and program P&L',
    discipline: 'loyalty',
    maturityLevel: 3,
    phase: 3,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Financial visibility ensures program sustainability and optimizes economics',
      howItAdvancesMaturity: 'Enables sophisticated program financial management and optimization',
      businessOutcomes: [
        'Accurate liability management',
        'Optimized program economics',
        'Financial compliance',
        'Investment justification',
      ],
      kpis: [
        'Liability accuracy',
        'Breakage rate',
        'Cost per point',
        'Program ROI',
      ],
    },
    keyCapabilities: [
      'Liability tracking',
      'Breakage estimation',
      'Program P&L',
      'Partner economics',
      'Financial forecasting',
    ],
    prerequisites: ['program-dashboards'],
    dependencies: ['program-dashboards'],
    merkleServices: [
      'Financial model design',
      'Analytics development',
      'Integration with finance',
      'Forecasting models',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Financial Analytics',
        description: 'Financial analytics implementation',
        sizing: 'M',
      },
      {
        type: 'strategic-advisory',
        name: 'Program Economics',
        description: 'Program financial optimization advisory',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['financial', 'liability', 'breakage', 'P&L'],
    icon: 'DollarSign',
    productsFeatures: [
      { name: 'Financial Reporting', category: 'feature' },
      { name: 'CRM Analytics', category: 'platform' },
    ],
  },

  {
    id: 'churn-prediction',
    name: 'Churn Prediction & Prevention',
    shortName: 'Churn Prediction',
    description: 'Implement predictive churn models with early warning and intervention capabilities',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 4,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Proactive churn prevention protects member value and reduces acquisition pressure',
      howItAdvancesMaturity: 'Transforms reactive win-back to predictive retention',
      businessOutcomes: [
        'Reduced member churn',
        'Higher retention rates',
        'Lower acquisition costs',
        'Improved member lifetime value',
      ],
      kpis: [
        'Churn prediction accuracy',
        'At-risk member save rate',
        'Intervention effectiveness',
        'Churn rate reduction',
      ],
    },
    keyCapabilities: [
      'Churn prediction models',
      'At-risk member identification',
      'Early warning system',
      'Intervention triggers',
      'Model performance tracking',
    ],
    prerequisites: ['member-analytics', 'cohort-analysis'],
    dependencies: ['member-analytics'],
    merkleServices: [
      'Churn model development',
      'Intervention design',
      'Integration services',
      'Model optimization',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Churn Prediction',
        description: 'Churn prediction model development and deployment',
        sizing: 'L',
      },
      {
        type: 'managed-services',
        name: 'Retention Analytics',
        description: 'Ongoing churn prediction and optimization',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['churn', 'prediction', 'retention', 'AI'],
    icon: 'AlertTriangle',
    productsFeatures: [
      { name: 'Einstein Prediction', category: 'feature' },
      { name: 'Data Cloud', category: 'platform' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'Win-back triggers',
        description: 'Churn predictions trigger Marketing Cloud win-back journeys',
      },
    ],
  },

  {
    id: 'next-best-reward',
    name: 'Next-Best-Reward Recommendations',
    shortName: 'Next-Best-Reward',
    description: 'Implement AI-powered reward recommendations optimized for member preference and program economics',
    discipline: 'loyalty',
    maturityLevel: 4,
    phase: 4,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'Personalized recommendations increase redemption while optimizing reward costs',
      howItAdvancesMaturity: 'Transforms static catalog to intelligent, personalized value delivery',
      businessOutcomes: [
        'Higher redemption rates',
        'Improved reward satisfaction',
        'Optimized reward costs',
        'Better member experience',
      ],
      kpis: [
        'Recommendation acceptance rate',
        'Redemption rate lift',
        'Reward satisfaction',
        'Cost optimization',
      ],
    },
    keyCapabilities: [
      'Reward preference modeling',
      'Personalized recommendations',
      'Economic optimization',
      'Real-time recommendations',
      'A/B testing',
    ],
    prerequisites: ['member-analytics', 'rewards-catalog'],
    dependencies: ['member-analytics'],
    merkleServices: [
      'Recommendation strategy',
      'Model development',
      'Integration services',
      'Optimization',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'Next-Best-Reward',
        description: 'Recommendation engine development',
        sizing: 'L',
      },
    ],
    references: [],
    tags: ['recommendations', 'personalization', 'AI', 'rewards'],
    icon: 'Lightbulb',
    productsFeatures: [
      { name: 'Einstein Recommendations', category: 'feature' },
      { name: 'Data Cloud', category: 'platform' },
    ],
  },

  {
    id: 'loyalty-clv',
    name: 'Loyalty CLV Modeling',
    shortName: 'CLV',
    description: 'Implement predictive customer lifetime value models specific to loyalty program economics',
    discipline: 'loyalty',
    maturityLevel: 5,
    phase: 4,
    journeyType: 'below-the-line',
    clientValue: {
      why: 'CLV enables value-based decision making across all program investments',
      howItAdvancesMaturity: 'Transforms program management from activity-based to value-based optimization',
      businessOutcomes: [
        'Value-based resource allocation',
        'Optimized acquisition investment',
        'Personalization by value',
        'Strategic program decisions',
      ],
      kpis: [
        'CLV prediction accuracy',
        'CLV growth rate',
        'High-value member share',
        'Value-based ROI',
      ],
    },
    keyCapabilities: [
      'Predictive CLV models',
      'Value-based segmentation',
      'CLV-driven decisioning',
      'Value attribution',
      'Model governance',
    ],
    prerequisites: ['churn-prediction', 'financial-analytics'],
    dependencies: ['churn-prediction'],
    merkleServices: [
      'CLV model development',
      'Value strategy',
      'Activation design',
      'Model operations',
    ],
    merkleOfferings: [
      {
        type: 'fixed-bid',
        name: 'CLV Modeling',
        description: 'CLV model development and deployment',
        sizing: 'L',
      },
      {
        type: 'managed-services',
        name: 'CLV Operations',
        description: 'Ongoing CLV model management and optimization',
        sizing: 'M',
      },
    ],
    references: [],
    tags: ['CLV', 'lifetime value', 'prediction', 'value'],
    icon: 'TrendingUp',
    productsFeatures: [
      { name: 'Data Cloud Calculated Insights', category: 'feature' },
      { name: 'Einstein', category: 'platform' },
    ],
    adjacencies: [
      {
        discipline: 'messaging-personalization',
        connectionPoint: 'CLV-based personalization',
        description: 'CLV scores inform Marketing Cloud personalization and investment',
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLoyaltyCapabilityById(id: string): LoyaltyCapability | undefined {
  return LOYALTY_CAPABILITIES.find((c) => c.id === id);
}

export function getLoyaltyCapabilitiesByPhase(phase: 1 | 2 | 3 | 4): LoyaltyCapability[] {
  return LOYALTY_CAPABILITIES.filter((c) => c.phase === phase);
}

export function getLoyaltyCapabilitiesByMaturity(level: LoyaltyMaturityLevel): LoyaltyCapability[] {
  return LOYALTY_CAPABILITIES.filter((c) => c.maturityLevel === level);
}

export function getLoyaltyCapabilitiesByJourneyType(type: 'above-the-line' | 'below-the-line'): LoyaltyCapability[] {
  return LOYALTY_CAPABILITIES.filter((c) => c.journeyType === type);
}

export function getLoyaltyCapabilitiesWithAdjacency(discipline: string): LoyaltyCapability[] {
  return LOYALTY_CAPABILITIES.filter((c) =>
    c.adjacencies?.some((a) => a.discipline === discipline)
  );
}
