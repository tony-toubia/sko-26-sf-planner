import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getAllChannelPriorities, saveChannelPriority, deleteChannelPriority } from '../../lib/referenceDataService';
import type { RefChannelPriority } from '../../types';

const INDUSTRY_OPTIONS = ['retail-cpg-qsr', 'financial-services', 'healthcare-life-sciences', 'manufacturing', 'travel-hospitality', 'media-entertainment', 'technology'];
const CHANNEL_OPTIONS = ['email', 'sms', 'push', 'ads', 'direct-mail', 'in-app'];
const PRIORITY_OPTIONS = ['critical', 'high', 'medium', 'low'];

export function ChannelPriorityManager() {
  const [items, setItems] = useState<RefChannelPriority[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<RefChannelPriority> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); setItems(await getAllChannelPriorities()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.industry || !editing?.channel || !editing?.priority) return;
    setSaving(true);
    await saveChannelPriority(editing as any);
    setSaving(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await deleteChannelPriority(id);
    await load();
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Channel Priorities</h2>
          <p className="text-sm text-gray-500 mt-1">{items.length} channel priority entries</p>
        </div>
        <button onClick={() => setEditing({ industry: '', channel: '', priority: 'high' as any, isActive: true })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Industry</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Channel</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Notes</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{item.industry}</td>
                <td className="px-4 py-3 font-medium text-gray-900 capitalize">{item.channel}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.priority === 'critical' ? 'bg-red-50 text-red-700' :
                    item.priority === 'high' ? 'bg-orange-50 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{item.priority}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{item.notes || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(item)} className="p-1 text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No entries found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? 'Edit' : 'New'} Channel Priority</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
                <select value={editing.industry || ''} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select...</option>
                  {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel *</label>
                <select value={editing.channel || ''} onChange={(e) => setEditing({ ...editing, channel: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select...</option>
                  {CHANNEL_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                <select value={editing.priority || ''} onChange={(e) => setEditing({ ...editing, priority: e.target.value as any })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                  {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" value={editing.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving || !editing.industry || !editing.channel} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
