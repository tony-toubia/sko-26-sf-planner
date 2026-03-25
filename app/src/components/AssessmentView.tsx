import { useState, useEffect } from 'react';
import { LayoutGrid, Route, Sparkles, Loader2, AlertCircle, X, Pencil } from 'lucide-react';

const THINKING_STEPS = [
  'Reviewing your track assessment answers...',
  'Analyzing maturity across all dimensions...',
  'Mapping industry-specific benchmarks...',
  'Identifying high-impact capabilities...',
  'Sequencing implementation phases...',
  'Calculating investment ranges...',
  'Drafting your personalized roadmap...',
];
import { TrackAssessmentView } from './TrackAssessmentView';
import { MaturityMatrix } from './MaturityMatrix';
import { GlobalInputsModal } from './GlobalInputsModal';
import { useAssessment } from '../context/AssessmentContext';
import type { GlobalAssessmentInputs } from '../types';

type ViewMode = 'tracks' | 'matrix';

export function AssessmentView() {
  const [viewMode, setViewMode] = useState<ViewMode>('tracks');
  const [showGlobalInputsModal, setShowGlobalInputsModal] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);

  const {
    assessment,
    generateRecommendationPlan,
    generateQuickPlan,
    isAssessmentMode,
    selectedIndustry,
    isGeneratingPlan,
    planGenerationError,
    clearPlanError,
  } = useAssessment();

  useEffect(() => {
    if (!isGeneratingPlan) { setThinkingStep(0); return; }
    const interval = setInterval(() => setThinkingStep(s => (s + 1) % THINKING_STEPS.length), 3500);
    return () => clearInterval(interval);
  }, [isGeneratingPlan]);

  const handleSwitchToMatrix = () => {
    setViewMode('matrix');
  };

  const handleSwitchToTracks = () => {
    setViewMode('tracks');
  };

  const hasGlobalInputs = !!(
    assessment?.globalInputs?.commercialPreferences &&
    Object.keys(assessment.globalInputs.commercialPreferences).length > 0
  );

  const handleGeneratePlan = () => {
    if (!assessment) return;
    // Skip modal if inputs were already provided (e.g., from landing page)
    if (hasGlobalInputs) {
      generateRecommendationPlan(assessment.globalInputs!, true);
    } else {
      setShowGlobalInputsModal(true);
    }
  };

  const handleEditPlanContext = () => {
    setShowGlobalInputsModal(true);
  };

  const handleGenerateQuickPlan = () => {
    generateQuickPlan();
  };

  const handleGlobalInputsSubmit = async (inputs: GlobalAssessmentInputs) => {
    setShowGlobalInputsModal(false);
    // This is now async - the plan will be generated and set in context
    await generateRecommendationPlan(inputs, true); // true = use AI generation
  };

  // If in assessment mode and on tracks view, show the track assessment
  if (viewMode === 'tracks') {
    return (
      <>
        <TrackAssessmentView
          onSwitchToMatrix={handleSwitchToMatrix}
          onGeneratePlan={handleGeneratePlan}
          onEditPlanContext={handleEditPlanContext}
          hasGlobalInputs={hasGlobalInputs}
        />

        {/* Global Inputs Modal */}
        {showGlobalInputsModal && assessment && (
          <GlobalInputsModal
            clientName={assessment.clientName}
            selectedIndustry={selectedIndustry}
            existingInputs={assessment.globalInputs}
            onSubmit={handleGlobalInputsSubmit}
            onClose={() => setShowGlobalInputsModal(false)}
          />
        )}

        {/* AI Generation Loading Overlay */}
        {isGeneratingPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Loader2 className="w-16 h-16 text-merkle-blue animate-spin" />
                <Sparkles className="w-6 h-6 text-violet-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Building Your Plan</h3>
              <p className="text-gray-600 mb-4">
                We are analyzing your assessment and creating a personalized roadmap...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-violet-600 font-medium min-h-[1.5rem] transition-all">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>{THINKING_STEPS[thinkingStep]}</span>
              </div>
              <p className="text-xs text-gray-400 mt-3">This typically takes 2-3 minutes — please don't close this page</p>
            </div>
          </div>
        )}

        {/* AI Generation Error Toast */}
        {planGenerationError && (
          <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">AI Plan Generation Failed</h4>
                <p className="text-sm text-red-600 mt-1">{planGenerationError}</p>
                <p className="text-sm text-red-600 mt-1">Falling back to template-based plan.</p>
              </div>
              <button onClick={clearPlanError} className="text-red-400 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </>
    );
  }

  // Matrix view with ability to switch back
  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwitchToTracks}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
          >
            <Route className="w-4 h-4" />
            <span className="text-sm font-medium">Track View</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-sm font-medium">Matrix View</span>
          </div>
        </div>

        {isAssessmentMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateQuickPlan}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Quick Plan</span>
            </button>
            {hasGlobalInputs && (
              <button
                onClick={handleEditPlanContext}
                title="Edit plan context"
                className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Edit Context</span>
              </button>
            )}
            <button
              onClick={handleGeneratePlan}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Generate Plan</span>
            </button>
          </div>
        )}
      </div>

      {/* Matrix Component */}
      <MaturityMatrix />

      {/* Global Inputs Modal */}
      {showGlobalInputsModal && assessment && (
        <GlobalInputsModal
          clientName={assessment.clientName}
          selectedIndustry={selectedIndustry}
          existingInputs={assessment.globalInputs}
          onSubmit={handleGlobalInputsSubmit}
          onClose={() => setShowGlobalInputsModal(false)}
        />
      )}

      {/* AI Generation Loading Overlay */}
      {isGeneratingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Loader2 className="w-16 h-16 text-merkle-blue animate-spin" />
              <Sparkles className="w-6 h-6 text-violet-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generating AI Plan</h3>
            <p className="text-gray-600 mb-4">
              Claude is analyzing your assessment and creating a personalized roadmap...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>This typically takes 2-3 minutes</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Error Toast */}
      {planGenerationError && (
        <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800">AI Plan Generation Failed</h4>
              <p className="text-sm text-red-600 mt-1">{planGenerationError}</p>
              <p className="text-sm text-red-600 mt-1">Falling back to template-based plan.</p>
            </div>
            <button onClick={clearPlanError} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
