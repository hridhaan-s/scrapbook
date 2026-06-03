/**
 * theme.js
 * Handles dark/light theme toggling and persists selection via localStorage.
 */

// 1. SVG Icon Definitions (32x32 viewbox, currentColor for easy styling)
const moonIcon = `
<svg fill="currentColor" viewBox="0 0 32 32" style="width: 1.5rem; height: 1.5rem;">
<path d="M23.6092 6.13958C23.4536 5.82987 23.3348 5.45086 23.2301 4.97851C23.1163 4.43475 22.5273 4.43404 22.4495 4.81588C22.3116 5.4544 22.1928 5.83765 22.0365 6.14948C21.8591 6.46132 21.6802 6.67557 21.5204 6.82265C21.2467 7.02842 20.7708 7.27237 19.9124 7.5043C19.37 7.62238 19.3785 8.2107 19.7625 8.28636C20.7673 8.53031 21.2396 8.76083 21.5133 8.9567C21.8796 9.34278 22.207 9.95725 22.4276 10.7987C22.5414 11.3425 23.1297 11.3439 23.2082 10.9613C23.4621 9.94947 23.6982 9.47571 23.8984 9.20348C24.271 8.85204 24.889 8.52253 25.7404 8.30191C26.2827 8.19019 26.2827 7.60117 25.8995 7.52198C24.8883 7.26459 24.4131 7.02559 24.1388 6.82477C23.8927 6.5787 23.6912 6.30505 23.6092 6.13958ZM24.9529 21.2251C25.8563 21.0399 26.6747 21.9485 26.1197 22.6849C23.9298 25.591 20.4494 27.4697 16.5303 27.4697C9.90286 27.4697 4.53027 22.0972 4.53027 15.4697C4.53027 11.5506 6.40906 8.07026 9.3151 5.88028C10.0515 5.32532 10.9601 6.14376 10.7749 7.04709C10.6145 7.82957 10.5303 8.63981 10.5303 9.46974C10.5303 16.0972 15.9029 21.4697 22.5303 21.4697C23.3602 21.4697 24.1704 21.3855 24.9529 21.2251Z"/>
</svg>
`;

const sunIcon = `
<svg fill="currentColor" viewBox="0 0 32 32" style="width: 1.5rem; height: 1.5rem;">
<path d="M16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10ZM16 5C15.4477 5 15 4.55228 15 4V5C15 5.55228 15.4477 6 16 6C16.5523 6 17 5.55228 17 5V4C17 4.55228 16.5523 5 16 5ZM16 26C15.4477 26 15 26.4477 15 27V28C15 28.5523 15.4477 29 16 29C16.5523 29 17 28.5523 17 28V27C17 26.4477 16.5523 26 16 26ZM5 16C5 15.4477 4.55228 15 4 15H3C2.44772 15 2 15.4477 2 16C2 16.5523 2.44772 17 3 17H4C4.55228 17 5 16.5523 5 16ZM29 16C29 15.4477 28.5523 15 28 15H27C26.4477 15 26 15.4477 26 16C26 16.5523 26.4477 17 27 17H28C28.5523 17 29 16.5523 29 16ZM8.22183 8.22183C7.8313 7.8313 7.19814 7.8313 6.80761 8.22183C6.41709 8.61236 6.41709 9.24552 6.80761 9.63605L7.51472 10.3432C7.90524 10.7337 8.53841 10.7337 8.92893 10.3432C9.31946 9.95263 9.31946 9.31946 8.92893 8.92893L8.22183 8.22183ZM23.7782 23.7782C23.3877 23.3877 22.7545 23.3877 22.364 23.7782C21.9735 24.1687 21.9735 24.8019 22.364 25.1924L23.0711 25.8995C23.4616 26.29 24.0948 26.29 24.4853 25.8995C24.8758 25.509 24.8758 24.8758 24.4853 24.4853L23.7782 23.7782ZM8.22183 23.7782L7.51472 24.4853C7.1242 24.8758 7.1242 25.509 7.51472 25.8995C7.90524 26.29 8.53841 26.29 8.92893 25.8995L9.63604 25.1924C10.0266 24.8019 10.0266 24.1687 9.63604 23.7782C9.24552 23.3877 8.61235 23.3877 8.22183 23.7782ZM23.7782 8.22183L23.0711 8.92893C22.6805 9.31946 22.6805 9.95263 23.0711 10.3432C23.4616 10.7337 24.0948 10.7337 24.4853 10.3432L25.1924 9.63605C25.5829 9.24552 25.5829 8.61236 25.1924 8.22183C24.8019 7.8313 24.1687 7.8313 23.7782 8.22183Z"/>
</svg>
`;

// 2. Cache DOM Elements
const toggleBtn = document.getElementById("theme-toggle");
const iconContainer = document.getElementById("theme-icon");

/**
 * Updates the visual icon based on the active theme status.
 * If dark mode is active, it presents the SUN icon (the option to go light).
 * If light mode is active, it presents the MOON icon (the option to go dark).
 */
function updateIcon() {
    if (!iconContainer) return;
    const isDarkActive = document.body.classList.contains("dark");
    iconContainer.innerHTML = isDarkActive ? sunIcon : moonIcon;
}

/**
 * Initializes the theme state directly upon script evaluation.
 * Running this immediately avoids the unappealing white UI flicker on slow connections.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    
    // Checks localStorage first; falls back to system preferences if empty
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
    
    updateIcon();
}

// Execute core initialization
initializeTheme();

// 3. Register Event Listeners safely once the document loads
document.addEventListener("DOMContentLoaded", () => {
    // Re-verify elements in case script loaded early in HTML <head>
    const activeToggle = toggleBtn || document.getElementById("theme-toggle");
    
    if (activeToggle) {
        activeToggle.addEventListener("click", () => {
            const isDarkNow = document.body.classList.toggle("dark");
            localStorage.setItem("theme", isDarkNow ? "dark" : "light");
            updateIcon();
        });
    }
});