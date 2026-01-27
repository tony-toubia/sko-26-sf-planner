/**
 * Service Recommendation Engine
 * Analyzes assessment data and pre-selects appropriate services with sizes and modifiers
 */

import type { IndustryType, DisciplineType } from '../types';
import {
  type ServiceOffering,
  type ServiceSize,
  ALL_SERVICES,
  calculateServiceCost,
} from '../data/services';

export interface ServiceRecommendation {
  service: ServiceOffering;
  recommendedSize: ServiceSize;
  recommendedModifiers: string[];
  rationale: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: { min: number; max: number };
  dependencies: string[]; // Other service IDs that should be done first
}

export interface RecommendationContext {
  // Assessment data
  assessedLevels: Map<string, any>; // key -> assessment data
  selectedDisciplines: DisciplineType[];
  industry: IndustryType;
  marketingFoundation?: 'mc-engagement' | 'mc-advanced';

  // Derived insights
  currentMaturityLevel: number; // 0-5
  hasExistingMC: boolean;
  needsMigration: boolean;
  multipleBusinessUnits: boolean;
  hasComplexIntegrations: boolean;
  needsCreativeWork: boolean;
  needsStrategyWork: boolean;
}

/**
 * Main recommendation engine - analyzes assessment and returns pre-selected services
 */
export function generateServiceRecommendations(
  context: RecommendationContext
): ServiceRecommendation[] {
  const recommendations: ServiceRecommendation[] = [];

  // 1. Check if migration is needed (critical path item)
  if (context.needsMigration || context.marketingFoundation === 'mc-advanced') {
    const migration = recommendMigrationService(context);
    if (migration) recommendations.push(migration);
  }

  // 2. Recommend implementation services based on assessed capabilities
  const implementationServices = recommendImplementationServices(context);
  recommendations.push(...implementationServices);

  // 3. Recommend ongoing support (retainers)
  const retainer = recommendRetainerService(context);
  if (retainer) recommendations.push(retainer);

  // 4. Recommend staff augmentation if needed
  const staffAug = recommendStaffAugmentation(context);
  recommendations.push(...staffAug);

  // Sort by priority (critical first, then high, medium, low)
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Recommend migration service if needed
 */
function recommendMigrationService(
  context: RecommendationContext
): ServiceRecommendation | null {
  const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'mc-advanced-migration');
  if (!service) return null;

  // Determine size based on maturity and complexity
  let size: ServiceSize = 'small';
  let rationale = 'Foundation for advanced Marketing Cloud capabilities. ';

  const assessedCount = context.assessedLevels.size;
  const hasMultipleDisciplines = context.selectedDisciplines.length > 1;

  if (assessedCount > 8 || context.multipleBusinessUnits || hasMultipleDisciplines) {
    size = 'large';
    rationale += 'Large migration recommended due to ';
    const factors = [];
    if (assessedCount > 8) factors.push('extensive capabilities to migrate');
    if (context.multipleBusinessUnits) factors.push('multiple business units');
    if (hasMultipleDisciplines) factors.push('cross-discipline requirements');
    rationale += factors.join(', ') + '.';
  } else if (assessedCount > 4 || context.hasComplexIntegrations) {
    size = 'medium';
    rationale += 'Medium migration recommended due to ';
    const factors = [];
    if (assessedCount > 4) factors.push('moderate capability set');
    if (context.hasComplexIntegrations) factors.push('complex integrations');
    rationale += factors.join(', ') + '.';
  } else {
    rationale += 'Small migration suitable for single BU with standard requirements.';
  }

  // Auto-select modifiers
  const modifiers: string[] = ['migration-required'];
  if (context.multipleBusinessUnits) modifiers.push('multi-bu');
  if (context.hasComplexIntegrations) modifiers.push('complex-integrations');
  modifiers.push('includes-testing'); // Always recommend testing for migrations

  const cost = calculateServiceCost(service, size, modifiers, context.industry);

  return {
    service,
    recommendedSize: size,
    recommendedModifiers: modifiers,
    rationale,
    priority: 'critical',
    estimatedCost: cost,
    dependencies: [],
  };
}

/**
 * Recommend implementation services based on assessed track levels
 */
function recommendImplementationServices(
  context: RecommendationContext
): ServiceRecommendation[] {
  const recommendations: ServiceRecommendation[] = [];
  const assessedTrackLevels = Array.from(context.assessedLevels.keys());

  // Track what we've assessed to inform service sizing
  const dataLevelsAssessed = assessedTrackLevels.filter(k => k.startsWith('data-identity-')).length;
  const journeyLevelsAssessed = assessedTrackLevels.filter(k => k.startsWith('journeys-')).length;
  const contentLevelsAssessed = assessedTrackLevels.filter(k => k.startsWith('content-channels-')).length;
  const intelligenceLevelsAssessed = assessedTrackLevels.filter(k => k.startsWith('intelligence-')).length;

  // Count journey capabilities to estimate journey count
  let journeyCount = 0;
  context.assessedLevels.forEach((_assessment, key) => {
    if (key.startsWith('journeys-')) {
      // Estimate journeys based on level
      const level = parseInt(key.split('-').pop() || '1');
      if (level === 1) journeyCount += 3; // L1: 1-3 journeys
      if (level === 2) journeyCount += 7; // L2: 5-10 journeys
      if (level === 3) journeyCount += 15; // L3: 15+ journeys
    }
  });

  // 1. Data Integration Service
  if (dataLevelsAssessed > 0) {
    const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'data-integration');
    if (service) {
      let size: ServiceSize = 'small';
      let rationale = 'Data integration required for ';

      if (dataLevelsAssessed >= 3 || context.hasComplexIntegrations) {
        size = 'large';
        rationale += 'advanced data capabilities (Level 3) with real-time integrations, calculated insights, and identity resolution.';
      } else if (dataLevelsAssessed >= 2) {
        size = 'medium';
        rationale += 'Level 2 data capabilities including multi-source integration and profile enrichment.';
      } else {
        rationale += 'basic data foundation (Level 1) with core integrations.';
      }

      const modifiers: string[] = [];
      if (context.hasComplexIntegrations) modifiers.push('complex-integrations');
      if (context.multipleBusinessUnits) modifiers.push('multi-bu');
      modifiers.push('includes-testing');

      const cost = calculateServiceCost(service, size, modifiers, context.industry);

      recommendations.push({
        service,
        recommendedSize: size,
        recommendedModifiers: modifiers,
        rationale,
        priority: 'critical',
        estimatedCost: cost,
        dependencies: context.needsMigration ? ['mc-advanced-migration'] : [],
      });
    }
  }

  // 2. Journey Implementation Service
  if (journeyLevelsAssessed > 0) {
    const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'journey-implementation');
    if (service) {
      let size: ServiceSize = 'small';
      let rationale = `Journey implementation for ${journeyCount > 0 ? journeyCount : '1-3'} journeys. `;

      if (journeyCount >= 15 || journeyLevelsAssessed >= 3) {
        size = 'large';
        rationale += 'Large scope includes complex lifecycle journeys with AI optimization and cross-channel orchestration.';
      } else if (journeyCount >= 5 || journeyLevelsAssessed >= 2) {
        size = 'medium';
        rationale += 'Medium scope includes multi-step journeys with personalization and A/B testing.';
      } else {
        rationale += 'Small scope focuses on foundational welcome/onboarding journeys.';
      }

      const modifiers: string[] = [];
      if (context.needsCreativeWork) modifiers.push('includes-creative');
      if (context.needsStrategyWork) modifiers.push('includes-strategy');
      if (context.multipleBusinessUnits) modifiers.push('multi-bu');
      modifiers.push('includes-testing');

      const cost = calculateServiceCost(service, size, modifiers, context.industry);

      recommendations.push({
        service,
        recommendedSize: size,
        recommendedModifiers: modifiers,
        rationale,
        priority: 'high',
        estimatedCost: cost,
        dependencies: ['data-integration'],
      });
    }
  }

  // 3. Campaign Framework Service
  if (contentLevelsAssessed > 0) {
    const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'campaign-framework');
    if (service) {
      let size: ServiceSize = 'small';
      let rationale = 'Campaign framework and content strategy. ';

      if (contentLevelsAssessed >= 3) {
        size = 'large';
        rationale += 'Advanced framework with dynamic content, cross-channel templates, and AI-powered recommendations.';
      } else if (contentLevelsAssessed >= 2) {
        size = 'medium';
        rationale += 'Expanded framework with content blocks, templates, and personalization rules.';
      } else {
        rationale += 'Basic framework with email templates and content library.';
      }

      const modifiers: string[] = [];
      if (context.needsCreativeWork) modifiers.push('includes-creative');
      if (context.needsStrategyWork) modifiers.push('includes-strategy');

      const cost = calculateServiceCost(service, size, modifiers, context.industry);

      recommendations.push({
        service,
        recommendedSize: size,
        recommendedModifiers: modifiers,
        rationale,
        priority: 'medium',
        estimatedCost: cost,
        dependencies: [],
      });
    }
  }

  // 4. Analytics & Intelligence Service
  if (intelligenceLevelsAssessed > 0) {
    const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'analytics-intelligence');
    if (service) {
      let size: ServiceSize = 'small';
      let rationale = 'Analytics and intelligence setup. ';

      if (intelligenceLevelsAssessed >= 3) {
        size = 'large';
        rationale += 'Advanced analytics with Einstein Engagement Scoring, predictive models, and custom dashboards.';
      } else if (intelligenceLevelsAssessed >= 2) {
        size = 'medium';
        rationale += 'Enhanced analytics with journey analytics, A/B testing, and attribution.';
      } else {
        rationale += 'Basic analytics with email tracking and reporting dashboards.';
      }

      const modifiers: string[] = [];
      if (context.needsStrategyWork) modifiers.push('includes-strategy');

      const cost = calculateServiceCost(service, size, modifiers, context.industry);

      recommendations.push({
        service,
        recommendedSize: size,
        recommendedModifiers: modifiers,
        rationale,
        priority: 'medium',
        estimatedCost: cost,
        dependencies: ['data-integration'],
      });
    }
  }

  return recommendations;
}

/**
 * Recommend retainer service based on maturity and scope
 */
function recommendRetainerService(
  context: RecommendationContext
): ServiceRecommendation | null {
  const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'marketing-ops-retainer');
  if (!service) return null;

  // Recommend retainer if they're at Level 2+ maturity
  const assessedCount = context.assessedLevels.size;
  if (assessedCount < 4) return null; // Don't recommend for small implementations

  let size: ServiceSize = 'small';
  let rationale = 'Ongoing marketing operations support. ';

  if (assessedCount >= 10 || context.selectedDisciplines.length > 2) {
    size = 'large';
    rationale += 'Large retainer recommended for extensive operations across multiple disciplines and business units.';
  } else if (assessedCount >= 6 || context.selectedDisciplines.length > 1) {
    size = 'medium';
    rationale += 'Medium retainer for growing operations with multi-channel campaigns and journey optimization.';
  } else {
    rationale += 'Small retainer for campaign execution, journey monitoring, and basic optimization.';
  }

  const cost = calculateServiceCost(service, size, [], context.industry);

  return {
    service,
    recommendedSize: size,
    recommendedModifiers: [],
    rationale,
    priority: 'low',
    estimatedCost: cost,
    dependencies: [],
  };
}

/**
 * Recommend staff augmentation based on complexity and discipline
 */
function recommendStaffAugmentation(
  context: RecommendationContext
): ServiceRecommendation[] {
  const recommendations: ServiceRecommendation[] = [];
  const assessedCount = context.assessedLevels.size;

  // Only recommend staff aug for larger implementations
  if (assessedCount < 6) return recommendations;

  const journeyLevelsAssessed = Array.from(context.assessedLevels.keys())
    .filter(k => k.startsWith('journeys-')).length;
  const dataLevelsAssessed = Array.from(context.assessedLevels.keys())
    .filter(k => k.startsWith('data-identity-')).length;

  // Journey Architect for complex journey implementations
  if (journeyLevelsAssessed >= 2) {
    const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'staff-aug-journey-architect');
    if (service) {
      const size: ServiceSize = journeyLevelsAssessed >= 3 ? 'large' : 'medium';
      const cost = calculateServiceCost(service, size, [], context.industry);

      recommendations.push({
        service,
        recommendedSize: size,
        recommendedModifiers: [],
        rationale: 'Dedicated journey architect for ongoing journey optimization and lifecycle strategy.',
        priority: 'low',
        estimatedCost: cost,
        dependencies: ['journey-implementation'],
      });
    }
  }

  // Data Engineer for complex data integrations
  if (dataLevelsAssessed >= 2 && context.hasComplexIntegrations) {
    const service = ALL_SERVICES.find((s: ServiceOffering) => s.id === 'staff-aug-data-engineer');
    if (service) {
      const size: ServiceSize = dataLevelsAssessed >= 3 ? 'large' : 'medium';
      const cost = calculateServiceCost(service, size, [], context.industry);

      recommendations.push({
        service,
        recommendedSize: size,
        recommendedModifiers: [],
        rationale: 'Dedicated data engineer for complex integrations, ETL, and data quality management.',
        priority: 'low',
        estimatedCost: cost,
        dependencies: ['data-integration'],
      });
    }
  }

  return recommendations;
}

/**
 * Build recommendation context from assessment data
 */
export function buildRecommendationContext(
  assessedLevels: Map<string, any>,
  selectedDisciplines: DisciplineType[],
  industry: IndustryType,
  marketingFoundation?: 'mc-engagement' | 'mc-advanced'
): RecommendationContext {
  // Calculate maturity level (0-5) based on highest levels assessed
  let maxLevel = 0;
  assessedLevels.forEach((_assessment, key) => {
    const level = parseInt(key.split('-').pop() || '0');
    if (level > maxLevel) maxLevel = level;
  });

  // Detect migration needs (simplified - can be enhanced)
  const needsMigration = marketingFoundation === 'mc-advanced';
  const hasExistingMC = marketingFoundation !== undefined;

  // Analyze complexity indicators from assessment data
  let hasComplexIntegrations = false;
  let multipleBusinessUnits = false;
  let needsCreativeWork = false;
  let needsStrategyWork = false;

  assessedLevels.forEach((assessment, key) => {
    // Look for complexity indicators in assessment answers
    if (key.startsWith('data-identity-')) {
      // Check if they mentioned complex integrations
      const answers = assessment.capabilities || [];
      if (answers.some((a: string) => a.includes('API') || a.includes('real-time') || a.includes('Snowflake'))) {
        hasComplexIntegrations = true;
      }
    }

    // Multiple disciplines often implies multiple BUs
    if (selectedDisciplines.length > 2) {
      multipleBusinessUnits = true;
    }

    // Creative/strategy needs detection (simplified)
    if (key.startsWith('content-channels-') && assessment.capabilities?.length > 3) {
      needsCreativeWork = true;
    }
    if (maxLevel >= 2) {
      needsStrategyWork = true;
    }
  });

  return {
    assessedLevels,
    selectedDisciplines,
    industry,
    marketingFoundation,
    currentMaturityLevel: maxLevel,
    hasExistingMC,
    needsMigration,
    multipleBusinessUnits,
    hasComplexIntegrations,
    needsCreativeWork,
    needsStrategyWork,
  };
}
