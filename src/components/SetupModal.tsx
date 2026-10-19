import React, { useState } from 'react';
import {
  X, Server, Copy, CheckCircle2, ExternalLink, Database, KeyRound, Rocket, BookOpen,
} from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

/** The exact snippet the user pastes into `.env.local`. */
const ENV_SNIPPET = `VITE_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR-PUBLIC-ANON-KEY"`;

/**
 * Actionable setup guide shown whenever a backend-only action (Start Project,
 * sign-in, upvote, comment) is attempted while Supabase is not configured.
 *
 * Replaces the old dead-end toast: it explains WHY the app is in demo mode and
 * gives the exact steps + copyable env snippet to fix it. Only placeholder
 * values are ever shown — no secrets exist client-side to leak.
 */
export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(ENV_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (permissions / insecure context).
      setCopied(false);
    }
  };

  const steps = [
    {
      icon: <Rocket className="w-4 h-4" />,
      title: 'Create a Supabase project',
      body: (
        <>
          Go to{' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            supabase.com/dashboard
          </a>{' '}
          → <b>New project</b>. Wait for it to finish provisioning.
        </>
      ),
    },
    {
      icon: <Database className="w-4 h-4" />,
      title: 'Apply the database schema',
      body: (
        <>
          Open <b>SQL Editor</b> in the dashboard, paste the contents of{' '}
          <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">
            supabase/migrations/0001_init.sql
          </code>{' '}
          and run it. This creates the tables, indexes, triggers and Row Level
          Security policies.
        </>
      ),
    },
    {
      icon: <KeyRound className="w-4 h-4" />,
      title: 'Add your credentials',
      body: (
        <>
          Copy <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">.env.example</code>{' '}
          to a new <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">.env.local</code>{' '}
          file and paste in your <b>Project URL</b> and <b>anon public</b> key
          (Settings → API). The snippet below is ready to fill in.
        </>
      ),
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      title: 'Restart & verify',
      body: (
        <>
          Restart the dev server (<code className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">npm run dev</code>).
          The amber "Demo mode" banner disappears, sign-in activates, and Start
          Project publishes to the database. Optional:{' '}
          <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">npm run setup:check</code>{' '}
          validates everything from the terminal.
        </>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative w-full max-w-lg border rounded-2xl shadow-2xl p-6 md:p-7 z-10 max-h-[90vh] overflow-y-auto transition-colors ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-slate-900 border-slate-700'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close setup guide"
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isLight
              ? 'hover:bg-slate-100 text-slate-500'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Server className="w-6 h-6" />
          </div>
          <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Connect Supabase to go live
          </h2>
          <p className={`mt-1.5 text-xs md:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            This action needs the backend. Right now no credentials are configured, so
            LaunchForge runs in <b>demo mode</b>: sample projects are browsable, but
            accounts, launches and upvotes are disabled. Four steps to enable them:
          </p>
          {/* Live status of the two required variables */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
              VITE_SUPABASE_URL — not set
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
              VITE_SUPABASE_ANON_KEY — not set
            </span>
          </div>
        </div>

        {/* Steps */}
        <ol className="space-y-3.5 mb-5">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isLight ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/15 text-cyan-300'
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className={`text-sm font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span className="text-cyan-500">{step.icon}</span>
                  {step.title}
                </div>
                <p className={`mt-1 text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Copyable env snippet */}
        <div className={`rounded-xl border p-3 mb-5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              .env.local
            </span>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                copied
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy snippet'}
            </button>
          </div>
          <pre className={`text-[11px] leading-relaxed font-mono whitespace-pre-wrap break-all ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
{ENV_SNIPPET}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
          >
            Open Supabase dashboard
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Keep browsing demo
          </button>
        </div>

        <p className={`mt-4 text-[11px] text-center ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          Full walkthrough in <code className="px-1 py-0.5 rounded bg-slate-500/10">README.md</code> →
          "Backend setup (Supabase)". Sample projects and demo previews keep working either way.
        </p>
      </div>
    </div>
  );
};
