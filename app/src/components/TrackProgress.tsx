import { useMemo } from 'react';
import {
  Database,
  Route,
  Share2,
  Brain,
  Lock,
  CheckCircle2,
  Circle,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { TRACKS, getRequiredDependencies, getTrackById } from '../data/tracks';
import type { TrackId, TrackLevel, TrackLevelStatus } from '../types';

interface TrackProgressProps {
  trackStatuses: Record<string, TrackLevelStatus>; // key: `${trackId}-${level}`
  onLevelClick?: (trackId: TrackId, level: TrackLevel) => void;
  currentTrack?: TrackId;
  currentLevel?: TrackLevel;
  compact?: boolean;
}

const TRACK_ICONS: Record<TrackId, React.ElementType> = {
  'data-identity': Database,
  journeys: Route,
  'content-channels': Share2,
  intelligence: Brain,
};

const TRACK_COLORS: Record<TrackId, { bg: string; border: string; text: string; fill: string }> = {
  'data-identity': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    fill: 'bg-blue-500',
  },
  journeys: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    fill: 'bg-violet-500',
  },
  'content-channels': {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    fill: 'bg-emerald-500',
  },
  intelligence: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    fill: 'bg-amber-500',
  },
};

function getLevelStatus(
  trackId: TrackId,
  level: TrackLevel,
  trackStatuses: Record<string, TrackLevelStatus>
): TrackLevelStatus {
  return trackStatuses[`${trackId}-${level}`] || 'not-started';
}

function isLevelBlocked(
  trackId: TrackId,
  level: TrackLevel,
  trackStatuses: Record<string, TrackLevelStatus>
): boolean {
  const requiredDeps = getRequiredDependencies(trackId, level);
  for (const dep of requiredDeps) {
    const depStatus = getLevelStatus(dep.fromTrack, dep.fromLevel, trackStatuses);
    if (depStatus !== 'complete') {
      return true;
    }
  }
  return false;
}

function getBlockingDependency(
  trackId: TrackId,
  level: TrackLevel,
  trackStatuses: Record<string, TrackLevelStatus>
): string | null {
  const requiredDeps = getRequiredDependencies(trackId, level);
  for (const dep of requiredDeps) {
    const depStatus = getLevelStatus(dep.fromTrack, dep.fromLevel, trackStatuses);
    if (depStatus !== 'complete') {
      const depTrack = getTrackById(dep.fromTrack);
      const depLevel = depTrack?.levels.find((l) => l.level === dep.fromLevel);
      return `${depTrack?.shortName} L${dep.fromLevel}: ${depLevel?.shortName}`;
    }
  }
  return null;
}

export function TrackProgress({
  trackStatuses,
  onLevelClick,
  currentTrack,
  currentLevel,
  compact = false,
}: TrackProgressProps) {
  const completionStats = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let total = 0;

    for (const track of TRACKS) {
      for (const level of track.levels) {
        total++;
        const status = getLevelStatus(track.id, level.level, trackStatuses);
        if (status === 'complete') completed++;
        else if (status === 'in-progress') inProgress++;
      }
    }

    return { completed, inProgress, total, percentage: Math.round((completed / total) * 100) };
  }, [trackStatuses]);

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Assessment Progress</h3>
          <span className="text-sm font-medium text-slate-600">
            {completionStats.completed}/{completionStats.total} complete
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionStats.percentage}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TRACKS.map((track) => {
            const Icon = TRACK_ICONS[track.id];
            const colors = TRACK_COLORS[track.id];
            const levelsComplete = track.levels.filter(
              (l) => getLevelStatus(track.id, l.level, trackStatuses) === 'complete'
            ).length;

            return (
              <div
                key={track.id}
                className={`flex flex-col items-center p-2 rounded-lg ${colors.bg} ${colors.border} border`}
              >
                <Icon className={`w-4 h-4 ${colors.text} mb-1`} />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {levelsComplete}/3
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Maturity Tracks</h2>
          <p className="text-sm text-slate-500 mt-1">
            Progress through each track to build your marketing maturity
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">{completionStats.percentage}%</div>
          <div className="text-xs text-slate-500">
            {completionStats.completed} of {completionStats.total} levels complete
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {TRACKS.map((track) => {
          const Icon = TRACK_ICONS[track.id];
          const colors = TRACK_COLORS[track.id];

          return (
            <div
              key={track.id}
              className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${colors.text}`}>{track.name}</h3>
                  <p className="text-xs text-slate-500">{track.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {track.levels.map((level, idx) => {
                  const status = getLevelStatus(track.id, level.level, trackStatuses);
                  const isBlocked = isLevelBlocked(track.id, level.level, trackStatuses);
                  const blockingDep = isBlocked
                    ? getBlockingDependency(track.id, level.level, trackStatuses)
                    : null;
                  const isCurrent = currentTrack === track.id && currentLevel === level.level;

                  return (
                    <div key={level.level} className="flex items-center flex-1">
                      <button
                        onClick={() => !isBlocked && onLevelClick?.(track.id, level.level)}
                        disabled={isBlocked}
                        className={`
                          flex-1 relative group
                          ${isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        title={
                          isBlocked
                            ? `Blocked: Complete ${blockingDep} first`
                            : `${level.name}: ${status}`
                        }
                      >
                        <div
                          className={`
                            rounded-lg p-3 border-2 transition-all
                            ${isCurrent ? 'ring-2 ring-offset-2 ring-slate-400' : ''}
                            ${
                              status === 'complete'
                                ? `${colors.fill} border-transparent text-white`
                                : status === 'in-progress'
                                  ? `bg-white ${colors.border} ${colors.text}`
                                  : isBlocked
                                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                                    : `bg-white border-slate-200 text-slate-600 hover:${colors.border}`
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">L{level.level}</span>
                            {status === 'complete' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : status === 'in-progress' ? (
                              <Circle className="w-4 h-4 fill-current" />
                            ) : isBlocked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="text-xs font-medium truncate">{level.shortName}</div>
                        </div>

                        {/* Blocked tooltip */}
                        {isBlocked && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                              <div className="flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3 text-amber-400" />
                                <span>Requires: {blockingDep}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </button>

                      {idx < track.levels.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-300 mx-1 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-500" />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-slate-400 bg-white" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-slate-200 bg-white" />
          <span>Not Started</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
}
