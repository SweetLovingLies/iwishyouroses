function createStars() {
    const overlay = document.querySelector('.overlay');
    const starCount = Math.floor(Math.random() * 50) + 50

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('img');
        star.src = 'css/img/Star.png';
        star.classList.add('stars');

        const size = Math.random() * 20 + 30;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        if (Math.random() > 0.7) {
            setInterval(() => {
                star.classList.toggle('twinkling');
            }, Math.random() * 2000 + 1000);
        }

        overlay.appendChild(star);
    }
}

function createShootingStar() {
    const overlay = document.querySelector('.overlay');
    const shootingStar = document.createElement('img');
    shootingStar.src = 'css/img/shootingstar.png';
    shootingStar.classList.add('shootingstar');

    const startX = Math.random() * 70 - 10;
    const startY = Math.random() * 50;

    shootingStar.style.top = `${startY}vh`;
    shootingStar.style.left = `${startX}vw`;

    const animationDuration = 500; // a half second

    overlay.appendChild(shootingStar);

    setTimeout(() => {
        shootingStar.remove();
    }, animationDuration);
}


function triggerMeteorShower() {
    const meteorShowerDuration = 5000;
    const meteorInterval = 100; // Interval between shooting stars

    const meteorShowerTimer = setInterval(() => {
        createShootingStar();
    }, meteorInterval);

    setTimeout(() => {
        clearInterval(meteorShowerTimer);
    }, meteorShowerDuration);
}

function blackHoleAppearance() {
    const BHWrapper = document.createElement('div');
    BHWrapper.classList.add('BHWrapper');
    BHWrapper.classList.add('celestialObject');

    const link = document.createElement('a');
    link.classList.add('UNF');
    BHWrapper.appendChild(link);

    const blackHole = document.createElement('div')
    blackHole.classList.add('blackHole');
    link.appendChild(blackHole);

    const eventHorizon = document.createElement('div')
    eventHorizon.classList.add('eventHorizon');
    link.appendChild(eventHorizon);

    const label = document.createElement('span')
    label.classList.add('label');
    label.textContent = "Dead Fairy Circle"
    link.appendChild(label);

    document.body.appendChild(BHWrapper);
}

function randomEvents() {
    setInterval(() => {
        const chance = Math.random();

        if (chance > 0.99) { // 1% chance for a meteor shower
            triggerMeteorShower();
        } else if (chance > 0.95) { // 5% chance for a single shooting star
            createShootingStar();
        }
    }, 2000); // Every 2 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("outerSpace").volume = "0.1"
    createStars();
    randomEvents();

    const chance = Math.random();
    if (chance > 0.99) {
        blackHoleAppearance()
        // console.log("The black hole has appeared!")
    } 
    // else {
    //     console.log("There is no black hole... smh")
    // }
});

window.addEventListener('resize', () => {
    document.querySelector('.overlay').innerHTML = '';
    createStars();
});