import { useState, useMemo } from 'react';
import {
  Cloud,
  Copy,
  Check,
  FileSpreadsheet,
  FileJson,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Briefcase,
  Target,
  Info,
  Zap,
} from 'lucide-react';
import type { GeneratedPlan, OpportunityAssessment } from '../types';
import type { ServiceRecommendation } from '../utils/serviceRecommendations';

interface SalesforceExportProps {
  plan: GeneratedPlan;
  assessment?: OpportunityAssessment | null;
  selectedServices?: ServiceRecommendation[];
}

// Salesforce Opportunity data structure
interface SalesforceOpportunity {
  name: string;
  accountName: string;
  industry: string;
  stage: string;
  amount: string;
  closeDate: string;
  description: string;
  type: string;
  leadSource: string;
  products: string[];
  phase: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

// Sales funnel stages
const SALES_FUNNEL_STAGES = [
  '0 Unqualified',
  '1 Qualified',
  '2 Proposal',
  '3 Pitch',
  '4 Negotiate',
  '5 Contract',
  '6 Closed',
] as const;

// Get default opportunity stage
// All opportunities from assessment default to "1 Qualified"
// since the assessment process qualifies the opportunity
function getDefaultOpportunityStage(): string {
  return SALES_FUNNEL_STAGES[1]; // "1 Qualified"
}

// Estimate phase close dates
function estimateCloseDate(phaseNumber: number): string {
  const today = new Date();
  const monthsToAdd = phaseNumber * 3; // 3 months per phase
  today.setMonth(today.getMonth() + monthsToAdd);
  return today.toISOString().split('T')[0];
}

// Generate opportunities from selected services (preferred) or fall back to plan phases
function generateOpportunities(
  plan: GeneratedPlan,
  assessment?: OpportunityAssessment | null,
  selectedServices?: ServiceRecommendation[]
): SalesforceOpportunity[] {
  const clientName = plan.executiveSummary.clientName || 'Unknown Client';
  const industry = assessment?.industry || 'Technology';

  // If we have selected services, generate one opportunity per service
  if (selectedServices && selectedServices.length > 0) {
    return selectedServices.map((rec, index) => {
      const midpointAmount = Math.round((rec.estimatedCost.min + rec.estimatedCost.max) / 2);
      const priorityMap: Record<string, 'Critical' | 'High' | 'Medium' | 'Low'> = {
        critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
      };

      return {
        name: `${clientName} - ${rec.service.name}`,
        accountName: clientName,
        industry: industry,
        stage: getDefaultOpportunityStage(),
        amount: midpointAmount.toLocaleString(),
        closeDate: estimateCloseDate(index < 3 ? 1 : index < 6 ? 2 : 3),
        description: `${rec.rationale}\n\nService: ${rec.service.name}\nSize: ${rec.recommendedSize}\nEstimate: $${(rec.estimatedCost.min / 1000).toFixed(0)}K – $${(rec.estimatedCost.max / 1000).toFixed(0)}K`,
        type: 'New Business',
        leadSource: 'Maturity Assessment Tool',
        products: [rec.service.name],
        phase: `${rec.recommendedSize} engagement`,
        priority: priorityMap[rec.priority] || 'Medium',
      };
    });
  }

  // Fallback: Create one opportunity per phase from the plan
  const opportunities: SalesforceOpportunity[] = [];
  plan.phases.forEach((phase) => {
    if (phase.capabilities.length === 0) return;

    const criticalCapabilities = phase.capabilities.filter(c => c.priority === 'critical');
    const highCapabilities = phase.capabilities.filter(c => c.priority === 'high');

    let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
    if (criticalCapabilities.length > 0) priority = 'Critical';
    else if (highCapabilities.length > 0) priority = 'High';

    const baseAmount = phase.phaseNumber === 1 ? 150000 :
                       phase.phaseNumber === 2 ? 200000 :
                       phase.phaseNumber === 3 ? 175000 : 125000;

    opportunities.push({
      name: `${clientName} - ${phase.name}`,
      accountName: clientName,
      industry: industry,
      stage: getDefaultOpportunityStage(),
      amount: baseAmount.toLocaleString(),
      closeDate: estimateCloseDate(phase.phaseNumber),
      description: `${phase.description}\n\nKey Milestones:\n${phase.keyMilestones.map(m => `• ${m}`).join('\n')}`,
      type: 'New Business',
      leadSource: 'Maturity Assessment Tool',
      products: phase.capabilities.map(c => c.capabilityName),
      phase: phase.name,
      priority: priority,
    });
  });

  return opportunities;
}

export function SalesforceExport({ plan, assessment, selectedServices }: SalesforceExportProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedOpp, setExpandedOpp] = useState<number | null>(0);
  const [showApiInfo, setShowApiInfo] = useState(false);

  const opportunities = useMemo(() => generateOpportunities(plan, assessment, selectedServices), [plan, assessment, selectedServices]);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate CSV content
  const generateCSV = () => {
    const headers = ['Opportunity Name', 'Account Name', 'Industry', 'Stage', 'Amount', 'Close Date', 'Type', 'Lead Source', 'Description', 'Products'];
    const rows = opportunities.map(opp => [
      opp.name,
      opp.accountName,
      opp.industry,
      opp.stage,
      opp.amount.replace(/,/g, ''), // Remove commas for CSV
      opp.closeDate,
      opp.type,
      opp.leadSource,
      `"${opp.description.replace(/"/g, '""')}"`, // Escape quotes
      `"${opp.products.join('; ')}"`,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  // Generate JSON for API integration
  const generateJSON = () => {
    return JSON.stringify({
      opportunities: opportunities.map(opp => ({
        Name: opp.name,
        AccountName: opp.accountName,
        Industry: opp.industry,
        StageName: opp.stage,
        Amount: parseFloat(opp.amount.replace(/,/g, '')),
        CloseDate: opp.closeDate,
        Type: opp.type,
        LeadSource: opp.leadSource,
        Description: opp.description,
        Products: opp.products,
      })),
      metadata: {
        generatedAt: new Date().toISOString(),
        clientName: plan.executiveSummary.clientName,
        totalOpportunities: opportunities.length,
        totalValue: opportunities.reduce((sum, o) => sum + parseFloat(o.amount.replace(/,/g, '')), 0),
      },
    }, null, 2);
  };

  // Generate formatted text for manual entry
  const generateFormattedText = () => {
    return opportunities.map((opp, i) => `
OPPORTUNITY ${i + 1}: ${opp.name}
${'='.repeat(50)}
Account Name:    ${opp.accountName}
Industry:        ${opp.industry}
Stage:           ${opp.stage}
Amount:          $${opp.amount}
Close Date:      ${opp.closeDate}
Type:            ${opp.type}
Lead Source:     ${opp.leadSource}
Priority:        ${opp.priority}

Description:
${opp.description}

Products/Capabilities:
${opp.products.map(p => `  • ${p}`).join('\n')}
`).join('\n\n');
  };

  const handleDownloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.executiveSummary.clientName.replace(/\s+/g, '-')}-salesforce-opportunities.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const json = generateJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.executiveSummary.clientName.replace(/\s+/g, '-')}-salesforce-opportunities.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalValue = opportunities.reduce((sum, o) => sum + parseFloat(o.amount.replace(/,/g, '')), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-salesforce-blue/10 to-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-salesforce-blue rounded-xl">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Salesforce Opportunity Export</h3>
            <p className="text-sm text-slate-600 mt-1">
              Transform your assessment into actionable Salesforce opportunities to track and close.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-salesforce-blue" />
                <span className="text-sm font-medium">{opportunities.length} Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">${totalValue.toLocaleString()} Total Pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleCopy(generateFormattedText(), 'text')}
          className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
        >
          {copied === 'text' ? (
            <Check className="w-5 h-5 text-emerald-500" />
          ) : (
            <Copy className="w-5 h-5 text-slate-600" />
          )}
          <span className="text-sm font-medium text-slate-700">
            {copied === 'text' ? 'Copied!' : 'Copy Text'}
          </span>
          <span className="text-xs text-slate-500">For manual entry</span>
        </button>

        <button
          onClick={handleDownloadCSV}
          className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">Download CSV</span>
          <span className="text-xs text-slate-500">For Data Loader</span>
        </button>

        <button
          onClick={handleDownloadJSON}
          className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <FileJson className="w-5 h-5 text-violet-600" />
          <span className="text-sm font-medium text-slate-700">Download JSON</span>
          <span className="text-xs text-slate-500">For API/CLI</span>
        </button>

        <button
          onClick={() => setShowApiInfo(!showApiInfo)}
          className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <ExternalLink className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">API Integration</span>
          <span className="text-xs text-slate-500">Connect directly</span>
        </button>
      </div>

      {/* API Integration Info */}
      {showApiInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Direct Salesforce API Integration</h4>
              <p className="text-sm text-slate-600">
                For automated opportunity creation, you can integrate directly with Salesforce using:
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Salesforce CLI:</strong> Use the JSON export with <code className="bg-slate-200 px-1 rounded">sf data import tree</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Data Loader:</strong> Import the CSV directly into Opportunity object</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span><strong>REST API:</strong> POST to <code className="bg-slate-200 px-1 rounded">/services/data/vXX.0/sobjects/Opportunity</code></span>
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-200 mt-3">
                <p className="text-xs text-slate-500">
                  Future enhancement: Direct OAuth connection to create opportunities automatically in your org.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Cards */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Generated Opportunities
        </h4>
        {opportunities.map((opp, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedOpp(expandedOpp === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  opp.priority === 'Critical' ? 'bg-red-100' :
                  opp.priority === 'High' ? 'bg-amber-100' :
                  'bg-blue-100'
                }`}>
                  <Target className={`w-5 h-5 ${
                    opp.priority === 'Critical' ? 'text-red-600' :
                    opp.priority === 'High' ? 'text-amber-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h5 className="font-semibold text-slate-900">{opp.name}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      opp.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      opp.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {opp.priority}
                    </span>
                    <span className="text-sm text-slate-500">{opp.stage}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">${opp.amount}</div>
                  <div className="text-xs text-slate-500">Close: {opp.closeDate}</div>
                </div>
                {expandedOpp === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {expandedOpp === index && (
              <div className="px-4 pb-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Account</div>
                    <div className="text-sm font-medium text-slate-900">{opp.accountName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Industry</div>
                    <div className="text-sm font-medium text-slate-900">{opp.industry}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Type</div>
                    <div className="text-sm font-medium text-slate-900">{opp.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Lead Source</div>
                    <div className="text-sm font-medium text-slate-900">{opp.leadSource}</div>
                  </div>
                </div>

                <div className="py-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-2">Description</div>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{opp.description}</p>
                </div>

                <div className="py-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-2">Products/Capabilities ({opp.products.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {opp.products.map((product, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify({
                      Name: opp.name,
                      AccountName: opp.accountName,
                      StageName: opp.stage,
                      Amount: parseFloat(opp.amount.replace(/,/g, '')),
                      CloseDate: opp.closeDate,
                      Description: opp.description,
                    }, null, 2), `opp-${index}`)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    {copied === `opp-${index}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy JSON
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Import Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Quick Import Steps
        </h4>
        <ol className="text-sm text-amber-800 space-y-2">
          <li><strong>1.</strong> Download the CSV file using the button above</li>
          <li><strong>2.</strong> Open Salesforce Data Loader or Data Import Wizard</li>
          <li><strong>3.</strong> Select "Opportunity" as the target object</li>
          <li><strong>4.</strong> Map the columns (most will auto-map by name)</li>
          <li><strong>5.</strong> Review and import the opportunities</li>
        </ol>
        <p className="text-xs text-amber-700 mt-3">
          Note: Ensure your Account records exist before importing. You may need to create or link Account IDs.
        </p>
      </div>
    </div>
  );
}
