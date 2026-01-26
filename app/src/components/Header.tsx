import { LayoutGrid, MessageSquare, DollarSign, Presentation, Mail, ChevronRight } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export type ViewType = 'capabilities' | 'assistant' | 'value';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onShowSlides?: () => void;
  showLanding?: boolean;
  onGoToLanding?: () => void;
}

export function Header({ currentView, onViewChange, onShowSlides, showLanding, onGoToLanding }: HeaderProps) {
  const { assessment, isAssessmentMode } = useAssessment();

  const navItems: { id: ViewType; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'capabilities', label: 'Assessment', icon: LayoutGrid },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'value', label: 'Value Prop', icon: DollarSign },
  ];

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo and breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900 hidden sm:block">
              M&P Navigator
            </span>
          </button>

          {/* Breadcrumb showing client name when in assessment */}
          {isAssessmentMode && assessment && !showLanding && (
            <div className="hidden md:flex items-center text-sm text-slate-500">
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-slate-700">{assessment.clientName}</span>
            </div>
          )}
        </div>

        {/* Center: Primary Navigation */}
        {!showLanding && (
          <nav className="flex items-center">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${currentView === id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Right: Secondary actions */}
        <div className="flex items-center gap-2">
          {onShowSlides && (
            <button
              onClick={onShowSlides}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Pitch Deck</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
