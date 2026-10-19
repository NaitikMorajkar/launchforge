import React from 'react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

interface FeaturedProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onToggleLike: (id: string) => void;
  likedProjectIds: Set<string>;
  onExploreAll: () => void;
  theme?: 'dark' | 'light';
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onSelectProject,
  onToggleLike,
  likedProjectIds,
  onExploreAll,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section id="featured" className="py-20 relative overflow-hidden">
      {/* Background Innovation Grid Image & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover mix-blend-luminosity ${isLight ? 'opacity-5' : 'opacity-15'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isLight ? 'from-slate-50 via-transparent to-slate-50' : 'from-[#05070f] via-transparent to-[#05070f]'
        }`} />
        <div className={`absolute inset-0 ${isLight ? 'bg-slate-100/40' : 'bg-slate-950/60'}`} />
      </div>

      {/* Background glow subtle aura */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 mb-3 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              CURATED SPOTLIGHT
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-heading ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Featured Breakthroughs
            </h2>
            <p className={`text-sm sm:text-base mt-2 max-w-xl ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Handpicked standout innovations breaking new frontiers across AI, robotics, zero-knowledge fintech, and spatial computing.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className={`self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-cyan-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40'
            }`}
          >
            <span>View All Launches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Tilt Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, idx) => (
            <div 
              key={project.id} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ProjectCard
                project={project}
                onSelect={onSelectProject}
                onToggleLike={(id) => onToggleLike(id)}
                isLiked={likedProjectIds.has(project.id)}
                theme={theme}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
