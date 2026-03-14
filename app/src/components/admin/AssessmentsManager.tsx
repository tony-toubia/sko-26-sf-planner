import { useState, useEffect, useMemo } from 'react';
import {
  Loader2, Trash2, Pencil, ChevronDown, ChevronUp, ExternalLink,
  RefreshCw, Search, X, Save, CheckCircle, Clock, FileText, AlertCircle,
} from 'lucide-react';
import { assessmentService } from '../../lib/assessmentService';

type AssessmentRow = {
  id: string;
  clientName: string;
  opportunityName: string | null;
  industry: string | null;
  marketingFoundation: string | null;
  userEmail: string | null;
  isComplete: boolean;
  hasPlan: boolean;
  planGeneratedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  trackCount: number;
};

type StatusFilter = 'all' | 'plan-generated' | 'complete' | 'in-progress';

const INDUSTRY_LABELS: Record<string, string> = {
  'retail-cpg-qsr': 'Retail / CPG / QSR',
  'financial-services': 'Financial Services',
  'healthcare-life-sciences': 'Healthcare / Life Sciences',
  'manufacturing': 'Manufacturing',
  'travel-hospitality': 'Travel & Hospitality',
  'media-entertainment': 'Media & Entertainment',
  'technology': 'Technology',
};

const FOUNDATION_LABELS: Record<string, string> = {
  'mc-advanced': 'MC Advanced + Data Cloud',
  'mc-engagement': 'MC Engagement',
};

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(d: Date) {
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function StatusBadge({ row }: { row: AssessmentRow }) {
  if (row.hasPlan) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
        <FileText className="w-3 h-3" /> Plan Generated
      </span>
    );
  }
  if (row.isComplete) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" /> Complete
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> In Progress
    </span>
  );
}

type EditForm = {
  clientName: string;
  opportunityName: string;
  userEmail: string;
  isComplete: boolean;
};

export function AssessmentsManager() {
  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ clientName: '', opportunityName: '', userEmail: '', isComplete: false });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await assessmentService.adminListAssessments();
      setRows(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load assessments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let result = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.clientName.toLowerCase().includes(q) ||
        r.opportunityName?.toLowerCase().includes(q) ||
        r.userEmail?.toLowerCase().includes(q) ||
        r.industry?.toLowerCase().includes(q)
      );
    }
    if (statusFilter === 'plan-generated') result = result.filter(r => r.hasPlan);
    else if (statusFilter === 'complete') result = result.filter(r => r.isComplete && !r.hasPlan);
    else if (statusFilter === 'in-progress') result = result.filter(r => !r.isComplete);
    return result;
  }, [rows, search, statusFilter]);

  const handleExpand = (id: string) => setExpandedId(prev => prev === id ? null : id);

  const handleEditOpen = (row: AssessmentRow) => {
    setEditingId(row.id);
    setEditForm({
      clientName: row.clientName,
      opportunityName: row.opportunityName || '',
      userEmail: row.userEmail || '',
      isComplete: row.isComplete,
    });
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    setSaving(true);
    const ok = await assessmentService.updateAssessment(editingId, {
      clientName: editForm.clientName || undefined,
      opportunityName: editForm.opportunityName || undefined,
      userEmail: editForm.userEmail || undefined,
      isComplete: editForm.isComplete,
    });
    setSaving(false);
    if (ok) {
      setEditingId(null);
      await load(true);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete assessment for "${name}"? This will also delete all track data and the generated plan. This cannot be undone.`)) return;
    setDeletingId(id);
    await assessmentService.deleteAssessment(id);
    setDeletingId(null);
    setRows(prev => prev.filter(r => r.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-8">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading assessments...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assessments</h2>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length} total · {rows.filter(r => r.hasPlan).length} with plans · {rows.filter(r => r.isComplete && !r.hasPlan).length} complete · {rows.filter(r => !r.isComplete).length} in progress
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client, opportunity, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="all">All Statuses</option>
          <option value="plan-generated">Plan Generated</option>
          <option value="complete">Complete (no plan)</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search || statusFilter !== 'all' ? 'No assessments match your filters.' : 'No assessments found.'}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Industry</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Updated</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">By</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(row => (
                <>
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors ${expandedId === row.id ? 'bg-slate-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{row.clientName}</div>
                      {row.opportunityName && (
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{row.opportunityName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700">{INDUSTRY_LABELS[row.industry || ''] || row.industry || '—'}</div>
                      {row.marketingFoundation && (
                        <div className="text-xs text-gray-400">{FOUNDATION_LABELS[row.marketingFoundation] || row.marketingFoundation}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge row={row} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(row.updatedAt)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{row.userEmail || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <a
                          href={`/plan/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open plan"
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleEditOpen(row)}
                          title="Edit metadata"
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id, row.clientName)}
                          disabled={deletingId === row.id}
                          title="Delete assessment"
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        >
                          {deletingId === row.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleExpand(row.id)}
                          title={expandedId === row.id ? 'Collapse' : 'Expand details'}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded"
                        >
                          {expandedId === row.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {expandedId === row.id && (
                    <tr key={`${row.id}-detail`} className="bg-slate-50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-2 gap-6 text-xs">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700 text-sm">Assessment Details</h4>
                            <Detail label="Assessment ID" value={<code className="bg-gray-100 px-1 rounded">{row.id}</code>} />
                            <Detail label="Client Name" value={row.clientName} />
                            <Detail label="Opportunity" value={row.opportunityName || '—'} />
                            <Detail label="Industry" value={INDUSTRY_LABELS[row.industry || ''] || row.industry || '—'} />
                            <Detail label="Foundation" value={FOUNDATION_LABELS[row.marketingFoundation || ''] || row.marketingFoundation || '—'} />
                            <Detail label="Created By" value={row.userEmail || '—'} />
                            <Detail label="Track Entries" value={String(row.trackCount)} />
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700 text-sm">Timeline</h4>
                            <Detail label="Created At" value={formatDateTime(row.createdAt)} />
                            <Detail label="Last Updated" value={formatDateTime(row.updatedAt)} />
                            <Detail label="Plan Generated" value={row.planGeneratedAt ? formatDateTime(row.planGeneratedAt) : 'Not yet generated'} />
                            <div className="mt-3 flex items-center gap-2">
                              <a
                                href={`/plan/${row.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs hover:bg-slate-700"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open Plan Page
                              </a>
                              <button
                                onClick={() => handleDelete(row.id, row.clientName)}
                                disabled={deletingId === row.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 disabled:opacity-50"
                              >
                                {deletingId === row.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Trash2 className="w-3.5 h-3.5" />}
                                Delete Assessment
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Edit Assessment</h3>
              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={editForm.clientName}
                  onChange={e => setEditForm(f => ({ ...f, clientName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Name</label>
                <input
                  type="text"
                  value={editForm.opportunityName}
                  onChange={e => setEditForm(f => ({ ...f, opportunityName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                <input
                  type="email"
                  value={editForm.userEmail}
                  onChange={e => setEditForm(f => ({ ...f, userEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="user@example.com"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is-complete"
                  checked={editForm.isComplete}
                  onChange={e => setEditForm(f => ({ ...f, isComplete: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is-complete" className="text-sm font-medium text-gray-700">Mark as Complete</label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving || !editForm.clientName.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 w-28 flex-shrink-0">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
