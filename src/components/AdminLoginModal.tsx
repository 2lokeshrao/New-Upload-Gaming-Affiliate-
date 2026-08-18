import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => Promise<boolean>;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(password);
      if (!success) {
        setError('Invalid admin security passcode');
      }
    } catch (err) {
      setError('Authentication server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-purple-400" />
        </div>

        <h3 className="text-xl font-extrabold text-white">Admin Security Access</h3>
        <p className="text-slate-400 text-xs mt-1 mb-6">
          Enter admin passcode to manage platforms, cloak settings, and global offers.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-500 outline-none placeholder:text-slate-600"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>

          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
