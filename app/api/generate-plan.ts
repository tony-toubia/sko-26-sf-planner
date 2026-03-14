import Anthropic from '@anthropic-ai/sdk';
import { fetchFormattedReferenceData, getCachedPlan, cachePlan } from './lib/referenceData.js';
import { getPlanKnowledge } from './lib/knowledgeQuery.js';

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Types matching the app's data structures
interface TrackLevelAssessment {
  trackId: string;
  level: number;
  status: 'not-started' | 'in-progress' | 'complete';
  notes?: string;
  answers?: { questionId: string; value: string | string[] | number }[];
}

interface GlobalAssessmentInputs {
  clientContext: {
    industry?: string;
    industrySegment?: string;
    companySize?: string;
    currentMarketingMaturity?: number;
    existingTechStack?: string;
    teamSize?: string;
    annualMarketingBudget?: string;
  };
  commercialPreferences: {
    preferredEngagementModel?: string[];
    budgetRange?: string;
    budgetFlexibility?: string;
    decisionTimeline?: string;
    internalResources?: string;
    preferCapexOrOpex?: string;
  };
  strategicContext: {
    keyBusinessDrivers?: string[];
    successMetrics?: string[];
    knownConstraints?: string;
    competitivePressures?: string;
    executiveSponsor?: string;
    additionalContext?: string;
  };
}

interface PlanGenerationRequest {
  clientName: string;
  industry?: string;
  marketingFoundation?: string;
  trackAssessments: TrackLevelAssessment[];
  globalInputs: GlobalAssessmentInputs;
}

// Grounding data - ROI benchmarks
const ROI_BENCHMARKS = `
## Merkle-Validated ROI Benchmarks

### Phase 1: Foundation
- Operational Efficiency: 3X improvement from platform migration
- Digital Channel Penetration: +111% increase in reach

### Phase 2: Activation
- Email-Attributed Revenue: +35% increase through journey optimization
- Open Rate vs Industry: +40% improvement
- Welcome Series Transaction Rate: +320% vs promotional emails
- Birthday Email Transaction Rate: +481% vs promotional emails

### Phase 3: Optimization
- Return on Ad Spend (ROAS): 3X through cross-channel suppression
- Campaign Efficiency: +100% with cross-channel journeys
- Multi-Channel Purchase Rate: +287% vs single-channel
- Cart Abandonment Recovery: 5-15% of abandoned revenue
- Repeat Purchase Rate: +25% from post-purchase journeys

### Phase 4: Transformation
- Existing Customer Sales Lift: +16% per campaign with predictive models
- Lapsed Customer Sales Lift: +5% with predictive win-back
`;

// Journey prioritization guidance
const JOURNEY_GUIDANCE = `
## Journey Prioritization Matrix

### High Impact, Low Effort (Quick Wins)
- Welcome/Onboarding: Multi-touch series, +320% transaction rate
- Birthday: Celebration with offers, +481% transaction rate
- Re-Engagement: Declining engagement recovery

### High Impact, High Effort (Strategic Investments)
- Cart Abandonment: 5-15% revenue recovery, requires purchase data
- Browse Abandonment: Behavior-triggered re-engagement
- Purchase Win-Back: Lapsed customer reactivation

### Journey Phases
- Phase 2 Journeys (subscriber-event triggered): Welcome, New Arrivals, Best Sellers, Back in Stock, Affinity, Birthday, Re-Engagement
- Phase 3 Journeys (purchase-event triggered): Cart/Browse Abandon, Purchase Confirmation, Post-Purchase Review, Win-Back, Purchase Anniversary

### Channel Strategy
- Email: Rich content, cost-efficient, included in licensing
- SMS: 98% open rate, urgency/time-sensitive, incremental cost
- Push: App users, real-time, location-based, included
- Ads: Extended reach, retargeting, suppression, incremental cost
- Direct Mail: High-value customers, premium moments, third-party cost
`;

// Track descriptions
const TRACK_DESCRIPTIONS = `
## Maturity Tracks

### Data & Identity Track
- Level 1 (Platform Foundation): Migrate to Data Cloud & MC Advanced
- Level 2 (Extended Integration): Connect POS, loyalty, e-commerce data
- Level 3 (Identity & Enrichment): Cross-device/channel identity resolution

### Customer Journeys Track
- Level 1 (Subscriber Journeys): Welcome, birthday, re-engagement
- Level 2 (Customer Lifecycle): Post-purchase, loyalty, win-back
- Level 3 (Insight-Driven): Predictive triggers, next-best-action

### Content & Channels Track
- Level 1 (Campaign Optimization): Batch-to-journey transformation
- Level 2 (Dynamic Content): Einstein Content Selection, personalization at scale
- Level 3 (Cross-Channel): SMS, ads, push, direct mail orchestration

### Intelligence Track
- Level 1 (Reporting Foundation): Dashboards, segment performance
- Level 2 (Advanced Analytics): Attribution, path analysis
- Level 3 (Predictive): CLV modeling, churn prediction, propensity scores
`;

// ============================================================================
// COMPREHENSIVE INDUSTRY REFERENCE DATA
// ============================================================================

// Industry type mapping from UI names to internal IDs
const INDUSTRY_TYPE_MAP: Record<string, string> = {
  'Retail & CPG': 'retail-cpg-qsr',
  'Retail, CPG & QSR': 'retail-cpg-qsr',
  'Financial Services': 'financial-services',
  'Healthcare & Life Sciences': 'healthcare-life-sciences',
  'Healthcare': 'healthcare-life-sciences',
  'Manufacturing': 'manufacturing',
  'Travel & Hospitality': 'travel-hospitality',
  'Media & Entertainment': 'media-entertainment',
  'Technology': 'technology',
};

// Industry-specific KPIs with benchmarks
const INDUSTRY_KPIS: Record<string, Array<{ metric: string; benchmark: string; levers: string[] }>> = {
  'retail-cpg-qsr': [
    { metric: 'Email Open Rate', benchmark: '15-25% (retail), 20-30% (QSR)', levers: ['Subject line optimization', 'Send time optimization', 'Segmentation'] },
    { metric: 'Email Click-to-Open Rate', benchmark: '10-15%', levers: ['Content relevance', 'CTA optimization', 'Dynamic content'] },
    { metric: 'Cart Abandonment Rate', benchmark: '65-75% (opportunity to recover 5-15%)', levers: ['Abandon cart journeys', 'Retargeting', 'Incentive testing'] },
    { metric: 'Email-Attributed Revenue', benchmark: '15-30% of e-commerce revenue', levers: ['Journey expansion', 'Personalization', 'Cross-sell/upsell'] },
    { metric: 'Customer Lifetime Value', benchmark: '3-5x AOV', levers: ['Retention programs', 'CLV-based segmentation', 'High-value customer treatment'] },
    { metric: 'Repeat Purchase Rate', benchmark: '25-40%', levers: ['Post-purchase journeys', 'Second purchase incentives', 'Product education'] },
    { metric: 'Loyalty Member Engagement', benchmark: '40-60%', levers: ['Tier progression journeys', 'Points reminders', 'Member-exclusive offers'] },
    { metric: 'SMS Click Rate', benchmark: '15-30%', levers: ['Message timing', 'Offer relevance', 'Urgency messaging'] },
  ],
  'financial-services': [
    { metric: 'Email Open Rate', benchmark: '20-30%', levers: ['Subject line optimization', 'Sender name testing', 'Personalization'] },
    { metric: 'Digital Engagement Rate', benchmark: '50-70% for active customers', levers: ['App push notifications', 'Feature education', 'Personalized dashboards'] },
    { metric: 'Account Activation Rate', benchmark: '60-80%', levers: ['Onboarding journeys', 'Activation incentives', 'Milestone tracking'] },
    { metric: 'Products Per Customer', benchmark: '2.5-4.0', levers: ['Cross-sell journeys', 'Life event targeting', 'Need-based recommendations'] },
    { metric: 'Digital Adoption Rate', benchmark: '70-85%', levers: ['Feature education', 'Migration campaigns', 'Self-service promotion'] },
    { metric: 'NPS Score', benchmark: '30-50 (industry varies)', levers: ['Journey optimization', 'Feedback loops', 'Service recovery'] },
    { metric: 'Customer Retention Rate', benchmark: '85-95%', levers: ['At-risk detection', 'Proactive outreach', 'Value reinforcement'] },
  ],
  'healthcare-life-sciences': [
    { metric: 'Patient Portal Adoption', benchmark: '40-60%', levers: ['Activation journeys', 'Feature education', 'Convenience messaging'] },
    { metric: 'Medication Adherence Rate', benchmark: '50-70% (varies by condition)', levers: ['Refill reminders', 'Education content', 'Support program enrollment'] },
    { metric: 'Appointment Show Rate', benchmark: '85-95%', levers: ['Multi-channel reminders', 'Prep communications', 'Rescheduling ease'] },
    { metric: 'Patient Satisfaction (HCAHPS)', benchmark: 'Top quartile target', levers: ['Communication timing', 'Provider-specific content', 'Care coordination'] },
    { metric: 'HCP Engagement Rate', benchmark: '15-25%', levers: ['Channel preference', 'Content personalization', 'Rep coordination'] },
    { metric: 'Program Enrollment Rate', benchmark: '15-30%', levers: ['Enrollment journeys', 'Value communication', 'Simplified enrollment'] },
  ],
  'manufacturing': [
    { metric: 'Lead-to-Opportunity Conversion', benchmark: '10-20%', levers: ['Lead scoring', 'Nurture journeys', 'Sales alignment'] },
    { metric: 'Account Engagement Score', benchmark: 'Varies by program', levers: ['Multi-touch ABM', 'Stakeholder mapping', 'Content personalization'] },
    { metric: 'Dealer Portal Engagement', benchmark: '40-60%', levers: ['Enablement content', 'Training programs', 'Incentive communications'] },
    { metric: 'Service Contract Renewal', benchmark: '70-85%', levers: ['Renewal journeys', 'Value documentation', 'Proactive outreach'] },
    { metric: 'Warranty Registration Rate', benchmark: '30-50%', levers: ['Registration reminders', 'Value communication', 'Process simplification'] },
    { metric: 'Product Registration Rate', benchmark: '40-60%', levers: ['Post-purchase journeys', 'Incentive programs', 'Easy registration'] },
  ],
  'travel-hospitality': [
    { metric: 'Booking Abandonment Recovery', benchmark: '5-15%', levers: ['Multi-touch recovery', 'Urgency messaging', 'Price alerts'] },
    { metric: 'Direct Booking Rate', benchmark: '30-50%', levers: ['Loyalty incentives', 'Price parity messaging', 'Member benefits'] },
    { metric: 'Ancillary Revenue per Guest', benchmark: 'Varies by segment', levers: ['Pre-arrival upsell', 'On-property offers', 'Personalized recommendations'] },
    { metric: 'Loyalty Program Active Rate', benchmark: '40-60%', levers: ['Tier progression', 'Points expiration', 'Member-only offers'] },
    { metric: 'Repeat Booking Rate', benchmark: '30-40%', levers: ['Post-stay journeys', 'Loyalty programs', 'Personalized offers'] },
    { metric: 'Guest Satisfaction Score', benchmark: '4.2+ / 5.0', levers: ['Pre-arrival communication', 'On-property engagement', 'Issue resolution'] },
  ],
  'media-entertainment': [
    { metric: 'Trial-to-Paid Conversion', benchmark: '30-50%', levers: ['Onboarding journeys', 'Value demonstration', 'Timely conversion offers'] },
    { metric: 'Monthly Active Users', benchmark: '60-80% of subscribers', levers: ['Content personalization', 'Engagement triggers', 'New content alerts'] },
    { metric: 'Churn Rate', benchmark: '3-7% monthly', levers: ['At-risk identification', 'Win-back journeys', 'Value reinforcement'] },
    { metric: 'Content Engagement Rate', benchmark: 'Varies by content type', levers: ['Personalized recommendations', 'Discovery features', 'Engagement timing'] },
    { metric: 'Cross-Platform Usage', benchmark: '40-60%', levers: ['Platform education', 'Seamless handoffs', 'Platform-specific features'] },
    { metric: 'ARPU', benchmark: 'Varies by market', levers: ['Tier upgrade campaigns', 'Add-on offers', 'Bundle promotions'] },
  ],
  'technology': [
    { metric: 'Trial-to-Paid Conversion', benchmark: '15-30%', levers: ['Onboarding optimization', 'Time-to-value acceleration', 'Conversion journeys'] },
    { metric: 'Product Activation Rate', benchmark: '40-70%', levers: ['Activation milestones', 'Feature education', 'Use case guidance'] },
    { metric: 'Feature Adoption Rate', benchmark: '20-50% per feature', levers: ['In-app messaging', 'Feature announcements', 'Use case content'] },
    { metric: 'Net Revenue Retention', benchmark: '100-130%', levers: ['Expansion triggers', 'Usage-based upsell', 'Customer success programs'] },
    { metric: 'Customer Health Score', benchmark: 'Custom thresholds', levers: ['Usage monitoring', 'Engagement signals', 'Support interactions'] },
    { metric: 'Churn Rate', benchmark: '5-15% annual', levers: ['Health score alerts', 'At-risk intervention', 'Renewal journeys'] },
  ],
};

// Industry-specific critical journeys with benchmarks
const INDUSTRY_JOURNEYS: Record<string, Array<{ name: string; relevance: string; benchmark?: string; notes: string }>> = {
  'retail-cpg-qsr': [
    { name: 'Welcome Series', relevance: 'Critical', benchmark: '+320% transaction rate vs. promo', notes: 'Focus on second purchase incentive. For QSR, drive app download and loyalty enrollment.' },
    { name: 'Cart Abandonment', relevance: 'Critical', benchmark: '5-15% recovery rate', notes: 'Multi-touch series with escalating incentives. Consider inventory-aware messaging.' },
    { name: 'Birthday Celebration', relevance: 'Critical', benchmark: '+481% transaction rate vs. promo', notes: 'High-performing journey. For QSR, offer free item. For retail, offer discount.' },
    { name: 'Lapsed Customer Win-Back', relevance: 'Critical', benchmark: '5-15% win-back rate', notes: 'Define lapsed based on typical purchase frequency. Escalate channel and incentive.' },
    { name: 'Browse Abandonment', relevance: 'High', benchmark: '1-3% conversion rate', notes: 'Target product viewers who didn\'t add to cart. Use product recommendations.' },
    { name: 'Post-Purchase Review', relevance: 'High', notes: 'Time based on product type. Include product recommendations for next purchase.' },
    { name: 'Back in Stock / Seasonal Launch', relevance: 'High', notes: 'Notify waitlist and recent viewers. For QSR, use for LTO returns.' },
    { name: 'Loyalty Tier Progression', relevance: 'High', notes: 'Drive members toward next tier. Communicate benefits and progress.' },
  ],
  'financial-services': [
    { name: 'Account Onboarding', relevance: 'Critical', benchmark: '60-80% activation rate', notes: 'Focus on activation milestones: first login, first transaction, digital enrollment.' },
    { name: 'Application Abandonment', relevance: 'Critical', benchmark: '10-25% recovery rate', notes: 'Recovery for abandoned product applications. Consider compliance requirements.' },
    { name: 'Cross-Sell Recommendations', relevance: 'High', benchmark: '+15-25% conversion', notes: 'Cross-sell based on life stage and product holdings. Compliance-approved content.' },
    { name: 'Dormant Account Reactivation', relevance: 'High', notes: 'Re-engage inactive accounts. Highlight new features and benefits.' },
    { name: 'Product Interest Follow-Up', relevance: 'Medium', notes: 'Follow up on product research activity. Offer consultation.' },
    { name: 'Birthday / Milestone Recognition', relevance: 'Medium', notes: 'Relationship building. Consider account anniversary as alternative.' },
  ],
  'healthcare-life-sciences': [
    { name: 'New Patient Onboarding', relevance: 'Critical', benchmark: '40-60% portal adoption', notes: 'Focus on portal activation, preference capture, and care team introduction.' },
    { name: 'Appointment Reminders', relevance: 'Critical', benchmark: '85-95% show rate', notes: 'Multi-channel reminders with prep instructions. Enable easy rescheduling.' },
    { name: 'Medication Adherence', relevance: 'Critical', benchmark: '10-20% improvement', notes: 'Refill reminders, education content, support program enrollment.' },
    { name: 'Patient Program Enrollment', relevance: 'High', benchmark: '15-30% enrollment increase', notes: 'Condition-specific programs, value communication, simplified enrollment.' },
    { name: 'HCP Engagement', relevance: 'High', benchmark: '15-25% engagement rate', notes: 'Channel preference-based outreach, rep coordination, content personalization.' },
    { name: 'Post-Visit Follow-Up', relevance: 'High', notes: 'Care instructions, satisfaction survey, follow-up scheduling.' },
  ],
  'manufacturing': [
    { name: 'Lead Nurture', relevance: 'Critical', benchmark: '+20-40% conversion', notes: 'Long-cycle nurture with educational content. Score-based sales handoff.' },
    { name: 'Account-Based Marketing', relevance: 'Critical', benchmark: '+30-50% engagement', notes: 'Multi-stakeholder, coordinated touchpoints. Personalized by role and account.' },
    { name: 'Product Registration', relevance: 'High', benchmark: '+25-40% registration', notes: 'Post-purchase journey driving registration and warranty activation.' },
    { name: 'Service Reminders', relevance: 'High', benchmark: '+20-30% service attach', notes: 'Maintenance schedules, service contract renewals, parts replenishment.' },
    { name: 'Dealer Enablement', relevance: 'High', benchmark: '+30-50% portal engagement', notes: 'Training, incentive programs, inventory alerts, sales support.' },
    { name: 'Warranty Renewal', relevance: 'Medium', benchmark: '30-50% renewal rate', notes: 'Extended warranty offers before expiration.' },
  ],
  'travel-hospitality': [
    { name: 'Booking Abandonment', relevance: 'Critical', benchmark: '5-15% recovery', notes: 'Multi-touch recovery with urgency and price alerts. High-value opportunity.' },
    { name: 'Pre-Arrival Journey', relevance: 'Critical', benchmark: '+15-25% ancillary revenue', notes: 'Build anticipation, offer upgrades, capture preferences.' },
    { name: 'Loyalty Enrollment & Progression', relevance: 'Critical', benchmark: '+20-35% enrollment', notes: 'Drive enrollment and tier progression. Communicate benefits.' },
    { name: 'Post-Stay Engagement', relevance: 'High', benchmark: '+15-25% repeat booking', notes: 'Feedback, loyalty cultivation, next booking incentive.' },
    { name: 'On-Property Engagement', relevance: 'High', notes: 'Real-time offers, service communications, experience enhancement.' },
    { name: 'Win-Back Campaign', relevance: 'Medium', notes: 'Re-engage lapsed travelers with personalized offers.' },
  ],
  'media-entertainment': [
    { name: 'Trial Onboarding', relevance: 'Critical', benchmark: '30-50% trial-to-paid', notes: 'Drive content discovery and engagement during trial period.' },
    { name: 'At-Risk Subscriber Intervention', relevance: 'Critical', benchmark: '10-25% churn reduction', notes: 'Identify declining engagement, intervene with value reinforcement.' },
    { name: 'Content Personalization', relevance: 'Critical', benchmark: '+20-40% engagement', notes: 'Personalized recommendations, new content alerts, discovery features.' },
    { name: 'Win-Back Campaign', relevance: 'High', benchmark: '10-20% reactivation', notes: 'Re-engage churned subscribers with compelling offers.' },
    { name: 'Subscription Renewal', relevance: 'High', notes: 'Pre-renewal engagement, value reinforcement, easy renewal process.' },
    { name: 'Tier Upgrade Campaign', relevance: 'Medium', benchmark: '5-15% upgrade rate', notes: 'Promote premium tiers, highlight benefits, time-limited offers.' },
  ],
  'technology': [
    { name: 'Product Onboarding', relevance: 'Critical', benchmark: '+20-40% trial-to-paid', notes: 'Accelerate time-to-value with guided activation and milestone celebration.' },
    { name: 'Feature Adoption', relevance: 'Critical', benchmark: '+30-50% feature adoption', notes: 'Educate on key features, show use cases, measure adoption.' },
    { name: 'Usage-Triggered Expansion', relevance: 'Critical', benchmark: '+15-30% expansion', notes: 'Identify expansion signals, trigger upgrade journeys.' },
    { name: 'At-Risk Customer Intervention', relevance: 'High', benchmark: '15-30% churn reduction', notes: 'Monitor health scores, intervene early with customer success.' },
    { name: 'Renewal Journey', relevance: 'High', benchmark: '+5-15% renewal rate', notes: 'Proactive renewal engagement, value documentation, easy renewal.' },
    { name: 'Product Updates & Release', relevance: 'Medium', notes: 'New feature announcements, release notes, adoption encouragement.' },
  ],
};

// Industry-specific ROI benchmarks
const INDUSTRY_ROI_BENCHMARKS: Record<string, Array<{ metric: string; value: string; context: string }>> = {
  'retail-cpg-qsr': [
    { metric: 'Email-Attributed Revenue', value: '15-30%', context: 'Share of e-commerce revenue attributed to email' },
    { metric: 'Cart Abandonment Recovery', value: '5-15%', context: 'Percentage of abandoned carts recovered' },
    { metric: 'Welcome Series Transaction Rate', value: '+320%', context: 'vs. promotional emails' },
    { metric: 'Birthday Email Transaction Rate', value: '+481%', context: 'vs. promotional emails' },
    { metric: 'Personalization Revenue Lift', value: '10-15%', context: 'Revenue increase from personalized content' },
    { metric: 'Cross-Channel ROAS', value: '3X', context: 'Return on ad spend with coordinated suppression' },
    { metric: 'Loyalty Member Value Premium', value: '2-3X', context: 'Loyal members vs. non-members' },
    { metric: 'Repeat Purchase Rate Increase', value: '+25%', context: 'From post-purchase journeys' },
  ],
  'financial-services': [
    { metric: 'Digital Onboarding Activation', value: '60-80%', context: 'New accounts activated through onboarding journeys' },
    { metric: 'Cross-Sell Conversion', value: '+15-25%', context: 'Increase from personalized product recommendations' },
    { metric: 'Application Abandonment Recovery', value: '10-25%', context: 'Abandoned applications recovered' },
    { metric: 'Digital Channel Adoption', value: '+30-50%', context: 'Increase in digital banking adoption' },
    { metric: 'Customer Retention Improvement', value: '+5-10%', context: 'From proactive engagement programs' },
    { metric: 'NPS Improvement', value: '+10-20 pts', context: 'From personalized experience programs' },
    { metric: 'Products Per Customer Increase', value: '+0.5-1.0', context: 'From cross-sell journeys' },
  ],
  'healthcare-life-sciences': [
    { metric: 'Patient Adherence Improvement', value: '10-20%', context: 'From adherence reminder programs' },
    { metric: 'HCP Engagement Rate', value: '15-25%', context: 'Digital engagement rate with HCPs' },
    { metric: 'Patient Program Enrollment', value: '15-30%', context: 'Increase from optimized enrollment journeys' },
    { metric: 'Treatment Persistence', value: '+10-15%', context: 'From patient support programs' },
    { metric: 'Content Consumption Increase', value: '+30-50%', context: 'From personalized content delivery' },
    { metric: 'Refill Rate Improvement', value: '15-25%', context: 'From proactive refill reminders' },
  ],
  'manufacturing': [
    { metric: 'Lead-to-Opportunity Conversion', value: '+20-40%', context: 'From nurture journey optimization' },
    { metric: 'Dealer Portal Engagement', value: '+30-50%', context: 'From dealer enablement programs' },
    { metric: 'Service Attach Rate Increase', value: '+20-30%', context: 'From service reminder journeys' },
    { metric: 'Warranty Renewal Rate', value: '30-50%', context: 'Extended warranty conversion' },
    { metric: 'Product Registration Increase', value: '+25-40%', context: 'From registration reminder campaigns' },
    { metric: 'Account Engagement Score Lift', value: '+30-50%', context: 'From multi-touch ABM programs' },
  ],
  'travel-hospitality': [
    { metric: 'Booking Abandonment Recovery', value: '5-15%', context: 'Abandoned bookings recovered' },
    { metric: 'Direct Booking Increase', value: '+10-20%', context: 'Shift from OTA to direct' },
    { metric: 'Ancillary Revenue per Guest', value: '+15-25%', context: 'From personalized upsell offers' },
    { metric: 'Loyalty Enrollment Rate', value: '+20-35%', context: 'From enrollment journey optimization' },
    { metric: 'Repeat Booking Rate', value: '+15-25%', context: 'From post-stay engagement' },
    { metric: 'Upgrade Offer Conversion', value: '5-15%', context: 'Pre-arrival upgrade acceptance' },
    { metric: 'Loyalty Member Activity', value: '+25-40%', context: 'From tier progression journeys' },
  ],
  'media-entertainment': [
    { metric: 'Trial-to-Paid Conversion', value: '30-50%', context: 'Free trial conversion rate' },
    { metric: 'Churn Reduction', value: '10-25%', context: 'From at-risk intervention programs' },
    { metric: 'Win-Back Success Rate', value: '10-20%', context: 'Churned subscriber reactivation' },
    { metric: 'Content Engagement Increase', value: '+20-40%', context: 'From personalized recommendations' },
    { metric: 'Ad-Supported Tier Upgrade', value: '5-15%', context: 'Conversion to ad-free plans' },
    { metric: 'Push Notification Engagement', value: '5-15%', context: 'Action rate from push notifications' },
    { metric: 'ARPU Increase', value: '+5-15%', context: 'From tier upgrade campaigns' },
  ],
  'technology': [
    { metric: 'Trial-to-Paid Conversion', value: '+20-40%', context: 'From optimized onboarding journeys' },
    { metric: 'Feature Adoption Rate', value: '+30-50%', context: 'From feature education campaigns' },
    { metric: 'Expansion Revenue', value: '+15-30%', context: 'From usage-triggered upsell' },
    { metric: 'Churn Reduction', value: '15-30%', context: 'From usage decline intervention' },
    { metric: 'Net Revenue Retention Improvement', value: '+5-15 pts', context: 'From customer success programs' },
    { metric: 'Time-to-Value Reduction', value: '30-50%', context: 'From accelerated onboarding' },
    { metric: 'Renewal Rate Improvement', value: '+5-15%', context: 'From proactive renewal journeys' },
  ],
};

// Industry-specific channel priorities
const INDUSTRY_CHANNEL_PRIORITIES: Record<string, Array<{ channel: string; priority: string; notes: string }>> = {
  'retail-cpg-qsr': [
    { channel: 'Email', priority: 'Critical', notes: 'Primary owned channel. Rich content, personalization, cost-efficient.' },
    { channel: 'SMS', priority: 'Critical', notes: 'Time-sensitive offers, order updates, loyalty rewards. 98% open rate.' },
    { channel: 'Push', priority: 'High', notes: 'App users, real-time location-based offers, order status.' },
    { channel: 'Ads', priority: 'High', notes: 'Retargeting, suppression, lookalike audiences.' },
    { channel: 'Direct Mail', priority: 'Medium', notes: 'High-value customers, win-back, premium moments.' },
  ],
  'financial-services': [
    { channel: 'Email', priority: 'Critical', notes: 'Primary channel for most communications. Compliance-friendly archiving.' },
    { channel: 'Push', priority: 'High', notes: 'App users, transaction alerts, security notifications.' },
    { channel: 'SMS', priority: 'High', notes: 'Security alerts, time-sensitive notifications. TCPA compliance required.' },
    { channel: 'Direct Mail', priority: 'Medium', notes: 'Required for some regulatory communications, high-value offers.' },
    { channel: 'Ads', priority: 'Medium', notes: 'Suppression for existing customers, conquest campaigns.' },
  ],
  'healthcare-life-sciences': [
    { channel: 'Email', priority: 'Critical', notes: 'Primary channel for patient engagement. HIPAA considerations.' },
    { channel: 'SMS', priority: 'High', notes: 'Appointment reminders, medication alerts. Consent required.' },
    { channel: 'Push', priority: 'Medium', notes: 'App users, health tracking, appointment reminders.' },
    { channel: 'Direct Mail', priority: 'Medium', notes: 'Required for certain communications, welcome kits.' },
  ],
  'manufacturing': [
    { channel: 'Email', priority: 'Critical', notes: 'Primary B2B channel. Nurture, product updates, dealer communications.' },
    { channel: 'Ads', priority: 'High', notes: 'ABM campaigns, retargeting, lead generation.' },
    { channel: 'Direct Mail', priority: 'Medium', notes: 'Executive outreach, high-value accounts, event invitations.' },
  ],
  'travel-hospitality': [
    { channel: 'Email', priority: 'Critical', notes: 'Pre/post-trip communications, loyalty updates, promotions.' },
    { channel: 'Push', priority: 'Critical', notes: 'Real-time travel updates, on-property offers, gate changes.' },
    { channel: 'SMS', priority: 'High', notes: 'Booking confirmations, check-in reminders, urgent updates.' },
    { channel: 'Ads', priority: 'High', notes: 'Retargeting, suppression, dynamic pricing offers.' },
    { channel: 'In-App', priority: 'High', notes: 'On-property services, digital key, loyalty status.' },
  ],
  'media-entertainment': [
    { channel: 'Email', priority: 'Critical', notes: 'Content recommendations, account updates, win-back campaigns.' },
    { channel: 'Push', priority: 'Critical', notes: 'New content alerts, live event notifications, engagement triggers.' },
    { channel: 'In-App', priority: 'Critical', notes: 'Content discovery, personalized recommendations.' },
    { channel: 'SMS', priority: 'Medium', notes: 'Account security, high-priority alerts.' },
    { channel: 'Ads', priority: 'Medium', notes: 'Conquest, win-back, cross-promotion.' },
  ],
  'technology': [
    { channel: 'Email', priority: 'Critical', notes: 'Product updates, onboarding, renewal communications.' },
    { channel: 'In-App', priority: 'Critical', notes: 'Feature education, usage nudges, expansion triggers.' },
    { channel: 'Push', priority: 'High', notes: 'Real-time alerts, engagement prompts (for app-based products).' },
    { channel: 'Ads', priority: 'Medium', notes: 'Retargeting, expansion campaigns, event promotion.' },
  ],
};

// Industry-specific data source priorities
const INDUSTRY_DATA_SOURCES: Record<string, Array<{ source: string; priority: string; types: string[] }>> = {
  'retail-cpg-qsr': [
    { source: 'E-commerce Platform', priority: 'Critical', types: ['Purchase history', 'Cart data', 'Browse behavior', 'Product catalog'] },
    { source: 'POS System', priority: 'Critical', types: ['In-store transactions', 'Payment data', 'Store locations'] },
    { source: 'Loyalty Platform', priority: 'Critical', types: ['Member profiles', 'Points balance', 'Tier status', 'Redemptions'] },
    { source: 'Mobile App', priority: 'High', types: ['App engagement', 'Location data', 'Preferences', 'Push tokens'] },
    { source: 'Customer Service', priority: 'High', types: ['Support interactions', 'Returns', 'Complaints', 'Preferences'] },
  ],
  'financial-services': [
    { source: 'Core Banking / Policy Admin', priority: 'Critical', types: ['Account data', 'Product holdings', 'Transaction history'] },
    { source: 'Digital Banking Platform', priority: 'Critical', types: ['Login activity', 'Feature usage', 'Digital preferences'] },
    { source: 'CRM', priority: 'High', types: ['Relationship data', 'Interactions', 'Life events', 'Preferences'] },
    { source: 'Application Systems', priority: 'High', types: ['Application status', 'Decisioning', 'Abandonment data'] },
  ],
  'healthcare-life-sciences': [
    { source: 'EHR/EMR System', priority: 'Critical', types: ['Patient data', 'Appointments', 'Care plans', 'Providers'] },
    { source: 'Patient Portal', priority: 'Critical', types: ['Portal activity', 'Preferences', 'Communications'] },
    { source: 'Scheduling System', priority: 'High', types: ['Appointments', 'No-shows', 'Availability'] },
    { source: 'Pharmacy System', priority: 'High', types: ['Prescriptions', 'Refills', 'Adherence'] },
  ],
  'manufacturing': [
    { source: 'CRM', priority: 'Critical', types: ['Account data', 'Contacts', 'Opportunities', 'Interactions'] },
    { source: 'ERP', priority: 'Critical', types: ['Orders', 'Products', 'Service contracts', 'Inventory'] },
    { source: 'Marketing Automation', priority: 'High', types: ['Engagement', 'Lead scores', 'Campaign responses'] },
    { source: 'Dealer Portal', priority: 'High', types: ['Dealer activity', 'Orders', 'Certifications'] },
  ],
  'travel-hospitality': [
    { source: 'Reservation System', priority: 'Critical', types: ['Bookings', 'Stays', 'Preferences', 'Revenue'] },
    { source: 'Loyalty System', priority: 'Critical', types: ['Member data', 'Points', 'Tier status', 'Activity'] },
    { source: 'Property Management', priority: 'High', types: ['Check-in/out', 'Room preferences', 'Charges'] },
    { source: 'Mobile App', priority: 'High', types: ['App usage', 'Location', 'Digital key', 'Requests'] },
  ],
  'media-entertainment': [
    { source: 'Subscription Platform', priority: 'Critical', types: ['Subscriber data', 'Plan details', 'Billing', 'Status'] },
    { source: 'Content Platform', priority: 'Critical', types: ['Viewing history', 'Preferences', 'Watchlist', 'Ratings'] },
    { source: 'Mobile/OTT Apps', priority: 'Critical', types: ['Device usage', 'Engagement', 'Features', 'Preferences'] },
    { source: 'Customer Service', priority: 'High', types: ['Support interactions', 'Issues', 'Cancellation reasons'] },
  ],
  'technology': [
    { source: 'Product Usage Data', priority: 'Critical', types: ['Feature usage', 'Adoption metrics', 'Engagement patterns'] },
    { source: 'Subscription/Billing', priority: 'Critical', types: ['Account details', 'Plan info', 'Billing history', 'Renewals'] },
    { source: 'CRM', priority: 'Critical', types: ['Account data', 'Contacts', 'Opportunities', 'Health scores'] },
    { source: 'Support System', priority: 'High', types: ['Tickets', 'Issues', 'Feature requests', 'CSAT'] },
  ],
};

// Helper function to get industry type ID from display name
function getIndustryTypeId(industryName: string | undefined): string | null {
  if (!industryName) return null;
  return INDUSTRY_TYPE_MAP[industryName] || null;
}

// Build comprehensive industry context for the prompt
function buildIndustryContext(industryName: string | undefined): string {
  const industryId = getIndustryTypeId(industryName);
  if (!industryId) return '';

  const kpis = INDUSTRY_KPIS[industryId] || [];
  const journeys = INDUSTRY_JOURNEYS[industryId] || [];
  const roiBenchmarks = INDUSTRY_ROI_BENCHMARKS[industryId] || [];
  const channels = INDUSTRY_CHANNEL_PRIORITIES[industryId] || [];
  const dataSources = INDUSTRY_DATA_SOURCES[industryId] || [];

  let context = `### ${industryName} - Comprehensive Reference Data\n\n`;

  // KPIs section
  context += `#### Key Performance Indicators (KPIs)\n`;
  kpis.forEach(kpi => {
    context += `- **${kpi.metric}**: ${kpi.benchmark}\n`;
    if (kpi.levers.length > 0) {
      context += `  - Improvement levers: ${kpi.levers.join(', ')}\n`;
    }
  });
  context += '\n';

  // Critical journeys section
  context += `#### Priority Journeys\n`;
  journeys.forEach(journey => {
    const benchmark = journey.benchmark ? ` (${journey.benchmark})` : '';
    context += `- **${journey.name}** [${journey.relevance}]${benchmark}\n`;
    context += `  - ${journey.notes}\n`;
  });
  context += '\n';

  // ROI benchmarks section
  context += `#### ROI Benchmarks\n`;
  roiBenchmarks.forEach(benchmark => {
    context += `- **${benchmark.metric}**: ${benchmark.value} - ${benchmark.context}\n`;
  });
  context += '\n';

  // Channel priorities section
  context += `#### Channel Priorities\n`;
  channels.forEach(channel => {
    context += `- **${channel.channel}** [${channel.priority}]: ${channel.notes}\n`;
  });
  context += '\n';

  // Data sources section
  context += `#### Critical Data Sources\n`;
  dataSources.forEach(source => {
    context += `- **${source.source}** [${source.priority}]: ${source.types.join(', ')}\n`;
  });

  return context;
}

// Build the system prompt - can use DB-sourced data or fall back to hardcoded
function buildSystemPrompt(request: PlanGenerationRequest, dbRefData?: { kpis: string; tactics: string; roiBenchmarks: string; channelPriorities: string; journeys: string; offerings: string } | null): string {
  // If DB reference data is available, use it (chunked/targeted). Otherwise fall back to hardcoded.
  const industryContext = dbRefData
    ? [dbRefData.kpis, dbRefData.journeys, dbRefData.roiBenchmarks, dbRefData.channelPriorities, dbRefData.tactics, dbRefData.offerings].filter(Boolean).join('\n\n')
    : buildIndustryContext(request.industry);

  // Get PDF-sourced knowledge (offerings, sales intelligence, methodology)
  const pdfKnowledge = getPlanKnowledge(['messaging-personalization']); // TODO: pass disciplines from request

  return `You are a senior Salesforce Marketing Cloud consultant at Merkle, creating a strategic implementation plan for ${request.clientName}.

Your role is to create a compelling, narrative-driven recommendation plan that:
1. Flows naturally as a strategic document, not a template
2. References specific benchmarks and outcomes from Merkle's methodology
3. Adapts completely to the client's assessed maturity and priorities
4. Skips empty phases - if they've completed Phase 1 work, start the plan at Phase 2
5. Provides specific, actionable recommendations grounded in data

IMPORTANT - Assumptions to AVOID:
- Do NOT assume the client has already implemented any platform. The "Marketing Foundation" field indicates their TARGET platform choice, not what they currently have.
- Only reference "current state" or "already implemented" if the maturity assessment explicitly shows completed capabilities.
- The assessment tracks show what level they are WORKING TOWARD, not what they have completed (unless status is "complete").
- When a track shows "not-started", assume they have no capabilities in that area yet.

## Reference Data

${ROI_BENCHMARKS}

${JOURNEY_GUIDANCE}

${TRACK_DESCRIPTIONS}

${industryContext}

${pdfKnowledge}

## Writing Guidelines

1. **Be Specific**: Reference actual benchmarks from the industry data ("+35% email revenue", "3X ROAS", specific KPI targets) not vague promises
2. **Flow Naturally**: Write as a cohesive narrative, not disconnected sections
3. **Skip What's Done**: If they've completed capabilities, acknowledge and build from there
4. **Contextualize for Industry**: Use the industry-specific KPIs, journeys, benchmarks, and channel priorities provided in the reference data
5. **Be Practical**: Include concrete next steps and decision points
6. **Address Resources**: Factor their team size, budget, and timeline into recommendations
7. **Create Urgency Without Pressure**: Show opportunity cost of inaction using industry-specific ROI benchmarks
8. **Prioritize Journeys by Industry**: Reference the industry journey relevance (Critical, High, Medium) when recommending journey implementation order
9. **Weave in Channel & Data Context**: Do NOT write standalone "Channel Strategy" or "Data Integration" sections. Instead, weave specific channel recommendations and data source requirements directly into phase descriptions and journey prioritization — grounded in the client's actual assessment gaps, not generic lists
10. **Make it Client-Specific**: Every recommendation must connect to their actual assessment answers and stated context. Avoid bullet lists that read like reference data copied verbatim. Write in the context of *this* client's situation.

## Output Format

Generate a Markdown document with these sections (adapt as needed based on their situation):

1. **Executive Summary** - 2-3 paragraphs capturing the opportunity, referencing industry-specific benchmarks
2. **Current State Assessment** - What they've completed, what's in progress, what's next
3. **Strategic Recommendation** - The "why" behind the plan, connected to their business drivers and industry context
4. **Implementation Roadmap** - Phased approach WITH ONLY PHASES THAT HAVE WORK (skip empty phases!)
   - For each phase: Objectives, key capabilities, expected outcomes with industry-specific benchmarks, duration
   - Within each phase, call out relevant channels to activate and data sources to integrate *where they are actually needed for that phase's work*
5. **Journey Prioritization** - Which journeys to implement and why, with industry-specific expected ROI
   - Reference the industry journey relevance ratings (Critical, High, Medium)
   - Include specific benchmarks from the industry data
   - Note which channels and data sources are required to execute each prioritized journey
6. **Investment Framework** - Based on their stated budget/preferences, not arbitrary numbers
7. **Risk Considerations** - Specific to their situation and industry
8. **Success Metrics** - Tied to their stated success criteria, using industry KPI benchmarks as targets
9. **Recommended Next Steps** - Concrete actions with owners

IMPORTANT:
- If Phase 1 foundation is complete, START THE ROADMAP AT PHASE 2
- Never show empty phases - renumber if needed so Phase 1 is always the first phase with work
- Investment estimates should align with their stated budget range and preferences
- Reference their specific track assessments and answers in your recommendations
- Do NOT add standalone "Channel Strategy" or "Data Integration Requirements" sections — this content must be embedded contextually within the roadmap and journey sections above
- Every bullet point should say something the client cannot read on a generic industry overview page — make it specific to their gaps, goals, and context`;
}

// Build the user prompt with assessment data
function buildUserPrompt(request: PlanGenerationRequest): string {
  // Summarize track assessments
  const trackSummary = request.trackAssessments.map(ta => {
    const statusEmoji = ta.status === 'complete' ? '✓' : ta.status === 'in-progress' ? '◐' : '○';
    const notes = ta.notes ? ` - "${ta.notes}"` : '';
    return `  ${statusEmoji} ${ta.trackId} Level ${ta.level}: ${ta.status}${notes}`;
  }).join('\n');

  // Build context from global inputs
  const ctx = request.globalInputs.clientContext;
  const comm = request.globalInputs.commercialPreferences;
  const strat = request.globalInputs.strategicContext;

  let contextSummary = '';
  if (ctx.industry) contextSummary += `Industry: ${ctx.industry}`;
  if (ctx.industrySegment) contextSummary += ` (${ctx.industrySegment})`;
  if (ctx.companySize) contextSummary += `\nCompany Size: ${ctx.companySize}`;
  if (ctx.currentMarketingMaturity) contextSummary += `\nCurrent Maturity: Level ${ctx.currentMarketingMaturity}/5`;
  if (ctx.teamSize) contextSummary += `\nMarketing Team Size: ${ctx.teamSize}`;
  if (ctx.existingTechStack) contextSummary += `\nExisting Tech: ${ctx.existingTechStack}`;

  let commercialSummary = '';
  if (comm.budgetRange) commercialSummary += `Budget Range: ${comm.budgetRange}`;
  if (comm.preferredEngagementModel?.length) {
    commercialSummary += `\nPreferred Model: ${comm.preferredEngagementModel.join(', ')}`;
  }
  if (comm.internalResources) commercialSummary += `\nInternal Resources: ${comm.internalResources}`;
  if (comm.preferCapexOrOpex) commercialSummary += `\nPreference: ${comm.preferCapexOrOpex.toUpperCase()}`;
  if (comm.decisionTimeline) commercialSummary += `\nDecision Timeline: ${comm.decisionTimeline}`;

  let strategicSummary = '';
  if (strat.keyBusinessDrivers?.length) {
    strategicSummary += `Key Drivers:\n${strat.keyBusinessDrivers.map(d => `  - ${d}`).join('\n')}`;
  }
  if (strat.successMetrics?.length) {
    strategicSummary += `\n\nSuccess Metrics:\n${strat.successMetrics.map(m => `  - ${m}`).join('\n')}`;
  }
  if (strat.knownConstraints) strategicSummary += `\n\nKnown Constraints: ${strat.knownConstraints}`;
  if (strat.competitivePressures) strategicSummary += `\nCompetitive Pressures: ${strat.competitivePressures}`;
  if (strat.executiveSponsor) strategicSummary += `\nExecutive Sponsor: ${strat.executiveSponsor}`;
  if (strat.additionalContext) strategicSummary += `\nAdditional Context: ${strat.additionalContext}`;

  // Determine marketing foundation
  const foundationNote = request.marketingFoundation
    ? `Marketing Foundation: ${request.marketingFoundation === 'mc-advanced'
        ? 'MC Advanced with Data Cloud (Agentforce-ready) - This is the TARGET platform, not currently implemented'
        : 'MC Engagement (standard) - This is the TARGET platform, not currently implemented'}`
    : 'Marketing Foundation: Not specified';

  return `Generate a strategic implementation plan for ${request.clientName}.

## Client Context
${contextSummary || 'No additional context provided'}
${foundationNote}

## Commercial Preferences
${commercialSummary || 'No commercial preferences specified'}

## Strategic Context
${strategicSummary || 'No strategic context provided'}

## Maturity Assessment Results
${trackSummary || 'No track assessments completed'}

Please generate a comprehensive, narrative-driven implementation plan that:
1. Acknowledges their current state and builds from it
2. Only includes phases with actual work to be done
3. References specific benchmarks and expected outcomes
4. Aligns investment recommendations with their stated budget
5. Provides industry-specific guidance where applicable
6. Creates a compelling case for action with data-backed urgency`;
}

// Build a list of reference chunks (what was actually injected into the prompt)
function buildReferenceChunks(
  dbRefData: Awaited<ReturnType<typeof fetchFormattedReferenceData>>,
  hardcodedIndustryContext: string,
  pdfKnowledge: string
): Array<{ id: string; label: string; source: 'database' | 'hardcoded'; charCount: number; preview: string }> {
  const chunks: Array<{ id: string; label: string; source: 'database' | 'hardcoded'; charCount: number; preview: string }> = [];

  if (dbRefData) {
    if (dbRefData.kpis) chunks.push({ id: 'kpis', label: 'Industry KPIs', source: 'database', charCount: dbRefData.kpis.length, preview: dbRefData.kpis.slice(0, 500) });
    if (dbRefData.journeys) chunks.push({ id: 'journeys', label: 'Journey Templates', source: 'database', charCount: dbRefData.journeys.length, preview: dbRefData.journeys.slice(0, 500) });
    if (dbRefData.roiBenchmarks) chunks.push({ id: 'roi-benchmarks-db', label: 'ROI Benchmarks', source: 'database', charCount: dbRefData.roiBenchmarks.length, preview: dbRefData.roiBenchmarks.slice(0, 500) });
    if (dbRefData.channelPriorities) chunks.push({ id: 'channel-priorities', label: 'Channel Priorities', source: 'database', charCount: dbRefData.channelPriorities.length, preview: dbRefData.channelPriorities.slice(0, 500) });
    if (dbRefData.tactics) chunks.push({ id: 'tactics', label: 'Strategic Tactics / Plays', source: 'database', charCount: dbRefData.tactics.length, preview: dbRefData.tactics.slice(0, 500) });
    if (dbRefData.offerings) chunks.push({ id: 'offerings', label: 'Service Offerings', source: 'database', charCount: dbRefData.offerings.length, preview: dbRefData.offerings.slice(0, 500) });
  } else if (hardcodedIndustryContext) {
    chunks.push({ id: 'industry-context', label: 'Industry Context (Fallback)', source: 'hardcoded', charCount: hardcodedIndustryContext.length, preview: hardcodedIndustryContext.slice(0, 500) });
  }

  chunks.push({ id: 'roi-benchmarks-hardcoded', label: 'ROI Benchmarks (Hardcoded)', source: 'hardcoded', charCount: ROI_BENCHMARKS.length, preview: ROI_BENCHMARKS.slice(0, 500) });
  chunks.push({ id: 'journey-guidance', label: 'Journey Guidance', source: 'hardcoded', charCount: JOURNEY_GUIDANCE.length, preview: JOURNEY_GUIDANCE.slice(0, 500) });
  chunks.push({ id: 'track-descriptions', label: 'Track Descriptions', source: 'hardcoded', charCount: TRACK_DESCRIPTIONS.length, preview: TRACK_DESCRIPTIONS.slice(0, 500) });
  if (pdfKnowledge) chunks.push({ id: 'pdf-knowledge', label: 'PDF Knowledge Base', source: 'hardcoded', charCount: pdfKnowledge.length, preview: pdfKnowledge.slice(0, 500) });

  return chunks;
}

// Build a generation trace object capturing full provenance of the plan
function buildGenerationTrace(
  request: PlanGenerationRequest,
  systemPrompt: string,
  userPrompt: string,
  referenceChunks: ReturnType<typeof buildReferenceChunks>,
  dbRefData: Awaited<ReturnType<typeof fetchFormattedReferenceData>>,
  quality: 'standard' | 'enhanced',
  usage: { input_tokens: number; output_tokens: number },
  cacheHit: boolean
): object {
  const ctx = request.globalInputs?.clientContext || {};
  const comm = request.globalInputs?.commercialPreferences || {};
  const strat = request.globalInputs?.strategicContext || {};

  return {
    model: 'claude-sonnet-4-20250514',
    quality,
    cacheHit,
    referenceDataSource: dbRefData ? 'database' : 'hardcoded-fallback',
    inputSummary: {
      industry: request.industry || null,
      marketingFoundation: request.marketingFoundation || null,
      companySize: (ctx as any).companySize || null,
      budgetRange: (comm as any).budgetRange || null,
      businessDrivers: (strat as any).keyBusinessDrivers || [],
      engagementModels: (comm as any).preferredEngagementModel || [],
      tracksAssessed: (request.trackAssessments || []).map(ta => ({
        trackId: ta.trackId,
        level: ta.level,
        status: ta.status,
      })),
      globalInputsProvided: !!(request.globalInputs &&
        Object.keys(request.globalInputs.commercialPreferences || {}).length > 0),
    },
    referenceChunks,
    promptStats: {
      systemPromptChars: systemPrompt.length,
      userPromptChars: userPrompt.length,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
    },
  };
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: PlanGenerationRequest = req.body;
    const quality: 'standard' | 'enhanced' = req.body.quality || 'standard';

    // Validate required fields
    if (!request.clientName) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // ===== CACHING: Check for cached plan =====
    const normalizedRequest = JSON.stringify({
      clientName: request.clientName,
      industry: request.industry,
      marketingFoundation: request.marketingFoundation,
      trackAssessments: (request.trackAssessments || [])
        .map(ta => ({ trackId: ta.trackId, level: ta.level, status: ta.status }))
        .sort((a, b) => `${a.trackId}-${a.level}`.localeCompare(`${b.trackId}-${b.level}`)),
      globalInputs: request.globalInputs,
      quality,
    });
    const cacheKey = await sha256(normalizedRequest);

    try {
      const cached = await getCachedPlan(cacheKey);
      if (cached) {
        return res.status(200).json({
          plan: cached.plan,
          usage: cached.usage,
          cached: true,
          trace: (cached.usage as any)?.trace || null,
        });
      }
    } catch (err) {
      console.error('[generate-plan] Cache lookup failed:', err);
    }

    // ===== CHUNKING: Fetch targeted reference data from DB =====
    const industryId = getIndustryTypeId(request.industry);
    const maturityLevel = request.trackAssessments?.length
      ? Math.round(request.trackAssessments.filter(ta => ta.status === 'complete').length / Math.max(request.trackAssessments.length, 1) * 3)
      : 1;

    let dbRefData: Awaited<ReturnType<typeof fetchFormattedReferenceData>> = null;
    try {
      dbRefData = await fetchFormattedReferenceData({
        industry: industryId || undefined,
        disciplines: ['messaging-personalization'], // TODO: pass from request when multi-discipline
        maturityLevel,
      });
    } catch (err) {
      console.error('[generate-plan] Reference data fetch failed, using hardcoded fallback:', err);
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = buildSystemPrompt(request, dbRefData);
    const userPrompt = buildUserPrompt(request);

    // Build reference chunks for trace (mirrors what buildSystemPrompt injected)
    const pdfKnowledgeForTrace = getPlanKnowledge(['messaging-personalization']);
    const hardcodedIndustryContext = dbRefData ? '' : buildIndustryContext(request.industry);
    const referenceChunks = buildReferenceChunks(dbRefData, hardcodedIndustryContext, pdfKnowledgeForTrace);

    let planText: string;
    let totalUsage = { input_tokens: 0, output_tokens: 0 };

    if (quality === 'enhanced') {
      // ===== MULTI-PASS: Two-stage generation =====

      // Pass 1: Generate outline
      const outlineMessage = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: userPrompt }],
        system: `${systemPrompt}\n\nIMPORTANT: For this request, generate ONLY a structured outline (not the full plan). Include:\n1. Executive summary (2-3 bullet points)\n2. Phase structure with key capabilities per phase\n3. Top 3 journey recommendations\n4. Key investment ranges\n5. Critical risks\n\nKeep it concise - this outline will be expanded into a full plan.`,
      });

      const outlineContent = outlineMessage.content.find(block => block.type === 'text');
      if (!outlineContent || outlineContent.type !== 'text') throw new Error('No outline content');

      totalUsage.input_tokens += outlineMessage.usage.input_tokens;
      totalUsage.output_tokens += outlineMessage.usage.output_tokens;

      // Pass 2: Expand outline into full plan
      const fullMessage = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: outlineContent.text },
          { role: 'user', content: 'Now expand this outline into the full strategic implementation plan with specific benchmarks, detailed phase descriptions, journey prioritization with ROI data, channel strategy, investment framework, and concrete next steps. Write it as a cohesive narrative document.' },
        ],
        system: systemPrompt,
      });

      const fullContent = fullMessage.content.find(block => block.type === 'text');
      if (!fullContent || fullContent.type !== 'text') throw new Error('No full plan content');

      planText = fullContent.text;
      totalUsage.input_tokens += fullMessage.usage.input_tokens;
      totalUsage.output_tokens += fullMessage.usage.output_tokens;

    } else {
      // ===== STANDARD: Single-pass generation =====
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
      });

      const textContent = message.content.find(block => block.type === 'text');
      if (!textContent || textContent.type !== 'text') throw new Error('No text content in response');

      planText = textContent.text;
      totalUsage = message.usage;
    }

    // Build trace
    const trace = buildGenerationTrace(
      request, systemPrompt, userPrompt,
      referenceChunks, dbRefData, quality, totalUsage, false
    );

    // ===== CACHE the result (embed trace in usage so it's retrievable from cache) =====
    await cachePlan(cacheKey, planText, { ...totalUsage, trace }).catch(err =>
      console.error('Failed to cache plan:', err)
    );

    return res.status(200).json({
      plan: planText,
      usage: totalUsage,
      cached: false,
      quality,
      trace,
    });

  } catch (error) {
    console.error('Plan generation error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate plan'
    });
  }
}
