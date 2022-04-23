"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserActions_1 = require("./UserActions");
var ServerEvents_1 = require("./ServerEvents");
var Websocket_1 = require("./Websocket");
var client = function () {
    var ws;
    var connect = function (protocol, host, port) {
        var server = "".concat(protocol, "://").concat(host, ":").concat(port);
        if (ws)
            ws.close();
        ws = new WebSocket(server);
    };
    var getWs = function () {
        if (!ws)
            throw "Please connect to a server first";
        return ws;
    };
    return __assign(__assign(__assign({ connect: connect }, (0, UserActions_1.default)(getWs)), (0, ServerEvents_1.default)(getWs)), (0, Websocket_1.default)(getWs));
};
exports.default = client();
