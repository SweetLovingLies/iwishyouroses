const entriesList = document.getElementById('entriesList');
const textbox = document.getElementById('textbox');
const placeholder = document.querySelector('.placeholder'); 

// Helper Functions
function saveEntriesToLocalStorage(entries) {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}

function getEntriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('journalEntries')) || [];
}

function renderEntries() {
    const entries = getEntriesFromLocalStorage();
    entriesList.innerHTML = '';

    if (entries.length === 0) {
        const thing = document.createElement('p');
        thing.className = 'placeholder';
        thing.textContent = "You haven't logged anything yet!";
        entriesList.appendChild(thing);
        return;
    }

    placeholder.style.display = 'none';

    entries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);

        // Populate the list item based on entry type
        if (entry.type === 'mood') {
            const moodSpan = document.createElement('span');
            moodSpan.className = 'mood-display';
            moodSpan.textContent = `${entry.emoji} ${entry.mood}`;
            li.appendChild(moodSpan);

            const noteSpan = document.createElement('span');
            noteSpan.className = 'mood-note';
            noteSpan.innerHTML = marked.parse(entry.note || "No additional notes.");
            li.appendChild(noteSpan);

            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'mood-timestamp';
            timestampSpan.textContent = new Date(entry.timestamp).toLocaleString();
            li.appendChild(timestampSpan);
        } else {
            const textContent = document.createElement('span');
            textContent.innerHTML = marked.parse(entry.content.substring(0, 30) + '...');
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

// & Event Listeners
document.getElementById('saveEntry').addEventListener('click', (e) => {
    e.preventDefault();
    const content = textbox.value.trim();
    if (!content && !savedMood && !savedMoji) return;

    const entries = getEntriesFromLocalStorage();
    const isMoodLog = !!savedMood && !!savedMoji;

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
            edited: false,
        };

    entries.push(entry);
    saveEntriesToLocalStorage(entries);
    renderEntries();

    textbox.value = ''; 
    savedMood = null;
    savedMoji = null;
    popover.classList.add('hide');
    setTimeout(() => (popover.style.display = 'none'), 300);
});

entriesList.addEventListener('click', (event) => {
    const li = event.target.closest('li');
    if (!li) return;

    const index = parseInt(li.getAttribute('data-index'), 10);
    const entries = getEntriesFromLocalStorage();

    if (event.target.classList.contains('deleteEntry')) {
        entries.splice(index, 1);
        saveEntriesToLocalStorage(entries);
        renderEntries();
    } else if (event.target.classList.contains('editEntry')) {
        const entry = entries[index];

        if (entry.type === 'mood') {
            savedMood = entry.mood;
            savedMoji = entry.emoji;
            textbox.textContent = entry.note;
        } else {
            textbox.textContent = entry.content;
        }

        entries.splice(index, 1); // Remove the log temporarily
        saveEntriesToLocalStorage(entries);
        renderEntries();
    }
});


window.addEventListener('DOMContentLoaded', () => {
    renderEntries();
});
