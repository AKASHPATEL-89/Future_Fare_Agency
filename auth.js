// Authentication check for all pages
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check only for login page
    if (!window.location.pathname.includes('login.html')) {
        checkAuth();
    }
});