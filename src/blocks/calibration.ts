import { ModulationTypeOptions, Palette } from './enums';

// Calibration composite block. Holds a stack of signal calibrations, each
// carrying an optional oscillator value block.

export const calibrationBlocks = [
  {
    type: 'laboneq_calibration',
    message0: 'Calibration  (applied before experiment body)',
    message1: 'entries %1',
    args1: [{ type: 'input_statement', name: 'ENTRIES', check: 'SignalCal' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.calibration,
    tooltip:
      'Builds a Calibration() object. Stack SignalCalibration entries inside. Applied via exp.set_calibration(...).',
  },
  {
    type: 'laboneq_signal_calibration',
    message0: 'SignalCalibration  signal %1',
    args0: [{ type: 'field_signal', name: 'SIGNAL', value: 'q0_drive' }],
    message1:
      'oscillator %1  local_oscillator_freq %2  amplitude %3',
    args1: [
      { type: 'input_value', name: 'OSC', check: 'Oscillator' },
      { type: 'field_scientific', name: 'LO_FREQ', text: '' },
      { type: 'field_scientific', name: 'AMP', text: '' },
    ],
    previousStatement: 'SignalCal',
    nextStatement: 'SignalCal',
    colour: Palette.calibration,
    tooltip:
      'A single-signal calibration entry. Leave LO and amplitude blank to omit them.',
  },
  {
    type: 'laboneq_oscillator',
    message0:
      'Oscillator  frequency %1  modulation_type %2',
    args0: [
      { type: 'field_scientific', name: 'FREQ', text: '100e6' },
      {
        type: 'field_dropdown',
        name: 'MOD',
        options: ModulationTypeOptions,
      },
    ],
    output: 'Oscillator',
    colour: Palette.calibration,
    tooltip: 'Oscillator(frequency=..., modulation_type=...)',
  },
];
