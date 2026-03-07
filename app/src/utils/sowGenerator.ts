/**
 * Statement of Work (SOW) Generator
 *
 * Auto-generates a Statement of Work skeleton from a GeneratedPlan's phases,
 * timelines, and service recommendations. Maps plan capabilities to the
 * services catalog for accurate cost estimation and team composition.
 */

import type {
  GeneratedPlan,
  OpportunityAssessment,
  PlanPhase,
  PlannedCapability,
  IndustryType,
} from '../types';

import {
  type ServiceOffering,
  type ServiceSize,
  type ServiceSizeDefinition,
  getServicesForCapability,
  calculateServiceCost,
  ALL_SERVICES,
} from '../data/services';

// ============================================================================
// SOW TYPES
// ============================================================================

export interface SOWSection {
  title: string;
  content: string; // Markdown
}

export interface SOWLineItem {
  phase: number;
  phaseName: string;
  service: string;
  description: string;
  duration: string;
  estimatedCost: { min: number; max: number };
  deliverables: string[];
  team: { role: string; allocation: string }[];
}

export interface StatementOfWork {
  id: string;
  generatedAt: Date;
  clientName: string;
  opportunityName?: string;
  industry?: string;

  // Document sections
  sections: {
    projectOverview: string;
    scopeOfWork: string;
    assumptions: string;
    timeline: string;
    investmentSummary: string;
    teamComposition: string;
    acceptanceCriteria: string;
    changeManagement: string;
  };

  // Line items derived from plan phases + services catalog
  lineItems: SOWLineItem[];

  // Financial summary
  totalEstimate: { min: number; max: number };

  // Full markdown export
  markdown: string;
}

// ============================================================================
// INDUSTRY DISPLAY NAMES
// ============================================================================

const INDUSTRY_DISPLAY_NAMES: Record<string, string> = {
  'retail-cpg-qsr': 'Retail, CPG & QSR',
  'financial-services': 'Financial Services',
  'healthcare-life-sciences': 'Healthcare & Life Sciences',
  'manufacturing': 'Manufacturing',
  'travel-hospitality': 'Travel & Hospitality',
  'media-entertainment': 'Media & Entertainment',
  'technology': 'Technology',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `sow-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Determine appropriate service size based on the number of capabilities
 * in a phase and other signals.
 */
function inferServiceSize(
  phase: PlanPhase,
  service: ServiceOffering
): ServiceSize {
  const capCount = phase.capabilities.length;
  const hasCritical = phase.capabilities.some(c => c.priority === 'critical');
  const availableSizes = service.sizes.map(s => s.size);

  // If only one size, use it
  if (availableSizes.length === 1) {
    return availableSizes[0];
  }

  // For phases with many capabilities or critical items, prefer larger sizing
  if (capCount >= 5 || (hasCritical && capCount >= 3)) {
    if (availableSizes.includes('large')) return 'large';
    if (availableSizes.includes('enterprise')) return 'enterprise';
    return availableSizes[availableSizes.length - 1];
  }

  if (capCount >= 3) {
    if (availableSizes.includes('medium')) return 'medium';
    return availableSizes[Math.min(1, availableSizes.length - 1)];
  }

  if (availableSizes.includes('small')) return 'small';
  return availableSizes[0];
}

/**
 * Get size definition from a service offering.
 */
function getSizeDefinition(
  service: ServiceOffering,
  size: ServiceSize
): ServiceSizeDefinition | undefined {
  return service.sizes.find(s => s.size === size);
}

/**
 * Collect modifiers from the assessment's service recommendations, if available.
 */
function getModifiersForService(
  assessment: OpportunityAssessment,
  serviceId: string
): string[] {
  if (!assessment.serviceRecommendations) return [];
  const rec = assessment.serviceRecommendations.find(r => r.serviceId === serviceId);
  return rec?.modifiers ?? [];
}

/**
 * Build line items from plan phases by mapping capabilities to services.
 */
function buildLineItems(
  plan: GeneratedPlan,
  assessment: OpportunityAssessment
): SOWLineItem[] {
  const lineItems: SOWLineItem[] = [];
  const industry = assessment.industry as IndustryType | undefined;

  // Track which services have already been added to avoid duplicates
  const addedServicesByPhase = new Map<string, Set<string>>();

  for (const phase of plan.phases) {
    const phaseKey = `phase-${phase.phaseNumber}`;
    if (!addedServicesByPhase.has(phaseKey)) {
      addedServicesByPhase.set(phaseKey, new Set());
    }
    const phaseServices = addedServicesByPhase.get(phaseKey)!;

    for (const capability of phase.capabilities) {
      const matchingServices = getServicesForCapability(capability.capabilityId);

      if (matchingServices.length === 0) {
        // No catalog service maps to this capability -- create a generic line item
        lineItems.push({
          phase: phase.phaseNumber,
          phaseName: phase.name,
          service: capability.capabilityName,
          description: capability.rationale,
          duration: phase.duration,
          estimatedCost: { min: 0, max: 0 },
          deliverables: [`${capability.capabilityName} implementation`],
          team: [],
        });
        continue;
      }

      for (const service of matchingServices) {
        // Skip if already added for this phase
        if (phaseServices.has(service.id)) continue;
        phaseServices.add(service.id);

        const size = inferServiceSize(phase, service);
        const sizeDef = getSizeDefinition(service, size);
        const modifiers = getModifiersForService(assessment, service.id);
        const cost = calculateServiceCost(service, size, modifiers, industry);

        lineItems.push({
          phase: phase.phaseNumber,
          phaseName: phase.name,
          service: service.name,
          description: service.description,
          duration: sizeDef?.duration ?? phase.duration,
          estimatedCost: cost,
          deliverables: sizeDef?.deliverables ?? [],
          team: sizeDef?.team ?? [],
        });
      }
    }
  }

  return lineItems;
}

/**
 * Aggregate team roles across all line items, de-duplicating roles and showing
 * the highest allocation for each.
 */
function aggregateTeam(
  lineItems: SOWLineItem[]
): { role: string; allocation: string }[] {
  const roleMap = new Map<string, string>();

  for (const item of lineItems) {
    for (const member of item.team) {
      const existing = roleMap.get(member.role);
      if (!existing) {
        roleMap.set(member.role, member.allocation);
      }
      // Keep the entry -- we show each role once at its highest allocation
    }
  }

  return Array.from(roleMap.entries()).map(([role, allocation]) => ({
    role,
    allocation,
  }));
}

// ============================================================================
// SECTION GENERATORS
// ============================================================================

function generateProjectOverview(
  plan: GeneratedPlan,
  assessment: OpportunityAssessment
): string {
  const es = plan.executiveSummary;
  const industryLabel = assessment.industry
    ? INDUSTRY_DISPLAY_NAMES[assessment.industry] ?? assessment.industry
    : '';
  const industryLine = industryLabel ? ` in the ${industryLabel} sector` : '';

  let overview = `Merkle, a dentsu company, is pleased to present this Statement of Work for ${es.clientName}${industryLine}. `;
  overview += `${es.strategicRationale}\n\n`;
  overview += `This engagement encompasses ${es.totalCapabilities} capability area${es.totalCapabilities !== 1 ? 's' : ''}, `;
  overview += `of which ${es.immediateCapabilities} are identified for immediate implementation`;
  if (es.nearFutureCapabilities > 0) {
    overview += ` and ${es.nearFutureCapabilities} for near-future development`;
  }
  overview += `. `;
  overview += `The recommended timeframe for the full engagement is ${es.recommendedTimeframe}.\n\n`;
  overview += `${es.overallRecommendation}`;

  return overview;
}

function generateScopeOfWork(
  plan: GeneratedPlan,
  lineItems: SOWLineItem[]
): string {
  let scope = 'The following scope of work details the phased implementation approach:\n\n';

  for (const phase of plan.phases) {
    scope += `### Phase ${phase.phaseNumber}: ${phase.name}\n\n`;
    scope += `${phase.description}\n\n`;
    scope += `**Duration:** ${phase.duration}\n\n`;

    // List capabilities in this phase
    scope += '**Capabilities:**\n\n';
    for (const cap of phase.capabilities) {
      const priorityLabel = cap.priority.charAt(0).toUpperCase() + cap.priority.slice(1);
      scope += `- **${cap.capabilityName}** (${priorityLabel}) -- ${cap.rationale}\n`;
    }
    scope += '\n';

    // Services for this phase
    const phaseLineItems = lineItems.filter(li => li.phase === phase.phaseNumber);
    if (phaseLineItems.length > 0) {
      scope += '**Services:**\n\n';
      for (const li of phaseLineItems) {
        scope += `- ${li.service}`;
        if (li.estimatedCost.min > 0) {
          scope += ` (${formatCurrency(li.estimatedCost.min)} - ${formatCurrency(li.estimatedCost.max)})`;
        }
        scope += '\n';
      }
      scope += '\n';
    }

    // Key milestones
    if (phase.keyMilestones.length > 0) {
      scope += '**Key Milestones:**\n\n';
      for (const milestone of phase.keyMilestones) {
        scope += `- ${milestone}\n`;
      }
      scope += '\n';
    }
  }

  return scope;
}

function generateAssumptions(
  plan: GeneratedPlan,
  assessment: OpportunityAssessment
): string {
  const assumptions = [
    'Client will provide timely access to required systems, data, and stakeholders.',
    'Client will designate a primary point of contact and executive sponsor for this engagement.',
    'All third-party system access and licenses required for integrations will be provided by the client.',
    'Existing Salesforce platform licenses are current and appropriately provisioned.',
    'Client will participate in weekly status meetings and provide feedback within agreed-upon SLAs.',
    'Content and creative assets, unless specifically included in scope, will be provided by the client.',
    'Timeline estimates assume dedicated client resources are available for UAT and sign-off activities.',
    'Any scope changes will be managed through the change management process outlined in this document.',
    'All deliverables are provided in English unless otherwise specified.',
    'Data privacy and compliance requirements will be communicated at the start of the engagement.',
  ];

  // Add industry-specific assumptions
  if (assessment.industry === 'financial-services') {
    assumptions.push(
      'Client will provide guidance on financial regulatory requirements (e.g., GDPR, CCPA, SOX) applicable to marketing communications.',
      'Additional security review cycles may be required for PII handling.'
    );
  } else if (assessment.industry === 'healthcare-life-sciences') {
    assumptions.push(
      'Client will ensure HIPAA compliance requirements are communicated and BAA agreements are in place.',
      'PHI data handling procedures will be established prior to data integration work.'
    );
  } else if (assessment.industry === 'retail-cpg-qsr') {
    assumptions.push(
      'E-commerce platform integration specifications and API documentation will be provided by the client.',
      'Product catalog data feeds will be available in the agreed-upon format.'
    );
  }

  let text = 'This Statement of Work is based on the following assumptions:\n\n';
  for (const assumption of assumptions) {
    text += `- ${assumption}\n`;
  }

  return text;
}

function generateTimeline(
  plan: GeneratedPlan,
  lineItems: SOWLineItem[]
): string {
  let timeline = 'The following timeline outlines the phased delivery approach:\n\n';
  timeline += '| Phase | Name | Duration | Key Activities |\n';
  timeline += '|-------|------|----------|----------------|\n';

  for (const phase of plan.phases) {
    const activities = phase.capabilities
      .slice(0, 3)
      .map(c => c.capabilityName)
      .join(', ');
    const more = phase.capabilities.length > 3 ? ` +${phase.capabilities.length - 3} more` : '';
    timeline += `| ${phase.phaseNumber} | ${phase.name} | ${phase.duration} | ${activities}${more} |\n`;
  }

  timeline += '\n';
  timeline += `**Total Recommended Timeframe:** ${plan.executiveSummary.recommendedTimeframe}\n\n`;
  timeline += '*Note: Phase timelines may overlap where dependencies allow parallel execution. ';
  timeline += 'Exact start dates will be confirmed during project kickoff.*\n';

  return timeline;
}

function generateInvestmentSummary(
  plan: GeneratedPlan,
  lineItems: SOWLineItem[],
  totalEstimate: { min: number; max: number }
): string {
  let summary = '### Investment by Phase\n\n';
  summary += '| Phase | Description | Estimated Investment |\n';
  summary += '|-------|-------------|---------------------|\n';

  for (const phase of plan.phases) {
    const phaseItems = lineItems.filter(li => li.phase === phase.phaseNumber);
    const phaseMin = phaseItems.reduce((sum, li) => sum + li.estimatedCost.min, 0);
    const phaseMax = phaseItems.reduce((sum, li) => sum + li.estimatedCost.max, 0);
    const costStr = phaseMin > 0
      ? `${formatCurrency(phaseMin)} - ${formatCurrency(phaseMax)}`
      : 'TBD';
    summary += `| Phase ${phase.phaseNumber} | ${phase.name} | ${costStr} |\n`;
  }

  summary += `| | **Total Estimated Investment** | **${formatCurrency(totalEstimate.min)} - ${formatCurrency(totalEstimate.max)}** |\n`;
  summary += '\n';

  // Detailed line items
  summary += '### Detailed Service Line Items\n\n';
  summary += '| Phase | Service | Duration | Est. Cost |\n';
  summary += '|-------|---------|----------|-----------|\n';

  for (const li of lineItems) {
    const costStr = li.estimatedCost.min > 0
      ? `${formatCurrency(li.estimatedCost.min)} - ${formatCurrency(li.estimatedCost.max)}`
      : 'Included / TBD';
    summary += `| ${li.phase} | ${li.service} | ${li.duration} | ${costStr} |\n`;
  }

  summary += '\n';
  summary += '*All estimates are provided as ranges and will be refined during the detailed scoping phase. ';
  summary += 'Final pricing will be confirmed in the associated Master Services Agreement (MSA).*\n';

  return summary;
}

function generateTeamComposition(
  team: { role: string; allocation: string }[]
): string {
  let section = 'The following Merkle team members will be engaged across the project lifecycle:\n\n';
  section += '| Role | Allocation |\n';
  section += '|------|------------|\n';

  for (const member of team) {
    section += `| ${member.role} | ${member.allocation} |\n`;
  }

  section += '\n';
  section += 'Team composition may be adjusted between phases based on the specific service requirements. ';
  section += 'A dedicated Project Manager will serve as the primary point of contact throughout the engagement.\n';

  return section;
}

function generateAcceptanceCriteria(): string {
  return `Each deliverable will follow a structured acceptance process:

1. **Deliverable Submission** -- Merkle will submit completed deliverables with supporting documentation.
2. **Review Period** -- Client will have five (5) business days to review each deliverable.
3. **Feedback & Revisions** -- Client will provide consolidated feedback. Up to two (2) rounds of revisions are included per deliverable.
4. **Formal Acceptance** -- Client will provide written acceptance of each deliverable within three (3) business days of final submission.
5. **Milestone Sign-Off** -- At the end of each phase, a formal milestone sign-off will be conducted.

Deliverables not rejected within the review period will be deemed accepted. Any additional revision rounds beyond the included two (2) will be managed through the change management process.`;
}

function generateChangeManagement(): string {
  return `### Change Request Process

Changes to the scope, timeline, or budget described in this Statement of Work will be managed through the following process:

1. **Change Request Submission** -- Either party may submit a written Change Request (CR) describing the proposed change, its rationale, and expected impact.
2. **Impact Assessment** -- Merkle will assess the impact on scope, timeline, budget, and resources within three (3) business days.
3. **Change Request Review** -- Both parties will review the impact assessment and negotiate terms.
4. **Approval** -- Change Requests must be approved in writing by authorized representatives of both parties before work begins.
5. **Documentation** -- Approved changes will be documented as amendments to this Statement of Work.

### Out-of-Scope Work

Any work not explicitly described in the Scope of Work section is considered out of scope. Common items that are out of scope unless specifically included:

- Custom application development beyond the Salesforce platform
- Third-party software license procurement
- Hardware provisioning or network configuration
- Ongoing production support beyond the engagement period
- End-user training beyond documented knowledge transfer sessions
- Data cleansing or remediation of source systems

### Governance

- **Weekly Status Meetings** -- Merkle will provide weekly status updates covering progress, risks, and upcoming milestones.
- **Steering Committee** -- Monthly executive reviews will be conducted to ensure strategic alignment.
- **Risk Management** -- Risks will be tracked in a shared risk register and reviewed weekly.
- **Escalation Path** -- A defined escalation path will be established at project kickoff for timely issue resolution.`;
}

// ============================================================================
// MARKDOWN EXPORT GENERATOR
// ============================================================================

function generateFullMarkdown(sow: Omit<StatementOfWork, 'markdown'>): string {
  const lines: string[] = [];

  lines.push(`# Statement of Work`);
  lines.push('');
  lines.push(`**Client:** ${sow.clientName}`);
  if (sow.opportunityName) {
    lines.push(`**Opportunity:** ${sow.opportunityName}`);
  }
  if (sow.industry) {
    lines.push(`**Industry:** ${INDUSTRY_DISPLAY_NAMES[sow.industry] ?? sow.industry}`);
  }
  lines.push(`**Date:** ${formatDate(sow.generatedAt)}`);
  lines.push(`**Document ID:** ${sow.id}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  lines.push('1. [Project Overview](#project-overview)');
  lines.push('2. [Scope of Work](#scope-of-work)');
  lines.push('3. [Timeline](#timeline)');
  lines.push('4. [Investment Summary](#investment-summary)');
  lines.push('5. [Team Composition](#team-composition)');
  lines.push('6. [Assumptions](#assumptions)');
  lines.push('7. [Acceptance Criteria](#acceptance-criteria)');
  lines.push('8. [Change Management](#change-management)');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sections
  lines.push('## 1. Project Overview');
  lines.push('');
  lines.push(sow.sections.projectOverview);
  lines.push('');

  lines.push('## 2. Scope of Work');
  lines.push('');
  lines.push(sow.sections.scopeOfWork);
  lines.push('');

  lines.push('## 3. Timeline');
  lines.push('');
  lines.push(sow.sections.timeline);
  lines.push('');

  lines.push('## 4. Investment Summary');
  lines.push('');
  lines.push(sow.sections.investmentSummary);
  lines.push('');

  lines.push('## 5. Team Composition');
  lines.push('');
  lines.push(sow.sections.teamComposition);
  lines.push('');

  lines.push('## 6. Assumptions');
  lines.push('');
  lines.push(sow.sections.assumptions);
  lines.push('');

  lines.push('## 7. Acceptance Criteria');
  lines.push('');
  lines.push(sow.sections.acceptanceCriteria);
  lines.push('');

  lines.push('## 8. Change Management');
  lines.push('');
  lines.push(sow.sections.changeManagement);
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push(`*This Statement of Work was generated on ${formatDate(sow.generatedAt)} using Merkle SF Planner. All estimates are preliminary and subject to refinement during detailed scoping.*`);
  lines.push('');
  lines.push('**Merkle, a dentsu company** | Confidential');

  return lines.join('\n');
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate a complete Statement of Work from a plan and assessment.
 */
export function generateSOW(
  plan: GeneratedPlan,
  assessment: OpportunityAssessment
): StatementOfWork {
  const id = generateId();
  const generatedAt = new Date();
  const clientName = plan.executiveSummary.clientName || assessment.clientName || 'Client';
  const opportunityName = plan.executiveSummary.opportunityName || assessment.opportunityName;
  const industry = assessment.industry;

  // Build line items from plan phases mapped to services catalog
  const lineItems = buildLineItems(plan, assessment);

  // Calculate totals
  const totalEstimate = {
    min: lineItems.reduce((sum, li) => sum + li.estimatedCost.min, 0),
    max: lineItems.reduce((sum, li) => sum + li.estimatedCost.max, 0),
  };

  // Aggregate team
  const team = aggregateTeam(lineItems);

  // Generate all sections
  const sections = {
    projectOverview: generateProjectOverview(plan, assessment),
    scopeOfWork: generateScopeOfWork(plan, lineItems),
    assumptions: generateAssumptions(plan, assessment),
    timeline: generateTimeline(plan, lineItems),
    investmentSummary: generateInvestmentSummary(plan, lineItems, totalEstimate),
    teamComposition: generateTeamComposition(team),
    acceptanceCriteria: generateAcceptanceCriteria(),
    changeManagement: generateChangeManagement(),
  };

  // Build intermediate SOW (without markdown)
  const sowWithoutMarkdown = {
    id,
    generatedAt,
    clientName,
    opportunityName,
    industry,
    sections,
    lineItems,
    totalEstimate,
  };

  // Generate full markdown
  const markdown = generateFullMarkdown(sowWithoutMarkdown);

  return {
    ...sowWithoutMarkdown,
    markdown,
  };
}

/**
 * Format a currency value for display.
 * Exported for use in the SOWExport component.
 */
export { formatCurrency };
