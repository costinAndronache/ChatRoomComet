/**
 * Created by Epurashu on 11.04.2016.
 */
var HelloWorld = (function () {
    function HelloWorld() {
    }
    HelloWorld.prototype.printHelloWorld = function () {
        return "HelloWorldClass";
    };
    HelloWorld.prototype.printBye = function () {
        return "Bye";
    };
    return HelloWorld;
}());
exports.HelloWorld = HelloWorld;
exports.helloWorldFunction = new HelloWorld().printHelloWorld;
//# sourceMappingURL=test.js.map