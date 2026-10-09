import React, { useState, useEffect } from 'react';
import {
  ExtractedSpecs,
  ParseBriefResult,
  DraftDesignProposal,
  TargetStandard,
} from './types/electrical';
import { parseDesignBriefDeterministically } from './engine/parser';
import { synthesizeDraftProposal } from './engine/calculator';
import { Header } from './components/Header';
import { StageIndicator } from './components/StageIndicator';
import { Stage1Audit } from './components/Stage1Audit';
import { Stage2Engine } from './components/Stage2Engine';
import { Stage3Proposal } from './components/Stage3Proposal';

const INITIAL_BRIEF = 'I need a DOL starter panel for a 15kW 400V 3-phase pump motor with 24VDC control in a dusty environment, 10kA SCCR required.';

export default function App() {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [briefText, setBriefText] = useState(INITIAL_BRIEF);
  const [isLoading, setIsLoading] = useState(false);

  // Parse result state
  const [parseResult, setParseResult] = useState<ParseBriefResult>(() => {
    return parseDesignBriefDeterministically(INITIAL_BRIEF);
  });

  // Proposal state
  const [proposal, setProposal] = useState<DraftDesignProposal>(() => {
    const initialSpecs = parseDesignBriefDeterministically(INITIAL_BRIEF).extracted_specs;
    return synthesizeDraftProposal(initialSpecs);
  });

  // Re-run parser when user requests or changes brief
  const handleParseBrief = async (text: string) => {
    if (!text.trim()) {
      const emptyResult: ParseBriefResult = {
        extracted_specs: {},
        missing_critical_params: ['system_voltage', 'motor_power_rating', 'starting_method', 'control_circuit_voltage'],
        clarifying_questions: [],
      };
      setParseResult(emptyResult);
      return;
    }

    setIsLoading(true);
    try {
      // Call server-side API proxy route
      const response = await fetch('/api/parse-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: text }),
      });

      if (response.ok) {
        const data = await response.json();
        setParseResult({
          extracted_specs: data.extracted_specs || {},
          missing_critical_params: data.missing_critical_params || [],
          clarifying_questions: data.clarifying_questions || [],
        });

        // If no missing parameters, automatically update proposal
        if (!data.missing_critical_params || data.missing_critical_params.length === 0) {
          const newProposal = synthesizeDraftProposal(data.extracted_specs);
          setProposal(newProposal);
        }
      } else {
        // Fallback to local deterministic parser
        const local = parseDesignBriefDeterministically(text);
        setParseResult(local);
        if (local.missing_critical_params.length === 0) {
          setProposal(synthesizeDraftProposal(local.extracted_specs));
        }
      }
    } catch {
      // Offline or network error fallback
      const local = parseDesignBriefDeterministically(text);
      setParseResult(local);
      if (local.missing_critical_params.length === 0) {
        setProposal(synthesizeDraftProposal(local.extracted_specs));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update individual specification param
  const handleUpdateSpec = (key: keyof ExtractedSpecs, value: any) => {
    const updatedSpecs = {
      ...parseResult.extracted_specs,
      [key]: value,
    };

    // Re-check missing parameters
    const currentMissing = parseResult.missing_critical_params.filter((param) => {
      if (key === 'systemVoltage' && param === 'system_voltage') return false;
      if (key === 'motorPowerKw' && param === 'motor_power_rating') return false;
      if (key === 'startingType' && param === 'starting_method') return false;
      if (key === 'controlVoltage' && param === 'control_circuit_voltage') return false;
      if (key === 'sccrKa' && param === 'short_circuit_rating_sccr') return false;
      if (key === 'enclosureType' && param === 'enclosure_ingress_rating') return false;
      return true;
    });

    const updatedParseResult: ParseBriefResult = {
      ...parseResult,
      extracted_specs: updatedSpecs,
      missing_critical_params: currentMissing,
    };

    setParseResult(updatedParseResult);

    // Update proposal
    const newProposal = synthesizeDraftProposal(updatedSpecs);
    setProposal(newProposal);
  };

  // Switch standard (IEC / UL / DUAL)
  const handleStandardChange = (std: TargetStandard) => {
    handleUpdateSpec('targetStandard', std);
  };

  // Switch manufacturer brand preference
  const handleManufacturerChange = (mfr: 'Schneider' | 'ABB' | 'Siemens' | 'Eaton' | 'Any') => {
    handleUpdateSpec('manufacturerPreference', mfr);
  };

  // Export structured JSON
  const handleExportJson = () => {
    const fullExport = {
      brief: briefText,
      stage1_intent_audit: parseResult,
      stage2_deterministic_calculations: proposal.calculations,
      stage3_draft_design_proposal: proposal,
    };
    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LV_Motor_Starter_Draft_${proposal.specs.motorPowerKw || 15}kW_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Bill of Materials as CSV
  const handleExportCsv = () => {
    const headers = ['Tag', 'Category', 'Manufacturer', 'Part Number', 'Description', 'Thermal Loss (W)', 'DIN Width (mm)', 'SCCR (kA)', 'Coordination'];
    const rows = proposal.bom.map((b) => [
      b.tag,
      `"${b.category}"`,
      `"${b.manufacturer}"`,
      `"${b.partNumber}"`,
      `"${b.description.replace(/"/g, '""')}"`,
      b.thermalDissipationWatts,
      b.dinRailWidthMm,
      b.sccrRatingKa,
      b.coordinationType,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_LV_Starter_${proposal.specs.motorPowerKw || 15}kW_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Engineering Header */}
      <Header
        standard={parseResult.extracted_specs.targetStandard || 'IEC'}
        onStandardChange={handleStandardChange}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
      />

      {/* Main Workbench Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stage Progress Indicator */}
        <StageIndicator
          currentStage={currentStage}
          onSelectStage={setCurrentStage}
          hasMissingParams={parseResult.missing_critical_params.length > 0}
        />

        {/* Dynamic Stage View */}
        {currentStage === 1 && (
          <Stage1Audit
            briefText={briefText}
            setBriefText={setBriefText}
            parseResult={parseResult}
            onParseBrief={handleParseBrief}
            onUpdateSpec={handleUpdateSpec}
            onProceedToStage2={() => setCurrentStage(2)}
            isLoading={isLoading}
          />
        )}

        {currentStage === 2 && (
          <Stage2Engine
            specs={parseResult.extracted_specs}
            calculations={proposal.calculations}
            onProceedToStage3={() => setCurrentStage(3)}
          />
        )}

        {currentStage === 3 && (
          <Stage3Proposal
            proposal={proposal}
            onUpdateManufacturerPreference={handleManufacturerChange}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
          />
        )}
      </main>

      {/* Engineering Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 text-xs py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            LV Motor-Starter Panel Design Assistant • IEC 60947-1 / -2 / -4-1 & UL 508A / UL 60947-4-1
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Deterministic Engine • Zero Hallucination Protocol Active
          </div>
        </div>
      </footer>
    </div>
  );
}
