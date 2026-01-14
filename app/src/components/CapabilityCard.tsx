import {
  Cloud,
  Database,
  Send,
  UserPlus,
  Layers,
  BarChart,
  Clock,
  ShoppingCart,
  Share2,
  PieChart,
  Sparkles,
  Fingerprint,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import type { Capability } from '../types';
import { MATURITY_STAGES, PHASES } from '../data/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud,
  Database,
  Send,
  UserPlus,
  Layers,
  BarChart,
  Clock,
  ShoppingCart,
  Share2,
  PieChart,
  Sparkles,
  Fingerprint,
  TrendingUp,
};

interface CapabilityCardProps {
  capability: Capability;
  onClick: () => void;
  isHighlighted?: boolean;
}

export function CapabilityCard({
  capability,
  onClick,
  isHighlighted = false,
}: CapabilityCardProps) {
  const maturityStage = MATURITY_STAGES[capability.maturityLevel];
  const phase = PHASES.find((p) => p.phase === capability.phase);
  const Icon = iconMap[capability.icon || ''] || HelpCircle;

  const journeyTypeColors = {
    'above-the-line': 'from-cyan-400 to-blue-500',
    transactional: 'from-amber-400 to-orange-500',
    'below-the-line': 'from-blue-600 to-indigo-700',
  };

  return (
    <button
      onClick={onClick}
      className={`capability-card w-full text-left p-4 rounded-xl border-2 bg-white transition-all duration-200 ${
        isHighlighted
          ? 'border-merkle-blue shadow-lg ring-2 ring-merkle-blue/20'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: maturityStage.color }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
            {capability.shortName}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2">
            {capability.description.slice(0, 80)}...
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span
          className="px-2 py-0.5 rounded text-xs font-medium text-white"
          style={{ backgroundColor: phase?.color }}
        >
          P{capability.phase}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium text-white bg-gradient-to-r ${
            journeyTypeColors[capability.journeyType]
          }`}
        >
          {capability.journeyType === 'above-the-line'
            ? 'ATL'
            : capability.journeyType === 'below-the-line'
            ? 'BTL'
            : 'TXN'}
        </span>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: `${maturityStage.color}20`,
            color: maturityStage.color,
          }}
        >
          L{capability.maturityLevel}
        </span>
      </div>
    </button>
  );
}
