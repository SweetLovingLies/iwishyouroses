document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('#buttons button');
    const clearButton = document.getElementById('clear');

    let currentInput = '';

    clearButton.addEventListener('click', () => {
        currentInput = '';
        display.value = '';
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === '=') {
                try {
                    const result = safeEvaluate(currentInput);
                    display.value = result;
                    currentInput = result.toString();

                    if (result === 395248) {
                        window.top.location.href = '/funValue/biteof83.html';
                    }
                } catch (e) {
                    display.value = 'Error';
                    currentInput = '';
                }
            } else {
                currentInput += value;
                display.value = currentInput;
            }
        });
    });

    // ! Not using eval for safety purposes!
    function safeEvaluate(expression) {
        if (!/^[0-9+\-*/(). ]+$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        return new Function(`return ${expression}`)();
    }



    // ! Theme Switcher

    const themeLinks = Array.from(document.querySelectorAll("link[id^='calculator']"));
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
});