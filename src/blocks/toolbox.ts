// Blockly toolbox (category-based) referencing all custom LabOneQ blocks.
// Also includes built-in Variables + Math categories for convenience.

import { Palette } from './enums';

export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Structure',
      colour: String(Palette.structure),
      contents: [
        { kind: 'block', type: 'laboneq_experiment' },
        { kind: 'block', type: 'laboneq_acquire_loop_rt' },
        { kind: 'block', type: 'laboneq_sweep' },
        { kind: 'block', type: 'laboneq_section' },
      ],
    },
    {
      kind: 'category',
      name: 'Feedback',
      colour: String(Palette.feedback),
      contents: [
        { kind: 'block', type: 'laboneq_match' },
        { kind: 'block', type: 'laboneq_case' },
      ],
    },
    {
      kind: 'category',
      name: 'Operations',
      colour: String(Palette.operations),
      contents: [
        { kind: 'block', type: 'laboneq_play' },
        { kind: 'block', type: 'laboneq_acquire' },
        { kind: 'block', type: 'laboneq_measure' },
        { kind: 'block', type: 'laboneq_delay' },
        { kind: 'block', type: 'laboneq_reserve' },
        { kind: 'block', type: 'laboneq_set_node' },
        { kind: 'block', type: 'laboneq_reset_oscillator_phase' },
      ],
    },
    {
      kind: 'category',
      name: 'Pulses',
      colour: String(Palette.pulses),
      contents: [
        { kind: 'block', type: 'laboneq_pulse_gaussian' },
        { kind: 'block', type: 'laboneq_pulse_drag' },
        { kind: 'block', type: 'laboneq_pulse_const' },
        { kind: 'block', type: 'laboneq_pulse_gaussian_square' },
        { kind: 'block', type: 'laboneq_pulse_sampled' },
      ],
    },
    {
      kind: 'category',
      name: 'Parameters',
      colour: String(Palette.parameters),
      contents: [
        { kind: 'block', type: 'laboneq_sweep_parameter' },
        { kind: 'block', type: 'laboneq_linear_sweep_parameter' },
        { kind: 'block', type: 'laboneq_param_arith' },
      ],
    },
    {
      kind: 'category',
      name: 'Calibration',
      colour: String(Palette.calibration),
      contents: [
        { kind: 'block', type: 'laboneq_calibration' },
        { kind: 'block', type: 'laboneq_signal_calibration' },
        { kind: 'block', type: 'laboneq_oscillator' },
      ],
    },
    { kind: 'sep' },
    {
      kind: 'category',
      name: 'Math',
      colour: '230',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '330',
      custom: 'VARIABLE',
    },
  ],
};
