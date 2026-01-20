import { supabase, isSupabaseConfigured } from './supabase';
import type {
  OpportunityAssessment,
  CapabilityAssessment,
  GlobalAssessmentInputs,
  GeneratedPlan,
  CapabilityRelevance,
} from '../types';

// Types for API responses
export interface AssessmentSummary {
  id: string;
  clientName: string;
  opportunityName?: string;
  industry?: string;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  capabilityCount: number;
}

// Check if database is available
export const isDatabaseAvailable = isSupabaseConfigured;

// List all assessments (summary view)
export async function listAssessments(): Promise<AssessmentSummary[]> {
  if (!supabase) {
    console.warn('Database not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      client_name,
      opportunity_name,
      industry,
      is_complete,
      created_at,
      updated_at,
      capability_assessments(count)
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching assessments:', error);
    throw new Error(`Failed to fetch assessments: ${error.message}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => ({
    id: row.id,
    clientName: row.client_name,
    opportunityName: row.opportunity_name || undefined,
    industry: row.industry || undefined,
    isComplete: row.is_complete,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    capabilityCount: Array.isArray(row.capability_assessments)
      ? row.capability_assessments.length
      : row.capability_assessments?.count || 0,
  }));
}

// Save a new assessment or update existing
export async function saveAssessment(
  assessment: OpportunityAssessment
): Promise<string> {
  if (!supabase) {
    console.warn('Database not configured - assessment not saved');
    return assessment.id;
  }

  // Upsert main assessment record
  const { error: assessmentError } = await supabase
    .from('assessments')
    .upsert({
      id: assessment.id,
      client_name: assessment.clientName,
      opportunity_name: assessment.opportunityName || null,
      industry: assessment.industry || null,
      is_complete: assessment.isComplete,
      updated_at: new Date().toISOString(),
    });

  if (assessmentError) {
    console.error('Error saving assessment:', assessmentError);
    throw new Error(`Failed to save assessment: ${assessmentError.message}`);
  }

  // Save global inputs if present
  if (assessment.globalInputs) {
    await saveGlobalInputs(assessment.id, assessment.globalInputs);
  }

  // Save capability assessments
  for (const capAssessment of Object.values(assessment.assessments)) {
    await saveCapabilityAssessment(assessment.id, capAssessment);
  }

  // Save generated plan if present
  if (assessment.generatedPlan) {
    await saveGeneratedPlan(assessment.id, assessment.generatedPlan);
  }

  return assessment.id;
}

// Save global inputs
async function saveGlobalInputs(
  assessmentId: string,
  inputs: GlobalAssessmentInputs
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('assessment_global_inputs')
    .upsert({
      assessment_id: assessmentId,
      company_size: inputs.clientContext?.companySize || null,
      current_marketing_maturity: inputs.clientContext?.currentMarketingMaturity || null,
      existing_tech_stack: inputs.clientContext?.existingTechStack || null,
      team_size: inputs.clientContext?.teamSize || null,
      annual_marketing_budget: inputs.clientContext?.annualMarketingBudget || null,
      preferred_engagement_models: inputs.commercialPreferences?.preferredEngagementModel || null,
      budget_range: inputs.commercialPreferences?.budgetRange || null,
      budget_flexibility: inputs.commercialPreferences?.budgetFlexibility || null,
      decision_timeline: inputs.commercialPreferences?.decisionTimeline || null,
      internal_resources: inputs.commercialPreferences?.internalResources || null,
      prefer_capex_or_opex: inputs.commercialPreferences?.preferCapexOrOpex || null,
      key_business_drivers: inputs.strategicContext?.keyBusinessDrivers || null,
      success_metrics: inputs.strategicContext?.successMetrics || null,
      known_constraints: inputs.strategicContext?.knownConstraints || null,
      competitive_pressures: inputs.strategicContext?.competitivePressures || null,
      executive_sponsor: inputs.strategicContext?.executiveSponsor || null,
      additional_context: inputs.strategicContext?.additionalContext || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'assessment_id' });

  if (error) {
    console.error('Error saving global inputs:', error);
  }
}

// Save a single capability assessment
async function saveCapabilityAssessment(
  assessmentId: string,
  capAssessment: CapabilityAssessment
): Promise<void> {
  if (!supabase) return;

  // Upsert capability assessment
  const { data, error } = await supabase
    .from('capability_assessments')
    .upsert({
      assessment_id: assessmentId,
      capability_id: capAssessment.capabilityId,
      relevance: capAssessment.relevance,
      notes: capAssessment.notes || null,
      assessed_at: capAssessment.assessedAt.toISOString(),
    }, { onConflict: 'assessment_id,capability_id' })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving capability assessment:', error);
    return;
  }

  // Save answers if present
  if (data && capAssessment.answers.length > 0) {
    // Delete existing answers first
    await supabase
      .from('assessment_answers')
      .delete()
      .eq('capability_assessment_id', data.id);

    // Insert new answers
    const answersToInsert = capAssessment.answers.map((answer) => ({
      capability_assessment_id: data.id,
      question_id: answer.questionId,
      value: answer.value,
    }));

    const { error: answersError } = await supabase
      .from('assessment_answers')
      .insert(answersToInsert);

    if (answersError) {
      console.error('Error saving assessment answers:', answersError);
    }
  }
}

// Save generated plan
async function saveGeneratedPlan(
  assessmentId: string,
  plan: GeneratedPlan
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('generated_plans')
    .upsert({
      assessment_id: assessmentId,
      plan_data: plan,
      generated_at: plan.generatedAt.toISOString(),
    }, { onConflict: 'assessment_id' });

  if (error) {
    console.error('Error saving generated plan:', error);
  }
}

// Load a full assessment by ID
export async function loadAssessment(
  assessmentId: string
): Promise<OpportunityAssessment | null> {
  if (!supabase) {
    console.warn('Database not configured');
    return null;
  }

  // Fetch main assessment
  const { data: assessmentData, error: assessmentError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (assessmentError || !assessmentData) {
    console.error('Error loading assessment:', assessmentError);
    return null;
  }

  // Fetch global inputs
  const { data: globalInputsData } = await supabase
    .from('assessment_global_inputs')
    .select('*')
    .eq('assessment_id', assessmentId)
    .single();

  // Fetch capability assessments with answers
  const { data: capAssessmentsData } = await supabase
    .from('capability_assessments')
    .select(`
      id,
      capability_id,
      relevance,
      notes,
      assessed_at,
      assessment_answers(question_id, value)
    `)
    .eq('assessment_id', assessmentId);

  // Fetch generated plan
  const { data: planData } = await supabase
    .from('generated_plans')
    .select('plan_data, generated_at')
    .eq('assessment_id', assessmentId)
    .single();

  // Build the assessment object
  const assessments: Record<string, CapabilityAssessment> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const cap of (capAssessmentsData || []) as any[]) {
    assessments[cap.capability_id] = {
      capabilityId: cap.capability_id,
      relevance: cap.relevance as CapabilityRelevance,
      notes: cap.notes || undefined,
      assessedAt: new Date(cap.assessed_at),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      answers: (cap.assessment_answers || []).map((a: any) => ({
        questionId: a.question_id,
        value: a.value as string | string[] | number,
      })),
    };
  }

  // Build global inputs if present
  let globalInputs: GlobalAssessmentInputs | undefined;
  if (globalInputsData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gi = globalInputsData as any;
    globalInputs = {
      clientContext: {
        industry: assessmentData.industry || undefined,
        companySize: gi.company_size,
        currentMarketingMaturity: gi.current_marketing_maturity,
        existingTechStack: gi.existing_tech_stack || undefined,
        teamSize: gi.team_size || undefined,
        annualMarketingBudget: gi.annual_marketing_budget || undefined,
      },
      commercialPreferences: {
        preferredEngagementModel: gi.preferred_engagement_models,
        budgetRange: gi.budget_range,
        budgetFlexibility: gi.budget_flexibility,
        decisionTimeline: gi.decision_timeline,
        internalResources: gi.internal_resources,
        preferCapexOrOpex: gi.prefer_capex_or_opex,
      },
      strategicContext: {
        keyBusinessDrivers: gi.key_business_drivers || undefined,
        successMetrics: gi.success_metrics || undefined,
        knownConstraints: gi.known_constraints || undefined,
        competitivePressures: gi.competitive_pressures || undefined,
        executiveSponsor: gi.executive_sponsor || undefined,
        additionalContext: gi.additional_context || undefined,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ad = assessmentData as any;
  return {
    id: ad.id,
    clientName: ad.client_name,
    opportunityName: ad.opportunity_name || undefined,
    industry: ad.industry || undefined,
    createdAt: new Date(ad.created_at),
    updatedAt: new Date(ad.updated_at),
    assessments,
    globalInputs,
    isComplete: ad.is_complete,
    generatedPlan: planData?.plan_data as GeneratedPlan | undefined,
  };
}

// Delete an assessment
export async function deleteAssessment(assessmentId: string): Promise<void> {
  if (!supabase) {
    console.warn('Database not configured');
    return;
  }

  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', assessmentId);

  if (error) {
    console.error('Error deleting assessment:', error);
    throw new Error(`Failed to delete assessment: ${error.message}`);
  }
}

// Quick save - just save the current capability assessment
export async function quickSaveCapability(
  assessmentId: string,
  capAssessment: CapabilityAssessment
): Promise<void> {
  if (!supabase) {
    console.warn('Database not configured - capability not saved');
    return;
  }

  await saveCapabilityAssessment(assessmentId, capAssessment);

  // Update assessment's updated_at
  await supabase
    .from('assessments')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', assessmentId);
}
