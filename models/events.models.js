const db = require("../database/connection");

exports.selectEvents = () => {
  return db.query(`SELECT * FROM events`).then(({ rows: events }) => {
    return events;
  });
};
