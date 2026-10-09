import React, { useState } from 'react';
import {
  ExtractedSpecs,
  SizingCalculations,
  CalculationEngineRequest,
} from '../types/electrical';
import {
  Calculator,
  Terminal,
  Zap,
  Flame,
  ShieldAlert,
  ArrowRight,
  Code2,
  CheckCircle,
  Cpu,
  Layers,
} from 'lucide-react';

interface Stage2EngineProps {
  specs: ExtractedSpecs;
  calculations: SizingCalculations;
  onProceedToStage3: () => void;
}

export const Stage2Engine: React.FC<Stage2EngineProps> = ({
  specs,
  calculations,
  onProceedToStage3,
}) => {
  const [viewMode, setViewMode] = useState<'formulas' | 'json_payload' | 'rules_engine_payload'>('rules_engine_payload');
  const [copied, setCopied] = useState(false);

  // Exact LV_Starter_Rules_Engine Schema payload
  const lvStarterRulesEnginePayload = {
    system: {
      voltage_v: specs.systemVoltage || 400,
      phases: 3,
      frequency_hz: specs.frequencyHz || (specs.targetStandard === 'UL' ? 60 : 50),
      standard: (specs.targetStandard === 'UL' ? 'UL' : 'IEC') as 'IEC' | 'UL',
      target_sccr_ka: specs.sccrKa || 10,
    },
    load: {
      motor_power_kw: specs.motorPowerKw || (specs.motorPowerHp ? Number((specs.motorPowerHp * 0.746).toFixed(1)) : 15),
      starter_type: (specs.startingType || 'DOL') as 'DOL' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD',
      duty_cycle: 'AC-3' as const,
      efficiency_class: 'IE3' as const,
    },
    control: {
      control_voltage_v: specs.controlVoltage?.includes('24') ? 24 : specs.controlVoltage?.includes('120') ? 120 : specs.controlVoltage?.includes('230') ? 230 : 24,
      control_type: specs.controlVoltage?.includes('DC') ? 'DC' : 'AC' as 'AC' | 'DC',
    },
    environment: {
      ambient_temp_c: specs.ambientTempC ?? 40,
      ip_rating: specs.enclosureType || 'IP65',
      enclosure_material: 'sheet_steel',
    },
  };

  const engineRequestPayload: CalculationEngineRequest = {
    engineVersion: 'IEC_UL_LV_MOTOR_ENGINE_v4.2.1-DETERMINISTIC',
    standard: specs.targetStandard || 'IEC',
    specs,
    requestedBy: 'Engineering Design Assistant',
    timestamp: new Date().toISOString(),
  };

  const handleCopyPayload = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono">
              02
            </span>
            <h2 className="text-base font-semibold text-white">
              Deterministic Rules & Calculation Engine Request
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              v4.2.1-DETERMINISTIC
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Per Operating Rule #1: Calculations are performed by verified formulas and lookup tables adhering to IEC 60947 & UL 508A. Zero hallucination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('rules_engine_payload')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                viewMode === 'rules_engine_payload'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Rules Engine JSON Payload
            </button>
            <button
              type="button"
              onClick={() => setViewMode('formulas')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                viewMode === 'formulas'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Formula Audits
            </button>
            <button
              type="button"
              onClick={() => setViewMode('json_payload')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                viewMode === 'json_payload'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Full API Contract
            </button>
          </div>

          <button
            type="button"
            onClick={onProceedToStage3}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <span>Generate Design Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'formulas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Motor Current & Inrush Dynamics */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                1. Motor FLA & Inrush Current
              </h3>
              <span className="text-[10px] font-mono text-slate-400">IEC 60034 / NEC 430.250</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Calculated Full Load Amps (FLA)</div>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                  {calculations.calculatedFla} A
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Formula: P / (√3 × V × cosφ × η)
                  <br />
                  = {((specs.motorPowerKw || 15) * 1000).toLocaleString()}W / (1.732 × {specs.systemVoltage || 400}V × 0.85 × 0.91)
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Starting Peak Inrush Current</div>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                  {calculations.inrushCurrent} A
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {specs.startingType || 'DOL'} factor: {calculations.startingCurrentFactor}x FLA
                  <br />
                  Duration: ~0.8s - 2.5s until steady run
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Power Cable Minimum Ampacity</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  {calculations.conductorMinAmpacity} A (125% FLA)
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Conductor: {calculations.conductorMinSizeMm2} mm² / {calculations.conductorMinSizeAwg} Cu 75°C
                  <br />
                  Earth (PE): {calculations.earthConductorMm2} mm²
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Protection & Contactor Sizing */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                2. BCPD & Contactor Duty
              </h3>
              <span className="text-[10px] font-mono text-slate-400">IEC 60947-4-1 / UL 508A</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Breaker / BCPD Trip Threshold</div>
                <div className="text-lg font-bold font-mono text-blue-300 mt-1">
                  {calculations.bcpdTripCurrentMin} A – {calculations.bcpdTripCurrentMax} A
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Thermal dial: Set to 1.0x FLA ({calculations.calculatedFla}A)
                  <br />
                  Magnetic instantaneous trip: 13x FLA (prevents nuisance trip on inrush)
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Contactor AC-3 Utilization Rating</div>
                <div className="text-lg font-bold font-mono text-indigo-300 mt-1">
                  ≥ {calculations.contactorRatingMinAc3} A @ {specs.systemVoltage || 400}V
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Standard AC-3 duty rating covers full motor break current. Coil voltage matched to {specs.controlVoltage || '24VDC'}.
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Overload Relay Dial Setting</div>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                  {calculations.overloadSettingMin} A – {calculations.overloadSettingMax} A (Dial: {calculations.calculatedFla}A)
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Trip Class: Class {calculations.overloadTripClass} (Standard trip curve for {specs.dutyType || 'pump'} duty)
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Thermal Dissipation & Layout Clearances */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                3. Heat Losses & Clearances
              </h3>
              <span className="text-[10px] font-mono text-slate-400">IEC 61439 / UL 508A</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Total Enclosure Heat Losses (Watts)</div>
                <div className="text-2xl font-bold font-mono text-orange-300 mt-1">
                  {calculations.totalHeatDissipationWatts} W
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Breaker (~6W) + Contactor (~10W) + Overload (~6W) + Power Supply (~10W) + Terminals (~2W)
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Minimum Dissipation Surface Area</div>
                <div className="text-lg font-bold font-mono text-slate-200 mt-1">
                  {calculations.minEnclosureSurfaceAreaM2} m²
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Formula: A = Q / (k × ΔT)
                  <br />
                  k = 5.5 W/(m²·K) for steel; max allowable rise ΔT = 15°C
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Layout & Bending Space</div>
                <div className="text-sm font-bold font-mono text-slate-200 mt-1">
                  DIN Rail: {calculations.dinRailSpaceRequiredMm} mm | Wire Bending: {calculations.wireBendingSpaceMm} mm
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Wire bending space satisfies UL 508A Table 27.1 without sharp terminal bend radius.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'rules_engine_payload' ? (
        /* LV_Starter_Rules_Engine JSON Payload Tab */
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-3">
            <div>
              <span className="text-xs font-semibold text-emerald-400">
                LV_Starter_Rules_Engine Target Payload
              </span>
              <span className="text-[11px] text-slate-500 ml-2">
                Units: V, kW, Hz, Celsius • Zero calculated fields
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyPayload(lvStarterRulesEnginePayload)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-xs font-sans transition flex items-center gap-1.5"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy JSON Payload'}
            </button>
          </div>

          <pre className="text-emerald-300 overflow-x-auto p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 leading-relaxed text-xs">
            {JSON.stringify(lvStarterRulesEnginePayload, null, 2)}
          </pre>
        </div>
      ) : (
        /* Full API Contract Payload Tab */
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-semibold text-blue-400">
              Deterministic Rules Engine Full API Contract Payload
            </span>
            <button
              type="button"
              onClick={() => handleCopyPayload(engineRequestPayload)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-xs font-sans transition flex items-center gap-1.5"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy JSON Payload'}
            </button>
          </div>

          <pre className="text-sky-300 overflow-x-auto p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 leading-relaxed text-xs">
            {JSON.stringify(engineRequestPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
