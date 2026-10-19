/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { LaunchForgeCinematicHero } from './components/LaunchForgeCinematicHero';
import { FeaturedProjects } from './components/FeaturedProjects';
import { ExploreDashboard } from './components/ExploreDashboard';
import { LaunchCtaSection } from './components/LaunchCtaSection';
import { HowItWorks } from './components/HowItWorks';
import { TrendingSection } from './components/TrendingSection';
import { CommunitySection } from './components/CommunitySection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { LaunchModal } from './components/LaunchModal';
import { SearchModal } from './components/SearchModal';
import { SignInModal } from './components/SignInModal';
import { SetupModal } from './components/SetupModal';
import { DemoGallery } from './components/DemoGallery';
import { DemoPreviewModal } from './components/DemoPreviewModal';
import { INITIAL_PROJECTS } from './data/mockProjects';
import { DemoItem } from './data/demoGallery';
import { Project, PlatformStats } from './types';
import { useAuth } from './lib/auth';
import { createProject, deleteProject, useProjects, useProjectLikes } from './lib/projects';
import confetti from 'canvas-confetti';

const THEME_KEY = 'launchforge_theme';

/** Format a raw view count into a compact label (e.g. 1,240 -> "1.2K"). */
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${n}`;
}

export default function App() {
  // Theme state (persisted – a UI preference, safe for localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore */
    }
    return 'dark';
  });

  // Auth (real Supabase session)
  const { user, profile, isConfigured, signOut } = useAuth();

  // Projects (real backend when configured, otherwise demo showcase)
  const {
    projects: dbProjects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  // Real launches when configured; the built-in showcase otherwise. With a
  // backend connected, genuine projects are listed FIRST and the clearly
  // badged sample catalogue is appended so examples stay browsable.
  const projects = useMemo<Project[]>(
    () => (isConfigured ? [...dbProjects, ...INITIAL_PROJECTS] : INITIAL_PROJECTS),
    [isConfigured, dbProjects]
  );

  // Platform statistics derive from real database rows only — showcase sample
  // figures never inflate them (in demo mode the showcase IS the data).
  const statSource = isConfigured ? dbProjects : INITIAL_PROJECTS;

  // Likes (persisted per user when configured)
  const { likedIds, toggleLike } = useProjectLikes(user?.id);

  // Modals & Navigation state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [notice, setNotice] = useState<string | null>(null);
  // In-app sandboxed demo preview (gallery cards + project "Live Preview").
  const [demoPreview, setDemoPreview] = useState<{
    src: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  // Persist theme preference
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#05070f]', 'text-slate-100');
      document.body.classList.add('bg-[#f8fafc]', 'text-slate-900');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('bg-[#05070f]', 'text-slate-100');
      document.body.classList.remove('bg-[#f8fafc]', 'text-slate-900');
    }
  }, [theme]);

  // Auto-dismiss transient notices
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  // Global keyboard shortcuts. A single listener owns Cmd/Ctrl+K (toggle
  // search) and Escape (close top-most modal). Because the toggle requires a
  // modifier key, it never fires while simply typing in a field.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape') {
        // Close whichever modal is open, top-most first.
        if (isSearchModalOpen) setIsSearchModalOpen(false);
        else if (isSignInModalOpen) setIsSignInModalOpen(false);
        else if (isLaunchModalOpen) setIsLaunchModalOpen(false);
        else if (isSetupModalOpen) setIsSetupModalOpen(false);
        else if (demoPreview) setDemoPreview(null);
        else if (selectedProject) setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, isSignInModalOpen, isLaunchModalOpen, isSetupModalOpen, demoPreview, selectedProject]);

  // Derived platform statistics – computed from real data, never fabricated.
  const stats = useMemo<PlatformStats>(() => {
    const creators = new Set<string>();
    const categories = new Set<string>();
    let views = 0;
    for (const p of statSource) {
      creators.add(p.creator.handle || p.creator.name);
      if (p.category && p.category !== 'All') categories.add(p.category);
      views += p.views || 0;
    }
    return {
      projectsLaunched: statSource.length,
      creatorsCount: creators.size,
      monthlyViews: formatCount(views),
      activeCategories: categories.size,
    };
  }, [statSource]);

  /** Require an authenticated user before performing an action. */
  const requireAuth = useCallback((): boolean => {
    if (!isConfigured) {
      // No backend configured: open the actionable setup guide instead of a
      // dead-end message (the action still performs its real job once the
      // four setup steps in the modal are completed).
      setIsSetupModalOpen(true);
      return false;
    }
    if (!user) {
      setIsSignInModalOpen(true);
      return false;
    }
    return true;
  }, [isConfigured, user]);

  // Local mirror of the projects list so optimistic likes/launches show up
  // immediately. When configured it starts from the DB rows.
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const visibleProjects = localProjects;

  // Handle Like Toggle
  const handleToggleLike = useCallback(
    async (projectId: string) => {
      if (!requireAuth()) return;
      // Sample entries have no database row — upvoting them would only produce
      // a constraint error, so explain instead of failing silently/ugly.
      if (localProjects.find((p) => p.id === projectId)?.isSample) {
        setNotice('Sample projects are browse-only — upvote a real launch instead.');
        return;
      }
      const wasLiked = likedIds.has(projectId);
      try {
        await toggleLike(projectId);
        setLocalProjects((list) =>
          list.map((p) =>
            p.id === projectId ? { ...p, likes: Math.max(0, p.likes + (wasLiked ? -1 : 1)) } : p
          )
        );
        setSelectedProject((curr) =>
          curr && curr.id === projectId
            ? { ...curr, likes: Math.max(0, curr.likes + (wasLiked ? -1 : 1)) }
            : curr
        );
      } catch (e) {
        setNotice(e instanceof Error ? e.message : 'Could not update upvote.');
      }
    },
    [requireAuth, likedIds, toggleLike, localProjects]
  );

  // Handle Project Launch (real, persisted)
  const handleLaunchProject = useCallback(
    async (draft: Omit<Project, 'id' | 'likes' | 'views' | 'creator' | 'launchedAt'>) => {
      if (!requireAuth() || !user || !profile) {
        throw new Error('You must be signed in to publish a project.');
      }
      try {
        const created = await createProject(
          {
            name: draft.name,
            tagline: draft.tagline,
            description: draft.description,
            category: draft.category,
            tags: draft.tags,
            image: draft.image,
            demoUrl: draft.demoUrl,
            githubUrl: draft.githubUrl,
            techStack: draft.techStack,
          },
          user.id
        );
        // Attach the live profile so the card renders immediately.
        const withCreator: Project = {
          ...created,
          creator: {
            name: profile.displayName,
            avatar: profile.avatarUrl,
            role: profile.role,
            handle: profile.handle,
          },
        };
        setLocalProjects((prev) => [withCreator, ...prev]);
        setSelectedProject(withCreator);
        confetti({ particleCount: 90, spread: 100, origin: { y: 0.6 }, colors: ['#06b6d4', '#8b5cf6', '#10b981'] });
      } catch (e) {
        throw e instanceof Error ? e : new Error('Failed to publish project.');
      }
    },
    [requireAuth, user, profile]
  );

  // Handle Project Delete (owner only, enforced again by RLS)
  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      if (!requireAuth()) return;
      try {
        await deleteProject(projectId);
        setLocalProjects((prev) => prev.filter((p) => p.id !== projectId));
        setSelectedProject(null);
        setNotice('Project deleted.');
      } catch (e) {
        setNotice(e instanceof Error ? e.message : 'Failed to delete project.');
      }
    },
    [requireAuth]
  );

  // Smooth scroll to section
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero' || sectionId === 'cinema') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'footer') {
      const elem = document.getElementById('footer');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Opening the launch flow requires an account.
  const handleOpenLaunch = () => {
    if (!requireAuth()) return;
    setIsLaunchModalOpen(true);
  };

  const currentUser = user && profile
    ? {
        name: profile.displayName,
        email: profile.email ?? user.email ?? '',
        avatar: profile.avatarUrl,
        handle: profile.handle,
        id: user.id,
      }
    : null;

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f8fafc] text-slate-900 light' : 'bg-[#05070f] text-slate-100 dark'} selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-300 relative`}>
      
      {/* Global Atmospheric Deep Space & Tech Canvas Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            theme === 'light' ? 'opacity-5 mix-blend-multiply' : 'opacity-20 mix-blend-screen'
          }`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-300 ${
          theme === 'light' ? 'from-slate-50/90 via-transparent to-slate-50/90' : 'from-[#05070f] via-transparent to-[#05070f] opacity-90'
        }`} />
        <div className={`absolute inset-0 transition-colors duration-300 ${
          theme === 'light' ? 'bg-slate-50/80' : 'bg-[#05070f]/75'
        }`} />
      </div>

      {/* Demo-mode / status banner — now actionable */}
      {!isConfigured && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs backdrop-blur-md shadow-lg max-w-[92vw] text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>
            Demo mode — showing sample projects. Connect Supabase for real accounts,
            projects, and upvotes.
          </span>
          <button
            onClick={() => setIsSetupModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/50 text-amber-100 font-semibold transition-colors"
          >
            Connect Supabase
          </button>
        </div>
      )}

      {/* Transient notice / error toast */}
      {notice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-slate-100 text-xs backdrop-blur-md shadow-2xl max-w-[92vw] text-center">
          {notice}
        </div>
      )}

      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenLaunch={handleOpenLaunch}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        user={currentUser}
        onSignOut={() => void signOut()}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Page Sections */}
      <main className="relative z-10">
        {/* 1. Cinematic Hero Experience */}
        <LaunchForgeCinematicHero
          onOpenLaunch={handleOpenLaunch}
          onExploreClick={() => handleNavigate('explore')}
          onSelectProject={(p) => setSelectedProject(p)}
          projects={visibleProjects}
          theme={theme}
        />

        {/* 2. Featured Projects Showcase */}
        <FeaturedProjects
          projects={visibleProjects}
          onSelectProject={(p) => setSelectedProject(p)}
          onToggleLike={(id) => void handleToggleLike(id)}
          likedProjectIds={likedIds}
          onExploreAll={() => handleNavigate('explore')}
          theme={theme}
        />

        {/* 3. Explore Projects Discovery Dashboard */}
        <ExploreDashboard
          projects={visibleProjects}
          onSelectProject={(p) => setSelectedProject(p)}
          onToggleLike={(id) => void handleToggleLike(id)}
          likedProjectIds={likedIds}
          theme={theme}
        />

        {/* 4. Interactive Demo Gallery (local, sandboxed previews) */}
        <DemoGallery
          onPreview={(demo: DemoItem) =>
            setDemoPreview({
              src: demo.src,
              title: demo.name,
              subtitle: `${demo.category} demo`,
            })
          }
          theme={theme}
        />

        {/* 5. Launch Your Project CTA & Statistics */}
        <LaunchCtaSection
          stats={stats}
          onOpenLaunch={handleOpenLaunch}
          theme={theme}
        />

        {/* 6. How It Works Pipeline */}
        <HowItWorks theme={theme} />

        {/* 7. Trending Velocity Marquee */}
        <TrendingSection
          projects={visibleProjects}
          onSelectProject={(p) => setSelectedProject(p)}
          theme={theme}
        />

        {/* 8. Community Testimonials */}
        <CommunitySection theme={theme} />

        {/* 9. Final CTA */}
        <FinalCta
          onOpenLaunch={handleOpenLaunch}
          onExploreClick={() => handleNavigate('explore')}
          theme={theme}
        />
      </main>

      {/* 9. High-end Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLaunch={handleOpenLaunch}
        theme={theme}
      />

      {/* Loading / error state for connected backend */}
      {isConfigured && projectsLoading && (
        <div className="fixed bottom-6 right-6 z-40 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-300">
          Loading projects…
        </div>
      )}
      {isConfigured && projectsError && (
        <div className="fixed bottom-6 right-6 z-40 px-3 py-2 rounded-lg bg-red-900/90 border border-red-600 text-xs text-red-100 max-w-xs">
          {projectsError}
        </div>
      )}

      {/* Interactive Modals */}
      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isLiked={likedIds.has(selectedProject.id)}
          onToggleLike={(id) => void handleToggleLike(id)}
          currentUser={currentUser}
          onRequireAuth={() => {
            if (!requireAuth()) return false;
            return true;
          }}
          onDelete={(id) => void handleDeleteProject(id)}
          onOpenDemoPreview={(src, title) =>
            setDemoPreview({ src, title, subtitle: 'Sample project demo' })
          }
          theme={theme}
        />
      )}

      {/* Launch Your Project Form Modal */}
      <LaunchModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        onLaunchProject={handleLaunchProject}
        profile={profile}
        theme={theme}
      />

      {/* Search / Command Palette Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        projects={visibleProjects}
        onSelectProject={(p) => setSelectedProject(p)}
        theme={theme}
      />

      {/* Sign In / Auth Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        theme={theme}
      />

      {/* Backend Setup Guide (shown when Supabase is not configured) */}
      <SetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        theme={theme}
      />

      {/* Interactive Demo Preview (sandboxed, stays inside LaunchForge) */}
      <DemoPreviewModal
        src={demoPreview?.src ?? null}
        title={demoPreview?.title ?? ''}
        subtitle={demoPreview?.subtitle}
        onClose={() => setDemoPreview(null)}
        theme={theme}
      />
    </div>
  );
}
