# WorkTime

A minimalist focus timer for the desktop. Set hours and minutes, press Start, and get a calm chime plus a system notification when the session ends. Built with Tauri 2, React 19, Vite, and Tailwind CSS 4.

## Quick start

```bash
pnpm install
pnpm tauri dev   # desktop app
pnpm dev         # browser only (Vite dev server on http://localhost:1420)
```

## Features

- Hours/minutes countdown with tabular digits and breathing colons while running.
- Hairline progress track that drains as time passes.
- End-of-session chime (Web Audio, C5 + G5 perfect fifth — no audio assets).
- System notification on completion: Tauri notification plugin on desktop, Web Notifications API in the browser.
- Respects `prefers-reduced-motion`; notifications and audio degrade gracefully when unavailable.

## Scripts

| Script | What it does |
|--------|--------------|
| `pnpm dev` | Vite dev server (web only) |
| `pnpm tauri dev` | Desktop app with hot reload |
| `pnpm build` | Type-check and build the frontend to `dist/` |
| `pnpm bundle` | Build desktop bundles (`NO_STRIP=true tauri build`) |

## Building for release

```bash
pnpm bundle
```

Artifacts land in `src-tauri/target/release/bundle/` (AppImage, deb, rpm on Linux).

> **Note (Linux):** `bundle` sets `NO_STRIP=true` because linuxdeploy's embedded `strip` fails on some systems (e.g. recent Arch-based distros). Use `pnpm bundle` instead of calling `tauri build` directly.

## Project structure

```
src/            React frontend (App.tsx holds the whole timer)
src-tauri/      Tauri shell: config, icons, Rust entrypoint
```

## Requirements

- Node.js + pnpm
- Rust toolchain (for the Tauri desktop build)
- Linux: Tauri 2 system dependencies (webkit2gtk 4.1, etc.) — see the [Tauri prerequisites](https://tauri.app/start/prerequisites/)
