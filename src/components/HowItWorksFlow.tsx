import React, { useState } from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/researchData';
import { ArrowRight, ChevronDown, CheckCircle, Activity, Waves, Gauge, Radio, Cpu, BellRing } from 'lucide-react';

const STEP_ICONS = [
  Gauge,      // 01 Pipe
  Waves,      // 02 Vibration
  Radio,      // 03 Mechanical Collector
  Activity,   // 04 Sensor
  Cpu,        // 05 Signal Analysis
  BellRing,   // 06 Leak Warning
];

export const HowItWorksFlow: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  return (
    <div className="w-full">
      {/* Horizontal / Step Navigation Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {HOW_IT_WORKS_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx];
          const isActive = activeStepIndex === idx;

          return (
            <button
              key={step.step}
              id={`how-it-works-step-${step.step}`}
              onClick={() => setActiveStepIndex(idx)}
              className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-cyan-500/50'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30'
              }`}
            >
              {/* Step Number Monospace Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {step.step}
                </span>

                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
              </div>

              {/* Title & Subtitle */}
              <h4 className="font-display font-bold text-sm tracking-tight mb-1">
                {step.title}
              </h4>
              <p
                className={`text-xs line-clamp-1 ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {step.subtitle}
              </p>

              {/* Active Bottom Glow Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card for Selected Step */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                STAGE {HOW_IT_WORKS_STEPS[activeStepIndex].step} OF 06
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
                {HOW_IT_WORKS_STEPS[activeStepIndex].badge}
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                {HOW_IT_WORKS_STEPS[activeStepIndex].title}
              </h3>
              <p className="text-sm font-mono text-cyan-700 font-medium mt-0.5">
                {HOW_IT_WORKS_STEPS[activeStepIndex].subtitle}
              </p>
            </div>

            <p className="text-slate-600 text-base leading-relaxed">
              {HOW_IT_WORKS_STEPS[activeStepIndex].description}
            </p>

            {/* Step Progression Mini-Flow */}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Next Stage:</span>
              <span className="font-bold text-slate-800">
                {HOW_IT_WORKS_STEPS[(activeStepIndex + 1) % 6].title}
              </span>
              <button
                onClick={() => setActiveStepIndex((activeStepIndex + 1) % 6)}
                className="ml-auto inline-flex items-center gap-1 text-cyan-700 hover:text-cyan-800 font-semibold cursor-pointer"
              >
                Advance Process
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Technical Spec Box */}
          <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 font-mono text-xs">
            <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 pb-2">
              SIGNAL CHAIN INTEGRITY
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Sampling Window</span>
              <span className="text-slate-800 font-bold">500 ms Sliding</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Acoustic Coupling</span>
              <span className="text-slate-800 font-bold">Dry Silicone Clamp</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Processing Mode</span>
              <span className="text-slate-800 font-bold">Edge RMS Deviation</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Detection Latency</span>
              <span className="text-emerald-700 font-bold">&lt; 1.2 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
