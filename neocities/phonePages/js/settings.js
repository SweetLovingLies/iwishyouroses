const clearCacheButton = document.getElementById('clearCacheButton');
if (clearCacheButton) {
    clearCacheButton.addEventListener('click', () => {
        localStorage.clear()
        alert("Cache Cleared!");
        window.top.location.reload();
    });
}

const resetLayoutButton = document.getElementById('resetLayoutButton')
if (resetLayoutButton) {
    resetLayoutButton.addEventListener('click', () => {
        localStorage.removeItem('column1Order');
        localStorage.removeItem('trayOrder');
        localStorage.removeItem('homepage1Order');
        localStorage.removeItem('homepage2Order');

        alert("Homepage Layout has been reset!");
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