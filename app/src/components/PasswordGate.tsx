import { useState, useEffect } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'mp-navigator-auth';
const VALID_PASSWORD = 'success26';

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === VALID_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'authenticated');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Password entry screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-center">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">M&P Navigator</h1>
          <p className="text-white/80 mt-1">Enter password to access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="password" className="block font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access password..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!password.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-merkle-blue to-salesforce-blue text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Access Navigator
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Merkle M&P Maturity Navigator - Internal Tool
          </p>
        </div>
      </div>
    </div>
  );
}
