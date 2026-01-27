import amqplib from "amqplib";

const EXCHANGE_NAME = "domain.events";
let channel;

export async function initEventBus() {
  const rabbitUrl = process.env.RABBIT_URL || "amqp://localhost";

  try {
    const connection = await amqplib.connect(rabbitUrl);
    connection.on("error", (err) => {
      console.warn("Event bus connection error", err?.message || err);
    });
    connection.on("close", () => {
      console.warn("Event bus connection closed");
    });

    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
    console.log("Event bus ready");
  } catch (error) {
    console.warn("Event bus init failed", error?.message || error);
  }
}

export function publishEvent(routingKey, payload) {
  if (!channel) {
    console.warn("Event bus channel not ready, dropping event", routingKey);
    return;
  }

  try {
    const message = Buffer.from(JSON.stringify(payload));
    channel.publish(EXCHANGE_NAME, routingKey, message, {
      persistent: true,
      contentType: "application/json",
    });
    console.log(`Event published ${routingKey} id=${payload.entityId}`);
  } catch (error) {
    console.warn("Failed to publish event", error?.message || error);
  }
}
