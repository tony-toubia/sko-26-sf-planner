import { useState } from 'react';
import {
  X,
  MessageSquare,
  Target,
  Smartphone,
  Mail,
  Check,
  Zap,
  Eye,
  Users,
  TrendingUp,
  Heart,
  DollarSign,
  MapPin,
  ShoppingCart,
  RefreshCw,
  UserPlus,
  Bell,
  Package,
} from 'lucide-react';

interface ChannelRoleGuideProps {
  onClose: () => void;
  highlightChannel?: string;
}

interface ChannelInfo {
  id: string;
  name: string;
  icon: typeof MessageSquare;
  color: string;
  bgColor: string;
  journeyBuilderEnabled: boolean;
  journeyBuilderNote?: string;
  useWhen: {
    text: string;
    icon: typeof Eye;
  }[];
  examples: string[];
  relatedCapabilities: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

const CHANNELS: ChannelInfo[] = [
  {
    id: 'sms',
    name: 'SMS / MMS',
    icon: MessageSquare,
    color: '#059669',
    bgColor: 'bg-emerald-50',
    journeyBuilderEnabled: true,
    useWhen: [
      { text: 'Message visibility is key', icon: Eye },
      { text: '"Open" is more important than click', icon: Target },
      { text: 'Timely service notifications (curbside, delivery)', icon: Bell },
      { text: 'Acquisition is important', icon: UserPlus },
      { text: 'High-urgency promotional moments', icon: Zap },
    ],
    examples: [
      'Service case notifications',
      'Flash sale / sneak peek announcements',
      'In-store pickup ready alerts',
      'Appointment reminders',
      'Order status updates',
      'Limited-time offer urgency',
    ],
    relatedCapabilities: ['cross-channel-activation', 'customer-lifecycle-journeys', 'baseline-subscriber-journeys'],
    metrics: [
      { label: 'Avg Open Rate', value: '98%' },
      { label: 'Read within 3 min', value: '90%' },
      { label: 'Response Rate', value: '45%' },
    ],
  },
  {
    id: 'ad-studio',
    name: 'Advertising Studio',
    icon: Target,
    color: '#7C3AED',
    bgColor: 'bg-violet-50',
    journeyBuilderEnabled: true,
    useWhen: [
      { text: 'Message reach is key (beyond owned channels)', icon: Users },
      { text: 'Supporting alternate channel message recall', icon: RefreshCw },
      { text: 'The consumer is (predicted) high value', icon: DollarSign },
      { text: 'The subscriber is email under-engaged', icon: TrendingUp },
      { text: 'Lookalike acquisition is important', icon: UserPlus },
    ],
    examples: [
      'Cross/up-sell journey retargeting',
      'High propensity-to-purchase audiences',
      'Re-engagement/retention journeys',
      'Cart abandonment retargeting',
      'Suppression for recent converters',
      'Lookalike audience expansion',
    ],
    relatedCapabilities: ['cross-channel-activation', 'customer-lifecycle-journeys', 'insight-driven-experiences'],
    metrics: [
      { label: 'ROAS Lift', value: '3X' },
      { label: 'Ad Waste Reduction', value: '40%' },
      { label: 'Reach Extension', value: '+60%' },
    ],
  },
  {
    id: 'mobile-push',
    name: 'Mobile Push',
    icon: Smartphone,
    color: '#0EA5E9',
    bgColor: 'bg-sky-50',
    journeyBuilderEnabled: true,
    useWhen: [
      { text: 'The customer is a user of your mobile app', icon: Smartphone },
      { text: 'As an SMS alternative for non-opted-in app users', icon: MessageSquare },
      { text: 'In-app engagement is a goal', icon: Target },
      { text: 'Location-triggered moments (geofencing)', icon: MapPin },
      { text: 'Real-time behavioral triggers', icon: Zap },
    ],
    examples: [
      'Flash sale announcements to app users',
      'Product notifications and back-in-stock',
      'In-app feature promotion',
      'Nearby store/location alerts',
      'Order status and delivery tracking',
      'Loyalty point reminders',
    ],
    relatedCapabilities: ['cross-channel-activation', 'baseline-subscriber-journeys', 'customer-lifecycle-journeys'],
    metrics: [
      { label: 'Delivery Rate', value: '90%' },
      { label: 'Open Rate', value: '7-12%' },
      { label: 'Cost per Send', value: '$0' },
    ],
  },
  {
    id: 'direct-mail',
    name: 'Small Batch Direct Mail',
    icon: Mail,
    color: '#EA580C',
    bgColor: 'bg-orange-50',
    journeyBuilderEnabled: true,
    journeyBuilderNote: 'Via AppExchange partners',
    useWhen: [
      { text: 'The consumer is especially high value', icon: DollarSign },
      { text: 'The sale/moment is especially high ROI', icon: TrendingUp },
      { text: 'Physical copy of key info is important', icon: Package },
      { text: 'Digital fatigue requires an alternative', icon: RefreshCw },
      { text: 'Premium brand experience is the goal', icon: Heart },
    ],
    examples: [
      'Predicted high-value customer journeys',
      'New product/service launch to VIPs',
      'New store opening or event in area',
      'Win-back for lapsed high-value customers',
      'Loyalty tier upgrade congratulations',
      'Personalized catalogs and lookbooks',
    ],
    relatedCapabilities: ['cross-channel-activation', 'insight-driven-experiences', 'clv-modeling'],
    metrics: [
      { label: 'Response Rate', value: '4-9%' },
      { label: 'Brand Recall', value: '75%' },
      { label: 'Avg ROI', value: '29:1' },
    ],
  },
];

// Journey types and which channels are best suited
const JOURNEY_CHANNEL_MATRIX = [
  {
    journey: 'Welcome Series',
    icon: UserPlus,
    channels: {
      sms: 'secondary',
      'ad-studio': 'secondary',
      'mobile-push': 'primary',
      'direct-mail': 'optional',
    },
  },
  {
    journey: 'Cart Abandonment',
    icon: ShoppingCart,
    channels: {
      sms: 'primary',
      'ad-studio': 'primary',
      'mobile-push': 'primary',
      'direct-mail': 'not-recommended',
    },
  },
  {
    journey: 'Post-Purchase',
    icon: Package,
    channels: {
      sms: 'primary',
      'ad-studio': 'secondary',
      'mobile-push': 'primary',
      'direct-mail': 'optional',
    },
  },
  {
    journey: 'Re-engagement',
    icon: RefreshCw,
    channels: {
      sms: 'secondary',
      'ad-studio': 'primary',
      'mobile-push': 'secondary',
      'direct-mail': 'primary',
    },
  },
  {
    journey: 'High-Value Nurture',
    icon: Heart,
    channels: {
      sms: 'secondary',
      'ad-studio': 'primary',
      'mobile-push': 'secondary',
      'direct-mail': 'primary',
    },
  },
  {
    journey: 'Flash Sale / Urgency',
    icon: Zap,
    channels: {
      sms: 'primary',
      'ad-studio': 'secondary',
      'mobile-push': 'primary',
      'direct-mail': 'not-recommended',
    },
  },
];

export function ChannelRoleGuide({ onClose, highlightChannel }: ChannelRoleGuideProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(highlightChannel || null);
  const [viewMode, setViewMode] = useState<'channels' | 'matrix'>('channels');

  const selectedChannelData = CHANNELS.find((c) => c.id === selectedChannel);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-merkle-teal flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Cross-Channel Strategy Guide</h2>
            <p className="text-white/80 text-sm">
              Defining the role of each channel throughout customer journeys
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('channels')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                viewMode === 'channels'
                  ? 'bg-merkle-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Channel Deep Dive
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-merkle-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Journey × Channel Matrix
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'channels' && (
            <div className="space-y-6">
              {/* Channel Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {CHANNELS.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = selectedChannel === channel.id;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(isSelected ? null : channel.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-current shadow-lg scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow'
                      } ${channel.bgColor}`}
                      style={{ borderColor: isSelected ? channel.color : undefined }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: channel.color }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-gray-600">
                          JB Enabled
                          {channel.journeyBuilderNote && (
                            <span className="text-gray-400"> ({channel.journeyBuilderNote})</span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Channel Detail */}
              {selectedChannelData && (
                <div
                  className="rounded-xl border-2 p-6 animate-fade-in"
                  style={{
                    borderColor: selectedChannelData.color,
                    backgroundColor: `${selectedChannelData.color}08`,
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Use When */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" style={{ color: selectedChannelData.color }} />
                        Use When...
                      </h4>
                      <div className="space-y-2">
                        {selectedChannelData.useWhen.map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex items-start gap-2">
                              <Icon
                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                                style={{ color: selectedChannelData.color }}
                              />
                              <span className="text-sm text-gray-700">{item.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" style={{ color: selectedChannelData.color }} />
                        Example Use Cases
                      </h4>
                      <div className="space-y-1.5">
                        {selectedChannelData.examples.map((example, i) => (
                          <div
                            key={i}
                            className="px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700 border border-gray-100"
                          >
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" style={{ color: selectedChannelData.color }} />
                        Channel Benchmarks
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedChannelData.metrics.map((metric, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg p-3 border border-gray-100"
                          >
                            <div
                              className="text-2xl font-bold"
                              style={{ color: selectedChannelData.color }}
                            >
                              {metric.value}
                            </div>
                            <div className="text-xs text-gray-500">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reference Table */}
              {!selectedChannelData && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Reference: When to Use Each Channel</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Channel</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Best For</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Key Strength</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-emerald-600" />
                              SMS/MMS
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">Urgency, visibility, time-sensitive</td>
                          <td className="py-3 px-4 text-gray-600">98% open rate</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-2">
                              <Target className="w-4 h-4 text-violet-600" />
                              Ad Studio
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">Reach extension, retargeting, suppression</td>
                          <td className="py-3 px-4 text-gray-600">3X ROAS lift</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-sky-600" />
                              Mobile Push
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">App users, location triggers, real-time</td>
                          <td className="py-3 px-4 text-gray-600">Zero send cost</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-2">
                              <Mail className="w-4 h-4 text-orange-600" />
                              Direct Mail
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">High-value moments, premium experience</td>
                          <td className="py-3 px-4 text-gray-600">75% brand recall</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'matrix' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                This matrix shows recommended channel roles across common journey types.
                <span className="font-medium"> Primary</span> channels should be the default choice,{' '}
                <span className="font-medium">Secondary</span> channels add value as complements,{' '}
                and <span className="font-medium">Optional</span> channels are situation-dependent.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 min-w-[160px]">Journey Type</th>
                      {CHANNELS.map((channel) => {
                        const Icon = channel.icon;
                        return (
                          <th key={channel.id} className="text-center py-3 px-4 min-w-[120px]">
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: channel.color }}
                              >
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">{channel.name}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {JOURNEY_CHANNEL_MATRIX.map((row, i) => {
                      const Icon = row.icon;
                      return (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{row.journey}</span>
                            </div>
                          </td>
                          {CHANNELS.map((channel) => {
                            const role = row.channels[channel.id as keyof typeof row.channels];
                            return (
                              <td key={channel.id} className="text-center py-4 px-4">
                                {role === 'primary' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    <Check className="w-3 h-3" />
                                    Primary
                                  </span>
                                )}
                                {role === 'secondary' && (
                                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    Secondary
                                  </span>
                                )}
                                {role === 'optional' && (
                                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    Optional
                                  </span>
                                )}
                                {role === 'not-recommended' && (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    <Check className="w-3 h-3" />
                    Primary
                  </span>
                  <span className="text-xs text-gray-500">Default choice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Secondary
                  </span>
                  <span className="text-xs text-gray-500">Valuable complement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Optional
                  </span>
                  <span className="text-xs text-gray-500">Situation-dependent</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Note: Email remains the primary channel for most journeys. This guide focuses on complementary channels.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
