const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
  const {
    userData,
    gameData,
    eventData,
    groupData,
    userEventData,
    userGameData,
    eventGameData,
    userGroupData,
  } = data;

  await db.query(`DROP TABLE IF EXISTS userGroups;`);
  await db.query(`DROP TABLE IF EXISTS userGames;`);
  await db.query(`DROP TABLE IF EXISTS eventGames;`);
  await db.query(`DROP TABLE IF EXISTS userEvents;`);
  await db.query(`DROP TABLE IF EXISTS events;`);
  await db.query(`DROP TABLE IF EXISTS groups`);
  await db.query(`DROP TABLE IF EXISTS games;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

    await db.query(`
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            uid VARCHAR NOT NULL,
            username VARCHAR NOT NULL,
            location VARCHAR
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
            visibility BOOLEAN DEFAULT true,
            willing_to_teach BOOLEAN DEFAULT false,
            max_players INT
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
            name VARCHAR NOT NULL            
        )`);

//   // junction tables

  await db.query(`
        CREATE TABLE userEvents (
          userEvents_id SERIAL PRIMARY KEY NOT NULL,
          user_id INT REFERENCES users(user_id) NOT NULL,
          event_id INT REFERENCES events(event_id) NOT NULL,
          organiser BOOLEAN NOT NULL
        )`);

  await db.query(`
        CREATE TABLE eventGames (
          eventGames_id SERIAL PRIMARY KEY NOT NULL,
          event_id INT REFERENCES events(event_id) NOT NULL,
          game_id INT REFERENCES games(game_id) NOT NULL
        )`);

  await db.query(`
        CREATE TABLE userGames (
          userGames_id SERIAL PRIMARY KEY NOT NULL,
          user_id INT REFERENCES users(user_id) NOT NULL,
          game_id INT REFERENCES games(game_id) NOT NULL
        )`);

  await db.query(`
        CREATE TABLE userGroups (
          userGroups_id SERIAL PRIMARY KEY NOT NULL,
          user_id INT REFERENCES users(user_id) NOT NULL,
          group_id INT REFERENCES groups(group_id) NOT NULL,
          organiser BOOLEAN NOT NULL
        )`);

  const insertUsersQueryStr = format(
    "INSERT INTO users (uid, username, location ) VALUES %L RETURNING *;",
    userData.map(({ uid, username, location }) => [
      uid,
      username,
      location,
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
    "INSERT INTO events (title, description, latitude, longitude, area, date, start_time, duration, visibility, willing_to_teach, max_players) VALUES %L RETURNING *;",
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
        visibility,
        willing_to_teach,
        max_players
      }) => [
        title,
        description,
        latitude,
        longitude,
        area,
        date,
        start_time,
        duration,
        visibility,
        willing_to_teach,
        max_players
      ]
    )
  );

  await db.query(insertEventsQueryStr).then((result) => result.rows);

  const insertGroupsQueryStr = format(
    `INSERT INTO groups (name) VALUES %L RETURNING *`,
    groupData.map(({ name }) => [
     name,
    ])
  );

  await db.query(insertGroupsQueryStr).then((result) => result.rows);

   const insertUserEventQueryStr = format(
    `INSERT INTO userEvents (user_id, event_id, organiser) VALUES %L RETURNING *`,
    userEventData.map(({ user_id, event_id, organiser }) => [
      user_id,
      event_id,
      organiser,
    ])
   )

  await db.query(insertUserEventQueryStr).then((result) => result.rows);

  const insertUserGameQueryStr = format(
    `INSERT INTO userGames (user_id, game_id) VALUES %L RETURNING *`,
    userGameData.map(({ user_id, game_id }) => [
      user_id,
      game_id,
    ])
  );

  await db.query(insertUserGameQueryStr).then((result) => result.rows);

  const insertEventGameQueryStr = format(
    `INSERT INTO eventGames (event_id, game_id) VALUES %L RETURNING *`,
    eventGameData.map(({ event_id, game_id }) => [
      event_id,
      game_id,
    ])
  );

  await db.query(insertEventGameQueryStr).then((result) => result.rows);

  const insertUserGroupQueryStr = format(
    `INSERT INTO userGroups (user_id, group_id, organiser) VALUES %L RETURNING *`,
    userGroupData.map(({ user_id, group_id, organiser }) => [
      user_id,
      group_id,
      organiser,
    ])
  );

  await db.query(insertUserGroupQueryStr).then((result) => result.rows);

};

module.exports = seed;
