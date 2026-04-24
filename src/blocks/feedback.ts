import { Palette } from './enums';

// Match / Case blocks for real-time feedback.
// `case` is constrained to only connect to `match`'s CASES body via the
// 'Case' statement-connection type check.

export const feedbackBlocks = [
  {
    type: 'laboneq_match',
    message0: 'match  handle %1  play_after %2',
    args0: [
      { type: 'field_input', name: 'HANDLE', text: 'qubit_state' },
      { type: 'field_variable', name: 'AFTER', variable: '' },
    ],
    message1: 'cases %1',
    args1: [{ type: 'input_statement', name: 'CASES', check: 'Case' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.feedback,
    tooltip:
      'Real-time feedback branch. The handle must match a prior acquire() with AcquisitionType.DISCRIMINATION.',
  },
  {
    type: 'laboneq_case',
    message0: 'case  state %1',
    args0: [
      { type: 'field_number', name: 'STATE', value: 0, min: 0, precision: 1 },
    ],
    message1: 'body %1',
    args1: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: 'Case',
    nextStatement: 'Case',
    colour: Palette.feedback,
    tooltip:
      'A single branch of a match. Only connects inside a match block.',
  },
];
