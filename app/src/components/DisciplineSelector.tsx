import {
  Mail,
  Award,
  Building,
  ShoppingCart,
  Headphones,
  Database,
} from 'lucide-react';
import { DISCIPLINES } from '../data/constants';
import type { DisciplineType } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Award,
  Building,
  ShoppingCart,
  Headphones,
  Database,
};

interface DisciplineSelectorProps {
  selectedDiscipline: DisciplineType;
  onSelect: (discipline: DisciplineType) => void;
}

export function DisciplineSelector({
  selectedDiscipline,
  onSelect,
}: DisciplineSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Salesforce Cloud
      </h3>
      <div className="flex flex-wrap gap-2">
        {DISCIPLINES.map((discipline) => {
          const Icon = iconMap[discipline.icon];
          const isSelected = selectedDiscipline === discipline.id;

          return (
            <button
              key={discipline.id}
              onClick={() => onSelect(discipline.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-merkle-blue text-white border-merkle-blue shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-merkle-blue hover:text-merkle-blue'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="font-medium">{discipline.shortName}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        {DISCIPLINES.find((d) => d.id === selectedDiscipline)?.description}
      </p>
    </div>
  );
}
