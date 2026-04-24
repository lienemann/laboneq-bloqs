import { Palette } from './enums';

// Statement blocks representing operation calls on the experiment (exp.*).
// All accept value inputs for pulses/amplitudes where applicable so that
// parameters (SweepParameter, arithmetic) and pulse expressions can be wired in.

export const operationBlocks = [
  {
    type: 'laboneq_play',
    message0: 'play',
    message1: 'signal %1',
    args1: [{ type: 'field_signal', name: 'SIGNAL', value: 'q0_drive' }],
    message2: 'pulse %1',
    args2: [{ type: 'input_value', name: 'PULSE', check: 'Pulse' }],
    message3: 'amplitude (optional) %1',
    args3: [
      {
        type: 'input_value',
        name: 'AMP',
        check: ['Number', 'Parameter'],
      },
    ],
    message4: 'phase (optional) %1',
    args4: [
      {
        type: 'input_value',
        name: 'PHASE',
        check: ['Number', 'Parameter'],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.play(signal=..., pulse=..., amplitude=..., phase=...)',
  },
  {
    type: 'laboneq_acquire',
    message0: 'acquire',
    message1: 'signal %1',
    args1: [{ type: 'field_signal', name: 'SIGNAL', value: 'q0_acquire' }],
    message2: 'handle %1',
    args2: [{ type: 'field_input', name: 'HANDLE', text: 'result' }],
    message3: 'kernel (optional) %1',
    args3: [{ type: 'input_value', name: 'KERNEL', check: 'Pulse' }],
    message4: 'length (optional) %1',
    args4: [{ type: 'field_scientific', name: 'LENGTH', text: '' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip:
      'exp.acquire(signal=..., handle=..., kernel=..., length=...). Kernel and length are optional.',
  },
  {
    type: 'laboneq_measure',
    message0: 'measure',
    message1: 'acquire_signal %1',
    args1: [{ type: 'field_signal', name: 'ACQ', value: 'q0_acquire' }],
    message2: 'measure_signal %1',
    args2: [{ type: 'field_signal', name: 'MEAS', value: 'q0_measure' }],
    message3: 'handle %1',
    args3: [{ type: 'field_input', name: 'HANDLE', text: 'result' }],
    message4: 'measure_pulse %1',
    args4: [{ type: 'input_value', name: 'MEAS_PULSE', check: 'Pulse' }],
    message5: 'integration_kernel %1',
    args5: [{ type: 'input_value', name: 'KERNEL', check: 'Pulse' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip:
      'exp.measure(acquire_signal=..., measure_signal=..., handle=..., measure_pulse=..., integration_kernel=...)',
  },
  {
    type: 'laboneq_delay',
    message0: 'delay',
    message1: 'signal %1',
    args1: [{ type: 'field_signal', name: 'SIGNAL', value: 'q0_drive' }],
    message2: 'time %1',
    args2: [{ type: 'field_scientific', name: 'TIME', text: '100e-9' }],
    message3: 'or parameter %1',
    args3: [
      {
        type: 'input_value',
        name: 'TIME_PARAM',
        check: ['Number', 'Parameter'],
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
    message0: 'reserve',
    message1: 'signal %1',
    args1: [{ type: 'field_signal', name: 'SIGNAL', value: 'q0_drive' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.reserve(signal=...)',
  },
  {
    type: 'laboneq_set_node',
    message0: 'set_node',
    message1: 'path %1',
    args1: [
      {
        type: 'field_input',
        name: 'PATH',
        text: '/dev1234/sgchannels/0/awg/enable',
      },
    ],
    message2: 'value %1',
    args2: [{ type: 'field_input', name: 'VALUE', text: '1' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip:
      'exp.set_node(path=..., value=...). Value is emitted verbatim (Python expression).',
  },
  {
    type: 'laboneq_reset_oscillator_phase',
    message0: 'reset_oscillator_phase',
    message1: 'signal (empty = all) %1',
    args1: [{ type: 'field_signal', name: 'SIGNAL', value: '' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.operations,
    tooltip: 'exp.reset_oscillator_phase(signal=...)',
  },
];
