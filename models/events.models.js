const db = require("../database/connection");

exports.selectEvents = () => {
  return db
    .query(
      `
      SELECT events.*, 
      ARRAY_AGG(DISTINCT games.name) AS games, 
      COUNT(userEvents.user_id) ::INT AS guests,
      (SELECT username
    FROM userEvents
    LEFT JOIN users ON users.user_id = userEvents.user_id
    WHERE userEvents.organiser = true
    AND events.event_id = userEvents.event_id) AS organiser
      FROM events
      LEFT JOIN eventGames ON events.event_id = eventGames.event_id
      LEFT JOIN games ON games.game_id = eventGames.game_id
      LEFT JOIN userEvents ON events.event_id = userEvents.event_id
      LEFT JOIN users ON users.user_id = userEvents.user_id
      GROUP BY events.event_id;
  `
    )
    .then(({ rows: events }) => {
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
    .query(
      `
      SELECT events.*, 
      (SELECT users.username
      FROM events
      JOIN userEvents ON events.event_id = userEvents.event_id
      JOIN users ON users.user_id = userEvents.user_id
      WHERE userEvents.organiser = true
      AND events.event_id = $1) AS organiser,
          ARRAY_AGG(DISTINCT games.name) AS games,
      JSON_AGG(
             DISTINCT jsonb_build_object('user_id', users.user_id, 
                                        'username', users.username)) AS guests
      FROM events
      LEFT JOIN eventGames ON events.event_id = eventGames.event_id
      LEFT JOIN games ON games.game_id = eventGames.game_id
      LEFT JOIN userEvents ON events.event_id = userEvents.event_id
      LEFT JOIN users ON users.user_id = userEvents.user_id
      WHERE events.event_id = $1
      GROUP BY events.event_id;
    `,
      [event_id]
    )
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
    .query(
      `
      SELECT users.* 
      FROM userEvents
      JOIN users ON userEvents.user_id = users.user_id
      WHERE event_id=$1;`,
      [event_id]
    )
    .then(({ rows: users }) => {
      return users;
    });
};
exports.selectGamesByEventId = (event_id) => {
  const num = Number(event_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "event_id must be a positive integer",
    });
  }

  return db
    .query(
      `
      SELECT games.* 
      FROM eventGames
      JOIN games ON eventGames.game_id = games.game_id
      WHERE event_id=$1;`,
      [event_id]
    )
    .then(({ rows: games }) => {
      return games;
    });
};

exports.insertEvent = (body) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (
    !(
      body.user_id &&
      body.title &&
      body.latitude &&
      body.longitude &&
      body.area &&
      body.date &&
      body.start_time
    )
  ) {
    return Promise.reject({ status: 400, msg: "Missing Required Fields" });
  }
  if (typeof body.user_id !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const user_id = body.user_id;
  delete body.user_id;

  const validKeys = [
    "title",
    "latitude",
    "longitude",
    "area",
    "date",
    "start_time",
    "description",
    "duration",
    "visibility",
    "willing_to_teach",
    "max_players",
  ];

  const keys = Object.keys(body);

  let queryString = `INSERT INTO events (`;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      queryString += key + ", ";
    }
  }
  queryString = queryString.slice(0, -2);
  queryString += `) VALUES (`;
  for (const key of keys) {
    queryString += `'${body[key]}', `;
  }
  queryString = queryString.slice(0, -2);
  queryString += `) RETURNING *;`;

  return Promise.all([db.query(queryString), user_id]).then((promises) => {
    const junctionUpdate =     `
    INSERT INTO userEvents
    (user_id, event_id, organiser)
    VALUES
    ($1, $2, true)
    RETURNING *;`
    return Promise.all([db.query(junctionUpdate, [user_id, promises[0].rows[0].event_id]), promises[0].rows[0]])
  }).then((promises) => {
    return promises[1]
  })
};

exports.insertUserToUserEvents = (user_id, event_id) => {
  return db
    .query(
      `
    INSERT INTO userEvents (user_id, event_id, organiser)
    SELECT $1, $2, false
    WHERE NOT EXISTS (SELECT user_id, event_id from userEvents WHERE user_id = $1 AND event_id = $2)
    RETURNING *;
    `,
      [user_id, event_id]
    )
    .then(({ rows: [userEvent] }) => {
      return userEvent;
    });
};
//
//

exports.insertGameToEventGames = (game_id, event_id) => {
  return db
    .query(
      `
      INSERT INTO eventGames (event_id, game_id) 
      SELECT $2, $1
      WHERE NOT EXISTS (SELECT event_id, game_id from eventGames WHERE event_id = $2 AND game_id = $1)
      RETURNING *;
      `,
      [game_id, event_id]
    )
    .then(({ rows: [eventGame] }) => {
      return eventGame;
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
    "visibility",
    "willing_to_teach",
    "max_players",
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

exports.removeEvent = (event_id) => {
  const num = Number(event_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "event_id must be a positive integer",
    });
  }

  return db
    .query(`DELETE FROM events WHERE event_id = $1`, [event_id])
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Event Not Found" });
      }
      return;
    });
};

exports.checkEvent = (event_id) => {
  const num = Number(event_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "event_id must be a positive integer",
    });
  }

  return db
    .query(
      `
    SELECT * FROM events
    WHERE event_id = $1;
    `,
      [event_id]
    )
    .then(({ rows: [event] }) => {
      if (!event) {
        return Promise.reject({ status: 404, msg: "Event Not Found" });
      }
    });
};
