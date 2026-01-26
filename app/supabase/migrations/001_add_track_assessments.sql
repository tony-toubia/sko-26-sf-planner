-- Migration: Add track_assessments table and marketing_foundation column
-- Run this if you have an existing database from before this update

-- Add marketing_foundation column to assessments table
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS marketing_foundation TEXT;

-- Create track_assessments table
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_track_assessments_assessment_id ON track_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_track_assessments_track_level ON track_assessments(track_id, level);

-- Enable RLS
ALTER TABLE track_assessments ENABLE ROW LEVEL SECURITY;

-- Add permissive policy for development
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'track_assessments' AND policyname = 'Allow all operations on track_assessments'
  ) THEN
    CREATE POLICY "Allow all operations on track_assessments" ON track_assessments FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;
