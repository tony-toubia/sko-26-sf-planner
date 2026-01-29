-- Migration: Add assessment_global_inputs and generated_plans tables
-- These were missing from the migration set but are required by the app

CREATE TABLE IF NOT EXISTS assessment_global_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE UNIQUE,
  client_context JSONB DEFAULT '{}',
  commercial_preferences JSONB DEFAULT '{}',
  strategic_context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_global_inputs_assessment ON assessment_global_inputs(assessment_id);

CREATE TABLE IF NOT EXISTS generated_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE UNIQUE,
  plan_data JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_plans_assessment ON generated_plans(assessment_id);

-- RLS
ALTER TABLE assessment_global_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on assessment_global_inputs" ON assessment_global_inputs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on generated_plans" ON generated_plans FOR ALL USING (true) WITH CHECK (true);
