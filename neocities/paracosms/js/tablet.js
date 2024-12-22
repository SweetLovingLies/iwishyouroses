// ? Tablet!

const tablet = document.getElementById('sciFiTablet');

// ~ Main
const mainContent = document.querySelector('#tabletMain .content');
const mainDetails = document.querySelector('#tabletMain .details');

const planetName = document.getElementById('planetName');
const planetPreview = document.getElementById('planetPreview');
const planetDescription = document.getElementById('planetDescription');
const settingsButtons = document.querySelectorAll('.settingsButton');

// ~ Aside
const tabletAside = document.getElementById('tabletAside');
const asideContent = document.querySelector('#tabletAside .content');
const asideDetails = document.querySelector('#tabletAside .details');
const asideH2 = document.querySelector('#tabletAside h2');


// ~ Other
const tabletBranding = document.getElementById('tabletBranding');
const closeTablet = document.getElementById('closeTablet');

const sounds = {
    show: {
        url: 'https://files.catbox.moe/8yzy07.mp3',
        volume: 0.5,
    },
    brandingSlide: {
        url: 'https://files.catbox.moe/b936ip.mp3',
        volume: 0.1,
    },
    asideSlide: {
        url: 'https://files.catbox.moe/zu5yvc.mp3',
        volume: 0.1,
    },
    fadeIn: {
        url: 'https://files.catbox.moe/4kjme5.mp3',
        volume: 0.1,
    },
    powerOff: {
        url: 'https://files.catbox.moe/qbwwe5.mp3',
        volume: 0.4,
    },
    hide: {
        url: 'https://files.catbox.moe/pfbhla.mp3',
        volume: 0.5,
    },

    setVolume: function (volumeLevel, soundKey = null) {
        volumeLevel = Math.min(Math.max(volumeLevel, 0), 1); // ~ Volume Clamp

        // ! Never knew how much I hated the "this" keyword until now
        if (soundKey && this[soundKey]) {
            this[soundKey].volume = volumeLevel;
        } else {
            for (const sound in this) {
                if (this[sound] instanceof Object && this[sound].url) {
                    this[sound].volume = volumeLevel;
                }
            }
        }
    },
};

// & Helper Functions

let isAnimating = false;

function disablePlanetLinks() {
    document.querySelectorAll('.planet').forEach(link => {
        link.style.pointerEvents = 'none';
    });
}

function enablePlanetLinks() {
    document.querySelectorAll('.planet').forEach(link => {
        link.style.pointerEvents = 'auto';
    });
}

function playSoundAndAnimate(element, animationClass, delay = 0, soundKey = null) {
    if (!element) return;

    setTimeout(() => {
        if (soundKey && sounds[soundKey]) {
            const soundInstance = new Audio(sounds[soundKey].url); // ~ Create audio instances dynamically
            soundInstance.volume = sounds[soundKey].volume; // ~ Volume set per sound
            soundInstance.play();
        }
        resetAnimation(element, animationClass);
    }, delay);
}

function resetAnimation(element, animationClass) {
    if (!element) return;

    // Ensure no animation classes are stacked
    element.classList.remove(animationClass);

    // Force a reflow to reset the animation
    void element.offsetWidth;

    // Re-add the animation class to trigger it
    element.classList.add(animationClass);
}

function showTablet() {
    if (isAnimating) return;
    isAnimating = true;
    disablePlanetLinks();

    tablet.classList.remove('tabletHide');
    playSoundAndAnimate(tablet, 'tabletShow', 0, 'show');
    playSoundAndAnimate(tabletBranding, 'brandingShow', 1000, 'brandingSlide');
    playSoundAndAnimate(tabletAside, 'asideShow', 1300, 'asideSlide');
    playSoundAndAnimate(mainContent, 'powerOn', 2500);
    playSoundAndAnimate(mainDetails, 'fadeIn', 2700);
    playSoundAndAnimate(planetName, 'fadeIn', 3000, 'fadeIn');
    playSoundAndAnimate(planetPreview, 'fadeIn', 3100, 'fadeIn');
    playSoundAndAnimate(planetDescription, 'fadeIn', 3300, 'fadeIn');
    playSoundAndAnimate(asideContent, 'powerOn', 3400);
    playSoundAndAnimate(asideH2, 'fadeIn', 3450, 'fadeIn');
    playSoundAndAnimate(asideDetails, 'powerOn', 3500);

    settingsButtons.forEach((button, index) => {
        playSoundAndAnimate(button, 'fadeIn', 3550 + index * 100);
    });

    setTimeout(() => {
        isAnimating = false;
        enablePlanetLinks();
    }, 4000);
}



function hideTablet() {
    if (isAnimating) return;
    isAnimating = true;

    disablePlanetLinks();

    playSoundAndAnimate(tablet, 'tabletHide', 3000, 'hide');
    playSoundAndAnimate(tabletBranding, 'brandingHide', 2600, 'brandingSlide');
    playSoundAndAnimate(mainContent, 'fadeOut', 2300);
    playSoundAndAnimate(mainDetails, 'fadeOut', 1800);
    playSoundAndAnimate(planetPreview, 'fadeOut', 1700);
    playSoundAndAnimate(planetName, 'fadeOut', 1600);
    playSoundAndAnimate(planetDescription, 'fadeOut', 1400);
    playSoundAndAnimate(tabletAside, 'asideHide', 1400, 'asideSlide');
    playSoundAndAnimate(asideContent, 'fadeOut', 1200);
    playSoundAndAnimate(asideDetails, 'fadeOut', 1200);
    playSoundAndAnimate(asideH2, 'fadeOut', 1000);

    settingsButtons.forEach((button, index) => {
        playSoundAndAnimate(button, 'fadeOut', 400 - index * 100);
    });

    setTimeout(() => {
        isAnimating = false;
        enablePlanetLinks();
        resetClasses()
    }, 4000);
}

function resetClasses() {
    // ? Can't figure out a better way to do this LOL // Remove classes after tablet hide
    // ! Shown Classes
    tablet.classList.remove('tabletShow');
    tabletBranding.classList.remove('brandingShow');
    mainContent.classList.remove('powerOn');
    mainDetails.classList.remove('fadeIn');
    planetName.classList.remove('fadeIn');
    planetPreview.classList.remove('fadeIn');
    planetDescription.classList.remove('fadeIn');

    tabletAside.classList.remove('asideShow');
    asideContent.classList.remove('powerOn');
    asideH2.classList.remove('fadeIn');
    asideDetails.classList.remove('powerOn');
    settingsButtons.forEach((button) => {
        button.classList.remove('fadeIn');
    });

    // ! Hidden Classes
    tabletBranding.classList.remove('brandingHide');
    mainContent.classList.remove('fadeOut');
    mainDetails.classList.remove('fadeOut');
    planetName.classList.remove('fadeOut');
    planetPreview.classList.remove('fadeOut');
    planetDescription.classList.remove('fadeOut');

    tabletAside.classList.remove('asideHide');
    asideContent.classList.remove('fadeOut');
    asideDetails.classList.remove('fadeOut');
    asideH2.classList.remove('fadeOut');
    settingsButtons.forEach((button) => {
        button.classList.remove('fadeOut');
    });
}

// & Event listeners
// & Event listeners
document.querySelectorAll('.planet').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const title = link.getAttribute('data-title');
        const image = link.getAttribute('data-image');
        const description = link.getAttribute('data-description');

        if (tablet.classList.contains('tabletShow')) {
            planetName.textContent = title;
            planetPreview.src = image;
            planetDescription.textContent = description;
        } else {
            planetName.textContent = title;
            planetPreview.src = image;
            planetDescription.textContent = description;
            showTablet();
        }
    });
});

closeTablet.addEventListener('click', () => {
    hideTablet();
});
