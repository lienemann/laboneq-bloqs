import * as Blockly from 'blockly/core';

const STORAGE_KEY = 'laboneq-bloqs:workspace:v1';

export function saveToLocal(workspace: Blockly.Workspace): void {
  try {
    const state = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[bloqs] Failed to persist workspace:', err);
  }
}

export function loadFromLocal(workspace: Blockly.Workspace): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    Blockly.serialization.workspaces.load(state, workspace);
    return true;
  } catch (err) {
    console.warn('[bloqs] Failed to restore workspace:', err);
    return false;
  }
}

export function exportJson(workspace: Blockly.Workspace): string {
  const state = Blockly.serialization.workspaces.save(workspace);
  return JSON.stringify(state, null, 2);
}

export function importJson(workspace: Blockly.Workspace, json: string): void {
  const state = JSON.parse(json);
  workspace.clear();
  Blockly.serialization.workspaces.load(state, workspace);
}
