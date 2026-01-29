import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type EntityType = 'tactics' | 'ref_kpis' | 'ref_roi_benchmarks' | 'ref_journey_templates' | 'ref_channel_priorities' | 'ref_offerings';

const ENTITY_OPTIONS: { value: EntityType; label: string }[] = [
  { value: 'tactics', label: 'Tactics / Plays' },
  { value: 'ref_kpis', label: 'KPIs' },
  { value: 'ref_roi_benchmarks', label: 'ROI Benchmarks' },
  { value: 'ref_journey_templates', label: 'Journey Templates' },
  { value: 'ref_channel_priorities', label: 'Channel Priorities' },
  { value: 'ref_offerings', label: 'Offerings' },
];

export function BulkImport() {
  const [entity, setEntity] = useState<EntityType>('tactics');
  const [preview, setPreview] = useState<any[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    const text = await file.text();

    try {
      let data: any[];
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
        if (!Array.isArray(data)) data = [data];
      } else {
        // CSV parsing
        const lines = text.split('\n').filter((l) => l.trim());
        if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        data = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const row: any = {};
          headers.forEach((h, i) => {
            const val = values[i] || '';
            // Auto-parse arrays (semicolon-separated)
            if (val.includes(';')) {
              row[h] = val.split(';').map((v) => v.trim());
            } else if (val === 'true' || val === 'false') {
              row[h] = val === 'true';
            } else if (!isNaN(Number(val)) && val !== '') {
              row[h] = Number(val);
            } else {
              row[h] = val;
            }
          });
          return row;
        });
      }

      setPreview(data);
    } catch (err) {
      setResult({ success: false, message: `Parse error: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleImport = async () => {
    if (!preview?.length || !supabase) return;
    setImporting(true);
    setResult(null);

    try {
      const { error } = await supabase.from(entity).insert(preview);
      if (error) {
        setResult({ success: false, message: `Import failed: ${error.message}` });
      } else {
        setResult({ success: true, message: `Successfully imported ${preview.length} rows into ${entity}` });
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
      }
    } catch (err) {
      setResult({ success: false, message: `Error: ${err instanceof Error ? err.message : 'Unknown'}` });
    }

    setImporting(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bulk Import</h2>
        <p className="text-sm text-gray-500 mt-1">Upload CSV or JSON files to bulk import reference data</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Entity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Table</label>
          <select
            value={entity}
            onChange={(e) => { setEntity(e.target.value as EntityType); setPreview(null); setResult(null); }}
            className="p-2 border border-gray-300 rounded-lg text-sm"
          >
            {ENTITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">Drop a CSV or JSON file, or click to browse</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFile}
              className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>
        </div>

        {/* Format Guide */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium">Format Guide:</p>
              <p><strong>JSON:</strong> Array of objects with column names as keys matching DB column names (snake_case)</p>
              <p><strong>CSV:</strong> Header row with DB column names. Use semicolons for array values (e.g., <code>email;sms;push</code>)</p>
              <p>Array columns: <code>disciplines</code>, <code>industries</code>, <code>tracks</code>, <code>phases</code>, <code>channels</code>, <code>tags</code>, <code>improvement_levers</code></p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Preview ({preview.length} rows)</h3>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Import {preview.length} Rows
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-auto max-h-64">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {Object.keys(preview[0] || {}).map((key) => (
                      <th key={key} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-3 py-2 text-gray-600 whitespace-nowrap max-w-xs truncate">
                          {Array.isArray(val) ? (val as string[]).join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <div className="px-3 py-2 text-xs text-gray-400 bg-gray-50">...and {preview.length - 10} more rows</div>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`flex items-start gap-2 p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
