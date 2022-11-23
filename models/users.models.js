const db = require("../database/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};

exports.selectUserByUserId = (user_id) => {
  // this checks the user_id is a positive integer
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  return db
    .query(
      `SELECT users.*,
    JSON_AGG(
       DISTINCT jsonb_build_object('group_id', groups.group_id, 
                                  'name', groups.name)) AS groups, 
    JSON_AGG(
       DISTINCT jsonb_build_object('game_id', games.game_id, 
                                  'game_title', games.name)) AS games,
     JSON_AGG(
       DISTINCT jsonb_build_object('event_id', events.event_id, 
                                  'name', events.title,
                                  'organiser', userevents.organiser)) AS events
    FROM users
    LEFT JOIN usergames on users.user_id = usergames.user_id
    LEFT JOIN userevents on users.user_id = userevents.user_id
    LEFT JOIN usergroups on users.user_id = usergroups.user_id
    LEFT JOIN games on usergames.game_id = games.game_id
    LEFT JOIN events on userevents.event_id = events.event_id
    LEFT JOIN groups on usergroups.group_id = groups.group_id
    WHERE users.user_id = $1
    GROUP BY users.user_id;`,
      [user_id]
    )
    .then(({ rows: [user] }) => {
      if (user) {
        return user;
      } else {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
    });
};

exports.insertUser = (body) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!(body.uid && body.username && body.location)) {
    return Promise.reject({ status: 400, msg: "Missing Required Fields" });
  }

  return db
    .query(
      `INSERT INTO users
    (uid, username, location)
    VALUES
    ($1, $2, $3)
    RETURNING *`,
      [body.uid, body.username, body.location]
    )
    .then(({ rows: [user] }) => {
      return user;
    });
};

exports.insertGameToUserGames = (user_id, game_id) => {
  return db
    .query(
      `
      INSERT INTO userGames (user_id, game_id) 
      SELECT $1, $2
      WHERE NOT EXISTS (SELECT user_id, game_id from userGames WHERE user_id = $1 AND game_id = $2)
      RETURNING *;
    `,
      [game_id, user_id]
    )
    .then(({ rows: [userGame] }) => {
      return userGame;
    });
};

exports.updateUser = (user_id, body) => {
  // this checks the user_id is a positive integer
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  if (!body || Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const validKeys = ["username", "location", "inc_games", "out_games"];

  const keys = Object.keys(body);

  let queryString = `UPDATE users SET `;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      queryString += `${key}='${body[key]}', `;
    }
  }

  queryString = queryString.slice(0, -2);
  queryString += ` WHERE user_id=$1 RETURNING *`;

  return db.query(queryString, [user_id]).then(({ rows: [user] }) => {
    return user;
  });
};

exports.selectGamesByUserId = (user_id) => {
  // below checks that the user_id is a positive integer
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  return db
    .query(
      `SELECT games.*
FROM games
LEFT JOIN userGames ON games.game_id = userGames.game_id
WHERE user_id = $1;`,
      [user_id]
    )
    .then(({ rows: games }) => {
      return games;
    });
};

exports.selectEventsByUserId = (user_id) => {
  // below checks that the user_id is a positive integer
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  return db
    .query(
      `SELECT events.*
    FROM events
    LEFT JOIN userEvents ON events.event_id = userEvents.event_id
    WHERE user_id = $1;`,
      [user_id]
    )
    .then(({ rows: events }) => {
      return events;
    });
};

exports.checkUser = (user_id) => {
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  return db
    .query(
      `
    SELECT * FROM users
    WHERE user_id = $1
    `,
      [user_id]
    )
    .then(({ rows: [user] }) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
    });
};

exports.selectUserIdByUID = (UID) => {
  return db
    .query(
      `
      SELECT user_id FROM users
      WHERE uid = $1`,
      [UID]
    )
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "UID Not Found" });
      }
      return res.rows[0].user_id;
    });
};
