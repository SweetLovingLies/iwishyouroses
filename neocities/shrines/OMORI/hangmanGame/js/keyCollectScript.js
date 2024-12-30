document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/shrines/OMORI/hangmanGame/css/keyscollected.css';  
    document.head.appendChild(link);

    const keys = JSON.parse(localStorage.getItem('collectedKeys')) || [];

    keys.forEach(key => {
        if (key === 'T') return;
        
        const keyElements = document.querySelectorAll(`#key${key}`);
        keyElements.forEach(keyElement => {
            if (keyElement) {
                keyElement.checked = true; 
                keyElement.remove();
            }
        });
    });
});

function isKeyCollected(keyId) {
    return localStorage.getItem(keyId) === 'collected';
}

function collectKey(keyId) {
    let keys = JSON.parse(localStorage.getItem('collectedKeys')) || [];
    if (!keys.includes(keyId)) {
        keys.push(keyId);
        localStorage.setItem('collectedKeys', JSON.stringify(keys));
        console.log(`Key ${keyId} collected!`);

        const audioTracks = ['https://files.catbox.moe/ilorv1.mp3', 'https://files.catbox.moe/id0y6w.mp3'];
        const randomIndex = Math.floor(Math.random() * audioTracks.length);
        const audioSrc = audioTracks[randomIndex];

        const delayBeforeAudio = 1500;
        setTimeout(() => {
            const audio = new Audio(audioSrc);
            audio.play();
        }, delayBeforeAudio);

        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        document.body.appendChild(lightbox);

        void lightbox.offsetWidth;

        setTimeout(() => {
            lightbox.classList.add('show');
            setTimeout(() => {
                const keyImg = document.createElement('img');
                keyImg.src = `${window.location.origin}/shrines/OMORI/hangmanGame/assets/keys/key${keyId}.png`;
                keyImg.alt = keyId;
                keyImg.classList.add('key-image');
                lightbox.appendChild(keyImg);

                void keyImg.offsetWidth;
                setTimeout(() => {
                    keyImg.classList.add('show');
                }, 100);
            }, 1000);

            setTimeout(() => {
                lightbox.classList.remove('show');
                lightbox.addEventListener('transitionend', () => {
                    document.body.removeChild(lightbox);

                    const word = "LILY OF THE VALLEY";
                    const correctLetters = getUniqueLetters(word);

                    if (correctLetters.has(keyId.toUpperCase())) {
                        setTimeout(() => {
                            showTextboxContainer();
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    }
                }, { once: true });
            }, 5000);
        }, 1000);

        function showTextboxContainer() {
            const textboxContainer = document.createElement('div');
            textboxContainer.classList.add('textboxContainer');
        
            const textbox = document.createElement('div');
            textbox.classList.add('textbox');
            textbox.innerHTML = `<div id="text"></div><img class="cursor" src="${window.location.origin}/shrines/OMORI/Assets/cursor.png">`;
            textboxContainer.appendChild(textbox);
        
            document.body.appendChild(textboxContainer);
        
            void textboxContainer.offsetWidth;
        
            setTimeout(() => {
                textboxContainer.style.display = 'flex';
                showCorrectKeysMessage(calculateCorrectKeysNeeded());
        
                const correctKeysNeeded = calculateCorrectKeysNeeded();
                setTimeout(() => {
                    if (correctKeysNeeded === 0) {
                        window.location.href = `${window.location.origin}/shrines/OMORI/hangmanGame/hangman.html`;
                    } else {
                        location.reload();
                    }
                }, 4000);
            }, 100);
        }

        function calculateCorrectKeysNeeded() {
            const word = "LILY OF THE VALLEY";
            const totalUniqueKeys = getUniqueLetters(word).size;
            const collectedKeys = new Set(keys.map(key => key.toUpperCase()));
            const collectedCorrectKeys = new Set([...collectedKeys].filter(key => word.toUpperCase().includes(key)));
            return totalUniqueKeys - collectedCorrectKeys.size;
        }

        function getUniqueLetters(word) {
            return new Set(word.replace(/ /g, '').toUpperCase().split(''));
        }
    }
}

function showCorrectKeysMessage(correctKeysNeeded) {
    let prewrittenText;
    if (correctKeysNeeded === 1) {
        prewrittenText = `${correctKeysNeeded} key left... {$b}`;
    } else {
        prewrittenText = `${correctKeysNeeded} keys left... {$b}`;
    }

    const soundUrls = [
        'https://fallenhuman.neocities.org/seni/text1.ogg',
        'https://fallenhuman.neocities.org/seni/text2.ogg',
        'https://fallenhuman.neocities.org/seni/text3.ogg',
        'https://fallenhuman.neocities.org/seni/text4.ogg',
        'https://fallenhuman.neocities.org/seni/text5.ogg'
    ];

    const output = document.getElementById("text");
    const textbox = document.querySelector('.textbox');
    let i = 0;
    let interval;
    let playSoundFlag = true;

    const audioObjects = soundUrls.map((soundUrl) => {
        const audio = new Audio();
        audio.src = soundUrl;
        audio.preload = "auto";
        return audio;
    });

    function playSound() {
        if (playSoundFlag) {
            const randomIndex = Math.floor(Math.random() * audioObjects.length);
            audioObjects[randomIndex].currentTime = 0;
            audioObjects[randomIndex].play();
        }
        playSoundFlag = !playSoundFlag;
    }

    function typeNextChar() {
        if (i >= prewrittenText.length) {
            clearInterval(interval);

            setTimeout(() => {
                textbox.style.animation = 'closing .2s linear forwards';
                textbox.addEventListener('animationend', () => {
                    textbox.remove();
                });
            }, 2000);

            return;
        }

        const letterToShow = prewrittenText[i];
        if (letterToShow === "{" && prewrittenText[i + 1] === "$" && prewrittenText[i + 2] === "b" && prewrittenText[i + 3] === "}") {
            setTimeout(function () {
                i += 4;
                typeNextChar();
            }, 500);
            return;
        }
        output.innerHTML += letterToShow;
        playSound();
        i++;

        interval = setTimeout(typeNextChar, 20);
    }

    if (correctKeysNeeded <= 4) {
        output.style.fontFamily = 'Fine';
    } else {
        output.style.fontFamily = 'Normal';
    }

    setTimeout(typeNextChar, 500);
}
