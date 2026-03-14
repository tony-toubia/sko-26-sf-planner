/**
 * Seed: Hilton Hotels & Resorts — Messaging & Personalization + Loyalty
 * Mostly-complete assessment (intelligence L2 last question left pending)
 * Run with: npx tsx scripts/seed-hilton-assessment.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hoqhjrirkkokhhjdmxnu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcWhqcmlya2tva2hoamRteG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjA3NzgsImV4cCI6MjA4NDQ5Njc3OH0.bPZWXiGWCmixV0AXvPzyxAI9mf3VCKcly2deYhcbpyA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding Hilton Hotels & Resorts assessment...\n');

  // 1. Assessment record
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .insert({
      client_name: 'Hilton Hotels & Resorts',
      opportunity_name: 'Hilton Honors Loyalty & Personalization Transformation',
      industry: 'travel-hospitality',
      marketing_foundation: 'mc-advanced',
      disciplines: ['messaging-personalization', 'loyalty'],
      user_email: 'tony.toubia@merkle.com',
      is_complete: false,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (assessmentError || !assessment) {
    console.error('❌ Failed to create assessment:', assessmentError?.message);
    process.exit(1);
  }

  const assessmentId = assessment.id;
  console.log(`✅ Created assessment (ID: ${assessmentId})`);

  // 2. Global inputs
  const { error: globalInputsError } = await supabase
    .from('assessment_global_inputs')
    .insert({
      assessment_id: assessmentId,
      client_context: {
        companySize: 'Enterprise (100,000+ employees)',
        annualRevenue: '$9.5B',
        loyaltyMembers: '180M Hilton Honors members',
        geographicScope: 'Global — 7,500+ properties across 122 countries',
        keyStakeholders: 'CMO (Chris Silcock), VP CRM, VP Loyalty Marketing, CDO',
        existingTechStack: 'Salesforce Marketing Cloud Advanced, Data Cloud, MuleSoft, Snowflake, Marketing Cloud Intelligence (Datorama), Tableau',
        knownConstraints: 'GDPR/CCPA compliance critical given global footprint; content versioning across 18 brands is primary production bottleneck',
        competitivePressures: 'Marriott Bonvoy and Hyatt World of Hyatt investing heavily in AI personalization; OTAs capturing share of direct bookings',
        additionalContext: 'Board-level mandate to grow direct bookings from 65% to 75% by 2026. Hilton app has 8M MAU — strong mobile channel foundation.',
      },
      commercial_preferences: {
        engagementModels: ['managed-services', 'advisory'],
        budgetRange: '$3M–$5M',
        contractLength: '3-year',
        decisionTimeline: '30-45 days',
        internalResources: 'Strong internal engineering team, MuleSoft integration layer in place',
        preferCapexOrOpex: 'OpEx preferred',
        expansionInterest: ['Agentforce for campaign production', 'dentsu.Identity for cross-brand resolution', 'Loyalty Cloud deeper integration'],
      },
      strategic_context: {
        businessDrivers: [
          'Reduce OTA dependency and commission drag',
          'Deepen Honors loyalty engagement and tier progression',
          'Activate AI-powered personalization across the full guest journey',
        ],
        successMetrics: ['Direct booking rate', 'Honors member engagement score', 'RevPAR lift from personalized offers'],
        executiveSponsor: 'CMO is active sponsor',
        timeline: 'Phase 1 in market by Q3 2025; full program live by Q1 2026',
      },
    });

  if (globalInputsError) {
    console.error('❌ Failed to create global inputs:', globalInputsError.message);
  } else {
    console.log('✅ Created global inputs');
  }

  // 3. Track assessments
  const trackAssessments = [
    // DATA & IDENTITY
    {
      track_id: 'data-identity',
      level: 1,
      status: 'complete',
      notes: 'Data Cloud live since Q1 2024; MCA migrated from MCE two years ago',
      answers: [
        { questionId: 'current-platform',  answer: 'Marketing Cloud Advanced already deployed' },
        { questionId: 'data-cloud-status', answer: 'Fully operational with data streams' },
        { questionId: 'platform-goals',    answer: ['Unified customer data', 'Real-time segmentation', 'Cross-cloud integration', 'AI/Einstein capabilities'] },
      ],
    },
    {
      track_id: 'data-identity',
      level: 2,
      status: 'complete',
      notes: 'PMS (OnQ) streams bookings in near real-time via MuleSoft; Honors CDP segment refreshes every 15 min',
      answers: [
        { questionId: 'data-sources-available', answer: ['Reservation / booking system', 'Loyalty program', 'Mobile app', 'Web browsing behavior', 'Call center / service data', 'OTA / partner data'] },
        { questionId: 'purchase-data-state',    answer: 'Near real-time transaction data' },
        { questionId: 'integration-blockers',   answer: ['Privacy / compliance', 'No significant blockers'] },
      ],
    },
    {
      track_id: 'data-identity',
      level: 3,
      status: 'complete',
      notes: 'Multiple Hilton brands (Waldorf, Conrad, Curio) create cross-brand identity gaps; GDPR/CCPA compliance is critical given global footprint',
      answers: [
        { questionId: 'identity-challenges',  answer: ['Unknown / anonymous visitors', 'Multi-brand identity', 'Fragmented profiles across systems'] },
        { questionId: 'consent-management',   answer: 'OneTrust or similar platform' },
        { questionId: 'identity-solution',    answer: 'Yes, but need to understand integration' },
      ],
    },

    // JOURNEYS
    {
      track_id: 'journeys',
      level: 1,
      status: 'complete',
      notes: 'Welcome series drives strong Honors enrollment; birthday offer sees 3.2x conversion vs standard campaigns',
      answers: [
        { questionId: 'existing-journeys',   answer: ['Welcome / onboarding series', 'Birthday or anniversary', 'Preference center completion'] },
        { questionId: 'journey-performance', answer: 'Meeting expectations' },
        { questionId: 'subscriber-data',     answer: ['Name and demographics', 'Birthday / anniversary dates', 'Preferences and interests', 'Engagement history', 'Location data'] },
      ],
    },
    {
      track_id: 'journeys',
      level: 2,
      status: 'complete',
      notes: 'Booking abandonment recovery is #1 revenue opportunity — ~$220M in abandoned bookings monthly; pre-arrival upsell showing strong attach rates in pilot',
      answers: [
        { questionId: 'purchase-journeys-exist', answer: ['Booking abandonment', 'Pre-arrival communications', 'Post-stay follow-up', 'Review requests', 'Win-back / lapsed traveler'] },
        { questionId: 'cart-abandon-priority',   answer: 'Yes, high abandonment rate' },
        { questionId: 'purchase-data-ready',     answer: 'Yes, real-time events available' },
      ],
    },
    {
      track_id: 'journeys',
      level: 3,
      status: 'complete',
      notes: 'Central data science team of 18; Honors tier data (Silver/Gold/Diamond) + stay history enables rich CLV and next-stay propensity models',
      answers: [
        { questionId: 'predictive-use-cases',    answer: ['Next-best-action recommendations', 'Churn intervention triggers', 'Real-time behavioral triggers', 'Dynamic pricing / offers'] },
        { questionId: 'data-science-capability', answer: 'In-house data science team' },
        { questionId: 'unique-data-assets',      answer: ['Rich loyalty / rewards data', 'Service interaction history', 'In-store behavior data'] },
      ],
    },

    // CONTENT & CHANNELS
    {
      track_id: 'content-channels',
      level: 1,
      status: 'complete',
      notes: '40+ active campaigns/month across 18 brands; content versioning for brands is the core bottleneck — marketing ops team is stretched',
      answers: [
        { questionId: 'current-campaign-approach', answer: 'Multi-touch journeys in Journey Builder' },
        { questionId: 'campaign-volume',           answer: '30+ campaigns per month' },
        { questionId: 'campaign-pain-points',      answer: ['Personalization at scale', 'Time to market / production velocity', 'Measurement / attribution'] },
      ],
    },
    {
      track_id: 'content-channels',
      level: 2,
      status: 'complete',
      notes: 'Hilton app (MAU ~8M) supports push + in-app; SMS consent database strong for check-in reminders and upgrade offers',
      answers: [
        { questionId: 'personalization-level',  answer: 'Some dynamic content / AMPscript' },
        { questionId: 'mobile-channels-active', answer: ['SMS / MMS', 'Push notifications (mobile app)', 'In-app messaging'] },
        { questionId: 'sms-readiness',          answer: 'Have short code / sender ID' },
      ],
    },

    // INTELLIGENCE
    {
      track_id: 'intelligence',
      level: 1,
      status: 'complete',
      notes: 'MCI (Datorama) is primary campaign reporting tool; Snowflake data warehouse feeds Tableau for exec dashboards',
      answers: [
        { questionId: 'current-reporting', answer: ['Marketing Cloud Intelligence / Datorama', 'Tableau dashboards', 'Custom data warehouse reporting'] },
        { questionId: 'reporting-gaps',    answer: ['Cross-channel attribution', 'Real-time performance visibility', 'Customer-level analytics'] },
        { questionId: 'analytics-owner',   answer: 'Dedicated analytics team' },
      ],
    },
    {
      // Last question intentionally omitted — user will complete
      track_id: 'intelligence',
      level: 2,
      status: 'in-progress',
      notes: 'Custom MTA model built in-house; Einstein enabled but teams lack training to action insights — identified as quick win',
      answers: [
        { questionId: 'attribution-approach', answer: 'Multi-touch attribution' },
        { questionId: 'bi-tool-preference',   answer: 'Tableau (preferred)' },
        // einstein-insights-use ← intentionally omitted — user will complete this
      ],
    },
  ];

  let trackCount = 0;
  for (const ta of trackAssessments) {
    const { error } = await supabase
      .from('track_assessments')
      .insert({
        assessment_id: assessmentId,
        track_id: ta.track_id,
        level: ta.level,
        status: ta.status,
        answers: ta.answers,
        notes: ta.notes || null,
        assessed_at: new Date().toISOString(),
      });

    if (error) {
      console.error(`❌ Failed to insert ${ta.track_id}-${ta.level}:`, error.message);
    } else {
      trackCount++;
      const label = ta.status === 'in-progress' ? ' (in-progress — last question pending)' : '';
      console.log(`  ✅ ${ta.track_id} L${ta.level}${label}`);
    }
  }

  console.log(`\n✨ Done! ${trackCount}/${trackAssessments.length} track levels inserted.`);
  console.log(`\n📋 Summary:`);
  console.log(`   Client: Hilton Hotels & Resorts`);
  console.log(`   Opportunity: Hilton Honors Loyalty & Personalization Transformation`);
  console.log(`   User: tony.toubia@merkle.com`);
  console.log(`   Industry: Travel & Hospitality`);
  console.log(`   Disciplines: Messaging & Personalization + Loyalty`);
  console.log(`   Status: In-progress — intelligence L2 last question (einstein-insights-use) pending`);
  console.log(`\n🔗 Assessment ID: ${assessmentId}`);
}

seed().catch(console.error);
