import { useState } from 'react';
import {
  X,
  Target,
  Clock,
  XCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  CheckCircle2,
  CircleDot,
  MessageSquare,
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
} from 'lucide-react';
import type { Capability, CapabilityRelevance, AssessmentAnswer } from '../types';
import { MATURITY_STAGES, PHASES } from '../data/constants';
import { useAssessment } from '../context/AssessmentContext';
import { INDUSTRY_CAPABILITY_CONTEXT, INDUSTRY_CAPABILITY_EMPHASIS, INDUSTRIES } from '../data/industries';

interface AssessmentModalProps {
  capability: Capability;
  onClose: () => void;
  onNext?: () => void;
  isAssessmentMode?: boolean;
}

type Step = 'review' | 'questions' | 'complete';

const RELEVANCE_OPTIONS: {
  value: CapabilityRelevance;
  label: string;
  shortLabel: string;
  icon: typeof Target;
  color: string;
  bgColor: string;
  borderColor: string;
  description?: string;
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
  },
];

export function AssessmentModal({ capability, onClose, onNext, isAssessmentMode = true }: AssessmentModalProps) {
  const { saveCapabilityAssessment, getCapabilityAssessment, selectedIndustry } = useAssessment();
  const existingAssessment = getCapabilityAssessment(capability.id);

  const [step, setStep] = useState<Step>('review');
  const [selectedRelevance, setSelectedRelevance] = useState<CapabilityRelevance>(
    existingAssessment?.relevance || 'not-assessed'
  );
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    existingAssessment?.answers.reduce(
      (acc, a) => ({ ...acc, [a.questionId]: a.value }),
      {}
    ) || {}
  );
  const [notes, setNotes] = useState(existingAssessment?.notes || '');

  const maturityStage = MATURITY_STAGES[capability.maturityLevel];
  const phase = PHASES.find((p) => p.phase === capability.phase);
  const questions = capability.assessmentQuestions || [];
  const hasQuestions = questions.length > 0;

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

    // For complete, in-progress, and not-ready - save immediately and close
    if (relevance === 'complete' || relevance === 'in-progress' || relevance === 'not-ready') {
      saveCapabilityAssessment(capability.id, relevance, [], '');
      if (onNext) {
        onNext();
      } else {
        onClose();
      }
    } else if (hasQuestions) {
      // Move to questions step for immediately-relevant and near-future
      setStep('questions');
    } else {
      // No questions, save and move to complete
      saveCapabilityAssessment(capability.id, relevance, [], notes);
      setStep('complete');
    }
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitQuestions = () => {
    const formattedAnswers: AssessmentAnswer[] = Object.entries(answers).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );
    saveCapabilityAssessment(capability.id, selectedRelevance, formattedAnswers, notes);
    setStep('complete');
  };

  const handleComplete = () => {
    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
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
                Phase {capability.phase} &bull; Maturity Level {capability.maturityLevel} ({maturityStage.name})
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 'review' && (
            <div className="p-6">
              {/* Industry Context Panel - Show when industry is selected */}
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

              {/* Capability Details - Same as CapabilityModal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Client Value & Key Capabilities */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-merkle-blue" />
                      Why It Matters to the Client
                    </h3>
                    <p className="text-gray-600">{capability.clientValue.why}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      How It Advances Maturity
                    </h3>
                    <p className="text-gray-600">{capability.clientValue.howItAdvancesMaturity}</p>
                  </div>

                  {capability.keyCapabilities && capability.keyCapabilities.length > 0 && (
                    <div className="bg-salesforce-blue/5 border border-salesforce-blue/20 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-salesforce-blue mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Key Capabilities Unlocked
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {capability.keyCapabilities.map((cap: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-salesforce-blue/10 text-salesforce-blue rounded-full text-sm font-medium"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {capability.prerequisites.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                      <div className="space-y-1">
                        {capability.prerequisites.map((prereq, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-600">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Business Outcomes & Commercial Offerings */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Outcomes</h3>
                    <div className="space-y-2">
                      {capability.clientValue.businessOutcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key KPIs</h3>
                    <div className="flex flex-wrap gap-2">
                      {capability.clientValue.kpis.map((kpi, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {kpi}
                        </span>
                      ))}
                    </div>
                  </div>

                  {capability.merkleOfferings && capability.merkleOfferings.length > 0 && (
                    <div className="bg-merkle-blue/5 border border-merkle-blue/20 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-merkle-blue mb-3 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Merkle Commercial Offerings
                      </h3>
                      <div className="space-y-3">
                        {capability.merkleOfferings.map((offering, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {offering.sizing && (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-merkle-blue text-white text-xs font-bold rounded">
                                  {offering.sizing}
                                </span>
                              )}
                              {!offering.sizing && (
                                <Package className="w-5 h-5 text-merkle-blue" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">{offering.name}</h5>
                              <p className="text-gray-600 text-xs">{offering.description}</p>
                              <span className="text-xs text-merkle-blue capitalize">{offering.type.replace('-', ' ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {capability.merkleServices.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Merkle Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {capability.merkleServices.map((service, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-merkle-blue/10 text-merkle-blue rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Journey Type & Phase Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-xl ${
                      capability.journeyType === 'above-the-line'
                        ? 'bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {capability.journeyType === 'above-the-line'
                        ? 'Customer Data ACTIVATION'
                        : 'Customer Data MANAGEMENT'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {capability.journeyType === 'above-the-line'
                        ? 'Visible marketing tactics that drive acquisition, retention, and sustained customer engagement.'
                        : 'Foundational data management enabling deeper customer understanding through data enrichment and integration.'}
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: `${phase?.color}10`,
                      borderColor: `${phase?.color}40`,
                    }}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{phase?.name}</h4>
                    <p className="text-sm text-gray-600">{phase?.description}</p>
                  </div>
                </div>
              </div>

              {/* References */}
              {capability.references.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {capability.references.map((ref, i) => (
                      <a
                        key={i}
                        href={ref.url || '#'}
                        className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-gray-900">{ref.title}</h5>
                          <p className="text-sm text-gray-500">{ref.description}</p>
                          <span className="text-xs text-merkle-blue capitalize">{ref.source}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'questions' && (
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedRelevance === 'immediately-relevant'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {selectedRelevance === 'immediately-relevant'
                      ? 'Immediately Relevant'
                      : 'Near-Future'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tell us more about the client's situation
                </h3>
                <p className="text-gray-600 text-sm">
                  These details help us build a tailored recommendation.
                </p>
              </div>

              {questions.length > 0 ? (
                <div className="space-y-5">
                  {questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <label className="block font-medium text-gray-900">
                        {q.question}
                        {q.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {q.type === 'single-select' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-merkle-blue cursor-pointer transition-colors"
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={option}
                                checked={answers[q.id] === option}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                className="w-4 h-4 text-merkle-blue"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'multi-select' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-merkle-blue cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                value={option}
                                checked={(answers[q.id] as string[] || []).includes(option)}
                                onChange={(e) => {
                                  const current = (answers[q.id] as string[]) || [];
                                  const updated = e.target.checked
                                    ? [...current, option]
                                    : current.filter((v) => v !== option);
                                  handleAnswerChange(q.id, updated);
                                }}
                                className="w-4 h-4 text-merkle-blue rounded"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'text' && (
                        <textarea
                          value={(answers[q.id] as string) || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder={q.placeholder || 'Enter your response...'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent resize-none"
                          rows={3}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No additional questions for this capability.</p>
                </div>
              )}

              {/* Notes field */}
              <div className="space-y-2">
                <label className="block font-medium text-gray-900">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific context, requirements, or concerns..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Assessment Saved</h3>
                <p className="text-gray-600">
                  {capability.name} has been marked as{' '}
                  <span className="font-medium">
                    {selectedRelevance === 'immediately-relevant'
                      ? 'Immediately Relevant'
                      : 'Near-Future'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Assessment Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {step === 'review' && isAssessmentMode && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center font-medium">
                What is the status of this capability for your client?
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {RELEVANCE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRelevance === option.value && existingAssessment;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleRelevanceSelect(option.value)}
                      title={option.description}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-white transition-all text-sm ${option.bgColor} ${
                        isSelected ? 'ring-2 ring-offset-2 ' + option.borderColor : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.shortLabel}
                    </button>
                  );
                })}
              </div>
              {existingAssessment && (
                <p className="text-xs text-gray-500 text-center">
                  Currently marked as: {RELEVANCE_OPTIONS.find(o => o.value === existingAssessment.relevance)?.label || existingAssessment.relevance}
                </p>
              )}
            </div>
          )}

          {step === 'review' && !isAssessmentMode && (
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {step === 'questions' && (
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep('review')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Details
              </button>
              <button
                onClick={handleSubmitQuestions}
                className="px-6 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors flex items-center gap-2"
              >
                Save Assessment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'complete' && (
            <div className="flex justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                {onNext ? 'Next Capability' : 'Done'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
