import React, { useState } from 'react';
import {
  Sparkles, Play, Info, X, MonitorPlay, ShieldCheck, MousePointerClick,
} from 'lucide-react';
import { DEMO_GALLERY, DemoItem, DemoKind } from '../data/demoGallery';

interface DemoGalleryProps {
  /** Opens the in-app sandboxed preview for a demo. */
  onPreview: (demo: DemoItem) => void;
  theme?: 'dark' | 'light';
}

/* ------------------------------------------------------------------ *
 * Miniature, purely-decorative renderings of each demo's layout.
 * These are static CSS mock-ups (no iframes, no scripts) so all eight
 * thumbnails stay cheap while still showing what each demo looks like.
 * ------------------------------------------------------------------ */
const DemoThumb: React.FC<{ demo: DemoItem; expanded: boolean }> = ({
  demo,
  expanded,
}) => {
  const a = demo.accent;
  const kind = demo.kind as DemoKind;

  const shell = (
    <div
      className="w-full h-full p-3 flex flex-col gap-2"
      style={{
        background: `linear-gradient(160deg, ${a}22 0%, transparent 55%), #0b1220`,
      }}
    >
      {/* fake browser bar */}
      <div className="flex items-center gap-1 pb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
        <span className="ml-1 h-1.5 flex-1 rounded-full bg-white/10" />
      </div>

      {kind === 'portfolio' && (
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md"
              style={{ background: a }}
            />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-3/4 rounded bg-white/40" />
              <div className="h-1.5 w-1/2 rounded bg-white/20" />
            </div>
          </div>
          <div className="h-1.5 w-5/6 rounded bg-white/30" />
          <div className="h-1.5 w-2/3 rounded bg-white/15" />
          <div className="flex gap-1 pt-1">
            <div className="h-2.5 w-8 rounded-full" style={{ background: a }} />
            <div className="h-2.5 w-8 rounded-full bg-white/15" />
            <div className="h-2.5 w-8 rounded-full bg-white/15" />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 rounded bg-white/10" />
            ))}
          </div>
        </div>
      )}

      {kind === 'store' && (
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-6 rounded-full"
                style={{ background: i === 0 ? a : 'rgba(255,255,255,.15)' }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded bg-white/10 flex flex-col p-1 gap-1">
                <div
                  className="h-5 rounded-sm"
                  style={{ background: `${a}${i % 2 ? '88' : 'cc'}` }}
                />
                <div className="h-1 w-3/4 rounded bg-white/30" />
              </div>
            ))}
          </div>
        </div>
      )}

      {kind === 'saas' && (
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-2 w-4/5 rounded bg-white/40 self-center" />
          <div className="h-1.5 w-3/5 rounded bg-white/20 self-center" />
          <div className="grid grid-cols-3 gap-1.5 flex-1 mt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded bg-white/10 flex flex-col gap-1 p-1"
                style={i === 1 ? { border: `1px solid ${a}` } : undefined}
              >
                <div className="h-1.5 w-2/3 rounded bg-white/30" />
                <div className="h-3 w-1/2 rounded" style={{ background: a }} />
                <div className="h-1 w-full rounded bg-white/20" />
                <div className="h-1 w-5/6 rounded bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      )}

      {kind === 'analytics' && (
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-6 rounded bg-white/10 p-1">
                <div className="h-1 w-1/2 rounded bg-white/25" />
                <div className="h-1.5 w-3/4 rounded" style={{ background: a }} />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded bg-white/10 flex items-end gap-1 p-1.5">
            {[40, 70, 55, 85, 65, 95, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{ background: a, height: `${h}%`, opacity: 0.55 + i * 0.06 }}
              />
            ))}
          </div>
        </div>
      )}

      {kind === 'chat' && (
        <div className="flex-1 flex flex-col gap-1.5 justify-end">
          <div className="self-start max-w-[70%] rounded-2xl rounded-bl-sm bg-white/12 px-2 py-1.5">
            <div className="h-1 w-16 rounded bg-white/40" />
            <div className="h-1 w-10 rounded bg-white/20 mt-1" />
          </div>
          <div
            className="self-end max-w-[70%] rounded-2xl rounded-br-sm px-2 py-1.5"
            style={{ background: a }}
          >
            <div className="h-1 w-20 rounded bg-white/70" />
            <div className="h-1 w-14 rounded bg-white/40 mt-1" />
          </div>
          <div className="self-start rounded-2xl rounded-bl-sm bg-white/12 px-2 py-1.5 flex gap-1">
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="w-1 h-1 rounded-full bg-white/50" />
          </div>
          <div className="flex gap-1 pt-1">
            <div className="h-4 flex-1 rounded-full bg-white/10" />
            <div className="h-4 w-5 rounded" style={{ background: a }} />
          </div>
        </div>
      )}

      {kind === 'repos' && (
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2.5 w-7 rounded-full"
                style={{ background: i === 0 ? a : 'rgba(255,255,255,.15)' }}
              />
            ))}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded bg-white/10 p-1.5 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: a }} />
              <div className="flex-1 space-y-1">
                <div className="h-1.5 w-2/5 rounded bg-white/40" />
                <div className="h-1 w-4/5 rounded bg-white/15" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: a }} />
            </div>
          ))}
        </div>
      )}

      {kind === 'agency' && (
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-1 w-1/3 rounded" style={{ background: a }} />
          <div className="h-3 w-11/12 rounded bg-white/50 self-center" />
          <div className="h-3 w-9/12 rounded bg-white/30 self-center" />
          <div className="grid grid-cols-2 gap-1.5 flex-1 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded"
                style={{
                  background: `linear-gradient(${135 + i * 30}deg, ${a}, rgba(255,255,255,.08))`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {kind === 'learning' && (
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full border-2"
              style={{ borderColor: a, borderTopColor: 'transparent' }}
            />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-2/3 rounded bg-white/40" />
              <div className="h-1 w-1/2 rounded bg-white/15" />
            </div>
          </div>
          {[70, 45, 90].map((p, i) => (
            <div key={i} className="rounded bg-white/10 p-1.5 flex flex-col gap-1">
              <div className="h-1.5 w-3/5 rounded bg-white/35" />
              <div className="h-1 w-full rounded bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{ width: `${p}%`, background: a }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${
        expanded ? 'max-h-56' : 'max-h-44'
      }`}
    >
      <div className="h-44 sm:h-48">{shell}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

export const DemoGallery: React.FC<DemoGalleryProps> = ({
  onPreview,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section
      id="demos"
      className={`py-20 relative overflow-hidden border-y transition-colors ${
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-[#05070f] border-slate-800/80'
      }`}
    >
      {/* Ambient background glows (matches the rest of the site) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-24 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.5) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-md uppercase ${
              isLight
                ? 'bg-white/70 text-cyan-700 border-cyan-200'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Demo Gallery
          </span>
          <h2
            className={`mt-5 text-3xl md:text-5xl font-extrabold font-heading tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Explore live website
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              {' '}
              previews
            </span>
          </h2>
          <p
            className={`mt-4 text-sm md:text-base leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Eight fully working website templates you can interact with right here —
            no tab-switching, no dead links. Click <b>Live Preview</b> to open any
            demo inside LaunchForge.
          </p>
          <p
            className={`mt-3 inline-flex items-center gap-1.5 text-xs ${
              isLight ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Local, sandboxed demos — clearly labelled examples, not user submissions.
          </p>
        </div>

        {/* Demo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEMO_GALLERY.map((demo) => {
            const expanded = expandedId === demo.id;
            return (
              <article
                key={demo.id}
                className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 backdrop-blur-sm'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <DemoThumb demo={demo} expanded={expanded} />

                  {/* Category pill */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                    style={{ background: `${demo.accent}dd` }}
                  >
                    {demo.category}
                  </span>
                  {/* Demo badge */}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${
                      isLight
                        ? 'bg-white/85 text-slate-600 border-slate-300'
                        : 'bg-slate-950/70 text-slate-300 border-slate-700'
                    }`}
                  >
                    Demo
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 border border-white/25 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      Click Live Preview to interact
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-bold leading-snug ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      <span className="mr-1.5">{demo.icon}</span>
                      {demo.name}
                    </h3>
                  </div>
                  <p
                    className={`mt-2 text-xs leading-relaxed flex-1 ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {demo.description}
                  </p>

                  {/* Feature chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {demo.features.map((f) => (
                      <span
                        key={f}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                          isLight
                            ? 'bg-slate-50 text-slate-600 border-slate-200'
                            : 'bg-slate-800/70 text-slate-300 border-slate-700'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Expandable details */}
                  <div
                    className={`grid transition-all duration-300 ${
                      expanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`text-[11px] leading-relaxed p-2.5 rounded-lg border ${
                          isLight
                            ? 'bg-slate-50 text-slate-600 border-slate-200'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800'
                        }`}
                      >
                        {demo.details}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => onPreview(demo)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Live Preview
                    </button>
                    <button
                      onClick={() => setExpandedId(expanded ? null : demo.id)}
                      aria-expanded={expanded}
                      title={expanded ? 'Hide details' : 'View details'}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors active:scale-95 ${
                        isLight
                          ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      } ${expanded ? 'ring-1 ring-cyan-500/60' : ''}`}
                    >
                      {expanded ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">
                        {expanded ? 'Close' : 'Details'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer note */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-xs ${
            isLight ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <MonitorPlay className="w-4 h-4 text-cyan-500" />
            Previews open in an isolated sandbox inside this page.
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span>Sample gallery content — shipped with LaunchForge, not submitted by users.</span>
        </div>
      </div>
    </section>
  );
};
