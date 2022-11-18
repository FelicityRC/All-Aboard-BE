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
    .query(`SELECT users.*, ARRAY_AGG(DISTINCT games.name) as games, 
    ARRAY_AGG(DISTINCT games.game_id) as games_id, 
    ARRAY_AGG(DISTINCT groups.group_id) as group_id, 
    ARRAY_AGG(DISTINCT groups.name) as group_name, 
    ARRAY_AGG(DISTINCT events.event_id) as event_id,
    ARRAY_AGG(DISTINCT events.title) as events
    FROM users
    JOIN usergames on users.user_id = usergames.user_id
    JOIN userevents on users.user_id = userevents.user_id
    JOIN usergroups on users.user_id = usergroups.user_id
    JOIN games on usergames.game_id = games.game_id
    JOIN events on userevents.event_id = events.event_id
    JOIN groups on usergroups.group_id = groups.group_id
    WHERE users.user_id = $1
    GROUP BY users.user_id;`, [user_id])
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

  if (!(body.username && body.name && body.email && body.location)) {
    return Promise.reject({ status: 400, msg: "Missing Required Fields" });
  }

  return db
    .query(
      `INSERT INTO users
    (username, name, email, location)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *`,
      [body.username, body.name, body.email, body.location]
    )
    .then(({ rows: [user] }) => {
      return user;
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

  const validKeys = [
    "username",
    "name",
    "email",
    "location",
    "fav_games",
    "friends",
    "inc_games",
    "inc_friends",
    "out_games",
    "out_friends",
  ];

  const keys = Object.keys(body);

  let queryString = `UPDATE users SET `;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      if (key === "fav_games" || key === "friends") {
        queryString += `${key}='{${body[key]}}', `;
      } else if (key === "inc_games") {
        queryString += `fav_games=ARRAY_CAT(fav_games, ARRAY[${body["inc_games"]}]), `;
      } else if (key === "inc_friends") {
        queryString += `friends=ARRAY_CAT(friends, ARRAY[${body["inc_friends"]}]), `;
      } else if (key === "out_games") {
        queryString += `fav_games=(SELECT ARRAY(SELECT UNNEST(fav_games) EXCEPT SELECT UNNEST('{${body["out_games"]}}'::INT[]))), `;
      } else if (key === "out_friends") {
        queryString += `friends=(SELECT ARRAY(SELECT UNNEST(friends) EXCEPT SELECT UNNEST('{${body["out_friends"]}}'::INT[]))), `;
      } else {
        queryString += `${key}='${body[key]}', `;
      }
    }
  }

  queryString = queryString.slice(0, -2);
  queryString += ` WHERE user_id=${user_id} RETURNING *`;

  return db.query(queryString).then(({ rows: [user] }) => {
    if (user) {
      return user;
    } else {
      return Promise.reject({ status: 404, msg: "User Not Found" });
    }
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
    .query(`SELECT * FROM users WHERE user_id=$1`, [user_id])
    .then(({ rows: [user] }) => {
      if (user) {
        let queryString = `SELECT * FROM games WHERE `;
        for (const game_id of user.fav_games) {
          queryString += `game_id=${game_id} OR `;
        }
        queryString = queryString.slice(0, -3);
        return db.query(queryString).then(({ rows: games }) => {
          return games;
        });
      } else {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
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
    .query(`SELECT * FROM events WHERE $1=ANY(guests)`, [user_id])
    .then(({ rows: events }) => {
      return events;
    });
};
