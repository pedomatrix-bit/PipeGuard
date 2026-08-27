import React, { useState, useMemo } from 'react';
import { 
  SensorNode, 
  SimulationScenario 
} from '../types';
import { 
  Radio, 
  Activity, 
  Droplet, 
  Layers, 
  Gauge, 
  Power, 
  GitBranch, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Factory, 
  Server, 
  Sliders, 
  MapPin, 
  Crosshair,
  Maximize2,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

interface FullSystemPipelineMapProps {
  sensors: SensorNode[];
  selectedSensorId: string;
  onSelectSensor: (sensorId: string) => void;
  scenario: SimulationScenario;
  onTriggerScenario?: (scenario: SimulationScenario) => void;
}

type MapLayer = 'all' | 'hydraulic' | 'acoustic' | 'valves';
type SelectedElement = 
  | { type: 'sensor'; id: string; name: string; position: number; status: string; vibration: number; baseline: number; freq: number; pipeMat: string; temp: number }
  | { type: 'valve'; id: string; name: string; sector: string; state: 'OPEN' | 'CLOSED'; flowLpm: number; pressure: number }
  | { type: 'station'; id: string; name: string; typeDesc: string; powerKw: number; headMeters: number; flowM3h: number }
  | { type: 'sector'; id: string; name: string; lengthMeters: number; diameterMm: number; material: string; flowVelocity: number; pressureBar: number; status: 'nominal' | 'leak' | 'warning' }
  | null;

export const FullSystemPipelineMap: React.FC<FullSystemPipelineMapProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  scenario,
  onTriggerScenario,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('all');
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(null);
  
  // Interactive Valve states
  const [valvesState, setValvesState] = useState<{ [id: string]: boolean }>({
    'V-01': true, // Intake Main Isolation
    'V-02': true, // Sector Beta Upstream
    'V-03': true, // Sector Beta Downstream Isolation
    'V-04': true, // Sector Gamma Distribution Manifold
    'V-05': true, // Residential District Gate
    'V-06': true, // Elevated Tank Bypass
  });

  // Toggle Valve
  const toggleValve = (valveId: string) => {
    setValvesState(prev => ({
      ...prev,
      [valveId]: !prev[valveId]
    }));
  };

  const isLeakActive = scenario === 'small-leak' || scenario === 'large-leak';
  const isLargeLeak = scenario === 'large-leak';
  const isDisturbance = scenario === 'disturbance';

  // Leak epicenter position on Sector Beta (between PG-02 & PG-03)
  const leakCoordinates = { x: 490, y: 220 };

  // Calculate dynamic system-wide metrics based on valve states and scenario
  const systemMetrics = useMemo(() => {
    const mainOpen = valvesState['V-01'] && valvesState['V-02'];
    const betaIsolated = !valvesState['V-02'] || !valvesState['V-03'];
    
    let totalFlowLpm = mainOpen ? (betaIsolated ? 120 : 340) : 0;
    let avgPressure = mainOpen ? (betaIsolated ? 4.8 : 3.6) : 0.2;
    let nrwLossLpm = 0;

    if (isLeakActive && !betaIsolated) {
      nrwLossLpm = isLargeLeak ? 84.5 : 28.2;
      totalFlowLpm += nrwLossLpm;
      avgPressure -= isLargeLeak ? 0.9 : 0.4;
    }

    return {
      totalFlowLpm: +totalFlowLpm.toFixed(1),
      avgPressure: +Math.max(0, avgPressure).toFixed(2),
      nrwLossLpm: +nrwLossLpm.toFixed(1),
      onlineNodes: 4,
      networkLengthKm: 4.8,
    };
  }, [valvesState, isLeakActive, isLargeLeak]);

  // Sector Data
  const sectors = [
    {
      id: 'SEC-A',
      name: 'Sector Alpha: Intake & Pumping',
      lengthMeters: 850,
      diameterMm: 200,
      material: 'Ductile Iron',
      flowVelocity: valvesState['V-01'] ? 1.4 : 0,
      pressureBar: valvesState['V-01'] ? 4.8 : 0.2,
      status: 'nominal' as const,
    },
    {
      id: 'SEC-B',
      name: 'Sector Beta: Acoustic Waveguide Trunk (PG-01 - PG-04)',
      lengthMeters: 1400,
      diameterMm: 150,
      material: 'Schedule 40 Steel / PVC',
      flowVelocity: (valvesState['V-02'] && valvesState['V-03']) ? (isLeakActive ? 2.1 : 1.6) : 0,
      pressureBar: (valvesState['V-02'] && valvesState['V-03']) ? (isLargeLeak ? 2.6 : 3.4) : 0.1,
      status: isLeakActive ? 'leak' as const : isDisturbance ? 'warning' as const : 'nominal' as const,
    },
    {
      id: 'SEC-C',
      name: 'Sector Gamma: PRV & Distribution Manifold',
      lengthMeters: 1100,
      diameterMm: 100,
      material: 'High-Density Polyethylene (HDPE)',
      flowVelocity: valvesState['V-04'] ? 1.1 : 0,
      pressureBar: valvesState['V-04'] ? 2.2 : 0,
      status: 'nominal' as const,
    },
    {
      id: 'SEC-D',
      name: 'Sector Delta: Urban Commercial & Residential Grid',
      lengthMeters: 1450,
      diameterMm: 75,
      material: 'Copper / PVC Riser Network',
      flowVelocity: valvesState['V-05'] ? 0.9 : 0,
      pressureBar: valvesState['V-05'] ? 1.9 : 0,
      status: isDisturbance ? 'warning' as const : 'nominal' as const,
    },
  ];

  return (
    <div className="w-full space-y-6 select-none">
      {/* 🧭 TOP MAP CONTROL BAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
              <GitBranch className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Full System Pipeline Network &amp; Telemetry GIS Map
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-500">
            Real-time multi-zone municipal water distribution network topology, acoustic sensor bus, and motorized isolation nodes.
          </p>
        </div>

        {/* LAYER TOGGLE PILLS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase mr-1 hidden sm:inline">
            Layers:
          </span>
          {[
            { id: 'all', label: 'Full Topology', icon: Layers },
            { id: 'hydraulic', label: 'Hydraulic Flow', icon: Activity },
            { id: 'acoustic', label: 'Acoustic Array', icon: Radio },
            { id: 'valves', label: 'Isolation Valves', icon: Power },
          ].map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as MapLayer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📊 LIVE SYSTEM TELEMETRY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Total Grid Flow</div>
          <div className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-0.5">
            {systemMetrics.totalFlowLpm} <span className="text-xs font-normal text-slate-500 font-mono">L/min</span>
          </div>
          <div className="text-[10px] font-mono text-sky-700 mt-0.5">Electromagnetic meter</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Mean Line Pressure</div>
          <div className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-0.5">
            {systemMetrics.avgPressure} <span className="text-xs font-normal text-slate-500 font-mono">Bar</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Across 4 pressure zones</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Acoustic Nodes</div>
          <div className="font-display font-bold text-lg sm:text-xl text-sky-700 mt-0.5">
            4 / 4 <span className="text-xs font-normal text-emerald-600 font-mono">Online</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Piezoelectric telemetry bus</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">NRW Water Loss</div>
          <div className={`font-display font-bold text-lg sm:text-xl mt-0.5 ${systemMetrics.nrwLossLpm > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {systemMetrics.nrwLossLpm} <span className="text-xs font-normal text-slate-500 font-mono">L/min</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {systemMetrics.nrwLossLpm > 0 ? 'Active loss detected' : 'Zero unmetered loss'}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Network Health</div>
          <div className={`font-display font-bold text-lg sm:text-xl mt-0.5 ${isLeakActive ? 'text-amber-600' : 'text-sky-600'}`}>
            {isLargeLeak ? 'CRITICAL (28%)' : isLeakActive ? 'LEAK ALERT (64%)' : 'OPTIMAL (98%)'}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">SCADA Diagnostics</div>
        </div>
      </div>

      {/* 🗺️ THE FULL SYSTEM SVG MAP CANVAS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs overflow-hidden relative">
        {/* Blueprint Tech Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

        {/* MAP LEGEND HEADER */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="font-bold text-slate-800">DISTRIBUTION TOPOLOGY SCHEMATIC</span>
            <span className="text-slate-400 hidden md:inline">· Click nodes, valves, or pipe sectors to inspect real-time physics</span>
          </div>

          {/* Quick Scenario Injector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Inject Event:</span>
            {onTriggerScenario && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onTriggerScenario('normal')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                    scenario === 'normal' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => onTriggerScenario('small-leak')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                    scenario === 'small-leak' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Micro-Leak (x=2.2m)
                </button>
                <button
                  onClick={() => onTriggerScenario('large-leak')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                    scenario === 'large-leak' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Burst (x=2.2m)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MAP SVG CONTAINER */}
        <div className="relative z-10 w-full overflow-x-auto py-2">
          <div className="min-w-[920px] max-w-full mx-auto">
            <svg viewBox="0 0 1000 520" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Gradients */}
                <linearGradient id="pipeHighPressure" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>

                <linearGradient id="pipeMidPressure" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>

                <linearGradient id="pipeLowPressure" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#7DD3FC" />
                </linearGradient>

                <linearGradient id="pipeLeakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>

                {/* Drop Shadows */}
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <filter id="leakGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ========================================================================= */}
              {/* SECTOR A: WATER SOURCE RESERVOIR & INTAKE PUMP STATION (TOP LEFT) */}
              {/* ========================================================================= */}
              <g 
                id="station-intake"
                className="cursor-pointer group"
                onClick={() => setSelectedElement({
                  type: 'station',
                  id: 'STA-01',
                  name: 'Intake Filtration & Booster Pump Station #1',
                  typeDesc: 'Dual Submersible 18.5 kW Variable Speed Turbines',
                  powerKw: 37,
                  headMeters: 45,
                  flowM3h: 38.5,
                })}
              >
                {/* Reservoir Tank Housing */}
                <rect x="30" y="50" width="130" height="90" rx="14" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2.5" className="group-hover:stroke-sky-500 transition-colors shadow-sm" />
                <rect x="38" y="75" width="114" height="57" rx="8" fill="#E0F2FE" />
                
                {/* Animated Water Surface */}
                <path d="M 38 75 Q 65 71 95 75 T 152 75" stroke="#0284C7" strokeWidth="2" fill="none" />
                
                <text x="95" y="70" textAnchor="middle" fill="#0369A1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  CENTRAL RESERVOIR
                </text>
                <text x="95" y="100" textAnchor="middle" fill="#0C4A6E" fontSize="9" fontFamily="JetBrains Mono">
                  Cap: 250,000 Liters
                </text>
                <text x="95" y="116" textAnchor="middle" fill="#0284C7" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  Source: 4.8 Bar Head
                </text>

                {/* Submersible Pump Symbol */}
                <circle cx="190" cy="95" r="20" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />
                <path d="M 180 95 L 200 95 M 190 85 L 190 105" stroke="#38BDF8" strokeWidth="2.5" className="origin-[190px_95px] animate-spin" />
                <text x="190" y="127" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  BOOSTER P-01
                </text>
              </g>

              {/* INTAKE PIPE LINK: RESERVOIR -> PUMP */}
              <path d="M 160 95 L 170 95" stroke="#0284C7" strokeWidth="12" strokeLinecap="round" />

              {/* ========================================================================= */}
              {/* PRIMARY TRANSMISSION TRUNK: FROM PUMP TO SECTOR BETA */}
              {/* ========================================================================= */}
              <g
                id="sec-a-pipe"
                className="cursor-pointer"
                onClick={() => setSelectedElement({
                  type: 'sector',
                  ...sectors[0]
                })}
              >
                {/* Pipe Outer Wall */}
                <path
                  d="M 210 95 L 310 95 L 310 220 L 360 220"
                  fill="none"
                  stroke={valvesState['V-01'] ? '#0284C7' : '#94A3B8'}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors hover:stroke-sky-500"
                />
                {/* Inner Water Streamline with Flow Animation */}
                {valvesState['V-01'] && (activeLayer === 'all' || activeLayer === 'hydraulic') && (
                  <path
                    d="M 210 95 L 310 95 L 310 220 L 360 220"
                    fill="none"
                    stroke="#E0F2FE"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    className="animate-[dash_1.2s_linear_infinite]"
                  />
                )}
                <text x="255" y="85" fill="#0369A1" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  SEC-A: DN200 TRUNK
                </text>
              </g>

              {/* VALVE V-01 (Intake Main Isolation Valve) */}
              <g 
                id="valve-v01"
                className="cursor-pointer group"
                transform="translate(260, 95)"
                onClick={() => toggleValve('V-01')}
              >
                <polygon points="-8,-8 8,8 -8,8 8,-8" fill={valvesState['V-01'] ? '#0284C7' : '#EF4444'} stroke="#0F172A" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text x="0" y="-12" textAnchor="middle" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  V-01 {valvesState['V-01'] ? '[OPEN]' : '[SHUT]'}
                </text>
              </g>

              {/* ========================================================================= */}
              {/* SECTOR B: PIPEGUARD ACOUSTIC MONITORING ARRAY (PG-01 to PG-04) */}
              {/* ========================================================================= */}
              {/* Sector B Pipe Background Highlight Container */}
              <rect x="340" y="165" width="410" height="110" rx="16" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="355" y="185" fill="#0369A1" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                SECTOR BETA: 4-NODE ACOUSTIC LAB WAVEGUIDE (4.0m HIGH-RESOLUTION TEST RIG)
              </text>

              {/* VALVE V-02 (Sector Beta Upstream Gate Valve) */}
              <g 
                id="valve-v02"
                className="cursor-pointer group"
                transform="translate(360, 220)"
                onClick={() => toggleValve('V-02')}
              >
                <polygon points="-8,-8 8,8 -8,8 8,-8" fill={valvesState['V-02'] ? '#0284C7' : '#EF4444'} stroke="#0F172A" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text x="0" y="-12" textAnchor="middle" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  V-02 {valvesState['V-02'] ? '[OPEN]' : '[SHUT]'}
                </text>
              </g>

              {/* Main Waveguide Pipe Line */}
              <g
                id="sec-b-pipe"
                className="cursor-pointer"
                onClick={() => setSelectedElement({
                  type: 'sector',
                  ...sectors[1]
                })}
              >
                <path
                  d="M 360 220 L 730 220"
                  fill="none"
                  stroke={
                    !valvesState['V-02'] || !valvesState['V-03']
                      ? '#94A3B8'
                      : isLeakActive
                      ? 'url(#pipeLeakGrad)'
                      : '#0284C7'
                  }
                  strokeWidth="16"
                  strokeLinecap="round"
                  className="transition-colors hover:stroke-sky-400"
                />

                {/* Inner Flow Particles */}
                {valvesState['V-02'] && valvesState['V-03'] && (activeLayer === 'all' || activeLayer === 'hydraulic') && (
                  <path
                    d="M 360 220 L 730 220"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeDasharray="10 8"
                    className={isLeakActive ? "animate-[dash_0.6s_linear_infinite]" : "animate-[dash_1.4s_linear_infinite]"}
                  />
                )}

                {/* Distance Scale Ticks along Waveguide */}
                <g stroke="#94A3B8" strokeWidth="1" opacity="0.6">
                  <line x1="390" y1="234" x2="710" y2="234" />
                  <line x1="390" y1="230" x2="390" y2="238" />
                  <line x1="470" y1="230" x2="470" y2="238" />
                  <line x1="550" y1="230" x2="550" y2="238" />
                  <line x1="630" y1="230" x2="630" y2="238" />
                  <line x1="710" y1="230" x2="710" y2="238" />
                </g>
                <g fill="#64748B" fontSize="7.5" fontFamily="JetBrains Mono">
                  <text x="390" y="246" textAnchor="middle">0.0m</text>
                  <text x="470" y="246" textAnchor="middle">1.0m</text>
                  <text x="550" y="246" textAnchor="middle">2.0m</text>
                  <text x="630" y="246" textAnchor="middle">3.0m</text>
                  <text x="710" y="246" textAnchor="middle">4.0m</text>
                </g>
              </g>

              {/* 4 PIEZOELECTRIC ACOUSTIC SENSOR CLAMPS (PG-01, PG-02, PG-03, PG-04) */}
              {[
                { id: 'PG-01', x: 420, pos: 0.5, name: 'Acoustic Clamp #1' },
                { id: 'PG-02', x: 500, pos: 1.5, name: 'Acoustic Clamp #2' },
                { id: 'PG-03', x: 580, pos: 2.5, name: 'Acoustic Clamp #3' },
                { id: 'PG-04', x: 660, pos: 3.5, name: 'Acoustic Clamp #4' },
              ].map((node) => {
                const isSelected = selectedSensorId === node.id;
                const sensorData = sensors.find((s) => s.id === node.id);
                const isWarning = sensorData?.status === 'warning';
                const isAlert = sensorData?.status === 'alert';

                let nodeColor = '#0284C7';
                if (isAlert) nodeColor = '#EF4444';
                else if (isWarning) nodeColor = '#F59E0B';

                return (
                  <g
                    key={node.id}
                    id={`sensor-node-${node.id}`}
                    className="cursor-pointer group"
                    transform={`translate(${node.x}, 220)`}
                    onClick={() => {
                      onSelectSensor(node.id);
                      setSelectedElement({
                        type: 'sensor',
                        id: node.id,
                        name: node.name,
                        position: node.pos,
                        status: sensorData?.status || 'normal',
                        vibration: sensorData?.vibration || 30,
                        baseline: sensorData?.baseline || 25,
                        freq: 1.4,
                        pipeMat: 'PVC / Steel',
                        temp: 21.4,
                      });
                    }}
                  >
                    {/* Concentric Telemetry Ping if Layer active */}
                    {(activeLayer === 'all' || activeLayer === 'acoustic') && (
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 26 : 20}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                        className={isAlert ? 'animate-ping opacity-60' : 'opacity-40'}
                      />
                    )}

                    {/* Sensor Clamp Outer Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 16 : 13}
                      fill="#FFFFFF"
                      stroke={isSelected ? '#0F172A' : nodeColor}
                      strokeWidth={isSelected ? 3 : 2}
                      className="group-hover:scale-110 transition-transform"
                    />

                    {/* Inner Piezo Sensor Core */}
                    <circle cx="0" cy="0" r="7" fill={nodeColor} />

                    {/* Label Badge Above */}
                    <rect x="-20" y="-32" width="40" height="15" rx="4" fill="#0F172A" />
                    <text x="0" y="-22" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                      {node.id}
                    </text>

                    {/* Signal % Indicator below */}
                    <text x="0" y="38" textAnchor="middle" fill="#0F172A" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="bold">
                      {sensorData?.vibration.toFixed(1)}%
                    </text>
                  </g>
                );
              })}

              {/* 🚨 LEAK EPICENTER BEACON (If active in scenario) */}
              {isLeakActive && valvesState['V-02'] && valvesState['V-03'] && (
                <g 
                  id="leak-epicenter-marker"
                  transform={`translate(${leakCoordinates.x}, ${leakCoordinates.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedElement({
                    type: 'sector',
                    id: 'LEAK-EPICENTER',
                    name: 'Pinpointed Turbulence Orifice (x = 2.20m)',
                    lengthMeters: 0.05,
                    diameterMm: isLargeLeak ? 4.5 : 1.2,
                    material: 'Fissure Cavitation Zone',
                    flowVelocity: 4.8,
                    pressureBar: 2.4,
                    status: 'leak',
                  })}
                >
                  <circle cx="0" cy="0" r="32" fill="none" stroke="#EF4444" strokeWidth="2" className="animate-ping" />
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#F87171" strokeWidth="1.5" className="animate-ping delay-200" />
                  <circle cx="0" cy="0" r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
                  
                  {/* Jet spray effect */}
                  <path d="M 0 -8 L -6 -24 M 0 -8 L 0 -28 M 0 -8 L 6 -24" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />

                  {/* Pinpoint Tag */}
                  <rect x="-42" y="-52" width="84" height="18" rx="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="0" y="-40" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                    LEAK @ 2.20m
                  </text>
                </g>
              )}

              {/* VALVE V-03 (Sector Beta Downstream Isolation Valve) */}
              <g 
                id="valve-v03"
                className="cursor-pointer group"
                transform="translate(730, 220)"
                onClick={() => toggleValve('V-03')}
              >
                <polygon points="-8,-8 8,8 -8,8 8,-8" fill={valvesState['V-03'] ? '#0284C7' : '#EF4444'} stroke="#0F172A" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text x="0" y="-12" textAnchor="middle" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  V-03 {valvesState['V-03'] ? '[OPEN]' : '[SHUT]'}
                </text>
              </g>

              {/* ========================================================================= */}
              {/* SECTOR C: PRV PRESSURE REDUCING STATION & MANIFOLD */}
              {/* ========================================================================= */}
              <g
                id="sec-c-pipe"
                className="cursor-pointer"
                onClick={() => setSelectedElement({
                  type: 'sector',
                  ...sectors[2]
                })}
              >
                {/* Pipe Down to PRV Manifold */}
                <path
                  d="M 730 220 L 800 220 L 800 360 L 620 360"
                  fill="none"
                  stroke={valvesState['V-04'] ? '#0EA5E9' : '#94A3B8'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors hover:stroke-sky-400"
                />
                {valvesState['V-04'] && (activeLayer === 'all' || activeLayer === 'hydraulic') && (
                  <path
                    d="M 730 220 L 800 220 L 800 360 L 620 360"
                    fill="none"
                    stroke="#E0F2FE"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    className="animate-[dash_1.6s_linear_infinite]"
                  />
                )}
                <text x="750" y="300" fill="#0369A1" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  SEC-C: DN100 MANIFOLD
                </text>
              </g>

              {/* PRV REGULATOR STATION (PRESSURE REDUCTION) */}
              <g 
                id="station-prv"
                className="cursor-pointer group"
                transform="translate(680, 360)"
                onClick={() => setSelectedElement({
                  type: 'station',
                  id: 'PRV-01',
                  name: 'Dynamic Pressure Reducing Valve (PRV) Station #2',
                  typeDesc: 'Direct-Acting Pilot Diaphragm PRV with Modbus Telemetry',
                  powerKw: 0,
                  headMeters: 22,
                  flowM3h: 24.0,
                })}
              >
                <rect x="-35" y="-20" width="70" height="40" rx="10" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" className="group-hover:stroke-sky-500 shadow-xs" />
                <text x="0" y="-3" textAnchor="middle" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  PRV-STATION
                </text>
                <text x="0" y="10" textAnchor="middle" fill="#0284C7" fontSize="7.5" fontFamily="JetBrains Mono">
                  4.2 → 2.2 Bar
                </text>
              </g>

              {/* VALVE V-04 (Distribution Manifold Valve) */}
              <g 
                id="valve-v04"
                className="cursor-pointer group"
                transform="translate(620, 360)"
                onClick={() => toggleValve('V-04')}
              >
                <polygon points="-8,-8 8,8 -8,8 8,-8" fill={valvesState['V-04'] ? '#0284C7' : '#EF4444'} stroke="#0F172A" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text x="0" y="-12" textAnchor="middle" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  V-04 {valvesState['V-04'] ? '[OPEN]' : '[SHUT]'}
                </text>
              </g>

              {/* ========================================================================= */}
              {/* SECTOR D: URBAN CONSUMER GRID & RESIDENTIAL SERVICE LINES (BOTTOM LEFT) */}
              {/* ========================================================================= */}
              <g
                id="sec-d-pipe"
                className="cursor-pointer"
                onClick={() => setSelectedElement({
                  type: 'sector',
                  ...sectors[3]
                })}
              >
                {/* Distribution Ring Line */}
                <path
                  d="M 620 360 L 300 360 L 300 440 L 160 440"
                  fill="none"
                  stroke={valvesState['V-05'] ? '#38BDF8' : '#94A3B8'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors hover:stroke-sky-400"
                />
                {valvesState['V-05'] && (activeLayer === 'all' || activeLayer === 'hydraulic') && (
                  <path
                    d="M 620 360 L 300 360 L 300 440 L 160 440"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    className="animate-[dash_2s_linear_infinite]"
                  />
                )}
                <text x="440" y="380" fill="#0369A1" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  SEC-D: DN75 CONSUMER RING
                </text>
              </g>

              {/* VALVE V-05 (Residential Zone Isolation Gate) */}
              <g 
                id="valve-v05"
                className="cursor-pointer group"
                transform="translate(300, 400)"
                onClick={() => toggleValve('V-05')}
              >
                <polygon points="-8,-8 8,8 -8,8 8,-8" fill={valvesState['V-05'] ? '#0284C7' : '#EF4444'} stroke="#0F172A" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text x="25" y="4" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  V-05 {valvesState['V-05'] ? '[OPEN]' : '[SHUT]'}
                </text>
              </g>

              {/* CONSUMER DISTRICT TERMINALS (HOUSES / COMMERCIAL) */}
              <g 
                id="consumer-district"
                className="cursor-pointer group"
                transform="translate(80, 410)"
                onClick={() => setSelectedElement({
                  type: 'station',
                  id: 'DIST-01',
                  name: 'District Metered Area (DMA #4 - Residential & Institutional)',
                  typeDesc: '420 Smart AMR Meter Endpoints · 1.9 Bar Regulated Supply',
                  powerKw: 0,
                  headMeters: 19,
                  flowM3h: 18.2,
                })}
              >
                <rect x="0" y="0" width="80" height="60" rx="10" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" className="group-hover:stroke-sky-500 shadow-xs" />
                <text x="40" y="24" textAnchor="middle" fill="#0F172A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  DMA #4 GRID
                </text>
                <text x="40" y="38" textAnchor="middle" fill="#0284C7" fontSize="7.5" fontFamily="JetBrains Mono">
                  420 Smart Meters
                </text>
                <text x="40" y="49" textAnchor="middle" fill="#64748B" fontSize="6.5" fontFamily="JetBrains Mono">
                  1.9 Bar Constant
                </text>
              </g>

              {/* ========================================================================= */}
              {/* SECTOR E: ELEVATED BALANCING TOWER & GRAVITY FEED (TOP RIGHT) */}
              {/* ========================================================================= */}
              <g
                id="station-elevated-tower"
                className="cursor-pointer group"
                transform="translate(840, 50)"
                onClick={() => setSelectedElement({
                  type: 'station',
                  id: 'TWR-01',
                  name: 'Elevated Balancing Water Tower (Standpipe)',
                  typeDesc: '85,000 Liters Capacity · Hydrostatic Surge Protection',
                  powerKw: 0,
                  headMeters: 38,
                  flowM3h: 12.0,
                })}
              >
                <rect x="0" y="0" width="110" height="90" rx="12" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" className="group-hover:stroke-sky-500 shadow-xs" />
                <rect x="8" y="25" width="94" height="57" rx="6" fill="#E0F2FE" />
                <path d="M 8 25 Q 35 21 60 25 T 102 25" stroke="#0284C7" strokeWidth="1.5" fill="none" />
                
                <text x="55" y="16" textAnchor="middle" fill="#0369A1" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="bold">
                  ELEVATED TOWER
                </text>
                <text x="55" y="48" textAnchor="middle" fill="#0C4A6E" fontSize="8" fontFamily="JetBrains Mono">
                  Cap: 85,000 L
                </text>
                <text x="55" y="64" textAnchor="middle" fill="#0284C7" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="bold">
                  Level: 94% Nominal
                </text>
              </g>

              {/* Pipe connection to Elevated Tower */}
              <path
                d="M 800 220 L 895 220 L 895 140"
                fill="none"
                stroke={valvesState['V-06'] ? '#0EA5E9' : '#94A3B8'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* VALVE V-06 (Elevated Tower Bypass) */}
              <g 
                id="valve-v06"
                className="cursor-pointer group"
                transform="translate(895, 180)"
                onClick={() => toggleValve('V-06')}
              >
                <polygon points="-8,-8 8,8 -8,8 8,-8" fill={valvesState['V-06'] ? '#0284C7' : '#EF4444'} stroke="#0F172A" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text x="14" y="3" fill="#0F172A" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="bold">
                  V-06
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 🔬 BOTTOM INSPECTION DRAWER & SECTOR SELECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL 1: REAL-TIME ELEMENT INSPECTION CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Element Telemetry Inspector
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                Live SCADA
              </span>
            </div>

            {selectedElement ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200">
                  <div className="text-[10px] font-mono font-bold text-sky-700 uppercase">
                    {selectedElement.type.toUpperCase()} SPECIFICATION
                  </div>
                  <div className="font-display font-bold text-base text-slate-900 mt-0.5">
                    {selectedElement.name}
                  </div>
                </div>

                {selectedElement.type === 'sensor' && (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Pipeline Location:</span>
                      <span className="font-bold text-slate-800">{selectedElement.position} m</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Current Vibration:</span>
                      <span className="font-bold text-sky-700">{selectedElement.vibration.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Baseline Target:</span>
                      <span className="font-bold text-slate-700">{selectedElement.baseline.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Pipe Material:</span>
                      <span className="font-bold text-slate-800">{selectedElement.pipeMat}</span>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'sector' && (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Nominal Diameter:</span>
                      <span className="font-bold text-slate-800">DN {selectedElement.diameterMm} mm</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Segment Length:</span>
                      <span className="font-bold text-slate-800">{selectedElement.lengthMeters} m</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Flow Velocity:</span>
                      <span className="font-bold text-sky-700">{selectedElement.flowVelocity} m/s</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Zone Pressure:</span>
                      <span className="font-bold text-slate-800">{selectedElement.pressureBar} Bar</span>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'station' && (
                  <div className="space-y-2 text-xs font-mono">
                    <p className="text-xs text-slate-600 font-sans">{selectedElement.typeDesc}</p>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Rated Head:</span>
                      <span className="font-bold text-slate-800">{selectedElement.headMeters} m</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Throughput:</span>
                      <span className="font-bold text-sky-700">{selectedElement.flowM3h} m³/h</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Info className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-mono text-slate-500">
                  Click any pipe sector, valve (V-01 to V-06), or acoustic node (PG-01 to PG-04) on the map above to view telemetry.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 text-[10px] font-mono text-slate-400">
            Click valves directly on the map to toggle isolation state.
          </div>
        </div>

        {/* PANEL 2: SECTORS HEALTH OVERVIEW */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Sector Hydraulic Zones
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">4 Segments</span>
            </div>

            <div className="space-y-2.5">
              {sectors.map((sec) => {
                const isSelected = selectedElement?.type === 'sector' && selectedElement.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedElement({ type: 'sector', ...sec })}
                    className={`p-3 rounded-2xl border text-xs font-mono cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 text-sky-950 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{sec.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        sec.status === 'leak'
                          ? 'bg-rose-100 text-rose-800'
                          : sec.status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sec.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 truncate">{sec.name}</div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Ø {sec.diameterMm}mm ({sec.material})</span>
                      <span>{sec.pressureBar} Bar</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 3: ISOLATION VALVES ACTUATOR MATRIX */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Motorized Valve Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">SCADA Actuators</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(valvesState).map(([vId, isOpen]) => (
                <button
                  key={vId}
                  onClick={() => toggleValve(vId)}
                  className={`p-3 rounded-2xl border text-left font-mono transition-all cursor-pointer ${
                    isOpen
                      ? 'bg-sky-50/60 border-sky-200 text-slate-800 hover:bg-sky-100'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{vId}</span>
                    <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-sky-600' : 'bg-rose-600 animate-pulse'}`} />
                  </div>
                  <div className={`text-[10px] font-bold mt-1 ${isOpen ? 'text-sky-700' : 'text-rose-700'}`}>
                    {isOpen ? 'VALVE OPEN' : 'ISOLATED'}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 text-white text-[11px] font-mono space-y-1">
              <div className="text-sky-300 font-bold">Automatic Section Isolation:</div>
              <p className="text-slate-400 text-[10px] leading-tight">
                Toggling V-02 and V-03 completely isolates Sector Beta from the primary trunk, terminating water loss while maintaining secondary gravity flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
