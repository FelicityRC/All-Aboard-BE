const { selectGames, selectGameByGameId } = require("../models/games.models");

exports.getGames = (req, res, next) => {
  selectGames().then((games) => {
    res.status(200).send({ games });
  });
};

exports.getGameByGameId = (req, res, next) => {
  const gameId = req.params.game_id;

  selectGameByGameId(gameId)
    .then((game) => {
      res.status(200).send({ game });
    })
    .catch((err) => {
      next(err);
    });
};
