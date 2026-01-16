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
          style={{ backgroundColor: phase?.color }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {capability.shortName}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2">
            {capability.description.slice(0, 100)}...
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
            capability.journeyType === 'above-the-line'
              ? 'bg-gradient-to-r from-cyan-400 to-teal-500'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700'
          }`}
        >
          {capability.journeyType === 'above-the-line' ? 'Activation' : 'Data Mgmt'}
        </span>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: `${maturityStage.color}20`,
            color: maturityStage.color,
          }}
        >
          Level {capability.maturityLevel}
        </span>
      </div>
    </button>
  );
}
