import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Droplets, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Award,
  Volume2,
  VolumeX,
  Gauge,
  Waves
} from 'lucide-react';
import { PipeGuardLogo } from './PipeGuardLogo';

interface AcousticPreloaderProps {
  onComplete: () => void;
}

interface TelemetryStep {
  percent: number;
  label: string;
  sublabel: string;
  phase: 'pressurization' | 'transducers' | 'tdoa' | 'telemetry';
  sensorState: [boolean, boolean, boolean, boolean];
}

const TELEMETRY_STEPS: TelemetryStep[] = [
  {
    percent: 12,
    label: 'PRESSURIZING CLOSED-LOOP WATER RIG',
    sublabel: 'Establishing laminar flow velocity • 3.2 bar line pressure nominal',
    phase: 'pressurization',
    sensorState: [false, false, false, false],
  },
  {
    percent: 34,
    label: 'ENGAGING EXTERNAL PZT PIEZOELECTRIC DISCS',
    sublabel: 'Acoustic silicone elastomer coupling engaged on 4 pipe clamp nodes',
    phase: 'transducers',
    sensorState: [true, false, false, false],
  },
  {
    percent: 58,
    label: 'CALIBRATING ACOUSTIC RESONANCE (1–50 kHz)',
    sublabel: 'Low-noise Sallen-Key bandpass filter eliminating ambient pump vibrations',
    phase: 'transducers',
    sensorState: [true, true, true, false],
  },
  {
    percent: 78,
    label: 'SYNCHRONIZING TDOA CROSS-CORRELATION',
    sublabel: 'Acoustic wave velocity V = 1350 m/s locked • Microsecond timing synced',
    phase: 'tdoa',
    sensorState: [true, true, true, true],
  },
  {
    percent: 94,
    label: 'CONNECTING MUNICIPAL SCADA DIGITAL TWIN',
    sublabel: 'Telemetry stream active • Continuous baseline monitoring engaged',
    phase: 'telemetry',
    sensorState: [true, true, true, true],
  },
  {
    percent: 100,
    label: 'PIPEGUARD SYSTEM OPERATIONAL',
    sublabel: 'INSPIRE-MANAK National Science Project • Ready for Monitoring',
    phase: 'telemetry',
    sensorState: [true, true, true, true],
  },
];

export const AcousticPreloader: React.FC<AcousticPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);

  // Audio Context for subtle procedural sci-fi acoustic chime (zero external audio files)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (freq = 440, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Ignore if browser policy restricts
    }
  };

  // Automated Progress Engine
  useEffect(() => {
    let currentP = 0;
    const interval = setInterval(() => {
      // Dynamic easing: slower on milestones, fast between
      const increment = currentP < 30 ? 1.4 : currentP < 70 ? 1.1 : currentP < 92 ? 1.6 : 1.2;
      currentP = Math.min(100, currentP + increment);
      setProgress(Math.floor(currentP));

      // Match step
      const stepIdx = TELEMETRY_STEPS.findIndex((s) => s.percent >= currentP);
      if (stepIdx !== -1 && stepIdx !== currentStepIndex) {
        setCurrentStepIndex(stepIdx);
      }

      if (currentP >= 100) {
        clearInterval(interval);
        // Play success chime
        playChime(660, 'triangle', 0.25);
        // Pause briefly at 100% to let user see system ready, then transition out
        setTimeout(() => {
          handleEnter();
        }, 800);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    playChime(880, 'sine', 0.15);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  // Keyboard shortcut: Space or Enter to enter immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentStep = TELEMETRY_STEPS[currentStepIndex] || TELEMETRY_STEPS[0];

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col justify-between bg-slate-950 text-white overflow-hidden transition-all duration-700 ease-in-out ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
      onClick={() => setPulseCount((c) => c + 1)}
    >
      {/* Background High-Tech Grid & Radial Acoustic Field */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-slate-950/90 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Top Telemetry Header */}
      <header className="relative z-10 p-4 sm:p-8 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <PipeGuardLogo className="w-9 h-9" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                PIPEGUARD
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SYSTEM DIAGNOSTIC
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              INSPIRE-MANAK • Non-Invasive Pipeline Acoustic Leak Detection
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                playChime(520, 'sine', 0.1);
              }
            }}
            className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute audio' : 'Enable acoustic chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Acoustic Audio On' : 'Audio Muted'}</span>
          </button>

          {/* Direct Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 active:scale-95 group shadow-sm"
          >
            <span>Skip Tour</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Center Cinematic Acoustic Pipeline Simulation Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
        
        {/* Real-time Oscilloscope & Acoustic Sine Visualizer */}
        <div className="w-full mb-6 relative">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>PIPELINE WALL HARMONIC FREQUENCY RESPONSE</span>
            </div>
            <div className="text-cyan-400 font-bold">
              {progress < 30 ? '0.0 kHz (STATIC)' : progress < 70 ? '24.6 kHz (RESONANCE)' : '38.4 kHz (OPTIMIZED)'}
            </div>
          </div>

          {/* SVG Pipeline Schematic with Clamped PZT Transducers & Water Flow */}
          <div className="relative w-full h-36 sm:h-44 bg-slate-900/90 rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-2xl overflow-hidden flex flex-col justify-center">
            {/* Background Oscilloscope Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Central Pipeline Graphic */}
            <svg 
              className="w-full h-24 overflow-visible relative z-10" 
              viewBox="0 0 800 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pipeBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="30%" stopColor="#334155" />
                  <stop offset="70%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Outer Pipe Structural Bounds */}
              <rect x="20" y="35" width="760" height="50" rx="4" fill="url(#pipeBodyGrad)" stroke="#475569" strokeWidth="2.5" />
              
              {/* Internal Water Flow Channel (Progressive fill based on progress) */}
              <rect 
                x="24" 
                y="43" 
                width={`${(Math.max(5, progress) / 100) * 752}`} 
                height="34" 
                rx="2" 
                fill="url(#waterFlowGrad)" 
                className="transition-all duration-300 ease-out opacity-75"
              />

              {/* Water Streamlines */}
              {progress > 15 && (
                <>
                  <line x1="30" y1="52" x2="770" y2="52" stroke="#bae6fd" strokeWidth="1.5" className="animate-water-flow-fast opacity-60" />
                  <line x1="30" y1="60" x2="770" y2="60" stroke="#ffffff" strokeWidth="2" className="animate-water-flow opacity-80" />
                  <line x1="30" y1="68" x2="770" y2="68" stroke="#bae6fd" strokeWidth="1.5" className="animate-water-flow-fast opacity-60" />
                </>
              )}

              {/* 4 External PZT Acoustic Clamp Nodes */}
              {[
                { id: 'PG-01', x: 120, active: currentStep.sensorState[0] },
                { id: 'PG-02', x: 320, active: currentStep.sensorState[1] },
                { id: 'PG-03', x: 520, active: currentStep.sensorState[2] },
                { id: 'PG-04', x: 700, active: currentStep.sensorState[3] },
              ].map((sensor) => (
                <g key={sensor.id} className="transition-all duration-300">
                  {/* Top Clamp Bracket */}
                  <rect 
                    x={sensor.x - 18} 
                    y={sensor.active ? 15 : 8} 
                    width="36" 
                    height="20" 
                    rx="4" 
                    fill={sensor.active ? '#0891b2' : '#1e293b'} 
                    stroke={sensor.active ? '#06b6d4' : '#475569'} 
                    strokeWidth="2" 
                    className="transition-all duration-300"
                  />
                  {/* Bottom Clamp Bracket */}
                  <rect 
                    x={sensor.x - 18} 
                    y={sensor.active ? 85 : 92} 
                    width="36" 
                    height="20" 
                    rx="4" 
                    fill={sensor.active ? '#0891b2' : '#1e293b'} 
                    stroke={sensor.active ? '#06b6d4' : '#475569'} 
                    strokeWidth="2" 
                    className="transition-all duration-300"
                  />

                  {/* Clamp Bolt Connectors */}
                  <line x1={sensor.x - 12} y1="18" x2={sensor.x - 12} y2="102" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1={sensor.x + 12} y1="18" x2={sensor.x + 12} y2="102" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Transducer Center Indicator Dot */}
                  <circle 
                    cx={sensor.x} 
                    cy="60" 
                    r={sensor.active ? "6" : "4"} 
                    fill={sensor.active ? "#22d3ee" : "#475569"} 
                    className={sensor.active ? "animate-ping" : ""}
                  />
                  <circle 
                    cx={sensor.x} 
                    cy="60" 
                    r="4" 
                    fill={sensor.active ? "#ffffff" : "#64748b"} 
                  />

                  {/* Acoustic Radar Sonar Pulse wave around active sensors */}
                  {sensor.active && (
                    <circle 
                      cx={sensor.x} 
                      cy="60" 
                      r="22" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="1.5" 
                      className="animate-ping opacity-30" 
                    />
                  )}

                  {/* Sensor Name Tag */}
                  <text 
                    x={sensor.x} 
                    y="118" 
                    textAnchor="middle" 
                    fill={sensor.active ? '#38bdf8' : '#64748b'} 
                    fontSize="10" 
                    fontFamily="monospace" 
                    fontWeight="bold"
                  >
                    {sensor.id}
                  </text>
                </g>
              ))}

              {/* Dynamic Soundwave traveling along the pipe */}
              {progress > 45 && (
                <path
                  d={`M 120 60 Q 220 ${45 + Math.sin(progress * 0.4) * 15} 320 60 Q 420 ${75 - Math.sin(progress * 0.4) * 15} 520 60 Q 610 ${48 + Math.cos(progress * 0.4) * 12} 700 60`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="opacity-90"
                />
              )}
            </svg>

            {/* Micro Live Waveform Oscilloscope at the bottom of the card */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">PZT CLAMP ARRAY:</span>
                <span className="text-cyan-400 font-bold">
                  {currentStep.sensorState.filter(Boolean).length}/4 SENSORS LOCKED
                </span>
              </div>
              <div className="font-mono text-cyan-300">
                TDOA FORMULA: X = (L - V·Δt) / 2
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Percentage & Dial */}
        <div className="w-full flex flex-col items-center text-center space-y-4">
          
          {/* Big High-Tech Percentage Counter */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 tracking-tight">
              {progress}
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400">
              %
            </span>
          </div>

          {/* Current Step Status Banner */}
          <div className="max-w-xl w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1.5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{currentStep.label}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {currentStep.sublabel}
            </p>
          </div>

          {/* Master Progress Bar */}
          <div className="w-full max-w-2xl bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight tip glow */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/60 blur-xs" />
            </div>
          </div>

          {/* Milestone Step Ticks */}
          <div className="w-full max-w-2xl flex justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>0% (IDLE)</span>
            <span>35% (PZT SENSORS)</span>
            <span>75% (TDOA MATH)</span>
            <span className="text-cyan-400 font-bold">100% (READY)</span>
          </div>
        </div>
      </main>

      {/* Bottom Footer Telemetry Badges */}
      <footer className="relative z-10 p-4 sm:p-6 border-t border-slate-800/80 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>INSPIRE-MANAK National Scheme</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <span>Project Lead: Affan Adil</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold">SPACE</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold">ENTER</kbd> to launch
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Launch PipeGuard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
