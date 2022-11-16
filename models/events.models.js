const db = require("../database/connection");

exports.selectEvents = () => {
  return db.query(`SELECT * FROM events`).then(({ rows: events }) => {
    return events;
  });
};

exports.selectEventByEventId = (event_id) => {

  // below checks that the event_id is a positive integer

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

exports.selectUsersByEventId = (event_id) => {
  // below checks that the event_id is a positive integer
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
        let queryString = `SELECT * FROM users WHERE `;
        for (const guest_id of event.guests) {
          queryString += `user_id=${guest_id} OR `;
        }
        queryString = queryString.slice(0, -3);
        return db.query(queryString).then(({ rows: users }) => {
          return users;
        });
      } else {
        return Promise.reject({ status: 404, msg: "Event Not Found" });
      }
    });
};
exports.insertEvent = (body) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (
    !(
      body.title &&
      body.latitude &&
      body.longitude &&
      body.area &&
      body.date &&
      body.start_time &&
      body.organiser
    )
  ) {
    return Promise.reject({ status: 400, msg: "Missing Required Fields" });
  }

  return db
    .query(
      `INSERT INTO events (title, latitude, longitude, area, date, start_time, organiser) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        body.title,
        body.latitude,
        body.longitude,
        body.area,
        body.date,
        body.start_time,
        body.organiser,
      ]
    )
    .then(({ rows: [event] }) => {
      return event;
    });
};

exports.updateEvent = (event_id, body) => {
  // this checks the user_id is a positive integer
  const num = Number(event_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "event_id must be a positive integer",
    });
  }

  if (!body || Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const validKeys = [
    "title",
    "description",
    "longitude",
    "latitude",
    "area",
    "date",
    "start_time",
    "duration",
    "organiser",
    "guest",
    "games",
    "visibility",
    "willing_to_teach",
  ];

  const keys = Object.keys(body);

  let queryString = `UPDATE events SET `;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      queryString += `${key}='${body[key]}', `;
    }
  }

  queryString = queryString.slice(0, -2);
  queryString += ` WHERE event_id=${event_id} RETURNING *`;

  return db.query(queryString).then(({ rows: [event] }) => {
    if (event) {
      return event;
    } else {
      return Promise.reject({ status: 404, msg: "Event Not Found" });
    }
  });
};
