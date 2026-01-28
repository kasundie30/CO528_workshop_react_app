This is a Task Management web application that utilizes an Event-Driven Architecture (EDA) with 
RabbitMQ for asynchronous communication and real-time notifications.


Tech stack:
    Express.js
    ReactJS
    MySql database
    RabbitMQ docker container
    Web sockets
    amqp Advanced Message Queuing Protocol
    
How to run :  
    Manually execute the SQL query to create a database. 
    Start the RabbitMQ container using docker-compose up -d in the root directory.
    Start the Notification Service by navigating to the notification-service directory and running npm start.
    Start the main server application by navigating to the server directory and running npm run dev.
    Start the UI by navigating to the client directory and running npm run dev.