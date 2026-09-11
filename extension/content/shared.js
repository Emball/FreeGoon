// shared helpers available to all site content scripts

function unlockScroll(el) {
    if (!el) return;
    el.classList.remove('overflow-hidden', 'no-scroll', 'noscroll');
    if (el.style.overflow === 'hidden') el.style.overflow = '';
}

function genericClean() {
    unlockScroll(document.documentElement);
    unlockScroll(document.body);
}

// Read a single storage key, returning a default if unset
function getSetting(key, defaultValue, cb) {
    chrome.storage.sync.get({ [key]: defaultValue }, result => cb(result[key]));
}
