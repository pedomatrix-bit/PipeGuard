import React, { useState } from 'react';
import { Activity, Droplets, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PipeDiagram3DProps {
  isLeaking?: boolean;
  interactive?: boolean;
  onToggleLeak?: () => void;
}

export const PipeDiagram3D: React.FC<PipeDiagram3DProps> = ({
  isLeaking: controlledLeak = false,
  interactive = true,
  onToggleLeak,
}) => {
  const [internalLeak, setInternalLeak] = useState(false);
  const isLeaking = onToggleLeak ? controlledLeak : internalLeak;

  const handleToggle = () => {
    if (onToggleLeak) {
      onToggleLeak();
    } else {
      setInternalLeak(!internalLeak);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 overflow-hidden shadow-xl text-slate-100">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-tech-grid-dense opacity-20 pointer-events-none" />
      
      {/* Top Header info */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            TECHNICAL SCHEMATIC // EXTERNAL MOUNT
          </span>
        </div>
        
        {interactive && (
          <button
            onClick={handleToggle}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
              isLeaking
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isLeaking ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate Normal</span>
              </>
            ) : (
              <>
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate Hidden Leak</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] flex items-center justify-center">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pipe Metallic Gradient */}
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="30%" stopColor="#475569" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Water Core Gradient */}
            <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
            </linearGradient>

            {/* Sensor Housing Gradient */}
            <linearGradient id="sensorHousingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Acoustic Wave Radial */}
            <radialGradient id="acousticWaveGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isLeaking ? '#ef4444' : '#06b6d4'} stopOpacity="0.6" />
              <stop offset="70%" stopColor={isLeaking ? '#f97316' : '#0ea5e9'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={isLeaking ? '#ef4444' : '#0ea5e9'} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Technical Grid lines */}
          <g stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4">
            <line x1="50" y1="225" x2="750" y2="225" />
            <line x1="400" y1="50" x2="400" y2="400" />
            <line x1="600" y1="50" x2="600" y2="400" />
          </g>

          {/* MAIN PIPE CYLINDER */}
          <g id="main-pipe">
            {/* Outer Pipe Top Rim */}
            <rect x="60" y="195" width="680" height="70" rx="6" fill="url(#pipeGrad)" stroke="#64748b" strokeWidth="2" />

            {/* Inner Water Channel */}
            <rect x="62" y="207" width="676" height="46" fill="#0369a1" opacity="0.65" />

            {/* Water Flow Streamlines */}
            <path
              d="M 70 220 L 730 220"
              stroke="url(#waterFlowGrad)"
              strokeWidth="4"
              className={isLeaking ? "animate-water-flow-fast" : "animate-water-flow"}
            />
            <path
              d="M 70 230 L 730 230"
              stroke="#7dd3fc"
              strokeWidth="2.5"
              strokeDasharray="12 6"
              className="animate-water-flow"
            />
            <path
              d="M 70 240 L 730 240"
              stroke="url(#waterFlowGrad)"
              strokeWidth="3.5"
              className={isLeaking ? "animate-water-flow-fast" : "animate-water-flow"}
            />

            {/* Flow Direction Indicator */}
            <g transform="translate(100, 222)">
              <text x="0" y="5" fill="#e0f2fe" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                WATER FLOW →→→
              </text>
            </g>
          </g>

          {/* ACOUSTIC VIBRATION WAVES FROM PIPE TO SENSOR */}
          <g id="acoustic-waves" transform="translate(400, 195)">
            {isLeaking ? (
              // Intense turbulent vibrational rings
              <>
                <ellipse cx="0" cy="0" rx="35" ry="16" fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.8" className="animate-ping" />
                <ellipse cx="0" cy="-20" rx="50" ry="20" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.7" />
                <ellipse cx="0" cy="-45" rx="65" ry="24" fill="none" stroke="#eab308" strokeWidth="1.5" opacity="0.6" />
              </>
            ) : (
              // Gentle steady laminar baseline rings
              <>
                <ellipse cx="0" cy="0" rx="25" ry="10" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" />
                <ellipse cx="0" cy="-20" rx="40" ry="14" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
              </>
            )}
          </g>

          {/* PIPEGUARD SENSOR MOUNT (CLAMPED EXTERNALLY) */}
          <g id="pipeguard-sensor" transform="translate(340, 50)">
            {/* Clamp Ring Around Pipe */}
            <rect x="40" y="140" width="40" height="80" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" opacity="0.9" />
            <circle cx="50" cy="180" r="3" fill="#cbd5e1" />
            <circle cx="70" cy="180" r="3" fill="#cbd5e1" />

            {/* Acoustic Waveguide Shank */}
            <path d="M 54 90 L 66 90 L 63 145 L 57 145 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1" />

            {/* Sensor Main Enclosure Box */}
            <rect x="10" y="15" width="100" height="78" rx="8" fill="url(#sensorHousingGrad)" stroke="#38bdf8" strokeWidth="2" className="shadow-lg" />

            {/* Sensor Top Cap / Status Glow */}
            <rect x="25" y="6" width="70" height="9" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
            <circle cx="60" cy="10" r="3" fill={isLeaking ? "#ef4444" : "#10b981"} className="animate-pulse" />

            {/* Label inside Sensor */}
            <text x="60" y="38" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="Space Grotesk" fontWeight="bold" letterSpacing="1">
              PIPEGUARD
            </text>
            <text x="60" y="52" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              PIEZO SENSOR
            </text>
            
            {/* Internal Microcontroller / Transducer graphic */}
            <rect x="25" y="60" width="70" height="22" rx="4" fill="#020617" stroke="#334155" strokeWidth="1" />
            <text x="60" y="74" textAnchor="middle" fill={isLeaking ? "#f87171" : "#34d399"} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
              {isLeaking ? "DIFF: +28 (ALERT)" : "DIFF: +3 (NORMAL)"}
            </text>
          </g>

          {/* CALLOUT LABEL: CLAMP ON PIPE */}
          <g transform="translate(400, 20)">
            <line x1="0" y1="0" x2="0" y2="25" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="3" fill="#38bdf8" />
          </g>

          {/* HIDDEN LEAK AT ORIFICE (DOWNSTREAM TO THE RIGHT) */}
          <g id="leak-point" transform="translate(580, 260)">
            {isLeaking ? (
              <>
                {/* Crack fissure on bottom wall */}
                <path d="M -8 5 L 0 10 L 8 5" stroke="#ef4444" strokeWidth="3" fill="none" />
                
                {/* Turbulence Jet Spray */}
                <path
                  d="M 0 10 Q 20 40 40 70"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                  fill="none"
                  className="animate-water-flow-fast"
                />
                
                {/* Water Droplets escaping */}
                <g transform="translate(35, 60)">
                  <circle cx="0" cy="0" r="4" fill="#38bdf8" className="animate-bounce" />
                  <circle cx="10" cy="15" r="5" fill="#0284c7" />
                  <circle cx="-5" cy="20" r="3.5" fill="#7dd3fc" />
                </g>

                {/* Acoustic Emission radiating from leak */}
                <circle cx="0" cy="8" r="15" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" className="animate-ping" />
                <circle cx="0" cy="8" r="28" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="4 2" />

                {/* Annotation Box */}
                <g transform="translate(60, 40)">
                  <rect x="0" y="0" width="130" height="42" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="10" y="18" fill="#ef4444" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    💧 HIDDEN LEAK
                  </text>
                  <text x="10" y="32" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">
                    Turbulence Origin
                  </text>
                  <line x1="0" y1="21" x2="-20" y2="10" stroke="#ef4444" strokeWidth="1.5" />
                </g>
              </>
            ) : (
              // Normal intact pipe section
              <g transform="translate(40, 20)">
                <text x="0" y="0" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
                  [Intact Pipe Wall]
                </text>
              </g>
            )}
          </g>

          {/* NON-INVASIVE CALLOUT ANNOTATION */}
          <g transform="translate(180, 80)">
            <rect x="0" y="0" width="140" height="48" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="10" y="18" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
              NON-INVASIVE CLAMP
            </text>
            <text x="10" y="32" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              Zero water contact
            </text>
            <text x="10" y="42" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">
              External acoustic capture
            </text>
            <line x1="140" y1="24" x2="170" y2="40" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        </svg>
      </div>

      {/* Diagram Footer Specs */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-slate-400 text-[10px]">TRANSDUCTION</div>
            <div className="text-slate-200">Piezoelectric PZT</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-slate-400 text-[10px]">CURRENT STATE</div>
            <div className={isLeaking ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {isLeaking ? "Abnormal Turbulence" : "Laminar Baseline"}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-slate-400 text-[10px]">COUPLING METHOD</div>
            <div className="text-slate-200">Silicone Waveguide</div>
          </div>
        </div>
      </div>
    </div>
  );
};
