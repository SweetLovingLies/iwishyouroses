const entriesList = document.getElementById('entriesList');
const textbox = document.getElementById('textbox');
const placeholder = document.querySelector('.placeholder');
const saveButton = document.getElementById('saveEntry');

const { jsPDF } = window.jspdf;

const appContext = localStorage.getItem('appContext') || 'YourTome'; // 'Mellow' or 'YourTome'
let saveCooldown = false;


function saveEntriesToLocalStorage(entries) {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}

function getEntriesFromLocalStorage() {
    // console.log(JSON.parse(localStorage.getItem('journalEntries')) || []);
    return JSON.parse(localStorage.getItem('journalEntries')) || [];
}

function renderEntries() {
    const entries = getEntriesFromLocalStorage();
    entriesList.innerHTML = '';

    if (entries.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.className = 'placeholder';

        if (appContext === "Mellow") {
            placeholder.textContent = "You haven't logged anything yet!";
        } else {
            placeholder.textContent = "Your tome is empty… why not write a spell?";
        }
        entriesList.appendChild(placeholder);
        return;
    }

    entries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);

        if (entry.type === 'mood') {
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
            noteContainer.innerHTML = marked.parse(entry.note || "No additional notes.");
            li.appendChild(noteContainer);

            const timestamp = document.createElement('p');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date(entry.timestamp).toLocaleString();
            li.appendChild(timestamp);
        } else {
            const textContent = document.createElement('span');
            textContent.innerHTML = marked.parse(entry.content ? entry.content.substring(0, 30) + '...' : "No content");
            li.appendChild(textContent);
        }

        const settings = document.createElement('div');
        settings.className = 'settings';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'deleteEntry';
        settings.appendChild(deleteBtn);

        li.appendChild(settings);
        entriesList.appendChild(li);

        // Now add the view button to the settings
        addViewButton(entry, li);

        deleteBtn.addEventListener('click', () => {
            const entries = getEntriesFromLocalStorage();
            entries.splice(index, 1);
            saveEntriesToLocalStorage(entries);
            renderEntries();
        });
    });
}

function exportToPDF(entries) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Your Entries!', 10, 10);

    let yOffset = 20;  // Starting Y position for text
    entries.forEach((entry, index) => {
        doc.setFontSize(12);
        const timestamp = new Date(entry.timestamp).toLocaleString();

        if (entry.type === 'mood') {
            doc.text(`Entry ${index + 1} (Mood Log):`, 10, yOffset);
            yOffset += 5;
            doc.text(`Feeling: ${entry.mood}`, 10, yOffset);
            yOffset += 5;
            doc.text(`Note: ${entry.note || "No additional notes."}`, 10, yOffset);
            yOffset += 5;
            doc.text(`Time Saved: ${timestamp}`, 10, yOffset);
        } else {
            doc.text(`Entry ${index + 1}:`, 10, yOffset);
            yOffset += 5;
            doc.text(`"${entry.content || "No content"}"`, 10, yOffset);
            yOffset += 5;
            doc.text(`Time Saved: ${timestamp}`, 10, yOffset);
            yOffset += 5;
        }

        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
        }
    });

    // Save the generated PDF
    doc.save('journal_entries.pdf');
}

function addViewButton(entry, li) {
    const settings = li.querySelector('.settings');

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View Entry';
    viewBtn.className = 'viewEntry';
    settings.appendChild(viewBtn);

    viewBtn.addEventListener('click', () => {
        openEntryModal(entry);
    });
}

saveButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (saveCooldown) return;

    const content = textbox.value.trim();

    // Use context to decide how to handle mood entries
    const isMoodApp = appContext === 'Mellow';
    const mood = isMoodApp ? (savedMood || null) : null;
    const emoji = isMoodApp ? (savedMoji || null) : null;

    if (!content && !mood && !emoji) {
        alert("No content or mood selected.");
        return;
    }

    const entries = getEntriesFromLocalStorage();
    const isMoodLog = isMoodApp && !!mood && !!emoji;

    const entry = isMoodLog
        ? {
            type: 'mood',
            mood,
            emoji,
            note: content,
            timestamp: new Date().toISOString(),
        }
        : {
            type: 'journal',
            content,
            timestamp: new Date().toISOString(),
        };

    entries.push(entry);
    saveEntriesToLocalStorage(entries);
    renderEntries();

    textbox.value = '';

    if (isMoodApp) {
        savedMood = null;
        savedMoji = null;
        if (popover) {
            popover.classList.add("hide");
            setTimeout(() => {
                popover.style.display = "none";
            }, 300);
        }
    }

    saveCooldown = true;
    saveButton.disabled = true;
    setTimeout(() => {
        saveCooldown = false;
        saveButton.disabled = false;
    }, 2000);
});




// ! Get Deleted
entriesList.addEventListener('click', (event) => {
    const li = event.target.closest('li');
    if (!li) return;

    const index = parseInt(li.getAttribute('data-index'), 10);
    const entries = getEntriesFromLocalStorage();

    if (event.target.classList.contains('deleteEntry')) {
        entries.splice(index, 1);
        saveEntriesToLocalStorage(entries);
        renderEntries();
    }
});

window.addEventListener('DOMContentLoaded', renderEntries);
