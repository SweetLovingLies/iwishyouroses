import { saveEntriesToLocalStorage, getEntriesFromLocalStorage, renderEntries } from './entryManager.js';

const appContext = "YourTome";

function openEntryModal(entry) {
    const modal = document.getElementById('viewWrapper');
    const noteContent = document.getElementById('noteContent');
    const closeModal = document.getElementById('closeModal');

    modal.style.display = 'flex';
    noteContent.innerHTML = marked.parse(entry.content);

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

    const appContext = "YourTome";
    const note = document.getElementById("textbox").value.trim(); 

    const entry = {
        type: "journal",
        note: note || "", 
        timestamp: new Date().toISOString(),
    };

    const entries = getEntriesFromLocalStorage();
    entries.push(entry);
    saveEntriesToLocalStorage(entries);
    renderEntries(appContext);

    document.getElementById("textbox").value = "";
}

document.addEventListener('DOMContentLoaded', () => renderEntries(appContext));

// textbox.addEventListener('input', () => {
//     const typedContent = textbox.value.trim(); 
//     if (typedContent === "395248") {
//         testAction();
//     }
// });

// function testAction() {
//     alert("HARHARHARHARHARHARHARHARHARHAR"); 
// }
