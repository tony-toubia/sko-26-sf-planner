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

// Journey classification (Iceberg concept)
export type JourneyType = 'above-the-line' | 'below-the-line' | 'transactional';

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

// Salesforce value proposition
export interface SalesforceValue {
  consumption: string;
  stickiness: string;
  expansion: string;
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
  lifecycleStages: LifecycleStage[];

  // Business value
  clientValue: {
    why: string;
    howItAdvancesMaturity: string;
    businessOutcomes: string[];
    kpis: string[];
  };

  // Salesforce value
  salesforceValue: SalesforceValue;

  // Implementation details
  prerequisites: string[];
  dependencies: string[];
  merkleServices: string[];

  // Reference materials
  references: ReferenceMaterial[];

  // Salesforce products/features involved
  salesforceProducts: string[];

  // Tags for search/filter
  tags: string[];

  // Icon for display
  icon?: string;
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
