const gameRouter = require("express").Router();

const { getGames } = require("../controllers/games.controllers");

gameRouter.get("/", getGames);

module.exports = gameRouter;
