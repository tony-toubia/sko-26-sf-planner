import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getAllJourneyTemplates, saveJourneyTemplate, deleteJourneyTemplate } from '../../lib/referenceDataService';
import type { RefJourneyTemplate } from '../../types';

const INDUSTRY_OPTIONS = ['retail-cpg-qsr', 'financial-services', 'healthcare-life-sciences', 'manufacturing', 'travel-hospitality', 'media-entertainment', 'technology'];
const RELEVANCE_OPTIONS = ['critical', 'high', 'medium', 'low'];
const CHANNEL_OPTIONS = ['email', 'sms', 'push', 'ads', 'direct-mail', 'in-app'];

export function JourneyManager() {
  const [items, setItems] = useState<RefJourneyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<RefJourneyTemplate> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState('');

  const load = async () => { setLoading(true); setItems(await getAllJourneyTemplates()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.name || !editing?.industry || !editing?.relevance) return;
    setSaving(true);
    await saveJourneyTemplate(editing as any);
    setSaving(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await deleteJourneyTemplate(id);
    await load();
  };

  const filtered = filterIndustry ? items.filter((j) => j.industry === filterIndustry) : items;

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Journey Templates</h2>
          <p className="text-sm text-gray-500 mt-1">{items.length} journey templates</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="p-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Industries</option>
            {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <button onClick={() => setEditing({ name: '', industry: '', relevance: 'high' as any, channels: [], isActive: true })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
            <Plus className="w-4 h-4" /> Add Journey
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Industry</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Relevance</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Benchmark</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-gray-600">{item.industry}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.relevance === 'critical' ? 'bg-red-50 text-red-700' :
                    item.relevance === 'high' ? 'bg-orange-50 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{item.relevance}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{item.benchmark || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(item)} className="p-1 text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No journeys found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? 'Edit Journey' : 'New Journey'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
                  <select value={editing.industry || ''} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select...</option>
                    {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relevance *</label>
                  <select value={editing.relevance || ''} onChange={(e) => setEditing({ ...editing, relevance: e.target.value as any })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    {RELEVANCE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benchmark</label>
                <input type="text" value={editing.benchmark || ''} onChange={(e) => setEditing({ ...editing, benchmark: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={editing.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_OPTIONS.map((c) => (
                    <button key={c} onClick={() => setEditing({ ...editing, channels: (editing.channels || []).includes(c as any) ? (editing.channels || []).filter((x) => x !== c) : [...(editing.channels || []), c] as any })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${(editing.channels || []).includes(c as any) ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving || !editing.name || !editing.industry} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
