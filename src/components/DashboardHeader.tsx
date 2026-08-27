import React, { useState } from 'react';
import { 
  Bell, 
  ShieldCheck, 
  AlertTriangle, 
  X,
  Radio
} from 'lucide-react';
import { SimulationScenario } from '../types';

interface DashboardHeaderProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
  scenario: SimulationScenario;
  unreadAlertsCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  demoMode,
  onToggleDemoMode,
  scenario,
  unreadAlertsCount = 1,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 select-none shadow-2xs">
      {/* Left: ONLY Demo Mode Toggle switch */}
      <div className="flex items-center gap-3">
        <button
          id="header-demo-toggle-switch"
          type="button"
          onClick={onToggleDemoMode}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            demoMode ? 'bg-sky-600' : 'bg-slate-300'
          }`}
          role="switch"
          aria-checked={demoMode}
          title="Toggle Demo Mode"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              demoMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Demo Mode
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
            {demoMode ? 'SIMULATED DATA' : 'LIVE HARDWARE'}
          </span>
        </div>
      </div>

      {/* Right: Network Status & Alert Telemetry Log */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600">
          <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
          <span>4-Node Acoustic Bus Active</span>
        </div>

        {/* Bell Notification */}
        <div className="relative">
          <button
            id="dashboard-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer border border-slate-200"
            title="Telemetry Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold font-mono text-slate-800 uppercase">
                  Acoustic Telemetry Log
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold">4-Node Network Synchronized</div>
                    <div className="text-[10px] text-sky-700">PG-01 to PG-04 piezoelectric bus connected.</div>
                  </div>
                </div>

                {scenario !== 'normal' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold">Turbulence Anomaly Detected</div>
                      <div className="text-[10px] text-amber-700">Sector Beta (2.2m) deviation recorded.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
