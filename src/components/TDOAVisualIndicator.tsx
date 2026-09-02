import React, { useState, useMemo } from 'react';
import { SensorNode, SimulationScenario } from '../types';
import { 
  Activity, 
  Clock, 
  Waves, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Gauge,
  Sparkles,
  Zap
} from 'lucide-react';

interface TDOAVisualIndicatorProps {
  sensors: SensorNode[];
  scenario: SimulationScenario;
  onSelectScenario?: (scenario: SimulationScenario) => void;
  speedOfSound?: number; // m/s (default 1350 m/s for water in PVC/GI)
}

export const TDOAVisualIndicator: React.FC<TDOAVisualIndicatorProps> = ({
  sensors,
  scenario,
  onSelectScenario,
  speedOfSound = 1350,
}) => {
  // Sensor selection for TDOA cross-correlation comparison
  const [sensorAId, setSensorAId] = useState<string>('PG-02');
  const [sensorBId, setSensorBId] = useState<string>('PG-03');

  const isLeakActive = scenario === 'small-leak' || scenario === 'large-leak';
  const isLargeLeak = scenario === 'large-leak';

  // Simulated physical leak position in the 4-meter pipeline segment
  // Leak is localized at 2.20 meters (between PG-02 at 1.5m and PG-03 at 2.5m)
  const leakPos = 2.20;

  const sensorA = useMemo(() => sensors.find((s) => s.id === sensorAId) || sensors[1] || sensors[0], [sensors, sensorAId]);
  const sensorB = useMemo(() => sensors.find((s) => s.id === sensorBId) || sensors[2] || sensors[1], [sensors, sensorBId]);

  // Calculate physical distances and acoustic travel times in milliseconds
  const tdoaData = useMemo(() => {
    const distA = Math.abs(leakPos - sensorA.positionMeters);
    const distB = Math.abs(leakPos - sensorB.positionMeters);

    // Travel time t = (distance / speedOfSound) * 1000 ms
    const timeA_ms = isLeakActive ? (distA / speedOfSound) * 1000 : 0;
    const timeB_ms = isLeakActive ? (distB / speedOfSound) * 1000 : 0;

    // Time Difference of Arrival delta T = tB - tA
    const deltaT_ms = isLeakActive ? +(timeB_ms - timeA_ms).toFixed(4) : 0;
    const absDeltaT_ms = Math.abs(deltaT_ms);

    // Calculated leak position from TDOA formula: x = (xA + xB - c * deltaT) / 2
    const calculatedPos = isLeakActive
      ? +(((sensorA.positionMeters + sensorB.positionMeters) / 2) - ((speedOfSound * (deltaT_ms / 1000)) / 2)).toFixed(2)
      : 0;

    const firstSensor = timeA_ms <= timeB_ms ? sensorA : sensorB;
    const secondSensor = timeA_ms <= timeB_ms ? sensorB : sensorA;
    const pathDifferenceMeters = Math.abs(distB - distA);

    return {
      distA: +distA.toFixed(2),
      distB: +distB.toFixed(2),
      timeA_ms: +timeA_ms.toFixed(3),
      timeB_ms: +timeB_ms.toFixed(3),
      deltaT_ms,
      absDeltaT_ms: +absDeltaT_ms.toFixed(3),
      calculatedPos,
      firstSensor,
      secondSensor,
      pathDifferenceMeters: +pathDifferenceMeters.toFixed(2),
    };
  }, [sensorA, sensorB, isLeakActive, speedOfSound, leakPos]);

  return (
    <div className={`w-full rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs ${
      isLeakActive
        ? isLargeLeak 
          ? 'bg-gradient-to-br from-rose-50/90 via-white to-sky-50/70 border-rose-200'
          : 'bg-gradient-to-br from-amber-50/90 via-white to-sky-50/70 border-amber-200'
        : 'bg-white border-slate-200'
    }`}>
      {/* Top Header Banner */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLeakActive ? (isLargeLeak ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700') : 'bg-sky-100 text-sky-700'
            }`}>
              <Waves className={`w-4 h-4 ${isLeakActive ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider">
                ACOUSTIC TDOA CROSS-CORRELATION ENGINE
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                Time Difference of Arrival (TDOA) Indicator
              </h3>
            </div>
          </div>
          <p className="text-xs font-mono text-slate-500">
            Real-time acoustic wave arrival lag (Δt) calculated across selected sensor node pairs.
          </p>
        </div>

        {/* Status Pill & Quick Scenario Trigger */}
        <div className="flex items-center gap-2">
          {isLeakActive ? (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
              isLargeLeak 
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isLargeLeak ? 'bg-rose-500' : 'bg-amber-500'}`} />
              <span>LEAK ACTIVE · TDOA SYNCED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>NO LEAK DELTA</span>
              </span>
              {onSelectScenario && (
                <button
                  type="button"
                  onClick={() => onSelectScenario('small-leak')}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-mono font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Test Leak Scenario
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Sensor Node Pair Selector Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          
          {/* Sensor A Picker */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-500 uppercase flex items-center justify-between">
              <span>Primary Node (Sensor A)</span>
              <span className="text-sky-700 font-bold">{sensorA.positionMeters}m</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {sensors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSensorAId(s.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    sensorA.id === s.id
                      ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>

          {/* Center VS / Sound Speed Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-1 py-1">
            <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
              PROPAGATION MEDIUM VELOCITY
            </div>
            <div className="px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono text-xs font-bold text-slate-800">
              v = {speedOfSound} m/s (Water in Pipe Wall)
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Inter-Sensor Span: {Math.abs(sensorB.positionMeters - sensorA.positionMeters).toFixed(2)} m
            </div>
          </div>

          {/* Sensor B Picker */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-500 uppercase flex items-center justify-between">
              <span>Secondary Node (Sensor B)</span>
              <span className="text-sky-700 font-bold">{sensorB.positionMeters}m</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {sensors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSensorBId(s.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    sensorB.id === s.id
                      ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🌟 HIGHLIGHT METRIC: CALCULATED TDOA IN MILLISECONDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main TDOA Delta Card */}
          <div className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden flex flex-col justify-between ${
            isLeakActive 
              ? 'bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800' 
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                  TIME DIFFERENCE OF ARRIVAL (TDOA)
                </span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>

              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {isLeakActive ? `${tdoaData.deltaT_ms > 0 ? '+' : ''}${tdoaData.deltaT_ms}` : '0.000'}
                </span>
                <span className="font-mono text-base font-semibold text-sky-300">
                  ms
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 mt-2">
              {isLeakActive ? (
                <span>
                  Acoustic wavefront arrives at <strong className="text-sky-300">{tdoaData.firstSensor.id}</strong> first, followed by <strong className="text-sky-300">{tdoaData.secondSensor.id}</strong> (+{tdoaData.absDeltaT_ms} ms delay).
                </span>
              ) : (
                <span>No active pressure wave gradient across selected sensor pair.</span>
              )}
            </div>
          </div>

          {/* Sensor A Arrival Metric */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {sensorA.id} TRANSIT TIME (t_A)
                </span>
                <span className="text-xs font-mono font-bold text-sky-700">@ {sensorA.positionMeters}m</span>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {isLeakActive ? tdoaData.timeA_ms.toFixed(3) : '0.000'}
                </span>
                <span className="font-mono text-sm text-slate-500">ms</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Distance to leak:</span>
              <span className="font-bold text-slate-800">{isLeakActive ? `${tdoaData.distA} m` : '—'}</span>
            </div>
          </div>

          {/* Sensor B Arrival Metric */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {sensorB.id} TRANSIT TIME (t_B)
                </span>
                <span className="text-xs font-mono font-bold text-sky-700">@ {sensorB.positionMeters}m</span>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {isLeakActive ? tdoaData.timeB_ms.toFixed(3) : '0.000'}
                </span>
                <span className="font-mono text-sm text-slate-500">ms</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Distance to leak:</span>
              <span className="font-bold text-slate-800">{isLeakActive ? `${tdoaData.distB} m` : '—'}</span>
            </div>
          </div>
        </div>

        {/* ⏱️ VISUAL ACOUSTIC TIMELINE & WAVEFRONT PROPAGATION BAR */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Acoustic Arrival Phase &amp; Wavefront Lag Timeline
              </span>
            </div>
            <div className="text-[11px] font-mono text-sky-400">
              Path Difference: {isLeakActive ? `${tdoaData.pathDifferenceMeters} m` : '0.00 m'} · Δt = {isLeakActive ? `${tdoaData.absDeltaT_ms} ms` : '0.000 ms'}
            </div>
          </div>

          {/* Timing Comparison Bars */}
          <div className="space-y-3 pt-1">
            {/* Sensor A Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-sky-300 font-bold">{sensorA.id} Arrival Path</span>
                <span className="text-slate-400">{isLeakActive ? `${tdoaData.timeA_ms} ms (${tdoaData.distA}m)` : '0.000 ms'}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  style={{ width: isLeakActive ? `${Math.min(100, Math.max(12, (tdoaData.timeA_ms / 2.5) * 100))}%` : '5%' }} 
                  className={`h-full rounded-full transition-all duration-500 ${
                    tdoaData.timeA_ms <= tdoaData.timeB_ms ? 'bg-emerald-400 animate-pulse' : 'bg-sky-500'
                  }`}
                />
              </div>
            </div>

            {/* Sensor B Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold">{sensorB.id} Arrival Path</span>
                <span className="text-slate-400">{isLeakActive ? `${tdoaData.timeB_ms} ms (${tdoaData.distB}m)` : '0.000 ms'}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  style={{ width: isLeakActive ? `${Math.min(100, Math.max(12, (tdoaData.timeB_ms / 2.5) * 100))}%` : '5%' }} 
                  className={`h-full rounded-full transition-all duration-500 ${
                    tdoaData.timeB_ms < tdoaData.timeA_ms ? 'bg-emerald-400 animate-pulse' : 'bg-sky-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Mathematical Cross-Correlation Formula Box */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">TDOA Governing Formula</div>
              <div className="text-sky-300 font-bold mt-0.5">
                Δt = (d_B - d_A) / v = ({tdoaData.distB}m - {tdoaData.distA}m) / {speedOfSound} m/s
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Calculated Coordinate Pinpoint</div>
              <div className="text-emerald-300 font-bold mt-0.5">
                x_leak = (x_A + x_B - v · Δt) / 2 = {isLeakActive ? `${tdoaData.calculatedPos} m (±8cm)` : 'Nominal'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
