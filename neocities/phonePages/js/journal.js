const entriesList = document.getElementById('entriesList');
const textbox = document.getElementById('textbox');
const placeholder = document.querySelector('.placeholder'); 
const saveButton = document.getElementById('saveEntry');

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
        placeholder.textContent = "You haven't logged anything yet!";
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

            // console.log("Appending Mood Text and IMG:", moodText.textContent, moodImg);
            moodDiv.appendChild(moodText);
            moodDiv.appendChild(moodImg);
            li.appendChild(moodDiv);

            const noteContainer = document.createElement('div');
            noteContainer.className = 'note';

            // console.log("Parsing with marked:", entry.note || entry.content);
            noteContainer.innerHTML = marked.parse(entry.note || "No additional notes.");

            li.appendChild(noteContainer);

            // console.log("Appended note:", noteContainer.textContent);

            const timestamp = document.createElement('p');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date(entry.timestamp).toLocaleString();

            // console.log("Appending Timestamp:", timestamp.textContent);

            li.appendChild(timestamp);
        } else {
            const textContent = document.createElement('span');

            // console.log("Parsing with marked:", entry.note || entry.content);

            textContent.innerHTML = marked.parse(entry.content ? entry.content.substring(0, 30) + '...' : "No content");
            li.appendChild(textContent);
        }

        const settings = document.createElement('div');
        settings.className = 'settings';

        // const editBtn = document.createElement('button');
        // editBtn.textContent = 'Edit';
        // editBtn.className = 'editEntry';
        // settings.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'deleteEntry';
        settings.appendChild(deleteBtn);

        // const exportBtn = document.createElement('button');
        // exportBtn.textContent = 'Export to PDF';
        // exportBtn.className = 'exportJS';
        // settings.appendChild(exportBtn);
        
        li.appendChild(settings);
        entriesList.appendChild(li);
    });
}

saveButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (saveCooldown) return;

    const content = textbox.value.trim();
    if (!content && (!savedMood || !savedMoji)) {
        console.warn("No content or mood selected.");
        return; // Prevent saving invalid entries
    }

    const entries = getEntriesFromLocalStorage();
    // console.log("Entries before saving:", entries);

    const isMoodLog = savedMood && savedMoji;
    const entry = isMoodLog
        ? {
            type: 'mood',
            mood: savedMood,
            emoji: savedMoji,
            note: content,
            timestamp: new Date().toISOString(),
        }
        : {
            type: 'journal',
            content,
            timestamp: new Date().toISOString(),
        };

    // console.log("New Entry:", entry);

    entries.push(entry);
    saveEntriesToLocalStorage(entries);
    renderEntries();
    // console.log("Entries after saving:", getEntriesFromLocalStorage());

    textbox.value = '';
    if (isMoodLog) {
        savedMood = null;
        savedMoji = null;
    }

    popover.style.display = 'none';
    popover.classList.add('hide');

    // Rate Limiter
    saveCooldown = true;
    saveButton.disabled = true;
    saveButton.style.cursor = "not-allowed";
    setTimeout(() => {
        saveCooldown = false;
        saveButton.disabled = false;
        saveButton.style.cursor = "pointer";
    }, 30000); // 30 Seconds
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
