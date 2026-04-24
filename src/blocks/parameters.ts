import { ArithOpOptions, Palette } from './enums';

// Parameter value blocks. Each block hoists its declaration into
// pythonGenerator.definitions_ so `finish()` emits them above the body,
// then the expression itself returns just the variable name.

export const parameterBlocks = [
  {
    type: 'laboneq_sweep_parameter',
    message0: 'SweepParameter',
    message1: 'name %1',
    args1: [{ type: 'field_variable', name: 'VAR', variable: 'values_param' }],
    message2: 'values (py expr) %1',
    args2: [
      {
        type: 'field_input',
        name: 'VALUES',
        text: 'np.linspace(0.0, 1.0, 11)',
      },
    ],
    output: 'Parameter',
    colour: Palette.parameters,
    tooltip:
      'SweepParameter(values=...). The values field accepts any Python expression (list, ndarray, np.linspace, etc.).',
  },
  {
    type: 'laboneq_linear_sweep_parameter',
    message0: 'LinearSweepParameter',
    message1: 'name %1',
    args1: [{ type: 'field_variable', name: 'VAR', variable: 'linear_param' }],
    message2: 'start %1 stop %2',
    args2: [
      { type: 'field_scientific', name: 'START', text: '0.0' },
      { type: 'field_scientific', name: 'STOP', text: '1.0' },
    ],
    message3: 'count %1',
    args3: [
      { type: 'field_number', name: 'COUNT', value: 21, min: 2, precision: 1 },
    ],
    output: 'Parameter',
    colour: Palette.parameters,
    tooltip: 'LinearSweepParameter(start, stop, count)',
  },
  {
    type: 'laboneq_param_arith',
    message0: 'derive',
    message1: 'name %1',
    args1: [{ type: 'field_variable', name: 'VAR', variable: 'derived_param' }],
    message2: 'op %1',
    args2: [{ type: 'field_dropdown', name: 'OP', options: ArithOpOptions }],
    message3: 'a %1',
    args3: [
      { type: 'input_value', name: 'A', check: ['Number', 'Parameter'] },
    ],
    message4: 'b (ignored for np.sin/cos/sqrt/exp) %1',
    args4: [
      { type: 'input_value', name: 'B', check: ['Number', 'Parameter'] },
    ],
    output: 'Parameter',
    colour: Palette.parameters,
    tooltip:
      'Derive a parameter via arithmetic or numpy ufunc. Unary ops (np.sin/cos/sqrt/exp) ignore input B.',
  },
];
