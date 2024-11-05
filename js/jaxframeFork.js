var jaxframe = {
    isgif: function (src) {
        return /^(?!data:).*\.(gif|webp)$/i.test(src);
    },
    stop: function () {
        var blacklist = [];

        var images = document.querySelectorAll("img");

        images.forEach(function (img) {
            if (blacklist.includes(img.src)) {
                return;
            }

            if (jaxframe.isgif(img.src)) {
                var canvas = document.createElement("canvas"),
                    ctx = canvas.getContext("2d"),
                    width = img.naturalWidth,
                    height = img.naturalHeight;
                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.onclick = img.onclick;

                canvas.setAttribute("data-src", img.src);
                canvas.className = img.className;
                canvas.id = img.id;

                img.parentNode.replaceChild(canvas, img);
            }
        });

        localStorage.setItem('gifState', 'stopped');
    },
    start: function () {
        var canvases = document.querySelectorAll("canvas[data-src]");

        canvases.forEach(function (canvas) {
            var img = document.createElement("img");
            
            img.src = canvas.getAttribute("data-src");
            img.alt = canvas.alt; 
            img.className = canvas.className;
            img.id = canvas.id;

            img.width = canvas.width;
            img.height = canvas.height;

            canvas.parentNode.replaceChild(img, canvas);
        });

        localStorage.setItem('gifState', 'playing');
    },
    applyState: function () {
        var gifState = localStorage.getItem('gifState');
        if (gifState === 'stopped') {
            jaxframe.stop();
        } else {
            jaxframe.start();
        }
    }
};

window.addEventListener('message', function (event) {
    if (event.data && event.data.command === 'playing') {
        jaxframe.start();
    } else if (event.data && event.data.command === 'stopped') {
        jaxframe.stop();
    }
});


window.addEventListener('load', function () {
    jaxframe.applyState();
});
