var her = document.getElementById("something");

function something(her) {
    her.setAttribute('src', 'shrines/OMORI/Assets/something_disappear.gif');

    if (!window.top.audioPlayer) {
        audioPlayer = document.createElement('audio');
        audioPlayer.src = "https://files.catbox.moe/qk17h8.mp3";
        audioPlayer.volume = 0.05;
        document.body.appendChild(audioPlayer);
        audioPlayer.play();
    }

    setTimeout(() => {
        her.remove();
    }, 1550);

    setTimeout(() => {
        audioPlayer.remove();

        window.location.href = "/shrines/OMORI/hangmanGame/hangman.html";
    }, 5500);
}