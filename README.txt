Manually execute the SQL query to add the priority column to the tasks table in their database:
    ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'MEDIUM';

Start the RabbitMQ container using docker-compose up -d in the root directory.
Start the Notification Service by navigating to the notification-service directory and running npm start.
Start the main server application by navigating to the server directory and running npm start (or equivalent command for their setup).