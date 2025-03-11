// ! First error: Check if you added IDs to the theme css links...
// ! Rage induced console logs will be found here

document.addEventListener("DOMContentLoaded", function () {
    const topPath = window.top.location.pathname.split('/').pop();
    const topPageName = topPath ? topPath.split('.')[0] : "index";

    const themeLinks = Array.from(window.top.document.querySelectorAll(`link[id^="${topPageName}"]`));
    let themesData = [];

    fetch('/phonePages/js/themeSwitcher/themes.json') 
        .then(response => response.json()) 
        .then(data => {
            themesData = data;
            // console.log("Themes Data: ", data); 
            applyInitialTheme();
        })
        .catch(err => {
            console.error("Failed to load themes.json:", err);
        });

    // ~ Helpers
    function getThemeId(pageName, themeMode) {
        return `${pageName}${capitalize(themeMode)}CSS`;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function applyInitialTheme() {
        let queuedTheme = sessionStorage.getItem('queuedTheme');
        if (queuedTheme) {
            // console.log("Using the currently queued theme:", queuedTheme);
            sessionStorage.removeItem('queuedTheme');
            return setTheme(queuedTheme, false); 
        }

        const savedTheme = localStorage.getItem("globalTheme") || "light";
        // console.log("No queued theme found! Using saved theme:", savedTheme);

        const matchedTheme = themesData.find(t => t.mode === savedTheme);
        setTheme(matchedTheme ? matchedTheme.mode : "light", true); 
    }

    function setTheme(queuedTheme, isInitialLoad = true) {
        let storedQueuedTheme = sessionStorage.getItem('queuedTheme');
        if (storedQueuedTheme) {
            sessionStorage.removeItem('queuedTheme'); // Just in case
            queuedTheme = storedQueuedTheme;
        }

        // console.log("Queued Theme Recieved:", queuedTheme);
        applyThemeInternal(queuedTheme, true, isInitialLoad);  // true = update localStorage
    }

    // ~ Main Function
    function applyThemeInternal(queuedTheme = null, updateStorage = false, isInitialLoad = false) {
        if (!queuedTheme) {
            queuedTheme = sessionStorage.getItem('queuedTheme') || localStorage.getItem('globalTheme') || "light";
            // console.log("No queuedTheme provided, using stored value:", queuedTheme);
        }

        // console.log("Looking for theme:", queuedTheme);
        let selectedTheme = themesData.find(t => t.mode === queuedTheme);
        // console.log("Selected Theme (that hopefully matches):", selectedTheme);

        if (!selectedTheme) {
            console.error(`Theme ${queuedTheme} not found in JSON.`);
            return;
        }

        const { mode, fallback } = selectedTheme;
        const themeId = getThemeId(topPageName, mode);
        const existingThemeLink = themeLinks.find(link => link.id === themeId);

        if (!existingThemeLink) {
            console.warn(`Theme ${queuedTheme} not found for ${topPageName}.`);
            if (fallback && fallback !== "none" && fallback !== queuedTheme) {
                console.warn(`No matching theme found. Falling back to ${fallback}. This is A-OK! Not all pages have a matching theme.`);
                return applyThemeInternal(fallback, false, isInitialLoad);
            } else {
                console.warn("This page probably doesn't have a theme. No worries!");
                return;
            }
        }

        if (isInitialLoad) {
            // console.log("Egg");

            themeLinks.forEach(link => {
                link.disabled = (link.id !== themeId);
            });

            if (updateStorage) {
                localStorage.setItem('globalTheme', mode);
            }
        } else {
            // console.log("Chicken");

            setTimeout(() => {
                themeLinks.forEach(link => {
                    link.disabled = (link.id !== themeId);
                });

                if (updateStorage) {
                    localStorage.setItem('globalTheme', mode);
                }
            }, 3400);
        }
    }
});
