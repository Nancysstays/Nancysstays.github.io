class API {
    constructor() {
        this.baseURL = "https://chaturbate.com/api/public/affiliates/onlinerooms/";
        this.wm = "9cg6A";
        this.client_ip = "request_ip";
        this.limit = 50; // Increased limit for pagination
        this.offset = 0;
        this.gender = "f"; // Default to female
        this.format = "json";
        this.exhibitionist = "";
        this.region = "";
        this.tag = "";
        this.hd = "";
        this.page = 1;
        this.results = [];
        this.previousUsers = this.loadPreviousUsers(); // Load from localStorage
        this.displayPreviousUsers(); // Display previous users on load
        this.fetchData();
        this.setupEventListeners();
        this.currentPage = 1;
        this.usersPerPage = 50;
        this.maxPages = 10;
        this.currentData = [];
    }

    async fetchData() {
        const queryParams = new URLSearchParams({
            wm: this.wm,
            client_ip: this.client_ip,
            limit: this.limit,
            offset: this.offset,
            gender: this.gender,
            format: this.format,
            exhibitionist: this.exhibitionist,
            region: this.region,
            tag: this.tag,
            hd: this.hd,
        });

        const url = `${this.baseURL}?${queryParams}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.results && Array.isArray(data.results)) {
                // Filter out duplicate usernames
                const newResults = data.results.filter(newUser => 
                    !this.results.some(existingUser => existingUser.username === newUser.username)
                );

                this.results.push(...newResults);
                this.currentData = this.results; // Update current data for display
                // this.displayOnlineUsers(this.results);
                this.displayOnlineUsers();
                this.createPaginationControls();
            } else {
                console.error("Unexpected API response format:", data);
            }
        } catch (error) {
            console.error
