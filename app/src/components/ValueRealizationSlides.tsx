import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Users,
  Building2,
  Target,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  BarChart3,
  Award,
} from 'lucide-react';

interface ValueRealizationSlidesProps {
  onClose: () => void;
}

export function ValueRealizationSlides({ onClose }: ValueRealizationSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full aspect-[16/9] overflow-hidden flex flex-col shadow-2xl">
        {/* Slide Content */}
        <div className="flex-1 overflow-hidden">
          {currentSlide === 0 && <SlideOne />}
          {currentSlide === 1 && <SlideTwo />}
          {currentSlide === 2 && <SlideThree />}
        </div>

        {/* Navigation Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentSlide ? 'bg-merkle-blue' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="flex items-center gap-1 px-4 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 1: The Problem - "The Uncomfortable Truth"
function SlideOne() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">The Uncomfortable Truth</h1>
          <p className="text-slate-400 text-lg">Why Salesforce investments underperform</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Value Realization Framework</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left Side - The Gap */}
        <div className="flex flex-col justify-center">
          {/* C-Suite Pain */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-400 font-semibold mb-1">C-Suite</h3>
                <p className="text-white text-lg italic">"We spent $2M on Salesforce. Where's the ROI?"</p>
              </div>
            </div>
          </div>

          {/* The Gap */}
          <div className="flex items-center justify-center py-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full mx-4">
              <span className="text-amber-400 font-semibold text-sm">THE VALUE GAP</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          </div>

          {/* Marketing Pain */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-blue-400 font-semibold mb-1">Marketing Teams</h3>
                <p className="text-white text-lg italic">"We've squeezed every drop from what we have."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - The Stats */}
        <div className="flex flex-col justify-center">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-semibold text-white">The Reality</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">70%</span>
                </div>
                <div>
                  <p className="text-white font-medium">of platform capabilities</p>
                  <p className="text-slate-400">sit unused or underutilized</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">60%</span>
                </div>
                <div>
                  <p className="text-white font-medium">of implementations</p>
                  <p className="text-slate-400">never reach full potential</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">$0</span>
                </div>
                <div>
                  <p className="text-white font-medium">is spent on optimization</p>
                  <p className="text-slate-400">after initial implementation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-slate-500 text-sm">
              Salesforce knows the risk: partners who launch and leave
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 2: The Iceberg - "From Shelfware to Showcase"
function SlideTwo() {
  return (
    <div className="h-full bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 p-8 flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-400/20 to-transparent" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">From Shelfware to Showcase</h1>
          <p className="text-cyan-300 text-lg">Unlocking the capabilities you already own</p>
        </div>
        <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full">
          <span className="text-white font-medium">Back to Boutique</span>
        </div>
      </div>

      {/* Main Content - Iceberg Visual */}
      <div className="flex-1 grid grid-cols-5 gap-6 relative z-10">
        {/* Left Labels - Above the Line */}
        <div className="col-span-2 flex flex-col justify-start pt-4">
          <div className="bg-cyan-500/20 backdrop-blur border border-cyan-400/30 rounded-xl p-4 mb-3">
            <h3 className="text-cyan-300 font-semibold mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              What They Think They're Using
            </h3>
            <ul className="space-y-1.5 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                Basic email campaigns
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                Simple automations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                Standard reporting
              </li>
            </ul>
          </div>

          {/* Water Line Indicator */}
          <div className="flex items-center gap-2 my-4 pl-4">
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
            <span className="text-cyan-400 text-xs font-medium px-2 py-1 bg-cyan-500/20 rounded">SURFACE</span>
          </div>
        </div>

        {/* Center - Iceberg Image */}
        <div className="col-span-1 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/iceberg.png"
              alt="Value Iceberg"
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.3))' }}
            />
          </div>
        </div>

        {/* Right Labels - Below the Line */}
        <div className="col-span-2 flex flex-col justify-end pb-4">
          {/* Water Line Indicator */}
          <div className="flex items-center gap-2 mb-4 pr-4">
            <span className="text-emerald-400 text-xs font-medium px-2 py-1 bg-emerald-500/20 rounded">UNTAPPED</span>
            <div className="flex-1 h-px bg-gradient-to-l from-emerald-400 to-transparent" />
          </div>

          <div className="bg-emerald-500/20 backdrop-blur border border-emerald-400/30 rounded-xl p-4">
            <h3 className="text-emerald-300 font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              What's Actually Possible
            </h3>
            <ul className="space-y-1.5 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Agentforce autonomous campaigns
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Real-time journey orchestration
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Predictive CLV & churn modeling
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Cross-cloud identity resolution
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Einstein-powered personalization
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Zero-copy data federation
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Message */}
      <div className="relative z-10 mt-4 text-center">
        <p className="text-white/60 text-sm">
          <span className="text-emerald-400 font-semibold">Our role:</span> Surface what's below the waterline and chart a path to value
        </p>
      </div>
    </div>
  );
}

// Slide 3: The Solution - "Everyone Wins"
function SlideThree() {
  return (
    <div className="h-full bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">The Value Realization Framework</h1>
          <p className="text-gray-500 text-lg">Stop buying more. Start getting more.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-merkle-blue rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="text-merkle-blue font-semibold">Everyone Wins</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* The Flow */}
        <div className="col-span-3 mb-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00A1E0] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SF</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Salesforce</p>
                  <p className="text-gray-500 text-sm">Platform Potential</p>
                </div>
              </div>

              <ArrowRight className="w-8 h-8 text-gray-300" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-merkle-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Merkle</p>
                  <p className="text-gray-500 text-sm">Strategy & Delivery</p>
                </div>
              </div>

              <ArrowRight className="w-8 h-8 text-gray-300" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Client</p>
                  <p className="text-gray-500 text-sm">Outcomes & Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder Cards */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">CMO & Marketing</h3>
          </div>
          <ul className="space-y-2 flex-1">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Team looks like rockstars with measurable impact</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Unlock capabilities without asking for more budget</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Clear roadmap to advanced personalization</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">"Finally, a partner who helps us use what we have."</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">C-Suite & CFO</h3>
          </div>
          <ul className="space-y-2 flex-1">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Visible ROI on existing Salesforce investment</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Phased approach with clear business outcomes</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Confidence that technology spend is justified</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">"We're finally seeing returns on our platform investment."</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Salesforce & Merkle</h3>
          </div>
          <ul className="space-y-2 flex-1">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Protected revenue & expansion opportunities</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Referenceable success stories</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Ongoing delivery & strategic partnership</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">"A partner that drives real value, not just implementations."</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-white" />
          <div>
            <p className="text-white font-semibold">New Business Weapon</p>
            <p className="text-white/80 text-sm">Find Salesforce customers who are tired of being sold more</p>
          </div>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-lg">
          <p className="text-white font-medium">Let's show them what's possible</p>
        </div>
      </div>
    </div>
  );
}
