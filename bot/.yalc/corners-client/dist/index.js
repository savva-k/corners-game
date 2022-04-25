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
var socket_io_client_1 = require("socket.io-client");
var client = function () {
    var socket;
    var connect = function (protocol, host, port) {
        var server = "".concat(protocol, "://").concat(host, ":").concat(port);
        console.log('connecting to ' + server);
        if (socket)
            socket.close();
        socket = (0, socket_io_client_1.io)(server);
        console.log(socket);
        return __assign(__assign(__assign({}, (0, UserActions_1.default)(socket)), (0, ServerEvents_1.default)(socket)), (0, Websocket_1.default)(socket));
    };
    return {
        connect: connect
    };
};
exports.default = client();
