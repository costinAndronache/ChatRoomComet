/**
 * Created by Costi on 4/13/2016.
 */

import chatComunicator = require('./ChatClientComunicator');
import wsComunicator = require('./WSChatClientComunicator');
import cometComunicator = require('./CometClientComunicator');
import Constants = require('../../Definitions');


export function getChatComunicator() : chatComunicator.ChatClientComunicator
{
    var comunicatorType : string = valueForCookieWithName(Constants.kComunicatorTypeCookieName);
    console.log("comunicator type cookie value " + comunicatorType);
    
    if(comunicatorType === Constants.kComunicatorTypeWS)
    {
        console.log("returned ws communicator");
        return new wsComunicator.WSChatClientComunicator("ws://" + window.location.hostname + ":5555");
    }
    else 
    {
        console.log("returned comet comunicator");
        return new cometComunicator.CometClientComunicator();
    }

    
}

export function valueForCookieWithName(cookieName: string) : string
{
    var cookieListString : string = document.cookie;
    var cookieList : string[] = cookieListString.split(';');
    
    console.log("cookies list " + cookieList.toString());
    
    for(var i=0; i<cookieList.length; i++)
    {
        var currentCookie : string = cookieList[i];
        var cookieItems : string[] = currentCookie.split('=');

        console.log("cookie items at " + i + " are " + cookieItems.toString() + " searching for cookie with name " + cookieName);
        console.log("cookie items length " + cookieItems.length);
        console.log("cookieItems[0] = " + cookieItems[0]);

        var cookieNameInItems = cookieItems[0];
        cookieNameInItems = cookieNameInItems.replace(/\s+/, "");

        if(cookieItems.length == 2 && cookieNameInItems === cookieName)
        {
            console.log("found and returning " + cookieItems[1]);
            return cookieItems[1];
        }
    }
    
    console.log("returned nothing");
    return "";
}