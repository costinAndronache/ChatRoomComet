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
//# sourceMappingURL=FrontendMain.js.map