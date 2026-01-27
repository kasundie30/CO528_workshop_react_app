const EVENT_BUS_URL = "http://localhost:6001/events";

export function publishHttpEvent(eventPayload) {
  try {
    const request = fetch(EVENT_BUS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
    });

    request.catch(() => {
      console.log("Consumer offline – event ignored");
    });
  } catch (error) {
    console.log("Consumer offline – event ignored");
  }
}
