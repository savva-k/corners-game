"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (getWs) {
    return {
        onopen: function (f) { return getWs().onopen = f; },
        onclose: function (f) { return getWs().onclose = f; },
        onerror: function (f) { return getWs().onerror = f; },
    };
});
