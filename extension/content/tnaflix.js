getSetting('tnaflix_enabled', true, enabled => {
    if (!enabled) return;

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

        ['agego-blur-style', 'agego-blur-stylev2'].forEach(id =>
            document.getElementById(id)?.remove()
        );
        document.querySelectorAll('[id^="agego-"]').forEach(el => el.remove());

        genericClean();
    });

    window.addEventListener('pageshow', e => { if (e.persisted) genericClean(); });
});
