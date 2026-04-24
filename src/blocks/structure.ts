import {
  AcquisitionTypeOptions,
  AveragingModeOptions,
  ExecutionTypeOptions,
  Palette,
  RepetitionModeOptions,
  SectionAlignmentOptions,
} from './enums';

export const structureBlocks = [
  {
    type: 'laboneq_experiment',
    message0: 'Experiment',
    message1: 'uid %1',
    args1: [{ type: 'field_input', name: 'UID', text: 'exp' }],
    message2: 'signals (csv) %1',
    args2: [
      {
        type: 'field_input',
        name: 'SIGNALS',
        text: 'q0_drive,q0_measure,q0_acquire',
      },
    ],
    message3: 'body %1',
    args3: [{ type: 'input_statement', name: 'BODY' }],
    colour: Palette.structure,
    tooltip:
      'Top-level LabOneQ Experiment. Emits imports, binds `exp`, then runs the body at module scope.',
    helpUrl: '',
  },
  {
    type: 'laboneq_acquire_loop_rt',
    message0: 'acquire_loop_rt',
    message1: 'count %1',
    args1: [
      { type: 'field_number', name: 'COUNT', value: 100, min: 1, precision: 1 },
    ],
    message2: 'averaging %1',
    args2: [
      {
        type: 'field_dropdown',
        name: 'AVERAGING',
        options: AveragingModeOptions,
      },
    ],
    message3: 'acquisition %1',
    args3: [
      {
        type: 'field_dropdown',
        name: 'ACQUISITION',
        options: AcquisitionTypeOptions,
      },
    ],
    message4: 'repetition %1',
    args4: [
      {
        type: 'field_dropdown',
        name: 'REPETITION',
        options: RepetitionModeOptions,
      },
    ],
    message5: 'time (if CONSTANT) %1',
    args5: [{ type: 'field_scientific', name: 'REP_TIME', text: '' }],
    message6: 'body %1',
    args6: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.structure,
    tooltip:
      'Real-time acquisition loop. Leave "time" empty unless repetition is CONSTANT.',
  },
  {
    type: 'laboneq_sweep',
    message0: 'sweep',
    message1: 'name %1',
    args1: [{ type: 'field_variable', name: 'VAR', variable: 'amp' }],
    message2: 'parameter %1',
    args2: [{ type: 'input_value', name: 'PARAM', check: 'Parameter' }],
    message3: 'execution %1',
    args3: [
      {
        type: 'field_dropdown',
        name: 'EXECUTION',
        options: ExecutionTypeOptions,
      },
    ],
    message4: 'body %1',
    args4: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.structure,
    tooltip:
      'Parametric sweep. The variable name binds the sweep parameter inside the body.',
  },
  {
    type: 'laboneq_section',
    message0: 'section',
    message1: 'name %1',
    args1: [{ type: 'field_variable', name: 'NAME', variable: 'sec1' }],
    message2: 'alignment %1',
    args2: [
      {
        type: 'field_dropdown',
        name: 'ALIGN',
        options: SectionAlignmentOptions,
      },
    ],
    message3: 'play_after (optional) %1',
    args3: [{ type: 'field_variable', name: 'AFTER', variable: '' }],
    message4: 'length (optional) %1',
    args4: [{ type: 'field_scientific', name: 'LENGTH', text: '' }],
    message5: 'body %1',
    args5: [{ type: 'input_statement', name: 'BODY' }],
    previousStatement: null,
    nextStatement: null,
    colour: Palette.structure,
    tooltip:
      'Timing section. play_after refers to a previously named section; leave blank if unused.',
  },
];
