import React, { useEffect } from 'react';
import { Award, X, CheckCircle2, ShieldCheck, Cpu, Droplets, BookOpen, ExternalLink, Activity, ArrowRight } from 'lucide-react';
import { TabType } from '../types';
import { PipeGuardLogo } from './PipeGuardLogo';

interface InspireManakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
}

export const InspireManakModal: React.FC<InspireManakModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  // Prevent background scrolling when modal is open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inspire-modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-7 relative border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                National Science &amp; Technology Initiative
              </span>
              <div className="text-xs text-slate-300 font-mono">DST / National Innovation Foundation (NIF) India</div>
            </div>
          </div>

          <h2 id="inspire-modal-title" className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            INSPIRE-MANAK Project Brief
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Million Minds Augmenting National Aspiration and Knowledge (MANAK) — Fostering grassroots school student innovations addressing critical societal challenges.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50/50 rounded-xl border border-cyan-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-900 font-display font-bold text-base">
                <PipeGuardLogo className="w-5 h-5" />
                <span>PIPEGUARD Innovation Overview</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold">
                Innovation Nominee
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>PipeGuard</strong> is a non-invasive, low-cost external pipeline acoustic monitoring system conceived and built by <strong>Affan Adil</strong>. It solves the national problem of underground non-revenue municipal water losses (up to 40% in city distribution lines) without requiring expensive pipe excavation or pipe-wall drilling.
            </p>
          </div>

          {/* Key Objectives Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              Core Technical &amp; Societal Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Zero-Dig Water Conservation</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Preserves millions of liters of treated potable drinking water through rapid continuous vibration signature detection.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700 shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Affordable Piezoelectric Tech</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Reduces acoustic sensing costs by over 90% compared to imported industrial ultrasonic hydrophone systems.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">TDOA Precise Localization</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Uses cross-correlation time difference of arrival (TDOA) algorithm to pinpoint exact leak coordinates in centimeters.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Safe &amp; Non-Intrusive</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Clamps completely on the outer pipe wall with acoustic silicone coupling — zero contamination risk to drinking water.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mentorship & Institution Info */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 font-semibold">PROJECT LEAD &amp; MENTORSHIP</div>
              <div className="text-sm font-medium text-slate-200">
                Affan Adil • Guided by Arnab Poddar (Sir) &amp; Mrinmoy Chowhan (Sir, ATL)
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onSelectTab('team');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-colors shrink-0"
            >
              <span>View Team Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-mono text-[11px]">
            INSPIRE-MANAK Scheme • Department of Science &amp; Technology (DST)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSelectTab('research');
              }}
              className="px-3.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-200 font-medium transition-colors"
            >
              Read Full Research
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
            >
              Close Brief
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
