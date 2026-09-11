# FreeGoon

Browser assistant for adult tube sites. Age gate removal, UX improvements, and a built-in curated directory of full-length tube sites — with cross-site search on the roadmap.

Available as a Tampermonkey userscript and a Chrome extension (sideloaded, no store required).

---

## Install

### Tampermonkey

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Open `tampermonkey/FreeGoon.user.js` and click **Raw**
3. Tampermonkey will prompt you to install it

### Chrome Extension

1. Download or clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the `extension/` folder

The extension popup has site toggles at the top and a scrollable directory of 23 curated full-length tube sites below.

---

## What it does

| Site | Features |
|---|---|
| SpankBang | Age gate removed (cookie spoof), signup/overlay removal, hover previews restored, search fixed |
| TNAFlix | AgeGO verification overlay and blur removed |

**Client-side age gates only.** Server-side verification (e.g. Eporner) cannot be bypassed.

---

## Directory

The extension popup includes a built-in directory of 23 full-length tube sites ranked by: short clip pollution → catalog size → stream speed → quality ceiling → ads → downloadability. Includes notes on age verification type, adblocker requirements, and known quirks per site.

---

## Roadmap

- **Cross-site search** — type a performer or scene query in the popup, get aggregated results from multiple sites in one view
- More site coverage (age gate removal + UX fixes)
- Scene bookmarking across sites
