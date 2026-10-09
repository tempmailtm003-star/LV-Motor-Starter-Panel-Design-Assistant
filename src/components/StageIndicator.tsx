import React from 'react';
import { Search, Calculator, CheckCircle2, ChevronRight } from 'lucide-react';

interface StageIndicatorProps {
  currentStage: 1 | 2 | 3;
  onSelectStage: (stage: 1 | 2 | 3) => void;
  hasMissingParams: boolean;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  currentStage,
  onSelectStage,
  hasMissingParams,
}) => {
  const stages = [
    {
      num: 1 as const,
      label: 'Stage 1: Intent Extraction & Requirement Audit',
      sub: hasMissingParams ? 'Clarification Required' : 'Audit Complete',
      icon: Search,
      badge: hasMissingParams ? 'Ambiguities Detected' : 'Audited',
      badgeColor: hasMissingParams ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300',
    },
    {
      num: 2 as const,
      label: 'Stage 2: Deterministic Calculation Request',
      sub: 'Rules Engine & Formulas',
      icon: Calculator,
      badge: 'Deterministic',
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      num: 3 as const,
      label: 'Stage 3: Proposal Synthesis & Compliance',
      sub: 'BOM, Schematic & Layout',
      icon: CheckCircle2,
      badge: 'Engineering Draft',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 sm:p-3 my-4 backdrop-blur shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isActive = currentStage === stg.num;
          const isPassed = currentStage > stg.num;

          return (
            <button
              key={stg.num}
              type="button"
              onClick={() => onSelectStage(stg.num)}
              className={`flex items-center justify-between p-3 rounded-lg text-left transition border ${
                isActive
                  ? 'bg-blue-950/40 border-blue-600/50 text-white shadow-sm ring-1 ring-blue-500/30'
                  : isPassed
                  ? 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
                  : 'bg-slate-900/30 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 font-bold text-xs ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isPassed
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate text-slate-100">
                    {stg.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {stg.sub}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ml-2 ${stg.badgeColor}`}>
                {stg.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
