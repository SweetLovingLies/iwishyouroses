const clearCacheButton = document.getElementById('clearCacheButton');
if (clearCacheButton) {
    clearCacheButton.addEventListener('click', () => {
        localStorage.clear()
        alert("Cache Cleared!");
        window.top.location.reload();
    });
}

// & Freezeframe.js

function toggleGIFs() {
    const gifToggle = document.getElementById("gifToggle");
    const toggleState = gifToggle.checked ? "playing" : "stopped";

    localStorage.setItem("gifState", toggleState);

    window.top.postMessage({ command: toggleState }, "*");
}

window.addEventListener("load", () => {
    const gifState = localStorage.getItem("gifState");

    const gifToggle = document.getElementById("gifToggle");

    if (gifState === "playing") {
        gifToggle.checked = true;
    } else {
        gifToggle.checked = false;
    }

    window.top.postMessage({ command: gifState }, "*");
});

// & Fun Stuff
var userName = localStorage.getItem("userName");
var selectedIcon = localStorage.getItem("selectedIcon");

document.getElementById("welcomeMessage").textContent = `Welcome, ${userName}!`;
document.getElementById("userIcon").src = selectedIcon;


document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.getElementById("userIcon");
    const chance = 0.01;
    const alternateIcon = "/Assets/other/anonAicon.jpg";

    if (Math.random() < chance) {
        userIcon.src = alternateIcon;
    }
});

// & Themeswitcher

document.addEventListener("DOMContentLoaded", function () {
    const themeLinks = Array.from(document.querySelectorAll("link[id^='settings']"));
    const savedTheme = localStorage.getItem("globalTheme") || "light";
    const pageName = window.location.pathname.split('/').pop().split('.')[0];

    const availableThemes = themeLinks.map(link => link.id.replace(pageName, '').replace('CSS', '').toLowerCase());
    const validTheme = (availableThemes.includes(savedTheme) && themeLinks.some(link => link.getAttribute("data-theme") === savedTheme))
        ? savedTheme
        : "light";

    const body = document.body;
    if (savedTheme === "dark") {
        body.classList.add("dark");
    } else {
        body.classList.remove("dark");
    }

    themeLinks.forEach(link => link.disabled = link.getAttribute("data-theme") !== validTheme);
});