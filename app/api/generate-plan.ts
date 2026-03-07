import Anthropic from '@anthropic-ai/sdk';
import { fetchFormattedReferenceData, getCachedPlan, cachePlan } from './lib/referenceData.js';
import {
  getIndustryTypeId,
  ROI_BENCHMARKS,
  JOURNEY_GUIDANCE,
  TRACK_DESCRIPTIONS,
  buildIndustryContext,
} from './lib/industryMetadata.js';

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Types matching the app's data structures
interface TrackLevelAssessment {
  trackId: string;
  level: number;
  status: 'not-started' | 'in-progress' | 'complete';
  notes?: string;
  answers?: { questionId: string; value: string | string[] | number }[];
}

interface GlobalAssessmentInputs {
  clientContext: {
    industry?: string;
    industrySegment?: string;
    companySize?: string;
    currentMarketingMaturity?: number;
    existingTechStack?: string;
    teamSize?: string;
    annualMarketingBudget?: string;
  };
  commercialPreferences: {
    preferredEngagementModel?: string[];
    budgetRange?: string;
    budgetFlexibility?: string;
    decisionTimeline?: string;
    internalResources?: string;
    preferCapexOrOpex?: string;
  };
  strategicContext: {
    keyBusinessDrivers?: string[];
    successMetrics?: string[];
    knownConstraints?: string;
    competitivePressures?: string;
    executiveSponsor?: string;
    additionalContext?: string;
  };
}

interface PlanGenerationRequest {
  clientName: string;
  industry?: string;
  marketingFoundation?: string;
  trackAssessments: TrackLevelAssessment[];
  globalInputs: GlobalAssessmentInputs;
}

// Build the system prompt - can use DB-sourced data or fall back to hardcoded
function buildSystemPrompt(request: PlanGenerationRequest, dbRefData?: { kpis: string; tactics: string; roiBenchmarks: string; channelPriorities: string; journeys: string; offerings: string } | null): string {
  // If DB reference data is available, use it (chunked/targeted). Otherwise fall back to hardcoded.
  const industryContext = dbRefData
    ? [dbRefData.kpis, dbRefData.journeys, dbRefData.roiBenchmarks, dbRefData.channelPriorities, dbRefData.tactics, dbRefData.offerings].filter(Boolean).join('\n\n')
    : buildIndustryContext(request.industry);

  return `You are a senior Salesforce Marketing Cloud consultant at Merkle, creating a strategic implementation plan for ${request.clientName}.

Your role is to create a compelling, narrative-driven recommendation plan that:
1. Flows naturally as a strategic document, not a template
2. References specific benchmarks and outcomes from Merkle's methodology
3. Adapts completely to the client's assessed maturity and priorities
4. Skips empty phases - if they've completed Phase 1 work, start the plan at Phase 2
5. Provides specific, actionable recommendations grounded in data

IMPORTANT - Assumptions to AVOID:
- Do NOT assume the client has already implemented any platform. The "Marketing Foundation" field indicates their TARGET platform choice, not what they currently have.
- Only reference "current state" or "already implemented" if the maturity assessment explicitly shows completed capabilities.
- The assessment tracks show what level they are WORKING TOWARD, not what they have completed (unless status is "complete").
- When a track shows "not-started", assume they have no capabilities in that area yet.

## Reference Data

${ROI_BENCHMARKS}

${JOURNEY_GUIDANCE}

${TRACK_DESCRIPTIONS}

${industryContext}

## Writing Guidelines

1. **Be Specific**: Reference actual benchmarks from the industry data ("+35% email revenue", "3X ROAS", specific KPI targets) not vague promises
2. **Flow Naturally**: Write as a cohesive narrative, not disconnected sections
3. **Skip What's Done**: If they've completed capabilities, acknowledge and build from there
4. **Contextualize for Industry**: Use the industry-specific KPIs, journeys, benchmarks, and channel priorities provided in the reference data
5. **Be Practical**: Include concrete next steps and decision points
6. **Address Resources**: Factor their team size, budget, and timeline into recommendations
7. **Create Urgency Without Pressure**: Show opportunity cost of inaction using industry-specific ROI benchmarks
8. **Prioritize Journeys by Industry**: Reference the industry journey relevance (Critical, High, Medium) when recommending journey implementation order
9. **Include Channel Strategy**: Recommend channels based on industry channel priorities
10. **Reference Data Sources**: When discussing data integration, reference the industry-specific critical data sources

## Output Format

Generate a Markdown document with these sections (adapt as needed based on their situation):

1. **Executive Summary** - 2-3 paragraphs capturing the opportunity, referencing industry-specific benchmarks
2. **Current State Assessment** - What they've completed, what's in progress, what's next
3. **Strategic Recommendation** - The "why" behind the plan, connected to their business drivers and industry context
4. **Implementation Roadmap** - Phased approach WITH ONLY PHASES THAT HAVE WORK (skip empty phases!)
   - For each phase: Objectives, key capabilities, expected outcomes with industry-specific benchmarks, duration
5. **Journey Prioritization** - Which journeys to implement and why, with industry-specific expected ROI
   - Reference the industry journey relevance ratings (Critical, High, Medium)
   - Include specific benchmarks from the industry data
6. **Channel Strategy** - Recommended channel mix based on industry channel priorities
7. **Data Integration Requirements** - Key data sources to connect, based on industry priorities
8. **Investment Framework** - Based on their stated budget/preferences, not arbitrary numbers
9. **Risk Considerations** - Specific to their situation and industry
10. **Success Metrics** - Tied to their stated success criteria, using industry KPI benchmarks as targets
11. **Recommended Next Steps** - Concrete actions with owners

IMPORTANT:
- If Phase 1 foundation is complete, START THE ROADMAP AT PHASE 2
- Never show empty phases - renumber if needed so Phase 1 is always the first phase with work
- Investment estimates should align with their stated budget range and preferences
- Reference their specific track assessments and answers in your recommendations`;
}

// Build the user prompt with assessment data
function buildUserPrompt(request: PlanGenerationRequest): string {
  // Summarize track assessments
  const trackSummary = request.trackAssessments.map(ta => {
    const statusEmoji = ta.status === 'complete' ? '✓' : ta.status === 'in-progress' ? '◐' : '○';
    const notes = ta.notes ? ` - "${ta.notes}"` : '';
    return `  ${statusEmoji} ${ta.trackId} Level ${ta.level}: ${ta.status}${notes}`;
  }).join('\n');

  // Build context from global inputs
  const ctx = request.globalInputs.clientContext;
  const comm = request.globalInputs.commercialPreferences;
  const strat = request.globalInputs.strategicContext;

  let contextSummary = '';
  if (ctx.industry) contextSummary += `Industry: ${ctx.industry}`;
  if (ctx.industrySegment) contextSummary += ` (${ctx.industrySegment})`;
  if (ctx.companySize) contextSummary += `\nCompany Size: ${ctx.companySize}`;
  if (ctx.currentMarketingMaturity) contextSummary += `\nCurrent Maturity: Level ${ctx.currentMarketingMaturity}/5`;
  if (ctx.teamSize) contextSummary += `\nMarketing Team Size: ${ctx.teamSize}`;
  if (ctx.existingTechStack) contextSummary += `\nExisting Tech: ${ctx.existingTechStack}`;

  let commercialSummary = '';
  if (comm.budgetRange) commercialSummary += `Budget Range: ${comm.budgetRange}`;
  if (comm.preferredEngagementModel?.length) {
    commercialSummary += `\nPreferred Model: ${comm.preferredEngagementModel.join(', ')}`;
  }
  if (comm.internalResources) commercialSummary += `\nInternal Resources: ${comm.internalResources}`;
  if (comm.preferCapexOrOpex) commercialSummary += `\nPreference: ${comm.preferCapexOrOpex.toUpperCase()}`;
  if (comm.decisionTimeline) commercialSummary += `\nDecision Timeline: ${comm.decisionTimeline}`;

  let strategicSummary = '';
  if (strat.keyBusinessDrivers?.length) {
    strategicSummary += `Key Drivers:\n${strat.keyBusinessDrivers.map(d => `  - ${d}`).join('\n')}`;
  }
  if (strat.successMetrics?.length) {
    strategicSummary += `\n\nSuccess Metrics:\n${strat.successMetrics.map(m => `  - ${m}`).join('\n')}`;
  }
  if (strat.knownConstraints) strategicSummary += `\n\nKnown Constraints: ${strat.knownConstraints}`;
  if (strat.competitivePressures) strategicSummary += `\nCompetitive Pressures: ${strat.competitivePressures}`;
  if (strat.executiveSponsor) strategicSummary += `\nExecutive Sponsor: ${strat.executiveSponsor}`;
  if (strat.additionalContext) strategicSummary += `\nAdditional Context: ${strat.additionalContext}`;

  // Determine marketing foundation
  const foundationNote = request.marketingFoundation
    ? `Marketing Foundation: ${request.marketingFoundation === 'mc-advanced'
        ? 'MC Advanced with Data Cloud (Agentforce-ready) - This is the TARGET platform, not currently implemented'
        : 'MC Engagement (standard) - This is the TARGET platform, not currently implemented'}`
    : 'Marketing Foundation: Not specified';

  return `Generate a strategic implementation plan for ${request.clientName}.

## Client Context
${contextSummary || 'No additional context provided'}
${foundationNote}

## Commercial Preferences
${commercialSummary || 'No commercial preferences specified'}

## Strategic Context
${strategicSummary || 'No strategic context provided'}

## Maturity Assessment Results
${trackSummary || 'No track assessments completed'}

Please generate a comprehensive, narrative-driven implementation plan that:
1. Acknowledges their current state and builds from it
2. Only includes phases with actual work to be done
3. References specific benchmarks and expected outcomes
4. Aligns investment recommendations with their stated budget
5. Provides industry-specific guidance where applicable
6. Creates a compelling case for action with data-backed urgency`;
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: PlanGenerationRequest = req.body;
    const quality: 'standard' | 'enhanced' = req.body.quality || 'standard';

    // Validate required fields
    if (!request.clientName) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // ===== CACHING: Check for cached plan =====
    const normalizedRequest = JSON.stringify({
      clientName: request.clientName,
      industry: request.industry,
      marketingFoundation: request.marketingFoundation,
      trackAssessments: (request.trackAssessments || [])
        .map(ta => ({ trackId: ta.trackId, level: ta.level, status: ta.status }))
        .sort((a, b) => `${a.trackId}-${a.level}`.localeCompare(`${b.trackId}-${b.level}`)),
      globalInputs: request.globalInputs,
      quality,
    });
    const cacheKey = await sha256(normalizedRequest);

    try {
      const cached = await getCachedPlan(cacheKey);
      if (cached) {
        return res.status(200).json({
          plan: cached.plan,
          usage: cached.usage,
          cached: true,
        });
      }
    } catch (err) {
      console.error('[generate-plan] Cache lookup failed:', err);
    }

    // ===== CHUNKING: Fetch targeted reference data from DB =====
    const industryId = getIndustryTypeId(request.industry);
    const maturityLevel = request.trackAssessments?.length
      ? Math.round(request.trackAssessments.filter(ta => ta.status === 'complete').length / Math.max(request.trackAssessments.length, 1) * 3)
      : 1;

    let dbRefData: Awaited<ReturnType<typeof fetchFormattedReferenceData>> = null;
    try {
      dbRefData = await fetchFormattedReferenceData({
        industry: industryId || undefined,
        disciplines: ['messaging-personalization'], // TODO: pass from request when multi-discipline
        maturityLevel,
      });
    } catch (err) {
      console.error('[generate-plan] Reference data fetch failed, using hardcoded fallback:', err);
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = buildSystemPrompt(request, dbRefData);
    const userPrompt = buildUserPrompt(request);

    let planText: string;
    let totalUsage = { input_tokens: 0, output_tokens: 0 };

    if (quality === 'enhanced') {
      // ===== MULTI-PASS: Two-stage generation =====

      // Pass 1: Generate outline
      const outlineMessage = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: userPrompt }],
        system: `${systemPrompt}\n\nIMPORTANT: For this request, generate ONLY a structured outline (not the full plan). Include:\n1. Executive summary (2-3 bullet points)\n2. Phase structure with key capabilities per phase\n3. Top 3 journey recommendations\n4. Key investment ranges\n5. Critical risks\n\nKeep it concise - this outline will be expanded into a full plan.`,
      });

      const outlineContent = outlineMessage.content.find(block => block.type === 'text');
      if (!outlineContent || outlineContent.type !== 'text') throw new Error('No outline content');

      totalUsage.input_tokens += outlineMessage.usage.input_tokens;
      totalUsage.output_tokens += outlineMessage.usage.output_tokens;

      // Pass 2: Expand outline into full plan
      const fullMessage = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: outlineContent.text },
          { role: 'user', content: 'Now expand this outline into the full strategic implementation plan with specific benchmarks, detailed phase descriptions, journey prioritization with ROI data, channel strategy, investment framework, and concrete next steps. Write it as a cohesive narrative document.' },
        ],
        system: systemPrompt,
      });

      const fullContent = fullMessage.content.find(block => block.type === 'text');
      if (!fullContent || fullContent.type !== 'text') throw new Error('No full plan content');

      planText = fullContent.text;
      totalUsage.input_tokens += fullMessage.usage.input_tokens;
      totalUsage.output_tokens += fullMessage.usage.output_tokens;

    } else {
      // ===== STANDARD: Single-pass generation =====
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
      });

      const textContent = message.content.find(block => block.type === 'text');
      if (!textContent || textContent.type !== 'text') throw new Error('No text content in response');

      planText = textContent.text;
      totalUsage = message.usage;
    }

    // ===== CACHE the result =====
    await cachePlan(cacheKey, planText, totalUsage).catch(err =>
      console.error('Failed to cache plan:', err)
    );

    return res.status(200).json({
      plan: planText,
      usage: totalUsage,
      cached: false,
      quality,
    });

  } catch (error) {
    console.error('Plan generation error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate plan'
    });
  }
}
