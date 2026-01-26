import { useState } from 'react';
import {
  ArrowRight,
  ClipboardCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
  Database,
  Mail,
  FolderOpen,
} from 'lucide-react';
import type { IndustryType, MarketingFoundationType } from '../types';
import { INDUSTRIES } from '../data/industries';
import { MARKETING_FOUNDATIONS } from '../data/constants';
import { useAssessment } from '../context/AssessmentContext';
import { AssessmentListModal } from './AssessmentListModal';

interface LandingPageProps {
  onStartAssessment: () => void;
}

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  const [step, setStep] = useState<'intro' | 'client-info' | 'foundation'>('intro');
  const [clientName, setClientName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [selectedFoundation, setSelectedFoundation] = useState<MarketingFoundationType | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);

  const { startAssessment, isSupabaseAvailable } = useAssessment();

  const handleBeginAssessment = async () => {
    if (clientName.trim() && selectedIndustry && selectedFoundation) {
      // Wait for the assessment to be created (especially in Supabase)
      // Pass foundation directly to avoid React state timing issues
      await startAssessment(clientName.trim(), selectedIndustry, selectedFoundation);
      onStartAssessment();
    }
  };

  const industries = Object.values(INDUSTRIES);

  // Intro screen
  if (step === 'intro') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-merkle-blue/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-merkle-blue" />
            <span className="text-sm font-medium text-merkle-blue">Merkle M&P Maturity Navigator</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Unlock the Full Value of Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-merkle-blue to-salesforce-blue">
              Marketing Cloud
            </span>{' '}
            Investment
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Most organizations use only 30% of their platform capabilities.
            Let's assess your maturity and build a roadmap to maximize value.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setStep('client-info')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-merkle-blue/25 transition-all text-lg"
            >
              <ClipboardCheck className="w-5 h-5" />
              Start Your Assessment
              <ArrowRight className="w-5 h-5" />
            </button>

            {isSupabaseAvailable && (
              <button
                onClick={() => setShowLoadModal(true)}
                className="inline-flex items-center gap-2 px-6 py-4 text-gray-700 font-medium rounded-xl border-2 border-gray-300 hover:border-merkle-blue hover:text-merkle-blue transition-all"
              >
                <FolderOpen className="w-5 h-5" />
                Load Saved Assessment
              </button>
            )}
          </div>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Assess Current State</h3>
            <p className="text-gray-600 text-sm">
              Evaluate your capabilities across the M&P maturity framework with industry-specific context.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Prioritize Investments</h3>
            <p className="text-gray-600 text-sm">
              Get a phased roadmap that sequences capabilities based on dependencies and business impact.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Accelerate Value</h3>
            <p className="text-gray-600 text-sm">
              Leverage Merkle's expertise and Salesforce partnership to realize value faster.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-12 border-t border-gray-200 w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-merkle-blue">+35%</div>
              <div className="text-sm text-gray-600">Email Revenue Lift</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-merkle-blue">3X</div>
              <div className="text-sm text-gray-600">Operational Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-merkle-blue">+40%</div>
              <div className="text-sm text-gray-600">Open Rate vs. Industry</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-merkle-blue">3X</div>
              <div className="text-sm text-gray-600">ROAS with Cross-Channel</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client Info Step
  if (step === 'client-info') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-merkle-blue to-salesforce-blue">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <span className="px-2 py-0.5 bg-white/20 rounded">Step 1 of 2</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Client Information</h2>
            <p className="text-white/80">Tell us about the assessment context</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Client Name */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client or opportunity name..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setClientName('Anonymous')}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Anonymous
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Use "Anonymous" for confidential assessments without client permission.
              </p>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedIndustry === industry.id
                        ? 'border-merkle-blue bg-merkle-blue/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{industry.shortName}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {industry.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setStep('intro')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
            <button
              onClick={() => setStep('foundation')}
              disabled={!clientName.trim() || !selectedIndustry}
              className="flex items-center gap-2 px-6 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Marketing Foundation Step
  if (step === 'foundation') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-4xl w-full overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-merkle-blue to-salesforce-blue">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <span className="px-2 py-0.5 bg-white/20 rounded">Step 2 of 2</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Choose Your Marketing Foundation</h2>
            <p className="text-white/80">This decision determines which capabilities are available in your roadmap</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {MARKETING_FOUNDATIONS.map((foundation) => (
                <button
                  key={foundation.id}
                  onClick={() => setSelectedFoundation(foundation.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all relative ${
                    selectedFoundation === foundation.id
                      ? 'border-merkle-blue bg-merkle-blue/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {foundation.recommended && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                      Recommended
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      foundation.id === 'mc-advanced'
                        ? 'bg-gradient-to-br from-merkle-blue to-salesforce-blue'
                        : 'bg-gray-200'
                    }`}>
                      {foundation.id === 'mc-advanced' ? (
                        <Database className="w-6 h-6 text-white" />
                      ) : (
                        <Mail className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{foundation.name}</h3>
                      <p className="text-sm text-gray-500">{foundation.shortName}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{foundation.description}</p>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 uppercase">Features</div>
                    <ul className="space-y-1">
                      {foundation.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            foundation.id === 'mc-advanced' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {foundation.limitations && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs font-medium text-amber-600 mb-2">Limitations</div>
                      <ul className="space-y-1">
                        {foundation.limitations.slice(0, 3).map((limitation, i) => (
                          <li key={i} className="text-xs text-amber-700">{limitation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Not sure which to choose?</div>
                  <p className="text-sm text-blue-700 mt-1">
                    If your client has existing SFMC and limited budget, MC Engagement may be appropriate.
                    For new implementations or clients ready to invest in modern marketing capabilities,
                    MC Advanced & Data 360 unlocks the full potential including Agentforce.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setStep('client-info')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
            <button
              onClick={handleBeginAssessment}
              disabled={!selectedFoundation}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ClipboardCheck className="w-5 h-5" />
              Begin Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load Assessment Modal */}
      <AssessmentListModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onAssessmentLoaded={onStartAssessment}
      />
    </>
  );
}
