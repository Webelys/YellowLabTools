/**
 * Analyzes events bound to DOM elements
 */
/* global Document: true, Element: true, window: true */
'use strict';

exports.version = '0.2.a';

exports.module = function(phantomas) {
        phantomas.setMetric('eventsBound'); // @desc number of EventTarget.addEventListener calls

    // spy calls to EventTarget.addEventListener
    // @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
    phantomas.once('init', function() {
        phantomas.evaluate(function() {
            (function(phantomas) {
                function eventSpyBefore(eventType) {
                    /* jshint validthis: true */
                    var path = phantomas.getDOMPath(this);
                    //phantomas.log('DOM event: "' + eventType + '" bound to "' + path + '"');

                    phantomas.incrMetric('eventsBound');
                    phantomas.addOffender('eventsBound', '"%s" bound to "%s"', eventType, path);

                    phantomas.enterContext({
                        type: 'addEventListener',
                        callDetails: {
                            context: {
                                domElement: path
                            },
                            arguments: [eventType]
                        },
                        caller: phantomas.getCaller(1),
                        backtrace: phantomas.getBacktrace()
                    });
                }

                phantomas.spy(Element.prototype, 'addEventListener', eventSpyBefore, phantomas.leaveContext);
                phantomas.spy(Document.prototype, 'addEventListener', eventSpyBefore, phantomas.leaveContext);
                phantomas.spy(window, 'addEventListener', eventSpyBefore, phantomas.leaveContext);
            })(window.__phantomas);
        });
    });
};
