let eyecatcherInterval;

document.addEventListener("DOMContentLoaded", function () {
    updateEyecatcher();
    setEyecatcherInterval();
});

window.addEventListener("storage", function (event) {
    if (event.key === "globalTheme") {
        updateEyecatcher();
        setEyecatcherInterval();
    }
});

function setEyecatcherInterval() {
    if (eyecatcherInterval) {
        clearInterval(eyecatcherInterval);
    }
    eyecatcherInterval = setInterval(updateEyecatcher, 15000);
}

function updateEyecatcher() {
    const eyecatcher = document.getElementById("eyecatcher");
    if (!eyecatcher) return;

    const currentTheme = localStorage.getItem("globalTheme") || "light";

    fetch('/phonePages/js/themeSwitcher/themes.json')
        .then(response => response.json())
        .then(themesData => {
            const currentThemeData = themesData.find(t => t.mode === currentTheme);
            if (!currentThemeData) {
                console.warn(`Theme ${currentTheme} not found.`);
                return;
            }

            const eyecatchers = currentThemeData.eyecatcher;
            const availableEyecatchers = Object.values(eyecatchers).filter(e => e.src?.trim());

            if (availableEyecatchers.length === 0) {
                console.warn("No valid eyecatchers found for this theme.");
                eyecatcher.style.display = 'none';
                return;
            }

            // Pick a random eyecatcher
            const randomEyecatcher = availableEyecatchers[Math.floor(Math.random() * availableEyecatchers.length)];
            eyecatcher.src = randomEyecatcher.src;
            eyecatcher.alt = randomEyecatcher.alt || '';
            eyecatcher.style.display = '';
        })
        .catch(err => {
            console.error("Failed to load themes.json:", err);
        });
}


const blackboard = document.getElementById('blackboard');
const updates = document.getElementById('updates');
const exit = document.getElementById('exit');

function toggleBlackboard() {
    if (blackboard.style.display === 'none' || blackboard.style.display === '') {
        blackboard.style.display = "flex";
    } else {
        blackboard.style.display = "none";
    }
}

updates.addEventListener('click', toggleBlackboard);
exit.addEventListener('click', toggleBlackboard);

