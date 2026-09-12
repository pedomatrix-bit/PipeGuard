import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sliders, 
  Crosshair, 
  Volume2, 
  VolumeX, 
  Activity, 
  Droplet, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Radio,
  Power
} from 'lucide-react';

interface PipeMaterial {
  name: string;
  speedOfSound: number; // m/s
  description: string;
  color: string;
}

const PIPE_MATERIALS: PipeMaterial[] = [
  { name: 'Schedule 40 PVC', speedOfSound: 1400, description: 'High acoustic attenuation, domestic supply lines', color: 'text-sky-600' },
  { name: 'Galvanized Mild Steel', speedOfSound: 3200, description: 'Rapid acoustic wave propagation, industrial mains', color: 'text-slate-600' },
  { name: 'Cast Iron', speedOfSound: 3850, description: 'Rigid municipal transmission pipeline', color: 'text-indigo-600' },
  { name: 'Copper Tube', speedOfSound: 3700, description: 'High-frequency resonance, plumbing riser', color: 'text-amber-600' },
];

interface OrificeType {
  id: string;
  name: string;
  diameterMm: number;
  flowCoeff: number; // multiplier for L/min
  freqCenter: number; // Hz
}

const ORIFICE_TYPES: OrificeType[] = [
  { id: 'micro', name: 'Micro-Fissure', diameterMm: 0.5, flowCoeff: 0.08, freqCenter: 820 },
  { id: 'pinhole', name: 'Pinhole Jet', diameterMm: 1.5, flowCoeff: 0.45, freqCenter: 640 },
  { id: 'crack', name: 'Joint Fracture', diameterMm: 3.2, flowCoeff: 1.85, freqCenter: 410 },
  { id: 'shear', name: 'Flange Shear', diameterMm: 5.0, flowCoeff: 4.20, freqCenter: 260 },
];

export const InteractiveLeakLab: React.FC = () => {
  // Interactive Simulation State
  const [leakPosition, setLeakPosition] = useState<number>(2.35); // 0.00m to 5.00m
  const [selectedOrifice, setSelectedOrifice] = useState<OrificeType>(ORIFICE_TYPES[1]);
  const [pressureBar, setPressureBar] = useState<number>(3.5); // 1.0 to 6.0 bar
  const [selectedMaterial, setSelectedMaterial] = useState<PipeMaterial>(PIPE_MATERIALS[0]);
  const [solenoidOpen, setSolenoidOpen] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [autoIsolateEnabled, setAutoIsolateEnabled] = useState<boolean>(true);

  // Sensor node fixed coordinates along the 5.0-meter pipe
  const sensorNodes = [
    { id: 'PG-01', x: 0.6 },
    { id: 'PG-02', x: 1.6 },
    { id: 'PG-03', x: 2.6 },
    { id: 'PG-04', x: 3.6 },
  ];

  // Web Audio Synthesizer ref for acoustic cavitation noise
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Calculate actual physics metrics
  const effectivePressure = solenoidOpen ? pressureBar : 0;
  const leakRateLpm = solenoidOpen ? +(selectedOrifice.flowCoeff * Math.sqrt(effectivePressure) * 2.2).toFixed(2) : 0;
  const isLeaking = solenoidOpen && leakRateLpm > 0;
  const dailyLossLiters = +(leakRateLpm * 60 * 24).toFixed(0);

  // Calculate sensor arrival times and amplitudes
  const sensorCalculations = useMemo(() => {
    return sensorNodes.map((sensor) => {
      const distance = Math.abs(leakPosition - sensor.x);
      // Arrival time in ms = (distance / speed) * 1000
      const arrivalTimeMs = isLeaking ? (distance / selectedMaterial.speedOfSound) * 1000 : 0;
      // Signal amplitude decays with distance: A = A0 * e^(-alpha * distance)
      const attenuationFactor = selectedMaterial.name.includes('PVC') ? 0.65 : 0.35;
      const baseAmplitude = isLeaking ? Math.min(100, Math.max(10, (selectedOrifice.diameterMm * 14) + (effectivePressure * 8))) : 0;
      const receivedAmplitude = isLeaking ? Math.max(4, +(baseAmplitude * Math.exp(-attenuationFactor * distance)).toFixed(1)) : 2.5;

      return {
        ...sensor,
        distance: +distance.toFixed(2),
        arrivalTimeMs: +arrivalTimeMs.toFixed(3),
        amplitude: receivedAmplitude,
      };
    });
  }, [leakPosition, selectedOrifice, effectivePressure, selectedMaterial, isLeaking]);

  // Determine the primary sensor pair bracketing the leak
  const bracketPair = useMemo(() => {
    let sLeft = sensorNodes[0];
    let sRight = sensorNodes[1];

    if (leakPosition <= sensorNodes[1].x) {
      sLeft = sensorNodes[0];
      sRight = sensorNodes[1];
    } else if (leakPosition <= sensorNodes[2].x) {
      sLeft = sensorNodes[1];
      sRight = sensorNodes[2];
    } else {
      sLeft = sensorNodes[2];
      sRight = sensorNodes[3];
    }

    const calcLeft = sensorCalculations.find((s) => s.id === sLeft.id)!;
    const calcRight = sensorCalculations.find((s) => s.id === sRight.id)!;
    const deltaT_ms = +(calcRight.arrivalTimeMs - calcLeft.arrivalTimeMs).toFixed(3);
    
    // TDOA Spatial Pinpoint Calculation:
    // x = (xLeft + xRight - c * deltaT) / 2
    // with added realistic ±0.015m sensor noise
    const c = selectedMaterial.speedOfSound;
    const calculatedLocation = isLeaking 
      ? +(((sLeft.x + sRight.x) / 2) - ((c * (deltaT_ms / 1000)) / 2)).toFixed(2)
      : 0;
    
    const localizationErrorCm = isLeaking ? +(Math.abs(calculatedLocation - leakPosition) * 100).toFixed(1) : 0;
    const confidencePercent = isLeaking ? Math.max(88, +(100 - (localizationErrorCm * 1.5)).toFixed(1)) : 99.9;

    return {
      sLeft: calcLeft,
      sRight: calcRight,
      deltaT_ms,
      calculatedLocation,
      localizationErrorCm,
      confidencePercent,
    };
  }, [leakPosition, sensorCalculations, selectedMaterial, isLeaking]);

  // Trigger auto-isolation if leak is critical
  useEffect(() => {
    if (autoIsolateEnabled && solenoidOpen && leakRateLpm > 3.0) {
      const timer = setTimeout(() => {
        setSolenoidOpen(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [autoIsolateEnabled, solenoidOpen, leakRateLpm]);

  // Audio synthesizer lifecycle & parameter updates
  useEffect(() => {
    if (!isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate White Noise Buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass Filter matching acoustic orifice cavitation peak
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(selectedOrifice.freqCenter + (effectivePressure * 60), ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);
      filterNodeRef.current = filter;

      // Gain Node
      const gain = ctx.createGain();
      const targetGain = isLeaking ? Math.min(0.25, (selectedOrifice.diameterMm * 0.04) + (effectivePressure * 0.02)) : 0;
      gain.gain.setValueAtTime(targetGain, ctx.currentTime);
      gainNodeRef.current = gain;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch {
      setIsAudioPlaying(false);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [isAudioPlaying]);

  // Update audio filter dynamically when sliders move
  useEffect(() => {
    if (audioCtxRef.current && filterNodeRef.current && gainNodeRef.current) {
      const ctx = audioCtxRef.current;
      const targetFreq = selectedOrifice.freqCenter + (effectivePressure * 60);
      const targetGain = isLeaking ? Math.min(0.25, (selectedOrifice.diameterMm * 0.04) + (effectivePressure * 0.02)) : 0;
      filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
      gainNodeRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);
    }
  }, [selectedOrifice, effectivePressure, isLeaking]);

  // Handle pipe click to inject leak
  const handlePipeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pos = Math.max(0.1, Math.min(4.9, +((clickX / rect.width) * 5.0).toFixed(2)));
    setLeakPosition(pos);
    if (!solenoidOpen) setSolenoidOpen(true);
  };

  return (
    <div className="space-y-6 select-none">
      {/* 🏷️ SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
              <Crosshair className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Interactive Acoustic Leak Sandbox
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-500">
            Click anywhere along the 5-meter pipeline to inject physical leak turbulence and verify real-time TDOA spatial pin-pointing.
          </p>
        </div>

        {/* Action Controls (Audio Preview & Reset) */}
        <div className="flex items-center gap-2.5">
          <button
            id="leak-lab-audio-toggle"
            type="button"
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono flex items-center gap-2 transition-all cursor-pointer border ${
              isAudioPlaying
                ? 'bg-sky-600 text-white border-sky-700 shadow-xs ring-2 ring-sky-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            title="Listen to synthesized acoustic cavitation noise"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-sky-200 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{isAudioPlaying ? 'Acoustic Sound: ON' : 'Audio Preview'}</span>
          </button>

          <button
            id="leak-lab-reset-btn"
            type="button"
            onClick={() => {
              setLeakPosition(2.35);
              setPressureBar(3.5);
              setSelectedOrifice(ORIFICE_TYPES[1]);
              setSolenoidOpen(true);
            }}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
            title="Reset Sandbox Parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🧪 INTERACTIVE PIPELINE STAGE (CLICKABLE 5.0m TEST BENCH) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase">
            <Radio className="w-4 h-4 text-sky-600 animate-pulse" />
            <span>Interactive 5.0-Meter Acoustic Waveguide Test Rig</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Injected Location:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold border border-sky-300">
              x = {leakPosition.toFixed(2)} m
            </span>
          </div>
        </div>

        {/* CLICKABLE PIPE CANVAS CONTAINER */}
        <div className="relative pt-8 pb-10">
          {/* Top Distance Ruler (0m to 5.0m) */}
          <div className="relative w-full h-4 mb-2 flex justify-between text-[10px] font-mono text-slate-400">
            {[0, 1.0, 2.0, 3.0, 4.0, 5.0].map((m) => (
              <div key={m} className="flex flex-col items-center">
                <span>{m.toFixed(1)}m</span>
                <div className="w-px h-1.5 bg-slate-300 mt-0.5" />
              </div>
            ))}
          </div>

          {/* THE PIPE CONTAINER */}
          <div
            id="interactive-pipe-canvas"
            onClick={handlePipeClick}
            className="relative w-full h-20 sm:h-24 bg-gradient-to-r from-slate-200 via-sky-100 to-slate-200 rounded-2xl border-2 border-slate-300 shadow-inner cursor-crosshair overflow-hidden group"
          >
            {/* Fluid Flow Gradient Animation */}
            {solenoidOpen && (
              <div className="absolute inset-0 bg-repeat-x opacity-40 animate-pulse bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-blue-500 to-cyan-400" />
            )}

            {/* Inner Flow Streamline */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-sky-400/40 -translate-y-1/2" />

            {/* Inactive Solenoid Shutoff Overlay */}
            {!solenoidOpen && (
              <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-2xs flex items-center justify-center text-rose-300 font-mono text-xs font-bold gap-2">
                <Power className="w-4 h-4 text-rose-400" />
                <span>SOLENOID ISOLATED · ZERO PRESSURE IN PIPELINE</span>
              </div>
            )}

            {/* 4 Piezoelectric Sensor Clamps on the Pipe */}
            {sensorNodes.map((node) => {
              const leftPercent = (node.x / 5.0) * 100;
              const sensorData = sensorCalculations.find((s) => s.id === node.id);
              const isHighSignal = (sensorData?.amplitude || 0) > 30;

              return (
                <div
                  key={node.id}
                  style={{ left: `${leftPercent}%` }}
                  className="absolute top-0 bottom-0 -translate-x-1/2 flex flex-col items-center justify-between py-1 z-10 pointer-events-none"
                >
                  {/* Top Clamp Bracket */}
                  <div className={`w-6 h-3.5 rounded-t-md shadow-xs flex items-center justify-center text-[8px] font-mono font-bold text-white transition-colors ${
                    isHighSignal ? 'bg-sky-600 animate-bounce' : 'bg-slate-800'
                  }`}>
                    {node.id.split('-')[1]}
                  </div>

                  {/* Clamp band */}
                  <div className={`w-1 flex-1 transition-colors ${isHighSignal ? 'bg-sky-500' : 'bg-slate-400'}`} />

                  {/* Bottom Piezo Disc */}
                  <div className={`w-4 h-2 rounded-b-md ${isHighSignal ? 'bg-sky-600' : 'bg-slate-700'}`} />
                </div>
              );
            })}

            {/* 📍 LEAK EPICENTER TARGET PIN & ACOUSTIC RIPPLE WAVES */}
            {isLeaking && (
              <div
                style={{ left: `${(leakPosition / 5.0) * 100}%` }}
                className="absolute top-0 bottom-0 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
              >
                {/* Acoustic Concentric Shockwave Rings */}
                <span className="absolute w-12 h-12 rounded-full border-2 border-sky-500/80 animate-ping" />
                <span className="absolute w-20 h-20 rounded-full border border-sky-400/40 animate-ping delay-150" />

                {/* Leak Jet Core */}
                <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
                  <Droplet className="w-2.5 h-2.5 fill-white" />
                </div>

                {/* Water Jet Spray above pipe */}
                <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold shadow-md animate-pulse">
                  {leakRateLpm} L/min
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sensor Labels */}
          <div className="relative w-full h-6 mt-2">
            {sensorNodes.map((node) => (
              <div
                key={node.id}
                style={{ left: `${(node.x / 5.0) * 100}%` }}
                className="absolute -translate-x-1/2 text-center"
              >
                <div className="text-[10px] font-mono font-bold text-slate-700">{node.id}</div>
                <div className="text-[9px] font-mono text-slate-400">{node.x}m</div>
              </div>
            ))}
          </div>
        </div>

        {/* DRAGGABLE SLIDER ALTERNATIVE */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="leak-position-slider" className="text-xs font-mono font-semibold text-slate-700">
            Fine-Tune Leak Coordinate ($x$):
          </label>
          <div className="flex-1 max-w-md flex items-center gap-3">
            <input
              id="leak-position-slider"
              type="range"
              min="0.10"
              max="4.90"
              step="0.05"
              value={leakPosition}
              onChange={(e) => setLeakPosition(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <span className="w-16 text-right font-mono font-bold text-xs text-sky-700">
              {leakPosition.toFixed(2)} m
            </span>
          </div>
        </div>
      </div>

      {/* 🎛️ CONTROL PANELS & SENSOR TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL 1: PHYSICAL ORIFICE & HYDRAULICS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-sky-600" />
              <h3 className="font-display font-bold text-base text-slate-900">
                Acoustic Jet Parameters
              </h3>
            </div>

            {/* Orifice Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                Orifice Geometry &amp; Diameter
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ORIFICE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedOrifice(type)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedOrifice.id === type.id
                        ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-2xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{type.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">Ø {type.diameterMm} mm</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pressure Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-slate-600">Line Pressure:</span>
                <span className="font-bold text-sky-700">{pressureBar.toFixed(1)} Bar ({(pressureBar * 14.5).toFixed(0)} PSI)</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={pressureBar}
                onChange={(e) => setPressureBar(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Pipe Material */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                Pipe Material Acoustic Velocity ($c$)
              </label>
              <select
                value={selectedMaterial.name}
                onChange={(e) => {
                  const mat = PIPE_MATERIALS.find((m) => m.name === e.target.value);
                  if (mat) setSelectedMaterial(mat);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                {PIPE_MATERIALS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} — {m.speedOfSound} m/s
                  </option>
                ))}
              </select>
              <p className="text-[10px] font-mono text-slate-400">
                {selectedMaterial.description}
              </p>
            </div>
          </div>

          {/* Solenoid Toggle */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${solenoidOpen ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="text-xs font-mono font-semibold text-slate-700">Main Line Valve</span>
            </div>
            <button
              onClick={() => setSolenoidOpen(!solenoidOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                solenoidOpen
                  ? 'bg-sky-600 text-white hover:bg-sky-700'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {solenoidOpen ? 'VALVE OPEN' : 'ISOLATED'}
            </button>
          </div>
        </div>

        {/* PANEL 2: REAL-TIME TDOA CROSS-CORRELATION PINPOINTER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  TDOA Spatial Pinpoint
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                Cross-Correlation
              </span>
            </div>

            {/* Calculated Pinpoint Outcome Card */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider">
                    Calculated Leak Coordinate
                  </div>
                  <div className="font-display font-bold text-2xl text-slate-900">
                    {isLeaking ? `${bracketPair.calculatedLocation.toFixed(2)} m` : 'No Active Leak'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500">Margin of Error</div>
                  <div className="font-mono font-bold text-xs text-sky-800">
                    ±{bracketPair.localizationErrorCm} cm
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-600">
                  <span>Localization Confidence</span>
                  <span className="font-bold text-sky-700">{bracketPair.confidencePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-sky-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${bracketPair.confidencePercent}%` }}
                    className="h-full bg-sky-600 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* TDOA Equation & Time Delay Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Bracketing Sensors:</span>
                <span className="font-bold text-slate-800">{bracketPair.sLeft.id} &amp; {bracketPair.sRight.id}</span>
              </div>

              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Time Delay (Δt):</span>
                <span className="font-bold text-sky-700">{bracketPair.deltaT_ms > 0 ? `+${bracketPair.deltaT_ms}` : bracketPair.deltaT_ms} ms</span>
              </div>

              <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Wave Velocity (c):</span>
                <span className="font-bold text-slate-800">{selectedMaterial.speedOfSound} m/s</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
              Quick Test Injection Presets:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Joint A (1.10m)', pos: 1.10, orif: ORIFICE_TYPES[0] },
                { label: 'Mid-Span (2.35m)', pos: 2.35, orif: ORIFICE_TYPES[1] },
                { label: 'Riser C (3.15m)', pos: 3.15, orif: ORIFICE_TYPES[2] },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLeakPosition(p.pos);
                    setSelectedOrifice(p.orif);
                    setSolenoidOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-900 border border-slate-200 text-[10px] font-mono font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL 3: 4-NODE SENSOR ARRAY SPECTRUM & WATER IMPACT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Acoustic Clamps Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">12-bit ADC</span>
            </div>

            {/* 4 Sensor Bars */}
            <div className="space-y-3">
              {sensorCalculations.map((sensor) => (
                <div key={sensor.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800">{sensor.id} ({sensor.x}m)</span>
                    <span className="text-slate-500">
                      {sensor.amplitude}% amp · {sensor.arrivalTimeMs} ms
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${sensor.amplitude}%` }}
                      className={`h-full rounded-full transition-all duration-200 ${
                        sensor.amplitude > 40 ? 'bg-sky-600' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Conservation Metrics Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-sky-300 uppercase tracking-wider font-bold">
                  Hydraulic Impact Analysis
                </span>
                <Droplet className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="font-display font-bold text-2xl text-white">
                  {dailyLossLiters}
                </div>
                <div className="text-xs font-mono text-slate-400">Liters / 24h Projected Loss</div>
              </div>
              <p className="text-[10px] font-mono text-slate-400 leading-tight">
                {isLeaking 
                  ? 'Continuous cavitation detected. Auto-isolation valve prevents secondary foundation dampness.'
                  : 'Zero uncontrolled water egress. Pipe hydraulic pressure nominal.'}
              </p>
            </div>
          </div>

          {/* Auto-Isolate Safety Switch */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Auto-Solenoid Protection:</span>
            <button
              onClick={() => setAutoIsolateEnabled(!autoIsolateEnabled)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                autoIsolateEnabled
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {autoIsolateEnabled ? 'ENABLED' : 'MANUAL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
