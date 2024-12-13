var userName = localStorage.getItem("userName") || "Anon";
var selectedIcon = localStorage.getItem("selectedIcon") || "/Assets/other/anonIcon.jpg";

var selectedMoodEmoji = document.getElementById("selectedMoodEmoji");
var moodButtons = document.querySelectorAll("#moodButtons button");
var currentMood = document.getElementById("currentMood");

var savedMood = localStorage.getItem('userCurrentMood') || "Cheerful";
var savedMoji = localStorage.getItem('userCurrentMoji') || "/Assets/other/mellowIcons/emoji/Cheerful.png";

// & EventListeners and Updates
document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('appContext', 'Mellow');
    
    document.getElementById("user").textContent = `${userName}`;
    document.getElementById("userIcon").src = selectedIcon;

    updateLogNote();
    updateMoodDisplay();

    moodButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            var moodMoji = e.currentTarget.querySelector('img').src;
            var mood = e.currentTarget.id;
            selectMood(moodMoji, mood);
        });
    });

});

// & Select Mood
function selectMood(moodMoji, mood) {
    var cMood = mood.charAt(0).toUpperCase() + mood.slice(1);
    localStorage.setItem('userCurrentMood', cMood);
    localStorage.setItem('userCurrentMoji', moodMoji);
    savedMood = cMood;
    savedMoji = moodMoji;

    // Update UI
    selectedMoodEmoji.src = moodMoji;
    currentMood.textContent = cMood;

    updateMoodDisplay();
    updateLogNote();
    showPopover();
}

function updateMoodDisplay() {
    savedMood = localStorage.getItem('userCurrentMood') || "Cheerful";
    savedMoji = localStorage.getItem('userCurrentMoji') || "/Assets/other/mellowIcons/emoji/Cheerful.png";

    selectedMoodEmoji.src = savedMoji;
    currentMood.textContent = savedMood;
}

// & Popover

const popover = document.getElementById("popover");

function showPopover() {
    popover.classList.remove("hide");
    popover.style.display = "block";
}

// ! Exit
const exitButton = document.getElementById("exit");
exitButton.addEventListener("click", () => {
    popover.classList.add("hide");
    setTimeout(() => {
        popover.style.display = "none";
    }, 300);
});

function updateLogNote() {
    const emotion = localStorage.getItem('userCurrentMood') || "cheerful";
    const logNote = document.getElementById("logNote");

    const goodEmotions = ["Cheerful", "Happy", "Calm", "Focused", "Loved"];
    const badEmotions = ["Sad", "Depressed", "Frustrated", "Anxious", "Annoyed", "Angry"];

    if (goodEmotions.includes(emotion)) {
        logNote.innerHTML = `I'm happy to hear that you're feeling <span id="emotion">${emotion.toLowerCase()}</span>!`;
    } else if (badEmotions.includes(emotion)) {
        logNote.innerHTML = `I'm sorry to hear that you're feeling <span id="emotion">${emotion.toLowerCase()}</span>.`;
    } else {
        logNote.innerHTML = `You're currently feeling <span id="emotion">${emotion.toLowerCase()}</span>.`;
    }
}


// & Breathing Exercises

document.addEventListener('DOMContentLoaded', () => {
    const landscape = document.getElementById('landscape');

    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');

    const sky = document.getElementById('sky');
    const mountains = document.getElementById('mountains');
    const horizon = document.getElementById('horizon');
    const colorOverlay = document.getElementById('colorOverlay');
    const reflection = document.getElementById('reflection');

    const BEtext = document.getElementById('BEtext');

    let cycleTimeouts = []; // Store timeouts for cleanup

    const sunDuration = 15000;
    const moonDuration = 15000; // Must be seperate!

    function updateText(phase) {
        switch (phase) {
            case 'breatheIn':
                BEtext.textContent = 'Breathe In';
                break;
            case 'hold':
                BEtext.textContent = 'Hold It';
                break;
            case 'breatheOut':
                BEtext.textContent = 'Breathe Out';
                break;
            default:
                BEtext.textContent = 'Let\'s take a breather';
        }
    }

    function textCycle() {
        updateText('breatheIn');
        cycleTimeouts.push(setTimeout(() => updateText('hold'), 3000));
        cycleTimeouts.push(setTimeout(() => updateText('breatheOut'), 6500));
        cycleTimeouts.push(setTimeout(() => updateText('hold'), 12000));
    }

    function startSunCycle() {
        sun.style.animation = 'none';
        void sun.offsetWidth; // Trigger reflow
        sun.style.animation = 'sunCycle 13s forwards';

        sky.classList.remove('nightCycle');
        mountains.classList.remove('nightCycle');
        colorOverlay.classList.remove('nightCycle');
        horizon.classList.remove('saturated');

        sky.classList.add('dayCycle');
        mountains.classList.add('dayCycle');
        colorOverlay.classList.add('dayCycle');
        horizon.classList.add('cycle');

        // console.log('Sun Cycle');

        textCycle();

        cycleTimeouts.push(setTimeout(() => {
            startMoonCycle();
        }, sunDuration));
    }

    function startMoonCycle() {
        moon.style.animation = 'none';
        void moon.offsetWidth; // Trigger reflow
        moon.style.animation = 'moonCycle 13s forwards';

        sky.classList.remove('dayCycle');
        mountains.classList.remove('dayCycle');
        colorOverlay.classList.remove('dayCycle');
        horizon.classList.remove('cycle');

        sky.classList.add('nightCycle');
        mountains.classList.add('nightCycle');
        colorOverlay.classList.add('nightCycle');
        horizon.classList.add('saturated');


        // console.log('Moon Cycle');

        textCycle();

        cycleTimeouts.push(setTimeout(() => {
            startSunCycle();
        }, moonDuration));
    }

    function startBreathingCycle(isFirstCycle = true) {
        BEtext.style.fontSize = '4em';
        if (isFirstCycle) {
            sun.style.animation = 'sunCycleStart 13s forwards';
            sky.classList.add('dayCycle');
            mountains.classList.add('dayCycle');
            colorOverlay.classList.add('dayCycle');
            reflection.classList.add('cycle');
            horizon.classList.add('cycle');

            // console.log('Starting Sun Cycle');

            textCycle();

            cycleTimeouts.push(setTimeout(() => {
                startMoonCycle();
            }, sunDuration));
        } else {
            startSunCycle();
        }
    }

    function stopBreathingCycle() {
        cycleTimeouts.forEach(timeout => clearTimeout(timeout));
        cycleTimeouts = [];
        sun.style.animation = 'none';
        moon.style.animation = 'none';

        sky.classList.remove('dayCycle');
        sky.classList.remove('nightCycle');

        mountains.classList.remove('dayCycle');
        mountains.classList.remove('nightCycle');

        colorOverlay.classList.remove('dayCycle');
        colorOverlay.classList.remove('nightCycle');

        reflection.classList.remove('cycle');
        horizon.classList.remove('cycle');
        horizon.classList.remove('saturated');

        updateText('');
        // console.log('Stopped Cycle');
    }

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                BEtext.style.fontSize = '3em';
                setTimeout(() => {
                    startBreathingCycle(true);
                }, 4000);

            } else {
                stopBreathingCycle();
            }
        });
    }, { threshold: 1 });

    observer.observe(landscape);
});

// & Tabs System
const tabs = document.querySelectorAll('nav button');
const tabContents = document.querySelectorAll('.tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        const targetTab = tab.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
    });
});