import React from 'react';
import { TabType } from '../types';
import { TEAM_MEMBERS, PROJECT_MOTIVATION } from '../data/researchData';
import { User, Award, ArrowRight, Lightbulb, ShieldCheck, ExternalLink } from 'lucide-react';

interface TeamViewProps {
  onSelectTab: (tab: TabType) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 👤 HEADER */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-medium">
          <User className="w-3.5 h-3.5" />
          <span>PROJECT CREATOR &amp; ACADEMIC MENTORSHIP</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          The Creator &amp; Mentorship Team
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 font-medium">
          Passionate about turning practical science into tangible solutions for municipal water conservation.
        </p>
      </section>

      {/* LEAD CREATOR SPOTLIGHT */}
      <section className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Creator Avatar & Badge */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white shadow-xl border-2 border-cyan-400/40 relative">
                <span className="text-3xl sm:text-4xl font-bold font-display tracking-tight">AA</span>
                <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-widest mt-0.5 font-semibold">Innovator</span>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-slate-950 text-cyan-300 border border-slate-700 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                <Award className="w-3 h-3 text-amber-400" />
                INSPIRE
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Affan Adil
              </h2>
              <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wide mt-0.5">
                STUDENT RESEARCHER / INNOVATOR
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                INSPIRE-MANAK Project Lead
              </div>
            </div>
          </div>

          {/* Bio & Project Context */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                ABOUT THE INNOVATOR
              </div>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                Working on <span className="text-cyan-300 font-semibold">PipeGuard</span> as an INSPIRE-MANAK innovation project focused on water conservation, low-cost sensing, and practical infrastructure monitoring.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider">
                CORE TECHNICAL FOCUS
              </div>
              <p className="text-slate-400 leading-relaxed">
                Acoustic waveguide design, piezoelectric vibration transduction, dynamic baseline tracking firmware, and multi-node spatial localization algorithms for urban pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS PROJECT? */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>ORIGIN &amp; MOTIVATION</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Why this project?
          </h2>

          <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 text-cyan-950 font-medium text-base sm:text-lg italic leading-relaxed">
            "{PROJECT_MOTIVATION.quote}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed pt-2">
          <p>{PROJECT_MOTIVATION.paragraphs[0]}</p>
          <p>{PROJECT_MOTIVATION.paragraphs[2]}</p>
        </div>
      </section>

      {/* FULL TEAM & INSTITUTION */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
            COLLABORATIVE STRUCTURE
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Team &amp; Academic Support
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl">
            Mentorship, scientific review, and Atal Tinkering Lab (ATL) facilities supporting the iterative fabrication and experimental evaluation of PipeGuard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-cyan-300 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-bold text-sm border border-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                    {member.avatarInitials === 'AA' && <span className="text-cyan-400 font-display font-bold">AA</span>}
                    {member.avatarInitials === 'AP' && <span className="text-emerald-400 font-display font-bold">AP</span>}
                    {member.avatarInitials === 'MC' && <span className="text-amber-400 font-display font-bold">MC</span>}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    {member.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900">
                    {member.name}
                  </h4>
                  <div className="text-xs font-mono text-cyan-700 font-semibold mt-0.5">
                    {member.role}
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {'portfolio' in member && member.portfolio && (
                  <div className="pt-2">
                    <a
                      href={member.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-mono font-semibold transition-colors group/link"
                    >
                      <span>View Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform text-cyan-600" />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                <span className="text-slate-400">Responsibility: </span>
                <span className="text-slate-700">{member.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA to Dashboard */}
      <section className="bg-slate-100 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-base text-slate-900">
            Explore the Live Working Prototype
          </h4>
          <p className="text-xs text-slate-600">
            Interact with the real-time simulation dashboard and multi-sensor network.
          </p>
        </div>
        <button
          onClick={() => onSelectTab('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </section>
    </div>
  );
};
