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
  ClipboardCheck,
  Pencil,
  Building2,
  Users,
  Gift,
  TrendingUp,
} from 'lucide-react';
import { getRequiredDependencies as getMPRequiredDependencies, getTrackById as getMPTrackById } from '../data/tracks';
import type { TrackId, TrackLevel, TrackLevelStatus } from '../types';

interface TrackProgressProps {
  tracks: any[]; // Array of tracks to display
  trackStatuses: Record<string, TrackLevelStatus>; // key: `${trackId}-${level}`
  assessedLevels: Set<string>; // Set of `${trackId}-${level}` keys that have been assessed
  onLevelClick?: (trackId: TrackId, level: TrackLevel) => void;
  currentTrack?: TrackId;
  currentLevel?: TrackLevel;
  compact?: boolean;
}

const TRACK_ICONS: Record<string, React.ElementType> = {
  // M&P tracks
  'data-identity': Database,
  journeys: Route,
  'content-channels': Share2,
  intelligence: Brain,
  // Loyalty tracks
  'program-foundation': Building2,
  'member-engagement': Users,
  'rewards-offers': Gift,
  'loyalty-intelligence': TrendingUp,
};

const TRACK_COLORS: Record<string, { bg: string; border: string; text: string; fill: string }> = {
  // M&P tracks
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
  // Loyalty tracks
  'program-foundation': {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    fill: 'bg-indigo-500',
  },
  'member-engagement': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    fill: 'bg-purple-500',
  },
  'rewards-offers': {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    fill: 'bg-pink-500',
  },
  'loyalty-intelligence': {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    fill: 'bg-rose-500',
  },
};

function getLevelStatus(
  trackId: string,
  level: number,
  trackStatuses: Record<string, TrackLevelStatus>
): TrackLevelStatus {
  return trackStatuses[`${trackId}-${level}`] || 'not-started';
}

function isLevelBlocked(
  trackId: string,
  level: number,
  trackStatuses: Record<string, TrackLevelStatus>
): boolean {
  const requiredDeps = getMPRequiredDependencies(trackId as TrackId, level as TrackLevel);
  for (const dep of requiredDeps) {
    const depStatus = getLevelStatus(dep.fromTrack, dep.fromLevel, trackStatuses);
    if (depStatus !== 'complete') {
      return true;
    }
  }
  return false;
}

function getBlockingDependency(
  trackId: string,
  level: number,
  trackStatuses: Record<string, TrackLevelStatus>
): string | null {
  const requiredDeps = getMPRequiredDependencies(trackId as TrackId, level as TrackLevel);
  for (const dep of requiredDeps) {
    const depStatus = getLevelStatus(dep.fromTrack, dep.fromLevel, trackStatuses);
    if (depStatus !== 'complete') {
      const depTrack = getMPTrackById(dep.fromTrack);
      const depLevel = depTrack?.levels.find((l) => l.level === dep.fromLevel);
      return `${depTrack?.shortName} L${dep.fromLevel}: ${depLevel?.shortName}`;
    }
  }
  return null;
}

export function TrackProgress({
  tracks,
  trackStatuses,
  assessedLevels,
  onLevelClick,
  currentTrack,
  currentLevel,
  compact = false,
}: TrackProgressProps) {
  const completionStats = useMemo(() => {
    let assessed = 0;
    let total = 0;

    for (const track of tracks) {
      for (const level of track.levels) {
        total++;
        const key = `${track.id}-${level.level}`;
        if (assessedLevels.has(key)) assessed++;
      }
    }

    return { assessed, total, percentage: Math.round((assessed / total) * 100) };
  }, [tracks, assessedLevels]);

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Assessment Progress</h3>
          <span className="text-sm font-medium text-slate-600">
            {completionStats.assessed}/{completionStats.total} assessed
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionStats.percentage}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {tracks.map((track) => {
            const Icon = TRACK_ICONS[track.id];
            const colors = TRACK_COLORS[track.id];
            const levelsAssessed = track.levels.filter(
              (l: any) => assessedLevels.has(`${track.id}-${l.level}`)
            ).length;

            return (
              <div
                key={track.id}
                className={`flex flex-col items-center p-2 rounded-lg ${colors.bg} ${colors.border} border`}
              >
                <Icon className={`w-4 h-4 ${colors.text} mb-1`} />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {levelsAssessed}/3
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900">Maturity Tracks</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Click each level to assess your current maturity
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xl md:text-2xl font-bold text-slate-900">{completionStats.percentage}%</div>
          <div className="text-xs text-slate-500">
            {completionStats.assessed} of {completionStats.total} levels assessed
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => {
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {track.levels.map((level: any, idx: number) => {
                  const key = `${track.id}-${level.level}`;
                  const status = getLevelStatus(track.id, level.level, trackStatuses);
                  const isAssessed = assessedLevels.has(key);
                  const isBlocked = isLevelBlocked(track.id, level.level, trackStatuses);
                  const blockingDep = isBlocked
                    ? getBlockingDependency(track.id, level.level, trackStatuses)
                    : null;
                  const isCurrent = currentTrack === track.id && currentLevel === level.level;

                  // Status label for display
                  const statusLabel = status === 'complete' ? 'Mature' : status === 'in-progress' ? 'Building' : 'Gap';

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
                            : isAssessed
                              ? `${level.name}: ${statusLabel} (click to edit)`
                              : `${level.name}: Not yet assessed`
                        }
                      >
                        <div
                          className={`
                            rounded-lg p-2 md:p-3 border-2 transition-all relative
                            ${isCurrent ? 'ring-2 ring-offset-2 ring-slate-400' : ''}
                            ${
                              isAssessed
                                ? status === 'complete'
                                  ? `${colors.fill} border-transparent text-white`
                                  : status === 'in-progress'
                                    ? `bg-amber-50 border-amber-300 text-amber-800`
                                    : `bg-slate-50 border-slate-300 text-slate-700`
                                : isBlocked
                                  ? 'bg-slate-100 border-slate-200 text-slate-400'
                                  : `bg-white border-dashed border-slate-300 text-slate-500 hover:border-slate-400`
                            }
                          `}
                        >
                          {/* Assessed badge */}
                          {isAssessed && (
                            <div className={`absolute -top-1.5 -right-1.5 rounded-full p-0.5 ${
                              status === 'complete' ? 'bg-white' : 'bg-slate-700'
                            }`}>
                              <ClipboardCheck className={`w-3 h-3 ${
                                status === 'complete' ? colors.text : 'text-white'
                              }`} />
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">L{level.level}</span>
                            {isAssessed ? (
                              status === 'complete' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : status === 'in-progress' ? (
                                <Circle className="w-4 h-4 fill-current" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )
                            ) : isBlocked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Pencil className="w-3 h-3 opacity-50" />
                            )}
                          </div>
                          <div className="text-xs font-medium truncate">{level.shortName}</div>

                          {/* Status indicator for assessed items */}
                          {isAssessed && (
                            <div className={`text-[10px] mt-1 font-medium ${
                              status === 'complete' ? 'text-white/80' : ''
                            }`}>
                              {statusLabel}
                            </div>
                          )}

                          {/* Not assessed indicator */}
                          {!isAssessed && !isBlocked && (
                            <div className="text-[10px] mt-1 text-slate-400 italic">
                              Tap to assess
                            </div>
                          )}
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
                        <ChevronRight className="w-4 h-4 text-slate-300 mx-1 flex-shrink-0 hidden sm:block" />
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
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Maturity:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-500" />
          <span>Mature</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-300" />
          <span>Building</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-200" />
          <span>Gap</span>
        </div>
        <span className="mx-1">|</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-dashed border-slate-300 bg-white" />
          <span>Not assessed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
}
