import React, { useState } from 'react';
import { Flame, Github, Twitter, Linkedin, Disc as Discord, ArrowRight, Check, ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLaunch: () => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenLaunch,
  theme = 'dark',
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isLight = theme === 'light';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="footer" 
      className={`relative z-20 border-t text-xs transition-colors duration-300 ${
        isLight
          ? 'bg-slate-100 border-slate-200 text-slate-600'
          : 'bg-[#030611] border-slate-800 text-slate-400'
      }`}
    >
      {/* Top radiant glow line to ensure footer is prominently visible */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2.5 cursor-pointer inline-flex"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px]">
                <div className={`w-full h-full rounded-xl flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                  <Flame className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                </div>
              </div>
              <span className={`text-lg font-extrabold font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Launch<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Forge</span>
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              The premier innovation network for launching, discovering, and accelerating breakthrough technologies, digital products, and open-source stacks.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className={`font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                Weekly Innovation Digest
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! You'll receive the top launches every Sunday.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 px-3.5 py-2 rounded-xl text-xs focus:outline-none transition-colors ${
                      isLight
                        ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500'
                        : 'bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('featured')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Featured Launches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Explore Grid
                </button>
              </li>
              <li>
                <button onClick={onOpenLaunch} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Submit Project
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trending')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Trending Velocity
                </button>
              </li>
              <li>
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                  Forge CLI <span className={`text-[10px] px-1.5 py-0.2 rounded ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-cyan-400'}`}>v2.4</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Launch Checklist</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Documentation</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">API & Webhooks</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Brand Assets</button></li>
            </ul>
          </div>

          {/* Column 3: Community & Social */}
          <div className="space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Creator Stories
                </button>
              </li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Twitter className="w-3.5 h-3.5" /> X / Twitter</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Discord className="w-3.5 h-3.5" /> Discord</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'border-slate-200' : 'border-slate-900'
        }`}>
          <div className={`flex items-center gap-4 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <span>© {new Date().getFullYear()} LaunchForge Inc. All rights reserved.</span>
            <span>•</span>
            <a href="#privacy" className={isLight ? 'hover:text-slate-800' : 'hover:text-slate-300'}>Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className={isLight ? 'hover:text-slate-800' : 'hover:text-slate-300'}>Terms of Service</a>
          </div>

          {/* System Status & Back to Top */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>

            <button
              onClick={handleScrollTop}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-500/50'
              }`}
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-cyan-500" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
