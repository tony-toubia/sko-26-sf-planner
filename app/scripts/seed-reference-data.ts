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

async function seedOfferings() {
  console.log('Seeding offerings...');
  const offerings = [
    // ========== IMPLEMENTATION / FIXED-BID ==========
    { type: 'implementation', name: 'MC Advanced Migration', sizing: 'S', description: 'Single BU migration from MC Engagement to MC Advanced with Data Cloud foundation. ~400-600 hrs, 8-10 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'MC Advanced Migration', sizing: 'M', description: 'Multi-BU migration (2-3 BUs) with unified profiles, 50-150 data extensions, 10-30 journeys. ~800-1200 hrs, 12-16 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'MC Advanced Migration', sizing: 'L', description: 'Enterprise migration (4+ BUs) with zero-copy federation, 150+ data extensions, 30+ journeys, identity resolution. ~1600-2400 hrs, 18-24 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'implementation', name: 'Data Integration & ETL Setup', sizing: 'S', description: 'Basic integration: 1-2 data sources, standard connectors (CRM, e-commerce). ~120-200 hrs, 3-4 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Data Integration & ETL Setup', sizing: 'M', description: 'Multi-source integration: 3-5 sources, custom APIs, data quality rules, calculated insights. ~300-500 hrs, 6-8 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Data Integration & ETL Setup', sizing: 'L', description: 'Enterprise data hub: 5+ sources, zero-copy federation (Snowflake/BigQuery), identity resolution, data governance. ~600-1000 hrs, 10-14 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'implementation', name: 'Customer Journey Implementation', sizing: 'S', description: 'Starter journey pack: 1-3 simple journeys (welcome, abandoned cart, win-back). ~150-250 hrs, 4-6 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Customer Journey Implementation', sizing: 'M', description: 'Lifecycle journey suite: 5-10 journeys with personalization, cross-channel (email + SMS/push), Einstein scoring. ~400-700 hrs, 8-12 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Customer Journey Implementation', sizing: 'L', description: 'Enterprise journey ecosystem: 15+ complex journeys, predictive orchestration, real-time triggers, CLV integration. ~900-1500 hrs, 14-20 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'implementation', name: 'Campaign Framework & Optimization', sizing: 'S', description: 'Email campaign foundation: 5-10 templates, content blocks, send classification, basic A/B testing. ~120-200 hrs, 3-5 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Campaign Framework & Optimization', sizing: 'M', description: 'Multi-channel campaign system: dynamic content, SMS/push setup, send-time optimization, frequency management. ~300-500 hrs, 6-9 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Campaign Framework & Optimization', sizing: 'L', description: 'Enterprise orchestration platform: full cross-channel, addressable media, Einstein content selection, unified frequency capping. ~600-1000 hrs, 10-14 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'implementation', name: 'Analytics & Intelligence Platform', sizing: 'S', description: 'Core analytics: standard dashboards, email performance tracking, journey analytics, basic Einstein scoring. ~100-160 hrs, 3-4 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Analytics & Intelligence Platform', sizing: 'M', description: 'Advanced analytics: custom dashboards, Einstein engagement scoring, predictive models, CLV modeling, attribution. ~250-400 hrs, 6-8 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Analytics & Intelligence Platform', sizing: 'L', description: 'Enterprise intelligence hub: custom ML models, multi-touch attribution, real-time dashboards, data warehouse integration. ~500-800 hrs, 10-14 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'implementation', name: 'Loyalty Program Implementation', sizing: 'S', description: 'Basic loyalty setup: points-based earn rules, simple tier structure, member portal foundation. ~200-350 hrs, 6-8 weeks.', disciplines: ['loyalty'], is_active: true },
    { type: 'implementation', name: 'Loyalty Program Implementation', sizing: 'M', description: 'Multi-tier loyalty: earn & burn rules, redemption catalog, member journeys, partner integrations. ~500-800 hrs, 10-14 weeks.', disciplines: ['loyalty'], is_active: true },
    { type: 'implementation', name: 'Loyalty Program Implementation', sizing: 'L', description: 'Enterprise loyalty ecosystem: advanced tier logic, coalition partnerships, gamification, predictive member scoring. ~1000-1600 hrs, 16-22 weeks.', disciplines: ['loyalty'], is_active: true },

    { type: 'implementation', name: 'Commerce Cloud Implementation', sizing: 'S', description: 'Storefront setup with standard catalog, basic checkout, payment integration. ~300-500 hrs, 8-10 weeks.', disciplines: ['commerce'], is_active: true },
    { type: 'implementation', name: 'Commerce Cloud Implementation', sizing: 'M', description: 'Multi-storefront with product recommendations, promotions engine, OMS integration. ~600-1000 hrs, 12-16 weeks.', disciplines: ['commerce'], is_active: true },
    { type: 'implementation', name: 'Commerce Cloud Implementation', sizing: 'L', description: 'Enterprise commerce: headless architecture, multi-brand, B2B+B2C, complex catalog, ERP integration. ~1200-2000 hrs, 18-24 weeks.', disciplines: ['commerce'], is_active: true },

    { type: 'implementation', name: 'Service Cloud Enhancement', sizing: 'S', description: 'Case management optimization, knowledge base setup, basic service automation. ~150-250 hrs, 4-6 weeks.', disciplines: ['service'], is_active: true },
    { type: 'implementation', name: 'Service Cloud Enhancement', sizing: 'M', description: 'Omni-channel service: chat, messaging, service journeys, Einstein case classification. ~350-600 hrs, 8-12 weeks.', disciplines: ['service'], is_active: true },
    { type: 'implementation', name: 'Service Cloud Enhancement', sizing: 'L', description: 'Enterprise service transformation: AI-powered routing, predictive service, field service, self-service portal. ~700-1200 hrs, 14-20 weeks.', disciplines: ['service'], is_active: true },

    // ========== CREATIVE & CONTENT PRODUCTION ==========
    { type: 'implementation', name: 'Creative Production - Email Design System', sizing: 'S', description: 'Brand-aligned email design system: 3-5 master templates, component library, style guide. ~80-120 hrs, 2-3 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Creative Production - Email Design System', sizing: 'M', description: 'Comprehensive design system: 8-12 templates, dynamic content modules, dark mode support, accessibility compliance. ~160-250 hrs, 4-6 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Creative Production - Email Design System', sizing: 'L', description: 'Enterprise design system: 15+ templates, multi-brand, localization support, interactive AMP elements, full content block library. ~300-500 hrs, 6-10 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'implementation', name: 'Creative Production - Campaign Assets', sizing: 'S', description: 'Single campaign creative package: email designs, landing page, banner ads. ~40-60 hrs, 1-2 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Creative Production - Campaign Assets', sizing: 'M', description: 'Multi-channel campaign creative: email series, SMS/push copy, social assets, landing pages. ~100-160 hrs, 3-4 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'implementation', name: 'Creative Production - Campaign Assets', sizing: 'L', description: 'Full campaign suite: cross-channel creative, personalization variants, A/B test variants, video assets, interactive content. ~200-350 hrs, 5-8 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    // ========== STRATEGY & ADVISORY ==========
    { type: 'advisory', name: 'Maturity Assessment & Roadmap', sizing: 'S', description: 'Quick assessment: current state analysis, gap identification, high-level roadmap, executive presentation. ~40-60 hrs, 2-3 weeks.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },
    { type: 'advisory', name: 'Maturity Assessment & Roadmap', sizing: 'M', description: 'Comprehensive assessment: multi-discipline analysis, detailed gap analysis, phased roadmap with dependencies, TCO/ROI analysis. ~80-120 hrs, 4-6 weeks.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },
    { type: 'advisory', name: 'Maturity Assessment & Roadmap', sizing: 'L', description: 'Enterprise transformation strategy: full organization assessment, competitive benchmarking, multi-year roadmap, change management plan. ~160-240 hrs, 8-12 weeks.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },

    { type: 'advisory', name: 'Promotions Strategy', sizing: 'S', description: 'Promotional calendar framework: seasonal planning, discount strategy, basic offer testing methodology. ~30-50 hrs, 2 weeks.', disciplines: ['messaging-personalization', 'commerce'], is_active: true },
    { type: 'advisory', name: 'Promotions Strategy', sizing: 'M', description: 'Advanced promotions: segmented offer strategy, margin-aware discounting, cross-channel promo orchestration, measurement framework. ~60-100 hrs, 3-5 weeks.', disciplines: ['messaging-personalization', 'commerce'], is_active: true },
    { type: 'advisory', name: 'Promotions Strategy', sizing: 'L', description: 'Enterprise promotions transformation: AI-driven offer optimization, real-time personalization strategy, promo attribution, competitive intelligence. ~120-200 hrs, 6-10 weeks.', disciplines: ['messaging-personalization', 'commerce', 'loyalty'], is_active: true },

    { type: 'advisory', name: 'CRM & Audience Strategy', sizing: 'S', description: 'Audience segmentation framework: persona development, basic segmentation model, targeting strategy. ~30-50 hrs, 2 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'advisory', name: 'CRM & Audience Strategy', sizing: 'M', description: 'Full CRM strategy: lifecycle segmentation, engagement scoring model, channel preference strategy, contact policy. ~60-100 hrs, 3-5 weeks.', disciplines: ['messaging-personalization', 'loyalty'], is_active: true },
    { type: 'advisory', name: 'CRM & Audience Strategy', sizing: 'L', description: 'Enterprise CRM transformation: customer data strategy, CDP architecture, advanced audience modeling, personalization roadmap, org design. ~120-200 hrs, 6-10 weeks.', disciplines: ['messaging-personalization', 'loyalty', 'commerce'], is_active: true },

    { type: 'advisory', name: 'Channel Strategy & Planning', sizing: 'S', description: 'Channel mix assessment: current channel performance audit, channel prioritization, quick-win recommendations. ~20-40 hrs, 1-2 weeks.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'advisory', name: 'Channel Strategy & Planning', sizing: 'M', description: 'Multi-channel strategy: channel expansion plan, orchestration rules, frequency/cadence optimization, measurement framework. ~50-80 hrs, 3-4 weeks.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'advisory', name: 'Data & Identity Strategy', sizing: 'M', description: 'Data architecture assessment, identity resolution strategy, consent/preference management plan, data governance framework. ~60-100 hrs, 4-6 weeks.', disciplines: ['messaging-personalization', 'loyalty', 'commerce'], is_active: true },
    { type: 'advisory', name: 'Data & Identity Strategy', sizing: 'L', description: 'Enterprise data transformation: CDP strategy, first-party data plan, identity graph design, privacy/compliance framework, vendor evaluation. ~120-200 hrs, 8-12 weeks.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },

    // ========== RETAINER / MANAGED SERVICES ==========
    { type: 'retainer', name: 'Marketing Operations Retainer', sizing: 'S', description: 'Campaign execution: 2-4 sends/week, QA/testing, basic reporting, ad-hoc support. ~40-60 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'retainer', name: 'Marketing Operations Retainer', sizing: 'M', description: 'Campaign + optimization: 4-8 sends/week, journey monitoring, A/B testing, monthly performance reporting, template updates. ~80-120 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'retainer', name: 'Marketing Operations Retainer', sizing: 'L', description: 'Full marketing operations: 10+ sends/week, journey management, advanced testing, platform admin, analytics, strategic recommendations, training. ~160-240 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'retainer', name: 'Creative Services Retainer', sizing: 'S', description: 'Ongoing creative support: email design updates, minor template revisions, asset resizing. ~20-40 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'retainer', name: 'Creative Services Retainer', sizing: 'M', description: 'Campaign creative production: new email designs, landing pages, banner ads, content writing, A/B creative variants. ~60-100 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'retainer', name: 'Creative Services Retainer', sizing: 'L', description: 'Full creative studio: multi-channel design, video/motion, interactive content, brand evolution, creative strategy. ~120-200 hrs/month.', disciplines: ['messaging-personalization', 'commerce'], is_active: true },

    { type: 'managed-services', name: 'Managed SFMC Platform', sizing: 'M', description: 'Platform management: user admin, IP warming, deliverability monitoring, release management, security reviews. ~40-60 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'managed-services', name: 'Managed SFMC Platform', sizing: 'L', description: 'Enterprise platform management: multi-BU admin, SSO/governance, deliverability optimization, capacity planning, vendor liaison. ~80-120 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'managed-services', name: 'Managed Data Cloud', sizing: 'M', description: 'Data Cloud operations: data stream monitoring, segment maintenance, identity resolution tuning, calculated insight updates. ~40-60 hrs/month.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'managed-services', name: 'Managed Data Cloud', sizing: 'L', description: 'Enterprise Data Cloud ops: multi-org federation, advanced identity management, data quality monitoring, ML model retraining, governance. ~80-140 hrs/month.', disciplines: ['messaging-personalization', 'loyalty', 'commerce'], is_active: true },

    // ========== STAFF AUGMENTATION ==========
    { type: 'staff-aug', name: 'Email Developer', sizing: 'S', description: 'Junior email developer: HTML/CSS templates, basic AMPscript, QA. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Email Developer', sizing: 'M', description: 'Mid-level email developer: complex templates, AMPscript/SSJS, dynamic content, integrations. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Email Developer', sizing: 'L', description: 'Senior email developer: advanced AMPscript, API integrations, technical architecture, team mentoring. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'staff-aug', name: 'Journey Architect', sizing: 'M', description: 'Mid-level journey architect: journey design/build, Flow/Journey Builder, optimization recommendations. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Journey Architect', sizing: 'L', description: 'Senior journey architect: advanced orchestration, strategic planning, cross-channel design, team leadership. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'staff-aug', name: 'Data Engineer', sizing: 'M', description: 'Mid-level data engineer: Data Cloud configuration, SQL/ETL, data integration, segment building. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Data Engineer', sizing: 'L', description: 'Senior data engineer: complex data architecture, API development, data modeling, performance optimization. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'staff-aug', name: 'Solution Architect', sizing: 'L', description: 'Senior solution architect: platform architecture, integration design, technical strategy, cross-cloud coordination. 1.0 FTE.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },

    { type: 'staff-aug', name: 'Campaign Manager', sizing: 'M', description: 'Mid-level campaign manager: campaign execution, scheduling, QA, basic reporting, list management. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Campaign Manager', sizing: 'L', description: 'Senior campaign manager: strategy-to-execution, optimization, A/B testing, advanced analytics, stakeholder management. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },

    { type: 'staff-aug', name: 'Creative Designer', sizing: 'M', description: 'Mid-level designer: email design, landing pages, banner ads, brand-compliant creative production. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Creative Designer', sizing: 'L', description: 'Senior designer/art director: creative strategy, design systems, multi-channel creative, motion/video, team direction. 1.0 FTE.', disciplines: ['messaging-personalization', 'commerce'], is_active: true },

    { type: 'staff-aug', name: 'Analytics Specialist', sizing: 'M', description: 'Mid-level analyst: reporting dashboards, campaign analysis, segmentation analytics, Einstein configuration. 1.0 FTE.', disciplines: ['messaging-personalization'], is_active: true },
    { type: 'staff-aug', name: 'Analytics Specialist', sizing: 'L', description: 'Senior analyst/data scientist: predictive modeling, CLV analysis, attribution modeling, custom Einstein models, executive reporting. 1.0 FTE.', disciplines: ['messaging-personalization', 'loyalty', 'commerce'], is_active: true },

    { type: 'staff-aug', name: 'CRM Strategist', sizing: 'M', description: 'Mid-level strategist: campaign planning, audience segmentation, content strategy, performance optimization. 1.0 FTE.', disciplines: ['messaging-personalization', 'loyalty'], is_active: true },
    { type: 'staff-aug', name: 'CRM Strategist', sizing: 'L', description: 'Senior strategist: CRM program design, lifecycle strategy, personalization roadmap, cross-functional leadership. 1.0 FTE.', disciplines: ['messaging-personalization', 'loyalty', 'commerce'], is_active: true },

    { type: 'staff-aug', name: 'Project Manager', sizing: 'M', description: 'Mid-level PM: project planning, status tracking, resource coordination, client communication, risk management. 1.0 FTE.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },
    { type: 'staff-aug', name: 'Project Manager', sizing: 'L', description: 'Senior PM/program manager: multi-workstream programs, executive stakeholder management, change management, governance. 1.0 FTE.', disciplines: ['messaging-personalization', 'loyalty', 'commerce', 'service'], is_active: true },
  ];

  const { error } = await supabase.from('ref_offerings').insert(offerings);
  if (error) {
    console.error('Error seeding offerings:', error.message);
  } else {
    console.log(`  Inserted ${offerings.length} offerings`);
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
  const tables = ['ref_offerings', 'ref_kpis', 'ref_journey_templates', 'ref_roi_benchmarks', 'ref_channel_priorities', 'tactics'];
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
  await seedOfferings();
  await seedAdminUser();

  console.log('\nSeed complete!');
}

main().catch(console.error);
