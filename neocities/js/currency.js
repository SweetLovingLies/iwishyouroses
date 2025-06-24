if (!localStorage.getItem("charmlets")) {
    localStorage.setItem("charmlets", "0");
}

function addCharmlets(amount) {
    let current = parseInt(localStorage.getItem("charmlets") || "0");
    localStorage.setItem("charmlets", current + amount);
    updateCoinDisplay();
}

function spendCharmlets(amount) {
    let current = parseInt(localStorage.getItem("charmlets") || "0");
    if (current >= amount) {
        localStorage.setItem("charmlets", current - amount);
        return true;
    }
    return false;
}