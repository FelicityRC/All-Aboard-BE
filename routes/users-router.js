const userRouter = require("express").Router();

const {
  getUsers,
  getUserByUserId,
  postUser,
  patchUser,
  getGamesByUserId,
  getEventsByUserId,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(postUser);
userRouter.route("/:user_id").get(getUserByUserId).patch(patchUser);
userRouter.get("/:user_id/games", getGamesByUserId);
userRouter.get("/:user_id/events", getEventsByUserId);

module.exports = userRouter;
