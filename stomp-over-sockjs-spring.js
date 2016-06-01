var Stomp = require('stompjs');
var SockJS = require('sockjs-client');
var stompClient;
var socket;
var url = 'http://localhost:8080';

var stompSuccessCallback = function (frame) {
  console.log('STOMP: Connection successful: ' + frame);

  stompClient.subscribe(url + '/topic/greetings', function(greeting){
    console.log('/topic/greetings subscribed');
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
    socket = new SockJS(url + '/hello');
    stompClient = Stomp.over(socket);
    // stompClient = Stomp.overWS('ws://localhost:9999/echo/websocket');
    stompClient.connect({}, stompSuccessCallback, stompFailureCallback);
}

var sendName = function (){
  var name = 'komushi'
  stompClient.send(url + '/app/hello', {}, JSON.stringify({ 'name': name }))
}

stompConnect();

