/**
 * Commerce Cloud Track-Based Maturity Model
 *
 * Organizes Salesforce Commerce Cloud capabilities into 4 progression tracks,
 * each with 3 levels. Supports both B2C Commerce (ex-Demandware) and B2B Commerce
 * (ex-CloudCraze) with business-model-aware question variants.
 *
 * Track structure mirrors M&P and Loyalty patterns:
 *   1. Commerce Platform (foundation/infrastructure)
 *   2. Shopping Experience (customer-facing)
 *   3. Order & Fulfillment (execution/operations)
 *   4. Commerce Intelligence (measurement/optimization)
 */

import type { IndustryType, BusinessModelType } from '../types';

// ============================================================================
// COMMERCE-SPECIFIC TYPES
// ============================================================================

export type CommerceTrackId =
  | 'commerce-platform'
  | 'shopping-experience'
  | 'order-fulfillment'
  | 'commerce-intelligence';

export type CommerceTrackLevel = 1 | 2 | 3;

export type CommerceTrackLevelStatus = 'not-started' | 'in-progress' | 'complete';

export interface CommerceTrackAssessmentQuestion {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'text';
  options?: string[];
  helpText?: string;
  required?: boolean;
  industryVariants?: Partial<Record<IndustryType, {
    question?: string;
    options?: string[];
    helpText?: string;
  }>>;
  /** Business-model-specific question/option overrides (B2B vs B2C vs B2B2C) */
  businessModelVariants?: Partial<Record<BusinessModelType, {
    question?: string;
    options?: string[];
    helpText?: string;
  }>>;
}

export interface CommerceTrackLevelDefinition {
  level: CommerceTrackLevel;
  name: string;
  shortName: string;
  description: string;
  descriptionVariants?: Partial<Record<IndustryType, string>>;
  /** Business-model-specific level descriptions */
  businessModelDescriptions?: Partial<Record<BusinessModelType, string>>;
  capabilities: string[];
  assessmentQuestions: CommerceTrackAssessmentQuestion[];
}

export interface CommerceTrack {
  id: CommerceTrackId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  journeyType: 'above-the-line' | 'below-the-line';
  levels: CommerceTrackLevelDefinition[];
}

export interface CommerceTrackDependency {
  fromTrack: CommerceTrackId;
  fromLevel: CommerceTrackLevel;
  toTrack: CommerceTrackId;
  toLevel: CommerceTrackLevel;
  type: 'required' | 'recommended';
  description: string;
}

// ============================================================================
// COMMERCE TRACK DEFINITIONS
// ============================================================================

export const COMMERCE_TRACKS: CommerceTrack[] = [
  // -------------------------------------------------------------------------
  // COMMERCE PLATFORM TRACK
  // -------------------------------------------------------------------------
  {
    id: 'commerce-platform',
    name: 'Commerce Platform',
    shortName: 'Platform',
    description: 'Assess and evolve your Commerce Cloud foundation — from identifying the right product variant (B2C/B2B Commerce) and architecture pattern (SFRA, Composable, Lightning) through API strategy and composable/multi-site maturity',
    icon: 'ShoppingCart',
    color: 'orange',
    journeyType: 'below-the-line',
    levels: [
      {
        level: 1,
        name: 'Platform Assessment',
        shortName: 'Assessment',
        description: 'Assess the current Commerce Cloud deployment — which product is in use (B2C, B2B, or both), the storefront architecture (SiteGenesis, SFRA, Composable/PWA Kit, B2B Lightning), existing cross-cloud integrations, and the platform direction going forward',
        businessModelDescriptions: {
          b2b: 'Understand the current B2B Commerce deployment, account-based storefront, and integration baseline',
          b2c: 'Understand the current B2C Commerce deployment, storefront architecture, and integration baseline',
          b2b2c: 'Understand Commerce Cloud deployment across both B2B and B2C storefronts and shared integration baseline',
        },
        capabilities: ['commerce-platform-assessment'],
        assessmentQuestions: [
          {
            id: 'commerce-cloud-product',
            question: 'Which Commerce Cloud product(s) are currently in use or planned?',
            type: 'single-select',
            options: [
              'B2C Commerce (ex-Demandware / SFCC)',
              'B2B Commerce (Lightning-based)',
              'Both B2C and B2B Commerce',
              'No Commerce Cloud — evaluating',
              'Non-Salesforce commerce platform',
            ],
            required: true,
            helpText: 'This determines the track focus and which capabilities are relevant',
          },
          {
            id: 'storefront-architecture',
            question: 'What is the current storefront architecture?',
            type: 'single-select',
            options: [
              'SiteGenesis (legacy B2C)',
              'SFRA — Storefront Reference Architecture',
              'Composable Storefront / PWA Kit (headless)',
              'B2B Lightning storefront',
              'Custom / headless with Commerce APIs',
              'No storefront yet',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'B2B Commerce Lightning storefront',
                  'Custom storefront with B2B Commerce APIs',
                  'Non-Salesforce B2B portal',
                  'No digital storefront — orders via reps/phone',
                  'Evaluating B2B Commerce',
                ],
              },
              b2c: {
                options: [
                  'SiteGenesis (legacy)',
                  'SFRA — Storefront Reference Architecture',
                  'Composable Storefront / PWA Kit (headless)',
                  'Custom headless with SCAPI',
                  'Non-Salesforce storefront',
                  'No storefront yet',
                ],
              },
            },
          },
          {
            id: 'commerce-integrations',
            question: 'Which systems are currently integrated with Commerce Cloud?',
            type: 'multi-select',
            options: [
              'Marketing Cloud',
              'Service Cloud',
              'Sales Cloud / CRM',
              'Data Cloud',
              'Order Management (Salesforce OMS)',
              'ERP / back-office',
              'Payment gateway(s)',
              'PIM / product catalog',
              'Loyalty platform',
              'None — standalone',
            ],
            required: true,
            helpText: 'Select all that apply',
            businessModelVariants: {
              b2b: {
                options: [
                  'Sales Cloud / CRM',
                  'Service Cloud',
                  'CPQ (Configure, Price, Quote)',
                  'Data Cloud',
                  'ERP / back-office',
                  'Marketing Cloud Account Engagement',
                  'Payment / invoicing system',
                  'PIM / product catalog',
                  'EDI / procurement systems',
                  'None — standalone',
                ],
              },
            },
          },
          {
            id: 'commerce-migration-posture',
            question: 'What is the platform direction?',
            type: 'single-select',
            options: [
              'Staying on current architecture — optimizing',
              'Planning migration to Composable Storefront',
              'Planning migration to Commerce Cloud from another platform',
              'Evaluating headless / composable approach',
              'Recently deployed — still stabilizing',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Staying on current B2B Commerce — optimizing',
                  'Migrating to B2B Commerce from custom/legacy portal',
                  'Expanding B2B Commerce capabilities',
                  'Evaluating B2B Commerce for the first time',
                  'Recently deployed — still stabilizing',
                ],
              },
            },
          },
        ],
      },
      {
        level: 2,
        name: 'Architecture & Integration',
        shortName: 'Architecture',
        description: 'Mature the commerce architecture with a robust API strategy (SCAPI, Connect API), cross-cloud data flows into Data Cloud and Marketing Cloud, CMS integration, and resolution of key architectural blockers like legacy customizations or performance constraints',
        businessModelDescriptions: {
          b2b: 'Deepen integration between B2B Commerce, Sales Cloud, and back-office systems with API-first architecture',
          b2c: 'Evolve toward composable/headless architecture with SCAPI and cross-cloud data flows',
          b2b2c: 'Build a unified commerce architecture that serves both B2B and B2C channels through shared APIs and data models',
        },
        capabilities: ['commerce-architecture', 'commerce-api-strategy'],
        assessmentQuestions: [
          {
            id: 'api-strategy',
            question: 'What is the current API and extension strategy?',
            type: 'single-select',
            options: [
              'Minimal API usage — mostly out-of-the-box',
              'OCAPI for integrations (legacy B2C)',
              'SCAPI (Salesforce Commerce API) adopted',
              'Headless with custom API layer',
              'Mix of OCAPI and SCAPI in transition',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                question: 'What is the current API and extension strategy?',
                options: [
                  'Minimal — mostly out-of-the-box B2B Commerce',
                  'Connect API for integrations',
                  'Custom Apex/LWC extensions',
                  'Integration via MuleSoft or middleware',
                  'API-first with external systems',
                ],
              },
            },
          },
          {
            id: 'data-cloud-commerce',
            question: 'How is commerce data connected to the broader Salesforce ecosystem?',
            type: 'single-select',
            options: [
              'No cross-cloud data sharing',
              'Basic order sync to Service/Sales Cloud',
              'Commerce data flows into Data Cloud',
              'Unified profiles across Commerce + Marketing + Service',
              'Real-time bidirectional data flows',
            ],
            required: true,
          },
          {
            id: 'content-management',
            question: 'How is commerce content managed?',
            type: 'single-select',
            options: [
              'Content managed within Commerce Cloud',
              'External CMS (headless) feeding Commerce',
              'Salesforce CMS integrated',
              'Page Designer for merchandising content',
              'Mix of systems — fragmented',
            ],
            businessModelVariants: {
              b2b: {
                options: [
                  'Content managed within B2B Commerce pages',
                  'Experience Cloud for portal content',
                  'External CMS feeding B2B storefront',
                  'Salesforce CMS integrated',
                  'Mix of systems — fragmented',
                ],
              },
            },
          },
          {
            id: 'architecture-blockers',
            question: 'What are the biggest architectural challenges?',
            type: 'multi-select',
            options: [
              'Legacy customizations blocking upgrades',
              'Performance / page load speed',
              'Integration reliability / data latency',
              'Developer experience / deployment complexity',
              'Multi-site / multi-locale complexity',
              'No significant architectural challenges',
            ],
            businessModelVariants: {
              b2b: {
                options: [
                  'Complex pricing / contract rules',
                  'ERP integration reliability',
                  'Buyer permission / approval workflows',
                  'Large catalog performance',
                  'Custom checkout complexity',
                  'No significant architectural challenges',
                ],
              },
            },
          },
        ],
      },
      {
        level: 3,
        name: 'Composable & Multi-Site',
        shortName: 'Composable',
        description: 'Achieve full composable commerce maturity — multi-site/multi-brand management, internationalization (multi-locale, multi-currency), micro-frontend architecture, and advanced capabilities like PWA storefronts, punchout catalogs, or marketplace integrations',
        businessModelDescriptions: {
          b2b: 'Advanced B2B Commerce: multi-division portals, complex account hierarchies, and enterprise-grade integrations',
          b2c: 'Full composable commerce: multi-site, multi-brand, internationalization, and microservices architecture',
          b2b2c: 'Unified composable platform serving both B2B portals and B2C storefronts from shared commerce infrastructure',
        },
        capabilities: ['composable-commerce', 'multi-site-commerce'],
        assessmentQuestions: [
          {
            id: 'multi-site-needs',
            question: 'What multi-site or multi-brand requirements exist?',
            type: 'multi-select',
            options: [
              'Multiple brands on same platform',
              'International / multi-locale sites',
              'Multi-currency support',
              'Region-specific catalogs or pricing',
              'Shared vs. brand-specific experiences',
              'Single site only',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                question: 'What multi-division or multi-portal requirements exist?',
                options: [
                  'Multiple business divisions with separate portals',
                  'International / multi-locale portals',
                  'Multi-currency with contract pricing',
                  'Division-specific catalogs',
                  'Shared account hierarchies across portals',
                  'Single portal only',
                ],
              },
            },
          },
          {
            id: 'composable-readiness',
            question: 'What is the readiness for composable / microservices commerce?',
            type: 'single-select',
            options: [
              'Already composable / headless',
              'Actively migrating to composable',
              'Evaluating — need to understand trade-offs',
              'Not considering — monolith is working',
              'Not applicable',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                question: 'What is the readiness for advanced B2B Commerce capabilities?',
                options: [
                  'Ready for advanced features (punchout, EDI, etc.)',
                  'Need to stabilize core before advancing',
                  'Evaluating enterprise-grade capabilities',
                  'Current setup meets needs',
                  'Not applicable',
                ],
              },
            },
          },
          {
            id: 'platform-advanced-features',
            question: 'Which advanced platform capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Progressive Web App (PWA) storefront',
              'Micro-frontend architecture',
              'Edge-side personalization / CDN optimization',
              'Custom checkout extensions',
              'Third-party marketplace integration',
              'Not a priority right now',
            ],
            businessModelVariants: {
              b2b: {
                options: [
                  'Punchout catalog (cXML/OCI)',
                  'EDI order integration',
                  'Self-service account management portal',
                  'Complex approval workflows',
                  'Contract lifecycle management',
                  'Not a priority right now',
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SHOPPING EXPERIENCE TRACK
  // -------------------------------------------------------------------------
  {
    id: 'shopping-experience',
    name: 'Shopping Experience',
    shortName: 'Experience',
    description: 'Optimize the end-to-end digital shopping journey — from product data quality and search relevance through Einstein-powered personalization and dynamic merchandising to advanced experiences like social commerce, clienteling, and conversational buying',
    icon: 'Search',
    color: 'pink',
    journeyType: 'above-the-line',
    levels: [
      {
        level: 1,
        name: 'Catalog & Search',
        shortName: 'Catalog',
        description: 'Establish strong product data foundations — catalog structure, attribute completeness, image quality, and search/navigation experience — ensuring customers can discover and evaluate products efficiently whether browsing or searching by SKU',
        businessModelDescriptions: {
          b2b: 'Establish B2B catalog structure with account-specific pricing, entitlements, and product visibility',
          b2c: 'Establish strong product data foundations, search experience, and core catalog management',
        },
        capabilities: ['catalog-management', 'search-foundation'],
        assessmentQuestions: [
          {
            id: 'catalog-complexity',
            question: 'How complex is the product catalog?',
            type: 'single-select',
            options: [
              'Simple — under 1,000 SKUs',
              'Moderate — 1,000–10,000 SKUs',
              'Large — 10,000–100,000 SKUs',
              'Enterprise — 100,000+ SKUs',
              'Configurable / build-your-own products',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Simple — under 500 SKUs',
                  'Moderate — 500–5,000 SKUs',
                  'Large — 5,000–50,000 SKUs',
                  'Enterprise — 50,000+ SKUs with complex variants',
                  'Configurable products requiring CPQ',
                ],
              },
            },
          },
          {
            id: 'product-data-quality',
            question: 'What is the state of product data quality?',
            type: 'single-select',
            options: [
              'Poor — inconsistent attributes, missing images',
              'Basic — functional but not optimized',
              'Good — complete attributes, quality images',
              'Excellent — rich content, video, reviews integrated',
            ],
            required: true,
          },
          {
            id: 'search-current',
            question: 'What is the current search and navigation experience?',
            type: 'single-select',
            options: [
              'Basic keyword search only',
              'Faceted search with filtering',
              'Einstein Search enabled',
              'Third-party search (Algolia, Coveo, etc.)',
              'No search — browse/category only',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Basic keyword search only',
                  'Search by SKU / part number',
                  'Faceted search with B2B filters',
                  'Quick order / CSV upload',
                  'Third-party search or PIM-driven',
                ],
              },
            },
          },
          {
            id: 'pricing-model',
            question: 'How is pricing managed?',
            type: 'single-select',
            options: [
              'Single price list for all customers',
              'Promotional pricing / sale prices',
              'Customer-group-based pricing',
              'Dynamic / personalized pricing',
            ],
            businessModelVariants: {
              b2b: {
                question: 'How is B2B pricing managed?',
                options: [
                  'Standard price list',
                  'Account-specific negotiated pricing',
                  'Contract-based price books',
                  'Volume / tiered pricing',
                  'CPQ-driven pricing for complex products',
                ],
                helpText: 'B2B pricing is typically account-specific and contract-driven',
              },
            },
          },
        ],
      },
      {
        level: 2,
        name: 'Personalization & Merchandising',
        shortName: 'Personalization',
        description: 'Deploy Einstein-powered product recommendations on PDP and cart, predictive sort on category pages, dynamic promotion merchandising with Page Designer, and personalized content — turning every browse session into a tailored shopping experience',
        businessModelDescriptions: {
          b2b: 'Deploy account-aware product recommendations, reorder suggestions, and personalized B2B catalog views',
          b2c: 'Deploy Einstein-powered product recommendations, predictive sort, and dynamic merchandising',
        },
        capabilities: ['einstein-commerce', 'dynamic-merchandising'],
        assessmentQuestions: [
          {
            id: 'personalization-current',
            question: 'What product personalization exists today?',
            type: 'single-select',
            options: [
              'None — same experience for all visitors',
              'Basic merchandising rules (manual)',
              'Einstein Product Recommendations enabled',
              'Einstein Predictive Sort enabled',
              'Advanced personalization with multiple strategies',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'None — same catalog view for all buyers',
                  'Account-based catalog visibility',
                  'Reorder suggestions based on purchase history',
                  'Role-based product recommendations',
                  'Advanced personalization with entitlement-aware recs',
                ],
              },
            },
          },
          {
            id: 'merchandising-priorities',
            question: 'Which merchandising capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Product recommendations (PDP / cart)',
              'Predictive sort on category pages',
              'Recently viewed / wish list',
              'Promotion-driven merchandising',
              'Content personalization (Page Designer)',
              'Social proof (reviews, ratings, popularity)',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Frequently purchased / reorder',
                  'Related products for B2B buyers',
                  'Account-specific promotions',
                  'Contract-based catalog views',
                  'Bulk order optimization',
                  'Cross-sell based on purchase history',
                ],
              },
            },
          },
          {
            id: 'promotion-management',
            question: 'How are promotions and campaigns managed?',
            type: 'single-select',
            options: [
              'No promotions currently',
              'Basic site-wide sales / coupons',
              'Targeted promotions by segment',
              'Complex stacking rules and exclusions',
              'Dynamic / personalized offers',
            ],
            businessModelVariants: {
              b2b: {
                question: 'How are B2B pricing incentives managed?',
                options: [
                  'No incentive programs',
                  'Volume discount schedules',
                  'Account-specific promotional pricing',
                  'Rebate programs',
                  'Dynamic pricing based on relationship / volume',
                ],
              },
            },
          },
        ],
      },
      {
        level: 3,
        name: 'Advanced Experiences',
        shortName: 'Advanced',
        description: 'Deliver differentiated commerce experiences — social commerce (Instagram, TikTok Shop), marketplace integrations, clienteling and assisted selling, conversational commerce via chat, and Agentforce-powered AI shopping assistance',
        businessModelDescriptions: {
          b2b: 'Deliver sophisticated B2B buying experiences with guided selling, complex configuration, and multi-stakeholder workflows',
          b2c: 'Deliver 1:1 commerce experiences with AI-driven merchandising, social commerce, and assisted selling',
        },
        capabilities: ['advanced-personalization', 'social-commerce'],
        assessmentQuestions: [
          {
            id: 'advanced-experience-priorities',
            question: 'Which advanced experience capabilities are priorities?',
            type: 'multi-select',
            options: [
              'AI-driven visual merchandising',
              'Social commerce (Instagram, TikTok Shop)',
              'Marketplace listing integration (Amazon, etc.)',
              'Clienteling / assisted selling',
              'Augmented reality / virtual try-on',
              'Conversational commerce (chat-to-buy)',
              'Not a priority right now',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Guided selling / product configuration',
                  'Multi-stakeholder approval workflows',
                  'Punchout integration (cXML/OCI)',
                  'Self-service quoting',
                  'Sales rep-assisted digital ordering',
                  'IoT-triggered reorders',
                  'Not a priority right now',
                ],
              },
            },
          },
          {
            id: 'cross-channel-commerce',
            question: 'What cross-channel commerce capabilities are needed?',
            type: 'multi-select',
            options: [
              'Unified cart across web and mobile',
              'In-store digital experiences (kiosk, endless aisle)',
              'Social selling integration',
              'Call center-assisted ordering',
              'Chat/messaging commerce',
              'Not considering cross-channel',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Unified ordering across portal and sales reps',
                  'EDI alongside digital orders',
                  'Field sales mobile ordering',
                  'Call center-assisted ordering',
                  'Customer-specific portals / microsites',
                  'Not considering cross-channel',
                ],
              },
            },
          },
          {
            id: 'agentforce-commerce',
            question: 'What is the interest in Agentforce for Commerce?',
            type: 'single-select',
            options: [
              'Yes, ready to pilot AI-powered shopping assistance',
              'Interested but need foundation first',
              'Need education on the value',
              'Not a priority',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ORDER & FULFILLMENT TRACK
  // -------------------------------------------------------------------------
  {
    id: 'order-fulfillment',
    name: 'Order & Fulfillment',
    shortName: 'Orders',
    description: 'Manage the complete order lifecycle — from checkout optimization and payment processing through distributed fulfillment (BOPIS, ship-from-store), returns management, and advanced capabilities like subscriptions and marketplace operations',
    icon: 'Package',
    color: 'teal',
    journeyType: 'above-the-line',
    levels: [
      {
        level: 1,
        name: 'Order Management',
        shortName: 'Orders',
        description: 'Establish core order processing with reliable payment handling (credit cards, digital wallets, BNPL), streamlined checkout flows that minimize abandonment, and basic order lifecycle management from placement through confirmation and delivery',
        businessModelDescriptions: {
          b2b: 'Establish B2B order processing with purchase orders, invoicing, and account-based checkout',
          b2c: 'Establish core order processing, payment handling, and consumer checkout optimization',
        },
        capabilities: ['order-management', 'payment-processing'],
        assessmentQuestions: [
          {
            id: 'order-management-current',
            question: 'What order management system is in use?',
            type: 'single-select',
            options: [
              'Commerce Cloud native order management',
              'Salesforce Order Management (OMS)',
              'Third-party OMS (Manhattan, Sterling, etc.)',
              'ERP-based order management',
              'Manual / spreadsheet-based',
              'No formal OMS',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'ERP-based order management',
                  'Salesforce Order Management (OMS)',
                  'B2B Commerce native ordering',
                  'Custom order processing',
                  'EDI-based ordering',
                  'Manual / phone-based ordering',
                ],
              },
            },
          },
          {
            id: 'payment-processing',
            question: 'How are payments processed?',
            type: 'multi-select',
            options: [
              'Salesforce Payments (Stripe-powered)',
              'Third-party gateway (Adyen, Cybersource, etc.)',
              'PayPal / digital wallets',
              'Buy Now Pay Later (Klarna, Afterpay, etc.)',
              'Apple Pay / Google Pay',
              'Store credit / gift cards',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                question: 'How are B2B payments and invoicing handled?',
                options: [
                  'Purchase orders / net terms',
                  'Credit card / ACH',
                  'Invoice-based billing',
                  'ERP-integrated payment processing',
                  'Credit limit management',
                  'Salesforce Billing',
                ],
              },
            },
          },
          {
            id: 'checkout-pain-points',
            question: 'What are the biggest checkout / order pain points?',
            type: 'multi-select',
            options: [
              'High cart abandonment at checkout',
              'Payment processing failures',
              'Limited payment options',
              'Slow or confusing checkout flow',
              'Guest checkout not supported',
              'No significant pain points',
            ],
            businessModelVariants: {
              b2b: {
                options: [
                  'Complex approval workflows slow ordering',
                  'Purchase order process is manual',
                  'No self-service reorder capability',
                  'Pricing discrepancies between systems',
                  'Credit / account setup delays',
                  'No significant pain points',
                ],
              },
            },
          },
        ],
      },
      {
        level: 2,
        name: 'Fulfillment & Inventory',
        shortName: 'Fulfillment',
        description: 'Deploy distributed order management — enable BOPIS, ship-from-store, curbside pickup, and intelligent order routing with real-time inventory visibility across all locations, reducing delivery times and maximizing fulfillment efficiency',
        businessModelDescriptions: {
          b2b: 'Deploy sophisticated B2B fulfillment with split shipments, scheduled delivery, and warehouse integration',
          b2c: 'Deploy distributed order management with BOPIS, ship-from-store, and real-time inventory visibility',
        },
        capabilities: ['distributed-fulfillment', 'inventory-management'],
        assessmentQuestions: [
          {
            id: 'fulfillment-capabilities',
            question: 'Which fulfillment capabilities exist or are needed?',
            type: 'multi-select',
            options: [
              'Ship from warehouse (standard)',
              'Ship from store',
              'Buy Online, Pick Up In Store (BOPIS)',
              'Curbside pickup',
              'Same-day / next-day delivery',
              'Drop ship from vendor',
              'International shipping',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Standard warehouse fulfillment',
                  'Split shipments across warehouses',
                  'Drop ship from manufacturer',
                  'Scheduled / recurring delivery',
                  'Will-call / pickup',
                  'International / cross-border shipping',
                  'White-glove / installation delivery',
                ],
              },
            },
          },
          {
            id: 'inventory-visibility',
            question: 'What is the state of inventory visibility?',
            type: 'single-select',
            options: [
              'No real-time inventory visibility',
              'Warehouse inventory only (batch updates)',
              'Near-real-time across warehouses',
              'Full visibility including store inventory',
              'Real-time across all locations and channels',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'No real-time inventory visibility',
                  'ERP inventory (batch sync)',
                  'Near-real-time warehouse inventory',
                  'Multi-warehouse with allocation rules',
                  'Real-time ATP (available to promise)',
                ],
              },
            },
          },
          {
            id: 'order-routing',
            question: 'How are orders routed to fulfillment locations?',
            type: 'single-select',
            options: [
              'Single fulfillment location — no routing needed',
              'Manual routing decisions',
              'Basic rules (closest warehouse)',
              'Intelligent routing (cost, speed, inventory)',
              'Salesforce OMS distributed routing',
            ],
            required: true,
          },
        ],
      },
      {
        level: 3,
        name: 'Advanced Commerce Ops',
        shortName: 'Advanced Ops',
        description: 'Activate advanced commerce operations — subscription/auto-replenishment models, marketplace and third-party seller enablement, intelligent returns management with instant exchanges, fraud prevention, and pre-order/backorder workflows',
        businessModelDescriptions: {
          b2b: 'Subscription / recurring orders, complex returns handling, and advanced B2B operational workflows',
          b2c: 'Subscription commerce, marketplace enablement, advanced returns, and fraud management',
        },
        capabilities: ['subscription-commerce', 'advanced-returns'],
        assessmentQuestions: [
          {
            id: 'subscription-commerce',
            question: 'Is subscription or recurring commerce relevant?',
            type: 'single-select',
            options: [
              'Yes, subscription / auto-replenishment is a priority',
              'Yes, but secondary to one-time purchases',
              'Exploring subscription models',
              'Not applicable to our business',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                question: 'Is recurring / contract-based ordering relevant?',
                options: [
                  'Yes, blanket POs and scheduled releases are core',
                  'Yes, auto-replenishment for consumables',
                  'Exploring recurring order models',
                  'Not applicable — one-time project orders',
                ],
              },
            },
          },
          {
            id: 'returns-current',
            question: 'How are returns and exchanges handled?',
            type: 'single-select',
            options: [
              'Manual / customer service-driven',
              'Basic self-service returns portal',
              'Integrated returns with inventory visibility',
              'Advanced returns (exchange, store credit, instant refund)',
              'Returns not applicable',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Manual / customer service-driven RMA',
                  'Basic RMA portal',
                  'Integrated RMA with restocking and credits',
                  'Advanced returns with warranty tracking',
                  'Returns not applicable',
                ],
              },
            },
          },
          {
            id: 'advanced-ops-priorities',
            question: 'Which advanced operational capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Fraud detection and prevention',
              'Marketplace / third-party seller enablement',
              'Subscription lifecycle management',
              'Pre-order / backorder management',
              'Sustainability / carbon-aware fulfillment',
              'Not a priority right now',
            ],
            businessModelVariants: {
              b2b: {
                options: [
                  'Complex approval workflow automation',
                  'Blanket PO / release management',
                  'Vendor-managed inventory (VMI)',
                  'Consignment inventory',
                  'Advanced credit management',
                  'Not a priority right now',
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // COMMERCE INTELLIGENCE TRACK
  // -------------------------------------------------------------------------
  {
    id: 'commerce-intelligence',
    name: 'Commerce Intelligence',
    shortName: 'Intelligence',
    description: 'Measure, optimize, and predict commerce performance — from foundational conversion tracking and KPI dashboards through systematic A/B testing and merchandising analytics to predictive models for demand forecasting, dynamic pricing, and customer lifetime value',
    icon: 'BarChart3',
    color: 'amber',
    journeyType: 'below-the-line',
    levels: [
      {
        level: 1,
        name: 'Commerce Analytics Foundation',
        shortName: 'Analytics',
        description: 'Establish core commerce analytics — conversion rate tracking, AOV and revenue-per-visitor monitoring, cart abandonment funnel analysis, CAC measurement, and revenue attribution dashboards that connect marketing spend to commerce outcomes',
        capabilities: ['commerce-analytics', 'conversion-tracking'],
        assessmentQuestions: [
          {
            id: 'analytics-current',
            question: 'What commerce analytics are in use today?',
            type: 'multi-select',
            options: [
              'Google Analytics / GA4',
              'Commerce Cloud native reports',
              'Marketing Cloud Intelligence / Datorama',
              'Tableau dashboards',
              'Power BI or Looker',
              'Custom data warehouse reporting',
              'Limited / ad-hoc reporting',
            ],
            required: true,
          },
          {
            id: 'kpi-tracking',
            question: 'Which commerce KPIs are actively tracked?',
            type: 'multi-select',
            options: [
              'Conversion rate',
              'Average order value (AOV)',
              'Revenue per visitor',
              'Cart abandonment rate',
              'Customer acquisition cost (CAC)',
              'Customer lifetime value (CLV)',
              'Return rate / return cost',
              'Limited or no KPI tracking',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Digital order volume vs. total orders',
                  'Average order value (AOV)',
                  'Reorder rate',
                  'Self-service adoption rate',
                  'Digital vs. rep-assisted orders',
                  'Account activation rate',
                  'Time to first digital order',
                  'Limited or no KPI tracking',
                ],
              },
            },
          },
          {
            id: 'analytics-gaps',
            question: 'What are the biggest analytics gaps?',
            type: 'multi-select',
            options: [
              'Cross-channel attribution',
              'Product-level profitability',
              'Customer journey analytics',
              'Real-time performance visibility',
              'Merchandising effectiveness',
              'Search analytics',
              'No significant gaps',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Optimization & Testing',
        shortName: 'Optimization',
        description: 'Deploy systematic A/B and multivariate testing, merchandising performance analytics (Einstein recommendation effectiveness, promotion ROI), checkout conversion optimization, and search relevance tuning — building a culture of data-driven commerce improvement',
        capabilities: ['ab-testing', 'merchandising-analytics'],
        assessmentQuestions: [
          {
            id: 'testing-maturity',
            question: 'What is the current testing and optimization practice?',
            type: 'single-select',
            options: [
              'No systematic testing',
              'Ad-hoc A/B tests occasionally',
              'Regular A/B testing program',
              'Multivariate testing with statistical rigor',
              'Continuous optimization with AI-assisted testing',
            ],
            required: true,
          },
          {
            id: 'optimization-focus',
            question: 'Which optimization areas are priorities?',
            type: 'multi-select',
            options: [
              'Checkout conversion optimization',
              'Search relevance and ranking',
              'Product page performance',
              'Promotion effectiveness',
              'Site speed and performance',
              'Mobile experience optimization',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Self-service adoption rate',
                  'Order workflow efficiency',
                  'Search and catalog findability',
                  'Pricing accuracy / sync',
                  'Buyer onboarding conversion',
                  'Reorder / quick order experience',
                ],
              },
            },
          },
          {
            id: 'merchandising-analytics',
            question: 'How is merchandising performance measured?',
            type: 'single-select',
            options: [
              'Not measured systematically',
              'Basic sell-through and inventory reports',
              'Category and product performance dashboards',
              'Einstein recommendation performance tracked',
              'Full merchandising analytics with margin optimization',
            ],
            businessModelVariants: {
              b2b: {
                question: 'How is catalog and product performance measured?',
                options: [
                  'Not measured systematically',
                  'Basic order volume by product',
                  'Account-level product adoption tracking',
                  'Cross-sell / attachment rate analytics',
                  'Full product performance with margin analysis',
                ],
              },
            },
          },
        ],
      },
      {
        level: 3,
        name: 'Predictive Commerce',
        shortName: 'Predictive',
        description: 'Implement predictive commerce capabilities — demand forecasting for inventory optimization, dynamic pricing models, customer lifetime value prediction, churn risk scoring, and next-product-to-buy recommendations that drive proactive merchandising and personalization decisions',
        capabilities: ['demand-forecasting', 'dynamic-pricing', 'commerce-clv'],
        assessmentQuestions: [
          {
            id: 'predictive-priorities',
            question: 'Which predictive capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Demand forecasting / inventory optimization',
              'Dynamic pricing optimization',
              'Customer lifetime value prediction',
              'Churn / lapse prediction',
              'Next product to buy prediction',
              'Personalized promotion optimization',
              'Not considering predictive capabilities yet',
            ],
            required: true,
            businessModelVariants: {
              b2b: {
                options: [
                  'Demand forecasting for key accounts',
                  'Account health / churn prediction',
                  'Account lifetime value prediction',
                  'Next product to buy / cross-sell prediction',
                  'Inventory optimization per account',
                  'Price sensitivity modeling',
                  'Not considering predictive capabilities yet',
                ],
              },
            },
          },
          {
            id: 'data-science-commerce',
            question: 'What data science capability exists for commerce?',
            type: 'single-select',
            options: [
              'In-house data science team',
              'Central analytics team (some DS)',
              'Agency partner provides modeling',
              'Einstein built-in features only',
              'Limited / no data science capability',
            ],
            required: true,
          },
          {
            id: 'commerce-data-depth',
            question: 'How much historical commerce data is available for modeling?',
            type: 'single-select',
            options: [
              '3+ years of transaction data',
              '1-3 years of data',
              'Less than 1 year',
              'Limited / inconsistent history',
            ],
            required: true,
          },
        ],
      },
    ],
  },
];

// ============================================================================
// COMMERCE TRACK DEPENDENCIES
// ============================================================================

export const COMMERCE_TRACK_DEPENDENCIES: CommerceTrackDependency[] = [
  // Platform L1 is required for all other L1s
  {
    fromTrack: 'commerce-platform',
    fromLevel: 1,
    toTrack: 'shopping-experience',
    toLevel: 1,
    type: 'required',
    description: 'Platform foundation required before optimizing shopping experience',
  },
  {
    fromTrack: 'commerce-platform',
    fromLevel: 1,
    toTrack: 'order-fulfillment',
    toLevel: 1,
    type: 'required',
    description: 'Platform foundation required before order management',
  },
  {
    fromTrack: 'commerce-platform',
    fromLevel: 1,
    toTrack: 'commerce-intelligence',
    toLevel: 1,
    type: 'required',
    description: 'Platform foundation required before analytics implementation',
  },

  // Platform L2 (architecture) required for advanced features
  {
    fromTrack: 'commerce-platform',
    fromLevel: 2,
    toTrack: 'commerce-platform',
    toLevel: 3,
    type: 'required',
    description: 'Architecture maturity required for composable / multi-site',
  },
  {
    fromTrack: 'commerce-platform',
    fromLevel: 2,
    toTrack: 'shopping-experience',
    toLevel: 2,
    type: 'recommended',
    description: 'API strategy enhances personalization capabilities',
  },

  // Shopping Experience progression
  {
    fromTrack: 'shopping-experience',
    fromLevel: 2,
    toTrack: 'shopping-experience',
    toLevel: 3,
    type: 'required',
    description: 'Personalization foundation required for advanced experiences',
  },

  // Order & Fulfillment progression
  {
    fromTrack: 'order-fulfillment',
    fromLevel: 1,
    toTrack: 'order-fulfillment',
    toLevel: 2,
    type: 'required',
    description: 'Core order management required before distributed fulfillment',
  },
  {
    fromTrack: 'order-fulfillment',
    fromLevel: 2,
    toTrack: 'order-fulfillment',
    toLevel: 3,
    type: 'required',
    description: 'Fulfillment foundation required for advanced commerce operations',
  },

  // Intelligence progression
  {
    fromTrack: 'commerce-intelligence',
    fromLevel: 2,
    toTrack: 'commerce-intelligence',
    toLevel: 3,
    type: 'required',
    description: 'Optimization practice required before predictive capabilities',
  },

  // Cross-track dependencies
  {
    fromTrack: 'order-fulfillment',
    fromLevel: 1,
    toTrack: 'commerce-intelligence',
    toLevel: 2,
    type: 'recommended',
    description: 'Order data enriches optimization analytics',
  },
  {
    fromTrack: 'shopping-experience',
    fromLevel: 1,
    toTrack: 'commerce-intelligence',
    toLevel: 2,
    type: 'recommended',
    description: 'Catalog and search data needed for merchandising analytics',
  },
  {
    fromTrack: 'commerce-intelligence',
    fromLevel: 2,
    toTrack: 'shopping-experience',
    toLevel: 3,
    type: 'recommended',
    description: 'Optimization insights inform advanced experience decisions',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getCommerceTrackById(trackId: CommerceTrackId): CommerceTrack | undefined {
  return COMMERCE_TRACKS.find((t) => t.id === trackId);
}

export function getCommerceTrackLevel(
  trackId: CommerceTrackId,
  level: CommerceTrackLevel
): CommerceTrackLevelDefinition | undefined {
  const track = getCommerceTrackById(trackId);
  return track?.levels.find((l) => l.level === level);
}

export function getCommerceDependenciesForLevel(
  trackId: CommerceTrackId,
  level: CommerceTrackLevel
): CommerceTrackDependency[] {
  return COMMERCE_TRACK_DEPENDENCIES.filter((d) => d.toTrack === trackId && d.toLevel === level);
}

export function getCommerceRequiredDependencies(
  trackId: CommerceTrackId,
  level: CommerceTrackLevel
): CommerceTrackDependency[] {
  return getCommerceDependenciesForLevel(trackId, level).filter((d) => d.type === 'required');
}

export function getCommerceRecommendedDependencies(
  trackId: CommerceTrackId,
  level: CommerceTrackLevel
): CommerceTrackDependency[] {
  return getCommerceDependenciesForLevel(trackId, level).filter((d) => d.type === 'recommended');
}

export function getCommerceCapabilitiesForTrack(trackId: CommerceTrackId): string[] {
  const track = getCommerceTrackById(trackId);
  if (!track) return [];
  return track.levels.flatMap((l) => l.capabilities);
}

export function getCommerceCapabilitiesForTrackLevel(
  trackId: CommerceTrackId,
  level: CommerceTrackLevel
): string[] {
  const trackLevel = getCommerceTrackLevel(trackId, level);
  return trackLevel?.capabilities || [];
}

export function getCommerceAssessmentOrder(): CommerceTrackId[] {
  return ['commerce-platform', 'shopping-experience', 'order-fulfillment', 'commerce-intelligence'];
}

export function canStartCommerceLevel(
  trackId: CommerceTrackId,
  level: CommerceTrackLevel,
  completedLevels: Set<string>
): { canStart: boolean; blockedBy: CommerceTrackDependency[] } {
  const requiredDeps = getCommerceRequiredDependencies(trackId, level);
  const blockedBy: CommerceTrackDependency[] = [];

  for (const dep of requiredDeps) {
    const depKey = `${dep.fromTrack}-${dep.fromLevel}`;
    if (!completedLevels.has(depKey)) {
      blockedBy.push(dep);
    }
  }

  return {
    canStart: blockedBy.length === 0,
    blockedBy,
  };
}
