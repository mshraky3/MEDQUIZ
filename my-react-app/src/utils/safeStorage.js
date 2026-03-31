const hasWindow = typeof window !== 'undefined';

function getStorage() {
    if (!hasWindow) {
        return null;
    }

    try {
        return window.localStorage;
    } catch (_) {
        return null;
    }
}

export function safeGetItem(key) {
    const storage = getStorage();
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
    const storage = getStorage();
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
    const storage = getStorage();
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