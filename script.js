// This is the main JavaScript file.

// --- IndexedDB Cache Parameters ---
const DB_NAME = 'apiCacheDB';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'apiResponses';
const CACHE_EXPIRATION_MINUTES_YAHOO = 60; 
const CACHE_EXPIRATION_MINUTES_GENAI = 180;

let dbInstance = null;

// --- SQL.js Cache Parameters ---
let sqlDB = null;
let sqlJsDBInitPromise = null;

// --- Yahoo Finance API Constants ---
const BASE_YAHOO_API_URL = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/';
const yahooApiOptions = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '324aa0762emsh819e95a929bb601p12c02cjsn53c4a93bd374',  // Restored Key
        'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
    }
};

// --- GenAI API Constants ---
const ACTUAL_GEMINI_API_KEY = 'USER_SHOULD_REPLACE_THIS_WITH_THEIR_GEMINI_API_KEY';
const FINAL_GENAI_MODEL_ID = 'gemini-2.5-flash-preview-05-20';
const FINAL_GENERATE_CONTENT_API = 'streamGenerateContent';
const FINAL_GENAI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${FINAL_GENAI_MODEL_ID}:${FINAL_GENERATE_CONTENT_API}?key=${ACTUAL_GEMINI_API_KEY}`;

// --- UI Element References ---
let apiSelector, inputFieldsContainer, fetchDataButton, dataHeadingEl, 
    yahooDataEl, yahooErrorEl, genaiDataEl, genaiErrorEl;


// ===================================================================================
// DATABASE INITIALIZATION AND UTILITIES (IndexedDB & SQL.js)
// ===================================================================================
async function getDB() {
    if (!dbInstance || !dbInstance.name) { 
        dbInstance = await initDB();
    }
    return dbInstance;
}

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = (event) => {
            console.log("IndexedDB initialized successfully.");
            const db = event.target.result;
            db.onversionchange = () => {
                db.close();
                console.warn("IndexedDB version change detected, closing connection. Please refresh.");
                dbInstance = null; 
            };
            resolve(db);
        };
        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.errorCode);
            reject("Error opening IndexedDB: " + event.target.errorCode);
        };
    });
}

async function initSqlJsDB() {
    if (sqlDB) return sqlDB; 
    if (sqlJsDBInitPromise && !sqlDB) { 
        return await sqlJsDBInitPromise; 
    }
    sqlJsDBInitPromise = (async () => {
        try {
            console.log("Initializing SQL.js database...");
            const SQL = await initSqlJs({ 
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}` 
            });
            sqlDB = new SQL.Database();
            sqlDB.run("CREATE TABLE IF NOT EXISTS api_cache (id TEXT PRIMARY KEY, response_text TEXT, expiry_timestamp INTEGER);");
            console.log("SQL.js database initialized and table created.");
            return sqlDB;
        } catch (error) {
            console.error("Failed to initialize SQL.js database:", error);
            sqlDB = null; 
            sqlJsDBInitPromise = null; 
            throw error; 
        }
    })();
    return sqlJsDBInitPromise;
}

function saveToDB(db, id, data, expirationMinutes) { // For IndexedDB
    return new Promise((resolve, reject) => {
        if (!db || !db.name) { 
            console.error("IndexedDB not available for saving.");
            return reject("IndexedDB not available");
        }
        try {
            const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(OBJECT_STORE_NAME);
            const expiryTimestamp = Date.now() + expirationMinutes * 60 * 1000;
            const item = { id: id, response: data, timestamp: Date.now(), expiryTimestamp: expiryTimestamp };
            const request = store.put(item);
            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error("Error saving to IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Error initiating saveToDB (IndexedDB) transaction:", error);
            reject(error);
        }
    });
}

function loadFromDB(db, id) { // For IndexedDB
    return new Promise((resolve, reject) => {
        if (!db || !db.name) {
            console.error("IndexedDB not available for loading.");
            return reject("IndexedDB not available");
        }
        try {
            const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
            const store = transaction.objectStore(OBJECT_STORE_NAME);
            const request = store.get(id);
            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result && Date.now() < result.expiryTimestamp) {
                    console.log(`Data loaded from IndexedDB for id: ${id}`);
                    resolve(result);
                } else {
                    if (result) console.log(`IndexedDB cached data expired for id: ${id}. Deleting.`);
                    const deleteTransaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
                    deleteTransaction.objectStore(OBJECT_STORE_NAME).delete(id);
                    resolve(null);
                }
            };
            request.onerror = (event) => {
                console.error("Error loading from IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Error initiating loadFromDB (IndexedDB) transaction:", error);
            reject(error);
        }
    });
}

async function saveToSqlJs(id, data, expirationMinutes) {
    try {
        await initSqlJsDB(); 
        if (!sqlDB) {
            console.error("SQL.js DB not initialized, cannot save.");
            return;
        }
        const expiryTimestamp = Date.now() + expirationMinutes * 60 * 1000;
        sqlDB.run("INSERT OR REPLACE INTO api_cache (id, response_text, expiry_timestamp) VALUES (?, ?, ?)", [id, data, expiryTimestamp]);
        console.log(`Data saved to SQL.js for id: ${id}`);
    } catch (error) {
        console.error("Error saving to SQL.js:", error);
    }
}

async function loadFromSqlJs(id) {
    try {
        await initSqlJsDB(); 
        if (!sqlDB) {
            console.error("SQL.js DB not initialized, cannot load.");
            return null;
        }
        const results = sqlDB.exec("SELECT response_text, expiry_timestamp FROM api_cache WHERE id = ?", [id]);
        if (results.length > 0 && results[0].values.length > 0) {
            const row = results[0].values[0];
            const responseText = row[0];
            const expiryTimestamp = row[1];
            if (Date.now() < expiryTimestamp) {
                console.log(`Data loaded from SQL.js for id: ${id}`);
                return { response: responseText };
            } else {
                console.log(`SQL.js cached data expired for id: ${id}. Deleting.`);
                sqlDB.run("DELETE FROM api_cache WHERE id = ?", [id]);
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error("Error loading from SQL.js:", error);
        return null;
    }
}

// ===================================================================================
// DYNAMIC INPUT FIELD MANAGEMENT
// ===================================================================================
function updateInputFields() {
    if (!inputFieldsContainer || !apiSelector) return;
    inputFieldsContainer.innerHTML = ''; // Clear previous inputs

    const selectedApi = apiSelector.value;
    let html = '';

    switch (selectedApi) {
        case 'ipoCalendar':
            html = `
                <label for="ipoDate">Date (YYYY-MM):</label>
                <input type="text" id="ipoDate" placeholder="e.g., 2023-11">
            `;
            break;
        case 'stockHistory':
            html = `
                <label for="stockSymbol">Symbol:</label>
                <input type="text" id="stockSymbol" placeholder="e.g., AAPL">
                <label for="stockInterval">Interval:</label>
                <input type="text" id="stockInterval" placeholder="e.g., 5m, 1h, 1d">
            `;
            break;
        case 'marketQuote':
            html = `
                <label for="quoteTicker">Ticker(s):</label>
                <input type="text" id="quoteTicker" placeholder="e.g., AAPL,MSFT">
                <label for="quoteType">Type:</label>
                <input type="text" id="quoteType" placeholder="e.g., STOCKS,CURRENCY">
            `;
            break;
        case 'mostActiveOptions':
            html = `
                <label for="mostActiveType">Type:</label>
                <input type="text" id="mostActiveType" placeholder="e.g., STOCKS,ETF">
            `;
            break;
        // Cases with no inputs: optionsStraddle, marketScreenerDayGainers, insiderTrades
        default:
            break; 
    }
    inputFieldsContainer.innerHTML = html;
}

// ===================================================================================
// GENERIC YAHOO FINANCE DATA FETCHER
// ===================================================================================
async function fetchAndDisplayYahooData(apiUrl, cacheKey, dataTitle) {
    if (!yahooDataEl || !yahooErrorEl || !dataHeadingEl) {
        console.error("One or more display elements are missing.");
        return null;
    }
    yahooDataEl.textContent = 'Loading data...';
    yahooErrorEl.textContent = '';
    genaiDataEl.textContent = ''; // Clear GenAI on new fetch
    genaiErrorEl.textContent = '';
    dataHeadingEl.textContent = dataTitle || 'Data Display'; 

    let actualYahooData = null;
    let db;

    try {
        db = await getDB();
        const cachedData = await loadFromDB(db, cacheKey);
        if (cachedData) {
            actualYahooData = cachedData.response;
            console.log(`${dataTitle} data loaded from IndexedDB cache.`);
        }
    } catch (error) {
        console.warn(`Error loading ${dataTitle} data from IndexedDB, trying SQL.js or network:`, error);
    }

    if (!actualYahooData) {
        try {
            const sqlCached = await loadFromSqlJs(cacheKey);
            if (sqlCached) {
                actualYahooData = sqlCached.response;
                console.log(`${dataTitle} data loaded from SQL.js cache.`);
                if (db && actualYahooData) {
                    try {
                        await saveToDB(db, cacheKey, actualYahooData, CACHE_EXPIRATION_MINUTES_YAHOO);
                    } catch (idbSaveError) {
                        console.warn(`Failed to save SQL.js cached ${dataTitle} data to IndexedDB:`, idbSaveError);
                    }
                }
            }
        } catch (error) {
            console.warn(`Error loading ${dataTitle} data from SQL.js cache, fetching from network:`, error);
        }
    }

    if (!actualYahooData) {
        console.log(`Fetching ${dataTitle} data from network...`);
        try {
            const response = await fetch(apiUrl, yahooApiOptions);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. Body: ${errorText}`);
            }
            actualYahooData = await response.text();

            if (db && actualYahooData) {
                try {
                    await saveToDB(db, cacheKey, actualYahooData, CACHE_EXPIRATION_MINUTES_YAHOO);
                } catch (idbSaveError) {
                    console.warn(`Failed to save ${dataTitle} data to IndexedDB:`, idbSaveError);
                }
            }
            if (actualYahooData) {
                try {
                    await saveToSqlJs(cacheKey, actualYahooData, CACHE_EXPIRATION_MINUTES_YAHOO);
                } catch (sqlSaveError) {
                    console.warn(`Failed to save ${dataTitle} data to SQL.js:`, sqlSaveError);
                }
            }
        } catch (error) {
            yahooErrorEl.textContent = `Error fetching ${dataTitle} data: ${error.message}`;
            console.error(`${dataTitle} Fetch error:`, error);
            yahooDataEl.textContent = ''; // Clear loading message
            actualYahooData = null; // Ensure it's null on error
        }
    }

    if (actualYahooData) {
        yahooDataEl.textContent = actualYahooData;
        
        const analysisTypeInput = document.getElementById('genaiAnalysisType');
        const analysisType = analysisTypeInput ? analysisTypeInput.value : 'simpleExplanation';
        const currentDataHeading = dataHeadingEl.textContent || 'the current data';
        const dataSnippet = actualYahooData.substring(0, 1500); // Use a snippet
        let promptForGenAI = "";

        switch (analysisType) {
            case 'potentialStrategies':
                promptForGenAI = `Based on the following financial data titled '${currentDataHeading}': "${dataSnippet}", identify 2-3 potential investment strategies a retail investor could consider. Briefly explain the rationale and any key assumptions for each strategy.`;
                break;
            case 'risksOpportunities':
                promptForGenAI = `Analyze the following financial data titled '${currentDataHeading}': "${dataSnippet}". Identify the key potential risks and opportunities highlighted by this data. Be concise.`;
                break;
            case 'bullishBearishCase':
                promptForGenAI = `For the financial data titled '${currentDataHeading}': "${dataSnippet}", outline a brief bullish case and a brief bearish case. Highlight key factors for each.`;
                break;
            case 'simpleExplanation':
            default:
                promptForGenAI = `The following is financial data related to ${currentDataHeading}. Briefly explain what this data represents in simple terms and mention any obvious patterns or points of interest: \n\n"${dataSnippet}"`;
                break;
        }
        
        await fetchGenAIData(promptForGenAI);
    } else {
        yahooDataEl.textContent = ''; // Ensure data area is clear if no data
        genaiDataEl.textContent = '';
        genaiErrorEl.textContent = 'GenAI analysis skipped as main data could not be fetched.';
        console.log(`${dataTitle} data not available, GenAI call skipped.`);
    }
    return actualYahooData;
}


// ===================================================================================
// SPECIFIC YAHOO FINANCE API FETCH FUNCTIONS
// ===================================================================================
async function fetchOptionsStraddleData() {
    const apiUrl = BASE_YAHOO_API_URL + 'options?expiration=1731628800&ticker=AAPL&display=straddle';
    const cacheKey = 'optionsStraddle-AAPL-1731628800';
    await fetchAndDisplayYahooData(apiUrl, cacheKey, 'Options Straddle (AAPL)');
}

async function fetchIPOCalendarData() {
    const dateInput = document.getElementById('ipoDate');
    if (!dateInput || !dateInput.value) {
        yahooErrorEl.textContent = 'Error: Date is required for IPO Calendar.';
        return;
    }
    const date = dateInput.value;
    const apiUrl = BASE_YAHOO_API_URL + `calendar/ipo?date=${date}`;
    const cacheKey = `ipoCalendar-${date}`;
    await fetchAndDisplayYahooData(apiUrl, cacheKey, `IPO Calendar for ${date}`);
}

async function fetchStockHistoryData() {
    const symbolInput = document.getElementById('stockSymbol');
    const intervalInput = document.getElementById('stockInterval');
    if (!symbolInput || !symbolInput.value || !intervalInput || !intervalInput.value) {
        yahooErrorEl.textContent = 'Error: Stock Symbol and Interval are required.';
        return;
    }
    const symbol = symbolInput.value.toUpperCase();
    const interval = intervalInput.value;
    const apiUrl = BASE_YAHOO_API_URL + `stock/history?symbol=${symbol}&interval=${interval}&diffandsplits=false`;
    const cacheKey = `stockHistory-${symbol}-${interval}`;
    await fetchAndDisplayYahooData(apiUrl, cacheKey, `Stock History for ${symbol} (${interval})`);
}

async function fetchMarketQuoteData() {
    const tickerInput = document.getElementById('quoteTicker');
    const typeInput = document.getElementById('quoteType');
     if (!tickerInput || !tickerInput.value || !typeInput || !typeInput.value) {
        yahooErrorEl.textContent = 'Error: Ticker and Type are required for Market Quote.';
        return;
    }
    const ticker = tickerInput.value.toUpperCase();
    const type = typeInput.value.toUpperCase();
    const apiUrl = BASE_YAHOO_API_URL + `quote?ticker=${ticker}&type=${type}`;
    const cacheKey = `marketQuote-${ticker}-${type}`;
    await fetchAndDisplayYahooData(apiUrl, cacheKey, `Market Quote for ${ticker} (${type})`);
}

async function fetchMarketScreenerDayGainersData() {
    const apiUrl = BASE_YAHOO_API_URL + 'screener?list=day_gainers';
    const cacheKey = 'marketScreener-day_gainers';
    await fetchAndDisplayYahooData(apiUrl, cacheKey, 'Market Screener (Day Gainers)');
}

async function fetchInsiderTradesData() {
    const apiUrl = BASE_YAHOO_API_URL + 'insider-trades';
    const cacheKey = 'insiderTrades';
    await fetchAndDisplayYahooData(apiUrl, cacheKey, 'Insider Trades');
}

async function fetchMostActiveOptionsData() {
    const typeInput = document.getElementById('mostActiveType');
    if (!typeInput || !typeInput.value) {
        yahooErrorEl.textContent = 'Error: Type is required for Most Active Options.';
        return;
    }
    const type = typeInput.value.toUpperCase();
    const apiUrl = BASE_YAHOO_API_URL + `options/most-active?type=${type}`;
    const cacheKey = `mostActiveOptions-${type}`;
    await fetchAndDisplayYahooData(apiUrl, cacheKey, `Most Active Options (${type})`);
}

// ===================================================================================
// GenAI DATA FETCHER (Existing, slightly adapted for clarity)
// ===================================================================================
async function fetchGenAIData(inputText) { // inputText is the combined prompt + data
    if (!genaiDataEl || !genaiErrorEl) {
        console.error("GenAI display elements are missing.");
        return;
    }
    const cacheId = `genai-${inputText.substring(0,100)}`; 

    genaiDataEl.textContent = 'Loading GenAI explanation...';
    genaiErrorEl.textContent = '';

    if (ACTUAL_GEMINI_API_KEY === 'USER_SHOULD_REPLACE_THIS_WITH_THEIR_GEMINI_API_KEY') {
        const apiKeyWarning = "Warning: The Gemini API key is a placeholder. Please replace in script.js. GenAI call skipped.";
        genaiErrorEl.textContent = apiKeyWarning;
        genaiDataEl.textContent = ''; 
        console.warn(apiKeyWarning);
        return;
    }
    
    let db;
    let cachedGenAIData = null;
    try {
        db = await getDB(); 
        const cachedResult = await loadFromDB(db, cacheId);
        if (cachedResult) cachedGenAIData = cachedResult.response;
    } catch (error) {
        console.warn("Error loading GenAI data from IndexedDB:", error);
    }

    if (!cachedGenAIData) {
        try {
            const sqlCachedResult = await loadFromSqlJs(cacheId);
            if (sqlCachedResult) {
                cachedGenAIData = sqlCachedResult.response;
                if (db && cachedGenAIData) {
                    await saveToDB(db, cacheId, cachedGenAIData, CACHE_EXPIRATION_MINUTES_GENAI);
                }
            }
        } catch (error) {
            console.warn("Error loading GenAI data from SQL.js:", error);
        }
    }

    if (cachedGenAIData) {
        genaiDataEl.textContent = cachedGenAIData;
        console.log("GenAI data loaded from cache for input:", inputText.substring(0,50) + "...");
        return;
    }
    
    console.log("Fetching GenAI data from network for input:", inputText.substring(0,50) + "...");
    const requestBody = {
        contents: [{ role: "user", parts: [{ text: inputText }] }],
        generationConfig: { responseMimeType: "text/plain" }
    };

    try {
        const response = await fetch(FINAL_GENAI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. API Response: ${errorText}`);
        }
        const dataText = await response.text();
        genaiDataEl.textContent = dataText;

        if (db && dataText) { 
            await saveToDB(db, cacheId, dataText, CACHE_EXPIRATION_MINUTES_GENAI);
        }
        if (dataText) {
            await saveToSqlJs(cacheId, dataText, CACHE_EXPIRATION_MINUTES_GENAI);
        }
    } catch (error) {
        genaiErrorEl.textContent = `Error fetching GenAI data: ${error.message}`;
        genaiDataEl.textContent = ''; // Clear loading message
        console.error('GenAI Fetch error:', error);
    }
}


// ===================================================================================
// DOMContentLoaded - INITIALIZATION
// ===================================================================================
window.addEventListener('DOMContentLoaded', async () => {
    // Assign UI elements to global variables
    apiSelector = document.getElementById('apiSelector');
    inputFieldsContainer = document.getElementById('inputFieldsContainer');
    fetchDataButton = document.getElementById('fetchDataButton');
    dataHeadingEl = document.getElementById('dataHeading');
    yahooDataEl = document.getElementById('yahoo-data');
    yahooErrorEl = document.getElementById('yahoo-error');
    genaiDataEl = document.getElementById('genai-data');
    genaiErrorEl = document.getElementById('genai-error');

    if (!apiSelector || !inputFieldsContainer || !fetchDataButton || !dataHeadingEl || 
        !yahooDataEl || !yahooErrorEl || !genaiDataEl || !genaiErrorEl) {
        console.error("Fatal Error: One or more critical UI elements could not be found. App cannot start.");
        alert("Fatal Error: Critical UI element missing. App cannot start.");
        return;
    }

    // Initialize databases
    try {
        await getDB(); 
        console.log("IndexedDB initialized or ready.");
    } catch (error) {
        console.error("IndexedDB initialization failed:", error);
    }

    try {
        await initSqlJsDB(); 
        console.log("SQL.js initialized or ready.");
    } catch (error) {
        console.error("SQL.js initialization failed:", error);
    }

    // Setup dynamic input fields
    if (apiSelector) {
        apiSelector.addEventListener('change', updateInputFields);
        updateInputFields(); // Initial call for default selection
    }

    // Setup fetch button listener
    if (fetchDataButton) {
        fetchDataButton.addEventListener('click', async () => {
            if (!apiSelector) return;
            const selectedApi = apiSelector.value;
            yahooErrorEl.textContent = ''; // Clear previous main errors

            switch (selectedApi) {
                case 'optionsStraddle':
                    await fetchOptionsStraddleData();
                    break;
                case 'ipoCalendar':
                    await fetchIPOCalendarData();
                    break;
                case 'stockHistory':
                    await fetchStockHistoryData();
                    break;
                case 'marketQuote':
                    await fetchMarketQuoteData();
                    break;
                case 'marketScreenerDayGainers':
                    await fetchMarketScreenerDayGainersData();
                    break;
                case 'insiderTrades':
                    await fetchInsiderTradesData();
                    break;
                case 'mostActiveOptions':
                    await fetchMostActiveOptionsData();
                    break;
                default:
                    console.warn('Unknown API selected:', selectedApi);
                    yahooErrorEl.textContent = 'Please select a valid data type.';
            }
        });
    }
});

// Simple test function (can be removed if not needed)
function testScriptLoading() {
    console.log("script.js loaded successfully and testScriptLoading was called.");
}
testScriptLoading();
