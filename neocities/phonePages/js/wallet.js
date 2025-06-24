function updateWalletDisplay() {
    const count = localStorage.getItem("charmlets") || "0";
    document.getElementById("walletCharmletDisplay").textContent = count;
}

function loadCharmletHistory() {
    const historyList = JSON.parse(localStorage.getItem("charmletHistory") || "[]");
    const listEl = document.getElementById("charmletHistoryList");

    listEl.innerHTML = historyList.map(entry => `<li>${entry}</li>`).join("");
}

// I may need this... idk
function logCoinEvent(text) {
    const history = JSON.parse(localStorage.getItem("charmletHistory") || "[]");
    history.unshift(text);
    if (history.length > 15) history.pop(); // keep most recent 15
    localStorage.setItem("charmletHistory", JSON.stringify(history));
}

document.addEventListener("DOMContentLoaded", () => {
    updateWalletDisplay();
    loadCharmletHistory();
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