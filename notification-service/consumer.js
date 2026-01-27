import amqp from "amqplib";
import { Server } from "socket.io";
import http from "http";

const app = http.createServer();
const io = new Server(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3001;

io.on("connection", (socket) => {
  console.log("Client connected to WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected from WebSocket:", socket.id);
  });
});

async function consumeMessages() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();

    const exchangeName = "task_events";
    await channel.assertExchange(exchangeName, "fanout", { durable: false });

    const q = await channel.assertQueue("", { exclusive: true });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

    channel.bindQueue(q.queue, exchangeName, "");

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          const event = JSON.parse(msg.content.toString());
          if (event.eventName === "TaskCreated") {
            console.log(
              ` [x] Sending notification for Task ID: ${event.taskId} - ${event.metadata.title}`
            );
            io.emit("taskCreated", event);
          }
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Failed to consume messages:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  consumeMessages();
});