import React from 'react';
import { HeroForge3D } from './HeroForge3D';
import { Rocket, Compass, Sparkles, ArrowRight, ShieldCheck, Flame, Star } from 'lucide-react';

interface HeroSectionProps {
  onOpenLaunch: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenLaunch,
  onExploreClick,
}) => {
  return (
    <section id="hero" className="relative min-h-[90vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden">
      {/* High-tech Spatial Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070f] via-[#05070f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-transparent to-[#05070f]/90" />
      </div>

      {/* Background Glow Orbs & Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Subtle Matrix/Grid Overlay */}
      <div className="absolute inset-0 tech-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Live Launch Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-semibold text-cyan-300 font-mono tracking-wide">
                SEASON 04 LAUNCH CYCLE OPEN
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 hidden sm:inline">140+ Projects This Week</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-heading">
                Turn Ideas Into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  Launches.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Launch, showcase, and discover the projects shaping what's next. A futuristic launchpad built for creators, engineers, and founders.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenLaunch}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_28px_rgba(6,182,212,0.35)] hover:shadow-[0_0_36px_rgba(6,182,212,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
              >
                <Rocket className="w-4 h-4 text-cyan-200" />
                <span>Launch Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-slate-600 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Projects</span>
              </button>
            </div>

            {/* Social Proof & Metrics Preview */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6">
              {/* Creator Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Builder"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Builder"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Builder"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Builder"
                  />
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 font-medium">Joined by 38,000+ creators worldwide</p>
                </div>
              </div>

              {/* Verified metric badge */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>100% Peer-Curated & Open</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Centerpiece Digital Forge */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <HeroForge3D className="w-full max-w-[540px]" />
          </div>

        </div>
      </div>
    </section>
  );
};
