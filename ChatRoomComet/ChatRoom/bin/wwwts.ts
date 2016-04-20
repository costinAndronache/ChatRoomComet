
import * as chat  from '../WS/ChatRoomsWebSocketServer';

var chatServer : chat.ChatRoomsWebSocketServer = null;

export function startWithApp(app: any, serverPort: number)
{
    chatServer = new chat.ChatRoomsWebSocketServer(serverPort);
    //additional setup as required
}