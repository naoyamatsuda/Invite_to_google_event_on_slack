const express = require("express");
const { createEventAdapter } = require("@slack/events-api");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);

const app = express();

app.use("/receive/slack_event", slackEvents.requestListener());

app.use(express.json());

slackEvents.on("error", error => {
  console.error(error);
});

app.listen(port, () => {
  console.log(`Listening for events on ${port}`);
});
