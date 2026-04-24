// Prism is imported from the npm 'prismjs' package and bundled by Vite.
// We import the core then the Python language component as a side-effect.
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

export function highlightInto(codeEl: HTMLElement, source: string): void {
  codeEl.textContent = source;
  // className must be language-python for Prism to target it.
  codeEl.className = 'language-python';
  Prism.highlightElement(codeEl);
}
