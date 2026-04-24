import { ArithOpOptions, Palette } from './enums';

// Parameter value blocks. Each block hoists its declaration into
// pythonGenerator.definitions_ so `finish()` emits them above the body,
// then the expression itself returns just the variable name.

export const parameterBlocks = [
  {
    type: 'laboneq_sweep_parameter',
    message0: 'SweepParameter  name %1  values (py expr) %2',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'values_param' },
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
    message0:
      'LinearSweepParameter  name %1  start %2  stop %3  count %4',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'linear_param' },
      { type: 'field_scientific', name: 'START', text: '0.0' },
      { type: 'field_scientific', name: 'STOP', text: '1.0' },
      { type: 'field_number', name: 'COUNT', value: 21, min: 2, precision: 1 },
    ],
    output: 'Parameter',
    colour: Palette.parameters,
    tooltip: 'LinearSweepParameter(start, stop, count)',
  },
  {
    type: 'laboneq_param_arith',
    message0: 'derive  name %1  op %2  a %3  b %4',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'derived_param' },
      { type: 'field_dropdown', name: 'OP', options: ArithOpOptions },
      {
        type: 'input_value',
        name: 'A',
        check: ['Number', 'Parameter'],
      },
      {
        type: 'input_value',
        name: 'B',
        check: ['Number', 'Parameter'],
      },
    ],
    output: 'Parameter',
    colour: Palette.parameters,
    tooltip:
      'Derive a parameter via arithmetic or numpy ufunc. Unary ops (np.sin/cos/sqrt/exp) ignore input B.',
  },
];
