import React, { useEffect, useMemo, useRef } from 'react';
import { Rocket, Plus, Sparkles } from 'lucide-react';
import { Project } from '../types';

// Asset constants matching the physical depth planes with dark cyber aesthetic treatment
const ASSETS = {
  sky: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop',
  backFour: 'https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png',
  bazaar: 'https://raft-blast-61784561.figma.site/_assets/v11/864afe00e41e2fa20a5aa546e15cb807e0f81384.png',
  splitLeft: 'https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png',
  splitRight: 'https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png',
  bridge: 'https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png',
  frameTwo: 'https://raft-blast-61784561.figma.site/_assets/v11/ba75252bab2b1c510987b74837770f7bc8a6b2d4.png',
  icons: {
    icon1: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230438_d526b8b6-8a2e-4e3b-9993-3908acae03a7.png',
    icon2: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230442_140bc25b-b165-4249-904a-f708bff6970e.png',
    icon3: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230448_825949c9-ccdb-4857-b4a6-e349eccc9010.png',
  },
};

interface LaunchForgeCinematicHeroProps {
  onOpenLaunch: () => void;
  onExploreClick: () => void;
  onSelectProject: (project: Project) => void;
  projects: Project[];
  theme?: 'dark' | 'light';
}

export const LaunchForgeCinematicHero: React.FC<LaunchForgeCinematicHeroProps> = ({
  onOpenLaunch,
  onExploreClick,
  onSelectProject,
  projects,
  theme = 'dark',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Keep the latest callback in a ref so the long-running effect below does
  // not re-run (and re-clone the slider DOM) every time the parent re-renders.
  const onSelectProjectRef = useRef(onSelectProject);
  onSelectProjectRef.current = onSelectProject;

  // Top 5 showcase projects (memoised for a stable effect dependency).
  const showcaseProjects = useMemo(() => projects.slice(0, 5), [projects]);

  // Derived, real platform figures (never fabricated).
  const projectCount = projects.length;
  const creatorCount = useMemo(
    () => new Set(projects.map((p) => p.creator.handle || p.creator.name)).size,
    [projects]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const sightsControls = controlsRef.current;
    if (!section || !track || !sightsControls) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Math helpers (verbatim Mostar animation engine)
    const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
    const smoothstep = (e0: number, e1: number, v: number) => {
      const x = clamp((v - e0) / (e1 - e0));
      return x * x * (3 - 2 * x);
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
      const enter = smoothstep(a, b, s);
      const exit = smoothstep(c, d, s);
      return { enter, exit, active: enter * (1 - exit) };
    };
    const getScrollDistance = () =>
      clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);

    // Initial state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScroll = 0;
    let smoothScroll = 0;
    let initialized = false;
    let rafPending = false;

    // Infinite Slider state
    const originalCards = Array.from(track.children) as HTMLElement[];
    const originalCount = originalCards.length;
    if (originalCount === 0) return;

    // Clone before & after for infinite loop
    const prependedClones = originalCards.map((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });
    const appendedClones = originalCards.map((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    prependedClones.reverse().forEach((c) => track.prepend(c));
    appendedClones.forEach((c) => track.append(c));

    let sightIndex = 0;
    let cardStep = 0;
    let isJumping = false;

    const getTrackCards = () => Array.from(track.children) as HTMLElement[];

    const updateCardStep = () => {
      const cards = getTrackCards();
      if (cards.length > 1) {
        const r0 = cards[0].getBoundingClientRect();
        const r1 = cards[1].getBoundingClientRect();
        cardStep = r1.left - r0.left;
      }
    };

    const updateActiveSightCard = () => {
      const cards = getTrackCards();
      const activeNormalizedIndex = ((sightIndex % originalCount) + originalCount) % originalCount;
      cards.forEach((c) => c.classList.remove('is-active'));
      const activeCard = cards[originalCount + activeNormalizedIndex];
      if (activeCard) activeCard.classList.add('is-active');
    };

    const applySightSliderTransform = () => {
      if (!cardStep) updateCardStep();
      const currentShift = -(originalCount + sightIndex) * cardStep;
      section.style.setProperty('--sights-shift', `${currentShift}px`);
      updateActiveSightCard();
    };

    const normalizeSightSlider = () => {
      if (sightIndex >= originalCount || sightIndex < 0) {
        isJumping = true;
        track.classList.add('is-jumping');
        sightIndex = ((sightIndex % originalCount) + originalCount) % originalCount;
        applySightSliderTransform();
        void track.offsetHeight;
        track.classList.remove('is-jumping');
        isJumping = false;
      }
    };

    const handlePrev = (e?: Event) => {
      e?.preventDefault();
      if (isJumping) return;
      sightIndex -= 1;
      applySightSliderTransform();
    };

    const handleNext = (e?: Event) => {
      e?.preventDefault();
      if (isJumping) return;
      sightIndex += 1;
      applySightSliderTransform();
    };

    const prevBtn = sightsControls.querySelector('.sight-prev');
    const nextBtn = sightsControls.querySelector('.sight-next');
    prevBtn?.addEventListener('click', handlePrev);
    nextBtn?.addEventListener('click', handleNext);
    track.addEventListener('transitionend', normalizeSightSlider);

    // Click delegation for cards
    const handleCardClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.sight-card') as HTMLElement;
      if (!card) return;
      const indexAttr = card.getAttribute('data-project-index');
      if (indexAttr !== null) {
        const idx = parseInt(indexAttr, 10);
        if (showcaseProjects[idx]) {
          onSelectProjectRef.current(showcaseProjects[idx]);
        }
      }
    };
    track.addEventListener('click', handleCardClick);

    // Initial setup
    updateCardStep();
    applySightSliderTransform();

    // Responsive sizing
    const setResponsiveVars = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isMobile = vw <= 640;
      const isTablet = vw <= 1100 && !isMobile;

      const titleStart = isMobile ? vh * 0.16 : isTablet ? vh * 0.15 : clamp(vh * 0.19, 122, 205);
      const sightsTop = isMobile
        ? Math.round(vh * 0.14)
        : isTablet
        ? Math.round(vh * 0.16)
        : Math.round(clamp(vh * 0.19, 112, 220));

      section.style.setProperty('--title-start-y', `${Math.round(titleStart)}px`);
      section.style.setProperty('--sights-top', `${sightsTop}px`);
      section.style.setProperty('--sights-screen-top', `${sightsTop}px`);
      updateCardStep();
      applySightSliderTransform();
    };

    setResponsiveVars();

    // Render frame
    const render = () => {
      rafPending = false;
      const s = smoothScroll;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 640;
      const isTablet = vw <= 1100 && !isMobile;

      // Pure Vertical Parallax lerp (strictly vertical up-down motion)
      mouseX = 0;
      mouseY = lerp(mouseY, targetMouseY, 0.08);

      // Section 1: Intro Copy (0 -> 450)
      const introExit = smoothstep(50, 450, s);
      const introY = lerp(0, -180, introExit);
      const introOpacity = 1 - introExit;

      // Section 1: Hero Title (0 -> 800)
      const titleProgress = smoothstep(0, 750, s);
      const titleY = lerp(0, isMobile ? -140 : -260, titleProgress);
      const titleScale = lerp(1, isMobile ? 0.65 : 0.48, titleProgress);
      const titleOpacity = 1 - smoothstep(550, 850, s);

      // Section 2: Splitframe Top & Bottom Aperture (300 -> 1400)
      // Strictly up-down vertical motion - NO horizontal left-right motion
      const splitProgress = smoothstep(250, 1400, s);
      const splitDistance = isMobile ? 140 : 220;
      const splitLeftX = -50;
      const splitRightX = -50;
      const splitLeftY = -splitProgress * splitDistance;
      const splitRightY = splitProgress * splitDistance;
      const splitScale = lerp(1, 1.15, splitProgress);
      const splitOpacity = 1 - smoothstep(1050, 1550, s);

      // Section 2: Bridge/Gateway Expansion (400 -> 1800)
      // Pure vertical up-down motion
      const bridgeProgress = smoothstep(350, 1800, s);
      const bridgeScale = lerp(1.02, isMobile ? 2.6 : 3.4, bridgeProgress);
      const bridgeY = lerp(0, isMobile ? 120 : 220, bridgeProgress) + mouseY * 20;
      const bridgeX = -50;

      // Section 2: Frame 2 Matrix Fade In (700 -> 1700)
      const frame2Enter = smoothstep(700, 1300, s);
      const frame2Exit = smoothstep(1900, 2600, s);
      const frame2Opacity = frame2Enter * (1 - frame2Exit);
      const frame2Scale = lerp(1.06, 1.32, smoothstep(700, 2400, s));
      const frame2Y = lerp(-50, -45, smoothstep(700, 2400, s));

      // Section 3: Story Panel 2 (Stats / Platform Compass) (1300 -> 2200)
      const panel2 = segmentInOut(s, 1250, 1550, 1850, 2200);
      const panel2Y = lerp(40, -40, smoothstep(1250, 2200, s));

      // Section 4: Story Panel 3 ("Build in public. Ship with momentum." + "Launch a Project" CTA) (2100 -> 2900)
      const panel3 = segmentInOut(s, 2100, 2350, 2650, 2950);
      const panel3Y = lerp(40, -40, smoothstep(2100, 2950, s));

      // Section 5: Sights Track (2700 -> 3700)
      // Strictly vertical enter (glides up into place) - NO horizontal slide
      const sightsEnterProgress = smoothstep(2650, 3100, s);
      const sightsEnterY = lerp(isMobile ? 140 : 180, 0, sightsEnterProgress);
      const sightsControlsOpacity = smoothstep(2950, 3250, s);

      // Back Stack Depth - pure vertical parallax
      const backScale = lerp(0.76, 1.05, smoothstep(0, 3600, s));
      const backX = 0;
      const backY = lerp(0, -50, smoothstep(0, 3600, s)) + mouseY * 18;

      // Apply CSS variables to stage
      section.style.setProperty('--mx', '0');
      section.style.setProperty('--my', `${mouseY}`);
      section.style.setProperty('--intro-copy-y', `${introY}px`);
      section.style.setProperty('--intro-copy-opacity', `${introOpacity}`);
      section.style.setProperty('--title-y', `${titleY}px`);
      section.style.setProperty('--title-scale', `${titleScale}`);
      section.style.setProperty('--title-opacity', `${titleOpacity}`);
      section.style.setProperty('--split-left-x', `${splitLeftX}%`);
      section.style.setProperty('--split-right-x', `${splitRightX}%`);
      section.style.setProperty('--split-left-y', `${splitLeftY}px`);
      section.style.setProperty('--split-right-y', `${splitRightY}px`);
      section.style.setProperty('--split-left-scale', `${splitScale}`);
      section.style.setProperty('--split-right-scale', `${splitScale}`);
      section.style.setProperty('--split-opacity', `${splitOpacity}`);
      section.style.setProperty('--bridge-x', `${bridgeX}%`);
      section.style.setProperty('--bridge-y', `${bridgeY}px`);
      section.style.setProperty('--bridge-scale', `${bridgeScale}`);
      section.style.setProperty('--frame2-opacity', `${frame2Opacity}`);
      section.style.setProperty('--frame2-scale', `${frame2Scale}`);
      section.style.setProperty('--frame2-y', `${frame2Y}%`);
      section.style.setProperty('--panel2-opacity', `${panel2.active}`);
      section.style.setProperty('--panel2-y', `calc(-50% + ${panel2Y}px)`);
      section.style.setProperty('--panel3-opacity', `${panel3.active}`);
      section.style.setProperty('--panel3-y', `calc(-50% + ${panel3Y}px)`);
      section.style.setProperty('--sights-enter-x', '0px');
      section.style.setProperty('--sights-y', `${sightsEnterY}px`);
      section.style.setProperty('--sights-opacity', `${sightsEnterProgress}`);
      section.style.setProperty('--sights-visibility', s > 2500 ? 'visible' : 'hidden');
      section.style.setProperty('--sights-controls-opacity', `${sightsControlsOpacity}`);
      section.style.setProperty('--back-scale', `${backScale}`);
      section.style.setProperty('--back-x', `${backX}px`);
      section.style.setProperty('--back-y', `${backY}px`);

      if (sightsControlsOpacity > 0.4) {
        sightsControls.classList.add('is-ready');
      } else {
        sightsControls.classList.remove('is-ready');
      }
    };

    // Animation Loop
    const tick = () => {
      targetScroll = getScrollDistance();
      if (!initialized) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, reduceMotion.matches ? 1 : 0.14);
      }

      render();

      const scrollDelta = Math.abs(smoothScroll - targetScroll);
      const mouseDelta = Math.abs(mouseY - targetMouseY);

      if (scrollDelta > 0.2 || mouseDelta > 0.001) {
        requestAnimationFrame(tick);
        rafPending = true;
      } else {
        rafPending = false;
      }
    };

    const requestTick = () => {
      if (!rafPending) {
        requestAnimationFrame(tick);
        rafPending = true;
      }
    };

    const handleScroll = () => {
      requestTick();
    };

    const handleResize = () => {
      setResponsiveVars();
      requestTick();
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = 0;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      requestTick();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    requestTick();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      prevBtn?.removeEventListener('click', handlePrev);
      nextBtn?.removeEventListener('click', handleNext);
      track.removeEventListener('transitionend', normalizeSightSlider);
      track.removeEventListener('click', handleCardClick);
      // Remove the cloned slider nodes this effect created so re-running the
      // effect (or StrictMode's double-invoke) never accumulates duplicates.
      track
        .querySelectorAll('.sight-card[aria-hidden="true"]')
        .forEach((node) => node.remove());
    };
  }, [showcaseProjects]);

  return (
    <section className="cinema-scroll" id="cinema" ref={sectionRef} aria-label="LaunchForge cinematic experience">
      <div className="stage">
        <div className="world">
          {/* Sky / Deep Cosmic Starfield Plane */}
          <img
            className="scene-img sky-img"
            src={ASSETS.sky}
            referrerPolicy="no-referrer"
            alt=""
          />

          {/* Sub-Header inside Stage: Live Telemetry & Navigation */}
          <header className="site-header" aria-label="LaunchForge Navigation">
            <div className="site-logo">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span>LaunchForge</span>
            </div>
            <nav className="site-nav" aria-label="Stage menu">
              <a href="#featured">Featured</a>
              <a href="#explore">Discover</a>
              <a href="#how-it-works">Pipeline</a>
              <a href="#community">Community</a>
            </nav>
            <button
              className="language-switcher"
              onClick={onOpenLaunch}
              aria-label="Launch a Project"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch</span>
            </button>
          </header>

          {/* Back Stack: Depth City Horizon & Interactive Slider Track */}
          <div className="back-stack">
            <img className="scene-img back-img back-four" src={ASSETS.backFour} alt="" />
            
            <section className="sights-slider" aria-label="Flagship projects showcase">
              <div className="sights-track" ref={trackRef}>
                {showcaseProjects.map((project, idx) => (
                  <article
                    key={project.id}
                    className="sight-card"
                    tabIndex={0}
                    role="button"
                    data-project-index={idx}
                    aria-label={`View ${project.name}`}
                  >
                    <span className="sight-kicker">
                      {project.category}
                      {project.isSample ? ' · Sample' : ''}
                    </span>
                    <img
                      className="sight-pin"
                      src={idx % 2 === 0 ? ASSETS.icons.icon1 : ASSETS.icons.icon2}
                      alt=""
                    />
                    <h3>{project.name}</h3>
                    <p>{project.tagline}</p>
                  </article>
                ))}
              </div>
            </section>

            <img
              className="scene-img back-img back-bazaar"
              src={ASSETS.bazaar}
              referrerPolicy="no-referrer"
              alt=""
            />
          </div>

          {/* Slider Controls (Arrow Buttons) */}
          <div className="sights-controls" ref={controlsRef} aria-label="Showcase slider navigation">
            <button className="sight-nav sight-prev" aria-label="Previous project">
              ←
            </button>
            <button className="sight-nav sight-next" aria-label="Next project">
              →
            </button>
          </div>

          {/* Giant Hero Cinematic Title: LAUNCHFORGE */}
          <h1 className="hero-title">LAUNCHFORGE</h1>

          {/* Splitframe Left & Right Physical Depth Structures */}
          <img
            className="scene-img splitframe-img splitframe-left"
            src={ASSETS.splitLeft}
            referrerPolicy="no-referrer"
            alt=""
          />
          <img
            className="scene-img splitframe-img splitframe-right"
            src={ASSETS.splitRight}
            referrerPolicy="no-referrer"
            alt=""
          />

          {/* Central Portal / Bridge Gateway Expansion Plane */}
          <img
            className="scene-img bridge-img"
            src={ASSETS.bridge}
            referrerPolicy="no-referrer"
            alt=""
          />

          {/* Frame Two Matrix Chamber Depth Plane */}
          <img
            className="scene-img frame-two-img"
            src={ASSETS.frameTwo}
            referrerPolicy="no-referrer"
            alt=""
          />

          {/* Gradient Atmospheric Shade */}
          <div className="shade" />
        </div>

        {/* Intro Copy: LaunchForge Mission & Quick Actions */}
        <section className="intro-copy" aria-label="LaunchForge overview">
          <p>
            Where next-generation builders, developers, and founders launch breakthroughs.
            Discover pioneering AI, spatial computing, and open software before anyone else.
          </p>

          <div className="hero-tags" aria-label="Popular tags">
            <span>#GenerativeAI</span>
            <span>#Spatial3D</span>
            <span>#AutonomousTech</span>
            <span>#DevTools</span>
          </div>

          <div className="hero-actions">
            <button
              className="hero-btn-primary"
              onClick={onOpenLaunch}
              id="hero-launch-btn"
            >
              <Rocket className="w-4 h-4 text-cyan-200" />
              <span>Launch a Project</span>
            </button>
            <button
              className="hero-btn-secondary"
              onClick={onExploreClick}
              id="hero-explore-btn"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 mr-1.5 inline" />
              <span>Explore Breakthroughs ↓</span>
            </button>
          </div>
        </section>

        {/* Story Panel 2: Launchpad Platform Compass & Statistics */}
        <section
          className="story-panel story-panel-bridge"
          id="platform-stats"
          aria-label="Platform reach and impact"
        >
          <h2>The launchpad for world-class innovators.</h2>
          <p>
            From independent developers to frontier research labs, LaunchForge turns ambitious code
            into verified launches with global community traction.
          </p>
          <dl className="facts">
            <div>
              <dt>{projectCount.toLocaleString()}+</dt>
              <dd>Projects Showcased</dd>
            </div>
            <div>
              <dt>{creatorCount.toLocaleString()}+</dt>
              <dd>Builders & Founders</dd>
            </div>
          </dl>
        </section>

        {/* Story Panel 3: Build In Public & Launch a Project Action */}
        <section
          className="story-panel story-panel-bazaar"
          id="ship-momentum"
          aria-label="Launch and ship with momentum"
        >
          <h2>Build in public. Ship with momentum.</h2>
          <p>
            Collect high-signal feedback, connect with co-founders, track community velocity,
            and reach real users on launch day.
          </p>
          <button
            className="note-button"
            onClick={onOpenLaunch}
            id="panel-launch-btn"
            aria-label="Launch a Project"
          >
            <Plus className="w-5 h-5 text-cyan-200" />
            <span>Launch a Project</span>
          </button>
        </section>

        {/* Bottom smooth fade transition into next section */}
        <div className={`absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent pointer-events-none z-30 ${
          theme === 'light' ? 'to-[#f8fafc]' : 'to-[#05070f]'
        }`} />
      </div>
    </section>
  );
};
