import { MATURITY_STAGES } from '../data/constants';

export function MaturityLegend() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Maturity Levels
      </h3>
      <div className="flex items-center gap-1 mb-3">
        {MATURITY_STAGES.map((stage) => (
          <div
            key={stage.level}
            className="flex-1 h-2 rounded-full"
            style={{ backgroundColor: stage.color }}
            title={stage.name}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {MATURITY_STAGES.map((stage) => (
          <div key={stage.level} className="text-center">
            <div
              className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: stage.color }}
            >
              {stage.level}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {stage.shortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
