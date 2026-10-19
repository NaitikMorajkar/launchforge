import React from 'react';
import { Project } from '../types';
import { Flame, Heart, Eye, ArrowUpRight, Sparkles } from 'lucide-react';

interface TrendingSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  theme?: 'dark' | 'light';
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  projects,
  onSelectProject,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  // Duplicate array for infinite seamless marquee loop
  const trendingList = [...projects, ...projects];

  return (
    <section 
      id="trending" 
      className={`py-20 relative overflow-hidden border-y transition-colors ${
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800/80'
      }`}
    >
      {/* Background Velocity Cyberpunk Image & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${isLight ? 'opacity-5 mix-blend-multiply' : 'opacity-10 mix-blend-color-dodge'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${
          isLight ? 'from-slate-50 via-transparent to-slate-50' : 'from-[#05070f] via-transparent to-[#05070f]'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold font-heading ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Trending on LaunchForge
              </h2>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Live velocity rankings updated every 15 minutes by community activity
              </p>
            </div>
          </div>

          <div className={`hidden sm:flex items-center gap-2 text-xs font-mono ${
            isLight ? 'text-slate-600' : 'text-slate-500'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>REAL-TIME STREAM</span>
          </div>
        </div>
      </div>

      {/* Marquee Ticker Track */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        {/* Left & Right gradient fade masks */}
        <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r z-10 pointer-events-none ${
          isLight ? 'from-slate-50 to-transparent' : 'from-[#05070f] to-transparent'
        }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l z-10 pointer-events-none ${
          isLight ? 'from-slate-50 to-transparent' : 'from-[#05070f] to-transparent'
        }`} />

        <div className="animate-marquee flex items-center gap-6 py-4">
          {trendingList.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              onClick={() => onSelectProject(project)}
              className={`group relative w-80 flex-shrink-0 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-lg backdrop-blur-xl ${
                isLight
                  ? 'bg-white/95 border-slate-200/90 hover:border-cyan-500/50 hover:shadow-[0_10px_25px_rgba(6,182,212,0.12)]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_10px_25px_rgba(6,182,212,0.2)]'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={project.image}
                  alt={project.name}
                  className={`w-14 h-14 rounded-xl object-cover border flex-shrink-0 ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                        {project.category}
                      </span>
                      {project.isSample && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                          Sample
                        </span>
                      )}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h4 className={`text-sm font-bold truncate mt-1 transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {project.name}
                  </h4>
                  <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    by {project.creator.name}
                  </p>
                </div>
              </div>

              <p className={`text-xs line-clamp-1 mb-3 ${isLight ? 'text-slate-600' : 'text-slate-300/90'}`}>
                {project.tagline}
              </p>

              <div className={`flex items-center justify-between pt-2 border-t text-xs ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/80 text-slate-400'
              }`}>
                <div className="flex items-center gap-1 text-pink-500 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{project.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{project.views > 999 ? `${(project.views / 1000).toFixed(1)}k` : project.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
