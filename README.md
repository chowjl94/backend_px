# Using RabbitMq message broker and express for event-driven processing


### Objective
-Create a producer that publishes heartbeat messages to the heartbeat queue

-Create a consumer that subscribes to the heartbeat queue and writes the messages to a file log.txt (append-mode)

To send/Publish

-Every minute: “I’m alive at ${datetime}!”

-Every 42nd minute of the hour: “42 is the meaning to life!”

### Setup with docker
-run docker image 

##### docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management

-run the consumer 

##### npm run consume

-run the producer

##### npm run start

-view log.txt



view message queues at
http://localhost:15672


# Using Websockets to send heart beat messages to a client
### Objective create a websocket app that publishes 

To send/Publish

-Every minute: “I’m alive at ${datetime}!”

-Every 42nd minute of the hour: “42 is the meaning to life!”

#### Set up 

-to start app

##### node run ws 

to view client receiving message open client.html and view console for heatbeat messages

