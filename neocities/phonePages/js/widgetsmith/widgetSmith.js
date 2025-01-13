document.addEventListener('DOMContentLoaded', () => {
    let selectedImageURL = '';
    let shape = null;
    let filter = 'none';
    let customFilters = JSON.parse(localStorage.getItem('customFilters')) || [];
    let widgetId = getStoredWidgets()

    const imageInput = document.getElementById('imageInput');
    const shapeInput = document.getElementById('shapeInput');
    const filterInput = document.getElementById('filterInput');
    const saveWidgetButton = document.getElementById('saveWidget');
    const clearPreviewButton = document.getElementById('clearPreview');
    const clearAllWidgetsButton = document.getElementById('clearAllWidgets');
    const createNewWidgetButton = document.getElementById('createNewWidget');

    // const customGrayscaleInput = document.getElementById('customGrayscale');
    // const customBlurInput = document.getElementById('customBlur');
    // const customSaturateInput = document.getElementById('customSaturate');
    // const saveCustomFilterButton = document.getElementById('saveCustomFilter');

    const previewAll = document.getElementById('previewAll');
    const customize = document.getElementById('customize');
    const edit = document.getElementById('edit');
    const backButtons = document.querySelectorAll('.back');

    loadSavedWidgets();
    updateWidgetBtn();

    // & Helper Functions

    function getStoredWidgets() {
        return parseInt(localStorage.getItem('widgetId')) || 1; 
    }

    function toggleCustomizeSection() {
        const isCustomizeVisible = customize.style.display === 'block';
        previewAll.style.display = isCustomizeVisible ? 'flex' : 'none';
        customize.style.display = isCustomizeVisible ? 'none' : 'block';

        if (!isCustomizeVisible) resetPreview();
    }

    function toggleEditSection(editSectionVisible) {
        edit.style.display = editSectionVisible ? 'block' : 'none';
        previewAll.style.display = editSectionVisible ? 'none' : 'flex';
    }

    function updateWidgetSettings(widgetSettings) {
        const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
        const widgetIndex = savedWidgets.findIndex(w => w.id === widgetSettings.id);

        if (widgetIndex !== -1) {
            savedWidgets[widgetIndex] = widgetSettings;
            localStorage.setItem('widgets', JSON.stringify(savedWidgets));
        }
    }

    function goBack() {
        previewAll.style.display = 'flex';
        customize.style.display = 'none';
        edit.style.display = 'none';
    }

    function updateWidgetBtn() {
        const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
        createNewWidgetButton.style.display = savedWidgets >= 1 ? 'none' : 'block';
    }

    function loadSavedWidgets() {
        const savedWidgets = getStoredWidgets();
        savedWidgets.forEach(updateWidgetDSP);
    }

    function clearAllWidgets() {
        localStorage.removeItem('widgets');
        localStorage.removeItem('widgetId');
        window.location.reload();
        updateWidgetBtn();
    }

    function imageUploader(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                selectedImageURL = event.target.result;
                const widgetPreviewObject = document.getElementById('widgetObject');
                widgetPreviewObject.setAttribute('data', selectedImageURL);
                updateWidgetPV(widgetPreviewObject, shape, filter);
            };
            reader.readAsDataURL(file);
        }
    }

    function resetPreview() {
        selectedImageURL = '';
        shape = 'square';
        filter = 'none';

        const widgetPreviewObject = document.getElementById('widgetObject');
        widgetPreviewObject.setAttribute('data', '');
        widgetPreviewObject.style.borderRadius = '0';
        widgetPreviewObject.style.filter = 'none';

        document.getElementById('imageInput').value = '';
        document.getElementById('shapeInput').value = 'square';
        document.getElementById('filterInput').value = 'none';
    }

    function loadSavedWidgets() {
        const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
        savedWidgets.forEach((widget) => {
            updateWidgetDSP(widget);
            // console.log(widget);
        });
    }

    // function createCustomFilter() {
    //     const grayscale = customGrayscaleInput.value;
    //     const blur = customBlurInput.value;
    //     const saturate = customSaturateInput.value;
    //     return `grayscale(${grayscale}%) blur(${blur}px) saturate(${saturate}%)`;
    // }

    // function applyCustomFilter(widgetObject) {
    //     const grayscale = customGrayscaleInput.value;
    //     const blur = customBlurInput.value;
    //     const saturate = customSaturateInput.value;

    //     const filterValue = `grayscale(${grayscale}%) blur(${blur}px) saturate(${saturate}%)`;
    //     widgetObject.style.filter = filterValue;
    // }

    // & Main Functions

    function saveWidget() {
        if (!selectedImageURL) {
            return;
        }

        const filterValue = filterMap[filter] || 'none';

        // If a custom filter exists, use that instead of the preset ones
        const customFilterValue = customFilters.length > 0 ? createCustomFilter() : filterValue;

        const widgetSettings = {
            id: `widget${widgetId}`,
            image: selectedImageURL,
            shape: shape,
            filterName: 'custom',
            filterValue: customFilterValue // Save the custom filter value
        };

        const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];

        if (savedWidgets.length >= 1) {
            return;
        }

        savedWidgets.push(widgetSettings);
        localStorage.setItem('widgets', JSON.stringify(savedWidgets));

        widgetId++;
        localStorage.setItem('widgetId', widgetId);

        updateWidgetDSP(widgetSettings);

        toggleCustomizeSection();
        resetPreview();
        updateWidgetBtn();
    }

    function updateWidgetPV(widgetPreviewObject, shape, filter) {
        const shapeStyle = shapeStyles[shape] || { clipPath: 'none', mask: 'none' };
        widgetPreviewObject.style.clipPath = shapeStyle.clipPath;
        widgetPreviewObject.style.mask = shapeStyle.mask;

        const filterMap = {
            none: 'none',
            grayscale: 'grayscale(100%)',
            sepia: 'sepia(100%)',
            blur: 'blur(5px)',
            invert: 'invert(100%)',
            saturate: 'saturate(2)',
            contrast: 'contrast(200%)'
        };

        widgetPreviewObject.style.filter = filterMap[filter] || 'none';
    }

    function updateWidgetDSP(widgetSettings) {
        const widgetClone = document.createElement('object');
        widgetClone.classList.add('widgetItem');
        widgetClone.setAttribute('type', 'image/svg+xml');
        widgetClone.setAttribute('data', widgetSettings.image);

        const shapeStyle = shapeStyles[widgetSettings.shape] || { clipPath: 'none', mask: 'none' };
        widgetClone.style.clipPath = shapeStyle.clipPath;
        widgetClone.style.mask = shapeStyle.mask;
        widgetClone.style.filter = widgetSettings.filterValue; 

        const editButton = document.createElement('button');
        editButton.innerHTML = '<iconify-icon icon="fa:gear"></iconify-icon>';
        editButton.classList.add('editWidget');
        editButton.addEventListener('click', () => loadWidgetForEditing(widgetSettings));

        const container = document.createElement('div');
        container.classList.add('widgetWrapper');
        container.appendChild(widgetClone);
        container.appendChild(editButton);

        document.getElementById('yourWidgets').appendChild(container);
        document.getElementById('yourWidgets').appendChild(createNewWidgetButton);
    }


    function loadWidgetForEditing(widgetSettings) {
        const editShapeInput = document.getElementById('editShapeInput');
        const editFilterInput = document.getElementById('editFilterInput');
        const editWidgetObject = document.getElementById('editWidgetObject');

        toggleEditSection(true);

        // console.log(widgetSettings.filterName);

        if (editWidgetObject) {
            editWidgetObject.setAttribute('data', widgetSettings.image);
        }

        if (editShapeInput) {
            editShapeInput.value = widgetSettings.shape;
        }

        if (editFilterInput) {
            editFilterInput.value = widgetSettings.filterName === 'custom' || !widgetSettings.filterName
                    ? 'none'
                    : widgetSettings.filterName;
        }

        updateWidgetPV(editWidgetObject, widgetSettings.shape, widgetSettings.filterName);

        if (editShapeInput && editWidgetObject) {
            editShapeInput.addEventListener('change', () => {
                updateWidgetPV(editWidgetObject, editShapeInput.value, editFilterInput.value);
            });
        }

        if (editFilterInput) {
            editFilterInput.addEventListener('change', () => {
                updateWidgetPV(editWidgetObject, editShapeInput.value, editFilterInput.value);
            });
        }

        document.getElementById('saveEditedWidget').addEventListener('click', () => {
            widgetSettings.filterName = editFilterInput.value;
            widgetSettings.filterValue = filterMap[editFilterInput.value] || 'none';
            widgetSettings.shape = editShapeInput.value;

            updateWidgetSettings(widgetSettings);

            const editWidgetObject = document.getElementById('editWidgetObject');
            updateWidgetPV(editWidgetObject, widgetSettings.shape, widgetSettings.filterName);

            toggleEditSection(false);
            window.location.reload();
        });

        document.getElementById('deleteWidget').addEventListener('click', () => {
            const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
            const widgetIndex = savedWidgets.findIndex(w => w.id === widgetSettings.id);

            if (confirm('Are you sure you want to delete this widget?')) {
                if (widgetIndex !== -1) {
                    savedWidgets.splice(widgetIndex, 1);
                    localStorage.setItem('widgets', JSON.stringify(savedWidgets));

                    toggleEditSection(false);
                    window.location.reload();
                } else {
                    return
                }
            }
        });

        updateWidgetPV(editWidgetObject, widgetSettings.shape, widgetSettings.filterName);
    }

    // & Event listeners
    createNewWidgetButton.addEventListener('click', toggleCustomizeSection);
    clearAllWidgetsButton.addEventListener('click', clearAllWidgets);

    backButtons.forEach((btn) => btn.addEventListener('click', goBack));

    imageInput.addEventListener('change', imageUploader);
    shapeInput.addEventListener('change', () => {
        shape = shapeInput.value;
        updateWidgetPV(document.getElementById('widgetObject'), shape, filter);
    });
    filterInput.addEventListener('change', () => {
        filter = filterInput.value;
        updateWidgetPV(document.getElementById('widgetObject'), shape, filter);
    });

    // saveCustomFilterButton.addEventListener('click', () => {
    //     const customFilter = {
    //         grayscale: customGrayscaleInput.value,
    //         blur: customBlurInput.value,
    //         saturate: customSaturateInput.value
    //     };

    //     customFilters.push(customFilter);
    //     localStorage.setItem('customFilters', JSON.stringify(customFilters));

    //     alert('Custom filter saved!');
    // });

    // customGrayscaleInput.addEventListener('input', () => {
    //     const widgetObject = document.getElementById('widgetObject');
    //     applyCustomFilter(widgetObject);
    // });

    // customBlurInput.addEventListener('input', () => {
    //     const widgetObject = document.getElementById('widgetObject');
    //     applyCustomFilter(widgetObject);
    // });

    // customSaturateInput.addEventListener('input', () => {
    //     const widgetObject = document.getElementById('widgetObject');
    //     applyCustomFilter(widgetObject);
    // });

    clearPreviewButton.addEventListener('click', resetPreview);
    saveWidgetButton.addEventListener('click', saveWidget);
});
