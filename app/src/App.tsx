import { useState } from 'react';
import { Header, MaturityMatrix, SalesforceValue, AIAssistant, ValueRealizationSlides } from './components';
import type { ViewType } from './components';
import { AssessmentProvider } from './context/AssessmentContext';
import { ALL_CAPABILITIES } from './data/capabilities';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('capabilities');
  const [showSlides, setShowSlides] = useState(false);

  return (
    <AssessmentProvider totalCapabilities={ALL_CAPABILITIES.length}>
      <div className="min-h-screen bg-gray-50">
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          onShowSlides={() => setShowSlides(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'capabilities' && <MaturityMatrix />}
          {currentView === 'assistant' && <AIAssistant />}
          {currentView === 'value' && <SalesforceValue />}
        </main>

        {showSlides && <ValueRealizationSlides onClose={() => setShowSlides(false)} />}
      </div>
    </AssessmentProvider>
  );
}

export default App;
