import { useState, useMemo, useCallback } from 'react';
import {
  Database,
  Route,
  Share2,
  Brain,
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
  Sparkles,
  ClipboardCheck,
  Pencil,
  Settings,
  Mail,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudOff,
  Loader2,
  Save,
  FileText,
  Building2,
  Users,
  Gift,
  TrendingUp,
} from 'lucide-react';
import { TrackProgress } from './TrackProgress';
import { TrackLevelAssessment } from './TrackLevelAssessment';
import { SaveAssessmentModal } from './SaveAssessmentModal';
import { getTracksForDisciplines, getAssessmentOrder, getTrackById } from '../data/allTracks';
import { MARKETING_FOUNDATIONS } from '../data/constants';
import { useAssessment } from '../context/AssessmentContext';
import type { TrackId, TrackLevel, TrackLevelStatus, AssessmentAnswer, MarketingFoundationType } from '../types';

interface TrackAssessmentViewProps {
  onSwitchToMatrix?: () => void;
  onGeneratePlan?: () => void;
  onEditPlanContext?: () => void;
  hasGlobalInputs?: boolean;
}

const TRACK_ICONS: Record<string, React.ElementType> = {
  // M&P tracks
  'data-identity': Database,
  'journeys': Route,
  'content-channels': Share2,
  'intelligence': Brain,
  // Loyalty tracks
  'program-foundation': Building2,
  'member-engagement': Users,
  'rewards-offers': Gift,
  'loyalty-intelligence': TrendingUp,
};

const TRACK_GRADIENTS: Record<string, string> = {
  // M&P tracks
  'data-identity': 'from-blue-500 to-blue-600',
  'journeys': 'from-violet-500 to-violet-600',
  'content-channels': 'from-emerald-500 to-emerald-600',
  'intelligence': 'from-amber-500 to-amber-600',
  // Loyalty tracks
  'program-foundation': 'from-indigo-500 to-indigo-600',
  'member-engagement': 'from-purple-500 to-purple-600',
  'rewards-offers': 'from-pink-500 to-pink-600',
  'loyalty-intelligence': 'from-rose-500 to-rose-600',
  // Commerce tracks
  'commerce-platform': 'from-orange-500 to-orange-600',
  'shopping-experience': 'from-pink-500 to-pink-600',
  'order-fulfillment': 'from-teal-500 to-teal-600',
  'commerce-intelligence': 'from-amber-500 to-amber-600',
};

export function TrackAssessmentView({ onSwitchToMatrix, onGeneratePlan, onEditPlanContext, hasGlobalInputs }: TrackAssessmentViewProps) {
  const { assessment, saveTrackLevelAssessment, getTrackLevelAssessment, marketingFoundation, setMarketingFoundation, businessModel, isSaving, lastSaved, isSupabaseAvailable, userEmail, generatedPlan, openPlanModal } = useAssessment();

  // Active discipline tab - defaults to first selected discipline
  const [activeDiscipline, setActiveDiscipline] = useState<string>(() => {
    return assessment?.disciplines?.[0] || 'messaging-personalization';
  });

  // Track which level is being assessed
  const [assessingLevel, setAssessingLevel] = useState<{
    trackId: TrackId;
    level: TrackLevel;
  } | null>(null);

  // Get ALL tracks for selected disciplines (for overall progress tracking)
  const ALL_TRACKS = useMemo(() => {
    const disciplines = assessment?.disciplines || ['messaging-personalization'];
    return getTracksForDisciplines(disciplines);
  }, [assessment?.disciplines]);

  // Get tracks for the ACTIVE discipline only (for current view)
  const ACTIVE_TRACKS = useMemo(() => {
    return ALL_TRACKS.filter(track => track.discipline === activeDiscipline);
  }, [ALL_TRACKS, activeDiscipline]);

  // Get selected disciplines with metadata
  const selectedDisciplines = useMemo(() => {
    const disciplines = assessment?.disciplines || ['messaging-personalization'];
    return disciplines.map(id => {
      const disc = { id, name: '', shortName: '', icon: '' };
      if (id === 'messaging-personalization') {
        disc.name = 'Messaging & Personalization';
        disc.shortName = 'M&P';
        disc.icon = 'Mail';
      } else if (id === 'loyalty') {
        disc.name = 'Loyalty Management';
        disc.shortName = 'Loyalty';
        disc.icon = 'Award';
      }
      return disc;
    });
  }, [assessment?.disciplines]);

  // Settings panel state
  const [showSettings, setShowSettings] = useState(false);

  // Save modal state
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Build track statuses and assessed levels from assessment context
  // Use assessment.updatedAt as additional dependency to ensure re-render on any change
  const { trackStatuses, assessedLevels } = useMemo(() => {
    const statuses: Record<string, TrackLevelStatus> = {};
    const assessed = new Set<string>();

    if (assessment?.trackAssessments) {
      for (const [key, levelAssessment] of Object.entries(assessment.trackAssessments)) {
        statuses[key] = levelAssessment.status;
        assessed.add(key); // Any level with an assessment record has been assessed
      }
    }

    return { trackStatuses: statuses, assessedLevels: assessed };
  }, [assessment?.trackAssessments, assessment?.updatedAt]);

  // Calculate completion stats - now based on "assessed" rather than just "complete maturity"
  // Use ALL_TRACKS to show progress across all selected disciplines
  const completionStats = useMemo(() => {
    let assessed = 0;
    let mature = 0; // Levels marked as "complete" maturity
    let total = 0;
    const missing: string[] = [];

    for (const track of ALL_TRACKS) {
      for (const level of track.levels) {
        total++;
        const key = `${track.id}-${level.level}`;
        if (assessedLevels.has(key)) {
          assessed++;
          if (trackStatuses[key] === 'complete') {
            mature++;
          }
        } else {
          missing.push(key);
        }
      }
    }

    // Debug logging
    if (missing.length > 0 && missing.length < 5) {
      console.log('[TrackAssessmentView] Missing assessments:', missing);
      console.log('[TrackAssessmentView] Assessed levels:', Array.from(assessedLevels));
    }

    return {
      assessed,
      mature,
      total,
      percentage: total > 0 ? Math.round((assessed / total) * 100) : 0,
      isComplete: assessed === total,
    };
  }, [ALL_TRACKS, trackStatuses, assessedLevels]);

  // Get next recommended action - find next level NOT YET ASSESSED
  const nextRecommendation = useMemo(() => {
    const disciplines = assessment?.disciplines || ['messaging-personalization'];
    const order = getAssessmentOrder(disciplines);

    // First, check Data L1 (always first) - if not assessed yet
    if (!assessedLevels.has('data-identity-1')) {
      return {
        trackId: 'data-identity' as TrackId,
        level: 1 as TrackLevel,
        message: 'Start with your platform foundation',
        isFirstAssessment: assessedLevels.size === 0,
      };
    }

    // Then look for the next level that hasn't been assessed yet
    // Simply follow the predefined order - it already respects dependencies
    for (const key of order) {
      if (assessedLevels.has(key)) continue; // Skip already assessed

      // Parse track-level key - handle multi-hyphen track IDs like "content-channels"
      // Format: "track-id-level" where level is always the last segment
      const lastDashIndex = key.lastIndexOf('-');
      const trackId = key.substring(0, lastDashIndex);
      const levelStr = key.substring(lastDashIndex + 1);
      const level = parseInt(levelStr);

      const track = getTrackById(trackId, disciplines);
      const trackLevel = track?.levels.find((l: any) => l.level === level);
      return {
        trackId: trackId as TrackId,
        level: level as TrackLevel,
        message: `Assess ${track?.shortName} Level ${level}: ${trackLevel?.shortName}`,
        isFirstAssessment: false,
      };
    }

    return null;
  }, [assessedLevels, assessment?.disciplines]);

  const handleLevelClick = useCallback((trackId: TrackId, level: TrackLevel) => {
    setAssessingLevel({ trackId, level });
  }, []);

  // Get the next recommended level to assess
  const getNextLevelToAssess = useCallback((): { trackId: TrackId; level: TrackLevel } | null => {
    const disciplines = assessment?.disciplines || ['messaging-personalization'];
    const order = getAssessmentOrder(disciplines);

    // Include the current level we just assessed as assessed
    const updatedAssessed = new Set(assessedLevels);
    if (assessingLevel) {
      updatedAssessed.add(`${assessingLevel.trackId}-${assessingLevel.level}`);
    }

    console.log('[getNextLevelToAssess] Full order:', order);
    console.log('[getNextLevelToAssess] Already assessed:', Array.from(updatedAssessed));

    // During initial assessment, simply follow the predefined order
    // Don't check dependencies - the order itself respects dependencies
    for (const key of order) {
      if (updatedAssessed.has(key)) {
        console.log('[getNextLevelToAssess] Skipping already assessed:', key);
        continue; // Skip already assessed
      }

      // Parse track-level key - handle multi-hyphen track IDs like "content-channels"
      // Format: "track-id-level" where level is always the last segment
      const lastDashIndex = key.lastIndexOf('-');
      const trackId = key.substring(0, lastDashIndex);
      const levelStr = key.substring(lastDashIndex + 1);
      const level = parseInt(levelStr);

      console.log('[getNextLevelToAssess] Next level to assess:', key, '-> trackId:', trackId, 'level:', level);
      return { trackId: trackId as TrackId, level: level as TrackLevel };
    }

    console.log('[getNextLevelToAssess] No more levels to assess');
    return null;
  }, [assessedLevels, assessingLevel, assessment?.disciplines]);

  const handleAssessmentComplete = useCallback(
    (status: TrackLevelStatus, answers: AssessmentAnswer[], action: 'continue' | 'exit') => {
      if (!assessingLevel) return;

      // Save the assessment FIRST
      saveTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level, status, answers);

      // Use a small delay to ensure state updates propagate
      setTimeout(() => {
        if (action === 'continue') {
          // Find and navigate to the next level
          const nextLevel = getNextLevelToAssess();
          if (nextLevel) {
            setAssessingLevel(nextLevel);
          } else {
            setAssessingLevel(null);
          }
        } else {
          // Exit back to the overview
          setAssessingLevel(null);
        }
      }, 50);
    },
    [assessingLevel, saveTrackLevelAssessment, getNextLevelToAssess]
  );

  const handleAssessmentCancel = useCallback(() => {
    setAssessingLevel(null);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Maturity Assessment</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Assess your current state across four capability tracks
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Matrix View button hidden per user request */}
          {false && onSwitchToMatrix && (
            <button
              onClick={onSwitchToMatrix}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Matrix View</span>
            </button>
          )}
        </div>
      </div>

      {/* Discipline Tabs — shown when multiple clouds are in scope */}
      {selectedDisciplines.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1">
          {selectedDisciplines.map((disc) => {
            const Icon = disc.icon === 'Mail' ? Mail : disc.icon === 'Award' ? Gift : Mail;
            const isActive = disc.id === activeDiscipline;
            const discTracks = ALL_TRACKS.filter(t => t.discipline === disc.id);
            const discAssessed = discTracks.reduce((sum, t) =>
              sum + t.levels.filter((l: any) => assessedLevels.has(`${t.id}-${l.level}`)).length, 0
            );
            const discTotal = discTracks.reduce((sum, t) => sum + t.levels.length, 0);
            return (
              <button
                key={disc.id}
                onClick={() => setActiveDiscipline(disc.id)}
                className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-merkle-blue text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{disc.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {discAssessed}/{discTotal}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick Stats Bar - Show only tracks for active discipline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {ACTIVE_TRACKS.map((track) => {
          const Icon = TRACK_ICONS[track.id];
          const gradient = TRACK_GRADIENTS[track.id];
          const assessedCount = track.levels.filter(
            (l: any) => assessedLevels.has(`${track.id}-${l.level}`)
          ).length;

          // Check if this track is locked (M&P tracks when no foundation selected)
          const isLocked = activeDiscipline === 'messaging-personalization' && !marketingFoundation;

          return (
            <div
              key={track.id}
              className={`bg-white rounded-xl border border-slate-200 p-3 md:p-4 transition-shadow ${
                isLocked ? 'opacity-50' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className={`p-1.5 md:p-2 rounded-lg ${isLocked ? 'bg-slate-200 text-slate-400' : `bg-gradient-to-br ${gradient} text-white`}`}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-xs md:text-sm truncate">{track.shortName}</h3>
                  <p className="text-xs text-slate-500">{assessedCount}/3 assessed</p>
                </div>
              </div>
              <div className="flex gap-1">
                {track.levels.map((level: any) => {
                  const key = `${track.id}-${level.level}`;
                  const isAssessed = assessedLevels.has(key);
                  const status = trackStatuses[key] || 'not-started';
                  return (
                    <div
                      key={level.level}
                      className={`flex-1 h-1.5 md:h-2 rounded-full ${
                        isLocked
                          ? 'bg-slate-100'
                          : isAssessed
                            ? status === 'complete'
                              ? `bg-gradient-to-r ${gradient}`
                              : status === 'in-progress'
                                ? 'bg-amber-300'
                                : 'bg-slate-300'
                            : 'bg-slate-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Top-level Plan CTA — sits above all discipline content, appears when ready */}
      {(marketingFoundation || selectedDisciplines.some(d => d.id === 'loyalty')) && (completionStats.isComplete || generatedPlan) && (
        <div className={`rounded-xl p-5 text-white ${completionStats.isComplete ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-slate-600 to-slate-700'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium opacity-80">
                  {completionStats.isComplete ? 'Assessment Complete' : 'Plan Available'}
                </span>
              </div>
              <p className="text-lg font-semibold">
                {completionStats.isComplete
                  ? 'All tracks assessed — ready to generate your plan.'
                  : 'View your plan or regenerate with updated answers.'}
              </p>
              {selectedDisciplines.length > 1 && (
                <p className="text-sm opacity-75 mt-1">
                  Generates one combined plan covering{' '}
                  {selectedDisciplines.map(d => d.shortName).join(' + ')}.
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
              {onEditPlanContext && (
                <button
                  onClick={onEditPlanContext}
                  className="px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-white/15 text-white hover:bg-white/25 text-sm whitespace-nowrap"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {hasGlobalInputs ? 'Edit Context' : 'Add Context'}
                </button>
              )}
              {generatedPlan && (
                <button
                  onClick={openPlanModal}
                  className="px-4 py-2.5 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <FileText className="w-4 h-4" />
                  View Plan
                </button>
              )}
              {onGeneratePlan && (
                <button
                  onClick={onGeneratePlan}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                    generatedPlan
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-white text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {generatedPlan ? 'Regenerate' : 'Generate Plan'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Track Progress (2 cols on large screens) - Show only active discipline tracks */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {/* Show blocked message if M&P discipline and no foundation selected */}
          {activeDiscipline === 'messaging-personalization' && !marketingFoundation ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
              <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Select Marketing Platform First
              </h3>
              <p className="text-sm text-slate-500">
                Please select your marketing platform (MC Engagement or MC Advanced) in the sidebar to begin the assessment.
              </p>
            </div>
          ) : (
            <TrackProgress
              tracks={ACTIVE_TRACKS}
              trackStatuses={trackStatuses}
              assessedLevels={assessedLevels}
              onLevelClick={handleLevelClick}
              currentTrack={assessingLevel?.trackId}
              currentLevel={assessingLevel?.level}
            />
          )}
        </div>

        {/* Right Sidebar - show first on mobile */}
        <div className="space-y-4 order-1 lg:order-2">
          {/* Marketing Foundation Selection - show first when not selected AND on M&P tab */}
          {!marketingFoundation && activeDiscipline === 'messaging-personalization' && (
            <div className="bg-gradient-to-br from-merkle-blue to-salesforce-blue rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5" />
                <span className="text-sm font-medium text-white/80">First Step</span>
              </div>
              <p className="text-lg font-semibold mb-4">Select Your Marketing Platform</p>
              <p className="text-sm text-white/80 mb-4">
                This determines which capabilities are available for your roadmap.
              </p>
              <div className="space-y-2">
                {MARKETING_FOUNDATIONS.map((foundation) => (
                  <button
                    key={foundation.id}
                    onClick={() => setMarketingFoundation(foundation.id as MarketingFoundationType)}
                    className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-all border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        foundation.id === 'mc-advanced'
                          ? 'bg-white/20'
                          : 'bg-white/10'
                      }`}>
                        {foundation.id === 'mc-advanced' ? (
                          <Database className="w-5 h-5 text-white" />
                        ) : (
                          <Mail className="w-5 h-5 text-white/80" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {foundation.shortName}
                          </span>
                          {foundation.recommended && (
                            <span className="text-[10px] bg-emerald-400/30 text-emerald-200 px-1.5 py-0.5 rounded font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/70 mt-0.5">{foundation.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/60" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next Step Card - show if foundation selected (M&P) OR on Loyalty tab */}
          {(marketingFoundation || activeDiscipline === 'loyalty') && nextRecommendation && !completionStats.isComplete && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Pencil className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-300">
                  {nextRecommendation.isFirstAssessment ? 'Get Started' : 'Continue Assessment'}
                </span>
              </div>
              <p className="text-lg font-semibold mb-4">{nextRecommendation.message}</p>
              <button
                onClick={() =>
                  handleLevelClick(nextRecommendation.trackId, nextRecommendation.level)
                }
                className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                {nextRecommendation.isFirstAssessment ? 'Begin' : 'Assess This Level'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Assessment Progress</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Levels Assessed</span>
                  <span className="font-medium text-slate-900">{completionStats.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionStats.percentage}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Assessed</span>
                  <span className="text-slate-700">{completionStats.assessed} of {completionStats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span className="text-slate-700">
                    {completionStats.total - completionStats.assessed}
                  </span>
                </div>
              </div>
              {completionStats.assessed > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-medium text-slate-500 mb-1">Maturity Breakdown</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Mature</span>
                    <span className="text-slate-700">{completionStats.mature}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">Building / Gap</span>
                    <span className="text-slate-700">{completionStats.assessed - completionStats.mature}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Assessment Tips</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Start with Data & Identity - it's the foundation</li>
              <li>• Complete Level 1 before moving to Level 2</li>
              <li>• Some levels require other tracks first</li>
              <li>• Be honest about current state for best recommendations</li>
            </ul>
          </div>

          {/* Assessment Settings */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Assessment Settings</span>
              </div>
              {showSettings ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showSettings && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                {/* Client Name */}
                {assessment?.clientName && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Client</div>
                    <div className="text-sm font-medium text-slate-700">{assessment.clientName}</div>
                  </div>
                )}

                {/* Marketing Foundation Selection */}
                <div>
                  <div className="text-xs text-slate-500 mb-2">Marketing Platform</div>
                  <div className="space-y-2">
                    {MARKETING_FOUNDATIONS.map((foundation) => (
                      <button
                        key={foundation.id}
                        onClick={() => setMarketingFoundation(foundation.id as MarketingFoundationType)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          marketingFoundation === foundation.id
                            ? foundation.id === 'mc-advanced'
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-slate-400 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            foundation.id === 'mc-advanced'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-slate-200'
                          }`}>
                            {foundation.id === 'mc-advanced' ? (
                              <Database className="w-4 h-4 text-white" />
                            ) : (
                              <Mail className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-900 truncate">
                                {foundation.shortName}
                              </span>
                              {marketingFoundation === foundation.id && (
                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                                  foundation.id === 'mc-advanced' ? 'text-blue-600' : 'text-slate-600'
                                }`} />
                              )}
                            </div>
                            {foundation.recommended && (
                              <span className="text-[10px] text-emerald-600 font-medium">Recommended</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Changing this affects which capabilities are available in your roadmap.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Save Status Indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-slate-600">Saving...</span>
                </>
              ) : isSupabaseAvailable ? (
                <>
                  <Cloud className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1">
                    <span className="text-sm text-slate-600">Auto-saving enabled</span>
                    {lastSaved && (
                      <p className="text-[10px] text-slate-400">
                        Last saved {lastSaved.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <CloudOff className="w-4 h-4 text-amber-500" />
                  <div className="flex-1">
                    <span className="text-sm text-amber-700">Local only</span>
                    <p className="text-[10px] text-amber-600">
                      Data not persisted to cloud
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Email Status */}
            {userEmail ? (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Mail className="w-4 h-4 text-slate-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Saved to</p>
                  <p className="text-sm text-slate-700 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="text-xs text-merkle-blue hover:underline"
                >
                  Change
                </button>
              </div>
            ) : isSupabaseAvailable ? (
              <button
                onClick={() => setShowSaveModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                Save to Email
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      {assessingLevel && (
        <TrackLevelAssessment
          // Use key to force remount when track/level changes (resets internal state)
          key={`${assessingLevel.trackId}-${assessingLevel.level}`}
          trackId={assessingLevel.trackId}
          level={assessingLevel.level}
          initialAnswers={
            getTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level)?.answers || []
          }
          initialStatus={
            getTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level)?.status ||
            'not-started'
          }
          initialNotes={
            getTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level)?.notes || ''
          }
          marketingFoundation={marketingFoundation}
          businessModel={businessModel}
          onAutoSave={(status, answers, notes) => {
            saveTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level, status, answers, notes);
          }}
          onComplete={handleAssessmentComplete}
          onCancel={handleAssessmentCancel}
          totalLevels={completionStats.total}
          currentLevelIndex={completionStats.assessed}
        />
      )}

      {/* Save Assessment Modal */}
      <SaveAssessmentModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
}
