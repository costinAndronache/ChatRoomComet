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
//# sourceMappingURL=FrontendClient.js.map