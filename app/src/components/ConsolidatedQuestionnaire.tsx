import { useState, useMemo } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Target,
  Clock,
  FileText,
  MessageSquare,
  Save,
} from 'lucide-react';
import type { Capability, AssessmentAnswer } from '../types';
import { useAssessment } from '../context/AssessmentContext';
import { ALL_CAPABILITIES } from '../data/capabilities';
import { MATURITY_STAGES } from '../data/constants';

interface ConsolidatedQuestionnaireProps {
  onClose: () => void;
  onComplete: () => void;
}

interface CapabilityQuestionGroup {
  capability: Capability;
  questions: Capability['assessmentQuestions'];
  relevance: 'immediately-relevant' | 'near-future';
}

export function ConsolidatedQuestionnaire({ onClose, onComplete }: ConsolidatedQuestionnaireProps) {
  const { assessment, saveCapabilityAssessment, getCapabilityAssessment } = useAssessment();

  // Get capabilities that need questions (immediately-relevant or near-future with questions)
  const capabilityGroups = useMemo<CapabilityQuestionGroup[]>(() => {
    if (!assessment) return [];
    const groups: CapabilityQuestionGroup[] = [];

    Object.entries(assessment.assessments).forEach(([capId, capAssessment]) => {
      if (
        capAssessment.relevance === 'immediately-relevant' || capAssessment.relevance === 'near-future'
      ) {
        const capability = ALL_CAPABILITIES.find((c) => c.id === capId);
        if (capability && capability.assessmentQuestions && capability.assessmentQuestions.length > 0) {
          groups.push({
            capability,
            questions: capability.assessmentQuestions,
            relevance: capAssessment.relevance as 'immediately-relevant' | 'near-future',
          });
        }
      }
    });

    // Sort by phase, then by maturity level
    return groups.sort((a, b) => {
      if (a.capability.phase !== b.capability.phase) {
        return a.capability.phase - b.capability.phase;
      }
      return a.capability.maturityLevel - b.capability.maturityLevel;
    });
  }, [assessment]);

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, string | string[]>>>(() => {
    // Initialize with existing answers
    const initial: Record<string, Record<string, string | string[]>> = {};
    capabilityGroups.forEach((group) => {
      const existing = getCapabilityAssessment(group.capability.id);
      if (existing?.answers) {
        initial[group.capability.id] = existing.answers.reduce(
          (acc, a) => ({ ...acc, [a.questionId]: a.value }),
          {}
        );
      } else {
        initial[group.capability.id] = {};
      }
    });
    return initial;
  });
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    capabilityGroups.forEach((group) => {
      const existing = getCapabilityAssessment(group.capability.id);
      initial[group.capability.id] = existing?.notes || '';
    });
    return initial;
  });
  const [savedGroups, setSavedGroups] = useState<Set<string>>(new Set());

  const currentGroup = capabilityGroups[currentGroupIndex];
  const totalGroups = capabilityGroups.length;
  const isLastGroup = currentGroupIndex === totalGroups - 1;
  const isFirstGroup = currentGroupIndex === 0;

  // No capabilities need questions
  if (capabilityGroups.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600 mb-6">
            No additional questions are needed based on your capability selections.
            You can proceed to view your assessment summary.
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors font-medium"
          >
            View Summary
          </button>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (capabilityId: string, questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [capabilityId]: {
        ...prev[capabilityId],
        [questionId]: value,
      },
    }));
    // Mark as unsaved if it was previously saved
    setSavedGroups((prev) => {
      const next = new Set(prev);
      next.delete(capabilityId);
      return next;
    });
  };

  const handleNotesChange = (capabilityId: string, value: string) => {
    setNotes((prev) => ({ ...prev, [capabilityId]: value }));
    setSavedGroups((prev) => {
      const next = new Set(prev);
      next.delete(capabilityId);
      return next;
    });
  };

  const saveCurrentGroup = () => {
    if (!currentGroup) return;

    const capId = currentGroup.capability.id;
    const existing = getCapabilityAssessment(capId);
    const formattedAnswers: AssessmentAnswer[] = Object.entries(answers[capId] || {}).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );

    saveCapabilityAssessment(
      capId,
      existing?.relevance || 'immediately-relevant',
      formattedAnswers,
      notes[capId] || ''
    );

    setSavedGroups((prev) => new Set(prev).add(capId));
  };

  const handleNext = () => {
    saveCurrentGroup();
    if (isLastGroup) {
      onComplete();
    } else {
      setCurrentGroupIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    saveCurrentGroup();
    setCurrentGroupIndex((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (isLastGroup) {
      onComplete();
    } else {
      setCurrentGroupIndex((prev) => prev + 1);
    }
  };

  const maturityStage = MATURITY_STAGES[currentGroup.capability.maturityLevel];
  const currentAnswers = answers[currentGroup.capability.id] || {};
  const currentNotes = notes[currentGroup.capability.id] || '';
  const isSaved = savedGroups.has(currentGroup.capability.id);

  // Count answered questions
  const answeredCount = Object.keys(currentAnswers).filter((k) => {
    const val = currentAnswers[k];
    return val && (typeof val === 'string' ? val.length > 0 : val.length > 0);
  }).length;
  const totalQuestions = currentGroup.questions?.length || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-merkle-teal">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Deep Dive Questions</h2>
                <p className="text-white/80 text-sm">
                  Phase 2: Detailed assessment for selected capabilities
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {capabilityGroups.map((group, idx) => (
              <button
                key={group.capability.id}
                onClick={() => {
                  saveCurrentGroup();
                  setCurrentGroupIndex(idx);
                }}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentGroupIndex
                    ? 'bg-white'
                    : idx < currentGroupIndex || savedGroups.has(group.capability.id)
                    ? 'bg-white/60'
                    : 'bg-white/30'
                }`}
                title={group.capability.shortName}
              />
            ))}
          </div>
        </div>

        {/* Capability Context */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: maturityStage.color }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{currentGroup.capability.name}</h3>
                <p className="text-sm text-gray-600">
                  Phase {currentGroup.capability.phase} &bull; {maturityStage.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  currentGroup.relevance === 'immediately-relevant'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {currentGroup.relevance === 'immediately-relevant' ? (
                  <>
                    <Target className="w-3 h-3" />
                    Immediate Priority
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    Near-Future
                  </>
                )}
              </span>
              <span className="text-sm text-gray-500">
                {currentGroupIndex + 1} of {totalGroups}
              </span>
            </div>
          </div>

          {/* Quick context */}
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {currentGroup.capability.description}
          </p>
        </div>

        {/* Questions Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Progress within this capability */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {answeredCount} of {totalQuestions} questions answered
              </span>
              {isSaved && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              )}
            </div>

            {/* Questions */}
            {currentGroup.questions?.map((q, qIdx) => (
              <div
                key={q.id}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <label className="block font-medium text-gray-900 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-merkle-blue/10 text-merkle-blue rounded-full text-sm mr-2">
                    {qIdx + 1}
                  </span>
                  {q.question}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {q.type === 'single-select' && q.options && (
                  <div className="space-y-2 ml-8">
                    {q.options.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          currentAnswers[q.id] === option
                            ? 'border-merkle-blue bg-merkle-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${currentGroup.capability.id}-${q.id}`}
                          value={option}
                          checked={currentAnswers[q.id] === option}
                          onChange={(e) =>
                            handleAnswerChange(currentGroup.capability.id, q.id, e.target.value)
                          }
                          className="w-4 h-4 text-merkle-blue"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'multi-select' && q.options && (
                  <div className="space-y-2 ml-8">
                    {q.options.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          ((currentAnswers[q.id] as string[]) || []).includes(option)
                            ? 'border-merkle-blue bg-merkle-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={((currentAnswers[q.id] as string[]) || []).includes(option)}
                          onChange={(e) => {
                            const current = (currentAnswers[q.id] as string[]) || [];
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter((v) => v !== option);
                            handleAnswerChange(currentGroup.capability.id, q.id, updated);
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
                    value={(currentAnswers[q.id] as string) || ''}
                    onChange={(e) =>
                      handleAnswerChange(currentGroup.capability.id, q.id, e.target.value)
                    }
                    placeholder={q.placeholder || 'Enter your response...'}
                    className="w-full ml-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent resize-none"
                    style={{ width: 'calc(100% - 2rem)' }}
                    rows={3}
                  />
                )}
              </div>
            ))}

            {/* Notes */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block font-medium text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                Additional Notes for {currentGroup.capability.shortName}
              </label>
              <textarea
                value={currentNotes}
                onChange={(e) => handleNotesChange(currentGroup.capability.id, e.target.value)}
                placeholder="Any specific context, requirements, constraints, or observations..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isFirstGroup && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Skip this capability
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={saveCurrentGroup}
                className="flex items-center gap-2 px-4 py-2 text-merkle-blue hover:bg-merkle-blue/10 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors font-medium"
              >
                {isLastGroup ? (
                  <>
                    Complete Assessment
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next Capability
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick nav to other capabilities */}
          {totalGroups > 3 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Jump to capability:</p>
              <div className="flex flex-wrap gap-2">
                {capabilityGroups.map((group, idx) => (
                  <button
                    key={group.capability.id}
                    onClick={() => {
                      saveCurrentGroup();
                      setCurrentGroupIndex(idx);
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      idx === currentGroupIndex
                        ? 'bg-merkle-blue text-white'
                        : savedGroups.has(group.capability.id)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {group.capability.shortName}
                    {savedGroups.has(group.capability.id) && (
                      <CheckCircle className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
