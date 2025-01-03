export class DataManager {
    #storageKey = 'wageData';

    constructor() { }

    saveData(data) {
        localStorage.setItem(this.#storageKey, JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem(this.#storageKey);
        return data ? JSON.parse(data) : null;
    }

    clearData() {
        localStorage.removeItem(this.#storageKey);
    }
}
