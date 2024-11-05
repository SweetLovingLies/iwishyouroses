document.addEventListener("DOMContentLoaded", function () {
    const indexCSS = window.top.document.getElementById("indexCSS");
    const indexDarkCSS = window.top.document.getElementById("indexDarkCSS");

    const darkButton = document.getElementById("darkModeSwitch");
    const lightButton = document.getElementById("lightModeSwitch");

    function applyInitialTheme() {
        const darkThemeEnabled = localStorage.getItem('darkTheme') === 'true';

        if (darkThemeEnabled) {
            indexCSS.disabled = true;
            indexDarkCSS.disabled = false;
        } else {
            indexCSS.disabled = false;
            indexDarkCSS.disabled = true;

            if (lightButton) {
                lightButton.disabled = true;
            }
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
            indexDarkCSS.disabled = false;
            indexCSS.disabled = true;
            localStorage.setItem('darkTheme', 'true');

            if (darkButton) darkButton.disabled = true;
            if (lightButton) lightButton.disabled = false;
        } else {
            indexCSS.disabled = false;
            indexDarkCSS.disabled = true;
            localStorage.setItem('darkTheme', 'false');

            if (darkButton) darkButton.disabled = false;
            if (lightButton) lightButton.disabled = true;
        }
    }

    if (darkButton) {
        darkButton.addEventListener("click", function () {
            if (indexDarkCSS.disabled) {
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
