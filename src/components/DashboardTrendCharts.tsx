import React, { useState, useMemo } from 'react';
import { SimulationScenario } from '../types';

interface DashboardTrendChartsProps {
  scenario: SimulationScenario;
}

export const DashboardTrendCharts: React.FC<DashboardTrendChartsProps> = ({ scenario }) => {
  const [hoveredIndex1, setHoveredIndex1] = useState<number | null>(null);
  const [hoveredIndex2, setHoveredIndex2] = useState<number | null>(null);

  // Generate data series based on active scenario
  const chart1Data = useMemo(() => {
    const baseMultiplier = 
      scenario === 'large-leak' ? 82 : 
      scenario === 'small-leak' ? 46 : 
      scenario === 'disturbance' ? 32 : 16;

    const timestamps = ['09:40 AM', '09:41 AM', '09:41 AM', '09:41 AM', '09:42 AM', '09:42 AM'];
    const rawOffsets = [0, 3, -2, 5, 2, 4];

    return timestamps.map((time, i) => {
      const val = Math.min(100, Math.max(8, baseMultiplier + rawOffsets[i] + Math.sin(i * 1.5) * 4));
      return { time, value: Math.round(val * 10) / 10 };
    });
  }, [scenario]);

  const chart2Data = useMemo(() => {
    const baseMultiplier = 
      scenario === 'large-leak' ? 58 : 
      scenario === 'small-leak' ? 38 : 
      scenario === 'disturbance' ? 44 : 22;

    const timestamps = ['09:40 AM', '09:41 AM', '09:41 AM', '09:41 AM', '09:42 AM', '09:42 AM'];
    const curveOffsets = [4, 18, 12, 24, 8, 14];

    return timestamps.map((time, i) => {
      const val = Math.min(65.5, Math.max(14.5, baseMultiplier + curveOffsets[i] + Math.cos(i * 1.8) * 6));
      return { time, value: Math.round(val * 10) / 10 };
    });
  }, [scenario]);

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX - 15;
  const graphHeight = svgHeight - paddingY - 30;

  // Chart 1 SVG Path calculations (0 to 100 range)
  const getCoordinatesChart1 = (index: number, value: number) => {
    const x = paddingX + (index / (chart1Data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - (value / 100) * graphHeight;
    return { x, y };
  };

  const chart1Points = chart1Data.map((d, i) => getCoordinatesChart1(i, d.value));
  const chart1PathD = chart1Points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const chart1AreaD = `${chart1PathD} L ${chart1Points[chart1Points.length - 1].x} ${paddingY + graphHeight} L ${chart1Points[0].x} ${paddingY + graphHeight} Z`;

  // Chart 2 SVG Path calculations (14.5 to 65.5 range)
  const minVal2 = 14.5;
  const maxVal2 = 65.5;
  const getCoordinatesChart2 = (index: number, value: number) => {
    const x = paddingX + (index / (chart2Data.length - 1)) * graphWidth;
    const normalized = (value - minVal2) / (maxVal2 - minVal2);
    const y = paddingY + graphHeight - normalized * graphHeight;
    return { x, y };
  };

  const chart2Points = chart2Data.map((d, i) => getCoordinatesChart2(i, d.value));
  const chart2PathD = chart2Points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const chart2AreaD = `${chart2PathD} L ${chart2Points[chart2Points.length - 1].x} ${paddingY + graphHeight} L ${chart2Points[0].x} ${paddingY + graphHeight} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 🌊 LEFT CARD: Acoustic Anomaly Score Trend (Blue/Cyan Theme, No stress words) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
        <div className="space-y-1 mb-4">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Acoustic anomaly score trend
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Dynamic turbulence score calculated across 4 piezoelectric nodes
          </p>
        </div>

        {/* SVG Line & Area Chart */}
        <div className="w-full overflow-hidden relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="chart1Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines and Y-Labels (0, 25, 50, 75, 100) */}
            {[100, 75, 50, 25, 0].map((val) => {
              const y = paddingY + graphHeight - (val / 100) * graphHeight;
              return (
                <g key={val}>
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {val}
                  </text>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - 15}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray={val === 0 ? 'none' : '3 3'}
                  />
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={chart1AreaD} fill="url(#chart1Gradient)" />

            {/* Main Trend Line */}
            <path
              d={chart1PathD}
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interactive Data Dots & Hover Hitboxes */}
            {chart1Points.map((pt, i) => {
              const isHovered = hoveredIndex1 === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex1(i)}
                  onMouseLeave={() => setHoveredIndex1(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#0369A1' : '#0284C7'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  {/* Invisible broad hover area */}
                  <rect
                    x={pt.x - 20}
                    y={0}
                    width={40}
                    height={svgHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}

            {/* X-Axis Timestamps */}
            {chart1Data.map((d, i) => {
              const x = paddingX + (i / (chart1Data.length - 1)) * graphWidth;
              return (
                <text
                  key={i}
                  x={x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  className="text-[9.5px] fill-slate-400 font-mono"
                >
                  {d.time}
                </text>
              );
            })}
          </svg>

          {/* Active Hover Tooltip */}
          {hoveredIndex1 !== null && (
            <div
              className="absolute top-2 right-4 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono shadow-md border border-slate-700 pointer-events-none"
            >
              <span className="text-sky-300 font-bold">{chart1Data[hoveredIndex1].value}</span> / 100 at {chart1Data[hoveredIndex1].time}
            </div>
          )}
        </div>
      </div>

      {/* 💧 RIGHT CARD: Acoustic Vibration Amplitude Trend (Royal Blue Theme) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
        <div className="space-y-1 mb-4">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Piezoelectric vibration amplitude
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Volumetric acoustic wave turbulence &amp; sensor amplitude (%)
          </p>
        </div>

        {/* SVG Line & Area Chart */}
        <div className="w-full overflow-hidden relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="chart2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines and Y-Labels (65.5, 52.5, 35, 27.5, 14.5) */}
            {[65.5, 52.5, 35, 27.5, 14.5].map((val) => {
              const normalized = (val - minVal2) / (maxVal2 - minVal2);
              const y = paddingY + graphHeight - normalized * graphHeight;
              return (
                <g key={val}>
                  <text
                    x={paddingX - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[9.5px] fill-slate-400 font-mono"
                  >
                    {val}
                  </text>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - 15}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray={val === 14.5 ? 'none' : '3 3'}
                  />
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={chart2AreaD} fill="url(#chart2Gradient)" />

            {/* Main Trend Line */}
            <path
              d={chart2PathD}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interactive Data Dots & Hover Hitboxes */}
            {chart2Points.map((pt, i) => {
              const isHovered = hoveredIndex2 === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex2(i)}
                  onMouseLeave={() => setHoveredIndex2(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#1D4ED8' : '#2563EB'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  {/* Broad hover hitbox */}
                  <rect
                    x={pt.x - 20}
                    y={0}
                    width={40}
                    height={svgHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}

            {/* X-Axis Timestamps */}
            {chart2Data.map((d, i) => {
              const x = paddingX + (i / (chart2Data.length - 1)) * graphWidth;
              return (
                <text
                  key={i}
                  x={x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  className="text-[9.5px] fill-slate-400 font-mono"
                >
                  {d.time}
                </text>
              );
            })}
          </svg>

          {/* Active Hover Tooltip */}
          {hoveredIndex2 !== null && (
            <div
              className="absolute top-2 right-4 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono shadow-md border border-slate-700 pointer-events-none"
            >
              <span className="text-sky-300 font-bold">{chart2Data[hoveredIndex2].value}%</span> amplitude at {chart2Data[hoveredIndex2].time}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
