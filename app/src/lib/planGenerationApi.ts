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
  disciplines?: string[];
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
    disciplines: assessment.disciplines || ['messaging-personalization'],
    trackAssessments,
    globalInputs,
  };

  // Determine the API URL based on environment
  const apiUrl = import.meta.env.PROD
    ? '/api/generate-plan'
    : 'http://localhost:3001/api/generate-plan'; // For local dev with separate API server

  // Retry with exponential backoff for transient errors (429, 529, 5xx)
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
      await new Promise((r) => setTimeout(r, delay));
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const result: PlanGenerationResponse = await response.json();
      return { markdown: result.plan, trace: result.trace };
    }

    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    lastError = new Error(error.error || `API error: ${response.status}`);

    // Only retry on transient errors
    if (response.status !== 429 && response.status !== 529 && response.status < 500) {
      throw lastError;
    }
  }

  throw lastError || new Error('API request failed after retries');
}

/**
 * Check if AI plan generation is available
 */
export function isAIPlanGenerationAvailable(): boolean {
  // Always enable - in production the Vercel API handles it,
  // in development you can run `vercel dev` or deploy to test
  return true;
}
