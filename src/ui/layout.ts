import * as Blockly from 'blockly/core';
import { exportJson, importJson } from './persistence';

function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

export interface ToolbarDeps {
  getCode: () => string;
  workspace: Blockly.Workspace;
  setStatus: (msg: string, kind?: 'ok' | 'err' | '') => void;
}

export function wireToolbar({ getCode, workspace, setStatus }: ToolbarDeps): void {
  getEl<HTMLButtonElement>('btn-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      setStatus('copied', 'ok');
    } catch {
      setStatus('copy failed', 'err');
    }
  });

  getEl<HTMLButtonElement>('btn-download').addEventListener('click', () => {
    const blob = new Blob([getCode()], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiment.py';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('downloaded experiment.py', 'ok');
  });

  getEl<HTMLButtonElement>('btn-export').addEventListener('click', () => {
    const blob = new Blob([exportJson(workspace)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workspace.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('exported workspace.json', 'ok');
  });

  const fileInput = getEl<HTMLInputElement>('file-import');
  getEl<HTMLButtonElement>('btn-import').addEventListener('click', () => {
    fileInput.click();
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      importJson(workspace, text);
      setStatus('imported ' + file.name, 'ok');
    } catch (err) {
      console.error(err);
      setStatus('import failed', 'err');
    } finally {
      fileInput.value = '';
    }
  });

  getEl<HTMLButtonElement>('btn-clear').addEventListener('click', () => {
    if (confirm('Clear the workspace? This cannot be undone.')) {
      workspace.clear();
      setStatus('workspace cleared', 'ok');
    }
  });
}
