import { Palette } from './enums';

// Statement blocks representing operation calls on the experiment (exp.*).
// All accept value inputs for pulses/amplitudes where applicable so that
// parameters (SweepParameter, arithmetic) and pulse expressions can be wired in.

export const operationBlocks = [
  {
    type: 'laboneq_play',
    message0: 'play  signal %1  pulse %2',
    args0: [
      { type: 'field_input', name: 'SIGNAL', text: 'q0_drive' },
      { type: 'input_value', name: 'PULSE', check: 'Pulse' },
    ],
    message1: 'amplitude %1  phase %2',
    args1: [
      {
        type: 'input_value',
        name: 'AMP',
        check: ['Number', 'Parameter'],
        align: 'RIGHT',
      },
      {
        type: 'input_value',
        name: 'PHASE',
        check: ['Number', 'Parameter'],
        align: 'RIGHT',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.play(signal=..., pulse=..., amplitude=..., phase=...)',
    inputsInline: false,
  },
  {
    type: 'laboneq_acquire',
    message0: 'acquire  signal %1  handle %2',
    args0: [
      { type: 'field_input', name: 'SIGNAL', text: 'q0_acquire' },
      { type: 'field_input', name: 'HANDLE', text: 'result' },
    ],
    message1: 'kernel %1  length %2',
    args1: [
      {
        type: 'input_value',
        name: 'KERNEL',
        check: 'Pulse',
        align: 'RIGHT',
      },
      {
        type: 'field_scientific',
        name: 'LENGTH',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip:
      'exp.acquire(signal=..., handle=..., kernel=..., length=...). Kernel and length are optional (leave disconnected / blank).',
  },
  {
    type: 'laboneq_measure',
    message0: 'measure  acquire_signal %1  measure_signal %2  handle %3',
    args0: [
      { type: 'field_input', name: 'ACQ', text: 'q0_acquire' },
      { type: 'field_input', name: 'MEAS', text: 'q0_measure' },
      { type: 'field_input', name: 'HANDLE', text: 'result' },
    ],
    message1: 'measure_pulse %1  integration_kernel %2',
    args1: [
      { type: 'input_value', name: 'MEAS_PULSE', check: 'Pulse', align: 'RIGHT' },
      { type: 'input_value', name: 'KERNEL', check: 'Pulse', align: 'RIGHT' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip:
      'exp.measure(acquire_signal=..., measure_signal=..., handle=..., measure_pulse=..., integration_kernel=...)',
  },
  {
    type: 'laboneq_delay',
    message0: 'delay  signal %1  time %2',
    args0: [
      { type: 'field_input', name: 'SIGNAL', text: 'q0_drive' },
      { type: 'field_scientific', name: 'TIME', text: '100e-9' },
    ],
    message1: 'or parameter %1',
    args1: [
      {
        type: 'input_value',
        name: 'TIME_PARAM',
        check: ['Number', 'Parameter'],
        align: 'RIGHT',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip:
      'exp.delay(signal=..., time=...). If a parameter is connected it takes precedence over the text field.',
  },
  {
    type: 'laboneq_reserve',
    message0: 'reserve  signal %1',
    args0: [{ type: 'field_input', name: 'SIGNAL', text: 'q0_drive' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.reserve(signal=...)',
  },
  {
    type: 'laboneq_set_node',
    message0: 'set_node  path %1  value %2',
    args0: [
      { type: 'field_input', name: 'PATH', text: '/dev1234/sgchannels/0/awg/enable' },
      { type: 'field_input', name: 'VALUE', text: '1' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.set_node(path=..., value=...). Value is emitted verbatim (Python expression).',
  },
  {
    type: 'laboneq_reset_oscillator_phase',
    message0: 'reset_oscillator_phase  signal (empty = all) %1',
    args0: [{ type: 'field_input', name: 'SIGNAL', text: '' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.reset_oscillator_phase(signal=...)',
  },
];
