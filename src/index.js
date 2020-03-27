const express = require("express");
const { createEventAdapter } = require("@slack/events-api");
const { WebClient } = require("@slack/web-api");
const { SLACK_SIGNING_SECRET, SLACK_TOKEN } = require("./const");
const { inviteCalendar } = require("./calendar");

const port = process.env.PORT || 3000;

const web = new WebClient(SLACK_TOKEN);

const slackEvents = createEventAdapter(SLACK_SIGNING_SECRET);

const app = express();

app.use("/receive/slack_event", slackEvents.requestListener());
app.use(express.json());

slackEvents.on("reaction_added", async event => {
  const { messages } = await web.conversations
    .history({
      channel: event.item.channel,
      latest: event.item.ts,
      limit: 1,
      inclusive: true
    })
    .then(res => res)
    .catch(err => {
      console.error(err);
      throw err;
    });

  const { text, user } = messages[0];

  const {
    user: {
      profile: { email }
    }
  } = web.users
    .info({ user })
    .then(res => res)
    .catch(err => {
      console.error(err);
      throw err;
    });

  inviteCalendar(text, email);
});
slackEvents.on("reaction_removed", event => console.log(event));
slackEvents.on("error", error => console.error(error));

app.listen(port, () => console.log(`Listening for events on ${port}`));
