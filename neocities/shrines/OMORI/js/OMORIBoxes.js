function typewriter(prewrittenTexts, characterDisplayName, emotions, showCharacter, useWhiteLightbox) {
    const soundUrls = [
        'https://fallenhuman.neocities.org/seni/text1.ogg',
        'https://fallenhuman.neocities.org/seni/text2.ogg',
        'https://fallenhuman.neocities.org/seni/text3.ogg',
        'https://fallenhuman.neocities.org/seni/text4.ogg',
        'https://fallenhuman.neocities.org/seni/text5.ogg'
    ];

    const audioObjects = soundUrls.map(url => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        return audio;
    });

    const lightbox = createLightbox(useWhiteLightbox);
    document.body.appendChild(lightbox);

    let output = document.getElementById("text");
    if (!output) {
        const textboxData = createTextbox(characterDisplayName, showCharacter, emotions[0]);
        output = textboxData.output; // ~ Get the output from the created textbox
        document.body.appendChild(textboxData.textboxContainer);
    }

    let textIndex = 0;
    let textToDisplay = prewrittenTexts[textIndex];
    let i = 0;
    let interval;
    let playSoundFlag = true;
    let waitingForEnter = true;

    function playSound() {
        if (playSoundFlag) {
            const randomIndex = Math.floor(Math.random() * audioObjects.length); // ! Randomly select from the audioURLs
            audioObjects[randomIndex].currentTime = 0;
            audioObjects[randomIndex].play();
        }
        playSoundFlag = !playSoundFlag;
    }

    function typeNextChar() {
        if (i >= textToDisplay.length) { // ~ If the text is too long, create a new textbox, and wait for enter key press to continue
            clearInterval(interval);
            if (textIndex + 1 < prewrittenTexts.length) {
                waitingForEnter = true;
                document.addEventListener('keydown', handleEnterKey);
                document.addEventListener('touchend', handleTap); // ! Mobile Fallback
            } else {
                setTimeout(closeTextbox, 2000); // ? 2sec
            }
            return;
        }

        const letterToShow = textToDisplay[i];
        if (letterToShow === "{" && textToDisplay[i + 1] === "$" && textToDisplay[i + 2] === "b" && textToDisplay[i + 3] === "}") {
            setTimeout(() => { i += 4; typeNextChar(); }, 500);
            return;
        }

        output.textContent += letterToShow; 
        playSound();
        i++;

        interval = setTimeout(typeNextChar, 20); // ~ Time between typing the next letter
    }

    function startTypewriter() { // ! Reset before starting~
        output.textContent = ''; 
        i = 0;
        textToDisplay = prewrittenTexts[textIndex];

        if (showCharacter) {
            updateCharacterImage(characterDisplayName, emotions[textIndex]);
        }

        interval = setTimeout(typeNextChar, 20);
    }

    function closeTextbox() {
        const textboxContainer = document.querySelector('.textboxContainer');
        const textbox = document.querySelector('.textbox');
        if (textbox && textboxContainer) {
            textbox.style.animation = 'closing .2s linear forwards';
            textboxContainer.addEventListener('animationend', () => {
                document.body.removeChild(textboxContainer);
                document.body.removeChild(lightbox);
            });
        }
    }

    function handleEnterKey(event) {
        if (event.key === 'Enter' && waitingForEnter) {
            waitingForEnter = false;
            document.removeEventListener('keydown', handleEnterKey);
            document.removeEventListener('touchend', handleTap); // ~ Remove listener when done
            textIndex++;
            if (textIndex < prewrittenTexts.length) {
                startTypewriter();
            }
        }
    }

    function handleTap() {
        if (waitingForEnter) { // ~ Only handle tap if we are waiting for user input
            waitingForEnter = false;
            document.removeEventListener('touchend', handleTap); // ~ Remove listener after tap
            textIndex++;
            if (textIndex < prewrittenTexts.length) {
                startTypewriter();
            }
        }
    }

    setTimeout(startTypewriter, 500); // ! Slight delay for the text to play
}

// ? Build a Bitch

function createLightbox(useWhiteLightbox) {
    const lightbox = document.createElement('div');
    lightbox.classList.add(useWhiteLightbox ? 'lightbox2' : 'lightbox', 'show');
    return lightbox;
}

function createTextbox(characterDisplayName, showCharacter, emotion) {
    const textboxContainer = document.createElement('div');
    textboxContainer.classList.add('textboxContainer');

    const textboxWrapper = document.createElement('div');
    textboxWrapper.classList.add('textboxWrapper');

    const topWrapper = document.createElement('div');
    topWrapper.classList.add('topWrapper');

    if (showCharacter) {
        const characterName = document.createElement('p');
        characterName.classList.add('characterName');
        characterName.textContent = characterDisplayName.replace(/^DW/i, '');

        const charName = characterDisplayName.toLowerCase().replace(/\s/g, '');
        const characterIMG = document.createElement('img');
        characterIMG.classList.add('characterIMG');
        characterIMG.src = `${window.location.origin}/OMORI/img/${charName}_${emotion}.gif`;

        topWrapper.appendChild(characterName);
        topWrapper.appendChild(characterIMG);
    }

    const textbox = document.createElement('div');
    textbox.classList.add('textbox');

    const cursorImg = document.createElement('img');
    cursorImg.classList.add('cursor');
    cursorImg.src = `${window.location.origin}/OMORI/img/cursor.png`;
    textbox.appendChild(cursorImg);

    const output = document.createElement('div');
    output.id = 'text';
    textbox.appendChild(output);

    textboxWrapper.appendChild(topWrapper);
    textboxWrapper.appendChild(textbox);
    textboxContainer.appendChild(textboxWrapper);

    return { textboxContainer, output }; // ! Remember to return both
}

function updateCharacterImage(characterDisplayName, emotion) {
    const charName = characterDisplayName.toLowerCase().replace(/\s/g, '');
    const characterIMG = document.querySelector('.characterIMG');
    if (characterIMG) {
        characterIMG.src = `${window.location.origin}/OMORI/img/${charName}_${emotion}.gif`;
    }
}