const express = require("express");
const { createEventAdapter } = require("@slack/events-api");
const { WebClient } = require("@slack/web-api");
const { SLACK_SIGNING_SECRET, SLACK_TOKEN } = require("./const");

const port = process.env.PORT || 3000;

const web = new WebClient(SLACK_TOKEN);

const slackEvents = createEventAdapter(SLACK_SIGNING_SECRET);

const app = express();

app.use("/receive/slack_event", slackEvents.requestListener());
app.use(express.json());

slackEvents.on("reaction_added", async event => {
  web.conversations
    .history({
      channel: event.item.channel,
      latest: event.item.ts,
      limit: 1,
      inclusive: true
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
});
slackEvents.on("reaction_removed", event => console.log(event));
slackEvents.on("error", error => console.error(error));

app.listen(port, () => console.log(`Listening for events on ${port}`));
