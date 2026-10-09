import React from 'react';
import { ExtractedSpecs } from '../types/electrical';
import {
  AlertTriangle,
  Thermometer,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Info,
  ArrowRight,
} from 'lucide-react';

interface EngineeringValidationAlertsProps {
  specs: ExtractedSpecs;
  onApplyRecommendation: (key: keyof ExtractedSpecs, value: any) => void;
}

export interface ParameterRangeAlert {
  id: string;
  severity: 'WARNING' | 'CAUTION' | 'INFO';
  parameter: string;
  title: string;
  triggerCondition: string;
  engineeringImpact: string;
  standardReference: string;
  deratingDetails?: {
    factor: number;
    nominalAmps?: number;
    deratedAmps?: number;
    explanation: string;
  };
  recommendationAction?: {
    label: string;
    targetKey: keyof ExtractedSpecs;
    targetValue: any;
  };
}

export const EngineeringValidationAlerts: React.FC<EngineeringValidationAlertsProps> = ({
  specs,
  onApplyRecommendation,
}) => {
  const alerts: ParameterRangeAlert[] = [];

  const ambientTemp = specs.ambientTempC ?? 40;
  const powerKw = specs.motorPowerKw || (specs.motorPowerHp ? specs.motorPowerHp * 0.746 : 15);
  const startingType = specs.startingType || 'DOL';
  const controlVolt = specs.controlVoltage || '24VDC';
  const systemVolt = specs.systemVoltage || 400;
  const sccr = specs.sccrKa || 10;
  const enclosure = specs.enclosureType || 'IP65';
  const targetStd = specs.targetStandard || 'IEC';

  // 1. Ambient Temperature Range Validation (> 40°C)
  if (ambientTemp > 40) {
    let derateFactor = 0.95;
    if (ambientTemp >= 60) derateFactor = 0.80;
    else if (ambientTemp >= 55) derateFactor = 0.85;
    else if (ambientTemp >= 50) derateFactor = 0.90;
    else if (ambientTemp >= 45) derateFactor = 0.95;
    else {
      derateFactor = Number((1 - ((ambientTemp - 40) * 0.01)).toFixed(2));
    }

    alerts.push({
      id: 'temp_high',
      severity: ambientTemp >= 50 ? 'WARNING' : 'CAUTION',
      parameter: `Ambient Temperature: ${ambientTemp}°C`,
      title: 'Elevated Ambient Temperature Requires Continuous Thermal Derating',
      triggerCondition: `Tamb (${ambientTemp}°C) > 40°C Standard Test Calibration Baseline`,
      standardReference: 'IEC 60947-2 (Annex B) & UL 508A Table 28.1 / NEC 310.15(B)(2)',
      engineeringImpact: `Bimetallic thermal overload relays, electronic releases, and power cables experience reduced convective heat dissipation. Device nominal current must be multiplied by derating factor k = ${derateFactor} (${Math.round((1 - derateFactor) * 100)}% capacity reduction).`,
      deratingDetails: {
        factor: derateFactor,
        explanation: `At ${ambientTemp}°C, thermal trip calibration shifts earlier by approx. ${(1 / derateFactor * 100 - 100).toFixed(1)}%. An upstream 32A breaker carries only ${(32 * derateFactor).toFixed(1)}A continuously without nuisance thermal tripping.`,
      },
    });
  } else if (ambientTemp < 0) {
    alerts.push({
      id: 'temp_low',
      severity: 'CAUTION',
      parameter: `Ambient Temperature: ${ambientTemp}°C`,
      title: 'Sub-Zero Ambient Risk: Contactor Lubrication Freezing & Condensation',
      triggerCondition: `Tamb (${ambientTemp}°C) < 0°C Sub-freezing environment`,
      standardReference: 'IEC 60947-1 Clause 6.1.1 (Standard ambient limit: -5°C to +40°C)',
      engineeringImpact: 'Low temperatures stiffen mechanical armature grease and increase coil pull-in dropouts. Additionally, rapid warm-up cycles produce internal condensation causing flashovers.',
      deratingDetails: {
        factor: 1.0,
        explanation: 'Enclosure must be fitted with an internal thermostatically-controlled anti-condensation space heater (typically 50W-100W PTC ceramic strip heater).',
      },
    });
  }

  // 2. High Inrush DOL Start for Motors > 15 kW
  if (powerKw > 15 && startingType === 'DOL') {
    const estFla = Number((powerKw * 1000 / (1.732 * systemVolt * 0.85 * 0.91)).toFixed(1));
    const estInrush = Number((estFla * 7.2).toFixed(1));

    alerts.push({
      id: 'dol_high_kw',
      severity: powerKw >= 30 ? 'WARNING' : 'CAUTION',
      parameter: `Motor Power: ${powerKw} kW (${(powerKw / 0.746).toFixed(0)} HP) on DOL`,
      title: 'High DOL Inrush Current: Grid Voltage Dip & Mechanical Stress Risk',
      triggerCondition: `Motor rating (${powerKw} kW) exceeds recommended DOL threshold (≤ 15 kW)`,
      standardReference: 'IEC 60947-4-1 AC-3 Duty / IEEE 519 Utility Voltage Distortion Limits',
      engineeringImpact: `Direct-on-line start draws ~${estInrush}A peak inrush (${estFla}A FLA × 7.2). This produces severe voltage sag on the LV distribution bus, causing contactor chattering and conveyor / pump shaft mechanical shear.`,
      deratingDetails: {
        factor: 7.2,
        explanation: `Estimated starting peak: ${estInrush}A. Utility regulations commonly mandate reduced voltage starting for motors > 11kW or 15kW unless fed by dedicated distribution transformer.`,
      },
      recommendationAction: {
        label: 'Switch to Star-Delta Starter (Cuts inrush to ~2.4x FLA)',
        targetKey: 'startingType',
        targetValue: 'STAR_DELTA',
      },
    });
  }

  // 3. Control Voltage Safety Touch Potential
  if (controlVolt === '230VAC' || controlVolt === '120VAC') {
    alerts.push({
      id: 'control_touch',
      severity: 'INFO',
      parameter: `Control Voltage: ${controlVolt}`,
      title: 'Operator Safety: Consider Safety Extra-Low Voltage (24VDC SELV)',
      triggerCondition: `Control circuit operates at line potential (${controlVolt}) on door-mounted pushbuttons`,
      standardReference: 'IEC 60204-1 Clause 9.1.2 & NFPA 79 Section 8.2',
      engineeringImpact: 'Modern industrial machinery and operator pushbuttons are strongly recommended to utilize 24VDC SELV / PELV to protect maintenance personnel from electric shock during field washdown or moist operation.',
      recommendationAction: {
        label: 'Upgrade to 24V DC SELV (Includes SMPS Power Supply)',
        targetKey: 'controlVoltage',
        targetValue: '24VDC',
      },
    });
  }

  // 4. Regional Standard vs Voltage Alignment
  if (systemVolt === 480 && targetStd === 'IEC') {
    alerts.push({
      id: 'std_mismatch_480',
      severity: 'INFO',
      parameter: '480V with IEC Standard',
      title: 'Standard Alignment: 480V 60Hz is Typically Governed by UL 508A',
      triggerCondition: '480V system voltage paired with IEC 60947 compliance target',
      standardReference: 'UL 508A Industrial Control Panels & NFPA 70 (NEC)',
      engineeringImpact: '480V 3-phase is standard in North America where UL 508A listing and SCCR calculation per UL 508A Supplement SB is strictly enforced by the Authority Having Jurisdiction (AHJ).',
      recommendationAction: {
        label: 'Set Target Standard to UL 508A (North American Code)',
        targetKey: 'targetStandard',
        targetValue: 'UL',
      },
    });
  } else if (systemVolt === 400 && targetStd === 'UL') {
    alerts.push({
      id: 'std_mismatch_400',
      severity: 'INFO',
      parameter: '400V with UL Standard',
      title: 'Standard Alignment: 400V 50Hz is Typically Governed by IEC 60947',
      triggerCondition: '400V European/International voltage paired with UL 508A target',
      standardReference: 'IEC 60947-1 / -2 / -4-1 & CE Machinery Directive 2006/42/EC',
      engineeringImpact: '400V 50Hz is primarily European and international. Dual certification (cULus + CE) or IEC 60947 should be verified.',
      recommendationAction: {
        label: 'Set Target Standard to IEC 60947',
        targetKey: 'targetStandard',
        targetValue: 'IEC',
      },
    });
  }

  // 5. Environmental Protection / Dusty Environment Check
  if ((enclosure === 'IP54' || enclosure === 'NEMA 1') && specs.dutyType === 'pump') {
    alerts.push({
      id: 'enc_ingress',
      severity: 'CAUTION',
      parameter: `Enclosure: ${enclosure}`,
      title: 'Ingress Protection: Upgrade Recommended for Dirty or Wet Environments',
      triggerCondition: `${enclosure} offers only basic splash/dust resistance`,
      standardReference: 'IEC 60529 (Degrees of Protection) & NEMA 250',
      engineeringImpact: 'In dusty industrial facilities (cement, woodworking, process plants), fine airborne particulates penetrate IP54 louvers, fouling contactor silver-alloy tips and causing thermal tripping.',
      recommendationAction: {
        label: 'Upgrade to IP65 / NEMA 4/12 (Dust-Tight Sealed Enclosure)',
        targetKey: 'enclosureType',
        targetValue: 'IP65',
      },
    });
  }

  // 6. High Fault Short-Circuit Current (SCCR >= 50 kA)
  if (sccr >= 50) {
    alerts.push({
      id: 'sccr_high',
      severity: 'INFO',
      parameter: `SCCR: ${sccr} kA`,
      title: 'High Fault Current Coordination: Type F Combination Controller Required',
      triggerCondition: `Prospective fault current (${sccr} kA) exceeds standard 10–18 kA MPCB limit`,
      standardReference: 'UL 508A Supplement SB & IEC 60947-4-1 Type 2 Coordination',
      engineeringImpact: `At ${sccr}kA fault level, self-protected manual motor starters require verified high-breaking capacity (e.g. Schneider GV2P or ABB MS132-50kA) or upstream current-limiting Class J fuses to prevent contact welding.`,
    });
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-950/20 border border-emerald-600/30 rounded-xl p-3.5 flex items-center gap-3 text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <div className="text-emerald-300">
          <strong className="text-white">All Electrical Parameter Ranges Validated:</strong> System voltage, motor starting dynamics, ambient temperatures, and protection ratings fall within standard operational limits (IEC 60947 / UL 508A).
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Engineering Parameter Range Validation Audit
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                {alerts.length} Range Check{alerts.length > 1 ? 's' : ''} Flagged
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Proactive checks against thermal derating limits, inrush grid distortion, operator safety, and coordination rules.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Standard Ruleset: IEC 60947 & UL 508A
        </div>
      </div>

      {/* Alert Items List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const isWarning = alert.severity === 'WARNING';
          const isCaution = alert.severity === 'CAUTION';

          return (
            <div
              key={alert.id}
              className={`rounded-lg p-4 border transition ${
                isWarning
                  ? 'bg-rose-950/20 border-rose-600/40'
                  : isCaution
                  ? 'bg-amber-950/20 border-amber-600/40'
                  : 'bg-blue-950/20 border-blue-600/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isWarning
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isCaution
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <h4 className="text-xs font-bold text-white">
                    {alert.title}
                  </h4>
                </div>

                <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  {alert.parameter}
                </span>
              </div>

              {/* Standard Reference & Trigger */}
              <div className="text-[11px] text-slate-400 font-mono mb-2 flex flex-wrap gap-x-4 gap-y-1">
                <span>Trigger: <strong className="text-slate-300 font-normal">{alert.triggerCondition}</strong></span>
                <span>• Code: <strong className="text-blue-300 font-normal">{alert.standardReference}</strong></span>
              </div>

              {/* Engineering Impact Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.engineeringImpact}
              </p>

              {/* Derating Details Box if present */}
              {alert.deratingDetails && (
                <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded border border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Derating Assessment: Factor k = {alert.deratingDetails.factor}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {alert.deratingDetails.explanation}
                  </p>
                </div>
              )}

              {/* Quick Action Button if recommendation available */}
              {alert.recommendationAction && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Recommended engineering design adjustment:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onApplyRecommendation(
                        alert.recommendationAction!.targetKey,
                        alert.recommendationAction!.targetValue
                      )
                    }
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <span>{alert.recommendationAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
