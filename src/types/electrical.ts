export type TargetStandard = 'IEC' | 'UL' | 'DUAL';

export type StartingMethod = 'DOL' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD';

export type ControlVoltage = '24VDC' | '120VAC' | '230VAC' | '24VAC' | '48VDC';

export type EnclosureRating = 'IP54' | 'IP55' | 'IP65' | 'IP66' | 'NEMA 1' | 'NEMA 12' | 'NEMA 3R' | 'NEMA 4' | 'NEMA 4X';

export type DutyType = 'pump' | 'fan' | 'conveyor' | 'compressor' | 'crusher' | 'general';

export interface ExtractedSpecs {
  systemVoltage?: number; // Volts (e.g., 400, 480, 230, 690)
  motorPowerKw?: number; // kW
  motorPowerHp?: number; // HP
  startingType?: StartingMethod;
  controlVoltage?: ControlVoltage;
  targetStandard?: TargetStandard;
  ambientTempC?: number; // °C (default 40°C if unspecified)
  enclosureType?: EnclosureRating;
  sccrKa?: number; // kA (e.g., 10, 25, 50, 65, 100)
  dutyType?: DutyType;
  phases?: number; // Default 3
  frequencyHz?: number; // 50 or 60
  fullLoadAmps?: number; // Explicit motor FLA if provided by user
  serviceFactor?: number; // e.g. 1.0 or 1.15
  manufacturerPreference?: 'Schneider' | 'ABB' | 'Siemens' | 'Eaton' | 'Any';
}

export interface MissingCriticalParam {
  key: keyof ExtractedSpecs;
  name: string;
  description: string;
  whyCritical: string;
  defaultSuggestion?: string | number;
  options?: (string | number)[];
}

export interface ClarificationQuestion {
  id: string;
  paramKey: keyof ExtractedSpecs;
  question: string;
  rationale: string;
  recommendedOptions: {
    label: string;
    value: any;
    description: string;
  }[];
}

export interface ParseBriefResult {
  extracted_specs: ExtractedSpecs;
  missing_critical_params: string[];
  clarifying_questions?: ClarificationQuestion[];
  raw_interpretation_notes?: string;
}

export interface CalculationEngineRequest {
  engineVersion: string;
  standard: TargetStandard;
  specs: ExtractedSpecs;
  requestedBy: string;
  timestamp: string;
}

export interface SizingCalculations {
  calculatedFla: number; // Motor Full Load Amps (A)
  inrushCurrent: number; // Peak starting current (A)
  startingCurrentFactor: number; // e.g. 7.2x for DOL, 2.5x for Star-Delta
  bcpdTripCurrentMin: number; // Minimum breaker rating (A)
  bcpdTripCurrentMax: number; // Maximum breaker rating per standard (A)
  contactorRatingMinAc3: number; // Contactor AC-3 current rating (A)
  overloadSettingMin: number; // Overload lower dial (A)
  overloadSettingMax: number; // Overload upper dial (A)
  overloadTripClass: 10 | 20 | 30;
  conductorMinAmpacity: number; // 125% FLA (A)
  conductorMinSizeMm2: number; // mm² (IEC)
  conductorMinSizeAwg: string; // AWG (UL)
  earthConductorMm2: number;
  controlTransformerVaMin?: number; // VA
  powerSupplyWattsMin?: number; // W
  totalHeatDissipationWatts: number; // W (losses)
  minEnclosureSurfaceAreaM2: number; // m²
  minEnclosureVolumeM3: number;
  recommendedEnclosureDimensions: {
    heightMm: number;
    widthMm: number;
    depthMm: number;
  };
  dinRailSpaceRequiredMm: number;
  wireBendingSpaceMm: number; // per UL 508A / IEC
}

export interface ComponentBOMItem {
  tag: string; // e.g., 'Q1', 'KM1', 'F1', 'T1', 'PS1', 'ENC1', 'TB1'
  category: 'Circuit Breaker / MCP' | 'Contactor' | 'Overload Relay' | 'Control Power Supply' | 'Terminal Blocks' | 'Enclosure' | 'Pushbuttons & Indicators' | 'Accessories';
  manufacturer: 'Schneider Electric' | 'ABB' | 'Siemens' | 'Eaton' | 'Phoenix Contact' | 'Rittal';
  partNumber: string;
  description: string;
  electricalRating: string;
  thermalDissipationWatts: number;
  dinRailWidthMm: number;
  sccrRatingKa: number;
  coordinationType: 'Type 1' | 'Type 2' | 'UL Type F' | 'UL Type E';
  unitCostEstimateUsd?: number;
}

export interface ComplianceAuditItem {
  ruleId: string;
  standard: 'IEC 60947-1' | 'IEC 60947-2' | 'IEC 60947-4-1' | 'IEC 61439-1' | 'UL 508A Section 31' | 'UL 508A Table 28.1' | 'UL 508A Table 27.1' | 'NFPA 79';
  title: string;
  requirement: string;
  actualDesign: string;
  status: 'COMPLIANT' | 'MARGINAL' | 'WARNING';
  details: string;
}

export interface DraftDesignProposal {
  engineVersion: string;
  timestamp: string;
  status: 'DRAFT_FOR_REVIEW';
  disclaimer: string;
  specs: ExtractedSpecs;
  calculations: SizingCalculations;
  bom: ComponentBOMItem[];
  complianceAudit: ComplianceAuditItem[];
  layoutConstraints: {
    minThermalClearanceTopMm: number;
    minThermalClearanceSidesMm: number;
    minCableBendingSpaceMm: number;
    dinRailOccupancyPercent: number;
    enclosureInternalDeltaTC: number;
  };
  engineeringWarnings: string[];
}
