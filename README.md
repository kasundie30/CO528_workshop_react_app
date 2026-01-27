# Event-driven task app

This repo contains a React frontend, an Express backend, and a RabbitMQ consumer used for event-driven lab requirements.

## Requirements

- Node.js
- MySQL
- RabbitMQ (Docker recommended)

## Environment variables

Set the following in your backend `.env`:

```
RABBIT_URL=amqp://localhost
```

## Run RabbitMQ

```bash
docker run -it --rm --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Start the backend

```bash
cd server
npm i
npm run dev
```

## Start the consumer (separate terminal)

```bash
cd consumer
npm i
node index.js
```

## Start the frontend

```bash
cd client
npm i
npm run dev
```

## Verify event-driven flow

1. Stop the consumer and create tasks; the API should still work.
2. Start the consumer and create a task; the backend responds immediately and the consumer logs completion ~3 seconds later.

The backend publishes `TaskCreated` on `tasks.created` and `TaskStatusChanged` on `tasks.statusChanged` after DB commits.
