/**
 * Unified Track System - Combines tracks from all disciplines
 * This file provides a single interface to access tracks based on selected disciplines
 */

import type { DisciplineType, TrackId, TrackLevel } from '../types';
import { TRACKS as MP_TRACKS, getTrackById as getMPTrackById, canStartLevel as mpCanStartLevel } from './tracks';
import { LOYALTY_TRACKS, type LoyaltyTrackId, type LoyaltyTrackLevel } from './loyaltyTracks';

// Unified track type that combines both M&P and Loyalty tracks
export type UnifiedTrackId = TrackId | LoyaltyTrackId;

// Map discipline types to their track arrays
const DISCIPLINE_TRACKS_MAP = {
  'messaging-personalization': MP_TRACKS,
  'loyalty': LOYALTY_TRACKS as any[], // Cast to match Track[] type
} as const;

/**
 * Get all tracks for selected disciplines
 */
export function getTracksForDisciplines(disciplines: DisciplineType[]): any[] {
  const allTracks: any[] = [];

  for (const discipline of disciplines) {
    const tracks = DISCIPLINE_TRACKS_MAP[discipline];
    if (tracks) {
      // Add discipline metadata to each track for identification
      allTracks.push(...tracks.map(track => ({
        ...track,
        discipline,
      })));
    }
  }

  return allTracks;
}

/**
 * Get track by ID across all disciplines
 */
export function getTrackById(trackId: string, disciplines?: DisciplineType[]): any {
  // If disciplines provided, search only those
  if (disciplines) {
    const tracks = getTracksForDisciplines(disciplines);
    return tracks.find(t => t.id === trackId);
  }

  // Otherwise search all tracks
  const mpTrack = getMPTrackById(trackId as TrackId);
  if (mpTrack) return { ...mpTrack, discipline: 'messaging-personalization' as DisciplineType };

  const loyaltyTrack = LOYALTY_TRACKS.find(t => t.id === trackId);
  if (loyaltyTrack) return { ...loyaltyTrack, discipline: 'loyalty' as DisciplineType };

  return undefined;
}

/**
 * Get track level definition
 */
export function getTrackLevel(trackId: string, level: TrackLevel | LoyaltyTrackLevel, disciplines?: DisciplineType[]): any {
  const track = getTrackById(trackId, disciplines);
  if (!track) return undefined;
  return track.levels.find((l: any) => l.level === level);
}

/**
 * Get capabilities for a track level
 */
export function getCapabilitiesForTrackLevel(trackId: string, level: TrackLevel | LoyaltyTrackLevel, disciplines?: DisciplineType[]): string[] {
  const trackLevel = getTrackLevel(trackId, level, disciplines);
  return trackLevel?.capabilities || [];
}

/**
 * Get required dependencies (always returns empty array for now)
 * TODO: Implement cross-discipline dependencies
 */
export function getRequiredDependencies(_trackId: string, _level: TrackLevel | LoyaltyTrackLevel): string[] {
  // Simplified - return empty array
  // TODO: Implement proper dependency tracking
  return [];
}

/**
 * Check if a level can be started based on dependencies
 */
export function canStartLevel(
  trackId: string,
  level: TrackLevel | LoyaltyTrackLevel,
  assessedLevels: Set<string>
): boolean {
  // For M&P tracks, use existing logic
  if (trackId in { 'data-identity': true, 'journeys': true, 'content-channels': true, 'intelligence': true }) {
    return mpCanStartLevel(trackId as TrackId, level as TrackLevel, assessedLevels);
  }

  // For Loyalty tracks, simplified logic (Level 1 always available, 2 requires 1, 3 requires 2)
  if (level === 1) return true;

  const previousLevel = level - 1;
  const previousKey = `${trackId}-${previousLevel}`;
  return assessedLevels.has(previousKey);
}

/**
 * Get assessment order (which levels should be done first)
 */
export function getAssessmentOrder(disciplines: DisciplineType[]): string[] {
  const order: string[] = [];
  const tracks = getTracksForDisciplines(disciplines);

  // Simple ordering: Level 1 of all tracks, then Level 2, then Level 3
  for (let level = 1; level <= 3; level++) {
    for (const track of tracks) {
      if (track.levels.some((l: any) => l.level === level)) {
        order.push(`${track.id}-${level}`);
      }
    }
  }

  return order;
}
