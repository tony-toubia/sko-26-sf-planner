import { useState, useEffect } from 'react';
import {
  Target,
  BarChart3,
  TrendingUp,
  Map,
  Radio,
  Package,
  Upload,
  LogOut,
  Trash2,
  Home,
  ClipboardList,
} from 'lucide-react';
import { AdminAuth } from './AdminAuth';
import { TacticsManager } from './TacticsManager';
import { KPIManager } from './KPIManager';
import { BenchmarkManager } from './BenchmarkManager';
import { JourneyManager } from './JourneyManager';
import { ChannelPriorityManager } from './ChannelPriorityManager';
import { OfferingManager } from './OfferingManager';
import { BulkImport } from './BulkImport';
import { AssessmentsManager } from './AssessmentsManager';
import { clearPlanCache } from '../../lib/referenceDataService';

type AdminSection = 'assessments' | 'tactics' | 'kpis' | 'benchmarks' | 'journeys' | 'channels' | 'offerings' | 'import';

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'tactics', label: 'Tactics / Plays', icon: Target },
  { id: 'kpis', label: 'KPIs', icon: BarChart3 },
  { id: 'benchmarks', label: 'ROI Benchmarks', icon: TrendingUp },
  { id: 'journeys', label: 'Journey Templates', icon: Map },
  { id: 'channels', label: 'Channel Priorities', icon: Radio },
  { id: 'offerings', label: 'Offerings', icon: Package },
  { id: 'import', label: 'Bulk Import', icon: Upload },
];

export function AdminLayout() {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('assessments');
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_email');
    if (stored) setAdminEmail(stored);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_email');
    setAdminEmail(null);
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    await clearPlanCache();
    setClearingCache(false);
  };

  if (!adminEmail) {
    return <AdminAuth onAuthenticated={setAdminEmail} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-sm text-slate-400 mt-1 truncate">{adminEmail}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-slate-700">
          <button
            onClick={handleClearCache}
            disabled={clearingCache}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {clearingCache ? 'Clearing...' : 'Clear Plan Cache'}
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to App
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeSection === 'assessments' && <AssessmentsManager />}
        {activeSection === 'tactics' && <TacticsManager />}
        {activeSection === 'kpis' && <KPIManager />}
        {activeSection === 'benchmarks' && <BenchmarkManager />}
        {activeSection === 'journeys' && <JourneyManager />}
        {activeSection === 'channels' && <ChannelPriorityManager />}
        {activeSection === 'offerings' && <OfferingManager />}
        {activeSection === 'import' && <BulkImport />}
      </div>
    </div>
  );
}
