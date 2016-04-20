/**
 * Created by Costi on 4/14/2016.
 */

import chatComunicator = require('./ChatClientComunicator');
import wsComunicator = require('./WSChatClientComunicator');
import cometComunicator = require('./CometClientComunicator');
import Constants = require('../../Definitions');
import comunicatorFactory = require('./ChatComunicatorFactory');
import frontend = require('./FrontendClient');

var frontendClient: frontend.FrontendClient;
window.onload = function (event: any) 
{
    var roomId : string = comunicatorFactory.valueForCookieWithName(Constants.kRoomIdCookieName);
    console.log("room Id found in cookies " + roomId);
    var comunicator : chatComunicator.ChatClientComunicator = comunicatorFactory.getChatComunicator();
    frontendClient = new frontend.FrontendClient(comunicator, roomId);
};