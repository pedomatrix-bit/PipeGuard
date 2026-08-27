import React from 'react';
import { TabType, SimulationScenario, SensorNode } from '../types';
import { SYSTEM_INFO, PROBLEM_CARDS, INNOVATION_PILLARS, RESEARCH_OVERVIEW } from '../data/researchData';
import { PipeDiagram3D } from './PipeDiagram3D';
import { HowItWorksFlow } from './HowItWorksFlow';
import { PipeGuardLogo } from './PipeGuardLogo';
import { 
  ArrowRight, 
  Activity, 
  Droplet, 
  EyeOff, 
  Droplets, 
  Shovel, 
  Puzzle, 
  TrendingUp, 
  MapPin, 
  Beaker, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: TabType) => void;
  currentScenario: SimulationScenario;
  sensors: SensorNode[];
  onTriggerScenario: (scenario: SimulationScenario) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  currentScenario,
  sensors,
  onTriggerScenario,
}) => {
  const leadSensor = sensors.find((s) => s.id === 'PG-03') || sensors[0];
  const isLeaking = currentScenario === 'small-leak' || currentScenario === 'large-leak';

  const getProblemIcon = (iconName: string) => {
    switch (iconName) {
      case 'EyeOff':
        return <EyeOff className="w-5 h-5 text-cyan-600" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'Shovel':
        return <Shovel className="w-5 h-5 text-indigo-600" />;
      default:
        return <Droplet className="w-5 h-5 text-cyan-600" />;
    }
  };

  const getInnovationIcon = (iconName: string) => {
    switch (iconName) {
      case 'Puzzle':
        return <Puzzle className="w-6 h-6 text-cyan-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-indigo-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 1. 🏠 HERO SECTION */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Text & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Project Label Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="font-semibold">INSPIRE-MANAK INNOVATION</span>
              <span className="text-cyan-400">|</span>
              <span>WATER CONSERVATION</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <PipeGuardLogo className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  PIPEGUARD
                </h1>
              </div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-700 leading-snug">
                Detect hidden water-pipe leaks before they become major losses.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {SYSTEM_INFO.heroDescription}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-research-btn"
                onClick={() => onSelectTab('research')}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm transition-all shadow-md flex items-center gap-2 group cursor-pointer active:scale-95"
              >
                <span>Explore Research</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-open-dashboard-btn"
                onClick={() => onSelectTab('dashboard')}
                className="px-5 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Activity className="w-4 h-4" />
                <span>Open Dashboard</span>
                <span className="text-xs font-mono opacity-80">→</span>
              </button>
            </div>

            {/* Small Status Card */}
            <div className="pt-4 max-w-md">
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    PIPE STATUS
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono font-bold text-sm text-emerald-800">
                      {isLeaking ? 'WARNING / LEAK DETECTED' : 'NORMAL'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    Monitoring active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual: Technical 3D Pipe Illustration */}
          <div className="lg:col-span-5">
            <PipeDiagram3D
              isLeaking={isLeaking}
              onToggleLeak={() => onTriggerScenario(isLeaking ? 'normal' : 'small-leak')}
            />
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="bg-slate-100/60 rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            <span>THE CHALLENGE</span>
            <span>•</span>
            <span>CRITICAL INFRASTRUCTURE DEFICIT</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            A leak can stay hidden.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In pressurized water distribution networks, leaks silently compromise resource stability and infrastructure integrity.
          </p>
        </div>

        {/* 3 Short Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PROBLEM_CARDS.map((card) => (
            <div
              key={card.number}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {card.number}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {getProblemIcon(card.icon)}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-700 font-medium mb-2">
                    {card.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {card.impact}
              </div>
            </div>
          ))}
        </div>

        {/* Approach Callout Banner */}
        <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                THE PIPEGUARD PARADIGM
              </div>
              <p className="font-display text-base sm:text-lg font-bold text-white">
                PipeGuard explores a different approach: <span className="text-cyan-300">listen to the pipe from the outside.</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('research')}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Learn How</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. HOW PIPEGUARD WORKS (6-STEP FLOW) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
              PROCESS ARCHITECTURE
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              How PipeGuard Works
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl">
              From physical fluid flow to acoustic wave transfer, edge signal processing, and real-time leak localization.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            Sequential 6-Stage Signal Pipeline
          </span>
        </div>

        <HowItWorksFlow />
      </section>

      {/* 4. THE INNOVATION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
            CORE DIFFERENTIATORS
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Not just a sensor. A system.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered specifically to solve the cost, invasiveness, and localization limitations of legacy pipeline tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INNOVATION_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getInnovationIcon(pillar.icon)}
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-700 font-semibold mb-2">
                    {pillar.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:px-6 rounded-b-2xl">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                  PRACTICAL IMPACT
                </div>
                <div className="text-xs font-mono text-slate-700 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pillar.benefit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RESEARCH PREVIEW */}
      <section className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold">
              <Beaker className="w-3.5 h-3.5" />
              STUDENT RESEARCH STUDY
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                What are we investigating?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Examining the relationship between internal pipeline turbulence and surface-transmitted acoustic vibration signatures under controlled fluid dynamics.
              </p>
            </div>

            {/* Research Preview Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-cyan-400">
                  RESEARCH QUESTION
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {RESEARCH_OVERVIEW.question}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-cyan-400">
                  HYPOTHESIS
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {RESEARCH_OVERVIEW.hypothesis}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-cyan-400">
                  EXPERIMENT
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {RESEARCH_OVERVIEW.experimentSummary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                  CURRENT STAGE
                </div>
                <p className="text-xs text-slate-300 leading-snug font-medium">
                  {RESEARCH_OVERVIEW.currentStage}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="home-read-research-btn"
                onClick={() => onSelectTab('research')}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Read the Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 6. LIVE / DEMO STATUS PREVIEW CARD */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    PIPEGUARD MONITOR
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    CHANNEL: {leadSensor.id}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    NORMAL
                  </span>
                </div>
              </div>

              {/* Metric Table Box */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Vibration</span>
                  <span className="text-slate-100 font-bold text-sm">42 units</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Baseline</span>
                  <span className="text-slate-300">39 units</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Difference</span>
                  <span className="text-emerald-400 font-bold">+3</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Last reading</span>
                  <span className="text-cyan-300">09:28:41</span>
                </div>
              </div>

              {/* DEMO DATA DISCLAIMER (As explicitly requested in prompt) */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>DEMO DATA — NOT LIVE SENSOR DATA</span>
              </div>

              <button
                onClick={() => onSelectTab('dashboard')}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Pipeline Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
