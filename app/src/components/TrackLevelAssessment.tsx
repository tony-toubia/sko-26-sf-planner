import { useState, useMemo } from 'react';
import {
  X,
  ChevronRight,
  CheckCircle2,
  Circle,
  Database,
  Route,
  Share2,
  Brain,
  ArrowRight,
  AlertTriangle,
  Info,
  Target,
  TrendingUp,
  Zap,
  Award,
  Clock,
  AlertCircle,
  ClipboardList,
  BookOpen,
  Building2,
  Users,
  Gift,
  BarChart3,
} from 'lucide-react';
import { getTrackById, getTrackLevel, getCapabilitiesForTrackLevel, getRequiredDependencies } from '../data/allTracks';
import { getCapabilityById } from '../data/capabilities';
import { getBenchmarksForCapability } from '../data/reference';
import { JourneyMaturityIceberg } from './JourneyMaturityIceberg';
import { useAssessment } from '../context/AssessmentContext';
import type {
  TrackId,
  TrackLevel,
  TrackLevelStatus,
  TrackAssessmentQuestion,
  AssessmentAnswer,
  Capability,
  IndustryType,
} from '../types';

// Helper to apply industry variants to questions
function applyIndustryVariants(
  questions: TrackAssessmentQuestion[],
  industry: string | null
): TrackAssessmentQuestion[] {
  if (!industry) return questions;

  const industryId = industry as IndustryType;

  return questions.map((q) => {
    if (!q.industryVariants || !q.industryVariants[industryId]) {
      return q;
    }

    const variant = q.industryVariants[industryId];
    return {
      ...q,
      question: variant.question || q.question,
      options: variant.options || q.options,
      helpText: variant.helpText || q.helpText,
    };
  });
}

interface TrackLevelAssessmentProps {
  trackId: TrackId;
  level: TrackLevel;
  initialAnswers?: AssessmentAnswer[];
  initialStatus?: TrackLevelStatus;
  onComplete: (status: TrackLevelStatus, answers: AssessmentAnswer[], action: 'continue' | 'exit') => void;
  onCancel: () => void;
  onBack?: () => void;
  totalLevels?: number;
  currentLevelIndex?: number;
}

const TRACK_ICONS: Record<string, React.ElementType> = {
  // M&P tracks
  'data-identity': Database,
  journeys: Route,
  'content-channels': Share2,
  intelligence: Brain,
  // Loyalty tracks
  'program-foundation': Building2,
  'member-engagement': Users,
  'rewards-offers': Gift,
  'loyalty-intelligence': BarChart3,
};

const DEFAULT_COLORS = {
  gradient: 'from-slate-600 to-slate-700',
  text: 'text-slate-600',
  border: 'border-slate-200',
  bg: 'bg-slate-600',
  lightBg: 'bg-slate-50',
};

const TRACK_COLORS: Record<string, { gradient: string; text: string; border: string; bg: string; lightBg: string }> = {
  // M&P tracks
  'data-identity': {
    gradient: 'from-blue-600 to-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-200',
    bg: 'bg-blue-600',
    lightBg: 'bg-blue-50',
  },
  journeys: {
    gradient: 'from-violet-600 to-violet-700',
    text: 'text-violet-600',
    border: 'border-violet-200',
    bg: 'bg-violet-600',
    lightBg: 'bg-violet-50',
  },
  'content-channels': {
    gradient: 'from-emerald-600 to-emerald-700',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-600',
    lightBg: 'bg-emerald-50',
  },
  intelligence: {
    gradient: 'from-amber-600 to-amber-700',
    text: 'text-amber-600',
    border: 'border-amber-200',
    bg: 'bg-amber-600',
    lightBg: 'bg-amber-50',
  },
  // Loyalty tracks
  'program-foundation': {
    gradient: 'from-blue-600 to-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-200',
    bg: 'bg-blue-600',
    lightBg: 'bg-blue-50',
  },
  'member-engagement': {
    gradient: 'from-violet-600 to-violet-700',
    text: 'text-violet-600',
    border: 'border-violet-200',
    bg: 'bg-violet-600',
    lightBg: 'bg-violet-50',
  },
  'rewards-offers': {
    gradient: 'from-emerald-600 to-emerald-700',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-600',
    lightBg: 'bg-emerald-50',
  },
  'loyalty-intelligence': {
    gradient: 'from-amber-600 to-amber-700',
    text: 'text-amber-600',
    border: 'border-amber-200',
    bg: 'bg-amber-600',
    lightBg: 'bg-amber-50',
  },
};

// Status option type
interface StatusOption {
  value: TrackLevelStatus;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'complete',
    label: 'Complete',
    shortLabel: 'Complete',
    description: 'Fully implemented and operational',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    shortLabel: 'Building',
    description: 'Currently implementing or partially done',
    icon: Clock,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
  },
  {
    value: 'not-started',
    label: 'Not Started',
    shortLabel: 'Gap',
    description: 'Not yet implemented - opportunity area',
    icon: Circle,
    colorClass: 'text-slate-500',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-300',
  },
];

// Map journey level to iceberg highlight
const JOURNEY_LEVEL_TO_ICEBERG: Record<TrackLevel, 'subscriber' | 'lifecycle' | 'insight-driven'> = {
  1: 'subscriber',
  2: 'lifecycle',
  3: 'insight-driven',
};

type ActiveTab = 'assess' | 'details';

// Helper to get aggregated capability info for a level
function getCapabilityInfo(capabilities: (Capability | undefined)[]) {
  const validCaps = capabilities.filter((c): c is Capability => c !== undefined);
  if (validCaps.length === 0) return null;

  // Aggregate business outcomes and KPIs from all capabilities
  const businessOutcomes = validCaps.flatMap((c) => c.clientValue?.businessOutcomes || []);
  const kpis = validCaps.flatMap((c) => c.clientValue?.kpis || []);
  const keyCapabilities = validCaps.flatMap((c) => c.keyCapabilities || []);

  // Get the first capability's "why" as the main rationale
  const mainCap = validCaps[0];
  const why = mainCap.clientValue?.why || '';
  const howItAdvancesMaturity = mainCap.clientValue?.howItAdvancesMaturity || '';

  // Get ROI benchmarks for all capabilities
  const benchmarks = validCaps.flatMap((c) => getBenchmarksForCapability(c.id));

  return {
    capabilities: validCaps,
    why,
    howItAdvancesMaturity,
    businessOutcomes: [...new Set(businessOutcomes)].slice(0, 5), // Dedupe and limit
    kpis: [...new Set(kpis)].slice(0, 5),
    keyCapabilities: [...new Set(keyCapabilities)].slice(0, 6),
    benchmarks: benchmarks.slice(0, 4), // Limit to 4 most relevant
  };
}

export function TrackLevelAssessment({
  trackId,
  level,
  initialAnswers = [],
  initialStatus = 'not-started',
  onComplete,
  onCancel,
  totalLevels = 12,
  currentLevelIndex = 0,
}: TrackLevelAssessmentProps) {
  // Get industry from assessment context
  const { assessment } = useAssessment();
  const industry = assessment?.industry || null;

  const isJourneysTrack = trackId === 'journeys';

  // Single-screen state with tabs
  const [activeTab, setActiveTab] = useState<ActiveTab>('assess');
  const [selectedStatus, setSelectedStatus] = useState<TrackLevelStatus | null>(
    initialStatus !== 'not-started' ? initialStatus : null
  );
  const [notes, setNotes] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    const initial: Record<string, string | string[]> = {};
    for (const answer of initialAnswers) {
      initial[answer.questionId] = answer.value as string | string[];
    }
    return initial;
  });

  const track = useMemo(() => getTrackById(trackId), [trackId]);
  const trackLevel = useMemo(() => getTrackLevel(trackId, level), [trackId, level]);
  const capabilities = useMemo(
    () => getCapabilitiesForTrackLevel(trackId, level).map((id) => getCapabilityById(id)),
    [trackId, level]
  );
  const capabilityInfo = useMemo(() => getCapabilityInfo(capabilities), [capabilities]);
  const requiredDeps = useMemo(() => getRequiredDependencies(trackId, level), [trackId, level]);
  const colors = TRACK_COLORS[trackId] || DEFAULT_COLORS;
  const Icon = TRACK_ICONS[trackId] || Target;

  // Apply industry-specific question variants
  const questions = useMemo(
    () => applyIndustryVariants(trackLevel?.assessmentQuestions || [], industry),
    [trackLevel, industry]
  );

  // Get industry-specific description
  const levelDescription = useMemo(() => {
    if (!trackLevel) return '';
    if (industry && trackLevel.descriptionVariants?.[industry as IndustryType]) {
      return trackLevel.descriptionVariants[industry as IndustryType];
    }
    return trackLevel.description;
  }, [trackLevel, industry]);

  // Show questions for "not-started" (Gap) and "in-progress" (Building) statuses
  const shouldShowQuestions = (selectedStatus === 'not-started' || selectedStatus === 'in-progress') && questions.length > 0;
  const requiredQuestions = questions.filter((q) => q.required);
  const allRequiredAnswered = requiredQuestions.every((q) => {
    const answer = answers[q.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer && answer.length > 0;
  });

  // Can save if status is selected AND (no questions OR all required answered)
  const canSave = selectedStatus !== null && (!shouldShowQuestions || allRequiredAnswered);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Options that negate all others when selected
  // Covers: "None of these", "No significant blockers", "No partner program planned",
  //         "Not applicable", "Not a priority", "Not sure yet", "Not yet defined", etc.
  const isExclusiveOption = (option: string) =>
    /^None/i.test(option) || /^No /i.test(option) || /^Not /i.test(option);

  const handleMultiSelectToggle = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      // Deselecting — just remove it
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((o) => o !== option) };
      }
      // Selecting an exclusive option → clear everything else
      if (isExclusiveOption(option)) {
        return { ...prev, [questionId]: [option] };
      }
      // Selecting a normal option → remove any exclusive options that were checked
      const withoutExclusive = current.filter((o) => !isExclusiveOption(o));
      return { ...prev, [questionId]: [...withoutExclusive, option] };
    });
  };

  const handleSave = (action: 'continue' | 'exit') => {
    if (!canSave) return;

    const finalStatus = selectedStatus || 'not-started';
    const formattedAnswers: AssessmentAnswer[] = Object.entries(answers).map(([id, value]) => ({
      questionId: id,
      value,
    }));
    onComplete(finalStatus, formattedAnswers, action);
  };

  if (!track || !trackLevel) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600">Track or level not found</p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className={`bg-gradient-to-r ${colors.gradient} px-4 sm:px-6 py-3 sm:py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg flex-shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm opacity-80">{track.name}</div>
                <h2 className="text-base sm:text-lg font-semibold truncate">
                  Level {level}: {trackLevel.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-3">
            <button
              onClick={() => setActiveTab('assess')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'assess'
                  ? 'bg-white text-slate-900'
                  : 'text-white/80 hover:bg-white/20'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Assess</span>
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-white text-slate-900'
                  : 'text-white/80 hover:bg-white/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Assessment Tab */}
          {activeTab === 'assess' && (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Quick Description */}
              <p className="text-sm text-slate-600">{levelDescription}</p>

              {/* Prerequisites Alert (if any) */}
              {requiredDeps.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-amber-800">Prerequisite: </span>
                      <span className="text-amber-700">{(requiredDeps[0] as any).description}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Selection - Compact Horizontal */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  What's your current status?
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {STATUS_OPTIONS.map((option) => {
                    const isSelected = selectedStatus === option.value;
                    const StatusIcon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? `${option.borderClass} ${option.bgClass} ring-2 ring-offset-1 ${option.borderClass.replace('border', 'ring')}`
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <StatusIcon
                          className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 ${
                            isSelected ? option.colorClass : 'text-slate-400'
                          }`}
                        />
                        <div className={`text-sm font-medium ${isSelected ? option.colorClass : 'text-slate-700'}`}>
                          {option.shortLabel}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
                          {option.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Content Based on Status */}
              {selectedStatus && (
                <div className="space-y-4 pt-2">
                  {/* Status-specific message */}
                  {selectedStatus === 'complete' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">
                          Great! This level is operational.
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedStatus === 'in-progress' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                          Currently building this capability.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Questions for Not Started */}
                  {shouldShowQuestions && (
                    <div className="space-y-4">
                      <div className="text-sm text-slate-600">
                        A few questions to understand your situation:
                      </div>
                      {questions.map((question) => (
                        <QuestionInput
                          key={question.id}
                          question={question}
                          value={answers[question.id]}
                          onChange={(value) => handleAnswerChange(question.id, value)}
                          onMultiToggle={(option) => handleMultiSelectToggle(question.id, option)}
                          colors={colors}
                        />
                      ))}
                    </div>
                  )}

                  {/* Notes - Always Show */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        selectedStatus === 'complete'
                          ? 'Any observations about current performance or optimization opportunities...'
                          : selectedStatus === 'in-progress'
                            ? 'What\'s been completed? Any blockers or dependencies...'
                            : 'Any context about priorities, constraints, or considerations...'
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Level Description */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  About This Level
                </h3>
                <p className="text-sm text-slate-600">{levelDescription}</p>
              </div>

              {/* Journey Iceberg for Journeys Track */}
              {isJourneysTrack && (
                <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-violet-900">Journey Maturity Model</h4>
                      <p className="text-sm text-violet-700 mt-1">
                        Journey maturity progresses like an iceberg - from table-stakes above the waterline to differentiating experiences below.
                      </p>
                    </div>
                  </div>
                  <JourneyMaturityIceberg highlightLevel={JOURNEY_LEVEL_TO_ICEBERG[level]} />
                </div>
              )}

              {/* Prerequisites */}
              {requiredDeps.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Prerequisites</span>
                  </div>
                  <ul className="space-y-1">
                    {requiredDeps.map((dep, idx) => (
                      <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                        <span>{(dep as any).description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Why This Matters */}
              {capabilityInfo?.why && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Why This Matters</span>
                  </div>
                  <p className="text-sm text-slate-600">{capabilityInfo.why}</p>
                </div>
              )}

              {/* ROI Benchmarks */}
              {capabilityInfo?.benchmarks && capabilityInfo.benchmarks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Expected ROI</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {capabilityInfo.benchmarks.map((benchmark) => (
                      <div
                        key={benchmark.id}
                        className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg"
                      >
                        <div className="text-xl sm:text-2xl font-bold text-emerald-700">{benchmark.value}</div>
                        <div className="text-xs font-medium text-emerald-800 mt-1">{benchmark.metric}</div>
                        <div className="text-[10px] sm:text-xs text-emerald-600 mt-1">{benchmark.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Outcomes */}
              {capabilityInfo?.businessOutcomes && capabilityInfo.businessOutcomes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">Business Outcomes</span>
                  </div>
                  <div className="space-y-2">
                    {capabilityInfo.businessOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <Zap className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What This Enables */}
              {capabilityInfo?.keyCapabilities && capabilityInfo.keyCapabilities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">What This Enables</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {capabilityInfo.keyCapabilities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Metrics */}
              {capabilityInfo?.kpis && capabilityInfo.kpis.length > 0 && (
                <div className="p-4 bg-slate-800 rounded-xl text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-medium">Success Metrics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {capabilityInfo.kpis.map((kpi, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                        <span>{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50">
          <div className="flex items-center justify-between gap-3">
            {/* Progress indicator */}
            <div className="text-xs text-slate-500 hidden sm:block">
              Level {currentLevelIndex + 1} of {totalLevels}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleSave('exit')}
                disabled={!canSave}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  canSave
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save & Exit
              </button>
              <button
                onClick={() => handleSave('continue')}
                disabled={!canSave}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  canSave
                    ? `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Save &</span> Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Validation message */}
          {selectedStatus === null && (
            <div className="mt-2 text-xs text-slate-500 text-center sm:text-right">
              Select a status to continue
            </div>
          )}
          {(selectedStatus === 'not-started' || selectedStatus === 'in-progress') && !allRequiredAnswered && questions.length > 0 && (
            <div className="mt-2 text-xs text-amber-600 text-center sm:text-right">
              Please answer required questions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Question Input Component
interface QuestionInputProps {
  question: TrackAssessmentQuestion;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  onMultiToggle: (option: string) => void;
  colors: { gradient: string; text: string; border: string; bg: string; lightBg: string };
}

function QuestionInput({ question, value, onChange, onMultiToggle, colors }: QuestionInputProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-slate-900">
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {question.helpText && (
          <p className="text-xs text-slate-500 mt-0.5">{question.helpText}</p>
        )}
      </div>

      {question.type === 'single-select' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`p-2.5 rounded-lg border text-left text-sm transition-all ${
                value === option
                  ? `${colors.border} ${colors.lightBg} ${colors.text}`
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {value === option ? (
                  <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
                <span className={value === option ? 'font-medium' : ''}>{option}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {question.type === 'multi-select' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((option) => {
            const isSelected = Array.isArray(value) && value.includes(option);
            return (
              <button
                key={option}
                onClick={() => onMultiToggle(option)}
                className={`p-2.5 rounded-lg border text-left text-sm transition-all ${
                  isSelected
                    ? `${colors.border} ${colors.lightBg} ${colors.text}`
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      isSelected ? `${colors.border} bg-white` : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className={`w-3 h-3 ${colors.text}`} />}
                  </div>
                  <span className={isSelected ? 'font-medium' : ''}>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'text' && (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your response..."
          className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
          rows={2}
        />
      )}
    </div>
  );
}
