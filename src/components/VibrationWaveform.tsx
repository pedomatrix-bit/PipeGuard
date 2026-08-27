import React, { useEffect, useRef, useState } from 'react';
import { SensorNode, SimulationScenario } from '../types';
import { Play, Pause, Activity, RefreshCw, ZoomIn } from 'lucide-react';

interface VibrationWaveformProps {
  sensors: SensorNode[];
  selectedSensorId: string;
  scenario: SimulationScenario;
  onSelectSensor: (sensorId: string) => void;
}

export const VibrationWaveform: React.FC<VibrationWaveformProps> = ({
  sensors,
  selectedSensorId,
  scenario,
  onSelectSensor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChannel, setActiveChannel] = useState<string>(selectedSensorId);

  useEffect(() => {
    setActiveChannel(selectedSensorId);
  }, [selectedSensorId]);

  // Keep a buffer of historical points for waveform rendering
  const historyRef = useRef<number[]>(Array(100).fill(39));
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      if (isPlaying) {
        tick++;
        const currentSensor = sensors.find((s) => s.id === activeChannel) || sensors[0];
        const base = currentSensor.baseline; // e.g. 39
        const isAlert = currentSensor.status === 'alert';
        const isWarning = currentSensor.status === 'warning';

        // Generate synthetic realistic acoustic vibration signal based on scenario and state
        let sample = base;
        if (isAlert) {
          // Intense acoustic turbulence
          const turbulence = Math.sin(tick * 0.4) * 18 + Math.cos(tick * 0.9) * 12 + (Math.random() - 0.5) * 14;
          sample = base + Math.abs(currentSensor.difference) + turbulence;
        } else if (isWarning) {
          // Moderate micro-leak turbulence
          const turbulence = Math.sin(tick * 0.3) * 8 + (Math.random() - 0.5) * 6;
          sample = base + Math.abs(currentSensor.difference) + turbulence;
        } else if (scenario === 'disturbance' && activeChannel === 'PG-02') {
          // Periodic disturbance spike
          const spike = Math.sin(tick * 0.1) > 0.85 ? 35 * Math.random() : (Math.random() - 0.5) * 3;
          sample = base + spike;
        } else {
          // Normal Gaussian laminar pipe hum
          const laminar = Math.sin(tick * 0.15) * 1.5 + (Math.random() - 0.5) * 3.5;
          sample = base + laminar;
        }

        // Push into buffer
        historyRef.current.push(sample);
        if (historyRef.current.length > 120) {
          historyRef.current.shift();
        }
      }

      // Drawing routine
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const gridSpacingY = height / 5;
      for (let y = 0; y < height; y += gridSpacingY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const gridSpacingX = width / 8;
      for (let x = 0; x < width; x += gridSpacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Baseline reference line (e.g. 39 units mapped to canvas)
      const currentSensor = sensors.find((s) => s.id === activeChannel) || sensors[0];
      const maxRange = 100;
      const minRange = 10;
      const getY = (val: number) => height - ((val - minRange) / (maxRange - minRange)) * height;

      const baselineY = getY(currentSensor.baseline);
      ctx.strokeStyle = '#06b6d4'; // Cyan baseline
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, baselineY);
      ctx.lineTo(width, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Baseline text tag
      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`Baseline: ${currentSensor.baseline}u`, 10, baselineY - 4);

      // Warning threshold line
      const thresholdY = getY(currentSensor.baseline + 15);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, thresholdY);
      ctx.lineTo(width, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.fillText(`Alert Threshold: ${currentSensor.baseline + 15}u`, width - 140, thresholdY - 4);

      // Main Live Waveform Path
      const data = historyRef.current;
      const step = width / (data.length - 1);

      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = i * step;
        const y = getY(data[i]);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Wave styling based on alert status
      if (currentSensor.status === 'alert') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
      } else if (currentSensor.status === 'warning') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
      } else {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 4;
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Draw subtle gradient fill under wave
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (currentSensor.status === 'alert') {
        fillGrad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
        fillGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
      } else {
        fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
        fillGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      }
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Current real-time pulse bead at the head of the wave
      const lastX = (data.length - 1) * step;
      const lastY = getY(data[data.length - 1]);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
      ctx.fillStyle = currentSensor.status === 'alert' ? '#ef4444' : '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, activeChannel, sensors, scenario]);

  const activeSensor = sensors.find((s) => s.id === activeChannel) || sensors[0];

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 text-slate-100 shadow-xl overflow-hidden">
      {/* Top Waveform Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="font-display font-bold text-sm text-white tracking-tight">
              LIVE VIBRATION SIGNATURE · OSCILLOSCOPE
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Acoustic Emission Amplitude vs Time (Real-Time 50Hz Sampling)
            </p>
          </div>
        </div>

        {/* Controls & Channel Selectors */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {sensors.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveChannel(s.id);
                  onSelectSensor(s.id);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeChannel === s.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 ${
              isPlaying
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
            title={isPlaying ? 'Pause Waveform' : 'Resume Live Stream'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Display */}
      <div className="relative my-4 w-full h-[220px] bg-slate-950 rounded-xl border border-slate-800/90 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={700}
          height={220}
          className="w-full h-full block"
        />

        {/* Real-time Watermark & Status Pill */}
        <div className="absolute top-2.5 left-3 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
            CHANNEL: {activeSensor.id} ({activeSensor.location})
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              activeSensor.status === 'alert'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : activeSensor.status === 'warning'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {activeSensor.status.toUpperCase()}
          </span>
        </div>

        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
          TIME DOMAIN (WINDOW: 2.0s)
        </div>
      </div>

      {/* Numerical Metrics Readout Under Graph */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500 text-[10px]">CURRENT READING</div>
          <div className="text-slate-100 font-bold text-sm">
            {activeSensor.vibration} units
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500 text-[10px]">NORMAL BASELINE</div>
          <div className="text-slate-300 font-bold text-sm">
            {activeSensor.baseline} units
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500 text-[10px]">DIFFERENCE (Δ)</div>
          <div
            className={`font-bold text-sm ${
              activeSensor.difference > 15
                ? 'text-red-400'
                : activeSensor.difference > 5
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {activeSensor.difference >= 0 ? `+${activeSensor.difference}` : activeSensor.difference}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-500 text-[10px]">PEAK FREQUENCY</div>
          <div className="text-cyan-400 font-bold text-sm">
            {activeSensor.frequencyPeakHz} Hz
          </div>
        </div>
      </div>
    </div>
  );
};
