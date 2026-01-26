-- Migration: Add user_email column to assessments table
-- This allows users to save and retrieve assessments by email address

-- Add user_email column
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create index for efficient email lookups
CREATE INDEX IF NOT EXISTS idx_assessments_user_email ON assessments(user_email);
