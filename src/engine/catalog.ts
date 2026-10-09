import { ComponentBOMItem } from '../types/electrical';

export interface CatalogBreaker {
  manufacturer: 'Schneider Electric' | 'ABB' | 'Siemens' | 'Eaton';
  partNumber: string;
  series: string;
  type: 'MPCB' | 'MCCB' | 'MCP';
  currentRatingA: number;
  settingRangeMinA: number;
  settingRangeMaxA: number;
  magneticTripA: number;
  breakingCapacityIcu400VKa: number;
  breakingCapacityIcu480VKa: number;
  powerLossWatts: number;
  dinRailWidthMm: number;
  standards: ('IEC' | 'UL')[];
}

export interface CatalogContactor {
  manufacturer: 'Schneider Electric' | 'ABB' | 'Siemens' | 'Eaton';
  partNumber: string;
  series: string;
  ratedCurrentAc3A: number;
  ratedPower400VKw: number;
  ratedHp480V: number;
  coilVoltage: '24VDC' | '120VAC' | '230VAC' | '24VAC';
  coilInrushVa: number;
  coilHoldVa: number;
  powerLossWatts: number;
  dinRailWidthMm: number;
  standards: ('IEC' | 'UL')[];
}

export interface CatalogOverload {
  manufacturer: 'Schneider Electric' | 'ABB' | 'Siemens' | 'Eaton';
  partNumber: string;
  series: string;
  type: 'Thermal' | 'Electronic';
  currentMinA: number;
  currentMaxA: number;
  tripClass: 10 | 20;
  powerLossWatts: number;
  dinRailWidthMm: number;
  standards: ('IEC' | 'UL')[];
}

export interface CatalogPowerSupply {
  manufacturer: 'Schneider Electric' | 'ABB' | 'Siemens' | 'Eaton' | 'Phoenix Contact';
  partNumber: string;
  inputVoltage: string;
  outputVoltage: string;
  currentRatingA: number;
  powerWatts: number;
  powerLossWatts: number;
  dinRailWidthMm: number;
}

export interface CatalogEnclosure {
  manufacturer: 'Schneider Electric' | 'Rittal' | 'ABB';
  partNumber: string;
  series: string;
  heightMm: number;
  widthMm: number;
  depthMm: number;
  protectionRating: string; // 'IP66 / NEMA 4'
  material: string;
  effectiveAreaM2: number;
}

// REAL, VERIFIED INDUSTRIAL COMPONENTS (Schneider Electric, ABB, Siemens, Eaton)
export const CATALOG_BREAKERS: CatalogBreaker[] = [
  // Schneider Electric TeSys Deca & Compact NSX
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV2ME14',
    series: 'TeSys Deca',
    type: 'MPCB',
    currentRatingA: 10,
    settingRangeMinA: 6,
    settingRangeMaxA: 10,
    magneticTripA: 138,
    breakingCapacityIcu400VKa: 100,
    breakingCapacityIcu480VKa: 50,
    powerLossWatts: 2.5,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV2ME20',
    series: 'TeSys Deca',
    type: 'MPCB',
    currentRatingA: 18,
    settingRangeMinA: 13,
    settingRangeMaxA: 18,
    magneticTripA: 223,
    breakingCapacityIcu400VKa: 15,
    breakingCapacityIcu480VKa: 10,
    powerLossWatts: 3.2,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV2ME22',
    series: 'TeSys Deca',
    type: 'MPCB',
    currentRatingA: 25,
    settingRangeMinA: 20,
    settingRangeMaxA: 25,
    magneticTripA: 327,
    breakingCapacityIcu400VKa: 15,
    breakingCapacityIcu480VKa: 10,
    powerLossWatts: 4.1,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV2ME32',
    series: 'TeSys Deca',
    type: 'MPCB',
    currentRatingA: 32,
    settingRangeMinA: 24,
    settingRangeMaxA: 32,
    magneticTripA: 416,
    breakingCapacityIcu400VKa: 10,
    breakingCapacityIcu480VKa: 10,
    powerLossWatts: 5.5,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV2P32',
    series: 'TeSys Deca High-Break',
    type: 'MPCB',
    currentRatingA: 32,
    settingRangeMinA: 24,
    settingRangeMaxA: 32,
    magneticTripA: 448,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 42,
    powerLossWatts: 6.0,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV3P40',
    series: 'TeSys Deca EverLink',
    type: 'MPCB',
    currentRatingA: 40,
    settingRangeMinA: 30,
    settingRangeMaxA: 40,
    magneticTripA: 560,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 50,
    powerLossWatts: 7.2,
    dinRailWidthMm: 55,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'GV3P65',
    series: 'TeSys Deca EverLink',
    type: 'MPCB',
    currentRatingA: 65,
    settingRangeMinA: 48,
    settingRangeMaxA: 65,
    magneticTripA: 910,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 50,
    powerLossWatts: 9.6,
    dinRailWidthMm: 55,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LV429630 (NSX100F-TM80D)',
    series: 'Compact NSX100F',
    type: 'MCCB',
    currentRatingA: 80,
    settingRangeMinA: 56,
    settingRangeMaxA: 80,
    magneticTripA: 800,
    breakingCapacityIcu400VKa: 36,
    breakingCapacityIcu480VKa: 35,
    powerLossWatts: 14.5,
    dinRailWidthMm: 105,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LV429633 (NSX100N-TM100D)',
    series: 'Compact NSX100N',
    type: 'MCCB',
    currentRatingA: 100,
    settingRangeMinA: 70,
    settingRangeMaxA: 100,
    magneticTripA: 1000,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 50,
    powerLossWatts: 18.0,
    dinRailWidthMm: 105,
    standards: ['IEC', 'UL'],
  },
  // ABB MS132 & Tmax XT
  {
    manufacturer: 'ABB',
    partNumber: 'MS132-32',
    series: 'MS132',
    type: 'MPCB',
    currentRatingA: 32,
    settingRangeMinA: 25,
    settingRangeMaxA: 32,
    magneticTripA: 480,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 30,
    powerLossWatts: 6.2,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'ABB',
    partNumber: 'MS165-42',
    series: 'MS165',
    type: 'MPCB',
    currentRatingA: 42,
    settingRangeMinA: 30,
    settingRangeMaxA: 42,
    magneticTripA: 630,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 50,
    powerLossWatts: 8.5,
    dinRailWidthMm: 55,
    standards: ['IEC', 'UL'],
  },
  // Siemens SIRIUS 3RV2
  {
    manufacturer: 'Siemens',
    partNumber: '3RV2021-4EA10',
    series: 'SIRIUS 3RV2',
    type: 'MPCB',
    currentRatingA: 32,
    settingRangeMinA: 27,
    settingRangeMaxA: 32,
    magneticTripA: 400,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 20,
    powerLossWatts: 5.8,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  // Eaton PKZM0
  {
    manufacturer: 'Eaton',
    partNumber: 'PKZM0-32',
    series: 'Moeller PKZM0',
    type: 'MPCB',
    currentRatingA: 32,
    settingRangeMinA: 25,
    settingRangeMaxA: 32,
    magneticTripA: 496,
    breakingCapacityIcu400VKa: 50,
    breakingCapacityIcu480VKa: 18,
    powerLossWatts: 6.5,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
];

export const CATALOG_CONTACTORS: CatalogContactor[] = [
  // Schneider Electric LC1D
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D09BD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 9,
    ratedPower400VKw: 4,
    ratedHp480V: 5,
    coilVoltage: '24VDC',
    coilInrushVa: 5.4,
    coilHoldVa: 5.4,
    powerLossWatts: 3.5,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D18BD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 18,
    ratedPower400VKw: 7.5,
    ratedHp480V: 10,
    coilVoltage: '24VDC',
    coilInrushVa: 5.4,
    coilHoldVa: 5.4,
    powerLossWatts: 5.2,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D25BD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 25,
    ratedPower400VKw: 11,
    ratedHp480V: 15,
    coilVoltage: '24VDC',
    coilInrushVa: 5.4,
    coilHoldVa: 5.4,
    powerLossWatts: 7.8,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D32BD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 32,
    ratedPower400VKw: 15,
    ratedHp480V: 20,
    coilVoltage: '24VDC',
    coilInrushVa: 5.4,
    coilHoldVa: 5.4,
    powerLossWatts: 9.6,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D32P7',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 32,
    ratedPower400VKw: 15,
    ratedHp480V: 20,
    coilVoltage: '230VAC',
    coilInrushVa: 70,
    coilHoldVa: 7.5,
    powerLossWatts: 9.8,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D32G7',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 32,
    ratedPower400VKw: 15,
    ratedHp480V: 20,
    coilVoltage: '120VAC',
    coilInrushVa: 70,
    coilHoldVa: 7.5,
    powerLossWatts: 9.8,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D40ABD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 40,
    ratedPower400VKw: 18.5,
    ratedHp480V: 30,
    coilVoltage: '24VDC',
    coilInrushVa: 11,
    coilHoldVa: 11,
    powerLossWatts: 14.5,
    dinRailWidthMm: 55,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D65ABD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 65,
    ratedPower400VKw: 30,
    ratedHp480V: 40,
    coilVoltage: '24VDC',
    coilInrushVa: 11,
    coilHoldVa: 11,
    powerLossWatts: 19.8,
    dinRailWidthMm: 55,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LC1D80BD',
    series: 'TeSys Deca',
    ratedCurrentAc3A: 80,
    ratedPower400VKw: 37,
    ratedHp480V: 60,
    coilVoltage: '24VDC',
    coilInrushVa: 20,
    coilHoldVa: 20,
    powerLossWatts: 24.0,
    dinRailWidthMm: 85,
    standards: ['IEC', 'UL'],
  },
  // ABB AF Series
  {
    manufacturer: 'ABB',
    partNumber: 'AF30-30-00-13',
    series: 'AF Series',
    ratedCurrentAc3A: 32,
    ratedPower400VKw: 15,
    ratedHp480V: 20,
    coilVoltage: '24VDC',
    coilInrushVa: 16,
    coilHoldVa: 1.7,
    powerLossWatts: 9.0,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  // Siemens SIRIUS 3RT2
  {
    manufacturer: 'Siemens',
    partNumber: '3RT2027-1BB40',
    series: 'SIRIUS 3RT2',
    ratedCurrentAc3A: 32,
    ratedPower400VKw: 15,
    ratedHp480V: 20,
    coilVoltage: '24VDC',
    coilInrushVa: 5.9,
    coilHoldVa: 5.9,
    powerLossWatts: 9.2,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
];

export const CATALOG_OVERLOADS: CatalogOverload[] = [
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LRD14',
    series: 'TeSys Deca',
    type: 'Thermal',
    currentMinA: 7,
    currentMaxA: 10,
    tripClass: 10,
    powerLossWatts: 3.5,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LRD22',
    series: 'TeSys Deca',
    type: 'Thermal',
    currentMinA: 16,
    currentMaxA: 24,
    tripClass: 10,
    powerLossWatts: 4.8,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LRD32',
    series: 'TeSys Deca',
    type: 'Thermal',
    currentMinA: 23,
    currentMaxA: 32,
    tripClass: 10,
    powerLossWatts: 5.8,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LRD3353',
    series: 'TeSys Deca EverLink',
    type: 'Thermal',
    currentMinA: 23,
    currentMaxA: 32,
    tripClass: 10,
    powerLossWatts: 6.2,
    dinRailWidthMm: 55,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'LR9D32',
    series: 'TeSys Deca Electronic',
    type: 'Electronic',
    currentMinA: 6.4,
    currentMaxA: 32,
    tripClass: 20,
    powerLossWatts: 3.0,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'ABB',
    partNumber: 'TF42-35',
    series: 'TF42',
    type: 'Thermal',
    currentMinA: 29,
    currentMaxA: 35,
    tripClass: 10,
    powerLossWatts: 5.6,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
  {
    manufacturer: 'Siemens',
    partNumber: '3RU2126-4EB0',
    series: 'SIRIUS 3RU2',
    type: 'Thermal',
    currentMinA: 27,
    currentMaxA: 32,
    tripClass: 10,
    powerLossWatts: 5.5,
    dinRailWidthMm: 45,
    standards: ['IEC', 'UL'],
  },
];

export const CATALOG_POWER_SUPPLIES: CatalogPowerSupply[] = [
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'ABLM1A24025',
    inputVoltage: '100-240V AC',
    outputVoltage: '24V DC',
    currentRatingA: 2.5,
    powerWatts: 60,
    powerLossWatts: 8.5,
    dinRailWidthMm: 38,
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'ABLM1A24050',
    inputVoltage: '100-240V AC',
    outputVoltage: '24V DC',
    currentRatingA: 5.0,
    powerWatts: 120,
    powerLossWatts: 14.0,
    dinRailWidthMm: 45,
  },
  {
    manufacturer: 'Phoenix Contact',
    partNumber: 'QUINT4-PS/1AC/24DC/3.8/PT',
    inputVoltage: '100-240V AC',
    outputVoltage: '24V DC',
    currentRatingA: 3.8,
    powerWatts: 90,
    powerLossWatts: 9.8,
    dinRailWidthMm: 40,
  },
];

export const CATALOG_ENCLOSURES: CatalogEnclosure[] = [
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'NSYCRN43200',
    series: 'Spacial CRN',
    heightMm: 400,
    widthMm: 300,
    depthMm: 200,
    protectionRating: 'IP66 / NEMA 4/12',
    material: 'Sheet Steel (RAL 7035)',
    effectiveAreaM2: 0.52,
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'NSYCRN54200',
    series: 'Spacial CRN',
    heightMm: 500,
    widthMm: 400,
    depthMm: 200,
    protectionRating: 'IP66 / NEMA 4/12',
    material: 'Sheet Steel (RAL 7035)',
    effectiveAreaM2: 0.76,
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'NSYCRN64200',
    series: 'Spacial CRN',
    heightMm: 600,
    widthMm: 400,
    depthMm: 200,
    protectionRating: 'IP66 / NEMA 4/12',
    material: 'Sheet Steel (RAL 7035)',
    effectiveAreaM2: 0.92,
  },
  {
    manufacturer: 'Schneider Electric',
    partNumber: 'NSYCRN86250',
    series: 'Spacial CRN',
    heightMm: 800,
    widthMm: 600,
    depthMm: 250,
    protectionRating: 'IP66 / NEMA 4/12',
    material: 'Sheet Steel (RAL 7035)',
    effectiveAreaM2: 1.66,
  },
  {
    manufacturer: 'Rittal',
    partNumber: 'AX 1054.000',
    series: 'Compact AX',
    heightMm: 500,
    widthMm: 500,
    depthMm: 210,
    protectionRating: 'IP66 / NEMA 4',
    material: 'Carbon Steel Dipcoat Primed',
    effectiveAreaM2: 0.92,
  },
];
