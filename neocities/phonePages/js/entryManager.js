export const entriesList = document.getElementById('entriesList');
export const textbox = document.getElementById('textbox');

const { jsPDF } = window.jspdf;

// ! Utility functions
export function saveEntriesToLocalStorage(entries) {
    localStorage.setItem("entries", JSON.stringify(entries));
}

export function getEntriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("entries") || "[]");
}

export function getPlaceholderText(appContext) {
    return appContext === "Mellow"
        ? "You haven't logged anything yet!"
        : "Your tome is empty… why not write a spell?";
}

function addDeleteButton(li, index, appContext) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteEntry';

    deleteBtn.addEventListener('click', () => {
        const entries = getEntriesFromLocalStorage();
        entries.splice(index, 1);
        saveEntriesToLocalStorage(entries);
        renderEntries(appContext);
    });

    const settings = document.createElement('div');
    settings.className = 'settings';
    settings.appendChild(deleteBtn);
    li.appendChild(settings);
}


export function addJSPDFbutton(li, entries) {
    const jsPDFBtn = document.createElement('button');
    jsPDFBtn.textContent = 'Export to PDF';
    jsPDFBtn.className = 'exportEntry';

    jsPDFBtn.addEventListener("click", () => exportToPDF(entries));

    const settings = document.createElement('div');
    settings.className = 'settings';
    settings.appendChild(jsPDFBtn);
    li.appendChild(settings);
}


export function addViewButton(li, entry) {
    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View Entry';
    viewBtn.className = 'viewEntry';

    viewBtn.addEventListener('click', () => {
        openEntryModal(entry);
    });

    li.querySelector('.settings').appendChild(viewBtn);
}

export function exportToPDF(entries) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Your Entries!', 10, 10);

    let yOffset = 20; 
    entries.forEach((entry, index) => {
        doc.setFontSize(12);

        if (entry.type === 'mood') {
            doc.text(`Entry ${index + 1} (Mood Log):`, 10, yOffset);
            yOffset += 5;
            doc.text(`Feeling: ${entry.mood}`, 10, yOffset);
            yOffset += 5;
            doc.text(`Note: ${entry.note || "No additional notes."}`, 10, yOffset);
        } else {
            doc.text(`Entry ${index + 1}:`, 10, yOffset);
            yOffset += 5;
            doc.text(`"${entry.content || "No content"}"`, 10, yOffset);
        }
        yOffset += 10;

        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
        }
    });

    doc.save('journal_entries.pdf');
}

// ! Render Entries
export function renderEntries(appContext) {
    const entries = getEntriesFromLocalStorage();
    const filteredEntries = entries.filter(entry => entry.type === appContext.toLowerCase()); // This line does not work. lol

    const entriesList = document.getElementById("entriesList"); // Ensure entriesList is defined
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

        if (entry.type === "mood") {
            renderMoodEntry(li, entry);
        } else if (entry.type === "journal") {
            renderTextEntry(li, entry);
        }

        addDeleteButton(li, index, appContext);
        addJSPDFbutton(li, [entry]);
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
    noteContainer.innerHTML = marked.parse(entry.note || "No additional notes.");
    li.appendChild(noteContainer);

    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
    li.appendChild(timestamp);
}

function renderTextEntry(li, entry) {
    const textContent = document.createElement('span');
    textContent.innerHTML = marked.parse(entry.note || "No content");
    li.appendChild(textContent);

    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
    li.appendChild(timestamp);

    // Add a button to open the full entry modal
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View Entry';
    viewButton.className = 'viewEntry';
    viewButton.addEventListener('click', () => openEntryModal(entry));
    li.appendChild(viewButton);
}
