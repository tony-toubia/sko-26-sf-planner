import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getAllROIBenchmarks, saveROIBenchmark, deleteROIBenchmark } from '../../lib/referenceDataService';
import type { RefROIBenchmark } from '../../types';

const INDUSTRY_OPTIONS = ['', 'retail-cpg-qsr', 'financial-services', 'healthcare-life-sciences', 'manufacturing', 'travel-hospitality', 'media-entertainment', 'technology'];
const SOURCE_OPTIONS = ['industry-average', 'merkle-benchmark', 'salesforce-benchmark'];

export function BenchmarkManager() {
  const [items, setItems] = useState<RefROIBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<RefROIBenchmark> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); setItems(await getAllROIBenchmarks()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.metric || !editing?.value) return;
    setSaving(true);
    await saveROIBenchmark(editing as any);
    setSaving(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this benchmark?')) return;
    await deleteROIBenchmark(id);
    await load();
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ROI Benchmarks</h2>
          <p className="text-sm text-gray-500 mt-1">{items.length} benchmarks. General benchmarks have no industry.</p>
        </div>
        <button onClick={() => setEditing({ metric: '', value: '', isActive: true })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
          <Plus className="w-4 h-4" /> Add Benchmark
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Metric</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Value</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Industry</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Phase</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Source</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{item.metric}</td>
                <td className="px-4 py-3 text-gray-900 font-semibold">{item.value}</td>
                <td className="px-4 py-3 text-gray-600">{item.industry || <span className="text-gray-400 italic">General</span>}</td>
                <td className="px-4 py-3 text-gray-600">{item.phase || '-'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{item.source || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(item)} className="p-1 text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No benchmarks found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? 'Edit Benchmark' : 'New Benchmark'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metric *</label>
                <input type="text" value={editing.metric || ''} onChange={(e) => setEditing({ ...editing, metric: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., Email Revenue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input type="text" value={editing.value || ''} onChange={(e) => setEditing({ ...editing, value: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., +35%" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                <input type="text" value={editing.context || ''} onChange={(e) => setEditing({ ...editing, context: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select value={editing.industry || ''} onChange={(e) => setEditing({ ...editing, industry: e.target.value || undefined })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">General</option>
                    {INDUSTRY_OPTIONS.filter(Boolean).map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                  <select value={editing.phase ?? ''} onChange={(e) => setEditing({ ...editing, phase: e.target.value ? Number(e.target.value) : undefined })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Any</option>
                    {[1, 2, 3, 4].map((p) => <option key={p} value={p}>Phase {p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select value={editing.source || ''} onChange={(e) => setEditing({ ...editing, source: e.target.value as any || undefined })} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Select...</option>
                    {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving || !editing.metric || !editing.value} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
