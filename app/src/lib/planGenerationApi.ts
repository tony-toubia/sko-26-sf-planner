/**
 * Client-side API for AI-powered plan generation
 * Supports both streaming and non-streaming modes
 */

import type {
  OpportunityAssessment,
  GlobalAssessmentInputs,
  TrackLevelAssessment,
} from '../types';

interface PlanGenerationRequest {
  clientName: string;
  industry?: string;
  marketingFoundation?: string;
  trackAssessments: TrackLevelAssessment[];
  globalInputs: GlobalAssessmentInputs;
  stream?: boolean;
}

interface PlanGenerationResponse {
  plan: string; // Markdown content
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

function buildRequest(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs
): PlanGenerationRequest {
  const trackAssessments: TrackLevelAssessment[] = assessment.trackAssessments
    ? Object.values(assessment.trackAssessments)
    : [];

  return {
    clientName: assessment.clientName,
    industry: assessment.industry,
    marketingFoundation: assessment.marketingFoundation,
    trackAssessments,
    globalInputs,
  };
}

function getApiUrl(): string {
  return import.meta.env.PROD
    ? '/api/generate-plan'
    : 'http://localhost:3001/api/generate-plan';
}

/**
 * Generates an AI-powered implementation plan (non-streaming)
 * @param assessment The current assessment state
 * @param globalInputs Additional context from the global inputs modal
 * @returns The generated plan as markdown
 */
export async function generateAIPlan(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs
): Promise<string> {
  const request = buildRequest(assessment, globalInputs);

  const response = await fetch(getApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  const result: PlanGenerationResponse = await response.json();
  return result.plan;
}

/**
 * Generates an AI-powered implementation plan with streaming
 * Calls onChunk with each text chunk as it arrives, building up the plan in real-time
 */
export async function generateAIPlanStreaming(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs,
  onChunk: (accumulated: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const request = buildRequest(assessment, globalInputs);
  request.stream = true;

  const response = await fetch(getApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  // Check if the response is actually streaming (SSE or chunked)
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
    // Handle Server-Sent Events or plain text streaming
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body for streaming');

    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Parse SSE format: lines starting with "data: "
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              accumulated += parsed.text;
              onChunk(accumulated);
            }
          } catch {
            // Plain text chunk, not JSON
            accumulated += data;
            onChunk(accumulated);
          }
        } else if (line.trim() && !line.startsWith(':')) {
          // Plain text streaming (not SSE)
          accumulated += line;
          onChunk(accumulated);
        }
      }
    }

    return accumulated;
  }

  // Fallback: non-streaming JSON response (server doesn't support streaming yet)
  const result: PlanGenerationResponse = await response.json();
  onChunk(result.plan);
  return result.plan;
}

/**
 * Check if AI plan generation is available
 */
export function isAIPlanGenerationAvailable(): boolean {
  // Always enable - in production the Vercel API handles it,
  // in development you can run `vercel dev` or deploy to test
  return true;
}
