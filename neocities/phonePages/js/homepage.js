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

// ~ Widgets

function initializeWidgets() {
    const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
    const homepage1 = document.getElementById('homepage1');
    if (!homepage1) return;

    const appWrapper = homepage1.querySelector('#aw1');
    if (!appWrapper) return;

    // Handle widget rendering
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

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
        console.log("THIS WEB BROWSER STINKS !")
        handleSafariFallback();
    } else {
        updateLayout(savedWidgets);
    }

    // Function to update layout based on if there is a widget or not
    function updateLayout(widgets) {
        const widgetColumn = appWrapper.querySelector('#widgetColumn');
        const column1 = appWrapper.querySelector('#column1');
        const defaultApps = `
            <a href="nav.html" id="nav" class="app draggable-item" onclick="openApp(event, this)">
                        <div class="appIcon">
                            <img src="/Assets/myAssets/appIcons/navIcon.png">
                        </div>
                        <p>Navigation</p>
                    </a>
                    <a href="idolMessenger.html" id="idolMessenger" class="app draggable-item" onclick="openApp(event, this)">
                        <div class="appIcon">
                            <img src="/Assets/myAssets/appIcons/idolMessengerIcon.png">
                        </div>
                        <p>Idol Messenger</p>
                    </a>
        `;

        const savedOrder = JSON.parse(localStorage.getItem('column1Order')) || [];
        if (widgets.length > 0) {
            if (!widgetColumn) {
                const newWidgetColumn = document.createElement('div');
                newWidgetColumn.classList.add('widgetColumn');
                newWidgetColumn.innerHTML = `
                    <object class="widget" id="widget1" type="image/svg+xml" data="${widgets[0].data || ''}"></object>
                    <p>Widgetsmith</p>
                `;
                appWrapper.insertBefore(newWidgetColumn, column1);
            }

            if (savedOrder.length === 0) {
                if (!column1) {
                    const newColumn1 = document.createElement('div');
                    newColumn1.classList.add('column1');
                    newColumn1.innerHTML = defaultApps;
                    appWrapper.appendChild(newColumn1);
                }
            } else {
                if (!column1) {
                    const newColumn1 = document.createElement('div');
                    newColumn1.classList.add('column1');
                    appWrapper.appendChild(newColumn1);
                }
            }
        } else {
            if (widgetColumn) {
                appWrapper.removeChild(widgetColumn);
                appWrapper.insertAdjacentHTML('afterbegin', defaultApps);
            }
            if (column1) {
                column1.style.display = 'none';
            }
        }

        initializeSortable();
        loadSavedOrder("column1", 'column1Order');
        loadSavedOrder("aw1", 'homepage1Order');
        loadSavedOrder("tray", 'trayOrder');
        loadSavedOrder("aw2", 'homepage2Order');
    }

    function handleSafariFallback() {
        const widgetsmithApp = document.getElementById("widgetsmith");
        const widgetColumn = appWrapper.querySelector('#widgetColumn');
        if (widgetsmithApp && widgetColumn) {
            widgetsmithApp.style.display = "none";
            widgetColumn.style.display = "none";
        }
        
    }
}

// ~ Sortable

function initializeSortable() {
    const containers = document.querySelectorAll('.draggable-container');
    containers.forEach(container => {
        new Sortable(container, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            draggable: ".draggable-item",
            filter: ".widgetColumn", // No drag for you!
            onEnd: function () {
                const newOrder = Array.from(container.children).map(item => item.id).filter(id => id !== "");
                // console.log(`New ${container.id} Order:`, newOrder);

                overflowCheck(); 
                saveOrders();
            },
            group: {
                name: "shared",
                pull: true,
                put: true
            },
            onAdd: function () {
                saveOrders();
            }


        });
    });
}

const loadSavedOrder = (containerId, orderKey) => {
    const savedOrder = JSON.parse(localStorage.getItem(orderKey));
    // console.log(orderKey);
    const container = document.getElementById(containerId);

    if (!container) return;

    if (!savedOrder || savedOrder.length === 0) {
        // console.log(`No saved order found for ${containerId}. Defaulting!`);
        const defaultOrder = Array.from(container.children).map(item => item.id).filter(id => id !== "");
        localStorage.setItem(orderKey, JSON.stringify(defaultOrder));
        return;
    }

    if (savedOrder.length > 0) {
        // console.log(`Loading saved order for ${containerId}:`, savedOrder);
        savedOrder.forEach(appID => {
            const app = document.getElementById(appID);
            if (app) {
                container.appendChild(app);
            } else {
                console.warn(`App ID ${appID} not found!`);
            }
        });
    }
};

function saveOrders() {
    const containers = document.querySelectorAll('.draggable-container');
    containers.forEach(container => {
        const newOrder = Array.from(container.children).map(item => item.id).filter(id => id !== "");
        if (container.id === "column1") {
            localStorage.setItem('column1Order', JSON.stringify(newOrder));
        } else if (container.id === "tray") {
            localStorage.setItem('trayOrder', JSON.stringify(newOrder));
        } else if (container.id === "aw1") {
            localStorage.setItem('homepage1Order', JSON.stringify(newOrder));
        } else if (container.id === "aw2") {
            localStorage.setItem('homepage2Order', JSON.stringify(newOrder));
        }
    });
}

function overflowCheck() {
    const appWrapper1 = document.querySelector("#aw1");
    const appWrapper2 = document.querySelector("#aw2");

    const limits = {
        column1: 2,
        tray: 3,
        aw1: 10, // 10 to account for column1 being a child of aw1
        aw2: 12
    };

    const containers = document.querySelectorAll('.draggable-container');
    
    containers.forEach(container => {
        const newOrder = Array.from(container.children).map(item => item.id).filter(id => id !== "");
        const containerId = container.id;
        const limit = limits[containerId];

        // Check if the container exceeds its limit
        if (newOrder.length > limit) {
            const excessItems = newOrder.slice(limit); // Get excess items

            // console.log(`${containerId} is overflowing with ${excessItems.length} items!`);

            if (containerId === "column1" && excessItems.length > 0) {
                // console.log("Moving excess items from column1 to AW1");
                excessItems.forEach(itemId => {
                    const item = document.getElementById(itemId);
                    if (item && appWrapper1) {
                        appWrapper1.appendChild(item);
                    }
                });
            }

            if (containerId === "tray" && excessItems.length > 0) {
                // console.log("Moving excess items from tray1 to AW1");
                excessItems.forEach(itemId => {
                    const item = document.getElementById(itemId);
                    if (item && appWrapper1) {
                        appWrapper1.appendChild(item);
                    }
                });
            }

            if (containerId === "aw1" && excessItems.length > 0) {
                // console.log("Moving excess items from AW1 to AW2");
                excessItems.forEach(itemId => {
                    const item = document.getElementById(itemId);
                    if (item && appWrapper2) {
                        appWrapper2.appendChild(item);
                    }
                });
            }

            if (containerId === "aw2" && excessItems.length > 0) {
                // console.log("Moving excess items from AW2 to AW1");
                excessItems.forEach(itemId => {
                    const item = document.getElementById(itemId);
                    if (item && appWrapper2) {
                        appWrapper1.appendChild(item);
                    }
                });
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeWidgets();

    const topPath = window.top.location.pathname.split('/').pop();
    const topPageName = topPath ? topPath.split('.')[0] : "index";

    if (topPageName !== 'bloom') {
        const themesApp = document.getElementById('themes');
        if (themesApp) {
            themesApp.style.display = 'none'; 
        }
    }

    // ! If needed 
    // clearAppOrder("aw1");
    // clearAppOrder("aw2");
    // clearAppOrder("tray");
    // clearAppOrder("column1");
});

// Debug
function clearAppOrder(containerId) {
    localStorage.removeItem(`${containerId}Order`);
    // console.log(`${containerId} order has been reset.`);
    loadSavedOrder(containerId, `${containerId}Order`);
}
