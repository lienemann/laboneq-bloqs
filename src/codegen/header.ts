export const PYTHON_HEADER =
  'from laboneq.simple import *\n' +
  'import numpy as np\n\n';

// Symbols we emit unconditionally or expose in the global scope. Any
// user-authored variable matching these names will be auto-renamed by
// Blockly's Python generator.
export const RESERVED = [
  'exp',
  'calib',
  'session',
  'Experiment',
  'Session',
  'pulse_library',
  'Calibration',
  'SignalCalibration',
  'Oscillator',
  'SweepParameter',
  'LinearSweepParameter',
  'AveragingMode',
  'AcquisitionType',
  'SectionAlignment',
  'ExecutionType',
  'RepetitionMode',
  'ModulationType',
  'np',
].join(',');
