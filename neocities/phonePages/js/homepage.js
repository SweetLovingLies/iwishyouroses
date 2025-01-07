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

document.addEventListener("DOMContentLoaded", function () {
    const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
    const homepage1 = document.getElementById('homepage1');
    const appWrapper = document.querySelector('.appWrapper');

    // Initial update of layout based on saved widgets
    updateLayout(savedWidgets);

    // Function to update layout
    function updateLayout(widgets) {
        const flexWrapper = document.querySelector('.flexWrapper');
        const appIconsHTML = `
            <a href="nav.html" class="app" onclick="openApp(event, this)">
                <div class="appIcon">
                    <img src="/Assets/customNavIcons/navIcon.png">
                </div>
                <p>Navigation</p>
            </a>
            <a href="idolMessenger.html" class="app" onclick="openApp(event, this)">
                <div id="idolMessenger" class="appIcon">
                    <img src="/Assets/customNavIcons/idolMessengerIcon.png">
                </div>
                <p>Idol Messenger</p>
            </a>
        `;

        if (widgets.length > 0) {
            if (!flexWrapper) {
                const newFlexWrapper = document.createElement('div');
                newFlexWrapper.classList.add = 'flexWrapper';
            
                const widgetColumn = document.createElement('div');
                widgetColumn.classList.add('widgetColumn');
                widgetColumn.innerHTML = `
                    <object class="widget" id="widget1" type="image/svg+xml" data="${widgets[0].data || ''}"></object>
                    <p>Widgetsmith</p>
                `;
                newFlexWrapper.appendChild(widgetColumn);
            
                const appsColumn = document.createElement('div');
                appsColumn.classList.add('column1');
                appsColumn.innerHTML = appIconsHTML;
                newFlexWrapper.appendChild(appsColumn);
            
                // Append to homepage1
                homepage1.insertBefore(newFlexWrapper, homepage1.querySelector('.appWrapper').firstChild);
            }            
        } else {
            if (flexWrapper) {
                flexWrapper.remove();
            }
            appWrapper.insertAdjacentHTML('afterbegin', appIconsHTML);
        }        
    }
});

