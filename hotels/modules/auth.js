// Google Sign-In
export function initAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID'
        }).then(function() {
            // Attach sign-in handler to button
            const authContainer = document.getElementById('auth-container');
            gapi.signin2.render(authContainer, {
                'scope': 'profile email',
                'width': 240,
                'height': 50,
                'longtitle': true,
                'theme': 'dark'
            });
        });
    });
}

// Get user profile
export function getUserProfile() { 
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        const profile = auth2.currentUser.get().getBasicProfile();
        return {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            imageUrl: profile.getImageUrl()
        };
    }
    return null;
}

// modules/auth.js

// ... (previous code)

// Function to handle the sign-in state change
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        // User is signed in
        const profile = getUserProfile(); 
        // ... (Display user's name, profile picture, etc.)

        // Show booking history
        getAllBookings()
            .then(bookings => {
                displayBookingHistory(bookings);
            });

        // ... (Other actions to perform when user is signed in)
    } else {
        // User is signed out
        // ... (Hide user info, clear booking history, etc.)
    }
}

// Initialize Google Sign-In
export function initAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID'
        }).then(function() {
            // ... (Render the sign-in button)

            // Listen for sign-in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

            // Handle initial sign-in state
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
}

// ... (rest of the auth.js code)
