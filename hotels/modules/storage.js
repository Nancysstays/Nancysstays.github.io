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

// modules/storage.js

// ... (previous code for localStorage and cache)

// IndexedDB implementation for bookings
const DB_NAME = 'hotelBookingsDB';
const DB_VERSION = 1;
const BOOKINGS_STORE = 'bookings';

let db;

// Function to open/create the IndexedDB database
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Error opening database:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(BOOKINGS_STORE)) {
                db.createObjectStore(BOOKINGS_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Function to add a booking to IndexedDB
export function addBooking(booking) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKINGS_STORE], 'readwrite');
        const store = transaction.objectStore(BOOKINGS_STORE);
        const request = store.add(booking);

        request.onerror = (event) => {
            console.error('Error adding booking:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log('Booking added:', event.target.result);
            resolve(event.target.result); // Resolve with the booking ID
        };
    });
}

// Function to get all bookings from IndexedDB
export function getAllBookings() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKINGS_STORE], 'readonly');
        const store = transaction.objectStore(BOOKINGS_STORE);
        const request = store.getAll();

        request.onerror = (event) => {
            console.error('Error getting bookings:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

// ... (Add more functions for deleting, updating bookings as needed)
// modules/storage.js

// ... (previous code)

// Function to delete a booking from IndexedDB
export function deleteBooking(bookingId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKINGS_STORE], 'readwrite');
        const store = transaction.objectStore(BOOKINGS_STORE);
        const request = store.delete(parseInt(bookingId, 10)); 

        request.onerror = (event) => {
            console.error('Error deleting booking:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log('Booking deleted successfully.');
            resolve();
        };
    });
}

// ... (rest of the storage.js code)
