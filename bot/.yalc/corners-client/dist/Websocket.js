"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (socket) {
    return {
        onopen: function (f) { return socket.on("connection", function () { return f(); }); },
        onclose: function (f) {
            return socket.on("disconnect", function (reason) { return f(reason); });
        },
        onerror: function (f) {
            return socket.on("error", function (reason) { return f(reason); });
        },
    };
});
