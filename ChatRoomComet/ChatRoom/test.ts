/**
 * Created by Epurashu on 11.04.2016.
 */


class HelloWorld
{
    public printHelloWorld() : String
    {
        return "HelloWorldClass";
    }

    private printBye() : String
    {
        return "Bye";
    }
}

exports.HelloWorld = HelloWorld;
exports.helloWorldFunction = new HelloWorld().printHelloWorld;