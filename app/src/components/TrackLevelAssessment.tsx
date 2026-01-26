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
} from 'lucide-react';
import { getTrackById, getTrackLevel, getCapabilitiesForTrackLevel } from '../data/tracks';
import { getCapabilityById } from '../data/capabilities';
import type {
  TrackId,
  TrackLevel,
  TrackLevelStatus,
  TrackAssessmentQuestion,
  AssessmentAnswer,
} from '../types';

interface TrackLevelAssessmentProps {
  trackId: TrackId;
  level: TrackLevel;
  initialAnswers?: AssessmentAnswer[];
  initialStatus?: TrackLevelStatus;
  onComplete: (status: TrackLevelStatus, answers: AssessmentAnswer[]) => void;
  onCancel: () => void;
  onBack?: () => void;
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

const STATUS_OPTIONS: { value: TrackLevelStatus; label: string; description: string }[] = [
  {
    value: 'complete',
    label: 'Complete',
    description: 'This level is fully implemented and operational',
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    description: 'Currently working on implementing this level',
  },
  {
    value: 'not-started',
    label: 'Not Started',
    description: 'This is a priority for implementation',
  },
];

export function TrackLevelAssessment({
  trackId,
  level,
  initialAnswers = [],
  initialStatus = 'not-started',
  onComplete,
  onCancel,
  onBack,
}: TrackLevelAssessmentProps) {
  const [step, setStep] = useState<'status' | 'questions' | 'confirm'>('status');
  const [selectedStatus, setSelectedStatus] = useState<TrackLevelStatus>(initialStatus);
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
  const colors = TRACK_COLORS[trackId];
  const Icon = TRACK_ICONS[trackId];

  const questions = trackLevel?.assessmentQuestions || [];
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

  const handleComplete = () => {
    const formattedAnswers: AssessmentAnswer[] = Object.entries(answers).map(([id, value]) => ({
      questionId: id,
      value,
    }));
    onComplete(selectedStatus, formattedAnswers);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
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
            {['status', 'questions', 'confirm'].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === s
                      ? 'w-6 bg-white'
                      : idx < ['status', 'questions', 'confirm'].indexOf(step)
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
          {step === 'status' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  What is your current status for this level?
                </h3>
                <p className="text-sm text-slate-500">{trackLevel.description}</p>
              </div>

              <div className="space-y-3">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedStatus === option.value
                        ? `${colors.border} bg-slate-50`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedStatus === option.value ? (
                        <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{option.label}</div>
                        <div className="text-sm text-slate-500">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Capabilities in this level */}
              {capabilities.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Capabilities in this level:
                  </h4>
                  <div className="space-y-2">
                    {capabilities.map(
                      (cap) =>
                        cap && (
                          <div
                            key={cap.id}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <ArrowRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">{cap.shortName}</span>
                              <span className="text-slate-400 ml-1">— {cap.description.slice(0, 100)}...</span>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'questions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Tell us more</h3>
                <p className="text-sm text-slate-500">
                  These details help us understand your current situation and tailor recommendations.
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
                  <p className="text-sm mt-1">Click Continue to proceed.</p>
                </div>
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
                    Status: {STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.label}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.description}
                </p>
              </div>

              {Object.keys(answers).length > 0 && (
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
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => {
              if (step === 'status') {
                onBack ? onBack() : onCancel();
              } else if (step === 'questions') {
                setStep('status');
              } else {
                setStep('questions');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 'status' ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => {
              if (step === 'status') {
                setStep('questions');
              } else if (step === 'questions') {
                setStep('confirm');
              } else {
                handleComplete();
              }
            }}
            disabled={step === 'questions' && !allRequiredAnswered && questions.length > 0}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
              ${
                step === 'questions' && !allRequiredAnswered && questions.length > 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`
              }
            `}
          >
            {step === 'confirm' ? 'Save Assessment' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
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
