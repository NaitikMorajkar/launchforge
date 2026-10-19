import React from 'react';
import { TESTIMONIALS } from '../data/mockProjects';
import { Users, Star, Quote, Sparkles, TrendingUp } from 'lucide-react';

interface CommunitySectionProps {
  theme?: 'dark' | 'light';
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <section id="community" className="py-24 relative overflow-hidden">
      {/* Background Collaborative Community Image & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${isLight ? 'opacity-5 mix-blend-multiply' : 'opacity-10 mix-blend-overlay'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isLight ? 'from-slate-50 via-slate-100/60 to-slate-50' : 'from-[#05070f] via-slate-950/80 to-[#05070f]'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 font-mono">
            <Users className="w-3.5 h-3.5" />
            CREATOR TESTIMONIALS
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-heading ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Forged by Builders
          </h2>
          <p className={`text-sm sm:text-base mt-3 ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Read stories from founders, researchers, and engineers who launched and found momentum on LaunchForge.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-lg backdrop-blur-xl group hover:-translate-y-1 ${
                isLight
                  ? 'bg-white/95 border-slate-200/90 hover:border-cyan-500/40 hover:shadow-xl'
                  : 'bg-slate-900/70 border-slate-800/90 hover:border-cyan-500/40'
              }`}
            >
              <div>
                {/* Metric Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 mb-6 font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.metric}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className={`text-sm sm:text-base leading-relaxed italic mb-8 ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  "{t.text}"
                </p>
              </div>

              {/* Creator Info */}
              <div className={`pt-6 border-t flex items-center gap-3.5 ${
                isLight ? 'border-slate-100' : 'border-slate-800/80'
              }`}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors"
                />
                <div>
                  <h4 className={`text-sm font-bold transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {t.name}
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.role} • <span className="text-cyan-600 dark:text-cyan-400">{t.project}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
