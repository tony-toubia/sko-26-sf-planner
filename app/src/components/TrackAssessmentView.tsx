import { useState, useMemo, useCallback } from 'react';
import {
  Database,
  Route,
  Share2,
  Brain,
  Play,
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { TrackProgress } from './TrackProgress';
import { TrackLevelAssessment } from './TrackLevelAssessment';
import { TRACKS, getAssessmentOrder, canStartLevel, getTrackById } from '../data/tracks';
import { useAssessment } from '../context/AssessmentContext';
import type { TrackId, TrackLevel, TrackLevelStatus, AssessmentAnswer } from '../types';

interface TrackAssessmentViewProps {
  onSwitchToMatrix?: () => void;
  onGeneratePlan?: () => void;
}

const TRACK_ICONS: Record<TrackId, React.ElementType> = {
  'data-identity': Database,
  journeys: Route,
  'content-channels': Share2,
  intelligence: Brain,
};

const TRACK_GRADIENTS: Record<TrackId, string> = {
  'data-identity': 'from-blue-500 to-blue-600',
  journeys: 'from-violet-500 to-violet-600',
  'content-channels': 'from-emerald-500 to-emerald-600',
  intelligence: 'from-amber-500 to-amber-600',
};

export function TrackAssessmentView({ onSwitchToMatrix, onGeneratePlan }: TrackAssessmentViewProps) {
  const { assessment, saveTrackLevelAssessment, getTrackLevelAssessment } = useAssessment();

  // Track which level is being assessed
  const [assessingLevel, setAssessingLevel] = useState<{
    trackId: TrackId;
    level: TrackLevel;
  } | null>(null);

  // Build track statuses from assessment context
  const trackStatuses = useMemo(() => {
    const statuses: Record<string, TrackLevelStatus> = {};

    if (assessment?.trackAssessments) {
      for (const [key, levelAssessment] of Object.entries(assessment.trackAssessments)) {
        statuses[key] = levelAssessment.status;
      }
    }

    return statuses;
  }, [assessment?.trackAssessments]);

  // Calculate completion
  const completionStats = useMemo(() => {
    let completed = 0;
    let total = 0;

    for (const track of TRACKS) {
      for (const level of track.levels) {
        total++;
        if (trackStatuses[`${track.id}-${level.level}`] === 'complete') {
          completed++;
        }
      }
    }

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      isComplete: completed === total,
    };
  }, [trackStatuses]);

  // Get next recommended action
  const nextRecommendation = useMemo(() => {
    const order = getAssessmentOrder();
    const completedSet = new Set(
      Object.entries(trackStatuses)
        .filter(([, status]) => status === 'complete')
        .map(([key]) => key)
    );

    // First, check Data L1 (always first)
    if (!completedSet.has('data-identity-1')) {
      return {
        trackId: 'data-identity' as TrackId,
        level: 1 as TrackLevel,
        message: 'Start with your platform foundation',
      };
    }

    // Then look for the next available level
    for (const trackId of order) {
      for (let level = 1; level <= 3; level++) {
        const key = `${trackId}-${level}`;
        if (completedSet.has(key)) continue;

        const { canStart } = canStartLevel(trackId, level as TrackLevel, completedSet);
        if (canStart) {
          const track = getTrackById(trackId);
          const trackLevel = track?.levels.find((l) => l.level === level);
          return {
            trackId,
            level: level as TrackLevel,
            message: `Continue with ${track?.shortName} Level ${level}: ${trackLevel?.shortName}`,
          };
        }
      }
    }

    return null;
  }, [trackStatuses]);

  const handleLevelClick = useCallback((trackId: TrackId, level: TrackLevel) => {
    setAssessingLevel({ trackId, level });
  }, []);

  const handleAssessmentComplete = useCallback(
    (status: TrackLevelStatus, answers: AssessmentAnswer[]) => {
      if (!assessingLevel) return;

      saveTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level, status, answers);
      setAssessingLevel(null);
    },
    [assessingLevel, saveTrackLevelAssessment]
  );

  const handleAssessmentCancel = useCallback(() => {
    setAssessingLevel(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maturity Assessment</h1>
          <p className="text-slate-500 mt-1">
            Assess your current state across four capability tracks
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onSwitchToMatrix && (
            <button
              onClick={onSwitchToMatrix}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Matrix View</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {TRACKS.map((track) => {
          const Icon = TRACK_ICONS[track.id];
          const gradient = TRACK_GRADIENTS[track.id];
          const completed = track.levels.filter(
            (l) => trackStatuses[`${track.id}-${l.level}`] === 'complete'
          ).length;

          return (
            <div
              key={track.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{track.shortName}</h3>
                  <p className="text-xs text-slate-500">{completed}/3 complete</p>
                </div>
              </div>
              <div className="flex gap-1">
                {track.levels.map((level) => {
                  const status = trackStatuses[`${track.id}-${level.level}`] || 'not-started';
                  return (
                    <div
                      key={level.level}
                      className={`flex-1 h-2 rounded-full ${
                        status === 'complete'
                          ? `bg-gradient-to-r ${gradient}`
                          : status === 'in-progress'
                            ? 'bg-slate-300'
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Track Progress (2 cols) */}
        <div className="col-span-2">
          <TrackProgress
            trackStatuses={trackStatuses}
            onLevelClick={handleLevelClick}
            currentTrack={assessingLevel?.trackId}
            currentLevel={assessingLevel?.level}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Next Step Card */}
          {nextRecommendation && !completionStats.isComplete && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-300">Next Step</span>
              </div>
              <p className="text-lg font-semibold mb-4">{nextRecommendation.message}</p>
              <button
                onClick={() =>
                  handleLevelClick(nextRecommendation.trackId, nextRecommendation.level)
                }
                className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Completion Card */}
          {completionStats.isComplete && (
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Assessment Complete</span>
              </div>
              <p className="text-lg font-semibold mb-4">
                All tracks assessed! Ready to generate your plan.
              </p>
              {onGeneratePlan && (
                <button
                  onClick={onGeneratePlan}
                  className="w-full py-2.5 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </button>
              )}
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Progress Summary</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Overall Completion</span>
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
                  <span className="text-slate-500">Levels Complete</span>
                  <span className="text-slate-700">{completionStats.completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Levels Remaining</span>
                  <span className="text-slate-700">
                    {completionStats.total - completionStats.completed}
                  </span>
                </div>
              </div>
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
        </div>
      </div>

      {/* Assessment Modal */}
      {assessingLevel && (
        <TrackLevelAssessment
          trackId={assessingLevel.trackId}
          level={assessingLevel.level}
          initialAnswers={
            getTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level)?.answers || []
          }
          initialStatus={
            getTrackLevelAssessment(assessingLevel.trackId, assessingLevel.level)?.status ||
            'not-started'
          }
          onComplete={handleAssessmentComplete}
          onCancel={handleAssessmentCancel}
        />
      )}
    </div>
  );
}
