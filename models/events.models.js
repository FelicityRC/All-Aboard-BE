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
      JOIN games ON games.game_id = eventGames.game_id
      LEFT JOIN userEvents ON events.event_id = userEvents.event_id
      JOIN users ON users.user_id = userEvents.user_id
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
      RIGHT JOIN games ON games.game_id = eventGames.game_id
      LEFT JOIN userEvents ON events.event_id = userEvents.event_id
      RIGHT JOIN users ON users.user_id = userEvents.user_id
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
      RIGHT JOIN users ON userEvents.user_id = users.user_id
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
      RIGHT JOIN games ON eventGames.game_id = games.game_id
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
    "max_players"
  ];

  const keys = Object.keys(body);
  let functionString = `
  CREATE OR REPLACE FUNCTION insert_event()
      RETURNS TRIGGER
      LANGUAGE PLPGSQL
      AS
  $$
      BEGIN
        INSERT INTO userEvents(event_id, user_id, organiser)
        VALUES(NEW.event_id, ${user_id}, true);
        RETURN NULL;
      END;
  $$;

  CREATE OR REPLACE TRIGGER new_event
  AFTER INSERT
  on events
  FOR EACH ROW
  EXECUTE PROCEDURE insert_event();`;

  let queryString = `INSERT INTO events (`;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      if (key === "guests" || key === "games") {
        queryString += `${key}='{${body[key]}}', `;
      }
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

  return db.query(functionString).then(() => {
    return db.query(queryString);
  }).then(({rows: [event]}) => {
    return event
  })
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
    "inc_games",
    "inc_guests",
    "out_games",
    "out_guests",
  ];

  const keys = Object.keys(body);

  let queryString = `UPDATE events SET `;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      if (key === "games" || key === "guests") {
        queryString += `${key}='{${body[key]}}', `;
      } else if (key === "inc_games") {
        queryString += `games=ARRAY_CAT(games, ARRAY[${body["inc_games"]}]), `;
      } else if (key === "inc_guests") {
        queryString += `guests=ARRAY_CAT(guests, ARRAY[${body["inc_guests"]}]), `;
      } else if (key === "out_games") {
        queryString += `games=(SELECT ARRAY(SELECT UNNEST(games) EXCEPT SELECT UNNEST('{${body["out_games"]}}'::INT[]))), `;
      } else if (key === "out_guests") {
        queryString += `guests=(SELECT ARRAY(SELECT UNNEST(guests) EXCEPT SELECT UNNEST('{${body["out_guests"]}}'::INT[]))), `;
      } else {
        queryString += `${key}='${body[key]}', `;
      }
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
