import React from 'react';
import { ShieldCheck, Cpu, AlertTriangle, FileText, Download, Printer } from 'lucide-react';
import { TargetStandard } from '../types/electrical';

interface HeaderProps {
  standard: TargetStandard;
  onStandardChange: (std: TargetStandard) => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  standard,
  onStandardChange,
  onExportJson,
  onExportCsv,
  onPrint,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  LV Motor Starter Panel Design Assistant
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DRAFT RECOMMENDATION ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deterministic Sizing Engine • IEC 60947 & UL 508A / UL 60947-4-1
              </p>
            </div>
          </div>

          {/* Standard Toggle & Core Rules Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => onStandardChange('IEC')}
                className={`px-3 py-1 rounded font-medium transition ${
                  standard === 'IEC'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                IEC 60947
              </button>
              <button
                type="button"
                onClick={() => onStandardChange('UL')}
                className={`px-3 py-1 rounded font-medium transition ${
                  standard === 'UL'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                UL 508A
              </button>
              <button
                type="button"
                onClick={() => onStandardChange('DUAL')}
                className={`px-3 py-1 rounded font-medium transition ${
                  standard === 'DUAL'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dual IEC/UL
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onExportJson}
                title="Export Structured JSON Payload"
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">JSON</span>
              </button>
              <button
                type="button"
                onClick={onExportCsv}
                title="Export BOM as CSV"
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">BOM CSV</span>
              </button>
              <button
                type="button"
                onClick={onPrint}
                title="Print Engineering Design Sheet"
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Deterministic Guardrail Banner */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-y-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Strict Determinism: Engine Formulas & Catalog Only
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-sky-400">
              <Cpu className="w-3.5 h-3.5" />
              Zero Hallucination: Real Manufacturer Parts
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Human-In-The-Loop: Requires Licensed PE Verification
          </div>
        </div>
      </div>
    </header>
  );
};
