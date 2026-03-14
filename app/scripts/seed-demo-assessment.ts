/**
 * Seed a demo assessment for tony.toubia@merkle.com
 * All track levels answered except the last question of intelligence-3 (purchase-history-depth)
 * Run with: npx tsx scripts/seed-demo-assessment.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hoqhjrirkkokhhjdmxnu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcWhqcmlya2tva2hoamRteG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjA3NzgsImV4cCI6MjA4NDQ5Njc3OH0.bPZWXiGWCmixV0AXvPzyxAI9mf3VCKcly2deYhcbpyA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding demo assessment for tony.toubia@merkle.com...\n');

  // 1. Create the assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .insert({
      client_name: 'Foot Locker',
      opportunity_name: 'MC Advanced Modernization & Personalization',
      industry: 'retail-cpg-qsr',
      marketing_foundation: 'mc-engagement',
      disciplines: ['messaging-personalization', 'loyalty'],
      user_email: 'tony.toubia@merkle.com',
      is_complete: false,
      created_at: new Date().toISOString(),
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

  // 2. Insert global inputs
  const { error: globalInputsError } = await supabase
    .from('assessment_global_inputs')
    .insert({
      assessment_id: assessmentId,
      client_context: {
        companySize: 'Enterprise (5,000+ employees)',
        existingTechStack: 'Salesforce Marketing Cloud Engagement, Commerce Cloud, Google Analytics 4, Loyalty Lion, Braze (SMS)',
        teamSize: '25-50 person marketing team',
        knownConstraints: 'Legacy POS system not yet integrated with marketing. Privacy team requires consent review before any new data collection.',
        competitivePressures: 'Nike and Adidas direct-to-consumer push is pulling customers away from multi-brand retail. Need to strengthen loyalty and personalization.',
        executiveSponsor: 'SVP of Marketing & Digital',
        additionalContext: 'Foot Locker recently launched a new loyalty program (FLX Rewards) and wants to drive adoption and engagement through personalized journeys.',
      },
      commercial_preferences: {
        engagementModels: ['implementation', 'advisory'],
        budgetRange: '$500K–$1M',
        budgetFlexibility: 'Moderate — tied to FY budget cycle',
        decisionTimeline: '60-90 days',
        internalResources: 'Strong internal team, limited data engineering capacity',
        preferCapexOrOpex: 'OpEx preferred',
        annualMarketingBudget: '$10M–$25M',
      },
      strategic_context: {
        businessDrivers: ['Increase repeat purchase rate', 'Reduce churn among loyalty members', 'Improve email ROI with personalization'],
        successMetrics: ['Email revenue lift', 'Customer LTV growth', 'Loyalty enrollment rate'],
        currentMarketingMaturity: 2,
      },
    });

  if (globalInputsError) {
    console.error('❌ Failed to create global inputs:', globalInputsError.message);
  } else {
    console.log('✅ Created global inputs');
  }

  // 3. Insert track assessments
  // All complete except intelligence-3 (last question left blank)
  const trackAssessments = [
    // ── DATA & IDENTITY ──────────────────────────────────────────────────────
    {
      track_id: 'data-identity',
      level: 1,
      status: 'complete',
      answers: [
        { questionId: 'current-platform', value: 'Marketing Cloud Engagement (classic)' },
        { questionId: 'data-cloud-status', value: 'Licensed but not configured' },
        { questionId: 'platform-goals', value: ['Unified customer data', 'Real-time segmentation', 'AI/Einstein capabilities', 'Agentforce readiness'] },
      ],
    },
    {
      track_id: 'data-identity',
      level: 2,
      status: 'complete',
      answers: [
        { questionId: 'data-sources-available', value: ['E-commerce platform', 'POS / in-store transactions', 'Loyalty program', 'Mobile app', 'Web browsing behavior'] },
        { questionId: 'purchase-data-state', value: 'Some data, fragmented across systems' },
        { questionId: 'integration-blockers', value: ['Data quality issues', 'Technical complexity', 'Data access / permissions'] },
      ],
    },
    {
      track_id: 'data-identity',
      level: 3,
      status: 'complete',
      answers: [
        { questionId: 'identity-challenges', value: ['Duplicate customer records', 'Fragmented profiles across systems', 'Cannot link online and offline', 'Unknown / anonymous visitors'] },
        { questionId: 'consent-management', value: 'Fragmented across systems' },
        { questionId: 'identity-solution', value: 'Yes, but need to understand integration' },
      ],
    },

    // ── JOURNEYS ─────────────────────────────────────────────────────────────
    {
      track_id: 'journeys',
      level: 1,
      status: 'complete',
      answers: [
        { questionId: 'existing-journeys', value: ['Welcome / onboarding series', 'Birthday or anniversary'] },
        { questionId: 'journey-performance', value: 'Underperforming / need optimization' },
        { questionId: 'subscriber-data', value: ['Email only', 'Name and demographics', 'Birthday / anniversary dates', 'Engagement history'] },
      ],
    },
    {
      track_id: 'journeys',
      level: 2,
      status: 'complete',
      answers: [
        { questionId: 'purchase-journeys-exist', value: ['Cart / browse abandonment', 'Order confirmation', 'Shipping / delivery updates'] },
        { questionId: 'cart-abandon-priority', value: 'Yes, high abandonment rate' },
        { questionId: 'purchase-data-ready', value: 'Yes, but batch / delayed' },
      ],
    },
    {
      track_id: 'journeys',
      level: 3,
      status: 'complete',
      answers: [
        { questionId: 'predictive-use-cases', value: ['Next-best-action recommendations', 'Predictive product affinities', 'Churn intervention triggers', 'Dynamic pricing / offers'] },
        { questionId: 'data-science-capability', value: 'Central analytics team (some DS)' },
        { questionId: 'unique-data-assets', value: ['Rich loyalty / rewards data', 'In-store behavior data', 'Service interaction history'] },
      ],
    },

    // ── CONTENT & CHANNELS ───────────────────────────────────────────────────
    {
      track_id: 'content-channels',
      level: 1,
      status: 'complete',
      answers: [
        { questionId: 'current-campaign-approach', value: 'Mix of batch and automated' },
        { questionId: 'campaign-volume', value: '15-30 campaigns per month' },
        { questionId: 'campaign-pain-points', value: ['Time to market / production velocity', 'Personalization at scale', 'Measurement / attribution'] },
      ],
    },
    {
      track_id: 'content-channels',
      level: 2,
      status: 'complete',
      answers: [
        { questionId: 'personalization-level', value: 'Basic merge fields (name, etc.)' },
        { questionId: 'mobile-channels-active', value: ['SMS / MMS', 'Push notifications (mobile app)'] },
        { questionId: 'sms-readiness', value: 'Have short code / sender ID' },
      ],
    },
    {
      track_id: 'content-channels',
      level: 3,
      status: 'complete',
      answers: [
        { questionId: 'channels-desired', value: ['Paid social (Facebook, Instagram)', 'Google Ads audiences', 'Direct mail'] },
        { questionId: 'orchestration-current', value: 'Channels operate independently' },
        { questionId: 'agentforce-interest', value: 'Interested, need foundation first' },
      ],
    },

    // ── INTELLIGENCE ─────────────────────────────────────────────────────────
    {
      track_id: 'intelligence',
      level: 1,
      status: 'complete',
      answers: [
        { questionId: 'current-reporting', value: ['Native SFMC reports only', 'Marketing Cloud Intelligence / Datorama'] },
        { questionId: 'reporting-gaps', value: ['Cross-channel attribution', 'Customer-level analytics', 'Campaign ROI measurement', 'Self-service reporting'] },
        { questionId: 'analytics-owner', value: 'Marketing ops / campaign team' },
      ],
    },
    {
      track_id: 'intelligence',
      level: 2,
      status: 'complete',
      answers: [
        { questionId: 'attribution-approach', value: 'Basic first/last touch' },
        { questionId: 'bi-tool-preference', value: 'Tableau (preferred)' },
        { questionId: 'einstein-insights-use', value: 'Enabled but not actively used' },
      ],
    },
    {
      // ← LAST TRACK: intelligence-3. Two questions answered, last one left blank.
      track_id: 'intelligence',
      level: 3,
      status: 'in-progress',
      answers: [
        { questionId: 'clv-current-state', value: 'Yes, basic RFM or value segments' },
        { questionId: 'clv-use-cases', value: ['Personalize messaging by customer value', 'Identify and prevent churn', 'Prioritize high-value experiences', 'Report on customer asset value'] },
        // purchase-history-depth ← intentionally omitted — user will complete this
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
        assessed_at: new Date().toISOString(),
      });

    if (error) {
      console.error(`❌ Failed to insert ${ta.track_id}-${ta.level}:`, error.message);
    } else {
      trackCount++;
      const label = ta.status === 'in-progress' ? '(in-progress — last question pending)' : '';
      console.log(`  ✅ ${ta.track_id} L${ta.level} ${label}`);
    }
  }

  console.log(`\n✨ Done! ${trackCount}/12 track levels inserted.`);
  console.log(`\n📋 Summary:`);
  console.log(`   Client: Foot Locker`);
  console.log(`   Opportunity: MC Advanced Modernization & Personalization`);
  console.log(`   User: tony.toubia@merkle.com`);
  console.log(`   Industry: Retail, CPG & QSR`);
  console.log(`   Status: In-progress — intelligence L3 last question (purchase-history-depth) pending`);
  console.log(`\n🔗 Assessment ID: ${assessmentId}`);
}

seed().catch(console.error);
