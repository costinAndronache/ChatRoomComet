/**
 * Created by Costi on 4/13/2016.
 */

import chatComunicator = require('./ChatClientComunicator');
import wsComunicator = require('./WSChatClientComunicator');
import cometComunicator = require('./CometClientComunicator');
import Constants = require('../../Definitions');
import comunicatorFactory = require('./ChatComunicatorFactory');


export class FrontendClient
{
    private comunicator : chatComunicator.ChatClientComunicator;
    private roomId : string;
    private nickname: string;
    
    constructor(comunicator: chatComunicator.ChatClientComunicator, roomId : string)
    {
        var button : HTMLButtonElement = document.getElementById(Constants.kSendButtonId) as HTMLButtonElement;
        var self = this;
        button.onclick = function (event: MouseEvent)
        {
            self.didPressSendButton();
        };

        this.comunicator = comunicator;
        this.roomId = roomId;
        
        comunicator.setWhenReceivingAJSONString(function (jsonString: string)
        {
           self.didReceiveJSONMessage(jsonString); 
        });
        
        comunicator.setErrorCallback(function (errorMessage: string) {
            alert("Something unexpected happened. Please reload the page");
        })
        
        this.askForNicknameAndSend();
    }


    private didPressSendButton()
    {
        var textField : HTMLInputElement = document.getElementById(Constants.kMessageTextfieldId) as HTMLInputElement;
        var obj : any = {};
        
        obj[Constants.kMessageTypeKey] = Constants.kSendMessageType;
        obj[Constants.kRoomIdKey] = this.roomId;
        obj[Constants.kUserNicknameKey] = this.nickname;
        obj[Constants.kMessageKey] = textField.value;
        
        this.comunicator.sendJSONString(JSON.stringify(obj));
        
    }

    private  askForNicknameAndSend()
    {
        var nickName = prompt("Please choose a nickname");
        var obj:  any = {};
        obj[Constants.kMessageTypeKey] = Constants.kEnterInRoomMessageType;
        obj[Constants.kRoomIdKey] = this.roomId;
        obj[Constants.kUserNicknameKey] = nickName;
        this.nickname = nickName;
        
        this.comunicator.sendJSONString(JSON.stringify(obj));
    }
    
    
    private handleNickNameAlreadyTakenError()
    {
        alert("That nickname is already taken. Pleas try something else");
        this.askForNicknameAndSend();
    }
    
    
    
    private didReceiveJSONMessage(jsonMessage: string)
    {
        var obj = JSON.parse(jsonMessage);
        console.log("did receive message " + jsonMessage);

        var errorReason : string = obj[Constants.kErrorReasonKey];
        if(errorReason)
        {
            if(errorReason === Constants.kErrorReasonNicknameAlreadyTaken)
            {
                this.handleNickNameAlreadyTakenError();
                return;
            }


        }

        var message = obj[Constants.kMessageKey];
        var nick = obj[Constants.kUserNicknameKey];

        if(nick && message)
        {
            var textArea : HTMLTextAreaElement = document.getElementById(Constants.kMessagesTextArea) as HTMLTextAreaElement;
            textArea.innerHTML = textArea.innerHTML + "\n" + nick + ": " + message;
        }
        
    }

}