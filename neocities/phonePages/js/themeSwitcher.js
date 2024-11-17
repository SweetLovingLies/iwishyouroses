// First error: Check if you added IDs to the theme css links...

document.addEventListener("DOMContentLoaded", function () {
    const topPath = window.top.location.pathname.split('/').pop();
    const topPageName = topPath ? topPath.split('.')[0] : "index";

    // For top level html files
    
    const themeCSS = window.top.document.getElementById(`${topPageName}CSS`);
    const themeDarkCSS = window.top.document.getElementById(`${topPageName}DarkCSS`);

    if (!themeCSS || !themeDarkCSS) {
        console.warn(`Theme CSS elements for ${topPageName} not found. Skipping theme initialization.`);
        return
    }

    const darkButton = document.getElementById("darkModeSwitch");
    const lightButton = document.getElementById("lightModeSwitch");

    function applyInitialTheme() {
        const darkThemeEnabled = localStorage.getItem('darkTheme') === 'true';

        if (darkThemeEnabled) {
            themeCSS.disabled = true;
            themeDarkCSS.disabled = false;
            if (darkButton) darkButton.disabled = true;
            if (lightButton) lightButton.disabled = false;
        } else {
            themeCSS.disabled = false;
            themeDarkCSS.disabled = true;
            if (lightButton) lightButton.disabled = true;
        }
    }

    function applyTheme(theme) {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.getElementById('progress');

        if (loadingScreen && progressBar) {
            loadingScreen.classList.remove('hidden');
            let progress = 0;
            const loadingInterval = setInterval(() => {
                if (progress < 100) {
                    progress += 3;
                    progressBar.style.width = progress + '%';
                } else {
                    clearInterval(loadingInterval);
                    loadingScreen.classList.add('hidden');
                    setTheme(theme);
                }
            }, 100);
        } else {
            setTheme(theme);
        }
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            themeDarkCSS.disabled = false;
            themeCSS.disabled = true;
            localStorage.setItem('darkTheme', 'true');
            if (darkButton) darkButton.disabled = true;
            if (lightButton) lightButton.disabled = false;
        } else {
            themeCSS.disabled = false;
            themeDarkCSS.disabled = true;
            localStorage.setItem('darkTheme', 'false');
            if (darkButton) darkButton.disabled = false;
            if (lightButton) lightButton.disabled = true;
        }
    }

    if (darkButton) {
        darkButton.addEventListener("click", function () {
            if (themeDarkCSS.disabled) {
                applyTheme('dark');
            }
        });
    }

    if (lightButton) {
        lightButton.addEventListener("click", function () {
            applyTheme('light');
        });
    }

    applyInitialTheme();
});
