let phone = document.getElementById("phone");
let phoneSpot = document.getElementById("phoneSpot");
let timeoutID = null;
let mouseWithin = false; // ! Trying a flag to see if it fixes my problem.
let time = 1000;

function hidePhone() {
    if (!mouseWithin) {
        phone.classList.add('hidden');
        phone.classList.remove('visible');
    }
}

phoneSpot.addEventListener('mouseenter', () => {
    clearTimeout(timeoutID);
    mouseWithin = true; 
    phone.classList.remove('hidden');
    phone.classList.add('visible');
    // console.log("Phone Visible!");
});

phoneSpot.addEventListener('mouseleave', () => {
    mouseWithin = false;
    timeoutID = setTimeout(hidePhone, time);
    // console.log("Phone Hidden!");
});

phone.addEventListener('mouseenter', () => {
    clearTimeout(timeoutID);
    mouseWithin = true; 
    // console.log("Keeping Open!");
});

phone.addEventListener('mouseleave', () => {
    mouseWithin = false;
    timeoutID = setTimeout(hidePhone, time);
});

// Fallback just in case something breaks... it probably won't. 

document.addEventListener('mousemove', (e) => {
    const windowWidth = window.innerWidth;
    if (e.clientX > windowWidth - 50 && phone.classList.contains('hidden')) {
        phone.classList.remove('hidden');
        phone.classList.add('visible');
        // console.log("The cake is a lie!")
    }
});
