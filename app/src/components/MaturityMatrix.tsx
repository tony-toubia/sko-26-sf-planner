import { useState } from 'react';
import type { Capability, DisciplineType, Phase } from '../types';
import { MATURITY_STAGES, PHASES } from '../data/constants';
import { getCapabilitiesByDiscipline } from '../data/capabilities';
import { CapabilityCard } from './CapabilityCard';
import { CapabilityModal } from './CapabilityModal';
import { DisciplineSelector } from './DisciplineSelector';
import { MaturityLegend } from './MaturityLegend';
import { PhaseFilter } from './PhaseFilter';

export function MaturityMatrix() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineType>('messaging-personalization');
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all');
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);

  const capabilities = getCapabilitiesByDiscipline(selectedDiscipline);
  const filteredCapabilities = selectedPhase === 'all'
    ? capabilities
    : capabilities.filter((c) => c.phase === selectedPhase);

  // Group capabilities by maturity level
  const capabilitiesByLevel = MATURITY_STAGES.reduce((acc, stage) => {
    acc[stage.level] = filteredCapabilities.filter((c) => c.maturityLevel === stage.level);
    return acc;
  }, {} as Record<number, Capability[]>);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DisciplineSelector
          selectedDiscipline={selectedDiscipline}
          onSelect={setSelectedDiscipline}
        />
        <PhaseFilter selectedPhase={selectedPhase} onSelect={setSelectedPhase} />
      </div>

      <MaturityLegend />

      {/* Matrix Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Capability Matrix ({filteredCapabilities.length} capabilities)
        </h3>

        {selectedPhase === 'all' ? (
          // View grouped by maturity level
          <div className="space-y-6">
            {MATURITY_STAGES.map((stage) => {
              const stageCapabilities = capabilitiesByLevel[stage.level];
              if (stageCapabilities.length === 0) return null;

              return (
                <div key={stage.level}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: stage.color }}
                    >
                      {stage.level}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                      <p className="text-sm text-gray-500">{stage.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-11">
                    {stageCapabilities.map((capability) => (
                      <CapabilityCard
                        key={capability.id}
                        capability={capability}
                        onClick={() => setSelectedCapability(capability)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // View for single phase - show all capabilities
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCapabilities.map((capability) => (
              <CapabilityCard
                key={capability.id}
                capability={capability}
                onClick={() => setSelectedCapability(capability)}
              />
            ))}
          </div>
        )}

        {filteredCapabilities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No capabilities found for this discipline and phase combination.</p>
            <p className="text-sm mt-2">
              Try selecting "All Phases" or a different discipline.
            </p>
          </div>
        )}
      </div>

      {/* Path to Value - Phase Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Path to Value</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase) => {
            const phaseCapabilities = capabilities.filter((c) => c.phase === phase.phase);
            return (
              <div
                key={phase.phase}
                className="p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                style={{
                  borderColor: selectedPhase === phase.phase ? phase.color : '#e5e7eb',
                  backgroundColor: selectedPhase === phase.phase ? `${phase.color}10` : 'white',
                }}
                onClick={() => setSelectedPhase(phase.phase)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.phase}
                  </div>
                  <span className="font-semibold text-gray-900">Phase {phase.phase}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{phase.name.replace(`Phase ${phase.phase}: `, '')}</p>
                <div className="text-sm text-gray-500">
                  {phaseCapabilities.length} capabilities
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedCapability && (
        <CapabilityModal
          capability={selectedCapability}
          onClose={() => setSelectedCapability(null)}
        />
      )}
    </div>
  );
}
