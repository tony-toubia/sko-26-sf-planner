import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Search,
  Eye,
  Grid3x3,
  List,
  Target,
  Clock,
  Building2,
  Mail,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { OpportunityAssessment } from '../types';

// Keyframes for subtle floating animation
const floatingKeyframes = `
@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-8px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-6px);
  }
}

@keyframes float-slower {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'floating-animation-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = floatingKeyframes;
    document.head.appendChild(style);
  }
}

interface OpportunityData extends OpportunityAssessment {
  estimatedValue?: number;
  stage?: 'unqualified' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  projectedCloseDate?: Date;
  probability?: number;
}

type ViewMode = 'graph' | 'list';

const STAGE_COLORS = {
  'unqualified': '#94A3B8', // slate-400
  'qualified': '#3B82F6', // blue-500
  'proposal': '#F59E0B', // amber-500
  'negotiation': '#10B981', // emerald-500
  'closed-won': '#22C55E', // green-500
  'closed-lost': '#EF4444', // red-500
};

const STAGE_LABELS = {
  'unqualified': 'Unqualified',
  'qualified': 'Qualified',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
};

export function OpportunityPipeline() {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedOpp, setSelectedOpp] = useState<OpportunityData | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      // First, get all assessments
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .order('updated_at', { ascending: false });

      if (assessmentsError) throw assessmentsError;

      // Then, get all track assessments for these assessments
      const assessmentIds = (assessments || []).map((a: any) => a.id);
      const { data: trackAssessments, error: tracksError } = await supabase
        .from('track_assessments')
        .select('*')
        .in('assessment_id', assessmentIds);

      if (tracksError) throw tracksError;

      // Group track assessments by assessment_id
      const tracksByAssessment = new Map<string, any[]>();
      (trackAssessments || []).forEach((track: any) => {
        if (!tracksByAssessment.has(track.assessment_id)) {
          tracksByAssessment.set(track.assessment_id, []);
        }
        tracksByAssessment.get(track.assessment_id)!.push(track);
      });

      // Transform and enrich data
      const enrichedData: OpportunityData[] = (assessments || []).map((assessment: any) => {
        // Get track assessments for this assessment
        const tracks = tracksByAssessment.get(assessment.id) || [];
        const trackCount = tracks.length;

        // Estimate value based on track assessments
        const baseValue = trackCount * 25000; // $25K per assessed track level
        const estimatedValue = Math.round(baseValue * (0.8 + Math.random() * 0.4)); // Add variance

        // Assign random stage for demo (in production, this would come from the DB)
        const stages: OpportunityData['stage'][] = ['unqualified', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
        const stage = stages[Math.floor(Math.random() * 4)]; // Weighted towards active stages

        // Generate projected close date
        const daysToClose = stage === 'qualified' ? 60 : stage === 'proposal' ? 30 : stage === 'negotiation' ? 15 : 90;
        const projectedCloseDate = new Date(Date.now() + daysToClose * 24 * 60 * 60 * 1000);

        // Calculate probability based on stage
        const probability = stage === 'qualified' ? 25 : stage === 'proposal' ? 50 : stage === 'negotiation' ? 75 : stage === 'closed-won' ? 100 : 0;

        // Build trackAssessments map
        const trackAssessmentsMap: Record<string, any> = {};
        tracks.forEach((track: any) => {
          const key = `${track.track_id}-${track.level}`;
          trackAssessmentsMap[key] = {
            trackId: track.track_id,
            level: track.level,
            status: track.status,
            answers: track.answers || [],
            assessedAt: track.assessed_at,
          };
        });

        return {
          id: assessment.id,
          clientName: assessment.client_name,
          opportunityName: assessment.opportunity_name,
          industry: assessment.industry,
          createdAt: new Date(assessment.created_at),
          updatedAt: new Date(assessment.updated_at),
          assessments: {},
          isComplete: assessment.is_complete,
          userEmail: assessment.user_email,
          trackAssessments: trackAssessmentsMap,
          marketingFoundation: assessment.marketing_foundation,
          disciplines: assessment.disciplines,
          estimatedValue,
          stage,
          projectedCloseDate,
          probability,
        };
      });

      setOpportunities(enrichedData);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = opp.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.opportunityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;

      return matchesSearch && matchesStage;
    });
  }, [opportunities, searchQuery, stageFilter]);

  // Group by user
  const opportunitiesByUser = useMemo(() => {
    const grouped = new Map<string, OpportunityData[]>();
    filteredOpportunities.forEach(opp => {
      const user = opp.userEmail || 'Unknown';
      if (!grouped.has(user)) {
        grouped.set(user, []);
      }
      grouped.get(user)!.push(opp);
    });
    return grouped;
  }, [filteredOpportunities]);

  // Calculate totals
  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0);
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0) * (opp.probability || 0) / 100, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-merkle-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunity Pipeline</h1>
          <p className="text-gray-600">Visual overview of all opportunities across the team</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Opportunities</div>
                <div className="text-2xl font-bold text-gray-900">{filteredOpportunities.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pipeline Value</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(totalValue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Weighted Value</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(weightedValue / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Users</div>
                <div className="text-2xl font-bold text-gray-900">{opportunitiesByUser.size}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients, opportunities, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
                />
              </div>

              {/* Stage Filter */}
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
              >
                <option value="all">All Stages</option>
                {Object.entries(STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-white text-merkle-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                Graph
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-merkle-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Graph View */}
        {viewMode === 'graph' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 min-h-[600px] relative overflow-hidden">
            <OpportunityGraph
              opportunitiesByUser={opportunitiesByUser}
              onSelectOpportunity={setSelectedOpp}
            />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client / Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Close Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{opp.clientName}</div>
                          {opp.opportunityName && (
                            <div className="text-sm text-gray-500">{opp.opportunityName}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{opp.userEmail || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          ${((opp.estimatedValue || 0) / 1000).toFixed(0)}K
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${STAGE_COLORS[opp.stage || 'unqualified']}20`,
                            color: STAGE_COLORS[opp.stage || 'unqualified'],
                          }}
                        >
                          {STAGE_LABELS[opp.stage || 'unqualified']}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-merkle-blue h-2 rounded-full"
                              style={{ width: `${opp.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{opp.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {opp.projectedCloseDate?.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOpp(opp)}
                          className="text-merkle-blue hover:text-salesforce-blue"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Opportunity Detail Modal */}
        {selectedOpp && (
          <OpportunityDetailModal
            opportunity={selectedOpp}
            onClose={() => setSelectedOpp(null)}
          />
        )}
      </div>
    </div>
  );
}

// Graph visualization component
function OpportunityGraph({
  opportunitiesByUser,
  onSelectOpportunity,
}: {
  opportunitiesByUser: Map<string, OpportunityData[]>;
  onSelectOpportunity: (opp: OpportunityData) => void;
}) {
  const users = Array.from(opportunitiesByUser.entries());

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {/* Connection lines */}
        {users.map(([userEmail, opps], userIndex) => {
          const userAngle = (userIndex / users.length) * 2 * Math.PI;
          const userX = 50 + 35 * Math.cos(userAngle);
          const userY = 50 + 35 * Math.sin(userAngle);

          return opps.map((opp, oppIndex) => {
            const oppAngle = userAngle + ((oppIndex - (opps.length - 1) / 2) * 0.3);
            const oppX = 50 + 25 * Math.cos(oppAngle);
            const oppY = 50 + 25 * Math.sin(oppAngle);

            return (
              <line
                key={`${userEmail}-${opp.id}`}
                x1={`${userX}%`}
                y1={`${userY}%`}
                x2={`${oppX}%`}
                y2={`${oppY}%`}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          });
        })}
      </svg>

      {/* User circles */}
      {users.map(([userEmail, opps], index) => {
        const angle = (index / users.length) * 2 * Math.PI;
        const x = 50 + 35 * Math.cos(angle);
        const y = 50 + 35 * Math.sin(angle);
        const totalValue = opps.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0);

        // Extract first and last initials from email (firstname.lastname@domain.com)
        const namePart = userEmail.split('@')[0];
        const nameParts = namePart.split('.');
        const initials = nameParts.length >= 2
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : namePart.substring(0, 2).toUpperCase();

        return (
          <div
            key={userEmail}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              zIndex: 10,
            }}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-merkle-blue to-salesforce-blue flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-110">
                {initials}
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                  {userEmail.split('@')[0]}
                  <div className="text-gray-400">${(totalValue / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Opportunity circles */}
      {users.map(([_userEmail, opps], userIndex) => {
        const userAngle = (userIndex / users.length) * 2 * Math.PI;

        return opps.map((opp, oppIndex) => {
          const oppAngle = userAngle + ((oppIndex - (opps.length - 1) / 2) * 0.3);
          const distance = 25;
          const x = 50 + distance * Math.cos(oppAngle);
          const y = 50 + distance * Math.sin(oppAngle);
          const size = Math.min(Math.max((opp.estimatedValue || 0) / 5000, 40), 80);

          // Different animation durations for variety
          const animations = ['float', 'float-slow', 'float-slower'];
          const animationName = animations[oppIndex % 3];
          const duration = 3 + (oppIndex % 3) * 0.5; // 3s, 3.5s, 4s
          const delay = oppIndex * 0.2; // Stagger the animations

          return (
            <button
              key={opp.id}
              onClick={() => onSelectOpportunity(opp)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all hover:scale-110 shadow-lg group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: STAGE_COLORS[opp.stage || 'unqualified'],
                zIndex: 5,
                animation: `${animationName} ${duration}s ease-in-out ${delay}s infinite`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs pointer-events-none">
                ${((opp.estimatedValue || 0) / 1000).toFixed(0)}K
              </div>
              {/* Hover tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                  {opp.clientName}
                </div>
              </div>
            </button>
          );
        });
      })}

      {/* Center legend */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-2" />
        <div className="text-sm text-gray-400">Opportunity Pipeline</div>
      </div>
    </div>
  );
}

// Detail modal
function OpportunityDetailModal({
  opportunity,
  onClose,
}: {
  opportunity: OpportunityData;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Opportunity Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div>
            <div className="text-2xl font-bold text-gray-900">{opportunity.clientName}</div>
            {opportunity.opportunityName && (
              <div className="text-lg text-gray-600">{opportunity.opportunityName}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Estimated Value</div>
              <div className="text-2xl font-bold text-merkle-blue">
                ${((opportunity.estimatedValue || 0) / 1000).toFixed(0)}K
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Stage</div>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${STAGE_COLORS[opportunity.stage || 'unqualified']}20`,
                  color: STAGE_COLORS[opportunity.stage || 'unqualified'],
                }}
              >
                {STAGE_LABELS[opportunity.stage || 'unqualified']}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Probability</div>
              <div className="text-2xl font-bold text-gray-900">{opportunity.probability}%</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Projected Close</div>
              <div className="text-lg font-semibold text-gray-900">
                {opportunity.projectedCloseDate?.toLocaleDateString()}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">Owner</div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{opportunity.userEmail || 'Unknown'}</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">Industry</div>
            <span className="text-gray-900">{opportunity.industry}</span>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">Assessment Progress</div>
            <div className="text-gray-900">
              {Object.keys(opportunity.trackAssessments || {}).length} tracks assessed
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">Last Updated</div>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock className="w-4 h-4 text-gray-400" />
              {opportunity.updatedAt.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
