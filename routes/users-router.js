const userRouter = require("express").Router();

const {
  getUsers,
  getUserByUserId,
} = require("../controllers/users.controllers");

userRouter.get("/", getUsers);
userRouter.get("/:user_id", getUserByUserId);

module.exports = userRouter;
