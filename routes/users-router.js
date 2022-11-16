const userRouter = require("express").Router();

const {
  getUsers,
  getUserByUserId,
  postUser,
  patchUser,
  getGamesByUserId,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(postUser);
userRouter.route("/:user_id").get(getUserByUserId).patch(patchUser);
userRouter.get("/:user_id/games", getGamesByUserId);

module.exports = userRouter;
