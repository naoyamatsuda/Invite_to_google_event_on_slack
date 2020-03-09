require("dotenv").config();

const constObj = { SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET };

Object.freeze(constObj);

module.exports = constObj;
