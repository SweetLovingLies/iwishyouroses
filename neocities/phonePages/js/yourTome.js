import { renderEntries, exportToPDF } from './entryManager.js';

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
