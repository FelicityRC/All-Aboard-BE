const db = require("../database/connection");

exports.selectGames = () => {
  return db.query(`SELECT * FROM games`).then(({ rows: games }) => {
    return games;
  });
};
