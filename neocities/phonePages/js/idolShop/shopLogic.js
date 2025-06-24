function getCharmlets() {
    return parseInt(localStorage.getItem("charmlets") || "0");
}

function updateCharmletDisplay() {
    document.getElementById("charmletCount").textContent = getCharmlets();
}

function renderShop() {
    const grid = document.getElementById("shopGrid");
    grid.innerHTML = ""; // clear existing

    shopItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "shopItem";

        const owned = isOwned(item.id);

        div.innerHTML = `
      <img src="${item.preview}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price} ✦</p>
      <button ${owned ? 'disabled' : ''} onclick="buyItem('${item.id}')">
        ${owned ? "Owned" : "Buy"}
      </button>
    `;

        grid.appendChild(div);
    });
}

function isOwned(itemId) {
    const owned = JSON.parse(localStorage.getItem("ownedItems") || "{}");
    return Object.values(owned).flat().includes(itemId);
}

function unlockItem(item) {
    const owned = JSON.parse(localStorage.getItem("ownedItems") || "{}");

    if (!owned[item.type]) {
        owned[item.type] = [];
    }

    if (!owned[item.type].includes(item.id)) {
        owned[item.type].push(item.id);
        localStorage.setItem("ownedItems", JSON.stringify(owned));
    }
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    const current = getCharmlets();
    if (current >= item.price) {
        localStorage.setItem("charmlets", current - item.price);
        unlockItem(item);
        alert(`Purchased ${item.name}!`);
        updateCharmletDisplay();
        renderShop();
    } else {
        alert(`Not enough Charmlets!`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateCharmletDisplay();
    renderShop();
});