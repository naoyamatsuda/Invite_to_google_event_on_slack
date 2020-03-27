require("dotenv").config();

const constObj = {
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  GOOGLE_API_BASE_URL: "https://www.googleapis.com/calendar/v3"
};

Object.freeze(constObj);

module.exports = constObj;
