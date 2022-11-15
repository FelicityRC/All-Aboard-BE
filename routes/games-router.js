const gameRouter = require("express").Router();

const {
  getGames,
  getGameByGameId,
} = require("../controllers/games.controllers");

gameRouter.get("/", getGames);
gameRouter.get("/:game_id", getGameByGameId);

module.exports = gameRouter;
