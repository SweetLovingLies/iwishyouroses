const groupMode = document.getElementById("group");
const selfieMode = document.getElementById("selfie");

const viewfinder = document.getElementById("viewfinder");
const flash = document.getElementById("flash");

const shutterButton = document.getElementById("shutterButton");
const galleryPreview = document.querySelector("#galleryPreview img");

const filtersButton = document.getElementById("filtersButton");
const filterName = document.getElementById("filterName");

let currentMode = "selfie";
let photoData = { selfie: [], group: [] };
let galleryImages = [];
let currentFilterIndex = 0;
const filters = [
    { name: "Normal", filter: "none" },
    { name: "Grayscale", filter: "grayscale(100%)" },
    { name: "Sepia", filter: "sepia(80%)" },
    { name: "Blur", filter: "blur(2px)" },
    { name: "Contrast", filter: "contrast(1.5)" },
];

// Fetch the JSON file on load
async function loadPhotos() {
    try {
        const response = await fetch("js/camera/photos.json");
        photoData = await response.json();
        setRandomPhoto(currentMode);
    } catch (error) {
        console.error("Error loading photo data:", error);
    }
}

// Select a random photo based on the current mode
function setRandomPhoto(mode) {
    const photos = photoData[mode];
    if (photos && photos.length > 0) {
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        viewfinder.style.backgroundImage = `url("${randomPhoto}")`;
    } else {
        console.warn(`No photos available for mode: ${mode}`);
    }
}


function switchMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;

    selfieMode.classList.toggle("active", mode === "selfie");
    groupMode.classList.toggle("active", mode === "group");

    // Assign a new random photo for the selected mode
    setRandomPhoto(mode);
}

function takePhoto() {
    if (!window.top.audioPlayer) {
        audioPlayer = document.createElement('audio');
        audioPlayer.src = "https://files.catbox.moe/8n2jom.mp3";
        audioPlayer.volume = 0.1;
        document.body.appendChild(audioPlayer);
        audioPlayer.play();
    }
    setTimeout(() => {
        audioPlayer.remove();
    }, 600);

    flash.style.animation = "flash 0.3s ease-out forwards";

    setTimeout(() => {
        flash.style.animation = "";
    }, 300);

    const newPhoto = viewfinder.style.backgroundImage;
    galleryImages.push(newPhoto);
    galleryPreview.src = newPhoto.replace('url("', "").replace('")', "");
}

function filterChoice() {
    currentFilterIndex = (currentFilterIndex + 1) % filters.length;
    const filter = filters[currentFilterIndex];
    viewfinder.style.filter = filter.filter;
    filterName.textContent = filter.name;
}

groupMode.addEventListener("click", () => switchMode("group"));
selfieMode.addEventListener("click", () => switchMode("selfie"));
shutterButton.addEventListener("click", takePhoto);
filtersButton.addEventListener("click", filterChoice);

loadPhotos();