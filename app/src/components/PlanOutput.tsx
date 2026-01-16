import {
  X,
  FileText,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Zap,
  Download,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import type { GeneratedPlan, PlanPhase, PlannedCapability } from '../types';

interface PlanOutputProps {
  plan: GeneratedPlan;
  onClose: () => void;
}

export function PlanOutput({ plan, onClose }: PlanOutputProps) {
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'commercial' | 'risks'>('overview');

  const togglePhase = (phaseNum: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseNum)
        ? prev.filter((p) => p !== phaseNum)
        : [...prev, phaseNum]
    );
  };

  const handleExport = () => {
    // Create a simple text export for now
    const content = generateExportContent(plan);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.executiveSummary.clientName.replace(/\s+/g, '-')}-recommendation-plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Recommendation Plan</h2>
                <p className="text-white/80 text-sm">
                  {plan.executiveSummary.clientName}
                  {plan.executiveSummary.opportunityName && ` - ${plan.executiveSummary.opportunityName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
              { id: 'phases', label: 'Implementation Plan', icon: <Calendar className="w-4 h-4" /> },
              { id: 'commercial', label: 'Commercial', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'risks', label: 'Risks & Success', icon: <AlertTriangle className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-merkle-blue'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Executive Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-merkle-blue" />
                  Executive Summary
                </h3>
                <p className="text-gray-700 mb-4">{plan.executiveSummary.overallRecommendation}</p>
                <p className="text-gray-600 text-sm">{plan.executiveSummary.strategicRationale}</p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-merkle-blue">
                      {plan.executiveSummary.totalCapabilities}
                    </div>
                    <div className="text-sm text-gray-600">Total Capabilities</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-emerald-600">
                      {plan.executiveSummary.immediateCapabilities}
                    </div>
                    <div className="text-sm text-gray-600">Immediate Priority</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-amber-600">
                      {plan.executiveSummary.nearFutureCapabilities}
                    </div>
                    <div className="text-sm text-gray-600">Near-Future</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {plan.executiveSummary.recommendedTimeframe}
                    </div>
                    <div className="text-sm text-gray-600">Timeframe</div>
                  </div>
                </div>

                {plan.executiveSummary.estimatedTotalInvestment && (
                  <div className="mt-4 p-4 bg-merkle-blue/5 rounded-lg border border-merkle-blue/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Estimated Investment Range</span>
                      <span className="text-xl font-bold text-merkle-blue">
                        {plan.executiveSummary.estimatedTotalInvestment}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Wins */}
              {plan.quickWins.length > 0 && (
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    Quick Wins
                  </h3>
                  <div className="space-y-3">
                    {plan.quickWins.map((win, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-emerald-100">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">{win.capabilityName}</div>
                          <div className="text-sm text-gray-600">{win.description}</div>
                          <div className="text-sm text-emerald-600 font-medium mt-1">
                            Impact: {win.impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Foundation Requirements */}
              {plan.foundationRequirements.length > 0 && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Foundation Requirements
                  </h3>
                  <div className="space-y-2">
                    {plan.foundationRequirements.map((req, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                        <span className="font-medium text-gray-900">{req.requirement}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === 'met'
                              ? 'bg-emerald-100 text-emerald-700'
                              : req.status === 'partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {req.status === 'met' ? 'Ready' : req.status === 'partial' ? 'Partial' : 'Needed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-merkle-blue" />
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {plan.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-merkle-blue/10 text-merkle-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{step.step}</div>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            step.owner === 'merkle'
                              ? 'bg-merkle-blue/10 text-merkle-blue'
                              : step.owner === 'client'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {step.owner === 'joint' ? 'Joint' : step.owner === 'merkle' ? 'Merkle' : 'Client'}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.timeline}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'phases' && (
            <div className="p-6 space-y-4">
              {plan.phases.map((phase) => (
                <PhaseCard
                  key={phase.phaseNumber}
                  phase={phase}
                  isExpanded={expandedPhases.includes(phase.phaseNumber)}
                  onToggle={() => togglePhase(phase.phaseNumber)}
                />
              ))}

              {plan.phases.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No phases generated. Mark capabilities as relevant to build a plan.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'commercial' && (
            <div className="p-6 space-y-6">
              {/* Recommended Model */}
              <div className="bg-gradient-to-br from-merkle-blue/5 to-salesforce-blue/5 rounded-xl border border-merkle-blue/20 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-merkle-blue" />
                  Recommended Engagement Model
                </h3>
                <div className="text-xl font-bold text-merkle-blue mb-2">
                  {plan.commercialSummary.recommendedModel}
                </div>
                <p className="text-gray-600">{plan.commercialSummary.modelRationale}</p>
              </div>

              {/* Phased Investment */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Phased Investment
                </h3>
                <div className="space-y-3">
                  {plan.commercialSummary.phasedInvestment.map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Phase {inv.phase}: {inv.description}</div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{inv.estimateRange}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Models */}
              {plan.commercialSummary.alternativeModels && plan.commercialSummary.alternativeModels.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Alternative Models</h3>
                  <div className="space-y-3">
                    {plan.commercialSummary.alternativeModels.map((alt, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">{alt.model}</div>
                        <div className="text-sm text-gray-600 mt-1">{alt.description}</div>
                        <div className="text-sm text-amber-600 mt-2">
                          <strong>Trade-offs:</strong> {alt.tradeoffs}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="p-6 space-y-6">
              {/* Risks */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Risk Assessment
                </h3>
                <div className="space-y-3">
                  {plan.risks.map((risk, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-medium text-gray-900">{risk.risk}</div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            risk.likelihood === 'high'
                              ? 'bg-red-100 text-red-700'
                              : risk.likelihood === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {risk.likelihood} likelihood
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            risk.impact === 'high'
                              ? 'bg-red-100 text-red-700'
                              : risk.impact === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {risk.impact} impact
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Success Metrics
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-2 font-medium">Metric</th>
                        <th className="pb-2 font-medium">Baseline</th>
                        <th className="pb-2 font-medium">Target</th>
                        <th className="pb-2 font-medium">Timeframe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.successMetrics.map((metric, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3 font-medium text-gray-900">{metric.metric}</td>
                          <td className="py-3 text-gray-600">{metric.baseline || 'TBD'}</td>
                          <td className="py-3 text-emerald-600 font-medium">{metric.target}</td>
                          <td className="py-3 text-gray-600">{metric.timeframe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-500">
            Generated {plan.generatedAt.toLocaleDateString()} at {plan.generatedAt.toLocaleTimeString()}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface PhaseCardProps {
  phase: PlanPhase;
  isExpanded: boolean;
  onToggle: () => void;
}

function PhaseCard({ phase, isExpanded, onToggle }: PhaseCardProps) {
  const phaseColors: Record<number, string> = {
    1: 'from-blue-500 to-blue-600',
    2: 'from-orange-500 to-orange-600',
    3: 'from-emerald-500 to-emerald-600',
    4: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${phaseColors[phase.phaseNumber] || phaseColors[1]} flex items-center justify-center text-white font-bold`}>
            {phase.phaseNumber}
          </div>
          <div className="text-left">
            <div className="font-bold text-gray-900">{phase.name}</div>
            <div className="text-sm text-gray-500">
              {phase.capabilities.length} capabilities · {phase.duration}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {phase.totalEstimate && (
            <span className="text-sm font-medium text-gray-600">{phase.totalEstimate}</span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          <p className="text-gray-600">{phase.description}</p>

          {/* Capabilities */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Capabilities</h4>
            {phase.capabilities.map((cap) => (
              <CapabilityRow key={cap.capabilityId} capability={cap} />
            ))}
          </div>

          {/* Milestones */}
          {phase.keyMilestones.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Milestones</h4>
              <div className="flex flex-wrap gap-2">
                {phase.keyMilestones.map((milestone, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {milestone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {phase.dependencies.length > 0 && (
            <div className="text-sm text-gray-500">
              <strong>Dependencies:</strong> {phase.dependencies.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CapabilityRowProps {
  capability: PlannedCapability;
}

function CapabilityRow({ capability }: CapabilityRowProps) {
  const [showDetails, setShowDetails] = useState(false);

  const priorityColors = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-blue-100 text-blue-700',
    'nice-to-have': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className={`w-5 h-5 ${
            capability.relevance === 'immediately-relevant' ? 'text-emerald-500' : 'text-amber-500'
          }`} />
          <span className="font-medium text-gray-900">{capability.capabilityName}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[capability.priority]}`}>
            {capability.priority}
          </span>
        </div>
        {showDetails ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {showDetails && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          <div>
            <strong className="text-gray-700">Rationale:</strong>
            <p className="text-gray-600 mt-1">{capability.rationale}</p>
          </div>

          {capability.clientInputSummary && (
            <div>
              <strong className="text-gray-700">Client Context:</strong>
              <p className="text-gray-600 mt-1">{capability.clientInputSummary}</p>
            </div>
          )}

          {capability.sequencingNotes && (
            <div>
              <strong className="text-gray-700">Sequencing:</strong>
              <p className="text-gray-600 mt-1">{capability.sequencingNotes}</p>
            </div>
          )}

          {capability.recommendedOfferings.length > 0 && (
            <div>
              <strong className="text-gray-700">Recommended Offerings:</strong>
              <div className="mt-2 space-y-2">
                {capability.recommendedOfferings.map((offering, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded p-2 border border-gray-200">
                    <div>
                      <span className="font-medium text-gray-900">{offering.offeringName}</span>
                      <span className="text-gray-500 text-xs ml-2">({offering.offeringType})</span>
                    </div>
                    {offering.estimateRange && (
                      <span className="text-merkle-blue font-medium">{offering.estimateRange}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Generates markdown export content
 */
function generateExportContent(plan: GeneratedPlan): string {
  const lines: string[] = [];

  lines.push(`# Recommendation Plan: ${plan.executiveSummary.clientName}`);
  lines.push(`Generated: ${plan.generatedAt.toLocaleDateString()}`);
  lines.push('');

  lines.push('## Executive Summary');
  lines.push(plan.executiveSummary.overallRecommendation);
  lines.push('');
  lines.push(plan.executiveSummary.strategicRationale);
  lines.push('');

  lines.push('### Key Metrics');
  lines.push(`- Total Capabilities: ${plan.executiveSummary.totalCapabilities}`);
  lines.push(`- Immediate Priority: ${plan.executiveSummary.immediateCapabilities}`);
  lines.push(`- Near-Future: ${plan.executiveSummary.nearFutureCapabilities}`);
  lines.push(`- Recommended Timeframe: ${plan.executiveSummary.recommendedTimeframe}`);
  if (plan.executiveSummary.estimatedTotalInvestment) {
    lines.push(`- Estimated Investment: ${plan.executiveSummary.estimatedTotalInvestment}`);
  }
  lines.push('');

  lines.push('## Implementation Phases');
  plan.phases.forEach((phase) => {
    lines.push(`### Phase ${phase.phaseNumber}: ${phase.name}`);
    lines.push(`Duration: ${phase.duration}`);
    lines.push('');
    lines.push(phase.description);
    lines.push('');
    lines.push('**Capabilities:**');
    phase.capabilities.forEach((cap) => {
      lines.push(`- ${cap.capabilityName} (${cap.priority})`);
    });
    lines.push('');
  });

  lines.push('## Commercial Recommendation');
  lines.push(`**Model:** ${plan.commercialSummary.recommendedModel}`);
  lines.push('');
  lines.push(plan.commercialSummary.modelRationale);
  lines.push('');

  lines.push('### Phased Investment');
  plan.commercialSummary.phasedInvestment.forEach((inv) => {
    lines.push(`- Phase ${inv.phase} (${inv.description}): ${inv.estimateRange}`);
  });
  lines.push('');

  lines.push('## Next Steps');
  plan.nextSteps.forEach((step, i) => {
    lines.push(`${i + 1}. ${step.step} (${step.owner}, ${step.timeline})`);
  });
  lines.push('');

  lines.push('---');
  lines.push('*Generated by Merkle Salesforce Capability Planner*');

  return lines.join('\n');
}
