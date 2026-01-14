import { PHASES } from '../data/constants';
import type { Phase } from '../types';

interface PhaseFilterProps {
  selectedPhase: Phase | 'all';
  onSelect: (phase: Phase | 'all') => void;
}

export function PhaseFilter({ selectedPhase, onSelect }: PhaseFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Implementation Phase
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            selectedPhase === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Phases
        </button>
        {PHASES.map((phase) => (
          <button
            key={phase.phase}
            onClick={() => onSelect(phase.phase)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedPhase === phase.phase
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={
              selectedPhase === phase.phase
                ? { backgroundColor: phase.color }
                : undefined
            }
          >
            Phase {phase.phase}
          </button>
        ))}
      </div>
      {selectedPhase !== 'all' && (
        <p className="mt-3 text-sm text-gray-500">
          {PHASES.find((p) => p.phase === selectedPhase)?.name}:{' '}
          {PHASES.find((p) => p.phase === selectedPhase)?.description}
        </p>
      )}
    </div>
  );
}
