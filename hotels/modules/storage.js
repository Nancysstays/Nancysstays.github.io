// Local Storage
export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Cache (Example - In-memory caching)
const cache = {};
export function getFromCache(key) {
    return cache[key];
}

export function saveToCache(key, data) {
    cache[key] = data;
}

// IndexedDB (More complex - Implement as needed)
// ... (Functions for IndexedDB interactions)
