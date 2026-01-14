import { LayoutGrid, Users, MessageSquare, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: 'matrix' | 'assessment' | 'chat';
  onViewChange: (view: 'matrix' | 'assessment' | 'chat') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-merkle-blue to-merkle-teal rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Maturity Matrix</h1>
              <p className="text-xs text-gray-500">Salesforce Capability Planner</p>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'matrix'
                ? 'bg-merkle-blue text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="font-medium">Matrix</span>
          </button>
          <button
            onClick={() => onViewChange('assessment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'assessment'
                ? 'bg-merkle-blue text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-medium">Assessment</span>
          </button>
          <button
            onClick={() => onViewChange('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'chat'
                ? 'bg-merkle-blue text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">AI Chat</span>
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
