export type TabType = 'home' | 'research' | 'team' | 'dashboard' | 'next';

export type SensorStatus = 'normal' | 'warning' | 'alert' | 'offline';

export interface SensorNode {
  id: string; // 'PG-01', 'PG-02', 'PG-03', 'PG-04'
  name: string;
  location: string;
  positionMeters: number;
  status: SensorStatus;
  vibration: number; // Current reading in units (e.g. 42)
  baseline: number;  // Baseline reading (e.g. 39)
  difference: number; // vibration - baseline
  frequencyPeakHz: number; // Peak frequency (e.g. 142 Hz)
  rmsAmplitude: number; // RMS Amplitude (e.g. 1.28 m/s²)
  lastReadingTime: string;
}

export type SimulationScenario = 'normal' | 'small-leak' | 'large-leak' | 'disturbance';

export interface AlertRecord {
  id: string;
  time: string;
  sensorId: string;
  status: SensorStatus;
  message: string;
  vibrationValue: number;
  baselineDiff: number;
}

export interface LiveTelemetrySample {
  timestamp: string;
  timeSeconds: number;
  pg01: number;
  pg02: number;
  pg03: number;
  pg04: number;
  pg01Baseline: number;
  pg02Baseline: number;
  pg03Baseline: number;
  pg04Baseline: number;
  pressureBar: number;
  flowRateLpm: number;
}

export interface ResearchTest {
  id: string;
  title: string;
  tag: string;
  description: string;
  expectedPattern: string;
  flowRate: string;
  leakSize: string;
  testStatus: 'completed' | 'ongoing' | 'scheduled';
}

export interface RoadmapStep {
  step: string;
  title: string;
  summary: string;
  description: string;
  milestone: string;
  status: 'current' | 'next' | 'future';
  iconName: string;
}
