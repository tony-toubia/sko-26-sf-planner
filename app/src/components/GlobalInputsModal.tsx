import { useState } from 'react';
import {
  X,
  Building2,
  DollarSign,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Users,
  Calendar,
  Briefcase,
} from 'lucide-react';
import type { GlobalAssessmentInputs, MerkleOfferingType } from '../types';

interface GlobalInputsModalProps {
  clientName: string;
  onSubmit: (inputs: GlobalAssessmentInputs) => void;
  onClose: () => void;
}

type Step = 'client-context' | 'commercial' | 'strategic';

const STEPS: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: 'client-context', title: 'Client Context', icon: <Building2 className="w-5 h-5" /> },
  { id: 'commercial', title: 'Commercial Preferences', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'strategic', title: 'Strategic Context', icon: <Target className="w-5 h-5" /> },
];

const INDUSTRIES = [
  'Retail & Consumer Goods',
  'Quick Service Restaurant (QSR)',
  'Financial Services',
  'Healthcare & Life Sciences',
  'Technology',
  'Media & Entertainment',
  'Travel & Hospitality',
  'Manufacturing',
  'Telecommunications',
  'Energy & Utilities',
  'Other',
];

const COMPANY_SIZES = [
  { value: 'smb', label: 'SMB', description: '<$50M revenue' },
  { value: 'mid-market', label: 'Mid-Market', description: '$50M-$500M revenue' },
  { value: 'enterprise', label: 'Enterprise', description: '$500M-$5B revenue' },
  { value: 'global-enterprise', label: 'Global Enterprise', description: '$5B+ revenue' },
];

const BUDGET_RANGES = [
  { value: 'under-100k', label: 'Under $100K', description: 'Pilot/POC scope' },
  { value: '100k-250k', label: '$100K - $250K', description: 'Foundation implementation' },
  { value: '250k-500k', label: '$250K - $500K', description: 'Comprehensive program' },
  { value: '500k-1m', label: '$500K - $1M', description: 'Enterprise transformation' },
  { value: 'over-1m', label: 'Over $1M', description: 'Multi-year strategic partnership' },
];

const ENGAGEMENT_MODELS: { value: MerkleOfferingType; label: string; description: string }[] = [
  { value: 'fixed-bid', label: 'Fixed Bid Projects', description: 'Defined scope with fixed price' },
  { value: 'retainer', label: 'Retainer/Managed Services', description: 'Ongoing support with predictable costs' },
  { value: 'staff-aug', label: 'Staff Augmentation', description: 'Embedded resources with client teams' },
  { value: 'strategic-advisory', label: 'Strategic Advisory', description: 'Executive guidance and roadmap' },
  { value: 'osp', label: 'OPEX Model (OSP)', description: 'Bundled licensing + services' },
];

const BUSINESS_DRIVERS = [
  'Increase customer retention',
  'Drive revenue growth',
  'Improve operational efficiency',
  'Enable personalization at scale',
  'Accelerate time-to-market',
  'Reduce technology complexity',
  'Prepare for AI/Agentforce',
  'Unify customer data',
  'Improve marketing attribution',
  'Competitive differentiation',
];

export function GlobalInputsModal({ clientName, onSubmit, onClose }: GlobalInputsModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('client-context');
  const [inputs, setInputs] = useState<GlobalAssessmentInputs>({
    clientContext: {},
    commercialPreferences: {},
    strategicContext: {},
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    onSubmit(inputs);
  };

  const updateClientContext = (updates: Partial<GlobalAssessmentInputs['clientContext']>) => {
    setInputs((prev) => ({
      ...prev,
      clientContext: { ...prev.clientContext, ...updates },
    }));
  };

  const updateCommercial = (updates: Partial<GlobalAssessmentInputs['commercialPreferences']>) => {
    setInputs((prev) => ({
      ...prev,
      commercialPreferences: { ...prev.commercialPreferences, ...updates },
    }));
  };

  const updateStrategic = (updates: Partial<GlobalAssessmentInputs['strategicContext']>) => {
    setInputs((prev) => ({
      ...prev,
      strategicContext: { ...prev.strategicContext, ...updates },
    }));
  };

  const toggleEngagementModel = (model: MerkleOfferingType) => {
    const current = inputs.commercialPreferences.preferredEngagementModel || [];
    const updated = current.includes(model)
      ? current.filter((m) => m !== model)
      : [...current, model];
    updateCommercial({ preferredEngagementModel: updated });
  };

  const toggleBusinessDriver = (driver: string) => {
    const current = inputs.strategicContext.keyBusinessDrivers || [];
    const updated = current.includes(driver)
      ? current.filter((d) => d !== driver)
      : [...current, driver];
    updateStrategic({ keyBusinessDrivers: updated });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Generate Recommendation Plan</h3>
              <p className="text-white/80 text-sm">
                A few more details to create a tailored plan for {clientName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    currentStep === step.id
                      ? 'bg-white text-merkle-blue font-medium'
                      : index < currentStepIndex
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {step.icon}
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-white/40 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'client-context' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-merkle-blue" />
                  Client Profile
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Help us understand the client's context for better recommendations
                </p>
              </div>

              {/* Industry */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={inputs.clientContext.industry || ''}
                  onChange={(e) => updateClientContext({ industry: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                >
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Company Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANY_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() =>
                        updateClientContext({
                          companySize: size.value as GlobalAssessmentInputs['clientContext']['companySize'],
                        })
                      }
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        inputs.clientContext.companySize === size.value
                          ? 'border-merkle-blue bg-merkle-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{size.label}</div>
                      <div className="text-xs text-gray-500">{size.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Maturity */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Current Marketing Maturity (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        updateClientContext({
                          currentMarketingMaturity:
                            level as GlobalAssessmentInputs['clientContext']['currentMarketingMaturity'],
                        })
                      }
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                        inputs.clientContext.currentMarketingMaturity === level
                          ? 'border-merkle-blue bg-merkle-blue text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Foundational</span>
                  <span>Transformational</span>
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Marketing Team Size
                </label>
                <input
                  type="text"
                  value={inputs.clientContext.teamSize || ''}
                  onChange={(e) => updateClientContext({ teamSize: e.target.value })}
                  placeholder="e.g., 5-10 people, 3 FTE + contractors"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>

              {/* Existing Tech Stack */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Existing Marketing Tech Stack
                </label>
                <textarea
                  value={inputs.clientContext.existingTechStack || ''}
                  onChange={(e) => updateClientContext({ existingTechStack: e.target.value })}
                  placeholder="e.g., Salesforce Marketing Cloud (classic), Segment CDP, Klaviyo for email..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>
            </div>
          )}

          {currentStep === 'commercial' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-merkle-blue" />
                  Commercial Preferences
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Understanding budget and engagement preferences helps us recommend the right model
                </p>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Budget Range (Annual)
                </label>
                <div className="space-y-2">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() =>
                        updateCommercial({
                          budgetRange:
                            range.value as GlobalAssessmentInputs['commercialPreferences']['budgetRange'],
                        })
                      }
                      className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                        inputs.commercialPreferences.budgetRange === range.value
                          ? 'border-merkle-blue bg-merkle-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{range.label}</span>
                        <span className="text-sm text-gray-500">{range.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Flexibility */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Budget Flexibility</label>
                <div className="flex gap-3">
                  {[
                    { value: 'fixed', label: 'Fixed Budget' },
                    { value: 'flexible', label: 'Flexible' },
                    { value: 'tbd', label: 'TBD' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        updateCommercial({
                          budgetFlexibility:
                            opt.value as GlobalAssessmentInputs['commercialPreferences']['budgetFlexibility'],
                        })
                      }
                      className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                        inputs.commercialPreferences.budgetFlexibility === opt.value
                          ? 'border-merkle-blue bg-merkle-blue text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decision Timeline */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Decision Timeline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'this-quarter', label: 'This Quarter' },
                    { value: 'next-quarter', label: 'Next Quarter' },
                    { value: 'next-year', label: 'Next Year' },
                    { value: 'exploring', label: 'Just Exploring' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        updateCommercial({
                          decisionTimeline:
                            opt.value as GlobalAssessmentInputs['commercialPreferences']['decisionTimeline'],
                        })
                      }
                      className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                        inputs.commercialPreferences.decisionTimeline === opt.value
                          ? 'border-merkle-blue bg-merkle-blue text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Engagement Models */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Preferred Engagement Models (select all that apply)
                </label>
                <div className="space-y-2">
                  {ENGAGEMENT_MODELS.map((model) => (
                    <button
                      key={model.value}
                      onClick={() => toggleEngagementModel(model.value)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                        inputs.commercialPreferences.preferredEngagementModel?.includes(model.value)
                          ? 'border-merkle-blue bg-merkle-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{model.label}</span>
                        <span className="text-sm text-gray-500">{model.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CAPEX vs OPEX */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  CAPEX vs OPEX Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'capex', label: 'CAPEX', description: 'Capital expenditure' },
                    { value: 'opex', label: 'OPEX', description: 'Operational expenditure' },
                    { value: 'hybrid', label: 'Hybrid', description: 'Mix of both' },
                    { value: 'no-preference', label: 'No Preference', description: 'Open to either' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        updateCommercial({
                          preferCapexOrOpex:
                            opt.value as GlobalAssessmentInputs['commercialPreferences']['preferCapexOrOpex'],
                        })
                      }
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        inputs.commercialPreferences.preferCapexOrOpex === opt.value
                          ? 'border-merkle-blue bg-merkle-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Resources */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Internal Resource Capacity
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'limited', label: 'Limited', description: 'Need significant support' },
                    { value: 'moderate', label: 'Moderate', description: 'Some capacity' },
                    { value: 'strong', label: 'Strong', description: 'Can execute with guidance' },
                    { value: 'prefer-outsource', label: 'Prefer Outsource', description: 'Want full-service' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        updateCommercial({
                          internalResources:
                            opt.value as GlobalAssessmentInputs['commercialPreferences']['internalResources'],
                        })
                      }
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        inputs.commercialPreferences.internalResources === opt.value
                          ? 'border-merkle-blue bg-merkle-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'strategic' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-merkle-blue" />
                  Strategic Context
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Additional context helps us tailor recommendations to your client's goals
                </p>
              </div>

              {/* Key Business Drivers */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Key Business Drivers (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_DRIVERS.map((driver) => (
                    <button
                      key={driver}
                      onClick={() => toggleBusinessDriver(driver)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        inputs.strategicContext.keyBusinessDrivers?.includes(driver)
                          ? 'bg-merkle-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {driver}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  How will success be measured?
                </label>
                <textarea
                  value={inputs.strategicContext.successMetrics?.join('\n') || ''}
                  onChange={(e) =>
                    updateStrategic({
                      successMetrics: e.target.value.split('\n').filter((s) => s.trim()),
                    })
                  }
                  placeholder="e.g.,&#10;- Increase email-attributed revenue by 25%&#10;- Reduce campaign production time by 50%&#10;- Achieve 90% profile unification rate"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>

              {/* Known Constraints */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Known Constraints or Blockers
                </label>
                <textarea
                  value={inputs.strategicContext.knownConstraints || ''}
                  onChange={(e) => updateStrategic({ knownConstraints: e.target.value })}
                  placeholder="e.g., IT freeze in Q4, legacy system migration dependency, compliance requirements..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>

              {/* Competitive Pressures */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Competitive Pressures
                </label>
                <textarea
                  value={inputs.strategicContext.competitivePressures || ''}
                  onChange={(e) => updateStrategic({ competitivePressures: e.target.value })}
                  placeholder="e.g., Competitor X launched personalized app, industry moving to real-time engagement..."
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>

              {/* Executive Sponsor */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Executive Sponsor / Decision Maker
                </label>
                <input
                  type="text"
                  value={inputs.strategicContext.executiveSponsor || ''}
                  onChange={(e) => updateStrategic({ executiveSponsor: e.target.value })}
                  placeholder="e.g., VP of Marketing, CMO, Head of CRM"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>

              {/* Additional Context */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Additional Context
                </label>
                <textarea
                  value={inputs.strategicContext.additionalContext || ''}
                  onChange={(e) => updateStrategic({ additionalContext: e.target.value })}
                  placeholder="Any other relevant information about the opportunity, client relationship, or strategic context..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between flex-shrink-0">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isFirstStep
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Generate Plan
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
