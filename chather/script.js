class ChaturbateAPI {
    constructor() {
        this.apiUrl = "https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=9cg6A&gender=f&client_ip=request_ip";
        this.onlineUsers = {};
        this.previousUsers = {};
        this.currentPage = 1;
        this.usersPerPage = 25;
        this.iframeSrcBase = "https://chaturbate.com/in/?tour=Jrvi&campaign=9cg6A&track=embed&bgcolor=white"; 
    }

    async fetchData() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            this.processData(data.results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    processData(users) {
        users.forEach(user => {
            if (user.current_show === "public") {
                this.onlineUsers[user.username] = user;
            }
        });
        this.loadStoredData();
        this.displayUsers();
        this.displayPreviousUsers();
    }

    displayUsers() {
        const filteredUsers = this.filterUsers(); // Call filterUsers here
        const paginatedUsers = this.paginateUsers(filteredUsers);

        const onlineUsersDiv = document.getElementById("onlineUsers");
        onlineUsersDiv.innerHTML = "";

        if (paginatedUsers.length === 0) {
            const noUsersMessage = document.createElement("p");
            noUsersMessage.textContent = "No users found.";
            onlineUsersDiv.appendChild(noUsersMessage);
        } else {
            paginatedUsers.forEach(user => {
                const userDiv = document.createElement("div");
                userDiv.classList.add("user");
                const img = document.createElement("img");
                img.src = user.image_url_360x270;
                img.alt = user.username;
                img.addEventListener("click", () => this.changeIframeSrc(user.username));
                img.addEventListener("dblclick", () => this.removeUser(user.username));
                userDiv.appendChild(img);
                onlineUsersDiv.appendChild(userDiv);
            });
        }

        this.updatePagination(filteredUsers); 
    }

    displayPreviousUsers() {
        const previousUsersDiv = document.getElementById("previousUsers");
        previousUsersDiv.innerHTML = "";

        for (const username in this.previousUsers) {
            const user = this.previousUsers[username];
            if (this.onlineUsers[username] && this.onlineUsers[username].current_show === "public") {
                const userDiv = document.createElement("div");
                userDiv.classList.add("user");
                const img = document.createElement("img");
                img.src = user.image_url_360x270;
                img.alt = user.username;
                img.addEventListener("click", () => this.changeIframeSrc(user.username));
                userDiv.appendChild(img);
                previousUsersDiv.appendChild(userDiv);
            }
        }
    }

    changeIframeSrc(username) {
        const mainIframe = document.getElementById("mainIframe");
        mainIframe.src = `https://chaturbate.com/embed/${username}/?campaign=9cg6A&disable_sound=0&join_overlay=1&room=jessicapearsons&tour=9oGW`;

        this.previousUsers[username] = this.onlineUsers[username];
        this.storeData("previousUsers", this.previousUsers);
    }

    removeUser(username) {
        delete this.onlineUsers[username];
        this.storeData("removedUsers", username);
        this.displayUsers(); 
    }

    filterUsers() { 
        const filterInput = document.getElementById("filterInput").value.toLowerCase();
        const genderFilter = document.getElementById("genderFilter").value;
        const ageFilterMin = parseInt(document.getElementById("ageFilterMin").value, 10) || 0;
        const ageFilterMax = parseInt(document.getElementById("ageFilterMax").value, 10) || Infinity;
        const tagsFilter = document.getElementById("tagsFilter").value.toLowerCase();
        const numUsersFilterMin = parseInt(document.getElementById("numUsersFilterMin").value, 10) || 0;
        const numUsersFilterMax = parseInt(document.getElementById("numUsersFilterMax").value, 10) || Infinity;

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        return Object.values(this.onlineUsers).filter(user => {
            const userBirthday = new Date(user.birthday);
            return user.username.toLowerCase().includes(filterInput) &&
                   (genderFilter === "" || user.gender === genderFilter) &&
                   user.age >= ageFilterMin && user.age <= ageFilterMax &&
                   (tagsFilter === "" || user.tags.some(tag => tag.toLowerCase().includes(tagsFilter))) &&
                   user.num_users >= numUsersFilterMin && user.num_users <= numUsersFilterMax &&
                   (isNaN(userBirthday) || userBirthday >= twoWeeksAgo);
        });
    }

    paginateUsers(users) {
        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const endIndex = startIndex + this.usersPerPage;
        return users.slice(startIndex, endIndex);
    }


    updatePagination(filteredUsers) {
        const paginationDiv = document.getElementById("pagination");
        paginationDiv.innerHTML = ""; 

        const totalPages = Math.ceil(filteredUsers.length / this.usersPerPage);

        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = i;
                pageButton.addEventListener("click", () => {
                    this.currentPage = i;
                    this.displayUsers(); 
                });
                if (i === this.currentPage) {
                    pageButton.classList.add("active");
                }
                paginationDiv.appendChild(pageButton);
            }
        }
    }

    loadStoredData() {
        // ... (same as before)
    }

    storeData(key, value) {
        // ... (same as before)
    }
}

const chaturbate = new ChaturbateAPI();
chaturbate.fetchData();

// Add event listener to the filter form
const filterForm = document.getElementById("filterForm");
filterForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    chaturbate.currentPage = 1; // Reset to the first page when filtering
    chaturbate.displayUsers(); // Re-display users with applied filters
});
