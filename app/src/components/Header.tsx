import { LayoutGrid, MessageSquare, DollarSign, Presentation } from 'lucide-react';

export type ViewType = 'capabilities' | 'assistant' | 'value';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onShowSlides?: () => void;
}

export function Header({ currentView, onViewChange, onShowSlides }: HeaderProps) {
  const navItems: { id: ViewType; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'capabilities', label: 'Capabilities', icon: LayoutGrid },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'value', label: 'SF Value', icon: DollarSign },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-merkle-blue to-merkle-teal rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Maturity Planner</h1>
              <p className="text-xs text-gray-500">Salesforce Capability Assessment Tool</p>
            </div>
          </div>
        </div>

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
              <span className="font-medium">{label}</span>
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
                <span className="font-medium">Pitch Deck</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
