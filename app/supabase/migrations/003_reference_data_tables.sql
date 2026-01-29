-- Migration 003: Reference data tables for admin-managed content
-- Tactics/Plays, KPIs, ROI Benchmarks, Journey Templates, Channel Priorities, Offerings

-- ============================================================
-- 1. Tactics (cross-discipline strategic plays)
-- ============================================================
CREATE TABLE IF NOT EXISTS tactics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  disciplines TEXT[] NOT NULL DEFAULT '{}',
  industries TEXT[] NOT NULL DEFAULT '{}',
  tracks TEXT[] DEFAULT '{}',
  phases INT[] NOT NULL DEFAULT '{}',
  maturity_level_min INT DEFAULT 1,
  maturity_level_max INT DEFAULT 3,
  lifecycle_stages TEXT[] DEFAULT '{}',
  channel_mix TEXT[] DEFAULT '{}',
  expected_roi JSONB,
  implementation_effort TEXT CHECK (implementation_effort IN ('low', 'medium', 'high')),
  prerequisites TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tactics_industries ON tactics USING GIN (industries);
CREATE INDEX idx_tactics_disciplines ON tactics USING GIN (disciplines);
CREATE INDEX idx_tactics_active ON tactics (is_active) WHERE is_active = TRUE;

-- ============================================================
-- 2. KPIs (industry-specific key performance indicators)
-- ============================================================
CREATE TABLE IF NOT EXISTS ref_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('engagement', 'conversion', 'retention', 'revenue', 'efficiency', 'loyalty')),
  benchmark TEXT,
  how_to_measure TEXT,
  improvement_levers TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ref_kpis_industry ON ref_kpis (industry);
CREATE INDEX idx_ref_kpis_active ON ref_kpis (is_active) WHERE is_active = TRUE;

-- ============================================================
-- 3. ROI Benchmarks
-- ============================================================
CREATE TABLE IF NOT EXISTS ref_roi_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT,
  metric TEXT NOT NULL,
  value TEXT NOT NULL,
  context TEXT,
  phase INT,
  source TEXT CHECK (source IN ('industry-average', 'merkle-benchmark', 'salesforce-benchmark')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ref_roi_industry ON ref_roi_benchmarks (industry);

-- ============================================================
-- 4. Journey Templates
-- ============================================================
CREATE TABLE IF NOT EXISTS ref_journey_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  relevance TEXT NOT NULL CHECK (relevance IN ('critical', 'high', 'medium', 'low', 'not-applicable')),
  benchmark TEXT,
  notes TEXT,
  phase INT,
  channels TEXT[] DEFAULT '{}',
  tactic_id UUID REFERENCES tactics(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ref_journeys_industry ON ref_journey_templates (industry);

-- ============================================================
-- 5. Channel Priorities
-- ============================================================
CREATE TABLE IF NOT EXISTS ref_channel_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  channel TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ref_channels_industry ON ref_channel_priorities (industry);

-- ============================================================
-- 6. Offerings (Merkle service offerings)
-- ============================================================
CREATE TABLE IF NOT EXISTS ref_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sizing TEXT,
  disciplines TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. Plan Cache
-- ============================================================
CREATE TABLE IF NOT EXISTS plan_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  plan_markdown TEXT NOT NULL,
  token_usage JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX idx_plan_cache_key ON plan_cache (cache_key);
CREATE INDEX idx_plan_cache_expires ON plan_cache (expires_at);

-- ============================================================
-- 8. Admin Users (simple email allowlist)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE tactics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_roi_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_journey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_channel_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Permissive policies (matching existing pattern)
CREATE POLICY "Allow all on tactics" ON tactics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ref_kpis" ON ref_kpis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ref_roi_benchmarks" ON ref_roi_benchmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ref_journey_templates" ON ref_journey_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ref_channel_priorities" ON ref_channel_priorities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ref_offerings" ON ref_offerings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on plan_cache" ON plan_cache FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Updated_at trigger for tactics
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tactics_updated_at
  BEFORE UPDATE ON tactics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
