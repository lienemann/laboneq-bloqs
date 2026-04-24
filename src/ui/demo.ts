import * as Blockly from 'blockly/core';

// A "show-off" demo experiment: a Rabi amplitude sweep with active-reset
// feedback and explicit signal calibration. Exercises a wide slice of the
// block library:
//   - Calibration → SignalCalibration → Oscillator
//   - LinearSweepParameter hoisted as a top-level declaration
//   - Experiment → acquire_loop_rt → sweep → nested sections with play_after
//   - play with gaussian and const pulses; amplitude bound to a sweep param
//   - acquire with a discrimination kernel
//   - delay to pad timing
//   - reserve to hold a signal across a conditional block
//   - match / case feedback driving a reset pulse
//   - a DRAG pulse and a reset_oscillator_phase call for variety
//
// The blocks are constructed programmatically and laid out via moveBy so
// the result is readable on first load.

type BlockMap = Record<string, Blockly.Block>;

function newBlock(ws: Blockly.WorkspaceSvg, type: string): Blockly.BlockSvg {
  const b = ws.newBlock(type) as Blockly.BlockSvg;
  b.initSvg();
  b.render();
  return b;
}

function setField(b: Blockly.Block, name: string, value: string | number): void {
  b.setFieldValue(String(value), name);
}

// Create (or reuse) a workspace variable by name and bind its id to the
// named field on `block`. Variable fields store the ID, not the text.
function bindVar(
  ws: Blockly.WorkspaceSvg,
  block: Blockly.Block,
  field: string,
  varName: string,
): void {
  let model = ws.getVariable(varName);
  if (!model) model = ws.createVariable(varName);
  block.setFieldValue(model.getId(), field);
}

function connectStatement(
  parent: Blockly.Block,
  inputName: string,
  child: Blockly.Block,
): void {
  const conn = parent.getInput(inputName)?.connection;
  if (conn && child.previousConnection) {
    conn.connect(child.previousConnection);
  }
}

function connectValue(
  parent: Blockly.Block,
  inputName: string,
  child: Blockly.Block,
): void {
  const conn = parent.getInput(inputName)?.connection;
  if (conn && child.outputConnection) {
    conn.connect(child.outputConnection);
  }
}

function chainNext(a: Blockly.Block, b: Blockly.Block): void {
  if (a.nextConnection && b.previousConnection) {
    a.nextConnection.connect(b.previousConnection);
  }
}

export function loadDemoWorkspace(ws: Blockly.WorkspaceSvg): void {
  ws.clear();
  const blocks: BlockMap = {};

  // ---- Calibration (top-level) ----
  blocks.calib = newBlock(ws, 'laboneq_calibration');
  blocks.calib.moveBy(20, 20);

  blocks.sigDrive = newBlock(ws, 'laboneq_signal_calibration');
  setField(blocks.sigDrive, 'SIGNAL', 'q0_drive');
  setField(blocks.sigDrive, 'LO_FREQ', '5e9');
  setField(blocks.sigDrive, 'AMP', '0.8');

  blocks.oscDrive = newBlock(ws, 'laboneq_oscillator');
  setField(blocks.oscDrive, 'FREQ', '100e6');
  setField(blocks.oscDrive, 'MOD', 'HARDWARE');
  connectValue(blocks.sigDrive, 'OSC', blocks.oscDrive);

  blocks.sigMeas = newBlock(ws, 'laboneq_signal_calibration');
  setField(blocks.sigMeas, 'SIGNAL', 'q0_measure');
  setField(blocks.sigMeas, 'LO_FREQ', '7e9');

  blocks.oscMeas = newBlock(ws, 'laboneq_oscillator');
  setField(blocks.oscMeas, 'FREQ', '50e6');
  setField(blocks.oscMeas, 'MOD', 'HARDWARE');
  connectValue(blocks.sigMeas, 'OSC', blocks.oscMeas);

  connectStatement(blocks.calib, 'ENTRIES', blocks.sigDrive);
  chainNext(blocks.sigDrive, blocks.sigMeas);

  // ---- Experiment (top-level) ----
  blocks.exp = newBlock(ws, 'laboneq_experiment');
  setField(blocks.exp, 'UID', 'rabi_with_reset');
  setField(blocks.exp, 'SIGNALS', 'q0_drive,q0_measure,q0_acquire');
  blocks.exp.moveBy(20, 220);

  // acquire_loop_rt
  blocks.loop = newBlock(ws, 'laboneq_acquire_loop_rt');
  setField(blocks.loop, 'COUNT', 1000);
  setField(blocks.loop, 'AVERAGING', 'CYCLIC');
  // Use DISCRIMINATION so the match block has a valid handle source.
  setField(blocks.loop, 'ACQUISITION', 'DISCRIMINATION');
  connectStatement(blocks.exp, 'BODY', blocks.loop);

  // sweep bound to `amp`
  blocks.sweep = newBlock(ws, 'laboneq_sweep');
  bindVar(ws, blocks.sweep, 'VAR', 'amp');

  blocks.ampParam = newBlock(ws, 'laboneq_linear_sweep_parameter');
  bindVar(ws, blocks.ampParam, 'VAR', 'amp_values');
  setField(blocks.ampParam, 'START', '0.0');
  setField(blocks.ampParam, 'STOP', '1.0');
  setField(blocks.ampParam, 'COUNT', 21);
  connectValue(blocks.sweep, 'PARAM', blocks.ampParam);
  connectStatement(blocks.loop, 'BODY', blocks.sweep);

  // drive section (right-aligned so the pulse lands just before readout)
  blocks.secDrive = newBlock(ws, 'laboneq_section');
  bindVar(ws, blocks.secDrive, 'NAME', 'drive');
  setField(blocks.secDrive, 'ALIGN', 'RIGHT');
  connectStatement(blocks.sweep, 'BODY', blocks.secDrive);

  blocks.play = newBlock(ws, 'laboneq_play');
  setField(blocks.play, 'SIGNAL', 'q0_drive');
  blocks.driveGaussian = newBlock(ws, 'laboneq_pulse_gaussian');
  setField(blocks.driveGaussian, 'LENGTH', '32e-9');
  setField(blocks.driveGaussian, 'AMP', '1.0');
  setField(blocks.driveGaussian, 'SIGMA', '0.33');
  connectValue(blocks.play, 'PULSE', blocks.driveGaussian);

  blocks.playAmp = newBlock(ws, 'laboneq_sweep_parameter');
  // Reference the swept amplitude directly by reusing the sweep's variable.
  const ampVar = ws.getVariable('amp');
  if (ampVar) blocks.playAmp.setFieldValue(ampVar.getId(), 'VAR');
  // Replace the default `values` expression with a marker that clearly
  // shows this block is just re-exposing the already-hoisted `amp` param.
  setField(blocks.playAmp, 'VALUES', 'amp');
  connectValue(blocks.play, 'AMP', blocks.playAmp);

  connectStatement(blocks.secDrive, 'BODY', blocks.play);

  // measurement section (after drive)
  blocks.secMeas = newBlock(ws, 'laboneq_section');
  bindVar(ws, blocks.secMeas, 'NAME', 'measure');
  bindVar(ws, blocks.secMeas, 'AFTER', 'drive');
  chainNext(blocks.secDrive, blocks.secMeas);

  blocks.delay = newBlock(ws, 'laboneq_delay');
  setField(blocks.delay, 'SIGNAL', 'q0_measure');
  setField(blocks.delay, 'TIME', '20e-9');
  connectStatement(blocks.secMeas, 'BODY', blocks.delay);

  blocks.playMeas = newBlock(ws, 'laboneq_play');
  setField(blocks.playMeas, 'SIGNAL', 'q0_measure');
  blocks.measConst = newBlock(ws, 'laboneq_pulse_gaussian_square');
  setField(blocks.measConst, 'LENGTH', '1e-6');
  setField(blocks.measConst, 'AMP', '0.5');
  setField(blocks.measConst, 'WIDTH', '800e-9');
  setField(blocks.measConst, 'SIGMA', '0.25');
  connectValue(blocks.playMeas, 'PULSE', blocks.measConst);
  chainNext(blocks.delay, blocks.playMeas);

  blocks.acquire = newBlock(ws, 'laboneq_acquire');
  setField(blocks.acquire, 'SIGNAL', 'q0_acquire');
  setField(blocks.acquire, 'HANDLE', 'qubit_state');
  blocks.acqKernel = newBlock(ws, 'laboneq_pulse_const');
  setField(blocks.acqKernel, 'LENGTH', '1e-6');
  setField(blocks.acqKernel, 'AMP', '1.0');
  connectValue(blocks.acquire, 'KERNEL', blocks.acqKernel);
  chainNext(blocks.playMeas, blocks.acquire);

  // reset section — active-reset feedback via match/case
  blocks.secReset = newBlock(ws, 'laboneq_section');
  bindVar(ws, blocks.secReset, 'NAME', 'reset');
  bindVar(ws, blocks.secReset, 'AFTER', 'measure');
  chainNext(blocks.secMeas, blocks.secReset);

  blocks.reserveDrive = newBlock(ws, 'laboneq_reserve');
  setField(blocks.reserveDrive, 'SIGNAL', 'q0_measure');
  connectStatement(blocks.secReset, 'BODY', blocks.reserveDrive);

  blocks.match = newBlock(ws, 'laboneq_match');
  setField(blocks.match, 'HANDLE', 'qubit_state');
  chainNext(blocks.reserveDrive, blocks.match);

  // case 0: already |0>, reset oscillator phase only
  blocks.case0 = newBlock(ws, 'laboneq_case');
  setField(blocks.case0, 'STATE', 0);
  blocks.resetPhase = newBlock(ws, 'laboneq_reset_oscillator_phase');
  setField(blocks.resetPhase, 'SIGNAL', 'q0_drive');
  connectStatement(blocks.case0, 'BODY', blocks.resetPhase);
  connectStatement(blocks.match, 'CASES', blocks.case0);

  // case 1: excited, play an inverse DRAG pulse to flip back
  blocks.case1 = newBlock(ws, 'laboneq_case');
  setField(blocks.case1, 'STATE', 1);
  blocks.flip = newBlock(ws, 'laboneq_play');
  setField(blocks.flip, 'SIGNAL', 'q0_drive');
  blocks.flipDrag = newBlock(ws, 'laboneq_pulse_drag');
  setField(blocks.flipDrag, 'LENGTH', '32e-9');
  setField(blocks.flipDrag, 'AMP', '1.0');
  setField(blocks.flipDrag, 'SIGMA', '0.33');
  setField(blocks.flipDrag, 'BETA', '0.2');
  connectValue(blocks.flip, 'PULSE', blocks.flipDrag);
  connectStatement(blocks.case1, 'BODY', blocks.flip);
  chainNext(blocks.case0, blocks.case1);

  // Collapse anything big to keep the demo readable on small screens.
  for (const b of Object.values(blocks)) {
    if ((b as Blockly.BlockSvg).isCollapsed?.()) continue;
  }
}
