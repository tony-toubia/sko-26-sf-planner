import { useState } from 'react';
import { Header, MaturityMatrix, JourneyIceberg, CapabilityModal } from './components';
import { getCapabilitiesByDiscipline } from './data/capabilities';
import type { Capability } from './types';
import './index.css';

type ViewType = 'matrix' | 'assessment' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('matrix');
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);

  // Get capabilities for iceberg view
  const messagingCapabilities = getCapabilitiesByDiscipline('messaging-personalization');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'matrix' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MaturityMatrix />
              </div>
              <div className="lg:col-span-1">
                <JourneyIceberg
                  capabilities={messagingCapabilities}
                  onCapabilityClick={setSelectedCapability}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'assessment' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Assessment</h2>
            <p className="text-gray-600 mb-8">
              Create and manage client maturity assessments. Upload meeting notes,
              assess current capabilities, and build a roadmap.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-merkle-blue hover:bg-merkle-blue/5 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-merkle-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-merkle-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">New Assessment</h3>
                <p className="text-sm text-gray-500">Start a new client maturity assessment</p>
              </div>

              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-merkle-teal hover:bg-merkle-teal/5 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-merkle-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-merkle-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Notes</h3>
                <p className="text-sm text-gray-500">Import meeting notes or documents</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Coming Soon:</strong> Full assessment workflow with AI-powered
                analysis of client documents and automatic capability recommendations.
              </p>
            </div>
          </div>
        )}

        {currentView === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-merkle-blue to-merkle-teal">
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
              <p className="text-white/80 text-sm">
                Ask questions about capabilities, maturity levels, and client strategies
              </p>
            </div>

            <div className="h-96 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-merkle-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 max-w-xl">
                      <p className="text-gray-700">
                        Hello! I'm your Maturity Matrix assistant. I can help you:
                      </p>
                      <ul className="mt-2 text-gray-600 text-sm space-y-1">
                        <li>• Understand capability requirements and dependencies</li>
                        <li>• Assess client maturity based on meeting notes</li>
                        <li>• Recommend next steps in the maturity journey</li>
                        <li>• Explain Salesforce product features and value</li>
                      </ul>
                      <p className="mt-3 text-gray-700">
                        What would you like to explore?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="max-w-3xl mx-auto flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask about capabilities, maturity levels, or client strategies..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-merkle-blue text-white rounded-xl hover:bg-merkle-blue/90 transition-colors font-medium">
                    Send
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border-t border-amber-200">
              <p className="text-sm text-amber-800 text-center">
                <strong>Coming Soon:</strong> Full AI chat integration with context-aware
                responses based on your capability data and client assessments.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Capability Modal */}
      {selectedCapability && (
        <CapabilityModal
          capability={selectedCapability}
          onClose={() => setSelectedCapability(null)}
        />
      )}
    </div>
  );
}

export default App;
