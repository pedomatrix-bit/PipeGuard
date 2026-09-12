import React, { useState, useEffect } from 'react';
import { TabType, SimulationScenario, SensorNode } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ResearchView } from './components/ResearchView';
import { TeamView } from './components/TeamView';
import { DashboardView } from './components/DashboardView';
import { NextView } from './components/NextView';
import { InspireManakModal } from './components/InspireManakModal';
import { CustomCursor } from './components/CustomCursor';
import { AcousticPreloader } from './components/AcousticPreloader';

const INITIAL_SENSORS: SensorNode[] = [
  {
    id: 'PG-01',
    name: 'Sensor 01 (Upstream Inlet)',
    location: 'Inlet Segment',
    positionMeters: 0.5,
    status: 'normal',
    vibration: 40,
    baseline: 39,
    difference: 1,
    frequencyPeakHz: 128,
    rmsAmplitude: 1.15,
    lastReadingTime: '09:28:14',
  },
  {
    id: 'PG-02',
    name: 'Sensor 02 (Midstream Up)',
    location: 'Midspan Alpha',
    positionMeters: 1.5,
    status: 'normal',
    vibration: 41,
    baseline: 39,
    difference: 2,
    frequencyPeakHz: 134,
    rmsAmplitude: 1.20,
    lastReadingTime: '09:28:25',
  },
  {
    id: 'PG-03',
    name: 'Sensor 03 (Midstream Down)',
    location: 'Midspan Beta',
    positionMeters: 2.5,
    status: 'normal',
    vibration: 42,
    baseline: 39,
    difference: 3,
    frequencyPeakHz: 142,
    rmsAmplitude: 1.28,
    lastReadingTime: '09:28:41',
  },
  {
    id: 'PG-04',
    name: 'Sensor 04 (Downstream Outlet)',
    location: 'Outlet Segment',
    positionMeters: 3.5,
    status: 'normal',
    vibration: 39,
    baseline: 39,
    difference: 0,
    frequencyPeakHz: 122,
    rmsAmplitude: 1.08,
    lastReadingTime: '09:28:50',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>('normal');
  const [selectedSensorId, setSelectedSensorId] = useState<string>('PG-03');
  const [sensors, setSensors] = useState<SensorNode[]>(INITIAL_SENSORS);
  const [isInspireModalOpen, setIsInspireModalOpen] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  // Dynamic simulation engine based on scenario
  useEffect(() => {
    setSensors((prevSensors) => {
      return prevSensors.map((s) => {
        const timeNow = new Date().toLocaleTimeString();
        if (currentScenario === 'normal') {
          return {
            ...s,
            status: 'normal',
            vibration: s.id === 'PG-03' ? 42 : s.id === 'PG-02' ? 41 : 39,
            difference: s.id === 'PG-03' ? 3 : s.id === 'PG-02' ? 2 : 0,
            frequencyPeakHz: s.id === 'PG-03' ? 142 : 128,
            rmsAmplitude: 1.18,
            lastReadingTime: timeNow,
          };
        } else if (currentScenario === 'small-leak') {
          // Leak between PG-02 (1.5m) and PG-03 (2.5m) near 2.2m
          if (s.id === 'PG-03') {
            return {
              ...s,
              status: 'warning',
              vibration: 57,
              difference: 18,
              frequencyPeakHz: 340,
              rmsAmplitude: 2.45,
              lastReadingTime: timeNow,
            };
          } else if (s.id === 'PG-02') {
            return {
              ...s,
              status: 'warning',
              vibration: 51,
              difference: 12,
              frequencyPeakHz: 310,
              rmsAmplitude: 2.10,
              lastReadingTime: timeNow,
            };
          } else {
            return {
              ...s,
              status: 'normal',
              vibration: 43,
              difference: 4,
              frequencyPeakHz: 145,
              rmsAmplitude: 1.30,
              lastReadingTime: timeNow,
            };
          }
        } else if (currentScenario === 'large-leak') {
          // Intense rupture near PG-03
          if (s.id === 'PG-03') {
            return {
              ...s,
              status: 'alert',
              vibration: 85,
              difference: 46,
              frequencyPeakHz: 680,
              rmsAmplitude: 4.85,
              lastReadingTime: timeNow,
            };
          } else if (s.id === 'PG-02') {
            return {
              ...s,
              status: 'alert',
              vibration: 69,
              difference: 30,
              frequencyPeakHz: 520,
              rmsAmplitude: 3.60,
              lastReadingTime: timeNow,
            };
          } else if (s.id === 'PG-04') {
            return {
              ...s,
              status: 'warning',
              vibration: 54,
              difference: 15,
              frequencyPeakHz: 290,
              rmsAmplitude: 2.25,
              lastReadingTime: timeNow,
            };
          } else {
            return {
              ...s,
              status: 'normal',
              vibration: 48,
              difference: 9,
              frequencyPeakHz: 180,
              rmsAmplitude: 1.65,
              lastReadingTime: timeNow,
            };
          }
        } else if (currentScenario === 'disturbance') {
          // External tap near PG-02
          if (s.id === 'PG-02') {
            return {
              ...s,
              status: 'normal',
              vibration: 68,
              difference: 29,
              frequencyPeakHz: 195,
              rmsAmplitude: 3.10,
              lastReadingTime: timeNow,
            };
          } else {
            return {
              ...s,
              status: 'normal',
              vibration: 41,
              difference: 2,
              frequencyPeakHz: 130,
              rmsAmplitude: 1.15,
              lastReadingTime: timeNow,
            };
          }
        }
        return s;
      });
    });
  }, [currentScenario]);

  // Scroll to top when tab changes
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top sticky Navbar (Hidden in dashboard for dedicated full-screen control workspace) */}
      {currentTab !== 'dashboard' && (
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleTabChange}
          currentScenario={currentScenario}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-grow w-full ${currentTab === 'dashboard' ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {currentTab === 'home' && (
          <HomeView
            onSelectTab={handleTabChange}
            currentScenario={currentScenario}
            sensors={sensors}
            onTriggerScenario={setCurrentScenario}
          />
        )}

        {currentTab === 'research' && (
          <ResearchView onSelectTab={handleTabChange} />
        )}

        {currentTab === 'team' && (
          <TeamView onSelectTab={handleTabChange} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            sensors={sensors}
            selectedSensorId={selectedSensorId}
            onSelectSensor={setSelectedSensorId}
            scenario={currentScenario}
            onSelectScenario={setCurrentScenario}
            onBackToHome={() => handleTabChange('home')}
          />
        )}

        {currentTab === 'next' && (
          <NextView onSelectTab={handleTabChange} />
        )}
      </main>

      {/* Custom Precision Acoustic Cursor with Trail & Magnetic Physics */}
      <CustomCursor />

      {/* Project-Themed Acoustic Diagnostic Preloader */}
      {isPreloading && (
        <AcousticPreloader onComplete={() => setIsPreloading(false)} />
      )}

      {/* Site-wide formal academic Footer (Hidden in Dashboard) */}
      {currentTab !== 'dashboard' && (
        <Footer
          onSelectTab={handleTabChange}
          onOpenInspireBrief={() => setIsInspireModalOpen(true)}
          onReplayPreloader={() => setIsPreloading(true)}
        />
      )}

      {/* In-page INSPIRE-MANAK Brief Modal */}
      <InspireManakModal
        isOpen={isInspireModalOpen}
        onClose={() => setIsInspireModalOpen(false)}
        onSelectTab={handleTabChange}
      />
    </div>
  );
}
