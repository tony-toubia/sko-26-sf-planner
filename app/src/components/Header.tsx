import { LayoutGrid, MessageSquare, DollarSign, Presentation, Home, Mail } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { INDUSTRIES } from '../data/industries';

export type ViewType = 'capabilities' | 'assistant' | 'value';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onShowSlides?: () => void;
  showLanding?: boolean;
  onGoToLanding?: () => void;
}

export function Header({ currentView, onViewChange, onShowSlides, showLanding, onGoToLanding }: HeaderProps) {
  const { assessment, isAssessmentMode, selectedIndustry, marketingFoundation } = useAssessment();

  const navItems: { id: ViewType; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'capabilities', label: 'Assessment', icon: LayoutGrid },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'value', label: 'Value Prop', icon: DollarSign },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-merkle-blue to-salesforce-blue rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">M&P Maturity Navigator</h1>
              <p className="text-xs text-gray-500">Messaging & Personalization Assessment</p>
            </div>
          </button>

          {/* Assessment Context Badge */}
          {isAssessmentMode && assessment && (
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <div className="px-3 py-1 bg-merkle-blue/10 rounded-full">
                <span className="text-sm font-medium text-merkle-blue">{assessment.clientName}</span>
              </div>
              {selectedIndustry && (
                <div className="px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm text-gray-600">{INDUSTRIES[selectedIndustry]?.shortName}</span>
                </div>
              )}
              {marketingFoundation && (
                <div className={`px-3 py-1 rounded-full ${
                  marketingFoundation === 'mc-advanced'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className="text-sm">{marketingFoundation === 'mc-advanced' ? 'MC Advanced' : 'MC Engagement'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation - only show when not on landing page */}
        {!showLanding && (
          <nav className="flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === id
                    ? 'bg-merkle-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">{label}</span>
              </button>
            ))}

            {onShowSlides && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button
                  onClick={onShowSlides}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                >
                  <Presentation className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">Pitch Deck</span>
                </button>
              </>
            )}

            {onGoToLanding && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button
                  onClick={onGoToLanding}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  title="New Assessment"
                >
                  <Home className="w-4 h-4" />
                </button>
              </>
            )}
          </nav>
        )}

        {/* Landing page - just show pitch deck button */}
        {showLanding && onShowSlides && (
          <button
            onClick={onShowSlides}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
          >
            <Presentation className="w-4 h-4" />
            <span className="font-medium">Pitch Deck</span>
          </button>
        )}
      </div>
    </header>
  );
}
