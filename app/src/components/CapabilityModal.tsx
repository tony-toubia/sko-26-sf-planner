import { X, ExternalLink, CheckCircle, ArrowRight, Target, TrendingUp, Users, Zap } from 'lucide-react';
import type { Capability } from '../types';
import { MATURITY_STAGES, PHASES, LIFECYCLE_STAGES } from '../data/constants';

interface CapabilityModalProps {
  capability: Capability;
  onClose: () => void;
}

export function CapabilityModal({ capability, onClose }: CapabilityModalProps) {
  const maturityStage = MATURITY_STAGES[capability.maturityLevel];
  const phase = PHASES.find((p) => p.phase === capability.phase);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: maturityStage.color }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{capability.name}</h2>
              <p className="text-white/80 text-sm">
                Phase {capability.phase} &bull; Maturity Level {capability.maturityLevel} ({maturityStage.name})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Client Value */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-merkle-blue" />
                  Why It Matters to the Client
                </h3>
                <p className="text-gray-600">{capability.clientValue.why}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  How It Advances Maturity
                </h3>
                <p className="text-gray-600">{capability.clientValue.howItAdvancesMaturity}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Outcomes</h3>
                <div className="space-y-2">
                  {capability.clientValue.businessOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key KPIs</h3>
                <div className="flex flex-wrap gap-2">
                  {capability.clientValue.kpis.map((kpi, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Salesforce Value & Details */}
            <div className="space-y-6">
              <div className="bg-salesforce-blue/5 border border-salesforce-blue/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-salesforce-blue mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Salesforce Value
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Consumption</span>
                    <p className="text-gray-700 text-sm">{capability.salesforceValue.consumption}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Stickiness</span>
                    <p className="text-gray-700 text-sm">{capability.salesforceValue.stickiness}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Expansion</span>
                    <p className="text-gray-700 text-sm">{capability.salesforceValue.expansion}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Salesforce Products</h3>
                <div className="flex flex-wrap gap-2">
                  {capability.salesforceProducts.map((product, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-salesforce-blue/10 text-salesforce-blue rounded-full text-sm font-medium"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Lifecycle</h3>
                <div className="flex flex-wrap gap-2">
                  {LIFECYCLE_STAGES.map((stage) => {
                    const isActive = capability.lifecycleStages.includes(stage.id);
                    return (
                      <span
                        key={stage.id}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isActive
                            ? 'bg-merkle-teal text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {stage.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {capability.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <div className="space-y-1">
                    {capability.prerequisites.map((prereq, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-600">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {capability.merkleServices.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Merkle Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {capability.merkleServices.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-merkle-blue/10 text-merkle-blue rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Journey Type & Phase Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl ${
                  capability.journeyType === 'above-the-line'
                    ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200'
                    : capability.journeyType === 'transactional'
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-1">
                  {capability.journeyType === 'above-the-line'
                    ? 'Above the Line Journey'
                    : capability.journeyType === 'transactional'
                    ? 'Transactional Journey'
                    : 'Below the Line Journey'}
                </h4>
                <p className="text-sm text-gray-600">
                  {capability.journeyType === 'above-the-line'
                    ? 'Visible customer data activation tactics that drive acquisition, retention, and engagement.'
                    : capability.journeyType === 'transactional'
                    ? 'Journeys triggered by transactional data following standard patterns.'
                    : 'Sophisticated value creation through deeper customer relationships using enriched data.'}
                </p>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: `${phase?.color}10`,
                  borderColor: `${phase?.color}40`,
                }}
              >
                <h4 className="font-semibold text-gray-900 mb-1">{phase?.name}</h4>
                <p className="text-sm text-gray-600">{phase?.description}</p>
              </div>
            </div>
          </div>

          {/* References */}
          {capability.references.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {capability.references.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url || '#'}
                    className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">{ref.title}</h5>
                      <p className="text-sm text-gray-500">{ref.description}</p>
                      <span className="text-xs text-merkle-blue capitalize">{ref.source}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors">
            Add to Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
