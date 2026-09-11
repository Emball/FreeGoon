# AGENTS.md

## Purpose
Browser assistant for adult tube sites ("goon assistant"). Handles age gate removal, UX improvements, and long-term goal of cross-site unified search. Two delivery formats maintained in parallel: a Tampermonkey userscript and a Chrome extension (sideloaded via developer mode).

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
    popup.html/css/js     — settings UI + scrollable site directory
```

## Architecture

### Tampermonkey
Single IIFE. SITES object keyed by base domain. Each entry has `css`, `early()`, `clean()`. Generic MutationObserver + debounce runs `genericClean()` and `site.clean()` on DOM changes. Host matched via `SITES[HOST] || SITES[HOST.split('.').slice(-2).join('.')]` to handle subdomains.

### Extension
CSS injected via manifest `content_scripts`. JS split per site. `shared.js` loaded first on all sites. Settings read from `chrome.storage.sync` via `getSetting()` before any logic runs. agego.com blocked at network level via `declarativeNetRequest` (stronger than the userscript's MutationObserver script removal).

### Popup
Two sections: site toggles at top, scrollable directory table below. Directory is rendered from a JS data array in popup.js — update that array when the tube-sites list changes. Popup width: 480px, max-height: 600px with scroll.

## Roadmap

### Cross-Site Search (priority next feature)
Goal: user types a performer/scene query in the popup, results aggregated from multiple sites into a unified view.

Planned approach:
- Search input in popup triggers background script
- Background opens tabs (or uses `fetch` where CORS allows) to each site's search URL
- Per-site content script reads results off the DOM, normalizes to a common schema: `{ title, url, thumb, duration, site, quality }`
- Results message back to popup for display
- Each SITES entry in the extension gets an optional `search` config: `{ url: q => '...', results: '.selector' }` or a full scraper function

Prior attempt was a Python scraper — abandoned because bot detection and CORS made it unworkable outside the browser. Browser context solves both problems: extension is already trusted, no CORS issues on injected scripts, no bot fingerprinting.

### Other Planned Features
- Per-site UX improvements as they come up (same pattern as SpankBang hover previews)
- Expand age gate support to more sites
- Possibly: scene bookmarking / save list across sites

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
- SpankBang serves `<video>` elements only to verified sessions. Hover previews reconstructed client-side from `data-src` on `<source>` elements — CDN assets are public, no auth required.
- SpankBang age gate: client-side `av` cookie check. Spoofed at document-start.
- TNAFlix uses AgeGO third-party widget. Blocked at network level in extension; MutationObserver script removal in userscript.
- Eporner: server-side verification, not bypassable, not supported.
