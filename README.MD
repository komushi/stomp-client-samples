# Stomp Client demos by node.js


----------
Download and Dependencies Installation
-------------
```
git clone https://github.com/komushi/stomp-client-samples
cd stomp-client-samples
npm install
```

###Stomp Demo 1 over WebSocket to a Spring Boot Application as WebSocket Broker
The Spring Boot Application Source Code:
https://github.com/komushi/spring-stomp-ws.git
```
node stomp-over-ws-spring.js
```

###Stomp Demo 2 over WebSocket to a RabbitMQ Instance as WebSocket Broker
```
node stomp-over-ws-rabbitmq.js
```

###Stomp Demo 3 over SockJS to a RabbitMQ Instance as SockJS Server
```
node stomp-over-sockjs-rabbitmq.js
```

###Stomp Demo 4 over SockJS to a Spring Boot Application as SockJS Server
####In fact the following code runs in browser only - not on node.js.
stomp-over-sockjs-spring.js
The Spring Boot Application Source Code:

###Stomp Demo 5 over SockJS to a RabbitMQ Instance as SockJS Server

Start Apollo
```
/usr/local/var/apollo/bin/apollo-broker run
```

Start the demo
```
node stomp-over-ws-apollo.js
```