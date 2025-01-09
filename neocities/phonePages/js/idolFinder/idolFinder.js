// let mutualsData = []; // ! Debug Storage

document.addEventListener("DOMContentLoaded", () => {
    fetch('js/idolFinder/myMutuals.json')
        .then(response => response.json())
        .then(mutuals => {
            // mutualsData = mutuals;
            // console.log(mutuals); 

            const wrapper = document.getElementById('wrapper');
            const popover = document.getElementById('popover');
            const personaIcon = popover.querySelector('.personaIcon');
            const personaName = popover.querySelector('h2');
            const personaQuote = popover.querySelector('i');
            const siteButton = popover.querySelector('#siteButton a');
            const siteButtonImg = popover.querySelector('#siteButton img');
            const warning = document.getElementById('warning');
            const reputation = popover.querySelector('.repValue');
            const slider = popover.querySelector('.slider');
            const club = popover.querySelector('#club p');
            const loves = popover.querySelector('.loves');
            const hates = popover.querySelector('.hates');
            const otherInfo = popover.querySelector('#other');

            mutuals.forEach((mutual, index) => {
                // console.log(mutual); 
                // console.log(mutual.otherInfo);
                // console.log(mutual.siteButton.src);

                const button = document.createElement('button');
                button.dataset.index = index;
                button.innerHTML = `<img src="${mutual.icon.src}" alt="${mutual.icon.alt}"> ${mutual.name}`;
                wrapper.appendChild(button);

                button.addEventListener('click', () => {
                    warning.className = '';
                    warning.textContent = '';

                    if (Array.isArray(mutual.siteButton.warnings)) {
                        mutual.siteButton.warnings.forEach(warningType => {
                            switch (warningType) {
                                case 'minor':
                                    warning.classList.add('minorWarning');
                                    warning.textContent += 'The webmaster is a minor!';
                                    break;
                                case 'adult':
                                    warning.classList.add('adultWarning');
                                    warning.textContent += 'This site is suitable for adults ONLY!';
                                    break;
                                case 'epilepsy':
                                    warning.classList.add('epilepsyWarning');
                                    warning.textContent += 'This site contains flashing lights!';
                                    break;
                                case 'sensitivy':
                                    warning.classList.add('sensitivyWarning');
                                    warning.textContent += 'This site contains graphic or sensitive content!';
                                    break;
                                default:
                                    break;
                            }
                        });

                        warning.textContent = warning.textContent.trim();
                    } else {
                        return
                    }


                    personaIcon.src = mutual.icon.src;
                    personaIcon.alt = mutual.icon.alt;
                    personaName.textContent = mutual.name;
                    personaQuote.textContent = mutual.quote;

                    siteButton.href = mutual.siteButton.link;
                    siteButtonImg.src = mutual.siteButton.src;
                    siteButtonImg.alt = mutual.siteButton.alt;

                    reputation.textContent = `${mutual.reputation}`;
                    slider.dataset.reputation = mutual.reputation;
                    club.textContent = mutual.club;
                    loves.textContent = mutual.loves;
                    hates.textContent = mutual.hates;
                    otherInfo.textContent = mutual.otherInfo;

                    popover.classList.remove('hide');
                    popover.classList.add("show");

                    const reputationValue = parseInt(mutual.reputation, 10);  // Check reputation is parsed as a number
                    const minReputation = -100;
                    const maxReputation = 100;
                    const barWidth = popover.querySelector(".repbar").offsetWidth;

                    const position = ((reputationValue - minReputation) / (maxReputation - minReputation)) * barWidth - (slider.offsetWidth / 2);
                    slider.style.left = `${position}px`;

                    const exitButton = popover.querySelector(".exit");
                    exitButton.addEventListener("click", () => {
                        popover.classList.remove("show");
                        popover.classList.add("hide");

                        setTimeout(() => {
                            popover.classList.remove("show");
                            popover.classList.remove("hide");
                        }, 500); 
                    });
                });
            });
        });
});
