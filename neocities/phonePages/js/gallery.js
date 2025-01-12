const gridView = document.getElementById('gridView');
const lightboxView = document.getElementById('lightboxView');
const lightboxImage = document.getElementById('lightboxImage');
const imgDate = lightboxView.querySelector('footer strong');
const imgName = lightboxView.querySelector('footer p');
const backButton = lightboxView.querySelector('#back');

function openLightbox(e) {
    gridView.setAttribute('aria-hidden', 'true');
    lightboxView.setAttribute('aria-hidden', 'false');

    const ogIMG = e.target;
    const imgDimensions = ogIMG.getBoundingClientRect(); // ! Gives current size of image on the DOM (Because it starts out scaled)

    const cloneIMG = ogIMG.cloneNode();
    cloneIMG.classList.add('imgAni');

    // Starting size
    cloneIMG.style.top = `${imgDimensions.top}px`;
    cloneIMG.style.left = `${imgDimensions.left}px`;
    cloneIMG.style.width = `${imgDimensions.width}px`;
    cloneIMG.style.height = `${imgDimensions.height}px`;

    document.body.appendChild(cloneIMG);

    // Making a new image to get the natural size of said image. 
    const tempIMG = new Image();
    tempIMG.src = ogIMG.src;

    tempIMG.onload = () => {
        // Get the base dimensions of the image
        const baseWidth = tempIMG.naturalWidth;
        const baseHeight = tempIMG.naturalHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const aspectRatio = baseWidth / baseHeight;

        let targetWidth;
        let targetHeight;

        if (baseWidth > viewportWidth || baseHeight > viewportHeight) {
            if (aspectRatio > 1) {
                // Wider than tall
                targetWidth = viewportWidth * 0.9;
                targetHeight = targetWidth / aspectRatio;
            } else {
                // Taller than wide
                targetHeight = viewportHeight * 0.9;
                targetWidth = targetHeight * aspectRatio;
            }
        } else {
            targetWidth = baseWidth;
            targetHeight = baseHeight;
        }

        // console.log('Chicken Wing!');
        document.body.appendChild(cloneIMG);
        cloneIMG.getBoundingClientRect(); // Hopefully fix the animation not playing sometimes by regetting the dimensions 

        setTimeout(() => {
            cloneIMG.style.top = `50%`;
            cloneIMG.style.left = `50%`;
            cloneIMG.style.width = `${targetWidth}px`;
            cloneIMG.style.height = `${targetHeight}px`;
            cloneIMG.style.transform = `translate(-50%, -50%)`;
        }, 0);


        cloneIMG.addEventListener('transitionend', () => {
            // console.log('Chicken bone!');
            if (document.body.contains(cloneIMG)) {
                document.body.removeChild(cloneIMG);
            }

            lightboxImage.src = ogIMG.src;

            const dateTitle = ogIMG.closest('.IMGWrapper').previousElementSibling.textContent;
            const fileName = ogIMG.src.split('/').pop();

            imgDate.textContent = `${dateTitle}`;
            imgName.textContent = fileName;

            gridView.style.display = 'none';
            lightboxView.style.display = 'block';


            function isActivationKey(event) {
                return event.key === 'Enter' || event.key === ' ';
            }

            lightboxImage.addEventListener('click', toggleLBTheme);

            lightboxImage.addEventListener('keydown', (e) => {
                if (isActivationKey(e)) {
                    toggleLBTheme(e);
                }
            });

            backButton.addEventListener('click', closeLightbox);
            backButton.addEventListener('keydown', (e) => {
                if (isActivationKey(e)) {
                    closeLightbox();
                }
            });
            backButton.focus();
        });
    };
}

function toggleLBTheme() {
    lightboxView.classList.toggle('active');
}

function closeLightbox() {
    lightboxView.style.display = 'none';
    gridView.style.display = 'block';

    lightboxView.setAttribute('aria-hidden', 'true');
    gridView.setAttribute('aria-hidden', 'false');
    gridView.querySelector('.IMGPreview').focus();
}

const images = gridView.querySelectorAll('.IMGPreview');
images.forEach((img) => {
    img.addEventListener('click', openLightbox);
});

images.forEach((img) => {
    img.setAttribute('tabindex', '0');

    img.addEventListener('click', openLightbox);

    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openLightbox(e);
        }
    });
});

// Themeswitcher

document.addEventListener("DOMContentLoaded", function () {
    const themeLinks = Array.from(document.querySelectorAll("link[id^='gallery']"));
    const savedTheme = localStorage.getItem("globalTheme") || "light";
    const pageName = window.location.pathname.split('/').pop().split('.')[0];

    const availableThemes = themeLinks.map(link => link.id.replace(pageName, '').replace('CSS', '').toLowerCase());
    const validTheme = (availableThemes.includes(savedTheme) && themeLinks.some(link => link.getAttribute("data-theme") === savedTheme))
        ? savedTheme
        : "light";

    const body = document.body;
    if (savedTheme === "dark") {
        body.classList.add("dark");
        console.log("dark mode initiated");
    } else {
        body.classList.remove("dark");
        console.log("dark mode deactivated");
    }

    themeLinks.forEach(link => link.disabled = link.getAttribute("data-theme") !== validTheme);
});