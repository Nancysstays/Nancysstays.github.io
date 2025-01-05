class ChaturbateAPI {
    constructor() {
        this.apiUrl = "https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=9cg6A&client_ip=request_ip";
        this.onlineUsers = {};
        this.previousUsers = {};
        this.currentPage = 1;
        this.usersPerPage = 10; // Adjust as needed
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
        const filteredUsers = this.filterUsers(this.onlineUsers);
        const paginatedUsers = this.paginateUsers(filteredUsers);

        const onlineUsersDiv = document.getElementById("onlineUsers");
        onlineUsersDiv.innerHTML = "";

        paginatedUsers.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            const img = document.createElement("img");
            img.src = user.image_url_360x270;
            img.alt = user.username;
            img.addEventListener("click", () => this.changeIframeSrc(user.iframe_embed));
            img.addEventListener("dblclick", () => this.removeUser(user.username));
            userDiv.appendChild(img);
            onlineUsersDiv.appendChild(userDiv);
        });
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
                img.addEventListener("click", () => this.changeIframeSrc(user.iframe_embed));
                userDiv.appendChild(img);
                previousUsersDiv.appendChild(userDiv);
            }
        }
    }

    changeIframeSrc(src) {
        const mainIframe = document.getElementById("mainIframe");
        mainIframe.src = src;
    }

    removeUser(username) {
        delete this.onlineUsers[username];
        this.storeData("removedUsers", username);
        this.displayUsers();
    }

    filterUsers(users) {
        const filterInput = document.getElementById("filterInput").value.toLowerCase();
        return Object.values(users).filter(user => user.username.toLowerCase().includes(filterInput));
    }

    paginateUsers(users) {
        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const endIndex = startIndex + this.usersPerPage;
        return users.slice(startIndex, endIndex);
    }

    loadStoredData() {
        const removedUsers = localStorage.getItem("removedUsers");
        if (removedUsers) {
            removedUsers.split(",").forEach(username => {
                delete this.onlineUsers[username];
            });
        }
    }

    storeData(key, value) {
        localStorage.setItem(key, value);
    }
}

const chaturbate = new ChaturbateAPI();
chaturbate.fetchData();
