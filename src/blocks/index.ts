import * as Blockly from 'blockly/core';
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
