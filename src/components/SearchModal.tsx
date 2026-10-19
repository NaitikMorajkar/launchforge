import React, { useState } from 'react';
import { Project } from '../types';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  theme?: 'dark' | 'light';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  theme = 'dark',
}) => {
  const [query, setQuery] = useState('');
  const isLight = theme === 'light';

  // Keyboard handling (Cmd/Ctrl+K to toggle, Escape to close) is owned by a
  // single global listener in App.tsx to avoid duplicate/competing handlers.

  if (!isOpen) return null;

  const filtered = projects.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.creator.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700/80 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <Search className="w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects by name, tags, creators, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full bg-transparent text-sm focus:outline-none ${
              isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 rounded ${isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${
            isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {filtered.length > 0 ? (
            filtered.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                  isLight
                    ? 'hover:bg-slate-50 border-transparent hover:border-cyan-500/30'
                    : 'hover:bg-slate-800/80 border-transparent hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-950 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold transition-colors ${
                        isLight ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-300'
                      }`}>
                        {proj.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-cyan-300 border-slate-700'
                      }`}>
                        {proj.category}
                      </span>
                    </div>
                    <p className={`text-xs line-clamp-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{proj.tagline}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 transition-colors ${
                  isLight ? 'text-slate-400 group-hover:text-cyan-600' : 'text-slate-500 group-hover:text-cyan-400'
                }`}>
                  <span className="text-xs font-semibold">{proj.likes} Upvotes</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Sparkles className="w-6 h-6 mx-auto text-slate-600 mb-2" />
              No matching projects found for "{query}". Try another keyword or category.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className={`p-3 border-t text-[11px] flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-800 bg-slate-950/40 text-slate-500'
        }`}>
          <span>Search in LaunchForge Innovation Network</span>
          <span>{filtered.length} projects found</span>
        </div>
      </div>
    </div>
  );
};
