/**
 * Industry Reference Data - Comprehensive M&P-focused reference knowledge
 * This data powers industry-specific recommendations, KPIs, journeys, and benchmarks
 */

import type { IndustryType } from '../types';

// ============================================================================
// INDUSTRY KPIs & METRICS
// ============================================================================

export interface IndustryKPI {
  id: string;
  name: string;
  description: string;
  category: 'engagement' | 'conversion' | 'retention' | 'revenue' | 'efficiency' | 'loyalty';
  typicalBenchmark?: string;
  howToMeasure?: string;
  improvementLevers?: string[];
}

export const INDUSTRY_KPIS: Record<IndustryType, IndustryKPI[]> = {
  'retail-cpg-qsr': [
    // Engagement KPIs
    {
      id: 'email-open-rate',
      name: 'Email Open Rate',
      description: 'Percentage of delivered emails that are opened',
      category: 'engagement',
      typicalBenchmark: '15-25% (retail), 20-30% (QSR)',
      howToMeasure: 'Opens / Delivered × 100',
      improvementLevers: ['Subject line optimization', 'Send time optimization', 'Segmentation', 'Personalization'],
    },
    {
      id: 'email-click-rate',
      name: 'Email Click-to-Open Rate (CTOR)',
      description: 'Percentage of email openers who click through',
      category: 'engagement',
      typicalBenchmark: '10-15%',
      howToMeasure: 'Clicks / Opens × 100',
      improvementLevers: ['Content relevance', 'CTA optimization', 'Dynamic content', 'Personalized recommendations'],
    },
    {
      id: 'sms-click-rate',
      name: 'SMS Click Rate',
      description: 'Percentage of SMS recipients who click links',
      category: 'engagement',
      typicalBenchmark: '15-30%',
      howToMeasure: 'Clicks / Delivered × 100',
      improvementLevers: ['Message timing', 'Offer relevance', 'Urgency messaging'],
    },
    {
      id: 'push-open-rate',
      name: 'Push Notification Open Rate',
      description: 'Percentage of push notifications that are opened',
      category: 'engagement',
      typicalBenchmark: '5-15%',
      howToMeasure: 'Opens / Delivered × 100',
      improvementLevers: ['Rich media', 'Personalization', 'Timing optimization', 'Geofencing'],
    },
    // Conversion KPIs
    {
      id: 'cart-abandonment-rate',
      name: 'Cart Abandonment Rate',
      description: 'Percentage of shopping carts that are abandoned before purchase',
      category: 'conversion',
      typicalBenchmark: '65-75% (opportunity to recover 5-15%)',
      howToMeasure: 'Abandoned Carts / Total Carts × 100',
      improvementLevers: ['Abandon cart journeys', 'Retargeting', 'Incentive testing', 'Checkout optimization'],
    },
    {
      id: 'browse-to-cart-rate',
      name: 'Browse to Cart Rate',
      description: 'Percentage of product viewers who add to cart',
      category: 'conversion',
      typicalBenchmark: '8-12%',
      howToMeasure: 'Add to Carts / Product Views × 100',
      improvementLevers: ['Browse abandon journeys', 'Product recommendations', 'Social proof'],
    },
    {
      id: 'email-conversion-rate',
      name: 'Email Conversion Rate',
      description: 'Percentage of email recipients who complete a purchase',
      category: 'conversion',
      typicalBenchmark: '1-5%',
      howToMeasure: 'Purchases from Email / Emails Delivered × 100',
      improvementLevers: ['Segmentation', 'Personalization', 'Journey optimization', 'Offer testing'],
    },
    // Revenue KPIs
    {
      id: 'email-attributed-revenue',
      name: 'Email-Attributed Revenue',
      description: 'Revenue directly attributed to email marketing',
      category: 'revenue',
      typicalBenchmark: '15-30% of e-commerce revenue',
      howToMeasure: 'Sum of revenue from email-attributed orders',
      improvementLevers: ['Journey expansion', 'Personalization', 'Cross-sell/upsell', 'Win-back campaigns'],
    },
    {
      id: 'revenue-per-email',
      name: 'Revenue Per Email (RPE)',
      description: 'Average revenue generated per email sent',
      category: 'revenue',
      typicalBenchmark: '$0.05-0.20',
      howToMeasure: 'Email Revenue / Emails Sent',
      improvementLevers: ['List hygiene', 'Segmentation', 'High-value customer targeting'],
    },
    {
      id: 'average-order-value',
      name: 'Average Order Value (AOV)',
      description: 'Average value of orders placed',
      category: 'revenue',
      typicalBenchmark: 'Varies by vertical ($50-150 retail, $15-25 QSR)',
      howToMeasure: 'Total Revenue / Number of Orders',
      improvementLevers: ['Cross-sell recommendations', 'Bundle offers', 'Threshold-based incentives'],
    },
    // Retention & Loyalty KPIs
    {
      id: 'purchase-frequency',
      name: 'Purchase Frequency',
      description: 'Average number of purchases per customer per period',
      category: 'retention',
      typicalBenchmark: '2-4x per year (retail), 1-2x per month (QSR)',
      howToMeasure: 'Total Orders / Unique Customers',
      improvementLevers: ['Replenishment journeys', 'Loyalty programs', 'Frequency-driving campaigns'],
    },
    {
      id: 'repeat-purchase-rate',
      name: 'Repeat Purchase Rate',
      description: 'Percentage of customers who make a second purchase',
      category: 'retention',
      typicalBenchmark: '25-40%',
      howToMeasure: 'Customers with 2+ Orders / Total Customers × 100',
      improvementLevers: ['Post-purchase journeys', 'Second purchase incentives', 'Product education'],
    },
    {
      id: 'customer-lifetime-value',
      name: 'Customer Lifetime Value (CLV)',
      description: 'Predicted total value of a customer relationship',
      category: 'revenue',
      typicalBenchmark: '3-5x AOV (varies significantly)',
      howToMeasure: 'AOV × Purchase Frequency × Customer Lifespan',
      improvementLevers: ['Retention programs', 'CLV-based segmentation', 'High-value customer treatment'],
    },
    {
      id: 'loyalty-enrollment-rate',
      name: 'Loyalty Program Enrollment Rate',
      description: 'Percentage of customers enrolled in loyalty program',
      category: 'loyalty',
      typicalBenchmark: '30-50% of active customers',
      howToMeasure: 'Loyalty Members / Total Customers × 100',
      improvementLevers: ['Enrollment journeys', 'Program visibility', 'Sign-up incentives'],
    },
    {
      id: 'loyalty-engagement-rate',
      name: 'Loyalty Member Engagement Rate',
      description: 'Percentage of loyalty members actively earning/redeeming',
      category: 'loyalty',
      typicalBenchmark: '40-60%',
      howToMeasure: 'Active Members / Total Members × 100',
      improvementLevers: ['Tier progression journeys', 'Points expiration reminders', 'Member-exclusive offers'],
    },
    // Efficiency KPIs
    {
      id: 'list-growth-rate',
      name: 'Email List Growth Rate',
      description: 'Net growth of email subscriber list',
      category: 'efficiency',
      typicalBenchmark: '2-5% monthly',
      howToMeasure: '(New Subscribers - Unsubscribes) / Total List × 100',
      improvementLevers: ['Acquisition campaigns', 'Pop-up optimization', 'Value proposition'],
    },
    {
      id: 'unsubscribe-rate',
      name: 'Unsubscribe Rate',
      description: 'Percentage of recipients who unsubscribe per send',
      category: 'efficiency',
      typicalBenchmark: '<0.5%',
      howToMeasure: 'Unsubscribes / Emails Delivered × 100',
      improvementLevers: ['Frequency optimization', 'Preference centers', 'Content relevance'],
    },
  ],

  'financial-services': [
    // Engagement KPIs
    {
      id: 'email-open-rate',
      name: 'Email Open Rate',
      description: 'Percentage of delivered emails that are opened',
      category: 'engagement',
      typicalBenchmark: '20-30%',
      howToMeasure: 'Opens / Delivered × 100',
      improvementLevers: ['Subject line optimization', 'Sender name testing', 'Personalization'],
    },
    {
      id: 'digital-engagement-rate',
      name: 'Digital Engagement Rate',
      description: 'Percentage of customers engaging with digital channels',
      category: 'engagement',
      typicalBenchmark: '50-70% for active customers',
      howToMeasure: 'Digitally Engaged Customers / Total Customers × 100',
      improvementLevers: ['Digital adoption journeys', 'App download campaigns', 'Online banking promotion'],
    },
    // Conversion KPIs
    {
      id: 'application-completion-rate',
      name: 'Application Completion Rate',
      description: 'Percentage of started applications that are completed',
      category: 'conversion',
      typicalBenchmark: '30-50%',
      howToMeasure: 'Completed Applications / Started Applications × 100',
      improvementLevers: ['Abandon application journeys', 'Form optimization', 'Save progress reminders'],
    },
    {
      id: 'cross-sell-rate',
      name: 'Product Cross-Sell Rate',
      description: 'Percentage of customers who purchase additional products',
      category: 'conversion',
      typicalBenchmark: '10-20%',
      howToMeasure: 'Customers with 2+ Products / Total Customers × 100',
      improvementLevers: ['Product recommendation journeys', 'Life event triggers', 'Needs-based segmentation'],
    },
    {
      id: 'account-activation-rate',
      name: 'Account Activation Rate',
      description: 'Percentage of new accounts that become active',
      category: 'conversion',
      typicalBenchmark: '60-80%',
      howToMeasure: 'Active Accounts / New Accounts × 100',
      improvementLevers: ['Onboarding journeys', 'First action incentives', 'Education campaigns'],
    },
    // Retention KPIs
    {
      id: 'customer-retention-rate',
      name: 'Customer Retention Rate',
      description: 'Percentage of customers retained over a period',
      category: 'retention',
      typicalBenchmark: '85-95% annually',
      howToMeasure: '(End Customers - New Customers) / Start Customers × 100',
      improvementLevers: ['At-risk customer journeys', 'Loyalty programs', 'Proactive service outreach'],
    },
    {
      id: 'churn-rate',
      name: 'Customer Churn Rate',
      description: 'Percentage of customers who close accounts',
      category: 'retention',
      typicalBenchmark: '5-15% annually',
      howToMeasure: 'Closed Accounts / Total Accounts × 100',
      improvementLevers: ['Churn prediction models', 'Retention offers', 'Win-back campaigns'],
    },
    // Revenue KPIs
    {
      id: 'product-penetration',
      name: 'Products Per Customer',
      description: 'Average number of products held per customer',
      category: 'revenue',
      typicalBenchmark: '2-4 products',
      howToMeasure: 'Total Products / Total Customers',
      improvementLevers: ['Cross-sell journeys', 'Bundle promotions', 'Life stage marketing'],
    },
    {
      id: 'customer-profitability',
      name: 'Customer Profitability',
      description: 'Revenue minus cost to serve per customer',
      category: 'revenue',
      typicalBenchmark: 'Top 20% drive 80% of profit',
      howToMeasure: 'Customer Revenue - Cost to Serve',
      improvementLevers: ['High-value customer programs', 'Digital channel migration', 'Self-service promotion'],
    },
    // Efficiency KPIs
    {
      id: 'digital-adoption-rate',
      name: 'Digital Adoption Rate',
      description: 'Percentage of transactions done through digital channels',
      category: 'efficiency',
      typicalBenchmark: '70-90%',
      howToMeasure: 'Digital Transactions / Total Transactions × 100',
      improvementLevers: ['Digital education campaigns', 'Feature adoption journeys', 'Incentive programs'],
    },
    {
      id: 'nps-score',
      name: 'Net Promoter Score (NPS)',
      description: 'Customer loyalty and satisfaction metric',
      category: 'loyalty',
      typicalBenchmark: '30-50 (financial services)',
      howToMeasure: '% Promoters - % Detractors',
      improvementLevers: ['Post-interaction surveys', 'Closed-loop feedback', 'Experience optimization'],
    },
  ],

  'healthcare-life-sciences': [
    // Engagement KPIs
    {
      id: 'hcp-engagement-rate',
      name: 'HCP Engagement Rate',
      description: 'Percentage of healthcare professionals engaging with content',
      category: 'engagement',
      typicalBenchmark: '15-25%',
      howToMeasure: 'Engaged HCPs / Total HCPs Contacted × 100',
      improvementLevers: ['Content personalization', 'Channel preference optimization', 'Peer-to-peer content'],
    },
    {
      id: 'patient-email-engagement',
      name: 'Patient Email Engagement Rate',
      description: 'Combined open and click rates for patient communications',
      category: 'engagement',
      typicalBenchmark: '25-35% open rate, 3-8% click rate',
      howToMeasure: 'Opens or Clicks / Delivered × 100',
      improvementLevers: ['Health literacy optimization', 'Timing based on condition', 'Caregiver inclusion'],
    },
    {
      id: 'content-consumption-rate',
      name: 'Content Consumption Rate',
      description: 'Percentage of content assets consumed by target audience',
      category: 'engagement',
      typicalBenchmark: '20-40%',
      howToMeasure: 'Content Views / Content Sends × 100',
      improvementLevers: ['Content relevance', 'Format optimization', 'Modular content approach'],
    },
    // Conversion KPIs
    {
      id: 'patient-enrollment-rate',
      name: 'Patient Program Enrollment Rate',
      description: 'Percentage of eligible patients who enroll in support programs',
      category: 'conversion',
      typicalBenchmark: '10-30%',
      howToMeasure: 'Enrolled Patients / Eligible Patients × 100',
      improvementLevers: ['Enrollment journey optimization', 'HCP recommendation', 'Barrier reduction'],
    },
    {
      id: 'hcp-conversion-rate',
      name: 'HCP Conversion Rate',
      description: 'Percentage of HCPs who take desired action (sample request, etc.)',
      category: 'conversion',
      typicalBenchmark: '5-15%',
      howToMeasure: 'HCPs Taking Action / HCPs Engaged × 100',
      improvementLevers: ['Clear CTAs', 'Value demonstration', 'Peer influence'],
    },
    // Retention/Adherence KPIs
    {
      id: 'patient-adherence-rate',
      name: 'Patient Adherence Rate',
      description: 'Percentage of patients adhering to treatment regimen',
      category: 'retention',
      typicalBenchmark: '50-70% (varies by condition)',
      howToMeasure: 'Adherent Patients / Total Patients × 100',
      improvementLevers: ['Adherence reminder journeys', 'Education content', 'Support program enrollment'],
    },
    {
      id: 'patient-retention-rate',
      name: 'Patient Retention Rate',
      description: 'Percentage of patients continuing treatment',
      category: 'retention',
      typicalBenchmark: '60-80% at 12 months',
      howToMeasure: 'Patients Still on Therapy / Patients Started × 100',
      improvementLevers: ['Persistence programs', 'Side effect management', 'Refill reminders'],
    },
    {
      id: 'program-completion-rate',
      name: 'Program Completion Rate',
      description: 'Percentage of patients completing support programs',
      category: 'retention',
      typicalBenchmark: '40-60%',
      howToMeasure: 'Completed Programs / Enrolled Patients × 100',
      improvementLevers: ['Milestone celebrations', 'Progress tracking', 'Re-engagement journeys'],
    },
    // Efficiency KPIs
    {
      id: 'mlr-approval-time',
      name: 'MLR Approval Cycle Time',
      description: 'Average time for medical/legal/regulatory content approval',
      category: 'efficiency',
      typicalBenchmark: '2-6 weeks',
      howToMeasure: 'Sum of Approval Times / Number of Assets',
      improvementLevers: ['Modular content', 'Pre-approved templates', 'Streamlined workflows'],
    },
    {
      id: 'content-reuse-rate',
      name: 'Content Reuse Rate',
      description: 'Percentage of content assets reused across channels',
      category: 'efficiency',
      typicalBenchmark: '30-50%',
      howToMeasure: 'Reused Assets / Total Assets × 100',
      improvementLevers: ['Modular content architecture', 'Asset management', 'Cross-team collaboration'],
    },
  ],

  'manufacturing': [
    // Engagement KPIs
    {
      id: 'email-engagement-rate',
      name: 'Email Engagement Rate',
      description: 'Combined metric of opens and clicks',
      category: 'engagement',
      typicalBenchmark: '20-30% open rate, 2-5% click rate',
      howToMeasure: 'Opens or Clicks / Delivered × 100',
      improvementLevers: ['Account-based personalization', 'Industry-specific content', 'Decision-maker targeting'],
    },
    {
      id: 'account-engagement-score',
      name: 'Account Engagement Score',
      description: 'Composite score of account-level engagement',
      category: 'engagement',
      typicalBenchmark: 'Varies by scoring model',
      howToMeasure: 'Weighted sum of engagement activities per account',
      improvementLevers: ['Multi-touch campaigns', 'Content variety', 'Channel diversification'],
    },
    {
      id: 'dealer-portal-engagement',
      name: 'Dealer/Distributor Portal Engagement',
      description: 'Percentage of dealers actively using partner portal',
      category: 'engagement',
      typicalBenchmark: '40-60%',
      howToMeasure: 'Active Portal Users / Total Dealers × 100',
      improvementLevers: ['Dealer enablement programs', 'Training content', 'Incentive communications'],
    },
    // Conversion KPIs
    {
      id: 'lead-to-opportunity-rate',
      name: 'Lead to Opportunity Rate',
      description: 'Percentage of marketing leads that become sales opportunities',
      category: 'conversion',
      typicalBenchmark: '10-20%',
      howToMeasure: 'Opportunities Created / MQLs × 100',
      improvementLevers: ['Lead scoring optimization', 'Nurture journeys', 'Sales alignment'],
    },
    {
      id: 'rfq-conversion-rate',
      name: 'RFQ Conversion Rate',
      description: 'Percentage of quotes that convert to orders',
      category: 'conversion',
      typicalBenchmark: '20-40%',
      howToMeasure: 'Orders / Quotes Submitted × 100',
      improvementLevers: ['Quote follow-up journeys', 'Competitive positioning', 'Decision-maker engagement'],
    },
    {
      id: 'product-registration-rate',
      name: 'Product Registration Rate',
      description: 'Percentage of products registered by end users',
      category: 'conversion',
      typicalBenchmark: '20-40%',
      howToMeasure: 'Registered Products / Products Sold × 100',
      improvementLevers: ['Registration reminder journeys', 'Incentive programs', 'Simplified registration'],
    },
    // Retention KPIs
    {
      id: 'account-retention-rate',
      name: 'Account Retention Rate',
      description: 'Percentage of accounts that continue purchasing',
      category: 'retention',
      typicalBenchmark: '80-90%',
      howToMeasure: 'Retained Accounts / Total Accounts × 100',
      improvementLevers: ['Account health monitoring', 'Proactive outreach', 'Value demonstration'],
    },
    {
      id: 'warranty-renewal-rate',
      name: 'Extended Warranty Renewal Rate',
      description: 'Percentage of customers who renew extended warranties',
      category: 'retention',
      typicalBenchmark: '30-50%',
      howToMeasure: 'Renewals / Expiring Warranties × 100',
      improvementLevers: ['Expiration reminder journeys', 'Value communication', 'Easy renewal process'],
    },
    // Revenue KPIs
    {
      id: 'parts-attachment-rate',
      name: 'Parts/Service Attachment Rate',
      description: 'Revenue from parts and service vs. product sales',
      category: 'revenue',
      typicalBenchmark: '15-30% of total revenue',
      howToMeasure: 'Parts/Service Revenue / Total Revenue × 100',
      improvementLevers: ['Maintenance reminder journeys', 'Parts recommendation', 'Service contract promotion'],
    },
    {
      id: 'dealer-sell-through-rate',
      name: 'Dealer Sell-Through Rate',
      description: 'Rate at which dealers sell allocated inventory',
      category: 'revenue',
      typicalBenchmark: '60-80%',
      howToMeasure: 'Units Sold / Units Allocated × 100',
      improvementLevers: ['Dealer enablement', 'Co-marketing campaigns', 'Demand generation support'],
    },
  ],

  'travel-hospitality': [
    // Engagement KPIs
    {
      id: 'email-engagement-rate',
      name: 'Email Engagement Rate',
      description: 'Percentage of emails opened and clicked',
      category: 'engagement',
      typicalBenchmark: '20-30% open rate, 3-6% click rate',
      howToMeasure: 'Opens or Clicks / Delivered × 100',
      improvementLevers: ['Destination personalization', 'Trip stage targeting', 'Loyalty tier messaging'],
    },
    {
      id: 'app-engagement-rate',
      name: 'Mobile App Engagement Rate',
      description: 'Percentage of app users actively engaging',
      category: 'engagement',
      typicalBenchmark: '30-50% monthly active',
      howToMeasure: 'Active App Users / Total App Users × 100',
      improvementLevers: ['Push notification optimization', 'In-app messaging', 'Feature adoption journeys'],
    },
    {
      id: 'loyalty-member-engagement',
      name: 'Loyalty Member Engagement',
      description: 'Percentage of loyalty members engaging with program',
      category: 'engagement',
      typicalBenchmark: '40-60%',
      howToMeasure: 'Active Members / Total Members × 100',
      improvementLevers: ['Tier progression journeys', 'Points balance reminders', 'Exclusive offers'],
    },
    // Conversion KPIs
    {
      id: 'booking-abandonment-recovery',
      name: 'Booking Abandonment Recovery Rate',
      description: 'Percentage of abandoned bookings recovered',
      category: 'conversion',
      typicalBenchmark: '5-15%',
      howToMeasure: 'Recovered Bookings / Abandoned Bookings × 100',
      improvementLevers: ['Abandon journey timing', 'Incentive testing', 'Urgency messaging'],
    },
    {
      id: 'direct-booking-rate',
      name: 'Direct Booking Rate',
      description: 'Percentage of bookings made directly vs. OTA',
      category: 'conversion',
      typicalBenchmark: '30-50%',
      howToMeasure: 'Direct Bookings / Total Bookings × 100',
      improvementLevers: ['Direct booking incentives', 'Loyalty benefits', 'Price match guarantees'],
    },
    {
      id: 'upgrade-conversion-rate',
      name: 'Upgrade Conversion Rate',
      description: 'Percentage of guests who accept upgrade offers',
      category: 'conversion',
      typicalBenchmark: '5-15%',
      howToMeasure: 'Upgrades Accepted / Upgrades Offered × 100',
      improvementLevers: ['Personalized upgrade offers', 'Timing optimization', 'Value communication'],
    },
    // Retention & Loyalty KPIs
    {
      id: 'repeat-booking-rate',
      name: 'Repeat Booking Rate',
      description: 'Percentage of guests who book again',
      category: 'retention',
      typicalBenchmark: '30-50%',
      howToMeasure: 'Repeat Guests / Total Guests × 100',
      improvementLevers: ['Post-stay journeys', 'Loyalty enrollment', 'Win-back campaigns'],
    },
    {
      id: 'loyalty-tier-progression',
      name: 'Loyalty Tier Progression Rate',
      description: 'Percentage of members advancing tiers',
      category: 'loyalty',
      typicalBenchmark: '10-20% annually',
      howToMeasure: 'Members Advancing / Total Members × 100',
      improvementLevers: ['Tier threshold campaigns', 'Accelerator offers', 'Status match programs'],
    },
    {
      id: 'loyalty-redemption-rate',
      name: 'Loyalty Points Redemption Rate',
      description: 'Percentage of earned points that are redeemed',
      category: 'loyalty',
      typicalBenchmark: '40-60%',
      howToMeasure: 'Points Redeemed / Points Earned × 100',
      improvementLevers: ['Redemption promotion', 'Low-point reward options', 'Expiration reminders'],
    },
    // Revenue KPIs
    {
      id: 'ancillary-revenue-per-guest',
      name: 'Ancillary Revenue Per Guest',
      description: 'Non-room/fare revenue per guest',
      category: 'revenue',
      typicalBenchmark: '$50-150 (hotels), $50-100 (airlines)',
      howToMeasure: 'Total Ancillary Revenue / Total Guests',
      improvementLevers: ['Pre-arrival upsell', 'On-property messaging', 'Personalized offers'],
    },
    {
      id: 'revenue-per-available-room',
      name: 'RevPAR / Revenue Per Available Room',
      description: 'Key hotel performance metric',
      category: 'revenue',
      typicalBenchmark: 'Varies by market and segment',
      howToMeasure: 'Room Revenue / Available Rooms',
      improvementLevers: ['Dynamic pricing', 'Demand generation', 'Length of stay optimization'],
    },
  ],

  'media-entertainment': [
    // Engagement KPIs
    {
      id: 'email-engagement-rate',
      name: 'Email Engagement Rate',
      description: 'Percentage of emails opened and clicked',
      category: 'engagement',
      typicalBenchmark: '20-35% open rate, 3-8% click rate',
      howToMeasure: 'Opens or Clicks / Delivered × 100',
      improvementLevers: ['Content personalization', 'New release alerts', 'Viewing-based recommendations'],
    },
    {
      id: 'content-engagement-rate',
      name: 'Content Engagement Rate',
      description: 'Percentage of subscribers actively consuming content',
      category: 'engagement',
      typicalBenchmark: '60-80% monthly active',
      howToMeasure: 'Active Viewers / Total Subscribers × 100',
      improvementLevers: ['Re-engagement journeys', 'Content discovery', 'Personalized recommendations'],
    },
    {
      id: 'push-notification-engagement',
      name: 'Push Notification Engagement',
      description: 'Percentage of push notifications that drive action',
      category: 'engagement',
      typicalBenchmark: '5-15%',
      howToMeasure: 'Actions / Notifications Sent × 100',
      improvementLevers: ['Personalization', 'Timing optimization', 'Content relevance'],
    },
    // Conversion KPIs
    {
      id: 'trial-conversion-rate',
      name: 'Free Trial Conversion Rate',
      description: 'Percentage of free trials that convert to paid',
      category: 'conversion',
      typicalBenchmark: '30-50%',
      howToMeasure: 'Paid Conversions / Trial Starts × 100',
      improvementLevers: ['Trial experience optimization', 'Conversion journeys', 'Feature education'],
    },
    {
      id: 'ad-tier-conversion',
      name: 'Ad-Free Tier Conversion Rate',
      description: 'Percentage of ad-supported users who upgrade',
      category: 'conversion',
      typicalBenchmark: '5-15%',
      howToMeasure: 'Upgrades / Ad-Supported Users × 100',
      improvementLevers: ['Upgrade promotion journeys', 'Value demonstration', 'Limited-time offers'],
    },
    // Retention KPIs
    {
      id: 'subscriber-churn-rate',
      name: 'Subscriber Churn Rate',
      description: 'Percentage of subscribers who cancel',
      category: 'retention',
      typicalBenchmark: '3-7% monthly',
      howToMeasure: 'Cancellations / Total Subscribers × 100',
      improvementLevers: ['Churn prediction', 'At-risk intervention', 'Win-back offers'],
    },
    {
      id: 'voluntary-churn-rate',
      name: 'Voluntary Churn Rate',
      description: 'Percentage who actively cancel (vs. passive/payment failure)',
      category: 'retention',
      typicalBenchmark: '2-4% monthly',
      howToMeasure: 'Active Cancellations / Total Subscribers × 100',
      improvementLevers: ['Cancel save flow', 'Pause options', 'Downgrade alternatives'],
    },
    {
      id: 'winback-rate',
      name: 'Win-Back Success Rate',
      description: 'Percentage of churned subscribers who return',
      category: 'retention',
      typicalBenchmark: '10-20%',
      howToMeasure: 'Returning Subscribers / Churned Subscribers × 100',
      improvementLevers: ['Win-back journey timing', 'Offer optimization', 'New content promotion'],
    },
    // Revenue KPIs
    {
      id: 'arpu',
      name: 'Average Revenue Per User (ARPU)',
      description: 'Average monthly revenue per subscriber',
      category: 'revenue',
      typicalBenchmark: '$10-20 (streaming)',
      howToMeasure: 'Total Revenue / Total Subscribers',
      improvementLevers: ['Tier upgrade promotion', 'Add-on sales', 'Price optimization'],
    },
    {
      id: 'subscriber-lifetime-value',
      name: 'Subscriber Lifetime Value',
      description: 'Total expected revenue per subscriber',
      category: 'revenue',
      typicalBenchmark: 'ARPU × Average Subscriber Lifespan',
      howToMeasure: 'ARPU × (1 / Monthly Churn Rate)',
      improvementLevers: ['Churn reduction', 'ARPU growth', 'Engagement optimization'],
    },
  ],

  'technology': [
    // Engagement KPIs
    {
      id: 'email-engagement-rate',
      name: 'Email Engagement Rate',
      description: 'Percentage of emails opened and clicked',
      category: 'engagement',
      typicalBenchmark: '20-30% open rate, 3-7% click rate',
      howToMeasure: 'Opens or Clicks / Delivered × 100',
      improvementLevers: ['Persona-based content', 'Product usage triggers', 'Feature education'],
    },
    {
      id: 'product-engagement-score',
      name: 'Product Engagement Score',
      description: 'Composite score of product usage and engagement',
      category: 'engagement',
      typicalBenchmark: 'Varies by product (aim for top quartile)',
      howToMeasure: 'Weighted sum of product usage activities',
      improvementLevers: ['Feature adoption campaigns', 'In-app guidance', 'Usage milestone celebrations'],
    },
    {
      id: 'feature-adoption-rate',
      name: 'Feature Adoption Rate',
      description: 'Percentage of users adopting key features',
      category: 'engagement',
      typicalBenchmark: '20-50% for new features',
      howToMeasure: 'Users Using Feature / Total Users × 100',
      improvementLevers: ['Feature announcement campaigns', 'In-product education', 'Use case content'],
    },
    // Conversion KPIs
    {
      id: 'trial-conversion-rate',
      name: 'Trial to Paid Conversion Rate',
      description: 'Percentage of free trials that convert to paid',
      category: 'conversion',
      typicalBenchmark: '15-30% (varies by model)',
      howToMeasure: 'Paid Conversions / Trial Starts × 100',
      improvementLevers: ['Onboarding optimization', 'Time-to-value acceleration', 'Conversion journeys'],
    },
    {
      id: 'pql-conversion-rate',
      name: 'PQL to Customer Conversion Rate',
      description: 'Percentage of product-qualified leads that become customers',
      category: 'conversion',
      typicalBenchmark: '20-40%',
      howToMeasure: 'Customers / PQLs × 100',
      improvementLevers: ['PQL definition refinement', 'Sales-assist timing', 'Automated nurture'],
    },
    {
      id: 'expansion-rate',
      name: 'Expansion Revenue Rate',
      description: 'Revenue growth from existing customers',
      category: 'conversion',
      typicalBenchmark: '20-40% of new ARR',
      howToMeasure: 'Expansion ARR / Total New ARR × 100',
      improvementLevers: ['Usage-based upsell triggers', 'Account expansion campaigns', 'Success milestones'],
    },
    // Retention KPIs
    {
      id: 'net-revenue-retention',
      name: 'Net Revenue Retention (NRR)',
      description: 'Revenue retention including expansion and contraction',
      category: 'retention',
      typicalBenchmark: '100-130%',
      howToMeasure: '(Starting ARR + Expansion - Contraction - Churn) / Starting ARR × 100',
      improvementLevers: ['Churn reduction', 'Expansion programs', 'Customer success'],
    },
    {
      id: 'logo-retention-rate',
      name: 'Logo Retention Rate',
      description: 'Percentage of customers retained',
      category: 'retention',
      typicalBenchmark: '85-95% annually',
      howToMeasure: 'Retained Customers / Starting Customers × 100',
      improvementLevers: ['Health score monitoring', 'At-risk intervention', 'Value realization'],
    },
    {
      id: 'renewal-rate',
      name: 'Renewal Rate',
      description: 'Percentage of contracts that renew',
      category: 'retention',
      typicalBenchmark: '80-95%',
      howToMeasure: 'Renewed Contracts / Expiring Contracts × 100',
      improvementLevers: ['Renewal journey automation', 'Early engagement', 'Value documentation'],
    },
    // Revenue KPIs
    {
      id: 'customer-acquisition-cost',
      name: 'Customer Acquisition Cost (CAC)',
      description: 'Cost to acquire a new customer',
      category: 'efficiency',
      typicalBenchmark: 'Varies (target CAC payback < 18 months)',
      howToMeasure: 'Total Sales & Marketing Cost / New Customers',
      improvementLevers: ['Channel optimization', 'Conversion improvement', 'PLG efficiency'],
    },
    {
      id: 'ltv-cac-ratio',
      name: 'LTV:CAC Ratio',
      description: 'Ratio of customer lifetime value to acquisition cost',
      category: 'efficiency',
      typicalBenchmark: '3:1 or higher',
      howToMeasure: 'Customer LTV / CAC',
      improvementLevers: ['LTV improvement', 'CAC reduction', 'Retention focus'],
    },
    {
      id: 'time-to-value',
      name: 'Time to Value',
      description: 'Time for new customers to realize value',
      category: 'efficiency',
      typicalBenchmark: 'Varies (shorter is better)',
      howToMeasure: 'Days from signup to first value milestone',
      improvementLevers: ['Onboarding optimization', 'Guided setup', 'Quick win campaigns'],
    },
  ],
};

// ============================================================================
// INDUSTRY-SPECIFIC JOURNEY MAPPINGS
// ============================================================================

export interface IndustryJourney {
  journeyId: string;
  industryName: string; // Industry-specific name for this journey
  relevance: 'critical' | 'high' | 'medium' | 'low' | 'not-applicable';
  industryNotes?: string;
  typicalTriggers?: string[];
  industryBenchmarks?: {
    metric: string;
    value: string;
  }[];
}

export const INDUSTRY_JOURNEY_MAPPINGS: Record<IndustryType, IndustryJourney[]> = {
  'retail-cpg-qsr': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'Welcome Series',
      relevance: 'critical',
      industryNotes: 'Focus on second purchase incentive. For QSR, drive app download and loyalty enrollment.',
      typicalTriggers: ['Email signup', 'Account creation', 'First purchase', 'Loyalty enrollment'],
      industryBenchmarks: [
        { metric: 'Transaction rate vs. promo', value: '+320%' },
        { metric: 'Second purchase rate', value: '25-35%' },
      ],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Cart Abandonment',
      relevance: 'critical',
      industryNotes: 'Multi-touch series with escalating incentives. Consider inventory-aware messaging.',
      typicalTriggers: ['Cart abandon after 1hr', 'High-value cart abandon', 'Repeat abandoner'],
      industryBenchmarks: [
        { metric: 'Recovery rate', value: '5-15%' },
        { metric: 'Revenue recovered', value: '3-8% of abandoned value' },
      ],
    },
    {
      journeyId: 'browse-abandon',
      industryName: 'Browse Abandonment',
      relevance: 'high',
      industryNotes: 'Target product viewers who didn\'t add to cart. Use product recommendations.',
      typicalTriggers: ['Category view', 'Product detail view', 'Search without purchase'],
      industryBenchmarks: [
        { metric: 'Conversion rate', value: '1-3%' },
      ],
    },
    {
      journeyId: 'purchase-confirmation',
      industryName: 'Order Confirmation & Updates',
      relevance: 'high',
      industryNotes: 'Opportunity for cross-sell. For QSR, include order status and pickup instructions.',
      typicalTriggers: ['Order placed', 'Order shipped', 'Order ready for pickup'],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'Post-Purchase Review Request',
      relevance: 'high',
      industryNotes: 'Time based on product type. Include product recommendations for next purchase.',
      typicalTriggers: ['Delivery confirmed', 'X days post-purchase'],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Lapsed Customer Win-Back',
      relevance: 'critical',
      industryNotes: 'Define lapsed based on typical purchase frequency. Escalate channel and incentive.',
      typicalTriggers: ['No purchase in X days', 'Predicted to lapse', 'Loyalty status at risk'],
      industryBenchmarks: [
        { metric: 'Win-back rate', value: '5-15%' },
      ],
    },
    {
      journeyId: 're-engagement',
      industryName: 'Email Re-Engagement',
      relevance: 'high',
      industryNotes: 'Re-engage before suppressing. Consider multi-channel approach.',
      typicalTriggers: ['No email open in 90+ days', 'Declining engagement score'],
    },
    {
      journeyId: 'birthday',
      industryName: 'Birthday Celebration',
      relevance: 'critical',
      industryNotes: 'High-performing journey. For QSR, offer free item. For retail, offer discount.',
      typicalTriggers: ['Birthday month/week/day'],
      industryBenchmarks: [
        { metric: 'Transaction rate vs. promo', value: '+481%' },
        { metric: 'Redemption rate', value: '15-25%' },
      ],
    },
    {
      journeyId: 'back-in-stock',
      industryName: 'Back in Stock / Seasonal Launch',
      relevance: 'high',
      industryNotes: 'Notify waitlist and recent viewers. For QSR, use for LTO returns.',
      typicalTriggers: ['Product restocked', 'Seasonal item launch', 'LTO announcement'],
    },
    {
      journeyId: 'affinity',
      industryName: 'Product Recommendations',
      relevance: 'high',
      industryNotes: 'Use browse/purchase history for personalization. Consider cross-category discovery.',
      typicalTriggers: ['Post-purchase', 'Category affinity identified', 'Periodic digest'],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'New Product Announcements',
      relevance: 'medium',
      industryNotes: 'Target based on category affinity. For QSR, announce new menu items.',
      typicalTriggers: ['New product launch', 'New collection', 'Menu update'],
    },
    {
      journeyId: 'curbside-pickup',
      industryName: 'Order Ready / Pickup Notification',
      relevance: 'high',
      industryNotes: 'Critical for BOPIS and QSR. Use SMS/push for time-sensitive updates.',
      typicalTriggers: ['Order ready', 'Arriving at store', 'Delayed order'],
    },
    {
      journeyId: 'purchase-anniversary',
      industryName: 'Customer Anniversary',
      relevance: 'medium',
      industryNotes: 'Celebrate first purchase anniversary or membership anniversary.',
      typicalTriggers: ['1 year since first purchase', 'Loyalty anniversary'],
    },
  ],

  'financial-services': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'Account Onboarding',
      relevance: 'critical',
      industryNotes: 'Focus on activation milestones: first login, first transaction, digital enrollment.',
      typicalTriggers: ['Account opened', 'Application approved', 'Card received'],
      industryBenchmarks: [
        { metric: 'Activation rate', value: '60-80%' },
        { metric: 'Digital enrollment', value: '70-85%' },
      ],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Application Abandonment',
      relevance: 'critical',
      industryNotes: 'Recovery for abandoned product applications. Consider compliance requirements.',
      typicalTriggers: ['Application started not completed', 'Quote requested not converted'],
      industryBenchmarks: [
        { metric: 'Recovery rate', value: '10-25%' },
      ],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Dormant Account Reactivation',
      relevance: 'high',
      industryNotes: 'Re-engage inactive accounts. Highlight new features and benefits.',
      typicalTriggers: ['No login in X days', 'No transactions in X days', 'Declining balance'],
    },
    {
      journeyId: 're-engagement',
      industryName: 'Digital Engagement Re-Activation',
      relevance: 'high',
      industryNotes: 'Drive digital channel adoption. Promote app features and self-service.',
      typicalTriggers: ['No digital activity', 'Branch-only customer', 'App uninstall'],
    },
    {
      journeyId: 'birthday',
      industryName: 'Birthday / Milestone Recognition',
      relevance: 'medium',
      industryNotes: 'Relationship building. Consider account anniversary as alternative.',
      typicalTriggers: ['Birthday', 'Account anniversary', 'Tenure milestone'],
    },
    {
      journeyId: 'affinity',
      industryName: 'Product Recommendations',
      relevance: 'high',
      industryNotes: 'Cross-sell based on life stage and product holdings. Compliance-approved content.',
      typicalTriggers: ['Life event signal', 'Product eligibility', 'Needs analysis completion'],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'Post-Interaction Feedback',
      relevance: 'medium',
      industryNotes: 'NPS and satisfaction surveys. Close the loop on feedback.',
      typicalTriggers: ['Post-service interaction', 'Post-application', 'Annual review'],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'New Product / Feature Announcements',
      relevance: 'medium',
      industryNotes: 'Announce new products and digital features. Segment by eligibility.',
      typicalTriggers: ['Product launch', 'Feature release', 'Rate change'],
    },
    {
      journeyId: 'browse-abandon',
      industryName: 'Product Interest Follow-Up',
      relevance: 'medium',
      industryNotes: 'Follow up on product research activity. Offer consultation.',
      typicalTriggers: ['Rate comparison viewed', 'Product page visited', 'Calculator used'],
    },
  ],

  'healthcare-life-sciences': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'Patient/HCP Onboarding',
      relevance: 'critical',
      industryNotes: 'For patients: program enrollment and education. For HCPs: resource introduction.',
      typicalTriggers: ['Program enrollment', 'First prescription', 'HCP registration'],
      industryBenchmarks: [
        { metric: 'Program completion', value: '40-60%' },
      ],
    },
    {
      journeyId: 'affinity',
      industryName: 'Educational Content Series',
      relevance: 'critical',
      industryNotes: 'Disease education, treatment information, lifestyle guidance. MLR-approved content.',
      typicalTriggers: ['Diagnosis', 'Treatment start', 'Content request', 'Condition milestone'],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Adherence / Persistence Recovery',
      relevance: 'critical',
      industryNotes: 'Re-engage patients showing adherence gaps. Address barriers to persistence.',
      typicalTriggers: ['Missed refill', 'Gap in therapy', 'Side effect reported'],
      industryBenchmarks: [
        { metric: 'Persistence improvement', value: '10-20%' },
      ],
    },
    {
      journeyId: 're-engagement',
      industryName: 'HCP Re-Engagement',
      relevance: 'high',
      industryNotes: 'Re-engage HCPs with declining interaction. New clinical data and resources.',
      typicalTriggers: ['Declining engagement', 'No sample requests', 'No rep visits'],
    },
    {
      journeyId: 'back-in-stock',
      industryName: 'Refill / Renewal Reminders',
      relevance: 'critical',
      industryNotes: 'Proactive refill reminders. Connect to pharmacy and support programs.',
      typicalTriggers: ['Refill due', 'Prescription expiring', 'Prior authorization needed'],
      industryBenchmarks: [
        { metric: 'Refill rate improvement', value: '15-25%' },
      ],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'Patient Check-In / Feedback',
      relevance: 'high',
      industryNotes: 'Check on patient experience and outcomes. Identify support needs.',
      typicalTriggers: ['Post-start check-in', 'Milestone reached', 'Program completion'],
    },
    {
      journeyId: 'birthday',
      industryName: 'Patient Milestone Celebration',
      relevance: 'low',
      industryNotes: 'Celebrate treatment milestones rather than birthday. Condition-appropriate.',
      typicalTriggers: ['Treatment anniversary', 'Health milestone achieved'],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'New Indication / Study Results',
      relevance: 'high',
      industryNotes: 'Communicate new clinical data and indications to HCPs. MLR-approved.',
      typicalTriggers: ['Study publication', 'New indication approval', 'Guideline update'],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Enrollment Abandonment',
      relevance: 'medium',
      industryNotes: 'Follow up on incomplete program enrollments.',
      typicalTriggers: ['Partial enrollment', 'Consent not completed'],
    },
  ],

  'manufacturing': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'Customer/Dealer Onboarding',
      relevance: 'critical',
      industryNotes: 'Product registration, training resources, portal access setup.',
      typicalTriggers: ['Product purchase', 'Dealer onboarding', 'Portal registration'],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Quote/RFQ Follow-Up',
      relevance: 'high',
      industryNotes: 'Follow up on quotes and RFQs that haven\'t converted.',
      typicalTriggers: ['Quote viewed not accepted', 'RFQ submitted no response', 'Configurator abandon'],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Lapsed Account Re-Engagement',
      relevance: 'high',
      industryNotes: 'Re-engage accounts with declining purchase activity.',
      typicalTriggers: ['No orders in X months', 'Declining order volume', 'Lost deal'],
    },
    {
      journeyId: 'back-in-stock',
      industryName: 'Maintenance / Service Reminders',
      relevance: 'critical',
      industryNotes: 'Proactive maintenance reminders. Parts and service promotion.',
      typicalTriggers: ['Service interval due', 'Warranty expiring', 'Parts replacement schedule'],
      industryBenchmarks: [
        { metric: 'Service attach rate', value: '+20-30%' },
      ],
    },
    {
      journeyId: 'affinity',
      industryName: 'Cross-Sell / Parts Recommendations',
      relevance: 'high',
      industryNotes: 'Recommend related products, parts, and accessories.',
      typicalTriggers: ['Post-purchase', 'Usage milestone', 'Seasonal relevance'],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'Product Feedback / NPS',
      relevance: 'medium',
      industryNotes: 'Gather product feedback and satisfaction scores.',
      typicalTriggers: ['Post-delivery', 'Post-service', 'Usage milestone'],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'New Product / Model Announcements',
      relevance: 'high',
      industryNotes: 'Announce new products to relevant segments. Include dealer enablement.',
      typicalTriggers: ['Product launch', 'Model year update', 'Trade show'],
    },
    {
      journeyId: 're-engagement',
      industryName: 'Dealer/Distributor Re-Engagement',
      relevance: 'medium',
      industryNotes: 'Re-engage dealers with declining activity. Training and incentive focus.',
      typicalTriggers: ['Declining sales', 'Low portal engagement', 'Training overdue'],
    },
    {
      journeyId: 'purchase-anniversary',
      industryName: 'Warranty Renewal',
      relevance: 'high',
      industryNotes: 'Extended warranty and service contract renewal campaigns.',
      typicalTriggers: ['Warranty expiring', 'Service contract renewal due'],
    },
  ],

  'travel-hospitality': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'Loyalty Program Welcome',
      relevance: 'critical',
      industryNotes: 'Program benefits education, first booking incentive, app download.',
      typicalTriggers: ['Loyalty enrollment', 'First booking', 'App download'],
      industryBenchmarks: [
        { metric: 'First booking rate', value: '30-50%' },
      ],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Booking Abandonment',
      relevance: 'critical',
      industryNotes: 'Recover abandoned bookings. Consider price alerts and urgency messaging.',
      typicalTriggers: ['Search abandon', 'Booking page abandon', 'Payment abandon'],
      industryBenchmarks: [
        { metric: 'Recovery rate', value: '5-15%' },
      ],
    },
    {
      journeyId: 'purchase-confirmation',
      industryName: 'Booking Confirmation & Pre-Trip',
      relevance: 'critical',
      industryNotes: 'Confirmation, pre-arrival/departure communications, upsell opportunities.',
      typicalTriggers: ['Booking confirmed', 'X days before trip', 'Day before arrival'],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'Post-Stay/Trip Feedback',
      relevance: 'high',
      industryNotes: 'Satisfaction survey, review request, next booking incentive.',
      typicalTriggers: ['Check-out', 'Return flight', 'Trip completion'],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Lapsed Traveler Win-Back',
      relevance: 'high',
      industryNotes: 'Re-engage guests who haven\'t booked recently. Status reinstatement offers.',
      typicalTriggers: ['No booking in X months', 'Status at risk', 'Points expiring'],
    },
    {
      journeyId: 'birthday',
      industryName: 'Birthday / Anniversary',
      relevance: 'high',
      industryNotes: 'Celebratory offer. Bonus points or upgrade offers.',
      typicalTriggers: ['Birthday', 'Loyalty anniversary', 'Membership milestone'],
    },
    {
      journeyId: 'back-in-stock',
      industryName: 'Price Drop / Availability Alerts',
      relevance: 'high',
      industryNotes: 'Alert for price drops on searched routes/properties.',
      typicalTriggers: ['Price decrease', 'Availability opened', 'Flash sale'],
    },
    {
      journeyId: 'affinity',
      industryName: 'Destination Recommendations',
      relevance: 'high',
      industryNotes: 'Personalized destination and property recommendations.',
      typicalTriggers: ['Past travel history', 'Searched destinations', 'Seasonal relevance'],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'New Route / Property Announcements',
      relevance: 'medium',
      industryNotes: 'Announce new destinations, routes, or properties.',
      typicalTriggers: ['New route launch', 'Property opening', 'Seasonal launch'],
    },
    {
      journeyId: 're-engagement',
      industryName: 'Points Expiration / Status Reminder',
      relevance: 'high',
      industryNotes: 'Prevent points expiration and status loss. Urgency messaging.',
      typicalTriggers: ['Points expiring', 'Status downgrade pending', 'Declining activity'],
    },
  ],

  'media-entertainment': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'Subscriber Onboarding',
      relevance: 'critical',
      industryNotes: 'Content discovery, profile setup, feature education.',
      typicalTriggers: ['Trial start', 'Subscription start', 'App install'],
      industryBenchmarks: [
        { metric: 'Trial-to-paid conversion', value: '30-50%' },
      ],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Signup Abandonment',
      relevance: 'high',
      industryNotes: 'Recover abandoned signup and payment flows.',
      typicalTriggers: ['Signup abandon', 'Payment page abandon', 'Trial not started'],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Churned Subscriber Win-Back',
      relevance: 'critical',
      industryNotes: 'Win back canceled subscribers. Highlight new content and offers.',
      typicalTriggers: ['Subscription canceled', 'X days post-cancel', 'New content release'],
      industryBenchmarks: [
        { metric: 'Win-back rate', value: '10-20%' },
      ],
    },
    {
      journeyId: 're-engagement',
      industryName: 'Engagement Decline Intervention',
      relevance: 'critical',
      industryNotes: 'Intervene when viewing activity declines. Content recommendations.',
      typicalTriggers: ['No viewing in X days', 'Declining engagement score', 'Predicted churn'],
      industryBenchmarks: [
        { metric: 'Churn reduction', value: '10-25%' },
      ],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'New Content Alerts',
      relevance: 'critical',
      industryNotes: 'Personalized new release notifications. Drive viewing engagement.',
      typicalTriggers: ['New season release', 'New title in genre', 'Watchlist available'],
    },
    {
      journeyId: 'affinity',
      industryName: 'Content Recommendations',
      relevance: 'critical',
      industryNotes: 'Personalized content recommendations based on viewing history.',
      typicalTriggers: ['Post-completion', 'Weekly digest', 'Similar content available'],
    },
    {
      journeyId: 'back-in-stock',
      industryName: 'Returning Series / Content',
      relevance: 'high',
      industryNotes: 'Alert when favorite series return or content becomes available.',
      typicalTriggers: ['New season announced', 'Previously watched show returns'],
    },
    {
      journeyId: 'birthday',
      industryName: 'Subscriber Anniversary',
      relevance: 'low',
      industryNotes: 'Celebrate membership anniversary. Thank you messaging.',
      typicalTriggers: ['Subscription anniversary', 'Viewing milestone'],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'Content Feedback / Ratings',
      relevance: 'medium',
      industryNotes: 'Encourage content ratings to improve recommendations.',
      typicalTriggers: ['Content completed', 'Series finished'],
    },
  ],

  'technology': [
    {
      journeyId: 'welcome-onboarding',
      industryName: 'User Onboarding',
      relevance: 'critical',
      industryNotes: 'Time-to-value focus. Feature adoption, integration setup, quick wins.',
      typicalTriggers: ['Trial start', 'Account creation', 'Plan upgrade'],
      industryBenchmarks: [
        { metric: 'Activation rate', value: '40-70%' },
        { metric: 'Time to first value', value: 'Target < 7 days' },
      ],
    },
    {
      journeyId: 'cart-abandon',
      industryName: 'Trial/Signup Abandonment',
      relevance: 'high',
      industryNotes: 'Recover abandoned signups and trial starts.',
      typicalTriggers: ['Signup abandon', 'Trial not activated', 'Pricing page abandon'],
    },
    {
      journeyId: 'purchase-winback',
      industryName: 'Churned Customer Win-Back',
      relevance: 'high',
      industryNotes: 'Win back churned accounts. Highlight new features and improvements.',
      typicalTriggers: ['Subscription canceled', 'Account downgraded', 'Contract not renewed'],
    },
    {
      journeyId: 're-engagement',
      industryName: 'Usage Decline Intervention',
      relevance: 'critical',
      industryNotes: 'Intervene when product usage declines. Feature education and support.',
      typicalTriggers: ['Declining usage', 'Feature adoption drop', 'Support ticket patterns'],
      industryBenchmarks: [
        { metric: 'Churn prevention', value: '15-30%' },
      ],
    },
    {
      journeyId: 'new-arrivals',
      industryName: 'Feature Announcements',
      relevance: 'high',
      industryNotes: 'Announce new features and capabilities. Drive adoption.',
      typicalTriggers: ['Feature release', 'Product update', 'Beta invitation'],
    },
    {
      journeyId: 'affinity',
      industryName: 'Feature/Plan Recommendations',
      relevance: 'high',
      industryNotes: 'Recommend features and plan upgrades based on usage patterns.',
      typicalTriggers: ['Usage threshold reached', 'Feature discovery', 'Plan limits approaching'],
    },
    {
      journeyId: 'post-purchase-review',
      industryName: 'NPS / Product Feedback',
      relevance: 'high',
      industryNotes: 'Regular NPS surveys and feature feedback. Close the loop.',
      typicalTriggers: ['Usage milestone', 'Support resolution', 'Renewal period'],
    },
    {
      journeyId: 'back-in-stock',
      industryName: 'Renewal Reminders',
      relevance: 'critical',
      industryNotes: 'Proactive renewal communication. Value reinforcement.',
      typicalTriggers: ['Contract expiring', 'Annual renewal due', 'Usage review'],
    },
    {
      journeyId: 'birthday',
      industryName: 'Customer Anniversary',
      relevance: 'low',
      industryNotes: 'Celebrate customer anniversary. Usage stats and appreciation.',
      typicalTriggers: ['Account anniversary', 'Usage milestone'],
    },
    {
      journeyId: 'purchase-anniversary',
      industryName: 'Contract Renewal',
      relevance: 'critical',
      industryNotes: 'Annual contract renewal journey with value documentation.',
      typicalTriggers: ['90 days before renewal', '60 days before renewal', '30 days before renewal'],
    },
  ],
};

// ============================================================================
// INDUSTRY DATA SOURCES
// ============================================================================

export interface IndustryDataSource {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dataTypes: string[];
  commonSystems?: string[];
  integrationComplexity: 'low' | 'medium' | 'high';
  enablesCapabilities: string[];
}

export const INDUSTRY_DATA_SOURCES: Record<IndustryType, IndustryDataSource[]> = {
  'retail-cpg-qsr': [
    {
      id: 'pos-transactions',
      name: 'POS / Transaction Data',
      description: 'Point of sale transaction history, purchase data',
      priority: 'critical',
      dataTypes: ['Transactions', 'Products', 'Store locations', 'Payment methods'],
      commonSystems: ['Square', 'Shopify POS', 'Oracle Retail', 'NCR', 'Toast (QSR)'],
      integrationComplexity: 'high',
      enablesCapabilities: ['customer-lifecycle-journeys', 'clv-modeling', 'identity-resolution'],
    },
    {
      id: 'ecommerce-platform',
      name: 'E-commerce Platform',
      description: 'Online store data including browse, cart, and purchase behavior',
      priority: 'critical',
      dataTypes: ['Browse behavior', 'Cart data', 'Orders', 'Customer accounts'],
      commonSystems: ['Shopify', 'Salesforce Commerce Cloud', 'Magento', 'BigCommerce'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'scale-dynamic-content', 'baseline-subscriber-journeys'],
    },
    {
      id: 'loyalty-program',
      name: 'Loyalty / Rewards Platform',
      description: 'Loyalty program membership, points, tiers, and redemption',
      priority: 'critical',
      dataTypes: ['Member profiles', 'Points balances', 'Tier status', 'Redemptions'],
      commonSystems: ['Salesforce Loyalty Management', 'Punchh', 'Paytronix', 'SessionM'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['baseline-subscriber-journeys', 'customer-lifecycle-journeys', 'identity-resolution'],
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Data',
      description: 'App usage, in-app behavior, push preferences',
      priority: 'high',
      dataTypes: ['App events', 'Feature usage', 'Push tokens', 'Preferences'],
      commonSystems: ['Firebase', 'Amplitude', 'mParticle', 'Custom apps'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['cross-channel-activation', 'insight-driven-experiences'],
    },
    {
      id: 'delivery-platforms',
      name: 'Third-Party Delivery',
      description: 'Orders from delivery aggregators',
      priority: 'medium',
      dataTypes: ['Orders', 'Customer data (limited)'],
      commonSystems: ['DoorDash', 'UberEats', 'Grubhub', 'Instacart'],
      integrationComplexity: 'high',
      enablesCapabilities: ['identity-resolution', 'customer-lifecycle-journeys'],
    },
    {
      id: 'cdp-data-warehouse',
      name: 'CDP / Data Warehouse',
      description: 'Unified customer data from enterprise data platform',
      priority: 'high',
      dataTypes: ['Unified profiles', 'Aggregated behaviors', 'Calculated attributes'],
      commonSystems: ['Snowflake', 'Databricks', 'Google BigQuery', 'Adobe CDP'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['identity-resolution', 'clv-modeling', 'insight-driven-experiences'],
    },
  ],

  'financial-services': [
    {
      id: 'core-banking',
      name: 'Core Banking System',
      description: 'Account data, transactions, product holdings',
      priority: 'critical',
      dataTypes: ['Accounts', 'Transactions', 'Balances', 'Products'],
      commonSystems: ['Temenos', 'FIS', 'Fiserv', 'Jack Henry'],
      integrationComplexity: 'high',
      enablesCapabilities: ['customer-lifecycle-journeys', 'identity-resolution', 'data-exploration'],
    },
    {
      id: 'crm-system',
      name: 'CRM / Sales Cloud',
      description: 'Customer relationships, opportunities, interactions',
      priority: 'critical',
      dataTypes: ['Contacts', 'Opportunities', 'Activities', 'Cases'],
      commonSystems: ['Salesforce Financial Services Cloud', 'Microsoft Dynamics'],
      integrationComplexity: 'low',
      enablesCapabilities: ['baseline-subscriber-journeys', 'enhance-planned-campaigns'],
    },
    {
      id: 'digital-banking',
      name: 'Digital Banking Platform',
      description: 'Online and mobile banking activity',
      priority: 'high',
      dataTypes: ['Logins', 'Feature usage', 'Digital transactions'],
      commonSystems: ['Q2', 'Backbase', 'Custom platforms'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'insight-driven-experiences'],
    },
    {
      id: 'wealth-platform',
      name: 'Wealth Management Platform',
      description: 'Investment accounts, portfolios, advisory data',
      priority: 'high',
      dataTypes: ['Portfolios', 'Holdings', 'Transactions', 'Goals'],
      commonSystems: ['Envestnet', 'Black Diamond', 'Orion'],
      integrationComplexity: 'high',
      enablesCapabilities: ['customer-lifecycle-journeys', 'clv-modeling'],
    },
    {
      id: 'consent-management',
      name: 'Consent Management Platform',
      description: 'Marketing consent and preference data',
      priority: 'critical',
      dataTypes: ['Consents', 'Preferences', 'Opt-outs'],
      commonSystems: ['OneTrust', 'TrustArc', 'Salesforce Consent Management'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['baseline-subscriber-journeys', 'cross-channel-activation'],
    },
  ],

  'healthcare-life-sciences': [
    {
      id: 'crm-veeva',
      name: 'Veeva CRM / HCP Data',
      description: 'Healthcare professional data and engagement history',
      priority: 'critical',
      dataTypes: ['HCP profiles', 'Interactions', 'Call data', 'Samples'],
      commonSystems: ['Veeva CRM', 'IQVIA', 'Salesforce Health Cloud'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'enhance-planned-campaigns'],
    },
    {
      id: 'patient-support',
      name: 'Patient Support Programs',
      description: 'Patient enrollment and support program data',
      priority: 'critical',
      dataTypes: ['Enrollments', 'Program status', 'Adherence data'],
      commonSystems: ['Custom platforms', 'IQVIA', 'Specialty pharmacy systems'],
      integrationComplexity: 'high',
      enablesCapabilities: ['baseline-subscriber-journeys', 'customer-lifecycle-journeys'],
    },
    {
      id: 'prescription-data',
      name: 'Prescription / Claims Data',
      description: 'De-identified prescription and claims information',
      priority: 'high',
      dataTypes: ['Rx data', 'Claims', 'TRx/NRx metrics'],
      commonSystems: ['IQVIA', 'Symphony Health', 'Komodo Health'],
      integrationComplexity: 'high',
      enablesCapabilities: ['data-exploration', 'insight-driven-experiences'],
    },
    {
      id: 'consent-hub',
      name: 'Consent Management / Hub',
      description: 'Patient consent and communication preferences',
      priority: 'critical',
      dataTypes: ['Consents', 'Preferences', 'HIPAA authorization'],
      commonSystems: ['Custom consent hubs', 'Veeva Vault'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['baseline-subscriber-journeys'],
    },
    {
      id: 'content-management',
      name: 'Content Management / DAM',
      description: 'MLR-approved content assets',
      priority: 'high',
      dataTypes: ['Approved content', 'Expiration dates', 'Usage rights'],
      commonSystems: ['Veeva Vault', 'Adobe Experience Manager'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['scale-dynamic-content', 'enhance-planned-campaigns'],
    },
  ],

  'manufacturing': [
    {
      id: 'erp-system',
      name: 'ERP System',
      description: 'Orders, inventory, customer accounts',
      priority: 'critical',
      dataTypes: ['Orders', 'Inventory', 'Accounts', 'Invoices'],
      commonSystems: ['SAP', 'Oracle', 'Microsoft Dynamics 365', 'NetSuite'],
      integrationComplexity: 'high',
      enablesCapabilities: ['customer-lifecycle-journeys', 'data-exploration'],
    },
    {
      id: 'dealer-portal',
      name: 'Dealer / Distributor Portal',
      description: 'Partner portal activity and data',
      priority: 'high',
      dataTypes: ['Partner profiles', 'Portal activity', 'Certifications'],
      commonSystems: ['Salesforce PRM', 'Custom portals'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['baseline-subscriber-journeys', 'enhance-planned-campaigns'],
    },
    {
      id: 'product-registration',
      name: 'Product Registration System',
      description: 'Registered products and warranty data',
      priority: 'high',
      dataTypes: ['Registrations', 'Warranties', 'Product ownership'],
      commonSystems: ['Custom systems', 'ServiceMax'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'identity-resolution'],
    },
    {
      id: 'service-platform',
      name: 'Field Service / Support',
      description: 'Service history, cases, support interactions',
      priority: 'high',
      dataTypes: ['Service orders', 'Cases', 'Parts usage'],
      commonSystems: ['Salesforce Field Service', 'ServiceMax', 'SAP FSM'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'baseline-subscriber-journeys'],
    },
    {
      id: 'crm-system',
      name: 'CRM / Sales Cloud',
      description: 'Account and opportunity data',
      priority: 'critical',
      dataTypes: ['Accounts', 'Contacts', 'Opportunities', 'Activities'],
      commonSystems: ['Salesforce Sales Cloud', 'Microsoft Dynamics'],
      integrationComplexity: 'low',
      enablesCapabilities: ['enhance-planned-campaigns', 'baseline-subscriber-journeys'],
    },
  ],

  'travel-hospitality': [
    {
      id: 'reservation-system',
      name: 'Reservation / PMS System',
      description: 'Bookings, stays, guest profiles',
      priority: 'critical',
      dataTypes: ['Reservations', 'Stay history', 'Guest preferences'],
      commonSystems: ['Opera', 'Amadeus', 'Sabre', 'Custom PMS'],
      integrationComplexity: 'high',
      enablesCapabilities: ['customer-lifecycle-journeys', 'scale-dynamic-content'],
    },
    {
      id: 'loyalty-platform',
      name: 'Loyalty Program Platform',
      description: 'Membership, points, tiers, redemptions',
      priority: 'critical',
      dataTypes: ['Members', 'Points', 'Tiers', 'Redemptions'],
      commonSystems: ['Salesforce Loyalty', 'Oracle Hospitality', 'Custom platforms'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['baseline-subscriber-journeys', 'customer-lifecycle-journeys', 'identity-resolution'],
    },
    {
      id: 'booking-engine',
      name: 'Direct Booking Engine',
      description: 'Website booking behavior and conversions',
      priority: 'high',
      dataTypes: ['Searches', 'Cart data', 'Bookings', 'Abandons'],
      commonSystems: ['Custom engines', 'SynXis', 'Pegasus'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'insight-driven-experiences'],
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Data',
      description: 'App usage, mobile check-in, in-stay engagement',
      priority: 'high',
      dataTypes: ['App events', 'Mobile check-in', 'In-stay requests'],
      commonSystems: ['Custom apps', 'ALICE', 'Zingle'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['cross-channel-activation', 'customer-lifecycle-journeys'],
    },
    {
      id: 'revenue-management',
      name: 'Revenue Management System',
      description: 'Pricing, availability, demand forecasting',
      priority: 'medium',
      dataTypes: ['Rates', 'Availability', 'Demand signals'],
      commonSystems: ['IDeaS', 'Duetto', 'Rainmaker'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['scale-dynamic-content', 'insight-driven-experiences'],
    },
  ],

  'media-entertainment': [
    {
      id: 'subscriber-platform',
      name: 'Subscriber Management Platform',
      description: 'Subscription status, billing, plan details',
      priority: 'critical',
      dataTypes: ['Subscriptions', 'Billing', 'Plans', 'Entitlements'],
      commonSystems: ['Zuora', 'Recurly', 'Custom platforms'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'baseline-subscriber-journeys'],
    },
    {
      id: 'viewing-data',
      name: 'Viewing / Consumption Data',
      description: 'Content consumption and engagement data',
      priority: 'critical',
      dataTypes: ['Views', 'Watch time', 'Completion rates', 'Preferences'],
      commonSystems: ['Custom analytics', 'Conviva', 'Nielsen'],
      integrationComplexity: 'high',
      enablesCapabilities: ['scale-dynamic-content', 'insight-driven-experiences', 'einstein-engagement-scoring'],
    },
    {
      id: 'content-catalog',
      name: 'Content Catalog / CMS',
      description: 'Content metadata, availability, recommendations',
      priority: 'high',
      dataTypes: ['Content metadata', 'Availability', 'Genres', 'Cast'],
      commonSystems: ['Custom CMS', 'Contentful', 'Adobe Experience Manager'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['scale-dynamic-content', 'baseline-subscriber-journeys'],
    },
    {
      id: 'identity-platform',
      name: 'Identity / Authentication',
      description: 'User accounts, profiles, device registrations',
      priority: 'high',
      dataTypes: ['Profiles', 'Devices', 'Authentication events'],
      commonSystems: ['Auth0', 'Okta', 'Custom identity'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['identity-resolution', 'cross-channel-activation'],
    },
    {
      id: 'ad-platform',
      name: 'Ad Server / Monetization',
      description: 'Ad delivery, monetization, audience data',
      priority: 'medium',
      dataTypes: ['Ad impressions', 'Revenue', 'Audience segments'],
      commonSystems: ['Google Ad Manager', 'FreeWheel', 'SpotX'],
      integrationComplexity: 'high',
      enablesCapabilities: ['data-exploration', 'insight-driven-experiences'],
    },
  ],

  'technology': [
    {
      id: 'product-telemetry',
      name: 'Product Usage / Telemetry',
      description: 'Product usage data, feature adoption, events',
      priority: 'critical',
      dataTypes: ['Usage events', 'Feature adoption', 'Session data'],
      commonSystems: ['Amplitude', 'Mixpanel', 'Pendo', 'Heap'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'insight-driven-experiences', 'einstein-engagement-scoring'],
    },
    {
      id: 'crm-system',
      name: 'CRM / Sales Cloud',
      description: 'Accounts, opportunities, sales activities',
      priority: 'critical',
      dataTypes: ['Accounts', 'Opportunities', 'Activities', 'ARR'],
      commonSystems: ['Salesforce Sales Cloud', 'HubSpot'],
      integrationComplexity: 'low',
      enablesCapabilities: ['enhance-planned-campaigns', 'baseline-subscriber-journeys'],
    },
    {
      id: 'billing-subscription',
      name: 'Billing / Subscription Platform',
      description: 'Subscription status, billing, revenue data',
      priority: 'critical',
      dataTypes: ['Subscriptions', 'MRR/ARR', 'Invoices', 'Payments'],
      commonSystems: ['Stripe', 'Zuora', 'Chargebee', 'Recurly'],
      integrationComplexity: 'medium',
      enablesCapabilities: ['customer-lifecycle-journeys', 'clv-modeling'],
    },
    {
      id: 'support-platform',
      name: 'Support / Success Platform',
      description: 'Support tickets, customer health, success data',
      priority: 'high',
      dataTypes: ['Tickets', 'Health scores', 'NPS', 'Success milestones'],
      commonSystems: ['Salesforce Service Cloud', 'Zendesk', 'Gainsight', 'Totango'],
      integrationComplexity: 'low',
      enablesCapabilities: ['customer-lifecycle-journeys', 'insight-driven-experiences'],
    },
    {
      id: 'marketing-automation',
      name: 'Marketing Automation Platform',
      description: 'Lead scoring, nurture data, campaign history',
      priority: 'high',
      dataTypes: ['Leads', 'Scores', 'Campaign engagement'],
      commonSystems: ['Marketo', 'HubSpot', 'Pardot', 'Salesforce Marketing Cloud'],
      integrationComplexity: 'low',
      enablesCapabilities: ['enhance-planned-campaigns', 'baseline-subscriber-journeys'],
    },
  ],
};

// ============================================================================
// INDUSTRY CHANNEL PRIORITIES
// ============================================================================

export interface IndustryChannelPriority {
  channel: 'email' | 'sms' | 'push' | 'ads' | 'direct-mail' | 'in-app';
  priority: 'critical' | 'high' | 'medium' | 'low';
  industryNotes: string;
  bestUseCases: string[];
  typicalVolume?: string;
}

export const INDUSTRY_CHANNEL_PRIORITIES: Record<IndustryType, IndustryChannelPriority[]> = {
  'retail-cpg-qsr': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Foundation channel for retail. High volume, cost-effective for promotions and journeys.',
      bestUseCases: ['Promotions', 'Welcome series', 'Post-purchase', 'Win-back', 'Newsletters'],
      typicalVolume: 'Weekly promotional + triggered journeys',
    },
    {
      channel: 'sms',
      priority: 'critical',
      industryNotes: 'Essential for QSR and time-sensitive retail offers. High engagement rates.',
      bestUseCases: ['Flash sales', 'Order updates', 'LTO announcements', 'Loyalty rewards', 'Pickup notifications'],
      typicalVolume: '2-4 per month promotional + transactional',
    },
    {
      channel: 'push',
      priority: 'high',
      industryNotes: 'Critical for QSR with mobile app. Lower cost than SMS for app users.',
      bestUseCases: ['Order ready', 'Nearby offers', 'Flash sales', 'Loyalty updates', 'New arrivals'],
      typicalVolume: '3-5 per week for engaged app users',
    },
    {
      channel: 'ads',
      priority: 'high',
      industryNotes: 'Retargeting and suppression critical for efficiency. Lookalike for acquisition.',
      bestUseCases: ['Cart abandonment', 'Browse retargeting', 'Suppression', 'Lookalike acquisition'],
    },
    {
      channel: 'direct-mail',
      priority: 'medium',
      industryNotes: 'Effective for high-value customers and win-back. Consider cost-per-piece.',
      bestUseCases: ['VIP customers', 'Win-back (deep lapsed)', 'New store openings', 'Catalogs'],
    },
    {
      channel: 'in-app',
      priority: 'high',
      industryNotes: 'Important for mobile-first retailers and QSR with apps.',
      bestUseCases: ['Feature education', 'Promotions', 'Order status', 'Loyalty engagement'],
    },
  ],

  'financial-services': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Primary channel for financial communications. Audit trail capability important.',
      bestUseCases: ['Onboarding', 'Product cross-sell', 'Statements', 'Service updates', 'Educational content'],
      typicalVolume: '2-4 per month + transactional',
    },
    {
      channel: 'sms',
      priority: 'high',
      industryNotes: 'Important for security alerts and time-sensitive notifications. Regulatory considerations.',
      bestUseCases: ['Fraud alerts', 'Payment reminders', 'Authentication', 'Service notifications'],
      typicalVolume: 'Primarily transactional + limited promotional',
    },
    {
      channel: 'push',
      priority: 'medium',
      industryNotes: 'Growing importance with mobile banking adoption.',
      bestUseCases: ['Account alerts', 'Transaction notifications', 'Security alerts', 'Feature announcements'],
    },
    {
      channel: 'ads',
      priority: 'medium',
      industryNotes: 'Use for acquisition and suppression. Privacy and compliance considerations.',
      bestUseCases: ['Suppression', 'Acquisition targeting', 'Brand awareness'],
    },
    {
      channel: 'direct-mail',
      priority: 'high',
      industryNotes: 'Still important for high-value communications and certain demographics.',
      bestUseCases: ['Welcome kits', 'Legal notices', 'High-value offers', 'Wealth management communications'],
    },
    {
      channel: 'in-app',
      priority: 'high',
      industryNotes: 'Critical for digital banking experience and feature adoption.',
      bestUseCases: ['Feature education', 'Product offers', 'Secure messaging', 'Financial tips'],
    },
  ],

  'healthcare-life-sciences': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Primary channel for both HCP and patient communications. MLR approval required.',
      bestUseCases: ['HCP education', 'Patient support', 'Adherence programs', 'Clinical updates'],
      typicalVolume: '2-4 per month (HCP), weekly (patient programs)',
    },
    {
      channel: 'sms',
      priority: 'high',
      industryNotes: 'Important for patient adherence reminders. Consent and HIPAA considerations.',
      bestUseCases: ['Refill reminders', 'Appointment reminders', 'Program check-ins'],
      typicalVolume: 'Primarily transactional/reminder-based',
    },
    {
      channel: 'push',
      priority: 'medium',
      industryNotes: 'Relevant for patient support apps. Limited use for HCP.',
      bestUseCases: ['Medication reminders', 'Program updates', 'Health tips'],
    },
    {
      channel: 'ads',
      priority: 'low',
      industryNotes: 'Limited use due to regulatory constraints. DTC advertising where permitted.',
      bestUseCases: ['Disease awareness', 'DTC (where allowed)', 'HCP congress targeting'],
    },
    {
      channel: 'direct-mail',
      priority: 'medium',
      industryNotes: 'Used for HCP and patient education materials. Compliance considerations.',
      bestUseCases: ['HCP samples/literature', 'Patient education kits', 'Welcome materials'],
    },
    {
      channel: 'in-app',
      priority: 'medium',
      industryNotes: 'Growing importance with patient support apps.',
      bestUseCases: ['Medication tracking', 'Educational content', 'Support resources'],
    },
  ],

  'manufacturing': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Primary B2B communication channel. Multi-stakeholder targeting important.',
      bestUseCases: ['Product announcements', 'Dealer communications', 'Service reminders', 'Technical content'],
      typicalVolume: 'Monthly newsletters + triggered journeys',
    },
    {
      channel: 'sms',
      priority: 'low',
      industryNotes: 'Limited use in B2B manufacturing context.',
      bestUseCases: ['Service technician notifications', 'Urgent alerts'],
    },
    {
      channel: 'push',
      priority: 'low',
      industryNotes: 'Relevant only if mobile app exists for dealers/customers.',
      bestUseCases: ['Dealer portal notifications', 'Service app alerts'],
    },
    {
      channel: 'ads',
      priority: 'medium',
      industryNotes: 'Account-based advertising for target accounts.',
      bestUseCases: ['ABM campaigns', 'Trade show promotion', 'Retargeting'],
    },
    {
      channel: 'direct-mail',
      priority: 'medium',
      industryNotes: 'Still effective for B2B, especially for high-value targets.',
      bestUseCases: ['Product launches', 'Trade show invitations', 'Executive outreach', 'Catalogs'],
    },
    {
      channel: 'in-app',
      priority: 'low',
      industryNotes: 'Relevant for dealer/service portals.',
      bestUseCases: ['Training prompts', 'Certification reminders', 'Portal announcements'],
    },
  ],

  'travel-hospitality': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Essential for bookings, pre/post-trip communications, and loyalty.',
      bestUseCases: ['Booking confirmation', 'Pre-arrival', 'Post-stay', 'Loyalty communications', 'Promotions'],
      typicalVolume: 'Trip-triggered + 2-4 promotional per month',
    },
    {
      channel: 'sms',
      priority: 'critical',
      industryNotes: 'Critical for time-sensitive travel communications and service.',
      bestUseCases: ['Flight/check-in alerts', 'Upgrade offers', 'Service notifications', 'Concierge'],
      typicalVolume: 'Trip-based + limited promotional',
    },
    {
      channel: 'push',
      priority: 'high',
      industryNotes: 'Important for mobile app users, especially during trips.',
      bestUseCases: ['Flight updates', 'Check-in reminders', 'On-property offers', 'Loyalty updates'],
    },
    {
      channel: 'ads',
      priority: 'high',
      industryNotes: 'Important for retargeting abandoned bookings and destination inspiration.',
      bestUseCases: ['Booking abandonment', 'Destination retargeting', 'Loyalty acquisition'],
    },
    {
      channel: 'direct-mail',
      priority: 'medium',
      industryNotes: 'Used for elite loyalty members and special promotions.',
      bestUseCases: ['Elite member communications', 'Credit card offers', 'Destination guides'],
    },
    {
      channel: 'in-app',
      priority: 'high',
      industryNotes: 'Critical during travel experience.',
      bestUseCases: ['Mobile check-in', 'Upgrade offers', 'In-stay services', 'Loyalty engagement'],
    },
  ],

  'media-entertainment': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Key for subscriber communications and content promotion.',
      bestUseCases: ['Content recommendations', 'New releases', 'Subscription management', 'Re-engagement'],
      typicalVolume: 'Weekly content digest + triggered journeys',
    },
    {
      channel: 'sms',
      priority: 'medium',
      industryNotes: 'Used for urgent notifications and win-back. Lower priority than push.',
      bestUseCases: ['Subscription issues', 'Win-back offers', 'Live event alerts'],
    },
    {
      channel: 'push',
      priority: 'critical',
      industryNotes: 'Primary engagement channel for mobile/streaming apps.',
      bestUseCases: ['New releases', 'Personalized recommendations', 'Continue watching', 'Live events'],
      typicalVolume: '3-5 per week personalized',
    },
    {
      channel: 'ads',
      priority: 'medium',
      industryNotes: 'Used for acquisition and win-back campaigns.',
      bestUseCases: ['Trial acquisition', 'Win-back', 'Content promotion'],
    },
    {
      channel: 'direct-mail',
      priority: 'low',
      industryNotes: 'Limited use, primarily for win-back or premium tiers.',
      bestUseCases: ['Deep lapsed win-back', 'Premium subscriber perks'],
    },
    {
      channel: 'in-app',
      priority: 'critical',
      industryNotes: 'Essential for content discovery and engagement.',
      bestUseCases: ['Content recommendations', 'New release highlights', 'Feature education', 'Upsell'],
    },
  ],

  'technology': [
    {
      channel: 'email',
      priority: 'critical',
      industryNotes: 'Primary communication channel for product updates and customer success.',
      bestUseCases: ['Onboarding', 'Feature announcements', 'Usage triggers', 'Renewal communications'],
      typicalVolume: 'Triggered journeys + monthly product updates',
    },
    {
      channel: 'sms',
      priority: 'low',
      industryNotes: 'Limited use for SaaS. Security notifications if applicable.',
      bestUseCases: ['Security alerts', 'Account notifications'],
    },
    {
      channel: 'push',
      priority: 'medium',
      industryNotes: 'Relevant for mobile apps and browser notifications.',
      bestUseCases: ['Feature announcements', 'Usage milestones', 'Browser notifications'],
    },
    {
      channel: 'ads',
      priority: 'high',
      industryNotes: 'Important for ABM and retargeting.',
      bestUseCases: ['ABM campaigns', 'Trial retargeting', 'Expansion targeting'],
    },
    {
      channel: 'direct-mail',
      priority: 'low',
      industryNotes: 'Used for enterprise accounts and special campaigns.',
      bestUseCases: ['Enterprise ABM', 'Event invitations', 'Executive outreach'],
    },
    {
      channel: 'in-app',
      priority: 'critical',
      industryNotes: 'Essential for product-led growth and feature adoption.',
      bestUseCases: ['Onboarding tours', 'Feature education', 'Upgrade prompts', 'NPS surveys'],
    },
  ],
};

// ============================================================================
// INDUSTRY ROI BENCHMARKS
// ============================================================================

export interface IndustryROIBenchmark {
  id: string;
  metric: string;
  value: string;
  context: string;
  source: 'merkle' | 'salesforce' | 'industry' | 'research';
  applicableCapabilities?: string[];
}

export const INDUSTRY_ROI_BENCHMARKS: Record<IndustryType, IndustryROIBenchmark[]> = {
  'retail-cpg-qsr': [
    { id: 'email-revenue-share', metric: 'Email-Attributed Revenue', value: '15-30%', context: 'Share of e-commerce revenue attributed to email', source: 'industry' },
    { id: 'cart-abandon-recovery', metric: 'Cart Abandonment Recovery', value: '5-15%', context: 'Percentage of abandoned carts recovered', source: 'merkle' },
    { id: 'welcome-series-lift', metric: 'Welcome Series Transaction Rate', value: '+320%', context: 'vs. promotional emails', source: 'industry' },
    { id: 'birthday-lift', metric: 'Birthday Email Transaction Rate', value: '+481%', context: 'vs. promotional emails', source: 'industry' },
    { id: 'personalization-lift', metric: 'Personalization Revenue Lift', value: '10-15%', context: 'Revenue increase from personalized content', source: 'merkle' },
    { id: 'cross-channel-efficiency', metric: 'Cross-Channel ROAS', value: '3X', context: 'Return on ad spend with coordinated suppression', source: 'merkle' },
    { id: 'loyalty-member-value', metric: 'Loyalty Member Value Premium', value: '2-3X', context: 'Loyal members vs. non-members', source: 'industry' },
    { id: 'sms-conversion-rate', metric: 'SMS Conversion Rate', value: '15-30%', context: 'Click-through rate for SMS campaigns', source: 'industry' },
    { id: 'winback-rate', metric: 'Lapsed Customer Win-Back', value: '5-15%', context: 'Success rate for win-back campaigns', source: 'merkle' },
    { id: 'repeat-purchase-lift', metric: 'Repeat Purchase Rate Increase', value: '+25%', context: 'From post-purchase journeys', source: 'merkle' },
  ],

  'financial-services': [
    { id: 'onboarding-activation', metric: 'Digital Onboarding Activation', value: '60-80%', context: 'New accounts activated through onboarding journeys', source: 'industry' },
    { id: 'cross-sell-lift', metric: 'Cross-Sell Conversion', value: '+15-25%', context: 'Increase from personalized product recommendations', source: 'merkle' },
    { id: 'application-recovery', metric: 'Application Abandonment Recovery', value: '10-25%', context: 'Abandoned applications recovered', source: 'merkle' },
    { id: 'digital-adoption', metric: 'Digital Channel Adoption', value: '+30-50%', context: 'Increase in digital banking adoption', source: 'industry' },
    { id: 'retention-improvement', metric: 'Customer Retention Improvement', value: '+5-10%', context: 'From proactive engagement programs', source: 'merkle' },
    { id: 'nps-improvement', metric: 'NPS Improvement', value: '+10-20 pts', context: 'From personalized experience programs', source: 'industry' },
    { id: 'product-penetration', metric: 'Products Per Customer Increase', value: '+0.5-1.0', context: 'From cross-sell journeys', source: 'merkle' },
  ],

  'healthcare-life-sciences': [
    { id: 'adherence-improvement', metric: 'Patient Adherence Improvement', value: '10-20%', context: 'From adherence reminder programs', source: 'industry' },
    { id: 'hcp-engagement', metric: 'HCP Engagement Rate', value: '15-25%', context: 'Digital engagement rate with HCPs', source: 'industry' },
    { id: 'program-enrollment', metric: 'Patient Program Enrollment', value: '15-30%', context: 'Increase from optimized enrollment journeys', source: 'merkle' },
    { id: 'persistence-improvement', metric: 'Treatment Persistence', value: '+10-15%', context: 'From patient support programs', source: 'industry' },
    { id: 'content-consumption', metric: 'Content Consumption Increase', value: '+30-50%', context: 'From personalized content delivery', source: 'merkle' },
    { id: 'refill-rate', metric: 'Refill Rate Improvement', value: '15-25%', context: 'From proactive refill reminders', source: 'industry' },
  ],

  'manufacturing': [
    { id: 'lead-conversion', metric: 'Lead-to-Opportunity Conversion', value: '+20-40%', context: 'From nurture journey optimization', source: 'merkle' },
    { id: 'dealer-engagement', metric: 'Dealer Portal Engagement', value: '+30-50%', context: 'From dealer enablement programs', source: 'merkle' },
    { id: 'service-attach', metric: 'Service Attach Rate Increase', value: '+20-30%', context: 'From service reminder journeys', source: 'industry' },
    { id: 'warranty-renewal', metric: 'Warranty Renewal Rate', value: '30-50%', context: 'Extended warranty conversion', source: 'industry' },
    { id: 'product-registration', metric: 'Product Registration Increase', value: '+25-40%', context: 'From registration reminder campaigns', source: 'merkle' },
    { id: 'account-engagement', metric: 'Account Engagement Score Lift', value: '+30-50%', context: 'From multi-touch ABM programs', source: 'merkle' },
  ],

  'travel-hospitality': [
    { id: 'booking-recovery', metric: 'Booking Abandonment Recovery', value: '5-15%', context: 'Abandoned bookings recovered', source: 'merkle' },
    { id: 'direct-booking', metric: 'Direct Booking Increase', value: '+10-20%', context: 'Shift from OTA to direct', source: 'industry' },
    { id: 'ancillary-revenue', metric: 'Ancillary Revenue per Guest', value: '+15-25%', context: 'From personalized upsell offers', source: 'merkle' },
    { id: 'loyalty-enrollment', metric: 'Loyalty Enrollment Rate', value: '+20-35%', context: 'From enrollment journey optimization', source: 'merkle' },
    { id: 'repeat-booking', metric: 'Repeat Booking Rate', value: '+15-25%', context: 'From post-stay engagement', source: 'industry' },
    { id: 'upgrade-conversion', metric: 'Upgrade Offer Conversion', value: '5-15%', context: 'Pre-arrival upgrade acceptance', source: 'industry' },
    { id: 'loyalty-engagement', metric: 'Loyalty Member Activity', value: '+25-40%', context: 'From tier progression journeys', source: 'merkle' },
  ],

  'media-entertainment': [
    { id: 'trial-conversion', metric: 'Trial-to-Paid Conversion', value: '30-50%', context: 'Free trial conversion rate', source: 'industry' },
    { id: 'churn-reduction', metric: 'Churn Reduction', value: '10-25%', context: 'From at-risk intervention programs', source: 'merkle' },
    { id: 'winback-rate', metric: 'Win-Back Success Rate', value: '10-20%', context: 'Churned subscriber reactivation', source: 'industry' },
    { id: 'engagement-increase', metric: 'Content Engagement Increase', value: '+20-40%', context: 'From personalized recommendations', source: 'merkle' },
    { id: 'ad-tier-upgrade', metric: 'Ad-Supported Tier Upgrade', value: '5-15%', context: 'Conversion to ad-free plans', source: 'industry' },
    { id: 'push-engagement', metric: 'Push Notification Engagement', value: '5-15%', context: 'Action rate from push notifications', source: 'industry' },
    { id: 'arpu-increase', metric: 'ARPU Increase', value: '+5-15%', context: 'From tier upgrade campaigns', source: 'merkle' },
  ],

  'technology': [
    { id: 'trial-conversion', metric: 'Trial-to-Paid Conversion', value: '+20-40%', context: 'From optimized onboarding journeys', source: 'merkle' },
    { id: 'feature-adoption', metric: 'Feature Adoption Rate', value: '+30-50%', context: 'From feature education campaigns', source: 'merkle' },
    { id: 'expansion-revenue', metric: 'Expansion Revenue', value: '+15-30%', context: 'From usage-triggered upsell', source: 'industry' },
    { id: 'churn-reduction', metric: 'Churn Reduction', value: '15-30%', context: 'From usage decline intervention', source: 'merkle' },
    { id: 'nrr-improvement', metric: 'Net Revenue Retention Improvement', value: '+5-15 pts', context: 'From customer success programs', source: 'industry' },
    { id: 'time-to-value', metric: 'Time-to-Value Reduction', value: '30-50%', context: 'From accelerated onboarding', source: 'merkle' },
    { id: 'renewal-rate', metric: 'Renewal Rate Improvement', value: '+5-15%', context: 'From proactive renewal journeys', source: 'industry' },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getIndustryKPIs(industryId: IndustryType): IndustryKPI[] {
  return INDUSTRY_KPIS[industryId] || [];
}

export function getIndustryKPIsByCategory(industryId: IndustryType, category: IndustryKPI['category']): IndustryKPI[] {
  return (INDUSTRY_KPIS[industryId] || []).filter(kpi => kpi.category === category);
}

export function getIndustryJourneys(industryId: IndustryType): IndustryJourney[] {
  return INDUSTRY_JOURNEY_MAPPINGS[industryId] || [];
}

export function getCriticalJourneys(industryId: IndustryType): IndustryJourney[] {
  return (INDUSTRY_JOURNEY_MAPPINGS[industryId] || []).filter(j => j.relevance === 'critical');
}

export function getIndustryDataSources(industryId: IndustryType): IndustryDataSource[] {
  return INDUSTRY_DATA_SOURCES[industryId] || [];
}

export function getCriticalDataSources(industryId: IndustryType): IndustryDataSource[] {
  return (INDUSTRY_DATA_SOURCES[industryId] || []).filter(ds => ds.priority === 'critical');
}

export function getIndustryChannelPriorities(industryId: IndustryType): IndustryChannelPriority[] {
  return INDUSTRY_CHANNEL_PRIORITIES[industryId] || [];
}

export function getCriticalChannels(industryId: IndustryType): IndustryChannelPriority[] {
  return (INDUSTRY_CHANNEL_PRIORITIES[industryId] || []).filter(c => c.priority === 'critical');
}

export function getIndustryROIBenchmarks(industryId: IndustryType): IndustryROIBenchmark[] {
  return INDUSTRY_ROI_BENCHMARKS[industryId] || [];
}

// Get all reference data for an industry (for plan generation)
export function getIndustryReferenceData(industryId: IndustryType) {
  return {
    kpis: INDUSTRY_KPIS[industryId] || [],
    journeys: INDUSTRY_JOURNEY_MAPPINGS[industryId] || [],
    dataSources: INDUSTRY_DATA_SOURCES[industryId] || [],
    channelPriorities: INDUSTRY_CHANNEL_PRIORITIES[industryId] || [],
    roiBenchmarks: INDUSTRY_ROI_BENCHMARKS[industryId] || [],
  };
}
