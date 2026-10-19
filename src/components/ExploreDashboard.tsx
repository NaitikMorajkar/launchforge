import React, { useState, useMemo } from 'react';
import { CategoryType, Project, SortFilterType } from '../types';
import { ProjectCard } from './ProjectCard';
import { 
  Search, SlidersHorizontal, Flame, Clock, ThumbsUp, 
  Sparkles, Filter, X, LayoutGrid, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';

interface ExploreDashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onToggleLike: (id: string) => void;
  likedProjectIds: Set<string>;
  theme?: 'dark' | 'light';
}

const CATEGORIES: CategoryType[] = [
  'All',
  'AI',
  'Web Development',
  'Mobile',
  'Robotics',
  'FinTech',
  'Gaming',
  'Education',
  'Open Source',
  'Design',
  'Other',
];

const SORT_OPTIONS: { label: SortFilterType; icon: React.ReactNode }[] = [
  { label: 'Trending', icon: <Flame className="w-3.5 h-3.5" /> },
  { label: 'Recently Launched', icon: <Clock className="w-3.5 h-3.5" /> },
  { label: 'Most Popular', icon: <ThumbsUp className="w-3.5 h-3.5" /> },
  { label: 'Featured', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export const ExploreDashboard: React.FC<ExploreDashboardProps> = ({
  projects,
  onSelectProject,
  onToggleLike,
  likedProjectIds,
  theme = 'dark',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<SortFilterType>('Trending');
  const [viewMode, setViewMode] = useState<'grid' | 'showcase'>('grid');
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  const isLight = theme === 'light';

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Category filter
        const matchCategory =
          selectedCategory === 'All' || project.category === selectedCategory;

        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          project.name.toLowerCase().includes(q) ||
          project.tagline.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          project.creator.name.toLowerCase().includes(q) ||
          project.tags.some((t) => t.toLowerCase().includes(q));

        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (activeSort === 'Trending') {
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || (b.likes + b.views * 0.1) - (a.likes + a.views * 0.1);
        }
        if (activeSort === 'Recently Launched') {
          return b.id.localeCompare(a.id);
        }
        if (activeSort === 'Most Popular') {
          return b.likes - a.likes;
        }
        if (activeSort === 'Featured') {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.likes - a.likes;
        }
        return 0;
      });
  }, [projects, selectedCategory, searchQuery, activeSort]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setActiveSort('Trending');
    setActiveShowcaseIdx(0);
  };

  const handlePrevShowcase = () => {
    setActiveShowcaseIdx((prev) => 
      prev <= 0 ? Math.max(0, filteredProjects.length - 1) : prev - 1
    );
  };

  const handleNextShowcase = () => {
    setActiveShowcaseIdx((prev) => 
      prev >= filteredProjects.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section id="explore" className="py-20 relative overflow-hidden">
      {/* Background Discovery Mesh Image & Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover mix-blend-screen ${isLight ? 'opacity-5' : 'opacity-10'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isLight ? 'from-slate-50 via-slate-100/50 to-slate-50' : 'from-[#05070f] via-slate-950/70 to-[#05070f]'
        }`} />
      </div>

      {/* Atmospheric Glowing Light Orbs (Exact same vibrant aura as Features) */}
      <div className="absolute top-1/4 -right-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -left-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 font-mono">
            <Filter className="w-3.5 h-3.5" />
            DISCOVERY ENGINE
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-heading ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Explore Groundbreaking Projects
          </h2>
          <p className={`text-sm sm:text-base mt-2 ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Filter through verified launches, support visionary builders, and uncover the future before it goes mainstream.
          </p>
        </div>

        {/* Discovery Control Toolbar */}
        <div className="space-y-4 mb-8">
          {/* Top Bar: Search, Sort, and View Mode Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search projects, technologies, or creators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveShowcaseIdx(0);
                }}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all focus:outline-none backdrop-blur-md ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 shadow-sm'
                    : 'bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-500 focus:border-cyan-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort Tabs */}
              <div className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
              }`}>
                {SORT_OPTIONS.map((sort) => (
                  <button
                    key={sort.label}
                    onClick={() => {
                      setActiveSort(sort.label);
                      setActiveShowcaseIdx(0);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeSort === sort.label
                        ? isLight
                          ? 'bg-cyan-50 text-cyan-700 border border-cyan-300 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {sort.icon}
                    <span>{sort.label}</span>
                  </button>
                ))}
              </div>

              {/* View Mode Toggle (Grid vs Cinematic Showcase Animation) */}
              <div className={`flex items-center p-1 rounded-xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View (3D Tilt & Staggered Animation)"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? isLight ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/20 text-cyan-300'
                      : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('showcase')}
                  title="Cinematic Showcase View (Feature Slider Animation)"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'showcase'
                      ? isLight ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/20 text-cyan-300'
                      : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs Scrollable Horizontal Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;

              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActiveShowcaseIdx(0);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isLight
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter State Bar */}
        <div className={`flex items-center justify-between text-xs mb-6 px-1 font-mono ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>
            Showing <strong className={`font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
            {selectedCategory !== 'All' && <span> in <strong className="text-cyan-600 dark:text-cyan-400 font-sans">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong className="text-cyan-600 dark:text-cyan-400 font-sans">{searchQuery}</strong>"</span>}
          </span>

          {(selectedCategory !== 'All' || searchQuery || activeSort !== 'Trending') && (
            <button
              onClick={resetFilters}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-sans flex items-center gap-1"
            >
              <span>Reset Filters</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode 1: Cinematic Showcase Carousel (Exact Same Slider Animation as Features) */}
        {viewMode === 'showcase' && filteredProjects.length > 0 && (
          <div className="relative mb-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CINEMATIC FEATURED SHOWCASE ({activeShowcaseIdx + 1}/{filteredProjects.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevShowcase}
                  className={`p-2 rounded-xl border transition-all ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm' 
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                  }`}
                  aria-label="Previous Project"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextShowcase}
                  className={`p-2 rounded-xl border transition-all ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm' 
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                  }`}
                  aria-label="Next Project"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Showcase Stage */}
            <div className="max-w-xl mx-auto">
              <div 
                key={filteredProjects[activeShowcaseIdx]?.id || 'showcase'}
                className="animate-fade-in-up"
              >
                <ProjectCard
                  project={filteredProjects[activeShowcaseIdx]}
                  onSelect={onSelectProject}
                  onToggleLike={onToggleLike}
                  isLiked={likedProjectIds.has(filteredProjects[activeShowcaseIdx]?.id)}
                  theme={theme}
                />
              </div>
            </div>

            {/* Quick Carousel Thumbnails Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {filteredProjects.slice(0, 10).map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveShowcaseIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeShowcaseIdx === idx
                      ? 'w-8 bg-cyan-500'
                      : isLight
                      ? 'w-2 bg-slate-300 hover:bg-slate-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Jump to project ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* View Mode 2: Project Cards Grid (With Staggered Upward Entrance & 3D Tilt Animations) */}
        {viewMode === 'grid' && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <div 
                key={`${project.id}-${selectedCategory}-${activeSort}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 70, 700)}ms` }}
              >
                <ProjectCard
                  project={project}
                  onSelect={onSelectProject}
                  onToggleLike={onToggleLike}
                  isLiked={likedProjectIds.has(project.id)}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className={`text-center py-16 px-4 rounded-2xl border border-dashed ${
            isLight ? 'bg-white/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <Sparkles className="w-8 h-8 text-cyan-500/50 mx-auto mb-3" />
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              No launches match this criteria
            </h3>
            <p className={`text-xs max-w-sm mx-auto mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Try adjusting your search terms, changing the category, or launch your own project in this space!
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
