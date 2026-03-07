import Anthropic from '@anthropic-ai/sdk';
import { fetchFormattedReferenceData } from './lib/referenceData.js';
import {
  INDUSTRY_TYPE_MAP,
  ROI_BENCHMARKS,
  TRACK_DESCRIPTIONS,
  buildIndustryContext,
} from './lib/industryMetadata.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  industry?: string;
  marketingFoundation?: string;
  currentMaturityLevel?: number;
}

// Build the system prompt — tries DB-backed reference data first, falls back to hardcoded
async function buildSystemPrompt(request: ChatRequest): Promise<string> {
  const industryId = request.industry ? (INDUSTRY_TYPE_MAP[request.industry] || request.industry) : undefined;

  // Try DB-backed reference data
  let dbRefData: Awaited<ReturnType<typeof fetchFormattedReferenceData>> = null;
  try {
    dbRefData = await fetchFormattedReferenceData({
      industry: industryId,
      maturityLevel: request.currentMaturityLevel,
    });
  } catch { /* fall back to hardcoded */ }

  const industryContext = dbRefData
    ? [dbRefData.kpis, dbRefData.journeys, dbRefData.roiBenchmarks, dbRefData.channelPriorities, dbRefData.tactics, dbRefData.offerings].filter(Boolean).join('\n\n')
    : buildIndustryContext(request.industry);

  const foundationNote = request.marketingFoundation
    ? `\n\nThe client is considering ${request.marketingFoundation === 'mc-advanced'
        ? 'MC Advanced with Data Cloud (Agentforce-ready)'
        : 'MC Engagement (standard)'} as their marketing foundation.`
    : '';

  const maturityNote = request.currentMaturityLevel
    ? `\n\nThe client's current overall maturity level is approximately ${request.currentMaturityLevel} out of 5.`
    : '';

  return `You are a Maturity Assessment Assistant for Salesforce Marketing Cloud implementations. You help Merkle consultants assess client maturity and plan capability roadmaps.

Your expertise includes:
- Salesforce Marketing Cloud (MC Engagement and MC Advanced with Data Cloud)
- Marketing automation maturity models
- Journey orchestration best practices
- Data integration and identity resolution
- Einstein AI features for marketing
- Cross-channel marketing orchestration

## Reference Knowledge

${TRACK_DESCRIPTIONS}

${dbRefData ? '' : ROI_BENCHMARKS}

${industryContext}${foundationNote}${maturityNote}

## Response Guidelines

1. Be specific and actionable in your recommendations
2. Reference relevant benchmarks and KPIs when discussing performance
3. Tailor advice to the industry context when provided
4. Explain the "why" behind recommendations, not just the "what"
5. When discussing journeys, mention expected outcomes and prerequisites
6. Keep responses concise but comprehensive
7. Use bullet points and formatting for clarity
8. If asked about capabilities, explain what they enable and when to implement them

Remember: You're helping consultants have better client conversations. Provide the kind of insights that demonstrate expertise and build client confidence.`;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as ChatRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new Anthropic({ apiKey });
    const systemPrompt = await buildSystemPrompt(body);

    // Convert messages to Anthropic format
    const anthropicMessages = body.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return new Response(JSON.stringify({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to generate response'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
