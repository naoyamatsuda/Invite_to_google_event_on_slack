require("dotenv").config();

const constObj = {
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SLACK_TOKEN: process.env.SLACK_TOKEN
};

Object.freeze(constObj);

module.exports = constObj;
