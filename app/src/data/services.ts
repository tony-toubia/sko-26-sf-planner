/**
 * Master Services Catalog
 *
 * Maps capabilities from the maturity assessment to deliverable service offerings.
 * Services are sized based on complexity drivers (journeys, integrations, campaigns)
 * rather than subscriber counts.
 */

import type { DisciplineType, IndustryType } from '../types';

export type ServiceCategory =
  | 'implementation'      // One-time project work
  | 'retainer'           // Ongoing monthly services
  | 'staff-aug'          // Staff augmentation
  | 'advisory'           // Strategic consulting
  | 'managed-services';  // Fully managed operations

export type ServiceSize = 'small' | 'medium' | 'large' | 'enterprise';

export interface ServiceModifier {
  id: string;
  name: string;
  description: string;
  effortMultiplier: number;  // 1.0 = baseline, 1.5 = +50% effort
  costMultiplier: number;    // 1.0 = baseline, 1.3 = +30% cost
  applicableCategories: ServiceCategory[];
}

export interface ServiceSizeDefinition {
  size: ServiceSize;
  name: string;
  duration: string;           // "4-6 weeks", "2-3 months"
  effortHours: {
    min: number;
    max: number;
  };
  estimatedCost: {
    min: number;
    max: number;
  };
  team: {
    role: string;
    allocation: string;       // "0.5 FTE", "20 hrs/week"
  }[];
  deliverables: string[];
  typicalScope: string;       // What defines this size
}

export interface ServiceOffering {
  id: string;
  name: string;
  shortName: string;
  category: ServiceCategory;

  // What this service delivers
  description: string;

  // Sizing variants
  sizes: ServiceSizeDefinition[];

  // Which capabilities this service enables
  enablesCapabilities: string[];  // Capability IDs from capabilities.ts

  // Which tracks/levels this typically appears in
  typicalTrackLevels: string[];   // e.g., ["data-identity-1", "data-identity-2"]

  // Which clouds/disciplines this applies to
  disciplines: DisciplineType[];

  // Prerequisites
  requires?: string[];            // Other service IDs

  // Compatible modifiers
  compatibleModifiers: string[];  // Modifier IDs

  // Industry-specific adjustments
  industryMultipliers?: Partial<Record<IndustryType, {
    effortMultiplier: number;
    notes: string;
  }>>;
}

// ============================================================================
// SERVICE MODIFIERS
// ============================================================================

export const SERVICE_MODIFIERS: ServiceModifier[] = [
  {
    id: 'includes-creative',
    name: 'Includes Creative Services',
    description: 'Email design, content creation, and asset development',
    effortMultiplier: 1.4,
    costMultiplier: 1.3,
    applicableCategories: ['implementation', 'retainer'],
  },
  {
    id: 'includes-strategy',
    name: 'Includes Strategic Planning',
    description: 'Journey mapping, audience strategy, and optimization planning',
    effortMultiplier: 1.3,
    costMultiplier: 1.25,
    applicableCategories: ['implementation', 'advisory'],
  },
  {
    id: 'migration-required',
    name: 'Migration from Legacy System',
    description: 'Data migration, configuration migration, and testing',
    effortMultiplier: 1.6,
    costMultiplier: 1.4,
    applicableCategories: ['implementation'],
  },
  {
    id: 'complex-integrations',
    name: 'Complex System Integrations',
    description: 'Custom APIs, real-time sync, complex data transformations',
    effortMultiplier: 1.5,
    costMultiplier: 1.35,
    applicableCategories: ['implementation'],
  },
  {
    id: 'multi-bu',
    name: 'Multi-Business Unit Setup',
    description: 'Multiple BUs with separate branding and workflows',
    effortMultiplier: 1.4,
    costMultiplier: 1.3,
    applicableCategories: ['implementation'],
  },
  {
    id: 'includes-testing',
    name: 'Comprehensive QA & Testing',
    description: 'Full regression testing, UAT coordination, and test case development',
    effortMultiplier: 1.2,
    costMultiplier: 1.15,
    applicableCategories: ['implementation'],
  },
];

// ============================================================================
// IMPLEMENTATION SERVICES
// ============================================================================

export const IMPLEMENTATION_SERVICES: ServiceOffering[] = [
  // -------------------------------------------------------------------------
  // MC Advanced Migration
  // -------------------------------------------------------------------------
  {
    id: 'mc-advanced-migration',
    name: 'Marketing Cloud Advanced Migration',
    shortName: 'MC Advanced Migration',
    category: 'implementation',
    description: 'Migrate from MC Engagement to MC Advanced with Data Cloud foundation',
    enablesCapabilities: ['migrate-sfmc'],
    typicalTrackLevels: ['data-identity-1'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['migration-required', 'multi-bu', 'complex-integrations', 'includes-testing'],
    sizes: [
      {
        size: 'small',
        name: 'Single BU Migration',
        duration: '8-10 weeks',
        effortHours: { min: 400, max: 600 },
        estimatedCost: { min: 80000, max: 120000 },
        team: [
          { role: 'Solution Architect', allocation: '0.3 FTE' },
          { role: 'Technical Lead', allocation: '0.5 FTE' },
          { role: 'Developer', allocation: '0.8 FTE' },
          { role: 'QA Analyst', allocation: '0.3 FTE' },
        ],
        deliverables: [
          'MC Advanced platform configuration',
          'Data Cloud setup and data stream configuration',
          'Data extension migration (up to 50)',
          'Journey migration (up to 10 simple journeys)',
          'Email template migration',
          'Basic testing and validation',
        ],
        typicalScope: '1 BU, <50 data extensions, <10 journeys, standard integrations',
      },
      {
        size: 'medium',
        name: 'Multi-BU Migration',
        duration: '12-16 weeks',
        effortHours: { min: 800, max: 1200 },
        estimatedCost: { min: 160000, max: 240000 },
        team: [
          { role: 'Solution Architect', allocation: '0.5 FTE' },
          { role: 'Technical Lead', allocation: '0.8 FTE' },
          { role: 'Developer', allocation: '1.5 FTE' },
          { role: 'Data Engineer', allocation: '0.5 FTE' },
          { role: 'QA Analyst', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'MC Advanced multi-BU configuration',
          'Data Cloud unified profile setup',
          'Data extension migration (50-150)',
          'Journey migration (10-30 journeys)',
          'Email template and content migration',
          'Integration setup (3-5 systems)',
          'Comprehensive testing and UAT',
        ],
        typicalScope: '2-3 BUs, 50-150 data extensions, 10-30 journeys, 3-5 integrations',
      },
      {
        size: 'large',
        name: 'Enterprise Migration',
        duration: '18-24 weeks',
        effortHours: { min: 1600, max: 2400 },
        estimatedCost: { min: 320000, max: 480000 },
        team: [
          { role: 'Solution Architect', allocation: '0.8 FTE' },
          { role: 'Technical Lead', allocation: '1.0 FTE' },
          { role: 'Developer', allocation: '2.0 FTE' },
          { role: 'Data Engineer', allocation: '1.0 FTE' },
          { role: 'QA Analyst', allocation: '0.8 FTE' },
          { role: 'Project Manager', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'Enterprise MC Advanced architecture',
          'Data Cloud with zero-copy federation',
          'Data extension migration (150+)',
          'Complex journey migration (30+ journeys)',
          'Email template library migration',
          'Enterprise integration setup (5+ systems)',
          'Identity resolution configuration',
          'Einstein feature enablement',
          'Full testing, UAT, and rollout plan',
        ],
        typicalScope: '4+ BUs, 150+ data extensions, 30+ journeys, 5+ integrations, complex enterprise architecture',
      },
    ],
    industryMultipliers: {
      'financial-services': { effortMultiplier: 1.3, notes: 'Additional compliance and security requirements' },
      'healthcare-life-sciences': { effortMultiplier: 1.4, notes: 'HIPAA compliance and PHI data handling' },
    },
  },

  // -------------------------------------------------------------------------
  // Data Integration Services
  // -------------------------------------------------------------------------
  {
    id: 'data-integration-setup',
    name: 'Data Integration & ETL Setup',
    shortName: 'Data Integration',
    category: 'implementation',
    description: 'Connect external data sources to Data Cloud for unified customer profiles',
    enablesCapabilities: ['extend-data-integrations', 'zero-copy-federation'],
    typicalTrackLevels: ['data-identity-2', 'data-identity-3'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['complex-integrations', 'includes-strategy', 'includes-testing'],
    sizes: [
      {
        size: 'small',
        name: 'Basic Integration',
        duration: '3-4 weeks',
        effortHours: { min: 120, max: 200 },
        estimatedCost: { min: 24000, max: 40000 },
        team: [
          { role: 'Data Engineer', allocation: '0.8 FTE' },
          { role: 'Solution Architect', allocation: '0.2 FTE' },
        ],
        deliverables: [
          'Data source connection (1-2 sources)',
          'Data stream configuration',
          'Basic data mapping and transformation',
          'Testing and validation',
        ],
        typicalScope: '1-2 data sources, standard connectors (CRM, e-commerce)',
      },
      {
        size: 'medium',
        name: 'Multi-Source Integration',
        duration: '6-8 weeks',
        effortHours: { min: 300, max: 500 },
        estimatedCost: { min: 60000, max: 100000 },
        team: [
          { role: 'Data Engineer', allocation: '1.0 FTE' },
          { role: 'Solution Architect', allocation: '0.3 FTE' },
          { role: 'Developer', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'Multiple data source connections (3-5 sources)',
          'Complex data transformations',
          'Calculated insights setup',
          'Data quality rules',
          'Comprehensive testing',
        ],
        typicalScope: '3-5 data sources, custom APIs, data quality rules',
      },
      {
        size: 'large',
        name: 'Enterprise Data Hub',
        duration: '10-14 weeks',
        effortHours: { min: 600, max: 1000 },
        estimatedCost: { min: 120000, max: 200000 },
        team: [
          { role: 'Data Architect', allocation: '0.5 FTE' },
          { role: 'Data Engineer', allocation: '1.5 FTE' },
          { role: 'Solution Architect', allocation: '0.4 FTE' },
          { role: 'Developer', allocation: '0.8 FTE' },
        ],
        deliverables: [
          'Enterprise data architecture',
          'Zero-copy data federation (Snowflake/BigQuery)',
          'Multiple source integration (5+ sources)',
          'Advanced calculated insights (CLV, propensity)',
          'Identity resolution configuration',
          'Data governance framework',
          'Comprehensive testing and monitoring',
        ],
        typicalScope: '5+ sources, zero-copy federation, advanced analytics, identity resolution',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Journey Implementation
  // -------------------------------------------------------------------------
  {
    id: 'journey-implementation',
    name: 'Customer Journey Implementation',
    shortName: 'Journey Implementation',
    category: 'implementation',
    description: 'Design, build, and launch automated customer journeys',
    enablesCapabilities: [
      'subscriber-journeys',
      'lifecycle-journeys',
      'predictive-journeys',
      'cross-channel-journeys',
    ],
    typicalTrackLevels: ['journeys-1', 'journeys-2', 'journeys-3'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['includes-creative', 'includes-strategy', 'includes-testing'],
    sizes: [
      {
        size: 'small',
        name: 'Starter Journey Pack',
        duration: '4-6 weeks',
        effortHours: { min: 150, max: 250 },
        estimatedCost: { min: 30000, max: 50000 },
        team: [
          { role: 'Journey Architect', allocation: '0.6 FTE' },
          { role: 'Email Developer', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'Journey strategy and mapping (1-3 journeys)',
          'Flow build in Journey Builder or Flow',
          'Email templates (3-5 per journey)',
          'Testing and QA',
          'Launch support',
        ],
        typicalScope: '1-3 simple journeys (welcome, abandoned cart, win-back)',
      },
      {
        size: 'medium',
        name: 'Lifecycle Journey Suite',
        duration: '8-12 weeks',
        effortHours: { min: 400, max: 700 },
        estimatedCost: { min: 80000, max: 140000 },
        team: [
          { role: 'Journey Strategist', allocation: '0.4 FTE' },
          { role: 'Journey Architect', allocation: '0.8 FTE' },
          { role: 'Email Developer', allocation: '1.0 FTE' },
          { role: 'QA Analyst', allocation: '0.3 FTE' },
        ],
        deliverables: [
          'Journey strategy across lifecycle (5-10 journeys)',
          'Purchase-driven journey logic',
          'Personalization rules and dynamic content',
          'Cross-channel coordination (email + SMS/push)',
          'Einstein engagement scoring integration',
          'A/B test framework',
          'Comprehensive testing and launch',
        ],
        typicalScope: '5-10 lifecycle journeys with personalization and cross-channel',
      },
      {
        size: 'large',
        name: 'Enterprise Journey Ecosystem',
        duration: '14-20 weeks',
        effortHours: { min: 900, max: 1500 },
        estimatedCost: { min: 180000, max: 300000 },
        team: [
          { role: 'Journey Strategist', allocation: '0.6 FTE' },
          { role: 'Journey Architect', allocation: '1.2 FTE' },
          { role: 'Email Developer', allocation: '1.5 FTE' },
          { role: 'Data Engineer', allocation: '0.5 FTE' },
          { role: 'QA Analyst', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'Comprehensive journey framework (15+ journeys)',
          'Predictive journey orchestration',
          'Advanced personalization with Einstein',
          'Cross-channel orchestration (email, SMS, push, ads)',
          'Real-time behavioral triggers',
          'CLV and propensity score integration',
          'Advanced analytics and optimization framework',
          'Full testing, UAT, and rollout',
        ],
        typicalScope: '15+ complex journeys, predictive orchestration, full cross-channel',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Campaign Framework Setup
  // -------------------------------------------------------------------------
  {
    id: 'campaign-framework',
    name: 'Campaign Framework & Optimization',
    shortName: 'Campaign Framework',
    category: 'implementation',
    description: 'Build scalable campaign infrastructure with testing and optimization',
    enablesCapabilities: [
      'campaign-framework',
      'dynamic-content',
      'mobile-push-sms',
      'cross-channel-orchestration',
    ],
    typicalTrackLevels: ['content-channels-1', 'content-channels-2', 'content-channels-3'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['includes-creative', 'includes-strategy'],
    sizes: [
      {
        size: 'small',
        name: 'Email Campaign Foundation',
        duration: '3-5 weeks',
        effortHours: { min: 120, max: 200 },
        estimatedCost: { min: 24000, max: 40000 },
        team: [
          { role: 'Email Strategist', allocation: '0.4 FTE' },
          { role: 'Email Developer', allocation: '0.8 FTE' },
        ],
        deliverables: [
          'Email template library (5-10 templates)',
          'Content block system',
          'Send classification setup',
          'Basic A/B testing framework',
        ],
        typicalScope: 'Email-only, basic templates and testing',
      },
      {
        size: 'medium',
        name: 'Multi-Channel Campaign System',
        duration: '6-9 weeks',
        effortHours: { min: 300, max: 500 },
        estimatedCost: { min: 60000, max: 100000 },
        team: [
          { role: 'Marketing Technologist', allocation: '0.6 FTE' },
          { role: 'Email Developer', allocation: '1.0 FTE' },
          { role: 'Mobile Specialist', allocation: '0.4 FTE' },
        ],
        deliverables: [
          'Multi-channel template system',
          'Dynamic content framework',
          'Mobile (SMS/push) setup',
          'Advanced testing framework',
          'Send-time optimization',
          'Frequency management',
        ],
        typicalScope: 'Email + mobile channels, dynamic content, advanced optimization',
      },
      {
        size: 'large',
        name: 'Enterprise Orchestration Platform',
        duration: '10-14 weeks',
        effortHours: { min: 600, max: 1000 },
        estimatedCost: { min: 120000, max: 200000 },
        team: [
          { role: 'Marketing Technology Architect', allocation: '0.5 FTE' },
          { role: 'Email Developer', allocation: '1.2 FTE' },
          { role: 'Mobile Specialist', allocation: '0.6 FTE' },
          { role: 'Data Engineer', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'Full cross-channel orchestration',
          'Advanced personalization engine',
          'Addressable media integration (Advertising Studio)',
          'Einstein content selection',
          'Unified frequency capping',
          'Advanced analytics and attribution',
          'Campaign calendar and governance',
        ],
        typicalScope: 'Full cross-channel orchestration with advertising and advanced AI',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Analytics & Intelligence Setup
  // -------------------------------------------------------------------------
  {
    id: 'analytics-intelligence',
    name: 'Analytics & Intelligence Platform',
    shortName: 'Analytics Setup',
    category: 'implementation',
    description: 'Deploy advanced analytics, dashboards, and AI-powered insights',
    enablesCapabilities: [
      'reporting-analytics',
      'predictive-analytics',
      'advanced-ai-insights',
    ],
    typicalTrackLevels: ['intelligence-1', 'intelligence-2', 'intelligence-3'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['includes-strategy', 'complex-integrations'],
    sizes: [
      {
        size: 'small',
        name: 'Core Analytics Setup',
        duration: '3-4 weeks',
        effortHours: { min: 100, max: 160 },
        estimatedCost: { min: 20000, max: 32000 },
        team: [
          { role: 'Analytics Specialist', allocation: '0.8 FTE' },
        ],
        deliverables: [
          'Standard reporting dashboards',
          'Email performance tracking',
          'Journey analytics setup',
          'Basic Einstein scoring',
        ],
        typicalScope: 'Standard dashboards and basic Einstein features',
      },
      {
        size: 'medium',
        name: 'Advanced Analytics Platform',
        duration: '6-8 weeks',
        effortHours: { min: 250, max: 400 },
        estimatedCost: { min: 50000, max: 80000 },
        team: [
          { role: 'Analytics Architect', allocation: '0.5 FTE' },
          { role: 'Analytics Specialist', allocation: '1.0 FTE' },
          { role: 'Data Engineer', allocation: '0.4 FTE' },
        ],
        deliverables: [
          'Custom analytics dashboards',
          'Einstein engagement scoring',
          'Predictive analytics models',
          'CLV modeling',
          'Attribution setup',
          'Executive reporting',
        ],
        typicalScope: 'Custom dashboards, predictive models, attribution',
      },
      {
        size: 'large',
        name: 'Enterprise Intelligence Hub',
        duration: '10-14 weeks',
        effortHours: { min: 500, max: 800 },
        estimatedCost: { min: 100000, max: 160000 },
        team: [
          { role: 'Data Science Lead', allocation: '0.4 FTE' },
          { role: 'Analytics Architect', allocation: '0.8 FTE' },
          { role: 'Analytics Specialist', allocation: '1.2 FTE' },
          { role: 'Data Engineer', allocation: '0.6 FTE' },
        ],
        deliverables: [
          'Enterprise analytics architecture',
          'Advanced Einstein AI features',
          'Custom propensity models',
          'CLV and lifetime analytics',
          'Multi-touch attribution',
          'Real-time dashboards',
          'Data warehouse integration',
          'Executive and operational reporting suite',
        ],
        typicalScope: 'Enterprise analytics with custom ML models and data warehouse integration',
      },
    ],
  },
];

// ============================================================================
// RETAINER SERVICES
// ============================================================================

export const RETAINER_SERVICES: ServiceOffering[] = [
  {
    id: 'marketing-operations-retainer',
    name: 'Marketing Operations Retainer',
    shortName: 'Marketing Ops',
    category: 'retainer',
    description: 'Ongoing campaign execution, optimization, and platform management',
    enablesCapabilities: [], // Supports all capabilities
    typicalTrackLevels: [], // Applies across all levels
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['includes-creative'],
    sizes: [
      {
        size: 'small',
        name: 'Campaign Execution',
        duration: 'Monthly',
        effortHours: { min: 40, max: 60 },
        estimatedCost: { min: 8000, max: 12000 },
        team: [
          { role: 'Campaign Manager', allocation: '10-15 hrs/week' },
        ],
        deliverables: [
          'Weekly campaign execution (2-4 sends)',
          'QA and testing',
          'Basic reporting',
          'Ad-hoc support',
        ],
        typicalScope: '2-4 campaigns/week, basic execution and reporting',
      },
      {
        size: 'medium',
        name: 'Campaign + Optimization',
        duration: 'Monthly',
        effortHours: { min: 80, max: 120 },
        estimatedCost: { min: 16000, max: 24000 },
        team: [
          { role: 'Campaign Manager', allocation: '20 hrs/week' },
          { role: 'Email Developer', allocation: '10 hrs/week' },
        ],
        deliverables: [
          'Campaign execution (4-8 sends)',
          'Journey monitoring and optimization',
          'A/B testing and analysis',
          'Monthly performance reporting',
          'Template updates',
        ],
        typicalScope: '4-8 campaigns/week, journey optimization, testing',
      },
      {
        size: 'large',
        name: 'Full Marketing Operations',
        duration: 'Monthly',
        effortHours: { min: 160, max: 240 },
        estimatedCost: { min: 32000, max: 48000 },
        team: [
          { role: 'Marketing Technology Manager', allocation: '20 hrs/week' },
          { role: 'Campaign Manager', allocation: '30 hrs/week' },
          { role: 'Email Developer', allocation: '20 hrs/week' },
          { role: 'Analytics Specialist', allocation: '10 hrs/week' },
        ],
        deliverables: [
          'Full campaign execution (10+ sends)',
          'Journey management and optimization',
          'Advanced testing and experimentation',
          'Platform administration',
          'Advanced analytics and insights',
          'Strategic recommendations',
          'User training and enablement',
        ],
        typicalScope: 'Full marketing ops support, 10+ campaigns/week, analytics, training',
      },
    ],
  },
];

// ============================================================================
// STAFF AUGMENTATION SERVICES
// ============================================================================

export const STAFF_AUG_SERVICES: ServiceOffering[] = [
  {
    id: 'email-developer-staffaug',
    name: 'Email Developer Staff Augmentation',
    shortName: 'Email Developer',
    category: 'staff-aug',
    description: 'Dedicated email developer resource',
    enablesCapabilities: [],
    typicalTrackLevels: [],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: [],
    sizes: [
      {
        size: 'small',
        name: 'Junior Email Developer',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 12000, max: 16000 },
        team: [{ role: 'Junior Email Developer', allocation: '1.0 FTE' }],
        deliverables: ['Full-time email development support', 'Template building', 'Basic HTML/CSS'],
        typicalScope: '1.0 FTE junior developer',
      },
      {
        size: 'medium',
        name: 'Mid-Level Email Developer',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 18000, max: 24000 },
        team: [{ role: 'Mid-Level Email Developer', allocation: '1.0 FTE' }],
        deliverables: ['Full-time email development', 'Complex templates', 'AMPscript/SSJS', 'Dynamic content'],
        typicalScope: '1.0 FTE mid-level developer',
      },
      {
        size: 'large',
        name: 'Senior Email Developer',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 25000, max: 32000 },
        team: [{ role: 'Senior Email Developer', allocation: '1.0 FTE' }],
        deliverables: ['Full-time senior development', 'Advanced AMPscript', 'API integrations', 'Technical architecture'],
        typicalScope: '1.0 FTE senior developer',
      },
    ],
  },
  {
    id: 'journey-architect-staffaug',
    name: 'Journey Architect Staff Augmentation',
    shortName: 'Journey Architect',
    category: 'staff-aug',
    description: 'Dedicated journey architect resource',
    enablesCapabilities: [],
    typicalTrackLevels: [],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: [],
    sizes: [
      {
        size: 'medium',
        name: 'Mid-Level Journey Architect',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 20000, max: 26000 },
        team: [{ role: 'Mid-Level Journey Architect', allocation: '1.0 FTE' }],
        deliverables: ['Journey design and build', 'Flow/Journey Builder expertise', 'Optimization recommendations'],
        typicalScope: '1.0 FTE mid-level architect',
      },
      {
        size: 'large',
        name: 'Senior Journey Architect',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 28000, max: 36000 },
        team: [{ role: 'Senior Journey Architect', allocation: '1.0 FTE' }],
        deliverables: ['Advanced journey architecture', 'Strategic journey planning', 'Cross-channel orchestration', 'Team leadership'],
        typicalScope: '1.0 FTE senior architect',
      },
    ],
  },
  {
    id: 'data-engineer-staffaug',
    name: 'Data Engineer Staff Augmentation',
    shortName: 'Data Engineer',
    category: 'staff-aug',
    description: 'Dedicated data engineer resource',
    enablesCapabilities: [],
    typicalTrackLevels: [],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: [],
    sizes: [
      {
        size: 'medium',
        name: 'Mid-Level Data Engineer',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 22000, max: 28000 },
        team: [{ role: 'Mid-Level Data Engineer', allocation: '1.0 FTE' }],
        deliverables: ['Data integration', 'SQL/ETL development', 'Data Cloud configuration'],
        typicalScope: '1.0 FTE mid-level engineer',
      },
      {
        size: 'large',
        name: 'Senior Data Engineer',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 30000, max: 38000 },
        team: [{ role: 'Senior Data Engineer', allocation: '1.0 FTE' }],
        deliverables: ['Complex data architecture', 'API development', 'Data modeling', 'Performance optimization'],
        typicalScope: '1.0 FTE senior engineer',
      },
    ],
  },
];

// ============================================================================
// ADVISORY SERVICES
// ============================================================================

export const ADVISORY_SERVICES: ServiceOffering[] = [
  {
    id: 'maturity-assessment',
    name: 'Maturity Assessment & Roadmap',
    shortName: 'Assessment',
    category: 'advisory',
    description: 'Comprehensive maturity assessment with strategic roadmap',
    enablesCapabilities: [],
    typicalTrackLevels: [],
    disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'],
    compatibleModifiers: ['includes-strategy'],
    sizes: [
      {
        size: 'small',
        name: 'Quick Assessment',
        duration: '2-3 weeks',
        effortHours: { min: 40, max: 60 },
        estimatedCost: { min: 15000, max: 22000 },
        team: [
          { role: 'Principal Consultant', allocation: '20-30 hrs' },
        ],
        deliverables: [
          'Current state assessment',
          'Gap analysis',
          'High-level roadmap',
          'Executive presentation',
        ],
        typicalScope: 'Rapid assessment, single discipline',
      },
      {
        size: 'medium',
        name: 'Comprehensive Assessment',
        duration: '4-6 weeks',
        effortHours: { min: 80, max: 120 },
        estimatedCost: { min: 30000, max: 45000 },
        team: [
          { role: 'Principal Consultant', allocation: '40-60 hrs' },
          { role: 'Solution Architect', allocation: '30-40 hrs' },
        ],
        deliverables: [
          'Multi-discipline assessment',
          'Detailed gap analysis',
          'Phased roadmap with dependencies',
          'TCO and ROI analysis',
          'Executive and technical presentations',
        ],
        typicalScope: 'Full assessment, 1-2 disciplines, detailed roadmap',
      },
      {
        size: 'large',
        name: 'Enterprise Transformation Strategy',
        duration: '8-12 weeks',
        effortHours: { min: 160, max: 240 },
        estimatedCost: { min: 60000, max: 90000 },
        team: [
          { role: 'Principal Consultant', allocation: '60-80 hrs' },
          { role: 'Solution Architect', allocation: '60-100 hrs' },
          { role: 'Industry Expert', allocation: '20-40 hrs' },
        ],
        deliverables: [
          'Enterprise-wide assessment',
          'Cross-cloud strategy',
          'Multi-year transformation roadmap',
          'Organizational change management plan',
          'TCO and business case',
          'Vendor evaluation',
          'Executive workshop series',
        ],
        typicalScope: 'Enterprise strategy, multiple disciplines, org change management',
      },
    ],
  },
];

// ============================================================================
// ALL SERVICES COMBINED
// ============================================================================

export const ALL_SERVICES: ServiceOffering[] = [
  ...IMPLEMENTATION_SERVICES,
  ...RETAINER_SERVICES,
  ...STAFF_AUG_SERVICES,
  ...ADVISORY_SERVICES,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get service by ID
 */
export function getServiceById(serviceId: string): ServiceOffering | undefined {
  return ALL_SERVICES.find(s => s.id === serviceId);
}

/**
 * Get services that enable a specific capability
 */
export function getServicesForCapability(capabilityId: string): ServiceOffering[] {
  return ALL_SERVICES.filter(s => s.enablesCapabilities.includes(capabilityId));
}

/**
 * Get services for a specific track level
 */
export function getServicesForTrackLevel(trackLevelKey: string): ServiceOffering[] {
  return ALL_SERVICES.filter(s => s.typicalTrackLevels.includes(trackLevelKey));
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: ServiceCategory): ServiceOffering[] {
  return ALL_SERVICES.filter(s => s.category === category);
}

/**
 * Calculate estimated cost with modifiers
 */
export function calculateServiceCost(
  service: ServiceOffering,
  size: ServiceSize,
  modifiers: string[] = [],
  industry?: IndustryType
): { min: number; max: number } {
  const sizeDefinition = service.sizes.find(s => s.size === size);
  if (!sizeDefinition) {
    throw new Error(`Size ${size} not found for service ${service.id}`);
  }

  let { min, max } = sizeDefinition.estimatedCost;

  // Apply modifiers
  for (const modifierId of modifiers) {
    const modifier = SERVICE_MODIFIERS.find(m => m.id === modifierId);
    if (modifier && service.compatibleModifiers.includes(modifierId)) {
      min *= modifier.costMultiplier;
      max *= modifier.costMultiplier;
    }
  }

  // Apply industry multiplier
  if (industry && service.industryMultipliers?.[industry]) {
    const multiplier = service.industryMultipliers[industry].effortMultiplier;
    min *= multiplier;
    max *= multiplier;
  }

  return {
    min: Math.round(min),
    max: Math.round(max),
  };
}

/**
 * Get modifier by ID
 */
export function getModifierById(modifierId: string): ServiceModifier | undefined {
  return SERVICE_MODIFIERS.find(m => m.id === modifierId);
}
