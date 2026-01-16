// Maturity Levels - 0 to 5 scale
export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface MaturityStage {
  level: MaturityLevel;
  name: string;
  shortName: string;
  description: string;
  color: string;
}

// Disciplines/Clouds that can have maturity matrices
export type DisciplineType =
  | 'messaging-personalization'
  | 'loyalty'
  | 'b2b'
  | 'commerce'
  | 'service'
  | 'data-cloud';

export interface Discipline {
  id: DisciplineType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  salesforceCloud: string;
}

// Industry verticals - affects capability relevance and questions
export type IndustryType =
  | 'retail-cpg'
  | 'qsr-restaurants'
  | 'financial-services'
  | 'healthcare-life-sciences'
  | 'manufacturing'
  | 'travel-hospitality'
  | 'media-entertainment'
  | 'technology';

export interface Industry {
  id: IndustryType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  // Industry-specific priorities and context
  typicalPriorities: string[];
  commonChallenges: string[];
  regulatoryConsiderations?: string[];
}

// Journey classification (Iceberg concept)
// Above the Line = Customer Data ACTIVATION (visible marketing tactics)
// Below the Line = Customer Data MANAGEMENT (sophisticated data integration)
export type JourneyType = 'above-the-line' | 'below-the-line';

export interface JourneyCategory {
  type: JourneyType;
  name: string;
  description: string;
  examples: string[];
}

// Lifecycle stages for customer journeys
export type LifecycleStage =
  | 'awareness'
  | 'consideration'
  | 'purchase'
  | 'post-purchase'
  | 'retention'
  | 'loyalty';

// Implementation phases
export type Phase = 1 | 2 | 3 | 4;

export interface PhaseInfo {
  phase: Phase;
  name: string;
  description: string;
  color: string;
}

// Capability status in client assessment
export type CapabilityStatus =
  | 'not-started'
  | 'in-progress'
  | 'implemented'
  | 'optimizing';

// Merkle offering types for commercial conversations
export type MerkleOfferingType =
  | 'fixed-bid'
  | 'retainer'
  | 'staff-aug'
  | 'strategic-advisory'
  | 'managed-services'
  | 'osp'; // On-demand Service Provider (CAPEX vs OPEX models)

export interface MerkleOffering {
  type: MerkleOfferingType;
  name: string;
  description: string;
  sizing?: 'S' | 'M' | 'L' | 'custom';
}

// Reference material
export interface ReferenceMaterial {
  title: string;
  type: 'document' | 'video' | 'case-study' | 'playbook';
  url?: string;
  description: string;
  source: 'merkle-b2b' | 'merkle-modern-crm' | 'salesforce' | 'internal';
}

// Capability Card - main building block of the matrix
export interface Capability {
  id: string;
  name: string;
  shortName: string;
  description: string;

  // Positioning
  discipline: DisciplineType;
  maturityLevel: MaturityLevel;
  phase: Phase;
  journeyType: JourneyType;

  // Business value
  clientValue: {
    why: string;
    howItAdvancesMaturity: string;
    businessOutcomes: string[];
    kpis: string[];
  };

  // What this capability unlocks (Salesforce platform capabilities/features)
  keyCapabilities: string[];

  // Implementation details
  prerequisites: string[];
  dependencies: string[];

  // Merkle services for delivery
  merkleServices: string[];

  // Commercial offerings for sales conversations
  merkleOfferings: MerkleOffering[];

  // Reference materials
  references: ReferenceMaterial[];

  // Tags for search/filter
  tags: string[];

  // Icon for display
  icon?: string;

  // Grid position for matrix display (row, col) - 0-indexed
  gridPosition?: { row: number; col: number };

  // Assessment questions for this capability
  assessmentQuestions?: AssessmentQuestion[];
}

// Client assessment note
export interface ClientNote {
  id: string;
  timestamp: Date;
  content: string;
  author?: string;
  relatedCapabilities?: string[];
  source?: 'meeting' | 'discovery' | 'assessment' | 'chat';
}

// Client maturity assessment
export interface ClientAssessment {
  id: string;
  clientName: string;
  industry: string;
  createdAt: Date;
  updatedAt: Date;

  // Current state
  overallMaturityLevel: MaturityLevel;
  capabilityStatuses: Record<string, CapabilityStatus>;

  // Notes and context
  notes: ClientNote[];

  // Recommended path
  recommendedCapabilities: string[];
  priorityOrder: string[];
}

// Chat message for AI assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  relatedCapabilities?: string[];
}

// Filter state for matrix view
export interface MatrixFilters {
  discipline: DisciplineType | 'all';
  phase: Phase | 'all';
  journeyType: JourneyType | 'all';
  lifecycleStage: LifecycleStage | 'all';
  searchQuery: string;
}

// Assessment relevance for capability evaluation
export type CapabilityRelevance = 'immediately-relevant' | 'near-future' | 'not-ready' | 'not-assessed';

// Assessment question for a capability
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'text' | 'scale';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

// Response to an assessment question
export interface AssessmentAnswer {
  questionId: string;
  value: string | string[] | number;
}

// Capability assessment entry
export interface CapabilityAssessment {
  capabilityId: string;
  relevance: CapabilityRelevance;
  answers: AssessmentAnswer[];
  notes?: string;
  assessedAt: Date;
}

// Full opportunity assessment state
export interface OpportunityAssessment {
  id: string;
  clientName: string;
  opportunityName?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
  assessments: Record<string, CapabilityAssessment>;
  globalInputs?: GlobalAssessmentInputs;
  isComplete: boolean;
  generatedPlan?: GeneratedPlan;
}

// Global assessment inputs - collected before/after capability assessments
export interface GlobalAssessmentInputs {
  // Client context
  clientContext: {
    industry?: string;
    companySize?: 'smb' | 'mid-market' | 'enterprise' | 'global-enterprise';
    currentMarketingMaturity?: 1 | 2 | 3 | 4 | 5;
    existingTechStack?: string;
    teamSize?: string;
    annualMarketingBudget?: string;
  };

  // Commercial preferences
  commercialPreferences: {
    preferredEngagementModel?: MerkleOfferingType[];
    budgetRange?: 'under-100k' | '100k-250k' | '250k-500k' | '500k-1m' | 'over-1m';
    budgetFlexibility?: 'fixed' | 'flexible' | 'tbd';
    decisionTimeline?: 'immediate' | 'this-quarter' | 'next-quarter' | 'next-year' | 'exploring';
    internalResources?: 'limited' | 'moderate' | 'strong' | 'prefer-outsource';
    preferCapexOrOpex?: 'capex' | 'opex' | 'hybrid' | 'no-preference';
  };

  // Strategic context
  strategicContext: {
    keyBusinessDrivers?: string[];
    successMetrics?: string[];
    knownConstraints?: string;
    competitivePressures?: string;
    executiveSponsor?: string;
    additionalContext?: string;
  };
}

// Phase in a generated plan
export interface PlanPhase {
  phaseNumber: number;
  name: string;
  description: string;
  duration: string;
  capabilities: PlannedCapability[];
  totalEstimate?: string;
  keyMilestones: string[];
  dependencies: string[];
}

// Capability as it appears in the plan
export interface PlannedCapability {
  capabilityId: string;
  capabilityName: string;
  priority: 'critical' | 'high' | 'medium' | 'nice-to-have';
  relevance: CapabilityRelevance;
  rationale: string;
  recommendedOfferings: RecommendedOffering[];
  clientInputSummary?: string;
  sequencingNotes?: string;
}

// Recommended offering with context
export interface RecommendedOffering {
  offeringName: string;
  offeringType: MerkleOfferingType;
  sizing?: 'S' | 'M' | 'L' | 'custom';
  rationale: string;
  estimateRange?: string;
}

// Complete generated plan
export interface GeneratedPlan {
  id: string;
  generatedAt: Date;

  // Executive summary
  executiveSummary: {
    clientName: string;
    opportunityName?: string;
    overallRecommendation: string;
    strategicRationale: string;
    totalCapabilities: number;
    immediateCapabilities: number;
    nearFutureCapabilities: number;
    estimatedTotalInvestment?: string;
    recommendedTimeframe: string;
  };

  // Phased implementation plan
  phases: PlanPhase[];

  // Quick wins - things that can start immediately
  quickWins: {
    capabilityId: string;
    capabilityName: string;
    description: string;
    impact: string;
  }[];

  // Foundation requirements - must-haves before other capabilities
  foundationRequirements: {
    requirement: string;
    relatedCapabilities: string[];
    status: 'met' | 'partial' | 'not-met' | 'unknown';
  }[];

  // Commercial recommendation
  commercialSummary: {
    recommendedModel: string;
    modelRationale: string;
    phasedInvestment: {
      phase: number;
      description: string;
      estimateRange: string;
    }[];
    alternativeModels?: {
      model: string;
      description: string;
      tradeoffs: string;
    }[];
  };

  // Risk factors and mitigations
  risks: {
    risk: string;
    likelihood: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];

  // Success metrics
  successMetrics: {
    metric: string;
    baseline?: string;
    target: string;
    timeframe: string;
  }[];

  // Next steps
  nextSteps: {
    step: string;
    owner: 'merkle' | 'client' | 'joint';
    timeline: string;
  }[];
}
