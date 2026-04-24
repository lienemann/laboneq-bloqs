import * as Blockly from 'blockly/core';
// Import default blocks (Math, Variables, etc.) and register the English
// locale so built-in message keys (e.g. MATH_ADDITION_SYMBOL, the context
// menu labels, the variable prompt) resolve to real strings instead of
// raw `BKY_...` placeholders.
import 'blockly/blocks';
import * as En from 'blockly/msg/en';
Blockly.setLocale(En as unknown as { [key: string]: string });

import { registerBlocks, toolbox } from './blocks';
import { generate } from './codegen/python';
import { highlightInto } from './ui/highlight';
import { loadFromLocal, saveToLocal } from './ui/persistence';
import { wireSplitter, wireToolbar } from './ui/layout';
import './styles/app.css';

registerBlocks();

// Tweaked Classic theme for a darker, higher-contrast look over our palette.
const darkTheme = Blockly.Theme.defineTheme('bloqs-dark', {
  name: 'bloqs-dark',
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#0f172a',
    toolboxBackgroundColour: '#111827',
    toolboxForegroundColour: '#e5e7eb',
    flyoutBackgroundColour: '#1f2937',
    flyoutForegroundColour: '#e5e7eb',
    flyoutOpacity: 0.95,
    scrollbarColour: '#374151',
    insertionMarkerColour: '#22c55e',
    insertionMarkerOpacity: 0.7,
    markerColour: '#60a5fa',
    cursorColour: '#60a5fa',
  },
  fontStyle: {
    family: 'var(--font-sans), sans-serif',
    weight: 'normal',
    size: 12,
  },
});

const blocklyDiv = document.getElementById('blockly-panel') as HTMLDivElement;
const codeEl = document.getElementById('code-output') as HTMLElement;
const statusEl = document.getElementById('code-status') as HTMLSpanElement;
const swStatusEl = document.getElementById('sw-status') as HTMLSpanElement;

// Self-host Blockly's media assets (icons, cursors, sounds) so there's no
// runtime network call to blockly-demo.appspot.com. Files live under
// public/blockly-media/ and are served at /laboneq-bloqs/blockly-media/.
// `sounds: false` additionally disables the click/delete audio — we don't need it.
const workspace = Blockly.inject(blocklyDiv, {
  toolbox: toolbox as any,
  theme: darkTheme,
  media: import.meta.env.BASE_URL + 'blockly-media/',
  sounds: false,
  grid: { spacing: 20, length: 3, colour: '#1f2937', snap: true },
  zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 2, minScale: 0.3 },
  trashcan: true,
  move: { scrollbars: true, drag: true, wheel: false },
  renderer: 'geras',
});

// Restore any prior session. If none, seed with a minimal Experiment block
// so the user has something to interact with immediately.
if (!loadFromLocal(workspace)) {
  const b = workspace.newBlock('laboneq_experiment');
  b.initSvg();
  b.render();
  b.moveBy(40, 40);
}

let lastCode = '';
const setStatus = (msg: string, kind: '' | 'ok' | 'err' = '') => {
  statusEl.textContent = msg;
  statusEl.className = 'code-status' + (kind ? ' ' + kind : '');
  if (kind === 'ok') {
    setTimeout(() => {
      if (statusEl.textContent === msg) {
        statusEl.textContent = '';
        statusEl.className = 'code-status';
      }
    }, 2000);
  }
};

function regenerate(): void {
  try {
    const code = generate(workspace);
    lastCode = code;
    highlightInto(codeEl, code);
  } catch (err) {
    console.error('[bloqs] codegen error:', err);
    const msg =
      '# Error generating code — check block configuration\n# ' +
      (err instanceof Error ? err.message : String(err));
    lastCode = msg;
    highlightInto(codeEl, msg);
  }
}

// Debounce workspace changes.
let timer: number | undefined;
workspace.addChangeListener((evt) => {
  if ((evt as Blockly.Events.Abstract).isUiEvent) return;
  if (timer !== undefined) clearTimeout(timer);
  timer = window.setTimeout(() => {
    regenerate();
    saveToLocal(workspace);
  }, 150);
});

wireToolbar({
  workspace,
  getCode: () => lastCode,
  setStatus,
});

// Wire up the draggable splitter between the block panel and the code panel.
// Every time it resizes, re-lay out Blockly so the workspace fills the new
// width/height.
wireSplitter(() => Blockly.svgResize(workspace));

// We rely on Blockly's built-in feedback for drop validity:
//   - Valid target connections are highlighted green (see CSS styling of
//     `.blocklyHighlightedConnectionPath`).
//   - An invalid drop causes the block to snap back to its origin, which is
//     obvious on its own.
// (Earlier versions added a pointermove + BLOCK_DRAG listener to tint the
// dragged block red on invalid hover, but that interfered with Blockly's
// gesture dispatch on dropdown fields and caused blocks to stick to the
// mouse when a dropdown was clicked.)

// Resize Blockly on window resize.
window.addEventListener('resize', () => Blockly.svgResize(workspace));
// First render after layout settles.
requestAnimationFrame(() => {
  Blockly.svgResize(workspace);
  regenerate();
});

// Register the service worker produced by vite-plugin-pwa so the app is
// installable and works offline. Module is virtual (generated at build).
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      const updateSW = registerSW({
        immediate: true,
        onOfflineReady() {
          swStatusEl.textContent = 'offline-ready';
        },
        onNeedRefresh() {
          swStatusEl.textContent = 'update available — click to refresh';
          swStatusEl.style.cursor = 'pointer';
          swStatusEl.addEventListener(
            'click',
            () => {
              void updateSW(true);
            },
            { once: true },
          );
        },
      });
    })
    .catch(() => {
      // Dev mode: virtual module may not be registered. Silent.
    });
}
