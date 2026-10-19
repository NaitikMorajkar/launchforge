import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, RotateCw, MonitorPlay, ShieldCheck, AlertTriangle } from 'lucide-react';

interface DemoPreviewModalProps {
  /** Local path to the preview page (e.g. /demos/saas.html). */
  src: string | null;
  /** Heading shown in the preview toolbar. */
  title: string;
  /** Optional secondary label (category, project name, …). */
  subtitle?: string;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

/**
 * In-app preview host. Renders a locally-served demo page inside a sandboxed
 * iframe so visitors stay inside LaunchForge.
 *
 * - The sandbox never includes `allow-same-origin`, so the embedded page runs
 *   in an opaque origin and cannot read or mutate the parent application.
 * - Loading is a REAL frame load (no fake spinner): a skeleton shows until the
 *   frame fires `onLoad`, and a genuine error card with "Open in new tab" /
 *   "Retry" fallbacks appears if the frame fails to load in time.
 */
export const DemoPreviewModal: React.FC<DemoPreviewModalProps> = ({
  src,
  title,
  subtitle,
  onClose,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  // Reset whenever a new demo is opened (or retried).
  useEffect(() => {
    if (!src) return;
    setStatus('loading');
  }, [src, attempt]);

  // While open, prevent the page behind the modal from scrolling.
  useEffect(() => {
    if (!src) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [src]);

  // Genuine load watchdog — if onLoad never fires, surface a fallback instead
  // of showing an endless fake loading screen.
  useEffect(() => {
    if (!src || status !== 'loading') return;
    const t = window.setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'error' : s));
    }, 12000);
    return () => window.clearTimeout(t);
  }, [src, status, attempt]);

  if (!src) return null;

  const isLightFrame = isLight;
  const retry = () => setAttempt((a) => a + 1);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Frame shell */}
      <div
        className={`relative w-full max-w-6xl h-[92vh] rounded-2xl overflow-hidden border shadow-2xl flex flex-col ${
          isLightFrame ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-700'
        }`}
      >
        {/* Toolbar */}
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b ${
            isLightFrame ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="hidden sm:flex items-center gap-1.5 pr-1">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <MonitorPlay
                className={`w-4 h-4 flex-shrink-0 ${isLightFrame ? 'text-cyan-600' : 'text-cyan-400'}`}
              />
              <h2
                className={`text-sm font-bold truncate ${
                  isLightFrame ? 'text-slate-900' : 'text-white'
                }`}
              >
                {title}
              </h2>
              {subtitle && (
                <span
                  className={`hidden sm:inline text-[11px] px-2 py-0.5 rounded-full border ${
                    isLightFrame
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {subtitle}
                </span>
              )}
            </div>
            <div
              className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${
                isLightFrame ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="truncate">{src} · sandboxed local preview</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={retry}
              title="Reload preview"
              aria-label="Reload preview"
              className={`p-2 rounded-lg transition-colors ${
                isLightFrame
                  ? 'hover:bg-slate-200 text-slate-600'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              title="Open in a new tab"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isLightFrame
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              New tab
            </a>
            <button
              onClick={onClose}
              autoFocus
              aria-label="Close preview"
              className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading skeleton — replaced as soon as the real frame loads */}
        {status === 'loading' && (
          <div className="absolute inset-0 top-[57px] z-10 flex flex-col items-center justify-center gap-3 bg-slate-950">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            <p className="text-sm text-slate-400">Loading interactive preview…</p>
          </div>
        )}

        {/* Error fallback — only shown if the frame genuinely fails to load */}
        {status === 'error' && (
          <div className="absolute inset-0 top-[57px] z-20 flex flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center">
            <AlertTriangle className="w-9 h-9 text-amber-400" />
            <div>
              <p className="text-white font-semibold">This preview could not be embedded.</p>
              <p className="text-sm text-slate-400 mt-1">
                The page may block framing or failed to load. You can open it in a
                new tab instead — it stays a local LaunchForge demo.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={retry}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                Try again
              </button>
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
              >
                Open in new tab
              </a>
            </div>
          </div>
        )}

        {/* The isolated preview itself */}
        <iframe
          key={attempt}
          ref={frameRef}
          src={src}
          title={title}
          onLoad={() => setStatus('ready')}
          // No `allow-same-origin`: the demo runs in an opaque origin and can
          // never reach into the LaunchForge app (cookies, storage, DOM).
          sandbox="allow-scripts allow-forms allow-popups allow-modals"
          className={`w-full flex-1 bg-white border-0 transition-opacity duration-300 ${
            status === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
