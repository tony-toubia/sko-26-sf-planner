import { useState, useEffect } from 'react';
import { X, Save, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

interface SaveAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveAssessmentModal({ isOpen, onClose }: SaveAssessmentModalProps) {
  const { assessment, userEmail, setUserEmail, isSupabaseAvailable } = useAssessment();
  const [email, setEmail] = useState(userEmail || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Update email field when userEmail changes
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSave = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter an email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isSupabaseAvailable) {
      setError('Cloud saving is not available. Please try again later.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const saved = await setUserEmail(trimmedEmail);
      if (saved) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Failed to save. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-merkle-blue to-salesforce-blue flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Save Assessment</h2>
              <p className="text-sm text-white/80">Enter your email to save progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Saved Successfully!</h3>
              <p className="text-sm text-slate-600">
                Your assessment is linked to <strong>{email.toLowerCase().trim()}</strong>
              </p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="save-email" className="block font-medium text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="save-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  You can use this email to retrieve and continue your assessment later.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {assessment && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Assessment Details</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p><span className="text-slate-500">Client:</span> {assessment.clientName}</p>
                    {assessment.industry && (
                      <p><span className="text-slate-500">Industry:</span> {assessment.industry}</p>
                    )}
                    <p><span className="text-slate-500">Created:</span> {assessment.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !email.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Assessment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
