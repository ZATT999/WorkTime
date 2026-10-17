# WorkTime

Temporizador de concentración minimalista para el escritorio. Define horas y minutos, pulsa **Start** y recibe un timbre suave junto con una notificación del sistema cuando termina la sesión. Construido con Tauri 2, React 19, Vite y Tailwind CSS 4.

## Descargas

Descarga el instalador para tu sistema desde la [última versión](https://github.com/ZATT999/WorkTime/releases/latest).

| Sistema | Archivo |
|---------|---------|
| Windows 10/11 (x64) | `WorkTime-0.1.0-windows-x64-setup.exe` |
| Linux (cualquier distribución) | `WorkTime-0.1.0-linux-x86_64.AppImage` |
| Debian / Ubuntu | `WorkTime-0.1.0-linux-amd64.deb` |
| Fedora / openSUSE | `WorkTime-0.1.0-linux-x86_64.rpm` |

> **Nota:** los instaladores no están firmados digitalmente.
> - **Windows:** si SmartScreen bloquea el instalador, pulsa **Más información → Ejecutar de todas formas**.
> - **Linux (AppImage):** dale permiso de ejecución antes de abrirlo: `chmod +x WorkTime-0.1.0-linux-x86_64.AppImage`.
>
> macOS no está disponible por ahora.

## Inicio rápido

```bash
pnpm install
pnpm tauri dev   # desktop app
pnpm dev         # browser only (Vite dev server on http://localhost:1420)
```

## Funcionalidades

- Cuenta regresiva de horas y minutos con dígitos tabulares y dos puntos que "respiran" mientras corre.
- Barra de progreso muy fina que se vacía a medida que pasa el tiempo.
- Timbre al final de la sesión (Web Audio, quinta justa C5 + G5, sin archivos de audio).
- Notificación del sistema al terminar: plugin de notificaciones de Tauri en el escritorio y Web Notifications API en el navegador.
- Respeta `prefers-reduced-motion`; las notificaciones y el audio se degradan sin errores cuando no están disponibles.

## Scripts

| Script | Qué hace |
|--------|----------|
| `pnpm dev` | Servidor de desarrollo de Vite (solo web) |
| `pnpm tauri dev` | Aplicación de escritorio con recarga en caliente |
| `pnpm build` | Verifica tipos y compila el frontend en `dist/` |
| `pnpm bundle` | Genera los paquetes de escritorio (`NO_STRIP=true tauri build`) |

## Compilación para publicación

```bash
pnpm bundle
```

Los artefactos se generan en `src-tauri/target/release/bundle/` (AppImage, deb y rpm en Linux).

> **Nota (Linux):** `bundle` define `NO_STRIP=true` porque el `strip` integrado de linuxdeploy falla en algunos sistemas (por ejemplo, distribuciones recientes basadas en Arch). Usa `pnpm bundle` en lugar de llamar directamente a `tauri build`.

## Estructura del proyecto

```
src/            React frontend (App.tsx holds the whole timer)
src-tauri/      Tauri shell: config, icons, Rust entrypoint
```

## Requisitos

- Node.js + pnpm
- Toolchain de Rust (para la compilación de escritorio con Tauri)
- Linux: dependencias del sistema de Tauri 2 (webkit2gtk 4.1, etc.); consulta los [requisitos previos de Tauri](https://tauri.app/start/prerequisites/)
