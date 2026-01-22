import { useState } from 'react';
import {
  X,
  Target,
  Clock,
  XCircle,
  ChevronRight,
  CheckCircle,
  CheckCircle2,
  CircleDot,
  Users,
  TrendingUp,
  Zap,
  Briefcase,
  Package,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  Star,
  Box,
  Link2,
  Share2,
  HelpCircle,
  FileText,
} from 'lucide-react';
import type { Capability, CapabilityRelevance } from '../types';
import { MATURITY_STAGES, PHASES } from '../data/constants';
import { useAssessment } from '../context/AssessmentContext';
import { INDUSTRY_CAPABILITY_CONTEXT, INDUSTRY_CAPABILITY_EMPHASIS, INDUSTRIES } from '../data/industries';
import { ChannelRoleGuide } from './ChannelRoleGuide';

// Capabilities that benefit from the Channel Role Guide
const CHANNEL_GUIDE_CAPABILITIES = [
  'cross-channel-activation',
  'baseline-subscriber-journeys',
  'customer-lifecycle-journeys',
  'enhance-planned-campaigns',
];

interface AssessmentModalProps {
  capability: Capability;
  onClose: () => void;
  onNext?: () => void;
  isAssessmentMode?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

const RELEVANCE_OPTIONS: {
  value: CapabilityRelevance;
  label: string;
  shortLabel: string;
  icon: typeof Target;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  hint: string;
}[] = [
  {
    value: 'complete',
    label: 'Complete',
    shortLabel: 'Complete',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    borderColor: 'border-blue-600',
    description: 'Already implemented and working',
    hint: 'Client has this capability in production',
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    shortLabel: 'In Progress',
    icon: CircleDot,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500 hover:bg-violet-600',
    borderColor: 'border-violet-500',
    description: 'Currently being implemented',
    hint: 'Active project or initiative underway',
  },
  {
    value: 'immediately-relevant',
    label: 'Immediately Relevant',
    shortLabel: 'Immediate',
    icon: Target,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500 hover:bg-emerald-600',
    borderColor: 'border-emerald-500',
    description: 'Ready to start now',
    hint: 'Priority for this engagement — we\'ll ask detailed questions later',
  },
  {
    value: 'near-future',
    label: 'Near-Future',
    shortLabel: 'Near-Future',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500 hover:bg-amber-600',
    borderColor: 'border-amber-500',
    description: 'Plan to start within 6-12 months',
    hint: 'On the roadmap — we\'ll ask detailed questions later',
  },
  {
    value: 'not-ready',
    label: 'Not Ready',
    shortLabel: 'Not Ready',
    icon: XCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-400 hover:bg-gray-500',
    borderColor: 'border-gray-400',
    description: 'Not a current priority',
    hint: 'Skip for now — can revisit later',
  },
];

export function AssessmentModal({
  capability,
  onClose,
  onNext,
  isAssessmentMode = true,
  currentIndex,
  totalCount,
}: AssessmentModalProps) {
  const { saveCapabilityAssessment, getCapabilityAssessment, selectedIndustry } = useAssessment();
  const existingAssessment = getCapabilityAssessment(capability.id);

  const [selectedRelevance, setSelectedRelevance] = useState<CapabilityRelevance>(
    existingAssessment?.relevance || 'not-assessed'
  );
  const [showChannelGuide, setShowChannelGuide] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<CapabilityRelevance | null>(null);

  const maturityStage = MATURITY_STAGES[capability.maturityLevel];
  const showChannelGuideButton = CHANNEL_GUIDE_CAPABILITIES.includes(capability.id);
  const phase = PHASES.find((p) => p.phase === capability.phase);
  const hasQuestions = (capability.assessmentQuestions || []).length > 0;

  // Get industry-specific context if available
  const industryContext = selectedIndustry
    ? INDUSTRY_CAPABILITY_CONTEXT[selectedIndustry]?.[capability.id]
    : null;
  const industryEmphasis = selectedIndustry
    ? INDUSTRY_CAPABILITY_EMPHASIS[selectedIndustry]
    : null;
  const industryInfo = selectedIndustry ? INDUSTRIES[selectedIndustry] : null;

  // Determine industry priority level for this capability
  const getIndustryPriority = () => {
    if (!industryEmphasis) return null;
    if (industryEmphasis.highPriority.includes(capability.id)) return 'high';
    if (industryEmphasis.mediumPriority.includes(capability.id)) return 'medium';
    if (industryEmphasis.lowPriority.includes(capability.id)) return 'low';
    return null;
  };
  const industryPriority = getIndustryPriority();

  const handleRelevanceSelect = (relevance: CapabilityRelevance) => {
    setSelectedRelevance(relevance);
    // Save immediately - questions will be asked in Phase 2
    saveCapabilityAssessment(capability.id, relevance, existingAssessment?.answers || [], existingAssessment?.notes || '');

    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Progress */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: maturityStage.color }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{capability.name}</h2>
              <p className="text-white/80 text-sm">
                Phase {capability.phase} &bull; {maturityStage.name}
                {currentIndex !== undefined && totalCount !== undefined && (
                  <span className="ml-2">
                    &bull; {currentIndex + 1} of {totalCount}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentIndex !== undefined && totalCount !== undefined && (
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-merkle-blue transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Industry Context Panel */}
            {industryInfo && (industryContext || industryPriority) && (
              <div className="mb-6 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-purple-900">
                        {industryInfo.shortName} Context
                      </span>
                      {industryPriority && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            industryPriority === 'high'
                              ? 'bg-emerald-100 text-emerald-700'
                              : industryPriority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Star className="w-3 h-3 inline mr-1" />
                          {industryPriority === 'high'
                            ? 'High Priority'
                            : industryPriority === 'medium'
                            ? 'Medium Priority'
                            : 'Lower Priority'}{' '}
                          for {industryInfo.shortName}
                        </span>
                      )}
                    </div>

                    {industryContext?.industryTip && (
                      <p className="text-sm text-purple-800">{industryContext.industryTip}</p>
                    )}

                    {industryContext?.commonUseCase && (
                      <div className="text-sm">
                        <span className="font-medium text-purple-900">Common Use Cases: </span>
                        <span className="text-purple-700">{industryContext.commonUseCase}</span>
                      </div>
                    )}

                    {industryContext?.regulatoryNote && (
                      <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{industryContext.regulatoryNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Summary Card */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{capability.description}</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-merkle-blue" />
                    Why It Matters
                  </h3>
                  <p className="text-gray-600 text-sm">{capability.clientValue.why}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Maturity Impact
                  </h3>
                  <p className="text-gray-600 text-sm">{capability.clientValue.howItAdvancesMaturity}</p>
                </div>

                {capability.keyCapabilities && capability.keyCapabilities.length > 0 && (
                  <div className="bg-salesforce-blue/5 border border-salesforce-blue/20 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-salesforce-blue mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Key Capabilities Unlocked
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {capability.keyCapabilities.slice(0, 6).map((cap: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-salesforce-blue/10 text-salesforce-blue rounded text-xs font-medium"
                        >
                          {cap}
                        </span>
                      ))}
                      {capability.keyCapabilities.length > 6 && (
                        <span className="px-2 py-0.5 text-salesforce-blue text-xs">
                          +{capability.keyCapabilities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {capability.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Prerequisites</h3>
                    <div className="space-y-1">
                      {capability.prerequisites.map((prereq, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-600">
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{prereq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Business Outcomes</h3>
                  <div className="space-y-1.5">
                    {capability.clientValue.businessOutcomes.slice(0, 4).map((outcome, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{outcome}</span>
                      </div>
                    ))}
                    {capability.clientValue.businessOutcomes.length > 4 && (
                      <span className="text-xs text-gray-500 ml-6">
                        +{capability.clientValue.businessOutcomes.length - 4} more outcomes
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Key KPIs</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {capability.clientValue.kpis.slice(0, 4).map((kpi, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>

                {capability.merkleOfferings && capability.merkleOfferings.length > 0 && (
                  <div className="bg-merkle-blue/5 border border-merkle-blue/20 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-merkle-blue mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Merkle Offerings
                    </h3>
                    <div className="space-y-2">
                      {capability.merkleOfferings.slice(0, 3).map((offering, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          {offering.sizing && (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-merkle-blue text-white text-xs font-bold rounded flex-shrink-0">
                              {offering.sizing}
                            </span>
                          )}
                          {!offering.sizing && (
                            <Package className="w-4 h-4 text-merkle-blue flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-900">{offering.name}</span>
                            <span className="text-xs text-merkle-blue ml-2 capitalize">
                              ({offering.type.replace('-', ' ')})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products & Features */}
                {capability.productsFeatures && capability.productsFeatures.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Box className="w-4 h-4 text-slate-600" />
                      Salesforce Products
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {capability.productsFeatures.slice(0, 5).map((product, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            product.category === 'platform'
                              ? 'bg-blue-100 text-blue-700'
                              : product.category === 'feature'
                              ? 'bg-purple-100 text-purple-700'
                              : product.category === 'integration'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Adjacencies */}
                {capability.adjacencies && capability.adjacencies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-indigo-600" />
                      Cross-Matrix Connections
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {capability.adjacencies.map((adj, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                        >
                          {adj.matrix.charAt(0).toUpperCase() + adj.matrix.slice(1)}: {adj.connectionPoint}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phase & Journey Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{capability.phase}</div>
                  <div className="text-xs text-gray-500">Phase</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{capability.maturityLevel}</div>
                  <div className="text-xs text-gray-500">Maturity Level</div>
                </div>
                <div
                  className={`p-3 rounded-lg text-center ${
                    capability.journeyType === 'above-the-line'
                      ? 'bg-cyan-50'
                      : 'bg-blue-50'
                  }`}
                >
                  <div className={`text-sm font-semibold ${
                    capability.journeyType === 'above-the-line'
                      ? 'text-cyan-700'
                      : 'text-blue-700'
                  }`}>
                    {capability.journeyType === 'above-the-line' ? 'Activation' : 'Management'}
                  </div>
                  <div className="text-xs text-gray-500">Journey Type</div>
                </div>
                <div
                  className="p-3 rounded-lg text-center"
                  style={{ backgroundColor: `${phase?.color}15` }}
                >
                  <div className="text-sm font-semibold text-gray-900">{phase?.name}</div>
                  <div className="text-xs text-gray-500">Phase Name</div>
                </div>
              </div>
            </div>

            {/* References */}
            {capability.references.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Reference Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {capability.references.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url || '#'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ref.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Channel Strategy Guide Button */}
            {showChannelGuideButton && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowChannelGuide(true)}
                  className="w-full p-3 bg-gradient-to-r from-merkle-blue/5 to-merkle-teal/5 border border-merkle-blue/20 rounded-xl hover:border-merkle-blue/40 hover:bg-merkle-blue/10 transition-all group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Share2 className="w-5 h-5 text-merkle-blue" />
                    <span className="font-medium text-gray-900">View Cross-Channel Strategy Guide</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-merkle-blue transition-colors" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Status Selection */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {isAssessmentMode ? (
            <div className="space-y-4">
              {/* Question indicator */}
              {hasQuestions && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Detailed questions will be asked after you complete all capability reviews</span>
                </div>
              )}

              {/* Status prompt */}
              <p className="text-sm text-gray-700 text-center font-medium">
                What is the client's current status for this capability?
              </p>

              {/* Status Buttons */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {RELEVANCE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRelevance === option.value && existingAssessment;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleRelevanceSelect(option.value)}
                      onMouseEnter={() => setHoveredOption(option.value)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-white transition-all text-sm ${option.bgColor} ${
                        isSelected ? 'ring-2 ring-offset-2 ' + option.borderColor : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Hover hint */}
              <div className="h-6 text-center">
                {hoveredOption && (
                  <p className="text-xs text-gray-500 animate-fade-in">
                    <HelpCircle className="w-3 h-3 inline mr-1" />
                    {RELEVANCE_OPTIONS.find(o => o.value === hoveredOption)?.hint}
                  </p>
                )}
                {!hoveredOption && existingAssessment && (
                  <p className="text-xs text-gray-500">
                    Currently: {RELEVANCE_OPTIONS.find(o => o.value === existingAssessment.relevance)?.label || existingAssessment.relevance}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Channel Role Guide Modal */}
      {showChannelGuide && (
        <ChannelRoleGuide onClose={() => setShowChannelGuide(false)} />
      )}
    </div>
  );
}
