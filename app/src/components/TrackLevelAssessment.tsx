import { useState, useMemo } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
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
} from 'lucide-react';
import { getTrackById, getTrackLevel, getCapabilitiesForTrackLevel, getRequiredDependencies } from '../data/tracks';
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

const TRACK_ICONS: Record<TrackId, React.ElementType> = {
  'data-identity': Database,
  journeys: Route,
  'content-channels': Share2,
  intelligence: Brain,
};

const TRACK_COLORS: Record<TrackId, { gradient: string; text: string; border: string }> = {
  'data-identity': {
    gradient: 'from-blue-600 to-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  journeys: {
    gradient: 'from-violet-600 to-violet-700',
    text: 'text-violet-600',
    border: 'border-violet-200',
  },
  'content-channels': {
    gradient: 'from-emerald-600 to-emerald-700',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  intelligence: {
    gradient: 'from-amber-600 to-amber-700',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
};

// Status definitions that vary by context
interface StatusDefinition {
  value: TrackLevelStatus;
  label: string;
  description: string;
  criteria: string[];
}

const getStatusDefinitionsForLevel = (trackId: TrackId, level: TrackLevel): StatusDefinition[] => {
  // Base definitions that apply universally
  const baseDefinitions: StatusDefinition[] = [
    {
      value: 'complete',
      label: 'Complete',
      description: 'This level is fully implemented and operational',
      criteria: [],
    },
    {
      value: 'in-progress',
      label: 'In Progress',
      description: 'Currently working on or partially implemented',
      criteria: [],
    },
    {
      value: 'not-started',
      label: 'Not Started',
      description: 'Not yet implemented - an opportunity area',
      criteria: [],
    },
  ];

  // Specific criteria by track and level
  const criteriaMap: Record<string, { complete: string[]; inProgress: string[]; notStarted: string[] }> = {
    'data-identity-1': {
      complete: [
        'Data Cloud is deployed and operational',
        'Marketing Cloud Advanced is active',
        'Core data streams are connected',
        'Basic segmentation is working',
      ],
      inProgress: [
        'Data Cloud or MC Advanced is deployed but not fully configured',
        'Data streams are being established',
        'Migration from legacy platform in progress',
      ],
      notStarted: [
        'Still on MC Engagement (classic) or no SFMC',
        'Data Cloud not licensed or deployed',
        'Platform migration has not begun',
      ],
    },
    'data-identity-2': {
      complete: [
        'Purchase data flows into Data Cloud',
        'RFM segmentation is operational',
        'Behavioral triggers are configured',
        'Transaction-level data available in near real-time',
      ],
      inProgress: [
        'Some purchase data integrated but gaps remain',
        'Working on connecting additional sources',
        'Data quality improvements underway',
      ],
      notStarted: [
        'No purchase or transaction data in marketing platform',
        'Only subscriber/email data available',
        'Commerce/POS integration not started',
      ],
    },
    'data-identity-3': {
      complete: [
        'dentsu.Identity integrated with Data Cloud',
        'Identity resolution rules active and matching',
        'Profiles unified across systems (golden record)',
        'Third-party enrichment operational',
        'Consent management integrated',
      ],
      inProgress: [
        'dentsu.Identity integration underway',
        'Identity rules being configured',
        'Some profile unification in place',
      ],
      notStarted: [
        'No identity resolution solution in place',
        'Duplicate profiles across systems',
        'Cannot link online and offline identity',
        'No third-party enrichment strategy',
      ],
    },
    'journeys-1': {
      complete: [
        'Welcome series live and optimized',
        'Birthday/anniversary journeys active',
        'Re-engagement flows operational',
        'Journeys performing at or above benchmark',
      ],
      inProgress: [
        'Some journeys exist but need optimization',
        'Building out missing journeys',
        'Have welcome but missing birthday/re-engagement',
      ],
      notStarted: [
        'No automated subscriber journeys',
        'Only batch campaigns sent',
        'Welcome emails exist but not a true series',
      ],
    },
    'journeys-2': {
      complete: [
        'Cart abandonment journey live and recovering revenue',
        'Post-purchase flows operational',
        'Win-back journeys active',
        'Purchase triggers configured and firing',
      ],
      inProgress: [
        'Building cart abandon journey',
        'Some post-purchase automation exists',
        'Purchase data partially integrated',
      ],
      notStarted: [
        'No purchase-driven journeys',
        'Cart abandonment not implemented',
        'Purchase data not available for triggers',
      ],
    },
    'journeys-3': {
      complete: [
        'Custom predictive models deployed',
        'Next-best-action decisioning operational',
        'Propensity-based triggers active',
        'Brand-unique experiences in production',
      ],
      inProgress: [
        'Building first predictive use case',
        'Data science work in progress',
        'Calculated Insights being configured',
      ],
      notStarted: [
        'No predictive models in marketing',
        'Not using AI/ML for decisioning',
        'Standard journeys only - no custom insights',
      ],
    },
    'content-channels-1': {
      complete: [
        'Campaigns use Flow/Journey Builder',
        'Multi-touch sequences standard practice',
        'A/B testing embedded in process',
        'Campaign velocity meets business needs',
      ],
      inProgress: [
        'Migrating campaigns to Flow-based approach',
        'Some journeys, some batch sends',
        'Building campaign governance framework',
      ],
      notStarted: [
        'Primarily batch-and-blast sends',
        'Limited or no journey automation',
        'Campaigns created manually each time',
      ],
    },
    'content-channels-2': {
      complete: [
        'Dynamic content blocks in most emails',
        'Einstein Content Selection active',
        'SMS and/or Push channels operational',
        'Personalization scales without variant explosion',
      ],
      inProgress: [
        'Building dynamic content templates',
        'Configuring Einstein features',
        'Mobile channels being set up',
      ],
      notStarted: [
        'Static email content only',
        'No dynamic personalization',
        'Email-only channel (no mobile)',
      ],
    },
    'content-channels-3': {
      complete: [
        'Multi-channel journeys orchestrated',
        'Ad suppression/retargeting active',
        'Channel preference routing operational',
        'Unified cross-channel attribution',
      ],
      inProgress: [
        'Adding channels to existing journeys',
        'Advertising Studio being configured',
        'Building cross-channel logic',
      ],
      notStarted: [
        'Channels operate independently',
        'No coordinated cross-channel journeys',
        'Manual coordination between teams',
      ],
    },
    'intelligence-1': {
      complete: [
        'Core dashboards operational',
        'Email/journey metrics visible',
        'Regular reporting cadence established',
        'Team has self-service access',
      ],
      inProgress: [
        'Building core dashboards',
        'Implementing reporting framework',
        'Connecting data sources for analytics',
      ],
      notStarted: [
        'Only native SFMC reports',
        'No custom dashboards or visualization',
        'Limited/ad-hoc reporting',
      ],
    },
    'intelligence-2': {
      complete: [
        'Multi-touch attribution implemented',
        'Einstein insights actively used',
        'Self-service analytics adopted',
        'Cross-channel analytics unified',
      ],
      inProgress: [
        'Building attribution model',
        'Configuring Einstein features',
        'Expanding analytics access',
      ],
      notStarted: [
        'Last-touch attribution only',
        'Einstein not enabled or used',
        'Analytics siloed by channel',
      ],
    },
    'intelligence-3': {
      complete: [
        'CLV models in production',
        'Churn prediction operational',
        'Value-based segmentation active',
        'Models driving real business decisions',
      ],
      inProgress: [
        'Building first CLV model',
        'Data science engagement active',
        'Calculated Insights being developed',
      ],
      notStarted: [
        'No customer value scoring',
        'No predictive models',
        'Historical analytics only',
      ],
    },
  };

  const key = `${trackId}-${level}`;
  const criteria = criteriaMap[key];

  if (criteria) {
    return [
      { ...baseDefinitions[0], criteria: criteria.complete },
      { ...baseDefinitions[1], criteria: criteria.inProgress },
      { ...baseDefinitions[2], criteria: criteria.notStarted },
    ];
  }

  return baseDefinitions;
};

// Map journey level to iceberg highlight
const JOURNEY_LEVEL_TO_ICEBERG: Record<TrackLevel, 'subscriber' | 'lifecycle' | 'insight-driven'> = {
  1: 'subscriber',
  2: 'lifecycle',
  3: 'insight-driven',
};

type AssessmentStep = 'overview' | 'context' | 'status' | 'questions' | 'confirm';

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
  onBack,
  totalLevels = 12,
  currentLevelIndex = 0,
}: TrackLevelAssessmentProps) {
  // Get industry from assessment context
  const { assessment } = useAssessment();
  const industry = assessment?.industry || null;

  // All tracks start with overview, journeys adds a context step
  const isJourneysTrack = trackId === 'journeys';
  const [step, setStep] = useState<AssessmentStep>('overview');
  // Only pre-select if there's an existing status that's not 'not-started'
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
  const statusDefinitions = useMemo(
    () => getStatusDefinitionsForLevel(trackId, level),
    [trackId, level]
  );
  const requiredDeps = useMemo(() => getRequiredDependencies(trackId, level), [trackId, level]);
  const colors = TRACK_COLORS[trackId];
  const Icon = TRACK_ICONS[trackId];

  // Apply industry-specific question variants
  const questions = useMemo(
    () => applyIndustryVariants(trackLevel?.assessmentQuestions || [], industry),
    [trackLevel, industry]
  );
  const requiredQuestions = questions.filter((q) => q.required);
  const allRequiredAnswered = requiredQuestions.every((q) => {
    const answer = answers[q.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer && answer.length > 0;
  });

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelectToggle = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((o) => o !== option) };
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const handleComplete = (action: 'continue' | 'exit') => {
    // Default to 'not-started' if somehow no status was selected (shouldn't happen with UI validation)
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden ${
        (isJourneysTrack && step === 'context') || step === 'overview' ? 'max-w-4xl' : 'max-w-2xl'
      }`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm opacity-80">{track.name}</div>
                <h2 className="text-lg font-semibold">
                  Level {level}: {trackLevel.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mt-4">
            {(isJourneysTrack
              ? ['overview', 'context', 'status', 'questions', 'confirm']
              : ['overview', 'status', 'questions', 'confirm']
            ).map((s, idx, arr) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === s
                      ? 'w-6 bg-white'
                      : idx < arr.indexOf(step)
                        ? 'bg-white/80'
                        : 'bg-white/40'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview step - Educational content for all tracks */}
          {step === 'overview' && (
            <div className="space-y-5">
              {/* Level description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {trackLevel?.name}
                </h3>
                <p className="text-slate-600">{trackLevel?.description}</p>
              </div>

              {/* Prerequisites / Dependencies */}
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
                        <span>{dep.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Why this matters */}
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
                    <span className="text-sm font-medium text-slate-700">Expected ROI & Benchmarks</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {capabilityInfo.benchmarks.map((benchmark) => (
                      <div
                        key={benchmark.id}
                        className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg"
                      >
                        <div className="text-2xl font-bold text-emerald-700">{benchmark.value}</div>
                        <div className="text-xs font-medium text-emerald-800 mt-1">{benchmark.metric}</div>
                        <div className="text-xs text-emerald-600 mt-1">{benchmark.description}</div>
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

              {/* Key Capabilities */}
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

          {/* Context step - Journeys track only */}
          {step === 'context' && isJourneysTrack && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl">
                <Info className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-violet-900 mb-1">
                    Understanding Journey Maturity
                  </h3>
                  <p className="text-sm text-violet-700">
                    Journey maturity progresses through three levels, like an iceberg. The visible tip
                    represents table-stakes journeys everyone expects. Below the waterline are the
                    differentiated experiences that create competitive advantage.
                  </p>
                </div>
              </div>

              <JourneyMaturityIceberg
                highlightLevel={JOURNEY_LEVEL_TO_ICEBERG[level]}
              />

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">You are assessing:</span>{' '}
                  <span className={`font-medium ${colors.text}`}>
                    Level {level} - {trackLevel?.name}
                  </span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {trackLevel?.description}
                </p>
              </div>
            </div>
          )}

          {step === 'status' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  What is your current status for this level?
                </h3>
                <p className="text-sm text-slate-500">
                  Select the option that best describes your current state. Use the criteria below each option as a guide.
                </p>
              </div>

              {/* Current selection indicator */}
              {selectedStatus && (
                <div className={`p-3 rounded-lg border-2 ${
                  selectedStatus === 'complete'
                    ? 'bg-emerald-50 border-emerald-300'
                    : selectedStatus === 'in-progress'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-slate-50 border-slate-300'
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className={`w-4 h-4 ${
                      selectedStatus === 'complete'
                        ? 'text-emerald-600'
                        : selectedStatus === 'in-progress'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                    }`} />
                    <span className="font-medium">
                      Selected: {selectedStatus === 'complete' ? 'Complete' : selectedStatus === 'in-progress' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {statusDefinitions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value as TrackLevelStatus)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedStatus === option.value
                        ? option.value === 'complete'
                          ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
                          : option.value === 'in-progress'
                            ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200'
                            : 'border-slate-400 bg-slate-100 ring-2 ring-slate-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {selectedStatus === option.value ? (
                          <CheckCircle2 className={`w-5 h-5 ${
                            option.value === 'complete'
                              ? 'text-emerald-600'
                              : option.value === 'in-progress'
                                ? 'text-amber-600'
                                : 'text-slate-600'
                          }`} />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            selectedStatus === option.value ? 'text-slate-900' : 'text-slate-700'
                          }`}>{option.label}</span>
                          {option.value === 'complete' && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                              Operational
                            </span>
                          )}
                          {option.value === 'in-progress' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                              Building
                            </span>
                          )}
                          {option.value === 'not-started' && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                              Opportunity
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">{option.description}</div>
                        {option.criteria.length > 0 && (
                          <div className={`mt-3 p-3 rounded-lg ${
                            selectedStatus === option.value ? 'bg-white' : 'bg-slate-50'
                          }`}>
                            <div className="text-xs font-medium text-slate-500 mb-2">
                              This means:
                            </div>
                            <ul className="space-y-1.5">
                              {option.criteria.map((criterion, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-slate-600 flex items-start gap-2"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                    option.value === 'complete'
                                      ? 'bg-emerald-500'
                                      : option.value === 'in-progress'
                                        ? 'bg-amber-500'
                                        : 'bg-slate-400'
                                  }`} />
                                  <span>{criterion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'questions' && (
            <div className="space-y-6">
              {/* Different content based on status */}
              {selectedStatus === 'complete' ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Great! This level is operational.
                    </h3>
                    <p className="text-sm text-slate-500">
                      Since this capability is already in place, we don't need detailed discovery questions.
                      Feel free to add any notes about how it's performing or optimization opportunities.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-900">Status: Complete</span>
                    </div>
                    <p className="text-sm text-emerald-700">
                      {trackLevel?.name} is fully implemented and operational.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any observations about current performance, optimization opportunities, or areas that could be enhanced..."
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      rows={4}
                    />
                  </div>
                </>
              ) : selectedStatus === 'in-progress' ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Tell us about your progress
                    </h3>
                    <p className="text-sm text-slate-500">
                      Understanding where you are in the implementation helps us tailor recommendations.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-900">Status: In Progress</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      Currently building or partially implementing {trackLevel?.name}.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What's the current state? (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe what's been completed, what's in flight, any blockers or dependencies..."
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Show a subset of relevant questions for in-progress */}
                  {questions.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-500 mb-4">
                        Optional: Answer any questions that help clarify your current situation.
                      </p>
                      <div className="space-y-6">
                        {questions.slice(0, 2).map((question) => (
                          <QuestionInput
                            key={question.id}
                            question={{ ...question, required: false }}
                            value={answers[question.id]}
                            onChange={(value) => handleAnswerChange(question.id, value)}
                            onMultiToggle={(option) => handleMultiSelectToggle(question.id, option)}
                            colors={colors}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Tell us more</h3>
                    <p className="text-sm text-slate-500">
                      These details help us understand your current situation and recommend the right approach.
                    </p>
                  </div>

                  <div className="space-y-6">
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

                  {questions.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <p>No additional questions for this level.</p>
                    </div>
                  )}

                  {/* Optional notes for Not Started */}
                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any context about priorities, constraints, or considerations for this capability..."
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Assessment</h3>
                <p className="text-sm text-slate-500">
                  Review your responses for {track.name} Level {level}.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${colors.border} border bg-slate-50`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
                  <span className="font-medium text-slate-900">
                    Status: {statusDefinitions.find((o) => o.value === selectedStatus)?.label}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {statusDefinitions.find((o) => o.value === selectedStatus)?.description}
                </p>
              </div>

              {notes && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Notes:</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{notes}</p>
                </div>
              )}

              {Object.keys(answers).length > 0 && selectedStatus === 'not-started' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700">Your responses:</h4>
                  {questions.map((q) => {
                    const answer = answers[q.id];
                    if (!answer || (Array.isArray(answer) && answer.length === 0)) return null;
                    return (
                      <div key={q.id} className="text-sm">
                        <div className="text-slate-500 mb-1">{q.question}</div>
                        <div className="text-slate-900">
                          {Array.isArray(answer) ? answer.join(', ') : answer}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          {step === 'confirm' ? (
            // Show Save & Continue / Save & Exit on confirm step
            <div className="space-y-3">
              {/* Progress indicator */}
              <div className="text-center text-xs text-slate-500">
                Level {currentLevelIndex + 1} of {totalLevels} in assessment
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('questions')}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex-1 flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleComplete('exit')}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                  >
                    Save & Exit
                  </button>
                  <button
                    onClick={() => handleComplete('continue')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`}
                  >
                    Save & Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Standard navigation for other steps
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (step === 'overview') {
                    onBack ? onBack() : onCancel();
                  } else if (step === 'context') {
                    setStep('overview');
                  } else if (step === 'status') {
                    isJourneysTrack ? setStep('context') : setStep('overview');
                  } else if (step === 'questions') {
                    setStep('status');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
                {step === 'overview' ? 'Cancel' : 'Back'}
              </button>

              <button
                onClick={() => {
                  if (step === 'overview') {
                    isJourneysTrack ? setStep('context') : setStep('status');
                  } else if (step === 'context') {
                    setStep('status');
                  } else if (step === 'status') {
                    setStep('questions');
                  } else if (step === 'questions') {
                    setStep('confirm');
                  }
                }}
                disabled={
                  (step === 'status' && !selectedStatus) ||
                  (step === 'questions' && selectedStatus === 'not-started' && !allRequiredAnswered && questions.length > 0)
                }
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                  ${
                    (step === 'status' && !selectedStatus) ||
                    (step === 'questions' && selectedStatus === 'not-started' && !allRequiredAnswered && questions.length > 0)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`
                  }
                `}
              >
                {step === 'overview' ? 'Begin Assessment' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
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
  colors: { gradient: string; text: string; border: string };
}

function QuestionInput({ question, value, onChange, onMultiToggle, colors }: QuestionInputProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-900">
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {question.helpText && (
          <p className="text-xs text-slate-500 mt-1">{question.helpText}</p>
        )}
      </div>

      {question.type === 'single-select' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                value === option
                  ? `${colors.border} bg-slate-50 ${colors.text}`
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {value === option ? (
                  <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
                <span className={value === option ? 'font-medium' : ''}>{option}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {question.type === 'multi-select' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = Array.isArray(value) && value.includes(option);
            return (
              <button
                key={option}
                onClick={() => onMultiToggle(option)}
                className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                  isSelected
                    ? `${colors.border} bg-slate-50 ${colors.text}`
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
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
          rows={3}
        />
      )}
    </div>
  );
}
