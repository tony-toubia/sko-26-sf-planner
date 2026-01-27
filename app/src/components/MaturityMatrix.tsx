import { useState, useMemo } from 'react';
import type { Capability, CapabilityRelevance, GlobalAssessmentInputs } from '../types';
import { getCapabilityById, ALL_CAPABILITIES } from '../data/capabilities';
import { INDUSTRY_CAPABILITY_EMPHASIS } from '../data/industries';
import { AssessmentModal } from './AssessmentModal';
import { AssessmentSummary } from './AssessmentSummary';
import { GlobalInputsModal } from './GlobalInputsModal';
import { PlanOutput } from './PlanOutput';
import { IndustrySelector } from './IndustrySelector';
import { ConsolidatedQuestionnaire } from './ConsolidatedQuestionnaire';
import { useAssessment } from '../context/AssessmentContext';
import { Search, Info, ClipboardList, X, Target, Clock, CheckCircle, CheckCircle2, CircleDot, Star } from 'lucide-react';

type HighlightType = 'none' | 'prerequisite' | 'unlocks' | 'hovered';

// Grid cell configuration type
interface GridCellConfig {
  row: number;
  col: number;
  capabilityId: string;
}

interface GridLayout {
  rows: number;
  cols: number;
  cells: GridCellConfig[];
}

// Define the grid layout for the Path to Value Map
// This matches the PDF structure showing capability adjacencies
const GRID_LAYOUT: Record<string, GridLayout> = {
  'messaging-personalization': {
    rows: 3,
    cols: 3,
    cells: [
      // Row 0: Journey capabilities (top row)
      { row: 0, col: 0, capabilityId: 'baseline-subscriber-journeys' },
      { row: 0, col: 1, capabilityId: 'customer-lifecycle-journeys' },
      { row: 0, col: 2, capabilityId: 'insight-driven-experiences' },
      // Row 1: Foundation/Data capabilities (middle row)
      { row: 1, col: 0, capabilityId: 'migrate-sfmc' },
      { row: 1, col: 1, capabilityId: 'extend-data-integrations' },
      { row: 1, col: 2, capabilityId: 'data-exploration' },
      // Row 2: Content/Execution capabilities (bottom row)
      { row: 2, col: 0, capabilityId: 'enhance-planned-campaigns' },
      { row: 2, col: 1, capabilityId: 'scale-dynamic-content' },
      { row: 2, col: 2, capabilityId: 'identity-resolution' },
    ],
  },
};

// Additional capabilities not in the main grid
const ADDITIONAL_CAPABILITIES: Record<string, string[]> = {
  'messaging-personalization': [
    'einstein-engagement-scoring',
    'einstein-send-time-optimization',
    'cross-channel-activation',
    'clv-modeling',
    'agentic-campaign-production',
  ],
};

type IndustryPriority = 'high' | 'medium' | 'low' | null;

interface GridCellProps {
  capability: Capability | undefined;
  onClick: (cap: Capability) => void;
  onHover: (capId: string | null) => void;
  highlightType: HighlightType;
  assessmentStatus?: CapabilityRelevance;
  isAssessmentMode: boolean;
  industryPriority?: IndustryPriority;
}

function GridCell({ capability, onClick, onHover, highlightType, assessmentStatus, isAssessmentMode, industryPriority }: GridCellProps) {
  if (!capability) {
    return <div className="min-h-[180px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200" />;
  }

  const phaseColors: Record<number, string> = {
    1: '#0057A3',
    2: '#EA580C',
    3: '#059669',
    4: '#7C3AED',
  };

  // Get first business outcome for preview
  const topOutcome = capability.clientValue?.businessOutcomes?.[0];

  // Industry priority indicator
  const getIndustryPriorityIndicator = () => {
    if (!industryPriority || isAssessmentMode) return null;

    const priorityConfig = {
      high: { bg: 'bg-purple-500', text: 'High Priority' },
      medium: { bg: 'bg-purple-300', text: 'Medium' },
      low: { bg: 'bg-gray-300', text: 'Lower' },
    };

    const config = priorityConfig[industryPriority];
    return (
      <div className={`absolute -top-1.5 -left-1.5 ${config.bg} rounded-full p-1`} title={`${config.text} for selected industry`}>
        <Star className="w-3 h-3 text-white" />
      </div>
    );
  };

  // Determine styling based on highlight type and assessment status
  const getHighlightStyles = () => {
    // In assessment mode, show assessment status styling
    if (isAssessmentMode && assessmentStatus && assessmentStatus !== 'not-assessed') {
      switch (assessmentStatus) {
        case 'complete':
          return 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50';
        case 'in-progress':
          return 'border-violet-500 ring-2 ring-violet-500/30 bg-violet-50';
        case 'immediately-relevant':
          return 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50';
        case 'near-future':
          return 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50';
        case 'not-ready':
          return 'border-gray-300 bg-gray-100 opacity-60';
      }
    }

    switch (highlightType) {
      case 'hovered':
        return 'border-gray-900 ring-2 ring-gray-900/20 shadow-lg scale-[1.02]';
      case 'prerequisite':
        return 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg bg-amber-50';
      case 'unlocks':
        return 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg bg-emerald-50';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  // Assessment status indicator
  const getAssessmentIndicator = () => {
    if (!isAssessmentMode) return null;

    switch (assessmentStatus) {
      case 'complete':
        return (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
            <CircleDot className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'immediately-relevant':
        return (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'near-future':
        return (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
        );
      case 'not-ready':
        return (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={() => onClick(capability)}
      onMouseEnter={() => onHover(capability.id)}
      onMouseLeave={() => onHover(null)}
      className={`relative min-h-[180px] p-4 rounded-xl border-2 bg-white transition-all duration-200 hover:shadow-lg flex flex-col text-left ${getHighlightStyles()}`}
    >
      {getAssessmentIndicator()}
      {getIndustryPriorityIndicator()}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: phaseColors[capability.phase] }}
          >
            P{capability.phase}
          </div>
          {highlightType === 'prerequisite' && !isAssessmentMode && (
            <span className="text-xs font-medium text-amber-600">Required</span>
          )}
          {highlightType === 'unlocks' && !isAssessmentMode && (
            <span className="text-xs font-medium text-emerald-600">Unlocked</span>
          )}
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
            capability.journeyType === 'above-the-line'
              ? 'bg-gradient-to-r from-cyan-400 to-teal-500'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700'
          }`}
        >
          {capability.journeyType === 'above-the-line' ? 'Activation' : 'Data'}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
        {capability.name}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
        {capability.description}
      </p>
      {topOutcome && (
        <div className="mt-auto pt-2 border-t border-gray-100">
          <span className="text-xs font-medium text-emerald-600">{topOutcome}</span>
        </div>
      )}
    </button>
  );
}

export function MaturityMatrix() {
  // M&P is now the only discipline - no selection needed
  const selectedDiscipline = 'messaging-personalization';
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);
  const [hoveredCapabilityId, setHoveredCapabilityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGlobalInputsModal, setShowGlobalInputsModal] = useState(false);
  const [showDeepDiveQuestionnaire, setShowDeepDiveQuestionnaire] = useState(false);

  const {
    isAssessmentMode,
    endAssessment,
    getCapabilityAssessment,
    assessment,
    generatedPlan,
    showPlanModal,
    generateRecommendationPlan,
    generateQuickPlan,
    closePlanModal,
    selectedIndustry,
    setSelectedIndustry,
    marketingFoundation,
  } = useAssessment();

  const gridConfig = GRID_LAYOUT[selectedDiscipline] || { rows: 3, cols: 3, cells: [] };
  const additionalCapIds = ADDITIONAL_CAPABILITIES[selectedDiscipline] || [];

  const additionalCaps = additionalCapIds
    .map((id: string) => getCapabilityById(id))
    .filter((c): c is Capability => c !== undefined);

  // Compute which capabilities are prerequisites of and unlocked by the hovered capability
  const { prerequisiteIds, unlocksIds } = useMemo(() => {
    if (!hoveredCapabilityId) {
      return { prerequisiteIds: new Set<string>(), unlocksIds: new Set<string>() };
    }

    const hoveredCap = getCapabilityById(hoveredCapabilityId);
    if (!hoveredCap) {
      return { prerequisiteIds: new Set<string>(), unlocksIds: new Set<string>() };
    }

    // Prerequisites: capability IDs that this capability depends on
    const prereqIds = new Set<string>(
      hoveredCap.dependencies?.filter((dep) => getCapabilityById(dep)) || []
    );

    // Unlocks: capabilities that have this capability as a dependency
    const unlocks = new Set<string>();
    ALL_CAPABILITIES.forEach((cap) => {
      if (cap.dependencies?.includes(hoveredCapabilityId)) {
        unlocks.add(cap.id);
      }
    });

    return { prerequisiteIds: prereqIds, unlocksIds: unlocks };
  }, [hoveredCapabilityId]);

  // Determine highlight type for a capability
  const getHighlightType = (capId: string | undefined): HighlightType => {
    if (!capId) return 'none';
    if (capId === hoveredCapabilityId) return 'hovered';
    if (prerequisiteIds.has(capId)) return 'prerequisite';
    if (unlocksIds.has(capId)) return 'unlocks';
    return 'none';
  };

  // Get industry priority for a capability
  const getIndustryPriority = (capId: string | undefined): IndustryPriority => {
    if (!capId || !selectedIndustry) return null;
    const emphasis = INDUSTRY_CAPABILITY_EMPHASIS[selectedIndustry];
    if (!emphasis) return null;
    if (emphasis.highPriority.includes(capId)) return 'high';
    if (emphasis.mediumPriority.includes(capId)) return 'medium';
    if (emphasis.lowPriority.includes(capId)) return 'low';
    return null;
  };

  // Filter for search
  const matchesSearch = (cap: Capability | undefined) => {
    if (!cap || !searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      cap.name.toLowerCase().includes(query) ||
      cap.shortName.toLowerCase().includes(query) ||
      cap.description.toLowerCase().includes(query) ||
      cap.tags.some((t) => t.toLowerCase().includes(query))
    );
  };

  // Build the grid
  const grid: (Capability | undefined)[][] = [];
  for (let r = 0; r < gridConfig.rows; r++) {
    grid[r] = [];
    for (let c = 0; c < gridConfig.cols; c++) {
      const cell = gridConfig.cells.find((cellConfig: GridCellConfig) => cellConfig.row === r && cellConfig.col === c);
      const cap = cell ? getCapabilityById(cell.capabilityId) : undefined;
      grid[r][c] = cap && matchesSearch(cap) ? cap : (searchQuery ? undefined : cap);
    }
  }

  const filteredAdditional = additionalCaps.filter(matchesSearch);

  const handleCapabilityClick = (cap: Capability) => {
    setSelectedCapability(cap);
  };

  const handleEditCapability = (capabilityId: string) => {
    const cap = getCapabilityById(capabilityId);
    if (cap) {
      setSelectedCapability(cap);
    }
  };

  const handleGenerateDetailedPlan = () => {
    // Open the global inputs modal to collect final details before generating
    setShowGlobalInputsModal(true);
  };

  const handleGenerateQuickPlan = () => {
    // Generate plan immediately with industry-based defaults
    generateQuickPlan();
  };

  const handleGlobalInputsSubmit = (inputs: GlobalAssessmentInputs) => {
    generateRecommendationPlan(inputs);
    setShowGlobalInputsModal(false);
  };

  const handleStartDeepDive = () => {
    setShowDeepDiveQuestionnaire(true);
  };

  const handleDeepDiveComplete = () => {
    setShowDeepDiveQuestionnaire(false);
    // Optionally show the global inputs modal to generate plan
    setShowGlobalInputsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Path to Value Map</h2>
          <p className="text-gray-500">
            {isAssessmentMode
              ? 'Click capabilities to assess their relevance for your client.'
              : 'Click any capability to explore details. Adjacent capabilities share dependencies.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
            />
          </div>
          {isAssessmentMode && (
            <button
              onClick={endAssessment}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Exit Assessment
            </button>
          )}
        </div>
      </div>

      {/* Assessment Mode Banner */}
      {isAssessmentMode && assessment && (
        <div className="bg-gradient-to-r from-merkle-blue/10 to-salesforce-blue/10 border border-merkle-blue/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-merkle-blue" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">Assessment Mode</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-medium">{assessment.clientName}</span>
                {marketingFoundation && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      marketingFoundation === 'mc-advanced'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {marketingFoundation === 'mc-advanced' ? 'MC Advanced & Data 360' : 'MC Engagement'}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-gray-600">Complete</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-gray-600">Immediate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-gray-600">Near-Future</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <span className="text-gray-600">Not Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Selector - shown when not in assessment mode */}
      {!isAssessmentMode && (
        <IndustrySelector
          selectedIndustry={selectedIndustry}
          onSelect={setSelectedIndustry}
        />
      )}

      {/* Main Content - Grid and Assessment Summary side by side */}
      <div className={`grid gap-6 ${isAssessmentMode ? 'lg:grid-cols-3' : ''}`}>
        {/* Main Grid */}
        <div className={isAssessmentMode ? 'lg:col-span-2' : ''}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {!isAssessmentMode && (
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Hover over a capability to see its dependencies.{' '}
                  <span className="text-amber-600 font-medium">Amber = required first</span>
                  {' · '}
                  <span className="text-emerald-600 font-medium">Green = unlocked by this</span>
                </span>
              </div>
            )}

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              }}
            >
              {grid.flat().map((capability, index) => (
                <GridCell
                  key={capability?.id || `empty-${index}`}
                  capability={capability}
                  onClick={handleCapabilityClick}
                  onHover={setHoveredCapabilityId}
                  highlightType={getHighlightType(capability?.id)}
                  assessmentStatus={capability ? getCapabilityAssessment(capability.id)?.relevance : undefined}
                  isAssessmentMode={isAssessmentMode}
                  industryPriority={getIndustryPriority(capability?.id)}
                />
              ))}
            </div>

            {/* Row Labels */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="text-xs text-gray-500 font-medium">
                <span className="block text-gray-900">Journeys & Experiences</span>
                Customer-facing activations
              </div>
              <div className="text-xs text-gray-500 font-medium">
                <span className="block text-gray-900">Platform & Data</span>
                Foundation layer
              </div>
              <div className="text-xs text-gray-500 font-medium">
                <span className="block text-gray-900">Content & Identity</span>
                Personalization engine
              </div>
            </div>
          </div>

          {/* Additional Capabilities */}
          {filteredAdditional.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Capabilities
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                These capabilities enhance and extend the core matrix capabilities
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredAdditional.map((cap) => {
                  const highlightType = getHighlightType(cap.id);
                  const assessmentStatus = getCapabilityAssessment(cap.id)?.relevance;
                  const capIndustryPriority = getIndustryPriority(cap.id);

                  const getAdditionalHighlightStyles = () => {
                    if (isAssessmentMode && assessmentStatus && assessmentStatus !== 'not-assessed') {
                      switch (assessmentStatus) {
                        case 'complete':
                          return 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50';
                        case 'in-progress':
                          return 'border-violet-500 ring-2 ring-violet-500/30 bg-violet-50';
                        case 'immediately-relevant':
                          return 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50';
                        case 'near-future':
                          return 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50';
                        case 'not-ready':
                          return 'border-gray-300 bg-gray-100 opacity-60';
                      }
                    }

                    switch (highlightType) {
                      case 'hovered':
                        return 'border-gray-900 ring-2 ring-gray-900/20 shadow-lg';
                      case 'prerequisite':
                        return 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg bg-amber-50';
                      case 'unlocks':
                        return 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg bg-emerald-50';
                      default:
                        return 'border-gray-200 hover:border-gray-300';
                    }
                  };

                  const getIndicator = () => {
                    if (!isAssessmentMode) return null;
                    switch (assessmentStatus) {
                      case 'complete':
                        return <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>;
                      case 'in-progress':
                        return <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"><CircleDot className="w-3 h-3 text-white" /></div>;
                      case 'immediately-relevant':
                        return <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"><Target className="w-3 h-3 text-white" /></div>;
                      case 'near-future':
                        return <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"><Clock className="w-3 h-3 text-white" /></div>;
                      case 'not-ready':
                        return <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>;
                      default:
                        return null;
                    }
                  };

                  const getIndustryPriorityIndicator = () => {
                    if (!capIndustryPriority || isAssessmentMode) return null;
                    const priorityConfig = {
                      high: { bg: 'bg-purple-500', text: 'High Priority' },
                      medium: { bg: 'bg-purple-300', text: 'Medium' },
                      low: { bg: 'bg-gray-300', text: 'Lower' },
                    };
                    const config = priorityConfig[capIndustryPriority];
                    return (
                      <div className={`absolute -top-1.5 -left-1.5 ${config.bg} rounded-full p-0.5`} title={`${config.text} for selected industry`}>
                        <Star className="w-2.5 h-2.5 text-white" />
                      </div>
                    );
                  };

                  return (
                    <button
                      key={cap.id}
                      onClick={() => handleCapabilityClick(cap)}
                      onMouseEnter={() => setHoveredCapabilityId(cap.id)}
                      onMouseLeave={() => setHoveredCapabilityId(null)}
                      className={`relative p-4 rounded-xl border-2 bg-white hover:shadow-md transition-all text-left ${getAdditionalHighlightStyles()}`}
                    >
                      {getIndicator()}
                      {getIndustryPriorityIndicator()}
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: ({ 1: '#0057A3', 2: '#EA580C', 3: '#059669', 4: '#7C3AED' } as Record<number, string>)[cap.phase] }}
                        >
                          {cap.phase}
                        </div>
                        <span className="text-xs text-gray-500">Phase {cap.phase}</span>
                        {highlightType === 'prerequisite' && !isAssessmentMode && (
                          <span className="text-xs font-medium text-amber-600">Required</span>
                        )}
                        {highlightType === 'unlocks' && !isAssessmentMode && (
                          <span className="text-xs font-medium text-emerald-600">Unlocked</span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm">{cap.shortName}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cap.description.slice(0, 80)}...</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Assessment Summary Sidebar */}
        {isAssessmentMode && (
          <div className="lg:col-span-1">
            <AssessmentSummary
              onGenerateQuickPlan={handleGenerateQuickPlan}
              onGenerateDetailedPlan={handleGenerateDetailedPlan}
              onEditCapability={handleEditCapability}
              onStartDeepDive={handleStartDeepDive}
            />
          </div>
        )}
      </div>

      {/* Legend */}
      {!isAssessmentMode && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">Phase:</span>
              {[1, 2, 3, 4].map((phase) => (
                <div key={phase} className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: { 1: '#0057A3', 2: '#EA580C', 3: '#059669', 4: '#7C3AED' }[phase] }}
                  >
                    {phase}
                  </div>
                  <span className="text-xs text-gray-500">
                    {['Unlock', 'Activate', 'Optimize', 'Transform'][phase - 1]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">Type:</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-gradient-to-r from-cyan-400 to-teal-500">
                  Activation
                </span>
                <span className="text-xs text-gray-500">Customer-facing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700">
                  Data
                </span>
                <span className="text-xs text-gray-500">Foundation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Modal - shows details + assessment actions when in assessment mode */}
      {selectedCapability && (
        <AssessmentModal
          capability={selectedCapability}
          onClose={() => setSelectedCapability(null)}
          isAssessmentMode={isAssessmentMode}
        />
      )}

      {/* Global Inputs Modal - collects context before generating plan */}
      {showGlobalInputsModal && assessment && (
        <GlobalInputsModal
          clientName={assessment.clientName}
          selectedIndustry={selectedIndustry}
          onSubmit={handleGlobalInputsSubmit}
          onClose={() => setShowGlobalInputsModal(false)}
        />
      )}

      {/* Plan Output Modal - displays generated recommendation plan */}
      {showPlanModal && generatedPlan && (
        <PlanOutput
          plan={generatedPlan}
          assessment={assessment}
          onClose={closePlanModal}
        />
      )}

      {/* Phase 2: Deep Dive Questionnaire */}
      {showDeepDiveQuestionnaire && (
        <ConsolidatedQuestionnaire
          onClose={() => setShowDeepDiveQuestionnaire(false)}
          onComplete={handleDeepDiveComplete}
        />
      )}
    </div>
  );
}
