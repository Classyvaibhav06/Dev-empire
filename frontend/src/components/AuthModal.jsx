import React, { useState, useContext } from 'react';
import { User, Mail, Lock, X, BrainCircuit, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Card, Badge } from './ui/Shared';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Form values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters.');
        }
        await register(username, email, password);
      }
      setAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-background/75 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={() => setAuthModalOpen(false)}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-xl border border-surfaceBorder/80 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-hidden z-10 animate-scale-in">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-surfaceLight hover:bg-surfaceBorder text-textMuted hover:text-textMain transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 relative">
          {/* Logo Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent p-3 rounded-2xl border border-white/20 text-white shadow-lg mb-4 flex items-center justify-center">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-textMain">Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Dev Empire</span></h3>
            <p className="text-xs text-textMuted mt-1">Connect your account to sync your roadmap progress and scores.</p>
          </div>

          {/* Form Tabs */}
          <div className="flex p-1 bg-surfaceLight border border-surfaceBorder/60 rounded-xl mb-6 relative">
            <button
              onClick={() => handleTabChange('login')}
              type="button"
              className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition-all duration-300 cursor-pointer relative z-10 ${
                activeTab === 'login' ? 'text-white' : 'text-textDim hover:text-textMuted'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              type="button"
              className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition-all duration-300 cursor-pointer relative z-10 ${
                activeTab === 'register' ? 'text-white' : 'text-textDim hover:text-textMuted'
              }`}
            >
              Register
            </button>
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-lg transition-transform duration-300 ease-out shadow-sm"
              style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)', left: '4px' }}
            ></div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/5 border border-danger/20 flex gap-3 text-xs text-danger items-start animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-textDim ml-1">Username</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-4 h-4 text-textDim" />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="codexplorer"
                    className="w-full pl-11 pr-5 py-3 bg-surfaceLight border border-surfaceBorder rounded-xl text-sm text-textMain placeholder-textDim focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-textDim ml-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-textDim" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-5 py-3 bg-surfaceLight border border-surfaceBorder rounded-xl text-sm text-textMain placeholder-textDim focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-textDim ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-textDim" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-5 py-3 bg-surfaceLight border border-surfaceBorder rounded-xl text-sm text-textMain placeholder-textDim focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-40 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                activeTab === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
