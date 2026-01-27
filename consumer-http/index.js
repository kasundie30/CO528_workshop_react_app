import express from "express";

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const eventPayload = req.body;
  console.log("Consumer received event payload:", eventPayload);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log(
    `Consumer finished processing ${eventPayload.eventName} ${eventPayload.entityId}`
  );

  res.sendStatus(200);
});

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Consumer HTTP service running on port ${port}`);
});
