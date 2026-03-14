import { useState, useEffect } from 'react';
import { Header, AssessmentView, SalesforceValue, AIAssistant, ValueRealizationSlides, LandingPage, OpportunityPipeline } from './components';
import { AdminLayout } from './components/admin';
import type { ViewType } from './components';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { PlanPage } from './components/PlanPage';
import { ALL_CAPABILITIES } from './data/capabilities';
import { assessmentService } from './lib/assessmentService';
import type { GeneratedPlan, OpportunityAssessment } from './types';
import './index.css';

// Parse plan ID from pathname like /plan/abc-123
function getPlanIdFromPath(path: string): string | null {
  const m = path.match(/^\/plan\/([^/]+)/);
  return m ? m[1] : null;
}

// Parse assessment ID from pathname like /assessment/abc-123
function getAssessmentIdFromPath(path: string): string | null {
  const m = path.match(/^\/assessment\/([^/]+)/);
  return m ? m[1] : null;
}

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('capabilities');
  const [showSlides, setShowSlides] = useState(false);
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // For direct /plan/:id URL access — load from DB
  const [directPlan, setDirectPlan] = useState<GeneratedPlan | null>(null);
  const [directAssessment, setDirectAssessment] = useState<OpportunityAssessment | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const {
    isAssessmentMode,
    generatedPlan,
    showPlanModal,
    assessment,
    closePlanModal,
    loadAssessment,
  } = useAssessment();

  // Sync URL changes reactively (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      // If user navigated away from /plan/*, close the modal
      if (!window.location.pathname.startsWith('/plan/')) {
        closePlanModal();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [closePlanModal]);

  // Keep currentPath in sync when showPlanModal changes
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [showPlanModal]);

  // Sync URL to /assessment/:id whenever an assessment is active
  // (handles new assessments created from landing page / pipeline)
  useEffect(() => {
    if (!isAssessmentMode || !assessment?.id) return;
    const path = window.location.pathname;
    // Don't override plan or admin URLs
    if (path.startsWith('/plan/') || path.startsWith('/admin')) return;
    const desired = `/assessment/${assessment.id}`;
    if (path !== desired) {
      window.history.replaceState({}, '', desired);
      setCurrentPath(desired);
    }
  }, [isAssessmentMode, assessment?.id]);

  // Handle direct /plan/:id URL load (page refresh or shared link)
  const planId = getPlanIdFromPath(currentPath);
  useEffect(() => {
    if (!planId) return;
    // If the context already has this plan loaded, don't re-fetch
    if (showPlanModal && assessment?.id === planId && generatedPlan) return;

    setIsLoadingPlan(true);
    assessmentService.loadAssessment(planId).then((loaded) => {
      if (loaded && loaded.generatedPlan) {
        setDirectAssessment(loaded);
        setDirectPlan(loaded.generatedPlan);
      }
      setIsLoadingPlan(false);
    }).catch(() => setIsLoadingPlan(false));
  }, [planId]);

  // Handle direct /assessment/:id URL — load into context and show assessment view
  const assessmentRouteId = getAssessmentIdFromPath(currentPath);
  const [isLoadingAssessmentRoute, setIsLoadingAssessmentRoute] = useState(false);
  const [assessmentRouteNotFound, setAssessmentRouteNotFound] = useState(false);

  useEffect(() => {
    if (!assessmentRouteId) return;
    // Already loaded into context
    if (isAssessmentMode && assessment?.id === assessmentRouteId) return;

    setIsLoadingAssessmentRoute(true);
    setAssessmentRouteNotFound(false);
    loadAssessment(assessmentRouteId).then((ok) => {
      if (!ok) setAssessmentRouteNotFound(true);
      else {
        setHasStartedAssessment(true);
        setCurrentView('capabilities');
      }
      setIsLoadingAssessmentRoute(false);
    });
  }, [assessmentRouteId]);

  const isPipelineRoute = currentPath === '/pipeline';
  const isAdminRoute = currentPath.startsWith('/admin');
  const isPlanRoute = !!planId;
  const isAssessmentRoute = !!assessmentRouteId;

  const showLanding = !hasStartedAssessment && !isAssessmentMode && !isPipelineRoute && !isAdminRoute && !isPlanRoute && !isAssessmentRoute;

  const handleStartAssessment = () => {
    setHasStartedAssessment(true);
    setCurrentView('capabilities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, showLanding]);

  // ── Admin ──
  if (isAdminRoute) return <AdminLayout />;

  // ── Pipeline ──
  if (isPipelineRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OpportunityPipeline />
      </div>
    );
  }

  // ── Plan page ──
  // Prefer context plan (just generated) over DB-loaded plan
  const activePlan = (showPlanModal && generatedPlan) ? generatedPlan : directPlan;
  const activeAssessment = (showPlanModal && assessment) ? assessment : directAssessment;

  if (isPlanRoute) {
    if (isLoadingPlan) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-merkle-blue/20 border-t-merkle-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading plan...</p>
          </div>
        </div>
      );
    }
    if (activePlan) {
      return (
        <PlanPage
          plan={activePlan}
          assessment={activeAssessment}
          onClose={() => {
            closePlanModal();
            setDirectPlan(null);
            setDirectAssessment(null);
            setCurrentPath('/');
            window.history.pushState({}, '', '/');
          }}
        />
      );
    }
    // Plan not found
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-gray-900 font-semibold mb-2">Plan not found</p>
          <p className="text-gray-500 text-sm mb-6">This plan may have expired or the link may be incorrect.</p>
          <button
            onClick={() => { setCurrentPath('/'); window.history.pushState({}, '', '/'); }}
            className="px-4 py-2 bg-merkle-blue text-white rounded-lg text-sm"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  // ── Assessment route (/assessment/:id) ──
  if (isAssessmentRoute) {
    if (isLoadingAssessmentRoute) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-merkle-blue/20 border-t-merkle-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading assessment...</p>
          </div>
        </div>
      );
    }
    if (assessmentRouteNotFound) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <p className="text-gray-900 font-semibold mb-2">Assessment not found</p>
            <p className="text-gray-500 text-sm mb-6">This assessment may have been deleted or the link is incorrect.</p>
            <a href="/admin/assessments" className="px-4 py-2 bg-merkle-blue text-white rounded-lg text-sm">
              Back to Admin
            </a>
          </div>
        </div>
      );
    }
    // Assessment loaded — fall through to normal app render below (isAssessmentMode will be true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onShowSlides={() => setShowSlides(true)}
        showLanding={showLanding}
        onGoToLanding={() => setHasStartedAssessment(false)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLanding && <LandingPage onStartAssessment={handleStartAssessment} />}
        {!showLanding && currentView === 'capabilities' && <AssessmentView />}
        {!showLanding && currentView === 'assistant' && <AIAssistant />}
        {!showLanding && currentView === 'value' && <SalesforceValue />}
      </main>

      {showSlides && <ValueRealizationSlides onClose={() => setShowSlides(false)} />}
    </div>
  );
}

function App() {
  return (
    <AssessmentProvider totalCapabilities={ALL_CAPABILITIES.length}>
      <AppContent />
    </AssessmentProvider>
  );
}

export default App;
