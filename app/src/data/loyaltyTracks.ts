/**
 * Loyalty Management Track-Based Maturity Model
 *
 * Organizes Salesforce Loyalty Management capabilities into 4 progression tracks,
 * each with 3 levels. This mirrors the Messaging & Personalization model structure
 * to enable consistent cross-discipline assessments.
 */

import type { IndustryType } from '../types';

// ============================================================================
// LOYALTY-SPECIFIC TYPES
// ============================================================================

export type LoyaltyTrackId =
  | 'program-foundation'
  | 'member-engagement'
  | 'rewards-offers'
  | 'loyalty-intelligence';

export type LoyaltyTrackLevel = 1 | 2 | 3;

export type LoyaltyTrackLevelStatus = 'not-started' | 'in-progress' | 'complete';

export interface LoyaltyTrackAssessmentQuestion {
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
}

export interface LoyaltyTrackLevelDefinition {
  level: LoyaltyTrackLevel;
  name: string;
  shortName: string;
  description: string;
  descriptionVariants?: Partial<Record<IndustryType, string>>;
  capabilities: string[]; // Loyalty capability IDs
  assessmentQuestions: LoyaltyTrackAssessmentQuestion[];
}

export interface LoyaltyTrack {
  id: LoyaltyTrackId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  journeyType: 'above-the-line' | 'below-the-line';
  levels: LoyaltyTrackLevelDefinition[];
}

export interface LoyaltyTrackDependency {
  fromTrack: LoyaltyTrackId;
  fromLevel: LoyaltyTrackLevel;
  toTrack: LoyaltyTrackId;
  toLevel: LoyaltyTrackLevel;
  type: 'required' | 'recommended';
  description: string;
}

// ============================================================================
// LOYALTY TRACK DEFINITIONS
// ============================================================================

export const LOYALTY_TRACKS: LoyaltyTrack[] = [
  // -------------------------------------------------------------------------
  // PROGRAM FOUNDATION TRACK
  // -------------------------------------------------------------------------
  {
    id: 'program-foundation',
    name: 'Program Foundation',
    shortName: 'Foundation',
    description: 'Build the Salesforce Loyalty Management foundation — from initial program setup and member enrollment through multi-tier architecture, currency management, and advanced coalition/multi-brand program structures',
    icon: 'Building2',
    color: 'blue',
    journeyType: 'below-the-line',
    levels: [
      {
        level: 1,
        name: 'Program Setup',
        shortName: 'Setup',
        description: 'Deploy Salesforce Loyalty Management with core program configuration, member enrollment flows across all channels (web, app, in-store, POS), integration with CRM and marketing systems, and the foundational data model that supports future program expansion',
        descriptionVariants: {
          'retail-cpg-qsr': 'Stand up Salesforce Loyalty Management integrated with commerce and POS for unified retail loyalty',
          'financial-services': 'Stand up Salesforce Loyalty Management for banking rewards or credit card loyalty programs',
          'travel-hospitality': 'Stand up Salesforce Loyalty Management for hotel, airline, or travel loyalty programs',
        },
        capabilities: ['loyalty-program-setup', 'member-data-model'],
        assessmentQuestions: [
          {
            id: 'current-loyalty-platform',
            question: 'What is the current loyalty platform situation?',
            type: 'single-select',
            options: [
              'No loyalty program exists',
              'Basic loyalty via custom development',
              'Third-party loyalty platform',
              'Salesforce Loyalty Management deployed',
              'In migration process to Salesforce',
            ],
            required: true,
          },
          {
            id: 'program-type',
            question: 'What type of loyalty program is planned or exists?',
            type: 'single-select',
            options: [
              'Points-based program',
              'Tier-based program',
              'Paid/subscription loyalty',
              'Coalition program (multi-brand)',
              'Hybrid (points + tiers)',
              'Not yet determined',
            ],
            required: true,
          },
          {
            id: 'member-enrollment-channels',
            question: 'Which channels will be used for member enrollment?',
            type: 'multi-select',
            options: [
              'Website',
              'Mobile app',
              'In-store / POS',
              'Call center',
              'Partner channels',
              'Social media',
            ],
            helpText: 'Select all that apply',
            industryVariants: {
              'retail-cpg-qsr': {
                options: [
                  'E-commerce website',
                  'Mobile app',
                  'In-store / POS',
                  'Call center',
                  'QSR kiosk',
                  'Social media',
                ],
              },
              'travel-hospitality': {
                options: [
                  'Booking website',
                  'Mobile app',
                  'At property / check-in',
                  'Call center / reservation',
                  'Travel partners (OTAs)',
                  'Airport / in-flight',
                ],
              },
              'financial-services': {
                options: [
                  'Digital banking',
                  'Mobile app',
                  'Branch',
                  'Call center',
                  'Card application flow',
                  'Partner channels',
                ],
              },
            },
          },
          {
            id: 'integration-scope',
            question: 'What systems need to integrate with the loyalty platform?',
            type: 'multi-select',
            options: [
              'CRM / Customer data',
              'E-commerce platform',
              'POS system',
              'Mobile app',
              'Marketing automation',
              'Data warehouse / analytics',
            ],
            required: true,
            industryVariants: {
              'retail-cpg-qsr': {
                options: [
                  'Sales Cloud / CRM',
                  'Commerce Cloud',
                  'POS systems',
                  'Mobile app',
                  'Marketing Cloud',
                  'Inventory management',
                  'Data Cloud',
                ],
              },
              'travel-hospitality': {
                options: [
                  'CRS / reservation system',
                  'PMS / property management',
                  'Mobile app',
                  'Marketing Cloud',
                  'Revenue management',
                  'Partner systems (OTAs)',
                  'Data Cloud',
                ],
              },
              'financial-services': {
                options: [
                  'Core banking system',
                  'Card management system',
                  'Digital banking platform',
                  'Mobile app',
                  'Marketing Cloud',
                  'Data warehouse',
                  'Data Cloud',
                ],
              },
            },
          },
        ],
      },
      {
        level: 2,
        name: 'Tier & Currency Architecture',
        shortName: 'Tiers & Currency',
        description: 'Design and implement sophisticated tier structures with clear progression paths, multiple currency types (points, status credits, bonus currencies), and flexible earning/redemption rules that drive the right member behaviors and program economics',
        descriptionVariants: {
          'retail-cpg-qsr': 'Implement spend-based tiers and flexible points currencies for retail loyalty',
          'financial-services': 'Implement card-tier integration and flexible rewards currencies',
          'travel-hospitality': 'Implement elite tiers, points + status currencies, and partner earning',
        },
        capabilities: ['tier-management', 'currency-management', 'earning-rules'],
        assessmentQuestions: [
          {
            id: 'tier-structure',
            question: 'What tier structure is planned or exists?',
            type: 'single-select',
            options: [
              'No tiers - flat program',
              'Simple 2-3 tiers (basic/premium)',
              '4+ tiers with clear progression',
              'Dynamic tiers based on behavior',
              'Paid tier + earned tiers',
            ],
            required: true,
            industryVariants: {
              'travel-hospitality': {
                options: [
                  'No tiers - flat program',
                  'Simple 2-3 tiers (Member/Gold/Platinum)',
                  '4+ tiers with status matching',
                  'Lifetime status tiers',
                  'Paid elite access + earned tiers',
                ],
              },
            },
          },
          {
            id: 'currency-types',
            question: 'What loyalty currency types are needed?',
            type: 'multi-select',
            options: [
              'Points (primary currency)',
              'Status/qualifying points',
              'Bonus/promotional points',
              'Partner currencies',
              'Cash-back / credits',
              'Experience credits',
            ],
            required: true,
          },
          {
            id: 'earning-complexity',
            question: 'How complex are the earning rules?',
            type: 'single-select',
            options: [
              'Simple - flat rate on spend',
              'Category-based earning rates',
              'Tier-multiplied earning',
              'Behavior-based bonuses',
              'Dynamic/personalized earning',
            ],
            required: true,
          },
          {
            id: 'tier-qualification',
            question: 'How do members qualify for tiers?',
            type: 'multi-select',
            options: [
              'Annual spend threshold',
              'Points accumulated',
              'Transaction frequency',
              'Engagement activities',
              'Paid subscription',
              'Combination of factors',
            ],
            industryVariants: {
              'travel-hospitality': {
                options: [
                  'Nights / stays',
                  'Qualifying points / miles',
                  'Segments flown',
                  'Spend threshold',
                  'Elite qualifying credits',
                  'Paid fast-track',
                ],
              },
            },
          },
        ],
      },
      {
        level: 3,
        name: 'Advanced Program Architecture',
        shortName: 'Advanced',
        description: 'Architect advanced multi-brand loyalty programs, coalition partnerships with external earn/burn capabilities, and a sophisticated rules engine that supports real-time decisioning, A/B testing of program mechanics, and ML-optimized rules',
        descriptionVariants: {
          'retail-cpg-qsr': 'Implement multi-brand loyalty, franchise programs, and CPG partner integrations',
          'travel-hospitality': 'Implement alliance partnerships, hotel portfolio programs, and partner earning/burning',
        },
        capabilities: ['multi-brand-loyalty', 'coalition-programs', 'advanced-rules-engine'],
        assessmentQuestions: [
          {
            id: 'multi-brand-needs',
            question: 'Are multi-brand or coalition capabilities needed?',
            type: 'single-select',
            options: [
              'Single brand only',
              'Multiple brands, shared program',
              'Multiple brands, separate programs with transfers',
              'Coalition with external partners',
              'Franchise/dealer network program',
            ],
            required: true,
          },
          {
            id: 'partner-program-scope',
            question: 'What partner program capabilities are needed?',
            type: 'multi-select',
            options: [
              'Partner earning (earn points at partners)',
              'Partner redemption (redeem at partners)',
              'Points transfer to partners',
              'Points pooling (household/business)',
              'B2B partner programs',
              'White-label loyalty for partners',
            ],
          },
          {
            id: 'rules-complexity',
            question: 'What advanced rules capabilities are needed?',
            type: 'multi-select',
            options: [
              'Time-based promotions',
              'Location-based rules',
              'Segment-specific rules',
              'Real-time decisioning',
              'A/B testing of rules',
              'Machine learning optimization',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // MEMBER ENGAGEMENT TRACK
  // -------------------------------------------------------------------------
  {
    id: 'member-engagement',
    name: 'Member Engagement',
    shortName: 'Engagement',
    description: 'Create compelling member experiences — from core profile management and self-service portals through gamification mechanics (challenges, badges, streaks) to fully personalized, AI-driven loyalty journeys that adapt to individual member behavior',
    icon: 'Users',
    color: 'violet',
    journeyType: 'above-the-line',
    levels: [
      {
        level: 1,
        name: 'Member Administration',
        shortName: 'Admin',
        description: 'Establish core member management capabilities — member profiles with preference capture, self-service account management (balance, history, tier status), and multi-channel service integration so members can get support wherever they engage',
        capabilities: ['member-administration', 'member-portal'],
        assessmentQuestions: [
          {
            id: 'member-profile-data',
            question: 'What member data is captured and maintained?',
            type: 'multi-select',
            options: [
              'Basic contact info only',
              'Demographics',
              'Preferences and interests',
              'Communication preferences',
              'Household/family data',
              'Behavioral data',
            ],
            required: true,
          },
          {
            id: 'self-service-capabilities',
            question: 'What member self-service capabilities exist or are needed?',
            type: 'multi-select',
            options: [
              'View points balance',
              'View transaction history',
              'Update profile/preferences',
              'Redeem rewards',
              'View tier status/progress',
              'Manage household members',
              'Link payment methods',
            ],
            required: true,
          },
          {
            id: 'member-service-channels',
            question: 'How do members get support for loyalty issues?',
            type: 'multi-select',
            options: [
              'Call center (dedicated)',
              'Call center (general customer service)',
              'Email support',
              'Chat / messaging',
              'In-app support',
              'Social media',
              'In-store assistance',
            ],
          },
          {
            id: 'member-experience-pain-points',
            question: 'What are the biggest member experience pain points?',
            type: 'multi-select',
            options: [
              'Enrollment friction',
              'Can\'t see real-time balance',
              'Redemption is difficult',
              'Poor visibility into tier progress',
              'Inconsistent across channels',
              'Service issues take too long',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Engagement & Gamification',
        shortName: 'Gamification',
        description: 'Layer in gamification mechanics — challenges, missions, badges, achievement streaks, and surprise-and-delight moments — that drive incremental engagement beyond transactions and turn passive members into active program participants',
        descriptionVariants: {
          'retail-cpg-qsr': 'Add challenges, streaks, badges, and gamified promotions to drive repeat purchases',
          'travel-hospitality': 'Add stay challenges, milestone celebrations, and gamified elite qualification',
        },
        capabilities: ['gamification', 'challenges-missions', 'badges-achievements'],
        assessmentQuestions: [
          {
            id: 'current-gamification',
            question: 'What gamification elements exist today?',
            type: 'multi-select',
            options: [
              'None - basic points only',
              'Badges or achievements',
              'Challenges or missions',
              'Streaks (consecutive activity)',
              'Progress bars / goals',
              'Leaderboards',
              'Surprise & delight moments',
            ],
            required: true,
          },
          {
            id: 'gamification-priorities',
            question: 'Which gamification capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Onboarding challenges',
              'Purchase-based challenges',
              'Engagement challenges (non-purchase)',
              'Seasonal/promotional challenges',
              'Social challenges (referrals)',
              'Milestone celebrations',
              'Personalized challenges',
            ],
            required: true,
          },
          {
            id: 'engagement-channels',
            question: 'Where should gamification experiences appear?',
            type: 'multi-select',
            options: [
              'Mobile app',
              'Website',
              'Email communications',
              'In-store displays',
              'Push notifications',
              'SMS',
            ],
          },
          {
            id: 'gamification-measurement',
            question: 'How will gamification success be measured?',
            type: 'multi-select',
            options: [
              'Challenge completion rates',
              'Engagement frequency',
              'Purchase behavior changes',
              'App usage metrics',
              'Member satisfaction scores',
              'Not yet defined',
            ],
          },
        ],
      },
      {
        level: 3,
        name: 'Personalized Member Journeys',
        shortName: 'Personalized',
        description: 'Deliver hyper-personalized loyalty experiences powered by real-time behavioral signals and AI — contextual offers based on location and time, predictive next-best-action recommendations, and dynamic tier benefits that adapt to each member\'s value and engagement pattern',
        descriptionVariants: {
          'retail-cpg-qsr': 'Deliver personalized offers, recommendations, and experiences based on purchase behavior',
          'travel-hospitality': 'Deliver personalized trip recommendations, room preferences, and elite recognition',
        },
        capabilities: ['personalized-loyalty', 'contextual-engagement', 'loyalty-journeys'],
        assessmentQuestions: [
          {
            id: 'personalization-current',
            question: 'What level of loyalty personalization exists today?',
            type: 'single-select',
            options: [
              'None - same experience for all members',
              'Tier-based differentiation only',
              'Segment-based personalization',
              'Some behavioral personalization',
              'Advanced real-time personalization',
            ],
            required: true,
          },
          {
            id: 'personalization-priorities',
            question: 'Which personalization capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Personalized offers based on behavior',
              'Personalized redemption recommendations',
              'Dynamic tier benefits',
              'Contextual engagement (location, time)',
              'Predictive next-best-action',
              'Personalized challenges/gamification',
            ],
            required: true,
          },
          {
            id: 'data-for-personalization',
            question: 'What data is available to power personalization?',
            type: 'multi-select',
            options: [
              'Transaction/purchase history',
              'Browse/consideration behavior',
              'Engagement activity',
              'Preferences (explicit)',
              'Location data',
              'Third-party enrichment',
              'Real-time behavioral signals',
            ],
          },
          {
            id: 'ai-readiness',
            question: 'What is the readiness for AI-powered loyalty?',
            type: 'single-select',
            options: [
              'Not considering AI yet',
              'Interested but need foundation first',
              'Ready to pilot AI capabilities',
              'Already using some AI/ML',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // REWARDS & OFFERS TRACK
  // -------------------------------------------------------------------------
  {
    id: 'rewards-offers',
    name: 'Rewards & Offers',
    shortName: 'Rewards',
    description: 'Evolve reward mechanics from basic earn-and-burn points to dynamic, targeted offers, partner reward networks, and experiential redemptions — optimizing program economics while increasing perceived member value',
    icon: 'Gift',
    color: 'emerald',
    journeyType: 'above-the-line',
    levels: [
      {
        level: 1,
        name: 'Accruals & Redemptions',
        shortName: 'Earn & Burn',
        description: 'Implement foundational earn-and-burn mechanics — define accrual rules (points per dollar, category bonuses, non-purchase earning), build the rewards catalog, and deploy redemption workflows across web, app, and POS channels',
        capabilities: ['accruals-management', 'redemptions-management', 'rewards-catalog'],
        assessmentQuestions: [
          {
            id: 'earning-mechanics',
            question: 'What earning mechanics exist or are planned?',
            type: 'multi-select',
            options: [
              'Points per dollar spent',
              'Points per transaction',
              'Category/product bonuses',
              'Promotional bonus points',
              'Non-purchase earning (engagement)',
              'Partner earning',
            ],
            required: true,
          },
          {
            id: 'redemption-types',
            question: 'What redemption options exist or are planned?',
            type: 'multi-select',
            options: [
              'Discounts / money off',
              'Free products',
              'Gift cards',
              'Merchandise catalog',
              'Experience rewards',
              'Charity donations',
              'Partner rewards',
            ],
            required: true,
            industryVariants: {
              'travel-hospitality': {
                options: [
                  'Free nights / flights',
                  'Room upgrades',
                  'Experience rewards',
                  'Partner transfers',
                  'Merchandise catalog',
                  'Charity donations',
                  'Cash back / statement credit',
                ],
              },
            },
          },
          {
            id: 'redemption-channels',
            question: 'Where can members redeem rewards?',
            type: 'multi-select',
            options: [
              'Website',
              'Mobile app',
              'At POS / checkout',
              'Call center',
              'Partner locations',
            ],
            required: true,
          },
          {
            id: 'redemption-friction',
            question: 'What are the main redemption pain points?',
            type: 'multi-select',
            options: [
              'Too many points required',
              'Limited reward options',
              'Redemption process is complex',
              'Can\'t redeem at point of sale',
              'Reward availability issues',
              'No significant pain points',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Dynamic Offers & Promotions',
        shortName: 'Offers',
        description: 'Deploy targeted promotional capabilities — segment-based and behavioral offers, bonus points campaigns, tier acceleration promotions, and personalized incentives with sophisticated stacking rules, A/B testing, and offer funding management',
        descriptionVariants: {
          'retail-cpg-qsr': 'Implement personalized offers, dynamic promotions, and CPG-funded offers',
          'financial-services': 'Implement card-linked offers, merchant-funded promotions, and personalized rewards',
        },
        capabilities: ['offer-management', 'promotion-management', 'targeted-offers'],
        assessmentQuestions: [
          {
            id: 'current-offers',
            question: 'What promotional capabilities exist today?',
            type: 'multi-select',
            options: [
              'Mass promotions only',
              'Segment-targeted offers',
              'Triggered/behavioral offers',
              'Personalized offers',
              'Location-based offers',
              'Limited or no promotions',
            ],
            required: true,
          },
          {
            id: 'offer-types-needed',
            question: 'What offer types are priorities?',
            type: 'multi-select',
            options: [
              'Bonus points promotions',
              'Discount/coupon offers',
              'Buy X get Y offers',
              'Tier acceleration offers',
              'Partner/co-branded offers',
              'Personalized offers',
              'Surprise & delight offers',
            ],
            required: true,
          },
          {
            id: 'offer-targeting',
            question: 'How sophisticated should offer targeting be?',
            type: 'single-select',
            options: [
              'Mass / all members',
              'Tier-based targeting',
              'Segment-based targeting',
              'Behavioral/predictive targeting',
              'Real-time contextual targeting',
            ],
            required: true,
          },
          {
            id: 'offer-funding',
            question: 'Who funds promotional offers?',
            type: 'multi-select',
            options: [
              'Company funded only',
              'Vendor/supplier funded',
              'Partner funded',
              'Co-funded arrangements',
              'Not applicable',
            ],
            industryVariants: {
              'retail-cpg-qsr': {
                options: [
                  'Retailer funded',
                  'CPG/brand funded',
                  'Co-funded (trade)',
                  'Franchisee funded',
                  'Partner funded',
                ],
              },
            },
          },
        ],
      },
      {
        level: 3,
        name: 'Partner Ecosystem & Experiential',
        shortName: 'Partners',
        description: 'Build partner reward networks with cross-brand earn/burn, experiential rewards (VIP access, events, unique experiences), referral programs, and advanced redemption capabilities that extend program value beyond your own properties',
        descriptionVariants: {
          'travel-hospitality': 'Build airline/hotel partnerships, transfer partners, and unique experience rewards',
          'retail-cpg-qsr': 'Build CPG partnerships, coalition earning/burning, and lifestyle rewards',
        },
        capabilities: ['partner-management', 'experiential-rewards', 'coalition-rewards'],
        assessmentQuestions: [
          {
            id: 'partner-scope',
            question: 'What partner reward capabilities are needed?',
            type: 'multi-select',
            options: [
              'Earn points at partners',
              'Redeem points at partners',
              'Transfer points to partners',
              'Partner-funded offers',
              'White-label loyalty for partners',
              'No partner program planned',
            ],
            required: true,
          },
          {
            id: 'experiential-rewards',
            question: 'What experiential reward types are priorities?',
            type: 'multi-select',
            options: [
              'Exclusive access / events',
              'Meet & greets / VIP experiences',
              'Travel experiences',
              'Wellness / lifestyle experiences',
              'Charity / social impact',
              'Personalized/custom experiences',
              'Not a priority',
            ],
          },
          {
            id: 'partner-technical',
            question: 'What technical capabilities are needed for partners?',
            type: 'multi-select',
            options: [
              'Real-time point transfer APIs',
              'Partner portal for management',
              'Automated settlement/reconciliation',
              'Partner analytics/reporting',
              'Fraud prevention for partners',
            ],
          },
          {
            id: 'referral-program',
            question: 'Is a member referral program part of the strategy?',
            type: 'single-select',
            options: [
              'Yes, high priority',
              'Yes, moderate priority',
              'Under consideration',
              'Not planned',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // LOYALTY INTELLIGENCE TRACK
  // -------------------------------------------------------------------------
  {
    id: 'loyalty-intelligence',
    name: 'Loyalty Intelligence',
    shortName: 'Intelligence',
    description: 'Evolve loyalty measurement from basic program reporting to advanced member analytics, financial modeling, and predictive intelligence — enabling data-driven decisions about program design, offer strategy, and member investment',
    icon: 'BarChart3',
    color: 'amber',
    journeyType: 'below-the-line',
    levels: [
      {
        level: 1,
        name: 'Reporting Foundation',
        shortName: 'Reporting',
        description: 'Establish core loyalty dashboards covering enrollment rates, active member counts, redemption rates, points liability, tier progression, and engagement scores — creating the visibility needed to prove program ROI and optimize performance',
        capabilities: ['loyalty-reporting', 'program-dashboards'],
        assessmentQuestions: [
          {
            id: 'current-reporting',
            question: 'What loyalty reporting exists today?',
            type: 'multi-select',
            options: [
              'Native Loyalty Management reports',
              'CRM Analytics / Tableau CRM',
              'Tableau dashboards',
              'Power BI or similar',
              'Custom data warehouse reporting',
              'Limited / ad-hoc reporting',
            ],
            required: true,
          },
          {
            id: 'key-metrics',
            question: 'Which loyalty metrics are most important to track?',
            type: 'multi-select',
            options: [
              'Active member count / growth',
              'Enrollment rates',
              'Redemption rates',
              'Points liability',
              'Member lifetime value',
              'Program ROI',
              'Tier progression',
              'Engagement scores',
            ],
            required: true,
          },
          {
            id: 'reporting-gaps',
            question: 'What are the biggest analytics gaps?',
            type: 'multi-select',
            options: [
              'Real-time visibility',
              'Member-level analytics',
              'Program financial metrics',
              'Cross-channel attribution',
              'Self-service reporting',
              'Executive dashboards',
            ],
          },
          {
            id: 'analytics-owner',
            question: 'Who is responsible for loyalty analytics?',
            type: 'single-select',
            options: [
              'Dedicated loyalty analytics team',
              'Marketing analytics team',
              'Central BI / data team',
              'Loyalty program manager',
              'No dedicated resource',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Advanced Analytics',
        shortName: 'Analytics',
        description: 'Deploy advanced member value analysis, enrollment cohort analytics, promotion effectiveness measurement, breakage forecasting, and program P&L modeling — turning loyalty data into actionable financial and strategic insights',
        capabilities: ['member-analytics', 'cohort-analysis', 'financial-analytics'],
        assessmentQuestions: [
          {
            id: 'member-value-scoring',
            question: 'How is member value currently measured?',
            type: 'single-select',
            options: [
              'Not measured',
              'Spend-based tiers only',
              'Basic RFM segmentation',
              'Custom value scoring',
              'Predictive lifetime value',
            ],
            required: true,
          },
          {
            id: 'analytics-use-cases',
            question: 'Which analytics use cases are priorities?',
            type: 'multi-select',
            options: [
              'Member segmentation',
              'Cohort analysis',
              'Promotion effectiveness',
              'Redemption pattern analysis',
              'Breakage forecasting',
              'Program cost modeling',
              'A/B test analysis',
            ],
            required: true,
          },
          {
            id: 'financial-metrics',
            question: 'What financial analytics are needed?',
            type: 'multi-select',
            options: [
              'Points liability tracking',
              'Breakage estimation',
              'Cost per point analysis',
              'Program P&L',
              'ROI by member segment',
              'Partner economics',
            ],
          },
          {
            id: 'data-science-capability',
            question: 'What data science capability exists?',
            type: 'single-select',
            options: [
              'In-house data science team',
              'Central analytics team (some DS)',
              'Agency partner provides modeling',
              'Limited / no data science capability',
            ],
          },
        ],
      },
      {
        level: 3,
        name: 'Predictive Loyalty',
        shortName: 'Predictive',
        description: 'Implement predictive loyalty models — churn/lapse prediction to intervene before members disengage, next-best-reward recommendations, offer response propensity scoring, and predictive member CLV to drive value-based program decisions',
        capabilities: ['churn-prediction', 'next-best-reward', 'loyalty-clv'],
        assessmentQuestions: [
          {
            id: 'predictive-priorities',
            question: 'Which predictive capabilities are priorities?',
            type: 'multi-select',
            options: [
              'Churn/lapse prediction',
              'Engagement propensity',
              'Next-best-reward recommendations',
              'Tier progression likelihood',
              'Offer response propensity',
              'Member lifetime value (predictive)',
            ],
            required: true,
          },
          {
            id: 'churn-current',
            question: 'How is member churn/lapse currently handled?',
            type: 'single-select',
            options: [
              'No churn monitoring',
              'Basic inactivity rules',
              'Segment-based win-back',
              'Some predictive modeling',
              'Advanced churn intervention',
            ],
            required: true,
          },
          {
            id: 'clv-approach',
            question: 'What is the approach to member lifetime value?',
            type: 'single-select',
            options: [
              'Not calculated',
              'Historical value only',
              'Basic predictive CLV',
              'Advanced CLV modeling',
              'CLV drives all decisions',
            ],
            required: true,
          },
          {
            id: 'ai-ml-readiness',
            question: 'What is the readiness for AI/ML in loyalty?',
            type: 'single-select',
            options: [
              'Not considering AI/ML',
              'Interested but need foundation',
              'Ready to implement',
              'Already using AI/ML',
            ],
          },
        ],
      },
    ],
  },
];

// ============================================================================
// CROSS-TRACK DEPENDENCIES
// ============================================================================

export const LOYALTY_TRACK_DEPENDENCIES: LoyaltyTrackDependency[] = [
  // Program Foundation L1 is required for everything
  {
    fromTrack: 'program-foundation',
    fromLevel: 1,
    toTrack: 'member-engagement',
    toLevel: 1,
    type: 'required',
    description: 'Program setup required before member administration',
  },
  {
    fromTrack: 'program-foundation',
    fromLevel: 1,
    toTrack: 'rewards-offers',
    toLevel: 1,
    type: 'required',
    description: 'Program setup required before accruals and redemptions',
  },
  {
    fromTrack: 'program-foundation',
    fromLevel: 1,
    toTrack: 'loyalty-intelligence',
    toLevel: 1,
    type: 'required',
    description: 'Program setup required before reporting',
  },

  // Tier & Currency (L2) required for advanced engagement and offers
  {
    fromTrack: 'program-foundation',
    fromLevel: 2,
    toTrack: 'member-engagement',
    toLevel: 2,
    type: 'recommended',
    description: 'Tier structure enhances gamification capabilities',
  },
  {
    fromTrack: 'program-foundation',
    fromLevel: 2,
    toTrack: 'rewards-offers',
    toLevel: 2,
    type: 'required',
    description: 'Currency architecture required for dynamic offers',
  },

  // Member Engagement L2 recommended for personalization
  {
    fromTrack: 'member-engagement',
    fromLevel: 2,
    toTrack: 'member-engagement',
    toLevel: 3,
    type: 'recommended',
    description: 'Gamification provides engagement data for personalization',
  },

  // Rewards L2 required for partner ecosystem
  {
    fromTrack: 'rewards-offers',
    fromLevel: 2,
    toTrack: 'rewards-offers',
    toLevel: 3,
    type: 'required',
    description: 'Offer management foundation required for partner ecosystem',
  },

  // Analytics L2 recommended for predictive
  {
    fromTrack: 'loyalty-intelligence',
    fromLevel: 2,
    toTrack: 'loyalty-intelligence',
    toLevel: 3,
    type: 'required',
    description: 'Advanced analytics required before predictive capabilities',
  },

  // Engagement L2 enhances Intelligence L2
  {
    fromTrack: 'member-engagement',
    fromLevel: 1,
    toTrack: 'loyalty-intelligence',
    toLevel: 2,
    type: 'recommended',
    description: 'Member engagement data enriches analytics',
  },

  // Rewards L1 required for Intelligence L2
  {
    fromTrack: 'rewards-offers',
    fromLevel: 1,
    toTrack: 'loyalty-intelligence',
    toLevel: 2,
    type: 'required',
    description: 'Accrual/redemption data required for financial analytics',
  },

  // Intelligence L2 recommended for personalized engagement
  {
    fromTrack: 'loyalty-intelligence',
    fromLevel: 2,
    toTrack: 'member-engagement',
    toLevel: 3,
    type: 'recommended',
    description: 'Member analytics inform personalization strategy',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLoyaltyTrackById(trackId: LoyaltyTrackId): LoyaltyTrack | undefined {
  return LOYALTY_TRACKS.find((t) => t.id === trackId);
}

export function getLoyaltyTrackLevel(
  trackId: LoyaltyTrackId,
  level: LoyaltyTrackLevel
): LoyaltyTrackLevelDefinition | undefined {
  const track = getLoyaltyTrackById(trackId);
  return track?.levels.find((l) => l.level === level);
}

export function getLoyaltyDependenciesForLevel(
  trackId: LoyaltyTrackId,
  level: LoyaltyTrackLevel
): LoyaltyTrackDependency[] {
  return LOYALTY_TRACK_DEPENDENCIES.filter((d) => d.toTrack === trackId && d.toLevel === level);
}

export function getLoyaltyRequiredDependencies(
  trackId: LoyaltyTrackId,
  level: LoyaltyTrackLevel
): LoyaltyTrackDependency[] {
  return getLoyaltyDependenciesForLevel(trackId, level).filter((d) => d.type === 'required');
}

export function getLoyaltyRecommendedDependencies(
  trackId: LoyaltyTrackId,
  level: LoyaltyTrackLevel
): LoyaltyTrackDependency[] {
  return getLoyaltyDependenciesForLevel(trackId, level).filter((d) => d.type === 'recommended');
}

export function getLoyaltyCapabilitiesForTrack(trackId: LoyaltyTrackId): string[] {
  const track = getLoyaltyTrackById(trackId);
  if (!track) return [];
  return track.levels.flatMap((l) => l.capabilities);
}

export function getLoyaltyCapabilitiesForTrackLevel(
  trackId: LoyaltyTrackId,
  level: LoyaltyTrackLevel
): string[] {
  const trackLevel = getLoyaltyTrackLevel(trackId, level);
  return trackLevel?.capabilities || [];
}

export function getLoyaltyAssessmentOrder(): LoyaltyTrackId[] {
  return ['program-foundation', 'member-engagement', 'rewards-offers', 'loyalty-intelligence'];
}

export function canStartLoyaltyLevel(
  trackId: LoyaltyTrackId,
  level: LoyaltyTrackLevel,
  completedLevels: Set<string>
): { canStart: boolean; blockedBy: LoyaltyTrackDependency[] } {
  const requiredDeps = getLoyaltyRequiredDependencies(trackId, level);
  const blockedBy: LoyaltyTrackDependency[] = [];

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
