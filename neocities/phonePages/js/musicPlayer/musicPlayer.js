let audioPlayer = window.top.document.getElementById('globalAudio');
let shuffleMode = false;
let loopMode = false;
let shuffleOrder = [];
let currentShuffleIndex = 0;
let songs = [];

fetch('/phonePages/js/musicPlayer/songs.json')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        songs = data;
        // console.log(songs);
        // console.log("Number of songs:", songs.length);
        createAudioPlayer();
    })
    .catch(error => console.error("Error fetching JSON:", error));

    async function createAudioPlayer() {
        if (!audioPlayer || !window.top.document.getElementById('globalAudio')) {
            audioPlayer = window.top.document.createElement('audio');
            audioPlayer.id = 'globalAudio';
            window.top.document.body.appendChild(audioPlayer);
            // console.log("Audio Player Created!");
        } 
        // else {
        //     console.log ("Skipped initialization!");
        // }
    
        audioPlayer.removeEventListener('ended', SongEnd);
        audioPlayer.addEventListener('ended', SongEnd);
    
        audioPlayer.removeEventListener('timeupdate', timeUpdateHandler);
        audioPlayer.addEventListener('timeupdate', timeUpdateHandler);
        
        await validationAndChecks();
    }
    
    // Function to handle timeupdate
    function timeUpdateHandler() {
        sessionStorage.setItem('currentSongTime', audioPlayer.currentTime);
        let currentIndex = parseInt(sessionStorage.getItem('currentSongIndex')) || 0;
        sessionStorage.setItem(`songTime_${currentIndex}`, audioPlayer.currentTime);
    }
    

async function validationAndChecks() {
    if (songs.length > 0) {
        let storedSongIndex = sessionStorage.getItem('currentSongIndex') || 0;
        const songIndex = parseInt(storedSongIndex);
        // console.log("Validating Song Index:", songIndex);
        // console.log("Number of songs:", songs.length);

        if (songIndex >= 0 && songIndex < songs.length) {
            loadSong(songIndex);
        } else {
            console.error("Invalid song index:", songIndex);
            sessionStorage.setItem('currentSongIndex', 0);
            loadSong(0);
        }
    }
}

function loadSong(index) {
    if (songs && songs.length > 0) {
        const song = songs[index];
        if (!song) {
            console.error("No song found at index:", index);
            return;
        }

        // console.log("Loading song:", song.src);
        
        let savedTime = parseFloat(sessionStorage.getItem(`songTime_${index}`)) || 0;
        
        audioPlayer.src = song.src;
        audioPlayer.volume = sessionStorage.getItem('songVolume') ? parseFloat(sessionStorage.getItem('songVolume')) : 1;
        audioPlayer.currentTime = savedTime; 

        updateMetadata(index);

        // console.log(`Playing song: ${song.title}`);
    } else {
        console.error("No songs loaded or empty song list.");
    }
}

function SongEnd() {
    if (loopMode) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        seekForward();
    }
}

function seekForward() {
    let currentIndex = parseInt(sessionStorage.getItem('currentSongIndex')) || 0;

    if (shuffleMode) {
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffleOrder.length;
        currentIndex = shuffleOrder[currentShuffleIndex];
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }

    loadSong(currentIndex);
    sessionStorage.setItem('currentSongIndex', currentIndex);
}

function seekBackward() {
    let currentIndex = parseInt(sessionStorage.getItem('currentSongIndex')) || 0;

    if (shuffleMode) {
        currentShuffleIndex = (currentShuffleIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
        currentIndex = shuffleOrder[currentShuffleIndex];
    } else {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    }

    loadSong(currentIndex);
    sessionStorage.setItem('currentSongIndex', currentIndex);
}

function shuffleSongs() {
    shuffleMode = !shuffleMode;
    if (shuffleMode) {
        shuffleOrder = [...Array(songs.length).keys()];
        shuffleArray(shuffleOrder);
        currentShuffleIndex = 0;
        // console.log("Shuffle mode enabled.");
    }
    // else {
    //     console.log("Shuffle mode disabled.");
    // }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}