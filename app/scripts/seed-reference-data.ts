/**
 * Seed script: Migrates hardcoded reference data into Supabase tables.
 *
 * Usage: npx tsx scripts/seed-reference-data.ts
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
 * Run this once after creating the migration 003 tables.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { INDUSTRY_KPIS, INDUSTRY_JOURNEY_MAPPINGS, INDUSTRY_ROI_BENCHMARKS, INDUSTRY_CHANNEL_PRIORITIES } from '../src/data/industryReference';
import type { IndustryType } from '../src/types';

// Load .env
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);

// Quick connectivity test
try {
  const testRes = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });
  console.log('Connectivity test:', testRes.status, testRes.statusText);
} catch (err: any) {
  console.error('Connectivity test FAILED:', err.message);
  if (err.cause) console.error('Cause:', err.cause);
  console.error('If behind a proxy, try: set NODE_TLS_REJECT_UNAUTHORIZED=0');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ALL_INDUSTRIES: IndustryType[] = [
  'retail-cpg-qsr',
  'financial-services',
  'healthcare-life-sciences',
  'manufacturing',
  'travel-hospitality',
  'media-entertainment',
  'technology',
];

async function seedKPIs() {
  console.log('Seeding KPIs...');
  const rows: any[] = [];

  for (const industry of ALL_INDUSTRIES) {
    const kpis = INDUSTRY_KPIS[industry] || [];
    for (const kpi of kpis) {
      rows.push({
        name: kpi.name,
        industry,
        category: kpi.category,
        benchmark: kpi.typicalBenchmark || null,
        how_to_measure: kpi.howToMeasure || null,
        improvement_levers: kpi.improvementLevers || [],
        is_active: true,
      });
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from('ref_kpis').insert(rows);
    if (error) {
      console.error('Error seeding KPIs:', error.message);
    } else {
      console.log(`  Inserted ${rows.length} KPIs`);
    }
  }
}

async function seedJourneyTemplates() {
  console.log('Seeding journey templates...');
  const rows: any[] = [];

  for (const industry of ALL_INDUSTRIES) {
    const journeys = INDUSTRY_JOURNEY_MAPPINGS[industry] || [];
    for (const journey of journeys) {
      rows.push({
        name: journey.industryName || journey.journeyId,
        industry,
        relevance: journey.relevance,
        benchmark: journey.industryBenchmarks?.map((b: any) => `${b.metric}: ${b.value}`).join('; ') || null,
        notes: journey.industryNotes || null,
        phase: null,
        channels: [],
        is_active: true,
      });
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from('ref_journey_templates').insert(rows);
    if (error) {
      console.error('Error seeding journeys:', error.message);
    } else {
      console.log(`  Inserted ${rows.length} journey templates`);
    }
  }
}

async function seedROIBenchmarks() {
  console.log('Seeding ROI benchmarks...');
  const rows: any[] = [];

  for (const industry of ALL_INDUSTRIES) {
    const benchmarks = INDUSTRY_ROI_BENCHMARKS[industry] || [];
    for (const benchmark of benchmarks) {
      rows.push({
        industry,
        metric: benchmark.metric,
        value: benchmark.value,
        context: benchmark.context || null,
        phase: benchmark.phase || null,
        source: benchmark.source === 'merkle' ? 'merkle-benchmark'
          : benchmark.source === 'salesforce' ? 'salesforce-benchmark'
          : benchmark.source === 'industry' || benchmark.source === 'research' ? 'industry-average'
          : 'merkle-benchmark',
        is_active: true,
      });
    }
  }

  // Also add the general ROI benchmarks from the API (hardcoded in generate-plan.ts)
  const generalBenchmarks = [
    { metric: 'Operational Efficiency', value: '3X', context: 'Through platform consolidation and automation', phase: 1, source: 'merkle-benchmark' as const },
    { metric: 'Channel Penetration', value: '+111%', context: 'Through Data Cloud audience activation', phase: 1, source: 'merkle-benchmark' as const },
    { metric: 'Email Revenue', value: '+35%', context: 'Through journey optimization and personalization', phase: 2, source: 'merkle-benchmark' as const },
    { metric: 'Welcome Transaction Rate', value: '+320%', context: 'vs. promotional emails', phase: 2, source: 'merkle-benchmark' as const },
    { metric: 'Birthday Revenue', value: '+481%', context: 'vs. average promotional emails', phase: 2, source: 'merkle-benchmark' as const },
    { metric: 'ROAS', value: '3X', context: 'Through cross-channel orchestration', phase: 3, source: 'merkle-benchmark' as const },
    { metric: 'Cross-Channel Efficiency', value: '+100%', context: 'Through unified customer profiles', phase: 3, source: 'merkle-benchmark' as const },
    { metric: 'Multi-Channel Purchase Rate', value: '+287%', context: 'For customers engaging across 3+ channels', phase: 3, source: 'merkle-benchmark' as const },
    { metric: 'Sales Lift (Predictive)', value: '+16%', context: 'Through Einstein predictive models', phase: 4, source: 'salesforce-benchmark' as const },
    { metric: 'Win-Back Lift', value: '+5%', context: 'Through predictive churn models', phase: 4, source: 'salesforce-benchmark' as const },
  ];

  for (const b of generalBenchmarks) {
    rows.push({
      industry: null,
      metric: b.metric,
      value: b.value,
      context: b.context,
      phase: b.phase,
      source: b.source,
      is_active: true,
    });
  }

  if (rows.length > 0) {
    const { error } = await supabase.from('ref_roi_benchmarks').insert(rows);
    if (error) {
      console.error('Error seeding ROI benchmarks:', error.message);
    } else {
      console.log(`  Inserted ${rows.length} ROI benchmarks`);
    }
  }
}

async function seedChannelPriorities() {
  console.log('Seeding channel priorities...');
  const rows: any[] = [];

  for (const industry of ALL_INDUSTRIES) {
    const channels = INDUSTRY_CHANNEL_PRIORITIES[industry] || [];
    for (const channel of channels) {
      rows.push({
        industry,
        channel: channel.channel,
        priority: channel.priority,
        notes: channel.notes || null,
        is_active: true,
      });
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from('ref_channel_priorities').insert(rows);
    if (error) {
      console.error('Error seeding channel priorities:', error.message);
    } else {
      console.log(`  Inserted ${rows.length} channel priorities`);
    }
  }
}

async function seedSampleTactics() {
  console.log('Seeding sample tactics...');
  const tactics = [
    {
      name: 'Cross-Channel Welcome & Enrollment',
      slug: 'cross-channel-welcome-enrollment',
      description: 'Orchestrate a multi-touchpoint welcome experience that introduces the brand, onboards to loyalty, and establishes channel preferences across email, SMS, and push.',
      disciplines: ['messaging-personalization', 'loyalty'],
      industries: ['retail-cpg-qsr', 'travel-hospitality', 'media-entertainment'],
      tracks: ['journeys', 'content-channels'],
      phases: [2],
      maturity_level_min: 1,
      maturity_level_max: 2,
      lifecycle_stages: ['awareness', 'consideration'],
      channel_mix: ['email', 'sms', 'push'],
      expected_roi: { metric: 'Welcome Transaction Rate', value: '+320%', context: 'vs. promotional emails' },
      implementation_effort: 'medium',
      prerequisites: ['data-foundation', 'channel-setup'],
      tags: ['onboarding', 'lifecycle', 'multi-channel'],
      is_active: true,
    },
    {
      name: 'Predictive Churn Prevention',
      slug: 'predictive-churn-prevention',
      description: 'Leverage Einstein AI to identify at-risk customers and trigger proactive retention journeys with personalized offers and re-engagement content.',
      disciplines: ['messaging-personalization', 'loyalty'],
      industries: ['retail-cpg-qsr', 'financial-services', 'media-entertainment', 'technology'],
      tracks: ['intelligence', 'journeys'],
      phases: [3, 4],
      maturity_level_min: 2,
      maturity_level_max: 3,
      lifecycle_stages: ['retention', 'loyalty'],
      channel_mix: ['email', 'sms', 'push', 'ads'],
      expected_roi: { metric: 'Win-Back Lift', value: '+5-16%', context: 'Through predictive churn models' },
      implementation_effort: 'high',
      prerequisites: ['data-cloud', 'identity-resolution', 'einstein-setup'],
      tags: ['retention', 'ai', 'predictive', 'churn'],
      is_active: true,
    },
    {
      name: 'Abandon Recovery Orchestration',
      slug: 'abandon-recovery-orchestration',
      description: 'Multi-stage recovery flow for browse and cart abandonment with escalating incentives, dynamic product content, and cross-channel reminders.',
      disciplines: ['messaging-personalization', 'commerce'],
      industries: ['retail-cpg-qsr', 'travel-hospitality', 'technology'],
      tracks: ['journeys', 'content-channels'],
      phases: [2],
      maturity_level_min: 1,
      maturity_level_max: 2,
      lifecycle_stages: ['consideration', 'purchase'],
      channel_mix: ['email', 'sms', 'ads'],
      expected_roi: { metric: 'Cart Recovery Rate', value: '5-15%', context: 'of abandoned carts recovered' },
      implementation_effort: 'medium',
      prerequisites: ['ecommerce-integration', 'journey-builder'],
      tags: ['conversion', 'ecommerce', 'recovery'],
      is_active: true,
    },
    {
      name: 'Unified Customer Identity & Segmentation',
      slug: 'unified-identity-segmentation',
      description: 'Establish a single customer view via Data Cloud, resolve identities across channels, and build dynamic segments for precision targeting.',
      disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'],
      industries: ['retail-cpg-qsr', 'financial-services', 'healthcare-life-sciences', 'manufacturing', 'travel-hospitality', 'media-entertainment', 'technology'],
      tracks: ['data-identity'],
      phases: [1],
      maturity_level_min: 1,
      maturity_level_max: 1,
      lifecycle_stages: ['awareness', 'consideration', 'purchase', 'post-purchase', 'retention', 'loyalty'],
      channel_mix: ['email', 'sms', 'push', 'ads', 'direct-mail'],
      expected_roi: { metric: 'Channel Penetration', value: '+111%', context: 'Through Data Cloud audience activation' },
      implementation_effort: 'high',
      prerequisites: ['data-audit'],
      tags: ['foundation', 'data', 'identity', 'segmentation'],
      is_active: true,
    },
    {
      name: 'Loyalty Earn & Burn Program Design',
      slug: 'loyalty-earn-burn-design',
      description: 'Design and implement a points-based loyalty program with earn rules, redemption tiers, and member-exclusive experiences powered by Salesforce Loyalty Management.',
      disciplines: ['loyalty'],
      industries: ['retail-cpg-qsr', 'travel-hospitality', 'financial-services'],
      tracks: ['journeys', 'data-identity'],
      phases: [2, 3],
      maturity_level_min: 1,
      maturity_level_max: 3,
      lifecycle_stages: ['post-purchase', 'retention', 'loyalty'],
      channel_mix: ['email', 'sms', 'push', 'in-app'],
      expected_roi: { metric: 'Loyalty Engagement Rate', value: '+40-60%', context: 'Active member participation increase' },
      implementation_effort: 'high',
      prerequisites: ['data-foundation', 'loyalty-cloud-setup'],
      tags: ['loyalty', 'rewards', 'retention', 'engagement'],
      is_active: true,
    },
    {
      name: 'AI-Powered Send Time & Content Optimization',
      slug: 'ai-send-time-content-optimization',
      description: 'Use Einstein Send Time Optimization and Content Selection to automatically determine the best time and content variant for each individual recipient.',
      disciplines: ['messaging-personalization'],
      industries: ['retail-cpg-qsr', 'financial-services', 'healthcare-life-sciences', 'travel-hospitality', 'media-entertainment', 'technology'],
      tracks: ['intelligence', 'content-channels'],
      phases: [3],
      maturity_level_min: 2,
      maturity_level_max: 3,
      lifecycle_stages: ['consideration', 'purchase', 'retention'],
      channel_mix: ['email', 'push'],
      expected_roi: { metric: 'Email Revenue', value: '+35%', context: 'Through personalization and timing optimization' },
      implementation_effort: 'medium',
      prerequisites: ['einstein-setup', 'content-library'],
      tags: ['ai', 'optimization', 'personalization', 'einstein'],
      is_active: true,
    },
  ];

  const { error } = await supabase.from('tactics').insert(tactics);
  if (error) {
    console.error('Error seeding tactics:', error.message);
  } else {
    console.log(`  Inserted ${tactics.length} sample tactics`);
  }
}

async function seedAdminUser() {
  console.log('Seeding admin user...');
  const { error } = await supabase.from('admin_users').insert([
    { email: 'tony.toubia@merkle.com' },
  ]);
  if (error && !error.message.includes('duplicate')) {
    console.error('Error seeding admin user:', error.message);
  } else {
    console.log('  Admin user added');
  }
}

async function clearAll() {
  console.log('Clearing existing data...');
  const tables = ['ref_kpis', 'ref_journey_templates', 'ref_roi_benchmarks', 'ref_channel_priorities', 'tactics'];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error(`  Error clearing ${table}:`, error.message);
    else console.log(`  Cleared ${table}`);
  }
}

async function main() {
  console.log('Starting reference data seed...\n');

  await clearAll();
  await seedKPIs();
  await seedJourneyTemplates();
  await seedROIBenchmarks();
  await seedChannelPriorities();
  await seedSampleTactics();
  await seedAdminUser();

  console.log('\nSeed complete!');
}

main().catch(console.error);
