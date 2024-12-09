var userName = localStorage.getItem("userName") || "Anon";
var selectedIcon = localStorage.getItem("selectedIcon") || "/Assets/other/anonIcon.jpg";


var selectedMoodEmoji = document.getElementById("selectedMoodEmoji");
var moodButtons = document.querySelectorAll("#moodButtons button");
var currentMood = document.getElementById("currentMood");

var savedMood = localStorage.getItem('userCurrentMood') || "Cheerful";
var savedMoji = localStorage.getItem('userCurrentMoji') || "☺";

// & EventListeners and Updates
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("user").textContent = `${userName}`;
    document.getElementById("userIcon").src = selectedIcon;

    selectMood(savedMoji, savedMood);
    updateLog();

    moodButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            var moodMoji = e.target.textContent;
            var mood = e.target.id;
            selectMood(moodMoji, mood)
        });
    });
});

// & Select Mood
function selectMood(moodMoji, mood) {
    localStorage.setItem('userCurrentMood', mood);
    localStorage.setItem('userCurrentMoji', moodMoji);

    var cMood = mood.charAt(0).toUpperCase() + mood.slice(1);
    selectedMoodEmoji.textContent = moodMoji;
    currentMood.textContent = cMood;

    updateLog(); // ? Does not work 
}

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

// & Daily Log
function updateLog() {
    var savedMood = localStorage.getItem('userCurrentMood') || "cheerful";

    var logNote = document.getElementById("logNote");
    logNote.innerHTML = `I'm happy to hear that you're feeling <span id="emotion">${savedMood}</span>!`;
}

// & Breathing Exercises

document.addEventListener('DOMContentLoaded', () => {
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const landscape = document.getElementById('landscape');
    const sky = document.getElementById('sky');
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
        sky.classList.add('dayCycle');
        
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
        sky.classList.add('nightCycle');

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
