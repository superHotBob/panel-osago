export const isInViewport = elem => {
    const elemBounding = elem.getBoundingClientRect();
    return (
        elemBounding.top >= 0 &&
        elemBounding.left >= 0 &&
        elemBounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        elemBounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
