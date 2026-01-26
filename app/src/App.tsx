import { useState } from 'react';
import { Header, AssessmentView, SalesforceValue, AIAssistant, ValueRealizationSlides, LandingPage } from './components';
import type { ViewType } from './components';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { ALL_CAPABILITIES } from './data/capabilities';
import './index.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('capabilities');
  const [showSlides, setShowSlides] = useState(false);
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);

  const { isAssessmentMode } = useAssessment();

  // Show landing page if user hasn't started an assessment
  const showLanding = !hasStartedAssessment && !isAssessmentMode;

  const handleStartAssessment = () => {
    setHasStartedAssessment(true);
    setCurrentView('capabilities');
  };

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
