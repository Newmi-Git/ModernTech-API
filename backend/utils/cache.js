const store = new Map();

const getCached = (key) => {
    const entry = store.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
        return null;
    }

    return entry.data;
};

const setCached = (key, data, ttlMs) => {
    store.set(key, {
        data,
        expiresAt: Date.now() + ttlMs
    });
};

const clearCached = (key) => {
    store.delete(key);
};

export { getCached, setCached, clearCached };