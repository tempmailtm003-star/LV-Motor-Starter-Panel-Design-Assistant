import React, { useState } from 'react';
import { DraftDesignProposal } from '../types/electrical';
import { Layers, Info, CheckCircle2 } from 'lucide-react';

interface SchematicViewerProps {
  proposal: DraftDesignProposal;
}

export const SchematicViewer: React.FC<SchematicViewerProps> = ({ proposal }) => {
  const [circuitTab, setCircuitTab] = useState<'power' | 'control'>('power');
  const [selectedTag, setSelectedTag] = useState<string | null>('Q1');

  const { specs, calculations, bom } = proposal;
  const is24V = specs.controlVoltage === '24VDC';

  const q1 = bom.find((b) => b.tag === 'Q1');
  const km1 = bom.find((b) => b.tag === 'KM1');
  const f1 = bom.find((b) => b.tag === 'F1');
  const ps1 = bom.find((b) => b.tag === 'PS1');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Title & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Interactive CAD Schematic & Elementary Wiring Diagram
          </h3>
          <p className="text-xs text-slate-400">
            Adhering to IEC 60617 / IEEE 315 graphical symbols. Click any component symbol to inspect terminal markings and catalog order code.
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setCircuitTab('power')}
            className={`px-3 py-1.5 rounded transition ${
              circuitTab === 'power'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3-Phase Power Circuit
          </button>
          <button
            type="button"
            onClick={() => setCircuitTab('control')}
            className={`px-3 py-1.5 rounded transition ${
              circuitTab === 'control'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Control Circuit ({specs.controlVoltage || '24VDC'})
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative bg-slate-950 rounded-lg border border-slate-800/80 p-4 overflow-x-auto min-h-[380px] flex items-center justify-center">
        {circuitTab === 'power' ? (
          /* POWER CIRCUIT SVG */
          <svg
            viewBox="0 0 760 380"
            className="w-full max-w-[760px] h-auto select-none"
            style={{ minWidth: '600px' }}
          >
            {/* Grid background markings */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.7" fill="#334155" />
              </pattern>
            </defs>
            <rect width="760" height="380" fill="#020617" />
            <rect width="760" height="380" fill="url(#grid)" opacity="0.4" />

            {/* Feeder Incoming Bus (L1, L2, L3, PE) */}
            <text x="30" y="35" fill="#94a3b8" fontSize="11" fontFamily="monospace">FEEDER SUPPLY</text>
            <text x="30" y="50" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {specs.systemVoltage || 400}V 3~ {specs.frequencyHz || 50}Hz
            </text>

            {/* Power Lines L1, L2, L3 */}
            {/* L1 (Red/Brown) */}
            <line x1="200" y1="20" x2="200" y2="70" stroke="#f87171" strokeWidth="2.5" />
            <text x="185" y="35" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">L1</text>

            {/* L2 (Black/Yellow) */}
            <line x1="280" y1="20" x2="280" y2="70" stroke="#facc15" strokeWidth="2.5" />
            <text x="265" y="35" fill="#facc15" fontSize="11" fontWeight="bold" fontFamily="monospace">L2</text>

            {/* L3 (Blue/Grey) */}
            <line x1="360" y1="20" x2="360" y2="70" stroke="#60a5fa" strokeWidth="2.5" />
            <text x="345" y="35" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="monospace">L3</text>

            {/* PE (Green/Yellow) */}
            <line x1="460" y1="20" x2="460" y2="330" stroke="#4ade80" strokeWidth="2" strokeDasharray="6,4" />
            <text x="470" y="35" fill="#4ade80" fontSize="11" fontWeight="bold" fontFamily="monospace">PE (Earth)</text>

            {/* Q1: CIRCUIT BREAKER / MPCB */}
            <g
              onClick={() => setSelectedTag('Q1')}
              className="cursor-pointer transition hover:opacity-90"
            >
              <rect
                x="160"
                y="70"
                width="240"
                height="65"
                rx="6"
                fill={selectedTag === 'Q1' ? '#1e3a8a' : '#0f172a'}
                stroke={selectedTag === 'Q1' ? '#60a5fa' : '#334155'}
                strokeWidth="1.5"
              />
              <text x="175" y="92" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">Q1: MPCB / Disconnect</text>
              <text x="175" y="108" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                {q1?.partNumber} ({q1?.electricalRating.split(',')[1] || 'Icu=10kA'})
              </text>
              <text x="175" y="122" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                Thermal: {calculations.calculatedFla}A | Mag Trip: {calculations.bcpdTripCurrentMin * 13}A
              </text>

              {/* Breaker switch symbols */}
              <line x1="200" y1="70" x2="200" y2="82" stroke="#f87171" strokeWidth="2" />
              <line x1="200" y1="82" x2="208" y2="105" stroke="#f87171" strokeWidth="2" />
              <line x1="200" y1="110" x2="200" y2="135" stroke="#f87171" strokeWidth="2" />

              <line x1="280" y1="70" x2="280" y2="82" stroke="#facc15" strokeWidth="2" />
              <line x1="280" y1="82" x2="288" y2="105" stroke="#facc15" strokeWidth="2" />
              <line x1="280" y1="110" x2="280" y2="135" stroke="#facc15" strokeWidth="2" />

              <line x1="360" y1="70" x2="360" y2="82" stroke="#60a5fa" strokeWidth="2" />
              <line x1="360" y1="82" x2="368" y2="105" stroke="#60a5fa" strokeWidth="2" />
              <line x1="360" y1="110" x2="360" y2="135" stroke="#60a5fa" strokeWidth="2" />
            </g>

            {/* Connecting lines Q1 to KM1 */}
            <line x1="200" y1="135" x2="200" y2="160" stroke="#f87171" strokeWidth="2" />
            <line x1="280" y1="135" x2="280" y2="160" stroke="#facc15" strokeWidth="2" />
            <line x1="360" y1="135" x2="360" y2="160" stroke="#60a5fa" strokeWidth="2" />

            {/* KM1: CONTACTOR */}
            <g
              onClick={() => setSelectedTag('KM1')}
              className="cursor-pointer transition hover:opacity-90"
            >
              <rect
                x="160"
                y="160"
                width="240"
                height="60"
                rx="6"
                fill={selectedTag === 'KM1' ? '#1e3a8a' : '#0f172a'}
                stroke={selectedTag === 'KM1' ? '#60a5fa' : '#334155'}
                strokeWidth="1.5"
              />
              <text x="175" y="180" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">KM1: Contactor (AC-3)</text>
              <text x="175" y="196" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                {km1?.partNumber} (Coil: {specs.controlVoltage || '24VDC'})
              </text>
              <text x="175" y="210" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                Rating: {km1?.electricalRating.split(',')[0]} (Terminals 1-2, 3-4, 5-6)
              </text>

              {/* Contactor contacts */}
              <circle cx="200" cy="180" r="3" fill="#cbd5e1" />
              <line x1="200" y1="180" x2="208" y2="198" stroke="#f87171" strokeWidth="2" />
              <circle cx="200" cy="205" r="3" fill="#cbd5e1" />

              <circle cx="280" cy="180" r="3" fill="#cbd5e1" />
              <line x1="280" y1="180" x2="288" y2="198" stroke="#facc15" strokeWidth="2" />
              <circle cx="280" cy="205" r="3" fill="#cbd5e1" />

              <circle cx="360" cy="180" r="3" fill="#cbd5e1" />
              <line x1="360" y1="180" x2="368" y2="198" stroke="#60a5fa" strokeWidth="2" />
              <circle cx="360" cy="205" r="3" fill="#cbd5e1" />
            </g>

            {/* Connecting lines KM1 to F1 */}
            <line x1="200" y1="220" x2="200" y2="245" stroke="#f87171" strokeWidth="2" />
            <line x1="280" y1="220" x2="280" y2="245" stroke="#facc15" strokeWidth="2" />
            <line x1="360" y1="220" x2="360" y2="245" stroke="#60a5fa" strokeWidth="2" />

            {/* F1: THERMAL OVERLOAD RELAY */}
            <g
              onClick={() => setSelectedTag('F1')}
              className="cursor-pointer transition hover:opacity-90"
            >
              <rect
                x="160"
                y="245"
                width="240"
                height="50"
                rx="6"
                fill={selectedTag === 'F1' ? '#1e3a8a' : '#0f172a'}
                stroke={selectedTag === 'F1' ? '#60a5fa' : '#334155'}
                strokeWidth="1.5"
              />
              <text x="175" y="264" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">F1: Overload Relay</text>
              <text x="175" y="278" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                {f1?.partNumber} | Class {calculations.overloadTripClass} | Dial: {calculations.calculatedFla}A
              </text>
              <text x="175" y="290" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                Aux Contacts: 95-96 (NC Trip) / 97-98 (NO Alarm)
              </text>

              {/* Thermal bimetal symbols */}
              <rect x="195" y="255" width="10" height="20" fill="none" stroke="#f87171" strokeWidth="2" />
              <rect x="275" y="255" width="10" height="20" fill="none" stroke="#facc15" strokeWidth="2" />
              <rect x="355" y="255" width="10" height="20" fill="none" stroke="#60a5fa" strokeWidth="2" />
            </g>

            {/* Connecting lines F1 to Motor M1 */}
            <line x1="200" y1="295" x2="200" y2="330" stroke="#f87171" strokeWidth="2" />
            <line x1="280" y1="295" x2="280" y2="330" stroke="#facc15" strokeWidth="2" />
            <line x1="360" y1="295" x2="360" y2="330" stroke="#60a5fa" strokeWidth="2" />

            {/* Motor M1 Symbol */}
            <g>
              <circle cx="280" cy="340" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="280" y="337" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                M1
              </text>
              <text x="280" y="352" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                3~ AC ({specs.motorPowerKw || 15} kW)
              </text>
              <line x1="460" y1="330" x2="310" y2="340" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" />
            </g>

            {/* Conductor Callout */}
            <g>
              <rect x="520" y="160" width="210" height="90" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="530" y="180" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">POWER WIRING SPEC</text>
              <text x="530" y="198" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                Gauge: {calculations.conductorMinSizeMm2} mm² / {calculations.conductorMinSizeAwg}
              </text>
              <text x="530" y="214" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Min Ampacity: {calculations.conductorMinAmpacity}A (125% FLA)
              </text>
              <text x="530" y="230" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Insulation: 75°C / 90°C Copper
              </text>
              <text x="530" y="244" fill="#4ade80" fontSize="10" fontFamily="monospace">
                PE Earth: {calculations.earthConductorMm2} mm²
              </text>
            </g>
          </svg>
        ) : (
          /* CONTROL CIRCUIT SVG */
          <svg
            viewBox="0 0 760 380"
            className="w-full max-w-[760px] h-auto select-none"
            style={{ minWidth: '600px' }}
          >
            <defs>
              <pattern id="grid-ctrl" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.7" fill="#334155" />
              </pattern>
            </defs>
            <rect width="760" height="380" fill="#020617" />
            <rect width="760" height="380" fill="url(#grid-ctrl)" opacity="0.4" />

            {/* Power Rails: Top (+24VDC or 120VAC L), Bottom (0VDC or N) */}
            <line x1="40" y1="40" x2="720" y2="40" stroke="#ef4444" strokeWidth="2.5" />
            <text x="40" y="30" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {is24V ? '+24V DC POWER RAIL (PS1)' : `${specs.controlVoltage || '120VAC'} CONTROL LINE (L)`}
            </text>

            <line x1="40" y1="340" x2="720" y2="340" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="40" y="360" fill="#3b82f6" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {is24V ? '0V DC RETURN RAIL (GND)' : 'NEUTRAL / COMMON (N)'}
            </text>

            {/* Rung 1: E-Stop & Motor Control Loop */}
            <text x="60" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace">RUNG 1: START / STOP INTERLOCK</text>

            {/* Downward line from +24V */}
            <line x1="120" y1="40" x2="120" y2="80" stroke="#ef4444" strokeWidth="2" />

            {/* F2: Control MCB / Fuse */}
            <rect x="110" y="80" width="20" height="30" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="120" y1="80" x2="120" y2="110" stroke="#ef4444" strokeWidth="2" />
            <text x="140" y="100" fill="#cbd5e1" fontSize="10" fontFamily="monospace">F2: Fuse 2A</text>

            <line x1="120" y1="110" x2="120" y2="135" stroke="#cbd5e1" strokeWidth="2" />

            {/* S0: Emergency Stop NC */}
            <circle cx="120" cy="135" r="3" fill="#cbd5e1" />
            <line x1="120" y1="135" x2="135" y2="148" stroke="#ef4444" strokeWidth="2" />
            <circle cx="120" cy="155" r="3" fill="#cbd5e1" />
            <text x="140" y="148" fill="#f87171" fontSize="10" fontWeight="bold" fontFamily="monospace">S0: E-Stop (NC)</text>

            <line x1="120" y1="155" x2="120" y2="175" stroke="#cbd5e1" strokeWidth="2" />

            {/* S1: Stop Pushbutton NC */}
            <circle cx="120" cy="175" r="3" fill="#cbd5e1" />
            <line x1="120" y1="175" x2="135" y2="188" stroke="#f87171" strokeWidth="2" />
            <circle cx="120" cy="195" r="3" fill="#cbd5e1" />
            <text x="140" y="188" fill="#f87171" fontSize="10" fontFamily="monospace">S1: Stop PB (NC 1-2)</text>

            <line x1="120" y1="195" x2="120" y2="215" stroke="#cbd5e1" strokeWidth="2" />

            {/* S2 Start PB & KM1 Seal-in (Parallel Branch) */}
            {/* Left branch: Start S2 NO */}
            <line x1="120" y1="215" x2="80" y2="215" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="80" y1="215" x2="80" y2="230" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="80" cy="230" r="3" fill="#cbd5e1" />
            <line x1="80" y1="230" x2="92" y2="242" stroke="#4ade80" strokeWidth="2" />
            <circle cx="80" cy="250" r="3" fill="#cbd5e1" />
            <text x="30" y="242" fill="#4ade80" fontSize="10" fontFamily="monospace">S2: Start (NO)</text>
            <line x1="80" y1="250" x2="80" y2="265" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="80" y1="265" x2="120" y2="265" stroke="#cbd5e1" strokeWidth="2" />

            {/* Right branch: KM1 Auxiliary Seal-in NO (13-14) */}
            <line x1="120" y1="215" x2="180" y2="215" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="180" y1="215" x2="180" y2="230" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="180" cy="230" r="3" fill="#cbd5e1" />
            <line x1="180" y1="230" x2="192" y2="242" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="180" cy="250" r="3" fill="#cbd5e1" />
            <text x="200" y="242" fill="#38bdf8" fontSize="10" fontFamily="monospace">KM1 (NO 13-14)</text>
            <line x1="180" y1="250" x2="180" y2="265" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="180" y1="265" x2="120" y2="265" stroke="#cbd5e1" strokeWidth="2" />

            {/* After Seal-in: to Overload NC 95-96 */}
            <line x1="120" y1="265" x2="120" y2="275" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="120" cy="275" r="3" fill="#cbd5e1" />
            <line x1="120" y1="275" x2="135" y2="285" stroke="#fb923c" strokeWidth="2" />
            <circle cx="120" cy="290" r="3" fill="#cbd5e1" />
            <text x="145" y="285" fill="#fb923c" fontSize="10" fontFamily="monospace">F1 Overload NC (95-96)</text>

            <line x1="120" y1="290" x2="120" y2="305" stroke="#cbd5e1" strokeWidth="2" />

            {/* KM1 Contactor Coil A1 - A2 */}
            <rect x="100" y="305" width="40" height="25" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="120" y="322" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              KM1
            </text>
            <text x="80" y="320" fill="#94a3b8" fontSize="9" fontFamily="monospace">A1</text>
            <text x="145" y="320" fill="#94a3b8" fontSize="9" fontFamily="monospace">A2</text>
            <line x1="120" y1="330" x2="120" y2="340" stroke="#3b82f6" strokeWidth="2" />

            {/* Rung 2: Run Indicator H1 (Green) */}
            <line x1="420" y1="40" x2="420" y2="150" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="420" cy="150" r="3" fill="#cbd5e1" />
            <line x1="420" y1="150" x2="432" y2="162" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="420" cy="170" r="3" fill="#cbd5e1" />
            <text x="440" y="162" fill="#38bdf8" fontSize="10" fontFamily="monospace">KM1 Aux NO (23-24)</text>

            <line x1="420" y1="170" x2="420" y2="280" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="420" cy="295" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="420" y="299" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              RUN
            </text>
            <line x1="420" y1="309" x2="420" y2="340" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="445" y="298" fill="#94a3b8" fontSize="10" fontFamily="monospace">H1 (Green Pilot LED)</text>

            {/* Rung 3: Thermal Trip Alarm Indicator H2 (Amber) */}
            <line x1="600" y1="40" x2="600" y2="150" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="600" cy="150" r="3" fill="#cbd5e1" />
            <line x1="600" y1="150" x2="612" y2="162" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="600" cy="170" r="3" fill="#cbd5e1" />
            <text x="620" y="162" fill="#fbbf24" fontSize="10" fontFamily="monospace">F1 Overload NO (97-98)</text>

            <line x1="600" y1="170" x2="600" y2="280" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="600" cy="295" r="14" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="600" y="299" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              TRIP
            </text>
            <line x1="600" y1="309" x2="600" y2="340" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="625" y="298" fill="#94a3b8" fontSize="10" fontFamily="monospace">H2 (Amber Pilot LED)</text>
          </svg>
        )}
      </div>

      {/* Selected Component Terminal Inspector */}
      {selectedTag && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="font-bold text-white font-mono">{selectedTag} Inspector:</span>
            <span className="text-slate-300">
              {bom.find((b) => b.tag === selectedTag)?.description || 'Selected component'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Part: <strong className="text-blue-300">{bom.find((b) => b.tag === selectedTag)?.partNumber}</strong></span>
            <span>Mfr: <strong className="text-slate-200">{bom.find((b) => b.tag === selectedTag)?.manufacturer}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
