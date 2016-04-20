/**
 * Created by Costi on 4/13/2016.
 */

export interface ChatClientComunicator
{
    sendJSONString(jsonString:string) : void;
    setWhenReceivingAJSONString(callback: (jsonString: string) => void) : void;
    setErrorCallback(callback : (errorMessage: string) => void);
}