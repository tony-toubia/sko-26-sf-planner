/**
 * Unified Track System - Combines tracks from all disciplines
 * This file provides a single interface to access tracks based on selected disciplines
 */

import type { DisciplineType, TrackId, TrackLevel } from '../types';
import { TRACKS as MP_TRACKS, getTrackById as getMPTrackById, canStartLevel as mpCanStartLevel } from './tracks';
import { LOYALTY_TRACKS, type LoyaltyTrackId, type LoyaltyTrackLevel } from './loyaltyTracks';
import { COMMERCE_TRACKS, type CommerceTrackId, type CommerceTrackLevel } from './commerceTracks';

// Unified track type that combines both M&P, Loyalty, and Commerce tracks
export type UnifiedTrackId = TrackId | LoyaltyTrackId | CommerceTrackId;

// Map discipline types to their track arrays
const DISCIPLINE_TRACKS_MAP: Record<string, any[]> = {
  'messaging-personalization': MP_TRACKS,
  'loyalty': LOYALTY_TRACKS as any[], // Cast to match Track[] type
  'commerce': COMMERCE_TRACKS as any[],
  'service': [], // Coming soon
  'abm': [],     // ABX: Account-Based Marketing - tracks pending
  'abs': [],     // ABX: Account-Based Selling - tracks pending
  'absa': [],    // ABX: Account-Based Service & Advocacy - tracks pending
};

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

  const commerceTrack = COMMERCE_TRACKS.find(t => t.id === trackId);
  if (commerceTrack) return { ...commerceTrack, discipline: 'commerce' as DisciplineType };

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
    return mpCanStartLevel(trackId as TrackId, level as TrackLevel, assessedLevels).canStart;
  }

  // For Loyalty tracks, simplified logic (Level 1 always available, 2 requires 1, 3 requires 2)
  if (level === 1) return true;

  const previousLevel = level - 1;
  const previousKey = `${trackId}-${previousLevel}`;
  return assessedLevels.has(previousKey);
}

/**
 * Get assessment order (which levels should be done first)
 * This respects the dependency structure of the M&P maturity framework
 */
export function getAssessmentOrder(disciplines: DisciplineType[]): string[] {
  const order: string[] = [];
  const tracks = getTracksForDisciplines(disciplines);

  // For M&P discipline, use the proper dependency-based ordering
  const hasMPDiscipline = disciplines.includes('messaging-personalization');
  const hasLoyaltyDiscipline = disciplines.includes('loyalty');

  if (hasMPDiscipline) {
    // M&P Maturity Framework order (respects dependencies):
    // Phase 1: Data L1 (foundation for everything)
    order.push('data-identity-1');

    // Phase 1-2: Journeys L1, Content L1, Intelligence L1 (all require Data L1)
    order.push('journeys-1');
    order.push('content-channels-1');
    order.push('intelligence-1');

    // Phase 2-3: Data L2, then levels that depend on it
    order.push('data-identity-2');
    order.push('journeys-2');  // Requires Data L2
    order.push('content-channels-2');  // Can start after Content L1
    order.push('intelligence-2');

    // Phase 3-4: Advanced capabilities
    order.push('data-identity-3');
    order.push('journeys-3');
    order.push('content-channels-3');
    order.push('intelligence-3');  // Requires Data L2
  }

  if (hasLoyaltyDiscipline) {
    // Loyalty tracks - simple level-based progression
    const loyaltyTracks = tracks.filter(t => t.discipline === 'loyalty');
    for (let level = 1; level <= 3; level++) {
      for (const track of loyaltyTracks) {
        if (track.levels.some((l: any) => l.level === level)) {
          order.push(`${track.id}-${level}`);
        }
      }
    }
  }

  const hasCommerceDiscipline = disciplines.includes('commerce');
  if (hasCommerceDiscipline) {
    const commerceTracks = tracks.filter(t => t.discipline === 'commerce');
    for (let level = 1; level <= 3; level++) {
      for (const track of commerceTracks) {
        if (track.levels.some((l: any) => l.level === level)) {
          order.push(`${track.id}-${level}`);
        }
      }
    }
  }

  // Future: Add Service ordering here as it's implemented

  return order;
}
