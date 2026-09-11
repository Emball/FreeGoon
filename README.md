# FreeGoon

Comprehensive age gate remover for SpankBang and TNAFlix.

Available as a Tampermonkey userscript and a Chrome extension (sideloaded, no store required).

---

## Tampermonkey

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Open `tampermonkey/FreeGoon.user.js` and click **Raw**
3. Tampermonkey will prompt you to install it

---

## Chrome Extension

1. Download or clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the `extension/` folder

The extension popup lets you toggle each site and the SpankBang hover previews on/off.

---

## What it does

| Site | What's removed |
|---|---|
| SpankBang | Age verification modal, signup gate, thumbnail overlays, scroll lock |
| SpankBang | Hover previews restored (animated thumbnails on cursor hover) |
| TNAFlix | AgeGO verification overlay and blur |

---

## Sites

- Client-side age gates only. Server-side verification (e.g. Eporner) cannot be bypassed.
- See the [Full Length Tube Sites list](#) for a curated directory of sites and their verification status.
