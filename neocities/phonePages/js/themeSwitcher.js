// ! First error: Check if you added IDs to the theme css links...

document.addEventListener("DOMContentLoaded", function () {
    const topPath = window.top.location.pathname.split('/').pop();
    const topPageName = topPath ? topPath.split('.')[0] : "index";

    // ! You will be jolly.
    const forceChristmasTheme = localStorage.getItem("forceChristmasTheme") || "true";

    // ~ For top level html files only!

    const themeLinks = Array.from(window.top.document.querySelectorAll(`link[id^="${topPageName}"]`));


    if (!themeLinks.length) {
        console.warn(`No themes for ${topPageName} found. Skipping theme initialization!`);
        return;
    }

    const availableThemes = themeLinks.map(link => {
        const themeName = link.id.replace(topPageName, '').replace('CSS', '').toLowerCase();
        return themeName;
    });

    // console.log('Available themes for this page:', availableThemes);

    const themeButtons = document.querySelectorAll("[data-theme]");

    function applyInitialTheme() {
        // ? For the first time in forever...
        if (forceChristmasTheme === "true") {
            console.log("You will be jolly.");
            setTheme("christmas");
            localStorage.setItem("forceChristmasTheme", "false");  
        } else {
            const savedTheme = localStorage.getItem("globalTheme") || "light";
            const validTheme = availableThemes.includes(savedTheme) ? savedTheme : "light";
            setTheme(validTheme);
        }
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
        // console.log("Applying theme:", theme);

        const themeId = theme === 'light'
            ? `${topPageName}CSS`
            : `${topPageName}${theme.charAt(0).toUpperCase() + theme.slice(1)}CSS`;

        themeLinks.forEach(link => {
            link.disabled = link.id !== themeId;
            // console.log(`Link: ${link.id}, Disabled: ${link.disabled}`);
        });

        localStorage.setItem("globalTheme", theme);
        themeButtons.forEach(button => {
            button.disabled = button.dataset.theme === theme;
        });

        // ? Nothing's in my way!
        if (theme === "christmas") {
            localStorage.setItem("forceChristmasTheme", "false");
        } else {
            console.log("Fine. Go along on your merry way!")
            localStorage.setItem("forceChristmasTheme", "true");
        }
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
