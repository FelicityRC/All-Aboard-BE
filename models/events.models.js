const db = require("../database/connection");

exports.selectEvents = () => {
  return db.query(`SELECT * FROM events`).then(({ rows: events }) => {
    return events;
  });
};

exports.selectEventByEventId = (event_id) => {
  // below checks that the event_id is a positive number
  const num = Number(event_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "event_id must be a positive integer",
    });
  }

  return db
    .query(`SELECT * FROM events WHERE event_id=$1`, [event_id])
    .then(({ rows: [event] }) => {
      if (event) {
        return event;
      } else {
        return Promise.reject({ status: 404, msg: "Event Not Found" });
      }
    });
};
