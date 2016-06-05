var Stomp = require('stompjs');
var stompClient;
var prompt = require('prompt');


var endpoint = 'ws://127.0.0.1:15674/ws';
var myName;

var stompSuccessCallback = function (frame) {
    console.log('STOMP: Connection successful: ' + frame);

    stompClient.subscribe('/topic/newuser', function(message){
      // console.log('/topic/test subscribed');
      console.log(message.body + ' came in.');

      sendContents();
    });

    stompClient.subscribe('/topic/contents', function(message){
      // console.log('/topic/jsongreetings subscribed');

      var msgBody = JSON.parse(message.body);
      console.log(msgBody.name + ': ' + msgBody.contents);

      sendContents();
    });

   	console.log ('STOMP: sending a message over WebSocket');
    sendName();

};

var stompFailureCallback = function (error) {
    console.log('STOMP: ' + error);

    setTimeout(stompConnect, 2000);
    console.log('STOMP: Reconecting in 2 seconds');
};

var stompConnect = function () {
    console.log('STOMP: Attempting connection');
    // recreate the stompClient to use a new WebSocket
    stompClient = Stomp.overWS(endpoint);
    
    stompClient.connect('admin', 'password', stompSuccessCallback, stompFailureCallback);
}

var sendContents = function () {

  prompt.get(['contents'], function (err, result) {

    stompClient.send('/topic/contents', {}, JSON.stringify({ 'name': myName, 'contents': result.contents }));
  });
}

var sendName = function () {

  prompt.get(['name'], function (err, result) {
    myName = result.name;

    stompClient.send('/topic/newuser', {}, result.name);
  });
}

prompt.start();
stompConnect();