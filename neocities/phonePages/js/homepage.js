// ~ Open App
function openApp(event, appElement) {
    event.preventDefault();

    if (appElement.classList.contains('open')) return;

    appElement.classList.add('open');

    const appHref = appElement.getAttribute('href');

    incrementAppOpenedCount();

    setTimeout(() => {
        parent.document.getElementById('phoneScreen').src = appHref;
    }, 350);
}

// ~ Homepages
let currentHomepage = parseInt(localStorage.getItem('currentHomepage')) || 0;
const homepages = document.querySelectorAll('.homepage');
const navDots = document.querySelectorAll('.navDots');

function showHomepage(index) {
    homepages.forEach((homepage, i) => {
        if (i === index) {
            homepage.classList.remove('hidden');
            homepage.classList.add('active');
        } else {
            homepage.classList.add('hidden');
            homepage.classList.remove('active');
        }
    });

    navDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
            dot.classList.remove('inactive');
        } else {
            dot.classList.add('inactive');
            dot.classList.remove('active');
        }
    });

    localStorage.setItem('currentHomepage', index);
}

document.addEventListener('swiped-right', () => {
    currentHomepage = (currentHomepage > 0) ? currentHomepage - 1 : homepages.length - 1;
    showHomepage(currentHomepage);
});

document.addEventListener('swiped-left', () => {
    currentHomepage = (currentHomepage < homepages.length - 1) ? currentHomepage + 1 : 0;
    showHomepage(currentHomepage);
});

navDots.forEach((dot, i) => {
    if (i === currentHomepage) {
        dot.classList.add('active');
        dot.classList.remove('inactive');
    } else {
        dot.classList.add('inactive');
        dot.classList.remove('active');
    }
});
showHomepage(currentHomepage);

document.addEventListener('DOMContentLoaded', () => {

    // ~ Drag and drop
    const appElements = document.querySelectorAll('.app');
    const widgetElements = document.querySelectorAll('.widget');
    const appWrapper = document.querySelector('.appWrapper');

    // Allow elements to be draggable
    appElements.forEach(app => {
        app.setAttribute('draggable', 'true');
        app.addEventListener('dragstart', handleDragStart);
        app.addEventListener('dragover', handleDragOver);
        app.addEventListener('drop', handleDrop);
    });

    widgetElements.forEach(widget => {
        widget.setAttribute('draggable', 'true');
        widget.addEventListener('dragstart', handleDragStart);
        widget.addEventListener('dragover', handleDragOver);
        widget.addEventListener('drop', handleDrop);
    });

    let draggedItem = null;

    // Function to handle the drag start event
    function handleDragStart(event) {
        draggedItem = event.target;
        setTimeout(() => {
            draggedItem.style.opacity = 0.5;
        }, 0);
    }

    // Function to handle the drag over event
    function handleDragOver(event) {
        event.preventDefault();
    }

    // Function to handle the drop event
    function handleDrop(event) {
        event.preventDefault();
        if (event.target !== draggedItem) {
            // Reorder the dragged element in the DOM
            const allItems = Array.from(appWrapper.children);
            const targetIndex = allItems.indexOf(event.target);
            const draggedIndex = allItems.indexOf(draggedItem);

            if (targetIndex < draggedIndex) {
                appWrapper.insertBefore(draggedItem, event.target);
            } else {
                appWrapper.insertBefore(draggedItem, event.target.nextSibling);
            }

            // Optional: Call a function to update widget visibility
            updateWidgetVisibility();
        }

        draggedItem.style.opacity = 1;
        draggedItem = null;
    }

    function updateWidgetVisibility() {
        const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
        const widgetContainer = document.querySelector('.widgetColumn'); 

        if (savedWidgets.length > 0) {
            widgetContainer.style.display = 'flex';
        } else {
            widgetContainer.style.display = 'none';
        }
    }

    updateWidgetVisibility();
});


// ~ ThemeSwitcher

document.addEventListener("DOMContentLoaded", function () {
    const themeLinks = Array.from(document.querySelectorAll("link[id^='homepage']"));
    const savedTheme = localStorage.getItem("globalTheme") || "light";
    const pageName = window.location.pathname.split('/').pop().split('.')[0];

    const availableThemes = themeLinks.map(link =>
        link.id.replace(pageName, '').replace('CSS', '').toLowerCase()
    );

    const validTheme = (availableThemes.includes(savedTheme) &&
        themeLinks.some(link => link.getAttribute("data-theme") === savedTheme))
        ? savedTheme
        : "light";

    themeLinks.forEach(link => {
        link.disabled = link.getAttribute("data-theme") !== validTheme;
    });
    // ~ Widgets

    const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];

    savedWidgets.forEach((widget) => {
        const widgetElement = document.getElementById(widget.id);

        if (widgetElement) {
            widgetElement.setAttribute('data', widget.image);

            const shapeStyle = shapeStyles[widget.shape] || { clipPath: 'none', mask: 'none' };

            widgetElement.style.clipPath = shapeStyle.clipPath;
            widgetElement.style.mask = shapeStyle.mask;
            widgetElement.style.filter = widget.filterValue;
        }
    });
});