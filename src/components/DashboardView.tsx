import React, { useState, useEffect } from 'react';
import { 
  SensorNode, 
  SimulationScenario, 
  AlertRecord, 
  LiveTelemetrySample 
} from '../types';
import { PipelineMap } from './PipelineMap';
import { VibrationWaveform } from './VibrationWaveform';
import { 
  Activity, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Radio, 
  Clock, 
  Layers, 
  Waves, 
  RotateCcw, 
  Sparkles,
  Zap,
  Cpu,
  FileSpreadsheet,
  HelpCircle
} from 'lucide-react';

interface DashboardViewProps {
  sensors: SensorNode[];
  selectedSensorId: string;
  onSelectSensor: (sensorId: string) => void;
  scenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  scenario,
  onSelectScenario,
}) => {
  const [dashboardMode, setDashboardMode] = useState<'demo' | 'research'>('demo');
  const [alertLogs, setAlertLogs] = useState<AlertRecord[]>([
    {
      id: 'ALT-101',
      time: '09:28:14',
      sensorId: 'PG-01',
      status: 'normal',
      message: 'Baseline calibrated within nominal range (39u)',
      vibrationValue: 40,
      baselineDiff: +1,
    },
    {
      id: 'ALT-102',
      time: '09:28:25',
      sensorId: 'PG-02',
      status: 'normal',
      message: 'Laminar fluid acoustic signature verified',
      vibrationValue: 41,
      baselineDiff: +2,
    },
    {
      id: 'ALT-103',
      time: '09:28:41',
      sensorId: 'PG-03',
      status: 'normal',
      message: 'System nominal state active',
      vibrationValue: 42,
      baselineDiff: +3,
    },
    {
      id: 'ALT-104',
      time: '09:28:50',
      sensorId: 'PG-04',
      status: 'normal',
      message: 'Downstream sensor synchronized',
      vibrationValue: 39,
      baselineDiff: 0,
    },
  ]);

  // Handle scenario change alerts
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString();
    if (scenario === 'small-leak') {
      const newAlert: AlertRecord = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        time: timeStr,
        sensorId: 'PG-03',
        status: 'warning',
        message: 'Micro-leak turbulence detected between PG-02 and PG-03 (+18 units deviation)',
        vibrationValue: 57,
        baselineDiff: +18,
      };
      setAlertLogs((prev) => [newAlert, ...prev.slice(0, 7)]);
    } else if (scenario === 'large-leak') {
      const newAlert: AlertRecord = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        time: timeStr,
        sensorId: 'PG-03',
        status: 'alert',
        message: 'CRITICAL: Structural leak acoustic emission (+46 units deviation)',
        vibrationValue: 85,
        baselineDiff: +46,
      };
      setAlertLogs((prev) => [newAlert, ...prev.slice(0, 7)]);
    } else if (scenario === 'disturbance') {
      const newAlert: AlertRecord = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        time: timeStr,
        sensorId: 'PG-02',
        status: 'normal',
        message: 'External mechanical tap rejected by time-persistence filter (<800ms)',
        vibrationValue: 68,
        baselineDiff: +29,
      };
      setAlertLogs((prev) => [newAlert, ...prev.slice(0, 7)]);
    } else {
      const newAlert: AlertRecord = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        time: timeStr,
        sensorId: 'PG-ALL',
        status: 'normal',
        message: 'Pipeline returned to normal steady-state laminar flow',
        vibrationValue: 41,
        baselineDiff: +2,
      };
      setAlertLogs((prev) => [newAlert, ...prev.slice(0, 7)]);
    }
  }, [scenario]);

  const activeSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];
  const isLeaking = scenario === 'small-leak' || scenario === 'large-leak';
  const alertCount = sensors.filter((s) => s.status === 'alert' || s.status === 'warning').length;

  // Download CSV export handler
  const handleExportCSV = () => {
    const headers = 'Timestamp,SensorID,Position_m,Vibration_units,Baseline_units,Difference,Status,Peak_Hz\n';
    const rows = sensors.map(
      (s) => `${new Date().toISOString()},${s.id},${s.positionMeters},${s.vibration},${s.baseline},${s.difference},${s.status},${s.frequencyPeakHz}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PipeGuard_Telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 sm:space-y-10 py-6 sm:py-8">
      {/* 9. DASHBOARD HEADER */}
      <section className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                PipeGuard Monitor
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Online
              </span>
            </div>

            <p className="text-xs sm:text-sm font-mono text-cyan-300">
              Pipeline Network · {dashboardMode === 'demo' ? 'Interactive Exhibition Demo Mode' : 'Scientific Experimental Research Mode'}
            </p>
          </div>

          {/* Mode Switcher (🟢 Demo Mode vs 🔵 Research Mode) */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto shadow-inner">
            <button
              id="dashboard-demo-mode-btn"
              onClick={() => setDashboardMode('demo')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                dashboardMode === 'demo'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🟢 Demo Mode</span>
              <span className="text-[10px] opacity-80">(Exhibition)</span>
            </button>

            <button
              id="dashboard-research-mode-btn"
              onClick={() => setDashboardMode('research')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                dashboardMode === 'research'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔵 Research Mode</span>
              <span className="text-[10px] opacity-80">(Telemetry)</span>
            </button>
          </div>
        </div>

        {/* DEMO MODE SCENARIO CONTROLS (Requested for judges/exhibitions) */}
        {dashboardMode === 'demo' && (
          <div className="relative z-10 mt-6 pt-5 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                EXHIBITION SCENARIO TRIGGER (CLICK TO SIMULATE PIPE BEHAVIOUR):
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Active: <span className="text-cyan-400 uppercase font-bold">{scenario}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                id="scenario-btn-normal"
                onClick={() => onSelectScenario('normal')}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                  scenario === 'normal'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 ring-2 ring-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Normal</span>
                  <span className="text-emerald-400">🟢</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Laminar flow (39u)</div>
              </button>

              <button
                id="scenario-btn-small-leak"
                onClick={() => onSelectScenario('small-leak')}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                  scenario === 'small-leak'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-2 ring-amber-500/40 shadow-sm'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Small Leak</span>
                  <span className="text-amber-400">🟡</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">1.0mm orifice (+18u)</div>
              </button>

              <button
                id="scenario-btn-large-leak"
                onClick={() => onSelectScenario('large-leak')}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                  scenario === 'large-leak'
                    ? 'bg-red-500/20 text-red-300 border-red-500/60 ring-2 ring-red-500/40 shadow-sm'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Large Leak</span>
                  <span className="text-red-400">🔴</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">3.5mm rupture (+46u)</div>
              </button>

              <button
                id="scenario-btn-disturbance"
                onClick={() => onSelectScenario('disturbance')}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                  scenario === 'disturbance'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/60 ring-2 ring-blue-500/40 shadow-sm'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Disturbance</span>
                  <span className="text-blue-400">🔵</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Transient tap (&lt;0.8s)</div>
              </button>
            </div>
          </div>
        )}

        {/* RESEARCH MODE EXPORT & METADATA BAR */}
        {dashboardMode === 'research' && (
          <div className="relative z-10 mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                ADC Resolution: 12-Bit
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                Sampling Rate: 50 Hz
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                Filter: 2nd Order Butterworth Bandpass
              </span>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry CSV</span>
            </button>
          </div>
        )}
      </section>

      {/* TOP 4 METRIC CARDS (As strictly formatted in prompt) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: PIPE STATUS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider">
            PIPE STATUS
          </div>
          <div className="my-2">
            <div
              className={`font-mono font-extrabold text-2xl tracking-tight ${
                isLeaking ? 'text-red-600' : scenario === 'disturbance' ? 'text-blue-600' : 'text-emerald-600'
              }`}
            >
              {isLeaking ? (scenario === 'large-leak' ? 'LEAK ALERT' : 'WARNING') : 'NORMAL'}
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
              {isLeaking ? 'Abnormal turbulence detected' : 'Characteristic baseline steady'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">State:</span>
            <span className="text-slate-700 font-semibold">{isLeaking ? 'Turbulent Orifice' : 'Laminar Flow'}</span>
          </div>
        </div>

        {/* Card 2: VIBRATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider">
            VIBRATION
          </div>
          <div className="my-2">
            <div className="font-mono font-extrabold text-2xl tracking-tight text-slate-900">
              {activeSensor.vibration} <span className="text-base font-normal text-slate-500">units</span>
            </div>
            <p className="text-[11px] font-mono text-cyan-700 mt-0.5">
              Inspecting {activeSensor.id} ({activeSensor.location})
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">RMS Energy:</span>
            <span className="text-slate-700 font-semibold">{activeSensor.rmsAmplitude} m/s²</span>
          </div>
        </div>

        {/* Card 3: BASELINE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider">
            BASELINE
          </div>
          <div className="my-2">
            <div className="font-mono font-extrabold text-2xl tracking-tight text-slate-900">
              {activeSensor.baseline} <span className="text-base font-normal text-slate-500">units</span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
              Diff: <span className={activeSensor.difference > 10 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                {activeSensor.difference >= 0 ? `+${activeSensor.difference}` : activeSensor.difference}
              </span>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Tracking:</span>
            <span className="text-slate-700 font-semibold">Adaptive Kalman</span>
          </div>
        </div>

        {/* Card 4: ALERTS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider">
            ALERTS
          </div>
          <div className="my-2">
            <div
              className={`font-mono font-extrabold text-2xl tracking-tight ${
                alertCount > 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {alertCount} <span className="text-base font-normal text-slate-500">active</span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
              {alertCount > 0 ? 'Section inspection required' : 'Zero active anomalies'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Severity:</span>
            <span className="text-slate-700 font-semibold">{isLeaking ? 'Elevated' : 'None'}</span>
          </div>
        </div>
      </section>

      {/* 10. DASHBOARD PIPELINE MAP */}
      <section className="space-y-3">
        <PipelineMap
          sensors={sensors}
          selectedSensorId={selectedSensorId}
          onSelectSensor={onSelectSensor}
          scenario={scenario}
          onTriggerScenario={onSelectScenario}
        />
      </section>

      {/* 11. DASHBOARD GRAPHS: VIBRATION SIGNATURE OSCILLOSCOPE */}
      <section className="space-y-4">
        <VibrationWaveform
          sensors={sensors}
          selectedSensorId={selectedSensorId}
          scenario={scenario}
          onSelectSensor={onSelectSensor}
        />
      </section>

      {/* BASELINE COMPARISON & ALERT HISTORY TABLES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Baseline Comparison Matrix */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-display font-bold text-base text-slate-900">
              Baseline Comparison
            </h4>
            <span className="text-xs font-mono text-slate-400">
              All 4 Nodes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                  <th className="pb-2">Sensor</th>
                  <th className="pb-2 text-right">Baseline</th>
                  <th className="pb-2 text-right">Reading</th>
                  <th className="pb-2 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sensors.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectSensor(s.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedSensorId === s.id ? 'bg-cyan-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          s.status === 'alert'
                            ? 'bg-red-500'
                            : s.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span>{s.id}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({s.positionMeters}m)</span>
                    </td>
                    <td className="py-2.5 text-right text-slate-500">{s.baseline}</td>
                    <td className="py-2.5 text-right text-slate-800">{s.vibration}</td>
                    <td
                      className={`py-2.5 text-right font-bold ${
                        s.difference > 15
                          ? 'text-red-600'
                          : s.difference > 5
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {s.difference >= 0 ? `+${s.difference}` : s.difference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-600">
            <span className="font-bold text-slate-800">Adaptive logic: </span>
            A persistent deviation &gt; 15 units above baseline for &gt; 1.2s triggers an active leak warning.
          </div>
        </div>

        {/* Alert History Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-base text-slate-900">
                Alert History Log
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                Real-Time Event Stream
              </span>
            </div>

            <button
              onClick={() => setAlertLogs((prev) => prev.slice(0, 3))}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear Log
            </button>
          </div>

          <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase sticky top-0 bg-white">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Sensor</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Event Description</th>
                  <th className="pb-2 text-right">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alertLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 text-slate-500 whitespace-nowrap">{log.time}</td>
                    <td className="py-2.5 font-bold text-slate-800">{log.sensorId}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          log.status === 'alert'
                            ? 'bg-red-100 text-red-700'
                            : log.status === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600 text-xs truncate max-w-[200px]" title={log.message}>
                      {log.message}
                    </td>
                    <td
                      className={`py-2.5 text-right font-bold ${
                        log.baselineDiff > 10 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {log.baselineDiff >= 0 ? `+${log.baselineDiff}` : log.baselineDiff}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
