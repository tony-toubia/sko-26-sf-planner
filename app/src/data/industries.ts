import type { Industry, IndustryType } from '../types';

export const INDUSTRIES: Record<IndustryType, Industry> = {
  'retail-cpg': {
    id: 'retail-cpg',
    name: 'Retail & Consumer Goods',
    shortName: 'Retail/CPG',
    description: 'Retailers, consumer packaged goods, and direct-to-consumer brands',
    icon: 'ShoppingBag',
    typicalPriorities: [
      'Omnichannel customer experience',
      'Personalization at scale',
      'Loyalty program optimization',
      'Cart abandonment recovery',
      'Customer lifetime value growth',
    ],
    commonChallenges: [
      'Unifying online/offline customer data',
      'Competing with Amazon/DTC disruptors',
      'Rising customer acquisition costs',
      'Inventory-aware personalization',
      'Attribution across channels',
    ],
  },
  'qsr-restaurants': {
    id: 'qsr-restaurants',
    name: 'QSR & Restaurants',
    shortName: 'QSR',
    description: 'Quick service restaurants, fast casual, and food service brands',
    icon: 'UtensilsCrossed',
    typicalPriorities: [
      'Mobile app engagement',
      'Loyalty & rewards optimization',
      'Location-based marketing',
      'Order frequency & ticket size',
      'Franchisee/corporate alignment',
    ],
    commonChallenges: [
      'Identifying customers across channels (app, in-store, delivery)',
      'Limited margin for marketing spend',
      'Franchisee data fragmentation',
      'Delivery platform intermediation',
      'Real-time offer decisioning',
    ],
  },
  'financial-services': {
    id: 'financial-services',
    name: 'Financial Services',
    shortName: 'FinServ',
    description: 'Banking, insurance, wealth management, and fintech',
    icon: 'Landmark',
    typicalPriorities: [
      'Customer onboarding & activation',
      'Cross-sell & product deepening',
      'Regulatory compliance',
      'Customer retention & churn prevention',
      'Digital transformation',
    ],
    commonChallenges: [
      'Strict regulatory requirements (GDPR, CCPA, industry-specific)',
      'Legacy system integration',
      'Consent management complexity',
      'Siloed product lines',
      'Trust and security concerns',
    ],
    regulatoryConsiderations: [
      'GDPR/CCPA compliance',
      'Financial services marketing regulations',
      'Data residency requirements',
      'Audit trail requirements',
      'Consent documentation',
    ],
  },
  'healthcare-life-sciences': {
    id: 'healthcare-life-sciences',
    name: 'Healthcare & Life Sciences',
    shortName: 'HLS',
    description: 'Healthcare providers, pharma, medical devices, and life sciences',
    icon: 'Heart',
    typicalPriorities: [
      'Patient engagement & adherence',
      'HCP (healthcare professional) engagement',
      'Consent & compliance',
      'Omnichannel orchestration',
      'Patient journey optimization',
    ],
    commonChallenges: [
      'HIPAA and healthcare privacy regulations',
      'Complex stakeholder ecosystem (patients, HCPs, payers)',
      'Long sales/adoption cycles',
      'Limited direct patient data access',
      'MLR (Medical, Legal, Regulatory) approval processes',
    ],
    regulatoryConsiderations: [
      'HIPAA compliance',
      'FDA marketing guidelines',
      'MLR approval workflows',
      'Adverse event reporting',
      'State-specific regulations',
    ],
  },
  'manufacturing': {
    id: 'manufacturing',
    name: 'Manufacturing',
    shortName: 'Manufacturing',
    description: 'Industrial, B2B manufacturing, and distribution',
    icon: 'Factory',
    typicalPriorities: [
      'Dealer/distributor enablement',
      'Account-based marketing',
      'Lead scoring & nurturing',
      'Customer service integration',
      'Product registration & warranty',
    ],
    commonChallenges: [
      'Complex B2B buying committees',
      'Long sales cycles',
      'Channel partner data sharing',
      'Limited end-customer visibility',
      'Product complexity in marketing',
    ],
  },
  'travel-hospitality': {
    id: 'travel-hospitality',
    name: 'Travel & Hospitality',
    shortName: 'Travel',
    description: 'Airlines, hotels, cruise lines, and travel services',
    icon: 'Plane',
    typicalPriorities: [
      'Loyalty program engagement',
      'Booking abandonment recovery',
      'Personalized offers & upgrades',
      'Post-stay/trip engagement',
      'Real-time traveler communication',
    ],
    commonChallenges: [
      'Volatile demand and seasonality',
      'OTA (online travel agency) intermediation',
      'Complex loyalty tier structures',
      'Real-time inventory integration',
      'Multi-property data unification',
    ],
  },
  'media-entertainment': {
    id: 'media-entertainment',
    name: 'Media & Entertainment',
    shortName: 'Media',
    description: 'Streaming, publishing, gaming, and entertainment brands',
    icon: 'Tv',
    typicalPriorities: [
      'Subscriber retention',
      'Content personalization',
      'Churn prediction & prevention',
      'Cross-platform engagement',
      'Ad-supported tier optimization',
    ],
    commonChallenges: [
      'High churn rates',
      'Password sharing / account abuse',
      'Content discovery at scale',
      'Balancing ad load with experience',
      'Cross-device identity',
    ],
  },
  'technology': {
    id: 'technology',
    name: 'Technology',
    shortName: 'Tech',
    description: 'Software, SaaS, hardware, and technology services',
    icon: 'Cpu',
    typicalPriorities: [
      'Product-led growth',
      'Trial conversion optimization',
      'Customer onboarding',
      'Expansion & upsell',
      'Churn reduction',
    ],
    commonChallenges: [
      'Freemium conversion optimization',
      'Usage-based engagement triggers',
      'Complex product portfolios',
      'Self-service vs. sales-assisted balance',
      'International expansion',
    ],
  },
};

// Get industry by ID
export function getIndustryById(id: IndustryType): Industry | undefined {
  return INDUSTRIES[id];
}

// Get all industries as array
export function getAllIndustries(): Industry[] {
  return Object.values(INDUSTRIES);
}

// Industry-specific capability emphasis - which capabilities are most relevant per industry
export const INDUSTRY_CAPABILITY_EMPHASIS: Record<IndustryType, {
  highPriority: string[];
  mediumPriority: string[];
  lowPriority: string[];
}> = {
  'retail-cpg': {
    highPriority: ['migrate-sfmc', 'customer-lifecycle-journeys', 'scale-dynamic-content', 'cross-channel-activation'],
    mediumPriority: ['extend-data-integrations', 'baseline-subscriber-journeys', 'identity-resolution'],
    lowPriority: ['clv-modeling'],
  },
  'qsr-restaurants': {
    highPriority: ['migrate-sfmc', 'baseline-subscriber-journeys', 'enhance-planned-campaigns'],
    mediumPriority: ['extend-data-integrations', 'einstein-engagement-scoring', 'cross-channel-activation'],
    lowPriority: ['insight-driven-experiences', 'clv-modeling'],
  },
  'financial-services': {
    highPriority: ['migrate-sfmc', 'identity-resolution', 'customer-lifecycle-journeys'],
    mediumPriority: ['enhance-planned-campaigns', 'einstein-engagement-scoring', 'data-exploration'],
    lowPriority: ['scale-dynamic-content'],
  },
  'healthcare-life-sciences': {
    highPriority: ['migrate-sfmc', 'identity-resolution', 'baseline-subscriber-journeys'],
    mediumPriority: ['enhance-planned-campaigns', 'data-exploration'],
    lowPriority: ['cross-channel-activation', 'scale-dynamic-content'],
  },
  'manufacturing': {
    highPriority: ['migrate-sfmc', 'extend-data-integrations', 'enhance-planned-campaigns'],
    mediumPriority: ['baseline-subscriber-journeys', 'data-exploration'],
    lowPriority: ['cross-channel-activation', 'scale-dynamic-content'],
  },
  'travel-hospitality': {
    highPriority: ['migrate-sfmc', 'customer-lifecycle-journeys', 'cross-channel-activation'],
    mediumPriority: ['baseline-subscriber-journeys', 'einstein-send-time-optimization', 'scale-dynamic-content'],
    lowPriority: ['clv-modeling'],
  },
  'media-entertainment': {
    highPriority: ['migrate-sfmc', 'customer-lifecycle-journeys', 'einstein-engagement-scoring'],
    mediumPriority: ['scale-dynamic-content', 'clv-modeling', 'insight-driven-experiences'],
    lowPriority: ['cross-channel-activation'],
  },
  'technology': {
    highPriority: ['migrate-sfmc', 'customer-lifecycle-journeys', 'enhance-planned-campaigns'],
    mediumPriority: ['baseline-subscriber-journeys', 'einstein-engagement-scoring', 'data-exploration'],
    lowPriority: ['cross-channel-activation'],
  },
};

// Industry-specific capability context - tips and variations per industry/capability
export const INDUSTRY_CAPABILITY_CONTEXT: Record<IndustryType, Record<string, {
  industryTip: string;
  commonUseCase?: string;
  regulatoryNote?: string;
}>> = {
  'retail-cpg': {
    'migrate-sfmc': {
      industryTip: 'For retail, Data Cloud is critical for unifying POS, e-commerce, and loyalty data. Focus on zero-copy integrations with existing data warehouses.',
      commonUseCase: 'Unified customer view across online/offline channels for omnichannel personalization',
    },
    'customer-lifecycle-journeys': {
      industryTip: 'Cart abandonment and post-purchase journeys have the highest ROI for retail—prioritize these over general lifecycle.',
      commonUseCase: 'Browse abandon, cart abandon, post-purchase cross-sell, and replenishment reminders',
    },
    'scale-dynamic-content': {
      industryTip: 'Inventory-aware personalization is a key differentiator—show products that are actually in stock.',
      commonUseCase: 'Product recommendations, regional inventory visibility, personalized promotions',
    },
    'cross-channel-activation': {
      industryTip: 'Coordinate email, SMS, and paid media for key retail moments (flash sales, holiday campaigns).',
      commonUseCase: 'Flash sale coordination, abandoned cart recovery across channels',
    },
    'identity-resolution': {
      industryTip: 'Focus on connecting loyalty members across online and in-store transactions.',
      commonUseCase: 'Matching in-store POS transactions to online profiles, loyalty member unification',
    },
  },
  'qsr-restaurants': {
    'migrate-sfmc': {
      industryTip: 'QSR data is often fragmented across POS, mobile app, and delivery partners. Prioritize mobile app and loyalty integration.',
      commonUseCase: 'Connecting app users, loyalty members, and in-store guests into a single view',
    },
    'baseline-subscriber-journeys': {
      industryTip: 'For QSR, focus on frequency-driving journeys—welcome series that incentivize second purchase, lapsed guest win-back.',
      commonUseCase: 'App download welcome series, loyalty tier progression, lapsed guest offers',
    },
    'enhance-planned-campaigns': {
      industryTip: 'QSR campaigns are highly seasonal and time-sensitive. Consider daypart-aware messaging (breakfast, lunch, dinner).',
      commonUseCase: 'LTO launches, daypart promotions, franchisee-approved offer campaigns',
    },
    'cross-channel-activation': {
      industryTip: 'Mobile push and SMS are critical for QSR due to proximity and immediacy needs.',
      commonUseCase: 'Geo-triggered offers, order-ready notifications, time-sensitive LTO alerts',
    },
    'einstein-engagement-scoring': {
      industryTip: 'Use engagement scoring to identify high-frequency guests vs. occasional visitors for differentiated messaging.',
      commonUseCase: 'Heavy user recognition, lapsed guest identification, optimal send frequency',
    },
  },
  'financial-services': {
    'migrate-sfmc': {
      industryTip: 'FinServ requires careful data governance. Focus on consent management and audit trails from day one.',
      commonUseCase: 'Product-line unification across banking, investments, insurance',
      regulatoryNote: 'Ensure Data Cloud setup includes consent management and data residency requirements.',
    },
    'identity-resolution': {
      industryTip: 'Identity resolution is critical for cross-selling across product lines while maintaining regulatory compliance.',
      commonUseCase: 'Household view for wealth management, cross-product customer recognition',
      regulatoryNote: 'Identity rules must account for privacy regulations and data sharing limitations.',
    },
    'customer-lifecycle-journeys': {
      industryTip: 'Onboarding journeys are critical for activation—focus on getting customers to use digital tools and set up accounts properly.',
      commonUseCase: 'Account activation, digital adoption, product deepening journeys',
    },
    'data-exploration': {
      industryTip: 'FinServ analytics often require detailed audit trails. Ensure reporting infrastructure supports compliance needs.',
      commonUseCase: 'Product penetration analysis, customer profitability, risk-based segmentation',
      regulatoryNote: 'Analytics must support audit and compliance reporting requirements.',
    },
    'enhance-planned-campaigns': {
      industryTip: 'Campaign approvals in FinServ are complex. Consider workflows that integrate with compliance review processes.',
      commonUseCase: 'Product cross-sell campaigns, rate change notifications, account review reminders',
      regulatoryNote: 'All campaign content typically requires compliance/legal review.',
    },
  },
  'healthcare-life-sciences': {
    'migrate-sfmc': {
      industryTip: 'HLS Data Cloud implementations must be HIPAA-compliant from the start. Consider Salesforce Health Cloud integration.',
      commonUseCase: 'Patient journey data, HCP engagement history, consent and preference management',
      regulatoryNote: 'Ensure BAA is in place. All data handling must meet HIPAA requirements.',
    },
    'identity-resolution': {
      industryTip: 'For pharma, maintaining separate HCP and patient identity graphs is often required.',
      commonUseCase: 'HCP NPI matching, patient identity across touchpoints',
      regulatoryNote: 'HCP data often subject to Sunshine Act transparency requirements.',
    },
    'baseline-subscriber-journeys': {
      industryTip: 'Patient journeys must account for MLR approval cycles. Design modular content that can be approved independently.',
      commonUseCase: 'Patient education series, adherence reminders, HCP relationship nurturing',
      regulatoryNote: 'All patient-facing content requires MLR (Medical, Legal, Regulatory) approval.',
    },
    'enhance-planned-campaigns': {
      industryTip: 'Campaign velocity in HLS is slower due to approval requirements. Focus on building a library of pre-approved content modules.',
      commonUseCase: 'HCP awareness campaigns, patient support program outreach',
      regulatoryNote: 'Build approval workflows into your campaign process from the start.',
    },
    'data-exploration': {
      industryTip: 'HLS analytics often need to connect marketing engagement to patient/HCP outcomes.',
      commonUseCase: 'HCP engagement scoring, patient journey analysis, prescription/Rx correlation',
    },
  },
  'manufacturing': {
    'migrate-sfmc': {
      industryTip: 'For B2B manufacturing, focus on integrating with CRM (Sales Cloud) and dealer/distributor systems.',
      commonUseCase: 'Dealer/distributor data integration, account hierarchy management',
    },
    'extend-data-integrations': {
      industryTip: 'Manufacturing often requires integration with ERP, dealer portals, and partner systems.',
      commonUseCase: 'Order history integration, warranty/registration data, partner tier information',
    },
    'enhance-planned-campaigns': {
      industryTip: 'B2B manufacturing campaigns often target multiple stakeholders in buying committees. Design for account-based nurturing.',
      commonUseCase: 'New product announcements, trade show follow-up, dealer enablement',
    },
    'baseline-subscriber-journeys': {
      industryTip: 'Focus on post-purchase journeys like warranty registration, parts/service reminders, and product training.',
      commonUseCase: 'Product registration welcome, warranty expiration, maintenance reminders',
    },
    'data-exploration': {
      industryTip: 'Connect marketing engagement to pipeline and revenue for account-based attribution.',
      commonUseCase: 'Account engagement scoring, multi-touch attribution, dealer performance',
    },
  },
  'travel-hospitality': {
    'migrate-sfmc': {
      industryTip: 'Travel loyalty data is complex with tiers, points, and status. Prioritize real-time loyalty data access.',
      commonUseCase: 'Loyalty tier/points integration, booking history, guest preferences',
    },
    'customer-lifecycle-journeys': {
      industryTip: 'Pre-trip, during-trip, and post-trip journeys are the foundation. Add booking abandon and upgrade offer sequences.',
      commonUseCase: 'Booking confirmation, pre-arrival, on-property, post-stay review requests',
    },
    'cross-channel-activation': {
      industryTip: 'Real-time channels (SMS, push) are critical for in-trip communication and time-sensitive offers.',
      commonUseCase: 'Upgrade offers, flight status alerts, property notifications',
    },
    'scale-dynamic-content': {
      industryTip: 'Destination and property imagery is a key differentiator. Invest in dynamic content that showcases experiences.',
      commonUseCase: 'Personalized destination recommendations, property-specific offers',
    },
    'einstein-send-time-optimization': {
      industryTip: 'Time zones matter significantly for travel. STO can help navigate travelers across zones.',
      commonUseCase: 'Optimal send timing across time zones, booking window optimization',
    },
  },
  'media-entertainment': {
    'migrate-sfmc': {
      industryTip: 'Streaming data volumes are high. Focus on event-based architecture and efficient data ingestion.',
      commonUseCase: 'Viewing history, content preferences, subscription status',
    },
    'customer-lifecycle-journeys': {
      industryTip: 'Churn prevention is critical. Build predictive churn triggers and win-back journeys early.',
      commonUseCase: 'Trial conversion, engagement decline intervention, cancellation win-back',
    },
    'einstein-engagement-scoring': {
      industryTip: 'Engagement scoring for media should factor in content consumption patterns, not just email engagement.',
      commonUseCase: 'Viewing engagement decline detection, content affinity scoring',
    },
    'scale-dynamic-content': {
      industryTip: 'Content recommendations are table stakes for media. Focus on combining viewing data with promotional messaging.',
      commonUseCase: 'Personalized content recommendations, new release alerts based on preferences',
    },
    'clv-modeling': {
      industryTip: 'Subscription CLV is more predictable than other verticals. Focus on churn prediction as the primary CLV driver.',
      commonUseCase: 'Churn propensity modeling, subscriber lifetime value prediction',
    },
  },
  'technology': {
    'migrate-sfmc': {
      industryTip: 'Tech companies often have rich product usage data. Prioritize integrating usage/telemetry with marketing.',
      commonUseCase: 'Product usage data integration, trial activity, feature adoption metrics',
    },
    'customer-lifecycle-journeys': {
      industryTip: 'Product-led growth requires tight integration between in-app behavior and marketing journeys.',
      commonUseCase: 'Trial conversion, feature adoption, expansion triggers, renewal journeys',
    },
    'enhance-planned-campaigns': {
      industryTip: 'Tech campaigns often target different personas (developers, admins, executives). Design for multi-persona journeys.',
      commonUseCase: 'Product launches, feature announcements, user conference promotion',
    },
    'einstein-engagement-scoring': {
      industryTip: 'Combine product usage signals with engagement scoring for true health/expansion indicators.',
      commonUseCase: 'Product health scoring, expansion readiness, churn risk identification',
    },
    'data-exploration': {
      industryTip: 'Connect marketing engagement to product adoption and expansion revenue for full-funnel visibility.',
      commonUseCase: 'Trial-to-paid analysis, feature adoption correlation, expansion revenue attribution',
    },
  },
};

// Industry-specific question variations - additional context questions per industry
export const INDUSTRY_SPECIFIC_QUESTIONS: Record<IndustryType, {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'text';
  options?: string[];
}[]> = {
  'retail-cpg': [
    {
      id: 'retail-channels',
      question: 'Which retail channels does the client operate?',
      type: 'multi-select',
      options: ['E-commerce (owned)', 'Physical stores', 'Marketplaces (Amazon, etc.)', 'Wholesale/B2B', 'DTC subscription'],
    },
    {
      id: 'loyalty-program',
      question: 'Does the client have an existing loyalty program?',
      type: 'single-select',
      options: ['Yes, points-based', 'Yes, tier-based', 'Yes, subscription/membership', 'No, but planning', 'No'],
    },
  ],
  'qsr-restaurants': [
    {
      id: 'restaurant-model',
      question: 'What is the restaurant operating model?',
      type: 'single-select',
      options: ['Corporate-owned', 'Franchise', 'Mixed corporate/franchise', 'Licensing'],
    },
    {
      id: 'ordering-channels',
      question: 'Which ordering channels are active?',
      type: 'multi-select',
      options: ['Mobile app', 'In-store/counter', 'Drive-thru', 'Delivery (owned)', 'Third-party delivery (DoorDash, etc.)', 'Catering'],
    },
  ],
  'financial-services': [
    {
      id: 'fs-segment',
      question: 'Which financial services segment?',
      type: 'single-select',
      options: ['Retail banking', 'Wealth management', 'Insurance (P&C)', 'Insurance (Life)', 'Credit cards', 'Fintech/neobank'],
    },
    {
      id: 'regulatory-requirements',
      question: 'What regulatory frameworks apply?',
      type: 'multi-select',
      options: ['GDPR', 'CCPA/CPRA', 'GLBA', 'State-specific regulations', 'SEC/FINRA', 'International regulations'],
    },
  ],
  'healthcare-life-sciences': [
    {
      id: 'hls-segment',
      question: 'Which healthcare/life sciences segment?',
      type: 'single-select',
      options: ['Pharmaceutical', 'Medical devices', 'Healthcare provider/system', 'Payer/insurance', 'Biotech', 'Digital health'],
    },
    {
      id: 'audience-types',
      question: 'Who are the primary marketing audiences?',
      type: 'multi-select',
      options: ['Patients/consumers', 'Healthcare professionals (HCPs)', 'Payers', 'Health systems', 'Caregivers'],
    },
  ],
  'manufacturing': [
    {
      id: 'mfg-model',
      question: 'What is the go-to-market model?',
      type: 'single-select',
      options: ['Direct to end customer', 'Through distributors/dealers', 'Mixed direct and channel', 'OEM/component supplier'],
    },
    {
      id: 'buyer-type',
      question: 'Who is the primary buyer?',
      type: 'single-select',
      options: ['B2B enterprises', 'SMB', 'Prosumer/small business', 'Government/public sector', 'Mixed'],
    },
  ],
  'travel-hospitality': [
    {
      id: 'travel-segment',
      question: 'Which travel/hospitality segment?',
      type: 'single-select',
      options: ['Hotels/resorts', 'Airlines', 'Cruise lines', 'OTA/travel agency', 'Car rental', 'Experiences/tours'],
    },
    {
      id: 'loyalty-structure',
      question: 'What is the loyalty program structure?',
      type: 'single-select',
      options: ['Points + tiers', 'Points only', 'Subscription/membership', 'Coalition program', 'No loyalty program'],
    },
  ],
  'media-entertainment': [
    {
      id: 'media-model',
      question: 'What is the primary business model?',
      type: 'single-select',
      options: ['Subscription (SVOD)', 'Ad-supported (AVOD)', 'Hybrid', 'Transactional (TVOD)', 'Gaming', 'Publishing'],
    },
    {
      id: 'content-type',
      question: 'What type of content/experience?',
      type: 'multi-select',
      options: ['Video streaming', 'Music/audio', 'Gaming', 'News/publishing', 'Live events', 'User-generated content'],
    },
  ],
  'technology': [
    {
      id: 'tech-model',
      question: 'What is the primary business model?',
      type: 'single-select',
      options: ['SaaS subscription', 'Usage-based', 'Perpetual license', 'Freemium', 'Hardware + software', 'Marketplace/platform'],
    },
    {
      id: 'buyer-motion',
      question: 'What is the primary buyer motion?',
      type: 'single-select',
      options: ['Product-led (self-service)', 'Sales-led (enterprise)', 'Hybrid PLG + sales', 'Channel/partner-led'],
    },
  ],
};
