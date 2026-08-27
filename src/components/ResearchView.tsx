import React, { useState } from 'react';
import { TabType, ResearchTest } from '../types';
import { 
  RESEARCH_OVERVIEW, 
  RESEARCH_VARIABLES, 
  RESEARCH_TESTS 
} from '../data/researchData';
import { 
  Beaker, 
  ArrowRight, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  Activity, 
  AlertCircle, 
  Waves, 
  Droplet,
  Sparkles,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';

interface ResearchViewProps {
  onSelectTab: (tab: TabType) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ onSelectTab }) => {
  const [selectedTest, setSelectedTest] = useState<ResearchTest>(RESEARCH_TESTS[0]);
  const [activePrincipleTab, setActivePrincipleTab] = useState<'normal' | 'leaking'>('normal');

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 🔬 RESEARCH HEADER */}
      <section className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-medium">
          <Beaker className="w-3.5 h-3.5" />
          <span>SCIENTIFIC INVESTIGATION & METHODOLOGY</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Research
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 font-medium">
          Understanding hidden pipeline leakage through external vibration monitoring.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-500">
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
            Project Stage: Prototype / Experimental
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
            Framework: INSPIRE-MANAK
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
            Domain: Non-Destructive Acoustic Sensing
          </span>
        </div>
      </section>

      {/* A. RESEARCH QUESTION & HYPOTHESIS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-700">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            A. PRIMARY RESEARCH QUESTION
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {RESEARCH_OVERVIEW.question}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Investigating whether micro-turbulences created by water escaping an orifice generate sufficient surface acoustic energy on standard PVC/metal pipes to be distinguished without intrusive fluid contact.
          </p>
        </div>

        {/* Hypothesis Card */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            FORMULATED HYPOTHESIS
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
            {RESEARCH_OVERVIEW.hypothesis}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            While transient shocks create short spikes, continuous leakage produces sustained high-frequency spectral elevation correlated with orifice pressure differential.
          </p>
        </div>
      </section>

      {/* B. THE ENGINEERING PROBLEM */}
      <section className="bg-slate-100/60 rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 space-y-6">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            B. THE ENGINEERING CHALLENGE
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Why External Detection Is Difficult
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Non-invasive pipeline monitoring presents three distinct physical obstacles that PipeGuard is engineered to address:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <div className="font-mono text-xs font-bold text-cyan-700">01 / Acoustic Impedance</div>
            <h4 className="font-display font-bold text-slate-900 text-base">Acoustic Boundary Loss</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sound waves lose intensity when transferring across the water-to-pipe-wall interface and pipe-wall-to-sensor boundary.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <div className="font-mono text-xs font-bold text-cyan-700">02 / Environmental Noise</div>
            <h4 className="font-display font-bold text-slate-900 text-base">Background Disturbance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vehicle traffic, footsteps, and pump motors induce external vibrations that can easily trigger false alarms in crude fixed-threshold sensors.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <div className="font-mono text-xs font-bold text-cyan-700">03 / Signal Attenuation</div>
            <h4 className="font-display font-bold text-slate-900 text-base">Distance Decay</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vibration amplitude decays logarithmically with distance along the pipe span, requiring multi-node array triangulation.
            </p>
          </div>
        </div>
      </section>

      {/* C. PROPOSED PRINCIPLE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
              C. PHYSICAL PRINCIPLE
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Acoustic Comparison: Normal vs Leaking Pipe
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl">
              How fluid turbulence creates a distinctive vibrational delta across the pipe surface.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActivePrincipleTab('normal')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activePrincipleTab === 'normal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal Pipe
            </button>
            <button
              onClick={() => setActivePrincipleTab('leaking')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activePrincipleTab === 'leaking'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leaking Pipe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Normal Pipe Card */}
          <div
            className={`rounded-2xl border p-6 sm:p-8 transition-all ${
              activePrincipleTab === 'normal'
                ? 'bg-emerald-950 text-emerald-50 border-emerald-800 ring-2 ring-emerald-500/50 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STATE 01: NORMAL OPERATION
              </span>
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>

            <h3 className="font-display text-xl font-bold mb-2">
              Stable flow → Characteristic baseline vibration
            </h3>
            
            <p className={`text-sm leading-relaxed mb-6 ${activePrincipleTab === 'normal' ? 'text-emerald-200' : 'text-slate-600'}`}>
              Water flows under steady laminar conditions. Friction against internal pipe walls creates a low-intensity, stationary vibration signature centered at 38–42 units.
            </p>

            {/* Visual Waveform Sketch */}
            <div className="p-4 rounded-xl bg-black/40 border border-emerald-800/60 font-mono text-xs space-y-2">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">VIBRATION TRACE</div>
              <div className="h-10 flex items-center justify-center text-emerald-400 tracking-widest text-sm select-none">
                ───────~──────~───────~─────
              </div>
              <div className="flex justify-between text-[11px] text-emerald-300 pt-1 border-t border-emerald-800/40">
                <span>RMS Energy: 1.12 m/s²</span>
                <span>Deviation: 0 units</span>
              </div>
            </div>
          </div>

          {/* Leaking Pipe Card */}
          <div
            className={`rounded-2xl border p-6 sm:p-8 transition-all ${
              activePrincipleTab === 'leaking'
                ? 'bg-red-950 text-red-50 border-red-800 ring-2 ring-red-500/50 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                STATE 02: ACTIVE LEAKAGE
              </span>
              <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
            </div>

            <h3 className="font-display text-xl font-bold mb-2">
              Leak → Fluid turbulence → Altered acoustic vibration
            </h3>

            <p className={`text-sm leading-relaxed mb-6 ${activePrincipleTab === 'leaking' ? 'text-red-200' : 'text-slate-600'}`}>
              Pressurized fluid escaping through an orifice creates intense localized vortices, cavitation bubbles, and structural wall vibrations (+18 to +65 units above baseline).
            </p>

            {/* Visual Waveform Sketch */}
            <div className="p-4 rounded-xl bg-black/40 border border-red-800/60 font-mono text-xs space-y-2">
              <div className="text-[10px] text-red-400 uppercase font-bold">VIBRATION TRACE</div>
              <div className="h-10 flex items-center justify-center text-red-400 tracking-wider text-sm select-none">
                ───────╱╲╱╲╱╲────╱╲╱╲╱╲───
              </div>
              <div className="flex justify-between text-[11px] text-red-300 pt-1 border-t border-red-800/40">
                <span>RMS Energy: 3.84 m/s²</span>
                <span>Deviation: +28 units</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. EXPERIMENTAL SETUP (LARGE DIAGRAM) */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 lg:p-12 text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            D. EXPERIMENTAL APPARATUS
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Closed-Loop Hydrodynamic Test Rig
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            A calibrated 4.0-meter closed-loop hydraulic circuit configured to generate steady fluid flows and inject controlled micro/macro leaks between sensor pairs.
          </p>
        </div>

        {/* Large Experimental Setup Diagram */}
        <div className="relative z-10 my-6 bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-x-auto">
          <div className="min-w-[620px]">
            <svg viewBox="0 0 760 260" className="w-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* TANK & PUMP VERTICAL COLUMN */}
              <g transform="translate(60, 20)">
                <rect x="0" y="0" width="80" height="70" rx="8" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
                <text x="40" y="25" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                  WATER TANK
                </text>
                <text x="40" y="42" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                  Reservoir
                </text>
                
                {/* Arrow Down */}
                <line x1="40" y1="70" x2="40" y2="105" stroke="#0ea5e9" strokeWidth="4" />
                <polygon points="40,110 35,100 45,100" fill="#0ea5e9" />

                {/* PUMP */}
                <g transform="translate(0, 110)">
                  <circle cx="40" cy="25" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="40" y="29" textAnchor="middle" fill="#e0f2fe" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                    PUMP
                  </text>
                  <text x="40" y="60" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">
                    1.5 - 2.5 Bar
                  </text>
                </g>
              </g>

              {/* MAIN HORIZONTAL TEST PIPELINE */}
              <g transform="translate(180, 140)">
                {/* Pipeline Tube */}
                <rect x="0" y="5" width="540" height="30" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <rect x="2" y="10" width="536" height="20" fill="#0284c7" opacity="0.7" />
                <path d="M 5 20 L 535 20" stroke="#38bdf8" strokeWidth="2" className="animate-water-flow" />

                {/* SENSOR 1 (PG-1) */}
                <g transform="translate(80, 0)">
                  <rect x="-25" y="-55" width="50" height="32" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="-40" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    PG-1
                  </text>
                  <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                    Sensor 01
                  </text>
                  <line x1="0" y1="-23" x2="0" y2="5" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="0" cy="20" r="7" fill="#10b981" />
                </g>

                {/* CONTROLLED LEAK ORIFICE IN THE MIDDLE */}
                <g transform="translate(260, 0)">
                  <line x1="0" y1="-50" x2="0" y2="5" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                  <polygon points="0,5 -5,-5 5,-5" fill="#ef4444" />
                  
                  <rect x="-35" y="-75" width="70" height="24" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="0" y="-60" textAnchor="middle" fill="#fecaca" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                    LEAK ORIFICE
                  </text>

                  {/* Escaping Drop */}
                  <g transform="translate(0, 20)">
                    <circle cx="0" cy="0" r="6" fill="#ef4444" className="animate-ping" />
                    <text x="0" y="24" textAnchor="middle" fill="#ef4444" fontSize="12">
                      💧
                    </text>
                  </g>
                </g>

                {/* SENSOR 2 (PG-2) */}
                <g transform="translate(440, 0)">
                  <rect x="-25" y="-55" width="50" height="32" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="-40" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    PG-2
                  </text>
                  <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                    Sensor 02
                  </text>
                  <line x1="0" y1="-23" x2="0" y2="5" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="0" cy="20" r="7" fill="#ef4444" />
                </g>

                {/* Acoustic Transmission Path Line */}
                <path d="M 80 20 L 440 20" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              </g>
            </svg>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">SPAN DISTANCE</div>
            <div className="text-slate-200 font-bold">1.0m to 4.0m Variable</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">PIPE MATERIAL</div>
            <div className="text-slate-200 font-bold">Schedule 40 PVC &amp; GI Pipe</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">PRESSURE CONTROL</div>
            <div className="text-slate-200 font-bold">Regulated 0.5 - 2.5 Bar</div>
          </div>
        </div>
      </section>

      {/* E. VARIABLES */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
            E. EXPERIMENTAL VARIABLES
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Scientific Control Framework
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl">
            Isolating the independent leakage stimulus while maintaining strict controls on pipeline geometry and fluid pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Independent Variables */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-mono font-bold text-cyan-700">
              <Sliders className="w-4 h-4" />
              <span>INDEPENDENT VARIABLES</span>
            </div>
            <div className="space-y-3">
              {RESEARCH_VARIABLES.independent.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-600 leading-snug">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Measured Variables */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-mono font-bold text-blue-700">
              <Activity className="w-4 h-4" />
              <span>MEASURED VARIABLES</span>
            </div>
            <div className="space-y-3">
              {RESEARCH_VARIABLES.measured.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-600 leading-snug">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controlled Variables */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-mono font-bold text-indigo-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>CONTROLLED VARIABLES</span>
            </div>
            <div className="space-y-3">
              {RESEARCH_VARIABLES.controlled.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-600 leading-snug">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* F. TESTING PROTOCOL CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
              F. TESTING PROTOCOL
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Experimental Test Matrix
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl">
              Five systematic tests to evaluate normal baseline, micro-leaks, macro-ruptures, transient noise rejection, and velocity scaling.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            5 Formal Evaluation Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESEARCH_TESTS.map((test) => (
            <div
              key={test.id}
              onClick={() => setSelectedTest(test)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                selectedTest.id === test.id
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-cyan-500/50'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      selectedTest.id === test.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {test.id}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      test.testStatus === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : test.testStatus === 'ongoing'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}
                  >
                    {test.testStatus}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-base mb-1">{test.title}</h4>
                  <p
                    className={`text-xs leading-relaxed ${
                      selectedTest.id === test.id ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {test.description}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 pt-3 border-t text-[11px] font-mono space-y-1 ${
                  selectedTest.id === test.id ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}
              >
                <div className="flex justify-between">
                  <span>Flow Rate:</span>
                  <span className="font-semibold text-slate-200">{test.flowRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leak Size:</span>
                  <span className="font-semibold text-slate-200">{test.leakSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* G. RESULTS NOTE (As strictly specified in the prompt) */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 text-slate-800 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            G. EXPERIMENTAL RESULTS
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Empirical Validation &amp; Time-Series Graphs
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl">
            Comparative analysis graphs will include Vibration signal vs Time, Normal steady flow vs active leak, and Sensor 1 vs Sensor 2 differential attenuation.
          </p>
        </div>

        {/* Scientific Integrity Notice as mandated by user prompt */}
        <div className="bg-white rounded-2xl border border-cyan-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-50 text-cyan-800 text-xs font-mono font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600" />
              <span>LABORATORY PROTOCOL NOTICE</span>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Results will be added after experimental testing.
            </h3>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              In adherence to rigorous scientific ethics, empirical trial records will be uploaded following multi-run statistical repetitions on the INSPIRE-MANAK test loop.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('dashboard')}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Test in Live Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
