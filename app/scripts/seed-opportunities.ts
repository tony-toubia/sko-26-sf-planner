/**
 * Seed script to populate sample opportunities in Supabase
 * Run with: npx tsx scripts/seed-opportunities.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hhkhcpicvzjtvpwsadoc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoa2hjcGljdnpqdHZwd3NhZG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0Nzg5MTQsImV4cCI6MjA1MjA1NDkxNH0.wL6O6FLqmhOaMZ4irnDq0Z4Gl4yIDMLv68VqXyBZh5c';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample opportunities
const opportunities = [
  // Michel Mayor's opportunities
  {
    user_email: 'michel.mayor@merkle.com',
    client_name: 'Regions Bank',
    opportunity_name: 'MC Advanced Migration & Customer Journey Optimization',
    industry: 'financial-services',
    marketing_foundation: 'mc-advanced',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'data-identity-2': {
        trackId: 'data-identity',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-2': {
        trackId: 'journeys',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'intelligence-1': {
        trackId: 'intelligence',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: false,
  },
  {
    user_email: 'michel.mayor@merkle.com',
    client_name: 'WeatherTech',
    opportunity_name: 'E-commerce Journey Enhancement',
    industry: 'retail-cpg-qsr',
    marketing_foundation: 'mc-advanced',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-2': {
        trackId: 'journeys',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: false,
  },

  // Tony Toubia's opportunities
  {
    user_email: 'tony.toubia@merkle.com',
    client_name: 'Gap Inc.',
    opportunity_name: 'Marketing Cloud Modernization',
    industry: 'retail-cpg-qsr',
    marketing_foundation: 'mc-advanced',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'data-identity-2': {
        trackId: 'data-identity',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'data-identity-3': {
        trackId: 'data-identity',
        level: 3,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-2': {
        trackId: 'journeys',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-3': {
        trackId: 'journeys',
        level: 3,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-2': {
        trackId: 'content-channels',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'intelligence-1': {
        trackId: 'intelligence',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'intelligence-2': {
        trackId: 'intelligence',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: true,
  },
  {
    user_email: 'tony.toubia@merkle.com',
    client_name: 'Dominos',
    opportunity_name: 'QSR Digital Transformation',
    industry: 'retail-cpg-qsr',
    marketing_foundation: 'mc-advanced',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'intelligence-1': {
        trackId: 'intelligence',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'intelligence-2': {
        trackId: 'intelligence',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: false,
  },

  // Jonah Rudman's opportunities
  {
    user_email: 'jonah.rudman@merkle.com',
    client_name: 'Yahoo',
    opportunity_name: 'Audience Engagement Platform',
    industry: 'media-entertainment',
    marketing_foundation: 'mc-advanced',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'data-identity-2': {
        trackId: 'data-identity',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-2': {
        trackId: 'content-channels',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'intelligence-1': {
        trackId: 'intelligence',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: false,
  },
  {
    user_email: 'jonah.rudman@merkle.com',
    client_name: 'Planet Fitness',
    opportunity_name: 'Member Lifecycle Marketing',
    industry: 'travel-hospitality',
    marketing_foundation: 'mc-engagement',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-2': {
        trackId: 'journeys',
        level: 2,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: false,
  },
  {
    user_email: 'jonah.rudman@merkle.com',
    client_name: 'Rawlings',
    opportunity_name: 'Sports Equipment Digital Marketing',
    industry: 'retail-cpg-qsr',
    marketing_foundation: 'mc-advanced',
    disciplines: ['messaging-personalization'],
    track_assessments: {
      'data-identity-1': {
        trackId: 'data-identity',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'journeys-1': {
        trackId: 'journeys',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
      'content-channels-1': {
        trackId: 'content-channels',
        level: 1,
        status: 'complete',
        answers: [],
        assessedAt: new Date().toISOString(),
      },
    },
    is_complete: false,
  },
];

async function seedOpportunities() {
  console.log('🌱 Seeding opportunities...\n');

  for (const opp of opportunities) {
    console.log(`Creating opportunity for ${opp.client_name} (${opp.user_email})...`);

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        client_name: opp.client_name,
        opportunity_name: opp.opportunity_name,
        industry: opp.industry,
        marketing_foundation: opp.marketing_foundation,
        disciplines: opp.disciplines,
        track_assessments: opp.track_assessments,
        is_complete: opp.is_complete,
        user_email: opp.user_email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error creating ${opp.client_name}:`, error.message);
    } else {
      console.log(`✅ Created ${opp.client_name} (ID: ${data.id})`);
      console.log(`   - ${Object.keys(opp.track_assessments).length} track levels assessed`);
      console.log(`   - Status: ${opp.is_complete ? 'Complete' : 'In Progress'}\n`);
    }
  }

  console.log('✨ Seeding complete!');
  console.log(`\n📊 Total opportunities created: ${opportunities.length}`);
  console.log(`👥 Users: michel.mayor@merkle.com, tony.toubia@merkle.com, jonah.rudman@merkle.com`);
  console.log(`\n🔗 View pipeline at: ${supabaseUrl.replace('https://', 'https://sko-26-sf-planner.vercel.app')}/pipeline`);
}

seedOpportunities().catch(console.error);
