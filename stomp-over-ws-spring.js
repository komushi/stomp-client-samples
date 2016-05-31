var Stomp = require('stompjs');
var stompClient;
var url = 'ws://localhost:8080';



var stompSuccessCallback = function (frame) {
    console.log('STOMP: Connection successful: ' + frame);

    stompClient.subscribe('/topic/textgreetings', function(greeting){
      console.log('/topic/textgreetings subscribed');
      console.log(greeting);
    });

    stompClient.subscribe('/topic/jsongreetings', function(greeting){
      console.log('/topic/jsongreetings subscribed');
      console.log(greeting);
    });

   	console.log ('STOMP: sending a message');
  	var name = 'Lei Xu';
  	stompClient.send('/app/textgreet', {}, name);
  	stompClient.send('/app/jsongreet', {}, JSON.stringify({ 'name': name }))

};

var stompFailureCallback = function (error) {
    console.log('STOMP: ' + error);

    setTimeout(stompConnect, 2000);
    console.log('STOMP: Reconecting in 2 seconds');
};

var stompConnect = function () {
    console.log('STOMP: Attempting connection');

    // recreate the stompClient to use a new WebSocket
    stompClient = Stomp.overWS(url + '/endpoint');
    
    stompClient.connect('guest', 'guest', stompSuccessCallback, stompFailureCallback);
}

stompConnect();