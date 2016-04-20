/**
 * Created by Costi on 4/13/2016.
 */
///<reference path = "../../typings/ws.d.ts"/>

import chatComunicator  = require('./ChatClientComunicator');
import * as WS from 'ws';

export class WSChatClientComunicator implements chatComunicator.ChatClientComunicator
{
    private websocket : WebSocket;
    private callbackForWhenReceivingMessage: (message: string) => void;
    private errorCallback: (errorMessage: string) => void;

    constructor(url : string)
    {
        var self = this;
        this.websocket = new WebSocket(url);
        this.websocket.onopen = function (event: any) 
        {
           console.log("did connect to server");  
        };
        
        this.websocket.onerror = function (event: any) {
            self.websocketHadAnError();
        };

        this.websocket.onmessage = function (message: MessageEvent)
        {
            var jsonString : string = message.data;
            self.websocketDidReceiveMessage(jsonString);
        };
        
    }
    
    private websocketDidReceiveMessage(message: string)
    {
        console.log("wschat comunicator did receive message " + message);
        if(this.callbackForWhenReceivingMessage != undefined && this.callbackForWhenReceivingMessage != null)
        {
            console.log("wschat comunicator did receive message")
            this.callbackForWhenReceivingMessage(message);
        }
    }
    
    private websocketHadAnError()
    {
        console.log("wschatcomunicator socket did have an error");
        if(this.errorCallback)
        {
            this.errorCallback("Something unexpected happened. The conection will close");
        }
        
        this.close();
    }
    
    close()
    {
        this.websocket.close();
    }

    sendJSONString(jsonString:string)
    {
        this.websocket.send(jsonString);
    }
    setWhenReceivingAJSONString(callback: (jsonString: string) => void)
    {
        this.callbackForWhenReceivingMessage = callback;
    }

    setErrorCallback(callback : (errorMessage: string) => void)
    {
        this.errorCallback = callback;
    }
}