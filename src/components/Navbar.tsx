import React, { useState, useEffect } from 'react';
import { 
  Flame, Search, Moon, Sun, Menu, X, Plus, User, 
  Sparkles, Compass, Layers, HelpCircle, Users, ExternalLink 
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenLaunch: () => void;
  onOpenSignIn: () => void;
  user: { name: string; email: string; avatar: string } | null;
  onSignOut: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenLaunch,
  onOpenSignIn,
  user,
  onSignOut,
  theme,
  onToggleTheme,
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = theme === 'light';

  const navLinks = [
    { label: 'Home', id: 'cinema' },
    { label: 'Featured', id: 'featured' },
    { label: 'Explore', id: 'explore' },
    { label: 'Demos', id: 'demos' },
    { label: 'Pipeline', id: 'how-it-works' },
    { label: 'Trending', id: 'trending' },
    { label: 'Community', id: 'community' },
    { label: 'Footer', id: 'footer' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isLight
            ? 'py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-sm shadow-slate-900/5'
            : 'py-3 bg-[#05070f]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
            <div className={`w-full h-full rounded-xl flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
              <Flame className="w-5 h-5 text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-extrabold tracking-tight font-heading flex items-center gap-1 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Launch<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Forge</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className={`hidden lg:flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-md ${
          isLight ? 'bg-slate-100/80 border border-slate-200/80' : 'bg-slate-900/60 border border-white/10'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSection === link.id
                  ? isLight
                    ? 'text-cyan-700 bg-cyan-50 border border-cyan-300 shadow-sm'
                    : 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button with Cmd+K hint */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors shadow-sm ${
              isLight
                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300'
            }`}
            title="Search projects (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="hidden md:inline">Search</span>
            <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Auth State / Sign In Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-cyan-500/30'
                }`}
                title={`Signed in as ${user.name}`}
              >
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                <span className={`text-xs font-semibold hidden sm:inline max-w-[100px] truncate ${
                  isLight ? 'text-slate-800' : 'text-white'
                }`}>{user.name}</span>
              </div>
              <button
                onClick={onSignOut}
                className={`text-[11px] px-2 py-1 rounded transition-colors ${
                  isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isLight
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Launch Project CTA */}
          <button
            onClick={onOpenLaunch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.3)] hover:shadow-[0_0_24px_rgba(6,182,212,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Launch Project</span>
            <span className="sm:hidden">Launch</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border lg:hidden ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-4 pt-3 pb-6 border-b backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200 ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-[#05070f]/95 border-white/10'
        }`}>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? isLight
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-300'
                      : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}

            {!user && (
              <button
                onClick={() => {
                  onOpenSignIn();
                  setMobileMenuOpen(false);
                }}
                className={`mt-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sign In / Join</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
