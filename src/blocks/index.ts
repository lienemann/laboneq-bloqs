import * as Blockly from 'blockly/core';
import { registerFields } from './fields';
import { structureBlocks } from './structure';
import { feedbackBlocks } from './feedback';
import { pulseBlocks } from './pulses';
import { operationBlocks } from './operations';
import { parameterBlocks } from './parameters';
import { calibrationBlocks } from './calibration';

let registered = false;

export function registerBlocks(): void {
  if (registered) return;
  registered = true;
  // Custom fields must be registered before any block JSON that references
  // them (field_scientific, field_signal).
  registerFields();
  const all = [
    ...structureBlocks,
    ...feedbackBlocks,
    ...pulseBlocks,
    ...operationBlocks,
    ...parameterBlocks,
    ...calibrationBlocks,
  ];
  Blockly.defineBlocksWithJsonArray(all as any[]);
}

export { toolbox } from './toolbox';
