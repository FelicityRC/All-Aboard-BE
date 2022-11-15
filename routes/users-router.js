const userRouter = require("express").Router();

const {
  getUsers,
  getUserByUserId,
  postUser,
  patchUser,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(postUser);
userRouter.route("/:user_id").get(getUserByUserId).patch(patchUser);

module.exports = userRouter;
