const shapeStyles = {
    square: {
        clipPath: 'none',
        mask: 'none'
    },
    circle: {
        clipPath: 'circle(50%)',
        mask: 'none'
    },
    rounded: {
        clipPath: 'inset(0% round 20%)',
        mask: 'none'
    },
    star: {
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        mask: 'none'
    },
    heart: {
        clipPath: 'polygon(-41% 0,50% 91%, 141% 0)',
        mask: `
            radial-gradient(at 70% 31%,#000 29%,#0000 30%),
            radial-gradient(at 30% 31%,#000 29%,#0000 30%),
            linear-gradient(#000 0 0) bottom/100% 50% no-repeat
        `
    },
    diamond: {
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        mask: 'none'
    },
    leaf: {
        clipPath: 'polygon(49% 1%, 33% 33%, 0 18%, 13% 49%, 0% 82%, 19% 77%, 44% 70%, 46% 100%, 53% 100%, 56% 70%, 83% 76%, 100% 82%, 84% 46%, 100% 18%, 63% 33%)',
        mask: 'none'
    },
    lightning: {
        clipPath: 'polygon(65% 0, 11% 0, 48% 26%, 0 54%, 74% 100%, 54% 59%, 100% 22%)',
        mask: 'none'
    }    
};

const filterMap = {
    none: 'none',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    blur: 'blur(5px)',
    invert: 'invert(100%)',
    saturate: 'saturate(150%)',
    contrast: 'contrast(200%)'
};