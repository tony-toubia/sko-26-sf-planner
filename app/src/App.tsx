import { useState, useEffect, lazy, Suspense } from 'react';
import { Header, AssessmentView, LandingPage } from './components';
import type { ViewType } from './components';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { ALL_CAPABILITIES } from './data/capabilities';
import './index.css';

// Lazy-load secondary views for code splitting
const AIAssistant = lazy(() => import('./components/AIAssistant').then(m => ({ default: m.AIAssistant })));
const SalesforceValue = lazy(() => import('./components/SalesforceValue').then(m => ({ default: m.SalesforceValue })));
const ValueRealizationSlides = lazy(() => import('./components/ValueRealizationSlides').then(m => ({ default: m.ValueRealizationSlides })));
const OpportunityPipeline = lazy(() => import('./components/OpportunityPipeline').then(m => ({ default: m.OpportunityPipeline })));
const AdminLayout = lazy(() => import('./components/admin').then(m => ({ default: m.AdminLayout })));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('capabilities');
  const [showSlides, setShowSlides] = useState(false);
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);

  const { isAssessmentMode } = useAssessment();

  // Check if we're on special routes
  const isPipelineRoute = window.location.pathname === '/pipeline';
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // Show landing page if user hasn't started an assessment
  const showLanding = !hasStartedAssessment && !isAssessmentMode && !isPipelineRoute && !isAdminRoute;

  const handleStartAssessment = () => {
    setHasStartedAssessment(true);
    setCurrentView('capabilities');
    // Scroll to top when starting assessment
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, showLanding]);

  // Show admin page if on admin route
  if (isAdminRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLayout />
      </Suspense>
    );
  }

  // Show pipeline page if on pipeline route
  if (isPipelineRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingFallback />}>
          <OpportunityPipeline />
        </Suspense>
      </div>
    );
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
        {!showLanding && currentView === 'assistant' && (
          <Suspense fallback={<LoadingFallback />}>
            <AIAssistant />
          </Suspense>
        )}
        {!showLanding && currentView === 'value' && (
          <Suspense fallback={<LoadingFallback />}>
            <SalesforceValue />
          </Suspense>
        )}
      </main>

      {showSlides && (
        <Suspense fallback={<LoadingFallback />}>
          <ValueRealizationSlides onClose={() => setShowSlides(false)} />
        </Suspense>
      )}
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
