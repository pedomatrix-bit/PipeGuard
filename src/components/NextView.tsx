import React from 'react';
import { TabType } from '../types';
import { ROADMAP_STEPS } from '../data/researchData';
import { 
  Rocket, 
  ArrowRight, 
  Cpu, 
  Wrench, 
  CheckCircle2, 
  Crosshair, 
  Radio, 
  Building2,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NextViewProps {
  onSelectTab: (tab: TabType) => void;
}

const STEP_ICONS = [
  Cpu,          // 01 Prototype
  Wrench,       // 02 Improve
  CheckCircle2, // 03 Validate
  Crosshair,    // 04 Localize
  Radio,        // 05 Network
  Building2,    // 06 Field Study
];

export const NextView: React.FC<NextViewProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 🚀 HEADER */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-medium">
          <Rocket className="w-3.5 h-3.5 text-cyan-600" />
          <span>FUTURE DEVELOPMENT ROADMAP</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          What's Next?
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 font-medium">
          From prototype to distributed municipal pipeline network.
        </p>

        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          The planned progression to scale PipeGuard from a laboratory acoustic proof-of-concept into a robust, deployable municipal water security system.
        </p>
      </section>

      {/* TIMELINE-STYLE 6-STEP PROGRESSION */}
      <section className="relative">
        {/* Vertical timeline spine */}
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-slate-300 -translate-x-1/2" />

        <div className="space-y-8 sm:space-y-12">
          {ROADMAP_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[idx] || Rocket;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={step.step}
                className={`relative flex flex-col md:flex-row items-center gap-6 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content Card (Half width on desktop) */}
                <div className="w-full md:w-1/2">
                  <div
                    className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all ${
                      step.status === 'current'
                        ? 'border-cyan-300 ring-2 ring-cyan-500/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                          STAGE {step.step}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            step.status === 'current'
                              ? 'bg-cyan-100 text-cyan-800'
                              : step.status === 'next'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {step.status === 'current' ? '● In Progress' : step.status === 'next' ? '○ Upcoming' : 'Future Vision'}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                        <Icon className="w-4 h-4 text-cyan-700" />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs font-mono text-cyan-700 font-semibold mb-3">
                      {step.summary}
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 bg-slate-50/70 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:px-6 rounded-b-2xl flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">KEY MILESTONE:</span>
                      <span className="text-slate-800 font-semibold text-right">{step.milestone}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Center Node */}
                <div className="hidden md:flex relative z-10 w-12 h-12 rounded-2xl bg-slate-900 border-4 border-white shadow-md items-center justify-center text-cyan-400 shrink-0 font-mono text-xs font-bold">
                  {step.step}
                </div>

                {/* Empty Spacer on other side for alternate layout */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </section>

      {/* LONG TERM VISION BANNER */}
      <section className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              THE LARGER HORIZON
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Scaling Sustainable Water Infrastructure
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every drop saved through early non-invasive leak interception protects public drinking water reserves, prevents foundation erosion, and lowers civic energy expenditure.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Test Current Prototype In Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectTab('research')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Review Research Protocol</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
