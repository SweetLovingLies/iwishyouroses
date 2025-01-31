document.addEventListener('DOMContentLoaded', () => {
    const appContext = "Mellow";

    document.getElementById("user").textContent = `${localStorage.getItem("userName") || "Anon"}`;
    document.getElementById("userIcon").src = localStorage.getItem("selectedIcon") || "/Assets/other/anonIcon.jpg";

    updateMoodDisplay();
    updateLogNote();

    document.querySelectorAll("#moodButtons button").forEach((button) => {
        button.addEventListener("click", (e) => {
            const moodMoji = e.currentTarget.querySelector("img").src;
            const mood = e.currentTarget.id;
            selectMood(moodMoji, mood);
        });
    });
    setupTabs();

    // console.log("renderEntries called (On App Load) with:", appContext);
    renderEntries(appContext);
});


// ~ Select Mood
function selectMood(moodMoji, mood) {
    const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);

    localStorage.setItem("userCurrentMood", moodCapitalized);
    localStorage.setItem("userCurrentMoji", moodMoji);

    updateMoodDisplay();
    updateLogNote();
    showPopover();
}

function updateMoodDisplay() {
    const mood = localStorage.getItem('userCurrentMood') || "Cheerful";
    const emoji = localStorage.getItem('userCurrentMoji') || "/Assets/other/mellowIcons/emoji/Cheerful.png";

    document.getElementById("selectedMoodEmoji").src = emoji;
    document.getElementById("currentMood").textContent = mood;
}

// ~ Popover
const popover = document.getElementById("popover");

function showPopover() {
    popover.classList.remove("hide");
    popover.style.display = "block";
}

document.getElementById("exit").addEventListener("click", exitPopover);

function exitPopover() {
    document.getElementById("textbox").value = "";
    popover.classList.add("hide");
    setTimeout(() => {
        popover.style.display = "none";
    }, 300);
}

function updateLogNote() {
    const mood = localStorage.getItem('userCurrentMood') || "cheerful";
    const logNote = document.getElementById("logNote");

    const goodEmotions = ["Cheerful", "Happy", "Calm", "Focused", "Loved"];
    const badEmotions = ["Sad", "Depressed", "Frustrated", "Anxious", "Annoyed", "Angry"];

    if (goodEmotions.includes(mood)) {
        logNote.innerHTML = `I'm happy to hear that you're feeling <span id="emotion">${mood.toLowerCase()}</span>!`;
    } else if (badEmotions.includes(mood)) {
        logNote.innerHTML = `I'm sorry to hear that you're feeling <span id="emotion">${mood.toLowerCase()}</span>.`;
    } else {
        logNote.innerHTML = `You're currently feeling <span id="emotion">${mood.toLowerCase()}</span>.`;
    }
}

// ! Save Entries (The problem child)
const saveButton = document.getElementById('saveEntry');
saveButton.addEventListener("click", createEntry);

function createEntry(e) {
    e.preventDefault();

    const appContext = "Mellow";
    const note = document.getElementById("textbox").value.trim();

    const entry = {
        type: appContext.toLowerCase(),
        mood: localStorage.getItem("userCurrentMood"),
        emoji: localStorage.getItem("userCurrentMoji"),
        note: note || "",
        timestamp: new Date().toISOString(),
    };

    const entries = getEntriesFromLocalStorage(appContext);
    entries.push(entry);

    saveEntriesToLocalStorage(entries, appContext);

    renderEntries(appContext);
    exitPopover();
}

// ~ Local Storage Functions
function saveEntriesToLocalStorage(entries, appContext) {
    if (!appContext) {
        console.error("appContext is missing!");
        return;
    }

    if (appContext === "YourTome") {
        localStorage.setItem("tomeEntries", JSON.stringify(entries));
    } else if (appContext === "Mellow") {
        localStorage.setItem("moodEntries", JSON.stringify(entries));
    } else {
        console.error("Invalid appContext:", appContext);
    }
}

function getEntriesFromLocalStorage(appContext) {
    if (!appContext) {
        console.error("appContext is missing!");
        return [];
    }

    if (appContext === "Mellow") {
        return JSON.parse(localStorage.getItem("moodEntries") || "[]");
    } else if (appContext === "YourTome") {
        return JSON.parse(localStorage.getItem("tomeEntries") || "[]");
    } else {
        console.error("Invalid appContext:", appContext);
        return [];
    }
}

// ! Render Entries (The other problem child)
function renderEntries(appContext) {
    if (typeof appContext !== "string") {
        console.error("Invalid appContext:", appContext);
        return;
    }

    const entries = getEntriesFromLocalStorage(appContext) || [];

    const filteredEntries = entries.filter(entry => entry.type === String(appContext).toLowerCase());

    entriesList.innerHTML = '';

    if (filteredEntries.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.className = 'placeholder';
        placeholder.textContent = getPlaceholderText(appContext);
        entriesList.appendChild(placeholder);
        return;
    }

    filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);

        if (entry.type === "mellow") {
            renderMoodEntry(li, entry);
        } else {
            renderTextEntry(li, entry);
        }

        // Create settings div and add buttons for each entry
        const settings = addSettingsWrapper(li);
        addDeleteButton(settings, li, appContext);
        addJSPDFbutton(settings, [entry]);

        entriesList.appendChild(li);
    });
}

function renderMoodEntry(li, entry) {
    const moodDiv = document.createElement('div');
    moodDiv.className = 'moodDisplay';

    const moodImg = document.createElement('img');
    moodImg.src = entry.emoji;
    moodImg.alt = entry.mood;
    moodImg.className = 'moodIcon';

    const moodText = document.createElement('p');
    moodText.textContent = `Feeling: ${entry.mood}`;

    moodDiv.appendChild(moodText);
    moodDiv.appendChild(moodImg);
    li.appendChild(moodDiv);

    const noteContainer = document.createElement('div');
    noteContainer.className = 'note';
    noteContainer.innerHTML = entry.note || "No additional notes.";
    li.appendChild(noteContainer);

    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
    li.appendChild(timestamp);
}

// ~ Helper Functions

function addSettingsWrapper(li) {
    const settings = document.createElement('div');
    settings.className = 'settings';
    li.appendChild(settings);
    return settings;
}

function addDeleteButton(settings, li, appContext) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteEntry';

    deleteBtn.addEventListener('click', () => {
        const index = parseInt(li.getAttribute('data-index'), 10); // Calculate index by its data-index
        const entries = getEntriesFromLocalStorage(appContext);

        entries.splice(index, 1); // Remove the entry

        saveEntriesToLocalStorage(entries, appContext);
        renderEntries(appContext);
    });

    settings.appendChild(deleteBtn);
}

function addJSPDFbutton(settings, entries) {
    const jsPDFBtn = document.createElement('button');
    jsPDFBtn.textContent = 'Export to PDF';
    jsPDFBtn.className = 'exportEntry';

    jsPDFBtn.addEventListener("click", () => exportToPDF(entries));

    settings.appendChild(jsPDFBtn);
}

function getPlaceholderText(appContext) {
    if (appContext === "Mellow") {
        return "There's nothing here yet! Go log something!"
    } else {
        return "No entries to display.";
    }
}

function exportToPDF(entries) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Your Entries!', 10, 10);

    let yOffset = 20; // Initial yOffset for positioning

    entries.forEach((entry, index) => {
        doc.setFontSize(12);
        const timestamp = new Date(entry.timestamp).toLocaleString();
        doc.text(`Entry ${index + 1} (Mood Log):`, 10, yOffset);
        yOffset += 10;
        doc.text(`Feeling: ${entry.mood || 'N/A'}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Timestamp: ${new Date(entry.timestamp).toLocaleString()}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Note: ${entry.note || 'No additional notes.'}`, 10, yOffset);

        yOffset += 10;

        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20; // Reset yOffset for the new page
        }
    });

    doc.save('journal_entries.pdf');
}

// & Breathing Exercises

document.addEventListener("DOMContentLoaded", () => {
    setupBreathingExercises();
});

function setupBreathingExercises() {
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
            // }, 2000000);

            } else {
                stopBreathingCycle();
            }
        });
    }, { threshold: 1 });

    observer.observe(landscape);
};

// & Tabs System

function setupTabs() {
    const tabs = document.querySelectorAll("nav button");
    const tabContents = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            tab.classList.add("active");
            const targetTab = tab.getAttribute("data-tab");
            document.getElementById(targetTab).classList.add("active");
        });
    });
}