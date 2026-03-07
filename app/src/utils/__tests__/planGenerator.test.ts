import { describe, it, expect, beforeEach } from 'vitest';
import { generatePlan } from '../planGenerator';
import type {
  OpportunityAssessment,
  GlobalAssessmentInputs,
  GeneratedPlan,
} from '../../types';

// ---------------------------------------------------------------------------
// Helpers to build mock data
// ---------------------------------------------------------------------------

function createGlobalInputs(
  overrides?: Partial<GlobalAssessmentInputs>
): GlobalAssessmentInputs {
  return {
    clientContext: {
      industry: 'retail-cpg-qsr',
      companySize: 'enterprise',
      currentMarketingMaturity: 2,
      ...overrides?.clientContext,
    },
    commercialPreferences: {
      budgetRange: '250k-500k',
      decisionTimeline: 'this-quarter',
      internalResources: 'moderate',
      preferCapexOrOpex: 'capex',
      ...overrides?.commercialPreferences,
    },
    strategicContext: {
      keyBusinessDrivers: ['Enable personalization at scale'],
      successMetrics: ['Increase email engagement by 20%'],
      ...overrides?.strategicContext,
    },
  };
}

function createAssessment(
  overrides?: Partial<OpportunityAssessment>
): OpportunityAssessment {
  return {
    id: 'test-opp-1',
    clientName: 'Acme Corp',
    opportunityName: 'Digital Transformation',
    industry: 'retail-cpg-qsr',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    assessments: {},
    isComplete: false,
    ...overrides,
  };
}

/**
 * Helper that adds legacy capability assessments keyed by capabilityId.
 */
function withCapabilityAssessments(
  base: OpportunityAssessment,
  caps: { capabilityId: string; relevance: string }[]
): OpportunityAssessment {
  const assessments: OpportunityAssessment['assessments'] = {};
  for (const c of caps) {
    assessments[c.capabilityId] = {
      capabilityId: c.capabilityId,
      relevance: c.relevance as any,
      answers: [],
      assessedAt: new Date('2025-01-10'),
    };
  }
  return { ...base, assessments };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('generatePlan', () => {
  let globalInputs: GlobalAssessmentInputs;

  beforeEach(() => {
    globalInputs = createGlobalInputs();
  });

  // ---- 1. Valid plan structure ------------------------------------------
  it('returns a valid plan structure with all required fields', () => {
    const assessment = withCapabilityAssessments(createAssessment(), [
      { capabilityId: 'migrate-sfmc', relevance: 'immediately-relevant' },
    ]);

    const plan = generatePlan(assessment, globalInputs);

    // Top-level keys
    expect(plan.id).toBeDefined();
    expect(typeof plan.id).toBe('string');
    expect(plan.generatedAt).toBeInstanceOf(Date);

    // Executive summary
    expect(plan.executiveSummary).toBeDefined();
    expect(plan.executiveSummary.clientName).toBe('Acme Corp');
    expect(typeof plan.executiveSummary.overallRecommendation).toBe('string');
    expect(typeof plan.executiveSummary.strategicRationale).toBe('string');

    // Phases array
    expect(Array.isArray(plan.phases)).toBe(true);

    // Other required sections
    expect(Array.isArray(plan.quickWins)).toBe(true);
    expect(Array.isArray(plan.foundationRequirements)).toBe(true);
    expect(plan.commercialSummary).toBeDefined();
    expect(Array.isArray(plan.risks)).toBe(true);
    expect(Array.isArray(plan.successMetrics)).toBe(true);
    expect(Array.isArray(plan.nextSteps)).toBe(true);
  });

  // ---- 2. Empty assessments produce a valid (but minimal) plan ----------
  it('produces a valid but minimal plan for empty assessments', () => {
    const assessment = createAssessment(); // no assessments at all

    const plan = generatePlan(assessment, globalInputs);

    expect(plan.id).toBeDefined();
    expect(plan.executiveSummary.totalCapabilities).toBe(0);
    expect(plan.executiveSummary.immediateCapabilities).toBe(0);
    expect(plan.executiveSummary.nearFutureCapabilities).toBe(0);
    expect(plan.phases.length).toBe(0);
    expect(plan.quickWins.length).toBe(0);
  });

  // ---- 3. Phase grouping – capabilities route to correct phase names ----
  it('groups phase-1 capabilities into Foundation and phase-2 into Activation', () => {
    // migrate-sfmc is phase 1, enhance-planned-campaigns is phase 2
    const assessment = withCapabilityAssessments(createAssessment(), [
      { capabilityId: 'migrate-sfmc', relevance: 'immediately-relevant' },
      { capabilityId: 'enhance-planned-campaigns', relevance: 'immediately-relevant' },
    ]);

    const plan = generatePlan(assessment, globalInputs);

    const foundationPhase = plan.phases.find((p) => p.name === 'Foundation');
    const activationPhase = plan.phases.find((p) => p.name === 'Activation');

    expect(foundationPhase).toBeDefined();
    expect(
      foundationPhase!.capabilities.some((c) => c.capabilityId === 'migrate-sfmc')
    ).toBe(true);

    expect(activationPhase).toBeDefined();
    expect(
      activationPhase!.capabilities.some(
        (c) => c.capabilityId === 'enhance-planned-campaigns'
      )
    ).toBe(true);
  });

  // ---- 4. Executive summary reflects correct counts ---------------------
  it('executive summary reflects the correct capability counts', () => {
    const assessment = withCapabilityAssessments(createAssessment(), [
      { capabilityId: 'migrate-sfmc', relevance: 'immediately-relevant' },
      { capabilityId: 'baseline-subscriber-journeys', relevance: 'immediately-relevant' },
      { capabilityId: 'enhance-planned-campaigns', relevance: 'near-future' },
      { capabilityId: 'identity-resolution', relevance: 'complete' },
      { capabilityId: 'extend-data-integrations', relevance: 'in-progress' },
    ]);

    const plan = generatePlan(assessment, globalInputs);

    expect(plan.executiveSummary.immediateCapabilities).toBe(2);
    expect(plan.executiveSummary.nearFutureCapabilities).toBe(1);
    expect(plan.executiveSummary.totalCapabilities).toBe(3); // immediate + near-future
    expect(plan.executiveSummary.completeCapabilities).toBe(1);
    expect(plan.executiveSummary.inProgressCapabilities).toBe(1);
  });

  // ---- 5. Quick wins are identified for Einstein capabilities -----------
  it('identifies quick wins for Einstein capabilities', () => {
    const assessment = withCapabilityAssessments(createAssessment(), [
      { capabilityId: 'einstein-engagement-scoring', relevance: 'immediately-relevant' },
      { capabilityId: 'einstein-send-time-optimization', relevance: 'immediately-relevant' },
      { capabilityId: 'migrate-sfmc', relevance: 'immediately-relevant' },
    ]);

    const plan = generatePlan(assessment, globalInputs);

    expect(plan.quickWins.length).toBeGreaterThan(0);

    const einsteinQuickWins = plan.quickWins.filter((qw) =>
      qw.capabilityId.includes('einstein')
    );
    expect(einsteinQuickWins.length).toBeGreaterThan(0);

    // Each quick win should have required fields
    for (const qw of einsteinQuickWins) {
      expect(qw.capabilityId).toBeDefined();
      expect(qw.capabilityName).toBeDefined();
      expect(qw.description).toBeDefined();
      expect(qw.impact).toBeDefined();
    }
  });

  // ---- 6. Commercial summary includes phased investment -----------------
  it('commercial summary includes phased investment matching plan phases', () => {
    const assessment = withCapabilityAssessments(createAssessment(), [
      { capabilityId: 'migrate-sfmc', relevance: 'immediately-relevant' },
      { capabilityId: 'enhance-planned-campaigns', relevance: 'immediately-relevant' },
      { capabilityId: 'cross-channel-activation', relevance: 'near-future' },
    ]);

    const plan = generatePlan(assessment, globalInputs);

    expect(plan.commercialSummary).toBeDefined();
    expect(plan.commercialSummary.recommendedModel).toBeDefined();
    expect(typeof plan.commercialSummary.modelRationale).toBe('string');

    // Phased investment should exist and have one entry per phase
    expect(Array.isArray(plan.commercialSummary.phasedInvestment)).toBe(true);
    expect(plan.commercialSummary.phasedInvestment.length).toBe(plan.phases.length);

    for (const inv of plan.commercialSummary.phasedInvestment) {
      expect(inv.phase).toBeDefined();
      expect(inv.description).toBeDefined();
      expect(typeof inv.estimateRange).toBe('string');
    }

    // Should also have alternative models
    expect(
      Array.isArray(plan.commercialSummary.alternativeModels)
    ).toBe(true);
    expect(plan.commercialSummary.alternativeModels!.length).toBeGreaterThan(0);
  });

  // ---- 7. Near-future capabilities land in Transformation phase ---------
  it('places near-future capabilities into the Transformation phase', () => {
    const assessment = withCapabilityAssessments(createAssessment(), [
      { capabilityId: 'migrate-sfmc', relevance: 'immediately-relevant' },
      { capabilityId: 'clv-modeling', relevance: 'near-future' },
    ]);

    const plan = generatePlan(assessment, globalInputs);

    const transformPhase = plan.phases.find((p) => p.name === 'Transformation');
    expect(transformPhase).toBeDefined();
    expect(
      transformPhase!.capabilities.some((c) => c.capabilityId === 'clv-modeling')
    ).toBe(true);
  });

  // ---- 8. Risks always include generic integration risk -----------------
  it('always includes the generic data integration risk', () => {
    const assessment = createAssessment();
    const plan = generatePlan(assessment, globalInputs);

    const integrationRisk = plan.risks.find((r) =>
      r.risk.includes('Data integration complexity')
    );
    expect(integrationRisk).toBeDefined();
    expect(integrationRisk!.mitigation).toBeDefined();
  });
});
