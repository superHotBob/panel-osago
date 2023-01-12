module.exports = {
    svgoConfig: {
        plugins: {
            removeViewBox: false,
            cleanupIDs: false,
            removeUnknownsAndDefaults: false,
        },
    },
    template: require('./svg-transform-template'),
}