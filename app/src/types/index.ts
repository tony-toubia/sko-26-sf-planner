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
// Currently focused on M&P only - other disciplines will be added in future releases
export type DisciplineType = 'messaging-personalization';

// Future disciplines (not yet implemented)
export type FutureDisciplineType =
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

// Marketing Foundation Choice - the key decision point
export type MarketingFoundationType = 'mc-engagement' | 'mc-advanced';

export interface MarketingFoundation {
  id: MarketingFoundationType;
  name: string;
  shortName: string;
  description: string;
  features: string[];
  limitations?: string[];
  recommended: boolean;
}

// Industry verticals - affects capability relevance and questions
// Retail, CPG & QSR are consolidated into one industry for M&P focus
export type IndustryType =
  | 'retail-cpg-qsr'
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

// Product/Feature used by a capability
export interface ProductFeature {
  name: string;
  category: 'platform' | 'feature' | 'integration' | 'merkle';
  icon?: string;
}

// Adjacency to other maturity matrices
export interface MatrixAdjacency {
  matrix: FutureDisciplineType;
  connectionPoint: string;
  description: string;
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

  // NEW: Products and features used by this capability
  productsFeatures?: ProductFeature[];

  // NEW: Adjacencies to other maturity matrices (future expansion)
  adjacencies?: MatrixAdjacency[];

  // NEW: Which marketing foundation(s) this capability is available for
  availableFor?: MarketingFoundationType[];

  // NEW: Is this a decision point capability?
  isDecisionPoint?: boolean;
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
// Order: complete > in-progress > immediately-relevant > near-future > not-ready > not-assessed
export type CapabilityRelevance = 'complete' | 'in-progress' | 'immediately-relevant' | 'near-future' | 'not-ready' | 'not-assessed';

// Industry-specific question variant
export interface IndustryQuestionVariant {
  question?: string; // Override the question text
  options?: string[]; // Override the options
  helpText?: string; // Override help text
}

// Assessment question for a capability
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'text' | 'scale';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  // Industry-specific overrides
  industryVariants?: Partial<Record<IndustryType, IndustryQuestionVariant>>;
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
  industry?: IndustryType;
  createdAt: Date;
  updatedAt: Date;
  assessments: Record<string, CapabilityAssessment>;
  globalInputs?: GlobalAssessmentInputs;
  isComplete: boolean;
  generatedPlan?: GeneratedPlan;
  // NEW: Marketing foundation choice
  marketingFoundation?: MarketingFoundationType;
  // NEW: Track-based assessments
  trackAssessments?: Record<string, TrackLevelAssessment>;
  // NEW: User email for saving/retrieving assessments
  userEmail?: string;
}

// Global assessment inputs - collected before/after capability assessments
export interface GlobalAssessmentInputs {
  // Client context
  clientContext: {
    industry?: string;
    industrySegment?: string; // Sub-segment like 'QSR', 'Retail', 'Banking', etc.
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

// ============================================================================
// TRACK-BASED MATURITY MODEL
// ============================================================================

// Track identifiers
export type TrackId = 'data-identity' | 'journeys' | 'content-channels' | 'intelligence';

// Track level (1-3)
export type TrackLevel = 1 | 2 | 3;

// Track level status
export type TrackLevelStatus = 'not-started' | 'in-progress' | 'complete';

// A single level within a track
export interface TrackLevelDefinition {
  level: TrackLevel;
  name: string;
  shortName: string;
  description: string;
  capabilities: string[]; // Capability IDs that belong to this level
  assessmentQuestions: TrackAssessmentQuestion[];
}

// Assessment question for a track level
export interface TrackAssessmentQuestion {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'text';
  options?: string[];
  helpText?: string;
  required?: boolean;
  // Industry-specific overrides
  industryVariants?: Partial<Record<IndustryType, IndustryQuestionVariant>>;
}

// Cross-track dependency
export interface TrackDependency {
  fromTrack: TrackId;
  fromLevel: TrackLevel;
  toTrack: TrackId;
  toLevel: TrackLevel;
  type: 'required' | 'recommended';
  description: string;
}

// Complete track definition
export interface Track {
  id: TrackId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string; // Tailwind color class
  journeyType: JourneyType; // above-the-line or below-the-line
  levels: TrackLevelDefinition[];
}

// Track assessment state for a single level
export interface TrackLevelAssessment {
  trackId: TrackId;
  level: TrackLevel;
  status: TrackLevelStatus;
  answers: AssessmentAnswer[];
  notes?: string;
  assessedAt?: Date;
}

// Complete track assessment for an opportunity
export interface TrackAssessmentState {
  trackAssessments: Record<string, TrackLevelAssessment>; // key: `${trackId}-${level}`
  currentTrackId?: TrackId;
  currentLevel?: TrackLevel;
  completedAt?: Date;
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
    completeCapabilities?: number;
    inProgressCapabilities?: number;
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

  // AI-generated content (when using AI plan generation)
  aiGenerated?: {
    markdown: string; // Full AI-generated plan as markdown
    generatedWith: 'claude-sonnet' | 'claude-opus';
    tokenUsage?: {
      input: number;
      output: number;
    };
  };
}
