import { TrendingUp, Lock, Expand, Zap } from 'lucide-react';
import { SALESFORCE_VALUE_PROPOSITION } from '../data/constants';

const iconMap = {
  consumption: TrendingUp,
  stickiness: Lock,
  expansion: Expand,
};

export function SalesforceValue() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Salesforce Value Proposition</h2>
        <p className="text-gray-500 mt-1">
          {SALESFORCE_VALUE_PROPOSITION.overview}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="bg-gradient-to-r from-salesforce-blue to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Proven Business Impact
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SALESFORCE_VALUE_PROPOSITION.keyMetrics.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold">{item.metric}</div>
              <div className="text-sm font-medium text-white/90">{item.label}</div>
              <div className="text-xs text-white/70">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SALESFORCE_VALUE_PROPOSITION.dimensions.map((dim) => {
          const Icon = iconMap[dim.id as keyof typeof iconMap] || TrendingUp;
          return (
            <div
              key={dim.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-salesforce-blue/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-salesforce-blue" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{dim.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{dim.description}</p>
              <ul className="space-y-2">
                {dim.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-salesforce-blue rounded-full mt-1.5 flex-shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* How Each Phase Drives Value */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How Maturity Progression Drives Salesforce Value
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Phase</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Consumption</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Stickiness</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Expansion</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Phase 1: Unlock</td>
                <td className="py-3 px-4">Platform migration drives initial adoption</td>
                <td className="py-3 px-4">Data integrations create dependencies</td>
                <td className="py-3 px-4">Opens all feature categories</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Phase 2: Activate</td>
                <td className="py-3 px-4">Journeys + Einstein = message volume</td>
                <td className="py-3 px-4">Automated journeys become critical</td>
                <td className="py-3 px-4">Einstein tiers, additional channels</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Phase 3: Optimize</td>
                <td className="py-3 px-4">Cross-channel multiplies sends</td>
                <td className="py-3 px-4">Analytics embedded in decisions</td>
                <td className="py-3 px-4">SMS, Ad Studio, Intelligence</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">Phase 4: Transform</td>
                <td className="py-3 px-4">Heavy Einstein + Data Cloud usage</td>
                <td className="py-3 px-4">Identity layer becomes foundational</td>
                <td className="py-3 px-4">Data Cloud, advanced Einstein</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
