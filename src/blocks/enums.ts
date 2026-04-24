// Enum dropdown options surfaced on host blocks. Values match the symbolic
// LabOneQ enum attribute (e.g. "CYCLIC" -> AveragingMode.CYCLIC).

export type EnumOption = [label: string, value: string];

export const AveragingModeOptions: EnumOption[] = [
  ['CYCLIC', 'CYCLIC'],
  ['SEQUENTIAL', 'SEQUENTIAL'],
  ['SINGLE_SHOT', 'SINGLE_SHOT'],
];

export const AcquisitionTypeOptions: EnumOption[] = [
  ['INTEGRATION', 'INTEGRATION'],
  ['SPECTROSCOPY', 'SPECTROSCOPY'],
  ['SPECTROSCOPY_IQ', 'SPECTROSCOPY_IQ'],
  ['SPECTROSCOPY_PSD', 'SPECTROSCOPY_PSD'],
  ['DISCRIMINATION', 'DISCRIMINATION'],
  ['RAW', 'RAW'],
];

export const SectionAlignmentOptions: EnumOption[] = [
  ['LEFT', 'LEFT'],
  ['RIGHT', 'RIGHT'],
];

export const ExecutionTypeOptions: EnumOption[] = [
  ['REAL_TIME', 'REAL_TIME'],
  ['NEAR_TIME', 'NEAR_TIME'],
];

export const RepetitionModeOptions: EnumOption[] = [
  ['FASTEST', 'FASTEST'],
  ['CONSTANT', 'CONSTANT'],
  ['AUTO', 'AUTO'],
];

export const ModulationTypeOptions: EnumOption[] = [
  ['AUTO', 'AUTO'],
  ['HARDWARE', 'HARDWARE'],
  ['SOFTWARE', 'SOFTWARE'],
];

export const ArithOpOptions: EnumOption[] = [
  ['+', '+'],
  ['-', '-'],
  ['*', '*'],
  ['/', '/'],
  ['np.sin', 'np.sin'],
  ['np.cos', 'np.cos'],
  ['np.sqrt', 'np.sqrt'],
  ['np.exp', 'np.exp'],
];

// Palette colours (Blockly HSV hue).
export const Palette = {
  structure: 210,
  feedback: 330,
  pulses: 290,
  operations: 45,
  parameters: 160,
  calibration: 20,
} as const;
