(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Costi on 4/13/2016.
 */
"use strict";
exports.kMessageTypeKey = "messageType";
exports.kEnterInRoomMessageType = "enterInRoom";
exports.kSendMessageType = "sendMessage";
exports.kRoomIdKey = "roomId";
exports.kMessageKey = "message";
exports.kUserNicknameKey = "userNickname";
exports.kStatusOkTrue = "TRUE";
exports.kStatusOkFalse = "FALSE";
exports.kStatusOkKey = "statusOk";
exports.kErrorKey = "error";
exports.kGlobalChatServerIpAddress = "localhost:5555";
exports.kComunicatorTypeCookieName = "comunicatorType";
exports.kComunicatorTypeWS = "ws";
exports.kComunicatorTypeComet = "comet";
exports.kRoomIdCookieName = "roomId";
exports.kErrorReasonKey = "errorReason";
exports.kErrorReasonAlreadyLoggedIn = "alreadyLoggedIn";
exports.kErrorReasonNicknameAlreadyTaken = "nicknameAlreadyTaken";
// UI related
exports.kSendButtonId = "sendButton";
exports.kMessageTextfieldId = "messageTextfield";
exports.kMessagesTextArea = "messagesTextArea";

},{}],2:[function(require,module,exports){
/**
 * Created by Costi on 4/13/2016.
 */
"use strict";
var wsComunicator = require('./WSChatClientComunicator');
var cometComunicator = require('./CometClientComunicator');
var Constants = require('../../Definitions');
function getChatComunicator() {
    var comunicatorType = valueForCookieWithName(Constants.kComunicatorTypeCookieName);
    console.log("comunicator type cookie value " + comunicatorType);
    if (comunicatorType === Constants.kComunicatorTypeWS) {
        console.log("returned ws communicator");
        return new wsComunicator.WSChatClientComunicator("ws://" + window.location.hostname + ":5555");
    }
    else {
        console.log("returned comet comunicator");
        return new cometComunicator.CometClientComunicator();
    }
}
exports.getChatComunicator = getChatComunicator;
function valueForCookieWithName(cookieName) {
    var cookieListString = document.cookie;
    var cookieList = cookieListString.split(';');
    console.log("cookies list " + cookieList.toString());
    for (var i = 0; i < cookieList.length; i++) {
        var currentCookie = cookieList[i];
        var cookieItems = currentCookie.split('=');
        console.log("cookie items at " + i + " are " + cookieItems.toString() + " searching for cookie with name " + cookieName);
        console.log("cookie items length " + cookieItems.length);
        console.log("cookieItems[0] = " + cookieItems[0]);
        var cookieNameInItems = cookieItems[0];
        cookieNameInItems = cookieNameInItems.replace(/\s+/, "");
        if (cookieItems.length == 2 && cookieNameInItems === cookieName) {
            console.log("found and returning " + cookieItems[1]);
            return cookieItems[1];
        }
    }
    console.log("returned nothing");
    return "";
}
exports.valueForCookieWithName = valueForCookieWithName;

},{"../../Definitions":1,"./CometClientComunicator":3,"./WSChatClientComunicator":6}],3:[function(require,module,exports){
/**
 * Created by Costi on 4/13/2016.
 */
"use strict";
var CometClientComunicator = (function () {
    function CometClientComunicator() {
    }
    CometClientComunicator.prototype.sendJSONString = function (jsonString) {
    };
    CometClientComunicator.prototype.setWhenReceivingAJSONString = function (callback) {
    };
    CometClientComunicator.prototype.setErrorCallback = function (callback) {
    };
    return CometClientComunicator;
}());
exports.CometClientComunicator = CometClientComunicator;

},{}],4:[function(require,module,exports){
/**
 * Created by Costi on 4/13/2016.
 */
"use strict";
var Constants = require('../../Definitions');
var FrontendClient = (function () {
    function FrontendClient(comunicator, roomId) {
        var button = document.getElementById(Constants.kSendButtonId);
        var self = this;
        button.onclick = function (event) {
            self.didPressSendButton();
        };
        this.comunicator = comunicator;
        this.roomId = roomId;
        comunicator.setWhenReceivingAJSONString(function (jsonString) {
            self.didReceiveJSONMessage(jsonString);
        });
        comunicator.setErrorCallback(function (errorMessage) {
            alert("Something unexpected happened. Please reload the page");
        });
        this.askForNicknameAndSend();
    }
    FrontendClient.prototype.didPressSendButton = function () {
        var textField = document.getElementById(Constants.kMessageTextfieldId);
        var obj = {};
        obj[Constants.kMessageTypeKey] = Constants.kSendMessageType;
        obj[Constants.kRoomIdKey] = this.roomId;
        obj[Constants.kUserNicknameKey] = this.nickname;
        obj[Constants.kMessageKey] = textField.value;
        this.comunicator.sendJSONString(JSON.stringify(obj));
    };
    FrontendClient.prototype.askForNicknameAndSend = function () {
        var nickName = prompt("Please choose a nickname");
        var obj = {};
        obj[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
        obj[Constants.kRoomIdKey] = this.roomId;
        obj[Constants.kUserNicknameKey] = nickName;
        this.nickname = nickName;
        this.comunicator.sendJSONString(JSON.stringify(obj));
    };
    FrontendClient.prototype.handleNickNameAlreadyTakenError = function () {
        alert("That nickname is already taken. Pleas try something else");
        this.askForNicknameAndSend();
    };
    FrontendClient.prototype.didReceiveJSONMessage = function (jsonMessage) {
        var obj = JSON.parse(jsonMessage);
        console.log("did receive message " + jsonMessage);
        var errorReason = obj[Constants.kErrorReasonKey];
        if (errorReason) {
            if (errorReason === Constants.kErrorReasonNicknameAlreadyTaken) {
                this.handleNickNameAlreadyTakenError();
                return;
            }
        }
        var message = obj[Constants.kMessageKey];
        var nick = obj[Constants.kUserNicknameKey];
        if (nick && message) {
            var textArea = document.getElementById(Constants.kMessagesTextArea);
            textArea.innerHTML = textArea.innerHTML + "\n" + nick + ": " + message;
        }
    };
    return FrontendClient;
}());
exports.FrontendClient = FrontendClient;

},{"../../Definitions":1}],5:[function(require,module,exports){
/**
 * Created by Costi on 4/14/2016.
 */
"use strict";
var Constants = require('../../Definitions');
var comunicatorFactory = require('./ChatComunicatorFactory');
var frontend = require('./FrontendClient');
var frontendClient;
window.onload = function (event) {
    var roomId = comunicatorFactory.valueForCookieWithName(Constants.kRoomIdCookieName);
    console.log("room Id found in cookies " + roomId);
    var comunicator = comunicatorFactory.getChatComunicator();
    frontendClient = new frontend.FrontendClient(comunicator, roomId);
};

},{"../../Definitions":1,"./ChatComunicatorFactory":2,"./FrontendClient":4}],6:[function(require,module,exports){
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

},{}]},{},[5]);
