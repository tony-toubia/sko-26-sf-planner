import { useState, useEffect } from 'react';
import {
  X,
  FolderOpen,
  Mail,
  Search,
  AlertCircle,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useAssessment, type SavedAssessmentSummary } from '../context/AssessmentContext';

interface AssessmentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentLoaded: () => void;
}

export function AssessmentListModal({ isOpen, onClose, onAssessmentLoaded }: AssessmentListModalProps) {
  const { userEmail, loadAssessmentsByEmail, loadAssessment, isSupabaseAvailable } = useAssessment();

  const [email, setEmail] = useState(userEmail || '');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessments, setAssessments] = useState<SavedAssessmentSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if userEmail is set when modal opens
  useEffect(() => {
    if (isOpen && userEmail && !hasSearched) {
      setEmail(userEmail);
      handleSearch(userEmail);
    }
  }, [isOpen, userEmail]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasSearched(false);
      setAssessments([]);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSearch = async (searchEmail?: string) => {
    const emailToSearch = searchEmail || email;
    const trimmedEmail = emailToSearch.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter an email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isSupabaseAvailable) {
      setError('Cloud service is not available. Please try again later.');
      return;
    }

    setIsSearching(true);
    setError('');
    setHasSearched(true);

    try {
      const results = await loadAssessmentsByEmail(trimmedEmail);
      setAssessments(results);
      if (results.length === 0) {
        setError('No assessments found for this email address.');
      }
    } catch {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadAssessment = async (assessmentId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await loadAssessment(assessmentId);
      if (success) {
        onAssessmentLoaded();
        onClose();
      } else {
        setError('Failed to load assessment. Please try again.');
      }
    } catch {
      setError('An error occurred while loading. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">My Assessments</h2>
              <p className="text-sm text-white/80">Load a saved assessment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="your.email@company.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="flex items-center gap-2 px-4 py-2 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 disabled:opacity-50 transition-colors"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {isSearching && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-merkle-blue animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-600">Searching for assessments...</p>
            </div>
          )}

          {!isSearching && hasSearched && assessments.length === 0 && !error && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No assessments found</p>
              <p className="text-sm text-slate-400 mt-1">
                Create a new assessment and save it with your email
              </p>
            </div>
          )}

          {!isSearching && assessments.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">
                  Found <strong>{assessments.length}</strong> assessment{assessments.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => handleSearch()}
                  className="text-xs text-merkle-blue hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>

              {assessments.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => handleLoadAssessment(assessment.id)}
                  disabled={isLoading}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-merkle-blue hover:shadow-md transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {assessment.clientName}
                        </h3>
                        {assessment.isComplete ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Complete
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            <Clock className="w-3 h-3" />
                            In Progress
                          </span>
                        )}
                      </div>
                      {assessment.industry && (
                        <p className="text-sm text-slate-500 mb-1">{assessment.industry}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Created: {formatDate(assessment.createdAt)}</span>
                        <span>Updated: {formatDate(assessment.updatedAt)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-merkle-blue transition-colors flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </>
          )}

          {!hasSearched && (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Enter your email to find saved assessments</p>
              <p className="text-sm text-slate-400 mt-1">
                Assessments are linked to the email you used when saving
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
