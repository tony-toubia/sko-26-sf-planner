import { useState, useEffect } from 'react';
import { Header, AssessmentView, SalesforceValue, AIAssistant, ValueRealizationSlides, LandingPage, OpportunityPipeline } from './components';
import { AdminLayout } from './components/admin';
import type { ViewType } from './components';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { ALL_CAPABILITIES } from './data/capabilities';
import './index.css';

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
    return <AdminLayout />;
  }

  // Show pipeline page if on pipeline route
  if (isPipelineRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OpportunityPipeline />
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
