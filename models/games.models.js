const db = require("../database/connection");

exports.selectGames = () => {
  return db.query(`SELECT * FROM games`).then(({ rows: games }) => {
    return games;
  });
};

exports.selectGameByGameId = (game_id) => {
  // this checks the game_id is a positive integer
  const num = Number(game_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "game_id must be a positive integer",
    });
  }

  return db
    .query(`SELECT * FROM games WHERE game_id=$1`, [game_id])
    .then(({ rows: [game] }) => {
      if (game) {
        return game;
      } else {
        return Promise.reject({ status: 404, msg: "Game Not Found" });
      }
    });
};
