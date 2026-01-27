import { useState } from 'react';
import {
  CheckCircle2,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import type { ServiceRecommendation } from '../utils/serviceRecommendations';
import type { ServiceSize } from '../data/services';
import { calculateServiceCost, getModifierById } from '../data/services';
import type { IndustryType } from '../types';

interface ServiceSelectorProps {
  recommendations: ServiceRecommendation[];
  industry: IndustryType;
  onConfirm: (selectedServices: SelectedService[]) => void;
  onCancel: () => void;
}

export interface SelectedService {
  serviceId: string;
  size: ServiceSize;
  modifiers: string[];
  estimatedCost: { min: number; max: number };
}

export function ServiceSelector({
  recommendations,
  industry,
  onConfirm,
  onCancel,
}: ServiceSelectorProps) {
  // Initialize with all recommendations pre-selected
  const [selectedServices, setSelectedServices] = useState<Map<string, SelectedService>>(
    new Map(
      recommendations.map((rec) => [
        rec.service.id,
        {
          serviceId: rec.service.id,
          size: rec.recommendedSize,
          modifiers: rec.recommendedModifiers,
          estimatedCost: rec.estimatedCost,
        },
      ])
    )
  );

  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const toggleServiceSelection = (serviceId: string, recommendation: ServiceRecommendation) => {
    const updated = new Map(selectedServices);
    if (updated.has(serviceId)) {
      updated.delete(serviceId);
    } else {
      updated.set(serviceId, {
        serviceId,
        size: recommendation.recommendedSize,
        modifiers: recommendation.recommendedModifiers,
        estimatedCost: recommendation.estimatedCost,
      });
    }
    setSelectedServices(updated);
  };

  const updateServiceSize = (serviceId: string, size: ServiceSize, recommendation: ServiceRecommendation) => {
    const updated = new Map(selectedServices);
    const current = updated.get(serviceId);
    if (current) {
      const newCost = calculateServiceCost(
        recommendation.service,
        size,
        current.modifiers,
        industry
      );
      updated.set(serviceId, {
        ...current,
        size,
        estimatedCost: newCost,
      });
      setSelectedServices(updated);
    }
  };

  const toggleModifier = (serviceId: string, modifierId: string, recommendation: ServiceRecommendation) => {
    const updated = new Map(selectedServices);
    const current = updated.get(serviceId);
    if (current) {
      const newModifiers = current.modifiers.includes(modifierId)
        ? current.modifiers.filter((m) => m !== modifierId)
        : [...current.modifiers, modifierId];

      const newCost = calculateServiceCost(
        recommendation.service,
        current.size,
        newModifiers,
        industry
      );

      updated.set(serviceId, {
        ...current,
        modifiers: newModifiers,
        estimatedCost: newCost,
      });
      setSelectedServices(updated);
    }
  };

  const toggleExpanded = (serviceId: string) => {
    const updated = new Set(expandedServices);
    if (updated.has(serviceId)) {
      updated.delete(serviceId);
    } else {
      updated.add(serviceId);
    }
    setExpandedServices(updated);
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedServices.values()));
  };

  const handleAcceptAll = () => {
    // Already pre-selected, just confirm
    handleConfirm();
  };

  const totalCost = Array.from(selectedServices.values()).reduce(
    (sum, service) => ({
      min: sum.min + service.estimatedCost.min,
      max: sum.max + service.estimatedCost.max,
    }),
    { min: 0, max: 0 }
  );

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended Services</h2>
              <p className="text-gray-600 mt-1">
                Based on your assessment, we've pre-selected services to deliver your maturity roadmap.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-900">
                {selectedServices.size} service{selectedServices.size !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>

          {/* Total Cost */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Review and customize services below, or accept all recommendations to proceed quickly.
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Investment Range</div>
              <div className="text-2xl font-bold text-merkle-blue">
                ${(totalCost.min / 1000).toFixed(0)}K - ${(totalCost.max / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-4 mb-6">
          {recommendations.map((rec) => {
            const isSelected = selectedServices.has(rec.service.id);
            const isExpanded = expandedServices.has(rec.service.id);
            const selectedService = selectedServices.get(rec.service.id);

            return (
              <div
                key={rec.service.id}
                className={`bg-white rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-merkle-blue shadow-md'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Service Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => toggleServiceSelection(rec.service.id, rec)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-merkle-blue border-merkle-blue'
                          : 'border-gray-300 hover:border-merkle-blue'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>

                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rec.service.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityBadge(
                            rec.priority
                          )}`}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{rec.rationale}</p>

                      {/* Size and Cost */}
                      {isSelected && selectedService && (
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              ${(selectedService.estimatedCost.min / 1000).toFixed(0)}K - $
                              {(selectedService.estimatedCost.max / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 capitalize">
                              {selectedService.size} team
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand Button */}
                    {isSelected && (
                      <button
                        onClick={() => toggleExpanded(rec.service.id)}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && isExpanded && selectedService && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-6 space-y-6">
                    {/* Size Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Project Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {rec.service.sizes.map((sizeOption) => {
                          const isSelectedSize = selectedService.size === sizeOption.size;
                          return (
                            <button
                              key={sizeOption.size}
                              onClick={() =>
                                updateServiceSize(rec.service.id, sizeOption.size, rec)
                              }
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                isSelectedSize
                                  ? 'border-merkle-blue bg-merkle-blue/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-semibold text-gray-900 capitalize mb-1">
                                {sizeOption.name}
                              </div>
                              <div className="text-xs text-gray-500 mb-2">
                                {sizeOption.duration}
                              </div>
                              <div className="text-sm font-medium text-merkle-blue">
                                ${(sizeOption.estimatedCost.min / 1000).toFixed(0)}K - $
                                {(sizeOption.estimatedCost.max / 1000).toFixed(0)}K
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Modifiers */}
                    {rec.service.compatibleModifiers.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Service Modifiers
                        </label>
                        <div className="space-y-2">
                          {rec.service.compatibleModifiers.map((modId) => {
                            const modifier = getModifierById(modId);
                            if (!modifier) return null;

                            const isSelectedModifier =
                              selectedService.modifiers.includes(modId);

                            return (
                              <button
                                key={modId}
                                onClick={() => toggleModifier(rec.service.id, modId, rec)}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-start gap-3 ${
                                  isSelectedModifier
                                    ? 'border-merkle-blue bg-merkle-blue/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div
                                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    isSelectedModifier
                                      ? 'bg-merkle-blue border-merkle-blue'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {isSelectedModifier && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {modifier.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {modifier.description}
                                  </div>
                                  <div className="text-xs text-merkle-blue mt-1">
                                    +{((modifier.effortMultiplier - 1) * 100).toFixed(0)}%
                                    effort, +{((modifier.costMultiplier - 1) * 100).toFixed(0)}%
                                    cost
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Scope Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Typical Scope
                        </div>
                        <div className="text-sm text-gray-900">
                          {rec.service.sizes.find((s) => s.size === selectedService.size)
                            ?.typicalScope}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Team Composition
                        </div>
                        <div className="text-sm text-gray-900">
                          {rec.service.sizes
                            .find((s) => s.size === selectedService.size)
                            ?.team.map((t) => `${t.role} (${t.allocation})`)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Back to Assessment
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <div className="text-sm text-gray-500">Total Investment</div>
                <div className="text-xl font-bold text-merkle-blue">
                  ${(totalCost.min / 1000).toFixed(0)}K - ${(totalCost.max / 1000).toFixed(0)}K
                </div>
              </div>

              <button
                onClick={handleAcceptAll}
                disabled={selectedServices.size === 0}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Accept All & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
