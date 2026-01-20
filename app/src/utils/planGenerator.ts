import type {
  OpportunityAssessment,
  GlobalAssessmentInputs,
  GeneratedPlan,
  PlanPhase,
  PlannedCapability,
  RecommendedOffering,
  CapabilityRelevance,
  Capability,
} from '../types';
import { getCapabilityById } from '../data/capabilities';

/**
 * Generates a comprehensive recommendation plan from assessment data
 */
export function generatePlan(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs
): GeneratedPlan {
  const assessments = Object.values(assessment.assessments);

  // Categorize assessed capabilities
  // Complete = already implemented, can be used as foundation
  const completeCapabilities = assessments.filter((a) => a.relevance === 'complete');
  // In-progress = partially done, factor into sequencing
  const inProgressCapabilities = assessments.filter((a) => a.relevance === 'in-progress');
  // Immediate = ready to start, highest priority for recommendations
  const immediateCapabilities = assessments.filter((a) => a.relevance === 'immediately-relevant');
  // Near-future = planned for later phases
  const nearFutureCapabilities = assessments.filter((a) => a.relevance === 'near-future');
  // notReadyCapabilities could be used for future "not in scope" section
  // const notReadyCapabilities = assessments.filter((a) => a.relevance === 'not-ready');

  // Get full capability data for assessed items
  const getCapability = (id: string) => getCapabilityById(id);

  // Build dependency graph and determine sequencing
  // Pass complete and in-progress items so they're factored into foundation requirements
  const { phases, foundationRequirements } = buildPhasedPlan(
    immediateCapabilities.map((a) => ({ ...a, capability: getCapability(a.capabilityId)! })),
    nearFutureCapabilities.map((a) => ({ ...a, capability: getCapability(a.capabilityId)! })),
    completeCapabilities.map((a) => ({ ...a, capability: getCapability(a.capabilityId)! })),
    inProgressCapabilities.map((a) => ({ ...a, capability: getCapability(a.capabilityId)! })),
    globalInputs
  );

  // Identify quick wins
  const quickWins = identifyQuickWins(immediateCapabilities, globalInputs);

  // Generate commercial recommendation
  const commercialSummary = generateCommercialRecommendation(
    phases,
    globalInputs.commercialPreferences
  );

  // Identify risks
  const risks = identifyRisks(assessment, globalInputs);

  // Define success metrics
  const successMetrics = generateSuccessMetrics(
    immediateCapabilities,
    nearFutureCapabilities,
    globalInputs.strategicContext
  );

  // Generate next steps
  const nextSteps = generateNextSteps(phases, globalInputs);

  // Build executive summary
  const executiveSummary = {
    clientName: assessment.clientName,
    opportunityName: assessment.opportunityName,
    overallRecommendation: generateOverallRecommendation(
      immediateCapabilities.length,
      nearFutureCapabilities.length,
      completeCapabilities.length,
      inProgressCapabilities.length,
      globalInputs
    ),
    strategicRationale: generateStrategicRationale(assessment, globalInputs),
    totalCapabilities: immediateCapabilities.length + nearFutureCapabilities.length,
    immediateCapabilities: immediateCapabilities.length,
    nearFutureCapabilities: nearFutureCapabilities.length,
    completeCapabilities: completeCapabilities.length,
    inProgressCapabilities: inProgressCapabilities.length,
    estimatedTotalInvestment: estimateTotalInvestment(phases, globalInputs),
    recommendedTimeframe: calculateRecommendedTimeframe(phases),
  };

  return {
    id: crypto.randomUUID(),
    generatedAt: new Date(),
    executiveSummary,
    phases,
    quickWins,
    foundationRequirements,
    commercialSummary,
    risks,
    successMetrics,
    nextSteps,
  };
}

interface AssessmentWithCapability {
  capabilityId: string;
  relevance: CapabilityRelevance;
  answers: { questionId: string; value: string | string[] | number }[];
  notes?: string;
  assessedAt: Date;
  capability: Capability;
}

/**
 * Builds a phased implementation plan respecting dependencies
 */
function buildPhasedPlan(
  immediate: AssessmentWithCapability[],
  nearFuture: AssessmentWithCapability[],
  complete: AssessmentWithCapability[],
  inProgress: AssessmentWithCapability[],
  globalInputs: GlobalAssessmentInputs
): { phases: PlanPhase[]; foundationRequirements: GeneratedPlan['foundationRequirements'] } {
  const phases: PlanPhase[] = [];
  const foundationRequirements: GeneratedPlan['foundationRequirements'] = [];

  // Get IDs of complete capabilities (these are already done, no work needed)
  const completeCapIds = new Set(complete.map((a) => a.capabilityId));
  // Get IDs of in-progress capabilities (these are partially done)
  const inProgressCapIds = new Set(inProgress.map((a) => a.capabilityId));

  // Check if Data Cloud is needed (foundation for almost everything)
  const needsDataCloud = [...immediate, ...nearFuture].some(
    (a) => a.capability.dependencies.includes('migrate-sfmc') || a.capabilityId === 'migrate-sfmc'
  );

  // Data Cloud is available if it's complete, in-progress, or in immediate scope
  const hasDataCloud = immediate.some((a) => a.capabilityId === 'migrate-sfmc')
    || completeCapIds.has('migrate-sfmc')
    || inProgressCapIds.has('migrate-sfmc');

  if (needsDataCloud) {
    // Determine status: met if complete, partial if in-progress, not-met otherwise
    let dataCloudStatus: 'met' | 'partial' | 'not-met' = 'not-met';
    if (completeCapIds.has('migrate-sfmc')) {
      dataCloudStatus = 'met';
    } else if (inProgressCapIds.has('migrate-sfmc') || immediate.some((a) => a.capabilityId === 'migrate-sfmc')) {
      dataCloudStatus = 'partial';
    }

    foundationRequirements.push({
      requirement: 'Data Cloud & MC Advanced activated',
      relatedCapabilities: ['migrate-sfmc'],
      status: dataCloudStatus,
    });
  }

  // Group capabilities by their natural phase in the matrix
  const phase1Caps = immediate.filter((a) => a.capability.phase === 1);
  const phase2Caps = immediate.filter((a) => a.capability.phase === 2);
  const phase3Caps = immediate.filter((a) => a.capability.phase === 3);
  const phase4Caps = immediate.filter((a) => a.capability.phase === 4);

  // Build Phase 1: Foundation
  if (phase1Caps.length > 0 || hasDataCloud) {
    const plannedCaps = phase1Caps.map((a) =>
      createPlannedCapability(a, 'critical', globalInputs)
    );

    phases.push({
      phaseNumber: 1,
      name: 'Foundation',
      description: 'Establish the data foundation and platform infrastructure required for all downstream capabilities.',
      duration: calculatePhaseDuration(plannedCaps, globalInputs),
      capabilities: plannedCaps,
      keyMilestones: [
        'Data Cloud activated and configured',
        'Core data streams connected',
        'MC Advanced features enabled',
        'Initial segments created',
      ],
      dependencies: ['Salesforce licensing in place', 'Data source access confirmed'],
    });
  }

  // Build Phase 2: Activation
  if (phase2Caps.length > 0) {
    const plannedCaps = phase2Caps.map((a) =>
      createPlannedCapability(a, 'high', globalInputs)
    );

    phases.push({
      phaseNumber: 2,
      name: 'Activation',
      description: 'Activate key marketing capabilities leveraging the established data foundation.',
      duration: calculatePhaseDuration(plannedCaps, globalInputs),
      capabilities: plannedCaps,
      keyMilestones: [
        'First Flow journeys live',
        'Campaign framework established',
        'Initial automation in production',
      ],
      dependencies: phases.length > 0 ? ['Phase 1 Foundation complete'] : [],
    });
  }

  // Build Phase 3: Optimization
  if (phase3Caps.length > 0) {
    const plannedCaps = phase3Caps.map((a) =>
      createPlannedCapability(a, 'medium', globalInputs)
    );

    phases.push({
      phaseNumber: 3,
      name: 'Optimization',
      description: 'Optimize and expand capabilities to meet contemporary consumer expectations.',
      duration: calculatePhaseDuration(plannedCaps, globalInputs),
      capabilities: plannedCaps,
      keyMilestones: [
        'Customer lifecycle journeys operational',
        'Cross-channel activation enabled',
        'Analytics and insights framework live',
      ],
      dependencies: ['Phase 2 capabilities operational'],
    });
  }

  // Build Phase 4: Transformation (Near-future + Phase 4 immediate)
  const transformCaps = [...phase4Caps, ...nearFuture];
  if (transformCaps.length > 0) {
    const plannedCaps = transformCaps.map((a) =>
      createPlannedCapability(
        a,
        a.relevance === 'immediately-relevant' ? 'high' : 'medium',
        globalInputs
      )
    );

    phases.push({
      phaseNumber: 4,
      name: 'Transformation',
      description: 'Advanced capabilities for competitive differentiation and future-proofing.',
      duration: calculatePhaseDuration(plannedCaps, globalInputs),
      capabilities: plannedCaps,
      keyMilestones: [
        'Predictive models deployed',
        'Advanced personalization active',
        'Full identity resolution operational',
      ],
      dependencies: ['Core platform maturity achieved'],
    });
  }

  return { phases, foundationRequirements };
}

/**
 * Creates a planned capability entry with recommendations
 */
function createPlannedCapability(
  assessment: AssessmentWithCapability,
  priority: PlannedCapability['priority'],
  globalInputs: GlobalAssessmentInputs
): PlannedCapability {
  const { capability, answers, relevance } = assessment;

  // Generate client input summary from answers
  const clientInputSummary = summarizeClientInputs(answers, capability);

  // Recommend offerings based on capability and preferences
  const recommendedOfferings = recommendOfferings(capability, globalInputs);

  // Generate sequencing notes
  const sequencingNotes = generateSequencingNotes(capability, globalInputs);

  return {
    capabilityId: capability.id,
    capabilityName: capability.name,
    priority,
    relevance,
    rationale: generateCapabilityRationale(capability, globalInputs, answers),
    recommendedOfferings,
    clientInputSummary,
    sequencingNotes,
  };
}

/**
 * Summarizes client inputs from assessment answers
 */
function summarizeClientInputs(
  answers: { questionId: string; value: string | string[] | number }[],
  capability: Capability
): string {
  if (answers.length === 0) return '';

  const summaries: string[] = [];

  answers.forEach((answer) => {
    const question = capability.assessmentQuestions?.find((q) => q.id === answer.questionId);
    if (!question) return;

    if (Array.isArray(answer.value)) {
      summaries.push(`${question.question.replace('?', '')}: ${answer.value.join(', ')}`);
    } else {
      summaries.push(`${question.question.replace('?', '')}: ${answer.value}`);
    }
  });

  return summaries.join('. ');
}

/**
 * Recommends offerings based on capability and preferences
 */
function recommendOfferings(
  capability: Capability,
  globalInputs: GlobalAssessmentInputs
): RecommendedOffering[] {
  const offerings: RecommendedOffering[] = [];
  const prefs = globalInputs.commercialPreferences;

  // If capability has specific offerings, recommend based on preferences
  if (capability.merkleOfferings && capability.merkleOfferings.length > 0) {
    // Determine sizing based on company size and budget
    let recommendedSizing: 'S' | 'M' | 'L' = 'M';
    if (prefs.budgetRange === 'under-100k' || prefs.budgetRange === '100k-250k') {
      recommendedSizing = 'S';
    } else if (prefs.budgetRange === '500k-1m' || prefs.budgetRange === 'over-1m') {
      recommendedSizing = 'L';
    }

    // Find best matching offering
    const fixedBidOfferings = capability.merkleOfferings.filter((o) => o.type === 'fixed-bid');
    const matchingOffering = fixedBidOfferings.find((o) => o.sizing === recommendedSizing)
      || fixedBidOfferings[0];

    if (matchingOffering) {
      offerings.push({
        offeringName: matchingOffering.name,
        offeringType: matchingOffering.type,
        sizing: matchingOffering.sizing,
        rationale: `Recommended based on ${globalInputs.clientContext.companySize || 'client'} profile and ${prefs.budgetRange || 'stated'} budget range.`,
        estimateRange: estimateOfferingRange(matchingOffering),
      });
    }

    // Add ongoing support if preferred
    if (prefs.preferredEngagementModel?.includes('retainer') || prefs.internalResources === 'limited') {
      const retainerOffering = capability.merkleOfferings.find((o) => o.type === 'retainer');
      if (retainerOffering) {
        offerings.push({
          offeringName: retainerOffering.name,
          offeringType: 'retainer',
          rationale: 'Ongoing support recommended given resource constraints or preference for managed services.',
        });
      }
    }

    // Add OSP option if OPEX preferred
    if (prefs.preferCapexOrOpex === 'opex') {
      const ospOffering = capability.merkleOfferings.find((o) => o.type === 'osp');
      if (ospOffering) {
        offerings.push({
          offeringName: ospOffering.name,
          offeringType: 'osp',
          rationale: 'OPEX model available for clients preferring operational expenditure approach.',
        });
      }
    }
  }

  // Fallback to generic recommendation if no specific offerings
  if (offerings.length === 0) {
    offerings.push({
      offeringName: `${capability.shortName} Implementation`,
      offeringType: 'fixed-bid',
      rationale: 'Custom scoping recommended based on specific requirements.',
    });
  }

  return offerings;
}

/**
 * Estimates offering price range based on sizing
 */
function estimateOfferingRange(offering: { sizing?: 'S' | 'M' | 'L' | 'custom' }): string {
  switch (offering.sizing) {
    case 'S':
      return '$50K - $100K';
    case 'M':
      return '$100K - $250K';
    case 'L':
      return '$250K - $500K+';
    default:
      return 'Custom scoping required';
  }
}

/**
 * Generates sequencing notes for a capability
 */
function generateSequencingNotes(capability: Capability, _globalInputs: GlobalAssessmentInputs): string {
  const notes: string[] = [];

  if (capability.dependencies.length > 0) {
    const depNames = capability.dependencies
      .map((d) => getCapabilityById(d)?.shortName || d)
      .join(', ');
    notes.push(`Requires: ${depNames}`);
  }

  if (capability.phase === 1) {
    notes.push('Foundation capability - should be prioritized early.');
  }

  if (capability.id === 'migrate-sfmc') {
    notes.push('Critical path - most other capabilities depend on this foundation.');
  }

  return notes.join(' ');
}

/**
 * Generates rationale for including a capability
 */
function generateCapabilityRationale(
  capability: Capability,
  globalInputs: GlobalAssessmentInputs,
  _answers: { questionId: string; value: string | string[] | number }[]
): string {
  const drivers = globalInputs.strategicContext.keyBusinessDrivers || [];

  // Map capability benefits to stated business drivers
  const relevantOutcomes = capability.clientValue.businessOutcomes.slice(0, 2).join('; ');

  let rationale = `${capability.clientValue.why.split('.')[0]}.`;

  // Add driver alignment if applicable
  if (drivers.includes('Enable personalization at scale') && capability.tags.includes('personalization')) {
    rationale += ' Directly supports personalization at scale initiative.';
  }
  if (drivers.includes('Prepare for AI/Agentforce') && capability.tags.includes('agentforce')) {
    rationale += ' Critical for Agentforce readiness.';
  }

  // Add outcome preview
  rationale += ` Expected outcomes: ${relevantOutcomes}.`;

  return rationale;
}

/**
 * Calculates phase duration based on capabilities
 */
function calculatePhaseDuration(
  capabilities: PlannedCapability[],
  _globalInputs: GlobalAssessmentInputs
): string {
  const count = capabilities.length;
  if (count === 0) return 'N/A';
  if (count <= 2) return '4-8 weeks';
  if (count <= 4) return '8-12 weeks';
  return '12-16 weeks';
}

/**
 * Identifies quick wins from immediate capabilities
 */
function identifyQuickWins(
  immediate: { capabilityId: string; relevance: CapabilityRelevance }[],
  _globalInputs: GlobalAssessmentInputs
): GeneratedPlan['quickWins'] {
  const quickWins: GeneratedPlan['quickWins'] = [];

  immediate.forEach((a) => {
    const cap = getCapabilityById(a.capabilityId);
    if (!cap) return;

    // Einstein features are often quick wins
    if (cap.id.includes('einstein')) {
      quickWins.push({
        capabilityId: cap.id,
        capabilityName: cap.shortName,
        description: `Enable ${cap.shortName} - typically a configuration-driven enhancement.`,
        impact: cap.clientValue.businessOutcomes[0] || 'Improved engagement metrics',
      });
    }

    // Campaign enhancement can be quick
    if (cap.id === 'enhance-planned-campaigns' && cap.phase === 2) {
      quickWins.push({
        capabilityId: cap.id,
        capabilityName: cap.shortName,
        description: 'Transform existing batch campaigns into multi-touch Flows.',
        impact: '+35% email-attributed revenue potential',
      });
    }
  });

  return quickWins.slice(0, 3); // Return top 3 quick wins
}

/**
 * Generates commercial recommendation
 */
function generateCommercialRecommendation(
  phases: PlanPhase[],
  prefs: GlobalAssessmentInputs['commercialPreferences']
): GeneratedPlan['commercialSummary'] {
  // Determine recommended model based on preferences
  let recommendedModel = 'Phased Fixed-Bid Implementation';
  let modelRationale = 'Defined scope and predictable investment align with project-based approach.';

  if (prefs.internalResources === 'limited' || prefs.internalResources === 'prefer-outsource') {
    recommendedModel = 'Managed Services + Fixed-Bid Foundation';
    modelRationale = 'Given limited internal resources, a managed services model provides ongoing expertise while fixed-bid covers initial implementation.';
  }

  if (prefs.preferredEngagementModel?.includes('retainer')) {
    recommendedModel = 'Retainer-Based Partnership';
    modelRationale = 'Retainer model provides flexibility and ongoing strategic support aligned with stated preferences.';
  }

  if (prefs.preferCapexOrOpex === 'opex') {
    recommendedModel = 'OPEX/OSP Model';
    modelRationale = 'Operational expenditure model bundles licensing and services for predictable monthly costs.';
  }

  // Generate phased investment
  const phasedInvestment = phases.map((phase) => ({
    phase: phase.phaseNumber,
    description: phase.name,
    estimateRange: estimatePhaseInvestment(phase, prefs),
  }));

  // Alternative models
  const alternativeModels: GeneratedPlan['commercialSummary']['alternativeModels'] = [
    {
      model: 'Staff Augmentation',
      description: 'Embed Merkle specialists with client team',
      tradeoffs: 'Lower cost per hour but requires internal management capacity',
    },
    {
      model: 'Strategic Advisory + Execution Partner',
      description: 'Merkle provides strategy, client executes with guidance',
      tradeoffs: 'Lower total cost but longer timeline and higher internal effort',
    },
  ];

  return {
    recommendedModel,
    modelRationale,
    phasedInvestment,
    alternativeModels,
  };
}

/**
 * Estimates phase investment based on capabilities
 */
function estimatePhaseInvestment(
  phase: PlanPhase,
  prefs: GlobalAssessmentInputs['commercialPreferences']
): string {
  const capCount = phase.capabilities.length;
  const baseMultiplier = prefs.budgetRange === 'over-1m' ? 1.5 : 1;

  if (phase.phaseNumber === 1) {
    // Foundation typically most expensive
    return capCount <= 2 ? '$75K - $150K' : '$150K - $300K';
  }

  const perCapCost = 50000 * baseMultiplier;
  const low = Math.round((capCount * perCapCost * 0.7) / 1000) * 1000;
  const high = Math.round((capCount * perCapCost * 1.3) / 1000) * 1000;

  return `$${(low / 1000)}K - $${(high / 1000)}K`;
}

/**
 * Identifies risks from assessment
 */
function identifyRisks(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs
): GeneratedPlan['risks'] {
  const risks: GeneratedPlan['risks'] = [];

  // Check for Data Cloud dependency
  const hasDataCloud = Object.values(assessment.assessments).some(
    (a) => a.capabilityId === 'migrate-sfmc' && a.relevance === 'immediately-relevant'
  );

  const needsDataCloud = Object.values(assessment.assessments).some((a) => {
    const cap = getCapabilityById(a.capabilityId);
    return cap?.dependencies.includes('migrate-sfmc');
  });

  if (needsDataCloud && !hasDataCloud) {
    risks.push({
      risk: 'Data Cloud foundation not included in immediate scope',
      likelihood: 'high',
      impact: 'high',
      mitigation: 'Add Data Cloud activation to Phase 1 or ensure client has existing foundation.',
    });
  }

  // Resource constraints
  if (globalInputs.commercialPreferences.internalResources === 'limited') {
    risks.push({
      risk: 'Limited internal resources may slow adoption and optimization',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Include managed services component for ongoing support and knowledge transfer.',
    });
  }

  // Timeline pressure
  if (globalInputs.commercialPreferences.decisionTimeline === 'immediate') {
    risks.push({
      risk: 'Aggressive timeline may impact quality and change management',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Prioritize MVP approach with iterative enhancements; ensure executive alignment.',
    });
  }

  // Known constraints
  if (globalInputs.strategicContext.knownConstraints) {
    risks.push({
      risk: `Client constraint: ${globalInputs.strategicContext.knownConstraints.slice(0, 100)}`,
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Factor constraints into project planning and milestone sequencing.',
    });
  }

  // Add generic integration risk
  risks.push({
    risk: 'Data integration complexity may exceed initial estimates',
    likelihood: 'medium',
    impact: 'medium',
    mitigation: 'Include discovery phase to validate data sources and integration approach.',
  });

  return risks;
}

/**
 * Generates success metrics
 */
function generateSuccessMetrics(
  immediate: { capabilityId: string; relevance: CapabilityRelevance }[],
  nearFuture: { capabilityId: string; relevance: CapabilityRelevance }[],
  strategicContext: GlobalAssessmentInputs['strategicContext']
): GeneratedPlan['successMetrics'] {
  const metrics: GeneratedPlan['successMetrics'] = [];

  // Add client-defined metrics
  if (strategicContext.successMetrics && strategicContext.successMetrics.length > 0) {
    strategicContext.successMetrics.forEach((metric) => {
      metrics.push({
        metric,
        target: 'As defined by client',
        timeframe: '12 months',
      });
    });
  }

  // Add capability-specific KPIs
  [...immediate, ...nearFuture].slice(0, 3).forEach((a) => {
    const cap = getCapabilityById(a.capabilityId);
    if (cap && cap.clientValue.kpis.length > 0) {
      metrics.push({
        metric: cap.clientValue.kpis[0],
        target: 'Benchmark + 20% improvement',
        timeframe: 'Post-implementation + 90 days',
      });
    }
  });

  // Add standard metrics
  metrics.push({
    metric: 'Platform adoption rate',
    baseline: '0%',
    target: '80% of target users active',
    timeframe: '90 days post-launch',
  });

  return metrics.slice(0, 6); // Return top 6 metrics
}

/**
 * Generates next steps
 */
function generateNextSteps(
  phases: PlanPhase[],
  globalInputs: GlobalAssessmentInputs
): GeneratedPlan['nextSteps'] {
  const steps: GeneratedPlan['nextSteps'] = [];

  // Standard next steps
  steps.push({
    step: 'Review and validate recommendation plan with stakeholders',
    owner: 'joint',
    timeline: 'Within 1 week',
  });

  steps.push({
    step: 'Confirm Salesforce licensing and procurement path',
    owner: 'client',
    timeline: 'Within 2 weeks',
  });

  if (phases.length > 0) {
    steps.push({
      step: `Scope and estimate Phase 1 (${phases[0].name}) in detail`,
      owner: 'merkle',
      timeline: 'Within 2 weeks',
    });
  }

  steps.push({
    step: 'Conduct technical discovery and data source assessment',
    owner: 'joint',
    timeline: 'Within 3 weeks',
  });

  if (globalInputs.strategicContext.executiveSponsor) {
    steps.push({
      step: `Schedule executive alignment session with ${globalInputs.strategicContext.executiveSponsor}`,
      owner: 'joint',
      timeline: 'Within 2 weeks',
    });
  }

  steps.push({
    step: 'Finalize commercial terms and SOW',
    owner: 'joint',
    timeline: 'Within 4 weeks',
  });

  return steps;
}

/**
 * Generates overall recommendation summary
 */
function generateOverallRecommendation(
  immediateCount: number,
  nearFutureCount: number,
  completeCount: number,
  inProgressCount: number,
  globalInputs: GlobalAssessmentInputs
): string {
  const total = immediateCount + nearFutureCount;

  // If nothing to implement (all done or not relevant)
  if (total === 0) {
    if (completeCount > 0 || inProgressCount > 0) {
      const existingText = completeCount > 0 ? `${completeCount} capabilities already implemented` : '';
      const progressText = inProgressCount > 0 ? `${inProgressCount} in progress` : '';
      const combinedText = [existingText, progressText].filter(Boolean).join(' and ');
      return `Strong existing foundation with ${combinedText}. Consider optimization and advanced use cases as next steps.`;
    }
    return 'No capabilities marked as relevant. Consider re-evaluating assessment or scheduling discovery session.';
  }

  const drivers = globalInputs.strategicContext.keyBusinessDrivers || [];
  const driverText = drivers.length > 0 ? `aligned with ${drivers[0]}` : 'supporting marketing transformation';

  // Build foundation context if they have existing capabilities
  let foundationContext = '';
  if (completeCount > 0) {
    foundationContext = ` Building on ${completeCount} existing capabilities,`;
  }
  if (inProgressCount > 0) {
    foundationContext += foundationContext
      ? ` with ${inProgressCount} in progress,`
      : ` With ${inProgressCount} capabilities already in progress,`;
  }

  if (immediateCount >= 5) {
    return `${foundationContext} comprehensive transformation program recommended with ${immediateCount} immediate priorities ${driverText}. Phased approach will de-risk delivery while accelerating time-to-value.`.trim();
  }

  if (immediateCount >= 3) {
    return `${foundationContext} focused implementation program covering ${immediateCount} core capabilities ${driverText}. Foundation-first approach ensures sustainable success.`.trim();
  }

  return `${foundationContext} targeted initiative addressing ${immediateCount} key capabilities ${driverText}. Quick wins available to demonstrate value while building toward full vision.`.trim();
}

/**
 * Generates strategic rationale
 */
function generateStrategicRationale(
  assessment: OpportunityAssessment,
  globalInputs: GlobalAssessmentInputs
): string {
  const drivers = globalInputs.strategicContext.keyBusinessDrivers || [];
  const constraints = globalInputs.strategicContext.knownConstraints;

  let rationale = `Based on the assessment of ${assessment.clientName}`;

  if (globalInputs.clientContext.industry) {
    rationale += ` in the ${globalInputs.clientContext.industry} industry`;
  }

  rationale += ', this recommendation prioritizes capabilities that deliver measurable business impact';

  if (drivers.length > 0) {
    rationale += ` while directly supporting stated priorities: ${drivers.slice(0, 2).join(' and ')}`;
  }

  rationale += '.';

  if (constraints) {
    rationale += ` The approach accounts for known constraints including ${constraints.slice(0, 100)}.`;
  }

  return rationale;
}

/**
 * Estimates total investment
 */
function estimateTotalInvestment(
  phases: PlanPhase[],
  globalInputs: GlobalAssessmentInputs
): string {
  const budget = globalInputs.commercialPreferences.budgetRange;

  // Rough estimation based on phases and capabilities
  const totalCaps = phases.reduce((sum, p) => sum + p.capabilities.length, 0);

  if (budget === 'under-100k') return '$75K - $100K';
  if (budget === '100k-250k') return '$150K - $250K';
  if (budget === '250k-500k') return '$300K - $500K';
  if (budget === '500k-1m') return '$500K - $800K';
  if (budget === 'over-1m') return '$800K - $1.5M+';

  // Default based on capability count
  if (totalCaps <= 3) return '$100K - $200K';
  if (totalCaps <= 6) return '$200K - $400K';
  return '$400K - $750K';
}

/**
 * Calculates recommended timeframe
 */
function calculateRecommendedTimeframe(phases: PlanPhase[]): string {
  if (phases.length === 0) return 'TBD';
  if (phases.length === 1) return '3-4 months';
  if (phases.length === 2) return '6-9 months';
  if (phases.length === 3) return '9-12 months';
  return '12-18 months';
}
