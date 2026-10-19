import React, { useState } from 'react';
import { Hammer, Rocket, Globe, Sparkles, Check, ArrowRight, Code2, Share2, Award } from 'lucide-react';

interface HowItWorksProps {
  theme?: 'dark' | 'light';
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ theme = 'dark' }) => {
  const [activeStep, setActiveStep] = useState(0);
  const isLight = theme === 'light';

  const steps = [
    {
      num: '01',
      title: 'Build',
      subtitle: 'Create something you’re proud of.',
      desc: 'Whether it is an experimental WebGPU shader, an autonomous robotics flight stack, a full-stack SaaS, or an indie game—build what excites you.',
      icon: <Hammer className="w-6 h-6 text-cyan-400" />,
      tag: 'CRAFT & CODE',
      visualCode: [
        'git commit -m "feat: complete MVP architecture"',
        'npm run build -> bundle size 42kb',
        'Ready for LaunchForge deployment',
      ],
      highlights: ['Open Source or Proprietary', 'Any Framework or Stack', 'Student to Enterprise'],
    },
    {
      num: '02',
      title: 'Launch',
      subtitle: 'Publish your project on LaunchForge.',
      desc: 'Craft a stunning showcase with screenshots, tech tags, demo links, and GitHub repos. Takes under 2 minutes with zero fees.',
      icon: <Rocket className="w-6 h-6 text-violet-400" />,
      tag: 'PUBLISH & SHOWCASE',
      visualCode: [
        'Generating 3D interactive preview...',
        'Linking GitHub repository & releases',
        'Broadcasted to Season 04 Discovery Grid',
      ],
      highlights: ['Interactive 3D Card Generation', 'Direct Link Previews', 'Community Discussion Thread'],
    },
    {
      num: '03',
      title: 'Get Discovered',
      subtitle: 'Let the community discover and interact with your work.',
      desc: 'Climb the trending leaderboard, gather real feedback from peer developers, attract early beta users, and connect with prospective investors.',
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      tag: 'SCALE & ACCELERATE',
      visualCode: [
        '+2,400 beta signups acquired',
        'Ranked #1 Trending in Artificial Intelligence',
        'Investor introduction request received',
      ],
      highlights: ['Trending Leaderboard', 'Real Peer Feedback', 'Angel Investor & Talent Matching'],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* High-tech Engineering Hardware Background Image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover mix-blend-screen ${isLight ? 'opacity-5' : 'opacity-10'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isLight ? 'from-slate-50 via-slate-100/50 to-slate-50' : 'from-[#05070f] via-slate-950/70 to-[#05070f]'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            THE LAUNCH PIPELINE
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-heading ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            How It Works
          </h2>
          <p className={`text-sm sm:text-base mt-3 ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            From your local terminal to the global innovator spotlight in three seamless steps.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`group relative p-8 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isLight
                      ? 'bg-white border-2 border-cyan-500 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-900/90 border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.2)]'
                    : isLight
                    ? 'bg-white/80 hover:bg-white border border-slate-200 shadow-sm hover:shadow-md'
                    : 'bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700'
                } backdrop-blur-xl`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                    }`}>
                      {step.icon}
                    </div>
                    <span className={`text-3xl font-black font-mono transition-colors ${
                      isLight ? 'text-slate-300 group-hover:text-cyan-600/50' : 'text-slate-700 group-hover:text-cyan-400/50'
                    }`}>
                      {step.num}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
                    {step.tag}
                  </span>

                  {/* Title & Subtitle */}
                  <h3 className={`text-2xl font-bold mt-1 mb-2 font-heading ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm font-semibold mb-3 ${
                    isLight ? 'text-cyan-700' : 'text-cyan-200/90'
                  }`}>
                    {step.subtitle}
                  </p>
                  <p className={`text-xs leading-relaxed mb-6 ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {step.desc}
                  </p>
                </div>

                {/* Micro Terminal / Visual Preview */}
                <div className={`rounded-xl p-4 border font-mono text-[11px] space-y-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <div className={`flex items-center gap-1.5 pb-2 mb-2 border-b ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-red-500/70" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                    <span className={`text-[10px] ml-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>pipeline // step-{step.num}</span>
                  </div>
                  {step.visualCode.map((line, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <span className="text-cyan-500 font-bold">&gt;</span>
                      <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{line}</span>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className={`mt-6 pt-4 border-t space-y-2 ${
                  isLight ? 'border-slate-200' : 'border-slate-800/80'
                }`}>
                  {step.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className={`flex items-center gap-2 text-xs ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      <Check className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
