import { X, ExternalLink, CheckCircle, ArrowRight, Target, TrendingUp, Users, Zap, Package, Briefcase, Box, Link2 } from 'lucide-react';
import type { Capability } from '../types';
import { MATURITY_STAGES, PHASES } from '../data/constants';

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
            {/* Left Column - Client Value & Key Capabilities */}
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

              {capability.keyCapabilities && capability.keyCapabilities.length > 0 && (
                <div className="bg-salesforce-blue/5 border border-salesforce-blue/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-salesforce-blue mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Key Capabilities Unlocked
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {capability.keyCapabilities.map((cap: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-salesforce-blue/10 text-salesforce-blue rounded-full text-sm font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
            </div>

            {/* Right Column - Business Outcomes & Commercial Offerings */}
            <div className="space-y-6">
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

              {capability.merkleOfferings && capability.merkleOfferings.length > 0 && (
                <div className="bg-merkle-blue/5 border border-merkle-blue/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-merkle-blue mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Merkle Commercial Offerings
                  </h3>
                  <div className="space-y-3">
                    {capability.merkleOfferings.map((offering, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {offering.sizing && (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-merkle-blue text-white text-xs font-bold rounded">
                              {offering.sizing}
                            </span>
                          )}
                          {!offering.sizing && (
                            <Package className="w-5 h-5 text-merkle-blue" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{offering.name}</h5>
                          <p className="text-gray-600 text-xs">{offering.description}</p>
                          <span className="text-xs text-merkle-blue capitalize">{offering.type.replace('-', ' ')}</span>
                        </div>
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

              {/* Products & Features Section */}
              {capability.productsFeatures && capability.productsFeatures.length > 0 && (
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Box className="w-5 h-5 text-slate-600" />
                    Platform & Features Used
                  </h3>
                  <div className="space-y-2">
                    {capability.productsFeatures.map((product, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          product.category === 'platform'
                            ? 'bg-blue-100 text-blue-800'
                            : product.category === 'feature'
                            ? 'bg-purple-100 text-purple-800'
                            : product.category === 'integration'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs opacity-70 capitalize">({product.category})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjacencies Section */}
              {capability.adjacencies && capability.adjacencies.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-indigo-600" />
                    Cross-Matrix Connections
                  </h3>
                  <p className="text-xs text-indigo-700 mb-3">
                    This capability connects to future maturity matrices:
                  </p>
                  <div className="space-y-3">
                    {capability.adjacencies.map((adj, i) => (
                      <div
                        key={i}
                        className="bg-white/70 rounded-lg p-3 border border-indigo-100"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded">
                            {adj.matrix.charAt(0).toUpperCase() + adj.matrix.slice(1)}
                          </span>
                          <span className="text-sm font-medium text-indigo-900">
                            {adj.connectionPoint}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-700">{adj.description}</p>
                      </div>
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
                    ? 'bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-1">
                  {capability.journeyType === 'above-the-line'
                    ? 'Customer Data ACTIVATION'
                    : 'Customer Data MANAGEMENT'}
                </h4>
                <p className="text-sm text-gray-600">
                  {capability.journeyType === 'above-the-line'
                    ? 'Visible marketing tactics that drive acquisition, retention, and sustained customer engagement.'
                    : 'Foundational data management enabling deeper customer understanding through data enrichment and integration.'}
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
