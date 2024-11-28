// API request helpers
export async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json(); 
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw for handling in components
    }
}
