const DEFAULTS = {
    spankbang_enabled: true,
    spankbang_hover_previews: true,
    tnaflix_enabled: true,
};

const ids = Object.keys(DEFAULTS);

chrome.storage.sync.get(DEFAULTS, settings => {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.checked = settings[id];
        el.addEventListener('change', () => {
            chrome.storage.sync.set({ [id]: el.checked });
            refresh(settings);
        });
    });
    refresh(settings);
});

function refresh(settings) {
    chrome.storage.sync.get(DEFAULTS, s => {
        setDot('dot-spankbang', s.spankbang_enabled);
        setDot('dot-tnaflix', s.tnaflix_enabled);

        const sub = document.getElementById('sub-spankbang');
        sub.classList.toggle('hidden', !s.spankbang_enabled);
    });
}

function setDot(id, active) {
    document.getElementById(id)?.classList.toggle('active', active);
}
