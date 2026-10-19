import React, { useRef, useState } from 'react';
import { Project } from '../types';
import { Heart, Eye, ArrowUpRight, Sparkles, Tag } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onToggleLike?: (id: string, e: React.MouseEvent) => void;
  isLiked?: boolean;
  theme?: 'dark' | 'light';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onToggleLike,
  isLiked = false,
  theme = 'dark',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const isLight = theme === 'light';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Percentage from center (-1 to 1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: isLight ? 0.08 : 0.15,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Like state + gating are handled upstream (App); no local confetti so we
    // never celebrate an action that was rejected (e.g. signed out / demo mode).
    if (onToggleLike) {
      onToggleLike(project.id, e);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out' : 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
      }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer backdrop-blur-xl ${
        isLight
          ? 'bg-white/95 border border-slate-200/90 shadow-md hover:shadow-[0_12px_30px_rgba(6,182,212,0.12)] hover:border-cyan-500/50 text-slate-800'
          : 'bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 shadow-lg hover:shadow-[0_12px_30px_rgba(6,182,212,0.15)] text-slate-100'
      }`}
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 60%)`,
        }}
      />

      {/* Card Header & Image */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-950">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Category Badge & Trending Indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/85 border border-white/10 text-cyan-300 backdrop-blur-md flex items-center gap-1">
              <Tag className="w-3 h-3 text-cyan-400" />
              {project.category}
            </span>
            {project.isSample && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-md">
                Sample
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {project.trending && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                Trending
              </span>
            )}
            {project.featured && !project.trending && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/20 border border-violet-500/40 text-violet-300 backdrop-blur-md">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Creator Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
          <img
            src={project.creator.avatar}
            alt={project.creator.name}
            className="w-7 h-7 rounded-full object-cover border border-cyan-400/40 ring-2 ring-slate-900/60"
          />
          <div className="text-left leading-tight">
            <p className="text-xs font-medium text-white group-hover:text-cyan-200 transition-colors">
              {project.creator.name}
            </p>
            <p className="text-[10px] text-slate-400">{project.creator.role}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={`text-lg font-bold transition-colors line-clamp-1 ${
              isLight
                ? 'text-slate-900 group-hover:text-cyan-600'
                : 'text-white group-hover:text-cyan-300'
            }`}>
              {project.name}
            </h3>
            <div className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
              isLight
                ? 'text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-50'
                : 'text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10'
            }`}>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          <p className={`text-xs font-medium mb-2 line-clamp-1 ${
            isLight ? 'text-cyan-700' : 'text-cyan-400/90'
          }`}>
            {project.tagline}
          </p>

          <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
            isLight ? 'text-slate-600' : 'text-slate-300/80'
          }`}>
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                }`}
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer Metrics & Actions */}
        <div className={`pt-3 border-t flex items-center justify-between ${
          isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                isLiked 
                  ? 'text-pink-600 bg-pink-500/15 border border-pink-500/30 font-semibold' 
                  : isLight
                  ? 'hover:text-pink-600 hover:bg-pink-50'
                  : 'hover:text-pink-400 hover:bg-pink-500/10'
              }`}
              title="Upvote / Like this project"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-pink-500' : ''}`} />
              <span className="font-semibold">{project.likes}</span>
            </button>

            <div className="flex items-center gap-1" title={`${project.views} views`}>
              <Eye className="w-3.5 h-3.5" />
              <span>{project.views > 999 ? `${(project.views / 1000).toFixed(1)}k` : project.views}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
            className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              isLight
                ? 'text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
            }`}
          >
            <span>View Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
