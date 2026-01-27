/**
 * Cross-Discipline Adjacencies
 *
 * Defines the connections between different assessment disciplines
 * (e.g., Messaging & Personalization ↔ Loyalty) that unlock or enhance
 * capabilities across domains.
 *
 * These adjacencies enable:
 * 1. Recommending cross-discipline capabilities when readiness is achieved
 * 2. Showing potential value of investing in related disciplines
 * 3. Creating comprehensive implementation roadmaps
 */

import type { DisciplineType, DisciplineAdjacency } from '../types';

// ============================================================================
// DISCIPLINE DEFINITIONS
// ============================================================================

export interface DisciplineDefinition {
  id: DisciplineType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  salesforceCloud: string;
  available: boolean;
  trackCount: number;
  capabilityCount: number;
}

export const DISCIPLINES: DisciplineDefinition[] = [
  {
    id: 'messaging-personalization',
    name: 'Messaging & Personalization',
    shortName: 'M&P',
    description: 'Marketing Cloud maturity from email campaigns to AI-powered personalization',
    icon: 'Mail',
    color: 'orange',
    salesforceCloud: 'Marketing Cloud',
    available: true,
    trackCount: 4,
    capabilityCount: 14,
  },
  {
    id: 'loyalty',
    name: 'Loyalty Management',
    shortName: 'Loyalty',
    description: 'Loyalty program maturity from basic rewards to predictive, personalized engagement',
    icon: 'Award',
    color: 'violet',
    salesforceCloud: 'Loyalty Management',
    available: true,
    trackCount: 4,
    capabilityCount: 29,
  },
];

// ============================================================================
// CROSS-DISCIPLINE ADJACENCIES
// ============================================================================

export const DISCIPLINE_ADJACENCIES: DisciplineAdjacency[] = [
  // =========================================================================
  // M&P → LOYALTY ADJACENCIES
  // =========================================================================
  {
    id: 'mp-to-loyalty-data-cloud',
    fromDiscipline: 'messaging-personalization',
    fromTrack: 'data-identity',
    toDiscipline: 'loyalty',
    toTrack: 'program-foundation',
    type: 'enhances',
    name: 'Data Cloud Foundation',
    description: 'Data Cloud setup in M&P provides unified member profiles for Loyalty Management',
    maturityThreshold: 2,
    businessValue: 'Unified customer data accelerates loyalty program deployment and enables real-time member experiences',
  },
  {
    id: 'mp-to-loyalty-identity',
    fromDiscipline: 'messaging-personalization',
    fromCapability: 'identity-resolution',
    toDiscipline: 'loyalty',
    toCapability: 'member-data-model',
    type: 'enhances',
    name: 'Identity Resolution',
    description: 'dentsu.Identity resolution creates accurate member profiles across touchpoints',
    maturityThreshold: 3,
    businessValue: 'Resolved identity reduces member duplicates and enables accurate earning/redemption across channels',
  },
  {
    id: 'mp-to-loyalty-journeys',
    fromDiscipline: 'messaging-personalization',
    fromTrack: 'journeys',
    toDiscipline: 'loyalty',
    toTrack: 'member-engagement',
    type: 'unlocks',
    name: 'Journey Foundation',
    description: 'Marketing Cloud journey capabilities power loyalty member communications',
    maturityThreshold: 2,
    businessValue: 'Existing journey infrastructure enables rapid deployment of loyalty-specific member journeys',
  },
  {
    id: 'mp-to-loyalty-clv',
    fromDiscipline: 'messaging-personalization',
    fromCapability: 'clv-modeling',
    toDiscipline: 'loyalty',
    toCapability: 'loyalty-clv',
    type: 'enhances',
    name: 'CLV Models',
    description: 'Customer lifetime value models from M&P enhance loyalty member value scoring',
    maturityThreshold: 4,
    businessValue: 'Shared CLV models enable consistent value-based treatment across marketing and loyalty',
  },
  {
    id: 'mp-to-loyalty-segmentation',
    fromDiscipline: 'messaging-personalization',
    fromCapability: 'data-exploration',
    toDiscipline: 'loyalty',
    toCapability: 'member-analytics',
    type: 'enhances',
    name: 'Segmentation Expertise',
    description: 'Marketing segmentation approaches inform loyalty member segmentation',
    maturityThreshold: 2,
    businessValue: 'Consistent segmentation strategy across marketing and loyalty improves targeting effectiveness',
  },
  {
    id: 'mp-to-loyalty-personalization',
    fromDiscipline: 'messaging-personalization',
    fromCapability: 'insight-driven-experiences',
    toDiscipline: 'loyalty',
    toCapability: 'personalized-loyalty',
    type: 'unlocks',
    name: 'Personalization Capabilities',
    description: 'Einstein personalization capabilities extend to loyalty experiences',
    maturityThreshold: 4,
    businessValue: 'Shared personalization infrastructure reduces cost and enables consistent experiences',
  },

  // =========================================================================
  // LOYALTY → M&P ADJACENCIES
  // =========================================================================
  {
    id: 'loyalty-to-mp-member-data',
    fromDiscipline: 'loyalty',
    fromTrack: 'program-foundation',
    toDiscipline: 'messaging-personalization',
    toTrack: 'data-identity',
    type: 'feeds',
    name: 'Member Data',
    description: 'Loyalty member data enriches marketing customer profiles',
    maturityThreshold: 1,
    businessValue: 'Loyalty attributes (tier, points, preferences) enable richer marketing personalization',
  },
  {
    id: 'loyalty-to-mp-engagement-signals',
    fromDiscipline: 'loyalty',
    fromTrack: 'member-engagement',
    toDiscipline: 'messaging-personalization',
    toTrack: 'journeys',
    type: 'feeds',
    name: 'Engagement Signals',
    description: 'Loyalty engagement events trigger marketing journeys',
    maturityThreshold: 2,
    businessValue: 'Challenge completions, tier changes, and redemptions trigger timely marketing communications',
  },
  {
    id: 'loyalty-to-mp-tier-personalization',
    fromDiscipline: 'loyalty',
    fromCapability: 'tier-management',
    toDiscipline: 'messaging-personalization',
    toCapability: 'scale-dynamic-content',
    type: 'enhances',
    name: 'Tier-Based Content',
    description: 'Loyalty tier data enables tier-specific content personalization in marketing',
    maturityThreshold: 2,
    businessValue: 'Marketing content adapts to member tier status for relevant, status-appropriate messaging',
  },
  {
    id: 'loyalty-to-mp-offer-delivery',
    fromDiscipline: 'loyalty',
    fromCapability: 'offer-management',
    toDiscipline: 'messaging-personalization',
    toTrack: 'content-channels',
    type: 'requires',
    name: 'Offer Delivery',
    description: 'Loyalty offers require Marketing Cloud channels for distribution',
    maturityThreshold: 2,
    businessValue: 'Marketing Cloud channels (email, SMS, push) deliver targeted loyalty offers to members',
  },
  {
    id: 'loyalty-to-mp-churn-intervention',
    fromDiscipline: 'loyalty',
    fromCapability: 'churn-prediction',
    toDiscipline: 'messaging-personalization',
    toCapability: 'customer-lifecycle-journeys',
    type: 'feeds',
    name: 'Churn Intervention',
    description: 'Loyalty churn predictions trigger marketing win-back journeys',
    maturityThreshold: 4,
    businessValue: 'At-risk member identification enables proactive retention through marketing intervention',
  },
  {
    id: 'loyalty-to-mp-value-based-treatment',
    fromDiscipline: 'loyalty',
    fromCapability: 'loyalty-clv',
    toDiscipline: 'messaging-personalization',
    toCapability: 'insight-driven-experiences',
    type: 'enhances',
    name: 'Value-Based Marketing',
    description: 'Loyalty CLV informs marketing investment and personalization depth',
    maturityThreshold: 4,
    businessValue: 'Marketing investment optimized based on member lifetime value from loyalty',
  },
  {
    id: 'loyalty-to-mp-preferences',
    fromDiscipline: 'loyalty',
    fromCapability: 'member-administration',
    toDiscipline: 'messaging-personalization',
    toCapability: 'enhance-planned-campaigns',
    type: 'feeds',
    name: 'Member Preferences',
    description: 'Loyalty member preferences inform marketing communication preferences',
    maturityThreshold: 1,
    businessValue: 'Unified preference management across loyalty and marketing reduces opt-outs',
  },

  // =========================================================================
  // BIDIRECTIONAL / MUTUAL ADJACENCIES
  // =========================================================================
  {
    id: 'shared-customer-360',
    fromDiscipline: 'messaging-personalization',
    fromCapability: 'migrate-sfmc',
    toDiscipline: 'loyalty',
    toCapability: 'loyalty-program-setup',
    type: 'enhances',
    name: 'Shared Customer 360',
    description: 'Data Cloud provides unified view across marketing and loyalty',
    maturityThreshold: 1,
    businessValue: 'Single customer view enables consistent experiences and reduces data silos',
  },
  {
    id: 'unified-intelligence',
    fromDiscipline: 'messaging-personalization',
    fromTrack: 'intelligence',
    toDiscipline: 'loyalty',
    toTrack: 'loyalty-intelligence',
    type: 'enhances',
    name: 'Unified Intelligence',
    description: 'Shared analytics infrastructure across marketing and loyalty',
    maturityThreshold: 2,
    businessValue: 'Consolidated analytics reduce cost and enable cross-domain insights',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all adjacencies for a specific discipline
 */
export function getAdjacenciesForDiscipline(discipline: DisciplineType): DisciplineAdjacency[] {
  return DISCIPLINE_ADJACENCIES.filter(
    (a) => a.fromDiscipline === discipline || a.toDiscipline === discipline
  );
}

/**
 * Get adjacencies FROM a specific discipline (what it enables in others)
 */
export function getOutboundAdjacencies(discipline: DisciplineType): DisciplineAdjacency[] {
  return DISCIPLINE_ADJACENCIES.filter((a) => a.fromDiscipline === discipline);
}

/**
 * Get adjacencies TO a specific discipline (what it benefits from)
 */
export function getInboundAdjacencies(discipline: DisciplineType): DisciplineAdjacency[] {
  return DISCIPLINE_ADJACENCIES.filter((a) => a.toDiscipline === discipline);
}

/**
 * Get adjacencies between two specific disciplines
 */
export function getAdjacenciesBetween(
  from: DisciplineType,
  to: DisciplineType
): DisciplineAdjacency[] {
  return DISCIPLINE_ADJACENCIES.filter(
    (a) => a.fromDiscipline === from && a.toDiscipline === to
  );
}

/**
 * Get adjacencies that are unlocked at a given maturity level
 */
export function getUnlockedAdjacencies(
  discipline: DisciplineType,
  maturityLevel: number
): DisciplineAdjacency[] {
  return getOutboundAdjacencies(discipline).filter(
    (a) => !a.maturityThreshold || a.maturityThreshold <= maturityLevel
  );
}

/**
 * Get adjacencies for a specific capability
 */
export function getAdjacenciesForCapability(capabilityId: string): DisciplineAdjacency[] {
  return DISCIPLINE_ADJACENCIES.filter(
    (a) => a.fromCapability === capabilityId || a.toCapability === capabilityId
  );
}

/**
 * Get adjacencies for a specific track
 */
export function getAdjacenciesForTrack(trackId: string): DisciplineAdjacency[] {
  return DISCIPLINE_ADJACENCIES.filter(
    (a) => a.fromTrack === trackId || a.toTrack === trackId
  );
}

/**
 * Calculate adjacency score between two disciplines based on completed capabilities
 */
export function calculateAdjacencyScore(
  fromDiscipline: DisciplineType,
  completedCapabilities: string[],
  maturityLevel: number
): {
  score: number;
  unlockedAdjacencies: DisciplineAdjacency[];
  potentialAdjacencies: DisciplineAdjacency[];
} {
  const allOutbound = getOutboundAdjacencies(fromDiscipline);

  const unlockedAdjacencies = allOutbound.filter((a) => {
    const meetsThreshold = !a.maturityThreshold || a.maturityThreshold <= maturityLevel;
    const hasCapability = !a.fromCapability || completedCapabilities.includes(a.fromCapability);
    return meetsThreshold && hasCapability;
  });

  const potentialAdjacencies = allOutbound.filter((a) => {
    return !unlockedAdjacencies.includes(a);
  });

  const score = (unlockedAdjacencies.length / allOutbound.length) * 100;

  return {
    score,
    unlockedAdjacencies,
    potentialAdjacencies,
  };
}

/**
 * Get recommended next discipline based on current assessment state
 */
export function getRecommendedNextDiscipline(
  currentDiscipline: DisciplineType,
  maturityLevel: number
): {
  discipline: DisciplineDefinition;
  reason: string;
  topAdjacencies: DisciplineAdjacency[];
} | null {
  const adjacencies = getUnlockedAdjacencies(currentDiscipline, maturityLevel);

  // Group by target discipline and count
  const targetCounts = new Map<DisciplineType, DisciplineAdjacency[]>();
  for (const adj of adjacencies) {
    const existing = targetCounts.get(adj.toDiscipline) || [];
    existing.push(adj);
    targetCounts.set(adj.toDiscipline, existing);
  }

  // Find the discipline with most adjacencies
  let maxCount = 0;
  let recommended: DisciplineType | null = null;
  let topAdj: DisciplineAdjacency[] = [];

  for (const [disc, adjs] of targetCounts) {
    if (disc !== currentDiscipline && adjs.length > maxCount) {
      maxCount = adjs.length;
      recommended = disc;
      topAdj = adjs;
    }
  }

  if (!recommended) return null;

  const disciplineDef = DISCIPLINES.find((d) => d.id === recommended);
  if (!disciplineDef) return null;

  return {
    discipline: disciplineDef,
    reason: `Your ${currentDiscipline === 'messaging-personalization' ? 'Messaging & Personalization' : 'Loyalty'} maturity unlocks ${maxCount} adjacencies with ${disciplineDef.name}`,
    topAdjacencies: topAdj.slice(0, 3),
  };
}

// ============================================================================
// ADJACENCY VISUALIZATION DATA
// ============================================================================

export interface AdjacencyMapNode {
  id: string;
  discipline: DisciplineType;
  type: 'discipline' | 'track' | 'capability';
  name: string;
  color: string;
}

export interface AdjacencyMapEdge {
  id: string;
  source: string;
  target: string;
  type: DisciplineAdjacency['type'];
  label: string;
}

/**
 * Generate visualization data for adjacency map
 */
export function generateAdjacencyMapData(): {
  nodes: AdjacencyMapNode[];
  edges: AdjacencyMapEdge[];
} {
  const nodes: AdjacencyMapNode[] = DISCIPLINES.map((d) => ({
    id: d.id,
    discipline: d.id,
    type: 'discipline',
    name: d.shortName,
    color: d.color,
  }));

  const edges: AdjacencyMapEdge[] = DISCIPLINE_ADJACENCIES.map((a) => ({
    id: a.id,
    source: a.fromDiscipline,
    target: a.toDiscipline,
    type: a.type,
    label: a.name,
  }));

  return { nodes, edges };
}
