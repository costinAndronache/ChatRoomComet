import WebSocket = require("ws");
/**
 * Created by Costi on 4/12/2016.
 */

///<reference path="../typings/ws.d.ts"/>

import Constants = require('./../Definitions');

import WS = require('ws');
import {IServerOptions} from "ws";
import {kUserNicknameKey} from "./../Definitions";


class ChatUser
{
    private userNickname: string;
    private websocket : WS.WebSocket;


    constructor(userNickname: string, ws: WS.WebSocket)
    {
        this.websocket = ws;
        this.userNickname = userNickname;
    }

    public getNickName() : string
    {
        return this.userNickname;
    }
    
    public getWebsocket() : WS.WebSocket
    {
        return this.websocket;
    }
}

class ChatRoom
{
    private  roomId : string = "";
    private  roomName: string = "";
    private  chatUsersPerNickName: {[userNickName: string] : ChatUser};

    constructor(name: string, id: string)
    {
        this.roomId = id;
        this.roomName = name;
        this.chatUsersPerNickName = {};
    }

    public getName() : string
    {
        return this.roomName;
    }

    public getId() : string
    {
        return this.roomId;
    }

    public addNewUser(user: ChatUser)
    {
        this.chatUsersPerNickName[user.getNickName()] = user;
    }

    public userForWebsocket(ws: WS.WebSocket) : ChatUser
    {
        var foundUser: ChatUser = null;

        for(var nickname in this.chatUsersPerNickName)
        {
            if(!this.chatUsersPerNickName.hasOwnProperty(nickname))
                continue;

            var user : ChatUser = this.chatUsersPerNickName[nickname];
            if(user.getWebsocket() == ws)
            {
                return user;
            }
        }

        return foundUser;
    }

    public removeChatUser(user: ChatUser)
    {
        delete this.chatUsersPerNickName[user.getNickName()];
    }

    public isNicknameExistent(name: string) : boolean
    {
        var user = this.chatUsersPerNickName[name];

        if(user != undefined || user != null)
        {
            return true;
        }

        return false;
    }
    
    public broadcastMessage(message: string)
    {
        console.log("room with id " + this.roomId + " was asked to broadcast " + message);
        for(var nick in this.chatUsersPerNickName)
        {
            if(!this.chatUsersPerNickName.hasOwnProperty(nick))
                continue;

            var user : ChatUser = this.chatUsersPerNickName[nick];
            user.getWebsocket().send(message);
            console.log("did send message to user " + user.getNickName());
        }
    }
}
    
class WSMessageHandler
{
    private  roomsMappedById : {[id : string] : ChatRoom};

    constructor(roomsMappedById: {[id : string] : ChatRoom}, ws: WS.WebSocket, server : ChatRoomsWebSocketServer)
    {

        this.roomsMappedById = roomsMappedById;
        var self = this;
        ws.on("message", function(message: string)
        {
            var obj : any = JSON.parse(message);
            var messageType : string = obj[Constants.kMessageTypeKey];
            console.log("did receive message " + message);

            if(messageType === Constants.kEnterInRoomMessageType)
            {
                self.handleEnterInRoomMessage(obj,ws);
            }

            if(messageType == Constants.kSendMessageType)
            {
                self.handleBroadcastMessage(message, obj);
            }
        });

        ws.on('close', function(code: number, message: string)
        {
            console.log("websocket closed with message " + message);
            for(var roomId in roomsMappedById)
            {
                if(roomsMappedById.hasOwnProperty(roomId))
                {
                    var room = roomsMappedById[roomId];
                    var user = room.userForWebsocket(ws);
                    if(user != null)
                    {
                        room.removeChatUser(user);
                    }
                }
            }

            server.removeMessageHandler(this);
        });

        ws.on('error', function (error: Error) {
            console.log("websocket did have an error");
        })
    }

    private handleEnterInRoomMessage(obj: any, ws: WS.WebSocket)
    {
        var roomId : string = obj[Constants.kRoomIdKey];
        var room : ChatRoom = this.roomsMappedById[roomId];

        var nickname : string = obj[Constants.kUserNicknameKey];
        
        if(room.userForWebsocket(ws))
        {
            var notOk : any = {};
            notOk[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
            notOk[Constants.kStatusOkKey] = Constants.kStatusOkFalse;
            notOkMessage[Constants.kMessageTypeKey] =  Constants.kEnterInRoomMessageType;
            notOk[Constants.kErrorReasonKey] = Constants.kErrorReasonAlreadyLoggedIn;
            var notOkString = JSON.stringify(notOk);
            ws.send(notOkString);
            return;
        }

        if(room.isNicknameExistent(nickname))
        {
            var notOkMessage : {[key : string] : string} = {};
            notOkMessage[Constants.kStatusOkKey] = Constants.kStatusOkFalse;
            notOkMessage[Constants.kErrorReasonKey] =  Constants.kErrorReasonNicknameAlreadyTaken;
            notOkMessage[Constants.kMessageTypeKey] =  Constants.kEnterInRoomMessageType;
            
            var messageString : string = JSON.stringify(notOkMessage);
            ws.send(messageString);

            console.log("did send " + messageString);
        }
        else
        {
            room.addNewUser(new ChatUser(nickname,ws));
            var okMessage : {[key : string] : string} = {};
            okMessage[Constants.kStatusOkKey] = Constants.kStatusOkTrue;
            okMessage[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
            okMessage[Constants.kUserNicknameKey] = nickname;
            
            var okMessageString : string = JSON.stringify(okMessage);
            ws.send(okMessageString);

            console.log("did send " + okMessageString);
        }


    }

    private handleBroadcastMessage(message: string, obj : any)
    {
        var roomId : string = obj[Constants.kRoomIdKey];
        var room : ChatRoom = this.roomsMappedById[roomId];
        room.broadcastMessage(message);

        console.log("did broadcast " + message);
    }


}

export class ChatRoomsWebSocketServer
{

    
    private serverSocket : WS.Server;
    private roomsMappedById : {[id: string] : ChatRoom};
    private wsMessageHandlers: Array<WSMessageHandler>;

    constructor(port: number)
    {
        this.serverSocket = new WS.Server({port: port});
        this.roomsMappedById = {};
        this.wsMessageHandlers = new Array<WSMessageHandler>();

        var softwareChatRoom : ChatRoom = new ChatRoom("Software", "1");
        var hardwareChatRoom : ChatRoom = new ChatRoom("Hardware", "2");

        this.roomsMappedById[softwareChatRoom.getId()] = softwareChatRoom;
        this.roomsMappedById[hardwareChatRoom.getId()] = hardwareChatRoom;
        
        var self = this;


        console.log("websocket server opened");
        this.serverSocket.on("connection", function (ws: WS.WebSocket) {
            console.log("New connection on server");
            self.handleNewConnection(ws);
        });
    }

    private handleNewConnection(ws: WS.WebSocket)
    {
        var messageHandler = new WSMessageHandler(this.roomsMappedById,ws,this);
        this.wsMessageHandlers.push(messageHandler);
    }

    public removeMessageHandler(handler: WSMessageHandler)
    {
        var index = this.wsMessageHandlers.indexOf(handler);
        if(index > -1)
        {
            this.wsMessageHandlers.splice(index,1);
            console.log("Did remove a messageHandler");
        }
    }
}