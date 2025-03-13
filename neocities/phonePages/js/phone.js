document.addEventListener('DOMContentLoaded', function () {
    // ~ Onboarding
    const phoneScreen = document.getElementById('phoneScreen');
    const homeButton = document.getElementById('homeButton');

    if (!phoneScreen) {
        return;
    }

    let startupFlag = sessionStorage.getItem('startedUp') === 'true';

    const defaultSrc = phoneScreen.getAttribute('src');

    if (!startupFlag) {
        phoneScreen.src = 'startup.html';
        homeButton.classList.add('disabled');
        homeButton.style.pointerEvents = 'none';

        sessionStorage.setItem('startedUp', 'true');

        setTimeout(() => {
            if (defaultSrc && defaultSrc !== 'startup.html') {
                phoneScreen.src = defaultSrc;
            } else if (localStorage.getItem('userName') && localStorage.getItem('selectedIcon')) {
                phoneScreen.src = 'homepage.html';
            } else {
                phoneScreen.src = 'onboarding.html';
            }
            updateHomeButtonState();
        }, 5000);
    } else {
        if (defaultSrc && defaultSrc !== 'startup.html') {
            phoneScreen.src = defaultSrc;
        } else if (localStorage.getItem('userName') && localStorage.getItem('selectedIcon')) {
            phoneScreen.src = 'homepage.html';
        } else {
            phoneScreen.src = 'onboarding.html';
        }
    }

    function updateHomeButtonState() {
        if (phoneScreen.src.includes('onboarding.html') || phoneScreen.src.includes('startup.html')) {
            homeButton.classList.add('disabled');
            homeButton.style.pointerEvents = 'none';
        } else {
            homeButton.classList.remove('disabled');
            homeButton.style.pointerEvents = 'auto';
        }
    }

    phoneScreen.addEventListener('load', updateHomeButtonState);
});

document.addEventListener('DOMContentLoaded', function () {
    // ~ Clock
    function updateTime() {
        const timeDisplay = document.getElementById('time');
        if (!timeDisplay) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    }

    setInterval(updateTime);

    // ~ Themeswitcher
    fetch('/phonePages/js/themeSwitcher/themes.json')
        .then(response => response.json())
        .then(data => {
            const savedTheme = localStorage.getItem("globalTheme") || "light";
            const themeData = findValidTheme(savedTheme, data);
            applyTheme(themeData, data);
        })
        .catch(err => {
            console.error("Failed to load themes.json:", err);
        });

    function findValidTheme(themeMode, themesData) {
        let themeData = themesData.find(t => t.mode === themeMode);

        if (!themeData) {
            console.warn(`Theme '${themeMode}' not found. Falling back.`);
            themeData = themesData.find(t => t.mode === "light") || { mode: "light", style: "light" };
        }

        return themeData;
    }

    function applyTheme(themeData, themesData) {
        const pageName = getPageName();
        const themeLinks = [...document.querySelectorAll(`link[id^="${pageName}"]`)];

        const themeId = `${pageName}${capitalize(themeData.mode)}CSS`;
        const fallbackTheme = themesData.find(t => t.mode === themeData.fallback) || null;
        const fallbackThemeId = fallbackTheme ? `${pageName}${capitalize(fallbackTheme.mode)}CSS` : null;

        themeLinks.forEach(link => {
            link.disabled = !(link.id === themeId || (fallbackThemeId && link.id === fallbackThemeId));
        });

        document.body.classList.toggle("dark", themeData.style === "dark");
    }

    function getPageName() {
        const topPath = window.location.pathname.split('/').pop();
        return topPath ? topPath.split('.')[0] : "index";
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

});

document.addEventListener('DOMContentLoaded', function () {
    // ~ Weather
    const weatherData = {
        summer: {
            weatherIcons: [
                { icon: "mdi:weather-sunny", temperatureRange: [70, 90], color: "yellow" },
                { icon: "fluent:weather-partly-cloudy-day-48-filled", temperatureRange: [65, 85], color: "lightyellow" },
                { icon: "ion:cloudy", temperatureRange: [60, 80], color: "gray" },
                { icon: "mdi:weather-rainy", temperatureRange: [60, 75], color: "blue" },
                { icon: "mdi:weather-windy", temperatureRange: [60, 80], color: "lightblue" }
            ]
        },
        winter: {
            weatherIcons: [
                { icon: "solar:snowflake-bold", temperatureRange: [20, 35], color: "lightblue" },
                { icon: "mdi:weather-windy", temperatureRange: [30, 40], color: "gray" },
                { icon: "mi:fog", temperatureRange: [10, 30], color: "lightgray" },
                { icon: "ion:cloudy", temperatureRange: [10, 20], color: "gray" },
                { icon: "mingcute:snowstorm-line", temperatureRange: [-10, 20], color: "white" }
            ]
        },
        fall: {
            weatherIcons: [
                { icon: "mdi:weather-sunny", temperatureRange: [50, 60], color: "yellow" },
                { icon: "fluent:weather-partly-cloudy-day-48-filled", temperatureRange: [50, 60], color: "lightyellow" },
                { icon: "mdi:weather-windy", temperatureRange: [30, 40], color: "lightgray" },
                { icon: "ion:cloudy", temperatureRange: [45, 55], color: "gray" },
                { icon: "mdi:weather-rainy", temperatureRange: [45, 55], color: "blue" },
                { icon: "mi:fog", temperatureRange: [45, 55], color: "lightgray" }
            ]
        },
        spring: {
            weatherIcons: [
                { icon: "mdi:weather-sunny", temperatureRange: [60, 80], color: "yellow" },
                { icon: "fluent:weather-partly-cloudy-day-48-filled", temperatureRange: [65, 75], color: "lightyellow" },
                { icon: "ion:cloudy", temperatureRange: [55, 70], color: "gray" },
                { icon: "mdi:weather-windy", temperatureRange: [50, 65], color: "lightblue" },
                { icon: "mdi:weather-rainy", temperatureRange: [45, 55], color: "blue" },
                { icon: "mdi:weather-hail", temperatureRange: [40, 55], color: "white" }
            ]
        }
    };

    let currentSeason = "winter"; // Change this as needed
    let forecastData = generateForecastData();

    // Function to generate random weather icon and temperature for the season
    function getRandomWeatherForSeason() {
        const weatherIcons = weatherData[currentSeason].weatherIcons;
        const randomWeather = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
        const temperature = getRandomTemperature(randomWeather.temperatureRange);
        return { icon: randomWeather.icon, color: randomWeather.color, temperature };
    }

    // Generate weekly forecast
    function generateForecastData() {
        const forecast = [];
        for (let i = 0; i < 7; i++) {
            const weather = getRandomWeatherForSeason();
            forecast.push({ ...weather, day: `Day ${i + 1}` });
        }
        return forecast;
    }

    // Generate random temperature based on the given range
    function getRandomTemperature([min, max]) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function saveForecastToSession() {
        sessionStorage.setItem("forecastData", JSON.stringify(forecastData));
        sessionStorage.setItem("currentSeason", currentSeason);
    }

    // Load data from sessionStorage
    function loadForecastFromSession() {
        const savedForecast = sessionStorage.getItem("forecastData");
        const savedSeason = sessionStorage.getItem("currentSeason");

        if (savedForecast && savedSeason) {
            forecastData = JSON.parse(savedForecast);
            currentSeason = savedSeason;
        } else {
            forecastData = generateForecastData();
            saveForecastToSession();
        }
    }

    // Display current weather and weekly forecast
    function displayWeather() {
        const currentWeather = forecastData[0];
        const currentWeatherIcon = document.getElementById("currentWeatherIcon");
        const currentTemperature = document.getElementById("currentTemperature");

        if (currentWeatherIcon) {
            currentWeatherIcon.innerHTML = `<iconify-icon icon="${currentWeather.icon}" style="color: ${currentWeather.color};"></iconify-icon>`;
        }
        if (currentTemperature) {
            currentTemperature.textContent = `${currentWeather.temperature}°F`;
        }

        const forecastContainer = document.getElementById("forecastContainer");
        if (forecastContainer) {
            forecastContainer.innerHTML = "";
            forecastData.forEach(day => {
                const dayElement = document.createElement("div");
                dayElement.className = "forecastItem";
                dayElement.innerHTML = `
                    <div><iconify-icon icon="${day.icon}" style="color: ${day.color};"></iconify-icon></div>
                `;
                forecastContainer.appendChild(dayElement);
            });
        }
    }

    // Initial setup
    loadForecastFromSession();
    displayWeather();

    // Update the weather every 10 minutes
    setInterval(() => {
        forecastData = generateForecastData();
        saveForecastToSession();
        displayWeather();
    }, 600000); // 10 minutes = 600000ms
});

// ~ Homepage button

function homeButton() {
    const iframe = document.getElementById('phoneScreen');
    const iframeWindow = iframe.contentWindow;
    const activeApps = iframeWindow.document.querySelectorAll('.app.open');

    activeApps.forEach(app => {
        iframeWindow.closeApp(app);
    });

    iframe.src = "homepage.html";
}