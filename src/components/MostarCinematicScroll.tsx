import React, { useEffect, useRef } from 'react';

// Remote asset constants (the only allowed sources)
const ASSETS = {
  sky: 'https://raft-blast-61784561.figma.site/_assets/v11/16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png',
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

export const MostarCinematicScroll: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const sightsControls = controlsRef.current;
    if (!section || !track || !sightsControls) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Math helpers (verbatim)
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

    // Original cards selection before clone
    const originalCards = Array.from(track.querySelectorAll<HTMLElement>('.sight-card'));
    const originalSightCount = originalCards.length;
    let activeSight = originalSightCount;
    let sightCards: HTMLElement[] = [];

    // Infinite Slider Logic (verbatim exact)
    const updateSightSlider = () => {
      if (sightCards.length === 0) return;
      const cardWidth = sightCards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).columnGap || '0');
      const shiftPx = -(cardWidth + gap) * activeSight;
      document.documentElement.style.setProperty('--sights-shift', `${shiftPx}px`);

      sightCards.forEach((c, idx) => {
        c.classList.toggle('is-active', idx === activeSight);
      });
    };

    const jumpSightSlider = (i: number) => {
      track.classList.add('is-jumping');
      activeSight = i;
      updateSightSlider();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.classList.remove('is-jumping');
        });
      });
    };

    const normalizeSightSlider = () => {
      if (activeSight >= originalSightCount * 2) {
        jumpSightSlider(activeSight - originalSightCount);
      } else if (activeSight < originalSightCount) {
        jumpSightSlider(activeSight + originalSightCount);
      }
    };

    const selectSightCard = (card: HTMLElement) => {
      const idx = Number(card.dataset.sightIndex);
      if (Number.isFinite(idx)) {
        activeSight = idx;
        updateSightSlider();
      }
    };

    const moveSightSlider = (dir: number) => {
      activeSight += dir;
      updateSightSlider();
    };

    const setupSightSlider = () => {
      track.replaceChildren();
      for (let setIndex = 0; setIndex < 3; setIndex++) {
        originalCards.forEach((card: HTMLElement, cardIndex: number) => {
          const clone = card.cloneNode(true) as HTMLElement;
          clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex);

          clone.addEventListener('click', () => selectSightCard(clone));
          clone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectSightCard(clone);
            }
          });

          track.appendChild(clone);
        });
      }

      sightCards = Array.from(track.querySelectorAll<HTMLElement>('.sight-card'));
      activeSight = originalSightCount; // start in middle set

      track.addEventListener('transitionend', normalizeSightSlider);
      updateSightSlider();
    };

    // Animation frame update (verbatim exact math)
    const update = () => {
      rafPending = false;

      targetScroll = getScrollDistance();
      if (!initialized || reduceMotion.matches) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
      }
      if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

      mouseX = lerp(mouseX, targetMouseX, 0.12);
      mouseY = lerp(mouseY, targetMouseY, 0.12);

      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
      const progress = clamp(smoothScroll / 2700);
      const introExit = smoothstep(90, 650, smoothScroll);
      const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
      const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
      const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const panel2Opacity = frame2.active * (1 - frame2.exit);
      const panel3Opacity = frame3.active * (1 - frame3.exit);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;
      const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
      const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

      const root = document.documentElement;

      root.style.setProperty('--mx', (reduceMotion.matches ? 0 : mouseX).toFixed(4));
      root.style.setProperty('--my', (reduceMotion.matches ? 0 : mouseY).toFixed(4));

      root.style.setProperty('--back-opacity', (1 - frame2.active * 0.06).toFixed(4));
      root.style.setProperty('--back-x', `${(mouseX * -12).toFixed(2)}px`);
      root.style.setProperty('--back-y', `${(mouseY * -4).toFixed(2)}px`);
      root.style.setProperty('--back-scale', backScale.toFixed(4));
      root.style.setProperty('--four-y', `${(10 + progress * 10).toFixed(3)}vh`);
      root.style.setProperty('--four-scale', (0.78 + progress * 0.16).toFixed(4));
      root.style.setProperty('--bazaar-y', `${(20 - progress * 8).toFixed(3)}vh`);
      root.style.setProperty('--blur-px', `${(blurActive * 14).toFixed(2)}px`);
      root.style.setProperty('--back-brightness', (1 - blurActive * 0.255).toFixed(4));
      root.style.setProperty('--bazaar-blur-px', `${(frame2.active * 14).toFixed(2)}px`);
      root.style.setProperty(
        '--bazaar-brightness',
        (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4)
      );
      root.style.setProperty('--bazaar-saturation', (1 + frame3.active * 0.18).toFixed(4));
      root.style.setProperty('--shade-opacity', '1');
      root.style.setProperty('--shade-z', frame2.active > 0.02 ? '2' : '0');
      root.style.setProperty('--shade-top-alpha', (blurActive * 0.465).toFixed(4));
      root.style.setProperty('--shade-mid-alpha', (blurActive * 0.42).toFixed(4));
      root.style.setProperty('--shade-bottom-alpha', (blurActive * 0.51).toFixed(4));

      root.style.setProperty('--title-y', `${(introExit * -210).toFixed(2)}px`);
      root.style.setProperty('--title-scale', (1 - introExit * 0.08).toFixed(4));
      root.style.setProperty('--title-opacity', (1 - introExit).toFixed(4));

      root.style.setProperty('--bridge-x', `calc(-50% + ${(mouseX * 18).toFixed(2)}px)`);
      root.style.setProperty(
        '--bridge-y',
        `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(2)}px`
      );
      root.style.setProperty('--bridge-bottom', `${(5 - frame2.enter * 13).toFixed(3)}vh`);
      root.style.setProperty('--bridge-width', `${(67.2 + frame2.enter * 37.8).toFixed(3)}vw`);
      root.style.setProperty(
        '--bridge-scale',
        (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4)
      );

      root.style.setProperty(
        '--split-left-x',
        `calc(-50% + ${(-splitDrift * 46).toFixed(3)}vw + ${(mouseX * 22).toFixed(2)}px)`
      );
      root.style.setProperty(
        '--split-left-y',
        `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`
      );
      root.style.setProperty(
        '--split-left-scale',
        (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4)
      );

      root.style.setProperty(
        '--split-right-x',
        `calc(-50% + ${(splitDrift * 46).toFixed(3)}vw + ${(mouseX * 22).toFixed(2)}px)`
      );
      root.style.setProperty(
        '--split-right-y',
        `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`
      );
      root.style.setProperty(
        '--split-right-scale',
        (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4)
      );

      root.style.setProperty('--frame2-opacity', frame2Opacity.toFixed(4));
      root.style.setProperty('--frame2-x', `calc(-50% + ${(mouseX * 10).toFixed(2)}px)`);
      root.style.setProperty(
        '--frame2-y',
        `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(2)}px)`
      );
      root.style.setProperty(
        '--frame2-scale',
        (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4)
      );

      root.style.setProperty('--intro-copy-y', `${(introExit * 90).toFixed(2)}px`);
      root.style.setProperty('--intro-copy-opacity', (1 - introExit).toFixed(4));

      root.style.setProperty('--panel2-opacity', panel2Opacity.toFixed(4));
      root.style.setProperty(
        '--panel2-y',
        `calc(-50% + ${(-frame2.exit * 86 + (1 - frame2.enter) * 58).toFixed(2)}px)`
      );
      root.style.setProperty('--panel3-opacity', panel3Opacity.toFixed(4));
      root.style.setProperty(
        '--panel3-y',
        `calc(-50% + ${(-frame3.exit * 86 + (1 - frame3.enter) * 58).toFixed(2)}px)`
      );

      root.style.setProperty('--sights-opacity', sightsEnter.toFixed(4));
      root.style.setProperty('--sights-controls-opacity', sightsControlsEnter.toFixed(4));
      sightsControls.classList.toggle('is-ready', sightsControlsEnter > 0.98);
      root.style.setProperty('--sights-visibility', sightsEnter > 0.01 ? 'visible' : 'hidden');
      root.style.setProperty('--sights-y', '0px');
      root.style.setProperty('--sights-enter-x', `${((1 - sightsEnter) * 420).toFixed(2)}vw`);
      root.style.setProperty('--sights-scale', (1 / backScale).toFixed(4));
      root.style.setProperty('--sights-top', `${sightsParentTop.toFixed(2)}px`);
      root.style.setProperty('--sights-screen-top', `${sightsScreenTop.toFixed(2)}px`);

      if (
        Math.abs(smoothScroll - targetScroll) > 0.08 ||
        Math.abs(mouseX - targetMouseX) > 0.001 ||
        Math.abs(mouseY - targetMouseY) > 0.001
      ) {
        requestTick();
      }
    };

    const requestTick = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(update);
      }
    };

    const handleScroll = () => {
      requestTick();
    };

    const handleResize = () => {
      updateSightSlider();
      requestTick();
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    const prevBtn = sightsControls.querySelector<HTMLButtonElement>('.sight-prev');
    const nextBtn = sightsControls.querySelector<HTMLButtonElement>('.sight-next');

    const handlePrev = () => moveSightSlider(-1);
    const handleNext = () => moveSightSlider(1);

    prevBtn?.addEventListener('click', handlePrev);
    nextBtn?.addEventListener('click', handleNext);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Initial setup
    setupSightSlider();
    requestTick();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      prevBtn?.removeEventListener('click', handlePrev);
      nextBtn?.removeEventListener('click', handleNext);
      track.removeEventListener('transitionend', normalizeSightSlider);
    };
  }, []);

  return (
    <section className="cinema-scroll" id="cinema" aria-label="Mostar cinematic scroll story">
      <div className="stage">
        <div className="world">
          <img
            className="scene-img sky-img"
            src={ASSETS.sky}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop';
            }}
            alt=""
          />
          <header className="site-header" aria-label="Primary navigation">
            <a className="site-logo" href="#cinema">
              Bosnia and Herzegovina
            </a>
            <nav className="site-nav" aria-label="Main menu">
              <a href="#cinema">Intro</a>
              <a href="#bridge">Bridge</a>
              <a href="#bazaar">Bazaar</a>
              <a href="#routes">Routes</a>
            </nav>
            <button className="language-switcher" aria-label="Change language">
              <span>EN</span>
              <span aria-hidden="true">⌄</span>
            </button>
          </header>
          <div className="back-stack">
            <img className="scene-img back-img back-four" src={ASSETS.backFour} alt="" />
            <section className="sights-slider" aria-label="Mostar sights slider">
              <div className="sights-track" ref={trackRef}>
                <article className="sight-card" tabIndex={0} role="button" aria-label="Open Stari Most card">
                  <span className="sight-kicker">Old Bridge</span>
                  <img className="sight-pin" src={ASSETS.icons.icon1} alt="" />
                  <h3>Stari Most</h3>
                  <p>The stone arch over the Neretva and Mostar's main landmark.</p>
                </article>
                <article className="sight-card" tabIndex={0} role="button" aria-label="Open Kujundziluk card">
                  <span className="sight-kicker">Bazaar Street</span>
                  <img className="sight-pin" src={ASSETS.icons.icon2} alt="" />
                  <h3>Kujundziluk</h3>
                  <p>Copper shops, souvenirs, and the old bazaar lane by the bridge.</p>
                </article>
                <article className="sight-card" tabIndex={0} role="button" aria-label="Open Koski Mehmed Pasha Mosque card">
                  <span className="sight-kicker">Viewpoint</span>
                  <img className="sight-pin" src={ASSETS.icons.icon3} alt="" />
                  <h3>Koski Mehmed Pasha Mosque</h3>
                  <p>A classic minaret view back toward Stari Most and the river.</p>
                </article>
                <article className="sight-card" tabIndex={0} role="button" aria-label="Open Kajtaz House card">
                  <span className="sight-kicker">Ottoman House</span>
                  <img className="sight-pin" src={ASSETS.icons.icon1} alt="" />
                  <h3>Kajtaz House</h3>
                  <p>A preserved residential house showing Mostar's Ottoman layers.</p>
                </article>
                <article className="sight-card" tabIndex={0} role="button" aria-label="Open War Photo Exhibition card">
                  <span className="sight-kicker">Museum</span>
                  <img className="sight-pin" src={ASSETS.icons.icon2} alt="" />
                  <h3>War Photo Exhibition</h3>
                  <p>A compact, moving stop for context on the city's recent history.</p>
                </article>
              </div>
            </section>
            <img className="scene-img back-img back-bazaar" src={ASSETS.bazaar} referrerPolicy="no-referrer" alt="" />
          </div>
          <div className="sights-controls" ref={controlsRef} aria-label="Slider controls">
            <button className="sight-nav sight-prev" aria-label="Previous sight">
              ←
            </button>
            <button className="sight-nav sight-next" aria-label="Next sight">
              →
            </button>
          </div>
          <h1 className="hero-title">MOSTAR</h1>
          <img className="scene-img splitframe-img splitframe-left" src={ASSETS.splitLeft} referrerPolicy="no-referrer" alt="" />
          <img className="scene-img splitframe-img splitframe-right" src={ASSETS.splitRight} referrerPolicy="no-referrer" alt="" />
          <img className="scene-img bridge-img" src={ASSETS.bridge} referrerPolicy="no-referrer" alt="" />
          <img className="scene-img frame-two-img" src={ASSETS.frameTwo} referrerPolicy="no-referrer" alt="" />
          <div className="shade" />
        </div>
        <section className="intro-copy" aria-label="Mostar overview">
          <p>
            A stone arch, emerald water, and a compact old city made for slow mornings, late light,
            and one unforgettable crossing.
          </p>
          <div className="hero-tags" aria-label="Mostar highlights">
            <span>Old Bridge</span>
            <span>Neretva River</span>
            <span>UNESCO old city</span>
          </div>
        </section>
        <section className="story-panel story-panel-bridge" id="bridge" aria-label="Old Bridge details">
          <h2>The bridge is the city's compass.</h2>
          <p>
            Stari Most links the banks of the Neretva and anchors a historic quarter shaped by
            Ottoman, Mediterranean, and European layers.
          </p>
          <dl className="facts">
            <div>
              <dt>1566</dt>
              <dd>Original bridge completed</dd>
            </div>
            <div>
              <dt>2005</dt>
              <dd>Old Bridge Area inscribed by UNESCO</dd>
            </div>
          </dl>
        </section>
        <section className="story-panel story-panel-bazaar" id="bazaar" aria-label="Old town details">
          <h2>The bazaar keeps Mostar close.</h2>
          <p>
            Stone lanes, mosque courtyards, copper stalls, and riverside coffee stay within a short
            walk of Stari Most.
          </p>
          <button className="note-button">
            <span aria-hidden="true">↗</span>
            <span>Open old town notes</span>
          </button>
        </section>
      </div>
    </section>
  );
};
