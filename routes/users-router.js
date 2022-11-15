const userRouter = require("express").Router();

const {
  getUsers,
  getUserByUserId,
  postUser,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(postUser);
userRouter.get("/:user_id", getUserByUserId);

module.exports = userRouter;
