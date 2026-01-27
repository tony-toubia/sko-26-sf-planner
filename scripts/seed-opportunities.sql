-- Seed Opportunities for Pipeline
-- Run this SQL in the Supabase SQL Editor
-- This creates 7 opportunities across 3 users with track assessments

-- Michel Mayor's Opportunities

-- Regions Bank
DO $$
DECLARE
  regions_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'michel.mayor@merkle.com',
    'Regions Bank',
    'MC Advanced Migration & Customer Journey Optimization',
    'financial-services',
    'mc-advanced',
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO regions_id;

  -- Insert track assessments for Regions Bank (6 track levels)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (regions_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (regions_id, 'data-identity', 2, 'complete', '[]'::jsonb, NOW()),
    (regions_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (regions_id, 'journeys', 2, 'complete', '[]'::jsonb, NOW()),
    (regions_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW()),
    (regions_id, 'intelligence', 1, 'complete', '[]'::jsonb, NOW());
END $$;

-- WeatherTech
DO $$
DECLARE
  weather_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'michel.mayor@merkle.com',
    'WeatherTech',
    'E-commerce Journey Enhancement',
    'retail-cpg-qsr',
    'mc-advanced',
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO weather_id;

  -- Insert track assessments for WeatherTech (4 track levels)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (weather_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (weather_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (weather_id, 'journeys', 2, 'complete', '[]'::jsonb, NOW()),
    (weather_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW());
END $$;

-- Tony Toubia's Opportunities

-- Gap Inc.
DO $$
DECLARE
  gap_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'tony.toubia@merkle.com',
    'Gap Inc.',
    'Marketing Cloud Modernization',
    'retail-cpg-qsr',
    'mc-advanced',
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO gap_id;

  -- Insert track assessments for Gap Inc. (10 track levels - largest opportunity)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (gap_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'data-identity', 2, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'data-identity', 3, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'journeys', 2, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'journeys', 3, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'content-channels', 2, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'intelligence', 1, 'complete', '[]'::jsonb, NOW()),
    (gap_id, 'intelligence', 2, 'complete', '[]'::jsonb, NOW());
END $$;

-- Dominos
DO $$
DECLARE
  dominos_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'tony.toubia@merkle.com',
    'Dominos',
    'QSR Digital Transformation',
    'retail-cpg-qsr',
    'mc-advanced',
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO dominos_id;

  -- Insert track assessments for Dominos (5 track levels)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (dominos_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (dominos_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (dominos_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW()),
    (dominos_id, 'intelligence', 1, 'complete', '[]'::jsonb, NOW()),
    (dominos_id, 'intelligence', 2, 'complete', '[]'::jsonb, NOW());
END $$;

-- Jonah Rudman's Opportunities

-- Yahoo
DO $$
DECLARE
  yahoo_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'jonah.rudman@merkle.com',
    'Yahoo',
    'Audience Engagement Platform',
    'media-entertainment',
    'mc-advanced',
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO yahoo_id;

  -- Insert track assessments for Yahoo (6 track levels)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (yahoo_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (yahoo_id, 'data-identity', 2, 'complete', '[]'::jsonb, NOW()),
    (yahoo_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (yahoo_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW()),
    (yahoo_id, 'content-channels', 2, 'complete', '[]'::jsonb, NOW()),
    (yahoo_id, 'intelligence', 1, 'complete', '[]'::jsonb, NOW());
END $$;

-- Planet Fitness
DO $$
DECLARE
  planet_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'jonah.rudman@merkle.com',
    'Planet Fitness',
    'Member Lifecycle Marketing',
    'travel-hospitality',
    'mc-engagement',
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO planet_id;

  -- Insert track assessments for Planet Fitness (4 track levels)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (planet_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (planet_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (planet_id, 'journeys', 2, 'complete', '[]'::jsonb, NOW()),
    (planet_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW());
END $$;

-- Rawlings
DO $$
DECLARE
  rawlings_id uuid;
BEGIN
  INSERT INTO assessments (
    user_email,
    client_name,
    opportunity_name,
    industry,
    marketing_foundation,
    is_complete,
    created_at,
    updated_at
  ) VALUES (
    'jonah.rudman@merkle.com',
    'Rawlings',
    'Sports Equipment Digital Marketing',
    'retail-cpg-qsr',
    'mc-advanced',
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO rawlings_id;

  -- Insert track assessments for Rawlings (3 track levels - smallest)
  INSERT INTO track_assessments (assessment_id, track_id, level, status, answers, assessed_at) VALUES
    (rawlings_id, 'data-identity', 1, 'complete', '[]'::jsonb, NOW()),
    (rawlings_id, 'journeys', 1, 'complete', '[]'::jsonb, NOW()),
    (rawlings_id, 'content-channels', 1, 'complete', '[]'::jsonb, NOW());
END $$;

-- Verify the inserted records
SELECT
  a.user_email,
  a.client_name,
  a.opportunity_name,
  COUNT(t.id) as track_count,
  a.is_complete
FROM assessments a
LEFT JOIN track_assessments t ON t.assessment_id = a.id
WHERE a.user_email IN ('michel.mayor@merkle.com', 'tony.toubia@merkle.com', 'jonah.rudman@merkle.com')
GROUP BY a.id, a.user_email, a.client_name, a.opportunity_name, a.is_complete
ORDER BY a.user_email, a.created_at;
