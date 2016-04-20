/**
 * Created by Epurashu on 19.04.2016.
 */


function getRoomAdress(){
    return document.getElementById('roomName').innerHTML;
}

function getUserName(){
    return document.getElementById('username').innerHTML;
}

$('submitmsg').click(function () {
    var data = {username: getUserName(), message: document.getElementById('usrmsg').value };
    $.post(getRoomAdress(), data, function (res) {
        retrieveMessages();
    },'json');
});

function retrieveMessages(){
    $.ajax({
        cache: false,
        dataType: 'json',
        type: "GET",
        url: getRoomAdress(),
        error: function () {},
        success: function (json) {
            for (result in json)
                document.getElementById('chatbox').value += result.username + result.data;
        }
    });
}

function longPoll_feed() {
    //make another request
    $.ajax({
        cache: false,
        dataType: 'json',
        type: "GET",
        url: getRoomAdress(),
        error: function () {
            //don't flood the servers on error, wait 10 seconds before retrying
            setTimeout(longPoll_feed, 10 * 1000);
        },
        success: function (json) {
            console.log(json);
            for (result in json)
                document.getElementById('chatbox').value += result.username + result.data;
            setTimeout(longPoll_feed, 3 * 1000);

            longPoll_feed();
        }
    });
}

$(document).ready(function () {
    //begin listening for updates right away
    longPoll_feed();
});