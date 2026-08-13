const hasWindow = typeof window !== 'undefined';

function getStorage(kind) {
    if (!hasWindow) {
        return null;
    }

    try {
        return kind === 'session' ? window.sessionStorage : window.localStorage;
    } catch (_) {
        return null;
    }
}

export function safeGetItem(key) {
    const storage = getStorage('local');
    if (!storage) {
        return null;
    }

    try {
        return storage.getItem(key);
    } catch (_) {
        return null;
    }
}

export function safeSetItem(key, value) {
    const storage = getStorage('local');
    if (!storage) {
        return false;
    }

    try {
        storage.setItem(key, value);
        return true;
    } catch (_) {
        return false;
    }
}

export function safeRemoveItem(key) {
    const storage = getStorage('local');
    if (!storage) {
        return false;
    }

    try {
        storage.removeItem(key);
        return true;
    } catch (_) {
        return false;
    }
}

// sessionStorage variants — per-tab, cleared when the tab closes. Used for
// state that should survive a refresh (quiz autosave) but has no business
// outliving the tab the way localStorage's session/user do.
export function safeGetSessionItem(key) {
    const storage = getStorage('session');
    if (!storage) {
        return null;
    }

    try {
        return storage.getItem(key);
    } catch (_) {
        return null;
    }
}

export function safeSetSessionItem(key, value) {
    const storage = getStorage('session');
    if (!storage) {
        return false;
    }

    try {
        storage.setItem(key, value);
        return true;
    } catch (_) {
        return false;
    }
}

export function safeRemoveSessionItem(key) {
    const storage = getStorage('session');
    if (!storage) {
        return false;
    }

    try {
        storage.removeItem(key);
        return true;
    } catch (_) {
        return false;
    }
}
