import { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Users,
  ClipboardList,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { GeneratedPlan, OpportunityAssessment } from '../types';
import { generateSOW, formatCurrency, type StatementOfWork, type SOWLineItem } from '../utils/sowGenerator';

interface SOWExportProps {
  plan: GeneratedPlan;
  assessment: OpportunityAssessment | null;
}

export default function SOWExport({ plan, assessment }: SOWExportProps) {
  const [sow, setSow] = useState<StatementOfWork | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const [showFullMarkdown, setShowFullMarkdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    if (!assessment) {
      setError('Assessment data is required to generate a Statement of Work.');
      return;
    }
    setIsGenerating(true);
    setError(null);

    // Use a short timeout to allow the loading state to render
    setTimeout(() => {
      try {
        const generated = generateSOW(plan, assessment);
        setSow(generated);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while generating the SOW.'
        );
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [plan, assessment]);

  const handleCopy = useCallback(async () => {
    if (!sow) return;
    try {
      await navigator.clipboard.writeText(sow.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const textarea = document.createElement('textarea');
      textarea.value = sow.markdown;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [sow]);

  const togglePhase = useCallback((phaseNumber: number) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phaseNumber)) {
        next.delete(phaseNumber);
      } else {
        next.add(phaseNumber);
      }
      return next;
    });
  }, []);

  // Group line items by phase
  const lineItemsByPhase = useMemo(() => {
    if (!sow) return new Map<number, SOWLineItem[]>();
    const grouped = new Map<number, SOWLineItem[]>();
    for (const item of sow.lineItems) {
      if (!grouped.has(item.phase)) {
        grouped.set(item.phase, []);
      }
      grouped.get(item.phase)!.push(item);
    }
    return grouped;
  }, [sow]);

  // Phase cost totals
  const phaseTotals = useMemo(() => {
    const totals = new Map<number, { min: number; max: number }>();
    if (!sow) return totals;
    for (const [phase, items] of lineItemsByPhase) {
      totals.set(phase, {
        min: items.reduce((s: number, i: SOWLineItem) => s + i.estimatedCost.min, 0),
        max: items.reduce((s: number, i: SOWLineItem) => s + i.estimatedCost.max, 0),
      });
    }
    return totals;
  }, [sow, lineItemsByPhase]);

  // ---- Pre-generation state ----
  if (!sow) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Statement of Work Generator
            </h3>
            <p className="text-sm text-gray-500">
              Auto-generate a professional SOW skeleton from this plan
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          This will generate a Statement of Work document based on the plan phases,
          service recommendations, and cost estimates from the services catalog.
          The SOW includes project overview, scope, timeline, investment summary,
          team composition, assumptions, and change management sections.
        </p>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !assessment}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors text-sm font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating SOW...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate SOW
            </>
          )}
        </button>

        {!assessment && (
          <p className="mt-2 text-xs text-amber-600">
            Assessment data is required to generate a SOW.
          </p>
        )}
      </div>
    );
  }

  // ---- Post-generation state ----
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Statement of Work
              </h3>
              <p className="text-indigo-200 text-sm">
                {sow.clientName}
                {sow.opportunityName ? ` -- ${sow.opportunityName}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white
                         rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Markdown
                </>
              )}
            </button>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white
                         rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-xs text-green-600 font-medium">Total Estimate</p>
            <p className="text-sm font-semibold text-green-900">
              {formatCurrency(sow.totalEstimate.min)} - {formatCurrency(sow.totalEstimate.max)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-xs text-blue-600 font-medium">Phases</p>
            <p className="text-sm font-semibold text-blue-900">
              {plan.phases.length} phase{plan.phases.length !== 1 ? 's' : ''} -- {plan.executiveSummary.recommendedTimeframe}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <Users className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-xs text-purple-600 font-medium">Service Lines</p>
            <p className="text-sm font-semibold text-purple-900">
              {sow.lineItems.length} line item{sow.lineItems.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items by Phase */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-500" />
          Service Line Items by Phase
        </h4>

        <div className="space-y-3">
          {Array.from(lineItemsByPhase.entries()).map(([phaseNum, items]: [number, SOWLineItem[]]) => {
            const isExpanded = expandedPhases.has(phaseNum);
            const totals = phaseTotals.get(phaseNum);
            const phaseName = items[0]?.phaseName ?? `Phase ${phaseNum}`;

            return (
              <div
                key={phaseNum}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Phase header */}
                <button
                  onClick={() => togglePhase(phaseNum)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50
                             hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full
                                     bg-indigo-100 text-indigo-700 text-xs font-bold">
                      {phaseNum}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {phaseName}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {items.length} service{items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {totals && totals.min > 0 && (
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(totals.min)} - {formatCurrency(totals.max)}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Phase detail */}
                {isExpanded && (
                  <div className="divide-y divide-gray-100">
                    {items.map((item: SOWLineItem, idx: number) => (
                      <div key={idx} className="px-4 py-3">
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {item.service}
                          </h5>
                          {item.estimatedCost.min > 0 && (
                            <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                              {formatCurrency(item.estimatedCost.min)} -{' '}
                              {formatCurrency(item.estimatedCost.max)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </span>
                          {item.team.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {item.team.map((t: { role: string; allocation: string }) => t.role).join(', ')}
                            </span>
                          )}
                        </div>
                        {item.deliverables.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              Deliverables:
                            </p>
                            <ul className="text-xs text-gray-500 list-disc list-inside space-y-0.5">
                              {item.deliverables.map((d: string, di: number) => (
                                <li key={di}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Markdown Preview Toggle */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={() => setShowFullMarkdown(!showFullMarkdown)}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600
                     hover:text-indigo-700 transition-colors"
        >
          {showFullMarkdown ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Full Markdown
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Full Markdown
            </>
          )}
        </button>

        {showFullMarkdown && (
          <div className="mt-4 relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2 py-1
                         bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600
                         transition-colors z-10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto
                            text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">
              {sow.markdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
