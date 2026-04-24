import * as Blockly from 'blockly/core';
import {
  AcquisitionTypeOptions,
  AveragingModeOptions,
  ExecutionTypeOptions,
  Palette,
  RepetitionModeOptions,
  SectionAlignmentOptions,
} from './enums';

// A number/scientific-notation input validator for time/length/amplitude.
const SCI_REGEX = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
function sciValidator(v: string): string | null {
  return SCI_REGEX.test(v.trim()) ? v.trim() : null;
}
class FieldScientific extends Blockly.FieldTextInput {
  constructor(value?: string) {
    super(value ?? '0');
    this.setValidator(sciValidator);
  }
  static override fromJson(options: any) {
    return new FieldScientific(options?.text ?? '0');
  }
}
// Register so JSON block defs can reference this field via type: 'field_scientific'.
Blockly.fieldRegistry.register('field_scientific', FieldScientific as any);

export const structureBlocks: Blockly.serialization.blocks.State[] | any[] = [
  {
    type: 'laboneq_experiment',
    message0: 'Experiment  uid %1  signals (csv) %2',
    args0: [
      { type: 'field_input', name: 'UID', text: 'exp' },
      {
        type: 'field_input',
        name: 'SIGNALS',
        text: 'q0_drive,q0_measure,q0_acquire',
      },
    ],
    message1: 'body %1',
    args1: [{ type: 'input_statement', name: 'BODY' }],
    colour: Palette.structure,
    tooltip:
      'Top-level LabOneQ Experiment. Emits imports, binds `exp`, then runs the body at module scope.',
    helpUrl: '',
  },
  {
    type: 'laboneq_acquire_loop_rt',
    message0:
      'acquire_loop_rt  count %1  averaging %2  acquisition %3',
    args0: [
      { type: 'field_number', name: 'COUNT', value: 100, min: 1, precision: 1 },
      {
        type: 'field_dropdown',
        name: 'AVERAGING',
        options: AveragingModeOptions,
      },
      {
        type: 'field_dropdown',
        name: 'ACQUISITION',
        options: AcquisitionTypeOptions,
      },
    ],
    message1: 'repetition %1  time %2',
    args1: [
      {
        type: 'field_dropdown',
        name: 'REPETITION',
        options: RepetitionModeOptions,
      },
      { type: 'field_scientific', name: 'REP_TIME', text: '' },
    ],
    message2: 'body %1',
    args2: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.structure,
    tooltip:
      'Real-time acquisition loop. Leave "time" empty unless repetition is CONSTANT.',
  },
  {
    type: 'laboneq_sweep',
    message0: 'sweep  name %1  parameter %2  execution %3',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'amp' },
      { type: 'input_value', name: 'PARAM', check: 'Parameter' },
      {
        type: 'field_dropdown',
        name: 'EXECUTION',
        options: ExecutionTypeOptions,
      },
    ],
    message1: 'body %1',
    args1: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.structure,
    tooltip:
      'Parametric sweep. The variable name binds the sweep parameter inside the body.',
  },
  {
    type: 'laboneq_section',
    message0:
      'section  name %1  alignment %2  play_after %3  length %4',
    args0: [
      { type: 'field_variable', name: 'NAME', variable: 'sec1' },
      {
        type: 'field_dropdown',
        name: 'ALIGN',
        options: SectionAlignmentOptions,
      },
      { type: 'field_variable', name: 'AFTER', variable: '' },
      { type: 'field_scientific', name: 'LENGTH', text: '' },
    ],
    message1: 'body %1',
    args1: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.structure,
    tooltip:
      'Timing section. play_after refers to a previously named section; leave blank if unused.',
  },
];
