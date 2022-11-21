const userRouter = require("express").Router();

const {
  getUsers,
  getUserByUserId,
  postUser,
  patchUser,
  getGamesByUserId,
  getEventsByUserId,
  postGameToUserGames,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(postUser);
userRouter.route("/:user_id").get(getUserByUserId).patch(patchUser);
userRouter
  .route("/:user_id/games")
  .get(getGamesByUserId)
  .post(postGameToUserGames);
userRouter.get("/:user_id/events", getEventsByUserId);

module.exports = userRouter;
