import React from 'react';
import { TabType, SimulationScenario } from '../types';
import { Activity, Beaker, Users, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';
import { PipeGuardLogo } from './PipeGuardLogo';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentScenario: SimulationScenario;
  onOpenQuickDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentScenario,
}) => {
  const getScenarioBadge = () => {
    switch (currentScenario) {
      case 'normal':
        return { label: 'ONLINE · NORMAL', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' };
      case 'small-leak':
        return { label: 'ALERT · MICRO-LEAK', color: 'bg-amber-500/10 text-amber-700 border-amber-300' };
      case 'large-leak':
        return { label: 'CRITICAL · RUPTURE', color: 'bg-red-500/10 text-red-700 border-red-300' };
      case 'disturbance':
        return { label: 'FILTERED · TRANSIENT', color: 'bg-blue-500/10 text-blue-700 border-blue-300' };
    }
  };

  const badge = getScenarioBadge();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <PipeGuardLogo className="w-10 h-10 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                  PIPEGUARD
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
                  INSPIRE-MANAK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono hidden md:block">
                External Leak Detection & Localization
              </p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              id="nav-home-btn"
              onClick={() => onSelectTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === 'home'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Home
            </button>

            <button
              id="nav-research-btn"
              onClick={() => onSelectTab('research')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === 'research'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Beaker className="w-3.5 h-3.5 text-cyan-600" />
              Research
            </button>

            <button
              id="nav-team-btn"
              onClick={() => onSelectTab('team')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === 'team'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Team
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => onSelectTab('dashboard')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-2 ${
                currentTab === 'dashboard'
                  ? 'bg-slate-900 text-cyan-300 shadow-sm'
                  : 'text-slate-800 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              id="nav-next-btn"
              onClick={() => onSelectTab('next')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                currentTab === 'next'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Next
            </button>
          </nav>

          {/* Right Action / Quick Live Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-medium ${badge.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {badge.label}
            </div>

            <button
              id="header-open-dashboard-btn"
              onClick={() => onSelectTab('dashboard')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Monitor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-1 text-xs">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${currentTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('research')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap flex items-center gap-1 ${currentTab === 'research' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            <Beaker className="w-3 h-3 text-cyan-400" />
            Research
          </button>
          <button
            onClick={() => onSelectTab('team')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${currentTab === 'team' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Team
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap flex items-center gap-1 ${currentTab === 'dashboard' ? 'bg-cyan-600 text-white font-bold' : 'text-cyan-700 bg-cyan-50'}`}
          >
            <LayoutDashboard className="w-3 h-3" />
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('next')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${currentTab === 'next' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Next 🚀
          </button>
        </div>
      </div>
    </header>
  );
};
