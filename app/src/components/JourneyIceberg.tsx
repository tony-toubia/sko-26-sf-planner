import { Eye, ShoppingBag, Layers, ChevronDown } from 'lucide-react';
import { JOURNEY_CATEGORIES } from '../data/constants';
import type { Capability } from '../types';

interface JourneyIcebergProps {
  capabilities: Capability[];
  onCapabilityClick?: (capability: Capability) => void;
}

export function JourneyIceberg({ capabilities, onCapabilityClick }: JourneyIcebergProps) {
  const aboveTheLineCapabilities = capabilities.filter(
    (c) => c.journeyType === 'above-the-line'
  );
  const transactionalCapabilities = capabilities.filter(
    (c) => c.journeyType === 'transactional'
  );
  const belowTheLineCapabilities = capabilities.filter(
    (c) => c.journeyType === 'below-the-line'
  );

  const journeyInfo = {
    'above-the-line': JOURNEY_CATEGORIES.find((j) => j.type === 'above-the-line'),
    transactional: JOURNEY_CATEGORIES.find((j) => j.type === 'transactional'),
    'below-the-line': JOURNEY_CATEGORIES.find((j) => j.type === 'below-the-line'),
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Journey Iceberg</h3>
        <p className="text-sm text-gray-500">
          Visualizing the depth of customer journey capabilities
        </p>
      </div>

      <div className="relative">
        {/* Water line indicator */}
        <div className="absolute left-0 right-0 top-[33%] border-t-2 border-dashed border-blue-400 z-10">
          <span className="absolute -top-3 left-4 bg-white px-2 text-xs text-blue-500 font-medium">
            ~ Water Line ~
          </span>
        </div>

        {/* Above the Line */}
        <div className="iceberg-above p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {journeyInfo['above-the-line']?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {aboveTheLineCapabilities.length} capabilities
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {journeyInfo['above-the-line']?.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-gray-500 font-medium">Examples:</span>
            {journeyInfo['above-the-line']?.examples.map((ex, i) => (
              <span key={i} className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                {ex}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {aboveTheLineCapabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => onCapabilityClick?.(cap)}
                className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors shadow-sm"
              >
                {cap.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Transactional - at the water line */}
        <div className="bg-gradient-to-b from-cyan-100 to-blue-200 p-6 border-t border-cyan-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {journeyInfo['transactional']?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {transactionalCapabilities.length} capabilities
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {journeyInfo['transactional']?.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-gray-500 font-medium">Examples:</span>
            {journeyInfo['transactional']?.examples.map((ex, i) => (
              <span key={i} className="text-xs bg-white/50 px-2 py-1 rounded-full text-gray-700">
                {ex}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {transactionalCapabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => onCapabilityClick?.(cap)}
                className="px-3 py-1.5 bg-white/80 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors shadow-sm"
              >
                {cap.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Below the Line */}
        <div className="iceberg-below p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {journeyInfo['below-the-line']?.name}
              </h4>
              <p className="text-sm text-blue-200">
                {belowTheLineCapabilities.length} capabilities
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-100 mb-4">
            {journeyInfo['below-the-line']?.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-blue-200 font-medium">Examples:</span>
            {journeyInfo['below-the-line']?.examples.map((ex, i) => (
              <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full text-blue-100">
                {ex}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {belowTheLineCapabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => onCapabilityClick?.(cap)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-colors"
              >
                {cap.shortName}
              </button>
            ))}
          </div>

          {/* Depth indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-200">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span className="text-xs">Deeper data integration required</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
