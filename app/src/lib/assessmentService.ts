import { supabase, isSupabaseConfigured } from './supabase';
import type {
  OpportunityAssessment,
  TrackLevelAssessment,
  AssessmentAnswer,
  IndustryType,
  MarketingFoundationType,
  GlobalAssessmentInputs,
  GeneratedPlan,
} from '../types';

// Database types (snake_case as they come from Supabase)
interface DbAssessment {
  id: string;
  client_name: string;
  opportunity_name: string | null;
  industry: string | null;
  marketing_foundation: string | null;
  user_email: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

interface DbTrackAssessment {
  id: string;
  assessment_id: string;
  track_id: string;
  level: number;
  status: string;
  answers: AssessmentAnswer[];
  notes: string | null;
  assessed_at: string;
}

interface DbGlobalInputs {
  id: string;
  assessment_id: string;
  client_context: Record<string, unknown> | null;
  commercial_preferences: Record<string, unknown> | null;
  strategic_context: Record<string, unknown> | null;
}

interface DbGeneratedPlan {
  id: string;
  assessment_id: string;
  plan_data: GeneratedPlan;
  generated_at: string;
}

// Transform functions
function dbToAssessment(
  db: DbAssessment,
  trackAssessments: DbTrackAssessment[],
  globalInputs: DbGlobalInputs | null,
  generatedPlan: DbGeneratedPlan | null
): OpportunityAssessment {
  const trackAssessmentsMap: Record<string, TrackLevelAssessment> = {};

  for (const ta of trackAssessments) {
    const key = `${ta.track_id}-${ta.level}`;
    trackAssessmentsMap[key] = {
      trackId: ta.track_id as TrackLevelAssessment['trackId'],
      level: ta.level as TrackLevelAssessment['level'],
      status: ta.status as TrackLevelAssessment['status'],
      answers: ta.answers || [],
      notes: ta.notes || undefined,
      assessedAt: new Date(ta.assessed_at),
    };
  }

  return {
    id: db.id,
    clientName: db.client_name,
    opportunityName: db.opportunity_name || undefined,
    industry: db.industry as IndustryType | undefined,
    marketingFoundation: db.marketing_foundation as MarketingFoundationType | undefined,
    userEmail: db.user_email || undefined,
    isComplete: db.is_complete,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    assessments: {}, // Legacy - not used in track-based model
    trackAssessments: trackAssessmentsMap,
    globalInputs: globalInputs ? {
      clientContext: (globalInputs.client_context || {}) as GlobalAssessmentInputs['clientContext'],
      commercialPreferences: (globalInputs.commercial_preferences || {}) as GlobalAssessmentInputs['commercialPreferences'],
      strategicContext: (globalInputs.strategic_context || {}) as GlobalAssessmentInputs['strategicContext'],
    } : undefined,
    generatedPlan: generatedPlan?.plan_data || undefined,
  };
}

// Service functions
export const assessmentService = {
  // Check if Supabase is available
  isAvailable(): boolean {
    return isSupabaseConfigured();
  },

  // Create a new assessment
  async createAssessment(
    clientName: string,
    industry: IndustryType,
    marketingFoundation: MarketingFoundationType | null,
    opportunityName?: string
  ): Promise<OpportunityAssessment | null> {
    if (!supabase) {
      console.warn('Supabase not configured - assessment will not be persisted');
      return null;
    }

    console.log('[assessmentService] Creating assessment:', { clientName, industry, marketingFoundation });

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        client_name: clientName,
        opportunity_name: opportunityName || null,
        industry: industry,
        marketing_foundation: marketingFoundation,
        is_complete: false,
      })
      .select()
      .single();

    if (error) {
      console.error('[assessmentService] Failed to create assessment:', error);
      return null;
    }

    console.log('[assessmentService] Assessment created successfully:', data.id);
    return dbToAssessment(data, [], null, null);
  },

  // Load an assessment by ID
  async loadAssessment(assessmentId: string): Promise<OpportunityAssessment | null> {
    if (!supabase) return null;

    // Load assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (assessmentError || !assessment) {
      console.error('Failed to load assessment:', assessmentError);
      return null;
    }

    // Load track assessments
    const { data: trackAssessments } = await supabase
      .from('track_assessments')
      .select('*')
      .eq('assessment_id', assessmentId);

    // Load global inputs
    const { data: globalInputs } = await supabase
      .from('assessment_global_inputs')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    // Load generated plan
    const { data: generatedPlan } = await supabase
      .from('generated_plans')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    return dbToAssessment(
      assessment,
      trackAssessments || [],
      globalInputs || null,
      generatedPlan || null
    );
  },

  // List recent assessments
  async listAssessments(limit = 10): Promise<{ id: string; clientName: string; industry: string | null; updatedAt: Date; isComplete: boolean }[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('assessments')
      .select('id, client_name, industry, updated_at, is_complete')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to list assessments:', error);
      return [];
    }

    return (data || []).map((d) => ({
      id: d.id,
      clientName: d.client_name,
      industry: d.industry,
      updatedAt: new Date(d.updated_at),
      isComplete: d.is_complete,
    }));
  },

  // List assessments by user email
  async listAssessmentsByEmail(email: string): Promise<{ id: string; clientName: string; industry: string | null; updatedAt: Date; isComplete: boolean; createdAt: Date }[]> {
    if (!supabase) return [];

    // Normalize email for lookup
    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase
      .from('assessments')
      .select('id, client_name, industry, updated_at, is_complete, created_at')
      .eq('user_email', normalizedEmail)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to list assessments by email:', error);
      return [];
    }

    return (data || []).map((d) => ({
      id: d.id,
      clientName: d.client_name,
      industry: d.industry,
      updatedAt: new Date(d.updated_at),
      createdAt: new Date(d.created_at),
      isComplete: d.is_complete,
    }));
  },

  // Update assessment metadata
  async updateAssessment(
    assessmentId: string,
    updates: {
      clientName?: string;
      opportunityName?: string;
      industry?: IndustryType;
      marketingFoundation?: MarketingFoundationType;
      isComplete?: boolean;
      userEmail?: string;
    }
  ): Promise<boolean> {
    if (!supabase) return false;

    const dbUpdates: Record<string, unknown> = {};
    if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
    if (updates.opportunityName !== undefined) dbUpdates.opportunity_name = updates.opportunityName;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.marketingFoundation !== undefined) dbUpdates.marketing_foundation = updates.marketingFoundation;
    if (updates.isComplete !== undefined) dbUpdates.is_complete = updates.isComplete;
    // Normalize email: lowercase and trimmed
    if (updates.userEmail !== undefined) dbUpdates.user_email = updates.userEmail.toLowerCase().trim();

    const { error } = await supabase
      .from('assessments')
      .update(dbUpdates)
      .eq('id', assessmentId);

    if (error) {
      console.error('Failed to update assessment:', error);
      return false;
    }

    return true;
  },

  // Save a track level assessment
  async saveTrackAssessment(
    assessmentId: string,
    trackAssessment: TrackLevelAssessment
  ): Promise<boolean> {
    if (!supabase) return false;

    console.log('[assessmentService] Saving track assessment:', {
      assessmentId,
      trackId: trackAssessment.trackId,
      level: trackAssessment.level
    });

    const { error } = await supabase
      .from('track_assessments')
      .upsert({
        assessment_id: assessmentId,
        track_id: trackAssessment.trackId,
        level: trackAssessment.level,
        status: trackAssessment.status,
        answers: trackAssessment.answers,
        notes: trackAssessment.notes || null,
        assessed_at: trackAssessment.assessedAt?.toISOString() || new Date().toISOString(),
      }, {
        onConflict: 'assessment_id,track_id,level',
      });

    if (error) {
      console.error('[assessmentService] Failed to save track assessment:', error);
      return false;
    }

    console.log('[assessmentService] Track assessment saved successfully');
    return true;
  },

  // Save global inputs
  async saveGlobalInputs(
    assessmentId: string,
    inputs: GlobalAssessmentInputs
  ): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
      .from('assessment_global_inputs')
      .upsert({
        assessment_id: assessmentId,
        client_context: inputs.clientContext,
        commercial_preferences: inputs.commercialPreferences,
        strategic_context: inputs.strategicContext,
      }, {
        onConflict: 'assessment_id',
      });

    if (error) {
      console.error('Failed to save global inputs:', error);
      return false;
    }

    return true;
  },

  // Save generated plan
  async saveGeneratedPlan(
    assessmentId: string,
    plan: GeneratedPlan
  ): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
      .from('generated_plans')
      .upsert({
        assessment_id: assessmentId,
        plan_data: plan,
        generated_at: new Date().toISOString(),
      }, {
        onConflict: 'assessment_id',
      });

    if (error) {
      console.error('Failed to save generated plan:', error);
      return false;
    }

    return true;
  },

  // Delete an assessment
  async deleteAssessment(assessmentId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId);

    if (error) {
      console.error('Failed to delete assessment:', error);
      return false;
    }

    return true;
  },
};
