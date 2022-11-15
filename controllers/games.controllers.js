const { selectGames } = require("../models/games.models");

exports.getGames = (req, res, next) => {
  selectGames().then((games) => {
    res.status(200).send({ games });
  });
};
