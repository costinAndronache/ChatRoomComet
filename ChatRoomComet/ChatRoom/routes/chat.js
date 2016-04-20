/**
 * Created by Costi on 4/13/2016.
 */
"use strict";
var express = require('express');
var constants = require('../Definitions')
var cookie = require('cookie');

var router = express.Router();


var serializeCookie = function(key, value, hrs) {
    // This is res.cookie’s code without the array management and also ignores signed cookies.
    if ('number' == typeof value) value = val.toString();
    if ('object' == typeof value) value = JSON.stringify(val);
    return cookie.serialize(key, value, { expires: new Date(Date.now() + 1000 * 60 * hrs), httpOnly: false });
};



/* GET home page. */
router.get('/:connectionType/:chatRoomId', function(req, res, next)
{
    var cookies = [];
    cookies.push(serializeCookie(constants.kComunicatorTypeCookieName, req.params.connectionType, 1));
    cookies.push(serializeCookie(constants.kRoomIdCookieName, req.params.chatRoomId, 1));
    res.header("Set-Cookie", cookies);

    console.log("chat cookies " + cookies.toString());

    res.render('chatPage', { title: 'Express' , textAreaId : constants.kMessagesTextArea, 
                             textFieldId : constants.kMessageTextfieldId,
                             sendButtonId: constants.kSendButtonId});
});

module.exports = router;