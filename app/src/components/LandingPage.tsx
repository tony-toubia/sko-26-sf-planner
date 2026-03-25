import { useState } from 'react';
import {
  ArrowRight,
  ClipboardCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  FolderOpen,
  MessageSquare,
  Award,
  Lock,
  ShoppingCart,
  Headphones,
  Mail,
  ChevronDown,
  ChevronUp,
  Users,
  Building2,
  Network,
  Layers,
  Briefcase,
  HeartHandshake,
} from 'lucide-react';
import type { IndustryType, DisciplineType, BusinessModelType, MerkleOfferingType, GlobalAssessmentInputs } from '../types';
import { INDUSTRIES } from '../data/industries';
import { BUSINESS_MODELS, getDisciplinesForBusinessModel } from '../data/constants';
import { useAssessment } from '../context/AssessmentContext';
import { AssessmentListModal } from './AssessmentListModal';

const COMPANY_SIZES = [
  { value: 'smb', label: 'SMB', description: '<$50M revenue' },
  { value: 'mid-market', label: 'Mid-Market', description: '$50M–$500M' },
  { value: 'enterprise', label: 'Enterprise', description: '$500M–$5B' },
  { value: 'global-enterprise', label: 'Global Enterprise', description: '$5B+' },
];

const BUDGET_RANGES = [
  { value: 'under-100k', label: 'Under $100K' },
  { value: '100k-250k', label: '$100K – $250K' },
  { value: '250k-500k', label: '$250K – $500K' },
  { value: '500k-1m', label: '$500K – $1M' },
  { value: 'over-1m', label: 'Over $1M' },
];

const ENGAGEMENT_MODELS: { value: MerkleOfferingType; label: string }[] = [
  { value: 'fixed-bid', label: 'Fixed Bid' },
  { value: 'retainer', label: 'Retainer / Managed Services' },
  { value: 'staff-aug', label: 'Staff Augmentation' },
  { value: 'strategic-advisory', label: 'Strategic Advisory' },
  { value: 'osp', label: 'OSP (CapEx-eligible)' },
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

interface LandingPageProps {
  onStartAssessment: () => void;
}

const disciplineIcons: Record<string, React.ElementType> = {
  MessageSquare,
  Award,
  ShoppingCart,
  Headphones,
  Target,
  Briefcase,
  HeartHandshake,
};

const businessModelIcons: Record<string, React.ElementType> = {
  Users,
  Building2,
  Network,
  Layers,
};

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  const [step, setStep] = useState<'intro' | 'client-info'>('intro');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineType[]>(['messaging-personalization']);
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModelType | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Optional plan context
  const [showPlanContext, setShowPlanContext] = useState(false);
  const [companySize, setCompanySize] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [selectedEngagementModels, setSelectedEngagementModels] = useState<MerkleOfferingType[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  const { startAssessment, setUserEmail, isSupabaseAvailable } = useAssessment();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleBeginAssessment = async () => {
    if (clientName.trim() && selectedIndustry && selectedBusinessModel && selectedDisciplines.length > 0 && isValidEmail(email)) {
      // Set user email first so it's available for assessment creation
      const trimmedEmail = email.trim().toLowerCase();
      await setUserEmail(trimmedEmail);

      // Build optional plan context if any fields were filled
      let globalInputs: GlobalAssessmentInputs | undefined;
      if (companySize || budgetRange || selectedEngagementModels.length > 0 || selectedDrivers.length > 0 || selectedSubcategory) {
        globalInputs = {
          clientContext: {
            companySize: companySize as GlobalAssessmentInputs['clientContext']['companySize'] || undefined,
            industrySegment: selectedSubcategory || undefined,
          },
          commercialPreferences: {
            budgetRange: budgetRange as GlobalAssessmentInputs['commercialPreferences']['budgetRange'] || undefined,
            preferredEngagementModel: selectedEngagementModels.length > 0 ? selectedEngagementModels : undefined,
          },
          strategicContext: {
            keyBusinessDrivers: selectedDrivers.length > 0 ? selectedDrivers : undefined,
          },
        };
      }

      await startAssessment(clientName.trim(), selectedIndustry, null, undefined, selectedDisciplines, globalInputs, selectedBusinessModel);
      onStartAssessment();
    }
  };

  const toggleEngagementModel = (model: MerkleOfferingType) => {
    setSelectedEngagementModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const toggleDriver = (driver: string) => {
    setSelectedDrivers(prev =>
      prev.includes(driver) ? prev.filter(d => d !== driver) : [...prev, driver]
    );
  };

  const handleBusinessModelSelect = (modelId: BusinessModelType) => {
    setSelectedBusinessModel(modelId);
    // Auto-select available disciplines for this business model
    const availableDisciplines = getDisciplinesForBusinessModel(modelId);
    const defaultDisciplines = availableDisciplines
      .filter(d => d.available)
      .map(d => d.id);
    setSelectedDisciplines(defaultDisciplines.length > 0 ? defaultDisciplines : []);
  };

  // Get disciplines filtered by selected business model
  const visibleDisciplines = selectedBusinessModel
    ? getDisciplinesForBusinessModel(selectedBusinessModel)
    : [];

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
          {/* Branding lockup */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <img
              src="https://content.partnerpage.io/eyJidWNrZXQiOiJwYXJ0bmVycGFnZS5wcm9kIiwia2V5IjoibWVkaWEvZGlyZWN0b3JpZXMvaW1hZ2VzL2NkZmVmZGY3LTQ3ZWMtNGJiNC1hMzI0LTJjYWNmYTI2Yjg0Ni8yZjRiMjFlZC0zZDZlLTQ3N2UtYTA3NS1hZTA4NjAwZmRjYjEucG5nIiwiZWRpdHMiOnsidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxMjAwLCJoZWlnaHQiOjYwMCwiZml0IjoiY29udGFpbiIsImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjB9LCJwb3NpdGlvbiI6ImNlbnRyZSJ9fX0="
              alt="Merkle"
              className="h-8 w-auto"
            />
            <span className="text-gray-300 text-2xl font-light select-none">×</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png"
              alt="Salesforce"
              className="h-8 w-auto"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-merkle-blue/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-merkle-blue" />
            <span className="text-sm font-medium text-merkle-blue">Salesforce Capability Planner</span>
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
            {/* Your Email */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Your Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
                  autoFocus
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Required to save and retrieve your assessment later.
              </p>
            </div>

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
                    onClick={() => { setSelectedIndustry(industry.id); setSelectedSubcategory(null); }}
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
              {/* Subcategory selector — appears when an industry with subcategories is selected */}
              {selectedIndustry && INDUSTRIES[selectedIndustry]?.subcategories && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-600 mb-1.5">Segment (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES[selectedIndustry].subcategories!.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedSubcategory === sub
                            ? 'bg-merkle-blue text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Business Model Selection */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Business Model <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                This determines which Salesforce clouds and capabilities are relevant for assessment.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {BUSINESS_MODELS.map((model) => {
                  const Icon = businessModelIcons[model.icon];
                  const isSelected = selectedBusinessModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleBusinessModelSelect(model.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-merkle-blue bg-merkle-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {Icon && <Icon className={`w-5 h-5 ${isSelected ? 'text-merkle-blue' : 'text-gray-500'}`} />}
                        <span className="font-medium text-gray-900">{model.shortName}</span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">{model.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discipline Selection (shown after business model is selected) */}
            {selectedBusinessModel && (
              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Salesforce Clouds to Assess <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Select one or more clouds. You can assess multiple clouds to see adjacencies and cross-cloud opportunities.
                </p>
                <div className="space-y-2">
                  {visibleDisciplines.map((discipline) => {
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
            )}

            {/* Plan Context (Optional) */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPlanContext(!showPlanContext)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-merkle-blue" />
                  <span className="font-medium text-gray-700 text-sm">Plan Context</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">(optional — helps personalize your plan)</span>
                </div>
                {showPlanContext ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showPlanContext && (
                <div className="p-4 space-y-5 border-t border-gray-200">
                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      {COMPANY_SIZES.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => setCompanySize(companySize === size.value ? '' : size.value)}
                          className={`p-2.5 rounded-lg border-2 text-left text-sm transition-colors ${
                            companySize === size.value
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

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (Annual)</label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_RANGES.map((range) => (
                        <button
                          key={range.value}
                          type="button"
                          onClick={() => setBudgetRange(budgetRange === range.value ? '' : range.value)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                            budgetRange === range.value
                              ? 'border-merkle-blue bg-merkle-blue text-white'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Engagement Models */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Engagement Models</label>
                    <div className="flex flex-wrap gap-2">
                      {ENGAGEMENT_MODELS.map((model) => (
                        <button
                          key={model.value}
                          type="button"
                          onClick={() => toggleEngagementModel(model.value)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                            selectedEngagementModels.includes(model.value)
                              ? 'border-merkle-blue bg-merkle-blue text-white'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {model.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Drivers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Business Drivers</label>
                    <div className="flex flex-wrap gap-2">
                      {BUSINESS_DRIVERS.map((driver) => (
                        <button
                          key={driver}
                          type="button"
                          onClick={() => toggleDriver(driver)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedDrivers.includes(driver)
                              ? 'bg-merkle-blue text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {driver}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
              disabled={!clientName.trim() || !selectedIndustry || !selectedBusinessModel || selectedDisciplines.length === 0 || !isValidEmail(email)}
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
