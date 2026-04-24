import { Palette } from './enums';

// Pulse value blocks: each returns a Pulse-typed expression like
// `pulse_library.gaussian(length=32e-9, amplitude=1.0, sigma=0.33)`.
// All length/amplitude fields use the field_scientific input registered in
// structure.ts to preserve scientific notation verbatim.

export const pulseBlocks = [
  {
    type: 'laboneq_pulse_gaussian',
    message0: 'gaussian',
    message1: 'length %1 amplitude %2',
    args1: [
      { type: 'field_scientific', name: 'LENGTH', text: '32e-9' },
      { type: 'field_scientific', name: 'AMP', text: '1.0' },
    ],
    message2: 'sigma %1',
    args2: [{ type: 'field_scientific', name: 'SIGMA', text: '0.33' }],
    output: 'Pulse',
    colour: Palette.pulses,
    tooltip: 'pulse_library.gaussian(...)',
  },
  {
    type: 'laboneq_pulse_drag',
    message0: 'drag',
    message1: 'length %1 amplitude %2',
    args1: [
      { type: 'field_scientific', name: 'LENGTH', text: '32e-9' },
      { type: 'field_scientific', name: 'AMP', text: '1.0' },
    ],
    message2: 'sigma %1 beta %2',
    args2: [
      { type: 'field_scientific', name: 'SIGMA', text: '0.33' },
      { type: 'field_scientific', name: 'BETA', text: '0.2' },
    ],
    output: 'Pulse',
    colour: Palette.pulses,
    tooltip: 'pulse_library.drag(...)',
  },
  {
    type: 'laboneq_pulse_const',
    message0: 'const',
    message1: 'length %1 amplitude %2',
    args1: [
      { type: 'field_scientific', name: 'LENGTH', text: '1e-6' },
      { type: 'field_scientific', name: 'AMP', text: '1.0' },
    ],
    output: 'Pulse',
    colour: Palette.pulses,
    tooltip: 'pulse_library.const(...)',
  },
  {
    type: 'laboneq_pulse_gaussian_square',
    message0: 'gaussian_square',
    message1: 'length %1 amplitude %2',
    args1: [
      { type: 'field_scientific', name: 'LENGTH', text: '1e-6' },
      { type: 'field_scientific', name: 'AMP', text: '1.0' },
    ],
    message2: 'width %1 sigma %2',
    args2: [
      { type: 'field_scientific', name: 'WIDTH', text: '500e-9' },
      { type: 'field_scientific', name: 'SIGMA', text: '0.33' },
    ],
    output: 'Pulse',
    colour: Palette.pulses,
    tooltip: 'pulse_library.gaussian_square(...)',
  },
  {
    type: 'laboneq_pulse_sampled',
    message0: 'sampled_pulse_real',
    message1: 'samples (py expr) %1',
    args1: [{ type: 'field_input', name: 'SAMPLES', text: 'np.ones(128)' }],
    message2: 'uid %1',
    args2: [{ type: 'field_input', name: 'UID', text: 'custom_pulse' }],
    output: 'Pulse',
    colour: Palette.pulses,
    tooltip:
      'pulse_library.sampled_pulse_real(samples=..., uid=...). The samples field accepts any Python expression.',
  },
];
