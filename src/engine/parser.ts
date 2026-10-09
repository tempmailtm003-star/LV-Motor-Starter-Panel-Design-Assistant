import {
  ExtractedSpecs,
  ParseBriefResult,
  ClarificationQuestion,
  StartingMethod,
  ControlVoltage,
  TargetStandard,
  EnclosureRating,
  DutyType,
} from '../types/electrical';

export function parseDesignBriefDeterministically(briefText: string): ParseBriefResult {
  const text = briefText.toLowerCase();
  const extracted: ExtractedSpecs = {};
  const missing: string[] = [];
  const questions: ClarificationQuestion[] = [];

  // 1. Voltage extraction
  const voltageMatch = text.match(/(\d{3})\s*v(?:ac)?\b/) || text.match(/\b(400|480|380|415|230|220|460|690)\s*v\b/);
  if (voltageMatch) {
    extracted.systemVoltage = parseInt(voltageMatch[1], 10);
  } else if (text.includes('400v') || text.includes('400 v')) {
    extracted.systemVoltage = 400;
  } else if (text.includes('480v') || text.includes('480 v')) {
    extracted.systemVoltage = 480;
  } else if (text.includes('230v') || text.includes('230 v')) {
    extracted.systemVoltage = 230;
  }

  // 2. Motor Power extraction (kW or HP)
  const kwMatch = text.match(/(\d+(?:\.\d+)?)\s*kw\b/);
  const hpMatch = text.match(/(\d+(?:\.\d+)?)\s*hp\b/);
  if (kwMatch) {
    extracted.motorPowerKw = parseFloat(kwMatch[1]);
  } else if (hpMatch) {
    extracted.motorPowerHp = parseFloat(hpMatch[1]);
    extracted.motorPowerKw = Number((extracted.motorPowerHp * 0.746).toFixed(1));
  }

  // Explicit FLA
  const flaMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:a|amp|amps|fla)\b/);
  if (flaMatch && !text.includes('sccr') && !text.includes('ka')) {
    // Only if context suggests motor current
    if (text.includes('motor') || text.includes('current') || text.includes('fla') || text.includes('rated at')) {
      extracted.fullLoadAmps = parseFloat(flaMatch[1]);
    }
  }

  // 3. Starting Method
  if (text.includes('star-delta') || text.includes('star delta') || text.includes('wye-delta') || text.includes('wye delta')) {
    extracted.startingType = 'STAR_DELTA';
  } else if (text.includes('soft starter') || text.includes('soft-starter') || text.includes('soft start')) {
    extracted.startingType = 'SOFT_STARTER';
  } else if (text.includes('vfd') || text.includes('inverter') || text.includes('variable frequency') || text.includes('drive')) {
    extracted.startingType = 'VFD';
  } else if (text.includes('dol') || text.includes('direct on line') || text.includes('direct-on-line') || text.includes('across the line')) {
    extracted.startingType = 'DOL';
  }

  // 4. Control Voltage
  if (text.includes('24vdc') || text.includes('24 vdc') || text.includes('24v dc') || text.includes('24 v dc')) {
    extracted.controlVoltage = '24VDC';
  } else if (text.includes('120vac') || text.includes('120 vac') || text.includes('120v ac') || text.includes('110vac') || text.includes('115v') || text.includes('120v')) {
    extracted.controlVoltage = '120VAC';
  } else if (text.includes('230vac') || text.includes('230 vac') || text.includes('230v ac') || text.includes('240vac') || text.includes('220vac')) {
    extracted.controlVoltage = '230VAC';
  } else if (text.includes('24vac') || text.includes('24 vac')) {
    extracted.controlVoltage = '24VAC';
  }

  // 5. Target Standards
  if (text.includes('ul 508a') || text.includes('ul508a') || text.includes('ul') || text.includes('nec') || text.includes('nema')) {
    if (text.includes('iec') && (text.includes('ul') || text.includes('nema'))) {
      extracted.targetStandard = 'DUAL';
    } else {
      extracted.targetStandard = 'UL';
    }
  } else if (text.includes('iec') || text.includes('60947') || text.includes('ce mark')) {
    extracted.targetStandard = 'IEC';
  } else if (extracted.systemVoltage === 480) {
    extracted.targetStandard = 'UL';
  } else if (extracted.systemVoltage === 400 || extracted.systemVoltage === 380 || extracted.systemVoltage === 415) {
    extracted.targetStandard = 'IEC';
  }

  // 6. Ambient Temperature
  const tempMatch = text.match(/(\d+)\s*(?:°c|deg c|celsius)\b/);
  if (tempMatch) {
    extracted.ambientTempC = parseInt(tempMatch[1], 10);
  } else if (text.includes('hot environment') || text.includes('desert') || text.includes('tropical')) {
    extracted.ambientTempC = 50;
  } else {
    // Default ambient standard is 40°C if not specified, but could be queried
    extracted.ambientTempC = 40;
  }

  // 7. Enclosure Type / Environment
  if (text.includes('ip66')) extracted.enclosureType = 'IP66';
  else if (text.includes('ip65')) extracted.enclosureType = 'IP65';
  else if (text.includes('ip55')) extracted.enclosureType = 'IP55';
  else if (text.includes('ip54')) extracted.enclosureType = 'IP54';
  else if (text.includes('nema 4x') || text.includes('nema4x')) extracted.enclosureType = 'NEMA 4X';
  else if (text.includes('nema 4') || text.includes('nema4')) extracted.enclosureType = 'NEMA 4';
  else if (text.includes('nema 12') || text.includes('nema12')) extracted.enclosureType = 'NEMA 12';
  else if (text.includes('nema 3r') || text.includes('nema3r')) extracted.enclosureType = 'NEMA 3R';
  else if (text.includes('dusty') || text.includes('cement') || text.includes('flour') || text.includes('sawdust')) {
    extracted.enclosureType = extracted.targetStandard === 'UL' ? 'NEMA 12' : 'IP65';
  } else if (text.includes('washdown') || text.includes('outdoor') || text.includes('rain')) {
    extracted.enclosureType = extracted.targetStandard === 'UL' ? 'NEMA 4X' : 'IP66';
  }

  // 8. SCCR (Short Circuit Current Rating)
  const sccrMatch = text.match(/(\d+)\s*ka\b/);
  if (sccrMatch) {
    extracted.sccrKa = parseInt(sccrMatch[1], 10);
  } else if (text.includes('sccr') || text.includes('short circuit')) {
    const sccrNum = text.match(/sccr[^\d]*(\d+)/);
    if (sccrNum) extracted.sccrKa = parseInt(sccrNum[1], 10);
  }

  // 9. Duty / Load Type
  if (text.includes('pump')) extracted.dutyType = 'pump';
  else if (text.includes('fan') || text.includes('blower') || text.includes('hvac')) extracted.dutyType = 'fan';
  else if (text.includes('conveyor') || text.includes('feeder')) extracted.dutyType = 'conveyor';
  else if (text.includes('compressor') || text.includes('chiller')) extracted.dutyType = 'compressor';
  else if (text.includes('crusher') || text.includes('mill')) extracted.dutyType = 'crusher';
  else extracted.dutyType = 'general';

  // Phases & Frequency defaults
  extracted.phases = text.includes('single phase') || text.includes('1-phase') ? 1 : 3;
  extracted.frequencyHz = (text.includes('60hz') || text.includes('60 hz') || extracted.targetStandard === 'UL') ? 60 : 50;

  // Manufacturer Preference
  if (text.includes('schneider')) extracted.manufacturerPreference = 'Schneider';
  else if (text.includes('abb')) extracted.manufacturerPreference = 'ABB';
  else if (text.includes('siemens')) extracted.manufacturerPreference = 'Siemens';
  else if (text.includes('eaton')) extracted.manufacturerPreference = 'Eaton';
  else extracted.manufacturerPreference = 'Schneider';

  // -------------------------------------------------------------
  // AUDIT MANDATORY / CRITICAL PARAMETERS FOR DETERMINISTIC SIZING
  // -------------------------------------------------------------
  if (!extracted.systemVoltage) {
    missing.push('system_voltage');
    questions.push({
      id: 'q_volt',
      paramKey: 'systemVoltage',
      question: '1. What is the line-to-line supply voltage and frequency for this motor installation?',
      rationale: 'Mandatory to determine motor Full Load Amperes (FLA), contactor operational voltage rating (Ue), and coil supply matching.',
      recommendedOptions: [
        { label: '400V 50Hz (IEC standard 3-phase)', value: 400, description: 'Standard European/International industrial 3-phase supply' },
        { label: '480V 60Hz (UL / North America)', value: 480, description: 'Standard US/Canadian 3-phase feeder' },
        { label: '230V 50Hz (3-phase)', value: 230, description: 'Low voltage 3-phase distribution' },
        { label: '690V 50Hz (Heavy industrial/Mining)', value: 690, description: 'Heavy industrial power distribution' },
      ],
    });
  }

  if (!extracted.motorPowerKw && !extracted.motorPowerHp && !extracted.fullLoadAmps) {
    missing.push('motor_power_rating');
    questions.push({
      id: 'q_power',
      paramKey: 'motorPowerKw',
      question: '2. What is the motor rated power (kW or HP) or nameplate Full Load Amps (FLA)?',
      rationale: 'Required to size the circuit breaker thermal-magnetic trip, contactor AC-3 rating, overload relay dial, and power conductor cross-section.',
      recommendedOptions: [
        { label: '15 kW (~20 HP, ~29A FLA at 400V)', value: 15, description: 'Standard industrial pump / centrifugal fan rating' },
        { label: '11 kW (~15 HP, ~22A FLA at 400V)', value: 11, description: 'Common commercial motor size' },
        { label: '22 kW (~30 HP, ~41A FLA at 400V)', value: 22, description: 'Medium industrial pump or compressor drive' },
        { label: '37 kW (~50 HP, ~69A FLA at 400V)', value: 37, description: 'Heavy process pump or blower drive' },
      ],
    });
  }

  if (!extracted.startingType) {
    missing.push('starting_method');
    questions.push({
      id: 'q_start',
      paramKey: 'startingType',
      question: '3. Which motor starting method is required (DOL, Star-Delta, Soft Starter, or VFD)?',
      rationale: 'Directs whether single contactor, triple contactor star-delta timer assembly, or solid-state electronics are engineered.',
      recommendedOptions: [
        { label: 'Direct-On-Line (DOL)', value: 'DOL', description: 'Simple, lowest cost; full voltage start (6-8x inrush current)' },
        { label: 'Star-Delta (Wye-Delta)', value: 'STAR_DELTA', description: 'Reduced voltage start for 6-lead motors; cuts inrush by 67%' },
        { label: 'Solid-State Soft Starter', value: 'SOFT_STARTER', description: 'Smooth ramp acceleration, eliminates mechanical water hammer' },
        { label: 'Variable Frequency Drive (VFD)', value: 'VFD', description: 'Continuous speed regulation, lowest grid inrush (1.0x-1.2x)' },
      ],
    });
  }

  if (!extracted.controlVoltage) {
    missing.push('control_circuit_voltage');
    questions.push({
      id: 'q_ctrl',
      paramKey: 'controlVoltage',
      question: '4. What control circuit voltage should be engineered for pushbuttons and contactor coils?',
      rationale: 'Mandatory to size the 24VDC regulated power supply or 120V/230V control transformer (CPT) and pilot devices.',
      recommendedOptions: [
        { label: '24V DC (Modern Industrial Standard / SELV)', value: '24VDC', description: 'Maximum operator safety, standard for PLC automation' },
        { label: '120V AC (Standard UL 508A / NFPA 79)', value: '120VAC', description: 'Standard North American control voltage via CPT' },
        { label: '230V AC (Traditional European IEC)', value: '230VAC', description: 'Derived directly from Phase-to-Neutral supply' },
      ],
    });
  }

  if (!extracted.sccrKa) {
    missing.push('short_circuit_rating_sccr');
    questions.push({
      id: 'q_sccr',
      paramKey: 'sccrKa',
      question: '5. What Short-Circuit Current Rating (SCCR) or breaking capacity (Icu) is required at the panel disconnect?',
      rationale: 'Crucial for Type 2 coordination selection per IEC 60947-4-1 or UL 508A Table SB4.1 short-circuit fault withstand verification.',
      recommendedOptions: [
        { label: '10 kA (Standard commercial feeder)', value: 10, description: 'Adequate for light commercial or small facility MCC' },
        { label: '35 kA (Industrial plant distribution)', value: 35, description: 'Typical for substation motor control centers' },
        { label: '50 kA / 65 kA (High fault industrial busbar)', value: 50, description: 'Required when located close to MV/LV step-down transformer' },
      ],
    });
  }

  if (!extracted.enclosureType && !text.includes('dusty') && !text.includes('indoor') && !text.includes('outdoor')) {
    missing.push('enclosure_ingress_rating');
    questions.push({
      id: 'q_enc',
      paramKey: 'enclosureType',
      question: '6. What environmental protection rating (IP / NEMA) is required for the enclosure?',
      rationale: 'Determines whether sealed dust-tight sheet steel, ventilated louvers, or stainless washdown enclosure is mandated.',
      recommendedOptions: [
        { label: 'IP65 / NEMA 4/12 (Dust-tight & water jets)', value: 'IP65', description: 'Ideal for dusty cement, grain, woodworking or dirty plant environments' },
        { label: 'IP54 / NEMA 12 (Indoor industrial dust/oil)', value: 'IP54', description: 'Standard indoor industrial shop floor' },
        { label: 'IP66 / NEMA 4X (Outdoor / Stainless Washdown)', value: 'IP66', description: 'Chemical exposure, outdoor weather, or food/beverage hose-down' },
      ],
    });
  }

  return {
    extracted_specs: extracted,
    missing_critical_params: missing,
    clarifying_questions: questions.slice(0, 5), // Provide concise 3-5 questions
    raw_interpretation_notes: `Processed ${Object.keys(extracted).length} identified parameters; ${missing.length} missing critical parameters flagged.`,
  };
}
