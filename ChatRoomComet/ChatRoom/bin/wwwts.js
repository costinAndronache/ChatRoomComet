"use strict";
var chat = require('../WS/ChatRoomsWebSocketServer');
var chatServer = null;
function startWithApp(app, serverPort) {
    chatServer = new chat.ChatRoomsWebSocketServer(serverPort);
    //additional setup as required
}
exports.startWithApp = startWithApp;
//# sourceMappingURL=wwwts.js.map