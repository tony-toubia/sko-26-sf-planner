import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  OpportunityAssessment,
  CapabilityAssessment,
  CapabilityRelevance,
  AssessmentAnswer,
  GlobalAssessmentInputs,
  GeneratedPlan,
  IndustryType,
} from '../types';
import { generatePlan } from '../utils/planGenerator';
import { INDUSTRIES } from '../data/industries';

interface AssessmentContextValue {
  // Current assessment state
  assessment: OpportunityAssessment | null;
  isAssessmentMode: boolean;
  generatedPlan: GeneratedPlan | null;
  selectedIndustry: IndustryType | null;

  // Actions
  setSelectedIndustry: (industry: IndustryType) => void;
  startAssessment: (clientName: string, industry: IndustryType, opportunityName?: string) => void;
  endAssessment: () => void;
  setCapabilityRelevance: (capabilityId: string, relevance: CapabilityRelevance) => void;
  saveCapabilityAssessment: (
    capabilityId: string,
    relevance: CapabilityRelevance,
    answers: AssessmentAnswer[],
    notes?: string
  ) => void;
  getCapabilityAssessment: (capabilityId: string) => CapabilityAssessment | undefined;
  saveGlobalInputs: (inputs: GlobalAssessmentInputs) => void;
  generateRecommendationPlan: (inputs: GlobalAssessmentInputs) => GeneratedPlan | null;
  generateQuickPlan: () => GeneratedPlan | null;
  clearGeneratedPlan: () => void;
  markComplete: () => void;
  resetAssessment: () => void;

  // Computed values
  assessedCount: number;
  relevantCount: number;
  totalCapabilities: number;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}

interface AssessmentProviderProps {
  children: ReactNode;
  totalCapabilities: number;
}

export function AssessmentProvider({ children, totalCapabilities }: AssessmentProviderProps) {
  const [assessment, setAssessment] = useState<OpportunityAssessment | null>(null);
  const [isAssessmentMode, setIsAssessmentMode] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [selectedIndustry, setSelectedIndustryState] = useState<IndustryType | null>(null);

  const setSelectedIndustry = useCallback((industry: IndustryType) => {
    setSelectedIndustryState(industry);
  }, []);

  const startAssessment = useCallback((clientName: string, industry: IndustryType, opportunityName?: string) => {
    const industryData = INDUSTRIES[industry];
    const newAssessment: OpportunityAssessment = {
      id: crypto.randomUUID(),
      clientName,
      opportunityName,
      industry: industryData?.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      assessments: {},
      isComplete: false,
    };
    setAssessment(newAssessment);
    setSelectedIndustryState(industry);
    setIsAssessmentMode(true);
    setGeneratedPlan(null);
  }, []);

  const endAssessment = useCallback(() => {
    setIsAssessmentMode(false);
  }, []);

  const setCapabilityRelevance = useCallback(
    (capabilityId: string, relevance: CapabilityRelevance) => {
      if (!assessment) return;

      setAssessment((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          updatedAt: new Date(),
          assessments: {
            ...prev.assessments,
            [capabilityId]: {
              capabilityId,
              relevance,
              answers: prev.assessments[capabilityId]?.answers || [],
              assessedAt: new Date(),
            },
          },
        };
      });
    },
    [assessment]
  );

  const saveCapabilityAssessment = useCallback(
    (
      capabilityId: string,
      relevance: CapabilityRelevance,
      answers: AssessmentAnswer[],
      notes?: string
    ) => {
      if (!assessment) return;

      setAssessment((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          updatedAt: new Date(),
          assessments: {
            ...prev.assessments,
            [capabilityId]: {
              capabilityId,
              relevance,
              answers,
              notes,
              assessedAt: new Date(),
            },
          },
        };
      });
    },
    [assessment]
  );

  const getCapabilityAssessment = useCallback(
    (capabilityId: string) => {
      return assessment?.assessments[capabilityId];
    },
    [assessment]
  );

  const saveGlobalInputs = useCallback(
    (inputs: GlobalAssessmentInputs) => {
      setAssessment((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          globalInputs: inputs,
          updatedAt: new Date(),
        };
      });
    },
    []
  );

  const generateRecommendationPlan = useCallback(
    (inputs: GlobalAssessmentInputs): GeneratedPlan | null => {
      if (!assessment) return null;

      // Save inputs first
      const updatedAssessment = {
        ...assessment,
        globalInputs: inputs,
        updatedAt: new Date(),
      };
      setAssessment(updatedAssessment);

      // Generate the plan
      const plan = generatePlan(updatedAssessment, inputs);

      // Save plan to assessment
      setAssessment((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          generatedPlan: plan,
          updatedAt: new Date(),
        };
      });

      setGeneratedPlan(plan);
      return plan;
    },
    [assessment]
  );

  // Quick plan generation - uses defaults based on industry
  const generateQuickPlan = useCallback((): GeneratedPlan | null => {
    if (!assessment) return null;

    // Create minimal inputs based on industry
    const industryData = selectedIndustry ? INDUSTRIES[selectedIndustry] : null;
    const quickInputs: GlobalAssessmentInputs = {
      clientContext: {
        industry: industryData?.name || assessment.industry,
      },
      commercialPreferences: {
        budgetFlexibility: 'tbd',
        decisionTimeline: 'exploring',
      },
      strategicContext: {
        keyBusinessDrivers: industryData?.typicalPriorities.slice(0, 3) || [],
      },
    };

    // Generate the plan with minimal inputs
    const updatedAssessment = {
      ...assessment,
      globalInputs: quickInputs,
      updatedAt: new Date(),
    };
    setAssessment(updatedAssessment);

    const plan = generatePlan(updatedAssessment, quickInputs);

    setAssessment((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        generatedPlan: plan,
        updatedAt: new Date(),
      };
    });

    setGeneratedPlan(plan);
    return plan;
  }, [assessment, selectedIndustry]);

  const clearGeneratedPlan = useCallback(() => {
    setGeneratedPlan(null);
  }, []);

  const markComplete = useCallback(() => {
    setAssessment((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isComplete: true,
        updatedAt: new Date(),
      };
    });
  }, []);

  const resetAssessment = useCallback(() => {
    setAssessment(null);
    setIsAssessmentMode(false);
    setGeneratedPlan(null);
  }, []);

  // Computed values
  const assessedCount = assessment ? Object.keys(assessment.assessments).length : 0;
  const relevantCount = assessment
    ? Object.values(assessment.assessments).filter(
        (a) => a.relevance === 'immediately-relevant' || a.relevance === 'near-future'
      ).length
    : 0;

  const value: AssessmentContextValue = {
    assessment,
    isAssessmentMode,
    generatedPlan,
    selectedIndustry,
    setSelectedIndustry,
    startAssessment,
    endAssessment,
    setCapabilityRelevance,
    saveCapabilityAssessment,
    getCapabilityAssessment,
    saveGlobalInputs,
    generateRecommendationPlan,
    generateQuickPlan,
    clearGeneratedPlan,
    markComplete,
    resetAssessment,
    assessedCount,
    relevantCount,
    totalCapabilities,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}
