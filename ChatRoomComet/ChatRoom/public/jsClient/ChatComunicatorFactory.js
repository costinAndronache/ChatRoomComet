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
//# sourceMappingURL=ChatComunicatorFactory.js.map