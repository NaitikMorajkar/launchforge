import React, { useState } from 'react';
import { X, Github, Mail, Sparkles, ArrowRight, Lock, AlertCircle, CheckCircle2, Chrome } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../lib/auth';
import { isEmail } from '../lib/validation';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

type Mode = 'signin' | 'signup' | 'reset';

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, theme = 'dark' }) => {
  const { isConfigured, signIn, signUp, resetPassword, signInWithOAuth } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isLight = theme === 'light';

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setInfo(null);
    setPassword('');
  };

  const validateEmailField = (): string | null => {
    if (!email.trim()) return 'Email is required.';
    if (!isEmail(email)) return 'Please enter a valid email address.';
    return null;
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    if (!isConfigured) {
      setError('Social sign-in is unavailable until Supabase is configured (see README).');
      return;
    }
    setError(null);
    setInfo(null);
    const { error: oauthError } = await signInWithOAuth(provider);
    if (oauthError) setError(oauthError);
    // On success Supabase redirects to the OAuth provider and back.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const emailError = validateEmailField();
    if (emailError) {
      setError(emailError);
      return;
    }

    if (mode === 'reset') {
      setIsSubmitting(true);
      const { error: resetError } = await resetPassword(email);
      setIsSubmitting(false);
      if (resetError) setError(resetError);
      else setInfo('Password reset email sent. Check your inbox for the link.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please tell us your name so your projects are credited correctly.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setIsSubmitting(true);
      const { error: signUpError, needsConfirmation } = await signUp(email, password, name);
      setIsSubmitting(false);
      if (signUpError) {
        setError(signUpError);
        return;
      }
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      if (needsConfirmation) {
        setInfo('Account created. Confirm your email, then sign in.');
        setMode('signin');
      } else {
        onClose();
      }
      return;
    }

    // sign-in
    if (!password) {
      setError('Password is required.');
      return;
    }
    setIsSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setIsSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    onClose();
  };

  const inputClass = (light: boolean) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
      light
        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500'
        : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-md border rounded-2xl shadow-2xl p-6 md:p-8 z-10 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className={`text-2xl font-bold font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Join LaunchForge' : 'Reset Password'}
          </h3>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {mode === 'signin'
              ? 'Sign in to launch, upvote, and review projects'
              : mode === 'signup'
              ? 'Create your creator account and shape what gets built next'
              : "We'll email you a link to set a new password"}
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Authentication is offline until you connect a Supabase project. Add
              <code className="mx-1 px-1 rounded bg-black/30">VITE_SUPABASE_URL</code>and
              <code className="mx-1 px-1 rounded bg-black/30">VITE_SUPABASE_ANON_KEY</code>to your
              environment, then restart. See README for setup.
            </span>
          </div>
        )}

        {/* OAuth Buttons (real when configured, clearly unavailable otherwise) */}
        <div className="space-y-2.5 mb-6">
          <button
            onClick={() => handleOAuth('github')}
            disabled={!isConfigured}
            className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-white'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub</span>
          </button>
          <button
            onClick={() => handleOAuth('google')}
            disabled={!isConfigured}
            className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-white'
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className={`border-t w-full ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
          <span className={`px-3 text-[11px] uppercase tracking-wider absolute ${
            isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'
          }`}>
            Or with email
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Your name
              </label>
              <input
                type="text"
                required
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                className={inputClass(isLight)}
              />
            </div>
          )}

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className={`${inputClass(isLight)} pl-10`}
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className={`${inputClass(isLight)} pl-10`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Working…</span>
            ) : (
              <>
                <span>
                  {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 space-y-2">
          {mode !== 'reset' ? (
            <p>
              {mode === 'signin' ? "Don't have an account yet? " : 'Already a member? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); resetForm(); }}
                className="text-cyan-400 font-semibold hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          ) : (
            <p>
              Remembered it?{' '}
              <button
                onClick={() => { setMode('signin'); resetForm(); }}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Back to sign in
              </button>
            </p>
          )}
          {mode === 'signin' && (
            <p>
              <button
                onClick={() => { setMode('reset'); resetForm(); }}
                className="text-slate-500 hover:text-slate-300 hover:underline"
              >
                Forgot password?
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
