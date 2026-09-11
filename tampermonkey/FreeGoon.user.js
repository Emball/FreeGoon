// ==UserScript==
// @name         FreeGoon
// @namespace    https://github.com/freegoon
// @version      3.14
// @description  Comprehensive age gate remover for SpankBang and TNAFlix
// @author       you
// @match        *://spankbang.com/*
// @match        *://*.spankbang.com/*
// @match        *://www.tnaflix.com/*
// @match        *://tnaflix.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const HOST = location.hostname.replace(/^www\./, '');

    const SITES = {

        // ── SpankBang ────────────────────────────────────────────────────────
        'spankbang.com': {
            css: `
                .safety-blur, [class*="safety-blur"],
                .js-modal-overlay,
                .responsive-page.fixed,
                [data-testid="cookie-consent-banner"],
                body > div[class*="fixed"][class*="inset-0"],
                body > div[class*="fixed"][class*="backdrop-blur"],
                body > template + div[class*="fixed"] {
                    display: none !important;
                    pointer-events: none !important;
                }
                html.overflow-hidden, body.overflow-hidden,
                html[class*="no-scroll"], body[class*="no-scroll"] {
                    overflow: auto !important;
                }
                .blurred, .blur-content, .content-blur, .main-blur,
                .strong-blur {
                    filter: none !important;
                    backdrop-filter: none !important;
                }
                [class*="bg-neutral-900\/40"],
                [aria-label="Explicit content locked"],
                div.absolute.inset-0.z-10.flex.items-center.justify-center {
                    display: none !important;
                }
                #av-wrapper,
                #advanced-av,
                #av-verification,
                [data-testid="av-advanced-required-modal"],
                [data-testid="av-registration-modal"],
                [data-testid="registration-success-start-av-modal"] {
                    display: none !important;
                }
            `,

            early() {
                // spoof av cookie
                document.cookie = 'av=simple:False:False; expires=Fri, 31 Dec 2049 00:00:00 GMT; path=/; domain=.spankbang.com';

                document.addEventListener('DOMContentLoaded', () => {
                    document.querySelectorAll('#av-wrapper, #advanced-av, #register-age-verification, #av-verification')
                        .forEach(el => el.style.setProperty('display', 'none', 'important'));

                    function wireHoverPreviews(root) {
                        root.querySelectorAll('[data-testid="video-item"] a[class*="overflow-hidden"]').forEach(link => {
                            const videoEl = link.querySelector('video');
                            const sourceEl = link.querySelector('source[data-src]');
                            if (!videoEl || !sourceEl || link._fgHooked) return;
                            link._fgHooked = true;

                            videoEl.removeAttribute('x-cloak');
                            videoEl.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;display:none;';

                            link.addEventListener('mouseenter', () => {
                                if (!sourceEl.src) {
                                    sourceEl.src = sourceEl.dataset.src;
                                    videoEl.load();
                                }
                                videoEl.style.display = 'block';
                                videoEl.play().catch(() => {});
                            });

                            link.addEventListener('mouseleave', () => {
                                videoEl.pause();
                                videoEl.style.display = 'none';
                            });
                        });
                    }

                    wireHoverPreviews(document);

                    const feed = document.querySelector('[data-testid="video-list"], .video-list, main');
                    if (feed) new MutationObserver(mutations => {
                        for (const m of mutations)
                            for (const node of m.addedNodes)
                                if (node.nodeType === Node.ELEMENT_NODE) wireHoverPreviews(node);
                    }).observe(feed, { childList: true, subtree: true });
                });
            },

            clean() {
                document.querySelectorAll('div.fixed').forEach(el => {
                    const c = el.className;
                    if (
                        (c.includes('inset-0') || (c.includes('top-0') && c.includes('left-0'))) &&
                        (c.includes('backdrop-blur') || c.includes('z-[12') || c.includes('z-[20'))
                    ) {
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('pointer-events', 'none', 'important');
                    }
                });
            },
        },

        // ── TNAFlix ──────────────────────────────────────────────────────────
        'tnaflix.com': {
            css: `
                [id^="agego-"] {
                    display: none !important;
                }
                #video-player-container, #preroll-container,
                .trailer-player, .lb-image,
                .plyr__video-wrapper video, #video-player-placeholder,
                #video-player-container video, #preroll-container video,
                .plyr__video-wrapper, .plyr__poster, .img-gal {
                    filter: none !important;
                    -webkit-filter: none !important;
                }
                html.overflow-hidden, body.overflow-hidden,
                body.noscroll, html.noscroll {
                    overflow: auto !important;
                }
            `,

            early() {
                const scriptObserver = new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.tagName === 'SCRIPT' && node.src?.includes('agego.com'))
                                node.remove();
                            if (node.tagName === 'STYLE' &&
                                (node.id === 'agego-blur-style' || node.id === 'agego-blur-stylev2'))
                                node.remove();
                        }
                    }
                });
                scriptObserver.observe(document.documentElement, { childList: true, subtree: true });

                window.AGEGO = function () {};
                window.AGEGO.e = [];

                let _Flix;
                Object.defineProperty(window, 'Flix', {
                    get() { return _Flix; },
                    set(val) {
                        _Flix = val;
                        if (val) try { val.ageVerified = true; } catch {}
                    },
                    configurable: true,
                });

                document.addEventListener('DOMContentLoaded', () => {
                    scriptObserver.disconnect();
                    if (window.Flix) try { window.Flix.ageVerified = true; } catch {}
                });
            },

            clean() {
                ['agego-blur-style', 'agego-blur-stylev2'].forEach(id =>
                    document.getElementById(id)?.remove()
                );
                document.querySelectorAll('[id^="agego-"]').forEach(el => el.remove());
                if (window.Flix) try { window.Flix.ageVerified = true; } catch {}
            },
        },

    };

    const site = SITES[HOST] || SITES[HOST.split('.').slice(-2).join('.')];

    const GENERIC_CSS = `
        [style*="filter: blur"], [style*="filter:blur"] {
            filter: none !important;
            -webkit-filter: none !important;
        }
    `;

    function unlockScroll(el) {
        if (!el) return;
        el.classList.remove('overflow-hidden', 'no-scroll', 'noscroll');
        if (el.style.overflow === 'hidden') el.style.overflow = '';
    }

    function genericClean() {
        unlockScroll(document.documentElement);
        unlockScroll(document.body);
    }

    const styleEl = document.createElement('style');
    styleEl.textContent = GENERIC_CSS + (site?.css ?? '');
    (document.head || document.documentElement).appendChild(styleEl);

    site?.early?.();

    let observer, isPending = false;

    function doClean() {
        isPending = false;
        if (!observer || !document.body) return;
        observer.disconnect();
        try {
            genericClean();
            site?.clean?.();
        } finally {
            observer.observe(document.body, OBS_CONFIG);
        }
    }

    function scheduleClean() {
        if (isPending) return;
        isPending = true;
        requestAnimationFrame(doClean);
    }

    const OBS_CONFIG = {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['class', 'style', 'id'],
    };

    document.addEventListener('DOMContentLoaded', () => {
        observer = new MutationObserver(scheduleClean);
        observer.observe(document.body, OBS_CONFIG);
        doClean();
    });

    window.addEventListener('pageshow', e => { if (e.persisted) doClean(); });

})();
