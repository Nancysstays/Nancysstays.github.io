class ChaturbateAPI {
    constructor() {
        this.apiUrl = "https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=9cg6A&&gender=f&limit=500&client_ip=request_ip";
        this.onlineUsers = {};
        this.previousUsers = {};
        this.currentPage = 1;
        this.usersPerPage = 500;
        this.iframeSrcBase = "https://chaturbate.com/in/?tour=dU9X&campaign=9cg6A&track=embed&bgcolor=white"; 
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

    async fetchAllData() {
        // Get data over multiple async requests
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            this.processData(data.results);

            if (data.next) {
                this.apiUrl = data.next;
                await this.fetchAllData();
            }
        }
        catch (error) {
            alert("Error fetching data:", error);
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
        mainIframe.src = `https://chaturbate.com/embed/${username}/?campaign=9cg6A&disable_sound=0&join_overlay=1&room=jessicapearsons&tour=dU9X`;

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
        // Create a container for the pagination elements
        const paginationContainer = document.createElement("nav");
        const paginationList = document.createElement("ul");
        paginationList.classList.add("pagination"); 

        // Add "Previous" button
        const prevButton = this.createPaginationButton("&laquo;", this.currentPage - 1, this.currentPage > 1);
        paginationList.appendChild(prevButton);

        // Add page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = this.createPaginationButton(i, i, true);
            if (i === this.currentPage) {
                pageButton.classList.add("active");
            }
            paginationList.appendChild(pageButton);
        }

        // Add "Next" button
        const nextButton = this.createPaginationButton("&raquo;", this.currentPage + 1, this.currentPage < totalPages);
        paginationList.appendChild(nextButton);

        // Add the list to the container and the container to the page
        paginationContainer.appendChild(paginationList);
        paginationDiv.appendChild(paginationContainer);
    }
}

createPaginationButton(text, page, enabled) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (!enabled) {
        li.classList.add("disabled");
    }

    const button = document.createElement("a");
    button.classList.add("page-link");
    button.href = "#"; 
    button.textContent = text;
    button.addEventListener("click", (event) => {
        event.preventDefault(); 
        if (enabled) {
            this.currentPage = page;
            this.displayUsers(); 
        }
    });

    li.appendChild(button);
    return li;
}

// ... (other parts of the ChaturbateAPI class)

// ... (other parts of the ChaturbateAPI class)

loadStoredData() {
    const removedUsers = localStorage.getItem("removedUsers");
    if (removedUsers) {
        try {
            const removedUsersArray = JSON.parse(removedUsers);
            removedUsersArray.forEach(username => {
                delete this.onlineUsers[username];
            });
        } catch (error) {
            console.error("Error parsing removed users from localStorage:", error);
        }
    }

    const previousUsers = sessionStorage.getItem("previousUsers");
    if (previousUsers) {
        try {
            this.previousUsers = JSON.parse(previousUsers);
        } catch (error) {
            console.error("Error parsing previous users from sessionStorage:", error);
        }
    }
}

storeData(key, value) {
    if (key === "removedUsers") {
        let removedUsersArray = [];
        const storedUsers = localStorage.getItem("removedUsers");
        if (storedUsers) {
            try {
                removedUsersArray = JSON.parse(storedUsers);
            } catch (error) {
                console.error("Error parsing removed users from localStorage:", error);
            }
        }
        removedUsersArray.push(value);
        localStorage.setItem("removedUsers", JSON.stringify(removedUsersArray));
    } else if (key === "previousUsers") {
        sessionStorage.setItem("previousUsers", JSON.stringify(value));
    }
}

// ... (other parts of the ChaturbateAPI class)
}

// Add event listener to the filter form
const filterForm = document.getElementById("filterForm");
filterForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    chaturbate.currentPage = 1; // Reset to the first page when filtering
    chaturbate.displayUsers(); // Re-display users with applied filters
});

// Add event listener to the "Load All" button
document.getElementById("loadAll").addEventListener("click", () => {
    chaturbate.fetchAllData();
});

// Add event listener to the "Reset Filters" button
document.getElementById("resetFilters").addEventListener("click", () => {
    filterForm.reset();
    chaturbate.currentPage = 1;
    chaturbate.displayUsers();
});

// Add event listener to the "Reset Removed Users" button
document.getElementById("resetRemovedUsers").addEventListener("click", () => {
    localStorage.removeItem("removedUsers");
    chaturbate.loadStoredData();
    chaturbate.displayUsers();
});


// Add event listener to the "Reset Previous Users" button
document.getElementById("resetPreviousUsers").addEventListener("click", () => {
    sessionStorage.removeItem("previousUsers");
    chaturbate.loadStoredData();
    chaturbate.displayPreviousUsers();
});

// Add event listener to the "Clear All" button
document.getElementById("clearAll").addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    chaturbate.loadStoredData();
    chaturbate.displayUsers();
    chaturbate.displayPreviousUsers();
});

// Add event listener to the "Load More" button
document.getElementById("loadMore").addEventListener("click", () => {
    chaturbate.currentPage++;
    chaturbate.displayUsers();
});

// Add event listener to the "Load Less" button
document.getElementById("loadLess").addEventListener("click", () => {
    chaturbate.currentPage--;
    chaturbate.displayUsers();
});

// Add event listener to the "Reset Page" button
document.getElementById("resetPage").addEventListener("click", () => {
    chaturbate.currentPage = 1;
    chaturbate.displayUsers();
});

// document.getElementById("loadmore").addEventListener('click', function() {
//     var url = 'https://chaturbate.com/api/chatvideocontext/' + '?from=0&count=1000';
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             var response = JSON.parse(xhr.responseText);
//             var rooms = response.rooms;
//             rooms.forEach(function(room) {
//                 var roomElement = document.createElement('div');
//                 roomElement.className = 'room';
//                 roomElement.innerHTML = '<a href="https://chaturbate.com/' + room.username + '" target="_blank">' + room.username + '</a>';
//                 rooms.appendChild(roomElement);
//             });
//         }
//     };
//     xhr.send();
// });
// 
class Recorder {
    constructor() {
        this.mediaRecorder = null;
        this.chunks = [];
        this.recording = false;
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = event => {
                    this.chunks.push(event.data);
                };
                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    audio.controls = true;
                    document.getElementById("recordings").appendChild(audio);
                };
                this.mediaRecorder.start();
                this.recording = true;
            })
            .catch(error => {
                alert("Error accessing microphone. Please allow access and refresh the page.");
                // console.error("Error starting recording:", error);
            });
    }

    stopRecording() {
        if (this.mediaRecorder && this.recording) {
            this.mediaRecorder.stop();
            this.recording = false;
        }
    }
}

// Create a new instance of the Recorder class when a record button is clicked.
const recorder = new Recorder();
document.getElementById("startRecording").addEventListener("click", () => {
    recorder.startRecording();
});
document.getElementById("stopRecording").addEventListener("click", () => {
    recorder.stopRecording();
});

class AutoScrollOnlineUsers {
    constructor() {
        this.intervalId = null;
        this.id = null;
    }

    startAutoScroll() {
        this.intervalId = setInterval(() => {
            window.scrollBy(0, 100);
        }, 100);
    }

    stopAutoScroll() {
        clearInterval(this.intervalId);
    }
}

// Create a new instance of ChaturbateAPI and AutoScrollOnlineUsers when the page loads.
const chaturbate = new ChaturbateAPI();
const autoScrollOnlineUsers = new AutoScrollOnlineUsers();
window.onload = () => {
    try {
        chaturbate.fetchAllData();
    } catch (error) {
        alert("Error fetching data:", error);
    }
};

// Stop auto-scrolling when the user scrolls manually.
window.onscroll = () => {
    autoScrollOnlineUsers.stopAutoScroll();
};

// Add event listener to the "Auto-Scroll" checkbox.
document.getElementById("autoScroll").addEventListener("change", event => {
    if (event.target.checked) {
        autoScrollOnlineUsers.startAutoScroll();
    } else {
        autoScrollOnlineUsers.stopAutoScroll();
    }
});