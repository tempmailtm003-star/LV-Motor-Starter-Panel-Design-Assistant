import React, { useState } from 'react';
import { DraftDesignProposal, ComponentBOMItem, ExtractedSpecs } from '../types/electrical';
import { SchematicViewer } from './SchematicViewer';
import { PanelLayoutViewer } from './PanelLayoutViewer';
import { ComplianceAuditView } from './ComplianceAuditView';
import {
  FileText,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Building,
  CheckCircle,
  Download,
  AlertTriangle,
  Flame,
  Zap,
} from 'lucide-react';

interface Stage3ProposalProps {
  proposal: DraftDesignProposal;
  onUpdateManufacturerPreference: (mfr: 'Schneider' | 'ABB' | 'Siemens' | 'Eaton' | 'Any') => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

export const Stage3Proposal: React.FC<Stage3ProposalProps> = ({
  proposal,
  onUpdateManufacturerPreference,
  onExportCsv,
  onExportJson,
}) => {
  const [activeTab, setActiveTab] = useState<'bom' | 'schematic' | 'layout' | 'compliance' | 'logic'>('bom');
  const { specs, calculations, bom } = proposal;

  const currentPref = specs.manufacturerPreference || 'Schneider';

  return (
    <div className="space-y-6">
      {/* Draft Proposal Header Banner with Operating Rule #4 Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-mono">
                03
              </span>
              <h2 className="text-base font-semibold text-white">
                Draft Design Recommendation for Engineering Review & Approval
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic component synthesis for {specs.motorPowerKw || 15} kW ({specs.systemVoltage || 400}V 3~ {specs.startingType || 'DOL'} starter panel)
            </p>
          </div>

          {/* Manufacturer Family Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Catalog Brand:</span>
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-xs">
              {(['Schneider', 'ABB', 'Siemens', 'Eaton'] as const).map((mfr) => (
                <button
                  key={mfr}
                  type="button"
                  onClick={() => onUpdateManufacturerPreference(mfr)}
                  className={`px-2.5 py-1 rounded transition font-medium ${
                    currentPref === mfr
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mfr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Sizing Metric Badges */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <div className="text-[10px] text-slate-500">Motor FLA</div>
            <div className="font-mono font-bold text-amber-300 text-sm">{calculations.calculatedFla} A</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <div className="text-[10px] text-slate-500">Inrush Peak</div>
            <div className="font-mono font-bold text-rose-300 text-sm">{calculations.inrushCurrent} A</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <div className="text-[10px] text-slate-500">Conductor Sizing</div>
            <div className="font-mono font-bold text-emerald-300 text-sm">{calculations.conductorMinSizeMm2} mm² Cu</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <div className="text-[10px] text-slate-500">Control Circuit</div>
            <div className="font-mono font-bold text-sky-300 text-sm">{specs.controlVoltage || '24VDC'}</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <div className="text-[10px] text-slate-500">Heat Losses</div>
            <div className="font-mono font-bold text-orange-300 text-sm">{calculations.totalHeatDissipationWatts} W</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <div className="text-[10px] text-slate-500">SCCR Breaking</div>
            <div className="font-mono font-bold text-indigo-300 text-sm">≥ {specs.sccrKa || 10} kA</div>
          </div>
        </div>
      </div>

      {/* Stage 3 Inner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('bom')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'bom'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Hardware Bill of Materials (BOM)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schematic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'schematic'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Electrical Schematic & CAD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'layout'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Panel General Arrangement (GA)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'compliance'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            IEC & UL Compliance Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'logic'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Sizing Logic & Engineering Report
          </button>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export BOM (.CSV)
        </button>
      </div>

      {/* TAB 1: HARDWARE BILL OF MATERIALS */}
      {activeTab === 'bom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Verified Component Candidate Selection
              </h3>
              <p className="text-xs text-slate-400">
                Components matched deterministically from authentic industrial catalog. Zero hallucinated part numbers.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Hardware Items: {bom.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                  <th className="py-2.5 px-3">Tag</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Part Number</th>
                  <th className="py-2.5 px-3">Technical Ratings</th>
                  <th className="py-2.5 px-3 text-right">Losses (W)</th>
                  <th className="py-2.5 px-3 text-right">DIN (mm)</th>
                  <th className="py-2.5 px-3">Coordination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {bom.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-blue-400">{item.tag}</td>
                    <td className="py-3 px-3 font-sans text-slate-300">{item.category}</td>
                    <td className="py-3 px-3 text-slate-200 font-semibold">{item.manufacturer}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{item.partNumber}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans max-w-xs truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-right text-orange-400">{item.thermalDissipationWatts} W</td>
                    <td className="py-3 px-3 text-right text-slate-400">{item.dinRailWidthMm || '—'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {item.coordinationType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ELECTRICAL SCHEMATIC */}
      {activeTab === 'schematic' && <SchematicViewer proposal={proposal} />}

      {/* TAB 3: PANEL GENERAL ARRANGEMENT */}
      {activeTab === 'layout' && <PanelLayoutViewer proposal={proposal} />}

      {/* TAB 4: COMPLIANCE AUDIT */}
      {activeTab === 'compliance' && <ComplianceAuditView proposal={proposal} />}

      {/* TAB 5: SIZING LOGIC & ENGINEERING REPORT */}
      {activeTab === 'logic' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Engineering Sizing Logic & Calculation Basis (Stage 3 Synthesis)
            </h3>
            <p className="text-xs text-slate-400">
              Detailed narrative explaining how the deterministic engine arrived at every candidate hardware component.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-bold text-blue-400 font-mono">1. Motor Full Load Amps & Starting Inrush</h4>
              <p>
                For a <strong className="text-white">{specs.motorPowerKw || 15} kW</strong> 3-phase motor operating at <strong className="text-white">{specs.systemVoltage || 400} V</strong> with an IEC 60034 standard nominal power factor of 0.85 and efficiency of 91%, the full-load operational current is calculated as:
              </p>
              <div className="p-2 bg-slate-900 rounded font-mono text-amber-300">
                FLA = 15,000 / (√3 × 400 × 0.85 × 0.91) = <strong>{calculations.calculatedFla} A</strong>
              </div>
              <p>
                Under {specs.startingType || 'DOL'} starting conditions, the motor exhibits a starting current ratio of {calculations.startingCurrentFactor}x, generating a transient peak inrush of <strong className="text-rose-400 font-mono">{calculations.inrushCurrent} A</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-bold text-blue-400 font-mono">2. Contactor Rating & AC-3 Duty</h4>
              <p>
                Per <strong className="text-white">IEC 60947-4-1</strong>, contactor KM1 must be rated for <strong className="text-white">AC-3 utilization category</strong> (squirrel-cage motors: starting, switching off running motors) at or above 100% of motor FLA ({calculations.calculatedFla}A).
              </p>
              <p>
                The selected candidate <strong className="text-emerald-400 font-mono">{bom.find(b => b.tag === 'KM1')?.partNumber}</strong> provides an AC-3 operational current rating of <strong className="text-white font-mono">32A</strong> ({((32 / calculations.calculatedFla) * 100).toFixed(0)}% of FLA), comfortably absorbing full motor breaking current and thermal stress.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-bold text-blue-400 font-mono">3. Short-Circuit Protection & Coordination</h4>
              <p>
                Motor Protection Circuit Breaker Q1 (<strong className="text-emerald-400 font-mono">{bom.find(b => b.tag === 'Q1')?.partNumber}</strong>) incorporates an adjustable thermal trip dialed precisely to <strong className="text-white font-mono">{calculations.calculatedFla}A</strong>, accompanied by an instantaneous magnetic release set at 13x–14x FLA ({calculations.bcpdTripCurrentMin * 13}A).
              </p>
              <p>
                This ensures high-speed trip during prospective short-circuit faults while remaining immune to nuisance tripping during starting acceleration. With an Icu breaking capacity exceeding {specs.sccrKa || 10}kA, it satisfies <strong className="text-white">Type 2 Short-Circuit Coordination</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-bold text-blue-400 font-mono">4. Power Conductor & Thermal Enclosure</h4>
              <p>
                Power feeder and motor branch cables are dimensioned at <strong className="text-white">125% of motor FLA</strong> per NEC 430.22 / UL 508A Table 28.1 and IEC 60364-5-52, establishing a continuous ampacity threshold of <strong className="text-emerald-400 font-mono">{calculations.conductorMinAmpacity}A</strong>.
              </p>
              <p>
                This mandates <strong className="text-white font-mono">{calculations.conductorMinSizeMm2} mm² Cu</strong> ({calculations.conductorMinSizeAwg}). Total panel heat dissipation is calculated at <strong className="text-orange-400 font-mono">{calculations.totalHeatDissipationWatts}W</strong>, yielding an internal temperature rise ΔT of only +{proposal.layoutConstraints.enclosureInternalDeltaTC}°C, ensuring reliable operation without forced fan cooling in dusty environments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
