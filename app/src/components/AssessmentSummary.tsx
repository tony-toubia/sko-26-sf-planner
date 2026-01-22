import { useMemo } from 'react';
import {
  CheckCircle,
  CheckCircle2,
  CircleDot,
  Clock,
  XCircle,
  FileText,
  Target,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Zap,
  Settings2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { getCapabilityById } from '../data/capabilities';

interface AssessmentSummaryProps {
  onGenerateQuickPlan: () => void;
  onGenerateDetailedPlan: () => void;
  onEditCapability: (capabilityId: string) => void;
  onStartDeepDive?: () => void;
}

export function AssessmentSummary({ onGenerateQuickPlan, onGenerateDetailedPlan, onEditCapability, onStartDeepDive }: AssessmentSummaryProps) {
  const { assessment, assessedCount, relevantCount, totalCapabilities, selectedIndustry } = useAssessment();

  const groupedAssessments = useMemo(() => {
    if (!assessment) return { complete: [], inProgress: [], immediate: [], nearFuture: [], notReady: [] };

    const grouped = {
      complete: [] as { id: string; name: string; notes?: string }[],
      inProgress: [] as { id: string; name: string; notes?: string }[],
      immediate: [] as { id: string; name: string; notes?: string }[],
      nearFuture: [] as { id: string; name: string; notes?: string }[],
      notReady: [] as { id: string; name: string }[],
    };

    Object.values(assessment.assessments).forEach((a) => {
      const cap = getCapabilityById(a.capabilityId);
      if (!cap) return;

      if (a.relevance === 'complete') {
        grouped.complete.push({ id: cap.id, name: cap.name, notes: a.notes });
      } else if (a.relevance === 'in-progress') {
        grouped.inProgress.push({ id: cap.id, name: cap.name, notes: a.notes });
      } else if (a.relevance === 'immediately-relevant') {
        grouped.immediate.push({ id: cap.id, name: cap.name, notes: a.notes });
      } else if (a.relevance === 'near-future') {
        grouped.nearFuture.push({ id: cap.id, name: cap.name, notes: a.notes });
      } else if (a.relevance === 'not-ready') {
        grouped.notReady.push({ id: cap.id, name: cap.name });
      }
    });

    return grouped;
  }, [assessment]);

  // Check if any capabilities marked for action have unanswered questions
  const capabilitiesNeedingQuestions = useMemo(() => {
    if (!assessment) return [];

    const needsQuestions: { id: string; name: string; questionCount: number }[] = [];

    Object.values(assessment.assessments).forEach((a) => {
      if (a.relevance === 'immediately-relevant' || a.relevance === 'near-future') {
        const cap = getCapabilityById(a.capabilityId);
        if (cap && cap.assessmentQuestions && cap.assessmentQuestions.length > 0) {
          // Check if questions are not yet answered
          const answeredCount = a.answers?.length || 0;
          if (answeredCount < cap.assessmentQuestions.length) {
            needsQuestions.push({
              id: cap.id,
              name: cap.shortName || cap.name,
              questionCount: cap.assessmentQuestions.length,
            });
          }
        }
      }
    });

    return needsQuestions;
  }, [assessment]);

  const hasUnansweredQuestions = capabilitiesNeedingQuestions.length > 0;
  const totalQuestionsNeeded = capabilitiesNeedingQuestions.reduce((sum, c) => sum + c.questionCount, 0);

  const progressPercentage = Math.round((assessedCount / totalCapabilities) * 100);
  const canGeneratePlan = relevantCount > 0;

  if (!assessment) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-white">Assessment Progress</h3>
              <p className="text-white/80 text-sm">{assessment.clientName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{assessedCount}/{totalCapabilities}</div>
            <div className="text-white/80 text-sm">capabilities assessed</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-5 divide-x divide-gray-200 border-b border-gray-200">
        <div className="p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{groupedAssessments.complete.length}</div>
          <div className="text-xs text-gray-600">Complete</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xl font-bold text-violet-600">{groupedAssessments.inProgress.length}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xl font-bold text-emerald-600">{groupedAssessments.immediate.length}</div>
          <div className="text-xs text-gray-600">Immediate</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{groupedAssessments.nearFuture.length}</div>
          <div className="text-xs text-gray-600">Near-Future</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xl font-bold text-gray-500">{groupedAssessments.notReady.length}</div>
          <div className="text-xs text-gray-600">Not Ready</div>
        </div>
      </div>

      {/* Capability lists */}
      <div className="p-6 space-y-6">
        {/* Complete */}
        {groupedAssessments.complete.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Complete</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupedAssessments.complete.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onEditCapability(item.id)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {groupedAssessments.inProgress.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CircleDot className="w-5 h-5 text-violet-600" />
              <h4 className="font-semibold text-gray-900">In Progress</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupedAssessments.inProgress.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onEditCapability(item.id)}
                  className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm font-medium hover:bg-violet-100 transition-colors flex items-center gap-1.5"
                >
                  <CircleDot className="w-3.5 h-3.5" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Immediate Priority */}
        {groupedAssessments.immediate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-gray-900">Immediate Priority</h4>
            </div>
            <div className="space-y-2">
              {groupedAssessments.immediate.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onEditCapability(item.id)}
                  className="w-full flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Near-Future */}
        {groupedAssessments.nearFuture.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-gray-900">Near-Future</h4>
            </div>
            <div className="space-y-2">
              {groupedAssessments.nearFuture.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onEditCapability(item.id)}
                  className="w-full flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Not Ready */}
        {groupedAssessments.notReady.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-gray-500" />
              <h4 className="font-semibold text-gray-900">Not Ready</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupedAssessments.notReady.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onEditCapability(item.id)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {assessedCount === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Click on capabilities in the matrix to start your assessment
            </p>
          </div>
        )}
      </div>

      {/* Deep Dive Questions CTA */}
      {hasUnansweredQuestions && onStartDeepDive && (
        <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-t border-violet-200">
          <button
            onClick={onStartDeepDive}
            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Answer Deep Dive Questions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-2 text-center">
            <p className="text-sm text-violet-700">
              {capabilitiesNeedingQuestions.length} {capabilitiesNeedingQuestions.length === 1 ? 'capability needs' : 'capabilities need'} more details ({totalQuestionsNeeded} questions total)
            </p>
            <p className="text-xs text-violet-600 mt-1">
              These questions help customize your implementation plan
            </p>
          </div>
        </div>
      )}

      {/* Generate Plan CTA */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onGenerateQuickPlan}
            disabled={!canGeneratePlan}
            className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              canGeneratePlan
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" />
            Quick Plan
          </button>
          <button
            onClick={onGenerateDetailedPlan}
            disabled={!canGeneratePlan}
            className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              canGeneratePlan
                ? 'bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Detailed Plan
          </button>
        </div>
        <p className="text-xs text-center text-gray-500">
          {!canGeneratePlan && assessedCount > 0 ? (
            'Mark at least one capability as relevant to generate a plan'
          ) : selectedIndustry ? (
            <span><Sparkles className="w-3 h-3 inline mr-1" />Quick uses industry defaults • Detailed adds budget & context</span>
          ) : (
            <span><Sparkles className="w-3 h-3 inline mr-1" />Quick generates instantly • Detailed adds budget & context</span>
          )}
        </p>
      </div>
    </div>
  );
}
