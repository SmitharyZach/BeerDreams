const { DateTime } = require("luxon");

const getPastDate = (years) => {
  let date = DateTime.local()
    .setZone("America/New_York")
    .minus({ years: years })
    .toFormat("ccc, dd LLL yyyy");
  return date;
};

console.log(getPastDate(4));
