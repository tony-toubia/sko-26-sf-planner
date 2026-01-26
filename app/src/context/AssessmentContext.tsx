import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type {
  OpportunityAssessment,
  CapabilityAssessment,
  CapabilityRelevance,
  AssessmentAnswer,
  GlobalAssessmentInputs,
  GeneratedPlan,
  IndustryType,
  MarketingFoundationType,
  TrackId,
  TrackLevel,
  TrackLevelStatus,
  TrackLevelAssessment,
} from '../types';
import { generatePlan } from '../utils/planGenerator';
import { INDUSTRIES } from '../data/industries';
import { assessmentService } from '../lib/assessmentService';
import { generateAIPlan, isAIPlanGenerationAvailable } from '../lib/planGenerationApi';

// Saved assessment summary for listing
export interface SavedAssessmentSummary {
  id: string;
  clientName: string;
  industry: string | null;
  updatedAt: Date;
  createdAt: Date;
  isComplete: boolean;
}

interface AssessmentContextValue {
  // Current assessment state
  assessment: OpportunityAssessment | null;
  isAssessmentMode: boolean;
  generatedPlan: GeneratedPlan | null;
  showPlanModal: boolean;
  selectedIndustry: IndustryType | null;
  marketingFoundation: MarketingFoundationType | null;

  // Persistence state
  isSaving: boolean;
  lastSaved: Date | null;
  isSupabaseAvailable: boolean;

  // AI plan generation state
  isGeneratingPlan: boolean;
  planGenerationError: string | null;
  isAIPlanAvailable: boolean;

  // User email state
  userEmail: string | null;

  // Actions
  setSelectedIndustry: (industry: IndustryType) => void;
  setMarketingFoundation: (foundation: MarketingFoundationType) => void;
  startAssessment: (clientName: string, industry: IndustryType, foundation: MarketingFoundationType, opportunityName?: string) => Promise<void>;
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
  generateRecommendationPlan: (inputs: GlobalAssessmentInputs, useAI?: boolean) => Promise<GeneratedPlan | null>;
  generateQuickPlan: () => GeneratedPlan | null;
  clearGeneratedPlan: () => void;
  closePlanModal: () => void;
  openPlanModal: () => void;
  clearPlanError: () => void;
  markComplete: () => void;
  resetAssessment: () => void;

  // Track-based assessment
  saveTrackLevelAssessment: (
    trackId: TrackId,
    level: TrackLevel,
    status: TrackLevelStatus,
    answers: AssessmentAnswer[],
    notes?: string
  ) => void;
  getTrackLevelAssessment: (trackId: TrackId, level: TrackLevel) => TrackLevelAssessment | undefined;

  // Email-based save/retrieve
  setUserEmail: (email: string) => Promise<boolean>;
  loadAssessmentsByEmail: (email: string) => Promise<SavedAssessmentSummary[]>;
  loadAssessment: (assessmentId: string) => Promise<boolean>;

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
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedIndustry, setSelectedIndustryState] = useState<IndustryType | null>(null);
  const [marketingFoundation, setMarketingFoundationState] = useState<MarketingFoundationType | null>(null);

  // Persistence state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isSupabaseAvailable = assessmentService.isAvailable();
  const pendingSaveRef = useRef<TrackLevelAssessment | null>(null);

  // AI plan generation state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planGenerationError, setPlanGenerationError] = useState<string | null>(null);
  const isAIPlanAvailable = isAIPlanGenerationAvailable();

  // User email state (persisted in localStorage)
  const [userEmail, setUserEmailState] = useState<string | null>(() => {
    const stored = localStorage.getItem('mp-navigator-email');
    return stored || null;
  });

  const setSelectedIndustry = useCallback((industry: IndustryType) => {
    setSelectedIndustryState(industry);
  }, []);

  const setMarketingFoundation = useCallback((foundation: MarketingFoundationType) => {
    setMarketingFoundationState(foundation);
    // Also update the assessment if one exists
    setAssessment((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        marketingFoundation: foundation,
        updatedAt: new Date(),
      };
      // Persist to Supabase
      if (isSupabaseAvailable) {
        assessmentService.updateAssessment(prev.id, { marketingFoundation: foundation })
          .then((success) => {
            if (success) setLastSaved(new Date());
          });
      }
      return updated;
    });
  }, [isSupabaseAvailable]);

  const startAssessment = useCallback(async (clientName: string, industry: IndustryType, foundation: MarketingFoundationType, opportunityName?: string) => {
    console.log('[AssessmentContext] startAssessment called:', { clientName, industry, foundation, isSupabaseAvailable });

    // Set the marketing foundation state immediately
    setMarketingFoundationState(foundation);

    // Try to create in Supabase first if available
    if (isSupabaseAvailable) {
      setIsSaving(true);
      const dbAssessment = await assessmentService.createAssessment(
        clientName,
        industry,
        foundation,
        opportunityName
      );
      setIsSaving(false);

      console.log('[AssessmentContext] Supabase response:', dbAssessment?.id || 'null');

      if (dbAssessment) {
        // Use the database-generated ID
        const newAssessment: OpportunityAssessment = {
          ...dbAssessment,
          clientName,
          opportunityName,
          industry: industry,
          createdAt: new Date(),
          updatedAt: new Date(),
          assessments: {},
          isComplete: false,
          marketingFoundation: foundation,
        };
        console.log('[AssessmentContext] Using Supabase assessment ID:', newAssessment.id);
        setAssessment(newAssessment);
        setSelectedIndustryState(industry);
        setIsAssessmentMode(true);
        setGeneratedPlan(null);
        setLastSaved(new Date());
        return;
      }
    }

    // Fallback: create local-only assessment
    const localId = crypto.randomUUID();
    console.log('[AssessmentContext] Falling back to local-only assessment with ID:', localId);
    const newAssessment: OpportunityAssessment = {
      id: localId,
      clientName,
      opportunityName,
      industry: industry,
      createdAt: new Date(),
      updatedAt: new Date(),
      assessments: {},
      isComplete: false,
      marketingFoundation: foundation,
    };
    setAssessment(newAssessment);
    setSelectedIndustryState(industry);
    setIsAssessmentMode(true);
    setGeneratedPlan(null);
  }, [isSupabaseAvailable]);

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
    async (inputs: GlobalAssessmentInputs, useAI: boolean = true): Promise<GeneratedPlan | null> => {
      if (!assessment) return null;

      // Clear any previous error
      setPlanGenerationError(null);

      // Save inputs first
      const updatedAssessment = {
        ...assessment,
        globalInputs: inputs,
        updatedAt: new Date(),
      };
      setAssessment(updatedAssessment);

      // Try AI generation first if available and requested
      if (useAI && isAIPlanAvailable) {
        setIsGeneratingPlan(true);
        try {
          const aiMarkdown = await generateAIPlan(updatedAssessment, inputs);

          // Create a plan object that includes both structured data and AI content
          const plan: GeneratedPlan = {
            ...generatePlan(updatedAssessment, inputs), // Get base structure
            aiGenerated: {
              markdown: aiMarkdown,
              generatedWith: 'claude-sonnet',
            },
          };

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
          setShowPlanModal(true);
          setIsGeneratingPlan(false);
          return plan;
        } catch (error) {
          console.error('AI plan generation failed:', error);
          setPlanGenerationError(error instanceof Error ? error.message : 'Failed to generate AI plan');
          setIsGeneratingPlan(false);
          // Fall through to template-based generation
        }
      }

      // Fallback to template-based generation
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
      setShowPlanModal(true);
      return plan;
    },
    [assessment, isAIPlanAvailable]
  );

  const clearPlanError = useCallback(() => {
    setPlanGenerationError(null);
  }, []);

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
    setShowPlanModal(true);
    return plan;
  }, [assessment, selectedIndustry]);

  const clearGeneratedPlan = useCallback(() => {
    setGeneratedPlan(null);
    setShowPlanModal(false);
  }, []);

  const closePlanModal = useCallback(() => {
    setShowPlanModal(false);
  }, []);

  const openPlanModal = useCallback(() => {
    if (generatedPlan) {
      setShowPlanModal(true);
    }
  }, [generatedPlan]);

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
    setMarketingFoundationState(null);
  }, []);

  // Set user email and update current assessment
  const setUserEmail = useCallback(async (email: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();

    // Store in localStorage
    localStorage.setItem('mp-navigator-email', normalizedEmail);
    setUserEmailState(normalizedEmail);

    // Update current assessment if one exists
    if (assessment && isSupabaseAvailable) {
      const success = await assessmentService.updateAssessment(assessment.id, { userEmail: normalizedEmail });
      if (success) {
        setAssessment((prev) => prev ? { ...prev, userEmail: normalizedEmail } : prev);
        setLastSaved(new Date());
      }
      return success;
    }

    return true;
  }, [assessment, isSupabaseAvailable]);

  // Load assessments by email
  const loadAssessmentsByEmail = useCallback(async (email: string): Promise<SavedAssessmentSummary[]> => {
    if (!isSupabaseAvailable) return [];
    return await assessmentService.listAssessmentsByEmail(email);
  }, [isSupabaseAvailable]);

  // Load a specific assessment by ID
  const loadAssessment = useCallback(async (assessmentId: string): Promise<boolean> => {
    if (!isSupabaseAvailable) return false;

    setIsSaving(true);
    const loaded = await assessmentService.loadAssessment(assessmentId);
    setIsSaving(false);

    if (loaded) {
      setAssessment(loaded);
      setSelectedIndustryState(loaded.industry || null);
      setMarketingFoundationState(loaded.marketingFoundation || null);
      setGeneratedPlan(loaded.generatedPlan || null);
      setIsAssessmentMode(true);

      // Update email state if the assessment has one
      if (loaded.userEmail) {
        localStorage.setItem('mp-navigator-email', loaded.userEmail);
        setUserEmailState(loaded.userEmail);
      }

      return true;
    }

    return false;
  }, [isSupabaseAvailable]);

  // Track-based assessment methods
  const saveTrackLevelAssessment = useCallback(
    (
      trackId: TrackId,
      level: TrackLevel,
      status: TrackLevelStatus,
      answers: AssessmentAnswer[],
      notes?: string
    ) => {
      const key = `${trackId}-${level}`;
      const trackAssessmentData: TrackLevelAssessment = {
        trackId,
        level,
        status,
        answers,
        notes,
        assessedAt: new Date(),
      };

      // Store for async save
      pendingSaveRef.current = trackAssessmentData;

      setAssessment((prev) => {
        // If no assessment exists, create one
        if (!prev) {
          const newAssessment: OpportunityAssessment = {
            id: crypto.randomUUID(),
            clientName: 'Track Assessment',
            createdAt: new Date(),
            updatedAt: new Date(),
            assessments: {},
            isComplete: false,
            trackAssessments: {
              [key]: trackAssessmentData,
            },
          };
          return newAssessment;
        }

        const trackAssessments = prev.trackAssessments || {};
        const updated = {
          ...prev,
          updatedAt: new Date(),
          trackAssessments: {
            ...trackAssessments,
            [key]: trackAssessmentData,
          },
        };

        // Persist to Supabase asynchronously
        if (isSupabaseAvailable && pendingSaveRef.current) {
          console.log('[AssessmentContext] Saving track assessment to Supabase, assessment ID:', prev.id);
          setIsSaving(true);

          // First, try to ensure the assessment exists in Supabase
          // This handles cases where the assessment was created before Supabase integration
          const ensureAndSave = async () => {
            const trackData = pendingSaveRef.current;
            if (!trackData) return false;

            // Try to save directly first
            let success = await assessmentService.saveTrackAssessment(prev.id, trackData);

            // If failed (likely foreign key error), try to create the assessment first
            if (!success && prev.clientName && prev.industry && prev.marketingFoundation) {
              console.log('[AssessmentContext] Assessment may not exist in Supabase, trying to create it first...');
              const dbAssessment = await assessmentService.createAssessment(
                prev.clientName,
                prev.industry,
                prev.marketingFoundation,
                prev.opportunityName
              );

              if (dbAssessment) {
                // Update our local assessment with the DB ID
                console.log('[AssessmentContext] Created assessment in Supabase with ID:', dbAssessment.id);
                // Save track assessment with the new ID
                success = await assessmentService.saveTrackAssessment(dbAssessment.id, trackData);

                // Update the assessment state with the new ID
                if (success) {
                  setAssessment(currentAssessment => {
                    if (!currentAssessment) return currentAssessment;
                    return {
                      ...currentAssessment,
                      id: dbAssessment.id,
                    };
                  });
                }
              }
            }

            return success;
          };

          ensureAndSave()
            .then((success) => {
              setIsSaving(false);
              if (success) {
                console.log('[AssessmentContext] Track assessment saved successfully');
                setLastSaved(new Date());
              } else {
                console.error('[AssessmentContext] Track assessment save returned false');
              }
            })
            .catch((err) => {
              console.error('[AssessmentContext] Track assessment save error:', err);
              setIsSaving(false);
            });
        }

        return updated;
      });
    },
    [isSupabaseAvailable]
  );

  const getTrackLevelAssessment = useCallback(
    (trackId: TrackId, level: TrackLevel): TrackLevelAssessment | undefined => {
      if (!assessment?.trackAssessments) return undefined;
      const key = `${trackId}-${level}`;
      return assessment.trackAssessments[key];
    },
    [assessment]
  );

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
    showPlanModal,
    selectedIndustry,
    marketingFoundation,
    isSaving,
    lastSaved,
    isSupabaseAvailable,
    isGeneratingPlan,
    planGenerationError,
    isAIPlanAvailable,
    userEmail,
    setSelectedIndustry,
    setMarketingFoundation,
    startAssessment,
    endAssessment,
    setCapabilityRelevance,
    saveCapabilityAssessment,
    getCapabilityAssessment,
    saveGlobalInputs,
    generateRecommendationPlan,
    generateQuickPlan,
    clearGeneratedPlan,
    closePlanModal,
    openPlanModal,
    clearPlanError,
    markComplete,
    resetAssessment,
    saveTrackLevelAssessment,
    getTrackLevelAssessment,
    setUserEmail,
    loadAssessmentsByEmail,
    loadAssessment,
    assessedCount,
    relevantCount,
    totalCapabilities,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}
