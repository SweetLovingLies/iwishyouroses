const imageInput = document.getElementById('imageInput');

function imageUploader(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const uploadedImageURL = event.target.result;

            const uploadPreview = document.getElementById('uploadPreview');
            uploadPreview.src = uploadedImageURL;

            document.querySelectorAll('.imgWrapper img').forEach(img => img.classList.remove('selected'));
            uploadPreview.classList.add('selected');
            uploadPreview.dataset.id = 'custom';
        };
        reader.readAsDataURL(file);
    }
}

imageInput.addEventListener('change', imageUploader);

const nameInput = document.getElementById('nameInput');
const iconGrid = document.getElementById('iconGrid');
const saveButton = document.getElementById('saveButton');
const clearPreview = document.getElementById('clearPreview');
const storedName = localStorage.getItem('userName');
const storedIcon = localStorage.getItem('selectedIcon');

if (storedName) nameInput.value = storedName;
if (storedIcon) {
    const storedImgElement = Array.from(document.querySelectorAll('.imgWrapper img'))
        .find(img => img.src.includes(storedIcon));
    if (storedImgElement) iconSelect(storedImgElement);
}

function iconSelect(imgElement) {
    document.querySelectorAll('.imgWrapper img').forEach(img => {
        img.classList.remove('selected');
    });

    imgElement.classList.add('selected');
}

saveButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const selectedIcon = document.querySelector('.selected');

    if (name && selectedIcon) {
        localStorage.setItem('userName', name);

        if (selectedIcon.dataset.id === 'custom') {
            localStorage.setItem('selectedIcon', selectedIcon.src);
        } else {
            localStorage.setItem('selectedIcon', selectedIcon.src);
        }

        alert('Changes saved successfully!');
    } else {
        alert('Please provide a name and select an icon.');
    }
});

clearPreview.addEventListener('click', () => {
    const uploadPreview = document.getElementById('uploadPreview');
    const imageInput = document.getElementById('imageInput');

    uploadPreview.src = '';
    imageInput.value = '';

    uploadPreview.classList.remove('selected');
});

// & Themeswitcher

const tabLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

tabLinks.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = tab.getAttribute('href').replace('#', '');
        activateTab(tabId);
    });
});

const activateTab = (tabId) => {
    tabLinks.forEach((tab) => {
        const isActive = tab.getAttribute('href') === `#${tabId}`;
        tab.classList.toggle('active', isActive);
    });

    sections.forEach((section) => {
        const isActive = section.id === tabId;
        section.classList.toggle('active', isActive);
        section.style.display = isActive ? 'block' : 'none';
    });
};

const initialTabId = 'one';
activateTab(initialTabId);