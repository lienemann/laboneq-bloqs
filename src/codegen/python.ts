import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { PYTHON_HEADER, RESERVED } from './header';
// Side-effect import: registers all forBlock[] entries on pythonGenerator.
import './generators';

let reservedInstalled = false;

export function generate(workspace: Blockly.Workspace): string {
  if (!reservedInstalled) {
    pythonGenerator.addReservedWords(RESERVED);
    reservedInstalled = true;
  }
  // Manual init/finish because we want header + hoisted param decls in
  // definitions_ to appear above our body, in a deterministic order.
  pythonGenerator.init(workspace);
  // Header is keyed '__header__' which sorts before 'param_*' etc.
  (pythonGenerator as any).definitions_['__header__'] = PYTHON_HEADER.trimEnd();

  let body = '';
  for (const b of workspace.getTopBlocks(true)) {
    const code = pythonGenerator.blockToCode(b);
    if (typeof code === 'string') body += code + '\n';
  }
  return pythonGenerator.finish(body).trimEnd() + '\n';
}
