// ? Tablet!

document.addEventListener('DOMContentLoaded', () => {
    if (savedTheme === "dark") {
        tablet.classList.add('dark');
    }
    preloadAudio();
})

const tablet = document.getElementById('sciFiTablet');

// ~ Main
const mainContent = document.querySelector('#tabletMain .content');
const mainDetails = document.querySelector('#tabletMain .details');

const planetName = document.getElementById('planetName');
const planetPreview = document.getElementById('planetPreview');
const planetDescription = document.getElementById('planetDescription');
const seeMore = document.getElementById('seeMore');

// ~ Hud Buttons

const hudButtons = document.querySelectorAll('#hudButtons button');

// ~ Aside
const tabletAside = document.getElementById('tabletAside');
const asideContent = document.querySelector('#tabletAside .content');
const asideDetails = document.querySelector('#tabletAside .details');
const asideH2 = document.querySelector('#tabletAside h2');

// ~ Settings Buttons
const settingsButtons = document.querySelectorAll('.settingsButton');
const darkMode = document.getElementById('darkMode');
const random = document.getElementById('random');
const discardTrash = document.getElementById('discardTrash');
const party = document.getElementById('party');


// ~ Other
const tabletBranding = document.getElementById('tabletBranding');
const closeTablet = document.getElementById('closeTablet');

const savedTheme = localStorage.getItem("globalTheme") || "light";


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
    hide: {
        url: 'https://files.catbox.moe/pfbhla.mp3',
        volume: 0.5,
    },
    settingsButtonHover: {
        url: 'https://files.catbox.moe/hxtary.mp3',
        volume: 0.2,
    },
    settingsButtonClick: {
        url: 'https://files.catbox.moe/mp2g59.mp3',
        volume: 0.2,
    },
    hudButtonClick: {
        url: 'https://files.catbox.moe/w5g5px.mp3',
        volume: 0.2
    },
    crashed: {
        url: 'https://files.catbox.moe/z2duk1.mp3',
        volume: 0.4,
    },

    setVolume: function (volumeLevel, soundKey = null) {
        volumeLevel = Math.min(Math.max(volumeLevel, 0), 1); // ~ Volume Clamp

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

const planets = [
    {
        id: "sun",
        name: "Severance Solar System",
        image: "https://placehold.co/150x220/00ffcc/white",
        description: "The Severance Solar System is a massively populated system of 27 different planets, most notably Eartha Major, Koa, Bellavue, and the titular planet of Severance, the hub. It has existed for trillions of years, and hosts most of the universe's population as a result. What happens in this system has an effect on almost every other paracosm in existence.",
        link: "#"
    },
    {
        id: "severance",
        name: "Severance",
        image: "https://placehold.co/150x220/00ffcc/white",
        description: "Severance is the largest planet in the Severance solar system, boasting a massive 1.4 Quadrillion individual population, as well as the Queen. It controls nearly all technological advancements and has the deepest connection with the Gods because of the Queen's residence. Severance is extremely progressive overall and is entirely intolerant of any conservative belief sets.",
        link: "#"
    },
    {
        id: "earthaMajor",
        name: "Eartha Major",
        image: "https://placehold.co/150x220/00ffcc/white",
        description: `After the 'Big Bang' as we know it, 2 planets with very similar structure formed, albeit different sizes. These planets became known as Eartha Minor (our planet), and Eartha Major. 
        <br>
        Eartha Major has become a massive industrial hub in the Severance solar system, as well as a major political power. It takes care of almost all intergalactic affairs and is responsible for almost all manufacturing of space-centric machinery, such as spaceships, spacesuits, and weaponry.
        <br>
        Eartha Major is known for it's violent nature and patriotism, and is not afraid to discard anything they view as unnecessary, or a hinderance. `,
        link: "#"
    },
    {
        id: "koa",
        name: "Koa",
        image: "https://placehold.co/150x220/00ffcc/white",
        description: "Koa is an extremely territorial and militarist planet. Notably, it is entirely run by women. It is heavily guarded and the population is extremely prejudiced. While the planet is still liable to following the rules of the hub planet, there are many structural changes and any rules that Severance is lenient about are most likely modified on this planet.",
        link: "#"
    },
    {
        id: "bellavue",
        name: "Bellavue",
        image: "https://placehold.co/150x220/00ffcc/white",
        description: `Bellavue is a feminist, women-ran planet known for it's pink and hyperfeminine environment. Reminiscent of Barbie World, the architecture is very modern and colorful with cartoony motifs. The planet boasts a smaller population than most planets (10.2 billion), but it is a major tourist location for people from Eartha Major and other unnamed planets. 
        <br> 
        It may not look like it, but this planet is twice the size of Eartha Minor!`,
        link: "#"
    }
];

// & Helper Functions

const preloadedAudio = {};

function preloadAudio() {
    for (const soundKey in sounds) {
        if (sounds[soundKey].url) {
            const audio = new Audio(sounds[soundKey].url);
            audio.volume = sounds[soundKey].volume;
            preloadedAudio[soundKey] = audio;
        }
    }
}

function playPreloadedAudio(soundKey) {
    if (preloadedAudio[soundKey]) {
        preloadedAudio[soundKey].currentTime = 0;
        preloadedAudio[soundKey].play();
    }
}
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

function resetAnimation(element, animationClass) {
    if (!element) return;

    element.classList.remove(animationClass);
    element.offsetHeight;
    element.classList.add(animationClass);
}

function audioAndAnimations(element, animationClass, delay = 0, soundKey = null) {
    if (!element) return;

    setTimeout(() => {
        if (soundKey && preloadedAudio[soundKey]) {
            const originalAudio = preloadedAudio[soundKey];
            const soundInstance = originalAudio.cloneNode();
            soundInstance.volume = originalAudio.volume;
            soundInstance.play();
        }
        resetAnimation(element, animationClass);
    }, delay);
}

function resetTablet() {
    const classGroups = [
        // ? Shown States
        {
            elements: [tablet, tabletBranding, mainContent, mainDetails, planetName, planetPreview, planetDescription, seeMore, tabletAside, asideContent, asideDetails],
            classes: ['tabletShow', 'brandingShow', 'powerOn', 'fadeIn', 'asideShow'],
        },
        // ? Hidden States
        {
            elements: [tabletBranding, mainContent, mainDetails, planetName, planetPreview, planetDescription, seeMore, tabletAside, asideContent, asideDetails, asideH2],
            classes: ['brandingHide', 'fadeOut', 'asideHide'],
        },
        // ? Other
        {
            elements: [tablet],
            classes: ['errorScreen'],
        },
    ];

    classGroups.forEach(({ elements, classes }) => {
        elements.forEach((el) => {
            if (el) classes.forEach((cls) => el.classList.remove(cls));
        });
    });

    settingsButtons.forEach((button) => {
        button.classList.remove('fadeIn', 'fadeOut');
    });
}

// & Main Functions

function showTablet() {
    if (isAnimating) return;
    isAnimating = true;
    disablePlanetLinks();

    tablet.classList.remove('tabletHide');
    audioAndAnimations(tablet, 'tabletShow', 0, 'show');
    audioAndAnimations(tabletBranding, 'brandingShow', 1000, 'brandingSlide');
    audioAndAnimations(tabletAside, 'asideShow', 1300, 'asideSlide');
    audioAndAnimations(mainContent, 'powerOn', 2500);
    audioAndAnimations(mainDetails, 'fadeIn', 2700);
    audioAndAnimations(planetName, 'fadeIn', 3000, 'fadeIn');
    audioAndAnimations(planetPreview, 'fadeIn', 3100, 'fadeIn');
    audioAndAnimations(planetDescription, 'fadeIn', 3300, 'fadeIn');
    audioAndAnimations(seeMore, 'fadeIn', 3350, 'fadeIn');
    audioAndAnimations(asideContent, 'powerOn', 3400);
    audioAndAnimations(asideH2, 'fadeIn', 3450, 'fadeIn');
    audioAndAnimations(asideDetails, 'powerOn', 3500);

    settingsButtons.forEach((button, index) => {
        audioAndAnimations(button, 'fadeIn', 3550 + index * 100);
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

    audioAndAnimations(tablet, 'tabletHide', 3000, 'hide');
    audioAndAnimations(tabletBranding, 'brandingHide', 2600, 'brandingSlide');
    audioAndAnimations(mainContent, 'fadeOut', 2300);
    audioAndAnimations(mainDetails, 'fadeOut', 1800);
    audioAndAnimations(planetPreview, 'fadeOut', 1700);
    audioAndAnimations(planetName, 'fadeOut', 1600);
    audioAndAnimations(planetDescription, 'fadeOut', 1400);
    audioAndAnimations(seeMore, 'fadeOut', 1300);
    audioAndAnimations(tabletAside, 'asideHide', 1400, 'asideSlide');
    audioAndAnimations(asideContent, 'fadeOut', 1200);
    audioAndAnimations(asideDetails, 'fadeOut', 1200);
    audioAndAnimations(asideH2, 'fadeOut', 1000);

    settingsButtons.forEach((button, index) => {
        audioAndAnimations(button, 'fadeOut', 400 - index * 100);
    });

    setTimeout(() => {
        isAnimating = false;
        enablePlanetLinks();
        resetTablet()
    }, 4000);
}

// & Event listeners
document.querySelectorAll('.planet').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const planetId = link.id;
        const planetData = planets.find(planet => planet.id === planetId);

        if (planetData) {
            const { name, image, description, link } = planetData;

            if (tablet.classList.contains('tabletShow')) {
                planetName.textContent = name;
                planetPreview.src = image;
                planetDescription.innerHTML = description;
                seeMore.href = link;
            } else {
                planetName.textContent = name;
                planetPreview.src = image;
                planetDescription.innerHTML = description;
                seeMore.href = link;
                showTablet();
            }
        } else {
            console.error(`No info found for: ${planetId}`);
        }
    });
});

// ~ Settings Buttons

settingsButtons.forEach(settingsButton => {
    settingsButton.addEventListener('mouseenter', () => {
        playPreloadedAudio('settingsButtonHover');
    });
    settingsButton.addEventListener('click', () => {
        playPreloadedAudio('settingsButtonClick');
    });
});

// ~ Dark Mode Toggle
darkMode.addEventListener('click', () => {
    tablet.classList.toggle('dark');
});


// ~ Random Planet

random.addEventListener('click', () => {
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    planetName.textContent = randomPlanet.name;
    planetPreview.src = randomPlanet.image;
    planetDescription.innerHTML = randomPlanet.description;
});

// ~ Party Button

let partyToggleCount = 0;
let partyTimeout;

party.addEventListener('click', () => {
    tablet.classList.toggle('party');

    partyToggleCount++;
    clearTimeout(partyTimeout);

    partyTimeout = setTimeout(() => {
        partyToggleCount = 0;
    }, 5000);

    if (partyToggleCount >= 5) {
        triggerCrash();
    }
});


// ~ Hud Buttons

let hudClickCount = 0;
let hudClickTimeout;

hudButtons.forEach(button => {
    button.addEventListener('click', () => {
        playPreloadedAudio('hudButtonClick');
        hudClickCount++;
        clearTimeout(hudClickTimeout);

        hudClickTimeout = setTimeout(() => {
            hudClickCount = 0;
        }, 2000);

        if (hudClickCount >= 10) {
            triggerCrash();
        }
    });
});

// ! Crash that shit!

let crashSequence = ['darkMode', 'random', 'party', 'closeTablet'];
let inputSequence = [];

document.addEventListener('click', (event) => {
    if (event.target.id) {
        inputSequence.push(event.target.id);
        if (inputSequence.join(',') === crashSequence.join(',')) {
            triggerCrash();
        }
        if (inputSequence.length > crashSequence.length) {
            inputSequence.shift();
        }
    }
});

function triggerCrash() {
    isAnimating = true;
    disablePlanetLinks();

    const crashOverlay = document.querySelectorAll('.crashOverlay');
    tablet.classList.add('errorScreen');

    crashOverlay.forEach(overlay => { 
        overlay.classList.add('active');
    });

    playPreloadedAudio('crashed');

    const glitchTextElement = document.querySelector('.crashOverlay .glitch-text');
    const originalText = glitchTextElement.getAttribute('data-text');
    const maxDuration = 5000;

    const randomizeText = (element, originalText, maxDuration) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        const textLength = originalText.length;
        let progress = 0;

        let randomizedText = Array.from({ length: textLength }, () => randomChar(chars)).join('');
        element.textContent = randomizedText;

        const interval = setInterval(() => {
            let newText = '';
            progress++;

            for (let i = 0; i < textLength; i++) {
                if (Math.random() < 0.1 || originalText[i] === randomizedText[i]) {
                    newText += originalText[i];
                } else {
                    newText += randomChar(chars);
                }
            }

            element.textContent = newText;

            if (progress * 100 > maxDuration) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 10);
    };

    const randomChar = (chars) => {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    };

    randomizeText(glitchTextElement, originalText, maxDuration);

    setTimeout(() => {
        tablet.classList.add('tabletHide');
        isAnimating = false;
        enablePlanetLinks();
        getAchievement("general", "crash");

        setTimeout(() => {
            crashOverlay.forEach(overlay => { 
                overlay.classList.remove('active');
            });
            resetTablet();
        }, 1000);
    }, 5000); 
}

// ! Close Tablet

closeTablet.addEventListener('click', () => {
    hideTablet();
});