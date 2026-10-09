import React from 'react';
import { DraftDesignProposal, ComplianceAuditItem } from '../types/electrical';
import { ShieldCheck, AlertTriangle, CheckCircle2, AlertCircle, FileCheck2 } from 'lucide-react';

interface ComplianceAuditViewProps {
  proposal: DraftDesignProposal;
}

export const ComplianceAuditView: React.FC<ComplianceAuditViewProps> = ({ proposal }) => {
  const { complianceAudit, engineeringWarnings, disclaimer, status } = proposal;

  return (
    <div className="space-y-6">
      {/* Human-in-the-loop Mandate Banner */}
      <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-xl p-4 shadow-lg flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-amber-200 tracking-wide uppercase">
              Core Operating Rule #4: Human-In-The-Loop Draft Proposal
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              STATUS: {status}
            </span>
          </div>
          <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </div>

      {/* Engineering Warnings & Special Alerts */}
      {engineeringWarnings && engineeringWarnings.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Special Engineering Warnings & Constraints Flagged by Rules Engine
          </h3>
          <div className="space-y-2">
            {engineeringWarnings.map((warn, wIdx) => (
              <div
                key={wIdx}
                className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-lg text-xs text-rose-200 flex items-start gap-2.5"
              >
                <span className="font-mono text-rose-400 font-bold shrink-0">[{wIdx + 1}]</span>
                <span>{warn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standards Compliance Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              Standards Compliance & Type 2 Coordination Audit
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic verification against IEC 60947 series and UL 508A standards.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {complianceAudit.filter((c) => c.status === 'COMPLIANT').length} Compliant
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              {complianceAudit.filter((c) => c.status !== 'COMPLIANT').length} Alerts
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {complianceAudit.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 transition hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-900/40 text-blue-300 border border-blue-700/50">
                    {item.standard}
                  </span>
                  <h4 className="text-xs font-bold text-white">
                    {item.title}
                  </h4>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                    item.status === 'COMPLIANT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : item.status === 'MARGINAL'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.status === 'COMPLIANT' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2 text-slate-300">
                <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800/60">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                    Standard Mandate ({item.ruleId})
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.requirement}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800/60">
                  <span className="text-[10px] uppercase font-mono text-blue-400 block mb-0.5">
                    Actual Design & Calculation Verification
                  </span>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-mono">
                    {item.actualDesign}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 mt-2 italic">
                Note: {item.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
