/**
 * Reference Data Service
 * Pattern: DB first, hardcoded fallback
 *
 * Tries to fetch reference data from Supabase tables.
 * Falls back to hardcoded TypeScript constants if DB unavailable or empty.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import {
  INDUSTRY_KPIS,
  INDUSTRY_JOURNEY_MAPPINGS,
  INDUSTRY_ROI_BENCHMARKS,
  INDUSTRY_CHANNEL_PRIORITIES,
} from '../data/industryReference';
import type { IndustryType, Tactic, RefKPI, RefROIBenchmark, RefJourneyTemplate, RefChannelPriority, RefOffering } from '../types';

// ============================================================
// DB row → app type transformers
// ============================================================

function dbToTactic(row: any): Tactic {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    disciplines: row.disciplines || [],
    industries: row.industries || [],
    tracks: row.tracks || [],
    phases: row.phases || [],
    maturityLevelMin: row.maturity_level_min,
    maturityLevelMax: row.maturity_level_max,
    lifecycleStages: row.lifecycle_stages || [],
    channelMix: row.channel_mix || [],
    expectedROI: row.expected_roi,
    implementationEffort: row.implementation_effort,
    prerequisites: row.prerequisites || [],
    tags: row.tags || [],
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function dbToKPI(row: any): RefKPI {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    category: row.category,
    benchmark: row.benchmark,
    howToMeasure: row.how_to_measure,
    improvementLevers: row.improvement_levers || [],
    isActive: row.is_active,
  };
}

function dbToROIBenchmark(row: any): RefROIBenchmark {
  return {
    id: row.id,
    industry: row.industry,
    metric: row.metric,
    value: row.value,
    context: row.context,
    phase: row.phase,
    source: row.source,
    isActive: row.is_active,
  };
}

function dbToJourneyTemplate(row: any): RefJourneyTemplate {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    relevance: row.relevance,
    benchmark: row.benchmark,
    notes: row.notes,
    phase: row.phase,
    channels: row.channels || [],
    tacticId: row.tactic_id,
    isActive: row.is_active,
  };
}

function dbToChannelPriority(row: any): RefChannelPriority {
  return {
    id: row.id,
    industry: row.industry,
    channel: row.channel,
    priority: row.priority,
    notes: row.notes,
    isActive: row.is_active,
  };
}

function dbToOffering(row: any): RefOffering {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    description: row.description,
    sizing: row.sizing,
    disciplines: row.disciplines || [],
    isActive: row.is_active,
  };
}

// ============================================================
// Tactics (NEW - no hardcoded fallback, DB only)
// ============================================================

export async function getTacticsForContext(opts: {
  industry?: string;
  disciplines?: string[];
  maturityLevel?: number;
}): Promise<Tactic[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  let query = supabase.from('tactics').select('*').eq('is_active', true);

  if (opts.industry) {
    query = query.contains('industries', [opts.industry]);
  }
  if (opts.disciplines?.length) {
    query = query.overlaps('disciplines', opts.disciplines);
  }

  const { data, error } = await query;
  if (error || !data?.length) return [];

  let tactics = data.map(dbToTactic);

  // Filter by maturity level client-side (array overlap not supported for int ranges in PostgREST)
  if (opts.maturityLevel !== undefined) {
    tactics = tactics.filter(
      (t) => opts.maturityLevel! >= t.maturityLevelMin && opts.maturityLevel! <= t.maturityLevelMax
    );
  }

  return tactics;
}

export async function getAllTactics(): Promise<Tactic[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase.from('tactics').select('*').order('name');
  if (error || !data) return [];
  return data.map(dbToTactic);
}

export async function saveTactic(tactic: Partial<Tactic> & { name: string; slug: string }): Promise<Tactic | null> {
  if (!supabase) return null;
  const row: any = {
    name: tactic.name,
    slug: tactic.slug,
    description: tactic.description || null,
    disciplines: tactic.disciplines || [],
    industries: tactic.industries || [],
    tracks: tactic.tracks || [],
    phases: tactic.phases || [],
    maturity_level_min: tactic.maturityLevelMin ?? 1,
    maturity_level_max: tactic.maturityLevelMax ?? 3,
    lifecycle_stages: tactic.lifecycleStages || [],
    channel_mix: tactic.channelMix || [],
    expected_roi: tactic.expectedROI || null,
    implementation_effort: tactic.implementationEffort || null,
    prerequisites: tactic.prerequisites || [],
    tags: tactic.tags || [],
    is_active: tactic.isActive ?? true,
  };

  if (tactic.id) {
    const { data, error } = await supabase.from('tactics').update(row).eq('id', tactic.id).select().single();
    if (error) { console.error('Error saving tactic:', error); return null; }
    return dbToTactic(data);
  } else {
    const { data, error } = await supabase.from('tactics').insert(row).select().single();
    if (error) { console.error('Error creating tactic:', error); return null; }
    return dbToTactic(data);
  }
}

export async function deleteTactic(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('tactics').delete().eq('id', id);
  return !error;
}

// ============================================================
// KPIs (DB first, hardcoded fallback)
// ============================================================

export async function getKPIsForIndustry(industry: IndustryType): Promise<RefKPI[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.from('ref_kpis').select('*').eq('industry', industry).eq('is_active', true);
    if (data?.length) return data.map(dbToKPI);
  }
  // Fallback
  return (INDUSTRY_KPIS[industry] || []).map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    industry,
    category: kpi.category,
    benchmark: kpi.typicalBenchmark,
    howToMeasure: kpi.howToMeasure,
    improvementLevers: kpi.improvementLevers || [],
    isActive: true,
  }));
}

export async function getAllKPIs(): Promise<RefKPI[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('ref_kpis').select('*').order('industry').order('name');
  return (data || []).map(dbToKPI);
}

export async function saveKPI(kpi: Partial<RefKPI> & { name: string; industry: string; category: string }): Promise<RefKPI | null> {
  if (!supabase) return null;
  const row: any = {
    name: kpi.name,
    industry: kpi.industry,
    category: kpi.category,
    benchmark: kpi.benchmark || null,
    how_to_measure: kpi.howToMeasure || null,
    improvement_levers: kpi.improvementLevers || [],
    is_active: kpi.isActive ?? true,
  };

  if (kpi.id) {
    const { data, error } = await supabase.from('ref_kpis').update(row).eq('id', kpi.id).select().single();
    if (error) return null;
    return dbToKPI(data);
  } else {
    const { data, error } = await supabase.from('ref_kpis').insert(row).select().single();
    if (error) return null;
    return dbToKPI(data);
  }
}

export async function deleteKPI(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('ref_kpis').delete().eq('id', id);
  return !error;
}

// ============================================================
// ROI Benchmarks (DB first, hardcoded fallback)
// ============================================================

export async function getROIBenchmarks(industry?: IndustryType): Promise<RefROIBenchmark[]> {
  if (isSupabaseConfigured() && supabase) {
    let query = supabase.from('ref_roi_benchmarks').select('*').eq('is_active', true);
    if (industry) {
      // Get industry-specific + general (null industry)
      query = query.or(`industry.eq.${industry},industry.is.null`);
    }
    const { data } = await query;
    if (data?.length) return data.map(dbToROIBenchmark);
  }
  // Fallback
  if (industry) {
    return (INDUSTRY_ROI_BENCHMARKS[industry] || []).map((b, i) => ({
      id: `fallback-${i}`,
      industry,
      metric: b.metric,
      value: b.value,
      context: b.context,
      phase: undefined,
      source: b.source as any,
      isActive: true,
    }));
  }
  return [];
}

export async function getAllROIBenchmarks(): Promise<RefROIBenchmark[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('ref_roi_benchmarks').select('*').order('industry').order('metric');
  return (data || []).map(dbToROIBenchmark);
}

export async function saveROIBenchmark(benchmark: Partial<RefROIBenchmark> & { metric: string; value: string }): Promise<RefROIBenchmark | null> {
  if (!supabase) return null;
  const row: any = {
    industry: benchmark.industry || null,
    metric: benchmark.metric,
    value: benchmark.value,
    context: benchmark.context || null,
    phase: benchmark.phase || null,
    source: benchmark.source || null,
    is_active: benchmark.isActive ?? true,
  };

  if (benchmark.id) {
    const { data, error } = await supabase.from('ref_roi_benchmarks').update(row).eq('id', benchmark.id).select().single();
    if (error) return null;
    return dbToROIBenchmark(data);
  } else {
    const { data, error } = await supabase.from('ref_roi_benchmarks').insert(row).select().single();
    if (error) return null;
    return dbToROIBenchmark(data);
  }
}

export async function deleteROIBenchmark(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('ref_roi_benchmarks').delete().eq('id', id);
  return !error;
}

// ============================================================
// Journey Templates (DB first, hardcoded fallback)
// ============================================================

export async function getJourneyTemplates(industry: IndustryType): Promise<RefJourneyTemplate[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.from('ref_journey_templates').select('*').eq('industry', industry).eq('is_active', true);
    if (data?.length) return data.map(dbToJourneyTemplate);
  }
  // Fallback
  return (INDUSTRY_JOURNEY_MAPPINGS[industry] || []).map((j, i) => ({
    id: `fallback-${i}`,
    name: j.industryName || j.journeyId,
    industry,
    relevance: j.relevance as any,
    benchmark: j.industryBenchmarks?.map((b: any) => `${b.metric}: ${b.value}`).join('; '),
    notes: j.industryNotes,
    phase: undefined,
    channels: [],
    isActive: true,
  }));
}

export async function getAllJourneyTemplates(): Promise<RefJourneyTemplate[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('ref_journey_templates').select('*').order('industry').order('name');
  return (data || []).map(dbToJourneyTemplate);
}

export async function saveJourneyTemplate(journey: Partial<RefJourneyTemplate> & { name: string; industry: string; relevance: string }): Promise<RefJourneyTemplate | null> {
  if (!supabase) return null;
  const row: any = {
    name: journey.name,
    industry: journey.industry,
    relevance: journey.relevance,
    benchmark: journey.benchmark || null,
    notes: journey.notes || null,
    phase: journey.phase || null,
    channels: journey.channels || [],
    tactic_id: journey.tacticId || null,
    is_active: journey.isActive ?? true,
  };

  if (journey.id) {
    const { data, error } = await supabase.from('ref_journey_templates').update(row).eq('id', journey.id).select().single();
    if (error) return null;
    return dbToJourneyTemplate(data);
  } else {
    const { data, error } = await supabase.from('ref_journey_templates').insert(row).select().single();
    if (error) return null;
    return dbToJourneyTemplate(data);
  }
}

export async function deleteJourneyTemplate(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('ref_journey_templates').delete().eq('id', id);
  return !error;
}

// ============================================================
// Channel Priorities (DB first, hardcoded fallback)
// ============================================================

export async function getChannelPriorities(industry: IndustryType): Promise<RefChannelPriority[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.from('ref_channel_priorities').select('*').eq('industry', industry).eq('is_active', true);
    if (data?.length) return data.map(dbToChannelPriority);
  }
  // Fallback
  return (INDUSTRY_CHANNEL_PRIORITIES[industry] || []).map((c, i) => ({
    id: `fallback-${i}`,
    industry,
    channel: c.channel,
    priority: c.priority as any,
    notes: c.industryNotes,
    isActive: true,
  }));
}

export async function getAllChannelPriorities(): Promise<RefChannelPriority[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('ref_channel_priorities').select('*').order('industry').order('channel');
  return (data || []).map(dbToChannelPriority);
}

export async function saveChannelPriority(channel: Partial<RefChannelPriority> & { industry: string; channel: string; priority: string }): Promise<RefChannelPriority | null> {
  if (!supabase) return null;
  const row: any = {
    industry: channel.industry,
    channel: channel.channel,
    priority: channel.priority,
    notes: channel.notes || null,
    is_active: channel.isActive ?? true,
  };

  if (channel.id) {
    const { data, error } = await supabase.from('ref_channel_priorities').update(row).eq('id', channel.id).select().single();
    if (error) return null;
    return dbToChannelPriority(data);
  } else {
    const { data, error } = await supabase.from('ref_channel_priorities').insert(row).select().single();
    if (error) return null;
    return dbToChannelPriority(data);
  }
}

export async function deleteChannelPriority(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('ref_channel_priorities').delete().eq('id', id);
  return !error;
}

// ============================================================
// Offerings (DB first)
// ============================================================

export async function getAllOfferings(): Promise<RefOffering[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('ref_offerings').select('*').order('name');
  return (data || []).map(dbToOffering);
}

export async function saveOffering(offering: Partial<RefOffering> & { type: string; name: string }): Promise<RefOffering | null> {
  if (!supabase) return null;
  const row: any = {
    type: offering.type,
    name: offering.name,
    description: offering.description || null,
    sizing: offering.sizing || null,
    disciplines: offering.disciplines || [],
    is_active: offering.isActive ?? true,
  };

  if (offering.id) {
    const { data, error } = await supabase.from('ref_offerings').update(row).eq('id', offering.id).select().single();
    if (error) return null;
    return dbToOffering(data);
  } else {
    const { data, error } = await supabase.from('ref_offerings').insert(row).select().single();
    if (error) return null;
    return dbToOffering(data);
  }
}

export async function deleteOffering(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('ref_offerings').delete().eq('id', id);
  return !error;
}

// ============================================================
// Plan Cache
// ============================================================

export async function getCachedPlan(cacheKey: string): Promise<{ planMarkdown: string; tokenUsage: any } | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('plan_cache')
    .select('plan_markdown, token_usage')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  return { planMarkdown: data.plan_markdown, tokenUsage: data.token_usage };
}

export async function cachePlan(cacheKey: string, planMarkdown: string, tokenUsage: any): Promise<void> {
  if (!supabase) return;
  await supabase.from('plan_cache').upsert({
    cache_key: cacheKey,
    plan_markdown: planMarkdown,
    token_usage: tokenUsage,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'cache_key' });
}

export async function clearPlanCache(): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('plan_cache').delete().lt('expires_at', new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString());
  return !error;
}

// ============================================================
// Admin Auth
// ============================================================

export async function isAdminUser(email: string): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();
  return !!data;
}
