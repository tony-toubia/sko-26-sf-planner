import { useState } from 'react';
import { LayoutGrid, Route, Sparkles } from 'lucide-react';
import { TrackAssessmentView } from './TrackAssessmentView';
import { MaturityMatrix } from './MaturityMatrix';
import { PlanOutput } from './PlanOutput';
import { GlobalInputsModal } from './GlobalInputsModal';
import { useAssessment } from '../context/AssessmentContext';
import type { GlobalAssessmentInputs } from '../types';

type ViewMode = 'tracks' | 'matrix';

export function AssessmentView() {
  const [viewMode, setViewMode] = useState<ViewMode>('tracks');
  const [showGlobalInputsModal, setShowGlobalInputsModal] = useState(false);

  const {
    assessment,
    generatedPlan,
    generateRecommendationPlan,
    generateQuickPlan,
    clearGeneratedPlan,
    isAssessmentMode,
  } = useAssessment();

  const handleSwitchToMatrix = () => {
    setViewMode('matrix');
  };

  const handleSwitchToTracks = () => {
    setViewMode('tracks');
  };

  const handleGeneratePlan = () => {
    if (assessment) {
      setShowGlobalInputsModal(true);
    }
  };

  const handleGenerateQuickPlan = () => {
    generateQuickPlan();
  };

  const handleGlobalInputsSubmit = (inputs: GlobalAssessmentInputs) => {
    generateRecommendationPlan(inputs);
    setShowGlobalInputsModal(false);
  };

  // If in assessment mode and on tracks view, show the track assessment
  if (viewMode === 'tracks') {
    return (
      <>
        <TrackAssessmentView
          onSwitchToMatrix={handleSwitchToMatrix}
          onGeneratePlan={handleGeneratePlan}
        />

        {/* Global Inputs Modal */}
        {showGlobalInputsModal && assessment && (
          <GlobalInputsModal
            clientName={assessment.clientName}
            onSubmit={handleGlobalInputsSubmit}
            onClose={() => setShowGlobalInputsModal(false)}
          />
        )}

        {/* Plan Output Modal */}
        {generatedPlan && <PlanOutput plan={generatedPlan} onClose={clearGeneratedPlan} />}
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
          onSubmit={handleGlobalInputsSubmit}
          onClose={() => setShowGlobalInputsModal(false)}
        />
      )}

      {/* Plan Output Modal */}
      {generatedPlan && <PlanOutput plan={generatedPlan} onClose={clearGeneratedPlan} />}
    </div>
  );
}
