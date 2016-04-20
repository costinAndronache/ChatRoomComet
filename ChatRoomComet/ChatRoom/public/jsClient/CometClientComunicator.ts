/**
 * Created by Costi on 4/13/2016.
 */

import chatComunicator = require('./ChatClientComunicator');
import Constants = require('../../Definitions');

export class CometClientComunicator implements chatComunicator.ChatClientComunicator
{
    sendJSONString(jsonString:string)
    {
        
    }
    setWhenReceivingAJSONString(callback: (jsonString: string) => void)
    {
        
    }
    setErrorCallback(callback : (errorMessage: string) => void)
    {
        
    }
}