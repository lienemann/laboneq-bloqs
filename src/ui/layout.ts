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
  onResize?: () => void;
}

const SPLIT_KEY = 'laboneq-bloqs:split:v1';

// Wire up a draggable splitter between the block editor and the code panel.
// Horizontal on wide screens (col-resize), vertical on narrow (row-resize).
// The chosen fraction is persisted to localStorage so it survives reloads.
export function wireSplitter(onResize?: () => void): void {
  const splitter = getEl<HTMLDivElement>('splitter');
  const panels = getEl<HTMLDivElement>('panels');

  const isHorizontal = () => window.matchMedia('(min-width: 821px)').matches;

  const applyFraction = (frac: number) => {
    const clamped = Math.max(0.15, Math.min(0.85, frac));
    if (isHorizontal()) {
      panels.style.setProperty('--split-left', `${clamped}fr`);
      panels.style.setProperty('--split-right', `${1 - clamped}fr`);
    } else {
      panels.style.setProperty('--split-top', `${clamped}fr`);
      panels.style.setProperty('--split-bottom', `${1 - clamped}fr`);
    }
  };

  // Restore saved fraction.
  const saved = parseFloat(localStorage.getItem(SPLIT_KEY) ?? '');
  applyFraction(Number.isFinite(saved) && saved > 0 ? saved : 0.5);

  let dragging = false;

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const rect = panels.getBoundingClientRect();
    const frac = isHorizontal()
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
    applyFraction(frac);
    onResize?.();
    e.preventDefault();
  };

  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    splitter.classList.remove('dragging');
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    // Persist current fraction.
    const current = isHorizontal()
      ? panels.style.getPropertyValue('--split-left')
      : panels.style.getPropertyValue('--split-top');
    const m = /^([\d.]+)fr$/.exec(current.trim());
    if (m) localStorage.setItem(SPLIT_KEY, m[1]);
    onResize?.();
  };

  splitter.addEventListener('pointerdown', (e) => {
    dragging = true;
    splitter.classList.add('dragging');
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    e.preventDefault();
  });

  splitter.addEventListener('keydown', (e) => {
    const step = 0.02;
    const current = parseFloat(
      (isHorizontal()
        ? panels.style.getPropertyValue('--split-left')
        : panels.style.getPropertyValue('--split-top')
      ).replace('fr', '') || '1',
    );
    const total =
      current +
      parseFloat(
        (isHorizontal()
          ? panels.style.getPropertyValue('--split-right')
          : panels.style.getPropertyValue('--split-bottom')
        ).replace('fr', '') || '1',
      );
    const frac = current / total;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      applyFraction(frac - step);
      onResize?.();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      applyFraction(frac + step);
      onResize?.();
      e.preventDefault();
    }
  });

  // Re-resize Blockly when the window crosses the responsive breakpoint.
  window.addEventListener('resize', () => onResize?.());
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
