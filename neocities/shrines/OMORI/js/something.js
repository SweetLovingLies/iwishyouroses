var her = document.getElementById("something");
var apparition = document.getElementById("apparition");
apparition.volume = 0.3;

function something(her) {
    her.setAttribute('src', 'shrines/OMORI/omoriAssets/something_disappear.gif');

    setTimeout(() => {
        her.remove();
    }, 1550);

    setTimeout(() => {
        window.open('shrines/OMORI/hangmanGame/hangman.html', '_top');
    }, 5000);
}