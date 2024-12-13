document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('appContext', 'YourTome');
});

function openEntryModal(entry) {
    const modal = document.getElementById('viewWrapper');
    const noteContent = document.getElementById('noteContent');
    const closeModal = document.getElementById('closeModal');

    modal.style.display = 'flex';
    noteContent.innerHTML = marked.parse(entry.type === 'mood' ? entry.note : entry.content);

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
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
