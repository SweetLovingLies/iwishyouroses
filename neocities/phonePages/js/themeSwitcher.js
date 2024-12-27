// ! First error: Check if you added IDs to the theme css links...

document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem("forceChristmasTheme");

    const topPath = window.top.location.pathname.split('/').pop();
    const topPageName = topPath ? topPath.split('.')[0] : "index";

    const themeLinks = Array.from(window.top.document.querySelectorAll(`link[id^="${topPageName}"]`));

    if (!themeLinks.length) {
        console.warn(`No themes for ${topPageName} found. Skipping theme initialization!`);
        return;
    }

    const availableThemes = themeLinks.map(link => {
        const themeName = link.id.replace(topPageName, '').replace('CSS', '').toLowerCase();
        return themeName;
    });

    const themeButtons = document.querySelectorAll("[data-theme]");

    function applyInitialTheme() {
        const savedTheme = localStorage.getItem("globalTheme") || "light";
        const validTheme = availableThemes.includes(savedTheme) ? savedTheme : "light";
        setTheme(validTheme);
    }

    function applyTheme(theme) {
        const loadingScreen = document.getElementById("loadingScreen");
        const progressBar = document.getElementById("progress");

        if (loadingScreen && progressBar) {
            loadingScreen.classList.remove("hidden");
            loadingScreen.style.pointerEvents = "all";
            let progress = 0;
            const loadingInterval = setInterval(() => {
                if (progress < 100) {
                    progress += 3;
                    progressBar.style.width = progress + "%";
                } else {
                    clearInterval(loadingInterval);
                    loadingScreen.classList.add("hidden");
                    loadingScreen.style.pointerEvents = "none";
                    setTheme(theme);
                }
            }, 100);
        } else {
            setTheme(theme);
        }
    }

    function setTheme(theme) {
        const themeId = theme === 'light'
            ? `${topPageName}CSS`
            : `${topPageName}${theme.charAt(0).toUpperCase() + theme.slice(1)}CSS`;

        themeLinks.forEach(link => {
            link.disabled = link.id !== themeId;
        });

        localStorage.setItem("globalTheme", theme);
        themeButtons.forEach(button => {
            button.disabled = button.dataset.theme === theme;
        });
    }

    themeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const theme = button.dataset.theme;
            if (theme) {
                applyTheme(theme);
            }
        });
    });

    applyInitialTheme();
});
