const moment = require("moment-timezone");
const axios = require("axios");
const qs = require("querystring");

moment.tz.setDefault("Asia/Tokyo");
const { GOOGLE_API_BASE_URL } = require("./const");
const { readToken } = require("./oauth/token");
const { refreshToken } = require("./oauth/refresh");

const dateReg = /(\d{4}\/\d{2}\/\d{2})/g;

const createGoogleReqeustBase = async (
  method,
  endpoint,
  queryParam = {},
  token
) => {
  const convertedQueryParam = Object.keys(queryParam).length
    ? `?${qs.stringify(queryParam)}`
    : "";
  return {
    method,
    url: `${GOOGLE_API_BASE_URL}${endpoint}${convertedQueryParam}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

const fetchEvent = reqConfig => async (token = {}) => {
  const mergedToken = {
    ...reqConfig.headers,
    headers: { Authorization: `Bearer ${token.access_token}` }
  };

  const mergedReqConf = { ...reqConfig, ...mergedToken };

  const response = await axios
    .request(mergedReqConf)
    .then(res => {
      return res.data;
    })
    .catch(async e => {
      if (e.response.status !== 401) throw new Error(e.response.data);
      const callbackResult = await refreshToken(
        token,
        fetchEvent(mergedReqConf)
      );
      return callbackResult;
    });
  return response;
};

// module.exports.inviteCalendar = async message => {
const app = async () => {
  const date = "2020/05/20";
  // const date = message.match(dateReg);

  if (!date) throw Error(`Not Found date in ${dateReg} format`);

  const momentDate = moment(date, "YYYY/MM/DD").clone();
  const startDate = momentDate.clone().format();
  const endDate = momentDate
    .clone()
    .add(1, "day")
    .format();

  const token = await readToken().catch(e => console.log(e));
  const reqConfig = await createGoogleReqeustBase(
    "GET",
    `/calendars/primary/events`,
    {
      q: "LT大会",
      timeMin: startDate,
      timeMax: endDate
    },
    token.access_token
  );

  const response = await fetchEvent(reqConfig)(token);

  if (!response.items.length) throw new Error("not found event");
  if (response.items.length > 1) throw new Error("Multiple event found");

  return;
};

module.exports = app();
