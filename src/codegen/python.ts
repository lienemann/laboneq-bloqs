import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { PYTHON_HEADER, RESERVED } from './header';
// Side-effect import: registers all forBlock[] entries on pythonGenerator.
import './generators';

let reservedInstalled = false;

// Blockly's pythonGenerator defaults to a 2-space INDENT. Force PEP 8's
// 4-space indent so our statementToCode outputs nest correctly with the
// de-indent logic in the Experiment/Calibration generators.
(pythonGenerator as any).INDENT = '    ';

export function generate(workspace: Blockly.Workspace): string {
  if (!reservedInstalled) {
    pythonGenerator.addReservedWords(RESERVED);
    reservedInstalled = true;
  }
  // Manual init/finish because we want header + hoisted param decls in
  // definitions_ to appear above our body, in a deterministic order.
  pythonGenerator.init(workspace);
  // Blockly's pythonGenerator.init() auto-emits `name = None` for every
  // workspace variable. For our DSL those names are bound by `with ... as`
  // contexts or hoisted parameter declarations, so the stub assignments are
  // just noise. Drop them.
  delete (pythonGenerator as any).definitions_['variables'];
  // Header is keyed '__header__' which sorts before 'param_*' etc.
  (pythonGenerator as any).definitions_['__header__'] = PYTHON_HEADER.trimEnd();

  let body = '';
  for (const b of workspace.getTopBlocks(true)) {
    const code = pythonGenerator.blockToCode(b);
    if (typeof code === 'string') body += code + '\n';
  }
  return pythonGenerator.finish(body).trimEnd() + '\n';
}
