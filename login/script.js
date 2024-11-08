const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate database check (replace with actual database logic)
    if (checkCredentials(username, password)) {
        // Store user data in localStorage (consider security implications)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);

        // Redirect to payments page
        window.location.href = 'payments/index.html'; // Assuming payments page is at payments/index.html
    } else {
        alert('Invalid username or password.');
    }
});

function checkCredentials(username, password) {
    // Replace with actual database interaction
    // Example: fetch data from server and compare with entered credentials
    // For this example, we'll use hardcoded values
    if (username === 'user' && password === 'password') {
        return true;
    } else {
        return false;
    }
}
