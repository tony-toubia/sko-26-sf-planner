/**
 * Track-Based Maturity Model
 *
 * Organizes capabilities into 4 progression tracks, each with 3 levels.
 * This provides a more intuitive assessment flow than the raw matrix.
 */

import type { Track, TrackDependency, TrackId, TrackLevel } from '../types';

// ============================================================================
// TRACK DEFINITIONS
// ============================================================================

export const TRACKS: Track[] = [
  // -------------------------------------------------------------------------
  // DATA & IDENTITY TRACK
  // -------------------------------------------------------------------------
  {
    id: 'data-identity',
    name: 'Data & Identity',
    shortName: 'Data',
    description: 'Build the foundation that powers everything else - from platform setup to unified customer identity',
    icon: 'Database',
    color: 'blue',
    journeyType: 'below-the-line',
    levels: [
      {
        level: 1,
        name: 'Platform Foundation',
        shortName: 'Foundation',
        description: 'Stand up Data Cloud and Marketing Cloud Advanced as your unified marketing foundation',
        capabilities: ['migrate-sfmc'],
        assessmentQuestions: [
          {
            id: 'current-platform',
            question: 'What is the current marketing platform situation?',
            type: 'single-select',
            options: [
              'No Salesforce Marketing Cloud',
              'Marketing Cloud Engagement (classic)',
              'Marketing Cloud Advanced already deployed',
              'In migration process',
            ],
            required: true,
          },
          {
            id: 'data-cloud-status',
            question: 'What is the Data Cloud status?',
            type: 'single-select',
            options: [
              'Not licensed or deployed',
              'Licensed but not configured',
              'Basic configuration in place',
              'Fully operational with data streams',
            ],
            required: true,
          },
          {
            id: 'platform-goals',
            question: 'What are the primary goals for the platform foundation?',
            type: 'multi-select',
            options: [
              'Unified customer data',
              'Real-time segmentation',
              'Agentforce readiness',
              'Cross-cloud integration',
              'AI/Einstein capabilities',
            ],
            helpText: 'Select all that apply',
          },
        ],
      },
      {
        level: 2,
        name: 'Extended Integration',
        shortName: 'Integration',
        description: 'Integrate commerce, loyalty, and behavioral data to power personalization and purchase-driven journeys',
        capabilities: ['extend-data-integrations'],
        assessmentQuestions: [
          {
            id: 'data-sources-available',
            question: 'Which data sources need to be integrated?',
            type: 'multi-select',
            options: [
              'E-commerce transactions',
              'POS / in-store purchases',
              'Loyalty program data',
              'Mobile app behavior',
              'Web browsing behavior',
              'Call center / service data',
            ],
            required: true,
            industryVariants: {
              'retail-cpg-qsr': {
                options: [
                  'E-commerce platform',
                  'POS / in-store transactions',
                  'Loyalty program',
                  'Mobile app',
                  'Web browsing behavior',
                  'Call center / service data',
                  'Inventory / product catalog',
                ],
              },
              'financial-services': {
                options: [
                  'Core banking / policy admin',
                  'Digital banking platform',
                  'CRM / relationship data',
                  'Application systems',
                  'Call center / service data',
                  'Web / mobile behavior',
                  'Marketing automation history',
                ],
              },
              'healthcare-life-sciences': {
                options: [
                  'EHR / EMR system',
                  'Patient portal',
                  'Scheduling system',
                  'Pharmacy / prescription data',
                  'Claims data',
                  'Web / mobile behavior',
                  'Call center / contact data',
                ],
              },
              'manufacturing': {
                options: [
                  'CRM / Sales Cloud',
                  'ERP system',
                  'Marketing automation',
                  'Dealer / partner portal',
                  'Product registration',
                  'Service / warranty data',
                  'Web analytics',
                ],
              },
              'travel-hospitality': {
                options: [
                  'Reservation / booking system',
                  'Loyalty program',
                  'Property management system',
                  'Mobile app',
                  'Web browsing behavior',
                  'Call center / service data',
                  'OTA / partner data',
                ],
              },
              'media-entertainment': {
                options: [
                  'Subscription platform',
                  'Content / viewing platform',
                  'Mobile / OTT apps',
                  'Web behavior',
                  'Customer service data',
                  'Billing system',
                  'Social media data',
                ],
              },
              'technology': {
                options: [
                  'Product usage / telemetry',
                  'Subscription / billing system',
                  'CRM / Sales Cloud',
                  'Support / ticketing system',
                  'Marketing automation',
                  'Web / trial behavior',
                  'Community / forum data',
                ],
              },
            },
          },
          {
            id: 'purchase-data-state',
            question: 'What is the current state of purchase data in marketing?',
            type: 'single-select',
            options: [
              'No purchase data available',
              'Some data, fragmented across systems',
              'Aggregated data only (no transaction-level)',
              'Full transaction data with delays',
              'Near real-time transaction data',
            ],
            required: true,
          },
          {
            id: 'integration-blockers',
            question: 'What are the main integration challenges?',
            type: 'multi-select',
            options: [
              'Data access / permissions',
              'Data quality issues',
              'Technical complexity',
              'Resource constraints',
              'Privacy / compliance',
              'No significant blockers',
            ],
          },
        ],
      },
      {
        level: 3,
        name: 'Identity & Enrichment',
        shortName: 'Identity',
        description: 'Resolve identity across touchpoints with dentsu.Identity (formerly Merkury) and enrich profiles with third-party data for a true golden record',
        capabilities: ['identity-resolution'],
        assessmentQuestions: [
          {
            id: 'identity-challenges',
            question: 'What are the main identity challenges?',
            type: 'multi-select',
            options: [
              'Duplicate customer records',
              'Fragmented profiles across systems',
              'Cannot link online and offline',
              'Unknown / anonymous visitors',
              'Household vs. individual identity',
              'Multi-brand identity',
            ],
            required: true,
          },
          {
            id: 'consent-management',
            question: 'How is consent currently managed?',
            type: 'single-select',
            options: [
              'Salesforce Consent Management',
              'OneTrust or similar platform',
              'Custom consent database',
              'Fragmented across systems',
              'Minimal consent tracking',
            ],
            required: true,
          },
          {
            id: 'identity-solution',
            question: 'Is there interest in dentsu.Identity for identity resolution and enrichment?',
            type: 'single-select',
            options: [
              'Yes, ready to implement',
              'Yes, but need to understand integration',
              'Already using dentsu.Identity',
              'Need to evaluate against other options',
              'First-party data focus only',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // JOURNEYS TRACK
  // -------------------------------------------------------------------------
  {
    id: 'journeys',
    name: 'Journeys',
    shortName: 'Journeys',
    description: 'Build automated customer experiences from basic lifecycle to predictive, insight-driven moments',
    icon: 'Route',
    color: 'violet',
    journeyType: 'above-the-line',
    levels: [
      {
        level: 1,
        name: 'Subscriber Journeys',
        shortName: 'Subscriber',
        description: 'Deploy the foundational lifecycle journeys every consumer expects: welcome, birthday, and re-engagement',
        capabilities: ['baseline-subscriber-journeys'],
        assessmentQuestions: [
          {
            id: 'existing-journeys',
            question: 'Which subscriber journeys exist today?',
            type: 'multi-select',
            options: [
              'Welcome / onboarding series',
              'Birthday or anniversary',
              'Re-engagement / win-back',
              'Preference center completion',
              'None of these',
            ],
            required: true,
          },
          {
            id: 'journey-performance',
            question: 'How are existing journeys performing?',
            type: 'single-select',
            options: [
              'No journeys to measure',
              'Underperforming / need optimization',
              'Meeting expectations',
              'Exceeding benchmarks',
            ],
            required: true,
          },
          {
            id: 'subscriber-data',
            question: 'What subscriber data is available for personalization?',
            type: 'multi-select',
            options: [
              'Email only',
              'Name and demographics',
              'Birthday / anniversary dates',
              'Preferences and interests',
              'Engagement history',
              'Location data',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Customer Lifecycle',
        shortName: 'Lifecycle',
        description: 'Build purchase-driven journeys: cart abandonment, post-purchase, replenishment, and win-back',
        capabilities: ['customer-lifecycle-journeys'],
        assessmentQuestions: [
          {
            id: 'purchase-journeys-exist',
            question: 'Which customer lifecycle journeys exist today?',
            type: 'multi-select',
            options: [
              'Abandoned cart / browse',
              'Order confirmation',
              'Shipping / delivery updates',
              'Post-purchase follow-up',
              'Replenishment reminders',
              'Win-back / lapsed customer',
              'None of these',
            ],
            required: true,
            industryVariants: {
              'retail-cpg-qsr': {
                question: 'Which purchase-driven journeys exist today?',
                options: [
                  'Cart / browse abandonment',
                  'Order confirmation',
                  'Shipping / delivery updates',
                  'Post-purchase follow-up',
                  'Replenishment reminders',
                  'Back in stock alerts',
                  'Win-back / lapsed customer',
                  'None of these',
                ],
              },
              'financial-services': {
                question: 'Which customer lifecycle journeys exist today?',
                options: [
                  'Application abandonment',
                  'Account onboarding completion',
                  'Product activation follow-up',
                  'Cross-sell recommendations',
                  'Renewal reminders',
                  'Dormant account reactivation',
                  'None of these',
                ],
              },
              'healthcare-life-sciences': {
                question: 'Which patient/customer lifecycle journeys exist today?',
                options: [
                  'Appointment reminders',
                  'Post-visit follow-up',
                  'Medication adherence',
                  'Refill reminders',
                  'Annual wellness reminders',
                  'Program enrollment follow-up',
                  'None of these',
                ],
              },
              'manufacturing': {
                question: 'Which customer lifecycle journeys exist today?',
                options: [
                  'Lead nurture sequences',
                  'Quote follow-up',
                  'Product registration',
                  'Service reminders',
                  'Warranty renewal',
                  'Parts reorder alerts',
                  'None of these',
                ],
              },
              'travel-hospitality': {
                question: 'Which guest lifecycle journeys exist today?',
                options: [
                  'Booking abandonment',
                  'Pre-arrival communications',
                  'On-property engagement',
                  'Post-stay follow-up',
                  'Review requests',
                  'Win-back / lapsed traveler',
                  'None of these',
                ],
              },
              'media-entertainment': {
                question: 'Which subscriber lifecycle journeys exist today?',
                options: [
                  'Trial onboarding',
                  'Content recommendations',
                  'Engagement triggers',
                  'At-risk subscriber alerts',
                  'Renewal reminders',
                  'Win-back / churned subscriber',
                  'None of these',
                ],
              },
              'technology': {
                question: 'Which customer lifecycle journeys exist today?',
                options: [
                  'Trial onboarding',
                  'Feature adoption campaigns',
                  'Usage milestone celebrations',
                  'Expansion opportunity triggers',
                  'Renewal campaigns',
                  'At-risk customer intervention',
                  'None of these',
                ],
              },
            },
          },
          {
            id: 'cart-abandon-priority',
            question: 'Is abandoned transaction recovery a significant opportunity?',
            type: 'single-select',
            options: [
              'Yes, high abandonment rate',
              'Moderate opportunity',
              'Low priority - already optimized',
              'Not applicable',
            ],
            required: true,
            industryVariants: {
              'retail-cpg-qsr': {
                question: 'Is cart abandonment a significant revenue opportunity?',
                options: [
                  'Yes, high abandonment rate',
                  'Moderate opportunity',
                  'Low priority - already optimized',
                  'Not applicable (no e-commerce)',
                ],
              },
              'financial-services': {
                question: 'Is application abandonment a significant opportunity?',
                options: [
                  'Yes, high abandonment rate',
                  'Moderate opportunity',
                  'Low priority - already optimized',
                  'Not applicable',
                ],
              },
              'travel-hospitality': {
                question: 'Is booking abandonment a significant revenue opportunity?',
                options: [
                  'Yes, high abandonment rate',
                  'Moderate opportunity',
                  'Low priority - already optimized',
                  'Not applicable',
                ],
              },
              'technology': {
                question: 'Is trial abandonment / drop-off a significant opportunity?',
                options: [
                  'Yes, high drop-off rate',
                  'Moderate opportunity',
                  'Low priority - already optimized',
                  'Not applicable (no trial)',
                ],
              },
            },
          },
          {
            id: 'purchase-data-ready',
            question: 'Is purchase data available for trigger journeys?',
            type: 'single-select',
            options: [
              'Yes, real-time events available',
              'Yes, but batch / delayed',
              'Partial data only',
              'Not yet integrated',
            ],
            required: true,
            helpText: 'This determines if Level 2 can be activated',
          },
        ],
      },
      {
        level: 3,
        name: 'Insight-Driven Experiences',
        shortName: 'Insight-Driven',
        description: 'Build brand-unique experiences powered by predictive models and next-best-action decisioning',
        capabilities: ['insight-driven-experiences'],
        assessmentQuestions: [
          {
            id: 'predictive-use-cases',
            question: 'What predictive use cases are priorities?',
            type: 'multi-select',
            options: [
              'Next-best-action recommendations',
              'Predictive product affinities',
              'Churn intervention triggers',
              'Dynamic pricing / offers',
              'Real-time behavioral triggers',
              'Not sure yet',
            ],
            required: true,
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
            required: true,
          },
          {
            id: 'unique-data-assets',
            question: 'What unique data could power differentiated experiences?',
            type: 'multi-select',
            options: [
              'Rich loyalty / rewards data',
              'In-store behavior data',
              'Product usage / IoT data',
              'Service interaction history',
              'Custom survey / preference data',
              'Not sure what differentiates us',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // CONTENT & CHANNELS TRACK
  // -------------------------------------------------------------------------
  {
    id: 'content-channels',
    name: 'Content & Channels',
    shortName: 'Channels',
    description: 'Evolve from batch email to dynamic content and full cross-channel orchestration',
    icon: 'Share2',
    color: 'emerald',
    journeyType: 'above-the-line',
    levels: [
      {
        level: 1,
        name: 'Campaign Optimization',
        shortName: 'Campaigns',
        description: 'Transform batch-and-blast campaigns into orchestrated, multi-touch Flow-based journeys',
        capabilities: ['enhance-planned-campaigns'],
        assessmentQuestions: [
          {
            id: 'current-campaign-approach',
            question: 'How are campaigns currently managed?',
            type: 'single-select',
            options: [
              'Batch-and-blast email sends',
              'Basic automation / drip sequences',
              'Multi-touch journeys in Journey Builder',
              'Mix of batch and automated',
              'Limited or no email marketing',
            ],
            required: true,
          },
          {
            id: 'campaign-volume',
            question: 'What is the typical campaign volume?',
            type: 'single-select',
            options: [
              '1-5 campaigns per month',
              '5-15 campaigns per month',
              '15-30 campaigns per month',
              '30+ campaigns per month',
            ],
            required: true,
          },
          {
            id: 'campaign-pain-points',
            question: 'What are the biggest campaign pain points?',
            type: 'multi-select',
            options: [
              'Time to market / production velocity',
              'Personalization at scale',
              'Creative consistency',
              'Measurement / attribution',
              'Resource constraints',
              'Technology limitations',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Dynamic Content & Mobile',
        shortName: 'Dynamic + Mobile',
        description: 'Scale personalization with Einstein Content Selection and activate SMS/Push channels',
        capabilities: ['scale-dynamic-content', 'einstein-engagement-scoring', 'einstein-send-time-optimization'],
        assessmentQuestions: [
          {
            id: 'personalization-level',
            question: 'What level of content personalization exists today?',
            type: 'single-select',
            options: [
              'None - all emails are static',
              'Basic merge fields (name, etc.)',
              'Segment-based content blocks',
              'Some dynamic content / AMPscript',
              'Advanced dynamic + recommendations',
            ],
            required: true,
          },
          {
            id: 'mobile-channels-active',
            question: 'Which mobile channels are currently active?',
            type: 'multi-select',
            options: [
              'SMS / MMS',
              'Push notifications (mobile app)',
              'In-app messaging',
              'None - email only',
            ],
            required: true,
          },
          {
            id: 'sms-readiness',
            question: 'If SMS is a priority, what is the readiness state?',
            type: 'single-select',
            options: [
              'Have short code / sender ID',
              'Need to acquire short code',
              'Have SMS consent but no platform',
              'Need to build SMS opt-in list',
              'SMS not a priority',
            ],
          },
        ],
      },
      {
        level: 3,
        name: 'Cross-Channel Orchestration',
        shortName: 'Orchestration',
        description: 'Full omnichannel: paid media integration, direct mail, coordinated suppression, and AI-powered production',
        capabilities: ['cross-channel-activation', 'agentic-campaign-production'],
        assessmentQuestions: [
          {
            id: 'channels-desired',
            question: 'Which additional channels are priorities to activate?',
            type: 'multi-select',
            options: [
              'Paid social (Facebook, Instagram)',
              'Google Ads audiences',
              'Direct mail',
              'WhatsApp / messaging apps',
              'Connected TV',
              'None - current channels sufficient',
            ],
            required: true,
          },
          {
            id: 'orchestration-current',
            question: 'How are channels coordinated today?',
            type: 'single-select',
            options: [
              'Channels operate independently',
              'Manual coordination between teams',
              'Some automated suppression',
              'Basic cross-channel journeys exist',
              'Sophisticated orchestration in place',
            ],
            required: true,
          },
          {
            id: 'agentforce-interest',
            question: 'Is AI-powered (Agentforce) campaign production of interest?',
            type: 'single-select',
            options: [
              'Yes, ready to pilot',
              'Interested, need foundation first',
              'Need education on the value',
              'Not a priority',
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // INTELLIGENCE TRACK
  // -------------------------------------------------------------------------
  {
    id: 'intelligence',
    name: 'Intelligence',
    shortName: 'Intelligence',
    description: 'Evolve from basic reporting to advanced analytics and predictive modeling',
    icon: 'Brain',
    color: 'amber',
    journeyType: 'below-the-line',
    levels: [
      {
        level: 1,
        name: 'Reporting Foundation',
        shortName: 'Reporting',
        description: 'Establish core dashboards, email metrics, and engagement visibility',
        capabilities: ['data-exploration'],
        assessmentQuestions: [
          {
            id: 'current-reporting',
            question: 'What reporting and analytics exists today?',
            type: 'multi-select',
            options: [
              'Native SFMC reports only',
              'Marketing Cloud Intelligence / Datorama',
              'Tableau dashboards',
              'Power BI or Looker',
              'Custom data warehouse reporting',
              'Limited / ad-hoc reporting',
            ],
            required: true,
          },
          {
            id: 'reporting-gaps',
            question: 'What are the biggest analytics gaps?',
            type: 'multi-select',
            options: [
              'Cross-channel attribution',
              'Customer-level analytics',
              'Campaign ROI measurement',
              'Real-time performance visibility',
              'Self-service reporting',
              'Executive dashboards',
            ],
            required: true,
          },
          {
            id: 'analytics-owner',
            question: 'Who is responsible for marketing analytics?',
            type: 'single-select',
            options: [
              'Dedicated analytics team',
              'Marketing ops / campaign team',
              'Central BI / data team',
              'Agency partner',
              'No dedicated resource',
            ],
          },
        ],
      },
      {
        level: 2,
        name: 'Advanced Analytics',
        shortName: 'Analytics',
        description: 'Deploy cross-channel attribution, Einstein insights, and self-service analytics',
        capabilities: [], // Einstein features are embedded in other tracks; this is about analytics infrastructure
        assessmentQuestions: [
          {
            id: 'attribution-approach',
            question: 'How is campaign attribution currently handled?',
            type: 'single-select',
            options: [
              'No attribution / last-touch only',
              'Basic first/last touch',
              'Custom attribution model',
              'Multi-touch attribution',
              'Advanced / data-driven attribution',
            ],
            required: true,
          },
          {
            id: 'bi-tool-preference',
            question: 'Is there a preferred BI / visualization tool?',
            type: 'single-select',
            options: [
              'Tableau (preferred)',
              'Power BI (preferred)',
              'Marketing Cloud Intelligence',
              'Open to recommendations',
              'Want to keep in Salesforce ecosystem',
            ],
            required: true,
          },
          {
            id: 'einstein-insights-use',
            question: 'Are Einstein insights currently being used?',
            type: 'single-select',
            options: [
              'Yes, actively using Einstein insights',
              'Enabled but not actively used',
              'Not enabled',
              'Not sure',
            ],
          },
        ],
      },
      {
        level: 3,
        name: 'Predictive & CLV',
        shortName: 'Predictive',
        description: 'Implement CLV modeling, churn prediction, propensity scoring, and custom models',
        capabilities: ['clv-modeling'],
        assessmentQuestions: [
          {
            id: 'clv-current-state',
            question: 'Does customer value scoring exist today?',
            type: 'single-select',
            options: [
              'Yes, predictive CLV models in production',
              'Yes, basic RFM or value segments',
              'Historical value calculated, not predictive',
              'No customer value scoring',
            ],
            required: true,
          },
          {
            id: 'clv-use-cases',
            question: 'How would CLV / predictive scoring be used?',
            type: 'multi-select',
            options: [
              'Personalize messaging by customer value',
              'Optimize acquisition spend',
              'Identify and prevent churn',
              'Prioritize high-value experiences',
              'Inform product decisions',
              'Report on customer asset value',
            ],
            required: true,
          },
          {
            id: 'purchase-history-depth',
            question: 'How much purchase history is available?',
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
// CROSS-TRACK DEPENDENCIES
// ============================================================================

export const TRACK_DEPENDENCIES: TrackDependency[] = [
  // Data L2 is required for Journeys L2 (need purchase data for lifecycle journeys)
  {
    fromTrack: 'data-identity',
    fromLevel: 2,
    toTrack: 'journeys',
    toLevel: 2,
    type: 'required',
    description: 'Purchase data integration required for customer lifecycle journeys',
  },
  // Data L1 is required for everything else
  {
    fromTrack: 'data-identity',
    fromLevel: 1,
    toTrack: 'journeys',
    toLevel: 1,
    type: 'required',
    description: 'Platform foundation required before building journeys',
  },
  {
    fromTrack: 'data-identity',
    fromLevel: 1,
    toTrack: 'content-channels',
    toLevel: 1,
    type: 'required',
    description: 'Platform foundation required before campaign optimization',
  },
  // Journeys L1 recommended before Content L2 (mobile channels enhance journeys)
  {
    fromTrack: 'journeys',
    fromLevel: 1,
    toTrack: 'content-channels',
    toLevel: 2,
    type: 'recommended',
    description: 'Subscriber journeys help inform mobile channel strategy',
  },
  // Data L2 + Journeys L2 required for Journeys L3
  {
    fromTrack: 'journeys',
    fromLevel: 2,
    toTrack: 'journeys',
    toLevel: 3,
    type: 'required',
    description: 'Customer lifecycle journeys must be operational before insight-driven experiences',
  },
  // Intelligence L2 recommended for Journeys L3
  {
    fromTrack: 'intelligence',
    fromLevel: 2,
    toTrack: 'journeys',
    toLevel: 3,
    type: 'recommended',
    description: 'Advanced analytics helps inform predictive experience design',
  },
  // Data L2 required for Intelligence L3 (need purchase data for CLV)
  {
    fromTrack: 'data-identity',
    fromLevel: 2,
    toTrack: 'intelligence',
    toLevel: 3,
    type: 'required',
    description: 'Purchase data required for CLV modeling',
  },
  // Content L2 recommended before Content L3
  {
    fromTrack: 'content-channels',
    fromLevel: 2,
    toTrack: 'content-channels',
    toLevel: 3,
    type: 'recommended',
    description: 'Dynamic content and mobile should be established before full orchestration',
  },
  // Journeys L2 enhances Content L3 (cross-channel works best with lifecycle journeys)
  {
    fromTrack: 'journeys',
    fromLevel: 2,
    toTrack: 'content-channels',
    toLevel: 3,
    type: 'recommended',
    description: 'Lifecycle journeys provide the foundation for cross-channel orchestration',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTrackById(trackId: TrackId): Track | undefined {
  return TRACKS.find((t) => t.id === trackId);
}

export function getTrackLevel(trackId: TrackId, level: TrackLevel): Track['levels'][0] | undefined {
  const track = getTrackById(trackId);
  return track?.levels.find((l) => l.level === level);
}

export function getDependenciesForLevel(trackId: TrackId, level: TrackLevel): TrackDependency[] {
  return TRACK_DEPENDENCIES.filter((d) => d.toTrack === trackId && d.toLevel === level);
}

export function getRequiredDependencies(trackId: TrackId, level: TrackLevel): TrackDependency[] {
  return getDependenciesForLevel(trackId, level).filter((d) => d.type === 'required');
}

export function getRecommendedDependencies(trackId: TrackId, level: TrackLevel): TrackDependency[] {
  return getDependenciesForLevel(trackId, level).filter((d) => d.type === 'recommended');
}

export function getCapabilitiesForTrack(trackId: TrackId): string[] {
  const track = getTrackById(trackId);
  if (!track) return [];
  return track.levels.flatMap((l) => l.capabilities);
}

export function getCapabilitiesForTrackLevel(trackId: TrackId, level: TrackLevel): string[] {
  const trackLevel = getTrackLevel(trackId, level);
  return trackLevel?.capabilities || [];
}

export function getTrackForCapability(capabilityId: string): { track: Track; level: TrackLevel } | undefined {
  for (const track of TRACKS) {
    for (const level of track.levels) {
      if (level.capabilities.includes(capabilityId)) {
        return { track, level: level.level };
      }
    }
  }
  return undefined;
}

// Get the assessment order based on dependencies (Data first, then others)
export function getAssessmentOrder(): TrackId[] {
  return ['data-identity', 'journeys', 'content-channels', 'intelligence'];
}

// Check if a level can be started based on dependencies
export function canStartLevel(
  trackId: TrackId,
  level: TrackLevel,
  completedLevels: Set<string> // Set of `${trackId}-${level}` strings
): { canStart: boolean; blockedBy: TrackDependency[] } {
  const requiredDeps = getRequiredDependencies(trackId, level);
  const blockedBy: TrackDependency[] = [];

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
