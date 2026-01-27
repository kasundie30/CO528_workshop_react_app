import amqplib from "amqplib";

const EXCHANGE_NAME = "domain.events";
const QUEUE_NAME = "notifications.queue";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startConsumer() {
  const rabbitUrl = process.env.RABBIT_URL || "amqp://localhost";
  const connection = await amqplib.connect(rabbitUrl);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
  const { queue } = await channel.assertQueue(QUEUE_NAME, { durable: true });

  await channel.bindQueue(queue, EXCHANGE_NAME, "tasks.created");
  await channel.bindQueue(queue, EXCHANGE_NAME, "tasks.statusChanged");

  console.log("Consumer ready. Waiting for events...");

  channel.consume(queue, async (message) => {
    if (!message) return;

    try {
      const payload = JSON.parse(message.content.toString());
      console.log("EVENT RECEIVED", payload);
      await wait(3000);
      console.log("Notification done", payload.entityId);
      channel.ack(message);
    } catch (error) {
      console.error("Failed to process message", error);
      channel.nack(message, false, false);
    }
  });
}

startConsumer().catch((error) => {
  console.error("Consumer failed to start", error);
  process.exit(1);
});
