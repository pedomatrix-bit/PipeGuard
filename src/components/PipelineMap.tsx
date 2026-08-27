import React from 'react';
import { SensorNode, SimulationScenario } from '../types';
import { MapPin, AlertTriangle, CheckCircle2, Waves, Activity, Info } from 'lucide-react';

interface PipelineMapProps {
  sensors: SensorNode[];
  selectedSensorId: string;
  onSelectSensor: (sensorId: string) => void;
  scenario: SimulationScenario;
  onTriggerScenario?: (scenario: SimulationScenario) => void;
}

export const PipelineMap: React.FC<PipelineMapProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  scenario,
  onTriggerScenario,
}) => {
  const isLeakActive = scenario === 'small-leak' || scenario === 'large-leak';
  const isLargeLeak = scenario === 'large-leak';
  const isDisturbance = scenario === 'disturbance';

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 text-slate-100 shadow-xl overflow-hidden relative">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-tech-grid-dense opacity-15 pointer-events-none" />

      {/* Top Header & Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-display font-bold text-base text-white tracking-tight">
              PIPELINE NETWORK & LOCALIZATION MAP
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            4-Node Distributed Acoustic Sensing Array · 4.0-Meter Linear Lab Segment
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Normal
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Warning
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Leak Alert
          </span>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative z-10 my-6 w-full overflow-x-auto pb-4 pt-2">
        <div className="min-w-[680px] max-w-full mx-auto">
          <svg viewBox="0 0 820 260" className="w-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mapPipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>

              <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* WATER TANK (UPSTREAM SOURCE) */}
            <g transform="translate(40, 20)">
              {/* Tank Body */}
              <rect x="0" y="0" width="70" height="70" rx="8" fill="url(#tankGrad)" stroke="#0284c7" strokeWidth="2" />
              {/* Water Level in tank */}
              <rect x="3" y="25" width="64" height="42" rx="4" fill="#0369a1" opacity="0.8" />
              <path d="M 3 25 Q 20 22 35 25 T 67 25" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
              
              <text x="35" y="16" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                WATER TANK
              </text>
              <text x="35" y="50" textAnchor="middle" fill="#e0f2fe" fontSize="8" fontFamily="JetBrains Mono">
                Source 1.5 Bar
              </text>

              {/* Feed Line down to Pump */}
              <path d="M 35 70 L 35 110" stroke="#0ea5e9" strokeWidth="5" fill="none" />
              <polygon points="35,115 30,105 40,105" fill="#0ea5e9" />
            </g>

            {/* PUMP MODULE */}
            <g transform="translate(25, 120)">
              <circle cx="50" cy="20" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 40 20 L 60 20 M 50 10 L 50 30" stroke="#7dd3fc" strokeWidth="2" className="origin-[50px_20px] animate-spin" />
              <text x="50" y="48" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                PUMP
              </text>
            </g>

            {/* MAIN HORIZONTAL PIPELINE */}
            <g transform="translate(100, 125)">
              {/* Main Pipe Segment Tube */}
              <rect x="0" y="5" width="680" height="30" rx="4" fill="url(#mapPipeGrad)" stroke="#64748b" strokeWidth="1.5" />
              
              {/* Inner pressurized water core */}
              <rect x="2" y="10" width="676" height="20" fill="#0284c7" opacity="0.6" />
              
              {/* Animated Streamline */}
              <path
                d="M 5 20 L 675 20"
                stroke="#38bdf8"
                strokeWidth="2.5"
                className={isLeakActive ? "animate-water-flow-fast" : "animate-water-flow"}
              />

              {/* Linear Metric Ruler (0.0m to 4.0m) */}
              <g stroke="#475569" strokeWidth="1" opacity="0.8">
                <line x1="10" y1="38" x2="670" y2="38" />
                <line x1="10" y1="35" x2="10" y2="42" />
                <line x1="175" y1="35" x2="175" y2="42" />
                <line x1="340" y1="35" x2="340" y2="42" />
                <line x1="505" y1="35" x2="505" y2="42" />
                <line x1="670" y1="35" x2="670" y2="42" />
              </g>
              <g fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">
                <text x="10" y="52" textAnchor="middle">0.0m</text>
                <text x="175" y="52" textAnchor="middle">1.0m</text>
                <text x="340" y="52" textAnchor="middle">2.0m</text>
                <text x="505" y="52" textAnchor="middle">3.0m</text>
                <text x="670" y="52" textAnchor="middle">4.0m</text>
              </g>

              {/* SENSOR NODES (PG-01, PG-02, PG-03, PG-04) */}
              {sensors.map((sensor, idx) => {
                // X coordinates on pipe: 0.5m -> 92px, 1.5m -> 257px, 2.5m -> 422px, 3.5m -> 587px
                const xPositions = [92, 257, 422, 587];
                const x = xPositions[idx] || 100;
                const isSelected = selectedSensorId === sensor.id;
                const isWarning = sensor.status === 'warning';
                const isAlert = sensor.status === 'alert';

                let nodeFill = '#10b981'; // green
                let statusLabel = 'NORMAL';
                if (isAlert) {
                  nodeFill = '#ef4444'; // red
                  statusLabel = 'ALERT';
                } else if (isWarning) {
                  nodeFill = '#f59e0b'; // amber
                  statusLabel = 'WARNING';
                }

                return (
                  <g
                    key={sensor.id}
                    transform={`translate(${x}, 0)`}
                    className="cursor-pointer group"
                    onClick={() => onSelectSensor(sensor.id)}
                  >
                    {/* Top Mounting Stem */}
                    <line x1="0" y1="-28" x2="0" y2="5" stroke={isSelected ? "#38bdf8" : "#94a3b8"} strokeWidth="3" />

                    {/* Sensor Clamp Unit */}
                    <rect
                      x="-22"
                      y="-54"
                      width="44"
                      height="28"
                      rx="6"
                      fill={isSelected ? "#0f172a" : "#1e293b"}
                      stroke={isSelected ? "#38bdf8" : isAlert ? "#ef4444" : "#475569"}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      className="transition-transform group-hover:scale-105"
                    />

                    {/* Sensor ID Tag */}
                    <text
                      x="0"
                      y="-42"
                      textAnchor="middle"
                      fill={isSelected ? "#38bdf8" : "#f1f5f9"}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {sensor.id}
                    </text>
                    <text
                      x="0"
                      y="-31"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="7"
                      fontFamily="JetBrains Mono"
                    >
                      {sensor.positionMeters}m
                    </text>

                    {/* Status Circle Node Indicator on Pipe */}
                    <circle
                      cx="0"
                      cy="20"
                      r="9"
                      fill="#0f172a"
                      stroke={nodeFill}
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="0"
                      cy="20"
                      r="4.5"
                      fill={nodeFill}
                      className={isAlert ? "animate-ping" : ""}
                    />

                    {/* Bottom Status text */}
                    <g transform="translate(0, 75)">
                      <rect
                        x="-25"
                        y="0"
                        width="50"
                        height="18"
                        rx="4"
                        fill={isAlert ? "#450a0a" : isWarning ? "#451a03" : "#064e3b"}
                        stroke={isAlert ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981"}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fill={isAlert ? "#fca5a5" : isWarning ? "#fde68a" : "#6ee7b7"}
                        fontSize="8"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                      >
                        {statusLabel}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* SIMULATED LEAK POSITION OVERLAY (Between PG-02 and PG-03 around 2.1m -> ~360px) */}
              {isLeakActive && (
                <g transform="translate(365, 20)">
                  {/* Acoustic Turbulence Rings */}
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" className="animate-ping" />
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
                  <circle cx="0" cy="0" r="48" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                  {/* Water leakage spray */}
                  <path d="M 0 10 L 5 28 L -5 28 Z" fill="#38bdf8" className="animate-bounce" />

                  {/* Pinpoint Target Marker */}
                  <g transform="translate(0, 68)">
                    <rect x="-65" y="0" width="130" height="34" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="0" y="14" textAnchor="middle" fill="#fecaca" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      ↑ POSSIBLE LEAK
                    </text>
                    <text x="0" y="26" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="JetBrains Mono">
                      @ 2.2m (Between PG-02 &amp; PG-03)
                    </text>
                  </g>
                </g>
              )}

              {/* DISTURBANCE INDICATOR */}
              {isDisturbance && (
                <g transform="translate(257, 20)">
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" className="animate-ping" />
                  <g transform="translate(0, 68)">
                    <rect x="-55" y="0" width="110" height="30" rx="6" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="0" y="14" textAnchor="middle" fill="#bae6fd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                      TRANSIENT TAP
                    </text>
                    <text x="0" y="24" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontFamily="JetBrains Mono">
                      Filtered Out (&lt;0.8s)
                    </text>
                  </g>
                </g>
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Sensor Quick Telemetry Drawer */}
      {(() => {
        const activeSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];
        return (
          <div className="relative z-10 bg-slate-950/80 rounded-xl border border-slate-800 p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <div className="text-slate-500 text-[10px]">INSPECTING NODE</div>
              <div className="text-cyan-400 font-bold text-sm">
                {activeSensor.id} ({activeSensor.positionMeters}m)
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px]">CURRENT VIBRATION</div>
              <div className="text-slate-200 font-bold text-sm">
                {activeSensor.vibration} units
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px]">BASELINE DEVIATION</div>
              <div
                className={`font-bold text-sm ${
                  activeSensor.difference > 15
                    ? 'text-red-400'
                    : activeSensor.difference > 5
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {activeSensor.difference >= 0 ? `+${activeSensor.difference}` : activeSensor.difference} units
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px]">STATUS EVALUATION</div>
              <div
                className={`font-bold uppercase ${
                  activeSensor.status === 'alert'
                    ? 'text-red-400'
                    : activeSensor.status === 'warning'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {activeSensor.status}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
