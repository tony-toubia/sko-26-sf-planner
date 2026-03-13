/**
 * Master Services Catalog
 *
 * Maps capabilities from the maturity assessment to deliverable service offerings.
 * Services are sized based on complexity drivers (journeys, integrations, campaigns)
 * rather than subscriber counts.
 *
 * Each service is mapped to the Merkle Master Services Set (MSS) taxonomy for
 * alignment with enterprise service cataloging. MSS uses a 3-level hierarchy:
 *   L1 = "CXM" (all services here)
 *   L2 = Practice area (e.g., "CRM Campaign Execution & Management")
 *   L3 = Specific service line (e.g., "Messaging Technology")
 *
 * Current scope: Salesforce Marketing Cloud (M&P discipline).
 * As Commerce, Loyalty, and other disciplines are added, additional MSS L2/L3
 * mappings will become relevant.
 */

import type { DisciplineType, IndustryType } from '../types';

export type ServiceCategory =
  | 'implementation'      // One-time project work
  | 'retainer'           // Ongoing monthly services
  | 'staff-aug'          // Staff augmentation
  | 'advisory'           // Strategic consulting
  | 'managed-services';  // Fully managed operations

export type ServiceSize = 'small' | 'medium' | 'large' | 'enterprise';

// ============================================================================
// MSS TAXONOMY
// ============================================================================

/**
 * Merkle Master Services Set (MSS) taxonomy reference.
 * L1 is always "CXM". L2 and L3 define the practice area and service line.
 *
 * ALL MSS entries are cataloged here. Each entry includes a `disciplines` array
 * indicating which assessment disciplines the service line is relevant for.
 * An empty array means the service line is cross-cutting or not yet mapped.
 *
 * As new disciplines are activated (Commerce, Loyalty, etc.), their service
 * offerings will reference the appropriate MSS keys.
 */
export interface MssMapping {
  l2: string;   // Practice area
  l3: string;   // Specific service line
  disciplines: DisciplineType[];  // Which assessment disciplines use this MSS line
}

export const MSS_TAXONOMY: Record<string, MssMapping> = {
  // ==========================================================================
  // CRM CAMPAIGN EXECUTION & MANAGEMENT
  // ==========================================================================
  'messaging-campaign-ops':        { l2: 'CRM Campaign Execution & Management', l3: 'Messaging & Campaign Operations', disciplines: ['messaging-personalization'] },
  'messaging-technology':          { l2: 'CRM Campaign Execution & Management', l3: 'Messaging Technology', disciplines: ['messaging-personalization'] },
  'sales-service-industry-tech':   { l2: 'CRM Campaign Execution & Management', l3: 'Sales, Service & Industry Technology', disciplines: ['service'] },
  'crm-campaign-exec':            { l2: 'CRM Campaign Execution & Management', l3: 'CRM Campaign Execution & Management', disciplines: ['messaging-personalization'] },

  // ==========================================================================
  // CRM, PROMOTIONS & LOYALTY
  // ==========================================================================
  'messaging-services':            { l2: 'CRM, Promotions & Loyalty', l3: 'Messaging Services', disciplines: ['messaging-personalization'] },
  'digital-messaging':             { l2: 'CRM, Promotions & Loyalty - Digital Messaging', l3: 'Digital Messaging', disciplines: ['messaging-personalization'] },
  'digital-messaging-promo':       { l2: 'CRM, Promotions & Loyalty - Promotions and Loyalty', l3: 'Digital Messaging', disciplines: ['loyalty'] },
  'crm-services':                  { l2: 'CRM, Promotions & Loyalty', l3: 'CRM Services', disciplines: ['messaging-personalization'] },
  'loyalty':                       { l2: 'CRM, Promotions & Loyalty - Promotions and Loyalty', l3: 'Loyalty', disciplines: ['loyalty'] },
  'promo-loyalty-programs':        { l2: 'CRM, Promotions & Loyalty', l3: 'Promotion & Loyalty Programs', disciplines: ['loyalty'] },
  'promo-loyalty-tech':            { l2: 'Customer Promotions & Loyalty', l3: 'Promotions & Loyalty Technology', disciplines: ['loyalty'] },
  'promo-loyalty-ops':             { l2: 'Customer Promotions & Loyalty', l3: 'Promotions & Loyalty Operations', disciplines: ['loyalty'] },
  'owned-loyalty-products':        { l2: 'Customer Promotions & Loyalty', l3: 'Owned Loyalty Products', disciplines: ['loyalty'] },
  'net-rebates-rewards':           { l2: 'Customer Promotions & Loyalty', l3: 'Net Rebates & Rewards', disciplines: ['loyalty'] },
  'b2b-lead-gen':                  { l2: 'CRM, Promotions & Loyalty', l3: 'B2B Lead Generation', disciplines: [] },
  'crm-promo-loyalty':             { l2: 'CRM, Promotions & Loyalty', l3: 'CRM, Promotions & Loyalty', disciplines: ['messaging-personalization', 'loyalty'] },

  // ==========================================================================
  // DATA PLATFORMS
  // ==========================================================================
  'data-mgmt-implementation':      { l2: 'Data Platforms - Data Management', l3: 'Data Management Implementation', disciplines: ['messaging-personalization'] },
  'data-mgmt-maintenance':         { l2: 'Data Platforms - Data Management', l3: 'Data Management Maintenance', disciplines: ['messaging-personalization'] },
  'cdp':                           { l2: 'Data Platforms', l3: 'Customer Data Platform (CDP)', disciplines: ['messaging-personalization'] },
  'data-management':               { l2: 'Data Platforms', l3: 'Data Management', disciplines: ['messaging-personalization'] },
  'audience-platforms':            { l2: 'Data Platforms - Data Management', l3: 'Audience Platforms', disciplines: ['messaging-personalization'] },
  'infra-managed-services':        { l2: 'Data Platforms - Infrastructure Managed Services', l3: 'Infrastructure Managed Services', disciplines: ['messaging-personalization'] },
  'infra-managed-services-dp':     { l2: 'Data Platforms', l3: 'Infrastructure Managed Services', disciplines: [] },
  'interaction-data-platform':     { l2: 'Data Platforms - Data Management', l3: 'Interaction Data Platform', disciplines: ['messaging-personalization'] },
  'traditional-campaign':          { l2: 'Data Platforms - Data Management', l3: 'Traditional Campaign', disciplines: ['messaging-personalization'] },
  'cloud-consulting':              { l2: 'Data Platforms', l3: 'Cloud Consulting', disciplines: [] },

  // ==========================================================================
  // DATA & IDENTITY SOLUTIONS
  // ==========================================================================
  'identity-management':           { l2: 'Data & Identity Solutions - Identity Management', l3: 'Identity Management', disciplines: ['messaging-personalization'] },
  'data-sourcing':                 { l2: 'Data & Identity Solutions - Data Solutions', l3: 'Data Sourcing', disciplines: ['messaging-personalization'] },
  'audience-delivery':             { l2: 'Data & Identity Solutions - Connections', l3: 'Audience Delivery', disciplines: ['messaging-personalization'] },
  'identity':                      { l2: 'Data & Identity Solutions', l3: 'Identity', disciplines: ['messaging-personalization'] },
  'connections':                   { l2: 'Data & Identity Solutions', l3: 'Connections', disciplines: ['messaging-personalization'] },
  'data-products-dis':             { l2: 'Data & Identity Solutions', l3: 'Data Products', disciplines: [] },

  // ==========================================================================
  // DATA & IDENTITY PRODUCTS
  // ==========================================================================
  'data-products-dip':             { l2: 'Data & Identity Products', l3: 'Data Products', disciplines: [] },
  'terrestrial-identity':          { l2: 'Data & Identity Products', l3: 'Terrestrial Identity', disciplines: [] },
  'tagging-digital-identity':      { l2: 'Data & Identity Products', l3: 'Tagging/Digital Identity', disciplines: [] },

  // ==========================================================================
  // INSIGHTS & ANALYTICS
  // ==========================================================================
  'customer-analytics':            { l2: 'Insights & Analytics - Customer Analytics', l3: 'Customer Analytics', disciplines: ['messaging-personalization'] },
  'visualisation-reporting':       { l2: 'Insights & Analytics', l3: 'Visualisation & Reporting', disciplines: ['messaging-personalization'] },
  'advanced-analytics-ml':         { l2: 'Insights & Analytics', l3: 'Advanced Analytics & Machine Learning', disciplines: ['messaging-personalization'] },
  'bi':                            { l2: 'Insights & Analytics - BI', l3: 'BI', disciplines: [] },
  'measurement-attribution':       { l2: 'Insights & Analytics - Customer Analytics', l3: 'Measurement and Attribution', disciplines: ['messaging-personalization'] },
  'data-science':                  { l2: 'Insights & Analytics - Customer Analytics', l3: 'Data Science', disciplines: ['messaging-personalization'] },
  'marketing-optimisation':        { l2: 'Analytics', l3: 'Marketing Optimisation & Scenario Planning', disciplines: ['messaging-personalization'] },
  'analytics-cloud-data-eng':      { l2: 'Insights & Analytics', l3: 'Analytics Cloud & Data Engineering', disciplines: [] },
  'b2b-research':                  { l2: 'Insights & Analytics', l3: 'B2B Research', disciplines: [] },
  'market-research-voc':           { l2: 'Analytics', l3: 'Market Research & Voice of the Customer', disciplines: [] },
  'market-consumer-research':      { l2: 'Insights & Analytics', l3: 'Market & Consumer Research', disciplines: [] },
  'consumer-ux-research':          { l2: 'Analytics', l3: 'Consumer & UX Research', disciplines: [] },
  'site-analytics':                { l2: 'Insights & Analytics - Site Analytics', l3: 'Site Analytics', disciplines: [] },
  'google-analytics':              { l2: 'Analytics', l3: 'Google Analytics', disciplines: [] },
  'adobe-analytics':               { l2: 'Analytics', l3: 'Adobe Analytics', disciplines: [] },
  'analytics-data-science':        { l2: 'Insights & Analytics', l3: 'Analytics & Data Science', disciplines: ['messaging-personalization'] },
  'product-pricing-supply-chain':  { l2: 'Analytics', l3: 'Product, Pricing, & Supply Chain Analytics', disciplines: ['commerce'] },
  'analytics-general':             { l2: 'Analytics', l3: 'Analytics', disciplines: [] },
  'customer-analytics-gen':        { l2: 'Analytics - Customer Analytics', l3: 'Customer Analytics', disciplines: ['messaging-personalization'] },
  'dashboarding-visualisation':    { l2: 'Insights & Effectiveness', l3: 'Dashboarding & Visualisation', disciplines: [] },

  // ==========================================================================
  // CXM STRATEGY & PLANNING
  // ==========================================================================
  'engagement-loyalty-strategy':   { l2: 'CXM Strategy & Planning', l3: 'Engagement & Loyalty Strategy', disciplines: ['messaging-personalization', 'loyalty'] },
  'technology-strategy':           { l2: 'CXM Strategy & Planning', l3: 'Technology Strategy', disciplines: ['messaging-personalization'] },
  'industry-transformation':       { l2: 'CXM Strategy & Planning', l3: 'Industry & Transformation Strategy', disciplines: ['messaging-personalization'] },
  'transformation-program-mgmt':   { l2: 'CXM Strategy & Planning', l3: 'Transformation & Program Management', disciplines: ['messaging-personalization'] },
  'product-experience-strategy':   { l2: 'CXM Strategy & Planning', l3: 'Product & Experience Strategy', disciplines: [] },
  'cxm-strategy-planning':        { l2: 'CXM Strategy & Planning', l3: 'CXM Strategy & Planning', disciplines: [] },
  'data-analytics-strategy':       { l2: 'Strategy (CXM)', l3: 'Data & Analytics Strategy', disciplines: [] },

  // ==========================================================================
  // STRATEGY (CXM) — Broader strategic services
  // ==========================================================================
  'experience-commerce-strategy':  { l2: 'Strategy - Experience & Commerce Strategy', l3: 'Experience & Commerce Strategy', disciplines: ['commerce'] },
  'business-strategy':             { l2: 'Strategy - Business Strategy', l3: 'Business Strategy', disciplines: [] },
  'technology-strategy-broad':     { l2: 'Strategy - Technology Strategy', l3: 'Technology Strategy', disciplines: [] },
  'strategy-cxm-general':         { l2: 'Strategy (CXM)', l3: 'Strategy (CXM)', disciplines: [] },
  'b2b-strategy':                  { l2: 'Strategy (CXM)', l3: 'B2B Strategy', disciplines: [] },
  'crm-promo-loyalty-strategy':    { l2: 'Strategy (CXM)', l3: 'CRM, Promotions & Loyalty Strategy', disciplines: ['messaging-personalization', 'loyalty'] },
  'customer-experience-strategy':  { l2: 'Strategy (CXM)', l3: 'Customer Experience Strategy', disciplines: [] },
  'strategic-planning-mgmt':       { l2: 'Business Strategy & Consulting', l3: 'Strategic Planning & Management', disciplines: [] },
  'customer-strategy':             { l2: 'Customer Strategy', l3: 'Customer Strategy', disciplines: [] },

  // ==========================================================================
  // TECHNOLOGY DEVELOPMENT & INTEGRATION SERVICES
  // ==========================================================================
  'marketing-automation-tech':     { l2: 'Technology Development & Integration Services', l3: 'Marketing Automation Technology', disciplines: ['messaging-personalization'] },
  'dxp-content-tech':              { l2: 'Technology Development & Integration Services', l3: 'DXP & Content Technology', disciplines: [] },
  'advertising-tech':              { l2: 'Technology Development & Integration Services', l3: 'Advertising Technology', disciplines: ['messaging-personalization'] },
  'front-end-mobile-eng':          { l2: 'Technology Development & Integration Services', l3: 'Front-End & Mobile Engineering', disciplines: [] },
  'back-end-cloud-eng':            { l2: 'Technology Development & Integration Services', l3: 'Back-End & Cloud Engineering', disciplines: [] },
  'tech-dev-integration':          { l2: 'Technology Development & Integration Services', l3: 'Technology Development & Integration Services', disciplines: [] },

  // ==========================================================================
  // CUSTOMER DATA SERVICES
  // ==========================================================================
  'databases-data-engineering':    { l2: 'Customer Data Services', l3: 'Databases & Data Engineering', disciplines: ['messaging-personalization'] },
  'data-technology-platforms':     { l2: 'Customer Data Services', l3: 'Data Technology Platforms', disciplines: ['messaging-personalization'] },
  'customer-data-services':        { l2: 'Customer Data Services', l3: 'Customer Data Services', disciplines: [] },

  // ==========================================================================
  // ACTIVATION
  // ==========================================================================
  'activation-enablement':         { l2: 'Activation', l3: 'Activation Enablement', disciplines: ['messaging-personalization'] },
  'creative':                      { l2: 'Activation - Performance Creative', l3: 'Creative', disciplines: ['messaging-personalization'] },
  'production':                    { l2: 'Activation - Performance Creative', l3: 'Production', disciplines: ['messaging-personalization'] },
  'b2b-activation':                { l2: 'Activation', l3: 'B2B Activation Services', disciplines: [] },
  'e-retail-creative':             { l2: 'Activation', l3: 'E-Retail Creative', disciplines: ['commerce'] },
  'retail-media-sell-side':        { l2: 'Activation', l3: 'Retail Media Network (Sell Side)', disciplines: ['commerce'] },
  'activation-general':            { l2: 'Activation', l3: 'Activation', disciplines: [] },
  'activation-perf-creative':      { l2: 'Activation - Performance Creative', l3: 'Activation - Performance Creative', disciplines: [] },

  // ==========================================================================
  // EXPERIENCE & COMMERCE
  // ==========================================================================
  'commerce-orchestrated':         { l2: 'Experience & Commerce - Commerce', l3: 'Commerce Orchestrated Services', disciplines: ['commerce'] },
  'commerce-operations':           { l2: 'Commerce', l3: 'Commerce Operations', disciplines: ['commerce'] },
  'commerce-technology':           { l2: 'Commerce', l3: 'Commerce Technology', disciplines: ['commerce'] },
  'commerce-services':             { l2: 'Experience & Commerce', l3: 'Commerce Services', disciplines: ['commerce'] },
  'commerce-design-ux':            { l2: 'Experience & Commerce - Commerce', l3: 'Commerce Design & UX', disciplines: ['commerce'] },
  'commerce-platform-impl':        { l2: 'Experience & Commerce - Commerce', l3: 'Commerce Platform Implementation', disciplines: ['commerce'] },
  'social-marketplace-commerce':   { l2: 'Experience & Commerce - Commerce', l3: 'Social & Marketplace Commerce', disciplines: ['commerce'] },
  'b2b-connected-commerce':        { l2: 'Experience & Commerce - Commerce', l3: 'B2B Connected Commerce', disciplines: ['commerce'] },
  'order-management':              { l2: 'Experience & Commerce - Commerce', l3: 'Order Management', disciplines: ['commerce'] },
  'commerce-implementation':       { l2: 'Commerce & Digital Experience', l3: 'Commerce Implementation', disciplines: ['commerce'] },
  'commerce-general':              { l2: 'Commerce', l3: 'Commerce', disciplines: ['commerce'] },
  'digital-experience-design':     { l2: 'Experience & Commerce - Digital Experience', l3: 'Design', disciplines: [] },
  'digital-experience-platforms':  { l2: 'Experience & Commerce - Digital Experience', l3: 'Platforms', disciplines: [] },
  'digital-experience-optimization': { l2: 'Experience & Commerce - Digital Experience', l3: 'Optimization (ACS)', disciplines: [] },
  'dx-content-services':           { l2: 'Experience & Commerce', l3: 'DX & Content Services', disciplines: [] },
  'experience-commerce-general':   { l2: 'Experience & Commerce', l3: 'Experience & Commerce', disciplines: [] },
  'client-product-service-innov':  { l2: 'Experience & Commerce', l3: 'Client Product & Service Innovation', disciplines: [] },

  // ==========================================================================
  // CREATIVE EXPERIENCE & INNOVATION
  // ==========================================================================
  'experience-service-design':     { l2: 'Creative Experience & Innovation (CXM)', l3: 'Experience & Service Design', disciplines: [] },
  'creative-experience-innovation': { l2: 'Creative Experience & Innovation (CXM)', l3: 'Creative Experience & Innovation (CXM)', disciplines: [] },
  'emerging-experiences':          { l2: 'Creative Experience & Innovation (CXM)', l3: 'Emerging Experiences', disciplines: [] },

  // ==========================================================================
  // CUSTOMER EXPERIENCE
  // ==========================================================================
  'customer-experience-design':    { l2: 'Customer Experience - Design', l3: 'Customer Experience Design', disciplines: [] },
  'customer-experience-platforms': { l2: 'Customer Experience - Platforms', l3: 'Customer Experience Platforms', disciplines: [] },
  'customer-experience-dig-msg':   { l2: 'Customer Experience - Digital Messaging', l3: 'Digital Messaging', disciplines: ['messaging-personalization'] },
  'customer-experience-commerce':  { l2: 'Customer Experience - Commerce', l3: 'Commerce', disciplines: ['commerce'] },
  'customer-experience-design-gen': { l2: 'Customer Experience - Design', l3: 'Customer Experience - Design', disciplines: [] },

  // ==========================================================================
  // CLIENT SERVICES
  // ==========================================================================
  'client-services-mgmt':          { l2: 'Client Services Management', l3: 'Client Services Management', disciplines: [] },
  'client-program-mgmt':           { l2: 'Client Services Management', l3: 'Client Program Management', disciplines: [] },
  'agency-services':               { l2: 'Agency Services', l3: 'Agency Services', disciplines: [] },

  // ==========================================================================
  // CUSTOMER TECHNOLOGY MANAGED SERVICES
  // ==========================================================================
  'customer-tech-managed-services': { l2: 'Customer Technology Managed Services', l3: 'Customer Technology Managed Services', disciplines: [] },
  'customer-tech-infra':           { l2: 'Customer Technology Managed Services', l3: 'Infrastructure Managed Services', disciplines: [] },

  // ==========================================================================
  // TECHNOLOGY - DATA MANAGEMENT
  // ==========================================================================
  'tech-data-management':          { l2: 'Technology - Data Management', l3: 'Technology - Data Management', disciplines: [] },
  'tech-identity-management':      { l2: 'Technology - Data Management', l3: 'Identity Management', disciplines: ['messaging-personalization'] },
  'tech-technology-strategy':      { l2: 'Technology - Technology Strategy', l3: 'Technology Strategy', disciplines: [] },

  // ==========================================================================
  // DATA SOLUTIONS
  // ==========================================================================
  'data-solutions-sourcing':       { l2: 'Data Solutions', l3: 'Data Sourcing', disciplines: [] },

  // ==========================================================================
  // PERFORMANCE CREATIVE
  // ==========================================================================
  'performance-creative':          { l2: 'Performance Creative', l3: 'Creative', disciplines: ['messaging-personalization'] },
};

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

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

  // MSS taxonomy mapping — where this service sits in the enterprise catalog
  mssMapping: {
    primary: string;    // Key into MSS_TAXONOMY_MP_RELEVANT
    secondary?: string; // Optional secondary MSS alignment
  };

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
  {
    id: 'regulated-industry',
    name: 'Regulated Industry Compliance',
    description: 'Additional compliance, audit trail, and approval workflow requirements (FinServ, HLS)',
    effortMultiplier: 1.3,
    costMultiplier: 1.25,
    applicableCategories: ['implementation', 'advisory', 'managed-services'],
  },
];

// ============================================================================
// IMPLEMENTATION SERVICES
// ============================================================================

export const IMPLEMENTATION_SERVICES: ServiceOffering[] = [
  // -------------------------------------------------------------------------
  // MC Advanced Migration
  // MSS: Messaging Technology + Customer Data Platform (CDP)
  // -------------------------------------------------------------------------
  {
    id: 'mc-advanced-migration',
    name: 'Marketing Cloud Advanced Migration',
    shortName: 'MC Advanced Migration',
    category: 'implementation',
    description: 'Migrate from MC Engagement to MC Advanced with Data Cloud foundation',
    mssMapping: {
      primary: 'messaging-technology',
      secondary: 'cdp',
    },
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
  // MSS: Data Management Implementation + Databases & Data Engineering
  // -------------------------------------------------------------------------
  {
    id: 'data-integration-setup',
    name: 'Data Integration & ETL Setup',
    shortName: 'Data Integration',
    category: 'implementation',
    description: 'Connect external data sources to Data Cloud for unified customer profiles',
    mssMapping: {
      primary: 'data-mgmt-implementation',
      secondary: 'databases-data-engineering',
    },
    enablesCapabilities: ['extend-data-integrations'],
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
  // MSS: Messaging & Campaign Operations
  // -------------------------------------------------------------------------
  {
    id: 'journey-implementation',
    name: 'Customer Journey Implementation',
    shortName: 'Journey Implementation',
    category: 'implementation',
    description: 'Design, build, and launch automated customer journeys',
    mssMapping: {
      primary: 'messaging-campaign-ops',
    },
    enablesCapabilities: [
      'baseline-subscriber-journeys',
      'customer-lifecycle-journeys',
      'cross-channel-activation',
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
  // MSS: Messaging Services + Digital Messaging
  // -------------------------------------------------------------------------
  {
    id: 'campaign-framework',
    name: 'Campaign Framework & Optimization',
    shortName: 'Campaign Framework',
    category: 'implementation',
    description: 'Build scalable campaign infrastructure with testing and optimization',
    mssMapping: {
      primary: 'messaging-services',
      secondary: 'digital-messaging',
    },
    enablesCapabilities: [
      'enhance-planned-campaigns',
      'scale-dynamic-content',
      'einstein-engagement-scoring',
      'einstein-send-time-optimization',
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
  // MSS: Customer Analytics + Visualisation & Reporting
  // -------------------------------------------------------------------------
  {
    id: 'analytics-intelligence',
    name: 'Analytics & Intelligence Platform',
    shortName: 'Analytics Setup',
    category: 'implementation',
    description: 'Deploy advanced analytics, dashboards, and AI-powered insights',
    mssMapping: {
      primary: 'customer-analytics',
      secondary: 'visualisation-reporting',
    },
    enablesCapabilities: [
      'data-exploration',
      'einstein-engagement-scoring',
      'clv-modeling',
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

  // -------------------------------------------------------------------------
  // Identity Resolution & Data Enrichment
  // MSS: Identity Management + Identity
  // NEW — previously no service covered the identity-resolution capability
  // -------------------------------------------------------------------------
  {
    id: 'identity-resolution-setup',
    name: 'Identity Resolution & Data Enrichment',
    shortName: 'Identity Resolution',
    category: 'implementation',
    description: 'Configure identity resolution rules, profile unification, and Merkury data enrichment within Data Cloud',
    mssMapping: {
      primary: 'identity-management',
      secondary: 'identity',
    },
    enablesCapabilities: ['identity-resolution'],
    typicalTrackLevels: ['data-identity-3'],
    disciplines: ['messaging-personalization'],
    requires: ['data-integration-setup'],
    compatibleModifiers: ['complex-integrations', 'includes-strategy', 'includes-testing', 'regulated-industry'],
    sizes: [
      {
        size: 'small',
        name: 'Basic Identity Resolution',
        duration: '3-4 weeks',
        effortHours: { min: 120, max: 200 },
        estimatedCost: { min: 24000, max: 40000 },
        team: [
          { role: 'Data Cloud Specialist', allocation: '0.8 FTE' },
          { role: 'Solution Architect', allocation: '0.2 FTE' },
        ],
        deliverables: [
          'Identity resolution ruleset configuration',
          'Match and merge rule design',
          'Duplicate management setup',
          'Testing and validation',
        ],
        typicalScope: 'Standard identity resolution with 2-3 match rules, single namespace',
      },
      {
        size: 'medium',
        name: 'Advanced Identity & Enrichment',
        duration: '6-8 weeks',
        effortHours: { min: 300, max: 500 },
        estimatedCost: { min: 60000, max: 100000 },
        team: [
          { role: 'Data Cloud Specialist', allocation: '1.0 FTE' },
          { role: 'Identity Strategist', allocation: '0.3 FTE' },
          { role: 'Data Engineer', allocation: '0.5 FTE' },
        ],
        deliverables: [
          'Advanced identity resolution rules (5+ match rules)',
          'Cross-device/cross-channel identity graph',
          'Merkury integration for data enrichment',
          'Consent management framework',
          'Profile unification across sources',
          'Validation and quality reporting',
        ],
        typicalScope: 'Multi-source identity resolution with Merkury enrichment, consent management',
      },
      {
        size: 'large',
        name: 'Enterprise Identity Platform',
        duration: '10-14 weeks',
        effortHours: { min: 600, max: 1000 },
        estimatedCost: { min: 120000, max: 200000 },
        team: [
          { role: 'Identity Strategist', allocation: '0.5 FTE' },
          { role: 'Data Cloud Specialist', allocation: '1.2 FTE' },
          { role: 'Data Engineer', allocation: '0.8 FTE' },
          { role: 'Privacy/Compliance Analyst', allocation: '0.3 FTE' },
        ],
        deliverables: [
          'Enterprise identity architecture',
          'Cross-cloud golden customer record',
          'Merkury full enrichment suite (demographic, behavioral, intent)',
          'Advanced consent and preference management',
          'Privacy-compliant identity graph',
          'Onboarding/offboarding workflows',
          'Cross-channel identity validation',
          'Ongoing identity quality monitoring',
        ],
        typicalScope: 'Enterprise-wide golden record, full Merkury integration, cross-cloud identity',
      },
    ],
    industryMultipliers: {
      'financial-services': { effortMultiplier: 1.3, notes: 'KYC requirements and regulatory identity verification' },
      'healthcare-life-sciences': { effortMultiplier: 1.4, notes: 'HIPAA patient identity requirements and consent complexity' },
    },
  },

  // -------------------------------------------------------------------------
  // Agentic Campaign Production Setup
  // MSS: Marketing Automation Technology
  // NEW — covers the agentic-campaign-production capability
  // -------------------------------------------------------------------------
  {
    id: 'agentic-campaign-setup',
    name: 'Agentic Campaign Production Setup',
    shortName: 'Agentic Campaigns',
    category: 'implementation',
    description: 'Establish Agentforce governance, guardrails, and approval workflows for AI-powered campaign production',
    mssMapping: {
      primary: 'marketing-automation-tech',
      secondary: 'messaging-campaign-ops',
    },
    enablesCapabilities: ['agentic-campaign-production'],
    typicalTrackLevels: ['content-channels-2', 'content-channels-3'],
    disciplines: ['messaging-personalization'],
    requires: ['campaign-framework'],
    compatibleModifiers: ['includes-strategy', 'includes-testing', 'regulated-industry'],
    sizes: [
      {
        size: 'small',
        name: 'Agentforce Foundation',
        duration: '3-4 weeks',
        effortHours: { min: 100, max: 160 },
        estimatedCost: { min: 20000, max: 32000 },
        team: [
          { role: 'Marketing Technologist', allocation: '0.6 FTE' },
          { role: 'Solution Architect', allocation: '0.3 FTE' },
        ],
        deliverables: [
          'Agentforce Campaign Agent configuration',
          'Basic brand guardrails and tone rules',
          'Human-in-the-loop approval workflow',
          'Pilot campaign type setup (1-2 types)',
        ],
        typicalScope: 'Single campaign type with basic guardrails and manual approval',
      },
      {
        size: 'medium',
        name: 'Governed Agentic Production',
        duration: '6-8 weeks',
        effortHours: { min: 250, max: 400 },
        estimatedCost: { min: 50000, max: 80000 },
        team: [
          { role: 'Marketing Technologist', allocation: '0.8 FTE' },
          { role: 'Solution Architect', allocation: '0.4 FTE' },
          { role: 'Compliance Analyst', allocation: '0.2 FTE' },
        ],
        deliverables: [
          'Multi-campaign-type Agentforce configuration',
          'Comprehensive brand guardrails',
          'Multi-tier approval workflows (auto/manual)',
          'Compliance rule engine (industry-specific)',
          'Audit trail and logging',
          'QA and testing framework for AI outputs',
        ],
        typicalScope: 'Multiple campaign types, compliance rules, tiered approval workflows',
      },
      {
        size: 'large',
        name: 'Enterprise Agentic Operations',
        duration: '10-14 weeks',
        effortHours: { min: 500, max: 800 },
        estimatedCost: { min: 100000, max: 160000 },
        team: [
          { role: 'AI/ML Strategist', allocation: '0.4 FTE' },
          { role: 'Marketing Technologist', allocation: '1.0 FTE' },
          { role: 'Solution Architect', allocation: '0.5 FTE' },
          { role: 'Compliance Analyst', allocation: '0.3 FTE' },
        ],
        deliverables: [
          'Enterprise Agentforce architecture',
          'Multi-BU agentic campaign workflows',
          'Advanced governance framework with regulatory compliance',
          'Custom AI agent training and fine-tuning',
          'Performance benchmarking (AI vs. manual)',
          'Change management and team enablement',
          'Ongoing monitoring and optimization framework',
        ],
        typicalScope: 'Enterprise-wide agentic production with full governance, multi-BU, regulatory compliance',
      },
    ],
    industryMultipliers: {
      'financial-services': { effortMultiplier: 1.4, notes: 'Disclosure requirements, fair lending compliance for AI-generated content' },
      'healthcare-life-sciences': { effortMultiplier: 1.5, notes: 'MLR approval process, HIPAA compliance for AI-generated content' },
    },
  },
];

// ============================================================================
// RETAINER SERVICES
// ============================================================================

export const RETAINER_SERVICES: ServiceOffering[] = [
  // -------------------------------------------------------------------------
  // Marketing Operations Retainer
  // MSS: Messaging & Campaign Operations
  // -------------------------------------------------------------------------
  {
    id: 'marketing-operations-retainer',
    name: 'Marketing Operations Retainer',
    shortName: 'Marketing Ops',
    category: 'retainer',
    description: 'Ongoing campaign execution, optimization, and platform management',
    mssMapping: {
      primary: 'messaging-campaign-ops',
    },
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

  // -------------------------------------------------------------------------
  // Data Management Maintenance
  // MSS: Data Management Maintenance
  // NEW — ongoing data ops for Data Cloud
  // -------------------------------------------------------------------------
  {
    id: 'data-management-retainer',
    name: 'Data Management & Cloud Operations',
    shortName: 'Data Ops',
    category: 'retainer',
    description: 'Ongoing Data Cloud optimization, new data stream onboarding, consumption management, and data quality monitoring',
    mssMapping: {
      primary: 'data-mgmt-maintenance',
      secondary: 'data-technology-platforms',
    },
    enablesCapabilities: ['extend-data-integrations', 'identity-resolution'],
    typicalTrackLevels: ['data-identity-2', 'data-identity-3'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['complex-integrations'],
    sizes: [
      {
        size: 'small',
        name: 'Data Cloud Monitoring',
        duration: 'Monthly',
        effortHours: { min: 30, max: 50 },
        estimatedCost: { min: 6000, max: 10000 },
        team: [
          { role: 'Data Cloud Specialist', allocation: '8-12 hrs/week' },
        ],
        deliverables: [
          'Data stream health monitoring',
          'Consumption tracking and alerts',
          'Minor data quality fixes',
          'Monthly health report',
        ],
        typicalScope: 'Monitoring and light maintenance, 2-3 data streams',
      },
      {
        size: 'medium',
        name: 'Data Cloud Operations',
        duration: 'Monthly',
        effortHours: { min: 80, max: 120 },
        estimatedCost: { min: 16000, max: 24000 },
        team: [
          { role: 'Data Cloud Specialist', allocation: '15-20 hrs/week' },
          { role: 'Data Engineer', allocation: '5-10 hrs/week' },
        ],
        deliverables: [
          'Ongoing data stream optimization',
          'New data source onboarding (1-2/quarter)',
          'Calculated insights tuning',
          'Consumption optimization',
          'Data quality monitoring and remediation',
          'Identity resolution rule refinement',
        ],
        typicalScope: 'Active management of 5+ data streams, quarterly new source onboarding',
      },
      {
        size: 'large',
        name: 'Enterprise Data Operations',
        duration: 'Monthly',
        effortHours: { min: 160, max: 240 },
        estimatedCost: { min: 32000, max: 48000 },
        team: [
          { role: 'Data Architect', allocation: '10 hrs/week' },
          { role: 'Data Cloud Specialist', allocation: '25 hrs/week' },
          { role: 'Data Engineer', allocation: '20 hrs/week' },
          { role: 'Analytics Specialist', allocation: '5 hrs/week' },
        ],
        deliverables: [
          'Enterprise data platform management',
          'Continuous integration of new data sources',
          'Advanced consumption and cost optimization',
          'Identity resolution management',
          'Data governance and quality program',
          'Cross-cloud data architecture support',
          'Executive data health reporting',
        ],
        typicalScope: 'Full data platform management, 10+ streams, continuous optimization',
      },
    ],
  },
];

// ============================================================================
// MANAGED SERVICES
// ============================================================================

export const MANAGED_SERVICES: ServiceOffering[] = [
  // -------------------------------------------------------------------------
  // Infrastructure Managed Services
  // MSS: Infrastructure Managed Services
  // NEW — platform-level managed services
  // -------------------------------------------------------------------------
  {
    id: 'platform-managed-services',
    name: 'Marketing Cloud Managed Services',
    shortName: 'Platform Managed Services',
    category: 'managed-services',
    description: 'Fully managed Marketing Cloud platform operations including administration, monitoring, upgrades, and user management',
    mssMapping: {
      primary: 'infra-managed-services',
      secondary: 'messaging-technology',
    },
    enablesCapabilities: [],
    typicalTrackLevels: [],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['multi-bu', 'regulated-industry'],
    sizes: [
      {
        size: 'small',
        name: 'Platform Administration',
        duration: 'Monthly',
        effortHours: { min: 30, max: 50 },
        estimatedCost: { min: 6000, max: 10000 },
        team: [
          { role: 'MC Administrator', allocation: '8-12 hrs/week' },
        ],
        deliverables: [
          'User management and permissions',
          'Platform configuration maintenance',
          'Release monitoring and impact assessment',
          'Basic troubleshooting and support',
        ],
        typicalScope: 'Single BU platform administration',
      },
      {
        size: 'medium',
        name: 'Managed Platform Operations',
        duration: 'Monthly',
        effortHours: { min: 80, max: 120 },
        estimatedCost: { min: 16000, max: 24000 },
        team: [
          { role: 'MC Administrator', allocation: '15-20 hrs/week' },
          { role: 'Technical Lead', allocation: '5-10 hrs/week' },
        ],
        deliverables: [
          'Multi-BU administration',
          'Release management and upgrade planning',
          'Performance monitoring and optimization',
          'Security and compliance monitoring',
          'Vendor escalation management',
          'Monthly operations report',
        ],
        typicalScope: 'Multi-BU platform operations with proactive monitoring',
      },
      {
        size: 'large',
        name: 'Enterprise Managed Services',
        duration: 'Monthly',
        effortHours: { min: 160, max: 240 },
        estimatedCost: { min: 32000, max: 48000 },
        team: [
          { role: 'Technical Lead', allocation: '15 hrs/week' },
          { role: 'MC Administrator', allocation: '25 hrs/week' },
          { role: 'Developer', allocation: '15 hrs/week' },
          { role: 'QA Analyst', allocation: '5 hrs/week' },
        ],
        deliverables: [
          'Enterprise platform governance',
          'Full release management lifecycle',
          'SLA-based incident response',
          'Capacity planning and optimization',
          'Security audits and compliance reporting',
          'Platform roadmap and upgrade strategy',
          'Cross-cloud integration monitoring',
        ],
        typicalScope: 'Enterprise-wide MC managed services with SLAs and full governance',
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
    mssMapping: {
      primary: 'messaging-services',
    },
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
    mssMapping: {
      primary: 'messaging-campaign-ops',
    },
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
    description: 'Dedicated data engineer resource for Data Cloud and integrations',
    mssMapping: {
      primary: 'databases-data-engineering',
    },
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
  // -------------------------------------------------------------------------
  // Data Cloud Specialist — NEW staff aug role
  // MSS: Customer Data Platform (CDP)
  // -------------------------------------------------------------------------
  {
    id: 'data-cloud-specialist-staffaug',
    name: 'Data Cloud Specialist Staff Augmentation',
    shortName: 'Data Cloud Specialist',
    category: 'staff-aug',
    description: 'Dedicated Data Cloud specialist for platform configuration, identity resolution, and calculated insights',
    mssMapping: {
      primary: 'cdp',
    },
    enablesCapabilities: [],
    typicalTrackLevels: [],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: [],
    sizes: [
      {
        size: 'medium',
        name: 'Mid-Level Data Cloud Specialist',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 22000, max: 28000 },
        team: [{ role: 'Mid-Level Data Cloud Specialist', allocation: '1.0 FTE' }],
        deliverables: ['Data Cloud configuration', 'Data stream management', 'Calculated insights', 'Identity resolution'],
        typicalScope: '1.0 FTE mid-level specialist',
      },
      {
        size: 'large',
        name: 'Senior Data Cloud Specialist',
        duration: 'Monthly',
        effortHours: { min: 160, max: 160 },
        estimatedCost: { min: 30000, max: 38000 },
        team: [{ role: 'Senior Data Cloud Specialist', allocation: '1.0 FTE' }],
        deliverables: ['Advanced Data Cloud architecture', 'Zero-copy federation', 'Complex identity resolution', 'Consumption optimization'],
        typicalScope: '1.0 FTE senior specialist',
      },
    ],
  },
];

// ============================================================================
// ADVISORY SERVICES
// ============================================================================

export const ADVISORY_SERVICES: ServiceOffering[] = [
  // -------------------------------------------------------------------------
  // Maturity Assessment & Roadmap
  // MSS: Industry & Transformation Strategy + Technology Strategy
  // -------------------------------------------------------------------------
  {
    id: 'maturity-assessment',
    name: 'Maturity Assessment & Roadmap',
    shortName: 'Assessment',
    category: 'advisory',
    description: 'Comprehensive maturity assessment with strategic roadmap',
    mssMapping: {
      primary: 'industry-transformation',
      secondary: 'technology-strategy',
    },
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

  // -------------------------------------------------------------------------
  // Engagement & Loyalty Strategy
  // MSS: Engagement & Loyalty Strategy
  // NEW — M&P-specific strategic advisory
  // -------------------------------------------------------------------------
  {
    id: 'engagement-strategy',
    name: 'Engagement & Personalization Strategy',
    shortName: 'Engagement Strategy',
    category: 'advisory',
    description: 'Strategic advisory for customer engagement, journey strategy, personalization approach, and channel mix optimization',
    mssMapping: {
      primary: 'engagement-loyalty-strategy',
    },
    enablesCapabilities: [
      'insight-driven-experiences',
      'customer-lifecycle-journeys',
      'cross-channel-activation',
    ],
    typicalTrackLevels: ['journeys-2', 'journeys-3', 'content-channels-3'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['includes-strategy'],
    sizes: [
      {
        size: 'small',
        name: 'Channel & Journey Workshop',
        duration: '1-2 weeks',
        effortHours: { min: 30, max: 50 },
        estimatedCost: { min: 12000, max: 20000 },
        team: [
          { role: 'Engagement Strategist', allocation: '30-50 hrs' },
        ],
        deliverables: [
          'Journey prioritization workshop',
          'Channel mix recommendation',
          'Quick-win identification',
          'Executive summary',
        ],
        typicalScope: 'Focused workshop on journey priorities and channel strategy',
      },
      {
        size: 'medium',
        name: 'Engagement Strategy & Roadmap',
        duration: '3-5 weeks',
        effortHours: { min: 80, max: 120 },
        estimatedCost: { min: 30000, max: 45000 },
        team: [
          { role: 'Engagement Strategist', allocation: '50-70 hrs' },
          { role: 'Data Strategist', allocation: '20-40 hrs' },
        ],
        deliverables: [
          'Customer engagement audit',
          'Lifecycle journey strategy',
          'Personalization framework',
          'Channel strategy with ROI projections',
          'Phased engagement roadmap',
          'Executive presentation',
        ],
        typicalScope: 'Full engagement strategy with data requirements and ROI modeling',
      },
      {
        size: 'large',
        name: 'Enterprise Engagement Transformation',
        duration: '6-10 weeks',
        effortHours: { min: 160, max: 240 },
        estimatedCost: { min: 60000, max: 90000 },
        team: [
          { role: 'Engagement Strategist', allocation: '60-80 hrs' },
          { role: 'Data Strategist', allocation: '40-60 hrs' },
          { role: 'Industry Expert', allocation: '20-40 hrs' },
          { role: 'Creative Strategist', allocation: '20-40 hrs' },
        ],
        deliverables: [
          'Enterprise engagement vision and strategy',
          'Customer segmentation framework',
          'Omnichannel journey architecture',
          'Personalization maturity model',
          'Content strategy and creative framework',
          'Measurement and attribution plan',
          'Multi-year engagement roadmap',
          'Organizational capability assessment',
        ],
        typicalScope: 'Enterprise engagement transformation with segmentation, content, and org design',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Technology Strategy
  // MSS: Technology Strategy
  // NEW — platform-specific technical advisory (separate from maturity assessment)
  // -------------------------------------------------------------------------
  {
    id: 'technology-strategy',
    name: 'Marketing Technology Strategy',
    shortName: 'Tech Strategy',
    category: 'advisory',
    description: 'Technical architecture review, platform selection guidance, integration strategy, and technology roadmap for marketing stack',
    mssMapping: {
      primary: 'technology-strategy',
      secondary: 'marketing-automation-tech',
    },
    enablesCapabilities: ['migrate-sfmc'],
    typicalTrackLevels: ['data-identity-1'],
    disciplines: ['messaging-personalization'],
    compatibleModifiers: ['includes-strategy'],
    sizes: [
      {
        size: 'small',
        name: 'Architecture Review',
        duration: '1-2 weeks',
        effortHours: { min: 30, max: 50 },
        estimatedCost: { min: 12000, max: 20000 },
        team: [
          { role: 'Solution Architect', allocation: '30-50 hrs' },
        ],
        deliverables: [
          'Current architecture assessment',
          'Platform capability gap analysis',
          'Migration path recommendation',
          'Technical summary document',
        ],
        typicalScope: 'Focused architecture review, MC Engagement vs. MC Advanced decision',
      },
      {
        size: 'medium',
        name: 'Technology Roadmap',
        duration: '3-5 weeks',
        effortHours: { min: 80, max: 120 },
        estimatedCost: { min: 30000, max: 45000 },
        team: [
          { role: 'Solution Architect', allocation: '50-70 hrs' },
          { role: 'Data Architect', allocation: '20-40 hrs' },
        ],
        deliverables: [
          'Full marketing technology audit',
          'Integration architecture design',
          'Data Cloud architecture recommendation',
          'Platform licensing optimization',
          'Phased technology roadmap',
          'Executive and technical presentations',
        ],
        typicalScope: 'Full martech audit with architecture design and licensing review',
      },
      {
        size: 'large',
        name: 'Enterprise Technology Strategy',
        duration: '6-10 weeks',
        effortHours: { min: 160, max: 240 },
        estimatedCost: { min: 60000, max: 90000 },
        team: [
          { role: 'Solution Architect', allocation: '60-80 hrs' },
          { role: 'Data Architect', allocation: '40-60 hrs' },
          { role: 'Integration Specialist', allocation: '30-50 hrs' },
          { role: 'Principal Consultant', allocation: '20-30 hrs' },
        ],
        deliverables: [
          'Enterprise martech landscape assessment',
          'Cross-cloud architecture design',
          'Data architecture and integration strategy',
          'Vendor and platform evaluation',
          'Consumption and licensing optimization plan',
          'Security and compliance architecture',
          'Multi-year technology roadmap',
          'Build vs. buy recommendations',
        ],
        typicalScope: 'Enterprise technology strategy spanning multiple clouds and integration points',
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
  ...MANAGED_SERVICES,
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
 * Get services by MSS L2 practice area
 */
export function getServicesByMssL2(l2: string): ServiceOffering[] {
  return ALL_SERVICES.filter(s => {
    const primary = MSS_TAXONOMY[s.mssMapping.primary];
    const secondary = s.mssMapping.secondary
      ? MSS_TAXONOMY[s.mssMapping.secondary]
      : undefined;
    return primary?.l2 === l2 || secondary?.l2 === l2;
  });
}

/**
 * Get the resolved MSS mapping for a service
 */
export function getMssForService(service: ServiceOffering): { primary: MssMapping; secondary?: MssMapping } {
  const primary = MSS_TAXONOMY[service.mssMapping.primary];
  const secondary = service.mssMapping.secondary
    ? MSS_TAXONOMY[service.mssMapping.secondary]
    : undefined;
  return { primary, secondary };
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
