const blackboard = document.getElementById('blackboard');
const updates = document.getElementById('updates');
const exit = document.getElementById('exit');

function toggleBlackboard() {
    if (blackboard.style.display === 'none' || blackboard.style.display === '') {
        blackboard.style.display = "flex";
    } else {
        blackboard.style.display = "none";
    }
}

updates.addEventListener('click', toggleBlackboard);
exit.addEventListener('click', toggleBlackboard);