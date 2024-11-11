let currentSong = null;
let currentSongIndex = 0;
const songs = [
    { title: "Wool Sweaters and Early Mornings", writer: "Ibrahim", volume: 0.04, src: "https://files.catbox.moe/p5w6oz.mp3" },
    { title: "Song Two", writer: "Artist B", volume: 0.1, src: "" },
    { title: "Song Three", writer: "Artist C", volume: 0.07, src: "" }
];

// Function to load a song
function loadSong(index) {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0;
    }
    
    currentSong = new Audio(songs[index].src);
    currentSong.volume = localStorage.getItem('songVolume') || songs[index].volume;

    currentSong.play().catch(error => {
        console.error(`Error playing song: ${error}`);
    });

    // Update song info display
    document.getElementById('songInfo').innerText = `${songs[index].title} by ${songs[index].writer}`;

    // Save the current song index
    localStorage.setItem('currentSongIndex', index);
}

// Function to handle window onload event
window.onload = function () {
    currentSongIndex = parseInt(localStorage.getItem('currentSongIndex')) || 0;
    loadSong(currentSongIndex);

    // Restore the last known volume
    if (localStorage.getItem('songVolume')) {
        currentSong.volume = localStorage.getItem('songVolume');
    }

    // Set up volume slider event
    const volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.value = currentSong.volume;
    volumeSlider.addEventListener('input', function() {
        currentSong.volume = volumeSlider.value;
        localStorage.setItem('songVolume', volumeSlider.value);
    });

    // Set up pause button event
    document.getElementById('MusicPauseButton').addEventListener('click', function() {
        if (currentSong.paused) {
            currentSong.play();
            this.innerText = "❚❚"; // Change button text to pause
        } else {
            currentSong.pause();
            this.innerText = "▶"; // Change button text to play
        }
    });

    // Set up seek buttons
    document.getElementById('seekBack').addEventListener('click', function() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });

    document.getElementById('seekForward').addEventListener('click', function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });
};
