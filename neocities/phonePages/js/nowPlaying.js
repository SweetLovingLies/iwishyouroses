// I could probably move a lot of this to the music.html script but I really don't feel like it rn. lol

const songs = [
    { title: "I Wish You Roses", writer: "Kali Uchis", volume: 0.04, src: "https://files.catbox.moe/z1e1s4.mp3", cover: "/Assets/other/albumCovers/IWishYouRosesCover.jpeg" },
    { title: "Dead to Me (Instrumental Ver.)", writer: "Melanie Martinez", volume: 0.05, src: "https://files.catbox.moe/8ey6a2.mp3", cover: "/Assets/other/albumCovers/DeadToMeCover.jpeg" },
    { title: "Yandere Simulator Main Menu", writer: "Only Wednesday", volume: 0.07, src: "https://files.catbox.moe/5jr3gz.mp3", cover: "/Assets/other/albumCovers/MainMenuYanSimCover.png" },
    { title: "Saffron and Green Tea", writer: "Ibrahim", volume: 0.04, src: "https://files.catbox.moe/v69zye.mp3", cover: "/Assets/other/albumCovers/SaffronandGreenTeaCover.jpeg" },
    { title: "Bullet Train Fantasy", writer: "Ibrahim, LuvBird", volume: 0.04, src: "https://files.catbox.moe/xr431q.mp3", cover: "/Assets/other/albumCovers/BulletTrainFantasyCover.jpeg" },
    { title: "Flowers", writer: "In Love With a Ghost, Nori", volume: 0.04, src: "https://files.catbox.moe/c3o43h.mp3", cover: "/Assets/other/albumCovers/FlowersCover.jpeg" },
    { title: "Let Go", writer: "Ark Patrol", volume: 0.04, src: "https://files.catbox.moe/4t8wvc.mp3", cover: "/Assets/other/albumCovers/LetGoCover.jpeg" },
    { title: "Wool Sweaters and Early Mornings", writer: "Ibrahim", volume: 0.04, src: "https://files.catbox.moe/p5w6oz.mp3", cover: "/Assets/other/albumCovers/WoolSweatersandEarlyMorningsCover.jpeg" },
    { title: "Paranoia", writer: "The Marías", volume: 0.05, src: "https://files.catbox.moe/f7q8av.mp3", cover: "/Assets/other/albumCovers/ParanoiaCover.jpeg" }
];

let audioPlayer = window.top.document.getElementById('globalAudio');
let shuffleMode = false;
let loopMode = false;
let shuffleOrder = [...Array(songs.length).keys()];
let currentShuffleIndex = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // This creates a globalAudio element if there isn't one already present on the page
    if (!audioPlayer) {
        audioPlayer = window.top.document.createElement('audio');
        audioPlayer.id = 'globalAudio';
        window.top.document.body.appendChild(audioPlayer);
    }

    let storedSongIndex = sessionStorage.getItem('currentSongIndex'); // Saves a song if you've picked a song across sessions. 

    if (storedSongIndex === null) { // Checks if there's nothing in the sessionStorage and plays the first song in the array as a fallback
        storedSongIndex = 0;
    }

    const songIndex = parseInt(storedSongIndex);
    updateMetadata(songIndex);

    if (!audioPlayer.src || audioPlayer.src !== songs[songIndex].src) { // Check if somethings already playing, and if not, load a song from the index
        loadSong(songIndex);
    }

    // Not sure exactly why this needs to be right here but it does

    const isPaused = sessionStorage.getItem('isPaused') === 'true';

    if (isPaused) {
        audioPlayer.pause();
        document.getElementById('MusicPauseButton').innerHTML = `<iconify-icon icon="qlementine-icons:play-16"></iconify-icon>`;
    } else {
        audioPlayer.play();
        document.getElementById('MusicPauseButton').innerHTML = `<iconify-icon icon="qlementine-icons:pause-16"></iconify-icon>`;
    }

    // Volume Stuff

    const savedVolume = sessionStorage.getItem('songVolume');
    if (savedVolume) {
        audioPlayer.volume = parseFloat(savedVolume);
    }

    const volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.value = audioPlayer.volume;
    volumeSlider.addEventListener('input', function () {
        audioPlayer.volume = parseFloat(volumeSlider.value);
        sessionStorage.setItem('songVolume', volumeSlider.value);

        const volumeValue = volumeSlider.value;
        volumeSlider.setAttribute('title', `Volume: ${volumeValue}`);
    });

    // Pause and Play button

    document.getElementById('MusicPauseButton').addEventListener('click', PauseNPlay);
    document.getElementById('seekBack').addEventListener('click', seekBackward);
    document.getElementById('seekForward').addEventListener('click', seekForward);
    document.getElementById('loopButton').addEventListener('click', toggleLoop);
    document.getElementById('shuffleButton').addEventListener('click', toggleShuffle);

    audioPlayer.addEventListener('ended', SongEnd);

    // Time Updater

    audioPlayer.addEventListener('timeupdate', function () {
        sessionStorage.setItem('currentSongTime', audioPlayer.currentTime);
    });
});

function loadSong(index) {
    const song = songs[index];

    audioPlayer.currentTime = 0;
    audioPlayer.src = song.src;
    audioPlayer.volume = sessionStorage.getItem('songVolume') || song.volume;
    audioPlayer.autoplay = true;

    updateMetadata(index);
    sessionStorage.setItem('currentSongIndex', index);
}

// Function to update metadata

function updateMetadata(index) {
    const song = songs[index];
    document.getElementById('songName').innerText = song.title;
    document.getElementById('songArtist').innerText = song.writer;

    const albumCoverElement = document.getElementById('albumCover');
    albumCoverElement.src = song.cover || "/Assets/other/albumCovers/fallbackCover.jpg";
    albumCoverElement.alt = `${song.title} Album Cover`;
}


// Play/Pause toggle
function PauseNPlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        this.innerHTML = `<iconify-icon icon="qlementine-icons:pause-16"></iconify-icon>`;
        sessionStorage.setItem('isPaused', 'false');
    } else {
        audioPlayer.pause();
        this.innerHTML = `<iconify-icon icon="qlementine-icons:play-16"></iconify-icon>`;
        sessionStorage.setItem('isPaused', 'true');
    }
}

// Seek Forward

function seekForward() {
    let currentIndex = parseInt(sessionStorage.getItem('currentSongIndex'));
    if (shuffleMode) {
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffleOrder.length;
        currentIndex = shuffleOrder[currentShuffleIndex];
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    loadSong(currentIndex);
}

// Seek Backward

function seekBackward() {
    let currentIndex = parseInt(sessionStorage.getItem('currentSongIndex'));
    if (shuffleMode) {
        currentShuffleIndex = (currentShuffleIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
        currentIndex = shuffleOrder[currentShuffleIndex];
    } else {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    loadSong(currentIndex);
}


function SongEnd() {
    if (loopMode) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        seekForward();
    }
}

// Loop Mode

function toggleLoop() {
    loopMode = !loopMode;
    this.classList.toggle('active', loopMode);
    sessionStorage.setItem('loopMode', loopMode);
}

// Shuffle Mode

function toggleShuffle() {
    shuffleMode = !shuffleMode;
    this.classList.toggle('active', shuffleMode);

    if (shuffleMode) {
        shuffleArray(shuffleOrder); 
        currentShuffleIndex = 0;   // Plays the first song in the shuffled array; this should be the current song!
    } else {
        shuffleOrder = [...Array(songs.length).keys()];
    }

    sessionStorage.setItem('shuffleMode', shuffleMode);
}