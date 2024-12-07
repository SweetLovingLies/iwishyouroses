document.addEventListener('DOMContentLoaded', function () {

    // Clock
    function updateTime() {
        const timeDisplay = document.getElementById('time');
        if (!timeDisplay) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    }

    setInterval(updateTime);

    // Weather

    const weatherData = {
        summer: {
            weatherIcons: [
                { icon: "mdi:weather-sunny", temperatureRange: [70, 90] },
                { icon: "fluent:weather-partly-cloudy-day-48-filled", temperatureRange: [65, 85] },
                { icon: "ion:cloudy", temperatureRange: [60, 80] },
                { icon: "mdi:weather-rainy", temperatureRange: [60, 75] },
                { icon: "mdi:weather-windy", temperatureRange: [60, 80] }
            ]
        },
        winter: {
            weatherIcons: [
                { icon: "solar:snowflake-bold", temperatureRange: [20, 35] },
                { icon: "mdi:weather-windy", temperatureRange: [30, 40] },
                { icon: "mi:fog", temperatureRange: [10, 30] },
                { icon: "ion:cloudy", temperatureRange: [10, 20] },
                { icon: "mingcute:snowstorm-line", temperatureRange: [-10, 20] }
            ]
        },
        fall: {
            weatherIcons: [
                { icon: "mdi:weather-sunny", temperatureRange: [50, 60] },
                { icon: "fluent:weather-partly-cloudy-day-48-filled", temperatureRange: [50, 60] },
                { icon: "mdi:weather-windy", temperatureRange: [30, 40] },
                { icon: "ion:cloudy", temperatureRange: [45, 55] },
                { icon: "mdi:weather-rainy", temperatureRange: [45, 55] },
                { icon: "mi:fog", temperatureRange: [45, 55] }
            ]
        },
        spring: {
            weatherIcons: [
                { icon: "mdi:weather-sunny", temperatureRange: [60, 80] },
                { icon: "fluent:weather-partly-cloudy-day-48-filled", temperatureRange: [65, 75] },
                { icon: "ion:cloudy", temperatureRange: [55, 70] },
                { icon: "mdi:weather-windy", temperatureRange: [50, 65] },
                { icon: "mdi:weather-rainy", temperatureRange: [45, 55] },
                { icon: "mdi:weather-hail", temperatureRange: [40, 55] }
            ]
        }
    };

    let currentSeason = 'winter';
    let forecastIcons = generateWeeklyForecast();
    loadWeatherDataFromSession();

    function getRandomWeatherIcon() {
        const weatherOptions = weatherData[currentSeason].weatherIcons;
        const randomIndex = Math.floor(Math.random() * weatherOptions.length);
        return weatherOptions[randomIndex];
    }

    function generateWeeklyForecast() {
        const forecast = [];
        for (let i = 0; i < 7; i++) {
            forecast.push(getRandomWeatherIcon());
        }
        return forecast;
    }


    function displayForecast(forecast) {
        const forecastContainer = document.getElementById('forecastContainer');
        if (forecastContainer) {
            forecastContainer.innerHTML = '';

            forecast.forEach((day) => {
                const dayIcon = document.createElement('div');
                dayIcon.className = 'forecastIcon';
                dayIcon.innerHTML = `<iconify-icon icon="${day.icon}"></iconify-icon>`;
                forecastContainer.appendChild(dayIcon);
            });
        }
    }

    function updateWeather() {
        const weatherIconElements = document.querySelectorAll(".weatherIcon iconify-icon");

        const todayWeather = forecastIcons.shift(); // Shift allows us to get the first icon and move the array "forward"
        const todayTemp = getTemperature(todayWeather.temperatureRange); // Get the temperature based on range

        const wwTempElement = document.getElementById("wwTemp");

        if (wwTempElement) {
            wwTempElement.textContent = `${todayTemp}°F`;
        }


        weatherIconElements.forEach(icon => {
            icon.setAttribute("icon", todayWeather.icon);

            icon.classList.remove("sunny", "cloudy", "rainy", "snow", "wind", "hail", "fog");

            switch (true) {
                case todayWeather.icon.includes("sun"):
                    icon.classList.add("sunny");
                    break;
                case todayWeather.icon.includes("cloudy"):
                    icon.classList.add("cloudy");
                    break;
                case todayWeather.icon.includes("rain"):
                    icon.classList.add("rainy");
                    break;
                case todayWeather.icon.includes("snow"):
                    icon.classList.add("snow");
                    break;
                case todayWeather.icon.includes("wind"):
                    icon.classList.add("wind");
                    break;
                case todayWeather.icon.includes("hail"):
                    icon.classList.add("hail");
                    break;
                case todayWeather.icon.includes("fog"):
                    icon.classList.add("fog");
                    break;
                case todayWeather.icon.includes("snowstorm"):
                    icon.classList.add("snowstorm");
                    break;
                default:
                    console.warn("Weather condition not recognized");
            }
        });

        const newWeatherIcon = getRandomWeatherIcon();
        forecastIcons.push(newWeatherIcon);

        displayForecast(forecastIcons);
    }

    function getTemperature(range) {
        const [min, max] = range;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function saveWeatherDataToSession() {
        sessionStorage.setItem('forecastIcons', JSON.stringify(forecastIcons));
        sessionStorage.setItem('currentSeason', currentSeason);
    }

    function loadWeatherDataFromSession() {
        const savedForecast = sessionStorage.getItem('forecastIcons');
        const savedSeason = sessionStorage.getItem('currentSeason');

        if (savedForecast && savedSeason) {
            forecastIcons = JSON.parse(savedForecast);
            currentSeason = savedSeason;
        } else {
            forecastIcons = generateWeeklyForecast();
        }
    }

    displayForecast(forecastIcons);
    saveWeatherDataToSession();

    setInterval(() => {
        updateWeather();
        saveWeatherDataToSession();
    }, 3600000); // 1 hour = 3600000 milliseconds
    // }, 50);
});

// Homepage button

function homeButton() {
    const iframe = document.getElementById('phoneScreen');
    const iframeWindow = iframe.contentWindow;
    const activeApps = iframeWindow.document.querySelectorAll('.app.open');

    activeApps.forEach(app => {
        iframeWindow.closeApp(app);
    });

    iframe.src = "homepage.html";
}