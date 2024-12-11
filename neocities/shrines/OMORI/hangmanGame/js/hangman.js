let incorrectCount = 0;
let isHangmanFunctionCalled = false;

document.addEventListener('DOMContentLoaded', () => {
    const keys = JSON.parse(localStorage.getItem('collectedKeys')) || [];
    const uniqueKeys = new Set(keys);

    const word = "WELCOME TO DEAD FAIRY CIRCLE";
    const hangmanWordContainer = document.getElementById('hangmanWord');
    hangmanWordContainer.innerHTML = '';

    hangmanWordContainer.appendChild(displayWord("WELCOME TO ", 0));
    hangmanWordContainer.appendChild(displayWord("DEAD FAIRY CIRCLE", "WELCOME TO ".length));

    keys.forEach(key => {
        const letterIndexes = [];
        for (let i = 0; i < word.length; i++) {
            if (word[i].toUpperCase() === key) {
                letterIndexes.push(i);
            }
        }
        letterIndexes.forEach(index => {
            const letterElement = document.getElementById(`letter${index + 1}`);
            const letterImg = letterElement.querySelector('img');
            if (letterImg) letterImg.style.display = 'inline-block';
            letterElement.classList.add('revealed');
        });
    });

    checkKeys();

    const incorrectKeys = keys.filter(key => !word.includes(key.toUpperCase()));
    incorrectCount = incorrectKeys.length;
    drawHangman(incorrectCount, uniqueKeys);

    const incorrectLettersContainer = document.getElementById('incorrectLetters');
    incorrectLettersContainer.innerHTML = '';
    incorrectKeys.forEach(key => {
        const letterImg = document.createElement('img');
        letterImg.src = `${window.location.origin}/shrines/OMORI/hangmanGame/assets/keys/key${key}.png`;
        letterImg.alt = key;
        incorrectLettersContainer.appendChild(letterImg);
    });

    // Cursor functionality
    const keyItems = document.querySelectorAll('.key-item');
    let currentItemIndex = 0;
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    keyItems[currentItemIndex].appendChild(cursor);

    const updateCursorPosition = () => {
        keyItems.forEach(item => item.contains(cursor) && item.removeChild(cursor));
        keyItems[currentItemIndex].appendChild(cursor);
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            currentItemIndex = (currentItemIndex + 1) % keyItems.length;
        } else if (event.key === 'ArrowUp') {
            currentItemIndex = (currentItemIndex - 1 + keyItems.length) % keyItems.length;
        }
        updateCursorPosition();
    });

    document.addEventListener('mousedown', updateCursorPosition);

    keys.forEach(function (key) {
        const checkbox = document.getElementById("checkbox" + key);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.classList.add(isCorrectKey(key) ? 'correct' : 'incorrect');
        }
    });

    checkAllLettersRevealed();
});

function displayWord(word, startIndex) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('word-section');

    word.split('').forEach((letter, index) => {
        const letterElement = document.createElement('div');
        letterElement.classList.add(letter === ' ' ? 'space' : 'letter');
        letterElement.id = `letter${startIndex + index + 1}`;
        if (letter !== ' ') {
            const letterImg = document.createElement('img');
            letterImg.src = `${window.location.origin}/shrines/OMORI/hangmanGame/assets/keys/key${letter}.png`;
            letterImg.alt = letter;
            letterImg.style.display = 'none';
            letterElement.appendChild(letterImg);
        } else {
            letterElement.textContent = ' ';
        }
        wrapper.appendChild(letterElement);
    });

    return wrapper;
}

function checkAllLettersRevealed() {
    const hangmanWordContainer = document.getElementById('hangmanWord');
    const allLetters = Array.from(hangmanWordContainer.querySelectorAll('.letter'));
    const allLettersRevealed = allLetters.every(letter => letter.classList.contains('revealed'));

    if (allLettersRevealed && !isHangmanFunctionCalled) {
        applyAnimations();
        checkKeys();
    }
}

function checkKeys() {
    const word = "WELCOME TO DEAD FAIRY CIRCLE";
    const revealedLetters = document.querySelectorAll('.letter.revealed');
    
    if (revealedLetters.length === word.replace(/ /g, '').length) {
        console.log("You are my whole world.");
        localStorage.setItem('keysCollected', 'true');
    } else {
        console.log("So, tell me, when did you become so beautiful?");
    }
}


function applyAnimations() {
    const allLetters = Array.from(document.querySelectorAll('.letter'));
    const completed = new Audio('https://files.catbox.moe/re4zrm.ogg');
    completed.play();
    completed.volume = 0.2;

    const firstLetter = allLetters[0];
    firstLetter.classList.add('first-letter-animation');

    setTimeout(() => {
        allLetters.slice(1).forEach((letter) => letter.classList.add('second-letter-animation'));
    }, 720);

    setTimeout(() => {
        animateThirdLetter(allLetters);
        allLetters.forEach(letter => letter.classList.remove('first-letter-animation', 'second-letter-animation'));
    }, 1350);

    setTimeout(() => {
        localStorage.clear();
        window.location.href = 'https://deadfairycircle.neocities.org';
    }, 7200);
}

function animateThirdLetter(allLetters) {
    allLetters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add('third-letter-animation');
            if (index === allLetters.length - 1) {
                setTimeout(() => {
                    allLetters.forEach(l => l.classList.remove('third-letter-animation'));
                    animateThirdLetter(allLetters);
                }, 500);
            }
        }, (index * 100) + 100);
    });
}

function isCorrectKey(key) {
    return "WELCOME TO DEAD FAIRY CIRCLE".replace(/ /g, '').toUpperCase().includes(key.toUpperCase());
}


// ! Giant code for drawing the hangman 
function drawHangman(incorrectCount, uniqueKeys) {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const xOffset = 30;
    const yOffset = 36;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    // Draw the gallows
    ctx.beginPath();
    ctx.moveTo(50, 220);
    ctx.lineTo(150, 220);
    ctx.moveTo(120, 220);
    ctx.lineTo(120, 20);
    ctx.lineTo(50, 20);
    ctx.lineTo(50, 40);
    ctx.stroke();

    // Draw the 愛 symbol
    ctx.beginPath();
    if (incorrectCount > 0) {
        // I will move around the stroke order in the near future. 
        ctx.moveTo(37.89 + xOffset, 1.25 + yOffset);
        ctx.bezierCurveTo(32.91 + xOffset, 2.51 + yOffset, 27.24 + xOffset, 3.65 + yOffset, 20.95 + xOffset, 4.44 + yOffset);
        ctx.bezierCurveTo(14.33 + xOffset, 5.27 + yOffset, 8.27 + xOffset, 5.56 + yOffset, 2.92 + xOffset, 5.54 + yOffset);
    }
    if (incorrectCount > 1) {
        ctx.moveTo(41.29 + xOffset, 24.98 + yOffset);
        ctx.bezierCurveTo(42.25 + xOffset, 23.95 + yOffset, 45.39 + xOffset, 20.42 + yOffset, 44.33 + xOffset, 18 + yOffset);
        ctx.bezierCurveTo(43.26 + xOffset, 15.58 + yOffset, 38.55 + xOffset, 15.57 + yOffset, 35.49 + xOffset, 15.61 + yOffset);
        ctx.bezierCurveTo(29.03 + xOffset, 15.68 + yOffset, 18.69 + xOffset, 15.99 + yOffset, 4.27 + xOffset, 17.23 + yOffset);
    }
    if (incorrectCount > 2) {
        ctx.moveTo(2.58 + xOffset, 40.5 + yOffset);
        ctx.bezierCurveTo(5.09 + xOffset, 40.07 + yOffset, 9.98 + xOffset, 38.84 + yOffset, 14.32 + xOffset, 34.85 + yOffset);
        ctx.bezierCurveTo(15.96 + xOffset, 33.35 + yOffset, 17.14 + xOffset, 31.79 + yOffset, 18 + xOffset, 30.43 + yOffset);
    }
    if (incorrectCount > 3) {
        ctx.moveTo(5.85 + xOffset, 30.8 + yOffset);
        ctx.bezierCurveTo(6.61 + xOffset, 29.81 + yOffset, 7.47 + xOffset, 28.5 + yOffset, 8.23 + xOffset, 26.85 + yOffset);
        ctx.bezierCurveTo(9.1 + xOffset, 24.97 + yOffset, 9.56 + xOffset, 23.25 + yOffset, 9.81 + xOffset, 21.91 + yOffset);
    }
    if (incorrectCount > 4) {
        ctx.moveTo(12.11 + xOffset, 13.27 + yOffset);
        ctx.bezierCurveTo(11.9 + xOffset, 12.35 + yOffset, 11.57 + xOffset, 11.24 + yOffset, 11.01 + xOffset, 10.05 + yOffset);
        ctx.bezierCurveTo(10.64 + xOffset, 9.25 + yOffset, 10.23 + xOffset, 8.57 + yOffset, 9.84 + xOffset, 7.99 + yOffset);
    }
    if (incorrectCount > 5) {
        ctx.moveTo(23.47 + xOffset, 11.97 + yOffset);
        ctx.bezierCurveTo(23.49 + xOffset, 11.38 + yOffset, 23.44 + xOffset, 10.56 + yOffset, 23.19 + xOffset, 9.62 + yOffset);
        ctx.bezierCurveTo(22.88 + xOffset, 8.47 + yOffset, 22.37 + xOffset, 7.61 + yOffset, 22 + xOffset, 7.07 + yOffset);
    }
    if (incorrectCount > 6) {
        ctx.moveTo(31.26 + xOffset, 12.11 + yOffset);
        ctx.bezierCurveTo(32.09 + xOffset, 11.32 + yOffset, 33 + xOffset, 10.32 + yOffset, 33.89 + xOffset, 9.09 + yOffset);
        ctx.bezierCurveTo(35.11 + xOffset, 7.41 + yOffset, 35.93 + xOffset, 5.8 + yOffset, 36.48 + xOffset, 4.49 + yOffset);
    }
    if (incorrectCount > 7) {
        ctx.moveTo(16.62 + xOffset, 22.27 + yOffset);
        ctx.bezierCurveTo(17.2 + xOffset, 23.41 + yOffset, 18.26 + xOffset, 25.09 + yOffset, 20.12 + xOffset, 26.5 + yOffset);
        ctx.bezierCurveTo(24.38 + xOffset, 29.75 + yOffset, 29.39 + xOffset, 28.98 + yOffset, 30.43 + xOffset, 28.8 + yOffset);
    }
    if (incorrectCount > 8) {
        ctx.moveTo(25.93 + xOffset, 25.23 + yOffset);
        ctx.bezierCurveTo(25.85 + xOffset, 24.44 + yOffset, 25.61 + xOffset, 23.13 + yOffset, 24.83 + xOffset, 21.73 + yOffset);
        ctx.bezierCurveTo(24.2 + xOffset, 20.6 + yOffset, 23.44 + xOffset, 19.82 + yOffset, 22.9 + xOffset, 19.34 + yOffset);
    }
    if (incorrectCount > 9) {
        ctx.moveTo(39.47 + xOffset, 30.28 + yOffset);
        ctx.bezierCurveTo(39.04 + xOffset, 28.98 + yOffset, 38.31 + xOffset, 27.22 + yOffset, 37.05 + xOffset, 25.37 + yOffset);
        ctx.bezierCurveTo(35.75 + xOffset, 23.46 + yOffset, 34.35 + xOffset, 22.11 + yOffset, 33.28 + xOffset, 21.23 + yOffset);
    }
    if (incorrectCount > 10) {
        ctx.moveTo(3.74 + xOffset, 48.38 + yOffset);
        ctx.bezierCurveTo(19 + xOffset, 48.06 + yOffset, 26.77 + xOffset, 43.19 + yOffset, 30.53 + xOffset, 40 + yOffset);
        ctx.bezierCurveTo(31.35 + xOffset, 39.31 + yOffset, 36.47 + xOffset, 35.15 + yOffset, 35.59 + xOffset, 33.37 + yOffset);
        ctx.bezierCurveTo(34.98 + xOffset, 32.14 + yOffset, 31.74 + xOffset, 32.51 + yOffset, 28.13 + xOffset, 32.91 + yOffset);
        ctx.bezierCurveTo(24.36 + xOffset, 33.33 + yOffset, 21.3 + xOffset, 34.1 + yOffset, 19.21 + xOffset, 34.72 + yOffset);
    }
    if (incorrectCount > 11) {
        ctx.moveTo(16.18 + xOffset, 37.96 + yOffset);
        ctx.bezierCurveTo(18.48 + xOffset, 39.56 + yOffset, 21.25 + xOffset, 41.23 + yOffset, 24.49 + xOffset, 42.75 + yOffset);
        ctx.bezierCurveTo(30.45 + xOffset, 45.55 + yOffset, 35.97 + xOffset, 46.88 + yOffset, 40.23 + xOffset, 47.54 + yOffset);
    }
    if (incorrectCount > 12) {
        ctx.moveTo(1.25 + xOffset, 23.62 + yOffset);
        ctx.bezierCurveTo(1.82 + xOffset, 22.84 + yOffset, 2.5 + xOffset, 21.73 + yOffset, 3 + xOffset, 20.31 + yOffset);
        ctx.bezierCurveTo(3.85 + xOffset, 17.89 + yOffset, 3.78 + xOffset, 15.75 + yOffset, 3.64 + xOffset, 14.51 + yOffset);
    }

    if (uniqueKeys.size === 26) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "transparent";
        isHangmanFunctionCalled = true;

        const img = new Image();
        img.src = '../../OMORI/Assets/SomethingL.webp';
        img.onload = function () {
            ctx.drawImage(img, 60, 0, 70, 230);
            localStorage.clear();
        };
        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    ctx.stroke();
}