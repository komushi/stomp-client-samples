var Q = require('q');
var Stomp = require('stompjs');
var SockJS = require('sockjs-client');
var prompt = require('prompt');
var randomWords = require('random-words');
var url = require('url');
var stompClient, socket;
// active apollo
var endpoint = 'ws://localhost:61623/';
var usr = 'admin';
var pwd = 'password';
var subdest = '/topic/dest';
var pubdest = '/topic/dest';

var stompConnect = function () {
  var d = Q.defer();
  
  console.log('STOMP: Attempting connection');

  if (url.parse(endpoint).protocol === 'ws:' || url.parse(endpoint).protocol === 'wss:') {
    console.log(endpoint);
    stompClient = Stomp.overWS(endpoint);
  } else {
    console.log(endpoint);
    socket = new SockJS(endpoint);
    stompClient = Stomp.over(socket);
  }

  stompClient.connect(usr, pwd, function (frame) {
      console.log(frame);
      d.resolve(frame)
    }, function (err) {
      console.log(err);

      d.reject(err)
    });

  return d.promise;
};

var stompSubscribe = function () {
  var d = Q.defer();

  stompClient.subscribe(subdest, function(res){
      d.notify(res);
  });

  return d.promise;
};

var sendMessage = function (){
  var row = {};
  row.name = randomWords();
  row.type = 'Type' + Math.floor(Math.random() * 2);
  row.sales = Math.round(Math.random() * 100);

  stompClient.send(pubdest, {}, JSON.stringify(row));
  console.log('sending:' + JSON.stringify(row));
};


var startPrompt = function (){
  console.log('default endpoint: ' + endpoint);
  console.log('default user: ' + usr);
  console.log('default password: ' + pwd);
  console.log('default subscribe: ' + subdest);
  console.log('default publish: ' + pubdest);

  prompt.get(['endpoint', 'user', 'password', 'subscribe', 'publish'], 
    function (err, result) {
      if (result.endpoint) {
        endpoint = result.endpoint;
      }

      if (result.user) {
        usr = result.user;
      }

      if (result.password) {
        pwd = result.password;
      }

      if (result.subscribe) {
        subdest = result.subscribe;
      }

      if (result.publish) {
        pubdest = result.publish;
      }

      stompConnect()
        .then(function (frame){

          console.log(frame);
          setInterval(sendMessage, 2000);

          stompSubscribe()
            .then(null, null, function (res){
                console.log('received:' + res.body);
            });
        })
        .catch(function (error) {
          // Handle any error from all above steps
          console.error('You had an error: ', error.stack);
          stompClient.disconnect(function (){
            console.log('Restart!');
            startPrompt();
          });
        })
        .done(function() {

        });
  });
};

prompt.start();
startPrompt();



