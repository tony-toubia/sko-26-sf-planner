import { ShoppingBag, UtensilsCrossed, Landmark, Heart, Factory, Plane, Tv, Cpu } from 'lucide-react';
import type { IndustryType } from '../types';
import { INDUSTRIES } from '../data/industries';

interface IndustrySelectorProps {
  selectedIndustry: IndustryType | null;
  onSelect: (industry: IndustryType) => void;
  compact?: boolean;
}

const INDUSTRY_ICONS: Record<IndustryType, React.ReactNode> = {
  'retail-cpg': <ShoppingBag className="w-4 h-4" />,
  'qsr-restaurants': <UtensilsCrossed className="w-4 h-4" />,
  'financial-services': <Landmark className="w-4 h-4" />,
  'healthcare-life-sciences': <Heart className="w-4 h-4" />,
  'manufacturing': <Factory className="w-4 h-4" />,
  'travel-hospitality': <Plane className="w-4 h-4" />,
  'media-entertainment': <Tv className="w-4 h-4" />,
  'technology': <Cpu className="w-4 h-4" />,
};

export function IndustrySelector({ selectedIndustry, onSelect, compact = false }: IndustrySelectorProps) {
  const industries = Object.values(INDUSTRIES);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Industry:</span>
        <select
          value={selectedIndustry || ''}
          onChange={(e) => onSelect(e.target.value as IndustryType)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-merkle-blue"
        >
          <option value="" disabled>Select industry...</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.shortName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Industry</h3>
        {selectedIndustry && (
          <span className="text-xs text-gray-500">
            Capabilities tailored for {INDUSTRIES[selectedIndustry].shortName}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
              selectedIndustry === industry.id
                ? 'border-merkle-blue bg-merkle-blue/5 text-merkle-blue'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {INDUSTRY_ICONS[industry.id]}
            <span className="text-sm font-medium">{industry.shortName}</span>
          </button>
        ))}
      </div>
      {selectedIndustry && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{INDUSTRIES[selectedIndustry].description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {INDUSTRIES[selectedIndustry].typicalPriorities.slice(0, 3).map((priority, i) => (
              <span key={i} className="px-2 py-0.5 bg-merkle-blue/10 text-merkle-blue text-xs rounded-full">
                {priority}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
