/**
 * Created by Costi on 4/13/2016.
 */
///<reference path = "../../typings/ws.d.ts"/>
"use strict";
var WSChatClientComunicator = (function () {
    function WSChatClientComunicator(url) {
        var self = this;
        this.websocket = new WebSocket(url);
        this.websocket.onopen = function (event) {
            console.log("did connect to server");
        };
        this.websocket.onerror = function (event) {
            self.websocketHadAnError();
        };
        this.websocket.onmessage = function (message) {
            var jsonString = message.data;
            self.websocketDidReceiveMessage(jsonString);
        };
    }
    WSChatClientComunicator.prototype.websocketDidReceiveMessage = function (message) {
        console.log("wschat comunicator did receive message " + message);
        if (this.callbackForWhenReceivingMessage != undefined && this.callbackForWhenReceivingMessage != null) {
            console.log("wschat comunicator did receive message");
            this.callbackForWhenReceivingMessage(message);
        }
    };
    WSChatClientComunicator.prototype.websocketHadAnError = function () {
        console.log("wschatcomunicator socket did have an error");
        if (this.errorCallback) {
            this.errorCallback("Something unexpected happened. The conection will close");
        }
        this.close();
    };
    WSChatClientComunicator.prototype.close = function () {
        this.websocket.close();
    };
    WSChatClientComunicator.prototype.sendJSONString = function (jsonString) {
        this.websocket.send(jsonString);
    };
    WSChatClientComunicator.prototype.setWhenReceivingAJSONString = function (callback) {
        this.callbackForWhenReceivingMessage = callback;
    };
    WSChatClientComunicator.prototype.setErrorCallback = function (callback) {
        this.errorCallback = callback;
    };
    return WSChatClientComunicator;
}());
exports.WSChatClientComunicator = WSChatClientComunicator;
//# sourceMappingURL=WSChatClientComunicator.js.map