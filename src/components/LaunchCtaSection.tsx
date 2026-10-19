import React from 'react';
import { BackgroundParticles3D } from './BackgroundParticles3D';
import { Rocket, Sparkles, TrendingUp, Users, Eye, Layers, ArrowRight } from 'lucide-react';
import { PlatformStats } from '../types';

interface LaunchCtaSectionProps {
  stats: PlatformStats;
  onOpenLaunch: () => void;
  theme?: 'dark' | 'light';
}

export const LaunchCtaSection: React.FC<LaunchCtaSectionProps> = ({
  stats,
  onOpenLaunch,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  return (
    <section className="relative py-24 my-12 overflow-hidden">
      {/* Background Cosmic Launch Horizon Image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover scale-105 ${isLight ? 'opacity-5 mix-blend-multiply' : 'opacity-20 mix-blend-screen'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isLight ? 'from-slate-50 via-cyan-50/20 to-slate-50' : 'from-[#05070f] via-cyan-950/30 to-[#05070f]'
        }`} />
      </div>

      {/* 3D Animated Background Canvas */}
      <BackgroundParticles3D density={180} />

      {/* Decorative Gradient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`p-8 sm:p-12 lg:p-16 rounded-3xl border shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-colors ${
          isLight
            ? 'bg-white/95 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]'
            : 'bg-slate-900/85 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]'
        }`}>
          
          {/* Floating HUD Badges in the corner */}
          <div className={`absolute top-6 right-6 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-cyan-700'
              : 'bg-slate-950/80 border-white/10 text-cyan-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>INSTANT DISCOVERY • ZERO PAYWALLS</span>
          </div>

          <div className="max-w-3xl space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              ACCELERATE YOUR LAUNCH
            </div>

            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight font-heading ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              "Your idea deserves to be seen."
            </h2>

            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Don't let your code sit in a hidden repository. Launch on LaunchForge to reach thousands of beta testers, fellow engineers, angel investors, and tech enthusiasts on day one.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onOpenLaunch}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
              >
                <Rocket className="w-4 h-4 text-cyan-200" />
                <span>Submit Your Project Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Takes less than 2 minutes • Free forever
              </span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className={`mt-14 pt-10 border-t grid grid-cols-2 md:grid-cols-4 gap-6 text-center ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            {/* Stat 1: Projects Launched */}
            <div className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <Rocket className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-heading ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {stats.projectsLaunched.toLocaleString()}+
              </div>
              <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Projects Launched</p>
            </div>

            {/* Stat 2: Creators */}
            <div className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500">
                <Users className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-heading ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {stats.creatorsCount.toLocaleString()}+
              </div>
              <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Active Creators</p>
            </div>

            {/* Stat 3: Monthly Views */}
            <div className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Eye className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-heading ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {stats.monthlyViews}
              </div>
              <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Monthly Project Views</p>
            </div>

            {/* Stat 4: Categories */}
            <div className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Layers className="w-4 h-4" />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-heading ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {stats.activeCategories} Domains
              </div>
              <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Innovation Categories</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
