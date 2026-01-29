import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getAllOfferings, saveOffering, deleteOffering } from '../../lib/referenceDataService';
import type { RefOffering } from '../../types';

const TYPE_OPTIONS = ['implementation', 'retainer', 'staff-aug', 'advisory', 'managed-services'];
const DISCIPLINE_OPTIONS = ['messaging-personalization', 'loyalty', 'commerce', 'service'];
const SIZING_OPTIONS = ['', 'S', 'M', 'L', 'Enterprise'];

export function OfferingManager() {
  const [items, setItems] = useState<RefOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<RefOffering> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); setItems(await getAllOfferings()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.type || !editing?.name) return;
    setSaving(true);
    await saveOffering(editing as any);
    setSaving(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await deleteOffering(id);
    await load();
  };

  const toggleDiscipline = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Offerings</h2>
          <p className="text-sm text-gray-500 mt-1">{items.length} service offerings</p>
        </div>
        <button onClick={() => setEditing({ type: '', name: '', disciplines: [], isActive: true })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
          <Plus className="w-4 h-4" /> Add Offering
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Sizing</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Disciplines</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{item.type}</span></td>
                <td className="px-4 py-3 text-gray-600">{item.sizing || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.disciplines.map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{d.split('-')[0]}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(item)} className="p-1 text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No offerings found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? 'Edit' : 'New'} Offering</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={editing.type || ''} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select...</option>
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizing</label>
                  <select value={editing.sizing || ''} onChange={(e) => setEditing({ ...editing, sizing: e.target.value || undefined })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    {SIZING_OPTIONS.map((s) => <option key={s} value={s}>{s || 'None'}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disciplines</label>
                <div className="flex flex-wrap gap-2">
                  {DISCIPLINE_OPTIONS.map((d) => (
                    <button key={d} onClick={() => setEditing({ ...editing, disciplines: toggleDiscipline(editing.disciplines || [], d) as any })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${(editing.disciplines || []).includes(d as any) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving || !editing.type || !editing.name} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
