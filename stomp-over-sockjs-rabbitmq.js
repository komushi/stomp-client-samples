var Stomp = require('stompjs');
var SockJS = require('sockjs-client');
var stompClient;
var socket;
var url = 'http://localhost:15674';

var stompSuccessCallback = function (frame) {
  console.log('STOMP: Connection successful: ' + frame);

  stompClient.subscribe('/queue/test', function(greeting){
    console.log('/queue/test subscribed');
    console.log(greeting);
  });

  console.log ('STOMP: sending a message over SockJS');

  sendName();
};

var stompFailureCallback = function (error) {
    console.log('STOMP: ' + error);

    setTimeout(stompConnect, 4000);
    console.log('STOMP: Reconecting in 4 seconds');
};

var stompConnect = function () {
    console.log('STOMP: Attempting connection');
    // recreate the stompClient to use a new WebSocket
    socket = new SockJS(url + '/stomp');
    stompClient = Stomp.over(socket);

    stompClient.connect('guest', 'guest', stompSuccessCallback, stompFailureCallback);
}

var sendName = function (){
  var name = 'Lei Xu';
  stompClient.send('/queue/test', {}, JSON.stringify({ 'name': name }));
}

stompConnect();

