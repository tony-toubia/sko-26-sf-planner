-- Supabase Schema for Salesforce Maturity Matrix Tool
-- Run this in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assessments table - stores the main assessment record
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  opportunity_name TEXT,
  industry TEXT,
  marketing_foundation TEXT, -- 'mc-engagement' or 'mc-advanced'
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track assessments table - stores track-level maturity assessments
CREATE TABLE IF NOT EXISTS track_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL, -- 'data-identity' | 'journeys' | 'content-channels' | 'intelligence'
  level INTEGER NOT NULL, -- 1, 2, or 3
  status TEXT NOT NULL, -- 'not-started' | 'in-progress' | 'complete'
  answers JSONB DEFAULT '[]', -- Array of {questionId, value} objects
  notes TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assessment_id, track_id, level)
);

-- Global inputs table - stores commercial/strategic context for an assessment
CREATE TABLE IF NOT EXISTS assessment_global_inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,

  -- Client context
  company_size TEXT,
  current_marketing_maturity INTEGER,
  existing_tech_stack TEXT,
  team_size TEXT,
  annual_marketing_budget TEXT,

  -- Commercial preferences
  preferred_engagement_models TEXT[], -- Array of MerkleOfferingType
  budget_range TEXT,
  budget_flexibility TEXT,
  decision_timeline TEXT,
  internal_resources TEXT,
  prefer_capex_or_opex TEXT,

  -- Strategic context
  key_business_drivers TEXT[],
  success_metrics TEXT[],
  known_constraints TEXT,
  competitive_pressures TEXT,
  executive_sponsor TEXT,
  additional_context TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assessment_id)
);

-- Capability assessments table - stores individual capability evaluations
CREATE TABLE IF NOT EXISTS capability_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  capability_id TEXT NOT NULL,
  relevance TEXT NOT NULL, -- 'complete' | 'in-progress' | 'immediately-relevant' | 'near-future' | 'not-ready' | 'not-assessed'
  notes TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assessment_id, capability_id)
);

-- Assessment answers table - stores answers to capability questions
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capability_assessment_id UUID NOT NULL REFERENCES capability_assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  value JSONB NOT NULL, -- Can be string, array, or number

  UNIQUE(capability_assessment_id, question_id)
);

-- Generated plans table - stores the output from plan generation
CREATE TABLE IF NOT EXISTS generated_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL, -- Stores the entire GeneratedPlan object
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assessment_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_client_name ON assessments(client_name);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_capability_assessments_assessment_id ON capability_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_capability_assessments_relevance ON capability_assessments(relevance);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_capability_assessment_id ON assessment_answers(capability_assessment_id);
CREATE INDEX IF NOT EXISTS idx_track_assessments_assessment_id ON track_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_track_assessments_track_level ON track_assessments(track_id, level);

-- Row Level Security (RLS) policies
-- For now, we'll allow all operations. In production, you'd want proper auth.
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_global_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE capability_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_assessments ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development (allows all operations)
-- Replace these with proper auth-based policies in production
CREATE POLICY "Allow all operations on assessments" ON assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assessment_global_inputs" ON assessment_global_inputs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on capability_assessments" ON capability_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assessment_answers" ON assessment_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on generated_plans" ON generated_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on track_assessments" ON track_assessments FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update updated_at on assessments
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_global_inputs_updated_at
  BEFORE UPDATE ON assessment_global_inputs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
