import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { getAllTactics, saveTactic, deleteTactic } from '../../lib/referenceDataService';
import type { Tactic } from '../../types';

const DISCIPLINE_OPTIONS = ['messaging-personalization', 'loyalty', 'commerce', 'service'];
const INDUSTRY_OPTIONS = ['retail-cpg-qsr', 'financial-services', 'healthcare-life-sciences', 'manufacturing', 'travel-hospitality', 'media-entertainment', 'technology'];
const TRACK_OPTIONS = ['data-identity', 'journeys', 'content-channels', 'intelligence'];
const EFFORT_OPTIONS = ['low', 'medium', 'high'];
const CHANNEL_OPTIONS = ['email', 'sms', 'push', 'ads', 'direct-mail', 'in-app'];
const LIFECYCLE_OPTIONS = ['awareness', 'consideration', 'purchase', 'post-purchase', 'retention', 'loyalty'];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyTactic: Partial<Tactic> = {
  name: '',
  slug: '',
  description: '',
  disciplines: [],
  industries: [],
  tracks: [],
  phases: [],
  maturityLevelMin: 1,
  maturityLevelMax: 3,
  lifecycleStages: [],
  channelMix: [],
  expectedROI: undefined,
  implementationEffort: undefined,
  prerequisites: [],
  tags: [],
  isActive: true,
};

export function TacticsManager() {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Tactic> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getAllTactics();
    setTactics(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.name) return;
    setSaving(true);
    const slug = editing.slug || slugify(editing.name);
    await saveTactic({ ...editing, name: editing.name, slug } as any);
    setSaving(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tactic?')) return;
    await deleteTactic(id);
    await load();
  };

  const toggleArray = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const togglePhase = (arr: number[], value: number): number[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading tactics...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tactics / Plays</h2>
          <p className="text-sm text-gray-500 mt-1">Cross-discipline strategic plays that feed into AI plan generation</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyTactic })}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Tactic
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Disciplines</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Phases</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Effort</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Active</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tactics.map((tactic) => (
              <tr key={tactic.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{tactic.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{tactic.industries.length} industries</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {tactic.disciplines.map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{d.split('-')[0]}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{tactic.phases.join(', ')}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{tactic.implementationEffort || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${tactic.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {tactic.isActive ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(tactic)} className="p-1 text-gray-400 hover:text-gray-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(tactic.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {tactics.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No tactics yet. Add your first one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? 'Edit Tactic' : 'New Tactic'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Cross-Channel Welcome & Enrollment"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>

              {/* Disciplines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disciplines *</label>
                <div className="flex flex-wrap gap-2">
                  {DISCIPLINE_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setEditing({ ...editing, disciplines: toggleArray(editing.disciplines || [], d) as any })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        editing.disciplines?.includes(d as any) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industries *</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setEditing({ ...editing, industries: toggleArray(editing.industries || [], ind) as any })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        editing.industries?.includes(ind as any) ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracks</label>
                <div className="flex flex-wrap gap-2">
                  {TRACK_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setEditing({ ...editing, tracks: toggleArray(editing.tracks || [], t) })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        editing.tracks?.includes(t) ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phases + Maturity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phases *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((p) => (
                      <button
                        key={p}
                        onClick={() => setEditing({ ...editing, phases: togglePhase(editing.phases || [], p) })}
                        className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${
                          editing.phases?.includes(p) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Range</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={editing.maturityLevelMin ?? 1}
                      onChange={(e) => setEditing({ ...editing, maturityLevelMin: Number(e.target.value) })}
                      className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {[1, 2, 3].map((l) => <option key={l} value={l}>L{l}</option>)}
                    </select>
                    <span className="text-gray-400">to</span>
                    <select
                      value={editing.maturityLevelMax ?? 3}
                      onChange={(e) => setEditing({ ...editing, maturityLevelMax: Number(e.target.value) })}
                      className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {[1, 2, 3].map((l) => <option key={l} value={l}>L{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditing({ ...editing, channelMix: toggleArray(editing.channelMix || [], c) as any })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        editing.channelMix?.includes(c as any) ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifecycle Stages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lifecycle Stages</label>
                <div className="flex flex-wrap gap-2">
                  {LIFECYCLE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditing({ ...editing, lifecycleStages: toggleArray(editing.lifecycleStages || [], s) })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        editing.lifecycleStages?.includes(s) ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effort + ROI */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Effort</label>
                  <select
                    value={editing.implementationEffort || ''}
                    onChange={(e) => setEditing({ ...editing, implementationEffort: e.target.value as any || undefined })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select...</option>
                    {EFFORT_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI Metric</label>
                  <input
                    type="text"
                    value={editing.expectedROI?.metric || ''}
                    onChange={(e) => setEditing({ ...editing, expectedROI: { ...editing.expectedROI, metric: e.target.value, value: editing.expectedROI?.value || '' } })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., Welcome Transaction Rate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ROI Value</label>
                  <input
                    type="text"
                    value={editing.expectedROI?.value || ''}
                    onChange={(e) => setEditing({ ...editing, expectedROI: { ...editing.expectedROI, metric: editing.expectedROI?.metric || '', value: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., +320%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ROI Context</label>
                  <input
                    type="text"
                    value={editing.expectedROI?.context || ''}
                    onChange={(e) => setEditing({ ...editing, expectedROI: { ...editing.expectedROI, metric: editing.expectedROI?.metric || '', value: editing.expectedROI?.value || '', context: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., vs. promotional emails"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={(editing.tags || []).join(', ')}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="onboarding, lifecycle, multi-channel"
                />
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isActive ?? true}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.name || !editing.disciplines?.length || !editing.industries?.length || !editing.phases?.length}
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
