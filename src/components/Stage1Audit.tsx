import React, { useState } from 'react';
import {
  ExtractedSpecs,
  ParseBriefResult,
  ClarificationQuestion,
  TargetStandard,
  StartingMethod,
  ControlVoltage,
  EnclosureRating,
} from '../types/electrical';
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Terminal,
  RotateCcw,
  ArrowRight,
  Sliders,
  Copy,
  Check,
} from 'lucide-react';
import { EngineeringValidationAlerts } from './EngineeringValidationAlerts';

interface Stage1AuditProps {
  briefText: string;
  setBriefText: (text: string) => void;
  parseResult: ParseBriefResult;
  onParseBrief: (text: string) => void;
  onUpdateSpec: (key: keyof ExtractedSpecs, value: any) => void;
  onProceedToStage2: () => void;
  isLoading: boolean;
}

const PRESET_BRIEFS = [
  {
    title: 'Prompt Brief (DOL 15kW 400V Pump)',
    brief: 'I need a DOL starter panel for a 15kW 400V 3-phase pump motor with 24VDC control in a dusty environment, 10kA SCCR required.',
  },
  {
    title: 'Ambiguous Brief (Triggers Clarification Questions)',
    brief: 'I need a motor starter panel for a 30kW motor in a chemical factory. Need standard protection.',
  },
  {
    title: 'Star-Delta Compressor (45kW 400V, 35kA)',
    brief: 'Design a Star-Delta starter panel for a 45kW 400V 50Hz screw chiller compressor, 230VAC control, IP55 enclosure, 35kA breaking capacity.',
  },
  {
    title: 'UL 508A Soft Starter (25HP 480V Conveyor)',
    brief: 'UL 508A compliant soft starter panel for a 25HP 480V 3-phase heavy conveyor, 120VAC control circuit, NEMA 12 enclosure, 65kA SCCR.',
  },
];

export const Stage1Audit: React.FC<Stage1AuditProps> = ({
  briefText,
  setBriefText,
  parseResult,
  onParseBrief,
  onUpdateSpec,
  onProceedToStage2,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [copiedJson, setCopiedJson] = useState(false);

  const missingParams = parseResult.missing_critical_params || [];
  const hasMissing = missingParams.length > 0;
  const questions = parseResult.clarifying_questions || [];

  const handleCopyJson = () => {
    const jsonOutput = {
      extracted_specs: parseResult.extracted_specs,
      missing_critical_params: parseResult.missing_critical_params,
      ...(questions.length > 0 ? { clarifying_questions: questions } : {}),
    };
    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePresetSelect = (presetBrief: string) => {
    setBriefText(presetBrief);
    onParseBrief(presetBrief);
  };

  return (
    <div className="space-y-6">
      {/* Brief Input Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono">
                01
              </span>
              User Design Brief Input
            </h2>
            <p className="text-xs text-slate-400">
              Provide natural language requirements for the LV motor starter panel. The deterministic parser will extract parameters and audit for ambiguities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Presets:</span>
          </div>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_BRIEFS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(p.brief)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {p.title}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            rows={3}
            placeholder="e.g. I need a DOL starter panel for a 15kW 400V 3-phase pump motor with 24VDC control in a dusty environment, 10kA SCCR required."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition font-mono leading-relaxed"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onParseBrief(briefText)}
              disabled={isLoading || !briefText.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Auditing Requirements...' : 'Audit Brief & Extract Specs'}
            </button>
            <button
              type="button"
              onClick={() => {
                setBriefText('');
                onParseBrief('');
              }}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Deterministic Protocol Active
          </div>
        </div>
      </div>

      {/* Tabs: Visual Audit vs Structured JSON View */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Requirement Audit & Specification Sheet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Prompt JSON Output Payload
            {hasMissing && (
              <span className="ml-1 w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyJson}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition"
        >
          {copiedJson ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      {/* TAB 1: VISUAL REQUIREMENT AUDIT */}
      {activeTab === 'visual' ? (
        <div className="space-y-6">
          {/* Ambiguity Alert & Numbered Questions (Rule 3) */}
          {hasMissing ? (
            <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-amber-200">
                      AMBIGUITY HANDLING: Mandatory Electrical Parameters Missing
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Rule 3 Enforced: Sizing Blocked Until Clarified
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/80 mt-1">
                    The brief is missing essential deterministic parameters: <code className="text-amber-200 font-mono font-semibold">{missingParams.join(', ')}</code>.
                    Please select from the options below or answer the clarifying questions to proceed.
                  </p>

                  {/* Clarification Questions with Quick Option Chips */}
                  <div className="mt-4 space-y-4">
                    {questions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white">
                            {q.question}
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                            {q.paramKey}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          <span className="font-semibold text-slate-300">Engineering Rationale:</span> {q.rationale}
                        </p>

                        {/* Interactive Option Chips */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {q.recommendedOptions.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => onUpdateSpec(q.paramKey, opt.value)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-800/40 text-blue-200 border border-blue-700/50 hover:border-blue-500 text-left transition flex flex-col cursor-pointer"
                            >
                              <span className="font-semibold">{opt.label}</span>
                              <span className="text-[10px] text-blue-300/70">{opt.description}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-600/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-200">
                    Stage 1 Complete: All Mandatory Sizing Parameters Extracted
                  </h4>
                  <p className="text-[11px] text-emerald-400/80">
                    No ambiguities detected. The design specification is fully qualified for deterministic calculation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToStage2}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <span>Proceed to Sizing Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Interactive Specification Grid (Fine-tune or manual edit) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Audited Electrical Parameters
              </h3>
              <span className="text-xs text-slate-400">
                You can adjust any parameter below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Voltage */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  System Voltage (Line-to-Line)
                </label>
                <select
                  value={parseResult.extracted_specs.systemVoltage || 400}
                  onChange={(e) => onUpdateSpec('systemVoltage', parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value={400}>400V AC (IEC 3-Phase)</option>
                  <option value={480}>480V AC (UL 3-Phase)</option>
                  <option value={230}>230V AC (3-Phase)</option>
                  <option value={690}>690V AC (Heavy Industrial)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">3-Phase 50/60 Hz</span>
              </div>

              {/* Motor Power */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Motor Power (kW / HP)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={parseResult.extracted_specs.motorPowerKw || 15}
                    onChange={(e) => onUpdateSpec('motorPowerKw', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-xs text-slate-400 font-bold">kW</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  ~{((parseResult.extracted_specs.motorPowerKw || 15) / 0.746).toFixed(1)} HP
                </span>
              </div>

              {/* Starting Method */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Starting Method
                </label>
                <select
                  value={parseResult.extracted_specs.startingType || 'DOL'}
                  onChange={(e) => onUpdateSpec('startingType', e.target.value as StartingMethod)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="DOL">Direct-On-Line (DOL)</option>
                  <option value="STAR_DELTA">Star-Delta (Wye-Delta)</option>
                  <option value="SOFT_STARTER">Solid-State Soft Starter</option>
                  <option value="VFD">Variable Frequency Drive (VFD)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {parseResult.extracted_specs.startingType === 'DOL' ? '6-8x FLA Inrush' : 'Reduced Inrush'}
                </span>
              </div>

              {/* Control Voltage */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Control Circuit Voltage
                </label>
                <select
                  value={parseResult.extracted_specs.controlVoltage || '24VDC'}
                  onChange={(e) => onUpdateSpec('controlVoltage', e.target.value as ControlVoltage)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="24VDC">24V DC (SELV Safe Voltage)</option>
                  <option value="120VAC">120V AC (Standard UL CPT)</option>
                  <option value="230VAC">230V AC (IEC Control)</option>
                  <option value="24VAC">24V AC (HVAC Standard)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Coil & pushbuttons</span>
              </div>

              {/* Target Standard */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Target Compliance Standard
                </label>
                <select
                  value={parseResult.extracted_specs.targetStandard || 'IEC'}
                  onChange={(e) => onUpdateSpec('targetStandard', e.target.value as TargetStandard)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="IEC">IEC 60947 (International/CE)</option>
                  <option value="UL">UL 508A (North America)</option>
                  <option value="DUAL">Dual Compliance (IEC + UL)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Governing code</span>
              </div>

              {/* Enclosure Type */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Enclosure Rating
                </label>
                <select
                  value={parseResult.extracted_specs.enclosureType || 'IP65'}
                  onChange={(e) => onUpdateSpec('enclosureType', e.target.value as EnclosureRating)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="IP65">IP65 (Dust-tight, water jets)</option>
                  <option value="IP54">IP54 (Dust protected, splash)</option>
                  <option value="IP66">IP66 (Heavy water washdown)</option>
                  <option value="NEMA 12">NEMA 12 (Industrial dust/oil)</option>
                  <option value="NEMA 4">NEMA 4 (Watertight/dusttight)</option>
                  <option value="NEMA 4X">NEMA 4X (Stainless washdown)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Sheet steel finish</span>
              </div>

              {/* SCCR */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Required SCCR / Breaking Capacity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={parseResult.extracted_specs.sccrKa || 10}
                    onChange={(e) => onUpdateSpec('sccrKa', parseInt(e.target.value, 10) || 10)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-xs text-slate-400 font-bold">kA</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Prospective fault current</span>
              </div>

              {/* Ambient Temp */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Ambient Temperature
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={parseResult.extracted_specs.ambientTempC ?? 40}
                    onChange={(e) => onUpdateSpec('ambientTempC', parseInt(e.target.value, 10) || 40)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-xs text-slate-400 font-bold">°C</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {(parseResult.extracted_specs.ambientTempC ?? 40) > 40 ? 'Requires thermal derating' : 'Standard rating'}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Validation Alert Component: Range Validation & Derating Factors */}
          <EngineeringValidationAlerts
            specs={parseResult.extracted_specs}
            onApplyRecommendation={onUpdateSpec}
          />
        </div>
      ) : (
        /* TAB 2: RAW JSON OUTPUT AS REQUESTED IN PROMPT */
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-semibold text-blue-400">
              Prompt Schema: Top-Level "extracted_specs" & "missing_critical_params"
            </span>
            <span className="text-[11px] text-slate-500">JSON format per system prompt</span>
          </div>

          <pre className="text-emerald-400 overflow-x-auto p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 leading-relaxed">
            {JSON.stringify(
              {
                extracted_specs: {
                  Voltage: parseResult.extracted_specs.systemVoltage ? `${parseResult.extracted_specs.systemVoltage}V` : undefined,
                  'Motor kW/HP': parseResult.extracted_specs.motorPowerKw ? `${parseResult.extracted_specs.motorPowerKw}kW (~${((parseResult.extracted_specs.motorPowerKw) / 0.746).toFixed(1)}HP)` : undefined,
                  'Starting Type': parseResult.extracted_specs.startingType,
                  'Control Voltage': parseResult.extracted_specs.controlVoltage,
                  'Target Standards': parseResult.extracted_specs.targetStandard,
                  'Ambient Temp': `${parseResult.extracted_specs.ambientTempC ?? 40}°C`,
                  'Enclosure Type': parseResult.extracted_specs.enclosureType,
                  'SCCR Required': parseResult.extracted_specs.sccrKa ? `${parseResult.extracted_specs.sccrKa}kA` : undefined,
                  'Duty Type': parseResult.extracted_specs.dutyType,
                },
                missing_critical_params: parseResult.missing_critical_params,
                ...(questions.length > 0 ? { clarifying_questions: questions } : {}),
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
