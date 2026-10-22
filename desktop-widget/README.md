# Bloom Studio desktop widget

One-click installer that shows a gifted bouquet as a transparent, frameless, always-on-top window.
Recipients never touch Node or a terminal — they download one installer and double-click it.

## Publishing installers (done once by the owner)
1. Connect the project to GitHub.
2. On GitHub: Actions → "Build Bloom Studio desktop widget" → Run workflow (or push a tag `widget-v1.0.0`).
3. Installers appear on the repo's Releases page.
4. Update `window.BLOOM_DOWNLOADS` in `public/bloom.html` with your GitHub name/repo.

## How a gift reaches the widget
The gift page's "Open my bouquet in the widget" button opens `bloomstudio://open#widget=<bouquet>`.
The installed app registers that link type, saves the bouquet, and shows it. It starts with the computer.

## Signing
Unsigned builds show a Windows SmartScreen / macOS Gatekeeper warning. Add code-signing certificates
(electron-builder `CSC_LINK`/`CSC_KEY_PASSWORD`, Apple notarization) to remove it.
