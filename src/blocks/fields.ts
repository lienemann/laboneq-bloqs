import * as Blockly from 'blockly/core';

// Validator for scientific-notation numeric strings (used by time/length/amp fields).
const SCI_REGEX = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
function sciValidator(v: string): string | null {
  return SCI_REGEX.test(v.trim()) ? v.trim() : null;
}

export class FieldScientific extends Blockly.FieldTextInput {
  constructor(value?: string) {
    super(value ?? '0');
    this.setValidator(sciValidator);
  }
  static override fromJson(options: any): FieldScientific {
    return new FieldScientific(options?.text ?? '0');
  }
}

// Dynamic dropdown populated from all signals declared on any
// `laboneq_experiment` block currently in the workspace. Options are
// re-computed every time the dropdown is opened, so adding a signal to the
// Experiment block's CSV field immediately makes it available in every
// signal picker on every operation block.
export class FieldSignal extends Blockly.FieldDropdown {
  constructor(value?: string) {
    super(FieldSignal.generateOptions);
    if (value) this.setValue(value);
  }

  static generateOptions(): Blockly.MenuOption[] {
    const workspace = Blockly.getMainWorkspace();
    const signals = new Set<string>();
    if (workspace) {
      for (const block of workspace.getAllBlocks(false)) {
        if (block.type === 'laboneq_experiment') {
          const csv = (block.getFieldValue('SIGNALS') as string | null) ?? '';
          for (const s of csv.split(',').map((x) => x.trim()).filter(Boolean)) {
            signals.add(s);
          }
        }
      }
    }
    if (signals.size === 0) {
      return [['(define signals in Experiment block)', '']];
    }
    return [...signals].sort().map((s) => [s, s] as [string, string]);
  }

  // FieldDropdown rejects values not in the current options list. We relax
  // that so a signal that was once valid but has since been removed from the
  // Experiment's CSV still round-trips through save/load without being
  // silently reset to the first available option.
  protected override doClassValidation_(newValue?: unknown): string | null {
    if (typeof newValue === 'string') return newValue;
    return null;
  }

  // When rendering a value that's not in the current option list, fall back
  // to showing the raw value instead of an empty label.
  override getText(): string {
    const selected = (this as any).selectedOption;
    if (selected && selected[0]) return String(selected[0]);
    const v = this.getValue();
    return v ? String(v) : '(signal)';
  }

  static override fromJson(options: any): FieldSignal {
    return new FieldSignal(options?.value ?? '');
  }
}

let registered = false;
export function registerFields(): void {
  if (registered) return;
  registered = true;
  Blockly.fieldRegistry.register('field_scientific', FieldScientific as any);
  Blockly.fieldRegistry.register('field_signal', FieldSignal as any);
}
