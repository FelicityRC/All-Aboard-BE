const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
  const { userData, gameData, eventData, groupData } = data;

  await db.query(`DROP TABLE IF EXISTS events;`);
  await db.query(`DROP TABLE IF EXISTS groups`);
  await db.query(`DROP TABLE IF EXISTS games;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  await db.query(`
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL,
            name VARCHAR,
            email VARCHAR NOT NULL,
            location VARCHAR,
            friends INT[] DEFAULT ARRAY[]::INT[],
            fav_games INT[] DEFAULT ARRAY[]::INT[]
        );`);

  // check best way to store date/time

  await db.query(`
        CREATE TABLE events (
            event_id SERIAL PRIMARY KEY,
            title VARCHAR NOT NULL,
            description VARCHAR,
            latitude NUMERIC NOT NULL,
            longitude NUMERIC NOT NULL,
            area VARCHAR,
            date DATE DEFAULT NOW(),
            start_time TIME NOT NULL,
            duration INT,
            organiser INT NOT NULL REFERENCES users(user_id),
            visibility BOOLEAN DEFAULT true,
            willing_to_teach BOOLEAN DEFAULT false,
            guests INT[] DEFAULT ARRAY[]::INT[],
            games INT[] DEFAULT ARRAY[]::INT[]
        );`);

  await db.query(`
        CREATE TABLE games (
            game_id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            description VARCHAR,
            image_url VARCHAR,
            min_players INT,
            max_players INT,
            rules_url VARCHAR
        );`);

  await db.query(`
        CREATE TABLE groups (
            group_id SERIAL PRIMARY KEY,
            organiser INT NOT NULL,
            name VARCHAR NOT NULL,
            users INT[] DEFAULT ARRAY[]::INT[],
            events INT[] DEFAULT ARRAY[]::INT[]
        )`);

  const insertUsersQueryStr = format(
    "INSERT INTO users (username, name, email, location, fav_games, friends) VALUES %L RETURNING *;",
    userData.map(({ username, name, email, location, fav_games, friends }) => [
      username,
      name,
      email,
      location,
      "{" + fav_games + "}",
      "{" + friends + "}",
    ])
  );

  await db.query(insertUsersQueryStr).then((result) => result.rows);

  const insertGamesQueryStr = format(
    "INSERT INTO games (name, description, image_url, min_players, max_players, rules_url) VALUES %L RETURNING *;",
    gameData.map(
      ({
        name,
        description,
        image_url,
        min_players,
        max_players,
        rules_url,
      }) => [name, description, image_url, min_players, max_players, rules_url]
    )
  );

  await db.query(insertGamesQueryStr).then((result) => result.rows);

  const insertEventsQueryStr = format(
    "INSERT INTO events (title, description, latitude, longitude, area, date, start_time, duration, organiser, visibility, willing_to_teach, guests, games) VALUES %L RETURNING *;",
    eventData.map(
      ({
        title,
        description,
        latitude,
        longitude,
        area,
        date,
        start_time,
        duration,
        organiser,
        visibility,
        willing_to_teach,
        guests,
        games,
      }) => [
        title,
        description,
        latitude,
        longitude,
        area,
        date,
        start_time,
        duration,
        organiser,
        visibility,
        willing_to_teach,
        "{" + guests + "}",
        "{" + games + "}",
      ]
    )
  );

  await db.query(insertEventsQueryStr).then((result) => result.rows);

  const insertGroupsQueryStr = format(
    `INSERT INTO groups (organiser, name, users, events) VALUES %L RETURNING *`,
    groupData.map(({ organiser, name, users, events }) => [
      organiser,
      name,
      "{" + users + "}",
      "{" + events + "}",
    ])
  );

  await db.query(insertGroupsQueryStr).then((result) => result.rows);
};

module.exports = seed;
