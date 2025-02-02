// script.js
if (window.Worker) {
    const myWorker = new Worker("worker.js");
    const onlineUsersDiv = document.getElementById("onlineUsers");
    const previousUsersDiv = document.getElementById("previousUsers");
    const mainIframe = document.getElementById("mainIframe");
    let previousUsers = loadPreviousUsers(); // Load from localStorage

    displayPreviousUsers(); // Display on load

    myWorker.postMessage("fetchData");

    myWorker.onmessage = function (event) {
        if (event.data.error) {
            console.error("Error from worker:", event.data.error);
            return;
        }

        onlineUsersDiv.innerHTML = "";

        event.data.results.forEach(user => {
            const userElement = document.createElement("div");
            userElement.className = "user-info";
            userElement.innerHTML = `
                <img src="${user.image_url}" alt="${user.username}" data-iframe-url="${user.iframe_embed}">
                <div class="user-details">
                    <p>Username: ${user.username}</p>
                    <p>Age: ${user.age}</p>
                    <p>Location: ${user.location}</p>
                </div>
            `;

            userElement.addEventListener("click", function () {
                const iframeUrl = userElement.querySelector("img").dataset.iframeUrl;
                mainIframe.src = iframeUrl;

                // Add to previousUsers and update localStorage
                addToPreviousUsers(user);
                displayPreviousUsers();
            });

            onlineUsersDiv.appendChild(userElement);
        });
    };

    function addToPreviousUsers(user) {
        // Check if user already exists
        if (!previousUsers.some(u => u.username === user.username)) {
            previousUsers.push(user);
            localStorage.setItem("previousUsers", JSON.stringify(previousUsers));
        }
    }

    function displayPreviousUsers() {
        previousUsersDiv.innerHTML = "";
        previousUsers.forEach(user => {
            const userElement = document.createElement("div");
            userElement.className = "user-info";
            userElement.innerHTML = `
                <img src="${user.image_url}" alt="${user.username}" data-iframe-url="${user.iframe_embed}">
                <div class="user-details">
                    <p>Username: ${user.username}</p>
                </div>
            `;

            userElement.addEventListener("click", function () {
                const iframeUrl = userElement.querySelector("img").dataset.iframeUrl;
                mainIframe.src = iframeUrl;
            });

            previousUsersDiv.appendChild(userElement);
        });
    }

    function loadPreviousUsers() {
        const storedUsers = localStorage.getItem("previousUsers");
        return storedUsers ? JSON.parse(storedUsers) : [];
    }

} else {
    console.log("Your browser doesn't support web workers.");
}
