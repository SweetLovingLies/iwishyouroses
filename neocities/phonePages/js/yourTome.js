document.addEventListener('DOMContentLoaded', () => {
    const appContext = "YourTome";
    renderEntries(appContext);
});

export function openEntryModal(entry) {
    const modal = document.getElementById('viewWrapper');
    const noteContent = document.getElementById('noteContent');
    const closeModal = document.getElementById('closeModal');

    const content = entry.note || "No content available."; 
    modal.style.display = 'flex';
    noteContent.innerHTML = content;

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

const saveButton = document.getElementById('saveEntry');
saveButton.addEventListener("click", createEntry);

function createEntry(e) {
    e.preventDefault();

    const note = document.getElementById("textbox").value.trim();

    const entry = {
        type: "yourtome",
        note: note || "",
        timestamp: new Date().toISOString(),
    };

    const entries = getEntriesFromLocalStorage("YourTome");
    entries.push(entry);

    saveEntriesToLocalStorage(entries, "YourTome");
    renderEntries("YourTome");
    document.getElementById("textbox").value = "";
}

// Local Storage Functions
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

// Render Entries
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

        renderTextEntry(li, entry);

        // Create settings div and add buttons for each entry
        const settings = addSettingsWrapper(li);
        addDeleteButton(settings, li, appContext);
        addJSPDFbutton(settings, [entry]);

        entriesList.appendChild(li);
    });    
}

function renderTomeEntry(li, entry) {
    const noteContainer = document.createElement('div');
    noteContainer.className = 'noteContent';
    noteContainer.innerHTML = entry.note || "No content available.";

    li.appendChild(noteContainer);

    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
    li.appendChild(timestamp);

    li.addEventListener('click', () => openEntryModal(entry));
}

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
        renderEntries(appContext); // Re-render entries
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

function renderTextEntry(li, entry) {
    const textContent = document.createElement('span');
    const content = entry.note || "No content available.";
    textContent.innerHTML = marked.parse(content);
    li.appendChild(textContent);

    const timestamp = document.createElement('p');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(entry.timestamp).toLocaleString();
    li.appendChild(timestamp);

    const viewButton = document.createElement('button');
    viewButton.textContent = 'View Entry';
    viewButton.className = 'viewEntry';
    viewButton.addEventListener("click", () => openEntryModal(entry));
    li.appendChild(viewButton);
}

function getPlaceholderText(appContext) {
    if (appContext === "YourTome") {
        return "Your tome is empty… why not write a spell?";
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
        doc.text(`Entry ${index + 1}:`, 10, yOffset);
        yOffset += 10;
        doc.text(`Timestamp: ${new Date(entry.timestamp).toLocaleString()}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Content: ${entry.note || 'No content'}`, 10, yOffset);

        yOffset += 10;

        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20; // Reset yOffset for the new page
        }
    });

    doc.save('journal_entries.pdf');
}

// textbox.addEventListener('input', () => {
//     const typedContent = textbox.value.trim(); 
//     if (typedContent === "395248") {
//         testAction();
//     }
// });

// function testAction() {
//     alert("HARHARHARHARHARHARHARHARHARHAR"); 
// }
