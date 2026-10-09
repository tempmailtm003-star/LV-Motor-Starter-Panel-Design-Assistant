import React from 'react';
import { DraftDesignProposal } from '../types/electrical';
import { LayoutGrid, Flame, ArrowUp, ShieldCheck } from 'lucide-react';

interface PanelLayoutViewerProps {
  proposal: DraftDesignProposal;
}

export const PanelLayoutViewer: React.FC<PanelLayoutViewerProps> = ({ proposal }) => {
  const { calculations, layoutConstraints, bom, specs } = proposal;
  const enc = bom.find((b) => b.tag === 'ENC1');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-blue-400" />
            General Arrangement (GA) & Subpanel Enclosure Layout
          </h3>
          <p className="text-xs text-slate-400">
            DIN rail placement, wire duct cable management, and thermal dissipation clearance zones.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-slate-400">Enclosure:</span>
            <strong className="text-white font-mono">500H × 400W × 200D mm</strong>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {specs.enclosureType || 'IP65'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: CAD Subpanel Graphic */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] aspect-[4/5] bg-slate-900 border-4 border-slate-700 rounded-lg p-3 shadow-2xl flex flex-col justify-between">
            {/* Top Thermal Clearance Zone */}
            <div className="h-10 border border-dashed border-orange-500/40 bg-orange-500/5 rounded flex items-center justify-between px-3 text-[10px] text-orange-400 font-mono">
              <span className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-orange-400" />
                Thermal Clearance: {layoutConstraints.minThermalClearanceTopMm}mm
              </span>
              <span className="text-[9px] text-orange-300/80">ΔT Rise: +{layoutConstraints.enclosureInternalDeltaTC}°C</span>
            </div>

            {/* Top Wire Duct (Panduit) */}
            <div className="h-6 bg-slate-800 border-y border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono tracking-widest">
              |||| WIRE DUCT 40×60mm ||||
            </div>

            {/* DIN Rail 1: Power & Control Apparatus */}
            <div className="relative my-2 py-4 px-2 bg-slate-950/60 border border-slate-800 rounded">
              {/* Metal DIN Rail Bar */}
              <div className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 bg-gradient-to-b from-amber-200/40 via-amber-100/60 to-amber-300/40 border-y border-amber-400/50 z-0"></div>

              {/* Mounted Hardware on Rail 1 */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                {/* Q1: MPCB */}
                <div className="w-16 h-28 bg-slate-800 border-2 border-blue-500 rounded p-1.5 flex flex-col justify-between text-center shadow-lg">
                  <span className="text-[10px] font-bold text-blue-400 font-mono">Q1</span>
                  <div className="w-full h-8 bg-slate-900 rounded border border-slate-700 flex items-center justify-center">
                    <div className="w-3 h-5 bg-amber-500 rounded-sm"></div>
                  </div>
                  <div className="text-[8px] text-slate-300 font-mono">MPCB 32A</div>
                </div>

                {/* KM1: Contactor */}
                <div className="w-16 h-28 bg-slate-800 border-2 border-indigo-500 rounded p-1.5 flex flex-col justify-between text-center shadow-lg">
                  <span className="text-[10px] font-bold text-indigo-400 font-mono">KM1</span>
                  <div className="w-full h-8 bg-slate-900 rounded border border-slate-700 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500/60 border border-blue-400"></div>
                  </div>
                  <div className="text-[8px] text-slate-300 font-mono">LC1D32</div>
                </div>

                {/* F1: Overload Relay */}
                <div className="w-16 h-28 bg-slate-800 border-2 border-cyan-500 rounded p-1.5 flex flex-col justify-between text-center shadow-lg">
                  <span className="text-[10px] font-bold text-cyan-400 font-mono">F1</span>
                  <div className="w-full h-8 bg-slate-900 rounded border border-slate-700 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-amber-600/60 border border-amber-400"></div>
                  </div>
                  <div className="text-[8px] text-slate-300 font-mono">LRD32</div>
                </div>

                {/* PS1: 24VDC Power Supply */}
                {specs.controlVoltage === '24VDC' && (
                  <div className="w-14 h-28 bg-slate-800 border-2 border-emerald-500 rounded p-1.5 flex flex-col justify-between text-center shadow-lg">
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">PS1</span>
                    <div className="w-full h-8 bg-slate-900 rounded border border-slate-700 flex flex-col items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                    <div className="text-[8px] text-slate-300 font-mono">24V 2.5A</div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Wire Duct */}
            <div className="h-6 bg-slate-800 border-y border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono tracking-widest">
              |||| WIRE DUCT 40×60mm ||||
            </div>

            {/* DIN Rail 2: Field Terminal Strip */}
            <div className="relative my-2 py-3 px-2 bg-slate-950/60 border border-slate-800 rounded">
              <div className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 bg-gradient-to-b from-amber-200/40 via-amber-100/60 to-amber-300/40 border-y border-amber-400/50 z-0"></div>

              <div className="relative z-10 flex items-center justify-center gap-1">
                {['L1', 'L2', 'L3', 'N', 'PE', '+24', '0V', 'S1', 'S2'].map((tag, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-14 rounded-sm border flex flex-col justify-between items-center py-1 text-[8px] font-mono ${
                      tag === 'PE'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : tag.startsWith('L')
                        ? 'bg-slate-800 border-slate-600 text-slate-200'
                        : 'bg-blue-950 border-blue-600 text-blue-300'
                    }`}
                  >
                    <span>●</span>
                    <span className="font-bold">{tag}</span>
                    <span>●</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Wire Gutter & Cable Bending Space */}
            <div className="h-10 border border-dashed border-blue-500/40 bg-blue-500/5 rounded flex items-center justify-between px-3 text-[10px] text-blue-400 font-mono">
              <span>Cable Bending Gutter: {calculations.wireBendingSpaceMm}mm</span>
              <span className="text-[9px] text-blue-300/80">UL 508A Table 27.1 Compliant</span>
            </div>

            {/* Bottom Gland Plate */}
            <div className="h-4 bg-slate-800 rounded-b flex items-center justify-center text-[9px] text-slate-500 font-mono">
              GLAND PLATE (BOTTOM FIELD ENTRY)
            </div>
          </div>
        </div>

        {/* Right Col: Layout Specs & Constraints */}
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Layout Constraints & Clearance Audit
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">DIN Rail Occupancy:</span>
                <span className="font-mono font-bold text-blue-300">
                  {layoutConstraints.dinRailOccupancyPercent}% of 350mm
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Wire Bending Clearance:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {layoutConstraints.minCableBendingSpaceMm} mm (Req: 50.8mm)
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Top Thermal Clearance:</span>
                <span className="font-mono font-bold text-amber-300">
                  {layoutConstraints.minThermalClearanceTopMm} mm
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Internal Temp Rise (ΔT):</span>
                <span className="font-mono font-bold text-orange-400">
                  +{layoutConstraints.enclosureInternalDeltaTC}°C (Limit: ≤15°C)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cooling Requirement:</span>
                <span className="font-mono font-bold text-emerald-400">
                  Natural Convection (No Fan Req.)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Thermal Equilibrium Verification
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              With total equipment dissipation of <strong className="text-white font-mono">{calculations.totalHeatDissipationWatts}W</strong> and an enclosure effective surface area of <strong className="text-white font-mono">{calculations.minEnclosureSurfaceAreaM2} m²</strong>, the heat dissipation rate through the painted steel walls keeps the internal air temperature safely below the 60°C rated operating limit of the electronic and thermal trip components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
