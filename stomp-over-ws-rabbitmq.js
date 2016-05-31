var Stomp = require('stompjs');
var stompClient;
var prompt = require('prompt');


var url = 'ws://localhost:15674';


var stompSuccessCallback = function (frame) {
    console.log('STOMP: Connection successful: ' + frame);

    stompClient.subscribe('/topic/test', function(greeting){
      // console.log('/topic/test subscribed');
      console.log('Received:' + greeting.body);

      sendName();
    });

    stompClient.subscribe('/topic/jsongreetings', function(greeting){
      console.log('/topic/jsongreetings subscribed');
      console.log(greeting);
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
    stompClient = Stomp.overWS(url + '/ws');
    
    stompClient.connect('guest', 'guest', stompSuccessCallback, stompFailureCallback);
}

var sendName = function (){
  // var name = 'Lei Xu';

  // stompClient.send('/topic/test', {}, name);

  // stompClient.send('/topic/jsongreetings', {}, JSON.stringify({ 'name': name }));




  prompt.get(['send'], function (err, result) {
    //
    // Log the results.
    //
    // console.log('Command-line input received:');
    // console.log('  username: ' + result.username);

    stompClient.send('/topic/test', {}, result.send);
  });
}

prompt.start();
stompConnect();