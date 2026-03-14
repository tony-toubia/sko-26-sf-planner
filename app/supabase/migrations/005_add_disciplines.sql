-- Migration: Add disciplines column to assessments table
-- Stores which Salesforce clouds/disciplines were selected for the assessment
-- e.g. ['messaging-personalization', 'loyalty']

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS disciplines TEXT[] DEFAULT '{}';
