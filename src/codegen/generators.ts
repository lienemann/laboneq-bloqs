import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

type Block = Blockly.Block;

const gen: any = pythonGenerator;

// Helper: python string literal. Minimal: assumes no embedded quotes; escapes
// backslashes and double quotes to be safe.
function pystr(s: string): string {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// Helper: join kwargs, dropping any that are empty/undefined.
function joinKwargs(parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(', ');
}

// Helper: read a field as raw string (whitespace trimmed).
function field(block: Block, name: string): string {
  const v = block.getFieldValue(name);
  return v == null ? '' : String(v).trim();
}

// Helper: resolve a Blockly variable-id field to its Python name.
function varName(block: Block, name: string): string {
  const id = block.getFieldValue(name);
  if (!id) return '';
  return gen.getVariableName(id);
}

// Helper: emit statement body; replaces Blockly's empty-body default (none)
// with an explicit `pass` so the Python is parseable.
function bodyOrPass(block: Block, input: string): string {
  const b = gen.statementToCode(block, input);
  return b && b.trim().length > 0 ? b : '    pass\n';
}

// Helper: de-indent (strip one level of 4 spaces) — used for the Experiment
// root's body, which runs at module scope rather than inside a `with`.
function dedent(code: string): string {
  return code.replace(/^ {4}/gm, '');
}

// ------------------------------------------------------------------
// Structure
// ------------------------------------------------------------------

gen.forBlock['laboneq_experiment'] = (block: Block) => {
  const uid = field(block, 'UID') || 'exp';
  const sigs = field(block, 'SIGNALS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(pystr)
    .join(', ');
  const body = gen.statementToCode(block, 'BODY') || '';
  const signalsArg = sigs ? `signals=[${sigs}]` : '';
  const kwargs = joinKwargs([`uid=${pystr(uid)}`, signalsArg]);
  let out = `exp = Experiment(${kwargs})\n`;
  if (body.trim().length > 0) out += dedent(body);
  return out;
};

gen.forBlock['laboneq_acquire_loop_rt'] = (block: Block) => {
  const count = field(block, 'COUNT') || '1';
  const avg = field(block, 'AVERAGING');
  const acq = field(block, 'ACQUISITION');
  const rep = field(block, 'REPETITION');
  const repTime = field(block, 'REP_TIME');
  const kwargs = joinKwargs([
    `count=${count}`,
    `averaging_mode=AveragingMode.${avg}`,
    `acquisition_type=AcquisitionType.${acq}`,
    rep && rep !== 'FASTEST' ? `repetition_mode=RepetitionMode.${rep}` : '',
    rep === 'CONSTANT' && repTime ? `repetition_time=${repTime}` : '',
  ]);
  const body = bodyOrPass(block, 'BODY');
  return `with exp.acquire_loop_rt(${kwargs}):\n${body}`;
};

gen.forBlock['laboneq_sweep'] = (block: Block) => {
  const name = varName(block, 'VAR');
  const param =
    gen.valueToCode(block, 'PARAM', Order.ATOMIC) || 'None';
  const exec = field(block, 'EXECUTION');
  const kwargs = joinKwargs([
    `parameter=${param}`,
    exec && exec !== 'REAL_TIME'
      ? `execution_type=ExecutionType.${exec}`
      : '',
  ]);
  const body = bodyOrPass(block, 'BODY');
  // The sweep binds the parameter to a name; but in LabOneQ the sweep
  // parameter reference is the same Parameter object we pass in — the
  // "as name" here is a convenience so the user can refer to it by the
  // Blockly variable name inside the body.
  return `with exp.sweep(${kwargs}) as ${name}:\n${body}`;
};

gen.forBlock['laboneq_section'] = (block: Block) => {
  const name = varName(block, 'NAME');
  const align = field(block, 'ALIGN');
  const after = varName(block, 'AFTER');
  const length = field(block, 'LENGTH');
  const kwargs = joinKwargs([
    align && align !== 'LEFT' ? `alignment=SectionAlignment.${align}` : '',
    after ? `play_after=${after}` : '',
    length ? `length=${length}` : '',
  ]);
  const body = bodyOrPass(block, 'BODY');
  return `with exp.section(${kwargs}) as ${name}:\n${body}`;
};

// ------------------------------------------------------------------
// Feedback
// ------------------------------------------------------------------

gen.forBlock['laboneq_match'] = (block: Block) => {
  const handle = field(block, 'HANDLE');
  const after = varName(block, 'AFTER');
  const kwargs = joinKwargs([
    handle ? `handle=${pystr(handle)}` : '',
    after ? `play_after=${after}` : '',
  ]);
  const body = bodyOrPass(block, 'CASES');
  return `with exp.match(${kwargs}):\n${body}`;
};

gen.forBlock['laboneq_case'] = (block: Block) => {
  const state = field(block, 'STATE') || '0';
  const body = bodyOrPass(block, 'BODY');
  return `with exp.case(state=${state}):\n${body}`;
};

// ------------------------------------------------------------------
// Pulses (value blocks, return [expr, ORDER_ATOMIC])
// ------------------------------------------------------------------

function pulseExpr(name: string, kwargs: string): [string, Order] {
  return [`pulse_library.${name}(${kwargs})`, Order.ATOMIC];
}

gen.forBlock['laboneq_pulse_gaussian'] = (block: Block) =>
  pulseExpr(
    'gaussian',
    joinKwargs([
      `length=${field(block, 'LENGTH')}`,
      `amplitude=${field(block, 'AMP')}`,
      `sigma=${field(block, 'SIGMA')}`,
    ]),
  );

gen.forBlock['laboneq_pulse_drag'] = (block: Block) =>
  pulseExpr(
    'drag',
    joinKwargs([
      `length=${field(block, 'LENGTH')}`,
      `amplitude=${field(block, 'AMP')}`,
      `sigma=${field(block, 'SIGMA')}`,
      `beta=${field(block, 'BETA')}`,
    ]),
  );

gen.forBlock['laboneq_pulse_const'] = (block: Block) =>
  pulseExpr(
    'const',
    joinKwargs([
      `length=${field(block, 'LENGTH')}`,
      `amplitude=${field(block, 'AMP')}`,
    ]),
  );

gen.forBlock['laboneq_pulse_gaussian_square'] = (block: Block) =>
  pulseExpr(
    'gaussian_square',
    joinKwargs([
      `length=${field(block, 'LENGTH')}`,
      `amplitude=${field(block, 'AMP')}`,
      `width=${field(block, 'WIDTH')}`,
      `sigma=${field(block, 'SIGMA')}`,
    ]),
  );

gen.forBlock['laboneq_pulse_sampled'] = (block: Block) => {
  const samples = field(block, 'SAMPLES') || 'np.zeros(1)';
  const uid = field(block, 'UID');
  return pulseExpr(
    'sampled_pulse_real',
    joinKwargs([
      `samples=${samples}`,
      uid ? `uid=${pystr(uid)}` : '',
    ]),
  );
};

// ------------------------------------------------------------------
// Operations (statement blocks)
// ------------------------------------------------------------------

gen.forBlock['laboneq_play'] = (block: Block) => {
  const signal = field(block, 'SIGNAL');
  const pulse = gen.valueToCode(block, 'PULSE', Order.ATOMIC) || 'None';
  const amp = gen.valueToCode(block, 'AMP', Order.ATOMIC);
  const phase = gen.valueToCode(block, 'PHASE', Order.ATOMIC);
  const kwargs = joinKwargs([
    `signal=${pystr(signal)}`,
    `pulse=${pulse}`,
    amp && `amplitude=${amp}`,
    phase && `phase=${phase}`,
  ]);
  return `exp.play(${kwargs})\n`;
};

gen.forBlock['laboneq_acquire'] = (block: Block) => {
  const signal = field(block, 'SIGNAL');
  const handle = field(block, 'HANDLE');
  const kernel = gen.valueToCode(block, 'KERNEL', Order.ATOMIC);
  const length = field(block, 'LENGTH');
  const kwargs = joinKwargs([
    `signal=${pystr(signal)}`,
    `handle=${pystr(handle)}`,
    kernel && `kernel=${kernel}`,
    length && `length=${length}`,
  ]);
  return `exp.acquire(${kwargs})\n`;
};

gen.forBlock['laboneq_measure'] = (block: Block) => {
  const acq = field(block, 'ACQ');
  const meas = field(block, 'MEAS');
  const handle = field(block, 'HANDLE');
  const measPulse =
    gen.valueToCode(block, 'MEAS_PULSE', Order.ATOMIC) || '';
  const kernel = gen.valueToCode(block, 'KERNEL', Order.ATOMIC) || '';
  const kwargs = joinKwargs([
    `acquire_signal=${pystr(acq)}`,
    `measure_signal=${pystr(meas)}`,
    `handle=${pystr(handle)}`,
    measPulse && `measure_pulse=${measPulse}`,
    kernel && `integration_kernel=${kernel}`,
  ]);
  return `exp.measure(${kwargs})\n`;
};

gen.forBlock['laboneq_delay'] = (block: Block) => {
  const signal = field(block, 'SIGNAL');
  const t = field(block, 'TIME');
  const paramT = gen.valueToCode(block, 'TIME_PARAM', Order.ATOMIC);
  const timeExpr = paramT || t || '0';
  return `exp.delay(signal=${pystr(signal)}, time=${timeExpr})\n`;
};

gen.forBlock['laboneq_reserve'] = (block: Block) => {
  const signal = field(block, 'SIGNAL');
  return `exp.reserve(signal=${pystr(signal)})\n`;
};

gen.forBlock['laboneq_set_node'] = (block: Block) => {
  const path = field(block, 'PATH');
  const value = field(block, 'VALUE') || '0';
  return `exp.set_node(path=${pystr(path)}, value=${value})\n`;
};

gen.forBlock['laboneq_reset_oscillator_phase'] = (block: Block) => {
  const signal = field(block, 'SIGNAL');
  if (!signal) return 'exp.reset_oscillator_phase()\n';
  return `exp.reset_oscillator_phase(signal=${pystr(signal)})\n`;
};

// ------------------------------------------------------------------
// Parameters (value blocks with hoisted declarations)
// ------------------------------------------------------------------

function hoistParam(name: string, rhs: string): void {
  // Use a stable key so repeated calls from the same block don't duplicate.
  gen.definitions_['param_' + name] = `${name} = ${rhs}`;
}

gen.forBlock['laboneq_sweep_parameter'] = (block: Block) => {
  const name = varName(block, 'VAR') || 'sp';
  const values = field(block, 'VALUES') || '[]';
  hoistParam(name, `SweepParameter(values=${values})`);
  return [name, Order.ATOMIC];
};

gen.forBlock['laboneq_linear_sweep_parameter'] = (block: Block) => {
  const name = varName(block, 'VAR') || 'lp';
  const start = field(block, 'START') || '0';
  const stop = field(block, 'STOP') || '1';
  const count = field(block, 'COUNT') || '2';
  hoistParam(
    name,
    `LinearSweepParameter(start=${start}, stop=${stop}, count=${count})`,
  );
  return [name, Order.ATOMIC];
};

gen.forBlock['laboneq_param_arith'] = (block: Block) => {
  const name = varName(block, 'VAR') || 'dp';
  const op = field(block, 'OP');
  const a = gen.valueToCode(block, 'A', Order.ATOMIC) || '0';
  const b = gen.valueToCode(block, 'B', Order.ATOMIC) || '0';
  let rhs: string;
  if (op.startsWith('np.')) {
    rhs = `${op}(${a})`;
  } else {
    rhs = `(${a}) ${op} (${b})`;
  }
  hoistParam(name, rhs);
  return [name, Order.ATOMIC];
};

// ------------------------------------------------------------------
// Calibration
// ------------------------------------------------------------------

gen.forBlock['laboneq_calibration'] = (block: Block) => {
  const entries = gen.statementToCode(block, 'ENTRIES');
  if (!entries || !entries.trim()) return '';
  // Entries are emitted as calib[sig] = SignalCalibration(...) lines at the
  // inner indent (4 spaces). Dedent them so they run at module scope with
  // the experiment body.
  const dedented = dedent(entries);
  return 'calib = Calibration()\n' + dedented + 'exp.set_calibration(calib)\n';
};

gen.forBlock['laboneq_signal_calibration'] = (block: Block) => {
  const signal = field(block, 'SIGNAL');
  const osc = gen.valueToCode(block, 'OSC', Order.ATOMIC);
  const loFreq = field(block, 'LO_FREQ');
  const amp = field(block, 'AMP');
  const kwargs = joinKwargs([
    osc && `oscillator=${osc}`,
    loFreq && `local_oscillator=Oscillator(frequency=${loFreq})`,
    amp && `amplitude=${amp}`,
  ]);
  return `calib[${pystr(signal)}] = SignalCalibration(${kwargs})\n`;
};

gen.forBlock['laboneq_oscillator'] = (block: Block) => {
  const freq = field(block, 'FREQ') || '0';
  const mod = field(block, 'MOD');
  const kwargs = joinKwargs([
    `frequency=${freq}`,
    mod && mod !== 'AUTO' ? `modulation_type=ModulationType.${mod}` : '',
  ]);
  return [`Oscillator(${kwargs})`, Order.ATOMIC];
};
