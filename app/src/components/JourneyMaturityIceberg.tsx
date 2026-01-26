import { useState } from 'react';
import {
  Sparkles,
  ShoppingCart,
  UserPlus,
  Eye,
  Mail,
  MessageSquare,
  Smartphone,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Film,
  Zap,
  Quote,
} from 'lucide-react';

interface JourneyMaturityIcebergProps {
  onSelectLevel?: (level: 'subscriber' | 'lifecycle' | 'insight-driven') => void;
  highlightLevel?: 'subscriber' | 'lifecycle' | 'insight-driven' | null;
}

export function JourneyMaturityIceberg({
  onSelectLevel,
  highlightLevel,
}: JourneyMaturityIcebergProps) {
  const [expandedCase, setExpandedCase] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white">
        <h2 className="text-lg font-semibold">Journey Maturity Model</h2>
        <p className="text-violet-200 text-sm mt-1">
          From table-stakes to brand-unique differentiation
        </p>
      </div>

      <div className="p-6">
        {/* Iceberg Visualization with background image */}
        <div className="relative rounded-xl overflow-hidden">
          {/* Background iceberg image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: 'url(/images/iceberg.png)' }}
          />

          {/* Gradient overlays to blend with content */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-blue-300/60 to-blue-900/80" />

          {/* Content container */}
          <div className="relative z-10">
            {/* Water line indicator */}
            <div className="absolute left-0 right-0 top-[52%] z-20 flex items-center">
              <div className="flex-1 border-t-2 border-dashed border-white/60" />
              <span className="px-3 text-xs font-semibold text-white bg-blue-500/80 rounded-full shadow-lg">
                WATERLINE
              </span>
              <div className="flex-1 border-t-2 border-dashed border-white/60" />
            </div>

            {/* Sky/Above water section */}
            <div className="pt-4 pb-8">
              {/* Level 1: Subscriber Journeys - Top of iceberg */}
              <button
                onClick={() => onSelectLevel?.('subscriber')}
                className={`
                  relative mx-auto block w-[70%] transition-all
                  ${highlightLevel === 'subscriber' ? 'scale-105' : 'hover:scale-102'}
                `}
              >
                <div
                  className={`
                    bg-gradient-to-br from-emerald-400/95 to-teal-500/95 rounded-t-3xl p-4 shadow-lg backdrop-blur-sm
                    ${highlightLevel === 'subscriber' ? 'ring-4 ring-emerald-300' : ''}
                  `}
                >
                  <div className="flex items-center justify-center gap-2 text-white mb-2">
                    <UserPlus className="w-5 h-5" />
                    <span className="font-semibold">Subscriber Journeys</span>
                  </div>
                  <div className="flex justify-center gap-4 text-xs text-white/90">
                    <span>Welcome</span>
                    <span>•</span>
                    <span>Birthday</span>
                    <span>•</span>
                    <span>Re-engagement</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded text-xs text-white">
                      Table Stakes
                    </span>
                  </div>
                </div>
              </button>

              {/* Level 2: Customer Lifecycle - Middle of iceberg */}
              <button
                onClick={() => onSelectLevel?.('lifecycle')}
                className={`
                  relative mx-auto block w-[85%] -mt-2 transition-all
                  ${highlightLevel === 'lifecycle' ? 'scale-105' : 'hover:scale-102'}
                `}
              >
                <div
                  className={`
                    bg-gradient-to-br from-violet-500/95 to-purple-600/95 p-4 shadow-lg backdrop-blur-sm
                    ${highlightLevel === 'lifecycle' ? 'ring-4 ring-violet-300' : ''}
                  `}
                >
                  <div className="flex items-center justify-center gap-2 text-white mb-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-semibold">Customer Lifecycle Journeys</span>
                  </div>
                  <div className="flex justify-center gap-3 text-xs text-white/90 flex-wrap">
                    <span>Cart Abandon</span>
                    <span>•</span>
                    <span>Post-Purchase</span>
                    <span>•</span>
                    <span>Win-Back</span>
                    <span>•</span>
                    <span>Replenishment</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="inline-block px-2 py-0.5 bg-white/20 rounded text-xs text-white">
                      Meeting Expectations
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Below water section */}
            <div className="pb-6 pt-2">
              {/* Level 3: Insight-Driven - Below water */}
              <button
                onClick={() => onSelectLevel?.('insight-driven')}
                className={`
                  relative mx-auto block w-full px-4 transition-all
                  ${highlightLevel === 'insight-driven' ? 'scale-105' : 'hover:scale-102'}
                `}
              >
                <div
                  className={`
                    bg-gradient-to-br from-slate-700/95 to-slate-900/95 rounded-b-3xl p-5 shadow-2xl border border-slate-500/50 backdrop-blur-sm
                    ${highlightLevel === 'insight-driven' ? 'ring-4 ring-amber-400' : ''}
                  `}
                >
                  <div className="flex items-center justify-center gap-2 text-white mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold">Insight-Driven Experiences</span>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-center text-slate-300 text-sm mb-3">
                    Brand-unique experiences powered by proprietary data and predictive models.
                    <br />
                    <span className="text-amber-400 font-medium">
                      Competitors cannot replicate these.
                    </span>
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-slate-400">
                    <span>Predictive Triggers</span>
                    <span>•</span>
                    <span>Next-Best-Action</span>
                    <span>•</span>
                    <span>Anomaly-Based</span>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs text-amber-400 font-medium">
                      Competitive Advantage
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* AMC Case Study */}
        <div className="mt-6 border border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
          <button
            onClick={() => setExpandedCase(!expandedCase)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-amber-100/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">Real Example:</span>
                  <span className="text-amber-700 font-medium">AMC Theatres</span>
                </div>
                <p className="text-sm text-slate-500">
                  How data anomaly mining led to a breakthrough journey
                </p>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-slate-400 transition-transform ${expandedCase ? 'rotate-90' : ''}`}
            />
          </button>

          {expandedCase && (
            <div className="px-5 pb-5 space-y-4">
              {/* The Discovery */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">The Discovery</h4>
                  <p className="text-sm text-slate-600">
                    Mining anomalies in engagement data, we discovered a spike in{' '}
                    <span className="font-medium text-slate-900">
                      repeat opens of order confirmation/ticket emails
                    </span>
                    . When we dug in, we found these opens were happening right about the time the
                    movie the customer was seeing was ending.
                  </p>
                </div>
              </div>

              {/* The Insight */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">The Insight</h4>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <Quote className="w-4 h-4 text-amber-400 mb-1" />
                    <p className="text-sm text-slate-700 italic">
                      "Customers are never more excited to go back to the movies than when they're
                      walking out of one. They've just had a good time, they're talking about it
                      with friends or family, they've seen previews they want to watch — so they
                      pull up the most recent email they have from AMC, which is often that ticket
                      email."
                    </p>
                  </div>
                </div>
              </div>

              {/* The Solution */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">The Experience</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    We built a cross-channel journey to meet consumers as they're walking out of a
                    film, capitalizing on their excitement with:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-sm">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>Timed email with recommendations</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-sm">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>SMS for immediate action</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-sm">
                      <Smartphone className="w-4 h-4 text-violet-500" />
                      <span>Push for app users</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* The Result */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Why This Matters</h4>
                  <p className="text-sm text-slate-600">
                    This experience is{' '}
                    <span className="font-medium text-purple-700">
                      impossible for competitors to replicate
                    </span>{' '}
                    — it requires AMC's unique combination of:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Ticket purchase and showtime data
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Movie runtime information
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Cross-channel orchestration capability
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      The insight from anomaly detection
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key Takeaway */}
              <div className="mt-4 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg text-white">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">The Insight-Driven Difference</h4>
                    <p className="text-sm text-slate-300">
                      Insight-driven experiences aren't just "better personalization" — they're
                      entirely new moments of engagement that only emerge when you deeply understand
                      your customer data. This is what sits below the waterline: the proprietary
                      advantage that defines market leaders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Level descriptions */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-xs font-medium text-emerald-700 mb-1">L1: SUBSCRIBER</div>
            <p className="text-xs text-emerald-600">
              Everyone expects these. Missing them creates a competitive disadvantage.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-violet-50 border border-violet-200">
            <div className="text-xs font-medium text-violet-700 mb-1">L2: LIFECYCLE</div>
            <p className="text-xs text-violet-600">
              Purchase-driven journeys that meet modern consumer expectations.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-300">
            <div className="text-xs font-medium text-slate-700 mb-1">L3: INSIGHT-DRIVEN</div>
            <p className="text-xs text-slate-600">
              Brand-unique experiences competitors cannot replicate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
