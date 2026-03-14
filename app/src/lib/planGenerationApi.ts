/**
 * Client-side API for AI-powered plan generation
 */

import type {
  OpportunityAssessment,
  GlobalAssessmentInputs,
  TrackLevelAssessment,
  GenerationTrace,
} from '../types';

interface PlanGenerationRequest {
  clientName: string;
  industry?: string;
  marketingFoundation?: string;
  trackAssessments: TrackLevelAssessment[];
  globalInputs: GlobalAssessmentInputs;
}

interface PlanGenerationResponse {
  plan: string; // Markdown content
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  trace?: GenerationTrace;
}

export interface AIPlanResult {
  markdown: string;
  trace?: GenerationTrace;
}

/**
 * Generates an AI-powered implementation plan
 * @param assessment The current assessment state
 * @param globalInputs Additional context from the global inputs modal
 * @returns The generated plan markdown and generation trace
 */
export async function generateAIPlan(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs
): Promise<AIPlanResult> {
  // Convert track assessments to array format
  const trackAssessments: TrackLevelAssessment[] = assessment.trackAssessments
    ? Object.values(assessment.trackAssessments)
    : [];

  const request: PlanGenerationRequest = {
    clientName: assessment.clientName,
    industry: assessment.industry,
    marketingFoundation: assessment.marketingFoundation,
    trackAssessments,
    globalInputs,
  };

  // Determine the API URL based on environment
  const apiUrl = import.meta.env.PROD
    ? '/api/generate-plan'
    : 'http://localhost:3001/api/generate-plan'; // For local dev with separate API server

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  const result: PlanGenerationResponse = await response.json();
  return { markdown: result.plan, trace: result.trace };
}

/**
 * Check if AI plan generation is available
 */
export function isAIPlanGenerationAvailable(): boolean {
  // Always enable - in production the Vercel API handles it,
  // in development you can run `vercel dev` or deploy to test
  return true;
}
