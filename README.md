# LabOneQ Bloqs

A privacy-preserving, installable **Progressive Web App** that lets you compose
[LabOneQ](https://github.com/zhinst/laboneq) (Zurich Instruments) quantum
experiments visually, Scratch-style, while seeing the equivalent Python code
update live in a second panel.

- **Block editor** powered by [Blockly 11](https://developers.google.com/blockly).
- **Python output** syntax-highlighted with a locally bundled copy of Prism.js,
  with copy-to-clipboard and `experiment.py` download.
- **Installable PWA**: add to home screen / desktop, works **offline** after the
  first load.
- **Zero backend, zero telemetry, zero CDN imports**: everything is served
  same-origin from GitHub Pages. Your workspace stays in your browser's
  `localStorage`.

## Quick start

```bash
npm install
npm run icons     # regenerate PWA icon PNGs (one-off)
npm run dev       # http://localhost:5173/laboneq-bloqs/
npm run build     # static output in dist/
npm run preview   # serve the production build locally
```

## Block library

| Category     | Blocks                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Structure    | `Experiment`, `acquire_loop_rt`, `sweep`, `section`                                                                 |
| Feedback     | `match`, `case`                                                                                                     |
| Operations   | `play`, `acquire`, `measure`, `delay`, `reserve`, `set_node`, `reset_oscillator_phase`                              |
| Pulses       | `gaussian`, `drag`, `const`, `gaussian_square`, `sampled_pulse_real`                                                |
| Parameters   | `SweepParameter`, `LinearSweepParameter`, arithmetic derivation (`+ - * /`, `np.sin/cos/sqrt/exp`)                  |
| Calibration  | `Calibration`, `SignalCalibration`, `Oscillator`                                                                    |

Enums (`AcquisitionType`, `AveragingMode`, `SectionAlignment`,
`ExecutionType`, `RepetitionMode`, `ModulationType`) surface as dropdowns on
the host blocks.

## Minimal example: Rabi amplitude sweep

Drag an **Experiment** block, nest an **acquire_loop_rt** (count 100, CYCLIC,
INTEGRATION), nest a **sweep** wired to a **LinearSweepParameter**
(0 → 1, 21 points), then two **section**s — one plays a gaussian drive pulse at
the swept amplitude, the second (with `play_after` set to the drive section)
plays a const measurement pulse and acquires. The generated Python looks like:

```python
from laboneq.simple import *
import numpy as np

amp = LinearSweepParameter(start=0.0, stop=1.0, count=21)
exp = Experiment(uid="rabi", signals=["q0_drive", "q0_measure", "q0_acquire"])
with exp.acquire_loop_rt(count=100,
                         averaging_mode=AveragingMode.CYCLIC,
                         acquisition_type=AcquisitionType.INTEGRATION):
    with exp.sweep(parameter=amp) as amp:
        with exp.section(alignment=SectionAlignment.RIGHT) as drive:
            exp.play(signal="q0_drive",
                     pulse=pulse_library.gaussian(length=32e-9,
                                                  amplitude=1.0, sigma=0.33),
                     amplitude=amp)
        with exp.section(play_after=drive) as measure:
            exp.play(signal="q0_measure",
                     pulse=pulse_library.const(length=1e-6, amplitude=1.0))
            exp.acquire(signal="q0_acquire", handle="rabi",
                        kernel=pulse_library.const(length=1e-6, amplitude=1.0))
```

## Privacy

The app is fully client-side: there is no backend, no analytics, no tracking.
Your workspace is persisted only to `localStorage` on your device; use
**Export** to save it to a file you control.

Core assets (Blockly, Prism, icons) are bundled at build time and served
same-origin so the app works offline after the first load. External
documentation links (e.g. Blockly's built-in block help URLs) still point to
their original targets and are only followed if you click "Help" in a block's
context menu.

## Deployment

Deployed automatically to GitHub Pages via `.github/workflows/deploy.yml` on
every push to `main`. The base path is `/laboneq-bloqs/`; update `vite.config.ts`
and `deploy.yml` if you fork it to a differently-named repo.

## Caveats

- Generated Python is **valid syntax** but may still fail LabOneQ's own
  validation (e.g. signals you didn't declare on the Experiment, missing
  `pulse_library` kwargs for a pulse with unusual shape). Use this tool for
  rapid scaffolding — the real compile happens in your Python environment.
- The `play_after` picker currently uses any Blockly variable in scope rather
  than filtering to named sections only. Pick carefully.

## License

Apache-2.0. See [LICENSE](./LICENSE).
