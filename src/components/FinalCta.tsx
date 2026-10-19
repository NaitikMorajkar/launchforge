import React from 'react';
import { BackgroundParticles3D } from './BackgroundParticles3D';
import { Rocket, Compass, Sparkles, Flame, ArrowRight } from 'lucide-react';

interface FinalCtaProps {
  onOpenLaunch: () => void;
  onExploreClick: () => void;
  theme?: 'dark' | 'light';
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onOpenLaunch,
  onExploreClick,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  return (
    <section className={`relative py-32 overflow-hidden border-t transition-colors ${
      isLight ? 'border-slate-200' : 'border-slate-800/80'
    }`}>
      {/* Background Cosmic Launch Horizon Image & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover scale-105 ${isLight ? 'opacity-5 mix-blend-multiply' : 'opacity-20 mix-blend-screen'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isLight ? 'from-slate-50 via-slate-100/60 to-slate-50' : 'from-[#05070f] via-slate-950/70 to-[#05070f]'
        }`} />
      </div>

      {/* 3D Animated Background */}
      <BackgroundParticles3D density={220} />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Emblem */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-[0_0_35px_rgba(6,182,212,0.4)]">
          <div className={`w-full h-full rounded-3xl flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
            <Flame className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
          </div>
        </div>

        {/* Headline */}
        <h2 className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-heading mb-6 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          Ready to forge{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500">
            what’s next?
          </span>
        </h2>

        <p className={`text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Join thousands of developers, researchers, and innovators showcasing breakthrough technology to the world.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenLaunch}
            className="w-full sm:w-auto px-9 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] transition-all transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            <Rocket className="w-4 h-4 text-cyan-200" />
            <span>Launch Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreClick}
            className={`w-full sm:w-auto px-9 py-4 rounded-2xl font-bold text-sm border backdrop-blur-xl transition-all flex items-center justify-center gap-2 shadow-sm ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>Explore LaunchForge</span>
          </button>
        </div>

        {/* Guarantee info */}
        <p className={`mt-8 text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          NO CREDIT CARD REQUIRED • INSTANT COMMUNITY ACCESS • UNLIMITED UPDATES
        </p>
      </div>
    </section>
  );
};
