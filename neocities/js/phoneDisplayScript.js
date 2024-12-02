let phone = document.getElementById("phone");
let phoneSpot = document.getElementById("phoneSpot");
let timeoutID = null;

let time = 1000;

function hidePhone() {
    if (!phoneSpot.matches(':hover') && !phone.matches(':hover')) {
        phone.classList.add('hidden');
        phone.classList.remove('visible');
    }
    if (!phoneSpot.matches(':focus') && !phone.matches(':focus')) {
        phone.classList.add('hidden');
        phone.classList.remove('visible');
    }
}

phoneSpot.addEventListener('mouseenter', () => {
    clearTimeout(timeoutID);
    phone.classList.remove('hidden');
    phone.classList.add('visible');
});

phoneSpot.addEventListener('mouseleave', () => {
    timeoutID = setTimeout(hidePhone, time);
});

phone.addEventListener('mouseenter', () => {
    clearTimeout(timeoutID);
});

phone.addEventListener('mouseleave', () => {
    timeoutID = setTimeout(hidePhone, time);
});

// Fallback just in case something breaks... it probably won't. 
document.addEventListener('mousemove', (e) => {
    const windowWidth = window.innerWidth;
    if (e.clientX > windowWidth - 50 && phone.classList.contains('hidden')) {
        phone.classList.remove('hidden');
        phone.classList.add('visible');
    }
});
