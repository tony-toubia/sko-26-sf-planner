/**
 * Server-side reference data queries for plan generation API.
 * Uses Supabase with service role or anon key.
 * Falls back to hardcoded inline data if DB unavailable.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export interface RefDataContext {
  industry?: string;
  disciplines?: string[];
  maturityLevel?: number;
}

export interface FormattedReferenceData {
  kpis: string;
  tactics: string;
  roiBenchmarks: string;
  channelPriorities: string;
  journeys: string;
  offerings: string;
}

/**
 * Fetch all relevant reference data from DB and format as markdown for prompt injection.
 * Returns empty strings if DB unavailable (caller should fall back to inline constants).
 */
export async function fetchFormattedReferenceData(ctx: RefDataContext): Promise<FormattedReferenceData | null> {
  if (!supabase) return null;

  try {
    const [kpis, tactics, benchmarks, channels, journeys, offerings] = await Promise.all([
      ctx.industry ? fetchKPIs(ctx.industry) : Promise.resolve([]),
      fetchTactics(ctx),
      fetchROIBenchmarks(ctx.industry),
      ctx.industry ? fetchChannelPriorities(ctx.industry) : Promise.resolve([]),
      ctx.industry ? fetchJourneyTemplates(ctx.industry) : Promise.resolve([]),
      fetchOfferings(ctx),
    ]);

    // Only return if we got meaningful data from at least one source
    if (!kpis.length && !tactics.length && !benchmarks.length) return null;

    return {
      kpis: formatKPIs(kpis),
      tactics: formatTactics(tactics),
      roiBenchmarks: formatBenchmarks(benchmarks),
      channelPriorities: formatChannels(channels),
      journeys: formatJourneys(journeys),
      offerings: formatOfferings(offerings),
    };
  } catch (err) {
    console.error('[referenceData] Failed to fetch from DB:', err);
    return null;
  }
}

// ============================================================
// Individual fetch functions
// ============================================================

async function fetchKPIs(industry: string): Promise<any[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('ref_kpis')
    .select('name, category, benchmark, how_to_measure, improvement_levers')
    .eq('industry', industry)
    .eq('is_active', true);
  return data || [];
}

async function fetchTactics(ctx: RefDataContext): Promise<any[]> {
  if (!supabase) return [];
  let query = supabase.from('tactics').select('*').eq('is_active', true);

  if (ctx.industry) {
    query = query.contains('industries', [ctx.industry]);
  }
  if (ctx.disciplines?.length) {
    query = query.overlaps('disciplines', ctx.disciplines);
  }

  const { data } = await query;
  if (!data) return [];

  // Filter by maturity level client-side
  if (ctx.maturityLevel !== undefined) {
    return data.filter(
      (t: any) => ctx.maturityLevel! >= t.maturity_level_min && ctx.maturityLevel! <= t.maturity_level_max
    );
  }
  return data;
}

async function fetchROIBenchmarks(industry?: string): Promise<any[]> {
  if (!supabase) return [];
  let query = supabase
    .from('ref_roi_benchmarks')
    .select('metric, value, context, phase, source')
    .eq('is_active', true);

  if (industry) {
    query = query.or(`industry.eq.${industry},industry.is.null`);
  }

  const { data } = await query;
  return data || [];
}

async function fetchChannelPriorities(industry: string): Promise<any[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('ref_channel_priorities')
    .select('channel, priority, notes')
    .eq('industry', industry)
    .eq('is_active', true);
  return data || [];
}

async function fetchJourneyTemplates(industry: string): Promise<any[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('ref_journey_templates')
    .select('name, relevance, benchmark, notes')
    .eq('industry', industry)
    .eq('is_active', true);
  return data || [];
}

// ============================================================
// Formatters: convert DB rows to markdown for prompt injection
// ============================================================

function formatKPIs(kpis: any[]): string {
  if (!kpis.length) return '';
  const lines = ['## Industry KPIs'];
  for (const kpi of kpis) {
    lines.push(`- **${kpi.name}** (${kpi.category}): Benchmark: ${kpi.benchmark || 'N/A'}${kpi.improvement_levers?.length ? ` | Levers: ${kpi.improvement_levers.join(', ')}` : ''}`);
  }
  return lines.join('\n');
}

function formatTactics(tactics: any[]): string {
  if (!tactics.length) return '';
  const lines = ['## Recommended Strategic Plays'];
  for (const t of tactics) {
    lines.push(`### ${t.name}`);
    if (t.description) lines.push(t.description);
    lines.push(`- **Disciplines**: ${(t.disciplines || []).join(', ')}`);
    lines.push(`- **Phases**: ${(t.phases || []).join(', ')}`);
    lines.push(`- **Channels**: ${(t.channel_mix || []).join(', ')}`);
    if (t.expected_roi) {
      lines.push(`- **Expected ROI**: ${t.expected_roi.metric}: ${t.expected_roi.value}${t.expected_roi.context ? ` (${t.expected_roi.context})` : ''}`);
    }
    lines.push(`- **Effort**: ${t.implementation_effort || 'N/A'}`);
    lines.push('');
  }
  return lines.join('\n');
}

function formatBenchmarks(benchmarks: any[]): string {
  if (!benchmarks.length) return '';
  const lines = ['## ROI Benchmarks'];
  for (const b of benchmarks) {
    lines.push(`- **${b.metric}**: ${b.value}${b.context ? ` — ${b.context}` : ''}${b.phase ? ` (Phase ${b.phase})` : ''}`);
  }
  return lines.join('\n');
}

function formatChannels(channels: any[]): string {
  if (!channels.length) return '';
  const lines = ['## Channel Priorities'];
  for (const c of channels) {
    lines.push(`- **${c.channel}**: ${c.priority}${c.notes ? ` — ${c.notes}` : ''}`);
  }
  return lines.join('\n');
}

function formatJourneys(journeys: any[]): string {
  if (!journeys.length) return '';
  const lines = ['## Key Journeys'];
  for (const j of journeys) {
    lines.push(`- **${j.name}** (${j.relevance})${j.benchmark ? `: ${j.benchmark}` : ''}${j.notes ? ` — ${j.notes}` : ''}`);
  }
  return lines.join('\n');
}

async function fetchOfferings(ctx: RefDataContext): Promise<any[]> {
  if (!supabase) return [];
  let query = supabase
    .from('ref_offerings')
    .select('type, name, sizing, description, disciplines')
    .eq('is_active', true);

  if (ctx.disciplines?.length) {
    query = query.overlaps('disciplines', ctx.disciplines);
  }

  const { data } = await query;
  return data || [];
}

function formatOfferings(offerings: any[]): string {
  if (!offerings.length) return '';
  const grouped: Record<string, any[]> = {};
  for (const o of offerings) {
    const key = o.type || 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(o);
  }
  const lines = ['## Available Service Offerings'];
  const typeLabels: Record<string, string> = {
    'implementation': 'Implementation / Fixed-Bid',
    'advisory': 'Strategy & Advisory',
    'retainer': 'Retainer',
    'managed-services': 'Managed Services',
    'staff-aug': 'Staff Augmentation',
  };
  for (const [type, items] of Object.entries(grouped)) {
    lines.push(`### ${typeLabels[type] || type}`);
    for (const o of items) {
      lines.push(`- **${o.name}** (${o.sizing || 'varies'}): ${o.description || ''}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

// ============================================================
// Cache helpers (server-side)
// ============================================================

export async function getCachedPlan(cacheKey: string): Promise<{ plan: string; usage: any } | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('plan_cache')
    .select('plan_markdown, token_usage')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  return { plan: data.plan_markdown, usage: data.token_usage };
}

export async function cachePlan(cacheKey: string, plan: string, usage: any): Promise<void> {
  if (!supabase) return;
  await supabase.from('plan_cache').upsert({
    cache_key: cacheKey,
    plan_markdown: plan,
    token_usage: usage,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'cache_key' });
}
