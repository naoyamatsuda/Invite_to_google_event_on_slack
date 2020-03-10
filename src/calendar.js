const moment = require("moment");

const dateReg = /(\d{4}\/\d{2}\/\d{2})/g;

module.exports.inviteCalendar = message => {
  const date = message.match(dateReg);

  if (!date) throw Error(`Not Found date in ${dateReg} format`);

  const formattedDate = moment(date);
  console.log(formattedDate);
};
