'use strict';

module.exports = function (config) {
    config.set({
        basePath: '.',

        files: [
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'app/xml.js',
            'app/xdom2jso.js',
            {pattern: 'app/**/spec.js', watched: true, included: true, served: true, nocache: true},
            {pattern: 'tst/*.xml', watched: false, included: false, served: true, nocache: true}
        ],

        autoWatch: true,

        logLevel: config.LOG_DEBUG,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-spec-reporter'],

        reporters: ["spec"],

        specReporter: {
            maxLogLines: 50,
            suppressFailed: false,
            suppressPassed: false,
            suppressSkipped: false,
            suppressErrorSummary: true
        }
    });
};
