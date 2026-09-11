# AGENTS.md

## Purpose
Browser age gate remover for adult tube sites. Two delivery formats maintained in parallel: a Tampermonkey userscript and a Chrome extension (sideloaded via developer mode).

## Repo Structure
```
tampermonkey/
  FreeGoon.user.js        — single-file userscript, self-contained
extension/
  manifest.json           — MV3, no store distribution
  content/
    shared.js             — unlockScroll(), genericClean(), getSetting()
    spankbang.js          — SpankBang logic (reads storage for enabled/hover toggles)
    spankbang.css         — SpankBang CSS injected at document_start
    tnaflix.js            — TNAFlix logic
    tnaflix.css           — TNAFlix CSS
  rules/
    block.json            — declarativeNetRequest: blocks agego.com network requests
  popup/
    popup.html/css/js     — settings UI, writes to chrome.storage.sync
```

## Architecture

### Tampermonkey
Single IIFE. SITES object keyed by base domain. Each entry has `css`, `early()`, `clean()`. Generic MutationObserver + debounce runs `genericClean()` and `site.clean()` on DOM changes. Host matched via `SITES[HOST] || SITES[HOST.split('.').slice(-2).join('.')]` to handle subdomains.

### Extension
CSS injected via manifest `content_scripts`. JS split per site. `shared.js` loaded first on all sites. Settings read from `chrome.storage.sync` via `getSetting()` before any logic runs. agego.com blocked at network level via `declarativeNetRequest` (stronger than the userscript's MutationObserver script removal).

## Adding a New Site

### Tampermonkey
1. Add `@match` lines to the header
2. Add an entry to SITES with `css`, `early()`, `clean()`

### Extension
1. Add `@match` entries to `host_permissions` and a new `content_scripts` block in `manifest.json`
2. Create `content/sitename.js` and `content/sitename.css`
3. Add a toggle to `popup/popup.html`, `popup/popup.js` DEFAULTS, and `shared.js` getSetting key
4. Add any network block rules to `rules/block.json`

## Versioning
Tampermonkey: semver in `@version` header. Extension: `version` field in `manifest.json`. Bump both on any functional change. Commit message: version numbers only.

## Known Constraints
- SpankBang serves `<video>` elements only to verified sessions. Hover previews are reconstructed client-side by reading `data-src` from `<source>` elements and playing CDN assets directly.
- SpankBang age gate uses a client-side `av` cookie check. Cookie is spoofed at document-start.
- TNAFlix uses AgeGO third-party widget. Blocked at network level in extension; MutationObserver script removal in userscript.
- Eporner uses server-side verification — not bypassable, not supported.
