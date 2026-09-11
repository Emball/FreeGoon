getSetting('spankbang_enabled', true, enabled => {
    if (!enabled) return;

    // spoof av cookie
    document.cookie = 'av=simple:False:False; expires=Fri, 31 Dec 2049 00:00:00 GMT; path=/; domain=.spankbang.com';

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('#av-wrapper, #advanced-av, #register-age-verification, #av-verification')
            .forEach(el => el.style.setProperty('display', 'none', 'important'));

        getSetting('spankbang_hover_previews', true, previewsEnabled => {
            if (!previewsEnabled) return;

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
    });

    let observer, isPending = false;
    const OBS_CONFIG = {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['class', 'style', 'id'],
    };

    function doClean() {
        isPending = false;
        if (!observer || !document.body) return;
        observer.disconnect();
        try {
            genericClean();
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
        } finally {
            observer.observe(document.body, OBS_CONFIG);
        }
    }

    function scheduleClean() {
        if (isPending) return;
        isPending = true;
        requestAnimationFrame(doClean);
    }

    document.addEventListener('DOMContentLoaded', () => {
        observer = new MutationObserver(scheduleClean);
        observer.observe(document.body, OBS_CONFIG);
        doClean();
    });

    window.addEventListener('pageshow', e => { if (e.persisted) doClean(); });
});
