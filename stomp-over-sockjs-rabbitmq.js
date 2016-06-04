var Stomp = require('stompjs');
var SockJS = require('sockjs-client');
var randomWords = require('random-words');
var stompClient;
var socket;
var url = 'http://localhost:15674';

var stompSuccessCallback = function (frame) {
  console.log('STOMP: Connection successful: ' + frame);

  stompClient.subscribe('/topic/dest', function(greeting){
    console.log('/topic/dest subscribed');
    console.log(greeting);
  });

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

var sendMessage = function (){
  var row = {};
  row.name = randomWords();
  row.sales = Math.round(Math.random() * 100);

  stompClient.send('/topic/dest', {}, JSON.stringify(row));
}

stompConnect();

setInterval(sendMessage, 1000);

