import { useState } from 'react';
import {
  ArrowRight,
  ClipboardCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  FolderOpen,
  Mail,
  Award,
  Lock,
  ShoppingCart,
  Headphones,
} from 'lucide-react';
import type { IndustryType, DisciplineType } from '../types';
import { INDUSTRIES } from '../data/industries';
import { DISCIPLINES } from '../data/constants';
import { useAssessment } from '../context/AssessmentContext';
import { AssessmentListModal } from './AssessmentListModal';

interface LandingPageProps {
  onStartAssessment: () => void;
}

const disciplineIcons: Record<string, React.ElementType> = {
  Mail,
  Award,
  ShoppingCart,
  Headphones,
};

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  const [step, setStep] = useState<'intro' | 'client-info'>('intro');
  const [clientName, setClientName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineType[]>(['messaging-personalization']);
  const [showLoadModal, setShowLoadModal] = useState(false);

  const { startAssessment, isSupabaseAvailable } = useAssessment();

  const handleBeginAssessment = async () => {
    if (clientName.trim() && selectedIndustry && selectedDisciplines.length > 0) {
      // Wait for the assessment to be created (especially in Supabase)
      // Marketing foundation will be selected as first step in assessment
      await startAssessment(clientName.trim(), selectedIndustry, null, undefined, selectedDisciplines);
      onStartAssessment();
    }
  };

  const toggleDiscipline = (disciplineId: DisciplineType, available: boolean) => {
    // Don't allow toggling locked disciplines
    if (!available) return;

    setSelectedDisciplines(prev => {
      if (prev.includes(disciplineId)) {
        // Don't allow deselecting if it's the only one selected
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== disciplineId);
      } else {
        return [...prev, disciplineId];
      }
    });
  };

  const industries = Object.values(INDUSTRIES);

  // Intro screen
  if (step === 'intro') {
    return (
      <>
      <AssessmentListModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onAssessmentLoaded={onStartAssessment}
      />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-merkle-blue/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-merkle-blue" />
            <span className="text-sm font-medium text-merkle-blue">SF Value Realization Navigator</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Unlock the Full Value of Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-merkle-blue to-salesforce-blue">
              Salesforce
            </span>{' '}
            Investment
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Most organizations use only 30% of their platform capabilities.
            Let's assess your maturity and build a roadmap to maximize value.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </>
    );
  }

  // Client Info Step
  if (step === 'client-info') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-merkle-blue to-salesforce-blue">
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

            {/* Discipline Selection */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Salesforce Clouds to Assess <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select one or more clouds. You can assess multiple clouds to see adjacencies and cross-cloud opportunities.
              </p>
              <div className="space-y-2">
                {DISCIPLINES.map((discipline) => {
                  const Icon = disciplineIcons[discipline.icon];
                  const isSelected = selectedDisciplines.includes(discipline.id);
                  const isLocked = !discipline.available;
                  return (
                    <button
                      key={discipline.id}
                      onClick={() => toggleDiscipline(discipline.id, discipline.available)}
                      disabled={isLocked}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                        isLocked
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'border-merkle-blue bg-merkle-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        isLocked
                          ? 'bg-gray-200 text-gray-400'
                          : isSelected
                            ? 'bg-merkle-blue text-white'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {Icon && <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{discipline.name}</span>
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                              <Lock className="w-3 h-3" />
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {discipline.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {discipline.salesforceCloud}
                        </div>
                      </div>
                      {isSelected && !isLocked && (
                        <div className="flex-shrink-0">
                          <ClipboardCheck className="w-5 h-5 text-merkle-blue" />
                        </div>
                      )}
                    </button>
                  );
                })}
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
              onClick={handleBeginAssessment}
              disabled={!clientName.trim() || !selectedIndustry || selectedDisciplines.length === 0}
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

  return null;
}
