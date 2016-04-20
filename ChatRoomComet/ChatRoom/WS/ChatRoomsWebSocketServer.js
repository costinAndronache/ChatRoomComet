/**
 * Created by Costi on 4/12/2016.
 */
///<reference path="../typings/ws.d.ts"/>
var Constants = require('./../Definitions');
var WS = require('ws');
var ChatUser = (function () {
    function ChatUser(userNickname, ws) {
        this.websocket = ws;
        this.userNickname = userNickname;
    }
    ChatUser.prototype.getNickName = function () {
        return this.userNickname;
    };
    ChatUser.prototype.getWebsocket = function () {
        return this.websocket;
    };
    return ChatUser;
})();
var ChatRoom = (function () {
    function ChatRoom(name, id) {
        this.roomId = "";
        this.roomName = "";
        this.roomId = id;
        this.roomName = name;
        this.chatUsersPerNickName = {};
    }
    ChatRoom.prototype.getName = function () {
        return this.roomName;
    };
    ChatRoom.prototype.getId = function () {
        return this.roomId;
    };
    ChatRoom.prototype.addNewUser = function (user) {
        this.chatUsersPerNickName[user.getNickName()] = user;
    };
    ChatRoom.prototype.userForWebsocket = function (ws) {
        var foundUser = null;
        for (var nickname in this.chatUsersPerNickName) {
            if (!this.chatUsersPerNickName.hasOwnProperty(nickname))
                continue;
            var user = this.chatUsersPerNickName[nickname];
            if (user.getWebsocket() == ws) {
                return user;
            }
        }
        return foundUser;
    };
    ChatRoom.prototype.removeChatUser = function (user) {
        delete this.chatUsersPerNickName[user.getNickName()];
    };
    ChatRoom.prototype.isNicknameExistent = function (name) {
        var user = this.chatUsersPerNickName[name];
        if (user != undefined || user != null) {
            return true;
        }
        return false;
    };
    ChatRoom.prototype.broadcastMessage = function (message) {
        console.log("room with id " + this.roomId + " was asked to broadcast " + message);
        for (var nick in this.chatUsersPerNickName) {
            if (!this.chatUsersPerNickName.hasOwnProperty(nick))
                continue;
            var user = this.chatUsersPerNickName[nick];
            user.getWebsocket().send(message);
            console.log("did send message to user " + user.getNickName());
        }
    };
    return ChatRoom;
})();
var WSMessageHandler = (function () {
    function WSMessageHandler(roomsMappedById, ws, server) {
        this.roomsMappedById = roomsMappedById;
        var self = this;
        ws.on("message", function (message) {
            var obj = JSON.parse(message);
            var messageType = obj[Constants.kMessageTypeKey];
            console.log("did receive message " + message);
            if (messageType === Constants.kEnterInRoomMessageType) {
                self.handleEnterInRoomMessage(obj, ws);
            }
            if (messageType == Constants.kSendMessageType) {
                self.handleBroadcastMessage(message, obj);
            }
        });
        ws.on('close', function (code, message) {
            console.log("websocket closed with message " + message);
            for (var roomId in roomsMappedById) {
                if (roomsMappedById.hasOwnProperty(roomId)) {
                    var room = roomsMappedById[roomId];
                    var user = room.userForWebsocket(ws);
                    if (user != null) {
                        room.removeChatUser(user);
                    }
                }
            }
            server.removeMessageHandler(this);
        });
        ws.on('error', function (error) {
            console.log("websocket did have an error");
        });
    }
    WSMessageHandler.prototype.handleEnterInRoomMessage = function (obj, ws) {
        var roomId = obj[Constants.kRoomIdKey];
        var room = this.roomsMappedById[roomId];
        var nickname = obj[Constants.kUserNicknameKey];
        if (room.userForWebsocket(ws)) {
            var notOk = {};
            notOk[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
            notOk[Constants.kStatusOkKey] = Constants.kStatusOkFalse;
            notOkMessage[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
            notOk[Constants.kErrorReasonKey] = Constants.kErrorReasonAlreadyLoggedIn;
            var notOkString = JSON.stringify(notOk);
            ws.send(notOkString);
            return;
        }
        if (room.isNicknameExistent(nickname)) {
            var notOkMessage = {};
            notOkMessage[Constants.kStatusOkKey] = Constants.kStatusOkFalse;
            notOkMessage[Constants.kErrorReasonKey] = Constants.kErrorReasonNicknameAlreadyTaken;
            notOkMessage[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
            var messageString = JSON.stringify(notOkMessage);
            ws.send(messageString);
            console.log("did send " + messageString);
        }
        else {
            room.addNewUser(new ChatUser(nickname, ws));
            var okMessage = {};
            okMessage[Constants.kStatusOkKey] = Constants.kStatusOkTrue;
            okMessage[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
            okMessage[Constants.kUserNicknameKey] = nickname;
            var okMessageString = JSON.stringify(okMessage);
            ws.send(okMessageString);
            console.log("did send " + okMessageString);
        }
    };
    WSMessageHandler.prototype.handleBroadcastMessage = function (message, obj) {
        var roomId = obj[Constants.kRoomIdKey];
        var room = this.roomsMappedById[roomId];
        room.broadcastMessage(message);
        console.log("did broadcast " + message);
    };
    return WSMessageHandler;
})();
var ChatRoomsWebSocketServer = (function () {
    function ChatRoomsWebSocketServer(port) {
        this.serverSocket = new WS.Server({ port: port });
        this.roomsMappedById = {};
        this.wsMessageHandlers = new Array();
        var softwareChatRoom = new ChatRoom("Software", "1");
        var hardwareChatRoom = new ChatRoom("Hardware", "2");
        this.roomsMappedById[softwareChatRoom.getId()] = softwareChatRoom;
        this.roomsMappedById[hardwareChatRoom.getId()] = hardwareChatRoom;
        var self = this;
        console.log("websocket server opened");
        this.serverSocket.on("connection", function (ws) {
            console.log("New connection on server");
            self.handleNewConnection(ws);
        });
    }
    ChatRoomsWebSocketServer.prototype.handleNewConnection = function (ws) {
        var messageHandler = new WSMessageHandler(this.roomsMappedById, ws, this);
        this.wsMessageHandlers.push(messageHandler);
    };
    ChatRoomsWebSocketServer.prototype.removeMessageHandler = function (handler) {
        var index = this.wsMessageHandlers.indexOf(handler);
        if (index > -1) {
            this.wsMessageHandlers.splice(index, 1);
            console.log("Did remove a messageHandler");
        }
    };
    return ChatRoomsWebSocketServer;
})();
exports.ChatRoomsWebSocketServer = ChatRoomsWebSocketServer;
//# sourceMappingURL=ChatRoomsWebSocketServer.js.map